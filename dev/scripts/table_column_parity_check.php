<?php
/**
 * EVERY PROPERTY IN AN ELEMENT'S POPUP IS ALSO A COLUMN IN THAT ELEMENT'S TABLE.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * ROADMAP Task 690, the spreadsheet-parity half. Tom, 2026-09-14, on the one that had already
 * slipped: *"Initial quality is in no Table and no multi-properties. Embarrassing, and we are
 * committed to finishing it."*
 *
 * WHY IT SLIPS, WHICH IS THE ONLY REASON THIS IS WORTH A SCRIPT. The property popup and the pane
 * table are two editors of one document written in two places, ~20,000 lines apart in
 * js/looped-network.js. Adding a field to the popup is a complete, working, shippable change: the
 * value round-trips through the importer and the exporter, the solve reads it, the map label can
 * print it, and every harness passes. Nothing on this side of the wire knows the table exists. The
 * absence is visible only to somebody who opens the table LOOKING for the property -- which is what
 * Tom did -- and by then it has been translated into 27 languages and shipped.
 *
 * It also fixes the multi-properties box for free, and that is not a coincidence: multiGroups()
 * derives its sections from paneTables(), so a property absent from the table spec is absent from
 * both surfaces by construction. One list, two findings.
 *
 * BOTH SIDES ARE DERIVED FROM THE SOURCE. A typed list of properties is the arrangement that goes
 * stale, and it would go stale in exactly the direction this check exists to catch -- somebody adds
 * a popup field and does not think about the table, which is the same somebody who does not think
 * about a list in dev/scripts/.
 *
 *   THE TABLE SIDE is buildPaneTables(): six declarations of `cols:`, plus the paneCol* helpers
 *   they call, whose `label:` may come from one of their own parameters and is substituted from the
 *   call. paneTextCols() is the seventh table, returned whole.
 *
 *   THE POPUP SIDE is renderNodeFields(), renderLinkFields() and renderLabelFields(), walked
 *   through every helper they hand the popup's `fields` container to. A POPUP ROW BUILDER is
 *   derived, never listed: it is a function whose first parameter is `fields` and which takes a
 *   parameter named `labelText`. The second door is `setFieldLabel()`, which is how a helper that
 *   assembles its own control writes the words beside it. Both doors are asserted to exist, so a
 *   rename fails here rather than reading as parity.
 *
 * WHICH TYPE A ROW BELONGS TO IS READ FROM THE `.type` BRANCHES IT SITS INSIDE. renderNodeFields()
 * is one function serving three kinds of node, so a tank's water depth must not be demanded of a
 * junction. Every `if (n.type === 'tank') { ... } else if ... else ...` chain is resolved into the
 * set of types each branch can be reached for, and a row outside every such chain belongs to all of
 * them. A condition that is not a type test -- `if (reactionFieldsShown())`, `if (qualityMode() ===
 * 'chemical')` -- is deliberately ignored: the table columns carry the same gate in their own
 * `when:`, so the parity question is the same on both sides of it.
 *
 * THE IDENTITY BEING COMPARED IS THE LANGUAGE KEY, and that is the strongest thing available. A
 * popup row and a table column are two controls over one property; what says they are the same
 * property is that they are labelled with the same string, which is also what the reader sees. A
 * label built by a function (roughnessLabel(), which follows the friction method) compares by that
 * function's name, so the pipe's roughness matches on both sides without either naming a key.
 *
 * WHAT IS DECLARED OUT, WITH A REASON EACH, IN EC_TABLE_PARITY_EXEMPT BELOW -- and A DECLARATION
 * MATCHING NOTHING FAILS, which is the house ratchet: an exemption nobody can trip is a hole that
 * has stopped being watched.
 *
 * WHAT THIS CANNOT SEE, SAID PLAINLY RATHER THAN IMPLIED:
 *   - A control a helper builds with neither door -- a bare <th>, as the demand-categories editor
 *     writes its own column headings. Those are counted and printed, not failed.
 *   - A label expression with no key and no function name in it (a bare concatenation). Turned away
 *     and COUNTED, so a scan that has gone blind cannot read as progress.
 *   - Whether the column is any GOOD. A property that is in the table as an unreadable result cell
 *     passes here; that judgement is Tom's.
 *   - The reverse direction. A column with no popup row is not a finding: the tables carry results
 *     the popup shows only after a solve, and Tom has asked for columns the popup does not have.
 *
 * **A RATCHET AT ZERO SINCE 2026-09-19**, which is what it was built to become. It shipped advisory
 * at 28 gaps the day before; Tom read the list and said *"Fix all that was found"*, so all 28 were
 * closed and the flag turned over. It now FAILS THE BUILD on the first popup row that ships without
 * a column of its own -- which is the only state in which it is doing the job, because a number
 * printed beside a green build is a number nobody has to act on.
 */

