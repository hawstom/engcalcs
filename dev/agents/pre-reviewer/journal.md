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
