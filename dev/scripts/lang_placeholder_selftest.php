<?php
/**
 * lang_placeholder_selftest.php -- proves lang_placeholder_check.php can still fail.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * The check finds nothing on today's tree, so it is a ratchet, and a ratchet that goes blind prints
 * the same reassuring line as one that is holding. Three defences:
 *
 *   - FIXTURES on the pure parts, in both directions, including the two shapes that defeated the
 *     first draft: `svgEl('rect', {x1: .., y1: ..})` reading as a message call, and a `.split()`
 *     being counted as first-occurrence-only when it is the global idiom.
 *   - A CORPUS GUARD asserting the real run still sees roughly the corpus it is supposed to see.
 *     It asserts COVERAGE, never that a defect exists, so it cannot die of success.
 *   - A LIVE MUTATION: a temporary module substituting a genuinely repeated token with the
 *     first-occurrence-only form is written into the real `js/`, and the REAL check over the REAL
 *     directory must name it. Removed inline and on shutdown.
 *
 * Finding 1's wiring has no live mutation, and that is stated rather than hidden: it would need a
 * temporary FILE IN `lib/` matching `lang.ec.??.php`, and leaving one of those behind is worse than
 * the coverage is worth. The corpus guard stands in for it -- it fails the moment the language end
 * of the scan stops reading strings.
 *
 * Exit 0 clean, 1 on any failure. Blocking.
 */

define('LANG_PLACEHOLDER_LIB_ONLY', true);
require_once __DIR__ . '/lang_placeholder_check.php';

$fails = [];
$n = 0;

function lph_case(string $label, bool $ok, string $detail = ''): void
{
    global $fails, $n;
    $n++;
    if (!$ok) { $fails[] = $label . ($detail === '' ? '' : ": $detail"); }
}

// ---- ecPhTokens ----------------------------------------------------------------------------
lph_case('tokens: found in order, repeats kept',
    ecPhTokens('Showing {n} of {all}, {n} again') === ['{n}', '{all}', '{n}']);
lph_case('tokens: a regex quantifier is not a token', ecPhTokens('a{2,}b') === []);
lph_case('tokens: a token may not start with a digit', ecPhTokens('{2x}') === []);
lph_case('tokens: underscores are part of the name', ecPhTokens('{a_b}') === ['{a_b}']);

// ---- ecPhJsSites: the four idioms, and their globality -------------------------------------
$keys = ['lpn_msg' => true];
$r = ecPhJsSites("var a = s.replace('{n}', v);", 'f.js', $keys);
lph_case('sites: string replace is FIRST-ONLY',
    isset($r['sites']['{n}']) && $r['sites']['{n}'][0]['global'] === false);
$r = ecPhJsSites("var a = s.split('{n}').join(v);", 'f.js', $keys);
lph_case('sites: split/join is GLOBAL',
    isset($r['sites']['{n}']) && $r['sites']['{n}'][0]['global'] === true);
$r = ecPhJsSites('var a = s.replace(/\{n\}/g, v);', 'f.js', $keys);
lph_case('sites: a /g regex is GLOBAL',
    isset($r['sites']['{n}']) && $r['sites']['{n}'][0]['global'] === true);
$r = ecPhJsSites('var a = s.replace(/\{n\}/, v);', 'f.js', $keys);
lph_case('sites: a regex WITHOUT g is first-only, and is read that way',
    isset($r['sites']['{n}']) && $r['sites']['{n}'][0]['global'] === false);

// The message-call form, and its gate.
$dyn = "function m(k, f, subs) { var t = f, x; for (x in subs) { t = t.split('{' + x + '}').join(subs[x]); } return t; }\n";
$r = ecPhJsSites($dyn . "m('lpn_msg', 'Not a {scope}: {w}', { scope: a, w: b });", 'f.js', $keys);
lph_case('message call: object-literal keys become GLOBAL tokens',
    isset($r['sites']['{scope}'], $r['sites']['{w}']) && $r['sites']['{w}'][0]['global'] === true);
$r = ecPhJsSites($dyn . "svgEl('rect', { x1: a, y1: b });", 'f.js', $keys);
lph_case('message call: a first argument that is NOT a lang key contributes nothing',
    !isset($r['sites']['{x1}']), 'this is the shape that produced 50 bogus tokens in the first draft');
$r = ecPhJsSites("m('lpn_msg', 'Not a {scope}', { scope: a });", 'f.js', $keys);
lph_case('message call: a file with no dynamic substituter contributes nothing',
    !isset($r['sites']['{scope}']));

