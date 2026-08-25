# Merge proposal: the two `ponding` entries in `glossary.json`

> **ACCEPTED AND APPLIED, 2026-08-25.** Tom: *"I accept the glossary merge."* Entry `46` is gone and
> entry `34` now carries the merged term in `dev/scripts/glossary.json`. **One change from the
> proposal below, on his ruling:** the first `avoid` item no longer forbids the word *flooding*
> outright — *"I'm really soft on 'don't say flooding'. Maybe flooding is the right word in some
> languages."* It now says the caution is about the SENSE (this is a design goal, not damage) and
> that a language whose natural term for held-back water is also its flooding word should use it and
> say so. **The rest of this document is the proposal as written, kept as the record of the
> evidence.** §6's two follow-ups are NOT applied and are still open.

**Status: PROPOSAL. Nothing in `dev/scripts/glossary.json` has been changed.** Written 2026-08-25
for ROADMAP Task 513's third leftover. Tom rules; the orchestrating session reviews first.

**Recommendation: MERGE, into one entry, and it is not a straight "keep 46".** The two entries
encode no distinction — same concept, same calculator, same "this is a design goal, not a flood"
framing. What they encode is a duplication that the payload builder resolves silently and wrongly.

---

## 1. Why this is not merely untidy

`termIndexByName()` in `dev/scripts/generate_translation_payloads.php` builds

```php
$index[strtolower((string)$term['term'])] = $term;
```

so **two entries with the same `term` collapse to one and the LAST one wins.** Entry 46 is written
after entry 34 in the file, so entry 46 is what `glossary_terms_by_prefix` has been delivering to
every translation agent, and **entry 34 has been unreachable from a payload for its whole life** —
including its explicit "do not use a word implying flooding, failure, or undesirable inundation"
rule, which is precisely the guard the Swahili audit had to apply by hand afterwards.

Verified:

```
$ php -r '... $index[strtolower($t["term"])] = $id; ...'
ponding resolves to entry id: 46
DUPLICATE NAME: ponding => 34, 46
DUPLICATE NAME: scenario => 82, scenario     <-- see §6, a second instance of the same defect
```

This is the `prefixToTermNames()` failure mode CLAUDE.md already warns about, arriving through a
different door: payloads generate, `--check` says FRESH, `gloss_ref_check.php` passes, the sprint
runs, and half the entry was never delivered. **The census result is therefore not independent
evidence that entry 46 is the better wording — it is largely evidence that entry 46 is the only one
anyone was shown.** That matters for how much weight incumbency carries here, and it is why the
merged entry below takes entry 34's rendering in the two languages where entry 34 nevertheless won
on the page.

---

## 2. The two entries, side by side

| Field | id 34 | id 46 |
|---|---|---|
| `term` | `ponding` | `ponding` |
| `context` | "Upstream water accumulation at the inlet of a chute or spillway, forming a small pond. In the Robinson method, ponding (Hp > yn) is desirable — the head at the inlet crest acts as a weir, reducing upstream erosion risk. Appears in Rock Chute Design calculator." | "Water pooling/backing up upstream of the chute inlet; beneficial in the Robinson design context." |
| `translation_notes` | The don't-say-flooding rule, plus per-language examples: es `represamiento`, fr `mise en charge amont`, ru `подпор воды`, zh `壅水` | The sw `mafuriko` correction, "keep one term per language", Task 109 stage 3 hi ruling on `ताल` |
| `source` | `ai-generated` | `ai-generated (Fable 5 linguistic audit, 2026-07); verify before treating as standard-sourced` |
| `avoid` | absent | absent |

Both carry the same 2026-08-25 census paragraph appended to `translation_notes`; it is the same text
in both and collapses to one copy on merge.

Entry 34's `context` is strictly the better one — it names the criterion (`Hp > yn`), the mechanism
(the crest acts as a weir) and the reason it is wanted. Entry 46's is a one-line restatement.

**Neither context is complete.** Both say "Rock Chute Design calculator", but the term's English
sites include `wi_pondingHeight` in Weir Flow Irregular. See §6.

---

## 3. The census, per language

`php dev/scripts/glossary_rendering_census.php --term=ponding`. Ten English sites:
`wi_pondingHeight`, `rc_yn`, `rc_Hp`, `rc_ponding_check`, `rc_pond_ok`, `rc_pond_ok_tip`,
`rc_pond_warn`, `rc_pond_warn_tip`, `rc_notes_7_term`, `rc_notes_7_def` — nine of the ten in files
that leave `wi_pondingHeight` untranslated.