// **A RATCHET AT ZERO.** See the closing note of the docblock above.
const EC_TABLE_PARITY_ADVISORY = false;

/**
 * Popup rows that are NOT findings, keyed `<type>/<label identity>`, with the reason each.
 *
 * FIVE KINDS, and only the first is "this is deliberately not in the table":
 *   a. NOT A PROPERTY. The scenario override marker is a checkbox ABOUT a row, not a row.
 *   b. ALREADY A COLUMN UNDER A DIFFERENT LABEL. A table heading has to fit a column and a popup
 *      row does not, so several pairs are one property wearing a long name and a short one. The
 *      identity match cannot see that and should not guess at it -- two strings that look alike are
 *      not evidence of one property, which is the whole reason the key is what is compared.
 *   c. A COLUMN BUILT AT RUN TIME. A custom property is a column, made in paneCols() from the
 *      document's own list, so there is no static label for the scan to find.
 *   e. NOT THIS ELEMENT'S PROPERTY AT ALL. A roll-up of other elements that have a table of their
 *      own -- the meters attached to a junction.
 *   d. A LABEL THE SCAN CANNOT RESOLVE. One popup row builder is wrapped in a helper declared
 *      INSIDE its render function, so the label arrives as that helper's parameter and this walk
 *      (which only substitutes across top-level functions) sees the parameter name.
 *
 * A declaration matching nothing FAILS: see the docblock.
 */
