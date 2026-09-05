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

**33 still to read**, of 111 untranslated keys, of 1648 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## lpn_  (111, 33 to read @@ NEEDS RULING)

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
  > Running
  _Ruled OK 2026-09-04._
- **`lpn_energy_currency`**
  > Currency
  _Ruled OK 2026-09-04._
- **`lpn_energy_currency_tip`**
  > Whatever you write here is printed beside every money figure. It is a label. Prices and costs are never converted, so write the prices in the currency you name.
  _Ruled OK 2026-09-04._
- **`lpn_energy_curve_note`**
  > These pumps name an efficiency curve that the file they came from does not state, so they ran at the efficiency set for the whole network: {ids}.
  _Ruled OK 2026-09-05._
- **`lpn_energy_demand_charge`**
  > Peak demand charge
  _Ruled OK 2026-09-04._
- **`lpn_energy_demand_charge_tip`**
  > What the utility bills for each kilowatt of the highest power every pump drew at one moment. It is charged on that one moment, not on the energy used, so it is added once and not per pump.
  _Ruled OK 2026-09-04._
- **`lpn_energy_efficiency`**
  > Pump efficiency (percent)
  _Ruled OK 2026-09-04._
- **`lpn_energy_efficiency_tip`**
  > The wire to water efficiency used for every pump that does not carry an efficiency curve of its own. EPANET uses 75 percent when nothing is stated.
  _Ruled OK 2026-09-04._
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
  > How long each pump ran, what power it drew and what it cost over the last extended period simulation.
  _Ruled OK 2026-09-04._
- **`lpn_energy_needs_run`**
  > Pump energy is power added up over time, so it needs the EPANET engine and a total run time. Set a Total run time under Time, press the Calculate button, then open Pump energy report under Calculate.
  _Ruled OK 2026-09-04._
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
  > A pattern that multiplies the price hour by hour, which is how an off peak rate is specified. Leave it empty for one price all day.
  _Ruled OK 2026-09-04._
- **`lpn_energy_price_tip`**
  > What one kilowatt hour costs. It applies to every pump that does not carry a price of its own. Leave it empty and every cost in the report is zero.
  _Ruled OK 2026-09-04._
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
  > Peak demand charge
  _Ruled OK 2026-09-04._
- **`lpn_energy_total_energy_cost`**
  > Cost of energy
  _Ruled OK 2026-09-04._
- **`lpn_energy_total_kwh`**
  > Energy used
  _Ruled OK 2026-09-04._
- **`lpn_ff_col_static_tip`**
  > The pressure at this junction before any fire flow is drawn, with the system's ordinary demands still running. Nothing is shut off to measure it, so this is not a zero-flow pressure for the system; it is the same pressure the map shows at this junction. AWWA M31 and NFPA 291 both use this name for the reading a fire flow test starts from.
  _Ruled OK 2026-09-04._
- **`lpn_find_prop_demand_description`**
  > Demand category description
  _Ruled OK 2026-09-04._
- **`lpn_inp_drop_net_options`**
  > This EPANET .net file states these settings in places this page has no name for, so their values are listed here rather than carried across. Everything else came over. If you need them, open the file in EPANET and use File, Export, Network to save it as an .inp file, then import that.
  _Ruled OK 2026-09-04._
- **`lpn_inp_drop_sources_mixing`**
  > This file says where more of the substance is added to the network, and how the water in a tank mixes. This page reads both and uses both. A dose shows up on the node it is added at, and a tank says which mixing model it follows; run the model with the EPANET engine and both are worked out along with the rest of the water quality. The lines are kept, and they are written back if you save an EPANET file.
  @@ NEEDS RULING
- **`lpn_library_rule_add`**
  > Add a rule
  @@ NEEDS RULING
- **`lpn_library_rule_bad`**
  > ⚠ Not understood
  @@ NEEDS RULING
- **`lpn_library_rule_missing`**
  > ⚠ This network has nothing called {id}
  @@ NEEDS RULING
