<?php
/**
 * syn_staleness.inc.php -- which `$ec_lang_syn` entries no longer match the English they were
 * written for. Shared by new_english_keys.php (shows them to Tom) and harvest_english_rulings.php
 * (takes his answer off the page).
 *
 * **WHY.** CC asked Tom in chat to rule on five stale synonym entries, and he asked twice why they
 * were not in `dev/new-english-keys.md` (2026-10-03). A synonym is a standing instruction to 26
 * translators, written against ONE wording; when the wording moves (or the key is deleted) the
 * instruction silently describes a string that is gone. Nothing detected that, so nothing could
 * put it on the one page where he rules on English.
 *
 * **THE RECORD.** `dev/syn-baseline.json` holds, per synonym, the English and the synonym text it was
 * last written against. An entry is stale when its key is gone, when the English now differs from
 * the recorded English, or when the synonym text differs from the recorded text (edited, not
 * recorded). `php dev/scripts/syn_baseline.php --record <key>...` re-records after CC has applied
 * something Tom approved. A script never edits `$ec_lang_syn`.
 *
 * **HIS ANSWERS.** `dev/syn-rulings.json`, keyed on key + exact English + exact synonym text under
 * discussion (the proposed one when `dev/syn-proposals.json` has one for this English, else the
 * current one), so an approval lapses when either changes.
 */

const EC_SYN_ORPHAN_ENGLISH = '(this key no longer exists in lib/lang.ec.en.php)';

function ecSynJson(string $root, string $file, string $top): array
{
    $p = $root . '/dev/' . $file;
    $j = is_file($p) ? json_decode((string) file_get_contents($p), true) : null;
    return (is_array($j) && isset($j[$top]) && is_array($j[$top])) ? $j[$top] : array();
}

/** English and synonym values as written in lib/lang.ec.en.php (single-quoted, rule D). */
function ecSynLangSource(string $root): array
{
    $src = (string) file_get_contents($root . '/lib/lang.ec.en.php');
    $un = function ($s) { return str_replace(array("\\'", '\\\\'), array("'", '\\'), $s); };
    $en = array(); $syn = array();
    if (preg_match_all("/\\\$ec_lang\\['([A-Za-z0-9_]+)'\\]\\s*=\\s*'((?:[^'\\\\]|\\\\.)*)';/", $src, $m, PREG_SET_ORDER)) {
        foreach ($m as $h) { $en[$h[1]] = $un($h[2]); }
    }
    if (preg_match_all("/\\\$ec_lang_syn\\['([A-Za-z0-9_]+)'\\]\\s*=\\s*'((?:[^'\\\\]|\\\\.)*)';/", $src, $m, PREG_SET_ORDER)) {
        foreach ($m as $h) { $syn[$h[1]] = $un($h[2]); }
    }
    return array($en, $syn);
}

/**
 * Every stale or orphaned synonym entry, sorted by key. Each row: key, english (current, or the
 * orphan marker), recorded (English it was written against, or null), syn (current text),
 * proposed (CC's proposal for this English, or ''), reason, subject (the syn text a ruling is
 * keyed on).
 */
function ecSynStaleRows(string $root): array
{
    list($en, $syn) = ecSynLangSource($root);
    $base = ecSynJson($root, 'syn-baseline.json', 'syn');
    $prop = ecSynJson($root, 'syn-proposals.json', 'proposals');
    $rows = array();
    foreach ($syn as $k => $s) {
        if (trim($s) === '' || $s === '|') { continue; }   // an empty synonym instructs nobody
        $cur = isset($en[$k]) ? $en[$k] : null;
        $rec = (isset($base[$k]['english'])) ? (string) $base[$k]['english'] : null;
        $recSyn = (isset($base[$k]['syn'])) ? (string) $base[$k]['syn'] : null;
        $reason = '';
        if ($cur === null) { $reason = 'the key no longer exists, so this entry describes nothing'; }
        elseif ($rec === null) { $reason = 'no record of the English it was written against'; }
        elseif ($rec !== $cur) { $reason = 'the English changed after this synonym was written'; }
        elseif ($recSyn !== $s) { $reason = 'the synonym text was edited and the edit was not recorded'; }
        if ($reason === '') { continue; }
        $p = ''; $note = '';
        if ($cur !== null && isset($prop[$k]['on']) && $prop[$k]['on'] === $cur && !empty($prop[$k]['syn'])) {
            $p = (string) $prop[$k]['syn'];
            $note = isset($prop[$k]['note']) ? (string) $prop[$k]['note'] : '';
        }
        $rows[$k] = array(
            'key' => $k, 'english' => $cur === null ? EC_SYN_ORPHAN_ENGLISH : $cur, 'recorded' => $rec,
            'syn' => $s, 'proposed' => $p, 'reason' => $reason, 'note' => $note, 'subject' => $p !== '' ? $p : $s,
        );
    }
    ksort($rows);
    return $rows;
}

