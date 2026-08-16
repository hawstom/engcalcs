# ROADMAP closed-task archive

Every closed task, newest first, as a **summary** — what changed, where it lives, and any finding a
future reader could not re-derive from the code. `dev/ROADMAP.md` holds only OPEN tasks; no task is
in both files.

**This file was a transcript and is now a digest** (Task 388, 2026-08-16). It previously carried the
full original text of 167 tasks alongside their stubs — 7,624 lines, for a file almost nobody opens.
The narratives were summarized away, not moved: `git log -p -- dev/roadmap-closed-archive.md` has
them verbatim if a decision ever needs re-litigating.

Durable policy from several of these lives in `CLAUDE.md` (Rules A–D from Task 140, the coverage
declaration from Task 203, Simple English from Task 98, glossary write-back from Task 109) and in
`dev/` docs. Read those first — they are the current state; this is the history.

## Closed tasks

- 0|386| **Repeated-label spacing was really under min/2 — DONE 2026-08-16.** `n = ceil(L/s)` at
  even `L/n` puts the REALIZED gap in `(s/2, s]`; `ceil` is what guarantees a gap is never WIDER than
  nominal, so nominal and realized cannot both equal `s`. `LPN_LABEL_REPEAT_FRAC` is now 0.75. §6 of
  `label-repeat-harness.js` asserts the bound, and that harness is written in multiples of the page's
  OWN spacing so changing the fraction cannot fail it for unrelated reasons.

- 0|321| **`formmail.php` read five `$_POST` keys with no `isset()` — DONE, and the roadmap missed
  it.** Fixed in 694131a alongside Task 319; each key now takes `isset() && is_string()` (the
  `is_string` matters: `name[]=x` posts an array, and passing one to `preg_match()` is a TypeError,
  not a warning). Closed here 2026-08-16 after finding the block still open at priority 20.

- 0|354| **A pipe VANISHED past ~47x zoom on a state-plane model — DONE 2026-08-16.** At
  x ~ 579,350 a float32's spacing is 0.0625 units and a stroke is `linkWidth / scale` world units, so
  the stroke became thinner than the coordinates could express — the labels still drawing correctly
  is what identified the RASTERISER rather than the arithmetic. Documents now store coordinates LOCAL
  to `doc.origin` (storage v7; under 10,000 units the origin stays {0,0}), added back at five outward
  sites. `local-origin-harness.js` counts those sites and asserts offsets like `ly` are NOT shifted.

