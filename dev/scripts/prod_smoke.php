<?php
/**
 * Does the live site actually answer? — a smoke check that needs nothing but PHP.
 *
 *   php dev/scripts/prod_smoke.php                       # checks https://hawsedc.com/engcalcs/
 *   php dev/scripts/prod_smoke.php http://127.0.0.1:8899 # or anywhere else
 *   php dev/scripts/prod_smoke.php --links              # also follow every link the pages emit
 *   php dev/scripts/prod_smoke.php --links --external   # ...including off-site ones (advisory)
 *
 * **Deliberately not node.** `dev/browser-pass/` is the real pass and needs a browser and a package
 * manager; the cPanel server has neither. This is the other half of the answer: after `git pull` on
 * the server, run this over SSH and know within a second that every page still returns 200 to every
 * kind of client — including the clients nobody tests with.
 *
 * It exists because of what a browser pass found on 2026-08-06: `Accept-Language: *`, a single header
 * with no q-value, made `chooseLanguage()` multiply an empty string and PHP 8 turn that into a fatal
 * TypeError. **Every page of the suite answered 500 to it**, on production, silently — a browser
 * almost never sends that form, but HTTP libraries, some crawlers and every `fetch()` in Node do. The
 * header matrix below is the point of this script; the page list is just breadth.
 *
 * `--links` asks the other half of the question. Until 2026-08-08 this script proved that every
 * PAGE answered 200 while saying nothing about whether the links ON those pages went anywhere. They
 * did not: the Feedback invitation on every calculator page pointed at `../contact.php`, which
 * stopped existing on 2026-06-26 when the contact system moved into `engcalcs/`. Six weeks, on the
 * suite's most prominent invitation, and the failure was silent from both ends — a visitor who
 * cannot reach the contact form cannot use the contact form to report that. See ROADMAP Task 226.
 *
 * Exit code 0 if everything answered 200, 1 otherwise, so it can gate a deploy script. Off-site
 * links never affect that code: a third party rate-limiting us is not our deploy being broken.
 */

$argvRest = array_slice($argv, 1);
$optLinks    = in_array('--links', $argvRest, true);
$optExternal = in_array('--external', $argvRest, true);
$positional  = array_values(array_filter($argvRest, function ($a) { return substr($a, 0, 2) !== '--'; }));

$base = isset($positional[0]) ? rtrim($positional[0], '/') : 'https://hawsedc.com';
$base .= (substr($base, -9) === '/engcalcs') ? '' : '/engcalcs';

// One page per shape of page, not all twenty: a plain calculator, the JS-built one, the two-column
// one, and the pages with no calculator at all. A fault in shared code shows up in all of them.
$pages = array(
    'Manning-Pipe-Flow.php',
    'Looped-Network.php',
    'Manning-Irregular.php',
    'index.php',
    'contact.php'
);

// The header matrix. Every one of these is a real client that has hit this site.
$accepts = array(
    'none'                 => null,
    '*'                    => '*',                       // the 2026-08-06 fatal
    '*;q=0.5'              => '*;q=0.5',
    'en-US,en;q=0.9'       => 'en-US,en;q=0.9',          // an ordinary browser
    'es'                   => 'es',
    'ar,en;q=0.8'          => 'ar,en;q=0.8',             // RTL, and a fallback
    'xx'                   => 'xx',                      // a language we do not have
    'en;q=0'               => 'en;q=0',                  // "anything but English"
    ''                     => ''                         // present but empty
);

