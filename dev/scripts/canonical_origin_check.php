<?php
/**
 * canonical_origin_check.php -- the canonical origin is a WHITELIST LOOKUP, never a derivation.
 *
 * `CANONICAL_ORIGIN` is the single string every <link rel="canonical">, every hreflang alternate
 * and every sitemap URL is built from. It decides which address Google indexes, which makes it the
 * one constant in the suite where a client-supplied value must never reach the output.
 *
 * ROADMAP Task 479 made it multi-domain: the same checkout is served at hawsedc.com/engcalcs/ and
 * at librewaternet.org/engcalcs/, and a single hard-coded origin would make the second domain
 * invisible by construction -- every page there asking Google to index the first one instead. The
 * resolution is a host -> origin whitelist in lib/config.inc.php. It is safe for one reason and
 * that reason is what this script exists to keep true: **a spoofed Host header can only ever
 * select an origin we already own and listed.** An unrecognised host falls through to the default.
 *
 * Introduce a derivation -- 'https://' . $_SERVER['HTTP_HOST'], or a whitelist value built from it
 * -- and the hole reopens silently: nothing renders differently, no page breaks, and the first
 * symptom is a search engine indexing somebody else's domain on our behalf. Hence a check.
 *
 * WHAT IS ASSERTED
 *   1. lib/config.inc.php defines $ec_canonical_origins as an array of literal strings.
 *   2. No whitelist value is built from HTTP_HOST, or from any variable at all.
 *   3. Every value is an absolute https origin with no trailing slash and no path.
 *   4. CANONICAL_ORIGIN_DEFAULT is itself one of the whitelisted values -- an unknown host must
 *      land on an address we serve, not on a name that only appears in the fallback.
 *   5. dev/scripts/generate_sitemap.php READS the default out of lib/config.inc.php rather than
 *      carrying its own copy. It used to carry a literal with a comment asking the next editor to
 *      keep the two in step, which is the arrangement that drifts; it now lifts the value, and this
 *      leg fails if it goes back to a literal.
 *
 * AND THE PER-PAGE HALF, added 2026-09-17 when the suite stopped having one origin:
 *   6. ecCanonicalOrigins() (lib/Canonical.lib.php) declares only real pages, each with a literal
 *      https origin -- the same shape the whitelist values must have.
 *   7. EC_LWN_ORIGIN in lib/config.inc.php is the SAME STRING ecCanonicalOrigins() declares for
 *      Looped-Network.php. config.inc.php is loaded before Canonical.lib.php and cannot require it,
 *      so librewaternet.org is written in two files; this leg is what makes it one fact.
 *   8. The readers actually go through the declaration: ec_canonical_url() (which feeds the
 *      canonical, all 27 hreflang alternates and og:url), echoHTMLHead()'s og:image, and the
 *      sitemap generator all call ecCanonicalOrigin(). Without this the declaration is decoration
 *      and every page silently nominates whichever host answered -- the exact eleven-day defect.
 *
 * AND THE PER-HOST HALF, added 2026-09-27 for Task 697 (B1, two front doors to the map application):
 *   9. ecCanonicalHostOrigins() names only real pages and only hosts $ec_canonical_origins
 *      whitelists, and each host nominates ITSELF.
 *  10. Every origin the map application can nominate has a brand in ecAppBrands(), homed at that
 *      origin's root, and config.inc.php's LibreWaterNet fallback is the same string.
 *  11. EC_CANONICAL_HOST is gated on the whitelist, and every runtime reader passes it.
 * What the rendered page actually says on each host is canonical_host_check.php's.
 *
 * Blocking. A finding here is never cosmetic.
 */

$root = dirname(__DIR__, 2);
$fail = 0;
function bad($msg) { global $fail; $fail++; echo "  FAIL  $msg\n"; }

$configPath = $root . '/lib/config.inc.php';
$config = file_get_contents($configPath);

if (!preg_match('/\$ec_canonical_origins\s*=\s*Array\s*\((.*?)\);/s', $config, $m)) {
    bad("lib/config.inc.php: no \$ec_canonical_origins = Array( ... ); found.\n"
      . "        The canonical origin must be a host -> origin whitelist. If you replaced it with a\n"
      . "        single hard-coded string, the second domain is invisible; if you replaced it with a\n"
      . "        value derived from HTTP_HOST, a spoofed header can point canonical URLs off-site.");
    echo "\nFAIL: canonical origin whitelist\n";
    exit(1);
}
$body = $m[1];

