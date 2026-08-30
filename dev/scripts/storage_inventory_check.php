<?php
/**
 * storage_inventory_check.php — every name a shipped file writes to a visitor's device appears in
 * `dev/cookie-storage-inventory.md`. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. The inventory's premise is that it is COMPLETE — it opens by saying it is the
 * first thing any competent adviser will ask for, and it is the document a legal question would be
 * answered from. A key it does not list is not a documentation gap; it is the document being wrong
 * about the only thing it claims.
 *
 * And the cost of getting it wrong is not the bytes. CLAUDE.md states it plainly: the expensive part
 * of new storage is **the sentence in `consent_body` it makes false**, and therefore a banner
 * rewrite, 26 retranslations and an `EC_CONSENT_VERSION` bump that re-asks everybody. That bill is
 * only avoidable if each new item is looked at when it is added — which needs somebody to notice
 * that something was added. Nothing noticed before this check: the file's own header asks the reader
 * to "re-run the inventory" by hand after touching any of seven files.
 *
 * THIS CHECK NEVER ASKS WHETHER SOMETHING SHOULD BE STORED. That is the exemption test in §1 of the
 * inventory, it is a legal judgement, and it belongs to a human. All this asks is whether the thing
 * being stored is WRITTEN DOWN. The two questions are easy to conflate and only one of them is
 * mechanical.
 *
 * WHAT IT READS. Write sites, not names: `setcookie(` in shipped PHP, `document.cookie =` in
 * `js/*.js` and in the PHP that emits inline JavaScript, `localStorage.setItem(` /
 * `sessionStorage.setItem(`, and `indexedDB.open(`. JavaScript comments are BLANKED first
 * (`js_scan.inc.php`), because a commented-out write and a real one are one character apart and
 * this repo comments at length about storage it decided NOT to add — Task 200's rejected
 * visited-page list is discussed for a paragraph in `js/Calculators.lib.js`.
 *
 * A DELETION IS NOT A WRITE. `setcookie($name, '', ...)` with an expiry in the past, and the
 * `expires=Thu, 01 Jan 1970` form in JavaScript, remove storage rather than adding it. They are
 * skipped, which is what keeps `ecForgetAnalyticsStorage()`'s loop from being an unresolvable site.
 *
 * NAMES ARE RESOLVED ONE HOP. A literal is taken as written; an identifier is looked up as
 * `IDENT = '<literal>'` in the same file, which is how every constant here is written. Anything
 * else — a function call, a parameter, a concatenation — is a DYNAMIC SITE and must be DECLARED
 * below with the names it can produce and why. Four exist, they are the interesting ones (the
 * per-page input cookie is named after the page; `lpn_` builds `lpn_project_<id>` per document),
 * and the declaration is the deliverable: a new unresolvable write site fails until somebody says
 * what it stores. Each declared name is then checked against the inventory exactly like a resolved
 * one, and — where the names are literals in that file — checked to still be there, so a
 * declaration cannot outlive the code it describes.
 *
 * DELIBERATELY OUT OF SCOPE: the service worker's Cache Storage (`sw.php`'s `engcalcs-assets`).
 * Caches hold copies of this suite's own files rather than named values about the visitor, the
 * survey row that produced this check names cookies, `localStorage`/`sessionStorage` and IndexedDB,
 * and `sw_manifest_check.php` already governs what may go in there. Widening this check to caches
 * would be a scope decision with a legal flavour, which is Tom's and not a script's.
 *
 * Usage:
 *   php dev/scripts/storage_inventory_check.php
 *
 * Exit 0 = everything written is written down. Exit 1 = something is stored that the inventory,
 * and therefore `privacy.php`, does not know about.
 */

require_once __DIR__ . '/js_scan.inc.php';

/** The inventory this check holds to. */
const EC_STORAGE_INVENTORY = 'dev/cookie-storage-inventory.md';

/**
 * Write sites whose name cannot be read out of the source, with the names each can produce.
 *
 *   Keyed `<file>|<expression>` — the expression as it appears, which is stable across the line
 *   moving. `names` are checked against the inventory like any other. `literal` says whether those
 *   names appear as string literals in that same file; where they do, the check proves it, so a
 *   declaration cannot describe a key that has been renamed out from under it.
 */
