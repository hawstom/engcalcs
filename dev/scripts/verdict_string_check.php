<?php
/**
 * verdict_string_check.php — a verdict string leads with its glyph and carries no marker word.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. CLAUDE.md § Verdict / check-string convention: **a leading `✓` or `⚠`, then
 * short text — never a translated marker word ("Warning:" / "OK:").** The glyph is decorative,
 * international and RTL-safe, and it is supplied by `EngCalcs.writeCheckHTML()`, not by the string.
 * Two things go wrong and neither is visible to anybody working in English:
 *
 *   - **A GLYPH IN THE STRING SHIPS TWO.** `writeCheckHTML()` prepends one, so a translator who
 *     helpfully copies the `⚠` they see on screen into their own value produces `⚠ ⚠ Presión baja`
 *     in one language and nobody who reads that language works on this repository.
 *   - **A MARKER WORD IS THE THING THE CONVENTION REPLACES.** "Warning: low pressure" is longer,
 *     is a second thing to translate, and says in words what the glyph already says in a character
 *     that needs no translation at all. It also breaks the column-width rule, because a results
 *     table pays for the marker in every row.
 *
 * WHICH STRINGS ARE VERDICTS — THE PROBLEM THE SURVEY FLAGGED, SOLVED BY READING THE RENDERER
 * RATHER THAN GUESSING FROM KEY NAMES. `dev/enforceable-rules-survey.md` row 26 named the risk
 * plainly: inferring "is this a verdict?" from a key's name is guesswork, and a check built on
 * guesswork is a false-positive generator. It is not necessary. A verdict is a string this suite
 * RENDERS as one, and there are exactly two seams:
 *
 *   1. the second argument of `EngCalcs.writeCheckHTML(ok, shortText, tip)`;
 *   2. the `ok` / `high` / `low` / `highShort` / `lowShort` fields of the labels object handed to
 *      `writeVelocityCheck()` and `inlineRangeWarnHtml()`, which pass them to the same function.
 *
 * Both are read out of comment-BLANKED JavaScript, then resolved one hop through the page's own
 * `EngCalcs.pageConfig` declaration to the `$ec_lang` key behind it. That yields 32 keys today,
 * every one of them genuinely rendered with a glyph in front of it, and zero keys included on the
 * strength of what they are called.
 *
 * WHAT IT CANNOT FOLLOW IS PRINTED, NOT SWALLOWED. A short text that is not a pageConfig read —
 * `hlPct.toFixed(1) + '%'` on the microhydro page, and the four `labels.*` forwards inside
 * `js/Calculators.lib.js` itself — cannot be resolved to a string and is reported as a count.
 *
 * THE THIRD LEG NEEDS NO KEY LIST AT ALL. Any language value that CONTAINS a `✓` or a `⚠` must
 * LEAD with it. That covers the verdicts built by hand rather than through `writeCheckHTML()`
 * (`lpn_library_control_*`), it is decidable from the string alone, and it is the leg that matters
 * most in the RTL languages, where a glyph appended rather than prepended is easy to write and
 * impossible for an English reader to spot: he, ar, fa, ur and ps all get it right today.
 *
 * THE MARKER-WORD LEG IS HONEST ABOUT ITS REACH. In English it matches a list of marker words
 * before a colon or a spaced dash. In the other 26 languages the words are unknowable from here, so
 * it matches the language-agnostic SHAPE only — one short token, then a colon. Measured over all
 * 27 language files: 864 verdict values, zero findings, so blocking costs nothing today. A verdict
 * that genuinely needs an internal colon will be the first false positive, and the fix then is a
 * declared exception, not a widened pattern.
 *
 * Usage:
 *   php dev/scripts/verdict_string_check.php
 *
 * Exit 0 = every verdict string is glyph-led and marker-free. Exit 1 = at least one is not.
 */

require_once __DIR__ . '/js_scan.inc.php';
require_once __DIR__ . '/lang_parse.inc.php';

