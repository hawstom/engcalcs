<?php
/**
 * usage_report_selftest.php -- spock.php, the usage report page, reads the right field, and never
 * sums the two buckets. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY A FIXTURE AND NOT AN ASSERTION ABOUT THE CODE. A report that reads the wrong field prints a
 * number that looks fine. The six logs grew columns over the years -- the pointer column arrived
 * 2026-09-08, the bucket column 2026-08-21, the served/asked pair with it -- so an old row and a
 * new one differ in FIELD COUNT, and positional reading is exactly how a plausible wrong number
 * gets onto a page nobody can check by looking at it. So this builds a directory of mixed-vintage
 * rows, four-field legacy through seven-field, runs the REAL library and the REAL page over it,
 * and asserts counts that were worked out by hand from the fixture above. It is the same method
 * log_format_selftest.php uses on log/lang-log-stats.sh, for the same reason.
 *
 * THE LEG THAT MATTERS MOST is the last one: the page must carry no total of the two buckets. One
 * counts PEOPLE (consented rows, deduplicated per person per page), the other counts PAGE LOADS
 * (everybody else, undeduplicated). A sum is in neither unit, and a ratio across them is
 * formmail.php's old contact-funnel defect.
 *
 * It touches nothing shipped: the fixture is a temporary directory, the page is driven through the
 * EC_USAGE_REPORT_DIRS constant (which nothing arriving over HTTP can define), and log/ is never
 * read or written.
 *
 *   php dev/scripts/usage_report_selftest.php
 */
$root = dirname(__DIR__, 2);
require_once $root . '/lib/UsageReport.lib.php';

$fail = 0;
function ec_ur_expect($label, $ok, $detail = '') {
    global $fail;
    if ($ok) { echo "  ok   $label\n"; return; }
    $fail++;
    echo "  FAIL $label" . ($detail !== '' ? "\n        $detail" : '') . "\n";
}

// ---- 1. the six filenames are still the six lib/config.inc.php defines ------------------------
// The page deliberately does NOT require config.inc.php -- that file reads cookies and can clear
// them at load time, and a report page must do neither. The cost of not requiring it is that the
// basenames are spelled twice, so this holds the two spellings against each other.
$cfg = (string) file_get_contents($root . '/lib/config.inc.php');
foreach (array_keys(ecUsageLogKinds()) as $name) {
    ec_ur_expect("config.inc.php still defines a log named $name",
        strpos($cfg, "EC_LOG_DIR . '/" . $name . "'") !== false);
}
// engcalcs-tester.log (2026-10-07) is deliberately NOT one of the page's logs: it holds the tester
// browsers kept OUT of every count, and the daily report reads it on its own.
preg_match_all("#EC_LOG_DIR \. '/(engcalcs-[a-z-]+\.log)'#", $cfg, $m);
$cfgNames = array_values(array_diff(array_unique($m[1]), array('engcalcs-tester.log')));
ec_ur_expect('config.inc.php defines no SEVENTH log this page would silently miss',
    count($cfgNames) === count(ecUsageLogKinds()),
    'config names: ' . implode(', ', $cfgNames));

// ---- 2. the parser, row by row, on the vintages that actually exist ---------------------------
$T = "\t";
$legacy = ecUsageParseRow('view', "2026-09-01T00:00:01Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us");
ec_ur_expect('a four-field legacy view row is a PEOPLE row',            $legacy['bucket'] === 'visitor');
ec_ur_expect('and its pointer is EMPTY, never the Accept-Language beside it',
    $legacy['pointer'] === '', 'read: ' . var_export($legacy['pointer'], true));
$five = ecUsageParseRow('view', "2026-09-01T00:00:02Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}visit");
ec_ur_expect('a five-field bucketed view row is a PAGE LOAD with no pointer',
    $five['bucket'] === 'visit' && $five['pointer'] === '');
$six = ecUsageParseRow('view', "2026-09-08T00:00:00Z{$T}Looped-Network{$T}en{$T}en-us{$T}coarse{$T}visit");
ec_ur_expect('a six-field view row carries the pointer before the bucket',
    $six['bucket'] === 'visit' && $six['pointer'] === 'coarse' && $six['page'] === 'Looped-Network');
