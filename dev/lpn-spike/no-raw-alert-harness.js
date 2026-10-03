// NO RAW alert() ON THE LOOPED NETWORK PAGE (ROADMAP Task 710; dev/dialog-audit.md).
//
//   node dev/lpn-spike/no-raw-alert-harness.js
//
// Task 704 gave every message a place to go (setNotice() and the message log). A blocking alert()
// is the opposite: it holds the page, leaves nothing behind, and cannot be reviewed afterwards.
// So an alert() is almost never right here: the one exception is setStorageError()'s "Not saved"
// (a tab that saves nothing must not be edited on for an hour). The allowlist is for that, and the
// raw confirm() and prompt() calls that dev/dialog-audit.md judged MUST BLOCK -- a confirm guarding data loss or an
// irreversible act, and a prompt that needs a typed answer -- keyed by enclosing function.
// A new confirm()/prompt() fails here until somebody decides, in that file, that it must block.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const FILES = ['js/looped-network.js', 'Looped-Network.php'].concat(
	fs.readdirSync(path.join(ROOT, 'js')).filter(f => /^lpn-.*\.js$/.test(f)).map(f => 'js/' + f));

// "file:function" -> { confirm: n, prompt: n }.  Counts, so a second call in the same function is seen.
const ALLOW = {
	'js/looped-network.js:scenarioMenuRows': { prompt: 2, confirm: 1 },
	'js/looped-network.js:scopedKeys': { confirm: 1 },
	'js/looped-network.js:startBackdropScale': { prompt: 1 },
	'js/looped-network.js:startBackdropScaleFrom': { prompt: 1 },
	'js/looped-network.js:showBackdropTargetPanel': { prompt: 1 },
	'js/looped-network.js:backdropAction': { confirm: 1 },
	'js/looped-network.js:goToLatLon': { prompt: 1 },
	'js/looped-network.js:georefAskSize': { prompt: 1 },
	'js/looped-network.js:georefTwoPointClick': { prompt: 1 },
	'js/looped-network.js:georefFinish': { confirm: 1 },
	'js/looped-network.js:mapgeoScaleFromCurrent': { prompt: 1 },
	'js/looped-network.js:newSavedProfile': { prompt: 1 },
	'js/looped-network.js:renameSavedProfile': { prompt: 1 },
	'js/looped-network.js:deleteSavedProfile': { confirm: 1 },
	'js/looped-network.js:deleteElement': { confirm: 1 },
	'js/looped-network.js:setStorageError': { alert: 1 },
	'js/looped-network.js:wipeEverything': { confirm: 1 },
	'js/looped-network.js:saveAs': { confirm: 2 },
	'js/looped-network.js:revertCurrent': { confirm: 1 },
	'js/looped-network.js:askForLockedFile': { prompt: 1 },
	'js/looped-network.js:openProjectMenu': { prompt: 2 },
	'js/looped-network.js:deleteNetwork': { confirm: 1 },
	'js/looped-network.js:drawTestGrid': { confirm: 1 },
	'js/looped-network.js:counts': { confirm: 1 },
	'js/looped-network.js:hydNumberRow': { confirm: 2 },
	'js/looped-network.js:libCopyOut': { prompt: 1 },
	'js/looped-network.js:applyIdPrefixToAll': { confirm: 1 },
	'js/lpn-search.js:*': { confirm: 1, prompt: 2 },
	'js/lpn-terrain.js:*': { confirm: 3 }
};

const found = {};
FILES.forEach(f => {
	const lines = fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n');
	lines.forEach((l, i) => {
		const s = l.trim();
		if (s.startsWith('//') || s.startsWith('*') || s.startsWith('/*')) { return; }
		const re = /(?<![A-Za-z_.])(?:window\.|root\.)?(alert|confirm|prompt)\(/g;
		let m;
		while ((m = re.exec(l))) {
			let fn = '*';
			if (!/^js\/lpn-(search|terrain)/.test(f)) {
				fn = '?';
				for (let j = i; j >= 0; j--) {
					const mm = /function\s+([A-Za-z0-9_]+)\s*\(/.exec(lines[j]);
					if (mm) { fn = mm[1]; break; }
				}
			}
			const k = f + ':' + fn;
			(found[k] = found[k] || { alert: 0, confirm: 0, prompt: 0, at: [] })[m[1]]++;
			found[k].at.push(i + 1);
		}
	});
});

let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (cond || extra === undefined ? '' : '  -- ' + extra));
}
let total = 0;
Object.keys(found).forEach(k => {
	const f = found[k], allow = ALLOW[k] || {};
	total += f.confirm + f.prompt;
	ok(k + ': alert() count is the audited ' + (allow.alert || 0), f.alert === (allow.alert || 0), 'alert() at line ' + f.at.join(',') + ' -- use setNotice()/setWarning()');
	['confirm', 'prompt'].forEach(kind => {
		ok(k + ': ' + kind + '() count is the audited ' + (allow[kind] || 0),
			f[kind] === (allow[kind] || 0), f[kind] + ' found, line ' + f.at.join(',') + ' -- add it to dev/dialog-audit.md, then here');
	});
});
Object.keys(ALLOW).forEach(k => ok(k + ' still exists', !!found[k], 'allowlist entry with no call site'));
ok('the audited confirm()/prompt() total is 37', total === 37, String(total));
console.log(fails ? '\n' + fails + ' FAILED' : '\nAll assertions passed.');
process.exit(fails ? 1 : 0);
