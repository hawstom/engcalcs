<?php
/**
 * Translation payload generator.
 *
 * Writes per-language JSON payloads containing only missing/untranslated keys,
 * plus neighboring translated context for tone/register consistency.
 *
 * Optional sibling map support in lib/lang.ec.en.php:
 *   $ec_lang_intent['some_key'] = 'Expanded semantic intent for translators';
 * When present and different from the base English value, intent is emitted to
 * payload['key_intent'][key] for prompt-time disambiguation.
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
const EN_FILE = DEFAULT_LANG_DIR . '/lang.ec.en.php';
const TARGET_LANGS = [
    'am', 'ar', 'bg', 'bn', 'cs', 'de', 'es', 'fa', 'fr', 'he', 'hi', 'hr', 'id', 'it', 'km', 'my',
    'ps', 'pt', 'ro', 'ru', 'sr', 'sw', 'tr', 'uk', 'ur', 'zh',
];

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

    foreach ($langs as $lang) {
        $targetFile = DEFAULT_LANG_DIR . "/lang.ec.{$lang}.php";
        if (!file_exists($targetFile)) {
            fwrite(STDERR, "WARN: target language file missing, skipping: {$targetFile}\n");
            continue;
        }

        $current = loadLangArray($targetFile);
        [$deltaKeys, $keyContext] = collectDeltaAndContext($enKeys, $current, $activePrefixes);
        $keyIntent = collectKeyIntent($deltaKeys, $enKeys, $enIntent);

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
                'active_prefixes' => $prefixesInDelta,
                'requested_prefix' => $opts['requested_prefix'],
                'notes' => 'Translate only keys in keys_to_translate; preserve HTML, units, and symbols.',
                'glossary_injection_notes' => 'Use prompt_context_by_prefix and glossary_terms_by_prefix.preferred_translation when available.',
                'context_notes' => 'Use key_context.neighbors to keep register consistent with nearby translated strings.',
                'intent_notes' => 'Use key_intent when present; these entries provide terse disambiguation comments only where translation risk exists.',
            ],
            'prompt_context_by_prefix' => $promptByPrefix,
            'glossary_terms_by_prefix' => $termsByPrefix,
            'keys_to_translate' => $deltaKeys,
            // Backward-compatibility for scripts that still expect payload["keys"].
            'keys' => $deltaKeys,
            'key_context' => $keyContext,
            'key_intent' => $keyIntent,
        ];

        file_put_contents(
            $opts['output_dir'] . "/payload_{$lang}.json",
            json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
        $generatedCount++;
    }

    echo "Generated {$generatedCount} payload files in: {$opts['output_dir']}\n";
    echo 'Active prefixes: ' . implode(', ', $activePrefixes) . "\n";
}

function parseArgs(array $argv): array
{
    $opts = [
        'output_dir' => DEFAULT_OUTPUT_DIR,
        'requested_prefix' => null,
        'languages' => [],
    ];

    $positionals = [];
    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];
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
    exit(0);
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

function loadEnglishIntentMap(string $file): array
{
    $ec_lang = [];
    $ec_lang_intent = [];
    include $file;

    if (!is_array($ec_lang_intent)) {
        return [];
    }

    return $ec_lang_intent;
}

function collectKeyIntent(array $deltaKeys, array $enKeys, array $intentMap): array
{
    $result = [];

    foreach ($deltaKeys as $key => $english) {
        if (!array_key_exists($key, $intentMap)) {
            continue;
        }

        $intent = trim((string)$intentMap[$key]);
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

function collectDeltaAndContext(array $enKeys, array $current, array $activePrefixes): array
{
    $delta = [];
    $context = [];
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
        } elseif ($currentValue === trim($english)) {
            $reason = 'equal_to_english';
        }

        if ($reason === null) {
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

    return [$delta, $context];
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
        if ($value === $enValue) {
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

function prefixToTermNames(): array
{
    return [
        'dw' => ['flow', 'velocity', 'head loss', 'friction factor', 'slope', 'laminar', 'transitional', 'turbulent'],
        'hw' => ['flow', 'velocity', 'head loss', 'slope'],
        'mpf' => ['flow', 'velocity', 'hydraulic radius', 'wetted perimeter', 'Manning roughness', 'slope'],
        'mphl' => ['flow', 'velocity', 'head loss', 'hydraulic radius', 'wetted perimeter', 'Manning roughness', 'slope'],
        'mtc' => ['flow', 'velocity', 'hydraulic radius', 'wetted perimeter', 'Manning roughness', 'slope'],
        'mi' => ['flow', 'velocity', 'hydraulic radius', 'wetted perimeter', 'Manning roughness', 'slope'],
        'wfs' => ['flow', 'weir', 'headwater elevation', 'tailwater elevation', 'discharge coefficient'],
        'wfi' => ['flow', 'weir', 'headwater elevation', 'tailwater elevation', 'discharge coefficient'],
        'ws' => ['flow', 'weir', 'headwater elevation', 'tailwater elevation', 'discharge coefficient'],
        'wi' => ['flow', 'weir', 'headwater elevation', 'tailwater elevation', 'discharge coefficient'],
        'or' => ['flow', 'orifice', 'discharge coefficient', 'headwater elevation', 'tailwater elevation'],
        'odt' => ['orifice', 'discharge coefficient', 'headwater elevation', 'tailwater elevation'],
        'ds' => ['flow', 'application rate', 'distribution uniformity', 'emitter'],
        'cs' => ['flow', 'conveyance efficiency', 'seepage'],
        'mhp' => ['flow', 'penstock', 'gross head', 'net head', 'plant efficiency', 'head loss'],
        'pd' => ['flow', 'penstock', 'gross head', 'net head', 'head loss', 'friction factor'],
        'rc' => ['flow', 'velocity', 'riprap', 'slope'],
        'rrc' => ['flow', 'velocity', 'riprap', 'slope'],
    ];
}

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
        $lines[] = $line;
    }

    return "Use these preferred technical term translations when relevant:\n" . implode("\n", $lines);
}

function fail(string $message): void
{
    fwrite(STDERR, 'ERROR: ' . $message . "\n");
    exit(1);
}
