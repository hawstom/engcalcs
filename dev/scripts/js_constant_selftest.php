<?php
/**
 * js_constant_check.php still SEES a retyped constant, and still turns away what only looks like one.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS IS A RATCHET AT ZERO. A ratchet that has gone
 * blind looks exactly like one that is holding -- both print zero findings -- and this one is
 * easier to blind than most: narrow the number regex by one character, or let the comment blanker
 * swallow a line of code, and it reports "0 near-misses" forever. That already nearly happened.
 * The first comment blanker written for it was a whole-file state machine, and the apostrophes in
 * `EngCalcs.G`'s own explanatory comment put it into string mode for the rest of the file; the
 * symptom was the opposite of blindness that time (seven comment lines reported as constants),
 * which is the loud version of the same fault.
 *
 * So the fixtures below are the guarantee, the negative ones are the load-bearing half, and the
 * corpus is proved by a LIVE MUTATION rather than by a count that reads as progress when it falls.
 */

define('EC_JS_CONSTANT_LIB_ONLY', 1);
require_once __DIR__ . '/js_constant_check.php';

$fails = [];
$n = 0;
$Q = ecJsConstantQuantities(9.80665);

/**
 * @param string $js     fixture source
 * @param int    $expect how many findings the scan must report
 */
function ecConstCase(string $name, string $js, int $expect, array $except = []): void
{
    global $fails, $n, $Q;
    $n++;
    $stats = [];
    $got = ecJsConstantFindings(['js/fixture.js' => $js], $Q, $except, $stats);
    if (count($got) !== $expect) {
        $fails[] = sprintf("%s\n      expected %d finding(s), got %d: %s",
            $name, $expect, count($got), json_encode($got));
    }
}

// ---- 1. The shapes it must FIND ----------------------------------------------------------------
ecConstCase('a rounded foot', "var f = 0.30480;\n", 0); // 0.30480 IS 0.3048 -- exact, not a finding
ecConstCase('a truncated foot', "var f = 0.3048006;\n", 1);
ecConstCase('a rounded metres-per-foot', "var f = 3.28084;\n", 1);
ecConstCase('the real psi near-miss, verbatim', "var PSI_M = 0.703070;\n", 1);
ecConstCase('the real cubic-foot near-miss, verbatim', "var x = { toSI: 0.0283168466 };\n", 1);
ecConstCase('a rounded gravity', "var g = 9.806;\n", 1);
ecConstCase('EPANET\'s own 32.2 ft/s2 in SI', "var g = 9.81456;\n", 1);
ecConstCase('a near-miss in an expression, not only in an assignment',
    "var v = q * 0.0283168466 / 2;\n", 1);

// ---- 2. The shapes it must TURN AWAY ------------------------------------------------------------
// These are the whole point: anybody can write a scanner that finds things.
ecConstCase('the exact foot', "var f = 0.3048;\n", 0);
ecConstCase('the exact metres-per-foot', "var f = 3.280839895013123;\n", 0);
ecConstCase('a derived expression, which is the fix this check asks for',
    "var m3 = 0.3048 * 0.3048 * 0.3048;\n", 0);
ecConstCase('exact standard gravity', "var g = 9.80665;\n", 0);
ecConstCase('a number that is nothing to do with a conversion', "var pad = 12;\nvar r = 0.75;\n", 0);
ecConstCase('a LINE comment recording a rounded value -- documentation, not code',
    "// it was 3.28084 once, and 0.703070 before that\nvar f = 1 / 0.3048;\n", 0);
ecConstCase('a BLOCK comment recording a rounded value',
    "/**\n * 0.0283168466 was the old cubic foot.\n */\nvar x = 1;\n", 0);
ecConstCase('APOSTROPHES IN A COMMENT DO NOT OPEN A STRING -- the fault that broke the first blanker',
    "// EPANET's own g isn't ours, and it's 9.81456\nvar g = 9.80665;\n// don't reintroduce 9.806\n", 0);
ecConstCase('a version-shaped number in a string is not a constant',
    "var url = 'https://example.org/v/3.28084/x';\n", 0);
ecConstCase('a property access is not a bare literal', "var a = obj.0283168466;\n", 0);
ecConstCase('a DECLARED exception is turned away with its reason',
    "var PSI_M = 0.703070;\n", 0, ['fixture.js' => ['0.703070' => 'declared for the selftest']]);

// ---- 3. The quantity table itself ---------------------------------------------------------------
$n++;
if (abs($Q['m -> ft'] - 3.280839895013123) > 1e-15) {
    $fails[] = 'the table\'s metres-per-foot is not the suite\'s value.';
}
$n++;
if (abs($Q['standard gravity'] - 9.80665) > 1e-15) {
    $fails[] = 'the table does not carry the gravity it was handed -- it is retyping one.';
}

// ---- 4. The corpus, by LIVE MUTATION -------------------------------------------------------------
// A count of findings cannot guard a ratchet at zero: fixing the last one makes any "at least one
// exists" assertion fail on a tree that has just been repaired, which is how this repo's previous
// corpus guard died of success. So a temporary module carrying one deliberately rounded foot is
// written into the real js/ directory, the REAL check is run over the REAL directory, and it must
// name that file. Removed on shutdown as well as inline: a selftest that can leave a stray file in
// js/ has invented a failure mode of its own.
$probe = dirname(__DIR__, 2) . '/js/ec_selftest_constant.js';
register_shutdown_function(static function () use ($probe) { @unlink($probe); });
file_put_contents($probe, "// TEMPORARY: written by dev/scripts/js_constant_selftest.php.\n"
    . "var EC_SELFTEST_FT_PER_M = 3.28084;\n");
$out = [];
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/js_constant_check.php') . ' 2>&1', $out, $code);
@unlink($probe);
$line = implode("\n", $out);
$n++;
if (strpos($line, 'ec_selftest_constant.js') === false) {
    $fails[] = "corpus mutation: a module with one deliberately rounded metres-per-foot was written "
        . "into js/ and the check did not report it. The scan is not reaching the directory it "
        . "claims to guard. Its output was:\n      " . $line;
}

// And the tree as it stands must pass, with the agreements counted -- a scan that stopped reading
// numbers altogether would also report zero near-misses.
$out2 = [];
$code2 = 0;
exec('php ' . escapeshellarg(__DIR__ . '/js_constant_check.php') . ' 2>&1', $out2, $code2);
$clean = implode("\n", $out2);
$n++;
if ($code2 !== 0) {
    $fails[] = "corpus: the check exits $code2 on the tree it is guarding:\n      " . $clean;
}
$n++;
if (!preg_match('/(\d+) exact agreement/', $clean, $m) || (int) $m[1] < 20) {
    $fails[] = "corpus: the check reports " . ($m[1] ?? '?') . " exact agreements with the suite's "
        . "definitions. 33 were counted on 2026-09-09; a collapse means the scan went blind, not "
        . "that the constants were deleted.\n      " . $clean;
}

if ($fails) {
    echo 'js_constant selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  $f\n"; }
    exit(1);
}
echo "js_constant selftest OK -- $n cases.\n";
