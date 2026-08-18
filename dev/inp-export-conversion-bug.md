> **CLOSED 2026-08-18.** Recommendations (a) and (b) are done: 74 token bags backfilled into
> Net1/Net2/Net3 by `dev/scripts/backfill_example_tokens.js`, and a pump's curve NAME now survives
> the importer and `docFromInp()`. Both legs of the round trip are **1,225 of 1,225 tokens
> byte-identical**, and `dev/lpn-spike/inp-roundtrip-net3-harness.js` runs with `EXPECT_CLEAN` on.
> (c) was dropped as recommended. What is left is Elm Street, whose source `.inp` is not in the repo,
> and the secondary `lpn_u_roughness` finding below, which wants its own task.
>
> Everything below is the original diagnosis, kept because the MEASUREMENT is the valuable part.

# Task 430 — why a Net3 round trip is "very close, not identical"

Diagnosis only; nothing here is fixed yet. Reproduce with
`node dev/lpn-spike/inp-roundtrip-net3-harness.js` (KNOWN FAILING by design, exits 0).

## The headline: nothing about Net3 is converted, and that is measured

**Zero values change on a Net3 round trip. No factor is applied to any quantity.** All five
converters the writer builds are in their pass-through state, `differences` contains no
`unit-converted`, and every number in the exported file `parseFloat`s to the number EPA's Net3.inp
states — 1,225 tokens compared, 1,225 with the same value.

What is NOT identical is **32 tokens' TEXT** plus **2 renamed pump-curve ids**. The pass-through
that failed is the *token* pass-through, not the *factor* pass-through, and it failed for a reason
that has nothing to do with units: **the Net3 the gallery ships was generated before the file's own
text was kept, so it carries no `tok` bags at all.**

    examples/Net3-lpn.json   elements carrying the file's text:   0 of 216
    reference/Net3.inp imported with today's reader:             27 of 216

`EngCalcs.lpnNumText()` (js/lpn-inp.js:164) hands back the file's characters only when the element
has a token for that field; with no token it falls back to `String(value)`, and `String(220)` is
`"220"` where the file said `"220.0"`.

## 1. Which of the seven project selectors did not match the file's unit

**None of them.** The writer compares FACTORS, not names, and every comparison is equal for
`examples/Net3-lpn.json` (whose `units` block is the standard EPANET US set, and which
`applySaved()` restores before anything renders):

| converter | project selector | project unit (factor) | file unit (factor) | result |
|---|---|---|---|---|
| `cLen` | `lpn_u_length` | `ft` (3.280839895013123) | `ft` (3.280839895013123) | pass-through |
| `cDia` | `lpn_u_diameter` | `in` (39.37007874015748) | `in` (39.37007874015748) | pass-through |
| `cHead` | `lpn_u_elevhead` | `fth2o` (3.280839895013123) | `ft` (3.280839895013123) | pass-through — different NAME, same factor, which is exactly the case the factor comparison exists for |
| `cPress` | `lpn_u_pressure` | `psi` (1.4223343307119563) | `psi` (1.4223343307119563) | pass-through |
| `cFlow` | `lpn_u_flow` | `gpm` (15850.323141488905) | `gpm` via `FLOW_KEYWORD_UNIT.GPM` | pass-through |
| — | `lpn_u_velocity`, `lpn_u_gradient` | results only | an `.inp` states neither | never compared |
| — | `lpn_u_roughness` | see below | — | **never compared, and never even saved** |

Checked exhaustively rather than for Net3 alone: for all ten `[OPTIONS] Units` keywords,
`inpUnitSelections()` produces selector units whose factors equal `FILE_UNITS[system]`'s, in both
systems. There is no keyword for which an import leaves a selector mismatched. The same is true of
the `us` and `si` presets in `lib/Units.lib.php` — both map every lpn_ family onto EPANET's own
pair of unit systems. And no shipped gallery example reports a `unit-converted` difference.

So the "one mismatched selector converts a whole quantity" hypothesis in the ROADMAP block is
disproven for this case. It remains the correct description of two states a user CAN reach, and
both are deliberate and reported:

- a **mixed** project (the user changed one selector through Task 422's Reinterpret/Convert dialog —
  e.g. metres of head beside gallons per minute). `inp-export-harness.js` section 4 asserts this.
- a flow unit EPANET has no keyword for (`m3ps`, `lph`, `gph`), reported as `flow-units-not-epanet`.

## 2. Where the pass-through test is made, and why it did not fire

The writer is **`EngCalcs.lpnExportInp()` in `js/lpn-inp.js`** (line 917), not in
`js/looped-network.js` — `js/looped-network.js:7154 exportInpFile()` only calls it, and
`netToInp()` in `js/lpn-net.js` is the `.net` → `.inp` READER's text stage, not the export writer.

