<?php
/**
 * Reports source files and functions that have grown past the point where they can be reasoned
 * about -- or tested -- in one piece.
 *
 * WHY THIS EXISTS, AND WHY IT IS ADVISORY. js/looped-network.js is 8,381 lines: 58% of all the
 * JavaScript in the suite, 327 functions in one closure sharing ~30 mutable variables. No single
 * commit did that. It arrived one reasonable-looking addition at a time, which is how every file
 * of that size arrives, and nothing in the repo ever said so out loud.
 *
 * The consequence is not ugliness, it is untestability. The lpn SOLVER has eleven harnesses
 * because it is 641 lines with clean inputs and outputs; the lpn EDITOR has none, because you
 * cannot get hold of any part of it without the other 8,000 lines and a browser. That is the
 * direct cause of the manual-browser-testing load this project keeps trying to reduce.
 *
 * So this check does not block, and it must not: nothing here is a defect, and a check that fails
 * a build over a judgement call is a check that gets muted -- which is how you lose the signal
 * entirely. Its whole job is to make growth VISIBLE, so that "this file got worse this quarter"
 * is something you can see rather than something you discover during a refactor.
 *
 * The useful response is rarely "split the file". It is: find the parts that are secretly pure --
 * they take values and return values, and only touch shared state by accident of where they sit --
 * and lift those out first. Each one becomes testable without a browser, which is the whole point.
 *
 * --strict exits non-zero. Default exits 0.
 */

$root = dirname(__DIR__, 2);
$strict = in_array('--strict', $argv, true);

const FILE_LINES   = 1500;  // beyond this, nobody reads the file, they grep it
const FUNC_LINES   = 80;    // beyond this, a function stops fitting on a screen or in a head

$targets = array_merge(
    glob($root . '/js/*.js'),
    glob($root . '/lib/*.php'),
    glob($root . '/*.php')
);

$bigFiles = [];
$bigFuncs = [];

foreach ($targets as $path) {
    $name = str_replace($root . '/', '', $path);
    // Language files are data, not code -- a 1,616-line list of strings is exactly what it should
    // be, and flagging it would train the reader to ignore this check's output.
    if (preg_match('#lib/lang\.ec\.[a-z]{2}\.php$#', $name)) continue;

    $lines = file($path);
    $count = count($lines);
    if ($count > FILE_LINES) $bigFiles[$name] = $count;

    // Brace-counted function extents. Deliberately simple: it is looking for functions that are
    // hundreds of lines long, and a heuristic that is off by a few lines still finds those.
    $depth = 0; $start = null; $fname = '';
    foreach ($lines as $i => $line) {
        $stripped = preg_replace('#//.*$#', '', $line);
        if ($start === null &&
            preg_match('/\bfunction\s+([A-Za-z0-9_$]+)\s*\(/', $stripped, $m) &&
            substr_count($stripped, '{') > 0) {
            $start = $i; $fname = $m[1]; $depth = 0;
        }
        if ($start !== null) {
            $depth += substr_count($stripped, '{') - substr_count($stripped, '}');
            if ($depth <= 0 && $i > $start) {
                $len = $i - $start + 1;
                if ($len > FUNC_LINES) $bigFuncs[] = [$name, $fname, $start + 1, $len];
                $start = null;
            }
        }
    }
}

arsort($bigFiles);
usort($bigFuncs, fn($a, $b) => $b[3] <=> $a[3]);

if (!$bigFiles && !$bigFuncs) {
    echo "Size budget OK -- no file over " . FILE_LINES . " lines, no function over " . FUNC_LINES . ".\n";
    exit(0);
}

if ($bigFiles) {
    echo "FILES over " . FILE_LINES . " lines (" . count($bigFiles) . "):\n";
    foreach ($bigFiles as $n => $c) printf("   %6d  %s\n", $c, $n);
    echo "\n";
}
if ($bigFuncs) {
    echo "FUNCTIONS over " . FUNC_LINES . " lines (" . count($bigFuncs) . ", longest first):\n";
    foreach (array_slice($bigFuncs, 0, 15) as [$n, $f, $l, $len]) {
        printf("   %4d lines  %s:%d  %s()\n", $len, $n, $l, $f);
    }
    if (count($bigFuncs) > 15) printf("   ... and %d more\n", count($bigFuncs) - 15);
    echo "\n";
}

echo "Advisory: nothing above is a defect. It is a map of where the code has stopped being\n";
echo "testable without a browser. Pull the pure parts out first. Pass --strict to exit non-zero.\n";
exit($strict ? 1 : 0);
