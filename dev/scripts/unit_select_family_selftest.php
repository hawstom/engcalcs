<?php
/**
 * unit_select_family_selftest.php — assert that unit_select_family_check.php still sees a raw unit
 * array, and still ignores the shapes that are not one. BLOCKING.
 *
 * WHY THIS EXISTS. The check finds nothing today and must keep finding nothing, which is the
 * condition under which a broken check and a working one print the same word. It has two specific
 * ways to go blind, and each has a fixture below:
 *
 *   - the assignment-as-documentation form `echoUnitSelect($name = 'xu', $units = 'velocity', $i)`,
 *     which every calculator page uses. A classifier that reads the first token of argument two
 *     sees a VARIABLE there and would either report all 32 of them or, worse, be "fixed" by
 *     treating every variable as acceptable -- which is the raw-array path waved through;
 *   - the DECLARATION door, `'units' => array(...)`. It is the one that actually ships, because a
 *     page author writes a field declaration and never types echoUnitSelect() at all.
 *
 *   php dev/scripts/unit_select_family_selftest.php
 */

define('UNIT_SELECT_LIB_ONLY', true);
require __DIR__ . '/unit_select_family_check.php';

/** Counts findings of the blocking kinds only; 'opaque' is informational and never a failure. */
function ecSelftestBlocking(string $src): array
{
    return array_values(array_filter(ecRawUnitArrayFindings($src),
        fn($f) => $f[0] === 'call' || $f[0] === 'declaration'));
}

$cases = [
    // ---- what it MUST find --------------------------------------------------------------------
    ['a raw array passed straight to echoUnitSelect()',
        "<?php\nechoUnitSelect('vu', array('ft','m'), '');\n", 1],
    ['the short array syntax, which is the same defect typed differently',
        "<?php\nechoUnitSelect('vu', ['ft','m'], '');\n", 1],
    ['a raw array behind the assignment-as-documentation form the pages use',
        "<?php\nechoUnitSelect(\$name = 'vu', \$units = array('ft','m'), \$ind);\n", 1],
    // THE DOOR THAT ACTUALLY SHIPS: no call site mentions the function at all.
    ['a field DECLARATION carrying an inline array',
        "<?php\n\$arrayInputs = array(Array('name'=>'d','units'=>array('in','mm')));\n", 1],
    ['a declaration in short syntax',
        "<?php\n\$arrayResults = [['name'=>'v','units'=>['fps','mps']]];\n", 1],
    ['both doors in one file are two findings',
        "<?php\n\$a = array('units' => array('ft'));\nechoUnitSelect('vu', ['ft'], '');\n", 2],

    // ---- what it must NOT report ---------------------------------------------------------------
    // THE SHAPE THIS REPOSITORY ACTUALLY CONTAINS, 32 times over.
    ['the assignment-as-documentation form with a family name',
        "<?php\nechoUnitSelect(\$name = 'vu', \$units = 'velocity', \$indent_string);\n", 0],
    ['a plain call naming a family',
        "<?php\nechoUnitSelect('lpn_u_flow', 'flow_epanet', '');\n", 0],
    ['a declaration naming a family',
        "<?php\n\$in = Array('name'=>'d','units'=>'distance_small');\n", 0],
    ['the function DECLARATION, whose parameter list is not a call site',
        "<?php\nfunction echoUnitSelect(\$name, \$units, \$indent_string) { }\n", 0],
    ['a method of somebody else\'s object that happens to share the name',
        "<?php\n\$w->echoUnitSelect('vu', ['ft'], '');\n", 0],
    ['the words in a comment, e.g. this rule being explained',
        "<?php\n// never echoUnitSelect('vu', array('ft','m'), '')\n\$a = 1;\n", 0],
    ['the words in a string, e.g. an error message quoting the bad form',
        "<?php\n\$msg = \"echoUnitSelect('vu', array('ft'), '') is forbidden\";\n", 0],
    // A key that merely READS 'units' is not a declaration of one.
    ['reading a units value rather than declaring one',
        "<?php\n\$u = \$input['units'];\n\$doc['units'] = \$sel;\n", 0],
    ['an opaque family argument is a NOTE, never a failure',
        "<?php\nechoUnitSelect(\$n . 'u', \$input['units'], '');\n", 0],
];

$fails = 0;
foreach ($cases as [$name, $src, $want]) {
    $got = ecSelftestBlocking($src);
    if (count($got) !== $want) {
        $fails++;
        echo "  FAIL $name\n";
        echo "        wanted $want finding(s), got " . count($got) . ': '
            . (count($got) ? implode(', ', array_map(fn($g) => $g[0] . '@' . $g[1], $got)) : '(none)')
            . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

// The opaque tier is informational, but it must still FIRE -- a check whose blind spot silently
// stops being reported has become a check with a hidden blind spot.
$opaque = array_filter(ecRawUnitArrayFindings("<?php\nechoUnitSelect(\$n . 'u', \$in['units'], '');\n"),
    fn($f) => $f[0] === 'opaque');
if (count($opaque) !== 1) {
    $fails++;
    echo "  FAIL an unfollowable family argument is still counted as opaque\n";
} else {
    echo "  ok   an unfollowable family argument is still counted as opaque\n";
}

if ($fails) {
    echo "\n$fails fixture(s) failed. unit_select_family_check.php's reach has moved.\n";
    echo "A false positive here fails every commit on 32 correct call sites; a false negative ships\n";
    echo "a select the US/SI buttons cannot see, on a page where every other field converts.\n";
    exit(1);
}
echo "\nUnit-select selftest OK -- " . (count($cases) + 1) . " fixtures, both directions.\n";
exit(0);
