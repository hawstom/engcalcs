<?php
/**
 * unit_default_preset_check.php still reads a MULTI-LINE declaration, and still allows the two
 * scalars that are genuinely unit-independent.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. The check finds nothing on the tree it landed on, which is the honest result for
 * a rule nobody has broken -- and it is also indistinguishable from a check that has gone blind.
 * Two ways it could:
 *
 *   1. THE SPLIT. The suite has exactly one field declaration spanning more than one line
 *      (`Manning-Trap.php`'s `d50_in`), and a line-based scan reads 62 of 63 and reports OK. That
 *      one is a fixture here, verbatim in shape.
 *   2. THE EXCEPTIONS. Empty and zero are allowed because they are unit-independent. Widen that by
 *      one step -- allow any short scalar, allow anything numeric -- and the check permits exactly
 *      the defect it exists to catch. Both edges are fixtures.
 *
 * The half-array case has no example in the tree at all and is the one a future author is most
 * likely to write, so it is only ever tested here.
 */

define('UNIT_DEFAULT_LIB_ONLY', 1);
require_once __DIR__ . '/unit_default_preset_check.php';

$fails = [];
$n = 0;

function ecUdCase(string $name, string $got, string $want): void
{
    global $fails, $n;
    $n++;
    if ($got !== $want) {
        $fails[] = sprintf("%s\n      expected %s\n      got      %s", $name,
            var_export($want, true), var_export($got, true));
    }
}

// ---- 1. ecUnitDefaultVerdict: what is allowed and what is not ----------------------------------
ecUdCase('per-preset array is correct',
    ecUnitDefaultVerdict("Array('us' => '18', 'si' => '450'), 'units' => 'distance_small',"), '');
ecUdCase('short-array syntax is correct too',
    ecUnitDefaultVerdict("['us' => '18', 'si' => '450'],"), '');
ecUdCase('empty string is unit-independent',
    ecUnitDefaultVerdict("'', 'units' => 'distance_site',"), '');
ecUdCase('zero is unit-independent',
    ecUnitDefaultVerdict("'0', 'units' => 'distance_medium',"), '');
ecUdCase('zero with a decimal point is still zero',
    ecUnitDefaultVerdict("'0.0',"), '');
ecUdCase('no default at all is not a finding',
    ecUnitDefaultVerdict(null), '');

// THE DEFECT ITSELF. A bare 6 on a family that is inches under us and mm under si.
ecUdCase('a bare scalar on a differing family IS the defect',
    ecUnitDefaultVerdict("'6', 'units' => 'distance_small',"), "the scalar default '6'");
ecUdCase('an unquoted scalar is the same defect',
    ecUnitDefaultVerdict('6, '), 'the scalar default 6');
ecUdCase('a non-zero decimal is not exempted by looking small',
    ecUnitDefaultVerdict("'0.5',"), "the scalar default '0.5'");

// HALF AN ARRAY -- worse than a scalar, and nothing in the tree exercises it.
ecUdCase('an array naming only us opens EMPTY under si',
    ecUnitDefaultVerdict("Array('us' => '18'),"),
    "a per-preset default naming only 'us', so the field opens EMPTY under the other one");
ecUdCase('an array naming only si opens EMPTY under us',
    ecUnitDefaultVerdict("Array('si' => '450'),"),
    "a per-preset default naming only 'si', so the field opens EMPTY under the other one");
ecUdCase('an array naming neither',
    ecUnitDefaultVerdict("Array('0', '1'),"), 'a per-preset default naming neither preset');

// ---- 2. ecUnitDefaultFields: the split, including the multi-line shape --------------------------
$oneLine = "Array('name' => 'd0', 'type' => 'number', 'default' => Array('us' => '18', "
    . "'si' => '450'), 'units' => 'distance_small', 'label' => \$ec_lang['mpf_pipe_diameter']),";
$got = ecUnitDefaultFields($oneLine);
$n++;
if (count($got) !== 1 || $got[0]['name'] !== 'd0' || $got[0]['units'] !== 'distance_small'
    || strpos((string) $got[0]['default'], "'us' => '18'") === false) {
    $fails[] = 'one-line declaration: ' . json_encode($got);
}

// Manning-Trap.php's d50_in, in shape: the ONE declaration a line scanner cannot read.
$multi = "Array(\n\t'name' => 'd50_in', \n\t'type' => 'number', 'default' => Array('us' => '4', "
    . "'si' => '100'),\n\t'units' => 'distance_small', \n\t'label' => 'x'),";
$got = ecUnitDefaultFields($multi);
$n++;
if (count($got) !== 1 || $got[0]['units'] !== 'distance_small'
    || strpos((string) $got[0]['default'], "'si' => '100'") === false) {
    $fails[] = 'MULTI-LINE declaration not read -- this is the shape a line scanner misses: '
        . json_encode($got);
}

// A defaultless result field must not borrow the NEXT field's default.
$pair = "Array('name' => 'a', 'units' => 'flow_area', 'label' => 'A'),\n"
    . "Array('name' => 'd0', 'default' => '6', 'units' => 'distance_small', 'label' => 'D'),";
$got = ecUnitDefaultFields($pair);
$n++;
if (count($got) !== 2 || $got[0]['default'] !== null || $got[1]['default'] === null) {
    $fails[] = 'a defaultless field borrowed a later default: ' . json_encode($got);
}

// ---- 3. The corpus, so a silently narrowed scan cannot pass -------------------------------------
$out = [];
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/unit_default_preset_check.php') . ' 2>&1', $out, $code);
$line = implode("\n", $out);
$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding:\n      $line";
} elseif (!preg_match('/(\d+) field\(s\) on families whose presets differ: (\d+) declare one/', $line, $m)) {
    $fails[] = "corpus: could not read the check's own counts out of:\n      $line";
} elseif ((int) $m[2] < 40) {
    $fails[] = sprintf('corpus: only %d per-preset defaults found. 50 shipped on 2026-09-06; a '
        . 'collapse this large means the scan stopped reading declarations, not that the pages '
        . 'lost their defaults.', (int) $m[2]);
}

if ($fails) {
    echo 'unit_default_preset selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  $f\n"; }
    exit(1);
}
echo "unit_default_preset selftest OK -- $n cases.\n";
