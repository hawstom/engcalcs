<?php
//
// Copyright 2006 by Thomas Gail Haws
// Licensed to the public under the terms of version 2 of
// the GNU General Public License
// This is Free Libre Open Source Software.
// You can't modify then distribute without source. 
// You have to keep it open source.
// Version 1.01 Moved error messages above post variables
// Version 1.02 Added anti-spammer field validation
//
// Call this file with an html form that provides with a POST method
// the following variables:
// test=a spam test string
// name=the user's name
// email=the user's email address
// subject
// message
//
// ROADMAP Task 206: for CONTACT_SEND_LOG and ecLoggingOptedOut(). Defines constants and reads
// cookies only -- no output, so it cannot disturb the redirect this script emits on success.
require_once __DIR__ . '/lib/config.inc.php';

// Modify the spam test string, to address, and success file name below.
$testanswer='six';
$to = 'tom.haws@gmail.com';

/**
 * Records one SUCCESSFUL contact-form send to CONTACT_SEND_LOG (ROADMAP Task 206).
 *
 * Called only from the mail() success branch, which is the entire point: this is the half of the
 * contact funnel a client-side beacon cannot honestly measure. Divided into the count of
 * HUMAN_VIEW_LOG rows for page 'contact', it answers the one question years of silence could not:
 * do people not click the invitation, or do they click it and then not send?
 *
 * Records nothing about the message -- not its length, not its referrer, not its subject. Those
 * would be a third question, and none of them answer "is the form the barrier?".
 */
function ecLogContactSend() {
  // Same opt-out as the other three log writers, and cheaper here than in a beacon because the
  // function is already in scope.
  if (function_exists('ecLoggingOptedOut') && ecLoggingOptedOut()) return;

  // The language actually served, read straight from the cookie Language.lib.php sets: formmail
  // does not bootstrap the app, and loading all 27 lang files to learn one code would be silly.
  // Blank when a visitor never chose one, which is itself the honest answer.
  $lang = isset($_COOKIE['ec_language']) ? preg_replace('/[^A-Za-z-]/', '', $_COOKIE['ec_language']) : '';

  // Task 319: filtered and length-capped in one place, because this column goes into the same
  // tab-separated line as the sanitised ones above.
  $browserLang = ecBrowserLangTag();

  $dir = dirname(CONTACT_SEND_LOG);
  if (!is_dir($dir)) {
    @mkdir($dir, 0750, true);
  }
  // 'contact' rather than 'formmail': the page-basename column has to match the view rows this
  // number is divided by, or the funnel does not line up.
  $line = gmdate('Y-m-d\TH:i:s\Z') . "\t" . 'contact' . "\t" . $lang . "\t" . $browserLang . "\n";
  @file_put_contents(CONTACT_SEND_LOG, $line, FILE_APPEND | LOCK_EX);
}

// We define the error messages below.
$errnoto = 'No To: address provided!  Can\'t send mail to nobody.';
$errsendfailed = 'The PHP mail() function failed for an unknown reason.';
$errspam='Sorry, you need to enter '.$testanswer.' in the last box.';

// We read the POST variables below.

// ROADMAP Task 321: read every field ONCE, defaulting a field the request never sent to the empty
// string. Under PHP 8 a bare POST -- a bot, a bookmarked URL, a form that lost a field -- made each
// of the five reads below emit an *Undefined array key* warning, and anywhere display_errors is on
// those land in the response body. Hygiene, not a hole: the header-injection guards below are
// unchanged and still reject exactly what they rejected before. A MISSING field now behaves the way
// an EMPTY one always did, which is the behaviour that was already reachable from the real form --
// in particular a missing e-mail address still fails the address pattern and still dies.
// is_string() rather than isset() alone: name[]=x posts an ARRAY, and passing one to preg_match()
// is a fatal TypeError in PHP 8 -- a second way to reach the same 500 this task is closing.
$postName        = isset($_POST['name'])         && is_string($_POST['name'])         ? $_POST['name']         : '';
$postEmail       = isset($_POST['email'])        && is_string($_POST['email'])        ? $_POST['email']        : '';
$postSubject     = isset($_POST['subject'])      && is_string($_POST['subject'])      ? $_POST['subject']      : '';
$postMessage     = isset($_POST['message'])      && is_string($_POST['message'])      ? $_POST['message']      : '';
$postMoreMessage = isset($_POST['more_message']) && is_string($_POST['more_message']) ? $_POST['more_message'] : '';

// 2026-07-15 Trying the form without this.
// Get the spam test or abort.
// $test = $_POST['test'];
// if (strtoupper($test) !== strtoupper($testanswer)) die($errspam);

// Get the commentor's name
if (preg_match("/(\r|\n)/", $postName) or preg_match("/@/",$postName)) {
  die("Are you trying to spam this form?  Please don't do that.");
} else {
  $name = $postName;
}

// Get the commentor's e-mail address
if (preg_match("/(\r|\n)/", $postEmail) or !preg_match("/^[a-z0-9]+([_\\.-][a-z0-9]+)*" ."@"."([a-z0-9]+([\.-][a-z0-9]+)*)+"."\\.[a-z]{2,}"."$/",$postEmail)) {
  die("Invalid e-mail address.");
} else {
  $email = $postEmail;
}

// Get the Subject: header.
if (preg_match("/(\r|\n)/", $postSubject) or preg_match("/@/",$postSubject)) {
  die("Get out, spammer.");
} else {
  $subject = $postSubject;
}


// Get the message
$message = $postMessage.$postMoreMessage;

// Use a fixed internal success page (do not trust user input for redirects).
$successfile = 'formmailsuccess.php';

// Put commentor's e-mail address in Reply-to: or else omit the Reply-to:
if  ($email !== "") {
 $replyto = 'Reply-to: '.$name.' <'.$email.'>';
} else {
$replyto = '';
}

// Make the From: header
// Use the commentor's e-mail.
$from = 'From: HawsEDC Support <support@hawsedc.com>';

// Assemble the From and Reply-to into additional headers for the
// PHP mail() function.
$moreheaders = $from."\r\n".$replyto;

// Send the message. If send was successful, show the success page.
if (mail($to, $subject, $message, $moreheaders)) {
  ecLogContactSend();
  // Redirect to the fixed internal success page.
  ?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
  <html>
  <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Sending mail</title>
  <meta http-equiv="REFRESH" content="0;url=<?=$successfile?>"></HEAD>
  <BODY>
  </BODY>
  </HTML>
  <?php

// Otherwise show a send failure message.
} else {
  echo $errsendfailed;
}
?>