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
| `/api/users` | GET list · POST invite | admin |
| `/api/users/[id]` | PATCH (`{role}` or `{status}`) · DELETE | admin |
| `/api/users/lookup?email=` | GET (role resolution) | signed-in |
| `/api/uploads` | POST multipart (`file`, `category`) → `AssetFile` | admin |
| `/api/uploads/[id]` | GET bytes for admin-uploaded files | owning asset's visibility |
| `/api/sales-files/[id]` | GET bytes for private-location seed files | asset's live visibility |

The viewer's role is resolved server-side from the httpOnly presence cookie +
`KBrandSessionEmail` cookie (set at login; in platform mode the email comes
from the verified Firebase token) → directory lookup. Error payloads are
`{ "error": "<i18n key>" }`, rethrown client-side as `Error(message)` so the
hooks' existing key matching keeps working. Prototype trust model — in
isolated mode the login flow self-reports the email after a real Firebase
sign-in; production replaces this with verified custom claims.

## Firestore mapping

| Domain model | Firestore | Notes |
|---|---|---|
| `BrandAsset` | `assets/{id}` | `file.storagePath` points at the Storage object |
| `PortalUser` | `users/{uid}` | Keyed by Firebase Auth uid; mock uses seed ids + email matching |

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
- **Visibility** (role gating, independent of category and of where the bytes
  live): `public` (anonymous view + download) · `employee` (session required;
  enforced by middleware for pages and by `/api/sales-files/[id]` /
  `/api/uploads/[id]` for gated bytes). **Every asset defaults to `public` for
  now**; admins re-gate per asset from Manage assets. Gating changes live in
  the mock HTTP backend's server-side store, so the download routes enforce
  the *live* visibility — the old seed-only caveat is resolved.
- **Status**: `active` · `archived` (hidden from every listing, kept for
  admins).
- **File metadata** (`AssetFile`): `fileName`, `contentType`, `sizeBytes`,
  `storagePath` (future Storage object path), `downloadUrl` (whatever serves
  the bytes today: static public file, gated API route, or `/api/uploads/[id]`
  for fresh admin uploads held in server memory).
- Audit: `createdAt`, `updatedAt`, `createdBy` (PortalUser id). Optional
  `previewUrl` + `tags`.

## Mock data

- `contexts/brand-assets/infrastructure/mock/seed-assets.ts` — **generated** by
  `scripts/generate-asset-catalog.mjs` from the files actually on disk, so
  `sizeBytes` and `downloadUrl` can never drift. 37 assets covering every
  category. Titles and descriptions live in that script.
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
- [ ] Firestore security rules mirroring `visibility` + role (backend task).
- [ ] Custom claims (`role`) minted on invite; replaces email-matching.
