# Brand palette divergence — resolved

**Status:** closed · resolved 2026-08-13 on `feature/rebranding`.

## Decision

The portal default theme now matches `@k-lab/components`:

| Theme | `--accent-brand` | Hex |
|---|---|---|
| Light | `218 58% 28%` | `#1e3d72` |
| Dark | `199 100% 50%` | `#00acfd` |

Identity blues on `/branding/colors` and the product `accent-brand` token are
aligned. The previous orange product accent (`23 90% 54%`) is no longer the
default in this portal.

## What changed

- `app/globals.css` — default `:root` / `.dark` tokens synced from components
- `ui/branding/content/brand-palette.ts` — product swatch values updated
- Locale copy under `branding.colors` — divergence note removed / rewritten
