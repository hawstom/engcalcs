<?php
/**
 * Translation payload generator.
 *
 * Writes per-language JSON payloads containing only missing/untranslated keys,
 * plus neighboring translated context for tone/register consistency.
 *
 * Keys listed in translation_exempt_keys.json are allowed to be byte-identical to
 * English (symbols, eponyms, brands, cognates) and are not counted as delta, so a
 * delta of zero means zero -- ROADMAP Task 161. They are still reported when
 * missing or blank, and are echoed back in payload['meta']['exempt_keys'].
 *
 * Keys OUT OF SCOPE for a language under translation_coverage.json (ROADMAP Tasks
 * 203/204) are likewise not counted as delta and are not sent to an agent -- a body we
 * have decided not to translate into a non-core language must not be quietly bought
 * anyway by a sprint that could not tell the difference. The count is echoed in
 * payload['meta']['out_of_scope_key_count'] so the suppression stays visible.
 *
 * Optional sibling map support in lib/lang.ec.en.php:
 *   $ec_lang_syn['some_key'] = 'Synonyms a translator can re-compress | layout: button; avoid: X';
 * Left of the first pipe: every phrase must pass the substitution test -- it could stand in the
 * slot as the label itself. Emitted to payload['key_syn'][key]. Right of the pipe: commentary
 * tags, emitted to payload['key_notes'][key] as the full instructions from the tag table in
 * dev/language-strings.md (gloss: pointers excepted; their terms arrive in key_concepts and
 * glossary).
 *
 * Per-key delivery, Appendix D step 1 of dev/translation-clarification-review.md: keys whose
 * English was reworded since the last sync (detect_english_drift.php CHANGED) are in
 * keys_to_translate with reason english_changed; a label and its _tip travel together in
 * key_context; and payload['glossary'] holds only the terms this batch's strings use, once.
 *
 * Usage:
 *   php scripts/generate_translation_payloads.php
 *   php scripts/generate_translation_payloads.php --prefix=dw
 *   php scripts/generate_translation_payloads.php --lang=fr,uk --prefix=dw
 *   php scripts/generate_translation_payloads.php /tmp/payloads
 *   php scripts/generate_translation_payloads.php /tmp/out --lang=am --as-changed=mi_station
 *     (inspect what a translator receives for a key, treated as reworded English)
 */

const DEFAULT_LANG_DIR = __DIR__ . '/../../lib';
const DEFAULT_OUTPUT_DIR = __DIR__ . '/../../dev/translation_payloads';
const GLOSSARY_PATH = __DIR__ . '/glossary.json';
// The one canonical copy of the translator's suggestion-box instruction (ROADMAP Task 239). It is
// extracted into every payload rather than retyped into every sprint's prompt, because a step that
// has to be remembered per sprint is a step that gets forgotten -- and an agent that never received
// it cannot file the complaint friction_check.php is waiting for.
const SUGGESTION_BOX_SOURCE = __DIR__ . '/../translation-process.md';
const SUGGESTION_BOX_HEADING = '## The suggestion box';
// ROADMAP Task 737. The sibling block: what a translator does with a concept's definition. Extracted
// the same way and for the same reason as the suggestion box.
const CONCEPT_SOURCE_HEADING = '## Concepts are the source';
const EN_FILE = DEFAULT_LANG_DIR . '/lang.ec.en.php';
// Appendix D step 1 of dev/translation-clarification-review.md. The `$ec_lang_syn` commentary tags
// (`layout:`, `avoid:`, `symbol`, `runtime:`) are shorthand for a full instruction written once, in
// the tag table of dev/language-strings.md. The payload carries the full instruction, read from that
// table, so the translator never has to know the shorthand and the two cannot drift apart.
const TAG_TABLE_SOURCE = __DIR__ . '/../language-strings.md';
const TAG_TABLE_HEADING = '### `$ec_lang_syn` format';
// The English-drift manifest detect_english_drift.php keeps. A key whose English hash no longer
// matches it was reworded after its translations were written; those keys travel in
// keys_to_translate with reason english_changed instead of on a separate English-only list.
const DRIFT_MANIFEST = __DIR__ . '/english_string_hashes.json';
const TARGET_LANGS = [
    'am', 'ar', 'bg', 'bn', 'cs', 'de', 'es', 'fa', 'fr', 'he', 'hi', 'hr', 'id', 'it', 'km', 'my',
    'ps', 'pt', 'ro', 'ru', 'sr', 'sw', 'tr', 'uk', 'ur', 'zh',
];

require_once __DIR__ . '/exempt_keys.inc.php';
require_once __DIR__ . '/prefix_terms.inc.php';
require_once __DIR__ . '/coverage.inc.php';
require_once __DIR__ . '/concepts.inc.php';

main($argv);

