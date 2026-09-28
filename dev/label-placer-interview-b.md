# Label placer B: interview answers

Answers from the builder of placer B (`js/lpn-placer-b.js` on `feat/label-placer-b`), 2026-09-28,
after Tom's test in the real app. Written from what I built and measured. Where I am guessing at the
cause of something Tom saw, I say so.

## 1. How B models the free space

**Structure.** Two hashed grids of 32 px cells over the viewport plus a 400 px margin, rebuilt at
every view. The *hard* grid holds what a label may never cover: node symbols, pump and valve
symbols, Text boxes, and each placed label's row boxes. The *soft* grid holds what a label may cross
at a price: pipe segments and leaders. Each item also carries its own bounding box, so a query only
returns items that really come near.

**Built when, updated how.** The static ground (symbols, Text, pipes) goes in once per view. Placed
labels and their leaders are added as they are placed. When a label is lifted to try elsewhere, its
entries are marked dead and new ones added. Nothing is carried from one view to the next: at
screen resolution the whole map costs well under a millisecond to build.

**What it is not.** It is a map of what is occupied, not of where the free space is. B never builds
a list of open areas; it asks "is this rectangle clear?" about each candidate spot. So B knows
free space only through the candidates it happens to try. That is the weakness Tom's rule 1 warns
about ("know where the free space is before choosing"). B only meets that rule halfway: it ranks
directions by how open the gaps between a node's pipes are.

**Per-zoom lookup table.** In idle time B lays out the whole network, with every label it has ever
been asked for and no viewport, at a ladder of zooms a quarter-octave apart. It keeps each label's
spot as an offset from its anchor. That offset holds at any pan of that zoom, so one table serves
every view near that zoom. On opening, B builds up to 19 rungs, nearest the current zoom first
(about 20-130 ms each for Net3; about 10 s of idle across the five bench sets). Between views it
rebuilds the likeliest next zooms around the labels now on screen. A view then only re-checks each
cached spot and searches for the few that fail. B also keeps, per zoom, the labels the table had to
drop, so the view does not search for them again.

**Did it pay off?** For speed, yes. The fastest of five runs per view went from 20-150 ms without
the table to 1.5-7 ms with it. For quality it cost a little: 1-6 fewer labels per view than a fresh
layout, because the cached spots come from a slightly different zoom and take ground first. It
also made results vary with machine load, since how many rungs get built depends on the time
available.

## 2. How a label meets its leader

The leader starts on the owner: the node's centre, or a point on the pipe. It ends on the label's
ink, never in the air. The rule B uses:

- **The leader ends at the nearest point of the nearest row, but never on the middle of a row's
  side.** If that nearest point lies on the left or right side of a row, it moves to the nearer
  corner of that side. A short level leader meeting a row at mid-height reads as a minus sign
  ("—145" looked like "-145" in an early render). Meeting the top or bottom edge is fine.
- **The label's alignment follows the side it hangs on.** A stack east of its node is
  left-aligned; a stack west of its node is right-aligned (S2). So the shared edge of the rows is
  the one nearest the node, and the leader lands on that edge's corner.
- **A hand-placed label is hung by its first row.** When the text lies east of the user's point,
  the point sits at the middle of the first row's left edge. When the text lies west, the point
  sits at the middle of the right edge, and the stack is right-aligned. The leader ends exactly at
  the user's point.

Proposed wording for the rules: *A leader ends on the corner of the label's nearest row, on the edge
the rows share, never at mid-height on a row's side. A label hanging west of its owner is
right-aligned so that edge faces the owner.*

## 3. Why held labels never recover rows or come back on zoom in

Two reasons, both deliberate readings of T1 that turned out too strict:

- **Held means frozen.** A label shown in the last view keeps its offset and its rows. It may only
  grow in place, from the edge it hangs on. If the rows below it are blocked, even by a pipe that
  zooming moved under it, it stays as it is. It is never re-placed to show more, because the bench
  counts any such move as "unforced". So a label that settled at just its ID on the crowded
  opening view is still just its ID at 8x.
- **Dropped labels stay dropped.** When the lookup table had to drop a label at a zoom, and the last
  view had dropped it too, B skips it rather than search again (for speed). If the table was built
  at the same zoom as the view or closer in, B skips it without even that check. Zooming in makes
  room, but the label is not looked at again until the view is well past that rung.

**What would fix it without jumping.** Keep "hold still" for the view *while it moves*, and
re-settle once it stops. Concretely:

- At the end of a zoom, any label that can show more rows gets its new spot, but only if that spot
  covers its old one or starts from the same anchor edge. The label then appears to grow, not to
  jump.
- A label that must move to gain rows moves at most once per zoom gesture, and only for a clear
  gain (at least two more rows, or a leader it no longer needs).
- Any label hidden in the last view is always looked at again when the view zooms in. Showing a
  label that was hidden is not a move, so it costs no stability.
- The bench should count a label that grows to cover its old spot as holding still.

## 4. Why pipe labels stayed long and did not realign with their pipes at close zoom

The same freezing, applied to pipe labels. My understanding of the cause:

- **Level labels stay level.** A pipe label that was crowded at the opening zoom was placed level
  (angle 0) on a short leader beside its pipe. Once shown, it is held. At close zoom, where it
  could lie along its pipe, it never gets the chance, because held labels do not relocate.
- **Long lines stay long.** A pipe label is one line: "ID, Q=…, V=…". I added growth along the pipe
  from a fixed end, which makes the line longer as you zoom in. I never tried the other shape
  (stacked), nor dropping back when the line runs past most of the pipe. "Gratuitously long" is
  probably that: every property on one line, reaching toward the pipe's end, when a short stack
  beside the midpoint would read better.
- **No unwrapping or wrapping at all.** H1 allows it; B never tries it. That also explains "rarely
  unwraps".

## 5. The rule that would have helped most

Two, and they are one idea:

- **"Hold still" means during the gesture, not forever.** Something like: *While the view moves,
  every label holds its spot. When the view stops, labels may re-settle to show more, as long as
  each one still covers the ground it covered before or grows from the same edge. A hidden label
  is always reconsidered.* B read T1 as "never move unless a collision forces it". That, together
  with the bench counting every other move against me, produced exactly the stuck labels Tom saw.
- **Say what a neighbour's properties are worth against leader length.** B priced a row at about
  one pipe crossing and travel at a small cost per pixel. It never priced "my longer leader buys
  my neighbour two rows", because it places one label at a time and never looks at the neighbour's
  loss. A rule such as *a leader may lengthen by up to N label heights if that lets a neighbour
  keep its properties* would have told me that trade was wanted. It would also have told me to
  build a placer that considers pairs, not labels one at a time.
