# Label placer D: interview, round 3

Builder D's own answers, 2026-09-28, about `js/lpn-placer-d.js`. Written from the placer and its
notes (`dev/lpn-spike/label-bench/placers/d-notes.md`), without sight of the other builders' work.

## 1. How I model the free space

As two pictures of the screen, not as a list of shapes. The first is fixed for the whole layout:
every node symbol, pump, valve and Text object painted into a grid of 2 px cells, kept as a
summed-area table, once for "any obstacle touches this cell" and once for "this cell lies wholly
inside an obstacle". A box whose touched-sum is zero is clear, a box holding a wholly-covered cell
is blocked, and only a box on the fringe is tested exactly. Pipes are not in it: a label may cross
a pipe at a price, so pipes sit in a coarse grid that is only asked what a place costs.

The second picture changes as labels are seated: a 4 px count raster of every seated row, grown by
the clearance two labels keep. It answers "would this sit on a label" the same way, by a few array
reads. The real estate is therefore never enumerated as boxes; a place is proposed and the pictures
say at once whether it is free.

## 2. Stacked versus one line

A node label is a stack by default and a pipe label a line, and each may take the other shape for
a small premium (R8). A node label on a leader may run as one line when the leader leaves sideways,
where there is usually open ground (H-a). A pipe label the setting turns along its pipe is always a
line, because a turned stack does not read.

## 3. Where a pipe label goes, and how I now honour alignment

Beside its pipe, never on it (R7): at the middle of the pipe's on-screen stretch, or up to three
tenths of that stretch either way, on either side. Where the user's "Draw link labels along the
link line" setting asks, the text is turned to the pipe and reads inside the reading window the
scene gives, three pixels off the pipe, or half a row off when that clears a neighbour or the end
symbols of a short pipe. Level text beside the pipe is offered too, but it costs a little under one
row, so it wins only when no along place is free and never costs the label a row. Only when
neither fits does the label go out on a leader from the pipe's middle.

## 4. How a label meets its leader

A leader starts on the edge of its node's symbol (or on the pipe) and runs straight out; if it
would leave steeply, it ends in the one standard short hook, level, so the text sits beside its
end. The text is justified to the side the leader arrives from (R5), and the leader meets the row
nearest the owner: the bottom row when the label is above, the top row when below.

## 5. How dropped rows and hidden labels come back on zoom-in

Every layout starts again from nothing, so a row dropped at the last view is simply available
again. What the last view adds is memory: each label is offered its last place, at the same offset
from its anchor, with a bonus, and on a zoom-in a label that was shown gets a bonus for keeping at
least its rows and is seated before labels that were not. Then growth runs as usual, a row at a
time, so the new room goes to rows before it goes to reshuffling.

## 6. What I changed between round 2 and round 3, and why

R14: along is now the default where the setting asks, with level only as the fallback, and the
old fixed 70 degree limit gave way to the scene's reading window. That took the along count from
209 to 563 of the shown pipe labels. R7: a label now clears its own pipe by a pixel, which took the
13 labels on their own pipe to none. R15 and R10: the time went into three places I measured
rather than guessed. Growth goes one row at a time; a neighbour pushed aside may keep or lose one
row but is not searched at every size; and the seated labels got the same raster the symbols
had. The largest gain was the garbage collector: candidates, their leaders and their boxes now come
from a pool kept across layouts, which halved what a layout allocates. Finally, pauses on the page
warm the placer up on the real network, since the page's pauses are too short for a whole layout.

## 7. My main strategies, named

- **Labels first.** Every label is seated at its smallest before any label is given a property,
  so a crowded view drops values, not labels. Only then does each label grow into the room left.
- **Two-picture lookup.** Fixed obstacles and seated labels are each a raster that answers "is
  this place free" in a few reads. Exact geometry is kept for the rare place on a fringe.
- **Rings of patience.** A label looks at the places touching its owner first, then at leaders
  one length at a time. The next ring is built only if the ones before it cannot win.
- **Shoulder shove.** A label still short of rows may push at most two neighbours elsewhere, each
  keeping its rows or giving up one. The move stands only if more is shown in all.
- **Along by default.** Where the user asks, a pipe label lies along its pipe, reading the right
  way up. Level is the fallback, priced just under a row.
- **Remembered seats.** Last view's place is offered back with a bonus, and on a zoom-in the
  labels already shown sit down first. A label moves only when moving shows more.
- **Pooled thinking.** Candidates are recycled across layouts instead of made afresh, and pauses
  warm the engine on the real network. The time a zoom leaves the map blank is spent placing, not
  collecting garbage or compiling.

## 8. The rule that would help me most next

A rule for how long a zoom may leave the map blank, as a number: a time the layout of a dense view
must beat, and what may be given up to beat it. Today the repair pass is bounded by a work cap I
chose, and it is about two fifths of the time for about two percent more values shown. Whether
that trade is worth the blank is Tom's call, not mine.

Copyright 2009 Thomas Gail Haws. Licensed under GNU GPL v3.0 or later.
