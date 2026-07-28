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
 * - values byte-identical to the English source (untranslated content), skipping keys
 *   that are correctly identical per exempt_keys.inc.php (ROADMAP Task 161)
 * - Rule A: HTML entities in ANY language string (they double-escape on two of the three
 *   attribute paths and show literally on screen)
 * - Rule B: HTML tags in a plain-text-constrained string -- one bound to a plain-text
 *   attribute (title/placeholder/value/alt/aria-label/data-*) or named _tip/_plain. The
 *   bound key set is derived from the app source, never hand-listed.
 * - Rule B (embedded): tags or entities inside a title="..." that a language string writes
 *   itself. Half the suite's tooltips live inside label strings this way; without this pass
 *   they are invisible to every other check.
 * - Rule C (advisory): the name and the derivation disagree -- a key reaching a plain-text
 *   attribute without a _tip/_plain name, or named but only ever used in page HTML.
 *
 * Usage:
 *   php scripts/lang_syntax_validate.php
 *   php scripts/lang_syntax_validate.php --lang=es,fr
 */

const DEFAULT_LANG_DIR = __DIR__ . '/../../lib';

/**
 * Attributes that hold plain text only. A tag written into one of these never renders as
 * markup by any delivery route -- <sub> in a title="" is not a subscript, it is either
 * stripped or shown literally depending on the call site's escaping.
 *
 * href/src/class/id/style are deliberately absent: they are not displayed text, and a
 * language string has no business in them anyway.
 */
const PLAIN_TEXT_ATTRS = 'title|placeholder|value|alt|aria-label|data-[a-z-]+';

