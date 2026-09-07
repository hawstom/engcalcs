<?php
/**
 * Canonical.lib.php -- the ONE place that says which URL a page nominates as its own.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS FILE EXISTS (ROADMAP Task 479.01, 2026-09-06).
 *
 * `ec_canonical_url()` built the path from `$_SERVER['SCRIPT_NAME']`, which is exactly right while
 * every page answers at the address of its own script. It stopped being right the day '/app/'
 * landed: that is a rewrite onto Looped-Network.php, so SCRIPT_NAME under it is still
 * '/engcalcs/Looped-Network.php' and the page served at https://librewaternet.org/app/ nominated
 * https://librewaternet.org/engcalcs/Looped-Network.php instead -- in `<link rel="canonical">`, in
 * every hreflang alternate and in `og:url`, because all three read that one function. The pretty
 * URL was therefore the one address in the suite that could not be indexed.
 *
 * A PRETTY URL IS DECLARED HERE AND NOWHERE ELSE, AND IT IS NEVER INFERRED FROM THE ENVIRONMENT.
 * The tempting fix is to reverse the rewrite -- read REQUEST_URI, or subtract a prefix. A rewrite
 * is not invertible: REQUEST_URI is client-supplied, so trusting it lets an arbitrary URL nominate
 * itself as canonical (the same hole `ec_canonical_url()`'s own comment refuses SCRIPT_NAME's
 * alternatives for), and a prefix subtraction needs a fresh guess for every mount added after it.
 * The page that answers at a pretty URL STATES that URL; everything else derives.
 *
 * NO DEPENDENCIES ON PURPOSE. The sitemap generator runs outside a web request and must reach the
 * same declaration, so this file requires nothing, defines no constant and touches no global.
 * dev/scripts/canonical_path_check.php holds it against lib/ServiceWorker.lib.php's mount list.
 */

/**
 * Pages that answer at a pretty URL, and the URL each one nominates.
 *
 * Keyed on the SCRIPT the rewrite lands on -- its bare filename, because the map is a fact about
 * the page and not about which of the suite's mounts the visitor reached it through. The value is
 * the root-anchored path of the address that URL is served at, with no query string: the language
 * parameter is appended by ec_canonical_url() exactly as it is for an ordinary page.
 *
 * A PAGE HAS ONE CANONICAL ADDRESS, so the OTHER path keeps working and defers. Looped-Network.php
 * is genuinely served at both '/engcalcs/Looped-Network.php' and '/app/'; naming '/app/' here makes
 * both of them, on both domains, emit the '/app/' canonical -- which is the entire point, since two
 * copies each nominating themselves is the split that divides one page's ranking signal in half.
 *
 * **THE TRAILING SLASH IS LOAD-BEARING AND IT COST A LIVE DEFECT** (2026-09-06). This said '/app'
 * for one afternoon, and then '/app' was made to 301 to '/app/' so that the web app manifest's
 * scope could contain it -- manifest scope is compared as a plain STRING PREFIX, so a scope of
 * '/app' also matches '/apple-anything'. The two were written hours apart and neither was wrong
 * when it was written; together they had every page, and all 545 sitemap URLs, NOMINATING AN
 * ADDRESS THAT REDIRECTS. A canonical pointing at a redirect is the ambiguity this whole task
 * exists to remove, and it was found by curling the live site rather than by any check.
 *
 * **SO THE RULE IS NOW EXACT-MATCH AGAINST THE MOUNT, not merely under it**, and
 * canonical_path_check.php holds it: ecSwMounts() has declared '/app/' since the day the mount
 * existed, so the mismatch was latent from the start and an exact-match rule would have caught it
 * before the redirect ever made it visible.
 *
 * @return array<string,string> page filename => root-anchored canonical path.
 */
function ecCanonicalPaths() {
    return array(
        'Looped-Network.php' => '/app/',
    );
}

/**
 * The canonical PATH for a script, pretty URL or not.
 *
 * @param string $scriptName  $_SERVER['SCRIPT_NAME'], or a '/engcalcs/<page>' path.
 * @return string             root-anchored path, no query string.
 */
function ecCanonicalPath($scriptName) {
    $path = (string)$scriptName;
    if ($path === '') { $path = '/engcalcs/index.php'; }
    $pretty = ecCanonicalPaths();
    $page = basename($path);
    if (isset($pretty[$page])) { return $pretty[$page]; }
    // /index.php collapses to the directory URL, so the suite front page has one address.
    if (substr($path, -10) === '/index.php') { $path = substr($path, 0, -9); }
    return $path;
}
