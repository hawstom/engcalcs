<?php
/**
 * Generate hawsedc.com/sitemap.xml (ROADMAP Task 149).
 *
 * Usage:  php dev/scripts/generate_sitemap.php [--stdout]
 *
 * Writes to the parent-site root, which is OUTSIDE this repository
 * (/var/www/cnm/public_html/hawsedc/sitemap.xml -- see ROADMAP Task 151 on why the parent site's
 * files are edited in place there rather than staged under dev/). Tom uploads it to deploy.
 * Pass --stdout to print instead of writing, for review.
 *
 * Why a sitemap at all, given the pages are already linked: the ?lang=xx URLs are not reachable
 * by crawling. They exist only in the language dropdown, and Googlebot crawls with
 * Accept-Language: en, so every internal link it follows renders in English. Listing each
 * (page, language) pair explicitly is the only way the other 26 languages enter the index.
 * The hreflang relationships between those URLs come from the HTML <head> (echoHTMLHead in
 * lib/HeadersFooters.lib.php); repeating them as xhtml:link here would multiply the file by ~27
 * for no additional signal.
 *
 * Copyright 2009 Thomas Gail Haws. LICENSE: GNU GPL v3 or later.
 */

$repoRoot   = dirname(__DIR__, 2);              // .../hawsedc/engcalcs
$siteRoot   = dirname($repoRoot);               // .../hawsedc          (parent site, not a repo)
$origin     = 'https://hawsedc.com';            // keep in step with CANONICAL_ORIGIN
$outFile    = $siteRoot . '/sitemap.xml';
$toStdout   = in_array('--stdout', $argv, true);

// --- Languages -------------------------------------------------------------------------------
// Read straight from the app's own settings file so a new language never needs a second edit here.
$_SERVER['SCRIPT_NAME'] = 'generate_sitemap.php';
require $repoRoot . '/lib/Language.Settings.php';
$languages = array_keys($all_language_settings);

// --- Multilingual pages ----------------------------------------------------------------------
// Every .php in the engcalcs root is a candidate; these are excluded and why.
$excluded = [
    'formmail.php'         => 'form handler, no content',
    'formmailsuccess.php'  => 'post-submit confirmation, thin and duplicate',
    'log-calc-event.php'   => 'beacon endpoint, emits no HTML',
    'log-human-view.php'   => 'beacon endpoint, emits no HTML',
    'Install.php'          => 'operator documentation, not a visitor page',
    'Compare-Languages.php'=> 'translator tool, output is a diff table',
    'log-title-event.php'  => 'beacon endpoint, emits no HTML',
    'consent.php'          => 'redirect endpoint for the no-JS consent path, emits no HTML',
    'log-signal-event.php' => 'beacon endpoint, emits no HTML',
    'lpn-lock.php'         => 'POST-only lock broker, answers a GET with 405',
    'sw.php'               => 'generates the service worker, serves JavaScript',
];
// English-only pages: real content, indexable, but with no ?lang= variants because the body is
// hard-coded English (ROADMAP Task 286 -- legal prose is not machine-translated). Emitting 27
// language URLs for one English document would ask Google to index 27 duplicates.
$englishOnly = ['privacy.php', 'terms.php'];
$pages = [];
$notPages = [];
foreach (glob($repoRoot . '/*.php') as $path) {
    $file = basename($path);
    if (isset($excluded[$file])) continue;
    // **A PAGE IS SOMETHING THAT CALLS echoHeader(). Everything else is an endpoint.**
    // The list above is a hand-kept denylist, and it silently fell behind: log-signal-event.php,
    // lpn-lock.php and sw.php were all added after it was written, so all three were advertised
    // to Google in 27 languages apiece. Google crawled lpn-lock.php?lang=he, got its POST-only
    // 405, and reported "Blocked due to other 4xx issue" -- found 2026-08-19 by Tom in Search
    // Console, not by anything here. So the denylist no longer decides on its own: a file that
    // renders no page is refused whether or not somebody remembered to list it.
    if (strpos(file_get_contents($path), 'echoHeader(') === false) { $notPages[$file] = true; continue; }
    $pages[] = $file;
}
sort($pages);
if ($notPages) {
    fwrite(STDERR, "NOT A PAGE, so kept out of the sitemap (no echoHeader() call): "
        . implode(', ', array_keys($notPages)) . "\n"
        . "Add it to \$excluded above with a reason if that is right, or give it a header if it is a page.\n");
}

// --- Parent-site pages -----------------------------------------------------------------------
// English-only, no ?lang= variants. sewslope.php and peakfact.php are here deliberately: ROADMAP
// Task 151 records ~950 impressions at 0.5% CTR for content that already answers the query and
// has no sitemap entry anywhere, because the site has had no sitemap at all.
$parentPages = ['/', '/sewslope.php', '/peakfact.php'];

// --- Emit ------------------------------------------------------------------------------------
$today = gmdate('Y-m-d');
$xml  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
$xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($parentPages as $p) {
    $xml .= "  <url>\n    <loc>" . htmlspecialchars($origin . $p, ENT_XML1) . "</loc>\n"
          . "    <lastmod>$today</lastmod>\n  </url>\n";
}

$count = count($parentPages);
foreach ($pages as $file) {
    // Match ec_canonical_url(): /index.php collapses to the directory URL.
    $path = ($file === 'index.php') ? '/engcalcs/' : '/engcalcs/' . $file;
    if (in_array($file, $englishOnly, true)) {
        $xml .= "  <url>\n    <loc>" . htmlspecialchars($origin . $path, ENT_XML1) . "</loc>\n"
              . "    <lastmod>" . gmdate('Y-m-d', filemtime($repoRoot . '/' . $file)) . "</lastmod>\n"
              . "  </url>\n";
        $count++;
        continue;
    }
    foreach ($languages as $lang) {
        $loc = $origin . $path . '?lang=' . $lang;
        $xml .= "  <url>\n    <loc>" . htmlspecialchars($loc, ENT_XML1) . "</loc>\n"
              . "    <lastmod>" . gmdate('Y-m-d', filemtime($repoRoot . '/' . $file)) . "</lastmod>\n"
              . "  </url>\n";
        $count++;
    }
}
$xml .= "</urlset>\n";

if ($toStdout) {
    echo $xml;
    exit(0);
}

file_put_contents($outFile, $xml);
printf("Wrote %s\n  %d URLs (%d pages x %d languages, plus %d parent-site pages)\n",
    $outFile, $count, count($pages), count($languages), count($parentPages));
echo "  Excluded: " . implode(', ', array_keys($excluded)) . "\n";
echo "\nNot done by this script (parent-site root, one-time):\n";
echo "  robots.txt needs the line:  Sitemap: $origin/sitemap.xml\n";
echo "  and the sitemap should be submitted once in Google Search Console.\n";
