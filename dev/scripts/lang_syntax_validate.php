<?php
/**
 * Language-file syntax validator.
 *
 * Checks all lib/lang.ec.*.php files and reports file:line findings for:
 * - php -l syntax errors
 * - unexpected close tags / code outside PHP scope
 * - malformed $ec_lang assignment lines
 * - duplicate keys
 *
 * Usage:
 *   php scripts/lang_syntax_validate.php
 *   php scripts/lang_syntax_validate.php --lang=es,fr
 */

const DEFAULT_LANG_DIR = __DIR__ . '/../../lib';

main($argv);

function main(array $argv): void
{
    $opts = parseArgs($argv);

    $files = glob(DEFAULT_LANG_DIR . '/lang.ec.*.php');
    if ($files === false || count($files) === 0) {
        fail('No language files found under ' . DEFAULT_LANG_DIR);
    }
    sort($files);

    $issues = [];

    foreach ($files as $file) {
        if (!preg_match('/lang\.ec\.([a-z]{2})\.php$/', $file, $m)) {
            continue;
        }

        $lang = $m[1];
        if (count($opts['languages']) > 0 && !in_array($lang, $opts['languages'], true)) {
            continue;
        }

        $content = (string)file_get_contents($file);

        $issues = array_merge($issues, lintFile($file));
        $issues = array_merge($issues, detectCloseTagIssues($file, $content));
        $issues = array_merge($issues, detectOutOfScopeAssignments($file, $content));
        $issues = array_merge($issues, detectDuplicateKeys($file, $content));
    }

    if (count($issues) === 0) {
        echo "No syntax validator findings.\n";
        exit(0);
    }

    foreach ($issues as $issue) {
        echo $issue . "\n";
    }

    echo "\nTotal findings: " . count($issues) . "\n";
    exit(1);
}

function parseArgs(array $argv): array
{
    $opts = ['languages' => []];

    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];

        if (strpos($arg, '--lang=') === 0) {
            $opts['languages'] = splitCsv(substr($arg, strlen('--lang=')));
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
    echo "Usage: php scripts/lang_syntax_validate.php [options]\n";
    echo "\nOptions:\n";
    echo "  --lang=es,fr      Limit to specific language codes\n";
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

function lintFile(string $file): array
{
    $escaped = escapeshellarg($file);
    $cmd = 'php -l ' . $escaped . ' 2>&1';
    exec($cmd, $output, $code);

    if ($code === 0) {
        return [];
    }

    $joined = implode("\n", $output);
    $line = 1;
    if (preg_match('/on line (\d+)/', $joined, $m)) {
        $line = (int)$m[1];
    }

    return [formatIssue($file, $line, 'php-lint', trim($joined))];
}

function detectCloseTagIssues(string $file, string $content): array
{
    $issues = [];

    if (!preg_match_all('/\?>/', $content, $matches, PREG_OFFSET_CAPTURE)) {
        return $issues;
    }

    $closeOffsets = array_map(static function ($m) {
        return (int)$m[1];
    }, $matches[0]);

    foreach ($closeOffsets as $offset) {
        $after = substr($content, $offset + 2);
        if (trim($after) !== '') {
            $issues[] = formatIssue($file, lineAtOffset($content, $offset), 'premature-close-tag', 'Non-whitespace content appears after ?> tag.');
        }
    }

    return $issues;
}

function detectOutOfScopeAssignments(string $file, string $content): array
{
    $issues = [];
    $phpRanges = getPhpRanges($content);

    if (!preg_match_all('/^[ \t]*\$ec_lang\s*\[/m', $content, $matches, PREG_OFFSET_CAPTURE)) {
        return $issues;
    }

    foreach ($matches[0] as $m) {
        $offset = (int)$m[1];
        if (!offsetInRanges($offset, $phpRanges)) {
            $issues[] = formatIssue($file, lineAtOffset($content, $offset), 'out-of-scope-key', '$ec_lang assignment appears outside PHP scope.');
        }
    }

    return $issues;
}

function detectDuplicateKeys(string $file, string $content): array
{
    $issues = [];
    $seen = [];

    $pattern = '/\$ec_lang\[\'([^\']+)\'\]\s*=\s*(\'((?:[^\\\']|\\.)*)\'|"((?:[^\\"]|\\.)*)"|([^;]*));/m';
    preg_match_all($pattern, $content, $matches, PREG_OFFSET_CAPTURE);

    if (!isset($matches[1])) {
        return $issues;
    }

    for ($i = 0; $i < count($matches[1]); $i++) {
        $key = (string)$matches[1][$i][0];
        $fullMatchOffset = (int)$matches[0][$i][1];
        $line = lineAtOffset($content, $fullMatchOffset);

        if (isset($seen[$key])) {
            $issues[] = formatIssue($file, $line, 'duplicate-key', 'Duplicate key: ' . $key . ' (first seen on line ' . $seen[$key] . ').');
        } else {
            $seen[$key] = $line;
        }
    }

    return $issues;
}

function getPhpRanges(string $content): array
{
    $ranges = [];
    $offset = 0;

    while (true) {
        $open = strpos($content, '<?php', $offset);
        if ($open === false) {
            break;
        }

        $close = strpos($content, '?>', $open + 5);
        if ($close === false) {
            $ranges[] = [$open, strlen($content)];
            break;
        }

        $ranges[] = [$open, $close + 2];
        $offset = $close + 2;
    }

    return $ranges;
}

function offsetInRanges(int $offset, array $ranges): bool
{
    foreach ($ranges as $range) {
        if ($offset >= $range[0] && $offset < $range[1]) {
            return true;
        }
    }
    return false;
}

function lineAtOffset(string $content, int $offset): int
{
    return substr_count(substr($content, 0, $offset), "\n") + 1;
}

function formatIssue(string $file, int $line, string $type, string $message): string
{
    return $file . ':' . $line . ' [' . $type . '] ' . $message;
}

function fail(string $message): void
{
    fwrite(STDERR, 'ERROR: ' . $message . "\n");
    exit(1);
}
