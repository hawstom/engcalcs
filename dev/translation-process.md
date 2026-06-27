Translation Process — Use with Claude and Copilot

Goals
- Produce accurate translations for `lib/lang.ec.*.php` files using Claude for bulk translation and Copilot for in-editor assistance.
- Minimize agent overhead by providing structured, repeatable payloads and short status summaries.

Overview
1. Extract English keys and values from `lib/lang.ec.en.php`.
2. Generate one payload per target language containing the English key/value block and instructions.
3. Spawn one agent per language with the payload (Claude style). Announce: "Starting N agents, one for each language."
4. Collect results into `lib/lang.ec.XX.php` files and run a reviewer pass.

Intent authoring standard (`$ec_lang_intent` in `lib/lang.ec.en.php`)
- Purpose: include only disambiguation a skilled but non-technical translator could plausibly get wrong without context.
- Keep intent minimal and high-signal. Intent is a supplement to the English source string, not a rewrite of it.
- Default value: use empty string (`''`) for `ec_lang_intent[key]` to mean "no comment".
- Add non-empty intent only when translation risk is observed (for example poor outputs or reverse-translation spot checks).
- Good intent content:
	- Noun-stack grammatical expansion when English stacks modifiers densely.
	- Ambiguous-word synonym clarification (one or more options if needed).
	- Ambiguous proper-name clarification (example: Robinson is an attribution/method name, not a place).
	- Cryptic jargon expansion when the term is likely to be mistranslated.
- Style rules for non-empty intent:
	- Use terse plain text, not metadata labels.
	- Do not prepend scaffolding such as "Page title for" or "Menu entry for".
	- Use parenthetical negatives like "(not ...)" only when truly needed.
	- Keep each comment decision-focused; avoid long explanations or teaching prose.

Scripts
- `scripts/generate_translation_payloads.php` — extracts keys and creates JSON payloads.

Agent prompt template (example)

"You are a professional translator for technical hydraulic engineering calculators. Given this JSON of English keys and values, produce a PHP file content for `lib/lang.ec.{lang}.php` where each $ec_lang['key'] is the translated string. Preserve HTML tags and inline markup exactly. Keep code comments and any units unchanged. Leave values identical where translation is not required. Return only the PHP file contents without extra explanation."

Minimal agent status summary template (1–2 lines)
- "Completed X/Y keys; need review for N keys with technical terms: [list]."

Reviewer workflow (human + Copilot)
- Open the generated `lib/lang.ec.{lang}.php` in the `Claude-Translation` profile.
- Use Copilot in `Copilot-Coding` profile for quick fixes and small edits (enable Copilot there).
- Review: check units, HTML tags, and technical terms. Use a two-pass approach: 1) spelling/HTML, 2) domain accuracy.

Reducing "where are we" overhead (meta-script)
- Always include a one-line progress summary with counts in agent outputs.
- Use the payload generator to include a small `meta` section with `expected_key_count`, `completed` flag, and `notes` field.

Change tracking
- Use git branches per language: `i18n/es`, `i18n/fr`, etc. Commit each language file separately with clear commit messages.

Safety
- Keep a backup of original `lib/lang.ec.*.php` files before overwriting.

Next steps
- Run `php scripts/generate_translation_payloads.php` to produce payloads in `translation_payloads/`.
