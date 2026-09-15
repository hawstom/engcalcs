<?php
/**
 * bootstrap_global_check.php -- a shipped PHP function that reads a bootstrap global DECLARES it
 * global. BLOCKING, and a ratchet at one declared exception.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * 31 times a shipped function reaches for one of the bootstrap globals -- `$ec_lang`, `$ec_units`,
 * `$ec_unit_sets`, `$ec_unit_families`, `$all_language_settings`, `$language_settings`,
 * `$ec_icons`, `$html_desc` and the rest. 29 of those 31 open with `global $x;`, one takes the
 * value as a parameter instead, and one deliberately builds its own local copy. A construct
 * written 29 times with the same line at the top is a rule somebody knew; nothing in `CLAUDE.md`
 * or `dev/*.md` states it for PHP, and nothing held it.
 *
 * WHAT THE MISSING LINE DOES. **PHP function scope does not see globals at all.** A function that
 * reads `$ec_lang` without declaring it gets NULL, so `$ec_lang['mpf_flow']` is the empty string --
 * every label, every tip and every column heading the function writes comes out blank, IN ALL 27
 * LANGUAGES AT ONCE, and `lib/config.inc.php` runs production with display_errors off, so there is
 * no warning on the page and no row in any log. The page is well-formed, it validates, it has the
 * right number of fields, and some of its words are simply gone.
 *
 * **THIS HAS ALREADY HAPPENED HERE, and its own record is in `dev/scripts/render_page.php`**: a
 * page `include`d from inside a function ran its top-level code in that function's scope, so the
 * bootstrap globals landed as locals while the library functions it called declared `global` and
 * saw nothing. `html_balance_check.php` then printed "ok" for weeks about a 22 KB stub of a 45 KB
 * page with 1 of its 17 unit selects present. That was the same mismatch from the other side.
 *
 * **THE LIST IS DERIVED, NEVER TYPED**, which is the one design decision here. A name is a
 * bootstrap global because some shipped function ALREADY declares it one -- so the set grows by
 * itself the day somebody adds a global, and a typed list cannot go stale against the tree the way
 * `CLAUDE.md`'s own four-item furniture list did (`lpn_furniture_check.php`, same reasoning).
 * The cost of the derivation is honest and is stated in the output: a global that NO function ever
 * declares is invisible here, because nothing in the source distinguishes it from a local.
 *
 * TURNED AWAY AND COUNTED, never guessed at:
 *   - A function taking the same name as a PARAMETER. `chooseLanguage($all_language_settings)` is
 *     handed the array on purpose, and a parameter shadows the global by design.
 *   - `$GLOBALS['x']` in place of the `global` statement. It is the same reach by another spelling.
 *   - Comments and single-quoted strings are blanked before anything is read, because prose about
 *     `$ec_lang` is constant in this tree -- `chooseLanguage()` carries `print_r($language_settings)`
 *     inside a commented-out debug block, and counting that would be a finding against correct code.
 *
 * THE DECLARED EXCEPTIONS, each keyed on file and function with its reason, and a declaration that
 * matches nothing FAILS -- an exception nobody can trip is a ratchet that has quietly gone slack.
 *
 * Usage:
 *   php dev/scripts/bootstrap_global_check.php
 *
 * Exit 0 = every reach is declared. Exit 1 = one is not.
 */

/**
 * Functions whose reach is correct WITHOUT a `global`, keyed "file::function" => reason.
 */
function ecBootstrapGlobalExceptions(): array
{
    return [
        'lib/Language.lib.php::compare_langs' =>
            '$ec_lang is deliberately LOCAL here: the function unsets it and requires two language '
            . 'files into its own scope to diff them, so a `global` would overwrite the page\'s own '
            . 'strings with whichever file it read last. The one place in the suite where the local '
            . 'copy IS the point.',
    ];
}

/**
 * Token text with comments and single-quoted strings blanked, so prose cannot be read as code.
 *
 * Double-quoted and heredoc bodies are kept, because PHP INTERPOLATES them: `"$ec_lang[k]"` is a
 * real read of the global and `'$ec_lang'` is not. token_get_all() already emits the interpolated
 * variables as their own tokens, so keeping them costs nothing.
 */
function ecBgText(array $toks, int $from, int $to): string
{
    $s = '';
    for ($x = $from; $x <= $to; $x++) {
        $t = $toks[$x];
        if (is_string($t)) { $s .= $t; continue; }
        if ($t[0] === T_COMMENT || $t[0] === T_DOC_COMMENT || $t[0] === T_CONSTANT_ENCAPSED_STRING) {
            $s .= ' ';
            continue;
        }
        $s .= $t[1];
    }
    return $s;
}

/**
 * Every function in one file, as [label, signature, body, line].
 *
 * @return array<int,array{0:string,1:string,2:string,3:int}>
 */
function ecBgFunctions(string $src): array
{
    $toks = token_get_all($src);
    $n = count($toks);
    $out = [];
    for ($i = 0; $i < $n; $i++) {
        if (!(is_array($toks[$i]) && $toks[$i][0] === T_FUNCTION)) { continue; }
        $line = $toks[$i][2];
        $j = $i + 1;
        $name = null;
        while ($j < $n
            && !(is_array($toks[$j]) && $toks[$j][0] === T_STRING)
            && !(is_string($toks[$j]) && $toks[$j] === '(')) { $j++; }
        if ($j < $n && is_array($toks[$j]) && $toks[$j][0] === T_STRING) { $name = $toks[$j][1]; }
        $depth = 0;
        $start = null;
        $k = $j;
        for (; $k < $n; $k++) {
            $t = $toks[$k];
            if (is_string($t) && $t === '{') { if ($start === null) { $start = $k; } $depth++; continue; }
            if (is_string($t) && $t === '}') { $depth--; if ($depth === 0) { break; } }
        }
        if ($start === null || $k >= $n) { continue; }   // an abstract or interface signature
        $out[] = [
            $name === null ? "closure at line $line" : $name,
            ecBgText($toks, $j, $start - 1),
            ecBgText($toks, $start, $k),
            $line,
        ];
    }
    return $out;
}

