# Phase 0 canvas spike — acceptance criteria (written before testing)

Per ROADMAP Task 146. `canvas-spike.html` is a standalone SVG DOM spike (`createElementNS`, no
`innerHTML` rebuild), throwaway, no PHP/lang keys/solver/persistence.

## Pass conditions

1. Drag is visually smooth at ~20 nodes **on a real mid-range phone**. *(Needs an actual device —
   not verifiable from this environment. Open the file on a phone browser and drag a node while
   watching the fps counter; target is a steady number close to the display refresh rate, no visible
   stutter.)*
2. The 200-node grid (toggle button) degrades gracefully rather than freezing the tab.
3. Pinch zoom works on iOS Safari and Android Chrome without fighting page scroll. *(`touch-action:
   none` is set on `#canvas`; needs on-device confirmation.)*
4. A 2 px link is finger-tappable. *(Links use `stroke-width:2` in world units at the built scale —
   confirm the rendered stroke is comfortably tappable on a real touchscreen, not just clickable with
   a mouse.)*
5. Arabic and Amharic labels shape and order correctly; neither label mirrors the network geometry.
6. Print preview is crisp vector output (SVG stays SVG through `window.print()`, not rasterized).
7. ≤300 LOC.

## What this build demonstrates (desktop-verified, Chromium)

- Pan (drag on empty canvas), wheel zoom about the cursor, zoom-extent button.
- Node drag with incident links (straight and vertex-bent) following live.
- One link vertex handle, draggable independently of its endpoints.
- Click-to-popup on a node with an Elevation field that writes back and re-renders the node label.
- A draggable label with a leader line, independent of its anchor node — one in Arabic
  ("خزان (reservoir)"), one in Amharic ("መስቀለኛ መንገድ (junction)").
- A registered backdrop image: file input, two-point click registration, typed real distance sets
  image scale — the bar-scale-screenshot workflow from the scope doc's Backdrop section.
- A 200-node grid behind a toggle, kept in its own hidden `<g>` so it costs nothing until shown.
- An fps counter (rAF-based, counts real pointermove frames) for the on-device check in #1.

## What still needs a real device before Phase 0 can be called closed

Items 1, 3, 4 above are UI/perf claims a desktop browser can't validate. Test on: one iOS Safari
device, one mid-range Android Chrome device. If any of the four device-dependent criteria fail,
the ROADMAP entry's fallback applies: spike the identical scenarios on Leaflet + `CRS.Simple` and
compare artifacts before committing to a canvas technology.

## LOC count

`wc -l canvas-spike.html` — see file; body script is the number that matters for the ≤300 gate
(markup/CSS scaffolding is not the risky part). Currently over 300 total including markup/CSS after
the round-2 fixes below; not worth trimming on a throwaway spike.

## Round 1 on-device findings (Tom, first phone pass) — all fixed except one open design question

1. **No `<meta name="viewport">`.** Missing entirely, so mobile browsers laid the page out at a
   virtual ~980px width and shrank the whole thing to fit the screen — this alone explained "toolbar
   wider than the phone," "canvas is ~10% of the screen," and very likely why the Arabic/Amharic
   labels were invisible (their offsets landed outside the tiny mis-scaled viewport). Fixed: added
   the tag; also shortened button labels and made the toolbar wrap sanely on a narrow screen.
2. **20–45fps on drag, not a steady 60.** Root cause was in the harness, not the technology:
   `render()` tore down and rebuilt every SVG element (all links, all nodes, all labels) on *every*
   `pointermove`, rather than moving only what changed. Replaced with a one-time `buildDom()` plus
   `updateNode`/`updateVertex`/`updateLabelGeometry`, each touching only the elements incident to
   what moved (via a precomputed node→link and node→label incidence map). This is the correct
   SVG pattern and needed retesting on-device — a false-negative here would have wrongly counted
   against SVG in the Leaflet comparison.
