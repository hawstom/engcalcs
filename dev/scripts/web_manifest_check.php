<?php
/**
 * web_manifest_check.php -- the web app manifest agrees with the suite that links it.
 * BLOCKING, with one declared RATCHET named below.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * Every page of the suite emits three references to the install identity -- `<link rel="manifest">`,
 * `<meta name="theme-color">` and `<link rel="apple-touch-icon">` -- which is 84 references across
 * 28 rendered pages. **`manifest.json` itself is read by NOTHING in this repository.** Not a check,
 * not a harness, not a script: `grep -r manifest.json` finds the service worker's own manifest and
 * the vendor manifest and never this file. It has been shipped, unparsed and uncompared, since the
 * day it was written.
 *
 * WHAT DEPENDS ON IT, AND WHY EVERY FAILURE IS SILENT:
 *   - A **malformed** manifest is ignored whole. The pages render, the app is simply not
 *     installable, and no browser says so anywhere a developer looks.
 *   - An **icon that is not there**, or is not the size it says, is a blank or a smeared icon on
 *     somebody's home screen -- a place no one on this side of the wire ever looks.
 *   - A `start_url` outside `scope` is a manifest error the whole document ignores.
 *   - A **theme_color** that has drifted from the `<meta name="theme-color">` gives the installed
 *     app a different browser chrome from the tab, which is only visible with the two side by side.
 *
 * THE ONE FINDING, AND WHY IT IS A RATCHET RATHER THAN A REPAIR. The suite is served at two mounts
 * (`ecSwMounts()`: `/engcalcs/` and `/app/`, Task 479) and this manifest's scope is `/engcalcs/`. A
 * manifest whose scope does not contain the document that links it is INVALID FOR THAT DOCUMENT and
 * is dropped, so librewaternet.org/app is not installable at all -- the same shape as the service
 * worker defect Task 479 fixed, in the file that fix did not read. **Widening the scope to `/` is
 * not a mechanical edit**: the service worker could take a `/` scope because every route is gated
 * on `inScope()`, whereas a manifest scope of `/` claims the whole origin for the installed app
 * window, including the parent site's pages. That is a product decision and it is Tom's. So the
 * uncovered mount is DECLARED, with its reason, and a SECOND one fails the build.
 *
 * Usage:
 *   php dev/scripts/web_manifest_check.php
 *
 * Exit 0 = the manifest and the pages agree. Exit 1 = they do not.
 */

/**
 * Mounts the manifest's scope does not cover, declared with the reason each is tolerated.
 *
 * This is the ratchet. A mount here is a decision somebody made and wrote down; a mount NOT here
 * fails, which is the whole point -- adding a third mount must be a conversation and not a
 * silence.
 *
 * @return array<string,string> mount prefix => why the manifest does not cover it yet
 */
function ecManifestUncoveredMounts(): array
{
    return [
        '/app/' => 'librewaternet.org/app is a rewrite onto Looped-Network.php. Covering it means '
            . 'a manifest scope of "/", which claims the entire origin for the installed app '
            . 'window -- the parent site included. The service worker could widen because every '
            . 'route of it is gated on inScope(); a manifest has no such gate, so this is a '
            . 'product decision and not a mechanical edit. Until it is made, /app is a page that '
            . 'works and is not installable.',
    ];
}

/**
 * The findings, pure so the selftest can drive it with fixtures.
 *
 * @param string               $json     manifest.json's bytes
 * @param array<string,int[]>  $files    icon path relative to the manifest => [width, height], or
 *                                       [] when the file is not there / has no pixel size
 * @param array<string,string> $emitted  what the pages emit: manifest href, theme-color, touch icon
 * @param array<string,string> $mounts   ecSwMounts()
 * @return array<int,string>
 */
