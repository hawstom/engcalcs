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

// PCRE's JIT compiler needs to allocate EXECUTABLE memory, and a hardened web server will not let
// it -- PHP then emits, on the first preg_* call of the request:
//
//   Warning: preg_replace(): Allocation of JIT memory failed, PCRE JIT will be disabled. This is
//   likely caused by security restrictions. Either grant PHP permission to allocate executable
//   memory, or set pcre.jit=0
//
// It is a warning, not an error: PCRE falls back to the interpreter and every pattern still matches
// correctly. What makes it worth fixing is WHERE it lands. Task 322 turned display_errors on for
// DEBUG_MODE, so on a dev host this now prints into the page's HTML -- above the doctype, since the
// first regex runs during the bootstrap -- and on production it goes on repeating itself into
// error_log for the life of the install. Neither is a thing to leave alone once seen.
//
// **CLI IS EXCLUDED ON PURPOSE, because there the JIT works and is worth having.** Verified
// 2026-08-14: `php -r 'preg_match(...)'` on this machine JITs without complaint; only the web SAPI
// is restricted. The split matters -- dev/scripts/ parses 27 language files with heavy patterns on
// every check_all.sh run, which is exactly the workload a JIT earns its keep on, while a web
// request runs a handful of small patterns over cookie-sized inputs and cannot measure the
// difference. So this buys back the warning at no cost anybody can observe.
//
// This is deliberately not left to php.ini: the suite is deployed by `git pull` onto a host we do
// not configure, so a fix that lives in server config is a fix that does not travel.
//
// FIRST STATEMENT IN THE BOOTSTRAP, and it has to be. lib/base.inc.php requires this file before
// anything else and contains no regex of its own, so this runs before the suite's first preg_* --
// setting it later would emit the warning once and then suppress the ones that no longer matter.
if (PHP_SAPI !== 'cli') { ini_set('pcre.jit', '0'); }

$basedirectory = realpath(__DIR__.'/../..');

// Set some global variables
define('DEBUG_MODE', getenv('APP_ENV') === 'development');

// A DEVELOPMENT SERVER MUST BE ABLE TO SAY WHAT WENT WRONG. Until 2026-08-14 DEBUG_MODE only
// controlled a validator link, and nothing anywhere set display_errors -- so when dev.hawsedc.com's
// first deploy answered 500 with an EMPTY BODY on every page, the one machine whose whole purpose is
// to be broken safely could not report its own fatal. Diagnosing it from outside took an hour of
// narrowing (static assets answer, sw.php answers, therefore the fault is inside base.inc.php's
// include chain) to reach a conclusion the error log states in one line.
//
// Gated on APP_ENV, so production is untouched: with the variable unset, DEBUG_MODE is false and
// nothing below runs. display_errors leaks filesystem paths, which is exactly why it belongs on a
// dev box and nowhere else -- and why this is opt-in by environment rather than by editing a file
// somebody then forgets to edit back.
if (DEBUG_MODE) {
    @ini_set('display_errors', '1');
    @ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);
}

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