- **`lpn_library_rule_ok`**
  > ✓ Understood
  @@ NEEDS RULING
- **`lpn_library_rule_tip`**
  > One rule, in the words EPANET uses, one clause per line. A first line names it: RULE 1. Then a condition: IF TANK 2 LEVEL BELOW 17.1. Then what to do about it: THEN PUMP 9 STATUS IS OPEN. A last line may rank it: PRIORITY 1. Add AND or OR lines to test more than one thing, and ELSE lines to say what to do when the test fails. A condition can read LEVEL, HEAD, GRADE, PRESSURE or DEMAND on a node, FLOW, STATUS or SETTING on a link, or TIME and CLOCKTIME on SYSTEM. Write the numbers in the units this project is showing; they are converted for you. Leave the keywords in English; they are what the page and EPANET read.
  @@ NEEDS RULING
- **`lpn_library_rules`**
  > Rules
  @@ NEEDS RULING
- **`lpn_library_rules_tip`**
  > A rule is a short paragraph that opens or closes a link, or gives it a setting, when a water level, a pressure, a flow or a time says so. Rules can test more than one thing at once, and they can say what to do when the test fails.
  @@ NEEDS RULING
- **`lpn_mixing_2comp`**
  > Two compartment mixing
  @@ NEEDS RULING
- **`lpn_mixing_fifo`**
  > FIFO plug flow
  @@ NEEDS RULING
- **`lpn_mixing_fraction`**
  > Mixing fraction
  @@ NEEDS RULING
- **`lpn_mixing_fraction_tip`**
  > The share of the tank volume that the inlet zone takes up, between 0 and 1. Only two compartment mixing uses it. Leave it empty and the whole tank is the inlet zone, which is what EPANET assumes.
  @@ NEEDS RULING
- **`lpn_mixing_lifo`**
  > LIFO plug flow
  @@ NEEDS RULING
- **`lpn_mixing_mixed`**
  > Complete mixing
  @@ NEEDS RULING
- **`lpn_mixing_model`**
  > Mixing model
  @@ NEEDS RULING
- **`lpn_mixing_model_tip`**
  > How the water already in this tank mixes with the water coming in. Complete mixing stirs the whole tank at once. Two compartment mixing fills an inlet zone first and passes the rest on. FIFO plug flow moves the water through in the order it arrived. LIFO plug flow stacks it, so the last water in is the first water out. The choice changes the water age and the residual, and it does not change any pressure or flow.
  @@ NEEDS RULING
- **`lpn_net_emergency`**
  > This was an EPANET .net file. That is EPANET's own project file, it has no published description, and this page reads it by inspection, so treat it as a way in when you have no other rather than as a dependable route. The .inp file is the documented format that every other program reads: in EPANET use File, Export, Network to write one, and import that instead whenever you can.
  _Ruled OK 2026-09-04._
- **`lpn_new_units_tip`**
  > A project keeps its own units, so this choice belongs to this project alone and nothing here is saved as a browser setting. To start new projects a particular way, save an empty project as your template and make a copy of it each time.
  _Ruled OK 2026-09-04._
- **`lpn_pump_effic_col`**
  > Efficiency
  @@ NEEDS RULING
- **`lpn_pump_effic_curve`**
  > Efficiency curve
  @@ NEEDS RULING
- **`lpn_pump_effic_curve_tip`**
  > The name of the efficiency curve this pump uses, as its file states it. Its points are below, in flow and percent. Editing them is not built yet, so this is a reading of the file rather than a control.
  @@ NEEDS RULING
- **`lpn_pump_effic_global`**
  > This pump has no efficiency curve, so it runs at the network efficiency of {percent}.
  @@ NEEDS RULING
- **`lpn_pump_effic_unstated`**
  > This pump names the efficiency curve {name}, which its file does not state, so it runs at the network efficiency of {percent}.
  @@ NEEDS RULING
- **`lpn_quality_chemical_name`**
  > Chemical and units
  _Ruled OK 2026-09-04._
