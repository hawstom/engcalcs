<?php
/**
 * usage_report_memory_selftest.php -- spock.php's memory is bounded by its OUTPUT, never by how
 * many lines the logs hold. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY. Production error_log, 2026-09-26, four times in three minutes: "PHP Fatal error: Allowed
 * memory size of 134217728 bytes exhausted ... in lib/UsageReport.lib.php on line 88." The cause
 * was ecUsageReadAll() building one PHP associative array per log ROW, and engcalcs-lang.log grows
 * every day (it is 11+ MB on production and never rotates on its own). This generates a synthetic
 * engcalcs-lang.log of the same size (215,000 rows, mixed vintage) and runs the real spock.php over
 * it, once each with the library and page AS THEY STOOD BEFORE THIS FIX (read with `git show` from
 * EC_URM_PREFIX_SHA, the last master commit before it) and once with the CURRENT working tree,
 * both under `php -d memory_limit=128M` -- the production limit -- so this fails the moment either
 * file regresses to materialising rows instead of streaming aggregates.
 *
 * It touches nothing shipped: the fixture is a temporary directory, the page is driven through the
 * EC_USAGE_REPORT_DIRS constant, and log/ is never read or written. It never pushes or reads from
 * origin -- `git show <sha>:...` reads this same repository's local history.
 *
 *   php dev/scripts/usage_report_memory_selftest.php
 */
$root = dirname(__DIR__, 2);
require_once $root . '/lib/UsageReport.lib.php';

$fail = 0;
function ec_urm_expect($label, $ok, $detail = '') {
    global $fail;
    if ($ok) { echo "  ok   $label\n"; return; }
    $fail++;
    echo "  FAIL $label" . ($detail !== '' ? "\n        $detail" : '') . "\n";
}

$MEMORY_LIMIT = '128M';          // the production host's memory_limit -- see the file header.
$ROW_COUNT    = 215000;          // production's engcalcs-lang.log is 11.3 MB; this fixture matches it.

// ---- 1. a synthetic engcalcs-lang.log the same size as production's, mixed vintage -------------
$dir = rtrim(sys_get_temp_dir(), '/') . '/engcalcs-usage-report-memory-selftest-' . getmypid();
@mkdir($dir, 0700, true);

$T = "\t";
$langs   = array('en', 'es', 'fr', 'de', 'pt', 'tr', 'ar', 'zh');
$sources = array('get', 'cookie', 'browser', 'anon');
$pages   = array('Manning-Pipe-Flow', 'Darcy-Weisbach', 'Looped-Network', 'Manning-Trap', 'Orifice-Flow');
$startDay = strtotime('2024-01-01 UTC');

$fh = fopen("$dir/engcalcs-lang.log", 'wb');
$expectVisitor = 0; $expectVisit = 0; $expectClassified = 0;
for ($i = 0; $i < $ROW_COUNT; $i++) {
    $day = gmdate('Y-m-d', $startDay + ($i % 720) * 86400);   // spans just under two years
    $ts  = $day . 'T' . sprintf('%02d:%02d:%02d', $i % 24, intdiv($i, 24) % 60, $i % 60) . 'Z';
    $lang   = $langs[$i % count($langs)];
    $source = $sources[$i % count($sources)];
    $page   = $pages[$i % count($pages)];
    $bucket = ($i % 3 === 0) ? 'visitor' : 'visit';
    if ($bucket === 'visitor') { $expectVisitor++; } else { $expectVisit++; }
    if ($i % 2 === 0) {
        // seven fields: classified, carries served/asked.
        $served = $lang; $asked = $lang . '-x' . ($i % 5);
        fwrite($fh, "$ts$T$lang$T$source$T$page$T$served$T$asked$T$bucket\n");
        $expectClassified++;
    } else {
        // five fields: pre-2026-08-21-style, unclassified.
        fwrite($fh, "$ts$T$lang$T$source$T$page$T$bucket\n");
    }
}
fclose($fh);
$logBytes = filesize("$dir/engcalcs-lang.log");
ec_urm_expect("the fixture log is at least as big as production's (11.3 MB, 2026-09-26)",
    $logBytes >= 11 * 1024 * 1024, round($logBytes / 1048576, 1) . ' MB');

