<?php
/**
 * table_column_parity_check.php still reads both sides, still knows which node a row belongs to,
 * and still refuses an exemption that matches nothing.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHILE THE CHECK IT GUARDS IS ADVISORY. The check reports a count, and every
 * way it can quietly stop working produces a SMALLER count -- which reads exactly like progress on
 * the task it exists to serve. A door renamed, a walk that stops recursing, a brace counter thrown
 * off by an apostrophe: each of those makes the list shorter, and somebody closing gaps would be
 * delighted. So the pure functions are pinned to fixtures here, and the last section is a LIVE
 * MUTATION -- a fixture page with one popup row that has no column, which the real derivation must
 * name, and the same page with the column added, which it must not.
 *
 * THE FIXTURE THAT MATTERS MOST is the type chain. renderNodeFields() is one function serving three
 * kinds of node, and an emitter coefficient reported as a reservoir's is a finding against correct
 * code. That attribution is decided by brace counting through 47%-comment source, which is why the
 * apostrophe fixture is here too: it is the exact shape that broke it once, and the symptom was a
 * junction-only row being blamed on a reservoir.
 */

define('EC_TABLE_PARITY_LIB_ONLY', 1);
require_once __DIR__ . '/table_column_parity_check.php';

$fails = [];
$n = 0;
function ecParityCase(string $name, $got, $want): void
{
    global $fails, $n;
    $n++;
    if ($got !== $want) {
        $fails[] = sprintf("%s\n      expected %s\n      got      %s", $name,
            json_encode($want), json_encode($got));
    }
}

// ---- 1. comments are blanked, and an apostrophe in one is not a string ------------------------
{
    $js = "var a = 1;\t// the user's own number\nvar b = 2; // and 'quoted' words\nvar c = 3;\n";
    $out = ecJsBlankComments($js);
    ecParityCase('a line comment is blanked', strpos($out, 'user'), false);
    ecParityCase('...and the code around it is untouched', strpos($out, 'var c = 3;') !== false, true);
    ecParityCase('...and the file is the same length, so offsets still line up',
        strlen($out), strlen($js));
    // The load-bearing one: an apostrophe inside a comment must not open a string literal, or every
    // brace counter downstream loses its place for the rest of the file.
    $js2 = "if (x) {\n\t// Tom's own ruling\n\tf('y');\n}\nvar after = 1;\n";
    $blank = ecJsBlankComments($js2);
    ecParityCase('an apostrophe in a comment does not open a string',
        ecJsBlockEnd($blank, strpos($blank, '{')), strpos($js2, "}\nvar"));
    // A regex literal keeps its quotes out of the string scanner.
    $js3 = "var q = /['\"]/; // note\nvar z = 2;\n";
    ecParityCase('a regex literal is not read as a string',
        strpos(ecJsBlankComments($js3), 'note'), false);
}

// ---- 2. top-level functions, parameters and bodies --------------------------------------------
{
    $js = "\nvar x;\n\tfunction alpha(fields, labelText, tip) {\n\t\tif (a) { b(); }\n\t}\n"
        . "\tfunction beta(fields, el) {\n\t\talpha(fields, pc.k_one, null);\n\t}\n";
    $fns = ecJsTopLevelFunctions($js);
    ecParityCase('both functions are found', array_keys($fns), ['alpha', 'beta']);
    ecParityCase('parameters are read', $fns['alpha']['params'], ['fields', 'labelText', 'tip']);
    ecParityCase('a nested block does not end the body early',
        strpos($fns['alpha']['body'], 'b();') !== false, true);
    ecParityCase('and the next function is not swallowed',
        strpos($fns['alpha']['body'], 'beta') , false);
}

