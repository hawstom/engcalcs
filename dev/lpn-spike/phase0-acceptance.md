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
- Arbitrary link vertices (round 4): double-click a link to add a bend, double-click a bend to
  remove it — not capped at one, superseding the single-vertex description this bullet used to have.
- Click-to-popup on a node with an Elevation field that writes back and re-renders the node label.
- A draggable label with a leader line, independent of its anchor node — one in Arabic
  ("خزان (reservoir)"), one in Amharic ("መስቀለኛ መንገድ (junction)").
- A registered backdrop image: file input, two-point click registration, typed real distance sets
  image scale — the bar-scale-screenshot workflow from the scope doc's Backdrop section.
- A 200-node grid behind a toggle, kept in its own hidden `<g>` so it costs nothing until shown.
- An fps counter (rAF-based, counts real pointermove frames) for the on-device check in #1.

## Phase 0 closed — 2026-07-29 (round 13)

The on-device phone pass (items 1, 3, 4 above) is complete with no SVG-blocking issue found across
13 rounds of iteration plus an independent Opus subagent review. **SVG DOM is the confirmed
technology; the Leaflet + `CRS.Simple` fallback was never triggered.** See the ROADMAP Task 146
entry and the scope doc's Phasing section for the closure record.

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

## Round 5 (Tom) — grab-offset, zoom-extent, backdrop registration UX

1. **Drag grab-offset.** Reported for labels, but the same bug existed (less visibly, since the
   node/vertex circles are small) for node and vertex drags too: the element snapped so its anchor
   point sat exactly under the mouse on the first `pointermove`, instead of staying wherever within
   the element you actually grabbed it. Fixed uniformly for all three drag types: `pointerdown` now
   records `offX/offY` (the vector from the click's world point to the element's actual position)
   and every subsequent frame applies that same offset, so the element stays under the cursor at the
   point you grabbed rather than jumping to be centered on it.
2. **Zoom-extent still clipping — two things `bbox()` never accounted for.** The node ID/elevation
   text (e.g. "N12 104") drawn beside each node's circle wasn't in the box at all — only the circle's
   own radius was. Neither were a link's bend vertices — the demo pipe's pre-set bend pokes above the
   top row of nodes and was invisible to `zoomExtent()` entirely. Both fixed: node text width is
   cached via `getBBox()` (and re-measured on an elevation edit, since the string length can change),
   and every link's `verts` array is now included with a small handle-radius pad.
3. **Backdrop registration: three real bugs, one redesign.** All from the same root cause — a
   registration click was still visible to *normal* interaction, since nothing suppressed it.
   Introduced `regMode`, a flag that blanks `pointerdown`'s normal drag/tap handling for the
   duration of a click sequence; this fixes (a) clicking the alignment node also opening its
   properties popup, and (b) a node sitting on top of the backdrop image intercepting what was
   meant as an image click (dropped the `elementFromPoint===backdropImg` gate entirely — with
   regMode suppressing normal handling, whatever pointerup arrives next during a sequence is simply
   taken at face value). Position's flow was also redesigned per Tom's three modes: click a
   reference point, then either click a node (snaps exactly) or click anywhere else (uses that raw
   point) — auto-detected from the second click, no need to declare intent first — with typed X,Y
   demoted to its own separate, lower-priority "Position (coords)" button, matching Tom's own read
   that it's the rare case (mainly useful for an initial "origin is defined as 1000,1000" setup).
4. **Auto Length UX — logged as a design placeholder, not built.** Tom's sketch (per-link Auto/
   manual toggle in the property popup; a settings-panel default plus bulk force/release-all
   operations) recorded in `dev/looped-network-calculator-scope.md` next to the existing `lenAuto`
   schema field it builds on. Real Phase 1/2 design work, out of scope for the spike itself.

## Round 6 (Tom) — leader-jump, disjoint zoom-extent, mobile viewport, explicit Position modes

0. PC-primary testing confirmed as the intended approach for this session; phone checks stay
   reserved for touch-specific behavior (pinch, tap targets) rather than routine, per Tom's own
   RSI/eyesight tradeoff. Noted, not something to fix.
