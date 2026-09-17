# Interface designer — wish list

What this seat would build next, in its own order. **Expected to disagree with `dev/ROADMAP.md`**;
that disagreement is most of what a seat is for. No agent edits the roadmap.

1. **A hover colour/weight highlight on the currently-hit `lpn_` object in Select mode, additive to
   the existing cursor.** Small build (one `pointermove`-driven class on the existing hit-test, or
   a `:hover` rule if `:has()` support clears this suite's floor). Buys feedback the cursor
   deliberately cannot give here — `default` is identical over an object and over nothing by
   design (Task 618) — and is a real, named convention in AutoCAD (`SELECTIONPREVIEW`) and Figma
   ("Highlight layers on hover"), not a novelty. See journal, 2026-09-10.

2. **DONE 2026-09-10 -- Tom reversed his first answer once he saw what Ida had actually found.**
   *"Nice catch, Ida. Nice fit and finish."* The three marks are crosshairs now
   (`lib/Icons.lib.php`). His NO was to the general principle, not to this instance:
   *"vertex and everything else is not a place for depicting a cursor"* -- and these three are
   select-family, the one family whose subject IS a cursor. **The framing correction is his and it
   is the reusable part:** *"it's not the corners Ida noticed. It's a tiny cursor depiction."* What
   made it wrong was never where the mark sat; it was that a drawing of a cursor is a PROMISE about
   what the pointer will look like. Superseded text follows for the record.

   ~~CLOSED 2026-09-10 by Tom, answered NO.~~ **Ask Tom, not build: does the small corner arrow on `select-window`/`select-lasso`/
   `select-polygon` (`lib/Icons.lib.php:283,292-294`) promise `default`, or is it a generic
   "this is a mouse action" badge?** Their actual mode cursor is `crosshair`
   (`js/looped-network.js:16157-16159`; `css/engcalcs.css:1321`), which either needs the corner
   glyph repainted to a crosshair (cheap, a path edit, no translation cost — icons carry no
   language string) or needs nothing at all if the glyph was never meant to be read as a cursor
   preview. I could not settle which on my own; below the hover-highlight because it is
   cosmetic-precision, not a reported confusion. See journal, 2026-09-10.

3. **REJECTED 2026-09-10 BY TOM, and it is not to be re-proposed.** *"Pan tool: Strongly opposed.
   Simply unnecessary and wasted prime real estate. And not 2026-like."* Three separate objections
   and each one stands on its own: it is not NEEDED (dragging the empty map already pans, and that
   is the convention every web map ships with), it COSTS the scarcest thing the page has (a toolbar
   slot on a strip whose wrapping is already the reason it hides on a phone), and it is DATED --
   a modal Pan tool is a 1990s desktop idiom that direct manipulation replaced.
   - **Kept here rather than deleted, because it was reasoned to twice and would be reached again.**
     It arrived as the clean resolution of an icon-literalism tension: `select`'s icon depicts an
     arrow while Select mode also owns the pan gesture, so splitting the gesture onto its own tool
     would make the icon literally true. Photoshop's own Move/Hand separation is the precedent.
     **That reasoning is sound and the conclusion is still wrong**, because the tension it resolves
     is one nobody has reported as confusing and the cure costs more than the disease.
   - What Tom settled instead: the Select icon is a LABEL for the tool, not a pixel-exact promise
     about every cursor state, and `grab` on the bare map is correct because that is where nothing
     is being aimed at. See journal, 2026-09-10.

4. **Task 617 -- a basemap-style `<select>` in Settings > Map appearance, not a new on-canvas
   control.** Two options to start (`Full color` / `Muted`), same widget family as the legend-
   position rows already there, wired to a `filter:` on `.lpn-basemap`
   (`dev/basemap-styling-options.md`'s own free recipe). Zero canvas cost, zero risk to the
   non-dismissible OSM/Mapbox credit (separate DOM, checked directly). **Costed against Tom's own
   sketch of a lower-left expando, which I do not recommend as a first move**: `#lpn_map_footer`
   is already the busiest overlay on the page -- five widgets, already wraps on a narrow window,
   and the one strip `zoomExtent()` reserves canvas against -- so a sixth item there is a real tax
   on the drawing surface for a decision that is closer in kind to "where the legend sits" than to
   "click to pan." If a corner affordance is wanted later, extend the EXISTING satellite-teaser
   tile with a caret rather than adding a new independent widget next to it. See journal,
   2026-09-10.

5. **SUPERSEDED 2026-09-10 -- Tom caught this one and the CSS backs him.** Original entry read
   "unify menu-bar/toolbar paint before anything else, same background, hairline divider." Tom:
   *"Do you mean just pushing them closer together? There is no line. They already look like a
   set."* He was right: `css/engcalcs.css:1337-1338` and `:1218-1225` already share one hover
   treatment by explicit design comment ("a menu bar that looks like a row of push-buttons reads
   as a second toolbar," `css/engcalcs.css:1260`) -- there was no seam to close and a hairline
   would have manufactured the exact "two rows" read the design already avoids. Re-diagnosed in
   §F of `dev/app-chrome-postdivorce-recommendations.md`: the real gap is visual salience WITHIN
   an already-unified strip -- toolbar icons at 1.35em vs menu-bar icons at 1.05em, 22 toolbar
   glyphs vs 5, 1,260px of toolbar ink vs 401px of menu-bar ink (measured, same render pass), and
   a genre mismatch (icon-only grid reads as a tool palette; icon+word reads as a nav list, which
   is literally what one tester, MAH, said the menu bar looked like it belonged to -- "the site,"
   not the app). **Revised "if only one": a first-visit cue anchored AT the toolbar, where the
   eye already lands, pointing up to the menu bar** -- not a menu-bar paint or size change, which
   would either be decorative (chasing parity with a 22-tool row) or force a words-vs-icons
   genre call that's Tom's to make, not mine to default. MEASURED (real Chromium render, not
   estimate): menu-bar ink 401px, toolbar ink 1,260px, combined 1,660px against 1,364-1,918px of
   available row at the three viewports this project already treats as reference points -- a
   literal one-row merge is still provably unsafe below roughly 1,750px, so that half of the
   original entry stands. Full ranking and the width numbers:
   `dev/app-chrome-postdivorce-recommendations.md`.
6. **Same task -- Language menu, last position, right of Help, same 27-row widget the suite navbar
   already has.** Reuses `all_language_settings` and the globe icon; no new component. Secondary
   win, not a discoverability fix on its own -- it forces the traffic that WANTS language switching
   through the one row that most needs it, but does not by itself put new eyes on that row.
7. **Same task -- do NOT relocate transport to the menu bar.** Corrected a premise in my own brief
   first: transport is already on the TOOLBAR (`js/looped-network.js:23270+`), not the bottom pane.
   It is a persistent, stateful control and belongs with the toolbar's other mode-like instruments;
   a menu row cannot host Play/Pause without inventing a new interaction pattern nothing else on
   the page uses. The unify-paint fix above already carries the "drive people to the menu bar"
   intent without this cost.
8. **Same task -- Help menu gains one row, Install app, and keeps the label "Help" exactly** (the
   standing ruling that visitor copy says "use Help" only holds if one menu owns that name). About
   and Contact are already covered; About's CONTENT (not its chrome) needs to stop describing
   EngCalcs once the suite navbar is gone, which is Tom's call, not mine.

*(The four-bar chrome diagnosis Tom's brief opens with — suite chrome, menus, toolbar, tab strip —
is answered for the three that remain after the divorce; see item 5 series above and
`dev/app-chrome-postdivorce-recommendations.md`.)*

9. **Menu-icon clouds: remove them (Proposal 1), keep the favicon's.** Not a build item so much as
   a one-line edit ready when Tom confirms: delete the two trailing `<path>` cloud strokes from the
   `water` entry in `lib/Icons.lib.php`, restoring `dev/icon-preview/ship-water-menu.svg`'s
   geometry. Diagnosed 2026-09-10: the "arms" read is a shoulder-height mirrored-flank placement
   problem, not fixed by switching line to area (tested, still reads as stubs). See journal,
   2026-09-10.

10. **Rename `lpn_help_icons` from "Toolbar" to "Toolbar key."** One string
    (`lib/lang.ec.en.php:1157`). Fixes a real mislabeling — the row is a legend for the icon-only
    toolbar, not a control over it — without touching its mechanism (`iconGuideRows()`, already
    derived from `toolbarIconIndex`). Tom's own proposed name; I agree with it. See
    `dev/help-menu-mastermind.md` §3.

11. **Retire `lpn_notes_1_term`/`_def` and `lpn_notes_2_term`/`_def` from the `lpn_` Notes popup;
    fold their substance ("how it is solved," "what is not modeled") into the About rewrite Task
    625 already owes.** They are correct facts in the wrong genre of popup — product-scope
    statements sitting among task-context notes. About's body is still entirely suite-wide
    (`lib/lang.ec.en.php:543`) and needs exactly this kind of sentence once it describes the app
    rather than the suite. See `dev/help-menu-mastermind.md` §1.

12. **Add one outbound sentence from a rewritten `About.php` to LibreWaterNet.org — do not repoint
    Help > About there, and do not rework LibreWaterNet.org into an About page.** Read the actual
    site: it's a mission/recruiting page, tuned by its own CLAUDE.md to invite strangers over
    several screens, not to answer "what is this" to someone already mid-task. Register mismatch
    in both directions; the one-sentence bridge gets the benefit at near-zero cost. See
    `dev/help-menu-mastermind.md` §2.

13. **SUPERSEDED 2026-09-11 — the LINK affordance was wrong; see item 16.** Position (far left,
    before File, mono) still stands. Original text kept for the record: a way back to
    LibreWaterNet.org: a mono icon-only link at the FAR LEFT of the menu bar, before File, not at
    upper right as Tom first proposed. Convention (VS Code,
    Figma, Docs) puts a product's own mark at far left, where the read starts; upper right on
    this page is already the utility zone (Help, Language) — the wrong neighborhood for "leave
    the document." Mono, not the colored favicon: color is for contexts where standing out is the
    job (a tab, a share card); here it would recreate the menu-bar/toolbar salience imbalance
    already diagnosed, a second time, against its own neighbors. ~40-50px against a measured
    401px/1,364-1,918px menu-bar budget. Ranked above a Help-menu row for the same row, because a
    Help row inherits Help's own proven discoverability ceiling and a "way back" cannot afford
    that. If only one Help/way-back item ships before the demo, this is it. See
    `dev/help-menu-mastermind.md` §5.

14. **Merge the Help menu's legal band into the About band, now that About is becoming an
    in-page box.** Pure reorder — no new string, one fewer separator. Privacy notice/Terms of
    use/Cookie settings move down to join About as one final band; nothing about Task 286's
    findability requirement is weakened by the move. See `dev/help-menu-mastermind.md` §6.

15. **Add one Help row, `LibreWaterNet.org`, in the Install/Screenshot gallery/Not EPANET band —
    not named "Front page."** Not a discoverability fix (the far-left mark still wins that
    argument); it exists because the mark is same-tab and every other outbound Help row is
    `ext()` — this is the only route that lets a reader with an unsaved project look at the
    mission page without risking it. One string, reuse the `water` icon to tie it visually to the
    mark. See `dev/help-menu-mastermind.md` §6.

16. **Convert the way-back mark from a link to a menu button, ranked above 14/15 — those two are
    now superseded by this.** Tom named the mismatch: far left, inside the command row, is the
    Apple-menu position, and two of my own three cited precedents (Figma, VS Code) open a menu
    there, not a link — I shipped the third's (Docs') affordance at the first two's position.
    Zero new strings: `<button>` + `openMenu()`, the same mechanism as its five siblings. Contents,
    Apple-menu shape — About, Learn more at LibreWaterNet.org (ext) // Install, Privacy notice,
    Terms of use, Cookie settings // Leave for LibreWaterNet.org (same-tab, the mark's old
    behavior, now one row instead of the whole click). All four of §6's Help additions (Install,
    the merged legal/About band, the ext LibreWaterNet.org row) move OUT of Help into this menu —
    Help returns to seven rows of task-learning content only, which is the actual fix to the
    scope-creep complaint, not a row-count trim. Cost worth naming: the way back goes from one
    click to two. See `dev/help-menu-mastermind.md` §8.

