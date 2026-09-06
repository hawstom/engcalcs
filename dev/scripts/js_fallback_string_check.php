<?php
/**
 * A JS FALLBACK STRING IS A SECOND COPY OF AN ENGLISH STRING, AND IT MAY NOT DRIFT FURTHER.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHAT THIS IS ABOUT. `js/*.js` reads every localized string through the pageConfig bridge, and
 * almost every read is written defensively:
 *
 *     var msg = pc.lpn_time_run || 'Run';
 *
 * That literal is an uncontrolled duplicate of `$ec_lang['lpn_time_run']`. Nothing has ever
 * compared the two, and 892 of them ship today.
 *
 * WHY IT IS SILENT, AND WHY THAT IS THE WHOLE ARGUMENT. `pageconfig_check.php` guarantees the key
 * IS supplied, so the fallback never renders. A drifted one is therefore invisible in English,
 * invisible in every other language, invisible in testing, and invisible to every other check in
 * this repository -- right up until the bridge fails for some reason nobody predicted, at which
 * point the whole 892 become visitor-facing at once. That is the day nobody is looking.
 *
 * MEASURED THE DAY THIS LANDED: 199 of 892 disagree with `lib/lang.ec.en.php`, and the sample is
 * not cosmetic drift:
 *   - `lpn_time_run` -- the language file says `Calculate`, the fallback says `Run`. Other shipped
 *     strings tell the reader to press that control BY NAME.
 *   - `lpn_engine_manning_note` and `lpn_engine_minor_loss_note` -- the fallback is the EMPTY
 *     STRING against a real sentence.
 *   - `lpn_diag_not_converged` -- lang: "No solution was found. Check for values that are
 *     impossible in real life...", fallback: "Did not converge."
 *   - `lpn_time_run_note` -- the fallback still carries a sentence that was struck as FALSE. The
 *     language file was corrected and the copy beside it was not, which is the failure mode of
 *     every duplicate that nothing compares.
 *
 * **IT WAS WALKED TO ZERO THE SAME DAY, AND THE BASELINE IS NOW 0**, which makes this a plain rule
 * wearing a ratchet's clothes: a fallback that disagrees with the language file fails the build.
 * It began at 199 because the check was written in a worktree that did not own `js/`; the 219 that
 * were rewritten were rewritten mechanically, from `$ec_lang` itself, so no wording judgement was
 * made in the sweep and none could be. Two survived it because they are read through an ALIAS the
 * sweep's own regex did not model, and were done by hand.
 *
 * LOWER EC_JS_FALLBACK_BASELINE if it ever needs to be; never raise it. It is 0, and the honest
 * reading of any rise is that a language string was edited and its copy was not, which is the
 * entire defect.
 *
 * THE OTHER LEG BLOCKS AT ZERO, because it is a different defect. A fallback written against a key
 * `lib/lang.ec.en.php` does not define means the JS is reading a key that can never be supplied, so
 * the literal is not a fallback at all -- it is the only text there will ever be, in all 27
 * languages. Zero today.
 *
 * WHAT DECIDES THAT SOMETHING IS A FALLBACK, and why this does not keep a second opinion about it.
 * The alias question -- is `pc` in `pc.lpn_time_run` the pageConfig object? -- was already solved
 * once, in `pageconfig_check.php`, and solved carefully (its docblock records the draft that took
 * `el.textContent = EngCalcs.pageConfig.x` for an alias named `textContent`). So this check
 * includes that file as a library and treats `ecPageConfigReads()` as the authority: a `X.key ||
 * 'literal'` counts only when `key` is one that function already reports as a pageConfig read of
 * that same file. Two checks arguing about what an alias is would be worse than either.
 *
 * That is also what makes the false-positive rate zero rather than low. A hand-rolled scan for
 * `(?:pc|cfg)\.(\w+) \|\| '...'` finds `.key` properties in `js/lpn-search.js` and
 * `js/lpn-terrain.js` that have nothing to do with the bridge; `ecPageConfigReads()`'s key-shape
 * rule (lowercase, at least one underscore) excludes them without anybody declaring anything.
 *
 * ESCAPES ARE RESOLVED ON BOTH SIDES BEFORE COMPARING. The JS literal goes through
 * stripcslashes(); the language value comes from ecLangValues(), which is the escapes-resolved
 * view. Comparing a raw JS literal against a resolved PHP one reports differences that are not
 * there -- every `\'` in the language file would read as drift.
 *
 * SHOULD THE FALLBACKS SIMPLY BE DELETED, since pageconfig_check.php guarantees the key? That is a
 * real option and it is not this script's to take. They are the last line before a visitor reads
 * `undefined`, which is the exact defect that check exists to prevent, so deleting 892 of them
 * trades a silent duplicate for a louder failure. Holding them correct keeps both.
 *
 * Usage:
 *   php dev/scripts/js_fallback_string_check.php           # blocking: the count may not rise
 *   php dev/scripts/js_fallback_string_check.php --list    # name every drifted fallback
 *
 * Exit 0 = at or below the baseline and no undefined keys. Exit 1 = either leg failed.
 */

