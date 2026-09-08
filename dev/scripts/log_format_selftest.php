<?php
/**
 * log_format_selftest.php -- the 2026-09-08 log-format additions still round-trip from writer
 * helper to report. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHAT IT GUARDS. Three changes landed in one day on the usage logs, each a column or a value
 * that an older row does not carry:
 *
 *   * the POINTER column on engcalcs-human-view.log and engcalcs-calc-usage.log (Task 285), a
 *     closed set 'coarse' | 'fine' | '' sitting BEFORE the bucket;
 *   * 'save' and 'rename' as naming fields in engcalcs-title.log, Looped-Network's equivalent of
 *     a typed title, each de-duplicating on a bit the map page does not otherwise use;
 *   * the report reading the SERVED / ASKED pair on engcalcs-lang.log by region, and preset
 *     clicks by ASKED tag, which is how the region-subtag unit default is checked.
 *
 * Every one of those fails silently in the same way: an old row (fewer fields) and a new row
 * (more) read positionally in awk, and a reader that tests the wrong field prints a number that
 * looks fine. So this writes a FIXTURE directory of mixed-vintage rows -- four-field legacy,
 * five-field bucketed, six-field with pointer -- runs the real report over it with --archive=,
 * and asserts the counts the report must print. The closed-set helpers the writers call are
 * driven directly first, because a widened set is the other way the vocabulary drifts.
 *
 * The fixture is the only thing this touches: it never reads log/, never writes a row anywhere
 * shipped, and the report's own .last-report-window lands inside the fixture and is deleted
 * with it.
 *
 *   php dev/scripts/log_format_selftest.php
 */
require_once __DIR__ . '/../../lib/config.inc.php';

$fail = 0;
function ec_ft_expect($label, $ok, $detail = '') {
    global $fail;
    if ($ok) { echo "  ok   $label\n"; return; }
    $fail++;
    echo "  FAIL $label" . ($detail !== '' ? "\n        $detail" : '') . "\n";
}

// ---- 1. the closed sets the writers filter through ---------------------------------------------
ec_ft_expect('pointer: coarse passes',            ecPointerClass('coarse') === 'coarse');
ec_ft_expect('pointer: fine passes',              ecPointerClass('fine') === 'fine');
ec_ft_expect('pointer: anything else is blank',   ecPointerClass('touch') === '' && ecPointerClass('') === ''
                                                  && ecPointerClass("coarse\tforged") === '');
ec_ft_expect('naming: title and subtitle keep their bits',
    ecNamingFieldBit('title') === EC_SEEN_TITLE && ecNamingFieldBit('subtitle') === EC_SEEN_SUBTITLE);
ec_ft_expect('naming: save and rename reuse the two bits, on a page that has no title field',
    ecNamingFieldBit('save') === EC_SEEN_TITLE && ecNamingFieldBit('rename') === EC_SEEN_SUBTITLE);
ec_ft_expect('naming: an unknown field is 0, so the writer answers 400 rather than widening the log',
    ecNamingFieldBit('text') === 0 && ecNamingFieldBit('') === 0);
ec_ft_expect('the five ec_seen bits are still five (the banner says "a single digit per page")',
    (EC_SEEN_LANG_VIEW | EC_SEEN_HUMAN_VIEW | EC_SEEN_CALC | EC_SEEN_TITLE | EC_SEEN_SUBTITLE) === 31);