const EC_DYNAMIC_STORAGE_SITES = [
    'js/Cookies.lib.js|this.cookieName' => [
        'names'   => ['<PageName>'],
        'literal' => false,
        'why'     => 'the per-calculator input cookie. Its name IS the page name (Manning-Pipe-Flow, '
                   . 'Orifice, ...), supplied by the page, so there is no literal to read. The '
                   . 'inventory lists it as `<PageName>`; it is exempt as user-input storage, '
                   . 'written only after the visitor has typed something.',
    ],
    'js/lpn-search.js|cookieName()' => [
        'names'   => ['ec_geosearch'],
        'literal' => true,
        'why'     => 'the place-name search consent record. The name comes from pageConfig so a '
                   . 'fork can rename it, with COOKIE_DEFAULT as the fallback literal in this file.',
    ],
    'js/lpn-terrain.js|cookieName()' => [
        'names'   => ['ec_terrain'],
        'literal' => true,
        'why'     => 'the elevation-lookup consent record, same shape as the search one and '
                   . 'deliberately a separate cookie: a search says what the visitor TYPED, this '
                   . 'says where their NETWORK IS.',
    ],
    'js/looped-network.js|key' => [
        'names'   => ['lpn_index', 'lpn_identity', 'lpn_project_', 'lpn_document'],
        'literal' => true,
        'why'     => 'writeJSON(key, obj) is the map editor\'s single localStorage write seam. Its '
                   . 'callers pass one of the constants above or projectKey(id), which is '
                   . 'LPN_PROJECT_PREFIX + a per-document id -- the dynamic family the inventory '
                   . 'lists as `lpn_project_<id>`. The other keys (lpn_pane, lpn_rpane, lpn_setbox, '
                   . 'lpn_show_titles) write through setItem directly and are read from the source.',
    ],
];

/**
 * Names the inventory lists that nothing writes any more. Not failures — a row can legitimately
 * record something REMOVED, and one does.
 */
const EC_STORAGE_HISTORICAL = [
    'PHPSESSID' => 'removed outright by Task 288. The row is struck through and kept so the removal '
                 . 'is a record rather than a silence.',
];

/**
 * Every write site found in one file's source.
 *
 * @param string $file Repo-relative name, used in messages.
 * @param string $src  Source with JS comments already blanked.
 * @return array<int,array{kind:string,expr:string,line:int}>
 */
function ecStorageWriteSites(string $file, string $src): array
{
    $sites = [];
    $lines = explode("\n", $src);
    foreach ($lines as $i => $line) {
        $n = $i + 1;

        // setcookie(NAME, VALUE, ...) -- PHP. An empty VALUE is a deletion.
        if (preg_match('/\bsetcookie\s*\(\s*([^,]+?)\s*,\s*(.*)$/', $line, $m)) {
            if (!preg_match("/^(''|\"\")\s*,/", $m[2])) {
                $sites[] = ['kind' => 'cookie', 'expr' => trim($m[1]), 'line' => $n];
            }
        }

        // document.cookie = NAME + ... -- JS, in a .js file or inlined by PHP.
        if (preg_match('/document\.cookie\s*=\s*(.+)$/', $line, $m)) {
            if (strpos($m[1], 'expires=Thu, 01 Jan 1970') === false) {
                $expr = preg_split('/\s*\+/', $m[1])[0];
                $sites[] = ['kind' => 'cookie', 'expr' => trim(rtrim(trim($expr), ';')), 'line' => $n];
            }
        }

        // localStorage / sessionStorage.
        if (preg_match('/\b(local|session)Storage\s*\.\s*setItem\s*\(\s*([^,]+?)\s*,/', $line, $m)) {
            $sites[] = ['kind' => $m[1] . 'Storage', 'expr' => trim($m[2]), 'line' => $n];
        }

        // IndexedDB.
        if (preg_match('/\bindexedDB\s*\.\s*open\s*\(\s*([^,)]+?)\s*[,)]/', $line, $m)) {
            $sites[] = ['kind' => 'indexedDB', 'expr' => trim($m[1]), 'line' => $n];
        }
    }
    foreach ($sites as &$s) { $s['file'] = $file; }
    return $sites;
}

