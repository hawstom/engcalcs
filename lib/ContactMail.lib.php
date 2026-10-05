<?php
// Copyright 2009 Thomas Gail Haws. Licensed under GNU GPL v3 or later.
//
// Pure functions behind formmail.php: validate one contact-form post and compose the e-mail. No
// output, no mail(), no globals, so dev/lpn-spike/feedback-contact-harness.js can run the real
// rules from the command line. formmail.php does the sending.

/** The categories contact.php offers: value => the English label Tom reads in the subject. */
function ecContactCategories() {
  return array(
    'wrong'   => 'Something is wrong',
    'wording' => 'Wrong wording or translation',
    'idea'    => 'An idea',
    'other'   => 'Other',
  );
}

/** A category value that is on the list, or ''. Anything else is dropped, never echoed. */
function ecContactCategory($v) {
  $all = ecContactCategories();
  return (is_string($v) && isset($all[$v])) ? $v : '';
}

/** A slug of the same charset log-signal-event.php keeps, at most 80 characters. */
function ecContactSlug($v) {
  return is_string($v) ? substr(preg_replace('#[^A-Za-z0-9._:/-]#', '', $v), 0, 80) : '';
}

/**
 * Validates and composes. $in holds the raw POST values (name, email, subject, message,
 * more_message, category, code, lang). $originPage is the already-checked page name or ''.
 *
 * The e-mail address is OPTIONAL (Ida, 2026-10-05): a message with no address is accepted and simply
 * has no Reply-to. One that is present is still held to the same pattern and the same newline guard.
 *
 * @return array  array('error' => text) or array('subject', 'message', 'replyto')
 */
function ecContactCompose(array $in, $originPage) {
  $get = function ($k) use ($in) { return isset($in[$k]) && is_string($in[$k]) ? $in[$k] : ''; };
  $name = $get('name'); $email = trim($get('email')); $subject = $get('subject');
  if (preg_match("/(\r|\n)/", $name) or preg_match("/@/", $name)) {
    return array('error' => "Are you trying to spam this form?  Please don't do that.");
  }
  if ($email !== '' && (preg_match("/(\r|\n)/", $email) or !preg_match("/^[a-z0-9]+([_\\.-][a-z0-9]+)*@([a-z0-9]+([\.-][a-z0-9]+)*)+\\.[a-z]{2,}$/i", $email))) {
    return array('error' => 'Invalid e-mail address.');
  }
  if (preg_match("/(\r|\n)/", $subject) or preg_match("/@/", $subject)) {
    return array('error' => 'Get out, spammer.');
  }
  $message = $get('message') . $get('more_message');
  if (trim($get('message')) === '') {
    return array('error' => 'Please write a message.');
  }
  $cats = ecContactCategories();
  $cat = ecContactCategory($get('category'));
  $code = ecContactSlug($get('code'));
  $lang = preg_replace('/[^A-Za-z-]/', '', substr($get('lang'), 0, 12));
  // Appended by us, below the visitor's words and behind a rule. Fixed labels, validated values.
  $message .= "\n\n-- \nCame from: " . ($originPage !== '' ? $originPage : 'not recorded') . "\n";
  $message .= 'About: ' . ($cat !== '' ? $cats[$cat] : 'not stated') . "\n";
  if ($lang !== '') { $message .= 'Language: ' . $lang . "\n"; }
  if ($code !== '') { $message .= 'Error code: ' . $code . "\n"; }
  if ($cat !== '') { $subject = '[' . $cats[$cat] . '] ' . $subject; }
  $replyto = ($email !== '') ? 'Reply-to: ' . $name . ' <' . $email . '>' : '';
  return array('subject' => $subject, 'message' => $message, 'replyto' => $replyto);
}

/** The additional mail headers: From, then Reply-to only when there is one, joined with no empty or trailing line. */
function ecContactHeaders($from, $replyto) {
  return $from . ($replyto !== '' ? "\r\n" . $replyto : '');
}
