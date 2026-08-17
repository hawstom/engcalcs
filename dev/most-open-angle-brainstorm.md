# "Most-open angle(s)" — Tom's brainstorm, 2026-08-16, unfiled

Recorded verbatim on request. **Not yet checked against the literature** — Tom asked explicitly that
this be engaged with the label-placement survey (`dev/label-placement-algorithms.md`) before it is
scoped as work; that comparison has not been done. Tom's own framing, 2026-08-17: he anchored to the
literature first (the Task 400 rewrite) rather than include this in instructions, and still wants it
engaged with the literature rather than built from first principles.

## Definitions

1. **Obstacle** is a node, vertex, text, or fixed/user label.
2. For efficiency, divide the universe into square regions of maximum size so that every node only
   has to evaluate obstacles in its own region and its 8 neighbors.
3. A node's obstacle **tracking radius** is the average distance to the nearest node or vertex on
   links connecting to it. For simplicity/speed this can be evaluated as a "square" radius at build
   time — compare x and y of universal or regional candidate obstacles independently against the
   criterion extrema using `>`/`<`, instead of a polar/circle formula.

## Idea

The local-context data for a node or a fixed/user label/text could determine its **most-open
angle(s)**, combining (a) the angles of its connecting links and (b) the angles to obstacles within
its tracking radius. A label placer would then prefer the direction with the least competition
around that anchor, rather than trying fixed candidate positions (top-right, straight-top, …) and
testing each for conflicts after the fact.

## Open question for the literature pass

Whether this is a known technique (angular-sector / clearance-direction heuristics show up in some
point-labeling literature) or a genuinely different framing from the reduction-rule-plus-search
shape `dev/label-placement-algorithms.md` currently recommends, and whether it composes with that
shape (e.g., as the candidate-generation step) or competes with it.
