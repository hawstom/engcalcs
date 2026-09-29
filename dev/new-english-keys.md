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

**0 still to read on master**, of 0 untranslated keys, of 2157 English keys. **A branch section follows if anything is waiting there.** A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (9 to read @@ NEEDS RULING)

**These are SHIPPED strings, already translated into 26 languages.** A wave-0
reading or a translator found each one readable two ways, and no sprint launches while one is
unanswered. You are not being asked to approve wording here; you are being asked which reading
is the one you meant. "The first one" is a complete answer.

### from sprint 2026-09-29-delta

- **`lpn_ff_design_no_selection`**
  > The design check is set to the selected junctions, and none is selected. Select some on the map, or set All.
  *The finding:* 'set All' names no option; the real option label is 'All other junctions and all pipes' (lpn_ff_design_all).
  1. quoted short 'All' (chosen)
  2. spell out the full option label
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* "or set All" names no control: the option reads "All other junctions and all pipes" (lpn_ff_design_all). Seven agents flagged it (hi, he, ru, zh, sw, ur, and pt by choice), and the languages split between a bare "All" and the full option label. Proposed English, for Tom: "The design check is set to the selected junctions, and none is selected. Select some on the map, or choose All other junctio...
  @@ NEEDS RULING
- **`lpn_ff_design_no_selection`**
  > The design check is set to the selected junctions, and none is selected. Select some on the map, or set All.
  *The finding:* 'All' does not quote the real option label 'All other junctions and all pipes'.
  1. generic 'set to all' (chosen)
  2. quote the full option label
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* "or set All" names no control: the option reads "All other junctions and all pipes" (lpn_ff_design_all). Seven agents flagged it (hi, he, ru, zh, sw, ur, and pt by choice), and the languages split between a bare "All" and the full option label. Proposed English, for Tom: "The design check is set to the selected junctions, and none is selected. Select some on the map, or choose All other junctio...
  @@ NEEDS RULING
- **`lpn_ff_design_no_selection`**
  > The design check is set to the selected junctions, and none is selected. Select some on the map, or set All.
  *The finding:* 'set All' is shorthand for the option labelled 'All other junctions and all pipes'.
  1. short 'All'
  2. spell out the full option label
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* "or set All" names no control: the option reads "All other junctions and all pipes" (lpn_ff_design_all). Seven agents flagged it (hi, he, ru, zh, sw, ur, and pt by choice), and the languages split between a bare "All" and the full option label. Proposed English, for Tom: "The design check is set to the selected junctions, and none is selected. Select some on the map, or choose All other junctio...
  @@ NEEDS RULING
- **`lpn_ff_design_no_selection`**
  > The design check is set to the selected junctions, and none is selected. Select some on the map, or set All.
  *The finding:* "set All" is shorthand for the long option label; Chinese has no one-word form that identifies it.
  1. quote the full option label (chosen)
  2. coin a short 全部 that may not match the dropdown
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* "or set All" names no control: the option reads "All other junctions and all pipes" (lpn_ff_design_all). Seven agents flagged it (hi, he, ru, zh, sw, ur, and pt by choice), and the languages split between a bare "All" and the full option label. Proposed English, for Tom: "The design check is set to the selected junctions, and none is selected. Select some on the map, or choose All other junctio...
  @@ NEEDS RULING
- **`lpn_ff_design_no_selection`**
  > The design check is set to the selected junctions, and none is selected. Select some on the map, or set All.
  *The finding:* No control is labelled just All; the real option is All other junctions and all pipes.
  1. spell out the full option label (chosen, as pt)
  2. short word for All
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* "or set All" names no control: the option reads "All other junctions and all pipes" (lpn_ff_design_all). Seven agents flagged it (hi, he, ru, zh, sw, ur, and pt by choice), and the languages split between a bare "All" and the full option label. Proposed English, for Tom: "The design check is set to the selected junctions, and none is selected. Select some on the map, or choose All other junctio...
  @@ NEEDS RULING
- **`lpn_find_shift_hint`**
  > Shift+click to add/remove toggle.
  *The finding:* "Shift+click to add/remove toggle." has odd grammar: a noun phrase dangling after the infinitive.
  1. Shift+click toggles whether a click adds or removes
  2. Shift+click adds, and some other gesture removes
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* "Shift+click to add/remove toggle." leaves "toggle" dangling after the infinitive (it). Most languages rendered "Shift+click to add or remove", which is what the gesture does. Proposed English, for Tom: "Shift+click to add or remove one."
  @@ NEEDS RULING
