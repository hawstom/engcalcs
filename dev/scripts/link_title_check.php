<?php
/**
 * link_title_check.php — no explanation hides in a link's title=. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. `js/Calculators.lib.js` wires tap-triggered tooltips on exactly one selector,
 * `.ec-help[title]`. A `title=` anywhere else is a DESKTOP-ONLY affordance: hover it with a mouse
 * and the text appears, tap it on a phone and the browser follows the link instead. So an
 * explanation parked on an `<a title="...">` is not a tooltip that is hard to reach — for a touch
 * visitor it does not exist, and most of this suite's visitors are touch visitors.
 *
 * It renders perfectly. It reads perfectly in the source. On the machine of whoever wrote it, it
 * works. That combination is what makes it worth a script rather than a paragraph, and the
 * paragraph has been in CLAUDE.md the whole time.
 *
 * BOTH CORRECT NESTINGS PUT THE TITLE ON A SPAN, NEVER ON THE ANCHOR, which is what makes this
 * checkable at all. `ecTipLabel()` emits `<span class="ec-help" title="TIP">LABEL <span
 * class="ec-tip">?</span></span>`; `ecLinkTipLabel()` emits `<a href=...>LABEL</a><span
 * class="ec-help" title="TIP"><span class="ec-tip">?</span></span>` — the anchor is the big click
 * target and the glyph beside it carries the tip. In neither does an `<a>` carry a title. Putting
 * `class="ec-help"` on the anchor itself does not rescue it either: the tap still navigates.
 *
 * IT READS RENDERED PAGES, one per process through `dev/scripts/render_page.php`, because the
 * question is about what a visitor's browser receives. A title assembled from a language key, a
 * helper, and a loop in `lib/Menus.lib.php` is not visible in any one source file.
 *
 * TWO FINDINGS, EACH WITH ITS OWN PROVENANCE TEST — the check never guesses whether prose is
 * "explanatory", it asks where the text CAME FROM:
 *
 *   1. **A TIP IN A LINK.** The title is the value of a `$ec_lang` key whose name is tip-shaped
 *      (`*_tip`, `*_help`, and the prefix form `lpn_tip_*`). Those keys exist to be tips; a tip is exactly the thing the
 *      helpers exist to place, and it has landed on the one element that cannot show it.
 *   2. **A HAND-WRITTEN EXPLANATION.** The title matches no shipped string at all and reads as a
 *      sentence (eight or more words, or sentence-ending punctuation). Nothing that names a
 *      destination or a control looks like that.
 *
 * WHAT IS DELIBERATELY ALLOWED, because a `title` on a link is not wrong by itself — it is wrong
 * when it carries something a touch visitor needs. A title that NAMES the thing the link goes to is
 * legitimate and reachable, because tapping it delivers the named thing:
 *
 *   - the main menu's `<prefix>_main_desc`, which describes the page the link opens;
 *   - the language switcher's `LANGNAME`, which is the language's own name;
 *   - `view_hide_line` on the row-collapse "X", which names an unlabelled control.
 *
 * Each of those is a shipped `$ec_lang` (or `LANGNAME`) value that is not a tip, and that is the
 * whole test. Anything with no shipped-string provenance that is too short to be a sentence is
 * counted and printed as a NOTE — visible, unjudged, and never a failure.
 *
 * Usage:
 *   php dev/scripts/link_title_check.php            # every page
 *   php dev/scripts/link_title_check.php -v         # ... and list what it allowed
 *
 * Exit 0 = clean. Exit 1 = an explanation is parked where touch cannot reach it.
 */

require_once __DIR__ . '/lang_parse.inc.php';

/**
 * Is this key one whose value is a TIP -- the thing the .ec-help helpers exist to place?
 */
function ecIsTipKey(string $key): bool
{
    return (bool) preg_match('/(^|_)tips?$/', $key)
        || str_contains($key, '_tip_')
        || (bool) preg_match('/(^|_)help$/', $key);
}

/**
 * Does this read as a sentence rather than as a name?
 *
 * Deliberately blunt, and used only where the text has NO shipped-string provenance at all: a
 * destination name, a control name and a language name are all short and none of them is
 * punctuated as prose.
 */
function ecReadsAsProse(string $text): bool
{
    $t = trim($text);
    if ($t === '') { return false; }
    if (preg_match('/[.!?](\s|$)/u', $t)) { return true; }
    return count(preg_split('/\s+/u', $t)) >= 8;
}

/**
 * Every anchor in one rendered page that carries a title, classified. Pure.
 *
 * @param string $html      The rendered page.
 * @param array  $tipValues Values of tip-shaped $ec_lang keys => the key that owns them.
 * @param array  $named     Every other shipped string that may legitimately NAME a link
 *                          (non-tip $ec_lang values and LANGNAMEs), as a set.
 * @return array<int,array{0:string,1:string,2:string}> [kind, title, detail]; kind is
 *         'tip-in-link', 'prose-in-link' (both blocking), 'unattributed' (a NOTE) or
 *         'named' (allowed, listed only under -v).
 */
