<?php
/**
 * Records a consent answer and sends the visitor back where they were (ROADMAP Task 286).
 *
 * This is the NO-JAVASCRIPT path only. With JS on, lib/Consent.lib.php's banner intercepts its own
 * form and writes the same cookie in place, so nothing ever reaches this file. It exists because a
 * banner that needs JS to answer leaves a no-JS visitor unable to consent AND unable to refuse,
 * and "as easy to refuse as to accept" cannot be satisfied by a control that does not work.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
require_once __DIR__ . '/lib/config.inc.php';

// '0' refuse, '1' accept this version, '2' accept every version. ecConsentSet() validates and
// ignores anything else, so a hand-crafted POST cannot invent a fourth state.
if (isset($_POST['ec_consent'])) {
    ecConsentSet((string) $_POST['ec_consent']);
}

// Where to go back to. Accept only a same-site absolute PATH -- never a full URL, never a
// protocol-relative "//evil.example" (which a browser reads as a host, not a path). This value
// goes straight into a Location header and comes from the request, so it is exactly the shape of
// input that turns a redirect into an open redirect.
$return = isset($_POST['return']) ? (string)$_POST['return'] : '';
if ($return === '' || $return[0] !== '/' || strpos($return, '//') === 0 || strpos($return, "\r") !== false || strpos($return, "\n") !== false) {
    $return = '/engcalcs/index.php';
}

header('Location: ' . $return, true, 303);
exit;
