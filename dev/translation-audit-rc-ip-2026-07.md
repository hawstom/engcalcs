# Linguistic Audit: Rock Chute (rc_) & Irrigation Pressure (ip_) — All 26 Languages

Date: 2026-07-05. Auditor: Claude (Fable 5). Scope: 114 keys (`rc_` + `ip_`) × 26 non-English
languages, read in full. This is a findings report; no fixes have been applied yet.

**Headline:** short labels are mostly fine everywhere; quality collapses in long tooltips and
Notes definitions. Three language files ship broken HTML. Roughly 6 languages have meaning-level
errors an engineer would notice immediately; another 6 have errors an engineer might act on
incorrectly.

---

## 1. Pipeline bugs that break rendering (fix first — these are not translation-quality issues)

| Bug | Files | Effect |
|---|---|---|
| Literal `<\/sub>` / `<\/span>` closing tags (JSON-escaped `/` leaked into PHP) | de, hr, ro — 22 lines each, all in ip_ | Browser renders `<\/sub>` as text; every `<sub>` opens and never closes, so the rest of the label renders subscripted, with garbage `<\/sub>` visible |
| Literal `\"` inside `title=` attributes | uk — 12 lines in ip_ | Broken HTML attributes: tooltips truncated, stray `\"` visible |
| Literal `\/` inside visible text (`q_last\/q_avg`, `PR = … \/ A_e`) | fa — 4 occurrences | Visible stray backslashes in formulas |

All three are the same root cause: a translation response that was JSON-escaped got written into
the PHP file without unescaping. `parseTranslationResponse()` runs `stripslashes()` on the value,
which handles `\'` but the driver evidently wrote at least one batch (de/hr/ro/uk/fa look like one
or two sprint runs) without that step, or the agent emitted JSON instead of PHP lines.
**Fix:** one-time cleanup of the 5 files + add a post-sprint validator rule rejecting `\/` and `\"`
inside any `$ec_lang` value (extend `lang_syntax_validate.php`).

## 2. Untranslated content shipped as translated

- **ru**: ~12 ip_ tooltips are verbatim English (`ip_x`, `ip_is_lateral`, `ip_count`, `ip_e`,
  `ip_km`, `ip_elev_ds`, `ip_hl`, `ip_q_supply`, `ip_dp_avg`, `ip_q_avg_field`, `ip_du_estimate`,
  `ip_q_ratio`). Labels are translated; hover text is not.
- **hi**: English tooltips on `ip_x`, `ip_is_lateral`, `ip_count`, `ip_du_estimate`; `ip_t_run` is
  "रनटाइम (hours)" — "(hours)" untranslated.
- **km, my**: English tooltips on `ip_x`, `ip_is_lateral`, `ip_count` (+ more in my).
- **fa**: `ip_t_run` "(hours)" untranslated.
- **am**: `ip_group_reach` = "Reach" untranslated; several ip strings half-English.
- Small leftovers: fr/it/pt `ip_press` = "Press."; fr `ip_notes_3_term` = "Limitations" (valid
  French but unchanged — fine), id `rc_sketch_filter` = "Filter" (acceptable in id).

**Fix:** re-run only the affected keys for ru/hi/km/my/am/fa; add an automated
"identical-to-English" and "ASCII-ratio of title attributes" check to the post-sprint validator.

## 3. Stale source text still shipping in 12 languages

`rc_apron_length`'s English tooltip once ended with the quoted Robinson sentence
("The minimum tailwater … outlet reach." — see commit 2f1cc03); English was later shortened, but
**ru, uk, bg, sr, cs, hr, ro, ar, fa, ur, ps, he** still carry the old quote. Not wrong, but the
languages no longer match the English source, and it shows the pipeline has no "English changed →
re-flag translations" mechanism beyond regenerating payloads.
**Fix:** decide whether the quote stays (if yes, restore it in English; if no, strip it from the 12
files). Then add a per-key English-source hash to payloads so a changed English string
automatically re-enters the delta.

## 4. Meaning-changing mistranslations (worst per language)

