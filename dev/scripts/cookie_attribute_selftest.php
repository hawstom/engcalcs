<?php
/**
 * cookie_attribute_selftest.php -- cookie_attribute_check.php can still FAIL. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS IS A RATCHET AT ZERO. A ratchet that has gone
 * blind looks exactly like one that is holding, and here it looks BETTER: narrow the scan by one
 * character and it prints "0 cookie writes, every one naming its own attributes" and exits 0
 * forever. So the negative cases are the load-bearing half -- anybody can write a scanner that
 * finds things -- and the corpus count at the bottom is what stops a silent collapse to zero.
 *
 * THE TWO SHAPES THAT ALREADY DEFEATED A DRAFT ARE FIXTURES, and both are real text in this tree:
 * a `setcookie(` written inside the COMMENT that argues the attribute values (the fix for a
 * finding is a comment mentioning setcookie, so a check reading comments fails on the edit that
 * satisfies it), and a `document.cookie =` whose own value is full of semicolons, where a pattern
 * stopping at the first one reads a third of the assignment and reports the attributes it could
 * not see.
 *
 *   php dev/scripts/cookie_attribute_selftest.php
 */

define('EC_COOKIE_ATTR_LIB_ONLY', 1);
require __DIR__ . '/cookie_attribute_check.php';

$fails = [];
$n = 0;

/** @param array<string,string> $files */
function ecCookieCase(string $name, array $files, bool $want, ?string $mustSay = null): void
{
    global $fails, $n;
    $n++;
    $r = ecCookieAttributeFindings($files);
    $hit = $r['problems'] !== [];
    if ($hit !== $want) {
        $fails[] = $name . "\n        wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($r['problems']) . ': ' . $r['problems'][0] : 'none');
        return;
    }
    if ($mustSay !== null && $hit && stripos(implode(' ', $r['problems']), $mustSay) === false) {
        $fails[] = $name . "\n        the finding never mentions '$mustSay': " . $r['problems'][0];
    }
}

$good = "setcookie(EC_SEEN_COOKIE, \$value, ['expires' => 0, 'path' => '/', "
    . "'samesite' => 'Lax', 'secure' => ecCookieSecure(), 'httponly' => true]);";

// ---- 1. PHP: what it must FIND ------------------------------------------------------------------
ecCookieCase('THE DEFECT AS IT SHIPPED: the positional form, which has no slot for SameSite at all',
    ['lib/config.inc.php' => "setcookie(EC_NOLOG_COOKIE, '1', time() + 86400, '/');"], true, 'POSITIONAL');
ecCookieCase('the array form with samesite left out',
    ['lib/config.inc.php' => "setcookie(A, \$v, ['expires' => 0, 'path' => '/', 'secure' => true, 'httponly' => true]);"],
    true, 'samesite');
ecCookieCase('the array form with secure left out',
    ['lib/config.inc.php' => "setcookie(A, \$v, ['expires' => 0, 'path' => '/', 'samesite' => 'Lax', 'httponly' => true]);"],
    true, 'secure');
ecCookieCase('the array form with httponly left out -- the one whose right answer is sometimes false',
    ['lib/config.inc.php' => "setcookie(A, \$v, ['expires' => 0, 'path' => '/', 'samesite' => 'Lax', 'secure' => true]);"],
    true, 'httponly');
ecCookieCase('setrawcookie(), the sibling that is easy to forget exists',
    ['lib/config.inc.php' => "setrawcookie('x', '1', time() + 86400, '/');"], true);

// ---- 2. PHP: what it must NOT report ------------------------------------------------------------
ecCookieCase('a complete declaration, as five sites already ship', ['lib/config.inc.php' => $good], false);
ecCookieCase("httponly => FALSE is a DECLARATION, not an omission -- the consent cookie is read from JS",
    ['lib/config.inc.php' => "setcookie(C, \$v, ['expires' => 0, 'path' => '/', 'samesite' => 'Lax', "
        . "'secure' => ecCookieSecure(), 'httponly' => false]);"], false);
ecCookieCase('A DELETION IS EXEMPT: only name, path and domain identify the cookie it must match',
    ['lib/config.inc.php' => "setcookie(EC_NOLOG_COOKIE, '', time() - 86400, '/');"], false);