17. **SUPERSEDES 16 — the Mac-paradigm mark-as-menu is scrapped, not patched.** Tom called the
    whole sequence circular and was right; step 2 (this list's own #13) was where it started.
    Revert `lpn_menu_home` to a plain same-tab link (icon and far-left position unchanged, both
    correct from the start); delete `openMarkMenu()` and its five rows rather than leave them
    unused. Help gets back everything item 16 pulled out of it: About, Install, Privacy notice,
    Terms of use, Cookie settings — twelve rows, three separators, the shape item 14/§6 already
    measured against Word/Figma/VS Code as normal for the genre. Reword the mark's tip from the
    bare domain to something naming the destination ("Welcome page — LibreWaterNet.org"), per
    NN/g's own recommendation that a logo-link carry words as well as an icon. See
    `dev/help-menu-mastermind.md` §9 for the full CITED reasoning (Apple HIG, VS Code's own
    Windows/Linux-vs-Mac About placement, NN/g on homepage links).

18. **Independent of item 17 — the Water menu's icon (`plan`, replacing `water`) stands on its
    own and is not reverted.** It solves a different problem (two identical tower glyphs on one
    bar, not the mark's menu-vs-link affordance) and stays even though the mark reverts to a
    link. Post-demo, low priority: consider a water-network-specific glyph (pipe-and-junction,
    distinct from the `pipe` asset icon two levels down) if the "plan reads as generic project,
    not water" mismatch still nags after 16 September — not urgent, and not worth a fourth icon
    change before the demo.

19. **Task 616 — reclassify DEM/engine/locking disconnect notices from `setNotice()` (expiring)
    to the existing persist-until-cleared pattern** (`noteMapUnmeasurable()`,
    `js/looped-network.js:34869`; `#lpn_lock_banner`, `Looped-Network.php:170`). No new UI, no new
    strings — reuses a pattern this page already ships and has already been read by a live tester
    (Tom saw it, KDH did not, because it was on a countdown a standing fact should never have
    been on). This is the one real fix inside Task 616's evidence; rank it above the history idea
    entirely. See journal, 2026-09-13.

20. **Task 616 — a small closed notification log (bell/count, opens a short static list), NOT a
    banner-area band.** Answers the recoverability half of MJH's suggestion without adding a
    fifth permanent attention-competitor to a page whose diagnosed defect is that readers do not
    see the four it already has. A real build — its own branch, not folded into demo prep. Ranked
    below item 19 and below the standing chrome-diagnosis work (items 5-8, 13-18), which is the
    same cognitive failure (inattentional blindness) applied to permanent chrome and is nearer
    done. See journal, 2026-09-13.

21. **Task 616 — do NOT build the banner-area prompt history as proposed.** New permanent chrome
    is the wrong instrument for a sampling problem (inattentional blindness, not legibility) that
    a longer timer already failed to fix once (120 s, still missed). If asked again, redirect to
    items 19-20. See journal, 2026-09-13.

22. **Task 636 — replace the custom-property design popup with an inline expander (key on line 1,
    each other field on its own stacked line below), not the shipped `openDialog()` modal.**
    Measured at 375px: the shipped `.lpn-cp-table` needs ≈551px for its nine truncated columns
    against ≈254px of available content-pane width, so a phone reader sees roughly four of eleven
    columns at a time and loses the key — the one column meant to stay legible — off screen while
    scrolling to read Low/High limit. The popup already renders its ten fields through
    `.lpn-set-row` internally, which is the SAME primitive the box's other multi-field rows
    collapse through on a phone (`css/engcalcs.css:2620-2625`), so an inline expander costs no new
    responsive layout work and removes a third overlay layer (map → Settings box → modal) that
    exists only because the table it replaces cannot be read at that width. Also the one control
    in the whole Settings box that leaves the box to be edited — every other section commits
    in-place. A real, if modest, rebuild; its own branch, not demo prep. See journal, 2026-09-13.

23. **A house rule for future standing boxes: draggable + resizable together, by default, using
    the existing `makePanelDraggable()`/`addPanelResizeGrip()`/furniture-key template** — but
    ONLY for a STANDING panel (one left open beside the map for more than a few seconds), never
    for a `openDialog()` MODAL DECISION (Save/Discard/Cancel, alerts, single-purpose reports),
    whose whole job is to be answered and dismissed and whose long content already scrolls inside
    a fixed frame. Decide drag and resize together, off that one classification, not separately.
    Not a new mechanism — the infrastructure already exists and is already shared by Settings,
    Libraries and the four report boxes; a new standing box is a ~4-line addition, not a build.
    See journal, 2026-09-13.

24. **One classification Tom should make, not me: is the custom-property design surface a modal
    decision or a standing mini-editor?** It is ten fields, each committing individually with no
    OK/Cancel — editor-shaped, not decision-shaped — but it currently sits inside `openDialog()`.
    If item 22 is built, this question disappears (there is no longer a separate box). If the
    popup is kept, decide whether it belongs in the modal family as-is or should be pulled into
    the standing-panel family per item 23's rule. See journal, 2026-09-13.

25. **If the five-group popup collapse is built: split "Flow and pressure" at the input/result
    seam the code already draws.** `BAND_NODE`/`RESULT_NODE` (`js/looped-network.js:11898-11929`)
    and the `if (lastSolveResult...)` guard around Head/Pressure (`:35232-35236`) already separate
    typed inputs from solved results; a merged group would be the popup's first case of a typed and
    a computed number sharing one visual container, against the suite's own stated rule that the
    two are different kinds of thing. Costs nothing — the split is already coded, only unread by
    the grouping brainstorm. See journal, 2026-09-15.

26. **If built: no group ever starts collapsed, matching `multiSection()`'s own ruling one function
    away** (`js/looped-network.js:36248`, Tom: *"OPEN, ALL OF THEM ... collapsing is something the
    reader does, never the default"*). A default-closed heading on a 16-20 row popup is a second
    instance of the exact failure this seat was hired over — a bold word with a caret is easy to
    mistake for a static label the first time a reader meets it. A remembered-per-group collapse
    (matching `customPropBox()`'s per-key `cpOpenKeys`) is a legitimate LATER phase once real
    dwell/scroll evidence names a specific group nobody opens — never a shipped default. See
    journal, 2026-09-15.

27. **If built: coordinates (X/Y) must stay visually first inside "Dimensions" and must be
    EXEMPT from any future remembered-collapse preference, the way Credits is exempted from the
    Settings-box filter (`data-set-nofilter`, `js/looped-network.js:30284`).** Sue's argument for
    X/Y at popup slots 2-3 — a transposed coordinate balances hydraulically and is invisible to the
    solver until a GIS overlay or as-built check — is defeated by a collapsed or buried Dimensions
    group exactly as it would have been defeated by the old scattered layout. Today `coordFields()`
    is called LAST in both render functions (`:35264`, `:36117`), not grouped with Elevation/
    Length/Diameter at all, so folding it into Dimensions is a real, overdue tidy — but only if the
    group can never start closed and coordinates lead it. See journal, 2026-09-15, §5.

28. **Ask Declan before shipping any collapsible group: a `<details>` element is itself a keyboard
    tab stop, so five sections is five NEW stops per popup visit regardless of open/closed state** —
    the same shape of cost he measured against coordinate slots 2-3 (800 stray keystrokes over 400
    junctions). This seat cannot weigh entry-volume cost and should not guess at it. See journal,
    2026-09-15.

29. **Build all five Properties-popup groups as plain headings, never `<details>`/`<summary>`.**
    Nothing in this popup collapses by default (Tom's ruling, narrowed to Settings but the reasoning
    — a box this short does not need a navigation aid — applies at least as strongly to Properties);
    a `<details>` that never closes buys a caret and a keyboard tab stop for zero realized benefit.
    This is also what dissolves the "Results and quick graph falls to 2 rows" problem: the cost his
    three-row rule is pricing is a disclosure widget's, and a plain heading over 2 rows costs nothing
    a plain heading over 20 rows doesn't. Self-resolving further once Task 637 (Graph button) ships
    and Results reaches 3. See journal, 2026-09-16.

30. **Two small, named, zero-string-cost order fixes inside the new grouping, if he wants the "no
    reorder" claim to hold row-for-row and not just block-for-block:** swap `tagField()` before
    `closedField()` in `renderLinkFields()` (`js/looped-network.js:36550/35752`) so Tag precedes
    Shut, matching his own written list; and do NOT move Length ahead of Diameter to match the same
    list's "Length, Diameter, Roughness, K" — Diameter's position is anchored to the pipe-type
    chooser by Task 465's own settled ruling and should not be overturned by an illustrative bullet
    order. See journal, 2026-09-16.

31. **Open question for Tom, not decided here: does "Description" in "Description and state" name a
    row that exists?** `idField()` renders in the popup title, outside the field list; the only
    free-text identity field the code builds is Tag. His own count table gives this group 5 rows on
    every element type, which needs a Description row nothing currently builds. See journal,
    2026-09-16.

32. **Rank 1st of the zoom question — add a keyboard/no-gesture zoom in and zoom out, beside the
    existing "Zoom to fit."** Two rows in the Map menu (and, if toolbar room allows, two buttons)
    calling the existing `zoomAbout()` at a fixed screen-centre point with the wheel's own factor.
    This is the same class of defect as Task 674 (a value reachable only by dragging): today
    "Zoom to fit" is the ONE zoom control that needs no wheel and no pinch, and it is a reset, not
    an increment — a keyboard-only or wheel-less desktop visitor can reach "fit" and nothing else,
    ever. EPANET itself, our own named reference vocabulary, ships exactly this pair of buttons
    (Zoom In / Zoom Out) with no wheel and no keyboard shortcut of its own — the fix is not a new
    idiom, it is the one EPANET already uses. Cheap: no new interaction pattern, reuses the one
    function every existing zoom path already goes through. See journal, 2026-09-17.

33. **Rank 2nd — widen the mouse-wheel zoom step from 1.1 (10% per notch) toward roughly 1.15-1.2
    (15-20%).** `js/looped-network.js:26699`. Every sourced comparison (AutoCAD's default 60%, and
    CAD users' own preferred lower range of 15-20%; QGIS's 200%-per-click default) sits above our
    10%, and ours is the only one below the whole cluster. Not urgent and not free of judgement —
    nobody has filed a friction report on it the way Task 674 has a report behind it — so rank this
    below the no-wheel gap, which is an access failure, not a comfort one. A specific number (1.15
    vs 1.2 vs something else) is a five-minute tuning decision better made by trying it than by
    debate; I would not spend more diagnosis on the exact constant. See journal, 2026-09-17.

34. **Do NOT add zoom-level snapping.** Tom's own "anti-idiomatic" instinct is correct: this page
    is a raster basemap UNDER a hand-placed vector drawing, not a pure slippy map, and the reason
    slippy maps snap (tiles baked at integer levels) does not apply to our vector half, which wants
    to land on whatever scale reads cleanly. Snapping would cost the vector drawing a real thing
    (placing a node to read well at the zoom the user actually wants) to fix a raster problem tile
    providers already solve by resampling at fractional zoom, which is normal, unremarked behavior
    on every web map. See journal, 2026-09-17.