// ---- ecPhFindings: both directions ---------------------------------------------------------
$site = ['{n}' => [['how' => ".replace('{n}')", 'global' => false, 'where' => 'js/a.js']]];
$siteG = ['{n}' => [['how' => ".split('{n}')", 'global' => true, 'where' => 'js/a.js']]];

lph_case('finding 1: a token nothing substitutes fails',
    count(ecPhFindings(['{zz}' => ['en:k']], [], $site)) === 1);
lph_case('finding 1: a token something substitutes passes',
    ecPhFindings(['{n}' => ['en:k']], [], $site) === []);
lph_case('finding 2: a repeat against a first-only site fails',
    count(ecPhFindings(['{n}' => ['en:k']], ['{n}' => ['es:k']], $site)) === 1);
lph_case('finding 2: a repeat against a global site passes',
    ecPhFindings(['{n}' => ['en:k']], ['{n}' => ['es:k']], $siteG) === []);
lph_case('finding 2: a token that never repeats is fine on a first-only site',
    ecPhFindings(['{n}' => ['en:k']], [], $site) === []);
lph_case('finding 2: an unsubstituted repeat is reported once, by finding 1',
    count(ecPhFindings(['{zz}' => ['en:k']], ['{zz}' => ['en:k']], $site)) === 1);
// One first-only site is enough to fail even when a global one also exists: the string does not
// know which line of code will render it.
$mixed = ['{n}' => [
    ['how' => ".split('{n}')", 'global' => true,  'where' => 'js/a.js'],
    ['how' => ".replace('{n}')", 'global' => false, 'where' => 'js/b.js'],
]];
lph_case('finding 2: a mixed pair fails on the first-only half',
    count(ecPhFindings([], ['{n}' => ['en:k']], $mixed)) === 1);

// ---- corpus guard --------------------------------------------------------------------------
$out = [];
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/lang_placeholder_check.php') . ' 2>&1', $out, $code);
$real = implode("\n", $out);
$n++;
if ($code !== 0) { $fails[] = "the real check does not pass on today's tree. Its output was:\n      $real"; }
$n++;
if (!preg_match('/OK -- (\d+) distinct \{token\}\(s\) across (\d+) language file\(s\) resolve to (\d+)/', $real, $m)) {
    $fails[] = "the real check's summary line did not parse. Its output was:\n      $real";
} else {
    if ((int) $m[1] < 40) {
        $fails[] = "the real check found only {$m[1]} distinct tokens. Under 40 means the LANGUAGE end "
            . 'of the scan went blind, which reads as health on a ratchet.';
    }
    if ((int) $m[2] < 20) {
        $fails[] = "the real check read only {$m[2]} language files. It should read all 27.";
    }
    if ((int) $m[3] < 100) {
        $fails[] = "the real check found only {$m[3]} substitution sites. Under 100 means the CODE end "
            . 'of the scan went blind.';
    }
}

// ---- the live mutation ---------------------------------------------------------------------
// `{base}` really does appear twice in lpn_push_base_only, in all 27 language files, and its two
// real sites are both /g. A temporary module substituting it with the first-only form is therefore
// a genuine violation of finding 2 against the REAL corpus -- not a fixture.
$probe = dirname(__DIR__, 2) . '/js/ec_selftest_placeholder.js';
register_shutdown_function(function () use ($probe) { @unlink($probe); });
file_put_contents($probe,
    "// TEMPORARY: written by dev/scripts/lang_placeholder_selftest.php and deleted by it.\n"
    . "var out = text.replace('{base}', name);\n");
$out2 = [];
$code2 = 0;
exec('php ' . escapeshellarg(__DIR__ . '/lang_placeholder_check.php') . ' 2>&1', $out2, $code2);
@unlink($probe);
$mut = implode("\n", $out2);
$n++;
if ($code2 === 0 || strpos($mut, 'ec_selftest_placeholder.js') === false) {
    $fails[] = "corpus mutation: a module substituting a genuinely repeated token with the "
        . "first-occurrence-only form was written into js/ and the check did not fail on it. It is "
        . "not reaching the directory it claims to guard. Its output was:\n      $mut";
}

if ($fails) {
    echo 'lang_placeholder selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "Language placeholder selftest OK -- $n cases, both directions, plus a corpus guard and a live\n"
    . "mutation against the real js/ directory.\n";
exit(0);
