<?php
/**
 * Translation completion matrix.
 *
 * Produces a compact table with languages as rows and key prefixes as columns,
 * where each cell is the count of untranslated keys (missing, blank, or equal to English).
 *
 * Usage:
 *   php scripts/translation_completion_matrix.php
 *   php scripts/translation_completion_matrix.php --lang=fr,uk --prefix=dw,rc
 *   php scripts/translation_completion_matrix.php --format=csv
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

    $en = loadLangArray(EN_FILE);
    $allPrefixes = detectPrefixes($en);
    $prefixes = filterPrefixes($allPrefixes, $opts['prefixes']);
    if (count($prefixes) === 0) {
        fail('No prefixes matched selection.');
    }

    $langFiles = glob(DEFAULT_LANG_DIR . '/lang.ec.*.php');
    if ($langFiles === false || count($langFiles) === 0) {
        fail('No language files found under ' . DEFAULT_LANG_DIR);
    }
    sort($langFiles);

    $rows = [];
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

        $cur = loadLangArray($file);
        $row = ['lang' => $lang];
        $total = 0;
        foreach ($prefixes as $prefix) {
            $count = untranslatedCountForPrefix($en, $cur, $prefix);
            $row[$prefix] = $count;
            $total += $count;
        }
        $row['total'] = $total;
        $rows[] = $row;
    }

    usort($rows, static function ($a, $b) {
        return strcmp($a['lang'], $b['lang']);
    });

    if ($opts['format'] === 'csv') {
        printCsv($rows, $prefixes);
        return;
    }

    printTable($rows, $prefixes);
}

function parseArgs(array $argv): array
{
    $opts = [
        'languages' => [],
        'prefixes' => [],
        'format' => 'table',
    ];

    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];

        if (strpos($arg, '--lang=') === 0) {
            $opts['languages'] = splitCsv(substr($arg, strlen('--lang=')));
            continue;
        }

        if (strpos($arg, '--prefix=') === 0) {
            $opts['prefixes'] = splitCsv(substr($arg, strlen('--prefix=')));
            continue;
        }

        if (strpos($arg, '--format=') === 0) {
            $format = trim(substr($arg, strlen('--format=')));
            if (!in_array($format, ['table', 'csv'], true)) {
                fail('Unsupported format: ' . $format);
            }
            $opts['format'] = $format;
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
    echo "Usage: php scripts/translation_completion_matrix.php [options]\n";
    echo "\nOptions:\n";
    echo "  --lang=fr,uk       Limit to specific languages\n";
    echo "  --prefix=dw,rc     Limit to specific key prefixes\n";
    echo "  --format=table|csv Output format (default: table)\n";
    echo "  -h, --help         Show help\n";
    exit(0);
}

function splitCsv(string $value): array
{
    $parts = array_filter(array_map('trim', explode(',', $value)), static function ($v) {
        return $v !== '';
    });
    return array_values(array_unique($parts));
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

function filterPrefixes(array $all, array $selected): array
{
    if (count($selected) === 0) {
        return $all;
    }

    return array_values(array_filter($all, static function ($prefix) use ($selected) {
        return in_array($prefix, $selected, true);
    }));
}

function untranslatedCountForPrefix(array $en, array $cur, string $prefix): int
{
    $count = 0;
    foreach ($en as $key => $enValue) {
        if (!str_starts_with($key, $prefix . '_')) {
            continue;
        }

        if (!array_key_exists($key, $cur)) {
            $count++;
            continue;
        }

        $val = trim((string)$cur[$key]);
        if ($val === '' || $val === trim((string)$enValue)) {
            $count++;
        }
    }

    return $count;
}

function printCsv(array $rows, array $prefixes): void
{
    $header = array_merge(['lang'], $prefixes, ['total']);
    echo implode(',', $header) . "\n";

    foreach ($rows as $row) {
        $fields = [$row['lang']];
        foreach ($prefixes as $prefix) {
            $fields[] = (string)$row[$prefix];
        }
        $fields[] = (string)$row['total'];
        echo implode(',', $fields) . "\n";
    }
}

function printTable(array $rows, array $prefixes): void
{
    $header = array_merge(['lang'], $prefixes, ['total']);
    $widths = [];
    foreach ($header as $col) {
        $widths[$col] = strlen($col);
    }

    foreach ($rows as $row) {
        $widths['lang'] = max($widths['lang'], strlen($row['lang']));
        foreach ($prefixes as $prefix) {
            $widths[$prefix] = max($widths[$prefix], strlen((string)$row[$prefix]));
        }
        $widths['total'] = max($widths['total'], strlen((string)$row['total']));
    }

    $dividerParts = [];
    $headerParts = [];
    foreach ($header as $col) {
        $headerParts[] = str_pad($col, $widths[$col], ' ', STR_PAD_RIGHT);
        $dividerParts[] = str_repeat('-', $widths[$col]);
    }

    echo implode('  ', $headerParts) . "\n";
    echo implode('  ', $dividerParts) . "\n";

    foreach ($rows as $row) {
        $parts = [str_pad($row['lang'], $widths['lang'], ' ', STR_PAD_RIGHT)];
        foreach ($prefixes as $prefix) {
            $parts[] = str_pad((string)$row[$prefix], $widths[$prefix], ' ', STR_PAD_LEFT);
        }
        $parts[] = str_pad((string)$row['total'], $widths['total'], ' ', STR_PAD_LEFT);
        echo implode('  ', $parts) . "\n";
    }
}

function fail(string $message): void
{
    fwrite(STDERR, 'ERROR: ' . $message . "\n");
    exit(1);
}
