<?php
/**
 * native_review_flag_check.php — no language is ever logged as "awaiting native review". BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. CLAUDE.md § Translation Sprints: **never log a language as "awaiting native
 * review" — no native speaker will realistically see such a flag.** Tom's own ruling, recorded in
 * `dev/translation-execution-log.md`: the framing "implies a resolution that isn't coming".
 *
 * It is not a style rule. A pending-status flag is a promise to the next reader that somebody is
 * queued to fix this, and nobody is. What it displaces is the honest mechanism this project
 * actually has: `QUALITY` in `lib/Language.Settings.php` carries a current estimate of DEFECT RISK
 * — `0.95` a verified native review on file, `0.85` AI plus back-translation, `0.65` the
 * low-resource tier that gets less verification by design. A tier is a fact about the translation
 * as it stands; "awaiting review" is a fact about a queue that does not exist, and it makes the
 * tier look provisional so nobody acts on it.
 *
 * WHAT IT READS, AND HOW IT AVOIDS REPORTING THE RULE AS A VIOLATION OF ITSELF. Scope is
 * `lib/Language.Settings.php` (where a per-language status would actually be written) and the
 * top-level `dev/*.md` set. That set CONTAINS the rule — `dev/translation-process.md` states it,
 * `dev/enforceable-rules-survey.md` lists it, `dev/translation-execution-log.md` records Tom
 * retiring the framing — so unlike `public_claim_check.php`, which solves the same problem by
 * scoping to shipped strings and never opening a document, this one has to read the documents and
 * TELL A MENTION FROM A USE. Two demotions do that, and both are pinned by the selftest:
 *
 *   1. **The phrase in quotation marks is a mention.** Straight, curly or backticked. Every
 *      statement of the rule quotes the words it forbids, because that is how a rule names its
 *      subject.
 *   2. **A prohibition marker on the line.** `never` before the phrase, or `pipe dream` / `forbid`
 *      / `retired` / `not realistically` anywhere on it. These are narrow on purpose: a general
 *      negation demotion would swallow "am is awaiting native review, which will never arrive",
 *      which is exactly the sentence the rule exists to stop.
 *
 * WHAT IT DELIBERATELY DOES NOT MATCH. "Flagged for native review" and "a native reviewer flagged
 * X" are not banned and are not read as bans here — the ruling is about a PENDING STATUS that
 * implies resolution is coming, so the pattern is the awaiting family (awaiting / pending /
 * queued for / waiting on / to be reviewed). CLAUDE.md itself is out of scope: it is the rule's
 * home, and this file is where the rule now lives in executable form.
 *
 * Usage:
 *   php dev/scripts/native_review_flag_check.php
 *
 * Exit 0 = no pending-review flag. Exit 1 = one is logged, with the file and line.
 */

/** The banned framing: a status that implies somebody is queued to resolve it. */
const EC_PENDING_REVIEW_PATTERNS = [
    '/\b(?:await\w*|pending|queued\s+for|waiting\s+(?:on|for)|to\s+be)\s+'
        . '(?:a\s+|an\s+|the\s+|proper\s+|real\s+|full\s+)*native\s+(?:review|reviewer|speaker|check)\w*/i',
    '/\bnative\s+(?:review|reviewer|check)\w*\s+(?:is\s+|remains\s+|still\s+)?'
        . '(?:pending|awaited|outstanding|queued|to\s+come)/i',
    '/\bto\s+be\s+(?:reviewed|checked|verified)\s+by\s+(?:a\s+|an\s+)?native\s+(?:speaker|reviewer)/i',
];

/** Prohibition markers. Narrow deliberately — see the docblock. */
const EC_PENDING_REVIEW_MARKERS_ANYWHERE = ['pipe dream', 'forbid', 'retired', 'not realistically'];

/**
 * Findings in one text. Pure, for the selftest.
 *
 * @param string $text Whole file contents.
 * @return array<int,array{0:int,1:string}> [line number, the matched text]
 */
