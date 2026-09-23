# Journal — pre-reviewer

**The seat:** independent review of somebody else's finished work, before Tom sees it.
Hired 2026-09-19 on his own request: *"I just want independent review, not self-review, of all
work before I see it. This could save me review time."*

**Provenance tag on every entry.** CITED = external source, named. OBSERVED = this repository,
`path:line`. SPECULATION = my own inference, to be re-derived rather than re-asserted. An
OBSERVED finding decays — re-verify before citing it again, and carry the date last CHECKED.

---

## 2026-09-19 — the two failures this seat was made from

OBSERVED, `dev/tom-review-queue.md` rows R-054 and R-059, both written the day the seat was
created.

**R-054.** A build agent closed "customer labels are a vastly different size than other labels"
by reasoning that no separate text size existed and that vertical stacking made them look
large. Tom's next screenshot showed a customer label beside a link label at plainly different
sizes. **The agent never rendered the page and read the two numbers.** The failure is not
carelessness — the explanation was plausible and internally consistent. It is that an author
checks his own reasoning, and the reasoning was the thing that was wrong.

**R-059.** A build agent relaxed a column-width constraint so a DRAGGED column could be
squeezed narrow, and reported that untouched tables were unaffected. The relaxation reached
the default width; Tom opened a table whose Description column was one character wide.
**The agent verified the change it made, not the surface the change was on.**

The common shape, and the thing to look for first in any report: **the agent confirmed it had
done what it set out to do, rather than that the result was what was asked for.** SPECULATION,
on two instances — watch whether it holds.

---

## 2026-09-19 — first outing: an honest harness supporting a false conclusion

OBSERVED, `feat/customer-find-labels` at `ffd11548`, checked 2026-09-19.

Four of five items CONFIRMED by independent measurement and independent mutation testing — the
size fix re-derived from scratch (11 px against 2.75 px, then the one added line stripped in a
throwaway copy and 8 assertions duly failed), and every zoom caller traced to prove it really was
a single door. That is what a clean verdict costs, and it is worth saying that the work was good.

**The one MISS is the entry worth keeping.** The build agent concluded, in three separate places,
that Tom's own reading of a defect was WRONG: he thought a link label was the obstacle, and the
harness reported that across three views every named blocker was a neighbouring customer's label —
including a view built "specifically to give a link label the chance."

**Every number in that harness was honest. The SAMPLE was not.** Its customers sat at x = 100,
200, … 800, and a long pipe does not draw its label at the midpoint — it REPEATS it, measured
here at x=225 and x=675 on a 900-unit pipe. No customer ever landed near either. Putting one
customer at x=225 with nothing else on the drawing produced `DROPPED — first blocked by label of
L1`, three times over: a link label blocks, and when it does the customer's label **disappears
entirely** rather than moving — an outcome named nowhere in the branch's own documentation of the
mechanism it claimed to have fully explained. It took two throwaway probes and about ten minutes.

**The standing check this yields:** when a report concludes that something NEVER happens from a
small number of hand-picked scenarios, go and construct the case the author did not. This is
subtler than the failures this seat was made from — there no wrong number was printed either, but
there the reasoning was visibly the weak part. Here the reasoning was sound and the *ground it
stood on* was unrepresentative, which reads identically from the inside.

**And it is the repository's own written trap in a new costume:** a repeated question means the
RULE is the suspect. Tom is not assertive and will not fight a confident session; a branch that
tells him in three places that his own reading is wrong is the exact arrangement that has already
had to be withdrawn twice on label work. SPECULATION, on one instance: a conclusion that
contradicts him is the one most worth spending a probe on, whatever its evidence looks like.

---

## 2026-09-19 — second and third outings, and the pattern is now three deep

OBSERVED, checked 2026-09-19, across `feat/customer-find-labels` `a9422467`,
`feat/engine-fetch-wait` `e9319a0a` and `feat/xy-world-map` `731ab367`.

**Three confirmations worth stating, because a clean verdict is a real result.** The R-053
correction was genuine rather than a softening -- the drop rate re-ran across eight seeds at
0%-2.8% where 2.4%/1.2% had been reported, the right shape for a real order-of-one-percent
phenomenon, and both new assertions died when mutated. The antipode fix matched all three measured
numbers exactly, its mutation flag genuinely killed, and its rule about one seam per row turned out
to be geometrically derived rather than tuned to pass. The solver bar really does touch no panel,
and an injected one-line panel leak was caught by the guard that claims to catch it.

**But the same failure shape appeared twice more, and it is always the SAMPLE and never the
numbers.** A commit restoring a caution glyph fixed the English string, correctly loosened a
wording pin, and left the JS fallback literal 44 lines away without the glyph -- `check_all` red,
invisible in a browser. And the tile work concluded "the wheel is not the cause" from four
gestures that were all MONOTONIC; a direction-reversed gesture, an ordinary overshoot-and-correct,
bypasses the new reuse path entirely because the "do we already have this" test reads two buckets
and never the third one a tile sits in mid-transition.

