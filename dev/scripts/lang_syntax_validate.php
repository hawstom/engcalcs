<?php
/**
 * Language-file syntax validator.
 *
 * Checks all lib/lang.ec.*.php files and reports file:line findings for:
 * - php -l syntax errors
 * - unexpected close tags / code outside PHP scope
 * - malformed $ec_lang assignment lines
 * - duplicate keys
 * - JSON-escape leakage: literal \/ or \" inside values (renders as garbage HTML)
 * - <sub>/<span>/<sup> tag-count imbalance within a value
 * - foreign-script characters (Hangul/Kana) that indicate model contamination
 * - values byte-identical to the English source (untranslated content)
 * - HTML entities in strings bound to a title="" attribute (they double-escape and show
 *   literally in the tooltip); the key set is derived from the app source, not hand-listed
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
    $enValues = extractValues((string)file_get_contents(DEFAULT_LANG_DIR . '/lang.ec.en.php'));
    // Derived attribute-bound key list. Rule A (detectEntities) is absolute and needs no
    // scoping, so nothing consumes this yet -- it is the foundation for Task 140 steps 3
    // (Rules B and C). Keep it wired up here so that work starts from a live call site.
    $attrKeys = attributeBoundKeys();
    unset($attrKeys);

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
        $issues = array_merge($issues, detectEscapeLeakage($file, $content));
        $issues = array_merge($issues, detectTagImbalance($file, $content));
        $issues = array_merge($issues, detectForeignScript($file, $content));
        $issues = array_merge($issues, detectEntities($file, $content));
        if ($lang !== 'en') {
            $issues = array_merge($issues, detectUntranslatedValues($file, $content, $enValues));
        }
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

function extractValues(string $content): array
{
    $values = [];
    if (preg_match_all("/\\\$ec_lang\\['([^']+)'\\]\\s*=\\s*'((?:[^'\\\\]|\\\\.)*)';/", $content, $m, PREG_SET_ORDER)) {
        foreach ($m as $match) {
            $values[$match[1]] = $match[2];
        }
    }
    return $values;
}

/** Literal \/ or \" inside a single-quoted PHP value renders as garbage in HTML. */
function detectEscapeLeakage(string $file, string $content): array
{
    $issues = [];
    foreach (['\\/' => 'escaped-slash', '\\"' => 'escaped-quote'] as $needle => $type) {
        $offset = 0;
        while (($pos = strpos($content, $needle, $offset)) !== false) {
            $issues[] = formatIssue($file, lineAtOffset($content, $pos), $type, 'JSON-escape leakage: literal ' . $needle . ' inside value.');
            $offset = $pos + strlen($needle);
        }
    }
    return $issues;
}

/** Unbalanced <sub>/<sup>/<span> open/close counts within a single value. */
function detectTagImbalance(string $file, string $content): array
{
    $issues = [];
    foreach (extractValues($content) as $key => $value) {
        foreach (['sub', 'sup', 'span'] as $tag) {
            $open = preg_match_all('/<' . $tag . '[\s>]/', $value);
            $close = preg_match_all('/<\/' . $tag . '>/', $value);
            if ($open !== $close) {
                $issues[] = formatIssue($file, lineAtOffset($content, (int)strpos($content, "['" . $key . "']")), 'tag-imbalance', $key . ': <' . $tag . '> open=' . $open . ' close=' . $close . '.');
            }
        }
    }
    return $issues;
}

/** Hangul or Kana characters are never valid in any EngCalcs language — model contamination. */
function detectForeignScript(string $file, string $content): array
{
    $issues = [];
    if (preg_match_all('/[\x{AC00}-\x{D7AF}\x{1100}-\x{11FF}\x{3040}-\x{30FF}]/u', $content, $m, PREG_OFFSET_CAPTURE)) {
        foreach ($m[0] as $hit) {
            $issues[] = formatIssue($file, lineAtOffset($content, (int)$hit[1]), 'foreign-script', 'Hangul/Kana character "' . $hit[0] . '" — likely model contamination.');
        }
    }
    return $issues;
}

/**
 * Derives (from the app source, never a hand-maintained list) the set of $ec_lang keys whose
 * value ends up inside an HTML title="" attribute -- via PHP htmlspecialchars() in a label, or
 * via JS EngCalcs.escapeAttr() as a verdict/check tip. Both re-escape '&' -> '&amp;', so an HTML
 * entity in such a string (e.g. &mdash;) becomes &amp;mdash; and shows literally in the tooltip.
 * These keys must use literal Unicode characters, never entities. Self-maintaining: add a tip and
 * the guard covers it automatically -- this is the durable replacement for "remember not to".
 */
