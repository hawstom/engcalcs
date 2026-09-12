# What this suite does

**Script-generated. Do not edit.** The sentences are hand-written in
`dev/features-source.md`; regenerate with `php dev/scripts/generate_features.php`.
`check_all.sh` fails if this file is stale.

**The wording is a first pass and awaits Tom's edit,** and WHERE this list goes — the
LibreWaterNet landing page, the Help menu, both, neither — is his call and is not yet made.
Nothing on any served page reads this file.

37 features, citing 90 of the 554 closed task IDs. The other 464 are
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
- Place name search and elevations from map DEM w/ preview. <!-- 437, 497 -->

## Adding, editing, and displaying assets and results

- Junction, reservoir, tank, pipe with vertex draw and edit mode, pump, valve, and annotation text. <!-- 146.02 -->
- Customizable multi- node and link labels including prefixes, suffixes, separator, and drop/shed order with auto or manual placement on leaders or aligned with links. <!-- 345, 329, 333, 336, 397, 398, 399, 469, 146.01, 383 -->
- Find, replace, goto elements including complex queries in your language. <!-- 353, 420, 389, 540 -->
- Editable, pasteable, spreadsheet-like asset tables: junctions, reservoirs, tanks, pipes, pumps and valves. <!-- 434, 455 -->
- Network coloring: three to seven ranges, eight ways of choosing where the breaks fall, and 41 color ramps. <!-- 384, 327 -->
- Multi-line annotation text objects with bold, rotation w/ pipe match option, and association to assets. <!-- 337, 342, 376 -->
- Independent size settings for text, symbol, and pipes. <!-- 331, 362 -->
- HGL profiles with modern path selection and editing. <!-- 409, 433, 506, 510 -->

## Extended period simulations

- Extended-period simulation following patterns for demands, reservoir head, and pump speed. <!-- 248.01, 423, 410, 248.02 -->
- EPANET-style rule-based controls. <!-- 248.03, 460 -->
- EPANET run report. <!-- 450 -->
- Color limits constant through a simulation, so a color means the same thing at every step. <!-- 448 -->
- Water quality: age, share from a source, chemical decay. <!-- 566 -->
- Pump energy cost: Run length, power use, and cost including peak demand charge. <!-- 566.01 -->

## Premium features

- Fire flow failure and collateral (design) failure analysis. <!-- 530 -->
- Scenarios: override management and report, scenario comparison report. <!-- 201, 407, 412, 512 -->

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
