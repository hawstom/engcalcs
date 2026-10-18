# The SQLite reader: the foundation for Bentley `.wtg.sqlite`

ROADMAP Task 749, branch `feat/sqlite-reader`, 2026-10-17. It reads any SQLite database and knows
nothing about Bentley. The research behind it is `dev/bentley-interop.md`; the public samples and
what their schema shows are `chore/752-reshape:dev/agents/market-researcher/wtg-samples.md`.

**Checked once against real files, 2026-10-17** (a one-off script, not committed; the samples stay
out of the repo while their licence question is open): Zenodo 7162154's "withdrwal capacity curve"
model (7.1 MB) opened in 71 ms and listed 383 tables (384 less SQLite's own `sqlite_sequence`);
`HMIScenario` read as Base (58), "Scenario - 1" with parent 58, and "Scenario - 2", plus the
soft-deleted row 1; `IdahoPipe_Physical_Data` read 151 rows. TSNet's `tnet3.wtg.sqlite` listed
379. Neither file changed.

## What was vendored

- **sql.js 1.14.2** (SQLite compiled to WebAssembly), from npm, unmodified:
  `js/vendor/sql-wasm.js` 46,535 bytes (about 17 KB compressed) and `js/vendor/sql-wasm.wasm`
  658,410 bytes (about 322 KB compressed). Licence text `js/vendor/sql.js.LICENSE`. Digests in
  `dev/vendor-manifest.json`, version pinned in `package.json`.
  1.15.0 existed but was three days old; 1.14.2 had been out two months.
- **Licence:** sql.js is MIT and SQLite is public domain; both go into a GPL-3 project without
  conflict, provided the MIT notice ships with them, which it does.

## How it loads

- `js/lpn-sqlite.js` (a few KB) is on the Looped Network page. It fetches nothing until
  `EngCalcs.lpnSqliteOpen()` is called. Then it fetches the script and the wasm **from this site**,
  never a CDN, so there is no new third-party request and `privacy.php` is unchanged.
- The wasm is fetched as bytes and handed to the engine, so the host's MIME type for `.wasm` does
  not matter (the same reason epanet-js's `.mjs` was renamed).
- **Not precached.** `sql-wasm.js` is in `ecSwAssetExclusions()`; the `.wasm` is outside the
  service worker's asset globs. After first use the worker keeps a copy (the script cache-first,
  the wasm network-first), so a second open works offline. Both URLs carry `?v=1.14.2`.
- A visitor pays the ~340 KB compressed download only when a database is opened, once.

## What the module offers

`EngCalcs.lpnSqliteOpen(arrayBuffer)` resolves to:

- `tables`: `[{name, kind: 'table'|'view', columns: [{name, type, notNull, pk}], rowCount}]`,
  sorted by name, SQLite's own `sqlite_` tables left out;
- `readRows(name, {offset, limit})`: `{columns, rows}`, 1,000 rows by default;
- `select(sql, params)`: any read-only query, for exploring an unknown schema;
- `close()`.

It rejects with `.code` `not-sqlite` (header is not "SQLite format 3"), `engine` (library failed
to load) or `unreadable` (damaged). `EngCalcs.lpnSqliteIsSqlite(bytes)` tests the header alone.

**It never writes to the file.** It copies the bytes before the engine sees them and opens the copy
with `PRAGMA query_only`, so even a stray write to the copy is refused. Values come back exactly:
a REAL is the stored double, an integer past 2^53 stays a BigInt, a blob is a `Uint8Array`.

Tests: `dev/lpn-spike/sqlite-reader-harness.js` (Node, 44 checks). Python's `sqlite3` builds the
model-shaped database at test time, so writer and reader are different SQLite builds.
`dev/lpn-spike/sqlite-reader-browser-harness.js` (Chromium) holds that a page load fetches
nothing of sql.js and that opening a database fetches both files from the page's own site, once.

**No visitor-facing UI and no language keys.** The only way in is the browser console on the
Looped Network page: read a file into an ArrayBuffer and call `EngCalcs.lpnSqliteOpen(buf)`.

## Left for the resolver

The schema is now visible in public samples (see the samples note above); what is not yet built:

- **The schema mapping**: Bentley's element classes onto ours, and filtering the soft-deleted
  (`IsDeleted`) rows every table carries.
- **The resolver**: scenario, then the alternative for each facet, then the parent chain until a
  value is found (`dev/bentley-interop.md`, the patent).
- **Storage units per field** (one sample suggests feet throughout; another disagrees), and
  decoding the WKB point geometry.
- **A child scenario that overrides a value**: no public sample has one, so how an override is
  stored is still unconfirmed.
- **Big files.** sql.js holds the whole file in memory; Bentley reports a 6 GB file for 7,000
  pipes. If real files are that size, a paged reader (wa-sqlite) replaces sql.js.
- **A zipped `.wtg.sqlite`** (Bentley suggests zipping) is refused as not SQLite today.
- **A WAL-mode file** opens, but rows still in its separate `-wal` file are not seen. Bentley
  may never leave one.
- The import's scenario-awareness questions (Task 814), the menu entry, its wording and keys, and
  writing the file back (no-go, `dev/bentley-interop.md`).
