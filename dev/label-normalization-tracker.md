# Item 90 — Label-Normalization Coverage Tracker

**Scope (Tom, 2026-07-07): item 90 is NOT done until every section of
`dev/label-normalization-survey.md` is addressed.** "Addressed" = either **executed** (keys merged /
reworded / repointed) **or** explicitly **dispositioned as keep-as-is with a recorded reason**.
Decisions live in `dev/label-normalization-decision.md` (D1–D7). Execute full-suite, English-only,
applying D7 to every merge. This file is the checklist; update the Status column as we go.

Status legend: ☐ pending-exec · ☑ done · ◇ decided-keep (no change) · ⚠ **needs-decision** (Opus/Tom
ruling required before exec).

## Survey coverage

### §1 Ownership policy
| Item | Disposition | Status |
|---|---|---|
| Owner rule (neutral prefix vs borrow) | D1: borrow-from-owner, **incumbency** wins, menu order tiebreak | ☑ decided |

### §2 Exact duplicates (17 groups; full-suite audit 2026-07-07)
Owner by incumbency→menu; apply D7 (capture divergence to `dev/merge-divergence-review.md`).
| Survivor ← redundant | Status |
|---|---|
| `mpf_flow` ← or_flow, essc_q | ☐ |
| `mpf_velocity` ← or_velocity | ☐ |
| `mpf_wetted_perimeter` ← cs_wp | ☐ |
| `dw_friction_factor` ← mhp_f | ☐ |
| `dw_kinematic_viscosity` ← mhp_nu | ☐ |
| `or_hwe` ← wi_headWaterelevation (headwater elevation) | ☐ |
| `ws_notes_heading` ← mi_notes  (**incumbency: 10 pages > 2**, not menu order) | ☐ |
| `odt_notes_2_term` ← cs_notes_1_term, ip_notes_1_term ("Method") | ☐ |
| `rc_notes_4_term` ← cs_notes_4_term, ip_notes_4_term ("Reference") | ☐ |
| `ws_notes_we_term` ← wi_notes_we_term ("Weir Equation") | ☐ |
| `mi_hv617` ← ip_hv · `mi_v617` ← ip_v (symbols) | ☐ |
| `rc_ponding_check` ← rc_notes_7_term | ☐ |
| `mtc_vel_check` ← mhp_vel_check — **but keep `mtc_note_2_term` separate** (D7.5) | ☐ |
| Velocity shorts: survivor `mhp_vel_ok/high/low_short` ← `mtc_vel_*_short` (**SHARED**; incumbency 5>2) | ☐ |