**So the standing check earns its place three times over: construct the case the author did not.**
And a second one now: **a commit that fixes a VISIBLE thing gets checked by eye and not by the
machinery beside it.** For any commit that edits an `$ec_lang` value, grep for the same string as a
`pc.x || '...'` fallback before calling it done. SPECULATION on three instances, which is enough to
act on and not enough to call a law.

---

## 2026-09-21 — fourth and fifth outings: the seed-snapshot pattern is the rule, not the exception

OBSERVED, checked 2026-09-21, `feat/tables-spreadsheet` and `feat/customer-find-labels`.

**Two genuine crashes, and both were found by exercising the real event path rather than calling
the setter directly** -- mousedown, focusin, F2, type, change, instead of `col.set()`. Renaming a
node from the pane table while its Properties popup is open throws inside `refreshPopupIfOpen()`,
because the table's rename door never updates `currentPopup.id` the way the popup's own rename
does. **Same underlying function, different caller, and only one of the two callers finishes the
job** -- which is `dev/scenario-seam-repair.md`'s lesson in a new place, and worth remembering as a
question to ask of any "it goes through the same door" claim: the same FUNCTION is not the same
DOOR. Second: Delete on a selection spanning the ID column fires one blocking alert per row,
because the ID column is not "plain" for a node or link row and nothing exempts it from the bulk
clear. Neither was in the build report; both were mutation-confirmed as absent before the commits,
so neither is pre-existing.

**And the standing check on SAMPLES paid off a fourth time, on the same kind of number as three
prior outings.** A drop-rate improvement reported as 0.8%/0.8% turned out to be the harness's own
hardcoded seed (12345), and the single most favourable of ten tried; the real spread after the fix
is 0.0% to 2.4%. **The direction held and the attribution held perfectly** -- aggregate 1.34% to
1.06% across 5,000 samples, and 0 of 53 remaining drops caused by a link label across all ten
seeds. So this is not the R-053 shape of concluding the opposite of what happened. It is the
milder, now-familiar shape: **the number is real and the number reported is the best one rather
than a representative one.** SPECULATION upgraded to a working rule on four instances: when a
report gives a single percentage from a harness, ask what seed it is and re-run it.

**Confirmed clean, and saying so is part of the job:** the undo-clone fix (mutation-killed on its
exact one added line, and the leak it predicts genuinely does not exist elsewhere -- every other
box closes or rebuilds from the document), the paste-across-columns fix reproduced with a real
paste event, the service-line width guard (byte-identical placements when there is no link label to
react to), and the harness assertion flips on both branches, which genuinely reverse what is tested
rather than loosening it.

**One bookkeeping miss worth naming because it would have misled a translation sprint:** a report
claimed "no new language keys anywhere on the branch" and one had been added and correctly wired.
A wrong count is cheap to make and expensive to inherit.

## 2026-09-21 — sixth outing: the repair for the repair still has a hole

OBSERVED, checked 2026-09-21, `feat/tables-spreadsheet` at `d8ee55a0`.

**Eight of nine items (R-035, R-082, R-083, R-085, R-086, R-087, R-088, and the `refTo`
half of R-085(c) on customer columns) CONFIRMED by running real events through the actual
door**, not by reading. The `refTo` fallback was worth constructing beyond the shipped
harness's own sample (which only drives Pipes' From/To): a customer detached from its pipe
(dangling `link` id) and a customer with no `link` field at all both fell back cleanly to the
customer's own row rather than mistargeting or crashing -- a case the queue's own item (c)
names ("a customer's lumped junction") and the shipped harness never drives.

**The one MISS: the repair for R-038's own overreach only covers `<select>` and checkbox
cells, not a text cell already in Edit or Entry mode.** The mouse-half fix (4fc86c07) made
every plain mousedown on the table call `preventDefault()`, to stop the browser arming its
own character-drag-selection while extending a cell RANGE with the mouse. The follow-up
(4cfbd343) exempted a pull-down and a checkbox from that -- but never asked whether a TEXT
cell that is already open for editing needs the same exemption. It does: `paneEnterEdit()`
selects the whole value on entry (F2 or double-click), and the natural next move -- click
inside the text to place the caret for a partial edit, or drag to select a substring to
retype -- fires the SAME mousedown listener, which prevents the default caret placement and
then just re-focuses the already-focused box, leaving the caret exactly where it was.
**Verified with a real mousedown fired at the table's own listener, after entering edit mode
with a real dblclick**: `preventDefault` still fires (count 1) on the second press. The
shipped harness's own equivalent assertion ("a press on a typed cell still blocks the
browser's text selection") only ever runs in Ready mode, so it could not have caught this.

**The standing check earns its place again, in a new shape**: the fix for an overreach is
itself checked by re-running the SAME small set of cases (select, checkbox, one Ready-mode
text cell) rather than by asking what OTHER state the same code path now runs in. Worth
adding to the standing list: **a "we exempted X and Y" repair is exactly the moment to ask
what THIRD state shares the same code path** -- here, editing is not select or checkbox, but
it is not Ready either, and nothing asked about it.