The factor test — the one Task 430 names, and the one that **passed**:

```
js/lpn-inp.js
954  function converter(projUnit, fileUnit, what) {
955      var table = EngCalcs.unitFactors || {},
956          fp = ... table[projUnit] ...,
957          ff = ... table[fileUnit] ...;
958      if (!projUnit || fp === undefined) { ...refuse... }
962      if (ff === undefined || fp === ff) { return { same: true, mul: 1 }; }   <-- taken, 5 of 5
963      diff('unit-converted', [], what + ': ' + projUnit + ' -> ' + fileUnit);
964      return { same: false, mul: ff / fp };
965  }
966  var cLen  = converter(units.lpn_u_length,   fileU.len,  'length'),
967      cDia  = converter(units.lpn_u_diameter, fileU.dia,  'diameter'),
968      cHead = converter(units.lpn_u_elevhead, fileU.head, 'elevation'),
969      cPress= converter(units.lpn_u_pressure, fileU.press,'pressure'),
970      cFlow = converter(units.lpn_u_flow, FLOW_KEYWORD_UNIT[flowKey], 'flow');
```

The token test — the one that **failed**, one line lower down the same call:

```
js/lpn-inp.js
977  function n(c, rec, key, value) {
978      var v = (typeof value === 'number' && isFinite(value)) ? value : 0;
979      if (c.same) { return EngCalcs.lpnNumText(rec, key, v); }   <-- taken; rec.tok is absent
980      return String(v * c.mul);
981  }

164  EngCalcs.lpnNumText = function (rec, key, value) {
165      var t = rec && rec.tok ? rec.tok[key] : undefined;         <-- undefined for every gallery element
166      if (typeof t === 'string' && parseFloat(t) === value) { return t; }
167      return String(value);                                      <-- "220.0" becomes "220"
168  };
```

`c.same` was true for all five quantities, so line 979 ran for every number. It then found no token,
because `examples/Net3-lpn.json` — a byte copy of `dev/water-network-examples/Net3-lpn.json`, made
by `dev/scripts/generate_examples.php` — was authored by an import that predates Task 390 step 3.
The document has no `tok` anywhere. Nothing in the writer can recover text the document never held.

**`serializeProject()` does preserve `tok`** (verified), so this is purely a stale-artifact problem:
the shipped example files, not the code. Every gallery example has the same gap:

    Basic-example-SI  0/15   Basic-example-US  0/15   Elm-Street-Center  0/37
    Net1              0/24   Net2              0/76   Net3              0/216

## 3. Recommended fix

**Do not touch `converter()`. It is correct and it did its job.** Three edits, in priority order.

### (a) Give the shipped examples their tokens back — closes 32 of the 34

Merge the token bags in by id rather than re-authoring the examples, so nothing else about them
moves (their view, labels, backdrop, project name and description are hand-tuned). A one-shot
script under `dev/scripts/`, run once, its output committed:

```js
// dev/scripts/backfill_example_tokens.js  (sketch)
const parsed = EngCalcs.lpnInpParse(fs.readFileSync('dev/lpn-spike/reference/Net3.inp', 'utf8'));
L.applyUnitSelections(L.inpUnitSelections(parsed));
const fresh = L.docFromInp(parsed, 'Net3.inp');
const tok = {};
fresh.nodes.concat(fresh.links).forEach((e) => { if (e.tok) { tok[e.type + '|' + e.id] = e.tok; } });

const ex = JSON.parse(fs.readFileSync('dev/water-network-examples/Net3-lpn.json', 'utf8'));
ex.nodes.concat(ex.links).forEach((e) => { const t = tok[e.type + '|' + e.id]; if (t) { e.tok = t; } });
fs.writeFileSync('dev/water-network-examples/Net3-lpn.json', JSON.stringify(ex, null, 1));
// then: php dev/scripts/generate_examples.php
```

Measured on the real files: 27 bags merge into Net3 and the round trip drops from 34 differences to
2 (the curve ids below). `carryInpTokens()`'s own rule makes the merge safe — a token is kept only
while `parseFloat(token) === value`, so a bag that did not match the example's number would simply
never be written back out. Net1, Net2 and Elm Street want the same treatment; the two Basic examples
have no `.inp` behind them and correctly have no tokens.

**Guard it:** flip `EXPECT_CLEAN` to `true` in `dev/lpn-spike/inp-roundtrip-net3-harness.js` in the
same commit, and the gallery can never silently lose its tokens again.

### (b) Carry a pump's curve id — closes the last 2

The importer keeps the curve's POINTS on the pump and drops its NAME, so the writer invents one
(`'C_' + lk.id` in `js/lpn-inp.js`), and Net3's curves `1` and `2` come back as `C_10` and `C_335`.
Not a conversion, but it is still the user's own text being spent, and it is three small edits:

