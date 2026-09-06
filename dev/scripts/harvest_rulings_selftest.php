<?php
/**
 * harvest_rulings_selftest.php — proves `harvest_english_rulings.php` can still SEE a mark, and
 * still tell a mark apart from the generator's own output.
 *
 * **WHY A SELFTEST AT ALL.** The check it guards passes by finding NOTHING, which is the shape that
 * has already died of success once in this repo: `js_fallback_string_check.php`'s corpus guard
 * asserted the defect still existed, so fixing the defect broke the guard. A blinded parser here
 * would report "nothing unharvested" for ever and read exactly like a clean tree — and the thing it
 * would be silently dropping is Tom's own handwriting, three times lost already.
 *
 * So this is a LIVE MUTATION: a mark is written into the real `dev/new-english-keys.md`, the real
 * check is run over the real tree, and the file is put back byte for byte whatever happens.
 *
 * Four legs, because the parser has four ways to go wrong:
 *   1. a mark on an entry is seen                       (the ordinary case)
 *   2. a mark in the translators' section is seen       (a DIFFERENT section, and the section keying
 *                                                        bug that ate three of Tom's six answers)
 *   3. the GENERATOR'S OWN furniture is not a mark      (it was, the day new_english_keys.php grew
 *                                                        `**What this asks for:**` and
 *                                                        `*The proposal:*` and this parser was not
 *                                                        told — it failed the build on its own output)
 *   4. an unmarked tree is clean                        (no false positive, or --check is unpassable)
 *
 * **THE FIXTURE KEY IS DERIVED, NEVER TYPED**, and that is not tidiness. This file used to name
 * `bpn_dup_id_short`, which was correct until the key was translated and left the list — after
 * which every leg failed for a reason that had nothing to do with the parser. A selftest whose
 * fixture can retire is a selftest that goes red on somebody else's good work.
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

/* Leg 4 first, on the untouched tree: if this is already dirty the others prove nothing. */
list($rc, $txt) = ecRunCheck($script);
if ($rc !== 0) {
    fwrite(STDERR, "SELFTEST CANNOT RUN: the tree already has unharvested marks.\n" . $txt . "\n");
    exit(2);
}

/* The first entry in the file, whatever it is today: `- **`key`**` and its `  > ` value block. */
if (!preg_match('/^- \*\*`([a-z0-9_]+)`\*\*\n((?:  > [^\n]*\n)+)/m', $original, $m)) {
    fwrite(STDERR, "SELFTEST CANNOT RUN: no entry found in dev/new-english-keys.md to use as a fixture.\n");
    exit(2);
}
$fixtureHead = $m[0];
$fixtureKey  = $m[1];

try {
    /* Leg 1: a plausible mark. `ec_selftest_marker` cannot occur in any real answer, so a pass here
     * is the parser reading the mark and not a coincidence. */
    file_put_contents($md, str_replace($fixtureHead, $fixtureHead . "  ec_selftest_marker one\n", $original));
    list($rc, $txt) = ecRunCheck($script);
    if ($rc === 0) { $fails[] = 'leg 1: a planted mark on ' . $fixtureKey . ' was NOT reported.'; }
    elseif (strpos($txt, $fixtureKey) === false) { $fails[] = 'leg 1: reported a failure but did not name the key.'; }

    /* Leg 2: the translators' section, whose entries carry a finding, numbered readings and the ask
     * lines between the value and the mark. A key there can ALSO appear as a new key lower down,
     * which is how three of Tom's six answers were parsed away. */
    file_put_contents($md, $original);
    /* **A KEY NAME OF ITS OWN, not the derived fixture.** Entries are keyed on section AND key, so
     * planting a second entry under a key the translators' section already holds makes the real one
     * overwrite the plant and the leg passes on the wrong entry -- which it did, silently, the first
     * time this was written. */
    $planted = preg_replace(
        '/(\n## Questions from the translators[^\n]*\n)/',
        "$1\n### from sprint ec-selftest\n\n- **`ec_selftest_fixture_key`**\n  > selftest fixture\n"
            . "  *The finding:* selftest fixture.\n  1. a reading\n"
            . "  **What this asks for:** a WORDING ruling.\n"
            . "  ec_selftest_marker two\n",
        $original, 1, $n2
    );
    if ($n2 !== 1) {
        $fails[] = 'leg 2: could not plant a mark in the translators section.';
    } else {
        file_put_contents($md, $planted);
        list($rc, $txt) = ecRunCheck($script);
        if ($rc === 0) { $fails[] = 'leg 2: a mark in the translators section was NOT reported.'; }
    }

    /* Leg 3: the generator's own furniture, planted verbatim. It must NOT read as handwriting.
     * These are the real strings ecAskLine() emits, so this leg fails the moment the generator's
     * wording and the parser's furniture list drift apart — which is exactly how it broke. */
    file_put_contents($md, $original);
    $furniture = "  **What this asks for:** a WORDING ruling -- is the English above right.\n"
        . "  *The proposal:* PROPOSED English: something.\n";
    file_put_contents($md, str_replace($fixtureHead, $fixtureHead . $furniture, $original));
    list($rc, $txt) = ecRunCheck($script);
    if ($rc !== 0) {
        $fails[] = "leg 3: the generator's OWN furniture was reported as an unharvested mark:\n" . $txt;
    }
} finally {
    file_put_contents($md, $original);
}

/* And the tree is back exactly as it was — the one property a live mutation must never get wrong. */
if (file_get_contents($md) !== $original) {
    $fails[] = 'RESTORE FAILED: dev/new-english-keys.md was not put back. Restore it from git.';
}
list($rc, $txt) = ecRunCheck($script);
if ($rc !== 0) { $fails[] = "leg 4: the restored tree does not check clean:\n" . $txt; }

if ($fails) {
    fwrite(STDERR, "harvest_rulings_selftest: FAIL\n");
    foreach ($fails as $f) { fwrite(STDERR, '  - ' . $f . "\n"); }
    exit(1);
}
echo "harvest_rulings_selftest: 4 legs OK on fixture `" . $fixtureKey . "` — a planted mark is seen in both"
    . " sections, the generator's own furniture is not mistaken for one, and a clean tree is clean.\n";
exit(0);
