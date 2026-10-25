# Declan on assemblies and expert levels, 2026-10-23

## 1. Gestures: bare link vs assembly, times 400

OBSERVED (js/looped-network.js:57559-57590): the pump/valve tool takes a click on node A, then a click on node B, and then carries on from B (setPendingLinkFrom). Both nodes must already exist. A bare pump costs 1 click on a chain, plus the two junctions it lands on (the Chain tool, add-chain, already places junction+pipe per click, :52851).
SPECULATION: an assembly has to be oriented. A place-point tool (1 click, then a direction) costs 2 gestures plus a hidden node pair; 400 of those is 800 gestures, worse than the 400 of a bare link on a chain. **Splice onto a pipe is the only version that wins**: one click ON an existing pipe splits it, inserts upstream node, pump, downstream node, and inherits direction from the pipe. 1 gesture each, 400 total, and no orientation question. I want splice to be the default behaviour of the assembly tool; free-standing placement is the fallback.
Disagreement with Tom Q1: "assembly initially offered" in the toolbar cycle is fine for a first-timer, but a cycle costs a click per switch to flip back. OBSERVED the tools have digit keys (:74413: 6 pump, 7 valve). Give the assembly its own digit, or Shift+6, not a cycle. A cycle is cheap only if the choice persists per browser (furniture, not project).

## 2. Auto-naming

SPECULATION, my proposal: assembly P3 mints nodes `P3.U` and `P3.D`, or `P3-1`/`P3-2`. Not `J47`/`J48`: the whole point is that a name tells you the owner. OBSERVED mintId (:3962) is the one id door and refuses a taken id; reuse it with the owner prefix. EPANET ids are space-free, so no spaces. Rename of the pump should offer to rename the nodes, one tick, default on, never a dialog.
Import of a lazily drawn network: **do not detect assemblies**. Two coincident-or-near junctions either side of a pump is a heuristic and a silent change to the user's model. Offer one muffleable command, "Convert pumps and valves to assemblies", that previews the count ("212 pumps, 188 valves") and can be undone. Rename-on-convert is the dangerous part: every Find, Tables filter and scenario override keyed on J47 breaks. Convert keeps the old ids and records the assembly as metadata; names only apply to NEW assemblies. Export must stay character-exact (CLAUDE.md), so the assembly record rides in a `;ASSEMBLY:` comment like the `;PUMP:` curve comment, never in the data lines.

## 3. Coincident nodes in Tables and Find

OBSERVED: the Junctions table has X/Y columns now (paneColCoord, :17097), so coincident nodes show identical coordinates and look like duplicates; a clerk will "fix" them. Required: an Assembly column (owner id, blank for plain), filterable, so "Assembly is not blank" hides or isolates the 800 nodes. Default-hide them from the Junctions tab? No. Hiding rows makes 400 rows look like 0 and breaks the paste-by-row-count mental model. Keep them, sorted by ID, and let Hide be the clerk's own filter. Also: elevation is auto-equal, so the pair must be one edit, not two. Editing the upstream node's elevation in a cell writes both (SPECULATION, needs the "Manage as assembly" state to be what decides). Find must not return both for a pick-by-location, or a click on the map selects two items (OBSERVED snap is 14 px, :3552, so a coincident pair is unpickable individually by design).

## 4. "Manage as assembly" toggle

It costs keystrokes only if it is a checkbox in every popup (Tab stop x 400). Put it on the pump's popup as the LAST field, or better, as a right-click/Tables column; the Explode tool Tom suggests is better than a toggle, because explode is a one-way, rare gesture and a toggle is a state a clerk must verify on every row. Position: **no toggle; assembly plus Explode, undoable.** Uncheck-with-coincident-nodes is exactly the unpickable pair above.

## 5. Expert levels, from someone who knows what they are doing

OBSERVED: tip show delay is 500 ms, one constant (js/Calculators.lib.js:242, per-control override at :297, data-ec-tip-delay). A keyboard user never hovers, so tip delay costs me nothing; **it is mouse hover and focus that fire tips over what I am typing** (focus-armed tips). Stopper dialogs that duplicate a tip are the worst idea in the brief: 400 dismissals. If Tutorial mode has them, they must be the first thing Expert mode removes, and Tutorial must be opt-in per session, not a level one is demoted from.
Three levels is a Tom decision I can't judge; my position: tip delay and stoppers are one switch ("Hints"), not a level. A level that bundles unrelated muffles forces me to take the bad with the good. Tom said muffleable; make each one muffleable.

## For my wish list
- A1. Assembly tool splices onto an existing pipe in one click; free placement is secondary. Size: medium.
- A2. Assembly column in Tables (owner id, filterable); pair edits as one. Size: small-medium.
- A3. Convert-to-assemblies command with a count preview and undo, never automatic on import. Size: medium.
- A4. Hints as a single user switch independent of any level; stoppers never default. Size: small.