// ---- 2. the fixture: mixed-vintage rows, one directory, the real report --------------------------
$dir = rtrim(sys_get_temp_dir(), '/') . '/engcalcs-log-format-selftest-' . getmypid();
@mkdir($dir, 0700, true);
$T = "\t";
$rows = [
    'engcalcs-human-view.log' => [
        // legacy: four fields, no bucket -- a people row by definition
        "2026-09-01T00:00:01Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us",
        // five fields: bucket, no pointer
        "2026-09-01T00:00:02Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}visit",
        // six fields: pointer before the bucket
        "2026-09-08T00:00:00Z{$T}Looped-Network{$T}en{$T}en-us{$T}coarse{$T}visit",
        "2026-09-08T00:00:01Z{$T}Looped-Network{$T}en{$T}en-gb{$T}fine{$T}visit",
        "2026-09-08T00:00:02Z{$T}Manning-Pipe-Flow{$T}es{$T}es-mx{$T}coarse{$T}visitor",
        // six fields with an EMPTY pointer: a browser that could not say
        "2026-09-08T00:00:03Z{$T}Manning-Trap{$T}en{$T}en{$T}{$T}visit",
    ],
    'engcalcs-calc-usage.log' => [
        "2026-09-08T00:00:05Z{$T}Looped-Network{$T}en{$T}en-us{$T}coarse{$T}visit",
        "2026-09-08T00:00:09Z{$T}Looped-Network{$T}en{$T}en-us{$T}coarse{$T}visitor",
        "2026-09-08T00:00:10Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}fine{$T}visitor",
    ],
    'engcalcs-title.log' => [
        "2026-09-08T00:00:06Z{$T}Looped-Network{$T}en{$T}en-us{$T}save{$T}visitor",
        "2026-09-08T00:00:07Z{$T}Looped-Network{$T}en{$T}en-us{$T}rename{$T}visitor",
        "2026-09-08T00:00:08Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}title{$T}visitor",
        "2026-09-08T00:00:11Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}subtitle{$T}visit",
    ],
    'engcalcs-lang.log' => [
        // old: five fields, no served/asked pair
        "2026-09-01T00:00:00Z{$T}en-us{$T}anon{$T}Manning-Pipe-Flow{$T}visit",
        // new: the pair, then the bucket
        "2026-09-08T00:00:00Z{$T}en-gb{$T}anon{$T}Manning-Pipe-Flow{$T}en{$T}en-gb{$T}visit",
        "2026-09-08T00:00:01Z{$T}es{$T}get{$T}Manning-Trap{$T}es{$T}en-us{$T}visitor",
        "2026-09-08T00:00:02Z{$T}en{$T}anon{$T}Looped-Network{$T}en{$T}en{$T}visit",
    ],
    'engcalcs-signal.log' => [
        "2026-09-08T00:00:00Z{$T}Manning-Pipe-Flow{$T}en{$T}en-gb{$T}units{$T}preset:us{$T}visit",
        "2026-09-08T00:00:01Z{$T}Manning-Pipe-Flow{$T}en{$T}en-us{$T}units{$T}preset:si{$T}visit",
        // a Spanish page: excluded from the English-only asked-tag table
        "2026-09-08T00:00:02Z{$T}Manning-Pipe-Flow{$T}es{$T}es-mx{$T}units{$T}preset:si{$T}visit",
    ],
    'engcalcs-contact-send.log' => [],
];
foreach ($rows as $name => $lines) {
    file_put_contents("$dir/$name", $lines ? implode("\n", $lines) . "\n" : '');
}

$script = realpath(__DIR__ . '/../../log/lang-log-stats.sh');
$out = shell_exec('bash ' . escapeshellarg($script) . ' --archive=' . escapeshellarg($dir) . ' 2>&1');
$out = (string) $out;

// A helper: does a line matching $re exist? Whitespace in the report is padding, so every
// pattern here separates its tokens with \s+.
function ec_ft_line($out, $re) { return preg_match($re, $out) === 1; }

// -- pointer tier --
ec_ft_expect('device: the section prints',
    ec_ft_line($out, '/DEVICE — coarse pointer/'));
ec_ft_expect('device: PAGE LOADS counts coarse 1, fine 1, unknown 2 (a blank pointer and a five-field row)',
    ec_ft_line($out, '/PAGE LOADS — confirmed-human page views: 4\n\s+unknown\s+2\b/')
    && ec_ft_line($out, '/\n\s+coarse\s+1\s+\S+\s+\[/')
    && ec_ft_line($out, '/\n\s+fine\s+1\s+\S+\s+\[/'),
    $out);
ec_ft_expect('device: PEOPLE counts the legacy four-field row as unknown, never as fine',
    ec_ft_line($out, '/PEOPLE — confirmed-human page views: 2\n\s+(unknown\s+1[^\n]*\n\s+coarse\s+1|coarse\s+1[^\n]*\n\s+unknown\s+1)/'));
// Denominators this small print '-' for the ratio and still print the interval, so the
// patterns below accept any ratio token and anchor on the counts and the bracket.
ec_ft_expect('device: coarse by page reads known rows only -- Looped-Network 2 known, 1 coarse',
    ec_ft_line($out, '/\n\s+Looped-Network\s+2\s+1\s+\S+\s+\[/'), $out);
