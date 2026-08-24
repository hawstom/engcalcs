<?php
/**
 * focus_order_check.php -- how many keyboard stops does a calculator form cost to walk?
 *
 * WHY THIS EXISTS (ROADMAP Task 478). Tom, tabbing down a calculator: the cursor does not walk
 * the input column, it walks sideways through every unit select and every per-line hide control.
 * The count was guessed at twenty-three; measured, it was eighty-three on Irrigation-Pressure. A
 * number nobody can reproduce gets re-guessed, so it is measured here.
 *
 * THE STOP COUNTS ARE ADVISORY; THE x-cross COLUMN IS NOT. The per-line "X" is a real tab stop on
 * purpose -- it is the only way to hide a line, so taking it off the keyboard would make the
 * function mouse-only (WCAG 2.1.1 by omission). That cost is accepted, and the `hide` column
 * simply reports it. What DOES fail the build: a page that will not render, a calculator page with
 * no #formInput, and a page laid out by echoInputGrid() whose x-cross is not zero -- see
 * unit_select_crossings() below. None of the three is a judgement call.
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
 * The Task 478 measurement: number inputs that come after a unit select.
 *
 * Tab order is DOM order. The input form used to be a <table>, whose DOM is row-major, so every
 * number box led sideways into its own unit select and its "X" before the next number -- walking
 * the input column cost about twice as many stops as there were numbers. echoInputGrid() emits the
 * same lines as a grid whose DOM is COLUMN-MAJOR, and this number went to zero on all fifteen
 * pages it builds.
 *
 * SO IT BLOCKS NOW, and the gate is a PROPERTY OF THE PAGE, not a per-page allowance: a page that
 * renders `.ec-fieldgrid` must be at zero. Nothing here is exempted by name and no page carries a
 * budget it had to be given. Looped-Network.php is the one calculator not built by
 * echoCalculatorForm() -- its inputs are a per-element property sheet in Looped-Network.php and
 * js/looped-network.js -- so it has no grid, is still measured, and is still only reported.
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
    $crossings = unit_select_crossings($stops);
    $isGrid = strpos($html, 'class="ec-fieldgrid"') !== false;
    $rows[] = array($name, count($stops), $hide, $kinds, $crossings, $isGrid);

    if ($isGrid && $crossings > 0) {
        $fail[] = "$name: $crossings number input(s) come AFTER a unit select in the tab order, on a"
            . " page laid out by echoInputGrid(). That grid's DOM is column-major so Tab walks the"
            . " whole input column (ROADMAP Task 478); a crossing means a cell was emitted out of"
            . " its column group, or a control carrying its own <select> was added to a label cell"
            . " ahead of one carrying an <input>. Fix the emission order in echoInputGrid()"
            . " (lib/Calculators.lib.php) -- never with tabindex, which takes the control off the"
            . " keyboard altogether.";
    }

    if ($verbose) {
        echo "  $name focus sequence:\n";
        foreach ($stops as $i => $s) {
            printf("    %3d  %-8s %s%s\n", $i + 1, $s[0], $s[1], $s[2] ? '   [hide control]' : '');
        }
    }
}

// ---- the stop table, so these numbers are never guessed again -----------------------------
usort($rows, function ($a, $b) { return $b[1] - $a[1]; });
printf("%-28s %6s %6s %8s %5s  %s\n", 'page', 'stops', 'hide', 'x-cross', 'grid', 'by kind');
foreach ($rows as $r) {
    $kinds = array();
    foreach ($r[3] as $k => $n) { $kinds[] = "$k=$n"; }
    printf("%-28s %6d %6d %8d %5s  %s\n", $r[0], $r[1], $r[2], $r[4], $r[5] ? 'yes' : '-', implode(' ', $kinds));
}
echo "\n";
echo "hide    = stops inside a .engcalcs-x cell -- one per line, the accepted cost of\n";
echo "          keeping the only way to hide a line on the keyboard.\n";
echo "x-cross = number inputs that come after a unit select. BLOCKING wherever grid=yes.\n";
echo "grid    = the input form is echoInputGrid()'s column-major grid (ROADMAP Task 478).\n";

if ($fail) {
    echo "\nFAIL\n";
    foreach ($fail as $f) { echo "  $f\n"; }
    exit(1);
}
echo "\nOK: " . count($rows) . " calculator pages measured. The stop and hide counts are a\n";
echo "    measurement, not a budget; x-cross is a gate on every grid page.\n";
exit(0);
