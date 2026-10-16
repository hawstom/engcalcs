<?php
/**
 * plain_sentences.inc.php -- the shared reader for dev/plain-sentences.md, Tom's per-string help for
 * translators, and the staleness report new_english_keys.php shows him.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * Tom, 2026-10-16: "I'm in favor of deprecating/removing the _syn keys if this fully supplants
 * them." The file replaced `$ec_lang_syn`: one entry per key, a Plain line (what the string means,
 * synonyms joined by "or") and optional Layout, Symbol, Runtime and Note lines. A concept that recurs
 * across strings belongs in dev/terms.md instead.
 *
 * **STALENESS.** Each entry's English line is the English it was written against. When the key's
 * English moves, or the key is gone, the entry describes a string that is no longer there; it is
 * listed in dev/new-english-keys.md for Tom. His answer is harvested into
 * dev/plain-sentence-rulings.json, keyed on key + exact English + exact Plain text, so it lapses when
 * either changes. CC applies what he approves by hand, updating the English line with it.
 */

const EC_PLAIN_SENTENCES_PATH = __DIR__ . '/../plain-sentences.md';
const EC_PLAIN_FIELDS = ['English', 'Plain', 'Layout', 'Symbol', 'Runtime', 'Note'];
const EC_PLAIN_ORPHAN_ENGLISH = '(this key no longer exists in lib/lang.ec.en.php)';

/**
 * Parses dev/plain-sentences.md into [entries, problems]. entries: key => {english, plain, layout,
 * symbol (bool), runtime, notes (list)}. problems: sentences naming what could not be read.
 */
function ecParsePlainSentences(string $text): array
{
    $entries = [];
    $problems = [];
    $at = strpos($text, "\n## Entries");
    if ($at === false) {
        return [[], ['dev/plain-sentences.md has no "## Entries" heading.']];
    }
    foreach (array_slice(preg_split('/^### /m', substr($text, $at)), 1) as $block) {
        $lines = explode("\n", trim($block));
        $key = trim($lines[0], " `");
        if (!preg_match('/^[A-Za-z0-9_]+$/', $key)) {
            $problems[] = "heading \"### {$lines[0]}\" is not a key";
            continue;
        }
        if (isset($entries[$key])) {
            $problems[] = "$key has two entries";
            continue;
        }
        $e = ['english' => '', 'plain' => '', 'layout' => '', 'symbol' => false, 'runtime' => '', 'notes' => []];
        foreach (array_slice($lines, 1) as $line) {
            if (trim($line) === '') { continue; }
            if (!preg_match('/^- ([A-Za-z]+): (.*)$/', rtrim($line), $f) || !in_array($f[1], EC_PLAIN_FIELDS, true)) {
                $problems[] = "$key: cannot read the line \"" . trim($line) . '" (each line is "- Field: text", the fields ' . implode(', ', EC_PLAIN_FIELDS) . ')';
                continue;
            }
            $v = trim($f[2]);
            switch ($f[1]) {
                case 'English': $e['english'] = $v; break;
                case 'Plain':   $e['plain'] = $v; break;
                case 'Layout':  $e['layout'] = $v; break;
                case 'Symbol':  $e['symbol'] = strtolower($v) === 'yes'; break;
                case 'Runtime': $e['runtime'] = $v; break;
                case 'Note':    $e['notes'][] = $v; break;
            }
        }
        $entries[$key] = $e;
    }
    return [$entries, $problems];
}

/** The entries of dev/plain-sentences.md, or [] when it is unreadable. */
function ecPlainSentences(): array
{
    static $entries = null;
    if ($entries === null) {
        [$entries] = ecParsePlainSentences((string)@file_get_contents(EC_PLAIN_SENTENCES_PATH));
    }
    return $entries;
}

function ecPlainJson(string $root, string $file, string $top): array
{
    $p = $root . '/dev/' . $file;
    $j = is_file($p) ? json_decode((string)file_get_contents($p), true) : null;
    return (is_array($j) && isset($j[$top]) && is_array($j[$top])) ? $j[$top] : [];
}

