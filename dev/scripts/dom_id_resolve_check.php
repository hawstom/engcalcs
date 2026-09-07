<?php
/**
 * dom_id_resolve_check.php -- every DOM id this suite NAMES is one something can create.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * The suite writes a DOM id REFERENCE 1,447 times over 28 rendered pages, 35 scripts and the
 * stylesheet: 246 literal `getElementById()` calls in `js/*.js`, 128 `<label for>`, 308
 * `aria-controls`, 91 `aria-labelledby`, `href="#..."` on every collapse control bootstrap builds,
 * 27 `#id` selectors in `css/engcalcs.css` and 4 `url(#...)` in the sketches. Writing a name
 * fourteen hundred times assumes it is spelled the same at both ends, and nothing had ever checked
 * it -- not in either direction, and not in any of the three languages the suite says an id in.
 *
 * **THE FAILURE RENDERS PERFECTLY.** `getElementById()` returns null and this page's own idiom is
 * `if (el) { ... }`, so a misspelled lookup is not an error: the control simply never does
 * anything, on a page that draws exactly as it should. A `<label for>` naming nothing still shows
 * its text -- it just stops focusing the field it labels and stops being the field's accessible
 * name. An `aria-controls` naming nothing is invisible to everyone except the screen reader it was
 * written for. A `#id` rule in the stylesheet that matches nothing styles nothing. Not one of
 * those is visible to a person using the page, and none of them is visible by reading either file:
 * the defect lives in the GAP between them, which is the same shape as ROADMAP Task 318.
 *
 * WHAT IT FOUND: one, `lpn_rpane_btn`, declared below with its reason. That is the honest yield,
 * and the reason a ratchet at one is still worth having is the failure shape above -- the next one
 * arrives silently too.
 *
 * IT ALSO HOLDS THE OTHER HALF OF THE SAME RULE: an id must resolve to exactly ONE element, so a
 * duplicated id on a rendered page is a finding. `getElementById()` returns the first, and which
 * element is first is a fact about markup order that nobody writing the lookup can see.
 *
 * WHAT IT DELIBERATELY TURNS AWAY, PRINTED AS A COUNT AND NEVER AS A SILENCE:
 *   - A lookup whose argument is not a literal (`getElementById(name)`, a concatenation). There is
 *     nothing to compare, and inventing a value would invent a finding.
 *   - A reference satisfied by a DYNAMIC id -- `b.id = 'lpn_pane_tab_' + t.id` creates a family of
 *     ids no scan can enumerate, so the literal half becomes a PREFIX and a reference under it is
 *     turned away rather than failed. Seven of the suite's own `aria-labelledby` values are exactly
 *     this and are correct.
 *   - A page that renders empty (an endpoint, not a page). Named, so a page that starts failing to
 *     render cannot hide here.
 *
 * Usage:
 *   php dev/scripts/dom_id_resolve_check.php
 *
 * Exit 0 = every id named resolves. Exit 1 = one does not, or one is defined twice on a page.
 */

/**
 * Lookups that name an id nothing creates, declared one by one with the reason.
 *
 * A NAME BELONGS HERE ONLY WHEN THE MISS IS DELIBERATE AND HARMLESS. It is not a way to quiet a
 * real miss: the fix for a typo is the typo, and the fix for a control that was removed is to
 * remove its lookup too.
 *
 * @return array<string,string> id => why nothing creates it
 */
function ecDomIdDeclaredMisses(): array
{
    return [
        'lpn_rpane_btn' => 'the right pane deliberately has no toolbar button -- the row that '
            . 'opened it was left out and `rpaneIsOpen()` records that the question is still open. '
            . '`applyRPaneLayout()` guards the lookup with `if (btn)`, so the aria-pressed write is '
            . 'skipped and nothing else changes. Dead, not broken: delete the lookup when the '
            . 'question is settled, or add the button.',
    ];
}

/**
 * Attributes whose VALUE is an id (or, for aria-controls and aria-labelledby, a space-separated
 * list of them). Read from here rather than typed twice, so the message can name the attribute.
 *
 * @return array<int,string>
 */
