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

**1 still to read on master**, of 4 untranslated keys, of 2157 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (4, 1 to read @@ NEEDS RULING)

- **`lpn_pgraph_head_gain`**
  > Head gain
  _Ruled OK 2026-10-01._
- **`lpn_pgraph_head_gain_tip`**
  > The head the pump adds from suction to discharge, shown as a positive number. The solver and EPANET files carry it as a negative head loss.
  @@ NEEDS RULING
- **`lpn_pgraph_none`**
  > This asset has no results in the current run.
  _Ruled OK 2026-10-01._
- **`lpn_pgraph_source_share_from`**
  > Source share from {node}
  _Ruled OK 2026-10-01._

---

# Strings waiting on a branch

**19 still to read**, of 80 new keys across 12 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/bentley-interop (`5b8f7cee`) — 13 new, 1 to read @@ NEEDS RULING

- **`lpn_alt_cat_constituent`**
  > Constituent
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_demand`**
  > Demand
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_energy`**
  > Energy cost
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_fireflow`**
  > Fire flow
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_initial`**
  > Initial settings
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_physical`**
  > Physical
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_text`**
  > Text
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_topology`**
  > Asset activation
  _Ruled OK 2026-10-01._
- **`lpn_alt_cat_userdata`**
  > Custom properties
  _Ruled OK 2026-10-01._
- **`lpn_alt_note`**
  > Read only. Base uses the Base alternative of every category. Each scenario gets its own alternative for any category that is changed, a child of the Base one. The number is how many changed values it has.
  _Ruled OK 2026-10-01._
- **`lpn_alt_title`**
  > Alternatives preview
  @@ NEEDS RULING
- **`lpn_scenario_basic`**
  > Basic mode
  _Ruled OK 2026-10-01._
- **`lpn_scenario_basic_tip`**
  > Checked, a scenario is simply the values you set in it. Unchecked, this menu also offers the Alternatives preview table, which shows how those values are grouped by category and invites your feedback.
  _Ruled OK 2026-10-01._

### feat/criticality (`bfb5bdbf`) — 31 new, 8 to read @@ NEEDS RULING

- **`lpn_analyze_menu`**
  > Analyze
  @@ NEEDS RULING
- **`lpn_analyze_menu_tip`**
  > Analyses that run the network many times over on a copy: fire flow at each junction, and the loss of each pipe, pump, and valve.
  @@ NEEDS RULING
- **`lpn_crit_baseline_below`**
  > Junctions already below it with nothing broken: {n}. They are not counted.
  _Ruled OK 2026-10-01._
- **`lpn_crit_busy`**
  > Another analysis is running. Stop it, or wait for it to finish.
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_asset`**
  > Asset
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_below`**
  > Junctions below minimum
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_cutoff`**
  > Junctions cut off
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_unserved`**
  > Demand not served
  _Ruled OK 2026-10-01._
- **`lpn_crit_intro`**
  > Each asset is taken out of the network in turn, and the network is solved at the time step on screen in the active scenario. Nothing in your project is changed; the whole run is made on a copy.
  _Ruled OK 2026-10-01._
- **`lpn_crit_menu`**
  > Criticality analysis…
  _Ruled OK 2026-10-01._
- **`lpn_crit_menu_tip`**
  > Take each pipe, pump, and valve out of the network in turn and see what the system loses.
  _Ruled OK 2026-10-01._
- **`lpn_crit_minpressure`**
  > Lowest pressure allowed
  _Ruled OK 2026-10-01._
- **`lpn_crit_minpressure_tip`**
  > This is the same number as Lowest pressure allowed elsewhere in Fire flow analysis. Changing it here changes it there.
  _Ruled OK 2026-10-01._
- **`lpn_crit_no_links`**
  > This project has no links yet, so there is nothing to break.
  _Ruled OK 2026-10-01._
- **`lpn_crit_no_selection`**
  > No pipe, pump, or valve is selected. Choose one on the map, or break every link.
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope`**
  > Links to break
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope_all`**
  > Every link
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope_selected`**
  > The selected links
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope_tip`**
  > Every pipe, pump, and valve, or only the ones selected on the map. Choose the set before you run.
  _Ruled OK 2026-10-01._
- **`lpn_crit_skipdead`**
  > Skip dead ends
  @@ NEEDS RULING
- **`lpn_crit_skipdead_tip`**
  > A dead-end link is one whose removal cuts off junctions that can be reached only through it, with no reservoir or tank beyond. Its loss is everything beyond it, so it is not solved. The summary says how many were skipped.
  @@ NEEDS RULING
- **`lpn_crit_skipped`**
  > {n} selected elements are not links, so they were not broken.
  _Ruled OK 2026-10-01._
- **`lpn_crit_skipped_dead`**
  > Dead-end links skipped: {n}. Each one cuts off everything beyond it.
  @@ NEEDS RULING
- **`lpn_crit_stale`**
  > The drawing changed, so the criticality results were cleared. Run it again.
  _Ruled OK 2026-10-01._
- **`lpn_crit_stopped`**
  > Stopped after {done} of {total} assets. The results below are the ones already finished.
  _Ruled OK 2026-10-01._
- **`lpn_crit_summary`**
  > {n} of {total} assets leave demand unserved or drop a junction below {pressure}.
  _Ruled OK 2026-10-01._
- **`lpn_crit_title`**
  > Criticality analysis
  _Ruled OK 2026-10-01._
- **`lpn_crit_working`**
  > Working: {done} of {total} assets.
  _Ruled OK 2026-10-01._
- **`lpn_ff_design_all`**
  > All
  @@ NEEDS RULING
- **`lpn_ff_design_off`**
  > None
  @@ NEEDS RULING
- **`lpn_ff_design_selected`**
  > Selected
  @@ NEEDS RULING

### feat/demand-scaling (`bfb5bdbf`) — 31 new, 8 to read @@ NEEDS RULING

- **`lpn_analyze_menu`**
  > Analyze
  @@ NEEDS RULING
- **`lpn_analyze_menu_tip`**
  > Analyses that run the network many times over on a copy: fire flow at each junction, and the loss of each pipe, pump, and valve.
  @@ NEEDS RULING
- **`lpn_crit_baseline_below`**
  > Junctions already below it with nothing broken: {n}. They are not counted.
  _Ruled OK 2026-10-01._
- **`lpn_crit_busy`**
  > Another analysis is running. Stop it, or wait for it to finish.
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_asset`**
  > Asset
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_below`**
  > Junctions below minimum
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_cutoff`**
  > Junctions cut off
  _Ruled OK 2026-10-01._
