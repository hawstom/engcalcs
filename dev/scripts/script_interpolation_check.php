<?php
/**
 * script_interpolation_check.php -- a PHP value echoed INSIDE a <script> block goes through
 * json_encode(). BLOCKING, and a ratchet at zero.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * The suite interpolates a PHP value into a <script> block 1,370 times -- that is how every one of
 * this page's language strings reaches JavaScript -- and 1,363 of them are written
 * `<?=json_encode($ec_lang['k'])?>`. **Four were not, all four in Rock-Chute.php, all four
 * translator text, and all four inside single quotes**, three lines below fourteen neighbours that
 * do it correctly:
 *
 *     rc_pond_warn_tip:<?=json_encode($ec_lang['rc_pond_warn_tip'])?>,
 *     rc_sketch_filter:         '<?=$ec_lang['rc_sketch_filter']?>',
 *
 * A construct written 1,363 times the same way is a rule somebody knew. Nothing in `CLAUDE.md` or
 * `dev/*.md` states it, and nothing held it, which is the signature this survey hunts: the tree
 * decided the question 1,363 times one way and 4 times the other.
 *
 * WHAT THE RAW FORM COSTS, and it is the whole page rather than the string. The value is a
 * `$ec_lang` string, so it is written by a translator, in 27 files, one of which is edited by a
 * paid agent on every sprint. **An apostrophe in it closes the JavaScript string literal**, the
 * object being built there stops parsing, and the browser throws a SyntaxError over the ENTIRE
 * inline script -- which on a calculator page is `EngCalcs.pageConfig` itself. The form still
 * renders, every field is in place, the Calculate button still has its word on it, and nothing
 * computes. `</script>` inside the value ends the block outright and puts the rest of it on the
 * page as text; a lone backslash eats the next character.
 *
 * **NONE OF THE 27 CARRIES ONE TODAY**, which is the reason to hold it now rather than after: the
 * defect is one ordinary French or Italian translation away (*l'enrochement*, *dell'apron*), it
 * ships silently, and it is visible only to somebody who loads that page in that language.
 * `json_encode()` is what makes the value safe -- it escapes the quote, and by default it escapes
 * `/` as `\/` too, which is why `</script>` cannot survive a correctly encoded string.
 *
 * DECLARED EXCEPTIONS, and a declaration matching nothing FAILS, because an exception nobody can
 * trip is a ratchet gone slack. Each one is a value this repository writes and a translator never
 * sees. They are in $ecSiAllowed below, keyed on the exact expression.
 *
 * WHAT IT DELIBERATELY DOES NOT READ, stated rather than pretended away:
 *   - a `<?php ... ?>` island inside a script block that is COMMENT ONLY, or that CALLS a function
 *     (`echoCookieScript()`). Such an island echoes no expression of its own; the function is a
 *     second door and is somebody else's check. Counted and printed.
 *   - `<script src="...?v=<?=filemtime(...)?>">`. That is the TAG's attribute, not the block's
 *     body, and `page_meta_check.php` already holds the cache-buster. Out of the scan by
 *     construction: only the text BETWEEN the tags is read.
 *   - `js/*.js`. Nothing is interpolated there; the bridge is the whole point.
 *
 * Usage:
 *   php dev/scripts/script_interpolation_check.php
 *
 * Exit 0 = every interpolation is encoded or declared. Exit 1 = one is raw.
 */

/**
 * The declared exceptions, keyed on the exact expression as written between the tags.
 *
 * A raw interpolation is correct only when the value cannot carry a quote, a backslash or a `<`.
 * These three are constants this repository defines, not text anybody translates.
 */
$ecSiAllowed = array(
    'EC_DEFAULT_UNIT_SET' => "the preset name, 'us' or 'si', decided by ecDefaultUnitSet() out of a "
        . 'two-value set this repository defines. It is emitted bare into a comparison, not into a '
        . 'string literal.',
    'EC_CONSENT_DAYS' => 'an integer constant in lib/config.inc.php -- the cookie lifetime, emitted '
        . 'as a number.',
    '"\\n"' => 'a literal newline, emitted to lay the generated script out. It is the only '
        . 'interpolation here that carries no value at all.',
);

/**
 * Every expression echoed inside a <script> block, with what it was.
 *
 * Pure, so the selftest can drive it with fixtures instead of the tree.
 *
 * @param array<string,string> $files rel path => PHP source
 * @param array<string,string> $allowed expression => reason
 * @return array{findings: array<int,string>, encoded: int, allowed: array<string,int>, islands: int}
 */
