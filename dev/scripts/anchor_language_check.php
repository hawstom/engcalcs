<?php
/**
 * anchor_language_check.php — the anchor languages are `glossary.json`'s `meta.anchor_languages`,
 * and the prose that restates them still agrees. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. An anchor is the language a term's other renderings are CHECKED AGAINST, so
 * getting the list wrong does not fail — it silently sends a sprint's agents a different reference
 * point from the one the project chose, and every rendering checked against it is checked against
 * the wrong thing. CLAUDE.md and `dev/translation-process.md` both open the subject with the same
 * sentence — *"read that, not this line"* — and then both restate the four anyway, because a reader
 * needs to know them without opening a JSON file. That is the right call for prose and it is exactly
 * the shape that goes stale: the set moved once already (ROADMAP Task 214, `es, fr, ru, ar` →
 * `es, pt, fr, tr`) and three documents had to be edited by hand to follow it.
 *
 * SCOPED TO THE TWO CURRENT-STATE DOCUMENTS, deliberately. `dev/*.md` at large is full of anchor
 * sets that are correct as HISTORY — `dev/translation-execution-log.md` names a fourteen-language
 * wave-1 anchor list nine times, `dev/usage-data-log.md` records the argument that RETIRED the old
 * four, and `dev/roadmap-closed-ids.md` records the change itself. Widening the scope would put
 * fifteen legitimate lines in front of the reader to find zero defects, which is how a check gets
 * muted. `doc_path_check.php` made the same call for the same reason.
 *
 * TWO SENSES OF THE WORD, AND ONLY ONE IS THIS ONE. `dev/translation-process.md` also carries a
 * "Wave 1 — anchors" list of fourteen languages: a retired cognate-clustering build-out device that
 * `glossary.json`'s own note says explicitly NOT to renumber or confuse with this. It reads
 * identically to a grep, so it is DECLARED below rather than pattern-matched away — as is the
 * superseded four, which is named in three places precisely so nobody reinstates it. The
 * declaration is the deliverable: a new anchor set in current-state prose fails until somebody says
 * which sense it is.
 *
 * WHAT IT ALSO ASSERTS ABOUT THE JSON, because these need no judgement at all: the anchors are
 * present, unique, each a language this suite actually declares and ships a file for, and each a
 * CORE language in `translation_coverage.json`. That last one is what both documents say an anchor
 * IS — "the core languages and the measured top four" — and it is a SUBSET test, not an equality
 * one, so promoting a fifth core language stays a one-line edit and does not fail this.
 *
 * Usage:
 *   php dev/scripts/anchor_language_check.php
 *
 * Exit 0 = the JSON is well-formed and the prose agrees with it.
 */

/** Files whose anchor prose must describe the CURRENT set. */
const EC_ANCHOR_PROSE_FILES = ['CLAUDE.md', 'dev/translation-process.md'];

/**
 * Anchor sets in those files that are deliberately NOT the current set, keyed `<file>|<sorted
 * codes>`, with the words that must still be near it and the reason.
 *
 * `marker` is a list; ONE of them must appear on the line or the one above it — the same window the
 * detector uses, because these documents habitually put the lead-in on one line and the codes on the
 * next. It is what stops a declaration from quietly covering a NEW occurrence of the same codes: a
 * line naming the old four without saying it is the old four is a defect, not a record.
 */
const EC_ANCHOR_PROSE_EXCEPTIONS = [
    'CLAUDE.md|ar,es,fr,ru' => [
        'marker' => ['replaced'],
        'why'    => 'the SUPERSEDED set, named so the reasoning that retired it is not re-proposed. '
                  . 'ru had 1 measured human and ar had 0, and an anchor you cannot observe is not '
                  . 'a reference point.',
    ],
    'dev/translation-process.md|ar,es,fr,ru' => [
        'marker' => ['They were', 'replaced'],
        'why'    => 'the same superseded set, in the SOP, for the same reason. It appears twice: '
                  . 'once in the waves section and once beside the pre-sprint gates.',
    ],
    'dev/translation-process.md|bg,cs,de,es,fr,hr,id,it,pt,ro,ru,sr,tr,uk' => [
        'marker' => ['Wave 1'],
        'why'    => 'A DIFFERENT SENSE OF THE WORD: the retired wave-1 cognate-clustering list, '
                  . 'which is a build-out sequencing device and not a reference point. '
                  . "glossary.json's own anchor_languages_note says it was deliberately NOT "
                  . 'renumbered, so it will keep reading like this.',
    ],
];

