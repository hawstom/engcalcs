# Label placement rules for the rebuild

**Status: ROUND 3, Part A as his round-2 markup of 2026-09-28, plus R14 and R15 from his browser pass the same day** (`dev/label-placement-rules-v2-draft.md` retired into it). Round 1 was reviewed by him the same morning. Written from his interview answers of 2026-09-27
(the couch, https://claude.ai/artifact/PyZpPyHbpACHsu7fHVZEZJ, 13 answers) and his two instructions
that followed it, then revised with his review of 2026-09-28. His answers, verbatim, are in §6.

Part A (§1-§5) is what the two builders receive. Part B (§5-§6) is held back from them on his
ruling (Q11, Q12) and is for him and for the judges.

Tom's §1 definitions in `dev/label-placement-goals.md` still hold. Where §2 of that file (the
2026-08-16 goal order) disagrees with this one, this one is newer and wins.

---

## Part A: for the builders

Round 2, from Tom's markup of 2026-09-28. **Every line in §1-§3 is an outcome the result must
meet; §4 is ideas you may use or ignore.** His principle: *"Don't dictate strategies. Maybe hint,
but don't dictate."* How you get there is yours.

### 1. The goal

- **G. Use convenient available space effectively, and drop properties, then labels, when all else
  fails. Restore labels, then properties, when space becomes available.**

### 2. Never

A layout that breaks one of these is wrong, however good its other numbers.

- **N1. No label overwrites a symbol or another label.**
- **N3. No leader passes through another node's symbol.**
- **N4. A hand-placed label stays where the user put it and is never hidden.** A leader the user
  dragged passes through its stored end point.
- **N5. No label overwrites a Text object.**

(There is no N2.)

### 3. What the result looks like

**Costs, worst first:** leader on leader is very high cost; label on leader is high cost; label on
pipe is medium-low cost; leader on pipe is very low cost. A label on a customer is free.

- **R1. Hide a label only because there is no room for it on screen. Never hide it because of how
  many labels are already showing.** When space runs out, give up in this order: (1) nearness to
  home if there is convenient available space; (2) wholeness; (3) properties that won't fit, by drop
  order; (4) the label itself.
- **R2. If there is convenient available space, use it if that saves a neighbour's properties.**
- **R5. Basic leader conventions:** label text is justified to the leader side, never to centre or
  to the far side.
- **R6. Leaders are straight.** One standard short hook is allowed; no shape made up for one label.
- **R7. A pipe label sits beside its pipe by default, not on it,** and recovers the default
  position when there is space available.
- **R8. Label properties may be concatenated or stacked** in any way that uses available space best
  to show more of what was requested.
- **R9. A pipe longer than the repeat spacing carries its label more than once,** evenly along it.
  The spacing is `scene.text.repeatSpacingPx`, which the bench sets. (Master does this today.)
- **R14. When there is space available, honor the setting about aligning labels to pipes.**
  Values outrank alignment: an aligned label showing one value fewer does not beat a level label
  showing one more. But alignment is required wherever the same rows fit aligned.

#### Time and change

- **R10. Placement never slows a pan or zoom while it's under way. A layout's cost depends on what is
  on the screen, not on how big the network is. After a zoom settles, labels are back within about
  one second on a network of any size; if the layout is not finished by then, show what is placed
  and keep improving it.** (Second sentence from round 5, confirmed by Tom 2026-10-06; the bound is
  his number, chosen 2026-10-06.)
- **R11. When zooming in frees room, dropped properties and hidden labels come back.**
- **R13. The layout always reflects the current network, text and settings.**
- **R15. Avoid showing the user drastic shifts.** For example, when jumping into an untested
  (unfamiliar) view, hide the labels immediately while you calculate positions instead of showing
  them in unconfirmed positions while you calculate placements. This is to avoid showing the user
  a drastic shift once you finish calculation. The hiding lasts no longer than R10's one second.

### 4. Hints (may use or ignore)

- **H-a.** A concatenated (single-line) label on a leader may use unlimited available horizontal
  space better than a stacked label.
- **H-b.** Hard thinking can wait for pauses and be cached across zooms.
- **H-c.** A label that may grow can hang on its crowded side and grow toward open ground.
- **H-d.** It may save placement time to store a tiled model of the available space in and around
  the network. This model might catalogue the available standard quadrants (per the literature)
  near a node; the open sectors between the pipes meeting at a node, widest first; open space as
  boxes that can hold labels; and a per-zoom lookup table.

### 5. The job

