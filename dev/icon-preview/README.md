# Icon preview

Scratch drawings for icons under consideration. Nothing here ships; a winner is copied into
`lib/Icons.lib.php`, which is the one geometry table (the menu and the map both read it).

## Water tower IN COLOR, round 3 (2026-09-09, revised 2026-09-10) -- CURRENT

`node gen-concepts-color.js` writes 12 color candidates and 5 mono menu candidates (`ic-*.svg`),
170 REAL PNGs under `render/color/` at 16 / 32 / 48 / 192 / 512 on a white and on a dark page ground
(the mono rows at 16 / 17 / 24 / 32), and
`concepts-2026-09-09-color.html`, which shows every raster at 1:1 beside its verdict. The three
contact sheets `render/color/sheet-color.png`, `blowup-color.png` and `blowup-color-dk.png` are the
pictures the verdicts were judged on. Round 2 settled the GEOMETRY; every path here is round 2's,
and the only new geometry is a closed body path per tower (round 2's own numbers, joined so there is
something to fill) and the W in the one LW row, which is marked OURS on the sheet.

**ROUND 3b, 2026-09-10, after Tom read the sheet.**

- **THE DESCENDERS WERE TRUNCATED ON EVERY ROW.** He caught it: *"One major bug is that all these
  descenders (leg and pipe) are truncated. They must hit the bottom. Obviously we can't have this
  thang flying in the air."* Every leg and riser stopped at y 21.4 or 22.4 inside a 24-unit frame,
  so the tower hung with two units of empty ground under it. **It was the DRAWING, not the viewBox
  and not the fit** -- nothing ever clipped those paths, they simply stopped short. The bottom y is
  a parameter now, and the caller passes the value that lands on the frame's edge after the row's
  own scale: 24 unscaled, `12 + 12/scale` for the two maskable rows. Measured in the PNGs on the
  BOTTOM ROW at the three descender columns, on `ic-tall3-steel-overcast`: delta-L against the sky
  was **0 / 0.7 / 0 / 0 / 0** at 16 / 32 / 48 / 192 / 512 before and **69 / 177 / 190 / 190 / 190**
  after. Every row carries that number on the sheet.
- **THE FITTED TOWER READS WIDE, so it is named that.** Tom: *"You called wide tall."*
  `ic-tall3fit-*` is `ic-wide3fit-*`, and `ic-mask-tall3fit-overcast` went with it as
  `ic-mask-wide3fit-overcast`, being the same geometry. The `ic-tall3-*` rows keep their name: they
  are his own aspect and they really are tall. `ic-wide-*` is WT-WIDE and is untouched.
- **HIS OWN ASPECT IS FAVICON, and the round-3 verdict was wrong.** `ic-tall3-*` was filed MENU ONLY
  on the claim that its two legs and its riser fall inside three pixel columns and fuse at 16 px.
  They are 4 units apart, and the bottom row of the 16 px raster holds THREE separate runs with pure
  sky between them. What that reading was looking at was a bottom row that was sky from side to
  side, because the legs stopped short of it. **`ic-tall3-steel-overcast` is the front runner**
  (Tom: *"I may be in love. Those two are positively nostalgic."*), and it now measures catwalk
  delta-L 55 and feet delta-L 69 at 16 px.
- **FIVE MONO MENU CANDIDATES**, at the foot of the sheet. See below. **Nothing is deployed:**
  `wt-wide-L` is still the shipped menu icon, and `lib/Icons.lib.php`, `icons/` and both sibling
  repositories were not touched.

