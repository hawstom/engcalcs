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
 * MEMORY-BOUNDED READING. Everything below this point exists because ecUsageReadAll() materialises
 * one PHP array per row, and on production engcalcs-lang.log alone is 11+ MB and growing daily --
 * the same log that grows forever, since every uncached page load writes to it. A window's memory
 * must be bounded by what it PRINTS (days x distinct field values), never by how many lines
 * produced it, or "all" fails on the day the live log outgrows the host's memory_limit.
 *
 * spock.php uses these; ecUsageReadAll() and friends above are unchanged and stay in use by
 * dev/scripts/usage_report_selftest.php, which drives them on a fixture measured in dozens of rows.
 */

/** The day (first 10 characters of the timestamp) of one raw log line, or null when it is not a
 * row at all -- the same ts validity test ecUsageParseRow() applies, without building a row array. */
function ecUsageLineDay($line)
{
    $line = rtrim($line, "\r\n");
    if ($line === '') { return null; }
    $tab = strpos($line, "\t");
    $ts = ($tab === false) ? $line : substr($line, 0, $tab);
    if (strlen($ts) !== 20 || $ts[4] !== '-' || substr($ts, -1) !== 'Z') { return null; }
    return substr($ts, 0, 10);
}

/**
 * The earliest and latest day across every log in every directory, read a line at a time and
 * keeping only the two day strings seen so far -- O(1) memory regardless of log size.
 *
 * @return array [$firstDay, $lastDay], or ['',''] when there are no rows anywhere.
 */
function ecUsageStreamSpan(array $dirs)
{
    $first = ''; $last = '';
    foreach ($dirs as $dir) {
        foreach (ecUsageLogKinds() as $name => $kind) {
            $path = rtrim($dir, '/') . '/' . $name;
            if (!is_file($path)) { continue; }
            $fh = @fopen($path, 'rb');
            if (!$fh) { continue; }
            while (($line = fgets($fh)) !== false) {
                $day = ecUsageLineDay($line);
                if ($day === null) { continue; }
                if ($first === '' || $day < $first) { $first = $day; }
                if ($last === ''  || $day > $last)  { $last  = $day; }
            }
            fclose($fh);
        }
    }
    return array($first, $last);
}

/** True when a parsed row's day falls in [$from, $to] inclusive; '' on either side means unbounded. */
function ecUsageRowInWindow(array $row, $from, $to)
{
    if ($from !== '' && $row['day'] < $from) { return false; }
    if ($to   !== '' && $row['day'] > $to)   { return false; }
    return true;
}

/** A blank per-bucket accumulator: totals, a daily series, and named field tallies -- everything a
 * table or a chart on spock.php reads, and nothing a row array is needed for afterward. */
function ecUsageNewSeries(array $fields)
{
    $s = array(
        'bucketTotals' => array('visitor' => 0, 'visit' => 0),
        'daily'        => array('visitor' => array(), 'visit' => array()),
        'countBy'      => array(),
    );
    foreach ($fields as $f) { $s['countBy'][$f] = array('visitor' => array(), 'visit' => array()); }
    return $s;
}

/** Folds one parsed row into a series accumulator, if its day is in the window. The three things
 * this file promises never to lose stay true here: two buckets, never summed; a day outside the
 * window contributes nothing; a field the row does not carry counts as '(none)'. */
function ecUsageFeedSeries(array &$s, array $row, $from, $to)
{
    if (!ecUsageRowInWindow($row, $from, $to)) { return; }
    $b = $row['bucket'];
    $s['bucketTotals'][$b]++;
    if (!isset($s['daily'][$b][$row['day']])) { $s['daily'][$b][$row['day']] = 0; }
    $s['daily'][$b][$row['day']]++;
    foreach (array_keys($s['countBy']) as $field) {
        $v = isset($row[$field]) ? $row[$field] : '';
        if ($v === '') { $v = '(none)'; }
        if (!isset($s['countBy'][$field][$b][$v])) { $s['countBy'][$field][$b][$v] = 0; }
        $s['countBy'][$field][$b][$v]++;
    }
}

/** A series' daily counts over a fixed day list, so a quiet day is a zero rather than a gap --
 * the same guarantee ecUsageDaily() makes for a row array, made here from the partial map
 * ecUsageFeedSeries() built (which holds only the days that actually had a row). */
function ecUsageFinalizeDaily(array $daily, array $days)
{
    $out = array('visitor' => array(), 'visit' => array());
    foreach ($days as $d) {
        $out['visitor'][$d] = isset($daily['visitor'][$d]) ? $daily['visitor'][$d] : 0;
        $out['visit'][$d]   = isset($daily['visit'][$d])   ? $daily['visit'][$d]   : 0;
    }
    return $out;
}

/**
 * Streams every log in every directory exactly once and returns only the aggregates spock.php
 * prints -- bucket totals, a daily series and named field tallies per kind, plus the two derived
 * series the page filters out of 'signal' and 'view' (preset clicks; contact-page views) and the
 * reach log's classified-row count. No row is kept once it has been folded into its series, so
 * peak memory is bounded by the OUTPUT (days x distinct field values across the six logs), never
 * by how many lines the logs hold.
 *
 * @param array $dirs directories, oldest first (see ecUsageReadAll).
 * @param string $from string $to the day window, both 'YYYY-MM-DD'; '' means unbounded.
 */
function ecUsageReportBuild(array $dirs, $from, $to)
{
    $fieldsByKind = array(
        'view'   => array('page', 'lang', 'pointer'),
        'calc'   => array('page'),
        'naming' => array('field', 'page'),
        'reach'  => array('lang', 'source', 'asked'),
        'signal' => array('event', 'detail'),
        'send'   => array(),
    );
    $series = array();
    foreach ($fieldsByKind as $kind => $fields) { $series[$kind] = ecUsageNewSeries($fields); }
    $presets         = ecUsageNewSeries(array('detail', 'asked'));
    $contactViews    = ecUsageNewSeries(array());
    $reachClassified = 0;
    $sources         = array();

    foreach ($dirs as $dir) {
        $any = 0;
        foreach (ecUsageLogKinds() as $name => $kind) {
            $path = rtrim($dir, '/') . '/' . $name;
            if (!is_file($path)) { continue; }
            $fh = @fopen($path, 'rb');
            if (!$fh) { continue; }
            while (($line = fgets($fh)) !== false) {
                $row = ecUsageParseRow($kind, $line);
                if ($row === null) { continue; }
                $any++;
                if (!isset($series[$kind])) { continue; }
                ecUsageFeedSeries($series[$kind], $row, $from, $to);

                if ($kind === 'reach' && $row['classified'] && ecUsageRowInWindow($row, $from, $to)) {
                    $reachClassified++;
                }
                if ($kind === 'signal' && $row['event'] === 'units'
                    && strpos($row['detail'], 'preset:') === 0) {
                    ecUsageFeedSeries($presets, $row, $from, $to);
                }
                if ($kind === 'view' && $row['page'] === 'contact') {
                    ecUsageFeedSeries($contactViews, $row, $from, $to);
                }
            }
            fclose($fh);
        }
        if ($any) { $sources[] = array('dir' => $dir, 'rows' => $any); }
    }

    return array(
        'series'          => $series,
        'presets'         => $presets,
        'contactViews'    => $contactViews,
        'reachClassified' => $reachClassified,
        'sources'         => $sources,
    );
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
