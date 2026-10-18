<?php
/**
 * The language keys that title a DOCKABLE box on the lpn_ page, read from the page itself.
 *
 * A docked box set to auto-hide tucks into a tab on the map's edge, and the tab shows the box's
 * title turned on its side, cut off with an ellipsis once it runs past the tab's length (14em, and
 * less when several tabs share the strip). So the word that names the box's subject has to come
 * first. English does that by itself ("Pump energy report"); a language that puts the head noun
 * first ("Informe de energía de las bombas") shows four tabs that all read "Informe de...".
 *
 * **DERIVED, NEVER A LIST.** A layout note describes a widget and goes stale silently when the
 * widget changes (dev/language-strings.md, "A WRONG LAYOUT LINE IS WORSE THAN A MISSING ONE"), so
 * the set is read from the two places that make it true: the ids wireBoxDocking() registers in
 * js/looped-network.js, and the `lpn-setbox-title` each of those boxes carries in
 * Looped-Network.php. The pane's own tab boxes are built at run time from one-word tab labels and
 * are not included.
 */

const DOCK_BOX_JS = __DIR__ . '/../../js/looped-network.js';
const DOCK_BOX_PAGE = __DIR__ . '/../../Looped-Network.php';
// Fewer than this means the parse broke, not that the page lost its boxes.
const DOCK_BOX_MIN = 10;

/** @return array<string,string> title key => box id */
function dockBoxTitleKeys(): array
{
    $js = @file_get_contents(DOCK_BOX_JS);
    $page = @file_get_contents(DOCK_BOX_PAGE);
    if (!is_string($js) || !is_string($page)) {
        throw new RuntimeException('dockBoxTitleKeys: cannot read the lpn_ page sources.');
    }
    $at = strpos($js, 'function wireBoxDocking()');
    $end = $at === false ? false : strpos($js, '.forEach(function (r) { registerDockBox(', $at);
    if ($at === false || $end === false) {
        throw new RuntimeException('dockBoxTitleKeys: wireBoxDocking() and its registerDockBox() loop not found in js/looped-network.js.');
    }
    preg_match_all("/\\[\\s*'([a-z0-9_]+)'\\s*,/", substr($js, $at, $end - $at), $m);
    $out = [];
    foreach ($m[1] as $id) {
        $box = strpos($page, 'id="' . $id . '"');
        if ($box === false) {
            continue;
        }
        if (!preg_match('/class="lpn-setbox-title">(.*?)<\/div>/s', $page, $t, 0, $box)) {
            continue;
        }
        if (preg_match("/\\\$ec_lang\\['([a-z0-9_]+)'\\]/", $t[1], $k)) {
            $out[$k[1]] = $id;
        }
    }
    if (count($out) < DOCK_BOX_MIN) {
        throw new RuntimeException('dockBoxTitleKeys: found ' . count($out) . ' dockable box titles, expected at least '
            . DOCK_BOX_MIN . '; the page markup or wireBoxDocking() changed shape.');
    }
    return $out;
}
