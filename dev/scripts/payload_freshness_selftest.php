<?php
/**
 * payload_freshness_selftest.php — pin BOTH directions of
 * `generate_translation_payloads.php --check`. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. The freshness gate is blocking and it is the last thing standing between a
 * 26-agent sprint and an old delta, so it has to be wrong in neither direction — and it has
 * already been wrong in one of them. While it judged by mtime it reported all 26 payloads stale in
 * any freshly checked-out tree, because `git pull` does not preserve mtimes and neither does a
 * worktree checkout. Four subagents in one session hit that false alarm and each had to reason
 * about whether the failure was theirs. The fix (comparing CONTENT) is invisible from the outside:
 * a check that has quietly stopped noticing real staleness prints the same FRESH as a working one.
 *
 * So both directions are fixtures:
 *   1. a tree where the payloads were just generated is FRESH;
 *   2. TOUCHING every input without changing a byte is still FRESH — the regression that produced
 *      this file;
 *   3. a payload whose content no longer matches is STALE;
 *   4. a missing payload is STALE.
 *   6. the payload's per-key shape: syn commentary as key_notes, reworded keys in
 *      keys_to_translate, tip/label pairs, and one batch-scoped glossary.
 *
 * It works in a temporary output directory throughout and never touches
 * `dev/translation_payloads/`, which only the orchestrator regenerates. It does update the mtime of
 * `lib/lang.ec.en.php` for fixture 2, which is the point of that fixture and which git does not
 * record.
 *
 *   php dev/scripts/payload_freshness_selftest.php
 */

$gen = __DIR__ . '/generate_translation_payloads.php';
$tmp = sys_get_temp_dir() . '/ec_payload_selftest_' . getmypid();
@mkdir($tmp, 0755, true);

$fail = 0;

/** Run the generator or its check against the temp directory, returning [exitCode, output]. */
$run = function (array $args) use ($gen, $tmp) {
    $cmd = escapeshellcmd(PHP_BINARY) . ' ' . escapeshellarg($gen) . ' ' . escapeshellarg($tmp);
    foreach ($args as $a) { $cmd .= ' ' . escapeshellarg($a); }
    exec($cmd . ' 2>&1', $out, $code);
    return [$code, implode("\n", $out)];
};

$expect = function ($want, $got, $shape, $detail = '') use (&$fail) {
    if ($want === $got) { return; }
    $fail++;
    printf("FAIL  expected exit %d, got %d  (%s)\n%s\n\n", $want, $got, $shape, $detail);
};

// Generate a known-good set to compare against.
[$code, $out] = $run([]);
$expect(0, $code, 'the generator itself must succeed before anything here means anything', $out);

$payloads = glob($tmp . '/payload_*.json');
if (count($payloads) < 20) {
    printf("FAIL  the generator wrote only %d payloads into the temp directory\n", count($payloads));
    $fail++;
}

// 1. Freshly generated is FRESH.
[$code, $out] = $run(['--check']);
$expect(0, $code, 'FIXTURE 1: payloads just generated are fresh', $out);

// 2. THE REGRESSION. Every input touched, not one byte changed — still FRESH.
$inputs = [
    __DIR__ . '/../../lib/lang.ec.en.php',
    __DIR__ . '/glossary.json',
    __DIR__ . '/../translation-process.md',
    $gen,
];
$now = time() + 5;
foreach ($inputs as $f) { @touch($f, $now); }
[$code, $out] = $run(['--check']);
$expect(0, $code, 'FIXTURE 2: an input TOUCHED but unchanged is not stale — the false alarm', $out);
foreach ($inputs as $f) { @touch($f); }

// 3. A payload whose content differs is STALE, however new its mtime.
$victim = $payloads[0];
$original = file_get_contents($victim);
file_put_contents($victim, str_replace('"language"', '"languagex"', $original, $n));
if ($n === 0) { $fail++; echo "FAIL  could not mutate a payload for fixture 3\n"; }
@touch($victim, time() + 3600);
[$code, $out] = $run(['--check']);
$expect(1, $code, 'FIXTURE 3: content that no longer matches is stale even with a future mtime', $out);
if (strpos($out, basename($victim)) === false) {
    $fail++;
    printf("FAIL  the stale report did not name the file that differs (%s)\n%s\n", basename($victim), $out);
}
file_put_contents($victim, $original);

