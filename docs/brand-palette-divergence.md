# Brand palette divergence — needs a decision

**Status:** open · raised 2026-08-12 while wiring the real brand assets into the portal.

## What we found

The corporate brand assets and the product design system use different accent
colours, and the portal now shows both side by side on `/branding/colors`.

| | Colour | Value | Where it comes from |
|---|---|---|---|
| **Brand identity** | Brand blue | `hsl(219 57.7% 40.8%)` · `#2C56A4` | Sampled from the `k-lab-logo-blue` master |
| | Electric blue | `hsl(200 100% 49.4%)` · `#00A8FC` | Sampled from the gradient background artwork |
| | Deep navy | `hsl(214.3 91.3% 4.5%)` · `#010A16` | Ground behind the chevron hero artwork |
| **Product token** | `--accent-brand` | `hsl(23 90% 54%)` · `#F37120` | `app/globals.css`, shipped by `@k-lab/components` |

Every K Lab application — KBPM, K Risk, K Leads, K Rails, and this portal —
renders primary actions in the orange accent. Every piece of 2025 brand
artwork is blue.

## Why it matters here

A brand portal is the one place where this is impossible to hide: the logo
page and the colour page sit two clicks apart. Right now the portal reports
the situation honestly rather than picking a side — identity colours are
listed as literal values, product colours as live design tokens, with a note
explaining the split.

## Options

1. **Retune the design system to the identity blue.** `--accent-brand-h/s/l`
   are three variables in `globals.css`; the library derives everything else
   from them, so the change is small but affects every product surface and
   needs contrast re-checking (blue on white passes more easily than orange,
   so this likely improves accessibility).
2. **Keep them separate and say so.** Orange stays the product interaction
   colour, blue stays the corporate identity. Legitimate, but the guidelines
   document should state it explicitly so it doesn't read as a mistake.
3. **Adopt blue in the portal only.** Cheapest, and worst — it makes the brand
   portal inconsistent with the products it documents.

## Recommendation

Option 1 or 2, decided by design, then reflected in the brand guidelines
export. Until then the portal's colour page carries the explanatory note.

## What to change when it's decided

- `ui/branding/content/brand-palette.ts` — group definitions
- `branding.colors.tokenNote` + `branding.colors.groups.product.description`
  in all four locale catalogs
- If option 1: `--accent-brand-h/s/l` in `app/globals.css`, then the same
  change in `@k-lab/components` and every consuming repo
