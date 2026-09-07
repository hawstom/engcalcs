<?php
/**
 * icon_name_selftest.php -- icon_name_check.php can still FAIL, on all three of its legs. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS FINDS NOTHING. The check passes by finding nothing
 * and it finds names with regular expressions, so it goes blind on any receiver, quoting or
 * argument shape its patterns did not anticipate -- and the tree already writes the same door four
 * ways (`EngCalcs.setLabel`, `EC.iconEl`, `this.iconEl`, `self.setLabel`). A blinded scan reports
 * FEWER naming sites and still exits 0, which reads as a tidier tree rather than as a hole.
 *
 * THE THREE LEGS ARE PROVEN BY LIVE MUTATION, not by fixtures alone. A fixture proves the pure
 * function reasons correctly about a string; only writing a file into `js/` and running the real
 * script over the real directory proves the script is READING that directory at all. Each probe
 * file is removed inline and again on shutdown, because a selftest that can leave a stray module
 * in `js/` has invented a failure mode of its own -- `js_module_wiring_check.php` would fail on it
 * and the next reader would be hunting the wrong thing.
 *
 *   php dev/scripts/icon_name_selftest.php
 */

define('EC_ICON_NAME_LIB_ONLY', 1);
require __DIR__ . '/icon_name_check.php';

$fails = [];
$n = 0;

$defined = ['file' => true, 'save' => true, 'play' => true, 'pause' => true];

/** @param array<string,string> $files */
function ecIconCase(string $name, array $files, bool $want): void
{
    global $fails, $n, $defined;
    $n++;
    $r = ecIconNameFindings($files, $defined);
    $hit = $r['problems'] !== [];
    if ($hit !== $want) {
        $fails[] = $name . "\n        wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($r['problems']) . ': ' . $r['problems'][0] : 'none');
    }
}

// ---- 1. Section 2: a name that is not drawn ----------------------------------------------------
ecIconCase('THE DEFECT: a PHP page naming an icon that does not exist',
    ['Manning-Pipe-Flow.php' => "<?=ecIcon('flowmeter')?>"], true);
ecIconCase('the same in JS, through the icon+word door, where the name is the SECOND argument',
    ['js/looped-network.js' => "setLabel(btn, 'flowmeter', 'Flow');"], true);
ecIconCase('through the icon-only toolbar door',
    ['js/looped-network.js' => "setIconLabel(b, 'flowmeter', name, tip);"], true);
ecIconCase('the object-descriptor shape, which is a property and not an argument',
    ['js/looped-network.js' => "{ icon: 'flowmeter', label: pc.lpn_help_icons }"], true);
ecIconCase('a file-scoped seam INSIDE its file',
    ['js/lpn-time.js' => "ui.play = btn('flowmeter', S.play, fn, null, true);"], true);
ecIconCase('a receiver this tree really uses -- self.setLabel(), which is how the copy button draws',
    ['js/Calculators.lib.js' => "self.setLabel(btn, 'flowmeter', originalText);"], true);
ecIconCase('a call split over two lines, which is how the long ones ship',
    ['js/looped-network.js' => "setLabel(\n\tbtn,\n\t'flowmeter',\n\ttext\n);"], true);

// ---- 2. Section 2: what it must NOT report -----------------------------------------------------
ecIconCase('a name that IS drawn', ['index.php' => "<?=ecIcon('save')?>"], false);
ecIconCase('a name that is drawn, reached through the JS door with a receiver',
    ['js/lpn-time.js' => "ic = EC.iconEl && EC.iconEl('play');"], false);
ecIconCase('A COMPUTED NAME IS TURNED AWAY, NEVER FAILED -- there is no literal to resolve',
    ['js/looped-network.js' => "var ic2 = r.icon ? iconEl(r.icon) : null;"], false);
ecIconCase('a ternary handed to a door: still no literal to resolve at argument position',
    ['js/lpn-time.js' => "swapIcon(ui.play, state.playing ? 'pause' : 'play');"], false);
ecIconCase('THE FILE-SCOPED SEAM OUTSIDE ITS FILE -- btn() elsewhere is an ordinary button builder',
    ['js/branched-network.js' => "var b = btn('add-row', 'Add');"], false);
ecIconCase('a same-named function on an unrelated object is not this door',
    ['js/looped-network.js' => "legend.setIcon(el, 'flowmeter');"], false);
ecIconCase('the word icon in prose beside a string, with no call anywhere',
    ['js/looped-network.js' => "// the icon: 'flowmeter' idea was rejected"], true);

