<?php
/**
 * THE SUITE NAV'S LINKS ARE ABSOLUTE FROM THE ORIGIN, ON EVERY PAGE.
 *
 * **WHY THIS EXISTS.** Tom, 2026-09-09, looking at the app on librewaternet.org: *"1st and 3rd
 * items (Hawsedc Calculators and Hydraulics) and Help don't even work at LibreWaterNet.org, which
 * is embarrassment we forgot to check."* He was right on both halves -- they did not work, and
 * nothing was looking.
 *
 * The nav bar in lib/Menus.lib.php carried RELATIVE hrefs: `index.php`, `Manning-Pipe-Flow.php`,
 * `About.php`. That is correct at `hawsedc.com/engcalcs/Whatever.php`, where they resolve inside
 * the mount. **`/app/` is a REWRITE onto Looped-Network.php** (Task 479), so at
 * `librewaternet.org/app/` the very same markup resolves `Manning-Pipe-Flow.php` against `/app/`
 * and 404s, and so does the brand link.
 *
 * **THE FAILURE IS INVISIBLE FROM INSIDE THIS REPOSITORY, WHICH IS THE WHOLE ARGUMENT FOR A CHECK.**
 * The HTML is byte-identical on both hosts; only the base URL differs, and no renderer here has a
 * base URL. It renders, it looks right, every link is present and spelled correctly, and a third of
 * the bar is dead for everyone arriving at the suite's own front door. It stood from the day the
 * rewrite shipped until a person clicked it.
 *
 * WHAT IT HOLDS: every `<a href>` the SHARED CHROME emits, on every rendered page, is one of
 *   - absolute from the origin (`/engcalcs/...`), or
 *   - a full URL to somewhere else (`https://...`, `mailto:`), or
 *   - a fragment or a query on the current page (`#...`, `?...`), which is base-independent.
 * A bare `Whatever.php` fails and names itself.
 *
 * **SCOPED TO THE SHARED CHROME AND DELIBERATELY NOT TO PAGE BODIES.** A calculator's own prose
 * links to a sibling calculator relatively, four times on Manning-Pipe-Flow alone, and those are
 * correct: those pages are served at exactly one address and a relative link there is shorter and
 * moves with the mount. Only the chrome rides onto a page served somewhere else. Widening this to
 * whole pages would fail 5 correct links to catch nothing.
 */

require_once __DIR__ . '/../../lib/base.inc.php';

$root = dirname(__DIR__, 2);
$render = __DIR__ . '/render_page.php';

// Every rendered page, the same list the other rendering checks derive.
$pages = [];
foreach (glob($root . '/*.php') as $f) {
    $b = basename($f);
    if ($b === 'sw.php' || $b === 'manifest.php' || $b === 'consent.php' || $b === 'formmail.php') { continue; }
    $pages[] = $b;
}
sort($pages);

$bad = [];
$scanned = 0;
$links = 0;
foreach ($pages as $page) {
    $html = @shell_exec('php ' . escapeshellarg($render) . ' ' . escapeshellarg($page) . ' 2>/dev/null');
    if (!is_string($html) || $html === '') { continue; }
    $scanned++;
    // The shared chrome is the <nav> the suite emits plus the footer. Both are produced by
    // lib/Menus.lib.php and both ride onto every page including the rewritten one.
    if (!preg_match_all('#<nav\b[^>]*>.*?</nav>#is', $html, $navs)) { continue; }
    foreach ($navs[0] as $nav) {
        if (!preg_match_all('#\shref="([^"]*)"#i', $nav, $m)) { continue; }
        foreach ($m[1] as $href) {
            $links++;
            $h = trim($href);
            if ($h === '' || $h[0] === '#' || $h[0] === '?' || $h[0] === '/') { continue; }
            if (preg_match('#^[a-z][a-z0-9+.-]*:#i', $h)) { continue; }   // https:, mailto:, etc.
            $bad[] = $page . '  ' . $h;
        }
    }
}

if ($scanned === 0) {
    fwrite(STDERR, "nav links: rendered no pages, so this check proved nothing.\n");
    exit(1);
}

echo "Suite nav links: {$links} href(s) across {$scanned} rendered page(s).\n";
if (!$bad) {
    echo "All absolute from the origin, a full URL, or base-independent.\n";
    exit(0);
}

fwrite(STDERR, "\nRELATIVE LINK IN THE SUITE NAV: " . count($bad) . "\n");
foreach ($bad as $b) { fwrite(STDERR, "  {$b}\n"); }
fwrite(STDERR, <<<TXT

The nav rides onto every page, including Looped-Network.php, which is ALSO served at the
`/app/` rewrite. A relative href there resolves against `/app/` and 404s, and the markup is
identical on both hosts so nothing else can see it.

Fix: prefix the href with EC_SW_BASE, which lib/ServiceWorker.lib.php declares as the canonical
mount and which every other absolute path in the source already names:

    href="<?=EC_SW_BASE?>Manning-Pipe-Flow.php"

TXT);
exit(1);
