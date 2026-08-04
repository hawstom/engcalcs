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
session_start();
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

if (empty($_SESSION['CALC_USAGE_LOGGED'][$page])) {
    $_SESSION['CALC_USAGE_LOGGED'][$page] = true;

    $browserLang = '';
    if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $browserLang = strtolower(trim(explode(';', explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0])[0]));
    }

    $dir = dirname(CALC_USAGE_LOG);
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $line = $eventTime . "\t" . $page . "\t" . $lang . "\t" . $browserLang . "\n";
    @file_put_contents(CALC_USAGE_LOG, $line, FILE_APPEND | LOCK_EX);
}

http_response_code(204);
