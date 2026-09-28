// **DOES EVERY HEADING OF EVERY TABLE OBEY R-356, AS DRAWN, IN A REAL CHROME?** Tom's rule
// (2026-09-27): each column opens as wide as the greater of (a) its widest present content, unset
// "No ..." pull-downs not counted, and (b) its heading's longest word WITHOUT UNITS, a word of 8 or
// more letters counting half; the heading wraps within that width, and units are ignored by it.
// His browser pass, 2026-09-28, found it broken in three ways this harness now measures:
//   * "In the new project ... I see all these on one line in violation: Head (ft H2O), Pressure
//     (psi), Source share (%), Fittings list, Flow (gpm), ...";
//   * "Pipe type, Fittings list, ... Speed pattern, Pump efficiency curve, Price pattern" -- every
//     pull-down held its column open to its widest option;
//   * "Vertices (Lat....) is wrapped to two lines, but its units are not wrapped".
//
//   node dev/lpn-spike/pane-heading-rule-harness.js
//
// Every column of every table, on:
//   (a) a brand-new project, local and lat/lon, with Net3's Junctions, Reservoirs, Pipes and
//       Pumps rows copied out of the example with Ctrl+A, Ctrl+C and pasted into the empty tables
//       (Tanks paste is being fixed on another branch; its three rows go in with the Mixing
//       fraction's "Not used" blanked, and the two pumps with their curve references blanked,
//       because the new project has no curves to point at);
//   (b) every example on the wall, solved as it opens, so every result column has content;
//   (c) Net3 in German, for the long words.
// What it asserts, from the DOM as drawn and a canvas measurement of its own (never the page's own
// width arithmetic, which is the thing under test):
//   1. RULE WIDTH: H = max(the heading's longest label word -- an 8+ letter word as its wider
//      half, the first half with the hyphen a break draws -- and the widest present content box
//      less the heading cell's own padding). No line of the heading is wider than H.
//   2. UNITS: the unit either sits whole on the label's last line, or starts a line of its own;
//      and a unit the column has room for is not broken at all (a table built before its first
//      solve must let its heading follow the result column as the results widen it).
//   3. The column is not held open past the rule: no heading cell is wider than H plus its own
//      padding, except the ID column (its pin is content the rule does not see) and a checkbox
//      column (likewise).
//   4. No present value is clipped: every input's text fits its box, and every CHOSEN pull-down
//      shows its whole choice.
// Screenshots of the lat/lon paste case and German Net3 go to $PANE_RULE_SHOTS (default: a folder
// under the system temp dir); PANE_RULE_ALLSHOTS=1 takes every table (slower: check_all runs this
// under run_harnesses.sh's 300 s limit).
//
// **DO NOT PREFIX THIS WITH `flock`.** It takes /tmp/engcalcs-browser.lock itself by re-executing
// under flock, exactly as pane-heading-wrap-harness.js does.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PANE_RULE_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '400', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('pane-heading-rule-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('pane-heading-rule-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 400 s. Lock contention, not a width failure; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('pane-heading-rule-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

const SHOTS = process.env.PANE_RULE_SHOTS || path.join(os.tmpdir(), 'pane-rule-shots');
const TABS = ['junctions', 'reservoirs', 'tanks', 'pipes', 'pumps', 'valves'];
const PASTE_TABS = ['junctions', 'reservoirs', 'tanks', 'pipes', 'pumps'];
// Half a pixel of antialiasing and sub-pixel rounding either way, and no more.
const SLACK = 1.5;

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	if (!cond || process.env.PANE_RULE_VERBOSE) {
		console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	}
}