function ecLinkTitleFindings(string $html, array $tipValues, array $named): array
{
    $out = [];
    if (!preg_match_all('/<a\b[^>]*>/i', $html, $tags)) { return $out; }
    foreach ($tags[0] as $tag) {
        if (!preg_match('/\btitle\s*=\s*("([^"]*)"|\'([^\']*)\')/i', $tag, $m)) { continue; }
        $title = html_entity_decode($m[2] !== '' ? $m[2] : ($m[3] ?? ''), ENT_QUOTES, 'UTF-8');
        $title = trim($title);
        if ($title === '') { continue; }
        if (isset($tipValues[$title])) {
            $out[] = ['tip-in-link', $title, "\$ec_lang['" . $tipValues[$title] . "'] is a tip"];
            continue;
        }
        if (isset($named[$title])) {
            $out[] = ['named', $title, 'names its destination or its control'];
            continue;
        }
        if (ecReadsAsProse($title)) {
            $out[] = ['prose-in-link', $title, 'reads as a sentence and matches no shipped string'];
            continue;
        }
        $out[] = ['unattributed', $title, 'matches no shipped string, but is not a sentence'];
    }
    return $out;
}

if (defined('LINK_TITLE_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$verbose = in_array('-v', $argv, true) || in_array('--verbose', $argv, true);

// ---- what the suite ships as text -------------------------------------------------------------
$tipValues = [];
$named = [];
foreach (ecLangValues(file_get_contents($root . '/lib/lang.ec.en.php')) as $key => $value) {
    $value = trim(html_entity_decode(strip_tags($value), ENT_QUOTES, 'UTF-8'));
    if ($value === '') { continue; }
    if (ecIsTipKey($key)) { $tipValues[$value] = $key; } else { $named[$value] = true; }
}
// A language's own name is a name, and it is the title of every entry in the switcher.
if (preg_match_all("/'LANGNAME'\s*=>\s*'([^']*)'/u",
        file_get_contents($root . '/lib/Language.Settings.php'), $lm)) {
    foreach ($lm[1] as $langName) { $named[trim($langName)] = true; }
}
// A tip that is ALSO used as a plain name somewhere would be ambiguous. Tips win: the finding is
// about where the text landed, not about which key was typed.
foreach (array_keys($tipValues) as $v) { unset($named[$v]); }

// ---- the pages, one per process ----------------------------------------------------------------
$skip = ['lpn-lock.php', 'log-calc-event.php', 'log-human-view.php', 'log-signal-event.php',
         'log-title-event.php', 'formmail.php', 'sw.php', 'consent.php'];
$pages = array_filter(glob($root . '/*.php'),
    fn($p) => !in_array(basename($p), $skip, true));

$problems = [];
$notes = [];
$allowed = [];
$checked = 0;
$unrendered = [];
foreach ($pages as $page) {
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
         . ' ' . escapeshellarg(basename($page)) . ' 2>/dev/null';
    $html = shell_exec($cmd);
    if ($html === null || trim($html) === '') { $unrendered[] = basename($page); continue; }
    $checked++;
    foreach (ecLinkTitleFindings($html, $tipValues, $named) as [$kind, $title, $detail]) {
        if ($kind === 'named') { $allowed[$title] = ($allowed[$title] ?? 0) + 1; continue; }
        if ($kind === 'unattributed') { $notes[$title] = ($notes[$title] ?? 0) + 1; continue; }
        $problems[] = [basename($page), $kind, $title, $detail];
    }
}

if ($problems) {
    echo 'Explanations in link titles: ' . count($problems) . " site(s)\n\n";
    foreach ($problems as [$file, $kind, $title, $detail]) {
        printf("  %s  [%s]\n      title=\"%s\"\n      %s\n", $file, $kind,
            mb_strimwidth($title, 0, 110, '...'), $detail);
    }
    echo "\njs/Calculators.lib.js activates tap tooltips on .ec-help[title] and nothing else, so on a\n";
    echo "touch screen an <a title=\"...\"> does not show its text -- the tap navigates instead. The\n";
    echo "explanation is not merely awkward to reach; for most of this suite's visitors it is gone.\n";
    echo "\nFIX: put the tip on the glyph beside the link, never on the link --\n";
    echo "    ecLinkTipLabel('https://...', \$ec_lang['x'], \$ec_lang['x_tip'])\n";
    echo "which renders <a href=...>LABEL</a> plus a separate <span class=\"ec-help\" title=\"TIP\">.\n";
    echo "The anchor is already a big target; the '?' beside it carries the explanation.\n";
    echo "A link with no tip needs no wrapper at all -- a plain <a> is correct.\n";
    echo "Putting class=\"ec-help\" on the anchor does NOT fix it: the tap still navigates.\n";
    exit(1);
}

echo "Link titles OK -- $checked page(s) rendered, no tip and no sentence parked on an <a>.\n";
echo '  ' . count($allowed) . " distinct title(s) allowed as names of a destination or a control.\n";
if ($verbose) {
    foreach ($allowed as $t => $n) { echo sprintf("      \"%s\" (x%d)\n", mb_strimwidth($t, 0, 70, '...'), $n); }
}
if ($notes) {
    echo '  NOTE: ' . count($notes) . " link title(s) match no shipped string and are too short to\n";
    echo "        be a sentence, so they are not judged here:\n";
    foreach ($notes as $t => $n) { echo sprintf("          \"%s\" (x%d)\n", mb_strimwidth($t, 0, 70, '...'), $n); }
}
if ($unrendered) {
    echo '  NOTE: ' . count($unrendered) . " page(s) rendered nothing and were not checked: "
        . implode(', ', $unrendered) . "\n";
}
exit(0);