/**
 * Anchor-set restatements in one file's text.
 *
 * A line is a candidate if it, or the line above it, contains "anchor" — the two documents both
 * write "Anchor languages are declared in ...` — read that, not this line.**" and then put the
 * codes on the NEXT line. A run of three or more two-letter lowercase tokens is the set.
 *
 * @return array<int,array{line:int,codes:array<int,string>,text:string}>
 */
function ecAnchorProseSets(string $text): array
{
    $lines = explode("\n", $text);
    $out = [];
    foreach ($lines as $i => $line) {
        $near = $line . ' ' . ($i > 0 ? $lines[$i - 1] : '');
        if (stripos($near, 'anchor') === false) { continue; }
        if (!preg_match_all('/\b[a-z]{2}\b(?:[,\/ ]+\b[a-z]{2}\b){2,}/', $line, $m)) { continue; }
        foreach ($m[0] as $run) {
            $codes = preg_split('/[^a-z]+/', $run, -1, PREG_SPLIT_NO_EMPTY);
            sort($codes);
            $out[] = ['line' => $i + 1, 'codes' => array_values(array_unique($codes)),
                      'text' => trim($line), 'near' => trim($near)];
        }
    }
    return $out;
}

/**
 * Findings for one file's prose. Pure, for the selftest.
 *
 * @param string              $file    repo-relative name, for messages and for the exception key.
 * @param string              $text    the file's text.
 * @param array<int,string>   $anchors the current set, from glossary.json.
 * @param array<string,array> $except  EC_ANCHOR_PROSE_EXCEPTIONS.
 * @return array{problems:array<int,string>,matched:array<int,string>,used:array<string,bool>}
 */
function ecAnchorProseFindings(string $file, string $text, array $anchors, array $except): array
{
    $problems = [];
    $matched = [];
    $used = [];
    $want = $anchors;
    sort($want);

    foreach (ecAnchorProseSets($text) as $hit) {
        $key = $file . '|' . implode(',', $hit['codes']);
        if ($hit['codes'] === $want) {
            $matched[] = $file . ':' . $hit['line'];
            continue;
        }
        if (isset($except[$key])) {
            $found = false;
            foreach ($except[$key]['marker'] as $marker) {
                if (strpos($hit['near'], $marker) !== false) { $found = true; break; }
            }
            if (!$found) {
                $problems[] = "$file:{$hit['line']} names the anchor set "
                    . implode(', ', $hit['codes']) . ", which is declared as an exception on the "
                    . 'strength of the words ' . implode(' / ', $except[$key]['marker'])
                    . ' -- and none of them is on this line or the one above it. Either this is a NEW restatement of a set that is no longer '
                    . 'current, or the exception has drifted from the sentence it was written for.';
            } else {
                $used[$key] = true;
            }
            continue;
        }
        $problems[] = "$file:{$hit['line']} states an anchor language set of "
            . implode(', ', $hit['codes']) . ', and glossary.json meta.anchor_languages says '
            . implode(', ', $want) . ". The JSON is the declaration and the prose is a courtesy to "
            . "the reader, so fix the prose -- unless this line means anchor in the OTHER sense "
            . "(the retired wave-1 cognate cluster) or is naming a superseded set on purpose, in "
            . "which case declare it in EC_ANCHOR_PROSE_EXCEPTIONS with the marker words that make "
            . 'it readable as history.';
    }

    return ['problems' => $problems, 'matched' => $matched, 'used' => $used];
}

