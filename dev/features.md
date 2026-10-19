# What this suite does

**Script-generated. Do not edit.** The sentences are hand-written in
`dev/features-source.md`; regenerate with `php dev/scripts/generate_features.php`.
`check_all.sh` fails if this file is stale.

**The wording is a first pass and awaits Tom's edit,** and WHERE this list goes — the
LibreWaterNet landing page, the Help menu, both, neither — is his call and is not yet made.
Nothing on any served page reads this file.

58 features, citing 127 of the 720 closed task IDs. The other 593 are
bug fixes, refactors, rejected proposals, and work nobody outside this repository would
call a feature — and 133 of them are ledger entries carrying no text at all, whose
narrative is in git and which nothing here has judged either way. **This list is honest
rather than complete:** a feature is on it because somebody wrote a sentence for it.

## Solver

- Native solver for steady-state (single moment) simulation. <!-- 146 -->
- EPANET 2.3.5 solver for extended-period simulations, with a solver comparison display. <!-- 451, 419 -->
- Auto-recalculate option. <!-- 467 -->

## Projects, files, and formats

- Multiple open project tabs, saved in the browser or to an ".epp" file, with locking for office network collaboration. <!-- 146.08, 447, 352, 360 -->
- Install for offline use. <!-- 2, 4, 37, 246 -->
- Best on PC, tested on a phone. <!-- 486 -->
- Network import and export as EPANET `.inp`, plus network export to GeoJSON and DXF. <!-- 196, 483, 281 -->
- Tables export to ODS, XLSX, and CSV; Shapes import from shapefile, GeoJSON, and DXF; surveyed points import as junctions; clipboard copy/paste. <!-- 592, 776 -->
- Workspace file: save your box layout, panes, and display options, and import them on another screen or browser. <!-- 313 -->
- Many example projects, each loaded and solved in one click. <!-- 314, 257, 454 -->
- Libraries of patterns, curves, controls, rules, pipe types, and fittings, importable from another project file. <!-- 611, 792, 465, 590 -->
- Screenshot tool with enhanced resolution and a markup pen. <!-- 793 -->
- World map canvas or your own backdrop. <!-- 145, 276 -->
- XY to Lat/Lon conversion import wizard. <!-- 476 -->
- Conversion of a project copy to another coordinate system and other units, and new projects in a real EPSG projection. <!-- 696, 641 -->
- Place name search, and elevations filled in from a digital elevation model. <!-- 437, 497 -->

## Adding, editing, and displaying assets and results

- Junction, reservoir, tank, pipe with vertex draw and edit mode, pump, valve, and annotation text. <!-- 146.02 -->
- Junction and pipe chain draw, with pipe split offered contextually when a junction lands on a pipe. <!-- 719 -->
- Draw reference Shapes (points, lines, and polygons), managed in a Shapes table. <!-- 779 -->
- Copy and paste properties between assets. <!-- 185 -->
- Customers: metered services with demand, service count, and pattern, each connected to the node or pipe that serves it. <!-- 247 -->
- Custom properties on any kind of asset, with your own labels and limits, overridable by a scenario, and flagged in place when a value breaks its limits. <!-- 636 -->
- Customizable node and link labels: prefixes, suffixes, separator, drop order, and automatic or manual placement. <!-- 345, 329, 333, 336, 397, 398, 399, 469, 146.01, 383 -->
- Find, replace, and go to elements, including complex queries in your language. <!-- 353, 420, 389, 540 -->
- Mass-edit assets by Find and replace, Select area, or spreadsheet Tables. <!-- 266 -->
- Network coloring: three to seven ranges, six ways of placing the breaks (or type your own), and 41 color ramps. <!-- 384, 327 -->
- Multi-line annotation text with bold, rotation, and association to assets. <!-- 337, 342, 376 -->
- Independent size settings for text, symbol, and pipes. <!-- 331, 362 -->
- Graphs: HGL profiles with path editing, time series, contour on the map, frequency distribution, and a flow balance of production against consumption. <!-- 409, 433, 506, 510, 600, 640 -->
- Time series graphs at the foot of Properties and as bubbles on the map, including tank depth. A bubble's display is set per scenario. <!-- 637, 784, 804, 795 -->

