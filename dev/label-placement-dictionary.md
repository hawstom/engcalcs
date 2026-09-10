# Label placement: the dictionary

**A review draft for Tom, 2026-09-10.** He asked for it by name: *"I would definitely recommend
that you make a dictionary for label placement and submit it to me for review. If we are going to
get better, we need a clear model, and that starts with clear terms."*

He asked because our prose is bad. Quoted a sentence out of our own code -- *"a fresh column hung at
each member's endpoint"* -- he wrote: *"Hung, column, endpoint, we are really reaching for or
avoiding words. It sounds like word salad."* He is right, and that sentence is named as a defect
below. On an ad-hoc analogy: *"please don't do that. Be boring. Be consistent. Let's find a language
and use it."*

**Sources for the terms taken from the field are in `dev/label-placement-algorithms.md` section
Sources.** The specification is `dev/label-placement-goals.md`. Nothing in the code is renamed by
this file; renames follow Tom's ruling on it.

## How to read an entry

| tag | means |
|---|---|
| **[RECORDS]** | reports what the word already means here. Nothing to decide; read only if the word is unfamiliar |
| **[PROPOSE]** | asks to CHANGE current usage. **This is the review list** |
| **[COIN]** | the field has no word and we are inventing one, deliberately. Also a decision |
| **[DEFECT]** | the code uses this and it has no clear meaning. Naming it, not fixing it |

Where a word comes from outside, the entry says whose it is: Imhof, ESRI Maplex, QGIS PAL, MapLibre,
the point-feature label placement (PFLP) literature, the boundary-labeling literature, ASME/ISO
drafting. Where nothing outside has a word, the entry says so.

---

## 1. The model, in the settled words

A **label** is text naming one element. It is anchored at its element's **anchor** and would like to
sit at its **home**, up and to the right. Placement gives each label a short list of **candidate
sides**, tests each one against the **obstacles** already on the drawing, and takes the first side
that is **clear**; a label with no clear side is **dropped**. What a label reserves is not a
rectangle but a **staircase**, one **row box** per printed row. If it sits far enough from its
anchor, a **leader** is drawn from the anchor to the label's **port**. Where a label will not fit, a
**cascade** runs: it **sheds** values one at a time, and when it has nothing left to shed it is
**hidden**. Where two labels want the same ground, **right-of-way** decides which one keeps it.

### 1a. The sequence, exactly, and the answer to Tom's question

He asked: *"Right-of-way only matters when all but one line have been shed from two competing
labels. Is that right?... Are we interested only in the case when only one line survives on each
label? Shed all you can and then compete?"*

**No. It is the other order, and right-of-way is consulted three separate times -- before any node
label has shed anything, again during shedding, and once more at the end.** Shedding a NODE label
never happens until right-of-way has already decided the contest and someone has lost it. The one
place that does look like "shed first" is the PIPE labels, and they shed against a *prediction* of
the contest rather than against its result.

A **content pass** (`refreshLabelTextPass()`, `js/looped-network.js:34792`) in order:

| # | what | where |
|---|---|---|
| 1 | every node label back to FULL content -- the cascade never ratchets | `unshedNodeLabels()`, `:2125` |
| 2 | **pipe labels shed values**, against a PREDICTION of where node labels will land | `shedAlignedForConflicts()`, `:804`; `predictNodeLabelBoxes()`, `:777` |
| 3 | pipe labels that lie along their pipe are committed as obstacles | `placeStationedLabels()`, `:1623` |
| 4 | **right-of-way #1: the placement order.** Salience becomes one number per label | `rankNodeLabels()`, `:739` |
| 5 | **place node labels, first fit, in that order.** No clear side and no yielding one = DROPPED | `Collide.placeLabelsFirstFit()`, `js/lpn-collide.js:1109` |
| 6 | **only the labels DROPPED at 5, and whoever blocked them, shed one value.** Re-place. Repeat | `shedNodeLabelsForCrowding()`, `:2186` |
| 7 | free pipe labels and dragged labels are scored on a ring | `Collide.placeLabels()`, `js/lpn-collide.js:993` |
| 8 | **gangs are repaired** -- flagged labels re-placed jointly | `Collide.repairCrossingGangs()`, `js/lpn-collide.js:1460` |
| 9 | **right-of-way #3: any crossing still standing, one of the two labels is hidden** | `shedCrossingLabels()`, `:2326`; `Collide.shedCrossingSurvivors()`, `js/lpn-collide.js:1854` |
| 10 | **right-of-way #2 collected:** a pipe label a node label is standing on is hidden | `yieldStationedLabels()`, `:2596` |

