<?php
/**
 * js_page_url_check.php -- a suite page addressed from JavaScript is addressed from the ORIGIN.
 * BLOCKING, and a ratchet at zero.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. Tom, 2026-09-12, clicking his own Help menu on librewaternet.org:
 * *"Help, Fix and Privacy Notice, Terms of use, this is a broken link."*
 *
 * All three were, and so were Install and the example gallery's own legal row -- six sites, each
 * written as a bare `'privacy.php'`, `'terms.php'`, `'contact.php?from=…'` or `'Install.php'`.
 * That is correct at `hawsedc.com/engcalcs/Looped-Network.php` and DEAD at
 * `librewaternet.org/app/`, because **`/app/` is a REWRITE onto that page and a rewrite is not a
 * directory**: the browser resolves a relative URL against the address the visitor typed, so the
 * six asked for `librewaternet.org/privacy.php` and got 404.
 *
 * **THIS IS nav_link_absolute_check.php's FINDING IN ANOTHER CONSTRUCT, and the reason it needed a
 * second check is scope.** That one reads the RENDERED nav of 27 pages; these URLs do not exist in
 * any rendered page, because they are built inside a JS menu at the moment somebody opens it. So
 * the navbar was fixed on 2026-09-09, the Help menu next to it was left broken, and the failure is
 * the same one in both: **it cannot be seen from inside this repository.** The JavaScript is
 * byte-identical on both hosts and only the base URL differs, so every link spells correctly, the
 * menu row draws correctly, a harness sees a string, and a person has to click it on the right
 * host to find out.
 *
 * WHAT IS ALLOWED, and it is a short list on purpose:
 *   - A literal beginning `/` -- root-anchored, which is what the ~210 hardcoded `/engcalcs/…`
 *     paths in this tree already are.
 *   - A literal beginning `http` -- somebody else's origin, or ours stated in full.
 *   - A relative literal that is the argument of `suiteUrl(` -- the ONE door, which prepends
 *     `EngCalcs.suiteBase`. Anything else relative is a finding.
 *
 * TWO THINGS MAKE IT HONEST, and the first run of it needed both.
 *
 * **COMMENTS ARE BLANKED AND STRING LITERALS ARE NOT**, which is the reverse of most scans here:
 * the finding IS a string literal, while the prose around it discusses page names constantly --
 * the comment above the fix in `js/looped-network.js` quotes `'privacy.php'` in order to explain
 * it, and this file's own docblock does the same. A scan reading prose reports those and is
 * switched off within the day.
 *
 * **AND THE BLANKER HAS TO KNOW A REGEX LITERAL FROM A DIVISION**, which is the part that bit.
 * `js/Calculators.lib.js` contains `/['"]/`; a character scanner that does not recognise regex
 * literals reads that quote as the start of a string and swallows everything after it, comments
 * included, as one enormous literal. The first run of this check duly reported a finding spanning
 * fifteen lines of prose about the definition of a foot. The discriminator is the standard one --
 * a `/` opens a regex when the last significant character was one that cannot end an expression.
 *
 * On top of that the candidate must be URL-SHAPED: no whitespace, and only characters a URL is
 * made of. Anything else is turned away and COUNTED, because a scan that has quietly stopped
 * seeing things reports nothing and reads as success.
 *
 * `js/vendor/` is out of scope by declaration: it is somebody else's code, held byte-for-byte by
 * vendor_integrity_check.php, and it addresses none of our pages.
 *
 * THE TWO THINGS IT CANNOT SEE, stated rather than pretended away:
 *   - A URL assembled from pieces (`var p = 'privacy'; open(p + '.php')`). No literal to judge.
 *     Nothing in this tree does it, and a scanner cannot decide it in general.
 *   - Whether the page named actually EXISTS. dom_id_resolve_check.php's sibling question, and a
 *     different check; this one is only about the base it resolves against.
 *
 * Usage:
 *   php dev/scripts/js_page_url_check.php
 *
 * Exit 0 = every page URL resolves from the origin. Exit 1 = one of them resolves against whatever
 * address the visitor happens to have arrived at.
 */

/**
 * Comments blanked, string literals KEPT, newlines preserved so line numbers survive.
 *
 * The regex-literal state is not decoration: see the docblock. A `/` begins a regex when the last
 * significant character cannot end an expression -- an operator, an opening bracket, a comma, a
 * semicolon or the start of the file -- and begins a division otherwise. Inside a regex a quote is
 * an ordinary character and a `//` is not a comment, which is exactly the confusion being avoided.
 */
