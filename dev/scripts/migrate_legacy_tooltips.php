<?php
/**
 * Task 126 — one-shot migration of legacy inline-styled tooltip markup to the
 * .ec-help / .ec-tip class convention (touch-friendly; see CLAUDE.md).
 *
 * Legacy value form:
 *   LABEL <span title="TIP" style="cursor:help;color:#06c;font-size:0.9em">?</span>
 * New value form (matches English source structure — whole label is the tap target):
 *   <span class="ec-help" title="TIP">LABEL <span class="ec-tip">?</span></span>
 *
 * Only the wrapper is restructured; TIP and LABEL bytes are preserved verbatim
 * (escaped quotes, &quot;, <sub> tags, raw <>, all untouched). Idempotent:
 * lines without `cursor:help` are left alone. English is already clean.
 *
 * Usage:  php dev/scripts/migrate_legacy_tooltips.php [--dry-run]
 */

$dry = in_array('--dry-run', $argv, true);
$langDir = __DIR__ . '/../../lib';
$files = glob($langDir . '/lang.ec.*.php');

// value = <label> <span title="<tip>" style="cursor:help;...">?</span>
$re = '/^(.*) <span title="([^"]*)" style="cursor:help;color:#06c;font-size:0\.9em">\?<\/span>$/u';

$grandTotal = 0;
foreach ($files as $file) {
    $lines = file($file, FILE_IGNORE_NEW_LINES);
    $count = 0;
    foreach ($lines as $i => $line) {
        if (strpos($line, 'cursor:help') === false) continue;
        // Split the assignment:  $ec_lang['key']='VALUE';
        if (!preg_match("/^(\\\$ec_lang\\['[^']+'\\]=')(.*)('\;)\s*$/", $line, $m)) {
            fwrite(STDERR, "SKIP (unparsed) {$file}:" . ($i+1) . "\n");
            continue;
        }
        $prefix = $m[1]; $value = $m[2]; $suffix = $m[3];
        $new = preg_replace($re,
            '<span class="ec-help" title="$2">$1 <span class="ec-tip">?<\/span><\/span>',
            $value, 1, $n);
        // preg_replace leaves \/ literal because we wrote \/ in replacement; fix.
        $new = str_replace('<\/span>', '</span>', $new);
        if ($n === 1 && $new !== $value) {
            $lines[$i] = $prefix . $new . $suffix;
            $count++;
        } else {
            fwrite(STDERR, "SKIP (no-match) {$file}:" . ($i+1) . "\n");
        }
    }
    if ($count > 0) {
        printf("%-28s %d converted%s\n", basename($file), $count, $dry ? ' (dry-run)' : '');
        if (!$dry) file_put_contents($file, implode("\n", $lines) . "\n");
        $grandTotal += $count;
    }
}
printf("---\nTotal: %d%s\n", $grandTotal, $dry ? ' (dry-run, nothing written)' : ' converted');
