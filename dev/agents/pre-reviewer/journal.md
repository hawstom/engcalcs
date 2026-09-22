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

## 2026-09-22 -- feat/label-gang-search (R-075, R-108, R-135..R-137), HEAD 019a5b0d

CITED: `node dev/lpn-spike/label-prefix-acceptance-harness.js` and
`node dev/lpn-spike/label-slide-harness.js`, run against this worktree unmodified. Real Chrome
via `dev/lpn-spike/browser-drive.js` (flocked, `?debug=perf`, `?debug=labels` unused), Net3 and
Net3-Novato-CA-World, fit/x2/x4 via synthetic wheel events on `#lpn_canvas`, the Settings box's ID
row `Before` input driven through its real `input` event. Screenshots under
`/tmp/perry-shots/`.

**R-075 -- OPEN, correctly, and this is the one that matters most.** Tom's own words: "without
moving or hiding any of the labels shown." Ceiling in the harness itself (not my number, the
build's own ratchet): Net3-World moved 10 / hidden 29 over the four zooms, Net3 moved 10 / hidden
22 -- NOT zero. Broken out by zoom, the fit view (what a project opens on) and 2x are where it
fails: Net3-World fit 5 moved / 18 hidden, x2 5/11; Net3 fit 7/16, x2 3/6. Only x4 and x8 are 0/0.
The queue entry (R-075's own sub-bullet, 1210139e) states this accurately and leaves it open. **No
overclaim here** -- flagging it as the top item for Tom because "4x and 8x 0/0" reads better than
the whole truth, and a build report that leads with that number without the fit-view number beside
it would be the R-054 shape. This report led with both.

**R-136/R-137 -- MARKED [x] "shipped" in `019a5b0d`, and the number he called out is not fixed.**
His words: "the top label of this descending gang is eventually gratuitously 20 text heights away
from its node" (R-136) and, on nodes 120/251/257, "A human would have slid the two labels at A
toward B" (R-137). Independently re-run `label-slide-harness.js`: at zoom x2 -- the zoom his own
screenshot was taken at -- node 251's leader is 28.0 -> 19.1 text heights. **19.1 is still
"gratuitously ~20," which is the exact number he named.** `dev/label-placement-algorithms.md`
itself says "still long" for this case. The x3 result (23.8 -> 4.8, 251 alone 1.0) is a genuine
fix, but it is a different zoom from the one he was looking at. Marking R-136/R-137 DONE reads as
"the thing you pointed at is fixed"; the thing he pointed at, at the zoom he pointed at it, is
19.1 text heights away, barely below his own complaint threshold. Recommend re-opening or
re-wording the queue entry to say "fixed at x3, still ~19h at x2" rather than shipped outright.

**Performance -- the slide pass itself costs real time, and nobody has said so where Tom would
see it.** Same harness, same run, its own printed numbers: adding `slideTowardAnchors()` moved the
content pass from 1731 ms to 4944 ms at x3 on Net3-World (+186%), and 2961 -> 3037 ms at x2 (+3%).
Tom asked twice in this round for performance to be the focus (R-076, and "we really should be
focusing on efficiency and performance," R-136). The prefix-acceptance harness's own layout-time
column also moves around 2-3x depending on prefix length and zoom, consistent with the "2-2.5x
master" figure in the build's report, but I could not independently confirm the master-side of that
ratio from a real browser: loading master (`https://hawsedc.local/engcalcs/Looped-Network.php`) via
the same localStorage-injection technique that works on the branch (port 8090) produced a blank
screenshot after fit+zoom, and I did not chase why (different origin/profile, or an ID-row/Settings
selector difference on master) given time. **UNVERIFIABLE FROM HERE: a human should open
`https://hawsedc.local/engcalcs/Looped-Network.php` and this branch side-by-side, load
Net3-Novato-CA-World in both, and time a wheel-zoom sequence with DevTools' Performance panel** --
that is the comparison the report's "~2-2.5x master" claim needs and I could not complete headless.

**Visual check, real Chrome, Net3-Novato-CA-World, default label fields (ID/Qb/H/P/Z), fit/x2/x4,
empty and `12345678` node-ID prefix.** No gross defect jumped out at fit or x4 (screenshots
`branch_novato_*_fit.png`, `*_z4.png`): labels sit beside their nodes, no label drawn on top of a
pipe symbol in the areas I looked at, no leader visibly crossing another leader at a wide angle.
One close-up crop of the dense SW cluster (`closeup_empty_z4b.png`, nodes 177/181/179/271/183) shows
several stacked labels close enough together that I cannot rule out sub-pixel touching from a
screenshot alone -- **UNVERIFIABLE FROM HERE at this resolution; a human zoomed into that exact
cluster should look for touching label boxes**, which is the one thing a screenshot at normal zoom
cannot settle. My own from-scratch overlap counter (`getBoundingClientRect()` on every SVG `<text>`)
produced too many hits to trust (99-385 pairs on 218-227 elements) to mean anything on a page that
stacks multi-line labels by design; I do not trust that instrument and did not build one that could
tell an intentional stack from a real collision in the time available, so I am not citing its
numbers as a finding.

**Not checked:** `check_all.sh` (told not to run it); the georeference/EPSG examples other than the
two named; whether `labelMaxWidth` has any merge-duplicate logic -- grepped, found none, single
declaration and three reads, looks clean; pan-only cost; touch/phone. Master-branch visual diff
(blank screenshot, see above).
