# Could the Tables file carry scenario structure, and come back?

Task 814, 2026-10-24. Tom: *"Why not include [parents, alternatives, inheritance]? Why not make the
Tables export as complete as possible?"* Investigated, not built.

## What the Tables export is today

File > Export > ODS, XLSX or CSV (`paneExportDownload`) writes one sheet per table, and with
Scenarios: All one sheet per scenario, each holding that scenario's resolved values (Base's value
where the scenario holds none). The Libraries ride along as sheets. It is a **write-only** door:
nothing on this page reads an ODS, XLSX or Tables CSV back. The only way back in is paste into the
Tables pane.

## What it would take to carry the structure

Adding the structure to the file is small. Adding it so the file **comes back** is not.

1. **Export side, about a day.** Three extra sheets: Scenarios (ID, name, parent), Alternatives (per
   category, which alternative each scenario names), Overrides (scenario, asset, property, value).
   The data is all in the document already (`dev/scenario-alternatives.md`).
2. **Import side, the real cost.** There is no spreadsheet reader. XLSX needs a zip reader (the
   `unzip()` in `js/lpn-gisread.js` can be reused) plus a parser for shared strings, typed cells and
   sheet names; ODS needs a second parser; a CSV zip a third. Then the file's rows must be matched to
   assets by ID, units and typed text kept exactly as the file spelled them (CLAUDE.md, "only the
   user touches a file's numbers"), differences listed before anything is applied, and one undo
   step. Round-trip means a harness over all three formats.
3. **The resolved sheets fight the structure.** A per-scenario sheet holds resolved values, so an
   import cannot tell an override from an inherited copy. Restoring inheritance needs the structure
   sheets to be authoritative and the per-scenario sheets to be read only for the cells that differ
   from the parent, which is a second matching pass.

## What already exists

`archive/feat/sheet-sync` (commit `d34a70dfb`, tag `archive/feat/sheet-sync`) is a finished
"Scenario workbook": export and import of the whole tree except Base's own values (scenarios,
parents, the alternative each names per category, every alternative's own values, settings), a
Project sheet for identity, compare-first import listing every difference, Apply or Cancel, and a
harness (`dev/lpn-spike/scenario-workbook-harness.js`). About 1,670 lines. It was parked by Tom on
2026-10-18 (ROADMAP Task 752: nobody found round-tripping a scenario tree) and archived.

## Estimate and recommendation

- Extra structure sheets in the Tables export alone, no import: about one day, but a file nothing
  can read back, which is the "completeness" Tom asked about without the round trip.
- A Tables-file import that restores parents, alternatives and inheritance: about 4 to 6 days, and
  it would duplicate the archived Scenario workbook.
- **Recommended:** if Tom wants the whole tree in a spreadsheet, revive `archive/feat/sheet-sync`
  (merge master into it, retest) rather than widening the Tables export. The Tables file stays the
  "what each scenario looks like" report, and the box says so (the sentence on what All leaves out is
  still owed, `dev/import-export-scenarios.md` part 1c).
