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
session_start();
require_once __DIR__ . '/lib/config.inc.php';

header('Content-Type: text/plain');

$page = isset($_POST['page']) ? preg_replace('/[^A-Za-z0-9_-]/', '', $_POST['page']) : '';
$lang = isset($_POST['lang']) ? preg_replace('/[^A-Za-z-]/', '', $_POST['lang']) : '';

if ($page === '') {
    http_response_code(400);
    exit;
}

// Trust-but-verify the client's claim of session age: a spoofed beacon could claim
// any age, but so could a spoofed page-age gate — this is best-effort bot filtering,
// not a security boundary. Re-derive from the server-side session anyway, since it's
// free and slightly harder to spoof than trusting the POST body alone.
$sessionStart = $_SESSION['SESSION_START'] ?? time();
if ((time() - $sessionStart) < 10) {
    http_response_code(204);
    exit;
}

$dedupKey = $page . '|' . $lang;
if (empty($_SESSION['HUMAN_VIEW_LOGGED'][$dedupKey])) {
    $_SESSION['HUMAN_VIEW_LOGGED'][$dedupKey] = true;

    $browserLang = '';
    if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $browserLang = strtolower(trim(explode(';', explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0])[0]));
    }

    $dir = dirname(HUMAN_VIEW_LOG);
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $line = gmdate('Y-m-d\TH:i:s\Z') . "\t" . $page . "\t" . $lang . "\t" . $browserLang . "\n";
    @file_put_contents(HUMAN_VIEW_LOG, $line, FILE_APPEND | LOCK_EX);
}

http_response_code(204);
