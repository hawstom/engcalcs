<?php
/**
 * web_manifest_check.php -- the web app manifest agrees with the suite that links it, on every
 * mount the suite is served at. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * Every page of the suite emits three references to the install identity -- `<link rel="manifest">`,
 * `<meta name="theme-color">` and `<link rel="apple-touch-icon">` -- which is 84 references across
 * 28 rendered pages. Until this check, the manifest itself was read by NOTHING in this repository:
 * not a check, not a harness, not a script. It had shipped, unparsed and uncompared, since the day
 * it was written.
 *
 * WHAT DEPENDS ON IT, AND WHY EVERY FAILURE IS SILENT:
 *   - A **malformed** manifest is ignored whole. The pages render, the app is simply not
 *     installable, and no browser says so anywhere a developer looks.
 *   - An **icon that is not there**, or is not the size it says, is a blank or a smeared icon on
 *     somebody's home screen -- a place no one on this side of the wire ever looks.
 *   - A `start_url` outside `scope` is a manifest error the whole document ignores.
 *   - A **theme_color** that has drifted from the `<meta name="theme-color">` gives the installed
 *     app a different browser chrome from the tab, which is only visible with the two side by side.
 *   - A **scope that does not contain the linking document** drops the manifest for that document.
 *
 * THE MOUNT LEG, AND WHY IT USED TO BE A RATCHET AND IS NOW A RULE (Task 609, closed 2026-09-08).
 * The suite is served at more than one mount (`ecSwMounts()`: `/engcalcs/` and `/app/`, Task 479)
 * and a manifest has exactly ONE scope, so the static manifest.json covered one mount and
 * librewaternet.org/app was not installable at all. Widening the scope to `/` was refused -- that
 * claims the whole origin for the installed app window, the parent site included -- and the
 * uncovered mount was DECLARED here with its reason while a second one failed. The manifest is now
 * GENERATED PER MOUNT (manifest.php, lib/WebManifest.lib.php), so the rule is exact: **for every
 * mount, the pages rendered under it link the manifest for that mount, and that manifest's scope
 * IS the mount** -- byte for byte, trailing slash included, because scope is compared as a plain
 * string prefix and `/app` would also claim `/apple-anything`. Nothing is declared uncovered any
 * more; a third mount is covered the day it is declared in ecSwMounts().
 *
 * AND THE SELECTOR CANNOT BE TALKED INTO AN UNDECLARED SCOPE. ecSwMountFor() reads REQUEST_URI,
 * which the client supplies, so the check drives it with paths nobody declared and requires the
 * base mount back. A manifest claiming an arbitrary path is the hole a whitelist exists to close.
 *
 * Usage:
 *   php dev/scripts/web_manifest_check.php
 *
 * Exit 0 = every mount's manifest and the pages served under it agree. Exit 1 = they do not.
 */

/**
 * The findings for ONE mount, pure so the selftest can drive it with fixtures.
 *
 * @param string               $mount    the mount the pages were rendered under
 * @param string               $json     the manifest served for that mount
 * @param array<string,int[]>  $files    icon path relative to the manifest => [width, height], or
 *                                       [] when the file is not there / has no pixel size; and
 *                                       '@self:<href>' => [] for each linked URL that is served
 * @param array<string,string> $emitted  what the pages emit under this mount: manifest href,
 *                                       theme-color, touch icon
 * @param string               $wantHref the manifest URL the pages must link under this mount
 * @return array<int,string>
 */
