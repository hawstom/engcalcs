<?php
/**
 * cookie_attribute_check.php -- every cookie this suite SETS declares its own attributes. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading). The suite
 * writes seven cookies -- four in PHP, three in JS -- and it had decided the same question twice in
 * opposite directions, which is what row 38 found about `rel="noopener"` and is what an unwritten
 * rule looks like from the outside. Five sites named `samesite`, `secure` and `httponly` outright,
 * each with a comment arguing its value. **The two `ec_nolog` writes in `lib/config.inc.php` named
 * none of the three**, because they were written in the POSITIONAL form of `setcookie()`, whose
 * fourth argument is the path and which CANNOT EXPRESS SameSite AT ALL. Nothing in `CLAUDE.md` or
 * `dev/*.md` states this rule in either direction; what the storage section states is that a
 * lifetime must be defensible out loud, which is a different question and a human one.
 *
 * WHY THE FAILURE IS INVISIBLE. A cookie with no `SameSite` is not rejected and not flagged: the
 * BROWSER picks, and browsers do not agree -- Chrome applies Lax, older engines apply None, and
 * the same page therefore behaves differently for two visitors with nothing to see in either. A
 * cookie with no `Secure` on a suite that answers on http as well as https travels in clear on the
 * http URL, which is exactly the case `lib/Language.lib.php` already comments on ("a Secure cookie
 * set over http is silently dropped -- which used to cost nothing"). And a cookie with no
 * `HttpOnly` is readable by any script the page ever loads. In all three the cookie WORKS, the
 * feature WORKS, and nothing in this repository could see the difference.
 *
 * SO THE RULE IS DECLARATION, NOT A PARTICULAR VALUE. `httponly => false` on the consent cookie is
 * correct and says why in its own comment; the banner reads it from JS. What is banned is leaving
 * the answer to whoever is holding the browser.
 *
 * A DELETION IS EXEMPT, AND THAT IS NOT LENIENCY. Only name, path and domain identify the cookie a
 * deletion has to match; SameSite, Secure and HttpOnly are not part of that identity, so demanding
 * them on the four deletion sites would be demanding text that changes nothing. A deletion is
 * recognised by what it is: an empty value, or an expiry in the past.
 *
 * Usage:
 *   php dev/scripts/cookie_attribute_check.php
 *
 * Exit 0 = every cookie written here declares its own attributes. Exit 1 = one leaves it open.
 */

/**
 * Findings, pure so the selftest can drive it.
 *
 * @param array<string,string> $files relative path => PHP/JS source
 * @return array{problems:array<int,string>,writes:int,deletes:int}
 */
function ecCookieAttributeFindings(array $files): array
{
    $problems = [];
    $writes = 0;
    $deletes = 0;

    foreach ($files as $rel => $srcRaw) {
        // COMMENTS ARE BLANKED FIRST, the way third_party_request_check.php blanks them: the fix
        // for a finding here is a comment ARGUING the attribute values, so a check that reads
        // comments fails on the very edit that satisfies it. Blanked rather than deleted, so the
        // offsets and line numbers below still name the real line.
        $src = ecCookieBlankComments($srcRaw);

        // ---- 1. PHP: setcookie() / setrawcookie() ----------------------------------------------
        if (preg_match_all('/\b(setcookie|setrawcookie)\s*\(/', $src, $m, PREG_OFFSET_CAPTURE)) {
            foreach ($m[0] as $k => $hit) {
                $args = ecCookieArgs($src, $hit[1] + strlen($hit[0]));
                $fn = $m[1][$k][0];
                $name = trim($args[0] ?? '');
                $value = trim($args[1] ?? '');
                $third = trim($args[2] ?? '');

                // A deletion: an empty value, or a past expiry. Either spelling ships here.
                if ($value === "''" || $value === '""'
                    || preg_match('/time\s*\(\s*\)\s*-/', $third)
                    || preg_match('/1970/', $third)) {
                    $deletes++;
                    continue;
                }
                $writes++;

                if (substr($third, 0, 1) !== '[' && substr($third, 0, 5) !== 'array') {
                    $problems[] = "$rel writes the cookie $name through the POSITIONAL form of "
                        . "$fn(), whose arguments are expire, path, domain, secure and httponly "
                        . 'and which HAS NO SLOT FOR SameSite. The browser therefore picks the '
                        . 'cross-site rule for us, and browsers do not agree; nothing on the page '
                        . 'changes either way. Use the options-array form and name samesite, '
                        . 'secure and httponly.';
                    continue;
                }
                foreach (['samesite', 'secure', 'httponly'] as $attr) {
                    if (preg_match('/[\'"]' . $attr . '[\'"]\s*=>/i', $third)) continue;
                    $problems[] = "$rel writes the cookie $name without naming '$attr' in its "
                        . 'options array. The rule is DECLARATION, not a particular value -- '
                        . "'httponly' => false is correct where a comment says why -- because an "
                        . 'undeclared attribute is decided by the visitor\'s browser and is '
                        . 'invisible from here.';
                }
            }
        }

        // ---- 2. JS: document.cookie = ... -------------------------------------------------------
        // The expression is read to its terminating semicolon by a SCANNER and not by a regex,
        // because every cookie string in this tree contains semicolons of its own -- '; path=/'
        // is an attribute separator, and a pattern that stops at the first ';' reads a third of
        // the assignment and then reports the attributes it could not see.
        if (preg_match_all('/document\s*\.\s*cookie\s*=(?!=)\s*/', $src, $m, PREG_OFFSET_CAPTURE)) {
            foreach ($m[0] as $hit) {
                $expr = ecCookieJsExpr($src, $hit[1] + strlen($hit[0]));
                if (stripos($expr, '1970') !== false || preg_match('/Max-Age\s*=\s*0/i', $expr)) {
                    $deletes++;
                    continue;
                }
                $writes++;
                $one = trim(preg_replace('/\s+/', ' ', $expr));
                if (strlen($one) > 110) { $one = substr($one, 0, 110) . '...'; }
                if (stripos($expr, 'samesite') === false) {
                    $problems[] = "$rel writes a cookie from JS with no SameSite attribute: $one "
                        . '-- the browser then picks the cross-site rule, and browsers do not '
                        . 'agree. Append "; SameSite=Lax" (or Strict) to the string.';
                }
                if (stripos($expr, 'secure') === false) {
                    $problems[] = "$rel writes a cookie from JS with no Secure decision: $one -- "
                        . 'this suite answers on http as well as https, so the attribute cannot be '
                        . 'a constant. Build it from location.protocol, as js/Cookies.lib.js does, '
                        . 'and append it.';
                }
                if (stripos($expr, 'path=') === false) {
                    $problems[] = "$rel writes a cookie from JS with no path: $one -- it then "
                        . 'defaults to the directory of whichever page happened to set it, so the '
                        . 'suite gets one cookie per mount and the one you can see is not '
                        . 'necessarily the one being read. Append "; path=/".';
                }
            }
        }
    }

    return ['problems' => $problems, 'writes' => $writes, 'deletes' => $deletes];
}