function main(array $argv): void
{
    $opts = parseArgs($argv);

    if (!file_exists(EN_FILE)) {
        fail('English language file not found: ' . EN_FILE);
    }
    if (!file_exists(GLOSSARY_PATH)) {
        fail('Glossary file not found: ' . GLOSSARY_PATH);
    }
    if (!file_exists(EC_EXEMPT_KEYS_PATH)) {
        fail('Exempt-key file not found: ' . EC_EXEMPT_KEYS_PATH);
    }

    if ($opts['check']) {
        exit(runFreshnessCheck($opts));
    }

    if (!is_dir($opts['output_dir']) && !mkdir($opts['output_dir'], 0755, true) && !is_dir($opts['output_dir'])) {
        fail('Unable to create output directory: ' . $opts['output_dir']);
    }

    $built = buildPayloads($opts);
    foreach ($built['files'] as $name => $content) {
        file_put_contents($opts['output_dir'] . '/' . $name, $content);
    }

    echo 'Generated ' . $built['generated_count'] . " payload files in: {$opts['output_dir']}\n";
    echo 'Active prefixes: ' . implode(', ', $built['active_prefixes']) . "\n";
    echo "Exempt (correctly identical to English, not counted as delta): {$built['exempt_total']} across all languages.\n";
    echo "Out of scope (deliberately untranslated per the coverage declaration): {$built['out_of_scope_total']} across all languages.\n";
    echo $built['coverage_summary'] . "\n";
}

/**
 * Build every payload IN MEMORY, keyed by the filename it belongs in.
 *
 * Pulled out of main() so `--check` can decide freshness by CONTENT: it builds the same bytes and
 * compares them with what is on disk. Nothing here writes output, so the two callers cannot drift
 * into disagreeing about what a payload should say.
 *
 * @param bool $quiet Suppress the missing-lang-file warning, which a freshness check must not emit.
 * @return array{files:array<string,string>,generated_count:int,exempt_total:int,out_of_scope_total:int,active_prefixes:array,coverage_summary:string}
 */