These are the "rookie mistakes" — mostly homonym traps in the long ip_ notes, where a polysemous
English word was translated with the wrong sense.

**Direction/physics errors (safety-relevant):**
- **tr** `rc_yn`/`rc_Hp` tips: "reduces **upstream** erosion" → "**mansap** erozyonunu azaltır"
  (= downstream). Twice. (`rc_pond_ok` uses "memba" correctly, contradicting itself.)
- **ar** `rc_notes_6_def`: "**downstream** channel bed" → "القناة **المنبعية**" (reads as
  source/upstream side). Also "التآكل المنبعي" is a nonstandard coinage for upstream erosion.
- **es** `ip_elev_ds`: "DS Elev." → "Elev. **AG.**" — ambiguous between aguas arriba/abajo.
  Suggest "Elev. ab." or "Cota aguas abajo".
- **ro** `rc_sg`: "specific gravity" → "greutatea specifică" (= specific weight, has units).
  Should be "densitate relativă". (hr/sr "specifična težina" have the same issue; regionally
  tolerated but worth a glossary entry.)

**Homonym traps (same English word, wrong sense — each appears in the long notes):**
| English source | Wrong rendering | Languages |
|---|---|---|
| "the reach **right at** the takeoff" | translated as the direction "right" | de ("rechts neben"), bn ("ঠিক ডানে") |
| "**draw** / draws off" (withdrawal) | "drawing a picture" / garbled | uk ("малювання"), bg |
| "**textbook** low-quarter DU" | "manual" (fr "contrôle **manuel**" = manual check!) | fr; garbled in it/sr/ur/ps |
| "favorable **downhill run**" | "bag" (ur "تھیلا" ×3), "falling layer" (hr), "comfortable bottom run" (he) | ur, hr, he, fa |
| "higher-**friction** lateral" | "more **viscous** lateral" | hr ("viskozniju") |
| "**reach**" (pipe segment) | "arrival" (ps "رسیدل"), "agent" (sw "mwakala"), "stripe" (km "ឆ្នូត") | ps, sw, km |
| "**test** path/lateral" | "**default** path" (km "លំនាំដើម" — software sense of *test/default*) | km |
| "**emitter**" | "click device" (km "ឧបករណ៍ចុច", ចុច = click) | km |
| "non-**compensating** emitters" | "emitter without a **bathroom**" (sw "bila **bafuni**") | sw |
| "**Upstream**" (column header) | "upgrade" (my "အဆင့်မြှင့်" — software sense) | my |
| "emitter **discharge**" | electrical discharge (ru "разряд"), Entladung (de) | ru, de |
| "velocity **head**" | anatomical head (cs "rychlostní **hlava**"; should be "rychlostní výška") | cs |
| "over-/under-pressured" | "disassembly" (ru "переразборки/недоразборки") | ru |
| "hydraulically worst" | "liquid-thermally" (ur "مائع حرارتی") | ur |
| "outlet **apron**" | kitchen apron (it "**grembiule** di uscita"; correct term "platea" appears in its own sketch label!) | it |
| "inlet **weir** head" | "throne" (it "carico al **soglio**"; should be "soglia"/"stramazzo") | it |
| "inlet channel" | "sewer" (cs "vtoková **stoka**") | cs |
| "extended (to a network)" | "removed" (he "הורחק" for הורחב) | he |
| "branch off" | "being educated" (he "מתחנכות" for מסתעפות) | he |

**"Energy Grade Line" is calqued wrong in almost every language** — es "Línea de Grado de
Energía", pt "Linha de Grau de Energia", it "Linea di Grado Energia", fr "ligne d'énergie grade",
ro "Linia Gradului Energetic", bg/uk "line of the energy *class*", cs "energy *layer*". Correct
terms: es "línea de energía", fr "ligne d'énergie/de charge", de "Energielinie", ru
"линия энергии/напорная линия", etc. This term must go in the glossary.

