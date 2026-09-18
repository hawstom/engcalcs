<?php
/**
 * EVERY URL THE SITEMAP ADVERTISES IS THE URL THAT PAGE NOMINATES AS CANONICAL.
 *
 * Usage:  php dev/scripts/sitemap_canonical_check.php
 * Exit 0 = every advertised URL is self-canonical. Exit 1 = at least one is disowned by its page.
 *
 * **THE FAILURE IS INVISIBLE FROM BOTH ENDS AND THAT IS WHY IT SURVIVED.** The page renders
 * correctly and its canonical tag is right. The sitemap is well-formed XML and every URL in it
 * answers 200. Nothing is broken; the two documents simply disagree about the page's address, and
 * the only place the disagreement surfaces is a Search Console report nobody in this repository can
 * read. Google's name for it is "Alternative page with proper canonical tag" -- an EXCLUSION, so
 * the page drops out of the index while every instrument here says the site is healthy.
 *
 * **MEASURED 2026-09-17: 2 of 545. The other 543 agreed.** That is this project's recurring
 * signature -- a construct written many times with the discriminating detail present on nearly all
 * of them and absent on a few (cf. rel="noopener" at 13 against 12, the cookie attributes at 5
 * against 4). The two were privacy.php and terms.php, the English-only pages: they take no ?lang=
 * loop, so the bare path looked like the natural address, while echoHTMLHead() self-canonicalises
 * EVERY suite page to ?lang=<current> -- which for an English-only document is always ?lang=en.
 *
 * **IT READS THE GENERATOR, NOT THE DEPLOYED FILE, AND THAT IS DELIBERATE.** ../sitemap.xml lives
 * outside this repository and is re-uploaded by hand, so a check reading it would pass or fail on
 * whatever happens to be on this machine. Re-deriving the URL list from
 * generate_sitemap.php --stdout tests the thing that will be deployed next.
 *
 * **IT HOLDS THE ORIGIN AS WELL AS THE PATH, since 2026-09-17.** The suite stopped having one
 * origin the day the calculators went back to hawsedc.com and the map application stayed on
 * librewaternet.org, so "is this URL on the suite's domain" is no longer a question with one
 * answer. Scope is therefore decided on the PATH and the origin is then compared against
 * ecCanonicalOrigin() -- the same declaration ec_canonical_url() reads.
 *
 * **WHAT IT CANNOT SEE, stated rather than implied:** it does not fetch a page and read its real
 * <link rel="canonical">. That needs a web request, which is the account's own daily page check and
 * not this tree (ROADMAP Task 676). It compares the advertised URL against ecCanonicalPath() plus
 * the language suffix -- the same two inputs echoHTMLHead() uses -- so a defect in THAT function is
 * invisible here and is canonical_path_check.php's business.
 *
 * Copyright 2009 Thomas Gail Haws. LICENSE: GNU GPL v3 or later.
 */

$repoRoot = dirname(__DIR__, 2);
$root     = isset($argv[1]) && $argv[1] !== '' ? $argv[1] : $repoRoot;

$out = [];
$rc  = 0;
exec('php ' . escapeshellarg($root . '/dev/scripts/generate_sitemap.php') . ' --stdout 2>/dev/null', $out, $rc);
if ($rc !== 0 || !$out) {
    fwrite(STDERR, "FAIL: generate_sitemap.php --stdout produced nothing (exit $rc).\n");
    exit(1);
}
$xml = implode("\n", $out);

$doc = @simplexml_load_string($xml);
if ($doc === false) {
    fwrite(STDERR, "FAIL: the generated sitemap is not well-formed XML.\n");
    exit(1);
}

// **SCOPE IS DECIDED ON THE PATH, NOT THE ORIGIN, and that changed on 2026-09-17.** The suite no
// longer has one origin: ecCanonicalOrigins() declares Looped-Network.php on librewaternet.org and
// everything else falls through to CANONICAL_ORIGIN_DEFAULT, which is hawsedc.com again -- the same
// host the parent site's own pages are on. So an origin test can no longer tell a suite URL from a
// parent-site one. A suite URL is one under EC_SW_BASE or at a declared pretty path; the parent
// site's /sewslope.php and friends are DECLARED out of scope because they emit no canonical tag at
// all and there is nothing to compare them against. They are counted and printed, never skipped in
// silence.
$_SERVER['SCRIPT_NAME'] = 'sitemap_canonical_check.php';
require $root . '/lib/Language.Settings.php';
require $root . '/lib/Canonical.lib.php';
$languages = array_flip(array_keys($all_language_settings));

