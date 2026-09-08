<?php
/**
 * search_console_summary.php -- one Search Console export, read into the shape
 * dev/usage-data-log.md records.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * Search Console is the one instrument this project has for WHERE visitors come from: the usage
 * logs record no referrer by design. An export is a zip of CSVs (Chart, Queries, Pages, Countries,
 * Devices, Search appearance, Filters) downloaded by hand from the Performance report, and until
 * 2026-09-08 it was read by hand too, so the 2026-07-27 clusters were whatever somebody typed that
 * day and the next export could not be compared to them. This script IS the reading: the clusters
 * are regular expressions below, printed with the numbers, so the next export gets the same
 * clusters and a disagreement is a change in the audience rather than in the reader.
 *
 *   php dev/scripts/search_console_summary.php <export.zip | directory-of-csvs>
 *
 * Reads only; writes nothing; the output is pasted into dev/usage-data-log.md under a dated
 * heading. Queries.csv is CAPPED AT 1,000 ROWS by Google, so every query-cluster number is a
 * share of that sample and never of the site -- Chart.csv carries the site totals.
 */

$arg = $argv[1] ?? '';
if ($arg === '') {
    fwrite(STDERR, "usage: php dev/scripts/search_console_summary.php <export.zip | directory>\n");
    exit(1);
}
$dir = $arg;
if (is_file($arg) && preg_match('/\.zip$/i', $arg)) {
    $dir = sys_get_temp_dir() . '/engcalcs-sc-' . getmypid();
    @mkdir($dir, 0700, true);
    if (class_exists('ZipArchive')) {
        $z = new ZipArchive();
        if ($z->open($arg) !== true) { fwrite(STDERR, "cannot open $arg\n"); exit(1); }
        $z->extractTo($dir);
        $z->close();
    } elseif (trim((string) shell_exec('command -v unzip')) !== '') {
        shell_exec('unzip -o -q ' . escapeshellarg($arg) . ' -d ' . escapeshellarg($dir));
    } elseif (trim((string) shell_exec('command -v python3')) !== '') {
        shell_exec('python3 -c ' . escapeshellarg("import zipfile,sys; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])")
            . ' ' . escapeshellarg($arg) . ' ' . escapeshellarg($dir));
    } else {
        fwrite(STDERR, "no ZipArchive, unzip or python3 here: unpack the zip yourself and pass the directory\n");
        exit(1);
    }
}
if (!is_dir($dir)) { fwrite(STDERR, "not a directory: $dir\n"); exit(1); }

function sc_rows(string $dir, string $name): array {
    $p = "$dir/$name";
    if (!is_file($p)) return [];
    $fh = fopen($p, 'r');
    $head = fgetcsv($fh);
    if ($head === false) return [];
    $head[0] = preg_replace('/^\xEF\xBB\xBF/', '', $head[0]);   // the BOM Google writes
    $out = [];
    while (($r = fgetcsv($fh)) !== false) {
        if (count($r) !== count($head)) continue;
        $out[] = array_combine($head, $r);
    }
    fclose($fh);
    return $out;
}
function sc_int($s): int { return (int) str_replace(',', '', (string) $s); }
function sc_ctr(int $c, int $i): string { return $i ? sprintf('%.1f%%', 100 * $c / $i) : '-'; }

// ---- window and totals, from Chart.csv ---------------------------------------------------------
$chart = sc_rows($dir, 'Chart.csv');
$filters = sc_rows($dir, 'Filters.csv');
$dates = array_column($chart, 'Date');
sort($dates);
$tc = array_sum(array_map(fn($r) => sc_int($r['Clicks']), $chart));
$ti = array_sum(array_map(fn($r) => sc_int($r['Impressions']), $chart));
echo "SEARCH CONSOLE EXPORT\n";
foreach ($filters as $f) { echo "  filter: {$f['Filter']} = {$f['Value']}\n"; }
printf("  days with data: %d   from %s to %s\n", count($chart), $dates[0] ?? '?', end($dates) ?: '?');
printf("  site totals (Chart.csv): %s clicks, %s impressions, CTR %s\n", number_format($tc), number_format($ti), sc_ctr($tc, $ti));

