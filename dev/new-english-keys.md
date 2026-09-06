# English strings nobody has ruled on yet

**Generated — never hand-edited.** `php dev/scripts/new_english_keys.php --write`.
`check_all.sh` fails if this file has drifted from `lib/lang.ec.en.php`.

These are the keys that are in `lib/lang.ec.en.php` and in NONE of the other 26 language
files — which is, by construction, every string that has been written and not yet ruled on or
translated. **An absent key is the correct untranslated state**, so this is a worklist and never
a fault.

What to do with it: read the English, and say where it is wrong. A ruling is a sentence in
conversation, not an edit — the wording is Tom's and the editing is AI's. Once the wording is
settled these go into the next translation sprint as a batch.

**44 still to read**, of 145 untranslated keys, of 1675 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (6 to read @@ NEEDS RULING)

**These are SHIPPED strings, already translated into 26 languages.** A wave-0
reading or a translator found each one readable two ways, and no sprint launches while one is
unanswered. You are not being asked to approve wording here; you are being asked which reading
is the one you meant. "The first one" is a complete answer.

### from sprint 584-wave0

- **`lpn_field_tag`**
  > Tag
  *The finding:* high: a bare 'Tag' as a property label, in a page that already distinguishes Label from Text as two named objects. 'Tag' is one of the most heavily overloaded nouns in software English -- markup tag, price tag, name tag, hashtag, asset tag -- and this instance is EPANET's own [TAGS] section, a single unspaced token attached to an asset. A translator with no context will very often pick the markup or the price sense, and in several languages the markup sense is a borrowed English word that will look deliberate.
  1. EPANET's per-asset tag: one unspaced token of the user's own meaning (intended)
  2. an HTML/XML markup tag
  3. a price tag or a name tag
  4. a label attached to the map, i.e. this page's own Label object
  @@ NEEDS RULING
