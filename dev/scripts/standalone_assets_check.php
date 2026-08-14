<?php
/**
 * standalone_assets_check.php — does every ASSET a page loads actually ship in this repository?
 *
 * WHY THIS EXISTS. On 2026-08-14 dev.hawsedc.com got its first deploy of engcalcs and came up with
 * no blue form backgrounds and no table borders. Everything else looked right, which is what made it
 * hard: the page was 95% correct.
 *
 * The cause was `/hawsedc.css` — 464 bytes at the SITE ROOT, loaded by every page, and **not tracked
 * by this repository**. It belongs to hawsedc.com. On the live site it has always been there, so
 * nothing ever noticed that the suite could not stand up without it. It carries exactly two rules:
 *
 *     form           { background: #f7f9ff; border: 1px solid #66c; }
 *     table,th,tr,td { border: 1px solid blue; }
 *
 * which is precisely "the blue backgrounds and the table borders".
 *
 * THE REASON THIS IS A CHECK AND NOT A NOTE: LibreEPANET.org (ROADMAP Task 306) is BY DEFINITION a
 * standalone deploy of this suite on a different domain. It would have hit this the same way, and
 * the symptom — most of the page fine, some styling missing — reads like a cache problem for a day
 * before anyone thinks to look for a 404. The suite must be able to stand on its own, and only a
 * check can keep it that way.
 *
 * WHAT IT CHECKS. Every `href`/`src` a rendered page emits that points at an absolute path. For an
 * ASSET (something with a file extension we serve — css, js, images, fonts) the target must exist
 * on disk inside this repository. A LINK to another page (`/index.php`, `/techdocs.php`) is NOT an
 * asset: those are navigation into the parent site and are expected to be absent from a standalone
 * deploy. Extensionless and .php targets are therefore ignored, deliberately.
 *
 * Usage: php dev/scripts/standalone_assets_check.php [--verbose]
 */

$root = dirname(__DIR__, 2);
$verbose = in_array('--verbose', $argv, true);

// Same page list the other renderers use: every top-level page a visitor can reach.
$pages = [];
foreach (glob($root . '/*.php') as $f) {
    $b = basename($f);
    if (preg_match('/^(formmail|log-|sw)/', $b)) { continue; }   // endpoints, not pages
    $pages[] = $b;
}
sort($pages);

$assetExt = 'css|js|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|json|webmanifest';

// Assets outside /engcalcs/ that are ALLOWED, each with the reason it is not a dependency.
// An entry here is a promise that the suite still stands up without the file.
$allowedOutside = [
    // The parent site's stylesheet. Everything in it that engcalcs needs was copied into
    // css/engcalcs.css on 2026-08-14 (see the self-sufficiency block at the top of that file), so
    // this link is now parent-site INTEGRATION rather than a dependency: on hawsedc.com it still
    // loads last and its identical declarations win, and on a standalone deploy its absence costs
    // nothing. Keep the values in the two files in step.
    '/hawsedc.css' => 'parent-site stylesheet; its rules are duplicated in css/engcalcs.css',
];
$missing = [];
$checked = 0;
$rendered = 0;

foreach ($pages as $page) {
    $html = shell_exec('php ' . escapeshellarg($root . '/dev/scripts/render_page.php') . ' ' . escapeshellarg($page) . ' 2>/dev/null');
    if (!$html) { continue; }
    $rendered++;
    if (!preg_match_all('/(?:href|src)="(\/[^"#?]*)(\?[^"]*)?"/i', $html, $m, PREG_SET_ORDER)) { continue; }
    foreach ($m as $hit) {
        $path = $hit[1];
        if (!preg_match('/\.(' . $assetExt . ')$/i', $path)) { continue; }   // a page link, not an asset
        $checked++;
        // "SHIPS IN THIS REPOSITORY" MEANS UNDER /engcalcs/, and testing that rather than testing
        // the DISK is the whole point. The first version of this check asked is_file() against the
        // parent directory -- and passed, because on a developer's machine the parent site is right
        // there beside the repo. That is precisely the condition that hid the defect for months: it
        // is present everywhere anyone looks, and absent exactly where nobody looks until a deploy.
        // The repo root IS /engcalcs/, so anything outside it is by construction not ours to ship.
        if (strpos($path, '/engcalcs/') !== 0) {
            if (isset($allowedOutside[$path])) { continue; }
            $missing[$path][] = $page;
            continue;
        }
        if (!is_file($root . substr($path, strlen('/engcalcs')))) {
            $missing[$path][] = $page;
        }
    }
}

printf("Standalone assets — %d page(s) rendered, %d asset reference(s) checked\n", $rendered, $checked);
if (!$rendered) {
    fwrite(STDERR, "FAIL: rendered no pages at all. This check examined nothing and must not pass.\n");
    exit(1);
}

if ($missing) {
    echo "\n";
    foreach ($missing as $path => $pagesHit) {
        printf("  MISSING  %-34s referenced by %d page(s)%s\n", $path, count($pagesHit),
            $verbose ? ': ' . implode(' ', $pagesHit) : '');
    }
    echo "\nThese are ASSETS this suite loads but does not ship. On hawsedc.com they may exist in the\n";
    echo "parent site and never be noticed; on a standalone deploy -- which is what LibreEPANET.org\n";
    echo "is (Task 306) -- they 404 and the page comes up subtly wrong rather than obviously broken.\n";
    echo "Either bring the file into this repository, or fold what it provides into css/engcalcs.css.\n";
    exit(1);
}

echo "PASS: every asset referenced by a page ships in this repository.\n";
exit(0);
