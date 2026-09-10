# Ship notes, 2026-09-10 (round 3d)

Two finished drawings, both in this directory: `ship-favicon.svg` and `ship-water-menu.svg`.
Measured with `gen-ship.js`, which copies `catwalkMiddle()`, `surfaceTones()`, `descenderFeet()` and
`cylinderProfile()` verbatim from `gen-concepts-color.js` so a number here means what it meant on
round 3's sheet. Raw numbers: `render/ship/measurements.json`. Proof sheet: `render/ship/ship-sheet.png`
(and `.html`, same content, live).

**The record for the lost sketch is now three short messages, quoted verbatim, since nothing else
will ever corroborate them.** Tom, mid-task, after confirming the annotated original is gone for
good ("I don't have my sketch any more"):

1. "just some radial lighting on the roof and some darkening of the belly."
2. "Well, it's a cylindrical tank. So obviously the roof is a cone."
3. "And of course the belly is a hemisphere."

Round 3c had already put a LINEAR left-right ramp on the roof — the wall's own axis, borrowed —
and a flat left-right tone on the bowl. Both were wrong in the same way: they shaded a surface of
revolution as if it were the wall. A cone's highlight is a spot falling off outward from a point
near the apex; a hemisphere lit from above is brightest at its springline and darkens downward with
a curved terminator. Neither takes a left-right band, and neither takes one flat tone.

## Deliverable 1 — `ship-favicon.svg`

**What it is.** `ic-tall3-steel-overcast`'s geometry (his named reference) with the wall ramp
untouched, a `radialGradient` roof and a `radialGradient` bowl, both `gradientUnits="userSpaceOnUse"`
rather than the default box-relative unit — the roof's own bounding box is 8.1 units wide by 1.5
tall and a box-relative circle would squash into an ellipse with no physical reading at all, so the
radius is stated in the tower's own drawing units instead. Overcast sky ground, three blurred wisp
ellipses (unchanged from round 3), descenders to `y=24`. Standalone file: `viewBox="0 0 24 24"`,
`<title>`, `role="img"` + `aria-label`, five prefixed ids (`wtfav-*`) that will not collide with a
host page, no `currentColor` anywhere — every color is a literal.

