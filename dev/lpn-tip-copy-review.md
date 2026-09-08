# `lpn_` tip copy review — wordiness pass

One pass over the 208 `lpn_*_tip` / `lpn_*_note` values in `lib/lang.ec.en.php`, looking for tips a
reader gives up on before reaching the fact they came for. Every edit costs 26 retranslations, so
the bar was not "could this be tighter" but "does the length cost the reader the fact". 11 strings
changed; the rest of this file records what was judged and left, which is the half a later writer
needs so the same 200 strings are not re-read from cold.

Scope was English only, `lib/lang.ec.en.php` only. `$ec_lang_syn` was not touched, and no synonym is
proposed by this pass.

## 1. Changed (11)

| Key | Words | Before → After | What was wrong | TGH remarks
|---|---|---|---|
| `lpn_result_water_age_tip` | 101 → 71 | **Before:** How long the water reaching this point has been in the system. Where flows meet, the water arriving carries a mix of ages, and the number here is their average weighted by flow: a junction fed mostly by a short new main shows a low age even if a long dead end also feeds it. In a tank it is the average age of the water held, which is why a tank that turns over slowly is usually the oldest water in a network. There is no regulatory limit to compare it against, so judge the number against your own system.<br>**After:** How long the water reaching this point has been in the system. Where flows meet, the number is the average of the arriving ages, weighted by flow. In a tank it is the average age of the water held, so a tank that turns over slowly usually holds the oldest water in a network. There is no regulatory limit to compare it against, so judge the number against your own system. | The worked junction example restated, in 26 words, the weighted-average clause immediately before it. The longest tip on the page, and the fact that changes what the reader does (no regulatory limit) came last. | I agree.
| `lpn_reaction_order_wall_tip` | 88 → 68 | **Before:** …EPANET allows only these two, which is why this is a chooser and not a number. It also decides how this page converts the wall coefficient, so the row above it means something different depending on what you pick here.<br>**After:** …EPANET allows only these two. Changing this changes what the wall coefficient above means, and how this page converts it. | "which is why this is a chooser and not a number" explains a widget the reader is looking at. The closing sentence said in 36 words what the two unit sentences above it had already said. | (1) I agree. It was an AI tell. (2) I edited further in lang. (3) Note that I am not finding that there is such a thing as tank reaction order. Please investigate and fix/purge if necessary.
| `lpn_reaction_limiting_tip` | 62 → 47 | **Before:** …It is written in the same units as the chemical itself, and EPANET converts a concentration for nobody, so write it in the units named beside the chemical. Leave it empty and there is no limit.<br>**After:** …Write it in the units named beside the chemical, which EPANET never converts. Leave it empty and there is no limit. | One sentence stated the units rule twice, once as a fact and once as an instruction. | I edited lang.
| `lpn_reaction_rough_corr_tip` | 69 → 52 | **Before:** Ties the wall reaction to each pipe's own roughness instead of one number for the whole network, which is how a rougher pipe is made to react faster. When it is set, this page and EPANET work out a wall coefficient per pipe from that pipe's roughness, and the single wall coefficient above is no longer what is used. Leave it empty and it is not used at all.<br>**After:** Ties the wall reaction to each pipe's own roughness, so a rougher pipe reacts faster. When it is set, a wall coefficient is worked out for each pipe from that pipe's roughness, and the single wall coefficient above is no longer used. Leave it empty and it is not used at all. | "instead of one number for the whole network" is the same statement as the sentence that follows it. Which of the two engines does the arithmetic is not a fact the reader acts on. | I edited lang.
| `lpn_settings_auto_run_tip` | 64 → 52 | **Before:** …the Calculate button is taken off the toolbar because there is nothing left for it to do. Turn it off on a large network where waiting for each change to be recalculated gets in the way of typing…<br>**After:** …the Calculate button is taken off the toolbar. Turn it off on a large network, where waiting for each recalculation gets in the way of typing… | A "why" the reader can work out from the sentence itself, and a nine-word passive where three words do it. The when-to-turn-it-off "why" was kept: it is the one that changes a decision. | The ", and" construction here is an AI tell that doesn't fit in this engineering application. I edited lang.
| `lpn_settings_leader_snap_tip` | 54 → 44 | **Before:** When you drag a label away from what it names, the line back to it is pulled onto the nearest of the set angles if you drag close to one. Keep dragging and the snap lets go, so any angle is still available. Off drags freely, which is what this page has always done.<br>**After:** When you drag a label away from its asset, the line back to it snaps to the nearest of the set angles if you drag close to one. Keep dragging and the snap lets go, so any angle is still available. Off drags freely. | "which is what this page has always done" is this project's history, not the reader's. "what it names" also read as the transitive *name* Tom struck on 2026-09-06; "its asset" is the same fact in fewer words. | I edited lang.
| `lpn_georef_scale_tip` | 43 → 42 | **Before:** …so set it here — or let Go to… ask you how wide the site is and work it out.<br>**After:** …so set it here, or let Go to… ask you how wide the site is and work it out. | Em dash only. See §4. | I edited lang.
| `lpn_menu_project_tip` | 24 → 15 | **Before:** Everything about water network modeling is here in one place, except the animation play controls. There is no need to guess where things are.<br>**After:** Everything about water network modeling is here in one place, except the animation play controls. | The second sentence carried no fact at all, and cost 26 translations of it. | I agree.
| `lpn_run_menu_tip` | 33 → 29 | **Before:** Recalculate this network now. Looking for the Calculate button? It is hidden while the Recalculate automatically setting is on. To bring the button back, turn Recalculate automatically off in Settings, Calculation, Hydraulics.<br>**After:** Recalculate this network now. The Calculate button is hidden while the Recalculate automatically setting is on; turn that setting off in Settings, Calculation, Hydraulics to bring the button back. | A rhetorical question the reader must answer before the tip continues, and the setting named three times in two sentences. Both control names and the menu path survive in the sanctioned shapes. | I agree.
| `lpn_labels_mark_extrema_tip` | 42 → 28 | **Before:** Draws a line above the highest value of each labelled property on the map (an overline), and a line below the lowest value of that property (an underline), so you can pick out the highest and the lowest without reading the numbers.<br>**After:** Marks the highest value of each labelled property on the map with a line above it (an overline), and the lowest with a line below it (an underline). | The closing clause restated the sentence it was attached to, using the same two words. | I agree.
| `lpn_settings_accuracy_tip` | 55 → 52 | **Before:** How close the solver has to get before it stops, measured as the amount by which the flows are still changing from one trial to the next, against the sum of the link flows…<br>**After:** How close the solver has to get before it stops, measured as the total change in flow from one trial to the next, divided by the total flow in the links… | Barely shorter, and taken for clarity rather than for length: "against the sum of the link flows" hides a ratio behind a preposition, and an English reader has to re-read to find the division. Same quantity, same EPANET definition. | I agree.

