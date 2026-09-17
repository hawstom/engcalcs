<?php
/**
 * docroot_exposure_check.php -- every directory in this tree is either DECLARED
 * web-served or BLOCKED over HTTP, and the blocks are still there.
 *
 * WHY THIS EXISTS. The suite is served straight out of a `git pull` checkout, so
 * every tracked directory is under the document root whether or not it is a place
 * a visitor has any business reaching. Four directories carry their own
 * `.htaccess` to say so -- `dev/`, `log/`, `lpn-locks/`, `spock/` -- and `.git`
 * carries a `RedirectMatch` in the root file. Three did not:
 *
 *     https://hawsedc.com/engcalcs/.claude/settings.json          HTTP 200
 *     https://hawsedc.com/engcalcs/.vscode/engcalcs.code-snippets HTTP 200
 *     https://hawsedc.com/engcalcs/.claude/hooks/guard-wait-loops.php  HTTP 500
 *
 * The agent definitions, the hook scripts and the permission allow-list, readable
 * by anybody. Found 2026-09-15 by the account's own daily page check, which noticed
 * the 500 -- NOT by anything in this repository, and not by reading, because the
 * root `.htaccess` LOOKS like it covers the case: `<FilesMatch "^\.">` matches
 * FILENAMES, and `settings.json` is not a dotfile just because its directory is.
 * That exact lesson was already written in this tree, in the comment above the
 * `.git` rule, and the tree then made the same mistake three more times.
 *
 * THE SIGNATURE, which is the reusable part: this is a construct written eight
 * times with the discriminating detail present on five and absent on three -- the
 * same shape as `rel="noopener"` (13 links with, 12 without) and the cookie
 * attributes (5 writes naming all three, 2 naming none). A rule nobody wrote down
 * gets decided twice in opposite directions, and counting finds it where reading
 * does not. See dev/enforceable-rules-survey.md.
 *
 * THE FAILURE IS SILENT AND IS NOT A BROKEN PAGE. Nothing renders wrong, no visitor
 * complains, no harness goes red; the suite is GPL v3 so published source is not
 * itself the harm. The harm is that a directory somebody deliberately blocked can
 * be unblocked by deleting one line, and that the next directory added is exposed
 * by default rather than blocked by default.
 *
 * WHAT IT HOLDS, all three legs decidable so a false positive is impossible:
 *   1. Every tracked DOT-DIRECTORY is covered by the blanket rule in the root
 *      `.htaccess` AND carries its own denial. Two override levels, deliberately
 *      -- the root rule is mod_alias, the per-directory files are mod_authz_core,
 *      and a host change can silence one without the other.
 *   2. Every directory DECLARED non-web below still denies. This is the ratchet:
 *      the protection cannot be deleted quietly.
 *   3. Every other top-level directory is DECLARED web-served, by name, here. A
 *      directory that is neither is a FAILURE -- not because it is wrong, but
 *      because nobody has said which it is, and "exposed by default" is the state
 *      this check exists to end.
 *
 * It reads the DECLARATIONS, never the live site. It cannot prove Apache obeys
 * them: that needs a request, the answer differs per host, and a check that
 * depended on the network could not run in a cold checkout. What proves the other
 * half is the account's own page check on the host, which fetches every URL on the
 * account daily and reads the body as well as the status. Task 676 brings that
 * script into this tree so it is versioned rather than living only on the server.
 *
 * Usage:  php dev/scripts/docroot_exposure_check.php [--root=DIR]
 *         --root lets the selftest point it at a tree it built. Exit 0 pass, 1 fail.
 */

// Directories a visitor is MEANT to reach. Adding one is a deliberate act.
$WEB_SERVED = array(
    'css'         => 'stylesheets the pages link',
    'js'          => 'the client-side calculation engine and the map editor',
    'icons'       => 'favicons, touch icons and the social share cards',
    'examples'    => 'the .lwn example networks the gallery opens',
    'lib'         => 'includes. Fetched directly they define functions and print nothing; '
                   . 'the suite is GPL v3, so this is source we publish anyway',
    'spreadsheet' => 'the one-page spreadsheet variant of Manning Pipe Flow',
    // WEB-SERVED AND PASSWORD PROTECTED, which is a third state this list does not model and did
    // not need to until now. It is here rather than in $NON_WEB because it is genuinely fetched
    // over HTTP -- by one person, behind HTTP Basic declared in its own .htaccess. It has a
    // directory of its own precisely so that auth declaration cannot 500 the whole suite the way
    // `Options` can; see usage-report/.htaccess and dev/usage-report-page.md.
    'usage-report' => 'the private usage report page, behind HTTP Basic in its own .htaccess',
);

// Directories blocked from the web, each with the reason a visitor has no business there.
$NON_WEB = array(
    'dev'       => 'the whole development tree: roadmap, scripts, harnesses, agent journals',
    'log'       => 'usage logs. Personal-adjacent by aggregation even though no row names anybody',
    'lpn-locks' => 'the looped-network file lock broker\'s state',
    'spock'     => 'a separate experiment that shares this docroot',
);

$root = getcwd();
foreach ($argv as $a) {
    if (strpos($a, '--root=') === 0) { $root = substr($a, 7); }
}
$root = rtrim($root, '/');

$fail = array();
$notes = array();

