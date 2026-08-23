<?php
/**
 * Checks the two roadmap files together: every task ID is unique across the pair, open work lives
 * in ROADMAP.md and closed IDs in the ledger, every Task number cited from CODE resolves, and no
 * block runs past the length budget.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * TWO FILES, ONE NAMESPACE. `dev/ROADMAP.md` holds only OPEN tasks; `dev/roadmap-closed-ids.md`
 * holds one line per closed ID. A task ID is a permanent handle cited by number from code and from
 * dev/*.md, so two tasks sharing one makes every such reference ambiguous, silently.
 *
 * Priority 0 is the only signal for "closed", so it must not carry a second meaning: a BLOCKED task
 * parked at 0 reads as finished from outside, and so does a done one never moved. Both are caught.
 *
 * WHEN THIS FAILS:
 *   - duplicate ID: renumber the newer task to the next free ID and grep `Task <id>` across dev/*.md
 *     and CLAUDE.md to move its references with it.
 *   - the SAME ID in both files: closed by copying rather than moving, or an open sub-task travelled
 *     with its parent. Keep one, delete the other.
 *   - priority 0 in ROADMAP.md: if done, add a one-line entry to the ledger and delete the block —
 *     the full text stays in git. If blocked or parked, it is not closed: give it a real priority.
 *   - a non-zero priority in the ledger: the task reopened (move it back), or the close never set 0.
 *   - a block past the length budget: see LENGTH DISCIPLINE at the top of ROADMAP.md. Advisory;
 *     `--strict` fails on it.
 *
 * No exemption list, deliberately — same principle as the translation exempt list: never to quiet a
 * number you don't want to fix.
 *
 * Usage:
 *   php dev/scripts/roadmap_id_check.php            # exit 1 on any duplicate or misplaced task
 *   php dev/scripts/roadmap_id_check.php --verbose  # also report the next free ID
 *   php dev/scripts/roadmap_id_check.php --strict   # also fail on an over-long block
 */

require_once __DIR__ . '/roadmap_lib.php';

$root    = realpath(__DIR__ . '/../..');
$openPath    = $root . '/dev/ROADMAP.md';
$closedPath  = $root . '/dev/roadmap-closed-ids.md';
$verbose = in_array('--verbose', $argv, true);
$strict  = in_array('--strict', $argv, true);

// The budget from ROADMAP.md's own LENGTH DISCIPLINE section: an open task caps at ~15 lines (slack
// to 20, so this is a tripwire on the 1,100-word block, not a formatter). A closed entry is ONE
// line in the ledger -- it is an index, not a record; the text lives in git.
$LIMIT = array('open' => 20, 'closed' => 1);

$files = array('open' => $openPath, 'closed' => $closedPath);
foreach ($files as $which => $p) {
    if (!is_readable($p)) {
        fwrite(STDERR, "roadmap_id_check: cannot read $p\n");
        exit(2);
    }
}

// A task line is `- <priority>|<id>| ...` at the very start of a line. IDs may be decimal
// (146.06), so they are compared as strings -- 146.6 and 146.06 are different tasks.
$seen  = array();   // id => list of hits, across both files
$wrongFile = array();
$long  = array();