**Nonwords / word salad / contamination:**
- **he**: "הוודות" (nonword, used everywhere for *uniformity*; should be אחידות);
  "אנדרסטייט" (transliterated "understate"); "בעיתון" ("in a newspaper" — garble of "addressed");
  "מקוונת" gender error in the page title.
- **bg**: `ip_notes_2_def`/`3_def` are word salad ("счетоводство на дебит облекло" = "accounting
  of flow clothing"); contains a stray **Portuguese** word ("própriu") and a **Russian** word
  ("спроса"). Needs full retranslation of the ip_ notes.
- **sr**: prefixes nearly every pressure/flow with "емисиони" (emission) — "унесени емисиони
  притисак напајања" = "entered *emission* supply pressure" — pervasive and wrong; mixes Latin
  and Cyrillic script within the same section (ip_n_e "Emiteri po laterali" vs Cyrillic
  neighbors); "нискокартилног квартила", "противелатерало" garbles.
- **am**: ip_ section is largely broken — "ስንጋይ ግፊት" (nonword for irrigation), emitters =
  "ሳቢዮች" (attractors), upstream = "ወደ ላይ ሃይል" (upward power), `ip_count` tip is word salad; the
  rc_ crest label contains **Korean**: "የላይኛው ጫፍ 곡선 ራዲየስ".
- **km**: contains **Korean** 침 (from 침식, erosion) embedded 3× ("ការ침ខ្ទេច"); "ch ute" split
  word; median → "មធ្យោបាយ" (means/method).
- **uk**: systematic gender errors on витрата (fem.) used as masc. ("питомий … витрата", "повним
  витратом") throughout rc_; "найдалечому" nonword.
- **de**: `ip_notes` grammar collapse — "das gleiche geschlossene Probleme", "ob oder ob nicht",
  "einen Testpfad nur"; "Energiegradienlinie" typo.
- **cs**: "defaultuje/defaultovala", "neispravený" (Slovak), "zadaému" typo, "mikroirrigace"
  (should be mikrozávlaha).
- **it**: informal *tu* register throughout ip_ ("inseriscila", "il tuo laterale") vs the formal
  register rule; "sottostimerrebbe" typo; decimal comma/point mixed (0.5 vs 0,45).
- **ro**: "ar subestime" (broken verb form), "junction" left in English, "alergare favorabilă în
  jos" (favorable running downhill); "Rigolă" = roadside gutter for chute (see §5).
- **ru**: apart from English tooltips: "Давление в ирригации" is awkward (better: "Давление в
  оросительной сети"); rc_ section is otherwise the strongest Slavic translation.
- **ur**: "per" constructions inverted — `ip_n_e` "لیٹرل فی ایمیٹر" reads "lateral per emitter"
  (and `ip_n_l`, `ip_q_lat` likewise); many untranslated English words in notes (inlet, input,
  prejudice, over-/under-pressured).
- **ps**: notes truncated (whole clauses of `ip_notes_2/3_def` silently dropped — content loss);
  garbage tokens ("تر ثواري", "ګمو-سل"); "رسیدل" for reach.
- **sw**: lateral = "taji" (crown), reach = "mwakala" (agent), ponding = "mafuriko" (floods) in
  half the strings and "bwawa" (dam/pond) in the other half.
- **fa**: "تغیییر" typo (3 ی) repeated; "شوت" (borrowed *chute*) in labels vs the glossary term in
  the title; "نزدیک‌شده" garble for "rated".

**Cleanest languages:** zh (excellent throughout), id (very good), es/pt/fr/it/tr rc_ sections
(good, with the specific issues above), ar (good but with the direction error), he rc_ (good; ip_
poor). Pattern: rc_ (translated in a focused sprint with glossary support) is consistently better
than ip_ everywhere.

## 5. Glossary non-compliance (glossary says X, lang file says Y)

The glossary's own flagship term "rock chute" is violated in at least 7 languages:

| Lang | Glossary | Lang file | Note |
|---|---|---|---|
| fr | coursier en enrochement | **Chute en Enrochement** | Violates the glossary's own CRITICAL WMO-385 note ("chute" = fall, cannot name the structure) |
| de | Steinschütte | Steingerinne | Steingerinne is defensible; pick one and align |
| hr | kameni skluz | Kameni Žlijeb | žlijeb = gutter/groove |
| ro | canal rapid de anrocament | Rigola din Piatră | rigolă = roadside gutter — clearly wrong register |
| ru | каменный быстроток | Каменный Лоток | лоток = tray/flume, loses the steep sense |
| uk | кам'яний швидкотік | Кам'яний Лоток | same |
| bg | каменна бързина | Каменен Улей | улей = chute/trough, weaker but livable |
| ar | انتظام التوزيع (DU) | توحيد التوزيع | توحيد = unification — wrong term for uniformity |
| tr | taş eğimli kanal | Taş Düşü | Here the *lang file* is better — "düşü" is real Turkish hydraulics; update the glossary instead |

sr, es, km, bn, fa, pt titles do match the glossary. Conclusion: **the glossary was written or
revised after the rc_ sprint and never reconciled against the shipped files** — or compliance
checking only covers some languages. `glossary_compliance_audit.php` should be run/extended to
flag all of the above.

Also verify the glossary itself: **es "bajante de rocado"** — "rocado" is not standard Spanish
(the word is "enrocado"); the entry claims "USDA uses 'bajante de rocado'" but is marked
`source: ai-generated`. Please verify against an actual USDA-NRCS Spanish document; if it can't
be verified, use "bajante de enrocado" or "rápida de enrocado".

## 6. Internal term drift (same concept, two words on the same page)

- es: chute = "bajante" in titles but "canal" in every label/tooltip; apron = "colchón" in labels
  but "Zampeado" in the sketch.
- fr: emitter = "émetteur" (ip_se, ip_a_e) vs "goutteur" (everywhere else); "main" untranslated in
  `ip_is_lateral`/`ip_notes_2_term` ("Tronçons Main") vs "conduite principale" available.
- it: lateral = "manichetta" (Application Design section) vs "laterale" (test-path section).
- ar: emitter = "المُشَتِّتات" in labels vs "أجهزة التشتيت" in tooltips; both are questionable —
  the standard drip-irrigation term is "المنقّطات".
- fa: chute = glossary term in titles vs "شوت" in labels.
- pt: rock mantle = "manto de pedra" vs enrocamento elsewhere (minor).
- sw: ponding = bwawa vs mafuriko; hr: "kamenog obloga" wrong gender agreement repeated
  (should be "kamene obloge").
- Cross-calculator references: "Manning Pipe Flow calculator" is left in English in es/fr/ro/uk,
  translated ad hoc in pt/it/ru/sr/cs — none match the actual localized `mpf_main_menu` value the
  user sees in the menu.

## 7. Convention inconsistencies (need a policy decision, then enforcement)

1. **Subscript variable names**: en uses `z_supply`, `q_design`, `q_last`, `q_avg,field`.
   ru/bg/he/fr/hr translate them (`z_подачи`, `q_moy,terrain`, `q_תכנון`); uk/sr/cs/km/id keep
   English; de/ro lost them to the tag bug. Recommend: **keep subscripts in English/Latin across
   all languages** (they are symbols, matching the sketch/formulas), and say so in a rule + intent
   note. RTL languages especially should not translate subscripts (bidi rendering chaos).
2. **Decimal separator**: es/pt/fr/de/tr/ro/hr/sr/ru/uk/bg/cs use comma (good), but it and ro mix
   comma and period within the same calculator; ar/fa/he/id/zh/… keep period (fine). Rule needed:
   "match your language's convention and be internally consistent; the input fields themselves
   accept period."
3. **Register**: it uses informal *tu*; everything else formal. Align it to formal (as rule 6
   already requires).
4. **Warning-string glyphs**: everyone preserved ⚠/✓ correctly — good.

---

## 8. Recommended intent-string additions (a)

105 of 114 `$ec_lang_intent` slots are empty. Don't fill all of them — fill the ones that caused
real errors above. Draft text (English), highest value first:

- `ip_notes_1_def` / `ip_notes_2_def` / `ip_notes_3_def`: "Technical prose. 'Reach' = a pipe
  segment between two nodes (not 'arrival'). 'Draw / draws off' = water withdrawal. 'Right at the
  takeoff' = exactly at that location (not the right-hand side). 'Energy Grade Line' = the
  standard hydraulics term for the total-head line in your language; never translate word-by-word.
  'Textbook' = as defined in standard textbooks (adjective), not a manual. 'A favorable downhill
  run' = the pipe descends, gaining elevation head. 'Bisection' = the numerical root-finding
  method. Keep q_last, q_avg,field, q_design, k, H, x, F(n) exactly as-is."
- `ip_du_estimate`: "'Low-quarter Distribution Uniformity' is the irrigation-engineering
  statistic DU_lq (average of the lowest quarter of measurements divided by the overall average).
  Use your language's established irrigation-engineering term; do not invent a phrase."
- `ip_worst_case_warn`: "'Higher-friction lateral' = a lateral with more friction loss (longer,
  smaller, rougher) — not viscosity."
- `ip_x`: "'Discharge exponent' = the exponent x in q = k·H^x describing emitter hydraulic
  behavior. 'Discharge' here is water outflow, never electrical."
- `ip_is_lateral`, `ip_count`: "'Main' = the mainline/trunk pipe; 'lateral' = the branch line
  carrying emitters. 'Test' = the path being analyzed (not 'default'). Use your language's drip
  irrigation terms."
- `ip_elev_ds`: "'DS' abbreviates downstream. The abbreviation you choose must be unambiguously
  downstream, not confusable with upstream."
- `ip_group_upstream` / `ip_group_downstream`: "Direction along the water's path: upstream =
  toward the supply, downstream = toward the last emitter. These are hydraulics terms, not
  software terms (not 'upgrade'/'downgrade')."
- `ip_main_menu` / `ip_main_title`: "Pressure in a pressurized irrigation system (drip/sprinkler
  network). 'Uniformity' = evenness of water application among emitters."
- `ip_pr`: "Application rate = depth of water applied per unit time (mm/h); agronomic term."
- `ip_hv`/`ip_hf`/`ip_hm`/`ip_hl` and all subscripted symbols: "Symbol; keep subscript text
  exactly as in English."
- `rc_sg`: "Specific gravity = dimensionless ratio of rock density to water density (relative
  density). Not specific weight (which has units)."