function buildPayloads(array $opts, bool $quiet = false): array
{
    $enKeys = loadLangArray(EN_FILE);
    if (count($enKeys) === 0) {
        fail('No keys parsed from English language file.');
    }
    $enIntent = loadEnglishIntentMap(EN_FILE);

    $glossaryData = readJsonFile(GLOSSARY_PATH);
    if (!isset($glossaryData['terms']) || !is_array($glossaryData['terms'])) {
        fail('Invalid glossary JSON structure in: ' . GLOSSARY_PATH);
    }

    $suggestionBox = loadFencedBlock(SUGGESTION_BOX_HEADING);
    $conceptSource = loadFencedBlock(CONCEPT_SOURCE_HEADING);
    $exemptMap = ecLoadExemptMap();
    $coverage = ecLoadCoverage();
    $termIndex = termIndexByName($glossaryData['terms']);
    $prefixMap = prefixToTermNames();
    $conceptIndex = ecConceptIndex($glossaryData['terms']);
    $keyConcepts = ecLoadKeyConcepts();
    $tagTable = loadTagTable();
    $changedKeys = loadEnglishChangedKeys($enKeys);
    foreach ($opts['as_changed'] as $k) {
        if (!array_key_exists($k, $enKeys)) {
            fail('--as-changed names a key that is not in lang.ec.en.php: ' . $k);
        }
        $changedKeys[$k] = true;
    }

    $detectedPrefixes = detectPrefixes($enKeys);
    $activePrefixes = $detectedPrefixes;
    if ($opts['requested_prefix'] !== null) {
        $activePrefixes = array_values(array_filter($activePrefixes, static function ($p) use ($opts) {
            return $p === $opts['requested_prefix'];
        }));

        if (count($activePrefixes) === 0) {
            fail('Requested prefix not found in English keys: ' . $opts['requested_prefix']);
        }
    }

    $files = [];
    $files['lang.en.json'] = json_encode([
        'language' => 'en',
        'keys' => $enKeys,
        'count' => count($enKeys),
        'active_prefixes' => $activePrefixes,
        'requested_prefix' => $opts['requested_prefix'],
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    $langs = resolveTargetLanguages($opts['languages']);
    $generatedCount = 0;
    $exemptTotal = 0;
    $outOfScopeTotal = 0;

    foreach ($langs as $lang) {
        $targetFile = DEFAULT_LANG_DIR . "/lang.ec.{$lang}.php";
        if (!file_exists($targetFile)) {
            if (!$quiet) { fwrite(STDERR, "WARN: target language file missing, skipping: {$targetFile}\n"); }
            continue;
        }

        $current = loadLangArray($targetFile);
        [$deltaKeys, $keyContext, $exemptKeys, $outOfScopeKeys] =
            collectDeltaAndContext($enKeys, $current, $activePrefixes, $lang, $exemptMap, $coverage, $changedKeys);
        $keyContext = attachTipPairs($keyContext, $enKeys, $current);
        $keySyn = collectKeySyn($deltaKeys, $enKeys, $enIntent);
        $keyNotes = collectKeyNotes($deltaKeys, $enIntent, $tagTable);
        $keyConceptMap = collectKeyConcepts($deltaKeys, $keyConcepts, $enIntent, $termIndex, $conceptIndex, $lang);
        $exemptTotal += count($exemptKeys);
        $outOfScopeTotal += count($outOfScopeKeys);
        $changedCount = count(array_filter($keyContext, static function ($c) {
            return ($c['reason'] ?? '') === 'english_changed';
        }));

        $prefixesInDelta = detectPrefixes($deltaKeys);
        $batchTerms = selectBatchTerms($deltaKeys, $glossaryData['terms'], $keyConcepts, $enIntent, $termIndex, $prefixMap);
        $glossaryText = buildPromptContext($batchTerms, $lang);

        $payload = [
            'meta' => [
                'language' => $lang,
                'expected_key_count' => count($enKeys),
                'delta_key_count' => count($deltaKeys),
                // Of those, keys the file already holds whose ENGLISH was reworded after the
                // translation was written (detect_english_drift.php's CHANGED list).
                'english_changed_key_count' => $changedCount,
                // Keys that equal English legitimately (symbols, eponyms, brands, cognates) and were
                // therefore NOT counted as delta. Listed so the suppression is visible and auditable
                // rather than silent. See translation_exempt_keys.json (ROADMAP Task 161).
                'exempt_key_count' => count($exemptKeys),
                'exempt_keys' => $exemptKeys,
                // Keys this language is deliberately not being asked to translate, per the
                // coverage declaration (ROADMAP Tasks 203/204). Counted, not sent. Distinct
                // from exempt above: exempt means finished, this means not started by choice.
                'out_of_scope_key_count' => count($outOfScopeKeys),
                'coverage' => ecCoverageSummary($coverage),
                'active_prefixes' => $prefixesInDelta,
                'requested_prefix' => $opts['requested_prefix'],
                'notes' => 'Translate only keys in keys_to_translate; preserve HTML, units, and symbols.',
                'reason_notes' => 'key_context[key].reason says what to do with each key. missing: the key is not in your file; append it as a new line. blank, equal_to_english, english_changed: the key IS already in your file, holding key_context[key].current_value; REPLACE that value in place and never append a second line for the same key. english_changed means the English was reworded after your file\'s translation was written: translate the new English, and keep words from the old translation only where they still say what the new English says.',
                // ROADMAP Task 573 Wave 0. Two conventions that no per-key channel could carry,
                // because they are true of every key at once. The first exists because a dropped
                // {n} breaks a sentence in one language and nothing warns anybody; the second
                // because 20 of that pass's 136 findings were one defect -- a control's name
                // written into another string's prose, translated there as free words, naming
                // nothing the reader can find on the screen.
                'placeholder_notes' => 'A word in curly braces ({n}, {ids}, {flow}, {iterations}, {name}) is a PLACEHOLDER the page replaces at runtime. Keep every one of them, spelled exactly as in English, braces included. Never translate the word inside the braces. You MAY move a placeholder to wherever your language needs it in the sentence.',
                'control_name_notes' => 'Where an English string names a control, it names it in one of two shapes. A single control is written as its label followed by the widget word: "press the Calculate button", "the Recalculate automatically setting", "the Required fire flow box". A menu path is written as comma-separated labels: "File, Save as"; "Settings, Calculation, Hydraulics". In BOTH shapes the label is another key\'s value. Translate it with exactly the words you used for that key, so the sentence still names what is on the screen; translate the widget word and the surrounding prose normally.',
                'glossary_notes' => 'glossary lists the defined technical terms that the strings in this batch use, each with your language\'s preferred translation where one exists, and what the term MEANS. Use the preferred translation wherever the term appears, unless your language\'s genuine standard term is better; then use that and say so in your report.',
                'context_notes' => 'Use key_context[key].neighbors to keep register consistent with nearby translated strings. key_context[key].tip is the help text shown for that label, and key_context[key].label is the label a tip explains: read the pair together, and give the same thing the same word in both. Where the partner already has a translation in your file, its value is shown.',
                'syn_notes' => 'key_syn[key] gives other English wordings of that one string; any of them could stand in its place. Use whichever your language expresses most naturally and compactly; you are not bound to the literal English wording.',
                'key_notes_notes' => 'key_notes[key] are notes about that one string: how much room it has, symbols to keep exactly, what it refers to. Follow them. They are instructions to you, never text to put in your file.',
                'suggestion_box_notes' => 'Read suggestion_box and follow it. It is part of your instructions, not a footnote: a sprint does not close while a translator complaint is unanswered.',
                'concept_notes' => 'Read concept_source and follow it. key_concepts lists, for a key that names a defined concept, the definition you translate from; English is one rendering of it.',
            ],
            // ROADMAP Task 239. Extracted verbatim from dev/translation-process.md so it reaches
            // every agent, every language, every batch size, without being retyped per sprint.
            'suggestion_box' => $suggestionBox,
            // ROADMAP Task 737. Extracted verbatim from dev/translation-process.md, like the box above.
            'concept_source' => $conceptSource,
            // Only the glossary terms this batch's strings use, once, as text (Appendix D step 1).
            // It replaced prompt_context_by_prefix and glossary_terms_by_prefix, which sent every
            // term wired to a prefix (72 for lpn) twice over, as text and again as JSON.
            'glossary' => $glossaryText,
            'keys_to_translate' => $deltaKeys,
            // Backward-compatibility for scripts that still expect payload["keys"].
            'keys' => $deltaKeys,
            'key_context' => $keyContext,
            'key_syn' => $keySyn,
            'key_notes' => $keyNotes,
            'key_concepts' => $keyConceptMap,
        ];

        $files["payload_{$lang}.json"] = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $generatedCount++;
    }

    return [
        'files' => $files,
        'generated_count' => $generatedCount,
        'exempt_total' => $exemptTotal,
        'out_of_scope_total' => $outOfScopeTotal,
        'active_prefixes' => $activePrefixes,
        'coverage_summary' => ecCoverageSummary($coverage),
    ];
}

function parseArgs(array $argv): array
{
    $opts = [
        'output_dir' => DEFAULT_OUTPUT_DIR,
        'requested_prefix' => null,
        'languages' => [],
        'check' => false,
        // Keys to treat as if detect_english_drift.php reported them CHANGED. For inspecting what a
        // translator would receive for a key (and for the self-test); never used to build a sprint.
        'as_changed' => [],
    ];

    $positionals = [];
    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];
        if ($arg === '--check') {
            $opts['check'] = true;
            continue;
        }
        if (strpos($arg, '--prefix=') === 0) {
            $opts['requested_prefix'] = trim(substr($arg, strlen('--prefix=')));
            continue;
        }
        if (strpos($arg, '--as-changed=') === 0) {
            $opts['as_changed'] = splitCsv(substr($arg, strlen('--as-changed=')));
            continue;
        }
        if (strpos($arg, '--lang=') === 0) {
            $opts['languages'] = splitCsv(substr($arg, strlen('--lang=')));
            continue;
        }
        if ($arg === '--help' || $arg === '-h') {
            printHelpAndExit();
        }
        if (strpos($arg, '--') === 0) {
            fail('Unknown option: ' . $arg);
        }
        $positionals[] = $arg;
    }

    if (isset($positionals[0])) {
        $opts['output_dir'] = $positionals[0];
    }
    if ($opts['requested_prefix'] === null && isset($positionals[1])) {
        $opts['requested_prefix'] = trim($positionals[1]);
    }

    if ($opts['requested_prefix'] === '') {
        $opts['requested_prefix'] = null;
    }

    return $opts;
}