1. **Leader jumps, not text.** The round-5 flip changed `text-anchor` (start↔end), which visibly
   jumped the *glyphs* sideways at the decision point. Text is now always `text-anchor:middle` and
   tracks the drag point continuously with no jump; only the leader line's attachment edge (left or
   right side of the text's bounding box) flips at the 80%-width threshold — a thin line relocating
   reads as nothing, where glyph relocation read as a jump. `bbox()`'s label term updated to match
   (the text box is now symmetric around its point, not offset to one side).
3. **Two distinct bugs, not one.** (a) PC: asymmetric margins when a label sits above a visible
   grid. Root cause wasn't arithmetic — it was architectural: the grid (x:100-214) and the network
   (x:0-32) are spatially disjoint, so fitting both into one box forces a huge, mostly-empty span
   between them, and whichever axis ends up non-binding gets all its slack dumped in one lump. Fixed
   by not trying to fit them together at all: `bbox()` now fits *only* the grid while it's visible,
   network entirely excluded, since the grid was only ever meant to be a rendering/pan headroom
   check, not something to view alongside the network. (b) Android Chrome: bottom row always
   clipped. This is the well-known mobile "100vh problem" — `html,body{height:100%}` cascades from
   the *layout* viewport (assumes the address bar is collapsed), so `#canvas`'s `bottom:0` sits below
   what's actually on-screen whenever the address bar is showing. Fixed with `height:100dvh` layered
   after the `100%` fallback (dvh tracks the real, currently-visible viewport; browsers that don't
   support it just keep the fallback).
4. **Position target: explicit radio choice, not auto-detection.** Round 5's "click a node to snap,
   click anywhere else for a free point" auto-detected intent from what the second click happened to
   land on — which silently assumes a click near a node always *means* the node, with no way to
   express "I want a free point right next to this node." Replaced with a "Target:" radio group
   (Node / Free point / Coords) selected *before* the click sequence starts: Node mode ignores any
   click that isn't on an actual node (keeps waiting rather than falling back); Free mode takes the
   raw coordinate unconditionally, even directly on top of a node; Coords folds the old separate
   button into the same flow. Net effect: three unambiguous, separately-selectable behaviors instead
   of one button guessing.

## Round 7 (Tom) — label-flip math corrected, real CSS over-constraint bug found, cursor + wizard UX

1. **Label flip threshold — actual bug, not just a bad guess.** The round-6 `0.8` coefficient was
   measured from the wrong baseline (px crossing zero) rather than from a properly defined 0%/100%.
   Redefined precisely: 0% adverse = the text's *near* edge sits exactly at the anchor's vertical
   line (a zero-length leader); 100% = the text's *far* edge reaches that line, i.e. the whole box
   has crossed — Tom's hard cap, since flipping any later means the leader has to reach clear across
   the text. Under this definition the old `0.8` constant actually worked out to ~130% adverse,
   already past the cap Tom just set, which is consistent with what he saw (~160%, eyeballed).
   Replaced with `ADVERSE_FRAC=0.75` (mid of the stated 50-100% band), applied as
   `halfW*(1-2*ADVERSE_FRAC)`.
