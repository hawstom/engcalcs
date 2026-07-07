# Item 90 — Label-Normalization Coverage Tracker

**Scope (Tom, 2026-07-07): item 90 is NOT done until every section of
`dev/label-normalization-survey.md` is addressed.** "Addressed" = either **executed** (keys merged /
reworded / repointed) **or** explicitly **dispositioned as keep-as-is with a recorded reason**.
Decisions live in `dev/label-normalization-decision.md` (D1–D7). Execute full-suite, English-only,
applying D7 to every merge. This file is the checklist; update the Status column as we go.

Status legend: ☐ pending-exec · ☑ done · ◇ decided-keep (no change) · ⚠ **needs-decision** (Opus/Tom
ruling required before exec).

## How to execute (fresh-session handoff, 2026-07-07)

**All decisions are made (D1–D8 in `dev/label-normalization-decision.md`); this is pure execution.**
Read `dev/label-normalization-decision.md` (rulings + D7 method) and `dev/label-normalization-survey.md`
(evidence) first. Then work the ☐ rows below **top to bottom**.

- **Scope: ENGLISH-ONLY.** Edit `lib/lang.ec.en.php` and repoint PHP/JS references only. **Do NOT
  touch the 26 non-English `lib/lang.ec.??.php` files** — that's the later propagation phase (item 85).
- **Per merge (D7):** pick survivor (incumbency, else menu order) → set its English to the chosen
  wording/symbol → **delete the redundant key from English only** → repoint every PHP/JS reference to
  the survivor. Capture any `mi_q_617`-style *extra meaning* into the English survivor before deleting.
- **Order:** §2 exact duplicates (17 groups, listed below) → §3 clusters → §4 typography → §5 verdicts.
- **After each batch:** `php -l` touched files + `php dev/scripts/lang_syntax_validate.php`; then
  `git grep "'<deleted_key>'"` to confirm no dangling reference. Commit in small reviewable batches.
- **Expected:** `lang_parity_check.php` will report growing "extra" non-English keys — that is the
  propagation worklist, **not** a defect (D7).
- **Special cases:** §3.4 slope — verify `js/manning-pipe-flow.js` before re-symboling S₀/S_f. §3.5
  roughness + reference-linked labels — apply **D8** (bare symbol as the link + separate reusable `?`
  tip key outside the anchor). Velocity shorts — survivor is `mhp_vel_*_short` (incumbency 5>2).
