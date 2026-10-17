# What this suite does

**Script-generated. Do not edit.** The sentences are hand-written in
`dev/features-source.md`; regenerate with `php dev/scripts/generate_features.php`.
`check_all.sh` fails if this file is stale.

**The wording is a first pass and awaits Tom's edit,** and WHERE this list goes — the
LibreWaterNet landing page, the Help menu, both, neither — is his call and is not yet made.
Nothing on any served page reads this file.

49 features, citing 117 of the 711 closed task IDs. The other 594 are
bug fixes, refactors, rejected proposals, and work nobody outside this repository would
call a feature — and 134 of them are ledger entries carrying no text at all, whose
narrative is in git and which nothing here has judged either way. **This list is honest
rather than complete:** a feature is on it because somebody wrote a sentence for it.

## Solver

- Native solver available for steady state (single moment) simulation. <!-- 146 -->
- EPANET 2.3.5 solver for extended period simulations. Solver comparison display. <!-- 451, 419 -->
- Auto-recalculate option. <!-- 467 -->

## Projects and Saving

- Multiple open project tabs saved in browser or save to "lwn" file format with locking for office network collaboration. <!-- 146.08, 447, 352, 360 -->
- Install for offline use. <!-- 2, 4, 37, 246 -->
- Best on PC, tested on a phone. <!-- 486 -->

## Import, Export, and Map or Backdrop

- EPANET `.inp` files import and export with data fidelity and detailed accept/ignore report. <!-- 196, 483, 281 -->
- Examples from EPANET and others, XY and Lat/Lon, loaded and solved in one click. <!-- 314, 257, 454 -->
- World map canvas or your own backdrop with friendly positioning options. <!-- 145, 276 -->
- XY to Lat/Lon conversion import wizard. <!-- 476 -->
- Convert a copy of a project to another coordinate system and other units, with a wizard that zooms, scales, and rotates your network onto the map; new projects can start in a real EPSG projection. <!-- 696, 641 -->
- Import points, lines, and polygons from GeoJSON, shapefile, and DXF files as Shapes, and import a list of surveyed points as junctions. <!-- 779, 592 -->
- Libraries of patterns, curves, controls, rules, pipe types, and fittings, and whole libraries copied in from another project file. <!-- 611, 792 -->
- Export tables to ODS, XLSX, or CSV by table and scenario with the libraries they refer to, copy any table with its headings, and take a screenshot of the map and copy it into a report. Network export to GeoJSON and DXF, and a workspace file that carries your box layout to another screen. <!-- 776, 793 -->
- Place name search and elevations from map DEM w/ preview. <!-- 437, 497 -->

## Adding, editing, and displaying assets and results

- Junction, reservoir, tank, pipe with vertex draw and edit mode, pump, valve, and annotation text. <!-- 146.02 -->
- Customizable multi- node and link labels including prefixes, suffixes, separator, and drop/shed order with auto or manual placement on leaders or aligned with links. <!-- 345, 329, 333, 336, 397, 398, 399, 469, 146.01, 383 -->
- Find, replace, goto elements including complex queries in your language. <!-- 353, 420, 389, 540 -->
- Editable, pasteable, spreadsheet-like asset tables: junctions, reservoirs, tanks, pipes, pumps and valves. <!-- 434, 455 -->
- Group edit assets three different ways: Find and replace, Select area, and spreadsheet edit Tables. <!-- 266 -->
- Network coloring: three to seven ranges, eight ways of choosing where the breaks fall, and 41 color ramps. <!-- 384, 327 -->
- Multi-line annotation text objects with bold, rotation w/ pipe match option, and association to assets. <!-- 337, 342, 376 -->
- Independent size settings for text, symbol, and pipes. <!-- 331, 362 -->
- HGL profiles with modern path selection and editing. <!-- 409, 433, 506, 510 -->
- Graphs: time series, profile, contour on the map, frequency distribution, and a flow balance of production against consumption. <!-- 600, 640 -->
- Time series graphs at the foot of Properties and as bubbles on the map from an asset's right-click menu, including tank depth; the bubbles are a Presentation override. <!-- 637, 784, 804, 795 -->

## Extended period simulations

- Extended-period simulation following patterns for demands, reservoir head, and pump speed. <!-- 248.01, 423, 410, 248.02 -->
- EPANET-style rule-based controls. <!-- 248.03 -->
- Pump, efficiency, head loss, and tank volume curves, defined once in the Libraries box beside the patterns and rules and stated by reference, so a manufacturer's curve keeps every point it was published with and a tank fills on its real shape. <!-- 460, 586, 587 -->
- EPANET run report. <!-- 450 -->
- Color limits constant through a simulation, so a color means the same thing at every step. <!-- 448 -->
- Water quality: age, share from a source, chemical decay. <!-- 566 -->
- Pump energy report: for each pump, the share of the run it operates, efficiency, average and peak power, energy used, and cost including a peak demand charge. <!-- 566.01, 577 -->

## Premium features included for everybody

- Fire flow failure and collateral (design) failure analysis. <!-- 530 -->
- Criticality, which removes each pipe, pump, and valve in turn and reports the effect, and demand scaling, which finds the largest demand scale the system can carry, both run on a copy of the network. <!-- 751, 754 -->
- Scenarios: override management and report, scenario comparison report. <!-- 201, 407, 412, 512 -->
- Alternatives that build on one another, each holding overrides in categories such as Presentation (how the map looks) and Calculation (run time and time step), with ready-made scenarios in every new project and overrides merged upward into the alternative above. <!-- 750, 765, 755, 801, 802 -->
- Pipe types library: attached a library reference to keep a pipe in sync with the library. <!-- 465 -->
- Fittings library: attach fittings references to pipes and library pipe types. <!-- 590 -->

## The calculators

- Manning pipe flow solves in both directions, the flow from a depth and the depth from a flow, and every pipe and channel page says when the velocity it just computed is too fast or too slow. <!-- 13, 52, 65 -->
- Orifice flow, the time a tank takes to drain through one, micro-hydropower from gross head and penstock losses to the power a small site can deliver, and rock chute sizing by the Robinson method. <!-- 6, 12, 16, 30 -->
- Canal seepage and conveyance efficiency, including whether lining the canal pays for itself. <!-- 29, 38 -->
- Sketches drawn to scale from your own numbers, and a tip on every input saying what the number is. <!-- 11, 31 -->
- Name a calculation and copy a link to it; the link carries your inputs, and nothing is shared unless you share it. <!-- 39, 80, 228 -->
- Changing an input unit asks first, and says plainly that it reinterprets the numbers you typed rather than converting them. <!-- 422, 425 -->
- Water networks and the two Manning calculators get all languages. The rest of the suite gets Spanish, Portuguese, French, and Turkish, and every calculator is findable by name in every language while it waits its turn. <!-- 7, 34 -->

## Language, license, and privacy

- Twenty-seven languages, and every word is evaluated for translation. <!-- 15, 22 -->
- Free software under the GNU GPL, source in the open. <!-- 244 -->
- No account, no visitor identifier, and nothing counted about you unless you say yes. <!-- 286, 288 -->