/** English values as written in lib/lang.ec.en.php (single-quoted, rule D). */
function ecPlainEnglishSource(string $root): array
{
    $src = (string)file_get_contents($root . '/lib/lang.ec.en.php');
    $en = [];
    if (preg_match_all("/\\\$ec_lang\\['([A-Za-z0-9_]+)'\\]\\s*=\\s*'((?:[^'\\\\]|\\\\.)*)';/", $src, $m, PREG_SET_ORDER)) {
        foreach ($m as $h) { $en[$h[1]] = str_replace(["\\'", '\\\\'], ["'", '\\'], $h[2]); }
    }
    return $en;
}

/**
 * Every entry whose English line no longer matches the key's English, or whose key is gone, sorted
 * by key. Each row: key, english (current, or the orphan marker), recorded (the English line), plain
 * (the Plain text, the subject a ruling is keyed on), reason.
 */
function ecPlainStaleRows(string $root): array
{
    $en = ecPlainEnglishSource($root);
    [$entries] = ecParsePlainSentences((string)@file_get_contents($root . '/dev/plain-sentences.md'));
    $rows = [];
    foreach ($entries as $k => $e) {
        $cur = $en[$k] ?? null;
        if ($cur === null) { $reason = 'the key no longer exists, so this entry describes nothing'; }
        elseif ($e['english'] !== $cur) { $reason = 'the English changed after this entry was written'; }
        else { continue; }
        $rows[$k] = [
            'key' => $k, 'english' => $cur ?? EC_PLAIN_ORPHAN_ENGLISH, 'recorded' => $e['english'],
            'plain' => $e['plain'] !== '' ? $e['plain'] : implode(' ', $e['notes']), 'reason' => $reason,
        ];
    }
    ksort($rows);
    return $rows;
}

/** His stored answer for this row, or null. Lapses when the English or the Plain text changed. */
function ecPlainRuling(string $root, array $row): ?array
{
    $r = ecPlainJson($root, 'plain-sentence-rulings.json', 'rulings');
    $x = $r[$row['key']] ?? null;
    if (!is_array($x) || ($x['on'] ?? null) !== $row['english'] || ($x['plain'] ?? null) !== $row['plain']) { return null; }
    return $x;
}

function ecPlainOneLine(string $s, int $max = 400): string
{
    $one = trim((string)preg_replace('/\s+/', ' ', $s));
    return strlen($one) > $max ? substr($one, 0, $max - 3) . '...' : $one;
}

/** The markdown section for dev/new-english-keys.md. `$flag` is EC_RULING_FLAG. Empty-state is stated. */
function ecPlainSection(string $root, string $flag): string
{
    $rows = ecPlainStaleRows($root);
    if (!$rows) {
        return "\n## Plain sentences to check  (0, none are stale)\n\n"
            . "Every entry in `dev/plain-sentences.md` matches the English it was written against.\n";
    }
    $open = 0;
    foreach ($rows as $r) { if (ecPlainRuling($root, $r) === null) { $open++; } }
    $out = "\n## Plain sentences to check  (" . count($rows) . ($open > 0 ? ", " . $open . " to read " . $flag : ", all answered") . ")\n\n"
        . "**These are your translator notes in `dev/plain-sentences.md`, not visitor wording.** Each was written\n"
        . "against English that has since changed, or against a key that no longer exists. Say which: keep it\n"
        . "as is, change it (give the new text), or remove it. CC applies your answer to the file.\n";
    foreach ($rows as $r) {
        $out .= "\n- **`" . $r['key'] . "`**\n";
        $out .= "  > " . str_replace("\n", "\n  > ", $r['english']) . "\n";
        $out .= "  *Why stale:* " . $r['reason'] . "\n";
        if ($r['recorded'] !== '' && $r['recorded'] !== $r['english']) {
            $out .= "  *Written against:* " . ecPlainOneLine($r['recorded']) . "\n";
        }
        $out .= "  *Current plain sentence:* " . ecPlainOneLine($r['plain'], 1000) . "\n";
        $ruling = ecPlainRuling($root, $r);
        if ($ruling === null) { $out .= "  " . $flag . "\n"; }
        else {
            $out .= "  _Answered " . ($ruling['ruled'] ?? '') . ": "
                . str_replace("\n", ' ', trim((string)($ruling['answer'] ?? 'OK'))) . "_\n";
        }
    }
    return $out;
}
