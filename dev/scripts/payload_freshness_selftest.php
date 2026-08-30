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

foreach (glob($tmp . '/*.json') as $f) { unlink($f); }
@rmdir($tmp);

if ($fail) {
    printf("\npayload_freshness_selftest: %d failure(s).\n", $fail);
    exit(1);
}
echo "payload_freshness_selftest: 5 fixtures pass - freshness is decided by content, a touched\n";
echo "but unchanged input is not stale, and a real difference still blocks.\n";
exit(0);