$blank = ecUsageParseRow('view', "2026-09-08T00:00:03Z{$T}Manning-Trap{$T}en{$T}en{$T}{$T}visit");
ec_ur_expect('an EMPTY pointer on a six-field row stays empty', $blank['pointer'] === '');
$old = ecUsageParseRow('reach', "2026-09-01T00:00:00Z{$T}en-us{$T}anon{$T}Manning-Pipe-Flow{$T}visit");
ec_ur_expect('a five-field reach row is unclassified, and its asked tag is not invented',
    $old['classified'] === false && $old['asked'] === '' && $old['page'] === 'Manning-Pipe-Flow');
$new = ecUsageParseRow('reach', "2026-09-08T00:00:01Z{$T}es{$T}get{$T}Manning-Trap{$T}es{$T}en-us{$T}visitor");
ec_ur_expect('a seven-field reach row carries served and asked',
    $new['classified'] === true && $new['served'] === 'es' && $new['asked'] === 'en-us');
// The browser code (Tom, call F01, 2026-10-08): the field just before the bucket on a said-yes row,
// exactly 16 lowercase hex characters, taken off the BACK so every front-counted column stays put.
$A = '0123456789abcdef'; $B = 'fedcba9876543210';
$coded = ecUsageParseRow('view', "2026-10-08T00:00:00Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}fine{$T}{$A}{$T}visitor");
ec_ur_expect('a coded said-yes view row yields its code, and its pointer is still the pointer',
    $coded['code'] === $A && $coded['pointer'] === 'fine' && $coded['bucket'] === 'visitor',
    json_encode($coded));
$codedSig = ecUsageParseRow('signal', "2026-10-08T00:00:00Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}outbound{$T}example.com/x{$T}{$A}{$T}visitor");
ec_ur_expect('a coded signal row keeps its detail in place and its code apart',
    $codedSig['code'] === $A && $codedSig['detail'] === 'example.com/x', json_encode($codedSig));
$codedReach = ecUsageParseRow('reach', "2026-10-08T00:00:00Z{$T}en{$T}cookie{$T}Manning-Trap{$T}en{$T}en-us{$T}{$A}{$T}visitor");
ec_ur_expect('a coded reach row is still classified, with served and asked where they were',
    $codedReach['code'] === $A && $codedReach['classified'] === true && $codedReach['asked'] === 'en-us',
    json_encode($codedReach));
$codedSend = ecUsageParseRow('send', "2026-10-08T00:00:00Z{$T}contact{$T}en{$T}en-us{$T}{$A}{$T}visitor");
ec_ur_expect('a coded contact-send row yields its code and keeps its asked tag',
    $codedSend['code'] === $A && $codedSend['asked'] === 'en-us', json_encode($codedSend));
ec_ur_expect('a said-yes row from before codes reads as no code, never as one',
    $legacy['code'] === '' && $new['code'] === '');
$visitHex = ecUsageParseRow('view', "2026-10-08T00:00:00Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}{$A}{$T}visit");
ec_ur_expect('a page-load row never yields a code, whatever sits before its bucket',
    $visitHex['code'] === '' && $visitHex['pointer'] === $A);
$upper = ecUsageParseRow('view', "2026-10-08T00:00:00Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}fine{$T}0123456789ABCDEF{$T}visitor");
ec_ur_expect('anything but 16 lowercase hex characters is not a code',
    $upper['code'] === '');
ec_ur_expect('a line that is not a row is refused rather than guessed at',
    ecUsageParseRow('view', 'not a log line') === null
    && ecUsageParseRow('view', '') === null
    && ecUsageParseRow('view', "2026-09-08{$T}Manning-Trap") === null);

