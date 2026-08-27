<?php
/**
 * new_english_keys.php — English keys that exist in NO other language file.
 *
 * **WHY THIS EXISTS.** Tom asked, 2026-08-26: *"19 new keys are listed: Where?"* They were not.
 * Four batches of new English strings had been reported to him in conversation with the words
 * "listed in the task for your ruling", and exactly one batch had actually been written into
 * `dev/ROADMAP.md`. The other three existed only in an agent's report, which he never sees.
 *
 * A promise to paste a list is a promise somebody has to keep every time. **A key that is in
 * `lang.ec.en.php` and in none of the other 26 files is, by construction, a string nobody has
 * ruled on and no sprint has carried** — so the list can be derived instead of remembered, and
 * this script derives it.
 *
 * That is CLAUDE.md's own argument applied to my own failure: a rule a machine enforces is worth
 * roughly ten a human must remember.
 *
 * Usage:
 *   php dev/scripts/new_english_keys.php            # grouped by prefix, with values
 *   php dev/scripts/new_english_keys.php --names    # names only, one per line
 *   php dev/scripts/new_english_keys.php --prefix=lpn_find
 *
 * ADVISORY. It never exits non-zero: a new English key is the correct state between writing a
 * feature and translating it (CLAUDE.md — an ABSENT key is the correct untranslated state), so
 * this is a worklist, never a verdict.
 */

$root = dirname(__DIR__, 2);
$argvAll = $argv;
$namesOnly = in_array('--names', $argvAll, true);
$prefix = '';
foreach ($argvAll as $a) {
    if (strpos($a, '--prefix=') === 0) { $prefix = substr($a, 9); }
}

$ec_lang = array(); $ec_lang_syn = array();
require $root . '/lib/lang.ec.en.php';
$english = $ec_lang;

$others = glob($root . '/lib/lang.ec.*.php');
$seen = array();
$langCount = 0;
foreach ($others as $file) {
    if (basename($file) === 'lang.ec.en.php') { continue; }   // basename, not substr: 'ec.en.php' is nine characters and an off-by-one here silently counts English as one of the others, which makes the answer always zero.
    $ec_lang = array(); $ec_lang_syn = array();
    require $file;
    $langCount++;
    foreach (array_keys($ec_lang) as $k) { $seen[$k] = true; }
}

$new = array();
foreach ($english as $k => $v) {
    if (isset($seen[$k])) { continue; }
    if ($prefix !== '' && strpos($k, $prefix) !== 0) { continue; }
    $new[$k] = $v;
}
ksort($new);

if ($namesOnly) {
    foreach (array_keys($new) as $k) { echo $k, "\n"; }
    exit(0);
}

echo "English keys that no other language file has yet — " . count($new) . " of " . count($english),
     ", against $langCount other language files.\n";
echo "These are the strings awaiting Tom's wording ruling and the next sprint. An absent key is\n";
echo "the correct untranslated state, so this is a worklist and never a failure.\n\n";

if (!$new) { echo "None. Every English key is present in at least one other language.\n"; exit(0); }

$groups = array();
foreach ($new as $k => $v) {
    $p = (strpos($k, '_') !== false) ? substr($k, 0, strpos($k, '_')) : $k;
    $groups[$p][$k] = $v;
}
ksort($groups);
foreach ($groups as $p => $keys) {
    echo "== $p" . "_  (" . count($keys) . ")\n";
    foreach ($keys as $k => $v) {
        $one = preg_replace('/\s+/', ' ', $v);
        if (strlen($one) > 96) { $one = substr($one, 0, 93) . '...'; }
        printf("   %-34s %s\n", $k, $one);
    }
    echo "\n";
}
exit(0);
