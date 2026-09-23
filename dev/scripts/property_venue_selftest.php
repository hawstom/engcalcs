<?php
/**
 * property_venue_check.php still reads editable columns and Find's key lists correctly, and still
 * refuses an exemption that matches nothing.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * Same reasoning as table_column_parity_selftest.php, which this mirrors: the check reports a
 * count, and every way it can quietly stop working (a door renamed, a bracket-matcher thrown off,
 * the BAND_NODE/BAND_LINK ternary rewritten) produces a SMALLER count -- which reads exactly like
 * progress. This selftest is BLOCKING though the check it guards is advisory, for that reason.
 */

define('EC_VENUE_LIB_ONLY', 1);
require_once __DIR__ . '/property_venue_check.php';

$fails = [];
$n = 0;
function ecVenueCase(string $name, $got, $want): void
{
    global $fails, $n;
    $n++;
    if ($got !== $want) {
        $fails[] = sprintf("%s\n      expected %s\n      got      %s", $name,
            json_encode($want), json_encode($got));
    }
}

// ---- 1. key identity resolution ----------------------------------------------------------------
{
    ecVenueCase('a literal quoted key', ecKeyIdentity("'elev'", []), 'elev');
    ecVenueCase('a bound parameter substitutes to the call site\'s literal',
        ecKeyIdentity('key', ['key' => "'head'"]), 'head');
    ecVenueCase('an unresolvable expression is null, not a guess', ecKeyIdentity('someExpr()', []), null);
}

// ---- 2. editable columns: `set:` inside the SAME literal, not a neighbour ----------------------
{
    $js = "\n\tfunction buildPaneTables() {\n"
        . "\t\treturn [\n\t\t\t{\n\t\t\t\tid: 'junctions', panel: 'p', label: 'l',\n"
        . "\t\t\t\tgroup: 'node', type: 'junction',\n"
        . "\t\t\t\tcols: [\n"
        . "\t\t\t\t\t{ key: 'elev', label: 'lpn_field_elev', unit: function () { return 'u'; },\n"
        . "\t\t\t\t\t  get: function (n) { return n.elev; }, set: function (n, v) { n.elev = v; } },\n"
        . "\t\t\t\t\t{ key: 'pressure', label: 'lpn_result_pressure', result: true }\n"
        . "\t\t\t\t]\n\t\t\t}\n\t\t];\n\t}\n";
    $fns = ecJsTopLevelFunctions(ecJsBlankComments($js));
    $editable = ecEditableColumns($fns);
    ecVenueCase('an editable literal column is kept', isset($editable['junction']['elev']), true);
    ecVenueCase('a result column with no `set:` is dropped', isset($editable['junction']['pressure']), false);
}

// ---- 3. editability follows a helper's OWN body, resolved once, reused every call --------------
{
    $js = "\n\tfunction buildPaneTables() {\n"
        . "\t\treturn [\n\t\t\t{\n\t\t\t\tid: 'pipes', panel: 'p', label: 'l',\n"
        . "\t\t\t\tgroup: 'link', type: 'pipe',\n"
        . "\t\t\t\tcols: [paneColDiameter(), paneColFlow('flow', 'lpn_result_flow', paneUnitFlow)]\n"
        . "\t\t\t}\n\t\t];\n\t}\n"
        . "\tfunction paneColDiameter() {\n"
        . "\t\treturn { key: 'diameter', label: 'lpn_field_diameter',\n"
        . "\t\t\tget: function (l) { return l.diameter; }, set: function (l, v) { l.diameter = v; } };\n\t}\n"
        . "\tfunction paneColFlow(key, label, unit) {\n"
        . "\t\treturn { key: key, label: label, result: true };\n\t}\n";
    $fns = ecJsTopLevelFunctions(ecJsBlankComments($js));
    $editable = ecEditableColumns($fns);
    ecVenueCase('a helper that writes `set:` is editable', isset($editable['pipe']['diameter']), true);
    ecVenueCase('a helper that never writes `set:` is not, whatever its call site looks like',
        isset($editable['pipe']['flow']), false);
}