foreach ($files as $which => $p) {
    $lines = file($p, FILE_IGNORE_NEW_LINES);
    $cur = null;
    $emit = function ($cur) use (&$long, $LIMIT, $which) {
        if ($cur !== null && $cur['n'] > $LIMIT[$which]) {
            $long[] = $cur + array('which' => $which);
        }
    };
    foreach ($lines as $i => $line) {
        // A BLOCK ENDS AT A HEADING, not only at the next bullet. Without this the LAST task in a
        // section swallows every trailing line of that section and of the ones after it, and gets
        // reported over budget for prose belonging to no task at all -- Task 158 was reported at 26
        // lines against its own 11, having absorbed `## New Calculators` and `## Completed`. The
        // failure is one-directional and quiet: it only ever inflates, so the fix is to stop
        // counting rather than to subtract anything.
        if (preg_match('/^#{1,6}\s/', $line)) {
            $emit($cur);
            $cur = null;
            continue;
        }
        if (!preg_match('/^- (\d+)\|([0-9.]+)\|/', $line, $m)) {
            if ($cur !== null) { $cur['n']++; }
            continue;
        }
        $emit($cur);
        $id = $m[2];
        // Trim the title down to something that fits one terminal line.
        $title = trim(preg_replace('/^- \d+\|[0-9.]+\|(\[H\])?\s*/', '', $line));
        $title = trim(str_replace('**', '', $title));
        if (mb_strlen($title) > 60) {
            $title = mb_substr($title, 0, 57) . '...';
        }
        $hit = array('line' => $i + 1, 'id' => $id, 'priority' => $m[1], 'title' => $title, 'file' => $which);
        $seen[$id][] = $hit;
        $cur = $hit + array('n' => 1);

        $closed = ($m[1] === '0');
        if ($closed !== ($which === 'closed')) {
            $wrongFile[] = $hit;
        }
    }
    $emit($cur);
}

if (!$seen) {
    fwrite(STDERR, "roadmap_id_check: no task lines matched — has the ROADMAP format changed?\n");
    exit(2);
}
// Both files must actually have contributed, or half this check silently measured nothing.
foreach (array('open', 'closed') as $which) {
    $any = false;
    foreach ($seen as $hits) {
        foreach ($hits as $h) { if ($h['file'] === $which) { $any = true; break 2; } }
    }
    if (!$any) {
        fwrite(STDERR, "roadmap_id_check: no task lines in the $which file — has the format changed?\n");
        exit(2);
    }
}

$failed = false;

$dupes = array();
$straddle = array();
foreach ($seen as $id => $hits) {
    if (count($hits) < 2) { continue; }
    $files_used = array_unique(array_column($hits, 'file'));
    if (count($files_used) > 1) {
        $straddle[$id] = $hits;
    } else {
        $dupes[$id] = $hits;
    }
}
uksort($dupes, function ($a, $b) { return $a <=> $b; });
uksort($straddle, function ($a, $b) { return $a <=> $b; });

if ($dupes) {
    echo "DUPLICATE ROADMAP IDS (" . count($dupes) . "):\n";
    foreach ($dupes as $id => $hits) {
        echo "\n  Task $id is used " . count($hits) . " times:\n";
        foreach ($hits as $h) {
            $state = $h['priority'] === '0' ? 'closed' : 'OPEN (prio ' . $h['priority'] . ')';
            printf("    %-7s line %-6d %-16s %s\n", $h['file'], $h['line'], $state, $h['title']);
        }
    }
    echo "\nAn ID is a permanent handle: prose across both roadmap files, CLAUDE.md and dev/*.md\n";
    echo "cites tasks by number, and a shared number makes every one of those references ambiguous.\n";
    echo "Renumber the NEWER task (prefer a closed one) to the next free ID, and move any\n";
    echo "`Task <id>` references with it. A pair where one task is still OPEN is the urgent kind.\n";
    $failed = true;
}

if ($straddle) {
    if ($failed) { echo "\n"; }
    echo "THE SAME ID IN BOTH FILES (" . count($straddle) . "):\n";
    foreach ($straddle as $id => $hits) {
        echo "\n  Task $id:\n";
        foreach ($hits as $h) {
            printf("    %-7s line %-6d prio %-4s %s\n", $h['file'], $h['line'], $h['priority'], $h['title']);
        }
    }
    echo "\nA task lives in exactly one file: ROADMAP.md while it is open, the archive once closed.\n";
    echo "Two copies means the close COPIED instead of moving, or an open task nested inside a\n";
    echo "parent's block travelled with the parent into the archive. Keep one, delete the other.\n";
    $failed = true;
}

