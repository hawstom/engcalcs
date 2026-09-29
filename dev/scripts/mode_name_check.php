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

/* WHICH ENGLISH STRINGS NAME A MODE. Only `lpn_` keys: the two modes exist in the looped-network
 * editor and nowhere else, so 'local' in Hazen-Williams or Irrigation Pressure prose is not a mode.
 * And the suite's loss term "Minor (local) loss" (CLAUDE.md, Labels) is cut out before the test,
 * because its 'local' is the loss, not the grid: sprint 2026-09-28-delta translated the anchors in
 * every language for the first time and that one phrase turned into 70 false findings. */
function ec_mode_names_mode(string $key, string $value, array $mode): bool {
    if (strpos($key, 'lpn_') !== 0) { return false; }
    $value = preg_replace('/\bminor \(local\)/i', '', $value);
    return $mode['regex'] ? (bool)preg_match($mode['regex'], $value) : (strpos($value, $mode['needle']) !== false);
}

/* DOES A TRANSLATED STRING USE THE ANCHOR'S NAME. Same ROOT, not same characters: a case ending,
 * a gender, a plural, a class concord or a negation is not a second name (bg `географски привързана`
 * names a project `географски привързан`; sw `za ndani` becomes `ya ndani`). So every word of the
 * anchor longer than three characters must appear with at most its last one (5-6 characters), two
 * (7-9) or three (10+) characters trimmed (cs `georeferencovaný` / `Bez georeferencování`); words of three characters or fewer are concords and particles and
 * are skipped, unless the anchor has nothing else (`xy`). A different word for the same idea still
 * fails, which is the defect: am `ጂኦሪፈረንስ` (transliterated) against the anchor's `ጂዮ-ማጣቀሻ`. */
function ec_mode_stems(string $anchor): array {
    $words = preg_split('/\s+/u', trim($anchor), -1, PREG_SPLIT_NO_EMPTY);
    $stems = array();
    foreach ($words as $w) {
        $n = mb_strlen($w, 'UTF-8');
        if ($n <= 3) { continue; }
        $cut = $n >= 10 ? 3 : ($n >= 7 ? 2 : ($n >= 5 ? 1 : 0));
        $stems[] = mb_substr($w, 0, $n - $cut, 'UTF-8');
    }
    return $stems ? $stems : $words;
}
function ec_mode_uses_anchor(string $value, string $anchor): bool {
    /* CASE-INSENSITIVE, because a capital letter at the start of a sentence is not a second
     * name. Turkish's `Coğrafi referanslı` opens a sentence capitalised and closes one in lower case. */
    foreach (ec_mode_stems($anchor) as $stem) {
        if (mb_stripos($value, $stem, 0, 'UTF-8') === false) { return false; }
    }
    return true;
}

if (in_array('--selftest', $argv, true)) {
    $geo = array('needle' => 'georeferenced', 'regex' => null);
    $xy  = array('needle' => 'local', 'regex' => '/\blocal\b/i');
    $cases = array(
        // [what, got, want]
        array('minor (local) loss is not the mode', ec_mode_names_mode('lpn_field_km', 'Minor (local) loss coefficient, k', $xy), false),
        array('non-lpn key is not the mode',        ec_mode_names_mode('ip_notes_2_def', 'the actual local pressure', $xy), false),
        array('local schematic names the mode',     ec_mode_names_mode('lpn_new_coordsys_local', 'Local, schematic, or custom', $xy), true),
        array('mode word beside a minor loss',      ec_mode_names_mode('lpn_x', 'Minor (local) loss in a local project', $xy), true),
        array('not georeferenced names the mode',   ec_mode_names_mode('lpn_crs_none', 'Not georeferenced', $geo), true),
        array('locally is not local',               ec_mode_names_mode('lpn_x', 'stored locally', $xy), false),
        array('bg gender ending',                   ec_mode_uses_anchor('Този проект вече е географски привързан', 'географски привързана'), true),
        array('cs noun of the same root',           ec_mode_uses_anchor('Bez georeferencování', 'georeferencovaný'), true),
        array('sw concord',                         ec_mode_uses_anchor('Marejeleo (ya ndani)', 'za ndani'), true),
        array('tr sentence case',                   ec_mode_uses_anchor('Coğrafi referanslı değil', 'coğrafi referanslı'), true),
        array('am two roots',                       ec_mode_uses_anchor('ጂኦሪፈረንስ ያልተደረገ', 'ጂዮ-ማጣቀሻ ያለው'), false),
        array('hi transliteration vs native',       ec_mode_uses_anchor('जियोरेफ़रेंस नहीं किया गया', 'भू-संदर्भित'), false),
        array('xy abbreviation vs a word',          ec_mode_uses_anchor('Lokalno, shematsko', 'xy'), false),
        array('a whole different word',             ec_mode_uses_anchor('Без географической привязки', 'привязан к местности'), false),
    );
    $bad = 0;
    foreach ($cases as $c) {
        if ($c[1] !== $c[2]) { $bad++; echo "FAIL  {$c[0]}\n"; }
    }
    echo $bad ? "mode_name_check selftest: $bad of " . count($cases) . " failed\n"
              : 'mode_name_check selftest: ' . count($cases) . " cases pass\n";
    exit($bad ? 1 : 0);
}

$en = ec_mode_values($root . '/lib/lang.ec.en.php');
if (!isset($en['lpn_geomap'], $en['lpn_xymap'])) {
    fwrite(STDERR, "lpn_geomap / lpn_xymap missing from the English file.\n");
    exit(1);
}

/* THE KEY LIST IS DERIVED, NEVER TYPED. Any `lpn_` English string containing the mode's English
 * name is a string that names the mode. The local noun is matched on a word boundary so it cannot
 * hit a stray longer word. The two anchor keys are excluded: they ARE the rendering. */
$modes = array(
    'geo' => array('anchor' => 'lpn_geomap', 'needle' => $en['lpn_geomap'], 'regex' => null),
    // On a word boundary, case-insensitive, so the short noun ('local') cannot hit 'locally' or
    // 'location'. Derived from the anchor, like the needle, so a new noun needs no edit here.
    'xy'  => array('anchor' => 'lpn_xymap',  'needle' => $en['lpn_xymap'],
                   'regex' => '/\b' . preg_quote($en['lpn_xymap'], '/') . '\b/i'),
);
foreach ($modes as $id => &$m) {
    $m['keys'] = array();
    foreach ($en as $k => $v) {
        if ($k === $modes['geo']['anchor'] || $k === $modes['xy']['anchor']) { continue; }
        if (ec_mode_names_mode($k, $v, $m)) { $m['keys'][] = $k; }
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
            if (ec_mode_uses_anchor($vals[$k], $own)) { continue; }
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
echo "the mode must use that same root word (endings may differ). Translated or kept in English, a\n";
echo "reader must meet ONE name. Fix the string, or fix the anchor if the anchor is the wrong\n";
echo "one. This list is derived from the English, so a new mode-naming string joins it by itself.\n";
exit($strict ? 1 : 0);
