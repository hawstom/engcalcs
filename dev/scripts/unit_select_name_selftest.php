<?php
/**
 * unit_select_name_selftest.php -- assert unit_select_name_check.php still sees an unnamed
 * <select>, in every shape this tree actually writes, and still lets the named ones through.
 * BLOCKING.
 *
 * WHY THIS EXISTS. The check reads real markup with regular expressions rather than a DOM parser
 * (this repo's own convention -- see blank_target_check.php), which means it goes blind on
 * whichever shape its pattern did not anticipate. The fixtures below are the shapes the fix
 * actually produced (aria-label from echoUnitSelect()'s new 4th argument, <label for> on the
 * hand-written selects that already had one) plus the traps a naive version of this check would
 * fall for: an aria-label that is present but EMPTY, an aria-labelledby pointing at nothing, two
 * <label>...</label> blocks in one document (pairing must not cross), and a <select> that carries
 * no name attribute at all so the finding still has something to print.
 *
 *   php dev/scripts/unit_select_name_selftest.php
 */

define('UNIT_SELECT_NAME_LIB_ONLY', true);
require __DIR__ . '/unit_select_name_check.php';

$cases = [
    // ---- what it MUST find -----------------------------------------------------------------
    ['THE DEFECT: a bare unit select, exactly what echoUnitSelect() used to emit',
        '<select name="du" data-family="distance_small" onchange="x()"><option value="ft">ft</option></select>',
        true],
    ['an EMPTY aria-label -- present but says nothing, must still be a finding',
        '<select name="du" aria-label=""><option value="ft">ft</option></select>',
        true],
    ['an aria-labelledby pointing at an id that does not exist on the page',
        '<select name="du" aria-labelledby="ghost"><option value="ft">ft</option></select>',
        true],
    ['an aria-labelledby resolving to an element with no text',
        '<span id="lbl"></span><select name="du" aria-labelledby="lbl"><option value="ft">ft</option></select>',
        true],
    ['a <label for> pointing at an id the select does not have',
        '<label for="other">Diameter</label><select name="du" id="du2"><option value="ft">ft</option></select>',
        true],
    ['a select with no id AND no name -- the finding must still print something',
        '<select><option value="ft">ft</option></select>',
        true],

    // ---- what it must NOT report -------------------------------------------------------------
    ['THE FIX: aria-label carrying the field\'s own plain text, as echoUnitSelect() now emits',
        '<select name="du" id="du" aria-label="Pipe diameter, d0" data-family="distance_small"><option value="ft">ft</option></select>',
        false],
    ['aria-labelledby resolving to a real, non-empty element',
        '<span id="lbl">Pipe diameter</span><select name="du" aria-labelledby="lbl"><option value="ft">ft</option></select>',
        false],
    ['<label for> matching the select\'s own id, as the hand-written method selects use',
        '<label for="method"><strong>Method</strong></label><select name="method" id="method"><option value="hw">HW</option></select>',
        false],
    ['the IMPLICIT form -- select nested inside a <label>, as Compare-Languages.php writes it',
        '<label>lang1 <select name="lang1"><option value="en">en</option></select></label>',
        false],
    ['TWO labels in one document -- pairing must not cross to the wrong select',
        '<label for="a">Length</label><select id="a" name="a"><option>ft</option></select>'
        . '<label for="b">Diameter</label><select id="b" name="b"><option>in</option></select>',
        false],
];

$fails = 0;
foreach ($cases as [$name, $html, $wantFinding]) {
    $got = ecUnitSelectNameFindings($html, 'fixture.php');
    $hit = $got !== [];
    if ($hit !== $wantFinding) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted ' . ($wantFinding ? 'a finding' : 'no finding') . ', got '
            . ($hit ? count($got) . ': ' . $got[0] : 'none') . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

// The two-label case above also has to pair EACH select with its OWN label and not just find
// "some" label text on the page -- assert both selects individually resolve, not just that the
// union of the document has no unmatched select.
$twoLabelHtml = '<label for="a">Length</label><select id="a" name="a"><option>ft</option></select>'
              . '<label for="b">Diameter</label><select id="b" name="b"><option>in</option></select>';
if (ecUnitSelectNameFindings($twoLabelHtml, 'fixture.php') !== []) {
    $fails++;
    echo "  FAIL two independently-labelled selects should both resolve\n";
} else {
    echo "  ok   two independently-labelled selects both resolve\n";
}

echo $fails ? "\n$fails FAILURE(S)\n" : "\nAll cases pass.\n";
exit($fails ? 1 : 0);
