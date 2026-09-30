# Term concepts: a primary source above the English (ROADMAP Task 737)

## Why concept-first

Tom, 2026-09-28: *"The key here is for every language to invent unique words for each interface
element and to use them consistently... it might be handy to literally make up unique, but memorable
keys"* (his example: a "Sally", a symbology annotation label). Later that day: *"a keywords table
where we are less concerned about what key you assign to each row as that they be unique and
canonical"*. And 2026-09-29: *"We need to have a source that is more primary and more authoritative
than the English, and the English can be a translation of it. We should use the English as our
translation source only when the primary term is empty."*

English is ambiguous exactly where this suite is most exposed. "Label" is both our generated map
annotation and a custom property's display name (`lpn_cp_label`). EPANET's own Label is our Text.
"Head" is both a family of quantities and one node result. Sprints 573 and 667 found es, it, sw and
tr giving Tag and Label one word, so the Properties box showed two fields with one name. A translator
who starts from the English word inherits every one of those collisions.

## The design

**Every `glossary.json` term is a row of the concept table.** Beside its existing fields it carries:

- `concept`: a unique, citable id (`[a-z][a-z0-9-]*`). Interface elements get a coined name in
  Tom's style, so the id cannot be mistaken for any language's word; quantities get a plain id.
- `definition`: what the thing IS, and how it differs from its neighbours, written to be translated
  from. **An empty definition is legal and means English stays the source for that concept.**
- `translations.en`: the English rendering, one of 27. Where it is absent, the English rendering is
  the term name without its parenthetical.

Nothing else changed: `term`, `symbol`, `context`, `translation_notes`, `avoid` and the 26 target
translations are read exactly as before, and `term` is still the name `gloss:` pointers and
`prefixToTermNames()` use.

Before and after, one term:

```
{"term": "tag (EPANET)", "symbol": "", "avoid": [...], "context": "...",
 "translations": {"am": "...", ...}}

{"term": "tag (EPANET)", "concept": "gus", "definition": "A short identifier stored on an asset ...
 Not the Label (sally) ..., not the Text (tessa) ..., not the Description (dora) note ...",
 "symbol": "", "avoid": [...], "context": "...", "translations": {"en": "Tag", "am": "...", ...}}
```

**A key cites a concept** in `dev/scripts/key_concepts.json` (`key => [concept ids]`), or through
an existing `gloss: <term>` pointer in `$ec_lang_syn` when that term has a concept. The citation file
is separate from `$ec_lang_syn` because that array is Tom's to approve line by line; it is separate
from the glossary so that the table stays one row per concept and the check can ask whether a
citation resolves.

### Tom's rows

| Concept | English | What it is, in short |
|---|---|---|
| `sally` | Label | the annotation the PAGE writes beside an asset from its data (EPANET: Notation) |
| `tessa` | Text | the annotation the USER types and places (EPANET: Label) |
| `gus` | Tag | a short identifier stored on an asset, to group and find it (EPANET [TAGS]) |
| `dora` | Description | a free note stored on an asset; no calculation reads it |
| `elevation` | Elevation | z, a point's height above the project datum |
| `depth` | depth | y, water measured up from a thing's own bottom (bed, invert, tank floor) |
| `pressure` | Pressure | p, as a gauge reads it |
| `hydraulic-head` | Head | z + p/γ at one point: EPANET's node Head |
| `hgl` | Hydraulic grade line | the same quantity drawn as a line along a pipe |
| `egl` | Energy grade line | z + p/γ + v²/2g as a line; above the HGL by the velocity head |

Tom listed "total potential = Head/HGL" as one row. It is two records here, `hydraulic-head` for
the value at a point and `hgl` for the line, because a language may rightly use two words for them
(French *charge* and *ligne piézométrique*), and the translator rule is one word per concept. Each
definition names the other. **Tom may prefer one record; that is his call.** The root `head` term
is `head-family`, the family word that head loss, velocity head and weir head belong to.

The full definitions are in `glossary.json`. Where a definition could not be written with
confidence (conveyance efficiency, which Tom argues is conservation; ponding's design-goal nuance;
most of the lpn_ interface terms), it is empty and English remains the source.

## How a translator uses it

The payload carries `concept_source`, the fenced block under "Concepts are the source" in
`dev/translation-process.md`, and for each key it asks for that cites a concept with a non-empty
definition, a `key_concepts` entry: the id, the definition, the English rendering, the preferred
translation and any `avoid` list. The definition is the source; the English string is one rendering
of it. A key whose concepts all have empty definitions gets no entry, so its payload is exactly what
it was before. `prompt_context_by_prefix` also prints each defined term's definition as a `MEANS:`
line, and `glossary_terms_by_prefix` carries `concept` and `definition`.

## How a sprint uses it

- **Before launch:** `concept_check.php` must exit 0 beside `gloss_ref_check.php`. It fails on a
  term with no id, two terms sharing an id, an id that reads as another term's English name, and a
  key citing a missing id or a key that no longer exists.
- **Write-back:** a concept's word in each language goes into `translations[<lang>]` as before. A
  new concept (sally, tessa, dora, hydraulic-head) starts with empty translations; the first sprint
  that translates a key citing it fills them, and must not give two neighbouring concepts one word.
- **Adding a concept:** a new glossary term needs an id and a definition field (empty is fine). A
  new key naming an existing concept gets a line in `key_concepts.json`.

## The rejected alternative

**Keep English as the source and add each definition as a note.** That is what `context` and
`translation_notes` already are, and it is what let es, it, sw and tr ship Tag and Label as one word:
the note was there, and the English word still led. A note is read after the word it annotates. Tom
asked for the order to be reversed, so the definition is what the translator is told to translate,
and English is only the fallback where no definition has been written.
