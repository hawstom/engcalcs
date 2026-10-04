// NO RAW alert(), confirm() OR prompt() ON THE LOOPED NETWORK PAGE (ROADMAP Task 710;
// dev/dialog-audit.md).
//
//   node dev/lpn-spike/no-raw-alert-harness.js
//
// Task 704 gave every message a place to go (setNotice() and the message log), and Task 710 gave
// every question one: askDialog() in js/looped-network.js (EngCalcs.lpnAsk from the lpn-*.js
// modules), the page's one styled in-page box. Tom, 2026-10-04: *"The browser-style boxes aren't
// pretty. I think they all should be converted."* So the allowlist is EMPTY: a new raw dialog is a
// defect a person reading the diff would miss, and it fails here.
//
// The one native dialog that cannot be replaced is the browser's own "Leave site?" box, and it is
// not a call: the beforeunload handler sets `returnValue`, which this scan does not match.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const FILES = ['js/looped-network.js', 'Looped-Network.php'].concat(
	fs.readdirSync(path.join(ROOT, 'js')).filter(f => /^lpn-.*\.js$/.test(f)).map(f => 'js/' + f));

const RE = /(?<![A-Za-z0-9_$.])(?:(?:window|root|self|globalThis)\.)?(alert|confirm|prompt)\s*\(/g;
function scan(text) {
	const hits = [];
	text.split('\n').forEach((l, i) => {
		const s = l.trim();
		if (s.startsWith('//') || s.startsWith('*') || s.startsWith('/*')) { return; }
		RE.lastIndex = 0;
		let m;
		while ((m = RE.exec(l))) { hits.push({ line: i + 1, kind: m[1] }); }
	});
	return hits;
}

let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (cond || extra === undefined ? '' : '  -- ' + extra));
}

// The scan is only worth its silence if it can speak: every form a raw dialog has taken here.
const FIXTURE = [
	"alert(said);",
	"if (!window.confirm(msg)) { return; }",
	"if (!root.confirm || !root.confirm(text)) { return false; }",
	"var v = prompt(text, '1');",
	"// a comment naming confirm() is not a call",
	"askDialog({ kind: 'confirm', text: msg }, done);",
	"opts.confirm && x;",
	"window.addEventListener('beforeunload', function (e) { e.returnValue = ''; });"
].join('\n');
const fx = scan(FIXTURE);
ok('selftest: the four raw forms are seen', fx.length === 4, JSON.stringify(fx));
ok('selftest: a comment, askDialog, opts.confirm and beforeunload are not',
	fx.every(h => h.line <= 4), JSON.stringify(fx));

FILES.forEach(f => {
	const hits = scan(fs.readFileSync(path.join(ROOT, f), 'utf8'));
	ok(f + ': no raw alert()/confirm()/prompt()', hits.length === 0,
		hits.map(h => h.kind + '() at line ' + h.line).join(', ') +
		' -- use askDialog() (EngCalcs.lpnAsk), or setNotice()/setWarning() for a message');
});
console.log(fails ? '\n' + fails + ' FAILED' : '\nAll assertions passed.');
process.exit(fails ? 1 : 0);