function printHelpAndExit(): void
{
    echo "Usage: php scripts/generate_translation_payloads.php [output_dir] [prefix]\n";
    echo "       php scripts/generate_translation_payloads.php --lang=fr,uk --prefix=dw\n";
    echo "       php scripts/generate_translation_payloads.php --check   (verify payloads are up to date; exit 1 if stale)\n";
    echo "       php scripts/generate_translation_payloads.php /tmp/out --lang=am --as-changed=mi_station\n";
    echo "           (inspect: treat the named keys as reworded English, as a translator would receive them)\n";
    exit(0);
}

/**
 * Freshness gate for sprint launchers. A payload is stale when the bytes it would be generated as
 * today differ from the bytes on disk. Prints a FRESH/STALE verdict and returns a shell exit code
 * (0 = fresh, 1 = stale/missing) so a sprint cannot launch on an old delta without a human ever
 * having to remember to regenerate.
 *
 * IT DECIDES BY CONTENT, NOT BY MTIME, and that is a correction rather than a refinement.
 *
 * The old version compared `filemtime(payload)` against the newest of its inputs, which made it
 * report every one of the 26 payloads stale in any tree where nothing had actually changed — and
 * this project produces such trees routinely. **`git pull` does not preserve mtimes** (CLAUDE.md
 * says so under Deploying, for the service worker's sake), and neither does a fresh worktree
 * checkout, which is how every parallel subagent starts. Four subagents in one session hit the
 * false alarm and each had to work out whether the failure was theirs. A BLOCKING check that cries
 * wolf on a clean checkout is precisely the shape dev/enforceable-rules-survey.md warns about: it
 * teaches people that a red line is nothing to worry about, which is the one thing a blocking check
 * must never teach.
 *
 * Content comparison also happens to be STRICTLY MORE ACCURATE in both directions. A touched file
 * whose content did not change is not stale, and an edit that lands with an older mtime — a
 * checkout, a restored backup — used to be invisible and now is not. And the list of inputs stops
 * being a thing anybody has to maintain: it was eight paths long, had already missed
 * `prefix_terms.inc.php` once when that include was split out, and would miss the next one the same
 * silent way. Building the payload IS the list of inputs.
 *
 * The cost is a full generation run per check, measured at about a second for all 26. That is the
 * whole price, and it buys a check that is right.
 */
function runFreshnessCheck(array $opts): int
{
    $built = buildPayloads($opts, true);

    $stale = [];
    $checked = 0;
    foreach ($built['files'] as $name => $content) {
        $checked++;
        $onDisk = $opts['output_dir'] . '/' . $name;
        if (!file_exists($onDisk)) {
            $stale[] = "{$name}: missing";
            continue;
        }
        $have = file_get_contents($onDisk);
        if ($have !== $content) {
            $stale[] = "{$name}: content differs (" . strlen($have) . ' bytes on disk, '
                . strlen($content) . ' as generated today)';
        }
    }

    if (count($stale) === 0) {
        echo "FRESH: all {$checked} payload file(s) match what the generator produces today.\n";
        return 0;
    }

    fwrite(STDERR, 'STALE: ' . count($stale) . " of {$checked} payload file(s) are out of date:\n");
    foreach ($stale as $s) {
        fwrite(STDERR, "  - {$s}\n");
    }
    fwrite(STDERR, 'Fix before launching a sprint: php ' . basename(__FILE__) . "\n");
    return 1;
}

function splitCsv(string $value): array
{
    $parts = array_filter(array_map('trim', explode(',', $value)), static function ($v) {
        return $v !== '';
    });
    return array_values(array_unique($parts));
}

function readJsonFile(string $path): array
{
    $raw = file_get_contents($path);
    if ($raw === false) {
        fail('Unable to read JSON file: ' . $path);
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        fail('Invalid JSON in file: ' . $path);
    }
    return $decoded;
}

