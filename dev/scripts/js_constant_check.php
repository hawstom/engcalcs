<?php
/**
 * js_constant_check.php -- a physical constant written into js/*.js is the suite's own exact
 * value, never a decimal somebody typed off it. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * `unit_factor_check.php` re-derives every `$ec_units` factor from the exact definitions and holds
 * the factors for one quantity against each other, because "the suite once shipped four different
 * feet". It reads PHP. **It has never read a line of JavaScript**, and `js/*.js` declares 28
 * numeric constants of its own, of which 24 agree with the suite's definitions exactly and 4 were
 * typed as rounded decimals: `0.0283168466` for a cubic foot in two separate modules,
 * `0.0438126364` for a million gallons a day, and `0.703070` for a psi of water column. Nothing
 * compared either half, in either direction, and `dev/session-handoff.md` had the psi one written
 * down as an open question rather than as a defect.
 *
 * WHY A ROUNDED DECIMAL IS THE DEFECT AND NOT A NEGLIGIBLE ONE. `CLAUDE.md` § ONLY THE USER
 * TOUCHES A FILE'S NUMBERS is built on the observation that better constants do not make a round
 * trip exact and that pass-through is the only fix -- which is true, and is why the error here is
 * small. The reason it still matters is the OTHER half of that rule: the suite has one definition
 * of a foot, and every place that disagrees with it by a few parts in ten million is a second
 * definition waiting to be found by somebody comparing two answers that ought to be identical.
 * `js/lpn-fireflow.js` already does it right and says so in a comment: it DERIVES `PA_PER_PSI`
 * from `4.4482216152605 / (M_PER_IN * M_PER_IN)` rather than typing 6894.76.
 *
 * HOW IT DECIDES, AND WHY IT CANNOT CRY WOLF. A numeric literal fires only when it is WITHIN ONE
 * PART IN A THOUSAND of a quantity this script derives from the suite's own exact definitions AND
 * NOT EQUAL TO IT. A number that far from a conversion factor and not that factor is a retyping;
 * a number outside the window is some other quantity and is never looked at again. Exact matches
 * are counted and reported, because a scan that has gone blind reports zero findings and reads as
 * progress -- the count of agreements is what says it is still looking.
 *
 * WHAT IS TURNED AWAY, AND COUNTED. Comments are blanked before the scan, so a docblock quoting
 * `0.3048` or a note recording a rounded value is not a finding; the count of blanked comment
 * characters is printed. `js/vendor/` is out of scope by declaration: it is somebody else's code,
 * held byte-for-byte by `vendor_integrity_check.php`, and editing a constant in it would be
 * editing a vendored file.
 *
 * WHAT IS NOT IN THE TABLE. Only quantities the suite DEFINES are listed -- the international
 * foot, the inch, the US liquid gallon, the pound-force, standard gravity (read out of
 * `EngCalcs.G`, never retyped here), the seconds in a day and the WGS84 semi-major axis, plus the
 * powers and reciprocals of those that this suite actually uses. The imperial gallon is not one of
 * ours, so `js/lpn-inp.js`'s IMGD factor is invisible to this check by construction rather than by
 * oversight. A quantity we do not define cannot have an authority to be checked against.
 *
 * Usage:
 *   php dev/scripts/js_constant_check.php [--list]
 *
 * Exit 0 = every physical literal in js/*.js is exact. Exit 1 = one was typed off a calculator.
 */

/**
 * The quantity table, derived here from the three exact definitions `CLAUDE.md` names plus the
 * two SI ones, so this file holds no retyped decimal of its own either.
 *
 * @param float $g standard gravity, read from the source rather than declared here.
 * @return array<string,float> label => exact value
 */
