<?php
/**
 * Canonical.lib.php -- the ONE place that says which URL a page nominates as its own: the PATH
 * (ecCanonicalPaths()) and, since 2026-09-17, the ORIGIN (ecCanonicalOrigins()).
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
 * Pages whose canonical ORIGIN is not the suite's own, and the origin each one nominates.
 *
 * **THE DIVORCE DID NOT GIVE LibreWaterNet THE CALCULATORS** (Tom, 2026-09-17: *"We don't want to
 * squander a 15-year legacy... The terms of the divorce were not that LWN gets all the calculators.
 * They were only that LWN walks away free. hawsedc.com/engcalcs should stay canonical for what it
 * is."*). Between 2026-09-06 and 2026-09-17 every page in the suite -- all sixteen calculators
 * included -- nominated librewaternet.org, because CANONICAL_ORIGIN was ONE constant for the whole
 * tree and the map application needed that origin. **The cost was measured in Search Console over
 * three months: hawsedc.com 7,575 clicks with Manning Pipe Flow at position 9.7; librewaternet.org
 * 68 clicks in nine days at position 34.1.** We were telling Google the authoritative copy of a
 * page on page one lived on a three-week-old domain on page four.
 *
 * So the origin is a PER-PAGE decision exactly as the pretty path above is, and it is declared in
 * the same place for the same reason: a second catalogue of one fact is the arrangement that
 * drifts. The calculators are hawsedc.com's; the map application is LibreWaterNet's.
 *
 * **IT IS A DECLARATION AND NEVER AN INFERENCE FROM THE REQUEST.** CANONICAL_ORIGIN remains the
 * host -> origin WHITELIST canonical_origin_check.php exists to keep, and this map is consulted
 * before it: a page named here nominates its declared origin on every host, and every other page
 * falls through to the whitelist. Nothing a client sends can introduce a third answer, which is
 * the property that makes a spoofed Host header harmless.
 *
 * **EVERYTHING THE CANONICAL FEEDS MUST FOLLOW IT, and there are five readers, not one:** the
 * <link rel="canonical">, all 27 hreflang alternates, og:url, og:image, and the sitemap. An hreflang
 * set pointing at an origin the page's own canonical disowns is the reciprocity failure Google
 * reports by name -- worse than emitting no hreflang at all.
 *
 * @return array<string,string> page filename => absolute origin, scheme and host, no trailing slash.
 */
function ecCanonicalOrigins() {
    return array(
        'Looped-Network.php' => 'https://librewaternet.org',
    );
}

/**
 * The canonical ORIGIN for a script: its declared one, or the host's whitelisted one.
 *
 * @param string $scriptName  $_SERVER['SCRIPT_NAME'], a '/engcalcs/<page>' path, or a bare filename.
 * @param string $hostOrigin  CANONICAL_ORIGIN -- the whitelist's answer for the host being served.
 * @return string             absolute origin, no trailing slash.
 */
function ecCanonicalOrigin($scriptName, $hostOrigin) {
    $path = (string)$scriptName;
    if ($path === '') { $path = '/engcalcs/index.php'; }
    $declared = ecCanonicalOrigins();
    $page = basename($path);
    if (isset($declared[$page])) { return $declared[$page]; }
    return (string)$hostOrigin;
}

/**
 * The absolute URL a page served at its SCRIPT path should be redirected to, or null for "stay".
 *
 * **THE APACHE-LEVEL REDIRECT IS A LOOP AND THAT IS WHY THIS IS IN PHP** (Tom, 2026-09-10, asking
 * the right question: *"do we safely put a redirect on the page, or is that circular?"*).
 * librewaternet.org's own .htaccess carries `RewriteRule ^app/?$ /engcalcs/Looped-Network.php [L]`
 * -- an INTERNAL rewrite. A `Redirect` or `RewriteRule` matching that script path would therefore
 * fire on the rewritten request as well: `/app/` becomes the script, the script redirects to
 * `/app/`, and the browser gives up after twenty hops. **Never put this in .htaccess.**
 *
 * Here it cannot loop BY CONSTRUCTION, because the test is the address the visitor actually asked
 * for: served at `/app/` it returns null and nothing happens. Same discriminator as
 * ecLanguageSwitchPath(), and the output is again one of two server-known strings.
 *
 * **AND IT FIRES ONLY ON A DECLARED HOST.** dev.hawsedc.com and a local checkout fall through
 * CANONICAL_ORIGIN's whitelist to the default origin -- harmless for a canonical tag, fatal here,
 * because a developer testing at `/engcalcs/Looped-Network.php` would be thrown to production.
 * `$hostDeclared` is EC_CANONICAL_HOST_DECLARED and is the whole of that guard.
 *
 * Pure, so the selftest can drive every host shape without a web server.
 *
 * @param string $scriptName    $_SERVER['SCRIPT_NAME'].
 * @param string $requestUri    $_SERVER['REQUEST_URI'], query string and all.
 * @param bool   $hostDeclared  EC_CANONICAL_HOST_DECLARED.
 * @param string $origin        CANONICAL_ORIGIN -- the fallback; a page declaring its own wins.
 * @return string|null          absolute URL to 301 to, or null to serve the page.
 */
