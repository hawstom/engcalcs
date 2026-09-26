<?php
/**
 * EVERY EDITABLE TABLE COLUMN IS ALSO A FIND PROPERTY FOR ITS ELEMENT'S GROUP.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * ROADMAP Task 708. Tom, 2026-09-22, on Task 705: *"Show at all zoom levels does not appear for
 * Text in multi-properties. Should we do an audit to ensure that all properties are represented
 * in all venues?"* Yes -- and this is the half of that audit a script can hold, once
 * table_column_parity_check.php has already made the Properties popup, the Tables pane and the
 * multi-properties box (which derives its sections from paneTables()) agree with each other. What
 * that check does NOT see is Find and replace, a THIRD editor of the same document, built from a
 * separate list in findPropDefs() -- so a property can ship in the popup, the table and the
 * multi-properties box, and still be unreachable by a saved search or a bulk edit, which is
 * exactly the shape of gap Tom's question was asking about.
 *
 * dev/property-venue-matrix.md is the full audit, across every venue, most of it read by hand.
 * THIS SCRIPT HOLDS ONLY THE ONE SLICE THAT CAN BE DERIVED FROM SOURCE: a table column with a
 * `set:` in it (an editable cell) against the property list findPropDefs() offers for that
 * element's GROUP (node, link or customer -- see the limitation below).
 *
 * THE IDENTITY COMPARED IS THE INTERNAL KEY, NOT THE LABEL -- unlike table_column_parity_check.php.
 * findPropDefs() offers a property by its internal name ('elev', 'diameter'), never by the words
 * beside it, so this walk reads each column's own `key:` rather than its `label:`, resolving a
 * bound parameter (`key: key`, the way paneColNodeResult(key, label, unit) carries it through)
 * back to the literal the call site supplied, exactly as the sibling check resolves a label.
 *
 * HOW A COLUMN'S EDITABILITY IS READ. buildPaneTables() writes an editable cell as a literal
 * object carrying both `key:` and `set:`, or as a call to a paneCol* helper -- and a helper's
 * own body either writes `set:` or it never will, because the helper is one static function, not
 * one instantiated per call with different behaviour. So a literal's `set:` is read from the
 * SPAN of its own enclosing `{ ... }` (found by walking outward from `key:` to the nearest
 * preceding `{`, then to that brace's own match), and a helper call's `set:` is read once from
 * the helper's whole body and reused for every call to it.
 *
 * HOW A GROUP'S FIND PROPERTIES ARE READ. findPropDefs() offers three shapes: the generic rows
 * (id, description, tag, connection) pushed near the top and bottom of the function; the two
 * bands BAND_NODE/RESULT_NODE (offered only for `d.group === 'node'`) and BAND_LINK/RESULT_LINK
 * (offered only for `d.group === 'link'`); and the customer group's own `out.push([...])` block.
 * The node/link association is the one thing this script does not derive -- it is stated in the
 * ternary `d.group === 'node' ? BAND_NODE : BAND_LINK` -- so a REGEX ASSERTS that ternary is still
 * there in that form, and the check refuses to run rather than silently reading nothing if it
 * changes.
 *
 * **WHAT THIS CANNOT SEE, SAID PLAINLY:**
 *   - GROUP LEVEL ONLY, not per-type. findPropDefs() gates a handful of rows by `n.type` inside
 *     the `offer()` helper (fireFlow and demandCategory to junctions only, the reaction pair to
 *     pipes only), but most of its gating is by GROUP. A column that only a subtype's table
 *     carries (a tank's mixing model, a pump's curve, a valve's setting) is compared against the
 *     whole group's Find list, so a gap here means "no element of this GROUP can find it," not
 *     "this one subtype cannot." That coarser question is still one a visitor can hit -- Tom's own
 *     report was exactly a subtype gap (Text, inside the `label` group) -- and dev/property-
 *     venue-matrix.md carries the per-type judgement calls this script cannot make.
 *   - TEXT AND CUSTOMER TABLES ARE COUNTED BUT NOT GATED THE SAME WAY: the `label` group's Find
 *     list is the two rows findPropDefs() offers a Text (`text`, `sizeMult`); the `customer`
 *     group's is its own explicit list. Neither has a BAND_* pair to assert against, so both are
 *     read straight off their `out.push([...])` calls.
 *   - A CUSTOM PROPERTY is column-built at run time (paneCols() adds one per doc.customProps
 *     entry) and Find offers one through findOfferCustom() the same way -- neither side has a
 *     static literal for this scan to compare, so custom properties are outside its reach in
 *     both directions and are not counted as gaps or as matches.
 *   - WHETHER A GAP IS A DEFECT OR CORRECT BY DESIGN is Tom's judgement, ranked in dev/property-
 *     venue-matrix.md. This script only counts them and lets EC_VENUE_EXEMPT stand for the ones
 *     already ruled on, with a reason each -- and, as in table_column_parity_check.php, A
 *     DECLARATION MATCHING NOTHING FAILS, so an exemption nobody can trip does not survive.
 *
 * **ADVISORY**, unlike its sibling: this is the audit's first pass, not a ratchet at zero, and the
 * matrix it is modelled on lists real, undecided gaps. The SELFTEST is blocking regardless, for
 * the reason table_column_parity_selftest.php gives for its own: every way this can quietly stop
 * working makes the count SMALLER, which reads exactly like progress on the task it serves.
 */