/** The two verdict glyphs, and the near neighbours a well-meaning author reaches for. */
const EC_VERDICT_GLYPHS = ['✓', '⚠', '✔', '✗', '✘', '❌', '⛔', '❗', 'ℹ'];

/**
 * **THE HAND-BUILT VERDICTS, DECLARED BY NAME, BECAUSE NOTHING CAN DERIVE THEM.**
 *
 * The 32 keys above are found by reading the RENDERER, which is what keeps the check free of
 * guessing-by-key-name. That works precisely because `writeCheckHTML()` supplies the glyph itself,
 * and it buys a blind spot with it: for a verdict assembled by hand the glyph lives IN the string,
 * so it can be deleted, and leg 3 has nothing left to look at. Found by mutation — replacing
 * `'✓ Understood'` with `'OK: Understood'` removed a glyph AND added a marker word, and the check
 * passed.
 *
 * There is no honest way to derive this set: "which hand-built string is a verdict" is exactly the
 * inference by key name the rest of this check exists to avoid. So it is a DECLARED list, with the
 * same limit `prefix_map_check.php` accepts — a new hand-built verdict nobody declares stays
 * invisible, and that is the price of not guessing. Adding one costs a line here.
 */
const EC_HANDBUILT_VERDICT_KEYS = [
    // The Library panel's own three answers, built in js/looped-network.js rather than through
    // writeCheckHTML(). Their glyph is part of the translated value in all 27 files.
    'lpn_library_control_ok',
    'lpn_library_control_bad',
    'lpn_library_control_missing',
];

/** English marker words. The convention exists to delete these; the glyph already says it. */
const EC_MARKER_WORDS = ['warning', 'warn', 'caution', 'note', 'notice', 'alert', 'error',
    'attention', 'danger', 'ok', 'okay', 'pass', 'fail', 'failed', 'invalid'];

/**
 * Verdict short-text reads in one JavaScript source.
 *
 * @param string $js Raw JavaScript; comments are blanked here, not by the caller.
 * @return array{keys:array<string,int>,opaque:array<int,array{0:int,1:string}>}
 *         keys: pageConfig key => line. opaque: [line, the expression that could not be resolved].
 */
