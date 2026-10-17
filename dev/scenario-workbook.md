# The scenario workbook: sync out and sync in, as a file

Task 752, first phase, branch `feat/sheet-sync` (2026-10-17). The scenario tree and every
alternative's own values as one `.xlsx`, written by File > Export > Scenario workbook and read back
by File > Import > Import scenario workbook.

Tom, 2026-09-30, on a master spreadsheet with a Scenarios tab naming each scenario's alternatives and
then one tab per data kind keyed by element ID: *"Spreadsheet structure: I love this."* and *"Sync
in/out: Could we do this with GSheets?"* Tom, 2026-10-07, on Bentley's Connection (a saved,
re-runnable set of directions from a source to a model, run for Sync In and Sync Out, not a live
link): *"Nice. That's where we should head."*

**This phase is a file, with no account, no upload and no third-party request.** A live Google
Sheets connection is a fifth third-party service: a new paragraph in `privacy.php` and Tom's call
first. Google Sheets opens and downloads `.xlsx`, so the file already reaches Sheets by hand.

Code: `js/looped-network.js`, section "THE SCENARIO WORKBOOK" (`scnBookSheets()`, `scnBookPlan()`,
`scnBookApply()`, `showScnBookReport()`); the `.xlsx` reader `EngCalcs.lpnTableXlsxRead()` and the
hidden key row in `js/lpn-tablefile.js`; the unzip `EngCalcs.lpnUnzip()` in `js/lpn-gisread.js`.
No new library. Harnesses: `dev/lpn-spike/scenario-workbook-harness.js` (headless) and
`dev/lpn-spike/scenario-workbook-browser-harness.js` (Chromium, the real menu rows, English and
Spanish).

## The layout, sheet by sheet

Row 1 of every sheet is the heading a person reads, in the page's language. **Row 2 is hidden and
holds one language-free key per column**; its first cell names the sheet (`scenarios:id`,
`physical:alternative`...). The workbook is read by row 2, never by a heading or a tab name, so a
workbook made on a Spanish page reads back on an English one, and a renamed tab still reads. Rows 1
and 2 are frozen, with the first column.

