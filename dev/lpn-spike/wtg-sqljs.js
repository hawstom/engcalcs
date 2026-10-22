// Where the WaterGEMS spike finds sql.js (SQLite as WebAssembly) and the branch-only reader files.
//
// js/vendor/sql-wasm.js ships on branch feat/sqlite-reader. Until that merges, this helper takes
// the files out of that branch with `git show` into a cache folder, once, and never edits the
// branch. WTG_SQLJS_DIR overrides it (a folder holding sql-wasm.js and sql-wasm.wasm).
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
const BRANCH = 'feat/sqlite-reader';

function cacheDir() {
	const d = path.join(os.tmpdir(), 'engcalcs-wtg-spike-' + (process.getuid ? process.getuid() : 'u'));
	fs.mkdirSync(path.join(d, 'js', 'vendor'), { recursive: true });
	return d;
}
function have(rel) {
	// Prefer the working tree (after the branch merges), then the cache filled from the branch.
	const here = path.join(ROOT, rel);
	if (fs.existsSync(here)) { return here; }
	const there = path.join(cacheDir(), rel);
	if (!fs.existsSync(there)) {
		try {
			const buf = execFileSync('git', ['show', BRANCH + ':' + rel], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
			fs.writeFileSync(there, buf);
		} catch (e) { return null; }
	}
	return there;
}
function sqlJsPath() {
	if (process.env.WTG_SQLJS_DIR) { return path.join(process.env.WTG_SQLJS_DIR, 'sql-wasm.js'); }
	const p = have('js/vendor/sql-wasm.js');
	if (!p) { throw new Error('sql.js not found: merge ' + BRANCH + ' or set WTG_SQLJS_DIR.'); }
	return p;
}
function wasmPath() {
	if (process.env.WTG_SQLJS_DIR) { return path.join(process.env.WTG_SQLJS_DIR, 'sql-wasm.wasm'); }
	const p = have('js/vendor/sql-wasm.wasm');
	if (!p) { throw new Error('sql-wasm.wasm not found: merge ' + BRANCH + ' or set WTG_SQLJS_DIR.'); }
	return p;
}
// The reader (js/lpn-sqlite.js, js/lpn-wtg.js), same rule. Returns absolute paths or null.
function readerPaths() {
	const a = have('js/lpn-sqlite.js'), b = have('js/lpn-wtg.js');
	return a && b ? { sqlite: a, wtg: b } : null;
}
module.exports = { sqlJsPath, wasmPath, readerPaths };
