<?php
/**
 * daily_report_selftest.php -- the RANK BY DWELLS section daily_report.sh mails carries column
 * headings and honest bucket labels. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY. Tom's review queue, R-121/122/123: he read the daily cron mail and could not tell what the
 * numbers in the rank table were, then guessed "page loads" includes robots and "people" means
 * a long browsing session. Both guesses were reasonable and both are wrong: log/lang-log-stats.sh
 * already prints a header row on this table (rank/page/people/page loads), but
 * dev/scripts/daily_report.sh's own extraction awk picks up only lines starting with a digit, so
 * the mailed copy dropped the header along with every other line of prose -- Tom's mailbox never
 * had a heading to read. Checked against the source: "people" is the CONSENTED bucket ($NF !=
 * "visit" in lang-log-stats.sh), one row per person per page, nothing to do with dwell time;
 * "others" (formerly "page loads") is everybody else. Both columns of THIS table are built from
 * engcalcs-human-view.log, the page-dwell beacon (>=10s after load, presumed human), so both
 * already exclude nearly all robots by behaviour -- there is no user-agent or robot list anywhere in this codebase (grepped).
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
// reproducing just the shape daily_report.sh's picker reads: a RANK BY DWELLS banner, some prose
// before the table (which the picker must skip), the real header printf, two data rows, and the
// trailing "reach rows:" line the picker also grabs.
// TWO HEADERS, because the daily report reads PRODUCTION's lang-log-stats.sh, which can lag master:
// the new one (2026-10-28: "browsers / dwells, said yes / dwells, others") and the old one
// ("RANK BY SHOPPING", "browsers / said yes / page loads"). The legend must follow whichever printed.
function ec_dr_fixture($new) {
    $banner = $new ? ' RANK BY DWELLS (fixture)' : ' RANK BY SHOPPING (fixture)';
    $head   = $new
        ? 'printf "   %-6s %-28s %10s %16s %14s\\n" "rank" "page" "browsers" "dwells, said yes" "dwells, others"'
        : 'printf "   %-6s %-28s %10s %10s %12s\\n" "rank" "page" "browsers" "said yes" "page loads"';
    $row    = $new ? '%-6d %-28s %10d %16d %14d' : '%-6d %-28s %10d %10d %12d';
    $rows   = $new ? 'rows' : 'reach rows';
    $label  = $new ? 'OTHERS' : 'PAGE LOADS';
    return "#!/bin/sh\n"
. 'echo "   WINDOW        2026-01-01T00:00:00Z  ..  2026-01-02T00:00:00Z"' . "\n"
. 'echo "   DURATION      1.0 days"' . "\n"
. 'echo "   FINGERPRINT   src=fixture win=x days=1.0 rows=1/1/1/0/0/0"' . "\n"
. 'echo ""' . "\n"
. 'echo "==============================================================================="' . "\n"
. 'echo "' . $banner . '"' . "\n"
. 'echo "==============================================================================="' . "\n"
. 'echo "   some explanatory prose a real reader would have to skip past."' . "\n"
. 'echo ""' . "\n"
. $head . "\n"
. 'printf "   ' . $row . '\\n" 1 "Fixture-Calculator" 2 3 7' . "\n"
. 'printf "   ' . $row . '\\n" 2 "Second-Calculator" 1 1 1' . "\n"
. 'echo ""' . "\n"
. 'echo "   Rank is by the people bucket, with the other bucket printed beside it."' . "\n"
. 'echo ""' . "\n"
. 'echo "    ' . $label . ' - ' . ($new ? 'page load' : 'reach') . ' rows: 8   classified: 8   unclassified (older format): 0"' . "\n";
}
$fixtureScript = ec_dr_fixture(true);
file_put_contents($tmp . '/log/lang-log-stats.sh', $fixtureScript);

// The tester log (2026-10-07): two tester browsers used today, one yesterday, one held-out row per bucket in
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
    $nowTs . "\treach\tDarcy-Weisbach\tvisit\n",
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
$run = function () use ($cmd) { $o = shell_exec($cmd); return is_string($o) ? $o : ''; };
$out = $run();

$usageStart = strpos($out, 'USAGE, from the production logs');
$usage = $usageStart === false ? '' : substr($out, $usageStart);

ec_dr_expect('the USAGE section ran at all', $usageStart !== false,
    'full output: ' . substr($out, 0, 2000));

// ---- R-121: headings. The literal header row lang-log-stats.sh already prints must survive the
// extraction, not just daily_report.sh's own synthesized label line. ----------------------------
ec_dr_expect('the rank-by-dwells table keeps its column header row, browsers column included',
    (bool) preg_match('/rank\s+page\s+browsers\s+dwells, said yes\s+dwells, others/', $usage), $usage);
ec_dr_expect('a data row (Fixture-Calculator, 2 browsers, 3 said yes, 7 others) still comes through',
    (bool) preg_match('/Fixture-Calculator\s+2\s+3\s+7/', $usage), $usage);

// ---- R-123: "said yes" is the consented bucket, never "long-dwell". ----------------------------
ec_dr_expect('the mail states what "browsers" and "dwells, said yes" mean (distinct codes; once per page per visit)',
    strpos($usage, 'accepted the consent banner') !== false
    && strpos($usage, 'distinct random codes') !== false
    && strpos($usage, 'once per page per visit') !== false, $usage);
ec_dr_expect('the mail defines a page dwell as 10 seconds after the page load and presumed human',
    strpos($usage, 'at least 10 seconds after the page load') !== false
    && strpos($usage, 'presumed human') !== false, $usage);

// ---- R-122: "others" does not silently claim or deny robots without saying why. ----------------
ec_dr_expect('the mail states what "dwells, others" means (everyone else, one row per dwell)',
    strpos($usage, 'dwells, others    page dwells by everyone else, one row per dwell') !== false, $usage);
ec_dr_expect('the new header never prints the old words "shopping" or "page loads" as a column',
    stripos($usage, 'shopping') === false && !preg_match('/^\s+page loads\s/m', $usage), $usage);

// ---- PRODUCTION LAGS MASTER: an old-header lang-log-stats.sh must still get its OWN legend. -----
file_put_contents($tmp . '/log/lang-log-stats.sh', ec_dr_fixture(false));
chmod($tmp . '/log/lang-log-stats.sh', 0755);
$outOld = $run();
$oldStart = strpos($outOld, 'USAGE, from the production logs');
$usageOld = $oldStart === false ? '' : substr($outOld, $oldStart);
ec_dr_expect('OLD header (RANK BY SHOPPING, said yes / page loads): the rows are still picked up',
    (bool) preg_match('/rank\s+page\s+browsers\s+said yes\s+page loads/', $usageOld)
    && (bool) preg_match('/Fixture-Calculator\s+2\s+3\s+7/', $usageOld), $usageOld);
ec_dr_expect('OLD header gets the old legend, not the new one',
    strpos($usageOld, 'page loads  everyone else, one row per page view') !== false
    && strpos($usageOld, 'dwells, others') === false
    && strpos($usageOld, '10+ seconds on the page') !== false, $usageOld);
ec_dr_expect('OLD header, zero old-format rows: no old-format line',
    strpos($usageOld, 'old format') === false, $usageOld);
file_put_contents($tmp . '/log/lang-log-stats.sh', $fixtureScript);
chmod($tmp . '/log/lang-log-stats.sh', 0755);

// ---- Tom, 2026-10-07: the side count of tester browsers. ---------------------------------------
ec_dr_expect('the mail carries a tester-browser side count',
    strpos($usage, 'Tester browsers (marked by ?ec_nolog=1)') !== false, $usage);
ec_dr_expect('today shows 2 tester browsers (two day rows today)',
    (bool) preg_match('/' . preg_quote($today, '/') . '\s+2\b/', $usage), $usage);
ec_dr_expect('yesterday shows 1 tester browser',
    (bool) preg_match('/' . preg_quote($yday, '/') . '\s+1\b/', $usage), $usage);
ec_dr_expect('held-out tester rows are printed per bucket and never summed (1 said yes, 1 everyone else)',
    (bool) preg_match('/from browsers that said yes\s+1\n\s+from everyone else\s+1\n/', $usage)
    && strpos($usage, 'never add them') !== false, $usage);
ec_dr_expect('the tester count says the mark is per host and that the hosts share one log folder',
    strpos($usage, 'The mark is per host') !== false && strpos($usage, 'share this one log folder') !== false, $usage);
ec_dr_expect('marks set and cleared are counted from the whole file',
    strpos($usage, 'browsers marked since ' . $yday . ': 2; marks cleared: 0') !== false, $usage);
ec_dr_expect('the mail gives the true, checked answer on robots (excluded by the dwell gate, '
    . 'not by a robot list)', strpos($usage, 'robots are') !== false, $usage);

// ---- Tom, 2026-10-05: the table read as one day's usage and was the whole log. Each table names
// its window in its own heading, and the old-format diagnostic is not printed as if it were a total.
ec_dr_expect('a LAST 24 HOURS table is headed as such',
    strpos($usage, 'LAST 24 HOURS') !== false, $usage);
ec_dr_expect('the whole-log table says it is not one day, with its duration and dates',
    (bool) preg_match('/WHOLE LOG, which restarts on the 1st \(1\.0 days, 2026-01-01 to 2026-01-02\)/', $usage), $usage);
ec_dr_expect('a zero old-format count prints no old-format line',
    strpos($usage, 'old format') === false, $usage);

// cleanup
@unlink($tmp . '/log/lang-log-stats.sh');
@unlink($tmp . '/log/engcalcs-tester.log');
@rmdir($tmp . '/log');
@rmdir($tmp);

echo $fail === 0 ? "PASS\n" : "FAIL ($fail)\n";
exit($fail === 0 ? 0 : 1);
