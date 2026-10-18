/**
 * lpn-sqlite.js — reading a SQLite database, read-only, in the browser.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * ROADMAP Task 749, the foundation only. Bentley WaterCAD and WaterGEMS keep a model in a
 * `.wtg.sqlite` file, and its layout is unpublished (dev/bentley-interop.md). Until a real file
 * arrives this module knows nothing about Bentley: it opens any SQLite database and answers what
 * tables it holds, what columns each has, how many rows, and what is in them. The resolver that
 * turns those rows into a network waits on the sample. Record: dev/sqlite-reader.md.
 *
 * **IT NEVER WRITES TO THE FILE IT IS GIVEN.** The bytes are copied before the engine sees them,
 * the database is opened with `PRAGMA query_only`, and nothing here ever hands a database back.
 * The file's numbers are the user's (CLAUDE.md, Unit Sets).
 *
 * **NO DOM, so a harness can ask it anything.** The loader is the one impure part.
 *
 * ---- WHAT IS LOADED, AND WHEN ---------------------------------------------------------------
 *
 *   js/vendor/sql-wasm.js    46 KB (17 KB gzipped)  — sql.js 1.14.2, MIT, pinned in the manifest
 *   js/vendor/sql-wasm.wasm  658 KB (322 KB gzipped) — SQLite itself, compiled to WebAssembly
 *
 * **NEITHER IS FETCHED AT PAGE LOAD AND NEITHER IS PRECACHED.** Both are fetched from this site,
 * never a CDN, the first time a database is opened. The wasm is fetched here and handed to the
 * engine as bytes (`wasmBinary`), so the host's MIME type for `.wasm` does not matter: the same
 * reasoning that renamed epanet-js's `.mjs` (js/vendor/README.md).
 */
