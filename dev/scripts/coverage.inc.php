<?php
/**
 * Shared reader for translation_coverage.json -- the (calculator x language) coverage
 * declaration decided in ROADMAP Task 203 and built in Task 204.
 *
 * WHY THIS EXISTS AS A SEPARATE CONCEPT FROM exempt_keys.inc.php.
 * Four scripts treat a missing key as debt. Under the coverage matrix a key absent from
 * a non-core cell is DELIBERATE, and before this file there was no way to say so. The
 * available shortcut -- listing those keys in translation_exempt_keys.json -- is
 * forbidden by our own rule, because exemption means "identical to English is
 * permanently correct" (symbols, eponyms, cognates) and a deliberately-untranslated
 * body is neither identical nor permanent. Using the exempt list for it would put a
 * permanent floor back under every outstanding-keys number in the suite, which is the
 * exact defect Task 161 removed.
 *
 * So the two ideas stay separate in the data as well as the code:
 *   exempt       -> correctly identical FOREVER; the key is finished.
 *   out of scope -> not translated YET, by decision; the key has not been started, and
 *                   the cell can earn its way in at any time.
 * A tool must report those differently or the delta stops meaning anything: adopt the
 * matrix without this distinction and the very next parity run shows lpn_ alone as
 * 154 x 25 ~= 3,850 missing keys, permanently. A number that large and that permanent
 * teaches everyone to ignore it.
 *
 * THE RULE, entire: a cell is in scope iff the calculator is core OR the language is
 * core. Identity strings (menu entry, <title>, *_main_desc) are never out of scope in
 * any cell -- they are the discovery mechanism, and they are what lets an out-of-scope
 * cell earn its way in.
 */

const EC_COVERAGE_PATH = __DIR__ . '/translation_coverage.json';

/**
 * Returns the coverage declaration as a normalized array. Fails loudly rather than
 * returning a permissive default: a silently-unloaded declaration would quietly report
 * every out-of-scope cell as debt again, which is the state this file exists to end.
 *
 * Pass a path only in tests.
 */
function ecLoadCoverage(?string $path = null): array
{
    $path = $path ?? EC_COVERAGE_PATH;

    if (!file_exists($path)) {
        fwrite(STDERR, 'ERROR: coverage declaration not found: ' . $path . "\n");
        exit(1);
    }

    $decoded = json_decode((string)file_get_contents($path), true);
    if (!is_array($decoded)) {
        fwrite(STDERR, 'ERROR: invalid coverage JSON: ' . $path . "\n");
        exit(1);
    }

    foreach (['core_calculators', 'core_languages', 'calculator_prefixes', 'identity_key_suffixes', 'identity_keys_extra'] as $field) {
        if (!isset($decoded[$field]) || !is_array($decoded[$field])) {
            fwrite(STDERR, "ERROR: coverage declaration missing array field \"{$field}\": {$path}\n");
            exit(1);
        }
    }

    // A core calculator that is not a known calculator prefix is a typo, and a silent one:
    // it would simply never match, quietly shrinking the cross. Same for the reverse.
    foreach ($decoded['core_calculators'] as $prefix) {
        if (!in_array($prefix, $decoded['calculator_prefixes'], true)) {
            fwrite(STDERR, "ERROR: core calculator \"{$prefix}\" is not listed in calculator_prefixes: {$path}\n");
            exit(1);
        }
    }

    return [
        'core_calculators'     => array_values($decoded['core_calculators']),
        'core_languages'       => array_values($decoded['core_languages']),
        'calculator_prefixes'  => array_values($decoded['calculator_prefixes']),
        'identity_suffixes'    => array_values($decoded['identity_key_suffixes']),
        'identity_keys'        => array_values($decoded['identity_keys_extra']),
    ];
}

/**
 * True when this prefix is a calculator subject to the taper at all. Suite chrome --
 * nav, units, install, contact, the shared ws_/calc_ labels -- is always in scope, and
 * an UNRECOGNIZED prefix is treated as chrome on purpose: the safe direction for a new,
 * unclassified prefix is to translate it, not to silently drop it from every sprint.
 */
function ecCoverageIsCalculatorPrefix(string $prefix, array $coverage): bool
{
    return in_array($prefix, $coverage['calculator_prefixes'], true);
}

/**
 * THE RULE. In scope iff the calculator is core OR the language is core.
 */
function ecCoverageCellInScope(string $prefix, string $lang, array $coverage): bool
{
    if (!ecCoverageIsCalculatorPrefix($prefix, $coverage)) {
        return true; // chrome
    }

    return in_array($prefix, $coverage['core_calculators'], true)
        || in_array($lang, $coverage['core_languages'], true);
}

/**
 * Identity strings -- the menu entry, the <title>, and *_main_desc -- are the floor of
 * the gradient rather than part of the taper, so they are in scope in every cell. Roughly
 * 3 strings against 100+ for a body, and they are the entire reason an out-of-scope cell
 * is still discoverable in its own language.
 */
function ecCoverageIsIdentityKey(string $key, array $coverage): bool
{
    // Exact names first: three calculators predate the *_main_menu convention. Matching
    // a bare "_menu" suffix instead would sweep in ordinary body labels (lpn_tab_menu,
    // lpn_backdrop_menu) and silently promote them to the never-out-of-scope floor.
    if (in_array($key, $coverage['identity_keys'], true)) {
        return true;
    }

    foreach ($coverage['identity_suffixes'] as $suffix) {
        if (str_ends_with($key, $suffix)) {
            return true;
        }
    }
    return false;
}

/**
 * The question the four scripts actually ask: should this key be translated into this
 * language? False means OUT OF SCOPE -- report it as such, never as missing.
 *
 * CALLERS MUST ASK THIS ONLY ABOUT A GAP -- a key that is missing, blank, or still equal
 * to English. Scope decides what to do about work NOT YET DONE; it says nothing about
 * work already finished. An out-of-scope cell that is already fully translated (which is
 * every cell in this suite except lpn_, as of adoption) stays translated, stays
 * maintained, and must never be re-reported as "out of scope" -- that would read as a
 * plan to abandon it, and Task 203 is explicit that this model DELETES NOTHING and
 * governs only new calculators, drift spend and future audits.
 */
function ecCoverageKeyInScope(string $key, string $lang, array $coverage): bool
{
    if (ecCoverageIsIdentityKey($key, $coverage)) {
        return true;
    }

    $parts = explode('_', $key, 2);
    $prefix = count($parts) === 2 ? $parts[0] : '';

    return ecCoverageCellInScope($prefix, $lang, $coverage);
}

/**
 * One-line summary for a tool's header, so every report says which declaration produced
 * its numbers. A count that silently changed meaning is worse than no count.
 */
function ecCoverageSummary(array $coverage): string
{
    return 'coverage: core calculators [' . implode(', ', $coverage['core_calculators'])
        . '] x core languages [' . implode(', ', $coverage['core_languages'])
        . '] (in scope iff calculator OR language is core; identity strings always)';
}
