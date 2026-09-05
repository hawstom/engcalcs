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

**0 still to read**, of 79 untranslated keys, of 1616 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## lpn_  (79, all ruled)

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
  > These pumps have an efficiency curve in the file they came from. This page has no place to hold one, so they ran at the efficiency set for the whole network: {ids}.
  _Ruled OK 2026-09-04._
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
  > This file says where more of the substance is added to the network, and how the water in a tank mixes. This page does not work out either of those yet, so a chemical run here starts from the amount the file gives each junction, reservoir and tank, and every tank is treated as completely mixed. Those lines are kept, and they are written back if you save an EPANET file.
  _Ruled OK 2026-09-04._
- **`lpn_net_emergency`**
  > This was an EPANET .net file. That is EPANET's own project file, it has no published description, and this page reads it by inspection, so treat it as a way in when you have no other rather than as a dependable route. The .inp file is the documented format that every other program reads: in EPANET use File, Export, Network to write one, and import that instead whenever you can.
  _Ruled OK 2026-09-04._
- **`lpn_new_units_tip`**
  > A project keeps its own units, so this choice belongs to this project alone and nothing here is saved as a browser setting. To start new projects a particular way, save an empty project as your template and make a copy of it each time.
  _Ruled OK 2026-09-04._
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
