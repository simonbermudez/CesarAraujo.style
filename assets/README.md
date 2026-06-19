# Image assets

## In place

| File | Where it appears |
|------|------------------|
| `cesar-hero.jpg` | Hero portrait (front portrait) |
| `cesar-portrait.jpg` | "The Artist" / About section (side profile) |
| `balayage.jpg` | "Hand-Painted Balayage" signature feature — stock photo |

> `balayage.jpg` is a free-license stock photo from Pexels
> (<https://www.pexels.com/photo/back-view-of-blonde-woman-14792102/>).
> The Pexels license allows commercial use with no attribution required.
> Swap it for a real client result whenever you have one.

## Still needed — Gallery ("Selected transformations")

These five tiles are for **client hair work** (before/after, colour, balayage),
not portraits of Cesar. Until a file exists at its path, the tile shows a gold
**CA** monogram on emerald — so the section looks intentional. Drop a file at
the matching path (keep the filename) and it appears automatically.

| File | Tile | Suggested crop |
|------|------|----------------|
| `gallery-1.png` | Large left tile | Portrait, ~3:5 (tall) |
| `gallery-2.png` | Top middle | Landscape / square |
| `gallery-3.png` | Top right | Landscape / square |
| `gallery-4.png` | Bottom middle | Landscape / square |
| `gallery-5.png` | Bottom right | Landscape / square |

**Format:** JPG, PNG, or WebP (the filename extension can differ — just update
the matching `src` in `index.html`). Aim for ~1200px on the long edge and
compress (q≈80) so the page stays fast.

> To swap any photo, replace the file or point the `<img src>` in `index.html`
> at a new path.
