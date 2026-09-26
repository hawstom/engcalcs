<?php
/**
 * spock.php -- the usage report page (ROADMAP: Tom, 2026-09-17, *"Would it be a good idea to serve
 * a usage report web page? ... password protection might be nice. Historical graphs might be
 * nice."* Tom, 2026-09-24, R-212: *"I would like a URL I can visit that gives scripted views of our
 * logs ... It doesn't have to be secret, but we won't publish or link it. How about
 * `engcalcs/spock.php` or `engcalcs/spock-cast.php`?"*).
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * A PRIVATE INSTRUMENT, NOT A SUITE PAGE, AND NOT PASSWORD PROTECTED. Tom no longer wants a
 * password (R-212: "it doesn't have to be secret"), so this lives at the suite root rather than in
 * a directory of its own -- the earlier `usage-report/` directory existed only so an HTTP Basic
 * directive could not 500 the whole suite if the host refused `AllowOverride AuthConfig`; with no
 * auth directive there is nothing that can 500, so the directory-of-its-own reason is gone and this
 * moved to the root. It is deliberately not in the nav, not in the menus, not in the sitemap, not
 * in the manifest and not in the service worker precache (`ecSwPageExclusions()`), and it calls no
 * page header helper, so `generate_sitemap.php`, `page_meta_check.php` and `calculator_page_check.php`
 * all read it as the endpoint it is rather than as a page that forgot its furniture. "Not secret"
 * is not "advertised": noindex is set both ways below (meta robots and `X-Robots-Tag`, since no
 * `.htaccess` protects this file the way `usage-report/.htaccess` once did) and it is named nowhere
 * a crawler or a visitor would find it.
 *
 * THIS FILE IS A DIFFERENT THING FROM `spock/`, the sibling directory. `spock/` holds rotated log
 * archives (denied outright) and `spock/public/`, the ONE aggregate report Tom explicitly approved
 * publishing ("spock: Make it reachable", 2026-08-23) via `publish_usage_report.sh`, generated on
 * production and gitignored. A request for this file's exact name, `spock.php`, is unambiguous
 * under Apache -- it never falls back to the `spock/` directory index, which stays undeniable by
 * `spock/.htaccess`'s `Require all denied` regardless. `spock/public/` keeps its own separate
 * grant and its own separate audience (an unguessable published URL); nothing here changes it.
 *
 * IT STORES NOTHING ON A VISITOR'S DEVICE. No cookie, no local storage, no session, no script at
 * all. It does not even require lib/config.inc.php, whose load-time behaviour reads and can clear
 * analytics cookies; the only thing it would have bought is the six log paths, and the six
 * basenames are already spelled in lib/UsageReport.lib.php with a selftest holding them against
 * config's own constants.
 *
 * IT WRITES NOTHING EITHER. It reads log/ and spock/<archive>/ and that is all: no row, no state
 * file, no cache. log/lang-log-stats.sh remains the authority, and every number here is
 * re-derivable by running it.
 *
 * THE TWO BUCKETS ARE NEVER SUMMED. See lib/UsageReport.lib.php for what each one counts. Every
 * table below has a PEOPLE column and a PAGE LOADS column and no total column, and every chart
 * draws one bucket with its own scale.
 */

require_once __DIR__ . '/lib/UsageReport.lib.php';

// Belt and braces on the search engines, since the meta tag alone is not itself a promise of
// non-indexing, and there is no .htaccess beside this file (it lives at the suite root) to add the
// header the way usage-report/.htaccess and spock/public/.htaccess once did.
header('X-Robots-Tag: noindex, nofollow');

$root     = __DIR__;
$liveDir  = $root . '/log';
$spockDir = $root . '/spock';

// Archives first, oldest first, then the live logs: that is chronological order, and it is what
// lets this page show a window older than the last rotation. spock/public and spock/reports are
// not archives -- see spock/README.md.
// EC_USAGE_REPORT_DIRS is the ONE door for a fixture, and it is a CONSTANT rather than a query
// parameter on purpose: dev/scripts/usage_report_selftest.php defines it before including this
// file, and nothing arriving over HTTP can define a constant. A directory named in a request would
// have been a file-disclosure hole with a report page drawn around it.
if (defined('EC_USAGE_REPORT_DIRS')) {
    $dirs = array_values((array) unserialize(EC_USAGE_REPORT_DIRS));
} else {
    $dirs = array();
    foreach (glob($spockDir . '/*', GLOB_ONLYDIR) ?: array() as $d) {
        $b = basename($d);
        if ($b === 'public' || $b === 'reports') { continue; }
        $dirs[] = $d;
    }
    sort($dirs);
    $dirs[] = $liveDir;
}

