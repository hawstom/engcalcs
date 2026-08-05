<?php
/**
 * Lang-key parity checker.
 *
 * Compares lib/lang.ec.*.php files against lib/lang.ec.en.php and reports:
 * - missing keys
 * - extra keys
 * - values still equal to English (excluding keys in translation_exempt_keys.json,
 *   which are correctly identical -- symbols, eponyms, brands, cognates; ROADMAP Task 161)
 * - keys OUT OF SCOPE under the coverage declaration (ROADMAP Tasks 203/204), reported
 *   in their own bucket and never as missing: a body we have decided not to translate
 *   into a non-core language is not debt, and counting it as debt is what would make the
 *   missing-key number meaningless.
 *
 * Usage:
 *   php scripts/lang_parity_check.php
 *   php scripts/lang_parity_check.php --lang=es,fr --prefix=dw,hw
 *   php scripts/lang_parity_check.php --strict
 *   php scripts/lang_parity_check.php --ignore-coverage   (raw full-parity view)
 */

const DEFAULT_LANG_DIR = __DIR__ . '/../../lib';
const EN_FILE = DEFAULT_LANG_DIR . '/lang.ec.en.php';

require_once __DIR__ . '/exempt_keys.inc.php';
require_once __DIR__ . '/coverage.inc.php';
require_once __DIR__ . '/lang_parse.inc.php';

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

    $exemptMap = ecLoadExemptMap();
    // --ignore-coverage restores the pre-Task-204 view: every key expected in every
    // language. Kept because "what would full parity cost?" is a real question when
    // deciding whether a cell should become core -- it is just not the default one.
    $coverage = $opts['ignore_coverage'] ? null : ecLoadCoverage();
    if ($coverage !== null) {
        echo ecCoverageSummary($coverage) . "\n";
    } else {
        echo "coverage: IGNORED (--ignore-coverage) -- every key expected in every language\n";
    }

    $totalMissing = 0;
    $totalExtra = 0;
    $totalEnglish = 0;
    $totalExempt = 0;
    $totalOutOfScope = 0;

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

        [$missing, $extra, $englishEqual, $exempt, $outOfScope] =
            compareLanguage($en, $parsed, $opts['prefixes'], $lang, $exemptMap, $coverage);

        $totalMissing += count($missing);
        $totalExtra += count($extra);
        $totalEnglish += count($englishEqual);
        $totalExempt += count($exempt);
        $totalOutOfScope += count($outOfScope);

        echo "\n[{$lang}] " . basename($file) . "\n";
        echo '  missing: ' . count($missing) . "\n";
        echo '  extra: ' . count($extra) . "\n";
        echo '  equal_to_english: ' . count($englishEqual) . "\n";
        echo '  exempt_identical: ' . count($exempt) . "\n";
        echo '  out_of_scope: ' . count($outOfScope) . "\n";

        printList('missing_keys', $missing);
        printList('extra_keys', $extra);
        printList('english_equal_keys', $englishEqual);
    }

    echo "\n=== Totals ===\n";
    echo 'missing: ' . $totalMissing . "\n";
    echo 'extra: ' . $totalExtra . "\n";
    echo 'equal_to_english: ' . $totalEnglish . "\n";
    echo 'exempt_identical: ' . $totalExempt . " (correctly identical to English; not debt)\n";
    echo 'out_of_scope: ' . $totalOutOfScope . " (deliberately untranslated per the coverage declaration; not debt)\n";

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
        'ignore_coverage' => false,
    ];

    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];

        if ($arg === '--strict') {
            $opts['strict'] = true;
            continue;
        }

        if ($arg === '--ignore-coverage') {
            $opts['ignore_coverage'] = true;
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
    echo "  --ignore-coverage Expect every key in every language (pre-Task-204 view)\n";
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

/**
 * Returns [missing, extra, englishEqual, exempt, outOfScope]. Three different reasons a
 * key is not flagged as debt, and they are NOT interchangeable:
 *   exempt     -- equals English and is correctly so forever (symbol, eponym, cognate).
 *   outOfScope -- this (calculator x language) cell is not one we have decided to
 *                 translate; the key is not started, and the cell can earn its way in.
 *   translated -- the ordinary case.
 * Missing keys are reported regardless of exemption, but NOT regardless of scope: an
 * out-of-scope body being absent is the intended state, not a finding.
 *
 * The exempt tests come from exempt_keys.inc.php and the scope test from
 * coverage.inc.php, both shared with the payload generator, so no two tools can report
 * different "untranslated" counts for the same files.
 */
function compareLanguage(array $en, array $current, array $prefixes, string $lang, array $exemptMap, ?array $coverage): array
{
    $missing = [];
    $extra = [];
    $englishEqual = [];
    $exempt = [];
    $outOfScope = [];

    foreach ($en as $key => $enValue) {
        if (!prefixAllowed($key, $prefixes)) {
            continue;
        }

        // Find the GAP first, then ask whether we meant to fill it. Scope must never be
        // consulted about a key that is already translated: at adoption every cell in the
        // suite except lpn_ is fully translated, and re-labelling that finished work
        // "out of scope" would report an intention to abandon it. Task 203 deletes nothing.
        $gap = false;

        if (!array_key_exists($key, $current)) {
            $gap = true;
        } elseif (normalizeForCompare((string)$current[$key]) === normalizeForCompare((string)$enValue)) {
            if (ecIsExemptFromEnglishEquality($key, $lang, $exemptMap)
                || ecIsUniversalKey($key, (string)$enValue)) {
                $exempt[] = $key;   // finished, and correctly identical -- not a gap at all
                continue;
            }
            $gap = true;
        }

        if (!$gap) {
            continue;
        }

        if ($coverage !== null && !ecCoverageKeyInScope($key, $lang, $coverage)) {
            $outOfScope[] = $key;
            continue;
        }

        if (!array_key_exists($key, $current)) {
            $missing[] = $key;
        } else {
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
    sort($exempt);
    sort($outOfScope);

    return [$missing, $extra, $englishEqual, $exempt, $outOfScope];
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

/**
 * Values as PHP would produce them -- escapes resolved, which is what comparison needs
 * (Haws\'a must equal Haws'a).
 *
 * This was the working reference implementation while lang_syntax_validate.php carried a
 * weaker single-quote-only regex; both now defer to the shared parser (ROADMAP Task 163)
 * so the two tools cannot disagree about what a language file contains. Behavior is
 * unchanged except that escapes are unescaped per PHP's actual rules rather than by
 * stripcslashes(), which also resolves \n and \t that a single-quoted PHP string does not.
 */
function parseLangAssignments(string $content): array
{
    return ecLangValues($content);
}

/**
 * Normalizes a string for equality comparison so that an HTML-entity form
 * (e.g. &ndash;, &times;) and its literal UTF-8 character (e.g. –, ×) are
 * treated as identical rather than as a false "translated" difference.
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
