<?php
/**
 * ServiceWorker.lib.php -- the ONE place that decides what the service worker precaches.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS FILE EXISTS (ROADMAP Task 318, 2026-08-14).
 *
 * The old `sw.js` precached 25 BARE paths ('/engcalcs/js/looped-network.js') while every page
 * requests those same assets with '?v=<filemtime>', and `cacheFirst()` matched on the exact URL
 * including the query. So 22 of the 25 entries could never be served: the precache -- the whole
 * "visit one calculator, get them all offline" promise on About.php and Install.php -- was dead
 * code. Only the three query-less icons worked.
 *
 * THE FIX IS TO GENERATE THE WORKER FROM PHP so a precached URL is built by the same filemtime()
 * call the page's <script src> uses. The rejected alternative was `caches.match(req, {ignoreSearch:
 * true})`, which would revive the precache at the cost of permanently defeating cache busting --
 * a visitor would keep serving last year's JS forever. That is worse than the bug.
 *
 * AND IT HAS TO BE GENERATED AT REQUEST TIME, not by a build step writing a static sw.js.
 * Deployment here is `git pull`, and git does not preserve mtimes: every file's filemtime on the
 * production server is its checkout time, which no developer machine can know in advance. A
 * baked-in list would be wrong the moment it landed -- the exact defect, one layer further away
 * and harder to see. Hence sw.php.
 *
 * CACHE_VERSION IS GONE, deliberately. A hand-bumped 'engcalcs-v9' is the hardcoded ?v=N Tom
 * banned suite-wide, sitting in the one file where forgetting to bump it is completely invisible
 * (the returning visitor just keeps the stale cache; nothing warns anybody). With every URL
 * carrying a filemtime, the cache key changes by itself. The case the version string was last
 * bumped for -- Task 287, where Bootstrap moved from jsDelivr to this origin, so the OLD URL had
 * to stop being served -- is handled instead by pruning in `activate`: any cached asset that is
 * cross-origin, or whose path is in the manifest under a different query, is deleted. That covers
 * a URL changing origin, changing version, or disappearing, without anyone remembering anything.
 *
 * THE LISTS ARE DERIVED FROM THE FILESYSTEM, never typed. Both hand-maintained lists had already
 * drifted: six shipped modules were missing (PipeHydraulics.lib.js, branched-network.js,
 * lpn-geom.js, lpn-collide.js, lpn-inp.js, lpn-net.js) and so was Branched-Network.php, an entire
 * shipped calculator. hazen-williams.js was precached while PipeHydraulics.lib.js, which it
 * depends on, was not -- the list was incoherent, not merely short.
 *
 * EXCLUSIONS ARE DECLARED, NOT IMPLIED. Every shipped asset and every root page is either in the
 * manifest or named below with a reason. dev/scripts/sw_manifest_check.php fails the build on
 * anything that is in neither, so a new calculator or a new lpn module cannot be forgotten here
 * the way Task 293's split forgot it. (sw.js was an undocumented FOURTH registration point for a
 * new lpn module; the check is what stops that recurring.)
 */

/** Web path prefix this suite is mounted at. Matches the hardcoded paths throughout the app. */
if (!defined('EC_SW_BASE')) define('EC_SW_BASE', '/engcalcs/');

/**
 * Assets deliberately NOT precached, and why. Present on disk, shipped, and still excluded.
 * A file listed here is still cached at runtime the first time it is actually fetched.
 */
function ecSwAssetExclusions() {
    return [
        // 664 KB WASM-backed EPANET engine, loaded by dynamic import() only when the visitor
        // turns the EPANET solver on. Precaching it would multiply the install cost of the PWA
        // for every visitor, and this suite's stated audience is low-bandwidth. It is imported
        // with no query string, so the plain cache-first path serves it correctly once fetched.
        'js/vendor/epanet-js.js'  => 'opt-in 664 KB engine; runtime-cached on first use',
        // Referenced by no page (verified 2026-08-14). Precaching an unreferenced file would
        // paper over the fact that it is unreferenced.
        'js/vendor/slim/index.js' => 'not referenced by any page',
    ];
}