function ecWebManifestFindings(string $json, array $files, array $emitted, array $mounts): array
{
    $out = [];
    $data = json_decode($json, true);
    if (!is_array($data)) {
        return ['manifest.json is not valid JSON (' . json_last_error_msg() . '). A browser drops a '
            . 'malformed manifest whole: the pages render, the app is not installable, and nothing '
            . 'anywhere says so. Fix the JSON.'];
    }

    foreach (['name', 'short_name', 'start_url', 'scope', 'display', 'icons'] as $req) {
        if (!isset($data[$req]) || $data[$req] === '' || $data[$req] === []) {
            $out[] = "manifest.json has no \"$req\". It is one of the members an install prompt "
                . 'needs, and without it the prompt is simply never offered -- there is no error '
                . 'and no warning to read.';
        }
    }

    $scope = isset($data['scope']) ? (string) $data['scope'] : '';
    $start = isset($data['start_url']) ? (string) $data['start_url'] : '';
    if ($scope !== '' && $start !== '' && strncmp($start, $scope, strlen($scope)) !== 0) {
        $out[] = "manifest.json's start_url \"$start\" is outside its scope \"$scope\". That is a "
            . 'manifest error and the document ignores the whole file, so nothing about the install '
            . 'works rather than just the start URL. Move the start_url under the scope.';
    }

    // Icons: the src must be a real file, and its real pixel size must be the declared one.
    if (isset($data['icons']) && is_array($data['icons'])) {
        foreach ($data['icons'] as $i => $icon) {
            $src = isset($icon['src']) ? (string) $icon['src'] : '';
            if ($src === '') {
                $out[] = "manifest.json icon $i has no src.";
                continue;
            }
            if (!array_key_exists($src, $files)) {
                $out[] = "manifest.json states icon \"$src\" and there is no such file. The install "
                    . 'shows a blank or a generated icon on somebody\'s home screen, which is a '
                    . 'place nobody on this side ever looks. Add the file or fix the path.';
                continue;
            }
            $sizes = isset($icon['sizes']) ? (string) $icon['sizes'] : '';
            $real = $files[$src];
            if ($sizes === '' || strtolower($sizes) === 'any' || !$real) continue;
            foreach (preg_split('/\s+/', trim($sizes)) as $spec) {
                if (!preg_match('/^(\d+)x(\d+)$/i', $spec, $m)) continue;
                if ((int) $m[1] !== $real[0] || (int) $m[2] !== $real[1]) {
                    $out[] = "manifest.json says \"$src\" is $spec and the file is "
                        . $real[0] . 'x' . $real[1] . '. A browser trusts the declaration when it '
                        . 'picks an icon, so the wrong one is chosen and then rescaled -- a smeared '
                        . 'icon, never an error. Fix the number or the file.';
                }
            }
        }
    }

    // The pages and the manifest must agree about the colour, and the manifest must be where the
    // pages say it is.
    if (isset($emitted['manifest_href']) && $emitted['manifest_href'] !== '' && !isset($files['@self:' . $emitted['manifest_href']])) {
        $out[] = 'the pages link ' . $emitted['manifest_href'] . ' and no such file is served. The '
            . 'link 404s in silence: no install prompt, nothing in the page, nothing in the log '
            . 'anybody reads.';
    }
    if (isset($emitted['theme_color']) && isset($data['theme_color'])
        && strcasecmp((string) $emitted['theme_color'], (string) $data['theme_color']) !== 0) {
        $out[] = 'the pages emit <meta name="theme-color" content="' . $emitted['theme_color']
            . '"> and manifest.json says theme_color "' . $data['theme_color'] . '". The installed '
            . 'app then paints a different browser chrome from the tab, which is only visible with '
            . 'the two side by side. Make them the same value.';
    }
    if (isset($emitted['touch_icon']) && $emitted['touch_icon'] !== '' && !isset($files['@self:' . $emitted['touch_icon']])) {
        $out[] = 'the pages emit <link rel="apple-touch-icon" href="' . $emitted['touch_icon']
            . '"> and there is no such file. iOS then screenshots the page for the home screen '
            . 'instead, which looks like a choice somebody made.';
    }

    // The mounts. Declared exceptions carry their reason; anything else is a finding.
    $declared = ecManifestUncoveredMounts();
    foreach ($mounts as $mount => $why) {
        if ($scope !== '' && strncmp($mount, $scope, strlen($scope)) === 0) continue;
        if (isset($declared[$mount])) continue;
        $out[] = "the suite is served at \"$mount\" ($why) and manifest.json's scope is \"$scope\", "
            . 'which does not contain it. A manifest whose scope does not contain the document that '
            . 'links it is invalid FOR THAT DOCUMENT and is dropped whole, so the page at that '
            . 'mount is not installable at all and nothing says so. Widen the scope, serve a second '
            . 'manifest, or declare the mount in ecManifestUncoveredMounts() with the reason.';
    }

    return $out;
}

