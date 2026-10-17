# Features source — the hand-written half of the features list

**This file is EDITED BY HAND. `dev/features.md` is generated from it** by
`php dev/scripts/generate_features.php`, which also proves every ID cited here is a task the closed
ledger actually holds.

## What this list is, and what it is not

**It is not a list of what we finished.** That list is the closed ledger, and its public home, when
there is one, is a "Completed issues" area of a published roadmap (Tom, 2026-09-12). Writing the
two in one place is what produced the first draft of this file: 64 rows, one per closed task,
several of them about our own furniture — a draggable property box, a searchable Settings panel, a
menu reorganization, a Help menu — which read, in his words, as an *"in-house 'done, yay' vibe"*.

**It is a list of what a reader can do**, written for somebody who has never opened the page and is
deciding whether to. The test on every sentence here:

> Would somebody choosing between this and something else be worse off not knowing it?

A line about how our controls are arranged fails that test. So does an apology for a box being
long. Seven such lines were cut on 2026-09-12 and their IDs are simply uncited, which the generator
allows and counts.

**And one salient point gets one home.** The second defect in that first draft was scattering: the
single question *"where does my work live and how does it get in and out"* was answered across five
headings, so a reader had to read the whole page to assemble it. The heading order below follows
the order somebody meets the software — what it is, what they can bring to it, drawing, solving,
time, the analyses, reading it, scenarios, and only then where it all lives.

## How to edit

One line per feature, under a `##` area heading:

```
- <ids>| <one sentence, present tense, written for a reader who has never seen the page>
```

A **pointer** sends the reader to the section that holds a capability, and carries no task IDs
(used under Premium features, whose capabilities live in their home sections):

```
- see <exact ## heading>| <sentence ending in a full stop>
```

The generator proves the named heading exists, writes the row as `<!-- see: <heading> -->`, and
does not count a pointer as a feature.

`<ids>` is one or more closed task IDs, comma-separated. Every one must exist in
`dev/roadmap-closed-ids.md` at priority 0, and no ID may be cited by two features — the generator
fails on either. A closed ID cited by nothing is fine and expected. Merge freely: the unit of this
list is a capability, not a task, so one line may carry six IDs.