function ecWebManifestFindings(string $mount, string $json, array $files, array $emitted, string $wantHref): array
{
    $out = [];
    $data = json_decode($json, true);
    if (!is_array($data)) {
        return ["the manifest for \"$mount\" is not valid JSON (" . json_last_error_msg() . '). A '
            . 'browser drops a malformed manifest whole: the pages render, the app is not '
            . 'installable, and nothing anywhere says so. Fix the generator.'];
    }

    foreach (['name', 'short_name', 'start_url', 'scope', 'display', 'icons'] as $req) {
        if (!isset($data[$req]) || $data[$req] === '' || $data[$req] === []) {
            $out[] = "the manifest for \"$mount\" has no \"$req\". It is one of the members an "
                . 'install prompt needs, and without it the prompt is simply never offered -- there '
                . 'is no error and no warning to read.';
        }
    }

    $scope = isset($data['scope']) ? (string) $data['scope'] : '';
    $start = isset($data['start_url']) ? (string) $data['start_url'] : '';
    if ($scope !== '' && $start !== '' && strncmp($start, $scope, strlen($scope)) !== 0) {
        $out[] = "the manifest for \"$mount\" has start_url \"$start\" outside its scope \"$scope\". "
            . 'That is a manifest error and the document ignores the whole file, so nothing about '
            . 'the install works rather than just the start URL. Move the start_url under the scope.';
    }

    // THE MOUNT LEG: scope is the mount, exactly. A scope that merely CONTAINS the mount is '/',
    // which claims the whole origin for the installed window; a scope the mount merely STARTS
    // WITH ('/app' for '/app/') also matches '/apple-anything'. Equality is the only safe answer.
    if ($scope !== '' && $scope !== $mount) {
        $out[] = "the pages served at \"$mount\" link a manifest whose scope is \"$scope\". "
            . (strncmp($mount, $scope, strlen($scope)) === 0
                ? 'That scope contains the mount, and everything beside it: it is what the '
                  . 'INSTALLED APP WINDOW claims, so every navigation under it stays inside the '
                  . 'app -- the parent site included. '
                : 'A manifest whose scope does not contain the document that links it is invalid '
                  . 'FOR THAT DOCUMENT and is dropped whole, so the page at that mount is not '
                  . 'installable at all and nothing says so. ')
            . 'The scope of the manifest for a mount is that mount, trailing slash included; '
            . 'lib/WebManifest.lib.php derives it from ecSwMounts().';
    }

    // Icons: the src must be a real file, and its real pixel size must be the declared one.
    if (isset($data['icons']) && is_array($data['icons'])) {
        foreach ($data['icons'] as $i => $icon) {
            $src = isset($icon['src']) ? (string) $icon['src'] : '';
            if ($src === '') {
                $out[] = "the manifest for \"$mount\" icon $i has no src.";
                continue;
            }
            if (!array_key_exists($src, $files)) {
                $out[] = "the manifest for \"$mount\" states icon \"$src\" and there is no such file. "
                    . 'The install shows a blank or a generated icon on somebody\'s home screen, '
                    . 'which is a place nobody on this side ever looks. Add the file or fix the path.';
                continue;
            }
            $sizes = isset($icon['sizes']) ? (string) $icon['sizes'] : '';
            $real = $files[$src];
            if ($sizes === '' || strtolower($sizes) === 'any' || !$real) continue;
            foreach (preg_split('/\s+/', trim($sizes)) as $spec) {
                if (!preg_match('/^(\d+)x(\d+)$/i', $spec, $m)) continue;
                if ((int) $m[1] !== $real[0] || (int) $m[2] !== $real[1]) {
                    $out[] = "the manifest for \"$mount\" says \"$src\" is $spec and the file is "
                        . $real[0] . 'x' . $real[1] . '. A browser trusts the declaration when it '
                        . 'picks an icon, so the wrong one is chosen and then rescaled -- a smeared '
                        . 'icon, never an error. Fix the number or the file.';
                }
            }
        }
    }

    // The pages under this mount must link THIS mount's manifest, and it must be served.
    $href = isset($emitted['manifest_href']) ? (string) $emitted['manifest_href'] : '';
    if ($href === '') {
        $out[] = "the pages served at \"$mount\" emit no <link rel=\"manifest\">, so nothing under "
            . 'that mount is installable.';
    } elseif ($href !== $wantHref) {
        $out[] = "the pages served at \"$mount\" link \"$href\" and the manifest for that mount is "
            . "\"$wantHref\". The page then installs with another mount's scope, or none: "
            . 'lib/HeadersFooters.lib.php must link ecWebManifestHref(ecSwMountFor(REQUEST_URI)).';
    } elseif (!isset($files['@self:' . $href])) {
        $out[] = "the pages link $href and no such file is served. The link 404s in silence: no "
            . 'install prompt, nothing in the page, nothing in the log anybody reads.';
    }
    if (isset($emitted['theme_color']) && isset($data['theme_color'])
        && strcasecmp((string) $emitted['theme_color'], (string) $data['theme_color']) !== 0) {
        $out[] = 'the pages emit <meta name="theme-color" content="' . $emitted['theme_color']
            . "\"> and the manifest for \"$mount\" says theme_color \"" . $data['theme_color']
            . '". The installed app then paints a different browser chrome from the tab, which is '
            . 'only visible with the two side by side. Make them the same value.';
    }
    if (isset($emitted['touch_icon']) && $emitted['touch_icon'] !== '' && !isset($files['@self:' . $emitted['touch_icon']])) {
        $out[] = 'the pages emit <link rel="apple-touch-icon" href="' . $emitted['touch_icon']
            . '"> and there is no such file. iOS then screenshots the page for the home screen '
            . 'instead, which looks like a choice somebody made.';
    }

    return $out;
}

