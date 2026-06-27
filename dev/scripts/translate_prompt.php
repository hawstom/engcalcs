<?php
/**
 * Translation prompt builder for the Direct-API translation driver.
 *
 * CP includes this file in scripts/translate.php and calls:
 *   buildTranslationPrompt($lang_code, $lang_name, $prefix, $delta_strings, $payload)
 *   parseTranslationResponse($response_text)
 *
 * Payload fields consumed (from generate_translation_payloads.php output):
 *   $payload['prompt_context_by_prefix'][$prefix]  — plain-text term summary for this prefix
 *   $payload['glossary_terms_by_prefix'][$prefix]  — array of term objects with preferred_translation
 *   $payload['key_context'][$key]                  — neighboring translated strings for register consistency
 *   $payload['key_intent'][$key]                   — expanded semantic intent for ambiguous strings
 *
 * API parameters (pass these to the Anthropic messages endpoint):
 *   model:       TRANSLATE_MODEL (claude-haiku-4-5-20251001)
 *   max_tokens:  TRANSLATE_MAX_TOKENS (1500 for a typical 20-50 string prefix batch)
 *   temperature: TRANSLATE_TEMPERATURE (0 — deterministic for consistency)
 *   system:      TRANSLATE_SYSTEM_PROMPT
 *   messages:    [['role'=>'user','content'=> buildTranslationPrompt(...)]]
 */

define('TRANSLATE_MODEL',       'claude-haiku-4-5-20251001');
define('TRANSLATE_MAX_TOKENS',  1500);
define('TRANSLATE_TEMPERATURE', 0);
define('TRANSLATE_SYSTEM_PROMPT',
    'You are a technical translator for hydraulic engineering software. ' .
    'You produce precise, formal translations suitable for engineering field workers. ' .
    'You never add commentary, never skip strings, and never alter PHP syntax.'
);

/**
 * Build the user-turn prompt for one language + one calculator prefix batch.
 *
 * @param string $lang_code      Two-letter code, e.g. 'es'
 * @param string $lang_name      English name of language, e.g. 'Spanish'
 * @param string $prefix         Calculator prefix, e.g. 'dw'
 * @param array  $delta_strings  Assoc array [key => english_value] of strings needing translation
 * @param array  $payload        Full decoded payload JSON for this language
 * @return string                Complete prompt to send as the user message
 */
