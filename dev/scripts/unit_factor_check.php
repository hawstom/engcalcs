<?php
/**
 * unit_factor_check.php -- every conversion factor in lib/Units.lib.php, re-derived.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. $ec_units held factors at 3-5 significant figures, typed independently, and
 * they disagreed with each other. The suite contained FOUR DIFFERENT FEET at once:
 *
 *     ft    = 3.2808    -> 3.280800 ft/m
 *     ft3ps = 35.313    -> 3.280788 ft/m
 *     ft3   = 35.3147   -> 3.280841 ft/m
 *     ft2   = 10.764    -> 3.280854 ft/m
 *
 * ft3 and ft3ps are the SAME conversion written two ways, 47 ppm apart. A round trip within one
 * unit hides all of this -- 1000 gpm stored and redisplayed is still 1000 gpm -- so nothing in the
 * suite could see it. What it actually breaks is cross-unit agreement (a length in ft, an area in
 * ft^2 and a velocity in ft/s no longer tie out in the 5th digit), acft at 354 ppm (visible in the
 * 4th DISPLAYED digit), and our agreement with EPANET, which uses exact factors.
 *
 * SO THIS CHECK DOES TWO DIFFERENT THINGS, and the second is the one that matters:
 *
 *   1. VALUE. Each factor is re-derived here from the exact international definitions and compared
 *      against what lib/Units.lib.php ships.
 *   2. COHERENCE. Each factor is inverted to back out the base constant it IMPLIES -- the foot, the
 *      inch, the gallon, standard gravity -- and every factor in a group must imply the same
 *      constant. This is what catches the four-feet class of defect directly, rather than only as a
 *      side effect of four separate value comparisons.
 *
 * Plus two guards that keep the check from quietly shrinking:
 *   3. COVERAGE. Every key in $ec_units must be classified here (derived, exact, or an exception).
 *      A new unit cannot be added without being checked.
 *   4. GRAVITY. The pressure factors must imply the same g as EngCalcs.G in js/Calculators.lib.js.
 *      Display factors and physics on two different gravities is worse than either constant alone.
 *
 * Deliberate exceptions are NAMED with a reason below. Never widen a tolerance to swallow one.
 *
 * Usage:  php dev/scripts/unit_factor_check.php [--verbose]
 * Exit:   0 = all factors agree, 1 = at least one disagrees
 */

$verbose = in_array('--verbose', $argv, true);

// ---------------------------------------------------------------------------------------------
// The exact definitions. Everything below is derived from these and from nothing else.
// ---------------------------------------------------------------------------------------------
$FT   = 0.3048;                 // m per international foot        (exact)
$IN   = 0.0254;                 // m per inch                      (exact)
$GAL  = 0.003785411784;         // m^3 per US liquid gallon        (exact, 3.785411784 L)
$LBF  = 4.4482216152605;        // N per pound-force               (exact)
$ACRE = 43560 * $FT * $FT;      // m^2 per acre                    (exact, 43560 ft^2)
$HP   = 745.6998715822702;      // W per mechanical horsepower     (550 ft.lbf/s)

// Standard gravity, read from the ONE place the suite defines it rather than retyped here.
$jsPath = __DIR__ . '/../../js/Calculators.lib.js';
$js = @file_get_contents($jsPath);
if ($js === false || !preg_match('/EngCalcs\.G\s*=\s*([0-9.]+)\s*;/', $js, $m)) {
    fwrite(STDERR, "FAIL: could not read EngCalcs.G from $jsPath\n");
    exit(1);
}
$G = (float)$m[1];

$PA_PER_MH2O = 1000.0 * $G;                 // 1 m of water column, in Pa
$PSF_PA      = $LBF / ($FT * $FT);          // 1 lbf/ft^2 in Pa
$PSI_PA      = $LBF / ($IN * $IN);          // 1 lbf/in^2 in Pa