// curl where there is curl, streams where there is not. cPanel usually has ext/curl and this WSL
// box does not, and a smoke check that cannot run on the machine you happen to be sitting at is not
// a smoke check. Both paths must report the same three things: status, transport error, and body.
function http_probe($url, $acceptLanguage, $post = null)
{
    return function_exists('curl_init')
        ? http_probe_curl($url, $acceptLanguage, $post)
        : http_probe_stream($url, $acceptLanguage, $post);
}
function http_probe_stream($url, $acceptLanguage, $post = null)
{
    $head = "User-Agent: engcalcs-prod-smoke\r\n";
    if ($acceptLanguage !== null) { $head .= 'Accept-Language: ' . $acceptLanguage . "\r\n"; }
    $opts = array('http' => array(
        'method' => $post === null ? 'GET' : 'POST',
        'header' => $head . ($post === null ? '' : "Content-Type: application/x-www-form-urlencoded\r\n"),
        'timeout' => 20,
        // We WANT the body of a 500 -- it is the whole diagnosis -- and without this the stream
        // wrapper throws it away and returns false for every error status.
        'ignore_errors' => true
    ));
    if ($post !== null) { $opts['http']['content'] = http_build_query($post); }
    $body = @file_get_contents($url, false, stream_context_create($opts));
    $code = 0;
    if (isset($http_response_header)) {
        foreach ($http_response_header as $h) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $h, $m)) { $code = (int)$m[1]; }
        }
    }
    return array('code' => $code, 'err' => ($body === false ? 'no response' : ''), 'body' => (string)$body);
}
function http_probe_curl($url, $acceptLanguage, $post = null)
{
    $ch = curl_init($url);
    $headers = array('User-Agent: engcalcs-prod-smoke');
    if ($acceptLanguage !== null) { $headers[] = 'Accept-Language: ' . $acceptLanguage; }
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => $headers
    ));
    if ($post !== null) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
    }
    $body = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);
    return array('code' => $code, 'err' => $err, 'body' => (string)$body);
}
// A 200 carrying a PHP warning is not a pass. The lock broker answers JSON, and a warning printed
// above that JSON makes the page's `resp.json()` throw -- which it reports to the user as "the
// server is unreachable". A fault that disguises itself as a network problem is the worst kind to
// ship, so the body is inspected even when the status is fine.
function body_is_noisy($body)
{
    return (bool)preg_match('/<b>(Warning|Notice|Fatal error|Deprecated)<\/b>|PHP (Warning|Notice|Fatal error|Deprecated)/', $body);
}
// ---- link checking (--links, ROADMAP Task 227) ----

/** Every href a page emits, entity-decoded. Includes <link> as well as <a>: a dead canonical or a
 *  404 stylesheet is a real defect too, and they cost nothing extra to check. */
function ec_extract_hrefs($html)
{
    $out = array();
    if (preg_match_all('/\shref\s*=\s*(["\'])(.*?)\1/is', $html, $m)) {
        foreach ($m[2] as $h) { $out[] = html_entity_decode($h, ENT_QUOTES, 'UTF-8'); }
    }
    return $out;
}

/** Resolves an href against the page that emitted it, normalizing "../" the way a browser does.
 *  Normalizing here rather than leaving "/engcalcs/../contact.php" for the server is the point:
 *  the resolved form is what the visitor's address bar shows, and it is what makes a report
 *  readable enough to act on. Returns null for anything not worth fetching. */
function ec_resolve_url($pageUrl, $href)
{
    $href = trim($href);
    $href = preg_replace('/#.*$/', '', $href);
    if ($href === '') { return null; }
    // Non-navigational schemes. mailto: in particular is a link we cannot check and must not fail.
    if (preg_match('#^(mailto|tel|javascript|data|sms):#i', $href)) { return null; }

    $p = parse_url($pageUrl);
    $scheme = isset($p['scheme']) ? $p['scheme'] : 'https';
    $host   = isset($p['host']) ? $p['host'] : '';
    if (isset($p['port'])) { $host .= ':' . $p['port']; }
    $path   = isset($p['path']) ? $p['path'] : '/';

    if (substr($href, 0, 2) === '//')       { return $scheme . ':' . $href; }
    if (preg_match('#^[a-z][a-z0-9+.\-]*://#i', $href)) { return $href; }
    if (substr($href, 0, 1) === '?')        { return $scheme . '://' . $host . $path . $href; }

    if (substr($href, 0, 1) === '/') {
        $newPath = $href;
    } else {
        $newPath = substr($path, 0, strrpos($path, '/') + 1) . $href;
    }
    // Collapse "." and ".." segments. A ".." that climbs past the root is dropped, which is what
    // every browser and server does -- and is exactly how ../contact.php became /contact.php.
    $qs = '';
    if (($qpos = strpos($newPath, '?')) !== false) { $qs = substr($newPath, $qpos); $newPath = substr($newPath, 0, $qpos); }
    $parts = explode('/', $newPath);
    $stack = array();
    foreach ($parts as $seg) {
        if ($seg === '.' || $seg === '') { continue; }
        if ($seg === '..') { array_pop($stack); continue; }
        $stack[] = $seg;
    }
    $normalized = '/' . implode('/', $stack);
    // A trailing slash is meaningful (directory index); the segment loop above eats it.
    if (substr($newPath, -1) === '/' && $normalized !== '/') { $normalized .= '/'; }
    return $scheme . '://' . $host . $normalized . $qs;
}

function ec_host_of($url)
{
    $h = parse_url($url, PHP_URL_HOST);
    return $h === null ? '' : strtolower($h);
}

