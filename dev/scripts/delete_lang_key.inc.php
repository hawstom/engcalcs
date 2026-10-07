<?php
/**
 * The JSON half of delete_lang_key.php, apart so delete_lang_key_selftest.php can drive it.
 *
 * **A MANIFEST THAT STATES ITS OWN SIZE KEEPS STATING IT TRUTHFULLY.** english_string_hashes.json
 * carries `count` beside `hashes`, and key-merge-harness.js holds the two equal. Dropping a key's
 * hash without lowering `count` left the drift manifest claiming 2,228 hashes over 2,227
 * (feat/bentley-interop, 2026-10-07, deleting lpn_labels_col_rank), and the suite went red.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */

/** Removes every occurrence of $key as an object key, at any depth, counting as it goes. */
function jsonDropKey($node, $key, &$n)
{
    if (!is_array($node)) { return $node; }
    $out = [];
    foreach ($node as $k => $v) {
        if ($k === $key) { $n++; continue; }
        $out[$k] = jsonDropKey($v, $key, $n);
    }
    return $out;
}

/**
 * jsonDropKey(), and where the document has a top-level `count` that stated the size of its
 * `hashes` map, lowered by one when that map lost the key. A `count` that did not match before is
 * left alone: this tool does not repair what it did not break.
 */
function jsonDropKeyKeepCount($data, $key, &$n)
{
    $had = is_array($data) && isset($data['hashes']) && is_array($data['hashes']) && array_key_exists($key, $data['hashes']);
    $matched = $had && isset($data['count']) && is_int($data['count']) && $data['count'] === count($data['hashes']);
    $data = jsonDropKey($data, $key, $n);
    if ($matched) { $data['count'] = count($data['hashes']); }
    return $data;
}
