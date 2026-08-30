<?php
/**
 * anchor_language_selftest.php — assert anchor_language_check.php still catches prose that has
 * drifted from `meta.anchor_languages`, and still leaves the two legitimate lookalikes alone.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. The survey behind ROADMAP Task 322 flagged this row as the one where FALSE
 * POSITIVES ARE LIKELY, and it was right: fifteen lines in `dev/*.md` name a set of language codes
 * beside the word "anchor" and every one of them is correct. The check answers that by scoping
 * tightly and declaring the rest — which means its whole value now rests on two judgements a
 * fixture can pin and a reading cannot:
 *
 *   1. **The window.** Both documents write the lead-in on one line and the codes on the next, so
 *      the detector reads a two-line window. Narrow it to one line and the CURRENT set stops being
 *      checked at all — the check goes green by seeing nothing, which is the failure that looks
 *      most like success.
 *   2. **The marker.** A declared exception is allowed only while its sentence still says it is
 *      history. Drop that requirement and the exception becomes a licence to write the old four
 *      anywhere in the file, which is exactly the drift being guarded.
 *
 *   php dev/scripts/anchor_language_selftest.php
 */

define('ANCHOR_LANGUAGE_LIB_ONLY', true);
require __DIR__ . '/anchor_language_check.php';

$current = ['es', 'pt', 'fr', 'tr'];
$except = [
    'doc.md|ar,es,fr,ru' => ['marker' => ['replaced', 'They were'], 'why' => 'the superseded set'],
    'doc.md|bg,cs,de,es,fr,hr,id,it,pt,ro,ru,sr,tr,uk' => ['marker' => ['Wave 1'], 'why' => 'the cognate cluster'],
];

$cases = [
    // ---- what it MUST find -----------------------------------------------------------------------
    ['prose that kept the old set as though it were current',
        "**Anchor languages** are es, fr, ru, ar: the four a rendering is checked against.\n", true],
    ['prose naming a set that was never the set',
        "The anchor languages are es, pt, de, tr.\n", true],
    ['A SET THAT DROPPED ONE. Three of four is the drift a reader would never notice',
        "Anchor languages: es, pt, fr.\n", true],
    ['THE DECLARED OLD SET WITH ITS HISTORY MARKER GONE. This is the exception becoming a licence',
        "The anchor languages are es, fr, ru, ar.\n", true],
    ['the marker present but two lines away, outside the window the detector itself uses',
        "They were replaced in Task 214.\n\nAnchors: es, fr, ru, ar.\n", true],
    ['the current set written in the wrong order but with a code changed -- order is normalised, membership is not',
        "Anchor languages, in order: tr, fr, pt, de.\n", true],

    // ---- what it must NOT report -------------------------------------------------------------------
    ['THE REAL SHAPE: lead-in on one line, codes on the next. A one-line window would see nothing here',
        "**Anchor languages are declared in `glossary.json`'s `meta.anchor_languages` — read that,\n"
        . "not this line.** They are `es, pt, fr, tr`: the core languages and the measured top four.\n", false],
    ['the current set on one line with the word anchor',
        "The anchor languages are es, pt, fr, tr.\n", false],
    ['THE SUPERSEDED SET, named as history, which three documents do on purpose',
        "They are `es, pt, fr, tr`. They replaced `es, fr, ru, ar` because an anchor is a reference\n"
        . "point other renderings get checked against.\n", false],
    ['the same set introduced by the other marker this repo uses',
        "The GLOSSARY ANCHORS are now es, pt, fr, tr. They were\n"
        . "es, fr, ru, ar; ru had one measured human and ar had zero.\n", false],
    ['THE OTHER SENSE OF THE WORD: the retired wave-1 cognate cluster, fourteen languages long',
        "- **Wave 1 — anchors:** es pt fr it de ro ru uk bg sr hr cs tr id. Cognate clustering.\n", false],
    ['a line of language codes with no mention of anchors anywhere near it',
        "Fifteen of 26 languages appear nowhere: am, ar, bn, cs, fa, hi, id.\n", false],
    ['measured reach figures beside the anchors, which are numbers and not a second set',
        "Anchor languages are es, pt, fr, tr, the measured top four (es 186, pt 30, fr 23, tr 17).\n", false],
    ['ordinary prose that happens to contain the word anchor and no codes',
        "An anchor is a reference point other renderings get checked against.\n", false],
];

$fails = 0;
foreach ($cases as [$name, $text, $want]) {
    $f = ecAnchorProseFindings('doc.md', $text, $current, $except);
    $hit = $f['problems'] !== [];
    if ($hit !== $want) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted ' . ($want ? 'a finding' : 'no finding') . ', got '
            . ($hit ? count($f['problems']) . ': ' . $f['problems'][0] : 'none') . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

// The check must actually SEE the agreeing restatement, not merely fail to complain about it. A
// detector that matches nothing produces an empty problem list too, and every "must not report"
// fixture above would pass on a check that had gone completely blind.
$real = "**Anchor languages are declared in `glossary.json`'s `meta.anchor_languages` — read that,\n"
      . "not this line.** They are `es, pt, fr, tr`: the core languages and the measured top four.\n";
$f = ecAnchorProseFindings('doc.md', $real, $current, $except);
if (count($f['matched']) !== 1) {
    $fails++;
    echo "  FAIL the detector did not RECOGNISE the real CLAUDE.md sentence as an anchor set "
        . '(matched ' . count($f['matched']) . ", wanted 1). A check that sees nothing reports\n";
    echo "        nothing, and every negative fixture above would still pass.\n";
} else {
    echo "  ok   the detector recognises the real sentence rather than merely not complaining\n";
}

// An exception that stops matching is a decision recorded about a sentence that has gone.
$f = ecAnchorProseFindings('doc.md', "Nothing here mentions languages at all.\n", $current, $except);
if ($f['used'] !== []) {
    $fails++;
    echo "  FAIL an exception was marked used against text that does not contain it\n";
} else {
    echo "  ok   an exception matching nothing is not silently marked used\n";
}

if ($fails) {
    echo "\n$fails fixture(s) failed. anchor_language_check.php's reach has moved.\n";
    echo "A false negative here lets a sprint's 26 agents check their work against a reference\n";
    echo "point the project no longer uses, and every one of them reports success.\n";
    exit(1);
}
echo "\nAnchor language selftest OK -- " . (count($cases) + 2) . " fixtures, both directions.\n";
exit(0);