/**
 * The derived set of bootstrap-global names: every name some shipped function declares global.
 *
 * @param array<string,string> $files rel path => PHP source
 * @return array<int,string>
 */
function ecBgDerivedNames(array $files): array
{
    $names = [];
    foreach ($files as $src) {
        $toks = token_get_all($src);
        $txt = ecBgText($toks, 0, count($toks) - 1);
        if (!preg_match_all('/\bglobal\s+([^;]+);/', $txt, $m)) { continue; }
        foreach ($m[1] as $list) {
            foreach (explode(',', $list) as $one) {
                if (preg_match('/\$([A-Za-z_][A-Za-z0-9_]*)/', $one, $vm)) { $names[$vm[1]] = true; }
            }
        }
    }
    ksort($names);
    return array_keys($names);
}

/**
 * @param array<string,string> $files rel path => PHP source
 * @return array{findings: array<int,string>, pairs: int, declared: int, params: array<int,string>,
 *               names: array<int,string>, used: array<int,string>}
 */
function ecBootstrapGlobalFindings(array $files): array
{
    $names = ecBgDerivedNames($files);
    $exceptions = ecBootstrapGlobalExceptions();
    $findings = [];
    $params = [];
    $used = [];
    $pairs = 0;
    $declared = 0;

    foreach ($files as $rel => $src) {
        foreach (ecBgFunctions($src) as [$name, $sig, $body, $line]) {
            foreach ($names as $v) {
                if (!preg_match('/\$' . $v . '\b/', $body)) { continue; }
                $pairs++;
                if (preg_match('/\$' . $v . '\b/', $sig)) {
                    $params[] = "$rel:$line $name() takes \$$v as a parameter, which shadows the "
                        . 'global by design';
                    continue;
                }
                if (preg_match('/global[^;]*\$' . $v . '\b/', $body)
                    || strpos($body, "\$GLOBALS['$v']") !== false
                    || strpos($body, '$GLOBALS["' . $v . '"]') !== false) {
                    $declared++;
                    continue;
                }
                $key = "$rel::$name";
                if (isset($exceptions[$key])) { $used[$key] = true; continue; }
                $findings[] = "$rel:$line $name() reads \$$v and never declares it:\n"
                    . "      PHP function scope does not see globals. \$$v is NULL in here, so every\n"
                    . "      value read out of it is the empty string -- in all 27 languages at once,\n"
                    . "      with display_errors off in production, on a page that still validates.\n"
                    . "      Fix: `global \$$v;` as the function's first line, which is what the other\n"
                    . "      29 reaches in this suite do. If the local copy is the POINT, as it is in\n"
                    . "      compare_langs(), declare it in ecBootstrapGlobalExceptions() with the\n"
                    . '      reason.';
            }
        }
    }

    // A declared exception nobody can trip is a ratchet gone slack: the function was renamed,
    // deleted or fixed, and the declaration now excuses nothing while looking like it excuses
    // something.
    foreach ($exceptions as $key => $why) {
        if (isset($used[$key])) { continue; }
        $findings[] = "ecBootstrapGlobalExceptions() declares $key, which this scan did not reach:\n"
            . "      either the function no longer reads a bootstrap global undeclared -- in which\n"
            . "      case DELETE the entry -- or the scan stopped seeing it, which is worse.\n"
            . '      The reason on file was: ' . preg_replace('/\s+/', ' ', $why);
    }

    return ['findings' => $findings, 'pairs' => $pairs, 'declared' => $declared,
            'params' => $params, 'names' => $names, 'used' => array_keys($used)];
}

if (defined('BOOTSTRAP_GLOBAL_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$files = [];
$langFiles = 0;
foreach (array_merge(glob($root . '/lib/*.php') ?: [], glob($root . '/*.php') ?: []) as $path) {
    $rel = ltrim(str_replace($root, '', $path), '/');
    // The 27 language files are data: one array assignment per line, no functions at all.
    if (strpos($rel, 'lang.ec.') !== false) { $langFiles++; continue; }
    $files[$rel] = (string) file_get_contents($path);
}

$r = ecBootstrapGlobalFindings($files);

if ($r['findings']) {
    echo 'Bootstrap globals: ' . count($r['findings']) . " finding(s)\n\n";
    foreach ($r['findings'] as $f) { echo "  ! $f\n\n"; }
    echo "A ratchet at one declared exception, measured 2026-09-15: 31 function/global pairs, 29\n";
    echo "declaring, 1 parameter, 1 deliberate local. The defect is invisible from this side -- the\n";
    echo "page renders, and some of its words are missing in every language.\n";
    exit(1);
}

printf("Bootstrap globals OK -- %d reach(es) into %d derived global name(s) across %d shipped PHP "
    . "file(s):\n%d declare `global`, %d take the name as a parameter, %d declared exception(s), "
    . "all of them\nstill reachable. A ratchet at one.\n",
    $r['pairs'], count($r['names']), count($files), $r['declared'], count($r['params']),
    count($r['used']));
echo 'The derived names: $' . implode(', $', $r['names']) . "\n";
echo "The derivation's own limit, stated rather than hidden: a global NO function ever declares is\n"
    . "invisible here, because nothing in the source tells it from a local. $langFiles language "
    . "file(s)\nwere skipped as data -- they hold one array assignment per line and no functions.\n";
foreach ($r['params'] as $p) { echo "  - $p\n"; }
exit(0);
