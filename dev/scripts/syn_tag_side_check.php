<?php
/**
 * syn_tag_side_check.php — a commentary tag never appears LEFT of the pipe in $ec_lang_syn.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. `dev/language-strings.md` §format defines one `$ec_lang_syn` value as
 * `<synonyms> | <commentary>`, split on the FIRST pipe, and the two sides are different kinds of
 * thing:
 *
 *   - **Left is translatable payload.** Every phrase there must pass the substitution test — it
 *     could stand on the control as the label itself. It is what a translation agent is handed.
 *   - **Right is production notes.** `layout:`, `avoid:`, `gloss:`, `symbol`, `runtime:` — English,
 *     never translated, and `generate_translation_payloads.php` STRIPS the whole right side before
 *     an agent ever sees it.
 *
 * So a tag written on the wrong side of the pipe, or written with no pipe at all, does not merely
 * look untidy: **it is delivered to 26 translators as a synonym of the label.** The generator has
 * no way to tell — it strips by position, not by content — so the failure is silent at every step,
 * and the first evidence would be a language file in which some translator did the reasonable
 * thing with the words "layout: column heading" and rendered them.
 *
 * WHY IT IS A SEPARATE CHECK FROM layout_tag_check.php. That script reads the RIGHT side only: it
 * asks whether a tag that is where it belongs is TRUE. Nothing asked whether a tag is where it
 * belongs, which is the same rule's unguarded half (`dev/enforceable-rules-survey.md` row 15). The
 * two are deliberately not merged, because they fail for opposite reasons and their error text has
 * nothing in common: one says "this tag is stale", this one says "this tag is not commentary at
 * all yet".
 *
 * THE VOCABULARY IS NOT RESTATED HERE. It comes from `layout_tag_check.php`'s KNOWN_TAGS, which
 * `dev/language-strings.md` §format is the source of. A sixth tag added there is guarded by this
 * check the same day, with nobody remembering to come back.
 *
 * Usage:
 *   php dev/scripts/syn_tag_side_check.php
 *
 * Exit 0 = every tag is commentary. Exit 1 = a tag is sitting in the translatable payload.
 */

require_once __DIR__ . '/lang_parse.inc.php';

// KNOWN_TAGS lives in layout_tag_check.php, which reads it from dev/language-strings.md's table.
// It is defined with const, so requiring the file would run its main(); pull the constant out of
// the source text instead, and fail loudly rather than silently guarding a stale vocabulary.
if (!defined('KNOWN_TAGS')) {
    $ecTagSrc = (string) file_get_contents(__DIR__ . '/layout_tag_check.php');
    if (!preg_match('/const\s+KNOWN_TAGS\s*=\s*\[(.*?)\];/s', $ecTagSrc, $ecTagM)) {
        fwrite(STDERR, "Cannot read KNOWN_TAGS out of layout_tag_check.php. The tag vocabulary has\n"
            . "one home (dev/language-strings.md §format, mirrored in that constant); this check\n"
            . "reads it rather than keeping a second copy that can drift. Restore the constant, or\n"
            . "point both checks at wherever it lives now.\n");
        exit(1);
    }
    preg_match_all("/'([a-z-]+)'/", $ecTagM[1], $ecTagNames);
    define('KNOWN_TAGS', $ecTagNames[1]);
}

/**
 * Findings in a set of $ec_lang_syn raw values. Pure, for the selftest.
 *
 * @param array<string,string> $syn key => raw value.
 * @return array<int,array{0:string,1:string,2:string}> [key, the offending text, what to do]
 */
function ecSynLeftSideTags(array $syn): array
{
    $names = implode('|', array_map(static fn($t) => preg_quote($t, '/'), KNOWN_TAGS));
    $out = [];

    foreach ($syn as $key => $value) {
        $value = (string) $value;
        if (trim($value) === '') {
            continue;
        }
        $pipe = strpos($value, '|');
        $left = $pipe === false ? $value : substr($value, 0, $pipe);
        $hasPipe = $pipe !== false;

        // `tag:` anywhere on the left. The colon is what makes it a tag rather than a word: the one
        // legitimate colon in the whole file today introduces a definition ("Discharge exponent:
        // the exponent x in ..."), and no tag name is an English word a synonym list would open a
        // clause with.
        if (preg_match('/\b(' . $names . ')\s*:/i', $left, $m)) {
            $out[] = [$key, trim($m[0]), ecSynTagAdvice($key, $hasPipe)];
            continue;
        }

        // A BARE FLAG, e.g. `symbol` standing alone as its own clause. `symbol` is a flag rather
        // than a `tag: value` pair, so it carries no colon and the test above cannot see it -- and
        // it is the single most common tag in the file, which makes it the one most likely to be
        // typed on the wrong side.
        foreach (preg_split('/[;|]/', $left) as $segment) {
            if (in_array(strtolower(trim($segment)), array_map('strtolower', KNOWN_TAGS), true)) {
                $out[] = [$key, trim($segment), ecSynTagAdvice($key, $hasPipe)];
                break;
            }
        }
    }

    return $out;
}

/** The fix, which differs entirely depending on whether the author forgot the pipe. */
function ecSynTagAdvice(string $key, bool $hasPipe): string
{
    if (!$hasPipe) {
        return 'There is no pipe in this value at all, so the ENTIRE string is synonyms and the tag '
            . 'is being handed to 26 translators as a phrase that could stand on the control. Add '
            . "the ' | ' separator before the commentary.";
    }
    return 'The tag is left of the pipe, which is the translatable payload -- '
        . 'generate_translation_payloads.php strips the right side by POSITION, so this one is '
        . 'delivered to the agents as a synonym. Move it after the pipe, beside the commentary '
        . 'that is already there.';
}

if (defined('SYN_TAG_SIDE_LIB_ONLY')) {
    return;
}

$en = dirname(__DIR__, 2) . '/lib/lang.ec.en.php';
$syn = ecLangSynRawValues((string) file_get_contents($en));
if ($syn === []) {
    fwrite(STDERR, "No \$ec_lang_syn entries found in $en. This check reads the synonym channel; if\n"
        . "the channel moved, point it at the new home rather than leaving it reporting clean.\n");
    exit(1);
}

$problems = ecSynLeftSideTags($syn);

if ($problems) {
    echo 'Commentary tags in the synonym payload: ' . count($problems) . " key(s)\n\n";
    foreach ($problems as [$key, $hit, $advice]) {
        echo "  \$ec_lang_syn['$key'] carries \"$hit\" LEFT of the pipe\n      $advice\n\n";
    }
    echo "\$ec_lang_syn is <synonyms> | <commentary>, split on the FIRST pipe. Left is what a\n";
    echo "translation agent is handed and every phrase there must pass the substitution test --\n";
    echo "it could stand on the control as the label. Right is production notes in English that\n";
    echo "the payload generator strips.\n";
    echo "\nNothing downstream can tell these apart: the generator strips by position, so a tag on\n";
    echo "the wrong side is shipped to 26 agents as a synonym and nothing warns anybody.\n";
    echo "\ndev/language-strings.md §format has the vocabulary and the rule. \$ec_lang_syn is\n";
    echo "OFF-LIMITS to AI without written permission, so propose the diff; do not just move it.\n";
    exit(1);
}

echo 'Synonym payload clean -- ' . count($syn) . " \$ec_lang_syn entries, no "
    . implode('/', KNOWN_TAGS) . " tag\nleft of the pipe.\n";
exit(0);
