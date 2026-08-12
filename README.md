# K Brand — Brand & Sales Resource Portal

Standalone K Lab portal (`brand.k-lab.ai`) where anyone can download approved
brand guidelines, logos, imagery, and fonts, and employees sign in for pitch
decks and sales materials. Admins manage assets and users from the portal.

Prototype status: functional demo on mock data (Notion task
"Create Brand Portal Prototype"). Schemas are Firestore-ready — see
[docs/schemas.md](docs/schemas.md).

## Getting started

```bash
npm install                                  # needs the @k-lab Azure feed PAT (see .npmrc)
node scripts/generate-placeholder-docs.mjs   # once: employee demo docs + guidelines stand-in
npm run dev                                  # http://localhost:3005 (or kbrand.klab.localhost:3005)
```

Real brand files (logos, backgrounds, renders, the Sora typeface) are committed
under `public/brand-files/` — no build step needed to see them.

`.env` borrows the `gc-k-usa-business-core-dev` Firebase web config
(temporary, per the prototype task) — sign in with any user from the shared
core dev pool. Roles resolve from the mock directory by email
(`contexts/user-management/user/infrastructure/mock/seed-users.ts`); unknown
authenticated emails default to `employee`.

## Access model

| Area | Route | Who |
|---|---|---|
| Branding standards — logo, colours, typography, imagery, guidelines | `/`, `/branding/*` | Public |
| Sales resources (pitch decks, materials) | `/sales` | Employees (session) |
| Asset + user management | `/admin/assets`, `/admin/users` | Admins |

The `/branding` section is a **hybrid portal**: the standards teams reach for
most are surfaced directly in the UI, while the complete brand guidelines
document stays the source of truth, available to view and download. Converting
the full guide into web content is deliberately out of scope.

Middleware guards `/sales`, `/admin`, and `/settings`. Employee file bytes live
in `private-assets/` (outside the web root) and stream only through
`/api/sales-files/[id]`, which returns 401 without a session cookie.

## Brand assets

Originals live in `brand-source/` (see its README); the portal serves
web-optimized derivatives from `public/brand-files/` — 215 MB of masters
reduced to 3.5 MB. Regenerate with:

```bash
node scripts/build-brand-assets.mjs      # masters → web derivatives (needs the originals)
node scripts/generate-asset-catalog.mjs  # rewrites the seed catalog, sizes read from disk
```

Two known gaps: the brand guidelines document has no PDF export yet (the portal
shows a labelled placeholder), and the corporate identity is blue while the
product design system still ships an orange accent — see
[docs/brand-palette-divergence.md](docs/brand-palette-divergence.md).

## Architecture

Clean/hexagonal per the workspace guidelines: `contexts/` (domain, application,
infrastructure — mock repositories at the DI seam), `ui/` (views, components,
hooks), `app/` (thin route wrappers). Chrome comes from `@k-lab/components`
(`AppLayoutClient`), auth pages from the library auth composites, i18n via
next-intl cookie-based locales (en / es / pt / ar).

Deployment profiles follow the platform architecture doc: `isolated` (default —
standalone public portal) or `platform` (SSO shell bridge, same plumbing as the
other product repos).
