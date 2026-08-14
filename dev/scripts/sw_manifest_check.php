<?php
/**
 * sw_manifest_check.php -- the service worker really does cache what the pages really request.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 318, 2026-08-14). Two failures, both of which had already
 * happened and neither of which anything could see:
 *
 *   1. **THE URLS DID NOT MATCH.** sw.js precached '/engcalcs/js/looped-network.js'; every page
 *      requests '/engcalcs/js/looped-network.js?v=1754...'; cacheFirst() matched the exact URL,
 *      query included. 22 of 25 precache entries were therefore unreachable, and the About page
 *      promised offline use anyway. Nothing about that is visible by reading either file -- the
 *      defect lives in the GAP between them. So this check closes the gap the only honest way:
 *      it RENDERS each precached page and diffs the URLs that page actually emits against the
 *      URLs the worker will actually cache. That comparison is the heart of the check.
 *   2. **THE LISTS DRIFTED.** Six shipped JS modules and a whole shipped calculator page were
 *      missing, because sw.js was an undocumented FOURTH place a new module had to be registered
 *      (CLAUDE.md names three) and Task 293's split missed it. The lists are now derived from the
 *      filesystem, and this check makes sure the derivation's exclusions stay DELIBERATE: every
 *      shipped asset and every root page must be either precached or named in an exclusion list
 *      with a reason. A new file is in neither, so a new file fails.
 *
 * It also runs `node --check` over the GENERATED worker. Before Task 318, sw.js was outside the
 * js syntax glob and had never once been parsed by anything.
 *
 * Exit 0 clean, 1 on any finding. Blocking: there is no judgement call here.
 */

$root = dirname(__DIR__, 2);
require_once($root . '/lib/ServiceWorker.lib.php');

$problems = [];
$manifest = ecServiceWorkerManifest($root);
$assets = array_flip($manifest['assets']);
$pages = array_flip($manifest['pages']);

// --- 1. Nothing shipped is silently absent -----------------------------------------------------
// The lists are derived, so a NEW file is precached automatically -- that is the point, and it is
// why this section is short. What it still catches is an exclusion that has gone wrong: one naming
// a file that no longer exists (dead reason nobody will revisit), and, via section 2 below, one
// naming a file the pages actually request.
$assetExcluded = ecSwAssetExclusions();
foreach (ecSwAssetFiles($root) as $rel) {
    $url = ecSwAssetUrl($rel, $root);
    if (isset($assets[$url]) || isset($assetExcluded[$rel])) continue;
    $problems[] = "$rel is shipped but neither precached nor listed in ecSwAssetExclusions()";
}
foreach (array_keys($assetExcluded) as $rel) {
    if (!is_file($root . '/' . $rel)) {
        $problems[] = "ecSwAssetExclusions() names $rel, which no longer exists -- delete the entry";
    }
}

$pageExcluded = ecSwPageExclusions();
foreach (glob($root . '/*.php') as $file) {
    $name = basename($file);
    if (isset($pages[EC_SW_BASE . $name]) || isset($pageExcluded[$name])) continue;
    $problems[] = "$name is a shipped page but neither precached nor listed in ecSwPageExclusions()";
}
foreach (array_keys($pageExcluded) as $name) {
    if (!is_file($root . '/' . $name)) {
        $problems[] = "ecSwPageExclusions() names $name, which no longer exists -- delete the entry";
    }
}

// --- 2. THE HEART: every asset URL a page emits is an URL the worker precaches ------------------
// Rendered with dev/scripts/render_page.php, one process per page -- global scope and one page
// per process are both load-bearing; see that file.
$renderer = $root . '/dev/scripts/render_page.php';
$checkedPages = 0;
$checkedUrls = 0;
foreach ($manifest['pages'] as $pageUrl) {
    $name = substr($pageUrl, strlen(EC_SW_BASE));
    if ($name === '' || substr($name, -4) !== '.php') continue;   // the bare directory URL
    $html = shell_exec(sprintf('php %s %s 2>/dev/null', escapeshellarg($renderer), escapeshellarg($name)));
    if ($html === null || trim($html) === '') {
        $problems[] = "$name could not be rendered, so its asset URLs could not be checked";
        continue;
    }
    $checkedPages++;
    foreach (ecSwPageAssetUrls($html) as $url) {
        $checkedUrls++;
        if (isset($assets[$url])) continue;
        // Report the near-miss explicitly: a bare-vs-versioned mismatch is the original defect
        // and reads as a puzzle otherwise.
        $path = strtok($url, '?');
        $near = array_values(array_filter(array_keys($assets), function ($a) use ($path) {
            return strtok($a, '?') === $path;
        }));
        $why = $near ? 'the worker has ' . $near[0] . ' instead -- the query strings differ'
                     : 'the worker does not cache it at all';
        $problems[] = "$name requests $url but $why";
    }
}
if ($checkedPages === 0) {
    $problems[] = 'no page could be rendered; the URL comparison did not run';
}

// --- 3. The generated worker parses ------------------------------------------------------------
$generated = shell_exec(sprintf('php %s 2>&1', escapeshellarg($root . '/sw.php')));
if ($generated === null || strpos($generated, 'STATIC_ASSETS') === false) {
    $problems[] = 'sw.php did not generate a worker containing STATIC_ASSETS';
} else {
    $tmp = tempnam(sys_get_temp_dir(), 'ecsw') . '.js';
    file_put_contents($tmp, $generated);
    exec(sprintf('node --check %s 2>&1', escapeshellarg($tmp)), $out, $status);
    if ($status !== 0) {
        $problems[] = 'the generated worker is not valid JavaScript: ' . implode(' ', $out);
    }
    // The generated text must contain the manifest it was built from, not a copy that drifted.
    foreach ([$manifest['assets'][0], end($manifest['pages'])] as $probe) {
        if (strpos($generated, json_encode($probe, JSON_UNESCAPED_SLASHES)) === false) {
            $problems[] = "the generated worker is missing manifest entry $probe";
        }
    }
    unlink($tmp);
}

/**
 * Every same-suite asset URL a rendered page requests: <script src>, <link href>, <img src>.
 * Page-to-page links (.php, anchors) are not assets and are skipped.
 */
function ecSwPageAssetUrls($html) {
    preg_match_all('#(?:src|href)\s*=\s*"([^"]+)"#i', $html, $m);
    $urls = [];
    foreach ($m[1] as $url) {
        if (strpos($url, EC_SW_BASE) !== 0) continue;             // external or relative
        $path = strtok($url, '?');
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (!in_array($ext, ['js', 'css', 'json', 'png', 'svg', 'ico', 'gif', 'jpg'], true)) continue;
        $urls[$url] = true;
    }
    return array_keys($urls);
}

if ($problems) {
    echo "Service-worker manifest findings:\n";
    foreach ($problems as $p) echo "  - $p\n";
    exit(1);
}
printf("ok -- %d assets, %d pages precached; %d asset URLs across %d rendered pages all match\n",
       count($manifest['assets']), count($manifest['pages']), $checkedUrls, $checkedPages);
exit(0);
