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

**5 still to read**, of 5 untranslated keys, of 1876 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (5, 5 to read @@ NEEDS RULING)

- **`lpn_coord_off_world`**
  > That is off the map. A latitude runs from -85.05 to 85.05 and a longitude from -180 to 180.
  @@ NEEDS RULING
- **`lpn_field_coord_tip`**
  > Type a coordinate to place this node exactly. In a scenario this places the node in that scenario alone, just as dragging it does; in Base it places the node everywhere.
  @@ NEEDS RULING
- **`lpn_field_desc`**
  > Description
  @@ NEEDS RULING
- **`lpn_field_desc_tip`**
  > A line of your own words about this part, such as a street corner or what a pipe is made of. It is carried into and out of the EPANET file, where it sits at the end of the part's own row. No calculation reads it. A line break becomes a space, because the file has nowhere to put one.
  @@ NEEDS RULING
- **`lpn_inp_export_flat_coords`**
  > An EPANET file holds one position for each node. This scenario places {n} of them somewhere else, and those are the positions in the file. Every other scenario keeps its own positions in your project file alone.
  @@ NEEDS RULING
