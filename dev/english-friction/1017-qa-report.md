# Sprint 1017 cross-language QA report

Reader: QA subagent, 2026-10-17. The base for "what the sprint changed" is e6ac0b78e (pre-sprint); the sprint itself is now commit a2f8af97f, and every fix below is uncommitted on top of it, in the 26 non-English lang files only (23 of them touched). `php dev/scripts/lang_syntax_validate.php`: "No syntax validator findings." `php dev/scripts/lang_key_order_normalizer.php --check`: "All language files match English key order." Tags and {placeholders} in every edited key match English.

Counts are distinct (language, key) pairs edited per check: 1 box titles 4; 2 quoted box and menu names 184; 3 PBV/GPV 0; 4 category names 7; 5 ready-made scenario names 10; 6 concept consistency 9; 7 clustering and label quotes 23.

## English findings (report only, English not edited)

1. **lpn_crit_minpressure_tip, lpn_ds_minpressure_tip** still say "the same number as Lowest pressure allowed elsewhere in Fire flow analysis". That is the same defect Wave 0 fixed in lpn_guide_cr_case_def and lpn_guide_ds_find_def: "elsewhere" reads as an adverb. Of 26 languages, 15 split the label (lpn_ff_minpressure) and wrote "Lowest pressure allowed, in other places of the analysis": ar, de (ds), es (crit), fr (ds), he (ds), id (ds), km (ds), pt (ds), ro (ds), ru (ds), sr (ds), tr, uk, ur, zh. Suggested English: "This is the same number as the Lowest pressure allowed elsewhere box in Fire flow analysis." Translations were left as they are until the English changes.
2. **lpn_guide_tb_row_def**: "the row also shows the menu path after the words Also in" assumes the label's words come before the path. In am, bn, hi, my, ps, ur and tr, lpn_guide_also ("Also in {menu}") puts the words AFTER {menu}, so the sentence cannot quote it literally. Those languages paraphrased it, and the result misstates the order. I fixed the prepositional languages (see check 7). Suggested English: "the row also shows Also in with the menu path, as in Also in Water, Analyze".
3. **lpn_full_needs_run**: the menu path says "Water, Reports, Full report", but the Reports row is "Full" (lpn_reports_full). es, fr, id, it, pt, ro and sw followed the English and quote the box title. Left as is.
4. **lpn_guide_bx_keep_def** names the Calibration report box "Calibration", which is its menu row word (lpn_reports_calib), not its title. Minor. Also, this key's English changed from "Critical assets" to "Criticality analysis" in a2f8af97f, after the translators had written it, so all 26 translations still said "critical assets/elements". Fixed in 19 languages; es and the others already had the title.
5. **Clustering (check 7)**: lpn_sm_copy_ask, lpn_scenario_basic_tip and lpn_engine_valve_route each produced ONE reading in all 26 languages. For the 19 keys Wave 0 rewrote, I spot-read the rewritten clause in es fr de it pt ro ru tr id zh cs, and all of them in the Ctrl+K sentence, the minimum-pressure box, the H₀, a, and b list, the Also in sentence and the menu-path sentences. No split, except items 1 and 2 above. ru reads "alternatives are hidden and automatic" as "created automatically", a single outlier and not a split.

## Concept collision for ROADMAP Task 737 (check 8, report only)

- **am** uses ሁኔታ for both scenario and status: 119 scenario strings and 21 status strings, including lpn_scenario_label/lpn_result_status (both ሁኔታ), lpn_scenario_menu ሁኔታዎች, lpn_status_title and lpn_reports_status የሁኔታ ለውጦች, lpn_scncmp_title የሁኔታዎች ንጽጽር, lpn_sm_title ሁኔታዎች አስተዳዳሪ, lpn_labels_init_status, lpn_settings_row_status_report, lpn_settings_row_check_freq, lpn_settings_row_max_check and lpn_status_empty. lpn_guide_scn_open_def and lpn_ds_intro use the word in both senses in one string.
- **my** uses အခြေအနေ the same way: 120 scenario strings and 21 status strings, the same keys, including lpn_scenario_label and lpn_result_status (both အခြေအနေ), and three box titles that begin alike: Scenario comparison, Status changes and Scenario manager. The my translator had reordered two of these titles with a dash to tell the tabs apart. I restored the natural titles (check 1); they still differ within 12 characters. No new words were invented.

## Other findings worth Tom's or the orchestrator's attention (not fixed)

- **Dead keys on one physical line.** In all 26 non-English files, lpn_guide_text_alt_box, lpn_guide_how_alt, lpn_alt_calc_options, lpn_scenario_duration_tip and lpn_scenario_hyd_step_tip (fr lacks the first) sit on ONE line together with lpn_screenshot_scale_tip. None of them is in English or in the code. The `^`-anchored parsers miss them, which is probably why the order check is quiet. The ru alt_box text still names the old "Включение элементов" category, but it is not rendered. Candidates for key_hygiene; not deleted here.
- **PBV label vs prose wording.** zh lpn_valve_type_pbv 减压定值（PBV） begins like PRV 减压（PRV）, while the prose says 压力断路阀. km's label ការកាត់បន្ថយសម្ពាធថេរ differs from its prose វ៉ាល់បំបែកសម្ពាធ, my's label ဖိအားချိုး from its prose ဖိအားဖြတ်, and it's label Rompitratta di pressione from its prose frangipressione. No language says PRV/PSV/FCV where the English says PBV/GPV (check 3: the abbreviation counts match English in every key that names a valve type).
- **cs lpn_notes_5_def** "H₀, a a b": the Czech conjunction "a" collides with the symbol a, the very defect Wave 0's serial comma fixed in English.
- **de** writes Strg+ in 12 strings and Ctrl+ in 5.
- **bg** lpn_sm_list_overrides "Собствени стойности…" and lpn_ovl_title "Собствени стойности: {name}" leave out "manager". The prose follows the row, so it is consistent.
- **ps** lpn_ff_minpressure "ټیټ ترین فشار چې چیرته نور اجازه لري" is a doubtful label. The prose now quotes it as it stands.
- **Box titles that share a prefix but pass the 12-character test:** it and pt "Scenari:/Cenários:" confronto vs gestione/gerenciador (they differ at characters 10 and 11), ps سناریو: پرتله / سناریو: مدیر, hi परिदृश्य तुलना / प्रबंधक, tr Senaryo karşılaştırması / yöneticisi. Kept.
- **Slavic and Hebrew inflected forms** of an unreordered title in prose ("в менеджере сценариев", "במנהל התרחישים", "Сценарния мениджър") were judged to be the same term and left alone. Lowercase fr/it mentions of the ready-made scenarios ("le jour moyen") were also left.

## Glossary decisions worth recording (term, language, rendering)

- Scenario manager, fa: مدیر سناریو (singular; the title was changed from مدیر سناریوها to match the menu row and all prose).
- Override, ps: ځانګړی ارزښت; custom (custom property), ps: دودیز. The status strip had used دودیز for overrides; fixed. lpn_alt_cat_userdata had used ځانګړي for custom; fixed to دودیز ځانتیاوې.
- Override, tr: Senaryo değeri (the label). The strip "Kendi değer sayısı" and lpn_delete_drops_overrides "geçersiz kılma" were fixed to it.
- Contour line, my: တန်ဖိုးတူမျဉ်း (iso-value line), not အမြင့်မျဉ်း (height line). The latter stays only for terrain elevation.
- Also in {menu}, zh: 另见 {menu}. The old 中的其他项 meant "other items in".
- Ready-made scenario Mid, sw: Jaribio la mtiririko: Kati. The old Wastani was the same word as Average Day (Siku ya wastani).
- Box carrier nouns used when a reordered colon title sits in a sentence: bg кутия, cs okno, hr/sr okvir/оквир, ru окно, uk вікно, ro casetă, pt caixa, it riquadro, sw kisanduku, ps بکس. he quotes after a prefix letter (ב"…"), as in ב"העתק".
- Scenario names in prose: the six names are created in the visitor's language from lpn_scenario_preset_* (js/looped-network.js, LPN_PRESET_SCENARIOS), so prose must quote those values, digits included. de, ps and ur had left them in English.

