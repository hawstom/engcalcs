<?php
/**
 * Checks that every task ID in dev/ROADMAP.md is unique.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * A task ID is a permanent handle — prose across ROADMAP.md, CLAUDE.md and dev/*.md cites tasks by
 * number, so two tasks sharing one makes every such reference ambiguous, silently. Six duplicates
 * had accumulated by 2026-08-14 and were renumbered then.
 *
 * WHEN THIS FAILS: renumber the newer task to the next free ID, preferring a closed one, and grep
 * `Task <id>` across dev/*.md and CLAUDE.md to move its references with it. Usually one member of
 * a colliding pair has no references at all, and that is the one to move.
 *
 * No exemption list, deliberately (Tom, 2026-08-14) — same principle as the translation exempt
 * list: never to quiet a number you don't want to fix.
 *
 * Usage:
 *   php dev/scripts/roadmap_id_check.php            # exit 1 if any ID is duplicated
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
foreach ($lines as $i => $line) {
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
}

if (!$seen) {
    fwrite(STDERR, "roadmap_id_check: no task lines matched — has the ROADMAP format changed?\n");
    exit(2);
}

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
    exit(1);
}

$max = 0;
foreach (array_keys($seen) as $id) {
    if ((int)$id > $max) { $max = (int)$id; }
}

echo "PASS: all " . count($seen) . " roadmap IDs are unique.\n";
if ($verbose) {
    echo "Highest ID in use: $max. Next free ID: " . ($max + 1) . ".\n";
    echo "Fetch and re-check before claiming it — another session may hold it already.\n";
}
exit(0);
