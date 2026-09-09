<?php
/**
 * lang_placeholder_check.php -- EVERY {placeholder} A SHIPPED STRING CARRIES IS ONE THE SUITE CAN
 * SUBSTITUTE, AND A REPEATED ONE IS SUBSTITUTED GLOBALLY.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHAT A PLACEHOLDER IS HERE. 132 English strings carry a token in curly braces -- `Showing {n} of
 * {all}`, `Not a property of {scope}: {w}` -- and the page replaces it at runtime. The translation
 * payload tells all 26 agents to keep every one of them, spelled exactly, and adds that they MAY
 * move a placeholder to wherever their language needs it in the sentence. So the token is a
 * contract between a translated string and a line of JavaScript, and until this check nothing had
 * read the JavaScript end of it.
 *
 * WHAT WAS ALREADY HELD, so this is not a second opinion about it: `lang_tag_parity_check.php
 * --strict` compares the SET of placeholders in each translation against its English source, which
 * catches a translator dropping `{n}` or inventing `{count}`. It compares a set, per key, between
 * two language files. It never asks whether anything can substitute the token at all, and it
 * deliberately unique()s, so it cannot see a repeat.
 *
 * THE THREE THINGS THIS ASKS, none of which anything asked before:
 *
 *   1. **CAN ANYTHING SUBSTITUTE IT?** A token no substitution site names reaches the visitor with
 *      its braces on, in all 27 languages at once, in a sentence that otherwise reads correctly.
 *      This is the third member of the suite's name-resolution family, beside
 *      `icon_name_check.php` and `dom_id_resolve_check.php`: the failure is not an error, it is a
 *      name that resolves to nothing.
 *
 *   2. **IS A REPEATED TOKEN SUBSTITUTED GLOBALLY?** `String.prototype.replace()` given a STRING
 *      pattern replaces the FIRST occurrence only. The suite writes that form 154 times and the
 *      global forms -- `.split('{t}').join(v)` and `.replace(/\{t\}/g, v)` -- 12 times, which is the
 *      shape of a rule somebody knew and nobody wrote down. It matters because a repeat is legal
 *      and already shipped: `lpn_push_base_only` carries `{base}` twice in all 27 language files
 *      and its two substitution sites both use `/g`, which is the evidence that somebody met this
 *      once. A translator is explicitly invited to move a placeholder, and word order in some
 *      languages wants the noun twice; set-parity permits it. If the site for that token is the
 *      first-only form, the second occurrence reaches the screen as `{base}`.
 *
 *   3. **IS ANYTHING SUBSTITUTING A TOKEN NO STRING CARRIES?** Printed, never failed -- see the
 *      exemption below.
 *
 * THE FOUR SUBSTITUTION IDIOMS THIS TREE USES, read from comment-blanked source:
 *      .replace('{t}', v)          FIRST OCCURRENCE ONLY
 *      .replace(/\{t\}/g, v)       global (or first-only without the g flag, and read that way)
 *      .split('{t}').join(v)       global
 *      a MESSAGE CALL: a call whose first argument is a literal $ec_lang key, whose object-literal
 *                      argument names the tokens, substituted by a helper doing
 *                      `t.split('{' + k + '}').join(subs[k])`   global
 * PHP is read too, for `str_replace('{t}', ...)`. It contributes nothing today and is scanned so
 * that moving a substitution into PHP does not silently empty this check.
 *
 * THE MESSAGE-CALL FORM IS POOLED PER FILE, and that is a declared conservatism rather than an
 * oversight. `js/looped-network.js` reaches its substituter through a wrapper -- `fail(key,
 * fallback, subs)` forwards to `findMsg(key, fallback, subs)` -- so binding a token to the one
 * message that uses it would need a call-graph. Pooling can only make finding 1 more lenient, never
 * invent one, and the honest price is stated here rather than left to be discovered.
 *
 * TURNED AWAY AND COUNTED: a `.replace()` or `.split()` whose pattern is not a literal brace token
 * (a computed name, a variable) has no name to resolve. The count is printed.
 *
 * DECLARED EXEMPT, with the reason: the raster tile URL template `{z}` / `{x}` / `{y}`
 * (`js/looped-network.js`, `tileSource().url().replace('{z}', z)`). That is somebody else's format
 * -- the XYZ tile convention OpenStreetMap and Mapbox both publish -- and it has nothing to do with
 * a language string. It is exempt from finding 3 only; if a language string ever carries `{x}`, and
 * one does today, finding 1 still resolves it against the same site.
 *
 * Exit 0 clean, 1 on a finding of kind 1 or 2. Blocking: there is no judgement in either.
 *
 * Usage:  php dev/scripts/lang_placeholder_check.php
 */

