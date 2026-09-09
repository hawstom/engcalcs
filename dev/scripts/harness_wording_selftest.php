<?php
/**
 * harness_wording_check.php still SEES a pinned string, and still turns away what only looks like one.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS IS A RATCHET. A ratchet that has gone blind prints
 * a SMALLER number than its baseline and exits 0, which reads as progress -- the same failure mode
 * that killed `js_fallback_string_selftest.php`'s first corpus guard. Narrow the literal regex by
 * one character here and the report says "12 pins against a baseline of 199, lower the baseline"
 * forever. The negative fixtures are the load-bearing half: anybody can write a scanner that finds
 * things, and this one has to keep NOT finding element ids, CSS classes and unit keywords.
 */

define('EC_HARNESS_WORDING_LIB_ONLY', 1);
require_once __DIR__ . '/harness_wording_check.php';

$fails = [];
$n = 0;

$EN = [
    'lpn_diag_not_converged_drawn' => 'The solve did not converge. These numbers are drawn anyway. Do not use them.',
    'lpn_energy_no_price'          => 'No price of power is stated, so no cost is shown.',
    'lpn_field_base_demand'        => 'Base demand',
    'lpn_run'                      => 'Run',
    'about_body_html'              => 'A suite of <b>free</b> hydraulic calculators for the world.',
];

function ecHwCase(string $name, string $js, int $expect): void
{
    global $fails, $n, $EN;
    $n++;
    $stats = [];
    $got = ecHarnessWordingFindings(['dev/lpn-spike/fixture.js' => $js], $EN, $stats);
    if (count($got) !== $expect) {
        $fails[] = sprintf("%s\n      expected %d, got %d: %s", $name, $expect, count($got), json_encode($got));
    }
}

// ---- 1. The shapes it must FIND ----------------------------------------------------------------
ecHwCase('a regex asserting a fragment -- the real 2026-09-08 shape',
    "check(/did not converge/.test(status));\n", 1);
ecHwCase('a single-quoted indexOf assertion',
    "check(report.indexOf('No price of power is stated') >= 0);\n", 1);
ecHwCase('a double-quoted assertion',
    "check(x === \"The solve did not converge.\");\n", 1);
ecHwCase('a case-insensitive regex, which is still a pin',
    "check(/No price of power is stated/i.test(t));\n", 1);
ecHwCase('markup stripped on the English side, so a plain-text pin still matches',
    "check(t.indexOf('hydraulic calculators for the world') >= 0);\n", 1);
ecHwCase('an escaped dot in a regex is the same sentence',
    "check(/The solve did not converge\\./.test(t));\n", 1);

// ---- 2. The shapes it must TURN AWAY ------------------------------------------------------------
ecHwCase('a two-word label is under the threshold -- an id or a column heading far more often',
    "check(t === 'Base demand');\n", 0);
ecHwCase('a one-word control name',
    "check(btn.textContent === 'Run');\n", 0);
ecHwCase('an element id, which is long but is not wording',
    "const el = doc.getElementById('lpn_settings_engine_native');\n", 0);
ecHwCase('a CSS selector',
    "find(root, '.lpn-prop-row .lpn-field-label');\n", 0);
ecHwCase('a file path',
    "require(__dirname + '/../../js/lpn-solver.js');\n", 0);
ecHwCase('THE FIX ITSELF must not be a finding, or the check punishes the repair',
    "check(t.indexOf(PC.lpn_energy_no_price) >= 0);\n", 0);
ecHwCase('an English-looking sentence that is NOT a shipped string',
    "check(ok, 'the tank should have drained by the fourth step');\n", 0);
ecHwCase('a pin inside a LINE comment is documentation, which is where the record belongs',
    "// this used to assert /did not converge/ and broke on a rewording\ncheck(ok);\n", 0);
ecHwCase('a pin inside a BLOCK comment',
    "/**\n * asserted 'No price of power is stated' once.\n */\ncheck(ok);\n", 0);

// ---- 3. The corpus, by LIVE MUTATION -------------------------------------------------------------
// The baseline is 199 and falling is allowed, so no assertion about the count can prove the scan
// still works. A temporary harness carrying one deliberate pin is written into dev/lpn-spike/, the
// REAL check is run with --list over the REAL tree, and it must name that file. Removed on
// shutdown as well as inline: a selftest that can leave a stray file where run_harnesses.sh globs
// would have invented a failure mode of its own.
$probe = __DIR__ . '/../lpn-spike/zz-selftest-wording-harness.js';
register_shutdown_function(static function () use ($probe) { @unlink($probe); });
$en = null;
require_once __DIR__ . '/lang_parse.inc.php';
$real = ecLangValues((string) file_get_contents(dirname(__DIR__, 2) . '/lib/lang.ec.en.php'));
$victim = null;
foreach ($real as $k => $v) {
    $plain = ecHarnessNormalise($v);
    if (strlen($plain) >= 30 && strlen($plain) <= 100 && substr_count($plain, " ") >= 4 && strpos($v, "'") === false
        && strpos($v, '<') === false && strpos($v, '{') === false) {
        $victim = [$k, $v];
        break;
    }
}
$n++;
if ($victim === null) {
    $fails[] = 'corpus mutation: no shipped English string was long enough to pin. That cannot be '
        . 'true of lib/lang.ec.en.php, so the reader is broken.';
} else {
    file_put_contents($probe,
        "// TEMPORARY: written by dev/scripts/harness_wording_selftest.php. Not a real harness.\n"
        . "check(t.indexOf('" . $victim[1] . "') >= 0);\n");
    $out = [];
    $code = 0;
    exec('php ' . escapeshellarg(__DIR__ . '/harness_wording_check.php') . ' --list 2>&1', $out, $code);
    @unlink($probe);
    $line = implode("\n", $out);
    if (strpos($line, 'zz-selftest-wording-harness.js') === false) {
        $fails[] = "corpus mutation: a harness pinning \$ec_lang['" . $victim[0] . "'] verbatim was "
            . "written into dev/lpn-spike/ and the check did not report it. The scan is not "
            . "reaching the directory it claims to guard.";
    }
}

// And the tree as it stands must pass, having actually read something.
$out2 = [];
$code2 = 0;
exec('php ' . escapeshellarg(__DIR__ . '/harness_wording_check.php') . ' 2>&1', $out2, $code2);
$clean = implode("\n", $out2);
$n++;
if ($code2 !== 0) {
    $fails[] = "corpus: the check exits $code2 on the tree it is guarding:\n      " . $clean;
}
$n++;
if (!preg_match('/(\d+) literal\(s\) examined/', $clean, $m) || (int) $m[1] < 10000) {
    $fails[] = "corpus: only " . ($m[1] ?? '?') . " literals examined. 25,270 were read on "
        . "2026-09-09; a collapse means the scan went blind, not that the harnesses were deleted.";
}

if ($fails) {
    echo 'harness_wording selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  $f\n"; }
    exit(1);
}
echo "harness_wording selftest OK -- $n cases.\n";
