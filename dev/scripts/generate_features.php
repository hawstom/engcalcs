<?php
/**
 * Generates `dev/features.md` — what this suite does, said to somebody who has never opened it.
 * Task 504.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * HOW A CLOSED TASK DECLARES ITSELF A FEATURE. It does not. A hand-edited companion file,
 * `dev/features-source.md`, names the features and writes their sentences; each one cites the
 * closed IDs that shipped it, and this script proves those IDs exist in `dev/roadmap-closed-ids.md`
 * at priority 0 and that no ID is claimed twice. So the ledger supplies the evidence and the
 * companion file supplies the words, and neither can drift from the other silently.
 *
 * The alternatives, and why not:
 *
 *   A MARKER BACK-FILLED INTO THE LEDGER (`- 0|145|F| ...`). Cheapest to grep, and it was the first
 *   idea. It answers the wrong question. Knowing an entry is a feature does not give you a sentence
 *   a reader can use, and the ledger's own prose must not be shipped verbatim — it is written for a
 *   developer resolving a citation. The back-fill is also not possible from the file: 136 of the 448
 *   entries are content-free stubs (the text is literally `[`), their narrative living only in git.
 *
 *   AN ALLOW-LIST OF IDS BESIDE THE GENERATOR. Same defect, minus the back-fill. Still emits ledger
 *   prose, still cannot merge two IDs into one feature or split one ID across two.
 *
 *   DERIVATION FROM THE ENTRY'S TEXT (keywords like SHIPPED / DONE / Fixed). The named failure mode
 *   of this task. A third of the entries have no text at all; of those that do, "FIXED 2026-08-23"
 *   opens a bug fix and "SHIPPED" opens both features and internal plumbing. A rule over this corpus
 *   promotes bug fixes and rejections into the features list, quietly.
 *
 * CHEAP TO REVISE, which was a requirement. A feature is one line in one file. If Tom would rather
 * the marker lived in the ledger after all, this script's parser is the only thing that changes.
 *
 * WHERE THE OUTPUT GOES IS NOT DECIDED — the landing page and Help are both candidates and the call
 * is Tom's. Until he makes it this writes a file in `dev/` and nothing else; it wires into no page.
 *
 * Usage:
 *   php dev/scripts/generate_features.php           # write dev/features.md
 *   php dev/scripts/generate_features.php --check   # exit 1 if the file on disk is stale
 */

require_once __DIR__ . '/roadmap_lib.php';

/** Closed-ledger facts: the set of closed IDs, the total, and how many carry no text. */
function featuresLedgerFacts($ledgerPath)
{
    $ids  = array();
    $stub = array();
    foreach (roadmapParseTasks($ledgerPath) as $t) {
        if ($t['priority'] !== 0) { continue; }
        $ids[$t['id']] = true;
        // A ledger entry whose text is `[` and nothing else: an ID that resolves and says nothing.
        // Its narrative is in git alone, so no rule over this file can judge it either way.
        $stub[$t['id']] = (strlen(trim($t['raw'])) <= 3);
    }
    return array('ids' => $ids, 'total' => count($ids), 'stub' => $stub);
}

/**
 * Parse the hand-written source into areas of features.
 * Returns array('areas' => array(name => array(array(ids, text))), 'errors' => array()).
 */
function featuresParseSource($sourcePath)
{
    $lines  = file($sourcePath, FILE_IGNORE_NEW_LINES);
    $areas  = array();
    $errors = array();
    $area   = null;
    $body   = false;
    $seen   = array();

    foreach ($lines as $i => $line) {
        $n = $i + 1;
        // Everything before the `---` rule is instructions for the editor, not content.
        if (!$body) {
            if (rtrim($line) === '---') { $body = true; }
            continue;
        }
        if (preg_match('/^##\s+(.+?)\s*$/', $line, $m)) {
            $area = $m[1];
            if (!isset($areas[$area])) { $areas[$area] = array(); }
            continue;
        }
        if (!preg_match('/^-\s+([0-9][0-9.,\s]*)\|\s*(\S.*)$/', $line, $m)) {
            if (preg_match('/^-\s/', $line)) {
                $errors[] = "line $n: not a feature row (`- <ids>| <sentence>`): " . trim($line);
            }
            continue;
        }
        if ($area === null) {
            $errors[] = "line $n: feature row before any `## area` heading.";
            continue;
        }
        $ids = array();
        foreach (preg_split('/\s*,\s*/', trim($m[1]), -1, PREG_SPLIT_NO_EMPTY) as $id) {
            $id = trim($id);
            if (isset($seen[$id])) {
                $errors[] = "line $n: task $id is cited by two features (first at line {$seen[$id]}).";
                continue;
            }
            $seen[$id] = $n;
            $ids[] = $id;
        }
        $text = rtrim($m[2]);
        if (substr($text, -1) !== '.') {
            $errors[] = "line $n: a feature sentence must end with a full stop: " . $text;
        }
        $areas[$area][] = array('ids' => $ids, 'text' => $text, 'line' => $n);
    }
    if (!$body) { $errors[] = 'the source has no `---` rule; nothing after it to read.'; }
    return array('areas' => $areas, 'errors' => $errors);
}

