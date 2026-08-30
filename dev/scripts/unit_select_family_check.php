<?php
/**
 * unit_select_family_check.php — a unit <select> always names a FAMILY, never a raw array. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. `echoUnitSelect($name, $units, $indent)` still accepts a raw array of unit names
 * for backward compatibility, and that path is the one CLAUDE.md forbids: the function writes
 * `data-family=""` for it, and **`data-family` is the only handle the US/SI preset buttons have.**
 * A select built from a raw array therefore renders perfectly, offers the right options, converts
 * nothing when a preset is pressed, and shows no error anywhere. It is also invisible to
 * `unit_family_check.php`, which reads `'units' => '<name>'` string declarations and cannot see an
 * array literal at all. 32 row-table selects were nearly shipped in exactly this state.
 *
 * TWO DOORS TO THE SAME DEFECT, so this reads both:
 *
 *   1. **The direct call** — `echoUnitSelect('xu', array('ft','m'), '')`. Rare, and the shape the
 *      rule names.
 *   2. **The DECLARATION** — `'units' => array('ft','m')` in a page's `$arrayInputs` /
 *      `$arrayResults`. This is the one that actually happens, because a page author writes a field
 *      declaration and never sees `echoUnitSelect()` at all: `echoCalculatorForm()` passes
 *      `$input['units']` straight through, so the array arrives at the raw-array path from a line
 *      that does not mention the function. Every row-table page is built this way.
 *
 * WHAT IT CANNOT SEE, SAID PLAINLY RATHER THAN GLOSSED. The second argument is checked only when it
 * is a LITERAL. `echoUnitSelect($n . 'u', $input['units'], '')` in `lib/Calculators.lib.php` hands
 * over a value this check cannot follow, and a page that stores its family list in a variable first
 * is equally out of reach. The check counts those call sites and prints the count, so its own blind
 * spot is a number on the screen rather than a silence. Door 2 above is what makes that acceptable:
 * the seam the library passes through is fed by declarations, and the declarations are literals.
 *
 * WHY IT BLOCKS. There is no reading of this repository in which a raw array is correct today — the
 * families exist, every page uses them, and the compatibility path is kept only so an old call does
 * not fatal. A finding is a mechanical fact with no judgement in it, and the defect it names is
 * silent by construction.
 *
 * Usage:
 *   php dev/scripts/unit_select_family_check.php
 *
 * Exit 0 = every unit select names a family. Exit 1 = at least one raw array, with file and line.
 */

/**
 * Findings in one PHP source. Pure, so the selftest can hand it a broken world.
 *
 * Kinds: 'call' (echoUnitSelect with a literal array), 'declaration' ('units' => a literal array),
 * 'opaque' (echoUnitSelect whose family argument is not a literal — informational, never a failure).
 *
 * @param string $php Source text.
 * @return array<int,array{0:string,1:int,2:string}> [kind, line, excerpt] triples.
 */
