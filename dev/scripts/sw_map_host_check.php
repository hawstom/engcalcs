<?php
/**
 * sw_map_host_check.php — no map host, and no tile, may appear in the service worker. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. Two separate promises meet inside `sw.php`, and one line of manifest would
 * break both at once:
 *
 *   1. **THE OFFLINE PROMISE.** The precache is "visit one calculator, get them all offline". A
 *      map tile is not ours, is one of billions, and is served under a usage policy that forbids
 *      bulk copying — so a tile in the manifest is an install that cannot succeed, and
 *      `precache()` degrades per-URL, which means it fails SILENTLY. Task 318 already shipped a
 *      precache in which 22 of 25 entries could never be served and nothing said so.
 *   2. **THE NO-REQUEST-UNTIL-ASKED PROMISE.** Every third-party request this suite makes is
 *      opt-in behind its own consent gate — OSM tiles, Mapbox satellite tiles, Nominatim place
 *      search, Mapbox Terrain-RGB elevation. A precached URL is fetched at INSTALL, from the
 *      service worker, on a page the visitor merely opened. That is the gate bypassed completely,
 *      by a file nobody thinks of as a request site, and the visitor would have no way to see it.
 *
 * `dev/geographic-projects.md` states the rule; `dev/cookie-storage-inventory.md` §5 states the
 * consent side of it. Nothing tied either to what `sw.php` actually emits until this.
 *
 * WHAT IT READS. The service worker's own OUTPUT, produced by running `sw.php` — not
 * `ServiceWorker.lib.php`'s return value. The manifest is only half of what ships: a hand-written
 * `fetch` route or a runtime cache added to the worker's JavaScript would be just as much a
 * request, and reading the emitted text is what sees both. The manifest arrays are then parsed out
 * of that text and every entry must be a same-origin ABSOLUTE PATH ('/engcalcs/...'); anything
 * carrying a scheme or a '//host' is cross-origin by construction.
 *
 * WHERE THE HOST LIST COMES FROM. It is not invented: `js/lpn-search.js` (Nominatim),
 * `js/lpn-terrain.js` (Mapbox) and `js/looped-network.js` (OSM and Mapbox tiles) each name their
 * host in a constant, and this file lists those hosts plus the broader family patterns that would
 * catch a sibling endpoint. The check also asserts each declared host is STILL named by the module
 * that owns it, so retiring or renaming a service tells you to update this list rather than
 * leaving a denylist quietly guarding nothing.
 *
 * Usage:
 *   php dev/scripts/sw_map_host_check.php
 *
 * Exit 0 = the worker is same-origin only. Exit 1 = a map host or a cross-origin entry is in it.
 */

/**
 * Family patterns for a map/geocoding host. Broader than the three exact hosts on purpose: a
 * sibling endpoint (`events.mapbox.com`, `a.tile.openstreetmap.org`) is the same promise broken.
 */
const EC_MAP_HOST_PATTERNS = [
    '/[a-z0-9.-]*\bopenstreetmap\.org/i'  => 'OpenStreetMap (tiles, and the Nominatim geocoder)',
    '/[a-z0-9.-]*\bmapbox\.com/i'         => 'Mapbox (satellite tiles and Terrain-RGB elevation)',
    '/\b(?:[a-z]\.)?tiles?\.osm\.org/i'   => 'an OpenStreetMap tile mirror',
    '/\bmaptiler\.com|\bstadiamaps\.com|\bgoogleapis\.com\/maps/i' => 'a third-party map service',
];

/** The exact hosts the shipped modules name, and the module that owns each. */
const EC_MAP_HOST_OWNERS = [
    'nominatim.openstreetmap.org' => 'js/lpn-search.js',
    'api.mapbox.com'              => 'js/lpn-terrain.js',
    'tile.openstreetmap.org'      => 'js/looped-network.js',
];

/** A path shaped like a tile: a {z}/{x}/{y} template, or a /tiles/ segment. */
const EC_TILE_PATH_PATTERN = '/\{[zxy]\}|\/tiles?\//i';

/**
 * Findings in the text a service worker emits. Pure, for the selftest.
 *
 * @param string $sw The emitted worker JavaScript.
 * @return array<int,string> Human-readable findings; empty means clean.
 */
