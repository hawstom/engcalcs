<?php
/**
 * host_script_parity_check.php -- ADVISORY. Does dev/host/ still match what runs on the server?
 *
 * WHY. dev/host/README.md claims the copy in this repository is canonical and the copy in ~/ on the
 * host is a deployment. That claim is worth exactly as much as somebody's willingness to check it,
 * and nothing did: check.sh and cronmail.sh existed ONLY on the host until 2026-09-15, were edited
 * there by hand, and a plan written the same day proposed building an uptime watch from scratch
 * because it could not see the one that was already running. A file with two copies and no
 * comparison is the arrangement this tree has been bitten by repeatedly -- 892 English fallbacks
 * drifting from lang.ec.en.php, 199 of them disagreeing the first time anybody compared them.
 *
 * WHY IT IS ADVISORY, AND WHY IT PRINTS THAT IT CHECKED NOTHING. It needs the network and an ssh
 * key. A cold checkout, a CI runner and Tom's other machines have neither, and a blocking check
 * that cannot run is a check somebody deletes. So it follows the pattern screenshot_publish_check
 * and nested_repo_boundary_check already use for the same reason: when it cannot reach the host it
 * says SO, in words, rather than passing in silence. A silent pass from a check that ran nothing is
 * the exact shape that reads as coverage and is not.
 *
 * WHAT A FINDING MEANS IS A JUDGEMENT AND IT IS NOT ALWAYS "COPY THE REPO OVER". Somebody may have
 * fixed something on the host at 4am, in which case the HOST is right and the repository is stale.
 * The script says which side is newer where it can and refuses to recommend; `sh dev/host/install.sh`
 * overwrites the host and keeps a `.before-install` copy, which is the only direction that is safe
 * to automate.
 *
 * Usage:  php dev/scripts/host_script_parity_check.php [--host=ALIAS]
 *         Always exits 0. It is advisory.
 */

$host = 'jconstru';
foreach ($argv as $a) { if (strpos($a, '--host=') === 0) { $host = substr($a, 7); } }

$dir = dirname(__DIR__) . '/host';
$files = array();
foreach (glob($dir . '/*') as $p) {
    $b = basename($p);
    if ($b === 'README.md' || $b === 'install.sh') { continue; }  // never deployed to ~/ as-is
    if (is_file($p)) { $files[$b] = md5_file($p); }
}
printf("Host script parity (advisory) -- %d file(s) in dev/host/ that deploy to ~/\n", count($files));
if (!$files) { echo "  dev/host/ holds nothing deployable. Nothing to compare.\n"; exit(0); }

// Bounded, and the bound is the point: an unbounded ssh in a check that runs on every commit is the
// wait-loop failure in another costume. BatchMode so a missing key fails instead of prompting.
$names = implode(' ', array_map('escapeshellarg', array_keys($files)));
$cmd = 'ssh -o BatchMode=yes -o ConnectTimeout=8 -o StrictHostKeyChecking=accept-new '
     . escapeshellarg($host) . ' ' . escapeshellarg("cd ~ && md5sum $names 2>&1") . ' 2>&1';
$out = array(); $rc = 0;
exec('timeout 25 ' . $cmd, $out, $rc);

// REACHABILITY IS NOT THE EXIT CODE, and reading it as one made this report "CHECKED NOTHING" on a
// host it had just reached: `md5sum` exits non-zero when ANY of its arguments is missing, and a
// file this repository has not installed yet is exactly that case. So the test is whether a single
// md5 line came back -- which only a reached host can produce -- and a missing file is then a
// FINDING rather than a failure to look.
$remote = array();
foreach ($out as $line) {
    if (preg_match('/^([0-9a-f]{32})\s+(\S+)$/', trim($line), $m)) { $remote[$m[2]] = $m[1]; }
}

if (!$remote) {
    echo "  CHECKED NOTHING. Got no checksum back from `$host` over ssh";
    echo ($rc === 124 ? " (timed out after 25s).\n" : " (exit $rc).\n");
    if ($out) { echo "  It said: " . trim(implode(' | ', array_slice($out, 0, 2))) . "\n"; }
    echo "  That is not a pass. The two copies of these scripts are UNCOMPARED, and the\n";
    echo "  claim in dev/host/README.md that this repository holds the canonical copy is\n";
    echo "  unverified on this machine. Run it from a machine with the ssh alias, or\n";
    echo "  compare by hand:  ssh $host 'md5sum ~/check.sh' \n";
    exit(0);
}

$diff = array(); $same = 0; $absent = array();
foreach ($files as $name => $sum) {
    if (!isset($remote[$name])) { $absent[] = $name; continue; }
    if ($remote[$name] === $sum) { $same++; } else { $diff[] = $name; }
}

printf("  %d identical on `%s`\n", $same, $host);
foreach ($absent as $n) {
    echo "  NOT ON THE HOST: ~/$n is missing. It has never been installed, or it was\n";
    echo "    renamed there. Install with: sh dev/host/install.sh  (on the host)\n";
}
foreach ($diff as $n) {
    echo "  DIFFERS: dev/host/$n and ~/$n are not the same file.\n";
    echo "    WHICH ONE IS RIGHT IS A JUDGEMENT. If somebody fixed it on the host, the\n";
    echo "    HOST is canonical and this repository is stale -- read the host copy first:\n";
    echo "      ssh $host 'cat ~/$n' | diff -u dev/host/$n -\n";
    echo "    Only then, and only if the repository is the newer one:\n";
    echo "      sh dev/host/install.sh   (keeps ~/$n.before-install)\n";
}
if (!$diff && !$absent) { echo "  The repository's copy is what is running.\n"; }
exit(0);