/**
 * The selector leg, pure: a request path nobody declared must select the BASE mount, and a
 * declared one must select itself. Fed the selector's answers so the selftest can hand it a
 * lying selector.
 *
 * @param array<string,string> $answers  request path => the mount ecSwMountFor() chose
 * @param array<string,string> $mounts   ecSwMounts()
 * @param string               $base     EC_SW_BASE
 * @return array<int,string>
 */
function ecWebManifestSelectorFindings(array $answers, array $mounts, string $base): array
{
    $out = [];
    foreach ($answers as $path => $chosen) {
        if (!isset($mounts[$chosen])) {
            $out[] = "ecSwMountFor(\"$path\") answered \"$chosen\", which is not a declared mount. "
                . 'REQUEST_URI is client-supplied; the selector may pick among ecSwMounts() and '
                . 'nothing else, or a request can obtain a manifest claiming any path it likes.';
            continue;
        }
        $under = false;
        foreach (array_keys($mounts) as $m) {
            if (strncmp($path, $m, strlen($m)) === 0) $under = true;
        }
        if (!$under && $chosen !== $base) {
            $out[] = "ecSwMountFor(\"$path\") answered \"$chosen\" for a path under no declared "
                . "mount; the fallback is the base mount \"$base\".";
        }
        if ($under && strncmp($path, $chosen, strlen($chosen)) !== 0) {
            $out[] = "ecSwMountFor(\"$path\") answered \"$chosen\", which is not the mount that "
                . 'path is under.';
        }
    }
    return $out;
}

