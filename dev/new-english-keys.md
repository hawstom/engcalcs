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

**0 still to read on master**, of 16 untranslated keys, of 2157 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (16, all ruled)

- **`lpn_ff_design_no_selection`**
  > The design check is set to the selected junctions, and none is selected. Select some on the map, or set All.
  _Ruled OK 2026-09-29._
- **`lpn_ff_design_selected`**
  > The selected junctions and their pipes
  _Ruled OK 2026-09-29._
- **`lpn_field_lat_abbr`**
  > Lat
  _Ruled 2026-09-28: Tom, 2026-09-28: "Vertices column heading: Change to 'Vertices (Lat/Lon|Lat/Lon|...)'"_
- **`lpn_field_lon_abbr`**
  > Lon
  _Ruled 2026-09-28: Tom, 2026-09-28: "Vertices column heading: Change to 'Vertices (Lat/Lon|Lat/Lon|...)'"_
- **`lpn_field_text_anchor`**
  > Attached to
  _Ruled OK 2026-09-29._
- **`lpn_find_shift_hint`**
  > Shift+click to add/remove toggle.
  _Ruled OK 2026-09-29._
- **`lpn_goto_on_map`**
  > Go to on map
  _Ruled OK 2026-09-29._
- **`lpn_pane_paste_customer_no_position`**
  > Row {row}: a new Customer needs both {first} and {second}.
  _Ruled OK 2026-09-29._
- **`lpn_pane_paste_customer_node_no_pipe`**
  > Row {row}: node {id} has no pipe for a Customer to attach to.
  _Ruled OK 2026-09-29._
- **`lpn_pane_paste_no_anchor`**
  > Row {row}: {id} is not a node or a pipe in this network yet. Paste it first, then this Text.
  _Ruled OK 2026-09-29._
- **`lpn_pane_paste_no_customer_node`**
  > Row {row}: node {id} does not exist yet. Paste your junctions first, then your customers.
  _Ruled OK 2026-09-29._
- **`lpn_pane_paste_no_customer_ref`**
  > Row {row}: a new Customer needs a connected pipe or node.
  _Ruled OK 2026-09-29._
- **`lpn_pane_paste_no_pipe`**
  > Row {row}: pipe {id} does not exist yet. Paste your pipes first, then your customers.
  _Ruled OK 2026-09-29._
- **`lpn_pane_paste_text_no_position`**
  > Row {row}: a new Text needs both {first} and {second}.
  _Ruled OK 2026-09-29._
- **`lpn_pane_select_on_map`**
  > Select on map
  _Ruled OK 2026-09-29._
- **`lpn_pane_unselect_on_map`**
  > Unselect on map
  _Ruled OK 2026-09-29._

---

# Strings waiting on a branch

**0 still to read**, of 3 new keys across 6 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

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

### feat/label-placer (`a74b3558`) — adds no English strings

### feat/label-placer-a (`3483bfd6`) — adds no English strings

### feat/label-placer-b (`c5905432`) — adds no English strings

### feat/label-placer-c (`9a790a3e`) — adds no English strings

### feat/label-placer-d (`129b63c4`) — adds no English strings
