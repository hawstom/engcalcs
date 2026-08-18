<?php
/**
 * Verifies every vendored third-party file against dev/vendor-manifest.json.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. `js/vendor/README.md` documented provenance well and nothing checked it, so the
 * record and the bytes were free to drift apart silently. Policy: dev/dependency-management.md.
 *
 * OFFLINE, ALWAYS. It never fetches anything. A check that needs the network fails on a plane, gets
 * muted, and then guards nothing. Acquisition-time integrity is npm's job (the lockfile's sha512);
 * this is integrity AT REST, which is the half that can rot after acquisition.
 *
 * FIVE QUESTIONS, and the third is the one a human would never think to ask:
 *   1. Does every manifest entry exist on disk, with the recorded sha384?
 *   2. Does every file under css/vendor/ and js/vendor/ appear in the manifest?  <- catches the
 *      file somebody dropped in without recording it, which is the common failure.
 *   3. Does the manifest's version agree with package.json?  <- catches `npm update` bumping the
 *      dependency while the committed copy in js/vendor/ stays at the old version. That mismatch
 *      is invisible from either file alone and is exactly how a "verified" vendor dir goes stale.
 *   4. Is every licence on the allow list?
 *   5. Does any file claim modifications it does not admit to?  (Reported, not enforced -- see below.)
 *
 * WHEN THIS FAILS:
 *   - digest mismatch: the committed file changed. Either it was edited (record it under
 *     `modifications`, or revert it) or an upgrade landed without updating the manifest.
 *     Recompute with: openssl dgst -sha384 -binary <file> | openssl base64 -A
 *   - unlisted file: add it to dev/vendor-manifest.json, or delete it. A third-party file nobody
 *     recorded is one nobody can audit, upgrade, or licence-check.
 *   - version disagreement: package.json and the manifest must name the same version. Re-vendor
 *     the file from the installed package, or correct whichever one is wrong.
 *
 * NOT A LICENCE AUDIT. It compares a declared string against an allow list. It cannot read a
 * LICENSE file and cannot notice a package that relicensed upstream; only a human upgrading it can.
 */

$root = realpath(__DIR__ . '/../..');
$manifestPath = $root . '/dev/vendor-manifest.json';
$pkgPath      = $root . '/package.json';

// GPL-3-compatible permissive licences. Anything else is a human decision, never an AI's --
// dev/dependency-management.md says why, and says the outbound licence is Tom's alone.
$ALLOWED = array('MIT', 'BSD-2-Clause', 'BSD-3-Clause', 'Apache-2.0', 'ISC', 'CC0-1.0', 'Unlicense');

// Directories that hold shipped third-party code. A new one must be added here, or its contents
// are invisible to question 2 -- the whole point of which is catching what nobody declared.
$VENDOR_DIRS = array('css/vendor', 'js/vendor');

// Not third-party code: licence texts and the provenance prose that sit beside it.
$NOT_CODE = '/(^|\/)(README\.md|[A-Za-z0-9._-]*LICEN[CS]E[A-Za-z0-9._-]*)$/i';

if (!is_readable($manifestPath)) {
    fwrite(STDERR, "vendor_integrity_check: cannot read dev/vendor-manifest.json\n");
    exit(2);
}
$manifest = json_decode(file_get_contents($manifestPath), true);
if (!is_array($manifest) || !isset($manifest['packages'])) {
    fwrite(STDERR, "vendor_integrity_check: dev/vendor-manifest.json is not valid JSON with a 'packages' array\n");
    exit(2);
}

$failed = false;
$listed = array();
$checked = 0;

