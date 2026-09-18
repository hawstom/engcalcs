<?php
/**
 * docroot_exposure_selftest.php -- prove docroot_exposure_check.php still fails.
 *
 * WHY. That check passes by finding nothing, and this repository has already had one
 * scan die of success while reporting a clean zero. Worse, the thing it guards CANNOT
 * be observed from inside the tree: the exposure was a live HTTP 200 on a host, found
 * by a cron job, and the check only reads declarations. So the check going blind would
 * look exactly like the check working, for as long as nobody happened to fetch the URL.
 *
 * HOW. A LIVE MUTATION, not a fixture: each case builds a throwaway git checkout with
 * the shape under test and runs the REAL script against it with --root. That is also
 * why the check takes --root at all; it was untestable while it could only read the
 * tree it lived in, the same reason ecDeployIdentity() grew one.
 *
 * Usage:  php dev/scripts/docroot_exposure_selftest.php      Exit 0 pass, 1 fail.
 */

$check = __DIR__ . '/docroot_exposure_check.php';
$tmp = sys_get_temp_dir() . '/ec-docroot-selftest-' . getmypid();
$pass = 0; $fail = array();

function sh($cmd) { exec($cmd . ' 2>&1', $o, $rc); return array(implode("\n", $o), $rc); }

function build($dir, $files, $rootHtaccess) {
    sh('rm -rf ' . escapeshellarg($dir));
    mkdir($dir, 0777, true);
    foreach ($files as $rel => $body) {
        $p = $dir . '/' . $rel;
        @mkdir(dirname($p), 0777, true);
        file_put_contents($p, $body);
    }
    file_put_contents($dir . '/.htaccess', $rootHtaccess);
    // A real checkout: the check reads `git ls-files`, so an un-added tree is invisible
    // to it -- which is correct behaviour and would silently pass every case here.
    sh('git -C ' . escapeshellarg($dir) . ' init -q');
    sh('git -C ' . escapeshellarg($dir) . ' add -A .');
    return $dir;
}

// The blanket rule as the real root .htaccess carries it.
$BLANKET = "RedirectMatch 404 \"/\\.(?!well-known/)[^/]+/\"\n";
$DENY    = "Require all denied\n";

// A tree that must PASS: one web-served directory, one declared non-web that denies,
// one dot-directory blocked at both levels.
$ok = array(
    'js/app.js'          => "//\n",
    'dev/.htaccess'      => $DENY,
    'dev/ROADMAP.md'     => "x\n",
    '.claude/.htaccess'  => $DENY,
    '.claude/settings.json' => "{}\n",
);

