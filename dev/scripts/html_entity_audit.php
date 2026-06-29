<?php
/**
 * HTML-entity audit script.
 *
 * Scans all lib/lang.ec.*.php files for HTML entities (&mdash;, &ge;, &amp;, etc.)
 * that double-encode when passed through htmlspecialchars() into JS pageConfig.
 * Reports affected keys with their Unicode replacements.
 *
 * Usage:
 *   php scripts/html_entity_audit.php
 *   php scripts/html_entity_audit.php --lang=es,fr
 *   php scripts/html_entity_audit.php --fix          (applies Unicode replacements in-place)
 *   php scripts/html_entity_audit.php --strict        (exit 1 if any entity found)
 */

const DEFAULT_LANG_DIR = __DIR__ . '/../../lib';

// Map of HTML entities to Unicode replacements.
// Covers all named entities seen in this codebase plus common mathematical/typographic ones.
const ENTITY_MAP = [
    // Typography
    '&mdash;'   => '—',
    '&ndash;'   => '–',
    '&ldquo;'   => '"',
    '&rdquo;'   => '"',
    '&laquo;'   => '«',
    '&raquo;'   => '»',
    '&hellip;'  => '…',
    '&bull;'    => '•',
    '&nbsp;'    => "\xc2\xa0",  // non-breaking space U+00A0
    // Math / symbols
    '&ge;'      => '≥',
    '&le;'      => '≤',
    '&ne;'      => '≠',
    '&asymp;'   => '≈',
    '&times;'   => '×',
    '&divide;'  => '÷',
    '&minus;'   => '−',
    '&plusmn;'  => '±',
    '&radic;'   => '√',
    '&infin;'   => '∞',
    '&deg;'     => '°',
    '&middot;'  => '·',
    '&sup2;'    => '²',
    '&sup3;'    => '³',
    '&frac12;'  => '½',
    '&frac14;'  => '¼',
    '&frac34;'  => '¾',
    // Greek letters (engineering use)
    '&nu;'      => 'ν',
    '&eta;'     => 'η',
    '&tau;'     => 'τ',
    '&mu;'      => 'μ',
    '&alpha;'   => 'α',
    '&beta;'    => 'β',
    '&gamma;'   => 'γ',
    '&delta;'   => 'δ',
    '&epsilon;' => 'ε',
    '&theta;'   => 'θ',
    '&lambda;'  => 'λ',
    '&pi;'      => 'π',
    '&sigma;'   => 'σ',
    '&omega;'   => 'ω',
    '&phi;'     => 'φ',
    '&rho;'     => 'ρ',
    // Special HTML chars (safe to replace with literals in UTF-8 PHP strings)
    '&amp;'     => '&',
    '&lt;'      => '<',
    '&gt;'      => '>',
    '&quot;'    => '"',
    // Accented characters (should be written as UTF-8 directly)
    '&eacute;'  => 'é',
    '&egrave;'  => 'è',
    '&ecirc;'   => 'ê',
    '&euml;'    => 'ë',
    '&aacute;'  => 'á',
    '&agrave;'  => 'à',
    '&acirc;'   => 'â',
    '&auml;'    => 'ä',
    '&aring;'   => 'å',
    '&oacute;'  => 'ó',
    '&ograve;'  => 'ò',
    '&ocirc;'   => 'ô',
    '&ouml;'    => 'ö',
    '&uacute;'  => 'ú',
    '&ugrave;'  => 'ù',
    '&ucirc;'   => 'û',
    '&uuml;'    => 'ü',
    '&iacute;'  => 'í',
    '&igrave;'  => 'ì',
    '&icirc;'   => 'î',
    '&iuml;'    => 'ï',
    '&ntilde;'  => 'ñ',
    '&ccedil;'  => 'ç',
    '&iquest;'  => '¿',
    '&iexcl;'   => '¡',
    '&copy;'    => '©',
    '&reg;'     => '®',
    '&trade;'   => '™',
    '&euro;'    => '€',
    '&pound;'   => '£',
];

main($argv);

function main(array $argv): void
{
    $opts = parseArgs($argv);

    $langFiles = glob(DEFAULT_LANG_DIR . '/lang.ec.*.php');
    if ($langFiles === false || count($langFiles) === 0) {
        fail('No language files found under ' . DEFAULT_LANG_DIR);
    }
    sort($langFiles);

    $totalEntities = 0;
    $totalKeys = 0;
    $totalFiles = 0;

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

        $content = file_get_contents($file);
        if ($content === false) {
            fail('Cannot read: ' . $file);
        }

        $findings = findEntities($content, $opts['prefixes']);
        if (count($findings) === 0) {
            continue;
        }

        $totalFiles++;
        $totalKeys += count($findings);
        foreach ($findings as $f) {
            $totalEntities += $f['count'];
        }

        echo "\n[{$lang}] " . basename($file) . ' — ' . count($findings) . " key(s) with entities:\n";
        foreach ($findings as $f) {
            echo "  {$f['key']}:\n";
            foreach ($f['entities'] as $entity => $unicode) {
                echo "    {$entity}  →  {$unicode}\n";
            }
        }

        if ($opts['fix']) {
            $fixed = applyFixes($content);
            if ($fixed !== $content) {
                file_put_contents($file, $fixed);
                echo "  [FIXED] " . basename($file) . "\n";
            }
        }
    }

    echo "\n=== Totals ===\n";
    echo "files_with_entities: {$totalFiles}\n";
    echo "keys_with_entities:  {$totalKeys}\n";
    echo "entity_occurrences:  {$totalEntities}\n";

    if ($opts['fix'] && $totalFiles > 0) {
        echo "\nAll entities replaced with Unicode in-place.\n";
    } elseif (!$opts['fix'] && $totalFiles > 0) {
        echo "\nRun with --fix to apply Unicode replacements in-place.\n";
    } else {
        echo "\nNo HTML entities found.\n";
    }

    if ($opts['strict'] && $totalEntities > 0) {
        exit(1);
    }
}

