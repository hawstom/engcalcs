<?php
/**
 * Task 134 — add u_bar and u_kgfcm2 display-token keys to all 27 lang files.
 * English fallback value in every file ("bar" / "kgf/cm^2"); the 26-language
 * translation of these two `layout: unit token` symbols rides the next sprint.
 * ec_lang only — no $ec_lang_intent lines (intent is off-limits to AI).
 * Inserts after the u_psi block. Idempotent.
 */
$langDir = __DIR__ . '/../../lib';
$files = glob($langDir . '/lang.ec.*.php');
$newLines = [
    '$ec_lang[\'u_bar\']="bar";',
    '$ec_lang[\'u_kgfcm2\']="kgf/cm^2";',
];
foreach ($files as $file) {
    $lines = file($file, FILE_IGNORE_NEW_LINES);
    if (in_array($newLines[0], $lines, true)) { echo basename($file)." already has u_bar (skip)\n"; continue; }
    // find u_psi ec_lang line
    $anchor = null;
    foreach ($lines as $i => $l) {
        if (strpos($l, "\$ec_lang['u_psi']=") === 0) { $anchor = $i; }
    }
    if ($anchor === null) { fwrite(STDERR, "NO u_psi anchor in ".basename($file)."\n"); continue; }
    // if the next line is the u_psi intent, insert after it
    $insertAt = $anchor + 1;
    if (isset($lines[$insertAt]) && strpos($lines[$insertAt], "\$ec_lang_intent['u_psi']=") === 0) {
        $insertAt++;
    }
    array_splice($lines, $insertAt, 0, $newLines);
    file_put_contents($file, implode("\n", $lines) . "\n");
    echo basename($file)." inserted at line ".($insertAt+1)."\n";
}