/**
 * Root .php pages deliberately NOT precached, and why. Every other root page is precached.
 */
function ecSwPageExclusions() {
    return [
        // Endpoints, not pages: they answer POSTs and write log rows. A cached response would be
        // meaningless at best and wrong at worst.
        'formmail.php'          => 'POST endpoint',
        'formmailsuccess.php'   => 'POST result page; reachable only after a submission',
        'log-calc-event.php'    => 'log endpoint',
        'log-human-view.php'    => 'log endpoint',
        'log-signal-event.php'  => 'log endpoint',
        'log-title-event.php'   => 'log endpoint',
        'lpn-lock.php'          => 'multi-tab lock endpoint; a cached answer would be a wrong one',
        'consent.php'           => 'records the consent choice; must always reach the server',
        'sw.php'                => 'the service worker itself; the browser manages its own copy',
        // Pages that need the network by definition, or that no offline user is looking for.
        'contact.php'           => 'a form that cannot be sent offline',
        'Compare-Languages.php' => 'a translation-review tool, not a calculator',
        'Orifice-Drain-Time-Ref.php' => 'auxiliary reference table, reached from the calculator; '
                                      . 'kept out to hold the install small',
    ];
}

/**
 * Builds the precache manifest.
 *
 * @param string|null $root Repository root; defaults to this file's parent.
 * @return array{assets: string[], pages: string[]}
 */
function ecServiceWorkerManifest($root = null) {
    $root = $root === null ? dirname(__DIR__) : rtrim($root, '/');

    $excluded = ecSwAssetExclusions();
    $assets = [];
    foreach (ecSwAssetFiles($root) as $rel) {
        if (isset($excluded[$rel])) continue;
        $assets[] = ecSwAssetUrl($rel, $root);
    }

    $pageExcluded = ecSwPageExclusions();
    $pages = [];
    foreach (glob($root . '/*.php') as $file) {
        $name = basename($file);
        if (isset($pageExcluded[$name])) continue;
        $pages[] = EC_SW_BASE . $name;
    }
    // The bare directory URL. A visitor who types the site name never requests index.php by
    // name, so without this the very first page of an offline visit can miss.
    $pages[] = EC_SW_BASE;

    sort($assets);
    sort($pages);
    return ['assets' => $assets, 'pages' => $pages];
}

/**
 * Every shipped front-end asset on disk, as repo-relative paths, exclusions included.
 * The check uses this to prove nothing shipped is silently absent from the manifest.
 */
function ecSwAssetFiles($root) {
    $files = array_merge(
        // The PWA manifest itself: without it, an offline visitor who opens the installed app
        // has the pages but not the thing that makes it an app.
        glob($root . '/manifest.json'),
        glob($root . '/css/*.css'),
        glob($root . '/css/vendor/*.css'),
        glob($root . '/js/*.js'),
        glob($root . '/js/vendor/*.js'),
        glob($root . '/js/vendor/*/*.js'),
        glob($root . '/icons/*.{svg,png,ico}', GLOB_BRACE)
    );
    $rel = [];
    foreach ($files as $f) $rel[] = substr($f, strlen($root) + 1);
    sort($rel);
    return $rel;
}

/**
 * The URL for one asset, built the SAME WAY the pages build theirs -- that identity is the
 * entire point of Task 318, and dev/scripts/sw_manifest_check.php proves it by rendering real
 * pages and diffing their <script src>/<link href> URLs against this list.
 *
 * Scripts and stylesheets carry '?v=<filemtime>' because lib/HeadersFooters.lib.php and every
 * calculator page emit them that way. Images do not: icons are named by manifest.json and by
 * <link rel="icon">, neither of which busts a query onto them.
 */
function ecSwAssetUrl($rel, $root) {
    $url = EC_SW_BASE . $rel;
    $ext = strtolower(pathinfo($rel, PATHINFO_EXTENSION));
    if ($ext === 'js' || $ext === 'css') {
        $url .= '?v=' . filemtime($root . '/' . $rel);
    }
    return $url;
}