ec_ft_expect('device: calculated by pointer -- coarse 1 shopping, 1 using in the page-load bucket',
    ec_ft_line($out, '/\n\s+coarse\s+1\s+1\s+\S+\s+\[/'), $out);

// -- naming --
ec_ft_expect('naming: PEOPLE line carries titles 1, subtitles 0, saves 1, renames 1',
    ec_ft_line($out, '/PEOPLE\s+titles\s+1\s+subtitles\s+0\s+saves\s+1\s+renames\s+1/'));
ec_ft_expect('naming: PAGE LOADS line carries the subtitle row',
    ec_ft_line($out, '/PAGE LOADS\s+titles\s+0\s+subtitles\s+1\s+saves\s+0\s+renames\s+0/'));
ec_ft_expect('naming: Looped-Network is NAMED by its save and its rename is printed beside it, not n/a',
    ec_ft_line($out, '/\n\s+Looped-Network\s+1\s+1\s+\S+\s+\[[^\]]*\]%?\s+1\n/'), $out);
ec_ft_expect('naming: Manning-Pipe-Flow is named by its title with no rename',
    ec_ft_line($out, '/\n\s+Manning-Pipe-Flow\s+1\s+1\s+\S+\s+\[[^\]]*\]%?\s+0\n/'));
ec_ft_expect('naming: "no title field" is no longer printed for a map page that has logged a save',
    !ec_ft_line($out, '/Looped-Network\s+\d+\s+n\/a/'));

// -- the map page is still recognised as having no title FIELD when it has no save rows --
$rows2 = $rows;
$rows2['engcalcs-title.log'] = [$rows['engcalcs-title.log'][2]];
$dir2 = $dir . '-b';
@mkdir($dir2, 0700, true);
foreach ($rows2 as $name => $lines) {
    file_put_contents("$dir2/$name", $lines ? implode("\n", $lines) . "\n" : '');
}
$out2 = (string) shell_exec('bash ' . escapeshellarg($script) . ' --archive=' . escapeshellarg($dir2) . ' 2>&1');
ec_ft_expect('naming: with no save or rename in the window the map page reads n/a (an absence of instrument)',
    ec_ft_line($out2, '/\n\s+Looped-Network\s+1\s+n\/a\s+n\/a\s+no title field/'), $out2);

// -- language: served/asked pair and the region table --
ec_ft_expect('language: reach rows classify by field count -- 3 page loads, 2 classified, 1 older format',
    ec_ft_line($out, '/PAGE LOADS — reach rows: 3\s+classified: 2\s+unclassified \(older format\): 1/'));
ec_ft_expect('language: English by region lists en-gb and bare en in page loads and en-us in people',
    ec_ft_line($out, '/\n\s+en-gb\s+0\s+1\n/') && ec_ft_line($out, '/\n\s+en\s+0\s+1\n/')
    && ec_ft_line($out, '/\n\s+en-us\s+1\s+0\n/'), $out);
ec_ft_expect('units: preset clicks by asked tag list the two English rows and exclude the Spanish page',
    ec_ft_line($out, '/\n\s+1 en-gb\tpreset:us\n/') && ec_ft_line($out, '/\n\s+1 en-us\tpreset:si\n/')
    && !ec_ft_line($out, '/es-mx\tpreset:si/'));

// -- the state file the report writes lands in the fixture, not in log/ --
ec_ft_expect('the run wrote its window state beside the fixture and nowhere else',
    is_file("$dir/.last-report-window"));

// ---- cleanup -------------------------------------------------------------------------------------
foreach ([$dir, $dir2] as $d) {
    foreach (glob("$d/{,.}*", GLOB_BRACE) ?: [] as $f) { if (is_file($f)) @unlink($f); }
    @rmdir($d);
}

if ($fail) {
    echo "\n$fail check(s) failed. A column the writers now emit is read wrongly somewhere -- an\n";
    echo "old row and a new one differ in field count, and a reader testing the wrong field prints\n";
    echo "a number that looks fine. See the field lists at the top of log/lang-log-stats.sh.\n";
    exit(1);
}
echo "\nLog format selftest OK -- closed sets, and a mixed-vintage fixture read by the real report.\n";
exit(0);
