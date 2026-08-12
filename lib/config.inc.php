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
//   source='anon'    a page load by somebody who has not consented to being counted once rather
//                    than every time (Task 286). Carries the same raw Accept-Language tag as
//                    'browser', but once per page load, because nothing may be stored to
//                    de-duplicate against. Always marked 'visit' in the trailing bucket column.
// A FIFTH COLUMN, 'visit', appears on undeduplicated rows only; its absence means a deduplicated
// row, which is what every row written before Task 286 is. See ecLogBucketSuffix() below.
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

// Contact-form SEND log (ROADMAP Task 206) — the second of the two numbers that make the
// contact funnel arithmetic instead of a guess: HUMAN_VIEW_LOG rows for page 'contact' are the
// invitation clicks, and this file is the messages actually sent. Written SERVER-SIDE by
// formmail.php in its mail() success branch, deliberately NOT by a beacon: a beacon fired from
// the submit handler races the navigation and cannot know whether the send succeeded, so it
// would count attempts — and attempts are exactly what we already cannot tell apart from
// successes. formmail.php knows the truth and is already on the page.
// Each line: ISO-8601 UTC timestamp TAB page-basename TAB served-lang TAB raw-Accept-Language
// — the same four fields as the two logs above, with page-basename fixed at 'contact' so the
// send rows line up with the view rows they are divided by.
// Run log/lang-log-stats.sh to analyze.
define('CONTACT_SEND_LOG', dirname(__DIR__) . '/log/engcalcs-contact-send.log');

// Named-calculation log (ROADMAP Task 215) — the closest instrument this suite can build to its
// own mission. Written by log-title-event.php from EngCalcs.maybeLogTitleEvent()
// (js/Calculators.lib.js) when a visitor actually types a Printable Title or Subtitle. Somebody
// who names a calculation is telling us they mean to put it in front of another human, which is
// the one behavior the suite exists to produce and the one no other counter here approximates:
// CALC_USAGE_LOG says they got an answer, this says they intend to pass it on.
// Each line: ISO-8601 UTC timestamp TAB page-basename TAB served-lang TAB raw-Accept-Language TAB field
// The fifth column is 'title' or 'subtitle'. Both are logged because they are different acts:
// a title labels a scratch calculation, a subtitle as well means someone is building a document.
// Deduped once per (session, page, field), so editing a title five times counts once.
// Run log/lang-log-stats.sh to analyze.
define('TITLE_LOG', dirname(__DIR__) . '/log/engcalcs-title.log');

// ---- Author/tester opt-out from the usage logs (ROADMAP Task 210) ----
// Visit any page with ?ec_nolog=1 once per browser to stop that browser being counted by EVERY log
// writer -- LANG_LOG, CALC_USAGE_LOG, HUMAN_VIEW_LOG, CONTACT_SEND_LOG and TITLE_LOG;
// ?ec_nolog=0 undoes it. A new writer joins that list by calling ecLoggingOptedOut(), and every one
// of them must: an opt-out with an exception in it is not an opt-out.
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

// ---- Consent for the storage that is NOT strictly necessary (ROADMAP Task 286) ----
//
// ePrivacy Art 5(3) permits storing information on a visitor's device without asking only when it
// is strictly necessary for a service the visitor explicitly requested — applied PER PURPOSE, and
// to localStorage exactly as to cookies. Two things here fail that test and one is mixed:
//
//   ec_blang   analytics only; exists so a browser-language statistic is counted once per browser.
//   PHPSESSID  MIXED — after this task it is analytics ONLY. Its other job (remembering a chosen
//              language) moved to the ec_language cookie, which the visitor set deliberately and
//              which is therefore exempt on its own footing. See lib/Language.lib.php.
//   the offline beacon queue in IndexedDB (js/Calculators.lib.js) — analytics storage, so it is
//              gated client-side by the same cookie.
//
// Exempt, and deliberately NOT gated: the per-page input cookies (the numbers the visitor typed,
// written only after they typed them), ec_language, ec_nolog, lpn_'s localStorage projects, and
// the consent record below — a cookie whose only job is to honour the answer given is as
// necessary as an answer gets, which is also why refusing does not mean being asked again.
//
// Value format: "<state>.<unix-ts>.<policy-version>", e.g. "1.1754899200.1". The timestamp and
// version are the consent RECORD — what was agreed to and when — kept because a consent you
// cannot evidence is not much of a consent, and because bumping EC_CONSENT_VERSION is how a
// materially changed notice re-asks everybody without a second mechanism.
define('EC_CONSENT_COOKIE', 'ec_consent');
define('EC_CONSENT_VERSION', '1');
define('EC_CONSENT_DAYS', 365);

