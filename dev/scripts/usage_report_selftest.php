<?php
/**
 * usage_report_selftest.php -- the usage report page reads the right field, and never sums the
 * two buckets. BLOCKING.
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
 * (everybody else, undeduplicated). A sum has a denominator in two units and a numerator in
 * neither, which is the symptom formmail.php's own comment records.
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
        strpos($cfg, "/log/" . $name . "'") !== false);
}
preg_match_all("#/log/(engcalcs-[a-z-]+\.log)'#", $cfg, $m);
ec_ur_expect('config.inc.php defines no SEVENTH log this page would silently miss',
    count(array_unique($m[1])) === count(ecUsageLogKinds()),
    'config names: ' . implode(', ', array_unique($m[1])));

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
ec_ur_expect('calculations: 2 people rows, 1 page-load row',
    $ct === array('visitor' => 2, 'visit' => 1), json_encode($ct));

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
ec_ur_expect('the span is read across all six logs', $first === '2026-09-01' && $last === '2026-09-08');

$win = ecUsageWindow($data['view'], '2026-09-08', '2026-09-08');
ec_ur_expect('the window filter keeps only that day', count($win) === 4);

// ---- 5. the REAL page, rendered over the fixture ----------------------------------------------
$boot = "$dir/render.php";
file_put_contents($boot,
    "<?php\n\$_GET['days'] = 0;\n"
  . "define('EC_USAGE_REPORT_DIRS', " . var_export(serialize(array($dir)), true) . ");\n"
  . "require " . var_export($root . '/usage-report/index.php', true) . ";\n");
$html = (string) shell_exec(escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg($boot) . ' 2>&1');

ec_ur_expect('the page renders at all', strlen($html) > 1000 && strpos($html, '<!DOCTYPE html>') === 0,
    substr($html, 0, 400));
ec_ur_expect('it emits no PHP warning, notice or fatal',
    stripos($html, 'Warning:') === false && stripos($html, 'Notice:') === false
    && stripos($html, 'Fatal error') === false && stripos($html, 'Deprecated:') === false);

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

ec_ur_expect('the page prints Manning-Pipe-Flow as 2 people and 1 page load',
    ec_ur_row($xp, 'Manning-Pipe-Flow') === array('Manning-Pipe-Flow', '2', '1'),
    json_encode(ec_ur_row($xp, 'Manning-Pipe-Flow')));
ec_ur_expect('the page prints Looped-Network as 0 people and 2 page loads',
    ec_ur_row($xp, 'Looped-Network') === array('Looped-Network', '0', '2'),
    json_encode(ec_ur_row($xp, 'Looped-Network')));
ec_ur_expect('the contact funnel prints 1 view and 1 send, both in the people column',
    ec_ur_row($xp, 'contact page viewed') === array('contact page viewed', '1', '0')
    && ec_ur_row($xp, 'message sent') === array('message sent', '1', '0'),
    json_encode(array(ec_ur_row($xp, 'contact page viewed'), ec_ur_row($xp, 'message sent'))));

// ---- 6. THE LEG THAT MATTERS MOST -------------------------------------------------------------
$heads = array();
foreach ($xp->query('//th') as $th) { $heads[strtolower(trim($th->textContent))] = true; }
ec_ur_expect('no table on the page has a total, sum, combined or all column',
    !isset($heads['total']) && !isset($heads['sum']) && !isset($heads['combined'])
    && !isset($heads['all']), implode(' | ', array_keys($heads)));
// Each row of a bucket table must have the two counts side by side and nothing after them: a third
// numeric column appearing later would be the sum arriving by the back door.
$wide = 0;
foreach ($xp->query('//tbody/tr') as $tr) {
    $cells = 0;
    foreach ($tr->childNodes as $c) { if ($c->nodeName === 'td') { $cells++; } }
    if ($cells > 3) { $wide++; }
}
ec_ur_expect('no table row carries more than three cells', $wide === 0, "$wide row(s) do");
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
$src = ec_ur_code($root . '/usage-report/index.php');
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

$ht = (string) @file_get_contents($root . '/usage-report/.htaccess');
ec_ur_expect('the directory declares HTTP Basic auth and requires a valid user',
    preg_match('/^\s*AuthType\s+Basic/mi', $ht) === 1
    && preg_match('/^\s*Require\s+valid-user/mi', $ht) === 1
    && preg_match('/^\s*AuthUserFile\s+\//mi', $ht) === 1,
    'usage-report/.htaccess is the ONLY thing standing between these numbers and the open web.');

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
