<?php
/**
 * Direct translation driver using Anthropic Messages API.
 * Optional paid path; default project workflow is scripts/translate_zero_api.php.
 *
 * Usage examples:
 *   ANTHROPIC_API_KEY=... php scripts/translate.php
 *   ANTHROPIC_API_KEY=... php scripts/translate.php --lang=es,fr --prefix=dw
 *   ANTHROPIC_API_KEY=... php scripts/translate.php --lang=es --force-all
 *   php scripts/translate.php --dry-run
 */

require_once __DIR__ . '/translate_prompt.php';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const DEFAULT_PAYLOAD_DIR = __DIR__ . '/../../dev/translation_payloads';
const DEFAULT_LANG_DIR = __DIR__ . '/../../lib';

const DEFAULT_INPUT_COST_PER_MTOK = 0.80;
const DEFAULT_OUTPUT_COST_PER_MTOK = 4.00;

const LANGUAGE_NAMES = [
    'am' => 'Amharic',
    'ar' => 'Arabic',
    'bg' => 'Bulgarian',
    'bn' => 'Bengali',
    'cs' => 'Czech',
    'de' => 'German',
    'es' => 'Spanish',
    'fa' => 'Persian',
    'fr' => 'French',
    'he' => 'Hebrew',
    'hi' => 'Hindi',
    'hr' => 'Croatian',
    'id' => 'Indonesian',
    'it' => 'Italian',
    'km' => 'Khmer',
    'my' => 'Burmese',
    'ps' => 'Pashto',
    'pt' => 'Portuguese',
    'ro' => 'Romanian',
    'ru' => 'Russian',
    'sr' => 'Serbian',
    'sw' => 'Swahili',
    'tr' => 'Turkish',
    'uk' => 'Ukrainian',
    'ur' => 'Urdu',
    'zh' => 'Chinese',
];

main($argv);

function main(array $argv): void
{
    $opts = parseArgs($argv);

    if (!is_dir($opts['payload_dir'])) {
        fail("Payload directory not found: {$opts['payload_dir']}");
    }

    $apiKey = getenv('ANTHROPIC_API_KEY');
    if (!$opts['dry_run'] && (!$apiKey || trim($apiKey) === '')) {
        fail('Missing ANTHROPIC_API_KEY environment variable.');
    }

    $payloadFiles = listPayloadFiles($opts['payload_dir'], $opts['languages']);
    if (count($payloadFiles) === 0) {
        fail('No payload files matched selection.');
    }

    $summary = [
        'calls' => 0,
        'keys_requested' => 0,
        'keys_applied' => 0,
        'input_tokens' => 0,
        'output_tokens' => 0,
        'cache_creation_input_tokens' => 0,
        'cache_read_input_tokens' => 0,
    ];

    foreach ($payloadFiles as $payloadFile) {
        $payload = readJsonFile($payloadFile);
        $langCode = resolveLanguageCode($payload, $payloadFile);
        $langName = LANGUAGE_NAMES[$langCode] ?? strtoupper($langCode);
        $targetFile = DEFAULT_LANG_DIR . "/lang.ec.{$langCode}.php";

        if (!file_exists($targetFile)) {
            fwrite(STDERR, "WARN: target language file not found, skipping: {$targetFile}\n");
            continue;
        }

        $englishKeys = $payload['keys'] ?? [];
        if (!is_array($englishKeys) || count($englishKeys) === 0) {
            fwrite(STDERR, "WARN: payload has no keys, skipping: {$payloadFile}\n");
            continue;
        }

        $activePrefixes = resolveActivePrefixes($payload, $englishKeys, $opts['prefixes']);
        if (count($activePrefixes) === 0) {
            fwrite(STDERR, "INFO: no matching prefixes for {$langCode}, skipping.\n");
            continue;
        }

        $langContent = file_get_contents($targetFile);
        if ($langContent === false) {
            fwrite(STDERR, "WARN: unable to read target language file, skipping: {$targetFile}\n");
            continue;
        }

        $currentValues = parseLangAssignments($langContent);

        echo "\n== {$langCode} ({$langName}) ==\n";

        foreach ($activePrefixes as $prefix) {
            $delta = collectDeltaForPrefix($prefix, $englishKeys, $currentValues, $opts['force_all']);
            $deltaCount = count($delta);
            if ($deltaCount === 0) {
                echo "[{$langCode}/{$prefix}] No keys need translation.\n";
                continue;
            }

            $summary['keys_requested'] += $deltaCount;

            $prompt = buildTranslationPrompt($langCode, $langName, $prefix, $delta, $payload);
            echo "[{$langCode}/{$prefix}] Translating {$deltaCount} keys...\n";

            if ($opts['dry_run']) {
                continue;
            }

            $apiResponse = callAnthropicMessagesApi($apiKey, $prompt);
            $summary['calls']++;
            addUsageToSummary($summary, $apiResponse['usage'] ?? []);

            $responseText = extractResponseText($apiResponse);
            $translated = parseTranslationResponse($responseText);

            $translated = array_intersect_key($translated, $delta);
            if (count($translated) === 0) {
                fwrite(STDERR, "WARN: parsed 0 valid translations for {$langCode}/{$prefix}.\n");
                continue;
            }

            $appliedForPrefix = 0;
            foreach ($translated as $key => $value) {
                $value = normalizeLiteralUtf8Symbols($value);
                $newContent = replaceLangAssignment($langContent, $key, $value, $didReplace);
                $langContent = $newContent;
                if ($didReplace) {
                    $appliedForPrefix++;
                }
            }

            if ($appliedForPrefix > 0) {
                file_put_contents($targetFile, $langContent);
                $currentValues = parseLangAssignments($langContent);
            }

            $summary['keys_applied'] += $appliedForPrefix;
            echo "[{$langCode}/{$prefix}] Applied {$appliedForPrefix}/{$deltaCount}.\n";
        }
    }

    printCostSummary($summary, $opts['dry_run']);
}

