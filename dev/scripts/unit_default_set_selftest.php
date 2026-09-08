<?php
/**
 * unit_default_set_selftest.php -- the first-visit unit preset and the measured option order,
 * pinned. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * TWO DECISIONS TAKEN ON THE USAGE DATA, 2026-09-08 (dev/usage-data-log.md, same date), each of
 * which fails with a page that renders and looks right:
 *
 *   1. ecDefaultUnitSet(): US customary only for an ENGLISH page in a browser whose first
 *      Accept-Language tag names the United States; SI for every other tag, for a bare 'en'
 *      (Tom: "I lean toward SI when it's ambiguous"), and for every other language. A request
 *      with NO header at all keeps the status quo -- US for English -- because that is a CLI
 *      render or a crawler, and every worked example in dev/calc-spike/ was anchored on the US
 *      defaults render_page.php produces with no header. Get any row of this table wrong and the
 *      page opens on the wrong preset for a quarter of the English audience, silently.
 *
 *   2. The option ORDER in lib/Units.lib.php is ranked by measured selections and is a ratchet:
 *      the unit at the top of each list is the one people switch TO. This pins the first option
 *      of each reordered family so a well-meant "SI first" or alphabetical tidy-up fails here
 *      rather than quietly undoing a measurement. Re-measure, then move the pin.
 *
 *   php dev/scripts/unit_default_set_selftest.php
 */
$clanguage = 'en';
require_once __DIR__ . '/../../lib/config.inc.php';
require_once __DIR__ . '/../../lib/Units.lib.php';

$fail = 0;
function ec_uds_expect($label, $ok, $detail = '') {
    global $fail;
    if ($ok) { echo "  ok   $label\n"; return; }
    $fail++;
    echo "  FAIL $label" . ($detail !== '' ? "\n        $detail" : '') . "\n";
}

// ---- 1. the preset rule, as a table --------------------------------------------------------------
$cases = [
    // lang   asked tag   want   why
    ['en',   'en-us',    'us',  'an English page in a United States browser'],
    ['en',   'en-pr',    'us',  'a US territory'],
    ['en',   'en-gb',    'si',  'the UK reads English and works in SI'],
    ['en',   'en-au',    'si',  'Australia'],
    ['en',   'en-ca',    'si',  'Canada'],
    ['en',   'en-in',    'si',  'India'],
    ['en',   'en',       'si',  'a bare en names no region: ambiguous, so SI (Tom, 2026-09-08)'],
    ['en',   '',         'si',  'a header present but unusable is a browser, not a harness: SI'],
    ['en',   null,       'us',  'NO header at all is a CLI render or a crawler: the status quo'],
    ['en',   'es-mx',    'si',  'an English page read from a Spanish-language browser'],
    ['es',   'en-us',    'si',  'a Spanish page keeps Task 165: every other language is SI'],
    ['fr',   null,       'si',  'a French CLI render is SI too'],
    ['pt',   'pt-br',    'si',  'Portuguese'],
];
foreach ($cases as [$lang, $asked, $want, $why]) {
    $got = ecDefaultUnitSet($lang, $asked);
    ec_uds_expect(sprintf('%-4s %-8s -> %s  (%s)', $lang, var_export($asked, true), $want, $why),
        $got === $want, "got $got");
}

// The constant itself, as this process defined it: $clanguage was 'en' and a CLI has no header.
ec_uds_expect('EC_DEFAULT_UNIT_SET in a header-less English render is us (what the harnesses anchor on)',
    EC_DEFAULT_UNIT_SET === 'us', 'got ' . EC_DEFAULT_UNIT_SET);

// ---- 2. the measured order, pinned ---------------------------------------------------------------
// From dev/usage-data-log.md, 2026-09-08: pooled `units` rows over 2026-08-14..22 and
// 2026-09-03..07. Re-measure before moving any of these.
$firsts = [
    'distance_small'  => 'mm',            // mm 165 over m 127
    'distance_medium' => 'm',             // m 50 over mm 19
    'roughness'       => 'mm',            // follows distance_small; no data of its own
    'flow_channel'    => 'lps',           // lps 245 over gpm 167
    'flow_pipe'       => 'lps',           // shares the list
    'slope'           => 'gradePercent',  // 539 over 118
    'gradient'        => 'gradePercent',  // shares the list
    'fraction'        => 'depthPercent',  // 324 over 92
    'percentage'      => 'depthPercent',  // shares the list
];
foreach ($firsts as $family => $unit) {
    ec_uds_expect("first option of $family is $unit",
        isset($ec_unit_families[$family]) && $ec_unit_families[$family][0] === $unit,
        'got ' . (isset($ec_unit_families[$family]) ? $ec_unit_families[$family][0] : '(no such family)'));
}
// Nothing was deleted in the reorder: the four distance units and the six flow units are all
// still offered, in every family that offers them.
ec_uds_expect('distance_small and distance_medium still offer the same four units',
    count(array_diff(['m', 'mm', 'ft', 'in'], $ec_unit_families['distance_small'])) === 0
    && count(array_diff(['m', 'mm', 'ft', 'in'], $ec_unit_families['distance_medium'])) === 0
    && count($ec_unit_families['distance_small']) === 4 && count($ec_unit_families['distance_medium']) === 4);
ec_uds_expect('flow_channel still offers all six flow units',
    count(array_diff(['m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'], $ec_unit_families['flow_channel'])) === 0
    && count($ec_unit_families['flow_channel']) === 6);

if ($fail) {
    echo "\n$fail check(s) failed. Either the first-visit preset rule moved without its table, or a\n";
    echo "measured option order was re-sorted by hand. Both render a page that looks right.\n";
    exit(1);
}
echo "\nUnit default set selftest OK -- " . count($cases) . " preset cases, " . count($firsts) . " pinned orders.\n";
exit(0);
