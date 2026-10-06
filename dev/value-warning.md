# A ⚠ beside an unreasonable value

**Why.** Sue (utility adviser): a scenario that switches the friction method without its own
roughness values reads C = 130 as a Darcy-Weisbach roughness of 130, and it solves, with garbage.
Tom, 2026-10-05: *"Yes. Add the glyph to every unreasonable value like a diameter over 150 inches or
under 12 mm; a roughness under 10 for C, over 1 or under 0.001 for n or over 0.001 for e; etc."*

**What.** A ⚠ beside the value in the Tables pane cell and in the Properties box row, with a tip
saying what range is expected. The value is never changed and nothing is refused.

**Where.** `js/looped-network.js`, section "A ⚠ BESIDE AN UNREASONABLE STORED VALUE":

- `LPN_VALUE_RULES`: the one table of thresholds, in SI.
- `valueWarningRule(field, si, method, ctx)`: the pure check, exposed as `EngCalcs.lpnValueWarning`.
- `valueWarnMethod(el)`: the friction method in effect for the value shown. Today it is the
  project's. A scenario that carries its own method answers here.
- `valueWarnText(field, el, shown)`: the hook. It converts the shown number to SI with
  `unitFactor()` and words the tip in the displayed unit.
- `paneValueWarn()` (Tables cell, on build and on refill) and `valueWarnPaint()` (any host).

Harness: `dev/lpn-spike/value-warning-browser-harness.js`.

## The rules

| Field | Method | ⚠ when | Source |
|---|---|---|---|
| Diameter (pipe, valve) | any | < 12 mm or > 3,810 mm (150 in) | Tom's numbers |
| Roughness C | Hazen-Williams | < 10 or > 200 | Floor: Tom. Ceiling: a margin above the highest C in EPANET 2.2 Users Manual Table 3.2 (plastic and steel, 140 to 150) |
| Roughness n | Manning | < 0.001 or > 1 | Tom's numbers |
| Roughness e | Darcy-Weisbach | <= 0 or > 10 mm | See below; <= 0 is EPANET's error 202 (`input3.c`, `pipedata()`) |
| Length | any | <= 0 | EPANET error 202 (`input3.c`, `pipedata()`) |
| Minor loss k (pipe, valve) | any | < 0 | EPANET error 202 (`pipedata()`, `valvedata()`) |
| Emitter coefficient | any | < 0 | EPANET error 209 (`input3.c`, `emitterdata()`) |
| Tank depths | any | lowest > highest, or water depth outside lowest..highest | EPANET error 225 (`validate.c`, `tanklevels()`) |

A C or n of zero or less is caught by its own floor.

**e, and the call Tom still has to make.** "Over 0.001 for e" names no unit. In millimetres or
millifeet it would flag nearly every real pipe. Even read as metres (1 mm) it flags old concrete and
riveted steel. So the ceiling is the named constant `LPN_DW_ROUGHNESS_MAX_M = 0.010` (10 mm), just
above the roughest published ranges: Moody (1944), *Friction factors for pipe flow*, gives riveted
steel 0.003 to 0.03 ft (0.9 to 9 mm) and concrete 0.001 to 0.01 ft (0.3 to 3 mm). If Tom wants a
different number, change that constant and nothing else.

## Seams

`feat/scenario-table` (one row per asset per scenario) and `feat/bentley-interop` (scenario-resolved
values) call `EngCalcs.lpnValueWarning(field, si, method, ctx)` with their own value and method,
or `paneValueWarn(spec, td, c, el)` from a cell render. A scenario-level friction method belongs in
`valueWarnMethod(el)`.
