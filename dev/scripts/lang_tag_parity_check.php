<?php
/**
 * lang_tag_parity_check.php — does each translation carry the SAME MARKUP as its English source?
 *
 * WHY THIS EXISTS. `lang_syntax_validate.php` enforces four rules about what a string may CONTAIN:
 * no HTML entities, no tags in a plain-text-bound string, correct naming, single quotes. Every one
 * of them is a rule about the presence of something wrong. **None of them can see the ABSENCE of
 * something right**, and that turns out to be the more expensive failure.
 *
 * Found 2026-08-14, sprint 318. `mtc_d50_mra` in English is:
 *
 *     <span class="ec-help" title="Per Maynord, Ruff, and Abt (1989). At a bend the rock is sized
 *     for a bend velocity of 4/3 of the average…">Required angular rock size, D<sub>50</sub>
 *     <span class="ec-tip">?</span></span>
 *
 * …and in TEN language files it was just the visible label — 83 characters against English's 337,
 * with the entire tooltip gone. A reader in those languages never saw the sourcing at all. Every
 * existing check passed: the string is valid PHP, single-quoted, entity-free, and breaks no tag
 * rule, because the tags simply are not there. It surfaced only because a resync agent happened to
 * diff its own string against the English by eye.
 *
 * The Arabic agent then did the right thing and REFUSED to fix it unilaterally, filing a
 * suggestion-box entry: either the wrapper should be back-filled everywhere, or the English is the
 * one that drifted. That is a question a human answers once and a check enforces forever, which is
 * what this file is.
 *
 * WHAT IT COMPARES, and what it deliberately does not:
 *   - the multiset of HTML TAGS (`<sub>`, `<span class="ec-help">`, `<br />`, …). Tag NAMES and
 *     counts must match English. Attribute VALUES must not — a `title=` is translated prose.
 *   - the set of {placeholder} tokens. A dropped placeholder renders a sentence with a hole in it;
 *     an invented one renders the literal braces.
 *   - NOT text length, NOT word order, NOT punctuation. Those legitimately differ.
 *
 * Exempt keys and out-of-scope cells are honoured: a cell we have deliberately not translated
 * carries the English string verbatim and therefore matches trivially, and a missing key falls back
 * to English at runtime, so neither is a finding here.
 *
 * IT PRINTS HOW MANY STRINGS IT COMPARED, and that line is not decoration. The first version of
 * this file called ecLangRawValues() with a PATH where it wanted file CONTENT, so it parsed nothing,
 * compared nothing, and printed "PASS: every translated string carries the same markup as its
 * English source." A green check that examined zero strings is worse than no check, because it
 * retires the worry. The count is what made the bug visible in one glance -- print what you
 * compared, always.
 *
 * Usage:  php dev/scripts/lang_tag_parity_check.php [--lang=es,fr] [--strict]
 *         --strict makes it exit non-zero. Default is advisory, because the first run over a corpus
 *         this old is a survey rather than a gate.
 */

require_once __DIR__ . '/lang_parse.inc.php';
require_once __DIR__ . '/exempt_keys.inc.php';
require_once __DIR__ . '/coverage.inc.php';

$LIB = __DIR__ . '/../../lib';
$opts = getopt('', ['lang::', 'strict', 'verbose']);
$strict  = isset($opts['strict']);
$verbose = isset($opts['verbose']);

$all = [];
foreach (glob("$LIB/lang.ec.*.php") as $f) {
    if (preg_match('/lang\.ec\.([a-z]{2})\.php$/', $f, $m) && $m[1] !== 'en') { $all[] = $m[1]; }
}
sort($all);
$langs = isset($opts['lang']) && $opts['lang'] !== ''
    ? array_values(array_intersect($all, array_map('trim', explode(',', $opts['lang']))))
    : $all;

$en = ecLangRawValues(file_get_contents("$LIB/lang.ec.en.php"));
$exemptMap = ecLoadExemptMap();
$coverage  = ecLoadCoverage();

/** Tag names with their attribute VALUES stripped: a translated title= must not count as a difference. */
function tagSignature($s) {
    if (!preg_match_all('/<\s*\/?\s*([a-zA-Z][a-zA-Z0-9]*)((?:\s[^>]*)?)>/', $s, $m, PREG_SET_ORDER)) {
        return [];
    }
    $out = [];
    foreach ($m as $t) {
        $name = strtolower($t[1]);
        // Keep CLASS, because .ec-help and .ec-tip are structural here -- losing the class is
        // losing the tooltip even when the <span> survives. Drop everything else.
        $cls = '';
        if (preg_match('/\bclass\s*=\s*"([^"]*)"/i', $t[2], $c)) { $cls = ' class="' . trim($c[1]) . '"'; }
        $closing = (strpos($t[0], '</') === 0) ? '/' : '';
        $out[] = '<' . $closing . $name . $cls . '>';
    }
    sort($out);
    return $out;
}