// A little real content in the other five logs too, so the whole page renders, not just Language
// reach -- small on purpose, since they are 0.75 MB or smaller on production and are not the leak.
file_put_contents("$dir/engcalcs-human-view.log",
    "2026-01-01T00:00:00Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}coarse{$T}visit\n"
  . "2026-01-01T00:00:01Z{$T}contact{$T}en{$T}en-us{$T}fine{$T}visitor\n");
file_put_contents("$dir/engcalcs-calc-usage.log",
    "2026-01-01T00:00:02Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}fine{$T}visitor\n");
file_put_contents("$dir/engcalcs-title.log",
    "2026-01-01T00:00:03Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}title{$T}visitor\n");
file_put_contents("$dir/engcalcs-signal.log",
    "2026-01-01T00:00:04Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}units{$T}preset:us{$T}visit\n");
file_put_contents("$dir/engcalcs-contact-send.log",
    "2026-01-01T00:00:05Z{$T}contact{$T}en{$T}en-us{$T}visitor\n");

// ---- 2. the library AS IT STOOD BEFORE THIS FIX, pinned to a commit ---------------------------
// A SHA, never `master`: once the fix merged, `master` WAS the fix and this before-run passed within
// 2 MB, failing the suite that stamps the merge. EC_URM_PREFIX_SHA is the pre-fix code -- the same method dev/scripts/usage_report_selftest.php could not use, because that
// selftest is about correctness on a small fixture, not about a regression to unbounded memory.
const EC_URM_PREFIX_SHA = '3bb08eae571fd24c9708f9bd334936f65ada5697';
$oldRoot = "$dir/oldroot";
@mkdir("$oldRoot/lib", 0700, true);
$oldLib  = shell_exec('git -C ' . escapeshellarg($root) . ' show ' . EC_URM_PREFIX_SHA . ':lib/UsageReport.lib.php 2>&1');
$oldPage = shell_exec('git -C ' . escapeshellarg($root) . ' show ' . EC_URM_PREFIX_SHA . ':spock.php 2>&1');
$haveOld = is_string($oldLib) && strpos($oldLib, '<?php') === 0
        && is_string($oldPage) && strpos($oldPage, '<?php') === 0;
if ($haveOld) {
    file_put_contents("$oldRoot/lib/UsageReport.lib.php", $oldLib);
    file_put_contents("$oldRoot/spock.php", $oldPage);
}
ec_urm_expect('the pre-fix lib/UsageReport.lib.php and spock.php are readable for the before/after run',
    $haveOld, 'git show failed -- is this a shallow clone, or is EC_URM_PREFIX_SHA missing?');

function ec_urm_boot($file, $root, $dir)
{
    file_put_contents($file,
        "<?php\n\$_GET['days'] = 0;\n"
      . "define('EC_USAGE_REPORT_DIRS', " . var_export(serialize(array($dir)), true) . ");\n"
      . "ob_start();\n"
      . "require " . var_export($root . '/spock.php', true) . ";\n"
      . "\$html = ob_get_clean();\n"
      . "echo \$html;\n"
      . "file_put_contents(" . var_export("$dir/peak.txt", true) . ", memory_get_peak_usage(true));\n");
}

/** Runs one root's spock.php over the fixture under the production memory_limit, in its own
 * process (a fatal "exhausted" in-process would take this selftest down with it). Returns
 * [$exitCode, $stderr, $htmlBytes, $peakBytesOrNull]. */
function ec_urm_run($root, $dir, $limit, $label)
{
    $bootFile = "$dir/boot-$label.php";
    $peakFile = "$dir/peak.txt";
    @unlink($peakFile);
    ec_urm_boot($bootFile, $root, $dir);
    $outFile = "$dir/out-$label.html";
    $cmd = escapeshellarg(PHP_BINARY) . ' -d memory_limit=' . escapeshellarg($limit) . ' '
         . escapeshellarg($bootFile) . ' > ' . escapeshellarg($outFile) . ' 2>&1';
    exec($cmd, $unused, $exit);
    $html = (string) file_get_contents($outFile);
    $peak = is_file($peakFile) ? (int) file_get_contents($peakFile) : null;
    return array($exit, $html, $peak);
}