// ---- 3. the fixture ---------------------------------------------------------------------------
$dir = rtrim(sys_get_temp_dir(), '/') . '/engcalcs-usage-report-selftest-' . getmypid();
@mkdir($dir, 0700, true);
$rows = array(
    'engcalcs-human-view.log' => array(
        "2026-09-01T00:00:01Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us",                        // visitor, ptr ''
        "2026-09-01T00:00:02Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}visit",               // visit,   ptr ''
        "2026-09-01T00:00:03Z{$T}contact{$T}en{$T}en-us{$T}visitor",                       // visitor, ptr ''
        "2026-09-08T00:00:00Z{$T}Looped-Network{$T}en{$T}en-us{$T}coarse{$T}visit",         // visit,   coarse
        "2026-09-08T00:00:01Z{$T}Looped-Network{$T}en{$T}en-gb{$T}fine{$T}visit",           // visit,   fine
        "2026-09-08T00:00:02Z{$T}Manning-Pipe-Flow{$T}es{$T}es-mx{$T}coarse{$T}visitor",    // visitor, coarse
        "2026-09-08T00:00:03Z{$T}Manning-Trap{$T}en{$T}en{$T}{$T}visit",                    // visit,   ptr ''
    ),
    'engcalcs-calc-usage.log' => array(
        "2026-09-08T00:00:05Z{$T}Looped-Network{$T}en{$T}en-us{$T}coarse{$T}visit",
        "2026-09-08T00:00:09Z{$T}Looped-Network{$T}en{$T}en-us{$T}coarse{$T}visitor",
        "2026-09-08T00:00:10Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}fine{$T}visitor",
        // Coded rows (2026-10-08 on): browser A uses Manning-Pipe-Flow twice, browser B once, and
        // B also uses Looped-Network. Mixed with the two uncoded said-yes rows just above.
        "2026-09-09T00:00:01Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}fine{$T}{$A}{$T}visitor",
        "2026-09-09T00:00:02Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}fine{$T}{$A}{$T}visitor",
        "2026-09-09T00:00:03Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}coarse{$T}{$B}{$T}visitor",
        "2026-09-09T00:00:04Z{$T}Looped-Network{$T}en{$T}en-us{$T}fine{$T}{$B}{$T}visitor",
    ),
    'engcalcs-title.log' => array(
        "2026-09-08T00:00:06Z{$T}Looped-Network{$T}en{$T}en-us{$T}save{$T}visitor",
        "2026-09-08T00:00:07Z{$T}Looped-Network{$T}en{$T}en-us{$T}rename{$T}visitor",
        "2026-09-08T00:00:08Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}title{$T}visitor",
        "2026-09-08T00:00:11Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}subtitle{$T}visit",
    ),
    'engcalcs-lang.log' => array(
        "2026-09-01T00:00:00Z{$T}en-us{$T}anon{$T}Manning-Pipe-Flow{$T}visit",
        "2026-09-08T00:00:00Z{$T}en-gb{$T}anon{$T}Manning-Pipe-Flow{$T}en{$T}en-gb{$T}visit",
        "2026-09-08T00:00:01Z{$T}es{$T}get{$T}Manning-Trap{$T}es{$T}en-us{$T}visitor",
        "2026-09-08T00:00:02Z{$T}en{$T}anon{$T}Looped-Network{$T}en{$T}en{$T}visit",
    ),
    'engcalcs-signal.log' => array(
        "2026-09-08T00:00:00Z{$T}Manning-Pipe-Flow{$T}en{$T}en-gb{$T}units{$T}preset:us{$T}visit",
        "2026-09-08T00:00:01Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}units{$T}preset:si{$T}visit",
        "2026-09-08T00:00:02Z{$T}Manning-Pipe-Flow{$T}es{$T}es-mx{$T}units{$T}preset:si{$T}visit",
        "2026-09-08T00:00:03Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}outbound{$T}example.com/x{$T}visitor",
    ),
    'engcalcs-contact-send.log' => array(
        "2026-09-01T00:00:04Z{$T}contact{$T}en{$T}en-us{$T}visitor",
        "2026-09-09T00:00:05Z{$T}contact{$T}en{$T}en-us{$T}{$A}{$T}visitor",
    ),
);
foreach ($rows as $name => $lines) {
    file_put_contents("$dir/$name", $lines ? implode("\n", $lines) . "\n" : '');
}

$data = ecUsageReadAll(array($dir));

// ---- 4. the arithmetic, hand-computed from the fixture above ----------------------------------
$vt = ecUsageBucketTotals($data['view']);
ec_ur_expect('views: 3 people rows and 4 page-load rows',
    $vt === array('visitor' => 3, 'visit' => 4), json_encode($vt));
ec_ur_expect('bucket totals carry exactly two keys, so there is no total to print',
    count($vt) === 2);

$byPage = ecUsageCountBy($data['view'], 'page');
ec_ur_expect('views by page, PEOPLE: Manning-Pipe-Flow 2, contact 1, Looped-Network absent',
    $byPage['visitor'] === array('Manning-Pipe-Flow' => 2, 'contact' => 1), json_encode($byPage['visitor']));
ec_ur_expect('views by page, PAGE LOADS: Looped-Network 2, Manning-Pipe-Flow 1, Manning-Trap 1',
    $byPage['visit'] === array('Looped-Network' => 2, 'Manning-Pipe-Flow' => 1, 'Manning-Trap' => 1),
    json_encode($byPage['visit']));

