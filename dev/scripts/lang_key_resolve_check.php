<?php
/**
 * lang_key_resolve_check.php — every literal $ec_lang['key'] a shipped page reads is a key that
 * exists. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS, AND WHY IT BLOCKS WHERE ITS SIBLING DOES NOT. key_hygiene_check.php reports the
 * opposite direction — a key nothing renders — and it is advisory because deleting such a key is a
 * judgement call: it may be held for a feature that is coming back, or be the canonical wording
 * another check holds every language to. Nobody but a human can tell.
 *
 * THIS direction has no judgement in it at all. `$ec_lang['mpf_flowz']` where the key is spelled
 * `mpf_flow` is not a debatable style preference; it is a label that renders as the empty string
 * for every visitor in all 27 languages, with no PHP warning in production and nothing on the page
 * to see except a blank where a word should be. There is no state of the repo in which reading an
 * undefined key is correct, so there is nothing to weigh and it fails the build.
 *
 * It cannot be folded into key_hygiene_check.php's own exit code: that script's whole argument is
 * that it must never block, and a file with one blocking finding and two advisory ones has no
 * honest exit code to return. One check, one verdict.
 *
 * WHAT IT READS. Root *.php and lib/*.php — the shipped pages and the libraries they include, not
 * dev/, which is not served. The language files themselves are skipped: a lang file ASSIGNING a
 * key is not a page reading one.
 *
 * IT IS A TOKENIZER SCAN, NOT A GREP, and that is what makes the false-positive count zero rather
 * than low. `$ec_lang['u_' . $unit]` is a concatenation, `$ec_lang[$k]` is a variable, and
 * `// $ec_lang['lpn_old_key'] used to live here` is a comment; a regex over the raw text reports
 * all three and a token stream reports none. Only a genuine constant string subscript is checked,
 * including one interpolated inside a double-quoted string or a heredoc, because that is a real
 * read.
 *
 * Usage:
 *   php dev/scripts/lang_key_resolve_check.php
 *
 * Exit 0 = every literal key resolves. Exit 1 = at least one does not; each is printed with its
 * file, line and the nearest existing key name.
 */

/**
 * Literal $ec_lang[...] reads in one file's PHP source that are not in $defined.
 *
 * @param string $php     Source text of one PHP file.
 * @param array  $defined key => value (only the keys are used).
 * @return array<int,array{0:string,1:int}> [key, line] pairs, in source order.
 */
function ecMissingKeyReads(string $php, array $defined): array
{
    $tokens = @token_get_all($php);
    $out = [];
    $n = count($tokens);
    for ($i = 0; $i < $n; $i++) {
        $t = $tokens[$i];
        if (!is_array($t) || $t[0] !== T_VARIABLE || $t[1] !== '$ec_lang') {
            continue;
        }
        // The subscript must be, in order: '[', one constant string, ']'. Anything else — a
        // concatenation, a variable, a function call — is a dynamic read this check cannot and
        // must not judge.
        if (($tokens[$i + 1] ?? null) !== '[') {
            continue;
        }
        $key = $tokens[$i + 2] ?? null;
        if (!is_array($key) || $key[0] !== T_CONSTANT_ENCAPSED_STRING) {
            continue;
        }
        if (($tokens[$i + 3] ?? null) !== ']') {
            continue;
        }
        $name = substr($key[1], 1, -1);          // strip the quotes the token carries
        // An escaped quote or an interpolation inside the subscript is not a plain key name.
        if (strpos($name, '\\') !== false || strpos($name, '$') !== false) {
            continue;
        }
        if (!array_key_exists($name, $defined)) {
            $out[] = [$name, (int)$key[2]];
        }
    }
    return $out;
}

/** The defined key closest to $name, so a typo names its own fix. '' when nothing is close. */
function ecNearestKey(string $name, array $keys): string
{
    $best = '';
    $bestD = PHP_INT_MAX;
    foreach ($keys as $k) {
        $d = levenshtein($name, $k);
        if ($d < $bestD) {
            $bestD = $d;
            $best = $k;
        }
    }
    // Beyond a third of the name's length the "did you mean" is noise, not help.
    return $bestD <= max(2, (int)floor(strlen($name) / 3)) ? $best : '';
}

if (defined('LANG_KEY_RESOLVE_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$ec_lang = [];
$ec_lang_syn = [];
include $root . '/lib/lang.ec.en.php';
$defined = $ec_lang;
$keys = array_keys($defined);

$files = array_merge(glob($root . '/*.php'), glob($root . '/lib/*.php'));
$bad = [];
$scanned = 0;
foreach ($files as $path) {
    if (strpos(basename($path), 'lang.ec.') === 0) {
        continue;
    }
    $scanned++;
    foreach (ecMissingKeyReads(file_get_contents($path), $defined) as [$name, $line]) {
        $bad[] = [str_replace($root . '/', '', $path), $line, $name];
    }
}

if (!$bad) {
    printf("Language keys resolve — %d file(s) scanned, every literal \$ec_lang['...'] read is a defined key.\n", $scanned);
    exit(0);
}

echo "UNDEFINED LANGUAGE KEY READ — " . count($bad) . " site(s):\n\n";
foreach ($bad as [$file, $line, $name]) {
    $near = ecNearestKey($name, $keys);
    printf("  %s:%d  \$ec_lang['%s']%s\n", $file, $line, $name, $near ? "   did you mean '$near'?" : '');
}
echo "\n";
echo "Each of these renders as the EMPTY STRING for every visitor, in all 27 languages, with no\n";
echo "warning in production. Fix it one of two ways:\n";
echo "  - the key is misspelled at the call site: correct the spelling there;\n";
echo "  - the key is genuinely new: add it to lib/lang.ec.en.php ONLY (base.inc.php loads English\n";
echo "    first, so an absent translation already falls back), then regenerate the payloads with\n";
echo "    php dev/scripts/generate_translation_payloads.php\n";
echo "Never rename a key by hand — php dev/scripts/rename_lang_key.php <old> <new> --apply does all\n";
echo "27 files and every call site in one pass.\n";
exit(1);
