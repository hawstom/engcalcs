<?php
/**
 * deploy_identity_selftest.php -- the About box's build line describes the DEPLOY, not a file.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. `ecDeployIdentity()` took its date from `filemtime(__FILE__)` -- the mtime of
 * lib/config.inc.php, the file it happens to live in. A `git pull` only touches the files it
 * changed, so the date froze on 2026-09-11 18:47 UTC, the last time that one file moved, while the
 * sha printed beside it advanced with every deploy.
 *
 * **THE READOUT IS HOW SOMEBODY DECIDES WHETHER A PULL LANDED**, which makes a plausible-looking
 * stale date worse than no date at all. Tom, 2026-09-12: *"the SHA updates but the date is stuck on
 * the 11th."* He had spent the preceding exchange debugging a deploy that was in fact fine.
 *
 * **NOTHING COULD HAVE CAUGHT IT BY READING.** Both halves were present, well-formed and
 * individually correct; only their RELATIONSHIP was wrong, and it is a relationship you can see
 * only by moving one of them. So this file moves them: it builds `.git` skeletons with mtimes it
 * chooses, and asserts which file the answer came from. That is also why `ecDeployIdentity()` takes
 * an optional root -- it was untestable while it could only ever read the real repository.
 *
 * Usage:
 *   php dev/scripts/deploy_identity_selftest.php
 */

require_once(__DIR__ . '/../../lib/config.inc.php');

$fails = 0;
function ok(string $label, bool $cond, string $extra = ''): void
{
    global $fails;
    if (!$cond) { $fails++; }
    echo ($cond ? '  ok   ' : '  FAIL ') . $label . ($extra === '' ? '' : '   ' . $extra) . "\n";
}
/** A .git skeleton under a fresh temp root. @param array<string,string> $files path => contents */
function fixture(array $files, array $times = []): string
{
    $root = sys_get_temp_dir() . '/ec-deploy-' . bin2hex(random_bytes(6));
    foreach ($files as $rel => $body) {
        $path = $root . '/' . $rel;
        @mkdir(dirname($path), 0700, true);
        file_put_contents($path, $body);
    }
    // Written after every file exists: creating a sibling can restamp a directory, never a file.
    foreach ($times as $rel => $t) { touch($root . '/' . $rel, $t); }
    return $root;
}
function rmtree(string $d): void
{
    if (!is_dir($d)) { return; }
    foreach (scandir($d) as $e) {
        if ($e === '.' || $e === '..') { continue; }
        $p = $d . '/' . $e;
        is_dir($p) ? rmtree($p) : @unlink($p);
    }
    @rmdir($d);
}
function utc(int $t): string { return gmdate('Y-m-d H:i', $t) . ' UTC'; }

$SHA = 'a1b2c3d4e5f60718293a4b5c6d7e8f9012345678';

// ================================================================================================
// 1. THE DATE IS THE REF'S, AND THE REF IS WHAT A FAST-FORWARD REWRITES
// ================================================================================================
echo "\n--- the ordinary case: a branch with a loose ref ---\n";
{
    $when = mktime(3, 4, 0, 7, 8, 2026);
    $r = fixture([
        '.git/HEAD' => "ref: refs/heads/master\n",
        '.git/refs/heads/master' => $SHA . "\n",
        '.git/logs/HEAD' => "0000 $SHA nobody <n@x> 1 +0000\tpull: Fast-forward\n",
    ], [
        '.git/refs/heads/master' => $when,
        '.git/logs/HEAD' => $when,
        '.git/HEAD' => $when - 86400 * 9,      // a checkout, long before this deploy
    ]);
    $d = ecDeployIdentity($r);
    ok('the sha is the ref, shortened to eight', $d['sha'] === substr($SHA, 0, 8), $d['sha']);
    ok('the date is when the REF last moved', $d['date'] === utc($when), $d['date']);
    rmtree($r);
}

// ================================================================================================
// 2. THE REGRESSION ITSELF
// ================================================================================================
// The whole defect in one assertion: a checkout whose ref moved TODAY and whose config.inc.php has
// not been touched in a year must not report last year.
echo "\n--- and it is not this file's own mtime ---\n";
{
    // **A FIXED DATE IN THE PAST, and that is the point of it.** The first version of this used
    // `time() - 60`, which coincided with config.inc.php's own mtime the minute that file was
    // edited -- so the assertion passed while proving nothing. A stamp nothing else in the tree can
    // share is what makes the comparison mean something.
    $when = mktime(3, 4, 0, 1, 2, 2025);
    $r = fixture([
        '.git/HEAD' => "ref: refs/heads/master\n",
        '.git/refs/heads/master' => $SHA . "\n",
        '.git/logs/HEAD' => "x\n",
    ], ['.git/refs/heads/master' => $when, '.git/logs/HEAD' => $when]);
    $d = ecDeployIdentity($r);
    $ownFile = gmdate('Y-m-d H:i', (int)filemtime(__DIR__ . '/../../lib/config.inc.php')) . ' UTC';
    ok('the date tracks the deploy', $d['date'] === utc($when), $d['date']);
    ok('...and is NOT lib/config.inc.php\'s mtime, which is the bug this replaced',
        $d['date'] !== $ownFile, 'reported ' . $d['date'] . ', config.inc.php is ' . $ownFile);
    rmtree($r);
}

