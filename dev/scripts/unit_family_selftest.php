<?php
/**
 * unit_family_selftest.php — assert unit_family_check.php still finds each of the five silent
 * defects, and stays quiet on a healthy declaration. BLOCKING.
 *
 * WHY THIS EXISTS. The check passes today and will pass tomorrow; that is what a healthy repo
 * looks like and also what a broken check looks like. Since it BLOCKS commits, a blind version is
 * not a missing opinion, it is a green light — the same argument that produced
 * stale_claim_selftest.php, applied before the check has had time to rot rather than after.
 *
 * Each fixture is a whole small world (families, presets, units, page references), so the check is
 * exercised exactly as it runs, with nothing stubbed and no real file touched.
 *
 *   php dev/scripts/unit_family_selftest.php
 */

define('UNIT_FAMILY_LIB_ONLY', true);
require __DIR__ . '/unit_family_check.php';

$goodFam   = ['distance_small' => ['m', 'ft'], 'velocity' => ['mps', 'ftps']];
$goodSets  = [
    'us' => ['distance_small' => 'ft', 'velocity' => 'ftps'],
    'si' => ['distance_small' => 'm',  'velocity' => 'mps'],
];
$goodUnits = ['m' => 1.0, 'ft' => 3.280839895, 'mps' => 1.0, 'ftps' => 3.280839895];

// [expected finding codes (sorted), families, sets, units, pageRefs, what shape this is]
$fixtures = [
    [[], $goodFam, $goodSets, $goodUnits, ['distance_small' => ['Manning-Pipe-Flow.php']],
        'a healthy declaration: the check must be silent, or it teaches its reader to skip it'],

    [['missing-in-preset'],
        $goodFam,
        ['us' => ['distance_small' => 'ft', 'velocity' => 'ftps'], 'si' => ['distance_small' => 'm']],
        $goodUnits, [],
        'THE DEFECT CLAUDE.md NAMES: one family absent from one preset, so that field ignores the button'],

    [['preset-unit-not-offered'],
        $goodFam,
        ['us' => ['distance_small' => 'in', 'velocity' => 'ftps'], 'si' => ['distance_small' => 'm', 'velocity' => 'mps']],
        $goodUnits + ['in' => 39.37], [],
        'a preset choosing a unit its own family does not list — the select renders with nothing chosen'],

    [['preset-unknown-family', 'preset-unknown-family'],   // once per preset that still carries it
        $goodFam,
        ['us' => ['distance_small' => 'ft', 'velocity' => 'ftps', 'distnce_large' => 'ft'],
         'si' => ['distance_small' => 'm', 'velocity' => 'mps', 'distnce_large' => 'm']],
        $goodUnits, [],
        'a preset row left behind by a renamed family'],

    [['no-factor'],
        ['distance_small' => ['m', 'ft', 'cubit'], 'velocity' => ['mps', 'ftps']],
        $goodSets, $goodUnits, [],
        'an offered unit with no conversion factor: a name that resolves to nothing'],

    [['unknown-family-named'],
        $goodFam, $goodSets, $goodUnits,
        ['distnce_small' => ['Manning-Trap.php', 'Manning-Trap.php']],
        "a page's 'units' => typo, which leaves that field with no family and no preset"],

    [['missing-in-preset', 'missing-in-preset', 'no-factor'],
        ['distance_small' => ['m', 'ft'], 'velocity' => ['mps', 'ftps'], 'stress' => ['kpa']],
        $goodSets, $goodUnits, [],
        'a whole family added and wired to nothing: reported once per preset, plus its dead unit'],
];

$fail = 0;
foreach ($fixtures as [$want, $fam, $sets, $units, $refs, $shape]) {
    $got = array_column(ecUnitFamilyFindings($fam, $sets, $units, $refs), 0);
    sort($got);
    $wantSorted = $want;
    sort($wantSorted);
    if ($got === $wantSorted) {
        continue;
    }
    $fail++;
    printf("FAIL  expected [%s] got [%s]  (%s)\n\n", implode(',', $wantSorted), implode(',', $got), $shape);
}

// The page-reference scanner is the one part that reads text rather than arrays, so it gets its
// own fixture: a literal declaration is a reference, and a dynamic one is deliberately not.
$tmp = tempnam(sys_get_temp_dir(), 'ufam');
file_put_contents($tmp, "<?php\n\$a = Array('units' => 'distance_small');\n\$b = Array('units' => \$fam);\n");
$refs = ecUnitFamilyPageRefs([$tmp], dirname($tmp));
unlink($tmp);
if (array_keys($refs) !== ['distance_small']) {
    $fail++;
    printf("FAIL  page reference scan returned [%s]; expected the one literal family and not the variable\n\n",
        implode(',', array_keys($refs)));
}

printf("%s: %d fixtures, %d mismatched.\n", $fail ? 'FAIL' : 'PASS', count($fixtures) + 1, $fail);
if ($fail) {
    echo "unit_family_check.php no longer sees a defect it is supposed to block. Fix the check, not\n";
    echo "the fixture — a fixture edited to match a broken check is how a blocking check goes blind.\n";
}
exit($fail ? 1 : 0);
