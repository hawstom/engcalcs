# Label bench

The neutral bench every label placer is run on (dev/label-placement-rules.md §5, "The job"). It
builds no placer.

**If you are building a placer: read `dev/label-placement-rules.md` Part A only — §1 through §5
(the goal, Never, what the result looks like, the hints, and the job). Do not read Part B (§5-§6
held back, and §6) of that file, this repo's `judges/` directory, this branch's or this bench's git
history, or the app's existing label placement code (`js/lpn-collide.js` and friends) — those hold
secret tests and prior answers you are meant to solve independently.**

```sh
node dev/lpn-spike/label-bench/run.js --placer <your-placer.js>            # one table, exit 1 on any N1, N3, N4 or N5 break
node dev/lpn-spike/label-bench/run.js --placer <path> --only novato-seq --verbose
node dev/lpn-spike/label-bench/run.js --placer dev/lpn-spike/label-bench/placers/master-replay.js   # the baseline
node dev/lpn-spike/label-bench/selftest-harness.js                          # the bench checks itself (in check_all)
node dev/lpn-spike/label-bench/extract.js                                   # regenerate scenes/ and master/ from the app
```

## The contract

A placer is a **pure function of one view**. No page, no DOM, no text measurement: everything is
in **view pixels** (origin at the map canvas's upper-left, y down), and every row of every label
arrives already measured. The full typedefs are the doc comment at the top of `contract.js`.

**In** (`place(scene, {prev})`): the viewport; `view` (model to view: `px = model * s + t`, for a
placer that caches in model space); the lettering (row height, the separator a one-line label
joins rows with and its width, the longest allowed hook); the user's per-kind value **drop order**
(first to go first; the ID row is never in it); **every** node (centre and symbol box) and link
(polyline in view px, pump/valve symbol, flow arrows), on screen or not, since the model runs off
the screen on every side; the user's label `settings` (whether pipe labels are drawn along their
pipes, and the reading window a turned label keeps to); Text objects and customer symbols as fixed boxes; and the **labels
requested** at this view (owner on screen): owner, kind (node, link, customer, text), anchor, rows
(field, text, measured w and h), usual shape (a node label stacks, a pipe label is one line),
`hand`, the leader end point the user dragged it to, or null, and on a pipe label `along`, true
when the setting asks it to lie along its pipe (R14). `prev` is the previous view of the
same set and the layout you returned for it -- there is no rule that a label hold still, but `prev`
is what lets a placer avoid churn (see "What is scored" below) if it wants to.

**Out**: `{labels: {id: placement}}`. A missing label, or `{shown: false}`, is hidden. A shown one
gives the row indices shown, `layout` (stack or line), `align` (left, right, center: which edge a
stack's rows share, justified to the side its leader arrives from, R5), `x, y` (top-left of the
unturned block), optional `angle` (turned about the block centre, for a pipe label along its
pipe), and `leader`: null, a straight segment from the owner to the text, or three points for the
one standard hook (last leg horizontal, at most `text.hookMaxPx`).

**Cache (hint H-b, "hard thinking can wait for pauses and be cached across zooms")**: a module may
export `{create: () => placer}`; `create()` runs once per scene set, as a project opening would. A
placer may have `idle(budgetMs, {scene, opening})`: the bench calls it before the first view of a
set (3000 ms budget, the project opening) and between views (250 ms). Idle time is reported
separately and is not in the layout times.

