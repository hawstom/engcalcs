<?php
/**
 * unit_select_name_check.php -- every <select> a calculator page renders has an accessible name.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 685, Tom ruled it 2026-09-17: "name each one after its own
 * field"). `echoUnitSelect()` had never been handed the label sitting beside it. Counted across
 * the rendered suite before the fix: of 430 form controls, 272 carried no accessible name, and
 * 226 of those were unit selects -- essentially every one in the suite. A screen reader announces
 * "combo box, feet" with no way to know which field it belongs to, on every single line of every
 * calculator. The failure renders perfectly -- a sighted visitor sees the label right there in the
 * next cell -- which is exactly why nothing else here ever caught it.
 *
 * WHAT COUNTS AS A NAME, in the order a browser's accessible-name computation would actually
 * prefer one: a non-empty `aria-label`; a non-empty `aria-labelledby` whose id(s) resolve to
 * elements carrying visible text; a `<label for="that select's id">` with visible text; or the
 * select sitting inside a `<label>...</label>` with visible text (the implicit form). Anything
 * else is the defect this check exists to catch -- including an `aria-label=""` or an
 * `aria-labelledby` pointing at an id that resolves to nothing or to empty text, which look fixed
 * at a glance and are not.
 *
 * READS THE RENDERED PAGE, one subprocess per page via render_page.php (see that script and
 * html_balance_check.php on why: an include from inside a function drops the bootstrap globals
 * and silently renders a stub with most of the page missing, including most of its selects).
 *
 * SCOPE IS THE 16 CALCULATOR PAGES named in CLAUDE.md's prefix table -- the suite's core product,
 * and the set Task 685 counted against. A defect on an admin page (About, Install,
 * Compare-Languages) is real but is not this task's number and would pull pages this check cannot
 * render outside a browser (Install.php ends the process) into a check that is meant to gate every
 * commit.
 *
 * Usage:
 *   php dev/scripts/unit_select_name_check.php
 *   php dev/scripts/unit_select_name_check.php Looped-Network.php
 *
 * Exit 0 = every <select> on every checked page has an accessible name. Exit 1 = one does not.
 */

/**
 * The visible text of the first element in $html carrying id="$id", or null if no such element
 * is found or its close tag cannot be matched. Depth-counts the tag so a label wrapping other
 * elements of its own kind (rare here, but cheap to get right) still resolves correctly.
 *
 * Pure, so the selftest can drive it directly.
 */
function ecElementTextById(string $html, string $id): ?string
{
    if (!preg_match('/\bid\s*=\s*(["\'])' . preg_quote($id, '/') . '\1/i', $html, $m, PREG_OFFSET_CAPTURE)) {
        return null;
    }
    $idOffset = $m[0][1];
    $tagStart = strrpos(substr($html, 0, $idOffset), '<');
    if ($tagStart === false) return null;
    if (!preg_match('/^<([a-zA-Z][a-zA-Z0-9]*)/', substr($html, $tagStart), $mt)) return null;
    $tag = $mt[1];
    $openEnd = strpos($html, '>', $tagStart);
    if ($openEnd === false) return null;
    if ($html[$openEnd - 1] === '/') { return ''; } // self-closing: no content, no crash.

    $re = '/<(\/)?' . preg_quote($tag, '/') . '(\s[^>]*?)?(\/)?>/i';
    $offset = $openEnd + 1;
    $depth = 1;
    $contentEnd = null;
    while (preg_match($re, $html, $mm, PREG_OFFSET_CAPTURE, $offset)) {
        $mOffset = $mm[0][1];
        $offset = $mOffset + strlen($mm[0][0]);
        if (isset($mm[3]) && $mm[3][0] === '/') { continue; } // self-closing child, not a pair.
        $depth += ($mm[1][0] === '/') ? -1 : 1;
        if ($depth === 0) { $contentEnd = $mOffset; break; }
    }
    if ($contentEnd === null) return null;

    $inner = substr($html, $openEnd + 1, $contentEnd - $openEnd - 1);
    return trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags($inner), ENT_QUOTES, 'UTF-8')));
}

/**
 * Every <select> in $html with no accessible name, as one finding string per select.
 *
 * @param string $html      Rendered page HTML.
 * @param string $pageLabel Printed ahead of each finding (the page name).
 * @return array<int,string>
 */