/**
 * Resolve a name expression to a literal, one hop, within its own file.
 *
 * @return string|null The name, or null if the expression is dynamic.
 */
function ecResolveStorageName(string $expr, string $src): ?string
{
    // A literal, possibly carrying the '=' that starts a cookie assignment string.
    if (preg_match('/^([\'"])(.*)\1$/s', $expr, $m)) {
        return rtrim($m[2], '=');
    }
    // An identifier: EngCalcs.x, LPN_PANE_KEY, $name, EC_SEEN_COOKIE.
    if (!preg_match('/^\$?[A-Za-z_][A-Za-z0-9_.$]*$/', $expr)) {
        return null;
    }
    $bare = preg_quote($expr, '/');
    // JS/PHP assignment, and PHP define().
    if (preg_match('/(?:^|[^A-Za-z0-9_.$])' . $bare . '\s*=\s*([\'"])(.*?)\1\s*;/', $src, $m)) {
        return $m[2];
    }
    if (preg_match('/\bdefine\s*\(\s*([\'"])' . $bare . '\1\s*,\s*([\'"])(.*?)\2/', $src, $m)) {
        return $m[3];
    }
    // `this.bpnTogglesKey` is assigned as `EngCalcs.bpnTogglesKey = '...'`. The receiver differs at
    // the two ends of the same property, so match on the PROPERTY. Only one hop, and only when the
    // property name is distinctive enough to have one assignment: two would be ambiguous and are
    // therefore treated as unresolvable rather than guessed at.
    if (strpos($expr, '.') !== false) {
        $prop = preg_quote(substr($expr, strrpos($expr, '.') + 1), '/');
        if (preg_match_all('/\.' . $prop . '\s*=\s*([\'"])(.*?)\1\s*;/', $src, $m) === 1) {
            return $m[2][0];
        }
    }
    return null;
}

/** Is $name covered by the inventory's set of backticked tokens? */
function ecStorageDocumented(string $name, array $tokens): bool
{
    if (in_array($name, $tokens, true)) { return true; }
    // A prefix family: 'lpn_project_' is documented by the row 'lpn_project_<id>'.
    if (substr($name, -1) === '_') {
        foreach ($tokens as $t) {
            if (strncmp($t, $name, strlen($name)) === 0) { return true; }
        }
    }
    return false;
}

/**
 * Every finding. Pure, for the selftest.
 *
 * @param array<string,string> $sources file => source (JS already blanked).
 * @param array<int,string>    $tokens  backticked tokens found in the inventory.
 * @param array<string,array>  $dynamic EC_DYNAMIC_STORAGE_SITES.
 * @return array{problems:array<int,string>,names:array<string,array<int,string>>}
 */
function ecStorageFindings(array $sources, array $tokens, array $dynamic): array
{
    $problems = [];
    $names = [];
    $usedDeclarations = [];

    foreach ($sources as $file => $src) {
        foreach (ecStorageWriteSites($file, $src) as $site) {
            $where = $file . ':' . $site['line'];
            $name = ecResolveStorageName($site['expr'], $src);

            if ($name === null) {
                $decl = $file . '|' . $site['expr'];
                if (!isset($dynamic[$decl])) {
                    $problems[] = "UNDECLARED DYNAMIC WRITE at $where: {$site['kind']} name comes "
                        . "from `{$site['expr']}`, which this check cannot read. Add "
                        . "'$decl' to EC_DYNAMIC_STORAGE_SITES in storage_inventory_check.php, "
                        . 'listing the names it can produce and why -- and make sure every one of '
                        . 'them is in ' . EC_STORAGE_INVENTORY . '. If the name could just be a '
                        . 'constant, that is the better fix: a storage name nobody can read from '
                        . 'the source is one nobody can audit either.';
                    continue;
                }
                $usedDeclarations[$decl] = true;
                foreach ($dynamic[$decl]['names'] as $n) {
                    $names[$n][] = $where . ' (declared)';
                    if ($dynamic[$decl]['literal'] && strpos($src, "'" . $n) === false
                            && strpos($src, '"' . $n) === false) {
                        $problems[] = "the declaration for $decl names '$n', and that string is no "
                            . "longer a literal in $file. Either the key was renamed -- rename it "
                            . 'here and in ' . EC_STORAGE_INVENTORY . ' -- or the declaration has '
                            . 'outlived the code it describes.';
                    }
                }
                continue;
            }

            if ($name === '') { continue; }
            $names[$name][] = $where;
        }
    }

    foreach ($names as $name => $sites) {
        if (!ecStorageDocumented($name, $tokens)) {
            $problems[] = "UNDOCUMENTED STORAGE '$name', written at " . implode(', ', $sites)
                . ", and absent from " . EC_STORAGE_INVENTORY . ". That file's premise is that it "
                . 'is COMPLETE -- it is what a privacy question would be answered from, and '
                . 'privacy.php is written from it. Add a row saying what it holds, which file '
                . 'writes it, and which limb of the exemption test in §1 it passes. Do NOT change '
                . 'what is stored to make this pass; if the answer is that it fails the test, that '
                . 'is a decision for a human and an expensive one.';
        }
    }

    foreach ($dynamic as $decl => $d) {
        if (!isset($usedDeclarations[$decl])) {
            $problems[] = "the dynamic-write declaration '$decl' matches no write site any more. "
                . 'The decision it records is about code that has moved or gone. Delete it, or '
                . 'point it at the site as it is written now.';
        }
    }

    ksort($names);
    return ['problems' => $problems, 'names' => $names];
}