// ---- 4. findPropDefs() key lists, per group -----------------------------------------------------
{
    $js = "\n\tfunction findPropDefs() {\n"
        . "\t\tvar pc = EngCalcs.pageConfig || {}, out = [['id', pc.lpn_field_id || 'ID', 'ID']];\n"
        . "\t\tif (d.group === 'label') {\n"
        . "\t\t\tout = [];\n\t\t\tout.push(['text', pc.lpn_tool_add_text || 'Text', 'Text']);\n"
        . "\t\t\treturn out;\n\t\t}\n"
        . "\t\tif (d.group === 'customer') {\n"
        . "\t\t\tout.push(['desc', pc.lpn_field_desc || 'Description', 'Description']);\n"
        . "\t\t\treturn out;\n\t\t}\n"
        . "\t\tout.push(['desc', pc.lpn_field_desc || 'Description', 'Description']);\n"
        . "\t\tvar BAND_NODE = [['elev', 'lpn_field_elev', 'Elevation']];\n"
        . "\t\tvar BAND_LINK = [['diameter', 'lpn_field_diameter', 'Diameter']];\n"
        . "\t\tvar RESULT_NODE = [['head', 'lpn_result_head', 'Head']];\n"
        . "\t\tvar RESULT_LINK = [['flow', 'lpn_result_flow', 'Flow']];\n"
        . "\t\toffer(d.group === 'node' ? BAND_NODE : BAND_LINK);\n"
        . "\t\toffer(d.group === 'node' ? RESULT_NODE : RESULT_LINK);\n"
        . "\t\treturn out;\n\t}\n";
    $fns = ecJsTopLevelFunctions(ecJsBlankComments($js));
    $find = ecFindKeysByGroup($fns);
    ecVenueCase('no problems reading a well-formed findPropDefs()', $find['problems'], []);
    ecVenueCase('the node group gets the generic rows plus BAND_NODE and RESULT_NODE',
        $find['node'], ['id', 'desc', 'tag', 'connection', 'elev', 'head']);
    ecVenueCase('the link group gets BAND_LINK and RESULT_LINK, not the node bands',
        $find['link'], ['id', 'desc', 'tag', 'diameter', 'flow']);
    ecVenueCase('the label group is read whole, stopping at its own return',
        $find['label'], ['text']);
    ecVenueCase('the customer group is read whole, stopping at its own return',
        $find['customer'], ['desc']);
}

// ---- 5. the ternary this script does not derive is ASSERTED, not assumed ------------------------
{
    $js = "\n\tfunction findPropDefs() {\n\t\tvar out = [];\n"
        . "\t\tif (d.group === 'label') { return out; }\n\t\tif (d.group === 'customer') { return out; }\n"
        . "\t\toffer(d.group === 'node' ? SOMETHING_ELSE : BAND_LINK);\n\t\treturn out;\n\t}\n";
    $fns = ecJsTopLevelFunctions(ecJsBlankComments($js));
    $find = ecFindKeysByGroup($fns);
    ecVenueCase('a rewritten ternary is refused rather than read as an empty list',
        $find['problems'] !== [], true);
}

// ---- 6. LIVE: the real check runs, and the exemption ratchet holds ------------------------------
{
    $out = shell_exec('php ' . escapeshellarg(__DIR__ . '/property_venue_check.php') . ' 2>&1');
    ecVenueCase('the real check runs and reports its counts',
        (bool) preg_match('/editable table column\(s\) checked across (\d+) element types/', (string) $out, $m)
            && (int) $m[1] === 8,
        true);
    ecVenueCase('every exemption names a column the page still builds',
        strpos((string) $out, 'has stopped being watched'), false);
    ecVenueCase('and the exemption table is not empty', count(EC_VENUE_EXEMPT) > 0, true);
}

if ($fails) {
    echo 'property_venue_selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  $f\n\n"; }
    exit(1);
}
echo "property_venue_selftest OK -- $n assertion(s), including a live run of the real script and "
    . "the exemption ratchet against it.\n";