function ecJsUrlBlankComments(string $src): string
{
    $out = '';
    $n = strlen($src);
    $i = 0;
    $state = 'code';
    $quote = '';
    $inClass = false;   // inside a [...] within a regex, where an unescaped / is literal
    $prev = '';         // last significant code character emitted
    while ($i < $n) {
        $c = $src[$i];
        $c2 = $i + 1 < $n ? $src[$i + 1] : '';
        if ($state === 'code') {
            if ($c === '/' && $c2 === '/') { $state = 'line'; $i += 2; continue; }
            if ($c === '/' && $c2 === '*') { $state = 'block'; $i += 2; continue; }
            if ($c === '/' && ($prev === '' || strpos('(,=:[!&|?{};+-*%~^<>', $prev) !== false)) {
                $state = 'regex'; $inClass = false; $out .= ' '; $i++; continue;
            }
            if ($c === '"' || $c === "'" || $c === '`') { $quote = $c; $state = 'str'; }
            $out .= $c;
            if (trim($c) !== '') { $prev = $c; }
            $i++; continue;
        }
        if ($state === 'line') { if ($c === "\n") { $out .= "\n"; $state = 'code'; } $i++; continue; }
        if ($state === 'block') {
            if ($c === "\n") { $out .= "\n"; }
            if ($c === '*' && $c2 === '/') { $state = 'code'; $i += 2; continue; }
            $i++; continue;
        }
        if ($state === 'regex') {
            // Blanked rather than kept: a regex is never a URL, and its quotes are what caused the
            // trouble. A newline cannot appear in one, so an unterminated regex self-corrects.
            if ($c === '\\') { $i += 2; continue; }
            if ($c === "\n") { $out .= "\n"; $state = 'code'; $prev = ''; $i++; continue; }
            if ($c === '[') { $inClass = true; }
            elseif ($c === ']') { $inClass = false; }
            elseif ($c === '/' && !$inClass) { $state = 'code'; $prev = ')'; }
            $i++; continue;
        }
        // Inside a string: kept verbatim, because it is the thing being judged.
        $out .= $c;
        if ($c === '\\' && $c2 !== '') { $out .= $c2; $i += 2; continue; }
        if ($c === $quote) { $state = 'code'; $prev = $quote; }
        $i++;
    }
    return $out;
}

/**
 * Findings and the counts, pure so the selftest can drive it with fixtures.
 *
 * @param array<string,string> $files rel path => JS source
 * @return array{findings: array<int,string>, absolute: int, viaDoor: int, turnedAway: int}
 */
function ecJsPageUrlFindings(array $files): array
{
    $findings = [];
    $absolute = 0;
    $viaDoor = 0;
    $turnedAway = 0;

    // A quoted run of URL characters naming one of this suite's own pages. `.php` is the whole
    // test of ownership: every page in this tree is a `.php`, and no third-party URL we use ends
    // in one. The character class is what keeps it timid -- see the note above.
    $rx = '/([\'"])([A-Za-z0-9_.\/?=&%#:~-]*\.php[A-Za-z0-9_.\/?=&%#:~-]*)\1/';
    // Anything .php-bearing that the shape test refuses, so a silence is visible as a count.
    $loose = '/[\'"][^\'"]*\.php[^\'"]*[\'"]/';

    foreach ($files as $rel => $src) {
        $raw = ecJsUrlBlankComments($src);
        if (preg_match_all($loose, $raw, $lm)) { $turnedAway += count($lm[0]); }
        if (!preg_match_all($rx, $raw, $m, PREG_OFFSET_CAPTURE)) { continue; }
        $turnedAway -= count($m[0]);
        foreach ($m[2] as $k => $hit) {
            $url = $hit[0];
            $at = $m[0][$k][1];
            $line = substr_count(substr($raw, 0, $at), "\n") + 1;
            if ($url[0] === '/' || stripos($url, 'http') === 0) { $absolute++; continue; }
            // The one door. Read from the source rather than trusted: `suiteUrl(` immediately
            // before the opening quote is the only shape that prepends the base.
            $pre = substr($raw, max(0, $at - 10), min(10, $at));
            if (substr($pre, -9) === 'suiteUrl(') { $viaDoor++; continue; }
            $findings[] = $rel . ':' . $line . ': relative page URL ' . $url .
                ' -- correct at /engcalcs/ and a 404 under the /app/ rewrite.' .
                ' Write suiteUrl(\'' . $url . '\') or an absolute /engcalcs/ path.';
        }
    }

    return ['findings' => $findings, 'absolute' => $absolute, 'viaDoor' => $viaDoor,
        'turnedAway' => max(0, $turnedAway)];
}

/** Every shipped JS file, vendor excluded by declaration. @return array<string,string> */
function ecJsPageUrlFiles(string $root): array
{
    $out = [];
    foreach (glob($root . '/js/*.js') as $path) {
        $out['js/' . basename($path)] = (string)file_get_contents($path);
    }
    return $out;
}

if (realpath($argv[0]) === realpath(__FILE__)) {
    $root = dirname(__DIR__, 2);
    $res = ecJsPageUrlFindings(ecJsPageUrlFiles($root));

    // **THE DOOR MUST EXIST AT BOTH ENDS.** A `suiteUrl()` reading a base no page emits would
    // silently fall back, which is a right answer reached by an accident rather than by the design.
    $lpn = (string)@file_get_contents($root . '/js/looped-network.js');
    $php = (string)@file_get_contents($root . '/lib/HeadersFooters.lib.php');
    if ($res['viaDoor'] > 0 && strpos($lpn, 'function suiteUrl(page)') === false) {
        $res['findings'][] = 'js/looped-network.js: suiteUrl() is called but not defined here.';
    }
    if (strpos($lpn, 'EngCalcs.suiteBase') !== false && strpos($php, 'EngCalcs.suiteBase =') === false) {
        $res['findings'][] = 'lib/HeadersFooters.lib.php: nothing emits EngCalcs.suiteBase, so' .
            ' suiteUrl() runs on its fallback alone.';
    }

    // Counted and printed, because a scan that has gone blind finds nothing and reads as progress.
    printf("js page URLs: %d absolute, %d through suiteUrl(), %d .php literals not URL-shaped and not judged\n",
        $res['absolute'], $res['viaDoor'], $res['turnedAway']);
    if ($res['findings']) {
        echo "\nFAIL -- a page URL that resolves against the visitor's address:\n";
        foreach ($res['findings'] as $f) { echo '  ' . $f . "\n"; }
        exit(1);
    }
    echo "OK -- every page addressed from JavaScript resolves from the origin.\n";
}