require_once __DIR__ . '/lang_parse.inc.php';

/**
 * ZERO since 2026-09-06, the day the 199 were measured and the same day they were corrected.
 * Never raise it. Raising it is the one edit that makes this script pointless.
 */
const EC_JS_FALLBACK_BASELINE = 0;

/**
 * Every `<pageConfig-or-alias>.<key> || '<literal>'` in one JS source.
 *
 * Pure, so js_fallback_string_selftest.php can put fixtures through it. `$reads` is the set of keys
 * pageconfig_check.php says this same source reads through the bridge; a match on any other name is
 * not a bridge read and is dropped.
 *
 * @param string $js    Source text of one JS file.
 * @param array<string,bool> $reads key => true, from ecPageConfigReads().
 * @param array<string,string> $en    key => English, for the triple shape below, which the read
 *                                    detector cannot see because its key is read dynamically.
 * @return array<int,array{key:string,literal:string}>
 */
function ecJsFallbacks(string $js, array $reads, array $en = []): array
{
    // The receiver alias list comes from the same discriminator pageconfig_check.php uses: an
    // assignment of the OBJECT, whose next non-space character is not a dot.
    preg_match_all('/\b([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*EngCalcs\.pageConfig\s*(?![.\w])/', $js, $am);
    $names = array_values(array_unique(array_merge(['pageConfig'], $am[1])));
    $alt = implode('|', array_map(static function ($n) { return preg_quote($n, '/'); }, $names));

    $re = '/\b(?:' . $alt . ')\.([a-z][a-z0-9]*(?:_[a-z0-9]+)+)\s*\|\|\s*'
        . '(\'(?:[^\'\\\\]++|\\\\.)*+\'|"(?:[^"\\\\]++|\\\\.)*+")/';
    preg_match_all($re, $js, $m, PREG_SET_ORDER);

    $out = [];
    foreach ($m as $hit) {
        if (!isset($reads[$hit[1]])) { continue; }
        $out[] = ['key' => $hit[1], 'literal' => stripcslashes(substr($hit[2], 1, -1))];
    }

    /**
     * **THE SECOND SHAPE: A TABLE OF `[prop, key, 'English']` TRIPLES.**
     *
     * `js/looped-network.js` declares its property bands as arrays of three -- the model property,
     * the language key, and the English -- and reads the key through pageConfig later, somewhere
     * else entirely. So the fallback and the `||` are in different functions and the pattern above
     * cannot see a single one of them. Twenty such literals ship, and the drift ratchet read them
     * as ZERO.
     *
     * It was found the way row 32 was found, and Task 322 says to keep finding them that way:
     * COUNT a repeated construct in the source and ask what writing it twenty times assumes. Here it
     * assumes somebody editing an English string will also edit a literal three files away from the
     * `$ec_lang` line -- which is precisely the assumption that put 199 wrong fallbacks on the page.
     *
     * Deliberately narrow: the middle element must be a name the bridge actually reads, so a triple
     * of ordinary strings (`['pipe', 'pump', 'valve']`) can never be mistaken for one of these.
     */
    $re3 = "/\\[\\s*'[A-Za-z0-9_\\$]+'\\s*,\\s*'([a-z][a-z0-9]*(?:_[a-z0-9]+)+)'\\s*,\\s*('(?:[^'\\\\\\\\]++|\\\\\\\\.)*+')\\s*\\]/";
    preg_match_all($re3, $js, $m3, PREG_SET_ORDER);
    foreach ($m3 as $hit) {
        /* **NOT $reads HERE, and that is the whole reason this shape was invisible.** These triples
         * are consumed as `pc[entry[1]]` -- a DYNAMIC read, which `ecPageConfigReads()` cannot see
         * and never will; requiring the key to be one of its findings drops every last one of them.
         * A defined English key in the middle slot is the discriminator instead: it is what makes
         * the triple a language triple rather than three ordinary strings, and it also means the
         * undefined-key leg can never fire on this shape. */
        if (!array_key_exists($hit[1], $en)) { continue; }
        $out[] = ['key' => $hit[1], 'literal' => stripcslashes(substr($hit[2], 1, -1))];
    }
    return $out;
}