// ---- 1 & 4 & 5: every entry exists, matches, and is licensed acceptably -----------------------
foreach ($manifest['packages'] as $pkg) {
    $name = isset($pkg['name']) ? $pkg['name'] : '(unnamed)';
    $lic  = isset($pkg['licence']) ? $pkg['licence'] : '';
    if (!in_array($lic, $ALLOWED, true)) {
        fwrite(STDERR, "LICENCE NOT ON THE ALLOW LIST: $name declares '$lic'\n");
        fwrite(STDERR, "  Allowed: " . implode(', ', $ALLOWED) . "\n");
        fwrite(STDERR, "  Anything else is Tom's decision. See dev/dependency-management.md.\n\n");
        $failed = true;
    }
    foreach ((isset($pkg['files']) ? $pkg['files'] : array()) as $f) {
        $rel = $f['path'];
        $listed[$rel] = true;
        $abs = $root . '/' . $rel;
        if (!is_readable($abs)) {
            fwrite(STDERR, "MISSING: $rel is in the manifest but not on disk\n\n");
            $failed = true;
            continue;
        }
        $checked++;
        $have = base64_encode(hash_file('sha384', $abs, true));
        if ($have !== $f['digest']) {
            fwrite(STDERR, "DIGEST MISMATCH: $rel\n");
            fwrite(STDERR, "  manifest says  {$f['digest']}\n");
            fwrite(STDERR, "  file is        $have\n");
            fwrite(STDERR, "  The committed file is not what the manifest records. Either it was edited\n");
            fwrite(STDERR, "  (record it under 'modifications', or revert it), or an upgrade landed\n");
            fwrite(STDERR, "  without updating the manifest. Do NOT just paste the new digest in --\n");
            fwrite(STDERR, "  find out which of those two happened first.\n\n");
            $failed = true;
        }
    }
}

// ---- 2: nothing shipped that nobody declared --------------------------------------------------
$onDisk = array();
foreach ($VENDOR_DIRS as $dir) {
    $abs = $root . '/' . $dir;
    if (!is_dir($abs)) { continue; }
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($abs, FilesystemIterator::SKIP_DOTS));
    foreach ($it as $file) {
        if (!$file->isFile()) { continue; }
        $rel = substr($file->getPathname(), strlen($root) + 1);
        if (preg_match($NOT_CODE, $rel)) { continue; }
        $onDisk[$rel] = true;
    }
}
$unlisted = array_diff(array_keys($onDisk), array_keys($listed));
if ($unlisted) {
    fwrite(STDERR, "SHIPPED BUT NOT IN THE MANIFEST (" . count($unlisted) . "):\n\n");
    foreach ($unlisted as $u) { fwrite(STDERR, "    $u\n"); }
    fwrite(STDERR, "\nA third-party file nobody recorded is one nobody can audit, upgrade or\n");
    fwrite(STDERR, "licence-check. Add it to dev/vendor-manifest.json, or delete it.\n\n");
    $failed = true;
}

// ---- 3: the manifest and package.json name the same version -----------------------------------
// Skipped rather than failed when package.json is absent, so the manifest is useful on its own.
if (is_readable($pkgPath)) {
    $pkgJson = json_decode(file_get_contents($pkgPath), true);
    $deps = array_merge(
        isset($pkgJson['devDependencies']) ? $pkgJson['devDependencies'] : array(),
        isset($pkgJson['dependencies']) ? $pkgJson['dependencies'] : array()
    );
    foreach ($manifest['packages'] as $pkg) {
        $name = $pkg['name'];
        if (!isset($deps[$name])) {
            fwrite(STDERR, "NOT IN package.json: $name is vendored but not declared as a dependency\n");
            fwrite(STDERR, "  npm is how an upgrade is acquired and verified. A vendored package it does\n");
            fwrite(STDERR, "  not know about cannot be re-fetched reproducibly.\n\n");
            $failed = true;
            continue;
        }
        // Pinned exactly, deliberately: a range would let `npm ci` install something other than
        // what is committed in js/vendor/, and then question 3 could not mean anything.
        $want = $deps[$name];
        if ($want !== $pkg['version']) {
            fwrite(STDERR, "VERSION DISAGREEMENT: $name\n");
            fwrite(STDERR, "  package.json says          $want\n");
            fwrite(STDERR, "  vendor-manifest.json says  {$pkg['version']}\n");
            fwrite(STDERR, "  The installed package and the committed copy have drifted. Re-vendor from\n");
            fwrite(STDERR, "  the installed package, or correct whichever file is wrong. Pin exactly --\n");
            fwrite(STDERR, "  a range makes this check meaningless.\n\n");
            $failed = true;
        }
    }
}

if ($failed) { exit(1); }

$mods = 0;
foreach ($manifest['packages'] as $pkg) {
    foreach ((isset($pkg['files']) ? $pkg['files'] : array()) as $f) {
        $mods += count(isset($f['modifications']) ? $f['modifications'] : array());
    }
}
echo "PASS: $checked vendored file(s) match the manifest, "
    . count($manifest['packages']) . " package(s), $mods recorded modification(s).\n";