function parseArgs(array $argv): array
{
    $opts = [
        'payload_dir' => DEFAULT_PAYLOAD_DIR,
        'languages' => [],
        'prefixes' => [],
        'dry_run' => false,
        'force_all' => false,
    ];

    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];

        if ($arg === '--dry-run') {
            $opts['dry_run'] = true;
            continue;
        }

        if ($arg === '--force-all') {
            $opts['force_all'] = true;
            continue;
        }

        if (strpos($arg, '--payload-dir=') === 0) {
            $opts['payload_dir'] = substr($arg, strlen('--payload-dir='));
            continue;
        }

        if (strpos($arg, '--lang=') === 0) {
            $opts['languages'] = splitCsv(substr($arg, strlen('--lang=')));
            continue;
        }

        if (strpos($arg, '--prefix=') === 0) {
            $opts['prefixes'] = splitCsv(substr($arg, strlen('--prefix=')));
            continue;
        }

        if ($arg === '--help' || $arg === '-h') {
            printHelpAndExit();
        }

        fail("Unknown option: {$arg}");
    }

    return $opts;
}

function printHelpAndExit(): void
{
    echo "Usage: php scripts/translate.php [options]\n";
    echo "Note: This is the optional paid API path. Default workflow: php scripts/translate_zero_api.php\n";
    echo "\nOptions:\n";
    echo "  --payload-dir=DIR   Directory containing payload_*.json files\n";
    echo "  --lang=es,fr        Limit to specific language codes\n";
    echo "  --prefix=dw,mpf     Limit to specific calculator prefixes\n";
    echo "  --force-all         Translate all keys in selected prefixes\n";
    echo "  --dry-run           Build prompts and report counts only (no API calls)\n";
    echo "  -h, --help          Show this help\n\n";
    echo "Environment:\n";
    echo "  ANTHROPIC_API_KEY                     Required unless --dry-run\n";
    echo "  TRANSLATE_INPUT_COST_PER_MTOK         Optional USD per 1M input tokens\n";
    echo "  TRANSLATE_OUTPUT_COST_PER_MTOK        Optional USD per 1M output tokens\n";
    exit(0);
}

function splitCsv(string $value): array
{
    $parts = array_filter(array_map('trim', explode(',', $value)), function ($v) {
        return $v !== '';
    });
    return array_values(array_unique($parts));
}

function listPayloadFiles(string $payloadDir, array $languageFilter): array
{
    $files = glob(rtrim($payloadDir, '/') . '/payload_*.json');
    if ($files === false) {
        return [];
    }

    sort($files);

    if (count($languageFilter) === 0) {
        return $files;
    }

    $keep = [];
    foreach ($files as $file) {
        if (preg_match('/payload_([a-z]{2})\.json$/', $file, $m)) {
            if (in_array($m[1], $languageFilter, true)) {
                $keep[] = $file;
            }
        }
    }
    return $keep;
}

function readJsonFile(string $filePath): array
{
    $raw = file_get_contents($filePath);
    if ($raw === false) {
        fail("Unable to read JSON file: {$filePath}");
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        fail("Invalid JSON in file: {$filePath}");
    }

    return $decoded;
}