(function (root) {
	'use strict';
	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	// The vendored version. It rides on both URLs as `?v=`, so the service worker's cache-first
	// copy of the script moves when the library is upgraded.
	var VERSION = '1.14.2';
	// The first 16 bytes of every SQLite 3 database: "SQLite format 3" and a NUL.
	var MAGIC = [83, 81, 76, 105, 116, 101, 32, 102, 111, 114, 109, 97, 116, 32, 51, 0];
	var DEFAULT_LIMIT = 1000;

	var engine = null;           // the promise of the initialised sql.js module
	var injected = null;         // { init, wasmBinary } supplied by a harness

	function base() { return EngCalcs.suiteBase || '/engcalcs/'; }

	function fail(code, message) {
		var e = new Error(message);
		e.code = code;
		return e;
	}

	function bytesOf(buf) {
		if (buf instanceof Uint8Array) { return buf; }
		if (buf instanceof ArrayBuffer) { return new Uint8Array(buf); }
		if (buf && buf.buffer instanceof ArrayBuffer) {
			return new Uint8Array(buf.buffer, buf.byteOffset || 0, buf.byteLength);
		}
		return null;
	}

	/** Does this look like a SQLite 3 database? Reads the header only; never throws. */
	function isSqlite(buf) {
		var b = bytesOf(buf), i;
		if (!b || b.length < 100) { return false; }
		for (i = 0; i < MAGIC.length; i++) { if (b[i] !== MAGIC[i]) { return false; } }
		return true;
	}

	function loadScript(src) {
		return new Promise(function (resolve, reject) {
			var s = document.createElement('script');
			s.src = src;
			s.async = true;
			s.onload = function () { resolve(); };
			s.onerror = function () { reject(new Error('script')); };
			(document.head || document.documentElement).appendChild(s);
		});
	}

	function getEngine() {
		if (engine) { return engine; }
		var p;
		if (injected) {
			p = injected.init({ wasmBinary: injected.wasmBinary });
		} else if (typeof document === 'undefined' || typeof fetch !== 'function') {
			return Promise.reject(fail('engine', 'No SQLite engine: outside a browser, call '
				+ 'EngCalcs.lpnSqliteSetEngine(initSqlJs, wasmBytes) first.'));
		} else {
			var dir = base() + 'js/vendor/';
			p = Promise.all([
				root.initSqlJs ? Promise.resolve() : loadScript(dir + 'sql-wasm.js?v=' + VERSION),
				fetch(dir + 'sql-wasm.wasm?v=' + VERSION, { credentials: 'same-origin' }).then(function (r) {
					if (!r.ok) { throw new Error('HTTP ' + r.status); }
					return r.arrayBuffer();
				})
			]).then(function (got) {
				if (typeof root.initSqlJs !== 'function') { throw new Error('sql.js did not define itself'); }
				return root.initSqlJs({ wasmBinary: new Uint8Array(got[1]) });
			});
		}
		engine = p.catch(function (e) {
			engine = null;   // a failed fetch may succeed on the next attempt
			throw fail('engine', 'The SQLite engine could not be loaded (' + (e && e.message) + ').');
		});
		return engine;
	}

	/** For a harness, or Node: hand over sql.js and the wasm bytes instead of fetching them. */
	function setEngine(initSqlJs, wasmBinary) {
		injected = { init: initSqlJs, wasmBinary: wasmBinary };
		engine = null;
	}

	function quoteId(name) { return '"' + String(name).replace(/"/g, '""') + '"'; }

	// An INTEGER beyond 2^53 cannot be a JavaScript number without changing it, so it stays a
	// BigInt; every other integer becomes an ordinary number. A REAL is already the exact double
	// the file holds. Nothing is rounded.
	function cell(v) {
		if (typeof v === 'bigint') {
			return (v <= BigInt(Number.MAX_SAFE_INTEGER) && v >= BigInt(Number.MIN_SAFE_INTEGER)) ? Number(v) : v;
		}
		return v;
	}

	function all(db, sql, params) {
		var st = db.prepare(sql), out = [];
		try {
			if (params) { st.bind(params); }
			while (st.step()) {
				var r = st.get(null, { useBigInt: true }), i;
				for (i = 0; i < r.length; i++) { r[i] = cell(r[i]); }
				out.push(r);
			}
			return { columns: st.getColumnNames(), rows: out };
		} finally {
			st.free();
		}
	}

	function catalogue(db) {
		var list = all(db, "SELECT name, type FROM sqlite_master WHERE type IN ('table','view') "
			+ "AND name NOT LIKE 'sqlite\\_%' ESCAPE '\\' ORDER BY name").rows;
		return list.map(function (t) {
			var cols = all(db, 'PRAGMA table_info(' + quoteId(t[0]) + ')').rows.map(function (c) {
				// table_info: cid, name, type, notnull, dflt_value, pk
				return { name: c[1], type: c[2], notNull: !!c[3], pk: c[5] };
			});
			var n = all(db, 'SELECT COUNT(*) FROM ' + quoteId(t[0])).rows[0][0];
			return { name: t[0], kind: t[1], columns: cols, rowCount: n };
		});
	}

	/**
	 * Open a database, read-only. `buf` is an ArrayBuffer or Uint8Array and is never modified.
	 * Resolves to { tables, readRows(name, {offset, limit}), select(sql, params), close() }.
	 * Rejects with an Error whose `.code` is 'not-sqlite', 'engine' or 'unreadable'.
	 */
	function open(buf) {
		var src = bytesOf(buf);
		if (!src) { return Promise.reject(fail('not-sqlite', 'Nothing to open: expected the file\'s bytes.')); }
		if (!isSqlite(src)) {
			return Promise.reject(fail('not-sqlite', 'This is not a SQLite database: its first bytes are not '
				+ '"SQLite format 3".'));
		}
		// The engine's own copy. The caller's bytes are never handed to anything that could write.
		var copy = new Uint8Array(src.length);
		copy.set(src);
		// A file saved in WAL mode opens as it is (dev/lpn-spike/sqlite-reader-harness.js holds
		// it). What it cannot carry is its -wal companion: rows committed but not yet checkpointed
		// live there, and a browser is handed one file. Recorded in dev/sqlite-reader.md.
		return getEngine().then(function (SQL) {
			var db, tables;
			try {
				db = new SQL.Database(copy);
				db.exec('PRAGMA query_only = ON');
				tables = catalogue(db);
			} catch (e) {
				if (db) { try { db.close(); } catch (e2) { /* already broken */ } }
				throw fail('unreadable', 'The SQLite database could not be read (' + (e && e.message) + ').');
			}
			var known = {};
			tables.forEach(function (t) { known[t.name] = t; });
			var closed = false;
			function live() { if (closed) { throw fail('closed', 'This database has been closed.'); } }
			return {
				tables: tables,
				readRows: function (name, opts) {
					live();
					if (!known[name]) { throw fail('no-table', 'No table named "' + name + '".'); }
					var o = opts || {};
					var limit = Math.max(0, Math.floor(o.limit === undefined ? DEFAULT_LIMIT : o.limit));
					var offset = Math.max(0, Math.floor(o.offset || 0));
					return all(db, 'SELECT * FROM ' + quoteId(name) + ' LIMIT ? OFFSET ?', [limit, offset]);
				},
				// For exploring an unknown schema (searching for a value seen in the .inp twin).
				// query_only refuses anything that would write, even to the engine's own copy.
				select: function (sql, params) { live(); return all(db, sql, params); },
				close: function () { if (!closed) { closed = true; db.close(); } }
			};
		});
	}

	EngCalcs.lpnSqliteOpen = open;
	EngCalcs.lpnSqliteIsSqlite = isSqlite;
	EngCalcs.lpnSqliteSetEngine = setEngine;
	EngCalcs.lpnSqliteVersion = VERSION;
}(typeof window !== 'undefined' ? window : globalThis));