/** Build the features text. Pure — used by both write and --check. */
function featuresRender($sourcePath, $ledgerPath, &$errors)
{
    $facts  = featuresLedgerFacts($ledgerPath);
    $parsed = featuresParseSource($sourcePath);
    $errors = $parsed['errors'];

    $cited     = 0;
    $citedIds  = array();
    foreach ($parsed['areas'] as $area => $rows) {
        foreach ($rows as $r) {
            foreach ($r['ids'] as $id) {
                $cited++;
                $citedIds[$id] = true;
                if (!isset($facts['ids'][$id])) {
                    $errors[] = "line {$r['line']}: task $id is not a closed ID in dev/roadmap-closed-ids.md.";
                }
            }
        }
    }
    if ($errors) { return null; }

    $nFeatures = 0;
    foreach ($parsed['areas'] as $rows) { $nFeatures += count($rows); }
    $undecided = $facts['total'] - $cited;
    $silent    = 0;
    foreach ($facts['stub'] as $id => $isStub) {
        if ($isStub && !isset($citedIds[$id])) { $silent++; }
    }

    $out  = "# What this suite does\n\n";
    $out .= "**Script-generated. Do not edit.** The sentences are hand-written in\n";
    $out .= "`dev/features-source.md`; regenerate with `php dev/scripts/generate_features.php`.\n";
    $out .= "`check_all.sh` fails if this file is stale.\n\n";
    $out .= "**The wording is a first pass and awaits Tom's edit,** and WHERE this list goes — the\n";
    $out .= "LibreWaterNet landing page, the Help menu, both, neither — is his call and is not yet made.\n";
    $out .= "Nothing on any served page reads this file.\n\n";
    $out .= "$nFeatures features, citing $cited of the " . $facts['total'] . " closed task IDs. The other $undecided are\n";
    $out .= "bug fixes, refactors, rejected proposals, and work nobody outside this repository would\n";
    $out .= "call a feature — and $silent of them are ledger entries carrying no text at all, whose\n";
    $out .= "narrative is in git and which nothing here has judged either way. **This list is honest\n";
    $out .= "rather than complete:** a feature is on it because somebody wrote a sentence for it.\n";

    foreach ($parsed['areas'] as $area => $rows) {
        if (!$rows) { continue; }
        $out .= "\n## $area\n\n";
        foreach ($rows as $r) {
            // The citation is an HTML comment: invisible where this is rendered, greppable here,
            // so a sentence can always be traced back to the thing that shipped it.
            $out .= '- ' . $r['text'] . ' <!-- ' . implode(', ', $r['ids']) . " -->\n";
        }
    }
    return $out;
}

$root       = realpath(__DIR__ . '/../..');
$sourcePath = $root . '/dev/features-source.md';
$ledgerPath = $root . '/dev/roadmap-closed-ids.md';
$outPath    = $root . '/dev/features.md';
$check      = in_array('--check', $argv, true);

foreach (array($sourcePath, $ledgerPath) as $p) {
    if (!is_readable($p)) {
        fwrite(STDERR, "generate_features: cannot read $p\n");
        exit(2);
    }
}

$errors = array();
$want   = featuresRender($sourcePath, $ledgerPath, $errors);

if ($errors) {
    fwrite(STDERR, "FEATURES SOURCE INVALID: dev/features-source.md\n\n");
    foreach ($errors as $e) { fwrite(STDERR, "    $e\n"); }
    fwrite(STDERR, "\nEvery feature cites the closed task IDs that shipped it, each ID once, so the\n");
    fwrite(STDERR, "list cannot claim something that never landed. Fix the citation, or close the\n");
    fwrite(STDERR, "task first.\n");
    exit(1);
}

if ($check) {
    $have = is_readable($outPath) ? file_get_contents($outPath) : null;
    if ($have === $want) {
        echo "PASS: dev/features.md is current.\n";
        exit(0);
    }
    fwrite(STDERR, "STALE FEATURES LIST: dev/features.md does not match dev/features-source.md.\n\n");
    if ($have === null) { fwrite(STDERR, "    The file is missing entirely.\n"); }
    fwrite(STDERR, "    Regenerate it:  php dev/scripts/generate_features.php\n\n");
    fwrite(STDERR, "This file is generated, never hand-edited. If you edited it, your edit belongs in\n");
    fwrite(STDERR, "dev/features-source.md — the features list carries no content of its own.\n");
    exit(1);
}

file_put_contents($outPath, $want);
echo "Wrote dev/features.md\n";
exit(0);
