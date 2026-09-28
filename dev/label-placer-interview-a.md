# Label placer A: interview answers

Builder A, 2026-09-28. About `js/lpn-placer-a.js` on `feat/label-placer-a` (HEAD 6351fbf3).

## 1. How the free space ("real estate") is modelled

There are two structures, and both are rebuilt from scratch for every view. They are not updated in
place, because a zoom changes every pixel distance.

- **A bucket grid** of 24 px cells, covering the viewport plus 320 px on each side. It has three
  layers: hard boxes (node symbols, pump and valve symbols, Text objects), pipe segments, and Text
  callout segments. A pipe is filed only in the cells it actually passes through. The grid gives
  exact answers ("does this box overlap that symbol by more than a pixel?").
- **A raster** of 3 px cells over the viewport plus 48 px. It marks the same things and keeps a
  summed-area table for each kind. With that, "is this rectangle free of symbols, pipes or
  callouts?" costs four reads. It also keeps a copy of each mark spread one cell wider. A leader is
  walked along that copy, so a leader that passes nowhere near anything skips the exact test.
  The raster only ever answers "certainly clear"; anything it cannot clear goes to the grid for
  the exact answer.
- **A second, identical bucket grid** holds what has been placed so far in this view: label ink and
  label leaders. Placing a label adds its items. Moving a label marks its old items dead.

Per node there is also a ranked **gap list**: the angles between the pipes leaving the node,
widest first. Angles do not change with zoom, so it is worked out once per network and kept
across views and idle calls.

**Cost.**
- When a project opens, the placer runs one throwaway layout of the opening view. That warms the
  JavaScript engine; the result is not kept.
- Per view, building the map is a small fixed cost: a pass over every node and pipe, and one sweep
  over the raster cells (about 470 by 330 at 1400 by 900). All buffers are kept and reused between
  views, so nothing large is allocated per layout.
- Most of the time goes into testing candidates against the map, not into building it. Leader
  checks are the biggest single share.

## 2. Stacked versus one line

Every label is offered in its usual shape (a node label stacks, a pipe label is one line) and in
the other shape. The other shape costs a small fixed amount extra, 0.6 against 4 for each row
given up.

Unwrapping therefore wins in two cases:

- It keeps at least one more row than the stack can keep. This is the usual reason. A one-line node
  label is one row high, so it fits between two pipes where a four-row stack would cross them.
- It keeps the same rows while avoiding a pipe crossing, a leader, or a longer leader, and that
  saving is worth more than 0.6.

The other shape is tried less thoroughly than the usual one: 8 directions and 2 leader lengths,
against 16 directions and 4 lengths. That is how "lazy" from rule H1 is expressed. The stack is not
favoured beyond that 0.6. That is why Tom saw node labels unwrap readily: in a network of pipes, a
one-row band is much easier to find than a four-row block.

## 3. Where a pipe label goes, and why it often sat on the pipe

A pipe label is tried in this order:

1. Turned to follow the pipe: above it, below it, or centred on it. Each is tried at the middle of
   the pipe and slid along it by up to two steps.
2. Horizontal, at a corner beside the pipe's midpoint.
3. Horizontal, on a leader from the midpoint.

The small preferences were:
- above the pipe: 0
- below: 0.15
- on the pipe: 1.5
- horizontal off the pipe: 2
- a label crossing any other pipe: 8

The scorer treats a pipe label on its own pipe as no crossing at all, so on-the-pipe costs only
its 1.5 preference. Beside the pipe, the label is offset about 9 px to one side and runs the length
of its text. Near a junction it clips the other pipes meeting there, which costs 8 each.

So on short pipes and at junctions, on-the-pipe was usually the cheapest legal place, and it beat
dropping a row (4). It also won whenever a node label had already taken the ground beside the
pipe, because node labels are placed in the same pass, most crowded first.

If Tom wants pipe labels beside the pipe, raise the on-pipe preference above the cost of dropping a
row. Pipe labels would then lose rows instead of sitting on the line.

## 4. How a label meets its leader

The leader runs straight from the symbol's edge to a point P. The label is hung on P according to
the leader's direction:

- **Leader points mostly right** (more than about 22 degrees from vertical): P is on the left edge
  of the first row, halfway up that row. The rows are left-aligned and hang downward.
- **Leader points mostly left:** the same on the right edge, rows right-aligned.
- **Leader points mostly up or down** (within about 22 degrees of vertical): P is the centre of the
  block's bottom or top edge, and the rows are centred.

That last case is what Tom saw: a label centred on the end of a near-vertical leader. The side cases
can also look centred, because P sits at the middle of the first row, not at a corner.

**Better rule.** Hang from the corner on the leader's side: the leader enters the corner of the
block nearest the node. The label then extends away from the node, in the leader's direction, and
never centres on the leader. A leader pointing up and to the right would meet the bottom-left
corner, and so on. The bench would accept that: it only requires the leader end to touch the ink.

## 5. Why dropped rows never came back on zoom-in, and what would fix it

This came from how I read rule T1 (hold still until forced).

A label shown in the last view is carried to the same pixel offset and kept if it is still legal.
After that it may only grow in ways the stability score does not count as a move: more rows added
on the same top and the same anchored edge, one row per round.

Three kinds of label could never grow:
- **Turned pipe labels.** Growing one moves where its text starts, and the score calls that a
  move. I switched their growth off to keep unforced moves near zero. That is exactly the pipe
  properties Tom saw stuck.
- **Centred labels** (above or below the node). Growing moves both edges.
- **Labels whose growth was blocked** by a neighbour. A held label never tries a new place, so it
  stays small forever.

A label hidden in the last view is searched afresh and does reappear, because appearing is not a
move.

**What would fix it:**
- Treat "more rows shown" as a legitimate reason to move: re-place a held label when a place with
  more rows exists and the move is small, perhaps within a row height.
- Let a turned pipe label grow along its pipe from a fixed text start, and accept that the score
  calls it a move.
- Do the regrowth in the idle time after a zoom settles, not during the zoom itself. The view holds
  still while it moves, then the labels fill out.

The rules document never said whether "hold still" outranks "expect more full labels as you zoom
in" (S3). I chose stillness.

## 6. The rule that would have helped most

A single sentence settling the trade between stillness and fullness. For example: "After the view
stops moving, a label may move up to one row height to show more rows. Only moves while the view is
moving count against stillness."

A close second: the relative price of one dropped row against one label-on-pipe crossing. I had to
guess that trade, and it decides almost everything: how often labels sit on pipes, how often they
unwrap, how often rows are dropped.
