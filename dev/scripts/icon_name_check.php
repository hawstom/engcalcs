<?php
/**
 * icon_name_check.php -- every icon this suite NAMES is one lib/Icons.lib.php draws. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading). The suite
 * names an icon 147 times across 56 distinct names against 61 definitions, and no rule about
 * those names was written anywhere. **A name that is not one of the 61 fails in perfect silence
 * in both languages the suite speaks**: `ecIcon()` returns the EMPTY STRING and
 * `EngCalcs.iconEl()` returns NULL, and every drawing site is written `if (ic) { append }` -- so
 * the control keeps its word, keeps its tip, keeps its accessible name, and simply has no picture,
 * for as long as nobody looks at that one button. There is no console message, no PHP warning, no
 * layout shift and no failing harness. `js/looped-network.js` records that this has already
 * happened: *"which is how the toolbar's Settings popover once shipped without its warning
 * triangle. Two render sites, one missed."* That was caught by a person seeing a blank space.
 *
 * WHY THE READER LIST IS THE HONEST PART. The geometry is one table with exactly two doors --
 * PHP's `ecIcon()` reads `$ec_icons` and JS's `EngCalcs.iconEl()` reads `EngCalcs.icons`, and
 * `setLabel()`/`setIconLabel()` reach it through `iconEl()` rather than around it. That is what
 * makes a name scan possible at all, so section 1 ASSERTS it: a third reader of either table
 * fails, because a third reader is a name-passing route this check cannot see and would go on
 * reporting OK about.
 *
 * WHAT IT CANNOT SEE, PRINTED RATHER THAN PASSED OVER IN SILENCE. A computed name
 * (`iconEl(r.icon)`, `swapIcon(b, playing ? 'pause' : 'play')`) has no literal to resolve, so it
 * is counted and turned away. A wrapper of a wrapper is likewise out of reach: section 3 catches a
 * NEW first-order wrapper, because writing one means writing a new `EngCalcs.iconEl(` call, and
 * that is what section 3 reads.
 *
 * AN ICON DEFINED AND NAMED BY NOTHING IS PRINTED, NEVER FAILED. Whether unnamed geometry is debt
 * or a symbol waiting for its control is the same judgement `key_hygiene_check.php` refuses to
 * make about a language key, and it is made worse here by the computed names above: an icon
 * reached only through a ternary is named by nobody this scan can see.
 *
 * Usage:
 *   php dev/scripts/icon_name_check.php
 *
 * Exit 0 = every named icon is a drawn icon. Exit 1 = one is not, or a door was added.
 */

/**
 * THE DECLARED SEAMS -- callee name => argument index holding the icon name.
 *
 * Declared and never inferred, for the reason every list in dev/scripts/ is: "which argument of
 * which function is an icon name" is not recoverable from the source, and a guess that is right
 * today is a scan that goes blind the day somebody adds a parameter. `file` narrows a seam whose
 * name is too ordinary to be safe anywhere -- `btn` is the transport-bar builder in lpn-time.js
 * and would be a wild card across the whole of js/.
 *
 * @return array<int,array{name:string,arg:int,file:?string,why:string}>
 */
function ecIconSeams(): array
{
    return [
        ['name' => 'ecIcon', 'arg' => 0, 'file' => null,
            'why' => 'the PHP door: the only reader of $ec_icons'],
        ['name' => 'iconEl', 'arg' => 0, 'file' => null,
            'why' => 'the JS door, and the local one-line forwarders that share its name'],
        ['name' => 'setLabel', 'arg' => 1, 'file' => null,
            'why' => 'icon + word, the one way a control here gets both'],
        ['name' => 'setIconLabel', 'arg' => 1, 'file' => null,
            'why' => 'the icon-only toolbar form'],
        ['name' => 'buildMapIconSvg', 'arg' => 0, 'file' => 'js/looped-network.js',
            'why' => 'a map symbol is iconEl() markup re-homed onto the canvas'],
        ['name' => 'swapIcon', 'arg' => 1, 'file' => 'js/lpn-time.js',
            'why' => 'the transport bar exchanging play for pause in place'],
        ['name' => 'btn', 'arg' => 0, 'file' => 'js/lpn-time.js',
            'why' => 'the transport-bar button builder; scoped, because btn() is too ordinary a name'],
    ];
}