function resolveLanguageCode(array $payload, string $payloadFile): string
{
    $lang = $payload['meta']['language'] ?? null;
    if (is_string($lang) && $lang !== '') {
        return $lang;
    }

    if (preg_match('/payload_([a-z]{2})\.json$/', $payloadFile, $m)) {
        return $m[1];
    }

    fail("Unable to resolve language code for payload: {$payloadFile}");
}

function resolveActivePrefixes(array $payload, array $englishKeys, array $prefixFilter): array
{
    $prefixes = $payload['meta']['active_prefixes'] ?? [];

    if (!is_array($prefixes) || count($prefixes) === 0) {
        $prefixes = [];
        foreach (array_keys($englishKeys) as $key) {
            $parts = explode('_', $key, 2);
            if (count($parts) === 2 && $parts[0] !== '') {
                $prefixes[$parts[0]] = true;
            }
        }
        $prefixes = array_keys($prefixes);
    }

    sort($prefixes);

    if (count($prefixFilter) > 0) {
        $prefixes = array_values(array_filter($prefixes, function ($prefix) use ($prefixFilter) {
            return in_array($prefix, $prefixFilter, true);
        }));
    }

    return $prefixes;
}

function parseLangAssignments(string $content): array
{
    $pattern = '/\$ec_lang\[\'([^\']+)\'\]\s*=\s*(\'((?:[^\\\']|\\.)*)\'|"((?:[^\\"]|\\.)*)")\s*;/m';
    preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);

    $values = [];
    foreach ($matches as $m) {
        $key = $m[1];
        if ($m[3] !== '') {
            $values[$key] = stripcslashes($m[3]);
        } else {
            $values[$key] = stripcslashes($m[4]);
        }
    }

    return $values;
}

function collectDeltaForPrefix(string $prefix, array $englishKeys, array $currentValues, bool $forceAll): array
{
    $delta = [];
    foreach ($englishKeys as $key => $englishValue) {
        if (!str_starts_with($key, $prefix . '_')) {
            continue;
        }

        if ($forceAll) {
            $delta[$key] = $englishValue;
            continue;
        }

        if (!array_key_exists($key, $currentValues)) {
            $delta[$key] = $englishValue;
            continue;
        }

        $current = trim((string)$currentValues[$key]);
        $english = trim((string)$englishValue);

        if ($current === '' || $current === $english) {
            $delta[$key] = $englishValue;
        }
    }

    return $delta;
}

function callAnthropicMessagesApi(string $apiKey, string $prompt): array
{
    if (!function_exists('curl_init')) {
        fail('PHP cURL extension is required for API calls.');
    }

    $body = [
        'model' => TRANSLATE_MODEL,
        'max_tokens' => TRANSLATE_MAX_TOKENS,
        'temperature' => TRANSLATE_TEMPERATURE,
        'system' => TRANSLATE_SYSTEM_PROMPT,
        'messages' => [
            [
                'role' => 'user',
                'content' => $prompt,
            ],
        ],
    ];

    $ch = curl_init(ANTHROPIC_API_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'x-api-key: ' . $apiKey,
            'anthropic-version: ' . ANTHROPIC_VERSION,
        ],
        CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
        CURLOPT_TIMEOUT => 120,
    ]);

    $raw = curl_exec($ch);
    $curlErr = curl_error($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($raw === false) {
        fail('Anthropic API cURL error: ' . $curlErr);
    }

    $decoded = json_decode($raw, true);

    if ($httpCode >= 400) {
        $errMsg = is_array($decoded) ? json_encode($decoded, JSON_UNESCAPED_UNICODE) : $raw;
        fail("Anthropic API error HTTP {$httpCode}: {$errMsg}");
    }

    if (!is_array($decoded)) {
        fail('Invalid JSON response from Anthropic API.');
    }

    return $decoded;
}

function extractResponseText(array $apiResponse): string
{
    $contentBlocks = $apiResponse['content'] ?? null;
    if (!is_array($contentBlocks)) {
        fail('Anthropic response missing content blocks.');
    }

    $parts = [];
    foreach ($contentBlocks as $block) {
        if (($block['type'] ?? '') === 'text' && isset($block['text'])) {
            $parts[] = (string)$block['text'];
        }
    }

    if (count($parts) === 0) {
        fail('Anthropic response returned no text content.');
    }

    return implode("\n", $parts);
}