$byPtr = ecUsageCountBy($data['view'], 'pointer');
ec_ur_expect('pointer, PEOPLE: two unknown (one of them the four-field legacy row) and one coarse',
    $byPtr['visitor'] === array('(none)' => 2, 'coarse' => 1), json_encode($byPtr['visitor']));
ec_ur_expect('pointer, PAGE LOADS: two unknown, one coarse, one fine -- and no en-us anywhere',
    $byPtr['visit']['(none)'] === 2 && $byPtr['visit']['coarse'] === 1 && $byPtr['visit']['fine'] === 1
    && !isset($byPtr['visit']['en-us']), json_encode($byPtr['visit']));

$ct = ecUsageBucketTotals($data['calc']);
ec_ur_expect('calculations: 6 said-yes rows (uses), 1 page-load row',
    $ct === array('visitor' => 6, 'visit' => 1), json_encode($ct));
$cb = ecUsageBrowsers($data['calc'], 'page');
ec_ur_expect('calculations: 2 distinct browsers, 2 said-yes rows with no code',
    $cb['total'] === 2 && $cb['uncoded'] === 2, json_encode($cb));
ec_ur_expect('browsers by page: Manning-Pipe-Flow 2 (A twice, B once), Looped-Network 1 (B)',
    $cb['by'] === array('Manning-Pipe-Flow' => 2, 'Looped-Network' => 1), json_encode($cb['by']));
$vb = ecUsageBrowsers($data['view'], 'page');
ec_ur_expect('views from before codes: uses, and not one browser',
    $vb['total'] === 0 && $vb['uncoded'] === 3 && $vb['by'] === array(), json_encode($vb));

$byField = ecUsageCountBy($data['naming'], 'field');
ec_ur_expect('naming, PEOPLE: title 1, save 1, rename 1; PAGE LOADS: subtitle 1',
    $byField['visitor']['title'] === 1 && $byField['visitor']['save'] === 1
    && $byField['visitor']['rename'] === 1 && $byField['visit'] === array('subtitle' => 1),
    json_encode($byField));

$classified = 0;
foreach ($data['reach'] as $r) { if ($r['classified']) { $classified++; } }
ec_ur_expect('reach: 4 rows, 3 classified, 1 older format',
    count($data['reach']) === 4 && $classified === 3);
$bySource = ecUsageCountBy($data['reach'], 'source');
ec_ur_expect('reach by source: anon 3 page loads, get 1 person',
    $bySource['visit'] === array('anon' => 3) && $bySource['visitor'] === array('get' => 1),
    json_encode($bySource));

$presets = array();
foreach ($data['signal'] as $r) {
    if ($r['event'] === 'units' && strpos($r['detail'], 'preset:') === 0) { $presets[] = $r; }
}
$byPreset = ecUsageCountBy($presets, 'detail');
ec_ur_expect('preset clicks: si 2, us 1, all page loads, and the outbound row is not among them',
    $byPreset['visit'] === array('preset:si' => 2, 'preset:us' => 1) && $byPreset['visitor'] === array(),
    json_encode($byPreset));

$daily = ecUsageDaily($data['view'], ecUsageDayRange('2026-09-01', '2026-09-08'));
ec_ur_expect('the daily series has a row for every day, including the six quiet ones',
    count($daily['visitor']) === 8 && count($daily['visit']) === 8);
ec_ur_expect('2026-09-01: 2 people, 1 page load. 2026-09-08: 1 person, 3 page loads',
    $daily['visitor']['2026-09-01'] === 2 && $daily['visit']['2026-09-01'] === 1
    && $daily['visitor']['2026-09-08'] === 1 && $daily['visit']['2026-09-08'] === 3,
    json_encode(array($daily['visitor']['2026-09-01'], $daily['visit']['2026-09-01'],
                      $daily['visitor']['2026-09-08'], $daily['visit']['2026-09-08'])));
ec_ur_expect('a quiet day is a zero, not a gap the eye closes up',
    $daily['visitor']['2026-09-04'] === 0 && $daily['visit']['2026-09-04'] === 0);

list($first, $last) = ecUsageSpan($data);
ec_ur_expect('the span is read across all six logs', $first === '2026-09-01' && $last === '2026-09-09');

$win = ecUsageWindow($data['view'], '2026-09-08', '2026-09-08');
ec_ur_expect('the window filter keeps only that day', count($win) === 4);

