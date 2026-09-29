<?php
/**
 * Records a consent answer and sends the visitor back where they were (ROADMAP Task 286).
 *
 * The consent form itself is the NO-JAVASCRIPT path only. With JS on, lib/Consent.lib.php's banner
 * intercepts its own form and writes the same cookie in place, so nothing ever reaches this file
 * for an ordinary answer. It exists because a banner that needs JS to answer leaves a no-JS
 * visitor unable to consent AND unable to refuse, and "as easy to refuse as to accept" cannot be
 * satisfied by a control that does not work.
 *
 * `ec_wipe` (below) is the one request this file DOES take from JS -- Looped-Network.php's Start
 * fresh, which needs a cookie that JS cannot reach (`ec_consent` is written client-side but never
 * erased client-side; `ec_blang`/`ec_seen` are HttpOnly by design). This file already does a
 * server round trip and a redirect, so it is also where that reload happens.
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

// Start fresh (Task: "Start fresh isn't giving me the cookies banner", Tom 2026-09-29). Distinct
// from ec_consent=0: refusing records a "no" that has to be honoured, so ecConsentSet() keeps the
// cookie. Start fresh's confirm promises the page reloads exactly as a brand-new visitor would see
// it, and a brand-new visitor has never answered at all -- so this erases the record itself, not
// just what it gated. ecConsentForget() reuses ecForgetAnalyticsStorage() rather than re-listing
// ec_blang/ec_seen here, so there is one list of consent-gated cookies, not two.
if (isset($_POST['ec_wipe'])) {
    ecConsentForget();
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