/**
 * Find all HTML entities in a lang file's string values.
 * Returns array of ['key' => ..., 'entities' => [entity => unicode, ...], 'count' => N].
 */
function findEntities(string $content, array $prefixFilter): array
{
    $entityPattern = implode('|', array_map('preg_quote', array_keys(ENTITY_MAP)));
    // Also catch numeric entities &#NNN; and &#xHHH;
    $numericPattern = '&#[0-9]+;|&#x[0-9a-fA-F]+;';
    $fullPattern = '/(' . $entityPattern . '|' . $numericPattern . ')/';

    // Extract key => value assignments from the PHP file
    // Matches: $ec_lang['key'] = 'value'; (single-quoted)
    //          $ec_lang["key"] = "value"; (double-quoted)
    $assignments = [];
    preg_match_all(
        '/\$ec_lang\[\'([^\']+)\'\]\s*=\s*\'((?:[^\']|\\\\\')*)\'\s*;/',
        $content,
        $m1,
        PREG_SET_ORDER
    );
    foreach ($m1 as $m) {
        $assignments[$m[1]] = $m[2];
    }
    preg_match_all(
        '/\$ec_lang\["([^"]+)"\]\s*=\s*"((?:[^"]|\\\\")*)"\s*;/',
        $content,
        $m2,
        PREG_SET_ORDER
    );
    foreach ($m2 as $m) {
        $assignments[$m[1]] = $m[2];
    }

    $findings = [];

    foreach ($assignments as $key => $value) {
        if (count($prefixFilter) > 0) {
            $matched = false;
            foreach ($prefixFilter as $prefix) {
                if (strpos($key, $prefix) === 0) {
                    $matched = true;
                    break;
                }
            }
            if (!$matched) {
                continue;
            }
        }

        if (!preg_match($fullPattern, $value)) {
            continue;
        }

        preg_match_all($fullPattern, $value, $matches);
        $foundEntities = array_unique($matches[0]);
        $entityMap = [];
        foreach ($foundEntities as $entity) {
            $entityMap[$entity] = resolveEntity($entity);
        }

        $findings[] = [
            'key'      => $key,
            'entities' => $entityMap,
            'count'    => count($matches[0]),
        ];
    }

    return $findings;
}

/**
 * Resolve an HTML entity to its Unicode equivalent.
 */
function resolveEntity(string $entity): string
{
    if (isset(ENTITY_MAP[$entity])) {
        return ENTITY_MAP[$entity];
    }
    // Numeric decimal: &#NNN;
    if (preg_match('/^&#([0-9]+);$/', $entity, $m)) {
        return mb_chr((int)$m[1], 'UTF-8') ?: $entity;
    }
    // Numeric hex: &#xHHH;
    if (preg_match('/^&#x([0-9a-fA-F]+);$/i', $entity, $m)) {
        return mb_chr(hexdec($m[1]), 'UTF-8') ?: $entity;
    }
    return '(unknown)';
}

/**
 * Apply all entity-to-Unicode substitutions to file content.
 */
function applyFixes(string $content): string
{
    // Replace named entities
    $search = array_keys(ENTITY_MAP);
    $replace = array_values(ENTITY_MAP);
    $content = str_replace($search, $replace, $content);

    // Replace numeric decimal entities &#NNN;
    $content = preg_replace_callback('/&#([0-9]+);/', static function ($m) {
        return mb_chr((int)$m[1], 'UTF-8') ?: $m[0];
    }, $content);

    // Replace numeric hex entities &#xHHH;
    $content = preg_replace_callback('/&#x([0-9a-fA-F]+);/i', static function ($m) {
        return mb_chr(hexdec($m[1]), 'UTF-8') ?: $m[0];
    }, $content);

    return $content;
}

function parseArgs(array $argv): array
{
    $opts = [
        'languages' => [],
        'prefixes'  => [],
        'fix'       => false,
        'strict'    => false,
    ];

    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];

        if ($arg === '--fix') {
            $opts['fix'] = true;
            continue;
        }

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
    echo "Usage: php scripts/html_entity_audit.php [options]\n";
    echo "\nOptions:\n";
    echo "  --lang=es,fr    Limit to specific language codes\n";
    echo "  --prefix=dw,hw  Limit to keys with these prefixes\n";
    echo "  --fix           Apply Unicode replacements in-place (modifies files!)\n";
    echo "  --strict        Exit 1 if any entity is found\n";
    echo "  -h, --help      Show this help\n";
    exit(0);
}

function splitCsv(string $value): array
{
    $parts = array_filter(array_map('trim', explode(',', $value)), static function ($v) {
        return $v !== '';
    });
    return array_values(array_unique($parts));
}

function fail(string $msg): never
{
    fwrite(STDERR, "ERROR: {$msg}\n");
    exit(1);
}