// Runs INSIDE the page, on one table. Returns one record per column.
const MEASURE = ([panelId, slack]) => {
	const host = document.getElementById(panelId);
	const table = host && host.querySelector('table.lpn-pane-table');
	if (!table) { return { none: true }; }
	const SHY = String.fromCharCode(173);
	const ctx = document.createElement('canvas').getContext('2d');
	const fontOf = (el) => { const cs = getComputedStyle(el); return cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily; };
	const textW = (text, el) => { ctx.font = fontOf(el); return ctx.measureText(text).width; };
	const px = (v) => parseFloat(v) || 0;
	const linesOf = (node) => {
		const r = document.createRange(); r.selectNodeContents(node);
		const out = {};
		[...r.getClientRects()].filter((x) => x.width > 0.5).forEach((x) => {
			const t = Math.round(x.top + x.height / 2);
			const k = Object.keys(out).find((kk) => Math.abs(kk - t) < 4) || t;
			out[k] = out[k] || { l: 1e9, r: -1e9 };
			out[k].l = Math.min(out[k].l, x.left); out[k].r = Math.max(out[k].r, x.right);
		});
		return out;
	};
	const rows = [...table.querySelectorAll('tbody tr')];
	const isBoolCell = (td) => !!td.querySelector('input[type="checkbox"]');
	const res = [];
	table.querySelectorAll('thead th').forEach((th, ci) => {
		const btn = th.querySelector('.lpn-pane-sort');
		if (!btn) { return; }
		const key = (th.className.match(/lpn-pane-col-(\S+)/) || [])[1] || '?';
		const labelNode = [...btn.childNodes].find((n) => n.nodeType === 3);
		const unit = btn.querySelector('.lpn-pane-hunit');
		const label = (labelNode ? labelNode.nodeValue : btn.textContent).trim();
		// (b) the heading's longest word, units not counted, 8+ letters as the wider half.
		let headW = 0;
		label.split(/\s+/).filter(Boolean).forEach((w) => {
			const i = w.indexOf(SHY);
			if (i < 0) { headW = Math.max(headW, textW(w, btn)); return; }
			headW = Math.max(headW, textW(w.slice(0, i) + '-', btn), textW(w.slice(i + 1), btn));
		});
		// (a) the widest present content BOX: an input's text plus its own padding and border; a
		// CHOSEN pull-down's natural width with only its chosen option in it. An unset pull-down
		// (value '') is the rule's "No ..." and is not counted.
		let contentW = 0, clipped = [], isBool = false;
		rows.forEach((tr) => {
			const td = tr.children[ci];
			if (!td) { return; }
			const inp = td.querySelector('input:not([type="checkbox"])');
			const sel = td.querySelector('select');
			if (td.querySelector('input[type="checkbox"]')) { isBool = true; }
			if (inp && inp.value) {
				const cs = getComputedStyle(inp);
				const box = textW(inp.value, inp) + px(cs.paddingLeft) + px(cs.paddingRight) + px(cs.borderLeftWidth) + px(cs.borderRightWidth);
				contentW = Math.max(contentW, box);
				if (box > inp.getBoundingClientRect().width + slack) { clipped.push(tr.dataset.id || inp.value); }
			} else if (!inp && !sel && !isBoolCell(td) && td.textContent.trim()) {
				// A plain cell: a result, an identity the drawing owns, a stated word.
				const cs = getComputedStyle(td);
				const rg = document.createRange(); rg.selectNodeContents(td);
				const box = rg.getBoundingClientRect().width + px(cs.paddingLeft) + px(cs.paddingRight);
				contentW = Math.max(contentW, box);
				if (td.scrollWidth > td.clientWidth + 1) { clipped.push(td.textContent.trim()); }
			} else if (sel && sel.value !== '' && sel.selectedIndex >= 0) {
				const c = sel.cloneNode(false);
				c.appendChild(sel.options[sel.selectedIndex].cloneNode(true));
				c.style.cssText = 'width:auto;min-width:0;max-width:none;position:absolute;visibility:hidden;';
				td.appendChild(c);
				const box = c.getBoundingClientRect().width;
				td.removeChild(c);
				contentW = Math.max(contentW, box);
				if (box > sel.getBoundingClientRect().width + slack) { clipped.push(sel.options[sel.selectedIndex].textContent + ' (' + box.toFixed(1) + 'px in ' + sel.getBoundingClientRect().width.toFixed(1) + 'px)'); }
			}
		});
		const thCs = getComputedStyle(th);
		const thPad = px(thCs.paddingLeft) + px(thCs.paddingRight);
		const H = Math.max(headW, contentW - thPad);
		const lines = linesOf(btn);
		const lineWs = Object.values(lines).map((l) => l.r - l.l);
		// Units: which lines does the unit touch, and is the label's last line one of them?
		let unitOk = true, unitNote = '';
		if (unit && labelNode) {
			const u = linesOf(unit), uk = Object.keys(u).map(Number).sort((x, y) => x - y);
			const r = document.createRange(); r.selectNodeContents(labelNode);
			const lk = [...new Set([...r.getClientRects()].filter((x) => x.width > 0.5).map((x) => Math.round(x.top + x.height / 2)))].sort((x, y) => x - y);
			const lastLabel = lk[lk.length - 1];
			const sharesLine = uk.some((t) => Math.abs(t - lastLabel) < 4);
			if (sharesLine && uk.length > 1) { unitOk = false; unitNote = 'unit split across the label\'s line and ' + (uk.length - 1) + ' more'; }
			// A unit the column has room for is not broken at all.
			const room = th.getBoundingClientRect().width - px(getComputedStyle(th).paddingLeft) - px(getComputedStyle(th).paddingRight);
			const unitW = textW(unit.textContent, btn);
			if (uk.length > 1 && unitW <= room - slack) {
				unitOk = false; unitNote = 'unit ' + unit.textContent + ' (' + unitW.toFixed(1) + 'px) broken in a column with ' + room.toFixed(1) + 'px of room';
			}
		}
		res.push({
			key: key, text: btn.textContent.replace(new RegExp(SHY, 'g'), ''), H: H, headW: headW, contentW: contentW,
			lineWs: lineWs, widest: lineWs.length ? Math.max.apply(null, lineWs) : 0,
			thW: th.getBoundingClientRect().width, thPad: thPad, unitOk: unitOk, unitNote: unitNote,
			clipped: clipped.slice(0, 3), isBool: isBool
		});
	});
	return { cols: res };
};