function ecScriptInterpFindings(array $files, array $allowed): array
{
    $findings = array();
    $encoded = 0;
    $islands = 0;
    $used = array();
    foreach (array_keys($allowed) as $k) { $used[$k] = 0; }

    foreach ($files as $rel => $src) {
        if (!preg_match_all('/<script\b[^>]*>(.*?)<\/script>/is', $src, $blocks, PREG_OFFSET_CAPTURE)) {
            continue;
        }
        foreach ($blocks[1] as $block) {
            $body = $block[0];
            $base = $block[1];
            /* The short echo tag and the long `echo` form are the two ways a value is echoed.
               A long-form island that echoes nothing -- a comment, or a call such as
               echoCookieScript() -- is an island: counted, and left alone. */
            if (!preg_match_all('/<\?(=|php\b)(.*?)\?>/s', $body, $isl, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
                continue;
            }
            foreach ($isl as $m) {
                $code = trim($m[2][0]);
                $line = substr_count(substr($src, 0, $base + $m[0][1]), "\n") + 1;
                if ($m[1][0] !== '=') {
                    // A long-form island. Only an `echo`/`print` of an expression is an
                    // interpolation; everything else -- a comment, a function call -- is not.
                    if (!preg_match('/^(?:echo|print)\s+(.*?);?$/s', $code, $e)) { $islands++; continue; }
                    $code = trim($e[1]);
                }
                if ($code === '') { $islands++; continue; }
                if (strpos($code, 'json_encode') !== false) { $encoded++; continue; }
                $flat = preg_replace('/\s+/', ' ', $code);
                if (isset($allowed[$flat])) { $used[$flat]++; continue; }
                $findings[] = "$rel:$line echoes `$flat` raw inside a <script> block. Wrap it: "
                    . '`<?=json_encode(' . $flat . ')?>` and drop the quotes around it. A value '
                    . 'carrying an apostrophe closes the JavaScript string literal, the inline '
                    . 'script stops parsing, and the browser throws a SyntaxError over the whole of '
                    . 'it -- on a calculator page that is EngCalcs.pageConfig, so the form renders '
                    . 'perfectly and nothing computes. A `</script>` in it ends the block outright. '
                    . 'json_encode() escapes the quote, and escapes `/` as `\\/` so `</script>` '
                    . 'cannot survive either. 1,363 interpolations in this suite already do it.';
            }
        }
    }

    return array(
        'findings' => $findings,
        'encoded' => $encoded,
        'allowed' => $used,
        'islands' => $islands,
    );
}

if (defined('SCRIPT_INTERP_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$files = array();
foreach (glob($root . '/*.php') ?: array() as $f) {
    $files[basename($f)] = (string) file_get_contents($f);
}
foreach (glob($root . '/lib/*.php') ?: array() as $f) {
    $files['lib/' . basename($f)] = (string) file_get_contents($f);
}

$result = ecScriptInterpFindings($files, $ecSiAllowed);

$dead = array();
foreach ($result['allowed'] as $expr => $hits) {
    if ($hits === 0) { $dead[] = $expr; }
}

if ($result['findings'] || $dead) {
    if ($result['findings']) {
        echo 'Script interpolation: ' . count($result['findings']) . " raw value(s)\n\n";
        foreach ($result['findings'] as $f) { echo "  ! $f\n\n"; }
    }
    foreach ($dead as $expr) {
        echo "  ! the declared exception `$expr` matches nothing in the tree. An exception nobody "
            . "can trip is a ratchet gone slack: delete the row, or restore the site it was for.\n\n";
    }
    echo "This is a ratchet at zero. The failure ships silently and is visible only to somebody\n";
    echo "loading that page in the one language whose translator used an apostrophe.\n";
    exit(1);
}

printf(
    "Script interpolation OK -- %d value(s) echoed inside a <script> block across %d shipped PHP\n"
    . "file(s), every one through json_encode() or declared. A ratchet at zero.\n",
    $result['encoded'] + array_sum($result['allowed']),
    count($files)
);
echo '  declared exceptions, each a constant this repository defines rather than translated text: '
    . implode(', ', array_keys($ecSiAllowed)) . "\n";
printf(
    "  turned away and counted: %d <?php ... ?> island(s) inside a script block that echo no\n"
    . "  expression of their own -- a comment, or a call such as echoCookieScript(), which is a\n"
    . "  second door and not this scan's business.\n",
    $result['islands']
);
exit(0);
