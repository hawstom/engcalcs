<?php
/**
 * Logs one behaviour signal to SIGNAL_LOG (ROADMAP Tasks 216 and 200).
 *
 * Called via EngCalcs.logSignal() (js/Calculators.lib.js). Sibling of log-calc-event.php,
 * log-human-view.php and log-title-event.php, but not a tier of their funnel: those three answer
 * "how many", this one answers "and then what did they do". See lib/config.inc.php for the log
 * format and for why the five questions share one endpoint.
 *
 * DE-DUPLICATION IS THE CLIENT'S JOB HERE and it lasts one page load. The other three writers
 * dedupe per (visit, page) against the ec_seen cookie, whose five bits are full — a sixth would
 * make the consent banner's "a single digit per page" untrue. So nothing is stored for these, and
 * every accepted event is written.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
require_once __DIR__ . '/lib/config.inc.php';

header('Content-Type: text/plain');

// Task 210: a browser that opted out is not counted. Answered 204 like a normal success so the
// beacon is never queued for retry -- an opted-out event must not come back later.
if (function_exists('ecLoggingOptedOut') && ecLoggingOptedOut()) {
    http_response_code(204);
    exit;
}

$page = isset($_POST['page']) ? preg_replace('/[^A-Za-z0-9_-]/', '', $_POST['page']) : '';
$lang = isset($_POST['lang']) ? preg_replace('/[^A-Za-z-]/', '', $_POST['lang']) : '';

// A CLOSED SET, like log-title-event.php's field column and for the same reason: the client has no
// business naming a new column value, and an unknown one is a bug worth seeing as a 400 rather
// than quietly widening the vocabulary of the log. Adding a signal means editing this line, the
// block comment in lib/config.inc.php, and log/lang-log-stats.sh -- in that order.
$event = isset($_POST['event']) ? $_POST['event'] : '';
if (!in_array($event, array('outbound', 'touch', 'units', 'repeat', 'lpn'), true)) {
    $event = '';
}

// The detail is a short slug, not free text. 'outbound' carries a host and path, so '.' and '/'
// are allowed; everything else here is '<word>:<word>'. Anything outside that is dropped rather
// than escaped, because a log line is read by awk and a stray tab or newline would silently shift
// every column after it. Capped at 80 -- long enough for a real reference URL's host and path,
// short enough that nothing interesting can be smuggled into the file.
$detail = isset($_POST['detail']) ? (string) $_POST['detail'] : '';
$detail = preg_replace('#[^A-Za-z0-9._:/-]#', '', $detail);
if (strlen($detail) > 80) {
    $detail = substr($detail, 0, 80);
}

if ($page === '' || $event === '') {
    http_response_code(400);
    exit;
}

// Task 119: see log-human-view.php for why an offline-queue retry carries and trusts
// (within a sane window) the client's original attempt time instead of "now".
$eventTime = gmdate('Y-m-d\TH:i:s\Z');
if (isset($_POST['offline_ts'])) {
    $ts = DateTime::createFromFormat('Y-m-d\TH:i:s.v\Z', $_POST['offline_ts'], new DateTimeZone('UTC'))
        ?: DateTime::createFromFormat('Y-m-d\TH:i:s\Z', $_POST['offline_ts'], new DateTimeZone('UTC'));
    if ($ts !== false) {
        $now = new DateTime('now', new DateTimeZone('UTC'));
        $ageDays = ($now->getTimestamp() - $ts->getTimestamp()) / 86400;
        if ($ageDays >= 0 && $ageDays <= 90) {
            $eventTime = $ts->format('Y-m-d\TH:i:s\Z');
        }
    }
}

// Task 319: same treatment the detail column above gets, and for the same reason -- a header is
// visitor-supplied text and a stray tab in it would shift every column after it.
$browserLang = ecBrowserLangTag();

$dir = dirname(SIGNAL_LOG);
if (!is_dir($dir)) {
    @mkdir($dir, 0750, true);
}
// The bucket suffix still applies, and still means what it means everywhere else: a consenting
// visitor's rows are comparable with the deduplicated human-view rows the report divides them by,
// and everybody else's are page-load counts that must never be summed with them.
$line = $eventTime . "\t" . $page . "\t" . $lang . "\t" . $browserLang . "\t" . $event . "\t" . $detail
    . ecLogBucketSuffix() . "\n";
@file_put_contents(SIGNAL_LOG, $line, FILE_APPEND | LOCK_EX);

http_response_code(204);
