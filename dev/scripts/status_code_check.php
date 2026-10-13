<?php
/**
 * status_code_check.php -- every status-bar message on the map carries a code. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY. setStatus(text, code, ...) in js/looped-network.js stores the code beside the message, and
 * the "wrong message" feedback button sends it; lib/FeedbackMail.lib.php prints it as "Message on
 * the map". A call that shows text and states no code falls back to the code 'status', so the
 * report arrives as "Message on the map: status" and nobody can tell which message was meant.
 * The fallback stays as a last resort; this check keeps it from being reached.
 *
 * WHAT IT CHECKS. In every js/*.js (vendor excluded), each call to setStatus( -- and, in
 * js/lpn-time.js, host.status( , which js/looped-network.js forwards to setStatus -- must pass a
 * second argument unless its message is the empty string (a clearing call). Comments and string
 * literals are skipped, so prose that mentions setStatus() is not a call.
 */
$root = __DIR__ . '/../..';
$problems = array();
$files = 0;

foreach (glob($root . '/js/*.js') as $path) {
    $src = file_get_contents($path);
    $name = 'js/' . basename($path);
    $names = array('setStatus');
    if (basename($path) === 'lpn-time.js') { $names[] = 'host.status'; }
    $files++;
    $n = strlen($src);
    $line = 1;
    $i = 0;
    $code = '';           // source with comments and strings blanked, same length
    while ($i < $n) {
        $c = $src[$i]; $d = $i + 1 < $n ? $src[$i + 1] : '';
        if ($c === '/' && $d === '/') {
            while ($i < $n && $src[$i] !== "\n") { $code .= ' '; $i++; }
        } elseif ($c === '/' && $d === '*') {
            while ($i < $n && !($src[$i] === '*' && $i + 1 < $n && $src[$i + 1] === '/')) { $code .= $src[$i] === "\n" ? "\n" : ' '; $i++; }
            $code .= '  '; $i += 2;
        } elseif ($c === "'" || $c === '"') {
            $q = $c; $code .= $q; $i++;
            while ($i < $n && $src[$i] !== $q && $src[$i] !== "\n") {
                if ($src[$i] === '\\') { $code .= ' '; $i++; }
                $code .= $i < $n ? ($src[$i] === "\n" ? "\n" : 'x') : '';
                $i++;
            }
            $code .= $q; $i++;
        } else { $code .= $c; $i++; }
    }
    foreach ($names as $fn) {
        $off = 0;
        while (($p = strpos($code, $fn . '(', $off)) !== false) {
            $off = $p + 1;
            if ($p > 0 && preg_match('/[A-Za-z0-9_$.]/', $code[$p - 1]) && $fn === 'setStatus') { continue; }
            if (preg_match('/function\s+$/', substr($code, max(0, $p - 12), 12))) { continue; }
            // split top-level arguments of the call
            $depth = 0; $args = array(); $start = $p + strlen($fn) + 1; $j = $start;
            for (; $j < $n; $j++) {
                $ch = $code[$j];
                if ($ch === '(' || $ch === '[' || $ch === '{') { $depth++; }
                elseif ($ch === ')' || $ch === ']' || $ch === '}') {
                    if ($depth === 0) { break; }
                    $depth--;
                } elseif ($ch === ',' && $depth === 0) { $args[] = substr($code, $start, $j - $start); $start = $j + 1; }
            }
            $args[] = substr($code, $start, $j - $start);
            $first = trim($args[0]);
            $cleared = ($first === "''" || $first === '""' || $first === '');
            $coded = count($args) >= 2 && !in_array(trim($args[1]), array('', "''", '""'), true);
            if (!$cleared && !$coded) {
                $problems[] = $name . ':' . (substr_count($code, "\n", 0, $p) + 1) . '  ' . $fn . '(' . preg_replace('/\s+/', ' ', substr($src, $p + strlen($fn) + 1, 60)) . '...';
            }
        }
    }
}

if ($problems) {
    echo 'Uncoded status messages: ' . count($problems) . " call(s)\n\n";
    foreach ($problems as $p) { echo "  $p\n"; }
    echo "\nA status-bar message with no code reaches Tom's mailbox as \"Message on the map: status\",\n";
    echo "and nobody can tell which message the visitor meant. Pass a short kebab-case code naming\n";
    echo "the situation as the second argument, e.g. setStatus(text, 'engine-refused'), in the style\n";
    echo "of 'no-fixed-head'. A clearing call, setStatus(''), needs none.\n";
    exit(1);
}

echo "Status codes -- $files js file(s) scanned, every setStatus message states its code.\n";
exit(0);