- **Model:** execution is well-specified; Opus is fine for the judgment (wording, extra-meaning), or
  drop to Sonnet for the mechanical §4 typography ride-alongs. Not a Fable task (that's Wave 0).

## Survey coverage

### §1 Ownership policy
| Item | Disposition | Status |
|---|---|---|
| Owner rule (neutral prefix vs borrow) | D1: borrow-from-owner, **incumbency** wins, menu order tiebreak | ☑ decided |

### §2 Exact duplicates (17 groups; full-suite audit 2026-07-07)
Owner by incumbency→menu; apply D7 (**English-only**: delete redundant key from English + repoint refs; non-English orphans handled at propagation).
| Survivor ← redundant | Status |
|---|---|
| `mpf_flow` ← or_flow, essc_q | ☑ |
| `mpf_velocity` ← or_velocity (or_velocity was unused in code) | ☑ |
| `mpf_wetted_perimeter` ← cs_wp | ☑ |
| `dw_friction_factor` ← mhp_f | ☑ |
| `dw_kinematic_viscosity` ← mhp_nu | ☑ |
| `or_hwe` ← wi_headWaterelevation (headwater elevation) | ☑ |
| `ws_notes_heading` ← mi_notes  (**incumbency: 10 pages > 2**, not menu order) | ☑ |
| `odt_notes_2_term` ← cs_notes_1_term, ip_notes_1_term ("Method") | ☑ |
| `rc_notes_4_term` ← cs_notes_4_term, ip_notes_4_term ("Reference") | ☑ |
| `ws_notes_we_term` ← wi_notes_we_term ("Weir Equation") | ☑ |
| `mi_hv617` ← ip_hv · `mi_v617` ← ip_v (symbols; ip_v 'V'→'v' case fix rode along) | ☑ |
| `rc_ponding_check` ← rc_notes_7_term (rc_notes_7_term was unused in code) | ☑ |
| **`mhp_vel_check` ← mtc_vel_check** — tracker arrow was reversed; incumbency (mhp 5 pages > mtc 2) + the shorts decision make **mhp_vel_check** the survivor. `mtc_note_2_term` kept separate (D7.5). | ☑ |
| Velocity shorts: survivor `mhp_vel_ok/high/low_short` ← `mtc_vel_*_short` (**SHARED**; incumbency 5>2; PHP pageConfig + JS repointed) | ☑ |

### §3 Concept clusters
| § | Item | Disposition | Status |
|---|---|---|---|
| 3.1 | Head-loss triad + coefficient | D3 term ("Minor (local) loss"; rename `mphl_total_junction_k`) + D4 symbols (`h_f`/`h_m`/`h_L`,`k_m`); owner `mphl_` | ☑ (mhp_hf/hm/hl/km merged into mphl_; ip_ loss symbols case-fixed, kept separate as narrowest-use columns) |
| 3.2 | Elevation: shared bare + qualified set | bare owner `mi_elevation` (val "Elevation", CSS abbreviates); qualified set owned by Orifice (`or_hwe`/`or_twe`/`or_invert`/`or_centroid_elev`); `mi_waterSurfaceElevation` water-surface; `odt_h_orifice`→reuse centroid; `odt_` WSE spelled out | ☑ (wi_elevation merged→mi_elevation w/ narrowcol wrap; odt_h_orifice→or_centroid_elev; odt WSE spelled out incl. odt_h1 tip) |
| 3.3 | Length | drop qualifier on `mphl_pipe_length` + `mhp_length` (keep penstock sense in tooltip); **keep** `cs_L` "Reach length" & `ws_weirLength` "Weir length"; fix `l`→`L` | ☑ (mhp_length penstock sense moved to inline tip; cs_L/ws_weirLength kept ◇; l→L) |
| 3.4 | Slope naming + S₀ convention | "friction slope" canonical over mpf "pressure slope"; S₀=bed, S_f=friction (mpf currently inverts) — fix to standard | ⚠ **FLAGGED, not executed** — decision #5 JS-drift guard triggers: mpf slope input JS field is `s0` (7 refs) and feeds Manning uniform-flow; label symbol S₀ matches the field name and is correct for a bed-slope input; "Pressure slope" is a deliberate pressure-gradient distinction w/ an explanatory link. Re-symboling S₀→S_f would drift label from field name + break saved-calc URLs. **Needs Tom's ruling.** |
| 3.5 | Flow/velocity/roughness drift | mhp "Flow rate"→"Flow", "Flow velocity"→"Velocity"; roughness `e`→D8 (symbol link + shared tip, see resolved #3); Manning n: `mpf_manningRoughness` canonical, `rc_n_chute` variant (◇) | ☑ flow/vel merged; roughness `e`→D8 done (new `dw_roughness_tip`). **Manning-n D8**: tracker row marks it ◇/canonical, so the invasive symbol-only D8 rewrite (resolved #3 prose) was **deferred** — `mpf_manningRoughness` kept as canonical full label. |
| 3.6 | Weir/orifice head + coefficients | `ws_headWaterHeight`→ vanilla **"Head, h"** (tip external/in notes); `Cw`→`C_w`; `or_cd` kept distinct (◇) | ☑ |
| 3.7 | Rock/riprap cluster | unify D50 wording (mtc/rc/mi) + `D50`→`D₅₀`; `SG`/`sg` case; move embedded default "(2.65)" from label to tooltip | ☑ (D50→D<sub>50</sub> on all mtc_d50_*; mtc SG→sg; (2.65)→tip. `mi_d50in` left as-is — intent marks it "not used") |
| 3.8 | Points-table vocab | Station (`mi_station`/`wi_station`) → one key; Point/Segment/Region headers shared; **EGL/HGL kept as whole strings — fragment reuse REJECTED** (◇) | ☑ Station merged (wi_station→mi_station='Sta'). Point/Segment/Region: mi_ owns, nothing to repoint yet (◇). EGL/HGL kept whole (◇). |

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
