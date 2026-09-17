<?php
/**
 * number_step_check.php -- a number input this suite builds declares its `step`. BLOCKING, and a
 * ratchet at zero.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * The suite builds a `type="number"` input 130 times. **105 of them are rendered from PHP and all
 * 105 carry `step="any"`**; the row-table builder in `js/Calculators.lib.js` writes the same
 * attribute on every row cell it makes. Then `js/looped-network.js` builds 25 more by hand, and 20
 * of those declared a step while 5 did not -- which is the signature this survey hunts: a construct
 * written 125 times one way and 5 times the other, with nothing anywhere stating the rule.
 *
 * WHAT THE OMISSION COSTS, and it is a quantity the user typed. **An `<input type="number">` with
 * no `step` has `step=1` -- the HTML default, not a quirk.** The suite hides the spinner arrows in
 * `css/engcalcs.css` for every number input but `.ec-spin`, so the keyboard is the only stepper
 * left, and the arrow keys obey the step: press Up in a pipe length reading 125.43 and a step of 1
 * SNAPS it to 126, silently discarding the decimals the user typed. The same field is
 * `:invalid` the whole time it holds a non-integer, so any validity test on it reads false.
 * The five that lacked one were the map editor's property popup -- `unitNumberField()`, the door
 * every unit-bearing quantity on the page goes through, plus the pipe length field that is
 * populated with `.toFixed(2)` and is therefore almost never an integer.
 *
 * **NOTHING ON THIS SIDE OF THE WIRE CAN SEE IT.** The page renders, the box shows the number, the
 * label is right, the solve is right, and the harnesses set `.value` directly, which no step ever
 * constrains. It costs a keypress by somebody who is already in the field.
 *
 * WHAT `step` IS CORRECTLY SET TO IS NOT THIS SCRIPT'S BUSINESS: `any` for a physical quantity and
 * `1` for the small bounded integers that opt back into the spinner with `.ec-spin` are both
 * declarations, and which one a field wants is a judgement about the field. The check holds only
 * that SOMETHING was decided.
 *
 * WHAT IT DELIBERATELY DOES NOT READ, stated rather than pretended away:
 *   - a number input built through a helper that is handed `'number'` as a VARIABLE
 *     (`inputi.type = column.inputType`). There is no literal to follow; `js/Calculators.lib.js`
 *     sets `step="any"` on exactly that path, and the rendered door sees the result. Turned away
 *     and counted.
 *   - `js/vendor/`. Somebody else's code. Counted and printed.
 *
 * Usage:
 *   php dev/scripts/number_step_check.php
 *
 * Exit 0 = every number input declares a step. Exit 1 = one does not.
 */

/**
 * Comments blanked, string bodies KEPT. The finding here is a literal -- `'number'` and the value
 * of `.step` -- so blanking strings would blank the evidence. Comments go because `js/*.js`
 * discusses steps and spinners at length and a scan counting prose reports findings against
 * correct code.
 *
 * The blanker knows a REGEX LITERAL from a division, for the reason js_page_url_check.php records:
 * a `/['"]/` in the source otherwise swallows every comment after it.
 */
function ecStepStripJsComments(string $src): string
{
    $out = '';
    $n = strlen($src);
    $i = 0;
    $prev = '';
    while ($i < $n) {
        $c = $src[$i];
        $c2 = $i + 1 < $n ? $src[$i + 1] : '';
        if ($c === '/' && $c2 === '/') {
            while ($i < $n && $src[$i] !== "\n") { $i++; }
            continue;
        }
        if ($c === '/' && $c2 === '*') {
            $i += 2;
            while ($i < $n && !($src[$i] === '*' && ($i + 1 < $n) && $src[$i + 1] === '/')) {
                if ($src[$i] === "\n") { $out .= "\n"; }
                $i++;
            }
            $i += 2;
            continue;
        }
        if ($c === '"' || $c === "'" || $c === '`') {
            $q = $c;
            $out .= $c; $i++;
            while ($i < $n) {
                if ($src[$i] === '\\') { $out .= substr($src, $i, 2); $i += 2; continue; }
                $out .= $src[$i];
                if ($src[$i] === $q) { $i++; break; }
                $i++;
            }
            $prev = $q;
            continue;
        }
        if ($c === '/' && $prev !== '' && strpos(')]}', $prev) === false && !ctype_alnum($prev) && $prev !== '_') {
            // A regex literal: consume it whole so its contents cannot be read as code or comment.
            $out .= $c; $i++;
            while ($i < $n && $src[$i] !== "\n") {
                if ($src[$i] === '\\') { $out .= substr($src, $i, 2); $i += 2; continue; }
                if ($src[$i] === '[') {
                    while ($i < $n && $src[$i] !== ']') { $out .= $src[$i]; $i++; }
                }
                $out .= $src[$i];
                if ($src[$i] === '/') { $i++; break; }
                $i++;
            }
            $prev = '/';
            continue;
        }
        $out .= $c;
        if (trim($c) !== '') { $prev = $c; }
        $i++;
    }
    return $out;
}

