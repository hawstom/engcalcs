<?php
/**
 * native_review_flag_selftest.php — assert that native_review_flag_check.php still catches a
 * language logged as awaiting native review, and still lets the RULE ITSELF through. BLOCKING.
 *
 * WHY THIS EXISTS, AND WHY IT IS THE MORE IMPORTANT HALF. This check is the only one in the set
 * that has to read the documents where its own rule is written down. `dev/translation-process.md`
 * states it, `dev/enforceable-rules-survey.md` lists it, `dev/translation-execution-log.md`
 * records Tom retiring the framing — four real lines today, every one of them a MENTION. A check
 * that reports the rule as a violation of itself is a check somebody deletes, and it would be
 * deleted for a good reason.
 *
 * So the demotions are the whole design, and a demotion buys a shorter list by giving up coverage
 * without changing how the tool looks. **The four real lines are fixtures below, verbatim**, and
 * so is the shape they must not be allowed to excuse: a genuine status line that happens to carry
 * the word "never" AFTER the phrase, which is why "never" is only demoted when it comes BEFORE.
 *
 * Exit 0 = every fixture lands as declared. Exit 1 = a demotion has moved.
 *
 *   php dev/scripts/native_review_flag_selftest.php
 */

define('NATIVE_REVIEW_FLAG_LIB_ONLY', true);
require __DIR__ . '/native_review_flag_check.php';

$cases = [
    // ---- what it MUST find: a language given a pending status -----------------------------------
    ['a per-language status comment in Language.Settings.php, which is where one would really go',
        "//-- settings for khmer; awaiting native review\n\$all_language_settings['km']=array(", true],
    ['a quality note that defers instead of estimating',
        "'QUALITY'=>'0.65', // pending native review", true],
    ['the plain sentence, in a document',
        'sw and km are awaiting native review before the tier moves.', true],
    ['"queued for native review", the same promise in different words',
        'ps is queued for native review; ur is done.', true],
    ['"waiting on a native reviewer"',
        'am is waiting on a native reviewer for the six flagged strings.', true],
    ['the reversed word order, which a denylist written one way round would miss',
        'my: translated 2026-08-19, native review pending.', true],
    ['"to be reviewed by a native speaker"',
        'The km strings are to be reviewed by a native speaker.', true],
    ['A STATUS THAT USES "never" AFTER THE PHRASE. The demotion must not reach backwards to excuse this',
        'km is awaiting native review, and we should admit it may never arrive.', true],
    ['a status line with the language named at the end, so nothing precedes the phrase',
        'Awaiting native review: am, km, my, ps, sw.', true],

    // ---- what it must NOT report: THE FOUR REAL LINES IN THE TREE TODAY, verbatim ---------------
    ['dev/translation-process.md:622 -- the rule itself, quoted and prefixed with "Never"',
        '**Never log a language as "awaiting native review" as if resolution is coming.** No native speaker',
        false],
    ['dev/translation-process.md:168 -- the rule as a contrast, quoted and negated',
        '6. **Quality tier, not a "pending native review" flag** (Tom, 2026-07-12): am, km, my, ps, sw stay',
        false],
    ['dev/enforceable-rules-survey.md:58 -- the survey row that asked for this very check',
        '| 17 | **Never log a language as "awaiting native review"** | CLAUDE.md § Translation Sprints | `lib/Language.Settings.php` and the `dev/*.md` set | 15 | No |',
        false],
    ['dev/translation-execution-log.md:1361 -- Tom\'s directive, demoted by "pipe dream"',
        "Tom's directive: waiting on native review that may never arrive is a pipe dream (already",
        false],

    // ---- other legitimate shapes ----------------------------------------------------------------
    ['the phrase inside backticks, which is how a code-adjacent doc quotes it',
        'The `awaiting native review` framing was retired.', false],
    ['a curly-quoted mention',
        'He struck the “awaiting native review” flag from every language.', false],
    ['A NATIVE REVIEW THAT ACTUALLY HAPPENED -- a record of work done is not a pending status',
        'bg was raised to 0.95 after a native review landed on file.', false],
    ['"flagged for native review", deliberately out of the pattern: it records an uncertainty, not a queue',
        'Two residual-uncertainty flags for native review: km mtc_vel_low and sw mpf_shear_stress.', false],
    ['a sentence about a reviewer being unavailable, which is the honest opposite of the flag',
        'Tom had no native reviewer available and gave a different instruction.', false],
    ['prose that merely contains both words far apart',
        'A native speaker of Khmer would read this differently; the review process cannot wait.', false],
];

$fails = 0;
foreach ($cases as [$name, $text, $wantFinding]) {
    $got = ecPendingNativeReviewFlags($text);
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
    echo "\n$fails fixture(s) failed. native_review_flag_check.php's reach has moved.\n";
    echo "If a MENTION fixture now fails, the check has started reporting the rule as a violation of\n";
    echo "itself, and the next person to hit that will delete it. If a STATUS fixture now fails, a\n";
    echo "demotion grew wide enough to swallow the thing the rule exists to stop.\n";
    exit(1);
}
echo "\nNative-review-flag selftest OK -- " . count($cases) . " fixtures, both directions,\n";
echo "including the four real mentions in the tree today.\n";
exit(0);
