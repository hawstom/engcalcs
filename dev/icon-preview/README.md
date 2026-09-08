# Icon preview

Scratch drawings for icons under consideration. Nothing here ships; a winner is copied into
`lib/Icons.lib.php`, which is the one geometry table (the menu and the map both read it).

## Water tower candidates, 2026-09-08

`node gen-concepts.js` writes every candidate `.svg` (24-unit viewBox, single `currentColor`
stroke, the suite's own open tag) and `concepts-2026-09-08.html`, which shows each at 16, 24, 32
and 64 px on light and dark beside the current `water` icon, with a nearest-neighbour blow-up of
the 16 px raster. `render/blowup-16.png` and `render/sheet-16-32.png` are headless-Chrome renders
of the same, and are what the cull below was judged on.

They riff on Tom's three sketches in `tgh-icon-concepts.png` under his three instructions: the
house on stilts needs a belly and must be very skinny; any tower's legs are truncated and less
splayed; an L for Libre, since the mark is the menu brand as well as the favicon.

**What the 16 px render settled.** A belly INSIDE the wall line does not show at 16 px: the walls
and stilts fuse into one arch and every round-1 house read as the letter A. The belly has to be
wider than the house (`house-pot`). Truncating the dome's legs to the riser's length turned the
tower into a table; the legs must stop visibly SHORT of the riser (`dome-rim-riser-short`). And
no L survives 16 px in any form, stroked or knocked out of a fill: the L variants are for 24 px
and up, with the plain sibling as the favicon.

### Kept (18, one `.svg` each)

| Candidate | What it fixes |
|---|---|
| `house-round` | Sketch 2 with a hemispherical belly; stilts continue the walls, so no tripod. |
| `house-cone-riser` | Hopper bottom feeding a riser: the pipe visibly leaves the point of the cone. |
| `house-barrel` | Belly in the walls themselves; one outline, fewest strokes. |
| `house-barrel-riser` | Barrel with a centre riser. |
| `house-pot` | Belly WIDER than the house, plumb stilts inset under it. The only house that reads as a vessel on legs at 16 px. |
| `house-pot-riser` | Pot belly on a single pipe; the belly keeps it from the monolithic shape he named. |
| `house-round-L`, `house-barrel-L` | L painted on the house wall; holds at 24 and 32, closes at 16. |
| `house-pot-L`, `house-pot-riser-L` | L in the pot belly, the widest field any candidate has. |
| `dome-rim-riser` | Sketch 1: legs from the catwalk ENDS at 4 degrees, 5.4 units from the riser, so the pipe cannot be read as a leg. |
| `dome-rim` | The same on two legs alone. |
| `dome-rim-riser-short` | Legs stop at y = 17.5, riser reaches 22: only the pipe touches the ground. |
| `dome-bulb-riser`, `dome-bulb` | The current attachment from the underside, truncated and 3 degrees off plumb instead of 10. |
| `dome-pot` | Deep belly under the dome on two short inset stilts, no riser. |
| `dome-rim-riser-L`, `dome-rim-L` | L in the bulb; the catwalk is dropped because the chord strikes the L through. |

### Culled at 16 px (9, rows kept in the page's folded section, no `.svg`)

`house-dish` and `house-cone` (the letter A), `house-round-riser` (a rocket),
`house-cone-riser-L` (one smudge), `dome-pedestal` (a martini glass), `house-round-Lstand` and
`dome-Lstand` (a padlock; the L foot reads as a shackle), `dome-solid-L` and `house-pot-solid-L`
(a filled shape with a hole; the knocked-out L is a notch at 16 and barely a letter at 32).

### Map symbols

The map already draws its symbols from the same table as the menu, and they match the sketch's
SYMBOL row shape for shape: circle, triangle, rectangle, line, volute, bowtie. The page shows
them in blue with a light fill for the comparison; no new symbol set was needed.
