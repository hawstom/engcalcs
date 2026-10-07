<?php
// Copyright 2009 Thomas Gail Haws. Licensed under GNU GPL v3 or later.
//
// THE RULES BEHIND send-feedback.php, the second click of "Something wrong here?" (ROADMAP Task 768).
// Pure functions: no output, no globals, and the clock and the files are parameters, so
// dev/lpn-spike/feedback-endpoint-harness.js can hold every guard against the real code.
//
// Tom, 2026-10-05: "those links open a small form that allows, but doesn't require, a message, an
// email address, and some selectors or canned phrases." Everything a visitor sends here is
// optional; a Send with nothing in it never reaches this file (the page posts only the anonymous
// tally it always posted). What arrives here is e-mailed to Tom and kept nowhere else.

/** The canned phrases: the id the page posts => the English Tom reads. A closed set. */
function ecFeedbackPicks() {
  return array(
    'numbers'   => 'The numbers look wrong',
    'broken'    => 'Something did not work',
    'wording'   => 'The wording or translation is wrong',
    'confusing' => 'This is confusing',
  );
}

/** Limits, in one place. Bytes, not characters, because a byte cap cannot be widened by encoding. */
function ecFeedbackLimits() {
  return array(
    'comment_bytes' => 12000,
    'email_bytes'   => 254,
    // GLOBAL, NOT PER SENDER: counting per sender would mean keeping each sender's IP address, and
    // privacy.php promises no address in anything this site writes. A flood therefore costs every
    // sender a few minutes, which at this site's traffic is the right trade.
    'per_window'    => 10,
    'window_s'      => 600,
    'per_day'       => 60,
  );
}

/**
 * The page name the post claims, or '' when it is not one of the suite's real pages. Matched
 * against the .php files in $dir, as formmail.php's ecContactOriginPage() does, so nothing a
 * visitor types is ever echoed into the mail as a page name.
 */
function ecFeedbackPage($claim, $dir) {
  if (!is_string($claim)) return '';
  $claim = basename(trim($claim), '.php');
  if ($claim === '' || !preg_match('/^[A-Za-z0-9._-]{1,64}$/', $claim)) return '';
  foreach (glob($dir . '/*.php') as $f) {
    if (strcasecmp(basename($f, '.php'), $claim) === 0) return basename($f, '.php');
  }
  return '';
}

/**
 * Is this a request from our own page? Two tests, both cheap for a browser and both failed by a
 * form-posting bot:
 *  - the X-EngCalcs-Feedback header, which a cross-site page cannot add without a CORS preflight
 *    this endpoint never answers;
 *  - an Origin (or, failing that, a Referer) on this same host, www or not.
 */
function ecFeedbackSameSite(array $server) {
  if (!isset($server['HTTP_X_ENGCALCS_FEEDBACK']) || $server['HTTP_X_ENGCALCS_FEEDBACK'] !== '1') return false;
  $ours = isset($server['HTTP_HOST']) ? $server['HTTP_HOST'] : '';
  $from = isset($server['HTTP_ORIGIN']) && $server['HTTP_ORIGIN'] !== 'null' ? $server['HTTP_ORIGIN']
        : (isset($server['HTTP_REFERER']) ? $server['HTTP_REFERER'] : '');
  if ($ours === '' || $from === '') return false;
  $strip = function ($h) { return preg_replace('/^www\./i', '', strtolower((string)$h)); };
  $host = parse_url($from, PHP_URL_HOST);
  $port = parse_url($from, PHP_URL_PORT);
  $theirs = $host . ($port ? ':' . $port : '');
  return $host !== null && $host !== '' && $strip($theirs) === $strip($ours);
}

/** A string field of the post, or ''. An array (name[]=x) is not a string and is dropped. */
function ecFeedbackField(array $post, $k) {
  return isset($post[$k]) && is_string($post[$k]) ? $post[$k] : '';
}

/**
 * Validates one post and composes the mail. $ctx holds 'page' (already checked or ''), 'build'
 * (string) and 'to'.
 *
 * @return array  one of
 *   array('honeypot' => true)            -- the hidden field was filled: answer as if sent, send nothing
 *   array('error' => 'email'|'bad'|'too-long'|'empty')
 *   array('to', 'subject', 'body', 'headers')
 */
