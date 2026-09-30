<?php
/**
 * concept_check.php -- the glossary's concept table is unambiguous and every key's citation of it
 * resolves. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. ROADMAP Task 737 makes a concept record, not the English string, the source a
 * translator works from: Tom, 2026-09-28, wants "a keywords table where we are less concerned
 * about what key you assign to each row as that they be unique and canonical". Unique and
 * canonical is exactly what fails silently. Two terms sharing a concept id means one definition is
 * never delivered (ecConceptIndex() keeps the first); an id that reads as another concept's English
 * name puts the ambiguity the table exists to remove back into the table; and a key citing an id
 * that does not exist delivers nothing while the payload still generates and `--check` still says
 * FRESH. Any of the three ends as a wrong or inconsistent term shipped in 26 languages, which a
 * visitor reads and a reviewer reading English never sees.
 *
 *   1. Every glossary term has a concept id of the form [a-z][a-z0-9-]*, and a string definition
 *      (an empty definition is legal: it means English stays the source for that concept).
 *   2. No two terms share a concept id.
 *   3. No concept id folds to the same words as ANOTHER term's English rendering or term name.
 *   4. Every key in key_concepts.json exists in lib/lang.ec.en.php and cites at least one id, and
 *      every id it cites exists.
 *
 * Two concepts may share an English rendering ("Label" is both sally and a custom property's
 * display name). That is not an error: it is the case the concept layer exists for.
 *
 *   php dev/scripts/concept_check.php
 */

require_once __DIR__ . '/concepts.inc.php';

/**
 * @param array $terms        glossary.json terms (any keys)
 * @param array $keyConcepts  key => list of concept ids
 * @param array $enKeys       key => English value
 * @return string[] one sentence per problem
 */
function ecConceptFindings(array $terms, array $keyConcepts, array $enKeys): array
{
    $problems = [];
    $idOwner = [];      // id => term name
    $renderings = [];   // folded rendering or term name => list of term names

    foreach ($terms as $slot => $term) {
        if (!is_array($term)) { continue; }
        $name = (string)($term['term'] ?? "(slot $slot)");
        $id = $term['concept'] ?? null;
        if (!is_string($id) || $id === '') {
            $problems[] = "Term \"$name\" has no concept id. Every row of the table needs one, so a "
                . 'key can cite it; give it a unique id (a plain one for a quantity, a coined one '
                . 'for an interface element).';
            continue;
        }
        if (!preg_match('/^[a-z][a-z0-9-]*$/', $id)) {
            $problems[] = "Term \"$name\" has concept id \"$id\"; an id is lower case letters, digits "
                . 'and hyphens, starting with a letter, so it can be cited without quoting.';
        }
        if (!array_key_exists('definition', $term) || !is_string($term['definition'])) {
            $problems[] = "Term \"$name\" (concept $id) has no definition string. Write one, or set it "
                . 'to "" to say English stays the source for this concept.';
        }
        if (isset($idOwner[$id])) {
            $problems[] = "Concept id \"$id\" is used by both \"{$idOwner[$id]}\" and \"$name\". Only "
                . 'the first is ever delivered to a translator; give one of them a different id.';
        } else {
            $idOwner[$id] = $name;
        }
        foreach ([ecConceptEnglish($term), $name] as $r) {
            $f = ecConceptFold($r);
            if ($f !== '' && !in_array($name, $renderings[$f] ?? [], true)) { $renderings[$f][] = $name; }
        }
    }

    foreach ($idOwner as $id => $owner) {
        $f = ecConceptFold($id);
        foreach ($renderings[$f] ?? [] as $other) {
            if ($other === $owner) { continue; }
            $problems[] = "Concept id \"$id\" (term \"$owner\") reads as the English name of a "
                . "different term, \"$other\". A reader of the table could take one for the other; "
                . 'choose an id that names only its own concept.';
        }
    }

    foreach ($keyConcepts as $key => $ids) {
        if (!array_key_exists($key, $enKeys)) {
            $problems[] = "key_concepts.json cites $key, which is not a key in lib/lang.ec.en.php. "
                . 'Renamed or deleted; update or remove the line.';
        }
        if (!$ids) {
            $problems[] = "key_concepts.json lists $key with no concept id.";
        }
        foreach ($ids as $id) {
            if (!isset($idOwner[$id])) {
                $problems[] = "$key cites concept \"$id\", which no glossary term carries. The citation "
                    . 'delivers nothing, and nothing else would say so.';
            }
        }
    }

    return $problems;
}

if (defined('CONCEPT_CHECK_LIB_ONLY')) {
    return;
}

$glossary = json_decode((string)@file_get_contents(__DIR__ . '/glossary.json'), true);
if (!is_array($glossary) || !isset($glossary['terms']) || !is_array($glossary['terms'])) {
    echo "concept_check.php cannot read dev/scripts/glossary.json.\n";
    exit(1);
}
$ec_lang = [];
$ec_lang_syn = [];
include __DIR__ . '/../../lib/lang.ec.en.php';

$keyConcepts = ecLoadKeyConcepts();
$problems = ecConceptFindings($glossary['terms'], $keyConcepts, $ec_lang);

if ($problems) {
    foreach ($problems as $p) { echo "ERROR   $p\n\n"; }
    echo count($problems) . " problem(s) in the concept table (dev/term-concepts.md).\n";
    exit(1);
}

$index = ecConceptIndex($glossary['terms']);
$defined = count(array_filter($index, static function ($t) { return trim((string)$t['definition']) !== ''; }));
printf("PASS: %d concepts, all ids unique and unambiguous (%d with a definition, %d with English as the source); %d keys cite concepts, all resolve.\n",
    count($index), $defined, count($index) - $defined, count($keyConcepts));
exit(0);
