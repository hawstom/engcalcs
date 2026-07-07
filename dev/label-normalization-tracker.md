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
| Velocity shorts `mtc_vel_ok/high/low_short` ↔ `mhp_vel_*_short` | ⚠ **needs-decision**: open-channel vs pressure verdict blocks are intentionally separate in their long tips; do the identical short labels ("OK"/"High"/"Low") share one key, or stay separate for future divergence? |

### §3 Concept clusters
| § | Item | Disposition | Status |
|---|---|---|---|
| 3.1 | Head-loss triad + coefficient | D3 term ("Minor (local) loss"; rename `mphl_total_junction_k`) + D4 symbols (`h_f`/`h_m`/`h_L`,`k_m`); owner `mphl_` | ☐ |
| 3.2 | Elevation: shared bare key + closed qualified set | structure decided; **owners/canonical values not yet fixed** | ⚠ **needs-decision**: bare "Elevation" key+value (mi_elevation "Elev" short vs wi_elevation "Elevation" full — width-is-king says short is home); qualified-set owners (Headwater `or_hwe`, Tailwater `or_twe`, Invert `or_invert`, Centroid `or_centroid_elev`, Water-surface `mi_waterSurfaceElevation`); `odt_h_orifice`→reuse centroid; `odt_` WSE spell-out |
| 3.3 | Length | drop qualifier on `mphl_pipe_length` + `mhp_length` (keep penstock sense in tooltip); **keep** `cs_L` "Reach length" & `ws_weirLength` "Weir length"; fix `l`→`L` | ☐ (partly ◇ keep) |
| 3.4 | Slope naming + S₀ convention | "friction slope" canonical over mpf "pressure slope"; S₀=bed, S_f=friction (mpf currently inverts) | ⚠ confirm: renaming/​re-symboling `mpf_friction_slope` touches a live symbol — verify against JS before exec |
| 3.5 | Flow/velocity/roughness drift | mhp "Flow rate"→"Flow", "Flow velocity"→"Velocity" (decided). Roughness `e` (dw/mhp/ip) → one label+tooltip. Manning n: `mpf_manningRoughness` canonical, `rc_n_chute` legit variant (◇ keep) | ⚠ needs-decision: roughness-`e` survivor/owner (likely `dw_roughness`) |
| 3.6 | Weir/orifice head + coefficients | `ws_headWaterHeight` "height" vs weir-head term-of-art; `Cw`→`C_w` (typography, exec); `or_cd` kept distinct (◇) | ⚠ **needs-decision**: keep "Headwater height" or move to "head"? |
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

## Open decisions blocking full completion (Opus/Tom)
1. §2 velocity-short labels — share or keep separate?
2. §3.2 elevation bare-key owner/value + qualified-set owners.
3. §3.5 roughness-`e` survivor.
4. §3.6 "Headwater height" → keep or move to "head"?
5. §3.4 confirm S₀↔S_f re-symboling is safe against JS.

**Completion definition:** every row above is ☑ or ◇, the 5 open decisions are ruled, and post-edit
`php -l` + `lang_syntax_validate` + tag-parity are clean suite-wide.
