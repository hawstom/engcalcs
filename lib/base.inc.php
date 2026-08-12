<?php
/**
 *
 * Engineering Calculators command and control central
 * 
 * A view (page) file accesses/joins the application with a require_once call to this file.
 * 
 * This file loads all the other required files.
 *
 * Constants:
 * NAME                        WHERE DEFINED         DESCRIPTION
 * DEBUG_MODE                  config.inc.php        TRUE or FALSE to show validator links
 * 
 * Global variables:
 * NAME                        WHERE DEFINED         DESCRIPTION
 * $basedirectory              This file             Server directory of application root
 * $baseurl                    This file             URL of application root
 * $clanguage                  Session.lib.php       User language
 * $_SESSION["CLANGUAGE"]      Session.lib.php       User language persistent for this session
 * $all_language_settings      Language.Settings.php Standards/settings for all languages, reduced early from all languages
 * $language_settings          Language.Settings.php Standards/settings for current language, reduced early from all languages
 * $ec-lang                    lang.ec.??.php        Text for current language
 *
 * Copyright 2009 Thomas Gail Haws
 *
 * LICENSE: GNU GPL v3 or later
 *
 */
// Load the config.  It's in this directory.
// It comes FIRST now, because whether a session may be started at all is a question only the
// consent helpers in it can answer (ROADMAP Task 286).
require_once('config.inc.php');

// NO SESSION IS STARTED, HERE OR ANYWHERE (ROADMAP Tasks 286 and 288). Until 2026-08-11 this file
// called session_start() at the top of every page load, above the config require, so PHPSESSID --
// a 32-hex unique identifier -- was written before anybody had been asked anything. Task 286 made
// it conditional on consent; Task 288 removed it outright. Everything the session held was some
// form of "have we already counted this", which now lives in one session cookie holding a single
// base-32 digit per page. No identifier, no server-side state. See EC_SEEN_COOKIE in config.
//
// How long this browser has been around, for the confirmed-human beacon's 10s gate. Derived from
// the de-duplication digits rather than a stored timestamp: if any page carries the human-view
// bit, this browser already dwelt somewhere long enough to count.
$ec_sessionAgeMs = ecSessionAgeMs();

// Load the language settings.
// They are needed for determining the session language in Session.lib.php below.
require_once('Language.Settings.php');

// Load the language functions and set current language.
require_once('Language.lib.php');

// Load the text for the current language
// Session.lib.php has to be loaded first above to determine current language.
// Load english first in case current language is incomplete.
require_once('lang.ec.en.php');
require_once('lang.ec.'.$clanguage.'.php');

// Load the one icon set (Task 231). Must precede HeadersFooters/Menus: both call ecIcon().
require_once('Icons.lib.php');

// Load the consent banner (ROADMAP Task 286). Must precede HeadersFooters: echoFooter() calls
// both of its functions.
require_once('Consent.lib.php');

// Load the headers and footers
require_once('HeadersFooters.lib.php');

// Load the menus that are shown in the headers and footers
require_once('Menus.lib.php');

// Load the units factors
require_once('Units.lib.php');

// Load the calculator functions
require_once('Calculators.lib.php');

// Optional parent-site hooks (CSS injection, footer menu).
// The parent site places engcalcs-parent-hooks.php two directories above engcalcs root.
$_engcalcs_parent_hooks = realpath(__DIR__ . '/../../engcalcs-parent-hooks.php');
if ($_engcalcs_parent_hooks && file_exists($_engcalcs_parent_hooks)) {
    require_once($_engcalcs_parent_hooks);
}
unset($_engcalcs_parent_hooks);
