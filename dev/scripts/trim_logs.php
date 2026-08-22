<?php
/**
 * Deletes usage-log rows older than the retention period the privacy notice promises.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 286). privacy.php says the usage counts are kept "at most 26
 * months, and often deleted sooner". Tom, 2026-08-12: *"I tend to delete often. I don't know if
 * that's bad. We can systematize."* Deleting often is good for privacy and costs nothing legally;
 * what it costs is the multi-year trend that language and calculator decisions rest on. A stated
 * maximum with no enforcement is the other failure -- it is a claim about our own behaviour that
 * quietly becomes false the first time nobody remembers.
 *
 * So this script makes the 26 months a fact rather than an intention, and it is deliberately
 * SEPARATE from deleting often: run it on a schedule as the backstop, and delete by hand whenever
 * you like. Neither gets in the other's way.
 *
 * BEFORE YOU DELETE ANYTHING, SNAPSHOT THE REPORT. `sh log/lang-log-stats.sh` produces aggregate
 * numbers with no rows in them; pasting that into dev/usage-data-log.md keeps the history that
 * decisions actually use, while the raw rows go away. PASTE THE REPORT'S WINDOW AND FINGERPRINT
 * LINES WITH IT -- a trim changes the window, and a snapshot with no window recorded cannot be
 * compared to the one before it. That is exactly how the 2026-08-21 scale break happened.
 * With a snapshot first, deleting often costs nothing at all; on its own, a little.
 *
 * Usage:
 *   php dev/scripts/trim_logs.php            # report what would be deleted, change nothing
 *   php dev/scripts/trim_logs.php --apply    # actually rewrite the logs
 *   php dev/scripts/trim_logs.php --months=6 --apply
 */
require_once __DIR__ . '/../../lib/config.inc.php';

$opts = getopt('', ['apply', 'months::', 'help']);
if (isset($opts['help'])) {
    fwrite(STDERR, "See the comment block at the top of this file.\n");
    exit(0);
}
$apply  = isset($opts['apply']);
// 26 months is what privacy.php promises. Passing --months smaller is always safe; passing a
// larger one would make the page's own claim untrue, so it is refused.
$months = isset($opts['months']) ? (int)$opts['months'] : 26;
if ($months < 1 || $months > 26) {
    fwrite(STDERR, "--months must be between 1 and 26; privacy.php promises at most 26.\n");
    exit(1);
}

$cutoff = gmdate('Y-m-d\TH:i:s\Z', strtotime("-{$months} months"));
// SIGNAL_LOG belongs here as much as the rest: it is visitor-derived data and privacy.php's
// 26-month promise is about the usage counts, not about which file they landed in. It was missing
// until 2026-08-21, so the behaviour-signal rows were the one set the retention backstop never
// touched.
$logs = [LANG_LOG, HUMAN_VIEW_LOG, CALC_USAGE_LOG, TITLE_LOG, CONTACT_SEND_LOG, SIGNAL_LOG];

printf("Retention: %d months. Cutoff: %s. %s\n\n", $months, $cutoff, $apply ? 'APPLYING.' : 'Dry run -- nothing will be written.');

$totalDropped = 0;
foreach ($logs as $log) {
    $name = basename($log);
    if (!is_file($log)) {
        printf("  %-34s %s\n", $name, '(no file)');
        continue;
    }
    $kept = [];
    $dropped = 0;
    // Every one of these logs begins each line with an ISO-8601 UTC timestamp, which sorts
    // lexicographically -- so a string comparison against the cutoff is the whole test, and no
    // date parsing can go wrong on a malformed row. A row whose first field does not look like a
    // timestamp is KEPT: this script's job is deleting old data, and "I could not read it" is not
    // evidence that data is old.
    foreach (file($log, FILE_IGNORE_NEW_LINES) as $line) {
        $ts = strtok($line, "\t");
        if ($ts !== false && strlen($ts) === 20 && $ts[4] === '-' && $ts < $cutoff) {
            $dropped++;
            continue;
        }
        $kept[] = $line;
    }
    $totalDropped += $dropped;
    printf("  %-34s %6d rows, %6d older than cutoff\n", $name, $dropped + count($kept), $dropped);
    if ($apply && $dropped > 0) {
        // Write-then-rename, so an interrupted run cannot leave a half-written log behind.
        $tmp = $log . '.trim.' . getmypid();
        file_put_contents($tmp, $kept ? implode("\n", $kept) . "\n" : '');
        rename($tmp, $log);
    }
}

printf("\n%s %d row(s).\n", $apply ? 'Deleted' : 'Would delete', $totalDropped);
if (!$apply && $totalDropped > 0) {
    echo "Snapshot the aggregates into dev/usage-data-log.md first:  sh log/lang-log-stats.sh\n";
    echo "Then re-run with --apply.\n";
}