function ecPendingNativeReviewFlags(string $text): array
{
    $out = [];
    foreach (explode("\n", $text) as $i => $line) {
        foreach (EC_PENDING_REVIEW_PATTERNS as $re) {
            if (!preg_match($re, $line, $m, PREG_OFFSET_CAPTURE)) {
                continue;
            }
            [$hit, $at] = $m[0];
            if (ecPendingReviewIsQuoted($line, $at, strlen($hit))
                || ecPendingReviewIsProhibition($line, $at)) {
                continue;
            }
            $out[] = [$i + 1, trim($hit)];
            break;
        }
    }
    return $out;
}

/**
 * True if the match sits inside a quotation. A rule names the words it forbids by quoting them,
 * and every statement of this one does.
 */
function ecPendingReviewIsQuoted(string $line, int $at, int $len): bool
{
    $before = substr($line, 0, $at);
    $after  = substr($line, $at + $len);
    // The apostrophe is deliberately NOT a quotation mark here: English possessives and
    // contractions are everywhere on these lines, and a pair of them straddling the phrase would
    // demote a real status line ("am's tier is awaiting native review, and that isn't coming").
    $pairs = [['"', '"'], ['“', '”'], ['`', '`']];
    foreach ($pairs as [$open, $close]) {
        // An opening mark somewhere before the match and a closing mark somewhere after it, with
        // no sentence end intervening -- crude, and right for a one-line quotation of a phrase.
        $o = strrpos($before, $open);
        $c = strpos($after, $close);
        if ($o !== false && $c !== false && strpos(substr($before, $o), '. ') === false) {
            return true;
        }
    }
    return false;
}

/** True if the line states a prohibition rather than a status. */
function ecPendingReviewIsProhibition(string $line, int $at): bool
{
    $lower = strtolower($line);
    foreach (EC_PENDING_REVIEW_MARKERS_ANYWHERE as $marker) {
        if (strpos($lower, $marker) !== false) {
            return true;
        }
    }
    // "never" only BEFORE the phrase: "never log a language as awaiting native review" is the rule,
    // while "awaiting native review, which will never arrive" is the defect wearing the same word.
    return strpos(substr($lower, 0, $at), 'never') !== false;
}

if (defined('NATIVE_REVIEW_FLAG_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$paths = array_merge([$root . '/lib/Language.Settings.php'], glob($root . '/dev/*.md'));

$problems = [];
$files = 0;
foreach ($paths as $file) {
    if (!is_file($file)) {
        continue;
    }
    $files++;
    $rel = ltrim(str_replace($root, '', $file), '/');
    foreach (ecPendingNativeReviewFlags((string) file_get_contents($file)) as [$line, $hit]) {
        $problems[] = "$rel:$line says \"$hit\"";
    }
}

if ($problems) {
    echo 'Pending native-review flags: ' . count($problems) . " line(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n"; }
    echo "\nNever log a language as awaiting native review. No native speaker will realistically\n";
    echo "see such a flag, so the status is a promise of a resolution that is not coming, and it\n";
    echo "makes the honest signal look provisional.\n";
    echo "\nThe fix is to say what is TRUE NOW instead: set the QUALITY weight in\n";
    echo "lib/Language.Settings.php via dev/scripts/update_quality_score.php -- 0.95 a verified\n";
    echo "native review on file, 0.85 AI plus independent back-translation, 0.65 the low-resource\n";
    echo "tier -- and, if a specific string is genuinely uncertain, record the uncertainty and what\n";
    echo "was decided, not a queue position.\n";
    echo "\nSCOPE, so a finding here can be judged: lib/Language.Settings.php and the top-level\n";
    echo "dev/*.md set. Those documents STATE this rule, so a quotation of the phrase and a line\n";
    echo "carrying a prohibition marker (never / forbid / retired / pipe dream / not realistically)\n";
    echo "are demoted as mentions. If your line is a mention this check misread, it is the\n";
    echo "demotions that need widening -- and native_review_flag_selftest.php is where that gets\n";
    echo "pinned, in both directions.\n";
    exit(1);
}

echo "No pending native-review flags -- $files file(s) scanned (lib/Language.Settings.php and the\n";
echo "top-level dev/*.md set). Quotations of the rule and lines stating the prohibition are\n";
echo "demoted as mentions; native_review_flag_selftest.php pins both directions.\n";
exit(0);
