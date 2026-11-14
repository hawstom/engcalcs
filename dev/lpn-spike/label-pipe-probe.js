// Where a few named pipes stand on Novato about N163 at the wheel's notches: shown or hidden, fields shown
// of fields asked, level or along, leader drawn. Copy into another checkout's dev/lpn-spike/ to compare.
//   node dev/lpn-spike/label-pipe-probe.js 180 233 185 181
'use strict';
const path = require('path');
const V = require('./label-views-lib.js');
// FULL_FIRST=0 switches the full-fields-first level rule off (the branch before round 5's rule).
const MUT = process.env.FULL_FIRST === '0' ? (src) => src.replace('var LPN_LEVEL_FULL_FIRST = true', 'var LPN_LEVEL_FULL_FIRST = false') + '\n//off\n' : null;
const NOVATO = { name: 'Novato', file: path.join(__dirname, '..', 'water-network-examples', 'Net3-Novato-CA-World.lwn') };
(async function () {
	const stub = require('./lpn-dom-stub.js');
	stub.setUnitSet('us'); await stub.warmEpanet();
	const ids = process.argv.slice(2);
	const [cw, ch] = (process.env.CANVAS || '1300x750').split('x').map(Number);
	const o = await V.openScene(stub, NOVATO, MUT), L = o.L;
	L.setCanvas(cw, ch); L.noteMapSized();
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach((k) => { ls.node[k] = ['id', 'demand', 'elev', 'head', 'pressure'].indexOf(k) >= 0; });
	L.zoomExtent();
	const s1 = L.state().s, p = L.nodeAt(L.getDoc().nodes.find((n) => n.id === '163')), els = L.linkEls();
	for (let k = 0; k <= 16; k++) {
		L.setView({ cx: p.x, cy: p.y, s: s1 * Math.pow(1.1, k) });
		L.refreshLabelText();
		const out = ids.map((id) => {
			const le = els[id]; if (!le) { return id + ':none'; }
			const sh = V.shown(le), f = le.levelBeside && le.levelForm;
			const n = sh ? (f ? f.lines.length : (le.lines || []).length) : 0, ask = (le.allLines || []).length;
			const led = !!le.leader && le.leader.style.display !== 'none';
			return 'L' + id + (sh ? (le.levelBeside ? ' lvl' : ' along') : ' HID') + ' ' + n + '/' + ask + (led ? ' ldr' : '');
		});
		console.log('notch ' + String(k).padStart(2) + '  ' + out.join('   |   '));
	}
	process.exit(0);
})();
