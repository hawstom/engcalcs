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
| Active topology (`topology`) | Active Topology | node `active`, link `active` | Task 753 ("Activation") is Tom's call on the words; the id here is neutral. Drawing inside a scenario (`bornInScenario()`) writes `active: true` there, so it creates that scenario's topology child alternative, exactly as Bentley's own "element added in a child topology" does. |
| Initial settings (`initial`) | Initial Settings | link `status`, valve `setting`, tank `level` | **CITED** for pipe status: *"a pipe can start in an open or closed position and a pump can start in an on or off condition"*, <https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/31010.html>. Tank level and valve setting: Bentley's SCADAConnect page lists *"initial conditions with regard to such properties as tank water levels, pump status and settings and valve status"*, <https://docs.bentley.com/LiveContent/web/Bentley%20WaterCAD%20CONNECT%20Edition%20Help-v1/en/GUID-E8008FFA-6E0C-4A98-AAF6-C6CC742D5A71.html>, which does not name the alternative; placing them in Initial Settings is SPECULATION on that reading. |
| Constituent (`constituent`) | Water Quality: Constituent | node `initQuality`, `sourceType`, `sourceQuality`, `sourcePattern`; tank `tankCoeff`; pipe `bulkCoeff`, `wallCoeff` | Bentley splits water quality into Age, Constituent and Trace; everything we let a scenario vary is a chemical's. |
| Fire flow (`fireflow`) | Fire Flow | junction `fireFlow` | The required fire flow per junction (Task 530). |
| Energy cost (`energy`) | Energy Cost | pump `energyPrice`, `energyPattern` | |
| User data (`userdata`) | User Data Extensions | every custom property (`custom_*`, Task 636) | Bentley lets a user field be placed in an alternative; ours are all overridable, so they are one category. Also the home of any stray property name an old file carries that no category claims, so "exactly one" holds for every key a file can contain. |
| Text (`text`) | none | Text label `text`, `active` | **Ours only.** Bentley keeps annotation in the `.wtg`, outside the model (`dev/bentley-interop.md`). A label's `active` is not topology: it takes nothing out of the solve. |

**Not an alternative: the demand multiplier.** `scenario.demandMultiplier` is a per-scenario
number, not an element property. Its Bentley counterpart is a **Calculation Option** (a scenario
names one set of calculation options beside its alternatives), so it stays on the scenario and
creates no alternative.

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
it.** No editing, no Bentley import or export, no Google Sheets: the Advanced UX is not designed.

## The code

`js/looped-network.js`, section "SCENARIO ALTERNATIVES": `LPN_ALT_CATEGORIES`, `categoryOf(prop,
group)`, `alternativesOf(scenario)`, `alternativeFor(scenario, category)`, `resolveThroughAlternatives(scenario, el, prop)`.
`effective()` is NOT rewired through it: it runs per property per element per render and per solve,
and in Basic mode its one override lookup already IS the one-hop chain. The harness holds the two
equal instead.
