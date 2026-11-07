<?php
/**
 * build_css.php -- writes css/engcalcs.min.css, the stylesheet the pages actually link.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3 or later
 *
 * WHY (ROADMAP Task 853). css/engcalcs.css is the developer's file: 344 KB of its 553 KB is
 * comments, and every calculator page downloaded all of it. The comments stay in that one
 * source file, where people edit it and where chrome_colour_check.php and adhoc_style_check.php
 * read it. This script copies it with the comments (and the blank lines they leave) removed.
 * Nothing else changes: no rule is rewritten, so the served file means exactly what the source means.
 *
 * Usage:
 *   php dev/scripts/build_css.php          write css/engcalcs.min.css
 *   php dev/scripts/build_css.php --check  exit 1 if it is stale, still holds a comment, parses
 *                                          differently from the source, or a page does not link it
 * check_all.sh runs --check, so an edit to the source that was not rebuilt fails there.
 */

/** Source text with comments removed. Strings and url(...) are copied whole, so a comment opener inside one survives. */
function ecCssStripComments($css) {
    $out = '';
    $n = strlen($css);
    $i = 0;
    while ($i < $n) {
        $c = $css[$i];
        if ($c === '/' && $i + 1 < $n && $css[$i + 1] === '*') {
            $end = strpos($css, '*/', $i + 2);
            if ($end === false) { $i = $n; break; }
            $i = $end + 2;
            continue;
        }
        if ($c === '"' || $c === "'") {
            $j = $i + 1;
            while ($j < $n && $css[$j] !== $c) { if ($css[$j] === '\\') $j++; $j++; }
            $out .= substr($css, $i, $j - $i + 1);
            $i = $j + 1;
            continue;
        }
        if (($c === 'u' || $c === 'U') && strncasecmp(substr($css, $i, 4), 'url(', 4) === 0) {
            $j = $i + 4;
            while ($j < $n && ($css[$j] === ' ' || $css[$j] === "\t")) $j++;
            if ($j < $n && $css[$j] !== '"' && $css[$j] !== "'") {   // unquoted url(): runs to ')'
                $end = strpos($css, ')', $j);
                $end = $end === false ? $n - 1 : $end;
                $out .= substr($css, $i, $end - $i + 1);
                $i = $end + 1;
                continue;
            }
        }
        $out .= $c;
        $i++;
    }
    return $out;
}

/** Trailing blanks off every line and no run of blank lines: what is left once the comments are gone. */
function ecCssTidy($css) {
    $css = preg_replace('/[ \t]+$/m', '', $css);
    $css = preg_replace('/\n{2,}/', "\n", $css);
    return ltrim($css, "\n");
}

function ecCssMinify($src) {
    return ecCssTidy(ecCssStripComments($src));
}

/** Whitespace-collapsed form, for comparing two texts by their rules alone. */
function ecCssRulesOnly($css) {
    return trim(preg_replace('/\s+/', ' ', ecCssStripComments($css)));
}

if (realpath($argv[0] ?? '') !== realpath(__FILE__)) return;

$root = dirname(__DIR__, 2);
$srcPath = $root . '/css/engcalcs.css';
$minPath = $root . '/css/engcalcs.min.css';
$src = file_get_contents($srcPath);
$want = ecCssMinify($src);

if (!in_array('--check', $argv, true)) {
    file_put_contents($minPath, $want);
    printf("wrote css/engcalcs.min.css: %d bytes from %d (gzip %d from %d)\n",
        strlen($want), strlen($src), strlen(gzencode($want, 6)), strlen(gzencode($src, 6)));
    exit(0);
}

$problems = [];
$have = is_file($minPath) ? file_get_contents($minPath) : null;
if ($have === null) {
    $problems[] = 'css/engcalcs.min.css is missing -- run: php dev/scripts/build_css.php';
} else {
    if ($have !== $want) {
        $problems[] = 'css/engcalcs.min.css is stale against css/engcalcs.css -- run: php dev/scripts/build_css.php';
    }
    if (ecCssStripComments($have) !== $have) {
        $problems[] = 'css/engcalcs.min.css still holds a comment';
    }
    if (ecCssRulesOnly($have) !== ecCssRulesOnly($src)) {
        $problems[] = 'css/engcalcs.min.css differs from the source in more than comments';
    }
    $plain = ecCssStripComments($src);
    foreach (['{', '}', ';', '"', "'", 'url('] as $tok) {
        $a = substr_count($plain, $tok);
        $b = substr_count($have, $tok);
        if ($a !== $b) $problems[] = "token $tok count differs: source (comment-free) $a, served $b";
    }
    if (substr_count($have, '{') !== substr_count($have, '}')) $problems[] = 'unbalanced braces in the served file';
}

// A calculator page and the map page both link the served file, with the mtime query, and not the source.
foreach (['Manning-Pipe-Flow.php', 'Looped-Network.php'] as $page) {
    $html = shell_exec(sprintf('php %s %s 2>/dev/null',
        escapeshellarg($root . '/dev/scripts/render_page.php'), escapeshellarg($page)));
    if (!$html) { $problems[] = "$page did not render"; continue; }
    if (!preg_match('#href="/engcalcs/css/engcalcs\.min\.css\?v=\d+"#', $html)) {
        $problems[] = "$page does not link /engcalcs/css/engcalcs.min.css?v=<mtime>";
    }
    if (preg_match('#css/engcalcs\.css#', $html)) {
        $problems[] = "$page still links the commented source css/engcalcs.css";
    }
}

if ($problems) {
    foreach ($problems as $p) echo "FAIL  $p\n";
    exit(1);
}
printf("ok  engcalcs.min.css fresh (%d bytes, source %d), no comments, rules equal, linked by a calculator and the map page\n",
    strlen($have), strlen($src));