3. **200-node grid nodes aren't draggable.** Not a bug — intentional. The grid exists purely as a
   rendering/pan headroom check (ROADMAP: "degrades gracefully rather than freezing"), not a second
   interactive network; it never got `data-node` ids. With the render-loop fix above, dragging the
   real 15-node network no longer touches the grid's DOM at all, so the grid's own interactivity
   doesn't bear on the target-scale (~20 node) drag-smoothness criterion.
4. **Off-canvas labels.** Independent of the viewport bug: `zoomExtent()`'s bbox only ever included
   node positions, so a label offset that carried it past the node bbox (as both demo labels did)
   could render outside the padded frame. Fixed by including every label's actual screen position
   in the bbox calculation, so whatever offset a label uses, zoom-extent always frames it.
5. **Backdrop vs. grid placement — open question, not a bug.** Tom's report: with a grid already
   on screen, there's no way to *position* a freshly loaded backdrop image relative to it — the
   spike's registration only sets scale, not placement. Expected at this fidelity (the spike is
   testing the two-point-registration *interaction pattern*, not shipping the feature), but it
   surfaces a real Phase 2 design question the scope doc's Backdrop section doesn't yet answer:
   does the backdrop get its own move/place step before registration (matching EPANET's flow —
   place, then register two points), or does the network defer to the backdrop's coordinate frame
   once registered (backdrop registered first, network drawn onto it after)? Decide in Phase 2, not
   here.

## Round 2 findings (Tom, PC Chrome + Android) — all fixed except one logged feature request

1. **Canvas rendered tiny again, on PC too this time — self-inflicted.** Round 1's "include labels
   in the zoom-extent bbox" fix used the demo labels' original offsets, one of which (`x:20,y:22`)
   was ~2.5–3x the 8-unit node spacing. That inflated the fit-everything box to roughly 2.5x width x
   2.25x height of the real network, shrinking the drawn network to a fraction of the canvas — this
   was device-independent, which is why it now showed up on PC Chrome too. Fixed by shrinking both
   demo labels' offsets to ~3 world units (well under one grid cell), which is also what a real
   property popup will look like — a short leader, not a long diagonal one.
2. **Drag fps read low and noisy (10-40 PC, ramping-to-60 on Android).** Not a rendering problem —
   a measurement problem. The fps counter counted raw `pointermove` events in a rolling window,
   which tracks input-device polling rate, not actual screen paint rate; a partial window at the
   start of a drag reads artificially low, exactly the "starts small, rises quickly" Android
   behavior Tom guessed was a polling artifact. Fixed by decoupling entirely: `pointermove` now only
   records the latest pointer position and sets a `dragDirty` flag; a single `requestAnimationFrame`
   loop (`tick()`) applies at most one drag update per real paint frame and measures fps against
   that same loop. The fps window also resets at the start of every drag so it no longer carries
   stale counts from before the gesture began.
3. **Node popup wouldn't open on PC at all.** Root cause: `svg.setPointerCapture(e.pointerId)` on
   pointerdown retargets subsequent events to the capturing element per the Pointer Events spec, and
   desktop Chrome applies that retargeting to the synthesized `click` event too — so `e.target` was
   always `<svg>`, never the node circle, and the `click`-based popup trigger silently never matched.
   Mobile Chrome apparently derives `click` from the original touch target instead of the
   capture-retargeted one, which is why the same code happened to work on Android. Replaced the
   `click` listener with tap detection inside `pointerdown`/`pointerup` (movement `<4px` = a tap),
   which sidesteps the platform inconsistency entirely rather than depending on it. The backdrop
   two-point registration handler had the identical latent bug (`e.target!==backdropImg` inside a
   `click` listener) — not yet reported broken on PC, but fixed the same way pre-emptively
   (`document.elementFromPoint` instead of `e.target`, listening on `pointerup`).