function ecSwMapHostFindings(string $sw): array
{
    $out = [];

    // 1. A map host anywhere in the shipped worker -- manifest entry, fetch route or comment. A
    //    comment naming one is included deliberately: this file is 200 lines of behaviour and the
    //    next person to add a route will copy the host out of the comment above it.
    foreach (EC_MAP_HOST_PATTERNS as $re => $what) {
        if (preg_match($re, $sw, $m)) {
            $out[] = "the worker text names '{$m[0]}' -- {$what}. Nothing map-related may be in the "
                . 'service worker at all: a precached tile is fetched at INSTALL, from a page the '
                . 'visitor merely opened, which bypasses that service\'s own consent gate entirely.';
        }
    }

    // 2. Every manifest entry same-origin, and none shaped like a tile. Parsed from the emitted
    //    text rather than from ecServiceWorkerManifest(), because what ships is the text.
    $arrays = ecSwManifestArrays($sw);
    foreach (['STATIC_ASSETS', 'CALC_PAGES'] as $name) {
        if (!isset($arrays[$name])) {
            $out[] = "the worker no longer emits a `const {$name} = [...]` array this check can "
                . 'read. Either the manifest was renamed -- update this check with it -- or the '
                . 'precache is gone, which is a bigger finding than anything below.';
            continue;
        }
        foreach ($arrays[$name] as $url) {
            if (preg_match('#^[a-z][a-z0-9+.-]*:|^//#i', $url)) {
                $out[] = "{$name} contains the cross-origin URL '{$url}'. A precache entry must be "
                    . "a same-origin absolute path ('/engcalcs/...'): the worker's own activate "
                    . 'step deletes every cross-origin cache entry it finds, so this one would be '
                    . 'fetched on install and thrown away on the next activate, forever.';
            } elseif ($url === '' || $url[0] !== '/') {
                $out[] = "{$name} contains the relative URL '{$url}'. Precache URLs are resolved "
                    . "against the worker's scope and must be written absolute from the site root.";
            }
            if (preg_match(EC_TILE_PATH_PATTERN, $url)) {
                $out[] = "{$name} contains '{$url}', which is shaped like a map tile. Tiles are "
                    . 'never precached: they are not ours to copy in bulk, and there are billions '
                    . 'of them.';
            }
        }
    }

    return $out;
}

/**
 * Pull `const NAME = [ ... ];` JSON arrays out of the emitted worker.
 *
 * @return array<string,array<int,string>>
 */
function ecSwManifestArrays(string $sw): array
{
    $out = [];
    if (preg_match_all('/const\s+([A-Z_]+)\s*=\s*(\[.*?\n\]);/s', $sw, $m, PREG_SET_ORDER)) {
        foreach ($m as $hit) {
            $decoded = json_decode($hit[2], true);
            if (is_array($decoded)) {
                $out[$hit[1]] = array_map('strval', $decoded);
            }
        }
    }
    return $out;
}

if (defined('SW_MAP_HOST_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

// Run sw.php exactly as a browser gets it. header() is a no-op on the CLI, and sw.php deliberately
// does not bootstrap lib/base.inc.php, so this is safe to capture in-process.
ob_start();
require $root . '/sw.php';
$swText = (string) ob_get_clean();

$problems = ecSwMapHostFindings($swText);

// The denylist must keep describing something real. If a module stops naming the host this file
// guards, the guard is aimed at nothing and the next reader cannot tell.
foreach (EC_MAP_HOST_OWNERS as $host => $owner) {
    $src = @file_get_contents($root . '/' . $owner);
    if ($src === false || strpos($src, $host) === false) {
        $problems[] = "$owner no longer names '$host', so this check's host list has drifted from "
            . 'the services the suite actually calls. Update EC_MAP_HOST_OWNERS and '
            . 'EC_MAP_HOST_PATTERNS in this file to the hosts in use now.';
    }
}

if ($problems) {
    echo 'Service worker map hosts: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "The service worker is same-origin only. It precaches this suite's own files so a visitor\n";
    echo "who opened one calculator has them all offline -- and nothing else, because a precached\n";
    echo "URL is requested at install time, before the visitor has asked for anything.\n";
    echo "\nIf a map really must be available offline, that is a consent question first (each of the\n";
    echo "four third-party services has its own gate) and a caching question second. Have that\n";
    echo "conversation, then edit lib/ServiceWorker.lib.php and this check together.\n";
    exit(1);
}

$arrays = ecSwManifestArrays($swText);
$n = count($arrays['STATIC_ASSETS'] ?? []) + count($arrays['CALC_PAGES'] ?? []);
echo "Service worker is same-origin -- $n precache entries, no map host anywhere in the emitted\n";
echo "worker, nothing tile-shaped.\n";
exit(0);
