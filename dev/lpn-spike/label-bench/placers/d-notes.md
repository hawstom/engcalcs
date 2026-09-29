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
- **Labels already seated** sit in a count raster (4 px cells) of their rows grown by the
  clearance: TOUCH counts the rows touching a cell, CORE the rows covering it wholly. A place whose
  cells have no TOUCH is clear of every label; one holding a CORE cell is blocked. Only the fringe
  case asks the two grids behind it (each row box, and each whole label with its leader, which
  also prices crossings). A label weighing its own alternatives is lifted out of the raster first.
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
- for a pipe label, beside the pipe (R7), at the middle of its on-screen stretch or up to three
  tenths of it either way: turned along it where the user's setting asks (R14), in the reading
  window the scene gives, three pixels off the pipe or half a row off; level and clear of it only
  as the fallback, which costs 8, under the worth of one row;
- further out on a straight leader in 8 directions at three distances, or, where the leader would
  be steep, on a leader ending in the one standard short hook (R6); the text is always justified
  to the side the leader arrives from (R5);
- a node label may also run as one line on a leader (H-a), and a pipe label may stack, at a small
  premium (R8).

Levels are built lazily, one at a time, and each ring of leadered places only when the places
before it cannot win; an along place is tested only when the search reaches it.

**Seating order:**

1. Hand-placed labels, exactly at the user's point, with the leader running through it (N4). Only
   which row meets the point, and how many rows show, is chosen.
2. Every other label as small as it comes, most crowded first. This is G: as many labels as
   possible are on the map before any label is given a property.
3. Each label grows a row at a time while there is room (no room for one more row means none for
   two).
4. Repair: a label still hidden, short of rows, or drawn level against the setting may push up to
   two neighbours elsewhere (each keeps its rows or gives up one) when the total shown goes up.
   This is R2: a neighbour takes a longer leader so that another label keeps its properties.
5. Polish: each label re-seats itself if that cuts crossings.

**Between views:** last view's place is offered back to every label with a bonus (not after a
change to the alignment setting or the reading window, R13; a kept level place still pays the
level price), so a label moves
only when that buys something. On a zoom-in or a pan, last view's labels are seated first and get
a bonus for keeping their rows, so zooming in gives back (R11) instead of reshuffling.

**Long pipes (R9):** a pipe longer than `repeatSpacingPx` carries its label every `length / n`
along it, in a phase that puts one copy on screen. Copies that would hit anything are left off.

**Pauses (H-b):** when the bench opens a project and gives it a long pause, the placer lays out the
opening view then and keeps it. It is handed back only if the next request is the same input to
the character, so any change to the network, the text or the settings is laid out afresh (R13).
The page's pauses are short idle callbacks, so there it warms the placer up instead: a few layouts
of made-up labels on the real network, and the candidate pool grown ahead, so the first zoom is not
also compiling the placer. In a browser the first pause after the script loads does the same on a
made-up grid.

**Time (R10, R15):** candidates, their leader buffers and their boxes come from a pool kept across
layouts, and grid queries reuse their arrays, so a layout allocates about half what it did and the
garbage collector's share fell from a sixth of the time to under a tenth.

## Results, round 3, 2026-09-28

On the loaded test machine (load average 6 to 8 on 4 threads while other builders and harnesses
ran, so every absolute time below is inflated and noisy):

```
                  N1  N3  N4  N5  inv   cost   rows  labels  ldr med  p90  max  churn
placer D, rd 3     0   0   0   0    0  452.0    54%     79%      2.1  3.8  4.5  119/1268
placer D, rd 2     0   0   0   0    0  508.0    54%     77%      1.6  3.8  4.4  105/1233
```

(The cost column counts crossings by rank this round; the round 2 line is the round 2 placer on
this round's bench.) R14: 563 of 985 shown pipe labels lie along their pipe (round 2: 209 of 941),
and 93 of the rest had room to (250). R7: 0 on their own pipe (13). R5: 0 of 203. R11: 788 rows
regained, 99 lost.

Time, measured the only way the load allowed, the two placers interleaved view by view in one
process and the per-view minimum kept: round 3 takes 0.72 to 0.79 of round 2's time on the bench
views, while doing the R14 work round 2 did not. In headless Chrome on Net3 at Novato (216 labels),
zooming in steps, round 3's layouts took about half of round 2's (for example 437 to 1017 ms
against 822 to 1460 ms in one heavily loaded run, 80 to 290 ms against 260 to 670 ms in a quieter
one).

## What it does well

- No breaks on any scene, and no leader crossing a leader or a label.
- More than twice master's rows and labels shown, at about master's crossing cost.
- Labels keep a clearance (8 px across, 3 px up and down), so two neighbours never read as one.
- Stable: under a tenth of labels move between views without showing more for it; a pan moved 7
  of 179 in a test.
- Hand-placed labels stay put and stay shown, including on a bent or pump-carrying pipe.
- Customers are labelled like nodes; Text objects and their callouts are avoided.

## What it does badly, or not at all

- **Time.** The densest views (Net3 on Novato at 1.25x to 2.5x) still take on the order of 100 ms
  on a quiet machine, and the page hides labels for that long after a zoom (R15). The repair pass
  is bounded by a work cap, not by the clock, and is about two fifths of it.
- **Busy maps.** It uses the space it finds, so a crowded view carries many leaders and long
  one-line labels. That is the rules' goal, but it is more ink than master draws.
- **Pipe labels on leaders** can be hard to tie to their pipe in a dense tangle; the leader starts
  at the pipe's middle but the eye has to follow it.
- **Steep text.** A pipe label along a steep pipe reads as steeply as the reading window allows.
- **Along against clearance.** Some pipe labels stay level where an along place is free by the
  bench's measure but closer than the clearance this placer keeps from other labels.
- **Greedy at heart.** The repair moves at most two neighbours, a few tries per label, under a work
  cap, so it can miss a rearrangement a global search would find.
- Two hand-placed labels the user dropped on top of each other still overlap: neither may move.