if (defined('EC_JS_FALLBACK_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
define('PAGECONFIG_LIB_ONLY', 1);
require_once $root . '/dev/scripts/pageconfig_check.php';

$en = ecLangValues(file_get_contents($root . '/lib/lang.ec.en.php'));

$total = 0;
$drifted = [];
$undefined = [];
foreach (glob($root . '/js/*.js') as $path) {
    $js = file_get_contents($path);
    if (strpos($js, 'pageConfig') === false) { continue; }
    $reads = array_flip(ecPageConfigReads($js));
    foreach (ecJsFallbacks($js, $reads, $en) as $fb) {
        $total++;
        $key = $fb['key'];
        if (!array_key_exists($key, $en)) {
            $undefined[] = [basename($path), $key, $fb['literal']];
            continue;
        }
        if ($fb['literal'] !== $en[$key]) {
            $drifted[] = [basename($path), $key, $fb['literal'], $en[$key]];
        }
    }
}
$n = count($drifted);

if (in_array('--list', $argv, true)) {
    echo "Drifted JS fallback strings: $n of $total\n\n";
    foreach ($drifted as [$f, $k, $lit, $val]) {
        printf("  js/%s  \$ec_lang['%s']\n", $f, $k);
        printf("      js:   %s\n", var_export($lit, true));
        printf("      lang: %s\n", var_export($val, true));
    }
    echo "\nThe language file is the authority. Make the JS literal equal to it, or delete the\n";
    echo "fallback -- pageconfig_check.php already guarantees the key is supplied.\n";
    exit(0);
}

$fail = false;

if ($undefined) {
    $fail = true;
    echo 'JS fallbacks on keys lib/lang.ec.en.php does not define: ' . count($undefined) . "\n\n";
    foreach ($undefined as [$f, $k, $lit]) {
        printf("  js/%s reads pageConfig.%s, falling back to %s\n", $f, $k, var_export($lit, true));
    }
    echo "\nNo page can supply a key that does not exist, so this literal is not a fallback -- it is\n";
    echo "the only text there will ever be, in all 27 languages. Define the key in\n";
    echo "lib/lang.ec.en.php, or stop reading it.\n\n";
}

if ($n > EC_JS_FALLBACK_BASELINE) {
    $fail = true;
    $up = $n - EC_JS_FALLBACK_BASELINE;
    echo "JS fallback ratchet: $n of $total disagree with lib/lang.ec.en.php, $up MORE than the\n";
    echo 'baseline of ' . EC_JS_FALLBACK_BASELINE . ".\n\n";
    echo "A fallback literal is a second copy of an English string that nothing renders today, so a\n";
    echo "wrong one is invisible until the pageConfig bridge fails -- and then all of them are\n";
    echo "visitor-facing at once. The language file is the authority.\n\n";
    echo "To see which ones:\n";
    echo "    php dev/scripts/js_fallback_string_check.php --list\n\n";
    echo "If you have CORRECTED fallbacks and the number is genuinely lower, lower\n";
    echo "EC_JS_FALLBACK_BASELINE in this script to the new number. Never raise it.\n";
}

if ($fail) { exit(1); }

$slack = EC_JS_FALLBACK_BASELINE - $n;
echo "JS fallback strings OK -- $n of $total drifted, baseline " . EC_JS_FALLBACK_BASELINE
    . ($slack > 0 ? "; $slack below it, so lower the baseline" : '')
    . "; 0 on undefined keys.\n";
