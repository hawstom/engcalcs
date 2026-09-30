<?php
/**
 * concept_selftest.php -- assert concept_check.php still sees each defect it exists for, and still
 * lets a sound table through. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * The check passes by finding nothing, so a regression that blinds it looks exactly like a clean
 * glossary. Each fixture below is one of the silent failures named in concept_check.php.
 *
 *   php dev/scripts/concept_selftest.php
 */

define('CONCEPT_CHECK_LIB_ONLY', true);
require __DIR__ . '/concept_check.php';

$t = static function (string $term, string $id, string $def = '', ?string $en = null): array {
    $row = ['term' => $term, 'concept' => $id, 'definition' => $def, 'translations' => []];
    if ($en !== null) { $row['translations']['en'] = $en; }
    return $row;
};
$sound = [
    $t('label (map annotation)', 'label-sym-sally', 'Text the page writes from data.', 'Label'),
    $t('text (map annotation)', 'label-user-tessa', 'Text the user types.', 'Text'),
    $t('head', 'head-family', 'Energy per unit weight as a length.'),
    $t('hydraulic head (node value)', 'hydraulic-head', 'z + p/gamma at a point.', 'Head'),
    $t('flow', 'flow'),
];
$en = ['lpn_tool_labels' => 'Labels', 'lpn_result_head' => 'Head'];
$cites = ['lpn_tool_labels' => ['label-sym-sally'], 'lpn_result_head' => ['hydraulic-head']];

$withTerms = static function (array $rows) use ($sound): array { return array_merge($sound, $rows); };

$cases = [
    ['a sound table with two concepts sharing the English word Head', $sound, $cites, false],
    ['THE DEFECT: two terms share one concept id', $withTerms([$t('tag (EPANET)', 'label-sym-sally')]), $cites, true],
    ['an id that is another term\'s English rendering (head vs Head, the root family)',
        $withTerms([$t('pressure head', 'head')]), $cites, true],
    ['an id that folds to another term\'s name through case and punctuation',
        $withTerms([$t('something else', 'text-map-annotation')]), $cites, true],
    ['a key citing an id no term carries', $sound, $cites + ['lpn_field_tag' => ['label-word-gus']], true],
    ['a key that is not in the English file', $sound, ['lpn_gone' => ['label-sym-sally']] + $cites, true],
    ['a term with no concept id at all', $withTerms([['term' => 'orphan', 'definition' => '']]), $cites, true],
    ['an id that cannot be cited without quoting', $withTerms([$t('odd', 'Odd Id')]), $cites, true],
    ['a term with no definition field (empty is fine, absent is not)',
        $withTerms([['term' => 'bare', 'concept' => 'bare']]), $cites, true],
    ['an id equal to its OWN term name is fine', $withTerms([$t('pressure', 'pressure', 'p')]), $cites, false],
];

$fails = 0;
foreach ($cases as [$name, $terms, $keyConcepts, $wantFinding]) {
    $enForCase = $en + ['lpn_field_tag' => 'Tag'];
    $got = ecConceptFindings($terms, $keyConcepts, $enForCase);
    $hit = $got !== [];
    if ($hit !== $wantFinding) {
        $fails++;
        echo "  FAIL $name\n        wanted " . ($wantFinding ? 'a finding' : 'no finding') . ', got '
            . ($hit ? count($got) . ': ' . $got[0] : 'none') . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

if ($fails) {
    echo "\nconcept_selftest: $fails failure(s). concept_check.php no longer sees what it guards.\n";
    exit(1);
}
echo "\nconcept_selftest: all " . count($cases) . " fixtures behave.\n";
exit(0);