ecCookieCase('a deletion in the array form, which ecForgetAnalyticsStorage() writes',
    ['lib/config.inc.php' => "setcookie(\$name, '', ['expires' => time() - 86400, 'path' => '/']);"], false);
ecCookieCase('THE SHAPE THAT DEFEATED A DRAFT: setcookie( inside the comment that argues the values',
    ['lib/config.inc.php' => "// This was the one write left in the POSITIONAL form of setcookie(), whose\n"
        . "// fourth argument is the path.\n" . $good], false);
ecCookieCase('a docblock naming the function, which every one of these files has',
    ['lib/config.inc.php' => "/**\n * Writes the record with setcookie(NAME, v, time()+1, '/').\n */\n" . $good], false);

// ---- 3. JS: what it must FIND -------------------------------------------------------------------
ecCookieCase('a JS write with no SameSite',
    ['js/lpn-search.js' => "document.cookie = n + '=' + v + '; expires=' + e + '; path=/' + secure;"],
    true, 'SameSite');
ecCookieCase('a JS write with no Secure decision, on a suite that answers on http too',
    ['js/lpn-search.js' => "document.cookie = n + '=' + v + '; path=/; SameSite=Lax';"], true, 'Secure');
ecCookieCase('a JS write with no path, which silently becomes one cookie per directory',
    ['js/lpn-search.js' => "document.cookie = n + '=' + v + '; SameSite=Lax' + secure;"], true, 'path');

// ---- 4. JS: what it must NOT report -------------------------------------------------------------
ecCookieCase('THE SEMICOLON SHAPE: a two-line assignment whose own value is full of semicolons',
    ['js/lpn-search.js' => "document.cookie = cookieName() + '=' + value + '; expires=' + expires +\n"
        . "\t\t\t'; path=/; SameSite=Lax' + secure;"], false);
ecCookieCase('the epoch deletion, in the spelling all four of them use',
    ['js/Cookies.lib.js' => "document.cookie = this.cookieName + \"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/\";"], false);
ecCookieCase('Max-Age=0, the other deletion spelling, which nothing here writes yet',
    ['js/lpn-terrain.js' => "document.cookie = n + '=; Max-Age=0; path=/';"], false);
ecCookieCase('READING document.cookie is not writing it',
    ['js/lpn-search.js' => "var all = document.cookie.split('; ');"], false);
ecCookieCase('an inline script inside a PHP file, which is where the consent banner writes its own',
    ['lib/Consent.lib.php' => "document.cookie = 'ec_consent=' + value + '; expires=' + expires + "
        . "'; path=/; SameSite=Lax' + secure;"], false);
ecCookieCase('the word cookie in prose, with no assignment',
    ['privacy.php' => 'A cookie is stored on your device.'], false);

// ---- 5. The corpus, so a silently-narrowed scan cannot pass -------------------------------------
$out = []; $code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/cookie_attribute_check.php') . ' 2>&1', $out, $code);
$text = implode("\n", $out);
$n++;
if ($code !== 0) {
    $fails[] = "the check exits $code on the tree it is guarding:\n        "
        . str_replace("\n", "\n        ", $text);
}
$n++;
if (!preg_match('/(\d+) cookie write/', $text, $m) || (int) $m[1] < 8) {
    $fails[] = 'the check reports ' . ($m[1] ?? 'no') . ' cookie write(s). Nine shipped on '
        . '2026-09-06 -- five in PHP, four in JS. A collapse means the scan went blind, and a '
        . 'blind scan here prints a smaller number and exits 0, which reads as tidier.';
}
$n++;
if (!preg_match('/(\d+) deletion/', $text, $m) || (int) $m[1] < 4) {
    $fails[] = 'the check reports ' . ($m[1] ?? 'no') . ' deletion(s). Five shipped, and the '
        . 'deletion leg is what stops this check demanding text that changes nothing -- if it '
        . 'stops recognising them they become findings nobody can honestly fix.';
}

if ($fails) {
    echo 'cookie_attribute selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "cookie_attribute selftest OK -- $n cases, both directions, plus the corpus counts.\n";
