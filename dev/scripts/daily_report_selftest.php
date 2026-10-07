<?php
/**
 * daily_report_selftest.php -- the RANK BY SHOPPING section daily_report.sh mails carries column
 * headings and honest bucket labels. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY. Tom's review queue, R-121/122/123: he read the daily cron mail and could not tell what the
 * numbers in "rank by shopping" were, then guessed "page loads" includes robots and "people" means
 * a long browsing session. Both guesses were reasonable and both are wrong: log/lang-log-stats.sh
 * already prints a header row on this table (rank/page/people/page loads), but
 * dev/scripts/daily_report.sh's own extraction awk picks up only lines starting with a digit, so
 * the mailed copy dropped the header along with every other line of prose -- Tom's mailbox never
 * had a heading to read. Checked against the source: "people" is the CONSENTED bucket ($NF !=
 * "visit" in lang-log-stats.sh), one row per person per page, nothing to do with dwell time;
 * "page loads" is everybody else. Both columns of THIS table are built from
 * engcalcs-human-view.log, the >=10s-dwell "shopping" beacon, so both already exclude nearly all
 * robots by behaviour -- there is no user-agent or robot list anywhere in this codebase (grepped).
 *
 * A FIXTURE, NOT AN ASSERTION ABOUT THE SHELL CODE, for the same reason log_format_selftest.php and
 * usage_report_selftest.php read a fixture through the real report rather than eyeballing the
 * script: the failure here is exactly a good-looking table with the wrong (or no) heading, which
 * nothing but running the real extraction over real-shaped input can catch. The fixture
 * log/lang-log-stats.sh is a stand-in (POSIX sh, so this runs the same on a dash /bin/sh as on the
 * host's bash) that prints one RANK BY SHOPPING block in the real script's exact shape; the real
 * lang-log-stats.sh itself is log_format_selftest.php's job, not this one's.
 *
 *   php dev/scripts/daily_report_selftest.php
 */
$root = dirname(__DIR__, 2);

$fail = 0;
function ec_dr_expect($label, $ok, $detail = '') {
    global $fail;
    if ($ok) { echo "  ok   $label\n"; return; }
    $fail++;
    echo "  FAIL $label" . ($detail !== '' ? "\n        $detail" : '') . "\n";
}

$tmp = sys_get_temp_dir() . '/daily_report_selftest_' . getmypid();
@mkdir($tmp, 0777, true);
@mkdir($tmp . '/log', 0777, true);

// A minimal stand-in for log/lang-log-stats.sh, POSIX /bin/sh only (no bash-only substitutions),
// reproducing just the shape daily_report.sh's picker reads: a RANK BY SHOPPING banner, some prose
// before the table (which the picker must skip), the real header printf, two data rows, and the
// trailing "reach rows:" line the picker also grabs.
$fixtureScript = <<<'SH'
#!/bin/sh
echo "   WINDOW        2026-01-01T00:00:00Z  ..  2026-01-02T00:00:00Z"
echo "   DURATION      1.0 days"
echo "   FINGERPRINT   src=fixture win=x days=1.0 rows=1/1/1/0/0/0"
echo ""
echo "==============================================================================="
echo " RANK BY SHOPPING (fixture)"
echo "==============================================================================="
echo "   some explanatory prose a real reader would have to skip past."
echo ""
printf "   %-6s %-28s %14s %16s\n" "" "" "browsers" "page loads"
printf "   %-6s %-28s %14s %16s\n" "rank" "page" "(said yes)" "(everyone else)"
printf "   %-6d %-28s %14d %16d\n" 1 "Fixture-Calculator" 3 7
printf "   %-6d %-28s %14d %16d\n" 2 "Second-Calculator" 1 1
echo ""
echo "   Rank is by the people bucket, with the page-load bucket printed beside it."
echo ""
echo "    PAGE LOADS - reach rows: 8   classified: 8   unclassified (older format): 0"
SH;
file_put_contents($tmp . '/log/lang-log-stats.sh', $fixtureScript);

// The tester log (2026-10-07): two tester browsers used today, one yesterday, one held-out row in
// the last 24 hours, two marks set and none cleared. Rows in the exact shape ecLogTester() writes.
$today = gmdate('Y-m-d');
$yday  = gmdate('Y-m-d', time() - 86400);
$nowTs = gmdate('Y-m-d\TH:i:s\Z', time() - 60);
file_put_contents($tmp . '/log/engcalcs-tester.log', implode('', array(
    $yday  . "T09:00:00Z\ton\tManning-Pipe-Flow\tvisit\n",
    $yday  . "T09:00:00Z\tday\tManning-Pipe-Flow\tvisit\n",
    $today . "T00:00:01Z\tday\tLooped-Network\tvisit\n",
    $today . "T00:00:02Z\ton\tDarcy-Weisbach\tvisitor\n",
    $today . "T00:00:02Z\tday\tDarcy-Weisbach\tvisitor\n",
    $nowTs . "\tshopping\tDarcy-Weisbach\tvisitor\n",
)));
chmod($tmp . '/log/lang-log-stats.sh', 0755);