- **`lpn_library_curve_copy`**
  > Copy points
  *The finding:* low: 'Copy points' (lpn_library_curve_copy) and 'Copy these points' (lpn_library_curve_copy_manual) are two labels for the same action, one with a demonstrative and one without, and lpn_time_run_report_copy is a third copy label reading just 'Copy'. Nothing in any of the three says which is the button and which is the fallback prompt, so a translator meeting them in a payload sees a set that looks inconsistent and may harmonise them into one -- destroying the distinction the code relies on.
  1. a button that copies the curve's points (lpn_library_curve_copy's intent)
  2. a manual-copy prompt over a pre-selected block (lpn_library_curve_copy_manual's intent)
  3. two buttons that do different things
  @@ NEEDS RULING
- **`lpn_scenario_overrides`**
  > No. of custom values
  *The finding:* high, and verified in the code. 'No. of custom values' has two defects that compound. (1) 'No.' as an abbreviation for 'number' is invisible outside English typographic convention -- the full stop is the only thing separating it from the word 'no', and in a string about scenario overrides 'No custom values' is a completely plausible and completely wrong message. Several languages have no such abbreviation at all. (2) js/looped-network.js uses this one key in two places with two different shapes: at line 31751 it is a table column heading, and at line 2553 it is rendered as `label + ': ' + count`, producing 'No. of custom values: 3' on the scenario button. The second reading is a stammer in English and a near-certain negation in translation. The two call sites even carry different fallbacks ('Overrides' and 'Custom values'), which is the code telling us the one label is doing two jobs.
  1. the number of properties overridden in this scenario (intended)
  2. no custom values -- a negation, which is exactly the false state the button reports when the count is not zero
  3. an item number or index
  @@ NEEDS RULING
- **`lpn_scncmp_at`**
  > {value} at {id}
  *The finding:* medium: '{value} at {id}' is two placeholders and one preposition. A translator has no way to know that {value} is a pressure or a velocity with its unit already attached and that {id} is an element id, so 'at' could be temporal, spatial or attributive, and several languages need to know the noun's gender or case before they can choose the preposition at all. It is the shortest string in the set and the one that carries the least recoverable information.
  1. the extreme value, and the element where it occurs (intended)
  2. a value measured at a time
  3. a value belonging to an identifier
  @@ NEEDS RULING
- **`mhp_notes_3_def`**
  > Penstock (supply pipe) losses below 10% of gross head are generally economical. The optimal trade-off between pipe cost and lost power often falls around 4–6% assuming 2026 high-end electricity costs.
  *The finding:* medium: 'assuming 2026 high-end electricity costs' has two readings and one of them inverts the advice. 'High-end' most commonly means premium or top-of-the-range as a product grade; here it means an expensive tariff. A translator picking the product-grade sense produces a sentence about premium electricity, which is not a thing. Separately the sentence carries a bare year that will be stale next year in 27 languages at once, and 'losses below 10% of gross head are generally economical' predicates economy of the LOSS rather than of the design that has it -- an English reader re-reads that too.
  1. assuming an electricity price at the high end of the range seen in 2026 (intended)
  2. assuming the cost of high-end (premium grade) electricity
  3. assuming costs that are high, at the end of 2026
  @@ NEEDS RULING
- **`mtc_n_strickler`**
  > n from design rock size (Strickler method)
  *The finding:* medium: two problems, and mtc_n_blodgett, mtc_n_bathurst and mtc_n_pi carry both identically. (1) The string opens with a bare lower-case 'n', which is Manning's roughness coefficient, but nothing in the string says so. Read cold it is an English letter with no marker, no subscript and no possessive, so a translator will treat it as a word to translate, an abbreviation to expand, or a typo -- the exact shape that produced the 'Top n' finding in 438-wave0. (2) 'design rock size' is a three-word noun stack with two parses. All four keys carry an EMPTY $ec_lang_syn, so nothing anywhere tells a translator that n is a symbol.
  1. Manning's n, computed from the design rock size, by the Strickler method (intended)
  2. the letter n as an ordinary word or abbreviation to be rendered in the target language
  3. the size of rock chosen for the design (intended) vs a rock of a size that is itself 'design' grade
  @@ NEEDS RULING

## bpn_  (2, 2 to read @@ NEEDS RULING)

- **`bpn_dup_id_short`**
  > Duplicate ID
  @@ NEEDS RULING
- **`bpn_not_connected_short`**
  > Not connected
  @@ NEEDS RULING

## lpn_  (143, 42 to read @@ NEEDS RULING)

- **`lpn_curve_kind_effic`**
  > Pump efficiency
  _Ruled OK 2026-09-05._
- **`lpn_curve_kind_generic`**
  > Kind not stated
  @@ NEEDS RULING
- **`lpn_curve_kind_head`**
  > Pump head
  _Ruled OK 2026-09-05._
- **`lpn_curve_kind_headloss`**
  > Valve head loss
  _Ruled OK 2026-09-05._
- **`lpn_curve_kind_volume`**
  > Tank volume
  _Ruled OK 2026-09-05._
- **`lpn_curve_library_link`**
  > Libraries, Curves
  @@ NEEDS RULING
- **`lpn_curve_library_link_tip`**
  > Opens the Libraries box on its Curves section, where a curve is added, described, edited and deleted. An asset states which curve it uses.
  _Ruled OK 2026-09-06._
- **`lpn_curve_none`**
  > No curve selected
  @@ NEEDS RULING
- **`lpn_curve_volume_col`**
  > Volume
  _Ruled OK 2026-09-05._
- **`lpn_energy_col_avg_kw`**
  > Avg. kW
  _Ruled OK 2026-09-04._
- **`lpn_energy_col_avg_kw_tip`**
  > The average power used when this pump was running. It is not averaged over idle periods, so a pump that was idle for much of the extended period simulation still reports the power it used while it ran.
  _Ruled OK 2026-09-04._
- **`lpn_energy_col_cost`**
  > Cost
  _Ruled OK 2026-09-04._
- **`lpn_energy_col_effic`**
  > Effic.
  _Ruled OK 2026-09-04._
- **`lpn_energy_col_kwh`**
  > kWh
  _Ruled OK 2026-09-04._
- **`lpn_energy_col_peak_kw`**
  > Peak kW
  _Ruled OK 2026-09-04._
- **`lpn_energy_col_pump`**
  > Pump
  _Ruled OK 2026-09-04._
- **`lpn_energy_col_running`**
  > % of run
  @@ NEEDS RULING
- **`lpn_energy_currency`**
  > Currency
  _Ruled OK 2026-09-04._
- **`lpn_energy_currency_tip`**
  > Whatever you write here is printed beside every money figure. It is a label. Prices and costs are never converted, so write the prices in the currency you have written here.
  @@ NEEDS RULING
- **`lpn_energy_curve_note`**
  > These pumps call an efficiency curve with no points: {ids}. They ran at the efficiency set for the whole network.
  @@ NEEDS RULING
- **`lpn_energy_demand_charge`**
  > Peak demand charge
  _Ruled OK 2026-09-04._
- **`lpn_energy_demand_charge_tip`**
  > What the utility bills for each kilowatt of the highest total power all the pumps together drew at any one moment. It is charged on that one moment, not on the energy used, so it is added once for the whole network and never per pump.
  @@ NEEDS RULING
- **`lpn_energy_efficiency`**
  > Pump efficiency (percent)
  _Ruled OK 2026-09-04._
- **`lpn_energy_efficiency_tip`**
  > The wire-to-water efficiency used for every pump that does not carry an efficiency curve of its own. EPANET uses 75 percent when nothing is stated.
  @@ NEEDS RULING
- **`lpn_energy_kw`**
  > kW
  _Ruled OK 2026-09-04._
- **`lpn_energy_kwh`**
  > kWh
  _Ruled OK 2026-09-04._
- **`lpn_energy_menu`**
  > Pump energy
  _Ruled OK 2026-09-04._
- **`lpn_energy_menu_tip`**
  > What share of the run each pump was on, what power it drew and what it cost over the last extended period simulation.
  @@ NEEDS RULING
- **`lpn_energy_needs_run`**
  > Pump energy is power integrated over the run, so it needs an extended period simulation: the EPANET engine and a total run time. Set a Total run time in Settings, Calculation, Time, press the Calculate button, then open Water, Reports, Pump energy.
  @@ NEEDS RULING
- **`lpn_energy_no_price`**
  > No price of power is stated, so every cost here is zero. Set one under Settings, Energy.
  _Ruled OK 2026-09-04._
- **`lpn_energy_no_pumps`**
  > This network has no pumps, so there is nothing drawing power.
  _Ruled OK 2026-09-04._
- **`lpn_energy_over`**
  > For extended period simulation of {time}
  _Ruled OK 2026-09-04._
- **`lpn_energy_peak_kw`**
  > Peak power usage
  _Ruled OK 2026-09-04._
- **`lpn_energy_price`**
  > Price of power
  _Ruled OK 2026-09-04._
- **`lpn_energy_price_note`**
  > This page offers no price of its own. What power costs depends on the utility, the country, the hour and the year, so a number supplied here would be read as a recommendation. Enter the price from your own tariff.
  _Ruled OK 2026-09-04._
- **`lpn_energy_price_pattern`**
  > Price pattern
  _Ruled OK 2026-09-04._
- **`lpn_energy_price_pattern_tip`**
  > A pattern that multiplies the price at each pattern step, which is how an off-peak rate is specified. Leave it empty for one price throughout the run.
  @@ NEEDS RULING
- **`lpn_energy_price_tip`**
  > What one kilowatt hour costs. It applies to every pump that does not carry a price of its own. Leave it empty and every cost in the report is zero.
  _Ruled OK 2026-09-04._
- **`lpn_energy_price_zero`**
  > This network states a price of zero, so every cost here is zero. Change it under Settings, Energy.
  @@ NEEDS RULING
- **`lpn_energy_pump_price_tip`**
  > What one kilowatt hour costs at this pump. Leave it empty and the pump pays the price set for the whole network under Settings, Energy.
  _Ruled OK 2026-09-04._
- **`lpn_energy_title`**
  > Pump energy report
  _Ruled OK 2026-09-04._
- **`lpn_energy_total_cost`**
  > Total cost
  _Ruled OK 2026-09-04._
- **`lpn_energy_total_demand_charge`**
  > Cost of peak demand
  @@ NEEDS RULING
- **`lpn_energy_total_energy_cost`**
  > Cost of energy
  _Ruled OK 2026-09-04._
- **`lpn_energy_total_kwh`**
  > Energy used
  _Ruled OK 2026-09-04._
- **`lpn_ff_col_static_tip`**
  > The pressure at this junction before any fire flow is drawn, with the system's ordinary demands still running. Nothing is shut off to measure it, so this is not a zero-flow pressure for the system; it is the same pressure the map shows at this junction. AWWA M31 and NFPA 291 both call this reading the static pressure, and it is where a fire flow test starts.
  @@ NEEDS RULING
- **`lpn_field_tag`**
  > Tag
  _Ruled OK 2026-09-05._
- **`lpn_field_tag_tip`**
  > A tag can have any meaning you require, such as a pressure zone or a work order. No calculation here or in EPANET reads it. A tag is one word: EPANET stops reading at the first space, so a space is refused as you type it. It is carried into and out of the EPANET file.
  @@ NEEDS RULING
- **`lpn_find_prop_demand_desc`**
  > Description of demand category
  @@ NEEDS RULING
- **`lpn_gpv_curve_source`**
  > Valve head loss curve
  @@ NEEDS RULING
- **`lpn_gpv_curve_source_tip`**
  > The curve in the Libraries box that says how much head this valve loses at each flow. Several valves can use the same curve, and editing it there changes all of them. This valve holds only the reference; the points themselves are read and edited under Libraries, Curves.
  _Ruled OK 2026-09-06._
- **`lpn_inp_drop_net_options`**
  > This EPANET .net file states settings that this page has no control for, so their values are listed here rather than carried across. Everything else came over. If you need them, open the file in EPANET and use File, Export, Network to save it as an .inp file, then import that.
  @@ NEEDS RULING
- **`lpn_inp_drop_sources_mixing`**
  > This file says where a chemical is dosed into the network, and how the water in a tank mixes. A dose shows up on the node it is added at, and a tank says which mixing model it follows. Both the dose and the mixing model are calculated by the EPANET engine only.
  @@ NEEDS RULING
- **`lpn_library_curve_add`**
  > Add a curve
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_copy`**
  > Copy points
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_copy_manual`**
  > Copy these points
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_copy_tip`**
  > Copies every point as two columns, ready to paste into a spreadsheet.
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_equation`**
  > Equation
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_equation_tip`**
  > The curve fitted through the points, and the line drawn on the plot below. It is worked out from the points every time it is shown and is never stored, and its numbers are in the units the table above shows. The built-in solver runs on this equation; the EPANET engine reads the points themselves.
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_in_use`**
  > This curve is used by {count} elements: {ids}. Point them at another curve first, then delete this one.
  @@ NEEDS RULING
- **`lpn_library_curve_note_label`**
  > Description
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_note_tip`**
  > What this curve is, in your own words. It is written above the curve in an EPANET file and read back from there.
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_remove_point`**
  > Remove this point
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_type`**
  > Curve type
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_type_tip`**
  > What this curve describes
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_unused`**
  > Nothing uses this curve.
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_used_by`**
  > Elements using this curve
  @@ NEEDS RULING
- **`lpn_library_curve_values_tip`**
  > Select one or two columns in a spreadsheet, copy them, and paste into the first cell you want them to land in. The rows are added as they are needed. You can also paste lines copied straight out of an EPANET file, including the curve name.
  @@ NEEDS RULING
- **`lpn_library_curve_x`**
  > X
  _Ruled OK 2026-09-05._
- **`lpn_library_curve_y`**
  > Y
  _Ruled OK 2026-09-05._
- **`lpn_library_rule_add`**
  > Add a rule
  _Ruled OK 2026-09-05._
- **`lpn_library_rule_bad`**
  > ⚠ This rule could not be read
  @@ NEEDS RULING
- **`lpn_library_rule_missing`**
  > ⚠ This network has nothing called {id}
  _Ruled OK 2026-09-05._
- **`lpn_library_rule_ok`**
  > ✓ This rule was read
  @@ NEEDS RULING
- **`lpn_library_rule_tip`**
  > One rule, in the words EPANET uses, one clause per line. A first line names it: RULE 1. Then a condition: IF TANK 2 LEVEL BELOW 17.1. Then what to do about it: THEN PUMP 9 STATUS IS OPEN. A last line may rank it: PRIORITY 1. Add AND or OR lines to test more than one thing, and ELSE lines to say what to do when the test fails. A condition can read LEVEL, HEAD, GRADE, PRESSURE or DEMAND on a node, FLOW, STATUS or SETTING on a link, or TIME and CLOCKTIME on SYSTEM. Write the numbers in the units this project is showing; they are converted for you. Leave the keywords in English; they are what the page and EPANET read.
  _Ruled OK 2026-09-05._
- **`lpn_library_rules`**
  > Rules
  _Ruled OK 2026-09-05._
- **`lpn_library_rules_tip`**
  > A rule is a short paragraph that opens or closes a link, or gives it a setting, when a water level, a pressure, a flow or a time reaches a value you set. Rules can test more than one thing at once, and they can say what to do when the test fails.
  @@ NEEDS RULING
- **`lpn_mixing_2comp`**
  > Two-compartment mixing
  @@ NEEDS RULING
- **`lpn_mixing_fifo`**
  > FIFO plug flow
  _Ruled OK 2026-09-05._
- **`lpn_mixing_fraction`**
  > Mixing fraction
  _Ruled OK 2026-09-05._
- **`lpn_mixing_fraction_tip`**
  > The share of the tank volume that the inlet zone takes up, between 0 and 1. Only two compartment mixing uses it. Leave it empty and the whole tank is the inlet zone, which is what EPANET assumes.
  _Ruled OK 2026-09-05._
- **`lpn_mixing_lifo`**
  > LIFO plug flow
  _Ruled OK 2026-09-05._
- **`lpn_mixing_mixed`**
  > Complete mixing
  _Ruled OK 2026-09-05._
- **`lpn_mixing_model`**
  > Mixing model
  _Ruled OK 2026-09-05._
- **`lpn_mixing_model_tip`**
  > How the water already in this tank mixes with the water coming in. Complete mixing stirs the whole tank at once. Two-compartment mixing fills an inlet zone first and passes the rest on. FIFO plug flow moves the water through in the order it arrived. LIFO plug flow stacks it, so the last water in is the first water out. The choice changes the water age and the residual, and it does not change any pressure or flow.
  @@ NEEDS RULING
- **`lpn_net_emergency`**
  > This was an EPANET .net file. That is EPANET's own project file, it has no published description, and this page reads it by working the format out from example files, so use it only when you have nothing else rather than as a dependable route. The .inp file is the documented format that every other program reads: in EPANET use File, Export, Network to write one, and import that instead whenever you can.
  @@ NEEDS RULING
- **`lpn_new_units_tip`**
  > A project keeps its own units, so this choice belongs to this project alone and nothing here is saved as a browser setting. To start new projects a particular way, save an empty project as your template and make a copy of it each time.
  _Ruled OK 2026-09-04._
- **`lpn_pump_curve_source_tip`**
  > The curve in the Libraries box that says how much head this pump adds at each flow. Several pumps can use the same curve, and editing it there changes all of them. This pump holds only the reference; the points themselves are read and edited under Libraries, Curves.
  _Ruled OK 2026-09-06._
- **`lpn_pump_effic_col`**
  > Efficiency
  _Ruled OK 2026-09-05._
- **`lpn_pump_effic_curve`**
  > Pump efficiency curve
  @@ NEEDS RULING
- **`lpn_pump_effic_curve_tip`**
  > The curve in the Libraries box that says how efficient this pump is at each flow. Several pumps can use the same curve, and editing it there changes all of them. This pump holds only the reference; the points themselves are read and edited under Libraries, Curves.
  _Ruled OK 2026-09-06._
- **`lpn_pump_effic_global`**
  > This pump has no efficiency curve selected, so it runs at the efficiency set for the whole network, {percent}.
  @@ NEEDS RULING
- **`lpn_pump_effic_unstated`**
  > This pump refers to an efficiency curve called {name}, which nothing in this project defines, so it runs at the efficiency set for the whole network, {percent}.
  @@ NEEDS RULING
- **`lpn_quality_chemical_name`**
  > Chemical and units
  _Ruled OK 2026-09-04._
- **`lpn_quality_chemical_name_tip`**
  > The name of the chemical and the units its concentrations are written in: for example, write Chlorine mg/L as one entry. This is a label. EPANET does not convert a concentration, so every concentration and every coefficient in the project has to be written in these units already.
  @@ NEEDS RULING
- **`lpn_quality_initial`**
  > Initial quality
  _Ruled OK 2026-09-04._
- **`lpn_quality_initial_tip`**
  > How much of the chemical this node holds when the run starts. A reservoir holds its own value for the whole run, which is how the residual leaving a treatment plant is usually stated. Leave it empty and the node starts with none of the chemical.
  @@ NEEDS RULING
- **`lpn_reaction_bulk`**
  > Bulk reaction coefficient
  _Ruled OK 2026-09-04._
- **`lpn_reaction_bulk_short`**
  > Bulk reaction
  _Ruled OK 2026-09-04._
- **`lpn_reaction_bulk_tip`**
  > Reaction in the body of the water, used for every pipe that does not carry its own. A negative number decays the chemical and a positive one increases it. The reaction is first order unless an imported EPANET file states another order, so the coefficient is a rate in 1/day. An empty box means no bulk reaction.
  @@ NEEDS RULING
- **`lpn_reaction_day`**
  > day
  _Ruled OK 2026-09-04._
- **`lpn_reaction_note`**
  > This page offers no reaction coefficient of its own. There is no standard test for one, and published field values for the same kind of water differ by a factor of ten, so a number supplied here would be read as a recommendation. Enter one you have measured or one you can cite, or leave the boxes empty for a chemical that does not react.
  _Ruled OK 2026-09-04._
- **`lpn_reaction_per_day`**
  > 1/day
  _Ruled OK 2026-09-04._
- **`lpn_reaction_pipe_tip`**
  > This pipe on its own. Leave it empty and the pipe uses the coefficient set for the whole network under Settings, Water quality.
  _Ruled OK 2026-09-04._
- **`lpn_reaction_tank`**
  > Reaction coefficient
  _Ruled OK 2026-09-04._
- **`lpn_reaction_tank_short`**
  > Reaction
  _Ruled OK 2026-09-04._
- **`lpn_reaction_tank_tip`**
  > Reaction in the water held in this tank, as a rate in 1/day. A negative number decays the chemical and a positive one grows it. Water stands in a tank far longer than it stands in any pipe, so this is often where a residual is lost. Leave it empty and the tank uses the bulk reaction coefficient set for the whole network under Settings, Water quality.
  _Ruled OK 2026-09-04._
- **`lpn_reaction_wall`**
  > Wall reaction coefficient
  _Ruled OK 2026-09-04._
- **`lpn_reaction_wall_short`**
  > Wall reaction
  _Ruled OK 2026-09-04._
- **`lpn_reaction_wall_tip`**
  > Reaction at the pipe wall, used for every pipe that does not carry its own. A negative number decays the chemical. The reaction is first order unless an imported EPANET file states another order, so the coefficient is a length per day, written in the project length unit. An empty box means no wall reaction.
  @@ NEEDS RULING
- **`lpn_reports_epanet`**
  > EPANET run
  _Ruled OK 2026-09-04._
- **`lpn_reports_menu`**
  > Reports
  _Ruled OK 2026-09-04._
- **`lpn_reports_menu_tip`**
  > The finished answers this page produces once a network has been calculated: what the pumps cost, how the scenarios compare, and what the EPANET solver itself printed.
  _Ruled OK 2026-09-04._
- **`lpn_result_concentration`**
  > Concentration
  _Ruled OK 2026-09-04._
- **`lpn_result_concentration_tip`**
  > How much of the chemical is left at this point after it has travelled and reacted. The units are the ones named beside the chemical under Settings, Water quality.
  _Ruled OK 2026-09-04._
- **`lpn_rule_dangling_note`**
  > These rules refer to an element that is no longer in this project, so they were ignored in this run: {ids}
  @@ NEEDS RULING
- **`lpn_rule_unreadable_note`**
  > These rules could not be read, so they were ignored in this run: {ids}
  _Ruled OK 2026-09-05._
- **`lpn_scncmp_at`**
  > {value} at {id}
  _Ruled OK 2026-09-04._
- **`lpn_scncmp_col_maxvelocity`**
  > Highest velocity
  _Ruled OK 2026-09-04._
- **`lpn_scncmp_col_minpressure`**
  > Lowest pressure
  _Ruled OK 2026-09-04._
- **`lpn_scncmp_current`**
  > (currently open)
  @@ NEEDS RULING
- **`lpn_scncmp_empty`**
  > Nothing has been drawn yet, so there is nothing to solve.
  _Ruled OK 2026-09-04._
- **`lpn_scncmp_menu_tip`**
  > Solve every scenario in this project and read them side by side: the lowest pressure and the highest velocity in each.
  _Ruled OK 2026-09-04._
- **`lpn_scncmp_note`**
  > Every scenario is solved from a copy of the drawing. Nothing here changes the project, and the scenario you are working in is left as it was.
  _Ruled OK 2026-09-04._
- **`lpn_scncmp_running`**
  > Solving every scenario…
  _Ruled OK 2026-09-04._
- **`lpn_scncmp_title`**
  > Scenario comparison
  _Ruled OK 2026-09-04._
- **`lpn_setbox_divider`**
  > Width of the Settings section list
  @@ NEEDS RULING
- **`lpn_settings_energy`**
  > Energy
  _Ruled OK 2026-09-04._
- **`lpn_source_pattern`**
  > Source pattern
  _Ruled OK 2026-09-05._
- **`lpn_source_pattern_tip`**
  > A time pattern that scales the dose through the run, for a feed that is not constant. No pattern means that the dose is the same at every step.
  _Ruled OK 2026-09-06._
- **`lpn_source_quality`**
  > Source quality
  _Ruled OK 2026-09-05._
- **`lpn_source_quality_tip`**
  > How strong the dose is. For every type but the mass booster this is a concentration, in the units named beside the chemical under Settings, Water quality; for a mass booster it is a mass of chemical per minute. Leave it empty and nothing is added here, which is not the same as a zero: a zero is a feed that is running and adding nothing.
  _Ruled OK 2026-09-05._
- **`lpn_source_type`**
  > Source type
  _Ruled OK 2026-09-05._
- **`lpn_source_type_concen`**
  > Concentration
  _Ruled OK 2026-09-05._
- **`lpn_source_type_flowpaced`**
  > Flow-paced booster
  @@ NEEDS RULING
- **`lpn_source_type_mass`**
  > Mass booster
  _Ruled OK 2026-09-05._
- **`lpn_source_type_setpoint`**
  > Setpoint booster
  _Ruled OK 2026-09-05._
- **`lpn_source_type_tip`**
  > What kind of dose this node applies to the water passing through it. Concentration treats the water entering the network here as arriving at the Source quality value. Mass booster adds a mass of chemical every minute, whatever the flow is. Setpoint booster lifts the concentration leaving this node to the Source quality value and no further. Flow-paced booster adds the Source quality value to whatever is already in the water.
  @@ NEEDS RULING
- **`lpn_time_run_report_copied`**
  > Copied
  _Ruled OK 2026-09-04._
- **`lpn_time_run_report_copy`**
  > Copy
  _Ruled OK 2026-09-04._
- **`lpn_wrong_btn`**
  > Something wrong here?
  _Ruled OK 2026-09-04._
- **`lpn_wrong_thanks`**
  > Thank you. That reached us.
  @@ NEEDS RULING
- **`lpn_wrong_tip`**
  > One press tells us that something on this page is wrong. It sends the name of this page, the language you are reading it in, and the message on the map if there is one. It sends nothing you have typed, no address, and nothing at all out of your drawing. Nobody can write back, because this tells us nothing about who you are. Use Help, Fix something when you want to say more.
  @@ NEEDS RULING
