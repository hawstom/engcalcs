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
 * AND THE ROTATION REGISTERS ITSELF (ROADMAP Task 485). It writes a .archive-manifest.json naming
 * the window it just closed, the row count of each of the six, and the archive it follows. The
 * ending date alone can point a report at a window; it cannot tell a later reader whether the hole
 * between two archives is a quiet fortnight, a retention trim doing its job, or logging that went
 * somewhere else for a month. Deleted rows leave nothing behind, so only something written at the
 * moment of rotation can answer that -- and `--verify` is what reads it back. See
 * dev/scripts/log_archive_manifest.inc.php for the format and for why the DIRECTORY NAME did not
 * change to carry any of this.
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
 *   php dev/scripts/archive_logs.php --verify   # audit every archive; exit 1 on an unexplained gap
 */
require_once __DIR__ . '/../../lib/config.inc.php';
require_once __DIR__ . '/log_archive_manifest.inc.php';

$opts = getopt('', ['apply', 'verify', 'help']);
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
$knownNames = array_map('basename', $logs);

// ---- --verify: the chain, read back -----------------------------------------------------------
// Reads only. It is the half of Task 485 that turns "a future reader can tell an archive boundary
// from a data loss" from a thing somebody must remember into a thing a command answers, so it is
// meant to be run from cron beside the rotation -- see the crontab recipe in dev/usage-data-log.md.
if (isset($opts['verify'])) {
    $dirs = ec_archive_dirs($root . '/spock');
    if (!$dirs) {
        echo "No archives under spock/. Nothing to verify.\n";
        exit(0);
    }
    printf("Archives under %s/spock, oldest first. %d found.\n\n", $root, count($dirs));
    $unexplained = 0;
    $prev = null;
    foreach ($dirs as $dir) {
        $state = ec_archive_state($dir, $knownNames);
        $m = $state['manifest'];
        printf("%s  %-9s %8d rows  window %s .. %s\n",
            $state['name'],
            $m === null ? 'derived' : (isset($m['provenance']) ? $m['provenance'] : 'rotated'),
            $state['now']['rows'],
            ec_manifest_day($state['now']['first_row']) ?: '(none)',
            ec_manifest_day($state['now']['last_row'])  ?: '(none)');
        foreach (ec_archive_findings($state, $prev) as $f) {
            $mark = $f['level'] === 'unexplained' ? '!!' : ($f['level'] === 'note' ? ' -' : ' .');
            printf("    %s %s\n", $mark, $f['text']);
            if ($f['level'] === 'unexplained') $unexplained++;
        }
        $prev = $state;
    }
    echo "\n";
    if ($unexplained) {
        // A gap in TRAFFIC is normal and prints as a note. This counts only holes in the DATA that
        // nothing wrote down, which is the one thing an archive is supposed to make impossible.
        fwrite(STDERR, "$unexplained unexplained finding(s). Every one is a hole in the record that\n");
        fwrite(STDERR, "nothing accounted for. Write what happened into dev/usage-data-log.md.\n");
        exit(1);
    }
    echo "Every archive accounted for.\n";
    exit(0);
}

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
    echo "Audit what is already archived with:  php dev/scripts/archive_logs.php --verify\n";
    exit(0);
}

// Read the window BEFORE the move, and name the archive this one follows BEFORE $dest exists --
// afterwards $dest is itself the newest directory and would name itself as its own predecessor.
$spans = [];
foreach ($present as $log => $ignored) {
    $spans[basename($log)] = ec_manifest_row_span($log);
}
$existing = ec_archive_dirs($root . '/spock');
$predecessor = $existing ? basename(end($existing)) : null;

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

// ---- register the archive ----------------------------------------------------------------------
// This is the row of the ledger that no reader can reconstruct later. The rows say what is HERE;
// only this says what was here when the directory was sealed, and therefore what a subsequent
// difference means.
$first = null; $last = null;
$perLog = [];
foreach ($spans as $name => $s) {
    $perLog[$name] = ['rows' => $s['rows'], 'first_row' => $s['first_row'], 'last_row' => $s['last_row']];
    if ($s['first_row'] !== null && ($first === null || $s['first_row'] < $first)) $first = $s['first_row'];
    if ($s['last_row']  !== null && ($last  === null || $s['last_row']  > $last))  $last  = $s['last_row'];
}
$manifest = [
    'schema'          => 1,
    'archive'         => $date,          // the ENDING date, and the directory name
    'archived_at'     => gmdate('Y-m-d\TH:i:s\Z'),
    'tool'            => 'archive_logs.php',
    'provenance'      => 'rotated',      // vs an archive with no manifest, which reads as 'derived'
    'predecessor'     => $predecessor,   // null only for the first archive ever taken
    'covers'          => ['first_row' => $first, 'last_row' => $last, 'rows' => $moved],
    'logs'            => $perLog,
    'retention_trims' => [],             // appended to by dev/scripts/trim_logs.php
];
if (!ec_manifest_write($dest, $manifest)) {
    fwrite(STDERR, "  WARNING: could not write " . ec_manifest_path($dest) . "\n");
    fwrite(STDERR, "  The logs moved and no row was lost. The archive is simply unregistered, and\n");
    fwrite(STDERR, "  --verify will report it as 'derived'.\n");
}

printf("\nMoved %d row(s). %s\n", $moved, $failed ? "$failed file(s) FAILED -- see above." : 'All six accounted for.');
printf("Registered %s covering %s .. %s%s\n",
    ec_manifest_path($dest),
    ec_manifest_day($first) ?: '(no dated row)',
    ec_manifest_day($last)  ?: '(no dated row)',
    $predecessor === null ? ' (first archive)' : ", following $predecessor");
echo "Read it back with:  bash log/lang-log-stats.sh --archive=spock/$date\n";
echo "Audit the chain:    php dev/scripts/archive_logs.php --verify\n";
