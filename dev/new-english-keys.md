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

- **`lpn_library_import`**
  > Import from a project file
  @@ NEEDS RULING
- **`lpn_library_import_added`**
  > Copied in: {names}
  @@ NEEDS RULING
- **`lpn_library_import_conflict`**
  > Skipped, because this project already has one of the same name: {names}. Nothing here was changed. Rename either one and import again if you want both.
  @@ NEEDS RULING
- **`lpn_library_import_curve_shape`**
  > These curves came across exactly as the file wrote them, and a run cannot use one until its first column rises from each point to the next: {names}
  @@ NEEDS RULING
- **`lpn_library_import_heading`**
  > Imported from {file}
  @@ NEEDS RULING
- **`lpn_library_import_needs_fittings`**
  > These pipe types refer to a fittings list this project does not have: {names}. Import the fittings library from the same file and they will find it.
  @@ NEEDS RULING
- **`lpn_library_import_none`**
  > That project file has none of these to copy.
  @@ NEEDS RULING
- **`lpn_library_import_tip`**
  > Choose another project file and copy what its library holds into this project. Anything whose name is already taken here is skipped and listed, so nothing you already have is changed.
  @@ NEEDS RULING
- **`lpn_library_import_units`**
  > The file you chose does not show its numbers in the same units as this project. Every number came across exactly as the file wrote it, so each one now means the unit this project is showing. Check them.
  @@ NEEDS RULING