const EC_TABLE_PARITY_EXEMPT = [
    // (a) the scenario override marker: a statement about a row, drawn under it in the popup and
    // painted onto the cell in the table. Every type carries it, so every type declares it.
    'junction/lpn_scenario_override' => 'a. the override marker is about a row, not a row',
    'reservoir/lpn_scenario_override' => 'a. the override marker is about a row, not a row',
    'tank/lpn_scenario_override' => 'a. the override marker is about a row, not a row',
    'pipe/lpn_scenario_override' => 'a. the override marker is about a row, not a row',
    'pump/lpn_scenario_override' => 'a. the override marker is about a row, not a row',
    'valve/lpn_scenario_override' => 'a. the override marker is about a row, not a row',
    'text/lpn_scenario_override' => 'a. the override marker is about a row, not a row',
    // (c) custom properties: paneCols() adds one column per doc.customProps entry (the `cp` columns),
    // so they are in every table already and there is no literal for the scan to match.
    'junction/fn:customPropLabel' => 'c. paneCols() builds one cp column per custom property',
    'reservoir/fn:customPropLabel' => 'c. paneCols() builds one cp column per custom property',
    'tank/fn:customPropLabel' => 'c. paneCols() builds one cp column per custom property',
    'pipe/fn:customPropLabel' => 'c. paneCols() builds one cp column per custom property',
    'pump/fn:customPropLabel' => 'c. paneCols() builds one cp column per custom property',
    'valve/fn:customPropLabel' => 'c. paneCols() builds one cp column per custom property',
    'text/fn:customPropLabel' => 'c. paneCols() builds one cp column per custom property',
    // (b) one property, two labels.
    'pipe/fn:pipeTypePropLabel' => 'b. the reaction pair a pipe type owns; the columns are '
        . 'lpn_reaction_bulk_short and lpn_reaction_wall_short',
    'pipe/lpn_field_km' => 'b. the column is lpn_field_km_short',
    'valve/lpn_field_km' => 'b. the column is lpn_field_km_short, which states the rule on a TCV row',
    'tank/lpn_reaction_tank' => 'b. the column is lpn_reaction_tank_short',
    'valve/lpn_field_valve_setting_drop' => 'b. the column is lpn_field_valve_setting, which carries '
        . 'no unit on purpose: a valve setting is a different quantity per type',
    'valve/lpn_field_valve_setting_flow' => 'b. see lpn_field_valve_setting_drop',
    'valve/lpn_field_valve_setting_loss' => 'b. see lpn_field_valve_setting_drop',
    'valve/lpn_field_valve_setting_pressure' => 'b. see lpn_field_valve_setting_drop',
    'text/lpn_field_text_attached' => 'b. an attached Text takes its alignment from its leader; the '
        . 'align and valign columns state that rule in the cell through plainWord/plainTip',
    // (e) not this element's property at all. A junction's Customers line is a ROLL-UP of other
    // elements -- the meters attached to it -- and those have a table of their own, with a row per
    // customer. A column here would be a count in a cell that nothing can edit.
    'junction/lpn_node_customers' => 'e. a roll-up of the Customers table\'s own rows, not a junction property',
    // (d) a label that arrives as a nested helper's parameter.
    'text/fn:labelText' => 'd. alignRow() is declared inside renderLabelFields(); the two rows it '
        . 'builds are the lpn_field_text_align and lpn_field_text_valign columns',
];

/**
 * COMMENTS ARE BLANKED BEFORE ANYTHING ELSE READS THE SOURCE, and this is not tidiness: every brace
 * and quote counter below is a state machine, and js/looped-network.js is 47% comment lines full of
 * apostrophes -- *"the user's"* opens a string literal that runs to the next apostrophe, and the
 * block end of renderNodeFields()'s tank branch then lands hundreds of lines out. Measured: without
 * this, a junction-only row (the emitter coefficient, the required fire flow) was reported as a
 * reservoir's. Offsets are preserved, so a blanked file and the real one agree position for
 * position. A `/` opens a REGEX rather than a comment when what precedes it cannot end an
 * expression, which is how `/['"]/ ` in this page survives the pass.
 */
function ecJsBlankComments(string $js): string
{
    $n = strlen($js);
    $out = $js;
    $i = 0;
    $prev = '';
    while ($i < $n) {
        $ch = $js[$i];
        if ($ch === '/' && $i + 1 < $n && ($js[$i + 1] === '/' || $js[$i + 1] === '*')) {
            $line = ($js[$i + 1] === '/');
            $end = $line ? strpos($js, "\n", $i) : strpos($js, '*/', $i + 2);
            if ($end === false) { $end = $n; } elseif (!$line) { $end += 2; }
            for ($p = $i; $p < $end; $p++) { if ($out[$p] !== "\n") { $out[$p] = ' '; } }
            $i = $end;
            continue;
        }
        if ($ch === "'" || $ch === '"' || $ch === '`') {
            $i++;
            while ($i < $n) {
                if ($js[$i] === '\\') { $i += 2; continue; }
                if ($js[$i] === $ch) { $i++; break; }
                $i++;
            }
            $prev = $ch;
            continue;
        }
        if ($ch === '/' && strpos('(,=:[!&|?{};+return', $prev) !== false) {
            // A regex literal. Skip it whole, so the quotes inside it are not read as strings.
            $i++;
            while ($i < $n) {
                if ($js[$i] === '\\') { $i += 2; continue; }
                if ($js[$i] === '[') { while ($i < $n && $js[$i] !== ']') { $i += ($js[$i] === '\\') ? 2 : 1; } }
                if ($js[$i] === '/') { $i++; break; }
                if ($js[$i] === "\n") { break; }
                $i++;
            }
            $prev = '/';
            continue;
        }
        if (!preg_match('/\s/', $ch)) { $prev = $ch; }
        $i++;
    }
    return $out;
}

