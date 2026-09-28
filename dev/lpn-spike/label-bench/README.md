# Label bench

The neutral bench every label placer is run on (dev/label-placement-rules.md §4.1). It builds no
placer. **`judges/` is for the judges only; a builder must not read it.**

```sh
node dev/lpn-spike/label-bench/run.js --placer <your-placer.js>            # one table, exit 1 on any N1-N4 break
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
the screen on every side; Text objects and customer symbols as fixed boxes; and the **labels
requested** at this view (owner on screen): owner, kind (node, link, customer, text), anchor, rows
(field, text, measured w and h), usual shape (a node label stacks, a pipe label is one line), and
`hand`, the leader end point the user dragged it to, or null. `prev` is the previous view of the
same set and the layout you returned for it, for rule T1.

**Out**: `{labels: {id: placement}}`. A missing label, or `{shown: false}`, is hidden. A shown one
gives the row indices shown, `layout` (stack or line), `align` (left, right, center: which edge a
stack's rows share), `x, y` (top-left of the unturned block), optional `angle` (turned about the
block centre, for a pipe label along its pipe), and `leader`: null, a straight segment from the
owner to the text, or three points for the one standard hook (last leg horizontal, at most
`text.hookMaxPx`).

**Cache (rule T2)**: a module may export `{create: () => placer}`; `create()` runs once per scene
set, as a project opening would. A placer may have `idle(budgetMs, {scene, opening})`: the bench
calls it before the first view of a set (3000 ms budget, the project opening) and between views
(250 ms). Idle time is reported separately and is not in the layout times.

**On the real map (a development host only)**: save the placer as `js/lpn-placer-<name>.js`
(`<name>` in `[a-z0-9-]`) and open `Looped-Network.php?placer=<name>`. The file must export the
module for node (`module.exports`, so `run.js --placer js/lpn-placer-<name>.js` takes the same
file) and register it for the page as `EngCalcs.lpnPlacers['<name>'] = module`, in plain browser
JavaScript with no `require`; `js/lpn-placer-trivial.js` is the pattern to copy. The page builds
each scene with the same function `extract.js` uses (`js/lpn-label-scene.js`), measuring rows in
the real font, and draws the answer with the app's own labels and leaders. It calls `place()`
once a pan or zoom has settled, never during one; `idle()` from `requestIdleCallback` after each
layout (3000 ms in all after a project's first, `opening: true`; 250 ms after the others); and
`create()` again whenever another project is opened.

## What is scored

On the ink `contract.js` derives (one box per row of a stack, so the ground beside a short row
stays free; boxes are the row's line pitch, and overlaps of 1.5 px or less are leading, not ink):

- **N1-N4 breaks, which must be zero**: a label on a symbol (node, pump, valve), another label, or
  a Text object; two leaders crossing; a leader through another node's symbol box; a hand-placed
  label hidden, or not still hanging at its user's point. An **invalid** placement (a bent leader
  that is not the standard hook, one that does not start on its owner or reach its text) counts
  with them.
- **Weighted crossing cost**, Tom's §3.1 table: label on leader 0.7, label on link 0.3, leader on
  link 0.2, label on customer 0, plus the breaks at their own weights (1, and 0.9 for leader on
  leader). A pipe label on its own pipe is not a crossing; a leader meeting pipes at its own start
  is not one either.
- **Rows shown / rows requested; labels shown / labels requested.**
- **Leader length**, median, p90 and max, in label heights (the shown block's own height).
- **Unforced moves** between consecutive views of a set: a label shown in both whose block moved
  more than 1 px against its anchor (unless only its far edge moved, as when a row grows), turned,
  or was hidden; forced only if its old placement, carried unchanged to the new view, would now
  lie on a symbol, a Text object or a label of the new layout.
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

## The two reference placers (`placers/`)

- `trivial.js`: every label whole at its node's upper right, no leaders. It exists to show the
  scorer catching breaks.
- `master-replay.js`: **the baseline**. The layout the shipped page drew for each scene, recorded
  by `extract.js` in `master/`. It is a replay, not a live call: master's placer is a chain of
  passes inside `js/looped-network.js` that rebuild glyphs and re-measure the DOM between them, so
  it cannot be driven from bench input without rewriting its orchestration. Its time is the page's
  whole `refreshLabelText()` (content and layout) on the node stub, which overstates placement
  alone. Re-run `extract.js` whenever master's placement changes.

Copyright 2009 Thomas Gail Haws. Licensed under GNU GPL v3.0 or later.
