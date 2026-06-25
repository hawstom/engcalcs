<?php
/**
 * Lang-key parity checker.
 *
 * Compares lib/lang.ec.*.php files against lib/lang.ec.en.php and reports:
 * - missing keys
 * - extra keys
 * - values still equal to English
 *
 * Usage:
 *   php scripts/lang_parity_check.php
 *   php scripts/lang_parity_check.php --lang=es,fr --prefix=dw,hw
 *   php scripts/lang_parity_check.php --strict
 */

const DEFAULT_LANG_DIR = __DIR__ . '/../../lib';
const EN_FILE = DEFAULT_LANG_DIR . '/lang.ec.en.php';

main($argv);

function main(array $argv): void
{
    $opts = parseArgs($argv);

    if (!file_exists(EN_FILE)) {
        fail('English language file not found: ' . EN_FILE);
    }

    $en = parseLangAssignments((string)file_get_contents(EN_FILE));
    if (count($en) === 0) {
        fail('No keys parsed from English language file.');
    }

    $langFiles = glob(DEFAULT_LANG_DIR . '/lang.ec.*.php');
    if ($langFiles === false || count($langFiles) === 0) {
        fail('No language files found under ' . DEFAULT_LANG_DIR);
    }
    sort($langFiles);

    $totalMissing = 0;
    $totalExtra = 0;
    $totalEnglish = 0;

    foreach ($langFiles as $file) {
        if (!preg_match('/lang\.ec\.([a-z]{2})\.php$/', $file, $m)) {
            continue;
        }

        $lang = $m[1];
        if ($lang === 'en') {
            continue;
        }

        if (count($opts['languages']) > 0 && !in_array($lang, $opts['languages'], true)) {
            continue;
        }

        $parsed = parseLangAssignments((string)file_get_contents($file));

        [$missing, $extra, $englishEqual] = compareLanguage($en, $parsed, $opts['prefixes']);

        $totalMissing += count($missing);
        $totalExtra += count($extra);
        $totalEnglish += count($englishEqual);

        echo "\n[{$lang}] " . basename($file) . "\n";
        echo '  missing: ' . count($missing) . "\n";
        echo '  extra: ' . count($extra) . "\n";
        echo '  equal_to_english: ' . count($englishEqual) . "\n";

        printList('missing_keys', $missing);
        printList('extra_keys', $extra);
        printList('english_equal_keys', $englishEqual);
    }

    echo "\n=== Totals ===\n";
    echo 'missing: ' . $totalMissing . "\n";
    echo 'extra: ' . $totalExtra . "\n";
    echo 'equal_to_english: ' . $totalEnglish . "\n";

    if ($opts['strict'] && ($totalMissing > 0 || $totalExtra > 0 || $totalEnglish > 0)) {
        exit(1);
    }
}

function parseArgs(array $argv): array
{
    $opts = [
        'languages' => [],
        'prefixes' => [],
        'strict' => false,
    ];

    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];

        if ($arg === '--strict') {
            $opts['strict'] = true;
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

        fail('Unknown option: ' . $arg);
    }

    return $opts;
}

function printHelpAndExit(): void
{
    echo "Usage: php scripts/lang_parity_check.php [options]\n";
    echo "\nOptions:\n";
    echo "  --lang=es,fr      Limit to specific language codes\n";
    echo "  --prefix=dw,hw    Limit checks to key prefixes\n";
    echo "  --strict          Exit 1 if any mismatch is found\n";
    echo "  -h, --help        Show this help\n";
    exit(0);
}

function splitCsv(string $value): array
{
    $parts = array_filter(array_map('trim', explode(',', $value)), static function ($v) {
        return $v !== '';
    });
    return array_values(array_unique($parts));
}

function compareLanguage(array $en, array $current, array $prefixes): array
{
    $missing = [];
    $extra = [];
    $englishEqual = [];

    foreach ($en as $key => $enValue) {
        if (!prefixAllowed($key, $prefixes)) {
            continue;
        }

        if (!array_key_exists($key, $current)) {
            $missing[] = $key;
            continue;
        }

        if (trim((string)$current[$key]) === trim((string)$enValue)) {
            $englishEqual[] = $key;
        }
    }

    foreach ($current as $key => $_value) {
        if (!prefixAllowed($key, $prefixes)) {
            continue;
        }

        if (!array_key_exists($key, $en)) {
            $extra[] = $key;
        }
    }

    sort($missing);
    sort($extra);
    sort($englishEqual);

    return [$missing, $extra, $englishEqual];
}

function prefixAllowed(string $key, array $prefixes): bool
{
    if (count($prefixes) === 0) {
        return true;
    }

    $parts = explode('_', $key, 2);
    if (count($parts) < 2) {
        return false;
    }

    return in_array($parts[0], $prefixes, true);
}

function printList(string $label, array $keys): void
{
    if (count($keys) === 0) {
        return;
    }

    echo '  ' . $label . ': ' . implode(', ', $keys) . "\n";
}

function parseLangAssignments(string $content): array
{
    $pattern = '/\$ec_lang\[\'([^\']+)\'\]\s*=\s*(\'((?:[^\\\']|\\.)*)\'|"((?:[^\\"]|\\.)*)"|([^;]*));/m';
    preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);

    $values = [];
    foreach ($matches as $m) {
        $key = $m[1];
        if (isset($m[3]) && $m[3] !== '') {
            $values[$key] = stripcslashes($m[3]);
        } elseif (isset($m[4]) && $m[4] !== '') {
            $values[$key] = stripcslashes($m[4]);
        } else {
            $values[$key] = trim($m[5] ?? '');
        }
    }

    return $values;
}

function fail(string $message): void
{
    fwrite(STDERR, 'ERROR: ' . $message . "\n");
    exit(1);
}
