# Label placement rules for the rebuild

**Status: REVIEWED BY TOM 2026-09-28; his edits applied the same day.** Written from his interview answers of 2026-09-27
(the couch, https://claude.ai/artifact/PyZpPyHbpACHsu7fHVZEZJ, 13 answers) and his two instructions
that followed it, then revised with his review of 2026-09-28. His answers, verbatim, are in §6.

Part A (§1-§4) is what the two builders receive. Part B (§5-§6) is held back from them on his
ruling (Q11, Q12) and is for him and for the judges.

Tom's §1 definitions in `dev/label-placement-goals.md` still hold. Where §2 of that file (the
2026-08-16 goal order) disagrees with this one, this one is newer and wins.

---

## Part A: for the builders

### 1. The one goal

> **Use convenient available space effectively, and drop properties, then labels, when all else
> fails.** (Tom, Q13)

Free space is fundamental. A placer that decides positions first and treats free space as whatever
is left over has the problem upside down. Know where the free space is before choosing where
anything goes. Tom: *"Treat free space as fundamental; use space well. That is not only human, it
is biological; it is real."*

### 2. Rules that are never broken

A layout that breaks one of these is wrong, however good its other numbers.

- **N1. No label overwrites a symbol or another label.**
- **N3. No leader passes through another node's symbol.** (Ruled before, R-339.)
- **N4. A label that the user placed by hand stays where the user put it**, and is never hidden by
  an automatic pass. A leader the user dragged passes through its stored end point.
- **N5. No label overwrites a Text object.**

(There is no N2. A leader crossing another leader is a heavy cost, not a ban: Tom, 2026-09-28,
*"Let's remove N2."*)

### 3. What good looks like, in order

After the rules above, in this order (Tom, Q02):

1. **Do not cover a leader with a label.** It hurts reading. A big penalty, not a ban.
2. **Speed.** See §3.3.
3. **Use the space nearby well.** If a label cannot find good space near home cheaply, drop things
   rather than send it far away.

#### 3.1 What may cross what, worst first

After the never-rules, crossings cost something, from worst to least: a leader crossing another
leader (very confusing); a label on a leader; a label on a pipe; a leader on a pipe. A label on a
customer costs nothing. (Tom's weights are in Part B; builders get the order only, his ruling of
2026-09-28.)

#### 3.2 Space

- **S1. Near home first.** A label stays beside its node when there is room there. It moves out
  only when its own neighbourhood is crowded, and then to the nearest good place: *"Don't move far
  away when there is a perfectly good beautiful place in the next valley over."* Travel is
  expensive; distance is a cost that rises with every step away. (Q04)