House rules that apply to the sentences here exactly as they apply anywhere else, because these are
public claims: `dev/positioning.md` is the authority, "a phone" and never "your phone", no
completeness claim against EPANET, our own element vocabulary (a **Text** object is EPANET's Label),
never the words "PC application", APA spelling, and no em dash.

**Two headings are load-bearing for the sibling site** and cannot be renamed or restructured without
editing `~/webdev/librewaternet.org/tools/build-features.php` to match: that builder skips
`## The calculators` wholesale (LibreWaterNet does not advertise the calculator suite), and it moves
the line whose ID set is exactly `486` into its own honest-edges note, so that line stays solo.

---

## Solver

- 146| Native solver for steady state (single moment) simulation.
- 451, 419| EPANET 2.3.5 solver for extended period simulations, with a solver comparison display.
- 467| Auto-recalculate option.

## Projects and Saving

- 146.08, 447, 352, 360| Multiple open project tabs, saved in the browser or to an "lwn" file, with locking for office network collaboration.
- 2, 4, 37, 246| Install for offline use.
- 745| Searchable user manual.
- 486| Best on PC, tested on a phone.

## Import, Export, and Map or Backdrop

- 196, 483, 281, 592, 776| Import and export formats: EPANET, ODS, XLSX, CSV, DXF, shapefile, GeoJSON, survey points, libraries, and clipboard copy/paste.
- 314, 257, 454| Examples from EPANET and others, loaded and solved in one click.
- 611, 792, 465, 590| Libraries of patterns, curves, controls, rules, pipe types, and fittings, copyable from another project file.
- 793| Screenshot tool with enhanced resolution and a markup pen.
- 145, 276| World map canvas or your own backdrop.
- 476| XY to Lat/Lon conversion import wizard.
- 696, 641| Conversion of a project copy to another coordinate system and other units, and new projects in a real EPSG projection.
- 437, 497| Place name search and elevations from map DEM.

## Adding, editing, and displaying assets and results

- 146.02| Junction, reservoir, tank, pipe with vertex draw and edit mode, pump, valve, and annotation text.
- 719| Junction and pipe chain draw, with pipe split offered contextually when a junction lands on a pipe.
- 779| Draw reference Shapes (points, lines, and polygons), managed in a Shapes table.
- 782| Snap to objects, which enhances the value of DXF and shapefile Shapes import.
- 185| Copy and paste properties between assets.
- 345, 329, 333, 336, 397, 398, 399, 469, 146.01, 383| Customizable node and link labels: prefixes, suffixes, separator, drop order, and automatic or manual placement.
- 353, 420, 389, 540| Find, replace, and go to elements, including complex queries in your language.
- 434, 455| Editable, pasteable, spreadsheet-like asset tables.
- 266| Mass-edit assets by Find and replace, Select area, or spreadsheet Tables.
- 384, 327| Network coloring: three to seven ranges, eight ways of placing the breaks, and 41 color ramps.
- 337, 342, 376| Multi-line annotation text with bold, rotation, and association to assets.
- 331, 362| Independent size settings for text, symbol, and pipes.
- 409, 433, 506, 510, 600, 640| Graphs: HGL profiles with path editing, time series, contour on the map, frequency distribution, and a flow balance of production against consumption.
- 637, 784, 804, 795| Time series graphs at the foot of Properties and as bubbles on the map, including tank depth; and the bubbles are an override for Presentation.

## Extended period simulations

- 248.01, 423, 410, 248.02| Extended-period simulation with patterns for demands, reservoir head, and pump speed.
- 248.03| EPANET-style rule-based controls.
- 460, 586, 587| Pump, efficiency, head loss, and tank volume curves, kept in the Libraries box.
- 450| EPANET run report.
- 448| Color ranges constant through a simulation.
- 566| Water quality: age, share from a source, chemical decay.
- 566.01, 577| Pump energy report: operating share, efficiency, power, energy used, and cost including a peak demand charge.

## Analyses

- 530| Fire flow failure and collateral (design) failure analysis.
- 751| Criticality analysis, which removes each pipe, pump, and valve in turn and reports the effect.
- 754| Demand scaling, which finds the largest demand scale the system can carry.

## Scenarios and alternatives

- 201, 407, 412, 512| Scenarios with overrides marked on the map, Manage overrides, and a scenario comparison report.
- 750, 765, 755, 801, 802| Alternatives with an inheritance tree, overrides mergeable upward into the alternative above, Presentation and Calculation override categories, ready-made scenarios in every new project, a Basic mode, and many more management features.

## Premium features included for everybody

<!-- **"PREMIUM" IS DELIBERATE AND IS NOT A PRICE.** Tom, 2026-09-12, asked directly whether the
     heading reads as a paid tier on a page that says there is nothing to buy: *"These are the
     features others charge thousands of dollars for. They have been called premium for decades,
     and now we are giving them away for free."* The word names what this class of capability
     costs everywhere ELSE, which is the whole point of the section. Do not re-flag it. -->

- see Scenarios and alternatives| Scenarios and alternatives (see Scenarios and alternatives).
- see Analyses| Fire flow, criticality, and demand scaling analyses (see Analyses).
- see Import, Export, and Map or Backdrop| Import and export formats (see Import, Export, and Map or Backdrop).
- see Import, Export, and Map or Backdrop| Coordinate system and unit conversion (see Import, Export, and Map or Backdrop).


## The calculators

- 13, 52, 65| Manning pipe flow solves in both directions, the flow from a depth and the depth from a flow, and every pipe and channel page says when the velocity it just computed is too fast or too slow.
- 6, 12, 16, 30| Orifice flow, the time a tank takes to drain through one, micro-hydropower from gross head and penstock losses to the power a small site can deliver, and rock chute sizing by the Robinson method.
- 29, 38| Canal seepage and conveyance efficiency, including whether lining the canal pays for itself.
- 11, 31| Sketches drawn to scale from your own numbers, and a tip on every input saying what the number is.
- 39, 80, 228| Name a calculation and copy a link to it; the link carries your inputs, and nothing is shared unless you share it.
- 422, 425| Changing an input unit asks first, and says plainly that it reinterprets the numbers you typed rather than converting them.
- 7, 34| Water networks and the two Manning calculators get all languages. The rest of the suite gets Spanish, Portuguese, French, and Turkish, and every calculator is findable by name in every language while it waits its turn.

## Language, license, and privacy

- 15, 22| Twenty-seven languages, and every word is evaluated for translation.
- 244| Free software under the GNU GPL, source in the open.
- 286, 288| No account, no visitor identifier, and nothing counted about you unless you say yes.