function ecCanonicalRedirectTarget($scriptName, $requestUri, $hostDeclared, $origin) {
    if (!$hostDeclared) { return null; }
    $script = (string)$scriptName;
    $pretty = ecCanonicalPath($script);
    // No pretty URL declared for this page: its script path IS its address. Nothing to move to.
    if ($pretty === $script) { return null; }
    // Already being served at the pretty address -- the rewritten request. This is the line that
    // makes a loop impossible.
    if (ecLanguageSwitchPath($script, $requestUri) === $pretty) { return null; }
    // Carry the query string, because ?lang=xx is the commonest way this URL is held.
    $query = '';
    $cut = strpos((string)$requestUri, '?');
    if ($cut !== false) { $query = substr((string)$requestUri, $cut); }
    // **THE ORIGIN IS THE PAGE'S, NOT THE HOST'S, and that stopped being the same thing on
    // 2026-09-17.** hawsedc.com's whitelist entry now answers hawsedc.com, so passing $origin
    // straight through would move a visitor to hawsedc.com/app/ -- an address that does not exist,
    // because /app/ is a rewrite librewaternet.org alone carries. A redirect is the one reader here
    // that MOVES somebody, so getting this from the declaration rather than the host is not tidiness.
    return ecCanonicalOrigin($script, $origin) . $pretty . $query;
}

/**
 * Where a LANGUAGE SWITCH on this page should point, on the host actually serving it.
 *
 * **A CANONICAL ADDRESS AND A NAVIGATION LINK ARE DIFFERENT QUESTIONS, and conflating them was a
 * 404** (Tom, 2026-09-10: *"Changing language on local or on dev is a 404."*). ecCanonicalPath()
 * answers "what address does this page CLAIM as its identity", and for Looped-Network.php that is
 * `/app/` on every host, because identity is a property of the page and not of the server that
 * happens to be answering. But `/app/` is a rewrite that exists ONLY on librewaternet.org, so a
 * link built from it is dead on hawsedc.com, on dev.hawsedc.com and on a local checkout -- which
 * is every host a developer ever looks at, and one of the two the public uses.
 *
 * The language switcher is the control most likely to be pressed on a FIRST visit, so sending it
 * to a 404 anywhere is expensive. It has now been wrong in both directions inside one day: it used
 * `$_SERVER['PHP_SELF']` until 2026-09-10, which moved a reader off `/app/` onto the other host's
 * script path, and the repair to ecCanonicalPath() then 404'd everywhere else.
 *
 * **THE TEST USES REQUEST_URI AND THE OUTPUT NEVER DOES.** CLAUDE.md forbids letting a
 * client-supplied URL nominate an address, and that rule is kept: this compares the request path
 * against a DECLARED pretty path and returns one of two server-known strings -- the declaration
 * itself, or SCRIPT_NAME. Nothing the client sent is ever echoed, so a forged Host or path can
 * choose between two safe answers and cannot introduce a third.
 *
 * @param string $scriptName  $_SERVER['SCRIPT_NAME'].
 * @param string $requestUri  $_SERVER['REQUEST_URI'], query string and all.
 * @return string             root-anchored path that EXISTS on the host serving this request.
 */
function ecLanguageSwitchPath($scriptName, $requestUri) {
    $script = (string)$scriptName;
    $pretty = ecCanonicalPath($script);
    // No pretty URL declared for this page: its script path is its only address anywhere.
    if ($pretty === $script) { return $script; }
    $reqPath = (string)$requestUri;
    $cut = strpos($reqPath, '?');
    if ($cut !== false) { $reqPath = substr($reqPath, 0, $cut); }
    // Served AT the pretty address: stay on it. Both forms, because '/app' is a real URL a visitor
    // is handed and it 301s to '/app/' -- the same pair ecSwMounts() matches.
    if ($reqPath === $pretty || $reqPath === rtrim($pretty, '/')) { return $pretty; }
    return $script;
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
