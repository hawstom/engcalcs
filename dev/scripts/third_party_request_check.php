<?php
/**
 * third_party_request_check.php — this suite makes exactly FOUR third-party requests, every one of
 * them opt-in, and a fifth cannot arrive quietly. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. The four are named in CLAUDE.md, in `dev/cookie-storage-inventory.md` §3 and in
 * `privacy.php`, which closes its list with a promise to the reader: *"If a fifth such feature is
 * ever added, it will ask you in the same way, before it sends anything."* That promise is kept by
 * a person remembering it. Adding a fifth host is one line of JavaScript and no symptom: the page
 * renders, the feature works, the check suite is silent, and the only visible trace is in a network
 * panel nobody on this side opens. The visitor's own browser is where the defect surfaces, which is
 * the definition of a defect with no finders.
 *
 * THE FOUR, AND WHY THEY ARE FOUR PURPOSES ON THREE HOSTS:
 *   1. `tile.openstreetmap.org`      street-map tiles behind a geographic project
 *   2. `api.mapbox.com`              satellite tiles, the same feature with a second source
 *   3. `nominatim.openstreetmap.org` place-name search — what the visitor TYPED
 *   4. `api.mapbox.com` again        Terrain-RGB elevations — where the visitor's NETWORK IS
 * Each has its own consent question, because a tile says where you are LOOKING, a search says what
 * you TYPED, and a node coordinate says where your NETWORK IS. Adding one is a new paragraph in
 * `privacy.php` and a gate of its own — and explicitly NOT an `EC_CONSENT_VERSION` bump, because
 * that banner asks about one analytics digit and says nothing about third-party requests.
 *
 * WHAT IT READS, AND WHY NOT A GREP. `js/*.js` with its comments BLANKED (`js_scan.inc.php`).
 * `js/looped-network.js` is 47% comment lines, and the survey behind ROADMAP Task 322 measured the
 * consequence: **11 distinct hosts appear in `js/*.js` and only 3 of them are requests.** An
 * `<a href>` in a help string is a navigation the visitor chooses; a URL in a comment is prose. A
 * grep reports all eleven, and a check that is wrong eight times out of eleven gets ignored.
 *
 * TWO LISTS, BECAUSE FALSE POSITIVES RUN BOTH WAYS. Every host literal in the blanked source is
 * either a declared REQUEST host or a declared NON-REQUEST host with a reason. A brand-new host
 * fails until somebody writes down which it is — that declaration is the deliverable, and it is the
 * moment at which the `privacy.php` paragraph gets written. Then, because a declaration is not a
 * licence, every non-request host is also checked AT ITS CALL SHAPE: `fetch()`, `sendBeacon()`,
 * `new Image`, `.src =`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts`. Wikipedia
 * is a legitimate link target and an illegitimate `fetch()` target, and only the shape tells them
 * apart.
 *
 * HOW THIS DIVIDES FROM `sw_map_host_check.php`. That check reads what `sw.php` EMITS — the service
 * worker, which requests at install time on a page the visitor merely opened, and whose rule is
 * absolute: no map host at all, not even in a comment. This one reads the PAGE JavaScript, where
 * three of those hosts are not merely allowed but required, and the question is instead *which*
 * hosts and *at what call shape*. Same promise, two files, no overlap: neither reads the other's
 * input.
 *
 * Usage:
 *   php dev/scripts/third_party_request_check.php
 *
 * Exit 0 = four purposes, three hosts, every other host declared and none of them requested.
 */

require_once __DIR__ . '/js_scan.inc.php';

/**
 * The four third-party request purposes. Keyed by purpose, not by host, because `api.mapbox.com`
 * carries two of them and they have SEPARATE consent gates — folding them into one row is exactly
 * the merge the terrain lookup was built not to make.
 *
 *   host    the host contacted.
 *   owner   the module that names it. If that module stops naming it, this list has drifted from
 *           the services the suite actually calls and the check says so.
 *   gate    a token that must still appear in the owner, standing for the opt-in that guards it.
 *   privacy a marker that must still appear in privacy.php, standing for the paragraph that
 *           discloses it. The markers are chosen to be the load-bearing words of their paragraph,
 *           not a brand name that could survive the paragraph being deleted.
 *   why     what the request tells the third party about the visitor. This is the sentence that
 *           decides whether a new feature may ride an existing gate or needs its own.
 */
