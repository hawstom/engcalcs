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
