<?php
/**
 * WebManifest.lib.php -- the web app manifest, GENERATED per mount so its scope is the one the
 * visitor is standing in. ROADMAP Task 609.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS NOT A STATIC manifest.json ANY MORE (2026-09-08). The suite is served at more than
 * one path -- ecSwMounts(): '/engcalcs/' and '/app/' -- and a manifest has exactly ONE scope. A
 * manifest whose scope does not contain the document that links it is dropped WHOLE for that
 * document: no error, no warning, and the page at librewaternet.org/app was simply never
 * installable. The service worker solved the same problem by widening its scope to '/' behind an
 * inScope() gate on every route; a manifest has no such gate. Its scope is what the INSTALLED APP
 * WINDOW claims, so '/' would keep every navigation on the origin inside the app -- the parent
 * site on hawsedc.com, the marketing site on librewaternet.org. Widening is therefore refused.
 *
 * ONE MANIFEST PER MOUNT INSTEAD, from one generator. A page links manifest.php with the mount it
 * was reached through, and the manifest it gets back has that mount as its scope and its
 * start_url. Two mounts are two installable apps on one origin -- each `id` is its mount -- which
 * is exactly what two front doors are. A third mount needs no edit here: it is declared in
 * ecSwMounts() and the manifest for it exists the moment it is.
 *
 * WHICH MOUNT A PAGE IS UNDER IS A WHITELIST SELECTION, NEVER AN INFERENCE. ecSwMountFor() reads
 * REQUEST_URI, which is client-supplied, and can only ever pick one of the DECLARED mounts;
 * anything else -- a spoofed path, a mount nobody registered -- falls through to EC_SW_BASE, the
 * address every absolute path in the source already names. That is the same argument
 * lib/config.inc.php makes for the CANONICAL_ORIGIN whitelist, and it is the difference between
 * this and reversing the rewrite: no input can make a page link a scope we did not declare. The
 * canonical URL deliberately does NOT read REQUEST_URI (lib/Canonical.lib.php), because a
 * canonical is a claim about which address is the page's own and a manifest is a claim about
 * which address the visitor is standing at. The first is declared; the second is selected.
 *
 * dev/scripts/web_manifest_check.php renders every page under every mount and holds the manifest
 * each one links to the mount it was rendered under.
 */
require_once(__DIR__ . '/ServiceWorker.lib.php');

/** Where the generator answers, whatever mount the page is served at -- every asset lives here. */
if (!defined('EC_MANIFEST_PATH')) define('EC_MANIFEST_PATH', EC_SW_BASE . 'manifest.php');

/**
 * The mount a request was served through, chosen from ecSwMounts() and never invented.
 *
 * The longest declared mount that prefixes the request PATH wins; no match means EC_SW_BASE. The
 * query string is dropped first, and a bare '/app' (no slash) is not under '/app/', which is
 * correct: the server 301s it to '/app/' before any page is served, and a manifest scope is a
 * plain string prefix, so the mount with the slash is the only one that does not also claim
 * '/apple-anything'.
 *
 * @param string $requestUri  $_SERVER['REQUEST_URI'], or ''.
 * @return string             one of array_keys(ecSwMounts()).
 */
function ecSwMountFor($requestUri) {
    $path = (string)$requestUri;
    $q = strpos($path, '?');
    if ($q !== false) { $path = substr($path, 0, $q); }
    $best = EC_SW_BASE;
    $bestLen = 0;
    foreach (array_keys(ecSwMounts()) as $mount) {
        $len = strlen($mount);
        if ($len > $bestLen && strncmp($path, $mount, $len) === 0) {
            $best = $mount;
            $bestLen = $len;
        }
    }
    return $best;
}

/**
 * The manifest URL a page links for a mount. The base mount gets the bare path so the URL a
 * returning visitor already has keeps working; every other mount names itself.
 *
 * @param string $mount  one of array_keys(ecSwMounts()).
 * @return string        root-anchored URL.
 */
function ecWebManifestHref($mount) {
    $mount = ecWebManifestMount($mount);
    return $mount === EC_SW_BASE ? EC_MANIFEST_PATH : EC_MANIFEST_PATH . '?mount=' . str_replace('%2F', '/', rawurlencode($mount));
}

/**
 * A mount, or EC_SW_BASE when it is not one we declared. The ?mount= parameter of manifest.php
 * goes through here, so a request for a scope nobody registered gets the base manifest and not a
 * manifest claiming an arbitrary path.
 */
function ecWebManifestMount($mount) {
    $mounts = ecSwMounts();
    return isset($mounts[(string)$mount]) ? (string)$mount : EC_SW_BASE;
}

/**
 * The manifest for one mount, as the array json_encode() will serialise.
 *
 * `scope` IS the mount, exactly -- with its trailing slash, because scope is compared as a string
 * prefix. `start_url` is the suite front page on the base mount and the mount itself elsewhere:
 * '/app/' is a rewrite onto one page, and that page is the app. `id` is the mount so that the
 * installed app keeps its identity if a start_url ever moves. Icons are relative to the manifest
 * URL, which is under EC_SW_BASE on every mount, so they resolve without naming it.
 *
 * `theme_color` must match the <meta name="theme-color"> lib/HeadersFooters.lib.php emits;
 * web_manifest_check.php compares the two.
 *
 * @param string $mount  one of array_keys(ecSwMounts()); anything else is treated as EC_SW_BASE.
 * @return array<string,mixed>
 */
function ecWebManifest($mount) {
    $mount = ecWebManifestMount($mount);
    return array(
        'id'               => $mount,
        'name'             => 'EngCalcs — Hydraulic Engineering Calculators',
        'short_name'       => 'EngCalcs',
        'description'      => 'Free open-source hydraulic engineering calculators for field and office use.',
        'start_url'        => $mount === EC_SW_BASE ? EC_SW_BASE . 'index.php' : $mount,
        'scope'            => $mount,
        'display'          => 'standalone',
        'background_color' => '#ffffff',
        'theme_color'      => '#1a6faf',
        'lang'             => 'en',
        'icons'            => array(
            array('src' => 'icons/icon-192.png', 'sizes' => '192x192', 'type' => 'image/png', 'purpose' => 'any'),
            array('src' => 'icons/icon-512.png', 'sizes' => '512x512', 'type' => 'image/png', 'purpose' => 'any maskable'),
            array('src' => 'icons/icon.svg', 'sizes' => 'any', 'type' => 'image/svg+xml', 'purpose' => 'any maskable'),
        ),
    );
}

/** The manifest for one mount as the bytes the endpoint serves. */
function ecWebManifestJson($mount) {
    return json_encode(ecWebManifest($mount), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
}