function resolveTargetLanguages(array $requested): array
{
    if (count($requested) === 0) {
        return TARGET_LANGS;
    }

    $filtered = array_values(array_filter(TARGET_LANGS, static function ($lang) use ($requested) {
        return in_array($lang, $requested, true);
    }));

    if (count($filtered) === 0) {
        fail('No target languages matched --lang filter.');
    }

    return $filtered;
}

function loadLangArray(string $file): array
{
    $ec_lang = [];
    include $file;

    if (!is_array($ec_lang)) {
        fail('Language file did not produce $ec_lang array: ' . $file);
    }

    return $ec_lang;
}

/**
 * Pulls a translator-instruction block out of dev/translation-process.md -- the first fenced code
 * block under the given heading. Two headings use it: "## The suggestion box" (ROADMAP Task 239)
 * and "## Concepts are the source" (Task 737). One source of truth: the SOP shows the human what
 * the agent is told, and this hands the identical text to the agent through its own payload, so
 * the two cannot drift and a sprint that forgets to paste it still delivers it.
 *
 * A failure here is fatal on purpose. A payload that quietly shipped without the suggestion box
 * would take a whole sprint's findings with it, and nothing downstream would notice.
 */
function loadFencedBlock(string $heading): string
{
    if (!file_exists(SUGGESTION_BOX_SOURCE)) {
        fail('Translator-instruction source not found: ' . SUGGESTION_BOX_SOURCE);
    }
    $md = (string)file_get_contents(SUGGESTION_BOX_SOURCE);
    $at = strpos($md, $heading);
    if ($at === false) {
        fail('No "' . $heading . '" heading in ' . basename(SUGGESTION_BOX_SOURCE)
            . ' -- every payload carries that block, so it cannot be renamed without updating this script.');
    }
    if (!preg_match('/^```\n(.*?)^```/ms', substr($md, $at), $m)) {
        fail('No fenced block under "' . $heading . '" in ' . basename(SUGGESTION_BOX_SOURCE) . '.');
    }
    $block = trim($m[1]);
    if ($block === '') {
        fail('The block under "' . $heading . '" in ' . basename(SUGGESTION_BOX_SOURCE) . ' is empty.');
    }
    return $block;
}

/**
 * ROADMAP Task 737. For each delta key that cites a concept with a NON-EMPTY definition, the
 * concept record the translator translates from. A key citing only concepts whose definition is
 * empty gets no entry at all, so its payload is exactly what it was before the concept layer:
 * English stays the source. Citations come from key_concepts.json and from `gloss:` pointers.
 */
function collectKeyConcepts(array $deltaKeys, array $keyConcepts, array $synMap, array $termIndex, array $conceptIndex, string $lang): array
{
    $out = [];
    foreach ($deltaKeys as $key => $english) {
        $entries = [];
        foreach (ecConceptsCitedByKey($key, $keyConcepts, $synMap, $termIndex) as $id) {
            $term = $conceptIndex[$id] ?? null;
            if ($term === null || trim((string)($term['definition'] ?? '')) === '') {
                continue;
            }
            $entry = [
                'concept' => $id,
                'source' => 'definition',
                'definition' => (string)$term['definition'],
                'english_rendering' => ecConceptEnglish($term),
                'preferred_translation' => (string)($term['translations'][$lang] ?? ''),
            ];
            if (($term['symbol'] ?? '') !== '') {
                $entry['symbol'] = (string)$term['symbol'];
            }
            $entries[] = $entry;
        }
        if ($entries) {
            $out[$key] = $entries;
        }
    }
    return $out;
}

function loadEnglishIntentMap(string $file): array
{
    $ec_lang = [];
    $ec_lang_syn = [];
    include $file;

    if (!is_array($ec_lang_syn)) {
        return [];
    }

    return $ec_lang_syn;
}

function collectKeySyn(array $deltaKeys, array $enKeys, array $intentMap): array
{
    $result = [];

    foreach ($deltaKeys as $key => $english) {
        if (!array_key_exists($key, $intentMap)) {
            continue;
        }

        // Intent strings follow the convention "<intent> | <commentary>" (see CLAUDE.md,
        // Language Keys). Everything from the first pipe onward is non-translated commentary
        // (layout/avoid/gloss tags); strip it so payloads carry only the translatable intent.
        $intent = trim((string)$intentMap[$key]);
        $pipePos = strpos($intent, '|');
        if ($pipePos !== false) {
            $intent = trim(substr($intent, 0, $pipePos));
        }
        if ($intent === '') {
            continue;
        }

        $enValue = trim((string)($enKeys[$key] ?? $english));
        if ($intent === $enValue) {
            continue;
        }

        $result[$key] = $intent;
    }

    return $result;
}

/**
 * The tag table in dev/language-strings.md, as tag => [value => full instruction]. A value written
 * in italics there (`*(wrong sense)*`, `*(flag)*`, `*(term)*`) is free, and is stored under '*'.
 *
 * Fatal on a missing or empty table, for the same reason loadFencedBlock() is: a payload that
 * quietly shipped every key note as bare shorthand would look fine and teach nothing.
 */