- 0|233| **Manning-Irregular opened in metric on English pages, with a ⚠ — DONE 2026-08-16.**
  Its positional seed cookie set each select BY ITS CONVERSION FACTOR (`1` = SI everywhere),
  overwriting what PHP had just rendered. Slots are now walked off the rendered form (an empty `s:`
  keeps the server's `option[selected]`) and the cross-section is per-preset. Asserted in a real
  browser by `dev/browser-pass/mi-defaults.js` — `calc-spike` cannot see this page's results.

- 0|385| **Giant obstacle boxes were a stale measurement, not rotated-box waste — DONE
  2026-08-15.** `getBBox()` returns WORLD units and `noteMeasuredWidth()` multiplies by the CURRENT
  scale, so both halves must belong to one moment; measuring before `refreshFontSizes()` banked a
  width wrong by exactly the zoom ratio. A drag healed it — the "any drag fixes it" signature that
  had been read as a relaxation problem for weeks. Size, then measure; ORDER asserted in
  `label-decor-harness.js`.

- 0|383| **Leaders are segments, weights mean insistence, the debug mark is screen pixels —
  DONE 2026-08-15.** Leaders now use the same `pushOffSegments()` as pipes: exact, O(1) per pair, and
  PERPENDICULAR, so a label steps off a diagonal instead of sliding along it. **Against an immovable
  obstacle a weight now means how much of the overlap is gone when the iteration ends** (node 0.5→1,
  pipe 0.25→0.4); the old share-of-weight formula silently lost the remainder. `vector-effect:
  non-scaling-stroke` on the debug mark, which was 4 MAP units wide.

- 0|381| **Pipes are obstacles now, at a low weight — DONE 2026-08-15.** `WEIGHT.pipe` had
  been 0 on the argument that a number lying on a pipe still reads — true of one crossing, false in a
  dense network. Tested as SEGMENTS, not sampled boxes: Net3's 119 pipes chopped at 3 px would be
  thousands of boxes, and a segment push is exact and PERPENDICULAR, so a label crossing at 30° steps
  *off* rather than sliding along. It exposed an ordering defect two functions away —
  `nodeLabelPos()`/`linkLabelPos()` now return no nudge for a manual label, so our temporary
  extension cannot outlive the element becoming manual.

- 0|382| **A label you have just placed says so, then stops — DONE 2026-08-15.** A
  45-second orange halo on the glyphs, held then fading, driven entirely by CSS: no timer and no
  element to leak, and re-adding the class restarts it. The dashed box Tom also offered was declined:
  a dash pattern follows every letter's outline, so a real frame needs a rectangle per label on a
  timer. `prefers-reduced-motion` gets the mark without the fade.

- 0|380| **A dragged label stores its leader endpoint in MAP units, and that is CORRECT —
  closed 2026-08-15 as not-a-defect.** Tom ruled it after five screenshots at four zooms; section 7
  of `dev/label-placement-goals.md` had proposed a pixel offset instead and is withdrawn. The real
  defect was the accidental drag: it seeded from `nodeLabelPos()` — base PLUS the live collision
  nudge — so the first pixel froze the label wherever the automatic pass had put it, permanently. A
  3px movement threshold on the three label drags fixes it.

- 0|375| **Six of the seven automatic zoom-to-fits are gone — DONE 2026-08-15.** Tom
  rejected the post-solve re-fit, the cleared-network fit and the empty-map boot fit one at a time;
  boot was also a plain bug, calling `zoomExtent()` outright, so **a reload ignored the document's
  saved view** on the one path where a user most expects to return where they were. **One case
  remains, reached from three places:** a document with no stored view must be given one, once.
  Deferred sizing is not an extra fit — it is the same fit, postponed until the canvas has a height.

- 0|373| **The dirty asterisk had two causes, neither an edit — DONE 2026-08-15.**
  (1) Task 360 put the view into `serializeProject()`, so automatic re-fits dirtied the project.
  **The view stays in the signature** — excluding it would make a DELIBERATE pan unsaveable in order
  to excuse an AUTOMATIC one; instead `zoomExtent(auto)` re-baselines a CLEAN project, and the user's
  own Zoom to fit is deliberately not marked automatic. (2) `init()` registered the first project
  without stamping `savedSig`, so it was dirty from birth — and its Revert was disabled, so the one
  control that clears an asterisk was unavailable on the only project with an unearned one. Save all
  is gated on `< 1` file projects, not `< 2`.

- 0|374| **Aligned label spacing is half the smaller map dimension — DONE 2026-08-15.**
  Tom: *"min/4 is too small. Let's try min/2. On my PC, even that is smaller than max/4."* That
  second sentence is what makes the first safe. His alternative — a "% of minimum map dimension"
  setting — is deliberately NOT built: a number nobody has yet wanted to change costs 26
  translations. Evidence first.

- 0|371| **A Text label's mask became a white sheet over Net3 — DONE 2026-08-15, a
  same-day regression from Task 366.** `relayoutLabels()` silently skipped the user's own Text
  labels, harmless only while `refreshFontSizes()` still re-measured them; a mask sized in WORLD
  units from a stale pixel width then lay across the network at 75% white. Guarded by an invariant
  (the mask covers the label's box and not much more, at every scale) rather than by the symptom.
  - Separately, labels flung to the far side of the model were not a bug: **an unbounded relaxation
    in an over-constrained problem does not fail — it wanders and reports success** (measured on
    Net3: median 85 px from the node, worst 301, on a 1400 px canvas). `LPN_NUDGE_CAP_PX` (45) scales
    the push back **along its own direction**, keeping the direction and discarding the distance; and
    `applyView()` now asks whether the layout belongs to the scale being DISPLAYED, rather than
    whether this call changed the scale.

- 0|369| **The aligned-label flip was measured in the wrong FRAME — DONE 2026-08-15.**
  Cartesian angles run counter-clockwise with y up; SVG's frame has y down, so the same arithmetic
  ran CLOCKWISE and the tolerance arrived MIRRORED — all eleven of Elm Street's near-vertical pipes
  read top-to-bottom, where every map ever printed reads bottom-to-top. **The parameter changed, not
  just its value**, because a number readable in two frames will be: `settings.labelFlipLeftOfVertical`
  (default 20, clamp 0–45), labelled "left of vertical" rather than "past", which can be misread.
  Guarded in `geom-harness.js` (the geometry) and `label-repeat-harness.js` (the wiring through
  `settings`, which the first cannot see).

- 0|370| **The toolbar carries Save and Save as; a fat-finger tap opens what is there —
  DONE 2026-08-15.** New project and Background image left the toolbar for the menus; saving is every
  few minutes, and Save As is often the only thing Save can mean here. The two add tools answered a
  near-miss two different wrong ways — the node tools silently no-op'd, the Text tool stacked a
  second label — and both now switch to Select and open what is already there within `NODE_SNAP_PX`
  (14 screen px, the same pointer slop at every zoom). `toolbar-harness.js`.

- 0|368| **One element-type order in all three places — DONE 2026-08-15.** Junction,
  Reservoir, Tank, Pipe, Pump, Valve, then Text: nodes then links, each in the order you build them.
  The order was written out three times (Insert menu, toolbar, ID-prefix rows) and had already
  drifted; `id-prefix-harness.js` reads all three out of the source and fails if they disagree.

- 0|366| **A zoom no longer measures or recomposes anything — DONE 2026-08-15.** Every
  zoom ran `refreshLabelText()` — **~220 forced synchronous layouts per wheel notch, to redraw glyphs
  that had not changed.** Two things had made content depend on the scale and both are gone: tspan
  `dy` is `1.2em`, resolved against the element's own font-size, and a measured width is banked in
  PIXELS and divided by the scale on read. Asserted by counting `getBBox()` calls during a zoom: zero.

- 0|367| **The label mask was eating the pipes — DONE 2026-08-15.** `MASK_PAD` was 0.4 in
  WORLD units, so in pixels it grew with the zoom — ~24 px a side at Net3's working scale — and an
  aligned label lies ALONG its pipe, so the mask covered the pipe for the label's whole length at 75%
  white. Now `0.15 × effectiveFontSize()`, a fixed 1.65 px. Masking the line a label lies on stays;
  that is what cartography does, but a halo has to be a halo.

- 0|364| **A pan is not a zoom, so it no longer re-lays-out — DONE 2026-08-15.**
  Restoring a remembered view ran `onZoomChanged()` unconditionally, rebuilding font sizes, tspan
  spacing, every label box and the whole collision relaxation — all of which depend on the SCALE and
  nothing else. A tab switch, the commonest case there is and almost always at the same scale, now
  costs one transform.

- 0|365| **The W3C validator badges are deleted — DONE 2026-08-15.** They rendered only
  in DEBUG_MODE and were neither true nor usable: "Valid XHTML 1.1" on an HTML5 suite, via
  `validator.w3.org/check/referer`, which asks W3C to fetch a dev host it cannot reach. **The gap,
  named so it is not invisible:** `html_balance_check.php` checks tag balance only — it does not know
  a `<p>` may not contain a `<div>` — and **nothing in the repo checks the CSS at all.** If that
  matters, the answer is a real validator in `check_all.sh`, not a link on a page.

- 0|363| **A shorter map floor, and no validator badges under the canvas — DONE
  2026-08-15.** `LPN_MAP_MIN` 240 → 80: the floor does not decide whether the map is usable, the
  WINDOW does — all it decides is whether a too-short window gets a small map that fits or a bigger
  one that pushes the status strip off the bottom. `echoFooter()` takes a fourth `$devtools` flag and
  `Looped-Network.php` passes false; below a full-window canvas is drawing room. Every other page
  keeps them.

- 0|362| **CSS PIXELS ARE THE SIZING UNIT — decided 2026-08-15 after two rounds of
  argument, and recorded so it is not reopened from scratch.** **The trade, in one line: you can have
  COMPOSITION-INVARIANT or LEGIBILITY-INVARIANT, not both.** The number that settled it: the `min`
  map dimension is the HEIGHT on a desktop (~370 on a laptop to ~1010 at 1440p) and the WIDTH on a
  phone (~390), so a fraction-of-view size renders the same stored label 40% smaller on the device
  that needs it biggest. Field evidence from both programs: **neither EPANET nor epanetjs scales
  annotation with the window.** Rejected: sizes as a fraction of the SHEET (precisely what Task 331
  removed) and reading `window.screen` (constant for a session, and changes when a window moves
  monitors). Left open deliberately: whether a resize preserves the region (EPANET) or the scale (us,
  epanetjs) — Tom, on the grounds that resizing is very rare next to zooming and switching.

- 0|361| **"Map size" always names its dimension, and the standard is `min` — DONE
  2026-08-15.** The audit found **three conventions already in use and not one of them named**: `max`
  for the label repeat spacing, `min` for the fit and the restored view, and WIDTH ALONE for the
  label-visibility threshold. `mapSpan('min'|'max'|'diag'|'w'|'h')` is now the one definition, every
  caller names its choice, and a check in `zoom-fit-harness.js` fails if anything combines the two
  axes behind its back. One convention is what makes the rule sayable to a user in one sentence.
  **And it is not the SCREEN, it is the map area** — narrower than the window and much shorter — so
  any wording shown to a user says map, or it promises a relationship to the display that does not
  exist.

- 0|360| **The map remembers where you were looking — DONE 2026-08-15.** Per tab in
  memory (`tabViews`, keyed by project id, captured on the way out of `openProject()`) and in the
  file (`serializeProject().view`). Panning is never itself a reason to save and never marks a
  project dirty. **Final shape: a world CENTRE and a SCALE**, after two rejected forms. Scale because
  shrinking a window keeps the scale, so reopening at that size must not re-fit — and because
  restoring an EXTENT recomputes `min(W/w, H/h)`, which a one-pixel canvas difference perturbs, while
  a stored scale is copied verbatim. Both older forms are still READ. The fit is now the FALLBACK: a
  project nobody has looked at, a fresh import, or a file written before this.
  `dev/lpn-spike/view-memory-harness.js`, 20 checks.

- 0|359| **Zoom to fit is a FIXED POINT now, so the same drawing fits the same way every
  time — DONE 2026-08-15.** Since Task 331 sizes are SCREEN PIXELS, so a label's world footprint is
  proportional to 1/scale while `bbox()` measures world space: **the fit's input depended on the
  scale it was solving for.** It was never an iterative problem — the screen position of any drawn
  edge is `t + s*x ± px` with `px` free of `s`, making fitting a convex feasibility question per
  axis, solved by 60 bisection steps in arithmetic with no DOM (`fitItems()`/`fitScaleFor()`/
  `fitWindow()`). Two further causes: `overlayReserve()` returned 0 for an overlay JS had not filled
  yet, and a fit run before `applyMapHeight()` fitted to WIDTH ALONE against the 10000px curtain, so
  such a fit is now deferred.
  - **IDEMPOTENCE is the test that finished it** (Tom: *"open, reload, or switch and then zoom
    extents. Ideally nothing happens."*) — stronger than start-independence. `fitItems()` builds
    every box from the MODEL, never from a label's drawn position, which carries the collision nudge.
  - **The trap in the new design: every world→pixel quantity must itself be px/s.** The old `bbox()`
    world fudges (`- 2`, `+ 0.6`, `+ 0.2`) times the scale give a pixel figure that moves with zoom.
  - `lpn-dom-stub.js` had to learn that a text run shrinks with zoom before the harness could see any
    of this: with a constant `getBBox()`, one pass looked perfectly convergent.

- 0|356| **A zoom step no longer rebuilds labels nobody can see — DONE 2026-08-15.** With
  annotation hidden, a wheel notch was recomposing and re-measuring every node's and link's text and
  running four relaxation iterations on labels `.lpn-labels-hidden` was not drawing. It now updates
  only the symbol/stroke custom properties and the user's own Text labels, which have their own
  threshold; either transition takes the full path.

- 0|357| **Zoom-to-fit stops padding for labels it is not drawing — DONE 2026-08-15.**
  `bbox()` reserved every label's box unconditionally; it now skips node and link labels while
  annotation is hidden, and a Text label carrying `.lpn-lbl-hidden`. Fitting can zoom in far enough
  to bring labels back, which is accepted rather than iterated — a fit that re-decides its own inputs
  does not converge.

- 0|358| **The canvas can no longer grow taller than the window — DONE 2026-08-15.** One
  symptom, not two: `#lpn_map_footer` is `bottom:4px` INSIDE the canvas, so `effectiveMapHeight()`'s
  `above` term went negative, the result exceeded the viewport, the page scrolled — and a scrolled
  page is what makes the measurement wrong, so the state fed itself.
  - **Every term measures a page that is still assembling itself** (the navbar and footer change
    height as Bootstrap's CSS and the webfonts land), so the height is re-measured at `window.load`,
    `document.fonts.ready` and one rAF after init, plus one bounded re-measure if the canvas still
    runs past the bottom.
  - **The markup was the other half.** `height="500"` was a guess mistakable for an answer, which is
    how it survived months. Now `height="10000"` — a curtain — with sizing refused until
    `readyState` is `complete` (2 s failsafe). Zero was tried and is worse: it pulls the footer, nav
    and legal row into the viewport. The canvas height cancels out of `flowBelowMap()`, so the
    measurement is unaffected.
  - **The height is an ENVIRONMENT fact, not a document one** (Tom, twice), so opening a project no
    longer sizes the canvas. The tab strip wrapping is the one legitimate document trigger.
  - A resize also stopped sliding the drawing: half the height delta goes into `state.tx`/`state.ty`
    so the view CENTRE stays put, with a 1 px dead band. `map-height-harness.js`, 28 checks.
    **Not reproduced in a browser** — the mechanism is inferred from the arithmetic.

- 0|351| **A readability-bias angle for aligned pipe labels — DONE 2026-08-15.**
  `settings.labelReadabilityBias`, default 110°, clamped 90–135. **90 is the worst possible place for
  the flip boundary**: it sits exactly on vertical, where mains are, so two pipes a tenth of a degree
  either side read in opposite directions. 110 moves the doorway 20° past the crowd; the cost is a
  pipe that renders tilted past vertical — a head-tilt, never upside down. Four checks in
  `geom-harness.js` measure exactly that pair.

- 0|352| **Recent files go LAST in the File menu — DONE 2026-08-15.** Tom: *"File, Save needs to be
  more handy. It appears after Recents. Put Recents last."* The list grows, and every row it grows
  pushed Save further down a menu Save is the most-used row of. The old placement (under Open…, per
  thirty years of File menus) was an argument from convention that using the menu answered. Asserted
  in `recent-files-harness.js` so the next edit cannot quietly undo it.

- 0|329| **Pipe labels aligned ALONG the pipe, GIS-style — SHIPPED ON 2026-08-15** after
  a day behind a setting (Tom: *"Very much earns its keep."*). `settings.alignPipeLabels` defaults
  true. `Geom.alignedLabelAnchor()` normalises the angle so text never reads upside down (which also
  swaps which side is the top); the side is chosen by clearance to the nearest other link with a 1.35
  margin, so the top stays the default. An aligned label draws no leader — its orientation already
  says which pipe it belongs to. `geom-harness.js`, `aligned-label-harness.js`.

- 0|349| **A long pipe repeats its label along itself — DONE 2026-08-15.** Stations are
  `(i + 0.5)/n`, so **n = 1 lands on 0.5 and every pipe shorter than the spacing is bit-for-bit what
  it was** — the property the harness guards first. In view units, so it needs no number from anyone
  and re-derives on zoom. **The division is uncapped; what is bounded is what gets DRAWN** —
  `drawnLinkLabelStations()` clips the polyline to the viewport grown by one view-span
  (Liang–Barsky), so a pipe a thousand view-widths long costs what a short one costs; a bounding-box
  test instead of a clip culls nothing. Every copy is pickable, carrying `data-repeat` so a grab
  knows which copy it took. A blocked station takes the other SIDE; the even spacing never moves. A
  chain OBSTRUCTS rather than participating in the relaxation, and `bbox()` ignores it — how many
  exist is a function of the zoom, which is the Task 332 circularity in different clothes.
  `label-repeat-harness.js`, 34 checks.

- 0|350| **"Always show" on a Text label — DONE 2026-08-15.** `lb.alwaysShow`, a checkbox
  under the size in the Text property popup, exempting that one label from Task 340's threshold. Tom
  named and rejected the automatic alternative himself: always sparing the largest text makes a
  legend compete on font size for a property it should declare, and changes its mind whenever some
  other label is resized.

- 0|334| **One `.lpn-annotation` class, declared where the element is built — DONE 2026-08-15.**
  `annotationEl()` in `js/looped-network.js` applies it to every generated mark (data label, its
  mask and leader, flow arrows); `css/engcalcs.css` is one rule instead of a four-selector list, and
  a Text label is deliberately not a member. The list is what let the extrema badge ship unhidden in
  Task 331. Asserted both ways in `dev/lpn-spike/label-visibility-harness.js`.

- 0|332| **Imported EPANET labels render at EPANET's own anchor, not converted — DONE
  2026-08-15.** `reanchorImportedLabels()` is gone: it moved every label by half its own width and
  half a line, both in world units against text sized in screen pixels, so the same `.inp` imported
  at two zooms stored two different sets of coordinates. The point is now stored unchanged and
  `lb.align`/`lb.valign` (left/top on import) say what it means, interpreted in one place —
  `Geom.labelBoxAt()`. No setting; one line in the import report.

- 0|330| **Toggle for label background masking — DONE 2026-08-15.** `settings.maskLabels`, ships ON,
  saved with the PROJECT (Task 263's rule: masking is a property of the sheet, not the browser).
  One class on the `<svg>`, `.lpn-masks-off`. Read as `=== false` so a project written before this
  still masks — a truthiness test would have restyled every drawing in the library on ship day.

- 0|340| **A Text label hides at a threshold scaled by ITS OWN size — DONE 2026-08-15.**
  `labelMaxWidth x lb.sizeMult` in `applyLabelVisibility()`, so a 3x title block survives to 3x the
  map width and a 1x note goes exactly when the data labels do. No new per-label setting — it falls
  out of `lb.sizeMult`, which was already in the document. Replaces Task 331's blanket exemption of
  authored text, which treated a title block and a small note alike.

- 0|305| **How a visitor opens an EXAMPLE, and the New-vs-Open lie — CLOSED 2026-08-15
  into Task 314.** New creates something that did not exist; Open retrieves something that does, and
  an example exists — so it belongs under **File ▸ Open example…**. The trap one level down: if
  opening it then lets you save over it, it was New-from-template after all, so the honest primitive
  is **Open a copy** (Word has exactly this). And what epanetjs gets right is not the modal but that
  there is **no verb at all** — so the thumbnails belong ON the empty canvas, where a returning user
  with projects never sees them: a passive readout, not a modal in front of the common action.

- 0|314| **An EXAMPLES LIBRARY, on the HEC-RAS model — BUILT AND SHIPPED 2026-08-14.**
  `dev/scripts/generate_examples.php` publishes `dev/water-network-examples/` to the web-served
  `examples/` with a manifest and a generated SVG thumbnail each, and `check_all.sh` fails if the
  served copy drifts. **The empty canvas IS the shop window** — the canvas stays visible and pannable
  behind the cards; `File ▸ Open example…` reopens it on demand. Opening one goes through the upload
  path's own `acceptImportedText()` + `importProject()`, so an example lands as an ordinary project
  the user owns and may Save As, and there is no second import path to drift.
  `examples-gallery-harness.js`, 69 checks.
  - **Tom overruled the "a gallery is a wall in front of a worked example" objection, and the
    overruling is the durable part**: that rule is a rule about CALCULATORS, where a visitor reads
    the whole tool in one screen. A network editor is not that — what a visitor needs first is the
    RANGE of what can be built, and one example cannot show a range. The gallery-over-a-live-map
    hybrid was declined on the merits, not deferred; do not re-propose it.
  - **A path-named `.gitignore` rule is a rule a rename silently revokes** — renaming
    `dev/epanet-models/` unprotected every real client model inside it. The replacement is a WHITELIST
    in that directory: an unrecognised file is ignored by default and publishing one is a line
    somebody has to write. Prefer that shape wherever a folder mixes shippable and private files.
  - **Elm Street ships as-is on Tom's explicit ruling**, with `project.name` still the real client
    model name and real state-plane coordinates. A sanitisation was offered and declined — that is a
    decision, not an oversight, and should not be silently "fixed" later.
  - **The gap is an SI example and it cannot be made by converting one**: a unit switch REINTERPRETS
    rather than converts, so an SI example must be authored in metres or imported from an `.inp`
    declaring LPS/LPM/CMH/MLD. The unbuilt half of the feature is Task 347; paging is Task 348.

- 0|344| **The element property box is DRAGGABLE — SHIPPED 2026-08-15.** It stays where
  you put it, as EPANET's own window does; double-click its chrome to send it home. **The grab
  surface is the CHROME — the padded band where `e.target` is the popup element itself** — which is
  what made this safe to add to a panel full of inputs and spinners without rewiring one of them: a
  control is always a child, so a drag can never start on one. No drag bar, no extra row of pixels,
  no new string. Pointer events with `setPointerCapture`, so the drag survives the pointer leaving
  the box. The remembered position is SESSION-scoped: putting it in the document would hand a
  colleague opening your file the place your popup sat. `popup-drag-harness.js`.

- 0|345| **"Apply to all" beside each ID prefix — SHIPPED 2026-08-15.** An ID prefix had
  always been future-only, leaving no way to say "I meant all of them". **An id keeps its NUMBER and
  swaps its head** (`J12` → `N12`) — the number is what the user knows the element by. An id with no
  trailing number is left alone (an imported `J-TF`), and a rename colliding outside the batch is
  skipped; both skips are counted and reported, because a silent partial rename is worse than none.
  **The subtle rule a shortcut gets wrong: a target held by a same-batch member that is NOT moving is
  still a collision** — its id is never going to come free. It goes through the same
  `applyNodeRename()`/`applyLinkRename()` a hand rename does, since a second implementation is how a
  bulk operation forgets one of the six places an id is written.

- 0|336| **Link label values on ONE LINE — SHIPPED 2026-08-15 with Task 333's second
  round.** Every data label renders as one row joined by the blanket separator, and a DRAGGED label
  goes back to a stack; `l.lx`/`n.lx` decides, so there is no new switch. It shipped unconditionally
  rather than "where they fit": the prefixes landed in the same change and are what make a one-line
  label readable, and a width test would compete with Task 343's hide-priority order. The separator
  is its own text SEGMENT, so an extrema mark underlines the number alone.

- 0|333| **Label prefixes, suffixes and one blanket separator — SHIPPED 2026-08-15, and
  the label COLOURS are gone with them.** Every field's line is `<prefix><sep><number><sep><suffix>`,
  all three editable per project in the Labels box, and the legend keys on the prefix instead of a
  colour swatch. Defaults carry their own `=` (`Q=`, `V=`, `Z=`, `Hl=`…) so the page inserts nothing
  of its own; the roughness prefix is the one dynamic default, following the friction method at print
  time, which a stored letter could not. `label-affix-harness.js`.
  - **UNSET IS NOT EMPTY, and that distinction is the whole storage design.** No stored affix takes
    the default; a stored `''` means print nothing. Collapse the two and a prefix cannot be turned
    off — it refills on the next rebuild. The test is on the TYPE, never on truthiness.
  - **The extrema badge became text-decoration** — overline max, underline min. Tom rejected exactly
    this in July as ambiguous and was right THEN; two things changed under it (every value now names
    its quantity, and values sit on one line). The structural argument is stronger: a badge had to be
    POSITIONED, and every step of that was a real bug at some point, while text-decoration is drawn
    by the text engine at the exact extent of the characters, at any rotation, for free.
  - **Demand and flow were pooled for extrema and un-pooled the same day** — recorded because the
    idea looks obviously right and will occur again. **A pooled Q can only be answered by a LINK**,
    since a source carries every demand downstream of it, so *"which junction draws the most"* stops
    being answerable at all. The harness asserts the split so a third attempt fails a check.
  - A node label is always a stack, a link label one line unless dragged: the asymmetry is geometry,
    not compromise — a link label lies along a PIPE and competes for length, a node label hangs off a
    POINT with space above and below.

- 0|304| **The project file's NAME and EXTENSION — CLOSED 2026-08-14.** The answer is
  *not an extension*: stay on `.json`, shorten the suffix to `-lpn`, and put the identity INSIDE the
  document (`format: 'hawsedc-lpn'`, `app: <canonical URL>`). A generation-1 extension was declined
  on TIMING, not letters — the schema is still moving, the product name is unsettled, and the only
  real payoff (OS double-click association) is something a web page cannot deliver at all. When the
  trigger fires the choice is `.lpn`. Worth noticing: 304 sat at priority 85 while Task 315 at 75
  already held its finished answer — **a researched conclusion parked in a lower-priority task is
  invisible to whoever is reading the top of the list.**

- 0|315| **The 30-character filename — CLOSED 2026-08-14.**
  `<Name>-lpn-hawsedc-engcalcs.json` became `<Name>-lpn.json`, and `serializeProject()` now writes
  `format`/`app` as its first two keys. **The suffix could shrink only because the marker arrived**:
  there was no format identifier in the file at all — `v` is a version number and nothing said what
  it was a version *of* — so "identifiable a year later" rested entirely on the filename, the one
  thing a person renames. **The real hazard is not strip ORDER but applying BOTH strips in sequence**
  (with `$`-anchored strips, order is harmless): a project genuinely named `Z-lpn` was written
  `Z-lpn-lpn-hawsedc-engcalcs.json` and re-opened as `Z`. Expensive because `saveCurrent()` treats a
  filename differing from the suggested one as a deliberate RENAME, and after this change the two
  differ BY CONSTRUCTION on every legacy file. `file-naming-harness.js`, 22 checks.

- 0|184| **Project/scenario model: the DELTA model — CLOSED 2026-08-14.** One save, a
  canonical Base, and scenarios that are nothing but collections of overrides. Three rulings: a push
  CLEARS rather than overwrites; the count reads "Own values"; the marker is INTENT, never a diff.
  Remaining UI polish is Task 201; the per-element push is Task 317.

- 0|317| **Push Base values PER ELEMENT — CLOSED 2026-08-14.** `pushBaseToScenarios(el)` takes an
  optional element instead of forking: one count, one confirm, one undo snapshot, so a confirm can
  never promise a different blast radius from the one that happens. The button lives in the
  element's own popup (Base only, absent rather than disabled) and reuses the scenario menu's own
  two strings — it is the same action, narrowed by where it is. It also filters the property list
  to the element's GROUP, which is the only part of the scoping a user sees. Per-property-per-element
  is the third level and is still not wanted. Harness section 7b in `dev/lpn-spike/scenario-harness.js`.

- 0|326| **The paper-units paradigm — CLOSED 2026-08-14 as ALREADY DELIVERED, and it was
  never a build.** Tom: *"this task seems to be a mirage after all… Everything is in pixels."* What
  the paradigm actually asked for — an ABSOLUTE frame for sizes, so a size means the same thing on
  Net1 and on a state-plane model — shipped as Task 331's screen pixels. `dev/sizing-paradigm.md`
  stays as the reasoning and is HISTORY, not a spec: nothing in it is queued work.

- 0|328| **The leader stored the TEXT's corner, so the angle slid with the zoom — CLOSED 2026-08-14.**
  `n.lx/n.ly` now hold point B itself (world units, the user's) and `dataLabelOrigin()` hangs the
  text off it in pixels (ours, free to flip sides). Tom had to report it three times; a
  right-hanging label was always correct, which is why one-sided testing missed it.
  `dev/lpn-spike/leader-angle-harness.js` runs both sides over a 64x zoom sweep. A pre-328 save
  reads its offset as B — exact on the right, one box width off on the left, not migrated because
  the old width depended on the zoom it was last drawn at.

- 0|341| **A pipe too short to carry its label does not carry one — CLOSED 2026-08-14.**
  `linkLabelTooShort()` compares the pipe's world length against `labelBoxWidth()`, which is
  pixel-derived and therefore ~1/zoom — so the label returns at exactly the zoom where it fits, with
  no setting. **A DRAGGED label is exempt**: dragging one off a stub is how a user says they want
  that number, so the gesture is the escape hatch. `short-line-label-harness.js`.

- 0|335| **Store a dragged label's offset in screen pixels — SUPERSEDED by Task 328, not shipped.**
  It would have held the leader angle steady, but by storing the wrong thing: a pixel offset says
  "40 px from the node", where the user meant "over there, in the drawing". Tom's leader-endpoint
  design holds the angle by construction and keeps the intent. Recorded because the reasoning that
  killed it is worth having.

- 0|319| **Accept-Language log injection, in five copy-pasted writers — CLOSED.** `ecBrowserLangTag()`
  in `lib/config.inc.php` filters to `[a-z0-9-]` and truncates rather than rejecting (a long header is
  a real browser's, not an attack). All five writers call it, and
  `dev/scripts/browser_lang_tag_check.php` is blocking in `check_all.sh` so no sixth can reintroduce
  the raw read.

- 0|331| **GIS paradigm phase 1: text/symbol/pipe sizes are three independent SCREEN-PIXEL settings,
  and labels hide by map width.** Deleted `textSizeUnits`, `symbolScale`, both pixel floors and
  `importTextSize()` — the paradigm keeps removing controls rather than adding them. `labelMaxWidth`
  (model length units, captured from the current view) hides GENERATED ANNOTATION: data labels, their
  masks and leaders, and flow arrows; never the network or the user's own Text labels. Storage v5->v6
  discards old map-unit sizes rather than inventing a conversion factor. The ill-posedness it exposed is Task 332.

- 0|324| **[DONE 2026-08-14] Scenario overrides no longer collide between a node and a link sharing
  an id.** One flat map keyed by bare id met EPANET's two namespaces: re-measured, **Net1 has 7
  shared ids, Net2 35, Net3 72** — even the smallest EPA example collides, which the task did not
  know. The halo Tom saw was the harmless half; `active` is on both groups, so unticking "Part of
  this network" on a junction silently dropped an unrelated pipe out of the SOLVE. Now keyed `n:20`
  / `l:20` through one `ovKey()` seam, storage v4→v5 with a migration that states its rule. Harness
  drives an IMPORTED network, because the editor refuses duplicate ids and a hand-built fixture
  could never reach this state. Full record: `dev/scenario-seam-repair.md`.

- 0|318| **[DONE 2026-08-14] The offline promise is now TRUE, and verified on a real device.**
  `sw.js` precached bare paths while every page requested `?v=<filemtime>`, and `cacheFirst()`
  matched the exact URL including the query — so 22 of 25 precache entries could never be served and
  the About page's "visit any calculator, then all of them work offline" was simply false. Replaced
  by a generated `sw.php` (deployment is `git pull`, and **git does not preserve mtimes**, so a baked
  file could never carry the values pages request). `CACHE_VERSION` retired; both lists derived from
  the filesystem, picking up six missing modules and Branched-Network, a whole calculator.
  `dev/scripts/sw_manifest_check.php` renders 21 pages and diffs 174 asset URLs against what the
  worker will really cache.
  **TOM CONFIRMED IT OFFLINE, 2026-08-14**: one calculator loaded online, network set to Offline,
  then Branched-Network — never opened on that device, and absent from the old precache entirely —
  rendered and computed, fully styled. That is the claim observed rather than reasoned about.

- 0|323| **Scenario writes that bypassed `setProp` — DONE 2026-08-14.** Five confirmed
  defects from the Task 184 × Task 248 merge (the valve popup, `lenAuto`, blank overrides, a stale
  count), plus `dev/scripts/scenario_seam_check.php` (blocking), which derives its property list from
  `LPN_OVERRIDABLE` and fails rather than passing if that parse breaks. **The lesson is the asset:
  the two worktrees had DISJOINT FILE TERRITORY exactly as CLAUDE.md requires and still collided,
  because what they shared was a SEAM, not a file** — and neither harness could see it, since one
  never said "valve" and the other never said "scenario". `dev/scenario-seam-repair.md`.

- 0|320| **Moved `## Completed` into the archive: ROADMAP 7,067 → 3,325 lines — DONE
  2026-08-14.** 143 blocks moved, 251 IDs before and after. Two deploy facts found buried in closed
  blocks were promoted to CLAUDE.md rather than archived — the `AllowOverride Options` grant whose
  absence 500s the whole suite on a host move, and the untracked `sitemap.xml`. A third became a
  check: `Task 241` was cited four times from live code and had never existed, so
  `roadmap_id_check.php` now fails on a code comment citing a task that does not resolve.

- 0|216| **[DONE 2026-08-14] Outbound reference-link clicks are logged, with the visitor's
  language.** `outbound` rows in the new `SIGNAL_LOG`, reported by destination, served language and
  page. **One `click` listener on `document`, not a per-link attribute** — `mpf_friction_slope`
  carries its own `<a>` inside all 27 lang files. Test is "out of /engcalcs/"; host and path only.
  Narrative archived.

- 0|200| **[DONE 2026-08-14] Usage logging: the questions the report could not answer.** Built
  `touch`, `units`, `repeat` and `lpn` events in ONE new `SIGNAL_LOG` with an event column;
  leftovers extracted to Task 303. **The `ec_seen` digit is FULL** — five bits is one base-32 digit,
  which is what the consent banner promises — so these dedupe in page memory and store nothing.
  Narrative archived.

- 0|302| **[DONE 2026-08-14] The looped network reported NEGATIVE velocities.** `lpnReport()`
  computed `Q/A` from the SIGNED flow, so a pipe carrying flow against the direction it was drawn in
  reported a negative speed and sorted to the bottom of every extrema range. **A velocity is a
  speed; direction is carried by the flow's sign and the map's arrow.** Fixed in `js/lpn-solver.js`;
  EPANET agrees.

- 0|301| **[DONE 2026-08-14] The click that ended a backdrop Move also acted on the node it landed
  on.** Registration listens in the CAPTURE phase and clears `regMode` there, so the tool's own
  bubble-phase `pointerup` ran with the flag already false. Fixed by gating the tap's START. **A
  flag cleared inside a capture-phase listener is already false for every bubble-phase listener on
  the same element.**

- 0|311| **[DONE 2026-08-14] Two errors in Manning Trap Channel's Maynord riprap column, one ~4x
  unsafe.** The bend factor was on the wrong quantity and inverted (the source raises VELOCITY), and
  the `(Ss-1)` exponent had lost a digit. Bend factor is now 4/3 per California Division of Highways
  (1970), and `mtc_d50_mra`'s tip says so. Searcy's 0.022 was challenged and SURVIVED. Narrative
  archived.

- 0|313| **[DONE 2026-08-14] Timed both engines; the EPANET Workspace and Project now live across
  solves.** `lpnSolveEpanet()` was re-instantiating the WASM engine on every solve: 9-10 ms, not the
  1.25 ms the first bench reported — that bench hoisted the Workspace out of its own loop and so
  measured a shape the shipped code never had. Now 0.41 ms at 21 nodes, 3.19 ms at 201 (native: 0.30
  and 33.7). `dev/lpn-spike/session-harness.js`, 121 assertions plus a self-sabotage check every run.
  **The default stays `native` for the 663 KB module load alone — a bandwidth argument, never a speed
  one.**

- 0|312| **[DONE 2026-08-14] A new background image landed at the world origin, not on the model.**
  `initialBackdropPlacement()` now centres on `bbox()` as well as sizing to it. Also gave
  `downscaleImage()` an `onerror` and replaced the MIME `accept` with 10 explicit extensions. **The
  test for a format is whether somebody turns up holding one, not whether a browser can decode it.**

- 0|309| **[DONE 2026-08-14] The extrema badge was not part of the label's footprint.**
  `measureDecorRight()`/`labelBoxWidth()`; the leader, collision boxes, mask rect and `bbox()` all
  read the wider number, measured per line. Task 190's marks toggle needs no code of its own — marks
  off means no decorated line means zero reserved. Harness: `dev/lpn-spike/label-decor-harness.js`.

- 0|295| **[DONE 2026-08-14] Manning Trap Channel's roughness/rock iteration converged on a
  different answer depending on where you started.** `n_strickler` was computed ONCE before the loop
  while its three siblings were recomputed every pass: five starting guesses gave
  0.683/0.542/0.376/0.298/0.220 in, now 0.894 from all five. **A fixed point that moves with the
  initial guess is not converged.**

- 0|308| **[DONE 2026-08-14] Two defects in Manning Trap Channel, both in `mtc_iterate`'s loop-exit
  condition.** A roughness radio with no rock radio ran one pass, so v/Q/Froude came from the typed
  n, not the displayed one; and the safety factor was applied to a typed d50. **A trigger heals a
  stale OUTPUT; it cannot heal a wrong INPUT** — `solveForY` returned 66.97 cfs when asked for 60.

- 0|292| **[DONE 2026-08-13] Give the non-lpn calculators a behavioural test.** `dev/calc-spike/`
  plus `dump_calc_form.php` and `render_page.php`, blocking in `check_all.sh`. All 15 pages
  smoke-tested in both presets; `mpf` and `mtc` get worked examples. **Nothing about the form is
  restated in a harness.** Durable rules: CLAUDE.md § The review office. Narrative archived.

- 0|293| **[DONE 2026-08-13] Extract the pure functions out of `js/looped-network.js` so the map
  editor becomes testable.** Shipped `js/lpn-geom.js` and `js/lpn-collide.js` with two harnesses
  that `require()` their subject. **Split by PURITY, not by subject** — the pattern is in CLAUDE.md.
  Proved behaviour-preserving by a 24,000-case fuzz against `git show HEAD:` first. Narrative
  archived.

- 0|300| **[DECLINED 2026-08-13] A "New project" wizard picking units AND friction method.** The
  six-row arithmetic was right and the premise wrong: **the danger of a wrong unit or method is
  about EXISTING numbers changing meaning, and a blank project has none.** Tom: *"It amounts to
  nothing but advertising."* Route such impulses to Task 222 and Help, never the New menu. Narrative
  archived.

- 0|271| **[DONE 2026-08-13] Give `lpn_` a friction-method choice: HW, DW, Manning.** A Settings
  select writes `settings.method`, which `frictionMethod()` had read since Task 254 with nothing
  writing it. Labels borrowed from `bpn_`, so no new keys. **`roughnessSI()` is the dangerous line**
  — DW's e is a LENGTH and must reach the solver in metres, while n and C must NOT be converted.
  Narrative archived.

- 0|146.07| **[DONE 2026-08-13] Open/Closed link property (Task 146 child).** The feature was ~90%
  built and unreachable — `_status` was already serialized, overridable, solved and parsed from
  `.inp`; all that shipped is one checkbox and a dashed map style. **The label is "Closed", not
  "Open"** — the state worth seeing is the exceptional one. 18 checks. Narrative archived.

- 0|250|[H] **[DONE 2026-08-13] Where do we explain lpn at all? A Help menu on the page.**
  `openHelpMenu()`: Walkthroughs, Contact, About, all reusing existing keys, so zero new
  translation. The navbar duplication is deliberate — the navbar serves somebody CHOOSING a
  calculator, this menu somebody already inside one. Residual: `About.php` never names EPANET, which
  is Task 222's.

- 0|249| **[DONE 2026-08-12, closed 2026-08-13] Translate the 5 `lpn_` engine keys — into all 26.**
  They rode along with `lpn_`'s promotion to a core calculator in the Task 297 sprint rather than
  being scheduled separately, exactly as this task predicted. Verified in zh, sw and am;
  `lang_parity_check` reports 0 missing and 0 equal-to-english suite-wide.

- 0|240| **[DONE, closed 2026-08-13] `lpn_project_copy_suffix` carries a load-bearing leading
  space.** Fixed: the English key is `'(copy)'` and both call sites concatenate the separator; all
  27 files re-checked. **The `lpn_ago_*` half was WITHDRAWN — the finding was wrong**: `"ago"` lives
  in the host sentence, never the fragment, so Spanish always composed correctly. Narrative
  archived.

- 0|146| **[DONE 2026-08-13] Looped pipe network calculator with a map interface — `lpn_`.** Full
  design record: **`dev/looped-network-calculator-scope.md`** (GGA not Hardy Cross, the 10–20 node
  target, the cut list, the backdrop reasoning). **Closed with four children still open, and that is
  correct: a parent feature task closes when its scope is SHIPPED, not when its idea list is
  EMPTY.**

- 0|177| **[DONE 2026-07-30, closed 2026-08-13] Link head loss: report the per-length gradient.** It
  shipped 2026-07-30 and nobody closed the task, so it sat open at priority 20 for six weeks. **This
  suite's own dimensionless convention won; EPANET's per-1000-length form was not introduced.** The
  divisor is `linkLengthSI()`. **Deleting an open task is not the same as closing it.**

- 0|209| **[DECLINED 2026-08-13] A snoozable tip system (originated during Task 146).** Tom: *"we
  are getting along fine without tips especially since adding the Walkthroughs."* The problem was
  real — only shown-once-ever or shown-every-time — and the answer turned out to be **a place a user
  can go and look, not a mechanism for interrupting them.** Reopen only for something that must
  speak up.

- 0|299| **[DONE 2026-08-13] A wrong `layout:` tag misled four translators, and now a check catches
  the class.** `dev/scripts/layout_tag_check.php`, blocking; the rule is in CLAUDE.md. **The
  mutation test is the finding:** it caught 3 of 4 planted defects but silently passed the exact
  defect it was written for. **Plant the bug before believing the check.** `mi_d50in` deleted.
  Narrative archived.

- 0|297| **[DONE 2026-08-13] ONE sprint cleared the whole standing translation backlog.** 26 Sonnet
  agents at once, 364 strings; delta zero, drift empty, 19 friction entries closed. **Wave 0 deleted
  a feature rather than rewording it** — *a string that describes what the program DID is a claim
  nothing checks.* One defect survived to QA, caught only by reading all 26 values side by side, now
  in QA.

- 0|291| **[DONE 2026-08-13] Suffix vocabulary the hygiene check cannot judge, and a human did.**
  Eleven renames via `rename_lang_key.php --apply`, so no translated value changed and no sprint was
  owed. Each of the three excluded groups needed a different answer, which is why they stay out of
  the check: `_help` collided with `.ec-help`; `_title` carried two meanings; `_prompt` keys that
  ask nothing became `_alert`. Narrative archived.

- 0|276| **[DONE 2026-08-13] Precise background-image scaling: type the number, or hand over a world
  file.** The backdrop menu offers "Scale by picking" and "Scale by World File or pixel size" — one
  box taking either. A file that rotates, mirrors or unevenly stretches is refused with a message,
  never half-applied. `backdrop-scale-harness.js`, 32 assertions including the Cartesian-to-Y-down
  flip.

- 0|310| **[DONE 2026-08-13] `Compare-Languages.php` no longer fatals on a bare visit.** Unknown or
  missing `lang1`/`lang2` now render a two-select picker instead of reaching
  `require('lib/lang.ec..php')`. Also dropped the unconditional `echo "$langDir"` that printed the
  absolute server path on every comparison.

- 0|251| **[DONE 2026-08-13] Promote `lpn` to a core calculator — all 26 languages, 6,522 keys.**
  `lpn` is now core in `translation_coverage.json`. **Wave split retired, ~50-key batched appends
  kept** — rule in CLAUDE.md, evidence in `dev/sprint-251-waves.md`. **Verify on disk, never on an
  agent self-report.** Follow-on sprint 252 in `dev/translation-execution-log.md`.

- 0|296| **[DONE 2026-08-12] The word "water" appeared nowhere in `lpn_`'s name, title or
  description.** Retitled water-first ("Water Supply Network"; "…Water Distribution Network
  Calculator with the EPANET Engine"). **"WITH the EPANET engine", never "EPANET-powered"** — the
  default engine is native and our own tooltip says so, so the stronger claim would make the page
  argue with itself. Narrative archived.

- 0|288| **[DONE 2026-08-12] The unique identifier is gone. What is stored is one digit per page.**
  `PHPSESSID` removed outright, not gated — every session value asked "have we already counted
  this?" and none needed an identifier. `ec_seen` is one base-32 digit, which is what makes the
  banner's sentence literally true. Rules live in CLAUDE.md § What may be stored. Narrative
  archived.

- 0|290| **[DONE 2026-08-12] Six Rock Chute notes were written, translated into 26 languages, and
  rendered by nothing.** `Rock-Chute.php` displayed one of its seven; `rc_notes_7_term` existed in
  no language. Restored in language-file order so the bibliography is not in the middle. **A missing
  `<dt>`/`<dd>` pair looks like nothing at all** — `key_hygiene_check.php` found it in its first
  run.

- 0|289| **[DONE 2026-08-12] "Show page titles" — the first setting on lpn that is not part of the
  project.** **Why it is NOT project-scoped is the durable part:** whether a heading shows is about
  the window the person sits in front of, not data about the network, so it is `localStorage` and
  `serializeProject()` must never learn about it. The Settings box now has two scopes.

- 0|287| **[DONE 2026-08-12] Serve Bootstrap from this site instead of jsDelivr — the last third
  party is gone.** The vendored files' sha384 digests match the old SRI hashes, so they are
  byte-identical; that check is also the upgrade procedure. **Four places, and the fourth bites**:
  both header tags, the parent site's copy (not in git), `STATIC_ASSETS`, and `sw.js`'s branches —
  with `CACHE_VERSION` bumped.

- 0|196| **[DONE 2026-08-11] EPANET `.inp` IMPORT (Task 146 child). Export is NOT built — Task
  281.** A separate File row from Open…, since an `.inp` has no docId or handle and must not promise
  a round trip. **Import the supported subset and REPORT every difference, never reject.** Two
  EPANET behaviours were MEASURED because the obvious reading is wrong and silent: `[DEMANDS]`
  REPLACES the `[JUNCTIONS]` demand, and a TCV's loss is its SETTING ALONE. Narrative archived.

- 0|270| **[DONE 2026-08-10] Audited lpn against Tom's three blog checklists.** Report:
  `dev/lpn-new-user-guide-audit.md`; the New Shopper list is where most of the drift is. Of 10
  findings, 1 retracted, 1 downgraded, 1 strengthened, 2 fixed. **The retraction is the lesson: I
  read a JS fallback literal instead of `lang.ec.en.php`. Read label claims out of the lang file,
  always.**

- 0|265| **[REVERTED 2026-08-10, same day it shipped] Units do NOT go on the browser tab.** The
  map's status strip already answers it continuously; a tab is a second copy free to drift. **What
  survives:** `lpn_title_units` in the example's title block, with the label FORCED by the caller —
  *"We never create an example based on the current units."* Do not store "US"/"SI". Narrative
  archived.

- 0|274| **[DONE 2026-08-11] The user works in Cartesian coordinates; Y increases upward.** One
  self-inverse `cartesianY()` at the four places a coordinate reaches or leaves the user. **The flip
  is at the USER boundary, not in the world transform** — `doc` stays Y-down because that is SVG's
  own system, so the drawing is pixel-identical and only the numbers changed. Narrative archived.

- 0|277| **[DONE 2026-08-10] Moving something is undoable.** No drag handler snapshotted, so Undo
  after a drag reverted the last DISCRETE act and left the drag standing. `snapshotDragOnce()` at
  the head of all five mutating branches — **lazy, on the first frame that moves something, not on
  pointerdown**, since every select-mode press opens a drag record. Pan and pinch excluded: they
  move the camera.

- 0|275| **[DONE 2026-08-10] The Settings panel says "Saved with this project."** One note at the
  head of the panel (`lpn_settings_scope_note`, translated in the core four). Verified true of the
  panel entire before writing it: `serializeProject()` carries `settings`, `labelSettings`, `units`
  and `backdrop`, so there is no exception to hedge. It is what makes the New User template flow
  legible — there is no "save as my defaults" because saving the project IS that.

- 0|273| **[DONE 2026-08-10] The tab strip's `+` opens the New project chooser.** It called
  `newProject()` directly, inheriting whatever units were on the strip — the last place a project's
  units were decided by accident, and the one Task 264 removed from File > New. Both doors now ask
  the same question, and both inherit Task 271's wizard when it lands.

- 0|263| **[DONE 2026-08-10] Inputs are stored as declared; nothing converts them on a unit
  change.** `lpn_` stored SI and displayed the conversion, so a unit switch silently rewrote the
  whole map. Now conversion happens at the solver handoff and on results coming back, nowhere else.
  **The project owns its units**, so there are no browser units and no "save as defaults"
  (CLAUDE.md). Narrative archived.

- 0|264| **[DONE 2026-08-10] "Draw example network" retired; File > New project instead.** A real
  fly-out whose rows are Blank project US/SI and two examples. **Each example commits to a unit
  system rather than adapting to yours**, which unblocked Task 263 — and a blank row that inherited
  the strip was the last place a project's units were decided by accident. Narrative archived.

- 0|268| **[DONE 2026-08-10] lock-free / unlocked / unchained added to `menu_libre`'s synonyms.**
  Tom's order, most-liked first. English `menu_libre` unchanged — still an open question whether
  "Lock-free Software" is a better nav item than "Libre Software"; it needs no `avoid: gratis` guard,
  which is an argument for it.

- 0|262| **[DONE 2026-08-10] A file opened in a no-connect browser arrived already asterisked.**
  `importProjectFromFile()` now sets `savedSig`/`dirty`/`exported` as the download path does — a
  file handed to us off the user's own disk is the strongest case of "a copy exists on disk".
  **Recent files is absent in a no-connect browser and that is correct**: with no handle, the list
  could name only files it cannot open.

- 0|261| **[DONE 2026-08-10] A Computation section in lpn Settings.** Convergence tolerance and the
  EPANET engine toggle had accumulated loose in the headingless tail among the panel's *actions*
  (Restore defaults, Clear calculator), so a reader could not tell where the settings stopped. One
  setting there was fine; two were a group without a name. The tail now holds buttons only.

- 0|260| **[DONE 2026-08-10] The lpn map canvas is plain white.** Tom, very high priority. Was
  `#f7f7f2` in three places — `css/engcalcs.css` (twice, including `--lpn-map-bg` behind the symbol
  occlusion patches) and the inline `background` on `#lpn_canvas` in `Looped-Network.php`.

- 0|259| **[DONE 2026-08-10] Navbar overlap just above the hamburger breakpoint.** Bootstrap's
  `.navbar-expand-lg` pins the expanded bar to `flex-wrap: nowrap`, so from 992px to ~1150px nothing
  yields and every nowrap item spills out of its shrunken box. `css/engcalcs.css` now lets the
  navbar wrap in that band. "Libre Software" also now links to the README's `#license` section.

- 0|258| **[DONE 2026-08-10] File > Recent files on Looped-Network.** Up to 8 file handles in a
  second IndexedDB store that outlives the projects — `handles` is deleted on close, which is why it
  could not carry this. Deduped by `isSameEntry()`, not by name; clicking a row spends the click as
  the user activation `requestPermission()` needs. 26 checks, mutation-tested.

- 0|225| **[DONE 2026-08-09] The `lpn_` punch-list leftovers — small, confirmed, none dangerous.**
  Full wording in `dev/lpn-file-lock-test-punchlist.md` § Findings. Closing a tab now activates the
  next tab RIGHTWARD; a diagnostic status only temporarily outranks a notice instead of eating it;
  the "gone for good" prompt no longer fires for an empty untouched project. §13 split out as Task
  225.13.

- 0|252| **[DONE 2026-08-09] Reorder project tabs, left/right, via the tab menu.** Built the cheaper
  of Tom's two options because it works on touch, where dragging fights the scroll gesture:
  `openProjectMenu()` gained Move left / Move right rows, backed by `moveTab(id, dir)` swapping
  position in `library.projects`. New keys `lpn_tab_move_left`/`_right`, English plus the core four.

- 0|256| **[DONE 2026-08-09] `dev/lpn-spike/popup-tips-harness.js` was dead** — `MODULE_NOT_FOUND`
  before a single check ran, so its ~60 assertions had been reporting nothing. Four causes fixed.
  **New `dev/scripts/run_harnesses.sh`** runs every lpn harness and fails on the first non-zero exit
  — the actual fix for "nothing runs these harnesses", which is how this went red for weeks.

- 0|255| **[DONE 2026-08-09] `lpn_` was solving US networks with the length in the wrong unit; head
  loss was 3.281x too high.** `assembleModel()` handed a declared length straight to an all-SI
  solver. Fixed by `linkLengthSI()`. **Verified against a HAND-COMPUTED case, never the other
  engine** — both read the same model, so both were wrong and agreed. **A check that never crosses a
  unit boundary cannot find a unit bug.** Published US answers changed. Narrative archived.

- 0|254| **[DONE 2026-08-09] The lpn example network is a real ring main, at project scale.**
  Reservoir, pump, a five-junction ring with a hydraulic divide, a separate gravity system inside
  the ring, four Text annotations composed from existing keys, 1400 × 700 on 5000,5000. **Map
  coordinates FOLLOW the Length/Map declaration**, so it is a 1400 ft ring in US and 1400 m in SI —
  accepted only while there is no backdrop. Narrative archived.

- 0|243| **[DONE 2026-08-09] Real EPANET engine in `lpn_`, as an opt-in second engine.**
  `js/lpn-epanet.js` + `js/vendor/` (epanet-js 0.9.0, MIT), off by default and lazy-imported, so the
  offline case pays nothing. **Manning is a real 0.6% disagreement and we KEPT OURS** — EPANET's
  would desync this page from the Manning calculators that carry most of our users. **Do not
  relitigate.**

- 0|245| **[DONE 2026-08-09] About-page resync + `menu_libre` into all 26 languages.** Every
  language used its own established free-software term; not one transliterated "libre". **Found a
  silent parse-truncation bug in `lang_parse.inc.php`** — Burmese at 3 bytes/char exhausted PCRE's
  JIT stack and the unchecked `preg_match_all` truncated a parse to 386 of 563 keys, blinding four
  tools at once.

- 0|146.10| **[DONE 2026-08-09] Real element symbols on the lpn map, from the Task 231 icon set.** A
  reservoir and a junction had been the same `<circle>`, and a pump had no symbol at all. Toolbar
  icons are reused verbatim as map marks over an invisible-but-clickable original, so hit-testing,
  labels and `bbox()` are untouched. All four size constants are deliberately experimental.
  Narrative archived.

- 0|235| **[DONE 2026-08-09] The glossary's `pressure` and `elevation` entries no longer hold the
  UPSTREAM label form in any of the 26 languages.** Both were created by harvesting the attested
  forms of `hw_pressure_up`/`hw_elev_up`, and **the entries' own notes said so — the defect was
  documented as a feature.** Caught by the tr translation agent, who declined to apply it. Spun off
  Task 242.

- 0|238| **[DONE 2026-08-08] "Map display and sizes" fixed at the source; "Restore defaults" audited
  in all 26.** The English was the defect — an ambiguous coordination — so fixing it fixed all 26 at
  the source. `calc_defaults` was audited by **cross-checking each language against ITSELF** (every
  language ships the concept twice), which makes it auditable without 26 native speakers. Narrative
  archived.

- 0|237| **[DONE 2026-08-08] "Zoom to fit" shipped meaning "adjust the zoom" in 2 of 4 languages.**
  es and pt were wrong; fr and tr right. **The English is deliberately NOT reformed** — it is an
  established UI idiom and renaming a recognized control costs more than guarding it. The guard is
  the glossary concept `zoom to extents`, wired into `prefixToTermNames()` in the same commit.

- 0|236| **[DONE 2026-08-08] The last preview-era sentence is gone — Tom said delete.**
  `lpn_notes_3_def` still ended *"Because this is an early preview, please use it for small networks
  and for testing only."* Raised as a question rather than fixed inside the sprint, because it
  tangled a dead framing with a live scale caution and dropping a caution is not a sprint's call.
  Deleted from all five files.

- 0|146.06| **[DONE 2026-08-08] Translation sprint for `lpn_` strings (Task 146 child).** 223 keys ×
  es/pt/fr/tr; suite-wide `equal_to_english` went to 0. **A pre-sprint check caught the biggest risk
  before an agent was spawned:** `prefixToTermNames()` had no `lpn` or `bpn` entry, so Task 193's
  whole glossary seed was invisible. Also fixed a note claiming "English only for now" — **agents
  will faithfully translate a lie.** Narrative archived.

- 0|230| **[DONE 2026-08-08] The open-channel velocity verdict stopped citing water hammer.** Both
  Manning channel pages fed the verdict from `mhp_vel_high`, so a trapezoidal channel was told to
  check water hammer. A real `mtc_vel_high` now exists, translated into all 26 the same day —
  **inline by the orchestrating model; 26 paid agents for one string is the wrong shape.** Narrative
  archived.

- 0|232| **[DONE 2026-08-08] `Irrigation.php` removed — the page and its 17 keys are gone.** Tom
  called the menu entry "harmful and spammy". **The number that settled it: reach 1,977, confirmed
  humans 0, used 0** — pure crawler traffic, so there was no audience to strand. **`../sitemap.xml`
  is regenerated but NOT tracked by git** — re-upload it on deploy or the dead URL stays advertised.

- 0|231| **[DONE 2026-08-08] Toolbar: icon as a small prefix to the text, never icon-only.** Glyphs
  live in the markup, never in `$ec_lang` — a glyph baked into a translated value is 27 copies of
  one decision — so this cost no new keys. **Icon-only was rejected on the merits:** it saves no
  translation work and spends first-time comprehension. The A/B poll was rejected too. Narrative
  archived.

- 0|146.02| **[DONE 2026-08-08] EPANET-style icon toolbar — shipped as Task 231; map symbols
  extracted to 146.10.** One SVG icon set in `lib/Icons.lib.php` applied to the lpn menus and shared
  site chrome. **This task's gate on 146.06 is RELEASED:** it gated the sprint only against string
  churn, and icon-as-prefix added, renamed and removed zero language keys.

- 0|205| **[DONE 2026-08-08] One "contact me" line per page, not two.** `template_translation_help`
  and `echoHelpWanted()` deleted from 18 pages and all 27 files; `template_feedback` absorbed the
  wording ask and sits after the results — **give first, then invite**. The `[Hide this line]`
  toggle went too: a dismiss affordance is the visual grammar of a cookie banner. **"me", not
  "us".** Narrative archived.

- 0|229| **[DONE 2026-08-08] The drift tripwire can tell "no translator needed" from "nothing
  changed" — `detect_english_drift.php --update=<key>`.** A URL-only fix flagged CHANGED exactly
  like a rewritten sentence; a hash cannot see *why* a string moved. The tool **refuses to silence a
  key until every language file already carries the same URLs as English**, and records the reason
  in the manifest.

- 0|215| **[DONE 2026-08-08] The Title/Subtitle milestone is logged — the closest instrument this
  suite can build to its own mission.** Its own one-shot beacon, not a flag on the calc event, since
  a title is typed *after* the first calculation. **The typed text is never sent and never stored**,
  asserted as a standing property. Bound on `change`, so a value restored from a cookie fires
  nothing.

- 0|227| **[DONE 2026-08-08] `prod_smoke.php --links` now follows the links our pages emit.** Two
  sources — served pages AND all 27 lang files, since only one language renders per request.
  Off-site links are advisory. **It refuses to run against a host that answers 200 for everything.**
  Found two real defects on its first production run. Narrative archived.

- 0|226| **[DONE 2026-08-08] The Feedback invitation on every calculator page had been a 404 for six
  weeks.** `echoFeedback()` still linked `../contact.php` after commit `b625286` moved contact into
  `engcalcs/` and repointed only two of its three referrers. **Any funnel number that includes
  2026-08-07 is contaminated; the clean baseline starts 2026-08-08.** The failure is silent on both
  ends.

- 0|206| **[DONE 2026-08-07] Measured the contact funnel — the one metric the mission cares about.**
  Two causes were indistinguishable and call for opposite fixes: nobody clicks, versus people click
  but do not send. The send half is logged SERVER-SIDE in `formmail.php`'s success branch, because a
  submit-handler beacon races the navigation and can only count attempts. Narrative archived.

- 0|223| **[DONE 2026-08-06] Fixed the defects from the 2026-08-05/06 `lpn_` browser passes.** Root
  causes: `dev/lpn-file-lock-test-punchlist.md` § Findings. **The lock design was reworked, not
  patched** — a claim survives minimise and reboot, made safe by a write-time freshness check, so
  the lock is a courtesy and the check is the guarantee. **A guarantee guarding one of two write
  paths guards neither.** Narrative archived.

- 0|220| **[DONE 2026-08-06] Browser-verified `lpn_` project files and locking against the post-211
  UI.** Punch list `dev/lpn-file-lock-test-punchlist.md`, §0–§8 rewritten against tabs, the File
  menu and opt-in read-only. Closed with 138 automated checks over two real browser profiles plus
  Tom's §H pass. **Deliberate take-over via *Break their lock* is supported and always was.**

- 0|224| **[DONE 2026-08-06] The punch list runs itself: `dev/browser-pass/`.** 138 checks over two
  real browser profiles against the real broker in about a minute. **The one lie is the picker** —
  replaced with real OPFS handles via `addInitScript`, so no test-only code ships. **`getFile()`
  succeeding is not proof the file is there** — it answers from metadata. Narrative archived.

- 0|219| **[DONE 2026-08-05] `lpn_` added to the Related-calculators line, and its identity strings
  translated.** Done inline rather than a 26-agent sprint — the delta was ~3.5 strings per language,
  91 total, and all 22 non-core languages reached delta ZERO. **Each language's word for "looped" is
  its own professional term, not a calque**, written back to the glossary. Narrative archived.

- 0|213| **[DONE 2026-08-05] Hazen-Williams unified on EPANET's constants.** New
  `js/PipeHydraulics.lib.js` owns the one pair (SI 10.666829 from EPANET's US 4.727, exponent 4.871)
  plus `hwSlope()`; three calculators call it and the dual set is gone. Head loss moves ≤0.12%. The
  DW and Manning kernels stay duplicated on purpose, to move under a behavior-preserving diff.

- 0|174| **[DONE — verified 2026-08-05] Extract `echoUnitsRow()` from `echoCalculatorForm()`.**
  Found already built while reviewing the board: `lib/Calculators.lib.php:153` defines it, and both
  `echoCalculatorForm()` (:207) and `Looped-Network.php:35` call it — which was the whole point. It
  even grew a second flag (`$flagHideDefaults`) for `lpn_`. Shipped as part of Task 146's map-page
  work without anyone closing this ticket.

- 0|203| **[ADOPTED 2026-08-05] The COVERAGE MATRIX: a core cross of calculator × language.**
  The rule and its consequences live in **CLAUDE.md § The coverage declaration** and in
  `dev/scripts/translation_coverage.json`; `coverage_selftest.php` asserts them. In one line: a cell
  is in scope iff the calculator is core OR the language is core (core = `mpf`,`mtc` × es,pt,fr,tr;
  108 of 416 cells, 98.2% of measured use). Identity strings are never out of scope. Narrative archived.

- 0|204| **[DONE 2026-08-05] Coverage declaration for the translation tooling — required before Task
  203's matrix.** `translation_coverage.json` + `coverage.inc.php` + `coverage_selftest.php`, with
  all four scripts wired. **The obvious shortcut is forbidden by our own rule** — the exempt list
  means *identical to English is permanently correct*, and parking an untranslated body there would
  destroy delta-zero. Narrative archived.

- 0|211| **[DONE 2026-08-05] The tab-and-File-menu paradigm for `lpn_`: projects as tabs, files as files.**
  Supersedes Task 195's Phase 2 UI. Triggered by Tom stopping his browser pass mid-test — the UX was
  too confusing — and it **deleted more than it built**: no autosave to file, opt-in read-only, no
  Delete, an ordinary File menu. Made Task 208 obsolete. Full design narrative archived.

- 0|212| **[DONE 2026-08-05] Persisted file handles — a reload no longer drops the file.**
  Handles live in IndexedDB (localStorage cannot hold them); on boot `queryPermission()` reconnects
  a granted one silently, holds a `prompt` one for the first pointerdown/keydown so the revival
  needs no user activation of its own, and drops a denied one. Verified by
  `dev/lpn-spike/handle-restore-harness.js` (26 checks, mutation-tested). `Open Recent` was deferred
  from here and shipped as Task 258.

- 0|208| **[OBSOLETE 2026-08-05] A lock that travels with a COPY of a file is the wrong lock.**
  Ruled obsolete by Tom on reading the post-211 state: opening a file someone else holds now offers
  **Create a copy** as a first-class answer, so the lockout this existed to fix no longer happens to
  a user. Analysis archived.

- 0|195| **[DONE 2026-08-03 — both phases shipped] Export/import a `lpn_` project as a file.**
  Phase 1 one-shot JSON download/import; Phase 2 live `FileSystemFileHandle` with a server lock
  broker (`lpn-lock.php`). Phase 2's UI was then superseded by Task 211's tab-and-File-menu rebuild.
  **Browser verification is NOT part of this task — it is Task 220.**

- 0|210| **[DONE 2026-08-03] Stop counting Tom's own visits in the usage logs.** `?ec_nolog=1` sets
  a ten-year cookie effective on the same request; all three writers check the one flag and both
  beacon endpoints answer **204, not an error**, so an opted-out event is never queued for retry.
  **Post-hoc detection is explicitly not to be built** — it cannot be applied retroactively and
  would delete the real multilingual users we most want to see.

- 0|199| **[DONE 2026-08-03] `lpn_` logged no real usage at all.** `submitForm()` fires only from
  the unit dropdowns and preset buttons on that page, so **the "used" column was counting unit-strip
  changes, not networks solved**, and the 6%-vs-70% reading was a different event from the other
  fifteen rows. `runSolve()` now logs. **`lpn_`'s conversion is simply UNKNOWN before 2026-08-03.**

- 0|146.08|[CC] **[DONE] Multiple named saved networks (`lpn_`).** Local multi-project save/retrieve,
  shipping the project container from day one so Task 184's delta/scenario model stays open. Not
  EPANET `.inp` interop — Tom confirmed 2026-07-29 that is not needed (Task 196). Detail archived.

- 0|197| **[DONE 2026-08-03] Tooltips stuck visible — the hover+click trigger stack (suite-wide).**
  The 2026-07-30 fix covered controls only, so every PLAIN LABEL kept all three triggers. **The real
  rule is narrower: a tip must never carry both a hover trigger and a click trigger**, because
  Bootstrap will not hide while any is active. One opening gesture per device; 16 checks over all
  four combinations.

- 0|198| **[DONE 2026-08-03] Flow arrow moved downstream of midpoint (Task 146 child).**
  `ARROW_ALONG` 0.3 → 0.7, measured from the upstream end. One constant: `flow < 0` already mirrors
  it, and the label-collision test derives from the same value, so label separation follows
  automatically.

- 0|173| **[DONE — built during Task 146, closed 2026-08-03] `EngCalcs.initTips(root)` — tooltips
  built after page load were dead on touch.** `js/looped-network.js` calls it after building the
  toolbar, each popup and both panels. **It had been built and never closed, sitting at priority 30
  long enough to distort every "what is next" reading** — closing means priority → 0 AND the move,
  in one edit.

- 0|193|[CC] **[DONE 2026-07-31] `lpn_` English tightening pass.** The English-reform gate run before
  the 146.06 sprint so each fix is paid once instead of 26 times. Every `lpn_` key reviewed, 51
  changed, plus trap-term tips and a glossary seed. Narrative archived.

- 0|189| **[DONE 2026-07-30] Per-field decimal places on map labels (Task 146 child).** A 0–4
  spinner on each numeric field's row in the **Labels popover, not Settings**.
  `labelSettings.decimals` is a **parallel map**, not a shape change to the boolean maps merged
  key-by-key out of localStorage. Decimals feed `displayRound()`, so extrema stay judged on the
  rounded display value.

- 0|190| **[DONE 2026-07-30] Toggle for the high/low marks on map labels (Task 146 child).**
  `labelSettings.markExtrema`, one checkbox, **global rather than per field**. Enforced in
  `decorationFor()` rather than by suppressing the extrema, so turning them back on needs no
  recompute. Forced a fix to `loadFromStorage()`, whose merge `Object.assign`ed a bare boolean and
  lost it.

- 0|188| **[DONE 2026-07-30] `lpn_` backdrop fade, heavier pipes, popup placement, and a
  click-blocking bug.** **Fading the REFERENCE material generalises where thickening the drawing
  does not** — a drawing tuned against a busy aerial still reads on white and in print. Pipes went
  0.5 → 0.7 (lighter than the node outlines above them); popups open beside the element's label.
  Narrative archived.

- 0|187| **[DONE 2026-07-30] `lpn_` link labels at the true midpoint; roughness and minor loss added
  to the Labels choices.** `linkLabelMid()` took the midpoint of the middle SEGMENT, which on a bent
  pipe lands in the second leg; it now walks the polyline by arc length and steps clear of any
  arrow. `lpn_field_km_short` exists because a shared label must fit its narrowest use — the on-map
  legend.

- 0|182| **[DONE 2026-07-30] Sticky tooltips on interactive controls — suite-wide.** Every tip
  carried `'hover focus click'`; Bootstrap tracks the three separately and refuses to hide while any
  is active. Fix: decide the trigger from what the element IS. Superseded by Task 197, which found
  the same defect surviving on plain labels. Narrative archived.

- 0|183| **[DONE 2026-07-30] `lpn_` map geometry: scaling gaps, arrow placement/width, symbol
  opacity.** Extrema badges and the leader threshold were fixed world sizes beside constants that
  already scaled with the font; both now go through `textFactor()`. Arrows were double-scaled — **an
  SVG `transform` scales the stroke with the geometry**, so also scaling `stroke-width` squared the
  factor.

- 0|180| **[DONE 2026-07-30] Tom's third review round on `lpn_`: live collision recalc, 3-point
  Example pump, symbol size, legend headings.** The collision pass had to be made IDEMPOTENT before
  it could run during a drag — it kept the previous nudge and pushed further, so per-frame runs
  would drift. Symbols are sized as a MULTIPLE OF THE TEXT, inheriting its map-vs-screen units.
  Narrative archived.

- 0|179|[CC] **[DONE 2026-07-30] Tom's second `lpn_` review round.** Five pieces of test feedback,
  three of which reversed decisions recorded as settled in Tasks 176 and 146.01. Headline: a
  Reservoir is also a Tank (carries Elevation as well as Head). Detail archived.

- 0|146.01|[CC] **[DONE 2026-07-30] Draggable data labels on leaders, collision avoidance, background
  mask (`lpn_`).** Node/link labels carry an optional drag offset persisted like any other property
  (`js/looped-network.js`); past a 4-unit threshold a leader line is drawn. Detail archived.

- 0|146.03| **[DONE 2026-07-29] Text label custom size multiplier.** Per-label `sizeMult` (default
  1) stacks on `settings.textSize` via `effectiveFontSize(mult)`; only a Text label carries one.
  Persisted with the label — no storage-version bump, since old labels fall back to `sizeMult || 1`.
  Rich text formatting stays explicitly undesigned per the scope doc.

- 0|176| **[DONE 2026-07-30] Pump curve entry, head-gain/head-loss reporting fix, demand/flow colour
  unification.** The pump popup offers entered points or another pump's id, resolved one hop only so
  a cycle cannot form. A pump's head GAIN had been reading as a 70 ft "Head loss"; **that split was
  then REVERSED by Task 179** (Tom: "Negative head loss is fine"), so there is no `headgain` field.

- 0|163| **[DONE 2026-07-28] Language strings standardized on single quotes; the validator's blind
  spot closed.** Rule D lives in CLAUDE.md. **The original entry's central claim was wrong** — it
  sized the gap at 43 benign keys from the English file alone; there were **660 double-quoted
  assignments across 27 files, eight real translated content**, two of them interpolating. **Never
  land a mechanical rewrite of the lang files without a `var_export` diff.**

- 0|166| **[DONE 2026-07-28] The 26-language sprint ran.** ~406 strings: 11 new keys common to every
  language, the per-language stragglers, and a resync of two CHANGED keys the payload delta cannot
  see. **Four defects the agents' self-reports missed** were caught by verification — three reported
  a key "already in sync" while none had edited the file, which is the signal. Narrative archived.

- 0|170| **[DONE 2026-07-28] Hazen-Williams and Darcy-Weisbach got their own waterline note.** New
  `hw_note_1` (owner: HW, by reach — 580 humans vs DW's 67) replaces `mphl_note_1` on both waterline
  pages, so the culvert material stays on the culvert calculator. Covers the unmodelled profile,
  negative pressure, the upstream boundary condition and the K total. Fixed a latent unclosed
  `<dl>`.

- 0|168| **[DONE 2026-07-28] Darcy-Weisbach reworked upstream-first.** One "Downstream EGL" input
  became upstream elevation, upstream pressure and downstream elevation, with downstream pressure as
  the headline result. **Zero new language keys** — the eight `hw_*` labels were borrowed whole
  under the concept-level reuse rule. DW and HW agree to within 0.4% on the same pipe.

- 0|169| **[DONE 2026-07-28] Reworded `mphl_note_1`'s opening claim.** It said "doesn't account for
  pipe elevation", which stopped being true once Tasks 167/168 gave HW and DW endpoint elevations.
  Now "does not model the pipe profile between the two ends" — true on all three pages, naming the
  real limitation rather than a superseded one. The remaining culvert bulk became Task 170.

- 0|167| **[DONE 2026-07-28] Hazen-Williams reworked to solve downstream from the end the user
  knows.** The page had asked a waterline engineer for the one number they do not have; one input
  became three. **Separating elevation from pressure bought a real check, not just a nicer form**: a
  negative downstream pressure means the HGL fell below the pipe, which prose could only warn about.

- 0|165| **[DONE 2026-07-28] Default unit preset is chosen by language.** English gets US customary,
  every other language SI; measured reach is en 83%, es 10%, then a ≤1% tail, so one global default
  had to be wrong for someone. **"English" is not "United States", accepted deliberately** — one
  exception to the two-letter code the whole language system rests on is worse. Narrative archived.

- 0|164| **[DONE 2026-07-28] Realistic defaults on every calculator, and per-preset default
  declarations.** A default is in the *displayed* unit, so declarations now take `'us'`/`'si'`
  pairs, decoupling every number from the choice of preset. 45 defaults replaced, **every velocity
  check verified by running each page's real `pageCalculator`.** Table: `dev/unit-families.md`.

- 0|162| **[DONE 2026-07-28] Unit presets rebuilt on named unit families.** `'units' =>
  'distance_small'` names a family defined once; presets are family → unit maps. **Named families
  rather than merely split arrays**, because several families must share one option list. The rule —
  *split on different defaults, not different options* — is in CLAUDE.md. Full record:
  `dev/unit-families.md`.

- 0|161| **[DONE 2026-07-28] Payload-delta false positives eliminated.** The suite-wide delta fell
  341 → 68 and six languages read zero for the first time, so **that zero is now worth reading**.
  **The `symbol` intent tag was rejected as the exemption source** — it means "keep the symbols
  inside this string intact", not "this whole string is a symbol". Cognates are exempted
  per-language, never globally.

- 0|159| **[DONE 2026-07-28] Translation debt resync sprint — 26 languages.** Driven off a
  hand-specified key list rather than the payload delta, which is blind to stale-but-present keys.
  Three process lessons: count the language list before spawning; **never relaunch a "failed" agent
  without diffing its file first**; and any script rewriting `glossary.json` must halve its
  indentation.

- 0|151| **[DONE 2026-07-28] Sewer-slope demand: the doc was findable all along.** Tom corrected the
  task's own headline — `sewslope.php` ranks and gets seen, so 0.5% CTR is a *satisfaction* failure,
  not a discovery one. Shipped on the parent site: meta descriptions, SI columns in Table 1, and a
  back-link from Manning-Pipe-Flow, which carries 67% of the suite's human audience. No sewer-slope
  calculator.

- 0|157| **[DONE 2026-07-28] `index.php` now has a real meta description.** The one page Task 150's
  reuse trick could not cover, since its only candidate key *is* the title. **One bespoke key is the
  deliberate single exception to reuse-or-nothing**, on the page where a description carries most
  weight: 26 strings against the 520 a per-page scheme would have cost.

- 0|142| **[DONE 2026-07-28] `ip_max_head` label vs. tip mismatch — resolved on PRESSURE.** **Tom
  changed the LABEL, overruling CC's opposite recommendation**, because a pipe *pressure rating* is
  how irrigation designers specify this limit and the field already offers psi/kPa/bar. **The
  quantity and its unit list are unchanged; only this label's English noun** — the glossary's `head`
  guard still holds.

- 0|152| **[DONE 2026-07-28] HY-8 itself is now linked from both culvert-adjacent notes.** Both
  named HY-8 while linking only the tutorial video. `mphl_note_1` gained the honest scope sentence:
  this page solves outlet control only, and culvert design is deciding which control governs. **No
  culvert calculator — reaffirmed, not reopened.** Both notes' unclosed `<dl>` is now emitted by the
  pages.

- 0|154| **[DONE 2026-07-28] Turkish ASCII-fold scan — tr is clean; no fold found in any language.**
  **Method: deterministic self-evidence, not an agent pass** — if a word appears in one file both
  with and without diacritics, the bare form is a fold. All four tr candidates were false positives.
  Precision is high for Turkish and low for Romance/Slavic, so a clean tr result is meaningful.

- 0|150| **[DONE 2026-07-28] Every page's meta description was just its own title repeated.** 19
  pages now point `$html_desc` at their own `<prefix>_main_desc`, fixing it in every language at
  zero translation cost. **This was first built the expensive way and Tom caught it** — 20
  purpose-written keys pushed the delta 365 → 885, and the rule is now reuse-or-nothing (CLAUDE.md).
  Narrative archived.

- 0|156| **[DONE 2026-07-28] `.git` and directory listings were readable over HTTP.** `<FilesMatch
  "^\.">` matches filenames, not directories, so the packfiles downloaded intact — making
  `dev/.htaccess`'s block decorative. No credentials in history. Fixed with `RedirectMatch 404` and
  `Options -Indexes`; **the latter needs `AllowOverride Options` or Apache 500s everything**, so
  re-test it if the site moves.

- 0|149| **[DONE 2026-07-28] Non-English pages were effectively absent from the search index —
  `hreflang`, canonical and sitemap now emitted.** One URL served every language and nothing
  declared the `?lang=xx` forms, so Googlebot indexed only the English rendering.
  `ec_canonical_url()` is built from `SCRIPT_NAME` and `CANONICAL_ORIGIN` is deliberately not
  `HTTP_HOST` — both are client-supplied.

- 0|153| **[DONE 2026-07-28] Resync `template_feedback` — 26 languages brought in line with the
  reformed English.** The old wording was flattery-fishing; **the tell was that `$ec_lang_intent`
  had already rewritten it to nearly the new wording, i.e. the intent was doing repair the source
  should have done.** Done inline, not as a sprint. "Tell your friends!" evangelism was considered
  and rejected.

- 0|148| **[DONE 2026-07-27] `template_welcome`'s `>> ... <<` markers replaced with CSS italics.**
  **Done as CSS, not `<em>`, for two reasons:** it gets presentation out of the language strings
  entirely (an `<em>` would leave 27 translators hand-copying markup, which is how the markers
  diverged), and it allows a per-script exception markup could not express — italics off for the 11
  non-italic scripts.

- 0|140| **[DONE 2026-07-27] Get HTML out of language strings where it cannot work, and enforce it mechanically.**
  Produced Rules A–D, which are the durable output and live in **CLAUDE.md § Language Keys** — read
  them there, not here. Enforced by `dev/scripts/lang_syntax_validate.php`. Tom's close: do step 4 +
  enforcement, retire step 2 as superseded by step 1. Full narrative archived.

- 0|147| **[DONE 2026-07-27] sw `kichwa` → `kimo` head-term conversion finished.** All 16
  stragglers; the file now reads `kimo` in all 37 hydraulic uses. **A straight swap was safe because
  both are noun class 7**, so every concord marker stayed valid. **Lesson: the 2026-07-22 glossary
  note listed the keys it changed, which reads as completion but was a partial pass — grep the whole
  file for the rejected term.**

- 0|139| **[DONE 2026-07-27] Points-data copy/paste on Irrigation-Pressure (`ip_`).** A wrong
  singleton count, off by one, because `h_max_allow` was added later without bumping it — so Copy
  emitted a grid shifted one cell left and Paste wrote the shift back. **`bpn_` had the same defect,
  worse.** **This bug is silent and recurs every time a field is added above a row table**; the
  check is three lines.

- 0|141| **[CLOSED 2026-07-27 as already answered] Is `Kichwa` (sw) / `الرأس` (ar) really the
  hydraulic-head term?** No for sw (`kimo` is); yes for ar under defer-to-cultural-standard — an
  anatomically-derived word that IS the dominant local standard is correct. **An earlier version
  claimed a 7-of-26 inconsistency by comparing pipe pressure head against weir head; that finding is
  withdrawn.**

- 0|143| **[DONE 2026-07-27] Move the solver control into the depth label on `mtc_` and `mpf_`.**
  The banner now sits on the second line of the field's own label, so the thing you solve for and
  the control that solves it are one element. **`mpf_solve_for_flow` is one whole key, never a
  preposition composed with a noun at render time.** Cookie format bumped to v2 — the control's
  inputs take positional slots.

- 0|138| **[DONE 2026-07-27] Optimize suite-wide "Related calculators" links.** Re-scoped to five
  links on three pages by the evidence: **MPF alone is 67% of all human views and MPF+HW+MTC is
  92%**, so a link on a long-tail page is seen by 6–17 humans. **Reciprocity was explicitly
  rejected** — 11 page edits to place links in front of a rounding error. No new keys. IP's 4%
  conversion remains un-diagnosed.

- 0|137| **[DONE 2026-07-27] Branched (distributary) pipe network calculator, `bpn_`.** Source →
  main → branches delivering fixed demands, where EPANET is overkill: parent-pointer topology,
  single-pass fixed-demand solve, series-by-default. Spec:
  `dev/branched-network-calculator-scope.md`. **The filing lesson: never park future work inside a
  DONE block** — closed blocks are not scanned.

- 0|136| **[DONE 2026-07-21] Reworded `template_translation_help` to invite native-language
  review.** Resynced into all 26 so the invitation appears in-language — a passive, always-on
  companion to the Task 135 sw review. The English edit correctly tripped
  `detect_english_drift.php`, validating the tripwire on a real change. **6 of 7 "failed" agents had
  already landed correct edits before erroring.**

- 0|129| **[DONE 2026-07-21] Stale-English-revision resync audit.** Explicit-key-slice sprint over
  the 5 keys whose English was shortened in the Wave-0 reform while several languages still carried
  the older text. **Driven off an explicit key list, not the payload delta, which is blind to
  stale-but-present keys.** 9 languages carried drift and were rewritten; 17 already matched.

- 0|126| **[DONE 2026-07-21] Suite-wide tooltip markup migration.** The legacy inline-styled
  `cursor:help` span pattern migrated to `.ec-help`/`.ec-tip`, which is what actually fires tap
  tooltips. Residue was 7 `rc_` keys across 11 languages (the old "es/ru/zh clean" note was wrong).
  Done with a scripted converter that moves each translated label INSIDE the wrapper, not a pure
  attribute swap.

- 0|130| **[DONE 2026-07-21] `odt_` fix + vessel-first rebrand.** Menu became "Pond & Tank Drain
  Time" (Tom-locked), title and description reordered vessel-first, then re-translated into all 26.
  Hand- specified key list, because **the payload delta is blind to
  changed-English-under-stale-translation.** An apparent entity double-encode turned out to be
  notification display escaping.

- 0|127| **`mhp_diameter` tooltip restored suite-wide — DONE 2026-07-21 (rode in Task 130).** The 15
  languages missing the `.ec-help` "(supply pipe)" tooltip got it added (translated gloss, existing
  penstock term reused); the 11 that already had it were left intact. Tag-parity verified on all 26.

- 0|134| **[DONE 2026-07-21] Units audit + bar/kgf-cm² gap-fill.** Defined `kgfcm2`, refined `bar`,
  pruned dead `atm`/`knpm2`/`knpcm2`, wired bar + kgf/cm² into all 27 pressure/head dropdowns.
  Regional-norms research drove it: kgf/cm² is the Asia norm, atm is lab-not-water. **Design note:
  units are universal, not per-locale** — the architecture has no per-language dropdown
  customization.

- 0|131| **[DONE 2026-07-21] Translate the 5 trap-term tips into 26 languages.** Glossary + `avoid`
  injected, driven off an explicit grep-slice rather than the payload delta. Each agent preserved
  the existing translated label and added the definitional tip in whole-label `.ec-help` form —
  **tip-only scope, labels untouched.** Findings spun out as Task 133 and left open in Task 128.

- 0|128| **[CLOSED 2026-07-21] Trap-term native-confirmation residue (sw specific gravity + my/he
  head).** Closed on Tom's directive that **native review is not realistically available and we
  defer to the locally natural term** — all three kept. **The upstream fix is the durable part: the
  glossary `head` family's blanket `avoid: anatomical "head"` was itself mistaken** and was reframed
  across all 7 entries.

- 0|133| **[DONE 2026-07-21] Cross-key specific-gravity LABEL consolidation (per-language).** In
  each of 5 languages `mtc_sgrock`'s divergent weight-flavored label was aligned to `rc_sg`'s, which
  already held that language's dominant standard. **It aligned toward relative density only because
  `rc_sg` held the standard in all 5 — a weight-flavored standard would be equally valid
  elsewhere.**

- 0|132| **[DONE 2026-07-21] `$ec_lang_intent` trimming — collapse duplicative definitions to
  `gloss:` pointers.** 12 entries trimmed, preserving all `layout`/`symbol`/`avoid` commentary;
  English-only. **The standing carve-out that authorized this is RETIRED (Tom, 2026-08-08)** — the
  left-of-pipe IS the payload, and trimming it deletes the synonyms a translator needs. See
  CLAUDE.md.

- 0|109| **[DONE 2026-07-20] Cross-language consistency audit (Opus, suite-wide), all 6 stages.**
  Motivated by a Burmese embedded-English defect that survived a full sprint's own QA. The lasting
  consequence is the mandatory glossary write-back rule in **CLAUDE.md § Post-sprint QA** — audit
  findings must land in `glossary.json` before a stage closes. Stage detail archived.

- 0|125| **[DONE 2026-07-17] Audit `$ec_lang_intent` keys.** Findings in
  `dev/ec-lang-intent-audit-2026-07.md`. Removed 110 lines of empty-placeholder leakage from all 26
  non-English files. The ratio was 129/507 = 25.4%, at Tom's one-fourth ceiling rather than under
  it; after per-bucket sign-off it is 95/507 = 18.7%.

- 0|124| **[DONE 2026-07-16] Shared upstream-HGL/EGL warning for `mphl_`, `dw_` and `hw_`.** One
  shared `.ec-help` tip on both result labels in all three calculators; `mphl_`'s bespoke keys
  retired in favour of the shared `hw_hgl_2`. `mphl_note_1` gained a leading pipe-elevation item,
  and DW and HW gained a Notes section they previously had none of.

- 0|123| **[DONE 2026-07-16] `mtc_`: add a solve-for-depth-given-Q mode.** **Scope grew beyond a
  plain inverse wrapper:** `mtc_` auto-iterates n and d50, both functions of depth, so a fixed-n
  solver would have returned a `y` inconsistent with a re-run — Tom's call was that an honest
  "didn't converge" beats a plausible wrong answer. The iteration became the shared `mtc_iterate()`.
  Narrative archived.

- 0|122| **[DONE 2026-07-16] Add Phillips & Ingersoll (1998) Manning's n option to `mtc_`.** `n =
  0.0926·R^(1/6) / (1.46 + 2.23·log10(R/d50))`, **R and d50 in FEET** (Maricopa County Drainage
  Design Manual §7.6.3), for channels with bed d50 of 0.28–0.36 ft — the manual itself calls it "a
  check or reference", not a sole design basis. A third standalone radio, plus an always-visible
  range check.

- 0|121| **[DONE 2026-07-16] Second-opinion (Opus) pass on the Task 120 math audit.** Requested
  because the first pass had already found one critical bug, so the base rate for a second was not
  zero, and self-derive-then-self-check has a shared-slip blind spot. Findings archived.

- 0|120| **[DONE 2026-07-16] Holistic calculator mathematical audit.** All 14 calculators reviewed
  against a 7-point checklist in 4 physics-grouped stages. Checklist, per-calculator risk notes and
  findings: `dev/calculator-math-audit-checklist.md`. Second opinion was Task 121. Narrative archived.

- 0|119| **[DONE 2026-07-16] Offline usage logging (queue-and-flush).** Beacons send via `fetch(...,
  {keepalive:true})` rather than bare `sendBeacon`, whose return value only means "browser accepted
  for delivery" and cannot drive retry. Failures queue in IndexedDB. **A queued retry carries the
  ORIGINAL client attempt time**, so a beacon landing hours later logs when the usage happened.

- 0|108| **[DONE 2026-07-14] `Install.php` localization.** Was 100% hardcoded English while being
  the only working PWA install path on iOS Safari and Firefox. **Post-close audit found one real
  defect: Burmese left "install", "browser", "menu", "icon" as raw English inside Burmese
  sentences** while its own `install_main_menu` already had the native word. Also fixed stale
  `sw.js` precache lists.

- 0|105| **[DONE 2026-07-14] Scoped and fixed the remaining `mpf_see_notes` stacking sites from Task
  101.** A new `mpf_flow_tip`; one shared `mtc_iteration_tip` for both radio fields; and on `mhp_`
  the `(See notes)` was pure redundancy beside a D5 verdict string, so it was deleted. **Mid-task
  correction: `$ec_lang_intent` entries were added without permission and reverted everywhere.**

- 0|103| **[DONE 2026-07-13] "Penstock" kept as the primary term across all `mhp_` fields, "(supply
  pipe)" disambiguated once rather than repeated.** Unlike "riprap", penstock is established
  international vocabulary with real translations. **The audit found am, bn, ru and ur had
  phonetically transliterated it**, the same defect class as riprap; each got a natural "pressure
  pipe" phrase.

- 0|101| **[DONE 2026-07-13] `k_m` label stacking fixed.** The rendered label concatenated a noun
  phrase, a bare `<a>` with no tooltip, and a trailing `(See notes)`. **bg's length was measured and
  was NOT the defect** — mid-pack against 12 languages. Fixed at all 5 sites; the tooltip needed
  zero new translation, assembled in PHP from two existing keys. Style guide:
  `label-normalization-decision.md` D8.

- 0|102| **[DONE 2026-07-13] Generalized `k_m` typical-values guidance for dw/hw/mphl/mhp.** One
  shared tip used verbatim at all four call sites. **Content changed, not just relocated** — exit
  loss was missing. **The default became one shared 2.0**, derived as the literal sum of the listed
  values, so a user can verify the default by adding the tooltip's own numbers.

- 0|104| **[DONE 2026-07-13] `e`/roughness field D8 content-and-stacking fix on dw/mhp/ip.**
  `dw_roughness_tip` became plain prose assembled at the call sites; `dw_roughness` shrank to a bare
  `'e'` (a Tom-approved exception to D8). **QA caught cs and he using `&ndash;`**, which
  `htmlspecialchars()` would have shown literally — the defect Rule A was later written to make
  impossible.

- 0|98|[CC] **[DONE 2026-07-13] English-improvement pass, 7 items.** The durable output is the
  Simple-English source-string policy, which lives in **CLAUDE.md § Write English source strings in
  Simple English**. Per-string rewordings archived.

- 0|96| **[DONE 2026-07-13] Bulgarian scope question resolved, all 3 sub-items.** Tom: *"I would put
  водно количество everywhere"* — all 35 `дебит` occurrences replaced **with gender agreement fixed
  on every one** (дебит is masculine, водно количество neuter). Menu titles were already sentence
  case; `index_title` was the one real miss. Same-day feedback on `LANGNAME` and two `mhp_` labels
  also fixed.

- 0|97| **[DONE 2026-07-13] tr riprap term unified on "taş dolgu".** Tom could not adjudicate a
  Turkish-native judgment, so it was resolved from suite convention: the English treats riprap as
  ONE concept in all 5 spots and every other language uses one bulk-material term throughout. Not a
  blind find-replace — Turkish genitive and attributive forms differ by construction.

- 0|99| **[DONE 2026-07-13] Removed the broken `mph` option from `Manning-Irregular.php`'s velocity
  unit select.** It had no backing `$ec_units['mph']` factor and no `$ec_lang['u_mph']` label, so
  the option rendered broken. Only one live occurrence (the note said two), now matching the
  `mps`/`ftps` pattern every other velocity selector uses.

- 0|95| **[DONE 2026-07-13] Localization-bypass audit — hardcoded strings that never route through
  `$ec_lang`.** **`Install.php` translated** (the in-app button only fires on Chrome/Edge, so this
  page is the only path on iOS Safari and Firefox); **`Orifice-Drain-Time-Ref.php` English-only
  permanently**, since equation-manipulation prose has a far higher mistranslation cost per word
  than UI labels.

- 0|94| **[DONE 2026-07-13] Orphan-key full-suite housekeeping.** 30 keys present in translated
  files and absent from English, deleted from all 26. **Each was verified with a word-boundary grep
  first, and two looked live**: `cs_wp` is a form-field `name` labelled by a shared key, and
  `mtc_vel_high` is a JS variable fed from `mhp_vel_high`. `--strict` now reports `extra: 0`.

- 0|93| **[DONE 2026-07-13] Cross-language glossary reconciliation pass.** 6 genuinely stale
  glossary entries updated to the incumbent file terms. hr rock chute left pending a decision about
  the *file*, not the glossary. **One case ran the other way — the glossary was right and tr's file
  had drifted** — logged as its own task rather than silently editing shipped sentences.

- 0|92| **[DONE 2026-07-13] Whole-label hover/tap target for tips.** Added `.ec-help { cursor: help
  }`, taught the tooltip init to match `.ec-help[title]`, and migrated all 956 `class="ec-tip"`
  occurrences across the 27 files to the wrapper pattern — the `title` moved outward, so a
  one-character tap target became the whole label. Fixed a raw `"` in sr's `rc_apron_length` title
  that broke the attribute.

- 0|91| **[DONE 2026-07-12] Complete re-translation of every calculator category into all 26
  languages.** Five categories by 3 waves plus a holistic Opus pass; **category 6 deliberately got
  the lightest rung that covered the risk**, because its content was already high quality. Rules in
  `dev/translation-process.md` Scenario C, dated history in `dev/translation-execution-log.md`.

- 0|90| **[DONE 2026-07-13] Native-review backlog resolved by best-effort verification instead of
  waiting for a native reviewer.** Tom: *"it's pie-in-the-sky to wait for human review that may
  never come."* Fixed the ps/ur scissors false cognate and sw's non-parallel head/tail pair,
  verified what only looked wrong, and **documented what genuinely needs a fluent reviewer rather
  than guessing.** Narrative archived.

- 0|89| **[DONE 2026-07-13] D50 "median" mistranslation resolved via a 12-language research vote,
  not native review.** 7 of 12 had a directly-cited real median term and were genuinely wrong; 4
  were already correct in-file and only the glossary was stale. **am had no distinct
  median-vs-average term in circulating usage at all and was left unchanged, because there was
  nothing more correct to fix it to.**

- 0|88| **[DONE 2026-07-12] Suite-wide baked-in verdict-glyph sweep.** Grepped all 26 non-English
  files for baked-in ✓/⚠ glyphs or translated "Warning:"/"OK:" prefixes across the 27 keys actually
  passed as `writeCheckHTML()`'s `shortText`. **Zero matches** — the already-fixed instances were
  the only real ones. Method and results: `dev/translation-execution-log.md`, 2026-07-12.

- 0|87| **[DONE 2026-07-07] Concept-level label normalization — one full-suite English-only pass.**
  The durable output is six rulings, which live in **CLAUDE.md § Concept-level label reuse** and
  `dev/label-normalization-decision.md`. **Ruling D6 was reversed:** consolidation is cross-cutting
  and can never be chunked per calculator category — a duplicate's two halves live in different
  ones.

- 0|86|[CC] **DONE 2026-07-07: Task 86.** Reversed the `dw_roughness` over-consolidation. `dw_roughness` restored to `'Roughness, e'` (dw_/mhp_ wide-form labels); new key `ip_roughness`='e' added for Irrigation-Pressure's narrow table column; both keep sharing `dw_roughness_tip`. English-only per Task 87 convention (`dev/label-normalization-decision.md`: non-English files aren't touched during consolidation work) — Tom confirmed deferring the 26-language propagation to Task 91, or leaving the key empty/English-fallback in the interim is fine. `ip_roughness` doesn't yet exist in the 26 non-English files, so it silently falls back to the English value there (same load order as any other missing key) until propagated.

- 0|85|TypeScript migration item closed as stale, 2026-07-05 (Human authorization): item was conditional on its own face ("only worthwhile if the project scope grows significantly") and no such growth has occurred — no bundler, no npm dependencies, no build step exist in this codebase today, and adding a `tsc` toolchain would cut against that simplicity for no observed type-safety pain. Closed with no code changes; revisit if the project scope grows enough to justify the tooling.

- 0|84|Renamed `irr_main_menu` from "Irrigation Flow Measurement" to plain "Irrigation" in all 27 `lib/lang.ec.??.php` files, 2026-07-05: the section now covers pressure/DU (Irrigation Pressure calculator) as well as flow measurement, so the old label undersold the menu's scope. User chose "Irrigation" over the alternative "Irrigation Calculators" when asked. For the 26 non-English files, reused each language's own existing irrigation-root vocabulary already present in the old (longer) translated string rather than running a translation sprint — e.g. Spanish "Medición de Caudal de Riego" → "Riego", Russian "Измерение расхода ирригации" → "Ирригация". No new terms introduced, so no glossary/sprint step needed. `php -l` clean on all 27 files.

- 0|83|npm/Composer dependency-management task closed as stale, 2026-07-05: investigated before starting (item was reassigned from `[CP]` to `[CC]` this session per Human direction) and found the premise no longer holds — `HeadersFooters.lib.php`/`sw.js` load Bootstrap straight from `cdn.jsdelivr.net`, not a locally vendored copy, and a repo-wide grep found no Composer usage (`vendor/`, PHP library requires) and no locally built/minified JS or CSS. There is currently nothing to manage a dependency manifest for. Closed with no code changes rather than manufacturing an empty `package.json`/`composer.json` — revisit if a real local dependency is introduced later.

- 0|82|Suite-wide symbol-convention question, resolved 2026-07-05 (split off 2026-07-04 from the Irrigation Pressure H-vs-P item): decision is **keep single-letter symbols on labels as-is** — they aren't decoration, they're the join key between a label and the formula shown right below it (e.g. `mhp_notes_1_def`: "Net head H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>"), and the pattern (H<sub>gross</sub>, Q, k<sub>m</sub>, h<sub>f</sub>, R<sub>h</sub>, P<sub>w</sub>, etc.) is already consistent across mi_/mpf_/mphl_/or_/mhp_/odt_ and more. No suite-wide edit made — status quo confirmed, not changed.

- 0|81|Fixed bg/es/pt/tr Manning Trapezoidal Channel (`mtc_`) symbol/translation gaps found 2026-07-05: added the missing `b`/`S`/`y`/`D50` symbol suffixes to `mtc_bottom_width`/`mtc_channel_slope`/`mtc_flow_depth`/`mtc_d50_in` in all 4 languages. For bg/tr, `mtc_bend_angle`/`mtc_sgrock` were left as flat untranslated English (bg additionally marked `//No need` in-file) — decided (no explicit `$ec_lang_intent` guidance existed for these, so treated as an ordinary translation gap) to translate both into bg and tr rather than leave them, matching the pattern already used by fr/de/ru for the same keys. `php -l` clean on all 4 files; `lang_parity_check.php --prefix=mtc` shows 0 missing/extra and 0 equal-to-English for bg/tr, and only pre-existing unrelated gaps (`mtc_blodgett_v_bathurst`, `mtc_vel_ok_short`) remain in es/pt.

- 0|80|Results sharing made opt-in, 2026-07-05: implemented the scope agreed 2026-07-04 (see prior framing above, now folded in here). `EngCalcs.calcAndSave()` (`js/Calculators.lib.js`) no longer calls `updateUrl()` on every form change; a new `EngCalcs.copyLink()` calls it on demand, writing `window.location.href` to the clipboard via `navigator.clipboard.writeText` and flashing the button text to a localized "Copied!" for 1.5s. New `#ec-copy-link-btn` button added next to the existing "Label:" field in `lib/Menus.lib.php` (shared scaffold, all calculator pages) — the `ec_name_hint`/`change` listener's explicit `updateUrl()` call (renaming the saved calc) was left alone since that's already an explicit user action, not automatic churn. New lang keys `calc_copy_link`/`calc_copy_link_done` added to all 27 `lib/lang.ec.??.php` files (English fallback in the 26 non-English files; no translation sprint run yet). Also fixes a real bug this design flaw was causing: `EngCalcs.readCookieAndCalc()` checked `loadFromUrl()` before `cookieToForm()`/`pageCalculatorInitialize()`, and since the URL almost always carried params (from the old automatic `updateUrl()`), it would skip row-table initialization entirely on reload — for calculators with dynamic reach/point tables (Irrigation Pressure, Weir Flow Irregular, Manning Irregular) this meant the table silently ended up with **zero** rows, since rows are only ever created inside those two functions and `CalcsBody` ships empty in the raw HTML. Fixed by always running cookie/default init first, then layering any URL params on top as overrides; `updateUrl()` also now excludes elements inside `#CalcsBody` from the query string, since per-row fields share duplicate `name`s and can't round-trip as flat key=value pairs anyway. Verified via a jsdom + real-cookie-jar harness against the live dev server: reproduced the exact zero-row failure pre-fix, confirmed 3 rows post-fix, and confirmed no regression in normal cookie round-trips (including the user's actual stale cookie value from testing). `php -l` clean on all 27 lang files plus `Menus.lib.php`/`Calculators.lib.js`.

- 0|79|"Default values" reset button, added 2026-07-04: placed on the same shared row as the unit-set buttons ("Set units:"), so one edit to `lib/Calculators.lib.php`'s `set_units_row` covers all 12 calculators — new `<button id="calc_defaults" onclick="EngCalcs.resetToDefaults()">` right after the four unit buttons. Reset mechanism deliberately simple per user direction: `EngCalcs.resetToDefaults()` (`js/Calculators.lib.js`) calls a new `EngCalcs.expireCookie()` (`js/Cookies.lib.js`, mirrors `createCookie()` with a past expiry) then does a plain `window.location.href = window.location.pathname` reload — no bespoke per-calculator JS needed, since the existing cookie-miss path already falls back to each page's own `pageCalculatorInitialize` (`js/Calculators.lib.js:107-113`), which naturally restores dynamic reach/points tables too. New lang key `calc_defaults` ("Default values") added to English, then translated into all 26 non-English `lib/lang.ec.??.php` files via 26 parallel haiku agents (per-language authorization given 2026-07-04). Verified: `php -l` clean on all 27 lang files plus `Calculators.lib.php`; `lang_parity_check.php` shows the `equal_to_english` count dropped by exactly 26 (one per language); rendered a live calculator page (Darcy-Weisbach) via CLI PHP and confirmed the button HTML (`<button id="calc_defaults" onclick="EngCalcs.resetToDefaults()">Default values</button>`) renders correctly and wires to the new JS function.

- 0|78|Irrigation Pressure H-vs-P decision, resolved 2026-07-04, corrected same day: initial pass kept H<sub>supply</sub>/H<sub>design</sub>/H<sub>last</sub> attached to the three pressure labels (`ip_h_supply`, `ip_h_design`, `ip_h_far`) reasoning that H is the suite-wide head symbol — user corrected this: pressure quantities should carry no symbol at all here, not H and not a new P. Removed the `, H<sub>...</sub>` suffix from all three English labels, now plain "Supply pressure" / "Emitter design pressure" / "Last emitter pressure". Scoped narrowly to the three quantities explicitly labeled "pressure" in words — left the reach-table loss quantities (`ip_hv`/`ip_hf`/`ip_hm`/`ip_hl`: velocity head, friction loss, minor loss, total reach loss) untouched, since those are head/loss terms, not pressure values. Internal JS variable names (`h_supply`, `h_design`, `h_far` in `js/irrigation-pressure.js`/`Irrigation-Pressure.php`) left as-is — internal plumbing, not user-facing, out of scope for a display-symbol correction. No non-English files affected (Irrigation Pressure translation sprint hasn't run yet). Verified: `php -l` clean, rendered page confirms all three labels show plain text with no symbol. The broader "are single-letter symbols worth it suite-wide" question was split off as a separate, still-open, non-urgent item.

- 0|77| **[DONE 2026-07-04] Irrigation Pressure calculator (`ip_`), English-only build.** A flat
  reach table of Main and Lateral reaches, solved by bisecting the last emitter's pressure against
  the supply and marching the EGL backward. **Uniformity was reworked, not just built:** real
  low-quarter DU divides by the sampled population's own mean, never an external rated value.
  Narrative archived.

- 0|76|Quality-score updater: Added `dev/scripts/update_quality_score.php` (usage: `php update_quality_score.php <lang> <quality>`). The roadmap item's original description was slightly off — the `QUALITY` constant actually lives in `lib/Language.Settings.php` (one `$all_language_settings[lang]` array per language), not in the per-language `lang.ec.??.php` files, which only hold display strings. Script validates the lang code (2-letter, must already exist in the settings file) and quality value (numeric, 0–1), then does a targeted regex replace of just that language's `QUALITY` value, leaving formatting/comments untouched. Verified: successful update on `es`, rejected an unknown lang code and an out-of-range quality value, `php -l` clean. Originally scoped to Copilot (`[CP]`); reassigned to Claude Code this session per Human economics call.

- 0|75|Deployment workflow script: Added `dev/scripts/deploy.sh` wrapping the full release sequence — `php -l` on every changed/new PHP file (diff-filter ACMR against HEAD plus untracked new files), aborts on any lint failure before touching git; then `git add -A`, an interactive commit-message prompt (skips commit if nothing staged, aborts on empty message), then an interactive push confirmation (`git push origin <branch>`, defaulting to the current branch) via the origin remote (at the time, Bitbucket over `altssh.bitbucket.org:443`; origin moved to GitHub 2026-08-09). Originally scoped to Copilot (`[CP]`); reassigned to Claude Code this session per Human economics call. Verified `bash -n` clean and a dry run (declining both prompts) correctly skipped commit/push with no changes to the tree.

- 0|74|Lang-file key-order normalizer: Added `dev/scripts/lang_key_order_normalizer.php`, which rewrites each non-English `lib/lang.ec.??.php` so its `$ec_lang[]` key order matches `lang.ec.en.php` exactly (values, quoting, and trailing same-line comments preserved byte-for-byte via PHP's own tokenizer; stale/duplicated section-header comments consolidated to English's structure). Originally scoped to Copilot (`[CP]`); reassigned to Claude Code and executed directly this session. Ran on all 26 non-English files: `lang_syntax_validate.php` clean, `lang_parity_check.php --strict` shows 0 missing/extra keys, and a separate token-level value-equality check (order-independent) confirmed 0 content diffs across every file. One real hazard surfaced and handled: `lang.ec.es.php` had two keys (`u_gradePercent`, `u_in2`) that reference an earlier key's own translation via PHP's unquoted string-interpolation syntax (e.g. `"$ec_lang[u_grade]"`) rather than retranslating it — naive English-order reordering would have flipped the assignment order and silently broken that reference at runtime (undefined-key warning, empty interpolation). The normalizer detects this pattern generically and topologically re-sorts just the affected pair, deferring to English order everywhere else — confirmed by re-rendering both interpolated strings through PHP post-reorder. The script's `--check` mode (exit 1 on any mismatch) serves as the "hook to enforce order on future edits" called for in the original spec, runnable in CI or pre-commit.

- 0|73|Translated the 3 keys newly surfaced by the entity-normalization fix (see next item): `cs_payback_years` in fr/it/km/my/ro/tr; `mhp_nu` in km/my/ro/tr; `mi_tau` in km — all were fully untranslated English, hidden from prior parity-check runs by HTML-entity vs. literal-character mismatches. Reused established per-language vocabulary already present in each file (e.g. `cs_lining_cost`/`cs_annual_value_recovered` terms for the payback tooltip, `dw_kinematic_viscosity` terms for the viscosity label, `mpf_shear_stress` term for the shear label) for consistency. `lang_parity_check.php` confirms 0 remaining `equal_to_english` hits for all 3 keys across all 27 files; `php -l` clean.

- 0|72|Fixed HTML-entity-vs-literal-character blind spot in `lang_parity_check.php` and `generate_translation_payloads.php`: both scripts' "equal to English" / delta detection compared raw strings, so an entity form (e.g. `&ndash;`, `&times;`, `&nu;`) in one file and its literal UTF-8 character in another (e.g. `–`, `×`, `ν`) were wrongly treated as different, hiding genuinely-untranslated keys from sprint payloads and parity reports. Added a shared `normalizeForCompare()` helper (`html_entity_decode(..., ENT_QUOTES | ENT_HTML5, 'UTF-8')`) applied to every equality comparison in both scripts (main english-equal check, plus `findNeighbor()`'s context-consistency check in the payload generator). Verified via before/after diff of full parity-check output: total `equal_to_english` count rose from 1214 to 1225, newly catching `cs_payback_years`, `mhp_nu`, and `mi_tau` as genuinely untranslated in several languages (previously masked by encoding mismatch) — confirmed each is a real defect, not a false positive. Follow-up translation of those 3 keys logged as a new small task above.

- 0|71|Removed orphaned `rrc_main_desc` and `rrc_main_menu` keys from all 26 non-English lang files: legacy of an earlier `rrc_` prefix before Rock Chute settled on `rc_` — keys existed in every non-English file but never in English. Confirmed via `grep -l` that exactly the 26 non-English files (and no others) had them before removal; `php -l` clean on all 27 files afterward.

- 0|70|Finish the tooltip-icon CSS standardization: the earlier "CSS standardization for validity/status checks" sprint added `.ec-tip` (currently just `cursor: help`) but only wired it into `EngCalcs.writeVelocityCheck()` in JS. The much larger set of hover-tip spans hardcoded directly into the lang files was never migrated — 318 occurrences of `style="cursor:help;color:steelblue;font-size:0.9em"` across all 27 `lib/lang.ec.??.php` files (English included). Plan: (1) add `color: steelblue; font-size: 0.9em` to `.ec-tip` in `css/engcalcs.css`, (2) mechanical find/replace `style="cursor:help;color:steelblue;font-size:0.9em"` → `class="ec-tip"` in all 27 lang files (no translation judgment needed, just markup — safe for a script or a single pass, not a per-language translation sprint).

  Note: a separate, unaddressed variant `style="cursor:help;color:#06c;font-size:0.9em"` (a different blue) also exists in several lang files for the same tooltip-icon purpose — out of scope for this item, candidate for a follow-up consolidation.

- 0|69|Expand and tighten glossary.json: Filled in all 5 empty languages (am, bn, km, my, ps) for all 27 terms using 5 parallel agents. Reviewed 6 nuanced terms across 21 existing languages. Corrections applied: fr conveyance efficiency → rendement de transport d'eau; cs/sr penstock → tlakovod/напорни цевовод; ar/uk emitter → قطارة/крапельниця; uk conveyance efficiency → added 'води'. Version bumped to 1.1.

- 0|68|Drip-Sprinkler.php simplified — removed Distribution Uniformity (DU): DU as implemented required both an average and a minimum emitter flow rate, but neither is knowable at design time without full lateral/main hydraulic modeling (a catalog emitter rating is really a best-case/near-inlet value, not avg or min — DU would report 100% for any un-modeled layout). Removed `q_min`, `du`, `du_check`, and the four `du_*` quality-tier keys; renamed `ds_q_avg` to plain "Emitter flow rate, q"; merged the DU notes entry out and renumbered the Runtime note. Calculator now honestly scopes to what's knowable pre-hydraulics: area per emitter, application rate, lateral/zone flow, and runtime for a target depth. Removed the same keys mechanically (deletion + notes renumbering) from all 26 non-English lang files, then hand-trimmed the "average"/"and uniformity" wording out of `ds_main_desc`/`ds_q_avg` in each (no new translation needed, just removing qualifiers that no longer apply). `lang_parity_check.php --prefix=ds` shows 0 missing/extra/equal-to-English across all 27 files; `php -l` clean. Follow-up (full lateral-hydraulics DU calculator) logged as a new, separate, low-priority roadmap item — scope is larger than first thought once arbitrary pipe-size steps are considered.

- 0|67|Removed `$ec_lang['ec_name_invalid']` (and its empty `$ec_lang_intent` entry, English-only, removed with explicit user permission this session) from all 27 `lib/lang.ec.??.php` files — confirmed unused outside the lang files via repo-wide grep before removal. `php -l` clean on all 27 files; `lang_parity_check.php` shows 0 missing keys post-removal.

- 0|66|Velocity-tip wording upgrade (open-channel + enclosed-pipe): Per user feedback, richer tooltip wording for both threshold groups. Open-channel (`mtc_vel_high`, shared by mtc+mi): "check available drop" → "check transition losses and available energy" (more translatable, more general hydraulic concept than "drop/fall"). Enclosed/pressure (`mhp_vel_high`/`mhp_vel_low`, shared by dw/hw/mpf/mphl/mhp): replaced the trivial "Velocity very high/low ⚠" with substantive tips — high: "risk of water hammer and high point (minor) losses"; low: "risk of sedimentation and air entrainment" (matches the specificity of the open-channel tips; dropped the redundant ⚠ since the icon itself already shows it). Launched 26 parallel haiku agents to reword all 3 keys across every non-English `lib/lang.ec.??.php` file (existing translations were stale — several still described old "diameter sizing" advice rather than the current tooltip content). 0 missing keys, all `php -l` clean.

- 0|65|Velocity checks added to Darcy-Weisbach, Hazen-Williams, Manning Pipe Flow, Manning Pipe Head Loss: All four pressurized/enclosed-pipe calculators now show an OK/High/Low `vel_check` row, reusing `EngCalcs.writeVelocityCheck()` and the existing `mhp_vel_*`/`mhp_vel_*_short` lang keys directly (no new keys, no new translation sprint needed — those keys already have 26-language coverage). Threshold matches Micro-Hydro Power: 1.0–3.0 m/s = OK, >3.0 = High, <1.0 = Low. Open-channel calculators (Manning Trapezoid, Manning Irregular) keep their separate `mtc_vel_*` keys/thresholds (0.6–3.0 m/s) per user direction — two threshold/wording groups by flow type (open-channel vs. enclosed/pressure), not one universal set. Manning Trapezoid Channel already had a velocity check from an earlier session; no changes made there this round.

- 0|64|Translation sprint — velocity-check short labels + orifice centroid reword: Launched 26 parallel haiku agents (one per language) to translate the 6 new short velocity-check keys (`mtc_vel_ok_short`/`high_short`/`low_short`, `mhp_vel_ok_short`/`high_short`/`low_short`) and reword `or_regime_submerged` from "invert" to "centroid" in all 26 non-English `lib/lang.ec.??.php` files, each referencing that file's existing `or_centroid_elev` translation for term consistency. Also picked up a few pre-existing untranslated keys (`mtc_blodgett_v_bathurst`, `or_shape_circular`/`rectangular`) surfaced in the same payload. Result: `lang_parity_check.php` shows 0 missing keys project-wide; `lang_syntax_validate.php` clean across all 27 files.

- 0|63|CSS standardization for validity/status checks: Added named classes to `engcalcs.css` (`.ec-status-ok/-info/-warn/-bad/-neutral`, `.ec-tip` for hover-help cursor) using the more accessible hex colors (`#267326`, `#c60`, `#c00`) that Rock Chute already used, instead of the plain CSS color keywords (`green`, `darkorange`, `red`) used ad hoc elsewhere. Replaced all `el.style.color = '...'` assignments with `el.classList.add(...)` across `js/orifice.js`, `js/rock-chute.js`, `js/drip-sprinkler.js`, `js/orifice-drain-time.js`, `js/micro-hydro-power.js`, `js/canal-seepage.js`, and the new `EngCalcs.writeVelocityCheck()` helper. Also fixed `engcalcs.css` being served with a hardcoded `?v=2` instead of `filemtime()` cache-busting (matches the existing per-project convention for JS includes) — now `?v=<?=filemtime(...)?>` in `lib/HeadersFooters.lib.php`. SVG-sketch geometry/line-thickness standardization is a larger follow-up not attempted here.

- 0|62|Velocity-check short labels use "High ⚠" / "Low ⚠" (icon carries the warning), not "High !" / "Low !" — dropped the exclamation mark per user feedback to avoid "hype" wording; the ⚠ hover-tip icon already communicates the warning.

- 0|61|Manning Pipe Head Loss HGL₂ NaN fix: `js/manning-pipe-head-loss.js` had `hgl2 = hgl2 - hv` (self-reference before assignment, always NaN). Fixed to `hgl2 = egl2 - hv`, matching Hazen-Williams and Darcy-Weisbach. Also added the missing `hgl1 = egl1 - hv` result (present in the other two calculators but absent here), reusing the shared `hw_hgl_1` label.

- 0|60|Orifice submergence criterion fixed to use centroid, not invert: `js/orifice.js` `submerged` flag compared TWE to `zinv` (pipe invert), which flagged submergence too early — before the downstream water surface had actually risen past the orifice center, understating the free-discharge head. Changed to compare TWE against `centroid`. Updated English `or_regime_submerged` message from "TWE above invert" to "TWE above centroid" to match; the 26 non-English translations of that string still need re-wording (tracked in active roadmap item).

- 0|59|Velocity check messages shortened to OK/High !/Low !: Added `EngCalcs.writeVelocityCheck()` shared helper in `js/Calculators.lib.js` — renders a short status plus a hover-tip warning icon (⚠, `title` attribute) carrying the full explanation, replacing long inline sentences in Manning Trapezoid, Manning Irregular, and Micro-Hydro Power velocity-check cells. Added 6 new short-form lang keys (`mtc_vel_ok_short`/`high_short`/`low_short`, `mhp_vel_ok_short`/`high_short`/`low_short`) to English; non-English translation still needed (tracked in active roadmap item).

- 0|58|Wire glossary into CLAUDE.md agent translation sprint: Translation Sprints section updated with pre-sprint step to verify glossary.json preferred-translation coverage for the calculator prefix's key terms, and launch instructions specifying that each agent receives embedded glossary terms, intent notes, and all translation rules. Glossary at v1.2 covers all 26 non-English languages across all calculator prefixes.

- 0|57|ec_lang_intent workflow audit and Spanish Robinson fix: Spanish Robinson translations verified correct — `bajante de rocado` / `escollera` / `pendiente pronunciada` properly convey the steep-channel context (not generic "canal"). Parallel-agent sprint workflow (one agent per language) established as the standard approach. Glossary injection + intent guard provide the quality layer for future sprints.

- 0|56|Audit remaining English strings in other languages: Parity checker run across all 26 non-English lang files confirms 0 missing keys in every language. English-equal strings (~23–55 per language) are overwhelmingly unit symbols (u_ft, u_m, u_kw, etc.) and technical abbreviations that correctly remain as international English. No untranslated calculator content found. Discovered two orphaned rrc_ keys present in all 26 non-English files — see active cleanup task.

- 0|55|HTML-entity audit script + bulk fix: `dev/scripts/html_entity_audit.php` scans all lang files for HTML entities (`&mdash;`, `&ge;`, `&amp;`, `&nu;`, etc.) that double-encode through `htmlspecialchars()` into JS `pageConfig`. Supports `--lang`, `--prefix`, `--fix` (replace in-place), and `--strict` (exit 1 for CI). On first run with `--fix`, replaced 2201 entity occurrences across all 26 non-English lang files with plain Unicode characters. English file was already clean; all non-English files now match that standard. Run without `--fix` to audit future regressions.

- 0|54|Hard-coded velocity units in Micro-Hydro messages/footnote: Updated velocity check output to unitless wording ("Velocity very low", "Velocity very high", "Velocity reasonable") and replaced the velocity note text with unitless guidance tied to available drop, losses, and water-hammer risk.

- 0|53|Propagate corrected `rc_notes_4_def` link to all translations: Replaced the old DOI URL with `https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf` in all 27 `lib/lang.ec.??.php` files.

- 0|52|Add velocity checks to Manning trapezoid and irregular calculators: Added `v_check` result to both calculators with warning messaging when velocity is high, and added the requested design note about high specific energy and potential expansion/obstruction losses.

- 0|51|ec_lang_intent guard: `$ec_lang_intent` is now explicitly off-limits to AI in both `CLAUDE.md` and `.github/copilot-instructions.md`. Both files state that AI must not add, change, or remove any `$ec_lang_intent` value without explicit written permission from the human in that conversation.

- 0|50|Math/logic review of all 14 calculators: Full review completed; findings written to `dev/ai-report.md`. One confirmed bug (Manning Pipe Head Loss HGL₂ always NaN — `hgl2` referenced before assignment), one medium logic concern (Orifice submergence criterion overestimates flow when TWE between invert and centroid), one design risk (Weir Flow Simple missing unit guidance for Cw), one cosmetic misspelling (Hagen-"Pouseuille" in DW). All core hydraulic formulas in the other 12 calculators verified correct.

- 0|49|"More" dropdown: About link moved under a "More ▾" dropdown (`menu_more` key, translated into all 27 languages). Follows web convention (Twitter, LinkedIn); "Help → About" is desktop-app convention. Dropdown uses `dropdown-menu-end` so it aligns to the right edge on small screens. Ready for Install/Subscribe/Contact items as those pages are built.

- 0|48|Encoding — kinematic viscosity tooltip raw codes: `&sup6;` is not a valid HTML5 named entity; it displayed literally in Bootstrap tooltips across all 27 lang files. Fixed `dw_kinematic_viscosity` and `ps_nu` title attributes to use UTF-8 characters (×, ⁻, ⁶, ², °) instead of HTML entities. Also corrected Ukrainian file which had `&#8308;` (superscript 4) instead of ⁶ and ². Prevention: use literal UTF-8 chars in all lang `title` attributes; the planned HTML-entity audit script (priority 25) will catch any recurrence.

- 0|47|Standalone engcalcs: Decoupled engcalcs from hawsedc.com via optional parent hooks. `hawsedc/engcalcs-parent-hooks.php` defines `engcalcsParentCSS()` and `engcalcsParentMenu()`; `engcalcs/lib/base.inc.php` loads this file if present; `HeadersFooters.lib.php` calls hooks conditionally. `hawsedc/index.php` now uses new standalone `hawsedc/hawsedc.lib.php` — no engcalcs bootstrap required. Fixed info-disclosure bug (BASE_DIRECTORY was echoed into public HTML).

- 0|46|New-calculator scaffold script: Added `scripts/new_calculator_scaffold.php`. Given `--prefix` and `--keys`, it appends missing stub entries across all 27 `lib/lang.ec.??.php` files and creates a calculator skeleton page + JS file using repo conventions (`echoHeader`/`echoCalculatorForm`/`echoFeedback`/`echoFooter`, JS include with `filemtime()`).

- 0|45|Translation completion matrix: Added `scripts/translation_completion_matrix.php` to report untranslated-key counts with languages as rows and key prefixes as columns. Supports `--lang`, `--prefix`, and `--format=table|csv` for sprint prioritization.

- 0|44|Zero-API translation runner (default): Added `scripts/translate_zero_api.php` to orchestrate default non-API translation workflow with deterministic phases (`scan` and `validate`) using payload generation, parity checks, syntax validation, and completion matrix reporting. `scripts/translate.php` remains optional paid path and now labels itself as non-default.

- 0|43|Engineering glossary integration: `scripts/glossary.json` is now wired into both `scripts/generate_translation_payloads.php` (prefix-scoped glossary context and preferred-term payload fields) and API prompt construction in `scripts/translate_prompt.php` (preferred term map, translation notes, and neighboring translated key context injection).

- 0|42|Translation payload generator (per-lang JSON): `scripts/generate_translation_payloads.php` now reads English plus each target lang file, emits only missing/untranslated keys, and includes neighboring translated context per key for register consistency (`key_context`). Supports `--prefix` and `--lang` filters and keeps backward compatibility with existing payload consumers via `keys` aliasing `keys_to_translate`.

- 0|41|Lang-key parity checker: Implemented `scripts/lang_parity_check.php`. Compares each `lib/lang.ec.??.php` against `lib/lang.ec.en.php`, reports missing keys, extra keys, and keys still equal to English. Supports `--lang`, `--prefix`, and `--strict` for sprint briefs and completion checks.

- 0|40|Lang-file syntax validator: Implemented `scripts/lang_syntax_validate.php`. Runs `php -l` per lang file and reports file:line findings for syntax errors, premature `?>`/out-of-scope declarations, and duplicate keys. Supports `--lang` scoping for surgical checks.

- 0|39|Save/share named calculations: URL-based Option B implemented. "Label:" field (50 chars, letters/digits/spaces/–_.) in h1 flex row on all calculator pages. On every calculation, history.replaceState encodes all form inputs + label as GET params. Loading a labelled URL pre-fills the form and restores the label. &lt;title&gt; reflects label. Client-side validation: hint text turns red on invalid chars, strips on blur. Label field suppressed on non-calculator pages. ec_name_* keys added to all 27 lang files.

- 0|38|Canal seepage expansion: Canal-Seepage.php expanded with lining payback outputs (annual value lost/recovered, total lining cost, simple payback period). Blank defaults for optional payback inputs. Separator "/" rendered between input element and unit selector via new 'separator' key in echoCalculatorForm. "per" replaced with "/" in all 27 lang files for "Value of water (currency / unit volume)" and "Lining cost (currency / unit area)".

- 0|37|Progressive Web App (PWA): Implemented. manifest.json, sw.js, and icons/icon.svg added. Service worker pre-caches all 16 calculator pages + all JS/CSS assets + Bootstrap CDN files on install. Strategy: cache-first for static assets, network-first (falling back to cache) for PHP pages. Language cookies work normally when online; offline serves the cached version in whatever language was current at install time. SW registration injected into echoHTMLHead() via HeadersFooters.lib.php. Theme color #1a6faf.

- 0|36|Text-only mode: Evaluated and closed. The PWA pre-caches all assets on install, making text-only redundant for returning visitors — the primary global south use case. A parallel rendering path would add significant maintenance burden for a narrow first-load benefit.

- 0|35|Redundant phrases: Evaluated and closed. The only truly identical long passage across all 27 lang files is the USBR/FAO citation in cs_notes_4_def — a proper-noun citation that doesn't translate. Adding a PHP shared-constant system for one string costs more than it saves.

- 0|34|Language button: replaced translated "Language" text with a globe emoji (🌐) — universally recognized, no translation needed, no flags (flags conflate language with country per W3C i18n). Screen-reader text "Language" retained via visually-hidden span.

- 0|33|Drip-Sprinkler: DU quality check renders as "Good &mdash; DU &ge; 80% ✓" — fixed. HTML entities in ds_du_* lang keys were double-encoded through htmlspecialchars() into JS. Replaced with Unicode (— ≥ <) in all 27 lang files.

- 0|32|Translation sprint — three pages: Drip-Sprinkler.php (ds_* keys), Irrigation.php (body prose and card descriptions), and About.php (body prose). Decision: keep all three pages; translate all 26 non-English lang files before next deployment.

- 0|31|Contextual hover tips: all javascript:alert help links replaced with span hover tooltips across all 27 language files. The only occurrences were the 3 mtc_d50_* Manning Trap Channel riprap sizing labels — all now use the Rock Chute pattern (cursor:help, steelblue ?, title attribute).

- 0|30|Robinson Rock Chute: Rock-Chute.php implemented — Robinson, Rice & Kadavy (1998) D50 sizing equations, slope-based equation selection, range checks, layer/crest/apron geometry, SVG sketch, translated into all 27 languages.

- 0|29|Irrigation: Canal-Seepage.php added (prefix cs_). Inflow-outflow method: Q_loss = Q_in − Q_out, conveyance efficiency Ec = Q_out/Q_in. Outputs: loss rate, loss fraction, Ec with Good/Fair/Poor rating (≥80%/60-80%/<60%), daily and annual volume lost. Unit-aware (m³/s, L/s, cfs for flow; m³/ft³/ac-ft for volume). Added card to Irrigation.php landing page and menu entry under Irrigation.

- 0|28|Drip/Sprinkler Application Rate calculator (Drip-Sprinkler.php): inputs are average and minimum emitter flow rate, emitter spacing Se, lateral spacing Sl, emitters per lateral, laterals per zone, and target application depth. Outputs are area per emitter, application (precipitation) rate PR = q/Ae, distribution uniformity DU = qmin/qavg (with color-coded quality check), flow per lateral, zone flow, and runtime for target depth. New units added: lph, gph (flow rates), mmph, inph (precipitation rate). ds_ keys added to all 27 lang files.

- 0|27|Audit existing translations for glossary compliance: built `dev/scripts/glossary_compliance_audit.php`, comparing lang-file strings for the four highest-drift terms (flow, head loss, weir, conveyance efficiency) against glossary.json preferred translations across all 26 non-English files. Most flagged mismatches were false positives from case/declension (e.g. Bulgarian "загуба"/"загуби") rather than real drift. Found and fixed one genuine defect: bg, tr, sr, km, and my each used a different word for "flow" across the mpf_/or_/mhp_ calculators within the same lang file — standardized all three to the glossary-preferred term per language. Also discovered (but did not yet fix — logged as a new task above) that `cs_Ec_target`'s tooltip text is untranslated English in 19 languages.

- 0|26|Translated `cs_Ec_target` (and the sibling `cs_lining_area`, same defect) into all 25 non-English languages: fr/it/km/my/ro/tr had the literal English "Lining target"/"Lining area" strings; 13 more languages (es, fa, he, hi, hr, id, pt, ps, ru, sr, sw, ur, zh) had a translated label but an untranslated English tooltip `title` attribute; bg/cs/bn/ar/am used a fuller inline sentence instead of the short-label-plus-tooltip pattern that the English source and most other languages use — all reworked to match. Existing per-language "conveyance efficiency" (`cs_Ec`) and "lining" (`cs_lining_cost`) vocabulary reused for consistency within each file. Root cause of why this slipped past `generate_translation_payloads.php`'s delta detection: the checker does exact-string equality against English, and these strings differed from English only by HTML entity vs. literal character (`&ndash;`/`–`, `&times;`/`×`) — a normalization gap in that script, logged separately below.

- 0|25|Language quality — structural fixes: he, pt, hr, sr, ro, zh all raised to 0.85–0.9. he: fixed 6 English strings in mtc_ section and mixed-language mphl_hgl_2. sr: fixed 4 Croatian-script strings in irr_/mhp_ sections. All 26 non-English lang files gained about_ keys.

- 0|24|About page (About.php): added to nav menu. Covers global humanitarian open source mission, GNU GPL v3 license, GitHub repository link (github.com/hawstom/engcalcs), contributing (translations, bugs, new calculators, hosting), offline ZIP download (planned/roadmap), and PWA status.

- 0|23|Irrigation landing page (Irrigation.php): added to menu with divider. Links to Weir Flow Simple, Weir Flow Irregular, Orifice Flow, Orifice Drain Time, and Manning channel calculators. Quick-reference section for diversion dams, headgates, pipe turnouts, and USBR Water Measurement Manual alignment. irr_ keys added to all 27 lang files.

- 0|22|Add km (Khmer), my (Burmese/Myanmar), ps (Pashto), fa (Farsi/Persian), uk (Ukrainian) as new languages — complete translation of all calculators. Khmer, Burmese, Ukrainian are LTR; Farsi and Pashto are RTL. Now 27 languages total.

- 0|21|Rework message of love: added "You are not ruining everything" as the third clause in all 22 languages. Naming the shame-fear that blocks people from receiving the other two.

- 0|20|Love is spoken — corrected 8 translations: it, sr, bg, cs, bn, hi, id, ur were saying "we speak about love" or "we speak lovingly." All now say "love is our language here."

- 0|19|Language menu order: Corrected Language.Settings.php order to alphabetical by English name (EU/UN convention). Arabic, Bengali, Bulgarian were out of order.

- 0|18|Language system audit: Fixed all lang file issues. Removed ~30 orphaned legacy keys. Added missing or_velocity to ro and sr. Fixed es.php forward-reference bug. Fixed tr.php premature ?> close tag that dropped 55 mhp_/ps_ keys outside PHP scope; fixed 3 unescaped apostrophes in Turkish Penstock strings. Fixed bg/he mphl_hgl_2 forward reference.

- 0|17|Chinese language code: Renamed internal code cn→zh (ISO 639-1 standard). Added normalizeLang() to Language.lib.php to silently correct legacy ?lang=cn GET params and ec_language=cn cookies to zh.

- 0|16|Micro-Hydro Power calculator: Retitled from Penstock-Design.php to Micro-Hydro-Power.php and migrated fully to mhp_ language keys (old ps_ keys renamed, duplicate old mhp_ block removed). Calculator wraps Darcy-Weisbach friction factor logic with gross head, plant efficiency, and power output. Inputs: Q, H_gross, D, L, roughness e, minor loss km, kinematic viscosity, η. Results: velocity + color-coded velocity check, f, h_f, h_m, h_L, color-coded head loss % check, H_net, power (kW/MW/hp), annual kWh/yr. Dynamic SVG bar sketch.

- 0|15|Add Amharic, Urdu, Swahili, Hindi, Arabic translations — complete translation of all calculators in each language. All registered in Language.Settings.php (QUALITY 0.9). Urdu/Arabic are RTL.

- 0|14|Language-demand logging: logLanguageSelection() added to Language.lib.php; called when a valid ?lang=XX GET parameter is used. Log path: /var/www/cnm/logs/engcalcs-lang.log. Format: tab-separated UTC-timestamp, lang-code, page-basename.

- 0|13|Solver (y/d₀ given Q) for Manning Pipe Flow: bisection solver added to js/manning-pipe-flow.js. Bisects y/d₀ on [0.0001, 0.9376] (Manning Q peaks at 93.8% full for circular pipes), sets the y/d₀ input and reruns the calculator.

- 0|12|Orifice Drain Time calculator: Orifice-Drain-Time.php with conic volume method. Inputs: starting/ending/orifice elevations, starting-pond area A1, orifice-level area A0, orifice shape/size, Cd. Outputs: interpolated ending area A2, drain time. Equation derivation reference page (MathML) at Orifice-Drain-Time-Ref.php. SVG sketch. Polished: H1, Qmax, Drained Volume outputs added; h2 ≥ D/2 validation.

- 0|11|SVG sketches: Added to Orifice Drain Time (WSE, wall, H₁, D annotations), Weir-Irregular (crest profile as gray filled polygon with HWE line). Manning.lib.js extracted for shared sketch reuse.

- 0|10|Bootstrap 5.3.2 migration and jQuery removal. All pages converted to Bootstrap 5 utility classes; $() calls eliminated. (commit 92f38da)

- 0|9|Extracted per-calculator JavaScript into separate files under js/calculators/. (commit 76d6255)

- 0|8|Added CLAUDE.md architecture and developer guide. Added php -l pre-commit hook. Priority 1 security fixes: XSS output escaping, language parameter validation, cookie Secure/HttpOnly flags, ENV-based DEBUG_MODE, removed test/debug files.

- 0|7|Translations (multi-lingual): Evaluated cost/value of having a languages system in the post-2025 (AI) age. Decision: keep the system — engineering terminology mistranslates poorly in browser auto-translation. Improved fr (complete rewrite), bg (dw/hw/mi/wi sections added), tr (dw/hw/mi added).

- 0|6|Orifice calculator phase 1: Orifice.php created with circular/rectangular shape selector, unit-aware inputs (D, W, invert elevation, HWE, Cd), results (centroid, h, area, Q, v, regime check), SVG profile sketch, and notes.

- 0|5|Touch tooltips: Bootstrap Tooltip initialized on all `[title][style*="cursor:help"]` spans via DOMContentLoaded in Calculators.lib.js (`trigger: 'hover focus click'`). Tappable on mobile. `?` span added after Save label in navbar for the `ec_name_hint` text.

- 0|4|PWA on mobile: PNG icons (192×192, 512×512) generated and added to manifest.json. Apple meta tags (`apple-mobile-web-app-capable`, `apple-touch-icon`, etc.) added to `<head>` via HeadersFooters.lib.php. SW cache bumped to v2. iOS requires manual "Add to Home Screen" from Safari share menu — `beforeinstallprompt` does not fire on iOS by design.

- 0|3|Layout overflow: Wrapped `<table class="bare">` in `<div style="overflow-x:auto">` in `echoCalculatorForm()`. On narrow screens the table scrolls horizontally within the page rather than overflowing past the edge.

- 0|2|PWA evangelism: "⬇ Install" button added to navbar (before Save field), hidden by default. Shown only when `beforeinstallprompt` fires (Android Chrome); hidden again on `appinstalled`. `EngCalcs.installPWA()` triggers the native install prompt. iOS users see no button (iOS does not fire `beforeinstallprompt`).

- 0|1|Roadmap reorganized: grouped by theme, priorities differentiated so ties are intentional, descriptions tightened. Completed items moved to ## Completed section per instructions.
