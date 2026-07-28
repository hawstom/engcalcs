<?php
/**
 * Shared reader for translation_exempt_keys.json.
 *
 * Keys listed there are CORRECTLY byte-identical to the English source (symbols,
 * eponyms, brand names, coincidental cognates), so counting them as untranslated
 * put a permanent floor under every "keys outstanding" number in the suite --
 * ROADMAP Task 161. Four scripts computed that number independently
 * (generate_translation_payloads, lang_parity_check, translation_completion_matrix,
 * lang_syntax_validate); they share this loader so they cannot drift apart, and so
 * the classification lives in one reviewable file instead of being re-derived by
 * hand at each sprint proposal.
 *
 * Exemption means "identical is allowed here". It never means "this key needs no
 * value" -- callers must still report an exempt key that is missing or blank.
 */

const EC_EXEMPT_KEYS_PATH = __DIR__ . '/translation_exempt_keys.json';

/**
 * Returns key => ('*' | list of language codes). Fails loudly rather than
 * returning an empty map: a silently-unloaded list would restore the false
 * positives this file exists to remove.
 */
function ecLoadExemptMap(?string $path = null): array
{
    $path = $path ?? EC_EXEMPT_KEYS_PATH;

    if (!file_exists($path)) {
        fwrite(STDERR, 'ERROR: exempt-key file not found: ' . $path . "\n");
        exit(1);
    }

    $decoded = json_decode((string)file_get_contents($path), true);
    if (!is_array($decoded) || !isset($decoded['exempt']) || !is_array($decoded['exempt'])) {
        fwrite(STDERR, 'ERROR: invalid exempt-key JSON (missing "exempt" object): ' . $path . "\n");
        exit(1);
    }

    $map = [];
    foreach ($decoded['exempt'] as $key => $entry) {
        $langs = is_array($entry) ? ($entry['languages'] ?? null) : null;
        if ($langs === '*') {
            $map[$key] = '*';
        } elseif (is_array($langs) && count($langs) > 0) {
            $map[$key] = array_values($langs);
        } else {
            fwrite(STDERR, "ERROR: exempt key '{$key}' must set \"languages\" to \"*\" or a non-empty array: {$path}\n");
            exit(1);
        }
    }

    return $map;
}

/**
 * True when this key may legitimately be byte-identical to English in this
 * language. Consult only for the equal-to-English case.
 */
function ecIsExemptFromEnglishEquality(string $key, string $lang, array $exemptMap): bool
{
    if (!array_key_exists($key, $exemptMap)) {
        return false;
    }
    $langs = $exemptMap[$key];
    return $langs === '*' || in_array($lang, $langs, true);
}

/**
 * True when a key's English value is inherently universal (unit tokens, single-letter
 * variable names) and must never be flagged as untranslated. This is the heuristic
 * companion to the explicit exempt list above: the list names individual keys, this
 * covers two whole prefixes whose values are symbols by construction.
 *
 * u_ prefix rule: no consecutive letter run >= 4 chars.
 *   Passes: "ft", "cfs", "kWh/yr", "ft H2O", "sec", "gpm" (all <= 3 alpha chars).
 *   Fails: "fraction" (8), "rise/run" (rise=4) -- correctly sent for translation.
 *
 * mi_ prefix rule: 1-2 alphanumeric chars after stripping HTML tags.
 *   Passes: 'Q', 'Fr', 'P<sub>w</sub>'->"Pw", 'R<sub>h</sub>'->"Rh", 'H<sub>v</sub>'->"Hv".
 *   Fails: 'Sta' (3), 'Elev' (4), compound strings with real words.
 */
function ecIsUniversalKey(string $key, string $englishValue): bool
{
    $parts = explode('_', $key, 2);
    $prefix = $parts[0] ?? '';

    if ($prefix === 'u') {
        return !preg_match('/[a-zA-Z]{4}/', $englishValue);
    }
    if ($prefix === 'mi') {
        $stripped = preg_replace('/<[^>]+>/', '', $englishValue);
        return (bool) preg_match('/^[a-zA-Z0-9]{1,2}$/', $stripped);
    }

    return false;
}