/** The XYZ raster-tile template. Not a language placeholder; see the docblock. */
const EC_PH_TILE_TEMPLATE = ['{z}', '{x}', '{y}'];

/**
 * The placeholder tokens in one string, in order, with repeats kept.
 *
 * @return array<int,string>
 */
function ecPhTokens(string $value): array
{
    preg_match_all('/\{[A-Za-z_][A-Za-z0-9_]*\}/', $value, $m);
    return $m[0];
}

/**
 * Every substitution site in one comment-blanked JavaScript source.
 *
 * Pure, so the selftest can put fixtures through it.
 *
 * @param string $code   Comment-blanked JavaScript.
 * @param string $label  How to name this file in a message.
 * @param array<string,bool> $langKeys Defined $ec_lang key names, for the message-call form.
 * @return array{sites:array<string,array<int,array{how:string,global:bool,where:string}>>,turned:int}
 */
function ecPhJsSites(string $code, string $label, array $langKeys): array
{
    $sites = [];
    $turned = 0;
    $add = function (string $tok, string $how, bool $global) use (&$sites, $label) {
        $sites[$tok][] = ['how' => $how, 'global' => $global, 'where' => $label];
    };

    // .replace('{t}', ...) and .split('{t}')
    if (preg_match_all('/\.(replace|split)\(\s*([\'"])(\{[A-Za-z_][A-Za-z0-9_]*\})\2/', $code, $m, PREG_SET_ORDER)) {
        foreach ($m as $h) {
            // .split() cuts on every occurrence; .join() then puts the value back between all of
            // them, so the split/join pair is global. .replace() with a string pattern is not.
            $add($h[3], '.' . $h[1] . "('" . $h[3] . "')", $h[1] === 'split');
        }
    }
    // .replace(/\{t\}/flags, ...)
    if (preg_match_all('/\.replace\(\s*\/\\\\\{([A-Za-z_][A-Za-z0-9_]*)\\\\\}\/([a-z]*)/', $code, $m, PREG_SET_ORDER)) {
        foreach ($m as $h) {
            $add('{' . $h[1] . '}', '.replace(/\{' . $h[1] . '\}/' . $h[2] . ')', strpos($h[2], 'g') !== false);
        }
    }
    // A pattern this check cannot resolve to a name: counted, never a silent pass.
    $turned += preg_match_all('/\.(?:replace|split)\(\s*(?:[\'"]\{\s*[\'"]|\/\\\\\{[^A-Za-z_])/', $code);

    // The MESSAGE-CALL form. Only where the file actually contains a dynamic brace substituter,
    // so an ordinary call carrying a lang key never contributes tokens.
    if (preg_match('/\.split\(\s*[\'"]\{[\'"]\s*\+/', $code)) {
        foreach (ecPhMessageCallKeys($code, $langKeys) as $tok) {
            $add($tok, 'message call (pooled)', true);
        }
    }

    return ['sites' => $sites, 'turned' => $turned];
}

/**
 * Token names taken from the object literals of MESSAGE CALLS -- a call whose first argument is a
 * single-quoted string that is a DEFINED $ec_lang key. Pooled per file; see the docblock.
 *
 * The lang-key gate is what makes the pooling affordable. Without it `svgEl('rect', {x1: .., y1: ..})`
 * reads as a message call and every geometry property in the file becomes a substitutable token:
 * measured at 50 such names in js/looped-network.js on the first draft, which would have made
 * finding 1 unable to fail.
 *
 * @param array<string,bool> $langKeys Defined $ec_lang key names.
 * @return array<int,string> Tokens in `{name}` form.
 */