$cases = array(
    // 1. THE SHAPE THAT SHIPPED. A dot-directory with no denial of its own. This is
    //    .claude as it actually stood on 2026-09-15, and the blanket rule IS present
    //    -- so only the second-level leg can see it. Without this case, deleting that
    //    leg would leave the selftest green.
    array('name' => 'dot-directory with no .htaccess of its own',
          'files' => array('js/app.js' => "//\n", 'dev/.htaccess' => $DENY,
                           'dev/ROADMAP.md' => "x\n",
                           '.claude/settings.json' => "{\"permissions\":{}}\n"),
          'root' => $BLANKET, 'want' => 1, 'expect' => '.claude/'),

    // 2. The blanket rule deleted, every per-directory file still in place. The
    //    complement of case 1: only the first leg can see this, and it is the leg that
    //    covers the NEXT dot-directory somebody adds.
    array('name' => 'blanket dot-directory rule missing from the root .htaccess',
          'files' => $ok,
          'root' => "Options -Indexes\n<FilesMatch \"^\\.\">\nRequire all denied\n</FilesMatch>\n",
          'want' => 1, 'expect' => 'blanket'),

    // 3. THE RATCHET. A declared non-web directory whose denial has been emptied. One
    //    deleted line puts the whole development tree on the web.
    array('name' => 'declared non-web directory that no longer denies',
          'files' => array('js/app.js' => "//\n", 'dev/.htaccess' => "# nothing\n",
                           'dev/ROADMAP.md' => "x\n", '.claude/.htaccess' => $DENY,
                           '.claude/settings.json' => "{}\n"),
          'root' => $BLANKET, 'want' => 1, 'expect' => 'dev/'),

    // 4. A NEW directory declared neither way. The leg that forces the question rather
    //    than answering it, and the only one that fires on work nobody thought was
    //    about exposure at all.
    array('name' => 'undeclared top-level directory',
          'files' => $ok + array('secrets/keys.txt' => "x\n"),
          'root' => $BLANKET, 'want' => 1, 'expect' => 'secrets/'),

    // 5. A stale declaration. `lpn-locks` is declared non-web; a tree without it must
    //    fail, or the list reads as coverage of something that is gone.
    array('name' => 'declaration matching no tracked files',
          'files' => $ok, 'root' => $BLANKET, 'want' => 1, 'expect' => 'lpn-locks'),

    // 6. AND IT MUST PASS WHEN THE TREE IS RIGHT. A check that fails on everything is
    //    as useless as one that fails on nothing, and this is the case that would catch
    //    a regex made so greedy it matches the correct shape too.
    array('name' => 'a correctly declared tree passes',
          'files' => $ok, 'root' => $BLANKET, 'want' => 0, 'expect' => null),
);

// Cases 1-4 and 6 all carry dev/ and .claude/; case 5's tree omits lpn-locks, which
// every tree here does -- so case 5's expectation is what cases 1-4 and 6 would ALSO
// report. Declare the stale-declaration findings out of the way by giving every tree
// the four declared non-web directories, except case 5 which is about their absence.
$fullNonWeb = array('log/.htaccess' => $DENY, 'log/x.log' => "x\n",
                    'lpn-locks/.htaccess' => $DENY, 'lpn-locks/x' => "x\n",
                    'spock/.htaccess' => $DENY, 'spock/x.php' => "<?php\n",
                    'css/a.css' => "a{}\n", 'icons/a.png' => "x\n",
                    'examples/a.lwn' => "{}\n", 'lib/a.inc.php' => "<?php\n",
                    'spreadsheet/a.php' => "<?php\n",
                    // Web-served and password protected, so it needs files but no denial: its
                    // .htaccess carries HTTP Basic rather than `Require all denied`.
                    'usage-report/index.php' => "<?php\n",
                    'usage-report/.htaccess' => "AuthType Basic\nRequire valid-user\n");
foreach ($cases as $i => $c) {
    if ($c['name'] === 'declaration matching no tracked files') { continue; }
    $cases[$i]['files'] = $c['files'] + $fullNonWeb;
}

foreach ($cases as $n => $c) {
    $dir = build($tmp, $c['files'], $c['root']);
    list($out, $rc) = sh('php ' . escapeshellarg($check) . ' --root=' . escapeshellarg($dir));
    $label = sprintf('case %d: %s', $n + 1, $c['name']);
    if ($rc !== $c['want']) {
        $fail[] = "$label\n      wanted exit {$c['want']}, got $rc\n"
                . '      ' . str_replace("\n", "\n      ", $out);
        continue;
    }
    if ($c['expect'] !== null && strpos($out, $c['expect']) === false) {
        $fail[] = "$label\n      exited {$c['want']} but never named '{$c['expect']}'.\n"
                . "      An exit code alone does not prove it failed for the right reason.\n"
                . '      ' . str_replace("\n", "\n      ", $out);
        continue;
    }
    $pass++;
}
sh('rm -rf ' . escapeshellarg($tmp));

printf("Docroot exposure selftest -- %d/%d cases\n", $pass, count($cases));
if ($fail) {
    echo "\n";
    foreach ($fail as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "  The real check was run against a built tree in every case, not a fixture.\n";
exit(0);
