# English friction log — the translator's suggestion box

Every translator gets a place to file a grievance about the English, and no sprint closes with an
unanswered one. Tom, 2026-08-08:

> **Every translator** needs a suggestion box, an ombudsman, and a place to file grievances about
> the working conditions. And the sprint ends with a review of all the problems that surfaced and
> an attempt to resolve them or refer to the human for attention.

## Why this exists

`lpn_` had a Wave 0 — ROADMAP Task 193 reviewed all 226 English keys and rewrote 51 — and it still
shipped "Zoom to fit", "Map display and sizes" and "Restore defaults", all three of which had to be
fixed after Tom read the *Spanish* and saw the meaning had gone wrong.

A review pass asks *"is this string good?"* Read alone, in English, by a fluent English reader,
those three all answer **yes**. Fluency resolves ambiguity automatically and invisibly, which makes
a fluent reader structurally blind to this exact class of defect. **Wave 0 was not skipped; Wave 0
was not falsifiable.**

Wave 1 was supposed to feed back to English and never did — because "feeds back" was an intention
with no artifact and no gate. This directory is the artifact. `friction_check.php` is the gate.

## One file per sprint

`dev/english-friction/<sprint-id>.json`, e.g. `146.06-lpn.json`. Both waves write to the same file:

- **Wave 0 (before)** — the adversarial English pass files an entry for every string with more than
  one plausible reading. Open entries **block the sprint launch**.
- **Every translator, every wave (during)** — any agent may file an entry about any English string
  it had to guess at. Open entries **block the sprint close**.

## Entry format

```json
{
  "key": "lpn_tool_zoom_extent",
  "source": "wave0",              // wave0 | translator
  "lang": null,                    // translator entries name their language
  "complaint": "\"fit\" never says WHAT is fitted",
  "readings": ["fit the window to the drawing", "adjust the zoom by some amount"],
  "disposition": "intent",         // open | english | intent | glossary | dismissed | refer-to-human
  "resolution": "English kept (established idiom); intent added with synonyms."
}
```

`disposition` is the whole point. `open` means nobody has answered the translator yet.

- `english` — the English string was rewritten (an English reader stumbled too)
- `intent` — English kept, `$ec_lang_intent` given synonyms (only the translator was stuck)
- `glossary` — routed to a `glossary.json` concept (it recurs across labels)
- `dismissed` — not a defect; `resolution` must say why
- `refer-to-human` — real, but not the AI's call. **This does not close.** It is the ombudsman
  escalating, and it stays visible until Tom rules on it.

See CLAUDE.md "Routing rule: English, intent, or glossary?" for how to choose.

## Usage

```
php dev/scripts/friction_check.php                     # every sprint, summary
php dev/scripts/friction_check.php --sprint=146.06-lpn # one sprint, detail
```

Exits non-zero if any entry is `open` or `refer-to-human`. That non-zero is the gate.