## 2. Considered and left alone

Longest first. This is the list not to re-open without a new reason.

| Key | Words | Why it stays |
|---|---|---|
| `lpn_library_rule_tip` | 124 | Longest string on the page and entirely EPANET grammar, keyword by keyword. Also **ruled by Tom** on its exact current text. | I edited lang.
| `lpn_file_import_geo_tip` | 81 | Wordy, but the placement instructions are a procedure and the control name has to appear. See §3 for the one thing in it that looks wrong. | I edited lang.
| `lpn_settings_engine_native_tip` | 75 | Long, but every sentence is a fact a reader acts on: which engine solves, what the box does, the three cases that override it, and the 650 KB download. | I edited lang.
| `lpn_labels_priority_node_tip` | 72 | The closing tie-break sentence is genuinely hard reading, but it is the only statement of the rule, and it shares one JS fallback literal with its sibling `lpn_labels_priority_link_tip` in a file this pass may not touch. | I edited lang.
| `lpn_reaction_order_bulk_tip` | 72 | Trimming reached 63 words, and a 9-word gain does not buy 26 retranslations. The closing warning (changing the order moves every answer with no coefficient edited) is the content. | I edited lang.
| `lpn_library_control_tip` | 69 | Four literal EPANET control sentences. The examples are the tip. | I edited lang.
| `lpn_library_curves_note` | 65 | Tom's own current wording, including *indicates* (CLAUDE.md, 2026-09-06). Not ours to shorten. | I edited lang.
| `lpn_settings_demand_multiplier_tip` | 63 | Best available trim was 5 words. | I edited lang.
| `lpn_field_valve_type_tip` | 57 | Best available trim was 4 words, and the closing "because" is what stops a reader reading the reset setting as a defect. | I edited lang.
| `lpn_new_coords_tip` | 55 | Four sentences, four distinct facts, one of them a menu path. | I agree.
| `lpn_georef_twopt_tip` | 53 | A four-step procedure; no step is removable. | I agree.
| `lpn_library_curve_equation_tip` | 47 | Trim reached 40. The reader does not stumble, and "worked out afresh, never stored" tells them not to look for it in the file. | I edited lang.
| `lpn_field_tag_tip` | 46 | Tom edited this personally on 2026-09-06, striking the EPANET round-trip sentence and keeping the space refusal. | I edited lang.
| `lpn_wrong_tip`, `lpn_mixing_model_tip`, `lpn_source_type_tip`, `lpn_source_quality_tip`, `lpn_reaction_tank_tip`, `lpn_reaction_bulk_tip`, `lpn_reaction_wall_tip`, `lpn_reaction_note`, `lpn_ff_col_static_tip`, `lpn_quality_chemical_name_tip`, `lpn_quality_initial_tip`, `lpn_pump_curve_source_tip`, `lpn_gpv_curve_source_tip`, `lpn_pump_effic_curve_tip`, `lpn_library_pipetypes_note`, `lpn_new_units_tip`, `lpn_new_place_tip`, `lpn_energy_price_note`, `lpn_energy_col_avg_kw_tip`, `lpn_mixing_fraction_tip`, `lpn_library_rules_tip`, `lpn_library_curve_values_tip` and the rest | — | **Ruled by Tom on their exact current English** (`dev/english-key-rulings.json`), 59 of the 208 in scope. A ruling lapses only when the wording changes, so shortening one would silently discard his approval and put the key back into wave 0. Not read for wordiness at all. | I edited lang relying heavily on EPANET help, and I wish that you had done so from the beginning too. We should be very cautious to go afield of the wording that EPANET uses.
| every `lpn_` tip under 28 words (about 130 of them) | <28 | Read; all lead with their fact. No candidates. |

