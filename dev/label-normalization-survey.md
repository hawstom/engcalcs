# Cross-Calculator English Label Survey — Concept-Level Normalization

**Task:** ROADMAP item 90 (Fable part). Survey the English labels across all calculators, cluster
them by concept, and identify reuse candidates and conflicts, so Opus/Tom can make the
reuse-architecture decision. Source: `lib/lang.ec.en.php` (501 keys), 2026-07-07.

**Payoff arithmetic:** every merged key removes 26 translations from the maintenance surface.
Exact duplicates alone are ~18 redundant keys (~470 redundant translations); adding the
near-duplicate clusters below roughly doubles that.

---

## 1. The reuse mechanism already exists

Calculator pages already reference other calculators' keys directly:
`Darcy-Weisbach.php` uses `mpf_flow`, `mpf_velocity`, `mphl_pipe_length`, `hw_hgl_1`, etc.
The lang file's own comments say so ("Darcy-Weisbach. See mphl_ for missing text.").
So the prefix convention in practice marks the **owning** calculator, not the using page.
Concept-level normalization is therefore *not* a new mechanism — it is a policy question:
(a) which key owns each shared concept, and (b) whether shared concepts should move to a
neutral prefix (e.g. `c_` / extend `calc_`) instead of borrowing from an arbitrary first owner.
That is the Opus/Tom decision; everything below is input to it. Tom says: I prefer the arbitrary first owner borrowing over the overhead of creating a neutral prefix. When there is no precedent, let's generally follow the current menu order to determine who is the owner. Is that okay?

## 2. Exact duplicates (mechanical merge candidates — no wording decision needed)

Same English string (case-insensitive, tags stripped) under multiple keys:

| String | Keys |
|---|---|
| `Flow, Q` | `mpf_flow`, `or_flow`, `essc_q` |
| `Velocity, v` | `mpf_velocity`, `or_velocity` |
| `Wetted perimeter, P_w` | `mpf_wetted_perimeter`, `cs_wp` |
| `Friction factor, f` | `dw_friction_factor`, `mhp_f` |
| `Kinematic viscosity, ν ?` | `dw_kinematic_viscosity`, `mhp_nu` (tooltips differ trivially: "at 20°C" vs "near 20°C") |
| `Headwater elevation` | `wi_headWaterelevation`, `or_hwe` |
| `Velocity check` | `mtc_vel_check`, `mhp_vel_check` (+ `mtc_note_2_term` as a notes term) |
| `OK` / `High` / `Low` | `mtc_vel_*_short` ×3 vs `mhp_vel_*_short` ×3 |
| `Weir Equation` | `ws_notes_we_term`, `wi_notes_we_term` |
| `Method` | `odt_notes_2_term`, `cs_notes_1_term`, `ip_notes_1_term` |
| `Reference` | `cs_notes_4_term`, `rc_notes_4_term`, `ip_notes_4_term` |
| `Notes` | `mi_notes`, `ws_notes_heading` |
| `H_v` | `mi_hv617`, `ip_hv` (both column headings) |

The whole 7-key velocity-check block (`vel_check`, `vel_ok`, `vel_high`, `vel_low`, + 3 shorts)
is duplicated between `mtc_` and `mhp_` with only trivial punctuation drift in the long strings
("Velocity is high; check…" vs "Velocity high - check…"). This is the single largest block
merge: 7 keys × 26 languages recovered, and it is a *behavioral* concept (a check verdict),
which suggests a generic `calc_check_*` family also usable by `or_regime_*`, `cs_loss_*`,
`odt_h2_*`, `mhp_hl_*` verdicts (see §5).

## 3. Concept clusters — same concept, different English (wording decision needed)

### 3.1 Head-loss triad (strongest cluster)
Three calculators present the identical physical triad with three wordings and two symbol cases:

| Concept | mphl_ | mhp_ | ip_ (column) |
|---|---|---|---|
| friction loss | `Friction loss, H_f` | `Friction head loss, h_f` | `H_f` |
| local loss | `Junction loss, H_m` | `Minor head loss, h_m` | `H_m` |
| total loss | `Total loss, H_l` | `Total penstock loss, h_L` | `H_l` |
| coefficient | `Total combined junction loss coefficient, k` | `Minor loss coefficient, k_m` | `K_m` |

Two independent decisions hide here:
1. **Terminology:** "junction loss" vs "minor loss". `mhp_notes_4_def` itself argues that
   "minor" is conventional but misleading; the `$ec_lang_intent` strings consistently gloss
   these as "junction (point) losses". Pick one suite-wide term (this is also a glossary entry). Tom w/ Fable: Concretely for §3.1: normalize mphl_junction_loss → "Minor (local) loss," rename mphl_total_junction_k accordingly, keep mhp_km as-is except aligning wording, and record "minor loss ⇄ local loss" in glossary.json so the sprints inherit the decision.
