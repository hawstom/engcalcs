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
 *   5. dev/scripts/generate_sitemap.php's own $origin agrees with the default. The sitemap is
 *      generated outside a web request, so it has no host to look up and carries its own copy;
 *      the two drifting apart is the failure this pins down.
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
            if ($s[1] !== $default) {
                bad("generate_sitemap.php \$origin is '{$s[1]}' but CANONICAL_ORIGIN_DEFAULT is\n"
                  . "        '$default'. The sitemap runs outside a web request and carries its own copy;\n"
                  . "        keep the two in step or the sitemap advertises URLs the pages disown.");
            }
        } else {
            bad("generate_sitemap.php: no single-quoted \$origin found to compare.");
        }
    }
}

if ($fail) {
    echo "\nFAIL: $fail canonical-origin problem" . ($fail === 1 ? '' : 's') . "\n";
    exit(1);
}

$hosts = count($values);
echo "PASS: canonical origin is a whitelist of $hosts host"
   . ($hosts === 1 ? '' : 's') . ", every value a literal https origin.\n";
exit(0);
