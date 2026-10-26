# Task 828: one standard row for every dockable box (Ida, 2026-10-24)

Tags: CITED = external, OBSERVED = this repo or my probe, SPECULATION = mine. Probe: Net1, Chromium 1440x900 (script and shots in the session scratchpad).

## 1. Diagnosis: five boxes, four row systems

- OBSERVED (css/engcalcs.css:5219-5224): Settings `.lpn-set-row` is a two-track grid, name `minmax(0,11.5rem)` (a CEILING), value 12.5rem fixed, 6px gap, container query stacks below 24rem (:5262). Number boxes 4.5rem, selects fill to 9rem (:5302-5303). This is the best row here, and the reason is the ceiling: spare width goes to nobody (:5230-5240 records the paradox Tom hit with a `1fr` name).
- OBSERVED (probe, Contour): the box is 384 wide, name track 136, value track 208 FIXED (`--lpn-set-col:13rem`, :3727), but its widest control is 183 (the select), so the track is 25 px wider than it needs and the number rows (96, 101 wide) leave 100 px blank. Buffer's control wraps (row h54, :3731 `flex-wrap`). Tom's "50% wider than it needs": the value is a fixed number, not a measure of its contents, and the only thing that moves is the name track. Contour is Settings' row with the wrong two numbers hand-set per box (:3727), which is exactly why "tweaks do not apply across boxes".
- OBSERVED (probe, Properties, 457 wide): the same `label` starts its input at x = 43, 84, 97, 106, 118, 240, 42, 21, 0. Cause: `unitNumberField()` and `textField()` emit `<label>text <input></label><br>` (js/looped-network.js:70235-70298), so the input follows its label's text INLINE. There is no column, hence "ragtag". Input widths are 215 for everything, including Km, so "one line" is bought at the price of a width set by nobody. Check boxes sit BEFORE their label (0+13, 17+62), the opposite of Settings. Read-only results (Flow, Velocity) are loose words at yet other x.
- OBSERVED (js/looped-network.js:24377-24399): Find's `findSelect()` stacks label OVER select; two halves share a line in `.lpn-find-pair` (css :3324). So Find is a vertical form, Replace is the same function, hence the box is wide for a reason that is only the stacking.
- OBSERVED (probe, Fire flow docked, 832 wide; css :6235-6241): `.lpn-ff-row` is flex, name `flex:1 1 auto`, control `0 0 8rem`, unit `0 0 4rem`. The name took 606 px and the control sat at x=623. That is the `1fr` name track Settings abandoned. Its structure (name | control | unit) is right; its growth rule is wrong when docked wide.
- OBSERVED: the three-track idea (name | value | unit) is already the answer in Fire flow, and the unit-in-its-own-cell treatment is what Properties lacks: the unit is concatenated into the label (`labelText + ' (' + unitLabel(unitId) + ')'`, :70250), which both lengthens the label and makes the unit column impossible.
- SPECULATION: Tom's "best design" reading of Fire flow is the third column. Units in a column let digits and units align down the box and shorten every label.