2. **Symbol convention:** `H` vs `h`, subscript `l` vs `L`, `k` vs `k_m` vs `K_m`. Pick one.

### 3.2 Elevation (Tom's candidate a) — supported, with a two-form structure
All elevation labels in the suite:

| Key | Current English | Context |
|---|---|---|
| `mi_waterSurfaceElevation` | Water surface elevation | input |
| `wi_headWaterelevation` | Headwater elevation | input |
| `or_hwe` | Headwater elevation | input |
| `or_twe` | Tailwater elevation | input |
| `or_invert` | Invert elevation ? | input |
| `or_centroid_elev` | Centroid elevation | result |
| `odt_h_orifice` | Orifice centroid elevation | input |
| `odt_h1_elev` | Starting WSE ? | input |
| `odt_h2_elev` | Ending WSE | input |
| `mi_elevation` | Elev | column heading |
| `wi_elevation` | Elevation | column heading |
| `ip_elev_ds` | DS Elev. ? | column heading |
| `ip_elev_supply` | Supply elevation, z_supply | input |

Findings:
- Bare "identical label wherever any calculator asks for an elevation" is **too strong**:
  Orifice Flow alone has four *different* elevations on one page (headwater, tailwater,
  invert, centroid) — a qualifier is load-bearing there and cannot move to the page title.
- What **does** normalize: (i) the qualified forms themselves — "Headwater elevation" already
  dupes across `wi_`/`or_`; `odt_h_orifice` ("Orifice centroid elevation") should reuse
  `or_centroid_elev`'s wording/key; (ii) `odt_` should stop using the abbreviation "WSE" while
  `mi_` spells out "Water surface elevation" — same concept, one page abbreviates, one doesn't
  (and "Starting/Ending" are the real distinguishers, tooltip-able);
  (iii) the bare column-heading form — `mi_elevation`="Elev" vs `wi_elevation`="Elevation" —
  should be ONE shared key (short form per `feedback_results_table_column_width`).
- Suggested structure: one shared bare concept key per concept ("Elevation"), plus a small
  closed set of shared qualified keys ("Headwater elevation", "Tailwater elevation",
  "Invert elevation", "Centroid elevation", "Water surface elevation") — still concept-level
  (each is one reusable concept), not word-level composition, so no gendered-agreement risk.

### 3.3 Length (Tom's candidate b) — supported for 3 of 5, keep qualifier on 2
| Key | Current English | Drop qualifier? |
|---|---|---|
| `mphl_pipe_length` | Pipe length, L | **Yes** — only length on page; title says Pipe. |
| `mhp_length` | Penstock length, L | **Yes**, cautiously — only length on page; but "penstock" carries the intent gloss "inlet delivery pipe or flume", which would need to survive in a tooltip. |
| `cs_L` | Reach length, L | **No** — "Reach" is load-bearing: L is the distance between the two measurement stations of the inflow-outflow method, not the canal length. Page title ("Canal Seepage") actively misleads toward whole-canal. |
| `ws_weirLength` | Weir length, l | **No/weak** — "weir length" is a term of art (crest dimension transverse to flow); bare "Length" invites the along-flow reading. |
| `ip_length` | L (column) | Already bare. |
| `rc_crest_length`, `rc_apron_length` | arc/apron lengths | Not candidates — derived results of specific features. |
Also note the symbol conflict: `L` everywhere except `ws_weirLength` = lowercase `l`
(visually ambiguous with `1`/`I`; worth changing regardless).

### 3.4 Slope
- `mpf_friction_slope` = "Pressure slope (…?…), S₀" vs `mphl_friction_slope` = "Friction slope"
  — the **same quantity in sibling calculators under two different names** (and the key name
  contradicts the mpf label). Pick one term ("friction slope" is the standard).
- `S₀` does double duty: friction slope (mpf) *and* bed slope (`rc_S0` "Chute bed slope").
  `mtc_channel_slope` uses plain `S`. Standard usage is S₀ = bed slope, S_f = friction slope;
  the suite currently inverts this on mpf.

### 3.5 Flow / velocity / roughness wording drift
- `mhp_flow` = "Flow rate, Q" vs everyone else's "Flow, Q"; `mhp_velocity` = "Flow velocity, v"
  vs everyone else's "Velocity, v". Normalize mhp to the majority wording (2 merges for free).
- Absolute roughness e, three wordings: `dw_roughness` "Darcy-Weisbach absolute roughness, e",
  `mhp_roughness` "Pipe roughness, e", `ip_e` "e" (tooltip "Darcy-Weisbach roughness height").
  One concept, one label + one tooltip.