if (strpos($body, 'HTTP_HOST') !== false || strpos($body, '$') !== false) {
    bad("\$ec_canonical_origins contains a variable. Every entry must be a LITERAL string.\n"
      . "        A whitelist whose values are computed is not a whitelist.");
}

preg_match_all("/=>\s*'([^']*)'/", $body, $vals);
$values = $vals[1];
if (!$values) { bad("\$ec_canonical_origins has no single-quoted values."); }

foreach ($values as $v) {
    if (strpos($v, 'https://') !== 0) {
        bad("origin '$v' is not https. Canonical URLs are https-only here.");
    }
    if (substr($v, -1) === '/') {
        bad("origin '$v' has a trailing slash. Paths are appended directly, so it would double.");
    }
    if (substr_count($v, '/') !== 2) {
        bad("origin '$v' carries a path. An origin is scheme + host and nothing else.");
    }
}

if (!preg_match("/define\('CANONICAL_ORIGIN_DEFAULT',\s*'([^']*)'\)/", $config, $d)) {
    bad("CANONICAL_ORIGIN_DEFAULT is not defined as a literal string.");
} else {
    $default = $d[1];
    if (!in_array($default, $values, true)) {
        bad("CANONICAL_ORIGIN_DEFAULT '$default' is not one of the whitelisted origins.\n"
          . "        An unrecognised Host lands here, so it must be an address we actually serve.");
    }

    $sitemapPath = $root . '/dev/scripts/generate_sitemap.php';
    if (is_file($sitemapPath)) {
        $sitemap = file_get_contents($sitemapPath);
        if (preg_match("/\\\$origin\s*=\s*'([^']*)'/", $sitemap, $s)) {
            bad("generate_sitemap.php sets \$origin to the literal '{$s[1]}'. It must READ\n"
              . "        CANONICAL_ORIGIN_DEFAULT out of lib/config.inc.php instead: a second copy with a\n"
              . "        comment asking the next editor to keep it in step is the arrangement that drifts,\n"
              . "        and a sitemap advertising an origin the pages disown is invisible from both ends.");
        } elseif (strpos($sitemap, 'CANONICAL_ORIGIN_DEFAULT') === false) {
            bad("generate_sitemap.php never mentions CANONICAL_ORIGIN_DEFAULT, so it is not reading\n"
              . "        the default origin from lib/config.inc.php.");
        }
    }
}

// ---- THE PER-PAGE ORIGIN DECLARATION -------------------------------------------------------
require_once $root . '/lib/Canonical.lib.php';

$pageFiles = array();
foreach (glob($root . '/*.php') as $p) { $pageFiles[] = basename($p); }

$declared = ecCanonicalOrigins();
foreach ($declared as $page => $o) {
    if (!in_array($page, $pageFiles, true)) {
        bad("ecCanonicalOrigins() declares '$page', which is not a page in the repository root.\n"
          . "        The key is the SCRIPT the page is served by, as a bare filename.");
    }
    if (strpos($o, 'https://') !== 0 || substr($o, -1) === '/' || substr_count($o, '/') !== 2) {
        bad("ecCanonicalOrigins()['$page'] is '$o'. A canonical origin is https, has no path and\n"
          . "        no trailing slash -- the same shape every whitelist value must have.");
    }
}

// EC_LWN_ORIGIN and the declaration are two copies of one string, in two files that cannot see
// each other. This is the whole guard against them drifting.
if (preg_match("/define\('EC_LWN_ORIGIN',\s*'([^']*)'\)/", $config, $lwn)
    && preg_match("/define\('EC_EPP_ORIGIN',\s*'([^']*)'\)/", $config, $epp)) {
    // The map's canonical is EPANET++'s origin since 2026-10-04 (EC_EPP_ORIGIN); EC_LWN_ORIGIN
    // remains where LibreWaterNet lives and is held to ecAppBrands() below.
    if (!isset($declared['Looped-Network.php'])) {
        bad("lib/config.inc.php defines EC_LWN_ORIGIN but ecCanonicalOrigins() declares no origin\n"
          . "        for Looped-Network.php, so the map application would nominate hawsedc.com.");
    } elseif ($declared['Looped-Network.php'] !== $epp[1]) {
        bad("EC_EPP_ORIGIN is '{$epp[1]}' but ecCanonicalOrigins() puts Looped-Network.php on\n"
          . "        '{$declared['Looped-Network.php']}'. One is where the suite SENDS somebody wanting\n"
          . "        the map and the other is the address that page nominates; they must be one string.");
    }
} else {
    bad("lib/config.inc.php does not define EC_LWN_ORIGIN as a literal. EC_LWN_APP_URL and\n"
      . "        EC_LWN_SITE_URL are built from it and must not be built from CANONICAL_ORIGIN_DEFAULT,\n"
      . "        which is the calculators' origin and no longer LibreWaterNet's.");
}

