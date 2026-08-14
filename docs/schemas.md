# Brand Portal Schemas

Data model for the brand & sales resource portal. A mock HTTP backend serves
these shapes today (see below); each maps 1:1 to the future Firebase
integration ("Define Brand Portal Schemas" task).

## Mock HTTP backend

By default (`NEXT_PUBLIC_USE_MOCK_BRAND_API` unset/false) the client talks to
`app/api/*` route handlers over HTTP, backed by one seeded in-memory store per
server process (`brand-assets-server-services.ts`,
`user-management-user-server-services.ts` — globalThis-cached, reset on server
restart). Admin changes are therefore visible to every tab and enforced by the
download routes. Setting the flag to `true` opts back into the old in-browser
mock repositories.

| Endpoint | Methods | Gate |
|---|---|---|
| `/api/assets` | GET list (category/visibilities/includeArchived) · POST create | GET viewer-scoped; POST admin |
| `/api/assets/[id]` | GET · PATCH (update or `{archived}`) · DELETE | GET viewer-scoped; writes admin |
| `/api/asset-groups` | POST publish one artwork as N format records | admin |
| `/api/asset-groups/[groupId]` | PATCH (shared metadata + `addFiles`/`removeAssetIds`, or `{archived}`) · DELETE | admin |
| `/api/brand-download/[id]` | GET one file as an attachment | asset's live visibility |
| `/api/brand-bundle/[groupId]` | GET every format of a group as one zip | all members must be `public` |
| `/api/users` | GET list · POST invite | admin |
| `/api/users/[id]` | PATCH (`{role}` or `{status}`) · DELETE | admin |
| `/api/users/lookup?email=` | GET (role resolution) | signed-in |
| `/api/uploads` | POST multipart (`file`, `category`) → `AssetFile`, one file per call | admin |
| `/api/uploads/[id]` | GET bytes for admin-uploaded files | owning asset's visibility |
| `/api/sales-files/[id]` | GET bytes for private-location seed files | asset's live visibility |

The viewer's role is resolved server-side from the httpOnly presence cookie +
`KBrandSessionEmail` cookie (set at login; in platform mode the email comes
from the verified Firebase token) → directory lookup. JSON error payloads are
`{ "error": "<i18n key>" }` (one `jsonError` helper in `lib/api/viewer.ts`),
rethrown client-side as `Error(message)` so the hooks' existing key matching
keeps working. The byte and session routes (`brand-download`, `brand-bundle`,
`sales-files`, `auth/session`) bypass the helper and still answer in English
prose — harmless while nothing renders those bodies, but they should move onto
the helper before anything does. Prototype trust model — in
isolated mode the login flow self-reports the email after a real Firebase
sign-in; production replaces this with verified custom claims.

There is no group *read* endpoint: listings still fetch flat `BrandAsset[]` from
`/api/assets` and collapse them with `groupBrandAssets()` in the UI, so gating
and filtering stay per-file and grouping stays a pure derivation. Group *writes*
are their own endpoints because a per-file write would let an artwork's formats
drift apart (see "Artwork groups" below).

## Firestore mapping

| Domain model | Firestore | Notes |
|---|---|---|
| `BrandAsset` | `assets/{id}` | One document per **file**; `file.storagePath` points at the Storage object |
| `AssetGroup` | — | Derived, never stored: `groupBrandAssets()` folds documents sharing `groupId` |
| `PortalUser` | `users/{uid}` | Keyed by Firebase Auth uid; mock uses seed ids + email matching |

`groupId` needs a Firestore index once listings page — the catalog reads every
asset today and groups in memory, which is fine at catalog scale but is the
first thing to change under pagination (a page boundary must not split a group).

Timestamps are ISO strings in the domain; the Firestore mapper converts
`Timestamp` ⇄ ISO at the infrastructure seam
(`contexts/*/infrastructure/*/mappers`).

## Users & roles

`contexts/user-management/user/domain/models/portal-user.model.ts`

- **Roles**: `employee` (sales resources) · `admin` (assets + user management).
  Public visitors have no record and no session.
- **Viewer roles** (`contexts/shared/domain/viewer-role.ts`): the effective
  role of whoever is looking — `public` (logged out) | `employee` | `admin`.
  `contexts/brand-assets/domain/services/asset-access.ts` is the single source
  of truth for what each viewer role may see and do:
  - `public` — views/downloads `public`-visibility assets only; no Sales
    section, no gating badges.
  - `employee` — additionally views/downloads `employee`-visibility assets and
    the Sales section; sees each asset's gating but cannot change it.
  - `admin` — everything above, plus add/remove assets, set per-asset gating,
    and manage users & permissions.