## Fixes

### Check 1: box titles (4 substitutions)

| lang | key | old | new | why |
|---|---|---|---|---|
| bn | lpn_scncmp_title | তুলনা: দৃশ্যকল্প | দৃশ্যকল্প তুলনা | Box title put a non-subject word first (Comparison: scenario); restored the scenario-first title, which already differs from the Scenario manager title within 12 characters |
| my | lpn_scncmp_title | နှိုင်းယှဉ်ချက် - အခြေအနေ | အခြေအနေ နှိုင်းယှဉ်ချက် | Box title reordered to a non-subject first word with a dash (Changes - status / Comparison - scenario); restored the natural phrase. The shared word for scenario and status is the concept collision reported for Task 737 |
| my | lpn_status_title | ပြောင်းလဲမှုများ - အခြေအနေ | အခြေအနေ ပြောင်းလဲမှုများ | Box title reordered to a non-subject first word with a dash (Changes - status / Comparison - scenario); restored the natural phrase. The shared word for scenario and status is the concept collision reported for Task 737 |
| ur | lpn_scncmp_title | موازنۂ منظرنامہ | منظرنامہ موازنہ | Box title reordered to put comparison first; restored the scenario-first title, parallel to the Scenario manager title |

### Check 2: names of boxes and menu rows quoted in prose (237 substitutions)

