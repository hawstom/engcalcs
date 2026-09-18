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

**15 still to read**, of 15 untranslated keys, of 1886 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (15, 15 to read @@ NEEDS RULING)

- **`lpn_library_import`**
  > Import libraries…
  @@ NEEDS RULING
- **`lpn_library_import_added`**
  > Copied in: {names}
  @@ NEEDS RULING
- **`lpn_library_import_choose`**
  > Choose what to copy from {file}
  @@ NEEDS RULING
- **`lpn_library_import_conflict`**
  > Skipped, because this project already has one of the same name: {names}. Nothing here was changed. Rename either one and import again if you want both.
  @@ NEEDS RULING
- **`lpn_library_import_count`**
  > {name} ({count})
  @@ NEEDS RULING
- **`lpn_library_import_curve_shape`**
  > These curves came across exactly as the file wrote them, and a run cannot use one until its first column rises from each point to the next: {names}
  @@ NEEDS RULING
- **`lpn_library_import_go`**
  > Import
  @@ NEEDS RULING
- **`lpn_library_import_heading`**
  > Imported from {file}
  @@ NEEDS RULING
- **`lpn_library_import_needs_fittings`**
  > These pipe types refer to a fittings list this project does not have: {names}. Import the fittings library from the same file and they will find it.
  @@ NEEDS RULING
- **`lpn_library_import_no_libraries`**
  > That project file has no libraries to copy.
  @@ NEEDS RULING
- **`lpn_library_import_none`**
  > That project file has none of these to copy.
  @@ NEEDS RULING
- **`lpn_library_import_note`**
  > Each library you check is copied in whole. Anything whose name is already taken here is skipped and listed. Delete what you do not want afterwards, the way you delete any other row.
  @@ NEEDS RULING
- **`lpn_library_import_tip`**
  > Choose another project file and copy whole libraries out of it into this project. Anything whose name is already taken here is skipped and listed, so nothing you already have is changed.
  @@ NEEDS RULING
- **`lpn_library_import_units`**
  > The file does not show its numbers in the units this project shows. Nothing is converted. Every number is copied exactly as the file wrote it, so it will mean the unit this project shows.
  @@ NEEDS RULING
- **`lpn_library_import_units_line`**
  > {name}: this project shows {mine}, the file shows {theirs}.
  @@ NEEDS RULING
