<?php
/**
 * Renames a language key everywhere it exists, in one command.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. Tom, 2026-08-12, on finding `lpn_settings_scope_note` sitting next to
 * `lpn_settings_scope_calculator`: *"There has to be a way to refactor key names to be more
 * readable... I don't want to be building a maintenance debt due to neglected review."*
 *
 * The debt was not carelessness about names. It was that renaming one key meant a careful sweep of
 * 27 language files, every page and JS call site, the drift manifest and the exempt list — perhaps
 * forty edits, each of which fails SILENTLY if missed: a missed lang file leaves an orphan nobody
 * sees, a missed call site renders an empty string, and a missed manifest entry makes the drift
 * detector report a key that no longer exists. Nothing catches any of that. So the rational move
 * was always to leave the bad name, and bad names accumulated. **A rename being expensive is what
 * created the debt; making it one command is the fix.**
 *
 * WHAT IT DOES NOT TOUCH, deliberately: `dev/english-friction/*.json`. Those are a dated record of
 * what was decided about a key at the time, and rewriting history to match the present is how a log
 * stops being evidence. They are REPORTED instead, so a human can decide.
 *
 * Usage:
 *   php dev/scripts/rename_lang_key.php old_key new_key           # dry run, prints every edit
 *   php dev/scripts/rename_lang_key.php old_key new_key --apply
 */
require_once __DIR__ . '/lang_parse.inc.php';

$argvRest = array_values(array_filter(array_slice($argv, 1), function ($a) { return substr($a, 0, 2) !== '--'; }));
$apply = in_array('--apply', $argv, true);

if (count($argvRest) !== 2) {
    fwrite(STDERR, "Usage: php rename_lang_key.php <old_key> <new_key> [--apply]\n");
    exit(2);
}
[$old, $new] = $argvRest;
if (!preg_match('/^[a-z0-9_]+$/i', $old) || !preg_match('/^[a-z0-9_]+$/i', $new)) {
    fwrite(STDERR, "Keys must match [A-Za-z0-9_]+\n");
    exit(2);
}
if ($old === $new) { fwrite(STDERR, "Old and new key are the same.\n"); exit(2); }

$root    = dirname(__DIR__, 1) . '/..';   // engcalcs root
$libDir  = $root . '/lib';

// --- Pre-flight: the new name must be free, the old one must exist -------------------------------
$enSource = (string) file_get_contents($libDir . '/lang.ec.en.php');
$enKeys   = ecLangValues($enSource);
if (!array_key_exists($old, $enKeys)) {
    fwrite(STDERR, "No such key in lang.ec.en.php: $old\n");
    exit(1);
}
if (array_key_exists($new, $enKeys)) {
    fwrite(STDERR, "Refusing: $new already exists in lang.ec.en.php. A rename must never merge two keys.\n");
    exit(1);
}

// --- Which files may contain a reference ---------------------------------------------------------
$targets = [];
foreach (glob($libDir . '/lang.ec.*.php') as $f) { $targets[] = $f; }
foreach (glob($root . '/*.php') as $f)           { $targets[] = $f; }
foreach (glob($root . '/js/*.js') as $f)         { $targets[] = $f; }
foreach (glob($libDir . '/*.php') as $f)         { if (!in_array($f, $targets, true)) $targets[] = $f; }
// The drift manifest keys English strings by name; a rename it does not know about makes
// detect_english_drift.php report a REMOVED key and a NEW key for one unchanged string.
$targets[] = __DIR__ . '/english_string_hashes.json';
$targets[] = __DIR__ . '/translation_exempt_keys.json';
$targets[] = __DIR__ . '/translation_coverage.json';

// Word-boundary match so renaming `lpn_file_new` cannot touch `lpn_file_newer`. Covers every shape
// a key appears in across this codebase: $ec_lang['k'], $ec_lang_syn['k'], pc.k, "k": in JSON,
// and bare k: in a pageConfig object literal.
$pattern = '/(?<![A-Za-z0-9_])' . preg_quote($old, '/') . '(?![A-Za-z0-9_])/';

$edits = [];
foreach ($targets as $file) {
    if (!is_file($file)) continue;
    $content = (string) file_get_contents($file);
    $count = preg_match_all($pattern, $content, $ignored);
    if (!$count) continue;
    $edits[$file] = $count;
    if ($apply) {
        file_put_contents($file, preg_replace($pattern, $new, $content));
    }
}

// --- Report --------------------------------------------------------------------------------------
$total = array_sum($edits);
printf("%s  %s -> %s\n\n", $apply ? 'RENAMED' : 'DRY RUN (nothing written)', $old, $new);
if (!$edits) {
    echo "No occurrences found, which should be impossible given the pre-flight check above.\n";
    exit(1);
}
foreach ($edits as $file => $count) {
    printf("  %-52s %d\n", ltrim(str_replace($root, '', $file), '/'), $count);
}
printf("\n  %d occurrence(s) in %d file(s)\n", $total, count($edits));

// --- The deliberate exception ---------------------------------------------------------------------
$frictionHits = [];
foreach (glob(dirname(__DIR__) . '/english-friction/*.json') as $f) {
    $n = preg_match_all($pattern, (string) file_get_contents($f), $ignored);
    if ($n) { $frictionHits[basename($f)] = $n; }
}
if ($frictionHits) {
    echo "\nNOT changed, on purpose — dev/english-friction/ is a dated record of what was decided\n";
    echo "about a key at the time, and rewriting it to match the present makes it useless as\n";
    echo "evidence. Mention the rename in the entry's resolution if it matters:\n";
    foreach ($frictionHits as $f => $n) { printf("  %-52s %d\n", $f, $n); }
}

if (!$apply) {
    echo "\nRe-run with --apply to write these changes.\n";
    exit(0);
}

echo "\nNow run, in this order:\n";
echo "  php dev/scripts/lang_syntax_validate.php\n";
echo "  php dev/scripts/gloss_ref_check.php\n";
echo "  php dev/scripts/generate_translation_payloads.php && php dev/scripts/generate_translation_payloads.php --check\n";
exit(0);