| lang | key | old | new | why |
|---|---|---|---|---|
| bn | lpn_guide_text_scncmp_box | তুলনা: দৃশ্যকল্প | দৃশ্যকল্প তুলনা | Quote of the box title follows the restored title |
| bn | lpn_guide_scn_open_def | তুলনা: দৃশ্যকল্প | দৃশ্যকল্প তুলনা | Quote of the box title follows the restored title |
| bn | lpn_guide_scn_example_def | তুলনা: দৃশ্যকল্প | দৃশ্যকল্প তুলনা | Quote of the box title follows the restored title |
| bn | lpn_guide_cmp_notes_def | তিনটি তুলনা: দৃশ্যকল্প করে | তিনটি দৃশ্যকল্প তুলনা করে | Title substitution had replaced the verb phrase compares three scenarios with the box title |
| ur | lpn_guide_text_scncmp_box | موازنۂ منظرنامہ | منظرنامہ موازنہ | Quote of the box title follows the restored title |
| ur | lpn_guide_scn_open_def | موازنۂ منظرنامہ | منظرنامہ موازنہ | Quote of the box title follows the restored title |
| ur | lpn_guide_scn_example_def | موازنۂ منظرنامہ | منظرنامہ موازنہ | Quote of the box title follows the restored title |
| ur | lpn_sm_compare_tip | موازنۂ منظرنامہ | منظرنامہ موازنہ | Quote of the box title follows the restored title |
| ar | lpn_guide_scn_use_def | تحليل تدفق الحريق | تدفق الحريق: تحليل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ar | lpn_guide_cr_case_def | تحليل تدفق الحريق | تدفق الحريق: تحليل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ar | lpn_guide_ds_find_def | تحليل تدفق الحريق | تدفق الحريق: تحليل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ar | lpn_ff_required_node_tip | تحليل تدفق الحريق | تدفق الحريق: تحليل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ar | lpn_crit_minpressure_tip | تحليل تدفق الحريق | تدفق الحريق: تحليل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ar | lpn_ds_minpressure_tip | تحليل تدفق الحريق | تدفق الحريق: تحليل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| bg | lpn_guide_own_example_def | Анализ на противопожарно водно количество | Противопожарно водно количество: анализ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| bg | lpn_ff_required_node_tip | Анализ на противопожарно водно количество | Противопожарно водно количество: анализ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| bg | lpn_crit_minpressure_tip | Анализ на противопожарно водно количество | Противопожарно водно количество: анализ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| bg | lpn_ds_minpressure_tip | Анализ на противопожарно водно количество | Противопожарно водно количество: анализ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| bg | lpn_guide_own_example_def | Анализ на критичността | Критичност: анализ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| bg | lpn_sm_compare_tip | Сравнение на сценарии | Сценарии: сравнение | Names the box by its pre-sprint title; the box title was reordered this sprint |
| cs | lpn_ff_required_node_tip | Analýza požárního průtoku | Požární průtok: analýza | Names the box by its pre-sprint title; the box title was reordered this sprint |
| fa | lpn_guide_scn_use_def | تحلیل جریان آتش‌نشانی | جریان آتش‌نشانی: تحلیل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| fa | lpn_guide_cr_case_def | تحلیل جریان آتش‌نشانی | جریان آتش‌نشانی: تحلیل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| fa | lpn_guide_ds_find_def | تحلیل جریان آتش‌نشانی | جریان آتش‌نشانی: تحلیل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| fa | lpn_guide_own_example_def | تحلیل جریان آتش‌نشانی | جریان آتش‌نشانی: تحلیل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| fa | lpn_ff_required_node_tip | تحلیل جریان آتش‌نشانی | جریان آتش‌نشانی: تحلیل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| fa | lpn_crit_minpressure_tip | تحلیل جریان آتش‌نشانی | جریان آتش‌نشانی: تحلیل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| fa | lpn_ds_minpressure_tip | تحلیل جریان آتش‌نشانی | جریان آتش‌نشانی: تحلیل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| fa | lpn_guide_own_example_def | تحلیل بحرانی بودن | بحرانی بودن: تحلیل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| he | lpn_guide_scn_use_def | ניתוח ספיקת כיבוי אש | כיבוי אש: ניתוח ספיקה | Names the box by its pre-sprint title; the box title was reordered this sprint |
| he | lpn_guide_cr_case_def | ניתוח ספיקת כיבוי אש | כיבוי אש: ניתוח ספיקה | Names the box by its pre-sprint title; the box title was reordered this sprint |
| he | lpn_guide_ds_find_def | ניתוח ספיקת כיבוי אש | כיבוי אש: ניתוח ספיקה | Names the box by its pre-sprint title; the box title was reordered this sprint |
| he | lpn_guide_own_example_def | ניתוח ספיקת כיבוי אש | כיבוי אש: ניתוח ספיקה | Names the box by its pre-sprint title; the box title was reordered this sprint |
| he | lpn_ff_required_node_tip | ניתוח ספיקת כיבוי אש | כיבוי אש: ניתוח ספיקה | Names the box by its pre-sprint title; the box title was reordered this sprint |
| he | lpn_crit_minpressure_tip | ניתוח ספיקת כיבוי אש | כיבוי אש: ניתוח ספיקה | Names the box by its pre-sprint title; the box title was reordered this sprint |
| he | lpn_ds_minpressure_tip | ניתוח ספיקת כיבוי אש | כיבוי אש: ניתוח ספיקה | Names the box by its pre-sprint title; the box title was reordered this sprint |
| he | lpn_guide_own_example_def | ניתוח קריטיות | קריטיות: ניתוח | Names the box by its pre-sprint title; the box title was reordered this sprint |
| hr | lpn_ff_required_node_tip | Analiza protupožarnog protoka | Protupožarni protok: analiza | Names the box by its pre-sprint title; the box title was reordered this sprint |
| id | lpn_guide_scn_use_def | Analisis debit kebakaran | Debit kebakaran: analisis | Names the box by its pre-sprint title; the box title was reordered this sprint |
| id | lpn_guide_cr_case_def | Analisis debit kebakaran | Debit kebakaran: analisis | Names the box by its pre-sprint title; the box title was reordered this sprint |
| id | lpn_guide_ds_find_def | Analisis debit kebakaran | Debit kebakaran: analisis | Names the box by its pre-sprint title; the box title was reordered this sprint |
| id | lpn_guide_own_example_def | Analisis debit kebakaran | Debit kebakaran: analisis | Names the box by its pre-sprint title; the box title was reordered this sprint |
| id | lpn_ff_required_node_tip | Analisis debit kebakaran | Debit kebakaran: analisis | Names the box by its pre-sprint title; the box title was reordered this sprint |
| id | lpn_crit_minpressure_tip | Analisis debit kebakaran | Debit kebakaran: analisis | Names the box by its pre-sprint title; the box title was reordered this sprint |
| id | lpn_ds_minpressure_tip | Analisis debit kebakaran | Debit kebakaran: analisis | Names the box by its pre-sprint title; the box title was reordered this sprint |
| id | lpn_guide_bx_keep_def | Analisis kekritisan | Kekritisan: analisis | Names the box by its pre-sprint title; the box title was reordered this sprint |
| id | lpn_guide_own_example_def | Analisis kekritisan | Kekritisan: analisis | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_guide_scn_use_def | Analisi della portata antincendio | Portata antincendio: analisi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_guide_cr_case_def | Analisi della portata antincendio | Portata antincendio: analisi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_guide_ds_find_def | Analisi della portata antincendio | Portata antincendio: analisi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_guide_own_example_def | Analisi della portata antincendio | Portata antincendio: analisi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_ff_required_node_tip | Analisi della portata antincendio | Portata antincendio: analisi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_crit_minpressure_tip | Analisi della portata antincendio | Portata antincendio: analisi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_ds_minpressure_tip | Analisi della portata antincendio | Portata antincendio: analisi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_guide_own_example_def | Analisi di criticità | Criticità: analisi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_guide_scn_open_def | Confronto tra scenari | Scenari: confronto | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_sm_compare_tip | Confronto tra scenari | Scenari: confronto | Names the box by its pre-sprint title; the box title was reordered this sprint |
| km | lpn_guide_scn_use_def | ការវិភាគលំហូរពន្លត់អគ្គីភ័យ | លំហូរពន្លត់អគ្គីភ័យ៖ ការវិភាគ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| km | lpn_guide_cr_case_def | ការវិភាគលំហូរពន្លត់អគ្គីភ័យ | លំហូរពន្លត់អគ្គីភ័យ៖ ការវិភាគ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| km | lpn_guide_ds_find_def | ការវិភាគលំហូរពន្លត់អគ្គីភ័យ | លំហូរពន្លត់អគ្គីភ័យ៖ ការវិភាគ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| km | lpn_guide_own_example_def | ការវិភាគលំហូរពន្លត់អគ្គីភ័យ | លំហូរពន្លត់អគ្គីភ័យ៖ ការវិភាគ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| km | lpn_ff_required_node_tip | ការវិភាគលំហូរពន្លត់អគ្គីភ័យ | លំហូរពន្លត់អគ្គីភ័យ៖ ការវិភាគ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| km | lpn_crit_minpressure_tip | ការវិភាគលំហូរពន្លត់អគ្គីភ័យ | លំហូរពន្លត់អគ្គីភ័យ៖ ការវិភាគ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| km | lpn_ds_minpressure_tip | ការវិភាគលំហូរពន្លត់អគ្គីភ័យ | លំហូរពន្លត់អគ្គីភ័យ៖ ការវិភាគ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| km | lpn_guide_own_example_def | ការវិភាគភាពសំខាន់ | ភាពសំខាន់៖ ការវិភាគ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| km | lpn_guide_bx_keep_def | ការធ្វើមាត្រដ្ឋានតម្រូវការ | តម្រូវការ៖ ការធ្វើមាត្រដ្ឋាន | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ps | lpn_guide_own_example_def | د اور بهاو شننه | اور بهاو: شننه | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ps | lpn_ff_required_node_tip | د اور بهاو شننه | اور بهاو: شننه | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ps | lpn_guide_own_example_def | د مهمیت تحلیل | مهمیت: تحلیل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ps | lpn_guide_bx_keep_def | د غوښتنې پیمانه کول | غوښتنه: پیمانه کول | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ps | lpn_guide_scn_open_def | د سناریوګانو پرتله | سناریو: پرتله | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ps | lpn_sm_compare_tip | د سناریوګانو پرتله | سناریو: پرتله | Names the box by its pre-sprint title; the box title was reordered this sprint |
| pt | lpn_guide_scn_use_def | Análise de vazão de incêndio | Vazão de incêndio: análise | Names the box by its pre-sprint title; the box title was reordered this sprint |
| pt | lpn_guide_cr_case_def | Análise de vazão de incêndio | Vazão de incêndio: análise | Names the box by its pre-sprint title; the box title was reordered this sprint |
| pt | lpn_guide_ds_find_def | Análise de vazão de incêndio | Vazão de incêndio: análise | Names the box by its pre-sprint title; the box title was reordered this sprint |
| pt | lpn_guide_own_example_def | Análise de vazão de incêndio | Vazão de incêndio: análise | Names the box by its pre-sprint title; the box title was reordered this sprint |
| pt | lpn_ff_required_node_tip | Análise de vazão de incêndio | Vazão de incêndio: análise | Names the box by its pre-sprint title; the box title was reordered this sprint |
| pt | lpn_crit_minpressure_tip | Análise de vazão de incêndio | Vazão de incêndio: análise | Names the box by its pre-sprint title; the box title was reordered this sprint |
| pt | lpn_ds_minpressure_tip | Análise de vazão de incêndio | Vazão de incêndio: análise | Names the box by its pre-sprint title; the box title was reordered this sprint |
| pt | lpn_guide_own_example_def | Análise de criticidade | Criticidade: análise | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ro | lpn_guide_scn_use_def | Analiza debitului de incendiu | Debit de incendiu: analiză | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ro | lpn_guide_cr_case_def | Analiza debitului de incendiu | Debit de incendiu: analiză | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ro | lpn_guide_ds_find_def | Analiza debitului de incendiu | Debit de incendiu: analiză | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ro | lpn_guide_own_example_def | Analiza debitului de incendiu | Debit de incendiu: analiză | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ro | lpn_ff_required_node_tip | Analiza debitului de incendiu | Debit de incendiu: analiză | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ro | lpn_crit_minpressure_tip | Analiza debitului de incendiu | Debit de incendiu: analiză | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ro | lpn_guide_own_example_def | Analiza criticității | Criticitate: analiză | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ro | lpn_guide_bx_keep_def | Scalarea cerinței | Cerință: scalare | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ru | lpn_guide_own_example_def | Анализ противопожарного расхода | Противопожарный расход: анализ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ru | lpn_ff_required_node_tip | Анализ противопожарного расхода | Противопожарный расход: анализ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ru | lpn_guide_own_example_def | Анализ критичности | Критичность: анализ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sr | lpn_guide_own_example_def | Анализа противпожарног протока | Противпожарни проток: анализа | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sr | lpn_ff_required_node_tip | Анализа противпожарног протока | Противпожарни проток: анализа | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sr | lpn_guide_own_example_def | Анализа критичности | Критичност: анализа | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sw | lpn_guide_scn_use_def | Uchambuzi wa mtiririko wa moto | Mtiririko wa moto: uchambuzi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sw | lpn_guide_cr_case_def | Uchambuzi wa mtiririko wa moto | Mtiririko wa moto: uchambuzi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sw | lpn_guide_ds_find_def | Uchambuzi wa mtiririko wa moto | Mtiririko wa moto: uchambuzi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sw | lpn_guide_own_example_def | Uchambuzi wa mtiririko wa moto | Mtiririko wa moto: uchambuzi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sw | lpn_ff_required_node_tip | Uchambuzi wa mtiririko wa moto | Mtiririko wa moto: uchambuzi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sw | lpn_crit_minpressure_tip | Uchambuzi wa mtiririko wa moto | Mtiririko wa moto: uchambuzi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sw | lpn_ds_minpressure_tip | Uchambuzi wa mtiririko wa moto | Mtiririko wa moto: uchambuzi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sw | lpn_guide_own_example_def | Uchambuzi wa umuhimu | Umuhimu: uchambuzi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sw | lpn_guide_bx_keep_def | Upimaji wa mahitaji | Mahitaji: upimaji | Names the box by its pre-sprint title; the box title was reordered this sprint |
| uk | lpn_ff_required_node_tip | Аналіз витрати на пожежогасіння | Витрата на пожежогасіння: аналіз | Names the box by its pre-sprint title; the box title was reordered this sprint |
| bg | lpn_guide_own_example_def | Анализ на противопожарно водно количество | Противопожарно водно количество: анализ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| fa | lpn_guide_own_example_def | تحلیل جریان آتش‌نشانی | جریان آتش‌نشانی: تحلیل | Names the box by its pre-sprint title; the box title was reordered this sprint |
| he | lpn_guide_own_example_def | ניתוח ספיקת כיבוי אש | כיבוי אש: ניתוח ספיקה | Names the box by its pre-sprint title; the box title was reordered this sprint |
| id | lpn_guide_own_example_def | Analisis debit kebakaran | Debit kebakaran: analisis | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_guide_own_example_def | Analisi della portata antincendio | Portata antincendio: analisi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| km | lpn_guide_own_example_def | ការវិភាគលំហូរពន្លត់អគ្គីភ័យ | លំហូរពន្លត់អគ្គីភ័យ៖ ការវិភាគ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ps | lpn_guide_own_example_def | د اور بهاو شننه | اور بهاو: شننه | Names the box by its pre-sprint title; the box title was reordered this sprint |
| pt | lpn_guide_own_example_def | Análise de vazão de incêndio | Vazão de incêndio: análise | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ro | lpn_guide_own_example_def | Analiza debitului de incendiu | Debit de incendiu: analiză | Names the box by its pre-sprint title; the box title was reordered this sprint |
| ru | lpn_guide_own_example_def | Анализ противопожарного расхода | Противопожарный расход: анализ | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sr | lpn_guide_own_example_def | Анализа противпожарног протока | Противпожарни проток: анализа | Names the box by its pre-sprint title; the box title was reordered this sprint |
| sw | lpn_guide_own_example_def | Uchambuzi wa mtiririko wa moto | Mtiririko wa moto: uchambuzi | Names the box by its pre-sprint title; the box title was reordered this sprint |
| it | lpn_guide_scn_use_def | con l'Portata | con la Portata | Article/prefix agreement after substituting the reordered box title |
| it | lpn_guide_cr_case_def | dell'Portata | della Portata | Article/prefix agreement after substituting the reordered box title |
| it | lpn_guide_ds_find_def | dell'Portata | della Portata | Article/prefix agreement after substituting the reordered box title |
| it | lpn_crit_minpressure_tip | nell'Portata | nella Portata | Article/prefix agreement after substituting the reordered box title |
| it | lpn_ds_minpressure_tip | nell'Portata | nella Portata | Article/prefix agreement after substituting the reordered box title |
| it | lpn_guide_scn_open_def | Il Scenari: confronto, descritto | Scenari: confronto, descritto | Article/prefix agreement after substituting the reordered box title |
| it | lpn_sm_compare_tip | Includere nel Scenari: confronto | Includere in Scenari: confronto | Article/prefix agreement after substituting the reordered box title |
| he | lpn_guide_scn_use_def | נבדקת בכיבוי אש: ניתוח ספיקה | נבדקת ב"כיבוי אש: ניתוח ספיקה" | Article/prefix agreement after substituting the reordered box title; he quotes a UI name after a prefix letter, as in ב"העתק" |
| he | lpn_guide_cr_case_def | של כיבוי אש: ניתוח ספיקה | של "כיבוי אש: ניתוח ספיקה" | Article/prefix agreement after substituting the reordered box title |
| he | lpn_guide_ds_find_def | של כיבוי אש: ניתוח ספיקה | של "כיבוי אש: ניתוח ספיקה" | Article/prefix agreement after substituting the reordered box title |
| he | lpn_ff_required_node_tip | בתיבת כיבוי אש: ניתוח ספיקה | בתיבה "כיבוי אש: ניתוח ספיקה" | Article/prefix agreement after substituting the reordered box title |
| he | lpn_crit_minpressure_tip | בכיבוי אש: ניתוח ספיקה | ב"כיבוי אש: ניתוח ספיקה" | Article/prefix agreement after substituting the reordered box title |
| he | lpn_ds_minpressure_tip | בכיבוי אש: ניתוח ספיקה | ב"כיבוי אש: ניתוח ספיקה" | Article/prefix agreement after substituting the reordered box title |
| he | lpn_guide_own_example_def | כיבוי אש: ניתוח ספיקה וקריטיות: ניתוח | "כיבוי אש: ניתוח ספיקה" ו"קריטיות: ניתוח" | Article/prefix agreement after substituting the reordered box title |
| ps | lpn_ff_required_node_tip | جنکشن اور بهاو: شننه بکس | جنکشن د اور بهاو: شننه بکس | Article/prefix agreement after substituting the reordered box title (genitive د restored) |
| am | lpn_guide_bx_keep_def | ወሳኝ አካሎች | የወሳኝነት ትንተና | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| ar | lpn_guide_bx_keep_def | الخصائص والأهمية الحرجة وتحجيم | الخصائص و«الأهمية الحرجة: تحليل» وتحجيم | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| bg | lpn_guide_bx_keep_def | Критични елементи | Критичност: анализ | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| de | lpn_guide_bx_keep_def | Kritische Elemente | Kritikalitätsanalyse | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| fa | lpn_guide_bx_keep_def | المان‌های بحرانی | بحرانی بودن: تحلیل | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| he | lpn_guide_bx_keep_def | נכסים קריטיים | קריטיות: ניתוח | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| hr | lpn_guide_bx_keep_def | Kritični elementi | Kritičnost: analiza | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| it | lpn_guide_bx_keep_def | Elementi critici | Criticità: analisi | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| km | lpn_guide_bx_keep_def | ធាតុសំខាន់ | ភាពសំខាន់៖ ការវិភាគ | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| my | lpn_guide_bx_keep_def | အရေးပါသော အစိတ်အပိုင်းများ | အရေးပါမှု ခွဲခြမ်းစိတ်ဖြာမှု | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| ps | lpn_guide_bx_keep_def | مهم شتمنۍ | مهمیت: تحلیل | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| ro | lpn_guide_bx_keep_def | Elemente critice | Criticitate: analiză | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| ru | lpn_guide_bx_keep_def | «Критичные элементы» | «Критичность: анализ» | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| sr | lpn_guide_bx_keep_def | Критични елементи | Критичност: анализа | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| sw | lpn_guide_bx_keep_def | Vipengele muhimu | Umuhimu: uchambuzi | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| tr | lpn_guide_bx_keep_def | Kritik varlıklar | Kritiklik analizi | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| uk | lpn_guide_bx_keep_def | Критичні елементи | Критичність: аналіз | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| ur | lpn_guide_bx_keep_def | اہم اثاثے | نازکی کا تجزیہ | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| zh | lpn_guide_bx_keep_def | “关键资产” | “关键性分析” | English renamed Critical assets to Criticality analysis after the translators wrote this (commit a2f8af97f); names the box by its title |
| bg | lpn_guide_scn_use_def | се проверява с Анализа на противопожарно водно количество, който | се проверява в кутията „Противопожарно водно количество: анализ“, която | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| bg | lpn_guide_cr_case_def | другаде на Анализа на противопожарно водно количество | другаде в кутията „Противопожарно водно количество: анализ“ | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| bg | lpn_guide_ds_find_def | другаде на Анализа на противопожарно водно количество | другаде в кутията „Противопожарно водно количество: анализ“ | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| cs | lpn_crit_minpressure_tip | jinde v Analýze požárního průtoku | jinde v okně Požární průtok: analýza | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| cs | lpn_ds_minpressure_tip | jinde v Analýze požárního průtoku | jinde v okně Požární průtok: analýza | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| hr | lpn_guide_scn_use_def | provjerava se Analizom protupožarnog protoka, koja | provjerava se u okviru Protupožarni protok: analiza, koji | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| hr | lpn_guide_cr_case_def | drugdje u Analizi protupožarnog protoka | drugdje u okviru Protupožarni protok: analiza | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| hr | lpn_guide_ds_find_def | drugdje u Analizi protupožarnog protoka | drugdje u okviru Protupožarni protok: analiza | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| hr | lpn_guide_own_example_def | Analizu protupožarnog protoka i Analizu kritičnosti te | Protupožarni protok: analiza i Kritičnost: analiza te | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| hr | lpn_crit_minpressure_tip | drugdje u Analizi protupožarnog protoka | drugdje u okviru Protupožarni protok: analiza | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| hr | lpn_ds_minpressure_tip | drugdje u Analizi protupožarnog protoka | drugdje u okviru Protupožarni protok: analiza | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| ps | lpn_guide_scn_use_def | د اور بهاو د اور بهاو شننې سره ازمویل کیږي | د اور بهاو د اور بهاو: شننه بکس سره ازمویل کیږي | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| ps | lpn_guide_cr_case_def | چې د اور بهاو شننې د اجازه | چې د اور بهاو: شننه بکس د اجازه | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| ps | lpn_guide_ds_find_def | چې د اور بهاو شننې د اجازه | چې د اور بهاو: شننه بکس د اجازه | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| ps | lpn_crit_minpressure_tip | د اور بهاو په شننه کې | په اور بهاو: شننه بکس کې | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| ps | lpn_ds_minpressure_tip | په اور بهاو شننه کې | په اور بهاو: شننه بکس کې | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| ro | lpn_ds_minpressure_tip | din altă parte a Analizei debitului de incendiu | din altă parte a casetei Debit de incendiu: analiză | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| ru | lpn_guide_scn_use_def | проверяется анализом противопожарного расхода, который | проверяется в окне «Противопожарный расход: анализ», которое | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| ru | lpn_guide_cr_case_def | в анализе противопожарного расхода | в окне «Противопожарный расход: анализ» | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| ru | lpn_guide_ds_find_def | в анализе противопожарного расхода | в окне «Противопожарный расход: анализ» | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| ru | lpn_crit_minpressure_tip | в анализе противопожарного расхода | в окне «Противопожарный расход: анализ» | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| ru | lpn_ds_minpressure_tip | в других местах анализа противопожарного расхода | в других местах окна «Противопожарный расход: анализ» | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| sr | lpn_guide_scn_use_def | проверава се Анализом противпожарног протока, која | проверава се у оквиру Противпожарни проток: анализа, који | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| sr | lpn_guide_cr_case_def | у Анализи противпожарног протока | у оквиру Противпожарни проток: анализа | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| sr | lpn_guide_ds_find_def | у Анализи противпожарног протока | у оквиру Противпожарни проток: анализа | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| sr | lpn_crit_minpressure_tip | у Анализи противпожарног протока | у оквиру Противпожарни проток: анализа | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| sr | lpn_ds_minpressure_tip | у анализи противпожарног протока | у оквиру Противпожарни проток: анализа | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| uk | lpn_crit_minpressure_tip | в інших місцях Аналізу витрати на пожежогасіння | в інших місцях вікна «Витрата на пожежогасіння: аналіз» | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| uk | lpn_ds_minpressure_tip | в інших місцях Аналізу витрати на пожежогасіння | в інших місцях вікна «Витрата на пожежогасіння: аналіз» | Names the Fire flow analysis box by an inflected form of its pre-sprint title; the title was reordered, so the box is named by its new title with the language's word for box carrying the case |
| bg | lpn_guide_text_scncmp_box | Вода, Отчети, Сравнение на сценарии | Вода, Отчети, Сценарии: сравнение | Menu path names the Reports row, whose value is the reordered box title (lpn_scncmp_title is also the menu row) |
| bg | lpn_guide_scn_example_def | Вода, Отчети, Сравнение на сценарии | Вода, Отчети, Сценарии: сравнение | Menu path names the Reports row, whose value is the reordered box title (lpn_scncmp_title is also the menu row) |
| it | lpn_guide_text_scncmp_box | Acqua, Rapporti, Confronto tra scenari | Acqua, Rapporti, Scenari: confronto | Menu path names the Reports row, whose value is the reordered box title (lpn_scncmp_title is also the menu row) |
| it | lpn_guide_scn_example_def | Acqua, Rapporti, Confronto tra scenari | Acqua, Rapporti, Scenari: confronto | Menu path names the Reports row, whose value is the reordered box title (lpn_scncmp_title is also the menu row) |
| ps | lpn_guide_text_scncmp_box | اوبه، راپورونه، د سناریوګانو پرتله | اوبه، راپورونه، سناریو: پرتله | Menu path names the Reports row, whose value is the reordered box title (lpn_scncmp_title is also the menu row) |
| ps | lpn_guide_scn_example_def | اوبه، راپورونه، د سناریوګانو پرتله | اوبه، راپورونه، سناریو: پرتله | Menu path names the Reports row, whose value is the reordered box title (lpn_scncmp_title is also the menu row) |
| bg | lpn_guide_scn_open_def | Сравнението на сценарии, описано | „Сценарии: сравнение“, описано | Names the box by the inflected pre-sprint title; the title was reordered |
| my | lpn_guide_ff_example_def | မီးငြိမ်းသတ်ရေးစီးနှုန်း ခွဲခြမ်းစိတ်ဖြာမှု… | မီးငြိမ်းသတ်ရေးစီးနှုန်း ခွဲခြမ်းစိတ်ဖြာချက်… | Menu path quotes the box title, not the menu row lpn_ff_menu |
| pt | lpn_guide_text_scncmp_box | marcado no Gerenciador de cenários | marcado na caixa Cenários: gerenciador | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| pt | lpn_guide_scn_notes_def | As alternativas e o Gerenciador de cenários são descritos | As alternativas e a caixa Cenários: gerenciador são descritas | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| pt | lpn_guide_cmp_notes_def | na entrada do Gerenciador de cenários | na entrada Cenários: gerenciador | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| pt | lpn_guide_prop_scn_def | A entrada do Gerenciador de cenários | A entrada Cenários: gerenciador | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| pt | lpn_guide_set_scn_def | A entrada do Gerenciador de cenários | A entrada Cenários: gerenciador | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| pt | lpn_guide_map_del_def | a entrada do Gerenciador de cenários | a entrada Cenários: gerenciador | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| pt | lpn_scenario_basic_tip | Base; o Gerenciador de cenários e a tabela Cenários não são mostrados | Base; a caixa Cenários: gerenciador e a tabela Cenários não são mostradas | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| pt | lpn_scenario_basic_tip | Desmarcado: o Gerenciador de cenários e a tabela Cenários são mostrados | Desmarcado: a caixa Cenários: gerenciador e a tabela Cenários são mostradas | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| pt | lpn_scncmp_none_checked | no Gerenciador de cenários | na caixa Cenários: gerenciador | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| it | lpn_guide_text_scncmp_box | selezionato nella Gestione scenari | selezionato nel riquadro Scenari: gestione | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| it | lpn_guide_scn_notes_def | Le alternative e la Gestione scenari sono descritte | Le alternative e il riquadro Scenari: gestione sono descritti | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| it | lpn_guide_cmp_notes_def | voce Gestione scenari | voce Scenari: gestione | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| it | lpn_guide_prop_scn_def | voce Gestione scenari | voce Scenari: gestione | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| it | lpn_guide_set_scn_def | voce Gestione scenari | voce Scenari: gestione | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| it | lpn_guide_map_del_def | voce Gestione scenari | voce Scenari: gestione | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| it | lpn_scenario_basic_tip | Base; la Gestione scenari e la tabella Scenari non sono mostrate | Base; il riquadro Scenari: gestione e la tabella Scenari non sono mostrati | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| it | lpn_scenario_basic_tip | Deselezionata: la Gestione scenari e la tabella Scenari sono mostrate | Deselezionata: il riquadro Scenari: gestione e la tabella Scenari sono mostrati | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| it | lpn_scncmp_none_checked | nella Gestione scenari | nel riquadro Scenari: gestione | Names the Scenario manager box or its Guide entry by the menu-row wording; the box title (new this sprint) reads differently |
| pt | lpn_sm_help | gerenciamento no Gerenciador de cenários | gerenciamento na caixa Cenários: gerenciador | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| pt | lpn_sm_help | painel direito do Gerenciador de cenários | painel direito da caixa Cenários: gerenciador | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| it | lpn_sm_help | gestione nella Gestione scenari | gestione nel riquadro Scenari: gestione | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| it | lpn_sm_help | pannello destro della Gestione scenari | pannello destro del riquadro Scenari: gestione | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| ps | lpn_guide_text_scncmp_box | سناریو مدیر | سناریو: مدیر | Box title and menu row are both سناریو: مدیر; prose dropped the colon |
| ps | lpn_guide_scn_notes_def | سناریو مدیر | سناریو: مدیر | Box title and menu row are both سناریو: مدیر; prose dropped the colon |
| ps | lpn_guide_cmp_notes_def | سناریو مدیر | سناریو: مدیر | Box title and menu row are both سناریو: مدیر; prose dropped the colon |
| ps | lpn_guide_prop_scn_def | سناریو مدیر | سناریو: مدیر | Box title and menu row are both سناریو: مدیر; prose dropped the colon |
| ps | lpn_guide_set_scn_def | سناریو مدیر | سناریو: مدیر | Box title and menu row are both سناریو: مدیر; prose dropped the colon |
| ps | lpn_guide_map_del_def | سناریو مدیر | سناریو: مدیر | Box title and menu row are both سناریو: مدیر; prose dropped the colon |
| ps | lpn_scenario_basic_tip | سناریو مدیر | سناریو: مدیر | Box title and menu row are both سناریو: مدیر; prose dropped the colon |
| ps | lpn_sm_basic_on | سناریو مدیر | سناریو: مدیر | Box title and menu row are both سناریو: مدیر; prose dropped the colon |
| ps | lpn_sm_help | سناریو مدیر | سناریو: مدیر | Box title and menu row are both سناریو: مدیر; prose dropped the colon |
| ps | lpn_scncmp_none_checked | سناریو مدیر | سناریو: مدیر | Box title and menu row are both سناریو: مدیر; prose dropped the colon |
| ps | lpn_guide_scn_open_def | سناریو مدیر | سناریو: مدیر | Box title and menu row are both سناریو: مدیر; prose dropped the colon |
| sw | lpn_guide_text_scncmp_box | Msimamizi wa senario | Senario: msimamizi | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| sw | lpn_guide_scn_notes_def | Msimamizi wa senario | Senario: msimamizi | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| sw | lpn_guide_cmp_notes_def | Msimamizi wa senario | Senario: msimamizi | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| sw | lpn_guide_prop_scn_def | Msimamizi wa senario | Senario: msimamizi | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| sw | lpn_guide_set_scn_def | Msimamizi wa senario | Senario: msimamizi | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| sw | lpn_guide_map_del_def | Msimamizi wa senario | Senario: msimamizi | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| sw | lpn_sm_help | Msimamizi wa senario | Senario: msimamizi | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| sw | lpn_scncmp_none_checked | Msimamizi wa senario | Senario: msimamizi | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| sw | lpn_scenario_basic_tip | Msingi; Msimamizi wa senario na | Msingi; Senario: msimamizi na | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| sw | lpn_scenario_basic_tip | alama: Msimamizi wa senario na | alama: Senario: msimamizi na | Names the Scenario manager box by the menu-row wording; the box title (new this sprint) reads differently |
| sw | lpn_scenario_basic_tip | Msingi; Senario: msimamizi na | Msingi; kisanduku cha Senario: msimamizi na | Carrier noun kisanduku cha added so the colon in the title does not read as a second label colon |
| sw | lpn_scenario_basic_tip | alama: Senario: msimamizi na | alama: kisanduku cha Senario: msimamizi na | Carrier noun kisanduku cha added so the colon in the title does not read as a second label colon |
| ru | lpn_guide_rr_what_def | Вода, Отчёты, Отчёт о расчёте | Вода, Отчёты, Расчёт | Menu path quotes the box title instead of the Reports menu row |
| ru | lpn_guide_rr_example_def | Вода, Отчёты, Отчёт о расчёте | Вода, Отчёты, Расчёт | Menu path quotes the box title instead of the Reports menu row |
| ru | lpn_guide_cal_what_def | Вода, Отчёты, Отчёт о калибровке | Вода, Отчёты, Калибровка | Menu path quotes the box title instead of the Reports menu row |
| ru | lpn_guide_cal_example_def | Вода, Отчёты, Отчёт о калибровке | Вода, Отчёты, Калибровка | Menu path quotes the box title instead of the Reports menu row |
| sr | lpn_inp_drop_report | под Извештаји, EPANET прорачун | под Извештаји, Прорачун | Menu path names a row that does not exist; the Reports row is Прорачун |

