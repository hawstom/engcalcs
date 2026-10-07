<?php
/**
 * delete_lang_key.php's JSON edits: a dropped hash lowers the manifest's `count` with it.
 * Run: php dev/scripts/delete_lang_key_selftest.php   (exit 0 = all pass)
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
require_once __DIR__ . '/delete_lang_key.inc.php';

$fail = 0; $n = 0;
function check($ok, $label) { global $fail, $n; $n++; if (!$ok) { $fail++; } echo ($ok ? '  ok   ' : '  FAIL ') . $label . "\n"; }

// 1. The shape of english_string_hashes.json: count, hashes, and a second map keyed by name.
$doc = ['description' => 'x', 'count' => 3, 'hashes' => ['a' => '1', 'b' => '2', 'c' => '3'],
    'shapes' => ['b' => ['words' => 1]], 'partial_updates' => [['keys' => ['b']]]];
$k = 0;
$out = jsonDropKeyKeepCount($doc, 'b', $k);
check(!isset($out['hashes']['b']) && !isset($out['shapes']['b']), 'the key leaves every map that is keyed by it');
check($out['count'] === 2 && $out['count'] === count($out['hashes']), 'count falls with the hash: 3 to 2');
check($k === 2, 'both removals are counted for the report');
check($out['partial_updates'][0]['keys'] === ['b'], 'a key named as a list VALUE is not touched (only object keys are)');

// 2. A key with no hash leaves count alone.
$k = 0;
$out = jsonDropKeyKeepCount($doc, 'zz', $k);
check($out['count'] === 3 && $k === 0, 'a key not in hashes changes nothing');

// 3. A count that was already wrong is not "repaired" by a delete.
$bad = $doc; $bad['count'] = 9; $k = 0;
$out = jsonDropKeyKeepCount($bad, 'a', $k);
check($out['count'] === 9, 'a count that did not match before is left for whoever broke it');

// 4. A document with no count (the rulings, the exempt list) gains none.
$plain = ['rulings' => ['a' => 1, 'b' => 2]]; $k = 0;
$out = jsonDropKeyKeepCount($plain, 'a', $k);
check(!array_key_exists('count', $out) && $out['rulings'] === ['b' => 2], 'a document without count gains none');

// 5. The real manifest is self-consistent, so the next delete keeps it so.
$real = json_decode((string) file_get_contents(__DIR__ . '/english_string_hashes.json'), true);
check(is_array($real) && $real['count'] === count($real['hashes']), 'english_string_hashes.json: count matches its hashes today');

echo $fail ? "\ndelete_lang_key selftest: $fail of $n FAILED\n" : "\ndelete_lang_key selftest: all $n passed\n";
exit($fail ? 1 : 0);
