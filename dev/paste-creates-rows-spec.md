# Task 610 — paste that CREATES rows: the full spec

Written by Declan (data-entry-clerk), 2026-09-26. Destination: `dev/paste-creates-rows-spec.md`.
The pipe-vertex cell format and Tom's two other conditions were already specified in
`dev/agents/data-entry-clerk/task-610-vertex-cell-spec.md` (2026-09-09, re-verified 2026-09-19);
this file does not repeat that reasoning, it cites it and fills the remaining gaps the orchestrator
asked for by number. Provenance tags follow the usual rule.

## 1. Where the paste-to-add happens

**No blank "new row" UI element. A paste lands as an append the moment its target box starts at
or below the last existing row.** This is the ordinary spreadsheet convention already: pasting a
block that runs past a sheet's used range extends the sheet, with no separate affordance — a
clerk who has done this in Excel or Sheets once needs no explanation here. `panePasteAt()`
(`js/looped-network.js:23734`) today drops anything past `rows.length` and counts it (`:23748`,
comment `"IT CANNOT GROW THE TABLE"`). The fix is at that one line: when `box.r0 + r >= rows.length`,
instead of `dropped++`, treat the row as a candidate CREATE, validated per §3 below, rather than
discarding it. No new footer row, no dialog, no mode switch — the SAME selection-then-paste gesture
this seat already uses 400 times a sitting, now able to grow the table when the pasted block runs
past its bottom.

## 2. Required columns and defaults, per element type

**Column set = `paneCols(spec)` for that tab, unchanged.** A pasted row supplies as many of those
columns as the clerk's spreadsheet has; anything the clerk leaves blank gets the SAME default
`addNode()`/`addLink()` already give a map-drawn element (`js/looped-network.js:26569-26703`,
`settings.defaults.*`) — no new default table to invent.

- **Required on every row, no default possible:** `id` (§3). A blank ID is not "auto-mint" — see
  §3's refusal, below, since Tom's own condition is that every row CARRIES an id.
- **Junctions/Tanks/Reservoirs:** `x`/`y` (or lat/lon) required — a node with no position has
  nowhere honest to default to; `settings.defaults.center` would silently stack 400 nodes on one
  point, which is worse than refusing. Elevation, demand, tank levels/diameter: blank → the same
  `settings.defaults.nodeElev`/`.demand`/`.tankLevel` etc. a drawn node gets today.
- **Pipes/Pumps/Valves:** `from`/`to` required (§4). `verts` optional, blank = straight (per the
  vertex spec). Diameter/roughness/status/valve type/setting: blank → `settings.defaults.diameter`
  etc., exactly as `addLink()` assigns them today.
- **Elevation-from-DEM stays keyed on `settings.defaults.nodeElevSource`, not on the paste.** A
  pasted row with a filled elevation cell keeps the typed number; a row that leaves it blank on a
  DEM-sourced project queues the same `queueTerrainForNewNode()` a map-drawn node gets
  (`:26602-26609`) — a plan-set paste should not have to opt back into a project-level setting the
  clerk already chose once.

## 3. The ID rule and the refusal, worded exactly

**Validate the WHOLE pasted block before writing anything; refuse the WHOLE paste on any failure**
(argued in full in the existing spec's §2.2 — a partial commit at 400 rows leaves the clerk with no
tool to tell which rows landed). Two checks per row, both against `validateNewId()`'s own rule
(`js/looped-network.js:46738`) plus one check that function does not yet make:

1. **Non-blank, no spaces/quotes** — `validateNewId()`'s existing rule, reused verbatim.
2. **Not already in `allIds()`** — reused verbatim.
3. **NEW: not a duplicate of another ID inside the SAME pasted block.** `validateNewId()` today
   only checks against elements that already exist; two pasted rows sharing an ID is undetected by
   it because neither is in `allIds()` yet. The dry-validation pass must track IDs seen so far
   within the block itself and refuse the second occurrence as a same-paste collision.

**The refusal names the row and the reason, never a bare count:** `"Row 340: ID 'J-14' is already
in use."` / `"Row 12: ID 'J-3' is used twice in this paste."` / `"Row 88: node 'J-999' does not
exist yet — paste the Junctions tab first."` (§4). All failing rows are listed in one notice;
nothing is written until the whole block passes.

## 4. Link rows: From/To, and pasting order

**`from`/`to` must each name an ID already in `allIds()` at validation time** — either from before
this paste or created earlier in the SAME pasted block (a Pipes paste may reference a Junction row
pasted moments ago in a separate paste, but never a row from the SAME paste, since tables are
separate tabs and one paste targets one tab only). A `from`/`to` naming nothing existing is refused
with the "paste the Junctions tab first" wording above. **Practical order: Junctions (and
Tanks/Reservoirs) first, Pipes/Pumps/Valves second** — this is a workflow note for the tip text, not
a new mechanism.

## 5. Vertex cell format

`dev/agents/data-entry-clerk/task-610-vertex-cell-spec.md` §1's grammar still governs what is
ACCEPTED: lat/lon (public order) on a geographic project, x/y (plan units) on an XY-grid one, empty
= straight, whole-cell refuse-or-commit, `mergeTok()`-style source-token preservation on write.
**What is DISPLAYED and pasted back changed 2026-09-27** (Tom: the old flat `n1/n2/n3/n4/…` "is not
very readable"): a pair still reads `n/n`, but one vertex now reads apart from the next with `|`
(`n1/n2|n3/n4|…`), never a space — a space would be swallowed by `libPasteCells()`'s own
whitespace-split for a single-cell, no-tab paste. The parser accepts BOTH forms, so a table copied
before this change still pastes back losslessly; a fresh copy or paste round-trips through the new
one.

## 6. Undo

**One paste = one undo step, unchanged mechanism.** `saveUndoSnapshot()` already wraps the entire
paste before any write (`:23744`); the row-creating path takes the same snapshot before the same
loop, so a 400-row create-paste undoes in one Ctrl+Z, the same as a 400-cell edit-paste does today.

## 7. What the clerk sees after a 400-row paste succeeds

**A count broken out by what was CREATED, not a bare cell count.** Today's `lpn_pane_pasted`
("Pasted {n} cells...") is right for the edit-only case; a create-paste needs its own string, e.g.
*"Pasted 400 rows. Created 398 junctions."* — a clerk who typed 400 rows needs to know 400 landed,
not that some number of cells changed. The pasted range stays selected (existing behavior) so the
new rows are on screen, and the map redraws with the new elements exactly as a drawn node does
today (`scheduleSolve()` already fires from `addNode()`/`addLink()`).

## 8. Ctrl+Shift+PageUp/PageDn

Unchanged from the existing spec's §3: a global modifier chord, gated on `isTextEntry()`, restoring
each tab's own remembered selection rather than resetting to A1. Ship after range-copy/arrow-nav/
fill-down/paste-onto-existing, per my own wishlist order — it is real but lower-volume than the rest
of this spec.
