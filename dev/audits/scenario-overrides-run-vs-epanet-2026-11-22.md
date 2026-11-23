# Scenario overrides over an extended-period run, against EPANET 2.2 (audit 4, 2026-11-22)

Follows `eps-settings-tanks-vs-epanet-2026-11-20.md`. Same method and tolerances (head, level, pressure, headloss 1 mm; flow 2e-6 m3/s or 1e-5 of the largest; tank volume tolerance as the script states).
Each scenario fixture runs the page's own path (`createScenario`, `setProp`, `assembleModel`) in BOTH engines (built-in loop = NATIVE, page's EPANET bridge = BRIDGE) at every reporting time (49 frames, 48 h), against
the vendored EPANET engine (RAW) run on the ORIGINAL `.inp` with the overridden value typed in by hand (never our export). Script: `eps-audit-vs-epanet.js --one=<inp> --scenario=<json>`; gate:
`eps-audit-fixtures-harness.js` (run by `run_harnesses.sh`, hence `check_all`).

## Results

| Override | Fixture (scenario json) | What moved | BRIDGE | NATIVE (worst head / flow) |
|---|---|---|---|---|
| Valve setting: PRV1 40 to 50, PSV1 45 to 35, FCV1 10 to 5, TCV1 4 to 9 | `valves4.inp` + `valves4.setting.scn.json` (controls later close and reopen PRV1 and FCV1) | heads 19.8 m | 0 | 2.5e-5 m / 4.0e-7 m3/s, valve settings 1.8e-15, status diffs 0 |
| Tank diameter: T3 12 to 20 m, T2 25 to 15 m | `tanks.inp` + `tanks.diameter.scn.json` | 2.0 m | 0 | 7.9e-13 m, volume 2.2e-11 m3 |
| Tank initial level: T3 10 to 15, T1 (volume curve) 10 to 4, T4 3 to 1 | `tanks.level.scn.json` | 6 m | 0 | 3.4e-13 m, volume 9.6e-12 |
| Tank min/max level: T3 to 6..12, T1 to 1..13, T2 (min volume) to 2..4 | `tanks.minmax.scn.json` | 1.3 m | 0 | 6.4e-14 m, volume 3.4e-12 |

"What moved" is the engine's own difference between the unedited file and the hand-edited one, so a scenario that changes nothing fails the gate. Status differences 0 and tank level/volume agree at all 49 times.
The page's export of each scenario against the hand-edited file: 0.0 m on every one.

Also checked on every scenario fixture (all six, the two earlier ones included): the override does not reach Base (after a switch to Base the assembled model and the built-in run's frames are
identical to those taken before the scenario existed); the scenario answers differently from Base; switching back to the scenario gives its model and frames again. The page's run cache keys on a fingerprint of the
whole assembled model (`modelFingerprint()` in `js/lpn-time.js`), which contains every overridden value and the solver setting, so a stale run of the other scenario cannot be served; the harness holds the model side of that.

## Fixed

Nothing: no difference was found.

## Remains / not checked

- Fixtures are SI (LPS, metres). A scenario typed in US units (feet, psi) and converted at assembly was not run against EPANET here (the converter is shared with Base and audited in earlier passes).
- The fingerprint check is on the assembled model and the built-in run; the live `lpnTime` transport (host-driven `requestRun`, in-flight runs superseded by a switch) was not driven; it needs a browser harness.
- A valve setting override on a PBV or GPV, and a scenario override of a valve's setting where a rule sets it every step (the rule wins in both, by EPANET's order; not fixtured).
- Tank min/max override where the initial level falls outside the overridden range (EPANET refuses with error 110; the page refuses both engines alike, not pinned).
- Overrides of `k` for a TCV, pattern assignment, tank mixing: not covered.
