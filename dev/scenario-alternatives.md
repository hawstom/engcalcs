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
2. **One root alternative per category, used by Base** (in Basic mode; with Basic mode off Base may
   name any alternative, Tom's calls of 2026-10-14 below). We call it the Base alternative of that
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
| Physical (`physical`) | Physical | pipe `diameter`, `roughness`, `k`, `length`, `typeId`, `fittingsId`; pump `curveId`, `efficCurveId`; junction `emitter`; reservoir `head`, `headPattern`; node `x`, `y`, `elev`; tank `minLevel`, `maxLevel`, `tankDiameter`, `volCurve` | **SPECULATION** for `emitter` and `head`: Bentley's reservoir "elevation" and junction emitter coefficient are element attributes we believe sit in Physical; not confirmed from a cited page. **Position has no Bentley home at all**: Bentley's geometry does not vary by scenario. Ours does (Tom, 2026-09-15), so a Physical child alternative holding `x`/`y` is ours alone and has no Bentley translation. |
| Demand (`demand`) | Demand | junction `demand`, `demands` (the whole breakdown, R-369) | Tom's Peak Hour example. |
| Asset activation (`topology`; Tom, 2026-09-30) | Active Topology | node `active`, link `active`; node and link `type`, link `valveType` (Morph, Task 781) | Task 753 ("Activation") is Tom's call on the words; the id here is neutral. Drawing inside a scenario (`bornInScenario()`) writes `active: true` there, so it creates that scenario's topology child alternative, exactly as Bentley's own "element added in a child topology" does. A link whose end is inactive is itself out (`linkLive()`). See "Active topology, and Morph". |
| Initial settings (`initial`) | Initial Settings | link `status`, valve `setting`, tank `level`, pump `speed`, `speedPattern` | **CITED** for pipe status: *"a pipe can start in an open or closed position and a pump can start in an on or off condition"*, <https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/31010.html>. Tank level and valve setting: Bentley's SCADAConnect page lists *"initial conditions with regard to such properties as tank water levels, pump status and settings and valve status"*, <https://docs.bentley.com/LiveContent/web/Bentley%20WaterCAD%20CONNECT%20Edition%20Help-v1/en/GUID-E8008FFA-6E0C-4A98-AAF6-C6CC742D5A71.html>, which does not name the alternative; placing them in Initial Settings is SPECULATION on that reading. |
| Constituent (`constituent`) | Water Quality: Constituent | node `initQuality`, `sourceType`, `sourceQuality`, `sourcePattern`; tank `tankCoeff`, `mixingModel`, `mixingFraction`; pipe `bulkCoeff`, `wallCoeff` | Bentley splits water quality into Age, Constituent and Trace; everything we let a scenario vary is a chemical's. |
| Fire flow (`fireflow`) | Fire Flow | junction `fireFlow` | The required fire flow per junction (Task 530). |
| Energy cost (`energy`) | Energy Cost | pump `energyPrice`, `energyPattern` | |
| User data (`userdata`) | User Data Extensions | every custom property (`custom_*`, Task 636) | Bentley lets a user field be placed in an alternative; ours are all overridable, so they are one category. Also the home of any stray property name an old file carries that no category claims, so "exactly one" holds for every key a file can contain. |
| Text (`text`) | none | Text label `text`, `active`, and (Tom, 2026-10-12) its position `x`, `y` and look `sizeMult`, `align`, `valign`, `bold`, `rot`, `allZoom`; its attachment stays Base's. One note is one alternative's business, so it is not split with Presentation. A position override is stored in the file's frame (`textCoordOut()`). **Ours only.** Bentley keeps annotation in the `.wtg`, outside the model (`dev/bentley-interop.md`). A label's `active` is not topology: it takes nothing out of the solve. |

**The demand multiplier is a calculation option.** `scenario.demandMultiplier` is a per-scenario
number, not an element property. Its Bentley counterpart is a **Calculation Option** (a scenario
names one set of calculation options beside its alternatives), so it stays stored on the scenario,
and counts in the Calculation category (Q7).

**Bentley categories we have nothing for:** Operational (controls; our `[RULES]` are the
document's, not a scenario's), Age, Trace (the trace node is a document setting), Capital Cost,
Pressure Dependent Demand, Transient (HAMMER), Failure History, Flushing, SCADA, and the other
product-specific ones.

**Every property is overridable** (Tom, 2026-10-12: *"I don't accept this. Change it, include them
all as overridable ... these limitations were ... indefensible."*). Ground elevation, a reservoir's
head pattern, a tank's depth limits, diameter, volume curve and mixing, and a pump's relative speed
and speed pattern were Base-owned until then, on the reading that what is built does not vary by
scenario; Bentley's own Physical alternative carries elevation. They are stored bare in Base, as
the file names them (`LPN_BARE_PROP`); `scenario_seam_check.php` refuses an unmarked bare write.
The categories for `elev`, the tank geometry, `headPattern`, mixing, `speed` and `speedPattern` are
SPECULATION from Bentley's alternative names, not from a cited page. **Still not a scenario's**:
element ids (an asset's type is, through Morph, in Active topology), link ends and bends, a Text's
position and size, an asset's description and tag, and everything a Customer carries.

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

**B is now built, additively (stages 4 and 5, below).** A is still what every Basic-mode project
is: nothing about the tree is stored until an explicit act stores it, so every such file stays
byte-identical.

## The "Basic mode" row: a browser setting

**Stored in the browser, not the project** (`localStorage` key `lpn_scnbasic`, written only as
`off`, like `lpn_runbox`). CLAUDE.md's rule: modelling data rides in `serializeProject()`; a fact
about the person at the screen stays in the browser. Tom, 2026-10-12: *"The Basic mode on/off
setting changes multiple application behaviors. And with Basic mode off, a project may become too
complex for Basic mode to be turned on."* Which of those behaviors this person wants is the kind of answer a colleague opening the file must not inherit (a Basic-mode user
handed a file by an Advanced one would otherwise open it into a UX they never asked for). What the
file holds is judged from the file itself, not from a remembered mode: once B exists, "this file
has an explicit tree" is read from its data.

**Unchecked shows one thing only**: a read-only table, one row per scenario and one column per
category, naming the alternative each scenario uses in each category and how many local values it
holds. It is the minimum honest view of a model that otherwise has no screen, **and Tom may strike
it.**

**The demand multiplier, run time and time step are counted in the Calculation column** (Q7), by
`overrideCount()`'s rule (only where they differ from the project's own), so a row's counts add up
to the number beside the scenario's name. Their own three columns retired with the Settings table,
which is where they are typed. No editing, no Bentley import or export, no Google Sheets: the
Advanced UX is not designed.

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
trials now vary like any other calculation option, and so, since Tom's answer of 2026-10-06, does
friction method. Only units and the coordinate frame never vary: they change what stored numbers
and positions mean.

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

**Presentation (`presentation`), 48 paths.** Everything about how the drawing looks, and where the
map is looking.

| Where it lives | Paths | Read by |
|---|---|---|
| `project` | `basemap`, `basemapLast` (the street map, satellite or none; what to go back to) | `basemapSource()`, `setBasemapOn()`, `paintBasemapTiles()` |
| `labelSettings` | `node`, `link`, `customer` (which values a label shows), `decimals`, `prefix`, `suffix`, `useUnits`, `separator`, `show`, `priority`, `markExtrema`, `customerMaxWidth` | `labelRowSpecs()`, `labelPrefixFor()`, `labelSuffixFor()`, `labelUsesUnits()`, `labelSeparator()`, `nodeShedMaxRungs()`, `decorationFor()`, `customerLabelWidthLimitSI()`, the Symbology box |
| `settings`, symbols and labels | `textSize`, `symbolSize`, `linkWidth`, `symbolOpacity`, `symbolCapMultiple`, `symbolCapPercentile`, `labelMaxWidth`, `alignPipeLabels`, `labelFlipLeftOfVertical`, `maskLabels`, `showArrows`, `leaderSnapDeg`, `legendPosition` | `effectiveFontSize()`, `symbolFactor()`, `linkStrokeWidth()`, `refreshSymbolSizes()`, `symbolCapMultiple()`, `labelWidthLimitSI()`, `linkLabelAligned()`, `labelFlipLeftOfVertical()`, `applyMaskLabels()`, `showArrows()`, `leaderSnapDeg()`, `placeLegends()` |
| `settings`, map appearance | `basemapStyle`, `backdropOpacity` | `basemapStyleName()`, `backdropImageOpacity()` |
| `settings`, colour by value | `colorNodeField`, `colorLinkField`, `colorRampNode`, `colorRampLink`, `colorClassesNode`, `colorClassesLink`, `colorReverseNode`, `colorReverseLink`, `colorBreaks`, `colorModes`, `colorLegendPosition` | `colorFieldOf()`, `colorRampKey()`, `colorClassCount()`, `colorReverseOf()`, `storedBreaks()`, `effectiveBreaks()`, `colorModeOf()`, `renderColorLegend()` |
| `settings`, contours | `contourFill`, `contourLines`, `contourLabels`, `contourOpacity`, `contourInterval`, `contourBuffer`, `contourTerrain` | `contourFillMode()`, `contourIsOn()`, `drawContourLabels()`, `contourOpacityOf()`, `contourIntervalOf()`, `contourBufferOf()`, `contourTerrainWanted()` |
| `view` (Tom, 2026-10-06, Q2) | the window: centre and scale, one atomic value | `followScenarioView()` on a switch. **Stored outward**, as a node's position override is (longitude and latitude, or the grid's absolute x and y), so the Y flip, the origin shift and the projection never touch it. Written only when a scenario deliberately holds one (`setScenarioView()`, called by the Settings box's Save this view in this scenario), as centre plus ground metres per CSS pixel. |

**Calculation (`calculation`), 9 paths, two of them whole groups.** What the solver is told, other
than the network itself.

| Path | Read by | Note |
|---|---|---|
| `settings.method` (Tom, 2026-10-06) | `frictionMethod()`, the exporter's `[OPTIONS] Headloss` | Hazen-Williams, Darcy-Weisbach or Manning. **A scenario's method REINTERPRETS each pipe's roughness number; it never converts it**, the rule CLAUDE.md states for units (*"Changing a unit reinterprets the typed number; it never converts it"*). A pipe holds one roughness, so a Darcy-Weisbach scenario of a Hazen-Williams project reads a C of 130 as a roughness of 130 in the DW unit. That is the user's to set right, with a Physical override of the roughness in that scenario, exactly as a unit change is. WaterGEMS keeps friction method in its Calculation Options too. |
| `settings.engine` | `engineFor()`, `runSolve()` | EPANET or the built-in solver. |
| `settings.autoRun` | `scheduleSolve()`, `runSolveEpanet()` | Recalculate automatically. |
| `settings.hydraulics` (all of it: `accuracy`, `trials`, `unbalanced`, `unbalancedTrials`, `headError`, `flowChange`, `dampLimit`, `checkFreq`, `maxCheck`, `demandModel`, `pdaSrc`, `minPressure`, `reqPressure`, `pressureExponent`, `specificGravity`, `viscosity`, `emitterExponent`, `statusReport`, `demandMultiplier`) | `assembleModel()`, `solveAccuracy()`, `convSetting()`, `contourSubtractGround()`, `paneColPdaResult()` | **`demandMultiplier` already varies by scenario**, stored as `scenario.demandMultiplier` (Task 721), and stays there. `demandModel` and `pdaSrc` travel together. |
| `settings.emitterExponent` | `emitterGamma()`, `assembleModel()` | The older mirror of `hydraulics.emitterExponent`. |
| `settings.tolerance` | `solveAccuracy()` | Deprecated, still read from old files. |
| `settings.quality` | `qualitySetting()`, the solve | Mode (age, trace, chemical) and trace node, one object. **SPECULATION**: Bentley's trace node sits in a Trace alternative; we have none, so it rides with the mode. |
| `settings.qualityOptions` | `qualitySetting()`, the exporter | The file's own Quality, Diffusivity and Tolerance text. Travels with `settings.quality`. |
| `times` (all of it: `duration`, `hydraulicStep`, `patternStep`, `patternStart`, `reportStep`, `reportStart`, `startClock`, `qualityStep`, and the typed `text`) | `effectiveTimes()`, the exporter | **`duration` and `hydraulicStep` already vary by scenario**, stored as `scenario.times` (Task 755), and stay there. |

**Existing element categories, 16 paths.** A document-wide value that belongs with element
properties already in a category.

| Path | Category | Why |
|---|---|---|
| `settings.reactions.globalBulk`, `globalWall`, `orderBulk`, `orderWall`, `orderTank`, `limitingPotential`, `roughnessCorrelation` | Constituent | The global rates and orders the per-pipe `bulkCoeff`/`wallCoeff` (already Constituent) fall back to. |
| `settings.energy.globalEfficiency`, `globalPrice`, `globalPattern`, `demandCharge`, `currency` | Energy cost | The global price and pattern the per-pump `energyPrice`/`energyPattern` (already Energy cost) fall back to. |
| `defaultPattern` | Demand | The pattern a demand with no pattern of its own follows. **SPECULATION** that Bentley would call it Demand. |
| `settings.defaults` (default diameter, roughness, minor loss, elevation, tank levels and size, and its `nodeElevSource`), `settings.idPrefixes`, `settings.nodeElevSource` | Physical | **New-asset settings** (Tom, 2026-10-06, Q3: *"Leave the creativity to the users. Give them freedom. And be perfectly consistent in the design."*). The value a new element is born with sits in the category of the property it seeds. Bentley keeps these as Prototypes, outside scenarios, so this is ours alone. An ID prefix seeds an element's name, which has no category; Physical is its nearest home and is question 8 below. Read by `addNode()`, `addLink()`, `mintId()`, `elevSourceIsDem()` and the push-defaults tool. |
| `settings.defaults.demand` | Demand | The one new-asset value that seeds a Demand property. |

**Excluded: stored in the project, never varied by a scenario.** Revisited against Tom's
2026-10-06 rule: *"The one thing we refuse to do in the same project is let equations push physical
dimensions around (units and coordinates conversion)."* and *"be perfectly consistent in the
design."* So two exclusions are on principle, and every other one is something a scenario
genuinely cannot hold: identity, the open scenario itself, and document objects referenced by id.

| Path | Why not |
|---|---|
| `units` | **On principle.** Changing a unit reinterprets every typed number (CLAUDE.md). A scenario with its own units would read every stored number in the project differently. |
| `origin`, `project.coords`, `project.crs`, `project.georef` | **On principle: the coordinate frame.** Every position in the file is measured from it, and a scenario's own frame would move every element. A scenario's moved node and its own view are both stored outward, so neither needs a frame of its own. |
| `project.name`, `project.docId`, `project.gallery`, `format`, `app`, `v`, `nextId` | **Identity**: what the document is and how it counts ids. |
| `project.activeScenario` | **The open scenario itself.** Cannot depend on the scenario. |
| `scenarios`, `nodes`, `links`, `labels`, `customers` | **The model itself**; element properties are categorised in the table above this section. |
| `patterns`, `curves`, `pipeTypes`, `fittingSets`, `profiles` | **Document objects referenced by id** (CLAUDE.md: *"A curve is a document object; an element holds only a reference. The reference is scenario-overridable, the points are not."*). The same rule for every library. A scenario that wants a different curve references a different one. |
| `settings.customProps` | **A document object**: the design of each custom property, which its values are read through. Two scenarios disagreeing about the design would read the same value two ways. The values themselves are User data. |
| `backdrop` | **A document object** (the image, megabytes, which a copy per scenario would multiply) **placed in the coordinate frame** (its registration). Its opacity (`settings.backdropOpacity`) is Presentation. |
| `controls`, `rules` | **Not yet.** Bentley's home for them is the Operational alternative, which we will take when we take it; today they are model content, edited as one list. Listed so the gap is visible, not as a principle. |
| `settings.fileOptions`, `inpSections` | Text carried verbatim from an `.inp` that nothing on this page reads or edits. A scenario has no way to hold a different one and nothing would act on it if it did. |
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
- **No coordinate is stored in the drawing frame.** The one coordinate in the store, a scenario's
  `view`, is stored outward, as a node's position override already is, so nothing in the store needs
  the Y flip, the origin shift or the geographic projection that `serializeProject()` applies to
  the document's own coordinates. Its scale is ground metres per CSS pixel (stage 3c), so it
  means the same zoom in either frame; a view that shows none of the model is refused by
  `viewShowsModel()`, and a refused view moves nothing. Two Presentation values are lengths (`labelMaxWidth`,
  `labelSettings.customerMaxWidth`), typed in the project's display unit; units are one per
  project, so they mean the same thing in every scenario.
- **A file is read, never trusted** (`sanitizeScenarioSettings()`, beside
  `sanitizeScenarioTimes()`): Base's block goes, and so does any value at an excluded path or a
  path with another home. A value at a path no table names is kept verbatim and counted in no
  alternative, so a file from a later version loses nothing.

**The one read seam: `settingFor(scn, path)`, and `effectiveSetting(path)` for the open
scenario**, the settings twin of `effective(el, prop)`. `path` is an array (`['settings',
'textSize']`, `['settings', 'colorBreaks', 'node.pressure']`) or a dotted string where no member
holds a dot. It answers the scenario's own value where it holds one (or, once the tree is
stored, the nearest one it inherits), else the Base Presentation or Calculation alternative's
values, which are the project's own objects.
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