1. **Scenarios**: one row per scenario, in the Scenario manager's order. ID, Scenario (name),
   Parent (the parent scenario's name; blank for Base and for a Base of its own), then one column per
   category (the nine element categories, Presentation, Calculation) naming the alternative the
   scenario names there: blank means it inherits, Base means Base chosen on purpose.
2. **Alternatives**: one row per alternative and calculation set, category by category in tree
   order. Category, ID, Alternative (name), Parent (blank for a Base of its own). The Base item of
   each category is not a row: its values are the network's.
3. **One sheet per element category**: Physical, Demand, Active topology, Initial settings,
   Constituent, Fire flow, Energy cost, Custom properties, Text. One row per alternative and asset
   that holds at least one value: Alternative, Asset (the kind word), ID, then one column per
   property of the category, headed as the Tables pane heads it, with its unit. A blank cell holds
   no value. Every property of the category has a column, so a value can be added where none was.
4. **Settings**: one row per setting value an alternative or calculation set holds: Category,
   Alternative, Setting (in the Override manager's words), Path (the setting's place in the
   project, `settings.hydraulics.demandMultiplier`), Value. A time is its typed text.

**Values are the stored ones**, in the project's units, never converted or rounded: a number as
JavaScript writes the stored number, a yes/no as TRUE or FALSE, a demand list or a view as JSON, and a
value deliberately set blank as `(blank)`. Each value column's key carries a unit stamp
(`diameter|in`); a column whose stamp differs from the project's unit is refused whole, so a workbook
made in other units is never misread.

5. **Project**: one row, the project's name, its number of assets, and a fingerprint of their IDs.
   An import into a project whose name or asset IDs differ says so at the top of the report (EPANET
   IDs such as 10 and 22 are in many networks, so a Net1 workbook would otherwise read into Net2 as
   13 plain changes). It never refuses: the person decides.

**Typed characters are not kept, because the program keeps none.** A number typed in the Tables
pane or Properties is stored as the number (`+text`, `paneParseCellText()`, `numberFieldBlank()`):
a typed 6.00 is 6 and 1e-3 is 0.001, in the program and so in the workbook. The workbook writes
the stored number as JavaScript writes it, and reads a cell as the same number when the two agree
to 15 significant digits. If overrides ever keep their typed text, the workbook should write and
compare that text instead.

## The sync rules

- **Nothing is applied before the report.** Import reads the workbook, compares it with the open
  project, and shows every difference (sheet, row, change, value in the project, value in the
  workbook). Apply changes makes them all as one undo step; Cancel changes nothing.
- **Never delete.** A scenario, an alternative, a value or a setting the project has and the
  workbook leaves out (a missing row, a blanked cell, a missing sheet) is kept and listed under
  "Kept, not in the workbook".
- **Never drop a row silently.** Every row or cell that cannot be used is listed with its reason:
  an unknown alternative, an asset the project lacks, a value that is not a number, a choice that is
  not one, a column in other units, a parent that would make a loop, a duplicate row, a sheet that is
  not the workbook's. The rest of the workbook is still read.
- **An unchanged round trip changes nothing and lists nothing**, also after a spreadsheet program
  re-saves it (shared strings, deflated entries, numbers re-typed). A number equal to 15
  significant digits, all a spreadsheet keeps, is the same number.
- **References are names**, as a person writes them, resolved by ID first, then by the name the
  workbook gives, then by the name the project has, so renaming Peak in its own row does not strand
  the rows that still say Peak. Names are unique within a tree, as the Scenario manager keeps them.
- **A workbook made on a page in another language reads back.** Its keys decide; a category word or
  an asset kind word this page does not know leaves the ID or the setting's path to decide, and the
  name its Scenarios sheet gives Base is read as Base wherever the workbook names it.
- **New rows make new things**: a scenario row or an alternative row with no ID (or an ID this
  project does not have) is a new scenario or alternative; a value row for it fills it.
- **A scenario's own alternative from a file before 2026-10-12** (its values in its own map) is
  listed as the Scenario manager lists it, under the key `<scenario id>:<category>` and the
  scenario's name. An edit in it stores it as a first-class alternative first, as an edit in the
  program does.
- **Base is not edited by a workbook**: its values are the drawing and its settings the project's.
  Base's own picks (Basic mode off) are in the Scenarios sheet like any row.
- **A saved view, the graphs on the map, and a typed time's text alone** are changed on the map, not
  by a workbook; a row changing one is listed as not used.
- After applying, a project Basic mode cannot show turns Basic mode off with the sentence it uses on
  arrival (`basicMisfitText()`).

## Questions for Tom, and what was chosen meanwhile

1. **Wide sheets or one row per value?** Chosen: wide (a row per alternative and asset, a column per
   property), the shape of the Tables pane and closest to "one tab per data kind keyed by element
   ID". The rejected alternative, one row per value (Alternative, Asset, ID, Property, Value), needs
   no blank word and makes every override one row, but reads like a database dump.
2. **The hidden key row.** Chosen: hidden. Shown, it is a row of machine words under the headings;
   absent, a workbook made in one language could not be read in another, and a heading reworded in a
   later version would break every workbook saved before it.
3. **Base's values are not in the workbook.** Chosen: overrides only, as the brief says ("each
   alternative's own values"). A Base sheet set would be the whole network, and editing it would be a
   second network editor; the Tables pane already exports it.
4. **Basic mode.** Tom, 2026-09-30, listed Google Sheets connect, sync out and sync in among what
   unchecking Basic mode reveals. Chosen: both rows are always on the File menu, as the Scenario
   manager row is always on the Scenarios menu, because a Basic-mode project's scenarios are worth a
   workbook too; an import that makes the project too complex for Basic mode turns it off and says so.
5. **Renaming a scenario in a workbook does not rename its namesake alternatives**, which Tom's rule
   asks of Basic mode in the program (2026-10-12). The workbook states every name; a row naming
   the alternatives' new names renames them. Chosen: apply the names as written.
6. **The file name** is the project's name plus `-scenarios.xlsx`, the suffix in English.
7. **A Base cannot be made or unmade by a workbook** (a Base of its own, from Add base): its row's
   Parent stays blank, and a parent given to it is listed as not used.
8. **Values are checked for type, not for range.** A number must be a number, a yes/no a yes/no, a
   choice one of the choices the Tables pane offers (by its stored word or its shown word), a link's
   status open or closed, an asset's type one Morph offers; the program's own warning glyphs flag an
   unreasonable number after it is in, as they flag a typed one.

## Not in this phase

- A live Google Sheets connection (sign-in, a sheet kept in step). Needs the privacy paragraph and
  Tom's call.
- Bentley's `.wtg.sqlite` (Task 749) reads the same tree; this workbook's layout is meant to carry
  what it reads.
- Deleting by workbook. Never, by the rule above, unless Tom asks for an explicit Delete column.
