# brand-source

The original brand assets, organized. Nothing here is served directly — the
portal serves the derivatives in `public/brand-files/`, generated from this
folder.

```
brand-source/
  vector/           .ai working files + .pdf vector masters   (committed, ~18 MB)
  fonts/            sora-variable.ttf, the brand typeface     (committed)
  raster-masters/   hi-res PNG masters, up to 16000px wide    (gitignored, ~214 MB)
  guidelines-wip/   the Illustrator brand guidelines package  (gitignored, ~665 MB)
```

## What's in git and what isn't

Vector sources and the typeface are committed — they're the true masters and
small enough to version. The raster masters and the guidelines package are
gitignored: together they're ~880 MB, with a single 486 MB `.ai` file inside
the guidelines package.

That means `scripts/build-brand-assets.mjs` only runs on a machine that has the
originals. The **generated output in `public/brand-files/` is committed**, so a
fresh clone serves the full portal without them.

To get the originals, ask the design team for the brand asset package and drop
its contents into `raster-masters/` and `guidelines-wip/` using the names in
`scripts/build-brand-assets.mjs`.

## Regenerating what the portal serves

```bash
node scripts/build-brand-assets.mjs      # masters  → public/brand-files (215 MB → 3.5 MB)
node scripts/generate-placeholder-docs.mjs   # guidelines stand-in, font kits, demo sales docs
node scripts/generate-asset-catalog.mjs  # rewrites the seed catalog, sizes read from disk
```

## Notes

- `Arial.ttf` shipped in the guidelines package is deliberately **not** copied
  here or served — it's a licensed system font, not ours to redistribute.
- The brand guidelines document is a work in progress with no PDF export yet;
  the portal shows a clearly-labelled placeholder until one exists. See
  `docs/schemas.md` and `scripts/generate-placeholder-docs.mjs`.
- Product/sub-brand assets (K Rails, K Talk, Kena) live alongside the master
  brand — the user story asks for "brand and product logos" in one place.
