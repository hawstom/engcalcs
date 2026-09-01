<?php
/**
 * verdict_string_selftest.php — assert verdict_string_check.php still knows which strings are
 * verdicts, and still lets the ones that only look wrong through. BLOCKING.
 *
 * WHY THIS EXISTS. The check finds nothing on today's tree, so a broken one and a working one both
 * print OK. Three parts can go blind independently:
 *
 *   - **the seam reader.** If `writeCheckHTML(` or the labels object stops being recognised, the
 *     verdict key list empties and the check passes over 27 language files by having nothing to
 *     say about any of them. The count of keys is therefore itself a fixture;
 *   - **the one-hop resolution** from a pageConfig key to the `$ec_lang` key behind it. Half the
 *     verdicts are declared under a short page-local name (`Ec_good` is `cs_Ec_good`), so a broken
 *     hop silently halves the coverage;
 *   - **the value rules.** Their whole value is that they do NOT fire on the strings this repo
 *     actually ships, several of which lead with a word and a dash and would be caught by any
 *     pattern widened past a colon. Those are fixtures too, verbatim.
 *
 *   php dev/scripts/verdict_string_selftest.php
 */

define('EC_VERDICT_LIB_ONLY', true);
require __DIR__ . '/verdict_string_check.php';

$fails = 0;
$ok = 0;

function ecVerdictAssert(string $name, $got, $want): void
{
    global $fails, $ok;
    if ($got !== $want) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted ' . var_export($want, true) . ', got ' . var_export($got, true) . "\n";
    } else {
        $ok++;
        echo "  ok   $name\n";
    }
}

// ---- 1. the seam reader --------------------------------------------------------------------------
$js = <<<'JS'
regimeEl.innerHTML = EngCalcs.writeCheckHTML(true, EngCalcs.pageConfig.regime_valid);
pondEl.innerHTML = EngCalcs.writeCheckHTML(false, cfg.rc_pond_warn, cfg.rc_pond_warn_tip);
hlEl.innerHTML = EngCalcs.writeCheckHTML(true, hlPct.toFixed(1) + '%', pc.hl_ok_tip);
this.writeVelocityCheck('vel_check', status, {
    ok: EngCalcs.pageConfig.mhp_vel_ok_short,
    high: EngCalcs.pageConfig.mhp_vel_high_short,
    low: EngCalcs.pageConfig.mhp_vel_low_short,
    highTip: EngCalcs.pageConfig.mhp_vel_high,
    lowTip: EngCalcs.pageConfig.mhp_vel_low
});
var pressureLabels = {
    lowShort: cfg.ip_pressure_warn_short, lowTip: cfg.ip_pressure_warn,
    highShort: cfg.ip_pressure_high_short, highTip: cfg.ip_pressure_high
};
// EngCalcs.writeCheckHTML(true, EngCalcs.pageConfig.commented_out_key) is prose, not a read
JS;
$read = ecVerdictShortTextReads($js);
$keys = array_keys($read['keys']);
sort($keys);
ecVerdictAssert('every verdict seam is read, and the commented one is not', $keys, [
    'ip_pressure_high_short', 'ip_pressure_warn_short', 'mhp_vel_high_short',
    'mhp_vel_low_short', 'mhp_vel_ok_short', 'rc_pond_warn', 'regime_valid',
]);
ecVerdictAssert('a short text that is not a pageConfig read is reported, not dropped',
    count($read['opaque']), 1);
ecVerdictAssert('and the tip argument is not mistaken for the short text',
    isset($read['keys']['rc_pond_warn_tip']), false);
ecVerdictAssert('nor is a labels TIP field, which is prose and may be a sentence',
    isset($read['keys']['mhp_vel_high']), false);

// ---- 2. the one hop -------------------------------------------------------------------------------
$page = <<<'PHP'
<script>
EngCalcs.pageConfig = {
	regime_valid:        <?=json_encode($ec_lang['or_regime_valid'])?>,
	Ec_good:       <?=json_encode($ec_lang['cs_Ec_good'])?>,
	precision: 4
};
</script>
PHP;
$map = ecPageConfigLangKeys($page);
ecVerdictAssert('a page-local name resolves to the key behind it',
    array_keys($map['Ec_good'] ?? []), ['cs_Ec_good']);
ecVerdictAssert('a pageConfig entry that is not a language string maps to nothing',
    isset($map['precision']), false);