// ---- THE PER-HOST HALF (Task 697, B1) ------------------------------------------------------
// A page may nominate a different origin on ONE named host -- the map application on
// epanet-plus-plus.org. Each host key must be a host $ec_canonical_origins already whitelists:
// config.inc.php hands ecCanonicalOrigin() only a whitelisted host (EC_CANONICAL_HOST), so a key
// that is not one would be dead, and a check that allowed it would be inviting the next editor to
// "fix" that by passing the raw Host header through.
preg_match_all("/'([^']+)'\s*=>\s*'https:/", $body, $hk);
$whitelistHosts = $hk[1];
if (!function_exists('ecCanonicalHostOrigins')) {
    bad("lib/Canonical.lib.php has no ecCanonicalHostOrigins(). The per-host declaration is where\n"
      . "        epanet-plus-plus.org/app/ nominates itself; without it that front door nominates\n"
      . "        librewaternet.org and cannot rank on its own.");
} else {
    $brands = function_exists('ecAppBrands') ? ecAppBrands() : array();
    foreach (ecCanonicalHostOrigins() as $page => $byHost) {
        if (!in_array($page, $pageFiles, true)) {
            bad("ecCanonicalHostOrigins() declares '$page', which is not a page in the repository root.");
        }
        if (!is_array($byHost)) { bad("ecCanonicalHostOrigins()['$page'] is not a host => origin array."); continue; }
        foreach ($byHost as $h => $o) {
            if (!in_array($h, $whitelistHosts, true)) {
                bad("ecCanonicalHostOrigins()['$page'] names host '$h', which lib/config.inc.php's\n"
                  . "        \$ec_canonical_origins does not whitelist -- so EC_CANONICAL_HOST can never be '$h'\n"
                  . "        and this declaration never fires. Add the host there (bare, lowercase, no www).");
            }
            if (strpos($o, 'https://') !== 0 || substr($o, -1) === '/' || substr_count($o, '/') !== 2) {
                bad("ecCanonicalHostOrigins()['$page']['$h'] is '$o'. A canonical origin is https, has no\n"
                  . "        path and no trailing slash.");
            }
            if ($o !== 'https://' . $h) {
                bad("ecCanonicalHostOrigins()['$page']['$h'] is '$o'. A per-host declaration exists so a\n"
                  . "        host can nominate ITSELF; pointing one host at another is the split this file exists\n"
                  . "        to prevent, and belongs in ecCanonicalOrigins() if it is ever wanted.");
            }
        }
    }
    // The brand follows the canonical: every origin the map application can nominate has a name.
    $appOrigins = array();
    if (isset($declared['Looped-Network.php'])) { $appOrigins[] = $declared['Looped-Network.php']; }
    $hostDecl = ecCanonicalHostOrigins();
    if (isset($hostDecl['Looped-Network.php'])) { $appOrigins = array_merge($appOrigins, array_values($hostDecl['Looped-Network.php'])); }
    foreach ($appOrigins as $o) {
        if (!isset($brands[$o])) {
            bad("Looped-Network.php can nominate '$o' but ecAppBrands() gives that origin no name, so\n"
              . "        the About box on that host would fall back to LibreWaterNet.org under another\n"
              . "        domain's canonical.");
        } elseif ($brands[$o]['site'] !== $o . '/') {
            bad("ecAppBrands()['$o']['site'] is '{$brands[$o]['site']}'. A brand's home is its own origin's root.");
        }
    }
}
// EC_CANONICAL_HOST must be gated on the whitelist, never the raw Host header. The fallback may be
// '' or a DEBUG_MODE-only dev alias (Task 697 follow-up, epanet-plus-plus.localhost) -- but that
// alias variable must itself come only from a whitelisted host, checked separately below.
if (!preg_match('/define\(\'EC_CANONICAL_HOST\',\s*EC_CANONICAL_HOST_DECLARED\s*\?\s*\$ec_canonical_host\s*:\s*\$ec_canonical_dev_alias\)/', $config)) {
    bad("lib/config.inc.php does not define EC_CANONICAL_HOST as\n"
      . "        EC_CANONICAL_HOST_DECLARED ? \$ec_canonical_host : \$ec_canonical_dev_alias. It is the\n"
      . "        key the per-host declaration is looked up by, and must be '' (or a whitelisted dev\n"
      . "        alias) for every host the whitelist does not name.");
}
// The dev alias must be gated on DEBUG_MODE, or a *.localhost Host header would pick one in
// production too.
if (!preg_match('/if\s*\(DEBUG_MODE\s*&&\s*substr\(\$ec_canonical_host,\s*-10\)\s*===\s*\'\.localhost\'\)/', $config)) {
    bad("lib/config.inc.php's \$ec_canonical_dev_alias is not gated on DEBUG_MODE, so a\n"
      . "        *.localhost Host header would pick an alias in production too.");
}
// And it must be gated on whitelist membership, or an arbitrary '<anything>.localhost' would pick
// an arbitrary alias in development.
if (!preg_match('/foreach\s*\(\$ec_canonical_origins as \$ec_canonical_dev_key/', $config)) {
    bad("lib/config.inc.php's \$ec_canonical_dev_alias is not matched against\n"
      . "        \$ec_canonical_origins, so an arbitrary *.localhost Host header could pick an\n"
      . "        arbitrary alias in development.");
}
// The fallback brand in config.inc.php is the same string ecAppBrands() gives librewaternet.org.
if (preg_match("/'name'\s*=>\s*'([^']*)',\s*'site'\s*=>\s*EC_LWN_SITE_URL/", $config, $fb)
    && isset($lwn[1]) && function_exists('ecAppBrands')) {
    $b = ecAppBrands();
    if (!isset($b[$lwn[1]]) || $b[$lwn[1]]['name'] !== $fb[1]) {
        bad("ecAppBrandCurrent()'s fallback name '{$fb[1]}' is not the name ecAppBrands() gives\n"
          . "        EC_LWN_ORIGIN. They are one fact written twice; keep them one string.");
    }
}

