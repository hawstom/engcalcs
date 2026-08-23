<?php
/**
 * The archive manifest: one file's opinion about what an archive says about itself.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 485). An archive was a directory named after its ENDING date and
 * nothing else. That is enough to POINT a report at a window and not nearly enough to TRUST one:
 * given two archives, a reader could not tell whether the gap between them is a quiet stretch, a
 * retention trim doing its job, or logging that was silently pointed somewhere else for a month.
 * The rows themselves cannot answer it -- rows that were deleted leave nothing behind, which is
 * the entire difficulty. Only something written AT THE MOMENT OF ROTATION can, so the rotation
 * writes it.
 *
 * THE DIRECTORY NAME DID NOT CHANGE AND MUST NOT. Encoding the window in the name --
 * spock/2026-07-01_2026-08-14/ -- was the obvious alternative and is worse three ways: it orphans
 * every archive already sitting on the server, it is a claim no code verifies, and it duplicates
 * information the manifest carries exactly. A name a human types is a convention; a manifest a
 * script writes and a script reads is a mechanism.
 *
 * AN ARCHIVE WITH NO MANIFEST IS STILL A VALID ARCHIVE. Every reader here derives what it can from
 * the rows and labels the result 'derived'. Hand-moving six files into spock/<date>/ remains the
 * whole procedure, as spock/README.md promises; the manifest adds provenance where it exists and
 * says so where it does not.
 */

/** Dotfile, beside .last-report-window, so an archive is still "the six live filenames". */
define('EC_ARCHIVE_MANIFEST', '.archive-manifest.json');

/** ISO-8601 UTC stamps sort lexicographically, so first and last row need no date parsing. */
function ec_manifest_row_span($path) {
    $first = null; $last = null; $rows = 0;
    if (!is_file($path)) return ['rows' => 0, 'first_row' => null, 'last_row' => null];
    $fh = fopen($path, 'rb');
    if (!$fh) return ['rows' => 0, 'first_row' => null, 'last_row' => null];
    while (($line = fgets($fh)) !== false) {
        $rows++;
        $ts = strtok(rtrim($line, "\r\n"), "\t");
        // A row whose first field is not a timestamp is counted and otherwise ignored: this is a
        // description of the data, and guessing at an unreadable row would be a description of us.
        if ($ts === false || strlen($ts) !== 20 || $ts[4] !== '-') continue;
        if ($first === null || $ts < $first) $first = $ts;
        if ($last === null || $ts > $last) $last = $ts;
    }
    fclose($fh);
    return ['rows' => $rows, 'first_row' => $first, 'last_row' => $last];
}

function ec_manifest_path($dir) { return rtrim($dir, '/') . '/' . EC_ARCHIVE_MANIFEST; }

function ec_manifest_read($dir) {
    $p = ec_manifest_path($dir);
    if (!is_file($p)) return null;
    $m = json_decode((string)file_get_contents($p), true);
    return is_array($m) ? $m : null;
}

