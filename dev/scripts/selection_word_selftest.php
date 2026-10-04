<?php
/**
 * Fixtures for `selection_word_check.php`, both directions. The negative list is the load-bearing
 * half: "Select" as a tool name and "selected" as a list's state are ordinary and must not fire.
 */
define('EC_SELECTION_WORD_LIB_ONLY', 1);
require_once __DIR__ . '/selection_word_check.php';

$fails = 0; $ok = 0;
function ecSelAssert(string $name, string $value, int $want)
{
    global $fails, $ok;
    $got = count(ecSelectionHits($value));
    if ($got === $want) { $ok++; echo "  ok   $name\n"; return; }
    $fails++; echo "  FAIL $name (got $got, want $want)\n";
}

echo "---- caught ----\n";
ecSelAssert('select the All option', 'Select junctions or select the All option.', 1);
ecSelAssert('select an option', 'Select an option from the list.', 1);
ecSelAssert('select from the pull-down', 'Select a value from the pull-down.', 1);
ecSelAssert('chosen on the map', 'Put everything now chosen on the map onto the graph.', 1);
ecSelAssert('choose assets', 'Choose assets and press Add.', 1);
ecSelAssert('picks out', 'Find picks out every asset that matches.', 1);
ecSelAssert('highlight the assets', 'Highlight the assets you want.', 1);

ecSelAssert('select the coordinate system', 'Select the coordinate system of your network.', 1);
ecSelAssert('press Select', 'Choose one and press Select.', 1);
ecSelAssert('chosen set', 'Nothing in the chosen set went outside.', 1);

echo "---- not caught ----\n";
ecSelAssert('tool name', 'Mode: Select. Click an asset to see or change it.', 0);
ecSelAssert('list state', 'No curve selected', 0);
ecSelAssert('select on the map', 'Select assets on the map, or choose All.', 0);
ecSelAssert('choose a file', 'Choose a file to save to.', 0);
ecSelAssert('choose an option', 'Choose a roughness option (Isbash recommended).', 0);
ecSelAssert('label highlights (a flash)', 'The label highlights briefly to alert you that it was moved.', 0);
ecSelAssert('pick a point', 'Scale around a point you pick', 0);
ecSelAssert('selection set', 'adding if not in the selection set', 0);

echo "\n$ok ok, $fails failed\n";
exit($fails ? 1 : 0);
