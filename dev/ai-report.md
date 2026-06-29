# EngCalcs — Math and Logic Review
**Date:** 2026-06-28  
**Scope:** Review of all 14 calculator JS files for math correctness and logic errors.  
**Files reviewed:** `js/darcy-weisbach.js`, `js/hazen-williams.js`, `js/manning-pipe-flow.js`, `js/manning-pipe-head-loss.js`, `js/manning-trap.js`, `js/weir-flow-simple.js`, `js/weir-flow-irregular.js`, `js/orifice.js`, `js/orifice-drain-time.js`, `js/drip-sprinkler.js`, `js/canal-seepage.js`, `js/micro-hydro-power.js`, `js/rock-chute.js`, `js/manning-irregular.js`, supporting `js/Manning.lib.js`.

---

## Issue 1 — CONFIRMED BUG — Manning Pipe Head Loss: HGL₂ always NaN

**File:** `js/manning-pipe-head-loss.js`  
**Severity:** High — the HGL₂ result field always displays NaN.

**Bad code (line 24):**
```js
this.var.hgl2 = +this.var.hgl2 - +this.var.hv;
```
`hgl2` has never been assigned at this point, so `+this.var.hgl2` evaluates to `NaN`. The result is always NaN regardless of inputs.

**Correct code:**
```js
this.var.hgl2 = +this.var.egl2 - +this.var.hv;
```
This matches the pattern used in `js/darcy-weisbach.js` (line: `this.var.hgl2 = +this.var.egl2 - +this.var.hv;`).

**Math basis:** HGL = EGL − velocity head. After `egl2` is computed, `hgl2 = egl2 − hv` is correct.

---

## Issue 2 — LOGIC CONCERN — Orifice: Submergence criterion too broad

**File:** `js/orifice.js`  
**Severity:** Medium — overestimates flow when tail water is between invert and centroid.

**Code:**
```js
this.var.submerged = (this.var.twe > this.var.zinv) ? 1 : 0;
this.var.h = this.var.submerged
    ? Math.max(0, this.var.hwe - this.var.twe)        // differential head
    : Math.max(0, this.var.hwe - this.var.centroid);  // head at centroid
```

The orifice is marked "submerged" whenever tail water (TWE) exceeds the invert. The problem arises in the intermediate case where `zinv < TWE < centroid`:

- Free-discharge formula gives `h = HWE − centroid`.
- The (incorrectly applied) submerged formula gives `h = HWE − TWE`.
- Since `TWE < centroid`, `HWE − TWE > HWE − centroid`, so **flow is overestimated** (non-conservative).

**Correct submergence criterion:** The orifice is fully submerged when `TWE > crown = zinv + d`. Standard engineering practice treats the orifice as free-discharging until the tailwater rises above the crown, and submerged once it does.

**Suggested fix:**
```js
this.var.submerged = (this.var.twe > this.var.crown) ? 1 : 0;
```
For the partially-submerged case (`zinv < TWE ≤ crown`), the simplest safe approach is to continue using the free-discharge head at the centroid, which gives a conservative (lower) flow estimate.

---

## Issue 3 — DESIGN RISK — Weir Flow Simple: no unit guidance, default Cw for US customary only

**File:** `js/weir-flow-simple.js`, `Weir-Flow-Simple.php`  
**Severity:** Medium — can cause errors up to ~63% for SI users who keep the default Cw.

All three inputs (`l`, `h`, `cw`) use `hasUnits = false` and the form hides units (`$flagHideUnits = true`). This is intentional — the calculator is deliberately unit-agnostic and the user is expected to choose Cw to match their unit system.

The problem is the default `Cw = 3`, which is the standard US customary coefficient (Q in cfs, L and H in ft). For SI users (Q in m³/s, L and H in m), the standard sharp-crested coefficient is approximately Cw ≈ 1.84, and broad-crested Cw ≈ 1.45–1.70 depending on conditions.

A user who keeps the default Cw = 3 while entering SI measurements will get a result roughly 63% too high (`3 / 1.84 ≈ 1.63`).

**Recommendation:** Add a note to the calculator page explicitly stating that Cw = 3 applies to US customary units (cfs, ft) and listing the SI equivalents. Even a single parenthetical sentence in the notes section would prevent this error.

---

## Issue 4 — COSMETIC — Darcy-Weisbach: "Hagen-Pouseuille" misspelling

**File:** `js/darcy-weisbach.js`  
**Severity:** Low — display text only; the hyperlink URL is unaffected.