/**
 * Whether cookies should carry the Secure attribute on THIS request.
 *
 * Not a constant true: the server answers on http as well as https, and a Secure cookie set over
 * http is silently dropped. Before Task 286 that silence cost the language preference of any
 * visitor arriving over http — the session carried them instead, and the session is exactly what
 * is going away.
 */
function ecCookieSecure() {
    if (!empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off') return true;
    if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') return true;
    return false;
}

/** 'granted', 'denied', or 'unknown' — the third is a visitor who has not answered yet. */
function ecConsentState() {
    if (empty($_COOKIE[EC_CONSENT_COOKIE])) return 'unknown';
    $state = explode('.', $_COOKIE[EC_CONSENT_COOKIE])[0];
    if ($state === '1') return 'granted';
    if ($state === '0') return 'denied';
    return 'unknown';
}

/** True only for an explicit yes. Unknown is not consent; silence never is. */
function ecAnalyticsConsented() {
    return ecConsentState() === 'granted';
}

/** Writes the consent record. $granted true = yes, false = no. Both answers are recorded. */
function ecConsentSet($granted) {
    if (headers_sent()) return;
    $value = ($granted ? '1' : '0') . '.' . time() . '.' . EC_CONSENT_VERSION;
    setcookie(EC_CONSENT_COOKIE, $value, [
        'expires'  => time() + EC_CONSENT_DAYS * 86400,
        'path'     => '/',
        'samesite' => 'Lax',
        'secure'   => ecCookieSecure(),
        'httponly' => false, // the banner reads and writes it from JS so answering needs no reload
    ]);
    $_COOKIE[EC_CONSENT_COOKIE] = $value;
    if (!$granted) ecForgetAnalyticsStorage();
}

/**
 * Deletes the storage that consent was covering. Called on refusal and on withdrawal, because
 * "withdraw at any time" that leaves the cookie sitting there is not a withdrawal. The IndexedDB
 * half of this is client-side, in EngCalcs.flushQueue().
 */
function ecForgetAnalyticsStorage() {
    if (headers_sent()) return;
    if (session_status() === PHP_SESSION_ACTIVE) {
        $_SESSION = [];
        session_destroy();
    }
    foreach (['ec_blang', session_name()] as $name) {
        if (isset($_COOKIE[$name])) {
            setcookie($name, '', ['expires' => time() - 86400, 'path' => '/']);
            unset($_COOKIE[$name]);
        }
    }
}

/**
 * Starts the PHP session — and ONLY if the visitor said yes.
 *
 * Before Task 286 lib/base.inc.php called session_start() unconditionally at the top of every
 * page load, so PHPSESSID was written before anybody had been asked anything. No banner can fix
 * that from the outside, which is why lazy sessions were the real work of this phase rather than
 * the banner. Every caller must be prepared for this to return false and simply not dedupe.
 *
 * @return bool whether a session is running afterwards
 */
function ecSessionStart() {
    if (session_status() === PHP_SESSION_ACTIVE) return true;
    if (!ecAnalyticsConsented()) return false;
    if (headers_sent()) return false;
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'samesite' => 'Lax',
        'secure'   => ecCookieSecure(),
        'httponly' => true,
    ]);
    session_start();
    return true;
}

/** True when a session is running, i.e. when de-duplication of the usage logs is possible. */
function ecSessionActive() {
    return session_status() === PHP_SESSION_ACTIVE;
}

/**
 * The bucket a log row belongs to, appended as a trailing column (see log/lang-log-stats.sh).
 *
 * Answers Tom's question of 2026-08-11: *"If a user opts out of being logged as a returner, do we
 * report them in a separate bucket... I don't think that we want to completely ignore them."*
 * Right, and we do not have to. Consent governs STORAGE, and de-duplication is what needs the
 * storage; a server-side count that stores nothing on the device and carries no IP, no session id
 * and no identifier of any kind needs no cookie to be lawful and no cookie to be useful.
 *
 * So there are two honest numbers, reported side by side and NEVER summed:
 *   visitors — consented, de-duplicated per session. Today's numbers, unchanged.
 *   visits   — everybody else, one row per event, no de-duplication and nothing stored.
 *
 * A row with no trailing column is a 'visitor' row, which is what every row written before this
 * task was. That is why the marker is emitted only for 'visit': the whole existing history stays
 * byte-identical and every existing awk field index keeps its meaning.
 */
function ecLogBucketSuffix() {
    return ecSessionActive() ? '' : "\tvisit";
}

// A visitor who has withdrawn consent, or refused it, must not keep carrying the storage it
// covered. Checked on every page load because withdrawal can happen in another tab.
if (ecConsentState() !== 'granted' && (isset($_COOKIE['ec_blang']) || isset($_COOKIE[session_name()]))) {
    ecForgetAnalyticsStorage();
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
