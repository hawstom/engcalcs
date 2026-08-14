<?php
/**
 * Checks dev/ROADMAP.md's two structural invariants: every task ID is unique, and priority 0 means
 * completed.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * A task ID is a permanent handle — prose across ROADMAP.md, CLAUDE.md and dev/*.md cites tasks by
 * number, so two tasks sharing one makes every such reference ambiguous, silently. Six duplicates
 * had accumulated by 2026-08-14 and were renumbered then.
 *
 * Priority 0 is the file's ONLY signal for "closed", so it must not carry a second meaning. Tasks
 * 306 and 307 sat at 0 while BLOCKED on Task 248, which made every count of open work read them as
 * finished; Tasks 195 and 212 were genuinely done but had never been moved into `## Completed`,
 * the recurring half-close. Both shapes look identical from outside and both are caught here: a
 * priority-0 task belongs under `## Completed`, and nothing else does.
 *
 * WHEN THIS FAILS:
 *   - duplicate ID: renumber the newer task to the next free ID, preferring a closed one, and grep
 *     `Task <id>` across dev/*.md and CLAUDE.md to move its references with it. Usually one member
 *     of a colliding pair has no references at all, and that is the one to move.
 *   - priority 0 outside `## Completed`: if it is done, MOVE the block (and compress it to <=5
 *     lines, archiving any narrative to `dev/roadmap-closed-archive.md`). If it is blocked or
 *     parked, it is not closed — give it a real priority, however low.
 *   - a non-zero priority inside `## Completed`: either the task reopened, in which case move it
 *     back out, or the close never set the priority.
 *
 * No exemption list, deliberately (Tom, 2026-08-14) — same principle as the translation exempt
 * list: never to quiet a number you don't want to fix.
 *
 * Usage:
 *   php dev/scripts/roadmap_id_check.php            # exit 1 on any duplicate or misplaced task
 *   php dev/scripts/roadmap_id_check.php --verbose  # also report the next free ID
 */

$root = realpath(__DIR__ . '/../..');
$path = $root . '/dev/ROADMAP.md';
$verbose = in_array('--verbose', $argv, true);

if (!is_readable($path)) {
    fwrite(STDERR, "roadmap_id_check: cannot read $path\n");
    exit(2);
}

$lines = file($path, FILE_IGNORE_NEW_LINES);

// A task line is `- <priority>|<id>| ...` at the very start of a line. IDs may be decimal
// (146.06), so they are compared as strings — 146.6 and 146.06 are different tasks.
$seen = array();
$misplaced = array();   // priority 0 above the `## Completed` heading
$unclosed = array();    // priority > 0 below it
$inCompleted = false;
foreach ($lines as $i => $line) {
    if (preg_match('/^##\s+Completed\s*$/', $line)) {
        $inCompleted = true;
    }
    if (!preg_match('/^- (\d+)\|([0-9.]+)\|/', $line, $m)) {
        continue;
    }
    $id = $m[2];
    // Trim the title down to something that fits one terminal line.
    $title = trim(preg_replace('/^- \d+\|[0-9.]+\|(\[H\])?\s*/', '', $line));
    $title = trim(str_replace('**', '', $title));
    if (mb_strlen($title) > 60) {
        $title = mb_substr($title, 0, 57) . '...';
    }
    $seen[$id][] = array('line' => $i + 1, 'priority' => $m[1], 'title' => $title);

    $entry = array('line' => $i + 1, 'id' => $id, 'priority' => $m[1], 'title' => $title);
    if ($m[1] === '0' && !$inCompleted) {
        $misplaced[] = $entry;
    } elseif ($m[1] !== '0' && $inCompleted) {
        $unclosed[] = $entry;
    }
}

if (!$seen) {
    fwrite(STDERR, "roadmap_id_check: no task lines matched — has the ROADMAP format changed?\n");
    exit(2);
}
if (!$inCompleted) {
    // Never saw the heading, so every task counted as open and the placement half of this check
    // silently measured nothing. That is a format change, not a pass.
    fwrite(STDERR, "roadmap_id_check: no `## Completed` heading — has the ROADMAP format changed?\n");
    exit(2);
}

$failed = false;

$dupes = array();
foreach ($seen as $id => $hits) {
    if (count($hits) > 1) {
        $dupes[$id] = $hits;
    }
}

// Sort numerically so any report reads in task order.
uksort($dupes, function ($a, $b) { return $a <=> $b; });

