<?php
/**
 * Deletes a language key everywhere it exists, in one command.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. `rename_lang_key.php` was written because a rename was ~40 silent edits and
 * therefore never happened. A DELETION is the same 40 edits with the same silence, and the same
 * consequence: a key left in 26 translated files is 26 strings nobody can reach and nobody can
 * find, and a manifest entry left behind makes `detect_english_drift.php` report a key that no
 * longer exists. CLAUDE.md's own rule is "never hand-edit 27 files", and until this file there was
 * no other route for a delete -- so the deletions this project does make were being done by hand.
 *
 * WHAT IT REFUSES. Anything still SUPPLIED or READ. The whole risk of a delete is removing a key
 * something renders, which fails as an empty string in all 27 languages with no warning, so the
 * pre-flight walks every page and every `js/*.js` for a live reference and stops on the first one.
 * A `pageConfig` supply line in a page counts as a reference and is REPORTED with its file and
 * line, because deleting the key without deleting that line is a PHP notice on every page load.
 * Pass `--with-supply` to have those supply lines removed as part of the same pass; that is the
 * normal shape of a dead-key delete, where the only thing left holding the key is the bridge that
 * hands it to a reader that does not exist.
 *
 * WHAT IT DOES NOT TOUCH, exactly as the rename does not: `dev/english-friction/*.json`, a dated
 * record of what was decided at the time. Reported, never rewritten.
 *
 * Usage:
 *   php dev/scripts/delete_lang_key.php key                       # dry run, prints every edit
 *   php dev/scripts/delete_lang_key.php key --with-supply --apply
 */
require_once __DIR__ . '/lang_parse.inc.php';

$argvRest = array_values(array_filter(array_slice($argv, 1), function ($a) { return substr($a, 0, 2) !== '--'; }));
$apply       = in_array('--apply', $argv, true);
$withSupply  = in_array('--with-supply', $argv, true);

if (count($argvRest) < 1) {
    fwrite(STDERR, "Usage: php delete_lang_key.php <key> [--with-supply] [--apply]\n");
    exit(2);
}

$root   = dirname(__DIR__, 2);
$libDir = $root . '/lib';

$enSource = (string) file_get_contents($libDir . '/lang.ec.en.php');
$enKeys   = ecLangValues($enSource);

$keys = [];
foreach ($argvRest as $k) {
    if (!preg_match('/^[a-z0-9_]+$/i', $k)) { fwrite(STDERR, "Keys must match [A-Za-z0-9_]+: $k\n"); exit(2); }
    if (!array_key_exists($k, $enKeys)) { fwrite(STDERR, "No such key in lang.ec.en.php: $k\n"); exit(1); }
    $keys[] = $k;
}

// --- Pre-flight: nothing may still READ it -------------------------------------------------------
// A page's own `$ec_lang['k']` read and a `js/` `pc.k` read are both fatal to a delete. The
// pageConfig SUPPLY line is a reference too, but it is the one shape a delete is expected to
// remove, so it is separated out rather than treated as a blocker.
$supplyOf = [];   // key => [ [file, lineNo, lineText], ... ]
$liveOf   = [];   // key => [ "file:line  text", ... ]
$scan = [];
foreach (glob($root . '/*.php') as $f)   { $scan[] = $f; }
foreach (glob($root . '/js/*.js') as $f) { $scan[] = $f; }
foreach (glob($libDir . '/*.php') as $f) { if (strpos(basename($f), 'lang.ec.') !== 0) { $scan[] = $f; } }

foreach ($keys as $key) {
    $supplyOf[$key] = [];
    $liveOf[$key]   = [];
    $pattern = '/(?<![A-Za-z0-9_])' . preg_quote($key, '/') . '(?![A-Za-z0-9_])/';
    foreach ($scan as $file) {
        $lines = explode("\n", (string) file_get_contents($file));
        foreach ($lines as $n => $line) {
            if (!preg_match($pattern, $line)) { continue; }
            // The pageConfig bridge, in the two shapes this suite writes it:
            //   lpn_x: <?= json_encode($ec_lang['lpn_x']) ? >,
            // A line that both supplies and does nothing else is a supply line.
            if (preg_match('/^\s*' . preg_quote($key, '/') . '\s*:\s*<\?=\s*json_encode\(\$ec_lang\[\'' . preg_quote($key, '/') . '\'\]\)\s*\?>\s*,?\s*$/', $line)) {
                $supplyOf[$key][] = [$file, $n, $line];
                continue;
            }
            $liveOf[$key][] = ltrim(str_replace($root, '', $file), '/') . ':' . ($n + 1) . '  ' . trim($line);
        }
    }
}