// ---- 3. the doors are DERIVED, never listed ---------------------------------------------------
{
    $js = "\n\tfunction rowBuilder(fields, labelText, get) {\n\t\tq();\n\t}\n"
        . "\tfunction composite(fields, el) {\n\t\trowBuilder(fields, pc.k, null);\n\t}\n"
        . "\tfunction notAPopupThing(a, b) {\n\t\tz();\n\t}\n";
    $doors = ecPopupDoors(ecJsTopLevelFunctions($js));
    ecParityCase('a fields-first function with a labelText parameter is a row builder',
        $doors['builders'], ['rowBuilder' => 1]);
    ecParityCase('a fields-first function without one is a composite to walk into',
        $doors['composites'], ['composite']);
}

// ---- 4. the label identity -------------------------------------------------------------------
{
    ecParityCase('a pageConfig read with an English fallback', ecLabelIdentity("pc.lpn_field_elev || 'Elevation'"), 'lpn_field_elev');
    ecParityCase('...concatenated with a unit', ecLabelIdentity("(pc.bpn_demand || 'Demand') + ' (' + u + ')'"), 'bpn_demand');
    ecParityCase('a bracket read', ecLabelIdentity("pc['lpn_field_tag']"), 'lpn_field_tag');
    ecParityCase('a bare key, which is the table side', ecLabelIdentity("'lpn_field_desc'"), 'lpn_field_desc');
    ecParityCase('a label a function produces', ecLabelIdentity('roughnessLabel()'), 'fn:roughnessLabel');
    ecParityCase('...named without being called, which is also the table side',
        ecLabelIdentity('roughnessLabel'), 'fn:roughnessLabel');
    // Unresolvable is NULL and must never be guessed at: the caller counts it and prints the count.
    ecParityCase('an expression naming neither is turned away', ecLabelIdentity("'(' + u + ')'"), null);
}

// ---- 5. which node a row belongs to -----------------------------------------------------------
{
    // renderNodeFields()'s own shape, reduced: three kinds of node, one function.
    $body = ecJsBlankComments(
        "\t\tcommonRow();\n"
        . "\t\tif (n.type === 'tank') {\n\t\t\ttankRow();\n"
        . "\t\t} else if (n.type === 'reservoir') {\n\t\t\tresRow();\n"
        . "\t\t} else {\n\t\t\tjunctionRow();   // Tom's own branch\n\t\t}\n"
        . "\t\ttailRow();\n");
    $b = ecJsBranches($body);
    $all = ['junction', 'reservoir', 'tank'];
    $at = function (string $needle) use ($body, $b, $all) {
        return ecTypesAt($b, strpos($body, $needle), $all);
    };
    ecParityCase('a row before the chain belongs to every node', $at('commonRow'), $all);
    ecParityCase('a row after it too', $at('tailRow'), $all);
    ecParityCase('the tank branch is the tank', $at('tankRow'), ['tank']);
    ecParityCase('the reservoir branch is the reservoir', $at('resRow'), ['reservoir']);
    // THE ONE THAT BROKE. The trailing `else` is every type the chain did not name, and nothing
    // says so in the source -- it has to be computed from the two branches above it.
    ecParityCase('the trailing else is the junction and nothing else', $at('junctionRow'), ['junction']);
    // A `!==` test, which is how a pump is kept out of a velocity row.
    $body2 = "\t\tif (l.type !== 'pump') { velRow(); }\n";
    ecParityCase('a !== test subtracts one type',
        ecTypesAt(ecJsBranches($body2), strpos($body2, 'velRow'), ['pipe', 'pump', 'valve']),
        ['pipe', 'valve']);
    // A condition that is not about the type constrains nothing: the table columns carry the same
    // gate in their own `when:`, so the parity question is identical on both sides of it.
    $body3 = "\t\tif (reactionFieldsShown()) { reactRow(); }\n";
    ecParityCase('a non-type condition constrains nothing',
        ecTypesAt(ecJsBranches($body3), strpos($body3, 'reactRow'), ['pipe', 'pump', 'valve']),
        ['pipe', 'pump', 'valve']);
}