// ---- 5. the REAL page, rendered over the fixture ----------------------------------------------
$boot = "$dir/render.php";
file_put_contents($boot,
    "<?php\n\$_GET['days'] = 0;\n"
  . "define('EC_USAGE_REPORT_DIRS', " . var_export(serialize(array($dir)), true) . ");\n"
  . "require " . var_export($root . '/spock.php', true) . ";\n");
$html = (string) shell_exec(escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg($boot) . ' 2>&1');

ec_ur_expect('the page renders at all', strlen($html) > 1000 && strpos($html, '<!DOCTYPE html>') === 0,
    substr($html, 0, 400));
ec_ur_expect('it emits no PHP warning, notice or fatal',
    stripos($html, 'Warning:') === false && stripos($html, 'Notice:') === false
    && stripos($html, 'Fatal error') === false && stripos($html, 'Deprecated:') === false);

// header() is a no-op under the CLI SAPI (headers_list() stays empty there too), so the only way
// to see the ACTUAL response header is a real HTTP request against PHP's built-in server -- the
// same reason render_page.php exists for a page that must be rendered outside a web request.
// **ASK THE KERNEL FOR A FREE PORT.** This used 8000 + pid % 1000, and on jasmine Apache serves the
// branch previews on 8080 and 8100-8139: one run in about 25 landed on one and read Apache's 403 as
// a missing header (2026-10-04).
$probe = stream_socket_server('tcp://127.0.0.1:0');
$port = (int) substr(strrchr(stream_socket_get_name($probe, false), ':'), 1);
fclose($probe);
$srvCmd = sprintf('%s -S 127.0.0.1:%d -t %s %s > %s/spock-server.log 2>&1 & echo $!',
    escapeshellarg(PHP_BINARY), $port, escapeshellarg($root), escapeshellarg($boot), escapeshellarg($dir));
$pid = (int) trim(shell_exec($srvCmd));
usleep(300000);
$curlHeaders = (string) shell_exec('curl -s -D - -o /dev/null ' . escapeshellarg("http://127.0.0.1:$port/") . ' 2>&1');
if ($pid) { posix_kill($pid, SIGTERM); }
ec_ur_expect('the live HTTP response carries X-Robots-Tag: noindex, nofollow',
    stripos($curlHeaders, 'X-Robots-Tag: noindex, nofollow') !== false, $curlHeaders);

$prev = libxml_use_internal_errors(true);
$doc = new DOMDocument();
$parsed = $doc->loadHTML($html);
$errs = array_filter(libxml_get_errors(), function ($e) { return $e->level >= LIBXML_ERR_ERROR; });
libxml_clear_errors();
libxml_use_internal_errors($prev);
ec_ur_expect('the HTML parses with no error-level complaint', $parsed && !$errs,
    $errs ? trim($errs[0]->message) . ' line ' . $errs[0]->line : '');

// Every number below was hand-computed above. This asserts the PAGE prints them, which is the half
// the library tests cannot see: a correct aggregate rendered into the wrong column is still wrong.
$xp = new DOMXPath($doc);
function ec_ur_row($xp, $label) {
    $tds = $xp->query("//td[normalize-space(text())=" . ec_ur_q($label) . "]");
    if (!$tds->length) { return null; }
    $out = array();
    foreach ($tds->item(0)->parentNode->childNodes as $c) {
        if ($c->nodeName === 'td') { $out[] = trim($c->textContent); }
    }
    return $out;
}
function ec_ur_q($s) { return "'" . $s . "'"; }
/** The row labelled $label in the table that follows the h3 captioned $caption. */
function ec_ur_row_in($xp, $caption, $label) {
    $tds = $xp->query("//h3[normalize-space(text())=" . ec_ur_q($caption) . "]/following-sibling::table[1]"
        . "//td[normalize-space(text())=" . ec_ur_q($label) . "]");
    if (!$tds->length) { return null; }
    $out = array();
    foreach ($tds->item(0)->parentNode->childNodes as $c) {
        if ($c->nodeName === 'td') { $out[] = trim($c->textContent); }
    }
    return $out;
}

/** One PHP file's source with every comment blanked, so prose about a construct is not the construct. */
function ec_ur_code($path) {
    $out = '';
    foreach (token_get_all((string) file_get_contents($path)) as $t) {
        if (is_array($t)) {
            if ($t[0] === T_COMMENT || $t[0] === T_DOC_COMMENT) { $out .= "\n"; continue; }
            $out .= $t[1];
        } else {
            $out .= $t;
        }
    }
    return $out;
}