if ($wrongFile) {
    if ($failed) { echo "\n"; }
    echo "TASK IN THE WRONG FILE (" . count($wrongFile) . "):\n\n";
    foreach ($wrongFile as $h) {
        $want = $h['priority'] === '0' ? 'the archive' : 'ROADMAP.md';
        printf("    %-7s line %-6d Task %-8s prio %-4s -> belongs in %s\n",
               $h['file'], $h['line'], $h['id'], $h['priority'], $want);
    }
    echo "\nPriority 0 is the only signal for `closed`, so it must not mean anything else.\n";
    echo "DONE: summarize the block into dev/roadmap-closed-archive.md -- what changed, where it\n";
    echo "lives, and any finding a future reader could not re-derive -- and delete it from the\n";
    echo "roadmap. BLOCKED or parked: it is not closed, so give it a real priority, however low.\n";
    echo "Reopened: move the block back to ROADMAP.md and give it a priority.\n";
    $failed = true;
}

// ---------------------------------------------------------------------------------------------
// Does every "Task <n>" cited from CODE resolve to a real block, in either file?
//
// A task ID is a permanent handle, and the whole value of citing one from a comment is that a
// reader can go and find out WHY. A citation that resolves to nothing spends the reader's trust
// and gives nothing back -- worse than no citation, because they go looking.
//
// Found 2026-08-14, during the Task 320 archive move: `Task 241` is cited FOUR times from live
// code (js/looped-network.js three times, Looped-Network.php once) and has never existed as a
// roadmap block. The comments describe real work -- the settings-panel restructure of 2026-08-08 --
// so the number was almost certainly a SPRINT id, and sprint ids and roadmap ids look identical
// in a comment while living in different namespaces. That is an easy mistake to repeat, which is
// why it is now a check instead of a paragraph.
//
// CODE ONLY, deliberately. Prose in dev/*.md cites freely and sometimes speculatively; policing
// that would be noise. A comment in a shipped file is a different promise.
$citeFiles = array_merge(
    glob($root . '/js/*.js'),
    glob($root . '/lib/*.php'),
    glob($root . '/*.php')
);
$dangling = array();
foreach ($citeFiles as $f) {
    $src = file_get_contents($f);
    if (!preg_match_all('/\bTask (\d+(?:\.\d+)?)\b/', $src, $m)) { continue; }
    foreach (array_unique($m[1]) as $cited) {
        if (isset($seen[$cited])) { continue; }
        $dangling[] = substr($f, strlen($root) + 1) . '  ->  Task ' . $cited;
    }
}
if ($dangling) {
    if ($failed) { echo "\n"; }
    echo "CITED FROM CODE BUT NOT A ROADMAP TASK (" . count($dangling) . "):\n\n";
    foreach (array_unique($dangling) as $d) { echo "    $d\n"; }
    echo "\nA comment that cites a task number is a promise the reader can go and find out why.\n";
    echo "Either the block exists under a different ID, or the number is a SPRINT id rather than a\n";
    echo "task id (they look identical in a comment and live in different namespaces), or the task\n";
    echo "was never written down. Fix the comment or write the block.\n";
    $failed = true;
}

// ---------------------------------------------------------------------------------------------
// Block length. ROADMAP.md's own LENGTH DISCIPLINE section sets the budget and states the test:
// would a competent person reading the short version DO SOMETHING DIFFERENT if this line were
// there? A script cannot ask that, so this only reports the outliers and leaves the judgement to
// whoever is editing. Advisory: expansion IS earned sometimes, and failing the build on prose
// would push the next writer to split one long block into two short ones, which is worse.
if ($long) {
    if ($failed) { echo "\n"; }
    usort($long, function ($a, $b) { return $b['n'] <=> $a['n']; });
    echo ($strict ? 'OVER-LONG BLOCKS' : 'ADVISORY: over-long blocks') . ' (' . count($long) . "):\n\n";
    foreach ($long as $h) {
        printf("    %-7s line %-6d Task %-8s %3d lines (budget %d)  %s\n",
               $h['file'], $h['line'], $h['id'], $h['n'], $LIMIT[$h['which']], $h['title']);
    }
    echo "\nBudget: an open task ~15 lines, a closed summary <=5 (slack allowed above before this\n";
    echo "reports). Past that the content is a dev/*.md document and the task is one line pointing\n";
    echo "at it. Expansion is earned only by a decision with a real rejected alternative, a measured\n";
    echo "number, a non-obvious blocker, or a correction of something recorded wrong here.\n";
    if ($strict) { $failed = true; }
}