/**
 * Every top-level `\tfunction name(params) {` in one JavaScript file, with its parameter names and
 * its body text.
 *
 * Pure, so table_column_parity_selftest.php can put fixtures through it.
 *
 * @return array<string,array{params:string[],body:string,at:int}>
 */
function ecJsTopLevelFunctions(string $js): array
{
    preg_match_all('/\n\tfunction ([A-Za-z0-9_$]+)\(([^)]*)\)\s*\{/', $js, $m, PREG_OFFSET_CAPTURE);
    $out = [];
    $n = strlen($js);
    foreach ($m[0] as $i => $hit) {
        $start = $hit[1] + strlen($hit[0]);
        $depth = 1;
        for ($p = $start; $p < $n; $p++) {
            if ($js[$p] === '{') { $depth++; }
            elseif ($js[$p] === '}') { $depth--; if ($depth === 0) { break; } }
        }
        $params = trim($m[2][$i][0]) === '' ? [] : array_map('trim', explode(',', $m[2][$i][0]));
        $out[$m[1][$i][0]] = ['params' => $params, 'body' => substr($js, $start, $p - $start), 'at' => $start];
    }
    return $out;
}

/**
 * The arguments of the call to `$name` beginning at `$from` in `$src`, as raw text, split on
 * top-level commas. Returns null where there is no such call.
 *
 * @return string[]|null
 */
function ecJsCallArgs(string $src, int $open): ?array
{
    $n = strlen($src);
    $depth = 0; $args = []; $cur = ''; $q = null;
    for ($p = $open; $p < $n; $p++) {
        $ch = $src[$p];
        if ($q !== null) {
            $cur .= $ch;
            if ($ch === '\\') { if ($p + 1 < $n) { $cur .= $src[$p + 1]; $p++; } continue; }
            if ($ch === $q) { $q = null; }
            continue;
        }
        if ($ch === "'" || $ch === '"') { $q = $ch; $cur .= $ch; continue; }
        if ($ch === '(' || $ch === '[' || $ch === '{') {
            $depth++;
            if ($depth === 1) { continue; }
        } elseif ($ch === ')' || $ch === ']' || $ch === '}') {
            $depth--;
            if ($depth === 0) { $args[] = trim($cur); return $args; }
        }
        if ($depth === 1 && $ch === ',') { $args[] = trim($cur); $cur = ''; continue; }
        $cur .= $ch;
    }
    return null;
}

/**
 * The identity a label expression carries: a `$ec_lang` key where it names one, otherwise the name
 * of the function that produces the words. Null where the expression carries neither, in which case
 * the caller counts it as unresolvable rather than as a finding.
 */
function ecLabelIdentity(string $expr): ?string
{
    // A `label:` entry is read up to the end of its line, so it can arrive with the rest of the
    // object literal trailing it (`'lpn_field_elev' }]`). Those closers are never part of a label.
    $expr = trim($expr);
    if (preg_match('/\bpc\.([A-Za-z0-9_]+)/', $expr, $m)) { return $m[1]; }
    if (preg_match('/\bpc\[\s*\'([^\']+)\'\s*\]/', $expr, $m)) { return $m[1]; }
    $expr = rtrim($expr, " \t}]),;");
    if (preg_match('/^\'([A-Za-z0-9_]+)\'$/', $expr, $m)) { return $m[1]; }
    if (preg_match('/^([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/', $expr, $m)) { return 'fn:' . $m[1]; }
    if (preg_match('/^([A-Za-z_$][A-Za-z0-9_$]*)$/', $expr, $m)) { return 'fn:' . $m[1]; }
    return null;
}

