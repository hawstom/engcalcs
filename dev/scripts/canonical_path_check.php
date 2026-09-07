<?php
/**
 * canonical_path_check.php -- a page served at a PRETTY URL nominates that URL. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 479.01, 2026-09-06). '/app' is a rewrite onto Looped-Network.php,
 * and `ec_canonical_url()` built its path from SCRIPT_NAME -- which under a rewrite is the script,
 * not the address. So https://librewaternet.org/app emitted a canonical, twenty-seven hreflang
 * alternates and an og:url all naming /engcalcs/Looped-Network.php, and the suite's front door was
 * the one URL that could not be indexed. **Nothing on the page shows it.** It renders identically,
 * works identically, and the only place the defect is visible is a search engine's index months
 * later, which is the same reason canonical_origin_check.php exists.
 *
 * WHAT IS ASSERTED
 *   1. Every page in ecCanonicalPaths() (lib/Canonical.lib.php) is a real page in the repo root.
 *   2. Every declared path is root-anchored, carries no query string and no trailing slash, and
 *      is NOT under EC_SW_BASE -- a "pretty" URL inside /engcalcs/ is the script's own address
 *      wearing a hat, and two pages could then claim one URL.
 *   3. No two pages claim the same path.
 *   4. Every declared path is covered by a mount ecSwMounts() declares. A canonical URL outside
 *      every mount is an address the service worker cannot control: the visitor who arrives at the
 *      address we ASKED to be indexed is the one who gets no offline suite.
 *   5. Every mount other than EC_SW_BASE is claimed by exactly one declared page. This is the
 *      regression: adding a second pretty URL and forgetting this file leaves that mount serving a
 *      page that nominates somebody else, which is the self-canonical split by another door.
 *   6. ec_canonical_url() goes through ecCanonicalPath() and does not build the path from
 *      SCRIPT_NAME itself, and generate_sitemap.php goes through it too -- so the sitemap cannot
 *      advertise a URL the page disowns.
 *
 * The ORIGIN half of the same question -- which host, and the sitemap agreeing with the default --
 * is canonical_origin_check.php's, and is deliberately not repeated here.
 *
 *   php dev/scripts/canonical_path_check.php
 */

/**
 * @param array<string,string> $pretty    ecCanonicalPaths(): page filename => canonical path.
 * @param array<string,string> $mounts    ecSwMounts(): mount prefix => why.
 * @param string               $swBase    EC_SW_BASE.
 * @param array<int,string>    $pages     page filenames that exist in the repo root.
 * @param string               $langSrc   lib/Language.lib.php source.
 * @param string               $mapSrc    dev/scripts/generate_sitemap.php source.
 * @return array<int,string>              findings, empty when all is well.
 */