function fetch_status($url, $acceptLanguage)
{
    $r = http_probe($url, $acceptLanguage);
    $r['noisy'] = body_is_noisy($r['body']);
    $r['len'] = strlen($r['body']);
    return $r;
}

$bad = 0;
echo "smoke: $base\n\n";
foreach ($pages as $page) {
    echo $page . "\n";
    foreach ($accepts as $label => $value) {
        $r = fetch_status("$base/$page", $value);
        $ok = ($r['code'] === 200 && !$r['noisy'] && $r['err'] === '');
        if (!$ok) { $bad++; }
        printf("  %-6s Accept-Language: %-16s %s%s%s\n",
            $ok ? 'ok' : 'FAIL',
            $label,
            $r['code'],
            $r['err'] ? '  ' . $r['err'] : '',
            $r['noisy'] ? '  (PHP notice/warning in the body)' : ''
        );
    }
}

// The lock broker, which is the one endpoint that must answer parseable JSON or the page lies about
// why it is not protecting anybody's file.
echo "\nlpn-lock.php\n";
$r = http_probe("$base/lpn-lock.php", null,
    array('action' => 'check', 'id' => 'dSMOKEcheck1', 'holder' => 'smokesmokesmokesmoke', 'name' => 'SMOKE'));
$body = $r['body'];
$code = $r['code'];
$json = json_decode(trim((string)$body), true);
$jsonOk = is_array($json) && isset($json['ok']);
if (!$jsonOk) { $bad++; }
printf("  %-6s check on an unknown project -> %d  %s\n", $jsonOk ? 'ok' : 'FAIL', $code,
    $jsonOk ? json_encode($json) : 'not parseable JSON: ' . substr(trim((string)$body), 0, 160));

// **IS THE SERVER RUNNING WHAT YOU JUST FIXED?**
//
// Added 2026-08-06 after a whole round trip was spent on a defect that was already fixed: Tom
// retested twice against a production server that was two commits behind, and every theory about
// why the fix "did not work" was a theory about code that was not there. Neither of us could see
// that from the symptom, and neither of us thought to look.
//
// Compares the bytes of the files most likely to be mid-change against this working tree. It cannot
// name a commit — the server has no way to tell us one — but "the file you are debugging is not the
// file they are running" is the fact that matters, and this is the cheapest possible way to know it.
$assets = array(
    'js/looped-network.js',
    'js/lpn-solver.js',
    'js/Calculators.lib.js',
    'lpn-lock.php'
);
echo "\ndeployed vs this working tree\n";
$repo = dirname(dirname(__DIR__));
foreach ($assets as $rel) {
    $localPath = $repo . '/' . $rel;
    if (!is_file($localPath)) { continue; }
    // PHP files are executed by the server, so only their static siblings can be compared this way.
    if (substr($rel, -4) === '.php') { continue; }
    $r = http_probe("$base/$rel", null);
    $local = sha1(file_get_contents($localPath));
    $remote = sha1((string)$r['body']);
    $same = ($r['code'] === 200 && $local === $remote);
    if (!$same) { $bad++; }
    printf("  %-6s %-28s %s\n", $same ? 'ok' : 'STALE', $rel,
        $same ? 'matches' : ($r['code'] !== 200 ? "HTTP {$r['code']}" : 'DIFFERENT — the server has not pulled, or has something newer'));
}

