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

**1 still to read on master**, of 1 untranslated keys, of 2158 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (1, 1 to read @@ NEEDS RULING)

- **`lpn_pgraph_none`**
  > This asset has no results in the current run.
  @@ NEEDS RULING

---

# Strings waiting on a branch

**10 still to read**, of 22 new keys across 12 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/fireflow-scope (`8bee6721`) — 4 new, 4 to read @@ NEEDS RULING

- **`lpn_ff_all`**
  > All
  @@ NEEDS RULING
- **`lpn_ff_design_scope`**
  > Pipes and other junctions to check
  @@ NEEDS RULING
- **`lpn_ff_design_scope_tip`**
  > All pipes and other junctions, or only the ones selected on the map.
  @@ NEEDS RULING
- **`lpn_ff_selected`**
  > Selected
  @@ NEEDS RULING

### feat/frequency-plot (`be7f9aa1`) — 9 new, all ruled

- **`lpn_freq_axis_percent`**
  > Percent less than
  _Ruled OK 2026-09-30._
- **`lpn_freq_group_tip`**
  > Whether the graph shows junctions or pipes.
  _Ruled OK 2026-09-30._
- **`lpn_freq_menu`**
  > Frequency
  _Ruled OK 2026-09-30._
- **`lpn_freq_none`**
  > No results for this value yet, so there is nothing to graph.
  _Ruled OK 2026-09-30._
- **`lpn_freq_quantity_tip`**
  > Which value to graph.
  _Ruled OK 2026-09-30._
- **`lpn_freq_summary`**
  > Plotted: {n} of {total}
  _Ruled OK 2026-09-30._
- **`lpn_freq_summary_time`**
  > Plotted: {n} of {total}, at {time}
  _Ruled OK 2026-09-30._
- **`lpn_freq_tip`**
  > Graph the frequency distribution of one property over all junctions or all pipes at the current time step.
  _Ruled OK 2026-09-30._
- **`lpn_freq_title`**
  > Distribution of values
  _Ruled OK 2026-09-30._

### feat/help-menu (`e9ebc9a2`) — 6 new, 6 to read @@ NEEDS RULING

- **`lpn_file_import_menu`**
  > Import…
  @@ NEEDS RULING
- **`lpn_help_hotkeys`**
  > Tables and Hotkeys
  @@ NEEDS RULING
- **`lpn_hotkeys_map_def`**
  > <table class="lpn-notes-table"><tbody><tr><td>1 or Esc</td><td>Select.</td></tr><tr><td>2</td><td>Add a junction.</td></tr><tr><td>3</td><td>Add a reservoir.</td></tr><tr><td>4</td><td>Add a tank.</td></tr><tr><td>5</td><td>Add a pipe.</td></tr><tr><td>6</td><td>Add a pump.</td></tr><tr><td>7</td><td>Add a valve.</td></tr><tr><td>8</td><td>Add a customer.</td></tr><tr><td>9</td><td>Add text.</td></tr><tr><td>Delete</td><td>Delete the selection.</td></tr><tr><td>Ctrl+Z</td><td>Undo the last change.</td></tr><tr><td>+ or =</td><td>Zoom in.</td></tr><tr><td>-</td><td>Zoom out.</td></tr></tbody></table>
  @@ NEEDS RULING
- **`lpn_hotkeys_map_heading`**
  > Map
  @@ NEEDS RULING
- **`lpn_hotkeys_map_term`**
  > Map keyboard shortcuts
  @@ NEEDS RULING
- **`lpn_hotkeys_tables_heading`**
  > Tables
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

### feat/label-placer (`ce387cfe`) — adds no English strings

### feat/label-placer-a (`3483bfd6`) — adds no English strings

### feat/label-placer-b (`c5905432`) — adds no English strings

### feat/label-placer-c (`9a790a3e`) — adds no English strings

### feat/label-placer-d (`129b63c4`) — adds no English strings

### feat/pane-height (`0598413d`) — adds no English strings

### feat/property-graph (`5c1f238a`) — adds no English strings

### feat/table-tab-keys (`08b8e73d`) — adds no English strings
