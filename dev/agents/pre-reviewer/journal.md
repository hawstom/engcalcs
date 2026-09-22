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