### Check 4: alternative category names (7 substitutions)

| lang | key | old | new | why |
|---|---|---|---|---|
| fa | lpn_guide_scn_scope_def | مصرف، فعال‌سازی المان‌ها، تنظیمات | مصرف، توپولوژی فعال، تنظیمات | Category list names Active topology by the old Asset activation wording; uses lpn_alt_cat_topology |
| zh | lpn_guide_scn_scope_def | 能耗成本 | 能耗费用 | Category list names a category differently from its on-screen label (lpn_alt_cat_*) |
| bn | lpn_guide_scn_scope_def | উপস্থাপনা এবং গণনা বিভাগে | উপস্থাপনা এবং হিসাব বিভাগে | Category list names a category differently from its on-screen label (lpn_alt_cat_*) |
| it | lpn_guide_scn_scope_def | Costituente, Portata antincendio, Costo energetico, | Sostanza, Portata antincendio, Costo dell'energia, | Category list names a category differently from its on-screen label (lpn_alt_cat_*) |
| ps | lpn_guide_scn_scope_def | ځانګړې ځانتیاوې، متن | ځانګړي ځانګړتیاوې، متن | Category list names a category differently from its on-screen label (lpn_alt_cat_*) |
| sr | lpn_guide_scn_scope_def | Прилагођена својства, Текст | Прилагођене особине, Текст | Category list names a category differently from its on-screen label (lpn_alt_cat_*) |
| ur | lpn_guide_scn_scope_def | ابتدائی ترتیبات، اجزا، فائر | ابتدائی ترتیبات، جزو، فائر | Category list names a category differently from its on-screen label (lpn_alt_cat_*) |