const EC_VENUE_ADVISORY = true;

/**
 * Table/Find pairs that are NOT findings, keyed `<type>/<label identity>`, with the reason each.
 * A declaration matching nothing FAILS -- see the docblock.
 */
const EC_VENUE_EXEMPT = [
    // **RULED, NOT A GAP.** findPropDefs() states this in its own comment: a Text's id is
    // unreachable from every screen in the app, so offering it in Find would be a condition that
    // silently matches nothing (Tom, 2026-08-29: *"Text.ID 2 highest finds nothing... Is this a UI
    // bug?"* -- it was, and findPropDefs() was rebuilt to stop seeding `id` for a label's scope).
    'text/id' => 'a Text has no id reachable from any screen; findPropDefs() deliberately does not offer one',
    // **A KEY-NAME MISMATCH, NOT A GAP** (Task 708, ranked gap #2, closed). The table's checkbox
    // column is keyed `closed` (paneColClosed()); Find and Replace offer the identical underlying
    // property -- `effective(l, 'status')`, written through the same `setProp(l, 'status', ...)`
    // -- under the name `status`, matching linkStatusOf()'s and the Labels panel's own name for
    // it rather than the checkbox's inverted one. This script's identity match is on the literal
    // `key:`, so it cannot see that `closed` and `status` are two names for one property; a person
    // typing `Pipe.Status equal to closed` gets exactly what `pipe/closed` asks for.
    'pipe/closed' => "findable and replaceable under Find's own name for it, 'status' -- see the note above",
    'pump/closed' => "findable and replaceable under Find's own name for it, 'status' -- see the note above",
    'valve/closed' => "findable and replaceable under Find's own name for it, 'status' -- see the note above",
];

define('EC_TABLE_PARITY_LIB_ONLY', 1);
require_once __DIR__ . '/table_column_parity_check.php';

// The selftest requires this file for its pure functions, after the require above has already
// defined them; loading it that way must not also run the check.
if (defined('EC_VENUE_LIB_ONLY')) { return; }

/**
 * The internal property KEY a `key:` expression names -- a literal quoted string directly, or,
 * where the expression is just one of the caller's own bound parameters (`key: key`, the way
 * paneColNodeResult(key, label, unit) carries it through), the literal that call site supplied.
 * Null where neither resolves, which the caller must count rather than guess at.
 */
