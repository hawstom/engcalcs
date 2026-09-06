<?php
/**
 * blank_target_check.php -- a new tab this suite's own markup opens carries rel="noopener".
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * Nothing in `CLAUDE.md` or `dev/*.md` had ever stated this rule, and the tree had already decided
 * it twice, in opposite directions: 13 `target="_blank"` links carried `rel="noopener"` and 12 did
 * not, with no rule for either. `privacy.php` had it on all six, `lib/Menus.lib.php` on its one,
 * and every calculator's reference link -- all of them through the one helper in
 * `lib/Calculators.lib.php` -- had none. That split is the finding: a construct written 25 times
 * with the security attribute on some of them is a rule somebody knew and nobody wrote down.
 *
 * WHAT rel="noopener" IS FOR. Without it the opened page receives a live `window.opener` handle
 * back to ours and can navigate this tab somewhere else while the visitor is reading the other
 * one. Current browsers imply it for `target="_blank"`, which is why the omission had no symptom
 * and is exactly why it drifted; the implication is a browser default and not a property of our
 * markup, and this suite's stated audience is low-bandwidth, where an old browser is likelier than
 * average.
 *
 * WHAT IS DELIBERATELY OUT OF SCOPE, AND THE REASON IS COST, NOT PRINCIPLE. `lib/lang.ec.*.php` is
 * skipped. Twelve English strings carry an `<a target="_blank">` of their own, and
 * `lang_tag_parity_check.php --strict` requires the markup of a translation to match English -- so
 * adding one attribute to the English value means the same edit in 26 translated files, by hand,
 * in five right-to-left scripts, to change nothing a reader can see. That is a poor trade against
 * an attribute browsers already imply, and pretending otherwise would make this check
 * unadoptable. **The scope is our own PHP markup, where the fix is free**; if the string half is
 * ever wanted it is a mechanical pass over all 27 files, and a decision, not this check's.
 *
 * Usage:
 *   php dev/scripts/blank_target_check.php
 *
 * Exit 0 = every new tab our markup opens is opened safely. Exit 1 = one is not.
 */

/**
 * Findings, pure so the selftest can drive it.
 *
 * @param array<string,string> $files relative path => PHP/JS source. Language files excluded by
 *                                    the caller, which is where that scope decision belongs.
 * @return array<int,string>
 */
function ecBlankTargetFindings(array $files): array
{
    $out = [];

    foreach ($files as $rel => $src) {
        // 1. Markup: an <a ...> tag whose attributes include target="_blank". Read as a whole tag
        //    so `rel` is found wherever in it the author put it -- before or after `target`, which
        //    both shipped orders do.
        if (preg_match_all('/<a\b[^>]*>/i', $src, $m)) {
            foreach ($m[0] as $tag) {
                if (!preg_match('/target\s*=\s*[\'"]?_blank/i', $tag)) continue;
                if (preg_match('/\brel\s*=\s*[\'"][^\'"]*\bnoopener\b/i', $tag)) continue;
                $out[] = "$rel opens a new tab without rel=\"noopener\": "
                    . trim(preg_replace('/\s+/', ' ', substr($tag, 0, 120)))
                    . ' -- the opened page gets a live window.opener handle back to this one and '
                    . 'can navigate this tab while the visitor is reading the other. Browsers imply '
                    . 'the attribute now, which is why the omission has no symptom; the implication '
                    . 'is their default, not our markup.';
            }
        }

        // 2. window.open(). The third argument is the feature string and 'noopener' is a FEATURE
        //    there, not an attribute -- a different spelling of the same decision, so it is read
        //    here rather than left to whoever remembers that the two forms differ.
        if (preg_match_all('/window\.open\s*\(([^)]*)\)/i', $src, $m, PREG_SET_ORDER)) {
            foreach ($m as $hit) {
                if (strpos($hit[1], '_blank') === false) continue;
                if (stripos($hit[1], 'noopener') !== false) continue;
                $out[] = "$rel calls window.open(" . trim(preg_replace('/\s+/', ' ', $hit[1]))
                    . ") with no 'noopener' feature. In window.open() it is a FEATURE STRING entry, "
                    . 'not an attribute, which is the spelling that gets forgotten when somebody '
                    . 'converts a link into a script call.';
            }
        }
    }

    return $out;
}

if (defined('BLANK_TARGET_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$files = [];
foreach (array_merge(glob($root . '/*.php') ?: [], glob($root . '/lib/*.php') ?: [], glob($root . '/js/*.js') ?: []) as $f) {
    $base = basename($f);
    // The one exclusion, argued in the docblock: a translated string's markup cannot be edited on
    // the English side alone without breaking tag parity in 26 files.
    if (strpos($base, 'lang.ec.') === 0) continue;
    $dir = basename(dirname($f));
    $rel = in_array($dir, ['lib', 'js'], true) ? $dir . '/' . $base : $base;
    $files[$rel] = (string) file_get_contents($f);
}

$problems = ecBlankTargetFindings($files);

if ($problems) {
    echo 'New-tab links: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "Write rel=\"noopener\" beside target=\"_blank\", or 'noopener' in the window.open()\n";
    echo "feature string. Language-file strings are deliberately out of scope -- see this script's\n";
    echo "docblock for why, and note that it is a cost argument and not a principle.\n";
    exit(1);
}

$tabs = 0;
foreach ($files as $src) {
    $tabs += preg_match_all('/target\s*=\s*[\'"]?_blank/i', $src);
}
echo "New-tab links OK -- $tabs target=\"_blank\" site(s) in this suite's own markup and script,\n";
echo "every one carrying noopener. Language-file strings are out of scope by declaration.\n";
exit(0);