### Check 5: ready-made scenario names (56 substitutions)

| lang | key | old | new | why |
|---|---|---|---|---|
| ar | lpn_guide_scn_use_def | 2. اختبار التدفق: متوسط | 2. اختبار التدفق: وسطي | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ar | lpn_guide_scn_use_def | 4. يوم متوسط | 4. اليوم المتوسط | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ar | lpn_guide_scn_use_def | 5. يوم أقصى | 5. اليوم الأقصى | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| bn | lpn_guide_scn_use_def | ১. প্রবাহ পরীক্ষা: স্থির | 1. প্রবাহ পরীক্ষা: স্থির | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| bn | lpn_guide_scn_use_def | ২. প্রবাহ পরীক্ষা: মাঝারি | 2. প্রবাহ পরীক্ষা: মধ্য | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| bn | lpn_guide_scn_use_def | ৩. প্রবাহ পরীক্ষা: সর্বোচ্চ | 3. প্রবাহ পরীক্ষা: সর্বোচ্চ | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| bn | lpn_guide_scn_use_def | ৪. গড় দিন | 4. গড় দিন | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| bn | lpn_guide_scn_use_def | ৫. সর্বোচ্চ দিন | 5. সর্বোচ্চ দিন | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| bn | lpn_guide_scn_use_def | ৬. পিক ঘণ্টা | 6. পিক ঘণ্টা | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| de | lpn_guide_scn_use_def | 1. Flow test: Static | 1. Durchflusstest: Statisch | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| de | lpn_guide_scn_use_def | 2. Flow test: Mid | 2. Durchflusstest: Mittel | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| de | lpn_guide_scn_use_def | 3. Flow test: Max | 3. Durchflusstest: Maximum | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| de | lpn_guide_scn_use_def | 4. Average Day | 4. Mittlerer Tag | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| de | lpn_guide_scn_use_def | 5. Max Day | 5. Maximaltag | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| de | lpn_guide_scn_use_def | 6. Peak hour | 6. Spitzenstunde | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| de | lpn_guide_scn_use_def | und Average Day | und Mittlerer Tag | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| de | lpn_guide_scn_use_def | für Max Day | für Maximaltag | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| de | lpn_guide_scn_use_def | für Peak hour | für Spitzenstunde | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| de | lpn_guide_scn_use_def | Max Day ist | Maximaltag ist | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| fa | lpn_guide_scn_use_def | 1. آزمایش جریان: ایستا | ۱. آزمایش جریان: ایستا | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| fa | lpn_guide_scn_use_def | 2. آزمایش جریان: میانی | ۲. آزمایش جریان: میانی | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| fa | lpn_guide_scn_use_def | 3. آزمایش جریان: بیشینه | ۳. آزمایش جریان: بیشینه | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| fa | lpn_guide_scn_use_def | 4. روز میانگین | ۴. روز میانگین | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| fa | lpn_guide_scn_use_def | 5. روز بیشینه | ۵. روز بیشینه | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| fa | lpn_guide_scn_use_def | 6. ساعت اوج | ۶. ساعت اوج | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| my | lpn_guide_scn_use_def | ၁။ ရေစီးနှုန်း | 1. ရေစီးနှုန်း | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| my | lpn_guide_scn_use_def | ၂။ ရေစီးနှုန်း | 2. ရေစီးနှုန်း | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| my | lpn_guide_scn_use_def | ၃။ ရေစီးနှုန်း | 3. ရေစီးနှုန်း | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| my | lpn_guide_scn_use_def | ၄။ ပျမ်းမျှနေ့ | 4. ပျမ်းမျှနေ့ | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| my | lpn_guide_scn_use_def | ၅။ အမြင့်ဆုံးနေ့ | 5. အမြင့်ဆုံးနေ့ | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| my | lpn_guide_scn_use_def | ၆။ အထွတ်အထိပ်နာရီ | 6. အထွတ်အထိပ်နာရီ | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ps | lpn_guide_scn_use_def | 1. Flow test: Static | 1. د بهاو ازموینه: ثابت | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ps | lpn_guide_scn_use_def | 2. Flow test: Mid | 2. د بهاو ازموینه: منځنی | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ps | lpn_guide_scn_use_def | 3. Flow test: Max | 3. د بهاو ازموینه: اعظمي | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ps | lpn_guide_scn_use_def | 4. Average Day | 4. منځنۍ ورځ | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ps | lpn_guide_scn_use_def | 5. Max Day | 5. اعظمي ورځ | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ps | lpn_guide_scn_use_def | 6. Peak hour | 6. د لوړې تقاضا ساعت | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ps | lpn_guide_scn_use_def | او Average Day لپاره | او منځنۍ ورځ لپاره | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ps | lpn_guide_scn_use_def | د Max Day لپاره | د اعظمي ورځ لپاره | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ps | lpn_guide_scn_use_def | د Peak hour لپاره | د لوړې تقاضا ساعت لپاره | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ps | lpn_guide_scn_use_def | Max Day هغه | اعظمي ورځ هغه | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ur | lpn_guide_scn_use_def | 1. Flow test: Static | 1. فلو ٹیسٹ: جامد | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ur | lpn_guide_scn_use_def | 2. Flow test: Mid | 2. فلو ٹیسٹ: درمیانہ | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ur | lpn_guide_scn_use_def | 3. Flow test: Max | 3. فلو ٹیسٹ: زیادہ سے زیادہ | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ur | lpn_guide_scn_use_def | 4. Average Day | 4. اوسط دن | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ur | lpn_guide_scn_use_def | 5. Max Day | 5. زیادہ سے زیادہ دن | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ur | lpn_guide_scn_use_def | 6. Peak hour | 6. عروجی گھنٹہ | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ur | lpn_guide_scn_use_def | اور Average Day کے | اور اوسط دن کے | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ur | lpn_guide_scn_use_def | Max Day کے | زیادہ سے زیادہ دن کے | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ur | lpn_guide_scn_use_def | Peak hour کے | عروجی گھنٹہ کے | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| ur | lpn_guide_scn_use_def | Max Day وہ | زیادہ سے زیادہ دن وہ | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| sw | lpn_guide_scn_use_def | 3. Jaribio la mtiririko: Juu | 3. Jaribio la mtiririko: Upeo | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| sw | lpn_guide_scn_use_def | Siku ya juu | Siku ya upeo | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| sw | lpn_scenario_preset_flow_mid | Jaribio la mtiririko: Wastani | Jaribio la mtiririko: Kati | Mid rendered Wastani (average), the same word as 4. Siku ya wastani (Average Day); Kati (middle) is what the Guide prose already used |
| tr | lpn_guide_scn_use_def | 3. Debi testi: En yüksek | 3. Debi testi: Maks | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |
| tr | lpn_guide_scn_use_def | En yüksek gün | Maksimum gün | The six ready-made scenarios are created with the lpn_scenario_preset_* names; the prose named them differently |

