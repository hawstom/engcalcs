# Placer C, interviewed after round 3

Builder C's own answers, in plain prose, for Tom to read beside the other builders' and to name
the strategies. The placer is `js/lpn-placer-c.js`; its working notes are
`dev/lpn-spike/label-bench/placers/c-notes.md`.

## 1. How do you model the free space ("real estate")?

In three layers, from the cheapest question to the most exact one.

The first layer is a fine raster over the view, three pixels to a cell. A cell is marked while a
node symbol, a pump or valve, a Text object or an already placed label covers all of it. Before a
candidate spot is measured properly, I ask whether it lies over any marked cell; if it does, it is
certainly illegal and is thrown out at once. For the fixed obstacles (the symbols and Text
objects) that raster is frozen into a summed-area table once per view, so the question costs four
reads for a level label. A label turned along a pipe asks the cells along its centre line.

The second layer is three coarse grids, 36 pixels to a cell, holding the exact shapes: the things
a label may never cover (symbols, Text objects), the things it may cross at a price (pipes, flow
arrows, Text callouts), and the labels and leaders placed so far in this view. The first two do
not change while one view is laid out, so what a spot costs against them is worked out once and
remembered for the rest of that view.

The third layer is per label: a short list of places worth trying, each with its own price before
anything is checked. Round a node that is the corners and sides of its symbol, the middle of each
open gap between the pipes that meet there, and leaders of four standard lengths in each of those
directions. Round a pipe it is spots along the pipe on either side, level spots beside its middle,
and leaders from its middle. These lists depend only on the directions of the pipes, which a pan
or zoom does not change, so they are kept for as long as the project is open.

So I never map the free space as a whole. I ask, spot by spot, "is this free, and what would it
cost", and the raster and the grids make most of those questions cheap.

## 2. Stacked versus one line

A node label is a stack by habit, a pipe label a single line, and I treat each label's habitual
shape as its "usual" shape. The other shape is always on the list too, at a price: a label not in
its usual shape costs more than any leader, because Tom's order of giving things up puts nearness
to home before wholeness. In practice a node label goes to one line when a long narrow gap is the
only room near it, and a pipe label goes to a stack only when a level spot beside the pipe is too
short for its line.

A label turned along its pipe is only ever one line. A turned stack reads badly, and the setting
Tom asked me to honour ("Draw link labels along the link line") means one line lying along the
pipe.

## 3. Where a pipe label goes, and how you now honour alignment

When the user's setting is on, a pipe label's first choice is to lie along its pipe, turned to
the pipe's direction at that spot, just clear of the line on one side or the other, reading within
the user's own reading window so it is never upside down. I try the middle of the pipe's visible
stretch first, then stations stepping outward along it, on both sides, and, where the pipe is
shorter than the label, a spot beside it that overhangs its ends by standing a little further off,
so it clears the symbols at either end.

A level label is the fallback, and it now carries a fixed penalty. The penalty only ranks: it puts
every level spot behind every reasonable spot along the pipe, but it is never allowed to be the
reason a label or a property is lost. If the only room for a label, or for one more of its
properties, is level or out on a leader, it goes there. Round 3's words were "fall back to a level
label only where no aligned spot is free", and Tom's coverage comes first, so that is the balance I
struck.

A label that was level in the last view, because the pipe was crowded, is offered the aligned spot
again on every new view, and turns to the pipe as soon as there is room for the same rows. When the
setting is off, no pipe label is ever turned.

A turned label, or one hung on a leader from its pipe, is never allowed to lie across its own
pipe. That keeps R7's "beside, not on".

## 4. How a label meets its leader

A leader is straight from the edge of the owner's symbol (or from the pipe) to the label. Where it
climbs steeply, it ends in the one standard short horizontal hook, so the text still starts level.
The text hangs on the side the leader arrives from and is justified to that side: a leader coming
in from the left meets the left edge of a left-justified block, from the right the right edge of a
right-justified block. For a stack, the leader meets the middle of the first row, the middle of the
last row or the middle of the block, whichever the leader's direction makes natural.

A leader is never bought by crossing another leader or by laying a label over a leader. Past a set
price the label is better hidden.

## 5. How dropped rows and hidden labels come back on zoom-in

Every view starts from the last one. Each label shown last time first tries exactly the same spot
and rows, measured from its anchor. Then every label, kept or new, is offered one more property in
rounds, in the reverse of the user's drop order, if the bigger label costs no more than a property
is worth. On a zoom-in there is more room between things, so those offers start succeeding, and
rows return. A hidden label is tried again from scratch on every zoom, and if exactly one neighbour
is in its way, that neighbour may move, even with fewer rows, so that both show.

Round 3 fixed one leak here: a kept label used to carry its "stay where you are" bonus into the
growing rounds, which made it look cheaper than it was and so less able to afford one more
property. It now grows as freely as a label placed fresh.

## 6. What changed between round 2 and round 3, and why

The one big change is alignment. Round 2 treated a spot along the pipe and a level spot beside it
as equals, so on a crowded map the level spot usually won and the setting was ignored, as Tom saw.
Round 3 reads the setting and the reading window from the scene, tries the aligned spots first,
lets a label stand off and overhang a short pipe, turns kept level labels back to their pipe when
room frees, and never turns a label when the setting is off. On the bench, pipe labels lying along
their pipe went from 168 of 972 to 462 of 991, and those that had room but did not use it fell from
300 to 71.

Two smaller changes guard coverage: the level penalty was made a ranking only, never a bar, and the
growing rounds were given a little more to look at. Coverage ended slightly above round 2's. The
free-space raster also learned to answer quickly for turned labels and, for the fixed obstacles,
through a summed-area table, to pay back some of the time the extra alignment searches cost.

## 7. Main strategies, named

- **Keep Your Seat.** Every label first tries last view's spot and rows, measured from its own
  anchor. The map does not reshuffle on a pan or zoom unless something changed for that label.
- **Smallest First, Then Grow.** Every label is first shown with its ID row alone, so as many
  labels as possible get on the map. Then all of them grow one property per round, which shares the
  room fairly instead of letting the first label take it all.
- **Along Before Level.** A pipe label the user wants along its pipe tries every aligned spot before
  any level one. The level spot is a ranked fallback that never costs a label or a property.
- **Going Home.** A label out on a leader, out of its usual shape, or level where the user asked for
  aligned, returns to its natural place as soon as that place has room. It never waits to be pushed.
- **One-Neighbour Mend.** A hidden label may move one blocking neighbour elsewhere, even with fewer
  rows, if that lets both show. A label that cannot grow may likewise move one neighbour, rows and
  all.
- **Certain-No Raster.** A fine raster of cells that some obstacle covers completely rejects most
  bad spots before any real geometry is done. It is what keeps a zoom fast enough for R15's blank
  moment to stay short.
- **Think in the Pause.** When a project opens, the first view is laid out with a much deeper search
  in the idle time before it is asked for. After each view, idle time deepens that same view without
  moving anything already shown.

## 8. The rule that would help me most next

A rule on how far a pipe label may wander along its pipe, and whether a label along the pipe with
fewer properties beats a level one with more. Today I decide that the level label with more
properties wins, because Tom put properties ahead of everything but nearness. If he would rather
see the alignment kept and one property dropped, that one sentence would change my ranking, and
probably the look of a crowded map, more than any other.

Copyright 2009 Thomas Gail Haws. Licensed under GNU GPL v3.0 or later.
