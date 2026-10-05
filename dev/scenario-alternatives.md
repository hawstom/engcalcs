# Scenarios and alternatives: the data model

Branch `feat/bentley-interop`, 2026-09-30. Tasks 721, 749, 752, 753. The spec is Tom's, the same
day:

> "I think we can implement Bentley scenarios and hide it from users until we have a UX design.
> Here are my proposed rules for Basic mode:
> - Build this Basic mode into the Bentley-interop branch.
> - Base is the only Scenario parent. All other scenarios are its children.
> - All Alternatives have a Base instance, and the Base scenario uses all the Base alternatives.
> - Every other scenario also uses all the Base alternatives until the moment it gets a property
>   local value. At that moment, we create a child instance of the base instance of the
>   Alternatives category that carries that property. Example: In scenario Peak Hour, I change a
>   Base Demand. This triggers the creation of a Peak Hour demand alternative child of the Base
>   demand alternative. I don't see it, but that is what happens in the background. And if I ask
>   to Sync out to a Google Sheet, I will see that.
> - In our Scenarios menu, we have an 'Basic mode' command/row that is checked by default. If they
>   uncheck it, our full Advanced (Bentley) Scenarios UX (to be designed later) is revealed
>   including Bentley import/export and Google Sheets connect/sync-out/sync-in."

Provenance tags as in `dev/bentley-interop.md`: **CITED**, **OBSERVED**, **SPECULATION**.

## Today's model, in one paragraph