ec_ur_expect('page dwells by page: Manning-Pipe-Flow is 0 browsers, 2 uses, 1 others (uses from before codes)',
    ec_ur_row_in($xp, 'Looking, by page', 'Manning-Pipe-Flow') === array('Manning-Pipe-Flow', '0', '2', '1'),
    json_encode(ec_ur_row_in($xp, 'Looking, by page', 'Manning-Pipe-Flow')));
ec_ur_expect('page dwells by page: Looped-Network is 0 browsers, 0 uses, 2 others',
    ec_ur_row_in($xp, 'Looking, by page', 'Looped-Network') === array('Looped-Network', '0', '0', '2'),
    json_encode(ec_ur_row_in($xp, 'Looking, by page', 'Looped-Network')));
ec_ur_expect('calculators used: Manning-Pipe-Flow is 2 browsers and 4 uses, 0 page loads',
    ec_ur_row_in($xp, 'Calculating, by page', 'Manning-Pipe-Flow') === array('Manning-Pipe-Flow', '2', '4', '0'),
    json_encode(ec_ur_row_in($xp, 'Calculating, by page', 'Manning-Pipe-Flow')));
ec_ur_expect('calculators used: Looped-Network is 1 browser, 2 uses and 1 page load',
    ec_ur_row_in($xp, 'Calculating, by page', 'Looped-Network') === array('Looped-Network', '1', '2', '1'),
    json_encode(ec_ur_row_in($xp, 'Calculating, by page', 'Looped-Network')));
ec_ur_expect('the calculation chart says 6 uses from 2 browsers plus 2 uses with no code',
    strpos($html, 'SAID YES: 6 use(s), from 2 browser(s) plus 2 use(s) with no code') !== false);
ec_ur_expect('the contact funnel: viewed 0 browsers 1 use; sent 1 browser 2 uses; no page loads',
    ec_ur_row($xp, 'contact page viewed') === array('contact page viewed', '0', '1', '0')
    && ec_ur_row($xp, 'message sent') === array('message sent', '1', '2', '0'),
    json_encode(array(ec_ur_row($xp, 'contact page viewed'), ec_ur_row($xp, 'message sent'))));

// ---- 6. THE LEG THAT MATTERS MOST -------------------------------------------------------------
$heads = array();
foreach ($xp->query('//th') as $th) { $heads[strtolower(trim($th->textContent))] = true; }
ec_ur_expect('no table on the page has a total, sum, combined or all column',
    !isset($heads['total']) && !isset($heads['sum']) && !isset($heads['combined'])
    && !isset($heads['all']), implode(' | ', array_keys($heads)));
// Each row of a bucket table carries the said-yes browsers and uses and the page loads, and nothing
// after them: a fourth number appearing later would be the sum arriving by the back door.
$wide = 0;
foreach ($xp->query('//tbody/tr') as $tr) {
    $cells = 0;
    foreach ($tr->childNodes as $c) { if ($c->nodeName === 'td') { $cells++; } }
    if ($cells > 4) { $wide++; }
}
ec_ur_expect('no table row carries more than four cells', $wide === 0, "$wide row(s) do");
ec_ur_expect('the bucket columns are named Browsers (said yes), Uses (said yes), Uses (others)',
    isset($heads['browsers (said yes)']) && isset($heads['uses (said yes)'])
    && isset($heads['uses (others)']), implode(' | ', array_keys($heads)));
ec_ur_expect('the page states in words that the two are never added',
    strpos($html, 'never added together') !== false);
ec_ur_expect('the page names its own source files, so every number is re-derivable',
    substr_count($html, 'log/engcalcs-human-view.log') >= 2
    && strpos($html, 'log/engcalcs-signal.log') !== false
    && strpos($html, 'log/lang-log-stats.sh') !== false);

// ---- 7. it stores nothing, and it is not a suite page -----------------------------------------
// COMMENTS ARE STRIPPED FIRST, because the page's own docblock explains at length what it does
// not do -- and a scan that reads the prose forbidding a thing as the thing itself is the shape
// that makes people delete the explanation to quiet the check.
$src = ec_ur_code($root . '/spock.php');
foreach (array('setcookie', 'session_start', 'session_id', 'localStorage', 'sessionStorage',
               'indexedDB', '<script') as $forbidden) {
    ec_ur_expect("the page contains no $forbidden", stripos($src, $forbidden) === false);
}
ec_ur_expect('the rendered page carries no script element and no cookie header',
    stripos($html, '<script') === false && stripos($html, 'Set-Cookie') === false);