const EC_REQUEST_PURPOSES = [
    'osm_tiles' => [
        'host'    => 'tile.openstreetmap.org',
        'owner'   => 'js/looped-network.js',
        'gate'    => 'basemapOn',
        'privacy' => 'openstreetmap.org/copyright',
        'why'     => 'where the visitor is LOOKING. Off unless a geographic project turns the '
                   . 'basemap on, and attribution is required and not dismissible.',
    ],
    'mapbox_satellite' => [
        'host'    => 'api.mapbox.com',
        'owner'   => 'js/looped-network.js',
        'gate'    => 'mapboxToken',
        'privacy' => 'for the satellite images',
        'why'     => 'where the visitor is LOOKING, from a second source. Gated on EC_MAPBOX_TOKEN '
                   . 'as well: no token and the option does not exist, which is the state a fork of '
                   . 'this suite is in.',
    ],
    'nominatim_search' => [
        'host'    => 'nominatim.openstreetmap.org',
        'owner'   => 'js/lpn-search.js',
        'gate'    => 'ec_geosearch',
        'privacy' => 'ec_geosearch',
        'why'     => 'what the visitor TYPED. Its own consent record, because it cannot ride on the '
                   . "tiles' silence.",
    ],
    'mapbox_terrain' => [
        'host'    => 'api.mapbox.com',
        'owner'   => 'js/lpn-terrain.js',
        'gate'    => 'ec_terrain',
        'privacy' => 'ec_terrain',
        'why'     => "where the visitor's NETWORK IS, which is the model itself. Its own consent "
                   . 'record for that reason, separate from the satellite tiles on the same host.',
    ],
];

/**
 * Hosts that appear in `js/*.js` and are NEVER requested, with the reason each. Every one of these
 * is a link a visitor may choose to follow, a namespace URI, or our own origin. A host here that
 * turns up at a request-shaped call site is reported anyway — the declaration says what it is FOR,
 * not that it is allowed anywhere.
 */
const EC_NON_REQUEST_HOSTS = [
    'www.w3.org'             => 'the SVG namespace URI. A string handed to createElementNS(); '
                              . 'nothing is ever fetched from it.',
    'en.wikipedia.org'       => 'Darcy-Weisbach cites the friction-factor derivations as <a> links '
                              . 'in a result string. The visitor chooses to follow them.',
    'hawsedc.com'            => 'our own origin, written absolute for a share link and for the '
                              . 'text a downloaded file carries back to the app.',
    'tomsthird.blogspot.com' => "the Help menu's walkthroughs link. An <a> target.",
    'colorbrewer.org'        => 'the ColorBrewer licence text, which requires the credit to name '
                              . 'the site. Text in a credit line, not a link and not a request.',
    'colorbrewer2.org'       => 'the ColorBrewer credit link in the colour-ramp catalogue.',
    'github.com'             => 'the BIDS/colormap credit link (viridis and its family).',
    'www.epa.gov'            => "the EPANET credit link. EPA's page about the engine we bridge to.",
];

/**
 * Call shapes that ISSUE a request. Deliberately does NOT include `href=` or `<a`: an anchor is a
 * navigation the visitor chooses, which is the single largest source of hosts in this tree.
 */