function ecRawUnitArrayFindings(string $php): array
{
    $tokens = @token_get_all($php);
    $n = count($tokens);
    $out = [];

    /** The next significant token index at or after $i, or -1. */
    $sig = function (int $i) use ($tokens, $n): int {
        for (; $i < $n; $i++) {
            $t = $tokens[$i];
            if (is_array($t) && ($t[0] === T_WHITESPACE || $t[0] === T_COMMENT
                || $t[0] === T_DOC_COMMENT)) {
                continue;
            }
            return $i;
        }
        return -1;
    };
    /** Is the token at $i the start of an array literal? */
    $isArrayStart = function (int $i) use ($tokens): bool {
        if ($i < 0) { return false; }
        $t = $tokens[$i];
        return $t === '[' || (is_array($t) && $t[0] === T_ARRAY);
    };

    for ($i = 0; $i < $n; $i++) {
        $t = $tokens[$i];

        // ---- door 2: 'units' => <array literal> -------------------------------------------------
        // Read first, because it is the shape that actually ships.
        if (is_array($t) && $t[0] === T_CONSTANT_ENCAPSED_STRING
            && trim($t[1], "'\"") === 'units') {
            $j = $sig($i + 1);
            if ($j >= 0 && is_array($tokens[$j]) && $tokens[$j][0] === T_DOUBLE_ARROW) {
                $k = $sig($j + 1);
                if ($isArrayStart($k)) {
                    $out[] = ['declaration', $t[2], "'units' => an array literal"];
                }
            }
            continue;
        }

        // ---- door 1: echoUnitSelect(<name>, <family>, <indent>) --------------------------------
        if (!is_array($t) || $t[0] !== T_STRING || strtolower($t[1]) !== 'echounitselect') {
            continue;
        }
        $open = $sig($i + 1);
        if ($open < 0 || $tokens[$open] !== '(') { continue; }        // a mention, not a call
        for ($k = $i - 1; $k >= 0; $k--) {
            $pt = $tokens[$k];
            if (is_array($pt) && ($pt[0] === T_WHITESPACE || $pt[0] === T_COMMENT
                || $pt[0] === T_DOC_COMMENT)) { continue; }
            // A method or static call belongs to somebody else's object; `function echoUnitSelect(`
            // is the DECLARATION, whose parameter list is not a call site at all.
            if (is_array($pt) && ($pt[0] === T_OBJECT_OPERATOR || $pt[0] === T_DOUBLE_COLON
                || $pt[0] === T_FUNCTION)) {
                $open = -1;
            }
            break;
        }
        if ($open < 0) { continue; }

        // Split the argument list at depth-0 commas; we want argument 2.
        $depth = 0; $args = [[]]; $end = $n;
        for ($k = $open; $k < $n; $k++) {
            $tk = $tokens[$k];
            if ($tk === '(' || $tk === '[' || $tk === '{') { $depth++; if ($depth === 1) { continue; } }
            elseif ($tk === ')' || $tk === ']' || $tk === '}') {
                $depth--;
                if ($depth === 0) { $end = $k; break; }
            }
            if ($depth === 1 && $tk === ',') { $args[] = []; continue; }
            $args[count($args) - 1][] = $k;
        }
        if (count($args) < 2) { continue; }

        // Drop `$units = ` from `echoUnitSelect($name = 'xu', $units = 'velocity', $ind)`, the
        // assignment-as-documentation form every calculator page uses. What is being classified is
        // the VALUE, not the label somebody hung on it.
        $arg = array_values(array_filter($args[1], function ($idx) use ($tokens) {
            $tt = $tokens[$idx];
            return !(is_array($tt) && ($tt[0] === T_WHITESPACE || $tt[0] === T_COMMENT
                || $tt[0] === T_DOC_COMMENT));
        }));
        if (count($arg) >= 2 && is_array($tokens[$arg[0]]) && $tokens[$arg[0]][0] === T_VARIABLE
            && $tokens[$arg[1]] === '=') {
            $arg = array_slice($arg, 2);
        }
        if (!$arg) { continue; }

        $first = $tokens[$arg[0]];
        $line = is_array($t) ? $t[2] : 0;
        if ($isArrayStart($arg[0])) {
            $out[] = ['call', $line, 'echoUnitSelect() given an array literal as its family'];
        } elseif (count($arg) === 1 && is_array($first)
            && $first[0] === T_CONSTANT_ENCAPSED_STRING) {
            // A family name. This is the whole point of the rule; nothing to report.
        } else {
            $out[] = ['opaque', $line, 'echoUnitSelect() family argument is not a literal'];
        }
    }
    return $out;
}

if (defined('UNIT_SELECT_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
// Everything that renders a select: the pages and the form library. dev/ ships to nobody.
$paths = array_merge(glob($root . '/*.php'), glob($root . '/lib/*.php'));

$problems = [];
$opaque = [];
$files = 0;
foreach ($paths as $file) {
    $files++;
    foreach (ecRawUnitArrayFindings(file_get_contents($file)) as [$kind, $line, $what]) {
        $where = sprintf('%s:%d', str_replace($root . '/', '', $file), $line);
        if ($kind === 'opaque') { $opaque[] = $where; continue; }
        $problems[] = [$where, $what];
    }
}

if ($problems) {
    echo 'Raw unit arrays: ' . count($problems) . " site(s)\n\n";
    foreach ($problems as [$where, $what]) { echo "  $where\n      $what\n"; }
    echo "\nA unit <select> built from a raw array carries data-family=\"\", and data-family is the\n";
    echo "only handle the US/SI preset buttons have. The select renders, offers the right options,\n";
    echo "and is then silently skipped by every preset -- so the page converts every field except\n";
    echo "that one, which reads to a visitor as an answer rather than as a fault.\n";
    echo "\nFIX: name a family from \$ec_unit_families in lib/Units.lib.php --\n";
    echo "    'units' => 'distance_small'          in the field declaration, or\n";
    echo "    echoUnitSelect('xu', 'distance_small', '')\n";
    echo "If no existing family fits, add one to \$ec_unit_families AND to BOTH presets in\n";
    echo "\$ec_unit_sets; a family missing from a preset is the same silent defect one level up,\n";
    echo "and unit_family_check.php will tell you so.\n";
    exit(1);
}

echo "Unit selects OK -- $files file(s) scanned, every literal family argument names a family.\n";
if ($opaque) {
    // The blind spot as a number rather than a silence.
    echo 'NOTE: ' . count($opaque) . " call site(s) pass a family this check cannot follow (a\n";
    echo "      variable or an expression, not a literal), so they are not verified here:\n";
    foreach ($opaque as $where) { echo "        $where\n"; }
    echo "      They are fed by 'units' => declarations, which ARE read above.\n";
}
exit(0);