function ecDomIdRefAttrs(): array
{
    return ['for', 'aria-controls', 'aria-labelledby', 'aria-describedby', 'list', 'form'];
}

/**
 * The findings, pure so the selftest can drive it with fixtures.
 *
 * @param array<string,string> $pages   rendered page path => HTML
 * @param array<string,string> $scripts js path => source
 * @param array<string,string> $styles  css path => source
 * @return array{findings: array<int,string>, stats: array<string,int>}
 */
function ecDomIdResolve(array $pages, array $scripts, array $styles): array
{
    $findings = [];
    $defined = [];   // id => true
    $prefixes = [];  // literal half of a computed id
    $stats = ['refs' => 0, 'defined' => 0, 'dynamic_lookups' => 0, 'by_prefix' => 0, 'prefixes' => 0];

    // --- the supply side: every id something can create -------------------------------------
    foreach ($pages as $rel => $html) {
        $seen = [];
        if (preg_match_all('/\bid\s*=\s*"([^"]*)"|\bid\s*=\s*\'([^\']*)\'/i', $html, $m, PREG_SET_ORDER)) {
            foreach ($m as $hit) {
                $id = $hit[1] !== '' ? $hit[1] : ($hit[2] ?? '');
                if ($id === '') continue;
                $defined[$id] = true;
                // An id must resolve to exactly one element. getElementById() takes the first, and
                // which element is first is a fact about markup order the lookup cannot see.
                if (isset($seen[$id])) {
                    $findings[] = "$rel defines id=\"$id\" more than once. An id names ONE element: "
                        . 'getElementById() returns whichever comes first in the markup, and a '
                        . '`<label for>` or an aria-controls pointing at it reaches that one too. '
                        . 'Rename one of them, or build the ids from something already unique.';
                }
                $seen[$id] = true;
            }
        }
    }

    // JS creates ids too -- as a property write, and inside the markup strings it assembles.
    // A concatenation contributes the literal half as a PREFIX: `'lpn_pane_tab_' + t.id` makes a
    // family no scan can enumerate, so a reference under it is turned away, not failed.
    foreach ($scripts as $src) {
        if (preg_match_all('/\bid\s*=\s*\\\\?["\']([^"\'\\\\]*)\\\\?["\']\s*(\+)?/i', $src, $m, PREG_SET_ORDER)) {
            foreach ($m as $hit) {
                $id = $hit[1];
                if ($id === '') continue;
                if (isset($hit[2]) && $hit[2] === '+') { $prefixes[$id] = true; continue; }
                $defined[$id] = true;
            }
        }
        if (preg_match_all('/setAttribute\(\s*["\']id["\']\s*,\s*["\']([^"\']+)["\']/i', $src, $m)) {
            foreach ($m[1] as $id) { $defined[$id] = true; }
        }
    }
    $stats['defined'] = count($defined);
    $stats['prefixes'] = count($prefixes);

    $declared = ecDomIdDeclaredMisses();

    // A reference resolves if something defines it, if a dynamic family covers it, or if it is
    // declared above with its reason.
    $resolve = function (string $id) use (&$defined, &$prefixes, $declared, &$stats): ?string {
        if ($id === '' ) return null;
        if (isset($defined[$id])) return null;
        foreach ($prefixes as $p => $_) {
            if ($p !== '' && strncmp($id, $p, strlen($p)) === 0) { $stats['by_prefix']++; return null; }
        }
        if (isset($declared[$id])) return null;
        return $id;
    };

    // --- the demand side ---------------------------------------------------------------------
    $attrs = ecDomIdRefAttrs();
    foreach ($pages as $rel => $html) {
        foreach ($attrs as $attr) {
            if (!preg_match_all('/\b' . preg_quote($attr, '/') . '\s*=\s*"([^"]*)"/i', $html, $m)) continue;
            foreach ($m[1] as $value) {
                // aria-controls and aria-labelledby take a LIST of ids, space separated.
                foreach (preg_split('/\s+/', trim($value)) as $id) {
                    if ($id === '') continue;
                    $stats['refs']++;
                    if ($miss = $resolve($id)) {
                        $findings[] = "$rel names id \"$miss\" in $attr=, and nothing on the page "
                            . 'creates it. The page renders exactly the same either way: a label '
                            . 'that names nothing still shows its text and simply stops focusing '
                            . 'and naming its field, and an aria- reference that names nothing is '
                            . 'invisible to everyone except the screen reader it was written for. '
                            . 'Fix the spelling, or give the element the id.';
                    }
                }
            }
        }
        foreach (ecDomIdFragmentRefs($html) as $id) {
            $stats['refs']++;
            if ($miss = $resolve($id)) {
                $findings[] = "$rel links to \"#$miss\", which is on no element of the page. The "
                    . 'link still looks and clicks like a link and takes the visitor nowhere. Fix '
                    . 'the spelling, or give the target the id.';
            }
        }
    }

    foreach ($scripts as $rel => $src) {
        // Literal lookups only. A non-literal argument is counted and turned away: there is
        // nothing to compare it with, and guessing a value would invent a finding.
        if (preg_match_all('/getElementById\s*\(\s*([^)]*)\)/', $src, $m, PREG_SET_ORDER)) {
            foreach ($m as $hit) {
                $arg = trim($hit[1]);
                if (!preg_match('/^["\']([A-Za-z_][\w:.\-]*)["\']$/', $arg, $lit)) {
                    $stats['dynamic_lookups']++;
                    continue;
                }
                $stats['refs']++;
                if ($miss = $resolve($lit[1])) {
                    $findings[] = "$rel calls getElementById('$miss') and nothing creates that id. "
                        . 'The call returns null, this page guards its lookups with `if (el)`, and '
                        . 'so the control silently does nothing on a page that draws correctly. '
                        . 'Fix the spelling, create the element, or delete the lookup with the '
                        . 'control it belonged to.';
                }
            }
        }
        // querySelector('#id ...') -- only when the selector LEADS with an id, which is the form
        // that is a lookup rather than a descendant filter this scan has no business parsing.
        if (preg_match_all('/querySelector(?:All)?\s*\(\s*["\']#([A-Za-z_][\w:.\-]*)/', $src, $m)) {
            foreach ($m[1] as $id) {
                $stats['refs']++;
                if ($miss = $resolve($id)) {
                    $findings[] = "$rel selects '#$miss' and nothing creates that id. The query "
                        . 'returns null (or an empty list), which is indistinguishable from a page '
                        . 'where the feature is simply off. Fix the spelling or create the element.';
                }
            }
        }
        foreach (ecDomIdFragmentRefs($src) as $id) {
            $stats['refs']++;
            if ($miss = $resolve($id)) {
                $findings[] = "$rel writes a reference to \"#$miss\", which nothing creates. In "
                    . 'SVG a `url(#...)` that resolves to nothing paints no fill and draws no '
                    . 'arrow head, on a sketch that is otherwise complete.';
            }
        }
    }

    foreach ($styles as $rel => $css) {
        foreach (ecDomIdCssSelectorIds($css) as $id) {
            $stats['refs']++;
            if ($miss = $resolve($id)) {
                $findings[] = "$rel has a rule for \"#$miss\" and nothing creates that id. A rule "
                    . 'that matches nothing styles nothing, silently, forever. Fix the spelling, '
                    . 'or delete the rule with the element it belonged to.';
            }
        }
    }

    return ['findings' => $findings, 'stats' => $stats];
}