- `rc_Hp` / `rc_notes_7_def`: "'Weir head' = the upstream water-surface height above the weir
  crest (a length), not a pressure."
- `rc_yn` tip: "'Upstream erosion' = erosion above/before the inlet. Direction matters; do not
  flip it."
- `rc_apron_length` / `rc_notes_6_def`: "'Apron' = the flat protective slab/pad of rock at the
  chute outlet (hydraulic-structures term — platea/radier/Vorboden/护坦 family), never clothing."

## 9. Recommended glossary additions (b)

New terms (with `context` + `translation_notes`; translations to be filled by a focused
mini-sprint or by hand for anchor languages):

1. **energy grade line** (symbol EGL) — the single most-mangled term in this audit.
2. **lateral** (irrigation branch line) + **mainline/main** — pair them in one entry so the
   contrast is translated consistently.
3. **emitter** — note: water-outlet device (dripper/sprinkler); ar prefer "منقّط",
   fr "goutteur" (choose and stick), fa "قطره‌چکان" (already consistent).
4. **reach** (pipe/channel segment) — explicitly "not arrival/extent".
5. **velocity head / friction loss / minor loss** — one entry each or one combined
   "head (hydraulic)" entry: head = height of water column, never anatomical.
6. **weir head** — length above crest.
7. **low-quarter distribution uniformity (DU_lq)** — extend the existing DU entry with the
   low-quarter phrasing.