// ---- devices: the one EXTERNAL device signal, search arrivals only -----------------------------
echo "\nDEVICES (search arrivals only -- not the audience, but the only device figure outside Task 285's own column)\n";
foreach (sc_rows($dir, 'Devices.csv') as $r) {
    printf("  %-8s %6s clicks (%4.1f%%)  %7s impressions (%4.1f%%)  CTR %s  position %s\n", $r['Device'],
        number_format(sc_int($r['Clicks'])), $tc ? 100 * sc_int($r['Clicks']) / $tc : 0,
        number_format(sc_int($r['Impressions'])), $ti ? 100 * sc_int($r['Impressions']) / $ti : 0,
        $r['CTR'], $r['Position']);
}
foreach (sc_rows($dir, 'Search appearance.csv') as $r) {
    printf("  search appearance: %s -- %s clicks, %s impressions, CTR %s\n", $r['Search Appearance'],
        $r['Clicks'], $r['Impressions'], $r['CTR']);
}

// ---- countries: the unit-preset evidence -------------------------------------------------------
$co = sc_rows($dir, 'Countries.csv');
$cc = array_sum(array_map(fn($r) => sc_int($r['Clicks']), $co));
echo "\nCOUNTRIES (clicks; the evidence behind the English-page unit preset in lib/Units.lib.php)\n";
foreach (array_slice($co, 0, 15) as $r) {
    printf("  %-22s %6s  %5.1f%%   %7s impressions\n", $r['Country'], number_format(sc_int($r['Clicks'])),
        $cc ? 100 * sc_int($r['Clicks']) / $cc : 0, number_format(sc_int($r['Impressions'])));
}
$us = 0; $angloSi = 0;
$angloSiNames = ['Canada', 'Australia', 'United Kingdom', 'India', 'Ireland', 'New Zealand', 'South Africa',
    'Nigeria', 'Philippines', 'Pakistan', 'Kenya', 'Singapore', 'Malaysia', 'Ghana'];
foreach ($co as $r) {
    if ($r['Country'] === 'United States') $us += sc_int($r['Clicks']);
    if (in_array($r['Country'], $angloSiNames, true)) $angloSi += sc_int($r['Clicks']);
}
printf("  United States share of clicks: %.1f%%\n", $cc ? 100 * $us / $cc : 0);
printf("  English-reading, SI-working countries (%s): %.1f%%\n", implode(', ', $angloSiNames), $cc ? 100 * $angloSi / $cc : 0);

// ---- queries: the clusters, as regular expressions ---------------------------------------------
$q = sc_rows($dir, 'Queries.csv');
$qc = array_sum(array_map(fn($r) => sc_int($r['Clicks']), $q));
$qi = array_sum(array_map(fn($r) => sc_int($r['Impressions']), $q));
printf("\nQUERIES -- Queries.csv holds Google's top %d rows: %s clicks, %s impressions. A SAMPLE, never the site.\n",
    count($q), number_format($qc), number_format($qi));
$clusters = [
    ['Manning',                  '/manning/i'],
    ['Sewer / drainage',         '/sewer|drain|storm|culvert|invert|sanitary|wastewater/i'],
    ['Slope / grade / fall',     '/slope|grade|gradient|fall|\bpitch\b/i'],
    ['Hazen-Williams',           '/hazen|williams/i'],
    ['Channel / trapezoid',      '/channel|trapezoid|ditch|open/i'],
    ['Darcy / friction factor',  '/darcy|weisbach|friction factor|moody|colebrook/i'],
    ['Weir',                     '/weir/i'],
    ['Culvert',                  '/culvert/i'],
    ['Peaking factor / Harmon',  '/peak|harmon/i'],
    ['Orifice',                  '/orifice/i'],
    ['Network / EPANET / looped', '/epanet|network|looped|\bloop\b|water distribution|hardy|libre/i'],
    ['LLM-retrieval-shaped',     '/\bsource\b|\bpdf\b|reference|authoritative|full pipe|pressuri|d\/4|hydraulic radius/i'],
];
printf("  %-28s %5s %8s %7s %6s\n", 'cluster (regex in this script)', 'q', 'impr', 'clicks', 'CTR');
foreach ($clusters as [$name, $re]) {
    $rs = array_filter($q, fn($r) => preg_match($re, $r['Top queries']));
    $c = array_sum(array_map(fn($r) => sc_int($r['Clicks']), $rs));
    $i = array_sum(array_map(fn($r) => sc_int($r['Impressions']), $rs));
    printf("  %-28s %5d %8s %7s %6s\n", $name, count($rs), number_format($i), number_format($c), sc_ctr($c, $i));
}
// The sewer-slope cluster on its own, minus anything Manning already wins.
$ss = array_filter($q, fn($r) => preg_match('/sewer|drain|storm|slope|grade|gradient|fall/i', $r['Top queries'])
    && !preg_match('/manning/i', $r['Top queries']));
