<?php
/**
 * page_meta_check.php — the three page-level conventions that fail where nobody on this side looks.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THESE THREE TOGETHER. Each is a rule CLAUDE.md states as an absolute, each breaks something a
 * VISITOR or a SEARCH ENGINE sees and nobody here does, and each is a fact about a page's source
 * that a script can settle with no judgement in it. ROADMAP Task 322 rows 7, 8 and 9.
 *
 *   1. **A page sets `$html_desc`, or is on the exempt list.** It feeds `<meta name="Description">`
 *      AND, since Task 534, `og:description` — so an unset one is a share card with a title, a
 *      picture and no subtitle. **The prose list of exemptions was WRONG until 2026-08-25**: it
 *      named `index.php`, which has its own description, and omitted `privacy.php` and `terms.php`,
 *      which do not. That correction is the whole argument for this check — the rule was written
 *      down, read, and still drifted from the code, and only somebody wiring the share cards
 *      noticed.
 *
 *   2. **`$html_desc` never points at `$html_title` or at a `*_main_title` key.** Google discards a
 *      description that duplicates the title and auto-generates a snippet instead — from a page
 *      whose content is a form, which is the worst snippet available. Nothing on this side of the
 *      wire changes; the damage is entirely in somebody else's index.
 *
 *   3. **Assets are cache-busted with `filemtime()`, never a hardcoded `?v=N`.** A hardcoded number
 *      is a promise to remember to increment it, and the failure mode is a visitor running last
 *      week's JavaScript against this week's HTML. It is also load-bearing for the service worker,
 *      which is generated at request time precisely because `git pull` does not preserve mtimes.
 *
 * WHAT COUNTS AS A PAGE, and it is not "a .php file in the root": a page is one that calls
 * `echoHeader(`. That is what separates the sixteen calculators and their siblings from the eight
 * ENDPOINTS beside them -- `sw.php`, `lpn-lock.php`, the four `log-*.php`, `consent.php`,
 * `formmail.php` -- which emit JavaScript, JSON or a redirect and have no head to put a description
 * in. Testing for the header call rather than listing the endpoints means a new endpoint needs no
 * entry here, and a new PAGE cannot avoid the rule by not being on a list.
 *
 * Usage:
 *   php dev/scripts/page_meta_check.php
 *
 * Exit 0 = clean. Exit 1 = at least one finding, each printed with its fix.
 */

/**
 * **THE PAGES THAT DELIBERATELY SET NO DESCRIPTION.** Each is a page with no calculator behind it,
 * so there is no `<prefix>_main_desc` to point at and writing one would mean a new string in 27
 * languages for a page nobody searches for. Adding a row here is a decision; it should be rare, and
 * it should not be how a new calculator gets past this check.
 */
const EC_NO_DESC_PAGES = [
    'Compare-Languages.php',
    'contact.php',
    'formmailsuccess.php',
    'privacy.php',
    'terms.php',
];

/**
 * Findings for one page's source, as [code, message] pairs. Pure: everything it judges arrives as
 * an argument, so `page_meta_selftest.php` can put fixtures through it.
 *
 * @param string $name Basename, for the message and the exempt lookup.
 * @param string $src  Source text of one root *.php file.
 * @return array<int,array{0:string,1:string}>
 */
function ecPageMetaFindings(string $name, string $src): array
{
    $out = [];

    // Not a page at all -- an endpoint. Nothing below applies.
    if (strpos($src, 'echoHeader(') === false) {
        return $out;
    }

    $exempt = in_array($name, EC_NO_DESC_PAGES, true);
    $assigns = preg_match_all('/\$html_desc\s*=\s*([^;]+);/', $src, $dm);

    if (!$assigns && !$exempt) {
        $out[] = ['no-desc', "$name calls echoHeader() and never sets \$html_desc, so it emits no "
            . "<meta name=\"Description\"> and no og:description. Point it at its own "
            . "<prefix>_main_desc, or add it to EC_NO_DESC_PAGES in this file and say why."];
    }
    if ($assigns && $exempt) {
        $out[] = ['exempt-but-sets', "$name is listed in EC_NO_DESC_PAGES but does set \$html_desc. "
            . "One of the two is now wrong; the list is the thing to fix if the page gained a "
            . "description on purpose."];
    }

    // **THE DUPLICATE-OF-TITLE RULE.** Checked on the assignment's TEXT rather than on a rendered
    // page, because what is banned is the SOURCE naming a title -- a value that happens to read the
    // same is a wording problem and is a human's to judge.
    foreach ($dm[1] ?? [] as $rhs) {
        $rhs = trim($rhs);
        if (preg_match('/\$html_title\b/', $rhs) || preg_match("/_main_title'\s*\]/", $rhs)) {
            $out[] = ['desc-is-title', "$name points \$html_desc at the page TITLE ($rhs). Google "
                . "discards a description that duplicates the title and writes its own snippet out "
                . "of a page that is a form. Point it at <prefix>_main_desc instead."];
        }
    }

    /* **A HARDCODED CACHE BUSTER.** `?v=` followed by a literal DIGIT, where the rule is
       `?v=<?=filemtime(...)?>`. Matching on the digit is what makes the correct form -- whose next
       character is `<` -- unreportable.

       **THIS IS A BLOCK COMMENT ON PURPOSE.** `?>` closes PHP mode even inside a `//` comment, so
       the line-comment version of this note silently ended the file's PHP and turned the rest of
       the function into HTML. `php -l` reported it as an unclosed brace 80 lines earlier. */
    if (preg_match_all('/[?&]v=(\d[\w.]*)/', $src, $vm)) {
        foreach (array_unique($vm[1]) as $v) {
            $out[] = ['hardcoded-v', "$name cache-busts an asset with a hardcoded ?v=$v. That is a "
                . "promise to remember to increment it, and the failure is a visitor running old "
                . "JavaScript against new HTML. Use ?v=<?=filemtime(__DIR__.'/js/x.js')?> instead."];
        }
    }

    return $out;
}

if (defined('PAGE_META_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$problems = [];
$pages = 0;

foreach (glob($root . '/*.php') as $file) {
    $src = file_get_contents($file);
    if (strpos($src, 'echoHeader(') !== false) { $pages++; }
    foreach (ecPageMetaFindings(basename($file), $src) as [$code, $msg]) {
        $problems[] = $msg;
    }
}

// **AN EXEMPT ENTRY NAMING A PAGE THAT NO LONGER EXISTS IS ALSO A FINDING.** Otherwise the list
// silently accumulates dead rows, which is how it stopped matching the code the first time.
foreach (EC_NO_DESC_PAGES as $name) {
    if (!is_file($root . '/' . $name)) {
        $problems[] = "EC_NO_DESC_PAGES names $name, which does not exist. Remove the row.";
    }
}

if ($problems) {
    echo 'Page meta: ' . count($problems) . " problem(s)\n\n";
    foreach ($problems as $p) { echo "  $p\n"; }
    echo "\nEach of these is invisible from here and visible to a search engine, a share card, or a\n";
    echo "visitor running a stale asset.\n";
    exit(1);
}

echo "Page meta OK -- $pages page(s), every one with a description or a declared reason, no\n";
echo "title-as-description, no hardcoded cache buster.\n";
exit(0);