2. **Bottom nodes clipped on both platforms — a real, separate CSS bug, not incomplete dvh coverage.**
   `#canvas` had `top:34px; left:0; right:0; bottom:0` (CSS) *and* `width="100%" height="100%"` (the
   HTML attributes added earlier to fix SVG's replaced-element sizing). Combined, that's three
   non-auto constraints per axis (top, height, bottom) — an over-constrained box per CSS2.1 §10.6.4,
   and the spec requires the browser to silently drop one. Dropping `bottom` means the SVG's real
   height becomes a full 100% of body *regardless* of the 34px top offset, so the element's own box
   extends exactly 34px past the visible fold — clipped away by `overflow:hidden` on the page, but
   `getBoundingClientRect()` (which `zoomExtent()` reads) still reports the oversized box, so nodes
   got placed inside the part that was never actually visible. Worse on Android because `dvh`
   shrinks further while the address bar is showing, compounding the same overflow. Fixed by
   dropping `right`/`bottom` entirely and driving both axes from exactly two non-auto constraints
   each (`top`+`height`, `left`+`width`), which can't conflict.
3. **(a) Cursor still signaled interactivity during registration.** `regMode` correctly suppressed
   real interaction, but the CSS `cursor:pointer`/`cursor:move` rules on `.node`/`.link`/`.vhandle`/
   `.draglbl` fire purely from hover, independent of any JS state — so hovering a node during Scale
   or Position still looked clickable, which is exactly wrong for "Free" mode where clicking directly
   on a node must be ignored. Added a `.regmode` class (toggled by a new `setRegMode()` helper
   alongside the `regMode` flag itself) that forces `cursor:crosshair` everywhere inside the canvas
   while a sequence is active. **(b) "Target:" radio group demoted to wizard step.** Was sitting in
   the toolbar permanently, visible and relevant even when no Position sequence was running. Now
   hidden by default and shown only for the duration of a Position click sequence (mode is still read
   once, at the moment "Position" is clicked, before the sequence starts). Tom flagged the group's
   own layout/spacing as rough but explicitly out of scope for the spike — left as is.

## Known broken at this commit (Tom, going into round 8 — flagged, not yet fixed)

- **3a. Crosshair-forcing has momentary lapses near nodes, not reliably reproducible.** The
  `.regmode` cursor override works most of the time but occasionally the pointer/move cursor peeks
  through near a node during a Scale/Position sequence. Root cause not yet identified.
- **3b. Position wizard (reference point → target) is "pretty much broken and unclear."** Alert-based
  step instructions are wrong/misleading and the click sequencing doesn't hold up. The whole
  alert()-driven, nested-listener approach needs to be rethought together with Tom rather than
  patched again — next session starts there, not with another quick fix.

## Round 8 (Tom) — full backdrop-UX rebuild: dropdown, mutual exclusion, radios→select

**This round's log entry was missed at the time and reconstructed after an Opus review caught the
gap (see the round after next) — the code changes below all genuinely happened in round 8, this
paragraph is just late.** Tom's round-7-adjacent message raised four problems at once: (1) three
loose toolbar buttons (Scale/Position/etc.) read as visually unrelated to "Backdrop"; (2) the cursor
flicker persisted; (3) the Start-button UX for Position was "not a workable UX... maybe we need to
start over"; (4) wizards could collide if invoked while another was mid-sequence.

1. **One `<select id="backdropMenu">` dropdown** ("Backdrop...", "Add image", "Scale", "Position")
   replaced the separate toolbar buttons. Selecting "Add image" programmatically clicks the hidden
   file input; Scale/Position options stay disabled until an image is loaded.
2. **`activeCancel` + `cancelActive()`: a single mutual-exclusion point.** Every sequence (Scale,
   Position, the target-mode panel) registers its own teardown function in the module-level
   `activeCancel` variable; every entry point calls `cancelActive()` first. This is what makes a
   wizard "cancel self and each other when invoked" (Tom) instead of stacking listeners.
3. **Position rebuilt to Tom's exact sequence:** (a) pick Position from the dropdown, (b) alert
   asking for a reference point, (c) click it, (d) alert announcing the target-mode step, (e) a
   floating `targetPanel` div (not toolbar-embedded) appears with a `<select id="targetModeSelect">`
   for Node/Free point/Coords — a `<select>`, not radio buttons, specifically because the toolbar's
   `#toolbar label{...}` CSS was styling radio labels to look like buttons, which Tom flagged as
   confusing — (f) Continue commits the choice.
4. **Node mode's own cursor-affordance problem was already visible in this round** and got its
   `.regmode-node` fix the round after next (round 9) once Tom reported it specifically.

## Round 9 (Tom) — cursor-repaint mechanism, node-mode affordance, panel placement, trimmed alert

Tom: "The UX is salvageable now" — four refinements, not a redesign this time.

1. **Cursor flicker — different mechanism than round-8's fix addressed. Superseded again in round
   10, see below — this attempt didn't hold either.** Round 8 assumed it was overlapping sequences
   fighting over `.regmode`; the cancellation rework fixed real bugs but the flicker itself
   persisted, pointing at something else: Chrome/Firefox only re-evaluate `cursor` on an actual
   mousemove hit-test, not on a JS class change with no accompanying pointer event. `setRegMode()`
   tracked the last known pointer position and dispatched a synthetic same-position `mousemove`
   immediately after toggling the class, meant to force an immediate repaint.
2. **Node mode forced crosshair even over the valid target.** In Node mode the node *is* the thing
   you're supposed to click, so overriding its cursor to crosshair removed the one useful affordance.
   Added a second class, `.regmode-node` (toggled only while actually waiting for the node click),
   with a more specific selector (`#canvas.regmode.regmode-node .node{cursor:pointer!important}`)
   that wins the specificity tie against the blanket `.regmode *` rule.
3. **Target panel appeared at screen-center, disconnected from what triggered it.** Now anchored
   just below the Backdrop dropdown's own bounding rect instead of a fixed center-screen position.
4. **Dropped the "now click the target" alert for Node/Free modes.** Tom's call: the panel +
   Continue transition is clear enough on its own now that the extra blocking dialog was redundant.
   The Coords prompt stays (it's real input, not just a step announcement).

Tom's aesthetic note, no action taken: the toolbar's current look ("black buttons," the dropdown's
native styling) isn't pretty but works; he's reserving judgment on a UI theme pass until more of the
page exists to look at holistically, not asking for polish now.

## Round 10 (Tom) — cursor flicker, third attempt: reflow instead of synthetic dispatch

Tom's report was specific enough to be diagnostic: "reverts to a pointer when there is no motion, or
maybe on a certain sort of motion... or maybe returning to where it was at the last poll." That
pattern is hard to explain if round 9's synthetic `mousemove` were actually forcing a real repaint —
more consistent with the dispatch doing very little, since `dispatchEvent()` only fires listeners
*we* registered, not the browser's own native hover/cursor hit-testing (driven by real OS input, not
the DOM event bus). Replaced with the standard "force a style recalculation" pattern: remove the
class, force a synchronous reflow by reading a layout-triggering property, then re-add. **Turned out
to still be a no-op** — see the Opus-review round below; `svg.offsetWidth` doesn't exist on an
`SVGElement` (that property is `HTMLElement`-only), so the forced read did nothing and the two
`classList` calls just coalesced into one recalculation, identical to a plain `toggle()`. Fixed for
real in the review-fix round using `svg.getBoundingClientRect()`, which is defined on every
`Element` and does force a reflow.

## Round 11 — Opus subagent review (Tom requested a second set of eyes)

After 10 rounds of live on-device patching, Tom asked for an Opus subagent to review
`canvas-spike.html` fresh, given the full round-by-round history in this file for context (so it
wouldn't flag deliberate decisions — `regMode`, `activeCancel`, the two-constraint CSS rule, the
`ADVERSE_FRAC` math — as bugs). Each finding was independently verified against the code before
fixing (an agent's report describes what it found, not gospel). Real, concrete issues, now fixed:

1. **The round-10 cursor fix was a genuine no-op.** Confirmed above.
2. **`Backdrop ▸ Add image` never called `cancelActive()`**, contradicting the comment asserting every
   entry point does. Concrete failure: start Position, reach the target-click step, then pick "Add
   image" mid-sequence — the old sequence's listener stayed bound with a stale `refWorld`, `regMode`
   stuck on (canvas fully inert), and the *next* click silently mispositioned the *new* image against
   the *old* reference point. Fixed: the `'add'` branch now calls `cancelActive()` too.
3. **Pinch drags were never cleared in `endPointer`.** The pinch drag object carries no `pointerId`
   (it spans two pointers), but `endPointer` only cleared `drag` by matching `pointerId` — so lifting
   one finger of a two-finger pinch left `drag` stuck at `type:'pinch'` with one pointer remaining;
   `applyDrag`'s pinch branch requires exactly 2 and silently no-ops every frame after that, freezing
   the remaining finger until it was lifted and re-pressed. Fixed with an explicit pinch case in
   `endPointer`.
4. **`#hint` and `#fps` blocked pointer events over the canvas.** Both are overlays stacked above
   `#canvas` (its top-left and top-right corners) with no `pointer-events:none` — a registration click
   landing in either strip never reached the SVG at all, which would read as "the wizard just isn't
   responding to my click." Added `pointer-events:none` to both.
5. **No lower/upper bound on `state.s`.** Pinch fingers converging to near-zero distance drove the
   zoom scale toward 0 (and the next frame's divide-by-`state.s` toward `Infinity`/`NaN`), with no
   recovery short of pressing Zoom Extent. Added a `MIN_SCALE`/`MAX_SCALE` clamp in `zoomAbout`.
6. **`dblclick` (add/remove a link bend) wasn't suppressed during `regMode`.** Two registration
   clicks landing on the same link within the double-click interval — plausible on a short bar-scale
   segment — would also insert a bend mid-sequence. Added the same `if(regMode)return;` guard the
   other interaction listeners already have.
7. **No way to abandon a Scale/Position sequence except re-opening the dropdown.** `regMode` blanks
   all normal interaction with no dedicated cancel affordance — a user who simply changed their mind
   had an inert canvas with no visible way out. Added an `Escape` key handler that calls
   `cancelActive()`.
8. **Print CSS didn't hide `#hint`, `#fps`, or `#targetPanel`** — all three are `position:fixed`
   overlays that would print on top of the drawing, undermining pass condition 6 (crisp vector
   output). Added to the existing `@media print` hide list.
9. **Two real documentation gaps, both fixed**: round 8 (the dropdown/`activeCancel`/`<select>`
   rebuild) was never logged at all — reconstructed above from the actual code changes — and round
   9's cursor-fix description no longer matched the code after round 10 replaced it. Also corrected
   the "What this build demonstrates" summary's stale "one link vertex handle" line (superseded by
   round 4's arbitrary-vertex model) and trimmed an unused `ml` computation in the target-panel
   Continue handler (round 9 dropped the alert that was its only other consumer).

**Reviewed and found NOT to be bugs** (confirmed by re-reading rather than assumed): toggling the
200-node grid mid-registration-sequence is safe (Scale/Position store click positions in
image-local/world space, not view-relative, so a `zoomExtent()` re-fit mid-sequence doesn't corrupt
anything); a window resize mid-drag is likewise safe (`screenToWorld` re-reads
`getBoundingClientRect()` on every call, never caches it). No abandoned `vx`/`vy` single-vertex code,
no leftover `btnPositionCoords`/`posModeWrap`, no auto-detect Position flow remnants — all fully
removed across earlier rounds' rewrites, not just superficially replaced.

## Round 12 (Tom) — leader styling; cursor flicker logged as a known, non-blocking limitation

1. **Leader lines: narrow, solid black instead of dashed grey.** `.leader` changed from
   `stroke:#999;stroke-width:1;stroke-dasharray:2,2` to `stroke:#000;stroke-width:0.125` (1/8 of the
   previous width, dash removed) — a pure styling ask, no behavior change.
2. **Crosshair-reverts-to-pointer-on-pause: closed out as a known limitation, not fixed.** Four
   dedicated attempts across rounds 8–12 (overlapping-sequence theory, synthetic mousemove dispatch,
   forced reflow, periodic re-assertion every 200ms) — the periodic-reassert attempt in round "11.5"
   targeted the newest information (the reversion develops purely from the pointer sitting still, not
   from any toggle-time event) but Tom's verdict is that it's "not a showstopper for now," so this
   stops here rather than continuing to chase a browser-internal cursor-caching quirk that doesn't
   bear on Phase 0's actual go/no-go criteria (pan/zoom/drag/touch/text-shaping/print). If it matters
   later, the next thing worth trying is probably a native `cursor: url(...)` custom image (bypasses
   whatever native cursor-hit-test path is misbehaving) rather than another CSS-class approach.

## Round 13 (Tom) — leader attachment bugs, then on-device phone pass — Phase 0 closed

1. **"Attaches at label middle instead of at the end" on load.** `buildDom()` drew each leader
   straight to `(px,py)` — the text's own `text-anchor:middle` anchor point — and only got corrected
   to the near edge (`px∓halfW`) on the *first drag*, since that offset logic lived solely in
   `updateLabelGeometry`. A label never dragged (i.e. every label, on a fresh load) showed the wrong
   attachment point. Fixed by having `buildDom()` call `updateLabelGeometry(i)` immediately after
   building each label, instead of duplicating a simplified (and wrong) version of the same logic.
2. **Leader always attaching near the bottom of the text, not the middle.** SVG text defaults to
   alphabetic baseline positioning, so `y=py` sat near the bottom of the glyphs (most of a
   character's height is above the baseline, only descenders go below) — both the text itself and
   the leader endpoint that tracks it read as attached low. Added `dominant-baseline:central` to the
   text element, making `py` the true vertical center; `bbox()`'s label padding updated to match
   (was asymmetric for the old baseline assumption, now symmetric).
3. **Phone testing done, Phase 0 closed.** With the on-device pass complete and no SVG-blocking
   issue found across 13 rounds, Phase 0 is DONE — see the ROADMAP Task 146 entry and the scope
   doc's Phasing section, both updated. SVG DOM is the confirmed technology; the Leaflet + CRS.Simple
   fallback was never triggered.
