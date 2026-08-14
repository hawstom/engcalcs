<?php
/**
 * Logs one confirmed-human calculator-usage event to CALC_USAGE_LOG.
 *
 * Called via navigator.sendBeacon from EngCalcs.maybeLogCalcUsage()
 * (js/Calculators.lib.js), only after a real, user-triggered calculation
 * at least 10s after page load. See lib/config.inc.php for the log format
 * and lib/Language.lib.php's logLanguageSelection() for the related but
 * distinct raw-demand log this complements.
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

// With a session, dedupe per (session, page) exactly as before. Without one there is nothing to
// dedupe against and nothing may be stored to make one, so the event is written to the 'visit'
// bucket instead of being thrown away.
$alreadyLogged = ecAnalyticsConsented() && ecSeen($page, EC_SEEN_CALC);
if (!$alreadyLogged) {
    ecMarkSeen($page, EC_SEEN_CALC);

    // Task 319: filtered and length-capped like the two columns above -- see ecBrowserLangTag().
    $browserLang = ecBrowserLangTag();

    $dir = dirname(CALC_USAGE_LOG);
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $line = $eventTime . "\t" . $page . "\t" . $lang . "\t" . $browserLang . ecLogBucketSuffix() . "\n";
    @file_put_contents(CALC_USAGE_LOG, $line, FILE_APPEND | LOCK_EX);
}

http_response_code(204);