/**
 * The innermost block containing $pos, by brace matching. A line window is the wrong instrument:
 * `unitNumberField()` sets `.type` on its second line and could reasonably set `.step` thirty
 * lines later, and `demandRowInto()` in this tree already puts two halves 35 lines apart.
 *
 * @return array{0:int,1:int} start and end offsets of the enclosing block, ends of file if none
 */
function ecStepEnclosingBlock(string $src, int $pos): array
{
    $depth = 0;
    $start = 0;
    for ($i = $pos; $i >= 0; $i--) {
        if ($src[$i] === '}') { $depth++; continue; }
        if ($src[$i] === '{') {
            if ($depth === 0) { $start = $i; break; }
            $depth--;
        }
    }
    $depth = 0;
    $n = strlen($src);
    $end = $n;
    for ($i = $start + 1; $i < $n; $i++) {
        if ($src[$i] === '{') { $depth++; continue; }
        if ($src[$i] === '}') {
            if ($depth === 0) { $end = $i; break; }
            $depth--;
        }
    }
    return array($start, $end);
}

/**
 * Findings in JavaScript, plus the counts. Pure, so the selftest can drive it with fixtures.
 *
 * @param array<string,string> $files rel path => JS source
 * @return array{findings: array<int,string>, made: int, stepped: int, away: array<int,string>}
 */
function ecStepJsFindings(array $files): array
{
    $findings = array();
    $made = 0;
    $stepped = 0;
    $away = array();

    foreach ($files as $rel => $raw) {
        $src = ecStepStripJsComments($raw);
        // `x.type = 'number'` -- the one literal that makes an element a number input.
        if (!preg_match_all(
            '/([A-Za-z_$][A-Za-z0-9_$]*)\s*\.\s*type\s*=\s*([\'"])number\2/',
            $src,
            $m,
            PREG_SET_ORDER | PREG_OFFSET_CAPTURE
        )) {
            // A type assigned from a VARIABLE has no literal to follow. Counted, not guessed at.
            $away = array_merge($away, ecStepAwayIn($rel, $src));
            continue;
        }
        foreach ($m as $hit) {
            $made++;
            $var = $hit[1][0];
            $pos = $hit[0][1];
            $line = substr_count(substr($src, 0, $pos), "\n") + 1;
            list($bs, $be) = ecStepEnclosingBlock($src, $pos);
            $block = substr($src, $bs, $be - $bs);
            if (preg_match('/\b' . preg_quote($var, '/') . '\s*\.\s*step\s*=/', $block)
                || preg_match('/\b' . preg_quote($var, '/')
                    . '\s*\.\s*setAttribute\(\s*[\'"]step[\'"]/', $block)) {
                $stepped++;
                continue;
            }
            $findings[] = "$rel:$line builds `$var` as type=\"number\" and never declares "
                . "`$var.step`. An input with no step has step=1 -- the HTML default -- so the "
                . 'arrow keys SNAP a quantity the user typed to a whole number (125.43 becomes 126) '
                . 'and the field reads as :invalid the whole time it holds a decimal. The suite '
                . 'hides the spinner on every number input but .ec-spin, so the keyboard is the '
                . "only stepper left. Declare it: `$var.step = 'any';` for a physical quantity, "
                . "`$var.step = '1';` for a small bounded integer that opts back into the spinner. "
                . '105 of 105 rendered from PHP already say `any`.';
        }
        $away = array_merge($away, ecStepAwayIn($rel, $src));
    }

    return array('findings' => $findings, 'made' => $made, 'stepped' => $stepped, 'away' => $away);
}