- **Status**: `active` · `invited` (record created, first sign-in pending) ·
  `disabled` (access revoked — resolves to no portal access even if the
  Firebase account still authenticates).
- Identity fields: `displayName`, `email`; audit: `createdAt`, `updatedAt`,
  `lastLoginAt?`.
- Session resolution: signed-in Firebase user → directory lookup by email →
  role. Unknown authenticated emails default to `employee`
  (`PortalUserDirectoryService.resolveByEmail`). In production this becomes a
  custom-claims check enforced by Firestore security rules.

## Assets & categories

`contexts/brand-assets/domain/models/`

- **Controlled categories** (flat, no folders by design):
  `brand-guidelines`, `logos`, `brand-imagery`, `fonts` (browsed publicly) ·
  `pitch-decks`, `sales-materials` (the Sales section, hidden from anonymous
  visitors).
- **Visibility** (role gating, independent of where the bytes live): `public`
  (anonymous view + download) · `employee` (session required; enforced by
  middleware for pages and by `/api/brand-download/[id]`,
  `/api/sales-files/[id]`, `/api/uploads/[id]`, `/api/brand-bundle/[groupId]`
  for bytes). Category is **not** independent of it: `pitch-decks` and
  `sales-materials` resolve to `employee` whatever the caller asks for
  (`resolveVisibilityForCategory`, run by every create and edit path). It is an
  invariant, not a default: sales collateral cannot be exposed by moving an
  asset into a sales category, nor by editing a sales asset's gating afterwards.
  Every other category starts `public`; admins re-gate per asset from Manage
  assets. Gating changes live in the mock HTTP backend's server-side store, so
  the download routes enforce the *live* visibility.
- **Status**: `active` · `archived` (hidden from every listing, kept for
  admins).
- **File metadata** (`AssetFile`): `fileName`, `contentType`, `sizeBytes`,
  `storagePath` (future Storage object path), `downloadUrl` (whatever serves
  the bytes today: static public file, gated API route, or `/api/uploads/[id]`
  for fresh admin uploads held in server memory).
- **Group fields** (all optional, all denormalized — see below): `groupId`,
  `groupTitle`, `groupDescription`.
- Audit: `createdAt`, `updatedAt`, `createdBy` (PortalUser id). Optional
  `previewUrl` + `tags`.

## Artwork groups (multiple formats per asset)

`contexts/brand-assets/domain/services/asset-grouping.ts`

One artwork ships in several encodings — a logo as PNG, SVG, PDF, AI. The
schema keeps **one `BrandAsset` document per file** (so size, content type,
storage path and download URL stay honest per file) and ties them together with
a shared `groupId`; the catalog collapses each group into one card with format
chips.

- **`groupId`** — stable readable slug minted from the artwork title
  (`makeGroupId`: "K Lab logo — blue" → `k-lab-logo-blue`; diacritics folded,
  everything else hyphenated), disambiguated against ids in use. Seeded groups
  carry hand-written ids, so a seed id need not match what `makeGroupId` would
  produce for the same title. Readable because it appears in bundle URLs
  (`/api/brand-bundle/k-lab-logo-blue`). **Absent means the asset stands
  alone** — pre-grouping records keep working, and `groupKey()` falls back to
  the asset's own id, which is also the id it keeps when a second format joins.
- **`groupTitle` / `groupDescription`** — the group's display copy, written
  identically onto every member. Denormalized on purpose: a listing renders a
  card without fetching siblings, and each member's own `title` stays
  format-specific for the admin table (`memberTitle` derives
  "…, SVG" — never hand-edited, so a rename can't leave members disagreeing).
  Only the write path keeps them identical: `PATCH /api/assets/[id]` declines to
  read the three group fields, so the HTTP API can't split a group's copy — but
  `UpdateBrandAssetInput` still declares them, so the in-browser mock and any
  future adapter can. Dropping them from the patch type would make the type
  agree with the route, and is the version Firestore rules can express.
- **Grouping is on the format axis only.** Colour/orientation variants (blue vs
  white lockup) are separate artworks with separate group ids.
- **`AssetGroup`** (derived, never persisted): `id`, `title`, `description`,
  `assets` sorted by `ASSET_FORMAT_ORDER` (png · svg · webp · jpg · jpeg · gif ·
  pdf · ai · eps · ttf · otf · css, then unknown extensions alphabetically —
  first member is the default download), `preview` (first member with a
  `previewUrl`), `category` (from the primary), `visibility` (**most
  restrictive** member — a group is only as open as its tightest file),
  `status` (`archived` only when every format is), `tags`, `updatedAt` (latest
  member edit), `totalBytes`.
- **`AssetGroupFilter`** (`domain/services/asset-filtering.ts`, also derived and
  never stored) — what the admin table narrows by: `search`, `category`,
  `visibility`, `status`, each pinned to one value or open at the sentinel
  `ANY = "all"`. It filters **groups**, not files, because a row is an artwork:
  `visibility` and `status` therefore match the *derived* values, and `search`
  ANDs its terms over the group's title, description, category and tags plus
  every member's file name and format (an admin hunting "the SVG" is searching
  the files, one level below the row). Client-side over the whole catalog, the
  same bet as the grouping fold — and it expires with it, since neither derived
  facet can become a Firestore `where` clause once listings paginate.