const EC_REQUEST_SHAPES = [
    'fetch(', 'sendBeacon(', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts(',
    'new Image', '.src', 'src=', 'href:', 'serviceWorker.register', 'import(',
];

/** How many lines either side of a URL literal count as "at" a call shape. */
const EC_SHAPE_WINDOW = 2;

/**
 * Hosts found in blanked JavaScript, and which of them sit at a request shape.
 *
 * @param array<string,string> $sources filename => blanked JavaScript.
 * @return array{hosts:array<string,array<int,string>>,requested:array<string,array<int,string>>}
 *         hosts: host => list of "file:line"; requested: the subset at a request shape.
 */
function ecThirdPartyScan(array $sources): array
{
    $hosts = [];
    $requested = [];
    foreach ($sources as $file => $code) {
        $lines = explode("\n", $code);
        foreach ($lines as $i => $line) {
            if (!preg_match_all('#(?:https?:)?//([a-z0-9][a-z0-9.-]*\.[a-z]{2,})#i', $line, $m)) {
                continue;
            }
            $window = '';
            for ($j = max(0, $i - EC_SHAPE_WINDOW); $j <= min(count($lines) - 1, $i + EC_SHAPE_WINDOW); $j++) {
                $window .= $lines[$j] . "\n";
            }
            $shaped = false;
            foreach (EC_REQUEST_SHAPES as $shape) {
                if (strpos($window, $shape) !== false) { $shaped = true; break; }
            }
            foreach ($m[1] as $host) {
                $host = strtolower($host);
                $where = $file . ':' . ($i + 1);
                $hosts[$host][] = $where;
                if ($shaped) { $requested[$host][] = $where; }
            }
        }
    }
    ksort($hosts);
    ksort($requested);
    return ['hosts' => $hosts, 'requested' => $requested];
}

/**
 * Every finding, given a scan and the two declarations. Pure, so the selftest drives it.
 *
 * @param array               $scan     ecThirdPartyScan() output.
 * @param array<string,array> $purposes EC_REQUEST_PURPOSES.
 * @param array<string,string> $allowed EC_NON_REQUEST_HOSTS.
 * @return array<int,string>
 */
function ecThirdPartyFindings(array $scan, array $purposes, array $allowed): array
{
    $out = [];
    $requestHosts = [];
    foreach ($purposes as $p) { $requestHosts[strtolower($p['host'])] = true; }

    foreach ($scan['hosts'] as $host => $sites) {
        if (isset($requestHosts[$host])) { continue; }
        if (!isset($allowed[$host])) {
            $out[] = "UNDECLARED HOST '$host' in shipped page JavaScript (" . implode(', ', $sites)
                . '). Every host this suite names is either one of the four declared third-party '
                . 'REQUEST purposes or a declared non-request host with a reason. Decide which it '
                . 'is and write it down in third_party_request_check.php. If it is a request, that '
                . 'decision also owes a paragraph in privacy.php and a consent gate of its own -- '
                . 'and NOT an EC_CONSENT_VERSION bump, which re-asks everybody about analytics and '
                . 'says nothing about this.';
            continue;
        }
        if (isset($scan['requested'][$host])) {
            $out[] = "'$host' is declared NON-REQUEST -- " . $allowed[$host] . " -- but it appears "
                . 'at a request-shaped call site (' . implode(', ', $scan['requested'][$host])
                . '). A link the visitor may follow and a request the page issues on their behalf '
                . 'are different acts and only the second needs consent. Either the call is wrong, '
                . 'or this host has become a fifth third-party request and needs its own purpose, '
                . 'its own gate and its own paragraph in privacy.php.';
        }
    }

    foreach ($allowed as $host => $why) {
        if (!isset($scan['hosts'][$host])) {
            $out[] = "'$host' is declared as a non-request host that appears in js/*.js, and it no "
                . 'longer appears anywhere. The declaration records a decision about something '
                . 'that is gone: delete the entry, or find out where the reference went.';
        }
    }

    return $out;
}

if (defined('THIRD_PARTY_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

$sources = [];
foreach (glob($root . '/js/*.js') as $f) {
    $sources[substr($f, strlen($root) + 1)] = ecReadJsCode($f);
}
if (!$sources) {
    echo "third_party_request_check.php read no js/*.js at all. That is a broken check, not a clean\n";
    echo "tree: the glob or the repository layout has moved. Fix this file before trusting it.\n";
    exit(1);
}

$scan = ecThirdPartyScan($sources);
$problems = ecThirdPartyFindings($scan, EC_REQUEST_PURPOSES, EC_NON_REQUEST_HOSTS);

// The count is part of the claim. "Exactly four, all opt-in" is written in CLAUDE.md, in the
// storage inventory and in privacy.php's own numbered list; a fifth purpose declared here without
// those being rewritten leaves three documents saying something false.
if (count(EC_REQUEST_PURPOSES) !== 4) {
    $problems[] = 'EC_REQUEST_PURPOSES now holds ' . count(EC_REQUEST_PURPOSES) . ' purposes, not '
        . 'four. That number is quoted as a fact in CLAUDE.md, in dev/cookie-storage-inventory.md '
        . "and in privacy.php's numbered list. Update all three with this file, then update the "
        . 'four in this line.';
}

// Each purpose still describes something real: the owner names the host, the gate is still in the
// owner, and privacy.php still discloses it. A denylist aimed at nothing looks identical to one
// doing its job.
foreach (EC_REQUEST_PURPOSES as $id => $p) {
    $src = ecReadJsCode($root . '/' . $p['owner']);
    if ($src === '') {
        $problems[] = "purpose '$id' names owner {$p['owner']}, which cannot be read. Point it at "
            . 'the module that makes the request now.';
        continue;
    }
    if (strpos($src, $p['host']) === false) {
        $problems[] = "purpose '$id': {$p['owner']} no longer names '{$p['host']}' in code. Either "
            . 'the request moved to another module -- update the owner -- or the service was '
            . 'retired, in which case delete the purpose and take its paragraph out of privacy.php.';
    }
    if (strpos($src, $p['gate']) === false) {
        $problems[] = "purpose '$id': {$p['owner']} no longer contains '{$p['gate']}', the token "
            . 'standing for the opt-in that guards this request. Every one of the four is opt-in; '
            . 'if the gate was renamed, rename it here, and if it was REMOVED, that is the finding.';
    }
}

$privacy = (string) @file_get_contents($root . '/privacy.php');
foreach (EC_REQUEST_PURPOSES as $id => $p) {
    if (strpos($privacy, $p['privacy']) === false) {
        $problems[] = "purpose '$id' is no longer disclosed in privacy.php: the marker "
            . "'{$p['privacy']}' is gone. privacy.php promises the reader that each of these asks "
            . 'separately before it sends anything. A request with no paragraph breaks that promise '
            . 'to the only person it was made to.';
    }
}

// consent_body asks about ONE analytics digit. It must not grow a sentence about a map service:
// that is the version bump CLAUDE.md forbids, and it would re-ask 26 languages' worth of visitors
// the wrong question.
$ec_lang = [];
$ec_lang_syn = [];
include $root . '/lib/lang.ec.en.php';
$body = (string) ($ec_lang['consent_body'] ?? '');
foreach (array_merge(array_keys(EC_NON_REQUEST_HOSTS), array_column(EC_REQUEST_PURPOSES, 'host'),
        ['Mapbox', 'OpenStreetMap', 'Nominatim']) as $needle) {
    if ($needle !== '' && stripos($body, $needle) !== false) {
        $problems[] = "consent_body names '$needle'. That banner asks one question -- may we keep a "
            . 'single digit per page -- and a third-party service does not belong in it. Adding one '
            . 'is a new paragraph in privacy.php and a gate of its own; putting it here means an '
            . 'EC_CONSENT_VERSION bump and 26 retranslations to re-ask everybody about analytics.';
    }
}

if ($problems) {
    echo 'Third-party requests: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "The suite makes FOUR third-party requests, all on Looped-Network.php, all opt-in, each\n";
    echo "behind its own consent question. A fifth is a real decision with a real cost, and this\n";
    echo "check exists so that it is taken deliberately rather than arrived at.\n";
    exit(1);
}

$distinct = array_unique(array_column(EC_REQUEST_PURPOSES, 'host'));
echo 'Third-party requests OK -- ' . count(EC_REQUEST_PURPOSES) . ' purposes on '
    . count($distinct) . ' hosts, each with its owner, its gate and its privacy.php paragraph; '
    . count($scan['hosts']) . " distinct hosts in js/*.js, the other "
    . (count($scan['hosts']) - count($distinct)) . " declared non-request.\n";
exit(0);