4. **Label-leader "Reset" — logged, not built.** Tom's ask: draggable labels need a way (double-
   click? a context menu? documented gesture?) to snap back to their default leaderless position.
   Real and correct for a production property-label feature, but out of scope for a spike whose job
   is validating the canvas technology, not shipping the labeling UX. Carry into Phase 1/2 design.

## Round 3 findings (Tom, PC + phone) — canvas-size bug fixed; one real scope decision recorded

1. **Canvas still tiny (~400x200) after the label-offset fix.** Different bug from round 2's: `<svg>`
   is a CSS *replaced element* (like `<img>`/`<canvas>`/`<video>`), and per spec, giving a replaced
   element `position:absolute` with all four insets (`top/right/bottom/left`) does **not** stretch it
   to fill its containing block the way it does for an ordinary element — the replaced element keeps
   its own intrinsic size (an unstyled `<svg>` defaults to roughly that 300x150–400x200 box) and is
   merely positioned by the insets. CSS alone can't override this for SVG; the standard fix is
   `width="100%" height="100%"` as HTML attributes on the `<svg>` tag itself, which is what was
   missing. Fixed.
2. **Polyline (bent, multi-vertex) pipe routing is not deferrable — confirmed by Tom on-device.**
   The scope doc's Phase 1 previously cut vertex editing entirely ("pipes are straight segments...
   removes the single hardest interaction from the first release"). Seeing the spike's one bent pipe
   next to fourteen straight ones settled it the other way: Tom called straight-only "not a
   post-deployment option... non-negotiable" — real pipe routing follows property lines and
   easements, which need bends. **This is exactly the kind of finding Phase 0 exists to surface
   before Phase 1 gets built on the wrong cut.** `dev/looped-network-calculator-scope.md` updated
   2026-07-29: vertex editing moved from Phase 3 into Phase 1's required feature set. Still open:
   whether Phase 1 needs one vertex per link (the spike's shortcut) or an arbitrary polyline — decide
   when Phase 1's data model is actually designed.

## Round 4 (Tom) — canvas size confirmed working; three design decisions built into the spike

Tom's round-3 fix confirmation: canvas size "getting there," fps steady ~60, node popup working on
PC. Four new items, all design/UX requests rather than bug reports:

1. **Label auto-flip.** A dragged label now flips its `text-anchor` (`start`→`end` and back) once
   the drag crosses 80% of the label's own rendered width past the anchor's vertical line, so the
   text always reads outward from its leader rather than doubling back over the node. Width is
   measured once via `getBBox()` in `buildDom()` and cached (`labelEls[i].width`); the flip state
   (`labelEls[i].side`) persists across drag frames so it doesn't flicker at the crossing point.
2. **Arbitrary-vertex links, decided (see scope doc).** Links now carry `verts: [{x,y}, ...]`
   instead of a single optional `vx/vy`. Double-click a link segment inserts a vertex at the nearest
   point on that segment; double-click a vertex handle removes it. Rendering is uniformly a
   `<polyline>` now (0 verts renders identically to the old `<line>` case), which also simplified
   `updateLinkGeometry` to one code path instead of two.
3. **Zoom-extent now fits rendered extent, not just anchor points.** `bbox()` previously used raw
   node/label coordinates; a node's circle radius (1.6 world units) and a label's actual text-box
   (cached width + side from #1) are now included, plus padding bumped from 10px to 16px. This is
   what "account for symbol and text sizes" asked for — nothing should clip at the fitted edge.
4. **Backdrop registration split into Scale and Position**, replacing the single combined
   "Register" button. Scale keeps the original two-click + typed-distance flow, now measured in the
   image's own pre-transform pixel space (`worldToImageLocal`) so a second Scale pass is absolute,
   not compounded onto whatever the first pass already did. Position is new: click a reference point
   on the image, then either click a network node to snap that point onto it, or Cancel the prompt
   to type target X,Y directly — the "click and select node or enter" split Tom asked for.
