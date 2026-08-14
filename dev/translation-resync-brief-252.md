# Sprint 252 — resync: "EPANET engine" became "EPANET solver"

You are updating the EngCalcs hydraulic-engineering calculator suite in ONE language.
Repo root: `/var/www/cnm/public_html/hawsedc/engcalcs`

**This is a RESYNC, not a new translation.** All five keys below already exist in your language
file with a translation. Their **English changed**, so the existing translations are now stale.
Your job is to update those five values in place.

## Your file

`lib/lang.ec.<LANG>.php` — edit it directly. English source for reference: `lib/lang.ec.en.php`.

## What changed and why

The English word **"engine"** was replaced by **"solver"** in every one of these strings.

The reason matters for your translation. In many languages "engine" is naturally rendered with the
word for a **motor** (Spanish *motor*, French *moteur*, Italian *motore*, Portuguese *motor*) —
which is perfectly correct for software in general. But **this calculator models water networks
containing PUMPS**, and a pump has a real, physical motor. So on this page the software sense
collides with a hydraulic component sitting a few labels away, and a reader can genuinely be unsure
which is meant.

So: **do not translate "solver" with your language's word for a physical motor or engine.**
Prefer the word your language uses for *the part of a program that computes the answer* — a solver,
a computation core, a calculation module. Russian already does this well with *расчётное ядро*
(computation core). If your language's engineers naturally say "motor" for software and there is no
better option, that is acceptable — but only if nothing better exists, because of the pump problem.

"EPANET" is a proper noun (a US EPA software package). **Never translate or transliterate it**,
in any script, including right-to-left ones.

## The five keys

| Key | New English |
|---|---|
| `lpn_main_title` | Free Online Water Distribution Network Calculator with the EPANET Solver |
| `lpn_settings_engine_epanet` | Solve with the EPANET solver |
| `lpn_settings_engine_epanet_tip` | Runs EPANET's own solver from the US EPA, here in your browser. The built-in solver gives the same answers and is faster, so leave this off unless you need EPANET itself. |
| `lpn_engine_loading` | Loading the EPANET solver… |
| `lpn_engine_failed` | The EPANET solver could not be loaded. Showing the built-in solver instead. |

Read the current English in `lib/lang.ec.en.php` as the authority — the table above is a summary.

Notes on the harder ones:

- **`lpn_main_title`** is the `<title>` tag. Keep your file's existing title pattern (most languages
  use "Free Online … Calculator"); only the engine/solver part needs rethinking. Keep the rest of
  your existing translation if it is good — this is a surgical edit, not a rewrite.
- **The tip contrasts TWO solvers**: EPANET's own, and this site's built-in one. That contrast is
  the whole point of the sentence, so both must be recognisable as solvers in your language, and
  distinguishable from each other. "leave this off" refers to a checkbox.
- **`lpn_engine_failed`** is an error message shown to a user whose EPANET solver did not load; the
  built-in one is used instead. Calm and factual, not alarming.

The key NAMES still contain "engine" (`lpn_settings_engine_epanet`, `lpn_engine_loading`). That is
internal naming only — ignore it and translate the VALUES, which say solver.

## Hard format rules (a validator enforces these; violations fail the build)

1. **Single quotes only.** `$ec_lang['key']='value';` — never double quotes. An apostrophe inside
   the text is escaped `\'`. This bites in French, Italian, and anywhere else an apostrophe is
   ordinary punctuation.
2. **Never write an HTML entity.** Literal UTF-8 only: `—` not `&mdash;`, `…` not `&hellip;`,
   `&` not `&amp;`.
3. **No HTML tags** — none of these five English strings contains one, so neither should yours.
4. **Do not touch any other key**, and **never** add, change or remove a `$ec_lang_syn` entry —
   that array is human-authored guidance and is not yours to edit.
5. Keep the ellipsis character `…` in `lpn_engine_loading` if your language uses one.

## Do not use git

Edit your language file and stop. Do not `git add`, `commit`, `push`, `stash`, `checkout` or
`reset`. Twenty-five other agents are editing sibling files in this same working tree right now.
The orchestrator commits once, after verifying. If you think you need git, you do not — report.

## Before you report

Confirm all five keys are present exactly once, single-quoted with `\'` escaping, no entities, no
tags, and that `php -l lib/lang.ec.<LANG>.php` is clean.

## Suggestion box — file a grievance about the English

If any English string made you guess, file it. You are the only person who will notice, and a
string that made you guess will make the next 25 translators guess too. File an entry when: the
English has more than one plausible reading; a word's intended sense is not its most common sense;
a term maps onto a dangerous second sense in your language; or a claim in the text looks false.

Report as a JSON array, separate from your prose:

FRICTION: [
  {"key": "<lang key>", "complaint": "<what made you guess, in one sentence>",
   "readings": ["<reading you chose>", "<reading you rejected>"]}
]

An empty array is a fine and useful answer. Do not invent entries — a false one costs a human's
attention. But do not stay quiet to be agreeable either.

## Final report

State your language code, which of the five keys you changed, **the word you chose for "solver"
and why** (this is the one terminology decision that matters here and it goes into the glossary),
and then the FRICTION array.