## 2. Convention
- CITED (from Tom's description, 2026-10-24; I did not fetch either product): WTG and EPANET (Windows property editor) use fixed label and value columns, each user-sizable, and truncate. epanetjs.com wraps with hard-coded proportions. SPECULATION: Tom's reading of the three is right; I recommend the first.

## 3. The standard: a measure, a ceiling, a splitter
A box's rows are ONE grid: `[gutter] | name | value | unit`.
- Name track: `var(--lpn-g-name)`, default = widest label up to a CEILING of 12rem (SPECULATION; Settings' 11.5 works today). A user drag of the split changes ONLY this track, and is remembered.
- Value track: `max-content`, capped at `--lpn-g-valmax` (14rem). It HUGS the widest control in it. This is what removes the Contour 25 px and the Fire-flow 8rem guesses. Spare box width goes to nobody (right of the unit track), as Settings already does.
- Unit track: `auto`, shared by all rows, so units align. Muted .85em at .8 opacity (the `.lpn-units-name` look, :5252). Empty on unitless rows. No new strings: the unit comes from `unitLabel()` already.
- Gutter: zero width unless the override marker is shown (my 2026-10-12 design; `lpn-ovm-gut`, css :2399). Shown only with more than one scenario.
- Rows are `display: contents` so tracks are shared. SPECULATION: `display: contents` on a div drops its accessibility role in older engines; give each row `role="group"`, and use native `<label for>`. Subgrid is the alternative; it needs a recent engine, which I have not checked.
- Phone / narrow: container query on the grid (not the viewport), under 24rem: name above value, unit stays on the value line. This is Settings' rule (:5262) kept.

### 3a. Width of each value, by what the field holds
Number boxes get `width: calc(var(--d) * 1ch + 1.5em)`. `--d` is the digit count the field can hold. Settings removed spinner arrows (branch fix/settings-spinners), so `ch` is honest. Table, with `--d` (SPECULATION: my digit counts; Tom to veto):
| Field | `--d` | Note |
| Km (minor loss) | 5 | Tom: never longer than 00.00 |
| Diameter | 6 | `1200.5` |
| Roughness | 7 | covers 0.0015 and 150 |
| Length | 8, or from the custom property's upper limit | the build reads `max` and sets `--d = String(max).length`, so a limit makes the box narrower still (Tom's point 2) |
| Fill opacity %, Labels count | 3 | digit box (`.lpn-digit`, 2) for 1-2 digits |
| Date installed | 10 + 2 | native date; a text fallback needs 10 |
| From, To | 10, text, truncate | node ids; full id in the tip |
| Check box | auto | |
| Select | fill the value track, ≤ valmax | width follows the track, never its own words |
| Text (Description, Tag) | fill the value track | a Description is `.lpn-gspan`, below |
Numbers right-align, words start-align (Settings' own rule, :5311-5330); `.lpn-gw-num` carries it.

### 3b. Wrap versus truncate
- Name cell: one line, `text-overflow: ellipsis`, `overflow:hidden`. The row keeps a constant height; that constancy is what makes a column read as a column. Full text on hover via the suite's one tip: while a name is clipped (ResizeObserver compares scrollWidth to clientWidth), set `el.title = labelText`; clear with `el.title=''` when it is not (CLAUDE.md, tip rules). The `?` tip stays the explanation; the title is the NAME tip. SPECULATION: a language with long words (de, ru) is the reason the splitter must exist; truncation without it would be a defect.
- Value cell: never wraps (controls); a read-only value truncates with the same title.
- Wrapping is allowed in exactly one place: `.lpn-gspan` rows (notes, Descriptions, warnings, message lines), which span name+value+unit.
- Rejected alternative: Settings' present `overflow-wrap:anywhere` on names (:5247). It yields a 2-3 line label on a narrow drag and a ragged row height.

### 3c. The splitter
- One 6 px `.lpn-gsplit` over the name/value boundary, `col-resize`, `role="separator"`, arrow keys step 0.5rem, double-click resets to the default. It writes `--lpn-g-name` on the grid. A drag cannot exceed value-room (min value track 5rem) or go below 4rem.
- Memory: ONE `localStorage` object `lpn_gcols` = `{boxId: rem}`. OBSERVED: `setboxLayout` is Settings-only (js :63251) and each box has its own furniture key; one shared map is less storage than ten fields. It is window furniture, not the project (CLAUDE.md Unit sets). It changes what is stored on the device: Tom must be told and `dev/cookie-storage-inventory.md` updated.
- Rejected: separate drag for the value column. It is content-sized; a user-set width there would reintroduce the Contour defect. If Tom wants WTG's "individual sizing of both", the value track maximum (valmax) can be given a second grip; I would not.

### 3d. What sits where
- Check box: LABEL in name, BOX at the value track's start; the long labels that read as sentences become `.lpn-gspan` with the box first. Properties' box-before-label inverts today.
- Select / pull-down: value track, fill.
- Unit: unit track. Unit SELECT (Settings' unit choosers): value track, with no unit text.
- Buttons: a button alone goes in the value track at its natural width; a pair (Apply to all, Use current view) is a `.lpn-gspan` row aligned to the value track's start.
- Section heading: `.lpn-ghead`, spans all, bold, margin-top 10px, with its `?` after. Collapsible ones keep their expander as a `.lpn-grow`.
- Outside the grid: Find's Find and Filter-in-table buttons (their own flex row, css :3329), Find's typed-query line, result lists, Replace's preview list and Change them, Fire flow's results table, Contour's legend. A rule: the grid is for LABEL=CONTROL pairs; lists and tables are not pairs.

## 4. Classes, CSS and the one function
Classes: `.lpn-grid` (container, `container-type:inline-size`), `.lpn-grow` (row), `.lpn-gname`, `.lpn-gval`, `.lpn-gunit`, `.lpn-ghead`, `.lpn-gspan`, `.lpn-gsplit`; control modifiers `.lpn-gw-num` (reads `--d`), `.lpn-gw-fill`, `.lpn-gw-text`. Variables: `--lpn-g-name`, `--lpn-g-valmax`, `--lpn-g-gap`. Colour via `--ec-*` only (CLAUDE.md).
One function, in js/looped-network.js:
`lpnGridRow(parent, spec)` where `spec = {label, tip, control, unit, kind: 'num'|'text'|'select'|'check'|'button'|'readout'|'head'|'span', digits, max, id}`. It (1) makes `parent` a `.lpn-grid` on first use and installs its splitter and remembered width, (2) builds the row, sets `for/id`, (3) sets `--d` from `digits` or `String(max).length`, (4) arms the clipped-name title, and (5) returns the row. `findHelpLabel`, `setFieldLabel`, `ffRow` and the Contour `row()` become thin callers. Seam: it replaces `fields.appendChild(label); fields.appendChild(document.createElement('br'))` at 24 places in Properties.

## 5. Order of conversion (cost / gain)
1. Primitives + Contour. Cost: small (one `row()` at js :13485, drop the 3727 overrides, the Buffer row becomes a `.lpn-gspan`). Gain: the standard exists in the box Tom disliked, and tweaks are one CSS file.
2. Fire flow. Cost: small; `ffRow()` (js :78618) is the single funnel for 36 call sites; swap its body, delete `.lpn-ff-row` rules (css :6235-6241). Gain: removes the 606-px name track when docked; wins Tom's "make them use standard styling".
3. Properties. Cost: LARGE. 24 `fields.appendChild(label)` sites, the ⚠ `valueWarnPaint(label,...)` (it paints on the label), `overrideMarker`, `closedField`, `curveChooser`, `customPropFields`, and OBSERVED 64 harnesses in dev/lpn-spike reference `lpn_popup_fields`, any that use `label input` will break and must be re-aimed. Gain: the biggest of all, because it is the box people open most and the one with the visible ragged edge; Km alone at 5 digits plus a unit column is Tom's "big difference".
4. Find and Replace. Cost: medium; `findSelect()` and the Replace form share one function; Property+Condition becomes two rows (or stays a pair in a `.lpn-gspan`). Gain: labels beside controls make the box narrower, which Tom asked for.
5. Settings. Cost: small but risky (every row in the app); do it last, by pointing `.lpn-set-row` at the new classes as an alias, with no visual change. Gain: one source of truth, so a tweak to the standard reaches the box that already looks right.
If only one: do 1 and 2 together as the proof, then Properties on its own branch.

## 6. Open items for Tom
- Stored: one new `lpn_gcols` entry (3c).
- Is a truncated name acceptable in German or Russian at the default? My answer is yes because of the splitter and the title.
- Digit counts in 3a are mine.
- On a phone (under 24rem) a label stacks above its value instead of truncating.