Not rules about the result; the mechanics of the task. Build one system for node labels and pipe
labels. It is a pure function with no page and no DOM, `dev/lpn-spike/label-bench/contract.js`: the
network, the symbols, each label's rows and sizes, and the view go in; each label's position,
shown rows and leader come out. The bench (`dev/lpn-spike/label-bench/`) runs every candidate on
the same scenes (EPA Net1, Net2, Net3, and Net3 on the world map near Novato at several zooms) and
prints the same scores: breaks of N1, N3, N4 and N5 (must be zero), crossing cost, values and
labels shown, leader length, churn (a label that moves between two views and shows nothing more
for it), and time per layout.

The setting R14 names is the user's "Draw link labels along the link line" (Settings, Symbology,
Labels). A scene carries it as `scene.settings.alignPipeLabels`, with the reading window a turned
label keeps to, and each pipe label it applies to says `along: true` (a label the user dragged opts
out). R15's hiding and showing is the page's job, since a placer never touches the screen; a
placer's part in it is to be quick.

---

## Part B: held back from the builders

### 5. For Tom and the judges

**Why two builders, and why they don't see our code** (Q01 = A, Q12 = A): two independent agents
build from Part A and the bench alone, in a clean room. Tom picks between the two finalists side by
side on preview ports. `feat/label-gang-search` never merges as a placer; its harnesses and scenes
become the bench, and it is deleted when the rebuild lands.

**Secret tests the builders are not told about** (Q11 = C: *"a secret surprise test that we don't
want them to build to"*):

- **R-075, the 12345678 test.** Add 12345678 to the node ID prefix; nothing shown hides or loses
  values where free space exists within reach. Moving to make room is allowed (his ruling of
  2026-09-28, below). Hint H-c (round 1's S2) is one way to pass it.
- **His two screenshots of 2026-09-27** (local only, in `dev/screenshots/`, which is not
  tracked):
  - `label-couch-2026-09-27-overwrite-185-183.png`: node 185's label written over node 183's,
    south of South Novato Boulevard. Breaks N1.
  - `label-couch-2026-09-27-gang-runs-south.png`: a stack of about eight labels (184, 163, 265,
    183, 169, 179, 177, 271) hung in one column far south of their nodes, with two empty gaps in
    the stack and leaders running off the bottom of the screen, while open ground lies west.
    Breaks R1 (round 1's S1 and S3); H-c (round 1's S2) says the column should hang on its east edge and use the ground to the
    west.

**Tom's crossing weights**, 0 to 1 (Q05): label on Text 1, label on symbol or label 1, leader on
leader 0.9, label on leader 0.7, label on link 0.3, leader on link 0.2, label on customer 0. They
live in `dev/lpn-spike/label-bench/judges/weights.js`, and the judge reports the cost weighted with
them; the public bench counts by rank, so builders see only the order (his ruling, 2026-09-28).

**His ideas, remembered.** Quadrants, sectors, boxes, the per-zoom table and the ranked gap list now
go to the builders in general terms (§4, H-d), on his suggestion of 2026-09-28. Held back still: `spot_prime` and
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
   what this is. Will they?))"* -- in round 2 the ranked gap list is folded into open sectors, widest first (H-d), at his asking.

### Round 2, 2026-09-28: what his markup changed

His markup of the v2 draft, applied to Part A word for word. He: *"I deleted things I thought were
strategy, redundant, or wrong."* So these are GONE, not held back, and must not be re-proposed
without him: round 1's S3 ("drop rather than travel"), the "who gives way" line (W2), the
no-churn rule (draft R12), and the separate "closer to home is better" cost (draft R1, folded into
the new R1's order). T2 and S2 survive only as hints H-b and H-c.

- **Costs now carry his magnitude words** (very high, high, medium-low, very low, free), his own
  markup; the numbers in §5 stay ours.
- **H-d's "ranked gap list" and "open sectors" are one idea** (the angular gaps between a node's
  pipes, widest first), merged on his *"clarify [...] or combine them"*.
- **R8 stays a rule and unwrapping stays a hint (H-a)**: his *"Stay a hint."*
- **R9, repeats: his words were** *"On master, pipe labels are repeated with a spacing of screen
  size (max of width or height) / 4."* **Master's code says otherwise**: `labelRepeatSpacing()` is
  0.75 x the SHORTER side as a ceiling, so repeats land (0.375, 0.75] x min apart. **He ruled
  on 2026-09-28: *"Master."*** The spacing stays master's, 0.75 x the shorter side as a ceiling.
- **"Ours, not given to the builders" kept the build order, interface and bench.** Read as: not
  given as RULES. A clean-room builder cannot build without the contract and the bench, so Part A
  §5 hands them over as the mechanics of the job, stated as such.