### Check 6: concept consistency (9 substitutions)

| lang | key | old | new | why |
|---|---|---|---|---|
| fa | lpn_sm_title | مدیر سناریوها | مدیر سناریو | Box title used the plural مدیر سناریوها while the menu row and every prose mention say مدیر سناریو; title made to match |
| ps | lpn_scenario_overrides | د دودیزو ارزښتونو شمېر | د ځانګړو ارزښتونو شمېر | Status-strip count of overrides used دودیز, the word ps uses for custom (custom properties); the override label is ځانګړی ارزښت |
| ps | lpn_alt_cat_userdata | ځانګړي ځانګړتیاوې | دودیز ځانتیاوې | Custom properties category used ځانګړي, the override word; matched to the Settings label lpn_settings_custom_props |
| ps | lpn_guide_scn_scope_def | ځانګړي ځانګړتیاوې، متن | دودیز ځانتیاوې، متن | Follows the corrected custom-properties category label |
| tr | lpn_scenario_overrides | Kendi değer sayısı | Senaryo değeri sayısı | Status-strip count named overrides Kendi değer; the label is Senaryo değeri |
| tr | lpn_delete_drops_overrides | senaryo geçersiz kılmalarını ({n}) | senaryo değerlerini ({n}) | Named overrides geçersiz kılma; the label is Senaryo değeri |
| my | lpn_contour_show | အမြင့်မျဉ်းများ | တန်ဖိုးတူမျဉ်းများ | Contour lines rendered အမြင့်မျဉ်း (height lines) here but တန်ဖိုးတူမျဉ်း (iso-value lines) in the box title lpn_contour_plot and 19 other strings |
| my | lpn_contour_show_tip | အမြင့်မျဉ်းများ | တန်ဖိုးတူမျဉ်းများ | Contour lines rendered အမြင့်မျဉ်း (height lines) here but တန်ဖိုးတူမျဉ်း (iso-value lines) in the box title lpn_contour_plot and 19 other strings |
| my | lpn_guide_scn_scope_def | အမြင့်မျဉ်းများ | တန်ဖိုးတူမျဉ်းများ | Contour lines rendered အမြင့်မျဉ်း (height lines) here but တန်ဖိုးတူမျဉ်း (iso-value lines) in the box title lpn_contour_plot and 19 other strings |