function array_reject_br(array $arr, callable $isBr) {
    return array_filter($arr, function ($t) use ($isBr) { return !$isBr($t); });
}

function placeholders($s) {
    preg_match_all('/\{[a-zA-Z_][a-zA-Z0-9_]*\}/', $s, $m);
    $out = array_unique($m[0]);
    sort($out);
    return $out;
}

$findings = [];
$checked = 0;

foreach ($langs as $lang) {
    $path = "$LIB/lang.ec.$lang.php";
    if (!is_file($path)) { continue; }
    $tr = ecLangRawValues(file_get_contents($path));

    foreach ($en as $key => $enVal) {
        if (!isset($tr[$key])) { continue; }          // missing -> falls back to English at runtime
        $trVal = $tr[$key];
        if ($trVal === $enVal) { continue; }           // identical -> matches trivially
        if (ecIsExemptFromEnglishEquality($key, $lang, $exemptMap)) { continue; }
        if (!ecCoverageKeyInScope($key, $lang, $coverage)) { continue; }

        $checked++;
        $a = tagSignature($enVal);
        $b = tagSignature($trVal);
        // A TRANSLATOR MAY ADD A LINE BREAK, and should be able to without being nagged.
        // <br> is the one purely presentational tag in these strings, and several of them are
        // column headings in very narrow fixed-width cells (mi_is_bank, mi_tau, mi_n): a term
        // that is one word in English is often three in Spanish or Turkish, and breaking it is
        // the correct fix rather than a defect. Measured on this check's first run -- 3 of its 4
        // findings were exactly that, in es/fr/pt/tr.
        //
        // So <br> is compared by a WEAKER rule than every other tag: the translation may have
        // more, but never fewer. Losing one is still reported, because that is layout the English
        // asked for and did not get.
        $isBr = function ($t) { return $t === '<br>' || $t === '</br>'; };
        $aBr = count(array_filter($a, $isBr));
        $bBr = count(array_filter($b, $isBr));
        $a = array_values(array_reject_br($a, $isBr));
        $b = array_values(array_reject_br($b, $isBr));
        if ($aBr > $bBr) {
            $findings[] = [$lang, $key, 'tag-parity',
                'LOST ' . ($aBr - $bBr) . ' <br> (English asks for ' . $aBr . ', has ' . $bBr . ')'];
        }
        if ($a !== $b) {
            $lost  = array_diff($a, $b);
            $extra = array_diff($b, $a);
            $bits = [];
            if ($lost)  { $bits[] = 'LOST '   . implode(' ', array_unique($lost)); }
            if ($extra) { $bits[] = 'EXTRA ' . implode(' ', array_unique($extra)); }
            if (!$bits) { $bits[] = 'count differs: en=' . count($a) . ' ' . $lang . '=' . count($b); }
            $findings[] = [$lang, $key, 'tag-parity', implode('; ', $bits)];
        }

        $pa = placeholders($enVal);
        $pb = placeholders($trVal);
        if ($pa !== $pb) {
            $lost  = array_diff($pa, $pb);
            $extra = array_diff($pb, $pa);
            $bits = [];
            if ($lost)  { $bits[] = 'LOST '  . implode(' ', $lost); }
            if ($extra) { $bits[] = 'EXTRA ' . implode(' ', $extra); }
            $findings[] = [$lang, $key, 'placeholder-parity', implode('; ', $bits)];
        }
    }
}

echo "Tag and placeholder parity against English\n";
printf("  %d language(s), %d translated string(s) compared, %d finding(s)\n\n",
    count($langs), $checked, count($findings));

if ($findings) {
    // Grouped by KEY, not by language: a wrapper lost in ten files is one defect with ten
    // instances, and reading it per-language buries that.
    $byKey = [];
    foreach ($findings as $f) { $byKey[$f[1]][] = $f; }
    uasort($byKey, function ($x, $y) { return count($y) - count($x); });
    foreach ($byKey as $key => $rows) {
        $langsHit = array_unique(array_column($rows, 0));
        printf("  %-32s %2d language(s): %s\n", $key, count($langsHit), implode(' ', $langsHit));
        if ($verbose) {
            foreach ($rows as $r) { printf("      %-4s %-18s %s\n", $r[0], $r[2], $r[3]); }
        } else {
            printf("      %s\n", $rows[0][3]);
        }
    }
    echo "\n";
    echo "A LOST tag is invisible to every other check in this repo: the string is valid PHP, is\n";
    echo "single-quoted, carries no entity and breaks no tag rule -- because the tag is simply not\n";
    echo "there. Losing <span class=\"ec-help\"> loses a whole tooltip; losing a {placeholder} leaves\n";
    echo "a sentence with a hole in it. Fix the LANGUAGE file: English is the authority for markup.\n";
    echo "Run with --verbose for one line per language.\n";
}

if (!$findings) { echo "PASS: every translated string carries the same markup as its English source.\n"; }
exit($strict && $findings ? 1 : 0);