require_once __DIR__ . '/exempt_keys.inc.php';

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
    // Derived plain-text-bound key list, shared by Rules B and C. Rule A (detectEntities) is
    // absolute and needs no scoping; Rule B does, and this derivation -- not a hand-list and
    // not the key's name -- is what enforces it. A name is a claim; the code is the fact.
    $plainKeys = plainTextBoundKeys();
    // Keys allowed to be byte-identical to English (ROADMAP Task 161); shared with the
    // payload generator, parity checker, and completion matrix so all four agree.
    $exemptMap = ecLoadExemptMap();

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
        $issues = array_merge($issues, detectPlainTextTags($file, $content, $plainKeys));
        $issues = array_merge($issues, detectEmbeddedTipDefects($file, $content));
        if ($lang === 'en' && $opts['ruleC']) {
            $issues = array_merge($issues, detectNameDerivationMismatch($file, $content, $plainKeys));
        }
        if ($lang !== 'en') {
            $issues = array_merge($issues, detectUntranslatedValues($file, $content, $enValues, $lang, $exemptMap));
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
    $opts = ['languages' => [], 'ruleC' => false];

    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];

        if (strpos($arg, '--lang=') === 0) {
            $opts['languages'] = splitCsv(substr($arg, strlen('--lang=')));
            continue;
        }

        if ($arg === '--rule-c') {
            $opts['ruleC'] = true;
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
    echo "  --rule-c          Also report Rule C advisories (name vs. derivation disagreement).\n";
    echo "                    Off by default: 31 keys disagree on purpose -- the 18 _main_desc\n";
    echo "                    keys have two destinations at once, so no single name fits.\n";
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
 * value ends up somewhere that can hold plain text only -- an HTML attribute in the page PHP,
 * or a JS verdict/check tip fed through EngCalcs.escapeAttr().
 *
 * Returns key => short description of where it lands, so a finding can name the call site.
 *
 * Widened for Task 140 step 3 (2026-07-27) from the original htmlspecialchars()-only version,
 * which saw neither lib/*.php nor the five non-title plain-text attributes the suite already
 * uses (placeholder in Calculators.lib.php and Menus.lib.php, value in contact.php,
 * data-copied-text in Menus.lib.php). Scanning every attr="..." rather than title= alone is
 * the whole point: the previous narrow scoping is how the old entity check missed things.
 *
 * Self-maintaining: add a tip or a new attribute-bound label and the guard covers it
 * automatically -- the durable replacement for "remember not to".
 */
function plainTextBoundKeys(): array
{
    $root = __DIR__ . '/../..';
    $keys = [];

    $phpFiles = array_merge(glob($root . '/*.php') ?: [], glob($root . '/lib/*.php') ?: []);
    foreach ($phpFiles as $f) {
        $c = (string)file_get_contents($f);
        $rel = basename(dirname($f)) === 'lib' ? 'lib/' . basename($f) : basename($f);

        // Explicit escaping around a lang key -- htmlspecialchars( [strip_tags(] $ec_lang['KEY'] ).
        // strip_tags() is NOT treated as an exemption: it means the tag silently vanishes rather
        // than showing literally, which is a degraded string, not a correct one.
        if (preg_match_all('/htmlspecialchars\(\s*(?:strip_tags\(\s*)?\$ec_lang\[\'([^\']+)\'\]/', $c, $m)) {
            foreach ($m[1] as $k) { $keys[$k] = $rel . ' (escaped attribute)'; }
        }

        // Generic attribute scan: any plain-text attribute whose value references a lang key,
        // whether short-echo interpolated or concatenated (' . $ec_lang['k'] . ').
        // Textual on purpose -- the attribute quotes survive both PHP forms unchanged.
        // (Deliberately not spelling out the short-echo tag here: a literal close-tag inside a
        // // comment ends PHP mode, which broke this file once already.)
        if (preg_match_all('/\b(' . PLAIN_TEXT_ATTRS . ')\s*=\s*"([^"]*)"/i', $c, $m, PREG_SET_ORDER)) {
            foreach ($m as $hit) {
                if (preg_match_all('/\$ec_lang\[\'([^\']+)\'\]/', $hit[2], $km)) {
                    foreach ($km[1] as $k) { $keys[$k] = $rel . ' (' . strtolower($hit[1]) . '="")'; }
                }
            }
        }

        // Meta-description route (Task 150): a page assigns $html_desc, and echoHTMLHead() escapes
        // it into <meta name="Description" content="...">. The attribute scan above cannot see it
        // -- the key and the attribute live in different files -- so the variable is the join.
        // Today every such key is a *_main_desc, already bound by Menus.lib.php's title=""; the
        // rule is here so a future page pointing $html_desc at some other key is still covered.
        if (preg_match_all('/\$html_desc\s*=\s*\$ec_lang\[\'([^\']+)\'\]/', $c, $m)) {
            foreach ($m[1] as $k) { $keys[$k] = $rel . ' (meta description)'; }
        }
    }

    // A pageConfig property name is NOT identical to its $ec_lang key -- the page PHP drops the
    // calculator prefix (or_regime_submerged_tip becomes regime_submerged_tip). The original
    // deriver assumed they matched, so the entire JS tip route silently resolved to nothing.
    // Found 2026-07-27 by Rule C's own 'named-but-unconstrained' advisory, which is exactly the
    // disagreement between name and derivation that Rule C exists to surface.
    $propToKey = pageConfigPropertyMap($phpFiles);

    // JS path: keys passed as tip text to the verdict helpers -- either the value of any *Tip /
    // *tip object property (highTip, lowTip, okTip, ...) or the 3rd argument of writeCheckHTML().
    // escapeAttr() does not strip tags, so a tag here shows literally in the tooltip.
    foreach (glob($root . '/js/*.js') as $f) {
        $c = (string)file_get_contents($f);
        $props = [];
        if (preg_match_all('/\w*[Tt]ip\s*:\s*(?:EngCalcs\.)?(?:pageConfig|cfg)\.([A-Za-z0-9_]+)/', $c, $m)) {
            foreach ($m[1] as $p) { $props[$p] = 'tip property'; }
        }
        foreach (callArguments($c, 'writeCheckHTML') as $parts) {
            if (count($parts) >= 3 && preg_match('/(?:pageConfig|cfg)\.([A-Za-z0-9_]+)/', $parts[2], $mm)) {
                $props[$mm[1]] = 'writeCheckHTML tip';
            }
        }
        foreach ($props as $prop => $how) {
            // Resolve through the page's own pageConfig block; fall back to the bare property
            // name for the pages that do use an unprefixed key.
            $k = $propToKey[$prop] ?? $prop;
            $keys[$k] = 'js/' . basename($f) . ' (' . $how . ')';
        }
    }

    return $keys;
}

/**
 * Splits every call to $fn( ... ) in $code into its top-level arguments, balancing parentheses
 * so a nested call does not truncate the list.
 *
 * A naive /\(([^)]*)\)/ misses any call with a nested paren -- which silently hid the three
 * mhp_hl_*_tip keys, whose second argument is hlPct.toFixed(1). Splitting on top-level commas
 * only, for the same reason.
 */
function callArguments(string $code, string $fn): array
{
    $calls = [];
    $offset = 0;
    while (($pos = strpos($code, $fn . '(', $offset)) !== false) {
        $i = $pos + strlen($fn) + 1;
        $depth = 1;
        $arg = '';
        $parts = [];
        for (; $i < strlen($code) && $depth > 0; $i++) {
            $ch = $code[$i];
            if ($ch === '(') { $depth++; }
            elseif ($ch === ')') { $depth--; if ($depth === 0) { break; } }
            if ($depth === 1 && $ch === ',') { $parts[] = $arg; $arg = ''; continue; }
            $arg .= $ch;
        }
        $parts[] = $arg;
        $calls[] = $parts;
        $offset = $pos + strlen($fn) + 1;
    }
    return $calls;
}

/**
 * Maps a JS pageConfig property name to the $ec_lang key that fills it, by reading the
 * "prop: <?= json_encode($ec_lang['key']) ?>," lines in the page PHP. Needed because the pages
 * drop the calculator prefix when naming the property, so the JS side alone cannot name the key.
 *
 * A property defined on more than one page with different keys is recorded as a collision and
 * left unmapped rather than guessed -- a wrong mapping would silently constrain the wrong string.
 */
function pageConfigPropertyMap(array $phpFiles): array
{
    $map = [];
    $collided = [];
    foreach ($phpFiles as $f) {
        $c = (string)file_get_contents($f);
        if (!preg_match_all('/([A-Za-z0-9_]+)\s*:\s*(?:<\?=|<\?php\s+echo\s+)?\s*json_encode\(\s*\$ec_lang\[\'([^\']+)\'\]/', $c, $m, PREG_SET_ORDER)) {
            continue;
        }
        foreach ($m as $hit) {
            [$prop, $key] = [$hit[1], $hit[2]];
            if (isset($map[$prop]) && $map[$prop] !== $key) {
                $collided[$prop] = true;
            }
            $map[$prop] = $key;
        }
    }
    foreach (array_keys($collided) as $prop) {
        unset($map[$prop]);
    }
    return $map;
}

/**
 * ROADMAP Task 140, Rule B: no HTML tag in a plain-text-constrained string.
 *
 * Constrained means either derived (the string reaches a plain-text attribute or a JS tip) or
 * named (_tip / _plain). Both, because neither alone is sufficient: derivation cannot see a
 * string assembled in PHP before it reaches an attribute, and a name is only a claim.
 */
function detectPlainTextTags(string $file, string $content, array $plainKeys): array
{
    $issues = [];
    foreach (extractValues($content) as $key => $value) {
        $named = (bool)preg_match('/_(tip|plain)$/', $key);
        $bound = isset($plainKeys[$key]);
        if (!$named && !$bound) {
            continue;
        }
        if (!preg_match('/<\s*\/?\s*([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/', $value, $m)) {
            continue;
        }
        $where = $bound ? $plainKeys[$key] : 'named _' . ($named ? 'tip/_plain' : '');
        $issues[] = formatIssue(
            $file,
            lineAtOffset($content, (int)strpos($content, "['" . $key . "']")),
            'tag-in-plain-text-string',
            $key . ': HTML tag "' . $m[0] . '" is not allowed — this string reaches plain text only ['
                . $where . ']. Write the text without markup.'
        );
    }
    return $issues;
}

/**
 * ROADMAP Task 140, Rule B (embedded case): a tooltip written *inside* another key's value as
 * title="...".
 *
 * 39 English keys do this (1053 strings across the 27 files), and before this check every one of
 * them was invisible to the validator -- the outer key is page HTML, so Rule B does not apply to
 * it, while the text inside its title="" is under exactly the plain-text constraint. This is the
 * cheap substitute for lifting all 39 tooltips into their own keys (Task 140 step 2, retired):
 * it buys the visibility without restructuring ~1050 translated strings.
 */
function detectEmbeddedTipDefects(string $file, string $content): array
{
    $issues = [];
    foreach (extractValues($content) as $key => $value) {
        if (strpos($value, 'title=') === false) {
            continue;
        }
        $line = lineAtOffset($content, (int)strpos($content, "['" . $key . "']"));

        if (!preg_match_all('/title\s*=\s*"([^"]*)"/i', $value, $m)) {
            $issues[] = formatIssue($file, $line, 'embedded-tip-unparseable',
                $key . ': contains title= but no well-formed title="..." — check for a stray or missing quote.');
            continue;
        }
        foreach ($m[1] as $tip) {
            if (preg_match('/<\s*\/?\s*[a-zA-Z][a-zA-Z0-9]*\b[^>]*>/', $tip, $t)) {
                $issues[] = formatIssue($file, $line, 'tag-in-embedded-tip',
                    $key . ': HTML tag "' . $t[0] . '" inside an embedded title="" — a tooltip holds plain text only.');
            }
            if (preg_match('/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);/', $tip, $e)) {
                $issues[] = formatIssue($file, $line, 'entity-in-embedded-tip',
                    $key . ': HTML entity "' . $e[0] . '" inside an embedded title="" — use the literal UTF-8 character.');
            }
        }
    }
    return $issues;
}

/**
 * ROADMAP Task 140, Rule C -- advisory only, reports and never fails the intent of a name.
 *
 * Run against English alone (the naming is a property of the key, not of a translation).
 * Two directions, both worth seeing: a string that reaches an attribute without a name saying
 * so is a trap for the next writer, and a _tip/_plain name that no call site actually constrains
 * is either dead or delivered by a route the deriver cannot see.
 */
function detectNameDerivationMismatch(string $file, string $content, array $plainKeys): array
{
    $issues = [];
    foreach (extractValues($content) as $key => $value) {
        $named = (bool)preg_match('/_(tip|plain)$/', $key);
        $bound = isset($plainKeys[$key]);
        $line = lineAtOffset($content, (int)strpos($content, "['" . $key . "']"));

        if ($bound && !$named) {
            $issues[] = formatIssue($file, $line, 'plain-text-unnamed',
                $key . ' reaches plain text [' . $plainKeys[$key] . '] but is not named _tip/_plain.');
        } elseif ($named && !$bound) {
            $issues[] = formatIssue($file, $line, 'named-but-unconstrained',
                $key . ' is named _tip/_plain but no derived call site constrains it — dead key, or a delivery route the deriver cannot see.');
        }
    }
    return $issues;
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

/**
 * Value byte-identical to English where English contains a real word (>=4 letters).
 * Warning-grade. Keys that are correctly identical -- symbols, eponyms, brands, and
 * per-language cognates -- are skipped via the shared exempt list, so this warning
 * agrees with the payload generator's delta instead of contradicting it.
 */
function detectUntranslatedValues(string $file, string $content, array $enValues, string $lang, array $exemptMap): array
{
    $issues = [];
    foreach (extractValues($content) as $key => $value) {
        $en = $enValues[$key] ?? null;
        if ($en === null || $value !== $en) {
            continue;
        }
        if (ecIsExemptFromEnglishEquality($key, $lang, $exemptMap) || ecIsUniversalKey($key, (string)$en)) {
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