- **`lpn_crit_col_unserved`**
  > Demand not served
  _Ruled OK 2026-10-01._
- **`lpn_crit_intro`**
  > Each asset is taken out of the network in turn, and the network is solved at the time step on screen in the active scenario. Nothing in your project is changed; the whole run is made on a copy.
  _Ruled OK 2026-10-01._
- **`lpn_crit_menu`**
  > Criticality analysis…
  _Ruled OK 2026-10-01._
- **`lpn_crit_menu_tip`**
  > Take each pipe, pump, and valve out of the network in turn and see what the system loses.
  _Ruled OK 2026-10-01._
- **`lpn_crit_minpressure`**
  > Lowest pressure allowed
  _Ruled OK 2026-10-01._
- **`lpn_crit_minpressure_tip`**
  > This is the same number as Lowest pressure allowed elsewhere in Fire flow analysis. Changing it here changes it there.
  _Ruled OK 2026-10-01._
- **`lpn_crit_no_links`**
  > This project has no links yet, so there is nothing to break.
  _Ruled OK 2026-10-01._
- **`lpn_crit_no_selection`**
  > No pipe, pump, or valve is selected. Choose one on the map, or break every link.
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope`**
  > Links to break
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope_all`**
  > Every link
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope_selected`**
  > The selected links
  _Ruled OK 2026-10-01._
- **`lpn_crit_scope_tip`**
  > Every pipe, pump, and valve, or only the ones selected on the map. Choose the set before you run.
  _Ruled OK 2026-10-01._
- **`lpn_crit_skipdead`**
  > Skip dead ends
  @@ NEEDS RULING
- **`lpn_crit_skipdead_tip`**
  > A dead-end link is one whose removal cuts off junctions that can be reached only through it, with no reservoir or tank beyond. Its loss is everything beyond it, so it is not solved. The summary says how many were skipped.
  @@ NEEDS RULING
- **`lpn_crit_skipped`**
  > {n} selected elements are not links, so they were not broken.
  _Ruled OK 2026-10-01._
- **`lpn_crit_skipped_dead`**
  > Dead-end links skipped: {n}. Each one cuts off everything beyond it.
  @@ NEEDS RULING
- **`lpn_crit_stale`**
  > The drawing changed, so the criticality results were cleared. Run it again.
  _Ruled OK 2026-10-01._
- **`lpn_crit_stopped`**
  > Stopped after {done} of {total} assets. The results below are the ones already finished.
  _Ruled OK 2026-10-01._
- **`lpn_crit_summary`**
  > {n} of {total} assets leave demand unserved or drop a junction below {pressure}.
  _Ruled OK 2026-10-01._
- **`lpn_crit_title`**
  > Criticality analysis
  _Ruled OK 2026-10-01._
- **`lpn_crit_working`**
  > Working: {done} of {total} assets.
  _Ruled OK 2026-10-01._
- **`lpn_ff_design_all`**
  > All
  @@ NEEDS RULING
- **`lpn_ff_design_off`**
  > None
  @@ NEEDS RULING
- **`lpn_ff_design_selected`**
  > Selected
  @@ NEEDS RULING

### feat/desktop (`c45d847e`) — adds no English strings

### feat/graph-menu (`0a8db639`) — 2 new, 2 to read @@ NEEDS RULING

- **`lpn_graphs_menu`**
  > Graphs
  @@ NEEDS RULING
- **`lpn_graphs_menu_tip`**
  > Graphs of the network: the profile along a route, a property against time, and the distribution of a property.
  @@ NEEDS RULING

### feat/label-gang-search (`8b31a907`) — 3 new, all ruled

- **`lpn_confirm_labels_restore`**
  > Set the label columns back to their original values? This resets which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._
- **`lpn_labels_restore`**
  > Restore label defaults
  _Ruled OK 2026-09-23._
- **`lpn_labels_restore_tip`**
  > Sets the label columns back to their original values: which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._

### feat/label-placer (`4c2d1634`) — adds no English strings

### feat/label-placer-a (`3483bfd6`) — adds no English strings

### feat/label-placer-b (`c5905432`) — adds no English strings

### feat/label-placer-c (`9a790a3e`) — adds no English strings

### feat/label-placer-d (`129b63c4`) — adds no English strings

### feat/property-graph (`ac73a7b9`) — adds no English strings