function ecFeedbackCompose(array $post, array $ctx) {
  $lim = ecFeedbackLimits();
  if (trim(ecFeedbackField($post, 'website')) !== '') return array('honeypot' => true);

  $email = trim(ecFeedbackField($post, 'email'));
  $comment = ecFeedbackField($post, 'comment');
  $picksRaw = ecFeedbackField($post, 'picks');
  if (strlen($comment) > $lim['comment_bytes'] || strlen($email) > $lim['email_bytes'] || strlen($picksRaw) > 200) {
    return array('error' => 'too-long');
  }
  // THE ONLY VALUE THAT REACHES A HEADER. No CR or LF, and the same address pattern formmail.php
  // holds the contact form to, read case-insensitively (A@B.com is an address).
  if ($email !== '' && (preg_match("/[\r\n]/", $email)
      || !preg_match("/^[a-z0-9]+([_\\.+-][a-z0-9]+)*@([a-z0-9]+([\\.-][a-z0-9]+)*)+\\.[a-z]{2,}$/i", $email))) {
    return array('error' => 'email');
  }
  $all = ecFeedbackPicks();
  $picks = array();
  foreach (array_filter(explode(',', $picksRaw), 'strlen') as $id) {
    if (!isset($all[$id])) return array('error' => 'bad');
    $picks[$id] = $all[$id];
  }
  // Body text only, never a header, so it cannot inject one; still, control characters other than
  // newline and tab are dropped so the mail reads as what was typed.
  $comment = preg_replace('/[^\P{C}\n\t]/u', '', str_replace("\r\n", "\n", $comment));
  if ($comment === null) return array('error' => 'bad');   // not UTF-8
  $comment = trim($comment);
  if (!$picks && $comment === '' && $email === '') return array('error' => 'empty');

  $code = substr(preg_replace('#[^A-Za-z0-9._:/-]#', '', ecFeedbackField($post, 'code')), 0, 80);
  $lang = substr(preg_replace('/[^A-Za-z-]/', '', ecFeedbackField($post, 'lang')), 0, 12);
  $page = isset($ctx['page']) ? (string)$ctx['page'] : '';
  $build = isset($ctx['build']) ? preg_replace('/[^\x20-\x7E\x{00B7}]/u', '', (string)$ctx['build']) : '';

  $subject = 'Something wrong here? ' . ($page !== '' ? $page : 'page not recorded')
    . ($code !== '' && $code !== 'none' ? ' [' . $code . ']' : '');
  $body = 'Picked: ' . ($picks ? implode('; ', $picks) : 'nothing') . "\n\n"
    . "Comment:\n" . ($comment !== '' ? $comment : '(none)') . "\n\n"
    . "-- \n"
    . 'Page: ' . ($page !== '' ? $page : 'not recorded') . "\n"
    . 'Language: ' . ($lang !== '' ? $lang : 'not recorded') . "\n"
    . 'Build: ' . ($build !== '' ? $build : 'not recorded') . "\n"
    . 'Message on the map: ' . ($code !== '' && $code !== 'none' ? $code : 'none') . "\n"
    . 'Reply to: ' . ($email !== '' ? $email : 'no address given') . "\n"
    . "If this message needs translation, use AI.\n";
  $headers = "From: HawsEDC Support <support@hawsedc.com>\r\n"
    . "MIME-Version: 1.0\r\n"
    . "Content-Type: text/plain; charset=UTF-8"
    . ($email !== '' ? "\r\nReply-To: " . $email : '');
  return array('to' => $ctx['to'], 'subject' => $subject, 'body' => $body, 'headers' => $headers);
}

/**
 * Admits one send against the global limits, recording its time if admitted. $file holds one Unix
 * time per line and nothing else, pruned to the last day on every write.
 * @return bool  true when this send may go.
 */
function ecFeedbackAdmit($file, $now) {
  $lim = ecFeedbackLimits();
  $dir = dirname($file);
  if (!is_dir($dir)) @mkdir($dir, 0750, true);
  $fh = @fopen($file, 'c+');
  // A rate file that cannot be opened must not silence every report: admit, unrecorded.
  if (!$fh) return true;
  flock($fh, LOCK_EX);
  $times = array();
  foreach (explode("\n", stream_get_contents($fh)) as $t) {
    if (ctype_digit($t) && (int)$t > $now - 86400) $times[] = (int)$t;
  }
  $recent = count(array_filter($times, function ($t) use ($now, $lim) { return $t > $now - $lim['window_s']; }));
  $ok = $recent < $lim['per_window'] && count($times) < $lim['per_day'];
  if ($ok) $times[] = $now;
  ftruncate($fh, 0);
  rewind($fh);
  fwrite($fh, implode("\n", $times));
  flock($fh, LOCK_UN);
  fclose($fh);
  return $ok;
}

/**
 * Sends the composed mail. With EC_FEEDBACK_SINK set (harnesses only) the mail is written into that
 * directory as JSON instead, so a test reads exactly what mail() would have been handed.
 */
function ecFeedbackDeliver(array $mail) {
  $sink = getenv('EC_FEEDBACK_SINK');
  if (is_string($sink) && $sink !== '') {
    $f = rtrim($sink, '/') . '/mail-' . str_replace('.', '', sprintf('%.6f', microtime(true))) . '.json';
    return @file_put_contents($f, json_encode($mail, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) !== false;
  }
  return @mail($mail['to'], $mail['subject'], $mail['body'], $mail['headers']);
}
