<?php
/**
 * EVERY SETTING SAYS WHERE IT IS KEPT -- ROADMAP Task 739, the static half.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3 or later
 *
 * Tom, 2026-09-28: "Systematically disclose to users where things are stored. Autodesk does this
 * so well that I, a user, can cite by memory that variables are stored in the drawing (project),
 * session, or user profile."
 *
 * Three classes, one short key each (`lpn_saved_project`, `lpn_saved_browser`, `lpn_saved_session`),
 * reused everywhere. What this holds, without a browser:
 *
 *   1. Every sub-heading in the Settings box (`class="lpn-set-sub"` in Looped-Network.php) declares
 *      `data-saved="<class>"` and writes the matching marker with lpnSavedMark('<class>'), so a
 *      sub-heading added without a class fails here and not in a visitor's hands.
 *   2. The three keys exist in the English file.
 *   3. Every browser-scoped key lpn_furniture_check.php declares (EC_LPN_FURNITURE) is named in
 *      dev/setting-scope.md, so the inventory cannot lose a key the page writes.
 *
 * The other half -- that each CONTROL is actually stored where its heading says -- needs a page
 * to drive and is dev/lpn-spike/setting-scope-browser-harness.js, which also regenerates the
 * inventory table in dev/setting-scope.md.
 *
 * Exit 0 clean, 1 on any finding.
 */

define('LPN_FURNITURE_LIB_ONLY', true);
require __DIR__ . '/lpn_furniture_check.php';

$root = dirname(__DIR__, 2);
$problems = [];
$classes = ['project', 'browser', 'session'];

$php = file_get_contents($root . '/Looped-Network.php');
preg_match_all('/<div class="lpn-set-sub"([^>]*)>(.*?)<\/div>/s', $php, $m, PREG_SET_ORDER);
if (count($m) < 10) {
    $problems[] = 'Looped-Network.php: found ' . count($m) . ' Settings sub-headings; this check has gone blind or the box was rebuilt.';
}
foreach ($m as $hit) {
    $id = preg_match('/id="([^"]+)"/', $hit[1], $im) ? $im[1] : '(no id)';
    if (!preg_match('/data-saved="(project|browser|session)"/', $hit[1], $cm)) {
        $problems[] = "Settings sub-heading $id declares no data-saved class. Say where its values are kept: "
            . 'project (in serializeProject()), browser (localStorage window furniture) or session (forgotten on reload).';
        continue;
    }
    if (strpos($hit[2], "lpnSavedMark('" . $cm[1] . "')") === false) {
        $problems[] = "Settings sub-heading $id declares data-saved=\"{$cm[1]}\" but does not write lpnSavedMark('{$cm[1]}').";
    }
}

require_once $root . '/dev/scripts/lang_parse.inc.php';
$en = ecLangValues((string) file_get_contents($root . '/lib/lang.ec.en.php'));
foreach ($classes as $c) {
    if (empty($en['lpn_saved_' . $c])) { $problems[] = "lib/lang.ec.en.php has no lpn_saved_$c."; }
}

$inv = file_get_contents($root . '/dev/setting-scope.md');
foreach (array_keys(EC_LPN_FURNITURE) as $key) {
    if (strpos($inv, '`' . $key . '`') === false) {
        $problems[] = "dev/setting-scope.md does not name the browser key `$key`. It is declared window furniture in "
            . 'lpn_furniture_check.php, so the inventory owes a line saying which control writes it.';
    }
}

if ($problems) {
    echo 'setting scope: ' . count($problems) . " problem(s)\n\n";
    foreach ($problems as $p) { echo "  $p\n\n"; }
    exit(1);
}
printf("setting scope OK -- %d Settings sub-headings classified, %d browser keys inventoried.\n", count($m), count(EC_LPN_FURNITURE));
