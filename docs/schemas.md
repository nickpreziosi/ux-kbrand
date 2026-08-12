# Brand Portal Schemas

Data model for the brand & sales resource portal. Mock repositories serve these
shapes today; each maps 1:1 to the future Firebase integration
("Define Brand Portal Schemas" task).

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
  `brand-guidelines`, `logos`, `brand-imagery`, `fonts` (public defaults) ·
  `pitch-decks`, `sales-materials` (employee defaults). Admins may override
  visibility per asset.
- **Visibility**: `public` (anonymous view + download) · `employee`
  (session required; enforced by middleware for pages and by
  `/api/sales-files/[id]` for bytes).
- **Status**: `active` · `archived` (hidden from every listing, kept for
  admins).
- **File metadata** (`AssetFile`): `fileName`, `contentType`, `sizeBytes`,
  `storagePath` (future Storage object path), `downloadUrl` (whatever serves
  the bytes today: static public file, gated API route, or blob URL for
  fresh mock uploads).
- Audit: `createdAt`, `updatedAt`, `createdBy` (PortalUser id). Optional
  `previewUrl` + `tags`.

## Mock data

- `contexts/brand-assets/infrastructure/mock/seed-assets.ts` — **generated** by
  `scripts/generate-asset-catalog.mjs` from the files actually on disk, so
  `sizeBytes` and `downloadUrl` can never drift. 37 assets covering every
  category. Titles and descriptions live in that script.
- `contexts/user-management/user/infrastructure/mock/seed-users.ts` — both
  roles and all three statuses represented.
- Public bytes: `public/brand-files/*` (real brand assets). Employee bytes:
  `private-assets/*` (outside the web root, streamed only through the
  session-checked route; placeholder documents — no real sales collateral yet).
- The `brand-book` tag marks the complete guidelines document. It currently
  points at a labelled placeholder: the real document is a 486 MB work-in-progress
  Illustrator file with no PDF export yet.

## Firebase readiness checklist

- [x] Repository interfaces are technology-agnostic (`BrandAssetRepository`,
      `PortalUserRepository`); Firestore implementations slot in behind the
      client-services wiring without touching UI.
- [x] `storagePath` reserved on every asset for the Storage upload target.
- [ ] Firestore security rules mirroring `visibility` + role (backend task).
- [ ] Custom claims (`role`) minted on invite; replaces email-matching.
