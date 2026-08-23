<?php
/**
 * Translation payload generator.
 *
 * Writes per-language JSON payloads containing only missing/untranslated keys,
 * plus neighboring translated context for tone/register consistency.
 *
 * Keys listed in translation_exempt_keys.json are allowed to be byte-identical to
 * English (symbols, eponyms, brands, cognates) and are not counted as delta, so a
 * delta of zero means zero -- ROADMAP Task 161. They are still reported when
 * missing or blank, and are echoed back in payload['meta']['exempt_keys'].
 *
 * Keys OUT OF SCOPE for a language under translation_coverage.json (ROADMAP Tasks
 * 203/204) are likewise not counted as delta and are not sent to an agent -- a body we
 * have decided not to translate into a non-core language must not be quietly bought
 * anyway by a sprint that could not tell the difference. The count is echoed in
 * payload['meta']['out_of_scope_key_count'] so the suppression stays visible.
 *
 * Optional sibling map support in lib/lang.ec.en.php:
 *   $ec_lang_syn['some_key'] = 'Synonyms and alternate wordings a translator can re-compress';
 * Every phrase must pass the substitution test -- it could stand in the slot as the
 * label itself. Emitted to payload['key_syn'][key]. Renamed from $ec_lang_intent
 * 2026-08-08: "intent" invited description, which is the drift the rename ends.
 *
 * Usage:
 *   php scripts/generate_translation_payloads.php
 *   php scripts/generate_translation_payloads.php --prefix=dw
 *   php scripts/generate_translation_payloads.php --lang=fr,uk --prefix=dw
 *   php scripts/generate_translation_payloads.php /tmp/payloads
 */

const DEFAULT_LANG_DIR = __DIR__ . '/../../lib';
const DEFAULT_OUTPUT_DIR = __DIR__ . '/../../dev/translation_payloads';
const GLOSSARY_PATH = __DIR__ . '/glossary.json';
// The one canonical copy of the translator's suggestion-box instruction (ROADMAP Task 239). It is
// extracted into every payload rather than retyped into every sprint's prompt, because a step that
// has to be remembered per sprint is a step that gets forgotten -- and an agent that never received
// it cannot file the complaint friction_check.php is waiting for.
const SUGGESTION_BOX_SOURCE = __DIR__ . '/../translation-process.md';
const SUGGESTION_BOX_HEADING = '## The suggestion box';
const EN_FILE = DEFAULT_LANG_DIR . '/lang.ec.en.php';
const TARGET_LANGS = [
    'am', 'ar', 'bg', 'bn', 'cs', 'de', 'es', 'fa', 'fr', 'he', 'hi', 'hr', 'id', 'it', 'km', 'my',
    'ps', 'pt', 'ro', 'ru', 'sr', 'sw', 'tr', 'uk', 'ur', 'zh',
];

require_once __DIR__ . '/exempt_keys.inc.php';
require_once __DIR__ . '/prefix_terms.inc.php';
require_once __DIR__ . '/coverage.inc.php';

main($argv);

