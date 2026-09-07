<?php
/**
 * storage_guard_check.php -- every localStorage/sessionStorage access sits inside a try.
 * BLOCKING, and a ratchet at zero.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING and not by re-reading).
 *
 * The suite touches web storage 26 times in `js/*.js` and every one of the 26 is wrapped in a
 * `try`, most of them with an empty `catch` -- `try { localStorage.setItem(k, v); } catch (e) {}`,
 * written the same way in five modules. Writing a construct 26 times identically is a rule
 * somebody knew; nothing in `CLAUDE.md` or `dev/*.md` states it, and nothing held it.
 *
 * WHAT THE `try` IS ACTUALLY FOR, because the empty catch makes it look like superstition. **In a
 * browser set to block site data, reading the `localStorage` PROPERTY throws** -- SecurityError, on
 * the property access itself, before any method is called. It is not a quota error and it is not
 * confined to private browsing. An unguarded access on a module's init path therefore throws out of
 * that module: the rest of its top level never runs, and everything after it on that page is dead.
 * `js/looped-network.js` reads six furniture keys during startup, so the map editor is exactly the
 * page where the failure is total.
 *
 * **AND IT IS INVISIBLE HERE.** The visitor sees a page that half-loaded; we see nothing at all --
 * no server error, no log row, no harness (`dev/lpn-spike/lpn-dom-stub.js` provides a storage that
 * works). The visitors it happens to are the privacy-conscious ones, which is this suite's own
 * stated audience, and they are the least likely to file a report about it.
 *
 * DELIBERATELY OUT OF SCOPE, WITH THE REASON, because "why not those too" is the first question:
 *   - `document.cookie`. Blocking cookies makes a read return the empty string; it does not throw.
 *     A `try` there would guard nothing.
 *   - `indexedDB`. Every open in this suite is inside a `new Promise(...)` executor, where a throw
 *     becomes a rejection the caller already handles -- a different guard, and whether the caller
 *     handles it is a judgement about the caller, which is not what a blocking check is for.
 *   - `js/vendor/`. Somebody else's code, which we do not edit. Counted and printed.
 *
 * THE ONE THING IT CANNOT SEE, stated rather than pretended away: a callback DEFINED inside a try
 * and CALLED later runs outside it. The guard here is lexical. That shape does not exist in this
 * tree today and a scanner cannot decide it in general.
 *
 * Usage:
 *   php dev/scripts/storage_guard_check.php
 *
 * Exit 0 = every access is guarded. Exit 1 = one is not.
 */

/**
 * Comments and string literals blanked, newlines kept so line numbers survive.
 *
 * Blanking is what makes the scan honest: `js/*.js` mentions localStorage 28 times in PROSE --
 * comments explaining what is and is not stored on a visitor's device -- and a scan that counted
 * those would report two dozen findings against correct code, which is the fastest known way to
 * have a check disabled.
 */
function ecStorageStripJs(string $src): string
{
    $out = '';
    $n = strlen($src);
    $i = 0;
    $state = 'code';
    $quote = '';
    while ($i < $n) {
        $c = $src[$i];
        $c2 = $i + 1 < $n ? $src[$i + 1] : '';
        if ($state === 'code') {
            if ($c === '/' && $c2 === '/') { $state = 'line'; $i += 2; continue; }
            if ($c === '/' && $c2 === '*') { $state = 'block'; $i += 2; continue; }
            if ($c === '"' || $c === "'" || $c === '`') { $quote = $c; $state = 'str'; $out .= ' '; $i++; continue; }
            $out .= $c; $i++; continue;
        }
        if ($state === 'line') { if ($c === "\n") { $out .= "\n"; $state = 'code'; } $i++; continue; }
        if ($state === 'block') {
            if ($c === "\n") $out .= "\n";
            if ($c === '*' && $c2 === '/') { $state = 'code'; $i += 2; continue; }
            $i++; continue;
        }
        // string
        if ($c === '\\') { $i += 2; continue; }
        if ($c === "\n") $out .= "\n";
        if ($c === $quote) { $state = 'code'; }
        $i++;
    }
    return $out;
}

/**
 * Findings and the total access count, pure so the selftest can drive it with fixtures.
 *
 * @param array<string,string> $files rel path => JS source
 * @return array{findings: array<int,string>, accesses: int}
 */
function ecStorageGuardFindings(array $files): array
{
    $findings = [];
    $accesses = 0;

    foreach ($files as $rel => $raw) {
        $src = ecStorageStripJs($raw);
        $n = strlen($src);
        $depth = 0;
        $tryDepths = [];
        $line = 1;
        for ($i = 0; $i < $n; $i++) {
            $c = $src[$i];
            if ($c === "\n") { $line++; continue; }
            if ($c === '{') {
                // A try block is the one whose brace is preceded by the keyword. `catch (e) {` is
                // NOT one: code in a catch is running because the guard already failed.
                $pre = substr($src, max(0, $i - 12), min(12, $i));
                $depth++;
                if (preg_match('/\btry\s*$/', $pre)) { $tryDepths[] = $depth; }
                continue;
            }
            if ($c === '}') {
                if ($tryDepths && end($tryDepths) === $depth) { array_pop($tryDepths); }
                $depth--;
                continue;
            }
            if ($c !== 'l' && $c !== 's') continue;
            if (!preg_match('/^(localStorage|sessionStorage)\b/', substr($src, $i, 16), $m)) continue;
            $accesses++;
            $i += strlen($m[1]) - 1;
            if ($tryDepths) continue;
            $findings[] = "$rel:$line touches {$m[1]} outside any try block. A browser set to block "
                . 'site data throws on the PROPERTY ACCESS itself -- SecurityError, before any '
                . 'method is called, and not only in private browsing. An unguarded access on an '
                . "init path throws out of the module, so everything after it on that page is dead "
                . 'and the visitor sees a page that half-loaded. Wrap it: '
                . "`try { ... } catch (e) {}` is what the other accesses in this suite do.";
        }
    }

    return ['findings' => $findings, 'accesses' => $accesses];
}

if (defined('STORAGE_GUARD_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$files = [];
foreach (glob($root . '/js/*.js') ?: [] as $f) {
    $files['js/' . basename($f)] = (string) file_get_contents($f);
}

// Vendored code is counted and turned away, never silently skipped.
$vendor = 0;
foreach (glob($root . '/js/vendor/*.js') ?: [] as $f) {
    $vendor += preg_match_all('/\b(localStorage|sessionStorage)\b/', (string) file_get_contents($f));
}

$result = ecStorageGuardFindings($files);

if ($result['findings']) {
    echo 'Web storage: ' . count($result['findings']) . " unguarded access(es)\n\n";
    foreach ($result['findings'] as $f) { echo "  ! $f\n\n"; }
    echo "This is a ratchet at zero: 26 accesses shipped guarded on 2026-09-06 and the first one\n";
    echo "that is not fails the build. The failure has no symptom on this side of the wire.\n";
    exit(1);
}

printf(
    "Web storage OK -- %d localStorage/sessionStorage access(es) across %d shipped script(s), every\n"
    . "one inside a try. A ratchet at zero.\n",
    $result['accesses'], count($files)
);
echo "Out of scope by declaration, with the reasons in this script's docblock: document.cookie "
    . "(a blocked\nread returns '', it does not throw), indexedDB (opened inside a Promise executor, "
    . "where a throw\nis a rejection), and js/vendor/ ($vendor mention(s), somebody else's code).\n";
exit(0);