function ecUnitSelectNameFindings(string $html, string $pageLabel): array
{
    $out = [];
    if (!preg_match_all('/<select\b[^>]*>/i', $html, $m, PREG_OFFSET_CAPTURE)) {
        return $out;
    }

    // Every <label ...>...</label> span in the document, non-greedy: this codebase writes no
    // <label> nested inside another, so pairing each opening tag with the NEXT </label> is exact
    // rather than an approximation, and it is what lets rule 4 below be a single offset test.
    preg_match_all('/<label\b[^>]*>(.*?)<\/label>/is', $html, $labelBlocks, PREG_OFFSET_CAPTURE);

    foreach ($m[0] as $mm) {
        $tag = $mm[0];
        $offset = $mm[1];

        $id = null;
        if (preg_match('/\bid\s*=\s*(["\'])(.*?)\1/i', $tag, $mi)) { $id = $mi[2]; }
        $name = null;
        if (preg_match('/\bname\s*=\s*(["\'])(.*?)\1/i', $tag, $mn)) { $name = $mn[2]; }

        $named = false;

        // 1. aria-label.
        if (!$named && preg_match('/\baria-label\s*=\s*(["\'])(.*?)\1/is', $tag, $ml)) {
            if (trim(html_entity_decode($ml[2], ENT_QUOTES, 'UTF-8')) !== '') { $named = true; }
        }

        // 2. aria-labelledby: one or more ids, space separated; concatenated text must be non-empty.
        if (!$named && preg_match('/\baria-labelledby\s*=\s*(["\'])(.*?)\1/is', $tag, $mlb)) {
            $text = '';
            foreach (preg_split('/\s+/', trim($mlb[2])) as $rid) {
                if ($rid === '') { continue; }
                $t = ecElementTextById($html, $rid);
                if ($t) { $text .= $t . ' '; }
            }
            if (trim($text) !== '') { $named = true; }
        }

        // 3. <label for="id"> with visible text.
        if (!$named && $id !== null && $id !== '') {
            $forRe = '/<label\b[^>]*\bfor\s*=\s*(["\'])' . preg_quote($id, '/') . '\1[^>]*>(.*?)<\/label>/is';
            if (preg_match($forRe, $html, $mf)) {
                if (trim(preg_replace('/\s+/', ' ', strip_tags($mf[2]))) !== '') { $named = true; }
            }
        }

        // 4. Implicit <label>...<select>...</label> wrapping, with visible text.
        if (!$named) {
            foreach ($labelBlocks[0] as $i => $whole) {
                $start = $whole[1];
                $end = $start + strlen($whole[0]);
                if ($offset <= $start || $offset >= $end) { continue; }
                if (trim(preg_replace('/\s+/', ' ', strip_tags($labelBlocks[1][$i][0]))) !== '') {
                    $named = true;
                    break;
                }
            }
        }

        if ($named) { continue; }

        $ident = $id !== null ? "id=\"$id\"" : ($name !== null ? "name=\"$name\"" : '(no id or name)');
        $out[] = "$pageLabel: <select $ident> has no accessible name -- a screen reader announces "
               . "\"combo box\" plus whatever unit is selected, with nothing saying which field it "
               . "belongs to.";
    }

    return $out;
}

if (defined('UNIT_SELECT_NAME_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

// The 16 calculators named in CLAUDE.md's Variable Prefix Convention table -- the set Task 685
// counted against, and the set every page this check can render in isolation without ending the
// process (Install.php) or needing query parameters no visitor's first hit supplies.
$CALC_PAGES = [
    'Darcy-Weisbach.php', 'Hazen-Williams.php', 'Manning-Pipe-Flow.php', 'Manning-Pipe-Head-Loss.php',
    'Manning-Trap.php', 'Manning-Irregular.php', 'Weir-Flow-Simple.php', 'Weir-Flow-Irregular.php',
    'Orifice.php', 'Orifice-Drain-Time.php', 'Rock-Chute.php', 'Canal-Seepage.php',
    'Irrigation-Pressure.php', 'Micro-Hydro-Power.php', 'Branched-Network.php', 'Looped-Network.php',
];

function render_page_for_select_check($path)
{
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
         . ' ' . escapeshellarg(basename($path)) . ' 2>/dev/null';
    $html = shell_exec($cmd);
    return ($html === null || trim($html) === '') ? null : $html;
}

$argvFiles = array_values(array_filter(array_slice($argv, 1), function ($a) { return substr($a, 0, 1) !== '-'; }));
$pages = $argvFiles ?: $CALC_PAGES;

$failures = 0;
$checked = 0;
$skipped = [];
foreach ($pages as $page) {
    $path = $root . '/' . basename($page);
    if (!is_file($path)) {
        echo "MISSING  " . basename($page) . "\n";
        $failures++;
        continue;
    }
    $html = render_page_for_select_check($path);
    if ($html === null) {
        echo "SKIP     " . basename($page) . " (could not be rendered in isolation)\n";
        $skipped[] = basename($page);
        continue;
    }
    $checked++;
    $problems = ecUnitSelectNameFindings($html, basename($page));
    if ($problems) {
        $failures += count($problems);
        echo "FAIL     " . basename($page) . " (" . count($problems) . ")\n";
        foreach ($problems as $p) { echo "           " . $p . "\n"; }
    } else {
        echo "ok       " . basename($page) . "\n";
    }
}

echo "\n$checked of " . count($pages) . " page(s) checked, $failures unnamed select(s)";
echo $skipped ? ', ' . count($skipped) . ' skipped: ' . implode(', ', $skipped) . ".\n" : ".\n";
exit($failures ? 1 : 0);