function ecJsConstantQuantities(float $g): array
{
    $ft  = 0.3048;                 // international foot, exact since 1959
    $in  = 0.0254;                 // 1/12 ft, exact
    $gal = 3.785411784e-3;         // US liquid gallon in m3, exact
    $lbf = 4.4482216152605;        // pound-force in N, exact
    $day = 86400.0;                // seconds in a day
    $psiM = ($lbf / ($in * $in)) / (1000.0 * $g);   // one psi as metres of water column

    return [
        'ft -> m'              => $ft,
        'm -> ft'              => 1 / $ft,
        'in -> m'              => $in,
        'm -> in'              => 1 / $in,
        'ft2 -> m2'            => $ft * $ft,
        'm2 -> ft2'            => 1 / ($ft * $ft),
        'ft3 -> m3'            => $ft * $ft * $ft,
        'm3 -> ft3'            => 1 / ($ft * $ft * $ft),
        'acre-ft -> m3'        => 43560 * $ft * $ft * $ft,
        'gal -> m3'            => $gal,
        'm3 -> gal'            => 1 / $gal,
        'gal/min -> m3/s'      => $gal / 60,
        'Mgal/day -> m3/s'     => 1e6 * $gal / $day,
        'lbf -> N'             => $lbf,
        'N -> lbf'             => 1 / $lbf,
        'psi -> Pa'            => $lbf / ($in * $in),
        'psi -> m of water'    => $psiM,
        'm of water -> psi'    => 1 / $psiM,
        'psi -> ft of water'   => $psiM / $ft,
        'ft of water -> psi'   => $ft / $psiM,
        'standard gravity'     => $g,
        'seconds per day'      => $day,
        'WGS84 semi-major axis' => 6378137.0,
    ];
}

/**
 * DECLARED EXCEPTIONS. A near-miss that is deliberate goes here with its reason, never inferred
 * from a comment beside it. `basename => [literal => reason]`. Empty today, and that is the point:
 * the four that existed on 2026-09-09 were derived rather than declared, because none of them had
 * an argument for being approximate.
 *
 * @return array<string,array<string,string>>
 */
function ecJsConstantExceptions(): array
{
    return [];
}

/**
 * Blank every comment in a JS source, preserving length and newlines so line numbers survive.
 *
 * DELIBERATELY LINE-ORIENTED, not a JavaScript lexer. Quote tracking RESETS at every newline, so a
 * regular-expression literal carrying a quote character -- `/['"]/`, which this suite really does
 * write -- can confuse at most the rest of its own line instead of flipping the whole file into
 * string mode. A whole-file state machine was tried first and did exactly that: it read the
 * apostrophes in one function's comments as an open string and reported seven of `EngCalcs.G`'s
 * own explanatory comment lines as constants.
 */
function ecJsBlankComments(string $src): string
{
    $lines = explode("\n", $src);
    $inBlock = false;
    foreach ($lines as $ln => $line) {
        $n = strlen($line);
        $out = '';
        $q = '';       // '' outside a string, else the quote character that opened it
        $i = 0;
        while ($i < $n) {
            $c = $line[$i];
            $next = $i + 1 < $n ? $line[$i + 1] : '';
            if ($inBlock) {
                if ($c === '*' && $next === '/') { $inBlock = false; $out .= '  '; $i += 2; continue; }
                $out .= ' '; $i++; continue;
            }
            if ($q !== '') {
                if ($c === '\\') { $out .= '  '; $i += 2; continue; }
                if ($c === $q) { $q = ''; $out .= $c; $i++; continue; }
                $out .= ' '; $i++; continue;
            }
            if ($c === '/' && $next === '/') { $out .= str_repeat(' ', $n - $i); break; }
            if ($c === '/' && $next === '*') { $inBlock = true; $out .= '  '; $i += 2; continue; }
            // Quoted string BODIES are blanked too -- a number inside one is a URL, a version or a
            // message, never a conversion factor, and `/v/3.28084/` really does appear. Template
            // literals are deliberately NOT blanked: `${...}` holds code, and this suite writes
            // 1,400 backticks.
            if ($c === "'" || $c === '"') { $q = $c; }
            $out .= $c; $i++;
        }
        $lines[$ln] = $out;
    }
    return implode("\n", $lines);
}