// ---- 6. a column label carried through a helper's parameter -----------------------------------
{
    $js = "\n\tfunction paneColNodeResult(key, label, unit) {\n"
        . "\t\treturn { key: key, label: label, result: true };\n\t}\n";
    $fns = ecJsTopLevelFunctions($js);
    $seen = [];
    ecParityCase('a helper\'s label comes from the argument at the call',
        ecColumnLabels($fns, "paneColNodeResult('head', 'lpn_result_head', paneUnitHead)", [], $seen),
        ['lpn_result_head']);
}

// ---- 7. LIVE MUTATION: a popup row with no column, and the same row with one -------------------
//
// The sections above pin the parts. This runs the real derivation over a whole fixture page, twice,
// and the two answers must differ by exactly the column that was added.
{
    $page = function (string $extraCol): string {
        return "\n\tfunction buildPaneTables() {\n"
            . "\t\treturn [\n"
            . "\t\t\t{\n\t\t\t\tid: 'junctions', panel: 'p', label: 'l',\n"
            . "\t\t\t\tgroup: 'node', type: 'junction',\n"
            . "\t\t\t\tcols: [paneColId(), { key: 'elev', label: 'lpn_field_elev' }" . $extraCol . "]\n"
            . "\t\t\t}\n\t\t];\n\t}\n"
            . "\tfunction paneColId() {\n\t\treturn { key: 'id', label: 'lpn_field_id' };\n\t}\n"
            . "\tfunction unitNumberField(fields, labelText, unitId, get, set) {\n\t\tq();\n\t}\n"
            . "\tfunction setFieldLabel(el, text, tip) {\n\t\tel.textContent = text;\n\t}\n"
            . "\tfunction renderNodeFields(nodeId) {\n"
            . "\t\tunitNumberField(fields, pc.lpn_field_elev || 'Elevation', 'u', g, s);\n"
            . "\t\tunitNumberField(fields, pc.lpn_field_emitter || 'Emitter coefficient', 'u', g, s);\n"
            . "\t}\n";
    };
    $run = function (string $src): array {
        $fns = ecJsTopLevelFunctions(ecJsBlankComments($src));
        $doors = ecPopupDoors($fns);
        $seen = [];
        $rows = ecPopupRows($fns, $doors, 'renderNodeFields', ['junction'], [], $seen);
        $cols = ecTableColumns($fns)['tables']['junction'] ?? [];
        $gaps = [];
        foreach ($rows as $r) {
            if ($r['id'] !== null && !isset($cols[$r['id']])) { $gaps[] = $r['id']; }
        }
        sort($gaps);
        return $gaps;
    };
    ecParityCase('a popup row with no column is named', $run($page('')), ['lpn_field_emitter']);
    ecParityCase('...and giving it a column silences it',
        $run($page(", { key: 'emitter', label: 'lpn_field_emitter' }")), []);
}

// ---- 8. the ratchet: a declaration matching nothing is a failure -------------------------------
//
// Asserted against the REAL script, because the declaration table is in it: every exemption must
// name a row the real page really builds, or it is a hole nobody is watching any more.
{
    $out = shell_exec('php ' . escapeshellarg(__DIR__ . '/table_column_parity_check.php') . ' 2>&1');
    ecParityCase('the real check runs and reports its counts',
        (bool) preg_match('/popup row\(s\) read across (\d+) element types/', (string) $out, $m) && (int) $m[1] === 7,
        true);
    ecParityCase('...and says how much it turned away, so a blinded scan cannot read as progress',
        (bool) preg_match('/turned away/', (string) $out), true);
    ecParityCase('every exemption names a row the page still builds',
        strpos((string) $out, 'has stopped being watched'), false);
    ecParityCase('and the exemption table is not empty', count(EC_TABLE_PARITY_EXEMPT) > 0, true);
}

if ($fails) {
    echo 'table_column_parity_selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  $f\n\n"; }
    exit(1);
}
echo "table_column_parity_selftest OK -- $n assertion(s), including a live mutation of a whole "
    . "fixture page and the exemption ratchet against the real script.\n";
