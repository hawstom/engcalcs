<?php
/**
 * UsageReport.lib.php -- reading the six usage logs, and the arithmetic the usage report page
 * draws. No output, no globals, no storage: every function here takes what it judges as an
 * argument so dev/scripts/usage_report_selftest.php can drive it against a fixture directory.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * THE ONE RULE THIS FILE EXISTS TO HOLD. Every log row ends with a BUCKET, written by
 * ecLogBucketSuffix() in lib/config.inc.php:
 *
 *   'visitor'  a visitor who agreed to being counted once rather than every time. Those rows are
 *              DEDUPLICATED per (visit, page) against the ec_seen cookie, so they count PEOPLE.
 *   'visit'    everybody else. Nothing may be stored to deduplicate against, so every page load
 *              writes a row. Those rows count PAGE LOADS.
 *
 * THE TWO ARE NEVER SUMMED. A total would have a denominator in two units and a numerator in
 * neither -- the symptom formmail.php's own comment records. So every aggregate here returns the
 * two buckets as two separate series, keyed 'visitor' and 'visit', and nothing in this file adds
 * them together.
 *
 * VINTAGE. The logs grew columns over the years and awk-style positional reading is exactly how a
 * report comes to print a number that looks fine off the wrong field. So a row is read from the
 * BACK for its bucket and from the FRONT for everything else, and a column the row is too short to
 * carry reads as empty rather than as the column beside it:
 *
 *   * the bucket is the LAST field when it is literally 'visit' or 'visitor'. A last field holding
 *     neither token is a row written before 2026-08-21, which is a legacy PEOPLE row.
 *   * the pointer (Task 285) is the fifth field of a view or calc row. A row with four fields left
 *     after the bucket predates it and reads as pointer unknown, never as fine.
 *   * the served/asked pair on the reach log is present only on rows with six fields left. A
 *     shorter row is counted and reported as 'older format', never guessed at.
 */

/** The six live log basenames, each with the kind that says how its columns are read. */
function ecUsageLogKinds()
{
    return array(
        'engcalcs-lang.log'         => 'reach',
        'engcalcs-human-view.log'   => 'view',
        'engcalcs-calc-usage.log'   => 'calc',
        'engcalcs-title.log'        => 'naming',
        'engcalcs-signal.log'       => 'signal',
        'engcalcs-contact-send.log' => 'send',
    );
}

/**
 * One row, parsed. Returns null for a line that is not a row at all (blank, or a first field that
 * is not an ISO-8601 UTC stamp) -- guessing at an unreadable row would describe us rather than the
 * data, which is ec_manifest_row_span()'s reasoning in dev/scripts/log_archive_manifest.inc.php.
 *
 * @return array|null keys: ts, day, bucket, plus the kind's own named fields.
 */
function ecUsageParseRow($kind, $line)
{
    $line = rtrim($line, "\r\n");
    if ($line === '') { return null; }
    $f = explode("\t", $line);

    $ts = $f[0];
    if (strlen($ts) !== 20 || $ts[4] !== '-' || substr($ts, -1) !== 'Z') { return null; }

    // The bucket is read off the BACK, never off a fixed index. A last field holding neither token
    // is a pre-2026-08-21 row and is a people row by definition.
    $last = $f[count($f) - 1];
    if ($last === 'visit' || $last === 'visitor') {
        $bucket = $last;
        array_pop($f);
    } else {
        $bucket = 'visitor';
    }

    $n = count($f);
    $get = function ($i) use ($f, $n) { return $i < $n ? $f[$i] : ''; };

    $row = array('ts' => $ts, 'day' => substr($ts, 0, 10), 'bucket' => $bucket);

    switch ($kind) {
        case 'reach':
            // ts lang source page [served asked]
            $row['lang']   = $get(1);
            $row['source'] = $get(2);
            $row['page']   = $get(3);
            $row['served'] = $n >= 6 ? $get(4) : '';
            $row['asked']  = $n >= 6 ? $get(5) : '';
            $row['classified'] = ($n >= 6);
            break;
        case 'view':
        case 'calc':
            // ts page lang browser_lang [pointer]
            $row['page']    = $get(1);
            $row['lang']    = $get(2);
            $row['asked']   = $get(3);
            $row['pointer'] = $n >= 5 ? $get(4) : '';
            break;
        case 'naming':
            // ts page lang browser_lang field
            $row['page']  = $get(1);
            $row['lang']  = $get(2);
            $row['asked'] = $get(3);
            $row['field'] = $get(4);
            break;
        case 'signal':
            // ts page lang browser_lang event detail
            $row['page']   = $get(1);
            $row['lang']   = $get(2);
            $row['asked']  = $get(3);
            $row['event']  = $get(4);
            $row['detail'] = $get(5);
            break;
        case 'send':
            // ts page lang browser_lang
            $row['page']  = $get(1);
            $row['lang']  = $get(2);
            $row['asked'] = $get(3);
            break;
        default:
            return null;
    }
    return $row;
}