8. **apron (outlet apron)** — es zampeado/colchón (pick one), it platea, fr radier, de
   Vorboden/Tosbecken-Sohle, zh 护坦.
9. **ponding / backwater** — es remanso, ru подпор, cs vzdutí, sw (NOT mafuriko).
10. **upstream / downstream** — trivial words, but tr and ar flipped them; an entry with memba/
    mansap, منبع/مصب pinned would have prevented both.
11. **specific gravity (relative density)** — dimensionless; ro densitate relativă etc.
12. **application rate (PR)** and **application depth** — agronomic pair.
13. Fix existing entries: verify es "bajante de rocado" (§5); change tr rock chute to "taş düşü";
    reconcile fr/de/hr/ro/ru/uk/bg lang files with the rock-chute entry (or vice versa) and rerun
    the compliance audit.

## 10. Translation-algorithm insights (c)

1. **Long strings are the failure mode.** Labels ≤6 words are near-perfect in every language;
   140+-word notes collapse (bg/am word salad, ps truncation, he nonwords). Haiku at
   temperature 0 with 1500 max_tokens is being asked to translate 5 dense paragraphs in one shot.
   Fixes, cheapest first:
   - Split the notes into their own batch with a *much* smaller per-request scope (1–2 long
     strings per request) and a higher max_tokens ceiling; truncation (ps) looks like a token cap.
   - For `*_notes_*_def` keys only, consider a stronger model (Sonnet) — they're ~15% of keys but
     ~90% of the meaning errors. Keep Haiku for labels.
   - Add a second **back-translation QA pass** (Haiku is fine here): translate the target string
     back to English, diff against source, flag semantic mismatches ("more viscous lateral",
     "emitter without a bathroom" would both have been caught instantly).