// Behaviour-signal log (ROADMAP Tasks 216 and 200) — the questions the four logs above cannot
// answer. Written by log-signal-event.php from EngCalcs.logSignal() (js/Calculators.lib.js).
// Each line: ISO-8601 UTC timestamp TAB page TAB served-lang TAB raw-Accept-Language TAB event TAB detail
//
// ONE LOG WITH AN EVENT COLUMN, not six more endpoints. Each of the six questions below is the
// same shape as the others and as the four logs above — when, which page, which language, plus one
// short fact — so six near-identical 90-line writers would be six places to keep the offline-
// queue handling, the opt-out check, the bucket suffix and the timestamp trust window in step. The
// four logs above are separate because each is a TIER of one funnel and the report divides them by
// each other; these are not a funnel, they are diagnostics, and they are never divided by anything
// but the human-view count.
//
//   outbound  A reference link out of /engcalcs/ was clicked (Task 216). detail = host + path.
//             Tom, 2026-08-05: *"How often are non-English people asking for 'n' help?"* The click
//             IS the complaint — a non-English visitor opening an English-only roughness table is
//             a complete signal, and asking them to also say so costs more for the same one bit.
//             Feeds Task 217.
//   touch     The visitor changed some input on this page (Task 200). Splits a human view with no
//             calculation into "could not understand it" and "did not want it" — opposite
//             development responses, and the cheapest diagnostic available.
//   units     A unit was chosen, either by preset button or by one select. detail =
//             'preset:us' | 'preset:si' | '<family>:<unit>'. Validates EC_DEFAULT_UNIT_SET by
//             language and the per-family defaults of Task 162. Read it to REORDER options by
//             measured frequency, not to delete them: an unused option in a dropdown costs a user
//             nothing, a missing one costs them the calculator.
//   repeat    detail = 'return', logged when this browser has already left WORK on this page. The
//             strongest value signal the suite does not otherwise collect — a calculator a working
//             engineer comes back to is worth more than a hundred one-off visits. STORES NOTHING
//             NEW: it reads the page's own input cookie -- or, on Looped-Network, a saved project
//             DOCUMENT -- which is exempt storage that already exists, rather than a page list that
//             would have made the consent banner's wording false. Not the lpn project INDEX: a
//             first visit writes one before any edit, so it would count reopening as using. Reading it for analytics is still an analytics access, so the row is gated on
//             consent and is absent for everybody else. There is no 'new' row: a first visit is
//             already a human-view row, and writing both would double every page's view count for
//             consenters only. See dev/cookie-storage-inventory.md.
//   lpn       Map-interface diagnostics (Task 200). detail = 'first:<example|element|backdrop|
//             import>' — which of those a visitor does FIRST, the first evidence bearing on the
//             empty-canvas decision closed 2026-07-29 with no data — or 'diag:<code>', which of
//             the solver's pre-solve complaints fires most. Between them they name where the map
//             interface loses people.
//   share     The share control under the Printable Title was used (Task 228). detail = 'copy'
//             (the clipboard took it) or 'manual' (no clipboard here, so the link was shown for
//             the visitor to copy). ONE HONEST MEASURE and no more: it says the control was used,
//             never that a link was opened by anybody, because nothing we can store would tell us
//             that. The copy/manual split is the same row's second job -- it says how often the
//             clipboard path is actually unavailable, which is otherwise unknowable from here.
//             Compare against TITLE_LOG's 'title' rows: those are the people who declared the
//             intent this control exists to serve.
//
// DE-DUPLICATION IS IN THE PAGE'S OWN MEMORY, NOT ON THE DEVICE, and that is a deliberate limit.
// The four logs above dedupe per (visit, page) using one base-32 digit in ec_seen — five bits, the
// maximum a single digit holds, which is exactly the sentence in the consent banner ("a single
// digit per page"). A sixth bit would make it two digits and make that sentence false, so these
// events dedupe per PAGE LOAD in JS and store nothing new. The cost is honest and small: a visitor
// who reloads a page and clicks the same reference twice is two rows. The cost of the alternative
// was a promise we would have had to go back on.
define('SIGNAL_LOG', dirname(__DIR__) . '/log/engcalcs-signal.log');

// ---- Author/tester opt-out from the usage logs (ROADMAP Task 210) ----
// Visit any page with ?ec_nolog=1 once per browser to stop that browser being counted by EVERY log
// writer -- LANG_LOG, CALC_USAGE_LOG, HUMAN_VIEW_LOG, CONTACT_SEND_LOG, TITLE_LOG and SIGNAL_LOG;
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

// The de-duplication store: ONE DIGIT PER PAGE, and no identifier of any kind (ROADMAP Task 288).
//
// Tom, 2026-08-12, writing the banner: *"May we store a single digit per page..."* That sentence
// is the specification. It is also the honest limit — one digit per page is what de-duplication
// actually needs, and a single global bit could only ever say "seen before", which would buy
// distinct-browsers-ever and destroy every per-page and per-session number the funnel rests on.
//
// WHAT REPLACED WHAT. This used to be PHPSESSID: a 32-hex random unique identifier plus a
// server-side session file, holding SESSION_START, CLANG_LOGGED, LANG_VIEW_LOGGED[page],
// HUMAN_VIEW_LOGGED[page|lang], CALC_USAGE_LOGGED[page] and TITLE_LOGGED[page|field]. Every one of
// those is the same question — "have we already counted this?" — and none of them needed an
// identifier to answer it. So there is no session any more, no server-side state, and nothing
// stored that could single a visitor out. What remains is a session cookie holding, per page
// visited, one base-32 digit whose bits are:
//
//   1  the language 'view' row for this page                (was LANG_VIEW_LOGGED)
//   2  the confirmed-human page view                        (was HUMAN_VIEW_LOGGED)
//   4  the confirmed calculation                            (was CALC_USAGE_LOGGED)
//   8  a printable Title was named                          (was TITLE_LOGGED[title])
//  16  a printable Subtitle was named                       (was TITLE_LOGGED[subtitle])
//
// Five bits, maximum 31, so exactly one digit in base 32 — which is why the sentence in the banner
// is true rather than approximately true. Format: "page:d,page:d". A session visits a handful of
// pages, so this stays short.
//
// SESSION_START IS GONE and nothing replaced it. It existed so a session that had already proven
// itself human did not make later pages wait out their own 10 seconds. Bit 2 answers that question
// better: if ANY page carries it, this browser has already dwelt somewhere, so no timestamp needs
// storing at all. One less thing on the device, and one less thing to explain.
define('EC_SEEN_COOKIE', 'ec_seen');
define('EC_SEEN_LANG_VIEW', 1);
define('EC_SEEN_HUMAN_VIEW', 2);
define('EC_SEEN_CALC', 4);
define('EC_SEEN_TITLE', 8);
define('EC_SEEN_SUBTITLE', 16);
// One reserved pseudo-page for the facts that are about the VISIT rather than about a page. Its
// name cannot collide with a real one: every real page name is a script basename, and no script is
// called "_v". Bit 1 means the visit's one demand row ('cookie' or 'browser') has been written --
// without it, LANG_LOG loses the "returning users with a saved preference" statistic entirely,
// because every page would log 'view' and nothing would ever log 'cookie'.
define('EC_SEEN_VISIT', '_v');
define('EC_SEEN_DEMAND', 1);