Steps 1, 2 and 6 are the only ones that shed, and they run on a content pass only -- a solve, a
toggle, a unit switch, a zoom step. **A drag frame runs 3, 4, 5, 7, 8, 9, 10 and sheds nothing**,
because shedding rebuilds glyphs and forces a layout sixty times a second.

So the three right-of-way moments are:

1. **Placement order** (step 4). Salience decides who chooses ground first, so whoever arrives at a
   full space is by construction the one that should lose it. Nothing has shed a value yet.
2. **Yielding** (steps 5 and 10). A node label may take ground held only by a pipe label, whatever
   either of them has shed. This is a contest between CLASSES and never looks at rows at all.
3. **Hiding a crossing survivor** (step 9). A different ladder from step 4 -- see **right-of-way**
   -- run after every placement, on labels that may still be carrying all their values.

The code note Tom half-remembered is real but is about a different thing: `shedNodeLabelsForCrowding()`
carries *"IT RUNS LAST, AFTER PLACEMENT HAS FAILED"* (`js/looped-network.js:2083`). That is the
NODE-label shed at step 6, and its point is exactly this -- **do not spend information on a conflict
that moving a label would have solved.**

---

## 2. The entries

### anchor **[RECORDS]**
The point on the drawing a label names: a node's own position, or a point on a pipe. Every candidate
and every leader is measured from it. PFLP's own word ("the point feature"), and boundary labeling's
("the site"). `labels[i].anchor`, `js/lpn-collide.js:993`. **Never "the endpoint"** -- see
**endpoint**.

### box **[RECORDS]**
An oriented rectangle: `{cx, cy, w, h, a}` with `a` in degrees. Used for a label's row, a symbol, a
Text object. Unrotated is the same thing at angle 0. `box()`, `js/lpn-collide.js:79`.

### candidate side **[PROPOSE]** *(today: "side", "sides", sometimes "candidate", sometimes "position")*
One place a label may go, as an endpoint. A node label gets four -- top-right, top-left,
bottom-right, bottom-left, in that order -- plus a raster of further-out ones if all four fail.
`cardinalSides()`, `js/lpn-collide.js:515`. The field's word for the list is **candidate positions**
(PFLP, Christensen/Marks/Shieber) or **position priority** (QGIS) or **text-variable-anchor**
(MapLibre). **Propose: say `candidate` for one place a label may go, and `side` only for the four
cardinal ones**, which is the sense the code's `sides` array actually carries. Today the two words
are used for each other and a reader cannot tell whether "side" means a corner or any candidate.

### cascade **[RECORDS]**
The ordered list of things to try on a label that will not fit. ESRI Maplex's **fitting strategy**,
and its cascade is `stack -> feature overrun -> font-size reduction -> abbreviation -> key
numbering`. **We have two of those rungs and one that is ours**: `shed values -> hide`. Say **rung**
for one step of it.

### clear / yielding / blocked **[RECORDS]**
The three answers to "may this label sit here". `clear` -- nothing in the way. `yielding` --
everything in the way is something this label has right-of-way over, so it may take the ground and
the holder will leave. `blocked` -- something in the way it does not outrank. `boxClearOf()`,
`js/lpn-collide.js:1211`. Pipes and distance never block; labels, symbols and leaders do.

### congestion **[DEFECT]**
Used for two unrelated things. (1) `alignedSideFor()`, `js/looped-network.js:457`: distance from a
point to the nearest OTHER pipe, which decides whether a pipe label sits above or below its pipe.
(2) The general idea of how crowded a node's surroundings are, which is what Tom's **needy /
wealthy** is about and which nothing measures. **They are different quantities and share a word.**

