<?php
/**
 * focus_order_check.php -- how many keyboard stops does a calculator form cost to walk?
 *
 * WHY THIS EXISTS (ROADMAP Task 478, 2026-08-21). Tom, tabbing down a calculator: the cursor does
 * not walk the input column, it walks sideways through every unit select and every per-line hide
 * control. The count was guessed at twenty-three; measured, it was eighty-three on
 * Irrigation-Pressure, and 35-43% of every stop on the five worst pages was the one-character "X"
 * link that hides a line. A number nobody can reproduce gets re-guessed, so it is measured here.
 *
 * BLOCKING (phase 1), two assertions:
 *   1. the per-line hide control contributes AT MOST ONE STOP per calculator. The X keeps working
 *      for mouse and touch; it carries tabindex="-1" + aria-hidden="true" -- the canonical
 *      duplicated-control pattern.
 *   2. THE KEYBOARD DOOR EXISTS: exactly one line chooser per page, closed, listing every line the
 *      X can hide. Without this, assertion 1 could be "passed" by deleting the chooser, which turns
 *      the tabindex="-1" into a WCAG 2.1.1 failure. The chooser sits OUTSIDE #formInput -- it is
 *      grouped with the Printable version button, because hiding a line is print preparation -- so
 *      it is measured against the whole document rather than the focus sequence.
 *
 * ADVISORY: the per-page stop table, and the phase-2 measurement (see PHASE 2 below).
 *
 * ONE SUBPROCESS PER PAGE, via dev/scripts/render_page.php -- see that file's header for why
 * rendering a page any other way silently produces a stub missing most of its unit selects.
 *
 * Usage:
 *   php dev/scripts/focus_order_check.php            # every calculator page
 *   php dev/scripts/focus_order_check.php -v         # + the full focus sequence per page
 *   php dev/scripts/focus_order_check.php Orifice.php
 *
 * Exit 0 when every page passes the blocking assertion, 1 otherwise.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */

$root = dirname(__DIR__, 2);
$verbose = in_array('-v', $argv, true) || in_array('--verbose', $argv, true);
$argvFiles = array_values(array_filter(array_slice($argv, 1), function ($a) { return substr($a, 0, 1) !== '-'; }));

/**
 * The page list is DERIVED, never typed: a calculator page is one whose source builds the input
 * form. A new calculator is therefore measured the day it is added, and a renamed one cannot fall
 * off the list silently.
 */
function calculator_pages($root)
{
    $pages = array();
    foreach (glob($root . '/*.php') as $p) {
        $src = file_get_contents($p);
        if (strpos($src, 'echoCalculatorForm') !== false || strpos($src, 'formInput') !== false) {
            $pages[] = $p;
        }
    }
    sort($pages);
    return $pages;
}

function render_page($path)
{
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
         . ' ' . escapeshellarg(basename($path)) . ' 2>/dev/null';
    $html = shell_exec($cmd);
    return ($html === null || trim($html) === '') ? null : $html;
}

/**
 * The focusable sequence inside #formInput, in DOM order -- which IS tab order, since the suite
 * uses no positive tabindex anywhere.
 *
 * Counted: input (not type=hidden), select, button, textarea, a[href].
 * Not counted:
 *   - anything carrying tabindex="-1" (removed from the tab order by definition);
 *   - anything inside a <details> with no `open` attribute. A closed <details> does not render
 *     its contents, so nothing inside it is focusable -- the summary is the one stop. That is the
 *     whole reason the line chooser is a <details> and not a <div>.
 *
 * Each stop is returned as array(kind, id-or-name, isHideControl).
 */
function focus_stops($html)
{
    $prev = libxml_use_internal_errors(true);
    $doc = new DOMDocument();
    $doc->loadHTML('<?xml encoding="UTF-8">' . $html);
    libxml_clear_errors();
    libxml_use_internal_errors($prev);

    $form = $doc->getElementById('formInput');
    if (!$form) { return null; }

    $stops = array();
    $walk = function ($node) use (&$walk, &$stops) {
        for ($child = $node->firstChild; $child; $child = $child->nextSibling) {
            if ($child->nodeType !== XML_ELEMENT_NODE) { continue; }
            $tag = strtolower($child->tagName);
            if ($tag === 'details' && !$child->hasAttribute('open')) {
                // Only the <summary> is reachable while it is closed.
                foreach (iterator_to_array($child->childNodes) as $c) {
                    if ($c->nodeType === XML_ELEMENT_NODE && strtolower($c->tagName) === 'summary') {
                        $stops[] = array('summary', $c->textContent, false);
                    }
                }
                continue;
            }
            $focusable = ($tag === 'select' || $tag === 'button' || $tag === 'textarea'
                || ($tag === 'input' && strtolower($child->getAttribute('type')) !== 'hidden')
                || ($tag === 'a' && $child->hasAttribute('href')));
            if ($focusable && $child->getAttribute('tabindex') !== '-1') {
                $label = $child->getAttribute('id');
                if ($label === '') { $label = $child->getAttribute('name'); }
                if ($label === '') { $label = trim(preg_replace('/\s+/', ' ', $child->textContent)); }
                $isHide = false;
                for ($a = $child->parentNode; $a && $a->nodeType === XML_ELEMENT_NODE; $a = $a->parentNode) {
                    if (strpos(' ' . $a->getAttribute('class') . ' ', ' engcalcs-x ') !== false) { $isHide = true; break; }
                }
                $stops[] = array($tag, $label, $isHide);
            }
            $walk($child);
        }
    };
    $walk($form);
    return $stops;
}

/**
 * The keyboard door, measured against the WHOLE document rather than the focus sequence: the
 * chooser is deliberately outside #formInput, grouped with the Printable version button.
 *
 * Returns how many per-line X hide links the page has, how many choosers, whether one ships open,
 * and how many lines the chooser offers.
 */
