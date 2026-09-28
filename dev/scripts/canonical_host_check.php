<?php
/**
 * canonical_host_check.php -- the map application answers for the HOST serving it, from a
 * declared whitelist, and a host nobody declared gets librewaternet.org. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (Task 697, Option B1, 2026-09-27). Looped-Network.php is served at
 * librewaternet.org/app/ and at epanet-plus-plus.org/app/, and each is a front door that nominates
 * itself and wears its own name. Every one of the five canonical readers, and the brand, now
 * depends on the serving host -- which is the one input a client controls. So this renders the
 * REAL page, one process per host (render_page.php seeds HTTP_HOST), and reads what came out:
 *
 *   1. On each declared host: <link rel="canonical">, EVERY hreflang alternate, og:url and og:image
 *      name that host's declared origin, and the About box and Help > Welcome page name its brand.
 *   2. A www., mixed-case, ported spelling of a declared host is the same host.
 *   3. A SPOOFED host, and hawsedc.com (which only ever redirects to the app), get
 *      librewaternet.org and LibreWaterNet.org -- the answer from before Task 697.
 *   4. A calculator served on epanet-plus-plus.org still nominates hawsedc.com: the per-host
 *      declaration is per PAGE, and the calculators are hawsedc.com's (Tom, 2026-09-17).
 *   5. The script-path redirect stays on its own host: epanet-plus-plus.org's
 *      /engcalcs/Looped-Network.php moves to epanet-plus-plus.org/app/, never across to
 *      librewaternet.org; and an undeclared host is never moved at all.
 *
 *   php dev/scripts/canonical_host_check.php
 */

$root = dirname(__DIR__, 2);
require_once $root . '/lib/Canonical.lib.php';
$fail = 0;
$pass = 0;
function hc_ok($cond, $what, $detail = '') {
    global $fail, $pass;
    if ($cond) { $pass++; return; }
    $fail++;
    echo "  FAIL  $what" . ($detail !== '' ? "\n        $detail" : '') . "\n";
}

function hc_render($page, $host, $appEnv = '') {
    global $root;
    $prefix = $appEnv !== '' ? 'APP_ENV=' . escapeshellarg($appEnv) . ' ' : '';
    $cmd = $prefix . 'php ' . escapeshellarg($root . '/dev/scripts/render_page.php') . ' ' . escapeshellarg($page)
         . ' ' . escapeshellarg('--host=' . $host) . ' 2>/dev/null';
    return (string)shell_exec($cmd);
}

$cases = array(
    // host as the client sent it        => expected origin,                  expected brand
    'librewaternet.org'                   => array('https://librewaternet.org',    'LibreWaterNet.org'),
    'epanet-plus-plus.org'                => array('https://epanet-plus-plus.org', 'EPANET++'),
    'WWW.Epanet-Plus-Plus.org:443'        => array('https://epanet-plus-plus.org', 'EPANET++'),
    'evil.example'                        => array('https://librewaternet.org',    'LibreWaterNet.org'),
    'epanet-plus-plus.org.evil.example'   => array('https://librewaternet.org',    'LibreWaterNet.org'),
    'hawsedc.com'                         => array('https://librewaternet.org',    'LibreWaterNet.org'),
);

foreach ($cases as $host => $want) {
    list($origin, $brand) = $want;
    $html = hc_render('Looped-Network.php', $host);
    $tag = "Looped-Network.php on Host: $host";
    if (strlen($html) < 10000) { hc_ok(false, "$tag rendered nothing (" . strlen($html) . " bytes)"); continue; }

    $canon = preg_match('/<link rel="canonical" href="([^"]*)"/', $html, $m) ? $m[1] : '';
    hc_ok($canon === $origin . '/app/?lang=en', "$tag: canonical", "got '$canon'");

    preg_match_all('/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)"/', $html, $alts, PREG_SET_ORDER);
    hc_ok(count($alts) >= 27, "$tag: at least 27 hreflang alternates", 'got ' . count($alts));
    foreach ($alts as $a) {
        hc_ok(strpos(html_entity_decode($a[2]), $origin . '/app/?lang=') === 0,
            "$tag: hreflang {$a[1]} on the declared origin", "got '{$a[2]}'");
    }

    $ogUrl = preg_match('/property="og:url" content="([^"]*)"/', $html, $m) ? $m[1] : '';
    hc_ok($ogUrl === $origin . '/app/?lang=en', "$tag: og:url", "got '$ogUrl'");
    $ogImg = preg_match('/property="og:image" content="([^"]*)"/', $html, $m) ? $m[1] : '';
    hc_ok(strpos($ogImg, $origin . '/engcalcs/') === 0, "$tag: og:image", "got '$ogImg'");

    $about = preg_match('/class="lpn-about-name">.*?<a href="([^"]*)"[^>]*>([^<]*)<\/a>/s', $html, $m) ? $m : array('', '', '');
    hc_ok(html_entity_decode($about[2]) === $brand, "$tag: About box name", "got '{$about[2]}'");
    hc_ok($about[1] === $origin . '/', "$tag: About box name links home", "got '{$about[1]}'");
    $site = preg_match('/EngCalcs\.lwnSiteUrl = ("[^"]*")/', $html, $m) ? json_decode($m[1]) : '';
    hc_ok($site === $origin . '/', "$tag: Help > Welcome page", "got '$site'");

    // The other brand must not leak onto this host's page as a visible name.
    $other = $brand === 'EPANET++' ? '>LibreWaterNet.org<' : '>EPANET++<';
    hc_ok(strpos($html, $other) === false, "$tag: never shows the other front door's name '$other'");
}