function assertTable(label, report) {
	if (report.none) { return 0; }
	report.cols.forEach((c) => {
		const name = label + ' "' + c.text + '"';
		ok(name + ': no heading line wider than the rule width', c.widest <= c.H + SLACK,
			'widest line ' + c.widest.toFixed(1) + 'px > rule ' + c.H.toFixed(1) + 'px (heading word ' + c.headW.toFixed(1) +
			', content box ' + c.contentW.toFixed(1) + ')');
		ok(name + ': units whole on the label\'s line or on a line of their own, and unbroken where they fit', c.unitOk, c.unitNote);
		if (c.key !== 'id' && !c.isBool) {
			ok(name + ': the column is not held open past the rule', c.thW <= c.H + c.thPad + SLACK + 1,
				'heading cell ' + c.thW.toFixed(1) + 'px > rule ' + (c.H + c.thPad).toFixed(1) + 'px');
		}
		ok(name + ': no present value is clipped', c.clipped.length === 0, c.clipped.join(', '));
	});
	return report.cols.length;
}

async function measureAll(a, label, shots) {
	let n = 0;
	for (const t of TABS) {
		const has = await a.page.evaluate((t) => !!document.getElementById('lpn_pane_tab_' + t), t);
		if (!has) { continue; }
		await a.page.evaluate((t) => document.getElementById('lpn_pane_tab_' + t).click(), t);
		await a.settle(250);
		const rep = await a.page.evaluate(MEASURE, ['lpn_pane_' + t, SLACK]);
		const cols = assertTable(label + ' ' + t, rep);
		n += cols;
		if (cols && (shots || process.env.PANE_RULE_ALLSHOTS)) {
			await a.page.screenshot({ path: path.join(SHOTS, (label + '-' + t).replace(/[^A-Za-z0-9-]+/g, '_') + '.png') });
		}
	}
	return n;
}

async function openPane(a) {
	const open = await a.page.evaluate(() => {
		const p = document.getElementById('lpn_pane_body');
		return !!(p && p.offsetParent);
	});
	if (!open) { await a.page.evaluate(() => { document.getElementById('lpn_pane_btn').click(); }); }
	await a.settle(500);
}

// Net3's tables as a person copies them: stand on a cell, Ctrl+A, Ctrl+C.
async function copyTables(a) {
	const tsv = {};
	for (const t of PASTE_TABS) {
		await a.page.evaluate((t) => document.getElementById('lpn_pane_tab_' + t).click(), t);
		await a.settle(300);
		await a.page.click('#lpn_pane_' + t + ' tbody tr:first-child td:nth-child(2)');
		await a.page.keyboard.press('Control+A');
		await a.page.keyboard.press('Control+C');
		await a.settle(200);
		tsv[t] = await a.page.evaluate(() => navigator.clipboard.readText());
	}
	// Work-arounds for paste defects owned elsewhere (fix/table-paste), and for a new project
	// having no curves: the widths under test do not depend on either cell.
	tsv.tanks = tsv.tanks.split('\n').map((r) => r.split('\t').map((v) => (v === 'Not used' ? '' : v)).join('\t')).join('\n');
	tsv.pumps = tsv.pumps.split('\n').map((r) => { const f = r.split('\t'); if (f.length > 7) { f[7] = ''; } return f.join('\t'); }).join('\n');
	return tsv;
}