// ---------------------------------------------------------------------------------------------
// What each factor must be. Value = number of that unit per one SI unit.
// ---------------------------------------------------------------------------------------------
$expected = array(
    // length
    'm' => 1.0, 'mm' => 1000.0,
    'ft' => 1 / $FT, 'in' => 1 / $IN,
    // velocity
    'mps' => 1.0, 'ftps' => 1 / $FT,
    // volumetric flow
    'm3ps' => 1.0, 'lps' => 1000.0,
    'ft3ps' => 1 / pow($FT, 3),
    'gpm' => 60 / $GAL,
    'mgd' => 86400 / (1e6 * $GAL),
    'mld' => 86.4,                              // 86400 s/day / 1000 m^3 per ML -- exact
    'lph' => 3.6e6, 'gph' => 3600 / $GAL,
    // area
    'm2' => 1.0, 'mm2' => 1e6,
    'ft2' => 1 / ($FT * $FT), 'in2' => 1 / ($IN * $IN),
    // volume
    'm3' => 1.0, 'ft3' => 1 / pow($FT, 3), 'acft' => 1 / ($ACRE * $FT),
    // head and pressure -- all six from 1 m H2O = 1000*G Pa
    'mh2o' => 1.0, 'mmh2o' => 1000.0,
    'fth2o' => 1 / $FT, 'inh2o' => 1 / $IN,
    'pa' => $PA_PER_MH2O,
    'kpa' => $PA_PER_MH2O / 1000,
    'npm2' => $PA_PER_MH2O,
    'bar' => $PA_PER_MH2O / 1e5,
    'psf' => $PA_PER_MH2O / $PSF_PA,
    'psi' => $PA_PER_MH2O / $PSI_PA,
    // dimensionless ratios
    'grade' => 1.0, 'gradePercent' => 100.0,
    'depthFrac' => 1.0, 'depthPercent' => 100.0,
    // power and energy
    'kw' => 1e-3, 'mw' => 1e-6, 'hp' => 1 / $HP,
    'kwh_yr' => 1.0, 'mwh_yr' => 1e-3,
    // rates
    'mmph' => 3.6e6, 'inph' => 3600 / $IN,
    // unit discharge
    'm2ps' => 1.0, 'ft2ps' => 1 / ($FT * $FT),
);

// ---------------------------------------------------------------------------------------------
// Deliberate exceptions: a shipped value that is NOT the exact derivation, on purpose.
// Each needs a reason a reader can weigh. This list is the only sanctioned way past the check.
// ---------------------------------------------------------------------------------------------
$exceptions = array(
    'kgfcm2' => array(
        'shipped' => 0.1,
        'exact'   => $PA_PER_MH2O / 98066.5,   // 1 kgf/cm^2 = 98066.5 Pa exactly
        'reason'  => 'The unit exists only as the Asian field convention "1 kgf/cm2 = 10 m of '
                   . 'water"; the round number IS the unit as it is used, and a user reading a '
                   . '10 m head expects 1.00. Exactly it is 10.00068 m H2O against our g. Task 134.',
        'max_ppm' => 100,                       // measured 66 ppm; a change beyond this is a bug
    ),
);

// ---------------------------------------------------------------------------------------------
// Coherence groups: back out the base constant each factor implies. All members must agree.
// This is the four-feet check, and it is independent of the value comparison above.
// ---------------------------------------------------------------------------------------------
$groups = array(
    'the foot (m per ft)' => array(
        'ft'    => function ($v) { return 1 / $v; },
        'ftps'  => function ($v) { return 1 / $v; },
        'fth2o' => function ($v) { return 1 / $v; },
        'ft2'   => function ($v) { return sqrt(1 / $v); },
        'ft2ps' => function ($v) { return sqrt(1 / $v); },
        'ft3'   => function ($v) { return pow(1 / $v, 1 / 3); },
        'ft3ps' => function ($v) { return pow(1 / $v, 1 / 3); },
        'acft'  => function ($v) { return pow(1 / (43560 * $v), 1 / 3); },
    ),
    'the inch (m per in)' => array(
        'in'   => function ($v) { return 1 / $v; },
        'inh2o'=> function ($v) { return 1 / $v; },
        'in2'  => function ($v) { return sqrt(1 / $v); },
        'inph' => function ($v) { return 3600 / $v; },
    ),
    'the US gallon (m3 per gal)' => array(
        'gpm' => function ($v) { return 60 / $v; },
        'gph' => function ($v) { return 3600 / $v; },
        'mgd' => function ($v) { return 86400 / (1e6 * $v); },
    ),
    'standard gravity (m/s2)' => array(
        'pa'   => function ($v) { return $v / 1000; },
        'npm2' => function ($v) { return $v / 1000; },
        'kpa'  => function ($v) { return $v; },
        'bar'  => function ($v) { return $v * 1e5 / 1000; },
        'psf'  => function ($v) use ($PSF_PA) { return $v * $PSF_PA / 1000; },
        'psi'  => function ($v) use ($PSI_PA) { return $v * $PSI_PA / 1000; },
    ),
);