function ec_manifest_write($dir, array $m) {
    $p = ec_manifest_path($dir);
    // Write-then-rename: a half-written manifest would be indistinguishable from no manifest, and
    // "no manifest" means something specific here.
    $tmp = $p . '.tmp.' . getmypid();
    $ok = file_put_contents($tmp, json_encode($m, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");
    if ($ok === false) { @unlink($tmp); return false; }
    return rename($tmp, $p);
}

/**
 * Every archive directory under spock/, oldest first. Name-sorted, which for YYYY-MM-DD is
 * date-sorted. `public` and `reports` are not archives.
 */
function ec_archive_dirs($spockRoot) {
    $out = [];
    foreach (glob(rtrim($spockRoot, '/') . '/*', GLOB_ONLYDIR) ?: [] as $d) {
        $b = basename($d);
        if ($b === 'public' || $b === 'reports') continue;
        $out[] = $d;
    }
    sort($out);
    return $out;
}

/**
 * What an archive says about itself RIGHT NOW: the manifest if there is one, plus the span the
 * rows currently show. The two differ after a retention trim, and that difference is the whole
 * point -- see ec_archive_findings().
 */
function ec_archive_state($dir, array $knownNames) {
    $rows = 0; $first = null; $last = null; $per = [];
    foreach ($knownNames as $name) {
        $s = ec_manifest_row_span($dir . '/' . $name);
        $per[$name] = $s;
        $rows += $s['rows'];
        if ($s['first_row'] !== null && ($first === null || $s['first_row'] < $first)) $first = $s['first_row'];
        if ($s['last_row']  !== null && ($last  === null || $s['last_row']  > $last))  $last  = $s['last_row'];
    }
    return [
        'dir'      => $dir,
        'name'     => basename($dir),
        'manifest' => ec_manifest_read($dir),
        'now'      => ['rows' => $rows, 'first_row' => $first, 'last_row' => $last, 'logs' => $per],
    ];
}

/** Date half of an ISO stamp, or null. */
function ec_manifest_day($ts) { return $ts === null ? null : substr($ts, 0, 10); }

function ec_days_between($a, $b) {
    return (int)round((strtotime($b . 'T00:00:00Z') - strtotime($a . 'T00:00:00Z')) / 86400);
}

/**
 * THE ONE QUESTION THIS WHOLE FILE EXISTS TO ANSWER: is a hole in the record an archive boundary,
 * an explained deletion, or something nobody wrote down?
 *
 * Returns a list of ['level' => 'ok'|'note'|'unexplained', 'text' => ...] per archive, including
 * the chain check against the archive before it. 'unexplained' is the only level a caller should
 * ever exit non-zero on: a gap in TRAFFIC is normal, an unrecorded gap in DATA is not.
 */
function ec_archive_findings(array $state, array $prevState = null) {
    $out = [];
    $m = $state['manifest'];
    $now = $state['now'];

    if ($m === null) {
        $out[] = ['level' => 'note', 'text' =>
            'no manifest -- hand-moved, or rotated before Task 485. The window below is DERIVED from ' .
            'the rows, so rows deleted before this reading cannot be seen'];
    } else {
        // Rows earlier than the manifest's own window are gone. Retention is the lawful reason and
        // records itself; anything else is the finding this file exists to surface.
        $wasFirst = isset($m['covers']['first_row']) ? $m['covers']['first_row'] : null;
        if ($wasFirst !== null && $now['first_row'] !== null && $now['first_row'] > $wasFirst) {
            $trims = isset($m['retention_trims']) ? $m['retention_trims'] : [];
            if ($trims) {
                $dropped = 0;
                foreach ($trims as $t) $dropped += isset($t['dropped']) ? (int)$t['dropped'] : 0;
                $out[] = ['level' => 'note', 'text' => sprintf(
                    'starts later than when archived (%s -> %s): %d row(s) deleted by %d recorded retention trim(s)',
                    ec_manifest_day($wasFirst), ec_manifest_day($now['first_row']), $dropped, count($trims))];
            } else {
                $out[] = ['level' => 'unexplained', 'text' => sprintf(
                    'starts later than when archived (%s -> %s) and NOTHING recorded a deletion',
                    ec_manifest_day($wasFirst), ec_manifest_day($now['first_row']))];
            }
        }
        if (isset($m['predecessor']) && $m['predecessor'] !== null
            && !is_dir(dirname($state['dir']) . '/' . $m['predecessor'])) {
            $out[] = ['level' => 'unexplained', 'text' =>
                'names predecessor ' . $m['predecessor'] . ', which is not here -- an archive was moved or deleted'];
        }
    }

    if ($prevState !== null) {
        // The live logs were recreated empty the instant the previous archive was rotated, so this
        // archive's coverage starts at the previous archive's ENDING date by construction. A first
        // row later than that is a stretch with no traffic OR data that never arrived, and the two
        // are genuinely indistinguishable from here -- so it is reported, never judged.
        $boundary = $prevState['name'];
        $firstDay = ec_manifest_day($now['first_row']);
        if ($firstDay !== null && preg_match('/^\d{4}-\d{2}-\d{2}$/', $boundary)) {
            $gap = ec_days_between($boundary, $firstDay);
            if ($gap < 0) {
                $out[] = ['level' => 'unexplained', 'text' => sprintf(
                    'overlaps %s: its first row (%s) predates that archive\'s ending date -- two archives cover one window',
                    $boundary, $firstDay)];
            } elseif ($gap <= 1) {
                $out[] = ['level' => 'ok', 'text' => 'contiguous with ' . $boundary];
            } else {
                $out[] = ['level' => 'note', 'text' => sprintf(
                    '%d day(s) between %s and this archive\'s first row -- a quiet stretch, or data that never arrived',
                    $gap, $boundary)];
            }
        }
    } else {
        $out[] = ['level' => 'ok', 'text' => 'oldest archive -- no predecessor expected'];
    }
    return $out;
}
