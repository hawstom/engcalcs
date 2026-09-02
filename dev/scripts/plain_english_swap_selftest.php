<?php
/**
 * Fixtures for `plain_english_swap_check.php`, both directions.
 *
 * BLOCKING, though it guards a check that currently finds nothing. That is the whole reason it
 * exists: the check went green by REWRITING seven shipped strings, so from here on a silent zero
 * and a working check look identical from the outside. The fixtures are what tells them apart.
 *
 * The load-bearing half is the NEGATIVE list. This check's one real risk is false positives --
 * "usually" is an ordinary adverb, "the usual one" can describe a method rather than a default --
 * and a check that fires on those would be turned off inside a week.
 */

define('EC_PLAIN_SWAP_LIB_ONLY', 1);

require_once __DIR__ . '/lang_parse.inc.php';

// Pull the table out of the check without running its scan.
$src = file_get_contents(__DIR__ . '/plain_english_swap_check.php');
$start = strpos($src, 'const EC_PLAIN_SWAPS');
$end = strpos($src, '$root = dirname(');
eval('?><?php ' . substr($src, $start, $end - $start));

$fails = 0; $ok = 0;

function ecSwapHit(string $value): array
{
    $out = [];
    foreach (EC_PLAIN_SWAPS as $swap) {
        if (preg_match($swap['pattern'], $value)) { $out[] = $swap['term']; }
    }
    sort($out);
    return $out;
}

function ecSwapAssert(string $name, array $got, array $want)
{
    global $fails, $ok;
    sort($want);
    if ($got === $want) { $ok++; echo "  ok   $name\n"; return; }
    $fails++;
    echo "  FAIL $name\n       got " . json_encode($got) . ', want ' . json_encode($want) . "\n";
}

echo "---- caught: the substitutions Tom struck ----\n";
$bad = [
    ['the phrase that shipped on 2026-09-01 and was struck the same day',
        'The usual value is 40.', ['default']],
    ['and inside a longer sentence',
        'Zero, the usual value, means do not test it.', ['default']],
    ['a solver that "settles"', 'a network that will not settle.', ['converge']],
    ['past tense', 'still has not settled', ['converge']],
    ['gerund', 'the network is settling nicely', ['converge']],
    ['rest pressure', 'The rest pressure at the hydrant.', ['static pressure']],
    ['pulled down', 'how far the tank is pulled down', ['drawdown']],
    ['two swaps in one string are both reported',
        'Zero, the usual value, means the network never settles.', ['converge', 'default']],
];
foreach ($bad as [$name, $value, $want]) { ecSwapAssert($name, ecSwapHit($value), $want); }

echo "\n---- turned away: the false positives that would kill this check ----\n";
// **THESE ARE ALL REAL SHIPPED STRINGS OR NEAR-COPIES OF THEM.** "usually" as an adverb appears
// three times in lib/lang.ec.en.php and is correct every time; a check that fired on the WORD
// rather than on the phrase standing where a term belongs would have eight false positives on the
// day it landed and would be deleted.
$good = [
    ['"usually" as an ordinary adverb', 'Pressure and velocity are the two that usually matter.'],
    ['"usually" about a drawing, not a default', 'A drawing made on a plain grid usually says nothing about this.'],
    ['"the usual one" describing a METHOD, not a default value',
        'That is the method used here, and it is the usual one.'],
    ['the corrected string itself', 'The default is 40.'],
    ['the corrected tip', 'Zero means do not apply this test.'],
    ['"converge" itself is obviously fine', 'a network that will not converge.'],
    ['a word that merely contains the letters', 'The settlement of the tank foundation is not modelled.'],
    ['"static pressure", the term itself', 'Static pressure at the junction.'],
    ['"drawdown", the term itself', 'Drawdown at the tank.'],
];
foreach ($good as [$name, $value]) { ecSwapAssert($name, ecSwapHit($value), []); }

echo "\n---- and the table itself is well formed ----\n";
foreach (EC_PLAIN_SWAPS as $i => $swap) {
    // preg_match() answers 0 for a VALID pattern that simply did not match, and `false` only for a
    // broken one -- so the test is `!== false`, not a cast to bool. The first draft cast, and every
    // row failed while every row was fine.
    $wellFormed = @preg_match($swap['pattern'], 'x') !== false
        && $swap['term'] !== '' && $swap['why'] !== '';
    ecSwapAssert("row $i has a pattern, a term and a ruling", $wellFormed ? [] : ['broken'], []);
}

if ($fails) {
    echo "\nplain_english_swap_selftest: $fails failing case(s) of " . ($fails + $ok) . ".\n";
    echo "plain_english_swap_check.php can no longer see the defect named above, and it prints\n";
    echo "'Plain-English swaps OK' either way. Fix the check, not this file.\n";
    exit(1);
}
echo "\nplain-english swap selftest OK -- $ok case(s), both directions.\n";
