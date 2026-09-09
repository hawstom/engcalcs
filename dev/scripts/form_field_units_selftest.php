<?php
/**
 * form_field_units_selftest.php -- proves form_field_units_check.php can still fail.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * The check finds nothing on today's tree -- 221 seam calls and every one agrees with its page --
 * so it is a ratchet, and a ratchet's danger is that it goes blind and reads as health. Fixtures
 * pin the pure classifiers in both directions; the LIVE MUTATION pins the wiring, because a scan
 * that stops reaching js/ or stops rendering pages prints the same reassuring line.
 *
 * The mutation writes a TEMPORARY calculator page and a TEMPORARY module -- never an edit to a
 * shipped file -- and both are removed inline and on shutdown.
 *
 * Exit 0 clean, 1 on any failure. Blocking.
 */

define('FORM_FIELD_UNITS_LIB_ONLY', true);
require_once __DIR__ . '/form_field_units_check.php';

$fails = [];
$n = 0;

function ffu_case(string $label, bool $ok, string $detail = ''): void
{
    global $fails, $n;
    $n++;
    if (!$ok) { $fails[] = "$label" . ($detail === '' ? '' : ": $detail"); }
}

// ---- ecFormSeamArgs: top-level commas only -------------------------------------------------
$a = ecFormSeamArgs("objForm, 'd', hasUnits = true");
ffu_case('args: three parts', count($a) === 3, 'got ' . count($a));
$a = ecFormSeamArgs("objForm, 'a,b', f(1, 2), true");
ffu_case('args: a comma inside quotes does not split', count($a) === 4, 'got ' . count($a));
ffu_case('args: a comma inside a call does not split', trim($a[2]) === 'f(1, 2)', trim($a[2]));

// ---- ecFormSeamCalls -----------------------------------------------------------------------
$calls = ecFormSeamCalls("this.readFormInput(objForm, 'd', hasUnits = true);");
ffu_case('calls: reads the assignment form', count($calls) === 1 && $calls[0]['units'] === true);
$calls = ecFormSeamCalls("this.readFormInput(objForm, 'd', false);");
ffu_case('calls: reads the bare literal form', count($calls) === 1 && $calls[0]['units'] === false);
$calls = ecFormSeamCalls("EngCalcs.writeFormResult(objForm, 'hf', 4, hasUnits = true);");
ffu_case('calls: writeFormResult puts hasUnits fourth',
    count($calls) === 1 && $calls[0]['name'] === 'hf' && $calls[0]['units'] === true);
$calls = ecFormSeamCalls("this.readFormInputPerUnit(objForm, 'price');");
ffu_case('calls: readFormInputPerUnit is unit-bearing by construction',
    count($calls) === 1 && $calls[0]['units'] === true);
$calls = ecFormSeamCalls("this.readFormInput(objForm, 'q_' + i, hasUnits = true);");
ffu_case('calls: a computed name is turned away, not guessed',
    count($calls) === 1 && $calls[0]['name'] === null);
$calls = ecFormSeamCalls("this.readFormInput(objForm, 'd', wantsUnits);");
ffu_case('calls: a non-literal boolean is turned away',
    count($calls) === 1 && $calls[0]['units'] === null);
$calls = ecFormSeamCalls("this.readFormInput(objForm, 'd', hasUnits = true);\nthis.readFormInput(objForm, 'l', hasUnits = true);");
ffu_case('calls: two calls do not merge', count($calls) === 2);

// ---- ecFormSeamPageNames -------------------------------------------------------------------
$names = ecFormSeamPageNames('<input name="d" id="d_in"><select name="du"></select><td id="hf">');
ffu_case('names: control names read', isset($names['controls']['d'], $names['controls']['du']));
ffu_case('names: ids read', isset($names['ids']['hf']));
ffu_case('names: a bare id is not a control', !isset($names['controls']['hf']));

// ---- ecFormFieldUnitsFindings: both directions ---------------------------------------------
$page = ['controls' => ['d' => true, 'du' => true, 'km' => true], 'ids' => ['hf' => true, 'q' => true]];

$r = ecFormFieldUnitsFindings('P.php', 'm.js', ecFormSeamCalls("x.readFormInput(objForm, 'd', hasUnits = true);"), $page);
ffu_case('agree: unit-bearing field, hasUnits true', $r['findings'] === [] && $r['checked'] === 1);

$r = ecFormFieldUnitsFindings('P.php', 'm.js', ecFormSeamCalls("x.readFormInput(objForm, 'd', hasUnits = false);"), $page);
ffu_case('DISAGREE: a select the arithmetic never applies', count($r['findings']) === 1
    && strpos($r['findings'][0], 'wrong by that unit') !== false);