if (defined('WEB_MANIFEST_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
require_once($root . '/lib/ServiceWorker.lib.php');

$manifestPath = $root . '/manifest.json';
if (!is_file($manifestPath)) {
    fwrite(STDERR, "web_manifest_check: there is no manifest.json at the repository root, and every\n");
    fwrite(STDERR, "page links one. Either restore the file or stop emitting the link.\n");
    exit(1);
}
$json = (string) file_get_contents($manifestPath);

// Icon sizes are measured, never trusted: the declaration is the thing being checked.
$files = [];
$data = json_decode($json, true);
if (is_array($data) && isset($data['icons']) && is_array($data['icons'])) {
    foreach ($data['icons'] as $icon) {
        $src = isset($icon['src']) ? (string) $icon['src'] : '';
        if ($src === '') continue;
        $abs = $root . '/' . ltrim($src, '/');
        if (!is_file($abs)) continue;
        $size = @getimagesize($abs);
        $files[$src] = $size ? [(int) $size[0], (int) $size[1]] : [];
    }
}

// What the pages actually emit. Rendered, one subprocess per page, because these three lines come
// out of echoHTMLHead() and a page that does not call it emits none of them.
$emitted = [];
$pagesRead = 0;
$empty = [];
$disagree = [];
foreach (glob($root . '/*.php') ?: [] as $file) {
    $name = basename($file);
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
         . ' ' . escapeshellarg($name) . ' 2>/dev/null';
    $html = (string) shell_exec($cmd);
    if (trim($html) === '') { $empty[] = $name; continue; }
    $pagesRead++;
    $seen = [];
    if (preg_match('/<link[^>]*rel="manifest"[^>]*href="([^"]+)"/i', $html, $m)) $seen['manifest_href'] = $m[1];
    if (preg_match('/<meta[^>]*name="theme-color"[^>]*content="([^"]+)"/i', $html, $m)) $seen['theme_color'] = $m[1];
    if (preg_match('/<link[^>]*rel="apple-touch-icon"[^>]*href="([^"]+)"/i', $html, $m)) $seen['touch_icon'] = $m[1];
    foreach ($seen as $k => $v) {
        if (!isset($emitted[$k])) { $emitted[$k] = $v; continue; }
        if ($emitted[$k] !== $v) $disagree[$k] = true;
    }
}

// A page emitting a DIFFERENT value from its neighbours is its own finding: these three come from
// one function, so a second value means somebody wrote a second copy.
$extra = [];
foreach (array_keys($disagree) as $k) {
    $extra[] = "the pages do not agree about \"$k\" -- more than one value is emitted across the "
        . 'suite. All three of these come from echoHTMLHead(), so a second value means a second '
        . 'copy of the markup somewhere. Find it and delete it.';
}

// Existence of the linked files, keyed apart from the icon sizes so the pure function needs no
// filesystem of its own.
foreach (['manifest_href', 'touch_icon'] as $k) {
    if (!isset($emitted[$k])) continue;
    $path = $emitted[$k];
    $rel = preg_replace('~^' . preg_quote(rtrim(EC_SW_BASE, '/'), '~') . '/~', '', $path);
    if (is_file($root . '/' . ltrim((string) $rel, '/'))) $files['@self:' . $path] = [];
}

$problems = array_merge(ecWebManifestFindings($json, $files, $emitted, ecSwMounts()), $extra);

if ($problems) {
    echo 'Web app manifest: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "Nothing here has a symptom a person using the site can see. That is why it is a check.\n";
    exit(1);
}

$icons = is_array($data) && isset($data['icons']) ? count($data['icons']) : 0;
$declared = ecManifestUncoveredMounts();
printf(
    "Web app manifest OK -- %d icon(s) measured against their declared sizes, start_url inside\n"
    . "scope, and %d rendered page(s) agreeing with it about the manifest URL, the theme colour and\n"
    . "the touch icon.\n",
    $icons, $pagesRead
);
printf("Mounts: %d declared in ecSwMounts(), %d not covered by the manifest scope and declared\n"
    . "here with the reason (%s).\n", count(ecSwMounts()), count($declared), implode(', ', array_keys($declared)));
if ($empty) {
    echo 'Rendered empty and not read, ' . count($empty) . ': ' . implode(', ', $empty) . ".\n";
}
exit(0);