**Code:**
```js
this.var.f_method = '<a href="https://en.wikipedia.org/wiki/Darcy%E2%80%93Weisbach_equation#Laminar_regime">Hagen-Pouseuille</a>';
```

"Pouseuille" should be "Poiseuille" (after Jean Léonard Marie Poiseuille). The URL anchor `#Laminar_regime` works correctly regardless.

---

## Items Verified Correct

The following formulas were independently verified and are correct:

| Calculator | Formula / Constant | Verified |
|---|---|---|
| Darcy-Weisbach | Laminar f = 64/Re | ✓ |
| Darcy-Weisbach | Transitional f (Moody-Dunlop EPANET interpolation) | ✓ |
| Darcy-Weisbach | Turbulent f (Swamee-Jain) | ✓ |
| Darcy-Weisbach | sf = f·u²/(2·d·g), hv = u²/(2g), hf, hm, hl, HGL/EGL accounting | ✓ |
| Hazen-Williams | sf = 7.8828/d^4.8704 · (Q/(0.849C))^1.852 — equivalent to standard SI formula 10.674·Q^1.852/(C^1.852·d^4.8704) | ✓ |
| Manning Pipe Flow | Partial-flow geometry: θ, A, P_w, R_h, T (all standard circular-section formulas) | ✓ |
| Manning Pipe Flow | Full-pipe capacity Q₀ = (c/n)·π·d^(8/3)/4^(5/3)·S^0.5 | ✓ |
| Manning Pipe Flow | Froude number with slope correction cos(atan(S₀)) | ✓ |
| Manning Pipe Flow | Binary solver for y/d₀ (bisection, 60 iterations) | ✓ |
| Manning Pipe Head Loss | sf constant 6.3496 = 4^(4/3) (correct for full-pipe Manning) | ✓ |
| Manning Trap Channel | Trapezoidal A, P_w, R_h, T, Froude, shear τ = R·S (in m H₂O) | ✓ |
| Manning Trap Channel | Blodgett n formula | ✓ |
| Manning Trap Channel | Isbash riprap D50 with 1.33 velocity safety factor | ✓ |
| Manning Trap Channel | D50 iteration (relaxed average of current and target) | ✓ |
| Weir Flow Irregular | Level section: q = Cw·l·H^1.5; Sloped section: q = Cw/(2.5·s)·(d₀^2.5 − d₁^2.5) | ✓ |
| Orifice Flow | Q = Cd·A·√(2gH) | ✓ |
| Orifice Drain Time | Drain time integral for conic pond model √A(h) = √A₀ + (√A₁−√A₀)·h/h₁ | ✓ |
| Orifice Drain Time | Drained volume antiderivative (sqA1³ − sqA2³)/(3β) | ✓ |
| Drip-Sprinkler | DU = q_min/q_avg, PR = q/Ae, t_run = d/PR (seconds → hours) | ✓ |
| Canal Seepage | Q_loss, E_c, annual volumes, lining area and payback | ✓ |
| Micro Hydro Power | Power = η·ρ·g·Q·H_net (W), annual_kwh = P/1000·8760 | ✓ |
| Micro Hydro Power | Friction factor identical to Darcy-Weisbach | ✓ |
| Rock Chute | D50 equations (Eq. 1, 2), Manning n (Eq. 3), Vm (Eq. 4–5), qs/d (Eq. 6–7) per Robinson 1998 | Not independently verified (requires paper) |
| Manning Irregular | Cross-section area between stations: (d₀²−d₁²)/(2s) = (d₀+d₁)/2·l | ✓ |
| Manning Irregular | Composite n (Eq. 617 / 618 per HEC-RAS/Chow) via `Manning.recalc()` | Assumed correct (complex, not re-derived) |

---

## Notes for Future Tasks

- **Task 93 (priority 93):** `mhp_vel_ok`, `mhp_vel_low`, `mhp_vel_high` language strings hardcode "m/s" and "1 m/s"/"3 m/s" thresholds. This is a separate task tracked at priority 93 in the roadmap.
- **Rock Chute Hp constant 1.45:** Used as the broad-crested weir coefficient (m^0.5/s, SI) for the inlet ponding check. Appears reasonable for SI but was not verified against Robinson, Rice & Kadavy (1998) directly.
- **Manning Trap Searcy coefficient 0.022:** The SI form of the Searcy D50 equation uses 0.022. Could not locate the original source to verify whether this coefficient was converted from English units or is natively SI.
