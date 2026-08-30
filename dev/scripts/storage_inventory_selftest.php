<?php
/**
 * storage_inventory_selftest.php — assert storage_inventory_check.php still sees an undocumented
 * key going onto a visitor's device, and still lets a read, a deletion and a comment alone.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. This is the highest-stakes check of the four written under ROADMAP Task 322,
 * because what it guards is the document a privacy question would be answered from and the sentence
 * the consent banner makes. It also has an unusually quiet failure mode: the check resolves a name
 * ONE HOP, so a constant written in a shape it does not recognise resolves to null, the site becomes
 * "dynamic", and if somebody then declares it the key is never compared to the inventory at all. A
 * check that reads fewer names looks exactly like a tree with fewer keys.
 *
 * The fixtures below pin, in both directions:
 *
 *   - the four write shapes, each in the form this repo actually writes it;
 *   - the three NON-writes that look identical to a grep — a read, a deletion, and a comment;
 *   - the one-hop resolver, including the `this.x` / `EngCalcs.x` split that hid
 *     `bpn_sketch_toggles` from the first draft of this check;
 *   - an unresolvable site with no declaration, which is the escape hatch closing.
 *
 * THE LOAD-BEARING FIXTURE IS THE DELETION. `ecForgetAnalyticsStorage()` loops over two cookie
 * names and expires them, and the naive version of this check reported that loop as an unreadable
 * write — so the first instinct would be to declare it, which would put a DELETION on the list of
 * things this suite stores.
 *
 *   php dev/scripts/storage_inventory_selftest.php
 */

define('STORAGE_INVENTORY_LIB_ONLY', true);
require __DIR__ . '/storage_inventory_check.php';

/** The inventory tokens the fixtures are judged against. */
$tokens = ['ec_language', 'ec_seen', 'lpn_pane', 'lpn_project_<id>', '<PageName>',
    'engcalcs-offline-queue'];

/** No declared dynamic sites unless a case supplies them. */
$noDecl = [];

function ecSiFixture(string $src, array $tokens, array $dynamic, bool $js = true): array
{
    $code = $js ? ecBlankJsComments($src) : $src;
    $f = ecStorageFindings(['js/fixture.js' => $code], $tokens, $dynamic);
    return $f['problems'];
}

