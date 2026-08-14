<?php
/**
 * ROADMAP Task 319 — asserts that a visitor-supplied Accept-Language header cannot forge a log row.
 *
 * TWO HALVES, and the second is the one that lasts. The first drives ecBrowserLangTag() over the
 * hostile inputs the old code let through. The second greps the log writers for the raw snippet
 * that WAS the defect, because the defect's real shape was duplication: the identical three lines
 * were copy-pasted into five files, so the miss was uniform and fixing four of them would have
 * looked exactly like fixing five. A sixth copy pasted next year is the realistic regression, and
 * only the grep can see it.
 *
 * Fast and deterministic: no network, no filesystem writes, no clock.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
require_once __DIR__ . '/../../lib/config.inc.php';

$fail = 0;
$note = 0;

function ec_expect($label, $accept, $expected) {
    global $fail;
    if ($accept === null) {
        unset($_SERVER['HTTP_ACCEPT_LANGUAGE']);
    } else {
        $_SERVER['HTTP_ACCEPT_LANGUAGE'] = $accept;
    }
    $got = ecBrowserLangTag();
    if ($got === $expected) return;
    printf("FAIL %s\n     expected %s\n     got      %s\n", $label,
        var_export($expected, true), var_export($got, true));
    $fail++;
}

// --- An ordinary header must pass through untouched. A filter that mangles the 99.9% case is a
// --- worse defect than the one it fixes, so this is first.
ec_expect('plain tag',            'en-gb',                              'en-gb');
ec_expect('q-values and list',    'es,en-gb;q=0.9,en;q=0.6',            'es');
ec_expect('uppercase is folded',  'EN-GB',                              'en-gb');
ec_expect('surrounding spaces',   '  en-gb  ',                          'en-gb');
ec_expect('no header at all',     null,                                 '');
ec_expect('empty header',         '',                                   '');

// --- The defect itself: a tab or a newline inside the first range. trim() strips EDGES only, so
// --- every one of these used to reach the log file intact and shift or forge columns.
ec_expect('embedded tab',    "en\tINJECTED",                                       'en');
ec_expect('embedded LF',     "en\n2026-01-01T00:00:00Z\tManning-Pipe-Flow\tfake",  'en');
ec_expect('embedded CRLF',   "en\r\nforged\trow",                                  'en');
ec_expect('a whole fake row',
    "en\n2026-01-01T00:00:00Z\tLooped-Network\ten\ten\ttouch\tx",                  'en');

// --- The other unbounded half: length. 35 is past every real tag and far short of a 4 KB header.
$_SERVER['HTTP_ACCEPT_LANGUAGE'] = str_repeat('a', 4096);
$long = ecBrowserLangTag();
if (strlen($long) !== 35) {
    printf("FAIL 4 KB header capped\n     expected length 35, got %d\n", strlen($long));
    $fail++;
}

// --- Whatever comes out, it can never contain a separator. Stated as an invariant rather than as
// --- another example, because it is the property the log format actually depends on.
foreach (array("en\tx", "en\nx", "en\r\nx", str_repeat("\t", 50) . 'en', 'zh-Hant-HK;q=0.9') as $h) {
    $_SERVER['HTTP_ACCEPT_LANGUAGE'] = $h;
    $out = ecBrowserLangTag();
    if (preg_match('/[^a-z0-9-]/', $out) || strlen($out) > 35) {
        printf("FAIL invariant broken for %s -> %s\n", var_export($h, true), var_export($out, true));
        $fail++;
    }
}

// --- Half two: nobody has re-pasted the raw read into a log writer -------------------------------
// The pattern is the header being read anywhere other than inside ecBrowserLangTag() itself.
$root = dirname(__DIR__, 2);
$files = array_merge(
    glob($root . '/*.php'),
    glob($root . '/lib/*.php')
);
// lib/config.inc.php is where the helper LIVES, so it is the one legitimate reader.
$allowed = array($root . '/lib/config.inc.php');
// KNOWN, REPORTED, NOT FIXED HERE (Task 319 names five files; these are two more of the same
// snippet, feeding logLanguageSelection() into LANG_LOG). Listed so the grep stays honest rather
// than being scoped down to hide them. DELETE THIS ENTRY when the file is fixed -- the check will
// then guard it like the rest.
$pending = array($root . '/lib/Language.lib.php');

foreach ($files as $f) {
    if (in_array($f, $allowed, true)) continue;
    $src = file_get_contents($f);
    if (strpos($src, 'HTTP_ACCEPT_LANGUAGE') === false) continue;
    $rel = substr($f, strlen($root) + 1);
    if (in_array($f, $pending, true)) {
        printf("NOTE %s still reads HTTP_ACCEPT_LANGUAGE directly (known, see Task 319)\n", $rel);
        $note++;
        continue;
    }
    printf("FAIL %s reads HTTP_ACCEPT_LANGUAGE directly; call ecBrowserLangTag() instead\n", $rel);
    $fail++;
}

// And the five writers Task 319 names must actually be calling it.
foreach (array('formmail.php', 'log-signal-event.php', 'log-title-event.php',
               'log-human-view.php', 'log-calc-event.php') as $w) {
    $src = file_get_contents($root . '/' . $w);
    if (strpos($src, 'ecBrowserLangTag()') === false) {
        printf("FAIL %s no longer calls ecBrowserLangTag()\n", $w);
        $fail++;
    }
    // The helper is defined in lib/config.inc.php, so a caller that stopped including it would
    // fatal on a live request and never on this check.
    if (strpos($src, "lib/config.inc.php") === false) {
        printf("FAIL %s calls ecBrowserLangTag() without requiring lib/config.inc.php\n", $w);
        $fail++;
    }
}

if ($fail > 0) {
    printf("\n%d failure(s)\n", $fail);
    exit(1);
}
printf("ok — Accept-Language tag filtered and capped; %d writer(s) checked%s\n", 5,
    $note ? "; $note known direct reader(s) reported above" : '');
exit(0);