- Manning n: `mpf_manningRoughness` "Manning roughness, n" is a good canonical;
  `rc_n_chute` "Manning roughness in chute, n" is a legitimate qualified variant.

### 3.6 Weir/orifice head and coefficients
- `ws_headWaterHeight` = "Headwater height, h" vs `rc_Hp` = "Inlet weir head, H_p" — the ws
  concept is exactly "weir head" (depth above crest); "height" avoids "head" but breaks with
  both the term of art and the rest of the suite (which uses head freely: velocity head,
  effective head). Glossary already has weir-head framing from rc_.
- `ws_weirCoefficient` "Weir coefficient, Cw" (no subscript markup) vs `or_cd`
  "Discharge coefficient, C_d" — related but distinct concepts; keep both, but fix `Cw` → `C_w`.

### 3.7 Rock/riprap cluster (mtc_, rc_, mi_)
- "Design rock size, D50" (`mtc_d50_in`) vs "Required median rock size, D₅₀" (`rc_D50`) vs
  "Median rock size of lining" (`mi_d50in`) — three wordings; also `D50` plain-text (mtc) vs
  `D<sub>50</sub>` (rc).
- `mtc_sgrock` "Rock specific gravity, SG (2.65)" vs `rc_sg` "Rock specific gravity, sg ?" —
  same label, but symbol case differs and mtc embeds the default value in the label while rc
  puts guidance in a tooltip. Tooltip is the better pattern (labels translate cleaner).

### 3.8 Points-table shared vocabulary (mi_, wi_, ip_)
- Station: `mi_station` "Sta" vs `wi_station` "Station<br />(distance)" — one shared
  column-heading key.
- The Point/Segment/Region group headers (`mi_group*`) and `ip_group_*` (Reach, Upstream,
  Downstream, Loss) are the start of a shared table vocabulary; `wi_` predates it.
- `ip_group_upstream`/`ip_group_downstream` already exist as standalone "Upstream"/"Downstream"
  labels — the EGL/HGL pairs (`hw_hgl_1/2`, `mphl_egl_1/2`) could *conceptually* reuse them,
  but that is word-level composition ("Upstream" + "HGL"), exactly what burned the original
  design in gendered/word-order languages. **Recommend keeping the EGL/HGL labels as whole
  strings** and only normalizing their wording pattern.

## 4. Symbol & typography inconsistencies (cheap fixes, ride along with any reform)

These aren't translation-surface items but the same audit surfaced them; fixing them during
the English-reform pass costs nothing and every language inherits them via the `symbol` rule:

- Case drift: `v` (mpf/or/mi) vs `V` (ip); `h_v` (mpf) vs `H_v` (mi/ip); `H` vs `h` loss
  symbols (§3.1); `l` vs `L` (§3.3); `a`, `a0` lowercase areas (mpf) vs `A` everywhere else;
  `SG` vs `sg`; `Cw` unsubscripted; `Q0`/`a0`/`z1`/`z2`/`d0`-in-tooltips unsubscripted vs
  `d<sub>0</sub>` in labels on the same page (mpf); `D50` vs `D<sub>50</sub>`.
- `mpf_froude_number` = "Froude number, F" vs `mi_fr617` = "Fr" — standard symbol is Fr.
- `mpf_shear_stress` spells out "tau" in prose; `mi_tau` uses `&tau;`.
- Tooltip markup: `class="ec-tip"` (dw, or, odt, mhp, cs, ip) vs inline
  `style="cursor:help;color:#06c;font-size:0.9em"` (mtc, rc) — the inline style is copied
  into every translated string 26×; converting to `ec-tip` shrinks every affected string in
  all 27 files and centralizes styling.

## 5. Check/verdict string conventions (behavioral concept, not just wording)

Verdict strings across calculators use four different decoration conventions:
- `✓` suffix (`cs_loss_positive`, `or_regime_valid`, `mhp_vel_ok`, `rc_sg_ok`…)
- `Warning:` prefix, no mark (`or_regime_warn`, `rc_sg_low`, `odt_h2_warn`)
- `⚠` suffix with `Warning:` (`cs_loss_negative`)
- bare sentence (`mtc_vel_high`)
A single suite convention (e.g. verdict mark + sentence) would let the duplicated
OK/High/Low shorts and the mtc/mhp velocity-check block merge cleanly and gives translators
one pattern instead of four.

## 6. Recommended shortlist for the architecture decision (Opus/Tom)

