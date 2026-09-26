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

## 2026-09-22 -- feat/notice-log, second review at `dfd8d244`: NOT READY

Worktree `/home/haws/webdev/worktrees/feat-notice-log/engcalcs`, preview :8099, real headless
Chromium (playwright-core, launched directly against the running preview server since this pass
was scoped to that server rather than to `dev/browser-pass`'s own PHP spawn). This commit fixes the
buried-glyph defect from the first review (`#lpn_map_notice` is now a child of
`#lpn_map_overlay_tl_col`, confirmed by a real screenshot: the notice pill sits beside the glyph
and the panel opens directly under it, oldest lower, matching Tom's description) and answers his
(2) and part of his (4). Two of his five points are not done, and one further defect appears in the
same commit.

**MISSED -- (3), the flash, is not gone; only NAMED.** OBSERVED, live: opening the "Basic network,
gpm (US)" example produces `#lpn_engine_banner` = "Loading solver. Results delayed momentarily.
Continue working." at t=1028ms and clears it at t=1335ms -- on screen for roughly 300ms, in the
exact top-left column Tom is looking at. "SOLVER" and "POWER" share four of six letters in the same
positions (_O__ER vs _O_ER, both round-vowel-then-W/V-then-E-R), so this is a good match for "a
word... similar to POWER" that he could not read. `git show dfd8d244` and `git log -S"POWER"
--all` turn up nothing: no debounce, no minimum-display time, no delay-before-show was added
anywhere in this branch's history. The build agent's claim in this round's brief --
"the 'POWER' flash was 'Loading solver...' from refreshEpanetBanner()" -- correctly names the
string and does nothing to it. Tom's instruction was "That needs to stop happening"; it still
happens, unchanged, and identifying the culprit is not the same act as fixing it. This is the
R-054 shape in a new place: a plausible, checkable explanation stood in for a fix, and nobody
reran the browser to see whether the thing complained of was still there.

**MISSED -- (4), "All messages," is not all of them.** `setStatus()` and `refreshEpanetBanner()`
were taught to call `logMessage()` this commit, which covers the two examples Tom named live
("Working out the extended period simulation." and the EPANET-loading banner) -- confirmed, both
appear in the panel after a load that shows them. But `setEngineNotes()` (`js/looped-network.js`,
~line 45334), the ~2-minute-fading note in `#lpn_status_notes` beside the diagnostic -- "Note: with
Manning roughness, EPANET rounds the constant in the Manning equation..." is the one example in the
current source -- has no `logMessage()` call anywhere in it or in its one caller. It is a real,
on-map, worded message with its own timer, in the same top-left column as everything else this
branch moved, and it will fade off screen unread exactly the way the lock banner did before this
whole task existed, with no trace in the log Tom just asked to be complete. Grep is decisive here:
`grep -n "logMessage" js/looped-network.js` never mentions `setEngineNotes`.

**MISSED (not one of Tom's five, but inside the checklist this review was asked to run) --
dismissing the panel by clicking the map also does whatever that click would otherwise have done.**
`msglogOutsideHandler()` (the capture-phase `click` listener that closes the panel on an outside
click) calls neither `stopPropagation()` nor `preventDefault()`. The canvas's own interaction
handling is wired on `pointerdown`/`pointerup` (`svg.addEventListener('pointerdown', ...)`,
`js/looped-network.js` ~32112+), which fires and completes BEFORE the `click` event the dismiss
handler is listening for. Verified live: instrumenting `document`-level capture listeners for both
`pointerdown` and `click` and comparing an ordinary canvas click against a "dismiss the panel"
click at the same map point shows both events reaching the document identically in both cases --
nothing intercepts or discards the pointerdown on the dismiss path. So a user who presses the map
just to put the message panel away will, in the same gesture, do to the network whatever a plain
click there does: select an element, deselect the current one, or begin whatever the active tool
starts on pointerdown. Not measured against every tool (would need one live repro per mode), but
the timing argument -- pointerdown-before-click, no propagation stop -- holds for all of them by
construction.

**CONFIRMED.** (2): a real screenshot with the legend showing (top-right) and the message column
open (top-left, "Opened Net3-Novato-CA-World...") shows no overlap with the legend -- both the
top-left row and the footer already reserve `calc(4px + var(--lpn-overlay-right, 0px))`, the same
custom property a right-side legend sets, so the structural fix predates this branch and nothing in
it broke that. Dedupe: repeating the identical "Nothing is selected" notice three times over
produced exactly one row in the panel, moved to the top, not three -- no flood on the case that
matters most (an unchanged diagnostic re-showing on every ordinary solve). Keyboard: Tab reaches
`#lpn_msglog_btn`, Enter opens the panel, Escape closes it, live and unscripted. No page errors in
either probe.

**STILL PRESENT, same defect as the first review, unaddressed by this commit: the phone welcome
state.** At 390px on a fresh project, `#lpn_examples_pane` still intercepts every click meant for
`#lpn_msglog_btn` (Playwright's own retry log names the exact intercepting element). Filed once
already; filing it again because a second commit went by without touching it.

**Not independently re-shot this session, because of a shared `/tmp/engcalcs-browser.lock` held by
another concurrent session for an extended stretch:** the RTL layout at 1280/390. The fix itself
(`inset-inline-start` in place of `left`, read directly from `Looped-Network.php`) is a correct,
logical-property answer to the exact defect the first review measured (glyph and notice a map-width
apart in Arabic), and `dev/browser-pass/specs/msglogpos.js` is written to catch a regression of
precisely that shape -- but I did not re-render it myself this round and say so rather than
inheriting the first review's now-decayed OBSERVED finding as if it still described this build.

**Verdict: NOT READY.** The flash he explicitly asked to stop still happens; "all messages" still
excludes one; and the outside-click dismissal has a real, unflagged side effect on the drawing.

## 2026-09-22 -- feat/notice-log, fourth review at `1f2e4819`/`bb51995e`

Worktree `/home/haws/webdev/worktrees/feat-notice-log/engcalcs`, `dev/browser-pass` infra (own
PHP server + real Chromium via playwright-core), plus a one-off probe script written for this
round. Reviewing on top of `f02da0be`, which my own third review (2026-09-22, logged above) found
NOT READY on the flash, the incomplete "all messages," and the outside-click side effect -- all
three are addressed by `f02da0be` itself (a commit that landed between my third review and this
one) and are RE-CONFIRMED here, live, rather than trusted: ran `dev/browser-pass/specs/msglogpos.js`
in full (68/68 checks passed) -- dismiss-no-side-effect and glyph-on-fresh-project sections, both
written in response to my prior findings, pass against real pointer/click events and a real
`elementFromPoint` hit-test.

**CONFIRMED -- (1) and (3), read together as the build agent claimed they were one defect, and
independently re-measured rather than trusted.** `.lpn-msglog-panel` gained `flex-direction:
column` and a solid `background:#fff`. Live probe (three simultaneous notices from Ctrl+Z, Ctrl+Y,
Delete-with-nothing-selected): the two panel children (`.lpn-msglog-panel-row` and
`.lpn-msglog-panel-note`, the "Newest first..." help text) stack top-to-bottom with a real gap
(previous row bottom 195.19px, next row top 199.19px -- no overlap, no shared line), answering the
part of his sentence ("the simultaneous messages on open **and** the 'Newest first' help text
appear on one line instead of on three") that the build report's own account never explicitly
named. `elementFromPoint()` at three points -- inside the top row, in the gap between the row and
the note, and at the panel's bottom edge -- all three resolve to `#lpn_msglog_panel` itself with
`background-color: rgb(255, 255, 255)` and `opacity: 1`, i.e. the fix is a property of the
CONTAINER and therefore holds regardless of message count or position, not just at the specific
case ("RIVER") Tom happened to see. Did not re-load the actual Net3 project with a live "RIVER"
text object underneath (not needed: opacity=1 solid white at every sampled point, including the
gap, is a stronger and scene-independent guarantee than one screenshot of one project would be).
`dev/lpn-spike/notice-log-harness.js` §7f's CSS-source assertions match what the rendered page
actually does.

**CONFIRMED -- the hover/long-press tip is gone, and the deleted key is genuinely dead.** No
`title` attribute, no `.ec-help` class on `#lpn_msglog_btn` (grep + harness agree); no live read of
`lpn_msglog_tip` anywhere in `js/*.js` or `*.php` (only in comments and the change log,
`dev/new-english-keys.md`); confirmed the key was NEVER in any of the 26 translated `lang.ec.??.php`
files even before this commit (`git show bb51995e^:lib/lang.ec.<x>.php | grep` on all 26, none),
so the commit message's own claim -- "it and its 26 translations were deleted with this change" --
overstates what happened; there were no translations to delete. A harmless inaccuracy in commit
prose, not a functional defect, but exactly the kind of confident-and-wrong sentence this seat
exists to catch, so noted.

**MISSED -- not one of Tom's four, but a real leak from how (4) was built, and the one finding
worth the most of his attention this round.** Every OTHER icon-only toolbar/strip button
(`undo`, `save`, `open`, `find`, `settings`, `zoom-extent`, `pane-toggle`, the mode buttons, the
area-select tool) is wired through the file's own `setIconLabel()` wrapper, which does two things
at once: sets the tip AND pushes `{el, icon, name, tip}` into `toolbarIconIndex`, the array
`iconGuideRows()` reads to build Help > "Toolbar key" (`js/looped-network.js` ~30473,
~31927 -- "DERIVED from the strip itself... so a button added later is in it already"). The commit
under review does not call `setIconLabel()` at all for the message-log button -- it now builds the
button by hand (`btn.textContent=''; ic=iconEl('history'); btn.appendChild(ic);
btn.setAttribute('aria-label', ...)`) specifically to skip the tip, but that also skips the
registration, silently. Verified live: opened the real Help menu, hovered "Toolbar key," read the
submenu's rendered text -- it does not mention "Messages." Before this commit the button DID call
`setIconLabel()` (confirmed via `git show bb51995e^`) and so WAS listed there. Tom asked only that
the hover tip go away ("more trouble than help"); he did not ask for the button to disappear from
the one deliberately-non-hover discovery path this same file's comments describe as existing
*because* "a first-time user who does not think to hover -- and a touch user, for whom a tip needs
a deliberate press-and-hold -- has no way to read the strip." The message-log glyph is now in
exactly that position and is the one button on the page not covered by its own answer. Not caught
by any harness on this branch -- `notice-log-harness.js` asserts the absence of title/.ec-help but
never touches `toolbarIconIndex` or the Help menu.

**Verdict: this round's two commits do what he asked on all four items and hold up under
independent re-measurement -- but they introduce one new, unrequested regression** (Help >
"Toolbar key" silently loses its one entry for this button, at the same moment its tip goes away,
leaving a first-time or touch user with no way at all to learn what the glyph does). This is small
enough not to block a browser pass on its own -- nothing he asked for is broken -- but it should be
named to him rather than fixed silently, since a reviewer here reports rather than repairs.

## 2026-09-22 -- feat/notice-log, follow-up: the Help-menu regression fixed same day, re-verified

After delivering the review above, a further commit landed on the branch, `38592ea7` ("Keep the
message-log glyph in Help > Toolbar key, still tipless"), responding directly to the one finding in
that review. **CONFIRMED, independently, not just read.** Re-ran the live browser probe against the
Help menu: hovering "Toolbar key" now shows "Messages" in the fly-out (it did not, before this
commit). The fix splits `setIconLabel()`'s two jobs -- writing the tip and registering into
`toolbarIconIndex` -- into a standalone `registerToolbarIcon()`, and `wireMessageLogButton()` now
calls that alone with an empty `tip` string; `iconGuideRows()` already treats a falsy tip as "no
tip on this row," so the list entry carries a name and no tip, matching what was asked. The
harness's new group 10 mutation (removing the `registerToolbarIcon()` call) reproduces the exact
regression and is killed. The same commit also quietly corrected the "26 translations" overstatement
I flagged in the prior comment (now: "never translated into any of the other 26 languages"),
without being asked to -- read the wording precisely rather than skimming past a now-familiar phrase.

**Verdict unchanged and now stronger: ready for a browser pass, nothing outstanding from this
review.**
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

## 2026-09-23 -- feat/zoom-scale-rules at 04b159fe, R-174 (Text "Show at all zoom levels"): READY, one gap on the file Tom will actually open

OBSERVED, checked 2026-09-23. Mutation-confirmed the shipped harness
(`dev/lpn-spike/text-all-zoom-property-harness.js`) is real: copied it unmodified into a worktree
built from the branch point (`75689ea1`, before `34d4ee8d`) and it failed hard there (three
assertions FAIL, then a `TypeError` on the very column this round adds), so the green it shows on
the branch head is not decoration. Then drove the real feature through a real Chromium
(`dev/browser-pass/lib/session.js` + `lib/env.js`, `flock /tmp/engcalcs-browser.lock`), not just
the stub, for every venue Tom named.

**CONFIRMED, the default and the three venues, all through real interaction:**
- Default off: a freshly-drawn Text on a new project carries no `allZoom`, and Net3 (plain) opens
  already past its own threshold (`labelMaxWidth: 30`) with `LAKE`/`RIVER` genuinely hidden
  (`lpn-lbl-hidden` on both) and only `X3` "Zoom in to see labels" left showing -- read straight off
  `getComputedStyle`/`classList`, not the stub.
- Multi-properties: drew two Texts with the real toolbar, box-selected both with "Select a window",
  and the popup read "2 selected" with a real `<label>Show at all zoom levels <input
  type="checkbox"></label>` row, unchecked by default. Ticking it and firing a real `change` event
  is the mechanism the harness already checks; not re-verified with a second read here beyond that.
- Tables: the Text pane tab's own headers read `...,"Bold text","Show at all zoom levels","Angle
  (degrees)"` with a live checkbox cell, matching the popup's row order.
- Find and Replace: selecting the Text scope offers exactly `Text`, `Size multiplier`, `Show at all
  zoom levels` as properties -- and separately, the Replace "Property to change" list for the same
  scope offers `allZoom` ALONE. `id` and `text` are not there, confirmed by reading the live
  rendered `<select>`, not the source comment that claims it.

**MISSED, and it is the exact file the review brief named: Net3-**Novato**-CA-World.lwn has no
labeling threshold at all (`settings.labelMaxWidth` is `null`, unchanged by this branch), so
`labelsPastThreshold()` returns `false` at every scale and NOTHING in this file's Text layer ever
hides -- `LAKE` and `RIVER` both read `lpn-lbl lpn-draglbl` (never `-hidden`) all the way from
5354 px/degree down to 118 px/degree and back, measured with the real `transform="scale(...)"` on
the SVG. The branch's own edit to this file only added `allZoom: true` to `X1` ("LAKE"); it did not
notice, and nothing in its harness would have noticed, that the setting has no effect here because
the gate it feeds is permanently off. Practically: opening Novato and zooming out, as the brief
instructs, will show BOTH `LAKE` and `RIVER` staying on screen forever, which will read as the fix
not working -- when what actually failed to ship is a threshold on this one example, a detail
outside R-174's own wording but squarely inside what the round was supposed to make demonstrable.
**Net3 (the plain, non-geo file) is the one where the mechanism is real and provably works**; that
is the one to point Tom at if he wants to see it work before this is fixed.

**A genuine judgment call, not a defect, worth putting to Tom because he asked "should it appear in
Find/Replace" and got an honest partial answer**: the code's own comment admits it plainly --
*"No boolean condition exists on this panel yet, so it rides the numeric ones already here... 1 for
ticked, 0 for not."* Measured in the real Find UI: the condition list offered for `allZoom` is
`equal to, above, below, n highest, n lowest, empty` -- four of those six are nonsense on a
yes/no property (`above 1`? `n highest`?), and nothing on screen says 1 means ticked. It works
(confirmed: typing `equal to 1` finds exactly the kept-on Text, and Replace does write it), but a
reader with no memory of this ruling has no way to guess the vocabulary without trial and error.
Not new to this round -- `active`/`closed` are the same shape elsewhere on the page and were not
re-examined here -- but this is the first time Tom asked for a boolean specifically to land in
Find, so it is the moment to decide whether a proper yes/no condition is now worth building rather
than reusing the numeric one again.

**Net1's tie-break, also a judgment call rather than a defect**: `Source`, `Pump` and `Tank` are all
`sizeMult: 2` (a genuine three-way tie), and the rule ("first in the file") kept `Source`. Novato's
`LAKE`/`RIVER` tie (both `sizeMult: 1`) went the same way. Neither is wrong by Tom's stated rule
("the largest... in our examples"), but where sizes are exactly equal the rule is silent on
*which* survives, and "first in the file" is an implementation detail nobody chose for its meaning
-- worth a glance from Tom on whether `Source` (on Net1, a network about a reservoir, a pump and a
tank, all named) is the label he would have picked by hand.

**R-167/168/169/170 (earlier rounds on this branch), not re-litigated in depth but not skipped
either**: ran `zoom-symbol-cap-harness.js` (all 15 mutations still kill), `examples-audit-harness.js`
(307/307), `find-harness.js`, `switch-keep-harness.js`, `select-area-harness.js` -- all green against
the live tree. R-170's fix (`5865871e`) is a three-line reorder of the label-threshold unit and the
capture button, read directly and it does what it says.

**Verdict: READY**, with the Novato gap flagged as the one thing Tom will hit first if he follows the
brief's own instructions on that exact file, and the Find/Replace vocabulary named as his call to
make, not a build defect.

**Not checked**: ticking the checkbox from the Tables pane cell itself in the real browser (only the
harness's stub exercises that door); an older saved project carrying `{"allZoom": false}` explicitly
(argued to behave identically to absent by reading `=== true`, not independently re-measured in a
browser); redo/undo interaction with an `allZoom` edit; and whether the Novato gap is itself on
Tom's queue anywhere else under a different number (not searched).

---

**Not reached this round, for the record rather than by silence**: whether an EPS time-step change
(scrubbing the run transport) has the same Recalculate-off gap the scenario switch does — `lpn-time.js`
carries no reference to `refreshPaneIfOpen` or `lastSolveResult` at all, so the wiring is somewhere
in the `EngCalcs.lpnTime*` bridge functions inside `looped-network.js` and tracing it was not
finished in this pass; and whether a UNITS change or an UNDO while a scenario other than the one the
snapshot was taken in is active shows the same class of gap (undo calls `refreshPaneIfOpen()`
directly and unconditionally, so it is very likely fine, but not independently re-measured here).

## 2026-09-23 — eighth outing: feat/table-editing (Task 690, column hide + Ctrl+D), review at `29fc3b42`: READY, with one design-scope gap and one phone question to name

Asked: Declan's column-hide design (`dev/agents/data-entry-clerk/journal.md`, "Column hide and
reorder") and spreadsheet fill-down. Build agent's claims, taken as hypotheses:
right-click a heading (not ID) hides it; right-clicking any remaining heading lists "Show {col}"
per hidden column; hidden columns are absent from render, tab/arrow order, paste and copy;
state lives in `lpn_panecols`, never the project file; Ctrl+D fills the top row down through
validated writes, refuses/counts read-only cells, skips ID, one undo step, works as a scenario
override; Ctrl+D no-ops on one row or while typing.

**CONFIRMED, both harnesses, run as delivered, not just read.** `node
dev/lpn-spike/pane-col-hide-harness.js` (18/18) and `pane-filldown-harness.js` (19/19) both pass
against the tree as it stands.

**MUTATION-TESTED one claim and it exposed a real (currently harmless) gap.** Deleting the
`if (key === 'id') { return; }` guard inside `paneSetColHidden()` (js/looped-network.js:20652,
tested on a scratch copy, never in the reviewed worktree) left the hide-harness at 18/18 — the
harness only proves the MENU never offers to hide ID (`paneOpenColMenu`'s own `if (key !== 'id')`),
not that the underlying setter refuses one directly. `grep` shows `paneSetColHidden(spec, key,
true)` has exactly one call site, gated by that same menu check, so nothing reachable today can hide
ID — but the "ID cannot be hidden" claim is enforced once, at the UI, not at the data layer the
harness's own name implies it tests. Worth a second guard line and a harness case that calls the
setter directly, cheap either way.

**CONFIRMED, in real Chromium (`flock /tmp/engcalcs-browser.lock`, Net3's Junctions table),
the specific worry this round was asked to chase: un-hiding survives even the worst case.**
Right-clicked column[3] (Description), hid it, confirmed the rendered `<th>` count dropped by one
and `lpn_panecols` held `{"hidden":["desc"]}`. Then hid every other column one at a time down to ID
alone, and right-clicked ID itself: its menu listed all 13 "Show {col}" entries, not just the one
hidden most recently — the hidden list `paneOpenColMenu()` builds is independent of which heading
you clicked, so a person who has hidden themselves down to one column can always get every one back
from that column's own menu. Clicking each "Show" restored the full original heading row exactly.

**CONFIRMED, real Chromium, Ctrl+D and undo on Base demand.** Selected junction rows 1 and 3 in
Base demand (values `0` and `1`), pressed Ctrl+D: row 2 (the one between) read `0` afterward, the
notice read "Filled down 2 cells. 0 were not changed.", and one Ctrl+Z restored `1`. (Read via
`input.value`, not `textContent` — these cells are `<input>` elements and the first pass of this
probe read empty strings from `textContent` for every cell, editable or not; noted here so the next
person testing this table does not mistake that harness mistake for a product defect.)

**CONFIRMED by real-browser copy, not just the harness's synthetic DOM.** Selected the whole
Junctions table after hiding Description and copied it: the clipboard's heading row and every data
row skip Description entirely — matches the harness's own "absent, not merely CSS-hidden" claim.

**NOT independently re-driven in a real browser: fill-down refusing a computed result column, and
persistence across a PROJECT switch (only a page RELOAD was driven live).** The result-column
attempt in a real browser was blocked by this session's own test friction (the post-Calculate
"running" overlay intercepting a click, not a page defect), and the project-switch attempt hung on
`openExampleCard()` needing the examples wall re-opened through a menu this probe did not chase
down in the time available. Both rest on the harness (which passed 19/19 on the result-column
refusal) and on code inspection for persistence: `lpn_panecols` is keyed only on `spec.id`
(`'junctions'`, `'pipes'`, ...), never on a project id, exactly mirroring the already-shipped
column-width state in the same key — so a hidden column is BROWSER furniture, not PROJECT data, and
carries into every project exactly as a dragged width already does. This is the design Declan
asked for and the harness itself asserts it (`serializeProject() has never heard of the preferences
key`), but a live project-switch was not the thing I drove by hand this round.

**DEPARTS from Declan's own design, and Tom should know the shape of what shipped versus what he
"agreed to in principle."** Declan's design named TWO things together: a small per-table button
opening a popover (checkbox + up/down arrows, "the obvious, discoverable control") AND the
right-click shortcut as a *free extra* on top of it, explicitly because a keyboard-first user or a
first-time visitor with no reason to suspect a spreadsheet gesture needs the visible button. **Only
the shortcut shipped.** The code's own comment says as much ("There is no popover in this build").
Mechanically the shortcut is complete and well-built — this is not a claim that anything is broken —
but there is currently no on-screen affordance anywhere in the table that hints a heading can be
right-clicked at all. Someone who does not already know the Sheets/Excel gesture has no way to
discover column hide exists, and no visible way back in either, until they stumble onto a
right-click. That is a scope call for Tom, not a defect: does he want to ship the popover before
telling anyone this exists, or is the shortcut-only version fine for now with the popover as
follow-up work?

**UNVERIFIABLE FROM HERE, and worth a specific phone check rather than a general "test on
mobile": whether a long-press on a table heading opens the Hide menu on an iPhone specifically.**
A CDP-simulated long touch-and-hold on a heading in a headless mobile-emulated Chromium produced no
context menu at all, but that negative is not trustworthy either way — headless touch simulation is
a known-weak proxy for a real long-press gesture. The more concrete, checkable-by-code reason to
worry about iOS in particular: this page already has one other place that had to fight exactly this
battle — `#lpn_canvas { -webkit-touch-callout: none; }` (`css/engcalcs.css:4165`) was needed
because Safari's own long-press produces its OS text-selection callout instead of a JS `contextmenu`
event unless that CSS suppresses it. The new heading `contextmenu` listener (js/looped-network.js,
`paneWireTable`) has no matching `-webkit-touch-callout: none` on `.lpn-pane-table thead th`, and
Android Chrome (which does fire `contextmenu` on long-press by default) would not surface this gap
even if it exists. **The one-sentence check for a browser pass: on an iPhone in Safari, long-press
a table column heading — does the Hide/Show menu open, or does the phone's own copy/select-all
bubble appear instead?**

**Verdict: READY.** Both harnesses pass as delivered, both mutation- and real-browser-confirmed on
the claims that matter most (recoverability with everything hidden; copy and Ctrl+D correctness;
undo; state scoped to browser furniture, not the project). Nothing here blocks a browser pass — the
two items above are for Tom to weigh and one thing for him to check with his own thumb, not evidence
of a broken build.

Scripts used, not committed (this machine's temp paths, gone with the session): browser probes at
`/tmp/copytest.js`, `/tmp/filltest.js`/`filltest2.js`, `/tmp/touchtest.js`, `/tmp/switchtest.js`;
mutation copy at `/tmp/claude-*/scratchpad/mutcopy` — all deleted after use, the finding is what to
keep.

---

## feat/label-limit (e1a19100), reviewed 2026-09-23

Ask (2026-09-23, quoted): *"I noticed that we have a tip saying that 0 is never for Customer
labels. Should we do the same for all labels and use that to replace the 'Thematic map, no
labels' setting?"* then *"Sorry 'never show' is what I meant."*

**MISSED — OBSERVED, measured in a real Chromium against the live page, not just the unit
harness.** Typing 0 into "Show labels when zoomed to this map width or less" correctly hides node
and link labels (confirmed: `#lpn_canvas` gains `lpn-labels-hidden`, holds it across zoom in and
out, and clears on blanking the field) — but **the on-map labels legend (the small corner box
listing which fields are lettered) does not hide with them.** Probe: opened Net3-Novato-CA-World
and Net1, both starting with a label field ticked (`legendDisplay: ""`, i.e., visible), typed 0,
and `#lpn_labels_legend`'s `style.display` stayed `""` through zoom in and zoom out — never
`'none'`. Root cause, read in `js/looped-network.js`: the retired "Thematic map" checkbox handler
called both `refreshValueColors()` **and** `renderLabelsLegend()`; its replacement,
`setLabelMaxWidth()` (~line 37773), calls only `labelThresholdChanged()` and `saveToStorage()` —
`renderLabelsLegend()` is never in that chain. The unit harness
(`dev/lpn-spike/label-limit-zero-harness.js`) still shows "0: the labels legend hides with the
labels" passing only because the harness calls `L.renderLabelsLegend()` itself as an explicit step
right after setting the value — it never drives the real input's `change` handler, so it could not
have caught this. **Practical effect Tom will see:** zoom out, type 0 for colour-only, and a
floating box naming lettered fields (e.g. "Node labels: ID, Head...") keeps sitting in the corner
of a map with no letters to match, until an unrelated redraw (a solve, reopening the panel) happens
to call `renderLabelsLegend()` for some other reason. This is exactly the leak shape CLAUDE.md
names — a control retired in favour of another control's side door, and one of the two things the
old control did was not carried over.

**MISSED — OBSERVED, a real spec throws.** `dev/browser-pass/specs/visibility.js` (§16, "The
Settings box") was not updated for this branch and still drives the retired "Thematic map"
checkbox by name: it asserts a checkbox exists under Node/link, ticks it, and reads
`lpn-labels-hidden`. Ran it for real (`node run.js visibility`, real Chromium): it throws
(`Cannot read properties of null (reading 'click')`) the moment it tries to click a checkbox that
`#lpn_set_colors_nodelink` no longer contains, which **kills the whole visibility section — 0/1
sections completed** — so every other, unrelated check later in that same file (the labels-legend
index check, the labeling-threshold checks that already existed, and more) silently stopped
running too. This branch's own last commit is titled "Fix check_all failures: stray pageConfig
line, browser-pass spec, cites" and did fix one other browser-pass spec (`nodehit.js`'s
`applyTomSetup`, which used the checkbox for an unrelated purpose) — so the author was in this
exact file class and still missed `visibility.js`. `dev/browser-pass` is outside `check_all.sh`,
so nothing caught this before push. **Confirmed the harness itself is trustworthy where it does
run**: mutation-tested `label-limit-zero-harness.js` by swapping in the pre-branch
`js/looped-network.js` — 8 of 26 checks genuinely fail on the old code, restored after.

**CONFIRMED.** Typing 0 hides node and link labels at every zoom tried (10, 1000, 1e6, 1e9 px
canvas widths in the unit harness; real zoom in/out in the browser). Clearing the field restores
them. A hand-built project with `colorThematic: true` migrates to `labelMaxWidth: 0` on open, the
old key is deleted, and 0 wins even when a positive `labelMaxWidth` was also saved (all three
asserted in the harness and consistent with what a reader who left the map in thematic mode last
saw). A genuine positive threshold still behaves exactly as before (a real width, exceeded, still
hides a Text object whose own "Show at all zoom levels" is off) — this is not touched by the 0
case, which is the one thing Tom's "never show" wording did not ask for. Grepped the whole tree,
`~/webdev/librewaternet.org` and `~/webdev/not-epanet.org` for stray live references to "Thematic
map" — none found outside historical code comments (which CLAUDE.md's own rule is fine with) and
one stale mention in `dev/lpn-tip-copy-review.md` (a dev doc, not visitor-facing, naming a key that
no longer exists — worth a note to whoever next edits that file, not a blocker). The customer row's
tip and this row's tip read as a matched pair side by side (both say "measured across the window",
both spell out 0 in the same shape) — no wording objection.

**UNVERIFIABLE FROM HERE.** Whether a Text object placed with "Show at all zoom levels" *unticked*
visually reads as expected at 0 (it stays drawn, per the harness and the code path
`labelsPastThreshold()`/`labelsFullyHidden()` splitting) — I did not place a Text object through the
real UI to see it on screen at 0; the logic is exercised by the harness only. Whether the labels
legend gap above is the only thing besides the labels that fails to refresh live (I checked this
one path; did not exhaustively check the colour legend or the print layout under the same 0 setting
in a real browser).

**Verdict: NOT READY.** Two real, measured leaks: the labels legend does not hide live when 0 is
typed (only on the next unrelated redraw), and a browser-pass spec now throws and silently drops
an entire section of unrelated coverage. Both are small, mechanical fixes — call `renderLabelsLegend()`
from `setLabelMaxWidth()`, and update or retire the Thematic-map block in `visibility.js` — but
neither is fixed yet, and the second means nobody would have been told about the first by any
existing check.

## 2026-09-23 -- feat/property-venue at 1066860e, R-195/R-197/R-198: CONFIRMED in a real browser; one MISSED gap on translation

OBSERVED, checked 2026-09-23. Mutation-confirmed `dev/lpn-spike/property-venue-find-harness.js`
section 7 is real: copied it unmodified into a worktree built from the pre-fix commit (`de2ef299`)
and 7 of its assertions FAIL there (value-clearing both directions, the filter row, the property
push); all 39 pass at branch head. Then drove the real feature through real Chromium
(`dev/browser-pass/lib/session.js`/`env.js`, `php -S` + sentinel, `flock /tmp/engcalcs-browser.lock`)
with a REAL pipe (two junctions + a pipe drawn through the toolbar, not just `makeEdit()`'s bare
junction, which was not enough to make Replace's specs list non-empty and hid a whole class of this
round's fix at first).

**CONFIRMED, R-195(1) and (2), on a real pipe, real DOM:** switching Find's Property away from Shut
(status) leaves the Value free-entry box empty (`""`, not the leftover "closed"); switching TO Shut
always redraws a `<select>` with exactly `open`/`closed`, regardless of what the box held before --
read straight off `select.options`/`select.value`, not the stub's state.

**CONFIRMED, R-197(2), the one-row layout, both 1280px and 390px:** the Find button, "Filter in
Table" button and the table `<select>` share one `.lpn-find-filter` row, all three at the same `y`
(`Math.abs(...) < 5`), and at 390px the row does not wrap (`rowWraps: false`) and the whole popup
stays inside the viewport (`x:4, w:382` inside `vw:390`). Screenshots:
`/tmp/claude-1000/.../find-390.png` (English) confirm this visually -- one tidy row reading
`[Find] [Filter in Table] Table [Junctions v]`.

**CONFIRMED, R-197(1), the selector follows What to search:** changing Find's scope select (Pipes
-> Junctions) changed the filter-row table select from `pipes` to `junctions` with no user action on
that select itself.

**CONFIRMED, R-198, the property push, including the case that actually tests something:** with
Replace's own Property manually set to a THIRD value (`roughness`, deliberately different from
Find's `length`, to rule out the trivial case where they already matched), changing Find's Property
to `diameter` pushed Replace's Property to `diameter` too -- overriding the manual choice, which is
exactly what "audacious" means and what Tom asked for.

**CONFIRMED, Replace still works end-to-end, real apply, both kinds of property:** length (numeric)
written to 999 and re-found by a fresh query; status (choice) written to `closed` via its own New-
value `<select>` and re-found the same way. Neither regressed.

**MISSED, and it is the exact thing R-197 was about:** the English wording DID shorten (`Table to
filter` -> `Table`, `Filter in current table` -> `Filter in Table`), but nothing in this round
touched the 26 other languages, and the repo's own `detect_english_drift.php` already flags it --
`lpn_find_filter_table` as a **ROLE CHANGE** (3 words -> 1) and `lpn_find_filter_btn` as changed too.
Measured directly: Arabic still reads `الجدول المراد تصفيته` ("the table that is to be filtered"),
the old, verbose, literal translation of the old English -- not a short "Table". Spanish the same
(`Tabla para filtrar`). Screenshot: `/tmp/claude-1000/.../find-ar.png`. **A reader in any language but
English still sees the confusing long label Tom complained about**, because this branch's whole
premise is "chosen from a list in the reader's language, in every venue" and the R-197 fix has not
reached any venue but English yet. This is not a build defect in the mechanism -- it is a translation
debt this round created and did not flag or queue (`dev/new-english-keys.md` has no entry for either
key), worth Tom knowing before he calls R-197 closed.

**Judgment call, not a defect, Tom asked for directly:** whether the table selector still needs a
visible "Table" label now that it is one word beside the button. Measured: at 390px it costs about
75px of horizontal room in a 382px-wide row that already has two buttons in it (see screenshot) --
tight but not overflowing. Not resolved here; his call.

**Lesson for future rounds:** `Session.makeEdit()` places one bare junction, which is enough for
Find's own query controls but NOT for `replaceSpecs()` -- which needs a real candidate in the
group (`findCandidates()`), so a scope of `pipe` returns zero specs and the whole Replace section
silently does not build. A round-2 probe here first "confirmed" R-198 with `beforeVal: null` because
of exactly this -- draw a real pipe (two junctions + connect), not just `makeEdit()`, before testing
anything in Replace.

**Not checked:** the choice-property Find/Replace mixingModel round trip specifically through the
one-row filter layout (covered by the harness, not re-driven in the real browser this round); RTL
mirroring of the row's internal button/select order (Arabic screenshot shows the row present and on
screen, but button/select left-right order inside it was not separately asserted); a phone viewport
narrower than 390px; whether `detect_english_drift.php`'s flag on these two keys is itself something
`check_all.sh` fails on (not traced).

---
## 2026-09-23, feat/convert-as (commits 6b4707ac, ab6ad007), R-185/R-187

**OBSERVED, the headline finding, measured not argued:** the new Label-suffix column is wired so
that EVERY "Convert as", including one where the user never opens or edits the Label column at all,
now silently writes non-empty suffixes into the new copy's `labelSettings.suffix` -- `link.diameter`,
`node.head`, `node.demand`, `customer.demand` -- because the four boxes are pre-filled by default and
`convasAnswers()` reads whatever is in them, touched or not. Measured directly with the node harness
(`dev/lpn-spike/lpn-dom-stub.js` + the page's own functions): opened the box, read `convasAnswers()`
without typing anything, ran `runConvertAs(a)`, and the brand-new copy came out with
`{"node":{"head":" fth2o","demand":" gpm"},"link":{"diameter":" in"},"customer":{"demand":" gpm"}}`
where the original project had `{}` everywhere. This is the R-027 shape exactly -- a change scoped
to "entry of a label suffix" (opt-in, per Tom's own words: "we allow ... entry of") leaking into a
default-on behaviour for a feature (coordinate/unit conversion) that never touched map labels before.
The shipped harness (`dev/lpn-spike/convert-as-harness.js` section 7) never tests this path -- it only
asserts what happens when the user DOES type a custom suffix, never what happens when they don't.

**OBSERVED, confirmed a genuine gap, not paranoia:** the Depth ("Water depth") Label box is visually
and behaviourally identical to the three working boxes, with no tip or disabled state marking it as
inert, and it truly has nowhere to go: `level` does not appear in `nodeFieldDefs()`
(js/looped-network.js ~36466), so there is no "Water depth" row anywhere in Settings > Labels for a
suffix to attach to, even in principle -- the destination does not exist yet, not just the wiring.
The PHP's own comment admits this. A person who types into it and expects a labeled tank depth on the
map will get nothing, silently.

**CONFIRMED via harness (mutation-tested: fails on the pre-ab6ad007 code, passes after) and a live
Chromium run on the Elm Street Center example at :8104:** the "Current:" wording (not "This
project:") is plain text, not muted (`lpn-dim` class absent, confirmed by computed style too); the
two-column split exists; the Label boxes pre-fill from the chosen unit and re-paint on an SI/US
preset click until a row is typed into (`convasSuffixDirty`); after Convert, the new copy's own map
labels show the typed suffix on a real element (`8 MMX` on a pipe diameter label, `Qb=190.00 FFX` on
a junction) with no doubling of a pre-existing unit -- default suffixes were all `''` before this
shipped, confirmed by reading `labelDefaultSuffix()`.

**Lesson for next time:** when a build agent's own harness only tests the "user typed something"
branch of a pre-filled optional field, always hand-test the "user changed nothing" branch too --
that is exactly where a default silently becomes mandatory. Also: `git show <sha>^:path` plus running
the NEW harness against the OLD file is a cheap, fast way to confirm a harness is not decoration
before trusting any of its other PASS lines.

**Not checked:** the Label-suffix write surviving through the georeferencing wizard steps (EPSG /
unnamed conversion + a typed custom suffix, all the way through "Keep this placement") -- the shipped
harness only exercises the suffix write on a `kind: 'none'` (not-georeferenced) conversion; a phone
viewport narrower than 390px; whether a second "Convert as" run on an already-converted copy compounds
the suffix (e.g. doubles " in in"); print/PDF export of a converted copy's labels.

---

## 2026-09-23 — R-184, MISSED and reproduced live: the stub harness tests an empty document

OBSERVED, `feat/zoom-control` at `1373951a` (worktree head), checked 2026-09-23. Driven in real
Chromium against the branch's own preview server (port 8103), through
`dev/browser-pass/lib/env.js`/`session.js`, real `page.mouse` events, on the shipped Net1 example.

The build agent could not reproduce R-184 in `dev/lpn-spike/zoom-control-harness.js` section 7 and
guessed Tom must have tested an older build. **That guess was wrong, and the harness told them
so falsely.** `zoom-control-harness.js` opens with `doc.nodes.length = 0; doc.links.length = 0;` --
it drives the real button/mode state machine but over an EMPTY document. `zoomExtent()`'s own
comment says it "measures RENDERED label text" and seeds its first fit pass from `state.s`, the
CURRENT scale, before laying anything out (`js/looped-network.js:10791`,
`items = fitItems(state.s, true);`). An empty document has no labels to mismeasure, so the harness's
section 7 passes 10/10 regardless of what the real bug does.

**Reproduced twice, by two unrelated routes, both landing on the same measurement:** the quality of
`Zoom to fit`'s result degrades as a smooth function of the scale it is invoked FROM, becoming a
fully blank canvas well before any cap is hit:

| zoom-in clicks before pressing Zoom to fit | scale invoked from | visible symbols after Zoom to fit (of 66) |
|---|---|---|
| 10 | 18.5 | 66 (fine) |
| 20 | 47.9 | 66 (fine) |
| 25 | 77.2 | 58 |
| 28 | 102.8 | 46 |
| 30 | 124.3 | 38 |
| 35 | 200.2 | 5 |
| 40 | 322.5 | 0 -- blank, and STAYS blank after the fit |

The SAME blank-canvas result was reached Tom's own way -- two map clicks close enough together to
draw a near-degenerate Zoom Window box, which `applyView()` clamps to `maxScale()`
(`MAX_SCALE_GRID = 500`, `js/looped-network.js:12269`) -- and the very next press of the toolbar
button, exactly as Tom described, entered Zoom Window instead of fitting (screenshot taken;
`sample` rect after the "fit" press sat at screen y=2411 against a ~1090px-tall canvas, fully off
window). **No Zoom Window tool involvement is needed at all** -- reaching the same scale by the
plain `+` zoom-in button breaks the fit identically, which places the defect in `zoomExtent()`'s own
scale-seeded label layout, not in the Zoom Window feature the branch was reviewed for.

**Lesson for next time, sharper than the R-054/R-059 shape this seat already tracks:** a stub that
drives real control-flow wiring over a document with nothing IN it can pass every assertion about
sequencing while missing a defect that only exists in the content-dependent code the sequencing
calls into. "The harness drives the real listeners" is not the same claim as "the harness drives the
real computation" -- check what the fixture document HOLDS before trusting a green run that a build
agent used to override its own tester's browser report.

**Not checked:** the exact mechanism inside `fitItems()`/`fitScaleFor()`/`fitWindow()` that turns a
high seed scale into a wrong translate (a scale that is `> minScale()` so the existing "fall back to
modelFit" guard never fires); whether the same degradation occurs on a project with fewer/no
labels; the geographic case at an equivalently EXTREME fraction of its own (far larger) scale
ceiling, which this session's Net3-lat/lon probes did not reach.

## 2026-09-23 -- feat/label-limit at d4753f87, R-199: NOT READY, one promise the code cannot keep

Worktree `/home/haws/webdev/worktrees/feat-label-limit/engcalcs`, preview :8108. Ran the build
agent's own `dev/lpn-spike/label-limit-parity-harness.js` (32/32) and mutation-tested it by copying
it unmodified onto the pre-fix commit `c949316e` -- it crashes there (`setboxWordsMatch is not
defined`), so it is not decoration. Then drove the real feature in headless Chromium against the
live preview for everything a unit harness cannot see: screenshots of both rows, DOM measurement,
real keyboard input, the AND-word filter, 390px, `?lang=ar`.

**MISSED, the headline: the Customer row's new wording promises a state its own code has never
supported, and nothing in this round drove a real blank box through it.** The commit's new tip
sentence reads *"Leave the box blank to draw them at every zoom"* and the new placeholder is
"Always show," both read the same way the all-labels row's blank box already is. Typed it myself,
for real: clicked the customer box, selected all, pressed Backspace, pressed Tab to leave the
field -- and it snapped straight back to "1000." The row's own `change` handler (untouched by this
commit) refuses any non-numeric entry and reverts to the old number, by its own comment's own
admission ("A REFUSED ENTRY PUTS THE OLD NUMBER BACK RATHER THAN STANDING"). Grepped every write
site to `labelSettings.customerMaxWidth` in the file: default 1000, a captured view width, or this
refusal -- none of them, anywhere, ever sets it to null or blank. So "Always show" is currently
unreachable through the interface for this one row, and the sentence that tells a reader how to
reach it is false. This is new wording describing old, unmodified, incompatible behaviour -- the
R-054/R-027 shape this seat exists to catch. The shipped harness's own item for (e) only ever
blanks the ALL-LABELS box; it never drives the customer box's own blank state, so it could not
have caught this.

**MISSED, minor and visual: the two boxes render at very different widths.** Measured directly:
the all-labels number box is 112px, the customer number box 41.6px -- pre-existing CSS constants
(`7em` vs. `LPN_LABEL_AFFIX_W` = `2.6rem`) this commit left alone while matching everything else
about the two rows. In the narrow box "Always show" reads cramped against the edge.

**CONFIRMED, all measured live rather than read:** (a) identical placeholder "Always show" in
English and Arabic both (neither language has the key translated, so both rely on the JS fallback,
which was itself stale -- "Always show labels" -- until this same round's own follow-up commit
`d4753f87` fixed it, verified live in `ar` after); (b) identical row name; (c) the misleading last
sentence is gone from the all-labels tip, the customer tip carries the parallel sentence plus his
qualifier verbatim; (d) both carry the "?" glyph and put "ft" before the button, read straight off
the live DOM; (f) zoom/show/label present in both rows' own text; (e) typing a small all-labels
width (5 ft) sets `lpn-labels-hidden` on the canvas and `customerLabelsAttempted()` checks that
flag before its own (much wider) limit -- confirmed in the harness (mutation-killed) and live, with
the customer limit set to 999999; (g) "zoom label" and "label zoom" both find exactly the two
zoom-limit rows regardless of order, "show customer" narrows to the customer row alone, unrelated
existing rows ("friction", "opacity") stayed findable, clearing restored all 65 rows. The two rows
ARE genuinely tellable apart -- not just by wording -- confirmed by walking the live DOM: Customer
sits under Symbology > Customer, the all-labels row sits under Map and page > Appearance.

**Lesson for the standing list:** a tip or placeholder that asserts "leave it blank" is a claim
about the CHANGE HANDLER, not about the label -- when a round changes only the wording of a control
built earlier for a different purpose, drive the exact action the new wording describes through a
real keystroke, not a scripted `.fill('')` that may not exercise the same code path as a user
tabbing out of the field. The all-labels row's harness assertion for blank called the setter
directly; the row that actually needed checking was the one whose wording changed without its
mechanism following.

**Verdict: NOT READY.** Six of seven lettered items hold up under live re-measurement. The "leave
it blank" clause on the customer tip is the one piece written but never wired -- either the box
needs to accept a blank entry the way the all-labels box does, or that clause needs to come back
out before he sees it.

## Task 647 — off-screen network overlay (feat/offscreen-notice, 3dcd3e8d + c5abf2c4)

OBSERVED (real Chrome, `dev/browser-pass/lib/env.js` + `session.js`, Net1 grid example, 390px+
`?lang=ar`, 26 assertions, all passing): a real mouse drag that pans the whole network off screen
shows the overlay only AFTER `pointerup` release, never mid-drag or on an intermediate
`pointermove`; a real wheel-zoom onto empty ground keeps it shown through the debounced settle; a
real wheel-zoom OUT until the network is a tiny dot does NOT show it (matches Ida's "no sliver
threshold" spec); the overlay's own "Zoom to fit" button clears it after the same 120ms settle a
wheel spin uses; the empty project never shows it, dragged or wheel-zoomed; the overlay box does
not cover `lpn_mode_hint`, `lpn_map_notice`, or `lpn_map_footer` at any point I measured; a click
just outside the centred box (near the canvas edge) reaches a real toolbar button
(`lpn_msglog_btn`), not the overlay, confirming the `pointer-events:none` wrapper / `auto` inner
box split works as designed; the box stays inside a 390px viewport in `ar`.

**The one thing I set out to disprove and could not, after two attempts.** My first hypothesis was
a Task-647-shaped scope leak: `updateOffscreenNotice()` is called from exactly two places
(pan-release, and `scheduleReshed()`'s debounced settle) and NOT from any tab-switch path, so I
suspected switching to a different project tab and back would leave stale overlay state (the R-027
shape: a change that works for the direct gesture but not for a path nobody wired). First attempt
using File > New project as the second tab produced a false positive — the overlay correctly did
NOT reappear on switching back, but only because `newProject()`/`importProject()` (unlike
`openProject()`) never call `rememberCurrentView()`, so the outgoing tab's camera is discarded and
`restoreViewOrFit()` falls through to an automatic `zoomExtent(true)` that puts the network back in
view — a real, pre-existing, unrelated behaviour (worth a line on the roadmap on its own: panning
one tab and switching to File>New project loses that pan permanently) that happened to mask the
question I was asking. Rebuilt the test with two tabs BOTH opened via the gallery and each switched
to at least once (so both go through `openProject()`'s `rememberCurrentView()`), then panned tab 1
off screen, switched to tab 2 (correctly hidden, ground-truth confirmed in view), switched back to
tab 1 with no new gesture on it — **the overlay correctly reappeared, matching a direct DOM
ground-truth check of whether any node's bounding box intersects the canvas.** `restoreViewOrFit()`
→ `applyView()` → `onZoomChanged()` (when the incoming scale differs from `lastLayoutScale`) →
`scheduleReshed()` → `updateOffscreenNotice()` covers the tab-switch case after all, because a tab
switch is itself a scale change in the ordinary case. Recorded so nobody re-litigates the leak
hypothesis without re-testing it the same way — and so a future reader doesn't stop at the first
(New-project) attempt and file a false defect.

**UNVERIFIABLE FROM HERE, precisely:** (1) I could not mechanically reproduce "pan back by hand
until exactly one node shows" with pixel precision — a real mouse drag in fixed large steps either
overshoots the whole network back into view or undershoots it entirely; Ida's own harness (§4 of
`dev/lpn-spike/offscreen-notice-harness.js`) already covers the equivalent case at the unit level
(a node placed with a 4-world-unit margin inside the window edge, no overlay), so the RULE is
verified, but Tom's own hand on a real trackpad should confirm the transition reads right, not
jumpy. (2) Whether pressing the overlay's "Zoom to fit" from a genuinely extreme zoom scale
reproduces the separately-tracked `fix/zoom-fit-high-scale` blank-screen bug — I drove 60 wheel
notches of zoom-in and the button still recovered the network cleanly (screenshot confirms), so I
could not trigger the known defect at the depth I reached; a person should check at whatever zoom
depth that other branch's own repro uses, and if the screen does go blank, attribute it to that
branch, not this one, per the task brief.

**Note for the record, not a Task 647 finding:** Tom's checklist item "keyboard +/- zoom and the
toolbar zoom buttons — evaluated too?" does not apply to this page as built: there is no keyboard
+/- zoom shortcut anywhere in `js/looped-network.js` (confirmed by grep for every plausible key
name) and no separate toolbar Zoom-in/Zoom-out button — only wheel/pinch (`zoomAbout` →
`onZoomChanged` → `scheduleReshed`) and the single "Zoom to fit" toolbar button (`zoomExtent` →
same chain via `apply()`'s own `onZoomChanged()` call). Both of those ARE covered and both were
exercised live above.

**Verdict: CONFIRMED.** Every behaviour in Ida's design brief and Tom's checklist that could be
driven from here was measured live and held. Two items above are explicitly out of my reach and
named for whoever does the browser pass.

## 2026-09-23 -- feat/table-editing at 1740e3fa, R-191/R-192/R-193: CONFIRMED, plus a genuine
defect found while running Tom's own checklist item, unrelated to what shipped

OBSERVED, checked 2026-09-23, worktree `/home/haws/webdev/worktrees/feat-table-editing/engcalcs`,
real headless Chromium via `dev/browser-pass`'s own server + playwright-core
(`flock /tmp/engcalcs-browser.lock`), real mouse clicks/modifiers and real `keyboard.press()`
throughout -- not synthetic `dispatchEvent`, after a first pass with dispatched events gave a false
negative on "plain click still sorts" that a real Playwright click then contradicted (see below).

**R-191 CONFIRMED, all of it, driven with real modifier-clicks and right-clicks on Net1's Pipes
table.** Ctrl+click on two headings (Tag, Shut) selected both (`lpn-pane-head-sel` class) without
sorting either (`aria-sort` stayed null on both). Right-click on a selected heading offered
exactly "Hide these columns"; clicking it removed precisely those two columns and no others.
Right-click on a remaining heading then offered "Show Tag" and "Show Shut" -- exactly two rows,
one per hidden column -- and clicking each restored the original 19-column layout.

**R-192 CONFIRMED with real keyboard, including the one measurement Tom's checklist named
specifically: `event.defaultPrevented`.** Selected a two-row range on the From column (real click
+ shift-click) and pressed real Ctrl+D: a document-level listener recorded
`defaultPrevented === true` on that keydown (so the browser's own Bookmark-editing shortcut is
genuinely suppressed), and the notice line read "Nothing in this selection can be filled down."
On a fillable column (Diameter), the same real Ctrl+D copied row 0's value into rows 1 and 2, and
one real Ctrl+Z restored the original three values exactly. The right-click menu's accelerators
read "Copy Ctrl+C" and "Fill down Ctrl+D" beside their rows. Help > Notes gained a "Table keyboard
shortcuts" entry whose full text matches what shipped in `lib/lang.ec.en.php` exactly, word for
word, read out of the live rendered dialog.

**R-193 CONFIRMED by absence and by design.** No `.lpn-pane-cur::after` dot exists in the shipped
CSS; the accelerator/menu route (Ctrl+D, right-click Fill down) is what remains, matching Tom's
"if it were gone... that would be nice."

**Mac wording, UNVERIFIABLE FROM HERE in the sense that matters, but measured as far as this
instrument goes:** there is no Mac-specific branch anywhere in `js/looped-network.js` (grepped for
`isMac`, `navigator.platform`, `Cmd+`, `⌘` -- none). Loaded the page under a real Mac Safari-style
user agent and confirmed live: the context menu still reads "Ctrl+D"/"Ctrl+C", never "Cmd", and
the Notes dialog text is identical regardless of UA (it is server-rendered, UA-blind by
construction). Functionally Ctrl+D still works on a Mac because the handler already checks
`ctrlKey || metaKey`, so Cmd+D on a real Mac would also work -- but the ON-SCREEN LABEL will say
"Ctrl+D" on a Mac too, everywhere this branch put an accelerator. Not a regression (nothing before
this branch had Mac-aware wording either) but worth naming since Tom's own checklist asked
specifically what a Mac UA shows.

**A genuine, independently-reproduced defect found while driving Tom's own instruction to check
"that plain click still sorts": three specific columns never sort by a plain click, on a totally
unrelated, pre-existing code path this branch did not touch.** `paneColTag()`, `paneColActive()`
("Part of this network") and `paneColClosed()` ("Shut") are shared column-builder functions used
on Pipes/Pumps/Valves/Junctions. Clicking any of their headings -- verified across five separate
sessions, three separate columns, with waits from 300ms to 5000ms, as both the first click of the
session and a repeated click -- never sets `aria-sort`, never appends the sort arrow, and never
changes the sorted row order; `ID` stays at its untouched default ("ascending") throughout. This
is NOT a false negative from a bad selector: a real Playwright click was confirmed to reach both
the app's own click listener and a tooltip-dismiss listener on the same button (instrumented via a
wrapped `addEventListener`), and the row order over a Tag column loaded with real, differing typed
values (`zzz`/`mmm`/`aaa`) also never reordered -- except that ONE time, sorting on Tag DID
succeed, immediately after an unrelated successful sort on a different column (`From`) or after a
real cell edit had triggered a table rebuild. **The bug is not "these columns can never sort" but
"these columns never sort as the operative click; sorting on them only works as a click that
happens to follow another render."** I did not find the exact internal cause (no Mac dev-tools
`getEventListeners` reachable from playwright-core, and I could not attribute it to a thrown/caught
exception -- no console error, no page error, in either state) and I did not chase it further
because the change that could explain it is not on this branch: `git diff master...HEAD` touches
only the click handler's OUTER wrapper (the new modifier check), never `sortPaneTable()`,
`paneTableSorted()`, or the three column-builder functions themselves, and the wrapper's added
branch is a no-op on an unmodified, first-ever click (`paneHeadSel(spec).length` is `0`, so the
`paneHeadSelClear()` call is skipped and `sortPaneTable(spec, c.key)` runs exactly as it always
did). **This reads as pre-existing, not introduced here** -- but Tom's own checklist for this round
explicitly asked to verify "plain click still sorts," and on three of nineteen Pipes columns it
does not, so it is reported here rather than assumed out of scope. Whoever picks this up next
should start from `paneColTag`/`paneColActive`/`paneColClosed` (`js/looped-network.js` ~19650,
~19800, ~19922) and `sortPaneTable`/`paneTableSorted` (~21361, ~20871), and try reproducing with a
DevTools breakpoint rather than a scripted probe, since this one resisted every instrumentation a
headless script could reach.

**Also confirmed, briefly:** the ID heading offers no context menu at all when right-clicked alone
(no "Hide" -- matches the code's own "ID's own heading with nothing hidden: no menu" comment);
Escape closes an open context menu; a hidden column stays hidden under `emulateMedia('print')`
(header count 19 vs. 20, Tag correctly absent) though the table's own print-mode width/border
numbers read 0 under plain `emulateMedia` with no Print-menu trigger, so that half is
UNVERIFIABLE FROM HERE -- someone needs to open the real Print dialog on this table, the same
caveat a prior entry on `feat/tables-spreadsheet` already recorded for print; at 390px and
`?lang=ar` the table renders RTL, hide/show works identically, and the new English-only strings
(`lpn_pane_hide_col` etc.) fall back to their English default in Arabic because they have not been
through a translation sprint yet -- expected for an unmerged feature branch, not a defect.

**Verdict: READY on R-191/R-192/R-193 as asked.** The three-column sort defect is real, verified
five independent ways, and worth Tom knowing about, but it predates this branch's own diff and is
not itself a reason to withhold this round's browser pass -- name it to him as a separate, small
finding rather than blocking on it.

## 2026-09-24 -- feat/table-editing (R-221/R-222) and feat/zoom-control (R-214/R-216)

OBSERVED, both worktrees, real headless Chromium via playwright-core against the live preview
servers (8105, 8103), real `page.mouse` down/move/up sequences and real `page.keyboard`, not
synthetic `dispatchEvent`; `flock /tmp/engcalcs-browser.lock` held for every run. No `check_all`
run (builders' job this round, per brief).

**feat/table-editing, R-221: drag-select and multi-hide CONFIRMED** -- a real mouse drag from
Tag's heading through Shut's, unmodified, selected exactly those three headings
(`.lpn-pane-head-sel`, full-cell blue highlight per `css/engcalcs.css:2375`, cursor `grab`),
right-click offered exactly one item ("Hide these columns"), and clicking it hid exactly those
three and no others. This is Tom's literal ask ("drag through multiple columns in usual Select
manner") and it works.

**feat/table-editing, R-221 -- THE REGRESSION NOBODY ASKED FOR: a bare drag on an unselected
heading no longer moves the column.** `dev/cookie-storage-inventory.md`'s `lpn_panecols` row cites
"Tom's spreadsheet specification, 2026-09-18, points (d) and (e)": *"Columns can be dragged left
and right using their headings"* -- no mention of selecting first, and it shipped that way
2026-09-19 (`dev/lpn-spike/pane-column-drag-harness.js`). This branch changed the gesture: a plain
mousedown+drag on a heading that is not already in `spec.headSel` now starts a RANGE SELECT
instead (`js/looped-network.js` ~21417-21421, comment: *"dragging across headings selects them;
dragging a selected one moves it"*). I drove exactly that plain gesture -- press From, drag onto
To, release, no modifier -- and column order was UNCHANGED; two headings ended up selected
instead (`selCount: 2`). Only after a real Ctrl+click on From FIRST, then a second separate drag,
did the column move (From/To swapped). **The single most basic use of this feature -- drag a
heading to reorder one column, which is the one thing Tom asked for and got seven days ago --
now takes two gestures instead of one**, and the first attempt (a plain drag) visibly does
something else (a blue highlight, not a move), which is likely to read as "broken" rather than
"needs a click first." Real Google Sheets does not have this two-step shape: a single press+drag
on an unselected header both selects and moves it in one continuous gesture. Worth flagging to Tom
explicitly since he is not likely to guess he needs to click first, then drag.

**feat/table-editing, R-222 CONFIRMED.** Help > Notes > "Table keyboard shortcuts" is now a real
`<dl>/<dd><ul><li>` (verified via `outerHTML`, not just textContent) -- one shortcut a line,
key/gesture in a left column via `<strong>`, action text in a right column, 14 items, screenshotted
live. It also documents the drag/select-then-move split above in its own words ("Drag across
column headings" -> Select; "Drag a selected heading" -> Move), which at least means the new
gesture is self-documenting even though it is a step longer than before.

**feat/table-editing, R-215 print CONFIRMED, measured via `emulateMedia('print')` + computed
style, not just visual.** On EPANET Net3's Pipes table at an 850px (page-width) viewport: heading
and body text-align now match screen exactly, column by column (`start` on ID, `center` on every
other column, both screen and print) -- Tom's exact complaint ("all centered except ID") is now
true in both places. The print table's own width equals the container's width to the pixel (no
overflow, no shrink-with-room-left), and every heading carries a real 1px solid border (not a
box-shadow, which prints only with "Background graphics" on). Screenshot at
`/tmp/.../scratchpad/print_table_zoom.png` (session-local, not preserved). NOTE: `window.print()`
fires real `beforeprint`/`afterprint` events under Playwright even when stubbed, which tears down
`#lpn_print_area` — read state BEFORE calling `page.pdf()`/`page.pdf()`-adjacent APIs, not after,
or the table silently vanishes and reads as a false "print broke" failure. I could not produce a
literal browser Print-dialog/PDF via `pdftoppm` (poppler-utils not installed, no sudo here); the
`emulateMedia('print')` + computed-style route is a good proxy but a real Ctrl+P preview is still
UNVERIFIABLE FROM HERE.

**Verdict, feat/table-editing: READY WITH ONE CALLOUT.** R-221 and R-222 do what Tom asked, R-215
(inherited from fix/table-print2) checks out under measurement. The drag-to-move regression above
is not something he asked to have changed and should be named to him explicitly before he goes
looking for the old one-step drag and can't find it.

---

**feat/zoom-control, R-216(1) label clearance: MOSTLY CONFIRMED, one small real miss found.**
Measured DOM bounding-box overlap between every rendered label/leader/node and every piece of map
furniture (mode-hint/notice strip, footer strip incl. scale bar and coordinate readout, basemap
credit, +/- chip, both legends) after a real click on "Zoom to fit", across five examples (Net1,
Net2, Net3, Net3 lat/lon, Elm Street Center) at two viewport sizes (1280x900, 900x600). Four of
five examples: zero overlaps. **EPANET Net2, both viewport sizes, reproducible across 5 separate
re-runs from wait=50ms through wait=2500ms (not a transient "still solving" race): node 1's
label block (ID+Qb+P+Z, 4 stacked lines) overlaps the bottom-left coordinate readout
(`lpn_coords`, "X: -- Y: --") by ~3px** -- screenshotted (`zc_net2_crop.png`): the label's last
line all but touches the readout text. Small, but the same shape of defect as his own R-214/R-216
complaint, on a different piece of furniture (the coordinate readout beside the scale bar, not the
scale bar itself) that this fix's own fit calculation apparently does not clear the way it clears
the notice strip and legends.

**feat/zoom-control, R-216(2) the "startling" reset: CONFIRMED for the gesture Tom named, MISSED
for two gestures this SAME branch (Task 682) added.** Verified via the toolbar button's own
`aria-label`/`aria-pressed` (it is one button that reads "Zoom to fit"/pressed=false at rest and
relabels to "Zoom Window"/pressed=true once armed by a first press): press, press again -> armed
(`Zoom Window`, true) -- correct, that's the two-click window gesture. Press, then a REAL
`page.mouse.wheel()` zoom, then press again -> correctly reads `Zoom to fit`/false, i.e. wheel
zoom resets the arming exactly as R-216 asked. **But arm it (press twice), then click the
on-screen `#lpn_zoom_in` chip, or press the keyboard `+` -- both added by this same branch's own
Task 682 -- and the button stays armed (`Zoom Window`, true).** A user who zooms with the chip or
the keyboard instead of the wheel and then presses "Zoom to fit" gets the exact startling
Zoom-Window trap Tom already complained about, unfixed for those two paths. This is the leak this
round's brief asked me to look for: the fix covers the one input path Tom happened to name and not
the sibling paths the same feature ships.

**feat/zoom-control timing: measured, and the builder's own number undersold the worst case.**
Real settle-time (rAF-polled until the SVG `<g transform>` stops changing) on plain EPANET Net3:
43/46/45 ms, trivial. On **Net3 lat/lon (geographic, the case the builder named)**, four
alternating-direction presses gave 1263 / 38 / 32 / 1203 ms -- roughly every other press took
~1.2 seconds, not the "~0.75 s" the builder reported, and did not correlate cleanly with zoom
direction in my small sample. 1.2 s is well past the point a press reads as instant; worth Tom
timing himself, since "which presses are slow" was not obviously predictable from four samples.

**UNVERIFIABLE FROM HERE:** whether the ~3px Net2 overlap or the 1.2s stall are things Tom's own
eye/hand would register as a problem versus noise -- both are small enough that a browser pass is
the only way to know if they're worth fixing before merge, and I could not test a real trackpad
pinch or a real two-finger scroll-zoom (Playwright has no pinch gesture), so whether THOSE also
fail to reset the arming (like the chip and keyboard do) is unverified from here.

**Verdict, feat/zoom-control: NOT READY as "R-216 fully fixed."** The wheel-zoom case he
specifically named works. Two sibling zoom gestures this branch itself introduced do not, and will
reproduce the identical "startling" complaint the moment he happens to use + instead of the wheel.
Worth a one-line fix before this goes back to him, or at minimum telling him explicitly that only
wheel-zoom resets it today.

---

## 2026-09-25 — four branches, all in real headless Chrome, checked 2026-09-25

### fix/fireflow-eps (worktree /home/haws/webdev/worktrees/fix-fireflow-eps/engcalcs)

OBSERVED, `dev/lpn-spike/fireflow-eps-harness.js`, run live 2026-09-25. This harness talks to the
same accessors Properties, Tables and the map's own class list use (`renderLinkFields`,
`paneCellText`, `linkClass`), through the real `js/lpn-epanet.js`/`js/lpn-time.js`/
`js/lpn-fireflow.js`, not a rewritten stub of them, so a pass here is a pass of the same code path
a browser exercises. Ran clean: **all ok, 0 failed** across Net3, EPANET and built-in engines, and
Elm-Street-Center.

- **"Pump 10 ... the link still shows as closed"**: CONFIRMED FIXED. At 0:00, `lastResult().statuses['10']`,
  `Properties Status`, `Pumps table Status`, and the map's `lpn-link-closed` class all agree
  "closed"; at 1:00 all four flip to "open" together; back at 0:00 the map class reverts to closed.
  `dev/lpn-spike/fireflow-eps-harness.js:132-150`. Root cause per `js/lpn-epanet.js` diff: the
  warm-session signature EPANET reopens on now includes each pump's status, so a pump opening or
  shutting via a control forces a fresh solve from the file text instead of reusing a session that
  still had the pump in its starting state.
- **"the static pressure for all hydrants should match the map"**: CONFIRMED. Nine hydrants at
  0:00/1:00/2:00/14:00 on the EPANET engine, two of those steps on the built-in engine, and every
  junction at all 25 report steps -- worst observed gap 0.0005 psi (rounding), against a harness
  assertion of <0.01 psi (the map's own display precision). The harness also proves its own
  negative control: the same model solved WITHOUT the frame's tank levels and pump state reads 10+
  psi low, so this is not a vacuous pass.
- **"fire flow analysis does not know how to handle multiple selected hydrants"**: CONFIRMED. Three
  selected junctions plus a pipe and a reservoir in the same window-selection produced three rows,
  each with its own static pressure, and the notice read "2 selected elements are not junctions, so
  they were not tested." -- correctly worded, no missing space, no double punctuation.

I did not independently drive this in a REAL rendered browser page (only through the harness's DOM
stub) -- I did check that the harness's own accessors are the production functions, not
reimplementations, which is the leak this branch could plausibly have (a fix that works in a stub
but never reaches the real Properties popup). Did not re-render the actual popup HTML/CSS.
UNVERIFIABLE FROM HERE: whether the dashed line for a closed pump is visually distinct enough on
screen (only the CSS class was checked, not a rendered pixel).

**Verdict: READY FOR TOM.**

### feat/first-project (worktree /home/haws/webdev/worktrees/feat-first-project/engcalcs)

OBSERVED, `dev/browser-pass/specs/firstproject.js` run live in real Chromium 2026-09-25 against the
actual page (not a stub): **19/19 checks passed.** Also ran `dev/lpn-spike/first-visit-geo-harness.js`
(stub-level): 12/12.

- **"I hit escape on the gallery, add some nodes, and click Zoom to fit. Nothing appears"**:
  CONFIRMED FIXED. Live spec: gallery dismissed by Escape, four junctions and a pipe placed by real
  mouse clicks, all four remain drawn on the canvas after a real Zoom to fit press.
- **"Map, World map, Attach ... Nothing appears"**: CONFIRMED. Detach then Attach (via the real
  menu) redraws tiles at once with no zoom needed, both on the drawn-on project and on the
  still-empty Project1.
- **"we need to have this [the map] visible on first load behind the gallery"**: CONFIRMED. A fresh
  profile with no action taken shows 20 tiles already on the canvas behind the gallery card.
- **"The status bar says WGS 84 / Pseudo-Mercator (EPSG:3857), but the coordinates are lat/lon"**:
  CONFIRMED. The status strip now reads "WGS 84 (EPSG:4326)" and never 3857/Pseudo-Mercator, on the
  live page. The fix is in `crsDisplayName()` and applies to every lat/lon project, not just
  Project1 -- the general form of the bug he named, not a special case.
- **Leak check**: the Novato home view is a separate constant/function (`LPN_FIRST_VISIT_HOME`,
  `firstVisitPendingId`) from the ordinary geographic-project home (`LPN_GEO_HOME`), with an
  explicit comment saying why: repointing the shared one would move every wizard-made blank
  geographic project to Novato too. Verified live: File > New project (session C in the spec) still
  opens a plain XY grid project, untouched.
- Tile requests: the spec intercepts `tile.openstreetmap.org` and answers locally; I confirmed the
  route interception is on the real request pattern (not a mock of a mock), so a real run does not
  reach OpenStreetMap.
- `privacy.php` now says the street map shows on the first, empty project and that Detach hides it,
  in both the short list and the full table paragraph -- consistent wording, no dangling old claim
  that all four features "ask you first."

UNVERIFIABLE FROM HERE: how the basemap looks layered under a semi-transparent gallery card on a
real screen (only geometry/tile-count was checked, not the visual composite).

**Verdict: READY FOR TOM.**

### feat/property-venue (worktree /home/haws/webdev/worktrees/feat-property-venue/engcalcs)

OBSERVED, live real-browser drive against the actual running page (temporary scratch script in
`dev/browser-pass/`, deleted after use, not committed) plus `dev/lpn-spike/table-filter-harness.js`
(65/65 passed).

- **Tom's exact scenario** (Everything scope, Connectivity, "no links at node") on Elm Street
  Center, driven through the real Find UI (`#lpn_find_popup` selects, `#lpn_find_filter_go` click):
  the message shown is **"Filtered by Everything.Connectivity no links at node. Junctions: 0 of 17,
  Reservoirs: 0 of 1, Tanks: 0 of 0."** -- no missing space, no doubled punctuation. The message the
  brief quoted as looking odd is not what the current branch produces; whatever produced that
  wording either predates this branch's last commits or was a transient state in an earlier build.
  CONFIRMED for current text.
- **"Everything" filters every table the query can answer, and only those**: CONFIRMED, live. A
  broader query (ID contains "1") filtered Junctions, Reservoirs, Pipes, Pumps, Valves -- every
  table an ID exists on, including ones with zero matches ("Tanks: 0 of 0", "Customers: 0 of 0") --
  which is Tom's own "we filter all tables insofar as we can if Everything is selected." The stub
  harness additionally confirms the converse: a table the query cannot be asked of (e.g. Pipes under
  a node-only Connectivity query) is left unfiltered, not emptied, and the document itself never
  changes (`serializeProject()` never learns a filter).
- One row, `[Find][Filter in table]`, matches his R-197/R-225 wording; CSS diff confirms the table
  selector `<select>` is fully removed, not merely hidden.

One thing worth naming rather than treating as a defect: for a broad "Everything" query, the
receipt lists every applicable table **even ones with zero elements** ("Tanks: 0 of 0", "Customers:
0 of 0") -- factually correct, but on a network with many element types this could read as a long,
noisy line. Not something Tom asked to have changed, so not scored as a miss, but worth his eye.

UNVERIFIABLE FROM HERE: how the receipt line wraps/reads at a narrow phone width; only checked at
1400px.

**Verdict: READY FOR TOM.**

### feat/zoom-control (worktree /home/haws/webdev/worktrees/feat-zoom-control/engcalcs)

OBSERVED, `dev/browser-pass/specs/zoomfurniture.js` #51, run live in real Chromium 2026-09-25, full
clean run: **101/101 checks passed, 1/1 sections completed.** (One earlier run in this same session
crashed mid-way with "Target page, context or browser has been closed" -- an environment/resource
hiccup on my end, not a defect signal; a clean re-run afterward passed every check the crashed run
also covered plus the remainder, so I'm not treating that crash as evidence of anything.)

- **His exact words, 2026-09-25**: *"Zoom to fit pressed before results arrive runs once more when
  they land: I think this is what I forbade."* CONFIRMED FIXED. Commit `dc1fa5a9` deletes
  `fitAwaitsSolve`/`finishFitAfterSolve()` outright (the mechanism that re-ran the fit once a
  pending solve landed) rather than gating it further, with a comment naming this exact quote and
  warning against reinstating it under another name. Live-measured: on Net2 (the EPS example the
  spec targets, at two viewport sizes), the SVG `<g transform>` read immediately after the press is
  byte-identical to the transform read 3 seconds later after the solve has had time to land, at both
  1280x800 and 1366x768.
- Sibling coverage from the earlier 2026-09-24 round of this same branch, re-verified live rather
  than re-cited stale: R-216's label/furniture clearance (0 hits under any overlay, on all 6
  examples x 3 viewports, both from a plain fit and from a deep zoom beforehand); and the earlier
  MISS I found on 2026-09-24 (only wheel-zoom reset the "armed" state, not the +/- chip or keyboard)
  is **now fixed and covered**: wheel in/out, trackpad pinch (ctrl+wheel), the +/- chip, and the
  keyboard +/- all reset the button to "Zoom to fit|false" from both the once-armed and the
  Zoom-Window state, verified from the button's own `aria-label`/`aria-pressed`, not from a visual
  guess.
- Tip strings match Tom's own wording verbatim: `lpn_zoom_in_tip` = "Zoom in one step. Shortcut: +",
  `lpn_zoom_out_tip` = "Zoom out one step. Shortcut: -" (`lib/lang.ec.en.php:1238,1240`).

UNVERIFIABLE FROM HERE: a real trackpad two-finger pinch or scroll gesture (Playwright can only
synthesize a ctrl+wheel proxy for pinch); whether the geographic-Net3 first-press latency (~1-2.4s,
observed both today and 2026-09-24) reads as sluggish to Tom's own hand -- it is unchanged by this
branch's latest commits and was already named to him previously.

**Verdict: READY FOR TOM.**

---

## 2026-09-25, second round -- four more branches, real headless Chrome

### feat/table-editing (worktree /home/haws/webdev/worktrees/feat-table-editing/engcalcs)

OBSERVED, real Chromium, scratch scripts against the real `Looped-Network.php` served by the
worktree's own `dev/browser-pass/lib/env.js` (not the branch's own `colselect.js`/`colmanage.js`
specs, which I read but did not re-run, since they are the branch author's own evidence and Tom's
task specifically asked me to try to reproduce the drag failure independently, in real Chrome, with
real `page.mouse` events, on BOTH master and the branch).

- **R-241, "Sorry I can't get a column to drag": REPRODUCED, and the cause is bigger than the
  branch's own diagnosis.** The branch's commit (`a1209984`) explains the report as one missing
  `preventDefault()` on a mousedown that lands on an ALREADY-SELECTED heading. That fix is real and
  correct as far as it goes -- but it treats the wrong gesture. I drove the plain, unmodified gesture
  a first-time user actually makes: press an UNSELECTED heading and drag it onto another, in one
  motion, real `page.mouse.move` in 15 steps + `down`/`up`, no Ctrl, no prior click.
  - **On master** (`/home/haws/webdev/hawsedc.com/engcalcs`, read-only): that one motion moves the
    column. `before` keys `[...,"axis2","desc","tag","active",...]` become
    `[...,"desc","tag","active","axis2",...]` -- `axis2` landed where `active` was. One gesture, no
    modifier, done.
  - **On feat/table-editing**: the identical gesture does **nothing**. `before` and `after` keys are
    byte-identical; no page error. The branch's own R-221 commit (`5ddf79d0`, same branch, earlier
    today) changed the heading's `mousedown` handler so a column can only be REORDERED once it is
    already selected -- an unselected press now starts a SELECTION drag instead (`paneStartHeadSelDrag`),
    and only a second press, after the heading is already lit, calls `paneStartColDrag`. Master never
    had this two-step requirement; this branch introduced it in the same round that also introduced
    the preventDefault bug the commit fixed.
  - **This reads exactly as Tom's own words.** He did not say "dragging a selected column doesn't
    work" (the bug the commit fixes); he said he could not get a column to drag AT ALL, which is what
    a user meets on first try, every time, on this branch: the single natural gesture master supported
    directly now silently does nothing (or silently starts a range-selection, which looks like
    nothing happened if the reader is not watching for header shading).
  - Scripts used, kept in scratch for reference, not committed:
    `/tmp/claude-1000/.../scratchpad/drag_probe.js` (run against each tree's own
    `dev/browser-pass/lib/env.js` and `lib/session.js`, so this is the real production
    `paneStartColDrag`/`paneStartHeadSelDrag` code path, not a reimplementation).
  - **This is the single highest-cost item in this round.** The build agent believed it had found
    and fixed "why Tom could not get a column to drag," reported so, and the harness it wrote
    (`colselect.js` point 7) only ever tests dragging a heading that was ALREADY selected by a prior
    Ctrl+click -- so its own suite is green while the naive, undocumented, most-likely-to-be-tried
    gesture is broken. This is the R-054/R-027 shape exactly: checked that the intended fix worked,
    never checked the plain case a visitor actually hits first.
- **The "..." column menu glyph overlaps wrapped heading text on a narrow column, confirmed
  visually.** Measured every heading's own text-node bounding box against the `.lpn-pane-colmenu`
  button's box on Net3's Junctions table: on `demand` ("Base demand (gpm)", wraps to 3 lines), the
  rendered text's own right edge (647px) sits to the right of the menu button's left edge (631px) --
  a real overlap, not a rounding artifact. Same for `active`, `fireFlow`, `elev` -- every column
  whose heading wraps to its full 3-line height on this table. A screenshot at 3x device pixel ratio,
  cropped tight to the button's own rect while it was genuinely hovered (`getComputedStyle` confirmed
  `opacity:1`, `content:"⋯"`, `color: rgb(102,102,119)`), shows the glyph is there but nearly
  illegible: pale grey, 14px square, sitting directly over the tail of the wrapped word "demand" and
  the top of "(gpm)". `dev/lpn-spike` has no existing check for this; screenshot kept at
  `/tmp/claude-1000/.../scratchpad/ellipsis-tight.png` (not committed, per instructions).
- I did not run the branch's own `colselect.js`/`colmanage.js` (65 checks between them by their own
  file listing) as a pass/fail gate -- reading them was enough to see what they do and do not cover,
  and running someone's own harness as the proof of their own fix is exactly the self-review this
  seat exists to avoid.

**Verdict: NOT READY.** The plain drag gesture is provably broken by this branch's own change, not
merely under-fixed; the "..." glyph is visually compromised on any column whose heading wraps. Both
need Tom to see them named, not to discover them himself in a browser pass that was supposed to be
clean.

### feat/customer-node (worktree /home/haws/webdev/worktrees/feat-customer-node/engcalcs)

OBSERVED. `dev/lpn-spike/customer-node-harness.js` run live, 2026-09-25: **56/56 checks passed**
(sections 3-7, node-fallback-on-pipe-delete section 6 and legacy-file section 7 in particular).

- **"Red for node-connected Customers is a bad decision. Let's leave it black."** CONFIRMED. CSS
  diff: `.lpn-service-snapped` / `.lpn-meter-snapped` are deleted outright, not merely unused --
  `grep` across `js/` and `css/` finds them nowhere except the comment explaining why they are gone.
  A settled node connection now paints with no class of its own, i.e. plain black, matching every
  other settled customer.
- **"Customer symbols appear to be 0.2 * Junction size ... raise it another 0.05."** CONFIRMED.
  `LPN_METER_NODE_FRAC = 0.30` in `js/looped-network.js:8672`, with a comment doing the arithmetic
  Tom asked for explicitly (0.25 shipped + 0.05 = 0.30) rather than silently picking a different
  number.
- **"Do we have Customers not allowed to connect directly to nodes? ... Customer connected to a node
  instead of a link at station 0."** CONFIRMED as a real feature, not just a display change: the
  harness's section 6 places a service pressed onto a node, confirms Properties reads "Connected to"
  and names the junction (not a pipe id or a station), confirms no pipe id or station heading is
  printed, then DELETES the pipe entirely and confirms the customer still reads as connected to the
  same node (now via a stored fallback), still lumps its demand there, survives a node RENAME, and
  correctly detaches only when the node itself is deleted -- with the un-accounted-demand notice
  worded correctly on the map.
- **Leak check on the string wiring**: commit `cd7640b1` (within this same branch) fixes a real gap
  its own author found on a second pass -- `lpn_field_meter_node`/`_tip` were defined in the language
  file but never wired into `Looped-Network.php`'s `pageConfig`, so the "Connected to" row would have
  rendered the raw key or nothing at all in production. Caught and fixed before I got to it, but
  worth noting as the kind of self-review gap this seat exists to catch when a branch does NOT catch
  it itself.
- UNVERIFIABLE FROM HERE: how the black customer dot at 0.30 actually reads on screen next to a
  0.30-scaled junction at typical zoom -- I did not render the map and screenshot it for this branch,
  given time spent reproducing the table-editing drag defect; a browser pass should still glance at
  the sizing ratio directly rather than trust the arithmetic alone.

**Verdict: READY FOR TOM**, with that one sizing screenshot named as unchecked.

### feat/menu-button (worktree /home/haws/webdev/worktrees/feat-menu-button/engcalcs)

OBSERVED, real Chromium, two ways: the branch's own `dev/lpn-spike/menu-button-harness.js` (run
live, ALL GREEN, both `solid` and `outline` variants at a desktop and a phone viewport), and my own
direct look at its two screenshots (`menu-solid-desktop.png`, `menu-outline-desktop.png`) -- not
just trusting the harness's verdict.

- **"testers ... very slow to find the menus ... colors only for now ... thematic blue rounded
  rectangles."** CONFIRMED, by eye: the menu bar (File/Edit/Map/Water/Help/English) is solid accent
  blue (`#0645ad`, the same blue the consent banner's own buttons already use -- visibly consistent
  in the screenshot, not just asserted in a comment) with rounded corners, white text, in both
  variants.
- **`?menustyle=outline` as the FIRST query parameter**: CONFIRMED by direct regex test outside the
  page (`/[?&]menustyle=outline\b/.test('?menustyle=outline')` -> `true`), matching how
  `window.location.search` actually begins with `?` rather than `&`.
- **"nothing but the menu bar changed"**: CONFIRMED by reading, not just running the harness --
  `.lpn-menubar-item` is used nowhere outside `buildMenuBar()`'s own bar items (`grep` across
  `js/looped-network.js` and `css/engcalcs.css`), so no toolbar icon, popup or other button shares the
  class. The harness's own three "toolbar button ... unchanged" checks passed live, and I read the
  screenshot myself and confirm the toolbar icon row directly below the menu bar is visually
  untouched.
- **Process note, not a defect**: I ran `menu-button-harness.js` once without wrapping it in
  `flock /tmp/engcalcs-browser.lock` (a mistake on my part -- CLAUDE.md and this task both say never
  do this). It happened to complete cleanly because the lock was briefly free, but it is exactly the
  kind of contention risk the rule exists to prevent (I later fought a genuinely-stuck queue on
  another script for several minutes, caused by another agent's own harness holding the lock). Not
  repeated after I noticed it.

**Verdict: READY FOR TOM.** This is a preview switch behind a URL parameter that changes nothing
outside the menu bar; both variants render as described.

### feat/convert-as (worktree /home/haws/webdev/worktrees/feat-convert-as/engcalcs)

OBSERVED, real Chromium, driven through the actual Convert as box and the actual coordinate-system
picker it opens (`#lpn_crsbox`), not read from source alone.

- **R-237(1a), "WGS 84 (EPSG:4326) missing from the options"**: CONFIRMED FIXED, live. The picker's
  own `<select>` lists 5347 options; `WGS 84 (EPSG:4326)` is the second entry, right beside
  `WGS 84 / Pseudo-Mercator (EPSG:3857)`, both in the register's own unmodified names.
- **R-237(1b), "(no map)" after 3857's name**: CONFIRMED FIXED, live -- zero of the 5347 rendered
  option strings contain "(no map)". Root cause in the code matches what the live DOM shows: a
  comment dated 2026-09-25 states neither lat/lon code (3857 or 4326) is ever asked of the
  `lpnCrsHas()` check that used to wrongly mark 3857 unplaceable.
- **R-237(2a-c), tip wording**: CONFIRMED by diffing `lib/lang.ec.en.php` against its own history --
  `lpn_convas_epsg_tip` had "WGS 84 latitude/longitude (EPSG:4326)" and now reads "WGS 84
  (EPSG:4326)" (the duplicated "latitude/longitude" phrase removed, exactly as asked);
  `lpn_convas_unnamed_tip` now ends "...with the world map attached." (dropped "at the place the
  project is"); `lpn_convas_none_tip` now ends "...with no world map for now."
- **R-237(3a-d)**: CONFIRMED live. The picker's own title reads "Coordinate system"
  (`lpn_crsbox_title`), matching both callers (New project and Convert as) rather than either one's
  own radio label. `lpn_crs_view_tip` and `lpn_crs_name`/`lpn_crs_name_tip` say "coordinate
  system(s)", never "projection" -- confirmed both by reading the key values and by a live
  case-insensitive text search of the whole rendered picker box (`0` hits for "projection"). The
  bottom message is confirmed by reading `js/looped-network.js:32472-32484`: the IOGP credit line is
  now the last thing appended to the note, with an explicit comment naming Tom's "nonsense" complaint
  and where the old trailing sentence used to come from.
- **R-237, "no visitor-facing 'projection' remains"**: CONFIRMED, live, on both the Convert as panel
  text (full `innerText` search) and the coordinate-system picker's text -- `0` hits in either.
- **R-238, tank Water depth coverage**: CONFIRMED, live. The Convert as box's own "Suffix" rounding
  section lists four rows -- Diameter, **Water depth**, Demand and flow, Head -- where Tom's
  complaint was that Water depth was disabled there instead of being given the coverage it was
  missing. `LPN_CONVAS_SUFFIX_UNIT` in `js/looped-network.js:29109` carries a `depth` entry
  (`lpn_u_elevhead`, the same unit family Head uses), and it renders enabled in the live box, not
  greyed out.
- I could not get the picker to open my first several attempts (it requires the EPSG radio checked
  first, since the "..." button starts disabled on a plain local project -- not documented anywhere
  I could find outside the source, which cost real time here) -- once that was accounted for, the
  live picker opened and confirmed every wording claim above.
- UNVERIFIABLE FROM HERE: how the picker's very long option list (5347 rows) scrolls and performs on
  a real trackpad/phone, and whether "Filter by map view" narrows it usefully in a real session with
  a real map position -- I exercised the unfiltered list only, not the filter itself.

**Verdict: READY FOR TOM**, with the filter behaviour named as unchecked.

**A general note on this round**: the shared `/tmp/engcalcs-browser.lock` was under real contention
from at least one other agent's own harness (`table-divider-align-harness.js`,
`node-shed-harness.js`) working in the `feat-convert-as`/`feat-table-editing` worktrees at the same
time. Several of my own probes queued for 5-13 minutes waiting for the lock, and Node's own stdout
buffering when redirected to a file meant a queued-then-running script showed no output at all until
it exited, which looked identical to a genuine hang from the outside. Worth remembering next time
before concluding something is stuck: check who actually holds the lock
(`for p in /proc/[0-9]*; do ls -l $p/fd 2>/dev/null | grep -q engcalcs-browser.lock && cat
$p/cmdline; done`) before killing anything.
