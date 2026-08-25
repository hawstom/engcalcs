<?php
/**
 * Reports language-key debt that nothing else can see: keys nothing renders, and suffix names
 * that have drifted away from the convention their own siblings follow.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. Tom, 2026-08-12: *"I have not been reviewing code directly, and I am not going
 * to review code directly, but I don't want to be building a maintenance debt due to neglected
 * review and refactoring. What can you offer me?"*
 *
 * This is half the offer; `rename_lang_key.php` is the other half. The two are a pair on purpose:
 * this one FINDS the debt without anybody reading code, and that one makes PAYING it one command.
 * Neither alone would have helped — the reason bad names survived was never that nobody noticed
 * one, it was that fixing it meant a forty-edit sweep across 27 language files with every miss
 * failing silently, so leaving it was the rational choice.
 *
 * ADVISORY BY DEFAULT (always exits 0). Both findings are judgement calls at the margin, and a
 * check that blocks on a judgement call gets muted. `--strict` exits 1, for anyone who wants it in
 * a gate.
 *
 * Usage:
 *   php dev/scripts/key_hygiene_check.php
 *   php dev/scripts/key_hygiene_check.php --strict
 */
const HYGIENE_LANG_FILE = __DIR__ . '/../../lib/lang.ec.en.php';

$strict = in_array('--strict', $argv, true);

$ec_lang = [];
$ec_lang_syn = [];
include HYGIENE_LANG_FILE;
$keys = array_keys($ec_lang);

$root = dirname(__DIR__, 2);
$code = '';
foreach (array_merge(glob($root . '/*.php'), glob($root . '/lib/*.php'), glob($root . '/js/*.js')) as $f) {
    if (strpos($f, 'lang.ec.') !== false) continue;   // a lang file defining a key is not a use of it
    $code .= "\n" . file_get_contents($f);
}

// ---------------------------------------------------------------------------------------------
// 1. Keys nothing renders
// ---------------------------------------------------------------------------------------------
// A key can be used without its full name ever appearing: lib/Calculators.lib.php builds unit
// labels as $ec_lang['u_' . $unit]. Any prefix assembled that way marks its whole family live,
// because there is no way to tell from here which members the runtime will ask for. Detected
// rather than hard-coded, so a second dynamic family cannot quietly produce 40 false positives.
preg_match_all('/\[\s*[\'"]([a-z0-9_]+_)[\'"]\s*\./i', $code, $m);
$dynamicPrefixes = $m[1];

// **AND A FAMILY CONSUMED BY ITS PREFIX IS JUST AS LIVE AS ONE ASSEMBLED BY IT.** Added 2026-08-25
// after this check reported 14 example titles and descriptions as dead: `lpn_ex_*` is built by
// dev/scripts/generate_examples.php as "lpn_ex_{$key}_title" and consumed in Looped-Network.php by
// `strpos($k, 'lpn_ex_') !== 0`. Neither form is a concatenation, so neither was seen, and the
// check's one useful list was 40% noise -- which is how a check becomes one people learn to skip.
//
// Two more shapes, both DETECTED rather than named, for the reason the paragraph above gives:
//   1. an interpolated build -- "prefix_{$k}_title"
//   2. a prefix test -- strpos($k, 'prefix_'), or indexOf('prefix_') in JS
// A prefix test is evidence the runtime walks the whole family, which is exactly what makes an
// individual member unfindable from here.
preg_match_all('/[\'"]([a-z0-9_]+_)\{\$/i', $code, $m2);
$dynamicPrefixes = array_merge($dynamicPrefixes, $m2[1]);
preg_match_all('/(?:strpos|indexOf|startsWith)\s*\(\s*[^,()]+,\s*[\'"]([a-z0-9_]+_)[\'"]/i', $code, $m3);
$dynamicPrefixes = array_merge($dynamicPrefixes, $m3[1]);
preg_match_all('/\.\s*(?:indexOf|startsWith)\s*\(\s*[\'"]([a-z0-9_]+_)[\'"]/i', $code, $m4);
$dynamicPrefixes = array_merge($dynamicPrefixes, $m4[1]);
$dynamicPrefixes = array_values(array_unique($dynamicPrefixes));

$dead = [];
foreach ($keys as $k) {
    foreach ($dynamicPrefixes as $d) {
        if (strpos($k, $d) === 0) continue 2;
    }
    if (!preg_match('/(?<![A-Za-z0-9_])' . preg_quote($k, '/') . '(?![A-Za-z0-9_])/', $code)) {
        $dead[] = $k;
    }
}