// ================================================================================================
// 3. THE NEWEST MARKER WINS, BECAUSE ONLY ONE OF THEM RECORDS SOME MOVES
// ================================================================================================
echo "\n--- the reflog is consulted too ---\n";
{
    $old = mktime(1, 0, 0, 1, 2, 2026);
    $new = mktime(5, 30, 0, 3, 4, 2026);
    $r = fixture([
        '.git/HEAD' => "ref: refs/heads/master\n",
        '.git/refs/heads/master' => $SHA . "\n",
        '.git/logs/HEAD' => "x\n",
    ], ['.git/refs/heads/master' => $old, '.git/logs/HEAD' => $new]);
    ok('a reflog newer than the ref is the answer', ecDeployIdentity($r)['date'] === utc($new),
        ecDeployIdentity($r)['date']);
    rmtree($r);
}

// ================================================================================================
// 4. PACKED REFS, A DETACHED HEAD, AND NO .git AT ALL
// ================================================================================================
echo "\n--- the three shapes that are not an ordinary branch ---\n";
{
    // `git gc` has taken the loose ref away; the sha is in one table.
    $when = mktime(9, 15, 0, 2, 3, 2026);
    $r = fixture([
        '.git/HEAD' => "ref: refs/heads/master\n",
        '.git/packed-refs' => "# pack-refs with: peeled fully-peeled sorted \n" .
            $SHA . " refs/heads/master\n",
    ], ['.git/packed-refs' => $when]);
    $d = ecDeployIdentity($r);
    ok('a packed ref still yields the sha', $d['sha'] === substr($SHA, 0, 8), $d['sha']);
    ok('...and the date comes from packed-refs', $d['date'] === utc($when), $d['date']);
    rmtree($r);
}
{
    $when = mktime(11, 45, 0, 4, 5, 2026);
    $r = fixture(['.git/HEAD' => $SHA . "\n"], ['.git/HEAD' => $when]);
    $d = ecDeployIdentity($r);
    ok('a detached HEAD is the sha itself', $d['sha'] === substr($SHA, 0, 8), $d['sha']);
    ok('...and dates from HEAD, the only file that moved', $d['date'] === utc($when), $d['date']);
    rmtree($r);
}
{
    // A deploy unpacked from an archive. The date is best-effort and the sha is honestly empty --
    // an empty sha is what Looped-Network.php's `if` is written for.
    $r = fixture(['index.php' => "<?php\n"]);
    $d = ecDeployIdentity($r);
    ok('no .git means no sha claimed', $d['sha'] === '', $d['sha']);
    ok('...and a date is still offered rather than nothing', $d['date'] !== '', $d['date']);
    rmtree($r);
}

// ================================================================================================
// 5. FETCH_HEAD IS NOT A DEPLOY
// ================================================================================================
// A bare `git fetch` rewrites FETCH_HEAD and deploys nothing. Consulting it would have reported a
// deploy 8 minutes after the real one on this very account, measured 2026-09-12.
echo "\n--- a fetch is not a deploy ---\n";
{
    $deployed = mktime(6, 0, 0, 6, 7, 2026);
    $fetched  = $deployed + 3600;
    $r = fixture([
        '.git/HEAD' => "ref: refs/heads/master\n",
        '.git/refs/heads/master' => $SHA . "\n",
        '.git/logs/HEAD' => "x\n",
        '.git/FETCH_HEAD' => $SHA . "\t\tbranch 'master' of github\n",
    ], [
        '.git/refs/heads/master' => $deployed,
        '.git/logs/HEAD' => $deployed,
        '.git/FETCH_HEAD' => $fetched,
    ]);
    ok('a FETCH_HEAD an hour newer does not move the date',
        ecDeployIdentity($r)['date'] === utc($deployed), ecDeployIdentity($r)['date']);
    rmtree($r);
}

// ================================================================================================
// 6. THE REAL REPOSITORY STILL ANSWERS
// ================================================================================================
echo "\n--- and the live call, with no argument, still works ---\n";
{
    $d = ecDeployIdentity();
    ok('a sha of eight hex characters', (bool)preg_match('/^[0-9a-f]{8}$/', $d['sha']), $d['sha']);
    ok('a date in the format the About box prints',
        (bool)preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC$/', $d['date']), $d['date']);
}

echo $fails ? "\n$fails FAILURE(S)\n" : "\nall checks passed\n";
exit($fails ? 1 : 0);
