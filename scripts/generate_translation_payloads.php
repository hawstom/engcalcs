<?php
// generate_translation_payloads.php
// Usage:
//   php generate_translation_payloads.php [output_dir] [calculator_prefix]
//   php generate_translation_payloads.php [output_dir] --prefix=<calculator_prefix>

$input = __DIR__ . '/../lib/lang.ec.en.php';
$glossaryPath = __DIR__ . '/glossary.json';
$outputDir = __DIR__ . '/../translation_payloads';
$requestedPrefix = null;

$positionals = [];
for ($i = 1; $i < count($argv); $i++) {
    $arg = $argv[$i];
    if (strpos($arg, '--prefix=') === 0) {
        $requestedPrefix = substr($arg, strlen('--prefix='));
        continue;
    }
    if (strpos($arg, '--') === 0) {
        fwrite(STDERR, "Unknown option: {$arg}\n");
        exit(1);
    }
    $positionals[] = $arg;
}

if (isset($positionals[0])) {
    $outputDir = $positionals[0];
}
if ($requestedPrefix === null && isset($positionals[1])) {
    $requestedPrefix = $positionals[1];
}

if (!file_exists($input)) {
    fwrite(STDERR, "English language file not found: $input\n");
    exit(1);
}

if (!file_exists($glossaryPath)) {
    fwrite(STDERR, "Glossary file not found: $glossaryPath\n");
    exit(1);
}

if (!is_dir($outputDir)) {
    mkdir($outputDir, 0755, true);
}

$contents = file_get_contents($input);
$glossaryRaw = file_get_contents($glossaryPath);
$glossaryData = json_decode($glossaryRaw, true);

if (!is_array($glossaryData) || !isset($glossaryData['terms']) || !is_array($glossaryData['terms'])) {
    fwrite(STDERR, "Invalid glossary JSON structure in: $glossaryPath\n");
    exit(1);
}

// Match $ec_lang['key'] = '...'; including multiline quoted values.
$pattern = '/\$ec_lang\[\'([^\']+)\'\]\s*=\s*(\'((?:[^\\\']|\\.)*)\'|\"((?:[^\\\"]|\\.)*)\"|([^;]*));/m';
preg_match_all($pattern, $contents, $matches, PREG_SET_ORDER);

$keys = [];
foreach ($matches as $m) {
    $key = $m[1];
    $val = '';
    if (isset($m[3]) && $m[3] !== '') {
        $val = stripcslashes($m[3]);
    } elseif (isset($m[4]) && $m[4] !== '') {
        $val = stripcslashes($m[4]);
    } else {
        $val = trim($m[5] ?? '');
    }
    $keys[$key] = $val;
}

function detectPrefixes(array $languageKeys): array
{
    $prefixes = [];
    foreach (array_keys($languageKeys) as $key) {
        $parts = explode('_', $key, 2);
        if (count($parts) === 2 && strlen($parts[0]) > 0) {
            $prefixes[$parts[0]] = true;
        }
    }
    $result = array_keys($prefixes);
    sort($result);
    return $result;
}

function termIndexByName(array $terms): array
{
    $index = [];
    foreach ($terms as $term) {
        if (!isset($term['term'])) {
            continue;
        }
        $index[strtolower($term['term'])] = $term;
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
        $line = "- {$name}";
        if ($symbol !== '') {
            $line .= " ({$symbol})";
        }
        $line .= ": {$translationDisplay}";
        $lines[] = $line;
    }
    return "Use these preferred technical term translations when relevant:\n" . implode("\n", $lines);
}

$termIndex = termIndexByName($glossaryData['terms']);
$prefixMap = prefixToTermNames();
$detectedPrefixes = detectPrefixes($keys);
$activePrefixes = array_values(array_intersect($detectedPrefixes, array_keys($prefixMap)));
sort($activePrefixes);

if ($requestedPrefix !== null) {
    $activePrefixes = array_values(array_filter($activePrefixes, function ($p) use ($requestedPrefix) {
        return $p === $requestedPrefix;
    }));
}

$prefixGlossary = buildPrefixGlossary($activePrefixes, $termIndex, $prefixMap);

// Save a full English JSON snapshot
file_put_contents(
    $outputDir . '/lang.en.json',
    json_encode([
        'language' => 'en',
        'keys' => $keys,
        'count' => count($keys),
        'active_prefixes' => $activePrefixes,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

$targets = ['am', 'ar', 'bg', 'bn', 'cs', 'de', 'es', 'fa', 'fr', 'he', 'hi', 'hr', 'id', 'it', 'km', 'my', 'ps', 'pt', 'ro', 'ru', 'sr', 'sw', 'tr', 'uk', 'ur', 'zh'];

foreach ($targets as $t) {
    $promptByPrefix = [];
    $termsByPrefix = [];
    foreach ($prefixGlossary as $prefix => $terms) {
        $promptByPrefix[$prefix] = buildPromptContext($terms, $t);
        $termsByPrefix[$prefix] = array_map(function ($term) use ($t) {
            return [
                'term' => $term['term'] ?? '',
                'symbol' => $term['symbol'] ?? '',
                'context' => $term['context'] ?? '',
                'translation_notes' => $term['translation_notes'] ?? '',
                'preferred_translation' => $term['translations'][$t] ?? '',
            ];
        }, $terms);
    }

    $payload = [
        'meta' => [
            'language' => $t,
            'expected_key_count' => count($keys),
            'active_prefixes' => $activePrefixes,
            'requested_prefix' => $requestedPrefix,
            'notes' => 'Translate the values; preserve HTML and units. Return only PHP file contents.',
            'glossary_injection_notes' => 'Use prompt_context_by_prefix for prefix-scoped prompts, and prefer glossary_terms_by_prefix.preferred_translation when provided.',
        ],
        'prompt_context_by_prefix' => $promptByPrefix,
        'glossary_terms_by_prefix' => $termsByPrefix,
        'keys' => $keys,
    ];

    file_put_contents($outputDir . "/payload_{$t}.json", json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

echo "Generated payloads in: $outputDir\n";
echo "Active prefixes: " . implode(', ', $activePrefixes) . "\n";

?>
