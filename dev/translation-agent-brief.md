# Translation sprint 251 — `lpn_` promotion + consent/privacy/terms

You are translating the EngCalcs hydraulic-engineering calculator suite into ONE language.
Repo root: `~/webdev/hawsedc.com/engcalcs`

## Your two files

- **Payload (read):** `dev/translation_payloads/payload_<LANG>.json`
- **Language file (edit):** `lib/lang.ec.<LANG>.php`

Read the payload FIRST and in full. It is self-describing and carries everything below in
machine form: `keys_to_translate`, `glossary`, `key_context`, `key_syn`, `key_notes`,
`key_concepts`, and `meta.*_notes`, which say how to use each one.

## What to translate

**Exactly the keys in `keys_to_translate`, and nothing else.** Do not touch any key already in
the language file. Do not translate keys listed in `meta.exempt_keys` — those are correctly
identical to English on purpose.

Most of these keys are **absent** from your language file, not blank. Append them as new lines
at the end of the file (the file has no closing `?>`). **Check `key_context[key].reason` first:**
`blank`, `equal_to_english` and `english_changed` keys are already in your file and are
**replaced in place**, never appended (`meta.reason_notes`). Order does not matter — the orchestrator
runs `lang_key_order_normalizer.php` afterward.

## What this batch is

- **`lpn_*`** — the Looped Pipe Network calculator: a canvas/map editor for water distribution
  networks. Menus, toolbar tools, file open/save, EPANET `.inp` import messages, solver
  diagnostics, settings. Register: a professional desktop CAD/GIS application, not a web page.
  Be consistent — `lpn_menu_*`, `lpn_tool_*`, `lpn_file_*` are sibling sets and should read as
  one coherent menu system.
- **`consent_*`, `privacy_link`, `terms_link`** — the cookie-consent banner. Plain, calm,
  non-legalistic. See the special note on the two "Accept" buttons below.

## The three identity strings, if they appear in your payload

`lpn_main_menu`, `lpn_main_title`, `lpn_main_desc` are the calculator's **name** — the navbar
item, the `<title>` tag, and the page's one-line description. They were just rewritten in
English and need retranslating from the new wording.

- **`lpn_main_menu` is a navbar item competing for width with every sibling.** Keep it as short
  as your language allows. Prefer the shortest natural phrase over the most explanatory one.
- **"EPANET" is a proper noun — a US EPA software package. Never translate or transliterate it.**
  Leave the six letters exactly as they are, including in right-to-left scripts.
- **Translate "water distribution network" / "water supply network" with the phrase your
  language's water utilities and civil engineers actually use** for a municipal piped water
  system. This is the phrase people would search for. Do not calque the English word order if
  your language has its own established term.
- "Free Online" means free of charge and usable in a browser. If "free" is ambiguous in your
  language between "no cost" and "unrestricted", choose the no-cost sense here.

## Hard format rules (these are enforced by a validator; violations fail the build)

1. **Single quotes only.** `$ec_lang['key']='value';` — never double quotes. An apostrophe
   inside the text is escaped as `\'`. This matters in French, Italian, Catalan-style
   elisions, and anywhere else an apostrophe is normal punctuation.
2. **Never write an HTML entity.** Use the literal UTF-8 character: `—` not `&mdash;`, `×` not
   `&times;`, `≈` not `&asymp;`, `²` not `&sup2;`, `&` not `&amp;`, `“ ”` not `&quot;`,
   `<`/`>` not `&lt;`/`&gt;`. No exceptions, in any key.
3. **No HTML tags anywhere in this batch.** None of these English strings contain a tag, so
   none of your translations should either. Do not add `<br>`, `<b>`, `<sub>` or anything else.
4. **Preserve every `{placeholder}` token exactly**, spelled identically to the English:
   `{file}`, `{name}`, `{id}`, `{n}`, `{nodes}`, `{links}`, `{units}`, `{x}`, `{y}`,
   `{opened}`, `{closed}`. Same set, same spelling, same count. You may move them to wherever
   your language's word order needs them — that is the point of them — but never rename,
   translate, drop, or duplicate one.