// ---------------------------------------------------------------------------------------------
// 2. Suffix vocabulary that has drifted
// ---------------------------------------------------------------------------------------------
// Only groups where every member means the SAME thing, so a minority spelling is a stray rather
// than a distinction.
//
// DELIBERATELY EXCLUDED, and this is the interesting part: heading/head/title. `_head` is the
// hydraulic quantity in most of its 7 uses (lpn_field_head, mpf_head...), not a shortened
// "heading" — flagging it would be a tool confidently renaming physics into typography. When a
// group cannot be judged from the name alone, it does not belong in an automated check.
// confirm/prompt is excluded for the same reason: a confirm asks yes-or-no, a prompt asks for a
// value, and they are genuinely two things.
//
// TIGHTENED IMMEDIATELY AFTER THE FIRST RUN, which is the useful part of the story: the first
// version flagged six keys and four were wrong. `_tip` is not a spelling preference in this suite,
// it NAMES A DELIVERY MECHANISM -- an .ec-help/.ec-tip tooltip shipped through pageConfig, which
// popup-tips-harness.js asserts on by that suffix. `lpn_empty_hint` is empty-state text painted on
// the canvas; renaming it to `_tip` would be a tool confidently making a false claim about the UI.
// And `contact_message` is the message the visitor writes, a noun, not a note to them.
//
// So the rule for adding a group here: every member must mean the same thing in EVERY key that
// carries it. If judging that needs the value or the call site, it is not an automatable group.
// Left to a human on purpose: tip/help/hint, heading/head/title (`_head` is usually hydraulic
// head), confirm/prompt (yes-or-no vs asking for a value). Under-reporting beats a check people
// learn to ignore.
//
// ADJUDICATED 2026-08-13 (ROADMAP Task 291, Tom). The residue this comment deferred has now been
// read key by key, and the outcome is worth recording because it argues for keeping these groups
// out rather than for automating them later:
//   - tip/help/hint: 3 of the 3 non-`_tip` keys needed a different answer each. `points_data_help`
//     was a real stray (visible inline text, and `_help` collided with the .ec-help tooltip class)
//     -> `_note`. `ec_name_hint` was the genuine tooltip nobody had flagged -> `_tip`. And
//     `lpn_empty_hint` was right all along. No rule over names could have produced that spread.
//   - heading/head/title: every `_head` was hydraulic, exactly as predicted. The drift was
//     somewhere the name could not show -- `_title` meant BOTH "browser <title>" and "on-page
//     heading". The section headings became `_heading`; `template_printable_title` stayed, because
//     it really is a title (the printed sheet's).
//   - confirm/prompt: NOT already correct, which was the surprise. Four keys asked yes-or-no while
//     named `_prompt`. Deciding them needed the call site -- `lpn_close_browser_prompt` reads as a
//     statement but is the body of a confirm dialog, in a ternary with its `_confirm` sibling.
// A dialog-body warning that asks nothing is now `_alert` (lpn_file_reconnect_alert).
$synonymGroups = [
    ['btn', 'button'],
    ['note', 'notice'],
    ['desc', 'description'],
    ['label', 'lbl'],
];

$strays = [];
foreach ($synonymGroups as $group) {
    $counts = [];
    $members = [];
    foreach ($group as $word) {
        $hits = array_values(array_filter($keys, function ($k) use ($word) {
            return (bool) preg_match('/(^|_)' . $word . '$/', $k);
        }));
        if ($hits) { $counts[$word] = count($hits); $members[$word] = $hits; }
    }
    if (count($counts) < 2) continue;
    arsort($counts);
    $dominant = array_key_first($counts);
    foreach ($counts as $word => $n) {
        if ($word === $dominant) continue;
        foreach ($members[$word] as $k) {
            $strays[] = [$k, $word, $dominant, $counts[$dominant]];
        }
    }
}

// ---------------------------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------------------------
printf("Language-key hygiene — %d English keys\n\n", count($keys));

printf("1. RENDERED BY NOTHING: %d\n", count($dead));
if ($dead) {
    echo "   Each of these is maintained in 27 language files and displayed on no page. Deleting one\n";
    echo "   retires 27 strings; keeping it means every future sprint translates it again.\n";
    echo "   CHECK BEFORE DELETING. Two kinds listed here are NOT debt:\n";
    echo "     - held for a feature that is coming back: lpn_settings_emitter_exponent for Task 191,\n";
    echo "       the eight lpn_profile_* for Task 509.\n";
    echo "     - the CANONICAL WORDING other strings are checked against. lpn_geomap and lpn_xymap\n";
    echo "       are the two mode names; nothing prints them, and mode_name_check.php holds every\n";
    echo "       other string's prose to them. Deleting one breaks a check and lets one language\n";
    echo "       call the same mode two different things.\n\n";
    foreach ($dead as $k) { echo "   $k\n"; }
}
echo "\n";

printf("2. SUFFIX DRIFT: %d key(s) spell a suffix differently from their siblings\n", count($strays));
if ($strays) {
    echo "   Not cosmetic. A reader guessing a key name guesses the common form, so a stray is a key\n";
    echo "   that is hard to find and easy to duplicate by accident.\n";
    echo "   Fix with: php dev/scripts/rename_lang_key.php <old> <new> --apply\n";
    echo "   Only unambiguous groups are checked -- see the comment on \$synonymGroups for the ones\n";
    echo "   deliberately left to a human, and why an automated rename would be wrong for them.\n\n";
    foreach ($strays as [$k, $word, $dominant, $dn]) {
        printf("   %-40s _%s  ->  _%s   (the suite uses _%s %d times)\n", $k, $word, $dominant, $dominant, $dn);
    }
}
echo "\n";

if (!$dead && !$strays) {
    echo "Nothing to report.\n";
    exit(0);
}
echo "Advisory: this check does not fail a build. Both findings are judgement calls at the margin,\n";
echo "and a check that blocks on a judgement call is a check that gets muted. Pass --strict to\n";
echo "exit non-zero.\n";
exit($strict ? 1 : 0);