if (defined('STORAGE_INVENTORY_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

$sources = [];
foreach (glob($root . '/js/*.js') as $f) {
    $sources[substr($f, strlen($root) + 1)] = ecReadJsCode($f);
}
foreach (array_merge(glob($root . '/*.php'), glob($root . '/lib/*.php')) as $f) {
    $sources[substr($f, strlen($root) + 1)] = (string) file_get_contents($f);
}
if (!$sources) {
    echo "storage_inventory_check.php read no shipped source at all. That is a broken check, not a\n";
    echo "clean tree: the globs or the repository layout have moved.\n";
    exit(1);
}

$inventory = (string) @file_get_contents($root . '/' . EC_STORAGE_INVENTORY);
if ($inventory === '') {
    echo 'storage_inventory_check.php cannot read ' . EC_STORAGE_INVENTORY . ". Everything below\n";
    echo "depends on it; there is nothing to check against.\n";
    exit(1);
}
preg_match_all('/`([^`\n]+)`/', $inventory, $m);
$tokens = array_values(array_unique($m[1]));

$f = ecStorageFindings($sources, $tokens, EC_DYNAMIC_STORAGE_SITES);
$problems = $f['problems'];

if ($problems) {
    echo 'Storage inventory: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "This check never asks whether something SHOULD be stored -- that is the exemption test in\n";
    echo EC_STORAGE_INVENTORY . " §1 and it belongs to a person. It asks only whether what is\n";
    echo "stored is written down, because the inventory is what privacy.php is written from and\n";
    echo "the consent banner's own sentence is only true while it is complete.\n";
    exit(1);
}

// A row for something nothing writes is legitimate when it records a REMOVAL, and one does. Listed,
// never failed: deciding that a row is stale rather than historical is a judgement.
$stale = [];
foreach ($tokens as $t) {
    if (!preg_match('/^(ec_[a-z]+|lpn_[a-z_]+|engcalcs-[a-z-]+|PHPSESSID)$/', $t)) { continue; }
    if (isset($f['names'][$t])) { continue; }
    if (isset($f['names'][$t . '_'])) { continue; }
    if (isset(EC_STORAGE_HISTORICAL[$t])) { continue; }
    $stale[] = $t;
}

echo 'Storage inventory OK -- ' . count($f['names']) . ' storage name(s) written by shipped code, '
    . 'every one of them in ' . EC_STORAGE_INVENTORY . ' (' . count(EC_DYNAMIC_STORAGE_SITES)
    . " declared dynamic write sites).\n";
if ($stale) {
    echo 'NOTE: storage-shaped names in the inventory that no shipped file writes: '
        . implode(', ', $stale) . ".\n";
    echo "      Each is either read-only (a legacy key we migrate off), removed and recorded, or a\n";
    echo "      row that has gone stale. Which one it is takes a person, so this never fails.\n";
}
exit(0);