**The roof.** Center `cx=10.9 cy=2.9 r=5.2`, biased up and toward the same limb the wall's own
highlight favors (STEEL's brightest stop sits at offset 0.36 from the left, the roof's center at
roughly the same fraction of the tank's width) so the cone reads as the SAME light as the wall
rather than a second source. Stops run `#ffffff` at the center out to `#c9d0d6` at the radius —
lighter throughout than the first attempt, which sampled at `#8f969c` on the outer ring and came out
barely brighter than the wall at all (see "what I rejected" below). **One continuous radial fill on
one triangle path, no ridge line drawn inside it** — Tom's second message settles that a visible
seam down the center would draw a gable, not a cone, and none is drawn.

**The bowl.** Center `cx=12 cy=14.15 r=5.4` — the springline itself, the underside's brightest
latitude — fading to `#454a50` at the radius, which reaches the bottom pole (`y=18.15`). Because the
center is a POINT and the fall-off is circular, the terminator curves by construction; no second
shape or overlay was needed to get that, unlike round 3c's `-lift-` row, which stacked a second
gradient on top of a flat one to fake a lighter zone near the top edge.

**Measured** (`ship-fav-radial-hemisphere` in `measurements.json`, byte-identical drawing to the
shipped file):

| px | catwalk ΔL | feet min | descenders apart | roof v wall ΔL | roof v sky ΔL | bowl v wall ΔL |
|---|---|---|---|---|---|---|
| 16 | 33.4 | 69.4 | 3 | n/a (no clear roof-fill pixel) | n/a | n/a (no clear bowl-fill pixel) |
| 32 | 123.1 | 176.7 | 3 | n/a | n/a | 62.7 |
| 48 | 128.0 | 189.7 | 3 | n/a | n/a | 60.9 |
| 192 | 131.6 | 189.7 | 3 | 26.1 | 28.7 | 69.1 |
| 512 | 132.1 | 189.7 | 3 | 41.7 | 45.0 | 70.5 |

**Radial costs nothing measurable over linear, at any size that ships.** Against
`ship-fav-linear-flat` (round 3c exactly as it stood on the sheet): roof-v-wall is 26.1 v 26.4 at
192 and 41.7 v 42.2 at 512 — noise, not a finding. Below 192 neither treatment has a clear roof-fill
pixel (the cone is 1.5 units deep under a 2-unit outline on this aspect), so radial is not competing
with linear there, it is simply drawing the physically correct shape for free. Shipping radial is
not a trade; the correction is a strict improvement with a measured cost of zero.

**The hemisphere bowl beat the flat one on EVERY axis, including the one round 3c's `-lift-` hack was
built to protect.** Catwalk ΔL is 33.4 at 16px against the flat bowl's 30.5, and stays 4-6 points
ahead at every size — the springline-centered radial keeps the area right under the catwalk lighter
than a flat dark fill would, without a second gradient layered on top. Bowl-v-wall drops from
68.8/66.5/72.2/72.8 (flat) to 62.7/60.9/69.1/70.5 (hemisphere) — a real but small softening, and the
underside is still unmistakably the darkest surface at every size. **Two independent arguments land
on the same row**: round 3c reached for `-lift-` to protect the catwalk metric, without knowing the
belly was a hemisphere; now the physically correct shape protects the same metric on its own, better,
and with one gradient instead of two.

**Dark ground / dark browser chrome.** Rendered at 16/32/48 on `#ffffff`, `#1e1e1e` (this suite's
dark page ground) and `#202124` (a common dark toolbar tone) — see the proof sheet. **The sky square
holds on all three.** It is a filled 24×24 square carrying its own gradient and clouds; nothing about
it depends on the surrounding page, and a dark tab bar around a light sky square is exactly how every
other favicon on a dark browser reads. No change needed.

**What I rejected.** A first radial attempt used `objectBoundingBox` units, which stretched the
gradient into an ellipse matching the roof's 8.1×1.5 bounding box and produced almost no visible
falloff (roof v wall ΔL fell to 0.3 at 192, from 26.4 on the linear row) — the unit circle a
box-relative gradient assumes has no relationship to the cone's actual proportions, and it is why
`userSpaceOnUse` is used for both new gradients. A second attempt's outer stop (`#8f969c`) was too
dark and pulled the roof's average tone down toward the wall's, which is the opposite of "lighter
in the sun" — lightened to `#c9d0d6` in the shipped file.

## Deliverable 2 — `ship-water-menu.svg`

**What it is.** The round-3 PICK (`ic-mono-hatch-lr`'s wall hatch — one line on the sunlit left limb,
two on the shadow right limb, bare band between) plus new ink under the bowl line: five short
vertical strokes fanning from the springline, `stroke-width` 0.7-0.85, deliberately packed closer
than the 2.5-unit gap floor. **That packing is a deliberate override, stated here**: these strokes
are not meant to stay legible as five separate lines — they are meant to FUSE into a mass, the way a
hatched shadow does in line engraving, because the belly is uniformly the darkest surface and a
mid-tone MASS is the correct one-ink reading of that, not five readable lines. The roof stays
completely bare, per Tom's own reduction of the three-surface reading to one ink: nothing lighter
than the paper exists, so the lightest surface gets no ink at all and the darkest gets the most.

Constraints checked directly:

- **No `A` arcs anywhere.** `php dev/scripts/icon_ascii_preview.php --geom='<the file's geometry>' --size=17`
  ran clean (output below); the tool would have gone silently blind on an arc rather than erroring,
  so a clean run is the only confirmation available and it is a real one — it rendered a correct
  crown, tank, catwalk and descenders.
- **No roof overhang; riser thicker than a leg; catwalk overhangs both walls; every descender reaches
  `y=24`.** All unchanged from the round-2/3 geometry — this deliverable adds ink, it does not move
  a single structural coordinate.
- **`stroke-linecap="butt"` on every hatch/belly stroke**, stated explicitly per group, because the
  default caps on the outline group are round and a butt line reads as a straighter, thinner mark.

**Measured** (`ship-menu-belly` in `measurements.json`; `ship-menu-wall-only` is the round-3 PICK
unchanged, for comparison; net grade is against `ic-mono-plain`'s control, recomputed here as
`{16:5, 17:3, 24:2, 32:3}`, matching round 3's own numbers):

| px | wall net grade | bowl grade, wall-only | bowl grade, +belly | feet min ΔL | descenders apart |
|---|---|---|---|---|---|
| 16 | +0 (5-5) | 0 | 1 | 87 | 3 |
| 17 | +0 (3-3) | 3 | 2 | 50 | **1** |
| 24 | +0 (2-2) | 1 | 3 | 226 | 3 |
| 32 | +0 (3-3) | 2 | 3 | 222 | 3 |

`wall net grade` is unchanged because it is the row-11 cylinder probe from round 3 and the belly ink
sits below it — it is reading exactly what it read for the PICK before. `bowl grade` is a new probe
here (`bowlProfile()` in `gen-ship.js`), a column through the bowl (y 14.15-18) rather than a row
through the wall, because the belly's shading runs top-to-bottom, not left-to-right, and needed its
own axis to be measured on. **It rises at 16, 24 and 32px and reads noisier at 17**, which is a
single-column probe on a five-stroke fan and moves by which stroke the column happens to land on at
that particular raster; the visual read (proof sheet) is unambiguous at every size in `MEN_SIZES` —
the belly is visibly darker than the wall-only row from 16px up.

**One footnote that is NOT from this round's work**: at exactly 17px the three descenders (left leg,
riser, right leg) touch into ONE run on the bottom row rather than three, though the weakest one's
own contrast (ΔL 50) is unchanged and well clear of the fail threshold — they are still solid dark
legs, they simply share a pixel at that one odd size. Identical on `ship-menu-wall-only`,
`ship-menu-belly` and the rejected clouds row, so it is the base TALL3 geometry at 17px specifically,
not anything added here; round 3's own mono table never measured "descenders apart" for these rows,
only ΔL, so this is new information rather than a regression.

**Clouds — tested, rejected.** Two shallow cubic-bezier bumps in the upper-left corner (no arcs),
tested at all four `MEN_SIZES`. At 16 and 17px they render as a formless gray smudge in the corner —
see `render/ship/ship-menu-belly-clouds@17-lt.png` and the "Rejected" row on the proof sheet — not
readable as a cloud, only as noise, because there is only 2.2 units of headroom between the frame top
and the roof's apex and a stroke-only mark in that space cannot separate from its own antialiasing at
this size. At 24 and 32px they are legible but still marginal, and 24-32px is not where a menu icon
is judged. **Left out of the shipped file.** He said he trusts me here rather than that he requires
clouds, and the measurement agrees with leaving them out.

**The L question, tested directly rather than argued.** The shipped `water` icon today is
`wt-wide-L`, drawn on WT-WIDE's dome, which is 3.65 units tall (`y` 2.4 to 6.05) and wide enough to
hold a 4.2-unit-tall letter with room either side. WT-TALL-3's crown is a CONE, 1.5 units tall
(`y` 2.2 to 3.7) — under half the dome's height — and its cylinder body's clear interior is 6 units
wide, 4.2 pixels at 17px (already measured in round 3's mono section). I rendered an L at both
locations and looked at the raster rather than the vector:

- **In the crown**: at 17px AND at 32px, the L fuses completely into the cone's own outline — zero
  legible letter pixels at either size. The crown is structurally too shallow; this is not a
  resolution problem that a bigger icon fixes.
- **In the body**: legible at 32px, but at 17px it is an ink blob fused with the tank wall — not a
  letter, just a darker patch. `render/ship/L-test.png` shows both, at both sizes.

**The L cannot come along onto this geometry at menu size. The number: the crown is 1.5 units tall
against the dome's 3.65, and the body's own clear interior is 4.2 pixels at 17px** — under the floor
either way. **This is the question for Tom.** Options, not mine to choose: drop the letter from the
menu mark entirely (the tower itself is now distinctive enough that round 3 never needed one to tell
the two aspects apart); keep `wt-wide-L`'s WIDE geometry for the menu icon specifically while the
favicon ships the new TALL aspect (the two icons do not have to be the same drawing, only the same
brand); or accept the letter only from 32px up, same as round 2 already found for `wt-wide-L` itself.

```
$ php dev/scripts/icon_ascii_preview.php --geom='<g fill="none" stroke="currentColor" ...>...' --size=17
(--geom) @ 17px
----------------------------------
                ..                
          ..::**##**::..          
          ####**::**####          
          ##..    ....##          
          ##**    ::::##          
          ...
```
Full output: ran clean, crown/tank/catwalk/descenders all present and correctly proportioned — see
the transcript above and in the session log; not reproduced in full here since it is a coarse ASCII
grid that cannot show the sub-2 hatch strokes (they are under the grid's own resolution) and is only
being cited as evidence that no `A` command broke the parser.

## What is NOT resolved

- **The L question**, above — his call.
- **Whether `ship-favicon.svg`'s exact gradient stop values want a designer's second pass** once seen
  on an actual browser tab rather than a PNG — the measurements say the treatment is sound; taste on
  the precise stop colors was not re-litigated here.

## Addendum, same session: clouds reopened

Both drawings deployed and Tom loved them, then reopened the menu glyph:

> "There is a lot of free/waste width on the menu icon. Can Ida figure out how to evoke clouds or a
> bird or two in the sky? This is not a cartoon. This looks real and out of a western movie. So we
> need to keep with that."
> "The same clouds as the favicon would be amazing if there is a way to give a nod to them."

**Why the first trial failed and this one does not.** The first cloud trial (main section above)
tested the 2.2 units of headroom above the cone's apex, and there genuinely is nothing to be done in
2.2 units. Tom was pointing at the FLANKS: wall ink spans x 6.95-8.95 (left) / 15.05-17.05 (right),
the catwalk's round cap reaches x 6.1-17.9 but ONLY at y=13.55, and everything else in the 24-unit
frame is clear — roughly 6.95 units on each side, full height. That is the space this addendum uses.

**Deliverable: `dev/icon-preview/ship-water-menu-clouds.svg`.** The shipped `ship-water-menu.svg`
geometry (wall hatch + belly ink, both untouched) plus two flattened open waves, one per flank:

```
M1 5.5C1.92 4.95 2.38 4.95 3.3 5.5C4.22 4.95 4.68 4.95 5.6 5.5      (left,  stroke-width 0.6)
M18.4 9C19.32 8.5 19.78 8.5 20.7 9C21.62 8.5 22.08 8.5 23 9         (right, stroke-width 0.6)
```

**The nod, exactly.** `ship-favicon.svg`'s three sky ellipses are `cx=6 cy=5.5 rx=6 ry=1.7` (left),
`cx=18.5 cy=9 rx=5.5 ry=1.5` (right), `cx=11 cy=19.5 rx=8 ry=1.9` (low, behind the legs). The menu
clouds sit at the SAME two heights, `y=5.5` and `y=9` — literally the nod he asked for, translated
from filled ellipses behind the tank (not available in one ink with no fill) to open strokes beside
it. The third, low ellipse has no flank equivalent — the flanks below the catwalk are legs and open
ground, not sky, so it is not carried across; noted rather than silently dropped.

**Shape, not just position, matters for the "not a cartoon" instruction.** A closed loop or a stroked
oval reads as an outlined puff — the cartoon he is warning off. An open two-bump wave with no fill is
the one-ink equivalent of a WIDE, FLAT stratus band (the favicon's own `ry` under 2 against `rx` of
5.5-8) rather than a cumulus outline, and it is drawn exactly that flat: 4.6 units wide, 0.5-0.55
units of bump.

**The catwalk trap, measured rather than assumed.** A new probe (`flankInk()` in
`gen-ship-clouds.js`) reads each flank as a box and reports the strongest row's run count and pixel
count. The control (`cl-none`, the shipped no-clouds file) shows 0-2 stray pixels from antialiasing
bleed at every size — that is the noise floor. The shipped candidate (`cl-nod`) clears it by 3-8x:

| px | left flank px (control → clouds) | right flank px (control → clouds) |
|---|---|---|
| 16 | 1 → 5 | 0 → 3 |
| 17 | 2 → 6 | 1 → 5 |
| 24 | 2 → 6 (2 runs, i.e. broken/wavy) | 0 → 5 |
| 32 | 2 → 8 (2 runs) | 1 → 7 |

Both clouds sit well clear of the catwalk row in every raster examined (proof:
`render/ship/nod-vs-high.png`, `render/ship/clouds-addendum-sheet.png`) — at no size does either
mark align with, extend, or get mistaken for the y=13.55 bar; they are visibly higher, visibly
lighter (antialiased mid-tone against the catwalk's solid ink), and visibly broken into 1-2 short
runs rather than one continuous bar. I also tried a second candidate (`cl-high`, both clouds pushed
to a single higher, symmetric height) to see whether more separation from the catwalk reads better;
it measures almost identically and looks slightly more like a deliberate frame ornament than weather
— the asymmetric nod height, being literally what he asked to see again, is the one shipped.

**A bird — tested, rejected, with the raster.** The classic two-stroke gull (`M x0 y C ... C ... x1
y`, one shallow cubic bump each side, 2.2 units wide, 0.55 tall, 0.55-wide stroke) never resolves
into a recognizable shape at ANY size tested, 16 through 32px — it stays a single soft blob the whole
way (`render/ship/clouds-addendum-sheet.png`, "Rejected" row; raw frames `cl-bird-only@*.png`). At
32px it is still one undifferentiated smudge, not two legible strokes; the shape needs roughly the
same 4.6-unit span the clouds use before the two bumps separate, and at that span in this location it
would read as a third cloud, not a bird. **Measured no, at every size this deliverable is judged at.**
Left out.

**Constraints checked again for this file specifically**: `fill="none"`, `stroke="currentColor"`, no
ground, `M/C` only in the new paths (confirmed with `grep -o ' A[0-9 .,-]*'`, empty), sub-2 stroke
widths (0.6 on both cloud strokes) stated here and in the file's own comment-equivalent (the
`ship-notes.md` entry, since SVG has no first-class comment convention this suite relies on).
`icon_ascii_preview.php --geom=... --size=17` ran clean and shows both wisps sitting outside the
tower's own silhouette at their intended heights.

Proof: `render/ship/clouds-addendum-sheet.png` (final file at all four menu sizes, light and dark,
plus the no-clouds/with-clouds comparison and the rejected bird). Raw candidates and measurements:
`render/ship/cl-*.svg`, `render/ship/clouds-measurements.json`.
