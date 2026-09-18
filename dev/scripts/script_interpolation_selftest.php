<?php
/**
 * script_interpolation_selftest.php -- script_interpolation_check.php still sees a raw
 * interpolation, and still turns away the shapes that only look like one. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS FINDS NOTHING. A ratchet at zero that has gone
 * blind and a ratchet at zero that is holding print the same line -- and the blind one prints a
 * SMALLER encoded count, which reads as tidying rather than as a failure. So the count is asserted
 * against the real tree, and the reach is proved by a LIVE MUTATION: a page with one raw
 * interpolation is written into the tree for the length of one exec, and the real check must name
 * it. A corpus guard requiring the original defect to still exist is the shape that has already
 * died of success in this project once.
 *
 * The load-bearing fixtures are the NEGATIVE ones. A script block in this suite is mostly PHP
 * comment islands explaining which key reaches which control, and Looped-Network.php alone carries
 * dozens of them; a scanner that counted those would open on dozens of findings against correct
 * code, which is the fastest known way to have a check switched off.
 *
 *   php dev/scripts/script_interpolation_selftest.php
 */

define('SCRIPT_INTERP_LIB_ONLY', true);
require __DIR__ . '/script_interpolation_check.php';

$fails = array();
$n = 0;
$allowed = array('EC_DEFAULT_UNIT_SET' => 'a constant');

function ecSiCase(string $name, string $php, bool $want): void
{
    global $fails, $n, $allowed;
    $n++;
    $got = ecScriptInterpFindings(array('x.php' => $php), $allowed)['findings'];
    $hit = $got !== array();
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . $got[0] : 'none');
    }
}

$O = '<' . '?';   // built rather than typed, so this file's own fixtures cannot close PHP mode
$C = '?' . '>';

// ---- what it MUST find -------------------------------------------------------------------------
ecSiCase('THE DEFECT: a language string echoed raw inside quotes, which is what Rock-Chute.php did',
    "<script>\nvar o = { k: '{$O}=\$ec_lang['k']{$C}' };\n</script>", true);
ecSiCase('the same value echoed raw and unquoted, which is no safer',
    "<script>\nvar o = { k: {$O}=\$ec_lang['k']{$C} };\n</script>", true);
ecSiCase('the LONG echo form, which is the same interpolation spelled differently',
    "<script>\nvar k = '{$O}php echo \$ec_lang['k']; {$C}';\n</script>", true);
ecSiCase('an arbitrary variable, not only a language key -- anything can carry a quote',
    "<script>\nvar t = '{$O}=\$html_title{$C}';\n</script>", true);
ecSiCase('one encoded and one raw in the same block, which is exactly the shipped shape',
    "<script>\nvar o = { a: {$O}=json_encode(\$ec_lang['a']){$C}, b: '{$O}=\$ec_lang['b']{$C}' };\n</script>", true);
ecSiCase('a constant that is NOT the declared one -- the exception is keyed on the expression',
    "<script>\nvar d = '{$O}=EC_SOME_OTHER_THING{$C}';\n</script>", true);

// ---- what it must NOT report -------------------------------------------------------------------
ecSiCase('the idiom this suite writes 1,363 times',
    "<script>\nvar o = { k: {$O}=json_encode(\$ec_lang['k']){$C} };\n</script>", false);
ecSiCase('json_encode with flags, which is still json_encode',
    "<script>\nEngCalcs.icons = {$O}=json_encode(\$icons, JSON_UNESCAPED_SLASHES){$C};\n</script>", false);
ecSiCase('A COMMENT ISLAND. Looped-Network.php carries dozens, and they are the reason a long-form '
    . 'island is only read when it echoes',
    "<script>\n{$O}php // The Settings box (Task 441). Four of its five strings are borrowed. {$C}\nvar x = 1;\n</script>", false);
ecSiCase('an island that CALLS a function -- a second door, and not this scan to judge',
    "<script>\n{$O}php echoCookieScript(); {$C}\n</script>", false);
ecSiCase('the DECLARED exception',
    "<script>\nif (set === '{$O}=EC_DEFAULT_UNIT_SET{$C}') { f(); }\n</script>", false);
ecSiCase('THE SCRIPT TAG\'S OWN src, which is an attribute and not the block body -- the cache-buster '
    . 'is page_meta_check.php\'s',
    "<script src=\"/engcalcs/js/rock-chute.js?v={$O}=filemtime(__DIR__ . '/js/rock-chute.js'){$C}\"></script>", false);
ecSiCase('an interpolation OUTSIDE every script block, which is ordinary page markup',
    "<p>{$O}=htmlspecialchars(\$ec_lang['k']){$C}</p>", false);
ecSiCase('a page with no script block at all',
    "<p>hello</p>", false);

// ---- the corpus, and the live mutation ---------------------------------------------------------
$out = array();
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/script_interpolation_check.php') . ' 2>&1', $out, $code);
$line = implode("\n", $out);
$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding:\n      $line";
}
$n++;
if (!preg_match('/OK -- (\d+) value/', $line, $m)) {
    $fails[] = "corpus: could not read the encoded count out of:\n      $line";
} elseif ((int) $m[1] < 1200) {
    $fails[] = sprintf('corpus: only %d interpolation(s) found. 1,369 shipped on 2026-09-17, and a '
        . 'collapse this large means the scan stopped reaching the pages rather than that the '
        . 'bridge shrank -- which on a ratchet reads as progress.', (int) $m[1]);
}

// The live mutation. A page nothing links and no menu names, written for the length of one exec,
// removed inline AND on shutdown so a selftest cannot leave a stray page in the document root.
$probe = dirname(__DIR__, 2) . '/ec-selftest-interp.php';
register_shutdown_function(function () use ($probe) { @unlink($probe); });
file_put_contents(
    $probe,
    "<?php // TEMPORARY: written by dev/scripts/script_interpolation_selftest.php.\n"
    . "?>\n<script>\nvar ecSelftestProbe = '<?" . "=\$ec_lang['ec_selftest_probe_key']?" . ">';\n</script>\n"
);
$out2 = array();
$code2 = 0;
exec('php ' . escapeshellarg(__DIR__ . '/script_interpolation_check.php') . ' 2>&1', $out2, $code2);
@unlink($probe);
$probeLine = implode("\n", $out2);
$n++;
if (strpos($probeLine, 'ec-selftest-interp.php') === false || $code2 === 0) {
    $fails[] = "corpus mutation: a page with one raw interpolation inside a script block was "
        . "written into the document root and the check did not fail on it. The scan is not "
        . "reaching the files it claims to guard. Its output was:\n      " . $probeLine;
}

// And the dead-declaration leg: an exception nobody can trip is a ratchet gone slack, so the
// check must FAIL on one. Driven through the real script with an extra declaration injected via
// its own library entry point, because the shipped list is by definition all live.
$n++;
$deadCheck = ecScriptInterpFindings(
    array('x.php' => "<script>var a = " . $O . "=json_encode(1)" . $C . ";</script>"),
    array('EC_NOBODY_WRITES_THIS' => 'a declaration that matches nothing')
);
if (($deadCheck['allowed']['EC_NOBODY_WRITES_THIS'] ?? -1) !== 0) {
    $fails[] = 'dead declaration: the finder does not report a zero hit count for an exception '
        . 'nothing matches, so the check cannot fail on one.';
}

if ($fails) {
    echo 'script_interpolation selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "Script interpolation selftest OK -- $n cases, both directions, plus a live mutation and the\n";
echo "dead-declaration leg.\n";
exit(0);
