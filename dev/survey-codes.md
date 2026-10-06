# Survey field codes (Task 771)

The rules for reading a surveyed point's Description as field codes. The code lives in
`js/lpn-survey.js` (`lpnSurveyCodePlan`) and `createSurveyNodes()` in `js/looped-network.js`; the
harness is `dev/lpn-spike/survey-codes-harness.js`. Research behind every convention:
`dev/agents/market-researcher/survey-codes.md` (Mary, 2026-10-05).

Tom, 2026-10-05: interpret a point's Description as an asset or a pipe vertex, and the CSV as a
batch. Tom, 2026-10-06: reuse Carlson's JPN (Civil 3D's CPN) for a tee; *"I'm a little shy to
invent conventions."* So **nothing here is ours except the table defaults' wiring and the rules
for what cannot be honoured.**

## Opt-in

- One tick in the existing survey import box: **Read the description as field codes**. It starts
  unticked every time. Unticked, the import is exactly the junctions-only Task 592 import.
- The code table is in the box, per import, and stored nowhere (no new device storage).
- The box's Asset type stays the answer for a point with no description or with a code the table
  does not hold.

## What is read

| Syntax | Meaning | Source |
|---|---|---|
| First word of the Description | The feature code; looked up in the table, case-insensitively | Carlson Special Codes (2021); Civil 3D (code first, space-delimited) |
| `WL1`, `WL2` | Code plus a line number: the same code, separate lines | Carlson Special Codes, same-code joining |
| `FH.WL1` | Several codes on one shot, joined by dots | Carlson Field to Finish manual (`.TC.EP.FL`, `WV.W1`) |
| `+0` / `-0` | Start / end a line | Carlson Special Codes, PointCAD format |
| `CLO` | Close the line back to its first point | Carlson Special Codes 3.13 |
| `JPN<point>` | Join this point to the named point | Carlson Special Codes 3.28 (`JPN73`, `EP1 JPN205`) |
| `CPN<point>` | The same, Civil 3D's spelling | Civil 3D (search summaries; Tom approved accepting it 2026-10-06) |

Default table, from PennDOT "Survey Feature - Codes" (Domestic Water): `WL` pipe; `FH`, `WV`, `WM`
junction; `WELL` reservoir; `CIST` tank. The reader edits, adds and removes rows; a code maps to
Junction, Reservoir, Tank or Pipe.

Not read, and reported if written: Civil 3D's `B`/`E`/`C`, Carlson's `+4`/`+5`/`+7` and other
special codes, curves, offsets, Carlson's `#CODE` prefix numbering. A word that is not read stays
in the node's description.

## How the network is built

- **Points with one line identity join in file order** (Carlson). `+0` or `-0` is the only thing
  that breaks a line.
- **A JPN on a line's first point starts the line at the target** (Carlson's documented case). **On
  the last point it extends the line, and on an inside point it is a pipe of its own: both are our
  extension of Carlson**, which documents only the segment from the coded point. The target is a point in the file, else a node already in
  the project, else reported. A JPN needs a line code on its point.
- **EPANET-honest: a pipe has two end nodes.** A node is: a node-coded point, an uncoded point,
  every line end, every point on two lines, every JPN target. A line ending on a vertex-only point
  makes it a junction. Only points strictly between two nodes become vertices.
- **A ring is never lost.** A stretch that would leave and return to the same node (a `CLO` line
  with no other node on it) makes its last vertex a junction, so the ring is two pipes, reported.
- Pipes take the New assets defaults and an automatic length from their drawn geometry. A vertex on
  a georeferenced project keeps the file's own double.
- One undo snapshot for the whole file.

## Reported, never dropped or guessed

Line notes, all warnings (the row made something), printed in the Task 592 shape
`Line N: warning: code: sentence`: an unknown code, two node codes, words that are not codes, a JPN target not
found, a JPN with no line code, a pipe that would return to its only node, a one-point line, a
point that became a junction to close a ring, a zero-length pipe (two nodes at one spot), and a
node shot exactly on a pipe it is not joined to. **Coincident shots are reported, never merged.**
File notes: how many points became vertices of drawn pipes (a vertex keeps no name, elevation or
description), and a file with no description column. Every Task 592 refusal still applies.

With codes ticked the button reads Create (it makes pipes too); unticked it reads Create nodes.

## Open

- Crossing pipes with no shared node are not reported yet (Mary's item 6).
- Civil 3D's `CPN` rests on search summaries; Tom owns Civil 3D and could confirm.
- An SI project's import crashes on master (no default pipe diameter); fixed on its own branch,
  so this harness runs in US units only.