## Extended-period simulations

- Extended-period simulation with patterns for demands, reservoir head, and pump speed. <!-- 248.01, 423, 410, 248.02 -->
- EPANET-style rule-based controls. <!-- 248.03 -->
- Pump, efficiency, head loss, and tank volume curves, kept in the Libraries box. <!-- 460, 586, 587 -->
- EPANET run report. <!-- 450 -->
- Color ranges constant through a simulation. <!-- 448 -->
- Water quality: age, share from a source, chemical decay. <!-- 566 -->
- Pump energy report: operating share, efficiency, power, energy used, and cost including a peak demand charge. <!-- 566.01, 577 -->

## Analyses

- Fire flow analysis: which junctions miss their fire flow, and which pull the rest of the system below its limits. <!-- 530 -->
- Criticality analysis, which removes each pipe, pump, and valve in turn and reports the effect. <!-- 751 -->
- Demand scaling, which finds the largest demand scale the system can carry. <!-- 754 -->

## Scenarios and alternatives

- Scenarios with overrides marked on the map, Manage overrides, and a scenario comparison report. <!-- 201, 407, 412, 512 -->
- Alternatives with an inheritance tree, overrides mergeable upward into the alternative above, Presentation and Calculation override categories, ready-made scenarios in every new project, a Basic mode, and many more management features. <!-- 750, 765, 755, 801, 802 -->

## Ease of use

- Searchable user manual. <!-- 763 -->
- Every setting in one box, searchable by the words you would use. <!-- 457 -->
- Dockable boxes that auto-hide to an edge tab. <!-- 441 -->
- One Water menu holds everything about water modeling, assets included. <!-- 543 -->
- Editable, pasteable, spreadsheet-like asset tables. <!-- 434, 455 -->
- Snap to objects, which enhances the value of DXF and shapefile Shapes import. <!-- 782 -->

## Premium features included for everybody

- Scenarios and alternatives (above). <!-- see: Scenarios and alternatives -->
- Fire flow, criticality, and demand scaling analyses (above). <!-- see: Analyses -->
- Import and export formats (above). <!-- see: Projects, files, and formats -->
- Coordinate system and unit conversion (above). <!-- see: Projects, files, and formats -->

## The calculators

- Manning pipe flow solves in both directions, the flow from a depth and the depth from a flow, and every pipe and channel page says when the velocity it just computed is too fast or too slow. <!-- 13, 52, 65 -->
- Orifice flow, the time a tank takes to drain through one, micro-hydropower from gross head and penstock losses to the power a small site can deliver, and rock chute sizing by the Robinson method. <!-- 6, 12, 16, 30 -->
- Canal seepage and conveyance efficiency, including whether lining the canal pays for itself. <!-- 29, 38 -->
- Sketches drawn to scale from your own numbers, and a tip on every input saying what the number is. <!-- 11, 31 -->
- Name a calculation and copy a link to it; the link carries your inputs, and nothing is shared unless you share it. <!-- 39, 80, 228 -->
- Changing an input unit asks first, and says plainly that it reinterprets the numbers you typed rather than converting them. <!-- 422, 425 -->
- Water networks and the two Manning calculators get all languages. The rest of the suite gets Spanish, Portuguese, French, and Turkish, and every calculator is findable by name in every language while it waits its turn. <!-- 7, 34 -->

## Language, license, and privacy

- Twenty-seven languages, and every word is considered for translation. <!-- 15, 22 -->
- Free software under the GNU GPL, source in the open. <!-- 244 -->
- No account, and no visitor identifier or count of you unless you say yes. <!-- 286, 288 -->
