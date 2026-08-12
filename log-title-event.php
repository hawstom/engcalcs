<?php
/**
 * Logs one "somebody named this calculation" event to TITLE_LOG (ROADMAP Task 215).
 *
 * Called via EngCalcs.maybeLogTitleEvent() (js/Calculators.lib.js) when a visitor types a
 * Printable Title or Subtitle. Sibling of log-calc-event.php and log-human-view.php, and the
 * strongest of the three: a page view says someone looked, a calc event says they got an answer,
 * and this says they mean to show it to another person.
 *
 * Deliberately its own event rather than a flag on the calc event: maybeLogCalcUsage() dedupes
 * per page load, and a title is nearly always typed AFTER the first calculation, so a flag there
 * would read zero almost every time.
 *
 * See lib/config.inc.php for the log format.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
require_once __DIR__ . '/lib/config.inc.php';
// Task 286: the session is analytics storage, so it starts only for a visitor who agreed to it.
// Everybody else is still counted -- see the 'visit' bucket in ecLogBucketSuffix().
ecSessionStart();

header('Content-Type: text/plain');

// Task 210: a browser that opted out is not counted. Answered 204 like a normal success so the
// beacon is never queued for retry -- an opted-out event must not come back later.
if (function_exists('ecLoggingOptedOut') && ecLoggingOptedOut()) {
    http_response_code(204);
    exit;
}

$page = isset($_POST['page']) ? preg_replace('/[^A-Za-z0-9_-]/', '', $_POST['page']) : '';
$lang = isset($_POST['lang']) ? preg_replace('/[^A-Za-z-]/', '', $_POST['lang']) : '';

// Which of the two fields. A closed set, not sanitized free text: the client has no business
// naming a new column value, and an unknown one is a bug worth seeing as a 400 rather than
// quietly widening the vocabulary of the log.
$field = isset($_POST['field']) ? $_POST['field'] : '';
if (!in_array($field, array('title', 'subtitle'), true)) {
    $field = '';
}

// NOTE: the typed text itself is never sent by the client and is never wanted here. What the
// calculation is called is the user's business; that they named one is ours.
if ($page === '' || $field === '') {
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

// Deduped per (session, page, field) rather than per (session, page): the two fields are two
// different findings, and someone who adds a subtitle after a title must be able to show up as
// both. Editing the same field repeatedly still counts once.
// Task 286: with no session there is nothing to dedupe against, so the event goes undeduplicated
// to the 'visit' bucket rather than being dropped.
$dedupKey = $page . '|' . $field;
$alreadyLogged = ecSessionActive() && !empty($_SESSION['TITLE_LOGGED'][$dedupKey]);
if (!$alreadyLogged) {
    if (ecSessionActive()) {
        $_SESSION['TITLE_LOGGED'][$dedupKey] = true;
    }

    $browserLang = '';
    if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $browserLang = strtolower(trim(explode(';', explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0])[0]));
    }

    $dir = dirname(TITLE_LOG);
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $line = $eventTime . "\t" . $page . "\t" . $lang . "\t" . $browserLang . "\t" . $field . ecLogBucketSuffix() . "\n";
    @file_put_contents(TITLE_LOG, $line, FILE_APPEND | LOCK_EX);
}

http_response_code(204);