### Check 7: clustering, label quotes and grammar found while reading (23 substitutions)

| lang | key | old | new | why |
|---|---|---|---|---|
| ar | lpn_sm_copy_ask | يحتفظ {name} بها تجاوزاته الخاصة. | يحتفظ {name} بها بوصفها تجاوزاته الخاصة. | Grammar: the second sentence lost its as (keeps them as its own overrides) |
| ur | lpn_sm_copy_ask | {name} انہیں اپنی قدریں رکھتا ہے۔ | {name} انہیں اپنی قدروں کے طور پر رکھتا ہے۔ | Grammar: the second sentence lost its as (keeps them as its own overrides) |
| am | lpn_guide_cr_case_def | ካለው ሌላ ቦታ የሚፈቀድ ዝቅተኛ ግፊት ሳጥን | ካለው በሌላ ቦታ የሚፈቀድ ዝቅተኛ ግፊት ሳጥን | Quotes the Fire flow field Lowest pressure allowed elsewhere by a wording other than its label lpn_ff_minpressure (Wave 0 rewrote the English to name that box) |
| fa | lpn_guide_cr_case_def | همان تنظیم جعبهٔ کمترین فشار مجاز در جاهای دیگر جریان آتش‌نشانی: تحلیل است | همان تنظیم جعبهٔ «کمترین فشار مجاز در جای دیگر» در «جریان آتش‌نشانی: تحلیل» است | Quotes the Fire flow field Lowest pressure allowed elsewhere by a wording other than its label lpn_ff_minpressure (Wave 0 rewrote the English to name that box) |
| my | lpn_guide_cr_case_def | ၏ အခြားနေရာတွင် ခွင့်ပြုထားသော အနိမ့်ဆုံးဖိအား ဘောက်စ် | ၏ အခြားနေရာများတွင် ခွင့်ပြုထားသော အနိမ့်ဆုံးဖိအား ဘောက်စ် | Quotes the Fire flow field Lowest pressure allowed elsewhere by a wording other than its label lpn_ff_minpressure (Wave 0 rewrote the English to name that box) |
| ps | lpn_guide_cr_case_def | اجازه شوی ټیټ ترین فشار هماغه تنظیم دی چې د اور بهاو: شننه بکس د اجازه شوی ټیټ ترین فشار په بل ځای کې بکس. | ټیټ ترین اجازه شوی فشار هماغه تنظیم دی لکه په اور بهاو: شننه بکس کې «ټیټ ترین فشار چې چیرته نور اجازه لري». | Quotes the Fire flow field Lowest pressure allowed elsewhere by a wording other than its label lpn_ff_minpressure (Wave 0 rewrote the English to name that box); the first mention also reordered the lpn_crit_minpressure label |
| am | lpn_guide_ds_find_def | ካለው ሌላ ቦታ የሚፈቀድ ዝቅተኛ ግፊት ሳጥን | ካለው በሌላ ቦታ የሚፈቀድ ዝቅተኛ ግፊት ሳጥን | Quotes the Fire flow field Lowest pressure allowed elsewhere by a wording other than its label lpn_ff_minpressure (Wave 0 rewrote the English to name that box) |
| fa | lpn_guide_ds_find_def | همان تنظیم جعبهٔ کمترین فشار مجاز در جاهای دیگر جریان آتش‌نشانی: تحلیل است | همان تنظیم جعبهٔ «کمترین فشار مجاز در جای دیگر» در «جریان آتش‌نشانی: تحلیل» است | Quotes the Fire flow field Lowest pressure allowed elsewhere by a wording other than its label lpn_ff_minpressure (Wave 0 rewrote the English to name that box) |
| my | lpn_guide_ds_find_def | ၏ အခြားနေရာတွင် ခွင့်ပြုထားသော အနိမ့်ဆုံးဖိအား ဘောက်စ် | ၏ အခြားနေရာများတွင် ခွင့်ပြုထားသော အနိမ့်ဆုံးဖိအား ဘောက်စ် | Quotes the Fire flow field Lowest pressure allowed elsewhere by a wording other than its label lpn_ff_minpressure (Wave 0 rewrote the English to name that box) |
| ps | lpn_guide_ds_find_def | اجازه شوی ټیټ ترین فشار هماغه تنظیم دی چې د اور بهاو: شننه بکس د اجازه شوی ټیټ ترین فشار په بل ځای کې بکس. | ټیټ ترین اجازه شوی فشار هماغه تنظیم دی لکه په اور بهاو: شننه بکس کې «ټیټ ترین فشار چې چیرته نور اجازه لري». | Quotes the Fire flow field Lowest pressure allowed elsewhere by a wording other than its label lpn_ff_minpressure (Wave 0 rewrote the English to name that box); the first mention also reordered the lpn_crit_minpressure label |
| ur | lpn_guide_tbl_tabs_def | پانی، جدول چنیں | پانی، جدولیں چنیں | Menu path quotes the Tables menu row lpn_tables_menu (جدولیں) |
| ps | lpn_guide_en_set_def | د اسعارو متن | د «مروجه پیسه» متن | Quotes an on-screen label by a different wording (lpn_energy_currency) |
| ps | lpn_guide_tbl_tabs_def | ښکتنۍ پینل تڼۍ | لاندنی پینل تڼۍ | Quotes an on-screen label by a different wording (lpn_pane_toggle) |
| ps | lpn_guide_bx_dock_def | د نقشې کیڼ لور ټینګول، د نقشې ښي لور ټینګول، او ازادول لري | «د نقشې په کیڼ لور کې ځای پر ځای کول»، «د نقشې په ښي لور کې ځای پر ځای کول»، او «تیرېدونکی» لري | Quotes an on-screen label by a different wording (lpn_dock_left, lpn_dock_right, lpn_dock_float) |
| uk | lpn_guide_text_hotkeys_popup | або / , коли | або /, коли | Stray space before the comma after / |
| cs | lpn_guide_tb_row_def | slovy Také v ukazuje | slovy Také v nabídce ukazuje | Quotes the words of the Also in {menu} label (lpn_guide_also) in a form the label does not have |
| hr | lpn_guide_tb_row_def | iza riječi Također u. | iza riječi Također u izborniku. | Quotes the words of the Also in {menu} label (lpn_guide_also) in a form the label does not have |
| sr | lpn_guide_tb_row_def | после речи Такође у. | после речи Такође у менију. | Quotes the words of the Also in {menu} label (lpn_guide_also) in a form the label does not have |
| ru | lpn_guide_tb_row_def | после слов «Также в» | после слов «Также в меню» | Quotes the words of the Also in {menu} label (lpn_guide_also) in a form the label does not have |
| uk | lpn_guide_tb_row_def | після слів «Також у» | після слів «Також у меню» | Quotes the words of the Also in {menu} label (lpn_guide_also) in a form the label does not have |
| km | lpn_guide_tb_row_def | បន្ទាប់ពីពាក្យ ក៏មានក្នុង។ | បន្ទាប់ពីពាក្យ ក៏នៅក្នុងម៉ឺនុយ។ | Quotes the words of the Also in {menu} label (lpn_guide_also) in a form the label does not have |
| tr | lpn_guide_tb_row_def | satır ayrıca menü yolunu Ayrıca şurada sözlerinden sonra gösterir | satır ayrıca menü yolunu, arkasından içinde ayrıca sözleriyle gösterir | Quotes the words of the Also in {menu} label (lpn_guide_also) in a form the label does not have (the Turkish label puts the words after the path) |
| zh | lpn_guide_also | {menu}中的其他项 | 另见 {menu} | Also in {menu} was rendered other items in {menu}; the Guide prose already quotes the label as 另见 |