$cases = [
    // ---- what it MUST find -----------------------------------------------------------------------
    ['a localStorage key nobody wrote down -- the shape that was really in the tree',
        "localStorage.setItem('bpn_sketch_toggles', JSON.stringify(t));\n", $noDecl, true],
    ['an IndexedDB database nobody wrote down -- the other shape that was really in the tree',
        "var DB = 'engcalcs-lpn';\nwindow.indexedDB.open(DB, 2);\n", $noDecl, true],
    ['a new cookie set from PHP',
        "setcookie('ec_theme', \$value, ['expires' => time() + 86400, 'path' => '/']);\n", $noDecl, true],
    ['a new cookie written from JavaScript',
        "document.cookie = 'ec_tour=' + v + '; path=/';\n", $noDecl, true],
    ['sessionStorage, which the exemption test treats exactly as a cookie',
        "sessionStorage.setItem('ec_scratch', x);\n", $noDecl, true],
    ['A CONSTANT RESOLVED ONE HOP. The key is never a literal at the call site in real code',
        "var PANE_KEY = 'lpn_wizard';\nlocalStorage.setItem(PANE_KEY, JSON.stringify(s));\n", $noDecl, true],
    ['THE this.x / EngCalcs.x SPLIT. The property is assigned on one receiver and read off another',
        "EngCalcs.myKey = 'ec_undocumented';\nEngCalcs.save = function () {\n  window.localStorage.setItem(this.myKey, '1');\n};\n", $noDecl, true],
    ['AN UNREADABLE WRITE WITH NO DECLARATION -- the escape hatch closing rather than opening',
        "function save(name, v) { localStorage.setItem(name, v); }\n", $noDecl, true],
    ['a declaration naming a key that is no longer a literal in its own file',
        "document.cookie = cookieName() + '=' + v;\n",
        ['js/fixture.js|cookieName()' => ['names' => ['ec_language'], 'literal' => true, 'why' => 'x']], true],
    ['a declaration matching no site at all -- a decision recorded about code that has gone',
        "var x = 1;\n",
        ['js/fixture.js|gone()' => ['names' => ['ec_language'], 'literal' => false, 'why' => 'x']], true],

    // ---- what it must NOT report -------------------------------------------------------------------
    ['a documented key, written plainly',
        "localStorage.setItem('lpn_pane', JSON.stringify(paneState));\n", $noDecl, false],
    ['A READ. getItem is not storage, and the two are one word apart',
        "var raw = localStorage.getItem('ec_never_written_anywhere');\n", $noDecl, false],
    ['A DELETION FROM PHP. ecForgetAnalyticsStorage() expires two cookies in a loop; expiring is not storing',
        "foreach (['ec_blang', EC_SEEN_COOKIE] as \$name) {\n"
        . "    setcookie(\$name, '', ['expires' => time() - 86400, 'path' => '/']);\n}\n", $noDecl, false],
    ['A DELETION FROM JAVASCRIPT, which is the same act in the other language',
        "document.cookie = 'ec_geosearch=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';\n", $noDecl, false],
    ['A COMMENTED-OUT WRITE. This repo comments at length about storage it decided NOT to add',
        "// The obvious build was localStorage.setItem('ec_visited_pages', list) -- rejected,\n"
        . "// because it is durable analytics storage and consent does not cover it.\n"
        . "var x = 1;\n", $noDecl, false],
    ['a documented dynamic family: lpn_project_<id> is built per document',
        "var LPN_PROJECT_PREFIX = 'lpn_project_';\nfunction projectKey(id) { return LPN_PROJECT_PREFIX + id; }\n"
        . "localStorage.setItem(LPN_PROJECT_PREFIX, JSON.stringify(o));\n", $noDecl, false],
    ['a declared dynamic site whose names are documented and still literals in the file',
        "var COOKIE_DEFAULT = 'ec_language';\ndocument.cookie = cookieName() + '=' + v;\n",
        ['js/fixture.js|cookieName()' => ['names' => ['ec_language'], 'literal' => true, 'why' => 'x']], false],
    ['a declared site whose name has no literal, because the name IS the page name',
        "document.cookie = this.cookieName + '=' + this.cookieValue + '; path=/';\n",
        ['js/fixture.js|this.cookieName' => ['names' => ['<PageName>'], 'literal' => false, 'why' => 'x']], false],
];

$fails = 0;
foreach ($cases as [$name, $src, $dynamic, $want]) {
    $got = ecSiFixture($src, $tokens, $dynamic);
    $hit = $got !== [];
    if ($hit !== $want) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted ' . ($want ? 'a finding' : 'no finding') . ', got '
            . ($hit ? count($got) . ': ' . $got[0] : 'none') . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

// The documentation test itself: an exact name, and a dynamic family matching by prefix. Getting
// the second wrong in the permissive direction would let ANY lpn_ key through.
$docCases = [
    ['lpn_pane', true], ['lpn_project_', true], ['<PageName>', true],
    ['lpn_secret', false], ['lpn_', true], ['ec_new', false],
];
foreach ($docCases as [$n, $want]) {
    $got = ecStorageDocumented($n, $tokens);
    if ($got !== $want) {
        $fails++;
        echo "  FAIL ecStorageDocumented('$n') returned " . var_export($got, true)
            . ', wanted ' . var_export($want, true) . "\n";
    }
}
if (!$fails) { echo "  ok   the documentation test: exact names, and prefix families by prefix\n"; }

if ($fails) {
    echo "\n$fails fixture(s) failed. storage_inventory_check.php's reach has moved.\n";
    echo "A false negative here means something is on a visitor's device that the inventory, and\n";
    echo "therefore privacy.php, does not know about -- and the consent banner's own sentence is\n";
    echo "only true while that list is complete.\n";
    exit(1);
}
echo "\nStorage inventory selftest OK -- " . (count($cases) + count($docCases))
    . " fixtures, both directions.\n";
exit(0);