function ecVerdictShortTextReads(string $js): array
{
    $src = ecBlankJsComments($js);
    $keys = [];
    $opaque = [];
    $lineOf = function (int $pos) use ($src): int {
        return substr_count($src, "\n", 0, $pos) + 1;
    };
    $classify = function (string $expr, int $pos) use (&$keys, &$opaque, $lineOf): void {
        $expr = trim($expr);
        if ($expr === '') { return; }
        if (preg_match('/^(?:EngCalcs\.pageConfig|cfg|pc)\.([A-Za-z0-9_]+)$/', $expr, $m)) {
            $keys[$m[1]] = $lineOf($pos);
            return;
        }
        $opaque[] = [$lineOf($pos), $expr];
    };

    // ---- seam 1: writeCheckHTML(ok, shortText, tip) ----------------------------------------------
    $off = 0;
    while (($p = strpos($src, 'writeCheckHTML(', $off)) !== false) {
        $off = $p + 15;
        // The DEFINITION is not a call site; its parameter list is named, not passed.
        if (preg_match('/writeCheckHTML\s*=\s*function/', substr($src, max(0, $p - 40), 60))) { continue; }
        $args = ecSplitJsArgs($src, $off);
        if (count($args) >= 2) { $classify($args[1], $p); }
    }

    // ---- seam 2: the labels object handed to writeVelocityCheck() / inlineRangeWarnHtml() --------
    // Found by its OWN field names: `highTip` / `lowTip` / `okTip` appear nowhere else in this
    // suite, so the enclosing object literal is a labels object and needs no call-site tracing.
    foreach (['highTip', 'lowTip', 'okTip'] as $marker) {
        $off = 0;
        while (($p = strpos($src, $marker . ':', $off)) !== false) {
            $off = $p + 1;
            $block = ecEnclosingJsObject($src, $p);
            if ($block === null) { continue; }
            [$start, $text] = $block;
            if (!preg_match_all('/\b(ok|high|low|highShort|lowShort)\s*:\s*([^,\n}]+)/', $text, $mm,
                PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
                continue;
            }
            foreach ($mm as $m) { $classify($m[2][0], $start + $m[2][1]); }
        }
    }
    ksort($keys);
    return ['keys' => $keys, 'opaque' => $opaque];
}

/**
 * Splits a JavaScript argument list starting just after its '('. Returns the argument texts.
 */
function ecSplitJsArgs(string $src, int $afterOpenParen): array
{
    $depth = 0;
    $args = [];
    $cur = '';
    for ($i = $afterOpenParen, $n = strlen($src); $i < $n; $i++) {
        $c = $src[$i];
        if ($c === '(' || $c === '[' || $c === '{') { $depth++; }
        elseif ($c === ')' || $c === ']' || $c === '}') {
            if ($c === ')' && $depth === 0) { $args[] = $cur; return $args; }
            $depth--;
        }
        if ($c === ',' && $depth === 0) { $args[] = $cur; $cur = ''; continue; }
        $cur .= $c;
    }
    return $args;
}

/**
 * The object literal enclosing $pos: [offset of its '{', its full text], or null.
 */
function ecEnclosingJsObject(string $src, int $pos): ?array
{
    $depth = 0;
    $start = -1;
    for ($i = $pos; $i >= 0; $i--) {
        if ($src[$i] === '}') { $depth++; }
        elseif ($src[$i] === '{') {
            if ($depth === 0) { $start = $i; break; }
            $depth--;
        }
    }
    if ($start < 0) { return null; }
    $depth = 0;
    for ($i = $start, $n = strlen($src); $i < $n; $i++) {
        if ($src[$i] === '{') { $depth++; }
        elseif ($src[$i] === '}') {
            $depth--;
            if ($depth === 0) { return [$start, substr($src, $start, $i - $start + 1)]; }
        }
    }
    return null;
}

/**
 * A page's EngCalcs.pageConfig declaration, as pageConfig key => the $ec_lang keys behind it.
 * A key built from more than one language string maps to all of them; each is then checked.
 */
function ecPageConfigLangKeys(string $php): array
{
    $out = [];
    if (!preg_match('/EngCalcs\.pageConfig\s*=\s*\{(.*?)\n\s*\};/s', $php, $m)) { return $out; }
    foreach (preg_split('/\n/', $m[1]) as $line) {
        if (!preg_match('/^\s*([A-Za-z0-9_]+)\s*:\s*(.*)$/', $line, $km)) { continue; }
        if (preg_match_all('/\$ec_lang\[\'([A-Za-z0-9_]+)\'\]/', $km[2], $lm)) {
            foreach ($lm[1] as $lk) { $out[$km[1]][$lk] = true; }
        }
    }
    return $out;
}

/**
 * Findings for one string value. Pure, so the selftest can hand it a broken one.
 *
 * @param string $value  The language value.
 * @param bool $isVerdictKey Whether this key is rendered through writeCheckHTML().
 * @param bool $isEnglish Whether the marker-WORD list applies (it is an English list).
 * @return array<int,array{0:string,1:string}> [code, what] pairs.
 */
function ecVerdictValueFindings(string $value, bool $isVerdictKey, bool $isEnglish,
    bool $isHandBuilt = false): array
{
    $out = [];
    $trimmed = ltrim($value);

    // ---- leg 3: a glyph anywhere must be the FIRST character ------------------------------------
    $carries = null;
    foreach (EC_VERDICT_GLYPHS as $g) {
        if (strpos($value, $g) !== false) { $carries = $g; break; }
    }
    if ($carries !== null && $isVerdictKey) {
        $out[] = ['glyph-in-verdict-string',
            "carries '$carries', but EngCalcs.writeCheckHTML() already prepends one — this ships two"];
    } elseif ($carries !== null && strpos($trimmed, $carries) !== 0) {
        $out[] = ['glyph-not-leading', "carries '$carries' somewhere other than the front"];
    }

    // ---- leg 4: a hand-built verdict must still HAVE its glyph ---------------------------------
    // Leg 3 asks where a glyph sits; only this one asks whether it is there at all. It applies to
    // the declared hand-built keys alone, because for a renderer-built verdict the glyph comes from
    // code and cannot go missing -- there, carrying one is the defect, which is leg 3's first arm.
    if ($isHandBuilt && $carries === null) {
        $out[] = ['glyph-missing',
            'is a hand-built verdict and carries no ✓ or ⚠; the renderer does not supply one here'];
    }
    if ($isHandBuilt && !$isVerdictKey) {
        $words = implode('|', EC_MARKER_WORDS);
        if ($isEnglish && preg_match('/^\s*(?:[' . implode('', EC_VERDICT_GLYPHS) . ']\s*)?(' . $words . ')\b\s*(?:[:：]|[-–—]\s)/iu', $value, $m)) {
            $out[] = ['marker-word', "leads with the marker word '{$m[1]}'; the glyph already says it"];
        }
    }

    if (!$isVerdictKey) { return $out; }

    // ---- leg 2: no marker word ------------------------------------------------------------------
    // Language-agnostic SHAPE first: one short token, then a colon. Nothing else can be read from
    // here in a language nobody on this side speaks.
    if (preg_match('/^\s*[^\s:：]{1,15}\s*[:：]\s/u', $value)) {
        $out[] = ['marker-shape', 'leads with a short token and a colon, which is the marker-word shape'];
    }
    if ($isEnglish) {
        $words = implode('|', EC_MARKER_WORDS);
        if (preg_match('/^\s*(' . $words . ')\b\s*(?:[:：]|[-–—]\s)/iu', $value, $m)) {
            $out[] = ['marker-word', "leads with the marker word '{$m[1]}'; the glyph already says it"];
        }
    }
    return $out;
}

if (defined('EC_VERDICT_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

// ---- 1. the keys the renderer treats as verdict short text --------------------------------------
$pcKeys = [];
$opaque = [];
foreach (glob($root . '/js/*.js') as $file) {
    $found = ecVerdictShortTextReads(file_get_contents($file));
    $short = str_replace($root . '/', '', $file);
    foreach ($found['keys'] as $k => $line) { $pcKeys[$k] = "$short:$line"; }
    foreach ($found['opaque'] as [$line, $expr]) { $opaque[] = "$short:$line  $expr"; }
}

// ---- 2. one hop to the language keys ------------------------------------------------------------
$map = [];
foreach (glob($root . '/*.php') as $page) {
    foreach (ecPageConfigLangKeys(file_get_contents($page)) as $pcKey => $langKeys) {
        foreach ($langKeys as $lk => $x) { $map[$pcKey][$lk] = basename($page); }
    }
}
$verdictKeys = [];
$unresolved = [];
foreach ($pcKeys as $pcKey => $where) {
    if (!isset($map[$pcKey])) { $unresolved[] = "$pcKey  (read at $where)"; continue; }
    foreach ($map[$pcKey] as $lk => $page) { $verdictKeys[$lk] = $page; }
}

// ---- 3. the values, in every language -----------------------------------------------------------
$problems = [];
$values = 0;
$files = glob($root . '/lib/lang.ec.*.php');
foreach ($files as $file) {
    $code = preg_replace('/^.*lang\.ec\.([A-Za-z-]+)\.php$/', '$1', $file);
    $vals = ecLangValues(file_get_contents($file));
    foreach ($vals as $key => $value) {
        $isVerdict = isset($verdictKeys[$key]);
        $isHandBuilt = in_array($key, EC_HANDBUILT_VERDICT_KEYS, true);
        if ($isVerdict || $isHandBuilt) { $values++; }
        foreach (ecVerdictValueFindings($value, $isVerdict, $code === 'en', $isHandBuilt) as [$codeName, $what]) {
            $problems[] = ["lang.ec.$code.php  \$ec_lang['$key']", $codeName, $what, $value];
        }
    }
}

// A DECLARATION THAT OUTLIVED ITS KEY IS ITSELF A FINDING. The list above is hand-written, which
// is the one thing about this check that can rot silently -- a renamed or deleted key would leave a
// line here guarding nothing while the report still counted it. Caught on the first draft, which
// declared `lpn_library_control_warn`: there is no such key, and the check reported OK.
$declaredMissing = [];
$enValues = ecLangValues(file_get_contents($root . '/lib/lang.ec.en.php'));
foreach (EC_HANDBUILT_VERDICT_KEYS as $k) {
    if (!array_key_exists($k, $enValues)) { $declaredMissing[] = $k; }
}
if ($declaredMissing) {
    echo 'Verdict strings: ' . count($declaredMissing) . " declared hand-built verdict key(s) do not exist\n\n";
    foreach ($declaredMissing as $k) { echo "  \$ec_lang['$k']\n"; }
    echo "\nEC_HANDBUILT_VERDICT_KEYS in this script names them, so this check believes it is\n";
    echo "guarding a string that lib/lang.ec.en.php does not have. Either the key was renamed --\n";
    echo "use dev/scripts/rename_lang_key.php, which would have updated call sites but not this\n";
    echo "list -- or the verdict is gone and the line here should go with it.\n";
    exit(1);
}

if ($unresolved) {
    // A read this check cannot resolve is not a silence: it is the mapping being broken.
    echo 'Verdict short text: ' . count($unresolved) . " pageConfig key(s) with no \$ec_lang source\n\n";
    foreach ($unresolved as $u) { echo "  $u\n"; }
    echo "\nEach is passed to EngCalcs.writeCheckHTML() as the verdict text, so it reaches a screen,\n";
    echo "but no page declares it in its EngCalcs.pageConfig block from an \$ec_lang key — so either\n";
    echo "the visitor sees 'undefined' (pageconfig_check.php has more to say), or the string is\n";
    echo "hardcoded English and is not translated at all.\n";
    exit(1);
}

if ($problems) {
    echo 'Verdict strings: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as [$where, $codeName, $what, $value]) {
        echo "  $where\n      [$codeName] $what\n      value: $value\n";
    }
    echo "\nCLAUDE.md § Verdict / check-string convention: a LEADING glyph, then short text -- '✓'\n";
    echo "for pass, '⚠' for caution -- and never a translated marker word.\n";
    echo "\nFIX:\n";
    echo "  glyph-in-verdict-string  delete the glyph from the string. EngCalcs.writeCheckHTML()\n";
    echo "                           prepends it; one in the value ships two side by side.\n";
    echo "  glyph-not-leading        move the glyph to the front. It is the first thing read, in\n";
    echo "                           every script and both directions.\n";
    echo "  marker-word/-shape       delete the marker and keep the short text: '⚠ Low', not\n";
    echo "                           'Warning: low'. The glyph carries no translation payload and\n";
    echo "                           the marker costs a column's width in every row.\n";
    exit(1);
}

echo 'Verdict strings OK -- ' . count($verdictKeys) . ' key(s) rendered through writeCheckHTML(), '
    . "$values value(s) read across " . count($files) . " language file(s);\n";
echo "      every glyph in every language file leads its string.\n";
if ($opaque) {
    // The blind spot as a number rather than a silence.
    echo 'NOTE: ' . count($opaque) . " verdict short text(s) are not a pageConfig read and cannot be\n";
    echo "      resolved to a string, so their values are not checked here:\n";
    foreach ($opaque as $o) { echo "        $o\n"; }
}
