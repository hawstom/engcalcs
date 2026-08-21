# Unit families (Task 162, phase 1)

**Status: BUILT 2026-07-28.** Design reviewed and settled with Tom the same day; Hazen-Williams
below is the worked example the design was argued on, and the mechanism now ships across all 13
calculator pages that have unit selects. The one thing still open is **realistic default numbers on
the 12 pages other than HW** — see "What is still open" at the end.

---

## The mechanism in one line

`'units' => Array('m','mm','ft','in')` becomes `'units' => 'distance_small'` — a **named family**
defined once in `lib/Units.lib.php`, carrying both the option list and the identity that presets key
on. Presets become `family → unit` maps instead of flat unit lists.

Several families may share the same option list. That is the whole point, and it is what plain
array-splitting cannot do. Two cases in HW alone:

- `distance_small` and `distance_large` offer the identical four units (m, mm, ft, in), yet US sends
  one to inches and the other to feet.
- `partial_head` and `total_head` overlap on ft H₂O, so a flat preset naming both `fth2o` and `psi`
  is ambiguous for `partial_head` — whichever appears later in the list wins, which is precisely
  today's `inH₂O`-overwrites-`psi` bug.

## A field may be a RATE PER its unit, and then the conversion is the reciprocal

Canal Seepage prices water per unit volume and lining per unit area, and marks both in
`Canal-Seepage.php` with `'separator' => '/'` — the `$` … `/` … `[ft3]` reading of the control.
The unit select still names the family (`volume`, `land_area`); what differs is the direction:
`EngCalcs.readFormInput()` DIVIDES by the factor, which is right for a quantity of that unit, while
a price PER that unit MULTIPLIES — a cubic metre of water costs 35.3147 times what a cubic foot
costs. Reading a rate with the quantity helper is wrong by the factor SQUARED and is invisible
under SI, where every factor is 1; that shipped on this page until Task 473.

`EngCalcs.readFormInputPerUnit()` is the one helper for this, added beside `readFormInput()` rather
than as a flag on it, so no existing caller could change behaviour. **`'separator' => '/'` is the
marker to look for**, and as of Task 473 Canal Seepage is the only page in the suite that carries
it.

---

## Why the preset buttons are wrong today (the two defects, for reference)

1. `EngCalcs.setUnits` walks the preset list in order and sets `option.selected = true` on **every**
   option whose text matches, so later entries silently overwrite earlier ones. The `in` set is
   `[in, ft/s, gpm, in², psi, inH₂O, ft³, kW]` — `psi` is selected first, then **`inH₂O` overwrites
   it** on every head field. A waterline or fire-sprinkler engineer clicking "in" gets head loss in
   inches of water, which nobody quotes.
2. The `in` preset maps every length field to inches, including pipe length. A 1,000 ft main renders
   as 12,000 in.

Both come from the same root: one unit per quantity, matched by **translated label text**, across all
selects at once.

- **Named families fix defect 2** — the page says which of `distance_small` / `distance_large` a
  field belongs to, so diameter and pipe length stop sharing a fate.
- **Per-family lookup fixes defect 1** — a select is assigned the one unit its family names, so
  nothing can overwrite anything.
- **Matching on the option's own value — the unit's name — rather than on label text** removes a
  third hazard that is not yet a live bug: today a translator editing `u_psi` silently breaks the
  preset buttons in that language, with nothing to catch it. (Task 162 did this with a `data-unit`
  attribute; Task 390 made the value itself the name, so the attribute was removed.)

---

## Hazen-Williams — every field

This is the worked example. The same treatment was applied to all 13 pages; read any page's
`'units' => '<family>'` declarations for its assignments.

`c` (Hazen-Williams C) and `km` (minor loss coefficient) are dimensionless, have no unit select, and
are not in this table. `vel_check` is a verdict string, likewise.

### Inputs

| Field | Label | Family | US | SI |
|---|---|---|---|---|
| `q` | Flow | `flow` | `gpm` | `lps` |
| `d` | Pipe diameter | `distance_small` | `in` | `mm` |
| `l` | Pipe length | `distance_large` | `ft` | `m` |
| `egl1` | Upstream EGL | `total_head` | `fth2o` | `mh2o` |

