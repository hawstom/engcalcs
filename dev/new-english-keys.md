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

## Questions from the translators  (2 to read @@ NEEDS RULING)

**These are SHIPPED strings, already translated into 26 languages.** A wave-0
reading or a translator found each one readable two ways, and no sprint launches while one is
unanswered. You are not being asked to approve wording here; you are being asked which reading
is the one you meant. "The first one" is a complete answer.

### from sprint 2026-09-28-delta

- **`lpn_lock_requested`**
  > {name} would like to edit this file. When you are ready, save your work and use File, Close to hand it over.
  *The finding:* The prose names 'File, Close project', but the menu row (lpn_file_close) says 'Close'. Translators used the real label.
  1. File, Close (the real menu row)
  2. a 'Close project' control that does not exist
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* Proposed English: '...save your work and use File, Close to hand it over.' Waits for Tom's ruling.
  @@ NEEDS RULING
- **`lpn_mapgeo_dial_help`**
  > Slide the two bars, or type in the boxes above them, to make the map bigger or smaller and to rotate it. The middle of each bar keeps the fit from step 1, so 1 and 0 mean no change. Arrow keys work on both.
  *The finding:* 'The middle of each bar is the fit step 1 left' does not parse; five translators guessed at it independently.
  1. the middle of each bar is where step 1 (Place approximately) left the size and rotation, so 1 and 0 mean no change
  2. a garbled fragment with some other meaning
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* Proposed English: 'The middle of each bar keeps the fit from step 1, so 1 and 0 mean no change.' Waits for Tom's ruling; the five translations follow the first reading.
  @@ NEEDS RULING

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
