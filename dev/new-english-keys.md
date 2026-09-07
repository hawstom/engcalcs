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

**13 still to read**, of 22 untranslated keys, of 1710 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (22, 13 to read @@ NEEDS RULING)

- **`lpn_field_pipetype`**
  > Pipe type
  @@ NEEDS RULING
- **`lpn_field_pipetype_tip`**
  > The pipe type in the project library that this pipe uses. Every property the type states is read from the type, so its box here cannot be edited. Detach to give this one pipe its own values.
  @@ NEEDS RULING
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
  @@ NEEDS RULING
- **`lpn_library_pipetype_blank_tip`**
  > Leave a box empty and this type does not state that property. A pipe using this type then keeps its own value for it.
  @@ NEEDS RULING
- **`lpn_library_pipetype_in_use`**
  > This pipe type is used by {count} pipes: {ids}. Point those pipes at another type, or detach them, before deleting this one.
  @@ NEEDS RULING
- **`lpn_library_pipetype_unused`**
  > Nothing uses this pipe type.
  @@ NEEDS RULING
- **`lpn_library_pipetype_used_by`**
  > Pipes using this type
  @@ NEEDS RULING
- **`lpn_library_pipetypes`**
  > Pipe types
  @@ NEEDS RULING
- **`lpn_library_pipetypes_note`**
  > A pipe type belongs to a project, and a pipe indicates the one it uses in its own properties. A definition states only the properties you fill in, so a type that states a roughness and no diameter is a normal one to make. Editing a definition here changes every pipe that uses it.
  @@ NEEDS RULING
- **`lpn_library_pipetypes_tip`**
  > A pipe type is a definition several pipes can refer to for their diameter, roughness and reaction coefficients, so that editing the definition edits every pipe that uses it.
  @@ NEEDS RULING
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
  @@ NEEDS RULING
- **`lpn_pipetype_detach_tip`**
  > Copies the values this pipe reads from its type into the pipe itself and stops using the type. Nothing about the pipe changes now; from then on you can edit these values here.
  @@ NEEDS RULING
- **`lpn_pipetype_none`**
  > No pipe type selected
  @@ NEEDS RULING
- **`lpn_tool_key_hint`**
  > Shortcut: press {key}.
  _Ruled OK 2026-09-07._