**What it answers, all three from Tom on 2026-09-09.** Galvanized-steel silver with a cylinder
lighting gradient on a sky-blue ground, overcast or wispy; `wt-wide-L` as solid blue with a black LW
on a light sky-blue ground; and what ground a MASKABLE icon carries (*"Make it look like the sky,
cloudy if that helps with contrast"*). Flat-silver controls sit beside every gradient row, because a
gradient that survives 512 and dies at 32 is worth knowing about first.

**THE CATWALK'S MIDDLE IS MEASURED, NOT ARGUED.** He predicted the color tweak is *"lossy in the
raster respect because the catwalk loses its middle"*. Each PNG is decoded in Node and sampled on a
column inside the tank: the luminance difference between the bar and the body rows two units either
side, on 0-255, with 26 (a tenth of the range) as the floor. **He is right about the solid-blue
mark and it is worse than he thought: the middle is gone at every size, 512 included** (delta-L 0.8 /
0.4 / 0.7 / 0.7 / 0.0), because a bar the same color as the body it crosses has nothing to be seen
against. That is a color decision, not a raster one, and only a second color fixes it -- the
`ic-wide-L-blue-knockout` row, which is OURS. **Every silver-on-sky row keeps its middle at all five
sizes** (delta-L 44-59 at 16 px, 89-162 from 32 up), because the bar is ink and the body is silver.

| Candidate | Verdict | Why |
|---|---|---|
| `ic-wide3fit-steel-sky` | FAVICON | His main ask. Tank, catwalk, legs and riser all separate at 16. |
| `ic-wide3fit-steel-overcast` | FAVICON | Same, with the wisps. The row to prefer if the ground must also work maskable. |
| `ic-wide3fit-silver-flat` | FAVICON | The control: flat is not worse at 16, so the gradient is a taste question. |
| `ic-tall3-steel-sky` | FAVICON | Re-measured after the descender fix: three separate descenders on the 16 px bottom row, catwalk delta-L 55. |
| `ic-tall3-steel-overcast` | FAVICON | **THE FRONT RUNNER.** Best of his own aspect at 16: catwalk 55, feet 69, three descenders apart. |
| `ic-tall3-silver-flat` | FAVICON | Control; the flat fill costs nothing at 16 and buys no cylinder above it. |
| `ic-wide-L-blue` | MENU ONLY | His solid-blue ask, exactly. The catwalk row above, and the letter still needs 32. |
| `ic-wide-LW-blue` | RECORD ONLY | Two letters in a crown that struggles with one. The W is OURS. |
| `ic-wide-L-blue-knockout` | MENU ONLY | OURS: the catwalk in the ground color, delta-L 47 at 16 against 0 without it. |
| `ic-wide-steel-sky` | FAVICON | The sink question: the FILL and the GROUND move the reading with no path changed. |
| `ic-mask-wide3fit-overcast` | FAVICON | The maskable one to put forward: 0.80 scale into the 80% safe circle, cloudy sky, catwalk intact. |
| `ic-mask-wide-L-blue` | MENU ONLY | Needs 0.74, and carries its parent's catwalk loss into the icon Android crops. |

### The mono menu candidates (2026-09-10)

Tom: *"I would love to show that to PCW and MAH ... It would be extra nice if the mono- menu icon
could have a masterful pseudo-gradient touch for the cylinder."*

**A MENU ICON CANNOT CARRY A SKY, and that is the constraint the whole section is built around.**
`lib/Icons.lib.php` draws every one through `EC_ICON_OPEN_TAG` -- `fill="none"`,
`stroke="currentColor"`, width 2, on no ground at all -- which is what lets the row's own color
drive the glyph and greys it for free when the row is disabled. So there is no fill to hold a
gradient and **no way to make anything lighter than the paper**: the only move available is to ADD
ink on the shadow limb and leave the bright band bare. That is engraving. The tank of WT-TALL-3 has
a clear interior of six units, which is **4.2 pixels at the 17 px (1.05em) a menu row draws at**, and
every trick below has to happen inside them.

Measured on one raster row at the tank's mid height. **`net grade`** is the number of columns at an
intermediate ink (0.15 to 0.70 of the row's darkest) MINUS the control's count at the same size --
a mid-tone pixel is the whole of what a pseudo-gradient can be in one ink, and the control is
subtracted because a bare 2-unit wall on 1.4 pixels already makes two of them by antialiasing alone.
**The first metric written here measured the wrong thing** and the script records why: it looked for
a third ink RUN inside the tank, on the assumption that a surviving hatch is separate from its wall.
It is not -- at 32 px the hatch merges into the right wall -- so the metric read 0 for shading that
is plainly in the pixels.

| Candidate | Verdict | net grade at 16 / 17 / 24 / 32 | Why |
|---|---|---|---|
| `ic-mono-plain` | MENU OK | 0 / 0 / 0 / 0 | The control. No cylinder at all: a rectangle with a dome. |
| `ic-mono-hatch2` | MENU OK | +2 / +1 / +1 / +2 | Two verticals in the right third. They merge into the right wall by 24 px, so it reads lit from the left rather than round. |
| `ic-mono-hatch-lr` | **PICK** | +3 / +1 / +2 / +3 | **The one to show.** One line left, two right, bare band down the middle. Mid-tone on BOTH limbs, and identical on the dark ground. |
| `ic-mono-weight` | MENU OK | +1 / 0 / +3 / +4 | Wall weight alone, and it buys nothing at the size that decides: 1.4 and 2.9 units are one pixel apart at 17 px. Its thin left wall also costs descender contrast (feet 30 against 50). |
| `ic-mono-broken` | RECORD ONLY | +1 / +2 / +2 / +2 | Highest at 17 px and still turned down: from 24 up the dashes read as a BREAK in the tank wall. Kept because somebody will propose it again. |

## Water tower candidates, round 2 (2026-09-08b) — the geometry round

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