/**
 * The first-order wrappers: a function that takes an icon name and hands it to a door. Declared so
 * section 3 can tell one from a call site that should have passed a literal.
 *
 * @return array<int,string> substrings, each unique to one wrapper's own line
 */
function ecIconWrapperLines(): array
{
    return [
        'function iconEl(name) { return EngCalcs.iconEl(name); }',
        'function setLabel(el, iconName, text) { EngCalcs.setLabel(el, iconName, text); }',
        'EngCalcs.setIconLabel(el, iconName, name, tip);',
        'ic = EC.iconEl && EC.iconEl(icon);',
        'name = iconLabel || function (el2, icon, n, tip) { EC.setIconLabel(el2, icon, n, tip); };',
    ];
}

/**
 * Argument $idx of every call to $callee in $src, as raw source text.
 *
 * Splits on top-level commas only, so a nested call or a comma inside a string does not shift the
 * index. Returns the text, not a value: the caller decides whether it is a literal it can resolve
 * or something it must turn away.
 *
 * @return array<int,string>
 */
function ecIconCallArgs(string $src, string $callee, int $idx): array
{
    $out = [];
    $len = strlen($src);
    // A method call keeps its receiver and the receiver is not fixed: this tree writes the same
    // door as `EngCalcs.setLabel`, `EC.iconEl`, `this.iconEl` and `self.setLabel` in four
    // different scopes. So ONE optional identifier receiver is allowed and the seam name is what
    // discriminates -- which is why ecIconSeams() scopes the ordinary ones (`btn`) to a file.
    $pat = '/(?<![A-Za-z0-9_$])(?:[A-Za-z_$][A-Za-z0-9_$]*\.)?'
        . preg_quote($callee, '/') . '\s*\(/';
    if (!preg_match_all($pat, $src, $m, PREG_OFFSET_CAPTURE)) return $out;

    foreach ($m[0] as $hit) {
        $i = $hit[1] + strlen($hit[0]);      // first character after the '('
        $depth = 0; $arg = 0; $buf = ''; $q = '';
        for (; $i < $len; $i++) {
            $c = $src[$i];
            if ($q !== '') {
                if ($c === '\\') { $buf .= $c . ($src[$i + 1] ?? ''); $i++; continue; }
                if ($c === $q) { $q = ''; }
                $buf .= $c;
                continue;
            }
            if ($c === "'" || $c === '"') { $q = $c; $buf .= $c; continue; }
            if ($c === '(' || $c === '[' || $c === '{') { $depth++; $buf .= $c; continue; }
            if ($c === ')' && $depth === 0) { break; }
            if ($c === ')' || $c === ']' || $c === '}') { $depth--; $buf .= $c; continue; }
            if ($c === ',' && $depth === 0) {
                if ($arg === $idx) { break 1; }
                $arg++; $buf = ''; continue;
            }
            if ($c === "\n" && $depth === 0 && $arg < $idx && trim($buf) === '') { continue; }
            $buf .= $c;
        }
        if ($arg === $idx) { $out[] = trim($buf); }
    }
    return $out;
}

/**
 * @param array<string,string> $files relative path => source
 * @param array<string,bool>   $defined icon name => true
 * @return array{problems:array<int,string>,named:array<string,array<int,string>>,turned:int,sites:int}
 */
