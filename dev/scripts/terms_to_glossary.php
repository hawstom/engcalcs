<?php
/**
 * terms_to_glossary.php -- writes dev/terms.md into glossary.json. dev/terms.md is the source;
 * glossary.json follows it, never the reverse.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * Tom, 2026-10-16: "I am very eager to base the glossary on a human-editable terms file." He edits
 * dev/terms.md; this script carries into glossary.json, per concept id:
 *   plain              the entry's heading, the plain-words name translators work from
 *   definition         the entry's Definition line, Tom's words, or '' where he wrote none
 *   uniqueness_group   the group number, absent when the entry is in none
 * and the concept list itself: an id new in terms.md becomes a glossary term, and a glossary term
 * whose id is gone from terms.md is removed. A replaced definition is kept as old_definition,
 * unsent. Translations, symbols and sprint notes stay in glossary.json, where sprints write them.
 *
 *   php dev/scripts/terms_to_glossary.php           report what would change; exit 1 if anything
 *   php dev/scripts/terms_to_glossary.php --write   write glossary.json
 */

const EC_TERMS_PATH = __DIR__ . '/../terms.md';
const EC_TERMS_GLOSSARY_PATH = __DIR__ . '/glossary.json';

/**
 * Parses dev/terms.md. Returns ['entries' => id => {plain, english, definition, group},
 * 'groups' => number => text]. Fails loudly on an entry with no id or English line.
 */
function ecParseTerms(string $text): array
{
    $entries = [];
    $groups = [];
    $parts = preg_split('/^## /m', $text);
    foreach ($parts as $part) {
        if (strncmp($part, 'Uniqueness attention', 20) === 0) {
            preg_match_all('/^(\d+)\. (.+)$/m', $part, $m, PREG_SET_ORDER);
            foreach ($m as $g) { $groups[(int)$g[1]] = trim($g[2]); }
        }
        if (strncmp($part, 'Entries', 7) !== 0) { continue; }
        foreach (array_slice(preg_split('/^### /m', $part), 1) as $block) {
            $lines = explode("\n", trim($block));
            // The heading is capitalized as a heading; the name is stored as it runs in a sentence.
            $plain = trim($lines[0]);
            if (preg_match('/^\p{Lu}\p{Ll}/u', $plain)) { $plain = mb_strtolower(mb_substr($plain, 0, 1)) . mb_substr($plain, 1); }
            $e = ['plain' => $plain, 'english' => '', 'definition' => '', 'group' => null];
            $id = '';
            foreach (array_slice($lines, 1) as $line) {
                if (!preg_match('/^- ([^:]+): (.*)$/', trim($line), $f)) { continue; }
                $v = trim($f[2]);
                switch ($f[1]) {
                    case 'English': $e['english'] = $v; break;
                    case 'id': $id = trim($v, '`'); break;
                    case 'Definition': $e['definition'] = $v; break;
                    case 'Uniqueness attention':
                        $e['group'] = preg_match('/(\d+)/', $v, $n) ? (int)$n[1] : null;
                        break;
                }
            }
            if ($id === '' || $e['english'] === '') {
                fwrite(STDERR, "ERROR: dev/terms.md entry \"{$e['plain']}\" needs both an English line and an id line.\n");
                exit(1);
            }
            if (isset($entries[$id])) {
                fwrite(STDERR, "ERROR: dev/terms.md uses the id $id twice.\n");
                exit(1);
            }
            $entries[$id] = $e;
        }
    }
    return ['entries' => $entries, 'groups' => $groups];
}

/**
 * Applies the parsed terms to a decoded glossary. Returns [glossary, list of change sentences].
 */
function ecApplyTerms(array $glossary, array $parsed): array
{
    $changes = [];
    $entries = $parsed['entries'];
    $seen = [];
    foreach ($glossary['terms'] as $slot => $term) {
        $id = (string)($term['concept'] ?? '');
        if (!isset($entries[$id])) {
            unset($glossary['terms'][$slot]);
            $changes[] = "remove $id (no longer in dev/terms.md)";
            continue;
        }
        $seen[$id] = true;
        $e = $entries[$id];
        $new = $term;
        $new['plain'] = $e['plain'];
        if ((string)($term['definition'] ?? '') !== $e['definition']) {
            if (trim((string)($term['definition'] ?? '')) !== '' && !isset($term['old_definition'])) {
                $new['old_definition'] = (string)$term['definition'];
            }
            $new['definition'] = $e['definition'];
        }
        if ($e['group'] !== null) { $new['uniqueness_group'] = $e['group']; } else { unset($new['uniqueness_group']); }
        if ($new !== $term) {
            $glossary['terms'][$slot] = $new;
            $changes[] = "update $id";
        }
    }
    foreach ($entries as $id => $e) {
        if (isset($seen[$id])) { continue; }
        $english = trim((string)preg_replace('/\s*\([^)]*\)\s*$/', '', $e['english']));
        $term = [
            'term' => $e['english'], 'concept' => $id, 'plain' => $e['plain'],
            'definition' => $e['definition'], 'symbol' => '', 'context' => '',
            'translation_notes' => '', 'translations' => ['en' => $english],
            'source' => 'dev/terms.md',
        ];
        if ($e['group'] !== null) { $term['uniqueness_group'] = $e['group']; }
        $glossary['terms'][$e['english']] = $term;
        $changes[] = "add $id";
    }
    $glossary['meta']['uniqueness_groups'] = array_map('strval', $parsed['groups']);
    return [$glossary, $changes];
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === realpath(__FILE__)) {
    $write = in_array('--write', $argv, true);
    $parsed = ecParseTerms((string)file_get_contents(EC_TERMS_PATH));
    $glossary = json_decode((string)file_get_contents(EC_TERMS_GLOSSARY_PATH), true);
    if (!is_array($glossary) || !isset($glossary['terms'])) {
        fwrite(STDERR, "ERROR: cannot read glossary.json.\n");
        exit(1);
    }
    [$out, $changes] = ecApplyTerms($glossary, $parsed);
    $groupsChanged = ($glossary['meta']['uniqueness_groups'] ?? null) !== $out['meta']['uniqueness_groups'];
    if (!$changes && !$groupsChanged) {
        printf("PASS: glossary.json matches dev/terms.md (%d concepts).\n", count($parsed['entries']));
        exit(0);
    }
    if (!$write) {
        echo "FAIL: glossary.json differs from dev/terms.md. Run: php dev/scripts/terms_to_glossary.php --write\n";
        foreach (array_slice($changes, 0, 20) as $c) { echo "  $c\n"; }
        exit(1);
    }
    file_put_contents(EC_TERMS_GLOSSARY_PATH, json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
    printf("Wrote glossary.json: %d changes.\n", count($changes) + ($groupsChanged ? 1 : 0));
}
