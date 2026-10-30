<?php
/**
 * new_key_duplicate_check.php -- a NEW English key may not repeat another key's value. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY. A new key whose value equals an existing one costs 26 translations for a string we already
 * have (14 slipped into one sprint). "New" means in lib/lang.ec.en.php and in NONE of the other 26
 * files, i.e. not yet translated, so folding it is free. Fold it: point the code at the incumbent
 * key and delete the new one with delete_lang_key.php. Values compare case-insensitively with
 * trailing punctuation and ellipsis ignored.
 *
 * DELIBERATE REPEATS go in the allow-list below, with the reason. A menu item's key is its
 * command ID (lib/lpn-commands.json), so two menu rows sharing a label need two keys.
 */
$root = dirname(__DIR__, 2);
$ec_lang = []; include $root . '/lib/lang.ec.en.php'; $en = $ec_lang;
$translated = [];
foreach (glob($root . '/lib/lang.ec.??.php') as $f) {
    if (substr($f, -10) === '.ec.en.php') continue;
    $ec_lang = []; include $f;
    foreach ($ec_lang as $k => $v) $translated[$k] = 1;
}

$allow = [
    'lpn_file_import_msx'      => 'menu row, command ID',
    'lpn_gis_menu'             => 'menu row; the form button keeps the bare Add layer',
    'lpn_gis_add'              => 'form button; the menu row carries the ellipsis',
    'lpn_file_export_item_msx' => 'menu row, command ID',
    'lpn_inpup_i_patterns'     => 'lowercase noun inside a sentence, not a heading',
    'lpn_inpup_i_curves'       => 'lowercase noun inside a sentence, not a heading',
    'lpn_inpup_i_controls'     => 'lowercase noun inside a sentence, not a heading',
    'lpn_inpup_i_rules'        => 'lowercase noun inside a sentence, not a heading',
];

function nkd_norm($s) {
    $s = mb_strtolower(trim(html_entity_decode(strip_tags($s))));
    $s = str_replace('-', ' ', $s);
    $s = preg_replace('/\s+/', ' ', $s);
    return trim(preg_replace('/[\p{P}\p{S}]+$/u', '', $s));
}

$byValue = [];
foreach ($en as $k => $v) {
    if (!is_string($v)) continue;
    $n = nkd_norm($v);
    if (mb_strlen($n) < 3) continue;
    $byValue[$n][] = $k;
}
$bad = 0;
foreach ($byValue as $n => $keys) {
    if (count($keys) < 2) continue;
    foreach ($keys as $k) {
        if (isset($translated[$k]) || isset($allow[$k])) continue;
        $others = array_values(array_diff($keys, [$k]));
        echo "DUPLICATE NEW KEY: $k = \"" . $en[$k] . "\" repeats " . implode(', ', $others) . "\n";
        $bad++;
    }
}
if ($bad) {
    echo "\n$bad new key(s) repeat an existing value. Point the code at the incumbent key and run\n"
       . "php dev/scripts/delete_lang_key.php <key> --with-supply --apply, or, if the repeat is deliberate,\n"
       . "add the key to the allow-list in dev/scripts/new_key_duplicate_check.php with the reason.\n";
    exit(1);
}
echo "new key duplicates: none\n";