function chooser_state($html)
{
    $prev = libxml_use_internal_errors(true);
    $doc = new DOMDocument();
    $doc->loadHTML('<?xml encoding="UTF-8">' . $html);
    libxml_clear_errors();
    libxml_use_internal_errors($prev);

    $xpath = new DOMXPath($doc);
    $sel = '//details[contains(concat(" ", normalize-space(@class), " "), " engcalcs-line-chooser ")]';
    return array(
        'xlinks'   => $xpath->query('//td[contains(concat(" ", normalize-space(@class), " "), " engcalcs-x ")]/a')->length,
        'choosers' => $xpath->query($sel)->length,
        'boxes'    => $xpath->query($sel . '//input[@data-ec-line]')->length,
        'open'     => $xpath->query($sel . '[@open]')->length > 0,
    );
}

/**
 * PHASE 2 measurement, ADVISORY ON PURPOSE -- and this is the one place to flip it.
 *
 * Tab order is DOM order, and today each number input is immediately followed by its own unit
 * select, so walking the input column costs about twice as many stops as there are numbers.
 * Fixing it means the two inner <table>s become grids (only flex/grid has `order`), which is a
 * layout change to all sixteen calculators that no harness can see -- ROADMAP Task 478 phase 2.
 *
 * When that lands, make $crossings a BLOCKING failure here: "every number input precedes every
 * unit select in its column". Until then it is reported so the size of the prize stays measured.
 */
function unit_select_crossings($stops)
{
    $crossings = 0; $seenSelect = false;
    foreach ($stops as $s) {
        if ($s[0] === 'select') { $seenSelect = true; }
        elseif ($s[0] === 'input' && $seenSelect) { $crossings++; }
    }
    return $crossings;
}

$pages = $argvFiles
    ? array_map(function ($f) use ($root) { return $root . '/' . basename($f); }, $argvFiles)
    : calculator_pages($root);

$fail = array();
$rows = array();

foreach ($pages as $path) {
    $name = basename($path);
    $html = render_page($path);
    if ($html === null) {
        $fail[] = "$name: page did not render. Run `php dev/scripts/render_page.php $name` and read the error.";
        continue;
    }
    $door = chooser_state($html);
    $stops = focus_stops($html);
    if ($stops === null) {
        $fail[] = "$name: no #formInput in the rendered page. If this page is not a calculator, it should not match calculator_pages() in this script.";
        continue;
    }

    $kinds = array();
    $hide = 0;
    foreach ($stops as $s) {
        $kinds[$s[0]] = (isset($kinds[$s[0]]) ? $kinds[$s[0]] : 0) + 1;
        if ($s[2]) { $hide++; }
    }
    $rows[] = array($name, count($stops), $hide, $kinds, unit_select_crossings($stops));

    // ---- BLOCKING -----------------------------------------------------------------------
    if ($hide > 1) {
        $fail[] = "$name: the per-line hide control costs $hide keyboard stops (at most 1 allowed).";
    }
    if ($door['xlinks'] > 0) {
        if ($door['choosers'] !== 1) {
            $fail[] = "$name: {$door['xlinks']} per-line X hide links but {$door['choosers']} line choosers (exactly 1 required).";
        } elseif ($door['open']) {
            $fail[] = "$name: the line chooser ships open, so every checkbox in it is a keyboard stop. It must be a closed <details>.";
        } elseif ($door['boxes'] !== $door['xlinks']) {
            $fail[] = "$name: the line chooser offers {$door['boxes']} lines but the X hides {$door['xlinks']} -- the keyboard cannot reach every line the mouse can.";
        }
    }

    if ($verbose) {
        echo "  $name focus sequence:\n";
        foreach ($stops as $i => $s) {
            printf("    %3d  %-8s %s%s\n", $i + 1, $s[0], $s[1], $s[2] ? '   [hide control]' : '');
        }
    }
}

// ---- ADVISORY: the stop table, so this number is never guessed again ----------------------
usort($rows, function ($a, $b) { return $b[1] - $a[1]; });
printf("%-28s %6s %6s %8s  %s\n", 'page', 'stops', 'hide', 'x-cross', 'by kind');
foreach ($rows as $r) {
    $kinds = array();
    foreach ($r[3] as $k => $n) { $kinds[] = "$k=$n"; }
    printf("%-28s %6d %6d %8d  %s\n", $r[0], $r[1], $r[2], $r[4], implode(' ', $kinds));
}
echo "\n";
echo "hide    = stops inside a .engcalcs-x cell (blocking: at most 1 per page).\n";
echo "x-cross = number inputs that come after a unit select -- the phase 2 prize, advisory only.\n";

if ($fail) {
    echo "\nFAIL\n";
    foreach ($fail as $f) { echo "  $f\n"; }
    echo "\n";
    echo "  Every `<td class=\"engcalcs-x\">` link -- the one whose whole accessible name is \"X\" --\n";
    echo "  is in the tab order, once per line, and there is no keyboard way back.\n";
    echo "  FIX, in lib/Calculators.lib.php: give that <a> BOTH tabindex=\"-1\" and aria-hidden=\"true\"\n";
    echo "  (the pair is required -- aria-hidden alone on a focusable element fails axe's\n";
    echo "  aria-hidden-focus rule), and keep the keyboard path to the same function in the ONE\n";
    echo "  closed <details> line chooser echoLineChooser() emits beside the Printable version\n";
    echo "  button, which costs one stop while closed and lists every line the X can hide.\n";
    exit(1);
}
echo "\nOK: " . count($rows) . " calculator pages, the line-hide control costs at most one stop on each,\n";
echo "    and each has one closed line chooser listing every line the X can hide.\n";
exit(0);
