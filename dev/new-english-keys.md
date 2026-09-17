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

**9 still to read**, of 9 untranslated keys, of 1880 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (9, 9 to read @@ NEEDS RULING)

- **`lpn_map_attach_done`**
  > The world map is behind your drawing now, and not one coordinate in the project changed. Use Map, Background map (georeference), Remove to take it away again.
  @@ NEEDS RULING
- **`lpn_map_attach_menu`**
  > Background map (georeference)…
  @@ NEEDS RULING
- **`lpn_map_attach_place`**
  > Attach the world map…
  @@ NEEDS RULING
- **`lpn_map_attach_remove`**
  > Remove
  @@ NEEDS RULING
- **`lpn_map_attach_remove_tip`**
  > Take the world map away. The drawing and its coordinates are untouched either way.
  @@ NEEDS RULING
- **`lpn_map_attach_removed`**
  > The world map is gone, and the drawing is exactly as it was.
  @@ NEEDS RULING
- **`lpn_map_attach_tip`**
  > Attach the world map to this project without changing it any other way.
  @@ NEEDS RULING
- **`lpn_map_attach_turn`**
  > Turn of the drawing in degrees, counterclockwise, where 0 puts the top of the drawing to the north
  @@ NEEDS RULING
- **`lpn_map_attach_where`**
  > Latitude and longitude of the middle of your drawing, in that order, separated by a comma or a space
  @@ NEEDS RULING