function ecKeyIdentity(string $expr, array $subst): ?string
{
    $expr = rtrim(trim($expr), " \t}]),;");
    if (isset($subst[$expr])) { $expr = rtrim(trim($subst[$expr]), " \t}]),;"); }
    if (preg_match('/^\'([A-Za-z0-9_]+)\'$/', $expr, $m)) { return $m[1]; }
    return null;
}

/**
 * Every column in one table region, as [key identity|null, editable]. Matches Find's own
 * property KEYS ('elev', 'diameter', ...) rather than the language key its label carries --
 * findPropDefs() offers rows by internal key, not by wording.
 *
 * @return array<int,array{0:?string,1:bool}>
 */
function ecColumnKeysEd(array $fns, string $src, array $subst, array &$seen): array
{
    $out = [];
    if (preg_match_all('/\bkey:\s*([^,\n]+)/', $src, $m, PREG_OFFSET_CAPTURE)) {
        foreach ($m[1] as $i => $hit) {
            $id = ecKeyIdentity($hit[0], $subst);
            $editable = true;
            $braceStart = strrpos(substr($src, 0, $m[0][$i][1]), '{');
            if ($braceStart !== false) {
                $braceEnd = ecJsBlockEnd($src, $braceStart);
                if ($braceEnd !== null) {
                    $editable = (bool) preg_match('/\bset:/', substr($src, $braceStart, $braceEnd - $braceStart + 1));
                }
            }
            $out[] = [$id, $editable];
        }
    }
    if (preg_match_all('/\b(paneCol[A-Za-z0-9_]*|paneTextCols)\s*\(/', $src, $m, PREG_OFFSET_CAPTURE)) {
        foreach ($m[1] as $i => $hit) {
            $name = $hit[0];
            if (!isset($fns[$name])) { continue; }
            $args = ecJsCallArgs($src, $m[0][$i][1] + strlen($m[0][$i][0]) - 1) ?? [];
            $key = $name . '(' . implode('|', $args) . ')';
            if (isset($seen[$key])) { continue; }
            $seen[$key] = true;
            $sub = [];
            foreach ($fns[$name]['params'] as $pi => $pname) {
                $sub[$pname] = isset($args[$pi]) ? trim($args[$pi]) : '';
            }
            foreach (ecColumnKeysEd($fns, $fns[$name]['body'], $sub, $seen) as $pair) { $out[] = $pair; }
        }
    }
    return $out;
}

/**
 * Editable column identities per element type, reusing buildPaneTables()'s own table boundaries.
 *
 * @return array<string,array<string,bool>>
 */
function ecEditableColumns(array $fns): array
{
    $body = $fns['buildPaneTables']['body'];
    preg_match_all('/\bid:\s*\'([a-z]+)\',\s*panel:/', $body, $m, PREG_OFFSET_CAPTURE);
    $starts = [];
    foreach ($m[0] as $i => $hit) { $starts[] = ['at' => $hit[1], 'id' => $m[1][$i][0]]; }
    $out = [];
    foreach ($starts as $i => $s) {
        $end = isset($starts[$i + 1]) ? $starts[$i + 1]['at'] : strlen($body);
        $region = substr($body, $s['at'], $end - $s['at']);
        if (!preg_match('/\btype:\s*\'([a-z]+)\'/', $region, $tm)) { continue; }
        $seen = [];
        $ids = [];
        foreach (ecColumnKeysEd($fns, $region, [], $seen) as [$id, $editable]) {
            if ($id === null || !$editable) { continue; }
            $ids[$id] = true;
        }
        $out[$tm[1]] = $ids;
    }
    return $out;
}

/** First-quoted key of every `['key', ...]` row inside one bracketed array literal's text. */
function ecArrayRowKeys(string $arraySrc): array
{
    preg_match_all('/\[\s*\'([A-Za-z0-9_]+)\'/', $arraySrc, $m);
    return $m[1];
}

