<?php
/**
 * Checks that every `gloss:` pointer in $ec_lang_syn actually delivers something.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. Tom, 2026-08-12, on whether repeated synonyms should be replaced by a pointer
 * to one glossary entry: *"Gloss ref seems more efficient in the long run."* He is right, and the
 * efficiency is real — one entry to maintain instead of the same gloss copied into four labels,
 * and the glossary can carry an `avoid` list that an inline parenthetical cannot.
 *
 * But a pointer buys that efficiency with a DEPENDENCY, and this project has already been bitten by
 * exactly this dependency failing in silence. A glossary term only reaches a translation agent if
 * the key's prefix is listed in prefixToTermNames(). `lpn` and `bpn` were missing from that map for
 * months: payloads generated, `--check` said FRESH, sprints ran, and every avoid-array written for
 * those calculators was simply never delivered. Nothing warned anybody.
 *
 * An inline synonym always arrives. A pointer arrives only if three things line up. So the rule
 * that makes pointers safe is not "be careful" — it is this check:
 *
 *   1. `gloss: X` names a term that exists in glossary.json.
 *   2. That term is wired to the prefix of the key carrying the pointer.
 *   3. The entry still says something. A pointer plus nothing, where the glossary entry is also
 *      empty of the label's own wordings, is a WARNING rather than an error — it may be right, but
 *      it is the shape that the retired Task 132 trimming exception used to produce by accident.
 *
 * Usage:
 *   php dev/scripts/gloss_ref_check.php            # report; exit 1 on any error
 *   php dev/scripts/gloss_ref_check.php --verbose  # also list every pointer that is fine
 */
require_once __DIR__ . '/prefix_terms.inc.php';

const EN_LANG_FILE  = __DIR__ . '/../../lib/lang.ec.en.php';
const GLOSSARY_FILE = __DIR__ . '/glossary.json';

$opts    = getopt('', ['verbose']);
$verbose = isset($opts['verbose']);

// Loaded the same way generate_translation_payloads.php loads it -- by including the file and
// taking the array PHP itself built. The regex parser in lang_parse.inc.php reads $ec_lang only,
// and a second pattern for $ec_lang_syn would be one more thing that could disagree with what the
// generator actually delivers.
$ec_lang = [];
$ec_lang_syn = [];
include EN_LANG_FILE;
$syn = is_array($ec_lang_syn) ? $ec_lang_syn : [];

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

$prefixMap = prefixToTermNames();
// Mirror buildPrefixGlossary()'s fallback exactly. A prefix that is NOT in the map does not fail
// open — it silently gets these three and nothing else, which is the whole trap.
$defaultTerms = ['flow', 'velocity', 'slope'];

$errors = [];
$warnings = [];
$ok = 0;

foreach ($syn as $key => $value) {
    $pipe = strpos($value, '|');
    if ($pipe === false) continue;               // no commentary, so no pointer
    $payload    = trim(substr($value, 0, $pipe));
    $commentary = substr($value, $pipe + 1);

    // Tags are `tag: value`, semicolon-separated. A gloss value may contain spaces and parentheses
    // ("default (setting)"), so it runs to the next semicolon or the end.
    if (!preg_match_all('/\bgloss:\s*([^;]+)/', $commentary, $m)) continue;

    $prefix = strpos($key, '_') !== false ? substr($key, 0, strpos($key, '_')) : $key;
    $wired  = $prefixMap[$prefix] ?? $defaultTerms;
    $wiredLower = array_map('strtolower', $wired);
    $prefixIsMapped = isset($prefixMap[$prefix]);

    // ONE gloss tag may name SEVERAL terms, comma-separated -- `gloss: lateral, mainline, reach`
    // is the established shape in ip_ and rc_. Splitting on commas is safe because no glossary term
    // contains one; the parenthesised ones ("default (setting)") use parentheses precisely so they
    // do not need a comma.
    $termNames = [];
    foreach ($m[1] as $raw) {
        foreach (explode(',', $raw) as $one) { $termNames[] = trim($one); }
    }
    foreach ($termNames as $raw) {
        $termName = strtolower(trim($raw));
        if ($termName === '') continue;

        if (!isset($termsByName[$termName])) {
            $errors[] = "$key -> gloss: $termName — NO SUCH TERM in glossary.json. The pointer "
                . "delivers nothing at all; a translator sees the label and no guidance.";
            continue;
        }
        if (!in_array($termName, $wiredLower, true)) {
            $errors[] = "$key -> gloss: $termName — term exists, but prefix '$prefix' is "
                . ($prefixIsMapped
                    ? "wired to " . count($wired) . " term(s) that do NOT include it"
                    : "NOT LISTED in prefixToTermNames(), so it falls back to the three default "
                      . "terms (flow, velocity, slope)")
                . ". The glossary entry, including its avoid list, never reaches the agent.";
            continue;
        }
        // Wired and real. Now the softer question: does the pointer actually carry anything?
        //
        // DELIBERATELY NARROW. A pointer-only entry is the SHAPE Tom asked for -- "gloss ref seems
        // more efficient in the long run" -- so warning on all of them would fight the decision
        // this check exists to make safe. What is worth flagging is a pointer to an entry that is
        // itself still empty: no avoid list, no translations, nothing but a context paragraph. That
        // is a pointer to a promise. It resolves today and delivers on the day the glossary is
        // filled in, which for a new concept is the sprint that is about to run.
        $entry = $termsByName[$termName];
        $carriesSomething = !empty($entry['avoid']) || !empty($entry['translations']);
        if ($payload === '' && !$carriesSomething) {
            $warnings[] = "$key -> gloss: $termName — pointer only, to a glossary entry that has no "
                . "avoid list and no translations yet. It resolves, but there is nothing there to "
                . "deliver until the entry is filled in.";
        }
        $ok++;
    }
}

// ---------------------------------------------------------------------------------------------
// SECOND CHECK: does every term NAMED in prefixToTermNames() actually exist in the glossary?
//
// Added 2026-08-14 after the near-miss that motivated it. prefixToTermNames()['lpn'] named
// 'scenario' while glossary.json had no such term -- for how long, nobody knows. That name
// silently delivered NOTHING to every lpn_ agent, and no check could see it: the pointer check
// above only validates `gloss:` references written in $ec_lang_syn, and a prefix-map entry is not
// a pointer. It surfaced only because a human happened to seed the term for another reason.
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

echo "gloss: pointers checked in " . basename(EN_LANG_FILE) . "\n";
printf("  %d delivering, %d error(s), %d warning(s)\n\n", $ok, count($errors), count($warnings));

foreach ($errors as $e)   { echo "ERROR   $e\n\n"; }
foreach ($warnings as $w) { echo "WARN    $w\n\n"; }

if ($verbose && $ok > 0) {
    echo "All other pointers resolve to a real term that is wired to their key's prefix.\n";
}

if ($mapErrors) {
    echo "A term named in prefixToTermNames() but absent from glossary.json is invisible: nothing\n";
    echo "warns, the payload still generates, and every agent for that prefix is simply never given\n";
    echo "the guard. Add the term to glossary.json, or remove the name from the map.\n\n";
}
if ($errors) {
    echo "A gloss pointer that does not resolve is WORSE than no pointer: the synonyms it replaced\n";
    echo "are gone and nothing took their place. Fix the term name, or wire the prefix in\n";
    echo "dev/scripts/prefix_terms.inc.php, before any sprint runs.\n";
    exit(1);
}
echo "PASS: every gloss pointer resolves and is wired to its prefix.\n";
exit(0);
