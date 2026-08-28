<?php
/**
 * unit_family_check.php — the unit-family declarations hold together. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. CLAUDE.md states four absolutes about unit families, and every one of them
 * fails SILENTLY when broken — no error, no warning, a page that renders and looks right:
 *
 *   - "Every family must appear in every preset. A missing entry silently leaves that field alone."
 *     The us/si buttons then convert every field on the page except one, which is worse than not
 *     converting at all: the reader has no reason to doubt the odd one out.
 *   - A preset naming a unit its own family does not offer puts a value in the select that is not
 *     in the list, so the control renders with nothing chosen.
 *   - "A unit's identity is its NAME" (Task 390), and a name is only an identity if it resolves:
 *     an option with no $ec_units factor cannot be converted through EngCalcs.unitFactor().
 *   - A field declaring 'units' => 'distnce_small' gets no family at all, which is exactly the
 *     invisible-to-the-presets defect echoUnitSelect()'s raw-array path leaves behind — 32 row
 *     selects were nearly shipped that way.
 *
 * These are mechanical facts about three arrays, with no judgement anywhere in them: there is no
 * reading of the repo under which a family may be absent from a preset. So this blocks, where
 * size_budget_check.php (how long is too long?) and key_hygiene_check.php (is this key debt or
 * content?) must not.
 *
 * WHY A STATIC CHECK WHEN echoUnitSelect() ALREADY CHECKS AT RENDER TIME. Render time is a page
 * being loaded by somebody. A family used by one seldom-opened page, or by a row a JS initializer
 * builds, is checked only when that page is opened — which on a deploy means: by a visitor. This
 * reads the declarations themselves, so a gap is found before it ships rather than by whoever is
 * unlucky.
 *
 * Usage:
 *   php dev/scripts/unit_family_check.php
 *
 * Exit 0 = clean. Exit 1 = at least one finding, each printed with the fix.
 */

/**
 * All findings, as [code, message] pairs. Pure: everything it judges arrives as an argument, so
 * the selftest can hand it a broken world without breaking the real one.
 *
 * @param array $families family => list of unit names
 * @param array $sets     preset name => (family => unit name)
 * @param array $units    unit name => conversion factor
 * @param array $pageRefs family name => list of places that named it literally
 * @return array<int,array{0:string,1:string}>
 */
function ecUnitFamilyFindings(array $families, array $sets, array $units, array $pageRefs = []): array
{
    $out = [];

    foreach ($sets as $preset => $map) {
        foreach (array_keys($families) as $fam) {
            if (!array_key_exists($fam, $map)) {
                $out[] = ['missing-in-preset',
                    "preset '$preset' has no entry for family '$fam' — that preset silently leaves every field in that family alone"];
            }
        }
        foreach ($map as $fam => $unit) {
            if (!array_key_exists($fam, $families)) {
                $out[] = ['preset-unknown-family',
                    "preset '$preset' maps family '$fam', which \$ec_unit_families does not define"];
                continue;
            }
            if (!in_array($unit, $families[$fam], true)) {
                $out[] = ['preset-unit-not-offered',
                    "preset '$preset' selects '$unit' for family '$fam', which offers only: " . implode(', ', $families[$fam])];
            }
        }
    }

    foreach ($families as $fam => $offered) {
        foreach ($offered as $unit) {
            if (!array_key_exists($unit, $units)) {
                $out[] = ['no-factor',
                    "family '$fam' offers unit '$unit', which has no factor in \$ec_units — nothing can convert it"];
            }
        }
    }

    foreach ($pageRefs as $fam => $where) {
        if (!array_key_exists($fam, $families)) {
            $out[] = ['unknown-family-named',
                "'units' => '$fam' is named by " . implode(', ', array_unique($where)) . ", and no such family exists"];
        }
    }

    return $out;
}

/** family name => files that wrote 'units' => '<name>' literally. */
function ecUnitFamilyPageRefs(array $files, string $root): array
{
    $refs = [];
    foreach ($files as $path) {
        $src = file_get_contents($path);
        if (!preg_match_all("/'units'\s*=>\s*'([A-Za-z0-9_]+)'/", $src, $m)) {
            continue;
        }
        foreach ($m[1] as $fam) {
            $refs[$fam][] = str_replace($root . '/', '', $path);
        }
    }
    return $refs;
}

if (defined('UNIT_FAMILY_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
require_once $root . '/lib/config.inc.php';
$ec_units = [];
$ec_unit_families = [];
$ec_unit_sets = [];
include $root . '/lib/Units.lib.php';

$pageRefs = ecUnitFamilyPageRefs(
    array_merge(glob($root . '/*.php'), glob($root . '/lib/*.php')),
    $root
);
$findings = ecUnitFamilyFindings($ec_unit_families, $ec_unit_sets, $ec_units, $pageRefs);

if (!$findings) {
    printf("Unit families OK — %d families, %d presets, %d families named by a page, no gaps.\n",
        count($ec_unit_families), count($ec_unit_sets), count($pageRefs));
    exit(0);
}

echo "UNIT FAMILY DECLARATIONS — " . count($findings) . " finding(s):\n\n";
foreach ($findings as [$code, $msg]) {
    printf("  [%s] %s\n", $code, $msg);
}
echo "\n";
echo "All of these fail silently on a rendered page, which is why they block here. The fixes:\n";
echo "  missing-in-preset       add the family to that preset in \$ec_unit_sets (lib/Units.lib.php).\n";
echo "                          Every family, every preset — no exceptions, or one field ignores\n";
echo "                          the us/si buttons while its neighbours obey them.\n";
echo "  preset-unknown-family   the preset names a family that was renamed or deleted; point it at\n";
echo "                          the real one, or drop the row.\n";
echo "  preset-unit-not-offered a preset may only choose a unit its own family lists.\n";
echo "  no-factor               add the factor to \$ec_units, in units of \"that unit per SI unit\",\n";
echo "                          and re-run unit_factor_check.php, which re-derives it.\n";
echo "  unknown-family-named    the page's 'units' => '<name>' is a typo, so that field gets no\n";
echo "                          family and is invisible to the preset buttons.\n";
echo "A field declares a family NAME, never an inline array — see CLAUDE.md, Unit Sets.\n";
exit(1);