/** Type assignments with no literal to follow, named so silence is never read as coverage. */
function ecStepAwayIn(string $rel, string $src): array
{
    $away = array();
    if (preg_match_all(
        '/([A-Za-z_$][A-Za-z0-9_$]*)\s*\.\s*type\s*=\s*([A-Za-z_$][A-Za-z0-9_$.\[\]\']*)\s*[;,)]/',
        $src,
        $m,
        PREG_SET_ORDER | PREG_OFFSET_CAPTURE
    )) {
        foreach ($m as $hit) {
            $line = substr_count(substr($src, 0, $hit[0][1]), "\n") + 1;
            $away[] = "$rel:$line sets .type from `{$hit[2][0]}` -- no literal to follow";
        }
    }
    return $away;
}

/**
 * Findings in one RENDERED page. In-form-ness is not what matters here; the attribute is, and it
 * exists only after the page is built, because a field's type comes out of $arrayInputs and its
 * step out of the form library six files away.
 *
 * @return array{findings: array<int,string>, total: int}
 */
function ecStepMarkupFindings(string $page, string $html): array
{
    $findings = array();
    $total = 0;
    if (!preg_match_all('/<input\b[^>]*>/i', $html, $m)) {
        return array('findings' => $findings, 'total' => 0);
    }
    foreach ($m[0] as $tag) {
        if (!preg_match('/\btype\s*=\s*"number"/i', $tag)) { continue; }
        $total++;
        if (preg_match('/\bstep\s*=\s*"/i', $tag)) { continue; }
        $name = preg_match('/\bname\s*=\s*"([^"]*)"/i', $tag, $nm) ? $nm[1] : '(unnamed)';
        $findings[] = "$page renders a type=\"number\" input named `$name` with no step attribute. "
            . 'With no step the browser uses 1, so the arrow keys snap a quantity the user typed to '
            . 'a whole number and the field is :invalid while it holds a decimal. Every other '
            . 'number input this suite renders says step="any".';
    }
    return array('findings' => $findings, 'total' => $total);
}

if (defined('NUMBER_STEP_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

// ---- markup, one page per process (dev/scripts/render_page.php is the only correct way) ---------
$skip = array('lpn-lock.php', 'log-calc-event.php', 'log-human-view.php', 'log-signal-event.php',
              'log-title-event.php', 'formmail.php', 'sw.php', 'consent.php', 'manifest.php');
$problems = array();
$rendered = 0;
$pages = 0;
$unrendered = array();
foreach (glob($root . '/*.php') ?: array() as $path) {
    $name = basename($path);
    if (in_array($name, $skip, true)) { continue; }
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
         . ' ' . escapeshellarg($name) . ' 2>/dev/null';
    $html = shell_exec($cmd);
    if ($html === null || trim($html) === '') { $unrendered[] = $name; continue; }
    $pages++;
    $r = ecStepMarkupFindings($name, $html);
    $problems = array_merge($problems, $r['findings']);
    $rendered += $r['total'];
}

// ---- JavaScript ---------------------------------------------------------------------------------
$files = array();
foreach (glob($root . '/js/*.js') ?: array() as $f) {
    $files['js/' . basename($f)] = (string) file_get_contents($f);
}
$js = ecStepJsFindings($files);
$problems = array_merge($problems, $js['findings']);

$vendor = 0;
foreach (glob($root . '/js/vendor/*.js') ?: array() as $f) {
    $vendor += preg_match_all("/\.type\s*=\s*['\"]number['\"]/", (string) file_get_contents($f));
}

if ($unrendered) {
    $problems[] = 'these pages could not be rendered, so their number inputs were not read at all: '
        . implode(', ', $unrendered);
}

if ($problems) {
    echo 'Number input step: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "This is a ratchet at zero, measured 2026-09-17: 105 of 105 number inputs rendered from\n";
    echo "PHP and 25 of 25 built in js/*.js declare a step. Nothing on this side of the wire can\n";
    echo "see the defect -- the page renders, the value is right, and the harnesses set .value\n";
    echo "directly, which no step ever constrains.\n";
    exit(1);
}

printf("Number input step OK -- %d rendered number input(s) on %d page(s) and %d built in js/*.js, "
    . "all\n%d of the latter declaring a step. A ratchet at zero.\n",
    $rendered, $pages, $js['made'], $js['stepped']);
printf("Turned away and counted, never guessed at: %d .type assignment(s) with no literal to "
    . "follow\n(js/Calculators.lib.js sets step=\"any\" on exactly that path, and the rendered door "
    . "sees the\nresult), and %d in js/vendor/, which is somebody else's code.\n",
    count($js['away']), $vendor);
foreach ($js['away'] as $a) { echo "  - $a\n"; }
exit(0);