/**
 * Every if / else-if / else chain in one function body, as a flat list of branches with the offsets
 * they cover. Nested chains are found too; a chain is walked once, so an `else if` is never also
 * read as the head of a chain of its own.
 *
 * @return array<int,array{cond:?string,start:int,end:int,chain:int}>
 */
function ecJsBranches(string $body): array
{
    $n = strlen($body);
    $out = [];
    $consumed = [];
    $chainNo = 0;
    for ($i = 0; $i < $n - 2; $i++) {
        if (substr($body, $i, 2) !== 'if') { continue; }
        if ($i > 0 && preg_match('/[A-Za-z0-9_$]/', $body[$i - 1])) { continue; }
        if (!preg_match('/^\s*\(/', substr($body, $i + 2, 40))) { continue; }
        if (isset($consumed[$i])) { continue; }
        $chainNo++;
        $p = $i;
        while (true) {
            $open = strpos($body, '(', $p);
            if ($open === false) { break; }
            $cond = ecJsCallArgs($body, $open);
            if ($cond === null) { break; }
            // Re-find the close paren, then the block.
            $depth = 0; $q = $open; $close = null; $quote = null;
            for (; $q < $n; $q++) {
                $ch = $body[$q];
                if ($quote !== null) {
                    if ($ch === '\\') { $q++; continue; }
                    if ($ch === $quote) { $quote = null; }
                    continue;
                }
                if ($ch === "'" || $ch === '"') { $quote = $ch; continue; }
                if ($ch === '(') { $depth++; }
                elseif ($ch === ')') { $depth--; if ($depth === 0) { $close = $q; break; } }
            }
            if ($close === null) { break; }
            $brace = strpos($body, '{', $close);
            if ($brace === false || trim(substr($body, $close + 1, $brace - $close - 1)) !== '') { break; }
            $end = ecJsBlockEnd($body, $brace);
            if ($end === null) { break; }
            $out[] = ['cond' => implode(',', $cond), 'start' => $brace, 'end' => $end, 'chain' => $chainNo];
            // else / else if
            $rest = substr($body, $end + 1, 40);
            if (!preg_match('/^\s*else\b/', $rest, $em)) { break; }
            $elseAt = $end + 1 + strpos($rest, 'else');
            $after = substr($body, $elseAt + 4, 40);
            if (preg_match('/^\s*if\b/', $after)) {
                $ifAt = $elseAt + 4 + strpos($after, 'if');
                $consumed[$ifAt] = true;
                $p = $ifAt;
                continue;
            }
            $brace = strpos($body, '{', $elseAt);
            if ($brace === false) { break; }
            $end2 = ecJsBlockEnd($body, $brace);
            if ($end2 === null) { break; }
            $out[] = ['cond' => null, 'start' => $brace, 'end' => $end2, 'chain' => $chainNo];
            break;
        }
    }
    return $out;
}

/** The offset of the `}` matching the `{` at $open, or null. */
function ecJsBlockEnd(string $s, int $open): ?int
{
    $n = strlen($s); $depth = 0; $quote = null;
    for ($p = $open; $p < $n; $p++) {
        $ch = $s[$p];
        if ($quote !== null) {
            if ($ch === '\\') { $p++; continue; }
            if ($ch === $quote) { $quote = null; }
            continue;
        }
        if ($ch === "'" || $ch === '"') { $quote = $ch; continue; }
        if ($ch === '{') { $depth++; }
        elseif ($ch === '}') { $depth--; if ($depth === 0) { return $p; } }
    }
    return null;
}

/**
 * Which element types a position in a function body can be reached for, given the `.type` branches
 * enclosing it. A chain with no type test in it constrains nothing.
 *
 * @param string[] $all every type this render function serves
 * @return string[]
 */
