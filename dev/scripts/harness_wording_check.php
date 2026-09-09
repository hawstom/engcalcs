<?php
/**
 * harness_wording_check.php -- a harness must not pin English WORDING as a literal. RATCHET.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * On 2026-09-08 Tom reworded three shipped strings and three harnesses went red -- not because
 * anything broke, but because each asserted the OLD English as a regular expression:
 * `fittings-harness.js` on `/none of them changed/`, `reaction-globals-harness.js` on
 * `/Limiting potential/i`, and `dev/browser-pass/specs/goto.js` on four copies of the text of
 * `lpn_goto_bad`. `dev/session-handoff.md` wrote them down and added "There are probably more: it
 * is a countable construct and worth a sweep." **There were 199.**
 *
 * WHY A PIN IS A DEFECT AND NOT A DETAIL. It taxes exactly the work this project most wants to be
 * cheap. `CLAUDE.md` sends every English string to Tom to read and rule on, and the whole design of
 * `dev/english-key-rulings.json` is that a ruling LAPSES when the wording moves -- rewording is
 * meant to be free. A pinned harness makes it cost a red build somewhere else, in a file about
 * hydraulics, with a failure message that names a fitting rather than a string. It also fails in
 * the direction that teaches the wrong lesson: the harness looks broken and the string looks fine.
 *
 * THE FIX, WHICH IS ONE LINE AND ALREADY WORKS. Assert against `EngCalcs.pageConfig.<key>`. The
 * DOM stub loads the real `lib/lang.ec.en.php`, so the harness gets whatever the string says today
 * and goes on testing the BEHAVIOUR it was written for. `engine-prefetch-harness.js` does it.
 *
 * WHY A RATCHET AND NOT A REPAIR. 199 sites, each needing the right key chosen by a person who
 * understands what that assertion is for -- and several are correct as they stand, asserting the
 * ORDER of columns or that two different messages both appear. A mechanical sweep would be a
 * wording judgement entering 199 tests, which is precisely what this project refuses to do to
 * strings. So the number may FALL and may not RISE, the way `em_dash_ratchet_check.php` holds its
 * own. Lower EC_HARNESS_WORDING_BASELINE when you fix some; the script deliberately does not
 * rewrite its own baseline.
 *
 * HOW IT DECIDES. A literal is a pin when, normalised, it is a SUBSTRING of a normalised English
 * `$ec_lang` value. Substring rather than equality, because the shipped pins are overwhelmingly
 * fragments -- `/did not converge/` out of a sentence. The thresholds are three words and twelve
 * characters, which is what separates a sentence fragment from an element id, a unit keyword or a
 * CSS class; a shorter literal is TURNED AWAY AND COUNTED rather than guessed at.
 *
 * WHAT IT CANNOT SEE, AND SAYS SO. A harness that builds its expected text at runtime, or reads it
 * from a fixture file, is invisible here -- there is no literal to compare. That is the same
 * blindness `lang_key_resolve_check.php` accepts for the same reason: it makes a false positive
 * impossible.
 *
 * Usage:
 *   php dev/scripts/harness_wording_check.php [--list]
 *
 * Exit 0 = at or below the baseline. Exit 1 = a new pin was written.
 */

// The measured count on 2026-09-09, the day this check was written. It may fall; it may not rise.
const EC_HARNESS_WORDING_BASELINE = 199;

/**
 * Blank every comment in a JS source, preserving line numbers. Line-oriented on purpose: quote
 * tracking resets at each newline, so a regex literal carrying a quote confuses at most its own
 * line instead of the rest of the file.
 */
function ecHarnessBlankComments(string $src): string
{
    $lines = explode("\n", $src);
    $inBlock = false;
    foreach ($lines as $ln => $line) {
        $n = strlen($line);
        $out = '';
        $q = '';
        $i = 0;
        while ($i < $n) {
            $c = $line[$i];
            $next = $i + 1 < $n ? $line[$i + 1] : '';
            if ($inBlock) {
                if ($c === '*' && $next === '/') { $inBlock = false; $out .= '  '; $i += 2; continue; }
                $out .= ' '; $i++; continue;
            }
            if ($q !== '') {
                $out .= $c;
                if ($c === '\\') { if ($i + 1 < $n) { $out .= $next; } $i += 2; continue; }
                if ($c === $q) { $q = ''; }
                $i++; continue;
            }
            if ($c === '/' && $next === '/') { $out .= str_repeat(' ', $n - $i); break; }
            if ($c === '/' && $next === '*') { $inBlock = true; $out .= '  '; $i += 2; continue; }
            if ($c === "'" || $c === '"') { $q = $c; }
            $out .= $c; $i++;
        }
        $lines[$ln] = $out;
    }
    return implode("\n", $lines);
}

