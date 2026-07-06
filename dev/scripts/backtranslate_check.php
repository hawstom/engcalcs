<?php
/**
 * Back-translation semantic check (post-sprint QA step 3).
 *
 * For each selected key, sends the English source and the target-language string
 * to the Anthropic Messages API and asks a strong model to (a) back-translate the
 * target literally and (b) report only MEANING-LEVEL mismatches. Formatting noise
 * (word order, register, synonyms) is deliberately ignored — this exists to catch
 * the class of error found in the 2026-07 audit: homonym traps ("draw" -> drawing,
 * "reach" -> arrival), flipped directions (upstream/downstream), dropped or
 * invented clauses, and untranslated passages.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... php dev/scripts/backtranslate_check.php --lang=bg --prefix=ip
 *   ANTHROPIC_API_KEY=... php dev/scripts/backtranslate_check.php --lang=sw --keys=ip_notes_2_def,ip_count
 *   php dev/scripts/backtranslate_check.php --lang=bg --prefix=rc --dry-run   (print prompts, no API)
 *
 * Options:
 *   --lang=xx          Required. One language code per run.
 *   --prefix=ip        Check all keys with this prefix (long strings first).
 *   --keys=a,b,c       Explicit key list (overrides --prefix).
 *   --min-len=80       Only check strings whose English source is at least this long
 *                      (default 80; the failure mode lives in long strings). Use 0 for all.
 *   --batch=4          Strings per API request (default 4).
 *   --model=...        Override model (default claude-sonnet-5).
 *   --dry-run          Build and print prompts without calling the API.
 *
 * Exit code 1 if any MAJOR finding is reported, else 0.
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const LANG_DIR = __DIR__ . '/../../lib';

const BTC_DEFAULT_MODEL = 'claude-sonnet-5';
const BTC_MAX_TOKENS = 2000;

const BTC_LANGUAGE_NAMES = [
    'am' => 'Amharic', 'ar' => 'Arabic', 'bg' => 'Bulgarian', 'bn' => 'Bengali',
    'cs' => 'Czech', 'de' => 'German', 'es' => 'Spanish', 'fa' => 'Persian',
    'fr' => 'French', 'he' => 'Hebrew', 'hi' => 'Hindi', 'hr' => 'Croatian',
    'id' => 'Indonesian', 'it' => 'Italian', 'km' => 'Khmer', 'my' => 'Burmese',
    'ps' => 'Pashto', 'pt' => 'Portuguese', 'ro' => 'Romanian', 'ru' => 'Russian',
    'sr' => 'Serbian', 'sw' => 'Swahili', 'tr' => 'Turkish', 'uk' => 'Ukrainian',
    'ur' => 'Urdu', 'zh' => 'Chinese',
];

main($argv);

function main(array $argv): void
{
    $opts = parseArgs($argv);

    $langName = BTC_LANGUAGE_NAMES[$opts['lang']] ?? null;
    if ($langName === null) {
        fail('Unknown language code: ' . $opts['lang']);
    }

    $en = loadLangValues(LANG_DIR . '/lang.ec.en.php');
    $target = loadLangValues(LANG_DIR . '/lang.ec.' . $opts['lang'] . '.php');

    $keys = selectKeys($opts, $en, $target);
    if (count($keys) === 0) {
        echo "No keys matched the selection.\n";
        exit(0);
    }

    // Longest first: the failure mode lives in long strings.
    usort($keys, static function ($a, $b) use ($en) {
        return strlen($en[$b]) <=> strlen($en[$a]);
    });

    echo 'Checking ' . count($keys) . " keys for {$langName} ({$opts['lang']}), batch size {$opts['batch']}.\n\n";

    $apiKey = getenv('ANTHROPIC_API_KEY');
    if (!$opts['dry_run'] && ($apiKey === false || $apiKey === '')) {
        fail('Missing ANTHROPIC_API_KEY environment variable (or use --dry-run).');
    }

    $majorCount = 0;
    foreach (array_chunk($keys, $opts['batch']) as $chunk) {
        $prompt = buildCheckPrompt($langName, $chunk, $en, $target);

        if ($opts['dry_run']) {
            echo "----- PROMPT -----\n{$prompt}\n\n";
            continue;
        }

        $response = callAnthropicMessagesApi((string)$apiKey, $opts['model'], $prompt);
        $text = extractResponseText($response);
        $majorCount += printFindings($text);
    }

    if ($opts['dry_run']) {
        exit(0);
    }

    echo "\nDone. MAJOR findings: {$majorCount}\n";
    exit($majorCount > 0 ? 1 : 0);
}

function buildCheckPrompt(string $langName, array $keys, array $en, array $target): string
{
    $parts = [];
    $parts[] = "You are a bilingual QA reviewer for hydraulic-engineering software strings.";
    $parts[] = "For each item below, mentally back-translate the {$langName} string to English and compare it to the SOURCE.";
    $parts[] = "Report ONLY meaning-level problems. Ignore register, word order, synonyms, and formatting.";
    $parts[] = "Problem classes to catch: wrong sense of a polysemous word (e.g. 'reach' as arrival, 'draw' as drawing);";
    $parts[] = "flipped direction (upstream/downstream, above/below); dropped or truncated clauses; invented content;";
    $parts[] = "untranslated passages; nonwords; characters from an unrelated script; numbers or symbols that differ from the source.";
    $parts[] = "";
    $parts[] = "Output format, one line per finding, nothing else:";
    $parts[] = "FINDING|<key>|MAJOR or MINOR|<what the target actually says>|<what the source means>";
    $parts[] = "If an item is fine, output: OK|<key>";
    $parts[] = "";
    foreach ($keys as $key) {
        $parts[] = "### {$key}";
        $parts[] = "SOURCE: " . $en[$key];
        $parts[] = "TARGET: " . $target[$key];
        $parts[] = "";
    }
    return implode("\n", $parts);
}

/** Prints findings, returns the number of MAJOR ones. */
function printFindings(string $text): int
{
    $major = 0;
    foreach (explode("\n", $text) as $line) {
        $line = trim($line);
        if ($line === '') {
            continue;
        }
        if (str_starts_with($line, 'FINDING|')) {
            echo $line . "\n";
            if (strpos($line, '|MAJOR|') !== false) {
                $major++;
            }
        } elseif (str_starts_with($line, 'OK|')) {
            echo $line . "\n";
        } else {
            fwrite(STDERR, "WARN: unrecognised line: {$line}\n");
        }
    }
    return $major;
}