function ecTypesAt(array $branches, int $pos, array $all): array
{
    $types = $all;
    $chains = [];
    foreach ($branches as $b) { $chains[$b['chain']][] = $b; }
    foreach ($chains as $chain) {
        $isTypeChain = false;
        foreach ($chain as $b) {
            if ($b['cond'] !== null && preg_match('/\.type\s*[!=]==\s*\'/', $b['cond'])) { $isTypeChain = true; }
        }
        if (!$isTypeChain) { continue; }
        $positives = [];
        foreach ($chain as $b) {
            if ($b['cond'] !== null && preg_match('/\.type\s*===\s*\'([A-Za-z0-9_]+)\'/', $b['cond'], $m)) {
                $positives[] = $m[1];
            }
        }
        foreach ($chain as $b) {
            if ($pos < $b['start'] || $pos > $b['end']) { continue; }
            if ($b['cond'] === null) {
                $types = array_values(array_diff($types, $positives));
            } elseif (preg_match('/\.type\s*===\s*\'([A-Za-z0-9_]+)\'/', $b['cond'], $m)) {
                $types = array_values(array_intersect($types, [$m[1]]));
            } elseif (preg_match('/\.type\s*!==\s*\'([A-Za-z0-9_]+)\'/', $b['cond'], $m)) {
                $types = array_values(array_diff($types, [$m[1]]));
            }
        }
    }
    return $types;
}

/**
 * Substitute a caller's argument text where a label expression is just one of the callee's own
 * parameter names -- how curveChooser() and paneColNodeResult() both carry a label through.
 */
function ecSubst(string $expr, array $subst): string
{
    $t = trim($expr);
    if (preg_match('/^[A-Za-z_$][A-Za-z0-9_$]*$/', $t) && isset($subst[$t])) { return $subst[$t]; }
    return $expr;
}

/**
 * Every `label:` a column declaration carries, resolving the paneCol* helpers it calls. Returns
 * label identities; an unresolvable expression contributes null and is counted by the caller.
 *
 * @return array<int,?string>
 */
function ecColumnLabels(array $fns, string $src, array $subst, array &$seen): array
{
    $out = [];
    // The literal `label:` entries in this stretch of source.
    if (preg_match_all('/\blabel:\s*([^,\n]+)/', $src, $m)) {
        foreach ($m[1] as $expr) { $out[] = ecLabelIdentity(ecSubst($expr, $subst)); }
    }
    // The helpers it calls, resolved with their arguments bound.
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
                $sub[$pname] = isset($args[$pi]) ? ecSubst($args[$pi], $subst) : '';
            }
            foreach (ecColumnLabels($fns, $fns[$name]['body'], $sub, $seen) as $id) { $out[] = $id; }
        }
    }
    return $out;
}

/**
 * The seven pane tables, as element type => set of column label identities.
 *
 * @return array{tables:array<string,array<string,bool>>,unresolved:int}
 */
function ecTableColumns(array $fns): array
{
    if (!isset($fns['buildPaneTables'])) {
        throw new RuntimeException('buildPaneTables() is gone: this check is reading nothing.');
    }
    $body = $fns['buildPaneTables']['body'];
    preg_match_all('/\bid:\s*\'([a-z]+)\',\s*panel:/', $body, $m, PREG_OFFSET_CAPTURE);
    $tables = []; $unresolved = 0;
    $starts = [];
    foreach ($m[0] as $i => $hit) { $starts[] = ['at' => $hit[1], 'id' => $m[1][$i][0]]; }
    foreach ($starts as $i => $s) {
        $end = isset($starts[$i + 1]) ? $starts[$i + 1]['at'] : strlen($body);
        $region = substr($body, $s['at'], $end - $s['at']);
        if (!preg_match('/\btype:\s*\'([a-z]+)\'/', $region, $tm)) { continue; }
        $seen = [];
        $ids = [];
        foreach (ecColumnLabels($fns, $region, [], $seen) as $id) {
            if ($id === null) { $unresolved++; continue; }
            $ids[$id] = true;
        }
        $tables[$tm[1]] = $ids;
    }
    return ['tables' => $tables, 'unresolved' => $unresolved];
}