/** The text of `var $name = [ ... ];` (top-level bracket matching), or null. */
function ecNamedArray(string $body, string $name): ?string
{
    if (!preg_match('/var\s+' . preg_quote($name, '/') . '\s*=\s*\[/', $body, $m, PREG_OFFSET_CAPTURE)) {
        return null;
    }
    $open = $m[0][1] + strlen($m[0][0]) - 1;
    // Bracket-match by hand: the same engine as ecJsBlockEnd(), on `[` `]` instead of `{` `}`.
    $n = strlen($body); $depth = 0; $quote = null; $close = null;
    for ($p = $open; $p < $n; $p++) {
        $ch = $body[$p];
        if ($quote !== null) {
            if ($ch === '\\') { $p++; continue; }
            if ($ch === $quote) { $quote = null; }
            continue;
        }
        if ($ch === "'" || $ch === '"') { $quote = $ch; continue; }
        if ($ch === '[') { $depth++; } elseif ($ch === ']') { $depth--; if ($depth === 0) { $close = $p; break; } }
    }
    if ($close === null) { return null; }
    return substr($body, $open, $close - $open + 1);
}

/**
 * The Find property keys findPropDefs() offers for each of the four scopes it recognises.
 *
 * @return array{node:string[],link:string[],customer:string[],label:string[],problems:string[]}
 */
function ecFindKeysByGroup(array $fns): array
{
    $problems = [];
    if (!isset($fns['findPropDefs'])) {
        return ['node' => [], 'link' => [], 'customer' => [], 'label' => [],
            'problems' => ['findPropDefs() is gone: this check can no longer read Find\'s property list.']];
    }
    $body = $fns['findPropDefs']['body'];

    // The `label` (Text) group returns early; the `customer` group returns early too. Both blocks
    // are read whole, up to their own `return out;`, so the generic code below them is never
    // mistaken for either scope's list.
    $labelKeys = $customerKeys = [];
    if (preg_match('/if\s*\(d\.group === \'label\'\)\s*\{(.*?)\n\t\t\treturn out;/s', $body, $m)) {
        $labelKeys = ecArrayRowKeys($m[1]);
    } else {
        $problems[] = 'the Text (`label` group) branch of findPropDefs() was not found in the expected shape.';
    }
    if (preg_match('/if\s*\(d\.group === \'customer\'\)\s*\{(.*?)\n\t\t\treturn out;/s', $body, $m)) {
        $customerKeys = ecArrayRowKeys($m[1]);
    } else {
        $problems[] = 'the Customer (`customer` group) branch of findPropDefs() was not found in the expected shape.';
    }

    // The generic rows every node and link scope carries: `id` (seeded in the initial `out =`),
    // `desc` and `tag` (pushed once, unguarded, for every node/link scope), and `connection`
    // (guarded to `d.key === 'all' || d.group === 'node'`).
    $generic = ['id', 'desc', 'tag'];
    $genericNode = array_merge($generic, ['connection']);
    $genericLink = $generic;

    // **THE ASSOCIATION THIS SCRIPT DOES NOT DERIVE, SO IT IS ASSERTED.** A rename or restructure
    // of this ternary must fail this check rather than silently reading an empty list as parity.
    if (!preg_match('/d\.group === \'node\' \? BAND_NODE : BAND_LINK/', $body)) {
        $problems[] = 'findPropDefs() no longer offers BAND_NODE to the node group and BAND_LINK to '
            . 'the link group through that ternary -- this check is reading nothing.';
    }
    if (!preg_match('/d\.group === \'node\' \? RESULT_NODE : RESULT_LINK/', $body)) {
        $problems[] = 'findPropDefs() no longer offers RESULT_NODE/RESULT_LINK the same way -- '
            . 'this check is reading nothing.';
    }
    $bandNode = ecNamedArray($body, 'BAND_NODE');
    $bandLink = ecNamedArray($body, 'BAND_LINK');
    $resultNode = ecNamedArray($body, 'RESULT_NODE');
    $resultLink = ecNamedArray($body, 'RESULT_LINK');
    if ($bandNode === null || $bandLink === null || $resultNode === null || $resultLink === null) {
        $problems[] = 'one of BAND_NODE/BAND_LINK/RESULT_NODE/RESULT_LINK could not be read whole '
            . 'from findPropDefs() -- this check is reading nothing.';
    }

    $nodeKeys = array_merge($genericNode, ecArrayRowKeys($bandNode ?? ''), ecArrayRowKeys($resultNode ?? ''));
    $linkKeys = array_merge($genericLink, ecArrayRowKeys($bandLink ?? ''), ecArrayRowKeys($resultLink ?? ''));

    return ['node' => $nodeKeys, 'link' => $linkKeys, 'customer' => $customerKeys, 'label' => $labelKeys,
        'problems' => $problems];
}

