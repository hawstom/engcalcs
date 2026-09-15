<?php
/**
 * button_type_check.php -- a <button> inside a <form> declares its type, and so does one this
 * suite builds in JavaScript. BLOCKING, and a ratchet at zero.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * The suite renders 239 `<button>` elements across its 25 pages and 238 of them name a `type`.
 * 161 sit inside the calculator `<form>` and every one of those 161 names it. In `js/*.js` the
 * suite builds 56 more with `document.createElement('button')` and sets `.type = 'button'` on all
 * 56. A construct written 217 times with the same attribute present every time is a rule somebody
 * knew; nothing in `CLAUDE.md` or `dev/*.md` states it, and nothing held it.
 *
 * WHAT THE ATTRIBUTE IS FOR. **A `<button>` with no `type` IS a submit button** -- that is the
 * HTML default, not a browser quirk. Inside a form it therefore submits, and every control on
 * these pages is inside `<form id="ec_form">`: the preset buttons, the row-table Add and the per-row
 * delete. The calculator form has no `action`, so submitting it reloads the page with a query
 * string: the results table the visitor was reading is gone, the sketch is redrawn from defaults,
 * and the answer they had just produced is simply not there any more. It looks like the page
 * "blinked and lost my numbers", there is no error anywhere, and it is not reproducible by reading
 * the source of the control that did it -- the attribute is missing, not wrong.
 *
 * SCOPE, and each boundary is a measurement rather than a taste:
 *   - **Markup is judged from the RENDERED page**, because in-form-ness cannot be read from the
 *     source at all: `echoCalculatorForm()` opens the form in `lib/Calculators.lib.php` while the
 *     buttons are written in 6 other files, so neither half carries both facts.
 *   - **A button OUTSIDE every form is turned away and counted.** Such a button has nothing to
 *     submit, so the default is harmless -- `Install.php` ships one and it is correct. Failing it
 *     would be failing correct markup to catch nothing.
 *   - **In JavaScript the form test is dropped and every created button must declare a type**,
 *     because the element is built in one function and appended in another, so where it lands is
 *     not decidable here -- and the suite has already answered the question 56 times out of 56.
 *   - `js/vendor/` is out of scope by declaration, as in every other check here. Counted, printed.
 *
 * WHAT IT DELIBERATELY CANNOT SEE, stated rather than pretended away: a `type` set through a
 * variable (`b.type = kind`) satisfies it, and a button whose element comes back from a helper
 * rather than from `createElement` has no creation site to scan. Both are turned away and COUNTED,
 * because guessing at either is how a check starts crying wolf and gets switched off.
 *
 * Usage:
 *   php dev/scripts/button_type_check.php
 *
 * Exit 0 = every in-form and every JS-built button declares its type. Exit 1 = one does not.
 */

/**
 * Comments blanked, character for character, so offsets and line numbers survive.
 *
 * Length-preserving is load-bearing: the type detection reads the source WITH its string literals
 * (`createElement('button')` is a literal) while the brace depth is counted on a version with the
 * strings gone too, and the two passes are indexed against each other.
 */
function ecBtnBlank(string $src, bool $strings): string
{
    $n = strlen($src);
    $out = $src;
    $i = 0;
    $state = 'code';
    $quote = '';
    while ($i < $n) {
        $c = $src[$i];
        $c2 = $i + 1 < $n ? $src[$i + 1] : '';
        if ($state === 'code') {
            if ($c === '/' && $c2 === '/') { $state = 'line'; $out[$i] = ' '; $out[$i + 1] = ' '; $i += 2; continue; }
            if ($c === '/' && $c2 === '*') { $state = 'block'; $out[$i] = ' '; $out[$i + 1] = ' '; $i += 2; continue; }
            if ($c === '"' || $c === "'" || $c === '`') {
                $quote = $c; $state = 'str';
                if ($strings) { $out[$i] = ' '; }
                $i++; continue;
            }
            $i++; continue;
        }
        if ($state === 'line') {
            if ($c === "\n") { $state = 'code'; } else { $out[$i] = ' '; }
            $i++; continue;
        }
        if ($state === 'block') {
            if ($c === '*' && $c2 === '/') { $out[$i] = ' '; $out[$i + 1] = ' '; $state = 'code'; $i += 2; continue; }
            if ($c !== "\n") { $out[$i] = ' '; }
            $i++; continue;
        }
        // inside a string
        if ($c === '\\') {
            if ($strings) { $out[$i] = ' '; if ($i + 1 < $n && $src[$i + 1] !== "\n") { $out[$i + 1] = ' '; } }
            $i += 2; continue;
        }
        if ($c === $quote) { $state = 'code'; if ($strings) { $out[$i] = ' '; } $i++; continue; }
        if ($strings && $c !== "\n") { $out[$i] = ' '; }
        $i++;
    }
    return $out;
}

