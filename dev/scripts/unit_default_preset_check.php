<?php
/**
 * A UNIT-BEARING FIELD'S `default` IS A NUMBER IN THE DISPLAYED UNIT, SO IT IS ONE PER PRESET.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * THE RULE, from CLAUDE.md § Unit Sets: *"A page's `default` number is in the displayed unit, so a
 * unit-bearing field declares one per preset: `'default' => Array('us' => '6', 'si' => '150')`. A
 * scalar is correct only when the value is unit-independent. Getting this wrong is silent -- a
 * scalar `6` reads as 6 in under `us` and 6 mm under `si`."*
 *
 * WHY IT NEEDS A CHECK RATHER THAN A PARAGRAPH. Every symptom is a number a visitor believes. The
 * page renders, the select shows the right unit, the calculator runs, the answer comes back, and
 * the whole thing is wrong by a factor of 25.4 for exactly the half of the world that gets the
 * other preset. Nobody on this side of the deploy sees it: the author works in one preset and it
 * is correct there by construction. It is the same shape as the defect the unit FAMILIES were
 * introduced to kill -- a 1,000 ft main rendering as 12,000 in -- one layer further in.
 *
 * WHAT IS A VIOLATION, AND WHAT IS NOT. The test is not "is the default a scalar"; it is "can this
 * scalar mean the same thing under both presets":
 *
 *   - If the family maps to THE SAME unit in `us` and `si` (`slope` is `grade` in both, `fraction`
 *     is `depthFrac` in both), the number is unit-independent and a scalar is correct. Requiring an
 *     array there would be noise, and noise is how a check gets muted.
 *   - If the family maps to DIFFERENT units, an empty string and a zero are still unit-independent:
 *     an empty box is empty and zero of anything is zero. 13 fields ship that way today and every
 *     one is correct -- refusing them would have made this check unadoptable on the tree it was
 *     written for, which is the honest reason the exception exists and not a courtesy.
 *   - Anything else must be `Array('us' => ..., 'si' => ...)`, with BOTH presets named. Half an
 *     array is worse than a scalar: `ecDefaultValue()` gets nothing for the missing preset, so the
 *     field opens empty in one of the two and the page greets that visitor with a blank instead of
 *     a worked example.
 *
 * HOW A DECLARATION IS FOUND, and why it is not by line. `Manning-Trap.php`'s `d50_in` field spans
 * four lines, so a line scanner reads 62 of the suite's 63 unit-bearing defaults and reports OK.
 * Declarations are therefore split on `'name' =>`, which every field has and no label contains, and
 * each chunk is read for its own first `'units' =>` and `'default' =>`. The split is asserted
 * against a raw count of `'units' =>` occurrences, so a declaration this check cannot see is a
 * FINDING and not a silence.
 *
 * WHAT THIS IS NOT. `unit_family_check.php` holds the three arrays against each other -- every
 * family in every preset, every preset unit offered by its family, every offered unit with a
 * factor, every declared family real. `unit_select_family_check.php` holds that a select names a
 * family at all. Neither of them has ever read the word `default`. This check reads nothing but,
 * and it reads the two arrays only to answer one question: do this family's two presets disagree.
 *
 * OUT OF SCOPE, deliberately and stated so nobody reads silence as coverage: CLAUDE.md's next
 * sentence -- *"A page seeding sample rows from JS must seed per preset too, keying off
 * `EngCalcs.defaultUnitSet`"* -- is about JS row seeding, where there is no declaration to read.
 * The modules that do seed per preset are NAMED in the passing output, so the gap is visible rather
 * than implied.
 *
 * Exit 0 clean, 1 on any finding. Blocking: there is no judgement anywhere in it.
 */

/**
 * Every field declaration in one page source, as [name, units, default] triples.
 *
 * Pure, so unit_default_preset_selftest.php can put fixtures through it.
 *
 * @return array<int,array{name:string,units:?string,default:?string}>
 */
function ecUnitDefaultFields(string $src): array
{
    $parts = preg_split("/'name'\s*=>\s*/", $src);
    array_shift($parts); // everything before the first field
    $fields = [];
    foreach ($parts as $chunk) {
        if (!preg_match("/^\s*'([A-Za-z0-9_]+)'/", $chunk, $nm)) { continue; }
        $units = null;
        if (preg_match("/'units'\s*=>\s*'([A-Za-z0-9_]+)'/", $chunk, $um)) { $units = $um[1]; }
        $default = null;
        if (preg_match("/'default'\s*=>\s*(.*)/s", $chunk, $dm)) {
            $default = ltrim($dm[1]);
        }
        $fields[] = ['name' => $nm[1], 'units' => $units, 'default' => $default];
    }
    return $fields;
}

/**
 * Classifies one declared default against a family whose two presets DISAGREE.
 *
 * Pure. Returns '' when it is correct, or the reason it is not.
 */