function ecPhMessageCallKeys(string $code, array $langKeys): array
{
    $out = [];
    if (!preg_match_all('/\(\s*\'([a-z][a-z0-9_]*)\'\s*,/', $code, $m, PREG_OFFSET_CAPTURE | PREG_SET_ORDER)) {
        return $out;
    }
    foreach ($m as $hit) {
        if (!isset($langKeys[$hit[1][0]])) { continue; }
        $start = (int) $hit[0][1];                 // at the '('
        $slice = ecPhBalanced($code, $start);
        if ($slice === '') { continue; }
        // Top-level `ident:` keys of any object literal inside the argument list.
        if (preg_match_all('/\{([^{}]*)\}/', $slice, $om)) {
            foreach ($om[1] as $body) {
                if (preg_match_all('/(?:^|,)\s*([A-Za-z_][A-Za-z0-9_]*)\s*:/', $body, $km)) {
                    foreach ($km[1] as $k) { $out[] = '{' . $k . '}'; }
                }
            }
        }
    }
    return array_values(array_unique($out));
}

/**
 * The text between a '(' at $start and its matching ')', quotes respected. '' if unbalanced.
 */
function ecPhBalanced(string $s, int $start): string
{
    $n = strlen($s);
    $depth = 0;
    $quote = '';
    for ($i = $start; $i < $n; $i++) {
        $c = $s[$i];
        if ($quote !== '') {
            if ($c === '\\') { $i++; continue; }
            if ($c === $quote) { $quote = ''; }
            continue;
        }
        if ($c === '"' || $c === "'") { $quote = $c; continue; }
        if ($c === '(') { $depth++; continue; }
        if ($c === ')') {
            $depth--;
            if ($depth === 0) { return substr($s, $start + 1, $i - $start - 1); }
        }
    }
    return '';
}

/**
 * The two blocking findings, from tokens-in-strings and the substitution sites.
 *
 * Pure.
 *
 * @param array<string,array<int,string>> $inStrings  token => ["lang:key", ...] (any occurrence)
 * @param array<string,array<int,string>> $repeated   token => ["lang:key", ...] (2+ in one value)
 * @param array<string,array<int,array{how:string,global:bool,where:string}>> $sites
 * @return array<int,string>
 */
function ecPhFindings(array $inStrings, array $repeated, array $sites): array
{
    $findings = [];
    foreach ($inStrings as $tok => $where) {
        if (isset($sites[$tok])) { continue; }
        $eg = array_slice(array_unique($where), 0, 3);
        $findings[] = "$tok is carried by " . count(array_unique($where)) . " shipped string(s) and nothing substitutes it.\n"
            . "      e.g. " . implode(', ', $eg) . "\n"
            . "      FIX: substitute it where the string is rendered, or spell the token the way the code already\n"
            . "      does. An unsubstituted token reaches the visitor with its braces on, in all 27 languages, in\n"
            . "      a sentence that otherwise reads correctly.";
    }
    foreach ($repeated as $tok => $where) {
        if (!isset($sites[$tok])) { continue; }            // already reported by finding 1
        foreach ($sites[$tok] as $s) {
            if ($s['global']) { continue; }
            $eg = array_slice(array_unique($where), 0, 3);
            $findings[] = "$tok occurs TWICE in a shipped string but " . $s['where'] . " substitutes it with the\n"
                . "      first-occurrence-only form " . $s['how'] . ".\n"
                . "      the string(s): " . implode(', ', $eg) . "\n"
                . "      FIX: use .split('$tok').join(value) or .replace(/" . str_replace(['{', '}'], ['\\{', '\\}'], $tok)
                . "/g, value). String.replace() with a string\n"
                . "      pattern replaces the first occurrence only, so the second reaches the screen as $tok.";
        }
    }
    return $findings;
}

if (defined('LANG_PLACEHOLDER_LIB_ONLY')) {
    return;
}