function ecIconNameFindings(array $files, array $defined): array
{
    $problems = [];
    $named = [];
    $turned = 0;
    $sites = 0;

    // ---- 1. The table has exactly two doors ----------------------------------------------------
    // Asserted rather than assumed: a third reader is a route this check cannot follow, and a scan
    // that has quietly lost a route reports OK forever. lib/Icons.lib.php and js/Calculators.lib.js
    // are where the two doors live; a read anywhere else is the finding.
    foreach ($files as $rel => $src) {
        if ($rel !== 'lib/Icons.lib.php' && preg_match('/\$ec_icons\s*\[/', $src)) {
            $problems[] = "$rel reads \$ec_icons directly. The geometry table has one PHP reader, "
                . 'ecIcon() in lib/Icons.lib.php, and this check can only follow the names that go '
                . 'through it -- a second reader is a naming route it would report OK about '
                . 'forever. Call ecIcon(), or add the door here and say why.';
        }
        if ($rel !== 'js/Calculators.lib.js' && preg_match('/(?:EngCalcs|EC|this)\.icons\s*(?:\[|\|\|)/', $src)) {
            $problems[] = "$rel reads EngCalcs.icons directly. The geometry table has one JS "
                . 'reader, EngCalcs.iconEl() in js/Calculators.lib.js -- setLabel() and '
                . 'setIconLabel() go THROUGH it rather than around it, which is what lets this '
                . 'check see every name. Call EngCalcs.iconEl(), or add the door here and say why.';
        }
    }

    // ---- 2. Every literal name at a declared seam resolves --------------------------------------
    foreach (ecIconSeams() as $seam) {
        foreach ($files as $rel => $src) {
            if ($seam['file'] !== null && $rel !== $seam['file']) continue;
            if ($rel === 'lib/Icons.lib.php' && $seam['name'] === 'ecIcon') {
                // The definition and its own docblock, not a call site.
                $src = preg_replace('~function ecIcon\(.*~s', '', $src);
            }
            foreach (ecIconCallArgs($src, $seam['name'], $seam['arg']) as $arg) {
                $sites++;
                if (!preg_match('/^([\'"])([A-Za-z0-9_-]*)\1$/', $arg, $m)) { $turned++; continue; }
                $name = $m[2];
                $named[$name][] = $rel;
                if (!isset($defined[$name])) {
                    $problems[] = "$rel names the icon '$name' via {$seam['name']}(), and "
                        . 'lib/Icons.lib.php draws no such icon. Nothing will say so: ecIcon() '
                        . "returns the empty string and EngCalcs.iconEl() returns null, every "
                        . 'drawing site is written `if (ic)`, so the control renders with its word '
                        . 'and its tip and no picture. Fix the spelling, or add the geometry to '
                        . '$ec_icons.';
                }
            }
        }
    }

    // The object-descriptor shape: `{ icon: 'help', label: ... }` rows, which reach iconEl() a
    // frame later. Read here rather than as a seam because the name is a property, not an argument.
    foreach ($files as $rel => $src) {
        if (substr($rel, 0, 3) !== 'js/') continue;
        if (!preg_match_all('/\bicon\s*:\s*\'([A-Za-z0-9_-]*)\'/', $src, $m)) continue;
        foreach ($m[1] as $name) {
            $sites++;
            $named[$name][] = $rel;
            if (!isset($defined[$name])) {
                $problems[] = "$rel declares `icon: '$name'` on a menu or toolbar row, and "
                    . 'lib/Icons.lib.php draws no such icon. The row still renders, with its '
                    . 'label and no picture. Fix the spelling, or add the geometry to $ec_icons.';
            }
        }
    }

    // ---- 3. The wrapper list is complete --------------------------------------------------------
    // A NEW first-order wrapper is a new call to one of the two doors with a variable where a
    // literal would be, and every name it is ever handed becomes invisible to section 2. There are
    // five such lines in the tree; a sixth must be declared before it can hide anything.
    $wrappers = ecIconWrapperLines();
    foreach ($files as $rel => $src) {
        if (substr($rel, 0, 3) !== 'js/') continue;
        foreach (explode("\n", $src) as $no => $line) {
            if (!preg_match('/(?:EngCalcs|EC)\.(?:iconEl|setLabel|setIconLabel)\s*\(/', $line)) continue;
            if (preg_match('/^\s*(?:\/\/|\*)/', $line)) continue;   // a comment naming the door
            $known = false;
            foreach ($wrappers as $w) { if (strpos($line, $w) !== false) { $known = true; break; } }
            if ($known) continue;
            if (preg_match('/(?:iconEl|setLabel|setIconLabel)\s*\(\s*[^,)]*,?\s*[\'"]/', $line)) continue;
            $problems[] = "$rel line " . ($no + 1) . ' hands a computed icon name to an icon door '
                . 'from a function ecIconWrapperLines() does not name: '
                . trim(preg_replace('/\s+/', ' ', $line)) . ' -- every name that reaches the door '
                . 'this way is invisible to section 2. Declare the wrapper (and its argument '
                . 'index in ecIconSeams()) so its call sites are read.';
        }
    }

    return ['problems' => $problems, 'named' => $named, 'turned' => $turned, 'sites' => $sites];
}

