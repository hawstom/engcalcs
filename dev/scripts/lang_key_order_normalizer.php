<?php
/**
 * Lang-file key-order normalizer.
 *
 * Rewrites each lib/lang.ec.??.php so its $ec_lang[] key order matches
 * lib/lang.ec.en.php exactly. Keys accumulate in insertion order over many
 * translation sprints, which makes git diffs noisy and parity-checker output
 * hard to read. This script fixes the order without touching any value.
 *
 * Values, quoting style, and trailing same-line comments are preserved
 * byte-for-byte; only the sequence of statements changes. Section-header
 * comments are re-derived from the English file's structure (comments are
 * dev-facing, not translated content). Each file's own preamble (the
 * `<?php` opening plus its own leading comment block) is left untouched.
 * $ec_lang_intent is English-only and is never reordered here.
 *
 * Usage:
 *   php scripts/lang_key_order_normalizer.php               # rewrite all non-English files
 *   php scripts/lang_key_order_normalizer.php --lang=es,fr   # limit to specific languages
 *   php scripts/lang_key_order_normalizer.php --check        # exit 1 if any file is out of order (no writes)
 *   php scripts/lang_key_order_normalizer.php --dry-run       # print which files would change (no writes)
 */

const LANG_DIR = __DIR__ . '/../../lib';
const EN_FILE = LANG_DIR . '/lang.ec.en.php';

main($argv);

function main(array $argv): void
{
    $opts = parseArgs($argv);

    if (!file_exists(EN_FILE)) {
        fail('English language file not found: ' . EN_FILE);
    }

    $enContent = (string)file_get_contents(EN_FILE);
    $enRecords = tokenizeLangFile($enContent, true);
    [$canonicalKeys, $precedingFiller] = buildCanonicalStructure($enRecords);

    if (count($canonicalKeys) === 0) {
        fail('No keys parsed from English language file.');
    }

    $langFiles = glob(LANG_DIR . '/lang.ec.*.php');
    if ($langFiles === false || count($langFiles) === 0) {
        fail('No language files found under ' . LANG_DIR);
    }
    sort($langFiles);

    $changedCount = 0;
    $checkFailed = false;

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

        $original = (string)file_get_contents($file);
        $rebuilt = rebuildTargetFile($original, $canonicalKeys, $precedingFiller);

        if ($rebuilt === $original) {
            continue;
        }

        $changedCount++;

        if ($opts['check']) {
            echo "OUT OF ORDER: {$lang} (" . basename($file) . ")\n";
            $checkFailed = true;
            continue;
        }

        if ($opts['dryRun']) {
            echo "WOULD REORDER: {$lang} (" . basename($file) . ")\n";
            continue;
        }

        file_put_contents($file, $rebuilt);
        echo "Reordered: {$lang} (" . basename($file) . ")\n";
    }

    if ($opts['check']) {
        if ($checkFailed) {
            echo "\n{$changedCount} file(s) out of order.\n";
            exit(1);
        }
        echo "All language files match English key order.\n";
        return;
    }

    if ($opts['dryRun']) {
        echo "\n{$changedCount} file(s) would be reordered.\n";
        return;
    }

    echo "\n{$changedCount} file(s) reordered.\n";
}

function parseArgs(array $argv): array
{
    $opts = [
        'languages' => [],
        'check' => false,
        'dryRun' => false,
    ];

    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];

        if ($arg === '--check') {
            $opts['check'] = true;
            continue;
        }

        if ($arg === '--dry-run') {
            $opts['dryRun'] = true;
            continue;
        }

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
    echo "Usage: php scripts/lang_key_order_normalizer.php [options]\n";
    echo "\nOptions:\n";
    echo "  --lang=es,fr   Limit to specific language codes\n";
    echo "  --check        Exit 1 if any file's key order doesn't match English (no writes)\n";
    echo "  --dry-run      Print which files would change, without writing\n";
    echo "  -h, --help     Show this help\n";
    exit(0);
}

function splitCsv(string $value): array
{
    $parts = array_filter(array_map('trim', explode(',', $value)), static function ($v) {
        return $v !== '';
    });
    return array_values(array_unique($parts));
}

/**
 * Tokenizes a lang file into an ordered list of records:
 *   ['type' => 'filler',    'text' => string]                 whitespace, comments, <?php, init lines
 *   ['type' => 'keyline',   'key' => string, 'raw' => string]  a $ec_lang['key'] = ...; statement
 *   ['type' => 'intentline','key' => string, 'raw' => string]  a $ec_lang_intent['key'] = ...; statement
 *
 * Concatenating every record's text/raw in order reproduces the original
 * file byte-for-byte, so no formatting is lost.
 */