2. **The intent mechanism works — where it exists.** rc_ keys with rich glossary context
   translated far better than ip_ keys, and the calques cluster exactly on the polysemous words
   with no intent note. Filling §8 above will fix more than any model change.
3. **Enforce the glossary mechanically.** `glossary_compliance_audit.php` either isn't run or
   doesn't cover these prefixes — 7+ languages ship a rock-chute term that contradicts the entry.
   Make the sprint driver refuse to write a file whose title keys fail glossary compliance.
4. **Post-sprint validator gaps.** Add rules: no `\/` or `\"` in values; no `<sub>`/`<span>` tag
   imbalance vs English; no value byte-identical to English when English has ≥1 real word; no
   Latin script >40% in a non-Latin-script language's long strings (catches untranslated
   tooltips); no characters from foreign scripts (Hangul in km/am, Cyrillic in bg-only, etc. —
   a per-language allowed-Unicode-range check).
5. **Stale-source detection.** Store the English source hash per key in each lang file's payload;
   regenerating payloads should flag keys whose English changed since the last translation
   (§3 would have been caught).
6. **Cross-reference localization.** When a string names another calculator or section ("Manning
   Pipe Flow calculator", "Application Design"), the prompt should inject that key's *already
   translated* value for the target language and instruct the agent to use it verbatim. The
   neighbor-context mechanism already exists; extend it to explicit cross-references.
7. **Symbol policy in the rules.** Add to RULES: "Subscripted variable names (z_supply, q_last,
   q_avg,field …) are symbols: keep them exactly as in English in every language, including RTL."
   That single rule removes a whole class of inconsistency (§7.1).
8. **Serbian script rule.** Declare sr = Cyrillic in the prompt (or Latin — but pick one); the
   file currently mixes.

## 11a. Repairs applied 2026-07-05 (same session)