/** Every parseable row of one log file. A file that is not there is no rows, which is not an error. */
function ecUsageReadLog($path, $kind)
{
    $out = array();
    if (!is_file($path)) { return $out; }
    $fh = @fopen($path, 'rb');
    if (!$fh) { return $out; }
    while (($line = fgets($fh)) !== false) {
        $row = ecUsageParseRow($kind, $line);
        if ($row !== null) { $out[] = $row; }
    }
    fclose($fh);
    return $out;
}

/**
 * Every row of every log, from one or more directories -- the live log directory plus any rotated
 * archives, which is the only way a window older than the last rotation can be shown at all.
 *
 * @param array $dirs directory paths, oldest first.
 * @return array kind-name => rows, plus '_sources' => the directories that held any row.
 */
function ecUsageReadAll(array $dirs)
{
    $out = array();
    foreach (ecUsageLogKinds() as $name => $kind) { $out[$kind] = array(); }
    $sources = array();
    foreach ($dirs as $dir) {
        $any = 0;
        foreach (ecUsageLogKinds() as $name => $kind) {
            $rows = ecUsageReadLog(rtrim($dir, '/') . '/' . $name, $kind);
            $any += count($rows);
            foreach ($rows as $r) { $out[$kind][] = $r; }
        }
        if ($any) { $sources[] = array('dir' => $dir, 'rows' => $any); }
    }
    $out['_sources'] = $sources;
    return $out;
}

/** Rows whose day falls in [$from, $to] inclusive, both 'YYYY-MM-DD'. An empty $from means all. */
function ecUsageWindow(array $rows, $from, $to)
{
    $out = array();
    foreach ($rows as $r) {
        if ($from !== '' && $r['day'] < $from) { continue; }
        if ($to !== '' && $r['day'] > $to) { continue; }
        $out[] = $r;
    }
    return $out;
}

/**
 * Counts of one field's values, SPLIT BY BUCKET and never summed.
 *
 * @return array ['visitor' => [value => n], 'visit' => [value => n]]
 */
function ecUsageCountBy(array $rows, $field)
{
    $out = array('visitor' => array(), 'visit' => array());
    foreach ($rows as $r) {
        $v = isset($r[$field]) ? $r[$field] : '';
        if ($v === '') { $v = '(none)'; }
        if (!isset($out[$r['bucket']][$v])) { $out[$r['bucket']][$v] = 0; }
        $out[$r['bucket']][$v]++;
    }
    arsort($out['visitor']);
    arsort($out['visit']);
    return $out;
}

/** Row counts per bucket. Two numbers, deliberately never a third. */
function ecUsageBucketTotals(array $rows)
{
    $out = array('visitor' => 0, 'visit' => 0);
    foreach ($rows as $r) { $out[$r['bucket']]++; }
    return $out;
}

/** Every day from $from to $to inclusive, as 'YYYY-MM-DD'. */
function ecUsageDayRange($from, $to)
{
    $days = array();
    $t = strtotime($from . ' UTC');
    $end = strtotime($to . ' UTC');
    if ($t === false || $end === false || $t > $end) { return $days; }
    while ($t <= $end) {
        $days[] = gmdate('Y-m-d', $t);
        $t += 86400;
    }
    return $days;
}

