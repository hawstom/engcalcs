<?php
/**
 * NO NEW HARD-CODED CHROME COLOUR (Task 714, Phase 1; dev/theming-plan.md).
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY. A dark theme is "write the dark values once" only while every colour of the application's
 * chrome comes from a token. One hard-coded `#ddd` left in a rule is a light patch on a dark box,
 * and it is invisible to whoever wrote it, because their screen is the light one. So the rule is
 * held here, before the dark set exists, while it is cheap.
 *
 * WHAT IT REFUSES, in three legs:
 *   1. css/engcalcs.css: a colour literal (#hex, rgb(), rgba(), a named colour) anywhere outside
 *      the token block (`ec-colour-tokens:begin` ... `:end`), unless the rule is on the allow-list
 *      in chrome_colour_allow.json. Every allow-list entry carries its reason: the map's own ink,
 *      the print sheet and the pre-existing dark rule are DATA or PAPER, not chrome.
 *   2. Every `var(--ec-...)` anywhere must be DECLARED in the token block. An undeclared token is
 *      not an error to a browser: the property silently drops, and the control loses its colour.
 *   3. Inline colour literals in js/*.js and the PHP pages (style="" and style writes) may not rise
 *      above the per-file count recorded in the allow-list. They are chrome debt for Phase 1b, and
 *      a ratchet is the honest way to hold a debt: it may fall, never rise. js/lpn-ramps.js is
 *      colour-ramp DATA and is exempt; spock.php is a private page with its own stylesheet.
 *
 *   php dev/scripts/chrome_colour_check.php            check
 *   php dev/scripts/chrome_colour_check.php --baseline print the inline counts, for the allow-list
 *
 * Flags, never fixes. The fix is a token: add a name to the block with the value, and use it.
 */
$root = realpath(__DIR__ . '/../..');
$allow = json_decode(file_get_contents(__DIR__ . '/chrome_colour_allow.json'), true);
if (!$allow) { fwrite(STDERR, "chrome_colour_allow.json does not parse\n"); exit(1); }

const COLOUR_RE = '/#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|(?<![-\w.])(?:white|black|red|blue|green|gray|grey|orange|yellow|silver|navy|maroon|purple|teal|lime|aqua|fuchsia|olive)(?![-\w])/i';
const INLINE_RE = '/([\'"(:\s=])(#[0-9a-fA-F]{3,8}\b|rgba?\()/';
const SKIP_INLINE = ['spock.php'];

function blankComments(string $s): string {
    return preg_replace_callback('~/\*.*?\*/~s', fn($m) => preg_replace('/[^\n]/', ' ', $m[0]), $s);
}

/** Every declaration block as [start, end, pathOfPreludes]. */
function ruleBlocks(string $t): array {
    $out = []; $stack = []; $seg = 0; $n = strlen($t);
    for ($i = 0; $i < $n; $i++) {
        $c = $t[$i];
        if ($c === '{') { $stack[] = trim(preg_replace('/\s+/', ' ', substr($t, $seg, $i - $seg))); $seg = $i + 1; }
        elseif ($c === '}') {
            if ($stack) { $out[] = [$seg, $i, $stack]; array_pop($stack); }
            $seg = $i + 1;
        }
    }
    return $out;
}

function lineOf(string $s, int $off): int { return substr_count($s, "\n", 0, $off) + 1; }

$problems = [];

// ---- leg 1: CSS literals --------------------------------------------------------------------
$cssFile = $root . '/css/engcalcs.css';
$css = file_get_contents($cssFile);
$beginPos = strpos($css, '/* ec-colour-tokens:begin */');
$endPos = strpos($css, '/* ec-colour-tokens:end */');
if ($beginPos === false || $endPos === false || $endPos < $beginPos) {
    $problems[] = 'css/engcalcs.css: the token block markers `ec-colour-tokens:begin` / `:end` are missing.';
    $beginPos = $endPos = 0;
}
$block = substr($css, $beginPos, $endPos - $beginPos);
$declared = [];
if (preg_match_all('/--(ec-[\w-]+)\s*:/', $block, $m)) { $declared = array_flip($m[1]); }

