<?php
/**
 * workspace_keys_check.php: every localStorage key this suite writes is either in the WORKSPACE or
 * explicitly kept out of it. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * File > Export > Workspace (Tom, 2026-10-07) saves the browser-scoped layout and preferences, and
 * File > Import > Workspace puts them back. What it carries is decided by one rule in
 * `js/looped-network.js` (workspaceCarries()): every key beginning `lpn_`, plus LPN_WORKSPACE_EXTRA,
 * minus LPN_WORKSPACE_EXCLUDED (documents, identity, legacy keys; an entry ending `_` is a prefix).
 * So a new `lpn_xxxbox` furniture key rides along with no edit. What can still go stale in silence
 * is the other direction: a new key that is NOT furniture (a document, an identity) carried into
 * somebody else's browser, or a non-`lpn_` preference quietly left out.
 *
 * So this reads every localStorage write in `js/*.js` (the same reader storage_inventory_check.php
 * uses, comments blanked, names resolved one hop) and fails when a written key is neither carried
 * nor excluded, when a key is both in EXTRA and EXCLUDED, or when EXTRA names a key nothing writes
 * any more. A new `lpn_` key that is not window furniture or a preference must be added to
 * LPN_WORKSPACE_EXCLUDED by whoever adds it; the check cannot know that, and says so here.
 *
 * It never asks whether a key SHOULD be stored; that is the exemption test in
 * dev/cookie-storage-inventory.md. It asks only which side of the workspace a stored key is on.
 *
 * Usage: php dev/scripts/workspace_keys_check.php     Exit 0 clean, 1 on any finding.
 */

define('STORAGE_INVENTORY_LIB_ONLY', true);
require_once __DIR__ . '/storage_inventory_check.php';

/** The string literals inside `var NAME = [ ... ];`, comments already blanked. */
function ecWorkspaceList(string $code, string $name): ?array
{
    if (!preg_match('/\bvar\s+' . preg_quote($name, '/') . '\s*=\s*\[(.*?)\]\s*;/s', $code, $m)) {
        return null;
    }
    preg_match_all('/\'([^\']+)\'/', $m[1], $s);
    return $s[1];
}

/** The rule workspaceCarries() applies in the page, in PHP. */
function ecWorkspaceCarries(string $k, array $extra, array $excluded): bool
{
    if (in_array($k, $extra, true)) { return true; }
    if (strpos($k, 'lpn_') !== 0) { return false; }
    foreach ($excluded as $x) {
        if ($x === $k || (substr($x, -1) === '_' && strpos($k, $x) === 0)) { return false; }
    }
    return true;
}
function ecWorkspaceExcluded(string $k, array $excluded): bool
{
    foreach ($excluded as $x) {
        if ($x === $k || (substr($x, -1) === '_' && strpos($k, $x) === 0)) { return true; }
    }
    return false;
}

/**
 * Findings. Pure, for a selftest or a harness.
 *
 * @param array<string,string> $sources file => blanked source
 * @param array<int,string>    $keys     LPN_WORKSPACE_EXTRA: carried although not `lpn_`
 * @param array<int,string>    $excluded kept out
 * @param array<string,array>  $dynamic  EC_DYNAMIC_STORAGE_SITES
 * @return array<int,string>
 */
function ecWorkspaceFindings(array $sources, array $keys, array $excluded, array $dynamic): array
{
    $problems = [];
    $written = [];
    foreach ($sources as $file => $src) {
        if (substr($file, 0, 3) !== 'js/') { continue; }
        foreach (ecStorageWriteSites($file, $src) as $site) {
            if ($site['kind'] !== 'localStorage') { continue; }
            $where = $file . ':' . $site['line'];
            $name = ecResolveStorageName($site['expr'], $src);
            if ($name === null) {
                $decl = $file . '|' . $site['expr'];
                if (!isset($dynamic[$decl])) {
                    $problems[] = "UNREADABLE localStorage write at $where (`{$site['expr']}`): declare it in "
                        . 'EC_DYNAMIC_STORAGE_SITES in storage_inventory_check.php first.';
                    continue;
                }
                if (!empty($dynamic[$decl]['workspace'])) { continue; }   // the import itself, not a writer of its own
                foreach ($dynamic[$decl]['names'] as $n) { $written[$n][] = $where; }
                continue;
            }
            if ($name !== '') { $written[$name][] = $where; }
        }
    }
    foreach ($keys as $k) {
        if (in_array($k, $excluded, true)) {
            $problems[] = "'$k' is in both LPN_WORKSPACE_EXTRA and LPN_WORKSPACE_EXCLUDED. Pick one.";
        }
        if (!isset($written[$k])) {
            $problems[] = "LPN_WORKSPACE_EXTRA names '$k' and nothing writes it any more. Remove it, or "
                . 'it is a stale promise that the workspace carries something.';
        }
    }
    foreach ($written as $name => $sites) {
        if (!ecWorkspaceCarries($name, $keys, $excluded) && !ecWorkspaceExcluded($name, $excluded)) {
            $problems[] = "'$name' is written to localStorage at " . implode(', ', $sites) . ' and the '
                . 'workspace neither carries it (it does not begin `lpn_` and is not in LPN_WORKSPACE_EXTRA) '
                . 'nor excludes it (LPN_WORKSPACE_EXCLUDED, js/looped-network.js). If it is a '
                . 'browser-scoped preference or window layout, add it to LPN_WORKSPACE_EXTRA so '
                . 'File > Export > Workspace carries it; if it is a document, an identity or a '
                . 'legacy key, add it to LPN_WORKSPACE_EXCLUDED.';
        }
    }
    return $problems;
}

if (defined('WORKSPACE_KEYS_LIB_ONLY')) { return; }

$root = dirname(__DIR__, 2);
$sources = [];
foreach (glob($root . '/js/*.js') as $f) {
    $sources[substr($f, strlen($root) + 1)] = ecReadJsCode($f);
}
$lpn = $sources['js/looped-network.js'] ?? '';
$keys = ecWorkspaceList($lpn, 'LPN_WORKSPACE_EXTRA');
$excluded = ecWorkspaceList($lpn, 'LPN_WORKSPACE_EXCLUDED');
if ($keys === null || !$excluded) {
    echo "workspace_keys_check.php cannot read LPN_WORKSPACE_EXTRA / LPN_WORKSPACE_EXCLUDED as plain arrays of\n";
    echo "string literals in js/looped-network.js. They were renamed or reshaped; fix the check deliberately.\n";
    exit(1);
}
$problems = ecWorkspaceFindings($sources, $keys, $excluded, EC_DYNAMIC_STORAGE_SITES);
if ($problems) {
    echo 'Workspace keys: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    exit(1);
}
echo 'Workspace keys: every lpn_ key carried, ' . count($keys) . ' more named, ' . count($excluded) . " excluded; every written key classified.\n";
exit(0);
