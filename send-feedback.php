<?php
/**
 * The second click of "Something wrong here?" (ROADMAP Task 768): e-mails Tom what a visitor picked
 * or typed in the box on the Looped Network page. Called only by sendFeedback() in
 * js/looped-network.js; the rules live in lib/FeedbackMail.lib.php.
 *
 * Answers JSON: {"ok":true} or {"ok":false,"reason":...}. A reason the page explains to the visitor
 * ('email', 'busy') or one it reports as a plain failure. Whatever the answer, the page keeps what
 * the visitor typed until a send succeeds.
 *
 * Writes nothing about the message anywhere but the mail itself. The rate file holds send times
 * only. Stores nothing on the visitor's device.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
require_once __DIR__ . '/lib/config.inc.php';
require_once __DIR__ . '/lib/FeedbackMail.lib.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function ecFeedbackAnswer($status, $reason) {
  http_response_code($status);
  echo json_encode($reason === '' ? array('ok' => true) : array('ok' => false, 'reason' => $reason));
  exit;
}

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Allow: POST');
  ecFeedbackAnswer(405, 'method');
}
if (!ecFeedbackSameSite($_SERVER)) ecFeedbackAnswer(403, 'origin');

$build = ecDeployIdentity();
$composed = ecFeedbackCompose($_POST, array(
  'page'  => ecFeedbackPage(ecFeedbackField($_POST, 'page'), __DIR__),
  'build' => trim($build['date'] . ' ' . $build['sha']),
  'to'    => 'tom.haws@gmail.com',
));
// A filled honeypot is answered exactly like a success, so a bot learns nothing from it.
if (isset($composed['honeypot'])) ecFeedbackAnswer(200, '');
if (isset($composed['error'])) ecFeedbackAnswer(400, $composed['error']);

$rateFile = getenv('EC_FEEDBACK_RATE_FILE');
if (!is_string($rateFile) || $rateFile === '') $rateFile = dirname(__DIR__) . '/log/engcalcs-feedback-rate.txt';
if (!ecFeedbackAdmit($rateFile, time())) ecFeedbackAnswer(429, 'busy');

if (!ecFeedbackDeliver($composed)) ecFeedbackAnswer(500, 'failed');
ecFeedbackAnswer(200, '');
