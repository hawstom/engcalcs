<?php
/**
 * A LIVE MUTATION, because a check that passes by finding nothing has already died of success in
 * this repository once (js_fallback_string_check.php's corpus guard, 2026-09-06).
 *
 * nav_link_absolute_check.php is a ratchet at zero and was BORN at zero -- the defect it holds was
 * fixed in the same commit that wrote it. So the only thing standing between that check and a
 * silent, permanent pass is this file: it puts one relative href back into the real nav, runs the
 * REAL check over the REAL tree, requires it to name that link, and restores the file.
 *
 * The restore is in a shutdown handler, not at the foot of the script: a fatal in the middle would
 * otherwise leave lib/Menus.lib.php broken for every other session working in this directory.
 */

$menus = dirname(__DIR__, 2) . '/lib/Menus.lib.php';
$original = file_get_contents($menus);
if ($original === false) { fwrite(STDERR, "cannot read {$menus}\n"); exit(1); }

register_shutdown_function(static function () use ($menus, $original) {
    file_put_contents($menus, $original);
});

$needle = 'href="<?=EC_SW_BASE?>Manning-Pipe-Flow.php"';
if (strpos($original, $needle) === false) {
    fwrite(STDERR, "SELFTEST CANNOT RUN: the nav no longer contains {$needle}.\n"
        . "That is a real change, not a failure -- point this mutation at whatever the nav emits now.\n");
    exit(1);
}

// One link, put back the way it was before 2026-09-09.
file_put_contents($menus, str_replace($needle, 'href="Manning-Pipe-Flow.php"', $original));

$out = [];
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/nav_link_absolute_check.php') . ' 2>&1', $out, $code);
$text = implode("\n", $out);

$named = strpos($text, 'Manning-Pipe-Flow.php') !== false;
$failed = $code !== 0;

echo "Mutation: one relative href restored to the suite nav.\n";
echo ($failed ? "  ok   " : "  FAIL ") . "the check fails on it   exit={$code}\n";
echo ($named ? "  ok   " : "  FAIL ") . "...and names the link it found\n";

if ($failed && $named) {
    echo "\nSelftest passed: the ratchet can go red.\n";
    exit(0);
}
fwrite(STDERR, "\nSELFTEST FAILED -- the check did not notice a relative nav link.\n{$text}\n");
exit(1);