// ================================ the run =======================================================

$root = dirname(__DIR__, 2);
$js = file_get_contents($root . '/js/looped-network.js');
if ($js === false) { fwrite(STDERR, "cannot read js/looped-network.js\n"); exit(1); }

$fns = ecJsTopLevelFunctions(ecJsBlankComments($js));
if (!isset($fns['buildPaneTables'])) {
    fwrite(STDERR, "buildPaneTables() is gone: this check is reading nothing.\n");
    exit(1);
}

$editable = ecEditableColumns($fns);
$find = ecFindKeysByGroup($fns);
if ($find['problems']) {
    echo "table/Find parity: the check itself is broken\n\n";
    foreach ($find['problems'] as $p) { echo "  $p\n\n"; }
    exit(1);
}

// The table `type` a column belongs to maps to the Find `group` its property is offered under.
// Text and Customer are compared by their own key sets rather than the id/desc/tag/connection
// convention every node and link type shares -- see the docblock's note on what this cannot see.
$typeGroup = [
    'junction' => 'node', 'reservoir' => 'node', 'tank' => 'node',
    'pipe' => 'link', 'pump' => 'link', 'valve' => 'link',
    'text' => 'label', 'customer' => 'customer',
];

$gaps = [];       // "<type>/<id>" => true
$matched = 0;
$total = 0;
foreach ($editable as $type => $ids) {
    $group = $typeGroup[$type] ?? null;
    if ($group === null) { continue; }   // a table this script has no Find mapping for.
    $findIds = $find[$group];
    foreach (array_keys($ids) as $id) {
        $total++;
        $k = "$type/$id";
        if (in_array($id, $findIds, true)) { $matched++; continue; }
        if (array_key_exists($k, EC_VENUE_EXEMPT)) { $matched++; continue; }
        $gaps[$k] = true;
    }
}
foreach (array_keys(EC_VENUE_EXEMPT) as $k) {
    [$t, $id] = array_pad(explode('/', $k, 2), 2, '');
    if (!isset($editable[$t][$id])) {
        fwrite(STDERR, "EC_VENUE_EXEMPT declares `$k` and no editable column of that identity was "
            . "found any more. An exemption nobody can trip is a hole that has stopped being "
            . "watched: delete it.\n");
        exit(1);
    }
}

if ($gaps) {
    printf("table/Find parity (ROADMAP Task 708): %d editable table column(s) with no matching Find property\n\n", count($gaps));
    ksort($gaps);
    foreach (array_keys($gaps) as $k) {
        [$t, $id] = explode('/', $k, 2);
        printf("  %-10s %s\n", $t, $id);
    }
    echo "\nEach is a property a person can type into the Tables pane and cannot find or bulk-replace\n";
    echo "with Find and replace. See dev/property-venue-matrix.md for which of these Tom has ruled\n";
    echo "correct-by-design; declare those in EC_VENUE_EXEMPT in this script with the reason.\n\n";
}
printf("%d editable table column(s) checked across %d element types; %d matched a Find property of "
    . "their group; %d gap(s).\n", $total, count($editable), $matched, count($gaps));

if ($gaps && !EC_VENUE_ADVISORY) { exit(1); }
if ($gaps) { echo "\nADVISORY -- see dev/property-venue-matrix.md for the ranked list.\n"; }
exit(0);