// 3b. THE DEV-ONLY *.localhost ALIAS (Task 697 follow-up, Tom: "How/where do I look at it?").
// Chrome resolves any *.localhost name to 127.0.0.1 with no hosts-file edit, so in development a
// Host of epanet-plus-plus.localhost must get the EPANET++ brand and canonical exactly as
// epanet-plus-plus.org does -- and, critically, WITHOUT the script-path redirect, because
// epanet-plus-plus.org/app/ is not live yet and that 301 would strand him on a domain that
// doesn't answer.
$devHtml = hc_render('Looped-Network.php', 'epanet-plus-plus.localhost', 'development');
if (strlen($devHtml) < 10000) {
    hc_ok(false, "Looped-Network.php on Host: epanet-plus-plus.localhost (development) rendered nothing ("
        . strlen($devHtml) . ' bytes)');
} else {
    $canon = preg_match('/<link rel="canonical" href="([^"]*)"/', $devHtml, $m) ? $m[1] : '';
    hc_ok($canon === 'https://epanet-plus-plus.org/app/?lang=en',
        'epanet-plus-plus.localhost (development): canonical is the EPANET++ front door', "got '$canon'");
    $about = preg_match('/class="lpn-about-name">.*?<a href="([^"]*)"[^>]*>([^<]*)<\/a>/s', $devHtml, $m) ? $m : array('', '', '');
    hc_ok(html_entity_decode($about[2]) === 'EPANET++',
        'epanet-plus-plus.localhost (development): About box says EPANET++', "got '{$about[2]}'");
    hc_ok(strpos($devHtml, 'http-equiv="refresh"') === false
        && strpos($devHtml, "Location:") === false,
        'epanet-plus-plus.localhost (development): page body carries no redirect marker');
}
// The header check that matters most: no Location, verified with a real request further down by
// the shell harness -- here, purely, via ecCanonicalRedirectTarget() with the host UNDECLARED
// (as EC_CANONICAL_HOST_DECLARED must be for this alias -- see lib/config.inc.php).
hc_ok(ecCanonicalRedirectTarget('/engcalcs/Looped-Network.php', '/engcalcs/Looped-Network.php', false, 'https://hawsedc.com', 'epanet-plus-plus.org') === null,
    'the dev alias host is UNDECLARED, so the script-path redirect never fires for it');

// 3c. With development OFF, the same *.localhost name is undeclared and gets nothing -- it must
// never leak the EPANET++ brand outside DEBUG_MODE, and never on production.
$prodHtml = hc_render('Looped-Network.php', 'epanet-plus-plus.localhost');
if (strlen($prodHtml) < 10000) {
    hc_ok(false, 'Looped-Network.php on Host: epanet-plus-plus.localhost (no APP_ENV) rendered nothing ('
        . strlen($prodHtml) . ' bytes)');
} else {
    $canon = preg_match('/<link rel="canonical" href="([^"]*)"/', $prodHtml, $m) ? $m[1] : '';
    hc_ok($canon === 'https://librewaternet.org/app/?lang=en',
        'epanet-plus-plus.localhost (no development): falls through to librewaternet.org', "got '$canon'");
    $about = preg_match('/class="lpn-about-name">.*?<a href="([^"]*)"[^>]*>([^<]*)<\/a>/s', $prodHtml, $m) ? $m : array('', '', '');
    hc_ok(html_entity_decode($about[2]) === 'LibreWaterNet.org',
        'epanet-plus-plus.localhost (no development): never shows EPANET++', "got '{$about[2]}'");
}

// 4. A calculator on the new host is still hawsedc.com's.
$calc = hc_render('Manning-Pipe-Flow.php', 'epanet-plus-plus.org');
$canon = preg_match('/<link rel="canonical" href="([^"]*)"/', $calc, $m) ? $m[1] : '';
hc_ok(strpos($canon, 'https://hawsedc.com/engcalcs/Manning-Pipe-Flow.php?lang=') === 0,
    'Manning-Pipe-Flow.php on epanet-plus-plus.org nominates hawsedc.com', "got '$canon'");

// 5. The redirect, pure: ecCanonicalRedirectTarget(script, uri, declared, CANONICAL_ORIGIN, host).
$s = '/engcalcs/Looped-Network.php';
hc_ok(ecCanonicalRedirectTarget($s, $s . '?lang=es', true, 'https://hawsedc.com', 'epanet-plus-plus.org')
    === 'https://epanet-plus-plus.org/app/?lang=es', 'script path on epanet-plus-plus.org moves to its own /app/');
hc_ok(ecCanonicalRedirectTarget($s, '/app/', true, 'https://hawsedc.com', 'epanet-plus-plus.org') === null,
    'epanet-plus-plus.org/app/ itself is not moved (no loop)');
hc_ok(ecCanonicalRedirectTarget($s, $s, true, 'https://hawsedc.com', 'librewaternet.org')
    === 'https://librewaternet.org/app/', 'script path on librewaternet.org still moves to librewaternet.org/app/');
hc_ok(ecCanonicalRedirectTarget($s, $s, false, 'https://hawsedc.com', '') === null,
    'an undeclared host is never moved');
// And the lookup itself refuses a host key it was not given by the whitelist.
hc_ok(ecCanonicalOrigin($s, 'https://hawsedc.com', 'evil.example') === 'https://librewaternet.org',
    'ecCanonicalOrigin() with an unknown host answers librewaternet.org');

if ($fail) {
    echo "\nFAIL: $fail of " . ($fail + $pass) . " host-canonical assertions\n";
    exit(1);
}
echo "PASS: $pass assertions -- the map application nominates and names the declared front door for "
   . "each host, and a spoofed host gets librewaternet.org.\n";
exit(0);
