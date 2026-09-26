<?php
/**
 * accept_language_check.php -- no Accept-Language header can make a page answer 500.
 *
 * Production, 2026-09-22: eight fatals "Unsupported operand types: string * string" in
 * chooseLanguage(). The header is visitor input, and "en; q=0.8" (a space after the semicolon,
 * which RFC 9110 allows) left the q-value as "=0.8", which PHP 8 refuses to multiply. Each header
 * below renders a real page in its own process and must exit 0 in the language stated.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
$root = dirname(__DIR__, 2);
$cases = array(
    // header                                 => the language the page must be served in
    'es-MX,es;q=0.9,en;q=0.2'                 => 'es',
    'en; q=0.2, es; q=0.9'                    => 'es',
    'fr-CA , en ;q = 0.5'                     => 'fr',
    'de;q=abc'                                => 'de',
    'de;q=, pt;q=0.5'                         => 'de',
    'pt;Q=0.9,en;q=0.1'                       => 'pt',
    'en;q=9'                                  => 'en',
    '*'                                       => null,
    '*;q=x'                                   => null,
    ';;;,,,;q=;'                              => null,
    "tr;q=0.7\t,xx"                           => 'tr',
);
$fail = 0;
foreach ($cases as $accept => $want) {
    $cmd = 'php ' . escapeshellarg($root . '/dev/scripts/render_page.php') . ' Manning-Pipe-Flow.php '
         . escapeshellarg('--accept=' . $accept) . ' 2>&1';
    exec($cmd, $out, $rc);
    $page = implode("\n", $out);
    $out = array();
    if ($rc !== 0 || strpos($page, 'Fatal error') !== false) {
        printf("FAIL %s: exit %d\n     %s\n", var_export($accept, true), $rc,
            substr(preg_replace('/\s+/', ' ', $page), 0, 200));
        $fail++;
        continue;
    }
    if ($want !== null && !preg_match('/<html lang="' . preg_quote($want, '/') . '"/', $page)) {
        preg_match('/<html lang="([^"]*)"/', $page, $m);
        printf("FAIL %s: served %s, expected %s\n", var_export($accept, true),
            isset($m[1]) ? $m[1] : '(no lang)', $want);
        $fail++;
    }
}
if ($fail) { echo "$fail Accept-Language case(s) failed\n"; exit(1); }
echo "ok " . count($cases) . " Accept-Language headers render\n";