| Lang | entry 34 rendering | 34 hits | entry 46 rendering | 46 hits | What the file ships | Winner |
|---|---|---|---|---|---|---|
| bg | задържане на вода | 0/9 | подпор | **9/9** | подпор | 46 |
| cs | vzdutí vody | 0/9 | vzdutí | **9/9** | vzdutí | 46 |
| es | represamiento | 0/10 | remanso | **10/10** | remanso | 46 |
| he | הצטברות מים לאחור | 0/9 | הצטברות מים | **9/9** | הצטברות מים | 46 |
| hr | zadržavanje vode | 0/9 | uspor | **9/9** | uspor | 46 |
| id | genangan air hulu | 0/9 | genangan | **9/9** | genangan | 46 |
| ru | подпор воды | 0/9 (1 by stem) | подпор | **9/9** | подпор | 46 |
| sr | задржавање воде | 0/9 | успор | **9/9** | успор | 46 |
| tr | göllendirme | 0/10 | göllenme | **10/10** | göllenme | 46 |
| uk | підпір води | 0/9 | підпір | **5/9 + 4 inflected** | підпір | 46 |
| de | Aufstau | 1/9 | Einstau | **8/9** | Einstau | 46 |
| it | ristagno d'acqua a monte | 0/9 | rigurgito | **8/9** | rigurgito | 46 |
| pt | represamento | 1/10 | remanso | **9/10** | remanso | 46 |
| sw | maji yaliyosimama nyuma | 0/9 | kutuama kwa maji | **7/9** | kutuama kwa maji | 46 |
| zh | 壅水 | **8/9** | 壅水 | **8/9** | 壅水 | identical — no conflict |
| bn | পানি সঞ্চয় | **8/9** | জলাবদ্ধতা | 0/9 | পানি সঞ্চয় | **34** |
| hi | ताल बनना | **5/9 + 1 infl.** | जलभराव | 0/9 | ताल | **34** |
| am | ፈሰስ ብናኝ | 0/9 | *(empty)* | — | neither | neither |
| ar | تجمع المياه العلوي | 0/9 | التحوض | 0/9 | تجمّع (6 sites) | neither |
| fa | آبگیری ورودی | 1/9 | تجمع آب | 0/9 | آبگیری (6 sites) | neither |
| fr | mise en charge amont | 0/10 | retenue en amont | 0/10 | mise en charge (7 sites) | neither |
| km | ការស្ករទឹកខាងដើម | 0/9 | *(empty)* | — | neither | neither |
| my | ရေ‌နောက်ကျမှု | 0/9 | *(empty)* | — | neither | neither |
| ps | د اوبو راټولول | 0/9 | *(empty)* | — | neither | neither |
| ro | acumulare de apă amonte | 0/9 | remuu | 0/9 | înălțare (5 sites) | neither |
| ur | پانی کا جمع ہونا | 1/9 | پانی جمع ہونا | 2/9 + 2 infl. | weak either way | neither |

**15 languages follow entry 46. Two follow entry 34. One (zh) is the same word in both. Nine follow
neither.** That is a duplication with a clear majority, not two competing conventions.

Two of the "neither" rows are near-misses rather than genuine disagreements: `fr` ships
`mise en charge` and entry 34 appends `amont`; `fa` ships `آبگیری` and entry 34 appends `ورودی`.
Both score zero on an exact-substring test purely because of the appended word.

---

## 4. The merged entry, as it would appear

Replaces both `"34"` and `"46"`. Keeping the `34` slot preserves the lower id; keeping `46`
preserves the id the payload builder currently resolves to. **Either is fine — but only one entry
may carry `"term": "ponding"` when this is done.**