/**
 * The popup's row builders, DERIVED: a function whose first parameter is `fields` and which takes a
 * parameter named `labelText`. Everything else that takes `fields` first is a COMPOSITE the walk
 * recurses into.
 *
 * @return array{builders:array<string,int>,composites:string[]}
 */
function ecPopupDoors(array $fns): array
{
    $builders = []; $composites = [];
    foreach ($fns as $name => $f) {
        if (($f['params'][0] ?? null) !== 'fields') { continue; }
        $i = array_search('labelText', $f['params'], true);
        if ($i !== false) { $builders[$name] = $i; } else { $composites[] = $name; }
    }
    return ['builders' => $builders, 'composites' => $composites];
}

/**
 * Walk one popup render function and everything it hands `fields` to, collecting the label identity
 * of every row it can build, attributed to the element types that row is reachable for.
 *
 * @return array<int,array{type:string,id:?string,where:string}>
 */
function ecPopupRows(array $fns, array $doors, string $fnName, array $types, array $subst, array &$seen): array
{
    $key = $fnName . '/' . implode(',', $types);
    if (isset($seen[$key]) || !isset($fns[$fnName])) { return []; }
    $seen[$key] = true;
    $body = $fns[$fnName]['body'];
    $branches = ecJsBranches($body);
    $rows = [];
    preg_match_all('/\b([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/', $body, $m, PREG_OFFSET_CAPTURE);
    foreach ($m[1] as $i => $hit) {
        $name = $hit[0];
        $openAt = $m[0][$i][1] + strlen($m[0][$i][0]) - 1;
        $isBuilder = isset($doors['builders'][$name]);
        $isLabel = ($name === 'setFieldLabel');
        $isComposite = in_array($name, $doors['composites'], true);
        if (!$isBuilder && !$isLabel && !$isComposite) { continue; }
        $args = ecJsCallArgs($body, $openAt);
        if ($args === null) { continue; }
        $here = ecTypesAt($branches, $hit[1], $types);
        if (!$here) { continue; }
        if ($isBuilder || $isLabel) {
            $idx = $isLabel ? 1 : $doors['builders'][$name];
            $expr = $args[$idx] ?? '';
            if ($expr === '') { continue; }
            $id = ecLabelIdentity(ecSubst($expr, $subst));
            foreach ($here as $t) { $rows[] = ['type' => $t, 'id' => $id, 'where' => $fnName]; }
            continue;
        }
        // A composite: recurse, but only where it is really being handed the popup container.
        if (trim($args[0] ?? '') !== 'fields') { continue; }
        $sub = [];
        foreach ($fns[$name]['params'] as $pi => $pname) {
            $sub[$pname] = isset($args[$pi]) ? ecSubst($args[$pi], $subst) : '';
        }
        foreach (ecPopupRows($fns, $doors, $name, $here, $sub, $seen) as $r) { $rows[] = $r; }
    }
    return $rows;
}

// ================================ the run =======================================================

// The selftest requires this file for its pure functions and its declarations; loading it must not
// also run the check over the real page.
if (defined('EC_TABLE_PARITY_LIB_ONLY')) { return; }


$root = dirname(__DIR__, 2);
$js = file_get_contents($root . '/js/looped-network.js');
if ($js === false) { fwrite(STDERR, "cannot read js/looped-network.js\n"); exit(1); }

$fns = ecJsTopLevelFunctions(ecJsBlankComments($js));
$doors = ecPopupDoors($fns);

// **BOTH DOORS MUST EXIST.** A rename that emptied either one would leave this reporting parity
// about nothing at all, which is the failing-open shape this repository has already paid for.
$problems = [];
if (count($doors['builders']) < 5) {
    $problems[] = 'the popup row builders have gone: no function takes `fields` first and a '
        . '`labelText` parameter. This check is reading nothing.';
}
if (strpos($js, 'function setFieldLabel(') === false) {
    $problems[] = 'setFieldLabel() is gone -- the second door every hand-built popup row writes its '
        . 'words through. This check is reading nothing.';
}

