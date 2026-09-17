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

**13 still to read**, of 13 untranslated keys, of 1875 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (13, 13 to read @@ NEEDS RULING)

- **`lpn_lock_age_edited`**
  > It was last edited {x} ago.
  @@ NEEDS RULING
- **`lpn_lock_age_inuse`**
  > It has been in use for {x}.
  @@ NEEDS RULING
- **`lpn_lock_age_never_saved`**
  > Nothing has been saved to this file yet.
  @@ NEEDS RULING
- **`lpn_lock_age_saved`**
  > It was last saved {x} ago.
  @@ NEEDS RULING
- **`lpn_lock_age_unknown`**
  > There is no record of how long it has been in use, or when it was last saved or edited.
  @@ NEEDS RULING
- **`lpn_lock_ask`**
  > Ask
  @@ NEEDS RULING
- **`lpn_lock_ask_failed`**
  > Your message could not be passed on. Either nobody has this file open now, or the server could not be reached.
  @@ NEEDS RULING
- **`lpn_lock_ask_prompt`**
  > What should we tell them? Your initials are ideal. They are sent to whoever has the file open, and are not kept on this computer.
  @@ NEEDS RULING
- **`lpn_lock_ask_sent`**
  > We have asked whoever has this file open to close it. They will see it within a minute, if their page is still open. Nothing else has changed, and the file is still theirs until they close it.
  @@ NEEDS RULING
- **`lpn_lock_open_care`**
  > To avoid data loss, choose carefully from the options below.
  @@ NEEDS RULING
- **`lpn_lock_open_choices_ask`**
  > Ask tells whoever has this file open that you would like it, and changes nothing else. Break lock lets you save over the file; their unsaved work is not lost, but they will no longer be able to save it here, and somebody may have to merge the two by hand. Open read-only lets you look at it and change anything you like, without being able to save here.
  @@ NEEDS RULING
- **`lpn_lock_open_inuse`**
  > This file appears to be in use.
  @@ NEEDS RULING
- **`lpn_lock_requested`**
  > {name} would like to edit this file. When you are ready, save your work and use File, Close project to hand it over.
  @@ NEEDS RULING