/**
 * `href="#id"` and `url(#id)` -- the two fragment forms. `#` alone and `#!` are not id references.
 *
 * @return array<int,string>
 */
function ecDomIdFragmentRefs(string $text): array
{
    $out = [];
    if (preg_match_all('/(?:xlink:)?href\s*=\s*\\\\?["\']#([A-Za-z_][\w:.\-]*)\\\\?["\']/i', $text, $m)) {
        foreach ($m[1] as $id) { $out[] = $id; }
    }
    if (preg_match_all('/url\(\s*#([A-Za-z_][\w:.\-]*)\s*\)/i', $text, $m)) {
        foreach ($m[1] as $id) { $out[] = $id; }
    }
    return $out;
}

/**
 * The `#id` selectors of a stylesheet, read from SELECTOR text only.
 *
 * That distinction is the whole difficulty: `#1a6faf` is a colour and lives in a declaration, so a
 * scan of the file finds 37 hex colours and 27 selectors and cannot tell them apart. Splitting on
 * the braces puts colours out of reach by construction rather than by a pattern that guesses which
 * hex strings are not ids.
 *
 * @return array<int,string>
 */
function ecDomIdCssSelectorIds(string $css): array
{
    $css = preg_replace('~/\*.*?\*/~s', '', $css);
    $out = [];
    $depth = 0; $buf = '';
    $len = strlen($css);
    for ($i = 0; $i < $len; $i++) {
        $c = $css[$i];
        if ($c === '{') {
            if ($depth === 0) {
                if (preg_match_all('/#([A-Za-z_][\w-]*)/', $buf, $m)) {
                    foreach ($m[1] as $id) { $out[] = $id; }
                }
            }
            $depth++; $buf = '';
        } elseif ($c === '}') {
            $depth = $depth > 0 ? $depth - 1 : 0; $buf = '';
        } elseif ($depth === 0) {
            $buf .= $c;
        }
    }
    return $out;
}