Two edits were **written and then reverted**, and are blocked rather than judged:

| Key | Words | Blocker |
|---|---|---|
| `lpn_library_fittings_note` | 59 | Its first two sentences restate `lpn_library_fittings_tip` almost verbatim, which is a real duplication. But `js/looped-network.js:27275` carries the whole 59 words as a `\|\|` fallback literal, and `js_fallback_string_check.php` blocks at zero drift. Editing the string needs the JS edited in the same commit, which this pass may not touch. |I edited lang.
| `lpn_color_ranges_note` | 44 | Same blocker, `js/looped-network.js:12191`. "The boundaries below are fixed once set; they do not follow the results as they change" says one thing twice. |

## 3. Defects found, not fixed

1. **`lpn_settings_tolerance_tip` is very likely on the wrong quantity, and may be dead.** Its text
   ("How close the solver has to get before it stops. A smaller number is more exact and takes
   longer.") is a paraphrase of `lpn_settings_accuracy_tip`, which is the hydraulic convergence
   criterion. EPANET's `TOLERANCE` is a **water-quality** parameter, not a hydraulic one. Separately,
   `lpn_settings_tolerance` and its tip are supplied to `pageConfig` by `Looped-Network.php:2226-2227`
   and read by nothing in `js/` — a `key_hygiene_check.php` candidate carrying 26 translations.
   Both halves are decisions for somebody who knows which setting was intended.
   [TGH: Good catch. Serious issues. I don't find a convergence tolerance in EPANET. I find a Quality Tolerance: "Smallest change in quality that will cause a new parcel of water to be created in a pipe. A typical setting might be 0.01 for chemicals measured in mg/L as well as water age and source tracing."]
2. **`lpn_file_import_geo_tip` ends "Every number you typed stays as it is"** on a control whose
   whole subject is a file somebody else may have written. The sibling `lpn_georef_asdeg_tip` says
   "Every number stays exactly as it is either way", which is the true statement and covers both
   cases.
   [TGH: I edited lang.]

3. **`lpn_control_dangling_note` uses the transitive *name* for a reference** ("These controls name
   an element that is no longer in this project"), which is what Tom struck on 2026-09-06. Its own
   sibling `lpn_rule_dangling_note` already says "refer to". One word would put the two notes back in
   parallel; left alone because it is a ruling to apply, not wordiness.
   [TGH: For better or worse, I edited lang.]
4. **`lpn_tool_color_tip` spells it "Colour"** while `lpn_color_ranges_note`,
   `lpn_pane_right_toggle_tip`, `lpn_settings_color_thematic_tip` and the rest of the page spell it
   "color". Oxford is the project's reference for spelling, so the odd one out may in fact be the
   correct one and the sweep is the expensive direction. A decision, not an edit.
   [TGH: Worth ruling on and standardizing even if we need another translation sprint over it. I found serious issues, and I am eager to retranslate.]

## 4. Em dash

One removed, in `lpn_georef_scale_tip`, replaced by a comma. `EC_EM_DASH_BASELINE` in
`dev/scripts/em_dash_ratchet_check.php` lowered from **60 to 59**, which is the measured count after
this pass. No other `lpn_` string was edited for its dash: ten more carry one and none of them was
otherwise being touched.