/**
 * The markup leg: every rendered `<button>`, sorted into inside-a-form and outside.
 *
 * @return array{findings: array<int,string>, inForm: int, outside: int, total: int}
 */
function ecButtonMarkupFindings(string $page, string $html): array
{
    $findings = [];
    $inForm = 0;
    $outside = 0;
    $total = 0;

    // Form regions. An unclosed <form> runs to the end of the document, which is what a browser
    // does with it too, so a button after it is still inside the form as far as submitting goes.
    $forms = [];
    $off = 0;
    while (($s = stripos($html, '<form', $off)) !== false) {
        $end = stripos($html, '</form>', $s);
        if ($end === false) { $end = strlen($html); }
        $forms[] = [$s, $end];
        $off = $end + 1;
        if ($off >= strlen($html)) { break; }
    }

    if (!preg_match_all('/<button\b[^>]*>/i', $html, $m, PREG_OFFSET_CAPTURE)) {
        return ['findings' => [], 'inForm' => 0, 'outside' => 0, 'total' => 0];
    }
    foreach ($m[0] as [$tag, $at]) {
        $total++;
        $inside = false;
        foreach ($forms as [$fs, $fe]) {
            if ($at > $fs && $at < $fe) { $inside = true; break; }
        }
        if (!$inside) { $outside++; continue; }
        $inForm++;
        if (preg_match('/\btype\s*=/i', $tag)) { continue; }
        $findings[] = "$page renders a <button> inside a <form> with no type attribute:\n"
            . '        ' . trim(preg_replace('/\s+/', ' ', $tag)) . "\n"
            . "      A <button> with no type IS a submit button -- the HTML default. This one is in\n"
            . "      the calculator form, which has no action, so pressing it reloads the page: the\n"
            . "      results the visitor was reading vanish and nothing anywhere reports an error.\n"
            . '      Fix: add type="button" (or type="submit" if submitting is what it is for).';
    }

    return ['findings' => $findings, 'inForm' => $inForm, 'outside' => $outside, 'total' => $total];
}

/**
 * The JavaScript leg: every `createElement('button')` assigned to a plain identifier must have a
 * `.type` set on that identifier before its own block ends.
 *
 * The window is the ENCLOSING BLOCK, found by brace depth from the creation point, and not a fixed
 * number of lines. The furthest apart the two halves get in this tree today is 35 lines
 * (`js/looped-network.js` `demandRowInto()`, where the delete button is built at the top of the
 * function and typed once the row it belongs to is known), so a line window would have to be
 * generous enough to be arbitrary.
 *
 * @param array<string,string> $files rel path => JS source
 * @return array{findings: array<int,string>, created: int, typed: int, away: array<int,string>}
 */
