# Placer D: notes

`js/lpn-placer-d.js`, a clean-room placer built from `dev/label-placement-rules.md` Part A only and
this bench's README, contract and scorer. Run it with
`node dev/lpn-spike/label-bench/run.js --placer js/lpn-placer-d.js`.

## How it sees free space

- **Symbols and Text objects** go into a summed-area table over the view, in 2 px cells, twice: one
  table marks every cell an obstacle touches, the other only cells wholly inside one. A box whose
  "touched" sum is zero is clear; a box holding a "wholly inside" cell is blocked; only a box on
  the fringe gets the exact test. So nearly every place a label might go is accepted or refused
  with a few array reads, and nothing is built for a refused place.
- **Pipes, flow arrows and Text callouts** sit in a coarse grid and are only priced, never refused.
- **Labels already seated** sit in two grids: each row box on its own (to test "would this sit on
  another label"), and each whole label with its leader (to price crossings). A place remembers
  the label that blocked it, and skips the test while that label stays put.
- The edge of the view counts as a wall: no label text is drawn off screen. (The one exception is a
  repeat along a long pipe, which may run off screen and is still kept clear of everything.)

## How it chooses

Everything is priced in one currency. A shown row is worth 10; the label itself (its ID) 40, so a
label always outranks a property. Against that come the crossings, in Tom's order: leader on
leader 90 and label on leader 80 (both above a bare label, so in practice they do not happen),
label on pipe 9 (about one row), leader on pipe 2. Distance from home is cheap: a leader costs
under half a point per row-height of length. That is R1's order of giving up: nearness first,
then properties, then the label.

Each label gets **candidate places** at every drop level (all rows, then the user's drop order one
row at a time, down to the ID alone):

- touching its node: the four standard quadrants, the two sides with each row in turn beside the
  node, and above and below;
- for a pipe label, beside the pipe (R7), either lying along it (up to 70 degrees) or level and
  standing clear of it, at its middle or a little either side;
- further out on a straight leader in 8 directions at three distances, or, where the leader would
  be steep, on a leader ending in the one standard short hook (R6); the text is always justified
  to the side the leader arrives from (R5);
- a node label may also run as one line on a leader (H-a), and a pipe label may stack, at a small
  premium (R8).

Levels are built lazily, one at a time, and the leadered places only when the touching ones cannot
win, so an uncrowded view does very little work.

**Seating order:**

1. Hand-placed labels, exactly at the user's point, with the leader running through it (N4). Only
   which row meets the point, and how many rows show, is chosen.
2. Every other label as small as it comes, most crowded first. This is G: as many labels as
   possible are on the map before any label is given a property.
3. Each label grows into the room around it.
4. Repair: a label still hidden or short of rows may push up to two neighbours elsewhere (or
   make them drop a row) when the total shown goes up. This is R2: a neighbour takes a longer
   leader so that another label keeps its properties.
5. Polish: each label re-seats itself if that cuts crossings.

**Between views:** last view's place is offered back to every label with a bonus, so a label moves
only when that buys something. On a zoom-in or a pan, last view's labels are seated first and get
a bonus for keeping their rows, so zooming in gives back (R11) instead of reshuffling.

**Long pipes (R9):** a pipe longer than `repeatSpacingPx` carries its label every `length / n`
along it, in a phase that puts one copy on screen. Copies that would hit anything are left off.

**Pauses (H-b):** when the bench (or the page) opens a project and gives it time, the placer lays
out the opening view then and keeps it. It is handed back only if the next request is the same
input to the character, so any change to the network, the text or the settings is laid out afresh
(R13).

## Results, 2026-09-28

On the loaded test machine (load average 6 on 4 threads while another builder ran):

```
                  N1  N3  N4  N5  inv   cost   rows  labels  ldr med  p90  max  churn     median ms
placer D           0   0   0   0    0   84.2    54%     77%      1.6  3.8  4.4  105/1233  ~120-180
master-replay      1  34   4   0    0   88.0    25%     45%      1.7  3.0  5.9  283/656   259
```

R5: 0 of 220 leadered stacks justified the wrong way. R7: 13 of 942 pipe labels touch their own
pipe. R11: 876 rows regained, 151 lost across the zoom-in steps. The layout times are noisy on that
machine; the same code measured 116 to 180 ms median over repeated runs.

## What it does well

- No breaks on any scene, and no leader crossing a leader or a label.
- More than twice master's rows and labels shown, at about master's crossing cost.
- Labels keep a clearance (8 px across, 3 px up and down), so two neighbours never read as one.
- Stable: under a tenth of labels move between views without showing more for it; a pan moved 7
  of 179 in a test.
- Hand-placed labels stay put and stay shown, including on a bent or pump-carrying pipe.
- Customers are labelled like nodes; Text objects and their callouts are avoided.

## What it does badly, or not at all

- **Time.** The densest views (Net3 on Novato at 1.25x to 2.5x) take 100 to 400 ms on the loaded
  test machine, faster than master's full refresh but not free. The opening view is free only
  because it is laid out in the opening pause. Between-view pauses are not used. On the page,
  calling it once a pan or zoom settles, not on every frame, keeps R10.
- **Busy maps.** It uses the space it finds, so a crowded view carries many leaders and long
  one-line labels. That is the rules' goal, but it is more ink than master draws.
- **Pipe labels on leaders** can be hard to tie to their pipe in a dense tangle; the leader starts
  at the pipe's middle but the eye has to follow it.
- **Steep text.** A pipe label may lie along a pipe up to 70 degrees; near that limit it is
  awkward to read.
- **Greedy at heart.** The repair moves at most two neighbours, a few tries per label, under a work
  cap, so it can miss a rearrangement a global search would find.
- Two hand-placed labels the user dropped on top of each other still overlap: neither may move.