function tokenizeLangFile(string $content, bool $allowIntent): array
{
    $tokens = token_get_all($content);
    $records = [];
    $filler = '';
    $i = 0;
    $n = count($tokens);

    while ($i < $n) {
        $tok = $tokens[$i];
        $text = is_array($tok) ? $tok[1] : $tok;
        $id = is_array($tok) ? $tok[0] : null;

        $isTargetVar = $id === T_VARIABLE && ($text === '$ec_lang' || ($allowIntent && $text === '$ec_lang_intent'));

        if (!$isTargetVar) {
            $filler .= $text;
            $i++;
            continue;
        }

        // Peek past whitespace to see whether this is `$ec_lang[` (a real
        // entry) or `$ec_lang =` (the top-of-file array initializer).
        $j = $i + 1;
        while ($j < $n && is_array($tokens[$j]) && $tokens[$j][0] === T_WHITESPACE) {
            $j++;
        }
        $nextText = $j < $n ? (is_array($tokens[$j]) ? $tokens[$j][1] : $tokens[$j]) : '';

        if ($nextText !== '[') {
            // Init line or unrecognized shape: treat as filler through ';'.
            [$stmt, $i] = consumeThroughSemicolon($tokens, $i, $n);
            $filler .= $stmt;
            continue;
        }

        // Real `$ec_lang['key'] = ...;` (or intent) statement.
        $keyTok = $tokens[$j + 1] ?? null;
        $key = null;
        if (is_array($keyTok) && $keyTok[0] === T_CONSTANT_ENCAPSED_STRING) {
            $key = trim($keyTok[1], "'\"");
        }

        [$stmt, $newI] = consumeThroughSemicolon($tokens, $i, $n);

        // Attach a trailing same-line comment (e.g. `; //no`) to this statement.
        [$trailing, $newI] = consumeTrailingSameLineComment($tokens, $newI, $n);
        $stmt .= $trailing;

        if ($key === null) {
            // Couldn't identify a key; keep the statement as filler so no
            // content is lost.
            $filler .= $stmt;
            $i = $newI;
            continue;
        }

        if ($filler !== '') {
            $records[] = ['type' => 'filler', 'text' => $filler];
            $filler = '';
        }

        $records[] = [
            'type' => $text === '$ec_lang' ? 'keyline' : 'intentline',
            'key' => $key,
            'raw' => $stmt,
        ];
        $i = $newI;
    }

    if ($filler !== '') {
        $records[] = ['type' => 'filler', 'text' => $filler];
    }

    return $records;
}

function consumeThroughSemicolon(array $tokens, int $start, int $n): array
{
    $text = '';
    $i = $start;
    while ($i < $n) {
        $tok = $tokens[$i];
        $tokText = is_array($tok) ? $tok[1] : $tok;
        $text .= $tokText;
        $i++;
        if ($tokText === ';') {
            break;
        }
    }
    return [$text, $i];
}

/**
 * If the statement is immediately followed (on the same line, i.e. with only
 * non-newline whitespace in between) by a `//` comment, consume and return
 * it so it stays attached to the statement it annotates.
 */
function consumeTrailingSameLineComment(array $tokens, int $start, int $n): array
{
    $i = $start;
    $ws = '';
    while ($i < $n && is_array($tokens[$i]) && $tokens[$i][0] === T_WHITESPACE && strpos($tokens[$i][1], "\n") === false) {
        $ws .= $tokens[$i][1];
        $i++;
    }

    if ($i < $n && is_array($tokens[$i]) && $tokens[$i][0] === T_COMMENT && strpos($tokens[$i][1], '//') === 0) {
        return [$ws . $tokens[$i][1], $i + 1];
    }

    return ['', $start];
}

/**
 * From English's record list, builds:
 *   - the canonical key order (array of key strings)
 *   - the filler text that precedes each key in the English source
 */
function buildCanonicalStructure(array $enRecords): array
{
    $canonicalKeys = [];
    $precedingFiller = [];
    $pending = '';

    foreach ($enRecords as $record) {
        if ($record['type'] === 'filler') {
            $pending .= $record['text'];
            continue;
        }

        if ($record['type'] === 'intentline') {
            // Intent lines don't exist in non-English files; drop any filler
            // that separated a key from its own intent line (just a newline).
            $pending = '';
            continue;
        }

        // keyline
        $canonicalKeys[] = $record['key'];
        $precedingFiller[$record['key']] = $pending;
        $pending = '';
    }

    return [$canonicalKeys, $precedingFiller];
}