// The readers. A declaration nothing consults is decoration, and that is exactly how every page
// came to nominate one host for eleven days.
$readers = array(
    'lib/Language.lib.php'        => 'ec_canonical_url(), which feeds the canonical, all 27 hreflang alternates and og:url',
    'lib/HeadersFooters.lib.php'  => "echoHTMLHead()'s og:image",
    'dev/scripts/generate_sitemap.php' => 'the sitemap generator',
);
foreach ($readers as $rel => $what) {
    $src = is_file($root . '/' . $rel) ? (string)file_get_contents($root . '/' . $rel) : '';
    if (strpos($src, 'ecCanonicalOrigin(') === false) {
        bad("$rel does not call ecCanonicalOrigin(), so $what\n"
          . "        ignores the per-page declaration and emits whichever origin the host resolved to.");
    }
}
// The runtime readers must also pass the SERVING HOST, or the per-host declaration is silently
// ignored and epanet-plus-plus.org/app/ nominates librewaternet.org -- the argument defaults to ''.
// The sitemap runs outside a request and deliberately passes none: see generate_sitemap.php.
$hostReaders = array(
    'lib/Language.lib.php'       => 'ec_canonical_url() (canonical, 27 hreflang alternates, og:url)',
    'lib/HeadersFooters.lib.php' => 'og:image',
    'Looped-Network.php'         => 'the script-path redirect to /app/',
);
foreach ($hostReaders as $rel => $what) {
    $src = is_file($root . '/' . $rel) ? (string)file_get_contents($root . '/' . $rel) : '';
    if (!preg_match('/ecCanonical(Origin|RedirectTarget)\((?:[^;]*?)EC_CANONICAL_HOST\)/s', $src)) {
        bad("$rel never passes EC_CANONICAL_HOST to ecCanonicalOrigin()/ecCanonicalRedirectTarget(),\n"
          . "        so $what ignores ecCanonicalHostOrigins() and every host gets the default answer.");
    }
}

if ($fail) {
    echo "\nFAIL: $fail canonical-origin problem" . ($fail === 1 ? '' : 's') . "\n";
    exit(1);
}

$hosts = count($values);
$pp = count($declared);
echo "PASS: canonical origin is a whitelist of $hosts host"
   . ($hosts === 1 ? '' : 's') . ", every value a literal https origin, with $pp per-page override"
   . ($pp === 1 ? '' : 's') . " and " . count(ecCanonicalHostOrigins(), COUNT_RECURSIVE) - count(ecCanonicalHostOrigins())
   . " per-host override(s) declared and read by every reader.\n";
exit(0);