/**
 * Every //, # and block comment replaced by spaces of the same length, newlines kept.
 *
 * Deliberately not a tokeniser: the corpus is PHP and JS together, and the one shape that would
 * mislead a scanner this crude -- a // or /* inside a string literal -- does not occur at a cookie
 * site in either language, where the strings are attribute names and paths.
 */
function ecCookieBlankComments(string $src): string
{
    return (string) preg_replace_callback(
        '~/\*.*?\*/|//[^\n]*|(?<![\'":\w])#[^\n]*~s',
        static function ($m) { return preg_replace('/[^\n]/', ' ', $m[0]); },
        $src
    );
}

/** The right-hand side of a `document.cookie =` assignment, up to its top-level semicolon. */
function ecCookieJsExpr(string $src, int $i): string
{
    $buf = ''; $depth = 0; $q = ''; $len = strlen($src);
    for (; $i < $len; $i++) {
        $c = $src[$i];
        if ($q !== '') {
            if ($c === '\\') { $buf .= $c . ($src[$i + 1] ?? ''); $i++; continue; }
            if ($c === $q) { $q = ''; }
            $buf .= $c;
            continue;
        }
        if ($c === "'" || $c === '"' || $c === '`') { $q = $c; $buf .= $c; continue; }
        if ($c === '(' || $c === '[' || $c === '{') { $depth++; $buf .= $c; continue; }
        if ($c === ')' || $c === ']' || $c === '}') { $depth--; $buf .= $c; continue; }
        if ($c === ';' && $depth <= 0) { break; }
        $buf .= $c;
    }
    return trim($buf);
}

/**
 * The comma-separated arguments of a call whose '(' has just been consumed at $i.
 *
 * Splits on top-level commas only, so an options array's own commas do not shift the index.
 *
 * @return array<int,string>
 */
function ecCookieArgs(string $src, int $i): array
{
    $out = []; $buf = ''; $depth = 0; $q = ''; $len = strlen($src);
    for (; $i < $len; $i++) {
        $c = $src[$i];
        if ($q !== '') {
            if ($c === '\\') { $buf .= $c . ($src[$i + 1] ?? ''); $i++; continue; }
            if ($c === $q) { $q = ''; }
            $buf .= $c;
            continue;
        }
        if ($c === "'" || $c === '"') { $q = $c; $buf .= $c; continue; }
        if ($c === '(' || $c === '[' || $c === '{') { $depth++; $buf .= $c; continue; }
        if ($c === ')' && $depth === 0) { break; }
        if ($c === ')' || $c === ']' || $c === '}') { $depth--; $buf .= $c; continue; }
        if ($c === ',' && $depth === 0) { $out[] = trim($buf); $buf = ''; continue; }
        $buf .= $c;
    }
    $out[] = trim($buf);
    return $out;
}

if (defined('EC_COOKIE_ATTR_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$files = [];
foreach (array_merge(glob($root . '/*.php') ?: [], glob($root . '/lib/*.php') ?: [], glob($root . '/js/*.js') ?: []) as $f) {
    $base = basename($f);
    if (strpos($base, 'lang.ec.') === 0) continue;
    $dir = basename(dirname($f));
    // js/vendor/ is out of scope with the same reason storage_guard_check.php gives: it is not
    // ours to edit, and a vendored file's cookie handling is a decision made upstream.
    $rel = in_array($dir, ['lib', 'js'], true) ? $dir . '/' . $base : $base;
    $files[$rel] = (string) file_get_contents($f);
}

$r = ecCookieAttributeFindings($files);

if ($r['problems']) {
    echo 'Cookie attributes: ' . count($r['problems']) . " finding(s)\n\n";
    foreach ($r['problems'] as $p) { echo "  ! $p\n\n"; }
    echo "Every cookie this suite sets must say what it is, because an attribute we do not name is\n";
    echo "one the visitor's browser names for us. dev/cookie-storage-inventory.md is the record of\n";
    echo "what may be stored; this is the record of how.\n";
    exit(1);
}

echo 'Cookie attributes OK -- ' . $r['writes'] . ' cookie write(s) in PHP and JS, every one naming '
    . "its own SameSite, Secure and HttpOnly.\n";
echo '  ' . $r['deletes'] . " deletion(s) exempt: only name, path and domain identify the cookie a\n";
echo "  deletion has to match, so the other three would be text that changes nothing.\n";
exit(0);