### §3 Concept clusters
| § | Item | Disposition | Status |
|---|---|---|---|
| 3.1 | Head-loss triad + coefficient | D3 term ("Minor (local) loss"; rename `mphl_total_junction_k`) + D4 symbols (`h_f`/`h_m`/`h_L`,`k_m`); owner `mphl_` | ☐ |
| 3.2 | Elevation: shared bare + qualified set | bare owner `mi_elevation` (val "Elevation", CSS abbreviates); qualified set owned by Orifice (`or_hwe`/`or_twe`/`or_invert`/`or_centroid_elev`); `mi_waterSurfaceElevation` water-surface; `odt_h_orifice`→reuse centroid; `odt_` WSE spelled out | ☐ |
| 3.3 | Length | drop qualifier on `mphl_pipe_length` + `mhp_length` (keep penstock sense in tooltip); **keep** `cs_L` "Reach length" & `ws_weirLength` "Weir length"; fix `l`→`L` | ☐ (partly ◇ keep) |
| 3.4 | Slope naming + S₀ convention | "friction slope" canonical over mpf "pressure slope"; S₀=bed, S_f=friction (mpf currently inverts) — fix to standard | ☐ verify JS first |
| 3.5 | Flow/velocity/roughness drift | mhp "Flow rate"→"Flow", "Flow velocity"→"Velocity"; roughness `e`→D8 (symbol link + shared tip, see resolved #3); Manning n: `mpf_manningRoughness` canonical, `rc_n_chute` variant (◇) | ☐ |
| 3.6 | Weir/orifice head + coefficients | `ws_headWaterHeight`→ vanilla **"Head, h"** (tip external/in notes); `Cw`→`C_w`; `or_cd` kept distinct (◇) | ☐ |
| 3.7 | Rock/riprap cluster | unify D50 wording (mtc/rc/mi) + `D50`→`D₅₀`; `SG`/`sg` case; move embedded default "(2.65)" from label to tooltip | ☐ (small calls, mostly clear) |
| 3.8 | Points-table vocab | Station (`mi_station`/`wi_station`) → one key; Point/Segment/Region headers shared; **EGL/HGL kept as whole strings — fragment reuse REJECTED** (◇) | ☐ + ◇ |

### §4 Symbol & typography inconsistencies (mechanical ride-alongs, per D4/symbol rule)
| Item | Status |
|---|---|
| Case drift: `v`/`V`, `h_v`/`H_v`, `H`/`h` loss, `l`/`L`, `a`/`A`, `SG`/`sg`, unsubscripted `Cw`/`Q0`/`a0`/`z1`/`z2`/`d0`, `D50`/`D₅₀` | ☐ |
| Froude `F`→`Fr` (`mpf_froude_number` vs `mi_fr617`) | ☐ |
| `mpf_shear_stress` "tau" spelled vs `mi_tau` `&tau;` — normalize | ☐ |
| Inline `style="cursor:help;color:#06c;…"` (mtc_, rc_) → `class="ec-tip"` | ☐ (coordinate with tips-standard item) |

### §5 Check/verdict string conventions
| Item | Disposition | Status |
|---|---|---|
| Single verdict convention + `writeVelocityCheck` whole-string target | D5 + tips-standard item | ☐ |
| Collapse 4 ad-hoc verdict styles (✓ / Warning: / ⚠ / bare) across `cs_loss_*`, `or_regime_*`, `odt_h2_*`, `rc_sg_*`, `mhp_hl_*`, `mtc_vel_*` | D5 | ☐ |

## Resolved decisions (Tom, 2026-07-07) — all 5 ruled
1. **§2 velocity shorts — SHARED** (Tom overruled "keep separate"). One key each for OK/High/Low.
   Owner by **incumbency = `mhp_vel_*_short`** (used by 5 calculators: dw/hw/mpf/mphl/mhp) over
   `mtc_vel_*_short` (2: mtc/mi). Delete the `mtc_` shorts, repoint the open-channel JS to the
   `mhp_` shorts. (Prefix looks odd but borrow-from-owner allows it; these also become the D5 shared
   verdict vocabulary.)
2. **§3.2 elevation — as recommended.** Bare owner `mi_elevation`, value "Elevation" (narrow-column
   CSS abbreviates); qualified set owned by Orifice (`or_hwe`/`or_twe`/`or_invert`/`or_centroid_elev`);
   `odt_h_orifice` reuses `or_centroid_elev`; `odt_` WSE keys spelled out.
3. **§3.5 roughness — RESOLVED via D8 (two affordances).** Survivor `dw_roughness` value = bare
   symbol **`e`** (→ universal key, no translation), kept inside the PHP external reference `<a>`
   (blue underlined, no `?`); plus a **separate reusable tip key** (title "Darcy-Weisbach roughness",
   reusing `ip_e`'s existing tip text) placed **outside** the anchor. Repoint `mhp_roughness`/`ip_e`
   → survivor; add the reference `<a>` + shared tip to Irrigation-Pressure.php. Manning-`n`
   (mpf/mphl/mtc) gets the same pattern with its own "Manning roughness" tip. See decision doc D8.
4. **§3.6 weir head — vanilla "Head, h".** Tom judges bare "Head" safe on the weir page; **tip stays
   external** (explanation lives in the notes, no inline hover tip on this label).
5. **§3.4 slope — fix to standard** S₀=bed, S_f=friction; **verify against `js/manning-pipe-flow.js`
   first** and flag if a JS variable name would drift from the label before editing.

**Completion definition:** every row above is ☑ or ◇, the 5 decisions ruled (done), and post-edit
`php -l` + `lang_syntax_validate` + tag-parity are clean suite-wide.
