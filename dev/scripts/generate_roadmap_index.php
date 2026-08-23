<?php
/**
 * Generates `dev/roadmap-index.md` — the whole open backlog, titles only, one screen.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY A SEPARATE FILE. The index could have gone at the top of `dev/ROADMAP.md`, and did not:
 * ROADMAP.md is hand-edited constantly, by Tom and by concurrent agents, and a generated block
 * inside a hand-edited file is a merge conflict on every task added and a stale copy the moment
 * somebody edits around it. One generated file, one owner, one command.
 *
 * NEVER ARCHIVED, ALWAYS ONE NAME. `dev/roadmap-index.md` is overwritten in place. There is no
 * dated copy and no history file — the history is git, and a second name would immediately raise
 * the question of which one is current.
 *
 * TITLES ONLY, NO BODIES, deliberately. Its whole job is that a human or a fresh agent can see the
 * entire open backlog at once and pick a task to open in ROADMAP.md. A body here would make it a
 * second copy of the roadmap, which would then drift.
 *
 * Usage:
 *   php dev/scripts/generate_roadmap_index.php           # write dev/roadmap-index.md
 *   php dev/scripts/generate_roadmap_index.php --check   # exit 1 if the file on disk is stale
 */

require_once __DIR__ . '/roadmap_lib.php';

/** Build the index text from the open roadmap. Pure — used by both write and --check. */
function roadmapIndexRender($openPath)
{
    $tasks = roadmapParseTasks($openPath);
    $open  = array();
    foreach ($tasks as $t) {
        if ($t['priority'] !== 0) { $open[] = $t; }
    }

    $bands = array(
        100 => 'Next',
        75  => 'Soon',
        50  => 'Someday',
        25  => 'Maybe',
        5   => 'Parked',
    );

    $out  = "# Roadmap index — open tasks, titles only\n\n";
    $out .= "**Script-generated. Do not edit.** Regenerate with `php dev/scripts/generate_roadmap_index.php`.\n";
    $out .= "`roadmap_id_check.php` fails if this file is stale. Edit `dev/ROADMAP.md`; this follows.\n\n";
    $out .= "One line per open task: priority band, ID, marker, actor tag, and the executive-summary\n";
    $out .= "title — the first bolded run of the description, 4–12 words. The rule and its rationale\n";
    $out .= "live in `dev/scripts/roadmap_lib.php`. A title marked `!` is outside that range.\n\n";

    $total = count($open);
    $out .= "**$total open tasks.**";
    $counts = array();
    foreach ($bands as $p => $name) {
        $counts[$p] = 0;
    }
    foreach ($open as $t) {
        $p = $t['priority'];
        if (!isset($counts[$p])) { $counts[$p] = 0; }
        $counts[$p]++;
    }
    $parts = array();
    foreach ($counts as $p => $n) {
        $name = isset($bands[$p]) ? $bands[$p] : 'priority ' . $p;
        $parts[] = "$name ($p): $n";
    }
    $out .= ' ' . implode(' · ', $parts) . "\n";

    $byBand = array();
    foreach ($open as $t) { $byBand[$t['priority']][] = $t; }
    krsort($byBand, SORT_NUMERIC);

    foreach ($byBand as $p => $list) {
        usort($list, function ($a, $b) {
            return version_compare($a['id'], $b['id']);
        });
        $name = isset($bands[$p]) ? $bands[$p] : 'Priority ' . $p;
        $out .= "\n## $p — $name (" . count($list) . ")\n\n";
        foreach ($list as $t) {
            $bits = array();
            if ($t['marker'] !== '') { $bits[] = $t['marker']; }
            if ($t['actor']  !== '') { $bits[] = $t['actor']; }
            $prefix = $bits ? implode(' ', $bits) . ' · ' : '';
            $flag  = $t['titleOk'] ? '' : '! ';
            $title = $t['title'] !== '' ? $t['title'] : '(no bolded title)';
            $out .= '- ' . $flag . 'Task ' . $t['id'] . ' — ' . $prefix . $title . "\n";
        }
    }

    $bad = 0;
    foreach ($open as $t) { if (!$t['titleOk']) { $bad++; } }
    $out .= "\n---\n\n";
    $out .= ($total - $bad) . " of $total titles are within 4–12 words. `!` marks the rest;\n";
    $out .= "`php dev/scripts/roadmap_id_check.php` lists them with their word counts.\n";
    return $out;
}

$root     = realpath(__DIR__ . '/../..');
$openPath = $root . '/dev/ROADMAP.md';
$outPath  = $root . '/dev/roadmap-index.md';
$check    = in_array('--check', $argv, true);

if (!is_readable($openPath)) {
    fwrite(STDERR, "generate_roadmap_index: cannot read $openPath\n");
    exit(2);
}

$want = roadmapIndexRender($openPath);

if ($check) {
    $have = is_readable($outPath) ? file_get_contents($outPath) : null;
    if ($have === $want) {
        echo "PASS: dev/roadmap-index.md is current.\n";
        exit(0);
    }
    fwrite(STDERR, "STALE ROADMAP INDEX: dev/roadmap-index.md does not match dev/ROADMAP.md.\n\n");
    if ($have === null) {
        fwrite(STDERR, "    The file is missing entirely.\n");
    }
    fwrite(STDERR, "    Regenerate it:  php dev/scripts/generate_roadmap_index.php\n\n");
    fwrite(STDERR, "This file is generated, never hand-edited. If you edited it, your edit belongs in\n");
    fwrite(STDERR, "dev/ROADMAP.md — the index carries no content of its own.\n");
    exit(1);
}

file_put_contents($outPath, $want);
echo "Wrote dev/roadmap-index.md\n";
exit(0);
