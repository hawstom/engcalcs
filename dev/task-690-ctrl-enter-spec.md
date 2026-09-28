# Build spec: Ctrl+Enter fills a standing selection — Declan, 2026-09-27

**Gesture:** select a rectangular range (click+Shift-click, Shift+Arrow, or Ctrl+A), type into the
active/anchor cell of that range, then press **Ctrl+Enter** (Cmd+Enter on Mac) instead of Enter.
Matches Excel and Google Sheets, which both bind Ctrl+Enter to "fill selection with active cell,
selection stays." Ordinary Enter/Tab continue to collapse the selection and navigate, unchanged.

**Where it goes:** `paneHandleKey()` (`js/looped-network.js`), as a new branch checked before the
plain `key === 'Enter'` case, guarded by `jump` (Ctrl/Cmd held) and `!e.altKey`, mirroring the
existing Ctrl+D branch's placement and its `!editing` vs `editing` handling — Ctrl+Enter must work
whether or not the active cell is still mid-edit, since committing the in-progress value into the
model is the first thing it has to do.

**Behavior, step by step:**
1. If a cell is currently being edited (`mode === 'entry' || 'edit'`), commit it first exactly as
   leaving a cell already does (`paneCommitCell(active)`), so the freshly typed text lands in the
   model at the anchor cell.
2. Compute `box = paneSelBox(...)`. If there is no box, or the box is a single cell, fall through
   to ordinary Enter behavior (nothing to broadcast).
3. Read the now-committed value at `(box.ar, box.ac)` — the anchor cell, not `box.r0` — via
   `paneCellText(col, rows[box.ar])`, the same reader `paneFillDown()` uses. Using the anchor rather
   than the top-left row lets a person start the selection anywhere and still have Ctrl+Enter do
   the obvious thing.
4. For every `(r, c)` in the box except the anchor cell itself: skip the `id` column by name (same
   precedent as `paneFillDown()` and `paneDeleteSelection()` — an ID broadcast would ask
   `validateNewId()` to refuse the same collision once per row, an alert-storm Tom has already
   ruled out); skip a column with no `col.set` or where `paneCellIsPlain(col, rows[r])` is true (a
   computed/result cell refuses a Ctrl+Enter exactly as it refuses a keystroke, silently counted,
   never alerted); otherwise write via `paneWriteCellText(spec, col, rows[r], text)`, the same
   validated door as paste and fill-down, so a scenario override records through `setProp()` and a
   unit-bearing cell's typed token is carried verbatim into every target cell rather than
   reconverted per row — the same "changing a unit reinterprets, never converts" rule already
   governs a single cell here, unchanged by broadcasting it.
5. **One `saveUndoSnapshot()` for the whole operation**, taken before any write, same as
   `paneFillDown()` — and only when at least one cell in the box is actually settable; an
   all-read-only or single-cell Ctrl+Enter must not push a no-op onto the undo stack.
6. **The selection is NOT collapsed.** After the fill, call `paneSelPaint()` again (the box is
   unchanged) rather than `paneSelSet(..., false)` — this is the one behavioral difference from
   ordinary Enter that makes the feature worth having, and the reason it cannot simply reuse the
   Enter branch with a flag.
7. `completeEdit(null); refreshPopupIfOpen(); renderPaneTable(spec);` then a notice: reuse the
   fill-down notice shape — `"Filled {n} cells. {skipped} were not changed."` (new key
   `lpn_pane_ctrlenter_filled`, or reuse `lpn_pane_filled` if Tom prefers one string for both).

**Blank-as-state columns:** if the anchor cell's text is empty, broadcasting empty is a legitimate
"clear this column across the selection" and should NOT be special-cased — `paneWriteCellText()`
already knows how to write a blank/default state for a column that supports one; skip only what
step 4 already skips (id, plain, unsettable).

**Read-only / computed cells:** silently refused and counted in `{skipped}`, never an `alert()` —
identical to fill-down and paste.

**Scenarios:** every write goes through `paneWriteCellText → c.set() → setProp()`, so a fill inside
an active scenario records N overrides, one `setProp()` call per cell, inside the single undo
snapshot taken in step 5 — no new scenario-interaction code path, this is exactly what Ctrl+D
already does today.

## Acceptance tests for a harness (`dev/lpn-spike/`-style, headless)

1. Select a 5-row x 1-column range of a settable numeric column, anchor at row 3 (middle), type a
   value into row 3, press Ctrl+Enter: all 5 rows read that value; selection box is still 5x1 after
   the operation (not collapsed to 1 cell).
2. Same, but the range spans the `id` column plus one settable column: the id column is untouched
   in every row, the other column fills; `{skipped}` counts the id cells that were "not changed."
3. Range includes a read-only/result column: those cells are untouched and counted in `{skipped}`;
   no `alert()` fires.
4. Range is a single cell: Ctrl+Enter behaves as plain Enter (commits, moves down), no undo
   snapshot pushed beyond the ordinary commit's own.
5. Undo after a multi-row Ctrl+Enter restores all filled cells to their pre-fill values in one
   `Ctrl+Z`, not N.
6. Inside an active scenario, Ctrl+Enter on a base-network column records an override on every
   filled element, and the base document is unchanged (`doc` vs the scenario's override map).
7. A unit-bearing numeric column: anchor cell holds "6" displayed in inches; broadcasting to other
   rows writes the literal token "6" to each, not a value reconverted through the row's own prior
   unit (matches the "only the user touches a file's numbers" rule — the token is what the user
   typed, and setProp() interprets it per-row against that row's own displayed unit exactly as a
   direct keystroke would).
8. Blank anchor cell broadcasts a cleared/default state to every other settable cell in range, same
   `{skipped}` accounting as a non-blank fill for cells that refuse it.
