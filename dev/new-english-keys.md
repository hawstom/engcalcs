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

**0 still to read**, of 6 untranslated keys, of 1775 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (3 to read @@ NEEDS RULING)

**These are SHIPPED strings, already translated into 26 languages.** A wave-0
reading or a translator found each one readable two ways, and no sprint launches while one is
unanswered. You are not being asked to approve wording here; you are being asked which reading
is the one you meant. "The first one" is a complete answer.

### from sprint 2026-09-08-delta

- **`lpn_fitting_entrance`**
  > Square entrance
  *The finding:* 'Square entrance' is ambiguous between a squared/sharp-edged pipe entrance (the hydraulic sense, contrasted with a rounded or bell-mouth entrance) and an entrance that is square in SHAPE. Chose the geometric-square reading.
  1. a sharp-edged entrance -- the hydraulic sense, EPANET Table 3.3's meaning
  2. an entrance whose cross-section is a square -- a statement about geometry
  **What this asks for:** which of the readings above you meant.
  *The proposal:* MEASURED ACROSS ALL 24 LANGUAGES THAT HAVE IT, AND THE MAJORITY READ IT WRONG. 13 of 24 rendered it as a SHAPE (ar, bg, bn, es, fa, he, hi, id, my, ps, sw, ur, zh -- 'square', 'square-shaped'); 11 rendered it as an EDGE (cs, de, fr, hr, it, pt, ro, ru, sr, tr, uk -- 'sharp-edged', 'sharp-angled', 'live arris'). Only one reading is what EPANET Table 3.3 means: a square-EDGED entrance, the one wh...
  @@ NEEDS RULING
- **`lpn_reaction_limiting`**
  > Limiting concentration
  *The finding:* EPANET's own keyword is LIMITING POTENTIAL, a specific water-quality term (a concentration ceiling the reaction asymptotically approaches). Translated as 'Predelnaya kontsentratsiya' (limiting concentration) rather than a literal 'Predelnyy potentsial' because the tip describes it purely as a concentration and 'potentsial' alone reads as vague to a Russian engineer. The cost is keyword traceability: a reader cross-referencing an .inp file by keyword may not map the phrase back to LIMITING POTENTIAL.
  1. Limiting concentration -- clear meaning, weaker keyword traceability
  2. Limiting potential -- literal keyword match, less clear standing alone
  **What this asks for:** which of the readings above you meant.
  *The proposal:* TWO TRANSLATORS REACHED THE SAME PLACE INDEPENDENTLY, WHICH IS EVIDENCE ABOUT THE ENGLISH RATHER THAN ABOUT EITHER LANGUAGE. Hindi rendered it 'limiting concentration' too, on the same reasoning and without seeing the Russian finding. EPANET's manual does call the parameter a limiting CONCENTRATION in its own prose while the .inp keyword is LIMITING POTENTIAL, so the English here is EPANET's in...
  @@ NEEDS RULING
- **`lpn_reaction_rough_corr`**
  > Roughness correlation
  *The finding:* 'Roughness correlation' -- 'correlation' here means a FUNCTIONAL relationship (wall reaction computed FROM roughness), not a statistical correlation. No settled Pashto term distinguishes the two senses; chose a general 'relationship' word.
  1. a functional relationship
  2. a statistical correlation, which would mislead
  **What this asks for:** which of the readings above you meant.
  *The proposal:* THIS IS AN ENGLISH AMBIGUITY, NOT ONLY A PASHTO ONE, and it is the same shape as lpn_fitting_entrance in this same sprint: an English word with a precise technical sense in one field (statistics) being used in its looser sense in another. EPANET computes a wall reaction coefficient AS A FUNCTION OF pipe roughness; nothing is correlated in the statistical sense. A reader who knows statistics is ...
  @@ NEEDS RULING

## lpn_  (6, all ruled)

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
- **`lpn_pane_text_attached`**
  > Attached
  _Ruled OK 2026-09-09._
- **`lpn_popup_boxtitle`**
  > Properties
  _Ruled OK 2026-09-09._