```json
"34": {
 "term": "ponding",
 "symbol": "",
 "context": "Upstream water accumulation at the inlet of a chute or spillway, forming a small pond. In the Robinson method, ponding (Hp > yn) is desirable — the head at the inlet crest acts as a weir, reducing upstream erosion risk. Appears in Rock Chute Design (rc_Hp, rc_yn, rc_ponding_check and the rc_pond_* verdicts) and in Weir Flow Irregular (wi_pondingHeight).",
 "avoid": [
  "flooding, inundation, or any word for water where it is not wanted — ponding here is a design goal, not a failure",
  "a word for a standing puddle on a flat surface (roof ponding, field ponding); this is backwater held by a crest",
  "a phonetic transliteration of the English word where the language has a backwater term (hi shipped पोंडिंग in wi_pondingHeight once and it was corrected)"
 ],
 "translation_notes": "Backwater pooling upstream of a crest, held there on purpose. Keep ONE term per language — the sw and it files once alternated. Task 109 stage 3 (2026-07-19): hi confirmed on ताल; the transliteration पोंडिंग in wi_pondingHeight was corrected. sw \"mafuriko\" (floods) is wrong; use \"kutuama kwa maji\". [2026-08-25, ROADMAP Task 513] MERGED FROM TWO ENTRIES that both carried the name \"ponding\" (old ids 34 and 46). Because termIndexByName() keys the glossary by term NAME, the later of the two won every payload and the earlier one was never delivered to any translation agent — so the shipped strings measure entry 46's wording mainly because it was the only one shown. Renderings below are the ones glossary_rendering_census.php actually finds in the files: 15 languages on the old entry 46 (es remanso 10/10, tr göllenme 10/10, bg подпор 9/9, cs vzdutí 9/9, he הצטברות מים 9/9, hr uspor 9/9, id genangan 9/9, ru подпор 9/9, sr успор 9/9, uk підпір 9/9, pt remanso 9/10, de Einstau 8/9, it rigurgito 8/9, sw kutuama kwa maji 7/9), two on the old entry 34 (bn পানি সঞ্চয় 8/9, hi ताल 5/9), zh 壅水 identical in both. fr and fa are corrected here to what they ship (mise en charge 7/10, آبگیری 6/9) — the old entries missed them only by an appended \"amont\"/\"ورودی\". am, ar, km, my, ps, ro and ur ship no attested rendering and their values below are UNVERIFIED CANDIDATES; re-run the census rather than trusting this paragraph.",
 "translations": {
  "am": "ፈሰስ ብናኝ",
  "ar": "تجمّع المياه",
  "bg": "подпор",
  "bn": "পানি সঞ্চয়",
  "cs": "vzdutí",
  "de": "Einstau",
  "es": "remanso",
  "fa": "آبگیری",
  "fr": "mise en charge",
  "he": "הצטברות מים",
  "hi": "ताल",
  "hr": "uspor",
  "id": "genangan",
  "it": "rigurgito",
  "km": "ការស្ករទឹកខាងដើម",
  "my": "ရေ‌နောက်ကျမှု",
  "ps": "د اوبو راټولول",
  "pt": "remanso",
  "ro": "remuu",
  "ru": "подпор",
  "sr": "успор",
  "sw": "kutuama kwa maji",
  "tr": "göllenme",
  "uk": "підпір",
  "ur": "پانی جمع ہونا",
  "zh": "壅水"
 },
 "source": "merged 2026-08-25 from two same-named entries (ai-generated + Fable 5 linguistic audit 2026-07); per-language values reconciled against dev/scripts/glossary_rendering_census.php"
}
```

Three judgement calls sit inside that block. Each can be overruled on its own:

1. **bn and hi take the OLD ENTRY 34 rendering.** They are the only two languages where the losing
   entry is the one on the page, and hi's `ताल` additionally has a Task 109 human confirmation
   behind it. Taking entry 46 there would contradict both the strings and a recorded ruling.
2. **fr and fa are set to what the files ship**, not to what either entry said. This is the only
   place the proposal writes a value neither entry contained. It is a correction of an appended
   word, not a new choice of term.
3. **`ro` keeps `remuu`** even though the file ships `înălțare` 5/9. `remuu` is the Romanian
   hydraulic term for backwater and `înălțare` ("raising") reads as a description rather than a
   term. That is a translator's call and it is listed in §6 rather than settled here.

---

## 5. What is LOST by merging, honestly

- **Nothing conceptual.** Both entries define the same thing in the same calculator and agree it is
  beneficial. There is no rc-vs-wi distinction, no static-vs-dynamic distinction, no register
  distinction. This is a duplicate, not a pair.
- **Entry 34's four per-language examples inside prose** (`es represamiento`, `fr mise en charge
  amont`, `ru подпор воды`, `zh 壅水`) are deleted rather than carried, because three of the four
  disagree with what those languages shipped. Keeping them would leave a wrong recommendation in a
  file whose whole job is to be quoted at an agent.
- **Entry 46's `source` caveat** ("verify before treating as standard-sourced") survives in substance
  in the merged `source` line, which names both origins.
- **Two `translations` maps become one,** so the alternative rendering per language stops being
  recorded. If keeping a second candidate per language is ever wanted, that needs a real
  `alternatives` field — a duplicated entry cannot serve as one, because `termIndexByName()` throws
  it away.

**If a reviewer disagrees and wants both kept, the entries must at minimum be given DIFFERENT `term`
values,** or the second one stays dead weight no payload can reach.

---

## 6. Follow-ups this turned up (each separate work; none applied)

1. **`scenario` is duplicated the same way** — entry `"82"` and an entry keyed `"scenario"`, and the
   string-keyed one wins. Entry 82's three `avoid` items and its es/fr/pt/tr translations are
   therefore invisible to payloads; only sw `Senario` is delivered. Same defect, same fix shape.
2. **A duplicate-`term` guard belongs in `gloss_ref_check.php`.** It is a few lines, it is exactly
   the "a rule a machine enforces is worth ten a human must remember" case, and both instances above
   would have been caught the day they were written.
3. **`wi` does not list `ponding` in `prefixToTermNames()`** (`dev/scripts/prefix_terms.inc.php:37`),
   although `wi_pondingHeight` is one of the term's ten English sites. A Weir Flow Irregular sprint
   gets no ponding guidance at all — the silent-blinding failure CLAUDE.md documents.
4. **Nine languages need a ponding decision from someone who reads them**: am, ar, fa, fr, km, my,
   ps, ro, ur. `fr` and `fa` are near-certain (drop the appended word). `ar`, `ro` and `ur` are real
   questions. `am`, `km`, `my` and `ps` are low-resource tier and ship nothing recognisable.
