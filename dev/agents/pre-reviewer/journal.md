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
