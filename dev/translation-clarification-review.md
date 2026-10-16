# How clarifications reach translators: an independent review

Read-only review, 2026-10-15 (Arizona). No repo file was changed.

## Summary for Tom

**What is wrong, in one paragraph.** A note that explains an English word to translators can be
written in about a dozen places today. Roughly half of those places never reach the translator.
The places that do reach the translator bury the note: for the halo sprint, each translator received
a file of about 210,000 characters to translate 1,400 characters of English, because every map
calculator sprint sends all 72 map-related glossary terms, twice. The halo label and its tip ("the
solid outline behind map text") were both in that file, and four languages still wrote "hello". The
one piece of guidance that mattered was not attached to the word it explained.

**Three findings you would not see from the outside:**

1. **Many warnings already written are never sent.** 75 of the 177 per-label translator notes carry
   warnings such as "not a bus station", "apron is a rock pad, not clothing", or "keep this short, it
   is a column heading". The tool that builds the translator's file throws those warnings away
   before the translator sees them. The "station" warning was written after six languages shipped
   "bus station", and it has not reached a translator since.
2. **Reworded strings go out with no notes at all.** When the English changes, the old translation
   is sent back for redoing through a separate list that carries the English and nothing else. No
   glossary help, no synonyms, no neighbouring strings. In the last 30 days that was about 4 strings
   in every 10 translated.
3. **Halo is still wrong in two more languages.** Czech wrote *svatozář* (a saint's halo) and
   Swahili wrote *mwanga* (light). A native speaker or a back-translation should confirm this, but
   both look like the same trap in a different form.

### (1) Halo: where the note should live, and what it should say

**Where:** in the glossary, as one entry for the idea "text halo", tied to both halo strings. That
entry then reaches every translator of every string that uses the word, including the strings
your halo renovation will add. It needs your approval of the wording only. It is not a synonym
entry, so it does not touch the part of the language file reserved for you.

**Proposed wording (for your approval):**

> **Text halo**: a narrow band of background colour drawn around the letters of map text,
> following their shapes, so the text stays readable where it crosses pipes, symbols or other text.
> Translate the meaning, as an outline, border or band around the letters. Use your language's
> map-making or typesetting word for it if there is one.
>
> **Do not write:**
> - the English word "halo" spelled out in your alphabet. In Amharic, Bengali, Hindi and Burmese it
>   reads as the greeting "hello".
> - a word meaning light, glow or shine.
> - a saint's halo, unless your language's map makers use that same word for this band.

**Optional, if you want a synonym entry too** (this one needs your written OK):
"Text outline width, Text border width, Text buffer width (percent of text size)". Each of those
could go on the setting as its label, so it follows your synonym rule.

### (2) Are we translating too often? Yes.

Over the last 30 days (counted from the git history):

- **13 translation runs in 18 days**, 28 September to 15 October, and none in the twelve days
  before that. Ten were full 26-language sprints. One was the consent text. Two were the
  one-word-per-concept sweeps.
- **About 917 new strings and about 629 reworded strings**, each done in up to 26 languages, so about
  41% of the work was redoing strings that were already translated.
- **Four sprints were small**, at 9, 16, 23 and 15 new strings. A small sprint costs the same fixed
  work as a large one (the English review pass, 26 agents each reading the 210,000-character file,
  the quality checks, a full test run), so most of that effort goes on overhead.
- **Strings were translated before they had settled.** In Spanish, 101 of the 922 strings first
  translated this month were translated again within the same month. 66 Spanish strings were
  translated two or three times.
- **Production was last pulled on 9 October.** The sprints of 11, 13 and 15 October translated wording
  that no visitor sees yet, even in English. Some of it will change again before you pull.

Waiting costs very little. A page shows the English for any string not yet translated, so a new
string waits in English for a few days and nothing breaks.

**Recommended cadence:** translate **once, just before you pull production**, or once a week if you
pull more often than that. Skip that week if fewer than about 40 strings are waiting. The exceptions
are text that must be right in every language the day it ships, which today means only the consent
wording. Under this cadence the last 30 days would have needed three or four sprints instead of
thirteen, and most of the 629 redone strings would have been translated once, in their final
wording.

### (3) A tidier design

**The principle: each clarification lives in exactly one place, and the tool attaches it to the
string it explains, automatically, every time that string goes to a translator.** We already have
three homes that work:

- **A word or idea that comes back across strings** (head, label, halo, zoom to fit) goes in the
  **glossary**.
- **Other ways to say one particular label** go in the **synonym entry**, as now, and stay yours.
- **What the visitor is told** goes in the **tip**. The tip is translated anyway, and it should
  travel beside its label.

Everything else that tries to explain the English goes, or folds into one of those three.

**Recommendations, ranked by value for effort:**

1. **Send what is already written** (a tooling fix, nothing for you to decide). Send the per-label
   warnings that are thrown away today. Put reworded strings in the same file as new ones, with the
   same notes. Send only the glossary entries the strings in this batch actually use, instead of all
   72. The translator's file would shrink from about 210,000 characters to a few thousand, with each
   note sitting beside its string. This fix alone would have put "do not write hello" next to the
   halo label.
2. **Translate on a cadence, not after every merge** (point 2 above). It saves the most money and
   costs the least.
3. **Give every glossary idea one way to reach its strings.** Today a glossary entry reaches a
   string only through one of three hookups, and 20 of the 140 entries are hooked to nothing, so
   they never reach anyone. Yesterday's new "N/A" entry is one of them. Hook them automatically
   (when the glossary word appears in the English string, send it), keep a short hand-kept list only
   for exceptions such as the custom-property "Label", and add a check that refuses an entry that
   reaches no string.
4. **Add one question to the English review pass that runs before each sprint:** "Which word here
   would a translator be tempted to spell out phonetically, or read in an everyday sense?" Today
   that pass only asks whether an English reader could read the string two ways. Halo passed it
   because English readers read halo one way. Whatever the new question finds goes into the
   glossary.
5. **Simplify the glossary entry itself.** Each entry has four free-text fields that overlap
   (definition, context, translation notes, avoid). Send the translator two of them, what it means
   and what not to write, and keep the history as a record that is not sent.

**What to keep:** the glossary, your synonym entries and your approval of them, tips, the
suggestion box, the record of your approved wording, and the check that catches reworded English.
All of these work. What fails is how their contents travel to the translator.

**What to remove or merge:** the three separate hookups between glossary and strings become one; the
separate list for reworded strings merges into the main file; three per-language note fields and
an old unused translation driver go (details below).

---

## Technical appendix

### A. Every place "what this English means" can live today

| # | Place | Scope | Reaches the translator's payload? |
|---|---|---|---|
| 1 | The English string itself, in `lib/lang.ec.en.php` | key | Yes (`keys_to_translate`) |
| 2 | Its `_tip` sibling | key | Only if the tip is in the same delta. It goes as a separate, unlinked entry |
| 3 | `$ec_lang_syn` left of the pipe (synonyms) | key | Yes (`key_syn`) |
| 4 | `$ec_lang_syn` right of the pipe: `avoid:`, `layout:`, `symbol`, free notes | key | **No.** `collectKeySyn()` strips everything from the first pipe (generate_translation_payloads.php:502-508). 75 entries are affected |
| 5 | `$ec_lang_syn` `gloss:` pointer | key to concept | Yes, through `key_concepts` (definition, avoid, preferred translation) |
| 6 | `dev/scripts/key_concepts.json` (22 keys) | key to concept | Yes (`key_concepts`) |
| 7 | `glossary.json` term (`definition`, `context`, `translation_notes`, `avoid`, `translations`) | concept | Only when wired by prefix in `prefix_terms.inc.php`, or cited per 5/6. Then it is sent **twice**: as text in `prompt_context_by_prefix` and as JSON in `glossary_terms_by_prefix` |
| 8 | `glossary.json` `translation_notes_am/km/ps` | concept, one language | **No** (the generator reads only `translation_notes`) |
| 9 | Glossary terms wired to no prefix, no key and no pointer | concept | **No.** 20 of 140: invert elevation, check structure, centroid, calculator, application (irrigation), channel lining, erosion, connected file, tab (project tab), EngCalcs (product name), tank level, calibration, contour (pressure plot), criticality, flow balance, edit lock, workspace, base elevation (tank bottom), Shape, N/A |
| 10 | Suite-wide notes: generator `meta.*_notes`, plus the suggestion-box and concept-source blocks fenced in `dev/translation-process.md` | all keys | Yes |
| 11 | The orchestrator's per-sprint brief | sprint | Yes, but ephemeral: written fresh each time and kept nowhere |
| 12 | Resync list (`detect_english_drift.php --json`, e.g. `resync_584-wave1.json`) | key | Sent as English only, outside the payload: **no `key_syn`, `key_concepts` or neighbours** |
| 13 | `//` comments in `lang.ec.en.php` (1,946 lines) | key | No. Sprints copy them into all 26 files, which is why sprint 1016's commit touched 58,000 lines for 59 keys |
| 14 | `dev/english-friction/*.json` resolutions (38 files) | key | No. A resolution is supposed to land in 1, 3 or 7. A "dismissed" one stays only here |
| 15 | `dev/english-key-rulings.json` (1,217), `syn-rulings/-proposals/-baseline.json`, `new-english-keys.md` | key | No. Workflow state, used to skip re-asking |
| 16 | Prose examples in `dev/language-strings.md`, `term-concepts.md`, `lpn-rulings.md`, CLAUDE.md | various | No |

**Count:** a single clarification can be written in about 12 places. 6 reach a translator, and only 3
of those attach the clarification to its key (3, 5, 6).

### B. Three real keys

- **`lpn_settings_text_halo`** ("Text halo width (percent of text size)"). No glossary term, no syn,
  no concept citation. The only explanation was the separate tip key, delivered as an unlinked entry
  inside a 210,107-character am payload, of which 1,388 characters were strings to translate and
  about 175,000 were the 72 lpn glossary terms, sent twice. Result: "hello" in am, bn, hi and my
  (fixed in the sprint commit). cs `svatozáře` (saint's halo) and sw `mwanga` (light) are still
  shipped. Wave 0 for 1016 reviewed the key and recorded it as "reads one way only", which is true
  for English readers. The trap was a loanword, which Wave 0 does not ask about. The sprint wrote a
  glossary entry for the dismissed "N/A" question, but not for halo, the real defect. That N/A entry
  is wired to nothing (`mtc` prefix list and `key_concepts.json` both lack it), so it will never be
  delivered.
- **`mi_station`** ("Sta"). The bus-station warning lives only right of the syn pipe, and the
  generator strips it there: `avoid: transit-stop "bus/train station" sense (found in
  he/hi/ur/ps/my/am, corrected 2026-07-08)`. There is no glossary term, and the only other copy is
  a prose example in `language-strings.md`. So the warning written after a six-language defect
  reaches no translator.
- **`lpn_tool_zoom_extent`** ("Zoom to fit"). The same meaning is written in seven places: the syn
  synonyms (sent), a syn `avoid` (stripped), glossary `definition`, `context`, `avoid` (four
  items), `translation_notes` (all sent, twice, among 72 terms, with nothing linking them to this
  key), the tip key, and a `language-strings.md` example. `definition` and `context` say nearly the
  same sentence.

### C. Sprint arithmetic (git, first-parent master, 2026-09-16 to 10-15)

| Run | Date | New | Resync (claimed; es values actually changed) |
|---|---|---|---|
| 09-28-delta | 09-28 | 313 | 0 |
| 09-29-delta | 09-29 | 16 | 1 |
| 09-29-echo | 09-30 | 0 | 125 (es 75) |
| 09-30-fox | 09-30 | 9 | 1 |
| 09-30-golf | 09-30 | 23 | 6 |
| 1004-lpn | 10-04 | 129 | 14 (es 12) |
| 1008 | 10-08 | 224 | 343 (es 295) |
| consent | 10-11 | 0 | 3 |
| 1012-delta | 10-11 | 114 | ~35 (es 29) |
| 1014 | 10-13 | 74 | 57 (es 20) |
| 737 / 737b | 10-14/15 | 0 | concept sweeps in 7 + 10 languages |
| 1016 | 10-15 | 15 | 44 |
| **Total** | 18 days | **~917** | **~629 (41%)** |

In Spanish, 440 already-translated strings changed 513 times. 101 of the 922 strings born in the
window were re-translated within it, and 66 strings were translated two or three times. In English,
134 strings were reworded two or more times, one of them seven times (`lpn_notes_7_def`). The
production pull was b7c99102 on 10-09, per the handoff. Untranslated keys fall back to English
(`lib/base.inc.php` loads `lang.ec.en.php` first), so delay is safe.

### D. Migration steps (in order; each one stands alone)

1. Generator: deliver syn commentary as `key_notes[key]` (the stripped tags, rendered as their
   full instructions from the language-strings.md tag table). Build resync keys into
   `keys_to_translate` with `reason: english_changed` and `current_value`, which gives them
   `key_syn`, `key_concepts` and neighbours, and retires the side list. Attach each `_tip` value to
   its label as `key_context.tip`. Send only the glossary terms cited by, or whose English rendering
   appears in, this batch's strings, once, as text, and drop the duplicate JSON copy.
   `payload_freshness_selftest` and `gloss_ref_check` need updating to match.
2. Add the halo concept and two `key_concepts.json` citations once Tom approves the wording. Ask
   for back-translation of cs and sw `lpn_settings_text_halo` and `_tip`.
3. Retire `prefix_terms.inc.php`'s per-prefix lists in favour of auto-match plus `key_concepts.json`.
   Move the 63 `gloss:` pointers into `key_concepts.json`. That edits `$ec_lang_syn` and needs one
   batch approval from Tom. Extend `concept_check.php` to fail a glossary term that reaches no key
   unless it is marked `reference_only`.
4. Glossary schema: translator-facing `definition` and `avoid`. Fold `context` into `definition`
   where it adds anything. Keep `translation_notes` as the unsent record. Fold
   `translation_notes_xx` into it.
5. Wave 0 brief: add the loanword / everyday-sense question. Route its findings to the glossary.
6. Cadence: sprint at production pull (or weekly when 40 or more keys are waiting). Record the rule
   in `dev/translation-process.md` and CLAUDE.md's Translation Sprints section.
7. Housekeeping: delete `dev/scripts/translate_prompt.php` / `translate.php` if unused. They are a
   Haiku direct-API driver that still reads `key_intent`, which no longer exists, against a
   Sonnet-only rule. Stop copying English `//` comments into the 26 files.
