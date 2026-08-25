# Is a hyphenation system the answer to a label that breaks mid-word?

**Question (Tom, 2026-08-25):** *"515 rework to add a hyphenation system if that applies across many
languages."*

**Answer: no. Do not add `hyphens: auto`.** It is measurably a no-op on the exact element Task 515 is
about, it cannot be made to work there without giving back something worse, and in English -- the
language Tom saw the defect in -- it would not fix the word he photographed even with everything
else out of its way. What is left of Task 515 is a width-or-wording decision, and the numbers for it
are at the bottom of this file.

Everything below is measured in the shipped Chromium (151.0.7922.34) against the real page, not
argued from the specification. The probes were throwaway; the numbers are reproducible from the
recipes named.

---

## 1. Adding `hyphens: auto` to the Settings index changes nothing at all

`.lpn-setbox-link` already carries `overflow-wrap: anywhere`. Adding `hyphens: auto` beside it, on
the real page at the real 105.6px index width, produced **fourteen out of fourteen rows identical**
-- same height, same words split, no hyphen anywhere.

The reason is a precedence rule that is easy to get backwards: **where `overflow-wrap` allows a break
inside a word, Chromium takes it and never consults the hyphenation dictionary.** So the two
properties do not add up. You get hyphenation only by taking `overflow-wrap` away.

| variant | Visualization | Map appearance |
|---|---|---|
| shipped (`overflow-wrap: anywhere`) | 2 lines, split mid-word | 3 lines, "appearance" split mid-word |
| `hyphens: auto` + `overflow-wrap: anywhere` | **identical** | **identical** |
| `hyphens: auto` + `overflow-wrap: normal` | **1 line, OVERFLOWING the pane** | 3 lines, hyphenated properly |
| `hyphens: manual` + `overflow-wrap: normal` | 1 line, overflowing | 2 lines, overflowing |

Read the third row twice. Taking `overflow-wrap` off to let hyphenation work fixes "Map appearance"
and **breaks "Visualization" worse than it is now**: the word stops wrapping and paints out of its
pane, which is the sideways scrollbar this pane was narrowed to be rid of. That is a straight
regression on the one label Tom actually named.

## 2. In English, Chromium does not hyphenate a word with a capital letter

This is the finding that settles it, and it is not in anybody's compatibility table.

| word | `lang="en"` | `lang="es"` |
|---|---|---|
| Visualization | **not hyphenated** | hyphenated |
| visualization | hyphenated | hyphenated |
| Communication | **not hyphenated** | hyphenated |
| communication | hyphenated | hyphenated |
| Hyphenation | **not hyphenated** | hyphenated |
| hyphenation | hyphenated | hyphenated |

Chromium's English patterns are the lowercase-only AOSP set and the matcher is case-sensitive;
German, Spanish, French and Italian ship patterns that cover capitalised forms, because those
languages capitalise mid-sentence words. `en-US`, `en-us` and `en-GB` behave identically to `en` --
the tag is not the problem.

**Every label in this index is sentence case.** So in English the first word of every row -- which
is the word that overflows in "Visualization" and "Calculation" and "Hydraulics" -- is beyond
hyphenation's reach no matter what else is configured.

## 3. Which of our 27 languages a hyphenation dictionary even exists for

Chromium ships 52 hyphenation patterns in `chrome-linux64/hyphen-data/`. Measured against our
languages, one long word each, `hyphens: auto` with nothing else able to break the word:

**Hyphenates (14):** am (via the Ethiopic patterns), bg, bn, cs, de, en (lowercase only -- see
above), es, fr, hi, hr, it, pt, ru, uk.

**Does nothing (13):** ar, fa, he, ps, ur, id, km, my, ro, sr, sw, tr, zh.

Two different reasons sit in that second column and they should not be reported as one gap:

- **ar, fa, he, ps, ur, zh, km, my -- not a gap.** Arabic-script and Hebrew orthography do not
  hyphenate at all (Arabic justifies by elongation, not by breaking words). Chinese, Khmer and
  Burmese break between characters or by a dictionary line-breaker that the browser already applies
  and that `hyphens` has nothing to do with -- Khmer measured the same height with `hyphens: auto`
  and with `hyphens: manual`, because it was already breaking. Nothing is owed to these languages
  here.