- **Churn is still measured, never ruled.** The bench reports it (a move that shows more is not
  churn); nothing fails on it. His Task 680 and R-075 complaints stay in the secret tests.

### Round 2 browser pass, 2026-09-28: R14, R15, and R-075 rewritten

He looked at C (8132, `?placer=c`) and D (8133, `?placer=d`) on the real map. His words:

- *"Our rules are getting better, and this is very fruitful."*
- *"C ignores the setting to align pipe labels to pipes. But performance is good."*
- *"D produces some transient strange behavior; labels at the bottom of the screen."*
- *"Maybe we can add two rules: (a) When there is space available, honor the setting about
  aligning labels to pipes. (b) Avoid showing the user drastic shifts. For example, when jumping
  into an untested (unfamiliar) view, hide the labels immediately while you calculate positions
  instead of showing them in unconfirmed positions while you calculate placements. This is to
  avoid showing the user a drastic shift once you finish calculation."*
- On R-075 (long IDs moved 67% of shown labels in C, 66% in D, 13% in master): *"The test is
  faulty. Their behavior is gold. See if you can rewrite the test. And we should have a test for
  link label alignment since that seems to be elusive with all four; actually that indicates a
  rule flaw. Do we need to examine the rules again?"*
- On the repeat spacing: *"Master."*

**R14 and R15 are his (a) and (b)**, added to Part A §3 in his words, edited only to stand as rule
sentences.

**The rule flaw he suspected was real, and it was ours, not the builders'.** Neither Part A nor
the contract ever told a placer the alignment setting existed: the scene carried no settings at
all, a pipe label arrived as `layout: 'line'` with no angle, and R7 ("beside its pipe, not on it")
read naturally as a level label beside the line. All four clean-room placers answered the brief
they were given. Every bench scene is saved with the setting on. The scene now carries it
(`scene.settings`, and `along` on each pipe label it applies to), Part A §5 names it, and the
bench reports R14; the judges assert it (at most 5% of the pipe labels asked, drawn otherwise
where an aligned spot beside the pipe was free; master misses none).

**His ruling on R14, 2026-09-28**, answering builder C's question "Should an aligned label
showing one value fewer beat a level label showing one more?": *"No. The problem was that at any
close zoom whatsoever, pipe labels stayed horizontal. There's nothing wrong with their being
horizontal, and there's nothing especially urgent about making them aligned. But Use available
space. If they are still horizontal when there's no good reason to ignore the user setting, that's
bad."* Part A's R14 carries it as one clarifying line. The bench reports, and the judges assert,
his actual complaint: at close zoom (4x and closer), of the pipe labels still level, the share that
had room to lie along their pipe with the same rows (at most 5%; round 3 had C 21%, D 30%). With it,
R13 on a settings change: the setting switched off at the same view leaves no pipe label turned
(round 3 kept 106/240 and 108/250, which his pre-reviewer saw on the page).

**R-075 now measures what his original complaint named**: longer IDs must not hide a label or
cut its values where free space exists within reach. A move is no longer a failure; the moves are
reported only (`judges/README.md`).

**Tom's crossing weights moved out of `score.js`** into `judges/weights.js`: the public bench now
counts each crossing by its rank in the order, and the judge reports the weighted cost.

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

### Round 5 proposals, his answers, 2026-10-06

- **R10 scale sentence:** yes, as written. **The bound after a zoom settles:** one second.
- **R11 tightened to "zooming in never hides a row that was showing":** no.
- **A definition of "convenient available space":** no. *"No. This is micromanagement. This is what
  we are running this experiment for. If they all converge on a rule like this, let's stand amazed.
  If not, let's hold our peace."*
- **R1 "dropped for lack of room, never by a count or a rank":** to be reworked and brought back.
  *"Rethink this, reword this, refine this, and bring it back to me. I can see that it is
  fundamental (discretionary environmental constraint, not a control knob), not to be discovered.
  But I don't know what it's saying."*
  **Reworded and brought back; Tom, 2026-10-05: yes.** The rule: *"Hide a label only because there
  is no room for it on screen. Never hide it because of how many labels are already showing."*
  Tom: *"Yes. This seems so obvious as to be trivial."* It now heads R1 in Part A, word for word;
  the judges test it (`judges/README.md`, "R1").
- **Bench: bent pipes, valves, large networks, fresh secret scenes every round:** yes.
- **At dense zooms, bare IDs or no labels:** *"We can't hard-code a rule like this. In the current
  default settings, ID is the first thing to drop. Since the user decides drop order (meaning they
  really want to see what they asked for), it might be best to prioritize more labels with a single
  value left than less labels with more values left."* Not yet a rule; round 6 should test it.