$blank = blankComments($css);
$cssHits = 0; $allowedHits = 0;
foreach (ruleBlocks($blank) as [$s, $e, $path]) {
    if ($s >= $beginPos && $e <= $endPos + 30) { continue; }
    $body = substr($blank, $s, $e - $s);
    if (!preg_match_all(COLOUR_RE, $body, $mm, PREG_OFFSET_CAPTURE)) { continue; }
    $pathOk = false;
    foreach ($allow['css_rules'] as $rule) {
        foreach ($path as $p) { if (preg_match('~' . $rule['path'] . '~', $p)) { $pathOk = true; break 2; } }
    }
    foreach ($mm[0] as [$lit, $off]) {
        $k = strrpos(substr($body, 0, $off), ';'); $k = $k === false ? 0 : $k + 1;
        $prop = trim(explode(':', substr($body, $k, $off - $k), 2)[0]);
        $propOk = false;
        if (strncmp($prop, '--', 2) === 0) {
            foreach ($allow['css_custom_properties'] as $cp) { if (preg_match('~' . $cp['prop'] . '~', $prop)) { $propOk = true; } }
        }
        if ($pathOk || $propOk) { $allowedHits++; continue; }
        $cssHits++;
        $problems[] = sprintf("css/engcalcs.css:%d  `%s` in `%s { %s: ... }`\n    A hard-coded colour in chrome. Add a token to the ec-colour-tokens block and use var(--ec-...),\n    or, if this is the map's own ink or paper, add its rule to dev/scripts/chrome_colour_allow.json with the reason.",
            lineOf($css, $s + $off), $lit, end($path), $prop);
    }
}

// ---- leg 2: every var(--ec-X) is declared ---------------------------------------------------
$files = array_merge(['css/engcalcs.css'], array_map(fn($f) => 'js/' . basename($f), glob($root . '/js/*.js')),
    array_map('basename', glob($root . '/*.php')),
    array_map(fn($f) => 'lib/' . basename($f), array_filter(glob($root . '/lib/*.php'), fn($f) => strpos(basename($f), 'lang.ec.') !== 0)));
$exempt = $allow['inline_ratchet']['exempt_files'];
$counts = [];
foreach ($files as $rel) {
    if (in_array($rel, $exempt, true)) { continue; }
    $path = ($rel[0] === '/' ? '' : $root . '/') . $rel;
    $src = file_get_contents($path);
    if (preg_match_all('/var\(\s*--(ec-[\w-]+)/', $src, $mm, PREG_OFFSET_CAPTURE)) {
        foreach ($mm[1] as [$name, $off]) {
            if (!isset($declared[$name])) {
                $problems[] = sprintf("%s:%d  var(--%s) is not declared in the token block. A browser drops the property silently,\n    so the control loses its colour with no error anywhere.", $rel, lineOf($src, $off), $name);
            }
        }
    }
    if ($rel === 'css/engcalcs.css' || in_array($rel, SKIP_INLINE, true)) { continue; }
    $n = preg_match_all(INLINE_RE, $src);
    if ($n) { $counts[$rel] = $n; }
}
ksort($counts);

if (in_array('--baseline', $argv, true)) { echo json_encode($counts, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), "\n"; exit(0); }

// ---- leg 3: the inline ratchet --------------------------------------------------------------
$base = $allow['inline_ratchet']['counts'];
foreach ($counts as $rel => $n) {
    $b = $base[$rel] ?? 0;
    if ($n > $b) {
        $problems[] = sprintf("%s: %d inline colour literal(s), the recorded ceiling is %d. Write var(--ec-...) in the style\n    string instead (a token name works inside style=\"\" and in a style write), or, for a data colour, raise the\n    ceiling in dev/scripts/chrome_colour_allow.json with a reason.", $rel, $n, $b);
    }
}
$slack = [];
foreach ($base as $rel => $b) { $n = $counts[$rel] ?? 0; if ($n < $b) { $slack[] = "$rel $b -> $n"; } }

if ($problems) {
    echo 'chrome colour check: ' . count($problems) . " problem(s)\n\n";
    foreach ($problems as $p) { echo "  $p\n\n"; }
    echo "Why: a dark theme is only \"write the dark values once\" while every chrome colour is a token\n(dev/theming-plan.md, Task 714).\n";
    exit(1);
}
printf("chrome colour check OK -- %d token(s) declared, 0 literals outside the block, %d literal(s) in allow-listed map/print rules, inline ceilings held in %d file(s)%s.\n",
    count($declared), $allowedHits, count($counts), $slack ? ' (ceilings can fall: ' . implode(', ', $slack) . ')' : '');