/** His stored answer for this row, or null. Lapses when the English or the subject text changed. */
function ecSynRuling(string $root, array $row): ?array
{
    $r = ecSynJson($root, 'syn-rulings.json', 'rulings');
    if (!isset($r[$row['key']]) || !is_array($r[$row['key']])) { return null; }
    $x = $r[$row['key']];
    if (!isset($x['on'], $x['syn']) || $x['on'] !== $row['english'] || $x['syn'] !== $row['subject']) { return null; }
    return $x;
}

function ecSynOneLine(string $s, int $max = 400): string
{
    $one = trim(preg_replace('/\s+/', ' ', $s));
    return strlen($one) > $max ? substr($one, 0, $max - 3) . '...' : $one;
}

/** The markdown section. `$flag` is EC_RULING_FLAG. Empty-state is stated, never silence. */
function ecSynSection(string $root, string $flag): string
{
    $rows = ecSynStaleRows($root);
    if (!$rows) {
        return "\n## Synonym entries to approve  (0, none are stale)\n\n"
            . "Every `\$ec_lang_syn` entry matches the English it was written against.\n";
    }
    $open = 0;
    foreach ($rows as $r) { if (ecSynRuling($root, $r) === null) { $open++; } }
    $out = "\n## Synonym entries to approve  (" . count($rows) . ($open > 0 ? ", " . $open . " to read " . $flag : ", all ruled") . ")\n\n"
        . "**These are translator notes (`\$ec_lang_syn`), not visitor wording.** Each was written against an\n"
        . "English string that has since changed, or against a key that no longer exists. Say which: keep it\n"
        . "as is, change it (a proposal may follow), or remove it. **Your answer on the flag line is the\n"
        . "written permission** the rule requires; CC then applies it by hand and re-records it. A script\n"
        . "never edits a synonym.\n";
    foreach ($rows as $r) {
        $out .= "\n- **`" . $r['key'] . "`**\n";
        $out .= "  > " . str_replace("\n", "\n  > ", $r['english']) . "\n";
        $out .= "  *Why stale:* " . $r['reason'] . "\n";
        if ($r['recorded'] !== null && $r['recorded'] !== $r['english']) {
            $out .= "  *Written against:* " . ecSynOneLine($r['recorded']) . "\n";
        }
        $out .= "  *Current synonym:* " . ecSynOneLine($r['syn'], 1000) . "\n";
        if ($r['proposed'] !== '') {
            $out .= "  *Proposed synonym:* " . ecSynOneLine($r['proposed'], 1000) . "\n";
            if ($r['note'] !== '') { $out .= "  *Why this proposal:* " . ecSynOneLine($r['note'], 500) . "\n"; }
        }
        $out .= "  **What this asks for:** WRITTEN PERMISSION to "
            . ($r['english'] === EC_SYN_ORPHAN_ENGLISH ? 'remove this `$ec_lang_syn` entry'
                : ($r['proposed'] !== '' ? 'replace the current `$ec_lang_syn` entry with the proposed one (if they are identical, keep it as is)'
                    : 'keep, change or remove this `$ec_lang_syn` entry (say which, and the new text if changing)')) . ".\n";
        $ruling = ecSynRuling($root, $r);
        if ($ruling === null) { $out .= "  " . $flag . "\n"; }
        else {
            $out .= "  _Ruled " . (isset($ruling['ruled']) ? $ruling['ruled'] : '') . ": "
                . str_replace("\n", ' ', trim((string) ($ruling['answer'] ?? 'OK'))) . "_\n";
        }
    }
    return $out;
}
