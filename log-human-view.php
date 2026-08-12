<?php
/**
 * Logs one confirmed-human page-view event to HUMAN_VIEW_LOG — the "window
 * shopping" tier between raw reach (LANG_LOG) and confirmed calculator use
 * (CALC_USAGE_LOG).
 *
 * Called via navigator.sendBeacon from EngCalcs.maybeLogHumanView()
 * (js/Calculators.lib.js), once the visitor's *session* — not just this
 * page — is at least 10s old. No calculation is required. See
 * lib/config.inc.php for the log format and log-calc-event.php for the
 * related but distinct confirmed-usage log this complements.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
require_once __DIR__ . '/lib/config.inc.php';
// Task 288: no session. De-duplication is one base-32 digit per page in the ec_seen cookie, and it
// happens only for a visitor who agreed to it. Everybody else is still counted -- see the 'visit'
// bucket in ecLogBucketSuffix().

header('Content-Type: text/plain');

// Task 210: a browser that opted out is not counted. Answered 204 like a normal success so the
// beacon is never queued for retry -- an opted-out event must not come back later.
if (function_exists('ecLoggingOptedOut') && ecLoggingOptedOut()) {
    http_response_code(204);
    exit;
}

$page = isset($_POST['page']) ? preg_replace('/[^A-Za-z0-9_-]/', '', $_POST['page']) : '';
$lang = isset($_POST['lang']) ? preg_replace('/[^A-Za-z-]/', '', $_POST['lang']) : '';

if ($page === '') {
    http_response_code(400);
    exit;
}

// Task 119: a beacon retried from the offline queue (js/Calculators.lib.js) carries the
// client's original attempt time, so a flush that lands hours later after connectivity
// returns still logs when the usage happened, not when the flush happened. Best-effort
// only, same trust model as the 10s gate above -- accept it if it parses and falls in a
// sane recent window, otherwise fall back to server "now" like a live beacon would.
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

// Trust the client's JS timer for the 10s session-age gate, same as log-calc-event.php
// trusts its page-age timer: this is best-effort bot filtering, not a security boundary,
// so a spoofed beacon isn't a meaningfully bigger risk than a spoofed client-side gate.
// A prior version re-derived session age here from $_SESSION['SESSION_START'], but that
// fails closed on any request where the session data isn't present (expired, GC'd, cookie
// not attached) by silently treating "unknown" as "session just started" and rejecting —
// which can drop every legitimate view with no trace. Not worth re-litigating server-side.
//
// Task 286: with no session -- a visitor who has not agreed to being counted once rather than
// every time -- there is nothing to dedupe against, so the view goes to the 'visit' bucket
// undeduplicated. That is the honest shape of the number, and it is a far better answer than
// dropping those visitors entirely.
// Task 288: deduped per (visit, page) rather than per (visit, page, lang). The language is
// carried in the digit's page slot, and a visitor who switches language mid-page is one human
// looking at one page -- counting them twice was always the weaker reading, and one digit per page
// cannot express it anyway.
$alreadyLogged = ecAnalyticsConsented() && ecSeen($page, EC_SEEN_HUMAN_VIEW);
if (!$alreadyLogged) {
    ecMarkSeen($page, EC_SEEN_HUMAN_VIEW);

    $browserLang = '';
    if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $browserLang = strtolower(trim(explode(';', explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0])[0]));
    }

    $dir = dirname(HUMAN_VIEW_LOG);
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $line = $eventTime . "\t" . $page . "\t" . $lang . "\t" . $browserLang . ecLogBucketSuffix() . "\n";
    @file_put_contents(HUMAN_VIEW_LOG, $line, FILE_APPEND | LOCK_EX);
}

http_response_code(204);
