# What this page calls the extended-period simulation

Tom, 2026-09-04, ruling on `lpn_energy_over` ("Over a run of {time}."): *"Use 'extended period
simulation' and audit the page for this terminology standardization Time Simulation in all its real
variants becomes EPS or extended etc."*

The one string he ruled on is changed. **This file is the audit, and it is a worklist for him rather
than a sweep already made**, because the sweep costs more than it looks and part of it would undo
rulings he made the same morning.

## The measurement

58 shipped English strings on the `lpn_`/`bpn_` pages contain *run*, *running*, *ran*, *period* or
*simulation*. That number is the reason this is an audit and not a find-and-replace: **most of them
are ordinary English and have nothing to do with naming the analysis.**

| Kind | Count | Examples |
|---|---|---|
| Ordinary English "run" — nothing to standardise | 21 | *"this site has run out of room"*, *"A search is already running"*, *"Runs the EPANET solver"*, *"pumps run at a speed other than…"*, *"Run the model with the EPANET engine"* |
| Names the EXTENDED-PERIOD ANALYSIS, using a variant | 20 | *Total run time*, *"the run finished"*, *"through the run"*, *"how long this network runs"*, *"from the start of the run to the end of it"* |
| Already says period or simulation | 4 | *"Working out the whole time period"*, *"a simulation that runs over a period of time"*, *"no time period"*, and `lpn_energy_over`, changed today |
| Fire flow's own runs — a DIFFERENT thing | 13 | *"Fire flow run"*, *"This run solved the whole network {solves} times"*, *"Runs"* as a column heading |

**The fire-flow group is the one that must not be swept**, and it is nearly a quarter of the hits. A
fire-flow run is N steady-state solves, not an extended-period simulation; renaming it would say
something false. Same for `lpn_ff_calculate` ("Run") and the `Runs` column.

## The cost, stated before the decision rather than after

Of the 20 strings that genuinely name the analysis:

- **17 are already translated into 26 languages.** Changing an English value there is 17 x 26 = **442
  retranslations** of text whose meaning does not move.
- **6 of them Tom ruled OK on 2026-09-04**, on the exact wording that would be changed —
  `lpn_energy_needs_run`, `lpn_quality_needs_run`, `lpn_quality_initial_tip`,
  `lpn_settings_quality_track_tip`, `lpn_settings_show_arrows_tip`, `lpn_inp_drop_quality_options`.
  A ruling is keyed on the exact English, so each of those rulings would lapse and come back to him
  unread.
- **`lpn_time_duration` ("Total run time") is cited by five other strings**, which each tell the
  reader to *"Set a Total run time under Time"*. It cannot move alone.

This is the same arithmetic that settled the em-dash question: 60 strings x 26 = 1,560
retranslations was judged not worth paying for text whose meaning did not move, and the rule became a
ratchet on NEW writing instead of a sweep.

## The recommendation

**A ratchet, not a sweep.** Every NEW or EDITED visitor-facing string that names the analysis says
*extended period simulation* — spelled out on first use in a given box, and thereafter as much of it
as the space allows. Nothing already shipped and translated is rewritten for the name alone.

Two exceptions worth making anyway, if Tom wants them, and they are cheap because they are the
front door rather than the whole house:

1. **`lpn_time_duration`, "Total run time" → "Total simulation time"** and the five strings that
   quote it. 6 x 26 = 156 retranslations, and it is the single control every one of those sentences
   points at.
2. **`lpn_time_menu_tip` and `lpn_time_run_tip`**, which are the two sentences that TEACH the feature
   and are where a reader first meets the name. 2 x 26 = 52.

That is 208 retranslations for the strings that carry the teaching, against 442 for the sweep, and
it leaves every one of his fresh rulings standing.

**Not decided here. `lpn_energy_over` is changed; everything above waits on Tom.**
