# Paper notes: label placement

Working notes toward a possible paper on the label-placement rebuild (Task 539). Tom is the author
and the voice; this file collects his framing and the sources to read, dated. Citations below are
from memory and are **not yet verified** — check each before it is quoted.

## His framing, verbatim

- 2026-09-28: *"Placement and translation: We are starting to get to exciting science that I look
  forward to publishing."*
- 2026-09-28: *"Publishing: I am 100% the student. We have to combine my tone and style with
  academic standards."*
- 2026-09-28, why it may have legs: *"it seemed foolishly audacious to me from the outset as in
  'Nobody tries to show all the labels. Don't do it, fool!' Maybe Mary can find out how bad a fool I
  am or whether I am just a town boy unaware of the state of things where the cool kids play."*
  Mary's answer, same day (`dev/agents/market-researcher/journal.md`): a genuine outlier against
  the field's own founding retreat (prove it NP-hard, then drop labels), not proven impossible, and
  apparently unattempted in the corner we occupy: several values per label, dropped row by row and
  restored on zoom-in. Novelty is not certified until a real citation-database pass.
- 2026-09-28, threats to validity: *"It's all Net3. Where's the infinite map?"*
- 2026-09-28, prior work: *"Invoke game theory, evolutionary algorithm selection, and the case of
  the prisoner's dilemma and the tit for tat with forgiveness strategy."*

## Threat: every scene is a small EPANET example

The bench runs Net1, Net2, Net3 and Net3 on the world map near Novato. A method tuned there may not
hold on a large or dense system. Remedies, to decide:

- **Published benchmark networks** at utility scale (to verify availability and licence): the
  Kentucky set (KY1-KY15, University of Kentucky), C-Town and L-Town (BattLeDIM), Anytown, Modena,
  Balerma, Richmond.
- **"The infinite map"**: a generator that produces networks of any size and density on demand
  (street-grid, radial, rural branched), so a placer is scored on scenes nobody tuned against. A
  fresh seed per round also answers the leak threat below.
- Other threats already on record: all builders are the same kind of AI; the numeric crossing
  weights leaked to builders in rounds 1-2 (moved to `judges/` 2026-09-28).

## Prior work to read

- **Tournaments of independently written strategies:** Axelrod, *The Evolution of Cooperation*
  (1984), and his computer tournaments of 1980. Our clean-room rounds are the same design: entrants
  who do not see each other, one scoring bench, repeated rounds, rules refined between them.
- **Forgiveness:** Nowak and Sigmund on generous tit-for-tat (Nature, 1992); Molander (1985) on
  noise and forgiveness. The label analogue: a label gives way to a crowded neighbour, and takes
  its room back when room returns (R2, R11) — cooperation with forgiveness, not permanent yielding.
- **Algorithm selection:** Rice, "The algorithm selection problem" (1976); later portfolio and
  evolutionary selection work. Choosing among C and D by bench and by Tom's eye is selection;
  refining the rules between rounds is the environment changing under the population.
- **Automated label placement itself:** Imhof (1975) on cartographic label positioning;
  Christensen, Marks and Shieber (1995) on simulated annealing for point-feature labelling; the
  NP-hardness results for map labelling (Formann and Wagner, 1991).

## Record kept per round

Each round's bench table and each builder's interview (`dev/label-placer-interview-*.md`) stay in
the repository; a later round never overwrites an earlier one.