Ordered by value ÷ risk:
1. **Merge exact duplicates** (§2) — no wording decision, ~18 keys × 26 languages. Decide only
   the ownership/prefix policy (neutral shared prefix vs borrow-from-owner).
2. **Head-loss triad + coefficient** (§3.1) — one terminology decision (junction vs minor),
   one symbol decision; harmonizes mphl/mhp/ip and the glossary.
3. **Velocity-check block + verdict convention** (§2, §5) — 7-key block merge, enables future
   calculators to get checks for free.
4. **mhp wording drift** (§3.5) — "Flow rate"→"Flow", "Flow velocity"→"Velocity": 2 free merges.
5. **Elevation set** (§3.2) — shared bare key + closed set of qualified keys; fixes
   Elev/Elevation/WSE drift.
6. **Length** (§3.3) — drop qualifier on mphl/mhp only; keep "Reach length" and "Weir length".
7. **Friction-slope naming + S₀ convention** (§3.4) — small but currently self-contradictory.
8. **Typography ride-alongs** (§4) — batch into whatever Wave 0 English edits get approved.

**Risk note for translation reuse:** merging whole *labels* (noun phrases) at concept level is
safe across all 26 languages; the failure mode of the original word-level design was
*composition* (adjective + noun agreement, word order, RTL). None of the shortlist items
compose fragments at render time except the EGL/HGL idea, which §3.8 recommends against.
One genuine caution: a shared label translated once must fit its narrowest use — column-heading
uses need the short form to be the shared key's home (per the `.ec-narrowcol` width-is-king
rule), with long forms as tooltips, not vice versa.

**Interaction with item 85 (family-grid translation plan):** every merge executed *before* a
family's Wave 0/wave 1 shrinks that family's paid sprint. The §2 merges touching families 2–6
(weirs/orifices, pipe friction, mhp) are worth executing ahead of those families' waves.

---

## 7. Review verdict (Fable, 2026-07-07) — APPROVED

Opus/Sonnet's execution of §2–§5 is verified and approved. Independent checks performed, not
taken from the tracker's self-report:

- **No dangling references.** Every deleted key was grepped suite-wide; the only non-lang-file
  hits are form *field names* that legitimately share a key's spelling (e.g. `cs_wp` in
  `Canal-Seepage.php:20` is the input's `name`, whose label correctly borrows
  `mpf_wetted_perimeter`). Orphan keys remaining in the 26 non-English files are the intended
  item-85 propagation worklist per D7, not defects.
- **§3.1 triad** — `mphl_` owns `Friction loss, h_f` / `Minor (local) loss, h_m` /
  `Total loss, h_L` / `k_m`; dw/hw/mhp borrow them. Matches D3/D4 exactly.
- **§3.4 slope** — English label is `Friction slope …, S_f`; form field and every use in
  `js/manning-pipe-flow.js` (including the solve function) renamed `s0`→`sf` consistently;
  Manning-Trap/Irregular correctly kept bed-slope `s0`.
- **§5 verdicts** — `EngCalcs.writeCheckHTML()` implements D5 correctly (leading ✓/⚠, whole
  string as the `ec-tip` target, glyph untranslated); all six verdict groups repointed.
- **QA re-run clean:** `php -l` on all touched PHP, `node --check` on all touched JS,
  `lang_syntax_validate.php --lang=en`, and CLI renders of all 14 calculator pages (only CLI
  `SERVER_NAME` noise plus one pre-existing gap, below).

Residual items (none block item-90 closure):

1. **Tom's pending external rename** — the English `mpf_friction_slope` label now links to
   `../frictionslope.php`, which does not exist yet; `pressureslope.php` lives on the parent
   hawsedc.com site outside this repo. Until Tom renames it (a redirect from the old name is
   preferable — 26 non-English labels still link `pressureslope.php` until item-85 propagation),
   the English link 404s.
2. **Superseded tracker text** — item 86 (commit f87a7de) reversed the §3.5/D8 roughness
   consolidation after the tracker was marked complete: current state is
   `dw_roughness`='Roughness, e' (wide forms, dw/mhp), new `ip_roughness`='e' (narrow column),
   both sharing `dw_roughness_tip`. The state is coherent; the tracker row has been annotated.
3. **Hardening suggestion before propagation** — `writeCheckHTML()` interpolates `tipText`
   into `title="…"` unescaped. English tips are safe; a translated tip containing `"` would
   break the markup. Escape quotes in the helper before the item-85 sprints translate the
   `*_tip` keys.
4. **Pre-existing, out of scope** — `Manning-Irregular.php:93` requests velocity unit `mph`,
   which has no `$ec_units['mph']`/`u_mph` entry (gap dates to 2021); emits warnings and an
   empty unit option. Worth a small ROADMAP item.
