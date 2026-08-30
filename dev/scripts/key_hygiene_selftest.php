<?php
/**
 * key_hygiene_selftest.php — assert that the reachability walk still sees a dead reader, and still
 * turns away the shapes that only look like one. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. The walk finds nothing on today's tree, because the case it was written for was
 * already deleted — and a check that finds nothing looks exactly the same whether it is working or
 * has gone blind. It is also ADVISORY, so nothing else would ever notice: a broken regex, a mask
 * flag inverted, a `continue` one level too high, and it reports a clean zero forever while the
 * next dead reader accumulates 27 translations behind it.
 *
 * THE TURN-AWAYS ARE PINNED AS HARD AS THE FIND. Every one of them buys a shorter list by giving up
 * coverage, and this repo has measured what happens when that trade goes the other way: the orphan
 * list ran at 40% noise until three false shapes were taught away. Loosening a rule here must fail
 * loudly rather than produce a false positive on a Tuesday.
 *
 * FIXTURE 1 IS THE HISTORICAL CASE VERBATIM — the two functions Task 542 left behind in
 * js/lpn-terrain.js, and the two keys they read. It is the one shape the walk exists for.
 *
 *   php dev/scripts/key_hygiene_selftest.php
 */
require __DIR__ . '/key_hygiene_walk.inc.php';

// [what it must report, js sources, php/root sources, keys, what shape this is]
$fixtures = [

    [['lpn_terrain_menu', 'lpn_terrain_tip'],
     ['lpn-terrain.js' => "(function (EC) {\n"
        . "\tfunction t(k, d) { return k; }\n"
        . "\tEC.lpnTerrainMenuLabel = function () {\n"
        . "\t\treturn t('lpn_terrain_menu', 'Fill in elevations from Mapbox DEM');\n"
        . "\t};\n"
        . "\tEC.lpnTerrainMenuTip = function () {\n"
        . "\t\treturn t('lpn_terrain_tip', 'Read the ground elevation under each node.');\n"
        . "\t};\n"
        . "})(EngCalcs);\n"],
     [], ['lpn_terrain_menu', 'lpn_terrain_tip'],
     'THE CASE: Task 542 deleted the menu ROW and left both readers, called by nobody'],

    [[],
     ['a.js' => "EC.reader = function () { return t('k_live', 'x'); };\nEC.reader();\n"],
     [], ['k_live'],
     'the same shape, CALLED from top-level code — the reader is alive and so is the key'],

    [['k_deep'],
     ['a.js' => "function inner() { return t('k_deep', 'x'); }\nfunction outer() { return inner(); }\n"],
     [], ['k_deep'],
     'TRANSITIVE: the reader is called, but only by a function nobody calls'],

    [[],
     ['a.js' => "function inner() { return t('k_deep', 'x'); }\nfunction outer() { return inner(); }\nouter();\n"],
     [], ['k_deep'],
     'the same chain with the far end reached — one live caller keeps the whole chain live'],

    [[],
     ['a.js' => "EC.reader = function () { return t('k_str', 'x'); };\nvar wanted = 'reader';\n"],
     [], ['k_str'],
     'TURNED AWAY: the name appears in a string literal, so it may be dispatched by name'],

    [[],
     ['a.js' => "EC.reader = function () { return t('k_dyn', 'x'); };\n",
      'b.js' => "EC[whichever]();\n"],
     [], ['k_dyn'],
     'TURNED AWAY: a namespace indexed by a computed name makes every member of it a root'],

    [[],
     ['a.js' => "EC.reader = function () { return t('k_php', 'x'); };\n"],
     ['p.php' => "<?php echo \$ec_lang['k_php'];"], ['k_php'],
     'TURNED AWAY: PHP renders the key, whatever the JS reader is doing'],

    [[],
     ['a.js' => "EC.reader = function () { /* k_note used to be read here */ return 1; };\n"],
     [], ['k_note'],
     'a key named ONLY in a comment has no reading site — finding 1 owns it, not this walk'],

    [[],
     ['a.js' => "EC.run = function () { return t('k_short', 'x'); };\n"],
     [], ['k_short'],
     'TURNED AWAY: a name under four characters is too easy to collide with a local'],

    [[],
     ['a.js' => "EC.reader = function () { return t('k_harness', 'x'); };\n"],
     ['dev/lpn-spike/h.js' => "EC.reader();\n"], ['k_harness'],
     'a HARNESS calls it: a test seam is not a corpse, and listing it is the noise to avoid'],

    [['k_after'],
     ['a.js' => "var re = /['\"]{2}/;\nEC.reader = function () { return t('k_after', 'x'); };\n"],
     [], ['k_after'],
     'a regex literal holding a quote must not open a string that swallows the rest of the file'],
];

$fail = 0;
foreach ($fixtures as [$want, $js, $php, $keys, $shape]) {
    $r = ecReachabilityCandidates($js, $php, $keys, []);
    $got = array_column($r['candidates'], 0);
    sort($got); sort($want);
    if ($got === $want) { continue; }
    $fail++;
    printf("FAIL  expected [%s] got [%s]\n      %s\n\n", implode(',', $want), implode(',', $got), $shape);
}

// The MASK is the part everything else rests on, so it is pinned directly rather than only through
// its effects: a string body must vanish from the code view and survive in the key view.
$src = "var a = 'lpn_hidden'; // comment_name\n";
$code = ecJsCodeMask($src);
$keyv = ecJsCodeMask($src, true);
if (strpos($code, 'lpn_hidden') !== false)  { $fail++; echo "FAIL  the code mask kept a string body\n"; }
if (strpos($code, 'comment_name') !== false) { $fail++; echo "FAIL  the code mask kept a comment\n"; }
if (strpos($keyv, 'lpn_hidden') === false)  { $fail++; echo "FAIL  the key mask lost a string body\n"; }
if (strpos($keyv, 'comment_name') !== false) { $fail++; echo "FAIL  the key mask kept a comment\n"; }
if (strlen($code) !== strlen($src) || strlen($keyv) !== strlen($src)) {
    $fail++; echo "FAIL  a mask changed the byte offsets it is used to index\n";
}

if ($fail) {
    printf("\nkey_hygiene_selftest: %d failure(s).\n", $fail);
    exit(1);
}
printf("key_hygiene_selftest: %d fixtures pass — the walk still sees the dead reader, and still\n", count($fixtures));
echo "turns away the six shapes that only look like one.\n";
exit(0);