function ecCanonicalPathFindings(array $pretty, array $mounts, $swBase, array $pages, $langSrc, $mapSrc) {
    $out = array();

    $covers = function ($mount, $path) {
        // A mount is a prefix with a trailing slash; the path it covers may be the bare directory.
        return $path === rtrim($mount, '/') || strpos($path, $mount) === 0;
    };

    $seen = array();
    foreach ($pretty as $page => $path) {
        if (!in_array($page, $pages, true)) {
            $out[] = "ecCanonicalPaths() declares '$page', which is not a page in the repository root. "
                   . "The key is the SCRIPT the rewrite lands on, by bare filename.";
        }
        if ($path === '' || $path[0] !== '/') {
            $out[] = "canonical path '$path' for '$page' is not root-anchored. It is appended to an "
                   . "origin, so it must start with '/'.";
            continue;
        }
        if (strpos($path, '?') !== false) {
            $out[] = "canonical path '$path' for '$page' carries a query string. ec_canonical_url() "
                   . "appends '?lang=xx' itself.";
        }
        if (strlen($path) > 1 && substr($path, -1) === '/') {
            $out[] = "canonical path '$path' for '$page' has a trailing slash. A pretty URL is one "
                   . "address, and '/app' and '/app/' are two.";
        }
        if (strpos($path, $swBase) === 0) {
            $out[] = "canonical path '$path' for '$page' is under EC_SW_BASE ('$swBase'), where every "
                   . "script already answers at its own address. Declare a pretty URL only where a "
                   . "rewrite makes SCRIPT_NAME disagree with what the visitor typed.";
        }
        if (isset($seen[$path])) {
            $out[] = "'$page' and '{$seen[$path]}' both claim '$path'. One address, one page: two "
                   . "pages nominating one URL is the split this file exists to make impossible.";
        }
        $seen[$path] = $page;

        $covered = false;
        foreach (array_keys($mounts) as $mount) { if ($covers($mount, $path)) { $covered = true; break; } }
        if (!$covered) {
            $out[] = "canonical path '$path' for '$page' is under no mount ecSwMounts() declares. "
                   . "We would be asking a search engine to index an address the service worker "
                   . "cannot control, so the visitor arriving there gets no offline suite.";
        }
    }

    foreach ($mounts as $mount => $why) {
        if ($mount === $swBase) { continue; }
        $claimed = array();
        foreach ($pretty as $page => $path) { if ($covers($mount, $path)) { $claimed[] = $page; } }
        if (!$claimed) {
            $out[] = "ecSwMounts() declares the mount '$mount' and no page in ecCanonicalPaths() "
                   . "nominates an address under it. The page served there therefore nominates its "
                   . "SCRIPT's address instead, which is exactly the canonical split of Task 479.01.";
        }
    }

    if (strpos($langSrc, 'ecCanonicalPath(') === false) {
        $out[] = "ec_canonical_url() no longer calls ecCanonicalPath(). The declaration in "
               . "lib/Canonical.lib.php is then decoration and every pretty URL nominates its script.";
    }
    if (preg_match('/\$path\s*=\s*[^;\n]*SCRIPT_NAME[^;\n]*;/', $langSrc)
        && strpos($langSrc, 'ecCanonicalPath(') === false) {
        $out[] = "ec_canonical_url() builds the canonical path from SCRIPT_NAME directly. Under a "
               . "rewrite SCRIPT_NAME is the script, not the address anybody reads.";
    }
    if (strpos($mapSrc, 'ecCanonicalPath(') === false) {
        $out[] = "generate_sitemap.php does not call ecCanonicalPath(), so it lists each page at its "
               . "script's address. A sitemap naming a URL the page disowns is a contradiction we "
               . "hand to a crawler in writing.";
    }

    return $out;
}

if (defined('CANONICAL_PATH_LIB_ONLY')) { return; }

$root = dirname(__DIR__, 2);
require_once $root . '/lib/Canonical.lib.php';
require_once $root . '/lib/ServiceWorker.lib.php';

$pages = array();
foreach (glob($root . '/*.php') as $p) { $pages[] = basename($p); }

$findings = ecCanonicalPathFindings(
    ecCanonicalPaths(),
    ecSwMounts(),
    EC_SW_BASE,
    $pages,
    (string)file_get_contents($root . '/lib/Language.lib.php'),
    (string)file_get_contents($root . '/dev/scripts/generate_sitemap.php')
);

if ($findings) {
    foreach ($findings as $f) { echo "  FAIL  $f\n"; }
    echo "\nThe declaration is lib/Canonical.lib.php's ecCanonicalPaths(). A page served at a pretty\n";
    echo "URL states that URL there; canonical, every hreflang alternate and og:url all derive from\n";
    echo "it, and so does the sitemap. Nothing on the page shows this defect.\n";
    echo "\nFAIL: " . count($findings) . " canonical-path problem" . (count($findings) === 1 ? '' : 's') . "\n";
    exit(1);
}

$n = count(ecCanonicalPaths());
echo "PASS: $n pretty URL" . ($n === 1 ? '' : 's') . " declared, each under a declared mount, each"
   . " the address its page nominates.\n";
exit(0);
