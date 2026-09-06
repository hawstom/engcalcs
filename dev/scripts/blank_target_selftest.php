<?php
/**
 * blank_target_selftest.php -- assert blank_target_check.php still sees an unguarded new tab, in
 * both spellings, and still lets the guarded ones through. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. The check passes by finding nothing and reads markup with regular expressions,
 * so it goes blind on any attribute order or quoting style its pattern did not anticipate -- and
 * the tree ALREADY writes the two attributes in both orders, which is the fixture that matters. It
 * also has to keep seeing the window.open() spelling, where 'noopener' is a feature-string entry
 * rather than an attribute and is the form that gets dropped when a link becomes a script call.
 *
 *   php dev/scripts/blank_target_selftest.php
 */

define('BLANK_TARGET_LIB_ONLY', true);
require __DIR__ . '/blank_target_check.php';

$cases = [
    // ---- what it MUST find ---------------------------------------------------------------------
    ['THE DEFECT: a plain new-tab link with no rel at all',
        ['page.php' => '<a target="_blank" href="https://example.org">x</a>'], true],
    ['a rel that carries something else -- noreferrer is a PRIVACY attribute and is not this one',
        ['page.php' => '<a target="_blank" rel="nofollow" href="https://example.org">x</a>'], true],
    ['THE window.open() SPELLING, where noopener is a feature string and not an attribute',
        ['js/looped-network.js' => "window.open(url, '_blank');"], true],
    ['an unquoted target attribute, which is legal HTML and which a tighter pattern would miss',
        ['page.php' => '<a target=_blank href="https://example.org">x</a>'], true],
    ['a link built by a PHP helper, which is where every calculator reference link came from',
        ['lib/Calculators.lib.php' => "return '<a target=\"_blank\" href=\"'.\$href.'\">'.\$text.'</a>';"], true],

    // ---- what it must NOT report ----------------------------------------------------------------
    ['rel AFTER target, which is how this tree writes it',
        ['page.php' => '<a target="_blank" rel="noopener" href="https://example.org">x</a>'], false],
    ['rel BEFORE target. BOTH ORDERS SHIP, so reading the whole tag rather than a fixed sequence is the load-bearing choice',
        ['page.php' => '<a rel="noopener" target="_blank" href="https://example.org">x</a>'], false],
    ['noopener among several rel values, which is a list and not a single word',
        ['page.php' => '<a target="_blank" rel="noopener noreferrer" href="https://x.org">x</a>'], false],
    ['the guarded window.open(), as the Help menu writes it',
        ['js/looped-network.js' => "window.open(url, '_blank', 'noopener');"], false],
    ['a same-tab link, which opens nothing and is not this rule',
        ['page.php' => '<a href="privacy.php">x</a>'], false],
    ['the word _blank in a key name, with no link anywhere near it',
        ['Looped-Network.php' => "lpn_examples_blank: <?=json_encode(\$ec_lang['lpn_examples_blank'])?>,"], false],
];

$fails = 0;
foreach ($cases as [$name, $files, $wantFinding]) {
    $got = ecBlankTargetFindings($files);
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

if ($fails) {
    echo "\n$fails fixture(s) failed. blank_target_check.php's reach has moved.\n";
    exit(1);
}
echo "\nNew-tab link selftest OK -- " . count($cases) . " fixtures, both directions.\n";