$phpBin = PHP_BINARY ?: 'php';
$env = array(
    'EC_PROD'      => $tmp,
    'EC_MIRROR'    => $tmp . '/no-such-mirror',
    'EC_CHECKLOG'  => $tmp . '/no-such-checklog',
    'EC_CHECKLAST' => $tmp . '/no-such-checklast',
    'EC_PHP'       => $phpBin,
    'EC_MAILDIR'   => $tmp . '/no-such-maildir',
    'PATH'         => getenv('PATH'),
);
$envPrefix = '';
foreach ($env as $k => $v) { $envPrefix .= $k . '=' . escapeshellarg($v) . ' '; }
$cmd = $envPrefix . 'sh ' . escapeshellarg($root . '/dev/scripts/daily_report.sh') . ' 2>&1';
$out = shell_exec($cmd);
$out = is_string($out) ? $out : '';

$usageStart = strpos($out, 'USAGE, from the production logs');
$usage = $usageStart === false ? '' : substr($out, $usageStart);

ec_dr_expect('the USAGE section ran at all', $usageStart !== false,
    'full output: ' . substr($out, 0, 2000));

// ---- R-121: headings. The literal header row lang-log-stats.sh already prints must survive the
// extraction, not just daily_report.sh's own synthesized label line. ----------------------------
ec_dr_expect('the rank-by-shopping table keeps its column header row, with the 2026-10-07 names',
    (bool) preg_match('/browsers\s+page loads\s*\n\s*rank\s+page\s+\(said yes\)\s+\(everyone else\)/', $usage), $usage);
ec_dr_expect('a data row (Fixture-Calculator, 3, 7) still comes through',
    (bool) preg_match('/Fixture-Calculator\s+3\s+7/', $usage), $usage);

// ---- R-123: "people" is the consented bucket, never "long-dwell". ------------------------------
ec_dr_expect('the mail states what "browsers (said yes)" means (consented, first time per page, a year)',
    strpos($usage, 'accepted the consent banner') !== false
    && strpos($usage, 'not again for a year') !== false, $usage);
ec_dr_expect('the mail says both counts need 10+ seconds on the page',
    strpos($usage, '10+ seconds on the page') !== false, $usage);

// ---- R-122: "page loads" does not silently claim or deny robots without saying why. ------------
ec_dr_expect('the mail states what "page loads (everyone else)" means (one row per view)',
    (bool) preg_match('/page loads \(everyone else\)\s+one row per page view/', $usage), $usage);

// ---- Tom, 2026-10-07: the side count of tester browsers. ---------------------------------------
ec_dr_expect('the mail carries a tester-browser side count',
    strpos($usage, 'Tester browsers (marked by ?ec_nolog=1)') !== false, $usage);
ec_dr_expect('today shows 2 tester browsers (two day rows today)',
    (bool) preg_match('/' . preg_quote($today, '/') . '\s+2\b/', $usage), $usage);
ec_dr_expect('yesterday shows 1 tester browser',
    (bool) preg_match('/' . preg_quote($yday, '/') . '\s+1\b/', $usage), $usage);
ec_dr_expect('one tester row was held out of the counts in the last 24 hours',
    strpos($usage, 'tester rows held out of the counts, last 24 hours: 1') !== false, $usage);
ec_dr_expect('marks set and cleared are counted from the whole file',
    strpos($usage, 'browsers marked since ' . $yday . ': 2; marks cleared: 0') !== false, $usage);
ec_dr_expect('the mail gives the true, checked answer on robots (excluded by the dwell gate, '
    . 'not by a robot list)', strpos($usage, 'robots are') !== false, $usage);

// ---- Tom, 2026-10-05: the table read as one day's usage and was the whole log. Each table names
// its window in its own heading, and the reach-rows diagnostic is not printed as if it were a total.
ec_dr_expect('a LAST 24 HOURS table is headed as such',
    strpos($usage, 'LAST 24 HOURS') !== false, $usage);
ec_dr_expect('the whole-log table says it is not one day, with its duration and dates',
    (bool) preg_match('/WHOLE LOG, which restarts on the 1st \(1\.0 days, 2026-01-01 to 2026-01-02\)/', $usage), $usage);
ec_dr_expect('a zero old-format count prints no reach-rows line',
    strpos($usage, 'reach rows') === false, $usage);

// cleanup
@unlink($tmp . '/log/lang-log-stats.sh');
@unlink($tmp . '/log/engcalcs-tester.log');
@rmdir($tmp . '/log');
@rmdir($tmp);

echo $fail === 0 ? "PASS\n" : "FAIL ($fail)\n";
exit($fail === 0 ? 0 : 1);
