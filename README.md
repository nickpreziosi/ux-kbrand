# K Brand — Brand & Sales Resource Portal

Standalone K Lab portal (`brand.k-lab.ai`) where anyone can download approved
brand guidelines, logos, imagery, and fonts, and employees sign in for pitch
decks and sales materials. Admins manage assets and users from the portal.

Prototype status: functional demo on mock data (Notion task
"Create Brand Portal Prototype"). Schemas are Firestore-ready — see
[docs/schemas.md](docs/schemas.md).

## Getting started

```bash
npm install                                  # needs AZURE_NPM_TOKEN (Azure Artifacts PAT; see .npmrc)
node scripts/generate-placeholder-docs.mjs   # once: employee demo docs + guidelines stand-in
npm run dev                                  # http://localhost:3005 (or kbrand.klab.localhost:3005)
```

Real brand files (logos, backgrounds, renders, the Sora typeface) are committed
under `public/brand-files/` — no build step needed to see them.

`.env` points at the portal's own `klab-brand-center-dev` Firebase project
(separate user pool from the SSO fleet). Sign-in is **Microsoft (Entra ID)
only** — Firebase brokers the OAuth flow, and `/api/auth/session` only mints
sessions from verified `microsoft.com`-provider tokens (verification uses
Google's public certs — no service-account key needed; see `.env.example`).
`NEXT_PUBLIC_ENTRA_TENANT_ID` is required. Roles resolve from the mock
directory by email
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

## Vercel

`@k-lab/components` is served from a private Azure Artifacts feed. Vercel
`npm install` needs `AZURE_NPM_TOKEN` (Production + Preview): an Azure DevOps
PAT with **Packaging Read** on `klab-inc`. `.npmrc` interpolates that env var
onto the feed URLs only — do not commit a token.

Copy `NEXT_PUBLIC_FIREBASE_*` and `NEXT_PUBLIC_ENTRA_TENANT_ID` from local
`.env` into the Vercel project **before** the first production build so they
are inlined into the client bundle.

Leave `NEXT_PUBLIC_COOKIE_DOMAIN` unset (host-only cookies). The
`.klab.localhost` value in `.env.example` is local-only. Keep
`NEXT_PUBLIC_DEPLOYMENT_PROFILE=isolated`. Set `NEXT_PUBLIC_APP_ORIGIN` to the
Vercel URL or custom domain; do not set `NEXT_PUBLIC_SHELL_ORIGIN` unless this
is a platform-shell deploy.

The mock HTTP backend is in-memory per serverless instance — admin uploads and
catalog edits do not persist across invocations.