// ---- 3. the value rules ---------------------------------------------------------------------------
/** [name, value, isVerdictKey, isEnglish, expected codes] */
$cases = [
    // ---- what it MUST find ----------------------------------------------------------------------
    ['a verdict string carrying the glyph the renderer already prepends',
        '⚠ Low', true, true, ['glyph-in-verdict-string']],
    ['the same defect written by a translator, in Spanish',
        '⚠ Baja', true, false, ['glyph-in-verdict-string']],
    ['an English marker word before a colon',
        'Warning: low pressure', true, true, ['marker-shape', 'marker-word']],
    ['an English marker word before a spaced dash',
        'Caution — low pressure', true, true, ['marker-word']],
    // THE LEG THAT REACHES THE 26 LANGUAGES NOBODY HERE READS: shape, not vocabulary.
    ['a marker word this side cannot read, before a colon',
        'Advertencia: presión baja', true, false, ['marker-shape']],
    ['a glyph at the END of a hand-built verdict, which RTL makes easy to write',
        'Understood ✓', false, false, ['glyph-not-leading']],
    ['a glyph mid-string',
        'This network ⚠ has nothing called {id}', false, false, ['glyph-not-leading']],

    // ---- what it must NOT report, each one a string this repo ships -----------------------------
    ['a bare verdict word IS the verdict, not a marker',
        'OK', true, true, []],
    ['the em-dash form, which any pattern widened past a colon would break',
        'Good — E<sub>c</sub> ≥ 80%', true, true, []],
    ['and its two siblings',
        'Poor — E<sub>c</sub> < 60%', true, true, []],
    ['a verdict that opens with an inequality',
        'Q<sub>out</sub> > Q<sub>in</sub> — check measurements', true, true, []],
    ['a verdict naming a symbol',
        'd50 in P&I range', true, true, []],
    ['a long verdict sentence with no marker and no glyph',
        'Last emitter elevation (last row) was left blank and defaulted to flat', true, true, []],
    ['a hand-built verdict that leads with its glyph, in English',
        '✓ Understood', false, true, []],
    ['the same in Hebrew, where leading means rightmost on screen',
        '⚠ לא מובן', false, false, []],
    ['an ordinary label that is not a verdict at all',
        'Pipe diameter', false, true, []],
];
foreach ($cases as [$name, $value, $isVerdict, $isEnglish, $want]) {
    $got = array_map(fn($f) => $f[0], ecVerdictValueFindings($value, $isVerdict, $isEnglish));
    sort($got);
    sort($want);
    ecVerdictAssert($name, $got, $want);
}

// ================================================================================================
// LEG 4 -- A HAND-BUILT VERDICT MUST STILL HAVE ITS GLYPH
// ================================================================================================
// **FIXTURE 1 IS THE MUTATION THAT ESCAPED THE FIRST DRAFT AND IS THE ONLY THING HOLDING THIS LEG
// OPEN.** Legs 1-3 all reason about a glyph that is PRESENT: leg 1 says a renderer-built verdict
// must not carry one, leg 3 says a glyph anywhere must lead. Nothing asked whether it was there at
// all -- and for a verdict assembled by hand rather than through writeCheckHTML(), the glyph is
// part of the translated value and can simply be deleted. Replacing '✓ Understood' with
// 'OK: Understood' removed the glyph AND added a marker word, and the check reported OK.
//
// The last two fixtures are the reason the leg is scoped to a DECLARED list: an ordinary label with
// no glyph is not a defect, and there is no way to tell one from a stripped verdict except by
// having been told which keys are verdicts.
$handCases = [
    ['THE ESCAPED MUTATION: glyph deleted and a marker word put in its place',
        'OK: Understood', true, ['glyph-missing', 'marker-word']],
    ['a glyph deleted with no marker word -- still a defect, the glyph is the convention',
        'Understood', true, ['glyph-missing']],
    ['the same in a language this side cannot read: the leg needs no words',
        'לא מובן', false, ['glyph-missing']],
    ['the shipped English value passes',
        '✓ Understood', true, []],
    ['the shipped warning value passes',
        '⚠ Not understood', true, []],
    ['a placeholder after the glyph is still glyph-led',
        '⚠ This network has nothing called {id}', true, []],
    ['a glyph pushed off the front is leg 3\'s finding, not leg 4\'s',
        'Understood ✓', true, ['glyph-not-leading']],
];
foreach ($handCases as [$name, $value, $isEnglish, $want]) {
    $got = array_map(fn($f) => $f[0], ecVerdictValueFindings($value, false, $isEnglish, true));
    sort($got);
    sort($want);
    ecVerdictAssert($name, $got, $want);
}

// AND THE OTHER DIRECTION, which is what keeps leg 4 from becoming "every string needs a glyph":
// the identical values, NOT declared hand-built, must produce nothing.
foreach ([['OK: Understood', true], ['Understood', true], ['Pipe diameter', true]] as [$v, $en]) {
    $got = array_map(fn($f) => $f[0], ecVerdictValueFindings($v, false, $en, false));
    ecVerdictAssert("undeclared, so leg 4 stays silent: " . $v, $got, []);
}

if ($fails) {
    echo "\nverdict_string_selftest: $fails failing case(s) of " . ($fails + $ok) . ".\n";
    echo "verdict_string_check.php can no longer see the defect named above, and it prints\n";
    echo "'Verdict strings OK' either way. Fix the check, not this file.\n";
    exit(1);
}
echo "\nverdict string selftest OK -- $ok case(s), both directions.\n";
