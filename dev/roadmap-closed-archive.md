# ROADMAP closed-task archive

Full original text of closed ROADMAP tasks that were compressed on 2026-08-05 under the LENGTH
DISCIPLINE rule in `dev/ROADMAP.md`. **Nothing here was deleted — this file is the long form.**
The roadmap carries a <=5-line stub for each, pointing here.

Durable policy from several of these lives in CLAUDE.md (Rules A-D from Task 140, the coverage
declaration from Task 203, Simple English from Task 98, glossary write-back from Task 109) and in
`dev/` docs. Read those first; this file is the narrative of how each was decided.


## Task 98

- 0|98|[CC] **DONE 2026-07-13: Task 98 closed — all 7 English-improvement items done.**
  1. `template_translation_help` reworded from "Do you have a great vision for a calculator to
     add here?  Can you help me improve translations, program, or host these calculators?" to
     "Do you have great ideas for expanding or improving these calculators or their
     translations?" in `lib/lang.ec.en.php`.
  2. `template_feedback` reworded "Please give us your valued words of suggestion or praise." to
     "Please share your valued words of suggestion or praise." (second sentence unchanged).
  3. `mpf_shear_stress` (already the single shared key used by mpf_/hw_/dw_/mtc_/mphl_ — confirmed
     via grep, no duplicate keys to consolidate) changed from "Average shear stress (tractive
     force), &tau;" to "Average shear stress, &tau;"; `$ec_lang_intent` updated to "Parallel or
     tangential tractive force per unit area on the bottom or bed of the cross section. | symbol"
     (edited with Tom's explicit in-task authorization, per CLAUDE.md's `$ec_lang_intent`
     AI-off-limits rule).
  4. `rc_sg`'s `$ec_lang_intent` rewritten to lead with "Relative density of rock" as the more
     standard modern term, explaining "specific gravity" is kept in the visible label only for
     continuity with Robinson's paper (same authorization basis as item 3). `glossary.json`'s
     `specific gravity` entry `context` field updated to match.
  5. **Simple English pilot on rc_ (Rock Chute).** Tom's direction: this is a multilingual project
     with an established English user base, so prioritize translatability over English SEO/idiom
     for *explanatory* content — but identity strings (menu + `<title>`) still match the
     authoritative source's own name. Captured as a standing principle in CLAUDE.md ("Write
     English source strings in Simple English"). Audit found "riprap" had been phonetically
     transliterated (not translated) in 6/26 languages (am, bn, he, hi, id, ur) and "chute" in 2
     more (hi, ur). First pass (over-corrected, caught by Tom): renamed English "Rock Chute" →
     "Steep Channel" and "Riprap" → "Rock Lining" *everywhere* including
     `rc_main_menu`/`rc_main_title`, and force-fit all 7 languages' identity strings to the "Steep
     Channel" concept. Tom's correction: Robinson's paper is literally titled "Design of Rock
     Chutes" — the calculator's *name* (menu + title) should keep matching that, only the
     *explanatory* text (description, tooltips, labels) should simplify; and no language should be
     forced into a specific English calque either way. Checked the evidence: 5 of the 6 flagged
     languages (am, bn, he, id, zh) already had natural, non-transliterated "Rock Chute"
     translations in their menu/title *before* any of this — proving transliteration risk tracks
     translation-pass quality, not UI tier, and that forcing "Steep Channel" onto them would have
     overwritten good translations that didn't need touching. Reverted: English
     `rc_main_menu`/`rc_main_title` back to "Rock Chute Design (Robinson)" / "Free Online Rock
     Chute Design Calculator — Robinson (1998)"; am/bn/he/id/zh's menu/title back to their original
     (already-natural) text; hi/ur's menu/title re-done (2 more small agent passes) as natural,
     non-calqued "rock chute" phrases (हिन्दी "चट्टानी ढाल संरचना", Urdu "پتھریلی گزرگاہ") — real
     transliteration fixes, not forced steep-channel translations. Explanatory strings
     (`rc_main_desc` and all rc_ body labels/tooltips/notes) keep the Simple English wording in
     all 7 languages — those were the actual defect locus. zh's pre-existing 3-way term
     inconsistency (块石/护坡/抛石 in explanatory strings → standardized on 护坡) also kept; zh's
     menu/title reverted to its original 块石 wording, matching the identity/explanatory split.
     `php -l` and `lang_syntax_validate.php` clean suite-wide (65 pre-existing advisory
     identical-to-english findings only, no new structural issues). Full 12-calculator Simple
     English audit deferred pending review of how this pilot lands (Tom's call, 2026-07-13: pilot
     rc_ only for now).
  6. **Cross-calculator jargon audit (Tom's candidate list: head, irregular, micro-hydro/
     run-of-river, seepage) — evidence-based, no English renames needed.** None of the other 11
     calculators cite a specific published paper by name the way rc_ cites Robinson, so the
     identity-vs-explanatory tension from item 5 doesn't recur as a *naming* decision elsewhere;
     this was purely a defect hunt. Checked actual shipped translations (not just glossary notes)
     against each candidate term:
     - **"head"** (dw_/hw_/mphl_/mhp_): no action. Core hydraulic vocabulary, not jargon — already
       had 6 languages' worth of documented wrong-sense fixes (pressure-loss vs. head-loss
       confusion) in ro/tr/id/fa/sw/ps between 2026-07-09 and 07-10; re-verified all still clean.
       Eponym calculators (Darcy-Weisbach/Hazen-Williams/Manning) already correctly keep their
       formula names untranslated.
     - **"irregular"** (mi_/wi_): bg was shipping the exact evaluative-sense defect (`неправилно`
       = "incorrect") the glossary's own "irregular channel" entry warns against, despite uk/ru
       already being fixed for the identical problem. Fixed bg's 7 occurrences to `произволно
       сечение` ("arbitrary cross-section"), matching the uk/ru pattern. Lesson: a documented
       glossary warning doesn't guarantee every flagged language was corrected — verify shipped
       state.
     - **"micro-hydro" / "run-of-river"** (mhp_): sw and km left "Micro-Hydro" as raw untranslated
       Latin English embedded in native sentences; km and ps also left "(Run-of-River)" as a
       redundant English parenthetical even where the surrounding sentence already translated the
       concept; ps separately phonetically transliterated "مایکرو هایدرو" as its own word
       throughout (same defect, different script — not caught by a Latin-script-only grep). Same
       failure class as the rc_ "riprap" defect. Fixed all 4: sw → "Umeme Mdogo wa Maji", km →
       "ថាមពលវារីអគ្គិសនីខ្នាតតូច", ps → "کوچنی آبي ځواک" — all real native phrases, none forced to
       calque the English wording (per item 5's "don't force a calque" rule). ar and zh were
       already clean and served as the quality bar.
     - **"seepage"** (cs_): no defects found. Checked actual translated values (not key names,
       which falsely matched "seepage" as a literal substring of every `irr_card_seepage_*` key)
       across all 26 languages — every one has a real native infiltration/percolation term.
     `php -l` and `lang_syntax_validate.php` clean for all 4 touched languages (bg, sw, km, ps) and
     suite-wide (same 65 pre-existing advisory findings, no new issues).
  7. **DONE 2026-07-13.** `ip_main_desc` changed from "Test Branch Pressure and Uniformity
     Estimate" to "Test Branch Pressure and Estimated Uniformity" in `lib/lang.ec.en.php`. The
     point of the reword (Tom, 2026-07-13): disambiguate that "Estimate(d)" modifies *only*
     "Uniformity" — the test-branch pressure itself is directly calculated, not an estimate. The
     old wording read as "[Test Branch Pressure] and [Uniformity Estimate]", ambiguous between
     that and "Estimate of both [Test Branch Pressure] and [Uniformity]". Re-checked all 26
     translations against this specific scope question (an initial "no propagation needed" note
     was wrong — it only checked for meaning-equivalence, not for this ambiguity) and found 4 with
     the identical wrong-scope defect, where a single leading "estimate" noun grammatically governs
     both pressure and uniformity: `bg` ("Оценка на налягането и равномерността..." — "Estimate of
     the pressure and the uniformity..."), `cs` ("Odhad tlaku a uniformity..." — "Estimate of
     pressure and uniformity..."), `hr` ("Procjena tlaka... i jednolikosti" — "Estimate of
     pressure... and uniformity"), `pt` ("Estimativa de Pressão e Uniformidade..." — "Estimate of
     Pressure and Uniformity..."). `ru`/`uk` already used the correct separated structure (a
     distinct "test/pressure" phrase and a distinct "estimate/uniformity" phrase joined by "and")
     and served as the model for the fix: `bg` → "Налягане в пробния клон и оценена равномерност"
     (pressure in the test branch and estimated uniformity), `cs` → "Tlak ve zkušební větvi a
     odhadovaná uniformita", `hr` → "Tlak u testnoj grani i procijenjena jednolikost", `pt` →
     "Pressão no Ramo de Teste e Uniformidade Estimada" — all now attach the estimate word as an
     adjective directly on uniformity only, matching the corrected English's scope exactly. The
     other 22 translations were re-verified clean (their own "estimate" word already binds only to
     uniformity, via a trailing compound or genitive construction). `php -l` and
     `lang_syntax_validate.php --lang=bg,cs,hr,pt` clean (only the same pre-existing advisory
     `identical-to-english` findings, no new issues).
  10. **Closed after scoping — no Opus pass needed.** Checked what items 1-4's English changes
      actually implied for the other 26 languages before propagating anything:
      - `mpf_shear_stress`: every one of the 26 translations still carried the "(tractive force)"
        parenthetical the English dropped. This was a mechanical deletion of an already-correct
        fragment (not a new-translation task), so no agent was needed — stripped it from all 26
        files directly (zh used full-width parens/comma, handled separately). `php -l` clean on
        all 27 files; `lang_syntax_validate.php` shows only the same 65 pre-existing advisory
        findings.
      - `rc_sg`: only the invisible `$ec_lang_intent` changed — nothing visible to propagate.
      - `template_translation_help` / `template_feedback`: reviewed all 26 translations and found
        propagation would be a regression, not an improvement — most languages (ru, ar, hr, sw,
        zh, cs, uk, sr, ur, ro, bg, etc.) already independently phrase "share" rather than "give",
        ahead of where the old English was; the old `template_translation_help` asked volunteers
        for translation/programming/hosting help specifically, content the new terser English
        dropped but which all 26 translations still usefully carry; and Turkish's string carries a
        hand-written translator credit (Mustafa Özbay) that must not be mechanically overwritten.
        Left all 26 as-is.


## Task 120

- 0|120| **Holistic calculator mathematical audit — DONE 2026-07-16.** Review the mathematical and
  checks logic of all calculators. Scoped 2026-07-16 into a per-calculator checklist and staged plan:
  `dev/calculator-math-audit-checklist.md` (14 calculators identified, generic 7-point checklist,
  calculator-specific risk notes, and a 4-stage plan grouped by shared physics — friction/pipe-flow,
  open-channel, weir/orifice, standalone). Stage 1 (friction/pipe-flow cluster) started 2026-07-16.

  **Critical bug found and fixed, stage 1, 2026-07-16: transitional-regime (2000 < Re < 4000)
  friction factor was wrong by up to ~127×, always too high.** `Darcy-Weisbach.php`,
  `Micro-Hydro-Power.php`, and `Irrigation-Pressure.php` each hand-copy the same Dunlop (1991)
  cubic-interpolation friction-factor formula (the transitional bridge between Hagen-Poiseuille
  laminar flow and the Swamee-Jain turbulent approximation, matching EPANET's method) — all three
  had the identical defect. Verified against the published formula (web-confirmed via the `pyhyd`
  reference implementation) and numerically via a Node harness requiring each JS file directly (per
  `feedback_verify_calc_math_numerically`): the shipped code was discontinuous with both the laminar
  and turbulent branches at their shared boundaries (e.g. `f`=0.661 just above Re=2000 vs. the
  laminar branch's 0.032 just below it — should be continuous). Root cause, two independent
  transcription errors, both required to fix: (1) the `y3` term used `Math.log10` where the formula
  requires natural log (the `0.86859` constant is only valid paired with `Math.log`); (2) the `x4`
  term was `0.032 * fa + 0.5 * fb`, missing a `-3·fa` component (correct: `0.032 - 3*fa + 0.5*fb`).
  Fixed in all three files; also added a `re === 0` guard to `dw_`/`mhp_` (already present in `ip_`)
  since `q=0` previously produced `f=Infinity` → `NaN` head-loss results. Post-fix verification:
  Node harness confirms exact continuity at both Re=2000 and Re=4000 boundaries in all three files;
  `php -l` clean on all three pages; `node -c` clean on all three JS files.

  **Stage 1 completed, 2026-07-16 — remaining checks all clean, one open modeling question for
  Tom.** `hw_`'s `S_f = 7.8828/D^4.8704 · (Q/(k·C))^1.852` with `k=0.849`: verified algebraically
  and numerically equivalent (within constant-rounding, 10.674 vs. the commonly tabulated 10.67) to
  the standard combined SI Hazen-Williams head-loss formula `S_f = 10.67·(Q/C)^1.852/D^4.8704` — no
  defect. `mphl_`'s full-pipe `S_f = v²n²·6.3496/(c²·D^4/3)` (`c=1.0` SI Manning coefficient):
  verified `6.3496 = 4^(4/3)`, the exact constant produced by substituting `R_h=D/4` into Manning's
  equation solved for slope — confirms algebraically and numerically (matched a direct Manning
  equation solve to 4 decimal places) — no defect. `ip_`'s bisection solver: the upper bound
  `hi = hSupplyTarget + maxElevDrop + 1` is a real derived bound (proven via a no-losses energy
  argument that the true root's far-end pressure must be strictly less than
  `hSupplyTarget + maxElevDrop`), not an arbitrary guess, and the "no solution" check
  (`ipMarch(hi) < target`) is mathematically sound given that bound — 60 bisection iterations is
  far more than the ~37 needed to reach the `1e-9` exit tolerance from any realistic starting
  range. `mhp_`'s `P = η·ρ·g·Q·H_net` power conversion and `annual_kwh = P/1000·8760` checked
  dimensionally and numerically correct; velocity/head-loss-% verdict thresholds match the
  suite-wide conventions already vetted in Tasks 101/102/105.

  **Christiansen exponent corrected, 2026-07-16.** `ip_` had hardcoded `christiansenM = 1.852` (the
  Hazen-Williams flow exponent) inside Christiansen's multi-outlet reduction factor `F(n)`, but
  `ip_`'s own pipe friction is Darcy-Weisbach/Swamee-Jain, not Hazen-Williams. Tom's call after
  discussion: changed to `1.75`, the Blasius/smooth-turbulent Darcy-Weisbach exponent
  (`h_f ∝ Q^1.75`) — the physically correct match for `ip_`'s own friction model, and also the
  value Keller & Bliesner's *Sprinkle and Trickle Irrigation* (the standard irrigation-engineering
  reference) uses for this exact case, since laterals are small-diameter smooth plastic pipe
  operating in the smooth-turbulent regime, not the fully-rough regime (`m=2.0`) or Hazen-Williams
  pipe networks (`m=1.852`). `node -c`/`php -l` clean.

  Minor robustness gaps noted but not fixed (no wrong-answer risk, just ungraceful degenerate
  inputs): `ip_`'s `h_design=0` produces `k=Infinity`; a zero-diameter reach produces `Infinity`
  velocity — both are invalid-input cases a user would immediately notice from the garbage output,
  not silent wrong answers, so left as-is pending a UX pass rather than blocking stage 1 closure.

  Stage 1 (`dw_`/`hw_`/`mphl_`/`mhp_`/`ip_`) is now complete. Next: authorize stage 2 (open-channel
  cluster: `mpf_`, `mtc_`, `mi_`).

  **Stage 2 (open-channel cluster) completed, 2026-07-16 — all formulas verified correct, no bugs
  found.** `mpf_`: circular partial-full-pipe geometry (area, wetted perimeter, hydraulic radius,
  top width, `Q_full`) all re-derived algebraically from the θ (half-angle) parameterization and
  matched exactly; the bisection solver's claimed peak-flow depth ratio `y/d₀ ≈ 0.9376` verified
  numerically against a fine-grained numerical search of the true peak (true peak ≈0.9382, giving
  99.9997% of max Q at the coded value — a safe, correct approximation), and the solver's full
  domain `[1e-4, 0.9376]` confirmed strictly monotonic in Q (no double-root risk, no
  catastrophic-cancellation precision loss at the small-depth end). Minor, low-severity finding:
  `dd0=0` or any value outside `(0,1)` produces `NaN` rather than a graceful message — visibly
  broken, not silently wrong, left as a UX item rather than a math defect.

  `mtc_`: trapezoidal area/wetted-perimeter/top-width formulas, Strickler's `n` (`D50^(1/6)/21.1`),
  and Blodgett's riprap-channel `n` formula all verified algebraically and numerically exact against
  their standard published forms. The Isbash rock-sizing formula in `js/Manning.lib.js`
  (`mc_riprap_size`) verified exact against the classic Isbash stability equation
  `V_c = c·√(2gD₅₀(Sg-1)·cosθ)` solved for D₅₀, including the side-slope angle correction
  (`cosθ = cos(atan(1/z))`) and the `z=1000` trick used to represent the flat channel bottom case.
  The Bathurst composite-roughness formula (also in `Manning.lib.js`) could not be verified
  coefficient-by-coefficient against the primary source (HEC-15 Appendix C.3) — this sandboxed
  environment has no PDF-text-extraction tooling (`pdftotext`, `pip`, and `apt`/`sudo` are all
  unavailable) and web fetches of the FHWA PDF returned only binary/unparseable content. Structural
  cross-checks that *did* succeed are reassuring: the code's `da/D50 < 1.5` Bathurst-applicability
  threshold and its three-term denominator (Froude-based, roughness-geometry-based,
  channel-geometry-based) both match published descriptions of the method exactly. Flagged rather
  than silently trusted — if Tom has independent access to HEC-15 Appendix C.3, worth a direct
  coefficient check against the 9 numeric constants in `EngCalcs.Manning.bathurst_n`. One harmless
  documentation slip found: the iteration-relaxation comment says "move d50_in 75% of the way" but
  the actual code moves 5/6 ≈ 83.3% of the way — cosmetic only, not a math defect.

  `mi_`: verified by constructing a symmetric trapezoid test case in the general irregular-geometry
  station/elevation formulas and confirming it reduces segment-by-segment to `mtc_`'s own exact
  closed-form results (same area, wetted perimeter) — strong cross-calculator confirmation. The
  `ncompterm617`/`ncompterm618` composite-Manning's-n formulas are legitimate published methods
  (Horton-Einstein and its companion sqrt-based equation). One dead-code finding, not a defect:
  `closeRegion()` computes a full second set of results (`n618`/`v618`/`fr618`/`q618`) that are
  never written to the DOM anywhere in `manning-irregular.js` — silently computed and discarded
  every run.

  **Stage 3 (weir/orifice cluster) completed, 2026-07-16 — all formulas verified correct, no bugs
  found.** `or_`: standard orifice equation `Q = Cd·A·√(2gh)`, centroid/crown geometry, and the
  submerged-vs-free-flow head selection logic all confirmed correct (numeric check: circular
  D=0.3m, h=1.35m, Q matched the hand-derived expected value exactly). `odt_`: independently
  re-derived both the drain-time and drained-volume closed-form solutions from the underlying
  differential equation (`dV/dt = -Cd·Aor·√(2gh)` with the conic pond-area model
  `A(h)=(√A0+(√A1-√A0)·h/h1)²`) — both match the shipped antiderivatives term-for-term; the
  flat-pond fallback (`A0≈A1`) correctly reduces to the simple `A0·(h1-h2)` limiting case. `ws_`:
  confirmed the standard `Q=Cw·L·H^1.5` weir equation; its documented no-internal-unit-conversion
  design (`Cw` itself encodes the unit system, US-customary ~3.0 vs. SI ~1.84) is an intentional,
  commented simplification, not a defect. `wi_`: independently re-derived the sloped-crest
  per-segment integral of `Cw·d(x)^1.5` and confirmed it matches the code exactly (cross-checked
  against a 2-million-step direct numerical integration, agreement to 6 decimal places), and
  confirmed the flat-crest case algebraically reduces to `ws_`'s own formula exactly.

  Stages 1, 2, and 3 all complete — 12 of 14 calculators fully audited with only the Bathurst
  coefficient question left open (needs Tom's own HEC-15 access). Next: authorize stage 4
  (standalone: `rc_` Rock Chute regression coefficients against the Robinson paper, `cs_` — lowest
  remaining risk, pure arithmetic).

  **Stage 4 completed, 2026-07-16 — `cs_` clean, `rc_` fully verified against its primary source
  with no bugs found.** `cs_`: every division in `canal-seepage.js` is guarded, the payback/recovery
  logic degrades gracefully to `Infinity`/em-dash rather than `NaN`, and the ≥80%/≥60% conveyance-
  efficiency thresholds match typical published irrigation-efficiency benchmarks — no defects.

  `rc_`: unlike the Bathurst formula in stage 2, the primary source (Robinson, Rice & Kadavy 1998,
  *Design of Rock Chutes*, Trans. ASAE 41(3):621-626) was successfully obtained and read in full.
  Verified every equation in `rock-chute.js` directly against the paper, including running the
  paper's own worked example (S₀=0.20, q=0.60 m³/s/m) through the actual JS via a Node harness: D50
  (230.6mm vs. paper's 231mm), Manning's `n` (0.0513 vs. 0.051), mantle velocity `Vm` (0.1513 vs.
  0.151 m/s), mantle discharge `qm` (0.0698 vs. 0.070 m³/s/m), and flow depth `d` (0.1864 vs. 0.186m)
  all matched to the paper's own stated precision (trivial residual differences trace to the code's
  more precise `g=9.806` vs. the paper's rounded `g=9.81`). The `40D50` crest radius, `2D50` layer
  thickness, and `15D50` apron length constants, and the specific-gravity (2.54–2.82) and gradation
  (1.15–1.47) validity-check bounds, all match the paper's stated test parameters exactly. One
  citation-accuracy finding, not a math bug: the inlet-ponding weir-head formula
  (`Hp=(qt/1.45)^(2/3)`) is commented as sourced from "Robinson, 1998," but that paper contains no
  discussion of inlet ponding or approach-channel weir behavior at all (it covers only rock
  stability, roughness, and outlet stability) — the underlying physics is legitimate (a standard SI
  broad-crested-weir critical-flow relation; 1.45 is a commonly cited practical coefficient), it's
  simply misattributed in the comment.

  **All 4 stages and all 14 calculators now audited.** Summary across the full Task 120 pass: one
  critical bug found and fixed (stage 1's transitional-friction-factor defect, up to ~127× error,
  affecting `dw_`/`mhp_`/`ip_`), one modeling-judgment fix applied (`ip_`'s Christiansen exponent,
  1.852→1.75), and otherwise a clean bill of health — every other formula across all 14 calculators
  was independently re-derived or numerically verified against a primary source, published worked
  example, or closed-form cross-check, with only cosmetic findings (stale comments, one
  dead-code block in `mi_`, one misattributed citation in `rc_`) and one still-open item (Bathurst
  coefficients in `mtc_`, blocked by lack of PDF tooling in this environment — flagged for Tom to
  verify independently if he has HEC-15 access). Task 120 priority should be reviewed/lowered given
  this completion; no further audit work is scheduled unless Tom wants the Bathurst check followed
  up or a future re-audit after calculator changes.


## Task 121

- 0|121| **Second-opinion (Opus) pass on the Task 120 mathematical audit — DONE 2026-07-16.**
  Independent re-check requested by Tom before fully closing the book on Task 120, since the first
  pass (Sonnet, self-derive-then-self-check) had already found one critical bug — meaning the base
  rate for a second hiding defect wasn't zero, and self-derivation-then-self-check has a structural
  blind spot (a shared conceptual slip in both deriving the "correct" formula and reading the code
  would pass as "verified"). Scoped narrower than a full 14-calculator redo (see the original task
  text in git history for the 5-point scope); launched as a single Opus agent per
  `feedback_fable_unavailable_use_opus`, with instructions to work Part A (independent re-derivation
  of the two shipped fixes) *before* reading the Task 120 write-up, to avoid anchoring. Hit a session
  limit partway through Part B (mid-way through testing `mtc_`'s Blodgett-formula edge cases) — no
  code was at risk since this was a report-only task; resumed from transcript via SendMessage rather
  than relaunched from scratch, per `feedback_session_limit_retry`.

  **Result: independently reached the same conclusions as the first pass on both shipped fixes,
  via its own from-scratch derivation — no new critical bugs found.** Re-derived the Dunlop/EPANET
  transitional friction-factor cubic independently and confirmed the same two-part diagnosis
  (natural log required, not log10; the `x4` term needs its `-3·fa` component) — verified the
  boundary identities algebraically (at `r=1`/Re=2000 the cubic collapses to exactly `0.032`; at
  `r=2`/Re=4000 to exactly the Swamee-Jain value) and numerically (continuous to 6 decimals across
  4 test pipes). Independently confirmed the Christiansen exponent `m=1.75` as the physically
  correct Blasius/smooth-turbulent value for `ip_`'s Darcy-Weisbach-based lateral friction model,
  citing the same Keller & Bliesner convention. Re-audited the self-derived-formula-matches-code
  findings from stage 1/2 (`mpf_` geometry and peak-Q claim, `hw_`'s Hazen-Williams constant) and
  reconfirmed both independently.

  **Bathurst coefficients: still unverified, but the blocker is now better understood.** The agent
  got further than the first pass — it downloaded the HEC-15 PDF and text-extracted ~1.8MB via a
  Python/zlib script (no `pdftotext` needed) — but found Appendix C's equations are typeset as
  images/special glyphs, not extractable text; the specific coefficients (13.434, 1.025, 0.755,
  0.492, 0.118, 1.14) never appeared in the extracted text. It did confirm the formula returns
  physically plausible Manning's-n values (≈0.044–0.054) for realistic riprap channels with no
  NaN/negative results in its valid input range. Certifying the exact 9 constants against the
  primary source still requires either a human with a readable copy of HEC-15 Appendix C.3, or an
  OCR-capable tool this environment doesn't have.

  **Follow-up, 2026-07-16 — Bathurst provenance now confirmed a dead end, not a pending to-do.**
  Tom recalls originally sourcing the `bathurst_n` formula from the Maricopa County Drainage Design
  Manual, Hydraulics Volume — but checked the current edition (Section 7.6.3, "Riprap Lined
  Channels") and found Bathurst and Blodgett are no longer present there at all; that section now
  covers only Limerinos (1970) and Phillips & Ingersoll (1998) base-n equations. The original
  citation source is gone from the manual Tom actually used, not merely hard to fetch — so this is
  closed out as a genuine dead end per `feedback_native_review_pipe_dream`'s spirit (don't log an
  unrecoverable gap as a live pending action). Residual risk stands as characterized above
  (structurally sound, behaviorally clean, coefficients unverifiable) and is accepted as-is; no
  further search budget planned unless a new lead surfaces. See Task 122 for the resulting concrete
  action (adding Phillips & Ingersoll as a new roughness option, since it's what's actually still in
  the manual and is fully specified with units and an applicability range).

  **Three new low-severity findings from the randomized edge-case sweep (Part C), none corrupting
  an actual displayed design result — left open for Tom to decide on follow-up, not fixed:**
  1. `mtc_`: `n_blodgett` (the reference/comparison column, not necessarily the selected n) goes
     negative whenever `da/d50 < 0.3714` — outside Blodgett's own published validity range, where
     the formula's denominator goes negative. Auto-select mode never picks Blodgett outside its
     valid range (1.5 ≤ da/d50 ≤ 185), so the actual sizing output is unaffected, but the comparison
     cell can show a nonsensical negative n.
  2. `mtc_`: the auto-sizing iteration doesn't reach its `1e-5` convergence tolerance within the
     100-iteration cap in a meaningful fraction of a realistic input sweep (~39%) — but never
     diverges (d50 stays bounded, no NaN/Infinity), just settles slightly outside its own tight
     precision target. A convergence-quality softness, not a hard bug.
  3. `mi_`: a bank region that's entirely dry (above the water surface) makes `closeRegion()`'s
     composite-n computation divide `0/0`, showing `NaN` in that region's own `n617`/`v617`/etc.
     display cells. The suite total `q_617` output stays correct (the dry region correctly
     contributes zero flow) — same defect class as the already-accepted `mpf_ dd0=0` gap, arguably
     more reachable (any low-flow case with water surface below an overbank region).

  Spot-checked and reconfirmed both minor findings from stage 2/4: `mi_`'s `n618`/`v618`/`fr618`
  dead code (confirmed via grep — genuinely never written to any DOM element or referenced in the
  PHP page) and `rc_`'s `Hp` weir-head formula misattribution (confirmed the formula is legitimate
  broad-crested-weir physics, Cd≈0.851 implied by the `1.45` coefficient, but not one of Robinson/
  Rice/Kadavy 1998's own numbered equations).


## Task 109

- 0|109| **Cross-language consistency audit (Opus, suite-wide) — DONE 2026-07-20, all 6 stages complete.** Tom, 2026-07-14: wants a
  systematic pass, not just spot-checks reacting to a specific question — motivated directly by the
  Task 18 post-close finding that Burmese had a real embedded-English defect sitting undetected
  through a full translation sprint's own self-check and this session's own initial QA pass, only
  caught because Tom asked a pointed question about one string. The gap: existing QA
  (`lang_syntax_validate.php`, tag-parity, spot-check back-translation) catches structural defects
  and can catch *sampled* meaning defects, but nothing currently does a systematic
  terminology/tone-consistency read across all 26 languages × 12 calculators looking for the
  Burmese-style failure mode (an agent leaving source-language fragments embedded, or drifting from
  a language's own established terminology elsewhere in the same file). Scope not yet finalized —
  given the size (26 × 12 is a lot of surface area for one pass), this should probably run
  **staged by calculator category**, not as one monolithic review, and each stage still needs the
  standard authorization gate before spawning Opus agents (same "propose → confirm → launch" rule as
  a translation sprint — see `CLAUDE.md` § "Translation Sprints"). Model is Opus, not Sonnet (Fable
  is unavailable — see `feedback_fable_unavailable_use_opus`), consistent with prior holistic
  cross-language passes (Task 91's category re-translation quality bar, Task 93's glossary
  reconciliation).
  **Progress 2026-07-17:** stage 1 (category 6, 62 keys × 26 languages) and stage 2 (category 1,
  63 keys × 26 languages) complete — 29 real defects found and fixed across both stages (10 in
  stage 1, 19 in stage 2); the Burmese-style embedded-English fragment failure mode itself did not
  recur, but a related pattern (transliterating "riprap" instead of translating it) surfaced
  independently in ar/km/fa/sw/my, and several languages had genuine wrong-word/register-confusion
  defects (sw "ukakamavu"=stiffness for roughness; he עיצוב "styling" vs תכן "design"; hr specific
  gravity vs. specific weight). Full detail in `dev/translation-execution-log.md` ("Task 109 —
  Cross-language consistency audit, stages 1–2").
  **PAUSED 2026-07-17 (Tom): cost — then RESUMED same day.** 52 Opus agents across two stages (26
  languages × 2 categories, plus a mid-run session-limit retry that re-ran 22 of them) was expensive
  for the defect yield — real, but a low ratio of genuine fixes per agent-run. Before resuming, Tom
  was offered four shape options (same full shape / fewer languages / fewer-larger agents / hold
  off) and chose to keep the same full 26-agent-per-category shape.
  **Stage 3 (category 2: weirs & orifices, 48 keys × 26 languages) — DONE 2026-07-17.** 30 real
  defects fixed across 10 languages (am, bn, bg, fa, he, hr, hi, my, uk, zh) + 8 more in sw (highest
  single-language count of any stage so far); 16 languages clean. One cross-cutting defect
  deliberately left unfixed (sw's "weir"=bwawa/dam confusion vs. the glossary term already used
  correctly in that file's own irr_ keys — needs a suite-wide rename decision, not a single-category
  patch); two more of the same cross-key-split class surfaced in pt and km or_/irr_ keys. Full
  detail in `dev/translation-execution-log.md` ("Stage 3").
  **PAUSED again 2026-07-17 (Tom): cost.** Same concern as the pre-stage-3 pause — real yield, but
  expensive per agent-run at this shape. Tom is choosing his own timing to resume rather than
  continuing stage-by-stage in the same session.
  **Stage 4 (category 3: `dw_`/`hw_`/`mpf_`/`mphl_`, 65 keys × 26 languages) — DONE 2026-07-18.**
  Tom authorized resuming in the same full 26-agent shape. Real defects found and fixed in 20 of 26
  languages (es/ru/zh clean); am had the heaviest defect load (head repeatedly mistranslated as
  "distress/anguish", plus friction/roughness drift). 11 of 26 first-wave agents hit a platform
  session-limit error mid-task and were individually relaunched per the session-limit retry
  procedure — confirmed some had landed partial work already (pt, sr needed no further edits) and
  others had landed nothing despite describing fixes (my, ps, sw, uk needed the full fix set).
  Post-sprint QA (`php -l` + programmatic tag-parity check across all 65×26 keys) clean. Full detail
  in `dev/translation-execution-log.md` ("Stage 4").
  **Stage 5 (category 4: `cs_`/`irr_`/`ip_`, 106 keys × 26 languages) — DONE 2026-07-19.** Tom
  authorized the same full 26-agent shape. Real defects found and fixed in 24 of 26 languages (sr,
  fa clean); ur had the heaviest load (~5 defect classes: کیلکولیٹر calculator transliteration,
  رسائی wrong-word for seepage, cs_/ip_ "reach" split between two wrong terms, ٹریپیزائیڈل
  transliteration, upstream/downstream transliteration). A platform-wide session-limit error hit
  twice — first wave (22 of 26 non-am agents) and a second wave mid-retry (11 agents) — each
  resumed individually via SendMessage (not fresh relaunches) once the reset time passed, per the
  session-limit retry procedure; `git diff`'s cs_/irr_/ip_-scoped line count per file (not raw
  mtime, which is unreliable when a prior session's uncommitted edits share the same files) was
  used to confirm which agents had already landed partial work before resuming. Three languages
  (ru, pt, uk) independently flagged the same likely-systemic issue: several `ip_` note/tooltip
  strings (`ip_worst_case_warn`, `ip_du_estimate`, `ip_notes_3_def`, `ip_q_ratio`) read as
  translations of an **older, longer English revision** that no longer matches the current,
  shortened English source — an English-source sync gap, not a per-language terminology defect;
  needs its own investigation (compare current `lib/lang.ec.en.php` prose against these keys'
  translations across all 26 languages) before any fix, not folded into this stage. `php -l` clean
  on all 26 files post-stage. Full detail in `dev/translation-execution-log.md` ("Stage 5").
  **Glossary write-back gap closed 2026-07-19/20 (Tom).** Discovered after stage 5 closed that none
  of stages 1–5 had ever fed confirmed terminology fixes back into `glossary.json` — a structural
  process gap, not a Sonnet-vs-Opus capability issue. Fixed two ways: (1) `CLAUDE.md` § "Translation
  Sprints" now has a mandatory "Glossary write-back" step in the Post-sprint QA checklist, applying
  identically to audit stages and translation sprints, with no "later" exception; (2) a dedicated
  backfill agent read the full stages 1–5 execution log and wrote every confirmed decision into
  `glossary.json` (v1.7→1.8, 55→59 terms; 7 stale glossary values corrected against what actually
  shipped, ~20 terms got dated confirmation notes) before stage 6 was authorized, per Tom's explicit
  instruction that stage 6 "needs to benefit from whatever we can give it."
  **Stage 6 (category 5: `mhp_`/`rc_`, 92 keys × 26 languages) — DONE 2026-07-20.** Tom authorized
  the same full 26-agent shape. Real defects found and fixed in 21 of 26 languages (ro, zh clean;
  ar/es/fr/etc. — see log for full breakdown); ur had the heaviest load (19 fixes: کیلکولیٹر
  calculator transliteration, پوروسٹی/گریڈیشن/یونٹ ڈسچارج/ریچ jargon transliteration, مخصوص کشش
  ثقل wrong-word for specific gravity, plus cross-calculator drift on head loss/channel/normal
  depth/default harmonized to the suite incumbent). sw and sr both had Manning-roughness/radius
  wrong-word or transliteration defects (sw "Ugumu"=hardness for roughness, "Radi"=thunder for
  radius; sr chute-stem drift брзотек→брзоток). Three separate platform failure waves hit this
  stage — two ordinary session-limit resets and one "weekly limit" (a longer, account-wide
  constraint distinct from the per-agent session limit) — plus a new failure mode on 3 agents
  (ro/uk/zh) that returned status "stopped" with no completion record (no recoverable transcript,
  possible mid-session teardown) rather than a normal limit error; all were resumed via SendMessage
  once past their reported reset times, using `git diff`'s `mhp_`/`rc_`-scoped line count per file to
  distinguish already-landed partial work from a clean redo, with the 3 no-record agents explicitly
  told to redo the full audit from scratch since no prior reasoning could be assumed to have
  survived. `php -l` clean on all 26 files post-stage. Confirmed terminology decisions (chute
  sr/ps corrections, head loss ur correction, specific gravity sw/hr flags) written back to
  `glossary.json` (v1.8→1.9) per the new mandatory rule, before this stage was declared closed. Full
  detail in `dev/translation-execution-log.md` ("Stage 6").
  **Cross-cutting issues surfaced but not fixed inline, need a coordinator decision:** (a) legacy
  inline-styled tooltip HTML (`<span title="..." style="cursor:help...">?</span>`) vs. the current
  `.ec-help`/`.ec-tip` class convention — independently flagged by 8+ languages across stages 5–6
  (de, fr, bg, ar, it, pt, ro, uk) as a suite-wide, partially-completed markup migration (only
  es/ru/zh consistently use the new pattern); (b) `mhp_diameter`'s dropped tooltip wrapper — fixed
  per-language by fa/id/hi/km/tr/ps/my but left as-is by es/de/cs/fr/it/hr/ro/sw/uk/zh on the
  reasoning that it's pre-existing suite-wide state — inconsistent treatment across agents, needs one
  suite-wide decision either way; (c) hr's specific-gravity glossary-vs-file conflict
  (specifična težina vs. shipped "Relativna gustoća") — flagged three times now (stage 1-5 backfill,
  stage 6 hr audit), still needs Tom's human reconciliation; (d) sw's specific gravity
  ("Uzito maalum" = specific weight, not density ratio) — same trap, no verified sw fix exists yet;
  (e) crest terminology split in ur (کرسٹ in irr_ vs چوٹی in rc_ sketch) — flagged for a coordinator
  call, not fixed to avoid introducing new inconsistency; (f) am's confirmed-recurring `odt_`
  ጭንቅ (head→distress) mistranslation — `odt_` (Orifice Drain Time) isn't part of any of the 6
  planned stages and needs its own future pass to actually get fixed.
  **All 6 planned stages of Task 109 are now complete.**


## Task 140

- 0|140| **[H] Get HTML out of language strings where it cannot work, and enforce it mechanically —
  DONE 2026-07-27.** Closed after evaluating steps 2-4 against what step 1 actually left behind, per
  Tom's "ship it and see" instruction. Tom's call on the close: do step 4 + the enforcement, and
  **retire step 2 permanently as superseded by step 1**.

  **The measurement that decided it.** Re-measured before touching anything, rather than trusting the
  block's own forecast:
  - **Step 2's payload was gone.** Its justification was "33 tooltips buried inside other keys as
    `title="…"` — **11 are dirty**." Re-measured: **39** such keys in English, **1053** strings across
    all 27 files, and **zero dirty** — no tags, no entities, and every embedded `title="…"` parses
    with no stray quote breaking out of the attribute. All 11 dirty ones were *entity* defects, and
    step 1 fixed them as a side effect. What remained was only *future visibility*, and that turned
    out to cost ~40 lines of validator instead of restructuring ~1050 translated strings.
  - **Rule B had exactly one thing to catch, suite-wide:** `mphl_total_junction_k_tip`, in all 27
    languages. Nothing else. Every other `_tip` key and every plain-text-bound key was already clean.
  - **No literal markup was reaching any screen.** Checked the four no-`strip_tags` attribute sites
    (`lib/Menus.lib.php:127,131,132,137`) and the JS `escapeAttr` path; every key reaching them was
    tag-free.

  **What shipped.**
  - **Step 4 — done.** `k<sub>m</sub>` → `km` in `mphl_total_junction_k_tip`, 54 replacements (2 per
    file × 27), line-scoped to that key so the same symbol in its three raw-HTML siblings
    (`mphl_total_junction_k`, `_short`, `mhp_notes_1_def`) was left alone. Zero visible change: all 6
    call sites already ran `strip_tags`, so `km` is exactly what rendered before. All 27 `php -l` clean.
  - **Step 3 — done.** `attributeBoundKeys()` (which was **dead code** — assigned and immediately
    `unset()` at the old `lang_syntax_validate.php:41-42`) became `plainTextBoundKeys()`, widened to
    scan `lib/*.php` as well as the page PHP, and to match **every** plain-text attribute
    (`title|placeholder|value|alt|aria-label|data-*`) rather than `htmlspecialchars()` alone — so it
    now sees the five non-`title` attributes the task had flagged. Added `detectPlainTextTags()`
    (Rule B), `detectEmbeddedTipDefects()` (Rule B for tooltips written inside other keys), and
    `detectNameDerivationMismatch()` (Rule C, advisory, behind `--rule-c`).
  - **Step 2 — retired, not deferred.** `detectEmbeddedTipDefects()` gives the visibility that lifting
    the tooltips was meant to give, at ~1% of the cost. Do not re-propose the lift; the reason it
    existed is gone.
  - **Step 5 — page labels and documents left alone,** as designed.

  **`strip_tags()` is deliberately NOT an exemption in Rule B.** It means the tag silently vanishes
  rather than showing literally — a degraded string, not a correct one. Making the rule strict cost
  one real fix (step 4) and left it with no exceptions to reason about, which is the same reasoning
  that made Rule A absolute.

  **Rule C earned its keep within minutes, exactly as the honest forecast predicted.** Its first run
  reported six `named-but-unconstrained` keys (`or_regime_*_tip`, `mhp_hl_*_tip`, `odt_h2_warn_tip`),
  which exposed **two real holes in the deriver**, not two false positives:
  1. **A pageConfig property name is not its `$ec_lang` key** — the page PHP drops the calculator
     prefix (`or_regime_submerged_tip` → `regime_submerged_tip`). The original deriver's comment
     asserted they were identical, so **the entire JS tip route silently resolved to nothing**. Fixed
     with `pageConfigPropertyMap()`, which reads the `prop: json_encode($ec_lang['key'])` lines out of
     the page PHP; a property defined differently on two pages is recorded as a collision and left
     unmapped rather than guessed.
  2. **A naive `/\(([^)]*)\)/` truncates at a nested paren** — `writeCheckHTML(true, hlPct.toFixed(1)
     + '%', cfg.hl_ok_tip)` stopped at `toFixed(1)`, hiding the three `mhp_hl_*_tip` keys. Fixed with
     `callArguments()`, which balances parens and splits on top-level commas only.
  After both fixes, `named-but-unconstrained` is **empty** — every `_tip` key in the suite now
  resolves to a real call site. That is the load-bearing verification: the deriver is no longer
  quietly enforcing Rule B over a set it could not see.

  **Rule C ships advisory and off by default (`--rule-c`).** 29 keys disagree on purpose — chiefly the
  16 `_main_desc` keys, which the original design already noted have two destinations at once (`<h2>`
  and the menu `title=`), so no single name fits. Leaving it on would have buried the actionable
  findings in known noise.

  **QA.** Validator `php -l` clean; default run clean of every structural category (180 findings, all
  pre-existing advisory `identical-to-english`). **Negative-tested rather than assumed** — injected a
  `<sub>` into a `_tip` key, a `<b>` inside an embedded `title=`, and a `&mdash;` inside an embedded
  `title=` in `lib/lang.ec.es.php`; all three fired with the right category and file:line, and the
  file was restored. English-drift manifest re-baselined (`detect_english_drift.php --update`, 56
  keys): **verified cosmetic before re-baselining**, by decoding entities in the pre-step-1 English
  and normalizing markup — 54 of 56 matched exactly, and the 2 that did not (`rc_apron_length`'s
  `&quot;`→curly, `template_welcome`'s `&gt;&gt;`→`»`) are precisely step 1's two documented judgment
  calls. No translation was stale, so no resync was owed.

  **A self-inflicted trap worth remembering:** writing `<?=…?>` inside a `//` comment in a PHP file
  ends PHP mode and breaks the file. The comment in `plainTextBoundKeys()` now says so.

  **Loose end extracted rather than buried (Tom's rule):** step 1 turned English's `template_welcome`
  `&gt;&gt;` into `»`, but the 26 other languages held a *literal* `>>` all along and so were never
  touched — English now showed `»` where every translation showed `>>`. Filed as **Task 148**, and
  closed the same day: Tom's answer was that the markers are not standard typography at all, so all
  27 lost them and the emphasis moved into CSS.

  **Prediction vs. outcome, kept honest.** The block forecast that Rule A "should close permanently"
  and that Rule B "will keep a residue… expect it to catch us again at least once." Rule A did close.
  Rule B's residue arrived immediately — but from the *deriver's own blind spots*, found by Rule C,
  not from a new delivery route. The forecast was right about the shape and optimistic about the
  timing.

  **Original text follows.**
  **[Original priority 60 header]** **[H] Get HTML out of language strings where it cannot work, and enforce it mechanically.**
    Design agreed with Tom 2026-07-24. **STEP 1 IS DONE (2026-07-27); steps 2-4 remain — re-judge them
    against what step 1 actually left behind, per Tom's "ship it and see" instruction.**

    **Step 1 result, 2026-07-27 (Tom authorized proceeding).** All **1204 entity occurrences across all
    27 `lib/lang.ec.*.php` files** converted to literal UTF-8; **zero entities remain** in any language
    string, and all 27 files are `php -l` clean. Rule A is now enforced hard: the validator's
    `detectAttributeEntities()` was replaced by `detectEntities()`, which flags *any* entity in *any*
    language string (no attribute-key scoping — the scoping is what made the old check miss things) and
    names the literal replacement in the error text. `lang_syntax_validate.php` is clean of every
    structural category; the 180 remaining findings are all pre-existing advisory
    `identical-to-english` warnings.
    - **`$ec_lang_intent` was never touched** — checked first, and it contained no entities at all, so
      step 1 needed no permission against the off-limits rule.
    - **The four HTML-syntax escapes needed judgment, not blind conversion,** and the roadmap's
      "~12 distinct characters" forecast did not cover them. `&lt;`/`&gt;`/`&amp;` turned out to be
      **always followed by a space** in all 27 files (verified before converting, not assumed), so the
      literal `<`/`>`/`&` is unambiguous to the HTML parser — no fake tags, no ambiguous ampersand.
      `&gt;&gt;`/`&lt;&lt;` in `template_welcome` became `»`/`«`. The 41 `&quot;` are all one key
      (`rc_apron_length`, the Robinson quotation) and became curly `“ ”`, which is both typographically
      right and safe inside the `title="…"` they live in — a literal `"` there would have terminated
      the attribute. One genuine edge case: `sr` had already used its native opening `„` and escaped
      only the closer, and `“` *is* the correct Serbian closing quote, so it landed right.
    - **Confirmed the fix on the paths that were actually broken**, not just the file contents: the
      menu `title=` path (`Menus.lib.php`, `ENT_QUOTES`) now renders `Pond, Basin, or Tank Drain Time —
      …` instead of a doubled `&mdash;`. Conversely `ip_main_title`'s literal `&` now arrives in a meta
      attribute as a correctly single-escaped `&amp;` — which is the whole point of the rule.
    - Entities still present in *rendered* output (`&copy;`, `&ndash;`, `&iacute;`) are hardcoded in
      `lib/HeadersFooters.lib.php` and per-page SEO meta tags, **not** language strings — out of Rule
      A's scope by design. Worth a decision later whether Rule A should grow to cover them.
    - **Prediction to check against:** the honest forecast below says Rule A "should close permanently."
      Step 1 cost far less than the block implies — the risk was concentrated entirely in the ~150
      syntax escapes, not the ~1050 typographic ones. Step 2 (lifting the 33 embedded tooltips) is the
      load-bearing step and is still untouched.

    Original design notes follow — read the whole block before acting on steps 2-4.
    **Start with step 1 alone — a plain entity-cleanup pass (Tom, 2026-07-27).** The evidence now says
    this is a historical mess, not an ongoing discipline failure, so do the cheap mechanical fix first
    and re-judge the rest afterward. Full reasoning under "Do step 1 first" below.

    **The problem in one sentence.** A language string's HTML is sometimes fine and sometimes silently
    broken, and *which one depends on the PHP/JS call site that consumes it*, not on anything visible
    in the string — so the same string is correct in one place and wrong in another, with no error.

    **The two things that break, and why.**
    1. *Entities* (`&mdash;` `&asymp;` `&sup2;` …). An entity in an HTML attribute is decoded by the
       browser and renders fine — Tom verified in Chrome, and the spec agrees. It breaks only when the
       string passes through something that escapes `&` first. This suite has three attribute paths and
       **two of them break entities**: raw echo (`lib/Menus.lib.php:91`) works;
       `htmlspecialchars(strip_tags())` (`Branched-Network.php:56`) breaks; `escapeAttr`
       (`js/Calculators.lib.js:406`) breaks. Both broken paths turn `&asymp;` into a literal
       `&asymp;` on screen. Proof that entities are an unnecessary habit, not a need:
       `dw_kinematic_viscosity` contains literal `×`, `⁻⁶`, `²`, `°` **and** an entity `&nu;` in the
       same string — the literal form was already working right beside it.
    2. *Tags* in an attribute. `title=`/`placeholder=`/`value=` hold plain text only; `<sub>` in a
       `title` never renders as a subscript by any delivery route. Confirmed by Tom.

    **Decisions already settled — do not relitigate.**
    - Unicode subscripts **rejected** as a replacement for `<sub>`. Unicode has no subscript `c f w d g`,
      **no capitals**, and no multi-letter forms — so `h_f` (most-used symbol in the suite), `C_d`,
      `P_w`, `h_L`, `q_out`, `q_avg,field` are unwritable. ~66 of 177 subscript occurrences fail.
      Mixing Unicode and markup also renders at visibly different sizes.
    - Placeholder/symbol-table refactor **rejected** (it was proposed, then withdrawn as solving a
      problem we can decline to have).
    - Document keys (`about_body_html` 2691 chars, `irr_quickref_html`, the 30 keys >300 chars)
      **keep their HTML** — Tom: they are only ever echoed raw by PHP, never read into JS or an
      attribute, so their context is safe. Page labels keep `<sub>` too.
    - `mphl_total_junction_k_tip` degrades acceptably to `km` — Tom confirmed.

    **The three rules.**
    - **Rule A — no `&...;` in any language string.** All 564 keys × 27 files, no exceptions. Absolute
      *because* scoping requires judgment, and the previous check failed precisely by scoping itself to
      "tip keys" (see `detectAttributeEntities()` in `dev/scripts/lang_syntax_validate.php`).
    - **Rule B — no `<...>` in any plain-text-constrained string.** Constrained = named `_tip`/`_plain`
      **or** found by a deriver inside any `attr="..."`.
    - **Rule C (advisory, reports only)** — the name and the derivation must agree; report both
      "reaches an attribute but isn't named" and "named but only used in page HTML".

    **Naming convention.** Suffix `_plain` (**not** `_attrib` — rejected: it names the *destination*,
    but 16 `_main_desc` keys have two destinations at once, `<h2>` **and** the menu `title=`;
    and "attribute" is overloaded with the GIS/data-field sense). `_plain` names *what the string may
    contain*, which is single-valued: the strictest destination wins. `_tip` stays as an established
    special case of `_plain` (33 keys, 32 already compliant).
    **The name is a hint, never the enforcement** — a name is a claim, the code is the fact. Derivation
    enforces; the name covers what derivation can't see statically (a string assembled in PHP then
    passed to an attribute).

    **Measured scope (2026-07-24, read-only). Re-run any time with
    `php dev/scripts/measure_lang_sinks.php` — it reproduces every number below.**
    - Reference sites by destination: `raw-html` 670, `attr-escaped` 37, `attr-RAW` 16, pageConfig
      (`json_encode`→JS) 62 keys. **93% of sites are raw-html, where everything works** — which is why
      the habit never got punished and kept recurring.
    - 134 English keys carry markup (`sub` 84, `span+sub` 19, `span` 18, `a` 8, `br` 3, `sup` 2).
    - 55 English keys carry entities; ~1200 entity occurrences across all 27 files.
    - **33 tooltips have their own `_tip` key — 1 is dirty. 33 more tooltips are buried inside other
      keys as `title="…"` written into the middle of a label — 11 are dirty.** That 1-vs-11 contrast is
      the core finding: a tooltip with its own name gets treated as tooltip text and stays clean; a
      tooltip embedded in page HTML picks up page-HTML habits. Half the suite's tooltips are currently
      invisible to any checker.
    - Already-existing non-`title` plain-text attributes holding lang strings (5): `placeholder`
      (`lib/Calculators.lib.php:67,68`, `lib/Menus.lib.php:131`), `value` (`contact.php:55`),
      `data-copied-text` (`lib/Menus.lib.php:137`). **This is why the deriver must scan every
      `attr="…"`, not just `title=`.**
    - Four different escaping conventions are already in use across call sites (raw,
      `htmlspecialchars`, `htmlspecialchars(strip_tags())`, `ENT_QUOTES` at `lib/Menus.lib.php:127`).

    **Evidence from the Task 137 sprint, 2026-07-27 — Rule A is cheap to hold at write time.** The
    sprint brief told all 26 translation agents, in one line, "never emit HTML entities, use literal
    UTF-8" and "preserve all markup exactly — same tags, same count as English." Result across 26
    languages × 6 real strings: **zero entity findings and zero tag-parity failures**, checked
    independently rather than taken from the agents' self-reports. Two agents also correctly declined
    to translate numeric/bibliographic strings (`2.54–2.82 (Robinson)`) and real cognates (`laminar`,
    `Circular`) after being told a value equal to English is not automatically a missing translation.
    **Reading:** entities are a habit acquired from *editing existing strings*, not something writers
    reach for unprompted — when the rule is stated at the moment of writing, it costs one sentence and
    holds. That supports Rule A being absolute (step 1) and argues the expensive part of this task is
    the historical cleanup and the deriver, not the ongoing discipline.

    **Do step 1 first, on its own, as a plain cleanup pass (Tom, 2026-07-27).** Given the sprint
    evidence above — the problem looks *historical* rather than ongoing — the right first move is the
    simple mechanical cleanup, not the deriver and not the architecture. Convert the entities, turn
    Rule A on, ship it, and see what is actually left. **Do not bundle steps 2-4 into that pass**;
    step 1 is independent by design and its value does not depend on the rest of this task ever being
    done. If the historical reading is right, step 1 plus Rule A removes most of the recurring pain for
    a fraction of the effort, and what remains can be judged with real evidence instead of forecast.

    **Steps, in order.**
    1. Convert all `&...;` to literal UTF-8 characters; turn Rule A on hard. English needs ~12 distinct
       characters (`— × ÷ ≈ ≤ ≥ √ ² ν τ Δ –`); the check should name the replacement in its error text.
       Independent of every step below. **This is the sanctioned starting point — see the note above.**
    2. Lift the 33 embedded tooltips into their own `_tip` keys, fixing the 11 dirty ones. **Tom agreed
       the existing translations are extracted mechanically** from inside the label strings across all
       27 files (they are already translated, just trapped) — not left empty for a future sprint.
       This is the load-bearing step: it is what makes tooltip content visible to any check at all.
    3. Build the deriver + Rules B and C into `dev/scripts/lang_syntax_validate.php`.
       **Partly built already — do not start from scratch.** Commit `3f9b3de` added
       `attributeBoundKeys()`, which derives attribute-bound keys from the app source (PHP
       `htmlspecialchars()`/`strip_tags()` labels, and JS tip properties / `writeCheckHTML()` 3rd
       argument). What remains: it matches `htmlspecialchars(...)` and JS tip paths only, so it does
       **not** see the five non-`title` plain-text attributes listed above — widen it to scan every
       `attr="..."`, then add Rule B (tags) and Rule C (name-vs-derivation disagreement) on top.
    4. Fix `mphl_total_junction_k_tip` (drop the `<sub>`; 6 call sites).
    5. Leave page labels and documents alone.

    **Honest forecast (told to Tom, keep it honest).** Rule A should close permanently — it is absolute
    and mechanical with no case to reason about. Rule B will keep a residue: the deriver sees
    `attr="<?=$ec_lang['x']?>"` but will miss a string assembled in PHP first, or a delivery route not
    yet imagined. Expect it to catch us again at least once. Tom's stated expectation is that the
    problem will not fully end; that expectation is reasonable and already earned its keep once — it is
    what prompted the grep that found the 5 non-`title` attributes above.

    **Execution: commit direct to `master`, one step per commit (Tom, 2026-07-24 — this project does
    not normally use branches; an earlier draft of this task proposed branches and was wrong).**
    Steps 1 and 2 are mass mechanical edits across all 27 `lib/lang.ec.*.php` files (~1200 entity
    replacements; 33 tooltips restructured). Keep each step its own commit so either can be reverted
    cleanly, and run `php dev/scripts/lang_syntax_validate.php` plus a visual spot-check before
    committing.

    **The real constraint is sequencing, not version control.** `lib/lang.ec.*.php` is also the surface
    every translation sprint writes to, so:
    - Never run step 1 or step 2 concurrently with a translation sprint, and never run both at once.
    - If a sprint is queued, run the sprint first — sprint output is judgment work that is expensive to
      redo, while these mechanical passes are cheap to re-run against whatever the files then contain.


## Task 146.01

- 0|146.01|[CC] **Draggable data labels on leaders + collision avoidance + background mask —
  DONE 2026-07-30.** A node's id/elev/demand/... label and a link's id/diameter/length/... label
  (previously fixed at a hardcoded +2,-2 offset) now carry an optional `n.lx/n.ly` (or `l.lx/l.ly`)
  drag offset, persisted like any other property (`js/looped-network.js`). Dragging past
  `LABEL_LEADER_THRESHOLD` (4 world units) from the anchor draws a leader line
  (`updateDataLeader()`); a manually-dragged label is exempt from further movement.
  `runLabelCollisionAvoidance()` runs every `refreshLabelText()` pass, nudging any two overlapping
  AUTO-placed labels (node, link) apart along the axis of least overlap — a manually-dragged label
  still blocks others but never moves itself. Every label (node, link, and the existing Text tool
  label) now renders a `.lpn-lbl-mask` rect behind its text (`positionMaskRect()`) so it stays
  legible over the backdrop image or another element. Click-to-open-popup now also works from a
  data label itself (`data-nodelbl`/`data-linklbl`), not just the node/link symbol.
  **Two real bugs found and fixed during this work, not just new code:** (1) `repositionMultilineText()`
  assumed every child of a label `<text>` was an element (tspan) with `setAttribute` — true once
  `setMultilineText()` has run, but NOT for a freshly built node/link label, which starts as a plain
  `textContent` text node; it now skips non-element children. (2) A node/link label's visible glyphs
  live in `<tspan>` children, so a hit-test (`e.target` on pointerdown, or `elementFromPoint()` on
  click) lands on the tspan, which carries none of the parent `<text>`'s `data-nodelbl`/
  `data-linklbl` attribute — drag/click detection silently no-op'd. Fixed with a shared
  `resolveLabelHit()` that walks a tspan hit up to its parent `<text>` first, applied at both
  hit-test sites. Verified with a headless Playwright drag (offset changed, leader appeared, mask
  rect present) plus a screenshot, not just static reading.

  **Four follow-on fixes from Tom's first real review of the shipped feature, same day:**
  (1) *Empty ghost mask.* A reservoir/pump toggled to show only fields it doesn't have (e.g. a
  reservoir with Demand/Elevation checked but ID/Head off) produced a floating mask with nothing in
  it — the empty-placeholder line (`{text:''}`, kept so `getBBox()` never throws) still got a mask
  and, if dragged/nudged far enough, a leader. `ne.empty`/`le.empty`, captured in
  `refreshLabelText()` right before the placeholder is pushed, now skips both (`hideMask()`,
  `updateDataLeader()`) and excludes the label from collision-avoidance entirely.
  (2) *Mask draw order.* Masks were appended into `nodesLayer`/`linksLayer` alongside the symbol
  they belonged to, so a later-built node's mask painted OVER an earlier node's already-placed
  label text whenever they overlapped — draw order tracked creation order, not "masks above every
  element, text on top" as intended. Fixed with one new shared layer, `maskLayer` (between
  `nodesLayer` and `labelsLayer`): every mask (node, link, AND the Text tool's) now lives there
  regardless of type or creation order, and every label's text+leader (node, link) now lives in
  `labelsLayer` alongside the Text tool's, so ticks/text/leaders all render above all masks. Extrema
  ticks (`applyExtremaTicks()`) moved from `nodesLayer`/`linksLayer` to `labelsLayer` with them —
  they decorate the text, so they'd have been silently hidden under `maskLayer` otherwise.
  (3) *Leader jump rule.* A node/link label's leader always ran to the label's LEFT edge regardless
  of drag direction, so dragging a label to the left of its anchor drew the leader straight through
  the text. `updateDataLeader()` now carries the same side-flip hysteresis a Text label's leader
  already had (`ADVERSE_FRAC`), generalized to a left-anchored (not centered) box: it tracks a
  persistent `holder.side` and flips which edge the leader attaches to once the label's box center
  crosses the same 75%-past-center trigger.
  (4) *Node label order.* Reordered ID, Demand, Head, Pressure, Elevation (was ID, Elevation,
  Demand, Head, Pressure) — Tom, thinking physically: demand is the design input, head/pressure are
  what the solve produces from it, elevation trails. Reordered in three places that must agree:
  `refreshLabelText()`'s node loop, `nodeFieldDefs()` (drives both the Labels popover checkboxes and
  the on-map legend).
  Also in this pass: a pump's Velocity is meaningless (no diameter, so `js/lpn-solver.js` can only
  fall back to 0) and is now suppressed in the property popup, the data-label toggle, and the
  velocity extrema — Tom caught this asking "how can a pump have a velocity if it has no diameter?".
  Confirmed Node/Link label settings already correctly apply to Reservoir/Pump wherever the field is
  physically meaningful (ID/Head for a reservoir; ID/Flow/Head-gain for a pump) and are already
  excluded where it isn't (Elevation/Demand for a reservoir; Diameter/Length/Velocity for a pump) —
  no design change needed there, just the Velocity bug above.
  **Superseded in two places by Task 179 (2026-07-30):** a reservoir now HAS an elevation and a
  pressure (so both apply to it), and "Head gain" no longer exists as a field. The
  per-label collision WEIGHTS added in this pass (`link: 0.5, node: 1`) were a misreading and are
  replaced there by per-OBSTACLE strengths — pipes 0, nodes 0.5, labels and leaders 1.


## Task 179

- 0|179|[CC] **Tom's second review round on `lpn_`: reservoir-as-tank, head gain removed, pump
  secrets squashed, collision strengths corrected, curve table headed — DONE 2026-07-30.** Five
  pieces of test feedback, three of which reverse decisions made the day before. Recorded here
  because the reversed decisions are written up as settled in Tasks 176 and 146.01, which are closed
  blocks nobody re-reads.
  1. **A Reservoir is also a Tank.** It now carries an **Elevation as well as a Head**, and the head
     is **blank by default, meaning "same as the elevation"** (`reservoirHead()` in
     `js/looped-network.js` is the single place that resolves it; the popup field shows the elevation
     as its placeholder). Blank is stored as `undefined` rather than as a copy, so the two stay
     linked — moving the reservoir's elevation moves its water surface with it until the user takes
     control by typing a head. A reservoir's **pressure** is therefore now a real number
     (head − elevation, `js/lpn-solver.js`'s report), zero only in the default case, and reservoirs
     now participate in the Elevation and Pressure map labels and extrema. Networks saved before
     this get `elev = head` on load, which reproduces their old behavior exactly (same fixed head,
     zero pressure) rather than reinterpreting them as tanks standing on datum.
  2. **"Head gain" is gone as a separate quantity** (Tom: "I don't think we need a separate Head
     Gain. Negative head loss is fine."). This **reverses Task 176's item 2**, which had split
     `headgain` into its own field, color, checkbox, legend row, and extrema bucket. A pump's
     contribution is a **negative head loss**, reported under the same label, color, and extrema as
     every other link. `lpn_result_headgain` deleted from `lib/lang.ec.en.php` and the pageConfig.
     (The 176 split was not wrong about the *symptom* — a pump's gain swamping a pipe's fractional
     loss on one shared min/max scale — but the answer was one field with a sign, not two fields.)
  3. **The pump "loss" bug was a hidden curve, and nothing else** (Tom: "You got completely
     distracted… just squash the secrets"). `addLink()` had been giving every new pump an invisible
     150 gpm / 65 ft design point, so a pump silently delivered head the user never entered and then
     behaved strangely once demand ran past that unseen curve. **A new pump now has no curve at
     all** and neither adds nor loses head until one is typed in (`recomputePumpCurve()` sets
     `h0 = a = 0`; `js/lpn-solver.js`'s pump branch gained an explicit no-curve case using the same
     `gradMin` gradient floor the pipe branch already had, so a curveless pump solves as a plain
     lossless connection instead of dividing by zero). That case is checked BEFORE the existing
     "a pump pushed backwards is treated as closed" guard, which matters: with no curve and zero net
     demand the flow settles around 1e-10 and wanders negative, and that guard's near-zero
     `G = 1e-8` then floated the downstream junction 0.1 ft off the reservoir's head for no physical
     reason. Without a curve there is no backwards to guard against. The Example network sets its pump's curve **explicitly**, as document content visible in
     the popup, alongside the elevations and demands it already pre-fills. The
     `pump-beyond-curve` diagnostic added the same day is **reverted entirely** — solver check,
     status-line plumbing, and the `lpn_diag_pump_beyond_curve` string. With the curve no longer a
     secret, a negative head at over-demand is simply the honest number the entered curve gives.
     Verified numerically: curveless pump converges with 0.000 ft loss and full pass-through flow;
     the 150/65 curve gives −77.04 ft (i.e. 77 ft of gain) at 100 gpm and +67.41 ft at 400 gpm, no
     issues raised.
  4. **Collision-avoidance strengths corrected to the ones Tom had already given: pipes 0, nodes
     0.5, labels and leaders 1.** This **reverses the `LPN_LABEL_WEIGHT = {link: 0.5, node: 1}` cut**
     in Task 146.01's follow-on, which misread the instruction as "node labels resist harder than
     link labels." Node and link data labels are the same kind of object and now carry the same
     strength. The strengths are **per obstacle, not per label type**, so obeying them meant the
     pass had to start seeing objects it never had: it previously compared label boxes against label
     boxes only. `runLabelCollisionAvoidance()` now also pushes a data label off **node symbols**
     (0.5), **Text labels** (1), and **leader lines** (1) — leaders sampled into a chain of small
     boxes (`pushLeaderSamples()`) so one overlap/push routine handles every obstacle, and rebuilt
     each iteration because a leader follows its own label. A leader is exempt from its own label
     (`owner`), or it would push it a little farther away forever. **Pipes are absent by design**,
     not present with a zero — a number sitting on a pipe still reads fine. Only data labels move;
     everything else is immovable, so the pair loop now runs over labels × everything instead of
     everything × everything.
  5. **The pump curve entry is a real table with real headings** (Flow, Head), `.lpn-curve-table` in
     `css/engcalcs.css`. The point rows had been two unlabelled number boxes whose only clue as to
     which was which lived in a `title=` tooltip — invisible on touch.
  **One unrelated bug fixed in passing:** `loadFromStorage()` merged `labelSettings` with a
  top-level `Object.assign`, which swaps in the saved `{node:…}`/`{link:…}` sub-objects whole — so
  any toggle added after a user's last save (`gradient`, and every future one) came back `undefined`
  instead of at its default. The comment above it already explained why that is wrong; the merge
  just needed to go one level deeper.


## Task 193

- 0|193|[CC] **`lpn_` English tightening pass — DONE 2026-07-31.** The English-reform gate applied
  before the 146.06 sprint, so each fix is paid for once rather than 26 times. Commits: the source
  pass, then the trap-term tips and glossary seed. Every `lpn_` key was reviewed; 51 changed.
  - **Two things the page was asserting that had stopped being true.** `lpn_notes_3_def` still said
    "One network is saved automatically" after 146.08 shipped a multi-project library, and
    `lpn_notes_4_def` still listed "saving" as planned. Both rewritten — and notes_3 now names the
    two REAL failure modes (clearing browser data; no file export yet) instead of a vague "no
    guarantee", which is the honest form of the same warning and stays true until Task 195.
  - **Structural translation hazards, which are the ones a translator cannot route around.**
    `lpn_pump_curve_ref_note` was string concatenation (`'…for pump ' + id + '.'`) — now a `{id}`
    placeholder, matching `mpf_solver_no_solution`'s `{qmax}`. `lpn_empty_hint` quoted another
    key's value ("Draw example network"), which only renders correctly if two independent
    translations happen to match. `'Length/Map'` and `'Elevation/Head'` sat in a row of unit
    dropdowns where a slash reads as a ratio unit.
  - **Two judgment calls worth Tom's veto, both flagged in the commit message.** (1) `lpn_field_km`
    carried the symbol as the bare letters **"km"** — kilometres, in a calculator whose lengths are
    in metres. Now `k`, which is what `lpn_field_km_short` already said. (2) "Push defaults to all
    elements" → **"Apply"**. "Push" is computing-idiomatic and a polysemy trap (press vs shove);
    the `lpn_push_*` key names are unchanged, so this is wording only.
  - **"Backdrop" → "Background image" everywhere it faces the user.** A theater loanword with real
    transliteration risk, replaced by two ordinary composable words — which is what the scope doc
    calls the thing anyway ("a user-supplied image"). Key names stay `lpn_backdrop_*`.
  - **Ten definitional tips on the input labels**, per the polysemy/units-trap protocol: elevation,
    head (input and result), demand, roughness, length, minor loss k, head loss gradient,
    convergence tolerance, map height. Two of them fix a defect rather than just explaining:
    **Roughness never said it was Hazen-Williams C** (`assembleModel()` hardcodes HW, so a Manning
    n of 0.013 typed there produced nonsense silently), and **Map height never said the phone cap
    is a render cap, not a stored value** — 146.08's own note predicted that would read as ignored.
    Demand gets `lpn_demand_tip` rather than borrowing `bpn_demand_tip`, whose "at this line's
    downstream end" is branched-network wording and false here.
  - **Mechanism:** `setFieldLabel()` builds the whole-label `.ec-help` wrapper with the nested
    `.ec-tip` glyph, and `clearFields()` disposes Bootstrap tooltip instances before wiping a
    popup — an OPEN tooltip lives in `document.body`, not in the popup, so a plain `innerHTML = ''`
    would strand it on screen with nothing to close it. Popup fields are built long after
    `DOMContentLoaded`, so each renderer ends with `EngCalcs.initTips(fields)`.
  - **Ten glossary entries seeded** with `avoid` arrays and empty translations: draw (a diagram),
    junction, reservoir, node, link, vertex, background image, pump curve, project (saved network),
    scenario. Empty on purpose — the entry exists to carry its guard into the sprint prompts, not
    to assert a translation nobody has made. `dev/scripts/list_trap_terms.php` picks them up with
    no second list to maintain. "draw" is the one the scope doc had already called for by name.
  - **Verified by harness, not inspection** — `dev/lpn-spike/popup-tips-harness.js`, kept in the
    repo. 25 checks: the `.ec-help`/`.ec-tip` nesting, tooltip disposal, every `lpn_` key
    referenced by JS or PHP existing in `lang.ec.en.php`, the `{id}` substitution, a four-node
    looped solve through `effective()`, and — the part unit tests miss — rendering the real node
    and link popups and reading the tips back off them, which is where a mis-threaded argument
    hides. The first run of that last check FAILED on a stale-node count, and the cause was the
    harness's own `innerHTML` stub being a plain data property; a `defineProperty` setter that
    really detaches children fixed it. Worth recording because that same stub had made "clearFields
    empties the container" a vacuous pass.
  - **The three reset controls, named as a set (Tom, 2026-07-31, in review of this pass).** Tom
    rejected "Erase all saved data" as not descriptive and asked whether it was simply "Restore
    defaults" plus "Clear project" — i.e. whether the button was redundant and could be replaced by
    a hint. **It is not, and the reason is 146.08.** `wipeAllStorage()` removes `lpn_index`, the
    legacy `lpn_document`, and every `lpn_project_*` key; Clear project blanks only the OPEN
    project, and Restore defaults resets only that same project's settings (settings are stored per
    project). Clear + Restore therefore leaves every OTHER saved project intact, each with its own
    network, image and settings. **The equivalence Tom described was exactly true before the library
    shipped** — one document meant one project — which is why the intuition was sound and the
    conclusion wrong.
    - That diagnosis is what fixed the name. The button is **the only library-scoped control on the
      page**, sitting in a panel where everything else is project-scoped — which is why "Restore",
      "Reset", "Clear" and "clean state" all sounded wrong: they read as project-scoped because
      their neighbours are. The distinguishing word is **projects**, plural.
    - `lpn_settings_wipe_btn` → **"Clear calculator"** (Tom, 2026-08-03, *"Given the cookie…"*).
      It was briefly "Delete all projects", which was right while the button only reached the
      library — but once `wipeAllStorage()` also expires the unit cookie, that name **understates**
      a control that clears settings and unit choices too. "Clear project" / "Clear calculator" then
      reads as a legible scale: same verb, two scopes. The earlier worry that a destructive button
      must not look like a sibling of a safe one still holds, but it was aimed at "Restore
      defaults" — a different *kind* of action — not at the other Clear, which genuinely is the same
      kind at a smaller scope. Kept in Settings beside Restore all settings rather than moved to the
      Projects panel, since it is no longer projects-only. `lpn_confirm_wipe` and
      `lpn_reset_all_tip` both name the unit choices now.
    - `lpn_settings_restore_btn` →
      **"Restore all settings"** (was the objectless "Restore defaults" — defaults of *what*?).
      `lpn_tool_clear` **stays "Clear project"**, and the reason took two passes to get right.
      - Tom's summary called it "Delete this project", and when told it "empties rather than
        removes" he pushed back correctly: *"There is no difference between a Delete and a good
        clear, is there?"* — since `clearNetwork()` blanks the name too, a cleared project is
        indistinguishable from a fresh one. The lingering index row is a weak answer.
      - **The real difference is navigation, not residue.** `deleteProject()`
        (`js/looped-network.js:2037`) removes the key, drops the library to N−1, and then **opens
        the most recently updated survivor** — a different network appears on screen. Clear leaves
        you where you were, on an empty canvas. **With exactly one project in the library the two
        genuinely are equivalent** (Delete falls through to `newProject()`; the only residue is a
        project ID nothing in the UI exposes), so Tom's instinct was right in the case he was
        picturing and inverts as soon as a second project exists — which is the case the library
        was built for.
      - Two behaviours that differ in *where you end up* should not share a verb, so Clear keeps its
        name. Flagged rather than silently applied.
      - **Deleting the OPEN project now says where you landed** (Tom, 2026-08-03: *"It's okay for it
        not to warn that you will land elsewhere. We can fix the status bar to say where you
        landed."*). No pre-warning — the alarm is "a network I did not ask for just appeared", and
        that is answered by narration after the fact, not by a dialog before it. Two keys with
        placeholders: `lpn_status_deleted_opened` (`{deleted}`/`{opened}`) and
        `lpn_status_deleted_empty`.
      - **The status bar has two writers, and the naive version loses to the other one.**
        `runSolve()` owns it for diagnostics and rewrites it on a 300 ms debounce after every
        mutation — *including the empty string on a clean solve* — and `refreshAllFromDocument()`
        blanks it as well. A plain `setStatus()` notice would therefore vanish ~300 ms after
        appearing. **Correction (Tom, 2026-08-03): 300 ms is nowhere near long enough for a human to
        read anything** — this sentence originally called it "long enough to look like it worked",
        which is wrong. Reading a short sentence takes 1–2 seconds; 300 ms registers as a flicker
        you would dismiss as a repaint, if you caught it at all. That makes the bug *worse*, not
        milder: the message never gets read, and a hand test shows nothing convincing either way.
        The 8 s notice timer is sized for reading, not for the debounce. The split
        now: **a non-empty status supersedes a notice and discards it** (a live "Add a reservoir"
        outranks a report of a finished action); **an empty status falls back to the notice**
        instead of blanking the bar, which is what lets it survive the clean solve that the
        triggering command itself caused; an 8 s timer expires it either way. Harness pins all
        three behaviours, including that a superseded notice does not come back.
      - Deleting a NON-open project narrates nothing and switches nothing — the common case stays
        silent.
    - **Three scoped tips — after one shared tip shipped and turned out to be FALSE.** The first
      version was a single key on all three buttons: "…Used together they leave this calculator
      exactly as a first-time visitor finds it." Tom tested the claim (*"Is that correct? Is that
      something we can say in tips?"*) and it is not: **`settings` and `labelSettings` live INSIDE
      each project document** (`serializeProject()`), so deleting every project deletes every
      setting too. **"Delete all projects" alone is the full reset** — which `init()`'s own comment
      had said all along ("strictly more destructive than New/Clear (content only) or Restore
      defaults (preferences only)"). The shared tip had to describe all three scopes and got one
      wrong; three tips can only be wrong about themselves. **Key economy is not worth a false
      statement** — that is the durable lesson, not the specific wording.
    - No tip quotes another button's label (the cross-key dependency `lpn_empty_hint` was fixed for),
      and the harness asserts both that and the absence of any "used together" claim, so neither can
      come back by a later edit.
    - **The claim was also not true for a second reason, now fixed.** "Reloads the page exactly as a
      first-time visitor sees it" ignored the suite cookie: `Looped-Network.php` calls
      `echoCookieScript()`, and `echoUnitSelect()` hardcodes `onchange="EngCalcs.submitForm()"`, so
      the seven unit dropdowns round-trip through a cookie that no amount of localStorage wiping
      reaches — a visitor who had switched to SI came back to SI. `wipeAllStorage()` now also calls
      `EngCalcs.expireCookie()`. This made the button's **pre-existing** confirm text true for the
      first time; the text was not new in this pass, only re-read. A stale comment in
      `clearNetwork()` asserting "a cookie this page never uses" was corrected in the same edit.
    - **On wording: "new machine state" was not adopted.** "Machine" reads as a mechanical device in
      several of the 26, and the page already says "first-time visitor" in `init()`'s comment and in
      the confirm text. Consistency beat novelty.
    - `lpn_confirm_restore_defaults` gained one clause the panel never admitted: "Settings belong to
      the open project, so your other projects keep their own." That is 146.08's per-project-settings
      open question surfacing in the UI for the first time.
  - **Called substantially complete 2026-08-03 (Tom), with one deferred verification.** Re-test the
    `lpn_` strings and the three reset controls **once Task 195 (local save) is done** — 195 changes
    what is true about persistence, which is exactly what `lpn_notes_3_def`, `lpn_notes_4_def` and
    `lpn_reset_all_tip` assert. None of this pass has been seen in a browser by anyone.
  - **One sequencing note, left open deliberately.** This pass ran BEFORE Task 146.02 (the
    EPANET-style icon toolbar), which is priority 95, also blocks 146.06, and will change toolbar
    strings — so 193's own "do it once the string set has stopped moving" is not strictly satisfied.
    That is not a reason to hold 193 open: everything above is real regardless of what the toolbar
    looks like. What it means is that **146.02 owes a short 193-style re-read of whatever strings it
    adds or renames, before 146.06 launches** — a paragraph of work, not a repeat of this pass.

## Task 146.08

- 0|146.08|[CC] **Multiple named saved networks (Task 146 child).** Local save/retrieve so a user can
  rotate among several `lpn_` projects. This is the real need behind the scope doc's old
  `.inp` export/import item — Tom confirmed 2026-07-29 that true EPANET `.inp` file interop is not
  needed right now, only local multi-project storage.
  **Ships the project container from day one** — see Task 184 for the full delta/scenario model this
  must not foreclose. What that means concretely here:
  - **The v2 storage shape from Task 184**, with Base as the only scenario and no scenario UI. The
    migration from today's single `lpn_document` is a wrap, so there is never a second migration.
  - **The `effective(el, prop)` resolver seam**, built now even though every lookup falls through to
    the element. This is the part that makes scenarios purely additive later; the JSON wrapper alone
    is not.
  - **One localStorage key per project** (`lpn_project_<id>`) plus a small index key, rather than one
    blob — so autosave rewrites only the open project, and one large backdrop image cannot take the
    whole library down with a single quota error.
  - ~~"Create scenario geometry variant" and the "Compare with base ID" field land here~~ —
    **MOVED to Task 201 on 2026-08-03.** Both are unobservable with Base as the only scenario, so
    they were never buildable inside this task's scope. See the note at the head of the BUILT block.

  **BUILT 2026-07-30 (steps 1–3 of 3) — and CLOSED 2026-08-03, priority → 0.** Tom asked whether the
  two remaining bullets were real work or leftover test scaffolding, and proposed raising this task
  to 80. They are real (they come from Task 184), but they are **not buildable here**: "Create
  scenario geometry variant" clones an element and sets it active in one scenario only, and
  "Compare with base ID" groups alternatives ACROSS scenarios — with Base as the only scenario both
  are no-ops the user cannot observe. Priority 80 would have put a near-top task on the board with
  nothing useful to build. Moved to **Task 184**, which owns the scenario UI they depend on, per this
  project's own rule that unbuilt work is extracted to its own task rather than left in a closed
  block that nobody re-scans. Easy to reverse if Tom disagrees — the bullets are verbatim.
  - **Step 1 — v2 container.** `project`/`scenarios` module state with Base as the only scenario,
    the `LPN_OVERRIDABLE` whitelist, and a v1→v2 migration that is a pure wrap. Structural guarantees
    (exactly one Base, `activeScenario` names a real scenario, Base's overrides stay empty) are
    *restored* at load, not trusted.
  - **Step 2 — the resolver seam, done as a RENAME** (Tom's addition, and the whole safety story):
    the element stores `_diameter` and every read goes through `effective(l, 'diameter')`. With one
    scenario the resolver is a pure passthrough, so a missed call site is invisible and no test can
    fail — the rename makes it `undefined` immediately instead. It earned its keep at once:
    `assembleModel()` was passing `doc.links` straight to the solver, which under a passthrough
    resolver would have read as working forever.
  - **Step 3 — the library.** `lpn_project_<id>` per project plus an `lpn_index` cache, a one-time
    MOVE (not copy) of the legacy `lpn_document`, and a Projects panel (open / rename / delete / new)
    whose toolbar button also names the open project. The index is repaired from the real project
    keys on every load, in both directions, so a quota failure between the two writes cannot hide a
    project or advertise a missing one. Quota failure now surfaces in the status bar instead of
    being silently swallowed — a silent swallow was tolerable for one document and is not for a
    library.
  - **Open question left deliberately: `settings`/`labelSettings` are stored PER PROJECT** (they
    always were — they live in the same document), so opening another project also swaps text size,
    map height and legend position, not just ID prefixes and default inputs. Kept that way because
    it needs no migration and because ID prefixes and default inputs are genuinely per-project;
    a new project inherits the current one's preferences rather than reverting to factory defaults,
    which is what preserves the pre-library "New clears the network, not your preferences" behavior.
    Split display preferences out to a global key if that ever reads wrong.
  - **Naming, settled 2026-07-31 (Tom).** The toolbar's "New / Clear" is now just **"Clear
    project"** — it blanks the open project and never creates one, so "New" was doing nothing but
    competing with the panel. The panel offers **"Save as new project"** (duplicate everything on
    screen and open the copy — Task 184's project-level copy, built here) and **"Start empty
    project"**, named apart on purpose: *"New project" reads as the first to most people and did the
    second*, which is the worst possible combination. A failed copy (quota, with a backdrop image
    the likely cause) leaves the user in the original rather than half-moved into a project that
    does not exist.
  - **Popovers dismiss with a corner X, not a "Close" button** (Tom, 2026-07-31). He caught it in
    the Projects panel, where "Close" sat directly beneath Open / Rename / Delete — three buttons
    that all take a *project* as their object — so it read as "close the project." The ambiguity was
    not really unique to that panel, so all four `lpn_` popovers changed together. The translated
    word survives as `title`/`aria-label`, so the accessible name is still a translated "Close"
    rather than a bare multiplication sign; the button is a 40px target with matching popover
    padding, since this page runs on phones and a glyph at natural type size is a few pixels across.
    No other page in the suite has a Close button, so this was page-local, not a suite-wide sweep.
  - **Two phone bugs found in Tom's testing, 2026-07-31, both "sized to content, not to screen":**
    (1) **The canvas could fill the phone screen and trap the user** — `#lpn_canvas` carries
    `touch-action: none` so the app owns pan/zoom, which means every touch landing on it is
    swallowed and cannot scroll the page; with no page left to touch, reloading was the only way
    out. `applyMapHeight()` now caps the RENDERED height at 72% of the viewport (floor 240px) and
    re-applies on `resize`/`orientationchange`, so a strip of ordinary page is always reachable.
    `settings.mapHeight` keeps the user's unclamped number, so a desktop 900px map is not rewritten
    by one phone visit. Considered and rejected as bigger changes reaching the same place: a
    two-finger-pan rule, or a scroll affordance beside the canvas. **Note the cap can make the
    Settings "Map height" field look ignored on a phone** — it is a render cap, not a stored value.
    (2) **Popovers overflowed the right edge** — the JS clamp can only choose a left edge, so a
    popover wider than the viewport overflows no matter what it picks, and it bottoms out at 4px.
    CSS now caps popover width (and height, for a long Settings or Projects list) to the viewport,
    which is what makes the clamp solvable. Scrolling is on an inner `.lpn-popover-body` wrapper so
    the corner X stays pinned instead of scrolling away.

## Task 208

- 0|208| **[OBSOLETE 2026-08-05] A lock that travels with a COPY of a file is the wrong lock — the sharing hole in Task
  **RULED OBSOLETE by Tom, 2026-08-05, on reading the post-211 state.** Task 211 did what the
  "re-decide after 211" note below anticipated, and further: the lockout this task existed to fix
  is no longer something that happens *to* a user. Opening a file somebody else holds now presents
  one dialog with **Create a copy** as a first-class answer, so the shared-outside-the-office case
  resolves in a single click instead of stranding the opener read-only over a project they have
  never heard of. With autosave-to-file gone the lock only has to be right at Open and Save, and at
  both of those moments the user is present and answering a question. The sidecar/directory-handle
  machinery below was sized against a continuous, silent lock that no longer exists.
  **What remains true, recorded so it is not rediscovered as a surprise:** `docId` is still baked
  into the file, so two strangers sent the same copy still answer to one lock record — they simply
  meet it as a dialog now; and the friendly name is still shown to whoever opens the same file
  (never written into the file itself — see the `lpn_lock_prompt_name` fix in Task 211). Neither is
  a defect worth building the sidecar for. **The one genuinely live idea here — persisted file
  handles in IndexedDB and `handle.isSameEntry()` — is extracted to Task 212** rather than left in
  a closed block, since Task 211's deferred `Open Recent` wants the same capability.

  195 Phase 2 (Task 146 child).** Raised by Tom, 2026-08-03, thinking past the office case the lock
  broker was designed for: *"What if somebody shares their project outside their office?"* Two
  consequences, and he is right about both.
  - **(a) The friendly name goes everywhere the file does.** "Locked by Dave in Planning" was written
    for colleagues and is then read by strangers. **Partly mitigated 2026-08-03** — the prompt now
    asks for *initials* and says outright that anyone you send the file to can see it, which makes
    the safe answer the obvious one. Mitigation, not a fix: the name is still broadcast.
  - **(b) Strangers lock each other out.** `docId` is baked into the file, so every copy of a shared
    file answers to ONE lock record. Two unrelated people who were both sent the file contend for it,
    and the loser is read-only over a project the winner has never heard of. **Partly mitigated
    2026-08-03** — "Save as my own copy" is now offered in the locked-out banner (including during
    the please-wait window, since someone outside the office is not waiting for anything), turning a
    lockout into one click. Still: the *default* experience of opening a shared file can be a lockout,
    and that is backwards.
  **Why the obvious fixes do not work.** Tom proposed AutoCAD's side-by-side `.dwg`/`.dwl` pair, and
  identified the blocker himself: we cannot find "a file in the same folder as" a file. A
  `FileSystemFileHandle` gives a name and nothing else — no path, no parent — unless the user grants a
  *directory* handle, which is a different and much heavier permission prompt. Worth noting one real
  capability we do have and are not using: **`handle.isSameEntry()`** can tell whether two handles
  point at the same file, and handles can be persisted in IndexedDB. That does not solve sharing
  (it is per-browser), but it would let us answer "is this the same file I had last time" across
  sessions — which is the honest version of the moved-vs-copied question for a single user, and is
  Tom's 7.1 ("we can keep a persistent reference in this browser").
  **Candidate directions, none chosen:**
  - **Ask a directory handle for the project's folder** and keep the project file AND a sidecar lock
    file in it — Tom's 2026-08-03 proposal, and the strongest option on the table. `showDirectoryPicker()`
    returns a `FileSystemDirectoryHandle`, and `getFileHandle(name, {create:true})` reads or creates
    any file in that folder, so the AutoCAD `.dwg`/`.dwl` pattern he wanted **is** reachable. This
    supersedes the earlier note in this task that we cannot find "a file in the same folder as" —
    that is true of a *file* handle and false of a *directory* handle, and the distinction is the
    whole idea. It would put the friendly name in the lock file, keep the lock with the *location*
    rather than the *document*, and **may remove the need for `lpn-lock.php` altogether**: a file
    sent outside the office arrives with no lock file beside it and so locks nobody out, which is
    exactly the failure this task exists for.
    - **Tom, on hearing "Chromium-only": *"That's fatal. Too bad."* — but the premise is wrong, and
      this should not be dropped for that reason.** `showSaveFilePicker`/`showOpenFilePicker`, which
      Phase 2 step 1 already ships and depends on, are Chromium-only *by the same measure*. The
      directory picker costs **no additional browser reach** — the set of users who get live file
      saving at all is identical either way, and everyone else already falls back to Phase 1's
      download/import. If Chromium-only were disqualifying here, it would equally disqualify the
      live-file model already built, which is a much bigger decision than this one.
    - **The real costs**, which are not compatibility: a heavier one-time permission prompt (a folder,
      not a file); the loss of the native Save-As dialog, so the file name comes from us or from a
      second step (Tom: *"maybe not so bad. I could test it"*); and — the one genuine technical
      weakness — **no atomic test-and-set**. Two browsers can both read "no lock file" and both
      create one, where `lpn-lock.php`'s `flock()` has no such window. A hybrid (sidecar for
      identity and location-scoping, server broker as arbiter when reachable) may be the honest
      answer, and is the direction Tom endorsed 2026-08-03 (*"Hybrid sidecar: I love it"*).
    - **What that race is, precisely** — Tom asked whether it meant a moved file arriving without its
      sidecar; it does not, and the distinction matters. It is an ordinary time-of-check-to-time-of-use
      race **in the normal case**: two browsers open the same file in the same folder at nearly the
      same moment, both call `getFileHandle()` for the lock file, both see nothing there, both
      conclude the project is free, and both create a lock naming themselves. Last write wins and
      **both believe they hold it**. A file system reached through this API offers no atomic
      create-if-absent to close that window, whereas `flock()` does. On a network share the window is
      far wider than raw simultaneity suggests, because SMB/NFS client caching can hide a
      just-created file from another machine for seconds. **A moved file with no sidecar is a
      different thing and is the behavior we WANT**: no lock file beside it means nobody is locked
      out, which is exactly how a file shared outside the office stops contending with the original.
    - Directory handles persist in IndexedDB like file handles, so re-opening a known folder need
      not re-prompt.
  - **Scope the lock to a declared team**, so a lock record is per (docId × team) and an outsider
    simply never sees an insider's lock. Cheap, but requires a shared secret nobody wants to manage.
  - **Ask on open, rather than assume**, per Tom's own sketch: *"This project is currently locked by
    'ABC' in another browser or at another location. SaveAs, Take over, or Cancel?"* — which is close
    to what now ships, and may be all this needs if the wording carries the "One True Copy" idea.
  - **Accept it and document it**: locking is for a shared drive in one office; a file you send
    outside should be forked on arrival.
  Do not treat the 2026-08-03 mitigations as closing this. They make the failure survivable; they do
  not make the lock mean the right thing.
  **Re-decide this AFTER Task 211, not before (2026-08-04).** Killing autosave-to-file shrinks the
  problem: the lock only has to be right at **two moments — Open and Save** — rather than
  continuously, and 211's open-time dialog already offers "Save as my own copy" as a first-class
  choice rather than a banner escape, which is most of what (b) was complaining about. The
  hybrid-sidecar direction is unaffected in substance but should be re-costed against the smaller
  problem. Note also that 211 defers `Open Recent`, which wants the same persisted-handle capability
  as `isSameEntry()` here — build the two together.


## Task 211

- 0|211| **[DONE 2026-08-05] The tab-and-File-menu paradigm: projects as tabs, files as files (Task 146 child).
  Supersedes Task 195's Phase 2 UI.** Designed with Tom 2026-08-04, after his second browser pass on
  Task 195 stopped partway with *"I apologize for this disruption, but I think we need to revisit the
  project and file paradigm before I continue to test because things (the UX) are too confusing."*
  The apology was unnecessary and the timing was ideal: the read-only enforcement code was about to
  get deeper, and this **deletes more than it builds**.

  **The diagnosis.** Task 195 invented three concepts a user has no name for — a "project" that is
  neither a document nor a file, a "Close" that released a file while leaving the project on screen,
  and a read-only mode that took editing away from someone who had not asked for it. Each was
  defensible alone; together they needed a paragraph of explanation per control. Everything below is
  conventional instead, which is not only kinder to the user but **cheaper for us**: less invention
  means less rework, fewer strings, and a smaller translation surface when 146.06 finally runs.

  **Canonical vocabulary** (use these words in code, comments, and this file):

  | term | meaning |
  |---|---|
  | **browser project** | lives only in this browser, in no file. Always asterisked. |
  | **file project** | promoted to a file. Asterisked only when dirty. |
  | **project tab** | top strip, above the toolbar |
  | **scenario tab** | bottom strip (Task 201 builds these) |
  | **Close** | the only removal verb. **There is no Delete.** |

  Tom first proposed "Web tab" for the browser project and accepted the substitution: *web* says
  **on the internet**, and this thing's defining property is that it is on **no** server, in one
  browser, on one machine. A user reading "web project" would reasonably assume we are keeping it for
  them — precisely the misunderstanding the paradigm exists to remove — and most of the 26 languages
  would render *web* as internet/network. Typing the **project** rather than the tab also avoids
  colliding with the browser's own tabs.

  **The one rule everything else falls out of:**

  > **The asterisk decides. Asterisk → prompt on close. No asterisk → close silently.**

  No tab types in the rule, no special cases. A browser project always carries an asterisk because it
  is nowhere but this browser, so closing it always prompts — and closing it really does destroy the
  only copy, which is why **Delete has nothing left to mean and disappears entirely** (`deleteProject()`
  and its "Delete this project and everything in it? This cannot be undone." string go with it). A
  file project carries one only when dirty, so a clean one closes silently, which is the ordinary
  state one second after Save. The prompt is contextual: **Save As · Discard · Cancel** for a browser
  project (Save has nowhere to go until you name a file), **Save · Discard · Cancel** for a dirty file
  project.

  **Tabs.**
  - Placement is AutoCAD/PDF-editor, not browser-chrome: **site header → project tab strip → toolbar
    → banner → map.** Everything below the strip is inside the tab. Tom leaned this way on
    convention; it is also right for a structural reason — the toolbar and the read-only banner are
    both *per-document* state, so the strip must sit above them for the tab panel to contain
    everything the tab owns. This page has no input form above the map, so "top of page" and "top of
    document" coincide and nothing is lost.
  - Asterisk on **everything not written to a file**, faded on browser projects (a standing
    condition), full strength on a dirty file project (an actionable one). **Tom corrected the
    original objection here and was right:** the claim that a permanent asterisk would stop meaning
    "unsaved" and start meaning "not a file" confused *power* with *meaning*. A browser project
    genuinely is unsaved; the asterisk is honest; only its salience is at stake. Try the fade — if it
    reads as broken or vanishes on a phone, drop it, because the meaning survives either way.
  - **Tab label: middle-truncate, preserving the extension** — `Elm-Street-Apts-lpn….json`, full name
    in the tab's `title`. Tom caught the hole in end-truncation: it eats the one character that proves
    the thing is a file. And hyphens alone prove nothing, since a user may hyphenate a browser
    project's name in anticipation of saving it. With the extension visible, **no glyph is needed** —
    the name says "file", the asterisk says "unsaved", and the two facts stay independent.
  - **New projects are named `Project {n}`** (`lpn_project_numbered`, JS substitutes), replacing the
    "Untitled" fallback in `projectDisplayName()`. **`{n}` is the lowest integer not currently in use
    among open tabs**, not a monotonic counter — close Project 2 and the next new tab is Project 2
    again, as `Book1`/`Untitled-1` behave. A monotonic counter reaches "Project 47" in an afternoon
    and reads as a leak.
  - **Tab menu: Rename · Duplicate · Close.** Rename is labelled **`Save As…` on a file project**,
    because a file project's name *is* its file name (see below).
  - Overflow: a button at the left edge of the strip giving the vertical list. **On narrow screens the
    vertical list is the primary and the strip hides** — this page has no horizontal room to spare on
    a phone.

  **A file project has one name, not two.** On promotion the file's base name *becomes* the project
  name; Rename on a file project **is** Save As. This closes punch-list §2 (*"Rename → Save to file
  silently saves to the original file name"*), which was not a bug — Save wrote the linked file and
  Rename renamed the project, each correct alone — but a permanent trap: two names, one Rename, one
  Save, and no way for a user to predict which one moved.

  **File menu** (menu/toolbar, plus `Ctrl+S`):

  ```
  New                     ( = the [+] tab; identical function, must never diverge )
  Open…
  Open Recent  ▸          ( deferred — see below )
  ─────
  Save                    Ctrl+S
  Save As…
  Revert
  Close
  ```
  - **Save is in the File menu and nowhere else — not the tab menu.** The tab menu acts on *a* tab,
    including one that is not current (as in Google Sheets), and every item in it works that way.
    Save acts on the current document; putting it there invites "save that other tab", which we would
    have to either build or grey out.
  - **`New` and `[+]` are the same function**, per convention: a new browser project, nothing on disk.
  - **`Revert`** — re-read the handle and reload; enabled only on a dirty file project; confirms
    first. Killing autosave leaves a bad experiment with no escape beyond the undo stack, and this is
    the counterpart to Discard-on-close. It also builds the **"re-read from disk"** primitive that a
    repaired Take over will need, so it pays for itself twice.
  - **No Import/Export yet.** Tom offered them as placeholders for the EPANET interface; those names
    belong to Task 196 and return as `Import ▸ EPANET .inp` / `Export ▸ EPANET .inp` submenus, so the
    format is part of the name and nobody wonders how Export differs from Save. A second pair of file
    verbs beside Open/Save today would rebuild the confusion this task is removing.
  - **No Print.** Tom, 2026-08-04: *"Print is a 'never' priority. Screenshots are better, I think.
    Maybe that can change."* Task 175 owns any future suite-wide printing.

  **Saving: the backup problem, and why autosave-to-file dies.** Tom, punch-list §1.7: *"Autosave
  should not modify the main save file... User must have the ability to Close without saving any
  changes from this session. That is the standard paradigm."* Correct, and it is the most serious
  item in his list — silently writing the master file on a timer removes the user's ability to
  abandon a session. Therefore:
  - **Save is explicit** (`Ctrl+S`, File → Save). **Nothing writes the master file on a timer.**
  - **Close / tab-close / browser-close prompt**, per the asterisk rule above.
  - **localStorage keeps the working copy of a file project continuously, as an unsaved-changes
    cache — not a second authority** — and is cleared on a clean save-and-close. Reopening after a
    crash offers *"This project has unsaved changes from a previous session. Restore or discard?"*
  - **Deliberately NOT a sibling `.bak` file** (Tom's option (b), which he withdrew in favour of
    convention): it is a second artifact in the engineer's folder that they did not ask for, that we
    cannot reliably clean up, and that they will have to explain to somebody. localStorage recovers
    the *session*, not a file-shaped guess at it, and costs nothing new.

  **Read-only is opt-in, and it is real.**
  - Opening a locked file presents **one dialog at open time**: *"Dave T. has this file open."* →
    **Open read-only · Save as my own copy · Cancel**. Tom's AutoCAD instinct, and also Word and
    Excel: a surprise becomes a decision.
  - **Choosing read-only is permanent for that tab. Nothing promotes it behind your back** — the
    `pollLock()` promotion built on 2026-08-03 is removed. Tom: *"Read only is read only."*
  - **Read-only means what it means in Word: you may edit freely, you just cannot save over that
    file.** Save on a read-only tab is always Save As. **This deletes all four read-only enforcement
    seams** (`data-edits` on the toolbar, the pointer-handler guard, the `setMode()` force, the
    `openPopupAt()` disable pass) — the item ranked #2 most-likely-defective on the punch list.
  - **No re-check-on-save offer.** This was proposed and Tom killed it with the decisive argument:
    a read-only tab holds a snapshot from *before* the holder released, so the file on disk is
    **newer**; saving over it would destroy their work with no merge. Not merely bait-and-switch —
    data loss. **The same physics is what condemned Take over** (see Task 195's 2026-08-04 fixes).

  **What this deletes, net.** The four read-only seams; `pollLock()`'s promotion; the two-state
  banner machine (collapses to one persistent read-only strip); autosave-to-file, the
  `fileAutosaveSeconds` setting and its 60–180 s clamp; `deleteProject()` and its confirm string;
  "Save as my own copy" as a banner-only escape (it becomes ordinary Save As); and the whole
  Projects popup. **What it builds:** the tab strip and its menu, the File menu, dirty/prompt-on-close,
  Revert, and the open-time lock dialog. Smaller than what it replaces, and far smaller to explain.

  **The autosave interval's 60–180 s clamp was an error and goes away.** One number was doing three
  jobs — the file-write interval, the lock heartbeat (`flushToFile()` piggybacked `acquire` on every
  write), and the takeover threshold (`2 ×` it in `presentLockedOut()`). Tom asked why limits exist at
  all; the honest answer is that they were protecting a coupling that should not exist. With autosave
  gone: **heartbeat on its own fixed timer (60 s), quiet-holder threshold its own fixed constant
  (~5 min), and no user-facing interval setting at all.**

  **Deferred, deliberately: `Open Recent`.** A file handle dies with the tab today, so File → Open
  always means navigating the picker again, even for the file open ten minutes ago. Handles can be
  persisted in IndexedDB and re-permissioned with one click, which would make Open Recent real. Tom
  agreed to defer: it is purely additive, changes nothing about the paradigm, and is worth building
  once the rest is proven in a browser. (Note this is the same capability Task 208 wants for
  `isSameEntry()`, so the two should be built together when they are built.)

  **Translation cost: zero, and this is why 146.06 has not run.** Every string this task adds,
  renames or deletes is English-only, because `lpn_`'s sprint is deliberately unrun. Had the 26
  languages been translated when Task 195 shipped, this redesign would have cost a full resync of a
  surface that turned out to be wrong. Concrete vindication of the scaffold-before-translate rule.

  **Knock-ons, checked 2026-08-04:**
  - **Task 208 (the sharing hole) gets materially smaller and should be re-decided after this, not
    before.** With no autosave, the lock only has to be right at **two moments — Open and Save** —
    instead of continuously; and the open-time dialog already offers "Save as my own copy" as a
    first-class choice rather than a banner escape, which is most of what 208(b) was complaining
    about. The hybrid-sidecar direction Tom endorsed (*"Hybrid sidecar: I love it"*) is unaffected in
    substance but should be re-costed against the smaller problem.
  - **Task 201 (scenario UI) gains a decided home**: scenario tabs along the bottom strip, mirroring
    project tabs on top. Reserve the space in this task even though 201 builds the contents. Note the
    slight imperfection Tom raised and accepted: conventionally top tabs are *files* and bottom tabs
    are *parts*, whereas our top strip mixes filed and unfiled projects — but that mixture is itself
    conventional (a browser has unsaved tabs; VS Code puts `Untitled-1` beside real files; Excel
    opens `Book1` next to workbooks from disk).
  - **Task 209 (snoozable tips)** — the training panel is still its first instance; the panel's
    *content* changes with this task (see below), its mechanism does not.
  - **Task 196 (EPANET)** — its two verbs are reserved in the File menu, as submenus.
  - **Punch list `dev/lpn-file-lock-test-punchlist.md`** — §1–§8 are rewritten by this task; §9–§13
    (no server, missing file, the Firefox/Safari fallback, server side, non-regression) survive as
    written and stay with Task 195.

  **Also fix while in here, from the same pass:**
  - **`lpn_file_training_3` is false today**: it says the initials can be seen by "anyone you send the
    file to", but `serializeProject()` never writes them — they live in `localStorage` and on the
    broker. The true statement is *anyone who opens the same file*, which stays true under 208's
    sidecar. Reword, do not delete.
  - **`lpn_projects_heading` ("Saved projects")** and **`lpn_file_saving_to` ("Saving to: {file}")**
    both die with the Projects popup. Tom on the latter: *"initially unsettling as in 'How long does
    saving take?!?!'"* The tab strip replaces both — the file name is visible permanently, at the top,
    where every other application puts it.
  - **Nothing is untranslatable about "automatically"** (Tom asked why the word was missing from the
    training text and Settings). It was written around, that is all; all 26 languages have an
    ordinary adverb for it. Moot for autosave, which is being removed, but do not write around it
    again elsewhere.
  - **One press of Save opened two file dialogs, once, unreproduced** (§1). No path found that gives
    two pickers on consecutive presses with a stable `openId`. It goes back on the punch list after
    the rebuild rather than being chased in code that is about to be replaced.

  **CLOSED 2026-08-05.** Shipped across commits `8aa5b51`…`d3aba33`; Tom judged it finished and a
  source audit agreed. Verified rather than assumed: every *built* item is present (tab strip with
  `[X]` per tab and an overflow list, the tab menu, the File menu including `Revert`,
  `lpn_project_numbered` with lowest-unused-`{n}`, middle-truncation preserving the extension in
  `tabLabel()`, the asterisk rule in `tabAsterisk()`, the contextual close prompts, the open-time
  lock dialog with Open read-only / Create a copy / Cancel), and every *deleted* item is gone —
  `deleteProject()`, `pollLock()`'s promotion, `fileAutosaveSeconds` and its 60–180 s clamp,
  `data-edits` and the other three read-only seams, `lpn_projects_heading`, `lpn_file_saving_to`,
  the Projects popup. The only surviving mentions of those names are comments explaining their own
  removal. The heartbeat runs on its own fixed 60 s timer and `pollLockedFiles()` deliberately never
  polls a read-only tab, so nothing promotes behind the user's back.
  **One loose end found and fixed on closing:** `lpn_lock_prompt_name` still carried the false claim
  this task fixed in `lpn_file_training_3` — "anyone you send the file to can see it", when
  `serializeProject()` never writes the name into the file at all. Reworded to match
  ("anyone who opens the same file"). Both strings now say the same true thing.
  `Open Recent` remains deliberately deferred and is now **Task 212**, extracted so it is not buried
  in a closed block.


## Task 203

- 0|203| **[ADOPTED 2026-08-05] The COVERAGE MATRIX: a mandatory core cross of calculator × language, fading in both
  directions. DECIDED by Tom, 2026-08-03.** *"I see our usage reports pointing us to a mandatory
  translation core of a few calculators and a few languages. All calculators get those few languages,
  and all languages get those few calculators. From there in both directions it tapers off like a
  fading matrix or a fading 2D gradient."*

  **Why the CROSS and not a single tier.** CC's original proposal tiered only one axis (calculators)
  and was worse. Tiering calculators alone orphans a niche calculator in English forever; tiering
  languages alone orphans a niche language entirely. **The cross does neither** — every language
  still gets the top calculators (so discovery is never withheld, and the chicken-and-egg objection
  is answered), and every calculator still gets the top languages (so nothing is English-only).

  **The cliffs are unusually clean, and both axes have the same shape** — one dominant member, one
  large drop, then a flat tail. Measured 2026-08-03:
  - **Calculators:** MPF 75.8% → *6.5× drop* → MTC 11.6% → *4.0× drop* → HW 2.9% → tail of ~1.0–1.3×
    steps. **Top 3 = 90.4%**, matching the long-standing "MPF + HW + MTC = 92% of humans" finding.
    Top 5 (adding MI, MPHL) = 94.7%.
  - **Languages (non-English):** es 61.4% → *6.1× drop* → pt 10.1% → fr 8.2% → tr 6.2% → tail.
    **es alone = 61.4%**; es+pt+fr+tr = 85.9%.

  **What the cross costs and buys** (26 non-English × 16 calculators = 416 cells). Computed as an
  efficient frontier rather than picked by eye — and **the frontier prefers adding LANGUAGES over
  adding calculators**, because a core language costs `16 − N` cells while a core calculator costs a
  full 26:

  | cells | share of work | covers | core calculators | core languages |
  |------:|-------------:|-------:|------------------|----------------|
  | 66 | 16% | 95.2% | MPF+MTC | es |
  | **80** | **19%** | **96.4%** | **MPF+MTC** | **es+pt** |
  | **108** | **26%** | **98.2%** | **MPF+MTC** | **es+pt+fr+tr** |
  | 136 | 33% | 99.2% | MPF+MTC | es+pt+fr+tr+zh+he |
  | 156 | 38% | 99.4% | MPF+MTC+**HW** | es+pt+fr+tr+zh+he |

  **CC's first proposal — 3 calculators (MPF+MTC+HW) × es, 91 cells, 96.3% — is NOT on the frontier**
  and should not be used: MPF+MTC × es+pt is cheaper (80) *and* covers more (96.4%). The instinct to
  take "the top 3 calculators" came from the 90%-of-humans framing, which is the right rule for a
  single axis and the wrong one for a cross. Note HW does not earn core status until 156 cells —
  2.9% of use does not justify 26 cells.

  **Recommended starting point: 108 cells — MPF+MTC × es+pt+fr+tr, 26% of the work for 98.2%.**
  Returns flatten hard after it. Tom to confirm or move along the frontier.

  **THE MODEL: tiers are BUCKETS ON EACH AXIS; the CELL holds a binary. (Tom, 2026-08-03, correcting
  CC.)** *"3 or more tiers would simply look like a 3 × 3 or 5 × 5 table 'graph' of calculator tier vs
  language tier with binary gets_translated entries… we look up this calculator and language pair to
  determine whether or not to translate."* This is the right model and it retires CC's objection
  below, which confused a *tier* with a *coverage level* and then argued that a middle coverage level
  had no meaning — answering a question nobody asked. Coverage stays binary at the cell; the tiers
  simply group rows and columns so the boundary can take a shape richer than a cross.

  **The 2 × 2, written out. It is YES, YES, YES, NO** — Tom read it as "yes, no, no, no" in the same
  message, and the difference is load-bearing, so it is recorded explicitly here:

  |                        | lang T1 (es, pt, fr, tr) | lang T2 (the rest) |
  |------------------------|--------------------------|--------------------|
  | **calc T1** (MPF, MTC) | yes                      | **yes** ← every language gets the core calculators |
  | **calc T2** (the rest) | **yes** ← every calculator gets the core languages | no |

  Three yeses is what makes it a **cross**. "Yes, no, no, no" is an **AND** rule — translate only
  where both axes are core — which is an 8-cell rectangle that would leave Manning-Pipe-Flow
  untranslated in 22 languages, contradicting Tom's own sentence *"All calculators get those few
  languages, and all languages get those few calculators."* **The OR/cross is recorded as the
  decision because that is what Tom described in words; if the intersection was actually meant, it is
  a far smaller commitment and needs an explicit re-ruling.**

  **The cross IS the 2 × 2 staircase, and N × N generalises it** — which is exactly Tom's original
  "fading 2D gradient", and shows the gradient intuition was right and only needed buckets rather
  than a continuous function:

  ```
              lang T1   lang T2   lang T3
  calc T1       yes       yes       yes
  calc T2       yes       yes       no
  calc T3       yes       no        no
  ```

  **NUMBER OF TIERS — start with TWO (Tom, 2026-08-03: "we could start with only two tiers, core and
  non-core"). That is the right call, and the reasons are worth recording so a third is added for a
  reason rather than for symmetry:**
  - ~~Coverage is naturally binary, so a middle coverage level has no meaning.~~ **RETIRED — this
    argument was wrong** (see the model above): a tier is a bucket on an axis, not a coverage level,
    so a third tier never implied a half-translated body. Struck rather than deleted, because it is
    the reasoning error that would otherwise be repeated.
  - **Two tiers per axis produce the cross exactly, with one sentence of rule:** *translate the body
    iff the calculator is core OR the language is core; identity strings always.* No matrix, no
    per-cell table.
  - **The "medium" need is already met by a different mechanism.** The `QUALITY` tiers
    (0.95 / 0.85 / 0.65 in `lib/Language.Settings.php`) encode **verification depth**, not coverage.
    A Medium coverage tier would blur two questions that are currently cleanly separated — keep
    *what we translate* and *how hard we check it* on different dials.
  - **Tooling is far simpler** (Task 204): a coverage declaration is two lists plus the OR rule.
  - **Splitting 2 → 3 later is easier than collapsing 3 → 2**, and promoting one calculator or one
    language is a one-line change either way.

  **WHEN A THIRD TIER WILL GENUINELY BE EARNED — name it now so it is not invented ad hoc.** The real
  third state is about **maintenance, not coverage**: (1) *maintained* — translated and resynced on
  every English drift; (2) *translated* — done once, resynced only in batches; (3) *identity only*.
  That distinction will be forced the first time a large English edit lands (Task 193 alone changed
  51 strings), which is soon. Add the third tier then, on that axis, not before.

  **THIS IS FORWARD-LOOKING AND DELETES NOTHING.** All 416 cells are already translated except
  `lpn_`. The matrix governs **new calculators, drift/maintenance spend, and future audit passes** —
  never removal of work already paid for. Say this out loud in any future discussion, because
  "tiering" invites a reading where existing translations get dropped, which is not the decision.

  **Identity strings are the floor of the gradient, not part of the taper.** Menu entry, `<title>`
  and `*_main_desc` stay translated for **every** calculator in **every** language regardless of
  tier — ~3 strings against 100+ for a body — because they are the discovery mechanism, and
  `dev/translation-process.md` already records the evidence: *"es at 10% proves the door opens when
  identity strings are discoverable."* A cell outside the cross means "body in English, findable in
  the local language," which is also what lets that cell earn its way in.

  **LIVE CONSEQUENCE — Task 146.06 becomes a different task.** `lpn_` ranks 6th (1.7%) and is not a
  core calculator, so it gets the core languages only: at the recommended 108-cell point that is
  **`lpn_` × es, pt, fr, tr — 154 keys × 4 languages**, plus identity strings in all 26. That replaces a 26-agent sprint, and `es` is exactly
  where a wrong string costs most. If `lpn_` climbs into the core calculator band, it earns the rest.

  **REQUIRED COMPANION — the tooling assumes full parity and will fight this.** See Task 204. Do not
  adopt the matrix without it.

  ---
  **Original framing, kept for the reasoning (superseded by Tom's matrix above):** tier translation
  SPEND by calculator, not by language. Tom, 2026-08-03: *"is it cost-effective to translate all calculators to 26
  languages? … Should we let probationary languages prove themselves on the top calculators first
  before we dive into another 14 × 26 sprint?"* The question is right and the timing is right — before
  a sprint, not after. But it **bundles two decisions that have opposite answers**, and separating
  them is most of the work.

  **DECISION A — which LANGUAGES exist at all. Recommendation: do NOT tier. Keep all 26.**
  - **Chicken-and-egg.** A language with no reach may have none *because* the page is not
    discoverable in it. "Prove your worth first" is unfalsifiable when the proving requires the thing
    being withheld. This is the standing `zero reach ≠ low value` rule in
    `dev/translation-process.md`, and the 2026-08-03 data strengthens it rather than weakening it:
    `es` at 188 confirmed humans over 8 days is what a language looks like *after* the door opens.
  - **The cost is already sunk.** All 26 exist for every calculator except `lpn_`. Demoting one saves
    nothing retroactively; it only forfeits an asset already paid for.
  - **Mission.** Tools are the vehicle, not the destination. One Khmer-speaking engineer reached is
    not worth less than one Spanish-speaking engineer reached. Efficiency framing quietly becomes
    "serve the already-served," which is the opposite of the point. What efficiency *legitimately*
    argues is that spending which reaches **nobody** delivers nothing — untranslated-and-unvisited is
    no loss; **unvisited-because-untranslated is.**

  **DECISION B — which CALCULATORS get a full 26-language sprint. Recommendation: DO tier. This is
  where the money actually is.**
  - The 2026-08-03 snapshot shows all non-English human use landing on **five** calculators — MPF,
    MTC, HW, DW, MPHL. A sixteenth calculator translated 26 ways before it has demonstrated demand
    *in any language* is speculative spending, and it is the only kind here that is still avoidable.
  - **Gate on TOTAL confirmed human use, in any language — not on English use.** The tempting
    version ("earn English traffic first, then translate") rests on non-English demand being
    proportional to English demand, and the data does not support that: non-English share is ~13% on
    MPF but appears *higher* on the smaller calculators (HW, DW). Those are small samples and may be
    different windows, so the honest move is to sidestep the assumption entirely by gating on a
    number that needs no such model.
  - **Suggested gate, for Tom to set or reject:** a calculator earns its full sprint at **≥50
    confirmed human uses**. Below that it has not demonstrated demand anywhere.

  **THE MECHANISM THAT BREAKS THE CHICKEN-AND-EGG — and it is already this project's own finding.**
  `dev/translation-process.md` records: *"es at 10% proves the door opens when identity strings are
  discoverable."* Identity strings — menu entry, `<title>`, `*_main_desc` — are what a search engine
  indexes; they are the discovery mechanism, and they are **~3 strings per calculator against ~100+
  for a body**. So:
  - **Translate identity strings for every calculator in every language** (cheap, and it is what
    makes a language able to prove anything at all).
  - **Gate the body on the demand that then shows up.** A language that starts arriving on a
    calculator earns that calculator's full sprint.
  - **Honest downside, which is why this is a recommendation and not a decision:** a page with a
    translated title and an English body is a worse artifact than either extreme, and it produces
    exactly the views-without-usage signature that `zh` currently shows — so it would pollute the
    metric it is meant to feed. Mitigate by treating it as an explicitly instrumented *probation*
    state, not a resting state.

  **THE COST NOBODY BUDGETS IS MAINTENANCE, NOT SPRINTS.** A one-time sprint is a known, bounded
  cost. Every English edit afterwards creates 26 debts *forever* — Task 193 alone changed 51 strings.
  That recurring cost can be tiered by reach with **no user-visible partial state at all**, which
  makes it strictly better value than tiering the sprints. Partly done already via the QUALITY tiers
  and `es`-as-spot-check; worth making explicit.

  **LIVE CONSEQUENCE — Task 146.06 (`lpn_`, 154 keys × 26).** Under this framework the sprint waits
  until `lpn_` clears the gate. It currently shows 2 confirmed uses, and those were mismeasured
  (Task 199). This is already how the two are ranked (146.06 at 5, Task 195 at 90) — the framework
  just supplies the reason, and a number.


  **ADOPTED 2026-08-05, at the recommended 108-cell point: core calculators `mpf`, `mtc` × core
  languages `es`, `pt`, `fr`, `tr`.** Tom confirmed the frontier point rather than moving along it.
  The decision now lives in code as `dev/scripts/translation_coverage.json` (Task 204), so the model
  above is no longer only a plan — the four counting scripts enforce it.
  **Measured effect on the very first run**, which is the number Task 204 existed to prevent:
  suite-wide missing keys fell from **5,330 to 886**, with 4,485 reclassified as *out of scope* in
  their own bucket. The 886 is not a residue — it is exactly `lpn_` × 4 core languages (205 × 4 =
  820) plus the 3 `lpn_` identity strings owed in each of the other 22 languages (66). The delta
  again means something a human can act on.
  **One thing the model as written did not say, discovered in implementation and now settled:** the
  identity floor is per-KEY, not per-cell. An out-of-scope cell still owes its menu entry, `<title>`
  and `*_main_desc`, so the tools must apply scope key-by-key — a first cut that blanked whole cells
  hid the fact that `zh` was missing three `lpn_` identity strings behind a tidy dot. The floor is
  the mechanism that lets a cell earn its way in; it cannot be allowed to disappear into the taper.


## Task 195

- 15|195| **Export/import a project as a file (Task 146 child) — BOTH PHASES SHIPPED 2026-08-03.
  What remains is browser verification, not construction, which is why the priority is now 15 rather
  than the old 90. A gate for dropping the PREVIEW banner. Reframed 2026-08-01 as two phases of the
  SAME task, not a separate one:** a one-shot JSON
  download/import (Phase 1, as originally scoped, now built) and a live-handle,
  multi-user file-locking system built on top of it (Phase 2, new scope, added 2026-08-01). Both
  phases solve the same underlying problem this task was opened for — everything lives in
  localStorage, which a browser-data clear wipes, which Safari evicts after roughly 7 unused days,
  and which private mode never persists at all — Phase 2 just goes further, adding real file I/O and
  team coordination instead of only a backup/hand-off download.

  **The 90 was carried by the data-loss argument, and Phase 1 answers it.** A user can now get a
  copy of their work out of the browser, which is the part that was urgent. Phase 2 is team
  coordination — genuinely useful, but nobody loses a network for want of it, and its own
  open-questions list below says it is a planning entry rather than a spec ready to execute. Raise
  it again when an actual office is sharing project files, not on the strength of the old number.

  **Phase 1 — one-shot JSON file, as originally scoped. SHIPPED 2026-08-03.**
  - Download the v2 project document as JSON, and read one back. The storage shape is already
    exactly right for this — one self-contained object per project, backdrop included.
  - Distinct from EPANET `.inp` interop, which Tom confirmed 2026-07-29 is not needed. This is
    backup and hand-off of our own format, not exchange with other software.
  - Import must run the same `migrateSaved()` chain and the same structural repair a stored document
    gets, and land as a NEW project rather than overwriting the open one.

  **What Phase 1 actually built** (`js/looped-network.js`, `Looped-Network.php`, `lang.ec.en.php`):
  - Two buttons on their own row in the Projects panel — **"Save to file"** and **"Open from file"**,
    not "Export"/"Import". The file holds our own format for backup and hand-off, and the plainer
    pair says so without a word of explanation.
  - `exportProject()` flushes the open project first, then serializes **the same
    `serializeProject()` object autosave writes** — the file IS the stored document, so there is no
    second format to keep in step. Written indented, deliberately: someone will eventually open one
    in an editor, and on a project big enough for that to cost anything the backdrop's data URL
    dominates the size regardless.
  - `readDocument()` was split into **`prepareDocument(saved)`** (version gate + migration chain +
    shape guard) and a thin localStorage reader over it. That split is what makes the ROADMAP's
    "same chain, same repair" requirement true *by construction* rather than by duplication — the
    only difference between a stored document and an imported file is where the JSON came from.
  - The shape guard is new and applies to both: `nodes`/`links`/`labels`, if present, must be
    arrays. `applySaved()` takes them on trust (`saved.nodes || []`), so a file whose `nodes` is a
    string would previously have installed and then broken the renderer.
  - `importProject()` writes and verifies the new project key **before** anything switches — the
    same order `saveProjectAs()` uses, and for the same reason: an imported file carrying a backdrop
    is the one thing here big enough to fail on quota, and a failed import must leave the user
    exactly where they were. It then saves a *second* time after `applySaved()`, so what lands on
    disk is the structurally repaired document (missing Base, dangling `activeScenario`, pre-2026-07-30
    reservoirs with no elevation, merge-onto-current-defaults), not the raw file.
  - Narrates where the user landed (`lpn_status_imported`), the way `deleteProject()` does — an
    imported file becomes a *new* project, and that is the part a user cannot see for themselves.
  - `lpn_notes_3_def` was rewritten: it told users "a project cannot yet be written to a file",
    which stopped being true with this change.
  - Verified with a throwaway harness that slices `prepareDocument`/`migrateSaved`/`safeFileName`
    out of the file and runs them under Node — 22 checks covering the refusals (not-an-object,
    missing/too-new version, non-array collections), the acceptances, the full v1→v2 migration of an
    imported file, and filename sanitizing including non-Latin project names. Not committed; there
    is no test harness in this repo to add it to.
  - **Not done, and deliberately:** the PREVIEW banner stays. This task is *a* gate, not the only
    one — 146.06's translation sprint has not run, and the page is still English-only.

  **Phase 2 — client-side collaborative file locking, built on real File System Access handles
  (added 2026-08-01).** A materially bigger version of "local file saving" than Phase 1: instead of
  a one-shot download/import, the project file becomes the canonical source of truth, opened via
  `showOpenFilePicker()` as a real `FileSystemFileHandle` held for the session, with the production
  web server used purely as ephemeral lock-state metadata (never touching the project file itself)
  so a team sharing project files from a network share can coordinate who's editing. Conflict
  resolution is an in-office honor system — no auto-timeout; a colleague explicitly "takes over."
  **Do not build Phase 2 before Phase 1 ships and is confirmed working** — Phase 1 is the smaller,
  already-decided step, and Phase 2's file-handle model can reuse whatever loading/repair code
  Phase 1 writes for JSON import.

  Core pieces, as specified:
  - **Identity, once per browser:** a `projectId` (UUID v4) baked permanently into every new project
    file at creation; a free-text "friendly name" prompt (deliberately informal/non-identifying 
    (like "Dave in Public works", "Dave T.", or "DWT"), saved to `localStorage` — no login, no server-side user table.
  - **Dirty-flag autosave:** `isDirty` set on any input change; a background timer (default
    configurable 60-180s in Settings) writes to the held file handle and clears `isDirty` only when
    there's something to save — skips the write (and the disk I/O) otherwise. `beforeunload`/
    visibility-change handling silently saves-and-releases the lock on tab close.
  - **Lock broker (new, minimal server component):** a JSON record per project —
    `{projectId, lockedBy, lastActivity}` — behind four endpoints (`checkLock`, `acquireLock`,
    `stealLock`, `releaseLock`). **Must be file-based (one JSON file per project id, guarded with
    PHP `flock()`), not a database** — this project's stated architecture is "No database, no
    authentication" (CLAUDE.md), and a flat-file lock store is the one implementation that doesn't
    cross that line even though it is genuinely new server-held state (the app's first). A real
    DB/auth layer here would be scope creep beyond what the feature needs.
  - **Three-scenario UI state machine:** (A) clean open on an unlocked file — acquire, enable
    editing, start the autosave loop; (B) file locked by someone else — compute time since
    `lastActivity`, block takeover and say "please wait" if under ~2x the autosave interval,
    otherwise offer "take over from X" with reassurance that the other user's work is autosaved, and stay
    strictly read-only until cancel or a successful steal; (C) walk-away recovery — before EVERY
    autosave write, re-check the lock server first, and if someone else now owns it, abort the
    write, freeze the UI read-only, and show a clear "you were taken over by Y, your last save is safe"
    message rather than silently corrupting the new owner's edits.

  **Phase 2 step 1 — live file handles, no locking. SHIPPED 2026-08-03.** Split out because it needs
  no server at all and carries most of the user-visible value: the file becomes the thing you are
  working in, rather than a copy you took. Built:
  - `showSaveFilePicker`/`showOpenFilePicker` behind `fileApiAvailable()`, with Phase 1's
    download/`<input type=file>` as the feature-detected fallback everywhere the API is missing.
  - Handles held in a `Map` keyed by project id, **session only**, exactly as specified above.
  - Dirty-flag autosave on a 60–180 s timer (`settings.fileAutosaveSeconds`, default 120, in a new
    "Saving to a file" settings section). `fileDirty` is set in **`saveToStorage()` and nowhere
    else** — every mutation on the page already funnels through it, so the flag covers all ~40 call
    sites and cannot be forgotten by whatever the 41st turns out to be.
  - `flushToFile()` clears the dirty flag **before** the await, not after, so an edit made while a
    write is in flight re-sets it and is picked up by the next tick instead of being swallowed by
    the write that did not contain it. A failed write restores the flag and says so.
  - `flushOutgoingFile()` at all four points that change `library.openId` — everything deciding
    *what* and *where* to write runs before the first await, so an in-flight write still lands in
    the outgoing project's file. A copy (`saveProjectAs`) and a new project are deliberately
    unlinked; deleting a project drops its handle but never touches the file.
  - Tab-close flush on `visibilitychange`→hidden (the one that actually fires on mobile), with
    `beforeunload` as a best-effort second net.
  - `acceptImportedText()` extracted so the handle path and the `<input type=file>` path cannot
    drift into accepting different files.
  - 24 more harness checks (mock `FileSystemFileHandle`): no-handle, clean-skip, forced write,
    the mid-write edit race, failed-write flag restoration and recovery, unlink, feature detection.

  **Open questions — three resolved 2026-08-03, one still open:**
  - **RESOLVED — browser support.** Feature-detected fallback to Phase 1, as the question itself
    proposed. The settings row for the autosave interval is not even built where the API is absent:
    a control for an interval that can never elapse is a promise the browser cannot keep.
  - **RESOLVED — architecture: localStorage stays the authority, a file link is additive.** The
    browser-support answer forces this one. A project library that was really a cache over files
    would have no story for Firefox and Safari except keeping the localStorage path anyway — two
    authorities and every bug twice. Keeping localStorage authoritative also preserves every Phase 1
    guarantee untouched (quota-safe writes, `adoptOrphans()` self-healing, migrate-on-read) and
    makes linking reversible: unlink and you still have your project.
  - **RESOLVED — offline/PWA.** Step 1 changes nothing: file writes are local, and editing never
    needed the network. Only step 2's lock check will, and it is confined to open/steal. The Notes
    text (`lpn_notes_3_def`) was rewritten this session to describe file linking honestly, including
    the fact that write-back happens "in some browsers" — the one place the split has to be admitted
    to a user.
  - **RESOLVED — the lock broker's home and housekeeping.** `lpn-lock.php` at the app root (matching
    `log-calc-event.php`, the existing convention for endpoints the JS calls), records in
    `lpn-locks/` behind the same `.htaccess` `log/` uses, housekeeping by a 1-in-50 in-request sweep
    rather than a cron, so the feature carries its own cleanup and cannot be deployed without it.
    **Tom, 2026-08-03, correcting the premise this was being held back on:** *"It's not the first. We
    are writing logs already."* Right — `LANG_LOG`, `CALC_USAGE_LOG` and `HUMAN_VIEW_LOG` are all
    server-written already, so the "first server-held state" framing was wrong and the question was
    smaller than it looked. He offered MySQL as the alternative and ruled it out in the same breath,
    correctly: a new dev-environment dependency and a contributor hurdle, bought for a few hundred
    bytes of coordination state.

  **Phase 2 step 2 — identity, the lock broker, and the read-only state machine. SHIPPED
  2026-08-03.** Built after Tom corrected the premise this was being held back on: the suite already
  writes server-side logs, so a lock broker is not the app's first server-held state, and MySQL was
  correctly ruled out as a new dev-environment dependency and a contributor hurdle. Built:
  - **`lpn-lock.php`** — one flat JSON record per project document id in `lpn-locks/`, blocked from
    HTTP by the same `.htaccess` `log/` uses, behind `check`/`acquire`/`steal`/`release`. One
    `flock()` held across the whole read-modify-write, so two people pressing "take over" in the
    same second cannot both come away believing they hold it. `acquire` doubles as the heartbeat.
  - **Bounded, because it is a public write endpoint.** The id is format-validated rather than
    sanitized (`/^d[A-Za-z0-9]{8,48}$/` cannot express `..`, a slash, or a NUL, so there is no
    traversal left to defend against); names are control-character-stripped and capped at 60; a
    `check` on an unknown project allocates no file, so reads cannot fill the disk; a 1-in-50 sweep
    expires *records* after 30 days; a record-count cap refuses new records without disturbing
    existing ones. The sweep never expires a *lock* — takeover stays explicit, per the honor system.
  - **`project.docId`**, assigned lazily rather than by a storage-version bump. The lock key has to
    live in the FILE (two people opening the same file have different local project ids), but a
    version bump would make every file this page writes unreadable to a page that has not updated
    yet — hostile mid-preview for a key old code never reads. A `saveProjectAs` copy gets a fresh
    one, so a copy and its original never fight over one lock.
  - **Identity**: an opaque per-browser token plus a friendly name, prompted once. The token is what
    "mine" means; the name is only ever shown to a human, and two people may share one.
  - **All three scenarios**, with the wait/takeover split driven by `2 ×` the autosave interval, and
    the pre-save re-check on every write (scenario C) aborting the write rather than clobbering.
  - **Read-only** blocks the network — add/delete/drag/property edits/undo/clear/example/backdrop —
    via `data-edits` on the toolbar, a pan-instead-of-drag guard in the pointer handler, a
    force-to-select in `setMode()`, and one disable pass in `openPopupAt()` (the single seam every
    property popup opens through). It deliberately does **not** block Settings, Labels, pan or zoom:
    looking around a network you may not edit is exactly what someone in this state wants to do.
  - **It fails OPEN.** An unreachable broker — offline, a deploy hiccup, the endpoint missing —
    leaves editing fully enabled. Locking is a courtesy layer over an honor system, so failing
    closed would let a server outage take away a calculator that never needed one. This is what
    makes it safe on a page that must keep working offline.
  - Verified with 126 harness checks across four throwaway harnesses (43 driving `lpn-lock.php` with
    each request as its own process, including a 20-process concurrent steal and the sweep; 37 on
    the client state machine including fail-open and the mid-session takeover; 46 from Phase 1 and
    step 1).

  **Tom's first browser pass, 2026-08-03 — five findings, all addressed the same day.**
  - **The likely cause of what he saw:** `showSaveFilePicker` requires a **secure context**, so on
    plain `http://` it is `undefined` and the page silently uses Phase 1's download fallback. That
    explains "my browser saves silently to a default file name and location; when I save again I get
    a second copy" — it was never the handle path. Anyone testing this must use `https://` or
    `localhost`, and that is now the first thing to check when the file behavior looks wrong.
  - **The moment of danger is opening a file you could not lock** (Tom). It now warns in the banner —
    editing continues, because an unreachable server must never take the calculator away, but the
    user is told the file is unprotected. **The warning promises a follow-up and now keeps it:**
    `retryLock()` runs on every autosave tick, clears the banner and says "locking is working again"
    when the server returns — or goes read-only if the server comes back and somebody else got there
    first. **Dismissable only when offline or installed** (Tom was unsure; this is his instinct
    implemented): where having no server is a standing fact of the session the banner can be
    dismissed, and where it is an ordinary fixable fault it cannot.
  - **Gratuitous saving.** Where a file is linked, pressing Save writes to that same file — already
    true. Where the API is missing there is no handle to keep, so every press really is another copy;
    the button now reads **"Download a copy"** with a tip, instead of saying "Save to file" and
    quietly producing duplicates.
  - **"Close project"** (there was no way to say "I am done with this file"). Flushes, releases the
    lock so a colleague can open it, unlinks the file, deletes nothing, and its tip says the same
    thing happens on its own when the tab closes — which answers Tom's "explain it somehow" as well.
  - **A moved/renamed/deleted file** now reports in the banner with a **"Choose the file again"**
    button that drops the stale handle first (otherwise the next save retries the same dead handle).
  - **A copied file: we cannot detect it, and said so rather than guessing.** The File System Access
    API exposes `handle.name` and never a path, so "moved" and "copied" are genuinely
    indistinguishable — and a name comparison would miss the common blooper exactly (copy to a backup
    folder keeps the name). Instead there is a **"This is a copy"** button that assigns a fresh
    `docId` and releases the old lock, letting the one party who actually knows say so.

  **Second review round, 2026-08-03 (same day), from Tom's follow-up:**
  - **File name is now `[project]-lpn-hawsedc-engcalcs.json`** — project first, of the two orders Tom
    offered. A common prefix makes every file in a folder listing look identical and pushes the one
    distinguishing part off the end of the column; the suffix still says where the file came from,
    which is what helps someone a year later.
  - **A one-time training panel before the first file picker**, explaining in three short sentences
    that the project lives in a file, that the site tracks who has it open, and that a colleague can
    take over. Built as a **panel with its own Continue button, not a `confirm()`** — for a hard
    reason: `showSaveFilePicker()` needs a live user activation and Chrome's transient activation
    expires in a few seconds, so a blocking dialog would work for a fast reader and throw for a
    careful one. Continue is a fresh click. Shown once per browser; the snooze/dismiss version Tom
    asked for is **Task 209**.
  - **The name prompt now asks for initials and says the name is public** — see Task 208(a).
  - **"Close project" renamed "Close file".** Tom asked whether it clears the screen like Start empty
    project; it does not, and that question is exactly why the old name was wrong. Nothing leaves the
    screen, nothing is deleted, the file is handed back.
  - **"Download a copy" is conditional, and that is deliberate** (Tom asked). It is the same button:
    "Save to file" where the File System Access API exists and each press writes to the linked file,
    "Download a copy" where it does not and each press genuinely is another file. The label tracks
    what the button will actually do rather than promising one thing and doing the other.
  - **"This is a copy" was removed as a standing button** and became **"Save as my own copy" in the
    locked-out banner only.** Tom: *"'This is a copy' is bad psychology. We must promote One True
    Copy."* Right — a page that advertises forking teaches people to make copies they must later
    reconcile. As an escape from being locked out it is the answer to a question the user is already
    stuck on; as a button on the shelf it is an invitation.

  **Third round, 2026-08-03 — Close now closes.** Tom: *"In all software, 'Close file' reverts either
  to a no-document state (not really meaningful for these calculators) or a new-document state (Clear
  calculator), and never to file-stays-open."* He is right, and both earlier names were papering over
  the same wrong behavior: the button released the file and left the project on screen, which is a
  state no user has a name for. **"Close project" now lands on a new empty project**, keeping the
  closed one in the library and deleting nothing. There is no longer any way to keep editing a
  project detached from its file, and that absence is the point — silently diverging from the file is
  how two versions of the truth get made.

  **Fourth round, 2026-08-03 — a real gap found while writing the test punch list.** Nothing
  re-polled the broker once a read-only banner was up, so a colleague who closed their project, or
  who simply went quiet long enough for a takeover to become reasonable, left the other person
  staring at "please wait" forever. `retryLock()` became `pollLock()` and now covers both waiting
  states: the could-not-lock warning AND being locked out. When the lock turns out to be free it
  ACQUIRES rather than merely reporting — the usual way to get there is the other person closing
  their project, and the useful outcome is that the file becomes yours.

  **Test punch list: `dev/lpn-file-lock-test-punchlist.md`** — 13 sections plus a ranked
  known-shaky list. Two things in it are easy to get wrong and would produce a false "locking is
  broken": testing over `http://` (no File System Access API at all, so everything silently uses the
  download fallback) and testing with two TABS rather than two browser PROFILES (shared
  `localStorage` means one identity token, so the lock reads as "mine" in both).

  **Still not done:** the UI has still never been seen rendered by the author. Every check is a
  harness against sliced-out logic (177 across five harnesses now), not a click. Tom's pass so far is
  the only real browser evidence, and it was on a non-secure origin, so the entire
  handle/lock/read-only path remains unexercised in a real browser.

  **SUPERSEDED FOR THE UI, 2026-08-04 — see Task 211.** Tom's second browser pass stopped partway
  through the punch list with *"I think we need to revisit the project and file paradigm before I
  continue to test because things (the UX) are too confusing."* He was right, and the resulting
  redesign replaces this task's entire user-facing surface (the Projects popup, Close project,
  read-only enforcement, autosave-to-file, Take over). **What survives untouched is the machinery**:
  `prepareDocument()`/`migrateSaved()`, `serializeProject()` as the file format, the handle model,
  `flushToFile()`'s write discipline, `lpn-lock.php` and its `flock()` arbitration, `docId`,
  identity. Task 211 is a new front end over that, not a rewrite of it. This task stays open only
  for the parts of its punch list that outlive the paradigm (§9–§13).

  **Three urgent fixes shipped 2026-08-04 ahead of that rebuild** (commit `6274a69`), because they
  were live defects on production:
  - **`ensureDocId()` now runs BEFORE the first file write.** It was called by
    `acquireLockForOpenProject()` at the foot of `saveToFile()`, so the first file a project ever
    wrote carried no `docId`. **This one bug produced two of Tom's findings.** §1: the id appeared
    only on the second save. §6, far worse: a colleague opening that file found no id, minted a
    different one, and the two browsers computed *different lock keys* — so the broker never saw a
    conflict, neither side was ever told the other had the file, and both autosaved over each other.
    Locking was not broken; it was never asked about the same document.
  - **`wipeAllStorage()` now clears `lpn_identity`.** Clear calculator / Wipe memory left the
    initials and identity token behind, so the page did not come back as a first-time visitor: the
    training panel stayed suppressed and the old initials kept going to the broker.
  - **Take over withdrawn** (button no longer rendered; `presentLockedOut()`'s idle/active split
    collapsed to one message). `takeOverLock()` stole the lock and then wrote *this* browser's
    in-memory copy over the file — a copy predating every autosave the holder made while we sat
    read-only. **Taking over destroyed the very work the banner promised had been saved.** Found
    from Tom's own reasoning about read-only (*"saving over it could overwrite colleague changes"* —
    identical physics). Removed rather than repaired: the repair is "re-read the file from disk
    before the new holder may write", which is new logic, and Task 211 rebuilds this surface anyway.
    Nobody is stranded meanwhile — "Save as my own copy" still works and `pollLock()` still hands the
    file over when the holder closes it. `lpn_lock_idle` is left in the lang files unused rather than
    deleted across 27 files for a surface about to be replaced.


## Task 212

Moved out of the roadmap body 2026-08-14, when the block was found still sitting among the open
tasks at priority 0. Compressed to a stub there; this is the full text as it stood.

- 0|212| **[DONE 2026-08-05] Persisted file handles — a reload no longer drops the file.**
  Handles are kept in IndexedDB (structured-cloneable; localStorage cannot hold them). On boot
  `queryPermission()` decides: **granted** reconnects silently, **prompt** is held pending and the
  banner becomes a one-click *Reconnect to this file* — no picker, no hunting — and **denied** or a
  missing API is dropped. A handle whose project has been closed is dropped rather than restored.
  Verified by `dev/lpn-spike/handle-restore-harness.js` (26 checks, mutation-tested) rather than by
  adding six boxes to Tom's punch list.
  - **A banner is not "nothing"** (Tom, 2026-08-05, on the first cut: "I should get nothing, or a
    prompt for single-click permission to reconnect"). A grant does not vanish on reload, it goes
    **dormant**: `queryPermission()` says `prompt`, but `requestPermission()` revives it showing the
    user *nothing* — provided it has a live user activation. Boot has none, which is why it must not
    ask. So the **first pointerdown or keydown** on the page is spent on it instead
    (`armPendingReconnect()`), once per project. Ordinary case: the banner is gone before it is read.
    Where the grant really is gone the browser puts its own one-click bubble up, which is the honest
    version of the question and what Tom asked for.
  - `lpn_file_needs_reopen` said "a browser does not stay connected to a file after the page is
    reloaded" — no longer true, and the sentence Tom hit. It now says the connection to *that file*
    was lost, which is what the remaining cases (permission withdrawn, private browsing, a project
    last opened before the IndexedDB store existed) actually are.
  - **Promoted from 20 and done out of order** because it was not a nicety: every reload disconnected,
    so it contaminated every browser pass and produced three separate "reload doesn't work" reports.
  - `Open Recent` was deferred here and shipped as Task 258 (2026-08-10), on `isSameEntry()`.
