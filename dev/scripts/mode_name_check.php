<?php
/**
 * mode_name_check.php — one project mode, ONE name inside each language.
 *
 *   php dev/scripts/mode_name_check.php            # advisory listing
 *   php dev/scripts/mode_name_check.php --strict   # exit 1 on any disagreement
 *
 * The `lpn_` editor has two kinds of project, and about a dozen strings name them: the menu row
 * that converts one to the other, the four New project rows, the status messages, the gallery
 * card. A reader meets those names in several places and has to recognise the SAME name each time.
 *
 * **WHY THIS IS A SCRIPT AND NOT A LINE IN THE GLOSSARY.** It was a line in the glossary, and the
 * line was FALSE. `glossary.json`'s "project mode name" entry said lat/lon and XY are "carried
 * unchanged into every language" — while 10 of the 26 language files already translated
 * `lpn_geomap` (am, ar, de, fa, he, ru, sr, tr, ur, zh). During sprint 438 that false rule was
 * quoted back by several agents as a reason not to translate, and it could equally have been
 * quoted as a reason to leave one string literal in a file that translates all the others. Either
 * way one mode would end up with two names inside one language, which is the actual defect.
 *
 * So the rule is not "keep it English" and not "translate it". It is: **whatever this language
 * calls the mode in `lpn_geomap` / `lpn_xymap`, every other string that names the mode uses that
 * same rendering.** That is checkable, and unlike a sentence in a glossary it cannot go stale
 * silently — the key list below is DERIVED from the English, so a new string naming a mode is
 * picked up the day it is written.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */

$root = dirname(__DIR__, 2);
$strict = in_array('--strict', $argv, true);

function ec_mode_values(string $path): array {
    $out = array();
    if (!is_file($path)) { return $out; }
    $src = file_get_contents($path);
    if (preg_match_all("/\\\$ec_lang\['([^']+)'\]\s*=\s*'((?:[^'\\\\]|\\\\.)*)';/", $src, $m, PREG_SET_ORDER)) {
        foreach ($m as $hit) { $out[$hit[1]] = str_replace(array("\\'", '\\\\'), array("'", '\\'), $hit[2]); }
    }
    return $out;
}

$en = ec_mode_values($root . '/lib/lang.ec.en.php');
if (!isset($en['lpn_geomap'], $en['lpn_xymap'])) {
    fwrite(STDERR, "lpn_geomap / lpn_xymap missing from the English file.\n");
    exit(1);
}

/* THE KEY LIST IS DERIVED, NEVER TYPED. Any English string containing the mode's English name is a
 * string that names the mode. `XY` is matched on a word boundary so it cannot hit a stray pair of
 * letters inside another word. The two anchor keys are excluded: they ARE the rendering. */
$modes = array(
    'geo' => array('anchor' => 'lpn_geomap', 'needle' => $en['lpn_geomap'], 'regex' => null),
    'xy'  => array('anchor' => 'lpn_xymap',  'needle' => $en['lpn_xymap'],  'regex' => '/\bXY\b/'),
);
foreach ($modes as $id => &$m) {
    $m['keys'] = array();
    foreach ($en as $k => $v) {
        if ($k === $modes['geo']['anchor'] || $k === $modes['xy']['anchor']) { continue; }
        $hit = $m['regex'] ? preg_match($m['regex'], $v) : (strpos($v, $m['needle']) !== false);
        if ($hit) { $m['keys'][] = $k; }
    }
}
unset($m);

$findings = array();
$langs = array();
foreach (glob($root . '/lib/lang.ec.*.php') as $path) {
    if (preg_match('/lang\.ec\.([a-z]{2})\.php$/', $path, $mm) && $mm[1] !== 'en') { $langs[$mm[1]] = $path; }
}
ksort($langs);

foreach ($langs as $lang => $path) {
    $vals = ec_mode_values($path);
    foreach ($modes as $id => $m) {
        $own = isset($vals[$m['anchor']]) ? $vals[$m['anchor']] : null;
        if ($own === null || $own === '') { continue; }   // not translated yet is not a disagreement
        foreach ($m['keys'] as $k) {
            if (!isset($vals[$k]) || $vals[$k] === '') { continue; }   // absent falls back to English
            /* CASE-INSENSITIVE, because a capital letter at the start of a sentence is not a second
             * name. Turkish's `enlem/boylam` opens `Enlem/boylama dönüştür…` in sentence case and
             * takes a dative suffix; the suffix is a substring match already, the capital was not,
             * and reporting that as one mode with two names sent a reader to rewrite good Turkish. */
            if (mb_stripos($vals[$k], $own, 0, 'UTF-8') !== false) { continue; }
            /* A language that keeps the English name gets the English spelling everywhere, which the
             * test above already accepts. This only fires when the anchor and the string disagree. */
            $findings[] = array($lang, $k, $own, $vals[$k]);
        }
    }
}

if (!$findings) {
    echo 'mode names agree -- ' . count($langs) . " languages, "
        . (count($modes['geo']['keys']) + count($modes['xy']['keys'])) . " derived strings checked\n";
    exit(0);
}
echo "ONE MODE, TWO NAMES (" . count($findings) . "):\n";
foreach ($findings as $f) {
    echo "  {$f[0]}  {$f[1]}\n";
    echo "      this language calls the mode: {$f[2]}\n";
    echo "      but this string says:         " . mb_substr($f[3], 0, 100) . "\n";
}
echo "\nWhatever a language calls a project mode in lpn_geomap / lpn_xymap, every string that names\n";
echo "the mode must use that same rendering. Either is fine -- 10 of 26 translate it, 16 keep it --\n";
echo "but a reader must meet ONE name. Fix the string, or fix the anchor if the anchor is the wrong\n";
echo "one. This list is derived from the English, so a new mode-naming string joins it by itself.\n";
exit($strict ? 1 : 0);
