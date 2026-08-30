<?php
/**
 * language_declaration_check.php — the language registry and the language files agree. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. Two lists have to match and nothing tied them together: the 27 files
 * `lib/lang.ec.??.php`, and `$all_language_settings` in `lib/Language.Settings.php`, which is the
 * ONLY registry — `chooseLanguage()` accepts a code iff it is a key of that array, and
 * `generate_sitemap.php`, `Menus.lib.php` and `HeadersFooters.lib.php` all iterate it. Either half
 * can be added without the other, and each failure is silent in its own way:
 *
 *   - **DECLARED WITH NO FILE.** `chooseLanguage()` hands the code back, `lib/base.inc.php`
 *     requires a file that is not there, and the visitor whose browser asked for that language
 *     gets a fatal — the one visitor least able to report it. It is also advertised: the language
 *     menu and every `<link rel="alternate" hreflang>` are built from this same array, so the
 *     broken code is offered to search engines too.
 *   - **A FILE NOBODY DECLARED.** The opposite, and quieter: the translation exists, someone was
 *     paid to write it, and it is unreachable. `?lang=xx` is refused, no menu row names it, and
 *     nothing anywhere says why. A whole language can sit in the repository doing nothing.
 *   - **NO QUALITY WEIGHT.** The weight is multiplied against the browser's own q-value in
 *     Accept-Language negotiation. Absent, it reads as zero and the language effectively never
 *     wins a negotiation — the translation is present, declared, and still never shown.
 *
 * WHAT IT ALSO ASSERTS, and why each is here rather than in prose. `QUALITY` must be a number in
 * (0, 1]: CLAUDE.md requires an honest current estimate of DEFECT RISK, and a missing or
 * out-of-range one is not an estimate. English must be exactly 1. `LANGNAME` must be present and
 * non-empty, because it is the string a person picks the language BY — an empty one produces a
 * menu row that cannot be clicked with any confidence, in the one language its reader can read.
 *
 * WHAT IT DOES NOT ASSERT. Not the tier values themselves (0.95 / 0.85 / 0.65). Which tier a
 * language is in is a judgement about verification that was actually done, `update_quality_score.php`
 * is the way to change one, and a check pinning the set would fail the next honest estimate.
 *
 * Usage:
 *   php dev/scripts/language_declaration_check.php
 *
 * Exit 0 = the two lists agree and every declaration is complete. Exit 1 = they have drifted.
 */

/**
 * Findings for one registry against one set of language-file codes. Pure, for the selftest.
 *
 * @param array<string,array<string,mixed>> $declared $all_language_settings.
 * @param array<int,string>                 $files    Codes found as lib/lang.ec.<code>.php.
 * @return array<int,string> Human-readable findings; empty means the two agree.
 */
function ecLanguageDeclarationFindings(array $declared, array $files): array
{
    $out = [];
    $files = array_values(array_unique($files));
    sort($files);

    foreach (array_diff(array_keys($declared), $files) as $code) {
        $out[] = "'$code' is declared in \$all_language_settings but there is no "
            . "lib/lang.ec.$code.php. chooseLanguage() will hand that code back to a visitor whose "
            . 'browser asks for it, base.inc.php will require a file that does not exist, and the '
            . 'language menu and the hreflang alternates already advertise it. Add the file, or '
            . 'remove the declaration.';
    }

    foreach (array_diff($files, array_keys($declared)) as $code) {
        $out[] = "lib/lang.ec.$code.php exists but '$code' is not declared in "
            . '$all_language_settings. That array is the only registry there is, so the language '
            . 'is unreachable: ?lang= refuses it, no menu row offers it, no hreflang names it, and '
            . 'the sitemap skips it. Somebody wrote that translation. Declare it in '
            . 'lib/Language.Settings.php with a QUALITY weight and a LANGNAME, or say in that file '
            . 'why it is deliberately parked.';
    }

    foreach ($declared as $code => $settings) {
        if (!is_array($settings)) {
            $out[] = "'$code' is declared as something other than an array of settings.";
            continue;
        }
        if (!array_key_exists('QUALITY', $settings)) {
            $out[] = "'$code' has no QUALITY weight. It is multiplied against the browser's own "
                . 'q-value when Accept-Language is negotiated, so an absent one reads as zero and '
                . 'the language can never win -- translated, declared, and never shown. Set it with '
                . "php dev/scripts/update_quality_score.php $code <0-1>, never by hand.";
        } elseif (!is_numeric($settings['QUALITY'])
            || (float) $settings['QUALITY'] <= 0 || (float) $settings['QUALITY'] > 1) {
            $out[] = "'$code' has QUALITY '" . (string) $settings['QUALITY'] . "', which is not a "
                . 'number in (0, 1]. It must carry an honest current estimate of defect risk: 1.0 '
                . 'English, 0.95 a verified native review on file, 0.85 AI plus independent '
                . 'back-translation, 0.65 the low-resource tier.';
        } elseif ($code === 'en' && (float) $settings['QUALITY'] !== 1.0) {
            $out[] = "English is declared at QUALITY " . (string) $settings['QUALITY'] . '. English '
                . 'is the source language and every other value is an estimate of distance from '
                . 'it, so it is 1 by definition.';
        }
        if (!isset($settings['LANGNAME']) || trim((string) $settings['LANGNAME']) === '') {
            $out[] = "'$code' has no LANGNAME. That is the string a person picks this language BY, "
                . 'in the language menu, written in the language itself -- the one label a reader '
                . 'who cannot read the current page still has to be able to recognise.';
        }
    }

    return $out;
}

if (defined('LANGUAGE_DECLARATION_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

// Language.Settings.php refuses to be included directly by checking SCRIPT_NAME against its own
// basename; on the CLI that is this file's name, so the guard passes and the include is safe.
$all_language_settings = [];
require $root . '/lib/Language.Settings.php';

$files = [];
foreach (glob($root . '/lib/lang.ec.*.php') as $file) {
    if (preg_match('/lang\.ec\.([a-z]{2})\.php$/', $file, $m)) {
        $files[] = $m[1];
    } else {
        $files[] = basename($file); // will not match any declaration, and says so by name
    }
}

$problems = ecLanguageDeclarationFindings($all_language_settings, $files);

if ($problems) {
    echo 'Language declarations: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "lib/Language.Settings.php's \$all_language_settings is the ONLY registry of languages\n";
    echo "this suite has -- chooseLanguage() accepts a code iff it is a key of that array, and the\n";
    echo "language menu, the hreflang alternates and the sitemap are all built by iterating it.\n";
    echo "It must list exactly the lib/lang.ec.??.php files that exist, no more and no fewer.\n";
    exit(1);
}

echo count($all_language_settings) . " languages declared, " . count($files) . " language files,\n";
echo "the two lists agree; every declaration carries a QUALITY weight and a LANGNAME.\n";
exit(0);
