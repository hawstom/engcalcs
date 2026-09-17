<?php
/**
 * attr_escape_check.php -- a $ec_lang value echoed inside an HTML ATTRIBUTE goes through
 * htmlspecialchars(). BLOCKING, and a ratchet at zero.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * Shipped PHP writes a language string into a double-quoted HTML attribute 69 times. **49 of them
 * were wrapped in `htmlspecialchars()` and 20 were not** -- the sixteen
 * `title=` links on the suite's own calculator menu, each carrying a `<prefix>_main_desc`, two
 * `placeholder=` from the printable-title template, a `value=` on the contact form's own submit
 * button, and one `onclick=` whose value went through `addslashes()`, which escapes for a
 * JavaScript string and not for HTML. A construct written 49 times the same way is a
 * rule somebody knew; nothing in `CLAUDE.md` or `dev/*.md` states it, and nothing held it. That is
 * the signature this survey hunts.
 *
 * WHAT THE OMISSION COSTS. **A double quote in the value ends the attribute.** Everything after it
 * is then read as further attributes on that tag: at best the tip is truncated and the tag carries
 * garbage, at worst a `"` followed by an event attribute is markup injection out of a language
 * file. The values are written by translators, in 27 files, five of them right to left, and a
 * sprint pays an agent to edit them. **None of the 27 carries a `"` today**, which is exactly why
 * it is worth holding now rather than after: the defect arrives with an ordinary translation, ships
 * silently, and is visible only to somebody loading that page in that language.
 *
 * **RULE B DOES NOT COVER THIS, and the distinction is the point.** Rule B
 * (`lang_syntax_validate.php`) forbids an HTML TAG in a plain-text-constrained string. A quotation
 * mark is not a tag; it is ordinary, correct, idiomatic plain text in every language on this list,
 * and it is the character that breaks the attribute. The two checks do not overlap.
 *
 * SCOPE, and the reason it is drawn here. Only `$ec_lang` reads are in scope -- the values this
 * project does not write. The same attributes also carry constants (`EC_SW_BASE`), language codes
 * from `Language.Settings.php` and field names out of `$arrayResults`; those are ours, they cannot
 * contain a quote without somebody in this repository typing one, and widening the check to them
 * would buy an exception table nobody maintains and a scan that cries wolf.
 *
 * WHAT IT DELIBERATELY DOES NOT READ, stated rather than pretended away:
 *   - a value echoed as element CONTENT rather than into an attribute. A `"` there is just a
 *     quotation mark, and `lang_tag_parity_check.php --strict` already holds the markup.
 *   - a value reaching an attribute through a helper (`ecTipLabel()`), which does its own
 *     escaping at one door and is `tip_markup_check.php`'s business.
 *   - a value written into an attribute from JavaScript. That is a different door with a different
 *     escape, and `lang_syntax_validate.php` rule B binds it.
 *
 * Usage:
 *   php dev/scripts/attr_escape_check.php
 *
 * Exit 0 = every attribute interpolation of a language string is escaped. Exit 1 = one is not.
 */

/**
 * Every `$ec_lang` read echoed inside a double-quoted attribute value, and whether it was escaped.
 *
 * An island is "inside an attribute" when the text back to the nearest `<` shows an attribute name,
 * an `=`, an opening double quote and no closing one. That is decidable from the source, which the
 * rendered page is not: after rendering, the attribute and its value are one string and the
 * escaping that did or did not happen has already happened.
 *
 * Pure, so the selftest can drive it with fixtures instead of the tree.
 *
 * @param array<string,string> $files rel path => PHP source
 * @return array{findings: array<int,string>, escaped: int, content: int}
 */
function ecAttrEscapeFindings(array $files): array
{
    $findings = array();
    $escaped = 0;
    $content = 0;

    foreach ($files as $rel => $src) {
        if (!preg_match_all('/<\?(=|php\b)(.*?)\?>/s', $src, $isl, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
            continue;
        }
        foreach ($isl as $m) {
            $code = trim($m[2][0]);
            if ($m[1][0] !== '=') {
                if (!preg_match('/^(?:echo|print)\s+(.*?);?$/s', $code, $e)) { continue; }
                $code = trim($e[1]);
            }
            if (strpos($code, '$ec_lang[') === false) { continue; }
            $pos = $m[0][1];
            // The raw markup back to the nearest tag opener. An opening `"` with no partner, after
            // an `attr=`, is an attribute value in progress.
            $lt = strrpos(substr($src, 0, $pos), '<');
            $before = $lt === false ? substr($src, 0, $pos) : substr($src, $lt, $pos - $lt);
            $inAttr = (bool) preg_match('/[a-zA-Z_:][-a-zA-Z0-9_:.]*\s*=\s*"[^"]*$/s', $before);
            if (!$inAttr) { $content++; continue; }
            $line = substr_count(substr($src, 0, $pos), "\n") + 1;
            if (strpos($code, 'htmlspecialchars') !== false) { $escaped++; continue; }
            $flat = preg_replace('/\s+/', ' ', $code);
            $findings[] = "$rel:$line echoes `$flat` into an HTML attribute with no "
                . 'htmlspecialchars(). A double quote in the value ENDS THE ATTRIBUTE, and what '
                . 'follows is read as further attributes on that tag -- a truncated tip at best, '
                . 'markup injected out of a language file at worst. The value is written by a '
                . 'translator, in 27 files, and a quotation mark is ordinary plain text that rule B '
                . 'does not forbid and cannot see. Wrap it: `htmlspecialchars(...)`, which 49 other '
                . 'attribute interpolations in this suite already do. addslashes() is not a '
                . 'substitute: it escapes for a JavaScript string, and leaves the quote in the '
                . 'markup.';
        }
    }

    return array('findings' => $findings, 'escaped' => $escaped, 'content' => $content);
}

if (defined('ATTR_ESCAPE_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$files = array();
foreach (glob($root . '/*.php') ?: array() as $f) {
    $files[basename($f)] = (string) file_get_contents($f);
}
foreach (glob($root . '/lib/*.php') ?: array() as $f) {
    $files['lib/' . basename($f)] = (string) file_get_contents($f);
}

$result = ecAttrEscapeFindings($files, array());

if ($result['findings']) {
    echo 'Attribute escaping: ' . count($result['findings']) . " unescaped language string(s)\n\n";
    foreach ($result['findings'] as $f) { echo "  ! $f\n\n"; }
    echo "This is a ratchet at zero. None of the 27 language files carries a double quote in one\n";
    echo "of these values today; the defect arrives with an ordinary translation and is visible\n";
    echo "only to somebody loading that page in that one language.\n";
    exit(1);
}

printf(
    "Attribute escaping OK -- %d language string(s) echoed into an HTML attribute across %d shipped\n"
    . "PHP file(s), every one through htmlspecialchars(). A ratchet at zero.\n",
    $result['escaped'], count($files)
);
printf(
    "  turned away and counted: %d language string(s) echoed as element CONTENT rather than into an\n"
    . "  attribute, where a quotation mark is just a quotation mark and lang_tag_parity_check.php\n"
    . "  --strict already holds the markup.\n",
    $result['content']
);
echo "  out of scope by declaration, with the reasons in this script's docblock: constants and\n"
    . "  language codes this repository writes, values reaching an attribute through a helper such\n"
    . "  as ecTipLabel(), and values written from JavaScript, which rule B binds.\n";
exit(0);