- **S2. Grow toward the open side.** A label that may get longer (a longer ID, another digit) is
  anchored on its crowded side and grows toward its open side. A column of labels hangs on one
  shared edge: when the open ground is to the west, the column is right-aligned on a shared east
  edge, and every row grows west into the empty ground. No space is held in reserve for growth
  that points into open ground. (Tom's rule (a), 2026-09-27.)
- **S3. If there is no attractive space further away, drop rather than travel.** If the network
  runs off the screen, zooming out doesn't free unlimited room and a heroic leader solves nothing;
  fit all in the available space or drop properties and possibly labels. Expect more full labels
  as you zoom in. (Tom's wording, 2026-09-28.)
- **S4. When space runs out, give up in this order:** give up on wholeness and proximity to home
  node; give up on wholeness even on a longer leader at an attractive open space; give up on
  showing more than a single property as determined by drop order; give up on showing the label
  at all. (Tom's wording, 2026-09-28.)

#### 3.3 Time

- **T1. Never get in the way of the user's zooming and panning.** Do no placement work while a
  pan or zoom gesture is under way. Once the view settles, the best layout for the new view wins:
  there is no reward for a label staying where it was, and no penalty for a label moving to show
  more. What is penalised is CHURN: a label that moves while nothing it depends on changed (view,
  network, text), or that moves and gains nothing. (Q08, corrected 2026-09-28; see Part B.)
- **T2. Think during the breathers.** Hard placement work waits for idle time, and what it finds
  is cached for later zooms: *"Found an excellent green meadow over those mountains!"* A few
  seconds of background work when a project opens is acceptable if it buys instant zooming
  afterwards, provided the cache is good. (Q03, Q08)
- **T3. A cached answer is thrown away when what it depended on changes**: the network, the label
  contents, symbology or appearance settings.

#### 3.4 Shape

- **H1. Each kind of label starts in its usual shape.** It may wrap or unwrap to use space better
  and is rewarded for it, but it is lazy and usually doesn't because that takes time. (Tom's
  wording, 2026-09-28.)
- **H2. Leaders are straight.** One standard hook, the same short shape for every leader, is
  allowed if it helps. No shape invented for one label. (Q06)

### 4. Scope and order of work

- **One system for node labels and pipe labels, built first**: a map of the network's real
  estate (where things are, where the free space is), which both use. Customer labels and Text
  are built after, and may read the same map. (Q10)
- **Who gives way:** customer labels give way first and easily. Text is user-placed and never
  gives way. (Tom's wording, 2026-09-28.)
- **The interface you build to is a pure function**, with no page and no DOM: the network, the
  symbols, each label's rows and sizes, and the view go in; each label's position, its shown
  rows and its leader come out. The bench (§4.1) calls it exactly that way. `js/lpn-collide.js`
  on master is an example of that style, not a design to copy.

#### 4.0 Ideas you may use or ignore

Offered in general terms on Tom's suggestion (2026-09-28); none is required, and a better idea wins.

- The industry-standard nearby positions around a point: the quadrants beside it, tried in a
  preferred order.
- Open sectors: the directions around a node that nothing occupies.
- A box model of open space: the free ground near a node described as rectangles a label could
  stand in.
- A per-zoom lookup table: what a node's best spot is at each of a range of zooms, found once and
  reused.
- A ranked gap list: for each node, the angular gaps between the pipes leaving it, widest first.
  The widest gap is usually the most open direction for its label.

#### 4.1 The bench

Every candidate runs the same scenes and prints the same scores: breaks of N1, N3, N4 and N5 (must be zero),
the crossing cost (Tom's weights, Part B), values shown, labels shown, leader length, how far labels move between two
zooms, and time per layout on a named machine. Scenes include EPA Net1, Net2 and Net3, and Net3 on
the world map near Novato at several zooms with three properties per node.

---

## Part B: held back from the builders

### 5. For Tom and the judges

**Why two builders, and why they don't see our code** (Q01 = A, Q12 = A): two independent agents
build from Part A and the bench alone, in a clean room. Tom picks between the two finalists side by
side on preview ports. `feat/label-gang-search` never merges as a placer; its harnesses and scenes
become the bench, and it is deleted when the rebuild lands.

**Secret tests the builders are not told about** (Q11 = C: *"a secret surprise test that we don't
want them to build to"*):

- **R-075, the 12345678 test.** Add 12345678 to the node ID prefix; nothing shown moves or hides
  where free space exists within reach. Rule S2 is what should pass it.
- **His two screenshots of 2026-09-27** (local only, in `dev/screenshots/`, which is not
  tracked):
  - `label-couch-2026-09-27-overwrite-185-183.png`: node 185's label written over node 183's,
    south of South Novato Boulevard. Breaks N1.
  - `label-couch-2026-09-27-gang-runs-south.png`: a stack of about eight labels (184, 163, 265,
    183, 169, 179, 177, 271) hung in one column far south of their nodes, with two empty gaps in
    the stack and leaders running off the bottom of the screen, while open ground lies west.
    Breaks S1 and S3; S2 says the column should hang on its east edge and use the ground to the
    west.

**Tom's crossing weights**, 0 to 1 (Q05): label on Text 1, label on symbol or label 1, leader on
leader 0.9, label on leader 0.7, label on link 0.3, leader on link 0.2, label on customer 0. The
bench scores with these; builders see only the order (his ruling, 2026-09-28).

**His ideas, remembered.** Quadrants, sectors, boxes, the per-zoom table and the ranked gap list now
go to the builders in general terms (§4.0), on his suggestion of 2026-09-28. Held back still: `spot_prime` and
`box_est` (`dev/label-placement-algorithms.md` §9b-§9d); the four corner positions and the zoom at
which each stops working (R-077); a per-node lookup table of good places across a range of zooms
(R-076); the ranked list of gaps between a node's pipes (R-079); leader angles on a 15-degree grid
(`dev/label-placement-goals.md` §2), held back on his ruling of 2026-09-28: *"I am discovering that
long leaders naturally tend to align by not crossing and that short leaders don't gain a lot by
snapping to those angles."*

### T1 corrected, 2026-09-28

Round 1's T1 read *"Hold every label still while the view moves, until it is forced to move"*, and
the bench scored every move between zoom steps as "unforced". Both builders therefore refused to
regrow dropped rows on zoom-in. Tom: *"There is no reward for holding still, is there? There is only
a reward for being fast. [...] Did you mistakenly reward them for holding things still, and if so,
what was the origin of that idea?"* The origin was the orchestrator's own Q08 option "Hold still
until forced", recommended partly because it made a lookup table cheap; his answer had said *"hold
until there is a breather [...] Think about placement during dead times"*. His real complaints
(Task 680 labels jumping on a tab switch; R-075) are about moves that gain nothing, which is what
T1 now penalises, and the bench must count the same thing.

### His review, 2026-09-28, verbatim

1. Leader on leader: *"Let's remove N2."*
2. The 15-degree angles: *"Hold it back as an idea. I am discovering that long leaders naturally
   tend to align by not crossing and that short leaders don't gain a lot by snapping to those
   angles."*
3. Numbers or order: *"Only the order, I think."*
4. What I got wrong: *"To be honest, your attempt makes me despair. Keep trying."* Then his
   rewrites of N5, S3, S4, H1 and W2, applied above word for word, and: *"We could try giving the
   builders some of our ideas in a general way as prompts (industry standard nearby quadrants, open
   sectors, box model of open spaces, a per-zoom lookup table, the ranked gap list (I don't know
   what this is. Will they?))"* -- the ranked gap list is explained in §4.0.

---

## 6. His answers, verbatim

**Q01, who builds the new placer:** A (two independent agents, clean room).

**Q02, rank what matters:** speed 1. *"What about inviolate rules? Those go without ranking as
primary? 1. No crossing leaders and no overwriting symbols or labels. 2. Avoid overwriting (and
masking) a leader; it reduces readability; big penalty. 3. Speed 4. Either use the available space
nearby well or, if you can't figure out how to do that efficiently, drop things when they get too
far away (because you are blind to good space use). Let me know if these are terrible rules."*

**Q03, how fast:** C. *"If we can pre-cache this in a quality way, I am up for it. I really don't
other wise have clarity on this, and I trust your judgment."*

**Q04, near first or spread out:** A. *"A. Space near me is efficient. Travel is expensive. "There
is no place like home". The rule "Use space well" can be expanded as "Don't move far away when
there is a perfectly good beautiful place in the next valley over." "Don't go overseas for love
when there is love at home.""*

**Q05, crossing costs:** *"Label on Text: 1. Label on Symbol or label: 1. Leader on leader (very
confusing): 0.9. Label on Leader: 0.7. Label on Link: 0.3. Leader on Link: 0.2. Label on Customer:
0.0"*

**Q06, may leaders bend:** *"A standard hook is a nice feature. Standard, yes. Ad hoc, no. I doubt
that landings/hooks/doglegs will make our job easier. That is why I have not suggested them. They
are more readable, but they don't help us. If we try them, they should be short."*

**Q07, one line or stacked:** A. *"Each label starts with the assumption for its species. If it
finds it can use space better by wrapping or unwrapping, it gets a reward. That is good initiative
and innovation. But since it's lazy (speed is a premium), it usually will do the default thing."*

**Q08, zoom: hold still or re-optimise:** A. *"Or hold until there is a breather. Don't interfere
with the user's zooming with complex placement cogitations. Think about placement during dead
times, and cache your discoveries. "Found an excellent green meadow over those mountains!""*

**Q09, what goes first:** *"The order today sounds pretty good to me. Reconsidering it
independently now, it seems to me that probably we will normally have and expect more full labels
as we zoom in. This, interpreted logically, means that we drop labels rather easily. And this
obviously must be the case in the model with infinite extent where zooming out more doesn't free
up infinite space. But if we have it, let's use it. Cycling back, this seems to confirm the order.
Heroic leaders solve everyting only for a non-infinite model. When the model extends beyond the
screen, heroic leaders are useless."*

**Q10, one placer or node labels first:** *"Text is manual and independent and yield last if at
all, I think. Customers are subservient and yield first. Nodes and links should be placed
together, I think. But when you say "build", you mean code, right? I think we must build node and
label placement code as one system (network real estate map, etc) and built first so that text
and customer can use the knowledge if handy."*

**Q11, the 12345678 test:** C. *"I'm note sure I want it known. I'd consider it a secret surprise
test that we don't want them to build to. There's nothing special about it, and they shouldn't
build to it. They should build to "Use convenient available space effectively"."*

**Q12, the old branch:** A. *"And use it to write rules for me to review. I proposed some ideas
(quadrants, sectors, and boxes). Maybe we shouldn't show them to the builders. But we should
remember them."*

**Q13, anything else:** *"Use convenient available space effectively and drop properties, then
labels when else fails. Anybody who finds an efficient way to do that will win."*

**After the interview, 2026-09-27:** *"The flaws you revealed are so fundamental that I am tempted
to tell you to fix them and to stay the course. But I am not going to do that. I am going to tell
you to write the rules for the new builds starting with (a) Hang the same column right-aligned on a
shared east edge and every ID grows west, into the empty ground you pointed at. No row is held and
no gap is needed. Both rules then pass. (b) Treat free space as fundamental; Use space well. That
is not only human, it is biological; it is real."*