function buildTranslationPrompt(
    string $lang_code,
    string $lang_name,
    string $prefix,
    array  $delta_strings,
    array  $payload
): string {
    $parts = [];

    // --- Header ---
    $parts[] = "Translate the following PHP language strings from English to {$lang_name} ({$lang_code}).";
    $parts[] = "These are labels and descriptions for hydraulic engineering calculators used in irrigation and water resources.";

    // --- Glossary context (plain-text summary, already formatted by CP's payload generator) ---
    $context = $payload['prompt_context_by_prefix'][$prefix] ?? '';
    if ($context !== '') {
        $parts[] = '';
        $parts[] = 'PREFERRED TECHNICAL TERM TRANSLATIONS:';
        $parts[] = $context;
    }

    // --- Glossary details (term objects, for any term with a non-empty preferred_translation) ---
    $terms = $payload['glossary_terms_by_prefix'][$prefix] ?? [];
    $preferred = [];
    foreach ($terms as $entry) {
        $termName = trim((string)($entry['term'] ?? ''));
        $preferredTranslation = trim((string)($entry['preferred_translation'] ?? ''));
        if ($termName !== '' && $preferredTranslation !== '') {
            $preferred[] = "  {$termName} => {$preferredTranslation}";
        }
    }
    if ($preferred) {
        $parts[] = '';
        $parts[] = 'PREFERRED TERM MAP (use these exact renderings where applicable):';
        foreach ($preferred as $line) {
            $parts[] = $line;
        }
    }

    $detailed = [];
    foreach ($terms as $entry) {
        if (!empty($entry['translation_notes'])) {
            $detailed[] = "  [{$entry['term']}] {$entry['translation_notes']}";
        }
    }
    if ($detailed) {
        $parts[] = '';
        $parts[] = 'TERM NOTES (use when ambiguity exists):';
        foreach ($detailed as $note) {
            $parts[] = $note;
        }
    }

    // --- Rules ---
    $parts[] = '';
    $parts[] = 'RULES:';
    $parts[] = "1. Return ONLY valid PHP array assignment lines, one per line, in this exact format:";
    $parts[] = "   \$ec_lang['key']='translated value';";
    $parts[] = "2. Never translate or alter the array key name inside the brackets.";
    $parts[] = "3. Preserve all HTML tags, HTML entities, and inline CSS exactly as given.";
    $parts[] = "4. Preserve mathematical symbols, variable names (Q, v, n, S, D, f, etc.), and unit strings.";
    $parts[] = "5. Preserve proper nouns: Manning, Darcy-Weisbach, Hazen-Williams, Robinson, Isbash, etc.";
    $parts[] = "6. Use formal engineering register — no colloquial language.";
    $parts[] = "7. Use literal UTF-8 characters for special symbols (—, ≥, ≤, ×, etc.) — never HTML entities.";
    $parts[] = "8. Single-quote the value. Escape any literal single quote inside the value as \\'.";
    $parts[] = "9. If an intent note is provided for a key, prioritize that intended meaning over literal word-by-word translation.";
    $parts[] = "10. Do not add comments, blank lines, or any text outside the PHP assignment lines.";

    // --- Strings to translate ---
    $parts[] = '';
    $parts[] = 'STRINGS TO TRANSLATE:';
    $keyContext = $payload['key_context'] ?? [];
    foreach ($delta_strings as $key => $value) {
        // Escape single quotes in the English value so the example is syntactically valid
        $escaped = str_replace("'", "\\'", $value);

        $intent = trim((string)($payload['key_intent'][$key] ?? ''));
        if ($intent !== '') {
            $intent = preg_replace('/\s+/', ' ', $intent);
            $parts[] = "# Intent for {$key}: {$intent}";
        }

        $ctx = $keyContext[$key] ?? null;
        if (is_array($ctx)) {
            $neighbors = $ctx['neighbors'] ?? [];
            $prev = $neighbors['previous_translated'] ?? null;
            $next = $neighbors['next_translated'] ?? null;
            if (is_array($prev)) {
                $parts[] = "# Context previous {$prev['key']}: " . (string)($prev['value'] ?? '');
            }
            if (is_array($next)) {
                $parts[] = "# Context next {$next['key']}: " . (string)($next['value'] ?? '');
            }
        }

        $parts[] = "\$ec_lang['{$key}']='{$escaped}';";
    }

    return implode("\n", $parts);
}

/**
 * Parse the API response text into an assoc array [key => translated_value].
 *
 * Accepts lines matching: $ec_lang['key']='value';
 * Ignores blank lines, PHP tags, and comments.
 * Logs unrecognised lines to STDERR so CP can spot issues.
 *
 * @param string $response_text  Raw text content from the API response
 * @return array                 [key => translated_value]
 */
function parseTranslationResponse(string $response_text): array {
    $results = [];
    $lines = explode("\n", $response_text);

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line === '<?php' || $line === '?>') continue;
        if (str_starts_with($line, '//')) continue;

        // Match: $ec_lang['some_key']='any value including escaped \' chars';
        if (preg_match("/^\\\$ec_lang\['([^']+)'\]\s*=\s*'((?:[^'\\\\]|\\\\.)*)'\s*;$/", $line, $m)) {
            $key   = $m[1];
            $value = stripslashes($m[2]);
            $results[$key] = $value;
        } else {
            fwrite(STDERR, "WARN: unrecognised response line: {$line}\n");
        }
    }

    return $results;
}