$r = ecFormFieldUnitsFindings('P.php', 'm.js', ecFormSeamCalls("x.readFormInput(objForm, 'km', hasUnits = true);"), $page);
ffu_case('DISAGREE: hasUnits on a field with no select', count($r['findings']) === 1
    && strpos($r['findings'][0], 'renders no') !== false);

$r = ecFormFieldUnitsFindings('P.php', 'm.js', ecFormSeamCalls("x.readFormInput(objForm, 'km', hasUnits = false);"), $page);
ffu_case('agree: unit-less field, hasUnits false', $r['findings'] === []);

$r = ecFormFieldUnitsFindings('P.php', 'm.js', ecFormSeamCalls("x.readFormInput(objForm, 'nope', hasUnits = false);"), $page);
ffu_case('name: an input naming no control is a finding', count($r['findings']) === 1
    && strpos($r['findings'][0], 'no form control') !== false);

// writeFormResult resolves against IDS, not controls -- it writes through getElementById().
$r = ecFormFieldUnitsFindings('P.php', 'm.js', ecFormSeamCalls("x.writeFormResult(objForm, 'hf', 4, hasUnits = false);"), $page);
ffu_case('result: an id with no unit select passes', $r['findings'] === []);
$r = ecFormFieldUnitsFindings('P.php', 'm.js', ecFormSeamCalls("x.writeFormResult(objForm, 'd', 4, hasUnits = true);"), $page);
ffu_case('result: a result name is looked up among IDS', count($r['findings']) === 1
    && strpos($r['findings'][0], 'no element with id') !== false);

$r = ecFormFieldUnitsFindings('P.php', 'm.js', ecFormSeamCalls("x.readFormInput(objForm, 'q_' + i, hasUnits = true);"), $page);
ffu_case('turned away: counted, never a silent pass',
    $r['findings'] === [] && $r['checked'] === 0 && count($r['turned']) === 1);

// ---- corpus guard: the real run must still be reading a real corpus ------------------------
$out = [];
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/form_field_units_check.php') . ' 2>&1', $out, $code);
$real = implode("\n", $out);
$n++;
if ($code !== 0) {
    $fails[] = "the real check does not pass on today's tree. Its output was:\n      $real";
}
$n++;
if (!preg_match('/OK -- (\d+) literal call/', $real, $m) || (int) $m[1] < 150) {
    $fails[] = "the real check reports fewer than 150 seam calls. A ratchet that has gone blind "
        . "prints the same reassuring line as one that is holding. Its output was:\n      $real";
}

// ---- the live mutation ---------------------------------------------------------------------
// A temporary calculator page loading a temporary module with one flipped hasUnits. Nothing
// shipped is edited. The check must render the page, follow its <script src> to the module, and
// name BOTH. Removed inline and on shutdown.
$root = dirname(__DIR__, 2);
$tmpPage = $root . '/ec_selftest_ffu_page.php';
$tmpMod  = $root . '/js/ec_selftest_ffu.js';
register_shutdown_function(function () use ($tmpPage, $tmpMod) { @unlink($tmpPage); @unlink($tmpMod); });

$src = (string) file_get_contents($root . '/Orifice.php');
file_put_contents($tmpPage, preg_replace('#js/orifice\.js#', 'js/ec_selftest_ffu.js', $src));
file_put_contents($tmpMod,
    "// TEMPORARY: written by dev/scripts/form_field_units_selftest.php and deleted by it.\n"
    . "EngCalcs.pageCalculator = function (objForm) {\n"
    . "\t'use strict';\n\tvar hasUnits;\n\tthis.var = {};\n"
    . "\tthis.readFormInput(objForm, 'd', hasUnits = false);\n"
    . "\tthis.readFormInput(objForm, 'ec_selftest_no_such_field', hasUnits = false);\n"
    . "};\n");

$out2 = [];
$code2 = 0;
exec('php ' . escapeshellarg(__DIR__ . '/form_field_units_check.php') . ' 2>&1', $out2, $code2);
@unlink($tmpPage);
@unlink($tmpMod);
$mut = implode("\n", $out2);

$n++;
if ($code2 === 0 || strpos($mut, 'ec_selftest_ffu.js') === false) {
    $fails[] = "corpus mutation: a temporary page and module with one flipped hasUnits were written "
        . "into the real tree and the check did not fail on them. It is not reaching the pages or "
        . "the modules it claims to guard. Its output was:\n      $mut";
}
$n++;
if (strpos($mut, 'ec_selftest_no_such_field') === false) {
    $fails[] = "corpus mutation: the unresolvable field name was not named. The name leg is not "
        . "running over the rendered page. Its output was:\n      $mut";
}

if ($fails) {
    echo 'form_field_units selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "Form field units selftest OK -- $n cases, both directions, plus a corpus guard and a live\n"
    . "mutation through a temporary page and module.\n";
exit(0);
