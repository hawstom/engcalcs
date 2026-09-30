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

**2 still to read on master**, of 2 untranslated keys, of 2159 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (2, 2 to read @@ NEEDS RULING)

- **`lpn_pgraph_none`**
  > This asset has no results in the current run.
  @@ NEEDS RULING
- **`lpn_pgraph_source_share_from`**
  > Source share from {node}
  @@ NEEDS RULING

---

# Strings waiting on a branch

**16 still to read**, of 19 new keys across 13 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### feat/bentley-interop (`be4dbfb8`) — adds no English strings

### feat/copy-lock (`5ed3e3b6`) — 7 new, 7 to read @@ NEEDS RULING

- **`lpn_copy_body`**
  > This file was originally created on {date}, but this browser doesn't remember it. Is this the Original file (keep same lock) or a Copy (make new lock)?
  @@ NEEDS RULING
- **`lpn_copy_body_nodate`**
  > This browser doesn't remember this file. Is this the Original file (keep same lock) or a Copy (make new lock)?
  @@ NEEDS RULING
- **`lpn_copy_copy`**
  > A copy; make new lock
  @@ NEEDS RULING
- **`lpn_copy_opened`**
  > Opened {file} as a copy, with a new lock of its own. The file itself changes only when you save.
  @@ NEEDS RULING
- **`lpn_copy_original`**
  > Original; keep same lock
  @@ NEEDS RULING
- **`lpn_copy_title`**
  > Mark file as new copy?
  @@ NEEDS RULING
- **`lpn_copy_why`**
  > Another browser has a file with this same lock open right now. A file copied outside this page keeps its original's lock.
  @@ NEEDS RULING

### feat/find-filter (`92b573b5`) — 1 new, 1 to read @@ NEEDS RULING

- **`lpn_pane_filter_stale`**
  > Rows that no longer match: {n}.
  @@ NEEDS RULING

### feat/fireflow-scope (`86f4e2b2`) — 2 new, 2 to read @@ NEEDS RULING

- **`lpn_ff_all`**
  > All
  @@ NEEDS RULING
- **`lpn_ff_selected`**
  > Selected
  @@ NEEDS RULING

### feat/help-menu (`d34b00e6`) — 6 new, 6 to read @@ NEEDS RULING

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

### feat/property-graph (`b9e8f9ef`) — adds no English strings

### fix/scenario-sort (`ad494b66`) — adds no English strings