function normalizeLiteralUtf8Symbols(string $value): string
{
    $named = [
        '&ndash;' => '–',
        '&mdash;' => '—',
        '&minus;' => '−',
        '&times;' => '×',
        '&ge;' => '≥',
        '&le;' => '≤',
    ];

    $value = strtr($value, $named);

    $numeric = [
        '/&#8211;/' => '–',
        '/&#8212;/' => '—',
        '/&#8722;/' => '−',
        '/&#215;/' => '×',
        '/&#8805;/' => '≥',
        '/&#8804;/' => '≤',
        '/&#x2013;/i' => '–',
        '/&#x2014;/i' => '—',
        '/&#x2212;/i' => '−',
        '/&#x00D7;/i' => '×',
        '/&#x2265;/i' => '≥',
        '/&#x2264;/i' => '≤',
    ];

    foreach ($numeric as $pattern => $replacement) {
        $value = preg_replace($pattern, $replacement, $value);
    }

    return $value;
}

function replaceLangAssignment(string $content, string $key, string $value, bool &$didReplace): string
{
    $escapedKey = preg_quote($key, '/');
    $replacement = '\$ec_lang[\'' . $key . '\']=\'' . escapePhpSingleQuoted($value) . '\';';

    $pattern = '/^\s*\$ec_lang\[\'' . $escapedKey . '\'\]\s*=\s*(?:\'(?:[^\\\']|\\.)*\'|"(?:[^\\"]|\\.)*")\s*;\s*$/m';
    $updated = preg_replace($pattern, $replacement, $content, 1, $count);

    if ($updated === null) {
        fail("Regex error while replacing key: {$key}");
    }

    if ($count > 0) {
        $didReplace = true;
        return $updated;
    }

    $didReplace = false;

    if (str_contains($content, "?>")) {
        return str_replace("?>", $replacement . "\n?>", $content);
    }

    $suffix = str_ends_with($content, "\n") ? '' : "\n";
    return $content . $suffix . $replacement . "\n";
}

function escapePhpSingleQuoted(string $value): string
{
    $value = str_replace('\\', '\\\\', $value);
    $value = str_replace("'", "\\'", $value);
    return $value;
}

function addUsageToSummary(array &$summary, array $usage): void
{
    $summary['input_tokens'] += (int)($usage['input_tokens'] ?? 0);
    $summary['output_tokens'] += (int)($usage['output_tokens'] ?? 0);
    $summary['cache_creation_input_tokens'] += (int)($usage['cache_creation_input_tokens'] ?? 0);
    $summary['cache_read_input_tokens'] += (int)($usage['cache_read_input_tokens'] ?? 0);
}

function printCostSummary(array $summary, bool $dryRun): void
{
    echo "\n==== Translation Summary ====\n";
    echo 'Dry run: ' . ($dryRun ? 'yes' : 'no') . "\n";
    echo "API calls: {$summary['calls']}\n";
    echo "Keys requested: {$summary['keys_requested']}\n";
    echo "Keys applied: {$summary['keys_applied']}\n";
    echo "Input tokens: {$summary['input_tokens']}\n";
    echo "Output tokens: {$summary['output_tokens']}\n";

    if ($summary['cache_creation_input_tokens'] > 0 || $summary['cache_read_input_tokens'] > 0) {
        echo "Cache creation input tokens: {$summary['cache_creation_input_tokens']}\n";
        echo "Cache read input tokens: {$summary['cache_read_input_tokens']}\n";
    }

    $inputRate = getenv('TRANSLATE_INPUT_COST_PER_MTOK');
    $outputRate = getenv('TRANSLATE_OUTPUT_COST_PER_MTOK');

    $inputRate = ($inputRate === false || $inputRate === '') ? DEFAULT_INPUT_COST_PER_MTOK : (float)$inputRate;
    $outputRate = ($outputRate === false || $outputRate === '') ? DEFAULT_OUTPUT_COST_PER_MTOK : (float)$outputRate;

    $usdInput = ($summary['input_tokens'] / 1000000.0) * $inputRate;
    $usdOutput = ($summary['output_tokens'] / 1000000.0) * $outputRate;
    $usdTotal = $usdInput + $usdOutput;

    echo sprintf("Estimated input cost (USD): %.6f\n", $usdInput);
    echo sprintf("Estimated output cost (USD): %.6f\n", $usdOutput);
    echo sprintf("Estimated total cost (USD): %.6f\n", $usdTotal);
    echo sprintf("Rates used (USD / 1M tokens): input=%.4f output=%.4f\n", $inputRate, $outputRate);
}

function fail(string $message): void
{
    fwrite(STDERR, "ERROR: {$message}\n");
    exit(1);
}