if (defined('DOM_ID_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

// Pages are RENDERED, one subprocess per page, because that is the only honest way to see the ids
// a page emits -- most of them come out of lib/ helpers and out of loops. See render_page.php's
// docblock for why in-process rendering silently produces a different page.
$pages = [];
$empty = [];
foreach (glob($root . '/*.php') ?: [] as $file) {
    $name = basename($file);
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
         . ' ' . escapeshellarg($name) . ' 2>/dev/null';
    $html = (string) shell_exec($cmd);
    if (trim($html) === '') { $empty[] = $name; continue; }
    $pages[$name] = $html;
}

$scripts = [];
foreach (glob($root . '/js/*.js') ?: [] as $file) {
    $scripts['js/' . basename($file)] = (string) file_get_contents($file);
}

$styles = [];
foreach (glob($root . '/css/*.css') ?: [] as $file) {
    // css/vendor/ is out of the glob by construction: it is somebody else's ids against somebody
    // else's markup, and its selectors say nothing about this suite.
    $styles['css/' . basename($file)] = (string) file_get_contents($file);
}

$result = ecDomIdResolve($pages, $scripts, $styles);
$stats = $result['stats'];
$declared = ecDomIdDeclaredMisses();

if ($result['findings']) {
    echo 'DOM ids: ' . count($result['findings']) . " finding(s)\n\n";
    foreach ($result['findings'] as $f) { echo "  ! $f\n\n"; }
    echo "Every one of these renders perfectly. If a name here is a lookup that is deliberately\n";
    echo "dead, declare it in ecDomIdDeclaredMisses() WITH ITS REASON -- that list is for a miss\n";
    echo "somebody decided on, never for one nobody has read.\n";
    exit(1);
}

printf(
    "DOM ids OK -- %d reference(s) across %d page(s), %d script(s) and %d stylesheet(s) resolve to\n",
    $stats['refs'], count($pages), count($scripts), count($styles)
);
printf("%d defined id(s), and no page defines one twice.\n", $stats['defined']);
printf(
    "Turned away, deliberately: %d non-literal getElementById() argument(s) with nothing to\n"
    . "compare; %d reference(s) covered by one of %d computed id prefix(es).\n",
    $stats['dynamic_lookups'], $stats['by_prefix'], $stats['prefixes']
);
if ($declared) {
    echo 'Declared dead lookup(s), ' . count($declared) . ': ' . implode(', ', array_keys($declared)) . ".\n";
}
if ($empty) {
    echo 'Rendered empty and not read, ' . count($empty) . ': ' . implode(', ', $empty) . ".\n";
}
exit(0);