- **`lpn_quality_chemical_name_tip`**
  > The name of the chemical and the units its concentrations are written in, for example Chlorine mg/L. This is a label. EPANET does not convert a concentration, so every concentration and every coefficient in the project has to be written in these units already.
  _Ruled OK 2026-09-04._
- **`lpn_quality_initial`**
  > Initial quality
  _Ruled OK 2026-09-04._
- **`lpn_quality_initial_tip`**
  > How much of the chemical this node holds when the run starts. A reservoir holds its own value for the whole run, which is how the residual leaving a treatment plant is usually stated. Leave it empty for none.
  _Ruled OK 2026-09-04._
- **`lpn_reaction_bulk`**
  > Bulk reaction coefficient
  _Ruled OK 2026-09-04._
- **`lpn_reaction_bulk_short`**
  > Bulk reaction
  _Ruled OK 2026-09-04._
- **`lpn_reaction_bulk_tip`**
  > Reaction in the body of the water, used for every pipe that does not carry its own. A negative number decays the chemical and a positive one grows it. First order unless the file says otherwise, so the coefficient is a rate in 1/day. An empty box means no bulk reaction.
  _Ruled OK 2026-09-04._
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
  > Reaction at the pipe wall, used for every pipe that does not carry its own. A negative number decays the chemical. First order unless the file says otherwise, so the coefficient is a length per day, written in the project length unit. An empty box means no wall reaction.
  _Ruled OK 2026-09-04._
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
  > These rules name an element that is no longer in this project, so they were left out: {ids}
  @@ NEEDS RULING
- **`lpn_rule_unreadable_note`**
  > These rules could not be read, so they were left out: {ids}
  @@ NEEDS RULING
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
  > (open now)
  _Ruled OK 2026-09-04._
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
  > Settings index width
  _Ruled OK 2026-09-04._
- **`lpn_settings_energy`**
  > Energy
  _Ruled OK 2026-09-04._
- **`lpn_source_pattern`**
  > Source pattern
  @@ NEEDS RULING
- **`lpn_source_pattern_tip`**
  > A time pattern that scales the dose through the day, for a feed that does not run flat out around the clock. Leave it on No pattern and the dose is the same at every hour.
  @@ NEEDS RULING
- **`lpn_source_quality`**
  > Source quality
  @@ NEEDS RULING
- **`lpn_source_quality_tip`**
  > How strong the dose is. For every type but the mass booster this is a concentration, in the units named beside the chemical under Settings, Water quality; for a mass booster it is a mass of chemical per minute. Leave it empty and nothing is added here, which is not the same as a zero: a zero is a feed that is running and adding nothing.
  @@ NEEDS RULING
- **`lpn_source_type`**
  > Source type
  @@ NEEDS RULING
- **`lpn_source_type_concen`**
  > Concentration
  @@ NEEDS RULING
- **`lpn_source_type_flowpaced`**
  > Flow paced booster
  @@ NEEDS RULING
- **`lpn_source_type_mass`**
  > Mass booster
  @@ NEEDS RULING
- **`lpn_source_type_setpoint`**
  > Setpoint booster
  @@ NEEDS RULING
- **`lpn_source_type_tip`**
  > What kind of dose this node applies to the water passing through it. Concentration treats the water entering the network here as arriving at the strength below. Mass booster adds a mass of chemical every minute, whatever the flow is. Setpoint booster lifts the water leaving this node to the strength below and no further. Flow paced booster adds the strength below to whatever is already in the water.
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
  > Thank you. We got that.
  _Ruled OK 2026-09-04._
- **`lpn_wrong_tip`**
  > One tap tells us that something on this page is wrong. It sends the name of this page, the language you are reading it in, and the message on the map if there is one. It sends no text, no address, and nothing at all out of your drawing. Nobody can write back, because this tells us nothing about who you are. Use Help, Fix something when you want to say more.
  _Ruled OK 2026-09-04._
