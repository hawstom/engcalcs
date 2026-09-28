# Label placement rules, round 2: DRAFT awaiting Tom's markup (2026-09-28)

**His principle, 2026-09-28:** *"your mistake is that 'Hold every label still' is a matter of
strategy, and we don't want to dictate strategy. [...] Rules for us: Don't dictate strategies.
Maybe hint, but don't dictate."* So every line below is sorted: **Rule** = an outcome the result
must meet; **Hint** = an idea offered, never required; **Ours** = our process, not given to builders.
When he has marked this up, fold it into `dev/label-placement-rules.md` Part A and change the bench
(`dev/lpn-spike/label-bench/`) so "unforced moves" counts only churn (R12).

## Goal
- G. Use convenient available space effectively, and drop properties, then labels, when all else fails. (Rule, unchanged)

## Never
- N1. No label overwrites a symbol or another label. (Rule)
- N3. No leader passes through another node's symbol. (Rule)
- N4. A hand-placed label stays where the user put it and is never hidden. (Rule)
- N5. No label overwrites a Text object. (Rule)

## Costs, worst first
Leader on leader; label on leader; label on pipe; leader on pipe; label on customer free. (Rule, order only)

## What the result looks like
- R1. Closer to home is better; distance is a cost that rises with every step. (was S1, now a cost, not a search order)
- R2. If there is no attractive space nearby, drop rather than travel; expect fuller labels as you zoom in. (his S3)
- R3. When space runs out, give up in this order: wholeness and nearness to home; wholeness even on a longer leader; everything beyond a single property, by drop order; the label itself. (his S4)
- R4. What is shown is counted across all labels, not one at a time: a leader may lengthen if that saves a neighbour's properties. (new: B's flaw)
- R5. A label hangs from its leader's end: the leader meets the label on the leader's side and the text is justified to that side, never centred on the leader. (new: his 184 screenshot)
- R6. Leaders are straight; one standard short hook is allowed; no shape invented for one label. (was H2)
- R7. A pipe label sits beside its pipe by default, not on it, and lies along the pipe when there is room. (new: A's flaw)
- R8. A label may be stacked or one line, whichever shows more. (replaces H1's "lazy" wording, which was strategy)
- R9. Customer labels give way first and easily; Text is user-placed and never gives way. (his W2)

## Time and change
- R10. Placement never slows a pan or zoom while it is under way. (the outcome half of old T1)
- R11. When zooming in frees room, dropped properties and hidden labels come back. (new: both failed)
- R12. No churn: a label does not move unless something it depends on changed and the move shows more or fixes a break. (replaces "hold still"; keeps Task 680 and R-075's intent)
- R13. The layout always reflects the current network, text and settings. (the outcome half of old T3)

## Hints (may use or ignore)
- H-a. Unwrapping a node label to one line often fits between pipes where a stack cannot. (A's strength)
- H-b. Hard thinking can wait for pauses and be cached across zooms. (was T2)
- H-c. A label that may grow can hang on its crowded side and grow toward open ground. (was S2, which was strategy)
- H-d. Nearby quadrants, open sectors, a box model of open space, a per-zoom lookup table, the ranked gap list.

## Ours, not given to the builders
Build order (node and pipe labels first, as one system); the pure-function interface and the bench;
the secret tests (`dev/lpn-spike/label-bench/judges/`); his numeric weights; the 15-degree angles.

## Open, needs him
1. Repeating pipe labels: should a long pipe carry its label more than once, and when?
2. R8: should one line be PREFERRED when it shows the same, or stay a hint (H-a)?
