<?php
/**
 * Checks that every task ID in dev/ROADMAP.md is unique.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. A roadmap ID is a PERMANENT HANDLE. CLAUDE.md's own rule is to say "Task N"
 * and never invent other naming, and prose across ROADMAP.md, CLAUDE.md and dev/*.md refers to
 * tasks by number — Task 296 alone is cited seven times. The moment two tasks share a number,
 * every one of those references becomes ambiguous, and nothing anywhere says so.
 *
 * It kept happening, and always by the same mechanism: a session allocates the next ID by reading
 * its OWN copy of ROADMAP.md while another session has already claimed that number somewhere the
 * first cannot see — a second worktree, an unmerged branch, or simply a commit not yet pulled.
 * Six collisions had accumulated by 2026-08-14 (294, 295, 296, 298, 300, and 304/305 twice over),
 * two of them leaving an OPEN task sharing a number with a closed one. Every session involved had
 * read the rule; none of them could have seen the conflict.
 *
 * That is exactly the case CLAUDE.md's review-office section says to convert from prose into a
 * check: "a rule a machine enforces is worth roughly ten a human must remember." This is the
 * cheapest check in the suite and it has the longest list of prior failures behind it.
 *
 * THE FIX WHEN THIS FAILS is to renumber the NEWER task to a fresh ID (the highest in use, plus
 * one), not the older one — the older ID is the one already referenced in prose. Prefer renumbering
 * a CLOSED task over an open one, and grep for `Task <id>` across dev/*.md and CLAUDE.md before
 * moving anything, because those references have to move with it.
 *
 * THERE IS NO EXEMPTION LIST, DELIBERATELY. The first draft of this check grandfathered the three
 * closed/closed pairs that existed when it was written, on the theory that a check failing on day
 * one gets bypassed. Tom rejected that on 2026-08-14 — *"I don't agree with grandfathering
 * duplicates"* — and he was right on the facts, not just the principle:
 *
 *   - The cost of fixing them had been overstated. Each pair had one member with ZERO prose
 *     references, so renumbering that member cost no reference rewrites at all. The claim that
 *     Task 296 was "too entangled at 11 references" was wrong: all of them meant the same one of
 *     the two tasks.
 *   - One pair was worse than reported. "Task 300" had been used for THREE different things, and a
 *     live reference (ROADMAP.md, in the file-extension task) pointed at a meaning that is not
 *     either of the lines the checker could see. Grandfathering would have frozen that.
 *
 * The general lesson, worth keeping: an exemption list here would do what CLAUDE.md already forbids
 * for the translation exempt-keys list — "never to quiet a number you don't want to fix."
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
