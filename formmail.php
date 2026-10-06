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
 * Names the page the visitor was on BEFORE they clicked the invitation, or says it was not recorded.
 *
 * Tom, 2026-08-22: *"I have no idea what calculator this person was using."* The obvious instrument
 * is the wrong one: $_SERVER['HTTP_REFERER'] on this request is contact.php, which every sender has
 * in common and which tells him nothing. The originating page has to be CARRIED from the calculator
 * page to the form, so this reads it from two places, in order:
 *
 *   1. a hidden 'origin' field posted by contact.php;
 *   2. failing that, a 'from' or 'origin' query parameter on the contact.php URL we were referred
 *      from -- which works on its own, with no hidden field, as soon as the invitation link carries
 *      one.
 *
 * Both halves are visitor-supplied text and NEITHER is echoed. The value is matched against the
 * suite's real page list -- the basenames of the .php files that sit beside this one -- and only a
 * name that matches is printed. Anything else, including a referrer from outside the suite, reads
 * "not recorded". Guessing a page would be worse than not knowing: an invented answer to "which
 * calculator was this?" is exactly the kind of number this project refuses to print elsewhere.
 *
 * Stores nothing on the visitor's device and reads nothing that is stored there, so it is outside
 * the consent question entirely: it is one line of transient message content, gone when Tom deletes
 * the e-mail. consent_body is untouched and EC_CONSENT_VERSION does not move.
 *
 * @return string  a real page name, or '' when nothing usable was carried through.
 */
function ecContactOriginPage() {
  $claim = '';
  if (isset($_POST['origin']) && is_string($_POST['origin'])) {
    $claim = $_POST['origin'];
  }
  if ($claim === '' && isset($_SERVER['HTTP_REFERER'])) {
    // OUR OWN HOST ONLY. A referrer from anywhere else is somebody else's page nominating one of
    // ours, and the honest report of that is "not recorded" -- the whole value of this line is that
    // Tom can trust it. The site answers on www and non-www with no redirect, so the comparison
    // ignores a leading 'www.' rather than pretending there is one canonical host.
    $refHost = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);
    $ourHost = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
    $strip = function ($h) { return preg_replace('/^www\./i', '', strtolower(explode(':', (string)$h)[0])); };
    $sameSite = ($refHost === null || $refHost === '') || ($ourHost !== '' && $strip($refHost) === $strip($ourHost));
    $q = $sameSite ? parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY) : '';
    if (is_string($q) && $q !== '') {
      parse_str($q, $params);
      foreach (array('from', 'origin') as $k) {
        if (isset($params[$k]) && is_string($params[$k]) && $params[$k] !== '') {
          $claim = $params[$k];
          break;
        }
      }
    }
  }
  if ($claim === '') return '';
  // basename() first so a claim of '../../etc/passwd' or a full URL cannot name anything but a
  // leaf, then an exact match against the pages that actually exist. The list is DERIVED, so a
  // calculator added next year is covered without anybody remembering this file.
  $claim = basename(trim($claim), '.php');
  if ($claim === '' || !preg_match('/^[A-Za-z0-9._-]{1,64}$/', $claim)) return '';
  foreach (glob(__DIR__ . '/*.php') as $f) {
    if (strcasecmp(basename($f, '.php'), $claim) === 0) return basename($f, '.php');
  }
  return '';
}

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
  // The bucket column every other log writer appends (ecLogBucketSuffix, lib/config.inc.php).
  // Without it this was the one log a row could not be matched to the consent bucket its click
  // came from, so the contact funnel had a denominator in two units and a numerator in neither.
  // Rows written before this change have four fields and no token; the report counts them as
  // "no bucket column" rather than assigning them to either side.
  $bucket = function_exists('ecLogBucketSuffix') ? ecLogBucketSuffix() : '';
  $line = gmdate('Y-m-d\TH:i:s\Z') . "\t" . 'contact' . "\t" . $lang . "\t" . $browserLang . $bucket . "\n";
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

// WHERE DID THEY COME FROM. Appended by us, below the visitor's own words and behind a rule so it
// cannot be mistaken for part of the message. Labelled honestly in both directions: a page name
// only when one was actually carried through, and the words "not recorded" -- never a guess --
// when it was not. See ecContactOriginPage().
$originPage = ecContactOriginPage();
$message .= "\n\n-- \nCame from: " . ($originPage !== '' ? $originPage : 'not recorded') . "\n";

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