function selectKeys(array $opts, array $en, array $target): array
{
    $keys = [];
    if (count($opts['keys']) > 0) {
        $candidates = $opts['keys'];
    } else {
        $candidates = array_keys($en);
        if ($opts['prefix'] !== null) {
            $candidates = array_values(array_filter($candidates, static function ($k) use ($opts) {
                return str_starts_with($k, $opts['prefix'] . '_');
            }));
        }
    }

    foreach ($candidates as $key) {
        if (!isset($en[$key]) || !isset($target[$key])) {
            continue;
        }
        if ($target[$key] === '' || $target[$key] === $en[$key]) {
            continue; // untranslated content is the validator's job, not this script's
        }
        if (strlen($en[$key]) < $opts['min_len']) {
            continue;
        }
        $keys[] = $key;
    }
    return $keys;
}

function loadLangValues(string $file): array
{
    $content = (string)file_get_contents($file);
    if ($content === '') {
        fail('Could not read ' . $file);
    }
    $values = [];
    if (preg_match_all("/\\\$ec_lang\\['([^']+)'\\]\\s*=\\s*'((?:[^'\\\\]|\\\\.)*)';/", $content, $m, PREG_SET_ORDER)) {
        foreach ($m as $match) {
            $values[$match[1]] = stripslashes($match[2]);
        }
    }
    return $values;
}

function parseArgs(array $argv): array
{
    $opts = [
        'lang' => null, 'prefix' => null, 'keys' => [],
        'min_len' => 80, 'batch' => 4, 'model' => BTC_DEFAULT_MODEL, 'dry_run' => false,
    ];
    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];
        if (strpos($arg, '--lang=') === 0) { $opts['lang'] = substr($arg, 7); continue; }
        if (strpos($arg, '--prefix=') === 0) { $opts['prefix'] = substr($arg, 9); continue; }
        if (strpos($arg, '--keys=') === 0) { $opts['keys'] = array_filter(explode(',', substr($arg, 7))); continue; }
        if (strpos($arg, '--min-len=') === 0) { $opts['min_len'] = (int)substr($arg, 10); continue; }
        if (strpos($arg, '--batch=') === 0) { $opts['batch'] = max(1, (int)substr($arg, 8)); continue; }
        if (strpos($arg, '--model=') === 0) { $opts['model'] = substr($arg, 8); continue; }
        if ($arg === '--dry-run') { $opts['dry_run'] = true; continue; }
        if ($arg === '--help' || $arg === '-h') { printHelpAndExit(); }
        fail('Unknown option: ' . $arg);
    }
    if ($opts['lang'] === null) {
        fail('Required: --lang=<code>');
    }
    return $opts;
}

function printHelpAndExit(): void
{
    echo "Usage: ANTHROPIC_API_KEY=... php dev/scripts/backtranslate_check.php --lang=bg [--prefix=ip | --keys=a,b] [--min-len=80] [--batch=4] [--model=...] [--dry-run]\n";
    exit(0);
}

function callAnthropicMessagesApi(string $apiKey, string $model, string $prompt): array
{
    if (!function_exists('curl_init')) {
        fail('PHP cURL extension is required for API calls.');
    }

    $body = [
        'model' => $model,
        'max_tokens' => BTC_MAX_TOKENS,
        'temperature' => 0,
        'messages' => [['role' => 'user', 'content' => $prompt]],
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
    $blocks = $apiResponse['content'] ?? null;
    if (!is_array($blocks)) {
        fail('Anthropic response missing content blocks.');
    }
    $parts = [];
    foreach ($blocks as $block) {
        if (($block['type'] ?? '') === 'text' && isset($block['text'])) {
            $parts[] = (string)$block['text'];
        }
    }
    if (count($parts) === 0) {
        fail('Anthropic response returned no text content.');
    }
    return implode("\n", $parts);
}

function fail(string $message): void
{
    fwrite(STDERR, 'ERROR: ' . $message . "\n");
    exit(1);
}
