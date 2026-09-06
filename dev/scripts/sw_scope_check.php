<?php
/**
 * sw_scope_check.php -- the service worker's scope covers every path the suite is served at.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 479, and it is one of Task 322's unwritten rules -- the rule
 * "a worker's scope must cover every path the suite is served at" was in no document at all).
 *
 * A service worker controls only pages underneath its own SCOPE. The suite is served at more than
 * one path -- '/engcalcs/' on hawsedc.com and '/app' on librewaternet.org -- and a worker scoped
 * to the first is simply deaf to the second. **There is no error, no warning and no symptom.**
 * The page renders identically, every asset resolves, and the visitor's offline suite is gone.
 * Tom found this by reading, not by using the site, which is exactly the point: nothing on the
 * page notices the path, so this would have shipped unnoticed and stayed shipped.
 *
 * FOUR FACTS HAVE TO AGREE, and they live in three files that nothing tied together before:
 *
 *   1. `ecSwMounts()` declares the paths.                       lib/ServiceWorker.lib.php
 *   2. `ecSwScope()` derives a scope covering all of them.      lib/ServiceWorker.lib.php
 *   3. `sw.php` sends `Service-Worker-Allowed:` with that scope. sw.php
 *   4. The page REGISTERS with that scope.                       lib/HeadersFooters.lib.php
 *
 * Break any one and the others still look right. Drop the header and every registration is
 * rejected, so the suite loses offline support everywhere rather than at one mount -- a bigger
 * failure than the one being fixed, which is why the page falls back to the narrow scope and why
 * this check reads the header rather than trusting that it is sent.
 *
 * IT READS RENDERED OUTPUT, NOT SOURCE, for the two halves that ship: the registration comes out
 * of a real rendered page, and the routing out of sw.php's own emitted text. The header is the
 * exception and has to be -- `header()` is a no-op on the CLI and `headers_list()` stays empty --
 * so that one leg reads sw.php's source for the call. It is asserted as a CALL DERIVED FROM
 * ecSwScope(), never as a literal string: a hardcoded 'Service-Worker-Allowed: /' would pass a
 * string comparison and then be wrong the day a mount is added, which is this defect again.
 *
 * Usage:
 *   php dev/scripts/sw_scope_check.php
 *
 * Exit 0 = every mount is controllable and answered. Exit 1 = one is not.
 */

/**
 * Findings, pure so the selftest can drive it. Empty means everything agrees.
 *
 * @param array<string,string> $mounts  ecSwMounts(): prefix => why.
 * @param string $scope                 ecSwScope().
 * @param string $swSource              The SOURCE of sw.php (for the header call).
 * @param string $swText                The worker sw.php EMITS (for the routing).
 * @param string $pageHtml              A rendered page (for the registration).
 * @param string $base                  EC_SW_BASE, the directory the worker script sits in.
 * @return array<int,string>
 */
