// A WaterGEMS project database as comparable text, for dev/lpn-spike/wtg-page-export-harness.js:
// every table's rows, each row as JSON with identifiers and save times masked, sorted; and one
// digest per table. The golden digests in reference/wtg-net3-golden.json were made by the spike
// writer BEFORE it moved into js/lpn-wtg-export.js (commit 8edd6369b), so a later change to the
// writer that changes what lands in a table fails the harness instead of agreeing with itself.
'use strict';
const crypto = require('crypto');

// Masked: random identifiers and the save time everywhere; the project's Notes (the page's .inp
// states the project name as the title, Net3's own file states another) in HMIDomainDataSet only.
const MASK = /guid|datemodified/i;
const MASK_TABLE_COLUMN = { HMIDomainDataSet: /^Notes$/ };

function dump(SQL, bytes) {
	const db = new SQL.Database(new Uint8Array(bytes)), res = {}, names = [];
	const st = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
	while (st.step()) { names.push(st.get()[0]); }
	st.free();
	names.forEach((t) => {
		const cols = [], c = db.prepare('PRAGMA table_info("' + t + '")');
		while (c.step()) { cols.push(c.get()[1]); }
		c.free();
		const rows = [], r = db.prepare('SELECT * FROM "' + t + '"');
		while (r.step()) {
			rows.push(JSON.stringify(r.get().map((v, i) => (MASK.test(cols[i]) || (MASK_TABLE_COLUMN[t] && MASK_TABLE_COLUMN[t].test(cols[i])))
				? '#' : (v instanceof Uint8Array ? 'x' + Buffer.from(v).toString('hex') : v))));
		}
		r.free();
		res[t] = rows.sort();
	});
	db.close();
	return res;
}
function digests(d) {
	const out = {};
	Object.keys(d).forEach((t) => { out[t] = { rows: d[t].length, sha256: crypto.createHash('sha256').update(d[t].join('\n')).digest('hex') }; });
	return out;
}
module.exports = { dump, digests };