// 4. A missing payload is STALE.
unlink($victim);
[$code, $out] = $run(['--check']);
$expect(1, $code, 'FIXTURE 4: a missing payload is stale', $out);
file_put_contents($victim, $original);

// 5. And restoring it returns to FRESH, so fixtures 3 and 4 proved something about the payload
//    rather than about the check having got stuck.
[$code, $out] = $run(['--check']);
$expect(0, $code, 'FIXTURE 5: restoring the file returns the verdict to fresh', $out);

// 6. THE SHAPE a translator reads (syn notes, reworded keys, tip pairs, only the glossary terms a batch uses).
//    Built for one language with --as-changed, so it holds whether or not today's delta is empty.
//    Each assertion is a note that used to be lost on the way to the translator.
foreach (glob($tmp . '/*.json') as $f) { unlink($f); }
$probe = ['mi_station', 'lpn_settings_text_halo', 'lpn_settings_text_halo_tip', 'or_head'];
[$code, $out] = $run(['--lang=am', '--as-changed=' . implode(',', $probe)]);
$expect(0, $code, 'FIXTURE 6: the generator builds a probe payload with --as-changed', $out);
$p = json_decode((string)@file_get_contents($tmp . '/payload_am.json'), true);
$shape = function ($ok, $what) use (&$fail) {
    if ($ok) { return; }
    $fail++;
    echo "FAIL  FIXTURE 6 shape: {$what}\n";
};
if (!is_array($p)) {
    $shape(false, 'payload_am.json was not written or is not JSON');
} else {
    foreach ($probe as $k) {
        $shape(isset($p['keys_to_translate'][$k]), "{$k} is in keys_to_translate");
    }
    $shape(($p['key_context']['mi_station']['reason'] ?? '') === 'english_changed'
        && ($p['key_context']['mi_station']['current_value'] ?? '') !== '',
        'a reworded key arrives with reason english_changed and its current_value');
    $notes = $p['key_notes']['mi_station'] ?? [];
    $starts = function (array $list, string $prefix) {
        foreach ($list as $n) { if (strpos((string)$n, $prefix) === 0) { return true; } }
        return false;
    };
    // SUGGESTIONS ONLY, NO PROHIBITIONS (Tom, 2026-10-16): an avoid: tag and a glossary avoid list stay unsent.
    $shape(strpos((string)($p['glossary'] ?? ''), 'DO NOT') === false, 'the glossary carries no DO NOT line');
    $shape($starts($notes, 'Layout (column heading): '), 'a Layout line reaches key_notes as its full instruction');
    $shape(strpos((string)($p['key_plain']['mi_station'] ?? ''), 'Station, chainage, or distance') === 0,
        'the Plain line of dev/plain-sentences.md reaches key_plain');
    $shape(!isset($p['key_notes']['or_head']), 'a key with no entry in dev/plain-sentences.md gets no key note');
    $shape(strpos((string)($p['glossary'] ?? ''), "\n    English: head (") !== false, 'a cited term (or_head cites head) is in glossary');
    $shape(strpos((string)($p['glossary'] ?? ''), "\n- energy per weight of water as an elevation") !== false, 'a glossary term leads with its plain-words name');
    $shape(($p['key_context']['lpn_settings_text_halo']['tip']['key'] ?? '') === 'lpn_settings_text_halo_tip',
        'a label carries its tip in key_context');
    $shape(($p['key_context']['lpn_settings_text_halo_tip']['label']['key'] ?? '') === 'lpn_settings_text_halo',
        'a tip carries its label in key_context');
    $shape(!isset($p['prompt_context_by_prefix']) && !isset($p['glossary_terms_by_prefix']),
        'the glossary is sent once, as glossary, not twice by prefix');
}

foreach (glob($tmp . '/*.json') as $f) { unlink($f); }
@rmdir($tmp);

if ($fail) {
    printf("\npayload_freshness_selftest: %d failure(s).\n", $fail);
    exit(1);
}
echo "payload_freshness_selftest: 6 fixtures pass - freshness is decided by content, a touched\n";
echo "but unchanged input is not stale, a real difference still blocks, and the per-key notes,\n";
echo "reworded keys, tip pairs and batch glossary reach the translator's payload.\n";
exit(0);