5. **Keep variable symbols and unit tokens exactly as in English** — `Q`, `v`, `H`, `D`,
   `h_f`, `psi`, `m`, `ft`, `L/s`, `gpm`. This holds in right-to-left scripts too.
6. **Never add, change, or remove a `$ec_lang_syn` entry.** That array is human-authored
   English translator guidance. It is not yours to edit, in any file, for any reason.

## Terminology

- `glossary` lists the technical terms this batch's strings use, with the **preferred
  translation** for this language, what each MEANS, and what NOT to render it as. Use the
  preferred translations. **A DO NOT entry forbids a physical/structural error or a lazy transliteration — it never
  forbids a term that is genuinely your language's dominant standard.** We defer to your
  language's own professional convention; we are not the judges of your terminology.
- **Do not phonetically transliterate an English technical word** when a real term exists in
  your language. If your language's engineers genuinely use the English loanword, that is
  fine and correct — but reaching for a transliteration because the concept is hard is the
  single most common defect in past sprints.
- `key_syn`, when present, gives alternate English wordings of that label. Any of them could
  stand on the control. Pick whichever re-compresses most naturally in your language; you are
  not bound to the literal English wording.
- `key_notes`, when present, are instructions about that one string (how much room it has, a
  sense it must not be read in, symbols to keep). Obey them; never put them in your file.
- `key_context.tip` / `key_context.label` pair a label with its help text. Read them together.
- `key_context.neighbors` shows the already-translated strings on either side. Use them to
  match the register and vocabulary of the existing file — your work must read as the same
  translator's voice, not a bolt-on.

## One thing that is easy to get wrong in this batch

The consent banner has **three** buttons: `consent_decline` ("Refuse all"), `consent_accept`
("Allow this"), `consent_accept_all` ("Allow all"). The two "Allow" answers differ in
**time, not in amount** — this is NOT the usual cookie-banner "accept all categories", and
"Refuse all" likewise means "no, now and later", not "no to every category":

- `consent_accept` = allow **this particular ask**; the visitor is asked again if the request
  materially changes.
- `consent_accept_all` = allow this **and any later ask**; never ask me again.
- `consent_decline` = refuse this **and any later ask**; never ask me again.

Their `key_syn` entries spell this out. Translate the temporal distinction, and make sure the
two labels are visibly different from each other in your language. Keep both short — they sit
side by side on three buttons competing for width.

## Write incrementally — this is the most important instruction here

**Append your translations to the language file in batches of about 50 keys, saving each batch
before you translate the next one.** Do not compose all 289 in memory and write them at the end.

This run may be interrupted at any moment by an account limit you cannot see coming. When that
happens to an agent that saved nothing, every token it spent is lost and the whole language must
be redone from zero. When it happens to an agent that has been saving as it goes, the work
already on disk is kept and only the remainder is re-run. In the previous attempt, one language
survived purely because its write happened to land before the interruption, and a dozen others
lost everything at the same step.

So: translate ~50 keys, append them, translate the next ~50, append them, and so on. Verify at
the end as described below. A partially finished file is genuinely useful; a perfect file that
was never written is worth nothing.

## Do not use git

**Edit your language file and stop there. Do not `git add`, `git commit`, `git push`, `git
stash`, `git checkout`, or `git reset`.** Twenty-five other agents are editing sibling files in
this same working tree at the same time. A commit races them, a broad `git add` sweeps up their
half-written work, and a failed push invites a force-push that would destroy it. The orchestrator
commits everything once, after verifying it. If you think you need git, you do not — report
instead.

## Before you report back

Re-read your own output and confirm: every key in `keys_to_translate` is present exactly once;
single quotes with `\'` escaping; no HTML entities; no tags; every `{placeholder}` intact.

## Suggestion box — file a grievance about the English

**Read `suggestion_box` in your payload and follow it.** It is part of your instructions, not a
footnote.

This section used to carry its own copy of that text. It does not any more, and that is the point:
`generate_translation_payloads.php` extracts the one canonical block from
`dev/translation-process.md` into every payload (Task 239), so a brief that retyped it would drift
from what the agents are actually told and nobody would be able to say which copy was current.

## Final report

State: your language code, the number of keys added, and any term where you made a
judgement call worth recording in the glossary (what you chose and why). Then the
FRICTION JSON array.