function loadTagTable(): array
{
    $md = @file_get_contents(TAG_TABLE_SOURCE);
    if (!is_string($md)) {
        fail('Tag table source not found: ' . TAG_TABLE_SOURCE);
    }
    $at = strpos($md, TAG_TABLE_HEADING);
    if ($at === false) {
        fail('No "' . TAG_TABLE_HEADING . '" heading in ' . basename(TAG_TABLE_SOURCE)
            . ' -- every key note is rendered from the tag table under it.');
    }
    $table = [];
    $started = false;
    foreach (explode("\n", substr($md, $at)) as $line) {
        if (preg_match('/^\|\s*`([a-z-]+)`\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*$/', $line, $m)) {
            $started = true;
            $value = preg_match('/^`([^`]+)`$/', $m[2], $v) ? $v[1] : '*';
            $table[$m[1]][$value] = trim(str_replace('**', '', $m[3]));
        } elseif ($started && trim($line) === '') {
            break;
        }
    }
    if ($table === []) {
        fail('The tag table under "' . TAG_TABLE_HEADING . '" in ' . basename(TAG_TABLE_SOURCE) . ' is empty or unreadable.');
    }
    return $table;
}

/**
 * Split `$ec_lang_syn` commentary into [tag, value, raw] parts. A new tag begins only at a known
 * tag name, because tag values are prose and prose contains semicolons. The same rule as
 * layout_tag_check.php's splitTags(); see the comment there for the defect that taught it.
 * A part that does not begin with a known tag comes back with tag '' and is free commentary.
 */
function splitSynCommentary(string $commentary, array $knownTags): array
{
    $names = implode('|', array_map(static function ($t) { return preg_quote($t, '/'); }, $knownTags));
    $parts = preg_split('/;\s*(?=(?:' . $names . ')\s*[:;]|(?:' . $names . ')\s*$)/', $commentary);
    $out = [];
    foreach ($parts as $part) {
        $part = trim($part);
        if ($part === '') {
            continue;
        }
        // `symbol; <prose>`: a flag followed by a sentence.
        if (preg_match('/^(' . $names . ')\s*;\s*(.+)$/s', $part, $mm)) {
            $out[] = [$mm[1], '', $mm[1]];
            $part = trim($mm[2]);
        }
        if (preg_match('/^(' . $names . ')\s*(?::\s*(.*))?$/s', $part, $mm)) {
            $out[] = [$mm[1], trim($mm[2] ?? ''), $part];
        } else {
            $out[] = ['', '', $part];
        }
    }
    return $out;
}

/**
 * Appendix D step 1, item 1. The commentary right of the first pipe in a key's `$ec_lang_syn`,
 * rendered as the plain instructions a translator needs, one string per instruction:
 *
 *   layout/runtime: <value>  -> "Layout (<value>): <the table's full instruction>"
 *   avoid: <sense>           -> not sent: suggestions only, no prohibitions (Tom, 2026-10-16)
 *   symbol                   -> "Symbol: <the table's instruction>"
 *   gloss: <term>            -> nothing here; the term already arrives through key_concepts and glossary
 *   free prose               -> "Note: <prose>"
 *
 * Emitted whether or not the synonyms left of the pipe equal the English, unlike key_syn: a key
 * with nothing to say on the left can still carry a warning on the right.
 */
function collectKeyNotes(array $deltaKeys, array $synMap, array $tagTable): array
{
    $known = array_keys($tagTable);
    $out = [];
    foreach ($deltaKeys as $key => $english) {
        if (!isset($synMap[$key])) {
            continue;
        }
        $syn = (string)$synMap[$key];
        $pipe = strpos($syn, '|');
        if ($pipe === false) {
            continue;
        }
        // SUGGESTIONS ONLY, NO PROHIBITIONS (Tom, 2026-10-16): an `avoid:` tag stays in the file,
        // unsent. "We are masking our poor definitions with often very wrong prohibitions."
        $notes = [];
        foreach (splitSynCommentary(substr($syn, $pipe + 1), $known) as [$tag, $value, $raw]) {
            if ($tag === '') {
                $notes[] = 'Note: ' . $raw;
                continue;
            }
            if ($tag === 'gloss') {
                continue;
            }
            if ($tag === 'avoid') {
                continue;
            }
            $instruction = $tagTable[$tag][$value] ?? $tagTable[$tag]['*'] ?? '';
            $label = ucfirst($tag) . ($value !== '' ? ' (' . $value . ')' : '');
            $notes[] = $instruction !== '' ? $label . ': ' . $instruction : $label;
        }
        if ($notes) {
            $out[$key] = $notes;
        }
    }
    return $out;
}

/**
 * Keys whose English no longer matches detect_english_drift.php's manifest, as key => true. The
 * same comparison that script's diff() makes (sha1 of the English value), so the payload and its
 * --json list name the same keys. NEW keys are absent from the manifest and are left to the
 * missing-key delta, as there.
 */
function loadEnglishChangedKeys(array $enKeys): array
{
    $raw = @file_get_contents(DRIFT_MANIFEST);
    if (!is_string($raw)) {
        return [];
    }
    $data = json_decode($raw, true);
    $hashes = is_array($data['hashes'] ?? null) ? $data['hashes'] : [];
    $out = [];
    foreach ($enKeys as $key => $value) {
        if (isset($hashes[$key]) && $hashes[$key] !== sha1((string)$value)) {
            $out[$key] = true;
        }
    }
    return $out;
}