### Results

| Field | Label | Family | US | SI |
|---|---|---|---|---|
| `a` | Flow area | `flow_area` | `ft2` | `m2` |
| `pw` | Wetted perimeter | `distance_small` | `in` | `mm` |
| `rh` | Hydraulic radius | `distance_small` | `in` | `mm` |
| `v` | Velocity | `velocity` | `ftps` | `mps` |
| `hv` | Velocity head | `partial_head` | `psi` | `mh2o` |
| `sf` | Friction slope | `slope` | `grade` | `grade` |
| `tau` | Shear stress | `stress` | `psf` | `npm2` |
| `hf` | Friction loss | `partial_head` | `psi` | `mh2o` |
| `hm` | Minor (local) loss | `partial_head` | `psi` | `mh2o` |
| `hl` | Total loss | `partial_head` | `psi` | `mh2o` |
| `hgl1` | Upstream HGL | `total_head` | `fth2o` | `mh2o` |
| `egl2` | Downstream EGL | `total_head` | `fth2o` | `mh2o` |
| `hgl2` | Downstream HGL | `total_head` | `fth2o` | `mh2o` |

### The families this implies, with their option lists

| Family | Options offered | US | SI |
|---|---|---|---|
| `flow` | m³/s, L/s, ML/d, ft³/s, gpm, MGD | `gpm` | `lps` |
| `distance_small` | m, mm, ft, in | `in` | `mm` |
| `distance_large` | m, mm, ft, in | `ft` | `m` |
| `flow_area` | m², mm², ft², in² | `ft2` | `m2` |
| `velocity` | m/s, ft/s | `ftps` | `mps` |
| `total_head` | mH₂O, mmH₂O, ftH₂O, inH₂O | `fth2o` | `mh2o` |
| `partial_head` | mH₂O, mmH₂O, kPa, bar, kgf/cm², ftH₂O, inH₂O, psi | `psi` | `mh2o` |
| `slope` | grade, % | `grade` | `grade` |
| `stress` | N/m², psf | `psf` | `npm2` |

**`distance_small` and `distance_large` deliberately offer the same four units.** Restricting them
to (mm, in) and (m, ft) was only ever needed to make plain array-splitting work; once families are
named they are already distinguishable, so restricting membership would remove real choices for
nothing — a US engineer sizing a 36" culvert may still want to type `3 ft`. This is the opposite of
what was done to `total_head`, and the difference matters: **dropping psi from `total_head` was a
semantic fix** (an EGL is an elevation; psi there is close to meaningless and should never have been
offered), whereas restricting distance would have been a mechanical workaround the design no longer
needs.

### Why two families may share one option list (Tom's question, 2026-07-28)

*"Where family lists are identical, is the purpose of the families to signal defaults? Or are the
families better merged?"*

**Signalling defaults is the whole purpose there, and merging would undo the fix.** A family carries
two things: the option list (what a user may pick) and the identity a preset keys on (what gets
picked *for* them). For most quantities those coincide and one family is one of each. Distance is the
case where they come apart: `d` and `l` may be set to the same four units by hand, but US practice
wants inches for one and feet for the other. Merging them back into a single `distance` family is
precisely defect 2 — the 1,000 ft main rendering as 12,000 in — because a merged family can only
name one default.

The cost of not merging is that one option list gets written twice. That is worth nothing more than
a shared PHP variable:

```php
$distance = Array('m','mm','ft','in');
$ec_unit_families['distance_small'] = $distance;
$ec_unit_families['distance_large'] = $distance;
```

**No third layer.** An earlier sketch had `lists → families → presets`, so families could reference a
named list. With only one list currently shared by two families, that layer buys nothing a plain
variable does not, and each added layer is another thing to explain. Two layers — families define
options, presets map family → unit — is the whole design.

The general rule this gives: **split a family when two fields want different defaults, not when they
want different options.** Different options usually follow (a diameter list and a length list may
diverge later), but the default is the reason.