### crossing **[RECORDS]**
Tom's own two triggers, 2026-08-26: *"if two leaders cross or if a label crosses a leader."* So a
crossing is either two leaders properly intersecting, or somebody else's leader running through this
label's box. **Label-on-label overprinting is NOT a crossing** and is counted separately.
`labelCrossings()`, `js/lpn-collide.js:1277`. A **pair** is unordered and counted once.

### drop **[RECORDS]**
Placement found no side. The label is not drawn AND reserves no ground, because reserving ground for
something nobody can see makes the next label shed for a ghost. QGIS PAL returns exactly this as
**the unlabelled set**. Distinguish from **hide**.

### drop order **[RECORDS]**
Which VALUE inside one label is given up first. It is the user's own Labels-box column, headed
**Drop**, and 1 goes first. `shedOrder()`, `js/looped-network.js:515`; `linkFieldRank()`, `:524`.
**It is not the between-label contest** -- that is **right-of-way** -- and keeping the two apart is
the reason right-of-way needs its own word at all.

### endpoint **[DEFECT]**
Used in the code for the point a candidate puts the label AT, off which the text then hangs. It is a
real thing that needs a name, but "endpoint" is also the end of a leader, the end of a pipe, and a
web address. It is one of the three words Tom called salad. No proposal offered here: it wants
Tom's ear. Candidates if he wants one: **hook**, **attachment**, **peg**.

### first fit **[RECORDS]**
Try each candidate in order and take the first that is clear. The field's name for it is
**priority-ordered first-fit** or **greedy** (Christensen/Marks/Shieber); QGIS PAL runs the same
thing as `init_sol_falp` and calls it the fast first approximation. `placeLabelsFirstFit()`,
`js/lpn-collide.js:1109`. **It is the node labels' whole placement method**, and the alternative --
scoring every candidate on a ring and taking the best -- is used only for free pipe labels and
dragged labels (`placeLabels()`, `:993`). Say **ring pass** for that one.

### gang **[COIN]**
A connected group of labels that are in crossings with each other. It is the connected component of
the conflict graph, which is the field's own object (Formann and Wagner's maximum-independent-set
formulation, and QGIS PAL's `chainSearch()` moves one such chain per step) -- but nobody outside
gives the component a short name, so this one is ours. Tom's screenshot marked five of them, four
pairs and one triple. `repairCrossingGangs()`, `js/lpn-collide.js:1460`; a member of one is a
**member**.

### hide **[RECORDS]**
The label is not drawn but KEEPS its reservation. That reads backwards and is what stops the map
blinking: releasing the ground would let the label underneath come back, cover it again next pass,
and alternate forever -- measured on Net3-World as a five-pass two-cycle. `hiddenCrossed`,
`hiddenCrowded`, `hiddenShort` on the element handle. **A drop releases ground; a hide does not.**
That is the whole difference and it is not thrift.

### home **[RECORDS]**
Where a label sits with nothing in its way: up and two units right of its anchor
(`DEFAULT_LABEL_OFFSET`, `js/looped-network.js:86`). Imhof's own first choice for a left-to-right
script, arrived at here independently. ESRI calls the same idea the **preferred offset**.

### index **[RECORDS]**
The spatial structure that answers "what is near this point" without scanning everything. A uniform
grid of square **cells** sized to the query radius, so a query is always the 3x3 block around the
point. `grid()`, `js/lpn-collide.js:726`; `boxIndex()`, `:883`. MapLibre ships the same thing and
calls it a **CollisionIndex over a GridIndex**. **Say cell, not tile** -- a tile on this page is a
raster map tile from OSM or Mapbox and nothing else.