function ecUnitDefaultVerdict(?string $default): string
{
    if ($default === null) { return ''; }            // no default at all: the field opens empty.
    if (preg_match('/^(Array\s*\(|\[)/i', $default)) {
        $hasUs = (bool) preg_match("/'us'\s*=>/", $default);
        $hasSi = (bool) preg_match("/'si'\s*=>/", $default);
        if ($hasUs && $hasSi) { return ''; }
        if (!$hasUs && !$hasSi) { return 'a per-preset default naming neither preset'; }
        return 'a per-preset default naming only ' . ($hasUs ? "'us'" : "'si'")
             . ", so the field opens EMPTY under the other one";
    }
    if (preg_match("/^'([^']*)'/", $default, $m) || preg_match('/^"([^"]*)"/', $default, $m)) {
        $lit = trim($m[1]);
        if ($lit === '') { return ''; }                       // an empty box is empty in any unit.
        if (is_numeric($lit) && (float) $lit === 0.0) { return ''; }   // zero of anything is zero.
        return "the scalar default '$lit'";
    }
    if (preg_match('/^(-?[0-9.]+)/', $default, $m)) {
        if ((float) $m[1] === 0.0) { return ''; }
        return 'the scalar default ' . $m[1];
    }
    return '';   // NULL, a constant, a function call: not a literal this check can judge.
}

if (defined('UNIT_DEFAULT_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

// The presets, loaded the way unit_family_check.php loads them.
require_once $root . '/lib/config.inc.php';
$ec_units = $ec_unit_families = $ec_unit_sets = [];
include $root . '/lib/Units.lib.php';

$problems = [];
$checked = 0;
$unitIndependent = 0;
$perPreset = 0;
$noDefault = 0;

foreach (glob($root . '/*.php') as $page) {
    $src = file_get_contents($page);
    if (strpos($src, "'units'") === false) { continue; }
    $fields = ecUnitDefaultFields($src);
    $read = 0;
    foreach ($fields as $f) { if ($f['units'] !== null) { $read++; } }
    // A raw 'units' => occurrence the name-split never reached is a declaration this check cannot
    // see. NULL-valued ones are legitimately not read, so only a shortfall against the LITERAL
    // family declarations counts.
    $literalUnits = preg_match_all("/'units'\s*=>\s*'[A-Za-z0-9_]+'/", $src);
    if ($read < $literalUnits) {
        $problems[] = sprintf('%s: %d field(s) declare a unit family that this check could not '
            . 'attach to a %s declaration. Read the docblock: declarations are split on %s.',
            basename($page), $literalUnits - $read, "'name' =>", "'name' =>");
    }

    foreach ($fields as $f) {
        $fam = $f['units'];
        if ($fam === null) { continue; }
        // A family that is not declared at all is unit_family_check.php's finding, not this one.
        if (!isset($ec_unit_sets['us'][$fam]) || !isset($ec_unit_sets['si'][$fam])) { continue; }
        if ($ec_unit_sets['us'][$fam] === $ec_unit_sets['si'][$fam]) { continue; }
        $checked++;
        $verdict = ecUnitDefaultVerdict($f['default']);
        if ($verdict === '') {
            if ($f['default'] === null) {
                $noDefault++;                       // a result cell, or an input that opens empty.
            } elseif (preg_match('/^(Array\s*\(|\[)/i', $f['default'])) {
                $perPreset++;
            } else {
                $unitIndependent++;
            }
            continue;
        }
        $problems[] = sprintf("%s: field '%s' is on family '%s' (%s under us, %s under si) and has "
            . '%s.', basename($page), $f['name'], $fam,
            $ec_unit_sets['us'][$fam], $ec_unit_sets['si'][$fam], $verdict);
    }
}

if ($problems) {
    echo 'Unit-bearing defaults: ' . count($problems) . " problem(s)\n\n";
    foreach ($problems as $p) { echo "  $p\n"; }
    echo "\nA default is a number in the DISPLAYED unit, and the two presets show this field in\n";
    echo "different units, so one number cannot serve both: a scalar 6 reads as 6 in under us and\n";
    echo "6 mm under si. Declare one per preset:\n\n";
    echo "    'default' => Array('us' => '6', 'si' => '150'),\n\n";
    echo "An empty string and a zero are unit-independent and are deliberately allowed. Nothing\n";
    echo "warns a visitor about any of this: the page renders and the answer is simply wrong for\n";
    echo "whichever preset the author was not using.\n";
    exit(1);
}

$seeders = [];
foreach (glob($root . '/js/*.js') as $js) {
    if (strpos(file_get_contents($js), 'defaultUnitSet') !== false) { $seeders[] = basename($js); }
}
printf("Unit-bearing defaults OK -- %d field(s) on families whose presets differ: %d declare one\n"
    . "per preset, %d are unit-independent (empty or zero), %d declare no default.\n",
    $checked, $perPreset, $unitIndependent, $noDefault);
printf("Out of scope, and stated so silence is not read as coverage: JS row seeding. %d module(s)\n"
    . "seed per preset off EngCalcs.defaultUnitSet (%s); there is no declaration for this check to\n"
    . "read, so a module that seeded a bare number would not be seen here.\n",
    count($seeders), implode(', ', $seeders));
