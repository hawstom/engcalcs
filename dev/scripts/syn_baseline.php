<?php
/**
 * syn_baseline.php -- record the English each `$ec_lang_syn` entry was written against.
 * See syn_staleness.inc.php. This edits only dev/syn-baseline.json, never a language file.
 *
 *   php dev/scripts/syn_baseline.php --record key [key...]   # record key(s) at today's values
 *   php dev/scripts/syn_baseline.php --prune                 # drop records whose synonym is gone
 *   php dev/scripts/syn_baseline.php --list                  # show stale entries (advisory)
 *
 * Run --record only AFTER Tom has ruled on the entry and CC has applied his answer (or he said
 * "keep it as is").
 */
require __DIR__ . '/syn_staleness.inc.php';
$root = dirname(__DIR__, 2);
$f = $root . '/dev/syn-baseline.json';
$doc = is_file($f) ? json_decode((string) file_get_contents($f), true) : array();
if (!is_array($doc)) { $doc = array(); }
if (!isset($doc['syn']) || !is_array($doc['syn'])) { $doc['syn'] = array(); }
list($en, $syn) = ecSynLangSource($root);
$mode = isset($argv[1]) ? $argv[1] : '--list';
if ($mode === '--list') {
    foreach (ecSynStaleRows($root) as $r) { echo $r['key'] . "  " . $r['reason'] . "\n"; }
    exit(0);
}
if ($mode === '--record') {
    $keys = array_slice($argv, 2);
    if (!$keys) { fwrite(STDERR, "--record needs at least one key\n"); exit(2); }
    foreach ($keys as $k) {
        if (!isset($syn[$k])) { fwrite(STDERR, "$k has no \$ec_lang_syn entry; use --prune if it was removed\n"); exit(1); }
        if (!isset($en[$k])) { fwrite(STDERR, "$k has a synonym but no English key; remove the synonym first\n"); exit(1); }
        $doc['syn'][$k] = array('english' => $en[$k], 'syn' => $syn[$k]);
        echo "recorded $k\n";
    }
} elseif ($mode === '--prune') {
    foreach (array_keys($doc['syn']) as $k) {
        if (!isset($syn[$k])) { unset($doc['syn'][$k]); echo "pruned $k\n"; }
    }
} else { fwrite(STDERR, "unknown mode $mode\n"); exit(2); }
ksort($doc['syn']);
$doc = array('_note' => 'The English and synonym text each $ec_lang_syn entry was last written against. See dev/scripts/syn_staleness.inc.php.') + $doc;
file_put_contents($f, json_encode($doc, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n");