if (defined('ANCHOR_LANGUAGE_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

$glossary = json_decode((string) @file_get_contents(__DIR__ . '/glossary.json'), true);
if (!is_array($glossary)) {
    echo "anchor_language_check.php cannot parse dev/scripts/glossary.json. Everything below reads\n";
    echo "from it; there is nothing to check against.\n";
    exit(1);
}
$anchors = $glossary['meta']['anchor_languages'] ?? null;

$problems = [];

if (!is_array($anchors) || !$anchors) {
    $problems[] = 'glossary.json has no non-empty meta.anchor_languages. That key is the '
        . 'DECLARATION -- CLAUDE.md and dev/translation-process.md both point at it rather than '
        . 'owning the list -- so without it there is no anchor set at all, and a sprint has no '
        . 'reference point to check a rendering against.';
    $anchors = [];
} elseif (count(array_unique($anchors)) !== count($anchors)) {
    $problems[] = 'meta.anchor_languages repeats a code: ' . implode(', ', $anchors)
        . '. An anchor appearing twice is a list somebody edited without reading.';
}

// Each anchor is a language this suite really declares and really ships.
$all_language_settings = [];
require $root . '/lib/Language.Settings.php';
foreach ($anchors as $code) {
    if (!isset($all_language_settings[$code])) {
        $problems[] = "anchor '$code' is not declared in lib/Language.Settings.php. An anchor that "
            . 'the suite cannot serve is a reference point nobody can read: chooseLanguage() '
            . 'refuses the code, no menu row offers it, and a translator checking against it is '
            . 'checking against nothing.';
    } elseif (!file_exists($root . '/lib/lang.ec.' . $code . '.php')) {
        $problems[] = "anchor '$code' has no lib/lang.ec.$code.php. There are no strings to anchor "
            . 'ON.';
    }
}

// An anchor is described in both documents as one of the CORE languages. Subset, not equality:
// promoting a fifth core language must stay a one-line edit.
$coverage = json_decode((string) @file_get_contents(__DIR__ . '/translation_coverage.json'), true);
$core = is_array($coverage) ? ($coverage['core_languages'] ?? []) : [];
if (!$core) {
    $problems[] = 'translation_coverage.json declares no core_languages, so the relationship both '
        . 'documents state -- the anchors ARE the core languages -- cannot be checked. That file '
        . 'is also the coverage cross itself; an empty core list is a larger finding than this one.';
} else {
    foreach ($anchors as $code) {
        if (!in_array($code, $core, true)) {
            $problems[] = "anchor '$code' is not a core language in translation_coverage.json ("
                . implode(', ', $core) . '). CLAUDE.md and dev/translation-process.md both describe '
                . 'the anchors as the core languages and the measured top four by confirmed human '
                . 'reach. If that has genuinely changed, the sentence in both documents changes '
                . 'with it -- and this check should be the second thing edited, not the first.';
        }
    }
}

// The prose.
$matched = [];
$usedExceptions = [];
foreach (EC_ANCHOR_PROSE_FILES as $rel) {
    $text = (string) @file_get_contents($root . '/' . $rel);
    if ($text === '') {
        $problems[] = "$rel cannot be read, and it is one of the two documents whose anchor prose "
            . 'this check holds. Update EC_ANCHOR_PROSE_FILES if it moved.';
        continue;
    }
    $f = ecAnchorProseFindings($rel, $text, $anchors, EC_ANCHOR_PROSE_EXCEPTIONS);
    $problems = array_merge($problems, $f['problems']);
    $matched = array_merge($matched, $f['matched']);
    $usedExceptions += $f['used'];
}

foreach (EC_ANCHOR_PROSE_EXCEPTIONS as $key => $e) {
    if (!isset($usedExceptions[$key])) {
        $problems[] = "the declared exception '$key' matches nothing any more. Either the sentence "
            . 'was rewritten -- in which case delete the entry -- or the codes on it changed, which '
            . 'is the thing this check exists to notice.';
    }
}

if ($problems) {
    echo 'Anchor languages: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "glossary.json's meta.anchor_languages is the declaration. An anchor is what another\n";
    echo "language's rendering of a term is CHECKED AGAINST, so a wrong list does not fail -- it\n";
    echo "quietly checks a sprint's work against the wrong reference and reports success.\n";
    exit(1);
}

echo 'Anchor languages OK -- ' . implode(', ', $anchors) . ' declared in glossary.json, all core, '
    . 'all served; ' . count($matched) . ' agreeing restatement(s) in '
    . count(EC_ANCHOR_PROSE_FILES) . ' current-state document(s), '
    . count(EC_ANCHOR_PROSE_EXCEPTIONS) . " declared historical.\n";
exit(0);