function ecButtonJsFindings(array $files): array
{
    $findings = [];
    $created = 0;
    $typed = 0;
    $away = [];

    foreach ($files as $rel => $raw) {
        $code = ecBtnBlank($raw, false);   // comments gone, literals kept: 'button' must survive
        $bare = ecBtnBlank($raw, true);    // strings gone too: braces are only real ones
        $n = strlen($code);

        $off = 0;
        while (($at = strpos($code, "createElement(", $off)) !== false) {
            $off = $at + 1;
            if (!preg_match("/^createElement\(\s*['\"]button['\"]\s*\)/", substr($code, $at, 40))) { continue; }
            $created++;
            $line = substr_count(substr($code, 0, $at), "\n") + 1;

            // The assignment target: `name = document.createElement('button')` or `name =
            // createElement('button')`. Anything else has no identifier to follow.
            $before = substr($code, max(0, $at - 80), min(80, $at));
            if (!preg_match('/([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(?:[A-Za-z_$][A-Za-z0-9_$.]*\.)?$/', $before, $vm)) {
                $away[] = "$rel:$line builds a button without assigning it to a plain identifier, so "
                    . 'there is no name to follow -- turned away rather than guessed at';
                continue;
            }
            $var = $vm[1];
            $q = preg_quote($var, '/');

            // Forward to the end of the enclosing block: depth starts at 0 and the block ends when
            // it would go negative.
            $depth = 0;
            $stop = $n;
            for ($i = $at; $i < $n; $i++) {
                $c = $bare[$i];
                if ($c === '{') { $depth++; continue; }
                if ($c === '}') {
                    if ($depth === 0) { $stop = $i; break; }
                    $depth--;
                }
            }
            $window = substr($code, $at, $stop - $at);

            if (preg_match('/\b' . $q . '\.type\s*=/', $window)
                || preg_match('/\b' . $q . '\.setAttribute\(\s*[\'"]type[\'"]/', $window)) {
                $typed++;
                continue;
            }
            $findings[] = "$rel:$line builds a <button> and never sets $var.type:\n"
                . "      A created button defaults to type=\"submit\", so the moment it is appended\n"
                . "      anywhere inside a form, clicking it submits that form and reloads the page --\n"
                . "      the visitor's results disappear and no error is reported. Where the element\n"
                . "      ends up is decided in another function, which is why this is required of\n"
                . "      every one of them.\n"
                . "      Fix: $var.type = 'button'; beside the other properties, which is what the\n"
                . '      other 55 sites in this suite do.';
        }
    }

    return ['findings' => $findings, 'created' => $created, 'typed' => $typed, 'away' => $away];
}

if (defined('BUTTON_TYPE_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

// ---- markup, one page per process (dev/scripts/render_page.php is the only correct way) ---------
$skip = ['lpn-lock.php', 'log-calc-event.php', 'log-human-view.php', 'log-signal-event.php',
         'log-title-event.php', 'formmail.php', 'sw.php', 'consent.php', 'manifest.php'];
$problems = [];
$inForm = 0;
$outside = 0;
$buttons = 0;
$pages = 0;
$unrendered = [];
foreach (glob($root . '/*.php') ?: [] as $path) {
    $name = basename($path);
    if (in_array($name, $skip, true)) { continue; }
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
         . ' ' . escapeshellarg($name) . ' 2>/dev/null';
    $html = shell_exec($cmd);
    if ($html === null || trim($html) === '') { $unrendered[] = $name; continue; }
    $pages++;
    $r = ecButtonMarkupFindings($name, $html);
    $problems = array_merge($problems, $r['findings']);
    $inForm += $r['inForm'];
    $outside += $r['outside'];
    $buttons += $r['total'];
}

// ---- JavaScript ---------------------------------------------------------------------------------
$files = [];
foreach (glob($root . '/js/*.js') ?: [] as $f) {
    $files['js/' . basename($f)] = (string) file_get_contents($f);
}
$js = ecButtonJsFindings($files);
$problems = array_merge($problems, $js['findings']);

$vendor = 0;
foreach (glob($root . '/js/vendor/*.js') ?: [] as $f) {
    $vendor += preg_match_all("/createElement\(\s*['\"]button['\"]/", (string) file_get_contents($f));
}

if ($unrendered) {
    $problems[] = 'these pages could not be rendered, so their buttons were not read at all: '
        . implode(', ', $unrendered);
}

if ($problems) {
    echo 'Button types: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "This is a ratchet at zero, measured 2026-09-15: 161 of 161 in-form buttons across\n";
    echo "$pages rendered pages and 56 of 56 built in js/*.js declared their type, and the first\n";
    echo "one that does not fails the build. Nothing on this side of the wire can see the defect:\n";
    echo "the page renders, the control carries its own label, and it submits the form.\n";
    exit(1);
}

printf("Button types OK -- %d rendered button(s) on %d page(s); %d inside a <form>, every one "
    . "declaring\nits type. %d built in js/*.js, all %d typed. A ratchet at zero.\n",
    $buttons, $pages, $inForm, $js['created'], $js['typed']);
printf("Turned away and counted, never guessed at: %d button(s) outside every form (the default "
    . "submits\nnothing there -- Install.php ships one and it is correct), %d created without a "
    . "plain identifier\nto follow, and %d in js/vendor/, which is somebody else's code.\n",
    $outside, count($js['away']), $vendor);
foreach ($js['away'] as $a) { echo "  - $a\n"; }
exit(0);
