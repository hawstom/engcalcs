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

// The one origin every canonical/hreflang/sitemap URL is built from (ROADMAP Task 149).
// Deliberately NOT derived from $_SERVER['HTTP_HOST']: that is client-supplied, so a spoofed
// Host header would emit a poisoned <link rel="canonical"> pointing search engines off-site.
// The server currently answers on all four of http/https x www/non-www with no redirect, so
// this constant is the only thing telling Google which one to index. Non-www https matches the
// form used in 27 of the 29 hard-coded site URLs across the repo and the parent site.
define('CANONICAL_ORIGIN', 'https://hawsedc.com');

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

// ---- Author/tester opt-out from the usage logs (ROADMAP Task 210) ----
// Visit any page with ?ec_nolog=1 once per browser to stop that browser being counted by ALL THREE
// log writers (LANG_LOG, CALC_USAGE_LOG, HUMAN_VIEW_LOG); ?ec_nolog=0 undoes it.
// Deliberately an opt-out AT WRITE TIME rather than a filter applied afterwards. The logs carry no
// IP and no session id, so "that looks like the author exercising many calculators and languages"
// is a guess -- it cannot be applied to data already written, and it would also throw away real
// multilingual users, who are the readers we most want to see. Suppressing at the source is exact.
// Per-device by nature: set it once in each browser used for hand-testing.
define('EC_NOLOG_COOKIE', 'ec_nolog');
if (isset($_GET['ec_nolog']) && !headers_sent()) {
    if ($_GET['ec_nolog'] === '0') {
        setcookie(EC_NOLOG_COOKIE, '', time() - 86400, '/');
        unset($_COOKIE[EC_NOLOG_COOKIE]);
    } else {
        // Ten years: this is a standing choice by someone who works on the site, not a preference
        // anyone needs to revisit.
        setcookie(EC_NOLOG_COOKIE, '1', time() + (10 * 365 * 86400), '/');
        $_COOKIE[EC_NOLOG_COOKIE] = '1';
    }
}
/** True when this browser has opted out of being counted. Checked by every log writer. */
function ecLoggingOptedOut() {
    return isset($_COOKIE[EC_NOLOG_COOKIE]) && $_COOKIE[EC_NOLOG_COOKIE] === '1';
}

// Looped-network project locks (ROADMAP Task 195 Phase 2) — one small JSON record per project
// document id, written by lpn-lock.php, blocked from HTTP by lpn-locks/.htaccess exactly as log/ is.
// Each record: {"projectId":…,"holder":…,"lockedBy":…,"lastActivity":unix-ts}
// Deliberately flat files rather than a database: this suite's stated architecture is "no database,
// no authentication" (CLAUDE.md), and MySQL here would be a new dev-environment dependency and a
// hurdle for contributors, bought for a few hundred bytes of coordination state.
// No private data lives here by design — a friendly name the user typed ("Dave T.") and a random
// token — so discovery of the directory is not a disclosure event, but it stays blocked anyway.
define('LPN_LOCK_DIR', dirname(__DIR__) . '/lpn-locks');
// Housekeeping, since the honor-system design deliberately never auto-expires a LOCK. This expires
// the on-disk RECORD long after any plausible session, purely so abandoned projects don't leak
// files forever. 30 days is far past a working day; it can never end a live edit.
define('LPN_LOCK_TTL_DAYS', 30);
// Hard bound on how much disk a stranger can make us use. At the cap, existing projects keep
// working and only the creation of a NEW record is refused.
define('LPN_LOCK_MAX_RECORDS', 5000);