if (defined('WEB_MANIFEST_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
require_once($root . '/lib/WebManifest.lib.php');

if (!is_file($root . '/manifest.php')) {
    fwrite(STDERR, "web_manifest_check: there is no manifest.php at the repository root, and every\n");
    fwrite(STDERR, "page links it. Either restore the endpoint or stop emitting the link.\n");
    exit(1);
}

// Icon sizes are measured, never trusted: the declaration is the thing being checked. The icon
// list does not vary by mount, so it is measured once off the base manifest.
$files = [];
$data = ecWebManifest(EC_SW_BASE);
foreach ($data['icons'] as $icon) {
    $src = isset($icon['src']) ? (string) $icon['src'] : '';
    if ($src === '') continue;
    $abs = $root . '/' . ltrim($src, '/');
    if (!is_file($abs)) continue;
    $size = @getimagesize($abs);
    $files[$src] = $size ? [(int) $size[0], (int) $size[1]] : [];
}

/** Whether a root-anchored URL under EC_SW_BASE is a file in the tree (query string ignored). */
$served = function (string $url) use ($root): bool {
    $path = strtok($url, '?');
    $rel = preg_replace('~^' . preg_quote(rtrim(EC_SW_BASE, '/'), '~') . '/~', '', $path);
    return is_file($root . '/' . ltrim((string) $rel, '/'));
};

// What the pages actually emit, UNDER EACH MOUNT. Rendered, one subprocess per page per mount,
// because these three lines come out of echoHTMLHead() and a page that does not call it emits
// none of them. --uri seeds REQUEST_URI alone, which is what ecSwMountFor() reads.
$problems = [];
$pagesRead = 0;
$empty = [];
$mounts = ecSwMounts();
foreach (array_keys($mounts) as $mount) {
    $emitted = [];
    $disagree = [];
    foreach (glob($root . '/*.php') ?: [] as $file) {
        $name = basename($file);
        $uri = $mount . ($mount === EC_SW_BASE ? $name : '');
        $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
             . ' ' . escapeshellarg($name) . ' --uri=' . escapeshellarg($uri) . ' 2>/dev/null';
        $html = (string) shell_exec($cmd);
        if (trim($html) === '') { if ($mount === EC_SW_BASE) $empty[] = $name; continue; }
        $seen = [];
        if (preg_match('/<link[^>]*rel="manifest"[^>]*href="([^"]+)"/i', $html, $m)) $seen['manifest_href'] = html_entity_decode($m[1], ENT_QUOTES, 'UTF-8');
        if (preg_match('/<meta[^>]*name="theme-color"[^>]*content="([^"]+)"/i', $html, $m)) $seen['theme_color'] = $m[1];
        if (preg_match('/<link[^>]*rel="apple-touch-icon"[^>]*href="([^"]+)"/i', $html, $m)) $seen['touch_icon'] = $m[1];
        if (!$seen) continue;
        $pagesRead++;
        foreach ($seen as $k => $v) {
            if (!isset($emitted[$k])) { $emitted[$k] = $v; continue; }
            if ($emitted[$k] !== $v) $disagree[$k] = true;
        }
    }
    // A page emitting a DIFFERENT value from its neighbours under the same mount is its own
    // finding: these three come from one function, so a second value means a second copy.
    foreach (array_keys($disagree) as $k) {
        $problems[] = "under \"$mount\" the pages do not agree about \"$k\" -- more than one value "
            . 'is emitted across the suite. All three of these come from echoHTMLHead(), so a '
            . 'second value means a second copy of the markup somewhere. Find it and delete it.';
    }
    $mountFiles = $files;
    foreach (['manifest_href', 'touch_icon'] as $k) {
        if (isset($emitted[$k]) && $served($emitted[$k])) $mountFiles['@self:' . $emitted[$k]] = [];
    }
    $problems = array_merge($problems, ecWebManifestFindings(
        $mount, ecWebManifestJson($mount), $mountFiles, $emitted, ecWebManifestHref($mount)));
}

// The selector: every declared mount selects itself, with and without a query string, and a
// path nobody declared -- including the bare mount without its slash, and a sibling that shares
// its letters -- falls back to the base.
$probe = [];
foreach (array_keys($mounts) as $mount) {
    foreach ([$mount, $mount . '?lang=fr', $mount . 'Page.php', rtrim($mount, '/'), rtrim($mount, '/') . 'le/'] as $p) {
        $probe[$p] = ecSwMountFor($p);
    }
}
foreach (['', '/', '/evil/', '/../app/', '//app/'] as $p) { $probe[$p] = ecSwMountFor($p); }
$problems = array_merge($problems, ecWebManifestSelectorFindings($probe, $mounts, EC_SW_BASE));
if (ecWebManifestMount('/evil/') !== EC_SW_BASE) {
    $problems[] = 'ecWebManifestMount("/evil/") did not fall back to the base mount, so '
        . 'manifest.php?mount=/evil/ would serve a manifest claiming a scope nobody declared.';
}

if ($problems) {
    echo 'Web app manifest: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "Nothing here has a symptom a person using the site can see. That is why it is a check.\n";
    exit(1);
}

printf(
    "Web app manifest OK -- %d icon(s) measured against their declared sizes; %d mount(s) (%s),\n"
    . "each with a generated manifest whose scope is the mount and its start_url inside it;\n"
    . "%d rendered page(s) agreeing with it about the manifest URL, the theme colour and the touch\n"
    . "icon; the selector answered a declared mount for all %d probe(s).\n",
    count($data['icons']), count($mounts), implode(', ', array_keys($mounts)), $pagesRead, count($probe)
);
if ($empty) {
    echo 'Rendered empty and not read, ' . count($empty) . ': ' . implode(', ', $empty) . ".\n";
}
exit(0);