function main(array $argv): void
{
    $opts = parseArgs($argv);

    if (!file_exists(EN_FILE)) {
        fail('English language file not found: ' . EN_FILE);
    }
    if (!file_exists(GLOSSARY_PATH)) {
        fail('Glossary file not found: ' . GLOSSARY_PATH);
    }
    if (!file_exists(EC_EXEMPT_KEYS_PATH)) {
        fail('Exempt-key file not found: ' . EC_EXEMPT_KEYS_PATH);
    }

    if ($opts['check']) {
        exit(runFreshnessCheck($opts));
    }

    if (!is_dir($opts['output_dir']) && !mkdir($opts['output_dir'], 0755, true) && !is_dir($opts['output_dir'])) {
        fail('Unable to create output directory: ' . $opts['output_dir']);
    }

    $enKeys = loadLangArray(EN_FILE);
    if (count($enKeys) === 0) {
        fail('No keys parsed from English language file.');
    }
    $enIntent = loadEnglishIntentMap(EN_FILE);

    $glossaryData = readJsonFile(GLOSSARY_PATH);
    if (!isset($glossaryData['terms']) || !is_array($glossaryData['terms'])) {
        fail('Invalid glossary JSON structure in: ' . GLOSSARY_PATH);
    }

    $suggestionBox = loadSuggestionBox();
    $exemptMap = ecLoadExemptMap();
    $coverage = ecLoadCoverage();
    $termIndex = termIndexByName($glossaryData['terms']);
    $prefixMap = prefixToTermNames();

    $detectedPrefixes = detectPrefixes($enKeys);
    $activePrefixes = $detectedPrefixes;
    if ($opts['requested_prefix'] !== null) {
        $activePrefixes = array_values(array_filter($activePrefixes, static function ($p) use ($opts) {
            return $p === $opts['requested_prefix'];
        }));

        if (count($activePrefixes) === 0) {
            fail('Requested prefix not found in English keys: ' . $opts['requested_prefix']);
        }
    }

    file_put_contents(
        $opts['output_dir'] . '/lang.en.json',
        json_encode([
            'language' => 'en',
            'keys' => $enKeys,
            'count' => count($enKeys),
            'active_prefixes' => $activePrefixes,
            'requested_prefix' => $opts['requested_prefix'],
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    );

    $langs = resolveTargetLanguages($opts['languages']);
    $generatedCount = 0;
    $exemptTotal = 0;
    $outOfScopeTotal = 0;

    foreach ($langs as $lang) {
        $targetFile = DEFAULT_LANG_DIR . "/lang.ec.{$lang}.php";
        if (!file_exists($targetFile)) {
            fwrite(STDERR, "WARN: target language file missing, skipping: {$targetFile}\n");
            continue;
        }

        $current = loadLangArray($targetFile);
        [$deltaKeys, $keyContext, $exemptKeys, $outOfScopeKeys] =
            collectDeltaAndContext($enKeys, $current, $activePrefixes, $lang, $exemptMap, $coverage);
        $keySyn = collectKeySyn($deltaKeys, $enKeys, $enIntent);
        $exemptTotal += count($exemptKeys);
        $outOfScopeTotal += count($outOfScopeKeys);

        $prefixesInDelta = detectPrefixes($deltaKeys);
        $prefixGlossary = buildPrefixGlossary($prefixesInDelta, $termIndex, $prefixMap);

        $promptByPrefix = [];
        $termsByPrefix = [];
        foreach ($prefixGlossary as $prefix => $terms) {
            $promptByPrefix[$prefix] = buildPromptContext($terms, $lang);
            $termsByPrefix[$prefix] = array_map(static function ($term) use ($lang) {
                return [
                    'term' => $term['term'] ?? '',
                    'symbol' => $term['symbol'] ?? '',
                    'context' => $term['context'] ?? '',
                    'translation_notes' => $term['translation_notes'] ?? '',
                    'preferred_translation' => $term['translations'][$lang] ?? '',
                ];
            }, $terms);
        }

        $payload = [
            'meta' => [
                'language' => $lang,
                'expected_key_count' => count($enKeys),
                'delta_key_count' => count($deltaKeys),
                // Keys that equal English legitimately (symbols, eponyms, brands, cognates) and were
                // therefore NOT counted as delta. Listed so the suppression is visible and auditable
                // rather than silent. See translation_exempt_keys.json (ROADMAP Task 161).
                'exempt_key_count' => count($exemptKeys),
                'exempt_keys' => $exemptKeys,
                // Keys this language is deliberately not being asked to translate, per the
                // coverage declaration (ROADMAP Tasks 203/204). Counted, not sent. Distinct
                // from exempt above: exempt means finished, this means not started by choice.
                'out_of_scope_key_count' => count($outOfScopeKeys),
                'coverage' => ecCoverageSummary($coverage),
                'active_prefixes' => $prefixesInDelta,
                'requested_prefix' => $opts['requested_prefix'],
                'notes' => 'Translate only keys in keys_to_translate; preserve HTML, units, and symbols.',
                'glossary_injection_notes' => 'Use prompt_context_by_prefix and glossary_terms_by_prefix.preferred_translation when available.',
                'context_notes' => 'Use key_context.neighbors to keep register consistent with nearby translated strings.',
                'syn_notes' => 'Use key_syn when present; these entries provide terse disambiguation comments only where translation risk exists.',
                'suggestion_box_notes' => 'Read suggestion_box and follow it. It is part of your instructions, not a footnote: a sprint does not close while a translator complaint is unanswered.',
            ],
            // ROADMAP Task 239. Extracted verbatim from dev/translation-process.md so it reaches
            // every agent, every language, every batch size, without being retyped per sprint.
            'suggestion_box' => $suggestionBox,
            'prompt_context_by_prefix' => $promptByPrefix,
            'glossary_terms_by_prefix' => $termsByPrefix,
            'keys_to_translate' => $deltaKeys,
            // Backward-compatibility for scripts that still expect payload["keys"].
            'keys' => $deltaKeys,
            'key_context' => $keyContext,
            'key_syn' => $keySyn,
        ];

        file_put_contents(
            $opts['output_dir'] . "/payload_{$lang}.json",
            json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
        $generatedCount++;
    }

    echo "Generated {$generatedCount} payload files in: {$opts['output_dir']}\n";
    echo 'Active prefixes: ' . implode(', ', $activePrefixes) . "\n";
    echo "Exempt (correctly identical to English, not counted as delta): {$exemptTotal} across all languages.\n";
    echo "Out of scope (deliberately untranslated per the coverage declaration): {$outOfScopeTotal} across all languages.\n";
    echo ecCoverageSummary($coverage) . "\n";
}

function parseArgs(array $argv): array
{
    $opts = [
        'output_dir' => DEFAULT_OUTPUT_DIR,
        'requested_prefix' => null,
        'languages' => [],
        'check' => false,
    ];

    $positionals = [];
    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];
        if ($arg === '--check') {
            $opts['check'] = true;
            continue;
        }
        if (strpos($arg, '--prefix=') === 0) {
            $opts['requested_prefix'] = trim(substr($arg, strlen('--prefix=')));
            continue;
        }
        if (strpos($arg, '--lang=') === 0) {
            $opts['languages'] = splitCsv(substr($arg, strlen('--lang=')));
            continue;
        }
        if ($arg === '--help' || $arg === '-h') {
            printHelpAndExit();
        }
        if (strpos($arg, '--') === 0) {
            fail('Unknown option: ' . $arg);
        }
        $positionals[] = $arg;
    }

    if (isset($positionals[0])) {
        $opts['output_dir'] = $positionals[0];
    }
    if ($opts['requested_prefix'] === null && isset($positionals[1])) {
        $opts['requested_prefix'] = trim($positionals[1]);
    }

    if ($opts['requested_prefix'] === '') {
        $opts['requested_prefix'] = null;
    }

    return $opts;
}

function printHelpAndExit(): void
{
    echo "Usage: php scripts/generate_translation_payloads.php [output_dir] [prefix]\n";
    echo "       php scripts/generate_translation_payloads.php --lang=fr,uk --prefix=dw\n";
    echo "       php scripts/generate_translation_payloads.php --check   (verify payloads are up to date; exit 1 if stale)\n";
    exit(0);
}

/**
 * Freshness gate for sprint launchers. A payload is stale if it is older than any
 * of its inputs: the English source, that language's lang file, the glossary, or
 * this generator itself, or the exempt-key list (which changes what counts as delta).
 * Prints a FRESH/STALE verdict and returns a shell exit
 * code (0 = fresh, 1 = stale/missing) so a sprint cannot launch on an old delta
 * without a human ever having to remember to regenerate.
 */
function runFreshnessCheck(array $opts): int
{
    $commonInputs = [
        EN_FILE, GLOSSARY_PATH, EC_EXEMPT_KEYS_PATH, __DIR__ . '/exempt_keys.inc.php',
        // The coverage declaration changes what counts as delta just as surely as the
        // exempt list does, so editing it must make every payload stale.
        EC_COVERAGE_PATH, __DIR__ . '/coverage.inc.php',
        // The prefix->terms map decides which glossary entries reach an agent at all, so editing
        // it changes every payload's content. It lives in its own include as of 2026-08-12 and
        // therefore has to be named here -- __FILE__ alone stopped covering it that day.
        __DIR__ . '/prefix_terms.inc.php',
        // Every payload carries the suggestion-box block copied out of the SOP, so editing that
        // block changes every payload's content and must make them stale.
        SUGGESTION_BOX_SOURCE,
        __FILE__,
    ];
    $commonNewest = 0;
    foreach ($commonInputs as $f) {
        $commonNewest = max($commonNewest, (int) @filemtime($f));
    }

    $langs = resolveTargetLanguages($opts['languages']);
    $stale = [];
    $checked = 0;

    foreach ($langs as $lang) {
        $targetFile = DEFAULT_LANG_DIR . "/lang.ec.{$lang}.php";
        if (!file_exists($targetFile)) {
            continue; // no source to translate; generation would skip it too
        }
        $checked++;

        $payloadFile = $opts['output_dir'] . "/payload_{$lang}.json";
        if (!file_exists($payloadFile)) {
            $stale[] = "{$lang}: payload missing";
            continue;
        }

        $inputs = array_merge($commonInputs, [$targetFile]);
        $newestInput = max($commonNewest, (int) @filemtime($targetFile));
        if ((int) filemtime($payloadFile) < $newestInput) {
            $stale[] = "{$lang}: " . newestInputName((int) filemtime($payloadFile), $inputs);
        }
    }

    if (count($stale) === 0) {
        echo "FRESH: all {$checked} payload(s) are current with lang files, glossary, and generator.\n";
        return 0;
    }

    fwrite(STDERR, 'STALE: ' . count($stale) . " of {$checked} payload(s) are out of date:\n");
    foreach ($stale as $s) {
        fwrite(STDERR, "  - {$s}\n");
    }
    fwrite(STDERR, 'Fix before launching a sprint: php ' . basename(__FILE__) . "\n");
    return 1;
}

/**
 * Names the newest input file that post-dates the payload, for an actionable
 * stale message (e.g. "lang.ec.en.php is newer").
 */
function newestInputName(int $payloadMtime, array $inputs): string
{
    $name = '';
    $best = $payloadMtime;
    foreach ($inputs as $f) {
        $m = (int) @filemtime($f);
        if ($m > $best) {
            $best = $m;
            $name = basename($f);
        }
    }
    return $name !== '' ? "{$name} is newer" : 'stale';
}

function splitCsv(string $value): array
{
    $parts = array_filter(array_map('trim', explode(',', $value)), static function ($v) {
        return $v !== '';
    });
    return array_values(array_unique($parts));
}

function readJsonFile(string $path): array
{
    $raw = file_get_contents($path);
    if ($raw === false) {
        fail('Unable to read JSON file: ' . $path);
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        fail('Invalid JSON in file: ' . $path);
    }
    return $decoded;
}

function resolveTargetLanguages(array $requested): array
{
    if (count($requested) === 0) {
        return TARGET_LANGS;
    }

    $filtered = array_values(array_filter(TARGET_LANGS, static function ($lang) use ($requested) {
        return in_array($lang, $requested, true);
    }));

    if (count($filtered) === 0) {
        fail('No target languages matched --lang filter.');
    }

    return $filtered;
}

function loadLangArray(string $file): array
{
    $ec_lang = [];
    include $file;

    if (!is_array($ec_lang)) {
        fail('Language file did not produce $ec_lang array: ' . $file);
    }

    return $ec_lang;
}

/**
 * Pulls the suggestion-box block out of dev/translation-process.md -- the first fenced code block
 * under the "## The suggestion box" heading. One source of truth: the SOP shows the human what to
 * paste, and this hands the identical text to the agent through its own payload, so the two cannot
 * drift and a sprint that forgets to paste it still delivers it.
 *
 * A failure here is fatal on purpose. A payload that quietly shipped without the suggestion box
 * would take a whole sprint's findings with it, and nothing downstream would notice.
 */
function loadSuggestionBox(): string
{
    if (!file_exists(SUGGESTION_BOX_SOURCE)) {
        fail('Suggestion-box source not found: ' . SUGGESTION_BOX_SOURCE);
    }
    $md = (string)file_get_contents(SUGGESTION_BOX_SOURCE);
    $at = strpos($md, SUGGESTION_BOX_HEADING);
    if ($at === false) {
        fail('No "' . SUGGESTION_BOX_HEADING . '" heading in ' . basename(SUGGESTION_BOX_SOURCE)
            . ' -- every payload carries that block, so it cannot be renamed without updating this script.');
    }
    if (!preg_match('/^```\n(.*?)^```/ms', substr($md, $at), $m)) {
        fail('No fenced block under "' . SUGGESTION_BOX_HEADING . '" in ' . basename(SUGGESTION_BOX_SOURCE) . '.');
    }
    $block = trim($m[1]);
    if ($block === '') {
        fail('The suggestion-box block in ' . basename(SUGGESTION_BOX_SOURCE) . ' is empty.');
    }
    return $block;
}

function loadEnglishIntentMap(string $file): array
{
    $ec_lang = [];
    $ec_lang_syn = [];
    include $file;

    if (!is_array($ec_lang_syn)) {
        return [];
    }

    return $ec_lang_syn;
}

function collectKeySyn(array $deltaKeys, array $enKeys, array $intentMap): array
{
    $result = [];

    foreach ($deltaKeys as $key => $english) {
        if (!array_key_exists($key, $intentMap)) {
            continue;
        }

        // Intent strings follow the convention "<intent> | <commentary>" (see CLAUDE.md,
        // Language Keys). Everything from the first pipe onward is non-translated commentary
        // (layout/avoid/gloss tags); strip it so payloads carry only the translatable intent.
        $intent = trim((string)$intentMap[$key]);
        $pipePos = strpos($intent, '|');
        if ($pipePos !== false) {
            $intent = trim(substr($intent, 0, $pipePos));
        }
        if ($intent === '') {
            continue;
        }

        $enValue = trim((string)($enKeys[$key] ?? $english));
        if ($intent === $enValue) {
            continue;
        }

        $result[$key] = $intent;
    }

    return $result;
}

function detectPrefixes(array $keys): array
{
    $prefixes = [];
    foreach (array_keys($keys) as $key) {
        $parts = explode('_', $key, 2);
        if (count($parts) === 2 && $parts[0] !== '') {
            $prefixes[$parts[0]] = true;
        }
    }
    $list = array_keys($prefixes);
    sort($list);
    return $list;
}

/**
 * Returns [delta, context, exemptKeys, outOfScopeKeys]. Two different reasons a gap is
 * not delta, kept apart on purpose: exemptKeys equalled English legitimately and are
 * FINISHED; outOfScopeKeys are a body this language is not being asked for yet and are
 * NOT STARTED. Both suppressions stay visible in the payload meta.
 */
function collectDeltaAndContext(
    array $enKeys,
    array $current,
    array $activePrefixes,
    string $lang,
    array $exemptMap,
    array $coverage
): array {
    $delta = [];
    $context = [];
    $exemptKeys = [];
    $outOfScopeKeys = [];
    $orderedKeys = array_keys($enKeys);

    for ($i = 0; $i < count($orderedKeys); $i++) {
        $key = $orderedKeys[$i];
        $prefix = keyPrefix($key);
        if (count($activePrefixes) > 0 && !in_array($prefix, $activePrefixes, true)) {
            continue;
        }

        $english = (string)($enKeys[$key] ?? '');
        $currentValue = array_key_exists($key, $current) ? trim((string)$current[$key]) : null;

        $reason = null;
        if ($currentValue === null) {
            $reason = 'missing';
        } elseif ($currentValue === '') {
            $reason = 'blank';
        } elseif (normalizeForCompare($currentValue) === normalizeForCompare($english)) {
            if (ecIsExemptFromEnglishEquality($key, $lang, $exemptMap)) {
                $exemptKeys[] = $key;
            } elseif (!ecIsUniversalKey($key, $english)) {
                $reason = 'equal_to_english';
            }
        }

        if ($reason === null) {
            continue;
        }

        // Scope is consulted only once a gap exists -- never about an already-translated
        // key, which stays translated and maintained whatever tier its cell is in.
        if (!ecCoverageKeyInScope($key, $lang, $coverage)) {
            $outOfScopeKeys[] = $key;
            continue;
        }

        $delta[$key] = $english;
        $context[$key] = [
            'reason' => $reason,
            'current_value' => $currentValue,
            'neighbors' => [
                'previous_translated' => findNeighbor($orderedKeys, $enKeys, $current, $i, -1),
                'next_translated' => findNeighbor($orderedKeys, $enKeys, $current, $i, 1),
            ],
        ];
    }

    return [$delta, $context, $exemptKeys, $outOfScopeKeys];
}

function findNeighbor(array $orderedKeys, array $enKeys, array $current, int $startIndex, int $direction): ?array
{
    for ($i = $startIndex + $direction; $i >= 0 && $i < count($orderedKeys); $i += $direction) {
        $candidate = $orderedKeys[$i];
        if (!array_key_exists($candidate, $current)) {
            continue;
        }

        $value = trim((string)$current[$candidate]);
        if ($value === '') {
            continue;
        }

        $enValue = trim((string)($enKeys[$candidate] ?? ''));
        if (normalizeForCompare($value) === normalizeForCompare($enValue)) {
            continue;
        }

        return [
            'key' => $candidate,
            'value' => $value,
            'english' => (string)($enKeys[$candidate] ?? ''),
        ];
    }

    return null;
}

function keyPrefix(string $key): string
{
    $parts = explode('_', $key, 2);
    return $parts[0] ?? '';
}

function termIndexByName(array $terms): array
{
    $index = [];
    foreach ($terms as $term) {
        if (!isset($term['term'])) {
            continue;
        }
        $index[strtolower((string)$term['term'])] = $term;
    }
    return $index;
}

// prefixToTermNames() lives in prefix_terms.inc.php, required at the top of this file, so
// gloss_ref_check.php can read the same map instead of keeping a copy that could drift.
function buildPrefixGlossary(array $activePrefixes, array $termIndex, array $prefixMap): array
{
    $prefixGlossary = [];
    $defaultTerms = ['flow', 'velocity', 'slope'];

    foreach ($activePrefixes as $prefix) {
        $names = $prefixMap[$prefix] ?? $defaultTerms;
        $entries = [];
        foreach ($names as $name) {
            $term = $termIndex[strtolower($name)] ?? null;
            if ($term !== null) {
                $entries[] = $term;
            }
        }
        $prefixGlossary[$prefix] = $entries;
    }

    return $prefixGlossary;
}

function buildPromptContext(array $terms, string $language): string
{
    if (count($terms) === 0) {
        return 'No calculator-specific glossary terms were matched.';
    }

    $lines = [];
    foreach ($terms as $term) {
        $name = $term['term'] ?? '';
        if ($name === '') {
            continue;
        }

        $symbol = $term['symbol'] ?? '';
        $translation = $term['translations'][$language] ?? '';
        $translationDisplay = ($translation === '') ? '[needs translation sprint]' : $translation;

        $line = '- ' . $name;
        if ($symbol !== '') {
            $line .= ' (' . $symbol . ')';
        }
        $line .= ': ' . $translationDisplay;

        $avoid = $term['avoid'] ?? [];
        if (is_array($avoid) && count($avoid) > 0) {
            $line .= "\n    DO NOT render as: " . implode('; ', $avoid);
        }

        $lines[] = $line;
    }

    return "Use these preferred technical term translations when relevant:\n" . implode("\n", $lines);
}

/**
 * Normalizes a string for equality comparison so that an HTML-entity form
 * (e.g. &ndash;, &times;) and its literal UTF-8 character (e.g. –, ×) are
 * treated as identical rather than as a false "untranslated" delta.
 */
function normalizeForCompare(string $value): string
{
    return trim(html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
}

function fail(string $message): void
{
    fwrite(STDERR, 'ERROR: ' . $message . "\n");
    exit(1);
}