---

## 2026-09-21 — sixth outing: the review ledger itself can fork, and a flagged number stayed put

OBSERVED, checked 2026-09-21, `feat/customer-find-labels` `bd620e4f`.

**R-011 and R-013 CONFIRMED, both re-derived independently rather than trusting the build agent's
own harness alone.** R-011: grepped `js/looped-network.js` for the fallback literal beside
`pc.lpn_customer_fixed_head` and it carries the caution glyph, matching `lib/lang.ec.en.php`
exactly — the defect shape logged above at 2026-09-19 (glyph in the language file, missing from the
JS fallback) was not repeated. R-013: read `mapSpan`, `visibleMapWidth`, `visibleMapMetres`,
`metresPerWorldUnit` and the new `captureCustomerViewWidth()` directly, then separately computed
`Geom.geodesicMeters()` at four latitudes (0°, 38.1°, 60°, 80°) against `cos(lat) x 111,320 m` to
confirm the degrees-to-metres correction generalises rather than being tuned to the one latitude the
build agent's own harness happened to use — it does.

**But the review queue itself forked, which is the finding that would actually cost Tom time.**
Master gained a new row, R-090, quoting his second complaint about this same button (`418d548f`,
committed after this branch's last merge from master at `324a8e1c`). This branch's copy of the
ledger therefore never had R-090 at all; its own fix (`bd620e4f`) instead appended a DONE note onto
the pre-existing R-011/R-013 rows and never mentions R-090 by number. **The same fix is now recorded
under two different IDs on two different lines of history.** Confirmed by `git log -S "R-090"`
(introduced once, on master, after this branch's merge point) and
`git merge-base --is-ancestor 418d548f bd620e4f` (false). Whoever merges this branch needs to open
R-090 by hand and mark it DONE against `bd620e4f`, or Tom will find it still open on master
describing a bug already fixed here — the exact shape R-048 exists to prevent.

**And the seed-sample finding logged above on 2026-09-21 recurred on the same branch, uncorrected.**
That entry already named this harness's `12345` as "the single most favourable of ten tried."
Re-running it today: the harness now draws 250 samples per side from one continuing stream instead
of one (a real improvement), but the seed is still the literal `12345`, and sweeping ten different
starting seeds through the same 250-draw method gives 0.4%-2.4% per side against the `0.8%/0.8%`
the queue quotes. The number that was already flagged is still the one written down as the result,
with no caveat about its range.

**A cost nobody had measured: reserving a link label's room in advance is not free.**
`linkLabelReachWorld()` is applied to EVERY customer on a labelled, aligned pipe, not only the ones
near an actual repeat station — `layoutCustomerLabels()` takes
`Math.max(ordinaryPad, linkLabelReachWorld(link))` per customer regardless of that customer's own
position. Measured directly: the ordinary pad is 4.4 world units; `linkLabelReachWorld()` is
22.45 — **5.1x**, paid by every service on a labelled pipe, everywhere on it, whether or not a link
label ever falls nearby. This may be exactly what Tom's own design asked for ("reserve room whether
or not one is actually there"), so it is reported as a question rather than a defect — but it was
never measured or written down as a tradeoff anywhere in the branch's own record, and it plausibly
explains why the "beyond the meter" count did not fall alongside the drop-rate improvement.

## 2026-09-22 -- feat/notice-log (R-116..R-119), review at `1e48999b`: NOT READY

Worktree `/home/haws/webdev/worktrees/feat-notice-log/engcalcs`, preview :8099, real headless
Chromium (playwright-core), setNotice() reached through a route-injected seam, never an edit.
Screenshots: `/tmp/claude-1000/-home-haws-webdev-hawsedc-com-engcalcs/760eead1-0b47-4541-a70a-23bd73a4d678/scratchpad/shots/`.

**MISSED, the headline: the glyph is buried under the very message it is meant to sit beside.**
OBSERVED: `#lpn_map_notice` is NOT inside the new `#lpn_map_overlay_tl_col`; it is a sibling of the
whole overlay, `position:absolute;top:4px;left:4px;z-index:5` against the map. The glyph is at the
same top-left corner. Measured at 1280: glyph (5,144) 26x16; short notice (5,144) 94x23; long
notice (5,144) 767x39. Same at 390px. The screenshots show a clean clock pill when quiet and NO
glyph at all while a notice shows -- the blue highlight exists in the DOM and nobody can see it.
It is still clickable through the notice (pointer-events:none), so it is a live invisible target.
The code comment asserting the notice "is absolutely positioned at THIS box's top-left" is false;
this is the R-054 shape exactly -- an explanation believed and never rendered. Harness 7c asserts
SOURCE ORDER (`indexOf`) and "both states read [glyph] [text]"; the order is true and the reading
is not, so the harness passes on the defect. Tom's words: "it must appear and possibly highlight
while a message displays" -- it disappears while a message displays.

**MISSED in RTL (?lang=ar).** OBSERVED at 1280: glyph and mode hint at the RIGHT edge (glyph
x=1249), notice at the LEFT edge (x=5). The notice/hint split is pre-existing (notice has a
physical `left:4px`); what is new is that the glyph went with the hint, so in five languages the
glyph sits the full map width away from where messages appear.

**Also-observed, lower:**
- The ten-past-ten clock at 1x (11px) reads as a chevron-down in a circle -- the V of the two
  hands dominates. SPECULATION about how a person reads it; needs Tom's eye (glyph-quiet-x4.png vs
  en-1280-quiet.png).
- Phone, welcome state only: `#lpn_examples_pane` covers the glyph, a tap lands on the pane. With a
  map open it is reachable. Mode hint is display:none at <=640px, so on a phone the glyph stands
  alone and then vanishes under every notice.
- The lock banner is logged (as 'warning', amber, even when the banner is the RED read-only state)
  but does not light the glyph. Whether "a message displays" includes the banner is Tom's call.
- R-117 and R-118 were marked [x] in the queue by the build agent before review.

**CONFIRMED:** icon is a new `history` clock (not info); removed from bottom strip, one id;
highlight toggles on/off with notice and expiry (harness 7d, and DOM class in Chrome); hidden in
print (emulated print: offsetParent null); keyboard: one stop, after the tab strip, focus ring
visible, accessible name "Messages"; notice-log-harness and small-screen-harness pass; no page
errors in en/ar at 1280 and 390.

**Not checked:** check_all (serialized, per brief); the right-hand overlay with a pane open beyond
reading that `right:` is unchanged; the harness mutation claim (not re-run).
---

## 2026-09-22 -- feat/map-menu, review at `a159c4dd`: NOT READY (one defect on the default path)

OBSERVED, checked 2026-09-22 against the worktree at `a159c4dd`, headless Chromium through Apache
on :8101 plus a node stub of my own.

**MISSED, and it is on the commonest path there is: Map, World map, Attach on a lat/lon or EPSG
project that is already showing its map turns the map OFF**, while the notice reads *"The world map
is behind your drawing now"*. A new lat/lon or EPSG project opens with the map showing, and Attach
is never greyed, so the first press most people make does the opposite of its label. Cause:
`worldMapAttach()` calls `setBasemapOn(true)` -> `setBasemapStyle('osm')`, and that setter
TOGGLES OFF when asked for the style already showing (a rule written for the retired Hide/Show
rows). Measured in the browser: tiles 16 -> 0, attribution hidden, stored `basemap` = `"off"`,
Detach then greyed. EPSG:32612 the same (48 tiles -> 0). The branch's own harness missed it
because it sets the basemap `'off'` before pressing Attach -- **the test built the one state in
which the bug cannot show.** Same shape as the seed-snapshot entries above: a fixture chosen,
not sampled.

**MISSED, smaller: Detach then Attach on lat/lon/EPSG always comes back as the STREET map**, even
if the user was on satellite. `setBasemapOn(true)` hard-codes `'osm'`.

**A QUESTION FOR TOM, not a defect in the build: on a GRID project, retiring Hide street map
removed the only way to hide the tiles without throwing away the placement.** Detach on a grid
deletes `project.georef` (no undo, no confirm), and getting the map back means the wizard from
scratch. His reason for retiring the rows -- *"Detach and attach provide the same functionality"*
-- is true on lat/lon and EPSG and not on a grid.

**CONFIRMED, independently:** the three rows on every kind (screenshots per kind); Go to/Search
greyed on a bare grid and live on an attached grid; Go to on an attached grid lands exactly on the
drawing point, checked with my OWN WGS84 forward formula at rotDeg 27.5 and a 1.37 scale factor,
and again with a 579,000/1,303,000 local origin; node coordinates and georef byte-identical after
Go to and a search-with-extent. Mutation-killed: nulling the grid branch fails the harness, and so
does narrowing placeFindable(). The seven deleted keys are read by no shipped file (comments only).

**Harness debt, not user-facing:** `dev/browser-pass/specs/goto.js` and `search.js` still assert
the OLD rule (row hidden on XY) and fail on their first check; the browser-pass `newProject()`
helper checks a radio value `xy` that has been `local` since `ce626311`, so the half of
`basemap.js` this branch edited for the grid case has never actually run. Pre-existing helper, but
the edited spec's author claimed coverage it does not have.

---

## 2026-09-22 — feat/map-menu, narrow re-review at 574a6b2b: NOT READY, one confirmed regression

OBSERVED, checked against the worktree at 574a6b2b (fixes fe3196d0 + 574a6b2b), headless Chromium
through the worktree's own `dev/browser-pass/lib/env.js` server (route-aborted OSM/Mapbox requests),
plus two throwaway debug `console.log` lines added to `js/looped-network.js` for one session and
reverted (`git checkout` before finishing; never committed).

**All five originally-reported defects CONFIRMED FIXED, independently re-measured:**
1. Attach on an already-showing lat/lon/EPSG map no longer turns it off — `setBasemapStyle` sets
   rather than toggles, and the Attach row is now greyed (`disabled: worldMapAttached()`) the moment
   the map is showing, on both `LPN_COORDS_GEO` and a projected CRS.
2. Detach then Attach restores the LAST style, not always street: measured end to end through a real
   save/reopen — a project teased to `satellite`, then Detached, then saved, closed and reopened
   (forcing a real re-read of the file rather than the "already open" tab-switch shortcut), then
   Attach: `project.basemap` reads `satellite`, not `osm`. `basemapLast` rides in the ordinary
   `project` blob and survives the file round trip because it is written unconditionally.
3. Grid Detach no longer destroys the placement — confirmed structurally (`worldMapDetach()` now
   only calls `setBasemapOn(false)`, no `delete project.georef`) though I did not drive the wizard to
   completion in a real browser to attach a grid placement in the first place (see UNVERIFIED below).
4. **The old-file defect is genuinely fixed on a lat/lon project**, and this took three attempts to
   prove because my first two attempts had test bugs, not product bugs, worth naming so they are not
   repeated: closing a tab and reopening the same filename does nothing unless the CURRENT tab is the
   one closed (`.lpn-tab-x` is not scoped by a bare CSS comma-list — Playwright clicks the first
   match in DOM order) and unless "Close without saving" is answered rather than an implicit save
   (closing a clean tab skips the dialog and just discards, so the dialog does not always appear).
   With both fixed: a file hand-edited to `{basemap: "off"}` with no `basemapLast` (a legacy file
   from before this feature) reopens **correctly detached** (tiles = 0, Attach enabled, Detach
   greyed), and Attach then shows the street map. Point 4 is closed.
5. Test debt from the first round is gone; the wording baseline commit updates the two `goto.js` /
   `search.js` specs and the harness-wording exception table together.

**MISSED, and it is a real regression this branch's own new code path opens up: undoing a Detach or
an Attach restores the MENU'S state but not the MAP'S.** `undo()` (js/looped-network.js, function
starting `function undo()`) puts `project.basemap` back from the snapshot unconditionally, but only
calls `refreshBasemap()` when `coordsChanged` — and a plain Detach/Attach never changes
`project.coords`. Measured with a debug hook on `refreshBasemap()`: after Ctrl+Z following a menu
Detach, the last `refreshBasemap()` call logged is the Detach's own (`basemap=off`); none fires for
the undo. Observably: Map, World map, Detach (tiles 9→0) then Ctrl+Z reads the submenu as attached
again (Attach greyed, Detach live) while the canvas still shows **zero tiles** — the map stays blank
until some unrelated action happens to trigger a repaint. This is exactly the shape CLAUDE.md's own
two founding incidents are about: a control's state and the screen disagree, and nobody measured the
rendered result. It is new to this branch because before it, nothing changed `project.basemap` via
an ordinary undoable snapshot on a lat/lon or EPSG project — only the grid wizard did, through
`coords`-changing paths that already hit the `coordsChanged` branch.

**MISSED, secondary: the corner satellite/street teaser is not gated by Attach/Detach at all.**
`refreshBasemapTeaser()` shows the corner button whenever `basemapChoosable()` (a placement exists),
not `worldMapAttached()`, so it stays visible and live on a DETACHED project. Clicking it while
Detached silently reattaches the map (tiles 0→16 in one run), through `setBasemapStyle()` directly —
no `saveUndoSnapshot()`, no `setNotice()`, none of the ceremony `worldMapAttach()` gives every other
door into the same state change. The submenu DOES end up consistent (Attach greyed, Detach live)
once this happens, so it is not a state-tracking bug — but it is an undocumented fourth way to
attach the map, invisible to the "Attach is greyed while showing" story CLAUDE.md now tells, and its
interaction with undo could not be pinned down cleanly in the time available (two runs gave two
different tile counts after one Ctrl+Z) precisely because it does not take its own snapshot.

**A QUESTION FOR TOM, sharpened rather than new: there is genuinely no way to discard a grid
placement and start the wizard over.** Read `mapgeoStart()`: it still contains the
"already georeferenced, replace it?" confirm branch, but the only caller left
(`worldMapAttach()`) gates it behind `!xyGeorefOk()`, so that branch is **dead code** — nothing in
the shipped UI can reach it once a grid has a placement. The four rows on a grid project are Attach
(disabled once attached), Re-adjust (nudges the existing transform), Scale from the current size
(a numeric factor on the existing transform) and Detach (hides, keeps). None of them throws the
placement out and restarts at the Gulf of Guinea. If a placement is badly wrong — wrong hemisphere,
wrong scale by 1000x — Re-adjust and Scale are corrections to a transform, not a fresh start, and
the only way back to the wizard's own step 1 is to abandon the network and start a new project.

**UNVERIFIED FROM HERE:** I did not drive the grid-project georeferencing wizard to completion in a
real browser (its multi-step popover needs a place search or a typed lat/lon I did not have time to
script reliably), so undo/redo across a grid Attach/Detach is confirmed only by reading the code
(`worldMapDetach()`/`worldMapAttach()` are symmetric with the geo/EPSG case and both call
`saveUndoSnapshot()`), not by measurement — and given the tiles-vs-menu defect just found on the
geo case, the grid case should be assumed to have the same defect until someone drives it in a
browser and reads the canvas, not just the menu.

**.inp export does not carry the basemap**, confirmed both by reading `js/lpn-inp.js` (the
`[BACKDROP]` writer keys off an image backdrop's `href`, nothing about `project.basemap`) and by
exporting a saved-satellite project and grepping the output: no `basemap`, `mapbox` or
`tile.openstreetmap` token anywhere in it.

**Verdict: NOT READY.** The five originally-reported defects are genuinely fixed, but the fix
introduced a new one on the exact feature it was fixing — undo of the very commands this branch
added leaves the canvas and the menu disagreeing about whether a world map is showing, which is the
one thing Tom's own two founding complaints (R-054, R-027) say costs him the most: an agent's
report and the screen not matching. Fix `undo()`'s repaint condition (or always call
`refreshBasemap()`), decide whether the corner teaser should be gated the same way `worldMapAttach()`
is now, and drive the grid wizard once in a real browser before calling undo/redo settled there too.

---

## 2026-09-22 — seventh outing: the table has no scenario-switch guard the popup already had

OBSERVED, checked 2026-09-22, `feat/tables-spreadsheet` `47306e11`.

**The tables spec the build agent left behind (`dev/browser-pass/specs/tables.js`) is real and I
ran it myself rather than trusting its own green.** `flock ... node run.js tables`: 17/17, against
the live tree, covering R-109 (blank-on-load reload with Recalculate off), R-110 (column floors on
three real examples, plus the three-piece heading-break rule replayed against OLD stored 1em
widths), R-111/R-113/R-115 (refill-not-rebuild, focus-follows-tab, the right-click label), and R-112
(heading/row seam at three device scale factors). All passed against the actual DOM, not a stub.

**The one MISS, and it is the shape this seat exists to catch: a scenario switch does not refresh
the visible table when Recalculate is off, and the popup's own equivalent code already knows to
guard against exactly this.** `applyScenarioChange()` (js/looped-network.js ~4520) calls
`closePopup()`, `buildDom()`, `refreshSymbolSizes()`, `refreshValueColors()` and
`refreshScenarioStatus()` unconditionally, then `scheduleSolve()` — and `scheduleSolve()` with
`settings.autoRun === false` (Recalculate off) runs `afterManualEdit()`, which only saves and stands
down time; it never calls `refreshPaneIfOpen()`. The table pane has no listener of its own — its own
comment says so ("The pane follows the document without a listener of its own... A tab that is not
on screen is not refreshed"). So with Recalculate off, switching FROM a scenario back to Base, while
staying on the SAME table tab the whole time, leaves the input cell showing the OTHER scenario's
number.

**Measured with real interaction, not synthetic events**: opened `lpn_ex_net3_title`, Recalculate
off (patched into the stored project, matching R-109's own harness technique), opened Junctions,
created a scenario via the real menu (`.lpn-menu-row` "New scenario…", answered through
`Session.answerPromptWith`), double-clicked junction 10's Demand cell, typed `999999`, pressed
Enter — a real edit through the real commit path (`change` event → `paneCommitCell`), confirmed by
the scenario menu's own override count going `(0)` → `(1)`, so the write correctly became a
scenario override rather than a Base mutation. Then opened the scenario menu again and clicked
`Base`. **The table still read 999999.** A second run in the same session: clicking away to Pipes
and back to Junctions heals it immediately (reads `0`, correct) — `renderPaneTable()` is called
fresh on tab `show()` and picks up the live document — and a parallel run with Recalculate ON shows
the correct `0` immediately after the scenario switch (the debounced solve calls
`refreshPaneIfOpen()` on the way through). So the gap is narrow and specific: **Recalculate off,
scenario switch, no intervening tab click** — but it is a real one, and it is not hypothetical: it
produces a number on screen that is not the number the document holds, in the exact "does the table
match Properties" shape this round was asked to check first. The popup sidesteps the whole question
by closing itself on a scenario switch (`closePopup()`, unconditional, at the top of
`applyScenarioChange()`); the table has no equivalent and just sits there wrong. Two script paths,
both reproduced with a real click/type/Enter sequence and read back from the live DOM:
`/tmp/claude-1000/.../scratchpad/staleness-probe.js` and `staleness-probe2.js` (not committed;
paths are this machine's temp dir and will not survive the session — the finding is what to keep,
not the file).

**CONFIRMED clean, measured rather than assumed: a hidden, stacked table panel cannot intercept a
click or a Tab stop.** Opened all seven table tabs once each (so each is a real built, hidden
`content-visibility: hidden` panel stacked at `z-index: -1` under Profile), landed on Profile, and
(a) `elementFromPoint()` at four points across the pane body resolved inside Profile's own subtree
every time, never inside a hidden table; (b) a real dispatched click landed on the SVG polygon
Profile drew, not on anything hidden; (c) walked Tab fifteen times from the Profile tab strip and
never once landed inside a `.lpn-pane-panel.lpn-pane-scroll:not(.on)`. The CSS comment's own account
of the earlier bug and its fix (`isolation: isolate` on `.lpn-pane-body`, because "an empty
positioned box lay over the Profile panel and ate its clicks") checks out against real interaction,
not just against the stylesheet's own prose.

**Re-measured the tab-switch timing myself rather than trusting the probe's committed numbers**,
three runs, `lpn_ex_net3_title --solve`: a first switch to Pipes (fresh build, 117 rows x 17 cols)
cost 480-611 ms; every REPEAT switch back to Junctions after that cost 17-177 ms — matching the
build agent's own AFTER figures (17-97 ms) closely enough, and nowhere near Tom's "3 seconds" or "8
seconds" at normal speed. **Under a 4x CPU throttle** (`--throttle=4`, simulating a busier or older
machine, which Tom's own machine may be relative to this one), the same repeat switches ran
400-428 ms and the first Pipes build ran 2.4 s with a 2.2 s worst single frame — genuinely in
multi-second territory. So the fix is real and large for a REPEAT switch, but a first switch to a
given tab in a session is still a genuine rebuild, and on a slower machine that alone could still
read as "delayed several seconds" — worth Tom noting, next time it happens, whether it was the
FIRST time he opened that tab in the session or a repeat.

**CONFIRMED the two new `table_column_parity_check.php` exemptions are truthful, traced to the
actual gate rather than taken on the comment's word.** `pump/lpn_result_reaction_rate` and
`valve/lpn_result_reaction_rate` claim the row never renders on those types. `linkReactionRate(l)`
(js/looped-network.js:7083) reads `lastSolveResult.linkRates[l.id]`, and `linkRates` is populated
only by `fillReactionRates()` in js/lpn-epanet.js (~1900), which explicitly skips every link whose
EPANET type is not Pipe — the engine's own `reactpipes()` gate, copied rather than re-decided. A
pump or valve id is never written into `linkRates` at all, so `linkReactionRate()` returns
`undefined` for one and the popup row is skipped by the same `if (rateVal !== undefined)` every
other result row uses. True as stated.

**CONFIRMED print widths clamp to the sheet, by measurement rather than by reading the CSS.**
Forced all 17 Pipes columns to a stored 30em (510em total, an extreme a real drag would be unlikely
to reach but exactly the "wider than the page" case asked for), reloaded, opened Print, emulated
print media and read the DOM: `table.style.width` was the full `510em`, but `max-width: 100%` under
`table-layout: fixed` clamped the rendered box to the print area's own width exactly
(`tableWidth === areaWidth`), with every column still at its proportional 5.88% share. **Caveat, an
honest one**: Playwright's `emulateMedia('print')` renders print CSS but does not paginate to a real
sheet size the way `page.pdf()` or an actual print dialog would, so this proves the table cannot run
wider than ITS OWN CONTAINER, not that the container itself is bounded to a US Letter or A4 printable
width in every browser's print dialog — that last step needs a person to press Ctrl+P and look, which
is the one thing this instrument cannot do. Also confirmed by reading the live file (not the diff):
`lpn_pane_paste_note` and its "rows that already exist" text are gone from `lib/lang.ec.en.php`
entirely (R-140), and `lpn_pane_tab_tip` now reads *"This tab shows the assets of this kind as a
spreadsheet-like table. Result columns cannot be edited."* (R-141), matching Tom's own quoted wording.

**Not reached this round, for the record rather than by silence**: whether an EPS time-step change
(scrubbing the run transport) has the same Recalculate-off gap the scenario switch does — `lpn-time.js`
carries no reference to `refreshPaneIfOpen` or `lastSolveResult` at all, so the wiring is somewhere
in the `EngCalcs.lpnTime*` bridge functions inside `looped-network.js` and tracing it was not
finished in this pass; and whether a UNITS change or an UNDO while a scenario other than the one the
snapshot was taken in is active shows the same class of gap (undo calls `refreshPaneIfOpen()`
directly and unconditionally, so it is very likely fine, but not independently re-measured here).

## feat/zoom-control (Task 682), 2026-09-23, head 2d08c5b2

**MISSED, OBSERVED by rendering: the on-map +/- chip cannot hide, at any width, on any pointer
type, because an inline style beats the media-query rule meant to hide it.** Looped-Network.php
writes `<div id="lpn_zoom_control" ... style="...display:flex;...">` (line 511) — an inline style,
which wins the cascade over any external stylesheet rule short of `!important`. The hiding rule
lives in `css/engcalcs.css` at `@media (max-width: 640px) { @media (hover: none) and
(pointer: coarse) { html:has(#lpn_canvas) #lpn_zoom_control { display: none; } } }`. I drove a
real Chromium (via `dev/browser-pass`'s own `lib/env.js`/`lib/session.js`, against a `php -S`
server over this checkout) to a 390×800 context with `hasTouch: true, isMobile: true` and read
`matchMedia()` directly: `hoverNone: true, pointerCoarse: true, maxWidth640: true` — every
condition the CSS asks for is true — yet `getComputedStyle(el).display` was still `"flex"` and
the element rendered at 28×54px, screenshotted sitting over the example gallery. This is exactly
Ida's own placement rule failing ("hidden entirely at the 640px breakpoint, because fingers
pinch," dev/ROADMAP.md Task 682) and the build agent's own claim ("hidden at the 640px breakpoint")
— both false as rendered. `dev/lpn-spike/zoom-control-harness.js` section 4 cannot catch this: it
only checks that the CSS text for the rule sits inside the right `@media` block; it never renders
the page, so it never meets the inline style that defeats it. Screenshots:
`390-en.png` (chip visible over the gallery even without touch emulation).

**CONFIRMED, OBSERVED by rendering, everything else Tom and Ida asked for:**
- Chip visible top-right at 1280 wide, English (`1280-en-topright.png`): `#lpn_zoom_control`
  `display:flex`, 28×54px, at `left:1247,top:144` in a 1280-wide viewport.
- + and − keys zoom about the view centre through the wheel's own math: pressing `+` took the
  world transform from `s=1` to `s=1.1` (a wheel notch), `-` brought it back down; both read off
  the SVG's own `transform` attribute on the world group, not asserted against `zoomAbout()`
  directly.
- The "not while typing" guard is real against a genuinely focused, visible text field
  (`#lpn_crsbox_name`, made visible and focused, `document.activeElement` confirmed): `+` did
  nothing to the scale while it had focus. (My first attempt used a hidden dialog input Chromium
  never actually focuses — that gave a false FAIL and was thrown out once I checked
  `document.activeElement`; worth remembering for the next spec that tries this shortcut.)
- The toolbar button's two-step double duty matches Tom's own words exactly: first click performs
  Zoom to fit (view's `s`/`tx` changed) and repaints the button to read "Zoom Window"
  (`aria-label`), without yet entering `zoom-window` mode (`aria-pressed` stayed `false`); second
  click sets `aria-pressed="true"` and a real pointer drag on the canvas (mousedown/move/up) then
  changed the view's scale (a box-fit, `232.05` from `69.8`, matching a magnification of the
  dragged box); after the completed drag the button read "Zoom to fit" again and `aria-pressed`
  returned to `false` — the same one-shot return-to-Select the harness's node test already
  asserted, now shown live in a real browser rather than through the exported primitives.
- The chip stays at the right edge (`left:1247` of 1280) in Arabic RTL exactly as in English — it
  does not flip to the left. (Its vertical position was ~110px lower in Arabic than English,
  109px; not investigated further — likely a taller top-left status/mode-hint stack under Arabic
  text metrics pushing nothing that matters here, but I did not trace it, so treat as a curiosity
  not a claim.)
- No overlap detected, at 1280 wide English, between the chip and any element matching
  `#lpn_legend, .lpn-legend, [id*=legend]`, `#lpn_scale, .lpn-scale, [id*=scale]`, `#lpn_rpane`, or
  an attribution control — all four came back `null` (no bounding-box intersection). This was
  checked on the default example (no legend actually showing), so it does not exercise the
  `overlayOccupants()` dodge path Tom's brief described (a labels legend parked top-right); I did
  read that code (js/looped-network.js ~36660) and it does register `#lpn_zoom_control` as an
  occupant a legend dodges under, but I did not render a project with the labels legend on to
  measure the dodge in pixels — **UNVERIFIABLE FROM HERE without a person opening a project with
  the labels legend set to top-right and confirming by eye that it sits below the chip, not
  under it.**

**UNVERIFIABLE FROM HERE (visual only):** whether the chip's own look (the 28px button size, the
divider line, the background tint against a busy map, and the little corner triangle on the
toolbar button Tom asked for) reads well is something only a person looking at the rendered page
can judge — I can confirm elements exist, are sized, and are positioned, not that they look right.

**Harness note:** `dev/lpn-spike/zoom-control-harness.js` (29 checks) passes cleanly and is honest
about what it proves — its own comment says a harness that called `zoomAbout()` directly would
prove nothing new, and it drives the real keydown/pointer listeners instead. I did not mutation-test
it (did not revert the fix and rerun), for lack of time; its own file did not exist before this
branch so there is no "does it fail on old code" question to ask — the branch that would fail it
does not exist.
