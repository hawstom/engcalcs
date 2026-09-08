# Icon preview

Scratch drawings for icons under consideration. Nothing here ships; a winner is copied into
`lib/Icons.lib.php`, which is the one geometry table (the menu and the map both read it).

## Water tower candidates, round 2 (2026-09-08b) — CURRENT

`node gen-concepts-b.js` writes every candidate `.svg` (24-unit viewBox, single `currentColor`
stroke, the suite's own open tag) and `concepts-2026-09-08b.html`, which shows each at 16, 24, 32
and 64 px on light and dark beside the current `water` icon, with a nearest-neighbor blow-up of the
16 px raster. `render/sheet-b.png` and `render/blowup-b.png` are the headless-Chrome renders of the
same, and are what the verdicts below were judged on.

**The geometry is measured, not eyeballed.** `tgh-icon-concepts.png` was scanned pixel by pixel in a
canvas and every number in `gen-concepts-b.js` is a run out of that scan, mapped once into the
24-unit frame; the pixel values are carried in the comments beside each drawing so the mapping can be
rechecked. That is the round-1 failure fixed at the root: round 1 read his sketch by eye, drew an
ellipse where he had drawn a flat-crowned tank, and left the catwalk off entirely.

**What his towers actually are.** WT-WIDE is a wide, flat-crowned tank whose two side walls run
UNBROKEN to the ground — the wall is the leg, so there is no joint, no splay, and no tripod; a solid
bar catwalk crosses it at twice the outline weight and overhangs both walls; a shallow bowl hangs
below it; and a riser six times a leg's weight drops from the bowl's low point. WT-TALL-3 is a
cylinder with a straight gable, a boxed catwalk near the bottom, a true hemispherical bottom, plumb
legs and a riser at leg weight.

**Three verdicts, not two.** FAVICON survives 16 px. MENU ONLY is a real drawing that works from 24
or 32 px up. RECORD ONLY is kept because it is HIS geometry and the file should hold it, not because
anything would ship it. The floor every verdict is measured against is `lib/Icons.lib.php`'s own:
17/24 of a unit is 0.71 px and a 2-unit stroke eats a unit either side, so a clear gap under about
2.5 units closes at icon size.

| Candidate | Verdict | Why |
|---|---|---|
| `wt-wide` | FAVICON | His WT-WIDE as drawn. Riser-to-leg daylight 6.3 units. |
| `wt-wide-heavy-walk` | FAVICON | Catwalk at 2.6, the nearest the set weight comes to his 2x bar. |
| `wt-wide-long-walk` | FAVICON | Catwalk 1.4 to 22.6; caps land 0.4 unit inside the frame. |
| `wt-wide-short-legs` | FAVICON | Legs to 19.2, riser to 22.4: only the pipe touches the ground. |
| `wt-wide-thin-riser` | FAVICON | Riser at 2.6. Reads, but 0.6 unit of difference from a leg is not enough at 16 and the pipe starts to read as a third leg. |
| `wt-wide-L` | MENU ONLY | At 16 the L's foot lands on the catwalk and its stem on the crown; the tank fills with ink. Holds from 32. |
| `wt-tall-3` | RECORD ONLY | His aspect exactly, which is 9.8 units wide: at 16 px that is 6.5 pixel columns and riser-to-leg is 1.95 units, under the floor. |
| `wt-tall-3-thick-riser` | RECORD ONLY | The heavier pipe is right and his width cannot carry it: 1.45 units to each leg, and the three verticals fuse. |
| `wt-tall-3-fit` | FAVICON | The same tower with the x axis stretched 1.83x. 4.8 units of riser-to-leg daylight, open bowl, catwalk clearing both walls. |
| `wt-tall-3-fit-short-legs` | FAVICON | The truncation lesson applied; it buys less here, because the hemisphere already separates leg from pipe. |
| `wt-tall-3-fit-L` | MENU ONLY | Same as `wt-wide-L`, but the taller field lets the letter survive 24 px. |
| `wt-tall-1` | RECORD ONLY | Narrower than TALL-3 and splayed as well, so it loses twice. Kept to show what the simplification bought. |

**What had to change from his sketch to survive 16 px, and nothing else did.**

1. **Stroke weights are the set's, not his.** His outline is 5 px on a 193 px tank, which maps to
   0.6 units against the set's 2. A catwalk at his relative 2x would be 4 units and would swallow the
   tank, so it is drawn at 2 (and at 2.6 in one variant). The riser is the one weight kept
   proportional, at 3.2, which is `lib/Icons.lib.php`'s own precedent.
2. **WT-TALL-3's gable overhang is dropped.** He runs the eave 4 px past each wall, which maps to
   0.6 unit — under one stroke width, so it cannot render as an overhang, only as a thickening. Tom's
   own 2026-09-04 no-roof-overhang ruling says the same thing from the other side.
3. **WT-TALL-3's riser is thickened in the fitted version.** His TALL-3 draws it at leg weight, which
   his own WT-WIDE does not; at leg weight it is a third leg.
4. **`wt-tall-3-fit` stretches his x axis 1.83x and changes nothing else.** This is the one real
   deviation, and it is the one his own note asks for: he rates WT-WIDE's PROPORTIONS best and
   WT-TALL-3's shape most promising, and those are two separate judgements.
5. **Everything else is his.** No ellipse, no house, no pot, no splay he did not draw, no leg count
   he did not draw, and the catwalk is on every single candidate.

## Water tower candidates, round 1, 2026-09-08 — REJECTED

Rejected whole by Tom: *"(1) All house-pot variants are worthless. (2) They didn't even try the wide
concept 1 of 3 in my concepts. They did an ellipse, but that's not what I drew. (3) They didn't even
try to include the catwalk. Sketch 2 is the closest to a viable improvement on the current, but it
needs a catwalk as I drew. (4) I think that WT-WIDE has the best proportions for an icon. But I think
that WT-TALL-3 has promise and has been simplified slightly from WT-TALL-1. Let them see what they
can do with another try."* Kept below as the record of what was tried; none of it ships.

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
