<?php
/**
 * focus_order_check.php -- how many keyboard stops does a calculator form cost to walk?
 *
 * WHY THIS EXISTS (ROADMAP Task 478). Tom, tabbing down a calculator: the cursor does not walk
 * the input column, it walks sideways through every unit select and every per-line hide control.
 * The count was guessed at twenty-three; measured, it was eighty-three on Irrigation-Pressure. A
 * number nobody can reproduce gets re-guessed, so it is measured here.
 *
 * THIS SCRIPT IS ADVISORY. It measures; it does not judge. The per-line "X" is a real tab stop on
 * purpose -- it is the only way to hide a line, so taking it off the keyboard would make the
 * function mouse-only (WCAG 2.1.1 by omission). That cost is accepted, and the `hide` column
 * simply reports it. The one thing that still fails the build is a page that will not render at
 * all, or a calculator page with no #formInput -- neither is a judgement call.
 *
 * The live measurement is the x-cross column: ROADMAP Task 478 phase 2 (see PHASE 2 below).
 *
 * ONE SUBPROCESS PER PAGE, via dev/scripts/render_page.php -- see that file's header for why
 * rendering a page any other way silently produces a stub missing most of its unit selects.
 *
 * Usage:
 *   php dev/scripts/focus_order_check.php            # every calculator page
 *   php dev/scripts/focus_order_check.php -v         # + the full focus sequence per page
 *   php dev/scripts/focus_order_check.php Orifice.php
 *
 * Exit 0 unless a page fails to render or has no #formInput.
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
echo "hide    = stops inside a .engcalcs-x cell -- one per line, the accepted cost of\n";
echo "          keeping the only way to hide a line on the keyboard.\n";
echo "x-cross = number inputs that come after a unit select -- the phase 2 prize.\n";

if ($fail) {
    echo "\nFAIL\n";
    foreach ($fail as $f) { echo "  $f\n"; }
    exit(1);
}
echo "\nOK: " . count($rows) . " calculator pages measured. This script is advisory --\n";
echo "    the stop counts above are a measurement, not a budget.\n";
exit(0);