**Which family a field names is a per-page choice, not a global property of the field.** HW's `d` is
`distance_small`; Manning-Trap's `b` is `distance_large`. Same concept, different page, different
default — with no override mechanism, because the page already chooses. This also answers the SI-flow
tension raised in review: a page wanting L/s simply names a different flow family.

---

## Resolved (Tom, 2026-07-28) — kept for the record

1. **`hf`/`hm`/`hl` in psi, `egl`/`hgl` in ft H₂O — confirmed.** This is the split plain
   array-splitting could not express, and it is wanted: an AWWA or NFPA 13 engineer quotes *friction
   loss* in psi (NFPA 13 mandates Hazen-Williams by name), while an EGL/HGL is an elevation.
2. **`hv` stays in `partial_head`; there is no `velocity_head` family.** An intermediate draft split
   it out, on a review note saying US practice always expects feet for velocity head; Tom retracted
   that note ("my mistake") and confirmed `partial_head` keeps all eight head and pressure units.
   **So under US, velocity head displays in psi** along with the losses — which is arguably the
   better outcome anyway: `hf`, `hm`, `hl` and `hv` are components that get summed, and summing
   terms shown in mixed units is worse than an unusual unit consistently applied.
3. **Distance splits into `distance_small` / `distance_large`, chosen per page** — see the note under
   the family table. Pipes name `_small`, channels name `_large`.
4. **Flow area is ft² / m².**
5. **SI flow is L/s.**
6. **Default numbers for HW: 6" main, 400 gpm, 1,000 ft, C = 130** (replacing q = 1 m³/s through a
   1 m pipe — 15,850 gpm through a 39" main, a city transmission line).

---

## Decided

**The default preset is chosen by language** (Tom, 2026-07-28; ROADMAP Task 165). English gets US
customary, every other language gets SI — `EC_DEFAULT_UNIT_SET` in `lib/Units.lib.php`.

An earlier draft of this document said simply "US is the initial default", which was taken from an
HW-framed discussion and applied to all 13 pages without that generalisation being flagged. Tom
caught it from behaviour: *"I don't see that mpf defaults to SI when es is the language."* The
measured reach (en 83%, es 10%, ≤1% tail) is what makes language the right axis: a single global
default had to be wrong for one of the two groups.

This also resolves the Task 144 caution about a metric Latin American segment in Hazen-Williams'
traffic — a Spanish-speaking visitor now lands on SI without any query export being needed.

**Known limitation:** "English" is not "United States". A UK, Australian, Indian or Nigerian visitor
reads English and works in SI, and lands on US units. See the comment on `EC_DEFAULT_UNIT_SET` for
why the region subtag was not used.

**Buttons: two, labelled "US" and "SI", no tips.** Four Large/Small buttons are unnecessary — the
size axis is handled by which family each page names, not by the preset.

**The relabel ships *with* phase 1, not after it.** Phase 1 makes the existing labels lie worse than
they do today: right now "in" sets nearly everything to inches (clumsy but roughly truthful), whereas
after phase 1 it would set diameter to inches, length to feet and loss to psi while still saying
"in". So two new keys — `calc_units_us` and `calc_units_si` — are added in phase 1 with English
values "US" and "SI" seeded into all 27 files as the standing fallback practice allows, and the next
sprint translates them. Delta cost: 2 keys × 26 languages. "SI" is an international abbreviation, so
the untranslated window costs almost nothing — and far less than a button that lies.

---

## What phase 1 touches, if the table above is right

- `lib/Units.lib.php` — define `$ec_unit_families` (the named option lists) and rewrite
  `$ec_unit_sets` as `family → unit` maps.
- `lib/Calculators.lib.php` — `echoUnitSelect()` accepts a family name as well as an inline array
  (so pages migrate one at a time, not in a flag-day change) and emits `data-family` on the
  `<select>`.
- `js/Calculators.lib.js` — `setUnits()` looks up the family and selects by the option's value —
  the unit's name — instead of matching translated label text.
- The 15 calculator pages — replace inline unit arrays with family names.

