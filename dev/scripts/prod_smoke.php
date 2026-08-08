<?php
/**
 * Does the live site actually answer? — a smoke check that needs nothing but PHP.
 *
 *   php dev/scripts/prod_smoke.php                       # checks https://hawsedc.com/engcalcs/
 *   php dev/scripts/prod_smoke.php http://127.0.0.1:8899 # or anywhere else
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
 * Exit code 0 if everything answered 200, 1 otherwise, so it can gate a deploy script.
 */

$base = isset($argv[1]) ? rtrim($argv[1], '/') : 'https://hawsedc.com';
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

echo "\n" . ($bad ? "$bad FAILED\n" : "all clear\n");
exit($bad ? 1 : 0);