/**
 * Whether cookies should carry the Secure attribute on THIS request.
 *
 * Not a constant true: the server answers on http as well as https, and a Secure cookie set over
 * http is silently dropped. Before Task 286 that silence cost the language preference of any
 * visitor arriving over http — the session carried them instead, and the session is now gone.
 */
function ecCookieSecure() {
    if (!empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off') return true;
    if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') return true;
    return false;
}

/**
 * 'granted', 'granted_all', 'denied', or 'unknown'.
 *
 * THREE ANSWERS, NOT TWO (Tom, 2026-08-12): *"[Refuse] [Accept this] [Accept all], where 'Accept
 * all' means we never ask them again, just as 'Refuse' does."* Read with his earlier draft
 * ("[Accept this storage only]"), the middle answer is SCOPE-LIMITED consent — yes to this, ask me
 * again if you ever add another purpose — which is why the stored record carries the policy
 * version and why bumping EC_CONSENT_VERSION re-asks exactly those people and nobody else.
 *
 * The middle answer does NOT mean "ask me again next visit". Nagging somebody who already said yes
 * is the one direction that makes a consent flow worse rather than safer.
 */
function ecConsentState() {
    if (empty($_COOKIE[EC_CONSENT_COOKIE])) return 'unknown';
    $parts   = explode('.', $_COOKIE[EC_CONSENT_COOKIE]);
    $state   = $parts[0];
    $version = $parts[2] ?? '';
    if ($state === '0') return 'denied';
    if ($state === '2') return 'granted_all';
    if ($state === '1') {
        // Consent pinned to the version it was given for. A materially changed ask means a
        // changed EC_CONSENT_VERSION, and these people asked to be asked again.
        return ($version === EC_CONSENT_VERSION) ? 'granted' : 'unknown';
    }
    return 'unknown';
}

/** True for either kind of yes. Silence is never consent. */
function ecAnalyticsConsented() {
    $state = ecConsentState();
    return $state === 'granted' || $state === 'granted_all';
}

/** Writes the consent record. $answer is '0' (refuse), '1' (this version), or '2' (all). */
function ecConsentSet($answer) {
    if (headers_sent()) return;
    if (!in_array($answer, ['0', '1', '2'], true)) return;
    $value = $answer . '.' . time() . '.' . EC_CONSENT_VERSION;
    setcookie(EC_CONSENT_COOKIE, $value, [
        'expires'  => time() + EC_CONSENT_DAYS * 86400,
        'path'     => '/',
        'samesite' => 'Lax',
        'secure'   => ecCookieSecure(),
        'httponly' => false, // the banner reads and writes it from JS so answering needs no reload
    ]);
    $_COOKIE[EC_CONSENT_COOKIE] = $value;
    if ($answer === '0') ecForgetAnalyticsStorage();
}

/**
 * Deletes the storage that consent was covering. Called on refusal and on withdrawal, because
 * "withdraw at any time" that leaves the cookie sitting there is not a withdrawal. The IndexedDB
 * half of this is client-side, in EngCalcs.flushQueue().
 */
function ecForgetAnalyticsStorage() {
    if (headers_sent()) return;
    foreach (['ec_blang', EC_SEEN_COOKIE] as $name) {
        if (isset($_COOKIE[$name])) {
            setcookie($name, '', ['expires' => time() - 86400, 'path' => '/']);
            unset($_COOKIE[$name]);
        }
    }
}

/**
 * Parses ec_seen into page => digit. Anything malformed is simply dropped: it is a cache, not a
 * record, and a visitor who hand-edits it only affects whether they are counted twice.
 *
 * Memoized in a GLOBAL rather than a function static so ecMarkSeen() can invalidate it after a
 * write. A static would be unreachable from outside and the second mark in one request would read
 * a stale map -- which matters, because a page can log a language view and a human view in the
 * same request.
 */
function ecSeenMap() {
    if (isset($GLOBALS['_ec_seen_map'])) return $GLOBALS['_ec_seen_map'];
    $map = [];
    $GLOBALS['_ec_seen_map'] = &$map;
    if (!ecAnalyticsConsented() || empty($_COOKIE[EC_SEEN_COOKIE])) return $map;
    // A digit is one base-32 character; anything else is a cookie we did not write.
    foreach (explode(',', (string) $_COOKIE[EC_SEEN_COOKIE]) as $pair) {
        $bits = explode(':', $pair);
        if (count($bits) !== 2) continue;
        $page = preg_replace('/[^A-Za-z0-9_-]/', '', $bits[0]);
        if ($page === '' || strlen($bits[1]) !== 1) continue;
        $digit = intval($bits[1], 32);
        if ($digit > 0) $map[$page] = $digit;
    }
    return $map;
}

/** Has this event already been counted for this page in this browser session? */
function ecSeen($page, $flag) {
    $map = ecSeenMap();
    return isset($map[$page]) && ($map[$page] & $flag) === $flag;
}

/**
 * Records that it has been, and writes the cookie back.
 *
 * A SESSION COOKIE — no expiry — so it lasts exactly as long as the visit it de-duplicates, and a
 * visitor who returns tomorrow is counted again, which is what "visits" has always meant here.
 */
function ecMarkSeen($page, $flag) {
    if (!ecAnalyticsConsented() || headers_sent()) return;
    $page = preg_replace('/[^A-Za-z0-9_-]/', '', (string) $page);
    if ($page === '') return;
    $map = ecSeenMap();
    $map[$page] = ($map[$page] ?? 0) | $flag;
    // Rebuild the static cache so a second call in the same request sees the first one.
    $pairs = [];
    foreach ($map as $p => $d) { $pairs[] = $p . ':' . base_convert((string) $d, 10, 32); }
    $value = implode(',', $pairs);
    setcookie(EC_SEEN_COOKIE, $value, [
        'expires'  => 0,
        'path'     => '/',
        'samesite' => 'Lax',
        'secure'   => ecCookieSecure(),
        'httponly' => true,
    ]);
    $_COOKIE[EC_SEEN_COOKIE] = $value;
    $GLOBALS['_ec_seen_map'] = $map;
}

/**
 * How long this browser has been around, in milliseconds, as far as the human-view beacon needs to
 * know. Not a stored timestamp: bit 2 on ANY page means this browser already dwelt somewhere long
 * enough to be counted human, so later pages need not wait out their own 10 seconds. A brand-new
 * browser reads 0 and waits the full 10s, which is the strict direction.
 */
function ecSessionAgeMs() {
    foreach (ecSeenMap() as $digit) {
        if (($digit & EC_SEEN_HUMAN_VIEW) === EC_SEEN_HUMAN_VIEW) return 10000;
    }
    return 0;
}

/**
 * The visitor's first Accept-Language tag, safe to write into a tab-separated log line.
 *
 * ROADMAP Task 319. Every log writer sanitises its columns carefully -- log-signal-event.php even
 * says why: *"a log line is read by awk and a stray tab or newline would silently shift every
 * column after it"*. That reasoning was applied to every field EXCEPT this one, in five
 * copy-pasted copies of the same three lines, because trim() looks like a filter and is not: it
 * strips the EDGES only, so a header carrying an embedded tab or newline forged whole rows, and a
 * 4 KB header went into the file at full length.
 *
 * Bounded, and worth saying plainly rather than overstating: nothing here is executable and no
 * visitor can see another visitor's data. What a forged row corrupts is OUR OWN analytics -- and
 * those numbers are what several roadmap decisions are being made from, so a fabricated row is a
 * corrupted decision.
 *
 * DROPPED, not escaped, exactly like log-signal-event.php's detail column: a log line has no
 * escaping convention, so inventing one here would mean teaching log/lang-log-stats.sh about it
 * too. [a-z0-9-] is the whole of a well-formed RFC 5646 tag once it is lower-cased, and 35 is
 * comfortably past the longest realistic one ('sr-latn-rs', 'zh-hant-hk') while being far too
 * short to smuggle anything interesting into the file.
 *
 * TRUNCATE AT THE FIRST ILLEGAL CHARACTER rather than deleting illegal characters throughout.
 * Deleting is equally SAFE -- no separator survives either way -- but it silently welds the
 * attacker's payload onto the real tag, so "en\n2026-01-01T…" would be logged as one 35-character
 * word beginning "en". Truncating logs 'en', which is both the honest reading of the header and a
 * value the report can actually count.
 *
 * @return string  e.g. 'en-gb', or '' when the header is absent or holds nothing usable.
 */
function ecBrowserLangTag() {
    if (!isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) return '';
    // First language-range, minus its q-value -- the same reading the five writers always did.
    $tag = explode(';', explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0])[0];
    // trim() first so an ordinary ' en-gb' still yields a tag; it is not the filter, it never was.
    return preg_match('/^[a-z0-9-]{1,35}/', strtolower(trim($tag)), $m) ? $m[0] : '';
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
 *   visitors — consented, de-duplicated. Today's numbers, unchanged.
 *   visits   — everybody else, one row per event, no de-duplication and nothing stored.
 *
 * A row with no trailing column is a 'visitor' row, which is what every row written before this
 * task was. That is why the marker is emitted only for 'visit': the whole existing history stays
 * byte-identical and every existing awk field index keeps its meaning.
 */
function ecLogBucketSuffix() {
    return ecAnalyticsConsented() ? '' : "\tvisit";
}

// A visitor who has withdrawn consent, or refused it, must not keep carrying the storage it
// covered. Checked on every page load because withdrawal can happen in another tab.
if (!ecAnalyticsConsented() && (isset($_COOKIE['ec_blang']) || isset($_COOKIE[EC_SEEN_COOKIE]))) {
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

/* **THE MAPBOX PUBLIC TOKEN, for the satellite basemap on a lat/lon project (ROADMAP Task 452).**
 * Tom created the account and this token 2026-08-19, at his own request for satellite imagery.
 *
 * **IT IS IN THE REPOSITORY ON PURPOSE, and secrecy is not the question.** A `pk.` token carries
 * READ scopes only, is designed by Mapbox to ship in client JavaScript, and this one is echoed
 * into every visitor's page through pageConfig -- so it is public the moment the feature works at
 * all, and keeping it out of git would hide it from nobody. What protects it is the URL
 * restriction set on it in the Mapbox account, which is what stops another site spending the
 * quota. (A `sk.` SECRET token carries WRITE scopes and belongs nowhere near a browser or a
 * repository, ever. If you are pasting one here, stop.)
 *
 * **GitHub's push protection flags this line as a "Mapbox Secret Access Token".** It matches the
 * shape, not the scope. Tom turned Secret Protection off for this repository on 2026-08-19 after
 * the bypass URL 404'd for him. If it is ever turned back on, the override below is the way
 * through -- do NOT split, encode or obfuscate the string to get past a scanner.
 *
 * **WHY NOT AN UNTRACKED FILE, which is where this briefly lived.** Deployment here is `git pull`,
 * so an untracked file is a permanent manual upload and a silent failure mode: the satellite rows
 * would simply vanish on production and nothing would say why. CLAUDE.md already records that cost
 * for ../sitemap.xml, and a second one buys nothing when the value is public anyway.
 *
 * **THE OVERRIDE, for a fork rather than for us.** `lib/mapbox-token.php` (git-ignored) wins if it
 * exists, so somebody running their own copy can use their own account without editing a tracked
 * file, and Tom can rotate without a commit. An EMPTY result is fully supported: no token means no
 * satellite rows at all, because a row that fetches a 401 per tile leaves the user unable to tell
 * our missing account from their missing internet. */
define('EC_MAPBOX_TOKEN', (function () {
    $f = __DIR__ . '/mapbox-token.php';
    if (is_file($f)) {
        $v = require $f;
        if (is_string($v) && trim($v) !== '') { return trim($v); }
    }
    return 'pk.eyJ1IjoiaGF3c3RvbSIsImEiOiJjbXQweWhyNnkwYjIzMnpvYmo1bTdteHo1In0.d2sf5oNs0dJzXl96rAmryA';
})());
// Housekeeping, since the honor-system design deliberately never auto-expires a LOCK. This expires
// the on-disk RECORD long after any plausible session, purely so abandoned projects don't leak
// files forever. 30 days is far past a working day; it can never end a live edit.
define('LPN_LOCK_TTL_DAYS', 30);
// Hard bound on how much disk a stranger can make us use. At the cap, existing projects keep
// working and only the creation of a NEW record is refused.
define('LPN_LOCK_MAX_RECORDS', 5000);