**Returning users are unaffected.** The cookie stores each select's option *value* — since Task 390
the unit's name — not its index or label, so none of this disturbs saved settings. Only first-time visitors
see a change — which is exactly the population Task 144 is about.

---

## As built

**27 families**, defined in `lib/Units.lib.php` with two presets (`us`, `si`) that map every family
to a unit. Beyond the ten HW needs, the rest exist because a page offered a different option list or
wanted a different default: `distance_site` (canal/penstock length, gross head — the existing `[m,
ft]` selects), `flow_canal`, `flow_turbine`, `flow_emitter`, `flow_supply`, `flow_node`,
`flow_total`, `land_area`, `volume`, `unit_discharge`, `application_rate`, `power`, `energy`,
`fraction` and `percentage`.

**Flow splits by what the calculator is for**, because US practice does: waterlines are quoted in
gpm (`flow_pipe` → Hazen-Williams, Darcy-Weisbach), storm drains, culverts, channels and structures
in cfs (`flow_channel` → Manning Pipe Flow, Manning Pipe Head Loss, Manning Trap, Manning Irregular,
Orifice, Orifice Drain Time). That assignment follows Tom's domain model recorded in Task 144:
`mphl_` is a storm drain and culvert calculator, `hw_` is a waterline calculator.

### Verification performed

- **174 field declarations migrated**, matching the inventory count exactly; **zero** inline unit
  arrays remain anywhere in the app.