// A group whose implied constant must also match a named authority elsewhere in the suite.
$groupAuthority = array('standard gravity (m/s2)' => array('EngCalcs.G (js/Calculators.lib.js)', $G));

// ---------------------------------------------------------------------------------------------

$TOL_PPM = 0.001;   // 1 part per billion. The literals are written at full double precision, so
                    // anything approaching this is a retyped or rounded value, not float noise.

$clanguage = 'en';
require __DIR__ . '/../../lib/Units.lib.php';

$fails = array();
$notes = array();

function ppm($got, $want) {
    if ($want == 0.0) { return $got == 0.0 ? 0.0 : INF; }
    return abs($got - $want) / abs($want) * 1e6;
}

// --- 1. Value ---------------------------------------------------------------------------------
foreach ($expected as $unit => $want) {
    if (!isset($ec_units[$unit])) {
        $fails[] = "missing factor: \$ec_units['$unit'] is not defined";
        continue;
    }
    $err = ppm((float)$ec_units[$unit], $want);
    if ($err > $TOL_PPM) {
        $fails[] = sprintf(
            "%-8s ships %.17g, exact is %.17g  (off by %.1f ppm)\n"
            . "          Write the full-precision value; do not round. See the derivations in lib/Units.lib.php.",
            $unit, (float)$ec_units[$unit], $want, $err
        );
    } elseif ($verbose) {
        $notes[] = sprintf("  ok    %-8s %.17g", $unit, (float)$ec_units[$unit]);
    }
}

// --- 2. Exceptions ----------------------------------------------------------------------------
foreach ($exceptions as $unit => $e) {
    if (!isset($ec_units[$unit])) {
        $fails[] = "missing factor: \$ec_units['$unit'] is not defined";
        continue;
    }
    $v = (float)$ec_units[$unit];
    if (ppm($v, $e['shipped']) > $TOL_PPM) {
        $fails[] = sprintf(
            "%-8s is a NAMED EXCEPTION pinned at %.17g but ships %.17g.\n"
            . "          Either restore it, or change this check's exception entry deliberately.\n"
            . "          Reason on file: %s",
            $unit, $e['shipped'], $v, $e['reason']
        );
        continue;
    }
    $err = ppm($e['shipped'], $e['exact']);
    if ($err > $e['max_ppm']) {
        $fails[] = sprintf(
            "%-8s exception is now %.1f ppm from exact (%.17g), past its stated %.1f ppm ceiling.",
            $unit, $err, $e['exact'], $e['max_ppm']
        );
    } elseif ($verbose) {
        $notes[] = sprintf("  ok    %-8s %.17g  (deliberate exception, %.0f ppm from exact)", $unit, $v, $err);
    }
}

// --- 3. Coverage ------------------------------------------------------------------------------
$classified = array_merge(array_keys($expected), array_keys($exceptions));
foreach (array_keys($ec_units) as $unit) {
    if (!in_array($unit, $classified, true)) {
        $fails[] = "unchecked factor: \$ec_units['$unit'] is not classified in unit_factor_check.php.\n"
                 . "          Add its derivation to \$expected, or name it in \$exceptions with a reason.";
    }
}

// --- 4. Coherence -----------------------------------------------------------------------------
foreach ($groups as $label => $members) {
    $implied = array();
    foreach ($members as $unit => $backOut) {
        if (!isset($ec_units[$unit])) { continue; }
        $implied[$unit] = $backOut((float)$ec_units[$unit]);
    }
    if (count($implied) < 2) { continue; }
    $ref = reset($implied);
    $worst = 0.0;
    foreach ($implied as $v) { $worst = max($worst, ppm($v, $ref)); }
    if ($worst > $TOL_PPM) {
        $lines = array();
        foreach ($implied as $unit => $v) { $lines[] = sprintf("            %-8s implies %.9f", $unit, $v); }
        $fails[] = sprintf(
            "INCOHERENT: the factors below imply %d different values of %s (spread %.1f ppm).\n"
            . "          They are the same physical constant written more than once. Derive them\n"
            . "          all from the one exact definition instead of typing each independently.\n%s",
            count(array_unique(array_map(function ($x) { return sprintf('%.12f', $x); }, $implied))),
            $label, $worst, implode("\n", $lines)
        );
    } elseif ($verbose) {
        $notes[] = sprintf("  ok    %-28s %.12f  (%d factors agree)", $label, $ref, count($implied));
    }

    if (isset($groupAuthority[$label])) {
        list($who, $want) = $groupAuthority[$label];
        $err = ppm($ref, $want);
        if ($err > $TOL_PPM) {
            $fails[] = sprintf(
                "%s implies %.9f, but %s is %.9f (%.1f ppm apart).\n"
                . "          Display factors and physics must use ONE gravity. Fix the factors here,\n"
                . "          not the constant there -- EngCalcs.G is the suite's single definition.",
                $label, $ref, $who, $want, $err
            );
        } elseif ($verbose) {
            $notes[] = sprintf("  ok    %-28s matches %s", $label, $who);
        }
    }
}