function ecSwScopeFindings(array $mounts, string $scope, string $swSource, string $swText, string $pageHtml, string $base): array
{
    $out = [];

    // 0. A mount is a root-anchored path prefix with a trailing slash. Anything else makes
    //    startsWith() in the worker mean something the author did not intend.
    foreach ($mounts as $mount => $why) {
        if ($mount === '' || $mount[0] !== '/' || substr($mount, -1) !== '/') {
            $out[] = "ecSwMounts() declares '$mount', which is not a root-anchored path prefix "
                . "ending in '/'. The worker matches a mount with startsWith(), so a mount "
                . "written any other way silently matches more or less than it names.";
        }
        if (trim($why) === '') {
            $out[] = "the mount '$mount' is declared with no reason. Every mount widens the scope "
                . 'of a worker that controls somebody else\'s pages; say what it is for.';
        }
    }

    // 1. The scope actually covers every mount. This is the defect itself.
    foreach (array_keys($mounts) as $mount) {
        if (strpos($mount, $scope) !== 0) {
            $out[] = "the worker's scope '$scope' does not cover the declared mount '$mount'. A "
                . 'worker cannot control a page outside its scope, so a visitor arriving there '
                . 'gets no offline suite -- and no error, which is why this is a check.';
        }
    }

    // 2. sw.php sends the header, derived rather than typed.
    if (!preg_match('/header\(\s*[\'"]Service-Worker-Allowed:\s*[\'"]\s*\.\s*ecSwScope\(\)/', $swSource)) {
        $literal = preg_match('/Service-Worker-Allowed/', $swSource);
        $out[] = $literal
            ? 'sw.php names Service-Worker-Allowed but does not build it from ecSwScope(). A '
                . 'literal value passes today and is wrong the day a mount is added, which is the '
                . 'defect this check exists for. Write it as ecSwScope().'
            : 'sw.php sends no Service-Worker-Allowed header. A registration asking for anything '
                . "wider than '$base' -- the directory this script sits in -- is then REJECTED, so "
                . 'the suite loses its service worker everywhere, not just at the new mount.';
    }

    // 3. The rendered page registers with exactly that scope.
    if (!preg_match_all('/navigator\.serviceWorker\.register\(\s*([\'"])(.*?)\1\s*,\s*\{\s*scope:\s*([^}]*?)\s*\}/s', $pageHtml, $regs, PREG_SET_ORDER)) {
        $out[] = 'the rendered page contains no serviceWorker.register(..., { scope: ... }) call '
            . 'this check can read. Either registration moved -- update this check with it -- or '
            . 'the suite has no service worker, which is a bigger finding than anything else here.';
    } else {
        $scriptOk = false;
        $wideOk = false;
        foreach ($regs as $reg) {
            if (strpos($reg[2], $base) === 0) { $scriptOk = true; }
            $asked = trim($reg[3], " \t\n'\"");
            if ($asked === $scope || $asked === 'ecSwScope') { $wideOk = true; }
        }
        if (!$scriptOk) {
            $out[] = "the page registers a worker script that is not under '$base'. The precache "
                . 'is built from filemtime()s of files in this tree; a worker served from anywhere '
                . 'else is not the one this repository generates.';
        }
        if (!$wideOk) {
            $out[] = "the page never asks for the derived scope '$scope'. ecSwScope() is the one "
                . 'place the mount list turns into a scope; a registration that hardcodes a '
                . 'narrower one is the silent failure with the fix already sitting beside it.';
        }
    }

    // 4. The emitted worker routes every mount. A worker may CONTROL a page and still answer none
    //    of its requests, which looks identical from outside and is just as offline-less.
    if (!preg_match('/const\s+APP_MOUNTS\s*=\s*(\[.*?\n\]);/s', $swText, $m)) {
        $out[] = 'the emitted worker declares no APP_MOUNTS array. Controlling a page and '
            . 'answering its requests are different things: without this list the fetch handler '
            . 'has no way to know which requests are the suite\'s.';
    } else {
        $routed = json_decode($m[1], true);
        $routed = is_array($routed) ? $routed : [];
        foreach (array_keys($mounts) as $mount) {
            if (!in_array($mount, $routed, true)) {
                $out[] = "the emitted worker does not route the declared mount '$mount'. It would "
                    . 'control those pages and then pass every request straight through, so the '
                    . 'visitor is offline-less exactly as if the scope were still too narrow.';
            }
        }
        foreach ($routed as $mount) {
            if (!isset($mounts[$mount])) {
                $out[] = "the emitted worker routes '$mount', which ecSwMounts() does not declare. "
                    . 'The declaration is the one place a mount is explained; an undeclared one '
                    . 'is a path somebody widened the worker over without saying why.';
            }
        }
    }

    // 5. The fetch handler gates on the list rather than on a hardcoded prefix -- the shape the
    //    routing had before Task 479, and the shape it will drift back to.
    if (strpos($swText, 'inScope(') === false) {
        $out[] = 'the emitted worker no longer gates its fetch routes on inScope(). A wide scope '
            . "means this worker controls pages that are not ours -- the parent site's, on both "
            . 'domains -- and every route must pass those straight to the network.';
    }

    return $out;
}

if (defined('SW_SCOPE_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
require_once($root . '/lib/ServiceWorker.lib.php');

// The worker exactly as a browser gets it. header() is a no-op on the CLI and sw.php deliberately
// does not bootstrap lib/base.inc.php, so this is safe in-process.
ob_start();
require $root . '/sw.php';
$swText = (string) ob_get_clean();

$swSource = (string) file_get_contents($root . '/sw.php');

// A REAL page, one page per process (dev/scripts/render_page.php's whole reason for existing).
$pageHtml = (string) shell_exec('php ' . escapeshellarg(__DIR__ . '/render_page.php') . ' index.php 2>/dev/null');

$problems = ecSwScopeFindings(ecSwMounts(), ecSwScope(), $swSource, $swText, $pageHtml, EC_SW_BASE);

if ($problems) {
    echo 'Service worker scope: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "The mount list is lib/ServiceWorker.lib.php's ecSwMounts(). Adding a path the suite is\n";
    echo "served at means adding it there -- the scope, the header and the fetch routing all\n";
    echo "derive from it, and this check is what proves they still do.\n";
    exit(1);
}

$n = count(ecSwMounts());
echo 'Service worker scope: ' . ecSwScope() . " covers and routes all $n declared mount(s) (";
echo implode(', ', array_keys(ecSwMounts())) . "); Service-Worker-Allowed is derived, not typed.\n";
exit(0);
