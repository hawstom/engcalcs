<?php
/**
 * Checks that the glossary's term names hold together: every term prefixToTermNames() names exists,
 * and no two terms share a name.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * It began (2026-08-12) as the check on `gloss:` pointers in $ec_lang_syn, Tom's "Gloss ref seems
 * more efficient in the long run." Those pointers moved into dev/scripts/key_concepts.json when
 * dev/plain-sentences.md replaced $ec_lang_syn (2026-10-16), and concept_check.php resolves every
 * citation there. What remains here is the name-keyed half, which nothing else checks:
 *
 *   1. Every term named in prefixToTermNames() exists (that map still decides where a
 *      sense-qualified term such as "run (a simulation)" is matched by its bare word).
 *   2. Two terms never share a name.
 *
 * Usage:
 *   php dev/scripts/gloss_ref_check.php            # report; exit 1 on any error
 */
require_once __DIR__ . '/prefix_terms.inc.php';

const GLOSSARY_FILE = __DIR__ . '/glossary.json';

$glossary = json_decode((string) file_get_contents(GLOSSARY_FILE), true);
if (!is_array($glossary) || !isset($glossary['terms'])) {
    fwrite(STDERR, "Could not read " . GLOSSARY_FILE . "\n");
    exit(2);
}
$termsByName = [];
foreach ($glossary['terms'] as $term) {
    if (isset($term['term'])) {
        $termsByName[strtolower((string) $term['term'])] = $term;
    }
}

$errors = [];
$warnings = [];

// ---------------------------------------------------------------------------------------------
// Does every term NAMED in prefixToTermNames() actually exist in the glossary?
//
// Added 2026-08-14 after the near-miss that motivated it. prefixToTermNames()['lpn'] named
// 'scenario' while glossary.json had no such term -- for how long, nobody knows. That name
// silently delivered NOTHING to every lpn_ agent, and no check could see it: the pointer check
// of the day only validated `gloss:` references written in $ec_lang_syn, and a prefix-map entry is
// not a pointer. It surfaced only because a human happened to seed the term for another reason.
//
// This is the same silent-delivery class CLAUDE.md documents at length for prefixToTermNames() --
// "payloads generate, --check says FRESH, the sprint runs, and the guards simply were never
// delivered" -- and the documentation had been in place the whole time without preventing it,
// which is the argument for a check rather than for reading more carefully.
//
// Duplicates are reported too: harmless to a sprint, but they mean two people wired the same term
// and neither saw the other's.
$mapErrors = [];
$mapWarnings = [];
foreach (prefixToTermNames() as $prefix => $names) {
    $seen = [];
    foreach ($names as $name) {
        $lc = strtolower($name);
        if (!isset($termsByName[$name]) && !isset($termsByName[$lc])) {
            $mapErrors[] = "prefixToTermNames()['$prefix'] names '$name', which is not a term in "
                . "glossary.json. It delivers nothing, silently, to every $prefix" . "_ agent.";
        }
        if (isset($seen[$lc])) {
            $mapWarnings[] = "prefixToTermNames()['$prefix'] lists '$name' twice.";
        }
        $seen[$lc] = true;
    }
}
$errors = array_merge($errors, $mapErrors);
$warnings = array_merge($warnings, $mapWarnings);

echo "glossary term names checked\n";
printf("  %d error(s), %d warning(s)\n\n", count($errors), count($warnings));

foreach ($errors as $e)   { echo "ERROR   $e\n\n"; }
foreach ($warnings as $w) { echo "WARN    $w\n\n"; }

if ($mapErrors) {
    echo "A term named in prefixToTermNames() but absent from glossary.json is invisible: nothing\n";
    echo "warns, the payload still generates, and every agent for that prefix is simply never given\n";
    echo "the guard. Add the term to glossary.json, or remove the name from the map.\n\n";
}
if ($errors) {
    exit(1);
}
/* ---------------------------------------------------------------------------------------------
 * TWO TERMS MAY NOT SHARE A NAME, and this is the check that would have saved two of them.
 *
 * `termIndexByName()` keys the glossary by the term's NAME, so when two entries carry the same one
 * the later simply WINS and the earlier is never delivered to any translation agent. Nothing warns:
 * payloads generate, --check says FRESH, the sprint runs, and the losing entry's cautions were never
 * shown to anybody. Found 2026-08-25 (ROADMAP Task 513), twice over in one file:
 *
 *   - `ponding` as ids 34 and 46. Entry 34's "this is a design goal, not flooding" rule had been
 *     invisible to every sprint that ever ran.
 *   - `scenario` as id 82 and as an entry keyed by the literal string. The string-keyed one won, so
 *     translators saw a Swahili-specific note and NOT the three general cautions or the
 *     case/variant framing.
 *
 * Both are merged. This check is here so the third one is caught in seconds rather than by a census
 * somebody happened to run.
 */
$seenNames = array();
$dupNames  = array();
foreach ($glossary['terms'] as $key => $term) {
    if (!is_array($term) || !isset($term['term'])) { continue; }
    $n = $term['term'];
    if (isset($seenNames[$n])) { $dupNames[$n][] = $key; }
    else { $seenNames[$n] = $key; }
}
if ($dupNames) {
    foreach ($dupNames as $n => $laterKeys) {
        echo "DUPLICATE TERM NAME: \"$n\" appears as " . $seenNames[$n] . " and " .
             implode(', ', $laterKeys) . "\n";
    }
    echo "\nOnly ONE entry may carry a given term name. termIndexByName() keys by name, so the\n";
    echo "later entry wins every payload and the earlier one is delivered to nobody -- silently.\n";
    echo "Merge them into one entry and delete the other.\n";
    exit(1);
}

echo "PASS: every term the prefix map names exists, and no two terms share a name.\n";
exit(0);
