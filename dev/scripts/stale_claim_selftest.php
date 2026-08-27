<?php
/**
 * stale_claim_selftest.php -- assert that stale_claim_check.php's DEMOTIONS did not blind it.
 *
 * **WHY THIS EXISTS.** Every demotion in that file buys a shorter worklist by giving up some
 * coverage, and the trade is invisible: the tool prints fewer lines either way, whether it got
 * smarter or went blind. The history is the argument -- on 2026-08-23 all ELEVEN high-ranked
 * lines were legitimate records, two demotions cut it to 7, and by 2026-08-26 it had drifted back
 * to 9, all nine legitimate. Two more demotions took it to 2. Nobody can tell by looking whether
 * the fifth demotion will be the one that stops finding the real thing.
 *
 * So the fixtures below are the contract. The THREE FALSE CLAIMS THAT ACTUALLY SHIPPED must rank
 * HIGH forever; the legitimate shapes must not. Add a fixture whenever you add a demotion, and add
 * the real line whenever a stale claim gets past this tool in the wild -- that one is worth more
 * than any invented case.
 *
 * Exit 0 = every fixture ranks as declared. Exit 1 = a demotion changed what the tool can see.
 * BLOCKING, unlike the check it guards: the check is a judgement call and this is not.
 *
 *   php dev/scripts/stale_claim_selftest.php
 */

define('STALE_CLAIM_LIB_ONLY', true);
require __DIR__ . '/stale_claim_check.php';

// [expected rank, line, what shape this is]. 'high' means "a reader must look at this".
$fixtures = [
    // ---- THE REAL DEFECTS. All three shipped, all three were found by a human, not by a check.
    ['high', '- **No extended-period simulation yet** (Task 248).',
        'the false claim that stood in CLAUDE.md for three days after the run shipped'],
    ['high', 'Reads EPANET `.inp` files but does not write one yet (Task 281).',
        'the false claim about the exporter, which had already shipped'],
    ['high', 'The looped network is not built yet -- see Task 146 for the scope.',
        'a hard builtness claim wearing a pointer: the pointer demotion must NOT excuse it'],
    ['high', 'Task 465 is unbuilt, so editing one type still edits nothing.',
        'a bare builtness claim with no demotable shape'],

    // ---- LEGITIMATE SHAPES. Each was a real HIGH line on 2026-08-26 and each is correct prose.
    ['medium', 'That is what closed Task 442: the toolbar does NOT become a side menu, on any screen.',
        'record verb before the citation'],
    ['medium', 'Task 232 removed `Irrigation.php`, so `cs_` is the remaining page Tom is not proud of.',
        'record verb after the citation'],
    ['medium', 'Extracted from Task 388 on close so it is not re-proposed from scratch.',
        'record verb before, with the citation mid-phrase'],
    ['medium', 'Was the language tag until Task 288; the value is not read anywhere.',
        '"until" is a record verb -- it dates the change'],
    ['medium', '(the key is not started). Merging them restores the permanent floor Task 161 removed.',
        'record verb at the end of the sentence -- the real dev/translation-process.md:101'],
    ['medium', 'See ROADMAP Task 161 for why that count cannot reach zero.',
        'a pointer, with only a soft negation'],
    ['medium', '**"Does not write one yet" is FALSE.** Task 281 shipped the exporter.',
        'a correction quoting the false claim -- reporting this as the defect makes the fix look undoable'],
    ['medium', 'Task 193 reviewed all 226 keys and it did not work.',
        'past tense: a record of what happened, not a claim about now'],

    // ---- The demotions must stay NARROW. A record verb far from the citation is not a record.
    ['high', 'Task 146 is not yet finished, though the sprint that closed a different thing is done.',
        'a record verb on the line but not adjacent to the citation, past a sentence boundary'],
];

$fail = 0;
foreach ($fixtures as [$want, $line, $shape]) {
    [$got, $why] = rankCitation($line);
    if ($got === $want) {
        continue;
    }
    $fail++;
    printf("FAIL  expected %-6s got %-6s  (%s)\n      %s\n      ranked because: %s\n\n",
        $want, $got, $shape, $line, $why);
}

printf("%s: %d fixtures, %d mismatched.\n", $fail ? 'FAIL' : 'PASS', count($fixtures), $fail);
if ($fail) {
    echo "A demotion in stale_claim_check.php changed what the tool can see. Either the demotion is\n";
    echo "too broad, or the fixture is wrong -- decide which, and do not just edit the fixture.\n";
}
exit($fail ? 1 : 0);