ec_ur_expect('it calls no echoHeader(), so the sitemap, page-meta and calculator checks read it '
    . 'as the endpoint it is', strpos($src, 'echoHeader(') === false);
ec_ur_expect('the fixture door is a CONSTANT, never a request parameter',
    strpos($src, "defined('EC_USAGE_REPORT_DIRS')") !== false
    && strpos($src, "\$_GET['dir") === false && strpos($src, '$_REQUEST') === false);

// No HTTP Basic any more (R-212: "it doesn't have to be secret"). What stands in its place is
// noindex both ways, since no .htaccess sits beside this root-level file the way
// usage-report/.htaccess once did.
ec_ur_expect('the source sends the X-Robots-Tag header itself, with no .htaccess to rely on',
    strpos($src, "header('X-Robots-Tag: noindex, nofollow')") !== false);
ec_ur_expect('the rendered page also carries a noindex robots meta tag',
    strpos($html, '<meta name="robots" content="noindex, nofollow">') !== false);
ec_ur_expect('it is not usage-report/index.php reborn: that directory and its .htaccess are gone',
    !is_dir($root . '/usage-report'));

// ---- 8. map command usage (Task 815) ----------------------------------------------------------
// A said-yes browser pressing two commands, another browser pressing one of them, two page loads on
// a third, and one id the command list does not know (the project tab's menu is logged but not
// listed). The unused commands must still show, as zeros; the cmd: rows must stay out of the
// general signal detail table; and the buckets must never meet.
$dir2 = sys_get_temp_dir() . '/ec-usage-cmd-' . getmypid();
@mkdir($dir2, 0777, true);
$C1 = '1111111111111111'; $C2 = '2222222222222222';
$sigRows = array(
    "2026-10-10T00:00:00Z{$T}Looped-Network{$T}en{$T}en-us{$T}lpn{$T}cmd:file/file_new{$T}{$C1}{$T}visitor",
    "2026-10-10T00:00:01Z{$T}Looped-Network{$T}en{$T}en-us{$T}lpn{$T}cmd:tb/add-pump{$T}{$C1}{$T}visitor",
    "2026-10-11T00:00:00Z{$T}Looped-Network{$T}fr{$T}fr{$T}lpn{$T}cmd:tb/add-pump{$T}{$C2}{$T}visitor",
    "2026-10-11T00:00:01Z{$T}Looped-Network{$T}en{$T}en-us{$T}lpn{$T}cmd:tb/add-pump{$T}visit",
    "2026-10-11T00:00:02Z{$T}Looped-Network{$T}en{$T}en-us{$T}lpn{$T}cmd:tb/add-pump{$T}visit",
    "2026-10-11T00:00:03Z{$T}Looped-Network{$T}en{$T}en-us{$T}lpn{$T}cmd:profile/profile_new{$T}visit",
    "2026-10-11T00:00:04Z{$T}Looped-Network{$T}en{$T}en-us{$T}lpn{$T}first:example{$T}visit",
);
file_put_contents("$dir2/engcalcs-signal.log", implode("\n", $sigRows) . "\n");
$rep2 = ecUsageReportBuild(array($dir2), '', '');
$catalog = ecUsageCommandCatalog();
$cmdRows = ecUsageCommandRows($rep2['commands'], $catalog);
$byId = array();
foreach ($cmdRows as $g) { foreach ($g['rows'] as $r) { $byId[$r['id']] = $r; } }
ec_ur_expect('the command list file is readable and holds the menus and the toolbar',
    isset($cmdRows['file']) && isset($cmdRows['tb']) && isset($byId['file/file_new']) && isset($byId['tb/add-pump']),
    implode(',', array_keys($cmdRows)));
ec_ur_expect('a command pressed by one browser: 1 browser, 1 use, 0 page loads',
    $byId['file/file_new']['browsers'] === 1 && $byId['file/file_new']['uses'] === 1 && $byId['file/file_new']['loads'] === 0,
    json_encode($byId['file/file_new']));
ec_ur_expect('a command pressed by two browsers and on two page loads keeps the buckets apart',
    $byId['tb/add-pump']['browsers'] === 2 && $byId['tb/add-pump']['uses'] === 2 && $byId['tb/add-pump']['loads'] === 2,
    json_encode($byId['tb/add-pump']));
ec_ur_expect('a command nobody pressed is listed with zeros',
    isset($byId['edit/edit_delete_network']) && $byId['edit/edit_delete_network']['uses'] === 0
    && $byId['edit/edit_delete_network']['loads'] === 0 && $byId['edit/edit_delete_network']['browsers'] === 0);