**On the real map (a development host only)**: save the placer as `js/lpn-placer-<name>.js`
(`<name>` in `[a-z0-9-]`) and open `Looped-Network.php?placer=<name>`. The file must export the
module for node (`module.exports`, so `run.js --placer js/lpn-placer-<name>.js` takes the same
file) and register it for the page as `EngCalcs.lpnPlacers['<name>'] = module`, in plain browser
JavaScript with no `require`; `js/lpn-placer-trivial.js` is the pattern to copy. The page builds
each scene with the same function `extract.js` uses (`js/lpn-label-scene.js`), measuring rows in
the real font, and draws the answer with the app's own labels and leaders. It calls `place()`
once a pan or zoom has settled, never during one; `idle()` from `requestIdleCallback` after each
layout (3000 ms in all after a project's first, `opening: true`; 250 ms after the others); and
`create()` again whenever another project is opened. R15 is the page's part: from the moment the
view reaches a scale the last layout was not made for (a zoom, a newly opened project) it hides
every node and link label, and shows them again when `place()` has answered, so no label is seen
in an unconfirmed position. A pan at the same scale hides nothing. A slow `place()` is therefore a
longer blank after each zoom, which is what R10 asks you to keep short.
On the page, `scene.viewport` is the map a reader can see: the canvas less the strips its mode
hint (top) and status footer (bottom) cover, so its `y` is not 0, and a label whose owner sits
under a strip is not asked for. What else the page draws over the map (legends, the zoom buttons,
the status chips) arrives as `scene.furniture`, boxes to keep clear of as of a Text object; the
bench's own scenes have none.

## What is scored

On the ink `contract.js` derives (one box per row of a stack, so the ground beside a short row
stays free; boxes are the row's line pitch, and overlaps of 1.5 px or less are leading, not ink).
**N1, N3, N4 and N5 must be zero; everything else is REPORTED, never failing** -- there is no
stillness rule and no numeric target for the rest, only the order Tom gave the costs in.

- **N1, N3, N4 and N5 breaks, each reported separately, all of which must be zero**: N1 a label on
  a symbol (node, pump, valve) or another label; N3 a leader through another node's symbol box; N4
  a hand-placed label hidden, or not still hanging at its user's point; N5 a label on a Text object.
  An **invalid** placement (a bent leader that is not the standard hook, one that does not start on
  its owner or reach its text) counts with them. A leader crossing another leader is not one of
  these breaks — it is the worst of the weighted crossing costs below (there is no N2).
- **Crossing cost, by rank**, worst to least: leader on leader (4), label on leader (3), label on
  pipe (2), leader on pipe (1); a label on a customer costs nothing. Each crossing counts its place
  in that order and nothing more: the order is all the rules give (§3, "Costs, worst first"). A pipe label on its
  own pipe is not a crossing (it is reported separately, R7 below); a leader meeting pipes at its
  own start is not one either.
- **Rows shown / rows requested; labels shown / labels requested.**
- **Leader length**, median, p90 and max, in label heights (the shown block's own height).
- **Churn** between consecutive views of a set: a label shown in both whose block moved more than
  1 px against its anchor (unless only its far edge moved, as when a row grows), turned, or was
  hidden. A move counts as churn only if it **shows nothing more for it** (the same or fewer rows
  shown, not newly shown) **and fixed no break** -- if the old placement, carried unchanged to the
  new view, would now lie on a symbol, a Text object or a label of the new layout, the move fixed
  that and is not churn either. A move that shows more (regrowing a row dropped at the last view,
  on zoom-in) is never churn, whatever moved to make room for it.
- **R5, reported**: of the shown stacked labels with a leader, how many are not justified to the
  side the leader arrives from (nearer the block's left edge should be `align: 'left'`; nearer the
  right, `'right'`).
- **R7, reported**: of the shown pipe labels, how many sit on their own pipe rather than beside it.
- **R9, reported**: of the shown pipe labels whose pipe is longer than `scene.text.repeatSpacingPx`,
  how many carry repeats (`placement.repeats`) versus how many should.
- **R14, reported**: of the shown pipe labels the user's "Draw link labels along the link line"
  setting asks to lie along their pipe (`along: true`), how many do (turned to the pipe where they
  sit, within 5 degrees, and reading inside `scene.settings.readableAngleDeg`); and of the rest, how
  many had room to: the same rows as one line, turned to the pipe and half a row clear of it, fitting
  at or near the middle of the pipe's on-screen stretch on either side, over no symbol, label, Text
  or other pipe, on screen (`alignedRoom()` in `score.js`). The same figure is given again for the
  close views alone (4x and closer, where there is plenty of room): of the pipe labels still level
  there, how many had room to lie along their pipe with the same rows. It should be near zero.
- **R13 on a settings change, reported**: the first view of each set, placed with "Draw link labels
  along the link line" on, then again at the same view with it off and `prev` set to the first
  layout (as the page does when the user unticks it): how many shown pipe labels are still turned.
  It should be none.
- **R11, reported**: across the zoom-in steps of a set (`view.s` increasing), rows regained (shown
  now that were not, or more of them) versus rows lost, summed over labels present in both views.
- **Time per layout**, median and max, with the machine it ran on.

## Scenes (`scenes/`)

Extracted from the real app by `extract.js`: `js/looped-network.js` evaluated against
`dev/lpn-spike/lpn-dom-stub.js`, as `label-crossing-measure.js` does it, each example solved
through the vendored EPANET engine, canvas 1400 x 900, each file's labeling threshold cleared (it
hides every label at these views).

| Set | Views | What |
|---|---|---|
| `net1` | 1 | EPA Net1 on the view it opens on, its own label settings; three hand-placed node labels and one pipe label |
| `net2` | 1 | EPA Net2, likewise |
| `net3` | 1 | EPA Net3, likewise; one hand-placed label |
| `novato-zoom` | 4 | Net3 on the world map at Novato: fit, 2x, 4x, 8x about the node centroid; node labels ID, P, Qb, Z |
| `novato-seq` | 8 | The same, zoomed about node 179 in steps 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4x: the stability sequence |

**Text widths** are the app's own headless measure, the DOM stub's nominal advance: 6 px per
character at 11 px text, scaled with the text size (12 px here, so 6.55 px per character). It is
not a font metric; it is what every headless harness in this repo measures with. Rows are 1.2 em
(14.4 px). Text object boxes are the app's own obstacle boxes, as the page computes them.

**`scene.text.repeatSpacingPx`** (R9) is filled in at load time by `run.js`'s `loadSets()`, from
the scene's own viewport (`0.75 * min(viewport width, viewport height)`, master's
`labelRepeatSpacing()` in `js/looped-network.js`) rather than by re-running `extract.js`'s headless
browser pass for a field that is entirely derived from a viewport already in every committed scene.
Every scene here shares one fixed 1400x900 canvas, so this is one number (675) for all of them.

## The two reference placers (`placers/`)

- `trivial.js`: every label whole at its node's upper right, no leaders. It exists to show the
  scorer catching breaks.
- `master-replay.js`: **the baseline**. The layout the shipped page drew for each scene, recorded
  by `extract.js` in `master/`. It is a replay, not a live call: master's placer is a chain of
  passes inside `js/looped-network.js` that rebuild glyphs and re-measure the DOM between them, so
  it cannot be driven from bench input without rewriting its orchestration. Its time is the page's
  whole `refreshLabelText()` (content and layout) on the node stub, which overstates placement
  alone. Re-run `extract.js` whenever master's placement changes.

## Baseline, round 3, 2026-09-28

`node dev/lpn-spike/label-bench/run.js --placer dev/lpn-spike/label-bench/placers/master-replay.js`,
on Intel(R) Core(TM) i7-7500U CPU @ 2.70GHz, 4 threads, 12 GB, linux 6.18.33.2-microsoft-standard-WSL2, node v24.16.0.
The cost column counts each crossing by its rank (see "What is scored"):

```
scene                      N1   N3   N4   N5  inv     cost         rows       labels  ldr med    p90    max    churn      ms
net1@open                   0    0    3    0    0      0.0        76/78        24/24      2.2    4.6    4.6             41.7
net2@open                   0    0    0    0    0      1.0      107/263        47/76      2.2    2.9    2.9            134.0
net3@open                   0    3    1    0    0     57.0      135/615       85/216      1.6    2.8    2.8            386.7
novato-seq@1x               0    1    0    0    0     25.0       60/734       54/216      1.7    1.7    1.7            217.4
novato-seq@1.25x            0    2    0    0    0     44.0       80/734       70/216      2.2    2.2    2.2    38/54   271.7
novato-seq@1.5x             0    6    0    0    0     52.0      121/734       82/216      1.5    2.6    5.9    42/70   454.0
novato-seq@1.75x            0    3    0    0    0     62.0      145/713       94/209      1.7    3.0    3.0    51/78   335.9
novato-seq@2x               0    5    0    0    0     60.0      159/683       95/199      2.0    3.4    3.4    53/87   455.8
novato-seq@2.5x             0    4    0    0    0     55.0      190/622       99/181      2.5    4.3    4.5    37/85   317.9
novato-seq@3x               0    0    0    0    0     45.0      203/536       85/156      1.4    2.5    5.0    24/83   249.6
novato-seq@4x               0    2    0    0    0     28.0      184/400       71/117      1.4    2.5    2.9     9/60   268.1
novato-zoom@fit             0    1    0    0    0     23.0       60/734       54/216      1.7    1.7    1.7            207.2
novato-zoom@2x              1    5    0    0    0     67.0      181/734      106/216      2.0    3.4    3.4    15/54   221.7
novato-zoom@4x              0    2    0    0    0     32.0      253/459       91/134      1.4    2.5    2.9    11/58   259.0
novato-zoom@8x              0    0    0    0    0     12.0      126/174        40/51      1.0    1.3    2.4     3/27   245.1
TOTAL                       1   34    4    0    0    563.0          25%          45%      1.7    3.0    5.9  283/656        
REPORTED, never failing -- R5 leader-side align: 0/141 stacked+leadered labels not justified to
their leader's side; R7 label-on-own-pipe: 0/221 shown pipe labels sit on their own pipe; R9
repeats: 0/0 pipes longer than the repeat spacing carry repeats; R11 zoom-in row change: 684
regained, 63 lost, across zoom-in steps; R14 along the pipe: 220/220 shown pipe labels the setting
asks to lie along their pipe do, and 0 of the rest had room beside their pipe to
```

Every scene is saved with "Draw link labels along the link line" on, and master draws every pipe
label it shows along its pipe (R14 220/220).

`node dev/lpn-spike/label-bench/run.js --placer dev/lpn-spike/label-bench/placers/trivial.js`, same
machine — every N1 break is a whole pipe label run over its node, exactly what `trivial.js` is for:

```
TOTAL                    16825    0    0   57    0  94938.0         100%         100%        -      -      -   3/1695        
time per layout: median 0.3 ms, max 1.5 ms
BREAKS: 16882 (N1, N3, N4, N5 and invalid placements must be zero)
```

Copyright 2009 Thomas Gail Haws. Licensed under GNU GPL v3.0 or later.