- **`lpn_goto_on_map`**
  > Go to on map
  *The finding:* 'Go to on map' has no object; Arabic wants one.
  1. bare verbal noun parallel to Select/Unselect on map (chosen)
  2. add an implied pronoun object, whose gender may not fit every row
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* "Go to on map" has no object for "to". Three agents flagged it (ar, ps, ru), and the shipped values split: de, hr, fa, ru, tr wrote "Show on map", while ro ("Mergi la pe hartă"), pt ("Ir para no mapa") and id ("Menuju di peta") calqued it word for word into something ungrammatical. It is the title on the row button that zooms to the element and selects it, beside lpn_pane_goto_tip "Zoom & sele...
  @@ NEEDS RULING
- **`lpn_goto_on_map`**
  > Go to on map
  *The finding:* "Go to on map" has no object (go to what?).
  1. go to it on the map (chosen)
  2. a literal Go, on map, with no object
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* "Go to on map" has no object for "to". Three agents flagged it (ar, ps, ru), and the shipped values split: de, hr, fa, ru, tr wrote "Show on map", while ro ("Mergi la pe hartă"), pt ("Ir para no mapa") and id ("Menuju di peta") calqued it word for word into something ungrammatical. It is the title on the row button that zooms to the element and selects it, beside lpn_pane_goto_tip "Zoom & sele...
  @@ NEEDS RULING
- **`lpn_goto_on_map`**
  > Go to on map
  *The finding:* 'Go to on map' has no object, and sits beside lpn_pane_goto_tip ('Zoom & select') for what may be the same button.
  1. show this row's element on the map (chosen)
  2. a duplicate of 'Zoom & select'
  **What this asks for:** a WORDING ruling -- is the English above right, or say what it should say.
  *The proposal:* "Go to on map" has no object for "to". Three agents flagged it (ar, ps, ru), and the shipped values split: de, hr, fa, ru, tr wrote "Show on map", while ro ("Mergi la pe hartă"), pt ("Ir para no mapa") and id ("Menuju di peta") calqued it word for word into something ungrammatical. It is the title on the row button that zooms to the element and selects it, beside lpn_pane_goto_tip "Zoom & sele...
  @@ NEEDS RULING

None on master. Every English key here is present in at least one other language.

---

# Strings waiting on a branch

**9 still to read**, of 12 new keys across 11 unmerged branch(es).

A feature waits on its branch until you have used it and said so, so this is where new
wording lives before it reaches master. **These strings are real and are not on master**,
which is why the list above can honestly say none while there is reading to do here.

Each branch carries the commit it was read at. This part is a SNAPSHOT and is not held
fresh by the build — a branch moves whenever anybody commits on it, and failing master's
build for that would be a gate nobody keeps. Refresh it with
`php dev/scripts/new_english_keys.php --write`.

### chore/roadmap-0929 (`0d83b01d`) — adds no English strings

### feat/frequency-plot (`c74382c6`) — 9 new, 9 to read @@ NEEDS RULING

- **`lpn_freq_axis_percent`**
  > Percent less than
  @@ NEEDS RULING
- **`lpn_freq_group_tip`**
  > Whether the graph shows junctions or pipes.
  @@ NEEDS RULING
- **`lpn_freq_menu`**
  > Frequency
  @@ NEEDS RULING
- **`lpn_freq_none`**
  > No results for this value yet, so there is nothing to graph.
  @@ NEEDS RULING
- **`lpn_freq_quantity_tip`**
  > Which value to graph.
  @@ NEEDS RULING
- **`lpn_freq_summary`**
  > Plotted: {n} of {total}
  @@ NEEDS RULING
- **`lpn_freq_summary_time`**
  > Plotted: {n} of {total}, at {time}
  @@ NEEDS RULING
- **`lpn_freq_tip`**
  > Graph how one value is spread over all junctions or all pipes, at the time the map is showing.
  @@ NEEDS RULING
- **`lpn_freq_title`**
  > Distribution of values
  @@ NEEDS RULING

### feat/label-gang-search (`8b31a907`) — 3 new, all ruled

- **`lpn_confirm_labels_restore`**
  > Set the label columns back to their original values? This resets which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._
- **`lpn_labels_restore`**
  > Restore label defaults
  _Ruled OK 2026-09-23._
- **`lpn_labels_restore_tip`**
  > Sets the label columns back to their original values: which properties are shown, the text before and after each one, the decimals, and the drop order. Your drawing and your other settings are not changed.
  _Ruled OK 2026-09-23._

### feat/label-placer (`5508e0a1`) — adds no English strings

### feat/label-placer-a (`3483bfd6`) — adds no English strings

### feat/label-placer-b (`c5905432`) — adds no English strings

### feat/label-placer-c (`9a790a3e`) — adds no English strings

### feat/label-placer-d (`129b63c4`) — adds no English strings

### feat/table-tab-keys (`065d7e81`) — adds no English strings

### fix/lock-disclosure (`8effc7cb`) — adds no English strings

### fix/start-fresh-consent (`ef5a4c78`) — adds no English strings
