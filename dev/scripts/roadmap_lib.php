<?php
/**
 * Shared roadmap parsing: the ONE definition of a task line, its markers, its actor tag and its
 * executive-summary TITLE. Required by `roadmap_id_check.php` and `generate_roadmap_index.php` so
 * the checker and the index can never disagree about what a title is.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHAT A TITLE IS (this file is the authority; ROADMAP.md's prose only points here):
 *
 *   A task's TITLE is the first bolded run of the description — the `**...**` that opens it, which
 *   may wrap across lines. Everything before it is metadata, not title: the `- priority|id|`
 *   prefix, a `WAIT:`/`CHECK:` marker, and an actor tag (`[H]`, `[CC]`, `[CP]`, `[CC→CP]`). An
 *   actor tag written INSIDE the bold is still metadata and is still not counted.
 *
 *   A title is 4 to 12 words inclusive. A word is a whitespace-separated token containing at least
 *   one letter or digit, so an em dash on its own is not a word and `Task 146` is two.
 *
 *   A colon-led ALL-CAPS keyword (`GEOGRAPHIC PROJECTS: ...`) IS part of the title and IS counted.
 *   It is a rhetorical device inside the title, not a marker, and exempting it would only move
 *   length somewhere the count cannot see.
 *
 * WHY 4-12: under four words a title stops summarizing and becomes a stub ("The Ranges picker");
 * past twelve it is the sentence the body should be carrying. The bound exists so a reader can
 * scan the whole open backlog in one screen — `dev/roadmap-index.md` IS that screen, and it is
 * generated from exactly these titles.
 */

define('ROADMAP_TITLE_MIN', 4);
define('ROADMAP_TITLE_MAX', 12);

/**
 * Parse a roadmap file into task records.
 *
 * Each record: id, priority, line (1-based), nlines, raw (joined description), plus everything
 * roadmapSplitDescription() returns. A block ends at the next task line OR at any heading — the
 * same rule roadmap_id_check.php uses for its length budget, and for the same reason: without it
 * the last task of a section swallows the section prose that follows it.
 */
function roadmapParseTasks($path)
{
    $lines = file($path, FILE_IGNORE_NEW_LINES);
    if ($lines === false) { return array(); }
    $tasks = array();
    $cur = null;
    foreach ($lines as $i => $line) {
        if (preg_match('/^#{1,6}\s/', $line)) {
            if ($cur !== null) { $tasks[] = $cur; $cur = null; }
            continue;
        }
        if (preg_match('/^- (\d+)\|([0-9.]+)\|(.*)$/', $line, $m)) {
            if ($cur !== null) { $tasks[] = $cur; }
            $cur = array(
                'id'       => $m[2],
                'priority' => (int)$m[1],
                'line'     => $i + 1,
                'raw'      => trim($m[3]),
                'nlines'   => 1,
            );
            continue;
        }
        if ($cur !== null) {
            $cur['raw']  .= ' ' . trim($line);
            $cur['nlines']++;
        }
    }
    if ($cur !== null) { $tasks[] = $cur; }

    foreach ($tasks as &$t) {
        $t = array_merge($t, roadmapSplitDescription($t['raw']));
    }
    unset($t);
    return $tasks;
}

/**
 * Split a description into marker, actor tag and title. Definition is in the docblock above.
 * Returns marker (''|'WAIT: sprint'|'CHECK: <date>'), actor (''|'[H]'|…), title, titleWords, titleOk.
 */
function roadmapSplitDescription($desc)
{
    $s = trim($desc);
    $marker = '';
    $actor  = '';

    // Marker and actor tag may appear in either order and either may be absent, so loop rather
    // than privileging one ordering.
    for ($pass = 0; $pass < 4; $pass++) {
        if ($marker === '' && preg_match('/^(WAIT:\s*\S+|CHECK:\s*\d{4}-\d{2}-\d{2})\s*[—–-]?\s*/u', $s, $m)) {
            $marker = preg_replace('/\s+/', ' ', trim($m[1]));
            $s = substr($s, strlen($m[0]));
            continue;
        }
        if ($actor === '' && preg_match('/^(\[[A-Za-z]+(?:→[A-Za-z]+)?\])\s*/u', $s, $m)) {
            $actor = $m[1];
            $s = substr($s, strlen($m[0]));
            continue;
        }
        break;
    }

    $title = '';
    if (preg_match('/^\*\*(.+?)\*\*/su', $s, $m)) {
        $title = preg_replace('/\s+/', ' ', trim($m[1]));
        // An actor tag written inside the bold is still metadata.
        if (preg_match('/^(\[[A-Za-z]+(?:→[A-Za-z]+)?\])\s*/u', $title, $mm)) {
            if ($actor === '') { $actor = $mm[1]; }
            $title = trim(substr($title, strlen($mm[0])));
        }
    }

    $words = roadmapTitleWordCount($title);
    return array(
        'marker'     => $marker,
        'actor'      => $actor,
        'title'      => $title,
        'titleWords' => $words,
        'titleOk'    => ($title !== '' && $words >= ROADMAP_TITLE_MIN && $words <= ROADMAP_TITLE_MAX),
    );
}

/** A word is a whitespace-separated token holding at least one letter or digit. */
function roadmapTitleWordCount($title)
{
    if ($title === '') { return 0; }
    $n = 0;
    foreach (preg_split('/\s+/u', $title, -1, PREG_SPLIT_NO_EMPTY) as $tok) {
        if (preg_match('/[\p{L}\p{N}]/u', $tok)) { $n++; }
    }
    return $n;
}
