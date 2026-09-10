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

// Measured 2026-09-09: 199 when this check was written, 52 the same day once the sweep below the
// three heaviest files had been done. It may fall; it may not rise.
const EC_HARNESS_WORDING_BASELINE = 51;

/**
 * THE DECLARED EXCEPTIONS, keyed on the file and the EXACT literal, with the reason each one is
 * correct as it stands. Never inferred: a literal is exempt only because somebody wrote down why,
 * which is how every other check in this suite declares one. Keyed on the literal rather than on a
 * line number, so an edit above it does not silently move the exemption onto its neighbour.
 *
 * Three kinds earn a place here and nothing else does:
 *   (a) THE ASSERTION IS ABOUT THE SHIPPED STRING ITSELF, read off `PC.<key>` or out of the
 *       language file. A consent gate that stops naming the host it sends to is a privacy defect
 *       and not a rewording, so that one is MEANT to go red.
 *   (b) THE LITERAL IS THE HARNESS'S OWN TEXT -- a project name it types in, a fixture, a label in
 *       its own failure message -- and merely reads like a shipped string.
 *   (c) IT IS A pageConfig FALLBACK in fixture code copied from the page, which is
 *       js_fallback_string_check.php's business and not this one's.
 *
 * A declaration that matches nothing FAILS, because the site it was written for is gone and a
 * stale exemption is a hole waiting for the next literal that happens to read the same way.
 */
const EC_HARNESS_WORDING_EXCEPT = [
    'dev/lpn-spike/backdrop-scale-harness.js' => [
        'Scale by picking' =>
            '(a) this harness exists to hold the two backdrop labels at the English Tom approved '
            . 'in Task 297 Wave 0; the equality IS the assertion.',
        'Scale by world file or by the size of one pixel on the map' =>
            '(a) the other half of the same approval.',
    ],
    'dev/lpn-spike/basemap-harness.js' => [
        'the street map' =>
            '(b) the harness\'s own name for one of two tile pictures, printed in its failure '
            . 'message. It reads like lpn_basemap_tip because both describe the same picture.',
    ],
    'dev/lpn-spike/engine-prefetch-harness.js' => [
        'PRV, PSV, or FCV' =>
            '(a) asserted against PC.lpn_settings_engine_native_tip, not against the screen: the '
            . 'engine checkbox was left un-disabled BECAUSE that tip names both cases permanently, '
            . 'so the tip losing them is the defect this line is for.',
        'extended period simulation' =>
            '(a) the other case the same tip must keep naming.',
    ],
    'dev/lpn-spike/example-draw-fixture.js' => [
        'This adds the example to the network you already have. Continue?' =>
            '(c) a `pc.lpn_confirm_example || <English>` fallback in fixture code copied from '
            . 'js/looped-network.js. js_fallback_string_check.php owns fallback literals.',
    ],
    'dev/lpn-spike/examples-audit-harness.js' => [
        'THEN PUMP 9 STATUS IS OPEN' =>
            '(b) a line of EPANET [RULES] grammar in the Net1 fixture. It is EPANET\'s language, '
            . 'not ours; lpn_library_rule_tip quotes a rule of the same shape as an example.',
    ],
    'dev/lpn-spike/examples-gallery-harness.js' => [
        'litres per second' =>
            '(a) the assertion is that the FLOW unit is named before the length units inside the '
            . 'example description, so the two unit words are the specification being held.',
        'gallons per minute' =>
            '(a) the US half of the same ordering.',
    ],
    'dev/lpn-spike/file-naming-harness.js' => [
        'Elm Street Center' =>
            '(b) the project NAME the harness types in, to watch it become a filename and come '
            . 'back. It is input, not a string the page renders.',
    ],
    'dev/lpn-spike/grievance-link-harness.js' => [
        'nobody can write back' =>
            '(a) read off the shipped lpn_wrong_tip. The tip promising no reply is the whole point '
            . 'of the feedback link\'s honesty, so this is meant to go red if it stops saying it.',
    ],
    'dev/lpn-spike/pane-print-harness.js' => [
        'Elm Street Center' =>
            '(b) the project name this harness types in and then reads back off the printed sheet.',
    ],
    'dev/lpn-spike/popup-tips-harness.js' => [
        'Fire flow test' =>
            '(b) the name of a fixture project in the library, which the status bar must name back.',
    ],
    'dev/lpn-spike/small-screen-harness.js' => [
        'the welcome line' =>
            '(b) the harness\'s own name for #ec-page-welcome, in its failure messages.',
        ' on the desktop' =>
            '(b) half of a failure message built by concatenation, not an assertion at all.',
    ],
    'dev/lpn-spike/terrain-harness.js' => [
        'latitude and longitude' =>
            '(a) asserted against PC.lpn_terrain_consent_1: a consent question that stops saying '
            . 'what is sent is a privacy defect, not a rewording.',
        'keeps working exactly as it does now' =>
            '(a) asserted against PC.lpn_terrain_consent_4 -- that a refusal costs nothing else is '
            . 'the promise the gate is built on.',
        'not a survey' =>
            '(a) asserted against PC.lpn_terrain_accuracy. CLAUDE.md requires the ~30 m accuracy to '
            . 'be stated in the interface, and the caveat is the half a reader acts on.',
    ],
];

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
    $stats = ['examined' => 0, 'short' => 0, 'declared' => []];

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
                $except = EC_HARNESS_WORDING_EXCEPT[$rel] ?? [];
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
                    // Declared LAST, so a declaration only counts as used where the literal really
                    // would have been reported. A declaration for a literal that is too short, or
                    // that no longer matches any English value, is stale and says so below.
                    if (isset($except[$lit])) {
                        $stats['declared'][$rel . "\0" . $lit] = true;
                        break;
                    }
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

// A declaration that matched nothing is debt: the site it names is gone, and the exemption is now
// a hole waiting for the next literal in that file that happens to read the same way.
$stale = [];
foreach (EC_HARNESS_WORDING_EXCEPT as $rel => $lits) {
    foreach ($lits as $lit => $why) {
        if (!isset($stats['declared'][$rel . "\0" . $lit])) { $stale[] = "$rel: \"$lit\""; }
    }
}

if ($count > EC_HARNESS_WORDING_BASELINE || in_array('--list', $argv, true)) {
    echo "Harness wording pins: $count (baseline " . EC_HARNESS_WORDING_BASELINE . ")\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
}

if ($stale) {
    echo "A declared exception matches nothing any more. Delete the declaration; leaving it is a\n";
    echo "standing exemption for whatever literal next reads that way in the same file.\n\n";
    foreach ($stale as $t) { echo "  ! $t\n"; }
    exit(1);
}

if ($count > EC_HARNESS_WORDING_BASELINE) {
    echo "The count ROSE. A harness that spells an English string out as a literal turns a\n";
    echo "rewording into a red build in a file about hydraulics. Assert against\n";
    echo "EngCalcs.pageConfig.<key>.\n";
    exit(1);
}

printf("Harness wording OK -- %d pin(s) against a baseline of %d, across %d harness file(s). "
    . "%d literal(s) examined, %d turned away as too short to be wording, %d declared correct as "
    . "they stand. The number may fall and may not rise; lower the baseline when you fix some.\n",
    $count, EC_HARNESS_WORDING_BASELINE, count($files), $stats['examined'], $stats['short'],
    count($stats['declared']));
exit(0);