require_once __DIR__ . '/js_scan.inc.php';
require_once __DIR__ . '/lang_parse.inc.php';

$root = dirname(__DIR__, 2);

// ---- the strings ---------------------------------------------------------------------------
$inStrings = [];
$repeated = [];
$langKeys = [];
$langFiles = 0;
foreach (glob($root . '/lib/lang.ec.*.php') ?: [] as $f) {
    $lang = preg_replace('/^lang\.ec\.|\.php$/', '', basename($f));
    $langFiles++;
    foreach (ecLangRawValues((string) file_get_contents($f)) as $key => $val) {
        if ($lang === 'en') { $langKeys[$key] = true; }
        $toks = ecPhTokens($val);
        if (!$toks) { continue; }
        foreach (array_unique($toks) as $t) { $inStrings[$t][] = "$lang:$key"; }
        foreach (array_count_values($toks) as $t => $c) {
            if ($c > 1) { $repeated[$t][] = "$lang:$key"; }
        }
    }
}

// ---- the substitution sites ----------------------------------------------------------------
$sites = [];
$turned = 0;
$scanned = 0;
foreach (glob($root . '/js/*.js') ?: [] as $f) {
    $scanned++;
    $r = ecPhJsSites(ecReadJsCode($f), 'js/' . basename($f), $langKeys);
    foreach ($r['sites'] as $tok => $list) {
        $sites[$tok] = array_merge($sites[$tok] ?? [], $list);
    }
    $turned += $r['turned'];
}
// PHP, for str_replace()/strtr() with a literal brace token. Nothing today; scanned so that moving
// a substitution into PHP cannot silently empty this check.
$phpSites = 0;
foreach (array_merge(glob($root . '/*.php') ?: [], glob($root . '/lib/*.php') ?: []) as $f) {
    $scanned++;
    if (preg_match_all('/str_replace\(\s*\'(\{[A-Za-z_][A-Za-z0-9_]*\})\'/', (string) file_get_contents($f), $m)) {
        foreach ($m[1] as $tok) {
            $sites[$tok][] = ['how' => "str_replace('$tok')", 'global' => true, 'where' => basename($f)];
            $phpSites++;
        }
    }
}

$findings = ecPhFindings($inStrings, $repeated, $sites);

if ($findings) {
    echo 'Language placeholders: ' . count($findings) . " finding(s)\n\n";
    foreach ($findings as $f) { echo "  ! $f\n\n"; }
    exit(1);
}

$totalSites = 0;
foreach ($sites as $list) { $totalSites += count($list); }
printf(
    "Language placeholders OK -- %d distinct {token}(s) across %d language file(s) resolve to %d\n"
    . "substitution site(s) in %d shipped file(s), and every token that repeats inside a value is\n"
    . "substituted globally (%d such token(s)). A ratchet at zero.\n",
    count($inStrings), $langFiles, $totalSites, $scanned, count($repeated)
);
echo "PHP contributes $phpSites site(s); it is scanned so that moving a substitution out of JS\n"
    . "cannot empty this check in silence.\n";

// Finding 3, printed and never failed: a token the code substitutes that no string carries.
$orphans = [];
foreach ($sites as $tok => $list) {
    if (isset($inStrings[$tok])) { continue; }
    if (in_array($tok, EC_PH_TILE_TEMPLATE, true)) { continue; }
    $orphans[] = $tok . ' (' . implode(', ', array_unique(array_column($list, 'where'))) . ')';
}
if ($orphans) {
    echo 'Substituted but carried by no shipped string, printed and not failed (' . count($orphans)
        . "): " . implode('; ', $orphans) . "\n";
}
echo 'Declared exempt from that note, being somebody else\'s format rather than a language string: '
    . "the XYZ raster tile template " . implode(' ', EC_PH_TILE_TEMPLATE) . ".\n";
if ($turned) {
    echo "Turned away and counted ($turned): a replace()/split() whose pattern is not a literal brace\n"
        . "token, so there is no name to resolve.\n";
}
exit(0);