// ---- Do the links on those pages go anywhere? (--links, ROADMAP Task 227) ----
//
// Opt-in because it is the slow half: dozens of distinct URLs rather than one page each. The
// default run stays fast enough to put in a deploy script without thinking about it.
if ($optLinks) {
    $repoRoot = dirname(dirname(__DIR__));
    $baseHost = ec_host_of($base);
    $baseIsHttps = (stripos($base, 'https://') === 0);
    $refs = array();   // resolved url => list of the places that emit it

    // Can this host tell a dead link from a live one AT ALL? `php -S` answers 200 for every
    // missing .php path -- it falls back to the docroot's index.php as a router -- so a link check
    // against the built-in server reports a cheerful all-clear no matter how broken the links are.
    // That is worse than not running: it is a green light that means nothing. Found 2026-08-08 when
    // the mutation test for this very feature passed against localhost while the reintroduced
    // 404 sat right there in the page. So ask first, with a URL that cannot exist.
    $sentinel = "$base/zz-prod-smoke-nonexistent-" . substr(sha1((string)time()), 0, 8) . '.php';
    $sr = http_probe($sentinel, null);
    if ($sr['code'] === 200) {
        echo "\nlinks: SKIPPED -- this host answers 200 for a URL that does not exist\n";
        echo "  probed $sentinel -> 200\n";
        echo "  A catch-all like this (php -S, or a router/404-handler that returns 200) makes every\n";
        echo "  link look alive, so the check cannot distinguish a working link from a dead one.\n";
        echo "  Run --links against the real server (Apache on production) instead.\n";
        $optLinks = false;
    }
}
if ($optLinks) {

    // 1. The links in the pages as actually served. Same sample as above -- one page per shape.
    foreach ($pages as $page) {
        $pageUrl = "$base/$page";
        $r = http_probe($pageUrl, 'en-US,en;q=0.9');
        foreach (ec_extract_hrefs($r['body']) as $href) {
            $u = ec_resolve_url($pageUrl, $href);
            if ($u === null) { continue; }
            $refs[$u][] = $page;
        }
    }

    // 2. The links inside the language files, which the served pages above cannot show us: only
    //    one language renders per request, so a link that is broken in exactly one of 27 files is
    //    invisible to any amount of page fetching. Reading them statically costs one pass over
    //    disk and covers every language at once. They are emitted by pages sitting at the engcalcs
    //    root, so they resolve as if from a calculator page there.
    $langRefPage = "$base/Manning-Pipe-Flow.php";
    require_once __DIR__ . '/lang_parse.inc.php';
    foreach (glob($repoRoot . '/lib/lang.ec.*.php') as $langFile) {
        $values = ecLangValues(file_get_contents($langFile));
        foreach ($values as $key => $val) {
            if (strpos($val, 'href') === false) { continue; }
            foreach (ec_extract_hrefs($val) as $href) {
                $u = ec_resolve_url($langRefPage, $href);
                if ($u === null) { continue; }
                $refs[$u][] = basename($langFile) . ':' . $key;
            }
        }
    }

    ksort($refs);
    $internal = array();
    $external = array();
    foreach ($refs as $u => $srcs) {
        if (ec_host_of($u) === $baseHost) { $internal[$u] = $srcs; } else { $external[$u] = $srcs; }
    }

    echo "\nlinks emitted by the sampled pages and the language files\n";
    printf("  %d distinct on-site, %d off-site\n", count($internal), count($external));
    foreach ($internal as $u => $srcs) {
        $r = http_probe($u, 'en-US,en;q=0.9');
        $ok = ($r['code'] === 200 && $r['err'] === '');
        if (!$ok) { $bad++; }
        // An on-site link written as http:// still works -- it 301s up to https, which the probe
        // follows -- so it is not a failure. It is worth seeing anyway: every one costs a visitor a
        // redirect and a moment of plaintext, and this is where such a link becomes visible at all.
        // Only meaningful when the SITE is https: checking a plain-http dev server would otherwise
        // flag every link on the page, which is noise, not a finding.
        $warn = $baseIsHttps && (stripos($u, 'http://') === 0);
        printf("  %-6s %-58s %s\n",
            $ok ? ($warn ? 'warn' : 'ok') : 'FAIL',
            strlen($u) > 58 ? substr($u, 0, 55) . '...' : $u,
            ($ok ? ($warn ? 'reachable, but downgrades to http' : '200') : $r['code'] . ($r['err'] ? ' ' . $r['err'] : ''))
        );
        if (!$ok) {
            $shown = array_slice(array_unique($srcs), 0, 4);
            printf("         emitted by: %s%s\n", implode(', ', $shown),
                count(array_unique($srcs)) > count($shown) ? ' (+' . (count(array_unique($srcs)) - count($shown)) . ' more)' : '');
        }
    }

    // Off-site links are ADVISORY and never touch the exit code. A reference site that rate-limits
    // or 403s a script is not our deploy being broken, and letting a third party fail our deploy
    // gate would train everyone to ignore the gate.
    if ($optExternal) {
        echo "\noff-site links (advisory -- never affects the exit code)\n";
        foreach ($external as $u => $srcs) {
            $r = http_probe($u, 'en-US,en;q=0.9');
            $ok = ($r['code'] >= 200 && $r['code'] < 400 && $r['err'] === '');
            printf("  %-6s %-58s %s\n", $ok ? 'ok' : 'note',
                strlen($u) > 58 ? substr($u, 0, 55) . '...' : $u,
                $r['code'] . ($r['err'] ? ' ' . $r['err'] : ''));
        }
    } elseif (count($external)) {
        printf("  (%d off-site links not checked; add --external)\n", count($external));
    }
}