async function pasteTables(a, tsv) {
	const notes = [];
	for (const t of PASTE_TABS) {
		await a.page.evaluate((t) => document.getElementById('lpn_pane_tab_' + t).click(), t);
		await a.settle(300);
		const r = await a.page.evaluate(([t, text]) => {
			const note = document.querySelector('#lpn_pane_' + t + ' .lpn-pane-paste-target');
			if (!note) { return 'no paste target'; }
			note.focus();
			const dt = new DataTransfer(); dt.setData('text/plain', text);
			note.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
			return document.getElementById('lpn_map_notice').textContent;
		}, [t, tsv[t]]);
		await a.settle(400);
		notes.push(t + ': ' + r);
	}
	return notes;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('pane-heading-rule-harness: playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	fs.mkdirSync(SHOTS, { recursive: true });
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('pane-heading-rule-harness: no Chromium found (set CHROME_PATH). SKIPPING rather than failing on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		// (a) new projects, local and lat/lon, with Net3 pasted in.
		for (const geo of [false, true]) {
			const label = geo ? 'new-latlon+Net3' : 'new-local+Net3';
			const a = await Session.open(browser, label);
			await a.context.grantPermissions(['clipboard-read', 'clipboard-write']);
			await a.goto('Looped-Network.php');
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
			await openPane(a);
			const tsv = await copyTables(a);
			if (geo) { await a.newGeoProject('us'); } else { await a.newProject('us'); }
			await openPane(a);
			const notes = await pasteTables(a, tsv);
			const counts = await a.page.evaluate(() => {
				const n = {};
				['junctions', 'reservoirs', 'tanks', 'pipes', 'pumps'].forEach((t) => {
					n[t] = document.querySelectorAll('#lpn_pane_' + t + ' tbody tr').length;
				});
				return n;
			});
			ok(label + ': the paste made every table (92 junctions, 2 reservoirs, 3 tanks, 117 pipes, 2 pumps)',
				counts.junctions === 92 && counts.reservoirs === 2 && counts.tanks === 3 && counts.pipes === 117 && counts.pumps === 2,
				JSON.stringify(counts) + ' | ' + notes.join(' | '));
			const n = await measureAll(a, label, geo);
			console.log('  ' + label + ': ' + n + ' columns measured');
			errors.push.apply(errors, a.errors);
			await a.context.close();
		}
		// (b) every example on the wall, in English; (c) Net3 in German.
		const probe = await Session.open(browser, 'wall');
		await probe.goto('Looped-Network.php');
		const titles = await probe.page.$$eval('#lpn_examples_pane .lpn-example-card .lpn-example-title',
			(els) => els.map((e) => (e.textContent || '').trim()));
		await probe.context.close();
		const runs = titles.map((t) => ({ lang: null, title: t })).concat([{ lang: 'de', key: 'lpn_ex_net3_title' }]);
		for (const run of runs) {
			const a = await Session.open(browser, run.lang || 'en');
			await a.goto('Looped-Network.php' + (run.lang ? '?lang=' + run.lang : ''));
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			const title = run.title || await a.lang(run.key);
			await a.openExampleCard(title);
			await a.settle(800);
			await openPane(a);
			const n = await measureAll(a, (run.lang || 'en') + ' ' + title, run.key === 'lpn_ex_net3_title');
			console.log('  ' + (run.lang || 'en') + ' ' + title + ': ' + n + ' columns measured');
			errors.push.apply(errors, a.errors);
			await a.context.close();
		}
		ok('no page errors', errors.length === 0, errors.slice(0, 3).join(' || '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + (checks - fails) + '/' + checks + ' checks passed. Screenshots: ' + SHOTS);
	process.exit(fails ? 1 : 0);
}

main().catch((err) => { console.error('pane-heading-rule-harness: ' + (err && err.stack || err)); process.exit(1); });