- `js/lpn-inp.js`, the `[PUMPS]` reader (~line 523): keep the name beside the points —
  `pump.curveId = r[j + 1];` in the `HEAD` branch. The comment at 511-516 says a curve does not
  survive as TEXT in either direction; that is about the POINTS, and the id is a separate thing.
- `js/looped-network.js`, `docFromInp()` (~line 7439, where `curvePoints` is mapped): carry it,
  `if (l.curveId) { out.curveId = l.curveId; }`.
- `js/lpn-inp.js`, the `[PUMPS]`/`[CURVES]` writer: `var cname = lk.curveId || ('C_' + lk.id);`,
  used in both places so the two sections stay in step.

(The middle edit is in `js/looped-network.js`, which this track is not permitted to touch.)

One caveat for whoever writes it: two pumps sharing one curve id would then emit that id's rows
twice. Net3 does not (one curve per pump, three points each), and `curveRef` already exists on this
page for the shared case, so the writer should emit each distinct `cname` once.

### (c) `[OPTIONS] Units` following the project — my recommendation is to drop that bullet

It is a distraction, and it already does what the bullet asks for. `flowKey` is derived from
`units.lpn_u_flow` (js/lpn-inp.js:937-947), so the file is already written in the project's own unit
system, and byte identity for all ten keywords is already proven (Task 281,
`inp-export-harness.js`). The only case left is a project whose flow unit is one of the three EPANET
cannot name; there the arithmetic is unavoidable and is reported by name. Nothing to build.

### Secondary, worth its own task rather than this one

**`lpn_u_roughness` is missing from `LPN_UNIT_SELECTS`** (`js/looped-network.js:11148`), the list
that `applyUnitSelections()` and `readUnitSelections()` walk. It *is* in `LPN_INPUT_SELECTS`, so it
gets Task 422's Reinterpret/Convert dialog — but it is never written into a project's `units` and
never restored when one is opened. Harmless today because the page is hardcoded to Hazen-Williams
(dimensionless C) and the writer emits roughness through `PLAIN`; it becomes a silent
reinterpretation of every roughness the moment Task 271 lands the Darcy-Weisbach control, where the
quantity is a length (EPANET: millifeet US, mm SI).

## 4. Every value that changes on a Net3 round trip

`examples/Net3-lpn.json` opened via `applySaved()`, exported, diffed against
`dev/lpn-spike/reference/Net3.inp`. 1,225 tokens compared, 1,191 byte-identical, **34 different, 0
with a different value.**

| kind | section / quantity | count | examples |
|---|---|---:|---|
| REFORMATTED | COORDINATES / x | 12 | `9.00`→`9`, `23.90`→`23.9`, `23.00`→`23` |
| REFORMATTED | COORDINATES / y | 12 | `23.10`→`23.1`, `25.50`→`25.5`, `17.50`→`17.5` |
| REFORMATTED | PIPES / length | 2 | `4530.`→`4530`, `1325.`→`1325` |
| REFORMATTED | RESERVOIRS / head | 2 | `220.0`→`220`, `167.0`→`167` |
| REFORMATTED | TANKS / min level | 2 | `.1`→`0.1`, `4.0`→`4` |
| REFORMATTED | TANKS / elevation | 1 | `129.0`→`129` |
| REFORMATTED | TANKS / initial level | 1 | `29.0`→`29` |
| RENAMED | PUMPS / curve id | 2 | `1`→`C_10`, `2`→`C_335` |
| CONVERTED | — | **0** | — |

Control, in the same harness: the same model imported from `reference/Net3.inp` with today's reader
and exported comes back with **2** differences — the two curve ids — confirming the writer is not
the defendant.

## What is NOT a Task 430 problem, but will look like one

If "not identical" was measured by **running the exported file in EPANET** rather than by reading
it, the cause is elsewhere and is much larger than 32 characters: the writer emits no `[PATTERNS]`,
no `[OPTIONS] Pattern`, no `[TIMES]`, `[CONTROLS]` or `[RULES]`. Net3's `[OPTIONS] Pattern 1`
multiplies nearly every junction demand, and dropping it puts demands about a third low — the same
measurement recorded under **Task 423**. Solve the export-fidelity question there, not here.

Tom's own models are `.net`, and that path has one genuine value change of its own worth knowing
about: `netToInp()`'s `coord()` (`js/lpn-net.js:253`) writes map coordinates as `toFixed(4)`. A
`.net` stores coordinates as binary extendeds rather than as typed text, so this is a formatting
decision rather than a lost token — but a coordinate with more than four decimals is rounded, and
that is real. Every other `.net` value is passed through as the string EPANET stored.