ec_ur_expect('an id the list does not know is shown, marked as not in the list, under its own menu',
    isset($byId['profile/profile_new']) && $byId['profile/profile_new']['listed'] === false
    && $byId['profile/profile_new']['loads'] === 1 && isset($cmdRows['profile']));
ec_ur_expect('the cmd: rows stay out of the general signal series; the other lpn row stays in it',
    $rep2['series']['signal']['bucketTotals'] === array('visitor' => 0, 'visit' => 1),
    json_encode($rep2['series']['signal']['bucketTotals']));
$boot2 = "$dir2/render.php";
file_put_contents($boot2,
    "<?php\n\$_GET['days'] = 0;\n"
  . "define('EC_USAGE_REPORT_DIRS', " . var_export(serialize(array($dir2)), true) . ");\n"
  . "require " . var_export($root . '/spock.php', true) . ";\n");
$html2 = (string) shell_exec(escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg($boot2) . ' 2>&1');
ec_ur_expect('the page has a Map commands used section with no PHP warning',
    strpos($html2, '<h2>Map commands used</h2>') !== false && stripos($html2, 'Warning:') === false
    && stripos($html2, 'Notice:') === false && stripos($html2, 'Fatal error') === false);
$d2 = new DOMDocument();
@$d2->loadHTML($html2);
$x2 = new DOMXPath($d2);
$cell = function ($id) use ($x2) {
    foreach ($x2->query('//table[thead/tr/th[.="Uses (said yes)"]]//tr[td[@title]]') as $tr) {
        $td = $tr->getElementsByTagName('td')->item(0);
        if ($td->getAttribute('title') === $id) {
            $o = array();
            foreach ($tr->childNodes as $c) { if ($c->nodeName === 'td') { $o[] = trim($c->textContent); } }
            return $o;
        }
    }
    return null;
};
// The top block is the first table after its heading: path, browsers, page loads, most used first.
$top = array();
foreach ($x2->query('//h3[contains(., "Used in this window")]/following-sibling::table[1]//tr[td]') as $tr) {
    $o = array();
    foreach ($tr->childNodes as $c) { if ($c->nodeName === 'td') { $o[] = trim($c->textContent); } }
    $top[] = $o;
}
ec_ur_expect('the top block lists the three used commands, most used first, buckets in separate columns',
    count($top) === 3 && $top[0][0] === 'Toolbar, Pump' && $top[0][1] === '2' && $top[0][2] === '2'
    && $top[1][1] === '1' && $top[1][2] === '0' && strpos($top[1][0], 'New project') !== false
    && $top[2][1] === '0' && $top[2][2] === '1', json_encode($top));
ec_ur_expect('the top block has three cells a row: no sum of the two buckets',
    count($top) > 0 && count($top[0]) === 3);
$pump = $cell('tb/add-pump');
ec_ur_expect('the by-menu row for the toolbar pump button reads 2 browsers, 2 uses, 2 page loads',
    $pump && $pump[1] === '2' && $pump[2] === '2' && $pump[3] === '2' && strpos($pump[0], 'Pump') !== false,
    json_encode($pump));
$unusedTxt = '';
foreach ($x2->query('//p[@class="unused"]/span[@title="map/clean_map"]') as $sp) { $unusedTxt = $sp->textContent; }
ec_ur_expect('an unused command is listed under "Not used in this window" with its English label, id in the tooltip',
    $unusedTxt === 'Clean map', $unusedTxt);
ec_ur_expect('an unused command has no row in a used table', $cell('map/clean_map') === null);
foreach (glob("$dir2/{,.}*", GLOB_BRACE) ?: array() as $f) { if (is_file($f)) { @unlink($f); } }
@rmdir($dir2);

// ---- cleanup -----------------------------------------------------------------------------------
foreach (glob("$dir/{,.}*", GLOB_BRACE) ?: array() as $f) { if (is_file($f)) { @unlink($f); } }
@rmdir($dir);

if ($fail) {
    echo "\n$fail check(s) failed. A column the writers emit is being read wrongly, or the page is\n";
    echo "presenting the two consent buckets as one number. See lib/UsageReport.lib.php.\n";
    exit(1);
}
echo "\nUsage report selftest OK -- mixed-vintage fixture, real library, real page, two buckets\n";
echo "never summed.\n";
exit(0);