// ---------------------------------------------------------------------------------------------
// EXECUTIVE-SUMMARY TITLES. Every open task must OPEN with a short title a reader can scan.
//
// The definition of a title, and why 4-12 words, is in dev/scripts/roadmap_lib.php -- one place,
// so this check and dev/roadmap-index.md can never disagree about what they are measuring.
//
// ADVISORY FOR NOW, BLOCKING LATER. This shipped 2026-08-22 against a backlog written before the
// rule existed, so most tasks fail on day one. A check that fails the build on every commit gets
// commented out, which is worse than no check at all. INTENDED END STATE: once the summary line
// below reads "N of N", move this into the blocking set (drop the $strict guard) -- at that point
// only a NEW non-conforming title can trip it, which is exactly what the rule is for.
$titleBad = array();
$titleAll = 0;
foreach (roadmapParseTasks($openPath) as $t) {
    if ($t['priority'] === 0) { continue; }
    $titleAll++;
    if (!$t['titleOk']) { $titleBad[] = $t; }
}
if ($titleBad) {
    if ($failed) { echo "\n"; }
    $label = $strict ? 'TITLES OUTSIDE 4-12 WORDS' : 'ADVISORY: titles outside 4-12 words';
    echo $label . ' (' . count($titleBad) . " of $titleAll open tasks):\n\n";
    foreach ($titleBad as $t) {
        $shown = $t['title'] === '' ? '(no bolded run opens the description)' : $t['title'];
        if (mb_strlen($shown) > 78) { $shown = mb_substr($shown, 0, 75) . '...'; }
        printf("    line %-6d Task %-8s %2d words  %s\n", $t['line'], $t['id'], $t['titleWords'], $shown);
    }
    echo "\nA TITLE is the first bolded run of the description — the `**...**` that opens it, which\n";
    echo "may wrap across lines. The `- priority|id|` prefix, a WAIT:/CHECK: marker and an actor\n";
    echo "tag ([H], [CC], [CP], [CC->CP]) are metadata and are NOT part of it, even when the tag is\n";
    echo "written inside the bold. A colon-led ALL-CAPS keyword IS part of it and IS counted.\n";
    echo "A word is a whitespace token holding a letter or digit, so a bare em dash is not one.\n\n";
    echo "It must be 4 to 12 words. Under four it is a stub, not a summary; past twelve it is the\n";
    echo "sentence the BODY should carry. Do not delete content to make a title fit: shorten the\n";
    echo "bolded run and keep the full original sentence as the first line of the body.\n";
    if ($strict) { $failed = true; }
}
echo ($titleAll - count($titleBad)) . " of $titleAll open tasks have a conforming 4-12 word title.\n";

// ---------------------------------------------------------------------------------------------
// The generated index must match the roadmap. BLOCKING, unlike the two advisories above, because
// regenerating is one command and "stale" is not a judgement call.
$idx = escapeshellarg($root . '/dev/scripts/generate_roadmap_index.php');
$out = array();
$rc  = 0;
exec('php ' . $idx . ' --check 2>&1', $out, $rc);
if ($rc !== 0) {
    if ($failed) { echo "\n"; }
    echo implode("\n", $out) . "\n";
    $failed = true;
}

if ($failed) {
    exit(1);
}

$nOpen = 0;
$nClosed = 0;
foreach ($seen as $hits) {
    if ($hits[0]['file'] === 'open') { $nOpen++; } else { $nClosed++; }
}
echo "PASS: $nOpen open + $nClosed closed = " . count($seen) . " unique roadmap IDs, each in the right file.\n";
if ($verbose) {
    $max = 0;
    foreach (array_keys($seen) as $id) {
        if ((int)$id > $max) { $max = (int)$id; }
    }
    echo "Highest ID in use: $max. Next free ID: " . ($max + 1) . ".\n";
    echo "Fetch and re-check before claiming it — another session may hold it already.\n";
}
exit(0);
