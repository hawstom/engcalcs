# Placer C: keep, show, grow, mend

`js/lpn-placer-c.js`, built clean-room against `dev/label-placement-rules.md` Part A (§1-§5) and
the bench contract. Run it with
`node dev/lpn-spike/label-bench/run.js --placer js/lpn-placer-c.js`.

## How it sees free space

Three layers, cheapest first.

1. **A raster of "certainly taken" cells.** The view is cut into 3 px squares. A square is marked
   while a symbol, a Text object or a placed label covers all of it. A candidate that would lie
   over a marked square is certainly illegal, and is thrown out without any geometry.
2. **Grids of the real obstacles.** Three uniform 36 px grids: the things that may never be
   covered (node, pump and valve symbols, Text objects); the things that may be crossed at a cost
   (pipes, flow arrows, Text callouts); and the labels and leaders placed so far in this view.
   The first two never change during a view, so what a candidate costs against them is worked
   out once and remembered.
3. **Per label, a list of places worth trying.** Round a node: the corners and sides of its
   symbol (the classic upper right, right, lower right, upper left and so on), the middle of each
   open sector between the pipes that meet there, and leaders of four standard lengths in each of
   those directions. Round a pipe: along the pipe on either side (as one line, turned to read
   along it), beside its middle horizontally, and on leaders from its middle. Each place has its
   own cost before anything is checked (upper right cheapest, then right, and so on; a leader
   costs by its length; a label not in its usual shape costs more than any leader, per R1). These
   lists depend only on the shape of the pipes at the owner, so they are kept across pans and
   zooms.

## How it chooses

Every candidate gets a cost: its own place cost, plus what it covers, in Tom's order (a leader
crossing a leader is dearest, then a label on a leader, a label on a pipe, a leader across a
pipe; a customer costs nothing). A candidate that would break N1, N3 or N5 is not a candidate.
Candidates are tried cheapest-first, and the search stops the moment no untried one can beat the
best found.

A view is laid out in passes:

1. **Hand-placed labels first**, whole, hanging at the user's point on the side away from the
   owner (N4).
2. **KEEP.** Every label shown last view tries exactly the same spot and rows, measured from its
   anchor, so a pan or zoom does not reshuffle the map.
3. **HOME.** A kept label that is out on a leader, or out of its usual shape, goes back beside
   its owner as soon as there is room there for the same rows (R7's "recovers the default
   position").
4. **SHOW.** Every other label is placed with its ID row only, the smallest footprint it has, the
   least crowded first. A label is worth more than a neighbour's property (G).
5. **GROW.** In rounds, each label tries to take back one more property, in reverse drop order,
   if the bigger label costs no more than a property is worth. Rounds share the room fairly
   (R2) instead of letting the first label take it all. Zooming in reruns this, which is how
   dropped properties come back (R11).
6. **MEND.** A label still hidden may move one blocking neighbour elsewhere, even with fewer rows,
   if both then show (labels before properties).
7. **NUDGE.** A label that cannot grow may move one neighbour, rows and all, to other convenient
   space, if that gives it room for its next property (R2).
8. **Repeats.** A pipe longer than the repeat spacing gets further copies spaced evenly along it
   wherever a copy fits beside the pipe (R9).

A label is never bought with a leader crossing another leader or a label covering a leader:
past a set cost the label is better hidden. Leaders are straight, or carry the one short
horizontal hook when they climb steeply (R6); the text always hangs on the side the leader
arrives from and is justified to it (R5).

**Thinking in the pauses (H-b).** When a project opens, `idle()` lays out the first view with a
much deeper search and hands that layout to the first `place()` call. After any view, a pause
deepens that view's layout starting from exactly what is on screen, so nothing already shown
moves; `place()` hands it over if asked for the same view again. A pure pan (same scale) retries
only the labels near the view's edge, since nothing else changed shape. Anything that cannot
finish inside the idle budget is thrown away.

## Numbers

Bench, 2026-09-28, on a heavily loaded machine (load average 7 to 9 on 4 threads, so the
milliseconds are pessimistic):

```
placer C       N1 0  N3 0  N4 0  N5 0  inv 0   cost 134.5   rows 51%   labels 81%
               leader median 1.5, p90 4.0, max 4.9   churn 82/1305
               time per layout: median 64.9 ms, max 365.3 ms
               R5 0/241, R7 0/996, R11 709 regained, 76 lost
master-replay  N1 1  N3 34  N4 4  N5 0   cost 88.0   rows 25%   labels 45%
               leader median 1.7, p90 3.0, max 5.9   churn 283/656
               time per layout: median 259.0 ms, max 455.8 ms
```

It shows about twice the labels and twice the rows master does, with no breaks. Its crossing
cost is higher in total because it draws twice as much; every crossing is a label or leader on a
pipe, none a leader on a leader or a label on a leader.

## What it does well

- Shows most labels and about half of every requested row, even on the crowded Novato views,
  with zero N1, N3, N4 and N5 breaks.
- Holds still: a label keeps its spot from view to view unless it moves home or gains rows.
- Brings rows back as you zoom in, and brings pipe labels back beside their pipes.
- Never crosses two leaders, never lays a label over a leader.
- Pans are cheap: 10 to 30 ms a view on a panned copy of the Novato 2x view, on the same loaded
  machine.

## What it does badly

- Crowded views look busy. It takes "use available space" literally, and a dense cluster fills
  with labels on leaders of up to about 60 px; a reader has to follow the red lines.
- Pipe labels often hang horizontally on a leader from the middle of the pipe when the pipe is
  too short for its label to lie along it. That keeps rows, but a leader that starts on a pipe
  looks much like one that starts on a node.
- A zoom step on a crowded map still costs tens of milliseconds, more than a pan. It is well
  under master's time, but it is not free.
- It is greedy: the order it places labels in matters, and MEND and NUDGE only ever move one
  neighbour, so some better arrangements are never found.
- Labels are kept inside the view; one whose node sits near the edge moves inward as you pan,
  which the bench counts as churn.

Copyright 2009 Thomas Gail Haws. Licensed under GNU GPL v3.0 or later.
