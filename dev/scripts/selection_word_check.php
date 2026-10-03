<?php
/**
 * SELECT IS THE MAP SET; CHOOSE IS THE LIST. ONE STRING NEVER USES EITHER FOR THE OTHER.
 *
 * Tom, 2026-10-03, interview on `dev/tip-and-selection-audit.md`: keep Select / Selected / the
 * selection for the set of assets picked on the map (or in the Tables pane); Choose / choice /
 * chosen / option for picking from a list, menu, pull-down or radio. A sentence that needs both
 * says where ("on the map"). Never "highlight" or "pick" as a synonym for select. He asked for this
 * check: the audit found 11 strays plus five Fire flow strings mixing both senses, and the worst
 * ("Select junctions or select the All option.") is a sentence a visitor cannot parse.
 *
 * WHAT IT READS. English `$ec_lang` values only, as `plain_english_swap_check.php` does.
 *
 * A SHORT DECLARED TABLE, NOT A CLEVERNESS. Three failure shapes, each a pattern. "Select" as the
 * name of a tool or mode ("Select mode") and "selected" as the state of a list ("No curve
 * selected") are ordinary and are not matched.
 *
 * BASELINE. Keys fixed on another branch but not yet merged here; remove each entry after the merge.
 * A trailing * is a prefix. An entry that matches no key is fine (the branch is not here yet).
 *
 * Usage:
 *   php dev/scripts/selection_word_check.php
 *
 * Exit 0 = no English string uses a select word for a list choice, a choose word for the map set,
 * or highlight/pick for select.
 */

if (!defined('EC_SELECTION_WORD_LIB_ONLY')) { require_once __DIR__ . '/lang_parse.inc.php'; }

const EC_SELECTION_PATTERNS = [
    [
        'name'    => 'select word for a list choice',
        // select ... option / menu / list / pull-down; and option ... select.
        'pattern' => '/\bselect\b[^.]{0,40}\b(?:options?|choices?|pull-?downs?|drop-?downs?)\b|\bselect\b[^.]{0,30}\bfrom\s+(?:the|a)\s+(?:list|menu)\b|\b(?:options?|choices?)\b[^.]{0,30}\bselect\b/iu',
        'fix'     => 'Use choose for a list, menu, pull-down or option.',
    ],
    [
        'name'    => 'select word for a list choice (coordinate system)',
        // The coordinate-system chooser is a list; its button says Choose.
        'pattern' => '/\bselect\s+(?:the\s+|a\s+)?coordinate\s+system\b|\bpress\s+Select\b/iu',
        'fix'     => 'Use choose for a list, menu, pull-down or option.',
    ],
    [
        'name'    => 'choose word for the map set',
        // chosen/choose ... on the map; choose + assets.
        'pattern' => '/\b(?:chosen|choose)\b[^.]{0,40}\bon\s+the\s+map\b|\bchosen\s+set\b|\bchoose\s+(?:assets|junctions|pipes|nodes|links|elements)\b/iu',
        'fix'     => 'Use select / selected for the set of assets on the map.',
    ],
    [
        'name'    => 'highlight or pick for select',
        'pattern' => '/\bpick(?:s|ed)?\s+out\b|\bpick(?:s|ed)?\s+(?:an?\s+|the\s+|every\s+|all\s+)?(?:assets?|options?|items?|elements?|junctions?|pipes?|nodes?|links?)\b|\bhighlight(?:s|ed)?\s+(?:the\s+|every\s+|all\s+)?(?:assets?|elements?|junctions?|pipes?|nodes?|links?|selected|selection)\b/iu',
        'fix'     => 'Use select, never highlight or pick, for marking assets.',
    ],
];

/** key (or prefix*) => reason. */
const EC_SELECTION_BASELINE = [
    'lpn_ff_all'          => 'fixed on feat/demand-scaling; remove after merge',
    'lpn_ff_selected'     => 'fixed on feat/demand-scaling; remove after merge',
    'lpn_ff_no_selection' => 'fixed on feat/demand-scaling; remove after merge',
    'lpn_ff_scope_tip'    => 'fixed on feat/demand-scaling; remove after merge',
    'lpn_ds_*'            => 'fixed on feat/demand-scaling; remove after merge',
    'lpn_crit_*'          => 'fixed on feat/demand-scaling; remove after merge',
    'lpn_profile_say_idle' => 'pointing at a place on the map (a third sense), not the set; audit C.1 lowest priority',
    'lpn_profile_none'    => 'pointing at a place on the map (a third sense), not the set; audit C.1 lowest priority',
];

function ecSelectionBaselined(string $key): bool
{
    foreach (EC_SELECTION_BASELINE as $k => $why) {
        if ($k === $key) { return true; }
        if (substr($k, -1) === '*' && strpos($key, substr($k, 0, -1)) === 0) { return true; }
    }
    return false;
}

function ecSelectionHits(string $value): array
{
    $out = [];
    foreach (EC_SELECTION_PATTERNS as $p) {
        if (preg_match($p['pattern'], $value, $m)) { $out[] = [$p['name'], $m[0], $p['fix']]; }
    }
    return $out;
}

if (defined('EC_SELECTION_WORD_LIB_ONLY')) { return; }

$root = dirname(__DIR__, 2);
$en = ecLangValues(file_get_contents($root . '/lib/lang.ec.en.php'));

$problems = [];
$scanned = 0;
foreach ($en as $key => $value) {
    $scanned++;
    if (ecSelectionBaselined($key)) { continue; }
    foreach (ecSelectionHits($value) as [$name, $hit, $fix]) {
        $problems[] = [$key, $name, $hit, $fix, $value];
    }
}

if ($problems) {
    echo 'Selection words: ' . count($problems) . " English string(s) mix the map set and the list choice\n\n";
    foreach ($problems as [$key, $name, $hit, $fix, $value]) {
        echo "  \$ec_lang['$key']\n";
        echo "      $name: \"$hit\"\n";
        echo "      $fix\n";
        echo '      value: ' . (strlen($value) > 120 ? substr($value, 0, 117) . '...' : $value) . "\n\n";
    }
    echo "Select / selected / selection = the set of assets on the map. Choose / choice / option = a\n";
    echo "list, menu, pull-down or radio. A sentence needing both says where (\"on the map\").\n";
    echo "Rule and reasoning: dev/tip-and-selection-audit.md. Fix the English; baseline a key in\n";
    echo "EC_SELECTION_BASELINE only with a reason.\n";
    exit(1);
}

echo 'Selection words OK -- ' . count(EC_SELECTION_PATTERNS) . ' patterns checked against '
    . $scanned . " English string(s).\n";