// Reading the whole record twice, streaming both times, and never materialising a row array: the
// first pass (ecUsageStreamSpan) finds the first/last day at O(1) memory so the window below can be
// computed; the second (ecUsageReportBuild) folds every row straight into the aggregates this page
// prints. Peak memory is bounded by the OUTPUT -- days x distinct field values -- never by how many
// lines engcalcs-lang.log holds, which is what lets "all" run on an 11+ MB, ever-growing log.
list($firstDay, $lastDay) = ecUsageStreamSpan($dirs);

// The window. A plain query parameter, no form and no stored preference: this page remembers
// nothing about anybody.
$choices = array(30, 90, 365, 0);
$days = isset($_GET['days']) ? (int) $_GET['days'] : 90;
if (!in_array($days, $choices, true)) { $days = 90; }

$today = gmdate('Y-m-d');
$to    = ($lastDay !== '' && $lastDay > $today) ? $lastDay : $today;
if ($days > 0) {
    $from = gmdate('Y-m-d', strtotime($to . ' UTC') - ($days - 1) * 86400);
    if ($firstDay !== '' && $from < $firstDay) { $from = $firstDay; }
} else {
    $from = $firstDay !== '' ? $firstDay : $to;
}
$range = ecUsageDayRange($from, $to);

$report = ecUsageReportBuild($dirs, $from, $to);
$series = $report['series'];

$view   = $series['view'];
$calc   = $series['calc'];
$reach  = $series['reach'];
$naming = $series['naming'];
$signal = $series['signal'];
$send   = $series['send'];

function ur_h($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }

/** The two charts of one pre-built series, side by side, each with its own scale and its own unit. */
function ur_charts($series, $range, $caption, $source)
{
    $daily = ecUsageFinalizeDaily($series['daily'], $range);
    $tot   = $series['bucketTotals'];
    echo '<h3>' . ur_h($caption) . '</h3>';
    echo '<p class="src">' . ur_h($source) . '</p>';
    echo '<div class="pair">';
    echo '<figure><figcaption>PEOPLE: ' . $tot['visitor'] . ' row(s), deduplicated per person per page</figcaption>'
       . ecUsageBarsSvg($daily['visitor'], 'people', 'var(--people)') . '</figure>';
    echo '<figure><figcaption>PAGE LOADS: ' . $tot['visit'] . ' row(s), one per page load</figcaption>'
       . ecUsageBarsSvg($daily['visit'], 'page loads', 'var(--loads)') . '</figure>';
    echo '</div>';
}

/** One table of a pre-built series' field tally, two bucket columns, no total column anywhere. */
function ur_table($series, $field, $caption, $source, $limit = 40)
{
    $c = $series['countBy'][$field];
    $keys = array_keys($c['visitor'] + $c['visit']);
    // Ordered by the people column, then by page loads, so the strongest signal leads.
    usort($keys, function ($a, $b) use ($c) {
        $pa = isset($c['visitor'][$a]) ? $c['visitor'][$a] : 0;
        $pb = isset($c['visitor'][$b]) ? $c['visitor'][$b] : 0;
        if ($pa !== $pb) { return $pb - $pa; }
        $la = isset($c['visit'][$a]) ? $c['visit'][$a] : 0;
        $lb = isset($c['visit'][$b]) ? $c['visit'][$b] : 0;
        return $lb - $la;
    });
    echo '<h3>' . ur_h($caption) . '</h3>';
    echo '<p class="src">' . ur_h($source) . '</p>';
    if (!$keys) { echo '<p class="none">No rows in this window.</p>'; return; }
    echo '<table><thead><tr><th>' . ur_h($field) . '</th><th>people</th><th>page loads</th></tr></thead><tbody>';
    $n = 0;
    foreach ($keys as $k) {
        if ($limit && $n++ >= $limit) { echo '<tr><td colspan="3" class="none">'
            . (count($keys) - $limit) . ' further value(s) not listed</td></tr>'; break; }
        echo '<tr><td>' . ur_h($k) . '</td><td>' . (isset($c['visitor'][$k]) ? $c['visitor'][$k] : 0)
           . '</td><td>' . (isset($c['visit'][$k]) ? $c['visit'][$k] : 0) . '</td></tr>';
    }
    echo '</tbody></table>';
}

