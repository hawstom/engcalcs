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

**2 still to read**, of 25 untranslated keys, of 1713 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (25, 2 to read @@ NEEDS RULING)

- **`lpn_engine_needed_failed`**
  > The EPANET solver could not be loaded, and this network can only be solved by it. Connect to the internet once and it is kept on this device from then on.
  @@ NEEDS RULING
- **`lpn_engine_needed_loading`**
  > Loading EPANET solver while you build. Results will be available when completely loaded.
  _Ruled 2026-09-06: Tom's own sentence, written by him in the instruction that commissioned the feature: "we show a banner 'Loading EPANET solver while you build. Results will be available when completely loaded.' while it fetches". Recorded because the words are his, not because anybody approved ours._
- **`lpn_field_pipetype`**
  > Pipe type
  _Ruled OK 2026-09-07._
- **`lpn_field_pipetype_tip`**
  > The pipe type in the project library that this pipe uses. Properties included in the pipe type are disabled for editing here. Detach the pipe type to enable editing here.
  _Ruled OK 2026-09-07._
- **`lpn_find_filter_btn`**
  > Filter in current table
  _Ruled OK 2026-09-07._
- **`lpn_find_filter_table`**
  > Table to filter
  _Ruled OK 2026-09-07._
- **`lpn_find_filter_tip`**
  > Show only the parts that match this query in one of the tables below the map. The drawing is not changed and nothing is deleted.
  _Ruled OK 2026-09-07._
- **`lpn_help_not_epanet`**
  > Not EPANET
  _Ruled OK 2026-09-07._
- **`lpn_help_screenshots`**
  > Screenshot gallery
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetype_add`**
  > Add a pipe type
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetype_blank_tip`**
  > Blank properties in a pipe type definition are left to be entered individually for each pipe.
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetype_in_use`**
  > This pipe type is used by {count} pipes: {ids}. Detach it from them before deleting it.
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetype_unused`**
  > Nothing uses this pipe type.
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetype_used_by`**
  > Pipes using this type
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetypes`**
  > Pipe types
  _Ruled OK 2026-09-07._
- **`lpn_library_pipetypes_note`**
  > Each project has its own pipe type library. You may leave properties blank in a pipe type definition. For example, a pipe type that specifies a roughness and no diameter is okay. You attach pipe types to pipes in their properties editor. Editing a definition here changes every pipe that references it.
  _Ruled 2026-09-07: Please note the drastically different style here than what you have been using._
- **`lpn_library_pipetypes_tip`**
  > A pipe type is a definition several pipes can refer to for their diameter, roughness and reaction coefficients. Editing the definition edits every pipe that uses it.
  _Ruled OK 2026-09-07._
- **`lpn_pane_filter_clear`**
  > Show all
  _Ruled OK 2026-09-07._
- **`lpn_pane_filter_none`**
  > Nothing in this table matches the filter.
  _Ruled OK 2026-09-07._
- **`lpn_pane_filter_note`**
  > Filtered by {q}. Showing {n} of {all}.
  _Ruled OK 2026-09-07._
- **`lpn_pipetype_detach`**
  > Detach from pipe type
  _Ruled OK 2026-09-07._
- **`lpn_pipetype_detach_tip`**
  > Copies the values this pipe reads from its type into the pipe itself and stops using the type. Nothing about the pipe changes now; from then on you can edit these values here.
  _Ruled OK 2026-09-07._
- **`lpn_pipetype_none`**
  > No pipe type selected
  _Ruled OK 2026-09-07._
- **`lpn_settings_engine_native_off`**
  > This network can only be solved by the EPANET solver, so the built-in solver is not offered for it. Your own choice is not changed, and this box works again as soon as the network no longer needs the EPANET solver.
  @@ NEEDS RULING
- **`lpn_tool_key_hint`**
  > Shortcut: press {key}.
  _Ruled OK 2026-09-07._
