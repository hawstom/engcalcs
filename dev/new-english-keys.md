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

**7 still to read**, of 14 untranslated keys, of 1782 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (14, 7 to read @@ NEEDS RULING)

- **`lpn_about_credits`**
  > Credits
  @@ NEEDS RULING
- **`lpn_about_license`**
  > Licensed under the GNU General Public License v3.0 or later.
  @@ NEEDS RULING
- **`lpn_field_emitter`**
  > Emitter coefficient
  _Ruled OK 2026-09-09._
- **`lpn_field_emitter_tip`**
  > An extra outflow that depends on pressure, for a sprinkler, an open outlet, or a modeled leak. The flow it releases is this coefficient times the pressure raised to the emitter exponent, which is set once for the whole network under Settings, Calculation, Hydraulics. Leave it blank on an ordinary junction.
  _Ruled OK 2026-09-09._
- **`lpn_field_text_attached_tip`**
  > This text was placed close enough to an asset to follow it, so it moves with that asset and has a leader. A text on a leader takes its horizontal and vertical alignment from the side it sits on, which is why those two rows are not offered while it is attached.
  _Ruled OK 2026-09-09._
- **`lpn_georef_save_locked`**
  > Finish the placement with the "Keep this placement" button, or press Cancel, before you save. The project is still being placed, so what is on the screen is not yet what would be written to the file.
  _Ruled OK 2026-09-09._
- **`lpn_help_welcome`**
  > Welcome page
  @@ NEEDS RULING
- **`lpn_map_unmeasurable`**
  > This page could not work out the size of the drawing area, so the map is showing the last view it was able to compute. Resizing the window makes it try again. If it keeps happening, a browser extension that blocks page measurements is the usual cause.
  _Ruled OK 2026-09-10._
- **`lpn_menu_cue`**
  > Start with the menus above. Use the toolbar for quick access.
  @@ NEEDS RULING
- **`lpn_pane_text_attached`**
  > Attached
  _Ruled OK 2026-09-09._
- **`lpn_popup_boxtitle`**
  > Properties
  _Ruled OK 2026-09-09._
- **`lpn_settings_runbox`**
  > Show the run progress box
  @@ NEEDS RULING
- **`lpn_settings_runbox_tip`**
  > A box that reports how far a run has got and what it found. With it turned off, a finished run says the same thing in the status line for a few seconds instead. This is a setting for this browser, not for the project.
  @@ NEEDS RULING
- **`lpn_time_runbox_hide`**
  > Do not show this box again
  @@ NEEDS RULING