- **Option lists compared field-by-field against git HEAD: 154 unchanged, 20 changed, and all 20 are
  intended** — 12 `total_head` fields dropping the four pressure units (Tom's call), 6 fields whose
  list was written `[mm, m, in, ft]` normalised to `[m, mm, ft, in]`, and 2 written
  `[depthPercent, depthFrac]` normalised to `[depthFrac, depthPercent]`. Order is now cosmetic
  because the default is stated explicitly rather than inferred from first position.
- **Every rendered select on all 13 pages carries a family and a marked default** (0 selects with an
  empty family), and **both presets assign exactly one unit to every select on every page** — the
  structural proof that the overwrite defect cannot recur.
- **Hazen-Williams recomputed numerically** with the new defaults: 400 gpm through 6 in over 1,000 ft
  at C = 130 gives v = 4.54 ft/s (inside the 0.6–3.0 m/s check band, so the page opens on a passing
  design) and h_f = 13.59 ft H₂O ≈ 5.9 psi. Cross-checked against the independent US-customary
  Hazen-Williams form, which gives 13.82 ft — a 1.7% difference, consistent with the two published
  coefficient roundings.

### Two things found and fixed along the way

1. **32 unit selects in the repeating-row tables** (Manning Irregular's points, Branched Network's
   nodes, Irrigation Pressure's laterals) call `echoUnitSelect()` directly rather than going through
   `$arrayInputs`/`$arrayResults`. They were initially left on the backward-compatible path, which
   meant they rendered fine but **ignored the preset buttons** — clicking "US" would have left every
   table column in metric. Migrated.
2. **A stored cookie can outlive an option list.** `EngCalcs.cookieToForm` restores each select by
   assigning the saved conversion factor; when that unit no longer exists (a returning user who had
   an EGL in psi, now removed from `total_head`), `selectedIndex` goes to −1 and every calculation on
   the page silently breaks. `js/Cookies.lib.js` now falls back to the server-rendered default. This
   guard is worth keeping regardless of Task 162 — any future list change would have hit it.

### Default values were converted, not just relabelled

The `default` number in a page is expressed **in whatever unit is displayed**. Switching the initial
preset to US therefore changes what every default *means*, and leaving the numbers alone would have
opened Hazen-Williams at 1 gpm through a 1-inch pipe. All **49** affected defaults were converted so
each field's *physical* value is unchanged, then rounded to 3 significant figures.

That is faithful but not pretty: Manning Pipe Flow now opens at d₀ = 39.4 in, Manning Trap at
b = 3.28 ft, Orifice at HWE = 335 ft. Those are exactly the values those pages have always shown,
now expressed in feet and inches.

## Defaults, second pass — realistic design cases (2026-07-28)

The faithful conversions described above were replaced with **deliberately chosen design cases**, at
Tom's request. Two mechanism changes were needed first.

**1. Defaults are declared per preset.** A default is expressed in the *displayed* unit, so a single
number cannot serve both presets — under SI, Hazen-Williams' `6` would be read as 6 mm. Declarations
now take either form:

```php
'default' => '0.013'                              // dimensionless, or the same in both
'default' => Array('us' => '6', 'si' => '150')    // one round number per preset
```

`ecDefaultValue()` resolves it. **This decouples the numbers from the choice of default preset** —
flipping `EC_DEFAULT_UNIT_SET` no longer invalidates any of this work.

**2. A `roughness` family, separate from `distance_small`.** US practice quotes absolute roughness ε
in **feet** (0.0005 ft for commercial steel), not inches. Same option list as distance, different
default — the splitting rule doing exactly its job.

### The design cases

| Page | US | SI | Opens on |
|---|---|---|---|
| Manning Pipe Flow | 18 in, n 0.013, S 0.005, half full | 450 mm | v = 4.2 ft/s, Q = 3.7 cfs |
| Manning Trap | b 4 ft, y 2 ft, 2:1, n 0.025, S 0.001 | 1.2 m, 0.6 m | v = 2.17 ft/s, Q = 34.6 cfs, Fr 0.33 |
| Hazen-Williams | 400 gpm, 6 in, 1,000 ft, C 130 | 25 L/s, 150 mm, 300 m | v = 4.54 ft/s, h_L = 6.2 psi |
| Manning Pipe Head Loss | 10 cfs, 24 in, 200 ft, n 0.013 | 0.3 m³/s, 600 mm, 60 m | v = 3.2 ft/s |
| Darcy-Weisbach | 400 gpm, 6 in, 1,000 ft, ε 0.0005 ft | 25 L/s, 150 mm, 300 m, 0.15 mm | v = 4.54 ft/s, Re 2.1e5 |
| Orifice | 18 × 24 in, HWE 105 ft | 450 × 600 mm, 32 m | Q = 15.6 cfs |
| Orifice Drain Time | 1-acre-ish pond, 6 × 12 in orifice | 4,000 m² | 39.6 h drawdown |
| Micro-Hydro | 500 gpm, 160 ft gross, 6 in, 600 ft | 30 L/s, 50 m, 150 mm, 200 m | 10.5 kW |
| Canal Seepage | 20 → 18 cfs over 5,000 ft | 0.6 → 0.54 m³/s, 1,500 m | E_c = 90% |
| Rock Chute | q 5 cfs/ft, S 0.2 | 0.5 m²/s | D50 = 7.9 in |
| Irrigation Pressure | 30 psi, 1 gph emitters, 3/4 in lateral | 20 m, 4 L/h, 20 mm | — |
| Branched Network | source 330 ft, 60 psi, 4 in main | 100 m, 40 m, 100 mm | — |

**Every velocity check passes on arrival, in both presets** — verified by running each page's real
`pageCalculator` against its own rendered defaults through a stub DOM.

### Three defects this pass exposed

1. **Orifice Drain Time has always opened on an invalid case.** Its guard requires the ending water
   level to stay above the orifice *top* (`h2 >= d/2`), but the page shipped `h2_elev = 0` with the
   orifice centroid also at 0 — so the guard failed and the page rendered **zeros and a NaN** on
   arrival. That is a plausible reason its used-of-human sits at 0%. Ending level is now 0.5 ft /
   0.15 m and the page opens on a 39.6-hour drawdown. **This bug predates Task 162.**
2. **`rc_crest_radius` was in `distance_small`**, rendering an 8 m crest radius as **317 inches**.
   Moved to `distance_medium` (26.4 ft).
3. **The JS-seeded sample rows on Branched Network and Irrigation Pressure were hard-coded metric.**
   Read under the US preset, Branched Network's sample became a **100-inch pipe**. Both now carry one
   seed set per preset, selected via `EngCalcs.defaultUnitSet`.

Two judgment calls worth revisiting if you disagree: Manning Trap's side slopes went 4:1 → **2:1**
(typical for an earthen canal) and its n went 0.03 → **0.025** (clean earthen channel — at 0.03 the
page opened with a *failing* velocity check); Manning Pipe Flow and Manning Pipe Head Loss went
n = 0.01 → **0.013** (concrete pipe, matching their storm-drain audience).

## Follow-up pass (Tom's review, 2026-07-28)

**Manning Pipe Flow's cross-section is now internally consistent.** Tom asked whether top width `T`
should follow `Pw` and `R`; it should, and the page was worse than the question implied — `d0`, `Pw`
and `R` were in `distance_small` while `y` and `T` were in `distance_medium`, so an 18 in pipe
reported `Pw` = 28.27 in next to `T` = 1.5 ft. `y` and `T` moved to `distance_small`. The whole
cross-section now reads 18 in / y 9 in / T 18 in / Pw 28.27 in / R 4.5 in, and 450 / 225 / 450 /
706.9 / 112.5 mm under SI. Both are results, so no default changed. **Manning Trap was already
consistent** (everything `distance_medium`, correct for a channel measured in feet).

**The Set units row was regrouped** to `[Default values]  Set units: [US] [SI]`. Grouped the old
way — `Set units: [US][SI][Default values]` — the label read as introducing all three buttons, making
Defaults look like a third unit choice. Tom's suggestion; it decouples the two controls without a
separator or a new string.

**`hv` (velocity head) now reads in feet everywhere** (Tom, 2026-07-28): *"psi is not an appropriate
default for hv. Use ft. hv is partial head, but partial head includes all head/pressure units."*
Exactly right, and the system already supported it — a **`velocity_head`** family shares
`partial_head`'s full eight-unit option list and differs only in its default (`fth2o` / `mh2o`). This
is `distance_small` vs `distance_large` again: **split on the default, not the options.** All seven
`hv` instances moved to it — Hazen-Williams, Darcy-Weisbach, Manning Pipe Head Loss, Manning Pipe
Flow (were psi), Manning Trap, Manning Irregular's `hv617`, Irrigation Pressure (were plain
distance). Losses `h_f`/`h_m`/`h_L` stay psi under US. Numerically safe: `mh2o` and `m` share a
conversion factor, as do `fth2o` and `ft`, so the two pages that moved from distance units display
identical values.

*(An earlier draft of this document split `velocity_head` out for the same reason, then withdrew it
when Tom retracted the "US expects ft for velocity head" note. The split is back, arrived at from the
other direction — seeing psi actually rendered on the page. Recorded so the reversal is not read as
drift.)*

**"Restore defaults" replaced "Default values"** on the button — Tom's preference, and it describes
what the control does. It changes `calc_defaults`, already translated in all 27 files, so
`detect_english_drift.php` now reports it as CHANGED and the 26 translations are soft-stale (they
still say the noun form). Pending, with the two button labels, in the next sprint.

**The button already resets units, not just numbers** — confirmed rather than changed.
`resetToDefaults()` expires only the page's own form cookie (not `ec_language`) and reloads, so PHP
re-renders with the language's default preset selected and nothing overrides it. Tom's concern that
*"Default values makes no sense unless it also sets default units"* is satisfied by the existing
mechanism.

## What is still open

**Entered values are reinterpreted, not converted, when units change** — long-standing behaviour,
reviewed and deliberately kept (Tom, 2026-07-28). Typing 1 and switching m → ft gives 1 ft, not
0.305 ft. Conversion was considered and rejected as more confusing, not less. **Do not "fix" this.**

**Darcy-Weisbach and Hazen-Williams now share the upstream-first form** (Tasks 167/168): Upstream
elevation + Upstream pressure + Downstream elevation in, Downstream pressure out, with a
negative-pressure check that is only possible because elevation and pressure are separate fields.
Manning Pipe Head Loss keeps the downstream-first form on purpose — storm drain and culvert design
runs from a known tailwater upstream.

**Translation of the two new button labels.** `calc_units_us` = "US" and `calc_units_si` = "SI" are
seeded as English in all 27 files and add 52 to the payload delta. They ride the next sprint.