- **§1 pipeline bugs fixed**: `<\/` unescaped in de/hr/ro/fa/**km** (km had 15 more the manual
  audit missed — caught by the new validator); `\"` unescaped in uk. All 27 files lint clean.
- **§2 stragglers fixed**: fa/hi "(hours)" translated; am `ip_group_reach` translated.
- **§3 stale Robinson quote** stripped from `rc_apron_length` in all 12 languages (matches the
  current shortened English).
- **§4 direction errors fixed**: tr memba/mansap (4 occurrences incl. one in notes_7 the audit
  had underlogged), ar downstream channel bed, es "Elev. AG." → "Elev. abajo".
- **Foreign-script contamination purged**: Korean/Katakana characters removed from km (침 ×4),
  am (탭, 곡선, ループ), my (둑) with proper native replacements.
- **sr script mix fixed**: 6 Latin-script ip_ labels transliterated to Cyrillic.
- **Markup restored**: hi/my `k·H^x` → `k·H<sup>x</sup>`. Remaining known gap: my
  `ip_notes_3_def` dropped the ratio symbols entirely — needs retranslation, on the list below.
- **§8 intent strings**: 30 entries written to lang.ec.en.php (user-authorized).
- **§9 glossary**: 14 new terms added (energy grade line, lateral, mainline, emitter, reach,
  velocity head, weir head, outlet apron, ponding, upstream, downstream, specific gravity,
  friction loss, minor loss, low-quarter DU); tr rock chute → "taş düşü"; es "rocado"
  verification flag recorded; DU notes extended.
- **§5 reconciliation applied** for fr/ro/ru/uk rc_ chute terminology (glossary term adopted:
  coursier en enrochement / canalul rapid de anrocament / быстроток / швидкотік). Deferred
  pending human review of the glossary side: hr, bg, de (notes recorded in glossary entry).
- **§10 tooling**: `lang_syntax_validate.php` extended with escaped-slash/quote, tag-imbalance,
  foreign-script (Hangul/Kana), and identical-to-english checks; `glossary_compliance_audit.php`
  extended from 4 to 10 terms (now covers rock chute, riprap, emitter, DU, ponding, outlet
  apron); `generate_translation_payloads.php` gained the missing **`ip` prefix→terms mapping**
  (ip_ had been sprinting with only the default flow/velocity/slope glossary — a root cause of
  its poor quality) and richer rc lists. Payloads regenerated.
- Validator now reports only `identical-to-english` warnings (121, mostly suite-wide `calc_*`
  keys outside this scope; a few are legitimate cognates like it/pt "Press.", fr "Limitations").

## 11b. Retranslation sprint outcome 2026-07-06

10 Haiku agents were launched for the defective ip_ blocks (ru, hi, bg, am, he, sw, km, my, ps,
ur). Most hit a session limit mid-run; results were mixed and instructive:
- **Completed well**: ru (needed 4 hand-fixes: Latin subscript, node-vs-water-level, case errors),
  hi (clean).
- **Completed with the same old failure modes**: my (new Korean/Katakana contamination, garbled
  notes, deleted two keys), ps (escaped `\"` throughout — caught by the new validator), sw
  (reused the explicitly forbidden "taji" and invented "Ukakamavu"), am (1 of 21 keys, garbled).
- **Untouched**: bg, he, km, ur (session limit before any writes; the ur agent failed to launch).

Conclusion recorded for future sprints: **Haiku is not reliable for long technical prose in
low-resource languages even with glossary + intent injection.** The remainder (bg 17, he 18,
ur 21, sw 15, am 18, km 29, my 18 strings) was translated inline by Claude (Fable 5) with
per-language verification. Final state: all 26 languages pass lint, rc_/ip_ tag parity vs
English, and the extended validator. **Native-speaker review recommended** for am, km, my, ps
(competent but not native-verified); bg/he/ur/sw are high-confidence.

## 11. Suggested repair order

1. Mechanical fixes (same day): de/hr/ro `<\/`, uk `\"`, fa `\/`; sr Latin-script lines; stale
   apron quote decision.
2. Retranslate worst ip_ blocks with intent notes in place: bg, am, he, sw, km, my, ps, ur
   (notes + tooltips only, not labels).
3. Patch targeted meaning errors in otherwise-good languages: tr mansap/memba, ar downstream,
   es AG./EGL/OTROS, fr manuel/Main/goutteur-émetteur, it grembiule/soglio/tu-register,
   cs hlava/stoka, de rechts/notes, ro rigolă+notes, ru tooltips+разряд, uk gender+tooltips,
   hi/km/my English tooltips.
4. Glossary reconciliation + new entries (§9), then rerun compliance audit.
5. Add validator rules (§10.4) so the next sprint can't reintroduce these classes.