/**
 * A daily series per bucket over a fixed day list, so a day with no rows is a zero rather than a
 * gap the eye closes up.
 *
 * @return array ['visitor' => [day => n], 'visit' => [day => n]]
 */
function ecUsageDaily(array $rows, array $days)
{
    $out = array('visitor' => array(), 'visit' => array());
    foreach ($days as $d) { $out['visitor'][$d] = 0; $out['visit'][$d] = 0; }
    foreach ($rows as $r) {
        if (!isset($out[$r['bucket']][$r['day']])) { continue; }
        $out[$r['bucket']][$r['day']]++;
    }
    return $out;
}

/** The earliest and latest day any row carries, or ['',''] when there are none. */
function ecUsageSpan(array $kinds)
{
    $first = ''; $last = '';
    foreach ($kinds as $k => $rows) {
        if ($k === '_sources' || !is_array($rows)) { continue; }
        foreach ($rows as $r) {
            if ($first === '' || $r['day'] < $first) { $first = $r['day']; }
            if ($last === ''  || $r['day'] > $last)  { $last  = $r['day']; }
        }
    }
    return array($first, $last);
}

/**
 * One bar chart as inline SVG. Server-side, self-contained, no script and no external library:
 * the suite makes exactly four third-party requests, all on the map page and all opt-in, and this
 * page makes a fifth of nothing.
 *
 * ONE CHART DRAWS ONE BUCKET. The caller draws two charts where there are two buckets, each with
 * its own scale and its own unit in the caption, because a shared axis is the visual form of the
 * sum this file refuses to compute.
 */
function ecUsageBarsSvg(array $series, $unitLabel, $fill)
{
    $days = array_keys($series);
    $n = count($days);
    if ($n === 0) { return '<p class="none">No rows in this window.</p>'; }

    $max = 0;
    foreach ($series as $v) { if ($v > $max) { $max = $v; } }

    $h = 120; $pad = 26; $w = max(320, $n * 6);
    $bw = $w / $n;
    $svg  = '<svg class="chart" viewBox="0 0 ' . ($w + $pad) . ' ' . ($h + 34) . '" preserveAspectRatio="none"'
          . ' role="img" aria-label="' . htmlspecialchars($unitLabel, ENT_QUOTES) . ' per day">';
    $svg .= '<title>' . htmlspecialchars($unitLabel, ENT_QUOTES) . ' per day</title>';
    // Baseline and the one gridline that carries the peak, labelled with its own number so the
    // chart can be read without hovering anything.
    $svg .= '<line x1="' . $pad . '" y1="' . $h . '" x2="' . ($w + $pad) . '" y2="' . $h . '" class="axis"/>';
    $svg .= '<line x1="' . $pad . '" y1="4" x2="' . ($w + $pad) . '" y2="4" class="grid"/>';
    $svg .= '<text x="0" y="9" class="tick">' . ($max > 0 ? $max : 0) . '</text>';
    $svg .= '<text x="0" y="' . ($h + 1) . '" class="tick">0</text>';

    $i = 0;
    foreach ($series as $day => $v) {
        if ($v > 0 && $max > 0) {
            $bh = max(1.0, ($v / $max) * ($h - 6));
            $x = $pad + $i * $bw;
            $svg .= '<rect x="' . round($x, 2) . '" y="' . round($h - $bh, 2) . '" width="'
                  . round(max($bw - 0.6, 0.6), 2) . '" height="' . round($bh, 2) . '" fill="' . $fill . '">'
                  . '<title>' . htmlspecialchars($day . ': ' . $v . ' ' . $unitLabel, ENT_QUOTES) . '</title></rect>';
        }
        $i++;
    }
    // First and last day, which is the whole x axis this chart needs.
    $svg .= '<text x="' . $pad . '" y="' . ($h + 16) . '" class="tick">' . htmlspecialchars($days[0]) . '</text>';
    $svg .= '<text x="' . ($w + $pad) . '" y="' . ($h + 16) . '" class="tick" text-anchor="end">'
          . htmlspecialchars($days[$n - 1]) . '</text>';
    $svg .= '</svg>';
    return $svg;
}
