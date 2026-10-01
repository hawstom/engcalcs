<?php
/**
 * build_desktop_static.php -- Spike 0 of the desktop plan (dev/desktop-platforms-plan.md, Task 756).
 *
 * Renders Looped-Network.php in English, once, at build time, into a self-contained folder that a
 * plain static file server (no PHP) can serve. It changes nothing on the web site and writes nothing
 * inside the repo.
 *
 *   php dev/scripts/build_desktop_static.php <out-dir> [--lang=en]
 *
 * Layout of <out-dir>: index.html is the rendered page; every file the page asks for lives under
 * <out-dir>/engcalcs/ at the same path the web site uses, because the page and its scripts name
 * their files as /engcalcs/... (absolute). The folder therefore has to be served from the root of
 * a host. Opened from file:// those paths point at the disk's root and nothing loads.
 *
 * The page's HTML is written exactly as PHP rendered it. Nothing is patched, so what still breaks
 * (see the plan's Spike 0 result) is what a desktop app would have to fix.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
$root = dirname(__DIR__, 2);
$out = '';
$lang = 'en';
foreach (array_slice($argv, 1) as $a) {
    if (preg_match('/^--lang=([a-z]{2})$/', $a, $m)) { $lang = $m[1]; }
    elseif ($a[0] !== '-' && $out === '') { $out = $a; }
}
if ($out === '') { fwrite(STDERR, "usage: php build_desktop_static.php <out-dir> [--lang=en]\n"); exit(1); }

function rrmdir($d) {
    if (!is_dir($d)) { return; }
    foreach (scandir($d) as $f) {
        if ($f === '.' || $f === '..') { continue; }
        $p = "$d/$f";
        is_dir($p) && !is_link($p) ? rrmdir($p) : unlink($p);
    }
    rmdir($d);
}
function rcopy($src, $dst) {
    if (is_dir($src)) {
        @mkdir($dst, 0777, true);
        foreach (scandir($src) as $f) { if ($f !== '.' && $f !== '..') { rcopy("$src/$f", "$dst/$f"); } }
    } else {
        @mkdir(dirname($dst), 0777, true);
        copy($src, $dst);
    }
}

rrmdir($out);
mkdir("$out/engcalcs", 0777, true);

// One page per process, global scope: render_page.php's own rule.
$cmd = 'php ' . escapeshellarg("$root/dev/scripts/render_page.php") . ' Looped-Network.php --lang=' . $lang;
$html = shell_exec($cmd . ' 2>/dev/null');
if (!$html || strpos($html, '<html') === false) { fwrite(STDERR, "render failed\n"); exit(1); }
file_put_contents("$out/index.html", $html);

// Everything the page names under /engcalcs/ that is a real file, minus the query string.
preg_match_all('#/engcalcs/([A-Za-z0-9_./-]+\.[A-Za-z0-9]+)#', $html, $m);
$files = array_unique($m[1]);
$copied = 0;
foreach ($files as $rel) {
    if (substr($rel, -4) === '.php') { continue; }          // server pages: reported, not shipped
    if (is_file("$root/$rel")) { rcopy("$root/$rel", "$out/engcalcs/$rel"); $copied++; }
}
// Files the page's scripts fetch by name at run time.
// epanet-js.js imports ./slim/index.js itself, so js/vendor goes whole.
foreach (['js/vendor', 'icons/icon-512.png', 'css/vendor', 'examples'] as $rel) {
    rcopy("$root/$rel", "$out/engcalcs/$rel");
}
fwrite(STDERR, "built $out: index.html + $copied referenced files, lang=$lang\n");