if ($haveOld) {
    // ---- 3. THE DEFECT REPRODUCED: the pre-fix code exhausts 128 MB on this fixture ------------
    list($oldExit, $oldHtml, $oldPeak) = ec_urm_run($oldRoot, $dir, $MEMORY_LIMIT, 'old');
    ec_urm_expect('the PRE-FIX code fails under the 128 MB production limit on an '
        . '11+ MB log -- reproducing the 2026-09-26 production error_log',
        $oldExit !== 0 && stripos($oldHtml, 'Allowed memory size') !== false,
        'exit=' . $oldExit . ' peak=' . ($oldPeak === null ? 'n/a (crashed before reporting)' : $oldPeak)
        . "\n        tail: " . substr(trim($oldHtml), -300));
} else {
    $oldPeak = null;
}

// ---- 4. THE FIX: the current working tree completes, well inside 128 MB -----------------------
list($newExit, $newHtml, $newPeak) = ec_urm_run($root, $dir, $MEMORY_LIMIT, 'new');
ec_urm_expect('the CURRENT code completes under the same 128 MB limit on the same fixture',
    $newExit === 0, 'exit=' . $newExit . "\n        tail: " . substr(trim($newHtml), -400));
ec_urm_expect('it emits no PHP warning, notice or fatal',
    stripos($newHtml, 'Warning:') === false && stripos($newHtml, 'Notice:') === false
    && stripos($newHtml, 'Fatal error') === false && stripos($newHtml, 'Deprecated:') === false);
ec_urm_expect('the page still renders in full', strpos($newHtml, '</html>') !== false);
ec_urm_expect('peak memory was recorded', $newPeak !== null);
if ($newPeak !== null) {
    // Bounded by OUTPUT, not by the 200,000-row input: comfortably under half the 128 MB limit is
    // the actual proof; the exact number is reported below for the record.
    ec_urm_expect('peak memory stays well under the 128 MB limit (< 64 MB)', $newPeak < 64 * 1024 * 1024,
        round($newPeak / 1048576, 1) . ' MB');
}

// ---- 5. the counts are still right on a fixture this size --------------------------------------
ec_urm_expect('the page reports all ' . number_format($ROW_COUNT) . ' reach rows in the "all" window',
    (bool) preg_match('/(\d+) row\(s\) in this window/', $newHtml, $m) && (int) $m[1] === $ROW_COUNT,
    isset($m[1]) ? $m[1] : '(not found)');
ec_urm_expect('the page reports the right classified-row count',
    (bool) preg_match('/(\d+) carrying the served/', $newHtml, $m2) && (int) $m2[1] === $expectClassified,
    isset($m2[1]) ? $m2[1] : '(not found)');
ec_urm_expect('the two buckets on the page still total to the hand-computed visitor/visit split',
    strpos($newHtml, 'PEOPLE: ' . $expectVisitor . ' row(s)') !== false
    && strpos($newHtml, 'PAGE LOADS: ' . $expectVisit . ' row(s)') !== false,
    "expect visitor=$expectVisitor visit=$expectVisit");

// ---- report, whether or not everything passed ---------------------------------------------------
echo "\nPeak memory, " . number_format($ROW_COUNT) . " reach rows (" . round($logBytes / 1048576, 1)
   . " MB log), limit $MEMORY_LIMIT:\n";
echo '  before (pre-fix) : ' . ($oldPeak !== null ? round($oldPeak / 1048576, 1) . ' MB'
    : ($haveOld ? 'exhausted the limit before it could report its own peak' : 'not run')) . "\n";
echo '  after  (this fix): ' . ($newPeak !== null ? round($newPeak / 1048576, 1) . ' MB' : 'not recorded') . "\n";

// ---- cleanup -------------------------------------------------------------------------------------
$sweep = array($dir, "$dir/oldroot", "$dir/oldroot/lib");
foreach ($sweep as $d) { foreach (glob("$d/{,.}*", GLOB_BRACE) ?: array() as $f) { if (is_file($f)) { @unlink($f); } } }
foreach (array_reverse($sweep) as $d) { @rmdir($d); }

if ($fail) {
    echo "\n$fail check(s) failed. spock.php may have gone back to materialising one array per log\n";
    echo "row -- see lib/UsageReport.lib.php's streaming functions (ecUsageStreamSpan,\n";
    echo "ecUsageReportBuild, ecUsageFeedSeries) and keep spock.php reading through them.\n";
    exit(1);
}
echo "\nUsage report memory selftest OK -- bounded by output, not by log size.\n";
exit(0);
