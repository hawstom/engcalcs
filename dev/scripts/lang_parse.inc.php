<?php
/**
 * Shared parser for $ec_lang assignments in lib/lang.ec.??.php.
 *
 * ROADMAP Task 163. Two tools parsed the language files with two different regexes:
 * lang_parity_check.php's parseLangAssignments() understood both quote styles, while
 * lang_syntax_validate.php's extractValues() matched single quotes only. Everything
 * built on the latter -- including Rule A (entity-in-lang-string) and Rule B
 * (tag-in-plain-text-string), which CLAUDE.md describes as absolute and tool-enforced
 * -- was therefore blind to every double-quoted assignment. That was not theoretical:
 * eight real translated content keys were written with double quotes (tr mpf_main_title,
 * mpf_main_desc, mpf_pipe_diameter, mpf_solver_no_solution, contactSendMessage;
 * bg contact_title; bg/fr contactSpamPostfix) and had never been checked by either rule.
 *
 * One regex now serves both, so the two tools cannot disagree about what a language
 * file contains. The delimiter itself is separately standardized to single quotes and
 * enforced by the double-quoted-assignment rule in lang_syntax_validate.php; this parser
 * still understands both forms deliberately, because a parser that only understood the
 * standard could not report a violation of it.
 *
 * TWO VIEWS OF A VALUE, and callers must pick deliberately:
 *   ecLangRawValues()  - the value exactly as written in the source, escapes intact
 *                        (\' stays \'). What the syntax rules want: they are checking
 *                        the literal text an author typed.
 *   ecLangValues()     - the value PHP would produce, escapes resolved. What comparison
 *                        wants: parity and untranslated-detection compare meaning, and
 *                        "Haws\'a" must equal "Haws'a".
 * Both come from the same single parse, so they can never drift.
 */

/**
 * Parses every $ec_lang['key'] = <value>; assignment in $content.
 *
 * Returns key => ['raw' => string, 'value' => string, 'quote' => "'" | '"' | ''].
 * A 'quote' of '' means the right-hand side was not a simple quoted literal
 * (a concatenation or constant); raw and value are then the trimmed expression
 * text, which is what both historical parsers did.
 *
 * Later assignments to the same key win, matching PHP's own behavior.
 */
function ecParseLangAssignments(string $content): array
{
    $pattern = '/\$ec_lang\[\'([^\']+)\'\]\s*=\s*(?:\'((?:[^\'\\\\]|\\\\.)*)\'|"((?:[^"\\\\]|\\\\.)*)"|([^;]*));/m';
    // PREG_UNMATCHED_AS_NULL is load-bearing: it distinguishes "this alternative did
    // not fire" (null) from "it fired and matched an empty string" ('').  Without it a
    // legitimately empty value -- $ec_lang['k']=''; -- is indistinguishable from an
    // unmatched group and falls through to the bare-expression branch.
    preg_match_all($pattern, $content, $matches, PREG_SET_ORDER | PREG_UNMATCHED_AS_NULL);

    $parsed = [];
    foreach ($matches as $m) {
        $key = $m[1];

        if (($m[2] ?? null) !== null) {
            $raw = $m[2];
            $parsed[$key] = ['raw' => $raw, 'value' => ecUnescapeSingleQuoted($raw), 'quote' => "'"];
        } elseif (($m[3] ?? null) !== null) {
            $raw = $m[3];
            $parsed[$key] = ['raw' => $raw, 'value' => ecUnescapeDoubleQuoted($raw), 'quote' => '"'];
        } else {
            $raw = trim($m[4] ?? '');
            $parsed[$key] = ['raw' => $raw, 'value' => $raw, 'quote' => ''];
        }
    }

    return $parsed;
}

/** key => value as written in the source, escape sequences left intact. */
function ecLangRawValues(string $content): array
{
    $out = [];
    foreach (ecParseLangAssignments($content) as $key => $entry) {
        $out[$key] = $entry['raw'];
    }
    return $out;
}

/** key => value as PHP would produce it, escape sequences resolved. */
function ecLangValues(string $content): array
{
    $out = [];
    foreach (ecParseLangAssignments($content) as $key => $entry) {
        $out[$key] = $entry['value'];
    }
    return $out;
}

/**
 * PHP single-quoted strings recognize exactly two escapes: \' and \\.
 * Everything else, including \n, is two literal characters -- which is why
 * stripcslashes() is the wrong tool here even though it looks close enough.
 */
function ecUnescapeSingleQuoted(string $raw): string
{
    return preg_replace('/\\\\([\'\\\\])/', '$1', $raw);
}

/**
 * Double-quoted values are being retired (Task 163), but the parser must still
 * read the ones that exist. Only the escapes that actually occur in these files
 * are handled; PHP's full set (\x41, \u{...}, octal) has never appeared and is
 * left alone rather than half-implemented.
 */
function ecUnescapeDoubleQuoted(string $raw): string
{
    return strtr($raw, [
        '\\"'  => '"',
        '\\\\' => '\\',
        '\\$'  => '$',
        '\\n'  => "\n",
        '\\t'  => "\t",
    ]);
}