function attributeBoundKeys(): array
{
    $root = __DIR__ . '/../..';
    $keys = [];

    // PHP path: htmlspecialchars( [strip_tags(] $ec_lang['KEY'] ... ) -- label title attributes.
    foreach (glob($root . '/*.php') as $f) {
        $c = (string)file_get_contents($f);
        if (preg_match_all('/htmlspecialchars\(\s*(?:strip_tags\(\s*)?\$ec_lang\[\'([^\']+)\'\]/', $c, $m)) {
            foreach ($m[1] as $k) { $keys[$k] = true; }
        }
    }

    // JS path: keys passed as tip text to the verdict helpers -- either the value of any *Tip /
    // *tip object property (highTip, lowTip, okTip, ...) or the 3rd argument of writeCheckHTML().
    // A pageConfig/cfg property name is identical to its $ec_lang key.
    foreach (glob($root . '/js/*.js') as $f) {
        $c = (string)file_get_contents($f);
        if (preg_match_all('/\w*[Tt]ip\s*:\s*(?:EngCalcs\.)?(?:pageConfig|cfg)\.([A-Za-z0-9_]+)/', $c, $m)) {
            foreach ($m[1] as $k) { $keys[$k] = true; }
        }
        if (preg_match_all('/writeCheckHTML\s*\(([^)]*)\)/', $c, $m)) {
            foreach ($m[1] as $args) {
                $parts = explode(',', $args);
                if (count($parts) >= 3 && preg_match('/(?:pageConfig|cfg)\.([A-Za-z0-9_]+)/', $parts[2], $mm)) {
                    $keys[$mm[1]] = true;
                }
            }
        }
    }

    return array_keys($keys);
}

/**
 * ROADMAP Task 140, Rule A: no HTML entity in ANY language string, no exceptions.
 *
 * Absolute on purpose. The previous version of this check scoped itself to
 * attribute-bound keys, and that scoping is exactly how it failed: whether an
 * entity survives depends on the PHP/JS call site that consumes the string, which
 * is invisible from the string itself. Of this suite's three attribute paths, two
 * escape '&' first (htmlspecialchars(strip_tags()) in the page PHP, escapeAttr in
 * js/Calculators.lib.js), turning '&asymp;' into a literal '&asymp;' on screen.
 * A literal UTF-8 character is correct on all three paths, so there is no case to
 * reason about — which is the whole value of making the rule absolute.
 */
function detectEntities(string $file, string $content): array
{
    // Named replacements for everything the suite actually used before the Task 140
    // step-1 cleanup, so the finding tells the writer what to type instead.
    static $literals = [
        'mdash' => '—', 'ndash' => '–', 'minus' => '−', 'times' => '×',
        'divide' => '÷', 'asymp' => '≈', 'le' => '≤', 'ge' => '≥',
        'radic' => '√', 'sup2' => '²', 'middot' => '·', 'Delta' => 'Δ',
        'nu' => 'ν', 'tau' => 'τ', 'eta' => 'η', 'ldquo' => '“',
        'rdquo' => '”', 'rsquo' => '’', 'hellip' => '…', 'copy' => '©',
        'amp' => '&', 'lt' => '<', 'gt' => '>', 'quot' => '“ or ”',
        'nbsp' => 'a literal non-breaking space (U+00A0)',
    ];

    $issues = [];
    foreach (extractValues($content) as $key => $value) {
        if (!preg_match('/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);/', $value, $m)) {
            continue;
        }
        $name = trim($m[1]);
        $hint = isset($literals[$name])
            ? 'use the literal character ' . $literals[$name] . ' instead'
            : 'use the literal UTF-8 character instead';
        $issues[] = formatIssue(
            $file,
            lineAtOffset($content, (int)strpos($content, "['" . $key . "']")),
            'entity-in-lang-string',
            $key . ': HTML entity "' . $m[0] . '" is not allowed in a language string — ' . $hint . '.'
        );
    }
    return $issues;
}

/** Value byte-identical to English where English contains a real word (>=4 letters). Warning-grade. */
function detectUntranslatedValues(string $file, string $content, array $enValues): array
{
    $issues = [];
    foreach (extractValues($content) as $key => $value) {
        $en = $enValues[$key] ?? null;
        if ($en === null || $value !== $en) {
            continue;
        }
        $plain = preg_replace('/&\w+;|<[^>]+>/', '', $en);
        if (preg_match('/[a-zA-Z]{4,}/', (string)$plain)) {
            $issues[] = formatIssue($file, lineAtOffset($content, (int)strpos($content, "['" . $key . "']")), 'identical-to-english', $key . ' is byte-identical to the English source.');
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
