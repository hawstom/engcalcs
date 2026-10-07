# Label placement, phase 2 plan: speed (2026-10-07)

**Builders must not read `dev/label-trials/`.** This is the judges' plan for phase 2. What goes to the
builders is phase 1's recipe and strategies (`phase-1-summary.md` §2-§3) and the brief in §5 below.

Tom, 2026-10-07: *"The next rainbow's end is speed. spot_prime hopes it can help somebody with speed.
And I hope that the speed phase may find great rules for pre-modeling (caching of the physical
model)."*

## 1. Why speed is the next prize

- **Three of the four round-7 placers stop on a clock** (450-700 ms). On a slower machine they show
  fewer values and a different layout. A faster placer shows its best layout on a phone, not only on
  jasmine.
- **A placer that finishes before its clock is deterministic, so it is stable.** The clock is why A
  and B moved labels between two identical runs in round 7, and why the round-7 placers move labels
  on a pan or an edit where production moves none (`placement-report-vs-production.md` §4). Speed
  buys stability.
- **The page blanks the labels from a zoom until `place()` answers** (R15). Every millisecond saved
  is a shorter blank.

## 2. Hypotheses (to pre-register in round 8's protocol)

**Pre-modelling: caching the physical model of label candidates.** The network's geometry does not
change between views; only the scale, the window and the text do. Angles between pipes at a node do
not change with zoom at all, and distances change by one factor.

- **P1. Scale-free wedges.** Each node's incident-pipe bearings and open arcs, computed once at
  project opening, replace the per-view arc work. Expected: a small saving per view, no change in
  layout.
- **P2. A static obstacle index in model space.** Nodes, pipes and symbols indexed once (a grid or
  k-d tree in model units), queried at any scale; only labels are inserted per view. Expected: the
  share of each view spent rebuilding obstacles (to be measured; the coarse raster is rebuilt per view
  today) goes to near zero.
- **P3. A zoom ladder laid out in idle time.** Lay out the whole network, not the window, at a few
  scales during idle time, and serve a pan at a cached scale from the cache. Production lays out the
  whole network and moved no label on a 10% pan in our test; a cached ladder would give a builder the
  same stillness and an instant pan. Cost to measure: whole-network time at 20,000 nodes.
- **P4. Incremental re-layout after an edit.** An edit changes one label's widths; re-place only the
  labels whose candidate ground meets its old or new boxes. Expected: an edit costs a few labels' work
  and moves only its neighbours.
- **P5. Tom's `text_size_largest_perfect_fit`** (`dev/label-placement-algorithms.md` §9c): one scale
  per network above which every label's smallest form fits at home. Above it, a fast path (no search,
  no eviction); below it, the full recipe. Expected: close zooms become nearly free.

**`spot_prime`** (Tom's sketch, strategy S7; never given a full try in phase 1):

- **S1. A tile-indexed `spot_prime` list replaces the dense rescue search.** Pre-computed patches of
  open ground (centroids and extreme boxes: tallest skinny, widest squat, biggest square) answer "where
  can the still-hidden labels go?" by lookup instead of by rays every 15 degrees. Expected: the rescue
  phase, the slowest part of the round-7 recipe in crowded cores, at least three times faster with no
  fewer labels.
- **S2. `box_est` with the stack ordered by angle** (S6) seats several needy labels in one patch with
  no crossing leaders. Expected: fewer leader crossings in crowded cores at equal labels shown.
- **S3. The list is built once per project and per ladder scale**, in model space, and survives pans.
  Expected: its cost is paid in idle time and does not show in the view time.

**Speed itself.**

- **T1. Converge, then stop; the clock is only a safety stop.** A placer that stops when a round of
  growth or rescue adds nothing, with the clock as a cap it rarely reaches, shows no fewer labels than
  round 7 and is deterministic on 90% of views or more.
- **T2. The anytime curve.** Labels and values shown at 50, 100, 200 and 450 ms budgets; the best
  placer is the one whose curve rises fastest, not the one with the most labels at an unlimited
  budget.

## 3. Measures

Time per view (median, 95th percentile, worst), **with the opening view's idle counted** (the cold
start round 7 hid); labels and values at fixed budgets (T2); the share of views where the placer
stopped before its clock; the stability metric of `vs-production/stability.js` (control, edit, pan);
and every round-7 measure, so no speed is bought with labels. A slow-machine run: the same scenes with
the CPU throttled four times, as a phone stand-in.

## 4. Round 8's fixes to the bench first (round 7 record, 2.8)

1. `room-check` refuses room under another label's leader and a leader through another label's text,
   as `room-held.js` does.
2. A pipe label's room exempts only its anchor point; a pipe label must sit beside its pipe.
3. `segHitsBox` shrinks by a fraction of the box (none for symbols under 6 px); tolerances stated in
   Part A §5.
4. R14's `alignedRoom` counts leaders as obstacles.
5. The opening view's time is reported with the idle included, or a cold view is scored separately.
6. Page furniture on one public scene and on the generated ones.
7. The README says `run.js` is one process; there is no worker option.
8. The public scenes re-extracted with the app's default drop order (Tom, 2026-10-07: never force the
   ID last).
9. Part B of the rules and §6 move into a judges-only file.
10. New: the stability sequence (`extract.js` spec `stab`) becomes a public bench score, so builders
    can see what a clock costs in stillness.

## 5. The brief, in one paragraph

Start from phase 1's recipe (it is the state of the art); keep its labels shown within a point; make
it fast. Pre-model what does not change between views; try `spot_prime` for the crowded cores; stop
when nothing improves, not when the clock runs out. Scored on time, the anytime curve, stability, and
everything round 7 scored.
