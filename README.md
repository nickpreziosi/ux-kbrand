# K Brand — Brand & Sales Resource Portal

Standalone K Lab portal (`brand.k-lab.ai`) where anyone can download approved
brand guidelines, logos, imagery, and fonts, and employees sign in for pitch
decks and sales materials. Admins manage assets and users from the portal.

Prototype status: functional demo on mock data (Notion task
"Create Brand Portal Prototype"). Schemas are Firestore-ready — see
[docs/schemas.md](docs/schemas.md).

## Getting started

```bash
npm install                            # needs the @k-lab Azure feed PAT (see .npmrc)
node scripts/generate-seed-files.mjs   # once: writes public/brand-files + private-assets
npm run dev                            # http://localhost:3005 (or kbrand.klab.localhost:3005)
```

`.env` borrows the `gc-k-usa-business-core-dev` Firebase web config
(temporary, per the prototype task) — sign in with any user from the shared
core dev pool. Roles resolve from the mock directory by email
(`contexts/user-management/user/infrastructure/mock/seed-users.ts`); unknown
authenticated emails default to `employee`.

## Access model

| Area | Route | Who |
|---|---|---|
| Brand guidelines, logos, imagery, fonts | `/`, `/brand/[category]` | Public |
| Sales resources (pitch decks, materials) | `/sales` | Employees (session) |
| Asset + user management | `/admin/assets`, `/admin/users` | Admins |

Middleware guards `/sales`, `/admin`, and `/settings`. Employee file bytes live
in `private-assets/` (outside the web root) and stream only through
`/api/sales-files/[id]`, which returns 401 without a session cookie.

## Architecture

Clean/hexagonal per the workspace guidelines: `contexts/` (domain, application,
infrastructure — mock repositories at the DI seam), `ui/` (views, components,
hooks), `app/` (thin route wrappers). Chrome comes from `@k-lab/components`
(`AppLayoutClient`), auth pages from the library auth composites, i18n via
next-intl cookie-based locales (en / es / pt / ar).

Deployment profiles follow the platform architecture doc: `isolated` (default —
standalone public portal) or `platform` (SSO shell bridge, same plumbing as the
other product repos).