### Stage 3: every reader routed (2026-10-06)

**Done.** About 110 read sites in some 75 functions now read the open scenario's value through
`settingFor()`, by four shorthands: `scnSetting(member)`, `scnLabels(path)`, `scnProject(member)`
and `scnDefaultPattern()`. A reader that runs per element asks for a leaf (a number, a flag), which
is never copied; a pass that wants a whole map (`refreshLabelTextPass()`, `customerLabelLines()`)
asks once and hands it down. `settingFor()` builds nothing in Base or in a scenario that holds no
setting: it is one walk of the project's own object. Beside the readers:

- **The `.inp` export** is handed `inpExportDocument()`: the serialized project with the open
  scenario's settings block laid over a copy of `settings` and `defaultPattern`; and
  `inpExportOptions().times` now carries every `[TIMES]` value the scenario holds, not only the run
  time and time step (`js/lpn-inp.js` reads all seven).
- **The run's clock**: `timesForScenario()` lays the scenario's held `[TIMES]` values under the two
  with their own home; `patternMultiplier()` reads the pattern step and start through
  `scnPatternClock()` without building the block, because it runs per element per solve.
- **Scenario compare** assembles each scenario under its own settings (it already switched the open
  scenario per row). Its "The same in every scenario" list now asks friction method, accuracy and
  trials of every scenario and states each only when all agree, since none is the same by
  construction any more. A row that differs is left out; showing it per scenario is a new column
  and waits for the settings table.
- **The label-layout keep** is keyed on the open scenario's settings block where it holds one;
  nothing is added to the key in a project that holds none.
- **A scenario's view**: see "The view" under stages 4 and 5.

**Deliberately left reading the project's own objects**, each with its reason:

- **Every editor in the Settings box** (Symbology, Labels, Colour, Contours, Hydraulics, Quality,
  Energy, reactions, the new-asset rows, the ID prefixes) and the transport's Recalculate toggle.
  They read to show the value they then write, and they still write the project. Moving the read
  without the write would show a scenario's value in a box whose edit lands somewhere else. Both
  halves move together in the editing stage. **Until then, in a scenario that holds a setting,
  the Settings box shows and edits the project's value while the map shows the scenario's.** Only a
  hand-written file can make one today.
- **The writes from a render path** (`fillBreaks()`, `fillFromMethod()`, `showContour()`) still
  write the project, where an edit lands today.
- **Opening and converting a file** (`applySaved()`, `migrateSaved()`, the `.inp` readers, the
  Convert-as and unit-change rewrites, `syncRoughnessLabelDecimals()`): they act on the project's
  own data.
- **The places that want Base's demand multiplier by name** (`createScenario()`'s seed,
  `overrideCount()`, the ready-made scenarios, the Alternatives table's Base row,
  `docDemandMultiplier()`'s fallback): they mean the project's value, not the open scenario's.