/**
 * A declaration naming a wrapper that is no longer in the tree.
 *
 * Separate from the function above because it is a statement about the WHOLE of js/ and not about
 * one file -- asking it of a fixture would report every wrapper the fixture does not happen to
 * contain, which is nothing at all. Same reason ecSwAssetExclusions() is audited by its own pass.
 *
 * @param array<string,string> $files relative path => source, the whole tree
 * @return array<int,string>
 */
function ecIconDeadWrapperFindings(array $files): array
{
    $out = [];
    foreach (ecIconWrapperLines() as $w) {
        $found = false;
        foreach ($files as $rel => $src) {
            if (substr($rel, 0, 3) === 'js/' && strpos($src, $w) !== false) { $found = true; break; }
        }
        if (!$found) {
            $out[] = 'ecIconWrapperLines() names a wrapper that is no longer in js/: '
                . trim($w) . ' -- a dead declaration is an exemption nobody will revisit, and it '
                . 'silences section 3 on whatever line now stands where it did. Delete it.';
        }
    }
    return $out;
}

if (defined('EC_ICON_NAME_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
require_once($root . '/lib/Icons.lib.php');
$defined = [];
foreach (array_keys((array) ($GLOBALS['ec_icons'] ?? [])) as $k) { $defined[$k] = true; }
if (!$defined) {
    echo "icon names: lib/Icons.lib.php defined no icons at all -- \$ec_icons is empty.\n";
    exit(1);
}

$files = [];
foreach (array_merge(glob($root . '/*.php') ?: [], glob($root . '/lib/*.php') ?: [], glob($root . '/js/*.js') ?: []) as $f) {
    $base = basename($f);
    if (strpos($base, 'lang.ec.') === 0) continue;   // strings, never icon names
    $dir = basename(dirname($f));
    $rel = in_array($dir, ['lib', 'js'], true) ? $dir . '/' . $base : $base;
    $files[$rel] = (string) file_get_contents($f);
}

$r = ecIconNameFindings($files, $defined);
$problems = array_merge($r['problems'], ecIconDeadWrapperFindings($files));

if ($problems) {
    echo 'Icon names: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    exit(1);
}

$unnamed = array_diff(array_keys($defined), array_keys($r['named']));
echo 'Icon names OK -- ' . $r['sites'] . ' naming site(s) across '
    . count($r['named']) . ' name(s), every one drawn by lib/Icons.lib.php (' . count($defined)
    . " defined).\n";
echo '  ' . $r['turned'] . " computed name(s) turned away: no literal to resolve.\n";
if ($unnamed) {
    echo '  ' . count($unnamed) . ' icon(s) defined and named by no literal, printed and NOT failed '
        . "-- whether that is debt or a computed name is judgement:\n    "
        . implode(', ', $unnamed) . "\n";
}
exit(0);
