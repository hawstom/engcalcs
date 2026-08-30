<?php
/**
 * doc_path_check.php — every path CLAUDE.md cites is a file that exists. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. CLAUDE.md is read at the start of every session and is almost entirely
 * POINTERS: read `dev/language-strings.md` before editing a string, the recipe is in
 * `dev/calc-spike/README.md`, the seam is guarded by `dev/scripts/scenario_seam_check.php`. A
 * pointer at a file that has been renamed or deleted fails in the worst possible way — the reader
 * concludes the rule was withdrawn, or invents the missing file's contents. Nothing else in the
 * repository can notice: the file still reads perfectly.
 *
 * It is the same failure mode Task 322's row 6 found in prose (a rule naming `ecSessionStart()`,
 * a function deleted with Task 288) and that the meta-description exempt list had until
 * 2026-08-25 — prose that describes a repository which no longer exists.
 *
 * WHY THE SCOPE IS CLAUDE.md ONLY, AND WHY THAT IS NOT A DODGE. Measured across `dev/*.md` there
 * are 31 dead citations, and nearly every one is legitimate: `dev/history.md`,
 * `dev/roadmap-closed-ids.md` and `dev/translation-execution-log.md` are RECORDS, and a record
 * that says "this was moved out of `dev/librewaternet-landing/`" is correct precisely because that
 * directory is gone. Widening this check turns it into a judgement call about which citations are
 * history, which is exactly the shape of check that gets muted and then ignored. CLAUDE.md is
 * different in kind: it states CURRENT state, never history, so a dead pointer in it is always a
 * defect. It has 0 today.
 *
 * WHAT COUNTS AS A PATH, AND WHY THE ANSWER IS DELIBERATELY TIMID. Backticks in this file mostly
 * hold code: `$ec_lang[]`, `setProp()`, `lpn_`, `EngCalcs.lpnValveIsNative`, `ft = 0.3048 m`. A
 * check that guessed generously would spend its life being wrong, so a candidate must look like a
 * path and nothing else:
 *
 *   - it contains a `/` (a bare `check_all.sh` could be anywhere, and resolving it would mean
 *     searching, which is guessing);
 *   - every segment is drawn from [A-Za-z0-9._-] plus the glob characters `*` and `?`;
 *   - the last segment carries a file extension, or the whole thing ends in `/`;
 *   - it does not leave this tree: not a URL, not absolute, no `~` and no `..`.
 *     `~/webdev/librewaternet.org` is the SIBLING REPOSITORY, and `../sitemap.xml` is generated
 *     and deliberately untracked, so in both cases an absence proves nothing.
 *
 * A glob is resolved as a glob (`lib/lang.ec.??.php`, `dev/*.md`) and satisfied by one match.
 * Everything the rules above turned away is COUNTED and the count is printed, so the check's reach
 * is a number on the screen rather than an implied promise.
 *
 * Usage:
 *   php dev/scripts/doc_path_check.php            # CLAUDE.md
 *   php dev/scripts/doc_path_check.php -v         # ... and list what it resolved and skipped
 *
 * Exit 0 = every cited path resolves. Exit 1 = one does not, with the line it is cited on.
 */

/**
 * Classify one backticked run of text. Pure, so the selftest can drive it without a filesystem.
 *
 * @param string $text What sat between the backticks.
 * @return array{0:string,1:string} [kind, cleaned] where kind is 'path', 'glob',
 *         'outside' (absolute or ~), 'url', or 'not-a-path'.
 */
function ecClassifyCitation(string $text): array
{
    $t = trim($text);
    // Trailing sentence punctuation belongs to the prose, not the path. A trailing '/' does not.
    $t = rtrim($t, ".,;:!?");
    if ($t === '') { return ['not-a-path', $t]; }

    if (preg_match('#^[a-z][a-z0-9+.-]*://#i', $t) || str_starts_with($t, 'www.')) {
        return ['url', $t];
    }
    // A shell command, a signature, an expression: anything with a space or a code character is
    // not being cited AS a path, whatever else it may contain.
    if (preg_match('/[\s()\[\]{}<>$=|&;\'"`,!@#%^+\\\\]/u', $t)) { return ['not-a-path', $t]; }
    if (str_starts_with($t, '/') || str_starts_with($t, '~')) { return ['outside', $t]; }
    // `../sitemap.xml` escapes the tree, and its absence proves nothing: CLAUDE.md itself records
    // that it is generated and deliberately NOT tracked by git, so a checkout never has one.
    if (in_array('..', explode('/', $t), true)) { return ['outside', $t]; }
    if (!str_contains($t, '/')) { return ['not-a-path', $t]; }

    $segments = explode('/', $t);
    $trailingSlash = end($segments) === '';
    if ($trailingSlash) { array_pop($segments); }
    if (!$segments) { return ['not-a-path', $t]; }
    foreach ($segments as $seg) {
        if ($seg === '' || !preg_match('/^[A-Za-z0-9._*?-]+$/', $seg)) {
            return ['not-a-path', $t];
        }
    }
    // A directory citation ends in '/'; a file citation carries an extension. `1/128`, `24/7` and
    // `outwardY/inwardY` all fail here, which is the point.
    $last = end($segments);
    if (!$trailingSlash && !preg_match('/\.[A-Za-z0-9]{1,6}$/', $last)) {
        return ['not-a-path', $t];
    }
    return [str_contains($t, '*') || str_contains($t, '?') ? 'glob' : 'path', $t];
}