/**
 * Appendix D step 1, item 3. A label and its `_tip` explain each other, so when either is in the
 * batch the other rides along in key_context: key_context[label].tip and key_context[tip].label,
 * each as {key, english[, value]} where value is this language's current translation, if any.
 */
function attachTipPairs(array $keyContext, array $enKeys, array $current): array
{
    $partner = static function (string $key) use ($enKeys, $current): array {
        $entry = ['key' => $key, 'english' => (string)$enKeys[$key]];
        $have = array_key_exists($key, $current) ? trim((string)$current[$key]) : '';
        if ($have !== '' && normalizeForCompare($have) !== normalizeForCompare((string)$enKeys[$key])) {
            $entry['value'] = $have;
        }
        return $entry;
    };
    foreach (array_keys($keyContext) as $key) {
        if (substr($key, -4) === '_tip') {
            $label = substr($key, 0, -4);
            if (array_key_exists($label, $enKeys)) {
                $keyContext[$key]['label'] = $partner($label);
            }
        } elseif (array_key_exists($key . '_tip', $enKeys)) {
            $keyContext[$key]['tip'] = $partner($key . '_tip');
        }
    }
    return $keyContext;
}

/**
 * Appendix D step 1, item 4. The glossary terms this batch's strings actually use, in glossary
 * order:
 *
 *   - every term a batch key cites, through key_concepts.json or a `gloss:` pointer;
 *   - every term whose English rendering appears as a word or phrase in a batch string (a plural
 *     s/es allowed), EXCEPT that a sense-qualified term, one whose name carries a parenthetical
 *     such as "run (a simulation)" or "text (map annotation)", counts only in a string whose
 *     prefix wires it in prefix_terms.inc.php. Its bare word ("run", "text", "open") also appears
 *     in other senses in other calculators, and a guard written for one sense is wrong advice in
 *     another.
 *
 * A term whose English appears in no batch string, and that no batch key cites, has nothing in
 * this batch to help with. Sending it anyway is what made an lpn payload carry all 72 lpn terms.
 */