- **Tools that write Base only** (`applyIdPrefixToAll()`, the `.inp` import's id minting).

**The evidence that nothing moved for a project with no setting override**
(`dev/lpn-spike/scenario-settings-routing-harness.js`): every shipped example, plain and with
colouring, contours and labels turned on, in Base, in a fresh scenario, and in a scenario holding
element overrides, a demand multiplier and its own run time, is drawn, coloured, labelled, solved
and exported by the real page and by the same page with the seam blinded, and the SVG of the map,
the legends, the solver's model and answer and the `.inp` text are byte-identical (42 cases). The
blinded run is checked to see a held setting NOT take effect, so the comparison is real. Measured
once more by hand against the commit before any reader moved (3d4f2c27): the same 42 cases, 14 MB
of output, identical. The same harness holds a Presentation value (text size, a head label), a
Calculation value (accuracy, viscosity, friction method) and values that ride into the `.inp`
(viscosity, global bulk rate, pattern step) changing their scenario and not Base.

### Stage 3b: the Settings table (built 2026-10-06)

Tom, 2026-10-06: *"Scenarios must be added to tables so we can audit these things. And by
extension, there will have to be a settings Table."* Built as one more table of the Tables pane
(tab **Settings**, after Customers), from the same spec as the asset tables, so sorting, column
widths, copy, paste, Fill down, Print, Show scenarios, the override wash, its tip and Clear override
are the asset tables' own.

- **Every setting a scenario may hold is a row, stated or not** (`settingTableRows()`): the leaves
  of a fresh project's settings, the ones it leaves unstated (`LPN_SETTAB_OPTIONAL`: friction
  method, the hydraulic options, reactions, energy), the colour and contour settings of the fields
  being coloured, every leaf the project or any scenario states, and the seven `[TIMES]` values. An
  unstated row shows the value the page uses, marked "(default)". A legacy setting
  (`LPN_SETTAB_SUPERSEDED`) is hidden while the one that replaced it is stated. Units and the
  coordinate frame are never rows. A row's id is the path as JSON.
- **Columns: Major heading, Minor heading, Owner, Setting, Category, Value** (Tom, 2026-10-05; Owner
  2026-10-07, see round three). Major and Minor are where the Settings box shows it.
  **Setting is always visitor words, never a stored name**: the box's own label, else a key of its
  own (`lpn_settings_row_*`), a map's member in the Labels box's and toolbar's words ("Node labels:
  Pressure, Decimals", "ID prefixes, Junction"), contour rows saying Contour, and new-asset values
  saying "New assets: Diameter". `settings-table-labels-harness.js` fails a stored-name-shaped cell
  on every example with every view option on. With Show scenarios on, Scenario sits after Setting.
- **Value is in visitor words**: a choice or a yes/no is a select of the Settings box's own options;
  a number carries its unit; an object (Map view, colour band boundaries, Quality parameter) is a
  short read-only summary, edited in its own box. A wrong entry reverts and says nothing, as the
  asset tables do. The screen-reader label is the setting's name.
- **Value is read with `settingFor()` in the row's scenario and written with
  `setScenarioSetting()`**; Base writes the project's own object. The demand multiplier and the run
  time and time step keep their own homes and writers (`calcTargetOf()`, `setScenarioTime()`). A time
  keeps its typed text beside its seconds.