A project holds `scenarios`, an array. Base (`isBase: true`) holds no overrides; the element IS
Base. Every other scenario is `{id, name, overrides, demandMultiplier?}`, where
`overrides[ovKey(el)][prop]` is a value the user set deliberately in that scenario (the key's
presence is the marker, even when the value equals Base's). `effective(el, prop)` reads the active
scenario's override, else the element (with the pipe-type layer, the derived auto length and the
demand breakdown's spread-out storage handled on the way). `setProp()` is the one write seam.
Nothing carries a parent pointer, so a scenario of a scenario cannot be written down.

## The general model (what Bentley has)

- A **category** is a kind of data: Physical, Demand, Active Topology, and so on.
- An **alternative** belongs to one category and holds values for the properties of that category.
  It has an optional **parent** alternative of the same category, and holds only the values that
  differ from its parent ("local" values); everything else is inherited. **CITED:** Bentley's
  patent US10311051B1, *"Inherited alternatives may reference only parameter values that differ
  from those of a parent alternative."*
- A **scenario** names exactly one alternative per category, plus calculation options, and has an
  optional parent scenario it inherits those choices from.
- **A value resolves** as: scenario → the alternative it names for the property's category → that
  alternative's local value, else its parent's, up the chain → the root alternative of the category,
  whose value is the element's own.

## Tom's Basic-mode constraints on top

1. **One scenario tree of depth one.** Base is the root; every other scenario is Base's child.
2. **One root alternative per category, used by Base.** We call it the Base alternative of that
   category ("Base Demand", "Base Physical"...). **Its values are the element's own**, which is
   what the element has always meant here.
3. **A scenario uses the Base alternative of a category until it holds a local value of a property
   in that category.** From then on it uses its own alternative of that category, a child of the
   Base alternative, named after the scenario, holding exactly that scenario's local values in the
   category.
4. So in Basic mode **an alternative tree has depth at most one too**, and no two scenarios share
   a child alternative.

## Categories, and every overridable property in one

Enumerated from `LPN_OVERRIDABLE` and `isOverridable()` in `js/looped-network.js`, not from
memory; `dev/lpn-spike/scenario-alternatives-harness.js` fails if a property there has no category
here. Each property is in exactly one category. The category id is what the code uses.

| Category (id) | Bentley's | Properties | Notes |
|---|---|---|---|
| Physical (`physical`) | Physical | pipe `diameter`, `roughness`, `k`, `length`, `typeId`, `fittingsId`; pump `curveId`, `efficCurveId`; junction `emitter`; reservoir `head`; node `x`, `y` | **SPECULATION** for `emitter` and `head`: Bentley's reservoir "elevation" and junction emitter coefficient are element attributes we believe sit in Physical; not confirmed from a cited page. **Position has no Bentley home at all**: Bentley's geometry does not vary by scenario. Ours does (Tom, 2026-09-15), so a Physical child alternative holding `x`/`y` is ours alone and has no Bentley translation. |
| Demand (`demand`) | Demand | junction `demand`, `demands` (the whole breakdown, R-369) | Tom's Peak Hour example. |
| Asset activation (`topology`; Tom, 2026-09-30) | Active Topology | node `active`, link `active` | Task 753 ("Activation") is Tom's call on the words; the id here is neutral. Drawing inside a scenario (`bornInScenario()`) writes `active: true` there, so it creates that scenario's topology child alternative, exactly as Bentley's own "element added in a child topology" does. |
| Initial settings (`initial`) | Initial Settings | link `status`, valve `setting`, tank `level` | **CITED** for pipe status: *"a pipe can start in an open or closed position and a pump can start in an on or off condition"*, <https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/31010.html>. Tank level and valve setting: Bentley's SCADAConnect page lists *"initial conditions with regard to such properties as tank water levels, pump status and settings and valve status"*, <https://docs.bentley.com/LiveContent/web/Bentley%20WaterCAD%20CONNECT%20Edition%20Help-v1/en/GUID-E8008FFA-6E0C-4A98-AAF6-C6CC742D5A71.html>, which does not name the alternative; placing them in Initial Settings is SPECULATION on that reading. |
| Constituent (`constituent`) | Water Quality: Constituent | node `initQuality`, `sourceType`, `sourceQuality`, `sourcePattern`; tank `tankCoeff`; pipe `bulkCoeff`, `wallCoeff` | Bentley splits water quality into Age, Constituent and Trace; everything we let a scenario vary is a chemical's. |
| Fire flow (`fireflow`) | Fire Flow | junction `fireFlow` | The required fire flow per junction (Task 530). |
| Energy cost (`energy`) | Energy Cost | pump `energyPrice`, `energyPattern` | |
| User data (`userdata`) | User Data Extensions | every custom property (`custom_*`, Task 636) | Bentley lets a user field be placed in an alternative; ours are all overridable, so they are one category. Also the home of any stray property name an old file carries that no category claims, so "exactly one" holds for every key a file can contain. |
| Text (`text`) | none | Text label `text`, `active` | **Ours only.** Bentley keeps annotation in the `.wtg`, outside the model (`dev/bentley-interop.md`). A label's `active` is not topology: it takes nothing out of the solve. |

**The demand multiplier is a calculation option.** `scenario.demandMultiplier` is a per-scenario
number, not an element property. Its Bentley counterpart is a **Calculation Option** (a scenario
names one set of calculation options beside its alternatives), so it stays stored on the scenario.
It belongs to the Calculation category of "Settings in scenarios" below; whether the table counts
it there or keeps it in its own column is question 1 at the end of that section.

**Bentley categories we have nothing for:** Operational (controls; our `[RULES]` are the
document's, not a scenario's), Age, Trace (the trace node is a document setting), Capital Cost,
Pressure Dependent Demand, Transient (HAMMER), Failure History, Flushing, SCADA, and the other
product-specific ones. **Base-owned and therefore in no category**: junction/tank `elev`, tank
`minLevel`/`maxLevel`/diameter/mixing model, pump speed, element ids and types, link ends and
bends, a Text's position and size, and everything a Customer carries.

## The key decision: derive the alternatives (A) or store them (B)

**In Basic mode the alternatives are a pure function of today's overrides.** Rule 3 says a
scenario's child alternative in a category exists exactly when the scenario holds a local value of
a property in that category, and holds exactly those values. Today's `overrides` map already
records, per scenario, exactly which properties hold a local value and what it is. Group one
scenario's overrides by `categoryOf(prop)` and each non-empty group IS that scenario's child
alternative in that category; every empty group means "uses the Base alternative". Nothing about
the tree is left to store: the parent is always Base's alternative, the name is the scenario's,
and the Base alternatives' values are the elements'.

- **(A) Derive, store nothing new.** `alternativesOf()`, `alternativeFor()` and the resolver read
  `scenarios` and group on the fly.
- **(B) Store the tree** (`alternatives: [{id, category, parent, name, values}]`, and
  `scenario.alternatives: {category: id}`), and move the values out of `overrides` into it.

**Chosen: A**, because it is exactly equivalent and costs nothing:

- **Exactly equivalent.** Under rules 1-4 every resolved value is the same: the scenario's child
  alternative holds precisely the scenario's overrides of that category, its parent is the Base
  alternative, and the Base alternative's values are the element's. The harness proves it by
  resolving every property of every element through the alternative chain and comparing with
  `effective()` in every scenario.
- **Files unchanged.** No key is added to `serializeProject()`, so every saved project, every
  autosave and every example round-trips byte-identical, and no version bump or migration is owed.
- **One source of truth.** B in Basic mode would keep the same fact twice (the override and its
  alternative's record) and invite the drift the scenario seam check exists to stop. `setProp()`,
  the override marker, undo, rename, the Base-side delete's purge and the Apply-Base push all keep
  working untouched, because they already maintain the only thing A reads.

**What happens when a scenario's last local value in a category is removed:** its child
alternative vanishes, and the scenario uses the Base alternative of that category again. Under
Basic mode that is correct: an empty child alternative resolves every value exactly as its parent
does, so nothing observable can tell the two apart. Bentley would keep the empty alternative as a
named object; that difference matters only once alternatives are things a person names and shares,
which is Advanced mode.

**What would force B.** Any of these, all Advanced-mode:

1. **Two scenarios sharing one alternative** (Bentley's everyday case: "Peak Hour" and "Fire at
   Peak Hour" both use "Peak Demand"). Overrides are per scenario, so sharing cannot be derived.
2. **An alternative of depth two or more**, or a scenario whose parent is not Base.
3. **An alternative that exists with no scenario using it, or with no local values**, or whose name
   differs from its scenario's. All three arrive the moment a Bentley model is read faithfully.

**How B is introduced without breaking A's files.** Additively, and only when a document needs it:
a stored `alternatives` list and a per-scenario `alternatives` map are written **only when the tree
is not the one A derives** (an explicit tree). A file without them is read as A reads it today, so
every file written before B, and every Basic-mode file written after it, stays byte-identical and
opens unchanged. The resolver already walks a parent chain, so B changes where the chain is read
from, not how it is walked. A Basic-mode reader facing a file with an explicit tree must say so
rather than flatten it; that is the Advanced UX's problem and is not designed.

## The "Basic mode" row: a browser setting

**Stored in the browser, not the project** (`localStorage` key `lpn_scnbasic`, written only as
`off`, like `lpn_runbox`). CLAUDE.md's rule: modelling data rides in `serializeProject()`; a fact
about the person at the screen stays in the browser. Under A, Basic mode changes no value, no
solve and no stored byte: it decides only how much of the scenario machinery this person wants
shown, which is the kind of answer a colleague opening the file must not inherit (a Basic-mode user
handed a file by an Advanced one would otherwise open it into a UX they never asked for). What the
file holds is judged from the file itself, not from a remembered mode: once B exists, "this file
has an explicit tree" is read from its data.

**Unchecked shows one thing only**: a read-only table, one row per scenario and one column per
category, naming the alternative each scenario uses in each category and how many local values it
holds. It is the minimum honest view of a model that otherwise has no screen, **and Tom may strike
it.**

**The Demand multiplier is a calculation option, shown beside the alternatives** (Tom, 2026-09-30:
*"Demand multiplier: OK. A Demand Multiplier column with the alternatives?"*; Mary and Sue: Bentley
keeps demand adjustments in Calculation Options, not alternatives). It is the last column, after a
divider, so it reads as set apart from the categories. Base shows the project's value; a scenario
shows its own, and blank means it inherits the project's. Task 755 covers more per-scenario options
later. No editing, no Bentley import or export, no Google Sheets: the Advanced UX is not designed.

## Settings in scenarios: Presentation and Calculation (2026-10-05)

Tom, 2026-10-05:

> "based on recent insights, we will add a presentation alternative category that contains
> Window/View and Settings, Map appearance and Settings, Symbology overrides (essentially all
> Settings that are not covered in another alternative). The main principle is that any Setting
> that is stored in the project should be subject to scenario overrides under some alternatives
> category, probably Presentation or Calculation."

**This replaces** the earlier line that only the demand multiplier, the total run time and the
hydraulic time step may vary by scenario ("Friction method, units, accuracy and trials never vary
between compared scenarios", Sue's advice, recorded beside `LPN_SCENARIO_TIME_KEYS`). Accuracy and
trials now vary like any other calculation option. Friction method and units still do not, for the
reason below: they change what stored numbers mean.

**Bentley has no Presentation category.** **CITED** (`dev/bentley-interop.md`, KB0013701,
KB0057843): Bentley keeps symbology, colour coding, annotation and named views in the `.wtg`,
outside the scenario model, so a scenario cannot change them. A Presentation alternative is ours
alone and has no Bentley translation, as position already is. **Bentley's Calculation Options are
not an alternative either**: a scenario names one set of calculation options beside its
alternatives. Our Calculation category is that set, shown as one more column.

### The inventory

Enumerated from `serializeProject()`, `defaultSettings()`, `defaultLabelSettings()`,
`applySaved()` and the `.inp` readers that write onto `settings` (`readQualitySections()`,
`readEnergySection()`, `readSourceMixingSections()`, `readTagsSection()`), not from memory. The
code's table is `LPN_SETTING_CATEGORY_OF`, and the harness fails a key a saved project carries that
the table does not name. A path naming an object covers everything under it; the longest named
path wins.

**Presentation (`presentation`), 47 paths.** Everything about how the drawing looks.

| Where it lives | Paths | Read by |
|---|---|---|
| `project` | `basemap`, `basemapLast` (the street map, satellite or none; what to go back to) | `basemapSource()`, `setBasemapOn()`, `paintBasemapTiles()` |
| `labelSettings` | `node`, `link`, `customer` (which values a label shows), `decimals`, `prefix`, `suffix`, `useUnits`, `separator`, `show`, `priority`, `markExtrema`, `customerMaxWidth` | `labelRowSpecs()`, `labelPrefixFor()`, `labelSuffixFor()`, `labelUsesUnits()`, `labelSeparator()`, `nodeShedMaxRungs()`, `decorationFor()`, `customerLabelWidthLimitSI()`, the Symbology box |
| `settings`, symbols and labels | `textSize`, `symbolSize`, `linkWidth`, `symbolOpacity`, `symbolCapMultiple`, `symbolCapPercentile`, `labelMaxWidth`, `alignPipeLabels`, `labelFlipLeftOfVertical`, `maskLabels`, `showArrows`, `leaderSnapDeg`, `legendPosition` | `effectiveFontSize()`, `symbolFactor()`, `linkStrokeWidth()`, `refreshSymbolSizes()`, `symbolCapMultiple()`, `labelWidthLimitSI()`, `linkLabelAligned()`, `labelFlipLeftOfVertical()`, `applyMaskLabels()`, `showArrows()`, `leaderSnapDeg()`, `placeLegends()` |
| `settings`, map appearance | `basemapStyle`, `backdropOpacity` | `basemapStyleName()`, `backdropImageOpacity()` |
| `settings`, colour by value | `colorNodeField`, `colorLinkField`, `colorRampNode`, `colorRampLink`, `colorClassesNode`, `colorClassesLink`, `colorReverseNode`, `colorReverseLink`, `colorBreaks`, `colorModes`, `colorLegendPosition` | `colorFieldOf()`, `colorRampKey()`, `colorClassCount()`, `colorReverseOf()`, `storedBreaks()`, `effectiveBreaks()`, `colorModeOf()`, `renderColorLegend()` |
| `settings`, contours | `contourFill`, `contourLines`, `contourLabels`, `contourOpacity`, `contourInterval`, `contourBuffer`, `contourTerrain` | `contourFillMode()`, `contourIsOn()`, `drawContourLabels()`, `contourOpacityOf()`, `contourIntervalOf()`, `contourBufferOf()`, `contourTerrainWanted()` |

**Calculation (`calculation`), 8 paths, two of them whole groups.** What the solver is told, other
than the network itself.

| Path | Read by | Note |
|---|---|---|
| `settings.engine` | `engineFor()`, `runSolve()` | EPANET or the built-in solver. |
| `settings.autoRun` | `scheduleSolve()`, `runSolveEpanet()` | Recalculate automatically. |
| `settings.hydraulics` (all of it: `accuracy`, `trials`, `unbalanced`, `unbalancedTrials`, `headError`, `flowChange`, `dampLimit`, `checkFreq`, `maxCheck`, `demandModel`, `pdaSrc`, `minPressure`, `reqPressure`, `pressureExponent`, `specificGravity`, `viscosity`, `emitterExponent`, `statusReport`, `demandMultiplier`) | `assembleModel()`, `solveAccuracy()`, `convSetting()`, `contourSubtractGround()`, `paneColPdaResult()` | **`demandMultiplier` already varies by scenario**, stored as `scenario.demandMultiplier` (Task 721), and stays there. `demandModel` and `pdaSrc` travel together. |
| `settings.emitterExponent` | `emitterGamma()`, `assembleModel()` | The older mirror of `hydraulics.emitterExponent`. |
| `settings.tolerance` | `solveAccuracy()` | Deprecated, still read from old files. |
| `settings.quality` | `qualitySetting()`, the solve | Mode (age, trace, chemical) and trace node, one object. **SPECULATION**: Bentley's trace node sits in a Trace alternative; we have none, so it rides with the mode. |
| `settings.qualityOptions` | `qualitySetting()`, the exporter | The file's own Quality, Diffusivity and Tolerance text. Travels with `settings.quality`. |
| `times` (all of it: `duration`, `hydraulicStep`, `patternStep`, `patternStart`, `reportStep`, `reportStart`, `startClock`, `qualityStep`, and the typed `text`) | `effectiveTimes()`, the exporter | **`duration` and `hydraulicStep` already vary by scenario**, stored as `scenario.times` (Task 755), and stay there. |

**Existing element categories, 13 paths.** A document-wide value that belongs with element
properties already in a category.

| Path | Category | Why |
|---|---|---|
| `settings.reactions.globalBulk`, `globalWall`, `orderBulk`, `orderWall`, `orderTank`, `limitingPotential`, `roughnessCorrelation` | Constituent | The global rates and orders the per-pipe `bulkCoeff`/`wallCoeff` (already Constituent) fall back to. |
| `settings.energy.globalEfficiency`, `globalPrice`, `globalPattern`, `demandCharge`, `currency` | Energy cost | The global price and pattern the per-pump `energyPrice`/`energyPattern` (already Energy cost) fall back to. |
| `defaultPattern` | Demand | The pattern a demand with no pattern of its own follows. **SPECULATION** that Bentley would call it Demand. |

**Excluded: stored in the project, never varied by a scenario.** Each with its reason.

| Path | Why not |
|---|---|
| `units` | **Changing a unit reinterprets the typed number** (CLAUDE.md). A scenario with its own units would read every stored number in the project differently. |
| `settings.method` (friction method) | **Same defect as units**: a pipe holds one roughness number, and the method says whether it is a C, an e or an n. A Darcy-Weisbach scenario would read a C of 130 as 130 mm of roughness. Bentley keeps a separate attribute per method; we do not. |
| `origin`, `project.coords`, `project.crs`, `project.georef` | The coordinate frame. Every position in the file is measured from it, and a scenario's own frame would move every element. |
| `backdrop` | The image and its registration. The image is megabytes, so a copy per scenario multiplies the file; the registration is coordinates in the document's frame. Its opacity (`settings.backdropOpacity`) is Presentation. |
| `view` | **Excluded for now, Tom's call (question 2 below).** It is a camera position, and a scenario holding one would move the map on every switch of scenario, which the page's rule against automatic zooms forbids. It also carries coordinates through the Y flip, the origin shift and the geographic projection. |
| `settings.idPrefixes`, `settings.defaults`, `settings.nodeElevSource` | **New-asset settings write Base data** (question 3). They seed a new element's id and its own values, which are Base-owned even when the element is drawn inside a scenario. Bentley keeps the same thing as Prototypes, outside scenarios. |
| `settings.customProps` | The design of each custom property. A stored value means nothing without its design, so two scenarios disagreeing about the design would read the same value two ways. The values themselves are already User data. |
| `settings.fileOptions`, `inpSections` | Text carried verbatim from an `.inp` that this page does not act on. |
| `patterns`, `curves`, `pipeTypes`, `fittingSets`, `profiles` | **Document objects** (CLAUDE.md: *"A curve is a document object; an element holds only a reference. The reference is scenario-overridable, the points are not."*). The same rule for every library. |
| `controls`, `rules` | Model content, not settings. Bentley's home for them is the Operational alternative, which we do not have yet. |
| `project.name`, `project.docId`, `project.gallery`, `format`, `app`, `v`, `nextId` | What the document is and how it counts ids. |
| `project.activeScenario` | Which scenario is open. Cannot depend on the scenario. |
| `scenarios`, `nodes`, `links`, `labels`, `customers` | The model itself; element properties are categorised in the table above this section. |
| `settings.sources`, `settings.mixing`, `settings.tags`, `settings.reactions.tank`, `settings.energy.effic` | Markers and staging the `.inp` readers leave behind: "this section was read", or a value already moved onto its element. |
| `settings.sectionsOpen`, `mapHeight`, `fileAutosaveSeconds`, `colorRamp`, `colorClasses`, `colorReverse`, `colorThematic`, `colorFrozenBreaks`, `basemapFilter`, `kmDefault`, `labelReadabilityBias` (superseded by `labelFlipLeftOfVertical`; every shipped example still carries it) | Stale or migrated on open: nothing reads them, or `applySaved()` converts and deletes them. |

### The data layer: still choice A

**A setting override is stored once, on its scenario, and its alternative is derived from it**,
exactly as an element override is. Nothing about the tree is stored, for the reasons choice A was
chosen: under Basic mode the alternative is a pure function of the overrides, and a second record
of the same fact would drift.

**The store: `scenario.settings`, a sparse mirror of the project's own objects**, keyed by where the
project keeps the value:

    { settings: { textSize: 14, hydraulics: { accuracy: 0.0001 } },
      labelSettings: { node: { pressure: false } },
      project: { basemap: 'satellite' },
      times: { patternStep: 900, text: { patternStep: '0:15' } },
      defaultPattern: '2' }

- **Written only when non-empty, and never on Base.** No file written before this has the key, and
  nothing writes it yet, so every saved project, autosave and example round-trips byte-identical.
  No version bump or migration is owed. The harness holds this on every shipped example.
- **A mirror, not flat `'settings.textSize'` keys**, because the members of some maps already hold
  the separator: `colorBreaks['node.pressure']`, `contourInterval['pressure|psi']`,
  `decimals.node['quality:trace']`.
- **A leaf is a value that is not a plain object, or the whole of an atomic object.** The one
  atomic object is `settings.quality` (mode and trace node are one choice). Everything else is
  overridden member by member, so a scenario that turns one label value off holds one value, not a
  copy of the whole label map.
- **Two calculation options keep the homes they already have**: `scenario.demandMultiplier` and
  `scenario.times.duration`/`hydraulicStep`. `scenario.settings` refuses those paths, so a fact never
  has two homes; the read seam reads them where they are.
- **No coordinate is storable.** `view` and `backdrop` are excluded, so nothing in the store needs
  the Y flip, the origin shift or the geographic projection that `serializeProject()` applies to
  the document's own coordinates. Two Presentation values are lengths (`labelMaxWidth`,
  `labelSettings.customerMaxWidth`), typed in the project's display unit; units are one per
  project, so they mean the same thing in every scenario.
- **A file is read, never trusted** (`sanitizeScenarioSettings()`, beside
  `sanitizeScenarioTimes()`): Base's block goes, and so does any value at an excluded path or a
  path with another home. A value at a path no table names is kept verbatim and counted in no
  alternative, so a file from a later version loses nothing.

**The one read seam: `settingFor(scn, path)`, and `effectiveSetting(path)` for the open
scenario**, the settings twin of `effective(el, prop)`. `path` is an array (`['settings',
'textSize']`, `['settings', 'colorBreaks', 'node.pressure']`) or a dotted string where no member
holds a dot. It answers the scenario's own value where it holds one, else the project's.
**In Base, and wherever a scenario holds nothing at or under the path, it returns the project's own
object**, not a copy, so a reader moved onto it behaves exactly as before. Where a scenario holds
part of an object it returns a merged copy, so no reader can write a scenario's value into the
project's object. **The one write seam: `setScenarioSetting(scn, path, value)`**, `undefined`
clearing it (and pruning emptied containers), refusing Base, excluded paths and paths with another
home. Nothing in the interface calls it yet.

**Category of a setting: `categoryOf(path, 'setting')`**, the existing function with one more
group, so callers of `categoryOf(prop, group)` see no change. It answers a category id, `null` for
an excluded path, and `undefined` for a path no table names (the harness fails on that).
`alternativesOf()` gives every alternative a `settings` list of `{path, value}` beside its element
`values`; the count includes both. `LPN_ALT_CATEGORIES` gains `presentation` and `calculation`, so
the read-only Alternatives table gains their two columns before the calculation-option columns.
`overrideCount()`, the number beside a scenario's name, counts setting overrides too.

**Every read site that would route through the seam** (the inventory's "Read by" column, plus):

- **The `.inp` exporter**: `lpnExportInp(serializeProject(), inpExportOptions())` reads options,
  times, reactions, energy and the default pattern out of the serialized project, which is Base's.
  Exporting from a scenario must hand it the scenario's own, as `inpExportOptions()` already does
  for the demand multiplier and the two times.
- **Scenario compare** (`scenarioCompareModels()`): it assembles each scenario's model, so each
  must be assembled with that scenario's calculation settings, not the open one's.
- **The Settings box rows** (`hydNumberRow()`, `settingsUnbalancedRows()`, `settingsQualityRows()`,
  `coeffRow()`, `settingsEnergyRows()`, the Symbology and Colour groups, the generic
  `counts`/`number` rows that read `settings[key]`): they read to display, and where they write is
  the UX question below.
- **Writes from a render path**: `effectiveBreaks()`/`fillBreaks()` fill empty colour breaks on the
  first read. In a scenario that fill would land in the project's object; it must land wherever an
  edit would.
- **Caches keyed on the document**: the label-layout keep and the kept solve are keyed on
  `modelSignature()`, which hashes the serialized project. That already includes
  `project.activeScenario` and every scenario's block, so a switch of scenario misses both keeps
  with no change; listed so nobody narrows the hash later.
- **`applyScenarioChange()`**: a switch already re-solves and relabels; it must also repaint the
  symbology, the basemap and the contours when the two scenarios' Presentation differs.

**Not done in this build: routing those readers.** The seam, the store, the round-trip, the
categories and the table exist; the hundred-odd reads above still read the project's own objects.
So a setting override that a hand-edited file carries shows in the Alternatives table but does not
yet change the map or the solve. That is deliberate: nothing in the interface can make one, and
routing the readers is what changes what a person sees, which waits on the questions below.

### Questions for Tom

1. **Does the Calculation column count the demand multiplier, run time and time step?** They are
   calculation options already, with their own three columns. Recommendation: yes, count them in
   the Calculation column too, and keep the three columns as the place they are typed.
2. **Should a scenario remember its own place on the map?** If yes, switching scenario moves the
   map, which is the automatic zoom the page otherwise never does. Recommendation: no; the view
   stays one per project, and "Window/View" means the view settings (labels, legends, symbols).
3. **Should new-asset settings (ID prefixes, default diameter, elevation source) vary by
   scenario?** Bentley keeps them outside scenarios, as Prototypes. Recommendation: no.
4. **In scenario Peak Hour, you change something in Settings. Does it change Peak Hour only, or
   the project?** Today the demand multiplier row already changes Peak Hour only. Recommendation:
   **Calculation settings change Peak Hour only**, like the multiplier and like element properties
   ("you are always editing only the specific data" of your scenario). **Presentation settings
   change the project**, every scenario that has not chosen its own, with a separate deliberate
   "only in this scenario" act; otherwise turning contours on in Peak Hour and switching to Base
   would look like the contours broke. The honest cost: that is two rules where there was one.
5. **Friction method stays one per project, like units.** Each pipe holds one roughness number,
   and the method says what it means. Agree?
6. **The two new column headings are "Presentation" and "Calculation".** They are listed in
   `dev/new-english-keys.md` for your word.

## The long burn: from Basic mode to the full model (2026-10-06)

**The destination is Bentley's model, and it was never declined.** Tom, 2026-10-06, on finding a
document that said otherwise: *"I am dismayed to find myself arguing for the restoration of a project
that should never have been hijacked or shortened or redefined in the first place."* The misreading
came from a session note titled "Bentley is not ours", which recorded his 2026-09-30 correction (ours
is flat, theirs is a tree over alternatives, and that model is the price of interop) and read as a
refusal. It is renamed and corrected. **A design that closes a door on the tree is a defect.**

The road, each stage shippable alone, each hidden from Basic mode until the Advanced UX exists:

1. **Done (2026-09-30):** Basic mode; alternatives derived from overrides (choice A); the read-only
   alternatives table.
2. **Built on this branch (2026-10-05):** every project setting has a category or a stated
   exclusion; `scenario.settings`; the read and write seams; the table counts settings.
3. **Next: route every setting reader through `effectiveSetting()`** (about 100 sites, listed
   above), so a setting override changes the map and the solve. A harness must hold "no override,
   byte-identical behaviour" at every site moved.
4. **Store the tree (choice B), additively:** `alternatives` and `scenario.alternatives` written only
   when the tree is not the derived one. Unlocks two scenarios sharing one alternative, alternatives
   of depth two or more, and named alternatives with no scenario.
5. **The scenario tree:** a scenario whose parent is not Base, inheriting its parent's alternative
   choices.
6. **The Advanced UX:** a scenario manager and an alternative manager (create, rename, re-parent,
   assign, merge), behind the Basic mode row. Design first (Ida, Sue, Declan), then Tom's interview.
7. **Interchange:** the scenario workbook (Task 752) and the Show-scenarios table (Task 766) read the
   stored tree rather than the derived one.

**Where we diverge from Bentley on purpose, and the cost.** Bentley keeps symbology, colour coding
and named views outside the scenario model (`.wtg`), so a Presentation alternative is ours alone: a
Bentley import brings none, and an export carries none. Bentley's Calculation Options are not an
alternative but a set the scenario names; our Calculation category should stay mappable to that one
set per scenario, so an import can place it without guessing.

**A saved view lives in a Presentation alternative** (Task 765, Tom 2026-10-06), restored by one
click. Whether switching scenario also moves the map is a separate question (interview, b2); the
cheap reading that satisfies both is that the view is stored with the alternative and restored on
request, never on a scenario switch.

## The code

`js/looped-network.js`, section "SCENARIO ALTERNATIVES": `LPN_ALT_CATEGORIES`, `categoryOf(prop,
group)`, `alternativesOf(scenario)`, `alternativeFor(scenario, category)`, `resolveThroughAlternatives(scenario, el, prop)`.
`effective()` is NOT rewired through it: it runs per property per element per render and per solve,
and in Basic mode its one override lookup already IS the one-hop chain. The harness holds the two
equal instead.

Settings in scenarios: same file, section "SETTINGS IN SCENARIOS": `LPN_SETTING_CATEGORY_OF`,
`categoryOfSetting()` (also `categoryOf(path, 'setting')`), `settingFor(scn, path)`,
`effectiveSetting(path)`, `setScenarioSetting()`, `sanitizeScenarioSettings()`.

Basic mode and the table: same file, section "SCENARIOS > BASIC MODE" (`setScenarioBasicMode()`,
`rebuildAlternativesTable()`); the box is `#lpn_alt_box` in `Looped-Network.php`. The box's
position and size are not remembered, so the only new thing a browser stores is `lpn_scnbasic`
(registered in `lpn_furniture_check.php`, `dev/cookie-storage-inventory.md` and Erase everything).
Harness: `dev/lpn-spike/scenario-alternatives-harness.js`.