// The line above is deliberately a FINDING and not a passing case: a commented-out descriptor is
// indistinguishable from a live one to any reader that is not a JS parser, and the honest answer
// is to report it rather than to write a comment stripper this check would then have to be trusted
// about. It is recorded here so the next reader knows it is a decision and not an oversight.

// ---- 3. Section 1: the doors -------------------------------------------------------------------
ecIconCase('A SECOND PHP READER of the geometry table -- a naming route this check cannot follow',
    ['Looped-Network.php' => 'echo $ec_icons[$name];'], true);
ecIconCase('a second JS reader of the same table',
    ['js/looped-network.js' => 'var geom = EngCalcs.icons[name];'], true);
ecIconCase('the real PHP door itself, which reads the table because it IS the door',
    ['lib/Icons.lib.php' => 'return $open . $ec_icons[$name] . "</svg>";'], false);
ecIconCase('the real JS door, in the file that owns it',
    ['js/Calculators.lib.js' => 'var geom = (this.icons || {})[name];'], false);

// ---- 4. Section 3: the wrapper list -------------------------------------------------------------
ecIconCase('A NEW UNDECLARED WRAPPER, which would hide every name it is ever handed',
    ['js/lpn-profile.js' => "function drawIcon(el, which) { EngCalcs.setLabel(el, which, ''); }"], true);
$allWrappers = "\t" . implode("\n\t", ecIconWrapperLines()) . "\n";
ecIconCase('every declared wrapper, verbatim as it ships', ['js/looped-network.js' => $allWrappers], false);

// The dead-declaration leg is a statement about the whole of js/, so it is driven separately.
$n++;
if (ecIconDeadWrapperFindings(['js/looped-network.js' => $allWrappers]) !== []) {
    $fails[] = 'ecIconDeadWrapperFindings() reports a wrapper missing from a corpus that contains '
        . 'every one of them verbatim.';
}
$n++;
if (ecIconDeadWrapperFindings(['js/looped-network.js' => "// nothing\n"]) === []) {
    $fails[] = 'THE DEAD DECLARATION LEG IS BLIND: ecIconDeadWrapperFindings() found no missing '
        . 'wrapper in a corpus containing none of them.';
}

// ---- 5. LIVE MUTATION: the script really reads js/ and lib/ ------------------------------------
// Three probes, one per leg, because a fixture proves only that the pure function reasons about a
// string -- it cannot prove the script hands it the tree.
$root = dirname(__DIR__, 2);
$probe = $root . '/js/ec_selftest_icon.js';
register_shutdown_function(static function () use ($probe) { @unlink($probe); });

$mutations = [
    ['leg 2, an undrawn name' =>
        "// TEMPORARY: written by dev/scripts/icon_name_selftest.php.\n"
        . "setLabel(el, 'ec-selftest-no-such-icon', 'x');\n"],
    ['leg 1, a second reader of the geometry table' =>
        "// TEMPORARY: written by dev/scripts/icon_name_selftest.php.\n"
        . "var geom = EngCalcs.icons[name];\n"],
    ['leg 3, an undeclared wrapper' =>
        "// TEMPORARY: written by dev/scripts/icon_name_selftest.php.\n"
        . "function ecSelftestDraw(el, which) { EngCalcs.setLabel(el, which, ''); }\n"],
];

foreach ($mutations as $pair) {
    foreach ($pair as $label => $src) {
        $n++;
        file_put_contents($probe, $src);
        $out = []; $code = 0;
        exec('php ' . escapeshellarg(__DIR__ . '/icon_name_check.php') . ' 2>&1', $out, $code);
        @unlink($probe);
        $text = implode("\n", $out);
        if ($code === 0 || strpos($text, 'ec_selftest_icon.js') === false) {
            $fails[] = "live mutation ($label): a probe file was written into js/ and the check "
                . "exited $code without naming it. The scan is not reaching the directory it "
                . "claims to guard. Its output was:\n        "
                . str_replace("\n", "\n        ", $text);
        }
    }
}

// And it must be green on the tree it is guarding, with the probe gone.
$n++;
$out = []; $code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/icon_name_check.php') . ' 2>&1', $out, $code);
if ($code !== 0) {
    $fails[] = "the check exits $code on the unmutated tree:\n        " . implode("\n        ", $out);
}
$n++;
if (!preg_match('/(\d+) naming site/', implode("\n", $out), $m) || (int) $m[1] < 100) {
    $fails[] = 'the check reports ' . ($m[1] ?? 'no') . ' naming site(s). 147 shipped on '
        . '2026-09-06; a collapse this large means the scan went blind, not that the icons were '
        . 'deleted -- and a blinded scan exits 0.';
}

if ($fails) {
    echo 'icon_name selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "icon_name selftest OK -- $n cases, fixtures both directions plus three live mutations.\n";
