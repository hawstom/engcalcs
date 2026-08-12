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

// Start the session here and here only -- and only for a visitor who has agreed to being counted
// once rather than every time. Until Task 286 this was an unconditional session_start() ABOVE the
// config require, which wrote PHPSESSID on every page load before anybody had been asked anything.
// The session's other job -- remembering a chosen language -- moved to the ec_language cookie,
// which the visitor sets deliberately and which is exempt on its own footing.
ecSessionStart();
// First request of this session: mark when it started, so pages can tell how long
// this visitor has been around (used by the confirmed-human page-view log, which
// gates on session age rather than this single page's age). With no session there is nothing to
// remember, so age reads 0 and the beacon simply waits out its full 10s on every page -- a
// slightly stricter human test, never a looser one.
$ec_sessionAgeMs = 0;
if (ecSessionActive()) {
    if (empty($_SESSION['SESSION_START'])) {
        $_SESSION['SESSION_START'] = time();
    }
    $ec_sessionAgeMs = (time() - $_SESSION['SESSION_START']) * 1000;
}

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