- **Format tags**: each file stores its own extension as a tag (`"png"`); the
  derived group strips the tags that are just format markers for its members
  (`withoutFormatTags`), so `png` never leaks onto the SVG through the admin
  form. `assetFormat()` reads the extension first and falls back to a format
  tag.
- **Publishing a multi-format artwork** is N `POST /api/uploads` calls (bytes
  first, one per format, each returning an `AssetFile`) followed by one
  `POST /api/asset-groups` carrying all of them. The `groupId` is minted by the
  repository — server-side in the HTTP backend — so every file of one publish
  lands in the same group and concurrent publishes can't collide on a slug.
- **Writes are group-granular** (`BrandAssetRepository.createGroup`,
  `saveGroup`, `setGroupArchived`, `removeGroup`). `saveGroup` applies shared
  metadata, `addFiles` and `removeAssetIds` in one operation so a group is
  never half-saved; emptying a group is rejected (`errors.assets.groupEmpty`,
  400). The per-asset `create`/`update`/`setArchived`/`remove` methods remain
  for single-file records.
- **Bundle download**: `/api/brand-bundle/[groupId]` zips every format with a
  hand-rolled writer (`lib/zip/create-zip.ts` — `node:zlib` raw deflate per
  entry, falling back to stored when deflate would grow an already-compressed
  PNG or PDF; no dependency). Bytes come from `public/brand-files` *or* the
  in-memory upload store, so a freshly uploaded format doesn't 404 the whole
  bundle. Colliding basenames are suffixed. The route serves the group only when
  **every** member is `public`, so a bundle can never route around an
  employee-gated file.

## Mock data

- `contexts/brand-assets/infrastructure/mock/seed-assets.ts` — **generated** by
  `scripts/generate-asset-catalog.mjs` from the files actually on disk, so
  `sizeBytes` and `downloadUrl` can never drift. 44 asset records covering every
  category, 17 of them belonging to 5 multi-format artwork groups (the logo and
  logomark lockups) → 32 cards in the catalog. Imagery and the product logos
  carry a `groupId` too, as groups of one, so a second format can join without
  an id changing hands; only the fonts, the guidelines document and the sales
  files have none. Per-file titles, descriptions, tags and a
  `group` key live in that script's `CATALOG`; the group's shared copy lives
  once in its `GROUPS` map and is stamped onto each member as `groupTitle` /
  `groupDescription` (an unknown `group` key fails the build). The generator
  also forces sales categories to `employee`, mirroring
  `resolveVisibilityForCategory`.
- `contexts/user-management/user/infrastructure/mock/seed-users.ts` — both
  roles and all three statuses represented.
- Public bytes: `public/brand-files/*` (real brand assets). Private-location
  bytes: `private-assets/*` (outside the web root, streamed through
  `/api/sales-files/[id]`, which checks the session only for
  `employee`-visibility assets; placeholder documents — no real sales
  collateral yet).
- The `brand-book` tag marks the complete guidelines document. It currently
  points at a labelled placeholder: the real document is a 486 MB work-in-progress
  Illustrator file with no PDF export yet.

## Firebase readiness checklist

- [x] Repository interfaces are technology-agnostic (`BrandAssetRepository`,
      `PortalUserRepository`); the HTTP implementations
      (`contexts/*/infrastructure/http/`) prove the seam — Firestore
      implementations slot in behind the same client-services wiring without
      touching UI.
- [x] `storagePath` reserved on every asset for the Storage upload target.
- [x] Groups need no new collection: `groupId` on the asset document is enough,
      and group writes are already one repository call (`saveGroup`) — a
      Firestore implementation makes it one batched write.
- [ ] Firestore security rules mirroring `visibility` + role (backend task).
      Rules are per-document, so they must re-derive "most restrictive member"
      for bundles — or the bundle endpoint stays server-side, as it is today.
- [ ] Composite index on `groupId` (+ `category`, `status`) before listings
      paginate.
- [ ] Custom claims (`role`) minted on invite; replaces email-matching.
