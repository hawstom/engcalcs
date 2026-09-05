<?php
/**
 * public_claim_selftest.php — assert that public_claim_check.php still catches each of the four
 * struck sentences, and still lets the SANCTIONED wording through. BLOCKING.
 *
 * WHY THIS EXISTS. The check finds nothing today and must keep finding nothing. Its particular way
 * of going blind is a denylist that gets edited: someone tightens a pattern to silence a false
 * positive and quietly removes a real one. Each of the four here is a sentence that was written,
 * shipped, and struck by Tom personally — none of them is hypothetical.
 *
 * **THE SANCTIONED SENTENCE IS THE MOST IMPORTANT FIXTURE IN THE FILE.** It is
 *
 *     "And although you of course prefer working on your PC, it works also on a phone in tall mode."
 *
 * which contains *"your PC"* and *"a phone"* — a hair from two of the four denied phrases. A check
 * that matched the pronoun rather than the noun, or that denied "phone" rather than "your phone",
 * would report the exact sentence Tom wrote and approved. That is how a check gets deleted.
 *
 *   php dev/scripts/public_claim_selftest.php
 */

define('PUBLIC_CLAIM_LIB_ONLY', true);
require __DIR__ . '/public_claim_check.php';

$cases = [
    // ---- the four that shipped and were struck ------------------------------------------------
    ['"your phone" instead of "a phone"',
     ['k' => 'It works on your phone too.'], true],
    ['"PC application", struck from the LibreWaterNet draft',
     ['k' => 'And it is a PC application, the way EPANET is.'], true],
    ['"the only third-party request", false since the geocoder shipped',
     ['k' => 'The map tiles are the only third-party request this suite makes.'], true],
    ['"no extended-period simulation yet", false since 2026-08-18',
     ['k' => 'There is no extended-period simulation yet.'], true],
    ['...and its other phrasing, which says the same thing',
     ['k' => 'This page does not support extended period runs.'], true],
    // **BOTH LEGS OF THE ONE DEMOTION.** `lpn_time_no_period` was ruled OK by Tom on 2026-09-04 and
    // is a fact about one open document, not a claim about the suite. The demotion excuses that
    // exact shape and nothing near it -- these three fixtures are what stops it widening into the
    // denial it sits beside, which is the failure this whole file exists to prevent.
    ['the SUITE-level claim still blocks, demotion or no demotion',
     ['k' => 'There is no extended period simulation in this suite.'], true],
    ['a near-miss on the demotion still blocks, because blocking is the safe direction',
     ['k' => 'This project has no extended period simulation configured.'], true],

    // ---- what must pass ------------------------------------------------------------------------
    // **THE SANCTIONED SENTENCE, VERBATIM.** See the docblock: it is one word from two denials.
    ['the sanctioned sentence, which Tom wrote and approved',
     ['k' => 'And although you of course prefer working on your PC, it works also on a phone in tall mode.'],
     false],
    ['"a phone" on its own, which is the correct claim',
     ['k' => 'It works on a phone.'], false],
    ['"your PC", which is fine and is in the sanctioned sentence',
     ['k' => 'You of course prefer working on your PC.'], false],
    ['a web application, which is the identity Tom ruled for',
     ['k' => 'It is a web application and runs everywhere a browser runs.'], false],
    ['extended-period simulation described as PRESENT',
     ['k' => 'Extended-period simulation runs through the EPANET engine.'], false],
    // Tom's own sentence, verbatim, as it ships in lib/lang.ec.en.php.
    ['a fact about ONE PROJECT, which is true and which Tom ruled OK 2026-09-04',
     ['k' => 'This project has no extended period simulation set, so there is only one moment to '
           . 'show. Set a Total run time in Settings to calculate the network over time.'], false],
    ['four third-party requests, stated correctly',
     ['k' => 'This page makes four third-party requests, and every one is opt-in.'], false],
    ['an empty string, and a value that is not a string at all',
     ['a' => '', 'b' => 0], false],
];

$fails = 0;
foreach ($cases as [$name, $strings, $shouldFlag]) {
    $got = ecStruckClaims($strings);
    $flagged = count($got) > 0;
    if ($flagged !== $shouldFlag) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        expected ' . ($shouldFlag ? 'a finding' : 'no finding')
            . ', got ' . (count($got) ? '"' . $got[0][1] . '"' : 'none') . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

if ($fails) {
    echo "\n$fails fixture(s) failed. public_claim_check.php's denylist has moved.\n";
    echo "A false negative lets a sentence Tom struck back onto a page strangers read; a false\n";
    echo "positive reports the sentence he wrote. Both end with somebody deleting the check.\n";
    exit(1);
}
echo "\nPublic-claim selftest OK -- " . count($cases) . " fixtures, both directions.\n";
exit(0);