// ---------------------------------------------------------------------------------------------
// TRIAGE: if everything failed, say WHY rather than just how much.
//
// 2026-08-14, dev.hawsedc.com's first deploy: every page returned 500 with an EMPTY body, on every
// header. That reads like "the site is down" and sends you looking at Apache, PHP versions and
// .htaccess -- and it was none of those. Two facts, taken together, localised it in one step:
//
//   - a STATIC asset under /engcalcs/ returned 200, so .htaccess and AllowOverride were fine (the
//     failure mode CLAUDE.md warns about would have 500'd those too);
//   - sw.php returned 200, and sw.php is the ONE php file in this suite that does not include
//     lib/base.inc.php. So PHP itself was healthy and the fatal was inside that include chain.
//
// The cause was a PARTIAL UPLOAD: lib/Language.lib.php was new and called ecBrowserLangTag(), which
// had just moved into lib/config.inc.php, which was old. Call to undefined function, on every page.
// A deploy that copies files rather than pulling a commit can always land half a change, and the
// two halves of one commit are exactly the pair that fatals.
//
// So this block runs the same two probes and prints the same reasoning. It costs two requests.
if ($bad) {
    // http_probe(), NOT a hand-rolled file_get_contents. The first version of this triage built its
    // own HEAD request with a stream context and read $http_response_header -- and reported "DOES
    // NOT ANSWER" for two files that answered 200, sending the reader to .htaccess for a fault that
    // was not there. This file already had a correct fetcher twenty lines up, which picks curl or
    // streams depending on what the machine has, precisely because a smoke check that cannot run
    // where you are sitting is not a smoke check. A TRIAGE THAT LIES IS WORSE THAN NO TRIAGE: it
    // spends the reader's trust and their time, and it does it at the moment they are already lost.
    $staticProbe = http_probe($base . '/css/engcalcs.css', 'en');
    $swProbe     = http_probe($base . '/sw.php', 'en');
    $staticOk = ($staticProbe['code'] === 200);
    $swOk     = ($swProbe['code'] === 200);

    echo "\ntriage\n";
    printf("  %-34s %s\n", 'static asset under /engcalcs/',
        $staticOk ? 'answers 200' : ('DOES NOT ANSWER (' . ($staticProbe['err'] ?: $staticProbe['code']) . ')'));
    printf("  %-34s %s\n", 'sw.php (no lib/base.inc.php)',
        $swOk ? 'answers 200' : ('DOES NOT ANSWER (' . ($swProbe['err'] ?: $swProbe['code']) . ')'));
    if ($staticOk && $swOk) {
        echo "\n  The web server is serving files and PHP runs. Every failure above is a page that\n";
        echo "  loads lib/base.inc.php, so the fault is inside THAT include chain. sw.php is the one\n";
        echo "  php file in the suite that does not load it, which is why it answers.\n\n";
        echo "  TWO CAUSES SHARE THIS EXACT SIGNATURE. Check them in this order:\n\n";
        echo "  1. THE PHP VERSION IS TOO OLD. lib/base.inc.php and everything it pulls in use `??`,\n";
        echo "     the null-coalescing operator, which is PHP 7.0+. On PHP 5.x that is a PARSE error:\n";
        echo "     a fatal with NO OUTPUT, which is why the 500 body is empty. sw.php and\n";
        echo "     lib/ServiceWorker.lib.php happen to contain no `??` at all, so they parse and\n";
        echo "     answer -- which is what makes the split look like a code bug when it is a server\n";
        echo "     setting. Found on dev.hawsedc.com 2026-08-14: a new cPanel subdomain had been given\n";
        echo "     an old PHP by default. Fix in MultiPHP Manager; no code change.\n";
        echo "     THE CONTROL THAT PROVES IT: fetch the same page from production. Identical code\n";
        echo "     answering 200 there and 500 here means the difference is the server, not the code.\n\n";
        echo "  2. A PARTIAL UPLOAD of lib/. Two halves of one commit landing separately is enough --\n";
        echo "     a caller shipped without the function it calls fatals every page while leaving\n";
        echo "     static files and sw.php answering normally.\n";
    } elseif (!$staticOk) {
        echo "\n  Even a static file will not serve. That is the web server, not this suite --\n";
        echo "  check .htaccess first: `Options -Indexes` needs an `AllowOverride Options` grant, and\n";
        echo "  where it is missing Apache returns 500 for EVERY request under /engcalcs/ rather than\n";
        echo "  ignoring the line. See CLAUDE.md, Deploying.\n";
    }
}

echo "\n" . ($bad ? "$bad FAILED\n" : "all clear\n");
exit($bad ? 1 : 0);