// The preset clicks (one event value inside the signal log) and the contact-page views (one page
// value inside the human-view log) were split out while streaming, by ecUsageReportBuild(), rather
// than filtered here out of a row array.
$presets      = $report['presets'];
$contactViews = $report['contactViews'];
$sends        = $send['bucketTotals'];
$contactTot   = $contactViews['bucketTotals'];

$reachClassified = $report['reachClassified'];
// A plain line count of the windowed reach rows -- not a bucket total presented as a metric, just
// how many lines matched, so it is the two bucket totals added for that description only.
$reachWindowCount = $reach['bucketTotals']['visitor'] + $reach['bucketTotals']['visit'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>EngCalcs usage report</title>
<style>
:root { --people: #2f6f4f; --loads: #7a6ea8; --ink: #222; --rule: #ccc; --bg: #fff; }
body { font: 15px/1.5 system-ui, sans-serif; color: var(--ink); background: var(--bg);
       margin: 0 auto; max-width: 62rem; padding: 1.5rem 1rem 4rem; }
h1 { font-size: 1.4rem; margin: 0 0 .25rem; }
h2 { font-size: 1.15rem; margin: 2rem 0 .5rem; border-bottom: 2px solid var(--rule); padding-bottom: .2rem; }
h3 { font-size: 1rem; margin: 1.2rem 0 .1rem; }
p.src { margin: 0 0 .5rem; font-size: .8rem; color: #666; font-family: ui-monospace, monospace; }
p.none { color: #777; font-style: italic; }
table { border-collapse: collapse; margin: .3rem 0 1rem; min-width: 18rem; }
th, td { border: 1px solid var(--rule); padding: .15rem .5rem; text-align: right; }
th:first-child, td:first-child { text-align: left; }
thead th { background: #f2f2f2; }
.pair { display: flex; flex-wrap: wrap; gap: 1rem; }
.pair figure { flex: 1 1 22rem; margin: 0; }
figcaption { font-size: .8rem; color: #555; margin-bottom: .2rem; }
svg.chart { width: 100%; height: 150px; }
svg.chart .axis { stroke: #999; stroke-width: 1; }
svg.chart .grid { stroke: #e0e0e0; stroke-width: 1; }
svg.chart .tick { font-size: 9px; fill: #777; font-family: ui-monospace, monospace; }
.banner { background: #f6f4ea; border: 1px solid #ddd6b8; padding: .6rem .8rem; margin: .8rem 0; }
.ranges a { margin-right: .7rem; }
footer { margin-top: 3rem; border-top: 1px solid var(--rule); padding-top: .8rem;
         font-size: .85rem; color: #555; }
code { background: #f2f2f2; padding: 0 .2rem; }
</style>
</head>
<body>
<h1>EngCalcs usage report</h1>
<p>Window <strong><?= ur_h($from) ?></strong> to <strong><?= ur_h($to) ?></strong>
 (<?= count($range) ?> day<?= count($range) === 1 ? '' : 's' ?>).
 Whole record on disk: <?= $firstDay === '' ? 'no rows' : ur_h($firstDay) . ' to ' . ur_h($lastDay) ?>.</p>
<p class="ranges">Window:
<?php foreach ($choices as $c): ?>
<a href="?days=<?= $c ?>"><?= $c === 0 ? 'all' : 'last ' . $c . ' days' ?></a>
<?php endforeach; ?>
</p>

<div class="banner">
<strong>The two columns are two different things and are never added together.</strong>
<br><strong>PEOPLE</strong> counts rows marked <code>visitor</code>: a visitor who agreed to being
counted once rather than every time, so those rows are deduplicated per person per page.
<br><strong>PAGE LOADS</strong> counts rows marked <code>visit</code>: everybody else. Nothing may
be stored to deduplicate against, so every page load writes a row.
<br>A sum of the two would have a denominator in two units and a numerator in neither. There is no
total column on this page for that reason.
</div>

<h2>Where the rows came from</h2>
<table><thead><tr><th>directory</th><th>rows read</th></tr></thead><tbody>
<?php foreach ($report['sources'] as $s): ?>
<tr><td><?= ur_h(str_replace($root . '/', '', $s['dir'])) ?></td><td><?= $s['rows'] ?></td></tr>
<?php endforeach; ?>
<?php if (!$report['sources']): ?>
<tr><td colspan="2" class="none">No log rows found in log/ or spock/.</td></tr>
<?php endif; ?>
</tbody></table>

<h2>Looking</h2>
<?php
ur_charts($view, $range, 'Confirmed-human page views per day',
    'log/engcalcs-human-view.log, field 1 (timestamp), bucketed on the last field');
ur_table($view, 'page', 'Pages looked at',
    'log/engcalcs-human-view.log, field 2 (page basename)');
ur_table($view, 'lang', 'Language the page was served in',
    'log/engcalcs-human-view.log, field 3 (served language)');
ur_table($view, 'pointer', 'Device pointer',
    'log/engcalcs-human-view.log, field 5. A row with four fields before the bucket predates the '
  . 'column (2026-09-08) and reads as (none), never as fine.');
?>

<h2>Calculating</h2>
<?php
ur_charts($calc, $range, 'Confirmed calculations per day',
    'log/engcalcs-calc-usage.log, field 1 (timestamp)');
ur_table($calc, 'page', 'Calculators actually used',
    'log/engcalcs-calc-usage.log, field 2 (page basename)');
?>

<h2>Naming a calculation</h2>
<?php
ur_charts($naming, $range, 'Naming events per day',
    'log/engcalcs-title.log, field 1 (timestamp)');
ur_table($naming, 'field', 'Naming events by kind',
    'log/engcalcs-title.log, field 5: title or subtitle on a form calculator, save or rename on '
  . 'Looped-Network');
ur_table($naming, 'page', 'Naming events by page',
    'log/engcalcs-title.log, field 2 (page basename)');
?>

<h2>Language reach</h2>
<p class="src">log/engcalcs-lang.log. <?= $reachWindowCount ?> row(s) in this window,
<?= $reachClassified ?> carrying the served/asked pair (fields 5 and 6), the rest written before
that pair existed and reported as older format rather than guessed at.</p>
<?php
ur_charts($reach, $range, 'Reach rows per day',
    'log/engcalcs-lang.log, field 1 (timestamp)');
ur_table($reach, 'lang', 'Language asked for', 'log/engcalcs-lang.log, field 2');
ur_table($reach, 'source', 'How the language was decided',
    'log/engcalcs-lang.log, field 3: get, cookie, browser or anon');
ur_table($reach, 'asked', 'Raw Accept-Language tag',
    'log/engcalcs-lang.log, field 6. Present only on rows carrying the pair.');
?>

<h2>Unit presets</h2>
<?php
ur_charts($presets, $range, 'Preset button clicks per day',
    'log/engcalcs-signal.log, rows whose field 5 is units and whose field 6 begins preset:');
ur_table($presets, 'detail', 'Preset button clicks',
    'log/engcalcs-signal.log, rows whose field 5 is units and whose field 6 begins preset:');
ur_table($presets, 'asked', 'Preset clicks by raw Accept-Language tag',
    'log/engcalcs-signal.log, field 4. This is the measurement behind ecDefaultUnitSet().');
?>

<h2>Behaviour signals</h2>
<?php
ur_charts($signal, $range, 'Behaviour signals per day',
    'log/engcalcs-signal.log, field 1 (timestamp)');
ur_table($signal, 'event', 'Signals by kind',
    'log/engcalcs-signal.log, field 5: outbound, touch, units, repeat, lpn or share');
ur_table($signal, 'detail', 'Signal detail', 'log/engcalcs-signal.log, field 6', 60);
?>

<h2>Contact funnel</h2>
<p class="src">log/engcalcs-human-view.log rows whose page is contact, beside
log/engcalcs-contact-send.log, which formmail.php writes only from its mail() success branch.</p>
<?php
ur_charts($contactViews, $range, 'Contact page viewed per day',
    'log/engcalcs-human-view.log, field 1 (timestamp), rows whose page is contact');
ur_charts($send, $range, 'Messages sent per day',
    'log/engcalcs-contact-send.log, field 1 (timestamp)');
?>
<table><thead><tr><th>step</th><th>people</th><th>page loads</th></tr></thead><tbody>
<tr><td>contact page viewed</td><td><?= $contactTot['visitor'] ?></td><td><?= $contactTot['visit'] ?></td></tr>
<tr><td>message sent</td><td><?= $sends['visitor'] ?></td><td><?= $sends['visit'] ?></td></tr>
</tbody></table>
<p class="none">Divide a column by itself, never across columns: the two buckets count different
things and a ratio mixing them means nothing.</p>

<footer>
<p>Every number here is re-derivable from the files named above. The authority is
<code>bash log/lang-log-stats.sh</code>, which prints the same rows with Wilson intervals and a
window fingerprint; this page is the same data drawn over time.</p>
<p>This page stores nothing on your device: no cookie, no local storage, no session, and no script.
It carries no password; nobody publishes or links this URL.</p>
<p>Generated <?= ur_h(gmdate('Y-m-d H:i')) ?> UTC.</p>
</footer>
</body>
</html>
