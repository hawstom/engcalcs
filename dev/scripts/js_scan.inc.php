<?php
/**
 * js_scan.inc.php — one comment-blanking pass over JavaScript, shared by the checks that must
 * read CODE and not PROSE.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. Two checks in this directory ask questions of the form "does the shipped
 * JavaScript do X", and in this repo the comments are longer than the code — `js/looped-network.js`
 * is 47% comment lines. Every one of those comments is free to name a host, quote a storage key or
 * describe a defect being fixed, and a grep cannot tell any of that from the thing itself. The
 * survey behind ROADMAP Task 322 measured it: 11 distinct hosts appear in `js/*.js` and only 3 of
 * them are ever requested. A check that reads the raw text is wrong eight times out of eleven.
 *
 * BLANKING, NOT DELETING. Comment bytes become spaces and newlines are kept, so a line number in
 * the blanked text is the line number in the file, and an error message can point at it. That is
 * the whole reason not to just strip.
 *
 * REGEX LITERALS ARE THE TRAP, and they are why this is a state machine rather than a pair of
 * preg_replace() calls. `/[^/]*` inside a regex literal opens a line comment as far as a naive
 * scanner is concerned, and everything after it on the line disappears — silently, and in the
 * direction that makes a check pass. The `/` that begins a regex is distinguished from division by
 * the standard heuristic: a regex may begin only where a VALUE may begin, i.e. after an operator,
 * an opening bracket, a comma, a semicolon, a colon, or the start of the file. That heuristic is
 * wrong only for cases this repo does not contain (`a++ /re/`), and being wrong there costs a
 * false positive, which is loud.
 *
 * Template literals are treated as ordinary strings. Their `${...}` holes could in principle carry
 * a comment; none here does, and treating the hole as string text can only hide a finding inside a
 * template hole, never invent one.
 *
 * This file defines functions and nothing else, so it is safe to require from a check or a
 * selftest.
 */

/**
 * Replace every comment in JavaScript source with spaces, preserving length and line numbers.
 *
 * @param string $src JavaScript source.
 * @return string Same length as $src, with comment bytes blanked to spaces.
 */
function ecBlankJsComments(string $src): string
{
    $n = strlen($src);
    $out = $src;
    $i = 0;
    $state = 'code';        // code | line | block | string | regex
    $quote = '';
    $inClass = false;       // inside a [...] character class of a regex literal
    $prev = '';             // last significant code character seen, for the regex heuristic

    while ($i < $n) {
        $c = $src[$i];
        $d = $i + 1 < $n ? $src[$i + 1] : '';

        if ($state === 'code') {
            if ($c === '/' && $d === '/') { $state = 'line'; $out[$i] = ' '; $out[$i + 1] = ' '; $i += 2; continue; }
            if ($c === '/' && $d === '*') { $state = 'block'; $out[$i] = ' '; $out[$i + 1] = ' '; $i += 2; continue; }
            if ($c === '"' || $c === "'" || $c === '`') { $state = 'string'; $quote = $c; $prev = $c; $i++; continue; }
            if ($c === '/' && ecJsRegexMayStart($prev)) { $state = 'regex'; $inClass = false; $i++; continue; }
            if (strpos(" \t\r\n", $c) === false) { $prev = $c; }
            $i++;
            continue;
        }

        if ($state === 'line') {
            if ($c === "\n") { $state = 'code'; $prev = ''; } else { $out[$i] = ' '; }
            $i++;
            continue;
        }

        if ($state === 'block') {
            if ($c === '*' && $d === '/') { $state = 'code'; $out[$i] = ' '; $out[$i + 1] = ' '; $i += 2; continue; }
            if ($c !== "\n") { $out[$i] = ' '; }
            $i++;
            continue;
        }

        if ($state === 'string') {
            if ($c === '\\') { $i += 2; continue; }
            if ($c === $quote) { $state = 'code'; }
            $i++;
            continue;
        }

        // regex
        if ($c === '\\') { $i += 2; continue; }
        if ($c === '[') { $inClass = true; $i++; continue; }
        if ($c === ']') { $inClass = false; $i++; continue; }
        if ($c === '/' && !$inClass) { $state = 'code'; $prev = '/'; $i++; continue; }
        if ($c === "\n") { $state = 'code'; $prev = ''; }   // an unterminated regex was division
        $i++;
    }

    return $out;
}

/**
 * May a regex literal begin after this character? True where a VALUE may begin.
 *
 * @param string $prev Last significant code character, '' at the start of input.
 */
function ecJsRegexMayStart(string $prev): bool
{
    if ($prev === '') { return true; }
    return strpos('(,=:[!&|?{};+-*%^~<>', $prev) !== false;
}

/**
 * Read a JS file with its comments blanked.
 *
 * @param string $path Absolute path.
 * @return string Blanked source, or '' if unreadable.
 */
function ecReadJsCode(string $path): string
{
    $src = @file_get_contents($path);
    return $src === false ? '' : ecBlankJsComments($src);
}