function selectBatchTerms(array $deltaKeys, array $terms, array $keyConcepts, array $synMap, array $termIndex, array $prefixMap): array
{
    if (count($deltaKeys) === 0) {
        return [];
    }
    $cited = [];
    $textAll = '';
    $textWired = []; // lower-cased term name => the batch strings whose prefix wires it
    foreach ($deltaKeys as $key => $english) {
        foreach ($keyConcepts[$key] ?? [] as $id) {
            $cited['concept:' . $id] = true;
        }
        if (isset($synMap[$key])) {
            foreach (ecGlossPointerTerms((string)$synMap[$key]) as $name) {
                $cited['term:' . $name] = true;
            }
        }
        $plain = ' ' . html_entity_decode(strip_tags((string)$english), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $textAll .= $plain;
        foreach ($prefixMap[keyPrefix((string)$key)] ?? [] as $wired) {
            $lc = strtolower($wired);
            $textWired[$lc] = ($textWired[$lc] ?? '') . $plain;
        }
    }
    $out = [];
    foreach ($terms as $term) {
        if (!is_array($term) || !isset($term['term'])) {
            continue;
        }
        $name = strtolower((string)$term['term']);
        if (($termIndex[$name] ?? null) !== $term) {
            continue; // a duplicate name; gloss_ref_check.php refuses those, termIndexByName() keeps the last
        }
        $take = isset($cited['term:' . $name]) || isset($cited['concept:' . ($term['concept'] ?? '')]);
        if (!$take) {
            $qualified = strpos($name, '(') !== false;
            $haystack = $qualified ? ($textWired[$name] ?? '') : $textAll;
            $forms = $haystack === '' ? [] : array_unique([
                ecConceptEnglish($term),
                (string)preg_replace('/\s*\([^)]*\)\s*$/', '', (string)$term['term']),
            ]);
            foreach ($forms as $form) {
                $form = trim($form);
                if ($form === '') {
                    continue;
                }
                $phrase = preg_replace('/ +/', '\s+', preg_quote($form, '/'));
                if (preg_match('/(?<![\p{L}\p{N}])' . $phrase . '(?:s|es)?(?![\p{L}\p{N}])/iu', $haystack)) {
                    $take = true;
                    break;
                }
            }
        }
        if ($take) {
            $out[] = $term;
        }
    }
    return $out;
}


function detectPrefixes(array $keys): array
{
    $prefixes = [];
    foreach (array_keys($keys) as $key) {
        $parts = explode('_', $key, 2);
        if (count($parts) === 2 && $parts[0] !== '') {
            $prefixes[$parts[0]] = true;
        }
    }
    $list = array_keys($prefixes);
    sort($list);
    return $list;
}

/**
 * Returns [delta, context, exemptKeys, outOfScopeKeys]. Two different reasons a gap is
 * not delta, kept apart on purpose: exemptKeys equalled English legitimately and are
 * FINISHED; outOfScopeKeys are a body this language is not being asked for yet and are
 * NOT STARTED. Both suppressions stay visible in the payload meta.
 */
function collectDeltaAndContext(
    array $enKeys,
    array $current,
    array $activePrefixes,
    string $lang,
    array $exemptMap,
    array $coverage,
    array $changedKeys = []
): array {
    $delta = [];
    $context = [];
    $exemptKeys = [];
    $outOfScopeKeys = [];
    $orderedKeys = array_keys($enKeys);

    for ($i = 0; $i < count($orderedKeys); $i++) {
        $key = $orderedKeys[$i];
        $prefix = keyPrefix($key);
        if (count($activePrefixes) > 0 && !in_array($prefix, $activePrefixes, true)) {
            continue;
        }

        $english = (string)($enKeys[$key] ?? '');
        $currentValue = array_key_exists($key, $current) ? trim((string)$current[$key]) : null;

        $reason = null;
        if ($currentValue === null) {
            $reason = 'missing';
        } elseif ($currentValue === '') {
            $reason = 'blank';
        } elseif (normalizeForCompare($currentValue) === normalizeForCompare($english)) {
            if (ecIsExemptFromEnglishEquality($key, $lang, $exemptMap)) {
                $exemptKeys[] = $key;
            } elseif (!ecIsUniversalKey($key, $english)) {
                $reason = 'equal_to_english';
            }
        }

        // Reworded English (detect_english_drift.php CHANGED). The file holds a translation, so
        // this is not a gap and scope is not consulted: an already-translated key stays
        // maintained whatever tier its cell is in. A value still equal to English is the
        // equal_to_english case above, or exempt, and is not stale.
        if ($reason === null && isset($changedKeys[$key]) && $currentValue !== null && $currentValue !== ''
            && normalizeForCompare($currentValue) !== normalizeForCompare($english)) {
            $delta[$key] = $english;
            $context[$key] = [
                'reason' => 'english_changed',
                'current_value' => $currentValue,
                'neighbors' => [
                    'previous_translated' => findNeighbor($orderedKeys, $enKeys, $current, $i, -1),
                    'next_translated' => findNeighbor($orderedKeys, $enKeys, $current, $i, 1),
                ],
            ];
            continue;
        }

        if ($reason === null) {
            continue;
        }

        // Scope is consulted only once a gap exists -- never about an already-translated
        // key, which stays translated and maintained whatever tier its cell is in.
        if (!ecCoverageKeyInScope($key, $lang, $coverage)) {
            $outOfScopeKeys[] = $key;
            continue;
        }

        $delta[$key] = $english;
        $context[$key] = [
            'reason' => $reason,
            'current_value' => $currentValue,
            'neighbors' => [
                'previous_translated' => findNeighbor($orderedKeys, $enKeys, $current, $i, -1),
                'next_translated' => findNeighbor($orderedKeys, $enKeys, $current, $i, 1),
            ],
        ];
    }

    return [$delta, $context, $exemptKeys, $outOfScopeKeys];
}

function findNeighbor(array $orderedKeys, array $enKeys, array $current, int $startIndex, int $direction): ?array
{
    for ($i = $startIndex + $direction; $i >= 0 && $i < count($orderedKeys); $i += $direction) {
        $candidate = $orderedKeys[$i];
        if (!array_key_exists($candidate, $current)) {
            continue;
        }

        $value = trim((string)$current[$candidate]);
        if ($value === '') {
            continue;
        }

        $enValue = trim((string)($enKeys[$candidate] ?? ''));
        if (normalizeForCompare($value) === normalizeForCompare($enValue)) {
            continue;
        }

        return [
            'key' => $candidate,
            'value' => $value,
            'english' => (string)($enKeys[$candidate] ?? ''),
        ];
    }

    return null;
}

function keyPrefix(string $key): string
{
    $parts = explode('_', $key, 2);
    return $parts[0] ?? '';
}

function termIndexByName(array $terms): array
{
    $index = [];
    foreach ($terms as $term) {
        if (!isset($term['term'])) {
            continue;
        }
        $index[strtolower((string)$term['term'])] = $term;
    }
    return $index;
}

function buildPromptContext(array $terms, string $language): string
{
    if (count($terms) === 0) {
        return 'No glossary term is used by the strings in this batch.';
    }

    $lines = [];
    foreach ($terms as $term) {
        $name = $term['term'] ?? '';
        if ($name === '') {
            continue;
        }

        $symbol = $term['symbol'] ?? '';
        $translation = $term['translations'][$language] ?? '';
        $translationDisplay = ($translation === '') ? '(no preferred translation yet: use your language\'s standard term)' : $translation;

        $line = '- ' . $name;
        if ($symbol !== '') {
            $line .= ' (' . $symbol . ')';
        }
        $line .= ': ' . $translationDisplay;

        // Task 737: a non-empty definition is the source; English (the name above) renders it.
        $definition = trim((string)($term['definition'] ?? ''));
        if ($definition !== '') {
            $line .= "\n    MEANS: " . $definition;
        }

        $lines[] = $line;
    }

    return "Technical terms used by the strings in this batch, each as: term (symbol): your language's preferred translation.\n" . implode("\n", $lines);
}

/**
 * Normalizes a string for equality comparison so that an HTML-entity form
 * (e.g. &ndash;, &times;) and its literal UTF-8 character (e.g. –, ×) are
 * treated as identical rather than as a false "untranslated" delta.
 */
function normalizeForCompare(string $value): string
{
    return trim(html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
}

function fail(string $message): void
{
    fwrite(STDERR, 'ERROR: ' . $message . "\n");
    exit(1);
}