### interesting **[PROPOSE]** *(Tom's word; today the code has no umbrella at all)*
The umbrella for the rules that decide what one field's value at one node is worth showing:
`low` (demand -- a zero-demand junction says nothing), `extreme` (pressure -- the ends of the
network's range are what a reader wants), `like` (elevation and head -- a node sitting at its
neighbours' value is readable off theirs). `LPN_NODE_DROP_RULE`, `js/looped-network.js:1405`, and
`nodeFieldSalience()`, `:2054`. **Cartography's own word for this is `salience`**, and it is the
word the code already uses in the function name. **Propose: adopt `interesting` for the family of
rules and keep `salience` for the NUMBER one of them returns.** Two words for two things: `low`,
`extreme` and `like` are three ways of asking what is interesting; what comes back is a salience.

### label **[RECORDS]**
Text presenting model data about one element. Tom's own definition, `dev/label-placement-goals.md`
section 1. **Not EPANET's Label**, which is our **Text object** -- a suite-wide ruling that predates
this file.

### leader **[RECORDS]**
The line from an anchor to its label. Universal: ASME Y14.2 §4.9.3, ISO 128-22, QGIS **callout**,
AutoCAD **MLEADER**. Below a **leader tolerance** (ESRI's term; `leaderThreshold()`,
`js/looped-network.js:97`) no leader is drawn at all.

### needy / wealthy **[PROPOSE]** *(Tom's words, replacing "high order")*
How much open ground a node has around it. Tom on the incumbent: *"high order is a poor term. And
it's not defined. And is it obsolete?"* **Both halves of his question are yes.** The phrase survives
in three places and every one of them is a quotation of him (`js/lpn-collide.js:656` and `:1135`,
`dev/label-placement-goals.md:270`), and the sort key it described -- place the crowded nodes first
-- was REMOVED from the node pass when right-of-way took the order over. It still runs in the ring
pass (`difficultyOf()`, `js/lpn-collide.js:665`), where it counts obstacles within reach.

So there are two facts to record and they point opposite ways. **`difficultyOf()` measures
neediness today, for the ring pass only.** And the comment at `js/lpn-collide.js:1135` claiming
difficulty is "still the tiebreak" in the first fit **is stale** -- that pass sorts on dragged,
right-of-way, id, and nothing else. **Propose: adopt `needy` and `wealthy`, retire `high order` and
`difficulty` both, and correct the stale comment.** Direction, stated once so it cannot invert:
**needy = little open ground.**

### obstacle **[RECORDS]**
Anything a label must not sit on: another label's row box, a symbol, a leader, a pipe. QGIS's own
word, and it carries an **obstacle factor** we do not have. `staticObstacles()`,
`js/looped-network.js:1527`. A **foreign** obstacle is one that is drawn and cannot be moved by the
pass looking at it (`crossingForeigners()`, `:2245`).

### occupancy **[DEFECT]**
Named in the brief for this dictionary and **it is not in the code**. Nothing measures how much of
an area is covered. The nearest things that exist are the **open arcs** at a node (`openArcs()`,
`js/lpn-collide.js:390`), which are angular and not areal, and `difficultyOf()`, which is a count.
If a real occupancy is ever wanted it is `spot_prime` -- see `dev/label-placement-algorithms.md`
section 10c, which is the report saying it is not built and why.

### pass **[RECORDS]**
One complete run of placement over the whole drawing. Two kinds and the difference decides what may
happen: a **content pass** may shed, a **drag frame** may not. See section 1a.

### port **[PROPOSE]** *(today: no word. Various: "attachment", "the landing", "the nearest text line")*
The point on the label where its leader lands. **The boundary-labeling literature calls it exactly
this** (Bekos, Kaufmann, Symvonis and Wolff: *"the point where each leader is connected to the label
... is referred to as port"*), and drafting has a word for the short horizontal run into it --
ISO 128-22's **reference line**, AutoCAD's **dogleg**. Ours is at the vertical centre of the NEAREST
printed row, on the box side facing the anchor. **Propose: adopt `port` for the point and `landing`
for the horizontal run**, and stop saying "the nearest text line" as if it were a noun.

### rack / slot **[COIN]** *(today: "column", "stack", "the slots")*
A **rack** is a vertical arrangement of several DIFFERENT labels sharing one piece of open ground; a
**slot** is one position in it. This is the thing our code calls a stack, and it cannot go on doing
so -- see **stacked**. The gang repair already says `slots` (`stackTrials()`,
`js/lpn-collide.js:1636`), so half of this is adopting a word we have.

**Nothing outside has a word for it.** The nearest is boundary labeling, where labels are ranged
along an edge at fixed ports; that literature names the ports and never the column of them. So this
one is coined, and the three candidates with their drawbacks are:

| word | drawback |
|---|---|
| **column** | plain and immediately understood, but the Labels box has real table columns, and one of them is the Drop column. Two meanings, one word |
| **ladder** | collides twice with our own prose: the goal ranks are a "rank ladder" and the cascade has "rungs" |
| **rack** | free everywhere -- not in the code, not in the UI, not in any dev file. Concrete, boring, one syllable, and it takes a verb ("rack the gang") |

**Recommendation: rack.** Column is the runner-up and is a defensible answer if Tom would rather
have the obvious word than the unique one. **What is NOT recommended is leaving it as "stack"**,
which is the collision this dictionary exists to close.

### repair **[RECORDS]**
A pass that runs after placement, looks at the few labels flagged, and re-places just those --
jointly, and only if it can show an improvement. `repairCrossingGangs()`, `js/lpn-collide.js:1460`.
QGIS PAL's `chainSearch()` is the published shape. **A repair never touches a label the user placed
by hand.**

### right-of-way **[PROPOSE]** *(Tom's word. Today: "priority", "rank", "outranks", "precedence", "survival order", all for this and for other things)*
**Which of two competing labels keeps the ground when one must go.** Tom: *"Right-of-way is a mashup
of node properties and user label settings... at some moments, a label must be shed, and one has
right-of-way unless they are tied."*

**Endorsed, and the reason is that every alternative is already spoken for here.** `priority` is
ESRI Maplex's attempt order AND our own Drop column AND the `priority` field in the placement spec.
`precedence` is already this repo's word for touch hit-testing, nodes over links
(`js/looped-network.js:4439`, `nodeOutranks()` at `:4477`). `rank` is the goal ladder and also the
crossing shed's own field. `drop order` is values within one label, as Tom says. **Right-of-way is
free in this tree** -- the only near miss is the civil sense of a land corridor, which appears once
in one dev file and never in the map editor.

The three places it is decided are section 1a's three moments, and **they use two different
ladders**, which is worth stating because it looks like an inconsistency and is not:

- **Placement and yielding** rank on salience -- Tom's own four rules in his own order, compiled to
  one number per label (`nodeDropKey()`, `js/looped-network.js:2041`), plus the class rule that a
  node label outranks a pipe label always.
- **Hiding a crossing survivor** ranks on: hideable at all (a hand-placed label and a Text object
  never are, and if neither of a pair may be hidden the pair STANDS), then what the label names
  (reservoir and tank keep longest, then pump and valve, then junction, then pipe), then how many
  crossings it is in, then leader length, then id.

They differ because they answer different questions -- ESRI Maplex draws the same distinction
between **label priority**, which is the order things are attempted in, and what ends up unplaced.

### row box **[PROPOSE]** *(today: "line box", "the lines", "one box per line")*
One printed row of a label, as a box. A label reserves one per row, not one rectangle round the
whole thing, because rows have different widths and a block box claims the empty ground beside every
short one. `labelLineBoxes()`, `js/lpn-collide.js:572`. **Propose: `row`, not `line`.** A line on
this drawing is a pipe, a leader, or a callout; the code already says "row" in the renderer
(`composeRows()`) and "line" in the placer for the same object.

### shed **[RECORDS]**
Give up one value off a label to make it smaller, worst-ranked first, keeping the rest in reading
order. **Ours, not a cartographic standard** -- ESRI's cascade abbreviates and shrinks the type
instead. It is available to us because our labels are lists of numbers rather than names. Say
"shed", never "trim", "prune" or "reduce". It stops at the first set that fits.

### staircase **[RECORDS]**
The shape a multi-line label really occupies: the set of its row boxes, which have different widths
and so make a stepped outline rather than a rectangle. `js/lpn-collide.js:558`. **A good word,
keep it.** It is ours; the field has no equivalent because the field labels places, whose names are
one string.

### stacked **[PROPOSE]** -- **THE COLLISION, AND THE ONE DECISION THAT MATTERS MOST**
Today "stack" means two different things in the same file. (1) A label printed on several rows --
`composeRows(lines, stacked)`, `js/looped-network.js:34731`, and *"a node label always stacks"* at
`:1047`. (2) A vertical arrangement of several DIFFERENT labels sharing one area --
`stackTrials()`, `js/lpn-collide.js:1636`. Tom, on meeting both in one paragraph: *"Once again we
are poor of language. We have a stacked gang and we have a stacked label."*

**The convention decides it, and it decides against Tom's own instinct** -- his was to reserve
"stack" for the group. **ESRI Maplex's `Stack label` fitting strategy means a label split over
several lines**, in as many words: *"when a label does not fit in the available space ... split it
into two or more parts and place each part on a new line."* It is a checkbox with a Maximum number
of lines under it, and it is the first rung of the published cascade our own cascade is a subset of.
So a reader who goes and looks it up finds the multi-line meaning, and our own `composeRows()`
already agrees with them.

**Propose: `stacked` = a multi-line label, and nothing else. The group of labels is a `rack`.**
Meaning (2) is renamed and meaning (1) keeps the word.

### station **[RECORDS]**
One place along a pipe where its label is printed. A long pipe repeats its label at several -- QGIS
calls the setting **repeating label distance**, MapLibre `symbol-spacing`. A **stationed** label is
one drawn along its pipe rather than free to move; it is an obstacle to everything else and cannot
be moved by any pass. `linkLabelStations()`, `js/looped-network.js:216`.

### run length **[RECORDS]**
How far a label reaches ALONG its pipe, which is the dimension that has to fit. Tom, 2026-08-16:
*"Width is meaningless here in intuitive terms"*, and *"'segment length', not 'pipe length'"* --
a label lies along ONE segment of a bent pipe, so the rest of the polyline is not room it can use.
Both corrections were hiding real defects. **Say run length and segment; never width and never
pipe** in this context.

### trial **[RECORDS]**
One arrangement the repair tries and scores. Its score is five numbers compared in order: boxes on
hard obstacles, boxes on other labels, crossings, yielded ground, total leader length. The first two
are a **gate** -- a trial may not buy a crossing by spending an overlap.

### yield **[RECORDS]**
A pipe label grants ground to a node label, because the node label has right-of-way, and then
LEAVES -- it is hidden. Both halves are required: granting without leaving puts two labels on top of
each other, which is what shipped until 2026-08-23 (60 node-label rows printed through pipe labels
on one view). `boxClearOf()`'s middle answer grants it, `yieldStationedLabels()` collects it.

---

## 3. One phrase named as a defect

> *"a fresh column hung at each member's endpoint"* -- `js/lpn-collide.js:1655`

Four unclear words in eight. In the vocabulary above the same sentence is: **"a new rack of slots,
starting at each member's own candidate, running down and running up."** Nothing was gained by the
first version and a reader had to reverse-engineer it, which is Tom's whole complaint.

---

## 4. The review list

The decisions this file is asking for, and nothing else is a decision:

1. **stacked** -- multi-line label keeps the word; the group of labels does not. *Recommended.*
2. **rack / slot** -- the new word for the group. *Recommended over column and ladder.*
3. **right-of-way** -- adopted for the between-label contest. *Recommended, and it is his word.*
4. **needy / wealthy** -- adopted; `high order` and `difficulty` retired. Direction: needy = little
   open ground.
5. **interesting** -- adopted for the family of rules; `salience` kept for the number.
6. **port / landing** -- adopted from boundary labeling and ISO 128-22.
7. **row box, not line box.**
8. **candidate vs side** -- `side` means one of the four cardinal ones only.
9. **endpoint** -- named as unclear, no replacement proposed. Wants his ear.
10. **congestion** -- one word, two quantities. Needs splitting once 4 is decided.