// --- 5. Identity ------------------------------------------------------------------------------
// A unit's IDENTITY IS ITS NAME (ROADMAP Task 390). A <select> option's value is 'ft', and the
// factor is a lookup through EngCalcs.unitFactors. This section is here rather than in a script of
// its own because it is the same subject one level up: sections 1-4 keep the factors right, and
// this one keeps a factor from being used as a name in the first place.
//
// It exists because the prose rule had already been written down and was violated in 22 places
// anyway, and because the failure is SILENT -- code that divides by a select's value still runs,
// still shows numbers, and is only wrong in the digits nobody re-derives by hand.
$identityBans = array(
    array(
        'pattern' => '/\bdata-unit\b|\bdataset\.unit\b/',
        'why'     => "a unit's identity is the <option>'s VALUE now, not a data-unit attribute",
        'fix'     => "read option.value (or select.value); echoUnitSelect() emits no data-unit",
    ),
    array(
        // A form field whose name ends in 'u' is a unit select, by the suite's own naming, and
        // reaching one THROUGH THE FORM is always a factor read -- every one of the 22 sites this
        // was written for had this shape. A select read some other way (js/Cookies.lib.js reads
        // one to STORE it, which is now correct by construction) is out of scope and left alone.
        'pattern' => '/objForm(?:\[\s*[\'"][^\'"]*u[\'"]\s*\]|\.[A-Za-z0-9_]*u\b)\.value\b/',
        'why'     => "this reads a unit select's value as though it were a conversion factor",
        'fix'     => "EngCalcs.unitFactor(objForm['xu']) -- one lookup, one table, one definition",
    ),
    array(
        'pattern' => '/<option value="\'\s*\.\s*\$ec_units\[/',
        'why'     => "an <option>'s value must be the unit's name, never its factor",
        'fix'     => "emit \$unit; the factor reaches JS as EngCalcs.unitFactors",
    ),
);
$identityFiles = array_merge(
    glob(__DIR__ . '/../../js/*.js'),
    glob(__DIR__ . '/../../lib/*.php'),
    glob(__DIR__ . '/../../*.php'),
    glob(__DIR__ . '/../../dev/calc-spike/*.js'),
    glob(__DIR__ . '/../../dev/lpn-spike/*.js')
);
$identityScanned = 0;
foreach ($identityFiles as $path) {
    $identityScanned++;
    $lines = file($path, FILE_IGNORE_NEW_LINES);
    $rel = str_replace(realpath(__DIR__ . '/../../') . '/', '', realpath($path));
    foreach ($lines as $i => $line) {
        // A comment may legitimately discuss the old form -- this file and the migration record do.
        $trimmed = ltrim($line);
        if (substr($trimmed, 0, 2) === '//' || substr($trimmed, 0, 1) === '*' || substr($trimmed, 0, 2) === '/*') { continue; }
        foreach ($identityBans as $ban) {
            if (preg_match($ban['pattern'], $line)) {
                $fails[] = sprintf(
                    "%s:%d -- %s.\n          Fix: %s.\n          %s",
                    $rel, $i + 1, $ban['why'], $ban['fix'], trim($line)
                );
            }
        }
    }
}
if ($verbose) {
    $notes[] = sprintf("  ok    %-28s %d files scanned", 'unit identity is a name', $identityScanned);
}

// ---------------------------------------------------------------------------------------------
if ($notes) { echo implode("\n", $notes) . "\n"; }
if ($fails) {
    echo "unit factor check FAILED (" . count($fails) . "):\n";
    foreach ($fails as $f) { echo "  FAIL  $f\n"; }
    exit(1);
}
printf("unit factors ok: %d checked, %d deliberate exception(s), %d coherence group(s).\n",
    count($expected), count($exceptions), count($groups));
exit(0);