// ---------------------------------------------------------------------------
// The tracked directory list. `git ls-files` rather than a directory walk, so an
// untracked scratch directory in somebody's worktree is not a finding -- it is not
// deployed, because deployment is `git pull`.
// ---------------------------------------------------------------------------
$ls = array();
exec('git -C ' . escapeshellarg($root) . ' ls-files 2>/dev/null', $ls, $rc);
if ($rc !== 0 || !$ls) {
    fwrite(STDERR, "docroot exposure: `git ls-files` gave nothing in $root -- not a checkout?\n");
    exit(1);
}
$dirs = array();
foreach ($ls as $f) {
    if (strpos($f, '/') === false) { continue; }   // a top-level file is a page or a config
    $top = substr($f, 0, strpos($f, '/'));
    if (!isset($dirs[$top])) { $dirs[$top] = 0; }
    $dirs[$top]++;
}
ksort($dirs);

// ---------------------------------------------------------------------------
// Leg 1a. The blanket dot-directory rule in the root .htaccess.
//
// Matched on SHAPE rather than on the exact bytes: a rule that 404s or denies a
// path segment beginning with a dot. Requiring the literal line would fail the day
// somebody reworded the regex for a reason, which is a check training people to
// leave it alone rather than to keep it correct.
// ---------------------------------------------------------------------------
$rootHt = $root . '/.htaccess';
$blanket = false;
if (is_file($rootHt)) {
    foreach (file($rootHt) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') { continue; }
        if (preg_match('/^(RedirectMatch|RewriteRule)\b.*\\\\\.(?!git)/i', $line)
            && preg_match('/\[\^\/\]|\.\+|\.\*/', $line)) {
            $blanket = true;
        }
    }
}
if (!$blanket) {
    $fail[] = "The root .htaccess has no blanket DOT-DIRECTORY rule.\n"
        . "    `<FilesMatch \"^\\.\">` does NOT cover one: it matches FILENAMES, so\n"
        . "    .claude/settings.json is served as an ordinary .json file. That is how\n"
        . "    the agent definitions and the permission list reached the open web.\n"
        . "    FIX: restore a line of the shape\n"
        . "        RedirectMatch 404 \"/\\.(?!well-known/)[^/]+/\"";
}

// ---------------------------------------------------------------------------
// Leg 1b + 2. Each directory that must deny, denies.
// ---------------------------------------------------------------------------
function ec_denies($path) {
    if (!is_file($path)) { return false; }
    foreach (file($path) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') { continue; }
        if (preg_match('/^Require\s+all\s+denied/i', $line))      { return true; }
        if (preg_match('/^(Deny\s+from\s+all|Order\s+deny)/i', $line)) { return true; }
    }
    return false;
}

$dotCount = 0; $nonWebCount = 0; $webCount = 0;
foreach ($dirs as $d => $n) {
    $isDot = ($d[0] === '.');
    $ht = $root . '/' . $d . '/.htaccess';

    if ($isDot) {
        $dotCount++;
        if (!ec_denies($ht)) {
            $fail[] = "$d/ is a tracked DOT-DIRECTORY ($n files) with no denial of its own.\n"
                . "    The blanket rule in the root .htaccess is mod_alias; this is the\n"
                . "    second, independent level, and the one that still holds if a host\n"
                . "    change stops the first being read.\n"
                . "    FIX: printf 'Require all denied\\n' > $d/.htaccess";
        }
        continue;
    }
    if (isset($NON_WEB[$d])) {
        $nonWebCount++;
        if (!ec_denies($ht)) {
            $fail[] = "$d/ is DECLARED non-web here ($NON_WEB[$d]) and no longer denies.\n"
                . "    $n tracked files are being served. This is the ratchet leg: a\n"
                . "    deliberate block must not be removable by deleting one line.\n"
                . "    FIX: restore `Require all denied` in $d/.htaccess, or move the\n"
                . "    directory out of \$NON_WEB in this script and say why it is served.";
        }
        continue;
    }
    if (isset($WEB_SERVED[$d])) { $webCount++; continue; }

    $fail[] = "$d/ ($n tracked files) is DECLARED NEITHER web-served nor blocked.\n"
        . "    Deployment is `git pull`, so every tracked directory is under the\n"
        . "    document root and this one is reachable by default. Nobody has said\n"
        . "    whether that is intended.\n"
        . "    FIX: add it to \$WEB_SERVED in this script with the reason a visitor\n"
        . "    reaches it, OR add it to \$NON_WEB and give it an .htaccess saying\n"
        . "    `Require all denied`. Exposed-by-default is the state this ends.";
}

// Declarations that match nothing are stale and must fail: a declared directory
// that has been deleted or renamed makes the list read as coverage it no longer has.
foreach (array('WEB_SERVED' => $WEB_SERVED, 'NON_WEB' => $NON_WEB) as $name => $set) {
    foreach ($set as $d => $why) {
        if (!isset($dirs[$d])) {
            $fail[] = "\$$name declares '$d/', which holds no tracked files.\n"
                . "    A declaration matching nothing reads as coverage. FIX: delete the row.";
        }
    }
}

// ---------------------------------------------------------------------------
// Report. The counts are printed on a pass as well, because a scan that has gone
// blind finds nothing and reads as progress -- the shape that has already died of
// success in this repository once.
// ---------------------------------------------------------------------------
printf("Docroot exposure -- %d tracked top-level directories\n", count($dirs));
printf("  %d dot-directories, each blocked at two override levels\n", $dotCount);
printf("  %d declared non-web, each still denying\n", $nonWebCount);
printf("  %d declared web-served\n", $webCount);
printf("  blanket dot-directory rule in the root .htaccess: %s\n", $blanket ? 'present' : 'MISSING');

if ($fail) {
    echo "\n" . count($fail) . " finding(s):\n\n";
    foreach ($fail as $f) { echo "  * $f\n\n"; }
    echo "This check reads DECLARATIONS, never the live site. What proves Apache obeys\n";
    echo "them is the account's own daily page check on the host (see Task 676).\n";
    exit(1);
}
echo "\nNothing exposed by default.\n";
exit(0);
