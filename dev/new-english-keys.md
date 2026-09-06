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

**0 still to read**, of 0 untranslated keys, of 1688 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (1 to read @@ NEEDS RULING)

**These are SHIPPED strings, already translated into 26 languages.** A wave-0
reading or a translator found each one readable two ways, and no sprint launches while one is
unanswered. You are not being asked to approve wording here; you are being asked which reading
is the one you meant. "The first one" is a complete answer.

### from sprint 584-wave1

- **`lpn_settings_viscosity`**
  > Relative viscosity
  *The finding:* Outside the delta, found while translating: the existing Pashto for 'Relative diffusivity' reuses the same word this sprint had to use for 'concentration', and the two appear together on the water-quality settings screen.
  1. leave it alone, outside sprint scope, and file
  2. retranslate it despite being outside the delta
  **What this asks for:** which of the readings above you meant.
  *The proposal:* THE AGENT DID EXACTLY THE RIGHT THING -- it stayed inside its delta and filed rather than editing a key nobody asked it to touch. The collision is real and is INSIDE Pashto, not in the English: two distinct English terms landed on one Pashto word, and both are on the same screen. No English defect, so there is nothing to rewrite; what it needs is a Pashto speaker or a targeted single-key fix, w...
  The English needs a _syn "Relative rate of diffusion"

None. Every English key is present in at least one other language.