$c = array_sum(array_map(fn($r) => sc_int($r['Clicks']), $ss));
$i = array_sum(array_map(fn($r) => sc_int($r['Impressions']), $ss));
printf("\n  SEWER-SLOPE DEMAND, Manning excluded: %d queries, %s impressions, %s clicks, CTR %s\n", count($ss),
    number_format($i), number_format($c), sc_ctr($c, $i));
usort($ss, fn($a, $b) => sc_int($b['Impressions']) <=> sc_int($a['Impressions']));
foreach (array_slice($ss, 0, 12) as $r) {
    printf("    %-52s %5s impr %4s clicks  pos %5s\n", mb_substr($r['Top queries'], 0, 52), $r['Impressions'], $r['Clicks'], $r['Position']);
}
echo "\n  top queries by clicks:\n";
foreach (array_slice($q, 0, 10) as $r) {
    printf("    %-52s %5s clicks %6s impr  CTR %6s  pos %5s\n", mb_substr($r['Top queries'], 0, 52), $r['Clicks'], $r['Impressions'], $r['CTR'], $r['Position']);
}
echo "\n  network / EPANET / looped queries (every one):\n";
foreach ($q as $r) {
    if (preg_match('/epanet|network|looped|\bloop\b|water distribution|hardy|libre/i', $r['Top queries'])) {
        printf("    %-52s %5s clicks %6s impr  pos %5s\n", mb_substr($r['Top queries'], 0, 52), $r['Clicks'], $r['Impressions'], $r['Position']);
    }
}
$nonLatin = count(array_filter($q, fn($r) => preg_match('/[^\x00-\x7F]/', $r['Top queries'])));
echo "  queries with a non-ASCII character (translated-string searches and the like): $nonLatin\n";

// ---- pages: which calculators, which hosts, which languages ------------------------------------
$p = sc_rows($dir, 'Pages.csv');
$pc = array_sum(array_map(fn($r) => sc_int($r['Clicks']), $p));
$pi = array_sum(array_map(fn($r) => sc_int($r['Impressions']), $p));
printf("\nPAGES -- %d URLs, %s clicks, %s impressions\n", count($p), number_format($pc), number_format($pi));
$hosts = []; $pages = []; $langs = [];
foreach ($p as $r) {
    $u = $r['Top pages'];
    $h = preg_match('#^https?://([^/]+)#', $u, $m) ? $m[1] : '?';
    $hosts[$h] = ($hosts[$h] ?? 0) + sc_int($r['Clicks']);
    if (preg_match('#/engcalcs/([^?]*)#', $u, $m)) $key = $m[1] === '' ? 'index' : $m[1];
    elseif (preg_match('#/app/?(\?|$)#', $u)) $key = '/app';
    else $key = "$h:other";
    $pages[$key] = $pages[$key] ?? [0, 0, 0];
    $pages[$key][0] += sc_int($r['Clicks']); $pages[$key][1] += sc_int($r['Impressions']); $pages[$key][2]++;
    $l = preg_match('/[?&]lang=([a-z]{2})/', $u, $m) ? $m[1] : '(none)';
    $langs[$l] = $langs[$l] ?? [0, 0];
    $langs[$l][0] += sc_int($r['Clicks']); $langs[$l][1] += sc_int($r['Impressions']);
}
arsort($hosts);
echo "  by host (clicks): " . implode(', ', array_map(fn($k, $v) => "$k $v", array_keys($hosts), $hosts)) . "\n";
uasort($pages, fn($a, $b) => $b[1] <=> $a[1]);
echo "  by page (impressions order; a page's URL variants pooled):\n";
foreach (array_slice($pages, 0, 24, true) as $k => $v) {
    printf("    %-36s %6s clicks %7s impr  %3d URLs\n", $k, number_format($v[0]), number_format($v[1]), $v[2]);
}
echo "  Looped-Network, /app and librewaternet rows, every one:\n";
$any = false;
foreach ($p as $r) {
    if (preg_match('#Looped-Network|librewaternet|/app\b#i', $r['Top pages'])) {
        $any = true;
        printf("    %-78s %3s clicks %4s impr  pos %5s\n", mb_substr($r['Top pages'], 0, 78), $r['Clicks'], $r['Impressions'], $r['Position']);
    }
}
if (!$any) echo "    (none -- and librewaternet.org is its own Search Console property, invisible in a hawsedc.com export)\n";
uasort($langs, fn($a, $b) => $b[0] <=> $a[0]);
echo "  by ?lang= (clicks / impressions):\n";
foreach (array_slice($langs, 0, 12, true) as $k => $v) {
    printf("    %-8s %6s / %7s\n", $k, number_format($v[0]), number_format($v[1]));
}
