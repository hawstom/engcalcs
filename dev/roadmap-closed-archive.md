# ROADMAP closed-task archive

Full original text of closed ROADMAP tasks that were compressed under the LENGTH DISCIPLINE rule in
`dev/ROADMAP.md` — 15 of them on 2026-08-05, the remaining 143 on 2026-08-14 (Task 320).
**Nothing here was deleted — this file is the long form.** The roadmap carries a <=5-line stub for
each, pointing here; the two files together are the whole record, and the stub is what a reader
scanning the roadmap is meant to need.

Sections are in the order the tasks sat in `## Completed`, which is roughly newest first. The 108
closed tasks that were already <=5 lines were left where they are and are NOT duplicated here.

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


## Task 313

- 0|313| **[DONE 2026-08-14] Timed both engines, and kept the EPANET Workspace and Project alive
  across solves.** Tom, 2026-08-14: *"We've proceeded telling ourselves that our engine is faster
  than the EPANET engine. But I haven't seen evidence of this in my browser tests."* There was none.
  The native 0.4 ms was measured; the EPANET side had only ever been INFERRED from "async, and a
  678 KB import". `dev/lpn-spike/engine-bench.js` measures both.

  **THE FIRST MEASUREMENT WAS ALSO WRONG, AND THAT IS THE LESSON WORTH KEEPING.** The bench was
  written as a decomposition — build the `.inp`, open a Project, solve — and it hoisted the
  `Workspace` out of its own timing loop. It therefore measured a shape the shipped code never had,
  and reported a 1.25 ms round trip. **The exported function actually cost 9–10 ms per solve**,
  because `lpnSolveEpanet()` constructed a Workspace and instantiated the WASM engine *on every
  solve* — ~8 ms nobody had counted, on a page that re-solves on every keystroke. A decomposition
  measures the parts you thought of. **Time the exported function, unmodified, or you are timing
  your own mental model.**

  | network | before | after, value edit | after, reopen | native |
  |---|---|---|---|---|
  | 6 nodes | 10.2 ms | **0.14 ms** | 0.98 ms | 0.04 ms |
  | 21 nodes | 9.0 ms | **0.41 ms** | 1.56 ms | 0.30 ms |
  | 201 nodes | 18.9 ms | **3.19 ms** | 6.19 ms | 33.7 ms |

  - **Where each engine actually wins, stated carefully, because the tempting summary is wrong.**
    EPANET's *solver* is faster at every size — 0.04 ms against our 0.30 ms at 21 nodes. But the
    *path* is not the solver: at the page's 10–20 node design target the native path is still
    marginally ahead end to end (0.30 vs 0.41 ms), because the remaining EPANET cost is **our own
    glue** — `lpnDiagnose`, plus a few hundred individual WASM calls at ~1.5–2.4 µs each to push
    values in and read results back. The crossover is between 21 and 201 nodes, and above it the
    native O(n³) dense Cholesky runs away: 10.5x at 201 nodes. **Neither difference is perceptible
    at the design size** — 0.3 ms and 0.4 ms are the same number to a person — which is exactly what
    Tom reported seeing in the browser.
  - **A bulk read was checked and is not available**: the vendored build's `getNodeValues`/
    `getLinkValues` return a single value, not a property vector, so the per-call overhead above is
    a floor rather than an oversight.
  - **What triggers a reopen is derived from the MODEL, never declared by the caller** —
    `signatureOf()`: node `id|type`, link `id|type|from|to|hasCurve`, `method`, `emitterExponent`.
    A caller that has to remember to say "this was a topology edit" is a rule that gets broken
    silently within a month. Units are deliberately absent: the model reaching that file is always
    SI, so a unit switch arrives as changed numbers and the value path already handles it.
  - **`dev/lpn-spike/session-harness.js`, 121 assertions, and its own sabotage check runs EVERY
    time.** The core assertion is one comparison per edit: the incremental answer must equal a cold
    engine's answer for the same model. That catches a missed reopen and an unpushed value with the
    same test. Each run also re-requires the module in a child process with `signatureOf()`
    replaced by a constant and **requires that copy to fail** — it produces 22 failures, most of
    them quiet ones 6–92 L/s off rather than loud engine errors. It fails the build if it can no
    longer find `signatureOf`, so the check cannot rot into a no-op.
  - **Pressures had to join the comparison.** In a demand-driven solve an elevation change moves no
    head and no flow, so head+flow alone cannot tell a pushed elevation from an ignored one.
  - **The case for `engine: 'native'` as the default is now ONLY the one-time 663 KB module load**
    (236 KB gzipped, ~36 ms to import and instantiate in Node). That is a real bandwidth argument
    for the offline/low-connectivity audience this suite exists for. **It is not a speed argument
    and must not be written up as one again.**
  - Measured in Node. WASM instantiation, the fetch and the JIT all differ in a browser, and the
    fetch is what a user actually waits for — the per-solve numbers are representative, the load
    number is a floor.


## Task 216

- 0|216| **[DONE 2026-08-14] Outbound reference-link clicks are logged, with the visitor's
  language.** Raised by Tom, 2026-08-05: *"How often are non-English people asking for 'n' help?
  And should we let them somehow complain that the reference is only English?"* Shipped as
  `outbound` rows in the new `SIGNAL_LOG` (`log-signal-event.php`), reported in
  `log/lang-log-stats.sh` by destination, by served language, and by page for non-English visitors
  only. Feeds Task 217, so the metric arrives with a decision already attached.
  - **Built the beacon, skipped the complaint UI**, as decided at the time: the click IS the
    complaint. A non-English visitor opening an English-only roughness table is a complete,
    zero-cost, unambiguous signal, and asking them to additionally *say so* collects the same one
    bit at a much higher price.
  - **DELEGATED AT THE DOCUMENT, NOT TAGGED ONTO EACH LINK — and that turned out to be the whole
    implementation decision.** The plan named five pages' links. But `mpf_friction_slope` carries
    its own `<a href="../frictionslope.php">` **inside all 27 language files**, so a per-link
    attribute would have had to be added in 27 places for one link, and would then be silently
    absent from the next reference anybody writes. One `click` listener on `document` needs no
    per-link maintenance and cannot miss one.
  - **The test is "out of /engcalcs/", not "off-site".** `../frictionslope.php` is our own
    English-only explainer on the same origin, and it is the single most interesting destination
    here: its tip already admits "English only" in all 26 languages, so a click on it is a visitor
    proceeding *knowing* the page will not be in their language. Navigation between calculators is
    not a reference lookup and is already in the view log.
  - Host and path only, never the query string. The EPA roughness link is ~600 characters of
    query and tells us nothing the path does not.


## Task 200

- 0|200| **[DONE 2026-08-14] Usage logging: the questions the current report could not answer.**
  Raised by Tom, 2026-08-03: *"I'd like to get more guidance about our development priorities from
  usage logging."* Everything on the list above the "lower value" line is now built, in one new log
  (`SIGNAL_LOG`, `log-signal-event.php`) with an `event` column and a new report section. The three
  leftovers were extracted to Task 303 rather than left in this block.
  - **Shipped:** `touch` (did they change any input before leaving), `units` (preset clicks and the
    unit each family actually lands on), `repeat` (has this browser calculated here before), `lpn`
    (`first:` — which of example / element / backdrop / import happens first, and `diag:` — which
    solver complaint fires most). The language x calculator cross-tab was already built 2026-08-03.
  - **ONE LOG WITH AN EVENT COLUMN, not five more endpoints.** The four existing logs are separate
    because each is a TIER of one funnel and the report divides them by each other. These are not a
    funnel — they are diagnostics of the same shape, and five near-identical 90-line writers would
    be five places to keep the offline queue, the opt-out check, the bucket suffix and the
    timestamp trust window in step.
  - **THE CONSTRAINT THAT SHAPED ALL OF IT: the `ec_seen` digit is FULL.** Five bits, maximum 31,
    which is exactly one base-32 digit — and *"a single digit per page"* is the sentence in the
    consent banner. A sixth bit for "touched" would have made that sentence false. So these events
    dedupe **in the page's own memory, per page load**, and store nothing.
  - **Which then produced the one genuinely nice finding here: the visits bucket gives the CLEANER
    number.** A signal count (per page load) cannot be divided by a view count (per visit) — except
    among the people who declined to be counted twice, where nothing is stored and therefore both
    are page loads. So `%touched` is computed from the visits bucket and the visitor bucket is
    shown as raw counts. The one place in this report where non-consenting traffic is the better
    instrument, and it is stated in the section rather than quietly assumed.
  - **Repeat use stores NOTHING NEW, after the obvious build was rejected.** A visited-page list in
    `localStorage` is durable analytics storage; the granted consent covers *"a single digit per
    page … to prevent us from logging its visits repeatedly"*, which a page-name list is not, and
    whose purpose is the opposite. Shipping it meant rewriting the banner, retranslating it into 26
    languages, and bumping `EC_CONSENT_VERSION` to re-ask everybody — for a diagnostic. The page's
    **own input cookie** answers the same question for free: exempt storage, already there, and a
    *better* signal (they calculated here, not merely glanced). The row is still gated on consent,
    because an analytics READ is an analytics access. **Generalise it:** when a new measurement
    seems to need new storage, check whether something exempt already answers the question — the
    cost of storing something is never the bytes, it is the sentence in the banner it makes false.
  - **Looped-Network got its own probe the same day** (Tom: the map page is exactly where the
    shopper/user split matters most). Same principle, better evidence — a **saved project document**
    proves this browser drew a network. **Not `lpn_index`:** `init()` registers the blank project a
    first-time visitor opens on, so the index exists before any edit, and probing it would have
    counted *reopening* the page as *using* it. That defect would have been a plausible number
    nobody could falsify from the report, so `dev/calc-spike/repeat-visit-harness.js` (12 checks,
    mutation-tested) now fails if the probe is ever widened to `lpn_`.
  - **This retired a reset experiment before it was run.** Tom proposed deleting the logs to see
    whether lpn's shoppers/users re-ramped. Two things argued against it: the counts are **visits,
    not people** (`ec_seen` is a session cookie, so a returning visitor is already counted again),
    so a ramp confounds returning users with steady inbound shopping; and the `lpn_index` probe
    answers the question directly and permanently. Logs archived with a date suffix rather than
    deleted, so the baseline survives either way.
  - **Stated undercount, in the report rather than in a comment:** the map's "did nothing" figure is
    a residual, so it also absorbs anyone who left before the page finished loading.
  - **Verification status: fixtures only.** Every section was checked against hand-built fixture
    logs (populated and empty paths both), and the endpoint's sanitisation was checked end to end.
    **None of it has been run against production data** — nothing had been collected when it
    shipped. First real read should re-check the coverage dates in the footer before drawing any
    conclusion, since these counts start months after the view counts do.
  - **The two reading rules from the original block still stand and are unchanged:** there is a bot
    floor around 900, so `%human of reach` is a signal-to-noise ratio and not a conversion rate for
    any page but MPF and Manning-Trap; and below roughly 40 humans `%used` is noise, so a page with
    a handful of rows needs traffic or an honest niche decision, not a metric.
  - **The units answer is REORDERING, not removal**, as decided 2026-08-05 and now printed above
    the table itself so the next reader cannot miss it. An unused dropdown option costs a user
    essentially nothing; a missing one costs them the whole calculator, and "no hits in three
    months" across a few thousand humans is deletion on absence of data from a small sample. The
    units `?` experiment (Rung 0 of Task 207's cost ladder) is untouched by this and still open.


## Task 302

- 0|302| **[DONE 2026-08-14] The looped network reported NEGATIVE velocities.** Tom: *"I am
  seeing some negative velocities. I don't think that's compatible with our paradigm."* Correct —
  `lpnReport()` computed `Q/A` from the SIGNED flow, so any pipe carrying flow against the
  direction it was drawn in reported a negative speed. **A velocity is a speed; direction is
  already carried twice**, by the sign of the flow beside it and by the arrow the map draws.
  Three independent confirmations that magnitude is the paradigm: EPANET's own output in
  `dev/lpn-spike/reference/ref_Net1-3.json` pairs negative flows with positive velocities;
  `js/lpn-epanet.js` reads `EN_VELOCITY` and so the two engines DISAGREED on the same solve; and
  `example-network-harness.js` already computed `|Q|/A` by hand when it wanted a velocity.
  It also broke every velocity COMPARISON silently — the fastest reverse-flowing pipe sorted to
  the *bottom* of the extrema range, so a "highest velocity" badge or colour scale pointed at the
  wrong pipe. Fixed in `js/lpn-solver.js` (`Math.abs(Q[k])`), with an assertion on the ring
  example — the one network guaranteed to reverse — that every reported velocity is unsigned and
  equals an independently computed `|Q|/A`. Mutation-tested: reverting the fix fails it in both
  unit presets.


## Task 301

- 0|301| **[DONE 2026-08-14] The click that ended a backdrop Move also acted on the node it
  landed on.** Tom: *"When moving a background image, node select and delete needs to be disabled."*
  Every pointer path did check `regMode`; the leak was the sequence's LAST click. Registration
  listens in the CAPTURE phase and clears `regMode` inside its handler, so the tool's own
  bubble-phase `pointerup` on the same element ran with the flag already false — picking a node as
  a Move target opened its popup, or deleted it with the Delete tool active. Fixed by gating the
  tap's START (`downPt`) instead: the `pointerdown` happens while `regMode` is unambiguously on, and
  a tap with no beginning cannot complete. **General shape worth remembering: a flag cleared inside
  a capture-phase listener is already false for every bubble-phase listener on the same element.**
  `dev/lpn-spike/backdrop-scale-harness.js` §12 asserts it structurally — the defect is in the order
  two listeners see one event, which the extract-a-function harnesses cannot reproduce.


## Task 311

- 0|311| **[DONE 2026-08-14] Two errors in Manning Trap Channel's Maynord riprap column, one of
  them ~4x in the unsafe direction.** Surfaced by `/code-review high js/Manning.lib.js` (the first
  Tier 2 review this calculator has had), then checked against the primary source: Witheridge,
  *Background to Rock Sizing Equations* (Catchments & Creeks), which Tom read and transcribed.
  The published form is `d50 = 0.031 sf (Ss-1)^-1.25 V^2.5 / y^0.25` (Eq 14/17), SI throughout.
  - **THE BEND FACTOR WAS ON THE WRONG QUANTITY AND INVERTED.** The source raises the VELOCITY at a
    bend; the code divided d50 by 1.5. Since d50 goes as V^2.5 that is x0.67 where it should be
    ~x2 — **about 4x too small, exactly where a bend demands the most armour.** What gave it away
    was that the page's own Isbash column moved the OTHER way on the same input (Isbash handles a
    bend through K, 1.2 -> 0.86, and correctly grows): two methods disagreeing in DIRECTION is a
    signal no single-method check could produce.
  - **THE (Ss-1) EXPONENT HAD LOST A DIGIT** — `^0.25` where the source says `^1.25`. At the default
    sg = 2.65 that made the rock 1.65x oversized, which is conservative and therefore never looked
    wrong, and it under-responded to `sgrock`, a user-editable input. Tom verified `-1.25` against
    the reference before it was changed.
  - **4/3, not Maynord's 1.5 — Tom's call, and it needed a citation.** Maynord's 1.5 is for NATURAL
    channels and this calculator is mostly used on artificial ones, so the bend velocity is 4/3 of
    average per California Division of Highways (1970), Eq 18 of the same reference. Because the
    column carries Maynord's name and this factor is not his, `mtc_d50_mra` now carries a tip
    saying so. **Costs one key x 26 languages**, flagged CHANGED by the drift tripwire and
    degrading gracefully meanwhile (the label still renders; only the tip is English-only).
  - **Searcy's 0.022 was challenged and SURVIVED.** The review argued it was a US constant on an SI
    velocity because it matches Isbash at K = 0.86 in ft units to 2%. It is a coincidence: the
    reference states Searcy in SI, and the SI reading puts it sensibly below the other three
    methods rather than exactly on one. Left alone, pinned by an assertion, and `dev/ai-report.md`
    updated from "unverified" to resolved.
  - **MRA's side-slope rule is deliberately not implemented** (Tom: *"I agree no correction for
    mra"*). The source recommends no change from the bottom d50 for sides flatter than 1V:2H and
    +25% at 1V:1.5H; the page sizes sides with Isbash instead, which is a different and defensible
    method, not an omission.
  - **The two methods now AGREE**, which is the corroboration worth recording: on a steep test
    channel Maynord and Isbash give 22.0 vs 25.3 in straight and 45.2 vs 49.2 in on a 45 deg bend,
    where before the fix they disagreed about which way the answer went. Nine new assertions in
    `mtc-harness.js` pin each equation to its published form, the bend DIRECTION for both methods,
    the `(4/3)^2.5` factor, and the sg exponent. Mutation-tested: reverting the exponent fails 2,
    inverting the bend fails 3, "converting" Searcy fails 1.
  - **Direction of the changes, for anyone asking why numbers moved:** at a bend the Maynord rock
    got substantially BIGGER (the safety-relevant fix); away from a bend it got SMALLER by 1.65x at
    the default sg (removing conservatism that was never intended); Searcy and Isbash are unchanged.


## Task 312

- 0|312| **[DONE 2026-08-14] A new background image landed at the world origin, not on the model.**
  `initialBackdropPlacement()` (was `initialBackdropSize`) now centres the image on `bbox()` as well
  as sizing it to that extent. Tom: *"I added a background image to an existing model, and I cannot
  find the image."* Sizing alone was a fit in one dimension: a network at state-plane coordinates put
  a correctly-sized picture ~10⁶ units off screen, and Scale/Move both need you to click the thing
  you cannot see. Also: `downscaleImage()` had no `onerror`, so a file the browser cannot decode
  (TIFF — offered by `accept="image/*"`, decoded by no major browser) did *nothing at all*; it now
  says so (`lpn_backdrop_unreadable`, 26 languages) and the picker offers png/jpg/gif/bmp plus their
  world files — 10 entries, **extensions only**. A MIME type is expanded by the browser to every
  extension registered for it, so `image/jpeg` put `.jfif`, `.pjp`, `.pjpeg` and `.jpe` in the
  dialog (Tom: *"Do we really need pjp, jpe, jfif?"*). The sidecar is now identified by extension in
  the handler too, which also removes a silent dead end: a picture the OS reported with an empty
  type used to leave `img` null and the pick did nothing. Not `*.*`, and **not "everything a browser can
  decode" either**: CC's first cut listed webp/avif/svg on that reasoning and Tom rejected it —
  *"Either the list is so long that it's unreadable or there are no such world files in the list."*
  Decodable is not the test; somebody turning up holding one is. BMP stays on that test (a
  colleague's utility maps, 2026-08-11). **A short list is cheap because "All files" is one click
  away and an undecodable file now explains itself** — omitting a format costs a click, not a dead
  end. Covered by `dev/lpn-spike/backdrop-scale-harness.js` §10–11.


## Task 309

- 0|309| **[DONE 2026-08-14] The extrema badge was not part of the label's footprint.** Tom: *"The
  extrema glyph is not accounted for in the leader attachment. So it can overhang a steeply vertical
  leader when label is dragged left."* `measureDecorRight()`/`labelBoxWidth()` in
  `js/looped-network.js`; the leader, collision boxes, mask rect and `bbox()` all read the wider
  number. Measured per line, because the decorated line is often not the widest one.
  - **Task 190's toggle needs no code of its own.** Marks off → `decorationFor()` returns undefined →
    no decorated line → zero reserved. Tom asked for the treatment to be "sensitive to the toggle
    state"; deriving it from the decoration is what makes that free and unbreakable.
  - **Tom's `##.##(^)` / `##.##(v)` alternative was not taken.** It would fix the width for free
    (parens are text, so `getBBox()` includes them) but discards the two-rail badge he specified and
    iterated over eight rounds on 2026-07-30, and `(v)` reads as a letter, not a direction. Reopen if
    the badge ever costs more than it earns.
  - Harness: `dev/lpn-spike/label-decor-harness.js` (25 checks).


## Task 295

- 0|295| **[DONE 2026-08-14] Manning Trap Channel's roughness/rock iteration converged on a
  different answer depending on where you started.** Third defect in `mtc_iterate`, found by
  `dev/calc-spike/mtc-harness.js` (Task 292) while fixing the first two, and fixed with Tom's
  go-ahead: *"I assumed that people would play with numbers until they settle down. If you can make
  it better, please do."*
  - **`n_strickler` was computed ONCE before the loop and never again**, while its three siblings
    (`n_blodgett`, `n_bathurst`, `n_pi`) were recomputed every pass. So with Strickler — or B/B
    falling back to Strickler — plus any rock method, the rock size converged against a **frozen**
    roughness and the two loops never actually coupled. Same channel, same settings, five starting
    guesses, five different answers:

    | typed d50 | 2 in | 4 in | 12 in | 24 in | 60 in |
    |---|---|---|---|---|---|
    | settled on (before) | 0.683 in | 0.542 in | 0.376 in | 0.298 in | 0.220 in |
    | settled on (after) | 0.894 in | 0.894 in | 0.894 in | 0.894 in | 0.894 in |

  - **The assumption was reasonable and it is the kind a harness exists to retire.** Playing with
    numbers until they settle is exactly what a person does with a hand-driven tool, and it works —
    it just cannot be relied on, cannot be taught to a first-time visitor, and silently produces a
    defensible-looking number for anyone who does not do it. An iteration whose fixed point moves
    with the initial guess is not converged.
  - **Fix: recompute `n_strickler` inside the loop from the current d50**, alongside the other
    three. The pre-loop value is kept purely as the seed for a user who types n = 0. Harmless where
    nothing moves — with no rock radio d50 is constant, so it is the same value every pass.
  - **Scope, measured across all 16 roughness × rock-size combinations:** only the Strickler-plus-a-
    rock-method rows moved, which is exactly the intended set. P&I rows, B/B rows at submergences
    that select Blodgett, and every no-rock-radio row are byte-identical to before.
  - **The regression test needs no reference at all**, which makes it the cleanest assertion in the
    file: five starting guesses must converge on one rock size and one roughness; the settled n
    must equal `d50^(1/6)/21.1` for the **settled** d50; and all 16 combinations must reach a fixed
    point inside the pass limit. Mutation-tested — re-freezing `n_strickler` turns exactly those
    three red.


## Task 308

- 0|308| **[DONE 2026-08-14] Two real defects in Manning Trap Channel, both in `mtc_iterate`'s
  loop-exit condition, both invisible from the page.** Found by `dev/calc-spike/mtc-harness.js`
  (Task 292) within an hour of the harness existing, while checking a question Tom asked about the
  P&I range check: *"The check may be working wrong."* It was, and something worse was behind it.
  - **DEFECT 1 — the reported velocity was computed from the WRONG n: the one the user had typed,
    not the one the page was displaying.** Pick a roughness method and leave the rock size typed, and the loop ran
    exactly ONE pass: the rock switch's `default` branch set `iterate_p = false`, killing the
    roughness iteration along with its own. `v` is computed near the top of a pass from the
    PREVIOUS pass's n, and n is updated near the bottom — so the page put the new n in the
    roughness box and reported a velocity, Q, Froude number and set of rock sizes computed from
    the n the user had typed. The shear stress was never affected — τ = R·S involves no n.
    **Every combination with a rock radio ALSO on was correct**, because the
    rock loop kept iterating and n converged as a side effect. Three of every four combinations
    were right, which is part of why this survived years of use.
  - **WHERE THE HARM ACTUALLY WAS — corrected 2026-08-14 after Tom tested it in a browser.** He
    was right, and his framing is the clearer one: *"a lag of one step in the triggers."* Exactly
    that — the pass updated n and left Q showing the previous n's answer, and the next trigger
    healed it. The distinction that follows from his framing, and the one worth keeping:
    **a trigger heals a stale OUTPUT; it cannot heal a wrong INPUT.**
    - **On the MAIN FORM the defect was TRANSIENT and self-healing.** The bad pass wrote the new n
      back into the roughness box, so the *next* recalculation — any keystroke, any radio, any unit
      change — used it and the numbers corrected themselves. Measured on the pre-fix code: clicking
      B/B showed Q = 34.6362 for exactly one render, then 17.0119 from the second recalculation
      onward. A wrong number for one render is still a defect, but "you would size a channel
      believing it carries 34.6 cfs" was an overstatement and is withdrawn.
    - **In the SOLVER it PERSISTED, and that is the real harm — because the solver's damage is an
      INPUT.** `solveForY` calls `mtc_iterate` once per TRIAL DEPTH, reading n from the form, so a
      single-pass iterate used the form's n at every depth instead of the roughness method's n at
      that depth. It then writes the result into the DEPTH BOX. No number of further triggers can
      heal that: recalculating merely re-derives the correct Q at the wrong depth. Measured pre-fix,
      asking for **60 cfs with B/B on gave y = 3.6219 ft and Q = 66.97 — and it stayed 66.97
      through every subsequent recalculation**, 12% over target, reported as success. Fixed:
      y = 3.4584 ft and the page shows exactly 60.
    - **This is also the argument for fixing the shared iteration rather than adding a recalc
      trigger** — Tom's first proposal, and a correct and sufficient fix for the form. It would
      have been entirely inert for the solver, whose 38 `mtc_iterate` calls per press never touch
      `pageCalculator` at all (it runs once, at the end).
    - **The lesson for the harness, not just for this bug:** the original assertions measured a
      SINGLE `pageCalculator` call, which is the transient state a browser passes through and not
      the state a user reads. `mtc-harness.js` now also asserts the invariant that has no such
      ambiguity — *solve for a Q and the page must then show that Q* — across all four roughness
      methods and two targets.
  - **DEFECT 2 — the safety factor was applied to a d50 the user TYPED.** With no rock radio the
    loop did `d50_in = p.d50_safety * d50_calc` on a `d50_calc` that was simply the typed value.
    The factor exists to scale a CALCULATED rock size; there is nothing to scale when the user
    names the rock. The page rightly never wrote that inflated number back into the form, so its
    only visible effect was the P&I range check — which was testing 1.25× the rock asked for. This
    is the one Tom spotted, and it is the smaller of the two.
  - **The fix is to decide which loop is running ONCE, from the radios, and iterate until BOTH
    unknowns have settled** — rather than inferring it inside the loop by letting each `switch`'s
    default branch set `iterate_p = false`. No separate final pass: once n has *settled* (not
    merely been updated), the `v` computed from the previous n is the same `v`, which is the whole
    point of iterating to convergence.
  - **Verified across all 16 roughness × rock-size combinations**, now a standing assertion in
    `mtc-harness.js`: the velocity on the page is the velocity the displayed n produces. The twelve
    combinations that were already correct are unchanged to within 0.04%.
  - **`d50` default moved 6 in → 4 in (150 → 100 mm), Tom's call, 2026-08-14.** Once the range
    check read the typed rock, the P&I window is 0.28–0.36 ft = 3.36–4.32 in, so the page's own
    default was outside it. 4 in (0.333 ft) is mid-window and the page now opens on a clean ✓
    everywhere. **Tom first proposed 3 in (0.25 ft)** — reasonable, and it *appeared* to clear the
    warning while the check was broken (1.25 × 3 = 3.75 in landed in the window by accident); with
    the check fixed it is below the 0.28 ft floor. Worth remembering as a case where a defect made
    a wrong value look right.
  - **The `KNOWN_DEFAULT_WARNINGS` exception added for this in `all-calcs-smoke-harness.js` lasted
    one day and is now empty** — the right outcome for an allow-list. It is not kept "just in case".


## Task 292

- 0|292| **[DONE 2026-08-13] Give the non-lpn calculators a behavioural test.** Shipped as
  `dev/calc-spike/` (3 harnesses, 198 assertions) plus `dev/scripts/dump_calc_form.php`,
  `dev/scripts/render_page.php` and `dev/scripts/run_calc_harnesses.sh`, wired into
  `check_all.sh` as a blocking check. Runs in ~3 s.
  - **`all-calcs-smoke-harness.js` covers ALL 15 calculator pages, both unit presets** (115
    assertions): the page's own `pageCalculator` runs on its own factory defaults, writes no
    NaN/Infinity/undefined/null into a results cell, and opens on a passing design. The page list
    is derived from the directory, so a new calculator is covered the day it ships.
  - **`mpf-harness.js` (36) and `mtc-harness.js` (47) test the two CORE calculators' math**, as the
    task asked. Three anchors each, weakest first: the published dimensionless tables (the circular
    hydraulic-elements table for mpf — 0.5/0.8/0.9/0.938 depths, and the Q peak at y/D = 0.938 that
    the page's own solver depends on; exact geometry identities for mtc), Manning's own
    proportionalities (V ∝ S^½, V ∝ 1/n, Q ∝ L^(8/3)), and one absolute hand-computed worked
    example with the arithmetic written into the comments. mtc additionally feeds its ITERATION's
    converged answer back into its defining equation — Strickler, P&I, B/B, Isbash, Maynord,
    Searcy — because a converging loop that stops early still returns a number.
  - **Mutation-tested before being trusted.** Five deliberate defects planted in the calculator JS
    (wrong Manning exponent, perturbed geometry, wrong wetted perimeter, wrong Strickler constant,
    iteration cut to a single pass) — all five caught, none needed a browser.
  - **NOTHING ABOUT THE FORM IS RESTATED IN A HARNESS**, and that was the design decision that
    made this cheap. `dump_calc_form.php` renders the real page and hands the harness the form it
    actually shipped — field names, defaults, unit selects with families and options, both presets,
    pageConfig, script list. A hand-written form would be a second copy that drifts, testing itself
    while the page ships something else. It also buys coverage such a copy could not: an id a
    calculator writes to but the page no longer has now throws by name.
  - **FOUND ON THE WAY: `html_balance_check.php` had been checking a crippled page since the day it
    was written.** It `include`d each page from inside a FUNCTION, which runs the page's top-level
    code in that function's scope — so `$ec_lang` and the whole bootstrap landed as locals while
    every library function looking for them as globals found nothing. The page still rendered and
    still looked like a page: 22 KB of a 45 KB page, with 1 of its 17 unit selects. Every "ok" it
    printed was about that stub, so the results table — the part most likely to lose a tag — was
    never actually checked. Fixed by routing it through the new `render_page.php`; all 25 pages
    still balance at full size.
  - **A page's SI defaults are reachable only through the LANGUAGE**, which is why the smoke
    harness renders everything twice. `EC_DEFAULT_UNIT_SET` derives from the language, and clicking
    SI afterwards reinterprets rather than converts — `units('si')` turns an 18 in pipe into an
    18 mm pipe, correctly, and uselessly as a defaults test.
  - **AND IT IMMEDIATELY EARNED ITS KEEP — see Task 308, two real defects in Manning Trap Channel
    found within an hour of the harness existing, one of them a 24–82% velocity error.** That is
    the argument for extending worked examples to a third calculator, not for stopping here.
  - **What is left, stated rather than rounded off:** 17 calculators are checked for RUNNING, not
    for being RIGHT — a wrong coefficient in Rock Chute or Orifice Drain Time still ships silently.
    That is the intended shape (the task said not to attempt all 19 at once, and to test what is
    being edited), and `dev/calc-spike/README.md` carries the under-an-hour recipe for adding the
    next worked example. Row-table calculators (Branched-Network, Irrigation-Pressure,
    Manning-Irregular, Weir-Flow-Irregular) run, but the results inside their dynamic rows are not
    checked: building the rows needs a richer DOM than `calc-page.js` has, and the smoke harness
    names them as it goes rather than passing them silently.


## Task 293

- 0|293| **[DONE 2026-08-13] Extract the pure functions out of `js/looped-network.js` so the map
  editor becomes testable.** Shipped as `js/lpn-geom.js` (151 lines) and `js/lpn-collide.js` (144),
  with `dev/lpn-spike/geom-harness.js` (45 assertions) and `dev/lpn-spike/collide-harness.js` (28).
  `looped-network.js` went 8,765 → 8,667 lines; the point was never the line count.

  **The split is by PURITY, not by subject.** Both new files take values and return values — no
  DOM, no `doc`, no `nodeEls`, no settings, no closure variables — which is what makes them
  `require()`-able from a harness. "Split it into files" was explicitly not the task: a module that
  still reached back into the editor's closure would be exactly as untestable, one file further
  away. What stayed behind in `looped-network.js` is the GATHERING — turning `doc`, the element
  handles and the current font size into plain arguments — and that is right where it belongs.
  - **`lpn-geom.js`** — `polylineLength`, `polylinePointsAttr`, `pointAlongPolyline`,
    `dodgeAlongPolyline` (the flow-arrow dodge), `leaderAttachX` / `leaderAttach` (the side-flip
    hysteresis), `dataLabelBoxHeight`, `maskRect`.
  - **`lpn-collide.js`** — the weights, `pushLeaderSamples`, `boxTopLeft`, and the four-iteration
    `relax()`.

  **These are the FIRST harnesses in `dev/lpn-spike/` that simply `require()` their subject.** Five
  earlier ones read `looped-network.js` as TEXT and brace-match a function out of it, because
  nothing in that file could be reached any other way. That trick works but it tests a *copy* in a
  context the browser never has — a function lifted out of its closure sees whatever stubs the
  harness happens to define, so a harness can pass while the real call site is broken. What runs in
  the two new harnesses is byte-for-byte the module the page loads.

  **Proved behaviour-preserving before the new tests were trusted at all.** A throwaway fuzz
  compared every lifted function against its pre-refactor body from `git show HEAD:` over 4,000
  random link geometries (bends, degenerate zero-length links, out-of-range fractions, random
  symbol scales and arrow sets): **24,000/24,000 comparisons bit-identical**. The relaxation loop
  was verified by text diff instead — every difference is the parameterization or comment
  rewrapping, no logic. Without that step this would have been a rewrite wearing a refactor's
  clothes, and the new assertions would only have been asserting the new behaviour.

  **One real finding, recorded rather than fixed.** Against a half-strength obstacle (a node
  SYMBOL, weight 0.5 vs a label's 1) the relaxation removes only a third of the remaining overlap
  per pass, so **four passes stop short**: from a 2-unit overlap it leaves ~0.31, i.e. a data label
  resting slightly on a node symbol. It does converge given ~40 passes; the weight slows it, it does
  not stall. Nobody had seen this because nothing could measure it, and whether 0.3 world units is
  worth another iteration or a different weight is Tom's call, not the harness's — so
  `collide-harness.js` asserts the *actual* numbers, and any future change to either shows up as a
  diff instead of a surprise.

  **Two incidental fixes it forced.** `popup-tips-harness.js` used a DIRECT `eval`, which hoists its
  own `var EngCalcs` and starts a second, empty one — survivable while the solver was only read
  later, and fatal the moment `looped-network.js` began reading `EngCalcs.lpnGeom` as its IIFE runs;
  it now uses indirect `(0, eval)` like `lpn-dom-stub.js`. And `check_all.sh` labelled the harness
  step "(12)" while 15 scripts were actually running — the count is now derived from the glob, since
  a stale number in the checklist is the same defect the checklist exists to remove. It reads (17).


## Task 300

- 0|300| **[DECLINED 2026-08-13] A "New project" wizard picking units AND friction method
  (extracted from Task 271, then declined the same day).**

  **The arithmetic was right and the premise was wrong.** Tom: *"The reason we need a wizard is that
  two rows becomes six. Does that make sense?"* It does — `File > New` has four rows today (2 blank,
  2 example) and making the method a menu-level choice takes the blank half from 2 to 6. (Not to 12:
  Task 271 made the EXAMPLE force Hazen-Williams, so the example rows do not multiply.) Six rows
  stops being a template list and becomes a Cartesian product — a form pretending to be a menu.

  **But the method does not belong in that menu at all, and the reason is specific.** Units earned
  their two rows because a single row *"inherited whatever units happened to be on the strip, which
  is the one thing left on this page that decided a project's units by accident"* (Tom, 2026-08-10).
  Method looks symmetric to that and is not: **the danger of a wrong unit or a wrong method is
  entirely about EXISTING numbers changing meaning, and a blank project has none.** No pipes, no
  roughness values, nothing to misread.

  **And the one hazard that WAS real is already closed — by Task 271, not by this task.** All three:

  | Danger | Closed by |
  |---|---|
  | An example carries a method implicitly | The example forces `hw` |
  | Switching method on a network with pipes | Confirms first |
  | A blank project inherits a stale roughness default | `settings.defaults.roughness` follows the method |

  That third row is the load-bearing one and it is easy to miss: `newProject()` inherits `settings`,
  so a blank project made from a Manning project inherits **both** `method: 'manning'` **and**
  `roughness: 0.013`. The inherited pair is self-consistent, which is exactly what makes the
  inheritance harmless here and dangerous in an example (where the roughness is fixed at C = 130).

  **What a wizard would have bought is CLARITY, not safety** — telling a new user that a friction
  method exists. **Tom, 2026-08-13, naming that more exactly: *"It amounts to nothing but
  advertising. We can do that better other ways."*** That is the sentence to remember, because it
  generalizes past this task: a feature announcement wearing the costume of a required choice is
  still an advertisement, and the creation path is the worst place to put one — it taxes the most
  common action, every time, forever, to deliver a message that lands once. It would also cost ~4
  new keys x 26 languages now that `lpn_` is a core calculator.

  **The better ways already exist or are already tasked.** The map status strip reports the method
  continuously (`refreshMapStatus()`: "Friction method: Hazen-Williams"), where the user is already
  looking and at no cost to anything. Beyond that, telling people what this calculator can do is
  **Task 222**'s job (positioning) and the Help menu's (Task 250, shipped) — a place someone GOES to
  find out, not a door they must push through to start work. Route any future "but users won't know
  about X on `lpn_`" impulse to those, not to the New menu.

  **Reopen only on evidence**: a real user who is confused about which friction method they are in.
  The map status strip already reports it continuously (`refreshMapStatus()` shows
  "Friction method: Hazen-Williams"), which is the cheap version of the same clarity and already
  shipped. **Do not reopen on the symmetry argument alone** — that method and units are both
  project properties is true and is not sufficient; the asymmetry above is the point.

  Original entry follows.

  **A "New project" wizard picking units AND friction method (extracted from Task 271,
  2026-08-13).** Task 271 made the friction method switchable but left project creation alone. Its
  own proposal was to collapse the two "Blank project" menu rows into ONE row plus a wizard that
  asks for units and method up front, because 2 units x 3 methods is six menu rows and a menu is
  the wrong shape for that.
  - **Tom's reason, and it is a safety argument rather than a tidiness one:** *"being unaware of
    those on a new project (model) is dangerous."* A method inherited silently from the last
    project is a roughness number that means something else than the user thinks.
  - **Not urgent, because 271 closed the danger another way:** the default is `hw`, the Example
    forces its own method, and switching on a network with pipes asks first. So this is now a
    clarity improvement, not a hole.
  - **It REVERSES a shipped decision**, which is why it is its own task: the two-row units split
    shipped 2026-08-10 and was right for units alone. Weigh the reversal deliberately.
  - `openDialog()` is the pattern.


## Task 271

- 0|271| **[DONE 2026-08-13] Give `lpn_` a friction-method choice: HW, DW, Manning.**

  A select in Settings, Computation writes `settings.method`; `frictionMethod()` had been reading
  it since Task 254 with nothing anywhere writing it, so the page was Hazen-Williams-only in
  practice. Every label is borrowed from `bpn_` (`bpn_method`, `bpn_method_hw`/`_dw`/`_manning`,
  `bpn_roughness_tip`), so the control itself cost **no new keys**.

  **Roughness is three quantities wearing one field, and that is the whole difficulty.** Manning n
  and HW C are dimensionless; Darcy-Weisbach e is a LENGTH. Same design as `bpn_`'s
  `bpnUpdateMethodUI()` rather than a second one — one field whose symbol (`n`/`C`/`e`, untranslated
  per CLAUDE.md's `symbol` rule), tip and units follow the method. New `lpn_u_roughness` selector
  (family `roughness`), **shown only under Darcy-Weisbach** and hidden rather than removed so it
  keeps its family and stays visible to the us/si presets.

  - **`roughnessSI()` is the dangerous line.** `js/lpn-solver.js` hands roughness to
    `lpnDwFriction(q, d, e, visc)` with `d` already in SI metres, so e must be metres too or the
    relative roughness e/d is wrong by the unit factor — converging happily, every number
    plausible, nothing on screen saying otherwise. Same shape as the Task 255 length bug. The
    harness therefore checks it against a **hand-computed** value, never against the app's own
    `toSI`, and checks the mirror bug too (n and C must NOT be converted).
  - **Switching the method converts nothing, and asks first when pipes exist.** C = 130 read as a
    Manning n is not a rough answer, it is nonsense by four orders of magnitude, and unlike a unit
    switch nothing on screen changes except one letter. Consistent with the suite-wide ban on
    converting inputs on a unit switch (CLAUDE.md, Unit Sets); it asks because there is no unit
    strip to make the change self-evident afterwards.
  - **`settings.defaults.roughness` follows the method** (130 / 0.013 / 0.0015 m in the displayed
    unit) — future elements only, per the Default inputs section's own rule.
  - **A trap this task CREATED, found and fixed here: the example had to force Hazen-Williams.**
    `newProject()` inherits settings from the project you were in, so once the method was
    switchable, a visitor on Manning who chose Example got a ring main carrying n = 130. The
    example now forces `hw` exactly as it forces its units — Tom's own rule, *"We never create an
    example based on the current units... We should force the units we want and label thusly."*

  **`dev/lpn-spike/friction-method-harness.js`, 31 checks, in `run_harnesses.sh`.** Mutation-tested:
  dropping the DW conversion, converting the dimensionless methods, never writing `settings.method`,
  removing the confirm guard, always showing the unit row, and letting the example inherit the
  method fail 2, 2, 5, 3, 2 and 1 checks respectively. `lpn-dom-stub.js` gained the `roughness`
  family so every harness sees the same eight-family strip the page has.

  **NOT BUILT, deliberately — the blank-project WIZARD.** This task also proposed collapsing the
  two "Blank project" menu rows into one row plus a wizard picking units *and* method, on the
  argument that 2 units x 3 methods is six rows. It is not built, and it should be a separate
  decision rather than a side effect of this one: it **reverses a two-row split shipped 2026-08-10**
  that was right for units alone, and it is a visible menu change Tom should weigh on its own
  merits. Nothing here depends on it — the method has a safe default (`hw`), the example forces its
  own, and switching asks. **Extracted as Task 300.**

  **Cost: 1 new key x 26 languages.** `lpn_method_switch_confirm`, the guard's text.

  Original entry follows.

  **Give `lpn_` a friction-method choice: HW, DW, Manning.** Tom, 2026-08-10. `bpn_` has
  one; `lpn_` hardcodes `hw`. `assembleModel()` and the map readout already read `frictionMethod()`
  (`settings.method || 'hw'`), and `bpn_method`/`_hw`/`_dw`/`_manning` are translated, so a control
  writing `settings.method` is the missing piece.
  - **The solver already does all three** — `lpnResistance()` branches on manning/hw/dw, and DW
    iterates on friction factor in `lpnSolve` and `lpnReport`. UI task, not numerics.
  - **The real cost is ROUGHNESS**: C, absolute height ε (a LENGTH, so a unit family), n. Label,
    unit, default, validation and `settings.defaults.roughness` all change with the choice.
  - **A new project must be INTENTIONAL about both** — Tom: *"being unaware of those on a new
    project (model) is dangerous."* 2 units × 3 methods is six blank menu rows, so **"Blank project"
    collapses back to ONE row plus a WIZARD picking units and method.** That reverses the two-row
    split shipped 2026-08-10, which was right for units alone. `openDialog()` is the pattern.
  - **Examples carry a method implicitly**: their roughness is HW C = 130, nonsense under Manning.
    Fix them to HW, or give each one a method.


## Task 146.07

- 0|146.07| **[DONE 2026-08-13] Open/Closed link property (Task 146 child).**

  **The feature was ~90% built and unreachable.** `_status` was already written at `addLink()`,
  serialized with the project, listed in `LPN_OVERRIDABLE`, read by `assembleModel()` through
  `effective()`, honoured in four places by `js/lpn-solver.js`, and parsed from an EPANET `.inp` by
  `js/lpn-inp.js`. `js/looped-network.js` even said so at the declaration: *"Task 146.07 will
  surface it."* All that shipped here is `closedField()` — one checkbox — plus the two things that
  were genuinely missing.

  - **A closed pipe is DASHED on the map** (`.lpn-link-closed`). Without it a closed pipe is
    pixel-identical to an open one while carrying no water — an invisible cause for a network that
    will not solve, or that solves to a surprising answer. Dash lengths are in world units scaled
    by `--lpn-sym`, so they hold their proportion at every zoom instead of dissolving into dots.
    Colour is deliberately unchanged: a closed pipe is still the same pipe, and recolouring would
    collide with the per-field label colours.
  - **The label is "Closed", not "Open", though `'open'` is the stored default.** The state worth
    seeing is the exceptional one. A ticked box beside "Closed" reads as a deliberate act; an
    unticked box beside "Open" would make every ordinary pipe look switched off.
  - **Offered on pumps too**, since the solver's status check is on the link, not the type, and
    EPANET can close a pump. It sits outside `renderLinkFields()`'s pipe/pump branch for that reason.

  **`dev/lpn-spike/closed-link-harness.js`, 18 checks, in `run_harnesses.sh`.** This is the shape of
  change that LOOKS finished after one browser click — the box ticks, the pipe goes dashed — while
  the half nobody can see from the map goes unverified. The harness closes a pipe *through the
  checkbox* on the example ring and asserts the closed pipe carries exactly zero flow, that the flow
  redistributes round the ring, that the state survives `serializeProject` + `applySaved` +
  `buildDom`, that closing takes an undo snapshot, and that reopening restores the original flows to
  1e-6. **Mutation-tested**: breaking the checkbox write, the map class, or the status handoff to
  the solver fails 8, 3 and 3 checks respectively, so it is not passing vacuously.

  **Cost: 2 new keys × 26 languages = 52 outstanding.** `lpn_field_closed` and its tip. `lpn` is a
  core calculator (Task 251), so a new `lpn_` key now owes every language, not the core four —
  worth pricing in before adding keys to this page. Payloads regenerated; no sprint launched.

  Original entry follows.

  **Open/Closed link property (Task 146 child).** A simple boolean state on a link. Tom,
  2026-07-29: explicitly not a "valve" and not modeled via minor-loss-coefficient (Km) abuse — just
  a plain open/closed state, kept simple.


## Task 250

- 0|250|[H] **[DONE 2026-08-13] Where do we explain lpn at all? A Help menu on the page.**

  **Shipped and confirmed by Tom 2026-08-13.** `openHelpMenu()` in `js/looped-network.js` — the menu
  landed in `a9b7a9e` (Walkthroughs moved into a Help menu) and `956fb5e` (Contact and About added,
  with icons). Rows: **Walkthroughs** → Tom's own blog post on the looped calculator, **Contact**,
  and **About** → `About.php`, About last "where every other Help menu in the world puts it".
  The `[H]` gate — Tom decides the menu shape before it is built — was met the same day: *"We can
  repeat About and Contact in this new Help menu."* That duplication of the navbar is deliberate and
  the code says why: the navbar serves somebody CHOOSING a calculator, this menu serves somebody
  already INSIDE one who wants to know who wrote it or how to complain. Both reuse existing keys, so
  the whole feature cost **no new translation** — worth noting now that `lpn_` is a core calculator
  and every new key owes all 26 languages.

  **One residual, and it is Task 222's, not this one's: `About.php` never names EPANET.** It covers
  the licence (Libre/GPL), offline use and the language count, but the engine claim — the thing Task
  243 actually built — is invisible on every page including this one. This task's own text already
  routed that (*"positioning nobody can read is not positioning"*), so it closes as the DOOR being
  built and 222 keeps the CONTENT. Do not reopen this to write copy; that is 222.

  Original entry follows.

  **Where do we explain lpn at all? A Help menu on the page.** Tom, 2026-08-09, after
  the EPANET toggle shipped: *"Where are we going to discuss, explain, or feature this? Does lpn
  need its own Help menu in the pull-down and the toolbar after Settings? Help > About and Help >
  I don't know what else (Videos? I already have two. Features? Discover?)."*
  - **The real gap is that lpn has no front door.** Every claim we just built — real EPANET
    engine, GPL, offline, 26 languages — is invisible on the page itself. That is also Task 222's
    unfinished half: positioning nobody can read is not positioning.
  - **Tom already has two videos.** Linking what exists beats authoring anything new, so the
    cheapest real version is Help > About (what this is, what engine, what licence, link to
    About.php) + Help > Videos. "Features"/"Discover" needs content that does not exist — do not
    scope it until something is written.
  - **[H] Tom decides the menu shape before this is built.**


## Task 249

- 0|249| **[DONE 2026-08-12, closed 2026-08-13] Translate the 5 `lpn_` engine keys — now into
  all 26, not the core four.**

  **Verified closed 2026-08-13:** `lpn_settings_engine_epanet`, `lpn_engine_loading`, `_failed` and
  `_manning_note` are translated in all 26 languages — spot-checked in `zh`, `sw` and `am`, i.e. one
  core-adjacent and two 0.65-tier languages. This task correctly predicted its own closure: it said
  the five keys would ride along with `lpn_`'s promotion to a core calculator rather than being
  scheduled separately, and that is exactly what happened in the Task 297 sprint. `lang_parity_check`
  now reports 0 missing and 0 equal-to-english suite-wide. Nothing was left to do.

  Original entry follows.

  **Translate the 5 `lpn_` engine keys — now into all 26, not the core four.**
  `lpn_settings_engine_epanet`, its tip, `lpn_engine_loading`, `_failed`, `_manning_note`. English
  shipped 2026-08-09. **Rewritten 2026-08-11:** this used to say "es/pt/fr/tr only, because `lpn_`
  is not a core calculator", which stopped being true the moment Task 251's declaration landed.
  There is nothing left to schedule separately — these five are now five of the ~273 keys per
  language that `lpn_`'s promotion owes, and they go with that sprint.


## Task 240

- 0|240| **[DONE, closed 2026-08-13] `lpn_project_copy_suffix` carries a load-bearing leading
  space.**

  **Verified closed 2026-08-13:** the English key is now `'(copy)'` with no leading space
  (`lib/lang.ec.en.php:1239`), and both call sites concatenate the separator themselves
  (`js/looped-network.js:3873`, `:5515` — `... + ' ' + (pc.lpn_project_copy_suffix || '(copy)')`),
  which is exactly the fix this task prescribed. **All 27 language files were re-checked for a
  surviving leading space and none has one** — worth stating, because the failure mode this task
  named (a translator or tool silently stripping leading whitespace) would otherwise reappear one
  language at a time rather than all at once.

  Original entry follows.

  **`lpn_project_copy_suffix` carries a load-bearing leading space.**
  `" (copy)"` is concatenated straight onto a project name (`js/looped-network.js:2831`, `:4161`), so
  the leading space is functional — and leading whitespace is exactly what a careful translator or a
  translation tool strips. **Fix:** move the space to the call site so the translatable string is
  `(copy)` and cannot be silently broken.
  - **The `lpn_ago_*` half of this task was WITHDRAWN 2026-08-08 — the finding was wrong.** The Wave 0
    agent claimed the fragments were spliced into `"{x} ago"` and that Spanish therefore could not
    render them. **Tom caught it:** *"Spanish can say 'hace {minutes} minutos' while English says
    '{minutes} ago'. The concept is good. Did you misunderstand and build it wrong?"* No — it was
    built right. `"ago"` lives in the **host** sentence, never in the fragment: en
    `the last edit was {x} ago` / es `la última edición fue hace {x}`, with the fragment supplying
    only `{n} minutos`. Composed, Spanish reads *"la última edición fue hace 5 minutos"*, and has
    been shipping correctly all along.
  - **Kept as a record, not deleted**, because a withdrawn finding is data about the *pass*: an
    adversarial reviewer over-calls, and the orchestrator relaying it without checking the composed
    output is the failure mode to watch. The general caution still stands — a run-time sentence
    fragment IS a latent i18n defect — but this particular instance is a correct implementation.


## Task 146

- 0|146| **[DONE 2026-08-13] Looped pipe network calculator with a map interface — new page `lpn_`.
  Scoped with Tom 2026-07-28; was "Looped-network (Hardy Cross) solving", extracted from Task 137 on
  2026-07-27.**

  **CLOSED WITH FOUR CHILDREN STILL OPEN, AND THAT IS THE CORRECT CLOSE — read this before
  reopening it.** 146.04 (report tables), 146.05 (element browser), 146.07 (Open/Closed link) and
  146.09 (map insets) are unbuilt. They do **not** block, for the reason this project's own
  parent-closing rule gives: *extract the unbuilt work into its own tasks first, because blocks in
  `## Completed` are never re-scanned.* **That extraction happened on 2026-07-29** — it is exactly
  what created 146.01–146.09. The precondition was met six weeks before this close.

  What kept the task open afterwards was the dotted ID *looking* like containment. It is not; this
  file's own format spec says so at the top: a dotted task is "still a full `Priority|ID|status`
  bullet like any other task, just grouped under its parent by ID rather than living inside the
  parent's prose." **Grouping, not blocking.** The precedent is inside this very task: Phase 4 was
  extracted as **Task 145** and nobody ever thought 145 blocked 146. The four dotted children are in
  the identical position — own IDs, own priorities, visible on every pass, and each one closes on
  its own merits whenever it is built.

  Two things make this safe rather than merely convenient. **The design record does not live here** —
  `dev/looped-network-calculator-scope.md` carries the GGA-not-Hardy-Cross rationale, the 10–20 node
  target, the cut list, the scope-gravity warning, the backdrop reasoning and what Phase 0.5
  disproved, so nothing is lost to a section that is never re-scanned. And **the nine tasks that
  merely originated during this build were retagged first** (2026-08-13, see below), so no wishlist
  item was silently closed along with the parent.

  **The generalizable lesson, because this cost six weeks of a misleading priority-85 slot: a parent
  feature task should close when its scope is SHIPPED, not when its idea list is EMPTY.** A living
  page keeps generating ideas; if the parent waits for them it never closes, and its priority
  becomes a lie about what is next. Tom, 2026-08-13, on the thirteen tasks then filed under it:
  *"If these block 146, it will never close."*

  Everything below is the original entry, kept as the decision log.
  A canvas/map-centric calculator where the interface *is* a drawing surface: elements (Junction,
  Pipe, Reservoir, Pump, Text) added from a toolbar, properties edited in a popup, loops solved to
  convergence. Full design record: **`dev/looped-network-calculator-scope.md`** — read that before
  starting anything; this entry is the summary and the decision log.

  **Three corrections to the entry this replaces, each a real change of direction:**
  1. **New page and new prefix — not "extend `bpn_` (or build alongside it)".** `bpn_` /
     `Branched-Network.php` stays exactly as shipped; the row-table form is genuinely better for a
     simple series run, and this is a different UX with a different audience. `lpn_`,
     `Looped-Network.php`, `js/looped-network.js`.
  2. **Global gradient algorithm (Todini), not Hardy Cross.** Hardy Cross needs an explicit
     independent-loop set, pseudo-loops through every pair of fixed-head sources, and an initial flow
     distribution that *already* satisfies continuity at every node — all of which get re-derived
     every time a user draws one more pipe on a map. GGA needs none of the three and is
     Newton-quadratic. Hardy Cross is now recorded as the method **not** chosen, with that reason.
  3. **Target scale is ~10–20 nodes, and that is a design decision, not a shortfall (Tom).** An
     engineer with a 200-node model would rather crack open EPANET, and 200 nodes is past the
     comfortable usability limit of a browser canvas unless we are *very* good at this. **Our
     strength is the map interface, not capacity.** 200 nodes survives only as a headroom check —
     we must not fall over — never as the sizing target. This single decision **deletes the hardest
     part of the solver**: at 20 nodes a dense Cholesky is ~30 lines and microseconds, so the CSR /
     conjugate-gradient / fill-reducing-ordering machinery is **cut, not deferred**.

  **Identity strings** (decided 2026-07-28): menu "Looped Pipe Network (Map Interface)"; title "Free
  Online Looped Pipe Network Calculator with Map Interface"; desc "Pressure and Flow in a Looped Pipe
  Network You Draw on a Map". **"…on a Map" alone was rejected**: it reads as a *geographic overlay*,
  which is Phase 4 and may never ship, whereas what actually distinguishes this page is that the
  interface is a drawing surface. Do not let a later edit quietly shorten it back.

  **Gate: satisfied.** Task 137's original gate was an OR — "after we're map-mashup experts **or**
  users ask" — and it is now moot from a third direction: Tom committed to the calculator directly,
  and Task 145 moved here (below), so this page is *how* we become map-mashup experts rather than
  something waiting on it. Task 144's finding is still welcome evidence but is no longer a blocker.

  **Commit direct to `master` (Tom, 2026-07-30 cleanup — this project does not normally use
  branches; the per-phase `lpn-solver`/`lpn-labels` branches this task used through Phase 2 were an
  inconsistency with the standing no-branching policy already recorded elsewhere in this file, e.g.
  the entity-migration task below, not a deliberate exception. Both branches were fast-forward-merged
  into `master` and deleted 2026-07-30.)** The scope doc and these roadmap entries are planning
  artifacts and belong on `master` as always.

  **Biggest standing risk is scope gravity toward EPANET.** The scope doc opens with a "Cut, not
  deferred" list (extended-period simulation, water quality, PRV/PSV/FCV, demand patterns, energy
  cost, **Tank** — Tom is right that it is a time-modeling element in a steady-state tool). Second
  biggest is translation cost: ~85–95 new keys ≈ 1.7× the `bpn_` sprint, which is why **Phase 1
  ships English-only** and the sprint waits until the string set stops moving.

  **Phases. Risk is carried by two cheap spikes rather than by the old gate.** The two spikes are
  **independent of each other**, so a failure in one wastes nothing from the other, and each is a
  real abort point. (These were briefly filed as separate Tasks 171/172 on 2026-07-28 and folded back
  the same day — the "extract unbuilt phases to their own task" lesson from Task 137 applies to
  *closing a parent*, because blocks in `## Completed` are never re-scanned. This parent is open and
  gets scanned every pass, so extraction bought nothing and only scattered the design.)

  - **Phase 0 — canvas spike. DONE 2026-07-29, on branch `lpn-solver`.** `dev/lpn-spike/canvas-spike.html`
    (standalone, no PHP/lang keys/solver/persistence) plus the full round-by-round record in
    `dev/lpn-spike/phase0-acceptance.md`. Settled the technology empirically: **SVG DOM
    (`createElementNS`, not `innerHTML` rebuilds) is the chosen technology** — 12 rounds of on-device
    iteration with Tom plus an independent Opus subagent review found no SVG-blocking issue, so the
    Leaflet + `CRS.Simple` fallback was never triggered. Demonstrated: pan, wheel zoom about the
    cursor, pinch, double-tap zoom, click-to-popup with a writeback field, node/vertex/label drag,
    **arbitrary-vertex link editing** (not capped at one — see the Phase 1 note below), zoom-extent
    fitted to rendered extent (not bare coordinates), a draggable label with a leader (Arabic and
    Amharic shape and order correctly), a two-point-registered backdrop image with separate Scale/
    Position steps, a 200-node headroom grid, and print output. On-device phone pass (drag
    smoothness, pinch vs. page scroll, tap-target size) confirmed 2026-07-29. Real bugs found and
    fixed along the way — several are suite-relevant beyond this spike: SVG is a CSS replaced
    element and won't stretch from `position:absolute` insets alone (needs `width`/`height`
    attributes); combining top+bottom insets *with* an explicit height over-constrains the box per
    CSS2.1 §10.6.4 and silently drops one constraint; `setPointerCapture` retargets the synthesized
    `click` event to the capturing element on desktop Chrome, breaking naive tap-detection.
  - **Phase 0.5 — headless GGA solver. DONE 2026-07-29, on branch `lpn-solver`.**
    `js/lpn-solver.js` + `dev/lpn-spike/`; `node dev/lpn-spike/validate.js`, 46 checks, no network
    access or `node_modules` needed.
    **The reference is the real EPANET engine, not published tables:** `epanet-js` (EPANET's C code
    as WASM) runs EPA's Net1/Net2/Net3 and its output is committed. Result: heads within 0.0002 ft,
    flows within 0.004 gpm, continuity and energy residuals at machine precision, closed-form cases
    exact to 1e−12, and the head-loss kernel exact to 1e−12 against `branched-network.js`.
    **Three things this task said would be true, that the spike proved wrong** — recorded because
    they are the entire justification for spiking before building:
    1. *"Linearize below a flow cutoff Qmin."* Not sufficient, and not what EPANET does. A flow
       cutoff leaves the gradient unbounded just above it, so a near-zero-flow link gets an enormous
       conductance. Net3's pipe 333 oscillated between 0 and −2.28 gpm forever. The guard must floor
       **dh/dQ**, not |Q|.
    2. *"A 0.6 relaxation factor, without which pumps and emitters oscillate forever."* No such
       oscillation exists once the gradient floor is right — everything converges in 5–16 iterations
       with no damping. And the relaxation as specified was itself a bug: multiplying every flow by
       0.6 is arbitrary shrinkage, not under-relaxation, and would have destroyed the exact
       continuity the GGA update guarantees.
    3. *"200 nodes is ~2.7 M flops, a few milliseconds."* Off by an order of magnitude — it forgot
       the iteration count. Measured: 0.4 ms at the 21-node target, 30 ms at 201 nodes. The
       conclusion (dense Cholesky, sparse machinery cut) survives; the arithmetic did not.
    **Two requirements nobody anticipated**, both found by cases that only exist because the harness
    was written first: convergence must be normalised by total **demand** rather than total flow, and
    **stagnation detection** is mandatory — without it a large network burns 100 iterations and
    330 ms re-deriving the answer it had at iteration 6, on every keystroke.
    Also confirmed: **structural diagnostics run before the solve** (no fixed head / unreachable
    node named by id / node isolated behind a closed link), and this suite's Hazen-Williams differs
    from EPANET's by ~0.012%, so the solver carries both constant sets and defaults to ours.
  - **Phases 1–4 were originally scoped in the scope doc; Phase 1 is DONE** (shipped 2026-07-29,
    live as a PREVIEW page: page, toolbar, elements, popups, solve, autosave, diagnostics). Phase
    2 shipped most of its scope (labels, gear/settings panel, legend positioning, user-supplied
    backdrop image). **The rest of Phase 2/3/4's unbuilt items are no longer tracked as phases —
    reorganized 2026-07-29 into individually-prioritized child tasks 146.01–146.09 below** (plus
    Task 145, which already covers what was Phase 4), so each item's priority is visible instead
    of buried in phase prose. The scope doc retains the phase framing as historical narrative;
    ROADMAP priority is authoritative for what to work on next.

  **Backdrop: the network is drawn over a background, and the background is usually not a map (Tom,
  2026-07-28).** Nobody uses EPANET without a backdrop, and in practice that backdrop is a plan
  sheet, a CAD export, or a local aerial — **not** a Google map or Google aerial. So the primary
  backdrop feature is **a user-supplied image with a two-point scale/rotate registration**, in the
  page's own flat Cartesian world coordinates, with **no projection anywhere**. That is what EPANET
  itself does, it is a Phase 2-sized feature rather than a Phase 4 one, and it needs no API key, no
  terms of service, and no network connection — so it survives offline in the PWA. **Tiled online
  maps (Task 145) then become one more backdrop type that happens to arrive pre-registered**, not
  the foundation. Design consequence for Phase 0: the coordinate seam must be able to place and
  scale a backdrop image from day one, which is why the spike now includes one.
  **The canonical case is a screenshot with a bar scale on it** (Tom, 2026-07-29) — often a Google
  Maps screenshot, which is a completely different thing from a Google Maps integration: a plain
  image the user already has, no API, no key, no terms of service. It is also *why* two-point
  registration beats a scale-factor field: the user clicks the two ends of the bar scale and types
  what it says, which needs no knowledge of projections or units-per-pixel and works the same for a
  scanned plan, a CAD export, or a phone photo of a drawing on a wall. Make that the spike's
  backdrop acceptance test. A blank project carries placeholder text across the canvas — "Start by
  adding a background image using the toolbar." **The empty-canvas question is closed** (was open
  as of this paragraph's original writing; resolved by commit `7428ff0 Task 146: close the
  empty-canvas open question`, 2026-07-29) — a new project opens on the placeholder-text canvas
  above, not a worked example.

  **THE CLOSING AUDIT, 2026-08-13 — what shipped, and what was still open at the close.** Every
  phase this task declared is shipped: 0, 0.5, 1, and all of Phase 2 except two items. Four child
  tasks were still open, and they are the only four the scope doc ever *owed*:
  **146.04** (node/link report tables) and **146.05** (element browser) — both named in Phase 2's
  bullet; **146.07** (Open/Closed link) and **146.09** (map insets) — both named in Phase 3's.
  **They remain open and standalone; see the closing note at the top of this entry for why that is
  the right close rather than a loose end.**

  - **146.07 is nearly free and should go first.** The `status` field already exists on every link,
    defaults to `'open'`, serializes, is scenario-overridable, and is consumed by `js/lpn-solver.js`
    in four places; `js/lpn-inp.js` already reads `CLOSED`. `js/looped-network.js` says so at the
    declaration: *"Task 146.07 will surface it."* What is missing is a control in the Pipe popup.
  - **`(Task 146 child)` now means SCOPE, and only those four carry it.** Nine other open tasks
    (177, 181, 184, 185, 186, 191, 192, 201, 209) carried the same tag while being ideas raised
    *during* the build rather than work this task owed — 209 was even tagged "but suite-shaped."
    They were retagged **`(originated during Task 146)`** on 2026-08-13, which keeps the provenance
    a reader wants without letting a wishlist hold a shipped feature open. Nothing was deprioritized
    and nothing was closed by the retag itself; only the tag changed. **Do not tag a new `lpn_` idea
    as a child** — a child is something Phase 1–3 promised, and that list is permanently closed at
    four. Of those nine, Tom then ruled on all nine the same day: **177 turned out to be already
    built** and closed DONE; **209 was declined** (the Help menu's walkthroughs solved it from the
    other direction); 192 and 181 parked at 5, 186 at 8, 201 at 15; 184, 185 and 191 unchanged.
  - **Phase 4 (Task 145, the tiled-map mashup) does not block closure.** It was extracted to its own
    ID with its own priority precisely so it would not be buried, and Tom confirmed it 2026-07-29 as
    "maybe cool, try it sometime" at priority 11. It closes on its own merits, whenever.
  - **The design record does not need relocating.** `dev/looped-network-calculator-scope.md` already
    carries every load-bearing decision — the GGA-not-Hardy-Cross rationale, the 10–20 node target,
    the cut list, the scope-gravity warning, the backdrop reasoning, and what Phase 0.5 disproved.
    This block is a summary of that document, so moving it to `## Completed` (never re-scanned)
    costs nothing, which is the usual reason a parent like this cannot close.


## Task 177

- 0|177| **[DONE 2026-07-30, closed 2026-08-13] Link head loss: report the per-length gradient
  alongside total (originated during Task 146).**

  **This shipped 2026-07-30 and nobody closed the task**, so it sat open at priority 20 for six
  weeks describing work that already existed. Found 2026-08-13 when Tom said "I don't think there is
  any value here. We already have gradient" and proposed deleting it — he was right about the
  gradient and the task was checked rather than deleted, which is the only reason the record
  survived. **Deleting an open task is not the same as closing it**: a delete would have erased the
  evidence that the suite-convention question below was ever decided, and the next person to want a
  per-1000-length form would have re-derived the whole argument.

  **What was actually built** (`js/looped-network.js:8341` names this task in its comment): a
  `gradient` map-label field with its own colour and extrema bucket, a read-only "Head loss
  gradient" field in the link popup, and its **own `gradient` unit family** in `lib/Units.lib.php`
  — reusing the `slope` family's `grade`/`gradePercent` options but defaulting to `gradePercent`,
  because `lpn_`'s generic 2-decimal label formatter renders a typical pipe gradient as "0.00" in
  the ratio form. The open design question below was therefore answered: **this suite's own
  dimensionless convention won, and EPANET's per-1000-length form was not introduced.** One
  subtlety worth keeping: the divisor is `linkLengthSI()`, never `effective(l,'length')` — a
  gradient is dimensionless, so both sides of the division must be in the same unit system, and the
  numerator is a solver head loss in metres.

  Original entry follows.

  **Link head loss: report the per-length gradient alongside total.**
  Conventional network software and reports express pipe head loss in TWO forms, not one, because
  they answer different questions: **total head loss** (ft or m across the whole link — what you
  need to build the HGL/EGL, and what `lpn_` already reports) and a **per-length gradient/slope**
  (independent of how long the pipe happens to be — the form used to screen/compare pipes against a
  design criterion, e.g. "keep it under 5 ft per 1000 ft"). EPANET's own default Link Results table
  leads with the per-length form ("Unit Headloss", ft/1000ft or m/km) and derives total separately;
  WaterCAD/InfoWater-class tools show both as separate columns for the same reason. **`lpn_` should
  reuse this suite's OWN existing convention for this exact concept, not invent a new one**:
  `mpf_`/`mphl_` already report friction slope through the `'slope'` unit family
  (`lib/Units.lib.php`: `grade` = ft/ft or m/m, `gradePercent` = %) — a dimensionless ratio, not
  EPANET's per-1000-length form, but the same underlying quantity (head loss ÷ length) and already
  translated/established suite-wide. Add a link "Head loss gradient" field (`headloss/length`)
  alongside the existing total, using the `slope` family — parallel to how `headgain` just got
  split out from `headloss` as its own field/color/extrema bucket, not merged into it. Needs one
  new unit selector on the page (`echoUnitSelect('lpn_u_gradient', 'slope', '')`) and a
  `lpnFieldColors`/`linkFieldDefs`/`defaultLabelSettings` entry, same shape as every other field
  added this way. Not yet built — a real design question (does `lpn_` want `grade`/`gradePercent`
  like `mpf_`/`mphl_`, or is a per-1000-length form worth introducing as a second option) should be
  confirmed with Tom before wiring the selector, since it's the kind of suite-wide convention choice
  CLAUDE.md's concept-level reuse rule cares about getting right once rather than per-page.


## Task 209

- 0|209| **[DECLINED 2026-08-13] A snoozable tip system (originated during Task 146; suite-shaped).**

  **Tom, 2026-08-13: "It seems that we are getting along fine without tips especially since adding
  the Walkthroughs to our menu. What do you say we delete this task?"** Closed as declined rather
  than deleted, so the reasoning survives if anyone proposes it again — the problem it named was
  real (the page had only two states, shown-once-ever or shown-every-time), and the answer turned
  out to be **a place a user can go and look**, not a mechanism for interrupting them. The Help menu
  and its walkthroughs solved it from the other direction: pull instead of push, no snooze state to
  store, no per-tip translation cost, and nothing to dismiss.

  **The general shape, worth remembering before building any tip/onboarding mechanism here: a
  discoverable page beat a dismissible overlay, and cost less.** Reopen only if something genuinely
  needs to speak up *unprompted at a specific moment* — which is the one thing a menu cannot do, and
  which nothing has yet wanted badly enough.

  Original entry follows.

  **A snoozable tip system.** Asked for by Tom,
  2026-08-03, while reviewing Task 195's file-and-lock explanation: the page needs somewhere to put
  "here is what is about to happen" text that a user can dismiss for now and see again later, rather
  than the two states we have (shown once ever, or shown every time). Phase 2's training panel is the
  first instance and currently uses the crude version — **shown once per browser, keyed off whether
  an identity exists** — which is right for onboarding and wrong for anything a user might want back.
  Wants: dismiss, snooze, and a way to bring a tip back deliberately (a "show me that again" in
  Settings). Suite-shaped rather than `lpn_`-only: every calculator has explanations it currently
  either buries in Notes or repeats forever.
  - **Second concrete instance, 2026-08-06:** Save all switches tabs as it saves — ugly, but the
    honest consequence of the write path writing the OPEN project (punch list §3). Tom: *"Some sort
    of an explanation might be nice. But I don't know where or how unless we had a snoozable tip
    system."* That is this task, and it is why the priority moved 40 → 45: it now has two real things
    to say, and a tip system with nothing to say is scaffolding.


## Task 299

- 0|299| **[DONE 2026-08-13] A wrong `layout:` tag misled four translators, and now a check catches
  the class.** The tag on `$ec_lang_syn['lpn_backdrop_scale_entry']` said `nav item` — "competing
  for width with every sibling; prefer the shortest synonym" — describing a `<select>` that Task 276
  had already replaced with a menu button. In the Task 297 sprint bg, pt, uk and zh each compressed
  the label, and pt proposed shortening the English so all 26 would inherit the cut. **All four were
  reasoning correctly from a constraint that had been false for weeks.** Tag dropped.
  - **The hand audit of the other 22 tags found a second one**: `lpn_help_walkthroughs` is a row in
    the Help pull-down, not a bar item, and carried the same wrong tag. Finding a second instance
    while already looking for the first is the whole argument for a check over a careful read.
  - **A third defect was mine, from this sprint:** `lpn_backdrop_scale_entry_prompt` had
    `layout: <a whole sentence>`. CLAUDE.md says tokens are defined once in its table and prose does
    not go in the data. Now `runtime: units appended`, a defined token.
  - **`dev/scripts/layout_tag_check.php`, blocking, in `check_all.sh` (now 14 checks).** Verifies
    the value is in the vocabulary, a `column heading` really is inside a `<th>`, a `unit token` is
    named `u_*`, and a `nav item` is not merely a pull-down row. Free-form prose commentary is left
    alone — human-authored and legal.
  - **THE MUTATION TEST IS WHY THIS ENTRY IS WORTH READING.** The check passed on the clean tree and
    caught three of four planted defects — but silently passed a re-introduction of *the exact
    defect it was written for*. Cause: `Looped-Network.php`'s pageConfig bridge names every `lpn_`
    key, and the check read any PHP mention as proof of a real navbar render, exempting all of them.
    A green check that cannot fail on its own founding bug is worse than no check, and **only
    deliberately breaking it found that.** Two earlier self-inflicted bugs died the same way: a
    `REPO_ROOT` of `dev/scripts/../..` contains the substring `/dev/`, so the tooling filter
    excluded the entire repository (16 false findings), and `explode(';')` shattered `avoid:` prose
    that legitimately contains semicolons (8 phantom tags). **Plant the bug before believing the
    check** — see also the lpn harness suite, built on the same principle.
  - `ecLangSynRawValues()` added to `dev/scripts/lang_parse.inc.php` rather than kept private, so it
    inherits the possessive quantifiers that file documents at length — `$ec_lang_syn` holds the
    same multi-byte scripts that once silently truncated a parse to two thirds of a file.
  - **`mi_d50in` deleted from all 27 files.** The audit surfaced it as tagged `column heading` while
    being rendered by nothing, and its own `_syn` commentary already said `not used`. Tom ruled on
    sight: *"mi should no longer have any d50 keys."* Removed from the 27 lang files and from
    `english_string_hashes.json`. **The glossary's `median rock size` research note is KEPT** — it
    is a dated record of a 2026-07-13 cross-language pass that also covers `rc_D50`, which still
    ships, so deleting it would throw away research still in use.
  - **D50 has three owners and `mi` is not one of them.** Tom, confirming: *"mtc needs and has D50
    too. Keep. But not mi."* Verified intact and untouched — six `mtc_d50_*` keys, all rendered in
    `Manning-Trap.php`, all 27 files, plus `rc_D50`. Only `mi_d50in` went.
  - `median rock size` also unwired from `mi` in `prefix_terms.inc.php`, which follows from the same
    ruling: `mi_` now has no rock-sizing key at all, and `mi_notes_2_def` sends the reader to the
    Manning Trapezoidal calculator for rock lining — so the concept was being shipped to `mi_`
    translators as context for a decision they no longer make. Still wired to `mtc`, `rc`, `rrc`.


## Task 297

- 0|297| **[DONE 2026-08-13] ONE sprint cleared the whole standing translation backlog.** 26
  Sonnet agents, one per language, all launched at once. Final size 364 strings, not the 442
  scoped: Wave 0 deleted three keys before launch. Commits `1427049` (Wave 0) and `ff82beb` (the
  sprint and its QA), plus eleven agents that committed their own language as they finished.
  Delta is now zero, drift is empty, and `friction_check --sprint=297-backlog-26lang` closes 19
  entries with none open.
  - **Wave 0 deleted a feature, which is the best thing it did.** It caught
    `lpn_backdrop_wld_none` telling a lie — "No world file found" reported a search that never
    runs, as `offerWorldFile()`'s own comment said. Tom's answer beat the rewrite: *"We don't ask
    for world file. Those keys are obsolete. We ask for a paste of World File contents."* The
    dialog, its hidden input and three keys are gone; a harness assertion fails if any returns.
    **The general lesson is the one from sprint 251, now confirmed twice: a string that describes
    what the program DID is a claim nothing checks.**
  - **"Pixel size" had two readings** — the image's pixel dimensions, or the ground distance one
    pixel covers. Now "the size of one pixel on the map"; *map* is Tom's word over my *real*,
    and it is better because the reader is already looking at a map.
  - **The role-change detector paid for itself on its first sprint.** All 26 languages
    independently found `consent_decline` stale — a bare "Refuse" that had lost the temporal
    sense while `consent_accept_all` already said "always". Twenty-six agents converging on one
    repair is as strong as evidence gets that the flag was right.
  - **One translation defect survived to QA: hi shipped `विश्व फ़ाइल`**, where विश्व is the plain
    Hindi word for world/universe — the planet calque the glossary forbids in its first `avoid`
    entry. Fixed to `भू-संदर्भ फ़ाइल`. **No mechanical check can catch this**; reading all 26
    shipped values side by side is what did, so that comparison is now part of post-sprint QA.
  - **Three agents (de, id, sw) wrote `$ec_lang_syn` into their own language file**, which that
    array forbids. Removed, all 26 verified back to baseline. The es agent hit the same reading
    and escalated instead — the suggestion box working. Three of 26 misreading one line means the
    defect was the brief; the fixing sentence is in the friction log for the next sprint to copy.
  - **`world file` is now a glossary term** with an `avoid` array whose lead entry is that its
    "world" is a coordinate space, not the planet. All 26 renderings recorded, split three ways
    (descriptive georeferencing / English kept / transliterated) and **marked as proposals, not
    standards**: 14 agents said outright they could not verify a term in their language. Tom then
    supplied the `_syn` payload — *World (Map Coordinates or Georeference) File for the image* —
    and *"I like 'georeference' very much!"*, which is what 14 of the 26 had already chosen.


## Task 291

- 0|291| **[DONE 2026-08-13] Suffix vocabulary the hygiene check cannot judge, and a human did.**
  The three groups `key_hygiene_check.php` excludes were read key by key with Tom ruling on each.
  Eleven renames, all through `rename_lang_key.php --apply`, so no translated value changed and no
  sprint was owed. **Each group needed a different answer, which is the argument for keeping all
  three out of the automated check rather than automating them later:**
  - **tip / help / hint — three keys, three different verdicts.** `points_data_help` was a real
    stray: visible inline text beside the +/- links on four pages, and `_help` collided with the
    `.ec-help` tooltip class, so the name claimed the opposite of the truth → `points_data_note`.
    `ec_name_hint` was the genuine tooltip nobody had flagged, delivered as a `title=` → `_tip`.
    `lpn_empty_hint` was right all along, as predicted.
  - **heading / head / title — `_head` was clean; the drift was where the name could not show it.**
    All seven `_head` keys were hydraulic head, so the check's caution was correct. But `_title`
    carried **two meanings**: browser `<title>` *and* on-page heading, while `ws_notes_heading` did
    the identical job on ten pages. The four section headings became `_heading`
    (`bpn_line_table`, `bpn_sketch`, `ip_reach_table`, `points_data`), and `index_title` →
    `index_main_title` to match the other sixteen. **`template_printable_title` deliberately
    stayed** — it is the placeholder for the *printed sheet's* title, a real title.
  - **confirm / prompt — NOT already correct, which was the surprise.** Four keys named `_prompt`
    asked yes-or-no. Deciding them needed the call site, not the value:
    `lpn_close_browser_prompt` reads as a bare statement but is the body of the close dialog, in a
    literal ternary with its `_confirm` sibling (`js/looped-network.js:5543`). It, plus
    `lpn_close_save_prompt` and `lpn_v2_restore_prompt`, became `_confirm`. Tom's suggestion of
    "one of each" was right: `lpn_file_reconnect_prompt` is not a dialog at all but a warning
    banner that asks nothing → **`lpn_file_reconnect_alert`**, establishing `_alert` for that shape.
  - **Two findings adjacent to the renames.** `lib/Menus.lib.php` hand-rolled a `.ec-tip` glyph for
    `ec_name_tip` — inline styles copying that CSS rule for rule, sitting *beside* the label
    instead of wrapping it, so the tap target was the single `?` the whole-label convention exists
    to prevent. Now `ecTipLabel()`. (It was *not* invisible on touch, as first reported here:
    `EngCalcs.initTips` also matches `[title][style*="cursor:help"]`, so the tip did work.)
  - **Two adjacent keys were surfaced for Tom and both were DELETED, same day.** Neither was a
    naming question, which is why the check could never have reached them:
    - **`contact_title` was rendered by nothing** — `contact.php` titles itself from
      `contact_main_menu`, and the page still reads `<title>Contact</title>` with the key gone.
      27 strings recovered. It was surfaced rather than renamed on purpose: renaming an orphan is
      the one move that makes it look live.
    - **`menu_walkthroughs_tip` was deleted rather than fixed** (Tom: *"Why a tip? Isn't
      'Walkthroughs' good enough?"*). It is. The tip read "Step-by-step guides to the calculators,
      on Tom Haws's blog" — the first half restates the label, the second is off-site trivia — and
      no sibling in that menu carries a tip at all. **The cost asymmetry is the point:** it was a
      bare `<a title>` matching neither selector in `js/Calculators.lib.js`, so fixing it meant
      adding a `?` glyph to a nav dropdown *and* paying 26 translations for a string added only the
      day before (`938c51e`, English-only). Deleting beat both. The suite's cheapest tip is the one
      whose label already said it.


## Task 276

- 0|276| **[DONE 2026-08-13] Precise background-image scaling: type the number, or hand over a
  world file.** The backdrop menu now offers "Scale by picking" (the coarse step) and "Scale by
  World File or pixel size" — one box taking either a pixel size or a pasted world file.
  Adding an image offers a world-file pick; choosing image and world file together skips that step.
  A file that rotates, mirrors or unevenly stretches is refused with a message, never half-applied.
  Verified by `dev/lpn-spike/backdrop-scale-harness.js` (32 assertions, including the half-pixel
  centre-vs-corner offset and the Cartesian-to-Y-down flip). Translation debt: Task 297.


## Task 251

- 0|251| **Promote `lpn` to a core calculator — DONE 2026-08-13, all 26 languages, 6,522 keys.**
  Ran in four waves after a session limit killed 23 of 26 agents on the first attempt; `lpn` is now
  core in `translation_coverage.json`. **Wave split retired, ~50-key batched appends kept** (the
  split never prevented a limit; batching twice saved work on disk) — rule in CLAUDE.md, evidence in
  `dev/sprint-251-waves.md`. **Verify on disk, never on an agent self-report.** Follow-on sprint 252
  (engine → solver) in `dev/translation-execution-log.md`.


## Task 296

- 0|296| **The word "water" appeared nowhere in `lpn_`'s name, title or description. DONE 2026-08-12.**
  Tom, 2026-08-12: *"We have water nowhere in our titles or description. I think this is bad...
  I want to deliver what people are really searching for."* He was right on the fact. The three
  identity strings had been:
  - `lpn_main_menu` = "Looped Pipe Network (Map Interface)"
  - `lpn_main_title` = "Free Online Looped Pipe Network Calculator with Map Interface"
  - `lpn_main_desc` = "Pressure and Flow in a Looped Pipe Network You Draw on a Map"

  Not one contains "water", "distribution", or "supply". Somebody searching *water distribution
  network software* — which is what this page IS — cannot find it.
  - **SEO IS THE RIGHT TEST FOR THESE PARTICULAR STRINGS, and CLAUDE.md already says so.** The
    identity rule ("match the authoritative published source's terminology") exists for calculators
    named after a paper — Manning, Robinson. `lpn_` is named after no paper, so the rule's own
    rationale applies instead: the menu entry and title are *what a returning user searches for and
    bookmarks*. That is a search-behaviour criterion, and Tom is invoking it correctly. The
    Simple-English rule still governs `lpn_main_desc`, which is explanatory.
  - **THE SEQUENCING IS THE EXPENSIVE PART, AND IT INVERTS THE OBVIOUS ANSWER.** Tom wondered
    whether this should wait until after the sprint. It should not, and the reason is measurable:
    these three keys were translated into all 26 languages by the 146.06 identity-floor pass, so
    they are **already translated and NOT in the 251 delta**. Retitling later means a separate
    26-language resync of 78 strings. Retitling before the 23 remaining agents relaunch adds three
    keys to a 286-key job they are already doing. **Same work, one pass instead of two** — and the
    sprint is already paused on a session limit, so the window is free.
  - **DO NOT put "WaterCAD", "WaterGEMS" or "Bentley" in a title or meta description.** Those are
    live trademarks of a direct competitor, and the reputational and legal downside of trading on
    them dwarfs the traffic. "Reads EPANET `.inp` files" is different and is fair game: EPANET is
    public-domain EPA software, and Task 196 made the claim literally true. Say what we do, not
    whose customers we want.
  - **DECIDED AND SHIPPED 2026-08-12.** Tom chose the water-first wording:
    ```php
    $ec_lang['lpn_main_menu']='Water Supply Network';
    $ec_lang['lpn_main_title']='Free Online Water Distribution Network Calculator with the EPANET Engine';
    $ec_lang['lpn_main_desc']='Water Supply Network Analysis: Draw a Looped Pipe Network or Import EPANET Files';
    ```
  - **"WITH the EPANET engine", never "EPANET-POWERED" — and this is a correctness rule, not a
    style preference.** Tom proposed "EPANET-powered" and it had to be refused on the facts:
    `js/looped-network.js:700` sets `engine: 'native'`, the EPANET path at `:8286` fires only when
    the user ticks a box, and our own tooltip (`lpn_settings_engine_epanet_tip`) says *"The
    built-in solver gives the same answers and is faster, so leave this off unless you need EPANET
    itself."* A "powered by EPANET" title would therefore be false for essentially every visitor
    AND be contradicted by a tooltip on the same page — the page arguing with itself, the exact
    defect fixed in `7509dc7`. **"With" claims we ship it and you can switch to it, which is
    true, and stays true if the default ever flips.** If the default DOES flip to EPANET, this
    title can be strengthened; until then it cannot.
  - **"Web clone of EPANET" was also refused**, from the other direction: no tanks, no valves, no
    extended-period simulation (Task 248). "Clone" promises three headline features we do not have.
  - **"On a map" demoted from the title to the description.** Tom's instinct was right — the map
    editor is a real differentiator but nobody searches for it. The title spends its width on the
    words people actually type.
  - **Competitor trademarks stay out of the title and meta.** Tom agreed, having cited WaterCAD /
    WaterGEMS only as evidence that "water" matters. Nominative fair use would probably permit a
    truthful "alternative to X", but it invites complaints on merit-independent grounds and reads
    as chasing their customers. If wanted later, its home is body text on a comparison page where
    the comparison can be substantiated.
  - **Do not add a meta keywords tag.** The site emits none, and that is correct — Google has
    ignored the tag since 2009. The description is where these words have to land.
  - **HOW THE RETITLE REACHED THE AGENTS, since a changed English string does NOT enter the
    delta on its own.** These three keys were already translated in all 26 languages, so the
    payload generator saw nothing missing. The three lines were deleted from all 26 lang files,
    which made them missing and pulled them into `keys_to_translate` (22 non-core went 286 → 289).
    **This is the general recipe for retranslating a reworded key, and it is not obvious.**
    Expect `check_all.sh` to fail the lpn harness on "every borrowed string already exists" for
    es/fr/pt/tr in the window between the deletion and the sprint landing — that failure is the
    guard working, and it clears when the agents write the new translations.


## Task 288

- 0|288|[DONE 2026-08-12] **The unique identifier is gone. What is stored is one digit per page.**
  Tom wrote the banner sentence first — *"May we store a single digit per page in this browser's
  storage to prevent us from logging its visits repeatedly?"* — and the implementation was made to
  match it rather than the other way round.
  - **`PHPSESSID` is removed outright, not merely gated.** It was a 32-hex random unique identifier
    plus a server-side session file holding `SESSION_START`, `CLANG_LOGGED`, `LANG_VIEW_LOGGED`,
    `HUMAN_VIEW_LOGGED`, `CALC_USAGE_LOGGED` and `TITLE_LOGGED`. **Every one of those is the same
    question — "have we already counted this?" — and none of them needed an identifier to answer
    it.** There is now no session anywhere in the suite and nothing stored that could single a
    visitor out.
  - **`ec_seen`: one base-32 digit per page, five bits** (language view 1, human view 2,
    calculation 4, title 8, subtitle 16 — max 31, which is exactly one digit in base 32, which is
    what makes the banner's sentence literally true rather than approximately true).
  - **`SESSION_START` was deleted and nothing replaced it.** It existed so a visit that had already
    proven itself human did not make later pages wait out their own 10 seconds. Bit 2 on *any* page
    answers that better, so no timestamp is stored at all — one less thing on the device and one
    less thing to explain.
  - **One reserved pseudo-page, `_v`, carries the visit-level facts.** Without it the `cookie`
    demand row vanishes: every page would log `view` and the "returning users with a saved
    preference" statistic would silently go to zero. Caught during implementation, not after.
  - **`ec_blang` is now the literal `1`.** It held the language tag, and every use site is
    `isset()` — the value was written and never once read.
  - **THREE ANSWERS.** `0` refuse, `1` accept this version, `2` accept every version. The middle one
    is scope-limited consent pinned to `EC_CONSENT_VERSION`, so bumping that version re-asks exactly
    the people who asked to be re-asked and nobody else. It does **not** mean "ask again next
    visit" — nagging somebody who already said yes is the one direction that makes a consent flow
    worse. Refuse is rendered FIRST and all three share one CSS rule.
  - **Verified end to end:** fresh visitor gets zero `Set-Cookie` headers; an accepted visit writes
    `ec_seen` and `ec_blang=1` and no session; the digit accumulates across pages
    (`Orifice:1` → `Orifice:3`); a reload adds no row; the beacons dedupe on the digit; refusing
    deletes both cookies; `1` under an old version re-asks and `2` never does.
  - **`privacy.php` was updated in the same commit** — its cookie table described `PHPSESSID`, which
    no longer exists. That page is a constraint on the code, not a description of it.
  - **Still open, and it BLOCKS the sprint:** three `$ec_lang_syn` entries now describe labels that
    changed underneath them (`consent_accept`, `consent_body`, and `consent_accept_all` which has
    none). AI may not edit that array without Tom's written permission, so `friction_check.php`
    holds the sprint until he rules.


  - **The banner has no visible heading** (Tom, 2026-08-12: *"Is this necessary?"* — it was not).
    `consent_heading` said "Browsers and visits", which named two nouns without saying what about
    them. The body is a single question and the buttons answer it; a heading above one sentence
    either restates it or adds noise. The `aria-label` on the region still names it for screen
    readers, so nothing was lost and 26 translations were saved. **Last button is "Accept all"** —
    the universal convention, and short enough not to undo the equal-effort styling that
    "Accept all, and do not ask again" was quietly breaking.


## Task 290

- 0|290|[DONE 2026-08-12] **Six Rock Chute notes were written, translated into 26 languages, and
  rendered by nothing.** Tom: *"Great find! Yes, those are 'lost notes'. They should be on the rc
  page."* Restored.
  - **`Rock-Chute.php` displayed exactly ONE of its seven notes** — number 4, the Robinson citation.
    Notes 1, 2, 3, 5, 6 and 7 existed as keys, were carried through every sprint, and appeared on no
    page. **A missing `<dt>`/`<dd>` pair looks like nothing at all**, and translating one looks like
    ordinary work, which is why this survived a full rc_ translation sprint and an audit.
  - **`rc_notes_7_term` did not exist in ANY language** — note 7 had a body and no heading. That
    asymmetry is what made only half the pair show up as unreferenced, and it is why
    `glossary_compliance_audit.php` had been pointing at a key that was never written. Now written
    as "Ponding Above the Inlet"; the preposition is load-bearing, since "Inlet Ponding" also reads
    as the inlet being flooded.
  - **Restored in LANGUAGE-FILE order, not key order** — 1,2,3,5,6,7,4 — because note 4 was appended
    later and a loop over 1..7 would put the bibliography in the middle of the notes.
  - **Content re-checked against the code before restoring**, on the `lpn_notes_4_def` lesson that a
    sprint faithfully translates a stale claim: the 0.45 porosity default matches `rc_np`, and note
    1's 0.02–0.40 validity range matches the guard in `js/rock-chute.js`.
  - **Dead keys 18 → 7.** What remains is `menu_main_list`, `menu_main_language`, `mi_d50in`,
    `mpf_spreadheet_notice` (typo in the key name too), `wi_save_and_calculate`, `or_shape`,
    `contact_title` — genuinely unreferenced, one human decision each, no cluster among them.
  - **The lesson worth keeping:** this was invisible not because nobody looked but because nothing
    could look. `key_hygiene_check.php` found it in its first run, minutes after being written.


## Task 289

- 0|289|[DONE 2026-08-12] **"Show page titles" — the first setting on lpn that is not part of the
  project.** Tom: *"our standard titles... really don't seem like much in most cases. But for lpn
  they do."* Right: lpn is the one page that is an application rather than a form, and a canvas
  wants the window.
  - **His own landing-page idea is rejected by its author** — *"this is kind of rude. It's what
    epanet-js does, and I don't like it."* Do not resurrect it. Built instead as the settings
    checkbox he preferred.
  - **WHY IT IS NOT PROJECT-SCOPED, which is the durable part.** Task 263 made everything on this
    page project-scoped because a bare number is meaningless without its units — *"imagine opening a
    400 diameter pipe into an inch browser!"* **That reasoning does not reach this setting.** Whether
    a heading is showing is not data about the network; it is about the window the person is sitting
    in front of, and putting it in the project file would make a colleague inherit your screen
    preference along with your pipes. So it is `localStorage`, per browser, and
    `serializeProject()` must never learn about it.
  - **Its own group with its own scope note, because the panel's top note would otherwise lie about
    the control beneath it.** Tom spotted that before it was built, and named the group himself:
    *"I say 'Saved in this calculator' even though it is literally in the browser; it affects only
    this calculator."* Right — the distinction a user cares about is project vs everywhere-else, not
    localStorage vs a file. Section "This calculator", at the foot of the panel, above the actions.
  - **Applied by five inline lines in `Looped-Network.php`, not from `looped-network.js`.** The
    preference is paint-critical: read it at DOMContentLoaded and somebody who turned the titles off
    watches them flash on every load, on the page the setting exists to give room to.
  - `id="ec-page-title"` / `id="ec-page-welcome"` added in `lib/HeadersFooters.lib.php` so the
    toggle targets those two elements by name rather than by being the first `h1` it finds.
  - **The Settings box now has two scopes, which was the real question underneath.** Project-scoped
    at the top, browser-scoped at the bottom. That is the pattern for anything user-level added
    later; do not put a user-level control back under the project note.
  - Not done, and separable: idea 1, renaming "Printable version" to "Minimal version" and moving it
    up. Suite-wide, its own translation cost, and it solves printing rather than screen room.


  - **SHIPPED BROKEN AND FIXED THE SAME DAY, and the bug is worth more than the feature.** The page
    description reappeared on every reload while the heading and welcome line hid correctly. Cause:
    the inline block was placed ABOVE the `<h2>` it names, so `getElementById('ec-page-desc')`
    returned null. **A null return from getElementById is indistinguishable from success** — no
    error, no console warning, two of three elements behaving perfectly.
  - **Nothing could have caught it, which was the real defect.** `check_all.sh` had no DOM test for
    this page, and the block is inline PHP so no JS harness saw it. I had even flagged in the
    session summary that the toggle had not been seen in a browser, and shipped it anyway — a
    verification failure, not a design one.
  - **`dev/lpn-spike/page-titles-harness.js` now guards it**, and was verified to FAIL when the bug
    is reintroduced rather than merely passing today. Three assertions: every named id exists, the
    script is parsed after every element it names, and the inline list matches
    `applyPageTitles()`'s list (two copies of one fact, either of which could drift).
  - A `DOMContentLoaded` backstop was added alongside the immediate call, so a future reordering
    degrades to a flash rather than to silence.


## Task 287

- 0|287|[DONE 2026-08-12] **Serve Bootstrap from this site instead of jsDelivr — the last third
  party is gone.** Found while writing `privacy.php`, which could not honestly claim "no third
  parties" until this was either disclosed or fixed. Tom, 2026-08-12: *"OK. Fair enough. We
  self-host."*
  - **What it cost a visitor before:** every page load told jsDelivr their IP address and
    user-agent. No cookie, no data coming back, no tracking intent — but a transfer to a third
    party in another jurisdiction, and the reason German courts have ruled against embedded Google
    Fonts. It was also out of place on the merits: this project already vendors `epanet-js.js` so
    nothing is fetched from anybody, and the PWA is built to work offline.
  - **VERIFIED, NOT TRUSTED.** The vendored files' sha384 digests match the SRI hashes the old tags
    carried, so they are byte-identical to what visitors were already being served. That check is
    the upgrade procedure too — it is written down in `js/vendor/README.md`.
  - **Four places, and the fourth is the one that bites.** The two tags in
    `lib/HeadersFooters.lib.php`; the same two in the parent site's `hawsedc.lib.php` (**not in
    git** — recreate by hand if that site is rebuilt); `STATIC_ASSETS` in `sw.js`; and `sw.js`'s two
    `url.host === 'cdn.jsdelivr.net'` branches. **`CACHE_VERSION` bumped v8 → v9**, which is
    required rather than housekeeping: without it every returning PWA visitor keeps serving the CDN
    URLs out of their existing cache, and the third party stays in the page for exactly the people
    who visit most.
  - **`privacy.php` changed in the same commit**, from disclosing jsDelivr to stating that nothing
    is loaded from anybody else's server. That page is now a constraint on the codebase: adding an
    external `src` anywhere would make it false, not merely out of date.
  - Verified on all four page shapes (calculator, lpn, legal, parent-site index): zero jsDelivr
    references, correct local paths, correct MIME types.


## Task 196

- 0|196| **[DONE 2026-08-11] EPANET `.inp` IMPORT (Task 146 child). Export is NOT built — see Task 281.**
  Raised 2026-08-01 as import/export together; only the reading half shipped. **This reverses the
  2026-07-29 call that interop "is not needed"**, deliberately and on Tom's own instruction
  (2026-08-11: *"I think it is wise now for us to stress-test our paradigms by trying to import an
  EPANET file"*), so the history of why it was declined the first time is preserved rather than
  quietly overwritten.
  - **File > Import EPANET file (.inp)… — a SEPARATE row from Open…, not a second file type on
    it.** Open means one of our own documents, with a docId, a lock, a live file handle and a Save
    that writes back. An `.inp` has none of that and never will, so hiding it behind the same word
    would promise a round trip we cannot make. An import lands as a new BROWSER project named after
    the file, arriving clean (not asterisked), and Save as is the way out.
  - **THE CUT-FEATURE QUESTION IS ANSWERED: import the supported subset and REPORT it, never
    reject.** Reject loses on contact with real work — two of Tom's three production models carry
    throttle valves, so a rejecting importer would have refused a third of its own first test set.
    Every difference is named in a dialog shown after every import, including a clean one ("Nothing
    was left out"), because the one thing a user needs from interop is to know whether to trust it.
  - **A throttle control valve (TCV) becomes a ZERO-LENGTH pipe carrying the same local loss, and
    that is exact rather than approximate.** `lpnResistance()` returns r = 0 for a zero-length link
    while the minor-loss term is computed from k and diameter alone, so the substitute is precisely
    the pure local loss the valve was. Every other valve type imposes a CONTROL rather than a loss;
    those come in as open pipes and are reported as a real loss of behaviour.
  - **Two EPANET behaviours were MEASURED against the real engine because the obvious reading of
    each is wrong, and both are silent when got wrong:**
    - `[DEMANDS]` **replaces** the `[JUNCTIONS]` demand rather than adding to it (100 in
      `[JUNCTIONS]` with rows of 50 and 25 reads back as 75, not 175). Adding would have inflated
      every multi-category junction in silence.
    - A TCV's loss is its **SETTING ALONE**; the `[VALVES]` minor-loss column is ignored for it,
      which is the opposite of what that section's own column heading suggests. The obvious reading
      (sum the two) put 10.6 m of phantom head into the first real model that had one.
  - **Validated two ways, both against the real EPANET engine, both headless.**
    `dev/lpn-spike/validate_inp.js` checks the READER (parse → our solver vs EPANET on the same
    file: heads agree to 2 mm, flows to 6e-5 m3/s on four networks, three of them Tom's own
    production models). `dev/lpn-spike/inp-import-harness.js` checks the DOCUMENT round trip, which
    is where the interesting mistakes live — a 12 inch main stored as 0.3048 still draws, still
    solves, and is a different pipe.
  - **The `.net` discovery, and why it needed its own tool.** Tom's models arrived as `.net`, which
    is what EPANET's Windows UI saves by default and is a binary Delphi value stream, not text.
    `dev/scripts/epanet_net_to_inp.php` reads it and documents the format, which is documented
    nowhere else. **The backdrop is stored as a PATH ONLY** — neither `.net` nor `.inp` embeds the
    image — so a drawing has to be handed over separately. That answers Tom's first question.
  - **The client models themselves are NOT committed.** They carry client names and Dropbox paths
    and this repo is on GitHub. They live in `dev/epanet-models/`, untracked.
  - **Two real findings fell out of the stress test, both already known traps that bit again:** a
    pump with no diameter starts the solver at NaN (the trap documented on `pumpCase` in
    `dev/lpn-spike/cases.js`, which cost an hour on 2026-08-09 and cost more here), so the importer
    inherits one from the largest pipe the pump touches; and `dev/lpn-spike/lpn-dom-stub.js` had to
    use INDIRECT eval, because `var EngCalcs = EngCalcs || {};` at the top of `looped-network.js`
    silently builds a SECOND, empty EngCalcs under a direct eval inside a function.


## Task 270

- 0|270| **[DONE 2026-08-10] Audited lpn against Tom's three blog checklists.** Report:
  `dev/lpn-new-user-guide-audit.md`. All three were audited, not only New User — the New Shopper
  list is where most of the drift is.
  - **Scored after Tom's review: of 10 findings, 1 retracted, 1 downgraded, 1 strengthened, 2 fixed.**
  - **RETRACTED, and the lesson is the value here:** the "app says Position, post says Move" finding
    was wrong because I read the **JS fallback literal** (`pc.lpn_backdrop_position || 'Position'`)
    instead of `lang.ec.en.php` (**'Move image'**). A fallback is a guess at the call site. **Read
    label claims out of the lang file, always.**
  - **Strengthened into a defect: moving cannot be undone at all** (Task 277), not merely "a drag is
    not a snapshot". Undo depth is otherwise **20**, in memory only, cleared on project switch.
  - Fixed here: Task 273 (`+` opens the chooser) and Task 275 (Settings says "Saved with this
    project"). Task 272 dropped — Tom changed the post to "Save as" and the app is correct.


## Task 265

- 0|265| **[REVERTED 2026-08-10, same day it shipped] Units do NOT go on the browser tab.** Tom, on
  review: *"Units on tab are not the right way to go. I think we solved this need with the statuses
  in the lower left corner of the map."* He is right — the status strip answers it continuously,
  where you are already looking, and a tab is a second copy of the same fact free to drift. Nothing
  writes `document.title`; the harness asserts that, because the defect is a line coming back.
  - **What survives:** `unitSetLabel(system)` and `lpn_title_units`, feeding the **example network's
    title block** — which is what Tom actually wanted (*"I do like having the units as a title text
    on the example projects. And I don't see that."* He was not misunderstanding; it was not there).
    A screenshot of the example leaves the page without the status strip.
  - **The label is FORCED by the caller, not derived from the strip** — Tom cut the derived version
    the same day: *"We never create an example based on the current units, or we shouldn't. We should
    force the units we want and label thusly. `unitSetName()` sounds like a function without a
    cause."* It was: `newProjectFromExample(system)` already knew the answer, so reading it back off
    the selects was indirection with nothing behind it. `unitSetName()` and `lpn_title_units_mixed`
    are deleted; the harness asserts the label ignores the live strip.
  - **Do not store "US"/"SI"** (Tom): the document stores all seven unit selections, which is the
    fact. A preset name would be a second copy of it, free to disagree.
  - Adding the third title line moved `titleY` 4600 → 4572 to keep the ring's ~35 units of
    clearance. **The harness had been measuring that clearance at a seeded text size of 2.5, not the
    shipped 20** — 8× tighter, so it read 29 units where a real visitor would have had 7. It now
    redraws at the default and checks again; that blind spot predates this task.


## Task 274

- 0|274| **[DONE 2026-08-11] The user works in Cartesian coordinates; Y increases upward.** Tom:
  *"EPANET uses normal cartesian coordinates… Cartesian is engineering."* One self-inverse
  `cartesianY()` at the four places a coordinate reaches or leaves the user: the hover readout, the
  node popup, the Text-label popup, and the backdrop "type the X,Y" prompt (the only entry site).
  - **The flip is at the USER boundary, not in the document or the world transform.** `doc` stays
    Y-down because that is SVG's own system and every drawing routine — text baselines, mask rects,
    extrema chevrons, the backdrop and reservoir images, collision boxes, leader side-flips — is
    written natively against it. Flipping `setTransform()` to `scale(s,-s)` instead needs ~10
    counter-flips, and each one fails silently and visually. **The drawing is pixel-identical; only
    the numbers changed.**
  - **The FILE is Cartesian too, from v4** (Tom, 2026-08-11: *"Eventually needs to be Cartesian. If
    we can do that now without causing trouble, let's do it."*). The sign flips at the storage
    boundary in exactly two places — `serializeProject()` out, `applySaved()` in — over six fields:
    node `y`/`ly`, vertex `y`, link `ly`, label `y`, `backdrop.ty`. The backdrop's own `y`/`height`
    are NOT flipped; it is anchored top-left, and "extends downward on screen" reads the same in
    both frames.
  - **v3 is MIGRATED on open — converted and stamped, like every other step in `migrateSaved()`.**
    The first cut left v3 documents at v3 forever, leaning on `serializeProject()` writing
    `openDocVersion`; Tom caught it (*"We always upgrade the file to the current format. Right?"*).
    It had turned the one documented exception into two, the second undocumented and pointless.
  - **v2 is the ONLY version that lags**, because the units question it carries is the user's to
    answer. It keeps Y-down storage — correctly, since the read and write gates key off the same
    number — and becomes Cartesian for free the moment the units question is answered, via
    `stampDocAnswered()`. That is why the two questions can share one version after all: the
    coordinate change needs no answer from anybody, so it rides on a bump instead of needing one.
  - **`serializeProject()` clones before flipping.** It builds its object from live references to
    `doc.nodes/links/labels`, so flipping in place turns the map upside down on every autosave.
  - **The example is re-anchored** (Tom: *"Center is now at 5000,-5000. Should be at 5000,5000."*)
    by a pure translation of −10000 applied after it is built, so every clearance and stacking
    number reasoned about in `drawExampleNetwork()` still holds as written and the drawing on screen
    is unchanged. Offsets are vectors and are deliberately not translated.
  - 16 assertions. The user-boundary ones are stated as a DIRECTION ("higher on screen reports a
    larger Y") rather than a sign — `y === -n.y` would restate the implementation and would pass a
    version that flipped display AND entry. Mutation-tested, 15 mutations, all caught, including
    entry-not-flipped, no-clone-on-save, v3-left-behind, and v2-swept-up.


## Task 277

- 0|277| **[DONE 2026-08-10] Moving something is undoable.** No drag handler snapshotted, so Undo
  after a drag reverted the last DISCRETE act and left the drag standing — it took back something
  the user was not looking at. `snapshotDragOnce()` at the head of all five mutating branches of
  `applyDrag()`.
  - **Lazy, on the first frame that moves something — NOT on pointerdown.** Every select-mode press
    opens a drag record (that is how a click becomes a drag), so snapshotting on down would push a
    document copy for every tap that merely opened a popup: 20 identical states and an Undo that
    appears dead. `applyDrag()` runs only after real movement.
  - Once per gesture via `drag.snapped`, which resets itself because `drag` is rebuilt on each
    pointerdown. Pan and pinch are excluded on purpose: they move the camera, not the document.
  - 10 assertions driving the REAL pointer handlers over a four-frame gesture — a one-frame stand-in
    cannot tell "per gesture" from "per frame". All five branches mutation-tested independently;
    covering only the node drag left four call sites that regressed silently.


## Task 263

- 0|263| **[DONE 2026-08-10] Inputs are stored as declared; nothing converts them on a unit change.**
  `lpn_` stored SI and displayed the conversion, so switching a unit silently rewrote every number
  on the map. Now the document holds what the user typed, and conversion happens in exactly two
  places: at the solver handoff (`toSI`, in `assembleModel`/`recomputePumpCurve`) and on results
  coming back (`toDisplay`). A third site would re-create the banned behaviour.
  - **The project owns its units** (`serializeProject().units`, restored by `applyUnitSelections()`).
    Mandatory, not a nicety: a declared 400 written under mm would otherwise open as 400 inches.
    Consequence, Tom's own: there are no browser units and no "save as defaults" — a user keeps
    preferences by saving an **empty template project**. See CLAUDE.md.
  - **The MISSING VERSION STAMP is the pending question — there is no second flag.** `migrateSaved()`
    leaves a pre-declarative document at v2 and `serializeProject()` writes `openDocVersion`, so an
    unruled project saves back as v2 and asks again. Tom's own simplification (*"The project receives
    no version number, right? Isn't that absence enough?"*) — the first cut stamped v3 on sight and
    carried a `project.unitsUnconfirmed` flag beside it, which was one mechanism too many.
  - **Three answers.** *Convert* converts and stamps; *Never ask again* stamps and changes nothing;
    *Close so that I can check the current units first* does neither, so the offer returns — its own
    label is a promise that it will. Undo after Convert restores the numbers but not the version,
    which is the same verdict as Never ask again reached another way.
  - **The first cut also migrated scenario overrides and claimed that mattered. It did not.**
    Scenarios exist in the data model and are reachable from nothing — no command, no lang key,
    `scenarios` is always one empty Base — so no v2 document can carry an override. Tom caught the
    claim ("Scenarios: they don't exist yet. I am confused."); the code is gone. **Unreachable
    scenario machinery is still sitting in `js/looped-network.js`** and should either grow a UI or
    be deleted; nothing depends on which.
  - **`niceDefault`'s SI branch needed a factor it never had**: `siVal` is quoted in the SI *base*
    unit while the SI preset shows mm and l/s, so 0.15 m was landing as 0.15 mm and the solve
    returned −1.3e10 kPa. Caught by the example-network harness within seconds of the switch.
  - 24 new assertions in `dev/lpn-spike/example-network-harness.js`, mutation-tested (7 mutations,
    all caught). Wizard strings in en and fr only — Tom, 2026-08-10: lpn has no human users outside
    those two, and this is a transient migration string.


## Task 264

- 0|264| **[DONE 2026-08-10] "Draw example network" retired; File > New project instead.** The
  toolbar's most prominent slot now opens **File > New project** (a second popup off the same
  anchor), whose rows are **Blank project** and, under a *From examples* heading, **Basic network,
  US units (gpm)** and **Basic network, SI units (l/s)**. The Insert row is gone: Insert adds an
  element to the drawing you are in, and an example is a whole network.
  - **Each example commits to a unit system rather than adapting to yours.** `newProjectFromExample()`
    makes the blank project, calls `EngCalcs.setUnits()`, THEN draws — so `niceDefault()` lands on one
    branch deterministically. This removes the only thing on the page that needed inputs to convert
    on a unit change, which is what unblocks Task 263.
  - **No confirmation dialog.** Tom's first sketch had one ("Set project units to match example
    network?") and his own second thought replaced it: the choice IS the menu row, so a dialog would
    ask a question the user just answered. The flow unit is in the label for the same reason.
  - `lpn_tool_example` retired from en/es/fr/pt/tr.
  - **Reworked as a real FLY-OUT** (Tom, 2026-08-10: *"the universal convention is for that to be a
    fly-out submenu of New rather than a visually disconnected replacement"*). Second popup
    (`#lpn_menu_popup2`), opens on click or hover, parent stays on screen, ▸ marker on the row,
    flips left when there is no room right. The row is labelled `New project…` — it opens a chooser.
    The toolbar button keeps a plain pull-down: no parent row to branch from.
    Rows: **Blank project, US units (gpm)** / **Blank project, SI units (l/s)**, then *From
    examples* with the two networks (Tom, 2026-08-10 — *"to act more like other software"*). A blank
    project commits to a unit system like everything else here; the single "Blank project" row
    inherited whatever was on the strip, which was the last place a project's units were decided by
    accident. The fly-out is now a template list, which is the shape File > New has everywhere.
  - **The fly-out closed on being reached** (Tom: *"it disappears before the mouse can reach it; it
    honestly seems to disappear BECAUSE you reach it."* It did.) `closeSubMenu` was bound to
    mouseenter on every plain row at **every level**, so entering a fly-out row closed the fly-out
    that row was in. Now bound only at level 0, and on a 350 ms delay — the path from the parent row
    to its fly-out is diagonal and crosses the rows below, so dismissing on contact was the other
    half of "you can't get to it". Anything inside the fly-out cancels the pending close.
  - **Not a Bootstrap component, and could not be.** Bootstrap 5 has no nested-dropdown support
    (dropped after v3 and never restored), and these menus were never Bootstrap dropdowns anyway —
    `openMenu()` builds a hand-rolled popover because the rows are data. The navbar's dropdowns are
    Bootstrap; the lpn menu bar is not.
  - **A new project no longer wears an asterisk** (*"New blank projects and from template appear with
    asterisk, which is bad. But a blank project with asterisk closes without confirmation, which is
    bad."*). Both halves were one defect. `stampProjectSaved()` records a baseline at birth, so
    `dirty` starts false and the mark is earned at the first edit. **The `exported` flag is retired**
    (it had one reader), and `closeTab()`'s `projectIsEmpty` special case is gone — it existed only
    to paper over a mark that should never have been there, so THE ASTERISK DECIDES is literally
    true again. Consequence: a project you drew and then emptied now asks before closing.
  - **The map now says what its numbers ARE** (Tom: *"when the new user arrives, what units do they
    get, and is there a way they should know?"*). A new user gets **US on an English page and SI on
    every other** — `EC_DEFAULT_UNIT_SET`, derived from the language — and nothing on screen said so,
    because map labels are bare numbers by design. `#lpn_map_status`, bottom-right opposite the
    coordinate tracker, now reads `Flow: gpm   Pressure: psi   Friction method: Hazen-Williams`.
    Every label borrowed from an existing translated key, so it shipped at zero translation cost.
  - `lpn_empty_hint` still said "draw an example network", a retired feature. Now ends *"…or to
    start a New project from examples."* — en/es/fr/pt/tr.
  - **Shipped broken and fixed the same day** (Tom: *"264 is broken. File New has no options. And it
    does nothing."*). Neither the submenu row nor the new toolbar button called `stopPropagation()`,
    so the click carried on to the document dismissal in `wireTabs()` — which by then could not find
    the clicked row inside the popup, because `openMenu()` had already replaced the list — and closed
    the menu it had just opened. Every menubar button had always stopped its click; the two new
    openers did not. **The harness had no coverage of menu interaction at all**, which is why a
    change that reads correctly shipped dead. It does now: 7 assertions drive the real listeners and
    run the real dismissal predicate against the result.


## Task 262

- 0|262| **[DONE 2026-08-10] A file opened in a no-connect browser arrived already asterisked.**
  Tom, 2026-08-10. `importProjectFromFile()` now sets `savedSig`/`dirty`/`exported` exactly as the
  download path does: a file the user just handed us off their own disk is the strongest possible
  case of "a copy exists on disk", so the faint star starts OFF and returns on the first edit. It was
  permanently on from the moment of opening, so it could never say anything — the same defect
  punch-list finding 13 fixed on the download side and this side missed.
  - **Recent files does not appear in a no-connect browser, and that is correct, not a gap** (Tom
    observed it the same day; it works including locking in Chromium). Without the File System Access
    API there is no handle to keep, so a "recent" row could only re-prompt for an upload — the list
    would name files it cannot open.


## Task 259

- 0|259| **[DONE 2026-08-10] Navbar overlap just above the hamburger breakpoint.** Tom's screenshot:
  "Libre Software" printing over "Hydraulics" and over the brand, and a squeezed Copy link wrapping
  onto two lines. Bootstrap's `.navbar-expand-lg` pins the expanded bar to `flex-wrap: nowrap`, so
  from 992px to about 1150px nothing yields and every nowrap item spills out of its shrunken box.
  `css/engcalcs.css` now lets the navbar and the expanded collapse wrap in that band.
  Also: "Libre Software" links to the README's `#license` section rather than the repo root.


## Task 258

- 0|258| **[DONE 2026-08-10] File > Recent files on Looped-Network.** The `Open Recent` deferred out
  of Task 212, asked for again by Tom 2026-08-10. Up to 8 file handles in a second IndexedDB store
  (`recent`, DB version 2) that outlives the projects — `handles` is deleted on close, which is why
  it could not carry this. Deduped by `isSameEntry()`, not by name. Clicking a row spends the click
  as the user activation `requestPermission()` needs, so a warm grant reopens with no picker; a
  vanished file drops off the list. 26 checks in `dev/lpn-spike/recent-files-harness.js`,
  mutation-tested. Removed the matching promise from `lpn_notes_4_def` in en/es/fr/pt/tr.


## Task 225

- 0|225| **[DONE 2026-08-09] The `lpn_` punch-list leftovers — small, confirmed, and none of them
  dangerous.** Extracted from Tasks 223/220 as they closed. Full wording in
  `dev/lpn-file-lock-test-punchlist.md` § Findings.
  - **§4 Closing a tab now activates the next tab RIGHTWARD** (or, if the closed tab was rightmost,
    its new rightmost neighbor) rather than the most-recently-updated project, matching every tab
    strip in the world. `discardProject()` (`js/looped-network.js`) now captures the closed tab's
    index in `library.projects` before removal and lands on `Math.min(closedIndex, rest.length-1)`.
  - **§4 Status messages no longer overwrite each other.** `setStatus(text)` used to call
    `clearNotice()` on every non-empty (diagnostic) status, discarding a just-shown notice for good
    — "nodes have no path to a reservoir" really did eat "Closed X. Now showing Y." A diagnostic now
    only TEMPORARILY outranks the notice; the notice resurfaces once the diagnostic clears.
  - **§4 The "gone for good" close prompt no longer fires for an empty, untouched new project.**
    `tabAsterisk()` always shows the (faded) star on a browser-only project regardless of whether
    anything was drawn — correct for the star, wrong as a gate for the destructive-close dialog. New
    `projectIsEmpty(id)` (checks nodes/links/labels only, not inherited settings/scenarios) lets
    `closeTab()` discard silently when there is genuinely nothing to lose.
  - **§6 "1 minutes ago" was already fixed** — `agoText()`'s minutes/hours/days buckets all have a
    floor of 2 by construction (the boundary from the seconds bucket is 120s, i.e. 2 min). No code
    change needed; confirmed by reading, not just by the comment claiming it.
  - **§13's rewrite is NOT part of this close** — split out as its own task (225.13): it is a
    punch-list document rewrite against live browser controls, not a code fix.
  - **Both feature asks landed.** The `beforeunload` "Leave site?" guard for a connected file with
    unsaved changes was already shipped (`js/looped-network.js`, wired in `init()`) — confirmed, no
    change needed. The Restore-settings tip (`lpn_settings_restore_tip`) now also says *"To save
    your favorite settings for reuse, save a project file with nothing but settings in it"* — English
    plus the Task 203 core four (es, fr, pt, tr).


## Task 252

- 0|252| **[DONE 2026-08-09] Reorder project tabs, left/right, via the tab menu.** Tom, 2026-08-09:
  *"Either Drag or click an item on the tab menu. Either one is fine."* Built the cheaper of the two
  (works on touch, where dragging fights the scroll gesture): `openProjectMenu()` in
  `js/looped-network.js` gained **Move left**/**Move right** rows (disabled at either end), backed
  by a new `moveTab(id, dir)` that swaps the tab's position in `library.projects` (display order)
  and persists it. New keys `lpn_tab_move_left`/`lpn_tab_move_right`, English + the core four.


## Task 256

- 0|256| **[DONE 2026-08-09] `dev/lpn-spike/popup-tips-harness.js` was dead** (found 2026-08-09,
  `MODULE_NOT_FOUND` before a single check ran — its ~60 assertions had been reporting nothing).
  All four diagnosed causes fixed:
  1. Solver loading switched from `eval()`-ing `js/lpn-solver.js` (whose own
     `require('./PipeHydraulics.lib.js')` resolved against `dev/lpn-spike/`) to
     `require('./bootstrap.js')` then `Object.assign(global.EngCalcs, require(ROOT +
     'js/lpn-solver.js'))`, with no local `var EngCalcs` declaration (that would have hoisted and
     shadowed the global for the pageConfig loader above it).
  2. Added `Object.assign(EngCalcs, global.EngCalcs)` immediately after `eval(src)` (of
     `looped-network.js`) so the module-scope `EngCalcs` binding that eval's own
     `var EngCalcs = EngCalcs || {}` creates is reconciled back onto the fully-assembled object.
  3. `deleteProject` → `discardProject` (Task 211 rename), at the injected-export site and all four
     call sites.
  4. Rewrote the reset-controls checks for the current Settings panel: TWO tips now, not three
     (`lpn_tool_clear`/`_tip` were removed by Task 211), matched via `calc_defaults` ("Restore
     defaults") and `lpn_settings_wipe_btn` ("Erase everything on this page") rather than the
     retired `lpn_settings_restore_btn` key; added `iconEl`/`setLabel` stubs since the wipe button
     now renders through `EngCalcs.setLabel()`.
  - **Two assertions also had to change, not just get un-broken** — they were pinned to the exact
    pre-Task-225 behaviors that Task 225 (above) just fixed on purpose: the notice-survives-a-
    diagnostic case, and the tab-strip-position-not-recency landing case (added a second
    rightmost-tab-closes case too).
  - **New: `dev/scripts/run_harnesses.sh`** runs every `dev/lpn-spike/*harness*.js` plus
    `validate*.js` and fails on the first non-zero exit — the actual fix for "nothing runs these
    harnesses," which is how this one went red for weeks unnoticed.


## Task 255

- 0|255| **[DONE 2026-08-09] `lpn_` was solving US networks with the length in the wrong unit.
  Head loss was 3.281x too high. Fixed same day, at Tom's "Wow. Bad. Can we fix immediately?"**
  - **The defect.** Length is DECLARATIVE — one map unit IS one foot or one metre by declaration,
    nothing converts — and `assembleModel()` handed that declared number straight to
    `js/lpn-solver.js`, whose header says *"EVERYTHING HERE IS SI … lengths in m."* With the
    Length/Map selector on `ft`, a pipe drawn and labelled 1000 ft was solved as 1000 **metres**,
    while the elevation, head, demand and diameter around it all WERE converted. SI users were
    never affected, because there the factor is 1.
  - **The fix is one new function, `linkLengthSI()`, and four call sites** — the solver model plus
    the three places that compute a head-loss gradient (popup readonly field, map label line, and
    the extrema pass), all of which were dividing an SI head loss by a declared-foot length and
    calling the quotient dimensionless. **The declarative design was NOT the bug and was not
    touched**; the stored number is still declared, and only the handoff converts.
  - **Verified against a HAND-COMPUTED Hazen-Williams case, not against the other engine** — 461 ft
    → 140.5 m, solver 0.2709 m of loss vs 0.2710 m by hand, in
    `dev/lpn-spike/example-network-harness.js`. That distinction matters: `js/lpn-epanet.js` reads
    the same model, so both engines were wrong together and agreed with each other perfectly, which
    is exactly why `validate_epanet.js` (8/8, still green) never caught it.
  - **Why nothing else caught it:** `validate.js` and `validate_epanet.js` both feed the solver
    directly, in SI, so neither ever crossed this boundary. **The lesson generalises — a check that
    never exercises a unit boundary cannot find a unit bug**, and this suite's other calculators
    convert at the edges too.
  - **Published US answers changed.** Head loss and gradient both drop by 3.281x; pressures rise
    slightly. Anyone comparing against a note made before 2026-08-09 will see a difference, and the
    new numbers are the correct ones.


## Task 254

- 0|254| **[DONE 2026-08-09] The lpn example network is a real ring main, at project scale.**
  `drawExampleNetwork()` in `js/looped-network.js`. Replaced the two-parallel-pipes placeholder.
  - **Shape:** one reservoir, one pump (link) into a tie-in junction, then a closed ring of five
    junctions with varied demands and elevations. Cyclomatic number is exactly 1, and the flow
    leaves the tie-in BOTH ways and meets a hydraulic divide between J3 and J4 (head loss crosses
    zero there) — the behaviour a parallel pair structurally cannot show, and the reason looped
    networks need a solver.
  - **Scale was the real complaint, and it is a RATIO, not a size.** Tom, 2026-08-09: the old
    example's 45 x 20 extent was "unrealistically small and too small relative to the initial
    default text and symbol size". Symbols follow the text through `symbolFactor()`, so they needed
    nothing; text and geometry had to move together.
  - **Final geometry (after Tom's review the same day): 1400 x 700, centred exactly on 5000,5000.**
    He asked to "scale it all down about 50% and center it or anchor it around 5000,5000" — the
    anchor puts the example in positive coordinates that read like a survey or state-plane grid
    rather than a sketch starting at 0,0.
  - **ONE drawing, not two, and the metric one is a physically LARGER system.** The first cut
    scaled coordinates per unit preset; that was dropped, and the same 1400 x 700 layout now serves
    both. Only the real SI quantities go through `niceDefault()`.
  - **Map coordinates are NOT unitless — they FOLLOW the Length/Map declaration.** Tom said
    "unitless" on 2026-08-09 and corrected himself the same day: *"I was too adamant… The truth is
    that they follow length and elevation."* So the one drawing is a 1400 **ft** ring in US and a
    1400 **m** ring in SI — ~3.3x larger, not the same system in other units. **Accepted
    deliberately:** both are realistic systems, both solve to sensible pressures, and *"that's okay
    since there is no background right now."* **That last clause is the condition, and it is the
    thing to re-examine** — the day the example ships over a backdrop, a scale meaning two
    different things becomes visible and wrong.
  - **Text size: the shipped default, 20, and NOTHING ELSE. Three rounds to land on the simplest
    answer.**
    - Round 1 wrote `settings.textSize` in the example only. The map drew at 20 while the Settings
      panel still read 2.5 — Tom flagged that as a condition that "should be impossible", and he
      was right. **The real defect was not the write; it was that the panel was built once at init
      and only repainted by the writers that remembered to.** `toggleSettingsPopup()` now rebuilds
      on every open, making the panel a *view* of `settings` rather than a copy. That is what makes
      writing a setting from anywhere safe.
    - Round 2 removed the write and relied on `defaultSettings().textSize: 20` alone. **That
      reaches nobody who has used the page before**, because `loadFromStorage()` does
      `Object.assign(defaultSettings(), savedSettings)` — a stored 2.5 wins over a raised default,
      forever. Tom: "Now text size is per the Settings, but that is still 2.5."
    - **Final (Tom's call, and it dissolves the problem rather than solving it):** *"How about we
      circumvent the settings and doc issue by just shipping with an initial default text size that
      works for our example network, namely 20? And we remove our changes to text size at the time
      of draw. Anything other is on the user, not us."* `defaultSettings().textSize` is 20;
      `drawExampleNetwork()` touches it never. A visitor who changed their text size has expressed
      a preference and an example is not a reason to overrule it — and the Undo wart (settings are
      not part of `doc`, so a snapshot cannot restore them) simply stops existing.
    - **Consequence to know: a returning visitor keeps their stored 2.5** and must click Restore
      defaults once, or set 20 by hand. Accepted deliberately, per the quote above.
    - 2.5 was the old fixed `LABEL_FONT_SIZE` carried over unexamined; it suits a map a few dozen
      units across, which nobody draws.
  - **`LPN_BASE_TEXT_SIZE` stays 2.5 and did NOT follow the default.** Its only job is to record
    what size the fixed world dimensions were drawn for so everything scales together; moving it in
    step would pin `textFactor()` at 1 and leave symbols and label offsets at their old absolute
    size while the lettering grew 8x.
  - **Numbers:** 6 in / 150 mm ring at C = 130, ~250 gpm / 15 L/s total demand, pump duty at that
    flow. Solves to 52–63 psi (365–422 kPa) at every junction, 0.05–1.5 fps velocities. Both unit
    presets are the same drawing at different scale, not a conversion of one another.
  - **Zoom-to-fit now happens TWICE, and the second one is the point.** `zoomExtent()` fits to
    RENDERED label text, but a network built in code is fitted before the 300 ms debounced solve
    has produced any — so labels appeared outside the map a third of a second later (Tom's second
    complaint). `fitAfterSolve` / `consumeFitAfterSolve()` request one more fit on every exit path
    from a solve, including the async EPANET one. `drawTestGrid()` uses it too.
  - **Kept deliberately:** reservoir level with the network (so the pump is visibly the reason
    there is pressure), the 3-point datasheet-shaped pump curve, and US/SI through `niceDefault()`.
  - **Three bend vertices across two pipes** (Tom: "it would be nice to have more than one vertex
    for demonstration") — a two-vertex dog-leg on the long back run and a single easy bend on the
    return. One vertex shows that pipes can bend; several show they are polylines. The other three
    legs stay straight, because a ring with a kink in every leg reads as sketchy, not as a plan.
  - **Coordinates are NOT run through `niceDefault()`** — lengths and map coordinates are
    declarative (1 grid unit IS 1 ft or 1 m, no conversion), so they are scaled by a local `gu`
    factor instead. Getting this wrong would silently produce a 3.3x-wrong drawing.
  - **A SECOND, SEPARATE SYSTEM — a gravity feed with no pump.** Tom, 2026-08-09: *"It still would
    be nice to demonstrate that separated systems are acceptable. A separate simple reservoir, pipe,
    and demand isn't a bad demonstration."* A tank at 200 ft / 60 m feeding one demand, touching the
    ring nowhere. Nothing else on the page says disjoint components are legal, and a user who
    assumes one drawing means one connected network will never try it — yet the solver handles them
    natively, needing only a fixed head per component. The gravity/pumped contrast is the bonus:
    beside a ring that only has pressure because a pump gives it some, the two say more than either
    alone. **This does not undo the 2026-07-30 "reservoir level with the network" decision** — that
    exists so the RING's pump is visibly load-bearing, and it still is.
    - **Drawn INSIDE the ring, not below it.** Tom, 2026-08-09: *"Drawing the separate system
      outside our main loop effectively changes the scale of the project too much. We must draw the
      separate system inside our main loop so that our text doesn't look too small."* The ring's
      interior is space zoom-to-fit already pays for, so a system placed there is free; slung
      underneath it added ~350 units of height and shrank every label on the map. Kept clear of the
      tie-in's multi-line data label, which grows down-and-right into the interior. The harness
      asserts containment within the ring footprint.
    - Its elevations are chosen so it stays **above** the ring's minimum pressure (60.4 psi / 406 kPa
      against the ring's 52 psi / 365 kPa). A separate system that quietly stole the network low
      would make the "Lowest pressure" callout a lie while every other assertion still passed. The
      harness checks the minimum across BOTH systems.
    - The drawing is now 8 nodes / 7 links / **2 components**, and independent cycles = links −
      nodes + components = 1. Still exactly one loop; the second system adds none.
  - **Four Text annotations, composed entirely from strings that already existed** (Tom, 2026-08-09:
    *"To minimize translation load, we can compose it from existing lang strings"*). A two-line
    title block — `menu_brand` at size x2 over `lpn_main_menu` at x1.5 — plus `lpn_tool_add_reservoir`
    on the reservoir and `bpn_p_min` ("Lowest pressure") anchored to the minimum-pressure junction.
    **Net translation cost: zero new keys.** `menu_brand` is suite chrome (all 26 languages);
    `bpn_p_min` is the sibling calculator's and exists wherever `lpn_` does — the harness asserts
    that for es/pt/fr/tr. This also makes Text the fifth element type the example demonstrates, and
    shows the per-label size multiplier doing something visible.
  - **Two annotations Tom asked for were NOT built, and the reason is a rule, not an oversight.**
    A callout carrying "Double-click a pipe to add or remove a vertex" would have to be spliced out
    of the third sentence of `lpn_mode_select`, and cutting a clause out of a translated sentence is
    exactly the fragment composition CLAUDE.md bans (it breaks in gendered, word-order and RTL
    languages). A velocity callout has no string to borrow — only the bare word "Velocity", no
    "Highest velocity". **Either would need one new key**, which is a fine trade if wanted; it just
    is not free, which was the premise.
  - **The pressure extrema tick does not mark the lowest junction, and we are not fixing it.** Tom
    found this and ruled on it, 2026-08-09: the reservoir sits at zero gauge pressure and is almost
    always the network low, so it takes the "low" tick and no junction is marked. The fix would be
    a rule plus a checkbox ("ignore reservoirs during pressure extrema") or a silent special case,
    and he judged both worse than the wart. The `bpn_p_min` callout is the cheap substitute. **Do
    not re-propose the checkbox.**
  - **Anchored labels must sit ENTIRELY to one side of their node, and the offset is MEASURED.**
    First cut centred them over their anchors (offsets of 0 and 40 against labels hundreds of units
    wide). Tom, 2026-08-09: *"they both are oriented badly in the worst way, centered over their
    anchor so that their leaders look worst of all possible positions. A centered text looks better
    unanchored."* Exactly right, and the mechanism explains why: a Text label is `text-anchor:
    middle`, so `lb.x` offsets its CENTRE, while `updateLabelGeometry()` runs the leader to the near
    EDGE (`px ± halfW`). Offset by less than half the text width and that edge falls **inside** the
    words, so the leader is a stub poking out from under the middle of them. **The existing
    left/right flip logic was never the problem** — it resolves the side correctly from the sign on
    its own. The fix is to render the text, read its real width, then push the centre out by half
    that plus a gap clearing the node symbol. A constant cannot do this; the width depends on the
    string, the language, and the label's own `sizeMult`.
  - **Leader ANGLE is derived too, from one shared constant `LPN_CALLOUT_ANGLE`.** Tom, 2026-08-09:
    *"Leaders don't look great horizontal. Ideal angle is 60 degrees like you make the 'lowest
    pressure' text."* The leader runs to the label's near edge, which sits exactly `gap` away
    horizontally — the text width cancels out — so the slope is `atan(|dy| / gap)`, and a FIXED `dy`
    could not hold one angle across both callouts: `nodeRadius()` is `JUNCTION_R` for a junction but
    half the tank's longer side for a reservoir, so equal rise over unequal gap is unequal slope.
    - **Set to 70, not 60, and that is deliberate.** The J3 callout Tom was approving when he said
      "60" actually measures ~70 (a 60-unit rise over a 22.2-unit gap). The two halves of his
      sentence disagree, so the code keeps the appearance he approved rather than the number he
      estimated from it, and says so at the constant. One line to change if a true 60 reads better.
  - **The title block is tucked close to the ring, and its two lines are stacked by derivation.**
    `bbox()` includes the title, so white space above the drawing is space zoom-to-fit must shrink
    everything else to accommodate — which is why Tom asked for the lines 120 and 60 units further
    south. The second line anchors the block and the first is derived from it by half-heights plus a
    gap, because his flat 120 would have overlapped them by 5 units at the default text size (the
    lines are 40 and 30 units tall). Deriving also keeps the block tight at a non-default text size.
    - Then back up 20 — *"I pushed too hard. Can you move them both up or move J2 down about 20?"*
      **Moving the title, not J2, is the right half of that choice:** J2 is a ring vertex, and the
      ring being exactly 1400 x 700 centred on 5000,5000 is worth more than 20 units of clearance
      (dropping J2 makes it 1400 x 680, off-centre). The title block carries no such constraint.
      Final clearance, edge to edge at the shipped text size, is 35 units.
  - **`bbox()` was reserving a constant ±2 for a Text label's height.** Correct only while the text
    size was 2.5; at the shipped 20 with the title's x2 multiplier the label is 40 units tall and
    the fit clipped it. Now half the label's own `effectiveFontSize(lb.sizeMult)`.
  - **Tom's zero-pressure calibration idea went into the HARNESS, not the shipped map.** He proposed
    adding independent reservoir-pipe-junction stubs tuned so the junction pressure reads exactly
    0.00, one for US and one for SI, as a sneaky regression test. The idea is right and is now
    implemented — but in `example-network-harness.js`, for two reasons. On the map only one of the
    pair can read zero at a time (the other is tuned for the other preset), so a visitor in the
    wrong unit set sees a stray stub reporting an arbitrary number beside a ring main we spent this
    task making look like real work; and a check nobody runs is not a check. In the harness both are
    exact, both run every time, and the demand is DERIVED by inverting Hazen-Williams in closed form
    rather than iterated by hand, so the tolerance is 1e-6 m instead of "looks like 0.00".
    **Proved it bites:** with the Task 255 fix temporarily reverted, the US case fails at −69.5 m
    gauge head while SI stays clean — exactly the asymmetry the bug had. The visible on-map version
    is still available if wanted; it was a judgment call, not a refusal.
  - **Verified by `node dev/lpn-spike/example-network-harness.js`** (new, 24 checks x 2 unit sets
    plus 2 settings-panel checks, all pass): topology, cyclomatic number, extent, 5000,5000 anchor,
    text default, pump curve shape, convergence, pressure band, flow reversal, velocity ceiling,
    multi-vertex auto length, the pending re-fit being consumed exactly once, the Task 255 unit
    conversion against a hand-computed case, and the Settings panel repainting a value changed
    behind its back, the annotation strings existing and being emitted into pageConfig in en plus
    all four translated languages, and the zero-pressure calibration. It pre-seeds a stored 2.5 so
    it runs as a returning visitor, which is the state Tom was actually in. No browser pass needed.
  - **Final numbers:** 55-63 psi (US) and 361-422 kPa (SI) at every junction, 0.04-1.5 fps.
  - **Example PROJECTS are still open and are a different task — see Task 257.**


## Task 243

- 0|243| **[DONE 2026-08-09] Real EPANET engine in `lpn_`, as an opt-in second engine.**
  `js/lpn-epanet.js` + `js/vendor/` (epanet-js 0.9.0, MIT). Settings toggle, off by default;
  678 KB lazy-imported only when checked, so the offline case pays nothing. Verified
  `node dev/lpn-spike/validate_epanet.js` 8/8 against the native solver.
  - **Manning is a real 0.6% disagreement and we KEPT OURS** — the opposite of the Task 213
    Hazen-Williams call. Measured over an 8x diameter range, EPANET's C-M is a near-constant
    0.9939–0.9944 of ours (*not* the truncated 16/3 exponent, which predicts 0.9924–0.9993 and is
    refuted). Ours is the exact derivation, 10.2936; EPANET's implies 10.231. Adopting EPANET's
    would desync this page from Manning-Pipe-Flow/-Head-Loss/-Trap, which carry most of our users.
    Surfaced to the user, not hidden. **Do not relitigate.**
  - **Vendored as `.js`, never `.mjs`** — module-ness comes from the import statement, but the
    server must still send a JS MIME type and shared hosts routinely do not know `.mjs`. Same
    reasoning chose the WASM-embedded build over a separate `.wasm`. See `js/vendor/README.md`.
  - **`dev/lpn-spike/validate.js` had been silently FAILING** and was repaired in passing
    (`bootstrap.js`). `EngCalcs.G` lives in `js/Calculators.lib.js`; a Node `require()` of
    lpn-solver.js skips it, every minor-loss and D-W resistance went `NaN`, and the gradient floor
    swallows `NaN` because `!(NaN > gradMin)` is true — so networks "converged" in 2 iterations to
    no head loss and reported success. Browser was never affected. **The lesson is that a harness
    nobody runs is worse than no harness: run both before trusting either.**


## Task 245

- 0|245| **[DONE 2026-08-09] About-page resync + `menu_libre` into all 26 languages.** 3 keys ×
  26 agents (Sonnet). Final state: parity `missing 0, extra 0, equal_to_english 0`; drift manifest
  re-baselined; friction gate 6/6 answered.
  - **Every language used its own established free-software term; not one transliterated "libre"** —
    the exact failure the new `glossary.json` entry was written to prevent. es *software libre*,
    de *Freie Software*, ru *Свободное ПО*, zh *自由软件*, ar *برمجيات حرة*, am *ነጻ ሶፍትዌር*,
    km *កម្មវិធីសេរី*, my *လွတ်လပ်သော ဆော့ဖ်ဝဲ*, sw *Programu Huria*.
  - **Found and fixed a silent parse-truncation bug in `lang_parse.inc.php`** (see its comment).
    Burmese at 3 bytes/char pushed one value to 8,354 bytes, exhausting PCRE's JIT stack;
    `preg_match_all` returned false, the return was unchecked, and the parse silently truncated to
    386 of 563 keys — blinding the validator, parity checker, completion matrix and payload
    generator at once. **This was luck, not diligence: it surfaced only because Burmese prose
    crossed the threshold first.** Any multi-byte script at ordinary paragraph length reaches it.
  - **Two agents committed and one pushed despite "do not run git commands."** A bare instruction
    loses to CLAUDE.md's commit-by-default policy inside a subagent. The wording that held was an
    explicit "DO NOT RUN ANY GIT COMMAND — no add, no commit, no push, no status." Use that form.
  - Long-running agents are normal: km and my each ran ~6 h across a session-limit reset and
    finished correctly. **Check the file before relaunching a "failed" agent** — sw and ps had
    already written their work when their agents died.


## Task 146.10

- 0|146.10| **[DONE 2026-08-09] Real element symbols on the lpn map, from the Task 231 icon set
  (Task 146 child).** Scoped with Tom 2026-08-08. A reservoir and a junction were the same `<circle>`
  mark, told apart only by size and colour — the same mark in greyscale and to a red-green
  colour-blind reader (~8% of men) — and a pump (a *link*, not a node) had no symbol at all, just a
  plain coloured line.
  - **Reservoir**: the plain circle in `js/looped-network.js` `buildNodeEls()` stays exactly as it
    was — same radius, same `data-node`, same click/drag/hit-test path — but is now invisible
    (`fill:none; stroke:none`) and kept clickable purely via `pointer-events:all` (`css/engcalcs.css`
    `.lpn-node-reservoir`). A second, non-interactive element drawn on top of it is the real visible
    mark: the toolbar's own reservoir icon (`lib/Icons.lib.php`, arrived as `EngCalcs.icons` — never
    redrawn), placed via `buildMapIconSvg()`, a nested `<svg viewBox="0 0 24 24">` sized to
    `2×nodeRadius(n)` and positioned by `positionNodeSymbol()`. Junction is unchanged — it was already
    a filled circle, which is what the Task 231 icon draws too.
  - **Pump**: same reuse pattern, on a link instead of a node — `buildLinkEls()` adds a `<g
    class="lpn-link-symbol-pump">` in the nodesLayer (so it paints over every pipe it crosses),
    holding the pump icon (casing + tangent discharge tail) at the link's own from/to midpoint.
    **Orientation, verified over all 25 angles at 15° steps, 0 failures:** always
    `rotate(atan2(to.y−from.y, to.x−from.x))` so the discharge points at the `to` node, and — because
    that rotation alone swings the tail under the casing for every westward pump — vertically flip
    (`scale(1,−1)`) first whenever `dx = to.x − from.x < 0`. Boundary is on `dx`, never `dy`: at
    `dx=0` the tail lands horizontal and either variant is correct. Verified in a headless-browser
    check (Playwright): an east-pointing pump transforms to `rotate(0)`, no flip; a west-pointing one
    (built by drawing a pump from an east node to a west node through the actual toolbar) transforms
    to `rotate(180) scale(1,−1)`, exactly as specified.
  - **Every constraint the scoping note called out held with no extra work**, because `nodeRadius()`
    itself was left untouched — only what gets DRAWN inside its footprint changed. `segmentMidpoints()`
    (arrow clear-run), label mask/leader placement, hit-testing, and the zoom-extent `bbox()` all still
    read the same scalar radius they always did, so none of them needed to change.
  - Symbol sizing (`pumpSymbolSize() = 4 × symbolFactor()`) is a starting value, a one-line change if
    Tom wants pumps to read larger or smaller relative to reservoirs/junctions — noted rather than
    hand-tuned, same spirit as `lib/Icons.lib.php`'s own "one-line change" notes on the pump tail.
  - **Follow-up, same day (Tom): two more things needed fixing before this could ship.**
    1. **Opacity.** A toolbar icon is drawn stroke-only (`fill:none` — correct for a button, nothing
       is ever behind it), so on the map a pipe ran right through the open/translucent parts of a
       reservoir tank or a pump casing and stayed visible. Fixed by `prependSymbolBackdrop()`: an
       opaque patch (rect for the reservoir, circle for the pump casing — matching each icon's own
       silhouette, not just its bounding square) inserted as the FIRST child of the icon's nested
       `<svg>`, so it paints underneath the icon's own unmodified linework. Filled with the new
       `--lpn-map-bg` custom property (`#f7f7f2`, matching `#lpn_canvas`'s own inline background).
       Verified by sampling actual rendered pixel colour through a zoomed screenshot (not just DOM
       structure) at the pipe's centerline through both symbols — solid backdrop colour, no pipe
       colour bleeding through, on both.
    2. **Sizing.** Read as "twice as large" next to text: junction was a diameter-3.2 circle,
       shrunk to `JUNCTION_R = 0.72` (was 1.6× symbolFactor — 0.45×, inside Tom's asked-for
       0.4-0.5× range). Reservoir was *also* a scaled-up copy of that same circle's square box
       (`2×nodeRadius(n)` on a side, so a tall/square tank) — Tom didn't want a uniform shrink here
       (would also narrow it), wanting instead what EPANET's own reservoir icon looks like: wide,
       not tall. Reservoir now has its own independent width/height
       (`RESERVOIR_HALF_W = 3.3, RESERVOIR_HALF_H = 1.1` — half-height is exactly his instruction,
       "shortening its height to 0.5 its current height" of 4.4; half-width is a widened starting
       value, not a specified factor, since that half of the ask was an experiment to try, not a
       number he gave). Needs `preserveAspectRatio="none"` on the nested `<svg>` so the icon
       actually stretches into that non-square box instead of a default "meet" letterboxing it.
       `nodeRadius(n)` — the one scalar every OTHER consumer (clear-run insets, label mask/leader,
       hit-testing, `staticObstacleBoxes()`, the zoom-extent `bbox()`) still reads — now returns the
       CIRCUMSCRIBING radius (half the longer side) for a reservoir rather than a true radius:
       generous rather than tight, so none of those consumers clips the wide/short tank on either
       axis. Pump's own size was confirmed correct as shipped ("literally the same size as text, as
       advertised") and deliberately left alone. All four numbers (`JUNCTION_R`,
       `RESERVOIR_HALF_W`, `RESERVOIR_HALF_H`, `pumpSymbolSize()`'s `4`) are one-line changes,
       explicitly experimental starting values per Tom's own framing ("since all is customizable,
       maybe we should try...") rather than settled numbers — revisit if he wants any of them
       nudged after looking at it live.
  - **Second follow-up, same day: the map/menu reservoir widths pull in opposite directions on ONE
    shared path, which needs a division, not two independent percentages.** Tom asked for both at
    once: the MAP reservoir "about 80% as wide as they are", and the MENU (toolbar) reservoir "as
    wide as you can make it... about 50% wider" — but the menu icon has no separate box-width knob
    the way the map does (`RESERVOIR_HALF_W`); its only lever is `lib/Icons.lib.php`'s own path
    coordinates, which is the SAME path data the map stretches via `preserveAspectRatio="none"`.
    Widened the shared path from x:6-18 (12 wide, margin 6) to x:3-21 (18 wide, margin 3 — this
    set's own established convention at this size, matching `file`/`image`/`zoom`), landing the
    menu icon at exactly 1.5x. Left alone, that widening would ALSO have widened the map's
    rendering by the same 1.5x. `RESERVOIR_HALF_W` was reset to `1.76` (not `3.3 x 0.8 = 2.64`) to
    back out the path's own 1.5x first — see the derivation comment beside the constant in
    `js/looped-network.js` — so the map lands at exactly 80% of its ORIGINAL (pre-either-change)
    width while the menu lands at exactly 150% of ITS original. Both verified in a headless
    browser: toolbar row screenshot shows the reservoir button visibly wider than its neighbours;
    zoomed map screenshot confirms the tank is narrower than before AND still fully occludes the
    pipe underneath it (the backdrop rect's own x/width were updated to match the widened path,
    same (3,4)-(21,20) box). Height, on both surfaces, was untouched by this — only x-coordinates
    changed, so `RESERVOIR_HALF_H` and the icon's y-coordinates are exactly as the first follow-up
    left them.
  - **Third follow-up, same day: menu confirmed, map still too wide — but no shared-path change
    this time.** Tom: menu icon "approximately square looks as expected... looks great"; map "still
    looks a bit too wide, but its side walls are good now" — i.e. the shared path's wall-to-box
    ratio (0.75, set in the second follow-up) is right, only the map's own box needed to shrink
    further, on top of that. Since `lib/Icons.lib.php` didn't change this time, no division was
    needed: `RESERVOIR_HALF_W = 1.76 x 0.8 = 1.408`, a plain 80% of the prior value. Verified in a
    headless browser at the same zoom level as the second follow-up's check — tank visibly
    narrower, side-wall proportions unchanged, pipe still fully occluded underneath it.


## Task 235

- 0|235| **[DONE 2026-08-09] The glossary's `pressure` and `elevation` entries no longer hold the
  UPSTREAM label form in any of the 26 languages.** Found during the Task 146.06 sprint,
  2026-08-08 — by a translation agent: the tr agent was handed `preferred_translation` = "Memba
  basıncı" (*upstream* pressure) for a generic node label, recognized it was wrong for the
  concept, and declined.
  - **What happened:** both entries were created in the Task 166 sprint by harvesting the attested
    label forms of `hw_pressure_up` and `hw_elev_up`. Those are *upstream-specific* labels. The
    entries' own `translation_notes` said so plainly ("ATTESTED LABEL FORMS of `hw_pressure_up`"),
    which is how the defect survived: it was documented as a feature.
  - **es, pt, fr, tr** were already corrected in the 146.06 sprint, from attested
    `lpn_result_pressure` / `lpn_field_elev`. **The other 22 languages**, corrected here, from
    `bpn_show_p` ('Pressure') / `bpn_show_elevation` ('Elevation') — both bare-concept keys
    already translated into all 26 languages, free of the upstream framing, verified against each
    language's own file before writing back. No sprint, no agents — direct per-language lookup.
  - `translation_notes` on both entries carry the 2026-08-09 correction record.
  - Spun off **Task 242**: check whether other glossary entries populated in the same Task 166 pass
    carry the same specific-label-as-concept scope error.


## Task 238

- 0|238| **[DONE 2026-08-08] "Map display and sizes" fixed at the source; "Restore defaults" audited
  in all 26 and given a glossary entry.** Two labels Tom read on the shipped page.
  - **`lpn_settings_map_display`: the ENGLISH was the defect, so the English was fixed.** Tom:
    *"the short name could be just Map Display... But in Spanish it is translated as 'Display of the
    map and sizes'."* He was right about the symptom and right about the cure. "Map display and
    sizes" is an ambiguous coordination — is it *[map display] and [sizes]* or *[map] [display and
    sizes]*? — and every language had to guess, leaving a dangling "y tamaños" / "e tamanhos".
    **The section holds text size, symbol size and opacity, backdrop opacity, map height and legend
    position — all of them display settings, so "and sizes" named a subset, not a second category,
    and dropping it loses nothing.** Now **"Map display"**, retranslated in all 4: es
    *Visualización del mapa*, pt *Exibição do mapa*, fr *Affichage de la carte*, tr *Harita
    görünümü*.
    - **Deliberately NOT given an `$ec_lang_intent` entry**, though Tom raised the option. Once the
      English is unambiguous the label is plain, directly-translatable technical English, and
      CLAUDE.md is explicit that adding an intent to a plain label is itself a defect — it burns
      translator attention on something no longer at risk. **Fixing the English fixed all 26
      languages at the source; an intent would only have described the ambiguity we removed.** This
      is the English-reform gate working as designed.
  - **`calc_defaults` ("Restore defaults"): audited across all 26.** Tom: *"default is a troublesome
    word... it should be easy to find standard renditions in any language. so I am hesitant to
    judge. I just want it to be right."*
    - **Method: cross-check each language against ITSELF**, not against outside judgement — every
      language ships this concept twice (`calc_defaults` and `calc_defaults_confirm`), so a language
      that contradicts itself has a defect provable from inside its own file. That is what makes
      this auditable without a native speaker for each of 26.
    - **3 real defects found and fixed, each self-evidenced:**
      1. **ro** — button was bare *"Resetează"* ("Reset"), concept dropped, while its own confirm
         string said *"valorile implicite"* correctly. Now *"Restabilește valorile implicite"*.
      2. **sw** — confirm said *"maadili ya kawaida"*. **`maadili` means morals/ethics**; the word
         this file uses for a numeric value in **19 other keys** is `thamani`, and the button
         already used the correct `chaguo-msingi`. Now *"thamani za awali za chaguo-msingi"*.
      3. **he** — *"לערכים ברירת המחדל"* required the construct state before a definite noun
         phrase. Now *"לערכי ברירת המחדל"*.
    - **3 languages deliberately left alone as lower-confidence** rather than guessed at: **am**
      (ነባሪ vs ነባር across the two keys), **my** (ပုံမှန် = normal/regular, may or may not be the
      settled Burmese software term), **id** (*"Pulihkan Default"* — the loanword is genuinely
      standard in Indonesian UI, but the Title-Cased *Default* mid-phrase is odd). Two are 0.65-tier
      languages where our own confidence is lowest by design. **Recorded, not silently "fixed".**
  - **New glossary concept `default (setting)`** (version 1.25 → 1.26) with all 26 attested forms
    and a 5-item `avoid` array. The dangerous senses are named explicitly — **financial** (defaulting
    on a debt, the dominant everyday sense in many languages), legal, sports-forfeit — plus the two
    real failure shapes this audit found: *dropping the concept* (ro) and *substituting a
    normal/usual word* (sw). Per the defer-to-cultural-standard principle the entry records that
    bn/hi/id/ps legitimately use the English loanword: it IS the local software standard there, and
    that is correct rather than a transliteration defect.
  - **Wired into `prefixToTermNames()`: `lpn`, `bpn`, and a new `calc` entry** — suite chrome had no
    entry at all and was silently falling back to the default three terms, so the button that owns
    this concept could never have received its own guard. Verified by resolution (calc 4/4, lpn
    35/35, bpn 28/28) and by reading the generated `DO NOT render as:` line.


## Task 237

- 0|237| **[DONE 2026-08-08] "Zoom to fit" shipped meaning "adjust the zoom" in 2 of 4 languages.**
  Caught by Tom reading the shipped Spanish: *"Zoom to fit in Spanish is ajustar zoom. I could be
  wrong, but I think that's wrong."* He was right, and it had spread further than the one example.
  - **The review he asked for, complete.** `lpn_tool_zoom_extent` is a `lpn_` body string, so only
    es/pt/fr/tr carry it — a 4-language review, not 27. es *Ajustar zoom* ("adjust zoom") and pt
    *Zoom para ajustar* ("zoom to adjust") were both wrong; fr *Zoom sur l'étendue* and tr *Tümünü
    göster* ("show all") were both correct. Fixed to **es *Ver todo*, pt *Ver tudo***.
  - **Why it happened, and why the English is deliberately NOT reformed.** The lure is the word
    "fit": it invites a fitting/adjusting verb while saying nothing about *what* is fitted, so a
    translator with no other context lands on "adjust" and produces a label describing the zoom
    slider rather than the button. The English-reform gate was considered and declined — "Zoom to
    fit" is an established UI idiom (browsers, PDF viewers, design tools all ship it) and renaming a
    recognized control costs more than guarding it. The guard is the glossary entry, not a rename.
  - **New glossary concept `zoom to extents`** (version 1.24 → 1.25) with a 4-item `avoid` array
    that names this exact failure, plus the attested forms for all four languages. **Two registers
    are both correct and both are recorded**: CAD-faithful (fr, matching AutoCAD's own
    *Zoom Étendu*/*Zoom Extensión*) and plain (tr *show all*). Tom chose plain for es/pt, so 3 of 4
    now share the show-everything model. An adjust-the-zoom reading is what the entry forbids.
  - **Wired into `prefixToTermNames()` in the same commit** — verified by resolving the `lpn` map
    against the live glossary (34 of 34 names resolve, the new term among them) and reading the
    generated `DO NOT render as:` line. **This is the step that Task 146.06 found had never been
    done for `lpn` at all**; a glossary entry that is not in that map reaches no agent, so adding
    the entry without the map line would have been the same defect in miniature.


## Task 236

- 0|236| **[DONE 2026-08-08] The last preview-era sentence is gone — Tom said delete.**
  `lpn_notes_3_def` ended *"Because this is an early preview, please use it for small networks and
  for testing only."* The 2026-08-08 PREVIEW removal took the 3 identity keys and the banner but
  missed this one, and the Task 146.06 sprint had just translated it into es, pt, fr and tr.
  - **Raised as a question rather than fixed inside the sprint**, because the sentence tangled a
    dead preview framing with a live scale caution, and dropping a caution nobody decided to drop
    is not a translation sprint's call. Tom's answer was "delete" — the size guidance goes with it.
  - **Deleted from all 5 files that carry it** (en + es/pt/fr/tr; no other language has `lpn_` body
    strings), drift manifest re-baselined, payloads FRESH, `equal_to_english` still 0 suite-wide,
    and the page re-rendered in es and fr to confirm no preview wording survives anywhere.
  - **`lpn_` now carries no preview language in any of the 27 lang files.** Four stale mentions
    remain in `js/looped-network.js` (lines 2078, 3225, 5602, 6164) but they are **code comments
    only** — never rendered. One of them (5602) explains a button's existence as a
    preview-era convenience, so it is worth a read next time that code is touched; it is not worth
    a commit of its own.


## Task 146.06

- 0|146.06| **[DONE 2026-08-08] Translation sprint for `lpn_` strings (Task 146 child).**
  `lpn_` is now translated into es, pt, fr and tr — **223 keys × 4 languages**, 4 Sonnet agents,
  plus 10 non-`lpn_` stragglers the payloads swept up. Sized by the coverage declaration (Tasks
  203/204): `lpn_` is not a core calculator, so it gets the core languages, and its 3 identity
  strings were already translated in all 26. **Suite-wide `equal_to_english` is now 0.**
  - **A pre-sprint check caught the sprint's biggest risk before a single agent was spawned.**
    `prefixToTermNames()` in `generate_translation_payloads.php` had no `lpn` entry (nor `bpn`), so
    both fell back to the three default terms and **every network concept seeded in Task 193 —
    `node`, `link`, `vertex`, `junction`, `reservoir`, `scenario`, `project`, `draw`, `background
    image`, `demand`, `pump curve`, `pressure rating`, each with a hand-written `avoid` array — was
    invisible to translation agents.** That seeding was the whole point of 193's glossary work.
    Fixed in `7c86785`; payloads went from 3 injected terms to 33. **The lesson generalizes: a new
    calculator prefix needs a `prefixToTermNames()` entry, or its glossary work silently never
    ships.** Nothing warns you — the generator just uses the default three.
  - **The trap terms held.** Every language avoided its hyperlink word for `link` (es *enlace*,
    fr *lien*, tr *bağlantı*), the draw-water sense of `draw`, and the computing sense of `node`.
    The paired **Reservoir/Tanks** trap — English uses the first for the node type and the second,
    in `lpn_notes_2_def`, for what `lpn_` deliberately does NOT model — was kept distinct in all
    four unprompted: es *embalse*/*depósitos*, pt *reservatório*/*tanques*, fr *réservoir*/
    *réservoirs à niveau variable*.
  - **Where the languages diverge, they diverge for a reason, and it is recorded.** es splits
    *nodo* (generic node) from *nudo* (the junction subtype), matching EPANET-Spanish; tr does
    **not** split, because Turkish water-engineering practice uses *düğüm* for both and
    disambiguates by context. The tr agent explicitly declined to coin an artificial distinction.
    Both decisions are now in `glossary.json` rather than waiting to be re-derived next sprint.
  - **Glossary write-back done before close, as required.** The 12 concepts 193 seeded empty now
    carry es/pt/fr/tr values and dated notes. Glossary version 1.23 → 1.24.
  - **Three defects the sprint exposed, all fixed in `19355f2`:**
    1. **`lpn_notes_4_def` promised "Other languages: this page is in English only for now"** — a
       sentence this very sprint makes false, and which rendered as *"por ahora esta página está
       solo en inglés"* on a fully Spanish page. Removed from en and all four; drift manifest
       re-baselined. **A sprint must re-read the page's own prose for claims the sprint invalidates
       — the translation agents will faithfully translate a lie.**
    2. **The glossary's `pressure` and `elevation` entries stored the UPSTREAM label form as the
       bare concept**, in all 26 languages — `Pression amont`, `Memba basıncı`, `Presión aguas
       arriba`. The entries' own notes admitted they were "ATTESTED LABEL FORMS of `hw_pressure_up`".
       Any agent following `preferred_translation` literally puts "upstream" on a generic node
       label. **The tr agent caught this itself and declined to apply it.** Fixed for the four
       sprint languages; the other 22 are **Task 235**.
    3. **tr rendered `lpn_field_id` as "Kimlik" while its own `bpn_id` stayed "ID"** — same concept,
       same suite, two spellings. Aligned to the incumbent per the label-reuse convention.
  - **QUALITY scores unchanged at 0.85** for all four, which is the honest tier: AI-translated,
    back-translation-checked, consistency-checked, never confirmed by a native human. 0.95 needs a
    review on file and there is none.
  - **`lpn_` is now clear to deploy** as far as this task is concerned — the hold recorded when
    PREVIEW came off ahead of the sprint is released. See **Task 236** for the one leftover
    preview-era sentence that is Tom's call, not a blocker.


## Task 230

- 0|230| **[DONE 2026-08-08] The open-channel velocity verdict stopped citing water hammer.**
  `Manning-Trap.php` and `Manning-Irregular.php` fed the channel high-velocity verdict from
  `$ec_lang['mhp_vel_high']` — there was no `mtc_vel_high` — so a trapezoidal channel was told to
  check transition losses and water hammer. A real `mtc_vel_high` now exists and both pages read it,
  translated into all 26 languages the same day. Parity delta 0.
  **Translated inline by the orchestrating model, not by a 26-agent sprint** — 26 paid agents for
  one string is the wrong shape. Each language was anchored on vocabulary already shipped in its
  own file (`mtc_note_2_def` for expansions/bends/obstructions, `rc_yn` for erosion,
  `mi_notes_2_term`/`rc_main_desc` for lining); all 78 term probes matched. Glossary write-back:
  new `channel lining` and `erosion` entries, glossary 1.22 → 1.23.
  **Side effect worth knowing:** the mandatory `detect_english_drift.php --update` re-baselined 232
  keys, of which 227 are `lpn_` — a pre-existing unbaselined backlog from the English-only preview,
  not this task's doing. Harmless (parity and coverage still report them), but it means the drift
  manifest now treats those lpn_ strings as synced.


## Task 232

- 0|232| **[DONE 2026-08-08] `Irrigation.php` removed — the page and its 17 keys are gone.**
  Tom called the menu entry "harmful and spammy" (it was the only non-calculator under Hydraulics,
  labelled the bare word "Irrigation", fronting a card index that pointed back at the dropdown
  containing it). The entry went 2026-08-08; the page stayed pending the one number nobody had.
  **That number arrived the same day and settled it: reach 1,977, confirmed humans 0, used 0.**
  Pure crawler traffic — the usage log's own reading of "high reach + ~0% human" — so there was no
  audience to strand. Deleted: the page, its `sw.js` precache line, and all 17 `irr_` keys across
  27 lang files (476 lines), which also retired `irr` from the translation payloads' active
  prefixes. `generate_sitemap.php` globs `*.php`, so the sitemap dropped it on regeneration;
  `glossary_compliance_audit.php` had hardcoded `irr_` keys as its 'weir' and 'conveyance
  efficiency' samples and now uses `ws_`/`wi_`/`cs_` instead.
  **`../sitemap.xml` is regenerated but NOT tracked by git** — it must be re-uploaded to the site
  root when this deploys, or the dead URL stays advertised.


## Task 231

- 0|231| **[DONE 2026-08-08] Toolbar: icon as a small prefix to the text, never icon-only.** Added
  `↺` Restore defaults, `📏` Set units, `🖨` Printable (`lib/Calculators.lib.php`) and `🔗` Copy link
  with a matching `✓ Copied!` confirm state (`lib/Menus.lib.php`), following the existing
  `⬇ Install` / `🌐 English` house style. Glyphs live in the markup, never in `$ec_lang` — a glyph
  baked into a translated value is 27 copies of one decision. No new language keys.
  **Extended to `lpn_` the same day** (Tom: what he actually meant by the request). One `ICON` map
  in `js/looped-network.js` feeds the menu bar, every dropdown row, the toolbar and the backdrop
  select — 31 glyphs, no duplicates, none unused. Menu rows get a *reserved* icon column
  (`.lpn-menu-icon`) rather than an inline prefix, so a row with no natural glyph still aligns;
  confirm-dialog rows (Cancel / Break their lock / Close without saving) deliberately take no icon,
  since they are sentences rather than commands. The five drawing tools map the map — square
  reservoir, circle junction, line pipe — so the icon teaches the canvas notation instead of
  decorating it.
  **Icon-only was rejected on the merits:** it saves no translation work (the label text stays
  either way) and spends first-time comprehension, which is the entire audience a web calculator
  exists for. **The pop-up A/B preference poll was rejected too** — it breaks Task 207's "nothing
  that must be dismissed to proceed" boundary; a "which screenshot do you prefer?" poll measures
  stated preference about chrome, where stated and revealed reliably diverge; and ~4,042
  confirmed humans per period leaves a two-arm split under-powered anywhere but Manning-Pipe-Flow.
  Test chrome variants behaviorally against the `used`-of-`human` band (Task 202) instead.


## Task 146.02

- 0|146.02| **[DONE 2026-08-08] EPANET-style icon toolbar — shipped as Task 231; map symbols
  extracted to 146.10.** The toolbar half is done: one SVG icon set in `lib/Icons.lib.php`, applied
  to the lpn menu bar, dropdowns and toolbar and to shared site chrome. The map-symbol half was
  re-scoped separately as **146.10** and is still open.
  **This task's gate on 146.06 is RELEASED.** It gated the sprint for churn reasons only — the fear
  being that icon-only buttons would turn visible noun labels into `title`/`aria-label` phrases,
  adding and rewriting strings the sprint would then pay for twice. Task 231 chose icon-as-**prefix**
  instead, so every label kept its word and **zero language keys were added, renamed or removed**.
  There is therefore nothing for the promised "193-style re-read" to read. 146.10 adds no strings
  either (it is geometry), so it does not re-gate the sprint.


## Task 205

- 0|205| **[DONE 2026-08-08] One "contact me" line per page, not two — English shipped 2026-08-03, the
  26-language resync (d) completed 2026-08-08.** Raised by Tom,
  2026-08-03, on noticing that `Manning-Pipe-Flow.php` and `Looped-Network.php` showed different
  invitation text. They are not one line with two wordings; they are two separate lines, both
  linking to `contact.php`:
  `echoHelpWanted()`/`template_translation_help` ("Can you suggest better wording…") above the form
  on 18 pages, and `echoFeedback()`/`template_feedback` ("Please send suggestions or praise…") below
  the form on every page. `Looped-Network.php` is the only calculator page that omits the first.
  **They converged in commit `5b3ee95`**, which expanded `template_feedback` to cover suggestions,
  roadmap advising, testing, contributing, and mentorship — swallowing the other line's whole
  purpose. Two collapsible links to the same destination on one page do not double the invitation;
  they halve the weight of each. Four changes; (a)-(c) are DONE in English, (d) is the open debt:
  (a) **DONE 2026-08-03. Deleted `template_translation_help` and every `echoHelpWanted()` call**
  (18 pages); function retired from `lib/Calculators.lib.php`. The key was removed from all 27 lang
  files, so this *removed* 26 translated strings rather than adding any. `lang_parity_check.php`
  reports `extra: 0`, confirming no orphans left behind.
  (b) **DONE 2026-08-03. Folded the wording ask into the surviving line.** Kept because asking a reader whether the wording
  is wrong *in their own language* is the one report only they can file, and per the standing rule
  native review is real only when feedback actually lands — a generic "connect with the project"
  pitch will not prompt a Khmer reader to report a bad label. Final English, settled with Tom
  2026-08-03: `Can you suggest better wording or anything else? Do you want to help or to learn to
  create tools like these? Please contact me.` The roadmap/testing/mentorship prose that `5b3ee95`
  added comes **out** of the page string and goes onto `contact.php`, which is one click away and
  can be as long as it likes. A calculator page's job is to invite; the landing page's job is to
  explain.
  (b2) **DONE 2026-08-03. Removed the `[Hide this line]` toggle from the invitation** (Tom: "Nothing,
  and force a 'Printable version' button click for a screenshot"). A dismiss affordance is the visual
  grammar of a cookie banner, and readers have trained themselves for decades to skip anything
  wearing it — it did not merely permit ignoring the line, it *marked* it as chrome. It was also
  doing no real work: the collapse state has no cookie or storage behind it, so a hidden line
  reappeared on the next page load. `d-print-none` stays and the Printable version button
  (`btn-printable`, in `lib/Calculators.lib.php`) covers the real "I want a clean page" need. An
  `[X]` was considered and rejected — a smaller costume, the same costume. Other collapsible lines
  (`relatedCalcs`, the units row) keep their toggles; those genuinely are chrome.
  (c) **DONE 2026-08-03. Placed the surviving line before the Notes heading on every page, and
  before the sketch on the 9 pages that have one.** Not above the calculator: that is *before the
  reader has been given anything*, when they still want something from us. After the results, the
  ask lands on someone already served — give first, then invite. The top of the page is also already
  occupied by `template_welcome` ("Drop your fears at the door; love is spoken here"), which asks for
  nothing at all; that division is deliberate and should hold. `Looped-Network` is excluded from the
  above-sketch move — its map *is* the calculator, not an illustration of the answer. It was
  before on 6
  (`Looped-Network`, `Branched-Network`, `Irrigation-Pressure`, `Manning-Irregular`,
  `Weir-Flow-Irregular`, `Weir-Flow-Simple`) and after on 10 (`Canal-Seepage`, `Darcy-Weisbach`,
  `Hazen-Williams`, `Manning-Pipe-Flow`, `Manning-Pipe-Head-Loss`, `Manning-Trap`,
  `Micro-Hydro-Power`, `Orifice`, `Orifice-Drain-Time`, `Rock-Chute`). Before-notes is not the
  symmetry argument — Notes are reference prose the reader dips into, sometimes a full paragraph
  (`lpn_notes_5_def`), so an after-notes line lands at the true bottom of the page where nobody is.
  Immediately after the results is where the reader has what they came for and is most able to say
  something useful. It also makes `lpn_notes_4_def`'s "(see the feedback link above)" true by
  design rather than by accident.
  (d) **Resync `template_feedback` into all 26 languages — DONE 2026-08-08, see the record below.** Every
  non-English file currently shows the *pre-`5b3ee95`* short wording ("Please send suggestions or
  praise. Was this free calculator useful?"), which is now two generations behind the English. The
  debt was already owed before this task — `5b3ee95` rewrote the English and no translation followed
  — so merging first paid one sprint instead of two.
  **The debt is tracked, not remembered:** `detect_english_drift.php` flags `template_feedback` under
  CHANGED, and `--update` was deliberately NOT run, because re-baselining the manifest is exactly
  what would erase the signal. Do not run `--update` until all 26 languages are actually resynced.
  The same run reports `template_translation_help` under REMOVED, which is correct and needs no
  action.
  This was one key × 26 languages. The plan of record had been to fold it into the next sprint
  touching these files (`lpn_`'s Task 146.06) rather than stand up 26 agents for a single string;
  in the event Tom authorized it on its own on 2026-08-08, because Task 206 had just made the
  contact funnel measurable and this is the exact string that funnel measures — a baseline taken
  against a stale, off-voice ask in 26 languages would have been worth little.
  **First person is deliberate.** "me", not "us" — Tom, 2026-08-03: "scrupulously honest and
  unpretentious. When the time is right, it can become 'us'." An audit of `lang.ec.en.php` found
  only one other shipped first-person-plural string, `ip_q_ratio`'s tooltip ("different than **our**
  approximation of the standard uniformity measure"); `about_body_html` is already consistently
  singular. **`ip_q_ratio` stays as-is — decided, not deferred** (Tom, 2026-08-03): its "our" is the
  *inclusive* first person, "the user and I" working the same calculation together, which is a
  different pronoun from the institutional "we" that "contact me" avoids. Do not "fix" it.
  **(d) DONE 2026-08-08 — resynced in all 26 languages.** Run as two batches: 15 languages, then a
  session limit, then the remaining 11 (am bn fa he km my ps ro sr sw ur). One key, 26 agents,
  Sonnet throughout.
  - **The defect was worse than staleness.** Nearly every file said *send **us*** — `Envíenos`,
    `Envoyez-nous`, `Pošlete nám`, `Inviateci`, `senden Sie uns`, `Пошаљите нам`, `tutumie`,
    `ይላኩልን` — the institutional first person this task had deliberately rejected in English. A
    per-language scan for surviving first-person-plural author forms now returns **zero**.
  - **Reader-address plurality was left alone on purpose.** Several RTL and South Asian files (ar,
    he, ur, ps, fa) address the reader in the plural while making the author singular. That matches
    how those files already speak to readers; it was the *author's* number that was wrong. Do not
    "fix" the address forms later — this was checked, not missed.
  - **Pashto was not merely stale**, it was answering a question the English stopped asking two
    generations ago: the old value asked about ratings and usefulness.
  - **Verified rather than trusted, and it mattered.** In batch one, 15 files changed on disk while
    only 13 agents reported success — **`cs` and `hr` landed their edits and then reported
    failure.** Relaunching on the strength of the status line would have redone correct work. Every
    value was then checked directly: one-line diffs, `php -l`, no HTML entities or tags,
    single-quoted one-liners, validator clean, and rendered in a live page across Latin, Cyrillic,
    Hebrew, Arabic-script RTL and Khmer.
  - **The drift flag was cleared for this key only**, via the Task 229 partial re-baseline, so
    `mhp_vel_high` stays flagged. Running a full `--update` here would have silently baselined away
    the one real drift left.


## Task 229

- 0|229| **[DONE 2026-08-08] The drift tripwire can now tell "no translator needed" from "nothing
  changed" — `detect_english_drift.php --update=<key>`.** Fallout from Task 227, and caught the same
  day it was created: fixing the dead engineeringtoolbox URL inside `or_notes_3_def` flagged that
  key as CHANGED exactly like a rewritten sentence would. A hash cannot see *why* a string moved.
  Left alone, the next resync sprint would have sent 26 agents to re-translate a note whose prose
  never changed.
  - **The wrong fix would have been to just re-baseline it.** A URL-only edit still has to reach all
    27 files — the `href` lives inside each language's own string, which is why the fix was a `sed`
    across `lang.ec.*.php` and not a one-line English edit. So the tool refuses to silence a key
    until **every language file already carries the same URLs as English**, naming the stragglers
    when it won't. "No translator needed" and "nothing left to do" are different claims; only the
    first one is being made.
  - **It refuses three ways**, each verified: a key that is not currently CHANGED (a typo, or a
    command already run), a key that does not exist in English, and a key where any language is
    still on the old link. Mutation-tested by reverting `km` and `ur` to the old URL — refused,
    named both, exit 2; restored — accepted.
  - **The reason travels with the manifest.** A `partial_updates` record (date, keys, reason) is
    written into `english_string_hashes.json` and survives a later full `--update`, because a key
    sitting un-flagged with no explanation is indistinguishable from a bug in the tripwire six
    months on. Omitting `--reason` still works but says so.
  - **One defect found in this feature's own first run and fixed:** a partial re-baseline was
    stamping today's date onto the manifest's `updated` field, so the report announced "last synced:
    2026-08-08" over 500 keys nobody had looked at. The last-FULL-sync date is now carried through.
  - **Result:** `or_notes_3_def` re-baselined with its reason on the record; the tripwire now flags
    exactly two keys, both genuine — `template_feedback` (Task 205(d), two generations behind in all
    26 languages and still using the institutional "us" the English deliberately dropped) and
    `mhp_vel_high` (English gained "and may not be realistic"; the translations are the older,
    shorter wording). Neither was silenced. `template_feedback` was then actually resynced later the
    same day and re-baselined through this same partial path, leaving `mhp_vel_high` as the single
    outstanding drift.


## Task 215

- 0|215| **[DONE 2026-08-08] The Title/Subtitle milestone is logged — the closest instrument this
  suite can build to its own mission.** Asked for by Tom, 2026-08-05: *"How many people are adding
  Title and Subtitle? This is a major milestone that indicates they are sharing the calculation in a
  report or message."* Nothing saw it before. A page view says someone looked, a calc event says
  they got an answer; a typed title says they mean to put the result in front of another human,
  which is the one behavior this suite exists to produce.
  - **Its own one-shot beacon, not a flag on the calc event** — the design correction that was
    already recorded here, and it held up: `maybeLogCalcUsage()` dedupes per page load and a title
    is nearly always typed *after* the first calculation, so a flag there would have read zero
    almost every time. `EngCalcs.maybeLogTitleEvent()` → `log-title-event.php` → `TITLE_LOG`
    (`log/engcalcs-title.log`), honouring `ecLoggingOptedOut()` (Task 210) like every other writer.
  - **Both fields, recorded separately.** A title labels a scratch calculation; a subtitle as well
    means someone is building a document. The fifth log column is a closed vocabulary
    (`title`/`subtitle`) — anything else is a 400 rather than a quietly widened log.
  - **The typed text is never sent and never stored.** What the calculation is *called* is the
    user's business; that they named one is ours. The harness asserts this as a standing property,
    because a regression here is a privacy defect rather than a metrics one.
  - **Bound in JS on the `change` event, not in the inputs' `onchange` attributes.** Two
    consequences that are the whole reason for the choice: a value restored programmatically from a
    cookie or a shared URL fires nothing at all (restoring a saved title is not a person deciding to
    name something, and `input` would have counted every returning visitor), and it works on any
    page carrying those ids, including the JS-built ones.
  - **No 10s dwell gate**, unlike the other two beacons. Those gate on time because a bot can trip a
    page load or a calculation; typing into a text field is already the human proof that timer is a
    proxy for.
  - **Verified without a browser pass**, per the standing preference: `dev/lpn-spike/
    title-beacon-harness.js` drives the real `js/Calculators.lib.js` against a DOM stub over **both**
    transports (`fetch` and the `sendBeacon` fallback — a beacon that works on only one silently
    under-reports on the other). Mutation-tested three ways: removing the empty-value guard,
    removing the dedupe, and leaking the typed text each make it fail. Endpoint tested directly for
    dedupe, the 400s, and the opt-out; the report section against populated and empty fixtures.
    - **One trap worth keeping for the next harness:** Node 21+ ships a **read-only** built-in
      `navigator`, so `global.navigator = {...}` is silently ignored and every beacon vanishes into
      a stub that was never installed — which reads exactly like the feature being broken.
      `Object.defineProperty` is required. Cost an hour before the harness was believable.
  - **Reported by `log/lang-log-stats.sh`**: titles, subtitles, a named-per-confirmed-calculation
    ratio by page (both counts deduped per session+page, so they are the same kind of number), and
    breakdowns by page and language — carrying the same under-40-is-noise caution as the rest of the
    report.


## Task 227

- 0|227| **[DONE 2026-08-08] `prod_smoke.php --links` now follows the links our pages emit, not just
  that the pages answer.** Written the same day as Task 226, whose six-week 404 nothing in the repo
  could have noticed: this script proved every *page* returned 200 while saying nothing about
  whether the links *on* those pages went anywhere.
  - **Two sources, because pages alone are not enough.** It resolves every `href` from a sample of
    served pages, AND statically from all 27 `lib/lang.ec.*.php` files. Only one language renders
    per request, so a link broken in exactly one language file is invisible to any amount of page
    fetching; reading them off disk covers all 27 at once. 201 distinct on-site links from five
    pages plus the lang files. A failure names its source (`lang.ec.en.php:zz_key`, or the page).
  - **Off-site links are advisory and never touch the exit code.** A reference site rate-limiting a
    script is not our deploy being broken, and a gate that fails for reasons outside the repo is a
    gate everyone learns to ignore. `--external` opts into checking them.
  - **It refuses to run against a host that answers 200 for everything.** `php -S` falls back to the
    docroot's `index.php` for any missing path, so a link check against the built-in server returns
    a cheerful all-clear no matter how broken the links are — worse than not running, because it is
    a green light that means nothing. Found the honest way: the mutation test for this feature
    passed against localhost with the Task 226 404 reintroduced and sitting right there in the page.
    It now probes a URL that cannot exist first, and skips with an explanation if that answers 200.
    **Run `--links` against production.**
  - **Verified by mutation, not by inspection:** a dead link injected into `lang.ec.en.php` produced
    `FAIL … 404`, named `lang.ec.en.php:zz_mutation_test`, and exited 1; removing it returned the
    run to all-clear. The resolver has its own case table — `../`, `./`, root-relative,
    scheme-relative, `?query`-only, ports, climbing past the root, and the `mailto:`/`javascript:`/
    `#fragment` forms it must ignore.
  - **It found two real defects on its first production run, which is the argument for it:**
    - **Nine links per page were downgrading to `http://`.** `echoMainMenu()` built every
      root-relative menu item as `'http://' . $_SERVER['SERVER_NAME'] . $path`. Wrong three ways:
      an https visitor got nine 301 round trips and a moment of plaintext on a site with no HSTS;
      the host came from a client-supplied header, the very thing `config.inc.php` refuses to do for
      `CANONICAL_ORIGIN`; and it emitted an undefined-index warning wherever `SERVER_NAME` is absent
      (CLI). The paths were already root-relative — they are now emitted as-is. Fixed.
    - **A dead reference link on the Orifice calculator, in all 27 languages.** `or_notes_3_def`
      pointed at `engineeringtoolbox.com/orifice-nozzle-**venture**-d_590.html`; the real page is
      `**venturi**`. A one-letter typo, 404 for as long as it has existed, in every language at
      once. Fixed in all 27 files (one line each, `lang_syntax_validate.php` clean).
  - **What it still does not do**, recorded so nobody assumes otherwise: it checks a sample of five
    pages, not all 24; it does not render JS, so links built at runtime by `js/looped-network.js`
    are outside it; and the page-emitted path is exercised against production, which serves its own
    deployed code rather than the working tree, so only the lang-file path can be mutation-tested
    locally end to end.


## Task 226

- 0|226| **[DONE 2026-08-08] The Feedback invitation on every calculator page had been a 404 for six
  weeks.** Found by Tom on the live site the day after Task 206 shipped: the in-page invitation
  linked to `../contact.php`, which from `/engcalcs/` resolves to `hawsedc.com/contact.php` —
  confirmed 404 in production, while the menu's Contact item (200) worked fine.
  - **Cause, and it is the ordinary one:** commit `b625286` (2026-06-26) moved the contact system
    from the parent site *into* `engcalcs/` and repointed both links in `lib/Menus.lib.php` — but
    not the third referrer, `echoFeedback()` in `lib/Calculators.lib.php`. Before that day
    `../contact.php` was correct, because the parent site really did have one. The destination
    moved; two of its three referrers came along.
  - **Fixed** to `/engcalcs/contact.php` — root-relative, the same form `Menus.lib.php:44` already
    used. `../` is the wrong shape even when it happens to work: the file is included by pages that
    could sit at any depth, and the site answers on all four of http/https × www/non-www with no
    redirect.
  - **Bounds on the damage, stated honestly.** This broke 2026-06-26 and was fixed 2026-08-08 — six
    weeks, on the suite's most prominent invitation. Tom's drought predates it ("none at all in
    recent months"), so this is a real cause of the most recent stretch and **not** an explanation
    of the whole silence. Resist reading it as case closed.
  - **It nearly poisoned Task 206's first reading.** The funnel instrument shipped 2026-08-07 with
    the link still broken: clicks would have logged normally, sends would have sat at zero, and the
    honest-looking conclusion — "the invitation works, the form is the barrier" — would have been
    exactly wrong. **Any funnel number that includes 2026-08-07 is contaminated; the clean baseline
    starts 2026-08-08.**
  - **The lesson worth keeping:** a link's failure mode here is silent on both ends. The visitor
    sees a 404 and does not write to report that they could not write, and the site owner sees
    nothing at all. `dev/scripts/prod_smoke.php` checks that every *page* answers 200 but has never
    followed the links those pages *emit* — which is why six weeks passed. A one-command live link
    check of every emitted `href` is Task 227 — written and shipped the same day, and it found two
    more defects on its first production run.


## Task 206

- 0|206| **[DONE 2026-08-07] Measured the contact funnel — the one metric the mission cares about,
  and we were blind on it.** Raised by Tom, 2026-08-03: contacts "have always been rare and
  gratifying. None at all in recent months." Nothing logged `contact.php` views or `formmail.php`
  submissions, so the two possible causes were indistinguishable, and they call for **opposite**
  fixes: nobody clicks the invitation (wording/placement is the lever) versus people click but do
  not send (the form is the barrier, and further tinkering with placement is wasted motion). Two
  numbers now answer it. What shipped:
  - **The view half was 90% built and silently doing nothing, exactly as the build plan predicted.**
    `maybeLogHumanView()` fires on every page that loads `js/Calculators.lib.js`, `contact.php`
    included — but it posts `EngCalcs.cookieName`, which only `echoCookieScript()` assigns, and a
    page with no calculator form never calls it. So it posted an empty page name and
    `log-human-view.php` answered 400. Verified both ways against a live server before and after:
    `page=contact` → 204 and a log row, `page=` → 400. New `echoPageNameScript()`
    (`lib/Calculators.lib.php`) emits the page name and `sessionAgeMs`; `contact.php` calls it after
    `echoHeader()`. No new endpoint, no new log, no beacon changes.
    - It also emits `sessionAgeMs` for a reason worth keeping: without it the beacon assumes a
      brand-new session and waits the full 10s, so a visitor arriving from a calculator page — the
      arrival path that matters most for this funnel — would have had to dwell another 10s to count.
  - **The send half is logged SERVER-SIDE** in `formmail.php`'s `mail()` success branch
    (`ecLogContactSend()` → `CONTACT_SEND_LOG`, `log/engcalcs-contact-send.log`). **Rejected
    alternative, recorded so it is not re-litigated:** a beacon fired from the submit handler races
    the navigation AND cannot know whether the send succeeded — it would count attempts, and
    attempts are exactly what we already could not tell apart from successes. `formmail.php` knows
    the truth and is already on the page.
  - **Honours the Task 210 opt-out**, like the other three writers, and more cheaply than a beacon
    could since `ecLoggingOptedOut()` is right there. **Same four-column line format** as the other
    logs, with page fixed at `contact` so send rows divide cleanly by the view rows — verified by
    exercising the real function against the real config: opted-out wrote nothing, a junk
    `ec_language` cookie was sanitized with no tab or newline injection.
  - **Only two questions asked.** No referrer, no message length, no subject. Those would be the
    third question that turns a two-number instrument into a project nobody finishes, and none of
    them answer "is the form the barrier?".
  - **Reported by `log/lang-log-stats.sh`** in a new "Contact funnel" section: clicks, sends, and
    sent-per-click, with the percentage suppressed when there are no clicks. It prints on the
    no-usage-log path too, and the new log gets a coverage-footer row. Verified against fixtures for
    the populated, no-sends, and no-view-log cases.
    - The section says in place that the ratio is only readable once **both** counts leave single
      digits — with a handful of contacts a year, one message either way moves it enormously.
  - **The baseline starts 2026-08-08, not 2026-08-07 — see Task 226.** The day after this shipped,
    Tom found that the in-page Feedback invitation had been linking to a 404 since 2026-06-26. Had
    that gone unnoticed, this instrument's first reading would have shown clicks with zero sends and
    pointed confidently at the wrong culprit ("the form is the barrier"). Discard any funnel figure
    covering 2026-08-07. It is also a fair verdict on the instrument: it took one day to turn a
    six-week silent failure into a visible question.
  - **Why it was urgent:** two confounders had just landed and were otherwise going to be
    uninterpretable — Tom removed the form's anti-spam test (a classic conversion killer, especially
    on mobile and for non-English users), and Task 205 changed the invitation's wording, placement
    and dismiss affordance suite-wide on 2026-08-03. Both are now measurable going forward, though
    neither can be credited retroactively: the instrument starts at zero on 2026-08-07.
  - Context, fixed along the way on 2026-08-03: `formmail.php:90` carried a bare `<?` short open tag
    — the only one in the repo. It parses only where `short_open_tag=On`, which production evidently
    still is, but any PHP upgrade or host move would have silently killed the contact form, and with
    zero logging the symptom would have been indistinguishable from ordinary silence. That near-miss
    is itself the argument for this task: a broken contact path is invisible precisely because its
    failure mode looks exactly like nobody writing.


## Task 223

- 0|223| **[DONE 2026-08-06] Fixed the defects from the 2026-08-05 and 2026-08-06 `lpn_` browser passes.** Triaged list with root
  causes: `dev/lpn-file-lock-test-punchlist.md` § Findings.
  - **P0 already fixed, awaiting browser retest:** Save as… would overwrite a file another profile
    had open. The guard only ran when *your own* tab was read-only and compared against your own
    previous handle instead of the file chosen in the picker; identity is the `docId` inside the
    target file, never its name.
  - **P1 FIXED 2026-08-05, all three, awaiting browser retest.** The intermittent lock was not the
    TTL sweep: `visibilitychange -> hidden` fires on an ordinary **tab switch**, and released every
    lock one-way with nothing taking them back — so a colleague who glanced at their email came back
    holding nothing, silently. Locks are now remembered on `hidden` and re-acquired on `visible`.
    The needs-reopen banner could never appear because `syncReadOnlyToOpenProject()` ran from
    `openProject()`/`newProject()` but not from boot — a page load being the only case it exists
    for. Read-only now allows every edit and enforces itself in exactly two places:
    `writeOpenProjectToFile()` refuses, and Save is disabled (it does **not** become Save as).
  - **Also fixed 2026-08-05, reported separately by Tom:** new projects reused a taken number once
    the first was saved (saving renames a project after its file, and `safeFileName()` collapses the
    space, so the exact-template scan stopped recognising it); and the dialog claimed
    `aria-modal="true"` with no backdrop, so tabs and the map stayed clickable underneath a question
    about the project you could switch away from.
  - **The lock design was reworked, not patched** (Tom: *"If minimizing loses the lock, then the lock
    is useless"*). A claim now survives minimise, reload and reboot, and ends only at Close. What
    makes that safe is a **write-time freshness check** — `writeOpenProjectToFile()` compares the
    bytes on disk with what it last saw and refuses if they moved — so a stale claim can no longer
    cause an overwrite, and the file is protected even with the broker down. The lock is a courtesy;
    the freshness check is the guarantee. "Break their lock" is therefore safe to offer where "Take
    over" never was.
  - **P2/P3 fixed 2026-08-05 from Tom's second pass (he stopped at punch-list line 193):** the same
    file opening as two live tabs (identity is the `docId`, so re-opening now switches to the tab
    that has it and adopts the fresh handle — a second route back from a lost connection); and
    `Save all`, which was not missing but *hidden* below two dirty file projects, so a command that
    existed was one nobody could find. It greys out now, like Save and Revert.
  - **The freshness check had a hole exactly where it was most needed, and it was ours.** Tom:
    *"Still doesn't work with broker blocked. Save is apparently allowed as normal."* The stamp lived
    only in memory, so a reload dropped it — and Task 212 then re-read the file on the way back in,
    **adopting a colleague's newer version as our own baseline**. A reloaded A would have written
    over B's saved work with nothing said, on the one path that is supposed to hold when the broker
    is down. The stamp now lives in the project index and boot keeps the old one rather than taking
    a new one. **Lesson worth more than the fix: restoring a connection is not the same as restoring
    what that connection KNEW** — Task 212 brought back the handle and silently reset the guarantee
    built on top of it.
  - **The freshness check was on one write path out of two** (2026-08-06, Tom's third report of the
    same symptom: *"Still doesn't work with broker blocked. Save is apparently allowed as normal."*).
    It lived in `writeOpenProjectToFile()` — but **read-only routes Save straight to Save as**, and
    so does a tab with no live handle, and Save as exempted any file carrying our own `docId` from
    every question, without even asking the broker. True of the file we last wrote; false of the file
    a colleague has written since. Save as now runs the same stamp comparison and asks the broker
    about our own docId too. **Two lessons: a guarantee that guards one of two paths guards neither,
    and "it is our own file" is a statement about the past.**
  - **"{name} has this file open." now carries numbers** (Tom: *"Are we going to add some numbers to
    this message?"*). The dialog asks the reader to judge a claim, and that judgment is entirely
    about time. The broker already stored `editedAt`/`savedAt`/`lastActivity`; only the richest of
    the four sentences was ever used, and it required both an edit and a save in the holder's current
    session — so the ordinary case fell through to the bare sentence. Four cases now: unsaved work,
    all saved, edited-but-never-saved, and only-opened.
  - **Revert was in the menu and in neither banner**, which is where somebody locked out is looking.
    Both banners carry it now.
  - **Save all's tab-switching flicker is deliberately NOT fixed** — the write path writes the *open*
    project and every warning it raises is a banner about the tab in front of you; making it silent
    means teaching that function to report about a project the user cannot see. Cosmetic cost, P0
    surface. Recorded so it is not re-litigated as an oversight.
  - **From Tom's §H pass, 2026-08-06 — the first pass run against a list this short.** H1 (the
    native picker handshake, the riskiest single guess in the build) **passes**; H2 and H5 pass; H3
    passes once you know Chrome's row says Block, not Remove. Two real defects, both fixed:
    - **§10 a moved file was reported as saved** — *"It neither complains nor creates a new file. It
      silently fails to save."* Everything through `writable.close()` can resolve without a byte
      landing. **A write is not a save until you can read it back**: the file is now re-read after
      every write and its size compared with what was written. This is the worst class of bug this
      feature can have — not refusing to save, but *believing* it had.
    - **§11 the fallback asterisk never went out.** In a browser that cannot connect to a file the
      downloaded copy IS the saved state; it now records a baseline and the star clears until the
      next change, staying faint because the page still cannot write back to it.
    - Not defects: the tab-strip scrollbar (*"there all along"* — struck from the findings), and
      Save all's flicker (wants an explanation, carried to Task 209).
  - **Closed with every P0/P1/P2 fixed and verified**, most of them by
    `dev/browser-pass/run.js` (138 checks) and the rest by Tom on real disk. The small survivors are
    Task 225, extracted rather than left inside a closed block.
  - **The one that cost the most, and the one worth remembering:** four rounds on a single box —
    a save reporting success while the file was gone — because each fix was correct and none of them
    was asking the disk. Read-back, then a baseline, then a flat no-create rule, and finally the real
    answer: `getFile()` answers from metadata the browser already holds. **An API that answers
    without touching the thing it describes is not evidence about that thing.**


## Task 220

- 0|220| **[DONE 2026-08-06] Browser-verified `lpn_` project files and locking against the POST-211 UI.**
  Punch list: `dev/lpn-file-lock-test-punchlist.md` — **§0–§8 rewritten 2026-08-05 against tabs, the
  File menu, no autosave, opt-in read-only, no Delete and no AUTOMATIC take-over** (corrected
  2026-08-09: deliberate take-over via *Break their lock* is a supported action and always was —
  what Task 211 deleted was the silent promotion poll; see the note at the top of the punch list).** 78 checks, all open; the
  old §1–§6 "done" marks were against controls that no longer exist, so they were reset. Tom's
  annotations from that pass are preserved in an appendix as the record of why Task 211 happened.
  - **§11 (Firefox/Safari) is largely coverable from Chrome** on a plain `http://` LAN IP — the
    fallback is the same `showSaveFilePicker === undefined` branch. What that misses is
    browser-specific rendering, which is the lower risk. (`http://localhost` will NOT trigger it;
    localhost is a secure context.)
  - **§13 still needs the rewrite §0–§8 got** — it names controls that were renamed or removed, which
    Tom caught in the pass. Do it before asking him to run the list again.
  - **Closed 2026-08-06.** Every box is `[x]` or `[auto]`: 138 automated checks over two real browser
    profiles against the real broker (Task 224), plus Tom's §H pass for the handful a machine cannot
    answer. §13's rewrite and the small leftovers moved to Task 225.
  - **It no longer gates Task 146.06 on verification** — but dropping the PREVIEW banner is Tom's
    call, not a consequence of a green test run, and the feature laundry list in
    `project_lpn_scaffold_before_translate` is the other half of that decision.


## Task 224

- 0|224| **[DONE 2026-08-06] The punch list runs itself: `dev/browser-pass/`.** Asked for by Tom
  (*"I am very tired and feeble-minded right now. Is there any way that we can proceed without my
  working through the test punch list?"*). 89 checks over two real browser profiles against the real
  `lpn-lock.php`, in about a minute, re-runnable: `node dev/browser-pass/run.js`. It began at 89 checks and closed the punch list at 138.
  - **The one lie is the picker, and it is small.** `showSaveFilePicker`/`showOpenFilePicker` are
    replaced — nothing else — with functions returning **OPFS** handles, which are real
    `FileSystemFileHandle`s: structured-cloneable (so Task 212's IndexedDB persistence is genuinely
    exercised), real `createWritable()`, real `queryPermission()`. Injected via `addInitScript`, so
    **no test-only code ships in the page**: no flag, no seam, no build step.
  - **Two contexts, not two tabs** — separate `localStorage`, separate identity, real contention. OPFS
    is per-profile, so the runner plays the network share and moves the bytes when a spec says so.
  - **It paid for itself in the first hour**, with four defects, three of which no human pass could
    have found: `pageCalculatorInitialize` missing (every FIRST-TIME visitor's page half-initialised —
    Tom's own browser has had the cookie for weeks); a listener for a button not on the page;
    **`Accept-Language: *` 500'd every page in the suite** on PHP 8; and arriving-then-reloading
    emptying the tab strip. Then three more while writing the specs: a dismissed change-banner
    silencing later refusals, and the read-only banner not naming who holds the file.
  - **Grown to 138 checks 2026-08-06** as Tom's §H answers came back: §9 (an unreachable broker, a
    broker that ANSWERS a setup fault, a full lock directory, and when a warning may be dismissed),
    §6-saveas (every Save-as guard, run twice — once with the broker unreachable, because a guard
    against destroying somebody's work that needs a server is not a guard), §11 (the fallback branch,
    reached by deleting the one property the page tests), §10's relink, and read-only surviving a tab
    switch. **The punch list is now down to a single open box** — §H4, a file moved in a real folder.
  - **A moved file was reported as saved, and it was TWO bugs** (Tom, §H4, twice). The first: a write
    can resolve without a byte landing, so the file is now read back and its size compared. The
    second, which the first fix could not have caught: **moving a file does not make the write fail
    at all** — `createWritable()` recreates it at the old path, so the save genuinely succeeds and
    the user is left editing a file they did not choose while their moved copy goes stale. Only the
    BASELINE knows better: we have read that file before, so if it cannot be read now it is gone —
    the one case where an unreadable file must not fail open. **Lesson: "the write succeeded" and
    "your work is in the file you meant" are different claims, and only the second is worth making.**
    It also retired the excuse for skipping §10 in the runner: OPFS does exactly what Chrome does
    here, so it is tested rather than deferred.
  - **`getFile()` succeeding is not proof the file is there** (Tom, fourth report of one silent save,
    with the file confirmed deleted before every attempt). It returns a File built from metadata the
    browser already holds, and on Windows it will do that for a path with nothing at it; the error
    surfaces only when something reads the BYTES. So every guard layered on over four rounds — the
    stamp, the metadata comparison, the existence check — was interrogating the browser's memory
    rather than the disk, and all of them passed. The guard now reads one byte off a slice.
    **The lesson is the general one: an API that answers without touching the thing it describes is
    not evidence about the thing.**
  - **It found one more defect on the way**: a Save whose pre-write lock re-check failed said nothing.
    The block cleared the "locking is not working" banner when the broker came back but never raised
    it when the broker went away mid-session — recovery without onset — so a Save that could not
    check the lock went through in silence at the exact moment the risk is real.
  - **What it cannot answer stays visible, never silently passed**: `--` lines with a reason. §1's
    native user-activation handshake, a `prompt`/`denied` permission, §10 on a real folder, §11, and
    anything visual. Listed in `dev/browser-pass/README.md`.
  - **`dev/scripts/prod_smoke.php` is the other half, for the server** (Tom: *"node is not a known
    command at the CPanel production server"*). Correct, and it never needs to be — the pass runs
    where the code is edited. But the `Accept-Language: *` fatal WAS on production and nothing there
    would have said so, so: 46 probes over five page shapes and nine header forms plus the broker,
    needing nothing but PHP (curl where there is curl, streams where there is not), exiting non-zero
    so it can gate a deploy. A 200 carrying a PHP warning counts as a failure — a warning above the
    broker's JSON makes the page report "the server is unreachable", and a fault disguised as a
    network problem is the worst kind to ship.


## Task 219

- 0|219| **[DONE 2026-08-05] `lpn_` added to the Related-calculators line, and its identity strings
  translated.** Order set by Tom: HW → lpn, bpn, dw, mphl, mpf; BPN → lpn (the page had no such line
  at all); IP → bpn, lpn (`mpf` removed as not very related). The blocker is cleared —
  `lpn_main_menu`/`_title`/`_desc` now exist in all 26 languages, so the links render in the
  visitor's language.
  - **Done inline by the orchestrator rather than as a 26-agent sprint** (Tom's call): the delta was
    ~3.5 strings per language, where a spawn per language is poor value. 91 strings total.
  - **All 22 non-core languages are now at delta ZERO.** es/pt/fr/tr retain only the `lpn_` body
    (204 keys), still gated by Task 146.06. Along the way: `mtc_pi_ok_tip`/`mtc_pi_tip` given
    comma decimals in id, pt, sr; `mtc_blodgett_v_bathurst` translated in de, id, ro; and
    `mtc_pi_ok_tip` (am/bn/he/hi/my), `install_desktop_heading` (de/id/it) and `ec_name_placeholder`
    (de) added to `translation_exempt_keys.json` as genuinely-correct cognates.
  - **Each language's word for "looped" is its own professional term, not a calque** — de
    *vermascht*, es *mallada*, fr *maillé*, pt *malhada*, it *magliata*, ru *кольцевая*,
    tr *halkalı*, zh *环状*. Written back to `glossary.json`'s `looped network` entry, which had
    been seeded empty since 2026-07-23.
  - Still open: this was Task 144's live test — watch HW conversion and LPN human count together.


## Task 213

- 0|213| **[DONE 2026-08-05] Hazen-Williams unified on EPANET's constants.** New
  `js/PipeHydraulics.lib.js` owns the one pair — SI coefficient 10.666829 (derived in code from
  EPANET's US 4.727) and diameter exponent 4.871 — plus `EngCalcs.hwSlope()`. `hazen-williams.js`,
  `branched-network.js` and `lpn-solver.js` all call it; `lpnConstants`' dual set and the `constants`
  solve option are gone. `dev/lpn-spike/validate.js` is 48/48: Net1/2/3 now match the real EPANET
  engine on the **shipped** constants, and two new checks assert the US-unit form and that no
  calculator has regrown its own copy. Head loss moves ≤0.12%, +0.042% on the HW page's own defaults.
  User-facing note added as `*_notes_epanet_term`/`_def` (en + es/pt/fr/tr) — **Task 221 retires it.**
  - **Checked, no work needed: `Darcy-Weisbach.php` already matches** EPANET's 3-regime Dunlop
    treatment line for line, same as `bpnDwFriction`/`lpnDwFriction`. This closes the open question
    the task recorded, rather than spawning a separate task.
  - **Still duplicated on purpose:** the Darcy-Weisbach and Manning kernels remain copied between
    `branched-network.js` and `lpn-solver.js`. They move into `PipeHydraulics.lib.js` under a
    behavior-preserving diff, not as part of this.


## Task 204

- 0|204| **[DONE 2026-08-05] Coverage declaration for the translation tooling — required before Task 203's matrix can
  be adopted.** Four scripts treat a missing key as debt: `lang_parity_check.php`,
  `generate_translation_payloads.php`, `translation_completion_matrix.php` and
  `lang_syntax_validate.php`, all reading one list via `exempt_keys.inc.php`. Under Task 203 a key
  absent from a non-core cell is **deliberate**, not debt — and there is currently no way to say so.
  - **The obvious shortcut is explicitly forbidden by our own rule.** `translation_exempt_keys.json`
    is for keys where *identical to English is permanently correct* (symbols, eponyms, cognates), and
    CLAUDE.md says: "Add a key there only when identical-to-English is permanently correct — never to
    quiet a number you don't want to fix." A deliberately-untranslated body is neither identical nor
    permanent. Using the exempt list for it would corrupt the one mechanism that makes **delta zero
    mean zero**.
  - **What is needed is a different concept:** a per-(prefix × language) *coverage* declaration —
    which prefixes are in scope for which languages — so the delta means "missing from what we intend
    to cover," and an out-of-scope cell is reported separately as **out of scope**, never as missing.
  - **Why this blocks rather than follows.** Adopt the matrix without it and the very next parity run
    reports `lpn_` alone as 154 × 25 ≈ **3,850 missing keys, permanently**. A number that large and
    that permanent teaches everyone to ignore it, which destroys the delta-zero discipline that was
    deliberately built (Task 161). The tooling must learn the new model **before** the model ships.
  - Keep the two ideas separate in the data as well as the code: *exempt* = correctly identical
    forever; *out of scope* = not translated yet, by decision, and revisitable when a cell earns it.

  **BUILT 2026-08-05.** `dev/scripts/translation_coverage.json` (the declaration) +
  `dev/scripts/coverage.inc.php` (the shared loader, mirroring `exempt_keys.inc.php` so the four
  scripts cannot drift apart) + `dev/scripts/coverage_selftest.php` (asserts the cross, the identity
  floor, and the exempt/out-of-scope separation against the REAL declaration, not a fixture — the
  failures worth catching are edits to that file).
  - **All four scripts wired.** `lang_parity_check.php` gains an `out_of_scope` bucket;
    `generate_translation_payloads.php` stops sending out-of-scope keys to agents and reports
    `out_of_scope_key_count` in payload meta; `translation_completion_matrix.php` prints `.` for a
    cell that owes nothing and excludes it from the row total; `lang_syntax_validate.php` stops
    warning `identical-to-english` on a body we have not asked for.
  - **The forbidden shortcut stayed forbidden.** Nothing was added to
    `translation_exempt_keys.json`; the selftest reports exempt keys sitting under non-core
    calculator prefixes (13 today — all genuine symbols and eponyms: `e`, `L`, `D`, `h_f`, `ID`,
    "Hazen-Williams", "laminar", "Circular") so a future attempt to park a body there is visible at
    review time rather than silent.
  - **Editing the declaration invalidates every payload.** `EC_COVERAGE_PATH` and
    `coverage.inc.php` joined the freshness check's input set, so `--check` goes STALE and exits 1
    the moment coverage changes — verified. A sprint cannot launch on a delta computed under a
    different coverage model than the one in force.
  - **`--ignore-coverage` on the parity checker and the matrix** restores the pre-204 full-parity
    view. Kept deliberately: "what would promoting this cell cost?" is a real question, it is just
    not the default one.
  - **Two implementation findings worth keeping.** (1) Scope must be consulted **only about a gap** —
    ask it about an already-translated key and the tools report finished work as "out of scope",
    which reads as a plan to abandon it and contradicts Task 203's *deletes nothing*. (2) The
    identity floor cannot be a `_menu` **suffix** rule: it silently swept in `lpn_tab_menu`
    ("Project menu") and `lpn_backdrop_menu` ("Background image…"), promoting two ordinary body
    labels to never-out-of-scope. The three legacy identity keys (`mi_menu`, `mtc_menu`, `wi_menu`)
    are listed by exact name instead.
  - Documented in CLAUDE.md (a new subsection under the sprint checklist) and in
    `dev/translation-process.md` (the background-structures list and the scripts reference).


## Task 210

- 0|210| **[DONE 2026-08-03] Stop counting Tom's own visits in the usage logs.** Asked 2026-08-03: *"is it hard to
  ignore my visits? I suppose we can pretty easily detect me in the logs if I exercise many
  calculators and languages in a human way."* Not hard, and worth doing before more hand-testing:
  he is about to exercise `lpn_` heavily on production, and Task 203's coverage matrix is being
  driven off exactly these numbers, so author traffic is now a measurement problem and not just
  untidiness.
  - **Post-hoc detection is the wrong approach** and is what the question was really asking about.
    The logs carry timestamp, page, served lang and raw Accept-Language — **no IP, no session id** —
    so "many calculators and languages in a human way" is a guess, it cannot be applied to data
    already written, and it would also delete real multilingual users, who are the ones we most want
    to see. Do not build a heuristic filter.
  - **Do the cheap, exact thing instead:** a long-lived opt-out cookie set by visiting a URL once
    (e.g. `?ec_nolog=1`), checked by all three log writers — `log-calc-event.php`,
    `log-human-view.php`, and `logLanguageSelection()` in `lib/Language.lib.php`. Per-device, which
    means setting it once per browser Tom tests in, and honest: it suppresses at write time rather
    than guessing afterwards.
  - **Built exactly that way.** `EC_NOLOG_COOKIE` + `ecLoggingOptedOut()` in `lib/config.inc.php`;
    `?ec_nolog=1` sets a ten-year cookie and takes effect on that same request, `?ec_nolog=0` clears
    it. All three writers check the one flag: `log-calc-event.php`, `log-human-view.php`, and
    `logLanguageSelection()` in `lib/Language.lib.php`. The two beacon endpoints answer **204, not an
    error**, so `EngCalcs._sendOrQueue()` never queues an opted-out event for retry — otherwise it
    would come back and be counted later.
  - Priority raised from 30 and done the same day at Tom's request, ahead of his production testing
    of Task 195 — that testing is precisely the author traffic this exists to keep out of the
    numbers Task 203's coverage matrix is being computed from.
  - Verified with a 14-check harness (each case its own process): the flag itself including junk
    cookie values, the set/clear query parameters taking effect within the request, each of the three
    writers falling silent, and both endpoints answering 204.
  - **Still open, deliberately:** the matching note in `dev/usage-data-log.md` recording the date the
    opt-out started, so later snapshots stay comparable to earlier ones. Write it at the next
    snapshot, when there is a number to attach it to.


## Task 199

- 0|199|[CC] **`lpn_` logged no real usage at all — instrumentation fix, DONE 2026-08-03.**
  Found while answering Tom's question about what usage logging could tell us. Every other
  calculator reaches `maybeLogCalcUsage()` through `calcAndSave()` ← `submitForm()`. On
  `Looped-Network.php` `submitForm()` fires **only** from the seven unit dropdowns' hardcoded
  `onchange="EngCalcs.submitForm()"` and the US/SI preset buttons — drawing a network and solving it
  goes `scheduleSolve()` → `runSolve()`, which never touches that path.
  - **So `lpn_`'s "used" column counted unit-strip changes, not networks solved.** The 2026-08-03
    report read `Looped-Network … 35 human, 2 used, 6%` against 70% for Manning-Pipe-Flow, which
    looks like catastrophic conversion and is not a conversion figure at all — it is a different
    event from the other fifteen rows. `runSolve()` now calls `maybeLogCalcUsage()`.
  - **Logged before the diagnostics, not after a successful solve**, so the event matches what the
    other pages log: interaction that triggers a recalculation, usable result or not. The existing
    10s-after-load gate and per-page-load dedupe keep the initial solve and the debounce from
    inflating it.
  - **Consequence for reading past reports: `lpn_`'s conversion is simply UNKNOWN before this date.**
    Do not treat the pre-2026-08-03 `%used` figures for this page as a baseline to improve on.


## Task 197

- 0|197|[CC] **Tooltips stuck visible — the hover+click trigger stack (suite-wide) — DONE 2026-08-03.**
  Tom: *"Tips are getting stuck visible. I saw this on mtc.n."* Second report of the same symptom;
  the 2026-07-30 fix in `js/Calculators.lib.js` covered **controls only**, so every PLAIN LABEL kept
  `'hover focus click'` — all three triggers at once — which is precisely the accumulation that
  file's own comment describes. The comment explained the bug and the code then shipped it for half
  the elements.
  - **Why `mtc_n` specifically:** its `.ec-help` sits *beside* the `<a>`, not inside it (the
    link+tip convention), so `ecTipIsControl()`'s `closest()` finds no control and it takes the
    plain-label branch. Nothing wrong with the markup — the branch was wrong.
  - **The real rule is narrower than "controls differ from labels":** a tip must never carry both a
    hover trigger and a click trigger, whatever the element is. Bootstrap will not hide while ANY
    trigger is active, so hover-then-click leaves it pinned when the pointer leaves. The fix picks
    **one opening gesture per device**: hover-capable pointers get `'hover focus'`; touch gets
    `'click'` for plain labels (their only gesture) while controls stay `'hover focus'` so a tap
    still just performs the button's action. Controls keep the explicit hide-on-click stabilizer.
  - **Accepted gap:** a hybrid device (touch screen + mouse) reports `(hover: hover)`, so a plain
    label's tip is hover-only there and a finger tap will not open it. Rare device, and a far
    smaller harm than a tooltip stranded over the page for every mouse user.
  - **Guarded by `dev/lpn-spike/suite-tips-trigger-harness.js`** (16 checks), which asserts the rule
    for all four combinations of (is a control, device can hover) rather than for the case that
    happened to be reported — that narrowness is what let this regress once already. Note the
    harness tests suite-wide code from an `lpn-spike` directory; a neutral home is wanted once there
    are more than two.


## Task 198

- 0|198|[CC] **Flow arrow moved downstream of midpoint (Task 146 child) — DONE 2026-08-03.**
  Tom: *"I think it's more intuitive for the flow arrow to be downstream of midpoint. It's currently
  upstream."* `ARROW_ALONG` 0.3 → 0.7 in `js/looped-network.js`, measured from the upstream end.
  One constant: `flow < 0` already mirrors it to `1 - ARROW_ALONG`, and `linkLabelMid()`'s
  label-collision test measures against `arrowAlongDistances()`, which derives from the same value,
  so label separation follows automatically. The arrow now leads the flow rather than trailing it,
  keeping the same distance from the midpoint label and the same redundancy with the chevron.


## Task 173

- 0|173|[CC] **`EngCalcs.initTips(root)` — tooltips built after page load are dead on touch — DONE
  (built during Task 146; closed 2026-08-03 on discovering it was still listed at priority 30).**
  `js/Calculators.lib.js` exports `EngCalcs.initTips(root)`, calls it with `document` on
  `DOMContentLoaded`, and `js/looped-network.js` calls it again after building the toolbar, each
  property popup, the Settings panel and the Labels panel — the three things the original entry
  asked for. It was implemented as the hard prerequisite it was described as, and then never closed.
  - **Closing note, and the reason this is worth a paragraph rather than a silent deletion:** the
    entry sat at priority 30 in an active list for long enough to distort every "what is next"
    reading of the roadmap. Recurring miss — closing a task means priority → 0 AND moving the block
    to `## Completed`, in the same edit.
  - The tooltip work did NOT end here. See Task 193's reset-controls block for the 2026-08-03
    stuck-tooltip fix, which is a different defect in the same function.


## Task 189

- 0|189|[CC] **Per-field decimal places on map labels (Task 146 child) — DONE 2026-07-30.** Tom:
  "along with the checkbox, a decimal places input (with scroller since it's integer and small?)
  would be nice for each numerical label." Shipped as a 0–4 number input on each numeric field's row
  in the **Labels popover, not Settings** — it is a per-field property and that panel is already the
  per-field row list, while Settings holds page-wide preferences.
  - `labelSettings.decimals.{node,link}` is a **parallel map**, not a shape change to the existing
    `node`/`link` boolean maps. Those booleans are merged key-by-key out of localStorage on every
    load; turning each one into an object would have silently reinterpreted every already-saved
    network's toggles. A field is numeric exactly when it has an entry here, so ID needs no second
    list — `decimalsFor()` reads that one map to decide whether a row gets a spinner.
  - **The decimals are fed through `displayRound()`/`plainRound()`, which is the whole point.**
    Extrema are deliberately judged on the *rounded display value* so two series links printing the
    same number can't be marked max and min by solver roundoff past the last printed decimal. Feeding
    per-field decimals into that same function keeps the invariant: verified numerically — three
    flows of 100.004 / 100.000 / 99.996 all print "100" at 0 decimals and **none** is marked, and at
    3 decimals they differ and the max/min marks appear.
  - `Math.round(x*100)/100` was open-coded in four places for the declarative/dimensionless fields
    (Length, Roughness, k) — folded into `plainRound()` so those follow per-field decimals too rather
    than staying pinned at 2.
  - Defaults are 2 everywhere, so shipping it is a visual no-op; the spinner clamps to 0–4 rather
    than alerting (a held-down spinner runs past its own max, and every out-of-range value has an
    obvious intended meaning).
  - **The up/down arrows needed a new opt-in CSS class, `.ec-spin`** (Tom asked for them, which is
    what surfaced this). `css/engcalcs.css` strips the native spinner from *every* number input in
    the suite — correct for a physical quantity, where a 1-unit step is meaningless and the arrows
    only steal width, and wrong for a small bounded integer, where clicking up/down is the natural
    gesture and the arrows themselves signal "this is not a free-form number." `.ec-spin` opts one
    field back in; `opacity:1` is part of it because Chrome/Safari otherwise hide the spinner until
    the pointer is over the input — invisible exactly when the user is looking for it. Reusable
    suite-wide, but purely opt-in, so nothing existing changes.


## Task 190

- 0|190|[CC] **Toggle for the high/low marks on map labels (Task 146 child) — DONE 2026-07-30.**
  `labelSettings.markExtrema`, a single checkbox below both field lists in the Labels popover, using
  the roadmap's recommended wording **"Mark highest and lowest values"** (per CLAUDE.md's
  Simple-English rule, the plain verb and adjectives beat "indicate" and beat "max/min").
  - **Global, not per field**, as the roadmap called: the mark answers one network-wide question per
    field, and it is the smaller build.
  - **Enforced in `decorationFor()`, not by suppressing the extrema themselves.** The `fieldExtrema()`
    results stay computed and correct while the marks are hidden, so turning them back on needs no
    recompute and nothing else reading them can go stale.
  - Lives in `labelSettings` (a view preference, deliberately outside the undo-snapshotted `doc`),
    which forced a fix to `loadFromStorage()`: its merge looped `Object.keys(labelSettings)` and
    `Object.assign`ed each group, which **boxes a bare boolean and throws the result away**. The
    groups are now named explicitly, since the object is no longer uniformly two flat sub-objects.
  - Both tasks are covered by the existing "Restore defaults" button, which resets all of
    `labelSettings`.


## Task 188

- 0|188|[CC] **`lpn_` backdrop fade, heavier pipes, popup placement, and a click-blocking bug —
  DONE 2026-07-30.** Tom, testing against a real backdrop: "my backdrop is busy and dark… I can't
  see my pipes and flow arrows. Should we just strengthen their relative widths a little? Maybe
  double? Do both? I trust your judgment."
  1. **Backdrop opacity setting** (`settings.backdropOpacity`, 0–1, beside Symbol opacity). This is
     the primary fix and the one that generalizes: fading the REFERENCE material rather than
     thickening the drawing over it is what AutoCAD's image fade and a QGIS layer's transparency are
     for, and unlike a heavier stroke it changes nothing about the network — so a drawing tuned
     against a busy aerial still reads correctly on white and in print. Implemented as
     `--lpn-backdrop-opacity` on a `.lpn-backdrop` layer class, same mechanism as symbol opacity.
  2. **Pipes went from 0.5 to 0.7 wide — "a little", not Tom's offered "maybe double".** At 0.5 a
     pipe was drawn LIGHTER than the node outlines (1.0) sitting on top of it, which is backwards
     for a pipe network, where the pipes are the primary content. 0.7 fixes that while staying under
     the node outline, so the over-wide problem that the earlier 2 → 0.5 correction fixed does not
     come back. **The flow arrow was deliberately left at 0.3**: Tom called that width "beautifully
     narrow", and what makes an arrow vanish into a dark aerial is its pure BLACK against a dark
     background, not its width — the backdrop fade fixes that without coarsening the mark.
  3. **Property popups no longer open on the click point.** On an orthogonal network — most real
     ones — a popup centred on the element covers the elements directly north and south of it,
     which are exactly the ones being compared against it. It now opens to the RIGHT of that
     element's own data label, just past where its extrema glyph would sit, plus one node diameter
     (Tom's own measure: "roughly a node size to the right of the extrema location"). It still reads
     as belonging to the element because it lines up with that element's label, and it falls back to
     the click point for an element with no rendered label. Needed a `worldToScreen()`, the inverse
     of the existing `screenToWorld()`.
  4. **Bug found while verifying (3): leader lines and extrema ticks were swallowing clicks.**
     `labelsLayer` draws above the symbol layers, so a leader or a tick mark crossing a node took
     the click meant for that node and the popup simply never opened — reproduced on the Example
     network's J1, whose popup would not open at all while R1's and J2's did. Neither element is
     clickable by design (a label's own text is the drag target; a tick decorates that text), so
     both now carry `pointer-events: none` (`.lpn-leader`, and a new `.lpn-tick` class on every tick
     element). All three nodes open correctly after the fix.


## Task 187

- 0|187|[CC] **`lpn_` link labels at the true midpoint; roughness and minor loss added to the
  Labels choices — DONE 2026-07-30.**
  1. **A link's label anchored inside one SEGMENT, not at the halfway point of the pipe** (Tom:
     "link label is placing within last segment instead of overall length. Not good."). `linkLabelMid()`
     took `segmentMidpoints()[floor(segCount / 2)]` — the midpoint of the middle segment — which on
     a bent pipe with an even segment count lands in the middle of the *second leg*. It now walks
     the polyline by arc length (`pointAlongLink()`) and takes the 50% point of the whole pipe.
  2. **...then steps clear of any flow arrow it would land on** ("but don't conflict with an
     arrow"). Arrows sit at 30% of each SEGMENT, so on some geometries the two coincide;
     `arrowAlongDistances()` reports where the actually-drawn arrows fall along the whole pipe (same
     two rules `updateArrow()` applies), and the label slides along the pipe — never off it — to the
     far side of a conflicting arrow, clamped to 12–88% so it never crowds a node.
  3. **Roughness and the minor-loss coefficient are now Labels choices** (Tom: "add all input
     properties to the Labels choices"). Both are dimensionless, so they render through `rawLine()`
     like Length; both are suppressed on pumps, like the other pipe-only inputs; both are off by
     default. Placed **with the other inputs** — after Length, before the solved results — since
     inputs-then-results is the order the list already follows and Tom left the placement open ("do
     something and we can change later"). They got real colors rather than the offered black
     (teal `#00695c`, freed up when head gain was removed, and olive `#827717`), since two more
     entries all reading black would make the legend ambiguous with ID.
     `lpn_field_km_short` ("Minor loss, k") is a new key: the popup's full
     "Minor (local) loss coefficient, km" would set the width of the whole on-map legend box, and
     CLAUDE.md's rule is that a shared label must fit its narrowest use.


## Task 182

- 0|182|[CC] **Sticky tooltips on interactive controls — suite-wide, DONE 2026-07-30.**
  Tom, testing `lpn_` against a real system: "tips are getting stuck open. Here's something
  repeatable. Labels hover, then labels click, then Close. Tip is now stuck open until you click and
  close again. It cycles. I think another button was also sticking."
  **Cause:** `EngCalcs.initTips()` (`js/Calculators.lib.js`) gave every tip
  `trigger: 'hover focus click'`. Bootstrap tracks the three triggers separately and refuses to hide
  while ANY is still active — hovering sets hover, the click then sets click as well, and moving the
  mouse away only clears hover. The tip stays pinned until a second click toggles click back off,
  which is exactly the cycle Tom described. `focus` sticks the same way, since a clicked button keeps
  focus; that is the "another button" he suspected.
  **Fix:** decide the trigger from what the element IS. A tip on an interactive control
  (`closest('button, a, input, select, textarea, [role=button]')`) gets `hover focus` plus an
  explicit `hide()` on click — Bootstrap's `hide()` clears all three active triggers at once, which
  is what breaks the cycle. A tip on a plain label keeps `click` in the list, because a tap is the
  only way a touch user can reach it at all (ROADMAP Task 173's whole point). On touch, tapping a
  button performs its action, which IS the answer; a tip left hanging over the panel it just opened
  is noise.
  **Checked the one case that could have regressed:** the two link+tip strings
  (`mpf_friction_slope`, `mtc_bend_angle`) put `.ec-help` as a SIBLING after `</a>`, per CLAUDE.md's
  link+tip convention — so `closest('a')` misses them and they keep the click trigger. Verified in a
  browser: label tips still open on tap, and the Labels-button cycle now leaves zero tooltips open
  on two consecutive repetitions.


## Task 183

- 0|183|[CC] **`lpn_` map geometry: scaling gaps, arrow placement/width, symbol opacity —
  DONE 2026-07-30.** Everything Tom found once he started laying a real system over a backdrop.
  1. **Extrema badges were not scaling.** `TICK_STROKE`/`TICK_LENGTH`/`CARET_LEG_*` were fixed world
     sizes while the rise/drop constants beside them were already × font size, so a badge that
     decorates a number stopped reading as part of it at any non-default text size. All of them now
     go through a new `textFactor()` (= `effectiveFontSize() / 2.5`, so 1 at the default). Verified:
     text 2.5 → 5 doubles the rail length (1.6 → 3.2), stroke (0.3 → 0.6) and chevron (0.5 → 1.0).
  2. **The leader threshold was not scaling either**, so at large text a label had to travel much
     further (relatively) before earning a leader. `leaderThreshold()` scales the 4-unit constant by
     `max(textFactor, symbolFactor)`. The DEFAULT label offset (+2, −2) now scales with
     `symbolFactor()` too — at 2× symbols a fixed offset started the label inside its own node. A
     label the user has DRAGGED keeps the exact offset they dropped it at.
  3. **Flow arrows were too wide** — "it seemed beautifully narrow before." Double-scaled: the
     chevron's SHAPE is scaled by an SVG `scale()` transform, and an SVG transform scales the stroke
     with the geometry, so also multiplying `stroke-width` by `--lpn-sym` in CSS squared the factor.
     `.lpn-arrow` is now the one stroke width in that file that does NOT read `--lpn-sym`.
  4. **Flow arrows collided with pipe labels** — both sat at the segment midpoint. The arrow moved
     to `ARROW_ALONG` = 0.3 **measured from the upstream end** (0.3 at positive flow, 0.7 at
     negative), so its position redundantly encodes flow direction as well.
  5. **Arrows on a segment too short to hold one are hidden** (`len < 2 × chevron length`) — a
     chevron longer than its own run overhangs both vertices and reads as a mark on the network
     rather than on that pipe. Verified on the Example: 5 arrows shown at symbol size 1, 4 at 4,
     0 at 8.
  6. **Symbol opacity setting** (`settings.symbolOpacity`, "Symbol opacity (0 to 1)"), for laying a
     network out over a backdrop aerial or plan. Applied as `opacity` on the two whole symbol
     layers (now classed `.lpn-symbols`) via a `--lpn-opacity` custom property, so nodes, pipes,
     arrows and vertex handles fade together as ONE drawing instead of each fading independently
     and showing where they overlap. **Labels, masks and leaders are deliberately untouched** — the
     point is to see the backdrop through the network while placing it, and fading the numbers at
     the same time would defeat the reason you are looking at both together.


## Task 180

- 0|180|[CC] **Tom's third review round on `lpn_`: live collision recalc, 3-point Example pump,
  symbol size, legend headings — DONE 2026-07-30.**
  1. **Collision avoidance now runs during a drag** (Tom: "collisions aren't recalculated after
     drag; leaders stay unchanged"). `refreshLabelText()`'s layout half is split out as
     `relayoutLabels()` — collision pass, then every label's text/mask/leader/ticks — and
     `applyDrag()` calls it for node, vertex, Text-label and data-label drags. The numbers don't
     change while dragging, so the tspans are not rebuilt; only the layout is redone.
     **This required making the collision pass idempotent:** it used to keep an auto label's
     previous nudge and push further from there, so a label stayed pushed long after whatever it
     hit had moved away, and re-running it per frame would have accumulated drift. Every nudge is
     now cleared and re-derived from scratch on each pass. Verified: dragging J1's label on the
     Example produces three leaders (the dragged one plus two labels it pushed), where before the
     drag there were none.
  2. **The Example network's pump curve is three points, not one** (Tom: "1-point is not very
     readable, and not good for our Example even if it's legal"): (0 gpm, 90 ft), (150, 65),
     (300, 20) — a shutoff head, a duty point, and a run-out point, the way a manufacturer
     publishes one. One point stays legal, because it is EPANET's own rule and matching EPANET is
     the point of `lpnPumpFromCurve` — but it DERIVES shutoff head and maximum flow from the single
     number you type, which is the same "numbers the user never entered" problem Task 179 removed
     from new pumps. **The Example's reservoir also moved down to 55 ft**, in among the junctions
     it feeds (50 ft and 40 ft) instead of 50 ft above them: perched high, the example was a
     gravity system that would work with the pump deleted, so the pump's contribution was invisible.
     It now delivers 76.3 ft at the 100 gpm duty flow and is the only reason there is pressure
     anywhere (J1 35.3 psi, J2 39.4 psi).
  3. **Pump curve documented in the Notes, not in the popup** — a new `lpn_notes_5` ("Pump curve")
     giving H = H₀ − aQ^b and what one, two and three points each mean, with a one-line pointer
     under the curve table in the popup (`lpn_pump_curve_note`). The popup floats over the map and
     has to stay readable on a phone; the Notes list is already this page's documentation home,
     prints with the page, and is translated with everything else.
  4. **Symbol size setting**, as the two-dimensional control Tom asked for rather than a full
     per-element breakdown: `settings.symbolScale`, labelled "Symbol size (relative to text)", sits
     under the existing Text size block. Symbols are sized as a MULTIPLE OF THE TEXT
     (`symbolFactor() = effectiveFontSize() / 2.5 × symbolScale`), so they inherit the text's
     map-vs-screen units for free and there is no second units selector. Node/vertex radii and the
     flow-arrow chevron are geometry, scaled in JS; the six stroke widths are styles, and now read a
     `--lpn-sym` custom property that `refreshSymbolSizes()` writes on the SVG
     (`stroke-width: calc(0.5 * var(--lpn-sym, 1))` etc. in `css/engcalcs.css`). A default of 1
     reproduces exactly what shipped before. Per-element control (separate pipe width, node size,
     pump size, reservoir size) is deliberately **not** built — see Task 181.
  5. **The on-map labels legend gained Node labels / Link labels headings**, reusing the two keys
     the Labels popover already has, emitted only when that group has a visible field. And the
     Select-mode hint now reads "Click an element **or label** to view or edit it".


## Task 146.03

- 0|146.03|[CC] **Text label custom size multiplier — DONE 2026-07-29.** Per-label `sizeMult`
  (default 1) stacks on top of the shared `settings.textSize`/`settings.textSizeUnits` via
  `effectiveFontSize(mult)` in `js/looped-network.js`; only a Text label carries one — node/link
  labels are unaffected. Editable via a new "Size ×" number field in the Text popup
  (`renderLabelFields()`), persisted with the label (no storage-version bump needed — old saved
  labels fall back to `sizeMult || 1`). Rich text formatting (bold, font family) remains explicitly
  undesigned per the scope doc.


## Task 176

- 0|176|[CC] **Pump curve entry, head-gain/head-loss reporting fix, demand/flow color unification —
  DONE 2026-07-30.** Three related fixes to `js/looped-network.js`, found and built in one session:
  1. **Pump curve entry**, built exactly to the scope doc's sketch (see
     `dev/looped-network-calculator-scope.md`'s "Pump curve entry" entry, now marked done): the pump
     popup's `<select>` offers "Enter points below" (1-3 `[Q,H]` rows feeding the ALREADY-WRITTEN
     `EngCalcs.lpnPumpFromCurve()` in `js/lpn-solver.js` — that solver-side fit was done in an
     earlier pass and had simply never been wired to a UI) or any other pump's id, copying that
     pump's curve instead (`l.curveRef`, resolved one hop only by `resolveCurvePoints()`, so a
     reference cycle can't form). `renameLink()` now rewrites every `curveRef` that pointed at a
     renamed pump's old id, so a rename can't silently orphan a reference.
  2. **A pump's head GAIN was reading as a "Head loss" of ~70+ ft.** Found while testing the popup:
     the map-label rendering reused the `headloss` field/color/extrema bucket for a pump's
     `-headloss` (i.e. its gain), so a 77 ft pump boost sat in the same legend swatch and the same
     min/max scale as a pipe's fractional friction loss — indistinguishable from an enormous, wrong
     loss at a glance, even though the property popup already correctly labeled it "Head gain"
     (readonly field, separate string, already right). Split into a genuinely separate `headgain`
     field: own color (`#00695c`, distinct from `headloss`'s `#4527a0`), own `linkFieldDefs()`
     entry/checkbox/legend row, own extrema bucket computed from pump links only (`headloss`'s
     extrema now excludes pump links symmetrically). `lpn_result_headgain` already existed as a lang
     key from the popup; no new translation needed for this fix, only new plumbing.
     **REVERSED 2026-07-30 by Task 179** — Tom: "I don't think we need a separate Head Gain.
     Negative head loss is fine." There is no `headgain` field, color, checkbox, or extrema bucket
     any more, and `lpn_result_headgain` is deleted.
  3. **Node Demand and Link Flow now share one color** (`#1565c0`, was `#6a1b9a` for Demand) —
     both are the same physical quantity, Q, so the Labels-panel legend should read them as one
     concept rather than two unrelated numbers that happen to both be flow rates.
  Also (same session): `.lpn-vhandle` (a pipe's editable vertex) is now filled the pipe's own color
  (`#557`) instead of a hollow white circle with the PUMP's stroke color, which had no relation to
  the link it belonged to; the Select-mode status hint gained "Double-click a pipe to add or remove
  a vertex."; the gear/settings panel gained a "Restore defaults" button (settings/labelSettings
  only) and a temporary "Wipe memory" button + `?lpn_wipe=1` URL param (full localStorage reset, for
  verifying the true first-visit state during preview — Tom: "I want a way to know that I am
  loading the first-time calculator"); default visible labels changed to ID/Demand/Pressure/
  Elevation (node) and ID/Flow/Velocity (link), Tom's own choice after using the Labels panel for
  the first time. See Task 177 (open) for the follow-on question this surfaced: should `lpn_` also
  report a per-length head-loss GRADIENT alongside the total, matching conventional network-software
  reporting.


## Task 163

- 0|163|[CC] **Language strings standardized on single quotes; the validator's blind spot closed —
  DONE 2026-07-28.** Was: "`lang_syntax_validate.php` cannot see double-quoted lang assignments"
  (priority 8, found incidentally while closing Task 161). `extractValues()` matched only
  `$ec_lang['key']='...';`, so every double-quoted assignment was invisible to **every** check built
  on it, including Rule A (`entity-in-lang-string`) and Rule B (`tag-in-plain-text-string`) — the two
  rules CLAUDE.md calls absolute and tool-enforced.

  **The original entry's central claim was wrong, and the correction is the most useful thing here.**
  It said "the gap is currently benign … all 43 double-quoted keys in `lang.ec.en.php` are `u_` unit
  tokens … nothing is hiding there today," and rated the risk as purely future. In fact **660
  double-quoted assignments existed across the 27 files**, and eight were real translated content:
  `mpf_main_title`, `mpf_main_desc`, `mpf_pipe_diameter`, `mpf_solver_no_solution` and
  `contactSendMessage` in `lang.ec.tr.php`, `contact_title` in `lang.ec.bg.php`, and
  `contactSpamPostfix` in bg and fr. The future risk had already happened; the estimate was low
  because it was taken from the English file alone and generalized to all 27. **Lesson: when sizing a
  defect that spans the language files, count in all 27 — English is the least representative one,
  because it is the file that gets edited most carefully.**

  **A second, worse defect surfaced only because the fix was verified rather than assumed.** Two
  Spanish values were double-quoted *for interpolation*: `$ec_lang['u_gradePercent']="% $ec_lang[u_grade]"`
  and `$ec_lang['u_in2']="$ec_lang[u_in]^2"`. Those strings silently depended on another key being
  assigned earlier **in the same file** — and `lang_key_order_normalizer.php` exists specifically to
  reorder these files, which would have blanked both with nothing visible in the diff of the changed
  line. Spanish is the suite's second-largest audience (10% of human reach). Both are now literals.
  The naive conversion to single quotes broke them exactly as it should have; a `var_export` diff of
  every value PHP produces, before vs after, is what caught it. **Never land a mechanical rewrite of
  the language files without that diff** — `php -l` passes happily on a string whose meaning changed.

  **Shipped:**
  1. `dev/scripts/lang_parse.inc.php` — one parser for all four tools. Exposes two deliberate views:
     `ecLangRawValues()` (escapes intact, for syntax rules that check the literal text an author
     typed) and `ecLangValues()` (escapes resolved, for comparison, where `Haws\'a` must equal
     `Haws'a`). It still reads both quote forms on purpose — a parser that only understood the
     standard could not report a violation of it.
  2. All 660 double-quoted assignments converted to single quotes; 3 apostrophes escaped `\'`.
     **Zero string values changed**, proven by diffing PHP's own evaluated output across 27 files and
     15,552 keys.
  3. **Rule D** (`double-quoted-assignment`) in `lang_syntax_validate.php`, covering `$ec_lang` and
     `$ec_lang_intent`, a hard error, verified by injecting a violation and confirming it fires
     rather than trusting a clean run.
  4. `u_depthFrac` added to `translation_exempt_keys.json` for **fr only** — the one genuinely new
     finding the closed hole exposed. French "fraction" is spelled identically; es/it/pt/ro/de all
     differ, so it is not a global exemption.
  5. Rule D documented in CLAUDE.md's Language Keys section, next to Rules A–C.

  **Verified:** `lang_syntax_validate.php` byte-identical to its pre-change baseline (60 advisory
  identical-to-english findings, no new class); `lang_parity_check.php` differs only by the intended
  `u_depthFrac` reclassification (equal_to_english 68 → 67, exempt 1520 → 1521); payloads regenerated
  to FRESH, with `payload_fr.json`'s delta 10 → 9 as the sole content change.


## Task 166

- 0|166|[CC] **The 26-language sprint ran — DONE 2026-07-28.** 26 Sonnet agents, one per language,
  covering 11 new keys common to every language (`calc_units_us`, `calc_units_si`, the eight `hw_*`
  pressure/elevation keys from Task 167, and `hw_note_1` from Task 170), the per-language stragglers
  the delta had swept up, and a semantic **resync** of the two CHANGED keys (`calc_defaults`,
  `mphl_note_1`) that the payload-delta structurally cannot see. ~406 strings.
  **Verification (the agent reports were not taken at face value, per the standing rule):**
  `lang_syntax_validate.php` clean of every non-advisory finding; `php -l` clean on all 27 files;
  tag/URL parity checked programmatically for `hw_note_1`, `mphl_note_1` and `hw_pressure_neg`
  against English; every one of the 10 core keys confirmed non-identical to English in all 26 files;
  and an inline back-translation read of all 26 languages' short labels.
  **Four defects the self-reports missed, found by that verification and fixed by hand:**
  1. **fa, sw and my each reported `mphl_note_1` "already in sync" — none of them were.** All three
     still carried the pre-Task-169 opening `<dt>` ("does not consider pipe elevation"). Caught by
     `git diff` per file: an agent that reports a resync but never edited the file is the signal.
  2. **my silently skipped `calc_defaults`** (self-reported honestly, to its credit).
  3. **ru rendered `calc_defaults` as "По умолчанию"** ("By default") — a noun label, the exact
     defect the English reform removed. Reset to "Восстановить значения по умолчанию". The agent's
     width justification did not hold: de and es ship 30–33-character imperatives on the same button.
  4. **pt "fixed" `mphl_note_1` by adding a `</dl>`**, breaking tag parity with English.
  **The `</dl>` finding was real and is now fixed at the source.** `mphl_note_1` opened `<dl>` and
  never closed it, with `Manning-Pipe-Head-Loss.php` appending `</dl>` in the page — so Hazen-Williams
  and Darcy-Weisbach, which never appended it, had been shipping an unclosed list. Both the pt agent
  and the ur agent flagged it independently. The key is now self-closing in all 27 files and the
  page's trailing `</dl>` is gone; all three pages verified to emit balanced tags.
  **Glossary write-back (mandatory, done before close):** added root concepts **`pressure`** and
  **`elevation`**, each with all 26 attested label forms and an `avoid` array guarding the
  head-vs-pressure trap. The suite had `head`, `head loss` and `pressure rating` but no entry for
  either root, so every sprint re-derived them and the trap had to be re-explained in each prompt.
  Recorded there too: the pre-existing ar tension where head loss is "فقدان الضغط" (literally
  "pressure loss") while pressure itself is "ضغط" — deliberately not touched by this sprint.
  **`calc_units_us`/`calc_units_si` moved to `translation_exempt_keys.json`** (`"*"`): all 26
  languages independently kept "US"/"SI", which is what permanent-identical looks like.
  **Residual delta is 68, all pre-existing** — per-language cognates ("Segment", "Filter", "OK",
  "turbulent") and numeric citation tips. Not exempted here: each is a per-language claim taken from
  an agent's word, and the exempt list is for things verified permanently correct, not for quieting
  a number. That is Task 161 hygiene, not this sprint's scope.
  Drift manifest re-baselined (`--update`) only after the resync actually landed, as the task warned.


## Task 170

- 0|170|[CC] **Hazen-Williams and Darcy-Weisbach got their own waterline note — DONE 2026-07-28.**
  New key `hw_note_1` (owner: HW, by the concept-level label reuse rule and by reach — 580 humans vs
  DW's 67) replaces `mphl_note_1` on both waterline pages. `Manning-Pipe-Head-Loss.php` keeps
  `mphl_note_1` unchanged, so the culvert material — inlet control, HY-8, outlet-control-only — now
  lives only on the culvert calculator.
  The new note covers what a waterline engineer actually needs, per the task spec: (1) the profile
  between the two ends is not modeled — an intermediate high point sees lower pressure than anything
  reported, and the fix is to re-run the page for the upstream-end-to-high-point length; (2)
  negative-pressure consequences (air out of solution, thin-wall collapse, groundwater drawn in at
  the joints) and air valves at high points; (3) upstream pressure is a boundary condition the user
  supplies — gauge, tank level, or a pump curve read *at the entered flow*; (4) the minor-loss K
  total is theirs to sum, small next to friction on a transmission main and dominant in station
  piping.
  **Fixed a latent HTML defect in passing:** `mphl_note_1` opens `<dl>` but never closes it —
  `Manning-Pipe-Head-Loss.php` appends `</dl>` in the page, while HW and DW never did, so both had
  been shipping an unclosed `<dl>`. `hw_note_1` closes its own list, so neither page needs a trailing
  tag.
  Seeded as English in all 26 non-English files; `lang_syntax_validate.php` clean apart from the
  expected advisory identical-to-english. Translation debt rolled into Task 166.


## Task 168

- 0|168|[CC] **Darcy-Weisbach reworked upstream-first — DONE 2026-07-28.** Applied the Task 167
  form: the single "Downstream EGL" input became Upstream elevation, Upstream pressure and Downstream
  elevation, with Downstream pressure as the headline result and the negative-pressure check. **Zero
  new language keys** — the eight `hw_*` labels were borrowed whole under the concept-level label
  reuse rule, which is exactly the case that rule exists for.
  Verified: opens at 45.19 psi residual (SI 29.49 m H₂O), the check flips to ⚠ at z_down = 250 ft
  (−11.17 psi), and **DW and HW agree to within 0.4% on head loss for the same pipe** (6.143 vs
  6.168 psi) — a useful independent cross-check, since one is Hazen-Williams C = 130 and the other is
  Darcy-Weisbach with ε = 0.0005 ft.
  **Manning Pipe Head Loss was deliberately left alone.** Storm drain and culvert design genuinely
  runs downstream-to-upstream from a known tailwater, so its current form fits its audience. Three
  pages that look identical, and the right answer for the third is the opposite of the other two.


## Task 169

- 0|169|[CC] **Reworded `mphl_note_1`'s opening claim — DONE 2026-07-28.** It said *"This calculator
  doesn't account for pipe elevation,"* which stopped being true for Hazen-Williams and
  Darcy-Weisbach once Tasks 167/168 gave them endpoint elevations. Now reads *"This calculator does
  not model the pipe profile between the two ends"* — true on all three pages, and it names the real
  limitation rather than a superseded one: the HGL can still dip below the pipe mid-run even when
  both endpoints are satisfactory. The consequence sentence that follows is unchanged.
  A shared key was reworded rather than a page-specific note added, so this costs **no new key** —
  but it is now a CHANGED key, and `detect_english_drift.php` reports it alongside `calc_defaults`
  for the pending resync. **The larger finding it exposed — that the note's remaining bulk is
  culvert material irrelevant to the two waterline pages — is Task 170.**


## Task 167

- 0|167|[CC] **Hazen-Williams reworked to solve downstream from the end the user knows — DONE
  2026-07-28.** The page took a single input labelled **"Downstream EGL"** and computed upstream
  (`egl2 = egl1 + h_L`), asking a waterline engineer for the one number they do not have. Tom:
  *"Starting at the downstream is feeling to me like it will be unwelcome to new visitors."*
  **What changed.** One input (`egl1`) became three — **Upstream elevation, Upstream pressure,
  Downstream elevation** — and the headline result is now **Downstream pressure**, the residual the
  visitor actually came for. EGL and HGL are still reported at both ends, reusing the existing
  `hw_hgl_1/2` and `mphl_egl_1/2` labels rather than minting new ones. Defaults tell a small story on
  arrival: 400 gpm through 1,000 ft of 6 in C-130 main, 60 psi at elevation 100 ft, rising 20 ft →
  **45.2 psi residual** (SI: 25 L/s, 150 mm, 300 m, 40 m H₂O at 30 m rising to 36 m → 29.5 m H₂O).
  **Separating elevation from pressure bought a real check, not just a nicer form.** A negative
  downstream pressure means the hydraulic grade line has fallen below the pipe — it would not flow
  full and the answer is invalid. The old single-EGL form could only warn about this in prose
  (`mphl_note_1`); the page now **detects** it, using the standard ✓/⚠ verdict convention. Verified:
  z_down 120 ft → 45.2 psi ✓; 200 ft → 10.5 psi ✓; 250 ft → −11.2 psi ⚠.
  **Why this was worth building without waiting for the query export** (Task 144): "the page asks for
  the wrong end" is defensible on engineering grounds alone. The export would only say whether it is
  *the* cause of HW's 11% conversion. Note this is the same defect class as the missing inverse
  solver — Manning Pipe Flow and Manning Trap are the only calculators that solve for what the user
  wants, and the two highest converters. **No solver was added here** (Tom: *"we just need to fix the
  presentation"*); the page now simply asks for what the visitor has.
  **8 new language keys**, seeded as English in all 27 files — pending translation with the Task 166
  batch. **Returning visitors are safe**: the input count went 6 → 8, and `cookieToForm`'s
  slot-count guard bails to a fresh, correctly-initialised page rather than misapplying a stale
  cookie — verified, not assumed.
  **Extracted rather than left inside this block:** Darcy-Weisbach is **Task 168**, `mphl_note_1`'s
  now-overstated warning is **Task 169**.


## Task 165

- 0|165|[CC] **Default unit preset is chosen by language — DONE 2026-07-28.** English gets US
  customary; every other language gets SI.
  **How it arose, recorded because the process matters more than the outcome:** the "default to US"
  decision was taken in a document titled *Hazen-Williams worked example*, in a section whose
  reasoning was entirely HW-specific. CC implemented it as one global constant across all 13 pages
  and reported it as settled **without flagging that it had generalised an HW-framed answer to the
  whole suite**. Tom caught it by observing behaviour — *"I don't see that mpf defaults to SI when es
  is the language; I see US"* — not by reading the diff. The lesson is narrow and worth keeping: when
  a decision is taken inside a worked example, say explicitly how far you are about to apply it.
  **Why language rather than global or per-page.** Measured per-language human reach is **en 83%,
  es 10%, then a ≤1% tail**, and the English audience is dominated by US municipal and storm-drain
  work quoted in inches, feet, cfs, gpm and psi — while essentially every other language in the suite
  is spoken where SI is the working system. A single global default had to be wrong for one of those
  two groups. Per-page was rejected because two pages in one session could then disagree.
  **Known limitation, deliberately accepted:** "English" is not "United States" — a visitor in the
  UK, Australia, India, Ireland, New Zealand, Nigeria or South Africa works in SI but reads English
  and lands on US units. Fixing it means reading the region subtag (`en-GB` vs `en-US`) from
  Accept-Language instead of the app's normalised two-letter code, and **one exception to the
  two-letter code the entire language system is built on is worse than one imperfect default**. Those
  visitors get a correct page, one click from right.
  **This was free to do because Task 164 had already made every default preset-aware** — no number on
  any page needed changing. Verified end to end: `?lang=en` opens Manning Pipe Flow at an 18 in pipe
  in in/cfs/psi, `?lang=es|fr|sw|hi` at 450 mm in mm/m³s/mH₂O, every velocity check passes in both,
  and the JS-seeded sample rows on Branched Network and Irrigation Pressure follow the language too.


## Task 164

- 0|164|[CC] **Realistic defaults on every calculator, and per-preset default declarations —
  DONE 2026-07-28.** Opened when Task 162 closed with faithful-but-ugly conversions (Manning Pipe
  Flow opening at d₀ = 39.4 in); Tom asked for a best effort across all pages the same day, so it
  closed the same day rather than waiting for his own pass.
  **Two mechanism changes were needed before any number could be chosen.** (1) A default is
  expressed in the *displayed* unit, so one number cannot serve both presets — under SI,
  Hazen-Williams' `6` reads as 6 mm. Declarations now accept
  `'default' => Array('us' => '6', 'si' => '150')`, resolved by `ecDefaultValue()`. **This decouples
  every number from the choice of default preset**, so Task 165 can be decided either way without
  reworking anything. (2) A `roughness` family split from `distance_small`, because US practice
  quotes absolute roughness ε in **feet** (0.0005 ft commercial steel), not inches — the
  split-on-different-defaults rule doing its job.
  **45 defaults across 12 pages replaced with deliberate design cases**, e.g. Manning Pipe Flow at an
  18 in concrete pipe (n 0.013) on 0.5% grade flowing half full → v = 4.2 ft/s, Q = 3.7 cfs; Manning
  Trap at a 4 ft-bottom 2:1 earthen canal → v = 2.17 ft/s, Fr 0.33; Orifice Drain Time at a 39.6-hour
  pond drawdown. **Every velocity check passes on arrival in both presets** — verified by running
  each page's real `pageCalculator` against its own rendered HTML through a stub DOM, not by
  inspection.
  **Three defects exposed by actually running the pages, all fixed:**
  1. **Orifice Drain Time has always opened on an invalid case** — its guard needs the ending water
     level above the orifice *top* (`h2 >= d/2`) and the page shipped `h2_elev = 0` with the centroid
     also at 0, so it rendered **zeros and a NaN** on arrival. **This predates Task 162** and is a
     plausible cause of its 0% used-of-human. Now opens on a real drawdown.
  2. **`rc_crest_radius` sat in `distance_small`**, rendering an 8 m crest radius as **317 inches**.
     Moved to `distance_medium`.
  3. **The JS-seeded sample rows on Branched Network and Irrigation Pressure were hard-coded metric**
     and would have been read in US units — Branched Network's sample main became a **100-inch
     pipe**. Both now carry one seed set per preset via a new `EngCalcs.defaultUnitSet`.
  **Judgment calls open to reversal:** Manning Trap side slopes 4:1 → 2:1 and n 0.03 → 0.025 (at 0.03
  the page opened on a *failing* velocity check); Manning Pipe Flow and Manning Pipe Head Loss
  n 0.01 → 0.013, matching their storm-drain audience. Full table: `dev/unit-families.md`.


## Task 162

- 0|162|[CC] **Unit presets rebuilt on named unit families — DONE 2026-07-28.** Replaces the
  three-architecture (A/B/C) framing the task carried; the built design is Tom's array-splitting
  instinct taken to its logical end, and it is neither A, B nor C as originally sketched.
  **The mechanism.** `'units' => Array('m','mm','ft','in')` became `'units' => 'distance_small'` — a
  **named family** defined once in `lib/Units.lib.php`, carrying both the option list and the
  identity a preset keys on. Presets are `family → unit` maps. **No new field key was needed**: the
  existing `units` key just takes a name instead of an array, which is why the `role` attribute
  proposed in review was dropped.
  **Why named families rather than simply splitting the arrays** (Tom's first proposal, and the
  better instinct): splitting works where the split lists are disjoint in the units a preset names —
  diameter `[mm, in]` vs length `[m, ft]`. It fails on the head family, where line pressure, EGL/HGL
  and losses all legitimately want the same units offered. Naming the family lets several families
  share one option list, which is exactly what content-splitting cannot express.
  **The rule that came out of it, worth keeping:** *split a family when two fields want different
  defaults, not when they want different options.* `distance_small` and `distance_large` offer the
  identical four units and exist purely to carry different defaults — merging them would re-create
  the 12,000-inch defect, because one family can only name one default.
  **Both original defects are structurally gone, not merely patched.** Per-family lookup fixes the
  overwrite (each select is assigned the one unit its family names, so nothing can overwrite
  anything); named families fix the length granularity. A third hazard was removed on the way: the
  old matcher compared against **translated label text**, so a translator editing `u_psi` silently
  broke the preset buttons in that language. Matching now uses a `data-unit` attribute.
  **Scope: 25 families, 174 field declarations + 32 row-table selects across 13 pages, zero inline
  unit arrays left.** Verified rather than assumed — option lists diffed field-by-field against git
  HEAD (154 unchanged, 20 changed and all 20 intended), every rendered select on every page carries a
  family and a marked default, and both presets were simulated against the rendered HTML to confirm
  **exactly one selection per select on all 13 pages**.
  **Two defects found during the work, both fixed:** the 32 repeating-row selects (Manning
  Irregular's points, Branched Network's nodes, Irrigation Pressure's laterals) call
  `echoUnitSelect()` directly and would have **ignored the preset buttons entirely**, leaving table
  columns in metric; and a stored cookie holding a unit that no longer exists left `selectedIndex` at
  −1 and silently broke every calculation on the page, so `js/Cookies.lib.js` now falls back to the
  server-rendered default (a guard worth having independent of this task).
  **Defaults were converted, not relabelled.** A page's `default` number is expressed in the
  displayed unit, so switching the initial preset to US changed what all 49 affected defaults *mean*
  — Hazen-Williams would have opened at 1 gpm through a 1-inch pipe. Each was converted to preserve
  its physical value, then rounded to 3 significant figures. **Hazen-Williams additionally got Tom's
  numbers** (6 in, 400 gpm, 1,000 ft, C = 130), verified numerically: v = 4.54 ft/s, inside the
  velocity check band, and h_f = 13.59 ft H₂O ≈ 5.9 psi, cross-checked to within 1.7% against the
  independent US-customary Hazen-Williams form. **The other 12 pages' defaults are faithful but
  unpolished — extracted as Task 164**, since rounding them is engineering judgment Tom offered to
  do himself.
  **Buttons: four (m/mm/ft/in) became two (US/SI), shipped in the same change rather than deferred.**
  Phase 1 would have made the old labels lie *worse* than before — "in" would set diameter to inches,
  length to feet and loss to psi — so relabelling was a correctness requirement, not phase-2 polish.
  `calc_units_us` and `calc_units_si` were seeded as English in all 27 files (+52 payload delta) for
  the next sprint. Tips were dropped as unnecessary; four Large/Small buttons were rejected because
  the size axis is now carried by which family each page names.
  **US is the default preset for first-time visitors** (Tom's call, overriding the Task 144 caution
  about a possible metric Latin American segment). Cheap to revisit: it is one constant,
  `EC_DEFAULT_UNIT_SET` in `lib/Units.lib.php`, and returning visitors are unaffected because the
  cookie stores each select's option *value*.
  Full design record, per-field rationale and the conversion table: `dev/unit-families.md`.


## Task 161

- 0|161|[CC] **Payload-delta false positives eliminated — DONE 2026-07-28.** The delta could never
  reach zero because `generate_translation_payloads.php` counted any key byte-identical to English
  as untranslated, which is permanently wrong for 15 keys: **symbols** (`dw_roughness`,
  `ip_length`, `ip_diameter`, `ip_roughness`, `ip_hf`, `ip_hm`, `bpn_id`), **eponyms**
  (`bpn_method_hw`, `bpn_method_dw`, `bpn_method_manning`), **brands** (`install_android_heading`,
  `install_ios_heading`), and **coincidental cognates** (`dw_regime_laminar`, `or_shape_circular`,
  `or_shape_rectangular`).
  **Result: the suite-wide delta fell from 341 to 68, and six languages (bg, es, ru, tr, uk, zh) now
  read exactly zero for the first time.** That zero is now worth reading.
  **What was built:**
  - `dev/scripts/translation_exempt_keys.json` — the classification, one entry per key with a
    category and a written reason, so no future session re-derives it by hand.
  - `dev/scripts/exempt_keys.inc.php` — shared loader (`ecLoadExemptMap`,
    `ecIsExemptFromEnglishEquality`, `ecIsUniversalKey`).
  **Two design decisions worth keeping:**
  1. **The `$ec_lang_intent` `symbol` tag was rejected as the exemption source** — the task offered
     it as one of two options and it does not work. `symbol` means *"keep the symbols inside this
     string intact"*, not *"this whole string is a symbol"*: `ip_notes_1_def`, `ip_notes_2_def` and
     `wi_notes_we_def` carry the tag and are full prose that must be translated. Only 2 of the 7
     symbol-only keys (`ip_hf`, `ip_hm`) even carry it. An explicit list is the honest mechanism.
     Recorded so the idea is not re-proposed as an obvious improvement later.
  2. **Cognates are exempted per-language, not globally.** `dw_regime_laminar` is exempt only for
     de/es/id/pt/ro; `or_shape_circular` only for es/pt; `or_shape_rectangular` only for es. A global
     exemption would have hidden a genuinely untranslated "Circular" in an unrelated script. A
     language added later is reported until someone confirms the cognate holds — which is the
     correct default.
  **Exemption never suppresses a missing or blank value** — verified empirically, not by reading the
  code: blanking `bpn_id` in `lang.ec.zh.php` reported `reason=blank`, deleting it reported
  `reason=missing`, and the file was restored clean. The `--check` freshness gate was extended to
  treat the exempt list as an input and was confirmed to print STALE when it post-dates the payloads.
  **Scope note — three sibling scripts were fixed too, beyond the task's literal wording.** The task
  named only the generator, but `lang_parity_check.php`, `translation_completion_matrix.php` and
  `lang_syntax_validate.php` each recomputed the same "untranslated" number independently and would
  have kept contradicting it. All four now share `exempt_keys.inc.php`, and the first three report
  **identical per-language counts**. Doing this also required moving the generator's `u_`/`mi_`
  universal-key heuristic into the shared include: the parity checker had never had it, so its
  headline `equal_to_english` was **1237** against the generator's 68 — the same "which number do I
  trust" defect this task exists to remove. Parity now reports 68 with 1468 separately labelled
  `exempt_identical`, and `--strict` becomes usable for the first time.
  `lang_syntax_validate.php`'s `identical-to-english` warnings fell 181 → 60 (it stays lower than 68
  by its own documented ≥4-letter-word filter, plus it does not entity-normalize before comparing).
  **Follow-up logged as Task 163** (validator blind to double-quoted assignments), found incidentally
  during this work.


## Task 159

- 0|159|[CC] **Translation debt resync sprint — 26 languages, DONE 2026-07-28.** Authorized by Tom
  in-session. Created earlier the same day when Tom asked whether translation debt was tracked
  anywhere and it was not; closed the same day.
  **Scope: 5 keys × 26 languages.** Three stale resyncs — `ip_max_head` (Task 142 label head →
  pressure), `mpf_note_1` and `mphl_note_1` (Task 152 HY-8 link + outlet-control item) — plus two new
  keys, `index_meta_desc_plain` (Task 157) and `mpf_sewer_ref` (Task 151).
  **Method:** explicit-key-slice sprint, 26 Sonnet agents, one per language, driven off a
  hand-specified key list rather than the payload delta (which is blind to stale-but-present keys).
  The pre-sprint gate was run: payloads regenerated, `--check` returned FRESH and exit 0.
  **Result: all 26 pass independent verification.** Not the agents' self-reports — CC re-checked every
  file directly for key presence, tag-set parity against English, entity leakage, tags in the
  plain-text meta key, href survival, link counts, and residual English. `php -l` clean on all 26;
  `lang_syntax_validate.php` across all 27 files shows **zero hard findings** (181
  `identical-to-english`, all advisory and expected — see Task 161).
  **The Task 142 terminology decision landed in every language.** All 26 moved off the head word onto
  a genuine pressure term (Presión / Pression / давление / ضغط / Druck / 压力 / दाब / basınç /
  tekanan kerja / тиск / налягане / tlak / притисак / فشار / shinikizo / …). None calqued the English;
  none drifted into a stress or material-strength sense, which was the specific risk the glossary
  flagged. **Glossary write-back done in the same session** — `pressure rating` and `maximum allowable
  head` now carry all 26 new labels, replacing the stale head-era values a translating agent correctly
  flagged as still wrong. Drift manifest re-baselined (`--update`): **debt is zero.**
  **Three process lessons, recorded because each cost something:**
  1. **CC under-launched: 20 agents for 26 languages**, missing the six low-resource ones (am, bn, km,
     my, ps, sw). Nothing was lost — they were launched in a second wave — but the sprint took two
     launches. Count the language list against `lib/Language.Settings.php` before spawning.
  2. **The session-limit retry rule paid off again.** Two agents (km, my) reported *failed* — one on a
     session limit, one on a stalled stream. Per the standing rule, CC checked the files before
     relaunching: `my` needed only one key, `km` needed three, and neither needed the full 20-key
     prompt re-run. Two narrow finishing agents closed them. **Never relaunch a "failed" translation
     agent without diffing its file first.**
  3. **A JSON write-back can silently reformat the whole glossary.** CC's first write-back re-encoded
     `glossary.json` with `JSON_PRETTY_PRINT` (4-space) against the file's own 2-space convention,
     producing a 2,612-line diff that buried the 4 lines of real change. Fixed by re-indenting.
     **Any script that rewrites `glossary.json` must halve `JSON_PRETTY_PRINT`'s indentation.**
  **Extracted, not left inside this block:** the payload delta's permanent false-positive floor is
  **Task 161**.


## Task 151

- 0|151|[CC] **Sewer-slope demand: the doc was findable all along; the real gaps were SI units,
  no meta description, and no back-link — DONE 2026-07-28.**
  **The task's own headline was wrong, and Tom corrected it 2026-07-28: `sewslope.php` is *not*
  unfindable.** Google sends users straight to it — that is where the ~950 impressions across 169
  slope/grade queries come from. The 0.5% CTR was read as a discovery failure; it is better read as
  a *satisfaction* failure, because the page ranked, got seen, and did not get clicked. Everything
  else in the task survived that correction, which is why it still had meat.
  **Shipped (all in `/var/www/cnm/public_html/hawsedc/`, outside this repo — Tom uploads to deploy):**
  - `hawsedc.lib.php` — `echoHawsEDCHeader()` gained an optional second parameter
    `$description = ''`, emitting `<meta name="description">` only when non-empty. Backward
    compatible: every other parent-site page still calling it with one argument is untouched.
  - `sewslope.php` — real meta description; **Table 1 rebuilt with SI**: added a pipe-diameter mm
    column (100–2400 mm, rounded in the same style Table 2 already used) and expressed the same
    minimum slope in three forms side by side — ratio (m/m or ft/ft), **mm/m**, and **percent**.
    Added a "note on slope units" paragraph under Table 2 explaining that slope is a dimensionless
    ratio, so the number is identical in feet and meters; ×1000 gives mm/m, ×100 gives percent.
  - `peakfact.php` — real meta description naming the Harmon formula and the original 10–300 person
    UPC-derived low-flow research.
  - **Back-link added** (`Manning-Pipe-Flow.php` + new `mpf_sewer_ref` key): MPF now points at both
    `/sewslope.php` and `/peakfact.php`, closing the one-directional link the task identified. This
    is the single highest-leverage placement available — MPF carries 2,721 human views, 67% of the
    suite's entire human audience.
  **A correction to the task's premise: Table 2 already had mm diameters.** The "inches-only" claim
  was true of Table 1 only. What no table had, and what the top query (`4 inch sewer pipe minimum
  slope **in mm**`, 135 impressions) actually wants, is the **slope** in a millimeter form — hence
  mm/m rather than only a diameter column.
  **Still open, deliberately not done:** the doc is English-only while the demand is not (`pendiente
  mínima tubería pvc sanitaria`, `kanalizasyon eğim tablosu`, `tabela de inclinação de esgoto`).
  Translating a parent-site tech doc is a different project from the engcalcs translation pipeline
  and was not in scope; the SI columns at least make the tables *readable* to a metric engineer in
  any language, since numbers need no translation. **Extracted to Task 158.**
  **Not done, by standing policy:** no sewer-slope calculator was built — that would duplicate
  parent-site content.


## Task 157

- 0|157|[CC] **`index.php` now has a real meta description — DONE 2026-07-28.**
  The suite's front door was the one page Task 150's reuse trick could not cover, because its only
  candidate key (`index_title`) *is* the title, and pointing at it would have reinstated the exact
  duplicate-of-title defect Task 150 removed. It emitted nothing, leaving Google to auto-generate a
  snippet from a page that is nothing but a menu of links.
  **Decision taken (the task asked for it explicitly): yes, one bespoke key is warranted here.** The
  standing rule is reuse-or-nothing; this is the deliberate, single exception, on the page where a
  description carries the most weight. Cost is 1 key × 26 = 26 strings riding the normal payload
  delta — two orders of magnitude below the 520-string per-page scheme rejected 2026-07-28.
  **Shipped:** `index_meta_desc_plain` = "Free hydraulic engineering calculators for pipes, channels,
  weirs and irrigation. They run in your browser, work offline, and are available in 27 languages."
  Simple English, 154 characters, no tags, no entities. `index.php` sets `$html_desc` from it.
  Verified: `lang_syntax_validate.php` clean, `--rule-c` reports no name/derivation disagreement (so
  `plainTextBoundKeys()` correctly picked the `_plain` key up from the `$html_desc` assignment), and
  the rendered page emits the tag.


## Task 142

- 0|142|[CC] **`ip_max_head` label vs. tip mismatch — resolved on PRESSURE — DONE 2026-07-28.**
  The label read "Max. allow. pipe **head**" while its own tip read "Lines whose **pressure**
  exceeds this value are flagged."
  **Decision: Tom, 2026-07-28 — change the LABEL to pressure, not the tip to head.** `ip_max_head` is
  now **"Max. allow. pipe pressure"**; the tip is unchanged, so exactly **one** key stales.
  **CC initially recommended the opposite and was overruled**, on the strength of two prior glossary
  notes (2026-07-24, 2026-07-27) recording "keep it dimensionally a head" and confirming all 26
  translations had been built that way. Tom's call stands on better ground: a pipe **pressure
  rating** is how irrigation designers actually specify this limit (PVC class 160, PN 10), and the
  field already offers psi/kPa/bar alongside mH2O/ftH2O — so the label now matches both the trade's
  vocabulary and what the user is most likely to type.
  **Scope of the override, recorded precisely:** the underlying quantity and its unit list are
  **unchanged**. Only this label's English noun changed. The head-vs-pressure guard in the root
  `head` glossary entry's `avoid` array still holds everywhere else in the suite.
  **Glossary write-back done in the same session (v1.18 → v1.19)**, per the mandatory-write-back
  rule: both `maximum allowable head` and `pressure rating` carry a dated note stating the decision,
  that it supersedes the earlier framing *for this label only*, that all 26 translations are now
  stale for this key, and that translators should use their own language's natural pipe
  pressure-rating term (pressure class, PN rating) rather than calquing the English.


## Task 152

- 0|152|[CC] **HY-8 itself is now linked from both culvert-adjacent notes — DONE 2026-07-28.**
  Both `mpf_note_1` and `mphl_note_1` named HY-8 in text while linking only to the 2-minute tutorial
  video. Both now link the program itself at the FHWA page
  (`https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/` — verified live, HTTP 200), styled
  as "HY-8, the free culvert program from the U.S. Federal Highway Administration" so the link says
  what it is rather than assuming the reader knows.
  **The honest scope sentence the task asked for** was added to `mphl_note_1` as a fourth item: "This
  page solves the outlet control case only: a pipe flowing full, where the downstream conditions set
  the head. Culvert design is the job of deciding whether inlet control or outlet control governs, so
  use HY-8 whenever either one could."
  **Ride-along fix:** both notes opened a `<dl>` and never closed it. Closing it inside the language
  string would have staled 26 translations for a markup bug, so the `</dl>` is emitted by
  `Manning-Pipe-Flow.php` and `Manning-Pipe-Head-Loss.php` instead — zero translation cost.
  **Decision reaffirmed, not reopened: no culvert calculator.** (Reach is 66 impressions; `mphl_` is
  only *like* a culvert calculator in outlet control, and shipping outlet-control-only would disagree
  with HY-8 exactly where a designer most needs to be right.)
  **Cost incurred: 2 keys × 26 languages stale** (`mpf_note_1`, `mphl_note_1`) — a resync, not a
  sprint. Tracked by the drift tripwire and rolled into Task 159.


## Task 154

- 0|154|[CC] **Turkish ASCII-fold scan — tr is clean; no fold found in any language — DONE
  2026-07-28.**
  **Method: deterministic self-evidence, not an agent pass.** Rather than the Sonnet read the task
  proposed, CC wrote a scanner keyed on a fact that needs no dictionary: **if the same word appears
  in the same file both with and without its diacritics, the bare form is a fold.** Ran it over all
  ten diacritic-bearing lang files (tr, ro, hr, cs, sr, pt, es, de, fr, it).
  **Result for tr — clean.** Four candidates, all verified false positives, all correct as shipped:
  `kotu` (×22) is *kot* "elevation" + suffix, a real surveying term, not `kötü` "bad"; `Islak`
  (`mpf_wetted_perimeter`) is the correct **dotless-I** capitalization of `ıslak`; `Bas.` (`ip_press`)
  is a correct truncation of `Basınç`, not `baş`. A second, independent probe for ~40 common Turkish
  words that always carry a diacritic (`için`, `değer`, `yüksek`, `çap`, `akış`, `basınç`, …) found
  **zero** ASCII-folded occurrences. **The `template_feedback` string fixed during Task 153 was the
  only instance in the file.**
  **Other languages: no confirmed fold either, but the method cannot close the question there.** In
  Romance and Slavic files the signal is swamped by legitimate homographs where the unaccented form
  is its own real word — es `que`/`qué` and `esta`/`está`, ro `baza` (definite article) vs `bază`,
  cs `plocha` (noun) vs `plochá` (adjective), fr `base`/`basé`. Precision is high for Turkish
  (diacritics are not optional there) and low for these, so a clean tr result is meaningful while a
  ro/cs candidate list is not evidence of a defect. hr, sr and it returned zero candidates outright.
  **One real, non-fold finding in tr, left unfixed on purpose:** the file disagrees with itself on
  vowel harmony for the app name — `EngCalcs'i` (3×: `install_main_title`, `install_desktop_steps_html`,
  `install_cached_body`) vs `EngCalcs'ı` (1×). One of the two is wrong, but which depends on how a
  Turkish speaker vocalizes "EngCalcs", and CC will not guess a native phonological judgment to
  change three shipped strings. **Extracted to Task 160.**
  **`QUALITY` unchanged for tr** — the scan found no defect, so there is nothing to lower it for, and
  a clean automated scan is not grounds to raise it either.


## Task 150

- 0|150|[CC] **Every page's meta description was just its own title repeated — DONE 2026-07-28.**
  All 21 pages that carried a description built `$html_head` with
  `<meta name="Description" content="'. $html_title .'" />`. Google routinely discards a
  duplicate-of-title description and auto-generates a snippet instead — from a page whose visible
  content above the fold is a form, not prose.
  **What shipped: reuse, not new strings.** 19 pages now point `$html_desc` at their own existing
  `<prefix>_main_desc` — a key that is already written, already translated into all 26 languages, and
  already distinct from the title ("Free Online Manning Pipe Flow Calculator" vs "Manning Formula
  Uniform Pipe Flow at Given Slope and Depth"). The defect is fixed **in every language today at zero
  translation cost**. `Orifice-Drain-Time-Ref.php` keeps a literal English string, being an
  English-only reference page with no language switcher.
  **This task was first built the expensive way, and Tom caught it (2026-07-28).** The original
  implementation wrote 20 purpose-authored `*_meta_desc_plain` keys (98–151 characters of prose:
  what the calculator finds, then what the user enters) and seeded all 27 lang files, which pushed
  the standing translation delta from **365 strings to 885** — avg 14 per language to 34, i.e. +520
  strings, roughly tripling it. His question was the right one: *why new descriptions when
  descriptions already exist?* The prose does read better as a search snippet, but that is an
  incremental SEO gain bought with a full extra sprint's worth of translation, and it was never put
  to him as a trade before the strings were written. Reverted in full; delta measured back at
  exactly 365. **The standing rule is now reuse-or-nothing, recorded in `CLAUDE.md`** — weigh any
  future "let's write real descriptions" proposal against that same arithmetic before starting.
  **Emission moved into `echoHTMLHead()`**, on the Task 149 precedent: a page sets the global
  `$html_desc` before `echoHeader()`, and the one function every page's `<head>` passes through does
  the escaping. Three consequences worth keeping. (1) The 12 pages that had been interpolating
  `$html_title` **unescaped** are now escaped by construction, not by remembering. (2) A new
  calculator gets the tag right for free — the recipe is one line, documented in `CLAUDE.md`. (3) The
  tag is emitted **only when non-empty**, so `index.php`, `contact.php`, `Compare-Languages.php`, and
  `formmailsuccess.php` correctly have none: repeating the title is worse than silence, so a page
  with nothing real to say says nothing. `index.php` is the one place that genuinely costs something
  — **extracted as Task 157**, a 26-string exception, rather than left as a loose end here.
  **`plainTextBoundKeys()` gained a derivation rule for the `$html_desc` assignment**, so whatever
  key a page points at is held to Rule A (no entities) and Rule B (no tags). It is redundant today —
  every such key is a `*_main_desc`, already bound via `Menus.lib.php`'s `title=""` — and kept
  precisely for the day a page points `$html_desc` somewhere new. Rule C's advisory count went
  **29 → 31**: `about_main_desc` and `install_main_desc` are the two `_main_desc` keys whose menu
  entries carry no `title=`, so nothing derived them until now. Same intentional class as the other
  16 — a `_main_desc` has three destinations at once and no single name fits. Counts updated in
  `CLAUDE.md` and the validator's `--help`.
  **Verified by rendering all 23 pages** in en, and es/ar/ru for the translated path: 19 unique
  descriptions, no duplicates, none repeating its own title, none empty where one was expected.
  **Partially done 2026-07-27 (unchanged):** the companion `<meta name="Keywords">` tags were deleted
  from all 20 pages that carried them (Tom: "Once upon a time that was a main purpose of keywords…
  let's modernize"). They were both ignored by search engines and actively wrong — `Manning-Trap.php`
  and `Weir-Flow-Simple.php` carried `"wier vetedero calculacíon…"` (weir keywords on the
  *trapezoidal channel* page, "wier" misspelled), with `pipie`/`tobus` typos elsewhere and
  `&iacute;` HTML entities inside meta content.
  **Unrelated pre-existing finding, not touched:** `formmail.php` does not parse (`php -l`:
  "Unclosed '{' on line 80"). Confirmed present before this task by stashing the change and
  re-linting. Left alone deliberately — it is not a meta-description defect and deserves its own look.


## Task 156

- 0|156|[CC] **`.git` and directory listings were readable over HTTP — closed. DONE 2026-07-28.**
  Found while answering "is `engcalcs/.htaccess` even needed?" during Task 155, not by looking for
  it. Two defects, both now fixed and verified live:
  - **`.git` was fully retrievable.** `/engcalcs/.git/` served a browsable index,
    `.git/refs/heads/master` gave the tip SHA, and `objects/pack/*.pack` downloaded intact (937 KB,
    HTTP 200). **Why the existing guard missed it:** `<FilesMatch "^\.">` matches *filenames*, not
    directories, and `.git`'s contents are named `config`, `HEAD`, `index`, `objects/` — not one of
    them starts with a dot. Production deploys by `git pull`, so `.git` is necessarily present.
    **The real cost was not source disclosure** — the suite is GPL v3 — **it is that `dev/.htaccess`
    deliberately blocks `dev/` over HTTP while the packfiles served the same content anyway**, making
    that block decorative. The reflog also carried committer names and addresses. History was scanned
    for committed credentials: **none** (the `x-api-key` hits are `$apiKey` variable references
    reading from the environment). Fixed with `RedirectMatch 404 "/\.git(/|$)"`.
  - **Directory listings were on** — `/lib/`, `/js/`, `/css/`, `/icons/` each served a full file
    index. Fixed with `Options -Indexes`.
  **Shipped as two commits on purpose** (`c089fc9`, then `a012927`), pulled and verified separately.
  `RedirectMatch` is mod_alias, the same override level as the `Redirect 301` rules already working
  in the file, so it was known-safe. **`Options` is not** — it needs `AllowOverride Options`, a
  separate grant, and where that is missing Apache returns **500 for every request under
  `/engcalcs/`** rather than ignoring the line. **Confirmed granted on this host 2026-07-28**; if the
  site ever moves, re-test that line first and drop it if the new host 500s. Splitting the commits is
  what made the risky half independently revertable.
  **Also assessed and left alone:** the three `Redirect 301` lines for pre-reorg `/engcalcs/lib/`
  asset paths are **spent** — the reorg was `fe2af01`, 2026-06-16; nothing in the codebase references
  those paths, `sw.js` (v5) precaches only the new ones, and pages are served `no-store, no-cache` so
  no stale HTML points at them. They fire correctly but have nothing left to catch. Harmless to keep,
  safe to delete whenever.


## Task 149

- 0|149|[CC] **Non-English pages were effectively absent from the search index — `hreflang`,
  canonical, and sitemap now emitted. DONE 2026-07-28.** Root cause: one URL served every language,
  chosen at request time by cookie / `Accept-Language` (`lib/Language.lib.php`). `?lang=xx` URLs
  existed (language dropdown, `lib/Menus.lib.php:148`) but **nothing declared them** — no `hreflang`,
  no `canonical`, and `hawsedc.com/sitemap.xml` returned 404. Googlebot crawls from US IPs with
  `Accept-Language: en`, so it indexed the English rendering of every calculator and the other 26
  languages never entered the index — a mission problem (reach), not merely an SEO one. Diagnostic
  signature in the 2026-07-27 Search Console export: `calculo de canales trapezoidal online` ranked
  **position 2.8 with 0% CTR** (34 impressions); `formula de manning` 80 impressions, position 8.8,
  zero clicks — ranking well while converting zero is what a language-mismatched snippet looks like.
  **Decided (Tom, 2026-07-27): `?lang=xx` stays the canonical URL form** rather than `/es/…` paths.
  What shipped:
  - `ec_canonical_url($lang)` in `lib/Language.lib.php`, built from **`SCRIPT_NAME`, not `PHP_SELF`
    or `REQUEST_URI`** — either of those would let a visitor's own URL nominate itself as canonical
    via trailing `PATH_INFO` or arbitrary query junk. Every parameter except `lang` is dropped, which
    also stops `?name=` (the bookmark/share label) from minting an indexable variant per label.
    `/index.php` collapses to the directory URL.
  - `CANONICAL_ORIGIN` in `lib/config.inc.php` — **deliberately not `$_SERVER['HTTP_HOST']`**, which
    is client-supplied: a spoofed `Host` would emit a canonical pointing search engines off-site.
  - `echoHTMLHead()` in `lib/HeadersFooters.lib.php` emits a self-referencing `<link rel="canonical">`
    plus 27 `hreflang` alternates and `x-default`, so all 23 pages got it in one edit and a new
    calculator gets it for free. **`x-default` points at `?lang=en`, not the bare URL**: the bare URL
    is not self-canonical (it canonicalises to whatever it negotiated), and an `x-default` aimed at a
    URL that canonicalises elsewhere is a signal Google may ignore. Naming `?lang=en` for both `en`
    and `x-default` is explicitly permitted.
  - `dev/scripts/generate_sitemap.php` → `../sitemap.xml`, 543 URLs (20 pages × 27 languages + 3
    parent-site pages). Languages are read from `Language.Settings.php`, so adding a language needs no
    second edit. `sewslope.php` and `peakfact.php` are included on purpose — Task 151's "no sitemap
    entry" defect, fixed here. The sitemap does **not** repeat the hreflang set as `xhtml:link`; the
    HTML head already carries it, and repeating it would multiply the file ~27× for no added signal.
  Verified by rendering against a local PHP server: `?lang=es` self-canonicalises, `?name=` is
  dropped, `?lang=zz` and the bare URL both consolidate to a valid language, `/engcalcs/index.php`
  collapses to `/engcalcs/`, and the XML parses. **Deploy and verification are Task 155** — nothing
  reaches Google until the sitemap is uploaded, `robots.txt` names it, and Search Console gets it.


## Task 153

- 0|153| **Resync `template_feedback` — 26 languages brought in line with the reformed
  English. DONE 2026-07-28.** The string was `'Please share your valued words of suggestion or praise.  Did this free calculator
  exceed your expectations in every way?'` and is now `'Please send suggestions or praise. Did this
  free calculator serve you well?'`. Rationale: the old wording was flattery-fishing and failed the
  Simple-English rule, and the 26 languages already showed the strain — es and ar had quietly dropped
  "or praise" and softened to "was it useful?", while sw and zh calqued the whole thing literally.
  Tell: `$ec_lang_intent['template_feedback']` had *already* rewritten it to almost exactly the new
  wording, i.e. the intent was doing repair work the source string should have done. Caught by
  `detect_english_drift.php`, which now reports it as the sole CHANGED key. **Also considered and
  rejected:** replacing the ask with "Tell your friends!" evangelism and dropping the Contact link.
  Rejected because (a) the link is the only in-context ask at the moment the user just got their
  answer, and it is the channel that actually paid — `dev/Bulgarian-engineer-feedback.md` exists
  because someone clicked it; menu presence is not equivalent; (b) "friends" reads personal-social in
  most of the 26 target languages while the real sharing act is professional; (c) evangelism is
  unmeasurable and unharvestable where feedback is neither. If a share mechanism is ever wanted, it
  should be a copy-link affordance near the results, not a sentence. **`$ec_lang_intent` for this key
  was emptied** — authorized by Tom in-conversation 2026-07-27; the old intent had become redundant
  with the reformed English, and a plain, directly-translatable label needs no intent entry.
  1 key × 26 languages: a resync, not a sprint.

  **Done inline, not as a sprint.** One short, wholly non-technical sentence with no glossary terms
  and no markup — Opus wrote all 26 directly, so no agents were spawned and no payload regeneration
  was needed. The sprint-authorization rule is about fanning out paid agents; there was nothing to
  fan out.

  **QA run:** `php -l` on all 27 files; `lang_syntax_validate.php` (180 findings, all pre-existing
  advisory `identical-to-english`, none on this key — no entity, tag, or escape findings);
  back-translation of every one of the 26 against the new English. All 26 read back as "send
  suggestions or praise" + "was it useful / did it serve you well" — the flattery clause
  ("exceed your expectations in every way") is gone everywhere, including the es/ar softenings and
  the sw/zh calques the task named. No glossary write-back: the string carries no engineering
  terminology, so there was no terminology decision to memorialize.
  `detect_english_drift.php --update` run; drift now reports CHANGED: none.

  **Found in passing, extracted to Task 154:** the old tr value was ASCII-folded (missing ş/ğ/ı).
  Out of scope here; filed as its own task rather than left inside a closed block.


## Task 148

- 0|148| **`template_welcome`'s `>> ... <<` markers replaced with CSS italics — DONE 2026-07-27.**
  Filed and closed the same day. Tom, on reading the finding: "could use italics `<em>`? instead of
  `>> ____ <<`, I suppose. The symbols are not standard English or typography." Correct on both
  counts, and it makes the divergence moot rather than merely consistent.

  **What was there.** All 27 files wrapped the welcome line in directional markers — English in
  `»`/`«` (Task 140 step 1 converted its `&gt;&gt;` entity), the other 26 in a literal ASCII
  `>> ... <<` that Rule A never touched because it was never an entity.

  **Done as CSS, not `<em>`, for two reasons beyond Tom's typography point.**
  1. **It gets presentation out of the language strings entirely** — the same theme as Task 140
     itself. An `<em>` in the string would have left 27 translators hand-copying markup, which is how
     the markers ended up inconsistent in the first place. The strings now carry only words; the
     emphasis lives in `.ec-welcome` (`css/engcalcs.css`) and the class is added once in
     `lib/HeadersFooters.lib.php`.
  2. **It allows a per-script exception that markup in the string could not express.** Italics are
     applied by default but switched off via `html[lang="…"]` for the 11 languages whose scripts have
     no italic tradition (am, ar, bn, fa, he, hi, km, my, ps, ur, zh) — there the browser can only
     synthesize a slanted face, which reads as a rendering fault rather than as emphasis. Those
     languages lose nothing: the line is already its own paragraph under the `<h1>`.

  This also retires the directional-decoration problem the CSS had already documented once, for
  `.ec-solverline`: a `>>`/`<<` pair has to be mirrored for the five RTL languages, and now nothing
  needs mirroring.

  **QA.** All 27 `php -l` clean; `lang_syntax_validate.php` clean of every structural category.
  Rendered `Manning-Pipe-Flow.php` in en/es/ar/zh and confirmed the markers are gone, the
  `ec-welcome` class is on the paragraph, and the `html[lang="…"]` selector matches the real markup
  (`<html lang="ar" dir="rtl">`). Drift manifest re-baselined — markup-only, no words changed, so no
  language is stale and no resync is owed.


## Task 147

- 0|147|[CC] **sw `kichwa` → `kimo` head-term conversion finished — DONE 2026-07-27.** Authorized by
  Tom the same day it was filed. Converted all 16 stragglers in `lib/lang.ec.sw.php`:
  `dw_`/`hw_`/`mphl_` `main_menu`+`main_title`+`main_desc`, `mhp_hnet`, `mhp_notes_1_term`,
  `mhp_notes_1_def`, `mhp_notes_3_term`, `odt_h1`, `rc_Hp`, `ip_max_head`. Head loss is now
  "Upotevu wa Kimo" (Title Case in identity strings, lowercase in prose, matching the already-correct
  `mhp_hl_check`); net head is "Kimo halisi", parallel to `mhp_gross_head` "Kimo cha jumla". The file
  now reads `kimo` in all 37 hydraulic uses and `Kichwa` only in
  `template_printable_title`/`_subtitle`, where it correctly means "title/heading".
  **Why a straight word swap was safe:** `kichwa` and `kimo` are both noun class 7, so every
  `cha`/`wa`/`kinacho-` concord marker in the surrounding text stayed valid — no regrammaring needed.
  **QA:** `php -l` clean; `lang_syntax_validate.php --lang=sw` clean of every structural category (7
  advisory `identical-to-english` findings, all pre-existing and unrelated); tag-name parity against
  English verified on all 16; and each string back-translated to English inline (no `ANTHROPIC_API_KEY`
  here, so the orchestrator does the check rather than logging it skipped). Two apparent tag mismatches
  were a naive-regex artifact of Rule A: `rc_Hp`'s `&gt;` is now a literal `>` inside a `title="…"`.
  Checked with a real parser (`DOMDocument`) rather than dismissed — the attribute reads back intact
  with zero libxml errors, confirming the Task 140 step-1 judgment that `>` is safe in a quoted
  attribute value. Glossary `head` entry updated with the completion per the mandatory write-back rule.
  **Left deliberately alone:** `rc_Hp` keeps `bwawa` for "weir", matching its already-converted sibling
  `rc_notes_7_def`; the `ws_`/`wi_` `kizingiti` standardization is a separate concern, not this task.
  **Lesson worth keeping:** the 2026-07-22 glossary note *listed the keys it changed*, which reads as
  completion but was a partial pass — a terminology decision is not applied until someone greps the
  whole file for the rejected term.


## Task 139

- 0|139|[CC] **Points-data copy/paste on Irrigation-Pressure (`ip_`) — DONE 2026-07-27.** Diagnosed
  and fixed the same day Tom asked. Root cause was exactly the "wrong singleton count" the task
  predicted, off by one: `js/irrigation-pressure.js` declared `dataSingletonsCount = 14` while the
  form renders **15** INPUT elements above the reach table — `h_max_allow` was added later without
  bumping the count (its comment still read "the 12 form inputs"). Effect: Copy emitted a grid
  shifted one cell left (leading with `40`, h_max_allow's own value, and dropping the last row's
  `elev_ds`), and Paste wrote that shift straight back into the form. Reproduced and verified with
  the Node harness the task specified (eval `Cookies.lib.js` + `global.EngCalcs=EngCalcs;`), driving
  a cookie built in real `form.elements` order: at 14 the round-trip fails, at 15 it is byte-identical.
  **Second, unasked-for find — `bpn_` had the same defect, worse.** A generic check (render each page,
  count INPUTs before `id="CalcsBody"`, compare to the declared constant) cleared Manning-Irregular
  and Weir-Flow-Irregular but flagged Branched-Network at **declared 9 vs actual 11** — `h_max_allow`
  *and* `demand_mult` were both added after the count was written, and a stale 5-singleton comment
  from an earlier layout was still sitting above the live one. Fixed to 11 and verified by the same
  round-trip. So the Task 137 note that bpn's copy/paste "works" was true when written and had since
  rotted. Both comments now state the invariant (count INPUTs only — unit SELECTs are `s:` slots and
  never reach the input counter) and warn that adding a singleton input means bumping the number.
  **Worth keeping:** this bug is silent and recurs every time a field is added above a row table.
  The render-and-count check is three lines of throwaway script; a permanent version belongs in
  `dev/scripts/` if it bites a third time.


## Task 141

- 0|141| **Check whether `Kichwa` (sw) and `الرأس` (ar) are really the hydraulic-head term — CLOSED
  2026-07-27 as already answered.** Tom, 2026-07-27: "I believe it's stale. We already determined
  that the answer is 'No'." Confirmed against the record — the determination predates the task by
  five days. The sw half was settled **2026-07-22** (glossary `head` `translation_notes`, Tom +
  Kenya-engineer input): `kichwa` is the body-part word and NOT the Swahili engineering term for
  hydraulic head; `kimo` is, anchored by `kimo cha kasi` already being the accepted term for velocity
  head. The ar half is settled by the **Task 128 resolution (2026-07-21)**: the blanket
  `avoid: anatomical "head"` guard was itself the mistake, and an anatomically-derived word that IS
  the dominant local standard is explicitly correct (English "head" is itself the body-part word) —
  so `الرأس` needs no change under defer-to-cultural-standard. No native check is owed on either.
  **Closing this surfaced real unfinished work, extracted to Task 147:** the 2026-07-22 sw decision
  was only applied to the seven keys it named, leaving 16 keys still on `kichwa` against 15 on
  `kimo`. The question is closed; the cleanup is not.
  **Original text follows.** **Scope corrected 2026-07-27 (Tom): an
  earlier version of this entry claimed a 7-of-26 head-term inconsistency by comparing each language's
  `ip_max_head` (pipe pressure head) against `ws_headWaterHeight` (weir head). That baseline was
  wrong — those are different quantities and SHOULD differ; weir head is the depth over the crest, so
  he `עומק`, de `Überfallhöhe`, cs `Přepadová výška` are all correct. That finding is withdrawn; the
  head terminology was already settled and stays settled.**
  What remains is one small question, not a defect list: Swahili uses `Kichwa` — the ordinary word for
  the body part — as the hydraulic-head term in the `dw_`/`mhp_` strings, and the sprint's new
  `ip_max_head` followed that incumbent for consistency. Arabic's `ws_headWaterHeight` uses `الرأس`
  the same way. In many languages the body-part word IS the standard hydraulic term (English "head"
  is itself exactly this), so this may be entirely correct. Worth one native or high-confidence check
  for those two languages only — **do not bulk-rewrite, and do not re-open the other 24.**


## Task 143

- 0|143|[CC] **Move the solver control into the depth label on `mtc_` and `mpf_` — DONE 2026-07-27.**
  Requested by Tom 2026-07-27 and built the same day (commit `b3fd396`). The "solve for depth given
  Q" control was a banner above the form, separated from the field it writes into by the units row
  and several inputs; it now sits on the second line of that field's own label (`dd0` on
  Manning-Pipe-Flow, `y` on Manning-Trap), so the thing you are solving for and the control that
  solves it are one element. Feasible as hoped — the label markup already carried links, tips,
  radios and a second number input on `mtc_`, and the narrow-column constraint governs the
  *results* table, not the inputs column.
  Shipped:
  - `echoCalculatorForm()` inputs take an optional `'control'` key, rendered **after** `</label>`.
    This also fixes a pre-existing wart: `mtc_`'s radio groups had been nesting form controls
    (and nested `<label>`s) inside `<label for=…>`.
  - `solverControlHtml()` in `lib/Calculators.lib.php` holds the shared control, rendering
    `[Solve] for Flow, Q = __ [units]`. Same `solver_q` / `solver_qu` / `solver_msg` ids, so
    **no solver JS logic changed**.
  - `.ec-solverline` is deliberately plain — no rule, no indent glyph. An arrow glyph would have
    needed RTL mirroring, and the original `line-height: 2` was being inherited by the Q input and
    inflating its height.
  - **One new key, `mpf_solve_for_flow`** (`"for Flow, Q ="`), translated into all 26 languages.
    The connective is one whole key, never a preposition composed with a separate noun at render
    time, so word order and case agreement stayed the translator's to decide — case-governed
    prepositions inflect (ru `для расхода`, uk `для витрати`, cs/hr/sr accusative) and
    postpositions go where they belong (tr `debi için`, my/ur/hi/ps). Every language reuses its own
    glossary `flow` term, verified mechanically. `=` was chosen over `:` (Tom): it says only "here
    comes a value", and unlike a colon it needs no per-language typographic convention.
  - Four keys retired from all 27 files — `mpf_solve_desc`, `mtc_solve_desc`, `mpf_solve_for_dd0`,
    `mtc_solve_for_y`. Neither depth label had a tip before the change and neither has one now; an
    interim attempt to rehome the banner's prose in a label tip was rejected (Tom) as both wrong
    for the content and unnecessary once the solver is targeted.
  - **Cookie format bumped to v2 on both pages.** Non-obvious and the main risk in the task: moving
    the control inside the form makes its Q input and units select form elements holding two
    *positional* cookie slots, so an unmigrated v1 cookie would fail the slot-count guard in
    `cookieToForm` and silently reset every returning visitor's saved inputs — on two of the three
    highest-reach calculators. `insertSolverCookieSlots()` in `js/Cookies.lib.js` splices the slots
    in at page defaults (`solver_q` is INPUT #6 on MPF, #11 on MTC — the `n_radio` buttons count).
    Side effect, benign: the target Q now persists like any other field.
  QA: `lang_syntax_validate.php` clean of the new key; `php -l` clean on all 27 files; payloads
  regenerated and `--check` FRESH; drift manifest re-baselined; back-translation checked inline per
  language. **Glossary needed no write-back** — the `flow` entry already carried all 26 terms and no
  new terminology decision was made.


## Task 138

- 0|138|[CC] **Optimize suite-wide "Related calculators" links — DONE 2026-07-27.** Re-scoped from a
  full cross-cutting graph pass to a handful of links, on the evidence of the 2026-07-27 usage
  snapshot (`dev/usage-data-log.md`). Findings that drove it: only 4 of 15 calculator pages carried a
  Related line at all and **no link was reciprocated** (all 11 targets were dead ends); human views
  are extremely concentrated (**MPF alone = 67% of all human views; MPF + HW + MTC = 92%**), so a
  link on a long-tail page is seen by 6–17 humans; and the combined downstream traffic of MPF's four
  existing outbound links is ≤3.6% of MPF's own, so re-curation has small expected yield regardless.
  **Reciprocity was explicitly rejected** (Tom): it would spend 11 page edits placing links in front
  of a rounding error. Links are only worth adding where the humans already are.
  Shipped — three pages, five links, no new `$ec_lang` keys and therefore **no translation work**:
  - `Hazen-Williams.php` — added Manning-Pipe-Flow and Branched-Network (kept DW, MPHL). The one real
    opportunity: 580 humans converting at 11%, previously offered only the suite's two *least*
    trafficked pipe pages. MPF converts at 67%; BPN does HW loss natively. See Task 144.
  - `Manning-Trap.php` — added Manning-Pipe-Flow (kept MI, RC, CS). Both Manning open-channel; low
    stakes, and MPF needs no promotion (Tom) — it is for the MTC visitor's benefit, not MPF's.
  - `Irrigation-Pressure.php` — new Related line: Branched-Network, Manning-Pipe-Flow. Justified by
    the **dead end in the suite's highest-value flow**, not by IP's own 46 humans: MPF actively feeds
    IP, IP converts at 4%, and there was no onward path. IP (main/lateral pressure, DU) and BPN
    (branched fixed-demand network) are the same person's problem at different scales.
  - Every other page deliberately left unchanged; MPF's own line left alone (already a reasonable
    length, and its links are the long tail's only distribution channel).
  **IP's 4% remains un-diagnosed** — the tempting "broken copy/paste" explanation (Task 139) was
  tested and rejected by Tom: Paste is indeed broken but only a rare, experienced user touches that
  area, far too few to explain 44 of 46 visitors not calculating.


## Task 137

- 0|137|[CC] **Branched (distributary) pipe network calculator — DONE 2026-07-27.** A quick, easy pressure/flow
  calculator for distributary (dendritic/tree) pipe networks — source → main → branches delivering
  fixed demands — filling the niche where EPANET is overkill (no loops, no iteration). Parent-pointer
  topology (no node table; each line has one upstream line), single-pass fixed-demand solve
  (bottom-up flows, top-down pressures), **series-by-default degradation** (`upstream` defaults to
  the previous line, so a no-topology entry is a plain series pipeline — subsumes the old
  "generic series multi-reach" idea), live Manning/HW/DW method switching, fixed k-value minor
  losses, **break-pressure-tank spacing** (flags where static head would exceed pipe pressure rating
  — absorbs the useful core of the former spring-box Task 111, now cut), a demand-multiplier
  **system curve** with pump-curve overlay, and a "tall" topology sanity
  sketch with toggleable per-cell data. **Phases 2 and 3 were EXTRACTED to Tasks 145 and 146 on
  2026-07-27 and are no longer tracked here** — Phase 2 = the feasibility-gated Google Maps
  elevation/length helper (isolated, lazy-loaded, core solve never depends on it); Phase 3 = looped
  (Hardy Cross) networks, originally "conditional, uncommitted, only after we're map-mashup experts
  or users ask." **Both have since left `bpn_` entirely (2026-07-28):** Task 146 became a separate
  map-interface calculator with its own prefix (`lpn_`), using the global gradient algorithm rather
  than Hardy Cross, and Task 145's map mashup moved onto that page with it. **`bpn_` therefore has no
  remaining phases and no map work** — nothing should go looking for either here. **Filing lesson (Tom, 2026-07-27):** leaving unbuilt phases inside a `- 0|…|` block
  in `## Completed` means nothing will ever surface them again — closed blocks are not scanned during
  prioritization, so the only retrieval mechanism was Tom personally remembering. Future work must
  never be parked inside a DONE block; extract it to its own task, even if the priority is low and
  the gate is unmet. Springboards off Irrigation-Pressure (`ip_`) but built fresh —
  **do not extract or degrade `ip`**. This is a **core-hydraulics** calculator in Tom's home
  authority, so the 4-axis mission-expansion framework above does not gate it. Candidate prefix
  `bpn_` (claimed 2026-07-23). Full spec: `dev/branched-network-calculator-scope.md`.
  **Status 2026-07-24 — build complete; only the translation sprint remains.** Decisions taken this
  date (all recorded in the scope doc): excessive-pressure reporting built, with **no "break pressure
  tank" terminology anywhere in UI or code** — the tool reports excessive pressure and does not size
  or place tanks (`6394929`); global demand multiplier built (`160cdb9`); the demand-multiplier
  **system-curve plot is CUT, not deferred** — no place for it on the page, do not reintroduce
  without a fresh reason; distributed outflow settled as **point demand at the downstream end only**
  (do not carry over `ip`'s along-the-line outflow); `ip_max_head_tip` reworded so it no longer
  repeats its own label (`c7027f6`). Glossary gained `pressure rating` and `pressure reduction`,
  both synonym-tolerant rather than calques (glossary 1.17).
  **Sprint run and closed 2026-07-27** (authorized by Tom the same date). 26 Sonnet agents, one per
  language. Per-language deltas ran 15-24 keys, not a uniform 21 — the count varies with what each
  file was still missing. The six real strings (`ip_pressure_high`, `ip_pressure_high_short`,
  `ip_max_head`, `ip_max_head_tip`, `bpn_demand_mult`, `bpn_demand_mult_tip`) are translated in all
  26; the do-not-translate guard held (symbols/eponyms verbatim everywhere, RTL included).
  `ip_pressure_warn` was carried as a resync key (English had drifted); every language independently
  confirmed its existing translation still matched, so none was rewritten, and the drift manifest is
  re-baselined to 2026-07-27. QA: `lang_syntax_validate.php` across all 26 returns 180 findings, all
  advisory `identical-to-english` (the frozen symbols) — zero escape-leakage, tag-imbalance,
  foreign-script, or entity-in-attribute. Tag-parity and entity checks on the six keys clean in all
  26. Back-translation done inline (no `ANTHROPIC_API_KEY` here), not skipped. Glossary write-back
  done as part of closing, not deferred: `pressure rating` and `pressure reduction` both populated
  for all 26 with dated notes (glossary 1.18). The residual payload delta (365 keys) is entirely
  frozen symbols, eponyms, product names, citations, and genuine cross-language cognates (`Name` in
  de, `Source`/`Notes`/`fraction` in fr, `Diameter` in id) — it will never reach zero and that is
  correct. Two follow-ups were split out rather than left dangling inside this closed block: Task 142
  (`ip_max_head` label/tip wording) and Task 141 (a narrow sw/ar terminology question).


## Task 136

- 0|136| **Reworded `template_translation_help` to invite native-language review — DONE 2026-07-21.**
  Authorized by Tom 2026-07-21 ("Deploy now"). English changed to the LOCKED wording "Do you have
  ideas to improve these calculators? And if this is your language &mdash; is the translation good?
  Please tell us." (draft C, "right"→"good"), then resynced into all 26 languages so the invitation
  appears in-language (a native speaker sees the ask to review their own language — a passive,
  always-on companion to the Task 135 sw review). One-key delta sprint, 26 Sonnet agents. The English
  edit correctly tripped `detect_english_drift.php` (validated the tripwire end-to-end on a real
  change), and the manifest was re-baselined after full sync. QA: 27×`php -l` clean; em-dash verified
  single-encoded `&mdash;` in all 26 (the `&amp;mdash;` in agent reports was notification
  display-escaping, per the Task-130 lesson); no double-encoding anywhere; trailing-space + string
  termination verified. **Session-limit note:** the account-wide session limit fired mid-sprint; 6 of
  7 "failed" agents (ru/sr/sw/tr/uk/ur) had already landed correct edits before erroring (per the
  session-limit-retry lesson — verify before relaunch), and only **zh** truly missed. With retries
  blocked by the limit and the rest ready, zh was completed inline by the orchestrator (Opus) rather
  than stalling the deploy — a one-string, trap-free deviation from the Sonnet-agent process, flagged
  for transparency; zh back-translation verified faithful.


## Task 129

- 0|129| **Stale-English-revision resync audit — DONE 2026-07-21.** Authorized by Tom 2026-07-21.
  Explicit-key-slice sprint (26 Sonnet agents, one per language) over the 5 keys flagged in Task 109
  (`ip_du_estimate`, `ip_worst_case_warn`, `ip_q_ratio`, `ip_notes_3_def`, `mhp_notes_2_def`) whose
  current English was shortened in the Wave-0 reform (commit 7bfbda1) while several languages still
  carried translations of the older, longer English. Driven off the explicit key list, not the
  payload delta (delta is blind to stale-but-present keys — same as Tasks 130/131). Each agent did a
  semantic per-language read against current English and rewrote ONLY drifted keys. **9 languages
  carried drift and were rewritten** (am, cs, es, hr, km, pt, ru, tr, uk); the other 17 already
  reflected current English. Drift kinds fixed: retired "inlet pressure" → current "supply pressure"
  (am/cs/es/hr/km/pt/tr/uk); ip_q_ratio's stale long "separate check" paragraph → current single
  sentence (cs/es/hr/pt/ru/tr/uk); ip_worst_case_warn old long form → short two-sentence
  (cs/es/pt/ru/tr/uk); uk's mhp_notes_2_def dropped-"1–3 m/s band" version → current; cs also fixed a
  garbled-Czech artifact. es/hi "textbook"→"standard" aligned (Tom confirmed negligible/synonymic —
  not swept to other languages). **Pre-sprint sweep for other Wave-0-shortened keys:** commit 7bfbda1
  also shortened mtc_/rc_/mi_ keys, but spot-check (pt `mtc_note_2_def`, `rc_qt`) showed those were
  re-translated in the later full-category waves — drift was concentrated in the ip_/mhp_ keys, which
  ip_ was handled differently from. QA all clean: 9×`php -l`; `lang_syntax_validate` zero hard
  findings (only advisory identical-to-english on unrelated keys); tag-parity (`<sub>`/`<span>`/`<sup>`
  + `q<sub>` symbols) all-match vs English on all 5 keys × 9 langs; entity check clean (no
  double-encode, no bare ampersands); inline back-translation of every rewritten string verified
  against current English. Glossary write-back done (v1.11→1.12: resync note on low-quarter DU entry).


## Task 126

- 0|126| **Suite-wide tooltip markup migration — DONE 2026-07-21.** Migrated the legacy
  inline-styled tooltip pattern (`<span title="..." style="cursor:help;...">?</span>`) to the
  touch-friendly `.ec-help`/`.ec-tip` convention (only `.ec-help[title]` fires tap tooltips in
  `js/Calculators.lib.js`). Audit narrowed the residue to exactly **7 `rc_` (Rock Chute) keys**
  (`rc_D50`, `rc_Hp`, `rc_SD`, `rc_Vm`, `rc_apron_length`, `rc_qt`, `rc_yn`) across **11 languages**
  (ar, bg, de, fr, he, hi, it, pt, ro, uk, zh) — English was already clean (the old "es/ru/zh clean"
  note was wrong: zh was NOT clean). Done with a scripted, idempotent converter
  (`dev/scripts/migrate_legacy_tooltips.php`) that moves each language's translated label text (with
  `<sub>` tags, escaped quotes, `&quot;`, RTL) INSIDE the `.ec-help` wrapper to match English's
  structure — not a pure attribute swap. **76 strings converted, 0 residual.** QA all clean: `php -l`
  on all 11 files, `lang_syntax_validate.php` (only advisory identical-to-english findings on
  unrelated keys, none on the 7 migrated keys), ec-help==ec-tip tag-count parity, byte-level
  spot-check of escaped-apostrophe / `&quot;` / RTL cases against the English structure.


## Task 130

- 0|130| **`odt_` fix + vessel-first rebrand — DONE 2026-07-21.** Authorized by Tom 2026-07-21. One
  26-agent Sonnet sprint (hand-specified key list, because the payload delta is blind to
  changed-English-under-stale-translation — same blind spot as Task 129). English `odt_` identity
  rebranded (menu "Orifice Drain Time" → **"Pond & Tank Drain Time"** Tom-locked; title/desc reordered
  vessel-first, orifice as method qualifier), then re-translated into all 26 languages. am's residual
  `odt_` head→distress calque (ጭንቅ in `odt_h1`, `odt_notes_1_def`) fixed to ሄድ. Bundled riders:
  **Task 127** (mhp_diameter "(supply pipe)" tooltip restored in the 15 langs that lacked it, existing
  penstock terms reused) and **Task 134** unit-token translations (see below). QA all clean: 27×`php -l`,
  `lang_syntax_validate` zero hard findings across all 26 (one he escape-leakage on `u_kgfcm2` fixed
  inline), mhp_diameter tag-parity (ec-help+ec-tip) on all 15, es reach-weighted spot-check, entity
  single-encoding verified (`&mdash;`/`&amp;` correct — an apparent double-encode was just notification
  display escaping). Glossary write-back done (v1.10→1.11: head am-odt fix, orifice ps-odt fix, penstock
  gloss note).


## Task 134

- 0|134| **Units audit + bar/kgf-cm² gap-fill — DONE 2026-07-21.** English side (committed earlier):
  defined `kgfcm2` (0.1 = 1 kgf/cm² per 10 m H₂O), refined `bar` (0.09806), pruned dead
  `atm`/`knpm2`/`knpcm2`; wired `bar`+`kgf/cm²` into all 27 pressure/head dropdowns across 5 calculators
  (shear-stress `tau` left as `npm2`/`psf`); added `u_bar`/`u_kgfcm2` to all 27 files. Regional-norms
  web research drove the add/prune decisions (Tom adopted: add bar+kgf/cm², prune atm as lab-not-water,
  kgf/cm² is the Asia norm). The 26-language `u_bar`/`u_kgfcm2` translations completed as a rider in the
  Task 130 sprint. Numeric check: 30 m H₂O = 2.94 bar = 3.0 kgf/cm² = 294 kPa = 42.7 psi (consistent).
  Design note: units are **universal**, not per-locale (architecture has no per-language dropdown
  customization).


## Task 131

- 0|131| **Translate the 5 trap-term tips into 26 languages — DONE 2026-07-21.** Authorized by Tom
  2026-07-21. Scenario-D slice: 26 Sonnet agents (one per language, run in parallel), 5 keys each
  (`or_head`, `ws_headWaterHeight`, `mpf_velocity_head`, `mtc_sgrock`, `rc_sg`), glossary + `avoid`
  injected; driven off the explicit grep-slice, not the payload delta (stale-but-present keys don't
  surface there). Each agent preserved the existing translated label, added/updated the definitional
  tip in the whole-label `.ec-help`/`.ec-tip` form, and converted `rc_sg` from the old bare-`?`
  inline-style tooltip to the `.ec-help` wrapper where a language still had it (Task 127-style fix for
  the SG label specifically). Post-sprint QA all clean: `lang_syntax_validate.php` (zero
  escape/tag/foreign-script findings; only advisory identical-to-english on unrelated keys),
  structural tag-parity on all 130 strings (exactly one `.ec-help` + one `.ec-tip`, balanced spans,
  subscript parity, no raw ampersands), inline back-translation of every tip. Glossary write-back
  done (`head` + `specific gravity` translation_notes). Findings spun out: am `head` re-verified
  clean (ሄד loanword, no ጭንቅ); he/my `head` label issues re-confirmed open → stay in Task 128; new
  cross-key SG *label* drift (pt/uk/ar/fa/sr) → new Task 133. Labels were preserved throughout —
  tip-only scope.


## Task 128

- 0|128| **Trap-term native-confirmation residue (sw specific gravity + my/he head) — CLOSED 2026-07-21.**
  The specific-gravity portion (hr/sr/it stale-glossary corrections; tr/he/ps weight-flavored standards kept;
  units clean in all 26) was already resolved 2026-07-20/21. The three residual items were closed on Tom's
  2026-07-21 directive that **native review is not realistically available and we defer to the locally natural
  term**: (1) sw `mtc_sgrock`/`rc_sg` "Uzito maalum" KEPT — a weight-flavored local standard parallel to tr
  "özgül ağırlık", internally consistent, dimensionless guard satisfied. (2) my `or_head`/`ws_headWaterHeight`
  "ခေါင်းဆုံး" KEPT — an anatomically-derived head word is NOT inherently wrong (English "head" is itself the
  body-part word); it is a locally natural term, not a defect. (3) he `or_head`/`ws_headWaterHeight` "עומק"
  (depth) KEPT — depth-to-centroid is a physically legitimate reading of orifice effective head, and it is a
  natural term. Upstream fix: the glossary `head` family's blanket `avoid: "anatomical head"` was mistaken and
  was reframed across all 7 entries (`head` root + head loss/gross/net/velocity/weir head/headwater elevation)
  to forbid only *a lazy anatomical calque that is not the local standard* — an anatomically-derived word that
  IS the dominant standard is now explicitly correct. This does NOT revert the documented cs/he/sw velocity-head
  calque fixes (those anatomical renderings were not the natural term there, which the reframed guard still
  catches). Glossary `head` `translation_notes` updated with the full resolution. The 3 intent entries that
  read `avoid: anatomical "head"` (`mpf_velocity_head`, `ws_headWaterHeight`, `or_head` in `lib/lang.ec.en.php`)
  were updated to `| gloss: head` pointers (Tom authorized 2026-07-21), so they defer to the reframed glossary
  guard rather than restating the old blanket avoid.


## Task 133

- 0|133| **Cross-key specific-gravity LABEL consolidation (per-language) — DONE 2026-07-21.** Authorized by
  Tom 2026-07-21. In each of the 5 affected languages `mtc_sgrock`'s divergent weight-flavored label was
  aligned to `rc_sg`'s relative-density-flavored label (which already held this language's dominant glossary
  standard): pt→"Densidade relativa da rocha", uk→"Відносна густина каменю", ar→"الكثافة النسبية للصخور",
  fa→"چگالی نسبی سنگ", sr→"Релативна густина камена". Both calculators now agree within each language (ar
  retains a pre-existing singular/plural difference on the *rock* word only — للصخور vs للصخر — the SG term
  itself is aligned). Tips were already consistent and left untouched (label-only edit, per the task scope).
  `lang_syntax_validate.php` clean on all 5 (only advisory identical-to-english on unrelated keys). Glossary
  `specific gravity` `translation_notes` updated with the resolution. Consolidation happened to align toward
  relative-density because `rc_sg` held the standard in all 5; a weight-flavored standard would be equally
  valid to consolidate toward where it is the dominant term — this does not contradict defer-to-cultural-standard.


## Task 132

- 0|132|[CC] **`$ec_lang_intent` trimming — collapse duplicative definitions to `gloss:` pointers — DONE 2026-07-21.**
  Authorized by Tom 2026-07-20 (the single standing carve-out to the CLAUDE.md intent off-limits rule).
  Audited every non-empty `$ec_lang_intent` left-of-pipe in `lib/lang.ec.en.php` against `glossary.json`;
  trimmed 12 entries whose left-of-pipe merely restated a glossary concept to `| gloss: <term>` pointers,
  preserving all label-level commentary (`layout`/`symbol`/`avoid`) — Tom approved Group A + B:
  `rc_sg` (specific gravity), `rc_Hp` (weir head), `ip_pr` (application rate),
  `mpf_shear_stress` (shear stress; +symbol), `mi_d50in` (median rock size; +layout),
  `mhp_efficiency` (plant efficiency), `mhp_diameter`/`mhp_length` (penstock),
  `rc_notes_6_def` (outlet apron, downstream), `rc_notes_7_def` (weir head, upstream, ponding),
  `u_grade`/`u_gradePercent` (slope; +layout/avoid). Deliberately kept: `rc_apron_length` (label-specific
  toe-support length), `rc_yn` (critical directional guidance), and methodology/identity strings with no
  matching single glossary concept. All `gloss:` targets verified present in the glossary; `php -l` clean.
  English-only — the 26 translated files were not touched.


## Task 125

- 0|125| **Audit `$ec_lang_intent` keys — DONE 2026-07-17.** Two-part audit requested by Tom. Full
  findings in `dev/ec-lang-intent-audit-2026-07.md`.
  1. Swept all 26 non-English `lib/lang.ec.??.php` files for `$ec_lang_intent[...]=` leakage. Found
     leakage in all 26 (110 lines total, all empty-string placeholders — scaffold artifact, not
     authored content). Removed all 110 lines (licensed by CLAUDE.md's own carve-out: the
     AI-permission restriction applies to the canonical English array, not removal of leakage
     elsewhere). All 26 files verified `php -l` clean.
  2. Computed ratio: 129 non-empty English `_intent` entries / 507 `$ec_lang` keys = 25.4% — at
     Tom's "one-fourth" ceiling, not under it. Report bucketed the 129 into: ~30 legitimate (real
     transliteration/polysemy risk, kept untouched), 32 that restated a `gloss:` term inline in
     violation of the tag vocabulary's own "do not restate it inline" rule, 10 plain-symbol
     column-heading restatements missing the `symbol` flag, 3 non-technical tone/mission strings
     with no jargon risk, and 34 `rc_` (Rock Chute) entries that were unflagged leftover prose with
     no named risk. Tom signed off per-bucket: trim gloss entries to bare `'| gloss: ...'` tag form
     (done), trim symbol entries to `'| layout: column heading; symbol'` (done), leave the 3
     tone/mission strings alone (no change), and remove the 34 unflagged `rc_` entries as a scope
     violation (value set to `''`, matching the suite's existing empty-placeholder convention).
     Final ratio: 95/507 = 18.7%, `php -l` clean.


## Task 124

- 0|124| **Shared upstream-HGL/EGL warning for `mphl_`, `dw_`, and `hw_`, fixing `mphl_`'s
  "(See notes)" real-estate problem — DONE 2026-07-16.** Implemented per the finalized UI design
  (Tom, 2026-07-16): a shared `.ec-help`/`.ec-tip` `?` (new key `mphl_hgl_egl_tip`, "May not be
  valid if pipe is high. See notes.") now appears on both the "Upstream HGL" (`hw_hgl_2`) and
  "Upstream EGL" (`mphl_egl_2`) result labels in all three calculators. `mphl_`'s bespoke
  `mphl_hgl_2`/`mpf_see_notes` keys are retired (removed from all 27 lang files); `mphl_` now
  reuses the shared `hw_hgl_2` label like `dw_`/`hw_` already did. `mphl_note_1` gained a new
  first `dt`/`dd` item ("This calculator doesn't account for pipe elevation." / "If the HGL goes
  below the top of the pipe at any point, this calculation may not be valid.") ahead of the
  existing culvert-inlet-control item, and a matching Notes section (`ws_notes_heading` +
  `mphl_note_1`) was added to `Darcy-Weisbach.php` and `Hazen-Williams.php`, which previously had
  none. New/changed key `mphl_hgl_egl_tip` and the updated `mphl_note_1` text are English-only so
  far — not yet sprinted to the other 26 languages (payload delta confirmed via
  `generate_translation_payloads.php`; `mphl_hgl_egl_tip` appears in the fr delta, mixed in with
  unrelated pre-existing untranslated keys from other recent tasks).


## Task 123

- 0|123| **`mtc_`: add a solve-for-depth-given-Q mode — DONE 2026-07-16.** Added a Q-input
  solver above the main form (mirroring `mpf_`'s solve-for-y/d0 UI), with a new
  `EngCalcs.solveForY()` in `js/manning-trap.js`.
  **Scope grew beyond a plain inverse wrapper:** `mtc_` already has its own roughness/rock-size
  auto-iteration (Blodgett/Bathurst/P&I `n`, Isbash/Maynord/Searcy `d50`), both of which are
  functions of depth — so a naive fixed-`n` solver (the `mpf_` pattern) would have silently
  returned a `y` inconsistent with a re-run of that auto-iteration. Tom's call: an honest
  "didn't converge" beats a plausible-looking wrong answer. So the fix instead extracted the
  main form's existing n/d50 iteration loop into one shared, verified function,
  `EngCalcs.Manning.mtc_iterate()` in `js/Manning.lib.js` (used by both the main calculator and
  the solver — no duplicated logic to drift out of sync), and the solver bisects on `y` while
  re-running that full iteration at every trial depth, reporting `mtc_solver_no_solution` if the
  inner iteration or the outer bracket fails to converge. Confirmed Q and y increase together
  for trapezoidal geometry even under auto-iteration (no local peak like `mpf_`'s circular-pipe
  case), so plain bisection is valid; verified numerically (both manual-n and Blodgett+Isbash
  auto-iteration modes recover the seed depth exactly). New lang keys `mtc_solve_for_y`,
  `mtc_solve_desc`, `mtc_solver_no_solution` added to `lib/lang.ec.en.php` only — not yet
  sprinted to the other 26 languages.


## Task 122

- 0|122| **Add Phillips & Ingersoll (1998) Manning's n option to `mtc_` — DONE 2026-07-16.**
  Found this equation (Maricopa County Drainage Design Manual, Hydraulics Volume, Section 7.6.3,
  Figure 7.5) while chasing down Task 120/121's unresolved Bathurst-coefficient gap — it's what the
  manual actually still contains, fully specified with units and a stated applicability range,
  unlike the now-unrecoverable Bathurst formula (see Task 121's follow-up note). Formula:
  `n = 0.0926·R^(1/6) / (1.46 + 2.23·log10(R/d50))`, where **R (hydraulic radius) and d50 are in
  feet** — developed for central-Arizona lower-gradient channels with bed-material d50 ranging
  0.28–0.36 ft (~85–110 mm) in the source dataset; the manual itself calls these equations "a check
  or reference," not a sole design basis.
  **Implementation:** added as a third standalone `n_radio` option (`pi`) in `Manning-Trap.php`,
  alongside `strickler`/`bb` — not folded into the `bb` auto-select logic, which stays untouched.
  `js/manning-trap.js` converts `rh`/`d50_in` from SI meters to feet (factor 3.28084) before applying
  the formula. Added a `pi_range_check` result row (always visible, mirroring the existing
  `blodgett_v_bathurst` check) showing "d50 in P&I range" / "Outside range" via the suite-wide
  ✓/⚠ `EngCalcs.writeCheckHTML` convention, with a tip explaining the 0.28–0.36 ft dataset-range
  extrapolation risk either direction (consolidated into one shared out-of-range string + one shared
  tip, not separate low/high wording, per Tom's simplification request). New keys: `mtc_n_pi`,
  `mtc_pi_range_check`, `mtc_pi_ok(+tip)`, `mtc_pi_out_of_range`, `mtc_pi_tip` — translated into all
  26 non-English languages via the standard 26-agent Sonnet sprint (plus a leftover pre-existing
  untranslated `mtc_blodgett_v_bathurst` picked up in the same delta). Post-sprint QA passed:
  `lang_syntax_validate.php` clean of real findings (identical-to-english flags were all either
  deliberately-literal citation/unit strings or legitimate "vs." constructions), tag-parity verified
  script-wide (one Khmer `<sub>` tag mismatch found and fixed), and inline back-translation review of
  all 26 languages' final values against the English source.


## Task 119

- 0|119| **Offline usage logging (queue-and-flush) — DONE 2026-07-16.**
  `EngCalcs.maybeLogHumanView()`/`maybeLogCalcUsage()` (`js/Calculators.lib.js`) now send via
  `fetch(..., {keepalive:true})` instead of bare `sendBeacon` (sendBeacon's return value only means
  "browser accepted for delivery," not "reached the server," so it couldn't drive retry logic). A
  failed/offline request is queued into an IndexedDB store (`engcalcs-offline-queue`) via the new
  shared `EngCalcs._sendOrQueue()`. The queue flushes on the `online` event, on next page load
  (`EngCalcs.flushQueue()`), and — where Background Sync is supported — from `sw.js` itself via a
  registered `engcalcs-flush-queue` sync tag, so it can flush even with no EngCalcs tab open. Records
  that fail `_QUEUE_MAX_ATTEMPTS` (20) times are dropped rather than growing forever. Design-pass
  question resolved: queued retries carry the *original* client attempt time (`offline_ts`, ISO
  string) rather than the flush time — `log-human-view.php`/`log-calc-event.php` parse and use it
  (clamped to a 0–90 day sane window, else fall back to server "now") so a beacon that finally lands
  hours later logs when the usage actually happened. `sw.js` cache version bumped to `engcalcs-v5`.
  Not covered: `engcalcs-lang.log` (`LANG_LOG`) is written synchronously by PHP on page request, so
  when the SW serves a page fully from cache while offline, PHP never runs and there's nothing
  client-side to queue — that gap is structural, not a queue-and-flush gap, and was out of scope per
  the original task description (which named only the two beacon calls).


## Task 108

- 0|108| **`Install.php` localization — DONE 2026-07-14.** Was 100% hardcoded English body text,
  outside `$ec_lang` entirely — the only working PWA install path on iOS Safari/Firefox, where the
  in-app `⬇ Install` button silently does nothing (Task 95 resolution #1). Executed per the split's
  planned sequence, authorized standalone (not bundled with an upcoming category wave, per Tom's
  call when asked): (1) **Wave 0** — tightened the English body for concision/Simple-English
  compliance while restructuring. (2) Restructured into 15 new `$ec_lang['install_*']` keys (intro,
  Android/iOS/Desktop/Firefox section headings+steps, cached-pages summary), one key set rather than
  a single blob since the Android section interleaves a live install button and inline JS — matches
  `About.php`'s `about_body_html` convention where a single blob fits. Dropped the old hardcoded "16
  calculator pages" count in favor of "all calculator pages" so the text can't silently drift out of
  sync with the actual page count again. (3) Full 26-agent Sonnet translation sprint, scoped strictly
  to the 15 new keys (payload deltas also carried 5–15 unrelated pre-existing keys per language from
  other unfinished work, left untouched per standard scoping precedent).
  **Bug found and fixed while in this file, same session, per Tom's authorization:** `sw.js`'s PWA
  precache lists (`STATIC_ASSETS`/`CALC_PAGES`) were stale — missing `Canal-Seepage.php`,
  `Irrigation-Pressure.php`, `Rock-Chute.php` and their JS files, plus `Install.php` itself, so those
  3 calculators silently didn't work offline after install. Added all missing entries and bumped
  `CACHE_VERSION` to `v4` so installed users pick up the corrected list.
  QA: `php -l` clean on `Install.php`, all 27 lang files, and `sw.js`; `node -c sw.js` clean;
  `lang_syntax_validate.php` shows only advisory `identical-to-english` findings (all legitimate —
  `install_android_heading`/`install_ios_heading` are brand names like "Android (Chrome)" that
  correctly stay untranslated in most languages, same class as pre-existing eponym findings); tag-
  parity script-verified 4-for-4 `<li>`/`<strong>` counts across all 26 languages for the three
  step-list keys; no `&ndash;`/`&mdash;` entity-escaping bugs found; inline back-translation spot-
  check (no `ANTHROPIC_API_KEY` set) across 8 languages spanning Latin/Cyrillic/Arabic/CJK/Devanagari
  scripts (es, fr, de, ru, ar, zh, hi, sw) confirmed full meaning preserved, no dropped clauses, no
  leftover English, natural non-calqued phrasing. Payloads regenerated post-sprint (FRESH).
  **Post-close audit, same day, prompted by Tom questioning Wave 0/1 quality.** Tom specifically
  flagged `install_intro`'s "Once installed, ..." construction as a possible translation-risk word.
  Read all 26 languages' `install_intro` in full rather than assuming: 21 used a clean unambiguous
  "after installation" construction; the other 5 (es, fr, it, ro, plus the Hindi/Urdu/Bengali "one
  time X, after" pattern) rendered "once" via their own language's standard native idiom for it
  (French "une fois que," Spanish "una vez," Italian "una volta," Romanian "odată," Hindi "ek
  baar... ke baad" are textbook grammar for this meaning, not calques) — so the English wording
  itself was not the defect and was left unchanged. Extended the check past just `install_intro`:
  read every language's full `install_*` block and grepped fr/id/it/pt/ro for embedded-English
  false positives (all cleared — native words/established loanwords, e.g. French "menu" is
  original French vocabulary, not a leftover). Found one real defect: **my (Burmese) left the raw
  English word "install" (and browser/prompt/cache/menu/icon/window) embedded untranslated inside
  Burmese sentences across nearly every `install_*` key**, inconsistent with its own
  `install_main_menu` key which already had the correct native word (ထည့်သွင်း) sitting in the same
  file. Re-ran just that one language with an Opus agent (Sonnet had already had one clean shot and
  produced this defect; evidence didn't support redoing the other 25 languages or the English
  source). Independently verified the fix myself rather than trusting the agent's self-report:
  `php -l` clean, tag-parity re-confirmed 4-for-4 for all 3 step-list keys, and a direct read of the
  full file confirmed every ordinary tech-vocabulary word (install/browser/prompt/menu/icon/window)
  is now real Burmese, with only brand names (Chrome, Safari, Firefox, Edge, Android, iOS, EngCalcs,
  PWA) and the heading-position device label "Desktop" left in Latin script — matching the pattern
  already accepted in the other clean headings. Payloads regenerated post-fix (FRESH).


## Task 105

- 0|105| **Scoped and fixed the remaining `mpf_see_notes` stacking sites from Task 101, DONE
  2026-07-14.** Per-site fix shape (confirmed with Tom first, same as Task 104): (1)
  `Manning-Pipe-Flow.php` `q` label — folded `mpf_note_1`'s infinite-pipe/headwater caveat into a new
  `mpf_flow_tip` `?` tooltip (D8 pattern), full note with its tutorial-video link stays visible in the
  on-page Notes section since a `title` attribute can't carry a link. (2)/(3) `Manning-Trap.php`
  `n_in`/`d50_in` radio-button fields — both point at the same integrated iteration workflow
  (`mtc_note_1`), so both got one shared new `?` tip key (`mtc_iteration_tip`) rather than duplicating
  content. (4)/(5) `Micro-Hydro-Power.php` `vel_check`/`hl_check` — turned out to be a different case
  entirely: these are already governed by the D5 verdict-string convention (the check *value* itself
  carries the full explanation via `EngCalcs.writeCheckHTML`'s `ec-tip`), so the `(See notes)` on the
  row *label* was pure redundancy — just deleted, no replacement tip needed.
  While fixing site 4/5, Tom flagged a related live defect found by using the app: `hl_check`'s OK
  branch (`js/micro-hydro-power.js`) skipped `tipText` entirely, showing permanently-visible verbose
  text ("6.8% — within 10% target") with no hover explanation, breaking the D5 short-text+tooltip
  pattern that the warn/bad branches already followed. Fixed for all three states (ok/warn/bad now
  show just the percentage with the full explanation in the tooltip, merging the old
  `mhp_hl_ok`/`mhp_hl_warn`/`mhp_hl_bad` short strings into three tip-only keys), and extended the
  same treatment to `vel_check`'s OK case (added `mhp_vel_ok_tip`) for consistency, per Tom's
  direction. 6 new keys total (`mpf_flow_tip`, `mtc_iteration_tip`, `mhp_vel_ok_tip`, `mhp_hl_ok_tip`,
  `mhp_hl_warn_tip`, `mhp_hl_bad_tip`); `mhp_hl_ok`/`mhp_hl_warn`/`mhp_hl_bad` removed as obsolete.
  Translated into all 26 non-English languages via a 26-agent Sonnet sprint (uk landed before its
  reported session-limit failure, per the session-limit-retry lesson — verified complete rather than
  blindly re-run; zh/ur genuinely needed a retry). Mid-task correction: initially added
  `$ec_lang_intent` entries for the new keys without permission — caught and reverted everywhere
  (en.php and all 26 lang files) per the standing "AI must never touch `$ec_lang_intent` without
  explicit permission" rule; Tom confirmed intent entries aren't needed for these keys ("only needed
  for things like Riprap, Penstock, Head, and Chute... our glossary does much of the work").
  Post-sprint QA: `lang_parity_check.php` clean (0 missing/extra), `lang_syntax_validate.php` clean of
  escape-leakage/tag-imbalance/foreign-script findings, inline back-translation check across all 26
  languages found no semantic drift (proper nouns Blodgett–Bathurst/Isbash correctly preserved or
  transliterated to match each language's pre-existing `mtc_note_1` convention).


## Task 103

- 0|103| **"Penstock" kept as the primary term across all mhp fields, "(supply pipe)"
  disambiguated once rather than repeated, DONE 2026-07-13.** Unlike "riprap" (US slang prone to
  phonetic mistranslation), "penstock" is established international hydraulic-engineering
  vocabulary with real translations in most languages, so full replacement wasn't warranted — but
  per the Simple English policy (explanatory strings should still carry a plain-English anchor), a
  synonym was added once rather than leaving the bare jargon term unglossed everywhere. Scope
  narrowed after review: `e` (roughness) and `km` (minor-loss coefficient) tooltips are *shared*
  generic strings (`dw_roughness_tip`, `mphl_total_junction_k_tip`) reused verbatim across
  Darcy-Weisbach/Hazen-Williams/Manning-Pipe-Head-Loss — left untouched, since injecting "penstock"
  into those would corrupt their meaning in every other calculator that reuses them. Only `D` is
  mhp-owned and names the pipe: `mhp_diameter` = "Penstock diameter, D" with `ec-help`/`ec-tip`
  tooltip "Penstock (supply pipe) diameter" (full disambiguation, once, only place it appears).
  `mhp_length` was simplified to plain "Length, L" with no tooltip and no repeated "Penstock" —
  consistent with `e`/`km`, which are also plain generic attributes that never name the pipe
  themselves; `D` alone anchors what pipe the form is about. Also dropped stale "or flume" wording
  from both fields' visible text, tooltip, and `$ec_lang_intent` (intent edit made with Tom's
  explicit permission per the intent-editing rule) — the calculator only models a closed
  pressurized pipe (Darcy-Weisbach h_f,
  k_m minor losses), so "flume" never fit the physics. `mhp_notes_1_def`/`mhp_notes_3_def` prose
  got "(supply pipe)" added inline on first mention.

  **Full-suite propagation, same day.** Carried the D/L wording change to all 26 non-English
  languages: 21 mechanical (mhp_length simplified to a bare "Length, L"-style label, no tooltip,
  no pipe-name repetition, matching `e`/`km`'s style — done directly, no agent needed) + 5 agent-run
  (am, bn, ru, ur, fa) where the change required real translation judgment. The agent pass also
  uncovered and fixed a real defect while auditing existing translations: **am, bn, ru, and ur had
  phonetically transliterated "penstock"** (ፔንስቶክ / পেনস্টক / пенсток / پینسٹاک) instead of
  translating the underlying "pressure pipe" concept — the same defect class as the earlier
  "riprap" audit. Per Tom's fallback instruction ("if there is no good 'Penstock' translation, use
  'Supply pipe (or line)'"), each agent constructed a natural compositional "pressure pipe" phrase
  (am የግፊት ቧንቧ, bn চাপ পাইপ, ru напорный трубопровод, ur دباؤ پائپ) and added a "(supply pipe)"-style
  synonym gloss once, matching the English mhp_diameter tooltip pattern. fa was already correct
  (لوله فشار (پنستاک) — concept-first with jargon as a parenthetical aside) and only needed its
  `mhp_length` tidied. `dev/scripts/glossary.json`'s stale am/bn/ru "penstock" entries were also
  corrected to match (ur/fa glossary entries were already right — only the shipped lang files had
  drifted). QA: `php -l` clean on all 27 files; `lang_syntax_validate.php --lang=am,bn,ru,ur,fa`
  clean (only pre-existing, unrelated advisory `identical-to-english` findings on rc_/mtc_ keys);
  tag-parity check confirmed identical HTML/symbol structure across all 27 files for
  `mhp_length`/`mhp_notes_1_def`/`mhp_notes_3_def` (the `mhp_diameter` tag differences — tooltip
  present only in en/am/bn/ru/ur — are the intentional design, not a defect); inline
  back-translation semantic check (no `ANTHROPIC_API_KEY` set) confirmed all 5 agent-translated
  strings match source meaning.


## Task 101

- 0|101| **`k_m` label stacking fixed 2026-07-13; `e`/roughness field's identical problem DONE
  2026-07-13 via Task 104.** Surfaced investigating why bg's rendered `km` label looked long
  ("Коефициент на местни (локални) загуби, k<sub>m</sub> (Вижте бележките)"). The length itself
  turned out not to be a bg defect — measured against 12 other languages, bg's
  `mphl_total_junction_k` value (40 chars) sits mid-pack (fr 53, it 48, es 44, ro 41, bg/hr 40,
  sr/ru 39 — all longer or equal; en 33 shortest as expected) — normal Indo-European grammatical
  expansion, not a translation error; already checked once before in Task 96 item (2) sub-item 2
  ("no change" verdict) and re-confirmed here. The real problem Tom identified: regardless of
  per-language length, the *rendered field label* concatenated three things never meant to coexist
  for width: the full noun-phrase label, a bare `<a target="_blank">` link to
  engineeringtoolbox.com with no tooltip, and a trailing `(See notes)` appended outside the link.
  **DONE 2026-07-13 for `k_m`, all 5 call sites** (`Darcy-Weisbach.php`, `Hazen-Williams.php`,
  `Manning-Pipe-Head-Loss.php`, `Micro-Hydro-Power.php` ×2 fields), per Tom's direction: keep the
  hyperlink as-is (style-guide refresh instead of removal — see below), fold `(See notes)` into the
  tooltip rather than dropping it (it points to real, useful typical-value guidance), and shorten the
  visible label. New key `mphl_total_junction_k_short` = "Loss coeff., k<sub>m</sub>" (en) added to
  all 27 languages (26 translated directly by Claude Code, not a full agent sprint — one short
  formulaic phrase derived from each language's own already-translated `mphl_total_junction_k`
  wording, same effort class as Tasks 94/96/99). PHP shape at all 5 sites:
  `<a href="…">{short label}</a><span class="ec-help" title="{strip_tags(full definition)} {see
  notes text}"><span class="ec-tip">?</span></span>` — the tooltip text needed **zero new
  translation**, assembled in PHP by reusing the existing `mphl_total_junction_k` and
  `mpf_see_notes` keys as-is. `php -l` clean on all touched files; `lang_syntax_validate.php` shows
  only the same pre-existing 65 advisory findings, no new issues. Style guide refreshed in
  `dev/label-normalization-decision.md` D8: documents the actual live pattern (short "Word(s),
  symbol" label, not bare-symbol-only, which was tried and reversed for wide forms) and adds the
  rule that a "(See notes)" pointer belongs inside the tip, not as separate permanently-visible text.
  **Left open at the time:** the `e`/roughness field had the identical stacking problem — resolved
  by Task 104. A tail note in this same task also flagged 5 further `mpf_see_notes` stacking sites
  (Manning-Pipe-Flow, Manning-Trap ×2, Micro-Hydro-Power vel_check/hl_check) as unscoped
  reconnaissance, never part of this task's own defined scope (`k_m` bare-link stacking) — tracked
  separately as Task 105, not a blocker on closing this task.


## Task 102

- 0|102| **Generalized `k_m` typical-values guidance for dw/hw/mphl/mhp — DONE 2026-07-13.** Tom
  interviewed and decided: form is option (a), folded into the `k_m` tooltip (`title` text) added by
  Task 101 — not a Notes-section entry, not a new alert/panel. New shared key
  `mphl_total_junction_k_tip` (owner: `mphl_`, per existing incumbency of `mphl_total_junction_k`)
  holds the full definition + typical-values text and is used verbatim at all 4 call sites (dw, hw,
  mphl, mhp), replacing the old `strip_tags($ec_lang['mphl_total_junction_k'])` + (mhp only)
  `mpf_see_notes` composition. mhp's old Notes-section entry (`mhp_notes_4_term`/`_def`) is retired —
  deleted from all 27 language files (plus their empty `$ec_lang_intent` lines, with Tom's explicit
  sign-off since `$ec_lang_intent` edits are otherwise off-limits to AI) — so all 4 calculators now
  have identical `k_m` treatment, per Tom's stated direction to converge the suite on one pattern.
  **Content changed, not just relocated:** exit loss (sudden expansion to reservoir/atmosphere, k≈1.0)
  was missing from the original mhp note's typical-values list even though a "short penstock" framing
  implied one; added on Tom's call after he flagged the gap mid-session. New typical-values list:
  sharp intake entrance 0.5, each 45° bend 0.2–0.3, gate valve (fully open) 0.1, butterfly valve 0.2,
  exit (to reservoir or atmosphere) 1.0. **Default value changed from inconsistent per-calculator
  values (dw/hw/mphl were `10`, a generic placeholder never tied to any worked example; mhp was `1.5`,
  tied to the old "one entrance + two bends" note) to one shared, internally-consistent `2.0`** on all
  4 calculators — derived as the literal sum of the typical-values list for "one entrance + one exit +
  two 45° bends" (0.5 + 1.0 + 2×0.25 = 2.0), so a user reading the tooltip can verify the default by
  adding the listed numbers themselves. Full 26-language translation sprint run (Sonnet, one agent per
  language, scoped strictly to this one key — each payload also carried unrelated pre-existing `ip_`
  deltas from other unfinished work, deliberately left untouched). Post-sprint QA: `php -l` clean on
  all 27 lang files + 4 calculator PHP files; `lang_syntax_validate.php` shows only the same
  pre-existing 65 advisory findings (no new issues, none touching the new key); `<sub>`/`</sub>` tag-
  parity confirmed 4-for-4 across all 26 languages; inline back-translation-equivalent check (no
  `ANTHROPIC_API_KEY` set) confirmed all 6 numeric values (0.5, 0.2–0.3, 0.1, 1.0, 2.0, 45°) present
  in every language's string — no dropped clauses. Payloads regenerated post-sprint (FRESH).


## Task 104

- 0|104| **`e`/roughness field D8 content-and-stacking fix on dw/mhp/ip — DONE 2026-07-13.** Task
  101's flagged gap (identical `dw_roughness_tip` + `mpf_see_notes` stacking left open when `k_m` was
  fixed) closed after interviewing Tom. Decisions confirmed in interview: (1) content — generalize
  the existing mhp Notes-section entry (`mhp_notes_5_def`'s typical absolute-roughness values for
  steel/HDPE/PVC-uPVC/concrete), dropping its mhp-specific last sentence ("HDPE is common for small
  micro-hydro penstocks"), rather than drafting fresh Moody-chart values; (2) `dw_roughness` label
  shrunk from `'Roughness, e'` to bare `'e'` (matches `ip_roughness`, a deliberate Tom-approved
  exception to D8's general "not bare symbol alone" rule, documented as such in
  `dev/label-normalization-decision.md`); (3) full 26-agent Sonnet translation sprint authorized for
  the new `dw_roughness_tip` prose (not a hand-translated short label like Task 101's `k_m` label,
  since this is a full sentence of technical content). Execution: `dw_roughness_tip` changed from a
  baked-in `<span class="ec-help" title="…">` markup string to plain prose text, with the PHP call
  sites (`Darcy-Weisbach.php`, `Micro-Hydro-Power.php`, `Irrigation-Pressure.php`) now assembling the
  tip via `htmlspecialchars(strip_tags($ec_lang['dw_roughness_tip']))`, matching the `k_m` pattern
  from Task 102. `mhp_notes_5_term`/`_def` deleted from all 27 lang files (content now lives in the
  shared tip) along with its `<dt>/<dd>` row in `Micro-Hydro-Power.php`'s Notes section. `dw_roughness`
  set to bare `'e'` directly in all 27 lang files without a sprint (confirmed via `ip_roughness`
  precedent that a bare Latin symbol needs zero translation in any of the 26 languages). Sprint: 26
  agents (Sonnet, one per language) translated `dw_roughness_tip`'s new prose in parallel; one
  (Hindi) ran long and was completed directly (Claude Code) when the delay exceeded other languages'
  completion times — its independent re-run afterwards produced an identical string, confirming the
  direct translation was correct. Post-sprint QA: `php -l` clean on all 27 lang files + 3 calculator
  PHP files; `lang_syntax_validate.php` shows only the same pre-existing 65 advisory findings (no new
  issues); no stray HTML tags introduced in any of the 26 translated strings; inline read-through of
  all 26 strings against the English source confirmed semantic parity (materials, values, and units
  present in every language). **Bug caught and fixed during QA:** cs and he agents used the
  `&ndash;` HTML entity for the value range instead of a literal en-dash character; since the tip is
  passed through `htmlspecialchars()` at render time, `&` would have been double-escaped to literal
  visible text `&ndash;` — corrected to the literal `–` character in both files, then re-verified by
  rendering the PHP call sites directly (`Darcy-Weisbach.php`, `Micro-Hydro-Power.php`,
  `Irrigation-Pressure.php` all confirmed to render the correct tooltip text, `mpf_see_notes` stacking
  confirmed gone from mhp). `dev/label-normalization-decision.md` D8 updated: both known gaps (k_m
  from Tasks 101/102, roughness from this task) marked closed, and the bare-`e`-label exception for
  `dw_roughness` documented as Tom's specific call, not a general D8 rule reversal.


## Task 96

- 0|96|[CC] **DONE 2026-07-13: Task 96 closed — Bulgarian scope question resolved, all 3 sub-items
  addressed.**
  - **(1) CLOSED 2026-07-13 — decided and executed.** Tom: "I would put водно количество
    everywhere." Suite-wide, all bg calculator categories (pipes/irrigation included, not just
    open-channel/hydraulic-structure). Every `дебит` occurrence in `lib/lang.ec.bg.php` (35 across
    dw_/hw_/mpf_/mphl_/mi_/mtc_/ws_/wi_/or_/odt_/irr_/mhp_/cs_/ip_) replaced with `водно количество`,
    with grammatical gender agreement fixed throughout (дебит is masculine, водно количество is
    neuter — adjective/article/pronoun endings adjusted on every occurrence, e.g. `пълен дебит`→
    `пълно водно количество`, `техният дебит`→`тяхното водно количество`). `glossary.json`'s `flow`
    entry bg value updated to `водно количество` and `translation_notes` updated to record the
    resolution (version 1.6→1.7). `php -l` and `lang_syntax_validate.php --lang=bg` both clean.
  - **(2) CLOSED 2026-07-13:** engineer's 2026-07-06 answer — "Коефициент на градация (SD) =
    D₈₄.₁ / D₅₀" — is the standard term, superseding both candidates originally asked about
    (`едрозърнестост` and `разнозърненост`). Applied to `rc_SD`/`rc_SD_check` in
    `lib/lang.ec.bg.php` and recorded in `glossary.json`'s `gradation` entry.
  - **(3) CLOSED 2026-07-13 — resolved via best-effort review, no native review realistically
    forthcoming (Task 90 precedent).** Checked bg menu-title casing: `main_menu`/`main_title`
    across all 12 calculators were already sentence case (only first word + proper nouns
    capitalized), matching the engineer's corrections in `dev/Bulgarian-engineer-feedback.md`
    (e.g. "Проектиране на Каменен Улей" → "Проектиране на каменен бързоток" is a sentence-case
    correction). One real miss found: `index_title` (the site's homepage title, not a
    calculator-specific key) was genuine Title Case with a stray Latin "O" typo
    ("Безплатни Oнлайн Инженерни Калкулатори") — fixed to sentence case ("Безплатни онлайн
    инженерни калкулатори"), matching `ru`'s pattern for the same string. Spot-checked bg's
    `ip_` notes/tooltips for terminology consistency with the suite-wide `водно количество`
    decision (item 1) — clean, no defects found. (Note in passing, out of scope for this task:
    both bg and ru also Title-Case a handful of `<h3>` section headings in `about_body_html`
    (e.g. "Лицензия с Открытым Исходным Кодом") — a separate, suite-wide heading-casing question
    shared across languages, not a bg-specific defect; left untouched.)
  - **New feedback 2026-07-13 from bg engineer, addressed same day:**
    1. Language-menu capitalization: `LANGNAME` for bg was the only lowercase entry
       (`български`) among all 26 non-English languages (every other Latin/Cyrillic entry —
       `Hrvatski`, `Русский`, `Türkçe`, `Українська`, etc. — is capitalized). Fixed
       `lib/Language.Settings.php` to `Български`.
    2. mhp calculator's `e`/`L`/`Km` labels "more verbose than English": checked all three —
       `Km` (`mphl_total_junction_k`, shared with mphl_) was already a fair parallel of the
       English, no change. `e`'s tooltip (`dw_roughness_tip`, shared with dw_) had a genuinely
       extra "по метода на" ("by the method of") that no other language's equivalent tooltip
       carries — trimmed to "Височина на грапавостта по Дарси-Вайсбах". `L` (`mhp_length`) had
       expanded the main label into a full descriptive phrase ("Дължина на напорния
       тръбопровод, L") where English keeps it terse ("Length, L") and pushes detail into the
       tooltip — shortened the label to "Дължина, L" and applied the engineer's own suggested
       tooltip wording ("Дължина на провеждащия тръбопровод или улей", dropping the redundant
       "подвеждащия (входен)" parenthetical). `php -l` and `lang_syntax_validate.php --lang=bg`
       both clean.


## Task 97

- 0|97|[CC] **DONE 2026-07-13: Task 97 closed — tr riprap term unified on "taş dolgu".** Tom had no
  way to adjudicate the Turkish-native judgment call himself ("I have no way of helping... you will
  have to do your best"), so resolved via an Opus pass reasoning from suite convention rather than
  native review: the English source treats "riprap" as one concept in all 5 spots (bulk material
  and D₅₀ particle-size sizing alike), and every other language (es "enrocado", fr "enrochement",
  pt "enrocamento", ru "каменная наброска") uses one bulk-material term throughout rather than
  switching to a particle/fragment word for the sizing context — Turkish should match. Verdict:
  "parça taşı" ("piece stone"/rock fragment) is not a real Turkish hydraulics term for riprap;
  "taş dolgu" ("stone fill") is the established DSİ/TS term (cf. "taş dolgu baraj" = rockfill dam)
  and already matched `mtc_bend_angle` (category 1, incumbent) and `glossary.json`. Replaced all 4
  `rc_` occurrences (`rc_apron_length`, `rc_notes_1_def`, `rc_notes_3_def`, `rc_notes_6_def`) with
  grammatically correct "taş dolgu" inflections (genitive "taş dolgunun" where the original had
  possessive "parça taşının"; bare attributive "taş dolgu" elsewhere) — not a blind find-replace,
  since Turkish compound/genitive suffixes differ by construction. `php -l` and
  `lang_syntax_validate.php --lang=tr` both clean. No native Turkish review has occurred; this
  stands as our own best-effort resolution (per the Task 90 native-review precedent), not a
  pending "awaiting review" item.


## Task 99

- 0|99|[CC] **DONE 2026-07-13: Task 99 closed — removed broken `mph` option from
  `Manning-Irregular.php`'s velocity unit select.** `echoUnitSelect($name='v617u', ...)` offered
  `mps`/`ftps`/`mph`, but `mph` has no backing `$ec_units['mph']` conversion factor or
  `$ec_lang['u_mph']` label — the option rendered broken. Only one live occurrence found (the
  original roadmap note said "two"; the second no longer exists). Fixed by dropping `mph` from the
  Array, matching the `mps`/`ftps`-only pattern used by every other velocity selector in the suite
  (verified against `Irrigation-Pressure.php:107`, the only other velocity selector). `php -l` clean.


## Task 95

- 0|95|[CC] **DONE 2026-07-13: Localization-bypass audit findings, 2026-07-12 (Tom's "holistic
  closing audit" for Task 91 surfaced this gap class — hardcoded strings that never route through
  `$ec_lang`, so no translation-quality pass would ever catch them).** Two content pages exist
  entirely outside the localization system, unlike `About.php` (which correctly routes its body
  through `$ec_lang['about_body_html']`):
  - `Install.php` (66 lines, PWA install instructions) — 100% hardcoded English body.
  - `Orifice-Drain-Time-Ref.php` (786 lines, equation derivation reference) — 100% hardcoded
    English body; also linked from `Orifice-Drain-Time.php:47` via a hardcoded "Derivation"/
    "Equation derivation" link.
  Three scope questions, all resolved 2026-07-13 (Tom):
  1. **`Install.php`: translate it — moved to Task 100.** Tom's instinct was that it might be
     redundant now that there's an in-app `⬇ Install` button (`EngCalcs.installPWA()`,
     `js/Calculators.lib.js:29`). Checked and it isn't: that button only fires on browsers that
     support `beforeinstallprompt` (Chrome/Edge), so it's silently useless on iOS Safari and
     Firefox — which is most of Install.php's content (the iOS Share-menu steps, the "Firefox
     doesn't support PWA install" note, the "what gets cached" explainer). Install.php is the only
     working install path for those platforms, so it stays in scope and needs translating like any
     other user-facing page. Execution (wave-0 English cleanup, then translate) split off as
     **Task 100** rather than folded into this closure, since a 66-line page + a 786-line reference
     page is a real undertaking, not a quick sub-item.
  2. **`Orifice-Drain-Time-Ref.php`: English-only, permanently — including the "Derivation" /
     "Equation derivation" link text.** 786 lines of equation-manipulation prose ("integrating both
     sides," "substituting into," "rearranging yields") has a much higher mistranslation-consequence-
     per-word ratio than UI labels — a wrong verb tense changes what the math claims — and
     translating it right would be its own sprint for a page most users never open. English-only
     reference links are a normal pattern (engineering software routinely links out to English-only
     derivations/papers). No further action.
  3. **`Manning-Trap.php` radio labels (`Strickler`/`B/B`, `Isbash`/`Maynord`/`Searcy`): leave
     untranslated.** These are the surnames of the formulas' originators (citations, not descriptive
     text). Confirmed this matches existing suite convention — `lib/lang.ec.ar.php` and
     `lib/lang.ec.zh.php` already keep "Manning," "Darcy-Weisbach," and "Hazen-Williams" in Latin
     script inline even in RTL/CJK text (zh glosses with a transliteration once, then reverts to
     plain Latin). No script-rendering need; no code change.
  `Compare-Languages.php` and `formmail.php` are internal/dev-utility pages, not user-facing app
  content — out of scope, no action needed.


## Task 94

- 0|94|[CC] **DONE 2026-07-13: Task 94 closed — orphan-key full-suite housekeeping.** Ran
  `dev/scripts/lang_parity_check.php` across all 26 non-English lang files to get the authoritative
  "extra" (present in translated file, absent from English source) list: 30 keys — `cs_notes_1_term`,
  `cs_notes_4_term`, `cs_wp`, `ip_e`, `ip_hv`, `ip_notes_1_term`, `ip_notes_4_term`, `ip_v`, `mhp_f`,
  `mhp_flow`, `mhp_hf`, `mhp_hl`, `mhp_hm`, `mhp_km`, `mhp_nu`, `mhp_roughness`, `mhp_velocity`,
  `mi_notes`, `mtc_vel_check`, `mtc_vel_high`, `mtc_vel_high_short`, `mtc_vel_low_short`,
  `mtc_vel_ok_short`, `odt_h_orifice`, `or_flow`, `or_velocity`, `wi_elevation`,
  `wi_headWaterelevation`, `wi_notes_we_term`, `wi_station`. Verified each with a word-boundary grep
  across all PHP/JS before deleting — two looked live at first grep but turned out to be false
  positives on the identical string used for something else: `cs_wp` is a form-field `name`
  (labelled via the shared `mpf_wetted_perimeter` key, not its own), and `mtc_vel_high` is a JS
  `pageConfig` variable name fed from `$ec_lang['mhp_vel_high']`, not `$ec_lang['mtc_vel_high']`.
  Deleted both the `$ec_lang[...]` and `$ec_lang_intent[...]` lines for all 30 keys from all 26 files
  (759 lines total; English file untouched since these keys never existed there). Also fixed 4 stale
  references to the same dead keys (`or_flow`, `mhp_flow`, `mhp_hf`, `mhp_hm`) in
  `dev/scripts/glossary_compliance_audit.php`'s `TERM_KEYS` map, which had been silently no-op-ing on
  them. `php -l` clean on all 28 touched files; `lang_parity_check.php --strict` now reports
  `extra: 0` suite-wide (was 759 nonzero across languages); `lang_syntax_validate.php` clean (only
  pre-existing, unrelated `identical-to-english` advisories).


## Task 93

- 0|93|[CC] **DONE 2026-07-13: Task 93 closed — cross-language glossary reconciliation pass.**
  Checked `glossary.json`'s `preferred_translation` against actual shipped lang-file usage for the
  5 terms flagged by independent category-5-wave-1 agents (it, pt×3, ru, tr). Confirmed 6 genuine
  glossary-stale entries and updated them to match the incumbent, internally-consistent file terms:
  it riprap `scogliera`→`pietrame`; pt penstock `conduto forçado`→`conduta forçada`; pt plant
  efficiency `eficiência da usina`→`rendimento da instalação`; pt gradation `granulometria`→
  `graduação`; ru penstock `напорный трубопровод`→`пенсток`; tr penstock `basınç borusu`→`cebri
  boru`. hr rock chute (`kameni skluz` vs shipped `kameni žlijeb`) was left as-is — glossary already
  flagged it "NEEDS HUMAN REVIEW" pending a decision on whether the *file* should change to parallel
  sr/ru (`kameni brzotok`), not the glossary, so out of scope for a glossary-only reconciliation.
  Along the way found one case where the glossary was actually right and the file had drifted (tr
  riprap, `taş dolgu` vs `parça taşı`) — logged as a new item above rather than silently editing
  shipped translated sentences. No lang files changed; `glossary.json` only (version 1.5→1.6).


## Task 92

- 0|92|[CC] **DONE 2026-07-13: Task 92 closed — whole-label hover/tap target for tips.** Added
  `.ec-help { cursor: help; }` to `css/engcalcs.css`, updated the Bootstrap tooltip-init selector in
  `js/Calculators.lib.js` to also match `.ec-help[title]`, and mechanically migrated all 956
  `class="ec-tip"` occurrences across all 27 `lib/lang.ec.*.php` files to the
  `<span class="ec-help" title="…">Label <span class="ec-tip">?</span></span>` pattern (title moved
  from the inner span to the wrapper; inner `.ec-tip` markup/CSS unchanged, so it stays non-breaking).
  Fixed one pre-existing bug found along the way: `lib/lang.ec.sr.php` `rc_apron_length` had a raw
  unescaped `"` inside its `title` attribute (should have been `&quot;` like the English/Russian
  versions) which would have broken the HTML attribute boundary — corrected to `&quot;`.
  `$ec_lang_intent` entries were untouched. `dev/scripts/lang_syntax_validate.php` clean (only
  pre-existing, unrelated `identical-to-english` advisories); `php -l` clean on all 27 files.


## Task 91

- 0|91|[CC] **DONE 2026-07-12: Task 91 closed — complete re-translation of every calculator category
  into all 26 languages, category by category** — rules & sequence in
  `dev/translation-process.md` Scenario C, mechanics in CLAUDE.md § "Translation Sprints."

  | # | Calculator category | Prefixes | Status |
  |---|---------------------|----------|--------|
  | 1 | Open channel | `mtc_`/`mi_` | ✅ closed — 3 waves + holistic Opus pass |
  | 2 | Weirs & orifices | `ws_`/`wi_`/`or_`/`odt_` | ✅ closed — 3 waves + holistic Opus pass |
  | 3 | Pipe friction | `dw_`/`hw_`/`mpf_`/`mphl_` | ✅ closed — 3 waves + holistic Opus pass |
  | 4 | Irrigation & seepage | `cs_`/`irr_`/`ip_` | ✅ closed — 3 waves + holistic Opus pass |
  | 5 | Micro-hydro | `mhp_`/`rc_` | ✅ closed — 3 waves + holistic Opus pass |
  | 6 | Shared UI/units | `u_`/`calc_`/`menu_`/`points_` | ✅ closed — delta sprint + holistic pass |

  Category 6 didn't get a full 3-wave re-translation — a read-only assessment found its existing
  content already high quality (translated organically, never stale), so per the SOP's
  cost-scoping note the lightest rung that covered the risk was used instead: a delta sprint for
  the genuine gaps plus a holistic Opus pass. Full dated execution history:
  `dev/translation-execution-log.md`. Open threads spun off as their own standing items rather
  than closed with this task (Task 93 glossary reconciliation, Task 94 orphan-key housekeeping,
  Task 90 native-review backlog, Task 89 D50 median fix, Task 88 verdict-glyph sweep) were all
  separately closed 2026-07-13. The two suite-wide prerequisites this task depended on — **Wave 0**
  English reform and **Task 87** key consolidation — both ran once, up front, ahead of this task
  (see their own Completed entries).


## Task 90

- 0|90|[CC] **DONE 2026-07-13: Task 90 closed — native-review backlog resolved by best-effort
  verification instead of waiting for a native reviewer (Tom's call: "it's pie-in-the-sky to wait for
  human review that may never come").** Ran a research pass over every flagged concern for
  am/km/my/ps/sw plus the he/hi/ur/ps/ur concerns named explicitly, checked current lang-file
  values against the concern, and fixed what could be fixed without inventing new risk:
  - **The ps/ur "shear"=scissors false-cognate concern fully closed.** `mpf_shear_stress` was already
    fixed in both languages; `mi_tau` (category 1) was the one instance still carrying the literal
    scissors word (`قیچي` ps / `قینچی` ur). Changed both to `برش` (the shear/cut-noun root already
    established as correct in each language's own `mpf_shear_stress`), keeping the existing `<br />`
    column-heading layout. `php -l` clean on both files.
  - **sw `or_hwe`/`or_twe` asymmetry fixed.** Was `'Kiwango cha maji juu ya mlango'` (level of water
    above the gate) paired with `'Kiwango cha maji ya mkia'` (level of the tail-water) — two different
    grammatical constructions where every other language (fr amont/aval, es arriba/abajo, ar
    علوية/سفلية, hi अपस्ट्रीम/डाउनस्ट्रीम) uses a parallel pair. Changed `or_hwe` to
    `'Kiwango cha maji ya kichwa'` (head-water), mirroring the existing `mkia` (tail-water) — now a
    parallel head/tail pair matching the English metaphor exactly, minimal change to the established
    `mkia` term.
  - **km/sw `mpf_shear_stress` action-noun root verified, not a defect.** Checked the actual root
    words: sw `mkato` (a cut/incision, from *kata* "to cut") and km `កាត់` (the verb "to cut") are
    action/process nouns, not the scissors-tool nouns (sw `mkasi`, km `កន្ត្រៃ`) — the same
    non-error class as Arabic's own standard `إجهاد القص` and Hebrew's `מאמץ גזירה`, both built on
    cutting roots and both accepted engineering terms. Confirmed distinct from the real
    scissors-tool trap above; left as-is.
  - **ps `rc_sg`/he `rc_sg` "specific gravity" glossary check.** ps's glossary.json entry
    (`ستومانه وزن`, literally "heavy weight") was stale and did not even match the file's own
    already-correct term (`ځانګړی ثقل`, the standard Perso-Arabic scientific term parallel to
    English's own "gravity" naming) — glossary corrected to match the incumbent file term, same
    pattern as Task 93. he's `משקל סגولی` ("specific weight") verified as the standard Hebrew
    physics-curriculum term for this ratio, same accepted local-practice exception already
    documented for tr/özgül ağırlık/sr/hr — added to that exception list in glossary.json rather
    than "corrected" into an error.
  - **Discovered and left alone (out of scope):** am's `mhp_flow`/`mhp_roughness`/`mhp_km`/`mhp_nu`/
    `mhp_velocity`/`mhp_f`/`mhp_hf`/`mhp_hm`/`mhp_hl` keys don't exist in `lib/lang.ec.en.php` at all
    and aren't referenced by `Micro-Hydro-Power.php` — dead orphaned keys unique to the am file, not
    a translation defect. Left for a future dead-key cleanup pass (Task 94 territory), not touched
    here.
  - **Left open, genuinely needing a fluent reviewer (documented, not fixed):** am `mi_tau`'s shear
    rendering (`ሸርፍ`) — plausible but I can't independently confirm Amharic engineering usage; km's
    `mtc_vel_low` sedimentation word choice, `wi_pondingHeight`, the kept-in-Latin-script
    "re-entrant" in `or_notes_3_def` and "Micro-Hydro" in `mhp_main_title`; my `ws_headWaterHeight`
    phrasing; ps register in `or_notes_3_def`/`odt_notes_2_def`; sw's unnamed "tooltip phrasing" flag
    (no specific key was ever recorded, so nothing to act on) and its incumbent-vs-glossary term
    choices (already correctly kept per the incumbency principle, a Task 93 question not a Task 90
    one).
  - **QUALITY scores intentionally left unchanged** (am/km/my/ps/sw stay at `0.65`). Per Tom's framing,
    the low score itself is the honest, permanent "needs review" flag — it wasn't earned by full-suite
    independent back-translation coverage (only these specific flagged concerns got a second look), so
    bumping it now would overstate verification depth. Per CLAUDE.md's tier policy, `0.65`→`0.85`
    requires the full back-translation-checked + cross-language-consistency-checked treatment across
    the whole file, not a targeted patch.


## Task 89

- 0|89|[CC] **DONE 2026-07-13: Task 89 closed — D50 "median" mistranslation resolved via 12-language
  research vote, not native review.** Tom's call: since no native reviewer was available, research
  each flagged language's actual geotechnical/sedimentology literature (web search) to see how the
  vote leans overall, rather than blocking on human input per language. Spawned one research agent
  per language for bg/cs/de/hr/ro/ru/sr/tr/uk/fa/ur plus am (added per Tom's steer: "it's certainly
  not as though nobody can do real math in Amharic"). Result: 7 of 12 (de/cs/uk/tr/fa/ur/sr) had a
  directly-cited real median term in that language's technical literature — genuine errors, fixed.
  2 (bg, uk) turned out to already be correct in the actual lang files (glossary.json was simply
  stale — same pattern as Task 93); 2 more (hr, ro) were likewise already correct in-file. Only
  am had no distinct median-vs-average term in circulating usage at all (confirmed even by Amharic
  dictionaries) — left unchanged, nothing more correct to fix it to. Edited `mi_d50in`/`rc_D50`/
  `rc_notes_1_def` in lib/lang.ec.{de,cs,ru,tr,fa,ur,sr}.php and refreshed glossary.json's `median
  rock size` entry (translations + a dated research note) to match. `php -l` clean on all 7 touched
  files; `lang_syntax_validate.php` shows only pre-existing, unrelated `identical-to-english`
  advisories. Full per-language findings and citations in the conversation record.


## Task 88

- 0|88|[CC] **DONE 2026-07-12: Task 88 closed — suite-wide baked-in verdict-glyph sweep.** Ran the
  mechanical grep the item called for across every verdict-string key actually passed as
  `writeCheckHTML()`/`writeVelocityCheck()`'s `shortText` argument (27 keys spanning
  `mhp_vel_*_short`, `or_regime_*`, `mhp_hl_*`, `odt_h2_*`, `cs_loss_negative`/`cs_Ec_*`, `rc_pond_*`/
  `rc_eq_warn_*`/`rc_sg_*`/`rc_SD_*`, `ip_elev_ds_missing_warn`, `ip_pressure_warn_short`) against
  all 26 non-English lang files for baked-in ✓/⚠/×/etc. glyphs or translated "Warning:"/"OK:"
  prefixes. Zero matches — the category-2/5 instances already fixed were the only real occurrences;
  category 1's previously-unchecked `mtc_vel_*` consumers are clean. Full method and results:
  `dev/translation-execution-log.md`, 2026-07-12 entry.


## Task 87

- 0|87|[CC/H] **DONE 2026-07-07: Concept-level label normalization (design exploration; raised by Tom 2026-07-06).** The original design attempted to economize by using atomized language variables at the *word* level, which made both translation and maintenance hard. Explore revisiting economizing by normalizing at the *concept* level instead: adopt one canonical, reusable label per concept — borrowed from whichever existing calculator has a good set — rather than per-calculator wording. First candidates to review critically: (a) **elevation** — use identical label wording wherever any calculator asks for an elevation, with the tooltip optionally broken into a few per-context variants; (b) **length** — drop the qualifier ("channel"/"reach"/"pipe") from "channel length"/"reach length"/"pipe length" and lean on the page title for disambiguation. Payoff: shrinks the translation surface and eases maintenance across the suite. Do a reuse-candidate audit before committing. Model split: Fable for the cross-calculator language survey; Opus/Tom for the reuse-architecture decision. Priority number provisional.
  - **Fable survey DONE 2026-07-07 → `dev/label-normalization-survey.md`.** Key findings: cross-prefix borrowing already exists (Darcy-Weisbach.php uses mpf_/mphl_/hw_ keys), so the decision is ownership policy, not mechanism; ~18 exact-duplicate keys mergeable with zero wording decisions (incl. the 7-key mtc_/mhp_ velocity-check block); strongest wording cluster is the head-loss triad + minor/junction-loss coefficient across mphl_/mhp_/ip_; candidate (a) elevation supported as shared-bare-key + closed qualified set (Orifice Flow needs 4 distinct elevations on one page, so bare-only is too strong); candidate (b) length supported for mphl_/mhp_ only — keep "Reach length" (cs_) and "Weir length" (ws_) as load-bearing. Survey §6 has the ranked shortlist.
  - **Opus/Tom architecture decision DONE 2026-07-07 → `dev/label-normalization-decision.md`.** Six rulings: **D1** borrow-from-owner, no neutral prefix, **menu order** breaks ties (`mpf_→mphl_→hw_→dw_→mtc_→mi_→rc_→mhp_→or_→odt_→ws_→wi_→cs_→ip_`); **D2** menu order picks the surviving *key*, best cluster wording picks its *value*; **D3** "**Minor (local) loss**" canonical (merges mphl_ "junction loss" + mhp_/ip_ "minor loss"; rename `mphl_total_junction_k`); **D4** lowercase loss symbols `h_f`/`h_m`/`h_L`, coeff `k_m`, capital `H` reserved for total/gross/net head; **D5** verdict strings = leading `✓`/`⚠` glyph (decorative, untranslated) + short text, **whole string is the `ec-tip` tooltip target** (fixes `writeVelocityCheck`'s glyph-only tap target); **D6** merges execute **per category, just before its Wave 0/wave-1** (not one suite pass), so each shrinks the paid sprint that follows. Recorded in glossary.json (v1.4: minor⇄local, lowercase loss symbols) and CLAUDE.md (Concept-level label reuse + Verdict convention subsections). **Execution backlog (8 items, ranked value÷risk)** — see decision doc's "Execution backlog" and §6 of the survey. (Ruling **D6 was REVERSED 2026-07-07** — see next bullet; it originally, wrongly, handed execution to Task 91's per-calculator-category loop.)
  - **CORRECTION 2026-07-07 (Tom + Opus) — Task 87 REOPENED as a standalone, FULL-SUITE project; ruling D6 REVERSED.** Closing Task 87 as "decision-only" and routing its merges through Task 91's per-calculator-category loop was the mistake that poisoned Task 91. Key consolidation is inherently cross-cutting: a duplicate label's two halves live in *different* calculator categories, so no per-category view can make the merge/ownership call (proved this session — open-channel's merge candidates were shared with weirs, irrigation, and micro-hydro). **New structure:** Task 87 = **one English-only pass over ALL calculators**, executed by **Opus** (context-hot; this is architecture/sequencing, not a linguistic sweep; Fable's survey is already done). It is a prerequisite English-reform step, **decoupled from Task 91**; the merge step that had been inserted into Task 91's per-category loop is removed. **Corrected end-to-end sequence:** (1) Task 87 full-suite key consolidation [Opus, English-only, applies D1–D5 + D7 merge method] **+** Wave 0 colloquialism cleanup for the remaining calculator categories [Fable] → (2) **translation tier/wave 1 (anchors) — INTERACTIVE**; translating into cognates is how we still catch garbage English, so wave 1 may still reform the source → (3) **English then FREEZES for tiers/waves 2+** → complete re-translation of waves 2–3 [major non-Latin → low-resource; full backtranslate + native-review QA] → (4) build the §10.5 per-key English **source-hash LAST** (deferred: with a complete re-translation there is nothing to delta-gate *this* pass; the hash earns its keep only for *future* incremental English edits). Terminology throughout: **"calculator categories"** (the 6 calc groupings; Tom's word, 2026-07-07) vs **"translation tiers/waves"** (language groupings) — never bare "families". The tips standard (blue `?` affordance + whole-label hover/tap target) is split off as its own item under CSS Standardization Follow-up. **Scope reminder (Tom, 2026-07-07): Task 87 is NOT finished until the ENTIRE survey (`dev/label-normalization-survey.md`, §1–§6) is addressed** — executed or explicitly dispositioned keep-as-is. Progress is tracked row-by-row in **`dev/label-normalization-tracker.md`** (the completion gate: every row ☑/◇, 5 open wording decisions ruled, QA clean). The exact-duplicate merges (§2) are only the first of ~10 survey areas. **Status:** roadmap decoupled 2026-07-07; tracker built; 5 open wording decisions surfaced (velocity-shorts, elevation owners, roughness-`e`, weir "height"vs"head", S₀↔S_f safety) — resolve those, then execute top-to-bottom on Opus.
  - **DONE 2026-07-07 — full execution complete, every `dev/label-normalization-tracker.md` row ☑/◇.** §1–§3 (ownership policy, ~18 exact-duplicate merges, 8 concept clusters) executed in prior sessions this same day. §4 typography ride-alongs: area symbols standardized to uppercase `A`/`A₀` (owner incumbency over mpf_'s lowercase `a`), `Q₀`/`z₁`/`z₂` given proper `<sub>` subscripts, Froude `F`→`Fr`, `tau`→`&tau;`, `mi_hv617` `H_v`→`h_v` (incl. its `$ec_lang_intent`, Tom-authorized), and all 10 remaining `style="cursor:help;color:#06c;…"` spans (mtc_/rc_) converted to `class="ec-tip"`. §5 verdict convention (D5): new shared `EngCalcs.writeCheckHTML(ok, shortText, tipText)` in `js/Calculators.lib.js`; `writeVelocityCheck` rewritten so the whole string (not just the ⚠ glyph) is the `.ec-tip` tap target. The other 5 ad-hoc verdict groups (`or_regime_*`, `odt_h2_*`, `cs_loss_*`, `mhp_hl_*`, `rc_sg_*`/`rc_SD_*` — the latter rode along, same defect as `rc_sg_*` though not separately listed in the tracker) had their baked-in long strings split into a short label + new English-only `*_tip` key per D7. QA: `php -l` + `node --check` clean on every touched file, `lang_syntax_validate.php` clean, all touched calculator pages render with no fatals via CLI PHP. New `_tip`/split keys show as "missing" in the 26 non-English files — expected propagation worklist for Task 91 (D7), not a defect.


## Task 77

- 0|77|Irrigation Pressure calculator (`Irrigation-Pressure.php`, prefix `ip_`) — English-only build of the distributary-network/irrigation-branch hydraulics calculator spec'd out in a 2026-07-04 design session, substantially reworked the same day through extensive live testing and feedback (37 rounds of comments). Description settled on "Test Branch Pressure and Uniformity Estimate."

  **Core model:** a single flat reach table where each row is independently a Main reach (flat draw = design flow × the reach's own total emitter count — every OTHER lateral branching from that reach; for the reach right at the test lateral's own takeoff, this also includes any laterals beyond that point along the main or sharing the same junction, e.g. an opposite-side lateral, since their flow branches from that same reach too) or a Lateral reach (per-emitter `q = k·H^x` draw, friction loss reduced by Christiansen's F(n) for multi-outlet reaches). Solves by guessing the last (most remote) emitter's pressure and bisecting it against the entered supply pressure, marching the Energy Grade Line backward reach-by-reach — same bisection shape as `js/manning-pipe-flow.js`'s `solveForDd0`. Elevation modeled via a proper EGL march (extension beyond the original spec, which had no elevation term): EGL only ever drops by friction+minor loss; actual nodal pressure is backed out using each row's own elevation and velocity. One downstream-node elevation input per row (optional/defaults-to-flat on interior rows, load-bearing on the last row) plus one global supply elevation. Terminology settled through testing: "test path"/"test lateral" (not "critical path"), "last emitter" (not "critical emitter").

  **Uniformity methodology reworked significantly after live discussion**, not just built once: initially compared the last emitter's flow against the manufacturer's design/rated flow, but that's not standard practice — real low-quarter DU divides by the sampled population's own mean, never an external rated value. Settled on `q_last/q_avg_field` (`du_estimate`), where `q_avg_field` is the test lateral's own modeled average corrected by a user-entered `dp_avg` ("estimated pressure difference, average vs. test lateral," default 0). The correction exists because the test lateral is deliberately the presumed worst case, so its raw average is a biased-low stand-in for a true field average — `dp_avg` lets a motivated user correct for that bias, feeding both the uniformity check and the Application Design section below. Kept `q_last/q_design` (`q_ratio`) as a separate, explicitly non-uniformity diagnostic for "how far is this system running from its design point." Added a worst-case sanity warning: if the solved last-emitter pressure reaches or exceeds supply pressure, flags that the modeled path likely isn't the true worst case. Deliberately did not attempt an interpolated low-quarter DU (per-emitter pressure interpolation within each lateral row) — reconsidered and deferred, since the model lacks the elevation and length resolution to do that honestly.

  **Application Design section added**, ported from `Drip-Sprinkler.php`'s formulas and reusing its `ds_*` labels: spacing (`Se`/`Sl`) and system-wide lateral/emitter-count inputs feed precipitation rate, system/zone flow, and runtime, using the corrected `q_avg_field` instead of a manually-guessed rate.

  **Shared-library bugs found and fixed during this build** (benefit every calculator using these patterns, not just this one): `js/Calculators.lib.js`'s `addCalcRow` never applied initial values to checkbox/radio row inputs; a `points_data`-textarea null dereference when a calculator's table omits the copy/paste feature; `loadFromUrl` could crash assigning `.value` to a non-Element when a field name collided with a reserved DOM collection property (e.g. `length` shadowing `HTMLFormControlsCollection.length`); `js/Cookies.lib.js`'s `cookieToForm` had no detection for a stored cookie no longer matching the current page's field layout — now bails cleanly to reinitialize instead of crashing or partially populating.

  Reused existing precedent throughout rather than inventing new architecture: `Manning-Irregular.php`'s dynamic add/remove row table (`EngCalcs.addCalcRow` etc. in `js/Calculators.lib.js`) and `js/darcy-weisbach.js`'s 3-regime friction factor. Deliberately dropped for this pass: the points-data copy/paste bulk-edit textarea (kept add/remove single-row controls only) and a sketch/diagram. Deferred/out of scope: pump-curve supply boundary (fixed inlet pressure only), a dedicated pressure-compensating-emitter toggle (usable today via the free `x` exponent input), and the 26-language translation sprint (English only; `$ec_lang_intent['ip_*']` left blank per the sprint process, not yet run — see the separate symbol-convention roadmap item, H-vs-P and q-vs-Q, to resolve before that sprint). `php -l` and JS syntax clean on all touched/new files throughout.


## Task 318

- 85|318| **The offline promise is FALSE: the service-worker asset precache is dead code.**
  Found by a smell-test pass, 2026-08-14, and verified. `sw.js` precaches 25 bare paths
  (`/engcalcs/js/looped-network.js`); every page requests those assets with `?v=<filemtime>`; and
  `cacheFirst()` uses `caches.match(request)` — **exact URL, query included**. So the 22 CSS/JS
  entries can never be served. Only the 3 query-less icons work.
  - **`networkFirst()` strips the query and `cacheFirst()` does not**, which is why PAGES cache
    correctly and assets do not. A page visited online does work offline, because its assets are
    then cached at runtime under their real `?v=` URLs. What is dead is the PRECACHE — the
    "visit one page, get all the calculators" promise.
  - **It is a false claim on the About page**, aimed at exactly the audience the mission names:
    `about_body_html` says *"Visit any calculator page while connected… After that, all calculators
    work offline."* `Install.php` says the same. Either make it true or stop saying it.
  - **The fix is a design choice with a real cost either way.** `{ignoreSearch: true}` makes the
    precache live but permanently defeats `filemtime` busting — stale JS forever, which is worse.
    **Generate `sw.js` from PHP** so precached URLs carry the same `filemtime` the pages request.
    That is the recommended route and it also retires `CACHE_VERSION`.
  - **Two hand-maintained lists have already drifted, and would still be wrong after the fix.**
    Missing assets: `PipeHydraulics.lib.js`, `branched-network.js`, `lpn-geom.js`, `lpn-collide.js`,
    `lpn-inp.js`, `lpn-net.js`. Missing page: **`Branched-Network.php` — a whole shipped
    calculator**. Note `hazen-williams.js` is precached while its dependency `PipeHydraulics.lib.js`
    is not: the list is INCOHERENT, not merely short.
  - **`sw.js` is an undocumented FOURTH place a new lpn module must be registered.** CLAUDE.md names
    three (`Looped-Network.php`, `lpn-dom-stub.js`, the harnesses); Task 293's split silently missed
    this one. Derive both lists from the glob, or add `sw_manifest_check.php` to `check_all.sh`.
  - **`CACHE_VERSION = 'engcalcs-v9'` is the banned hardcoded `?v=N`, reintroduced** — a manually
    bumped string in the one file where forgetting it is invisible (a returning visitor silently
    keeps the old cache). The Task 287 comment above it documents a bump that was required for
    correctness, which proves the risk is live. Generating `sw.js` removes it entirely.


## Task 324

- 90|324| **Scenario overrides collide between a NODE and a LINK that share an id — and EPANET files
  do that constantly.** Found by Tom, 2026-08-14: *"When I changed a demand, a remote pipe changed
  to orange along with the node. The pipe has no changes."* He is right, and the halo is the
  harmless half.
  - `scenarios[].overrides` is **one flat map keyed by the bare element id**, which assumes a single
    id space. **EPANET keeps nodes and links in SEPARATE namespaces**, so a junction `20` and a pipe
    `20` are both legal and both common. Measured on the files in `dev/epanet-models/`:
    **Net2 has 35 collisions, Net3 has 72.**
  - **The halo is cosmetic; `effective()` is not.** Everything reads the same map, so a node's
    override is visible to a link with the same id. `active` is the dangerous one — it is on BOTH
    groups, so unticking "Part of this network" on a junction can silently drop a pipe out of the
    solve. `demand` and `diameter` do not overlap by name, which is why this reads as a display
    glitch until it does not.
  - **Fix: key by group + id** (`n:20` / `l:20`), through one `ovKey(el)` seam — 18 call sites touch
    `.overrides[` and all must go through it. `renameOverrides`, `purgeOverrides`, `deleteElement`
    and `overrideCount` included.
  - **It is a document-format change**, so saved projects need migrating: an existing bare-id key is
    ambiguous by construction, and the honest migration resolves it against the element actually
    present, preferring the node (which is what the old code effectively did first).
  - **A harness case belongs with it**: import Net2, override a demand on a node whose id a pipe also
    carries, assert the pipe is untouched in the solve AND unhaloed. `scenario-harness.js` never had
    a colliding id because its fixtures are hand-built with unique ones — the same blind spot that
    let the valve seam through.

## Task 331 — The GIS paradigm, phase 1: screen-pixel sizing (closed 2026-08-14)
- 0|331| **The GIS paradigm, phase 1: sizes in SCREEN PIXELS, decoupled, with scale-dependent
  visibility.** Tom, 2026-08-14: *"proceed to implement the GIS paradigm insofar as that means…
  (3) deprecate/remove map units text sizing, (4) decouple label, link, and node size (in pixels?
  EPANET is fuzzy about that and epanet-js seems to have it hard coded)"*. SHIPPED.
  - **`textSize`, `symbolSize` and `linkWidth` are three independent screen-pixel numbers.** Symbol
    size is the junction dot's DIAMETER, which is the one dimension a person can picture; every
    other fixed-shape symbol is drawn against it. Pipe width got `--lpn-lw` of its own so the
    link-weight family (stroke, closed-link dashes, override halo) no longer rides on `--lpn-sym`.
  - **`textSizeUnits` and `symbolScale` are DELETED, not defaulted.** A map-unit size is illegible or
    enormous depending on where you happen to be zoomed, which is not a setting anyone can hold an
    opinion about; `symbolScale` existed only to express symbols as a multiple of text and made the
    user do a division to answer "how big is the dot".
  - **The paradigm keeps deleting things, and that is the strongest evidence it is right.** Also gone:
    both screen-pixel floors (`LPN_MIN_TEXT_PX`, `LPN_MIN_SYMBOL_PX` — in pixels a pixel is a pixel
    at every zoom, so there is nothing to floor) and **`importTextSize()`**, the diagonal/40 heuristic
    written on 2026-08-14 to stop an imported network arriving unreadable. That heuristic was removed
    the same week by the change that made it unnecessary. Worth noting as a general lesson: **a
    plausible estimate is the most expensive kind of workaround, because it works well enough that
    nobody looks for the cause.**
  - **Scale-dependent visibility replaces map-unit sizing rather than joining it.** `labelMaxWidth`
    is a width in MODEL LENGTH UNITS (Tom: *"you specify zoom threshold in terms of how many units
    wide the map is"*), and the settings panel captures it from the current view — you zoom until the
    drawing is as sparse as you want and press the button, because no default is meaningful across
    networks 400 ft and 40 miles wide. Blank = always show.
  - **What hides is GENERATED ANNOTATION, not "labels", and the flow arrow is what proved it** (Tom:
    *"Arrows also should hide at hideable zoom levels"*). An arrow is a symbol by construction and an
    annotation by purpose. Hidden: data labels, their masks and leaders, flow arrows. Kept: the
    network itself, and the user's own Text labels, which are authored content.
  - Storage v5 -> v6. Old sizes are DISCARDED rather than converted: a stored map-unit size rendered
    at a pixel count that depended on the reader's zoom, so there is no factor to apply, and
    inventing one would carry the ambiguity forward wearing an authoritative number.

## Task 319 — Accept-Language log injection (closed 2026-08-14)
- 55|319| **Log-row injection through `Accept-Language`, in five copy-pasted copies.** Every log
  writer sanitises its columns carefully — `log-signal-event.php` even explains why — but
  `$browserLang` comes raw from `$_SERVER['HTTP_ACCEPT_LANGUAGE']` with no filter and no length cap,
  into the same tab-separated line. The identical 3-line snippet sits in `formmail.php`,
  `log-signal-event.php`, `log-title-event.php`, `log-human-view.php`, `log-calc-event.php`, which is
  why the miss is uniform. `trim()` strips edges only, so an embedded tab or newline forges rows, and
  a 4 KB header goes in unbounded. **Impact is bounded — it corrupts our own analytics, nothing
  executable — but those analytics are what roadmap decisions are being made from.** One helper
  `ecBrowserLangTag()` in `lib/config.inc.php` (`[a-z0-9-]`, ~35 chars), called from all five: kills
  the duplication and the defect together.

Shipped during the dev.hawsedc.com deploy debugging and left open by accident until Tom asked
whether any smell-test findings remained. `ecBrowserLangTag()` in `lib/config.inc.php` filters to
`[a-z0-9-]` and TRUNCATES rather than rejecting (a header that is merely long is a real browser's,
not an attack, and dropping it would lose the datum we are collecting). All five writers call it;
`dev/scripts/browser_lang_tag_check.php` is blocking in `check_all.sh` and proves no sixth writer
can reintroduce the raw read.

## Task 335 — pixel label offsets (superseded 2026-08-14 by Task 328, never built)
- 80|335| **Store a dragged label's offset in SCREEN PIXELS, which fixes the drifting leader angle
  outright.** Tom, 2026-08-14: *"As I zoom in and out, the angle of leaders changes. Can we get the
  leader endpoint from user and change only its length, if anything, as zoom changes? Or is this
  impractical?"*
  - **Practical, and there is a better answer than holding the angle: `n.lx`/`n.ly` are the LAST
    MAP-UNIT QUANTITY left in the label system.** Text became pixels in Task 331, so a label's
    on-screen size no longer changes with zoom — but its stored offset from the node still does, so
    the geometric relationship between the box and its anchor changes at every zoom step, and the
    attachment point and angle drift out of it. Fixing the angle would be treating the symptom.
  - **Store the offset in pixels and BOTH the angle and the length become constant for free** — the
    label sits exactly where the user dropped it, relative to its node, at every zoom. No rule to
    state, no special case, nothing to hold. This is the same move as the text size, applied to the
    one place it was not.
  - **The cost is a migration with the Task 332 ill-posedness in it**: converting an existing
    world-unit offset to pixels needs a scale, and no document records the zoom it was dragged at.
    Options, for Tom: convert at the open-time fit scale (one-time, approximate, visible immediately
    and adjustable); or keep `lx/ly` for legacy documents and write pixels only on the next drag
    (lossless, but two mechanisms in the file at once). **Not a decision to make silently** — it
    changes stored meaning.


## Task 328

Closed 2026-08-14. The open-task text below is the design as it stood when the fix was written; what
actually shipped matches it, plus one thing the writeup did not predict. Tom had to report the defect
THREE times, and his third message is the one that says why testing missed it: *"this works fine for
leaders dragged right. But only point B works for left and right."* A right-hanging label was already
correct, because there the box origin and B are the same point -- so any check that dragged a label
to the right passed against the defect. `dev/lpn-spike/leader-angle-harness.js` runs every assertion
on both sides for that reason, and the mutant restoring the old derivation fails the LEFT case only.

- 88|328| **Store the LEADER'S ENDPOINT, not the label's position — and hold the angle sacred.**
  Tom, 2026-08-14, after I proposed storing the label offset in pixels: *"I think you missed my main
  idea about leaders. We should get from the user and store the endpoint of the leader, not the
  location of the text. We can either keep that endpoint sacred or scale it up… We have to hold the
  leader angle sacred."* He is right and this supersedes Task 335.
  - **WHAT IS ACTUALLY HELD SACRED TODAY, read out of the code rather than guessed at, because Tom
    had to say twice that I had not understood.** The stored quantity is `n.lx`/`n.ly`: the label
    BOX'S ORIGIN, in world units. Point B — the leader's text end — is not stored anywhere. It is
    recomputed every render by `Geom.leaderAttach()`, which returns `pos.x` or `pos.x + boxWidth`
    depending on which side the box sits, and **`boxWidth` is derived from a font size that is now in
    SCREEN PIXELS, so it is proportional to 1/zoom.** Therefore B slides along by a whole box width as
    you zoom whenever the leader attaches to the far edge, and angle A→B slides with it. Tom's
    diagnosis is exactly right: neither B nor angle A→B is sacred, and the one thing that IS fixed —
    the box origin — is a point he never chose and cannot see.
  - **THE FIX IS TO STORE B ITSELF**, in map coordinates, as the thing the user drags. A and B are
    then both world points, so the angle is invariant with no rule to maintain, and the TEXT hangs
    off B — placed in pixels, flipping to whichever side keeps it from lying across its own leader.
    The endpoint is a fact about the drawing (the user's, sacred); the text placement is a fact about
    legibility (ours). One number was trying to be both, and that is the whole of what has been wrong
    here.
  - **Tom's open question is about LENGTH, not width — I misread him once already.** *"The length of
    the leader could be scaled up; you heard 'width'."* So: hold B's map coordinates fixed, or hold
    the ANGLE fixed and let the leader's length scale with zoom. Both keep the angle, which is the
    part he named as non-negotiable; they differ in whether a leader stays the same length on the
    drawing or on the screen.
  - **The pixel-offset design I proposed (Task 335) would not have fixed this at all**, and the
    reason is worth keeping: it holds the box ORIGIN steady in screen space, but B is still derived
    from the box's width, so the far-edge attachment still moves and the angle still slides. It
    addressed the symptom I had noticed rather than the mechanism. Closed as superseded.
  - This also dissolves the drift Task 335 was invented to fix.


## Task 317

Closed 2026-08-14; the open-task text follows and is what shipped.

- 97|317| **Push Base values to all scenarios PER ELEMENT, not only per property.** Tom, 2026-08-14,
  looking at the shipped scenario menu: *"I assume that Apply Base values to all scenarios will be
  fine-grained; each property or element (maybe start only with the element level, will have a way
  to Apply values to all scenarios."*

  **Half of that assumption is already true and half is not, which is the reason this task exists.**
  `pushBaseToScenarios()` is scoped **by PROPERTY** — the Labels panel's checkboxes are the filter,
  so the user's own current view defines the blast radius and no second property picker was needed
  (Task 184's design, and the same mechanism the Settings push uses). It is scoped **by ELEMENT not
  at all**: it walks `Object.keys(s.overrides)` for every scenario and takes everything.

  - **The element-level push is the SAFE and COMMON case, and the global one is neither.** The real
    workflow is "I corrected P-12's diameter in Base and I want that one correction everywhere" —
    a single element, deliberately chosen, with a countable blast radius. The all-elements push
    exists for the rare bulk case and is the most destructive thing on the page; that asymmetry
    argues for building the narrow one first, exactly as Tom suggests.
  - **Where it goes: the element's own popup**, beside the override markers already there. That
    keeps the dangerous global action in the scenario menu where it is deliberately hard to reach,
    and puts the everyday action where the user is already looking at the element.
  - **Reuse `pushBaseToScenarios()`, do not fork it.** Give it an optional element-id filter; the
    counting, the naming of properties, the finger-wag confirm and the undo snapshot are all
    already right and must not be duplicated into a second implementation that drifts.
  - **Still Base-only**, for the reason the existing guard states: run inside a scenario it would
    mint an override on every element at once.
  - Per-property-per-element (a single cell) is the third level and is explicitly NOT wanted yet —
    Tom's own "maybe start only with the element level". The Labels panel already narrows properties,
    so element + displayed-properties covers the real case without a new picker.

  - **THE AFFORDANCE IS IN BASE, opposite the scenarios' "This scenario only"** (Tom asked,
    2026-08-14: *"Are we going to add 'Apply to all scenarios' in Base?"*). Yes — and note it is
    not there for symmetry, which is never a reason on its own: it is there because pushing a
    value down is a real action a user needs, and Base is the only place standing where that
    action makes sense.


## Task 184

Closed 2026-08-14 once the per-element push (Task 317) landed. This is the full decision record;
it was never a build task, and its remaining UI work is Task 201.

- 95|184| **Project/scenario model for saved networks: DELTA model — one save, canonical Base,
  scenarios are collections of overrides (originated during Task 146).**

  **SHIPPED 2026-08-14, and Tom reviewed it the same day. Three rulings:**
  - **The push CLEARS a scenario's overrides rather than writing Base's number in as a fresh one.**
    Confirmed — *"Yes. Push clears rather than overwriting."* Both leave every scenario showing
    Base's value; clearing leaves no stale marker claiming an intent the user has just overruled,
    and does not pin scenarios to today's Base value forever.
  - **The override count reads "Own values", and it STAYS.** Tom: *"'Own values' is good. Simple
    English is good. 'Local values' or 'Scen. values' may be better."* Keeping "Own values", for a
    reason he could not have been expected to have in view: **this suite already owns the word
    "local"** — "Minor (local) loss" is its suite-wide standard for `h_m`, and that parenthetical
    exists specifically to block a mistranslation. A second, unrelated technical "local" on the same
    page would spend that word twice. "Scen." is an abbreviation of a word 26 languages do not
    abbreviate alike, and `layout: nav item` is the only thing that justifies compressing a label.
    **If Tom overrules this it is one string and one sprint key** — `lpn_scenario_overrides`.

    **THE FULL OPTION SET, settled 2026-08-14 before the sprint so it is not re-litigated after 26
    translations exist.** Tom raised five more candidates; every one was checked for a collision
    inside this suite, because that is what killed "Local values":
    - **"Active values" — the worst of them, and it looks the best.** `active` is ALREADY a
      property of this very feature (`lpn_field_active`, the overridable boolean that carries the
      whole topology-varies case). "Active values" and "In this network" would be the same word
      meaning two unrelated things one popup apart.
    - **"Present values" — collides with net present value**, in a tool whose users cost projects.
    - **"Actual values" — the classic false friend, and Tom spotted it himself** by writing
      *"Present (other language: Actual)"*. In Romance, Slavic and Germanic languages
      *actual/actuel/aktuell/aktualny* means CURRENT, not REAL. An English reader gets "the real
      ones"; a translator gets "the current ones". Two readings is a Wave 0 failure by definition —
      and it is a reason to avoid BOTH halves of that pair, not to choose between them.
    - **"Values here" — no collision, and the runner-up.** Declined only because "here" has no fixed
      antecedent in a status strip: here could be the scenario, the element, or the map.
    - **"Plan values" — the HEC-RAS evangelism idea, and Tom called its odds himself**: *"it's
      probably not going to happen."* Agreed, and worth recording why rather than just declining.
      HEC-RAS's "Plan" is the outlier; **WaterGEMS and InfoWater both say Scenario**, and Tom's own
      word for it is *pervasive*. Shipping "scenario (plan)" would put TWO terms into 26 languages
      for one concept, and `glossary.json`'s standing rule is to defer to each language's own
      dominant term — which for this concept is a translation of *scenario*, not of *plan*.
      Evangelising English usage is the one thing this suite's translation policy is built to not do.
    - **The decisive argument for "Own values" is positional and none of the alternatives have it:
      the antecedent is one word away on the same line.** The strip reads
      `Scenario: Fire flow | Own values: 7`. "Own" refers back to "Scenario", visibly, so the label
      never has to re-name the concept — which is exactly why it can afford to be the shortest and
      plainest option on the list.
  - **The selector belongs at the BOTTOM, and may eventually want a row of its own.** Tom: *"I
    thought it would occupy the entire bottom. But if it can coexist with status items, maybe that's
    okay. But envision it possibly needing its own bottommost row."* It currently shares the map
    status strip. **This is a re-parenting, not a rewrite** — `#lpn_scenario_btn` is one element with
    its own id, so promoting it to a dedicated bottom row is a CSS and container change. Do that
    when the strip actually gets crowded, not before.

  **RAISED 40 → 95 ON 2026-08-14, AND IT IS NOW THE TOP OF THE LIST.** Tom: *"I have got distracted,
  and a real customer, my colleague with a real project willing to use lpn, could use scenarios
  nearly immediately. I erred in pushing LibreEPANET.org at the expense of scenarios. We need to
  push scenarios forward."* **A named user with a live project outranks a positioning exercise**, and
  that is the whole of the reasoning — it does not need re-deriving next time the two compete. Task
  248's remaining phases and Tasks 306/307 drop behind this accordingly.

  Raised by Tom, 2026-07-30, thinking ahead to Task 146.08 (multiple named saved
  networks): "I am wondering whether the concept of project.scenario buys us anything… if multiple
  saves were grouped as scenarios under a project, we could conceivably, for any element, 'Push to
  project' to sync across scenarios. We could even get fine-grained with checkboxes in popups."
  **The question is not "should saves be grouped" but "what is shared and what varies."** Grouping
  alone buys a folder. Every serious package sells the answer as its differentiator — InfoWater's
  scenario manager over facility sets and alternatives, WaterGEMS' Alternatives / Scenarios /
  Calculation Options triple, WNTR's one `WaterNetworkModel` with programmatic overrides — and they
  all agree on the split: **topology and geometry are shared; demands, link statuses, roughness
  ageing and boundary heads are what vary.** None of them lets a scenario freely add and delete
  pipes and still call it a scenario; conflating those two is the usual way this feature turns
  confusing. EPANET itself gives you none of it: one `.inp` per scenario, whole network duplicated,
  no way to push a diameter correction across them.

  **DECISION (current, 2026-07-30, third and final pass): the DELTA model — one project save, a
  canonical Base, and scenarios that are nothing but collections of overrides.** Tom: "There is a
  project. It's a single save… It has scenarios that consist of overrides. That's all. A scenario is
  simply a collection of overrides? Base is canon is parent and has no overrides."

  **Why this reverses the copy-model decision recorded earlier the same day (kept below as
  superseded).** The copy-model argument was: the dangerous "clear/override children" action has to
  exist in BOTH models, so the delta model's remaining advantages are only organizational overhead
  and file-size parsimony, which no user feels. **That reasoning missed the bigger cost it was
  spending to avoid the smaller one.** In the copy model, propagation is an *action* — "Push to
  project" — and Tom found its failure by inspection: *"If I edit a child and then Push to Project,
  the original parent doesn't get my push because everything there is an override."* Push is the
  hassle, and a user feels it on every single edit. In the delta model **propagation is not an action
  at all**: editing Base *is* the propagation, there is no Push upward, and nothing silently fails to
  arrive. What survives is one dangerous action (below), and it operates inside a single document
  where its effects are visible in the same view and reversible in one undo — categorically safer
  than the copy model's push, which edits documents that are not on screen.

  The copy model's one genuine win was **"what am I working on right now"** (Tom's words). The status
  bar answers it: `Scenario: Fire flow · 7 overrides | Mode: …`. The override count is what makes it
  answerable at a glance, and it is only cheap to compute in the delta model.

  **Shape to build:**
  - **Two levels, permanently.** Base is canon and has no overrides; scenarios are leaves. No
    scenario-of-a-scenario. The asymmetry must be **structural, not conventional** — Tom's own
    diagnosis of what went wrong before: *"pushing becomes chaotic if everybody is equal."* Lazy
    overrides and ambiguous parentage are what a second level would reintroduce.
  - **Every edit in a non-Base scenario is an override, full stop** — even when the typed value
    equals Base's. This preserves the one decision worth carrying over from the copy-model writeup:
    the marker records **user INTENT at edit time** and is never computed by diffing. A diff cannot
    tell "I set this deliberately here" from "Base moved underneath me", and those need opposite
    treatment. Unchecking the marker is the un-do; the value returns to Base's.
  - **Show Base's value beside the scenario's** whenever a marker is checked, in the property row.
    This is the cheap fix for the one confusing case the model leaves: you correct a diameter in Base
    and a scenario that overrode it does not move. Seeing what you are diverging from, at the moment
    you can act on it, needs no change-tracking or "Base changed since" bookkeeping.
  - **"Push displayed properties hard downstream"** — the dangerous action, and it stays (Tom,
    2026-07-30: *"still needed for good UX"*). Base-side, it forces the displayed properties onto
    every scenario, ignoring their markers. Finger-wag with a count of scenarios and properties.
    "Displayed" is deliberate: the Labels panel is already the per-property checkbox filter, so
    Task 185's "reuse the Labels panel as the property filter" idea applies here directly and the
    user's own current view defines the blast radius.
  - **An overrides report is explicitly low priority** (Tom, 2026-07-30) — the map halos below make
    the same information visible in the place the user is already looking.
  - **Audit halos.** A highlight (outline, not fill, so it composes with the flow/pressure coloring)
    around every element carrying an override in the current scenario, filtered by the same Labels
    panel checkboxes.
  - **Copy is a project-level operation, not a scenario-level one.** "Save project as" duplicates the
    whole project — Base, scenarios, and markers together. This is where a self-contained copy is
    genuinely what the user wants, and it is the answer to the delta model's one real cost (one save
    = one blast radius). **Copy at the project level, delta at the scenario level**; each does the job
    it is good at. This retires the "Copy with / without overrides" naming problem entirely — there is
    no scenario-level copy that has to decide.

  **REVERSED, 2026-07-30: "topology and geometry are shared, only properties vary" was too strong.**
  Tom pushed back on it — *"Is it possibly not true even though this is what everybody does?"* — and
  he is right; the survey paragraph above overstated what the packages actually do. **WaterGEMS
  varies topology every day, via an active-topology alternative that toggles elements on and off.**
  What the packages really share is the *element set*, not the topology: membership is itself an
  overridable property. And the reason they stop there is partly historical — EPANET-lineage engines
  index links by array position and store result series against a fixed link set, which is an
  implementation constraint from the 1990s, not a conceptual truth. Meanwhile "with the new 12-inch
  loop vs. without" is *the* most common real design question this calculator will be asked, so a
  rule that forbids it would gut the feature. Corrected rule:
  - **Existence is an ordinary overridable boolean** (`active`). A proposed loop lives in Base as
    inactive; the "Build the loop" scenario overrides it to active. Deleting in a scenario means
    setting it inactive. No new delta type, no new machinery — the whole "topology varies" case is
    just a property override, which is exactly why this stays coherent.
  - **Drawing inside a scenario must still work.** When the user draws a new pipe in a scenario, the
    app silently creates it in Base as inactive and overrides it active in the current scenario. The
    user gets ordinary drawing; the model keeps a single ID space and a single element set. This is
    what makes the corrected rule feel like no rule at all.
  - **Deleting in Base is a real deletion** — it drops the element and every scenario's overrides on
    it. Confirm with a count.
  - **Geometry genuinely does stay shared**, and this is the part of the original rule with an actual
    reason rather than an inherited one: a node cannot be in two places at once in a single rendered
    map view.

  **The line, stated exactly (2026-07-30, agreed): MEMBERSHIP is overridable, IDENTITY is not.** A
  link's `from`/`to` and a node's `x`/`y` are Base-owned and never override; `active` is an ordinary
  property override like any other. This is narrower than the retired "topology is shared" rule and
  is the form worth defending, because:
  - **The escape hatch is cheaper than the feature it replaces, and better.** "Same pipe, different
    alignment" is two pipes with opposite `active` flags — one extra ID. And it is the *superior*
    representation: alignment variants nearly always differ in length, diameter and cost, so they
    want to be two separately priceable elements anyway.
  - **A connectivity override has no picture.** Re-pointing P-12 from J-5 to J-9 renders as a pipe
    that silently jumps when you switch scenarios, with no halo that reads as "this is the change."
    The inactive/active pair draws *both at once*, greyed and solid — precisely the image an engineer
    wants for "with the loop vs. without." The restriction is not a limitation; it is the mechanism
    that makes the comparison visible.
  - **Do not inherit the vendors' reason.** EPANET-lineage engines index links by array position
    against fixed result series; we store no result series and re-solve on scenario switch, so that
    constraint is theirs, not ours. Only the two reasons above are ours.
  - **Two honest costs, accepted with eyes open.** (1) Report tables (146.04) get two rows for one
    physical decision — the compare-with field below is the fix. (2) Mid-pipe insertion in one
    scenario clutters Base: a service tap means Base gains a junction plus two half-pipes, all
    inactive, plus deactivating the original run. That argues for an eventual "purge elements
    inactive in every scenario" affordance, and for the audit halos to also mark inactive-everywhere
    elements.

  **Storage shape (v2), and the one seam that matters:**
  ```json
  { "v": 2,
    "project": { "name": "Elm St. subdivision", "activeScenario": "base" },
    "nodes": [], "links": [], "labels": [],
    "nextId": {}, "labelSettings": {}, "backdrop": {}, "settings": {},
    "scenarios": [
      { "id": "base", "name": "Base", "isBase": true, "overrides": {} },
      { "id": "s1", "name": "Fire flow", "overrides": {
          "J-3":  { "demand": 1500 },
          "P-12": { "active": true },
          "P-4":  { "active": false } } } ] }
  ```
  - **The key's presence IS the marker.** No parallel marker array to drift out of sync: writing
    `overrides["J-3"].demand` records intent, deleting it is the un-do, and both hold even when the
    value equals Base's. The status bar's override count is a sum of key counts.
  - **Base is a row in the same array**, flagged `isBase` with a permanently empty `overrides`. The
    scenario selector then has no special case, and because nothing carries a parent pointer, a
    scenario-of-a-scenario is *unrepresentable* rather than merely discouraged — the structural
    asymmetry the model requires.
  - **One resolver seam:** `effective(el, prop)` → `override ?? el[prop]`. Solver, renderer, labels
    and popups all read through it. **Build this seam in 146.08 while Base is still the only
    scenario** — it, not the JSON wrapper, is what makes scenarios purely additive later.
  - **An overridable-property whitelist**, cheap to widen and expensive to narrow. Start with:
    junction `demand` and `emitter` (Task 191); reservoir/tank `head`; pipe `diameter`, `roughness`,
    `k`, `open` (146.07); `active` on anything. Explicitly out: `id`, `from`, `to`, `x`, `y`, `verts`,
    `type`, and junction `elev` (survey data, not a design variable).
  - **v1 → v2 is a wrap, no data loss**: the existing `lpn_document` becomes project "Untitled" with
    one Base scenario.

  **Dragging inside a scenario: no dialog. Silent to Base, with ambient warning.** Two unequal
  intents hide behind a drag — "that node is in the wrong place" (a fact about reality, the
  overwhelming majority) and "in this scenario the manhole is 40 ft north" (rare, and when real it
  wants to be a separate priced element anyway). A modal taxes the common case to serve the rare one,
  and drags are not discrete decisions but nudge-nudge-nudge; users would learn to click through
  without reading, which is worse than no dialog. **Note this is a hydraulic edit, not just a
  cartographic one:** `lenAuto` (`js/looped-network.js:740`) makes `length` follow geometry until the
  user takes control, so a drag changes a solver input in every scenario. What replaces the dialog:
  - **A one-time, dismissible notice** on the first drag in a non-Base scenario: "Moving elements
    changes the drawing in every scenario. Property changes stay in this scenario." [OK] [Don't show
    again].
  - **Ambient state, not modal** — flash the recomputed length in the status bar on mouse-up when the
    dragged link is auto-length, so the hydraulic consequence leaves a visible trace.
  - **Undo.** One document, one undo stack, effect on screen — categorically better than the retired
    copy model, whose push edited documents the user could not see.
  - **"Create scenario geometry variant"** (Tom's wording, 2026-07-30) is the deliberate path, and it
    is an *up-front command, never a post-drag question*: clone the element (new ID, same geometry and
    properties), set the original inactive here, set the clone active only here — then drag the clone.
    By the time a post-drag modal could fire the gesture is already complete, so "create a copy" would
    have to retroactively reinterpret what just happened. Same machinery as drawing a new pipe in a
    scenario, so no new concept. **Entry path in 146.08 is the toolbar/menu only** — see Task 192 for
    why the right-click path is a separate build.
  - **A non-clone escape valve already exists:** `length` is a property with a manual-override flag,
    so a scenario wanting a different length *without* a different drawing just overrides `length`.
    The clone stays reserved for real re-routes. Vertices follow the identical rule — a vertex list is
    geometry, Base-owned.

  **"Compare with base ID" — a visible, blank-by-default, usually-guessable string field** (Tom,
  2026-07-30, simplifying an earlier proposal for a hidden clone id + named group). It is what makes
  the two-elements-per-variant rule legible instead of chaotic, and it is load-bearing for 146.08
  rather than a 146.04 report-table nicety — it is simultaneously the table's row key, the halo
  grouping, and the cleanup handle for "pipes could get out of control fast."
  - **A string, never a live reference.** Grouping is string equality; nothing is ever dereferenced.
    This is why deleting the base object cannot break it — the earlier objection to a pointer applied
    only to a resolved one. The group's name simply *is* that string, normally the base object's ID.
  - **Capture, don't infer, as the primary path.** "Create scenario geometry variant" knows the
    relationship with certainty at creation and writes it then — the same principle as the override
    marker: a diff cannot tell "deliberate" from "drifted," and a geometric guess cannot tell
    "alternative alignment" from "two pipes that happen to be near each other," least of all in the
    congested drawings where it matters most.
  - **Guessing is the secondary path**, for pipes drawn independently before the user thought of them
    as alternatives. Two signals, the second near-conclusive: same endpoints, and **never active in
    the same scenario**. Offer as a *suggestion*, visually distinct from confirmed, one click to
    accept or reject.
  - **Follow renames while the object exists; freeze on delete.** Renaming P-12 → P-100 updates every
    member's field (we own the rename path, it is cheap, and it is what the user meant). Once P-12 is
    deleted there is nothing to follow, so it freezes into a plain name and we hint, at that moment
    and not as a standing nag: "Group is named after a deleted object ID. Consider changing to a
    friendly name."
  - **A collision is cosmetic, not corrupting.** If a later pipe is renamed *into* a deleted group's
    name the label reads oddly, but since the string is never resolved nothing breaks. Warn on the
    rename; build no machinery.
  - **What the table then does:** one row per *design decision*, not per element. The group name is
    the row; each scenario's column shows whichever member is active there, with the member ID in a
    sub-cell.
  - **Two guards fall out free.** Two members active in the same scenario is a table flag and a halo
    candidate (not necessarily an error — you might build both). A group whose members are inactive
    everywhere is exactly the "purge unused" candidate above.

  **This entry is the DECISION RECORD, not a build task.** Everything above is settled; what remains
  is to build it, which is **Task 201**. Two bullets that used to live in 146.08 moved there on
  2026-08-03 rather than being left in a closed block.

  **Sequencing:** 146.08 must ship the **project container from day one**, holding Base as its only
  scenario. Then scenarios are purely additive and there is never a storage migration. Tom flagged
  this himself — *"this is an important decision because we want to introduce it early"* — and it is
  the reason the model had to be settled before 146.08 rather than after.

  ---
  **SUPERSEDED (kept for the reasoning, not the conclusion) — the copy model, decided and reversed
  2026-07-30.** A scenario would be a whole, self-contained network; it keeps working if the project
  is renamed or deleted, "Save as" is a copy, and undo/versioning stay per-document. It needed:
  "Push to project" (promote this scenario's values up and out to siblings that have NOT overridden
  that property, finger-wagged because it edits documents not on screen); "Push through all
  overrides" (the same, ignoring markers — double finger-wag, and it destroys deliberate work in
  scenarios the user cannot see); and a two-mode copy, since a copy must decide what happens to the
  source's markers — "Copy with overrides" (default) / "Copy without overrides", preferred over
  Tom's original "Copy as child / Copy as sibling" because in that model every scenario is already
  both a child of the project and a sibling of every other scenario, so the genealogy named a
  distinction that did not exist, and because "child"/"sibling" applied to a FILE is an English
  computing idiom that does not carry into 26 languages. Its sequencing note read: ship 146.08 as
  flat named saves first, since flat saves ARE the copy model already. **All of this is retired by
  the delta decision above** — the naming problem disappears with scenario-level copy, and the
  sequencing note inverts: the container must come first, not the flat saves.


---

## Task 315 / Task 304 — the filename and extension question, full pre-closure text

Archived 2026-08-14 on closure. 315 carried the research; 304 carried the question.

- 75|315| **The saved filename is gratuitously long. Shorten it; decide about a generation-1
  extension separately.** `projectFileName()` produces `Elm Street-lpn-hawsedc-engcalcs.json` — a
  30-character suffix on every file. Tom, 2026-08-14: *"we got carried away with a long ugly
  filename just because we didn't have a nice extension… I am less ashamed to live with two or
  three legacy file extensions than the gratuitously long file names."*

  - **These are two decisions, not one, and conflating them is what produced the long name.** The
    suffix got long *because* an extension decision was deferred; deferring it again is fine, but
    the filename should not keep paying for it. Shorten now (`-lpn.json` is Tom's own suggestion);
    choose an extension when the format has stopped moving.
  - **Three call sites, and they must move together**: `projectFileName()` (~3006), the strip in
    `projectNameFromFileName()` (~3930), and `saveAs()`'s `suggestedName` (~4034). The strip is the
    one that matters — **a file already saved with the long suffix must still open with its name
    intact**, so the old suffix has to keep being recognised after the generator stops producing it.
    A missed strip does not fail; it silently names the project `Elm Street-lpn-hawsedc-engcalcs`.
  - Tom's own candidate extensions: `wnj` (water network js), `lwj` (librewater js), alongside
    possible project names LibreWaterNet / waternet. Research is out with a subagent — collision
    check, what comparable tools ship in 2026, and whether `name.lpn.json` is a good idea or a dated
    one. **An extension is a public commitment that is expensive to walk back**, and the format is
    moving this week (scenarios, valves), so the honest answer may be "not yet, and here is the
    trigger".
  - Depends on Task 184 only for merge order — it is the same save/load region of
    `js/looped-network.js`, and Task 184 must edit `serializeProject()` to persist scenarios.

  **RESEARCHED 2026-08-14, and the answer is not an extension.** Verified against the code:

  - **THERE IS NO FORMAT IDENTIFIER INSIDE THE FILE AT ALL.** `serializeProject()` emits
    `{v, project, scenarios, nodes, links, labels, nextId, labelSettings, backdrop, settings, units}`
    — `v` is a version number, but nothing says what it is a version *of*. So "identifiable a year
    later in a forgotten folder" is carried **100% by the filename**, which is the actual defect the
    30 characters were compensating for. Fix it where it belongs, in one additive line:
    `format: 'hawsedc-lpn', app: '<the page URL>'`. Old readers ignore unknown keys; the import path
    already sniffs `.net` against `.inp` from the bytes, so the precedent exists. **This is strictly
    more durable than any filename scheme, because a file in a forgotten folder is exactly the file
    somebody renamed.**
  - **Immediate change: `Elm Street-lpn.json`.** 30 characters to 4, project name still first and
    still the sort key, and the extension does not move — so `fileTypes()`, the MIME type, the
    download path, the Open filter and every file already saved are untouched. Nothing to migrate.
  - **`saveAs()` hardcodes the suffix a SECOND time** for the copy branch (~4034). Route it through
    `projectFileName()`; two copies of a filename convention is how they drift.
  - **THE BACKWARD-COMPATIBILITY TRAP, verified in the code and worth stating exactly.**
    `projectNameFromFileName()` must strip `.json`, then the LONG suffix, then `-lpn` — **longest
    first**, or `-lpn` matches inside the long one and leaves `-hawsedc-engcalcs` in the project
    name. This is not cosmetic: `saveCurrent()` at ~4107 treats a filename differing from the
    suggested one as a deliberate rename (`if (handle.name !== suggested) { project.name = ... }`).
    After this change, re-saving a legacy file makes those two differ *by construction*, so the
    rename branch fires every time and a bad strip **silently renames the user's project**. Needs a
    harness case.
  - **A generation-1 extension is PREMATURE, and the reasons are not about which letters.** (a) The
    format is moving weekly — scenarios and valves are landing now, extended-period is queued — and
    an extension is a promise that a file with those letters is a thing you can open; `v` handles
    that technically but not a user's expectation that a named file type is stable. (b) The product
    name is unsettled: `.lwj`/`.wnj` encode a name that does not exist yet, and `lpn` is an internal
    *variable-prefix convention* from CLAUDE.md, not a product name. **Picking an extension before
    picking the product name is the expensive ordering.** (c) The payoff of a custom extension is OS
    double-click association and file-manager iconography, and a web page can deliver neither.
  - **The trigger that starts the clock — any one of:** a PWA ships with a `file_handlers` manifest
    entry (or LibreEPANET.org launches installable), so the extension becomes functional rather than
    decorative; or the product name settles; or the schema stops moving.
  - **When it does: `.lpn`.** Its only occupant is LVPLAN, obscure low-voltage-network design
    software, unregistered and with no OS association — but note the near-miss: LVPLAN is *also*
    network-design software, so "the `.lpn` format" is not a semantically clean public claim.
    Second choice `.wnet` if the product renames to waternet. `.wnj` and `.lwj` are free precisely
    because nobody could guess what they mean; `.hwn` is genuinely taken twice.
  - **`name.lpn.json` is mostly a dated pattern** — `.geojson` beat `.geo.json`, and namespacing
    moved to the MIME layer (`application/vnd.…+json`, RFC 6839). It survives only where the second
    half is a format people really do open with generic tools, which is *narrowly* true here (the
    file is pretty-printed on purpose so it can be read in an editor). Still declined: it is a
    half-commitment that pre-commits the extension shape, and a future `.lpn` and a legacy
    `.lpn.json` look identical in Windows Explorer while being different things.
  - **The honest cost of the change:** `-lpn` alone IS more cryptic than `-lpn-hawsedc-engcalcs`.
    `hawsedc-engcalcs` was the part that made a stray file traceable. That loss is real, and it is
    exactly why the in-file `format`/`app` marker is part of the same change rather than a
    nice-to-have.

- 85|304| **Settle the project file's NAME and EXTENSION before there are files in the world.**
  Raised by Tom, 2026-08-14: *"now I am having doubts about our save conventions. Instead of the
  long names, maybe we should just use something like 'Elm-Street-Center.___' … Unfortunately it's
  a little bit urgent because we want to settle it before we make too much traction in the world."*
  - **Today we write `<Name>-lpn-hawsedc-engcalcs.json`** — `projectFileName()`,
    `js/looped-network.js:2888`, and again in the Save-a-copy path at :3876. The picker offers
    `{'application/json': ['.json']}` at :3471. Three places, one decision.
  - **Candidates Tom listed:** `lpndb` (looped pipe network), `ledb` (libreepanet),
    `leodb` (libreEpanet.Org), `netj` (EPANET's `.net` with a j for json).
  - **The urgency is real but the blast radius is small RIGHT NOW**, which is the argument for
    doing it now rather than a reason to panic: lpn had 12 confirmed users in its first two weeks,
    so the installed base of saved files is tiny today and will not be tiny for long.
  - **Split the decision in two — only half of it is urgent.** READING permissively costs nothing
    and can ship immediately: accept `.json` and the new extension forever, since the picker filter
    and the parser are independent. Only WRITING needs the naming decision. Do the read side first
    and the choice stops being a deadline.
  - **Arguments the choice should weigh, so they are not re-derived:**
    - `netj` **overclaims**. Our document is not EPANET's `.net` in JSON — it carries labels, a
      backdrop image, scenarios, per-project settings and unit selections that no EPANET format
      has. A name implying "EPANET, as JSON" promises interchange we do not offer, and Task 281
      (write `.inp`) is where that promise would actually be kept.
    - `ledb` / `leodb` **bind the format to a brand that does not exist yet.** Extensions outlive
      product names; if the name changes the extension is stuck forever. Prefer a descriptive
      extension over a brand one unless the brand is certain.
    - `db` says database; this is a document. `.lpn` alone is cleaner if it is free — **check
      whether `.lpn` is already claimed** before assuming.
    - **A custom extension over JSON content is normal and fine** — `.ipynb` is literally JSON.
      What is lost is "any tool recognises it as text/JSON"; what is gained is file association,
      a distinct icon, and an unambiguous picker filter (Task 300 already moved the picker to
      naming types by extension rather than MIME).
  - **The short-name question is separable and easier.** `<Name>.<ext>` instead of
    `<Name>-lpn-hawsedc-engcalcs.json` is strictly better once the extension identifies us: the
    suffix exists only because `.json` does not. Note `safeFileName()` round-trips the name back
    into the project title (see :2517), so shortening changes what a re-opened file is called —
    check that path when editing.
