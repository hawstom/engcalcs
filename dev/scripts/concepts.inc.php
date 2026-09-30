<?php
/**
 * Shared reader for the concept layer of glossary.json and for dev/scripts/key_concepts.json.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * ROADMAP Task 737. Tom, 2026-09-29: *"We need to have a source that is more primary and more
 * authoritative than the English, and the English can be a translation of it. We should use the
 * English as our translation source only when the primary term is empty."* Each glossary term
 * carries a unique `concept` id and a `definition`; English is `translations.en`, one rendering
 * among 27. generate_translation_payloads.php and concept_check.php both read the layer through
 * these functions, so the two cannot disagree about which key cites which concept.
 * Design record: dev/term-concepts.md.
 */

const EC_KEY_CONCEPTS_PATH = __DIR__ . '/key_concepts.json';

/**
 * concept id => glossary term entry. The FIRST entry wins on a duplicate id; concept_check.php
 * reports duplicates, so a generator run never has to choose silently for long.
 */
function ecConceptIndex(array $terms): array
{
    $index = [];
    foreach ($terms as $term) {
        if (!is_array($term)) { continue; }
        $id = trim((string)($term['concept'] ?? ''));
        if ($id === '' || isset($index[$id])) { continue; }
        $index[$id] = $term;
    }
    return $index;
}

/** The English rendering of a term: translations.en, else the term name without a parenthetical. */
function ecConceptEnglish(array $term): string
{
    $tr = $term['translations'] ?? [];
    if (is_array($tr) && isset($tr['en']) && trim((string)$tr['en']) !== '') {
        return trim((string)$tr['en']);
    }
    return trim((string)preg_replace('/\s*\([^)]*\)\s*$/', '', (string)($term['term'] ?? '')));
}

/** Folds an id or a rendering to one comparable form: lower case, runs of non-letters to one space. */
function ecConceptFold(string $s): string
{
    $s = function_exists('mb_strtolower') ? mb_strtolower($s, 'UTF-8') : strtolower($s);
    return trim((string)preg_replace('/[^\p{L}\p{N}]+/u', ' ', $s));
}

/** key => list of concept ids, from key_concepts.json. Fails loudly: a silent empty map delivers nothing. */
function ecLoadKeyConcepts(?string $path = null): array
{
    $path = $path ?? EC_KEY_CONCEPTS_PATH;
    $raw = @file_get_contents($path);
    $data = is_string($raw) ? json_decode($raw, true) : null;
    if (!is_array($data) || !isset($data['keys']) || !is_array($data['keys'])) {
        fwrite(STDERR, 'ERROR: cannot read a "keys" map from ' . $path . "\n");
        exit(1);
    }
    $out = [];
    foreach ($data['keys'] as $key => $ids) {
        $out[(string)$key] = array_values(array_map('strval', is_array($ids) ? $ids : [$ids]));
    }
    return $out;
}

/**
 * Term names named by `gloss:` tags in one $ec_lang_syn value -- right of the pipe only, one tag
 * may list several terms comma-separated. The same parse as gloss_ref_check.php.
 */
function ecGlossPointerTerms(string $synValue): array
{
    $pipe = strpos($synValue, '|');
    if ($pipe === false) { return []; }
    if (!preg_match_all('/\bgloss:\s*([^;]+)/', substr($synValue, $pipe + 1), $m)) { return []; }
    $names = [];
    foreach ($m[1] as $raw) {
        foreach (explode(',', $raw) as $one) {
            $one = strtolower(trim($one));
            if ($one !== '') { $names[] = $one; }
        }
    }
    return $names;
}

/**
 * Every concept id a key cites: key_concepts.json first, then any `gloss:` pointer whose term
 * carries a concept. De-duplicated, order kept.
 *
 * @param array $termsByLowerName lower-cased term name => term entry
 */
function ecConceptsCitedByKey(string $key, array $keyConcepts, array $synMap, array $termsByLowerName): array
{
    $ids = $keyConcepts[$key] ?? [];
    if (isset($synMap[$key])) {
        foreach (ecGlossPointerTerms((string)$synMap[$key]) as $name) {
            $id = trim((string)($termsByLowerName[$name]['concept'] ?? ''));
            if ($id !== '') { $ids[] = $id; }
        }
    }
    return array_values(array_unique($ids));
}