/**
 * Findings, pure so the selftest can drive it.
 *
 * @param array<string,string>  $files  relative path => JS source (comments NOT yet blanked)
 * @param array<string,float>   $quant  quantity label => exact value
 * @param array<string,array<string,string>> $except declared exceptions
 * @param array{exact:int,literals:int,blanked:int} $stats filled in by reference
 * @return array<int,string>
 */
function ecJsConstantFindings(array $files, array $quant, array $except, array &$stats): array
{
    $out = [];
    $stats = ['exact' => 0, 'literals' => 0, 'blanked' => 0];

    foreach ($files as $rel => $raw) {
        $src = ecJsBlankComments($raw);
        $stats['blanked'] += substr_count($src, ' ') - substr_count($raw, ' ');
        $base = basename($rel);
        $lines = explode("\n", $src);
        foreach ($lines as $i => $line) {
            if (!preg_match_all('/(?<![\w.$])\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/', $line, $m)) {
                continue;
            }
            foreach ($m[0] as $tok) {
                $v = (float) $tok;
                if ($v == 0.0) { continue; }
                $stats['literals']++;
                foreach ($quant as $label => $exact) {
                    $rel_err = abs($v - $exact) / $exact;
                    if ($rel_err === 0.0) { $stats['exact']++; continue; }
                    if ($rel_err > 1e-3) { continue; }
                    if (isset($except[$base][$tok])) { continue; }
                    $out[] = sprintf(
                        "%s:%d writes %s where %s is exactly %.17g (off by %.1e). "
                        . "A conversion factor is DERIVED from the suite's own definitions "
                        . "(ft = 0.3048 m, in = 0.0254 m, gal = 3.785411784 L, lbf = "
                        . "4.4482216152605 N, g = EngCalcs.G), never typed off a calculator -- "
                        . "js/lpn-fireflow.js is the worked example. Write the expression, or "
                        . "declare the literal in ecJsConstantExceptions() with the reason it is "
                        . "deliberately approximate.",
                        $rel, $i + 1, $tok, $label, $exact, $rel_err
                    );
                }
            }
        }
    }

    return $out;
}

if (defined('EC_JS_CONSTANT_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

// Standard gravity comes out of the source, not out of this file: EngCalcs.G is the suite's single
// definition and a second copy here would be the very defect this check exists to find.
$calcLib = $root . '/js/Calculators.lib.js';
$calcSrc = (string) file_get_contents($calcLib);
if (!preg_match('/EngCalcs\.G\s*=\s*([0-9.eE+-]+)/', $calcSrc, $gm)) {
    fwrite(STDERR, "FAIL: could not read EngCalcs.G from js/Calculators.lib.js\n");
    exit(1);
}
$G = (float) $gm[1];

$files = [];
foreach (glob($root . '/js/*.js') ?: [] as $f) {
    $files['js/' . basename($f)] = (string) file_get_contents($f);
}

$stats = [];
$problems = ecJsConstantFindings($files, ecJsConstantQuantities($G), ecJsConstantExceptions(), $stats);

if (in_array('--list', $argv, true) || $problems) {
    if ($problems) {
        echo 'JS physical constants: ' . count($problems) . " finding(s)\n\n";
        foreach ($problems as $p) { echo "  ! $p\n\n"; }
        echo "Nothing else compares js/*.js with lib/Units.lib.php in either direction --\n";
        echo "unit_factor_check.php reads the PHP only.\n";
        exit(1);
    }
}

printf("JS physical constants OK -- %d numeric literal(s) across %d module(s) read, %d exact "
    . "agreement(s) with the suite's definitions, 0 near-misses. Comments blanked before the "
    . "scan; js/vendor/ out of scope by declaration.\n",
    $stats['literals'], count($files), $stats['exact']);
exit(0);