/**
 * Normalise a candidate phrase the same way on both sides of the comparison.
 */
function ecHarnessNormalise(string $s): string
{
    $s = strtolower(strip_tags($s));
    $s = str_replace(['\\.', '\\-', '\\?', '\\(', '\\)', '\\/'], ['.', '-', '?', '(', ')', '/'], $s);
    $s = preg_replace('/\s+/', ' ', $s);
    return trim((string) $s);
}

/**
 * Findings, pure so the selftest can drive it.
 *
 * @param array<string,string> $files    relative path => harness source
 * @param array<string,string> $english  key => English value
 * @param array{examined:int,short:int}  $stats filled in by reference
 * @return array<int,string>
 */
function ecHarnessWordingFindings(array $files, array $english, array &$stats): array
{
    $stats = ['examined' => 0, 'short' => 0];

    $norm = [];
    foreach ($english as $k => $v) {
        $n = ecHarnessNormalise($v);
        if (strlen($n) >= 12) { $norm[$k] = $n; }
    }

    $out = [];
    foreach ($files as $rel => $raw) {
        $src = ecHarnessBlankComments($raw);
        foreach (explode("\n", $src) as $i => $line) {
            // Three literal shapes: a regex, a single-quoted string, a double-quoted string.
            if (!preg_match_all(
                '~/((?:[^/\\\\\n]|\\\\.){8,120})/[a-z]*'
                . "|'((?:[^'\\\\\n]|\\\\.){8,120})'"
                . '|"((?:[^"\\\\\n]|\\\\.){8,120})"~',
                $line, $m, PREG_SET_ORDER
            )) {
                continue;
            }
            foreach ($m as $set) {
                $lit = '';
                foreach ([1, 2, 3] as $g) {
                    if (isset($set[$g]) && $set[$g] !== '') { $lit = $set[$g]; break; }
                }
                if ($lit === '') { continue; }
                $stats['examined']++;
                $n = ecHarnessNormalise($lit);
                // A fragment shorter than three words or twelve characters is an id, a keyword or
                // a class name far more often than it is wording, so it is turned away and counted.
                if (strlen($n) < 12 || substr_count($n, ' ') < 2) { $stats['short']++; continue; }
                foreach ($norm as $k => $v) {
                    if (strpos($v, $n) === false) { continue; }
                    $out[] = sprintf(
                        '%s:%d pins English wording: "%s" is text of $ec_lang[\'%s\']. '
                        . 'Assert against EngCalcs.pageConfig.%s instead -- the DOM stub loads the '
                        . 'real language file, so the test keeps working when the string is '
                        . 'reworded, which this project treats as free.',
                        $rel, $i + 1, $lit, $k, $k
                    );
                    break;
                }
            }
        }
    }

    return $out;
}

if (defined('EC_HARNESS_WORDING_LIB_ONLY')) {
    return;
}

require_once __DIR__ . '/lang_parse.inc.php';

$root = dirname(__DIR__, 2);
$english = ecLangValues((string) file_get_contents($root . '/lib/lang.ec.en.php'));

$files = [];
foreach ([
    'dev/lpn-spike',
    'dev/calc-spike',
    'dev/browser-pass',
    'dev/browser-pass/specs',
] as $dir) {
    foreach (glob($root . '/' . $dir . '/*.js') ?: [] as $f) {
        $files[$dir . '/' . basename($f)] = (string) file_get_contents($f);
    }
}

$stats = [];
$problems = ecHarnessWordingFindings($files, $english, $stats);
$count = count($problems);

if ($count > EC_HARNESS_WORDING_BASELINE || in_array('--list', $argv, true)) {
    echo "Harness wording pins: $count (baseline " . EC_HARNESS_WORDING_BASELINE . ")\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
}

if ($count > EC_HARNESS_WORDING_BASELINE) {
    echo "The count ROSE. A harness that spells an English string out as a literal turns a\n";
    echo "rewording into a red build in a file about hydraulics. Assert against\n";
    echo "EngCalcs.pageConfig.<key>.\n";
    exit(1);
}

printf("Harness wording OK -- %d pin(s) against a baseline of %d, across %d harness file(s). "
    . "%d literal(s) examined, %d turned away as too short to be wording. The number may fall "
    . "and may not rise; lower the baseline when you fix some.\n",
    $count, EC_HARNESS_WORDING_BASELINE, count($files), $stats['examined'], $stats['short']);
exit(0);