$blocked = false;
foreach ($keys as $key) {
    if ($liveOf[$key]) {
        $blocked = true;
        echo "REFUSING $key -- something still reads it:\n";
        foreach ($liveOf[$key] as $hit) { echo "  $hit\n"; }
    }
}
if ($blocked) {
    echo "\nA key something renders must not be deleted: the render becomes the empty string in all\n";
    echo "27 languages with no warning. Remove the reader first, or keep the key.\n";
    exit(1);
}

// --- What gets rewritten -------------------------------------------------------------------------
$langFiles = glob($libDir . '/lang.ec.*.php');
$jsonFiles = [
    __DIR__ . '/english_string_hashes.json',
    __DIR__ . '/translation_exempt_keys.json',
    __DIR__ . '/translation_coverage.json',
    dirname(__DIR__) . '/english-key-rulings.json',
];

$edits = [];
function noteEdit(array &$edits, $file, $n) { $edits[$file] = ($edits[$file] ?? 0) + $n; }

foreach ($keys as $key) {
    $qk = preg_quote($key, '/');
    // 1. The assignment line itself, in every language file. Whole line, including its newline;
    //    a comment ABOVE it is left alone, because a comment may belong to the block rather than
    //    to the one key and this script cannot tell which.
    foreach ($langFiles as $file) {
        $content = (string) file_get_contents($file);
        $out = preg_replace('/^\$ec_lang(?:_syn)?\[\'' . $qk . '\'\]\s*=.*\R/m', '', $content, -1, $n);
        if ($n) { noteEdit($edits, $file, $n); if ($apply) { file_put_contents($file, $out); } }
    }
    // 2. The JSON records that key English strings by name.
    foreach ($jsonFiles as $file) {
        if (!is_file($file)) { continue; }
        $content = (string) file_get_contents($file);
        $data = json_decode($content, true);
        if (!is_array($data)) { continue; }
        $n = 0;
        $data = jsonDropKey($data, $key, $n);
        if ($n) {
            noteEdit($edits, $file, $n);
            if ($apply) {
                file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
            }
        }
    }
    // 3. The pageConfig supply lines, only when asked.
    if ($withSupply) {
        foreach ($supplyOf[$key] as $hit) {
            [$file, $n, $line] = $hit;
            $content = (string) file_get_contents($file);
            $out = str_replace($line . "\n", '', $content, $count);
            if ($count) { noteEdit($edits, $file, $count); if ($apply) { file_put_contents($file, $out); } }
        }
    }
}

/** Removes every occurrence of $key as an object key, at any depth, counting as it goes. */
function jsonDropKey($node, $key, &$n)
{
    if (!is_array($node)) { return $node; }
    $out = [];
    foreach ($node as $k => $v) {
        if ($k === $key) { $n++; continue; }
        $out[$k] = jsonDropKey($v, $key, $n);
    }
    return $out;
}

// --- Report --------------------------------------------------------------------------------------
printf("%s  delete %s\n\n", $apply ? 'DELETED' : 'DRY RUN (nothing written)', implode(', ', $keys));
if (!$edits) { echo "No occurrences found.\n"; exit(1); }
foreach ($edits as $file => $count) {
    printf("  %-52s %d\n", ltrim(str_replace($root, '', $file), '/'), $count);
}
printf("\n  %d line(s)/entry(ies) in %d file(s)\n", array_sum($edits), count($edits));

foreach ($keys as $key) {
    if ($supplyOf[$key] && !$withSupply) {
        echo "\nSTILL SUPPLIED to pageConfig, and left in place because --with-supply was not given:\n";
        foreach ($supplyOf[$key] as $hit) {
            printf("  %s:%d\n", ltrim(str_replace($root, '', $hit[0]), '/'), $hit[1] + 1);
        }
        echo "A supply line for a key that no longer exists is a PHP notice on every page load.\n";
    }
}

$frictionHits = [];
foreach ($keys as $key) {
    $pattern = '/(?<![A-Za-z0-9_])' . preg_quote($key, '/') . '(?![A-Za-z0-9_])/';
    foreach (glob(dirname(__DIR__) . '/english-friction/*.json') as $f) {
        $n = preg_match_all($pattern, (string) file_get_contents($f), $ignored);
        if ($n) { $frictionHits[basename($f)] = ($frictionHits[basename($f)] ?? 0) + $n; }
    }
}
if ($frictionHits) {
    echo "\nNOT changed, on purpose -- dev/english-friction/ is a dated record of what was decided\n";
    echo "about a key at the time:\n";
    foreach ($frictionHits as $f => $n) { printf("  %-52s %d\n", $f, $n); }
}

if (!$apply) { echo "\nRe-run with --apply to write these changes.\n"; exit(0); }

echo "\nNow run, in this order:\n";
echo "  php dev/scripts/lang_syntax_validate.php\n";
echo "  php dev/scripts/generate_translation_payloads.php\n";
exit(0);
