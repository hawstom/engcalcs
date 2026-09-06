<?php
/**
 * harvest_rulings_selftest.php — proves `harvest_english_rulings.php` can still SEE a mark.
 *
 * **WHY A SELFTEST AT ALL.** The check it guards passes by finding NOTHING, which is the shape that
 * has already died of success once in this repo: `js_fallback_string_check.php`'s corpus guard
 * asserted the defect still existed, so fixing the defect broke the guard. A blinded parser here
 * would report "nothing unharvested" for ever and read exactly like a clean tree — and the thing it
 * would be silently dropping is Tom's own handwriting, three times lost already.
 *
 * So this is a LIVE MUTATION, the pattern that replaced that corpus guard: a mark is written into
 * the real `dev/new-english-keys.md`, the real check is run over the real tree, it must FAIL and
 * must name the key, and the file is put back byte for byte whatever happens.
 *
 * Three legs, because the parser has three ways to go quiet:
 *   1. a mark on a new key is seen                     (the ordinary case)
 *   2. a mark in the translators' section is seen      (a DIFFERENT section, and the section keying
 *                                                       bug that ate three of Tom's six answers)
 *   3. an unmarked tree is clean                       (no false positive, or --check is unpassable)
 */

$root = dirname(__DIR__, 2);
$md = $root . '/dev/new-english-keys.md';
$script = escapeshellarg($root . '/dev/scripts/harvest_english_rulings.php');
$original = file_get_contents($md);
$fails = array();

function ecRunCheck(string $script): array
{
    $out = array(); $rc = 0;
    exec('php ' . $script . ' --check 2>&1', $out, $rc);
    return array($rc, implode("\n", $out));
}

/* Leg 3 first, on the untouched tree: if this is already dirty the other two prove nothing. */
list($rc, $txt) = ecRunCheck($script);
if ($rc !== 0) {
    fwrite(STDERR, "SELFTEST CANNOT RUN: the tree already has unharvested marks.\n" . $txt . "\n");
    exit(2);
}

try {
    /* Leg 1: a plausible mark on a real, currently-ruled key. `ec_selftest_marker` cannot occur in
     * any real answer, so a pass here is the parser reading the mark and not a coincidence. */
    $mutated = preg_replace(
        '/^(- \*\*`bpn_dup_id_short`\*\*\n  > Duplicate ID\n)  _Ruled[^\n]*\n/m',
        "$1  ec_selftest_marker one\n",
        $original,
        1,
        $n1
    );
    if ($n1 !== 1) {
        $fails[] = 'leg 1: could not plant a mark — the fixture key bpn_dup_id_short is not in the file in the expected shape.';
    } else {
        file_put_contents($md, $mutated);
        list($rc, $txt) = ecRunCheck($script);
        if ($rc === 0) { $fails[] = 'leg 1: a planted mark on bpn_dup_id_short was NOT reported.'; }
        elseif (strpos($txt, 'bpn_dup_id_short') === false) { $fails[] = 'leg 1: reported a failure but did not name the key.'; }
    }

    /* Leg 2: the translators' section. Its entries carry a `*The finding:*` line and numbered
     * readings between the value and the mark, and a key there can ALSO appear as a new key lower
     * down — which is precisely how three of Tom's six answers were parsed away. */
    file_put_contents($md, $original);
    $mutated = preg_replace(
        '/(## Questions from the translators.*?\n)(  @@ NEEDS RULING\n)/s',
        "$1  ec_selftest_marker two\n",
        $original,
        1,
        $n2
    );
    if ($n2 !== 1) {
        /* Nothing is open, so there is no flagged translators' entry to overwrite. Plant a whole
         * entry instead: the section still has to be parsed as `friction`, which is the property. */
        $mutated = preg_replace(
            '/(\n## Questions from the translators[^\n]*\n)/',
            "$1\n### from sprint ec-selftest\n\n- **`bpn_dup_id_short`**\n  > Duplicate ID\n  *The finding:* selftest fixture.\n  1. a reading\n  ec_selftest_marker two\n",
            $original,
            1,
            $n2
        );
    }
    if ($n2 !== 1) {
        $fails[] = 'leg 2: could not plant a mark in the translators section.';
    } else {
        file_put_contents($md, $mutated);
        list($rc, $txt) = ecRunCheck($script);
        if ($rc === 0) { $fails[] = 'leg 2: a mark in the translators section was NOT reported.'; }
    }
} finally {
    file_put_contents($md, $original);
}

/* And the tree is back exactly as it was — the one property a live mutation must never get wrong. */
if (file_get_contents($md) !== $original) {
    $fails[] = 'RESTORE FAILED: dev/new-english-keys.md was not put back. Restore it from git.';
}
list($rc, $txt) = ecRunCheck($script);
if ($rc !== 0) { $fails[] = "leg 3: the restored tree does not check clean:\n" . $txt; }

if ($fails) {
    fwrite(STDERR, "harvest_rulings_selftest: FAIL\n");
    foreach ($fails as $f) { fwrite(STDERR, '  - ' . $f . "\n"); }
    exit(1);
}
echo "harvest_rulings_selftest: 3 legs OK — a planted mark is seen in both sections, and a clean tree is clean.\n";
exit(0);