// The fallback origin, read out of lib/config.inc.php exactly as the generator reads it, so this
// check and the thing it checks cannot hold two opinions about the default.
$defaultOrigin = 'https://hawsedc.com';
if (is_file($root . '/lib/config.inc.php')
    && preg_match("/define\('CANONICAL_ORIGIN_DEFAULT',\s*'([^']*)'\)/",
                  (string)file_get_contents($root . '/lib/config.inc.php'), $dm)) {
    $defaultOrigin = $dm[1];
}
$prettyToPage = array_flip(ecCanonicalPaths());

$checked = 0;
$offSite = 0;
$turnedAway = 0;
$findings = [];

foreach ($doc->url as $u) {
    $loc = (string)$u->loc;
    if (!preg_match('#^(https?://[^/]+)(/.*)?$#', $loc, $lm)) { $turnedAway++; continue; }
    $origin = $lm[1];
    $rest   = isset($lm[2]) && $lm[2] !== '' ? $lm[2] : '/';

    $q = '';
    $path = $rest;
    $qpos = strpos($rest, '?');
    if ($qpos !== false) { $path = substr($rest, 0, $qpos); $q = substr($rest, $qpos + 1); }

    // Out of scope: not a suite address at all. The parent site's own documents land here.
    if (strpos($path, '/engcalcs/') !== 0 && !isset($prettyToPage[$path])) { $offSite++; continue; }

    // A URL shaped like nothing this suite emits has no expectation to compare against. Counted.
    if ($q !== '' && strpos($q, 'lang=') !== 0) { $turnedAway++; continue; }

    $checked++;

    // Leg 1: the PATH must be the one the page nominates. ecCanonicalPath() is the single
    // declaration, the same one ec_canonical_url() reads, so a pretty URL and the /index.php
    // collapse are handled here and not re-implemented.
    $want = ecCanonicalPath($path);
    if ($want !== $path) {
        $findings[] = "$loc\n      the page nominates the path $want, not $path";
        continue;
    }

    // Leg 2: EVERY suite URL is self-canonical only WITH a ?lang=. echoHTMLHead() writes
    // ?lang=<current> on every page it renders, including an English-only one -- which is the
    // whole finding of 2026-09-17. A bare path is therefore always disowned by its own page.
    if ($q === '') {
        $findings[] = "$loc\n      no ?lang= -- the page self-canonicalises to ?lang=en, so this URL is disowned";
        continue;
    }

    // Leg 3: the language must be one the suite actually serves. A ?lang= naming no language file
    // renders in English and canonicalises to ?lang=en, so it is the same defect by another door.
    $lang = substr($q, strlen('lang='));
    if (!isset($languages[$lang])) {
        $findings[] = "$loc\n      ?lang=$lang names no lib/lang.ec.$lang.php, so the page renders and canonicalises as en";
        continue;
    }

    // Leg 4: the ORIGIN must be the one the page nominates. **This is the leg of 2026-09-17.** For
    // eleven days every calculator was advertised, and canonicalised, on librewaternet.org while
    // hawsedc.com held the ranking -- 7,575 clicks a quarter against 68. A sitemap that names the
    // other origin is the same disagreement as a wrong path and is just as invisible: the URL
    // answers 200 either way, because both hosts serve this checkout.
    $page = isset($prettyToPage[$path]) ? $prettyToPage[$path] : basename($path);
    $wantOrigin = ecCanonicalOrigin($page, $defaultOrigin);
    if ($origin !== $wantOrigin) {
        $findings[] = "$loc\n      the page nominates the origin $wantOrigin, not $origin";
    }
}

echo "sitemap canonical agreement: $checked suite URLs checked, "
   . "$offSite parent-site URLs out of scope, $turnedAway turned away as unrecognised shapes.\n";

if ($findings) {
    fwrite(STDERR, "\nFAIL: " . count($findings) . " sitemap URL(s) the page itself disowns.\n\n");
    foreach ($findings as $f) { fwrite(STDERR, "  $f\n"); }
    fwrite(STDERR, "\nA sitemap must advertise the address the PAGE nominates in its own\n"
        . "<link rel=\"canonical\">. Where the two disagree the page is well-formed, the URL\n"
        . "answers 200, and Google quietly EXCLUDES it as \"Alternative page with proper\n"
        . "canonical tag\" -- a drop out of the index with no symptom anything here can see.\n\n"
        . "Fix dev/scripts/generate_sitemap.php so it emits the canonical form, and re-upload\n"
        . "../sitemap.xml: deployment is a git pull and the sitemap is not tracked, so a\n"
        . "regenerated file does not travel with the commit.\n");
    exit(1);
}

if ($checked === 0) {
    fwrite(STDERR, "FAIL: no suite URLs were checked at all. The scan has gone blind.\n");
    exit(1);
}

echo "PASS: every advertised suite URL is the one its page nominates.\n";
exit(0);