/**
 * Every backticked run in one markdown text, with the line it sits on.
 *
 * Fenced code blocks are skipped: a ```sh block is a command to run, not a citation, and the
 * markdown inside it is not being pointed at.
 *
 * @return array<int,array{0:string,1:int}> [text, line] pairs.
 */
function ecCitationsInMarkdown(string $md): array
{
    $out = [];
    $inFence = false;
    foreach (explode("\n", $md) as $i => $line) {
        if (preg_match('/^\s*```/', $line)) { $inFence = !$inFence; continue; }
        if ($inFence) { continue; }
        if (!preg_match_all('/`([^`\n]+)`/', $line, $m)) { continue; }
        foreach ($m[1] as $text) { $out[] = [$text, $i + 1]; }
    }
    return $out;
}

/**
 * Every citation in one markdown text, resolved against one root. Pure apart from the filesystem
 * it is handed, so the selftest can point it at a fixture tree.
 *
 * @return array{dead:array<int,array{0:string,1:int}>, ok:array<int,string>, skipped:array<string,int>}
 */
function ecResolveCitations(string $md, string $root): array
{
    $dead = [];
    $ok = [];
    $skipped = ['not-a-path' => 0, 'url' => 0, 'outside' => 0];
    foreach (ecCitationsInMarkdown($md) as [$text, $line]) {
        [$kind, $path] = ecClassifyCitation($text);
        if ($kind !== 'path' && $kind !== 'glob') { $skipped[$kind]++; continue; }
        $full = $root . '/' . rtrim($path, '/');
        $exists = ($kind === 'glob')
            ? (bool) glob($full, GLOB_BRACE)
            : (file_exists($full) || is_dir($full));
        if ($exists) { $ok[] = "$path (line $line)"; continue; }
        $dead[] = [$path, $line];
    }
    return ['dead' => $dead, 'ok' => $ok, 'skipped' => $skipped];
}

if (defined('DOC_PATH_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$verbose = in_array('-v', $argv, true) || in_array('--verbose', $argv, true);
$doc = $root . '/CLAUDE.md';
if (!is_file($doc)) {
    echo "doc_path_check: CLAUDE.md is missing from " . $root . "\n";
    exit(1);
}

$report   = ecResolveCitations(file_get_contents($doc), $root);
$dead     = $report['dead'];
$resolved = $report['ok'];
$ok       = count($resolved);
$skipped  = $report['skipped'];

if ($dead) {
    echo 'CLAUDE.md cites ' . count($dead) . " path(s) that do not exist\n\n";
    foreach ($dead as [$path, $line]) { echo sprintf("  CLAUDE.md:%d  %s\n", $line, $path); }
    echo "\nCLAUDE.md is read at the start of every session and is almost all pointers. A pointer at\n";
    echo "a file that is gone does not fail loudly -- the reader concludes the rule was withdrawn,\n";
    echo "or invents what the missing file said.\n";
    echo "\nFIX, in the order to try them:\n";
    echo "  - the file MOVED: update the citation to where it is now;\n";
    echo "  - the file was DELETED and its rule still stands: move the rule's substance into\n";
    echo "    CLAUDE.md, or into the file that replaced it, and cite that;\n";
    echo "  - the file was deleted and the rule went with it: delete the sentence. A correction\n";
    echo "    SUBSTITUTES the superseded text; it never appends to it.\n";
    echo "Do not silence this by removing the backticks.\n";
    exit(1);
}

echo "CLAUDE.md paths OK -- $ok cited path(s) resolve, none dead.\n";
echo sprintf("  not read as paths: %d code/prose run(s), %d URL(s), %d outside this repo"
    . " (absolute or ~, e.g. the librewaternet.org sibling).\n",
    $skipped['not-a-path'], $skipped['url'], $skipped['outside']);
if ($verbose) {
    foreach ($resolved as $r) { echo "    ok  $r\n"; }
}
exit(0);