if ($dupes) {
    echo "DUPLICATE ROADMAP IDS (" . count($dupes) . "):\n";
    foreach ($dupes as $id => $hits) {
        echo "\n  Task $id is used " . count($hits) . " times:\n";
        foreach ($hits as $h) {
            $state = $h['priority'] === '0' ? 'closed' : 'OPEN (prio ' . $h['priority'] . ')';
            printf("    line %-6d %-16s %s\n", $h['line'], $state, $h['title']);
        }
    }
    echo "\nAn ID is a permanent handle: prose across ROADMAP.md, CLAUDE.md and dev/*.md cites\n";
    echo "tasks by number, and a shared number makes every one of those references ambiguous.\n";
    echo "Renumber the NEWER task (prefer a closed one) to the next free ID, and move any\n";
    echo "`Task <id>` references with it. A pair where one task is still OPEN is the urgent kind.\n";
    $failed = true;
}

if ($misplaced) {
    if (!empty($failed)) { echo "\n"; }
    echo "PRIORITY 0 OUTSIDE `## Completed` (" . count($misplaced) . "):\n\n";
    foreach ($misplaced as $h) {
        printf("    line %-6d Task %-8s %s\n", $h['line'], $h['id'], $h['title']);
    }
    echo "\nPriority 0 is the file's only signal for `closed`, so it must not mean anything else.\n";
    echo "If the task is DONE, move the block under `## Completed` and compress it to <=5 lines,\n";
    echo "archiving the narrative to dev/roadmap-closed-archive.md. If it is BLOCKED or parked, it\n";
    echo "is not closed — give it a real priority, however low, so it still counts as open work.\n";
    $failed = true;
}

if ($unclosed) {
    if (!empty($failed)) { echo "\n"; }
    echo "NON-ZERO PRIORITY INSIDE `## Completed` (" . count($unclosed) . "):\n\n";
    foreach ($unclosed as $h) {
        printf("    line %-6d Task %-8s prio %-4s %s\n", $h['line'], $h['id'], $h['priority'], $h['title']);
    }
    echo "\nEither the task reopened — in which case move the block back out — or the close set the\n";
    echo "priority nowhere. Closing is both edits: priority to 0 AND the move.\n";
    $failed = true;
}

// ---------------------------------------------------------------------------------------------
// THIRD CHECK: does every "Task <n>" cited from CODE resolve to a real block?
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
// CODE ONLY, deliberately. Prose in dev/*.md cites freely and sometimes speculatively, and the
// archive quotes old prose verbatim; policing that would be noise. A comment in a shipped file is
// a different promise.
$citeFiles = array_merge(
    glob(__DIR__ . '/../../js/*.js'),
    glob(__DIR__ . '/../../lib/*.php'),
    glob(__DIR__ . '/../../*.php')
);
$dangling = array();
foreach ($citeFiles as $f) {
    $src = file_get_contents($f);
    if (!preg_match_all('/\bTask (\d+(?:\.\d+)?)\b/', $src, $m)) { continue; }
    foreach (array_unique($m[1]) as $cited) {
        if (isset($seen[$cited])) { continue; }
        $dangling[] = substr($f, strlen(__DIR__ . '/../../')) . '  ->  Task ' . $cited;
    }
}
if (!empty($dangling)) {
    echo "\nCITED FROM CODE BUT NOT A ROADMAP TASK (" . count($dangling) . "):\n\n";
    foreach (array_unique($dangling) as $d) { echo "    $d\n"; }
    echo "\nA comment that cites a task number is a promise the reader can go and find out why.\n";
    echo "Either the block exists under a different ID, or the number is a SPRINT id rather than a\n";
    echo "task id (they look identical in a comment and live in different namespaces), or the task\n";
    echo "was never written down. Fix the comment or write the block.\n";
    $failed = true;
}

if (!empty($failed)) {
    exit(1);
}

$max = 0;
foreach (array_keys($seen) as $id) {
    if ((int)$id > $max) { $max = (int)$id; }
}

echo "PASS: all " . count($seen) . " roadmap IDs are unique, and every priority-0 task is under `## Completed`.\n";
if ($verbose) {
    echo "Highest ID in use: $max. Next free ID: " . ($max + 1) . ".\n";
    echo "Fetch and re-check before claiming it — another session may hold it already.\n";
}
exit(0);
