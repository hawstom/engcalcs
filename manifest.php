<?php
/**
 * manifest.php -- the web app manifest, GENERATED so its scope is the mount the linking page was
 * served at. ROADMAP Task 609. Everything about WHAT it says lives in lib/WebManifest.lib.php;
 * this file is the endpoint only.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * Linked as '/engcalcs/manifest.php' by lib/HeadersFooters.lib.php, with '?mount=<mount>' when the
 * page is served at a mount other than the base one. The parameter selects among the mounts
 * ecSwMounts() declares and nothing else: an unknown value gets the base manifest, so no request
 * can obtain a manifest claiming a scope we never declared.
 *
 * It deliberately does NOT load lib/base.inc.php, for the same reason sw.php does not: a manifest
 * needs no language, no units and no consent state, and a bootstrap here would be a place to
 * touch a visitor's storage for nothing.
 */
require_once(__DIR__ . '/lib/WebManifest.lib.php');
$ecManifestMount = ecWebManifestMount(isset($_GET['mount']) ? (string)$_GET['mount'] : EC_SW_BASE);
header('Content-Type: application/manifest+json; charset=utf-8');
// A browser re-reads the manifest on its own schedule; an intermediary must not pin one mount's
// scope onto another mount's URL, and the two differ only by query string.
header('Cache-Control: no-cache');
echo ecWebManifestJson($ecManifestMount);