- **The Settings box writes the open scenario** (Tom, Q4), through one seam rather than its thirty
  editors (`withSetboxView()`, `setboxEditBegin()`/`setboxEditEnd()`, `wireSetboxScenarioSeam()`,
  `setboxEditTimes()`): in a scenario its builders run against the scenario's resolved view, so the
  box shows what the scenario uses; every change, input or click in the Settings and Contour boxes
  is bracketed, and whatever setting it changed goes to the scenario, the project's own value put
  back. A path no scenario may hold (a custom property's design) stays the project's; an answer to
  a question the box asked (the friction method's confirm) is bracketed too. Units say "Units are
  the same in every scenario" while a scenario is open; Restore defaults is Base's act only.
  **For the length of the bracket the globals `settings` and `labelSettings` are the scenario's
  view** (Tom, 2026-10-12: an override cleared to false came back ticked). The editors write the
  globals when they fire, and outside a build those were the project's own, so a value equal to
  Base's (a label cleared that Base leaves cleared, Hazen-Williams picked back) changed nothing the
  seam could see and was dropped; the same drop is why a child scenario clearing a label it
  inherited ticked got no Presentation alternative. A save asked for mid-bracket waits for its end.
- **The control in the hand stays under the pointer** (Tom, 2026-10-12: the override note "loses my
  place in the settings box"). The rebuild let the browser's scroll anchoring pick a surviving node
  to hold still, and the content jumped hundreds of pixels (a link label at 522 px came back at
  -106). The box turns anchoring off (`overflow-anchor: none`) and `setboxKeepPlace()` holds the
  control the edit began on at its place on screen through the rebuild and the marks.
- **A keystroke is not a rebuild**: an `input` event in the box routes its value and redraws the
  map but leaves the box alone (`settingTableAfterEditKeepBox()`), so typing into a label's text box
  in a scenario keeps every character; the `change` on leaving the field rebuilds it.
- **Every other door that writes a setting, routed or justified** (from a search of every write to
  `settings`, `labelSettings`, `project.basemap` and the default pattern):
  - *Routed through the seam* (`throughSettingSeam()`): Graphs > Contour (`showContour()`), the Map
    menu's and the corner's basemap (`setBasemapSource()`: World map Attach and Detach, satellite),
    and the transport's Recalculate hook.
  - *Never writes from inside a scenario*: the colour breaks a render fills in (`fillBreaks()`); in a
    scenario they follow the data until someone sets them.
  - *Follows a renamed pattern*: a library rename repoints a scenario's held default pattern too.
  - *Base's act, refused in a scenario* with the new-asset push's words: ID prefix Apply to all.
  - *The project's own, by design*: opening, creating and migrating a project; a unit change and
    Convert as (units are one per project); the georeferencing wizards (the coordinate frame);
    undo and redo.
- **Every edit is an undo step, the box's included, and restores only what it changed**: a step
  carries the setting paths it edited with their earlier values (`settingPaths`,
  `undoTopHoldsSettingPaths()`), never the whole settings object, so Ctrl+Z on one edit never reverts
  another made after it (Perry's repro: a table multiplier, then a box friction method).
- **A new scenario inherits everything, the demand multiplier included**: nothing is seeded, so
  nothing is marked that the count ignores, and the scenario follows Base until given its own. Tom's
  2026-09-02 complaint the seed answered is answered by the box showing the inherited value.
- **An override is marked by `hasOverride()`'s rule**: local where the scenario writes
  (`settingRowIsLocal()`).
- **Friction method varies by scenario and reinterprets roughness, never converts it**; the value
  warning follows the method in effect, row by row under Show scenarios (`paneValueWarn()` judges a
  row in its own scenario).
- **Not filtered** by Find or by Selection only; its menu has no map, Delete or Delete element items.
- **The Alternatives table's three option columns retired** (Q7); its last two columns are
  Presentation and Calculation. The note under Settings, Time names each scenario holding its own
  run time or step, and its button opens the Settings table on that row.
- **Visible in Basic mode: CC's call, for Tom to judge.** Show scenarios already is, it is a table,
  and in Basic mode it is now the only table where a scenario's own settings are audited. The
  alternative is to show the tab only with Basic mode off, as the Scenarios table is.

Harnesses: `dev/lpn-spike/settings-table-browser-harness.js` (real Chromium: Net1 and Net3 lat/lon;
Base edits and their undo, a child scenario's friction method, demand multiplier and text size,
solve before and after, Clear override, the Settings box writing Peak and not Base, Perry's undo
repro, the Alternatives table's columns and counts); `settings-table-labels-harness.js`; the two
option harnesses (`scenario-time-option-harness.js`, `scenario-tree-harness.js`) type through the
Settings table's Value cell.

### Stage 3c: a held value marked in the Settings box, and holding the view (built 2026-10-06)

- **Ida's mark, in the box itself.** In a scenario, a row whose value the scenario holds wears an
  amber edge (`--ec-held`, beside `--ec-held-bg`, in the token block), and under it a line reads
  "Base: {value}" in the Settings table's own words, then **Clear override**. No per-field checkbox:
  typing a value is what holds it. Held means `settingRowIsLocal()`'s rule (local where the
  scenario writes), so an inherited value is not marked; in Base nothing is.
- **A row says which settings it edits** (`setboxTag()`, a `data-lpn-setting` list of paths, written
  where each row is built: Map display, labels, colours, new assets, ID prefixes, Hydraulics, Time,
  Quality, Energy). A path covers every Settings table row under it, so one Labels row (show,
  decimals, before, after, units, show order, drop order) is one mark, and its note names each held part. The
  harness fails a Settings table row the box has a control for and does not tag.
- **Clear override is the Settings table's own** (`settingRowClear()` through `setScenarioSetting()`),
  one undo step, then what any setting edit redraws (`clearHeldSetboxRows()`). Undo of it, or of any
  step that changed a scenario's own setting, now redraws the map and the box as a project
  setting's undo does (`scenarioSettingsSignature()` in `restoreUndoSnapshot()`).
- **Not marked yet:** the Contour box's rows (a box of its own), and the few settings the box has no
  control for (the basemap, the tank new-asset values, check frequency and its pair, the quality
  step): the Settings table is where those are seen held.
- **The view in the box** (Map display): the map's centre (latitude and longitude, or x and y, in
  public order), its scale as 1:N, and its top left and bottom right corners, shown and never
  stored. They show the map as it is and follow it when it comes to rest. Typing a centre or a scale
  moves the map. **Save this view in this scenario** (a button, shown only in a scenario) stores the
  view through `setScenarioView()`; panning and zooming never write it. While the scenario holds a
  view, a typed centre or scale is written to it as well. The view rows are then marked like any
  held value, "Base: {view}" being Base's live view, and Clear override releases it
  (`releaseScenarioView()`, also what the Settings table's Clear override does on that row): the map
  goes back to Base's view, and the scenario follows Base's view after that.
- **Stored as centre plus ground metres per CSS pixel** (Declan): `{cx, cy, mpp}`, outward as before
  (`outwardViewOf()`/`inwardViewOf()`); 1:N is derived (a CSS pixel is 1/96 inch). A view stored
  with the older `s` (pixels per drawing unit) is still read. No file in the wild holds one: nothing
  wrote a scenario's view before this stage.

**Round two (2026-10-06), after Tom's browser pass and Perry's review.** Tom: *"(1) The Major and
Minor headings assignments don't match the Settings box. (2) The override shows in the settings
box, but not in the Settings table. Good start. Keep building."*

- **(1) Major and Minor are read from the box.** A Settings table row stands under the section and
  sub-heading of the box where its control sits (`settingBoxPlaces()`, `settingTablePlace()`), in
  the words the box's index shows (`setboxHeadingText()`), and in the box's own order, control by
  control. A setting with no box control falls back to a sub-heading the box has
  (`settingTableHeadings()` now names box sub-heading ids). So the separate "Label order" Minor
  heading is gone (its key `lpn_settings_row_minor_label_order` deleted: nothing renders it), and
  text size, symbol size and the other appearance rows now stand under Map and page, Appearance,
  where the box has them.
- **(2) The Settings table marks the open scenario's overrides with Show scenarios off**, as the
  box does (`paneMarksOpenScenario()`), and a box edit refreshes the open table at once. Before,
  the wash existed only in Show scenarios rows, and nothing refreshed the table after a box edit.
  The asset tables do the same since round three (question 12).
- **Clear override on Friction method clears what picking it wrote** (the new-asset roughness and
  the roughness label's decimals), in the same undo step (`LPN_METHOD_DEPENDENTS` in
  `settingRowClear()`, so the table's Clear does the same). This settles question 10 below.
- The Base line names the unit by **Base's** method (a Hazen-Williams C has none); a label's
  Before, After and Text between values read Base's shown default ("Q="), quoted when blank or
  space-edged; a Labels row's note names its column ("Decimals: 0"); typed text is marked as it is
  typed, the caret kept; the box's search keeps a held row's note with it; the box's index marks a
  sub-heading that holds a value.
- **The view rows**: each centre box is its own named row ("Map center, Latitude"); a latitude off
  the map's world or a longitude past 180 is refused; a centre leaving the network off screen
  shows "Your network is intact" with Zoom to fit; a scale takes "1:2000", "2:4000", "2000" or
  "1:1,000", and refuses "1,5" rather than guess; corners follow a window resize; undo of a hold or
  a release moves the map as the act did, and the Base line is always there (Base's live view,
  which with nothing remembered is where the map is).

Harnesses: `dev/lpn-spike/settings-box-held-browser-harness.js` (real Chromium, Net1: no mark in
Base or in a fresh scenario; friction method and text size changed in the box in a scenario, each
marked with Base's value; Clear override returns the box and the solve to Base's; Ctrl+Z restores
the override and its solve; every box row tagged; the view held as centre plus metres per pixel,
switching scenarios moving the camera there and back, Clear override returning to Base's view and
following it afterwards; round two: Major and Minor equal the box's section and sub-heading row
for row, the open table marking a box edit at once and on reopening, Clear on the method clearing
its companions and undoing as one, the unitless Base line, label text marked while typed with
Base's default, the search keeping notes, the index mark, the named centre rows, the refused
scale "1,5", the off-screen notice, the resize, undo of a release, and on Net3 lat/lon the
Latitude/Longitude names and the refused latitude 89 and longitude 200. Run against the previous
stage's code it fails 18 checks); `scenario-settings-routing-harness.js` holds the stored form.

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

### His answers, 2026-10-06

- **Q4, a setting changed while in Peak Hour:** Peak Hour only, for every setting, Presentation
  included. *"As I said, for this to be successful, Scenarios must be added to tables so we can audit
  these things. And by extension, there will have to be a settings Table. I hate to say it, but it's
  true. We can't treat any value overrides differently. This must be a careful and long burn."* So
  one rule, not two: a setting override behaves exactly like an element override. Two things follow:
  a **settings table** in the Tables pane (one row per setting, Show scenarios like the others), and
  the Show-scenarios view (Task 766) as the audit of every override.
- **Q2, a scenario's own place on the map:** allowed. *"A scenario may have map overrides, though
  normally they won't. Only a scenario named something like "Figure 6-1: Elm and Main contours"
  would do that."* So the view (window extent) is NOT excluded: it belongs in Presentation, and is
  written only when a scenario deliberately holds one. Revisit the exclusion list above.
- **Q3, new-asset settings by scenario:** yes. *"Leave the creativity to the users. Give them
  freedom. And be perfectly consistent in the design."* Moved into Physical (and the default demand
  into Demand); see the inventory.
- **Q5, friction method:** may vary by scenario. *"I see it indefensible to require somebody to have
  to save a project for something like friction method. The one thing we refuse to do in the same
  project is let equations push physical dimensions around (units and coordinates conversion)."*
  So the only exclusions on principle are units and the coordinate frame; every other exclusion was
  revisited against "perfectly consistent" (the Excluded table above says why each remains).
  Friction method is a Calculation option, and it reinterprets a pipe's roughness, never converts it.
- **The categories:** *"You are asking for the alternatives categories. We use the Bentley
  categories as much as we can (with things like SCADA left for the future), and we add
  Presentation, if I am not mistaken."* See "Calculation: a set, not an alternative" below.
- **Q1, does the Calculation column count the demand multiplier, run time and time step:** *"Rethink
  this, make it consistent, and bring it again. I think I know what you are saying. But the answer
  may be obvious once you look at what we are doing."* Brought again as question 7 below.
- **Q6, the two headings (answered 2026-10-06, after context):** "Calculation", not Bentley's
  "Calculation options": *"Calculation; its not privileged or odd; it's just another category."*
  He confirmed the two new count columns, and that "Value" belongs to the future settings table.
  He asked whether the Alternatives table already had one column per category: it did, read-only.

### His answers, 2026-10-05 (second round)

- **Q7, yes.** The demand multiplier, run time and time step are calculation options, counted in
  the Calculation column; their three Alternatives-table columns retire once the settings table
  exists (done 2026-10-06, stage 3b). Storage stays where it is.
- **Q8, yes.** An ID prefix by scenario sits in Physical.
- **Q9, the view, answered by a different rule:** *"Leaving doesn't do anything. Entering does
  everything."* View is a setting, and Base has a View property: the live view. Entering a
  scenario that holds or inherits a held view moves the map there; one that holds none shows what
  it inherits, Base's live view. So leaving into Base, or into any scenario holding none, shows
  Base's view.
- **Wording:** *"'Project's value' becomes 'Base Presentation or Calculation alternative's
  values'"*, in this doc and in every visitor string that says it.
- **View settings are editable in the Settings box, not read-only:** *"I am still getting used to
  the (correct!) philosophy of 'Give the user the information **and** the freedom.'"*
- **The settings table's columns:** Major Heading, Minor Heading, Category, Setting, Value.

### Calculation: a set, not an alternative

Bentley's Calculation Options are not an alternative category: a scenario names one set of
calculation options beside its alternatives, and a set has no parent and holds every option, not
only the ones that differ. **Ours is honestly the same thing under Basic mode, and a column is its
truthful picture.** In Basic mode a scenario either uses Base's options entirely or holds its own
values for some of them; "uses Base's set" and "uses its own set, which differs from Base's in
these N options" are the same statement, and the column says it the second way, as every other
category column does. Nothing about it is stored as an alternative: like everything else here, it
is derived from `scenario.settings`.

**Where the Bentley shape will matter is stage 4, the stored tree.** There a calculation-options
set must be stored as a set a scenario names, not as an alternative with a parent, so that a
WaterGEMS model's "Calculation Options: Peak" imports as one named set two scenarios can share,
and exports back as one. The code keeps `calculation` in `LPN_ALT_CATEGORIES` today because the
read-only table and the count read that list; when the tree is stored, it becomes the scenario's
named set and stops pretending to have a parent. Recommendation: keep the column, headed
"Calculation options" if you prefer Bentley's words, and model it as a set from stage 4 on.

### Questions for Tom (second round)

7. **The demand multiplier, run time and time step are calculation options, exactly like accuracy
   and friction method.** The consistent answer, now that every calculation option may vary by
   scenario, is that they are three of them and nothing more: counted in the Calculation column
   like the rest, and shown as rows of the settings table like the rest. Their three columns in the
   Alternatives table exist only because they were the first three options a scenario could hold,
   and they were the only place to type them. Recommendation: count them in the Calculation column
   now; when the settings table exists, retire the three columns, since the table is where every
   option, these three included, is typed and audited. Their storage stays where it is (it is
   invisible, and moving it buys nothing). Not changed yet.
8. **An ID prefix by scenario sits in Physical**, beside the default diameter and roughness, because
   it seeds a new element and has no category of its own (an element's name is identity, in no
   category). Agree, or would you rather it stood in its own place?
9. **A scenario's own view: where does the map go when you leave it?** Answered above.


### Questions for Tom (third round, stage 3c)

10. **Decided by CC, because the alternative is an invalid state; Tom may overrule.** Picking a
    friction method in a scenario also sets two companions there: the New assets roughness and the
    roughness label's decimals. Clearing the method alone left a Hazen-Williams scenario with a
    Manning n of 0.011 as its new-pipe roughness (Perry). So Clear override on the method clears
    the two companions with it, in one undo step. Each companion still has its own mark and its own
    Clear.
11. **The link under a held row says "Clear override"**, the Settings table's own words, where Ida
    drew "Reset". Answered: *"Clear override"* (Tom, 2026-10-07). No visitor string says Reset for
    an override.
12. **Should the asset tables (Junctions, Pipes...) also mark the open scenario's overrides with
    Show scenarios off**, as the Settings table now does? Answered: *"Yes, I think?"* (Tom,
    2026-10-07). Built in round three.

### Round three (2026-10-07), after Tom's browser pass

- **(1) Owner** (Tom: *"We need a third organizational hierarchy column to help organize the labels
  and custom properties settings... We could call it 'Owner'."*). Between Minor heading and
  Setting, so the four read as his dotted path: Symbology, Node labels, ID, Is active / Show order /
  Drop order. Owned rows: a label field's settings (Is active, Text before, Text after, Use units, Decimals,
  Show order, Drop order), a coloured field's classification and band boundaries, a
  contour field's interval, an ID prefix's asset, a custom property's design fields. Any other row
  leaves Owner blank. Category moved after Setting: it is useful but outside the hierarchy.
  (`settingTableOwnerSetting()`.)
- **"Rank" is gone.** It was `lpn_labels_col_rank`, the Labels box's heading of the drop column
  until Task 445 (2026-08-19) made it Drop, kept unrendered since; the Settings table borrowed it in
  7c758f15 for the show-order column. Show order IS a stored setting (`labelSettings.show`, per
  field, the Labels box's Show column). The key is deleted.
- **(2) Overrides only, Current scenario only**: two switches on the cell menu and the heading menu
  while Show scenarios is on, in every table. Overrides only keeps a row when its scenario holds a
  value of its own in a column of the table (the amber rule, so Base's rows never qualify); Current
  scenario only keeps the open scenario's rows. A line above the table names them, with Show all,
  the way back when no row is left (`paneScnFilterBanner()`).
- **(3) Clear override was one table render per cell**: `afterPropertyEdit()` per element
  re-rendered the open table, and each pipe's label forced a layout of the drawing. Now
  `afterPropertyEdits()` redraws each element and runs the shared tail once, and
  `withOneLabelBatch()` measures every label together and holds one link segment index for the
  batch (Perry: a 1,201-pipe labelled grid rebuilt it 2,400 times, about 2.7 s; now twice). Net3, 117 pipes, Show scenarios on: 3,135 ms
  before, about 170 ms after (jasmine). Find and replace and the Multiple properties row share it.
- **(4) Save this view**, not Hold (keys renamed `lpn_settings_view_save`, `_tip`).
- **(5) The audit.** Rows the table omitted, against every control the Settings box tags: every
  label field's Before and After (the maps ship empty, so the stated-leaf walk found none), Use
  units where a field has a unit and the project leaves it unstated, Energy currency, the colour
  band boundaries of the field colouring the map while they follow the data (Perry), and every
  custom property design field. Now all rows; an unstated Before or After shows the default the
  page prints ("Q= (default)"). Left out on purpose: Decimals of a field with no number (the box has
  no spinner for it), the PDA "stated in the file" marker, and the superseded emitter exponent.
  **A custom property's design stays the project's in every scenario** (the Excluded table): its
  rows have no category, are never marked, and are read-only in a scenario's row.
- **(6c, Q11) Clear override, never Reset**: already true of every visitor string.
- **Asset-type overrides (6a)**: built 2026-10-07, replaced 2026-10-08 by a new asset in the old
  one's place, retired 2026-10-10, and built again 2026-10-14 as Morph; see "Morph" below.

Harnesses: `settings-table-owner-browser-harness.js` (real Chromium: Owner, Rank gone, Before/After
stated or not and typed in a scenario, the box note, both filters and the banner in the Settings
and Pipes tables, Net3 lat/lon's custom property rows); `pane-clear-override-speed-browser-harness.js`
(a 117-pipe column cleared under a time bound, Q12's marks, one undo); `settings-table-labels-harness.js`
(Owner and Setting words on every example, no duplicates, Tom's example rows).

### Active topology, and Morph (Task 781, 2026-10-08 and 2026-10-14)

Tom, 2026-10-08, choosing "Active topology first": *"I never wanted what we have anyway. Now that I
understand, I want it changed. Change type is to be make a new object at the location of the old
object. And that's physically analogous."*

**Active topology is the `topology` category, and nothing new was stored for it.** `active` was
already an overridable property in that category (Task 184), resolved through the same tree
(`treeLayers()`, `resolvedOverrides()`), so a child of B inherits B's topology and a stored
topology alternative can be shared. **CITED** (WaterGEMS help, "Active Topology"): *"While elements
are inactive, they are not included in any hydraulic equations"*, and *"Inactive elements will not
appear in the corresponding tabular reports, unless the Include Inactive Topology option is turned
on."* What this task added or confirmed:

- **An asset drawn in a scenario is active only there** (and in that scenario's children), inactive
  in Base and every other scenario: `bornInScenario()`. **CITED** (WaterGEMS and SewerGEMS help,
  "Creating an Active Topology Child Alternative"): *"Add new elements to your model. These
  elements will be active only in the new child alternative"*, and in Base *"The new elements are
  shown as inactive (they are grayed out in the drawing pane)."* Kept as it was; nothing Tom ruled
  contradicts it. Rejected: an asset drawn in a scenario existing in Base too (what an ordinary
  draw in Base does), which would put every proposed pipe into the existing system.
- **A link whose end is inactive is inactive** (`linkLive()`): left out of both solvers
  (`assembleModel()`, which both engines read) and of the scenario's `.inp` export (already, with
  the `inactive-node-link` difference), and now also drawn greyed and left out of the Tables, so the
  map, the Tables and the solve agree.
- **Drawn greyed** (`.lpn-inactive`, opacity 0.3), Bentley's own treatment. Not dashed: a dashed
  line already means something to a reader of a pipe network (a proposed or abandoned main), and
  Bentley does not use it for this.
- **The Tables leave inactive assets out unless "Include inactive topology" is ticked** (Bentley's
  words and Bentley's default), on the cell and heading menus of the node and link tables
  (`paneHidesInactive()`, `paneInactiveToggle()`), per table for the life of the page like Overrides
  only. With Show scenarios on, a row is left out only in the scenarios where its asset is not live
  (`liveInScenario()`). Offered once anything is inactive in Base or a scenario exists. A Text's
  `active` is not topology and the Text table is unchanged. **Note:** a Bentley community answer
  says FlexTables show inactive rows with N/A results; the brief asked for the help page's rule,
  so that is what is built, and Tom may prefer the FlexTable behaviour.
- **The toggle** is the existing "Is active?" box in Properties and the Active column of every
  asset table, both through `setProp()`, so undo, the override marker and the scenario's write
  target are the ordinary ones. No context-menu row was added: the page's pattern is that a
  property is edited in Properties and the Tables, and the map's context menu holds commands.
  **Shown in Basic mode**: drawing and deleting in a scenario already write `active` in Basic mode,
  so the box is the visible form of what Basic mode already does; hiding it would leave a deleted
  pipe with no way back but undo. The tree it resolves through stays hidden.

**Morph** (Task 781; Tom, 2026-10-14, reversing the Base-only rule of 2026-10-10: *"I would like to
create a scenario called 'Tank at J1' and change the J1 junction to a tank in that scenario without
having to delete and reconstitute the pipes connecting to it. But as we ended up, changing element
type never creates an override. I think we need to change that."*; on the name: *"I like the term
'Morph' (Transform) for this feature"*). Water > Morph, formerly Change type. In Base it changes the
asset in place, as before (`dev/asset-type.md`). In any other scenario:

- **The new type is an override in Active topology** (`type`, and `valveType` for a link morphed into
  a valve, which is born a TCV). Active topology rather than Physical, because a morph is the
  one-element form of what Bentley's Active Topology alternative does (switch the junction off, add a
  tank), so it maps there on a Bentley export; and because it keeps the morph independent of the
  Physical alternative a scenario names, so a scenario using "Upsized mains" can still inherit "Tank
  at J1". Neither name is in `LPN_OVERRIDABLE`: no editor offers the type as a field.
  `isOverridable()` answers for them (`LPN_MORPH_PROP`), so `setProp()`, `setOverride()` and
  `clearOverride()` are the one door, as for every other value.
- **The ID, the location and every connected link stay.** Values both types have are the same
  properties and carry by themselves. Each value only the new type has, where neither Base nor an
  override states it, is written as an ordinary override of its own property, in that property's
  category (a tank's depths and diameter in Physical, its water depth in Initial settings), from
  Settings > New assets. A tank and a reservoir keep the water surface, as in Base. Asks first only
  where a control or rule tests or sets the asset and would read it differently.
- **Every reader asks the element** (`morphViewSync()`): the elements are laid out as the open
  scenario sees them (its type, and New assets values for any field of that type nothing states) and
  laid back as Base by `withBaseTypes()` around the file, the autosave and the undo snapshot. So the
  map, Properties, the Tables, Find, the labels, both solvers and the scenario's `.inp` export see the
  morphed type, and Base and the file never do. The solve re-checks the layout (`morphViewCheck()`),
  so a topology alternative picked in the Scenarios table is seen at once. With Show scenarios, an
  asset has a row in each table of a type it is in some scenario.
- **Properties shows a Type row** where the asset is morphed (or a child scenario morphs it), with
  the override marker; its dot clears the morph. Morph back to the type the scenario inherits does
  the same. Either way the scenario's overrides of values neither that type nor Base's type has (a
  tank's depths) are cleared; an override Base's type reads (a junction's demand) is kept.
- **A child scenario inherits the morph**, as any Active topology value. One undo step for the
  selection. A node morphs only into a node and a link only into a link; the rest of a mixed
  selection is left as it is, and said (`lpn_morph_other_kind`).
- **A Base morph never takes away what a morphed scenario reads** (`morphPinBase()`,
  `morphKeepsSpec()`): a scenario keeping the asset a junction while Base makes it a tank is given
  Base's demand as its own override first, and keeps its overrides of it.
- Rejected, and not to be proposed again: a new coincident asset with the old one switched off
  (2026-10-08, retired 2026-10-10 as confusing and costly). Bentley Morph, epanet-js and DC Water
  change a type only as a plain edit; ours is per scenario because Tom asked for it.

Harnesses: `morph-harness.js` (Net1, both engines against hand-built `.inp` networks: Tom's case on
junction 22, Base unchanged, the scenario's export under [TANKS] reopened and solved, save and
reopen byte-identical, undo and redo, inheritance, Clear override, Base's Active topology picked, a
pipe into a valve, a reservoir into a tank, Base morphing under a scenario's morph, six mutations)
and `morph-browser-harness.js` (real Chromium, English and Spanish).

- **A control or rule naming an asset inactive in a scenario is left out of that scenario's run and
  of its `.inp` export, and said** (Perry, 2026-10-08: EPANET refused the input, Error 200, and the
  page fell back to the built-in solver). Controls and rules are document-wide and still name the
  old asset; in the run, `dropInactiveControls()` and `modelRules()` drop them under the codes
  `control-inactive` and `rule-inactive` (status-line notes of their own, since "no longer in this
  project" would be false); in the export, js/lpn-inp.js drops them as `inactive-control` and
  `inactive-rule`, rebuilding `[RULES]` only when a block is dropped, and the export alert names
  them. Base, where the assets are active, runs and writes them as before.
**A file saved with a type override** (2026-10-07, one day, this branch only) opens with it read as
a morph: its `type` and the tank values beside it are the same names Morph writes now.

Harnesses: `scenario-active-topology-harness.js` (Net1, both engines, against hand-built `.inp`
networks: a pipe drawn in N; pipe 111 deactivated in D and a node's links greyed with it; junction
22 a tank in Base in place; Base unchanged to 1e-6 and its export character-identical; C a child
of B; undo and redo; save and reopen; each scenario's export reopened and solved; pipe 10 a valve
in Base; a type-override file opened as a morph; live mutations) and
`scenario-active-topology-browser-harness.js` (real Chromium: Morph in B and Ctrl+Z, the greying,
the Tables and both menus, the Active column, Ctrl+Z, Morph in Base). Morph in a scenario:
`morph-harness.js` and `morph-browser-harness.js`, above.

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
3. **Done (2026-10-06): every setting reader routed through `effectiveSetting()`**, so a setting
   override changes the map and the solve; a scenario may hold its own view. Byte-identical
   behaviour with no override is held by `scenario-settings-routing-harness.js`. **3b, built
   2026-10-06: the Settings table, and the Settings box writing the open scenario** (see "Stage 3b").
4. **Built (2026-10-05): the stored tree (choice B), additively.** Shared and named alternatives,
   alternatives of any depth, calculation sets. See below.
5. **Built (2026-10-05): the scenario tree.** A scenario whose parent is not Base inherits its
   parent's choices. See below. Neither stage has a screen; nothing in Basic mode changed.
6. **The Advanced UX:** a scenario manager and an alternative manager (create, rename, re-parent,
   assign, merge), behind the Basic mode row. Design first (Ida, Sue, Declan), then Tom's interview.
7. **Interchange:** the scenario workbook (Task 752) and the Show-scenarios table (Task 766) read the
   stored tree rather than the derived one.

**Where we diverge from Bentley on purpose, and the cost.** Bentley keeps symbology, colour coding
and named views outside the scenario model (`.wtg`), so a Presentation alternative is ours alone: a
Bentley import brings none, and an export carries none. Bentley's Calculation Options are not an
alternative but a set the scenario names; our Calculation category should stay mappable to that one
set per scenario, so an import can place it without guessing.

**A saved view lives in a Presentation alternative** (Task 765, Tom 2026-10-06). See "The view"
below.

## Stages 4 and 5: the stored tree (built 2026-10-05)

Tom, 2026-10-05: *"our first item of business is to get the full alternatives and inheritance
model built under the hood."* Built to an independent architecture review's plan.

**Stored only on an explicit act** (share, name, reparent, set a scenario's parent), under `doc`
so undo covers it, appended to the file last and only when non-empty:

    scenario:          {..., parent?: "s1" (absent = Base), alternatives?: {category: "a1"}, calc?: "c1"}
    doc.alternatives:  [{id: "a1", category, name, parent: null | "a2", values: {ovKey: {prop: v}}, settings: {mirror}}]
    doc.calcSets:      [{id: "c1", name, parent: null | "c2", settings: {mirror}, demandMultiplier?, times?}]

A stored id never holds `:`; the derived ones do (`s1:demand`, `base:demand`). `isExplicitTree()`
false sends every reader down the stage-3 code, so a project with no stored tree is byte-identical
by construction (the 42-case sweep measured identical against the commit before stage 4, and every
example and fixture re-saves unchanged). A file is read, never trusted (`sanitizeScenarioTree()`).
A reader from before stage 4 carries all of it through a save verbatim (`LPN_TREE_KEYS`).

**Resolution.** A category resolves through `treeLayers(scn, cat)`, nearest first, Base excluded:
the scenario's own values (its implicit alternative), then, if it names a stored alternative (a
calculation set, for Calculation), that record and its parents; otherwise its parent scenario's
chain. So a child of Peak Hour that sets a local demand is a child of Peak Hour's RESOLVED demand
alternative, not of Base's. Calculation is a set, as in Bentley, but sparse with a parent, so a
change to the Base Calculation alternative's values flows down; an export will resolve it to a full
set.

**One source of truth.** `scenario.overrides`, `.settings`, `.demandMultiplier` and `.times` are
the scenario's implicit alternatives; `alternatives[].values`/`.settings` and `calcSets[]` are the
stored ones. A scenario that names a stored record for a category holds no local value in it:
edits go to the record (`writeTargetFor()`), and `promoteImplicitAlternative()` moves a scenario's
values into a new record whose parent is what it inherited, then names it, with nothing resolving
differently. A local value written by an older reader into a named category still resolves (it is
nearest), and promote moves it out.

**Speed.** The hot readers read `resolvedOverrides(scn)` and `scenarioSettingsBlock(scn)`. Derived,
they are the scenario's own objects. Explicit, they are read-only merged maps cached per scenario
and rebuilt lazily when `touchTree()` bumps the epoch (every write site calls it), or when `doc` or
`scenarios` is a different object. An element write (`setOverride()`, `clearOverride()`) does
not empty the cache: `touchTreeKey()` regroups that one key in its holder and re-resolves it only
in the scenarios whose chain runs through that holder. Measured on Net3: no measurable cost (about
0.2 µs per `effective()` read either way). A demand set on every junction of a synthetic chain
network, in a scenario of a stored tree (2026-10-05, jasmine): 2,000 elements 108 ms before
per-key mending, 3.6 ms after (1.0 ms with no tree); 8,000 elements 2,028 ms before, 11.1 ms
after (3.1 ms with no tree). Perry measured 465 ms and 8.3 s before, on his own network.

**Maintenance** walks every map through `eachOverrideMap()`; `scenario_seam_check.php` refuses a
`.overrides`/`.values` access outside a named list of functions.

**The view.** `heldView(scn)` resolves through the Presentation chain, stopping before Base, whose
view is the live one. Entering a scenario that holds or inherits a view goes there; entering one
that holds none shows Base's live view.

**Decided by CC; Tom confirmed the first four on 2026-10-05, the rest stand until he overturns them:**

- **An override equal to its parent's value is still an override** (the key's presence is the
  intent); nothing prunes it. Tom: *"It's still an override? Yes. (Use the word override. It's the
  technical term.)"* Say "override", never "local value", in docs and visitor strings.
- Editing a shared alternative changes every scenario that uses it, as in Bentley. Tom: *"Yes!"*
- Reparenting an alternative or a scenario keeps its own values; what it inherits may change. For a
  scenario (Tom, 2026-10-12): *"What it **inherits** changes. But what it has overridden does not
  change."* A category in which it names its own alternative keeps it wherever the scenario moves.
- Deleting an alternative, a calculation set or a scenario is refused while anything uses it, and
  the refusal names who (the Scenarios menu's Delete row says so in a notice); merging is the way
  to retire one. Tom: *"Yes."*
- **A merge moves no value any user of the merged alternative reads** (Perry's review): the target
  must be its ancestor (the alternatives between are folded in) or its sibling whose own values
  would not reach those users; anything else is refused, saying why. Values combine by the rule
  they resolve by, the demand pair included. The target's other users do gain the merged values. Tom: *"Yes."*
- No automatic demotion: a stored alternative that becomes empty or unshared stays stored.
- Calculation sets are sparse with a parent, not Bentley's full set.
- The edit marker means "local in the alternative this scenario writes to"; an inherited value is
  not marked.

**No UI obligation left from seeding:** a new scenario is no longer seeded with the project's
demand multiplier (stage 3b), so assigning it a calculation set meets no local value to refuse.

**Not yet at stage 5:** no screen for any of it (stage 6, below, adds one); the override count still shows
each scenario's own values; a unit change converts element values in stored alternatives but, as
in stage 3, not unit-bearing values held in any settings block.

### Stage 6: the Scenario manager and the Scenarios table (built 2026-10-09)

Tom's calls of 2026-10-09 (H01-H08), in his words where they govern:

- **One narrow tree pane per tree, doing little**: *"a tree is needed for every alternative category and
  for scenarios ... you don't do much in that pane other than name, rename, add, delete, and move
  children and branches."* The box is `#lpn_sm_box`, "Scenario manager", docked by the page's dock
  machinery; a selector chooses Scenarios or one of the eleven categories. An alternative's contents
  are edited in Properties and Settings under the current scenario; there is no Alternatives editor
  and no Alternatives table (the read-only preview box this replaced, `lpn_alt_box`, is gone).
- **The Scenarios table** (Tables pane, shown with Basic mode off): one row per scenario, one column per
  category, each cell a pick-list of that category's alternatives only. The cell text is the
  alternative the scenario uses; `inherited` marks one it takes from its parent. Picking one assigns it;
  choosing another while the scenario holds its own values first stores its own alternative (below),
  silently. A blank pick (Clear override, Delete) inherits again. Fill, paste and the cell menu are the
  pane's own.
- **A scenario's own alternative is a stored, first-class alternative** (Tom, 2026-10-12: *"No. It's
  a first-class alternative, and this is the primary way of creating alternatives."*). The first
  override in a category, in Basic mode or out, creates a stored alternative (a calculation set, for
  Calculation) named after the scenario as it is then, whose parent is what the scenario inherited,
  and the scenario names it (`ownWriteTarget()`, which is `promoteStored()`). The next overrides go
  into it. From then on it is an alternative like any other: renamed on its own (renaming the
  scenario does not rename it), kept when its last override is cleared, kept when its scenario is
  deleted, and written in the file under `alternatives`/`calcSets`. Clearing never creates one. **No
  message or question announces it** (Tom, 2026-10-11: *"We may not need the alert on creation of an
  alternative"*). This retires choice A for any project written since: a Basic-mode project with
  overrides now carries `alternatives`. A file from before still holds a scenario's values in its
  own maps and opens unchanged; there the scenario's own alternative is the derived item
  (`smImplicitRecords()`, `<scenario id>:<category>`) until a write in that category, or any act on it
  (Rename, a drag, Copy, Add child, another scenario picking it), stores it (`smMaterialize()`).
- **The menu row is always present**; choosing it with Basic mode ticked turns Basic mode off and says so.
  The Scenarios menu's order is Tom's (2026-10-11): Scenario manager, a rule, Basic mode, New, Rename,
  Delete, then the scenarios (Apply Base values and the rule before it were retired 2026-10-15, below).
  No separator before the scenario list (Tom, 2026-10-12: *"Not for now"*).
- **Gestures**: drag a leaf or branch onto an item to re-parent it (the row is outlined); drag between
  two items to reorder (a line); a cycle is refused. **A click selects and only selects** (Tom,
  2026-10-12: *"Single-clicking on a tree name opens it in Rename mode ... Clicking again, ostensibly
  to place the cursor, exits Rename mode."*): F2, Rename (button or right-click) renames, and a click
  inside the open name places the caret. Delete or the minus button or the context menu deletes, the
  plus button or the context menu adds a child (`Child_<n>_of_<parent>`), Enter or a double-click
  makes a scenario current (Tom, 2026-10-12: *"OK. Yes, as long as that works with all our other
  gestures."*; with no click-to-rename, nothing collides). **Delete is refused while the item is in
  use, naming who uses it.**
- **Several Bases** (H08): "Add Base" names `Base2`, `Base3`. A Base of its own is a record flagged
  `root: true` with no parent. Since 2026-10-12 it holds a copy of every value Base has when it is
  added (`baseSnapshotOf()`; Tom's calls below), so a later Base edit does not reach it. A stage-4 record with parent null and no
  flag hangs from Base.
- **Order** (Tom asked for it): `project.scenarioOrdered` is set by the first reorder and freezes the
  order then shown into the stored array; until then siblings sort by name, so a file that never
  reorders opens as it did. Every list of scenarios (the Scenarios menu and the Water menu's
  submenu, the Scenarios table, Show scenarios rows, Compare) follows the Scenario manager's tree,
  depth first, siblings in that order (Tom, 2026-10-14, below; `scenariosForDisplay()`).
- **Copy** (H05, superseded 2026-10-12, below): Basic mode only, own alternatives copied, no question.
- **Compare** solves a checked set kept in `project.compareSet`; absent means every scenario, and
  checking everything deletes the key.
- **Used by** (the market researcher): each alternative shows the number of scenarios using it (naming
  it or inheriting it) with the list in its tip, and an override written into an alternative other
  scenarios use says so in its existing note (Properties and the Settings box).
- **Decisions made by CC that Tom may overturn** (his words govern where he gave them):
  1. A Base added with Add Base is deleted like any record when nothing uses it; only each tree's built-in
     Base is never deleted, with its own sentence (`lpn_sm_base_kept`).
  2. **Base is a choice in every cell** (Tom, 2026-10-12: *"I can't select Base as the alternative."*):
     stored as `scenario.alternatives[cat] = 'base'` (`scenario.calc`, for Calculation), the Base
     item's own key, so the scenario uses the Base alternative whatever its parent uses. A blank
     pick still inherits. An override then makes the scenario's own alternative a child of Base.
  3. Picking an alternative for a scenario that holds its own values in that category (a file from
     before stored own alternatives) first stores them under its name; nothing is lost, and nothing is
     said.
  4. "Used by" counts scenarios that inherit an alternative as well as those that name it.
  5. The Scenarios tab is hidden, not removed, in Basic mode, and Ctrl+Shift+PageDown skips it.
  6. A Base of its own holds a copy of Base's values (2026-10-12); `root: true` says which row it hangs
     from. Its Parent column is blank.
  7. The override count (status strip, menu, Compare column) counts a scenario's OWN overrides only:
     its own values and those of the alternative or calculation set it names for a category, never
     that record's parents nor what it takes from its parent scenario (Task 800, below).

Code: `smTrees()` ... `smCopyScenario()`, `compareScenarios()`, `smSharedText()` in the section "THE SCENARIO
MANAGER'S MODEL"; the box and the table in "SCENARIOS > BASIC MODE, AND THE SCENARIO MANAGER". Harnesses:
`scenario-manager-harness.js` (model, headless) and `scenario-manager-browser-harness.js` (the box and the
table in Chromium). Storage: the box keeps its place on `lpn_smbox` (window furniture); `lpn_altbox` is
removed when the page opens.

### Tom's calls of 2026-10-12 (interview, after Sue's review)

His words, then what was built.

**Copy scenario (q01).**

> The fact that Bentley doesn't do this gives me pause. They certainly have experience, and I am not inclined to think I know better than they do. 
>
> Here's the case for not copying Scenarios. With basic mode off, it's trivial to create a scenario and connect it to any alternatives. So not much value is gained vs. all the rules that have to be invented and intuited/taught for copy mode.
>
> Here's the case for copying scenarios. With Basic mode on, there is no access to alternatives. So copying a scenario is helpful.
>
> Putting those together, we might see the following ideas coalescing:
> - In the event that somebody received a project from an advanced user, there may be inheritance and alternatives assignments that  Basic mode can't handle. In such a case, should we say that "This project has scenarios and alternatives relationships that are not compatible with Scenarios Basic mode, so Basic mode is disabled."
> - Copy scenario could possibly be unavailable when Basic mode is off.
> - Copy scenario should copy all overrides along, of course with the alternatives they belong to and no other alternatives. 
>
> Does that fully cover the subject?

Built: Copy scenario is a Scenarios menu row, offered in Basic mode only (greyed with Basic mode
off, and in the Scenario manager's Scenarios tree, with `lpn_scenario_copy_off`). It copies the open
scenario's own values and each stored alternative it names, as new alternatives named like the copy;
what it inherits stays inherited. The Share edits / Separate edits question is gone. A project Basic
mode cannot show turns Basic mode off when it arrives, in his words (`lpn_scenario_basic_misfit`), and
ticking Basic mode on is refused for it, in the dialog; the test is `basicModeMisfit()`: a scenario with
a parent other than Base or a Base of its own, an alternative or calculation set a scenario names that has
a parent or is a Base of its own, or one named by two scenarios. One no scenario names counts for
nothing (below, 2026-10-13).

**Renaming a scenario (q02).**

> With Basic mode on, we must rename everything at once without asking.
> With Basic mode off, we can ask, "Rename equally named alternatives?"

Built: the stored alternatives the scenario names that carry its old name (`scenarioNamesakes()`).

**Moving a scenario (q03).**

> This raises a dimension I had not previosly considered. 
> - What is a scenario? It is a window to alternatives. 
> - Does a scenario have overrides? Not to properties. But maybe it can to alternatives.
> - What does it mean to have alternatives overrides? Every alternative on a scenario is either inherited or an override. Properties come along automatically.
> - What does this have to do with moving a scenario? Behavior depends on whether its alternatives are inherited or overrides.
> - So what's the answer to the question? The answer is "strictly speaking, yes" What it **inherits** changes. But what it has overridden does not change.
> - What does this imply for our design? We must expose in our UI whether an alternative is an override vs inherited. This appears in the Scenarios table of the bottom pane. And some form of abbreviated UI for that would be nice. For example, an asterisk or some other single-character override marker (ask Mary and Ida) that you can click to remove. And it would be good to carry this abbreviated UI through Properties and Settings to minimize the real estate used by overrides exposure and interface. Autodesk has a satisfying overrides and clearing system in their Civil 3D Toolspace Settings. An "Override" column has checkboxes if the row is an override (vs. inherited). A "Child override" column has a down arrow for any row with overridden descendants, and you can click the arrow to push the present override to all children (clear their overrides); clicking it puts an x on it meaning clear all children. Or we could on click have a confirmation "Clear all child overrides? [Yes] [No]"

Built: the words only (help, `smMove()`, `setScenarioParent()`, this doc); the behaviour already was
this. The override-marker design he describes is a separate task.

**What Basic mode changes (q04).**

> I am quite sure that there is a miscommunication in "Basic mode changes no stored byte, only what is shown". Rewrite to clarify if you agree with this: "The Basic mode on/off setting changes multiple application behaviors. And with Basic mode off, a project may become too complex for Basic mode to be turned on." If we need to say more, we can say more, but I think it's better to say it in the code and the UI language than in the design record.

**Copy properties (q05).**

> Let's be clear. Alternatives are really where properties and settings overrides live. And scenarios have alternatives.
>
> Now, as I see it, until a scenario has overrides, it has neither properties nor alternatives. All it has is a name. Everything else is the same value: "inherited". And I think that we do not copy "inherited" as an explicit setting.
>
> We need to document this in our user guide "Copy properties copies only overrides."

**Add Base (q07; his choice: "Keep, with an honest tip").**

> Good catch. Let's be sure we understand the Bentley behavior.
>
> I would say that the most honest thing is to make the new base a copy like a new project with shared settings and alternatives. Keep in mind that Scenarios are only windows. So the bigger question is whether there can be copies of the Base alternatives, which would truly in effect mean multiple models in one file.

Built: a new Base is an independent copy. Add base in the Scenarios tree makes a Base scenario with
its own Base alternatives, one per category, each holding every value Base has now
(`baseSnapshotOf()`); in an alternatives tree it makes one such Base alternative. Bentley:
*"Base alternatives contain local data for all elements in your system"* (WaterGEMS, "Base and
Child Alternatives", docs.bentley.com GUID-067F08A81CE747CDBDFB93AD301E0CFD); its "Creating
Alternatives" page (GUID-630A2475...) says only how to make one, not whether it starts as a copy.
Not snapshotted: the two scenario run times.

### Tom's calls of 2026-10-13 (browser pass)

**An alternative no scenario uses.** Asked: *"Unused alternatives: should an alternative that no
scenario uses stop a project from showing in Basic mode? It doesn't now."* Tom: *"No."* Built:
`basicModeMisfit()` asks only the alternatives and calculation sets a scenario names, so one left
behind with a parent (a scenario deleted with Basic mode off keeps its alternatives) stops nothing.

**Copy properties with nothing to copy.** Tom: *"a saving grace of an alert/dialog is that users would
quickly learn that there is no point in copying properties where there are no overrides."* Built: "No
overrides to copy." is said in the dialog, as every other refusal on the page is, and kept in the
messages log. Ticking Basic mode on for a project it cannot show is refused in the dialog too.

**Deleting what holds overrides says how many go** (his "I don't see this message"). Delete scenario
with Basic mode on says so (it did, through both doors, in a harness of his steps; a likely reason he
saw none: a project with Fig 5 under Fig 4 cannot be shown in Basic mode, and ticking it on was refused
only in a line of the messages log, now a dialog). With Basic mode off the
overrides do not go: they stay in the alternative, which the question names as staying. Deleting an
alternative that holds overrides now asks, "Delete the alternative {name}? Its one override is deleted
with it."; an empty one still goes unasked.

**The override marker (Task 790).** Tom: *"Ida's dot is fine. But this doesn't resolve the UI for
indicating and clearing child overrides. The down triangle is fine, and should there be an alert,
'Clear child overrides ({n} total)?'"* Built in Properties and the Settings box (`ovmGutter()`,
`setboxMarks()`): a two-cell gutter at the row's inline start, drawn in CSS. A filled dot is an override
in the open scenario; a click clears it. In Properties a hollow dot is an inherited value; a click makes
it an override holding the value shown (the checkbox line it replaces is gone; while a value is an
override, one line under it still says what Clear restores). A down triangle says scenarios below this
one override the value, Base included; a click asks "Clear child overrides ({n} total)?" and clears
them, one undo step. Base never has a dot, so its gutter is the triangle's one cell, drawn only when a
row has one; the ID line moves with the rows. {n} counts the alternatives holding such an override, each once however many
scenarios share it; a Base of its own (Add base) is never counted. No mark is a tab stop. Not yet: the
Scenarios table's cells, which still say "inherited" in words.

### Tom's calls of 2026-10-14 (browser pass)

**Base may use any alternative, with Basic mode off.** Tom: *"Is it universal and absolute that Base
scenario must have only base alternatives? While building my scenarios and alternatives, it seems to
be a handicap that I can't temporarily set some alternative or another current so that I can create
its overrides."* His words of 2026-09-30 ("the Base scenario uses all the Base alternatives") are one
of his rules for Basic mode, so with Basic mode off Base is an ordinary root scenario, as in Bentley.
Built: Base's row in the Scenarios table picks like any row; `base.alternatives[cat]` / `base.calc`
name a stored record (`basePick()`), Base reads and writes that record for the category (an edit in
Base goes into it), and every scenario that inherits the category from Base inherits the pick. Blank
or Base gives Base its own alternative again. A Base naming any record makes the project one Basic
mode cannot show (`basicModeMisfit()` 'base'). A Base of its own (Add base) takes nothing from Base.
Where Base names nothing it writes the elements and the project, exactly as before (`inBaseFor()`,
`plainBase()`). Drawing, deleting, Morph, Restore defaults and the view stay Base's acts on the drawing
itself. **Allowed, and kept** (Task 801, Tom 2026-10-15: *"There is nothing truly circular about it. I
suppose it shouldn't be forbidden."*): Basic mode still refuses such a project, in its own words.

**The inherited ring.** *"Tanks show amber circle on map, but has overrides only in parent, not
here."* The amber ring is an override where the open scenario writes (hasOverride()'s rule); a value
it takes from a parent scenario or a parent alternative wears a thinner dashed gray ring instead, with
its own tip (`lpn_scenario_mark_inh_tip`), the map's hollow dot (Task 790).

**Scenario order** follows the Scenario manager's tree everywhere (above, Order). **The child icon**
in the manager is drawn only on an item with children; it had been drawn on every child scenario
after Civil 3D's icon per node, and a leaf now keeps its width empty. **A Base picked under Base**
blanked the Calculation select, because the blank row also read "Base"; it now reads "Base
(inherited)". **The Settings box** starts 1.9rem wider, the gutter's width, measured.

### Merge upward, and Apply Base values retired (Task 801, 2026-10-15)

Tom, on Apply Base values: *"I don't think we need this command any more now that we have the circles
and the down arrows. And this command is too confusing and dangerous."* Mary found that WaterGEMS merges
a preferred alternative up into Base and documents no push-down command. Tom: *"Allow and retire. I
agree. And I like the 'Merge into parent' command."*, then *"Maybe 'Merge upward' and it lets you choose
how many steps upward to target the merge (in case you want to skip parent)?"*, and to the proposal
below, *"Yes. Perfect."*

**Retired:** the Scenarios menu row and the per-asset button in Properties (the same action, narrowed to
one asset, with the same words), `pushBaseToScenarios()`, `pushHereButton()`, and the six
`lpn_scenario_push_*` keys in all 27 files.
`pushSpecList()` stays: the Settings push and Find and replace read it. Tom gave written permission
(2026-10-15) and the two stale `$ec_lang_syn` entries are deleted.

**Built:** "Merge upward", a command of every alternatives tree in the Scenario manager (button and
right-click row, after Copy; not in the Scenarios tree; greyed on a Base). It asks which ancestor, by
name, parent first, up to the tree's Base item, then asks again saying how many overrides move. The
selected alternative's OWN values (never what it inherits) are written into the target, the nearer
winning by the rule they resolve by (`combineHolders()`, the demand pair included), and removed from it;
it stays in the tree, empty, and inherits them. **A skipped level holding its own value for anything
merged is named in the question** (one line per asset and field, "Pipe 10: Diameter", or a setting) and
is not changed, so the source then reads that value from the skipped level. One undo step. A merge into
the Base item writes the drawing and the project as a Base edit does (`setProp()` in Base, Base's own
pick for the category set aside), so it reaches the elements even when the Base scenario uses another
alternative. Results that depended on the changed inputs go stale under the snapshot rule, as after any
scenario act (`applyScenarioChange()`).

**Decided by CC, for Tom to overturn:**
- **A Morph and a saved view merge into Base too** (Tom, 2026-10-15: *"Why can't Morph or a saved view
  be used in the Base alternative?"*; first built keeping both in the source). A type change merged into
  Base is Morph in Base: the asset is rebuilt in place (`applyNodeTypeChange()`, `applyLinkTypeChange()`,
  a valve taking the merged valve type), in the merge's one undo step, and the question carries Morph's
  own list of what is lost or read differently. A saved view becomes Base's view, which is the map as the
  reader left it in Base (the file's `view`): the map moves there, or, while the open scenario holds a
  view of its own, Base's is set for the return. A view is never an undo step, so Ctrl+Z gives the
  alternative its view back but does not move the map.
- A scenario's own values from a file before 2026-10-12 (the derived item) are stored first and then
  merged, like Copy and Rename do.
- A local value an older reader left in a scenario that names an alternative for the category is
  nearest and is not part of that alternative, so a merge of the alternative leaves it.
- Calculation sets merge the same way; into Base the multiplier and run times become the project's.

Code: `smMergeTargets()`, `smOwnContent()`, `smMergePlan()`, `smMergeUpward()` (model) and
`smActMergeUpward()` (the two questions). Harnesses: `alternative-merge-upward-harness.js` (headless) and
`alternative-merge-upward-browser-harness.js` (Chromium).

### The count is a scenario's own, and List overrides audits it (Task 800, 2026-10-15)

Tom, on his Fotobi project, scenario "1-hr drain w pump off" reading 24 overrides beside its siblings'
23: *"I don't know how to see a tidy list of overrides to audit ... that count seems inflated ... I
should see the count of only the present overrides, not the inherited overrides. I count 13 diameter
overrides, 1 text override, and 2 calculation overrides."*

**The count** is `ownOverrideItems(scn).length`: the scenario's own values, plus the values held in the
record `writeTargetFor()` names for each category (the marker's rule), never that record's parents and
never what the parent scenario supplies. A Base of its own counts nothing (a copy, not an override). The
multiplier and the two times count only where they differ from the project's own, as before. The 24
had counted inherited records: EPS Pump off's Active topology (2) and Initial settings (2, plus EPS's 2)
and EPS's run time (1). The own count is 17, not his 16: junction J-NE-S-3's Demand is an override in
"1-hr drain w pumps off" holding 1 gpm, the same as Base's, so nothing on screen shows it. His "2
calculation" are the multiplier (26) and the default pattern (P1), which is filed under Demand.

**List overrides**: a command of the Scenarios tree (button and right-click row, after Make current;
greyed with no overrides). It opens the page's dialog: the count, then one table per category and
holding alternative (Asset, Property with its unit, Override, Inherited value), the inherited value
being what the scenario reads without the override (the alternative's parent chain, else Base). An
asset's ID closes the list and goes to it on the map (`findGoTo()`). The delete questions already
counted only what is deleted, so they are unchanged.

Code: `ownOverrideItems()`, `ownOverrideInherited()` beside `overrideCount()`; `ownOverrideGroups()`,
`smActListOverrides()` in the manager's section. Harness: `override-audit-browser-harness.js`, on his
file (`fixtures/fotobi-override-audit.epp`).

### Next stage: what the advisers said (recorded, not built)

- **Declan:** store the view as centre plus scale, scale in ground metres per CSS pixel (1/96 in),
  with 1:N derived. Corners depend on the window size, so they are shown, not stored.
- **Ida and Declan:** Major and Minor headings as group rows. **Tom, 2026-10-05: *"No. Let's keep
  the table paradigm."*** Major and Minor stay columns.
- **Sue:** a scenario that switches friction method with no roughness override reads C=130 as a
  Darcy-Weisbach roughness of 130 and solves with garbage. **Tom, 2026-10-05: *"Yes. Add the glyph
  to every unreasonable value"*** (diameters, roughness by method, and so on). Built suite-wide on
  `feat/value-warning` as a pure function of (field, value, method in effect); this branch calls it
  with the scenario's resolved method when the two meet.
- **Declan:** scenarios as rows in the Settings table, matching Task 766.
- **Ida:** a held field marked by an amber edge plus "Base: {value}" and a Reset link, with no
  per-field checkbox.

## The code

`js/looped-network.js`, section "SCENARIO ALTERNATIVES": `LPN_ALT_CATEGORIES`, `categoryOf(prop,
group)`, `alternativesOf(scenario)`, `alternativeFor(scenario, category)`, `resolveThroughAlternatives(scenario, el, prop)`.
`effective()` is NOT rewired through it: it runs per property per element per render and per solve,
and in Basic mode its one override lookup already IS the one-hop chain. The harness holds the two
equal instead.

Settings in scenarios: same file, section "SETTINGS IN SCENARIOS": `LPN_SETTING_CATEGORY_OF`,
`categoryOfSetting()` (also `categoryOf(path, 'setting')`), `settingFor(scn, path)`,
`effectiveSetting(path)`, `setScenarioSetting()`, `sanitizeScenarioSettings()`; the reader
shorthands `scnSetting()`, `scnLabels()`, `scnProject()`, `scnDefaultPattern()`; the one switch
a harness blinds, `scenarioSettingsBlock()`; the view, `outwardViewOf()`, `heldView()`,
`setScenarioView()`, `followScenarioView()`; the export, `inpExportDocument()`.

The stored tree: same file, section "SCENARIO TREE": `touchTree()`, `isExplicitTree()`,
`resolvedOverrides()`, `resolvedSettingsBlock()`, `treeLayers()`, `writeTargetFor()`,
`eachOverrideMap()`, `sanitizeScenarioTree()`, and the mutations `createAlternative()`,
`renameAlternative()`, `reparentAlternative()`, `deleteAlternative()`, `mergeAlternativeInto()`,
`assignAlternative()`, `promoteImplicitAlternative()`, the same five for calculation sets, and
`setScenarioParent()`; `heldCalcOption()` is the calculation-option seam. Harness:
`dev/lpn-spike/scenario-tree-harness.js` (seeded; `node ... <seed>` reproduces one).
Harness: `dev/lpn-spike/scenario-settings-routing-harness.js`.

The Settings table: same file, section "THE SETTINGS TABLE" (`settingTableRows()`,
`settingTableCols()`, `settingRowValue()`, `settingRowWrite()`, `settingRowIsLocal()`,
`settingRowClear()`, `openSettingsTableAt()`); the spec is the last of `buildPaneTables()`.
The held mark in the Settings box: `setboxTag()`, `labelRowPaths()`, `markHeldSetboxRows()`,
`clearHeldSetboxRows()`, beside `wireSetboxScenarioSeam()`; the view's rows, `settingsViewRows()`,
`refreshSetboxViewRows()`, `holdScenarioView()`, `releaseScenarioView()`.

Basic mode and the manager: same file, section "SCENARIOS > BASIC MODE, AND THE SCENARIO MANAGER"
(`setScenarioBasicMode()`, `rebuildScenarioManager()`); the box is `#lpn_sm_box` in `Looped-Network.php`
(see Stage 6). `lpn_scnbasic` is registered in `lpn_furniture_check.php`,
`dev/cookie-storage-inventory.md` and Erase everything.
Harness: `dev/lpn-spike/scenario-alternatives-harness.js`.
