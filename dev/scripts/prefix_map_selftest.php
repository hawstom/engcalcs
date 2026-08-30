<?php
/**
 * prefix_map_selftest.php — assert prefix_map_check.php still sees an unwired prefix, and still
 * does not report the ones that are legitimately wired or legitimately declared. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. The check finds nothing today and must keep finding nothing, which is the
 * condition under which a blind check and a working one look identical from outside. It has two
 * specific ways to go blind and a fixture pins each: a key with NO underscore has no prefix at all
 * (it must not invent one), and a prefix listed in both places must not cancel itself out into
 * silence. It has one way to become a nuisance -- reporting a prefix that is wired or declared --
 * and a false positive here fails every commit until somebody deletes the check.
 *
 *   php dev/scripts/prefix_map_selftest.php
 */

define('PREFIX_MAP_LIB_ONLY', true);
require __DIR__ . '/prefix_map_check.php';

// 'ghost' is wired with no keys, which is a NOTE and never a failure. 'u' is declared, so it reads
// as stale in every fixture that supplies no u_ key -- true, and beside the point of those
// fixtures, so it is subtracted out of the comparison and pinned on its own below.
$map      = ['mpf' => ['flow'], 'lpn' => ['head'], 'ghost' => ['flow']];
$declared = ['u' => 'unit symbols'];

$cases = [
    // name, English keys, [unwired, contradictory, stale-other-than-'u']
    ['a wired prefix is silent',
        ['mpf_flow' => 'Flow', 'mpf_slope' => 'Slope'],                 [0, 0, 0]],
    ['a declared prefix is silent',
        ['u_ft' => 'ft', 'mpf_flow' => 'Flow'],                         [0, 0, 0]],
    ['A NEW CALCULATOR NOBODY WIRED -- the whole point',
        ['mpf_flow' => 'Flow', 'xyz_flow' => 'Flow'],                   [1, 0, 0]],
    ['two unwired prefixes are two findings',
        ['xyz_flow' => 'Flow', 'abc_head' => 'Head'],                   [2, 0, 0]],
    ['many keys under one unwired prefix are still one finding',
        ['xyz_a' => '1', 'xyz_b' => '2', 'xyz_c' => '3'],               [1, 0, 0]],
    // A key with no underscore is not a prefix. detectPrefixes() ignores it and so must this, or
    // every such key becomes a permanent false finding nobody can clear.
    ['a key with no underscore has no prefix and is ignored',
        ['welcome' => 'Hi', 'mpf_flow' => 'Flow'],                      [0, 0, 0]],
    ['a leading underscore is not an empty prefix',
        ['_private' => 'x'],                                            [0, 0, 0]],
    ['a second underscore does not split the prefix again',
        ['mpf_flow_tip' => 'Tip'],                                      [0, 0, 0]],
    ['a fixture that supplies no key for a declared prefix leaves only that one stale',
        ['mpf_flow' => 'Flow'],                                         [0, 0, 0]],
];

$fails = 0;
foreach ($cases as [$name, $keys, $want]) {
    $f = ecPrefixMapFindings($keys, $map, $declared);
    $stale = count(array_diff($f['stale'], ['u']));
    $got = [count($f['unwired']), count($f['contradictory']), $stale];
    if ($got !== $want) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted [unwired, contradictory, stale] = [' . implode(', ', $want)
            . '], got [' . implode(', ', $got) . "]\n";
    } else {
        echo "  ok   $name\n";
    }
}

// ---- the two findings the shared pair above cannot express ---------------------------------
// A prefix in BOTH lists. The map wins at runtime, so the declaration is a comment that reads as a
// decision and is not one; it must not come out as "accounted for".
$both = ecPrefixMapFindings(['mpf_flow' => 'Flow'], ['mpf' => ['flow']], ['mpf' => 'chrome']);
if (count($both['contradictory']) !== 1) {
    $fails++;
    echo "  FAIL a prefix in both lists is a contradiction, not silence\n";
    echo '        wanted 1, got ' . count($both['contradictory']) . "\n";
} else {
    echo "  ok   a prefix in both lists is a contradiction, not silence\n";
}

// A declaration naming a prefix that has left. Reported, so the list cannot rot into a record of
// decisions about things that are gone.
$leftBehind = ecPrefixMapFindings(['mpf_flow' => 'Flow'], ['mpf' => ['flow']], ['gone' => 'left']);
if ($leftBehind['stale'] !== ['gone']) {
    $fails++;
    echo "  FAIL a declaration for a departed prefix is reported\n";
    echo '        wanted [gone], got [' . implode(', ', $leftBehind['stale']) . "]\n";
} else {
    echo "  ok   a declaration for a departed prefix is reported\n";
}

// A wired prefix with no keys is the one thing that must stay a NOTE: removing it is a judgement
// call (CLAUDE.md declines to guess about 'irr'), so it must never reach the fatal count.
$noteOnly = ecPrefixMapFindings(['mpf_flow' => 'Flow'], ['mpf' => ['flow'], 'irr' => ['flow']], []);
$fatal = count($noteOnly['unwired']) + count($noteOnly['contradictory']) + count($noteOnly['stale']);
if ($fatal !== 0 || $noteOnly['unused'] !== ['irr']) {
    $fails++;
    echo "  FAIL a wired prefix with no keys is a note, never a failure\n";
    echo "        fatal=$fatal, unused=[" . implode(', ', $noteOnly['unused']) . "]\n";
} else {
    echo "  ok   a wired prefix with no keys is a note, never a failure\n";
}

if ($fails) {
    echo "\n$fails fixture(s) failed. prefix_map_check.php's reach has moved.\n";
    echo "A false negative here is a whole calculator's glossary -- definitions, preferred\n";
    echo "translations, and every avoid array -- never reaching a single translation agent, with\n";
    echo "payloads generating and --check saying FRESH the entire time.\n";
    exit(1);
}
echo "\nPrefix-map selftest OK -- " . (count($cases) + 3) . " fixtures, both directions.\n";
exit(0);
