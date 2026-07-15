<?php
/**
 *
 *
 * Global variables:
 * NAME                        WHERE DEFINED         DESCRIPTION
 * $debugmode                  This file             TRUE or FALSE to show validator links
 * $basedirectory              This file             Server directory of application root
 * $baseurl                    This file             URL of application root
 * $clanguage                  Session.lib.php       User language
 * $_SESSION["CLANGUAGE"]      Session.lib.php       User language persistent for this session
 * $all_language_settings      Language.Settings.php Standards/settings for all languages
 * $language_settings          Language.Settings.php Standards/settings for current language, reduced early from all languages
 * $ec-lang                    lang.ec.??.php        Text for current language
 *
 * Copyright 2009 Thomas Gail Haws
 *
 * LICENSE: GNU GPL v3 or later
 *
 */

$basedirectory = realpath(__DIR__.'/../..');

// Set some global variables
define('DEBUG_MODE', getenv('APP_ENV') === 'development');

define('BASE_DIRECTORY', $basedirectory);

// Language demand log — stored in log/ at the project root, blocked from HTTP by log/.htaccess.
// Each line: ISO-8601 UTC timestamp TAB lang-code TAB source TAB page-basename
//   source='get'     explicit ?lang=XX selection — logged every occurrence
//   source='cookie'  returning user with saved preference — logged once per session
//   source='browser' raw first Accept-Language tag (e.g. es-MX, zh-TW) — logged once ever per browser via ec_blang cookie
// Run log/lang-log-stats.sh to analyze.
define('LANG_LOG', dirname(__DIR__) . '/log/engcalcs-lang.log');

// Confirmed-human calculator-usage log — a separate question from LANG_LOG above.
// Written by log-calc-event.php, called via navigator.sendBeacon from
// EngCalcs.maybeLogCalcUsage() (js/Calculators.lib.js) the first time a real,
// user-triggered calculation happens at least 10s after page load in a given
// session for a given calculator. Deduped once per (session, page) so reloads
// and repeated recalculation of the same calculator don't inflate counts.
// Each line: ISO-8601 UTC timestamp TAB page-basename TAB served-lang TAB raw-Accept-Language
// Answers "what calculators/languages are humans actually using" (bots essentially
// never run this far), as opposed to LANG_LOG's raw browser-preference/demand signal.
// Run log/lang-log-stats.sh to analyze.
define('CALC_USAGE_LOG', dirname(__DIR__) . '/log/engcalcs-calc-usage.log');

// Confirmed-human PAGE-VIEW log — the "window shopping" tier between LANG_LOG (raw
// reach, includes bots) and CALC_USAGE_LOG (confirmed human who actually calculated).
// Written by log-human-view.php, called via navigator.sendBeacon from
// EngCalcs.maybeLogHumanView() (js/Calculators.lib.js) once the visitor's *session*
// (not just this page) is at least 10s old, whether or not they ever calculate.
// Session age, not page age, is the gate: once a session has proven itself human on
// one page, later pages in the same session don't need their own 10s wait. Deduped
// once per (session, page, lang) so reloads don't inflate counts.
// Each line: ISO-8601 UTC timestamp TAB page-basename TAB served-lang TAB raw-Accept-Language
// Run log/lang-log-stats.sh to analyze.
define('HUMAN_VIEW_LOG', dirname(__DIR__) . '/log/engcalcs-human-view.log');