- **tr, ro, id, sr, sw -- a real gap, and it lands badly.** Turkish is one of the four anchor
  languages, and Turkish is exactly the agglutinative case where a long word is likeliest. Romanian,
  Indonesian, Serbian and Swahili have no pattern file either. So a hyphenation system would help
  neither the language the defect was reported in (English, capitalised) nor a quarter of the
  languages most likely to need it.

Other engines ship different sets -- Firefox carries its own libhyphen patterns and Safari uses the
system's -- and they were **not** measured here, because no Firefox or WebKit build is available in
this environment. Do not restate the table above as if it were cross-engine. What IS cross-engine is
§1 and §2's shape of argument: a feature whose coverage differs per engine cannot be the fix for a
layout that must hold everywhere.

## 4. The `lang` attribute: right at the root, and it was wrong in one place

`hyphens: auto` does nothing without a correct `lang`, so this was checked whether or not
hyphenation ships.

- **The root element is correct.** `lib/HeadersFooters.lib.php` writes
  `<html lang="<?=$html_lang?>">` from `$clanguage` on every page, through the single
  `echoHTMLHead()` every page goes through, and adds `dir="rtl"` for ar/fa/he/ps/ur. All 27 codes are
  valid primary subtags. No page emits its own `<html>` (the two other matches are `formmail.php`'s
  mail body and the service worker's offline stub, neither of which is a suite page).
- **One element was lying, and it is fixed in this commit.** The language dropdown in
  `lib/Menus.lib.php` prints each language's name in that language -- "Deutsch", "العربية", "中文" --
  inside a page whose `<html lang>` says something else, with no `lang` of its own. That is a real
  Language-of-Parts defect: a screen reader pronounces every name with the current page's phonetics.
  One attribute, no new string, no visual change. `dir` is deliberately not set there -- an RTL name
  in an LTR menu row would re-align the whole row, which is a design change nobody asked for.
- **The one that CANNOT be fixed, and is an argument against hyphenation by itself.** An absent
  language key falls back to English on purpose (CLAUDE.md: "an ABSENT key is the correct
  untranslated state"), and nothing marks which strings fell back. So a Spanish page contains
  English words under `lang="es"` -- and Spanish patterns hyphenate English words happily: measured,
  `lang="es"` splits "Visualization" and "Communication". Turning `hyphens: auto` on suite-wide would
  therefore print visibly wrong hyphens in every partially-translated page, in a place no check can
  see, and the more we translate the less it happens -- which is the worst possible failure curve for
  something to notice.

## 5. So what should happen to Task 515?

At the desktop index width, in English, **two of fourteen rows break mid-word**: "Visualization"
(one word, no help available) and "appearance" in "Map appearance". Everything else already breaks
at a space.

The measurement that decides it, on the real page: the index is 105.6px (6.6rem), which leaves a row
90.6px of text; **"Visualization" measures 104.2px** in the bold section-row font. Ending the
mid-word break in English needs the index at about **119px, or 7.45rem** -- which is essentially the
7.5rem it originally shipped at and which Tom narrowed twice on purpose (7.5 → 6.0 → 6.6, "width can
be 80% of current on PC"). **He cannot have both**, and that is the whole of what is left of Task
515. Three ways it can go, in the order I would rank them:

1. **A shorter English word for the one section heading.** `lpn_settings_sec_visualization` is the
   only label that no width short of 7.45rem can fix and that no hyphenation can help. A shorter
   name fixes it in every language at once and costs a re-translation of one key.
   **Wording is Tom's -- this is a proposal, not an edit.**
2. **Accept it, and close 515 on this evidence.** This is Tom's own current position ("I think we
   can't avoid some wrapping in some languages. We must just accept it"), and the count is two rows,
   both of which are still readable and still the name they say. `overflow-wrap: anywhere` is already
   the least-bad automatic answer: a name broken mid-word is still a name, an overflowing one is a
   sideways scrollbar.
3. **Widen the index back to 7.45rem.** Correct, and it hands back the 24px he twice decided the
   content pane should have. Only worth it if the narrow content pane has stopped mattering.

What is NOT on the list is a hyphenation system, for the four reasons above.

---

Copyright 2009 Thomas Gail Haws. Licensed under GNU GPL v3.0 or later.
