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

**0 still to read**, of 0 untranslated keys, of 1871 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (4 to read @@ NEEDS RULING)

**These are SHIPPED strings, already translated into 26 languages.** A wave-0
reading or a translator found each one readable two ways, and no sprint launches while one is
unanswered. You are not being asked to approve wording here; you are being asked which reading
is the one you meant. "The first one" is a complete answer.

### from sprint 667-lpn-delta

- **`lpn_cp_flag`**
  > {label}: {reason} The value is kept exactly as you typed it.
  *The finding:* Composes as '{label}: {reason} The value is kept exactly as you typed it.' and every {reason} already ends in a full stop, so the two sentences run together with a single space and no break in some scripts.
  1. one sentence
  2. two sentences
  **What this asks for:** which of the readings above you meant.
  *The proposal:* NOT FIXED. It reads correctly in English and in most scripts; the report is about sentence separation in Khmer, where the full stop is not the sentence boundary marker. A rewrite of the composition is an English change and Tom has not ruled on it.
  The capital T makes a sentence start obvious to all translators. No ruling is needed.
- **`lpn_field_northing`**
  > Northing
  *The finding:* Northing/Easting and their one-letter abbreviations have no stable convention across languages, and the abbreviation keys assume the first letter of the word works. Answers ranged over Latin N/E, Turkish K/D, Ukrainian Pn/Sh, German Hochwert/Rechtswert (H/R) and Hebrew tsadi/mem. ARABIC CANNOT ABBREVIATE AT ALL: shamal and sharq both begin with the same letter, so a one-character abbreviation is ambiguous in a status bar that shows both at once.
  1. the compass direction
  2. the coordinate axis of a projected grid
  **What this asks for:** which of the readings above you meant.
  *The proposal:* SHIPPED AS TRANSLATED, no English change. The abbreviation keys are separate (lpn_field_northing_abbr / _easting_abbr) so a language that cannot abbreviate can carry the full word there, which is what ar did. Recorded because the next person to add a coordinate readout will assume first-letter abbreviation works and it does not.
  The abbreviation keys assume nothing. _syn Can say "Northing" and the abbreviation tag or glossary can say "Abbreviation of Northing". Use your judgement.
- **`lpn_field_tag`**
  > Tag
  *The finding:* FOUR LANGUAGES GIVE Tag AND THIS PAGE'S OWN Label THE IDENTICAL WORD: es Etiqueta, it Etichetta, sw Lebo, tr Etiket. lpn_field_tag and lpn_cp_label then stand in the same Properties box under one name. The synonym on lpn_field_tag says in as many words that it is not this page's Label object, so the guard was written and did not reach the outcome. Two of the four are anchor languages. Found by comparing the shipped values across all 26 files, which no single agent can do.
  1. EPANET's [TAGS] token, a grouping word the user chooses
  2. the caption shown on a custom property
  **What this asks for:** which of the readings above you meant.
  *The proposal:* NOT FIXED -- choosing a second word in four languages is lexical judgement I cannot verify, and inventing one is the failure mode this project distrusts. The four values are DELIBERATELY ABSENT from the glossary's 'tag (EPANET)' term, so absent reads as unconfirmed rather than untranslated and the next sprint is asked the question rather than handed an answer. Cosmetic: no number is wrong.
  The truth is that "Tag" is just whatever ID-like synonym was available. The exact translation is not important because Tag has no real meaning. Maybe _syn could help ("Tag, Custom property, User property, Label, Custom label")
- **`lpn_file_import_geo`**
  > Open to new coordinates…
  *The finding:* The shipped translations say "Open xy file on map" while the current English is "Open to new coordinates...". Independently hit by zh, de and ur in the same sprint, each reporting that the string in front of them did not describe the control. The English moved and the 26 translations did not.
  1. open an existing xy file onto a map (what the translations say)
  2. open this project again under a different coordinate system (what the English says)
  **What this asks for:** which of the readings above you meant.
  *The proposal:* NOT FIXED in this sprint -- it is stale TRANSLATION rather than ambiguous English, so it belongs in a resync set, not here. Filed so the next sprint picks it up: detect_english_drift.php should now see it, the English having been rebaselined at the close of this sprint.
  The answer is 2 almost. The answer is "Open this project to a new file under a different coordinate system" (that is what the English says). Code has changed. Behavior has changed with the introduction of projections. Maybe _syn is needed: "Make a copy of a project file under a different coordinate system..." Should `en` be "Convert coordinates as..."?

None. Every English key is present in at least one other language.
