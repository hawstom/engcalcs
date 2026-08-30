<?php
/**
 * syn_tag_side_selftest.php — assert that syn_tag_side_check.php still sees a commentary tag in
 * the translatable payload, and still leaves ordinary prose alone. BLOCKING.
 *
 * WHY THIS EXISTS. The check is clean today and is meant to stay clean, which is the condition
 * under which a working check and a dead one print the same sentence. It has two specific ways to
 * go wrong, and both are pinned below:
 *
 *   - **A false positive is expensive out of proportion to its size.** `$ec_lang_syn` is
 *     OFF-LIMITS to AI without written permission, so a wrong finding cannot simply be fixed; it
 *     has to be taken to a human, or the check gets muted. The left side is human-authored prose
 *     containing parentheses, semicolons and one real colon, and every one of those shapes is a
 *     fixture here.
 *   - **A false negative ships the tag to 26 paid agents** as a phrase that could stand on the
 *     control, and the only evidence would be a translated "layout: column heading" in a language
 *     nobody in this project reads.
 *
 *   php dev/scripts/syn_tag_side_selftest.php
 */

define('SYN_TAG_SIDE_LIB_ONLY', true);
require __DIR__ . '/syn_tag_side_check.php';

$cases = [
    // ---- what it MUST find --------------------------------------------------------------------
    ['a layout tag left of the pipe, with real commentary already on the right',
        'Flow rate, Discharge; layout: column heading | gloss: discharge', true],
    ['THE MISSING PIPE. The whole value is payload, so the commentary is shipped as synonyms',
        'Slope, Gradient; layout: unit token; gloss: slope', true],
    ['a gloss pointer written as a synonym',
        'Head loss, gloss: head loss | symbol', true],
    ['an avoid tag on the left -- the trap-term instruction becomes the trap',
        'Running slope; avoid: activity sense "running/walking/jogging" | layout: unit token', true],
    ['a runtime tag on the left',
        'Diameter; runtime: units appended | gloss: diameter', true],
    ['A BARE FLAG, which carries no colon and so is invisible to the tag:value test',
        'Shear stress, Tractive force; symbol | gloss: shear stress', true],
    ['a bare flag with no pipe anywhere',
        'Shear stress, Tractive force; symbol', true],
    ['capitalised, because a tag typed at the start of a clause gets auto-capitalised by the writer',
        'Pipe length; Layout: column heading | gloss: pipe', true],
    ['spaced before the colon',
        'Velocity; layout : unit token | symbol', true],

    // ---- what it must NOT report ---------------------------------------------------------------
    ['the ordinary shape: everything after the pipe, which is where layout_tag_check.php reads',
        'Slope, Gradient, Grade | gloss: slope; layout: unit token; avoid: activity sense "running/walking/jogging"', false],
    ['COMMENTARY ONLY, the pipe leading -- 500-odd real entries look like this',
        '| gloss: slope; layout: unit token', false],
    ['an empty value, which is most of the file',
        '', false],
    ['THE ONE REAL COLON ON A LEFT SIDE TODAY: a definition, not a tag',
        'Discharge exponent: the exponent x in q = k*H^x describing emitter hydraulic behavior. ', false],
    ['synonyms with parentheses and a semicolon, which is the real consent_accept_all shape',
        'Allow (permit, accept) this and any later ask; do not ask (question) me again', false],
    ['the word "avoid" as ordinary prose in a synonym',
        'Freeboard, the depth kept clear to avoid overtopping', false],
    ['"glossary" is not "gloss:" -- the word boundary is doing real work here',
        'Term list, glossary: not a tag but a word followed by a colon is exactly the near miss', false],
    ['a tag-shaped word inside a longer synonym, with the colon belonging to something else',
        'Page layout mode, Drawing layout | layout: button', false],
    ['a pipe inside the commentary as well as the separator -- the split is on the FIRST pipe only',
        'Flow, Discharge | gloss: discharge; avoid: flow | rate confusion', false],
];

$fails = 0;
foreach ($cases as $i => [$name, $value, $wantFinding]) {
    $got = ecSynLeftSideTags(['fixture_' . $i => $value]);
    $hit = $got !== [];
    if ($hit !== $wantFinding) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted ' . ($wantFinding ? 'a finding' : 'no finding') . ', got '
            . ($hit ? '"' . $got[0][1] . '"' : 'none') . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

if ($fails) {
    echo "\n$fails fixture(s) failed. syn_tag_side_check.php's reach has moved.\n";
    echo "A false positive here sends a human to approve a diff in a file AI may not touch; a false\n";
    echo "negative pays 26 agents to translate a production note. Neither is a later problem.\n";
    exit(1);
}
echo "\nSynonym tag-side selftest OK -- " . count($cases) . " fixtures, both directions.\n";
exit(0);