$table = ecTableColumns($fns);
$popupRoots = [
    'renderNodeFields' => ['junction', 'reservoir', 'tank'],
    'renderLinkFields' => ['pipe', 'pump', 'valve'],
    'renderLabelFields' => ['text'],
];
$rows = [];
foreach ($popupRoots as $fn => $types) {
    if (!isset($fns[$fn])) {
        $problems[] = "$fn() is gone: this check can no longer read the popup for " . implode('/', $types) . '.';
        continue;
    }
    $seen = [];
    foreach (ecPopupRows($fns, $doors, $fn, $types, [], $seen) as $r) { $rows[] = $r; }
}

$unresolvable = 0;
$gaps = [];      // "<type>/<id>" => true
$matched = 0;
$byType = [];
foreach ($rows as $r) {
    if ($r['id'] === null) { $unresolvable++; continue; }
    $byType[$r['type']][$r['id']] = $r['where'];
}
foreach ($byType as $type => $ids) {
    $cols = $table['tables'][$type] ?? null;
    if ($cols === null) {
        $problems[] = "the popup builds rows for a `$type` and buildPaneTables() declares no table "
            . 'for it. Every element type a popup can open needs a table, or the multi-properties '
            . 'box has a heading with nothing under it.';
        continue;
    }
    foreach ($ids as $id => $where) {
        $k = $type . '/' . $id;
        if (isset($cols[$id])) { $matched++; continue; }
        if (array_key_exists($k, EC_TABLE_PARITY_EXEMPT)) { $matched++; continue; }
        $gaps[$k] = $where;
    }
}
foreach (array_keys(EC_TABLE_PARITY_EXEMPT) as $k) {
    [$t, $id] = array_pad(explode('/', $k, 2), 2, '');
    if (!isset($byType[$t][$id])) {
        $problems[] = "EC_TABLE_PARITY_EXEMPT declares `$k` and the popup no longer builds that row. "
            . 'An exemption nobody can trip is a hole that has stopped being watched: delete it.';
    }
}

if ($problems) {
    echo "popup/table parity: the check itself is broken\n\n";
    foreach ($problems as $p) { echo "  $p\n\n"; }
    exit(1);
}

$typeCount = count($table['tables']);
$colCount = array_sum(array_map('count', $table['tables']));
if ($gaps) {
    printf("popup/table parity (ROADMAP Task 690): %d popup row(s) with no column in their own table\n\n", count($gaps));
    ksort($gaps);
    foreach ($gaps as $k => $where) {
        [$t, $id] = explode('/', $k, 2);
        printf("  %-10s %-34s built in %s()\n", $t, $id, $where);
    }
    echo "\n";
    echo "Each is a property a person can edit in the property popup and cannot see in the table --\n";
    echo "and, because multiGroups() derives its sections from paneTables(), cannot see in the\n";
    echo "multi-properties box either. Add a column to that type's spec in buildPaneTables(), or\n";
    echo "declare it in EC_TABLE_PARITY_EXEMPT in this script with the reason it is not a column.\n";
}
printf("\n%d popup row(s) read across %d element types; %d matched a column of their own table; "
    . "%d gap(s); %d label expression(s) named neither a key nor a function and were turned away; "
    . "%d column label(s) on the table side likewise. %d row builder(s) derived, %d composite(s) "
    . "walked, %d table(s) with %d column label(s).\n",
    count($rows), count($byType), $matched, count($gaps), $unresolvable, $table['unresolved'],
    count($doors['builders']), count($doors['composites']), $typeCount, $colCount);

if ($gaps && !EC_TABLE_PARITY_ADVISORY) { exit(1); }
if ($gaps) { echo "\nADVISORY while the gap count is above zero -- see the head of this script.\n"; }
exit(0);