function rebuildTargetFile(string $original, array $canonicalKeys, array $precedingFiller): string
{
    $records = tokenizeLangFile($original, false);

    $preamble = '';
    $keyRaw = [];
    $keyOrderInTarget = [];
    $firstKeySeen = false;
    $trailingFiller = '';

    foreach ($records as $record) {
        if ($record['type'] === 'filler') {
            if (!$firstKeySeen) {
                $preamble .= $record['text'];
            } else {
                $trailingFiller .= $record['text'];
            }
            continue;
        }

        // keyline
        $firstKeySeen = true;
        $keyRaw[$record['key']] = $record['raw'];
        $keyOrderInTarget[] = $record['key'];
        $trailingFiller = '';
    }

    $extraKeys = array_values(array_diff($keyOrderInTarget, $canonicalKeys));

    // Build the list of present-in-target keys in canonical (English) order,
    // carrying forward the filler owed to each (a missing key's section
    // comment rolls onto the next key that's actually present).
    $presentKeys = [];
    $fillerForKey = [];
    $accumulatedFiller = '';

    foreach ($canonicalKeys as $key) {
        if (!array_key_exists($key, $keyRaw)) {
            $accumulatedFiller .= $precedingFiller[$key];
            continue;
        }

        $fillerForKey[$key] = $accumulatedFiller . $precedingFiller[$key];
        $accumulatedFiller = '';
        $presentKeys[] = $key;
    }

    $firstKey = $presentKeys[0] ?? null;

    // A handful of translations reference an earlier key's own value via
    // PHP's bareword string interpolation (e.g. "$ec_lang[u_grade]") instead
    // of retranslating it. Pure English-order reordering can flip such a
    // pair and silently break that reference at runtime (the referenced key
    // would no longer be assigned yet). Re-sort to respect those
    // dependencies, keeping English order everywhere else.
    $deps = extractDependencies($keyRaw, array_flip($presentKeys));
    $finalOrder = topoSortStable($presentKeys, $deps);

    $out = $preamble;
    foreach ($finalOrder as $key) {
        if ($key !== $firstKey) {
            $out .= $fillerForKey[$key];
        }
        $out .= $keyRaw[$key];
    }

    foreach ($extraKeys as $key) {
        $out .= $keyRaw[$key];
    }

    $out .= $trailingFiller;

    return $out;
}

/**
 * Finds, for each key, which other present keys it references via PHP's
 * unquoted array-interpolation syntax inside double-quoted strings
 * (`"...$ec_lang[otherkey]..."`) — a dependency that must be assigned first.
 */
function extractDependencies(array $keyRaw, array $presentKeySet): array
{
    $deps = [];

    foreach ($keyRaw as $key => $raw) {
        if (!preg_match_all('/\$ec_lang(?:_intent)?\[([A-Za-z_][A-Za-z0-9_]*)\]/', $raw, $m)) {
            continue;
        }

        foreach ($m[1] as $refKey) {
            if ($refKey === $key || !isset($presentKeySet[$refKey])) {
                continue;
            }
            $deps[$key][$refKey] = true;
        }
    }

    return array_map('array_keys', $deps);
}

/**
 * Topologically sorts $keys so every dependency in $deps precedes its
 * dependent, otherwise preserving the original relative order (DFS,
 * visiting in input order). Dependency cycles are ignored defensively
 * (should not occur for simple same-file string interpolation).
 */
function topoSortStable(array $keys, array $deps): array
{
    $result = [];
    $state = []; // 0/unset = unvisited, 1 = visiting, 2 = done

    $visit = function (string $key) use (&$visit, &$result, &$state, $deps): void {
        if (($state[$key] ?? 0) !== 0) {
            return;
        }
        $state[$key] = 1;
        foreach ($deps[$key] ?? [] as $dep) {
            if (($state[$dep] ?? 0) === 1) {
                continue; // cycle guard
            }
            $visit($dep);
        }
        $state[$key] = 2;
        $result[] = $key;
    };

    foreach ($keys as $key) {
        $visit($key);
    }

    return $result;
}

function fail(string $message): void
{
    fwrite(STDERR, 'ERROR: ' . $message . "\n");
    exit(1);
}
