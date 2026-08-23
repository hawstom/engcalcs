<?php
/**
 * Rotates the live usage logs into spock/<YYYY-MM-DD>/ and recreates them empty.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. Tom moved these files by hand. A rotation that happens when somebody remembers
 * is a rotation that mostly does not happen, and the cost of forgetting is not tidiness -- it is
 * that log/lang-log-stats.sh reports one ever-growing window, so the "PREVIOUS RUN / DIFFERENT
 * WINDOW" guard has nothing to catch, and dev/usage-data-log.md's 40x scale break is the kind of
 * thing that follows.
 *
 * THE DATE IN THE DIRECTORY NAME IS THE ARCHIVE'S ENDING DATE -- the day it was rotated, not the
 * day its first row was written. That is Tom's naming rule and spock/README.md states it too.
 *
 * WHY spock. Tom, 2026-08-22: *"I derived spock because Jesus said not to worry about the speck in
 * your sibling's eye when there is a log in your own eye, and speck reminded me of spock."*
 *
 * NOT LOSING A ROW IS THE WHOLE JOB, so the move is a rename() and never a copy-then-truncate.
 * rename() is atomic within a filesystem, and every log writer opens the path fresh for each append
 * (file_put_contents with FILE_APPEND), so a row written a microsecond after the rename lands in a
 * newly created live file rather than vanishing. copy-then-truncate has a window where it would
 * vanish, and that window is exactly when the site is busy.
 *
 * Usage:
 *   php dev/scripts/archive_logs.php            # report what would move, change nothing
 *   php dev/scripts/archive_logs.php --apply    # move it
 */
require_once __DIR__ . '/../../lib/config.inc.php';

$opts = getopt('', ['apply', 'help']);
if (isset($opts['help'])) {
    fwrite(STDERR, "See the comment block at the top of this file.\n");
    exit(0);
}
$apply = isset($opts['apply']);

$root = dirname(__DIR__, 2);
$date = gmdate('Y-m-d');
$dest = $root . '/spock/' . $date;

// Same six the report reads and the retention trim walks. Keeping one list per script was how
// SIGNAL_LOG ended up outside the 26-month promise until 2026-08-21; these three lists are meant to
// stay identical, and a new log writer owes an edit to all of them.
$logs = [LANG_LOG, HUMAN_VIEW_LOG, CALC_USAGE_LOG, TITLE_LOG, CONTACT_SEND_LOG, SIGNAL_LOG];

/** Row count that agrees with the report's own `wc -l`: lines, not records. */
function ec_row_count($path) {
    if (!is_file($path)) return 0;
    $n = 0;
    $fh = fopen($path, 'rb');
    if (!$fh) return 0;
    while (!feof($fh)) {
        $n += substr_count((string)fread($fh, 1 << 20), "\n");
    }
    fclose($fh);
    return $n;
}

printf("Archive date (ENDING date): %s\nDestination: %s\n%s\n\n",
    $date, $dest, $apply ? 'APPLYING.' : 'Dry run -- nothing will be moved.');

// A destination that already exists is refused rather than merged. Two rotations on one day would
// otherwise either overwrite the morning's rows or interleave two windows under one date, and both
// are silent. Rename the existing directory, or wait for tomorrow.
if (is_dir($dest)) {
    fwrite(STDERR, "REFUSING: $dest already exists.\n");
    fwrite(STDERR, "An archive is one rotation. Merging a second one into it would put two windows\n");
    fwrite(STDERR, "under one date with nothing to show for it. Move or rename that directory first.\n");
    exit(1);
}

$total = 0;
$present = [];
foreach ($logs as $log) {
    $name = basename($log);
    if (!is_file($log)) {
        printf("  %-34s %s\n", $name, '(no file -- nothing to move)');
        continue;
    }
    $n = ec_row_count($log);
    $present[$log] = $n;
    $total += $n;
    printf("  %-34s %8d rows\n", $name, $n);
}

if (!$present) {
    echo "\nNo live logs found. Nothing to do.\n";
    exit(0);
}

printf("\n%s %d row(s) into %s.\n", $apply ? 'Moving' : 'Would move', $total, $dest);

if (!$apply) {
    echo "\nSnapshot the aggregates first, so the window survives the rotation:\n";
    echo "    bash log/lang-log-stats.sh --out=spock/reports/usage-$date.txt\n";
    echo "Then re-run with --apply.\n";
    exit(0);
}

if (!@mkdir($dest, 0750, true) && !is_dir($dest)) {
    fwrite(STDERR, "Could not create $dest\n");
    exit(1);
}

$moved = 0;
$failed = 0;
foreach ($present as $log => $before) {
    $name = basename($log);
    $target = $dest . '/' . $name;
    if (!@rename($log, $target)) {
        fwrite(STDERR, "  FAILED to move $name -- left in place.\n");
        $failed++;
        continue;
    }
    // Recreate the live file empty and readable by the writers, so the first request after a
    // rotation does not have to race six mkdir/create paths at once.
    @touch($log);
    @chmod($log, 0640);

    // Verified, not assumed. rename() is atomic, so this can only fail if the filesystem lied --
    // but "it must be fine" is how a rotation loses a window nobody can get back.
    $after = ec_row_count($target);
    if ($after !== $before) {
        fwrite(STDERR, "  ROW COUNT MISMATCH on $name: $before before, $after after. STOPPING.\n");
        fwrite(STDERR, "  The archived copy is at $target and nothing has been deleted.\n");
        exit(1);
    }
    printf("  %-34s %8d rows -> %s\n", $name, $after, $target);
    $moved += $after;
}

// The report's own state file describes the window that just moved, so it travels with it. The
// live directory then starts fresh and honestly says "first run against this log directory".
$state = dirname(LANG_LOG) . '/.last-report-window';
if (is_file($state)) {
    @rename($state, $dest . '/.last-report-window');
}

printf("\nMoved %d row(s). %s\n", $moved, $failed ? "$failed file(s) FAILED -- see above." : 'All six accounted for.');
echo "Read it back with:  bash log/lang-log-stats.sh --archive=spock/$date\n";
