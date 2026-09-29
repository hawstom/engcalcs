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
//   (c) Net3 in German, for the long words;
//   (d) Net3 at `?colword=9` and at `?collines=0.8`, the two A/B overrides.
// It runs in three parts, one per harness file, because run_harnesses.sh gives each file 300 s:
// this file is (a); pane-heading-rule-examples-harness.js is (b); pane-heading-rule-ab-harness.js
// is (c) and (d). Each of those sets PANE_RULE_PART and requires this one.
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
//   5. THE WORD CAP (Tom, 2026-09-28: *"What's our longest word rule? 7 max ... We could A/B test
//      7 and 9 as max."*): a label word longer than WORD_MAX (7, or the page's `?colword=`) carries
//      exactly one soft hyphen, at its middle; a word of WORD_MAX letters or fewer carries none.
//      Rule 1's heading-word width is computed from that cap here, not read off the page.
//   6. THE LINE-RATIO RULE (Tom, 2026-09-28: *"Don't wrap to cause n lines to be more than KLmax
//      times n characters on longest line. Let's try KLmax=1"*): every WRAPPED heading's line count
//      is at most KLmax (1, or `?collines=`) times the characters on its longest line (one line is
//      not a wrap, or KLmax 0.8 would fail "X"). A column is
//      allowed past rule 1's width only for this, and only minimally: 4px narrower, its heading
//      would break the ratio.
//   7. AN UNSET PULL-DOWN NEVER WIDENS ITS COLUMN (Tom, 2026-09-28, on "No ▾": *"This is
//      accepted."*): every unset "No ..." pull-down is drawn no wider than its cell, and a column
//      of nothing but unset pull-downs is no wider than its heading's rules make it.
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

const PART = process.env.PANE_RULE_PART || 'paste';
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
const MEASURE = ([panelId, slack, wordMax, kl]) => {
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
		// (b) the heading's longest word, units not counted; a word over the cap as its wider half,
		// split where the harness says (the middle), and the soft hyphen checked to be there.
		let headW = 0; const shyWrong = [];
		label.split(/\s+/).filter(Boolean).forEach((w) => {
			const bare = w.split(SHY).join(''), i = w.indexOf(SHY), mid = Math.ceil(bare.length / 2);
			if (bare.length > wordMax ? (i !== mid || w.lastIndexOf(SHY) !== i) : i >= 0) { shyWrong.push(bare); }
			if (bare.length <= wordMax) { headW = Math.max(headW, textW(bare, btn)); return; }
			headW = Math.max(headW, textW(bare.slice(0, mid) + '-', btn), textW(bare.slice(mid), btn));
		});
		// (a) the widest present content BOX: an input's text plus its own padding and border; a
		// CHOSEN pull-down's natural width with only its chosen option in it. An unset pull-down
		// (value '') is the rule's "No ..." and is not counted.
		let contentW = 0, clipped = [], isBool = false, unsetWide = [], unsetN = 0;
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
			} else if (sel && sel.value === '') {
				unsetN++;
				if (sel.getBoundingClientRect().width > td.getBoundingClientRect().width + slack) { unsetWide.push(tr.dataset.id || '?'); }
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
		// Line ratio: lines and the characters on the longest line, as drawn; and, if the column is
		// wider than rule 1, whether 4px narrower would break the ratio (a clone, same cell).
		const ratio = (node) => {
			const tops = [], per = [];
			const walker = document.createTreeWalker(node, 4, null); let tn;
			while ((tn = walker.nextNode())) {
				for (let i = 0; i < tn.nodeValue.length; i++) {
					const ch = tn.nodeValue.charAt(i);
					if (/\s/.test(ch) || ch === SHY) { continue; }
					const r = document.createRange(); r.setStart(tn, i); r.setEnd(tn, i + 1);
					const rc = r.getClientRects()[0];
					if (!rc || !(rc.width > 0)) { continue; }
					const t = rc.top + rc.height / 2;
					let k = tops.findIndex((x) => Math.abs(x - t) < 3);
					if (k < 0) { tops.push(t); per.push(0); k = tops.length - 1; }
					per[k]++;
				}
			}
			return { lines: tops.length, chars: per.length ? Math.max.apply(null, per) : 0 };
		};
		const now = ratio(btn);
		let narrowerBreaks = null;
		const basicMax = H + thPad + slack + 1;
		const widestNow = Math.max.apply(null, lineWs.concat([0]));
		if (th.getBoundingClientRect().width > basicMax || widestNow > H + slack) {
			const cl = btn.cloneNode(true);
			cl.style.cssText = 'position:absolute;visibility:hidden;left:0;top:0;width:' + (btn.getBoundingClientRect().width - 4) + 'px;';
			th.appendChild(cl);
			const n2 = ratio(cl);
			th.removeChild(cl);
			narrowerBreaks = n2.lines > 1 && n2.lines > kl * n2.chars;
		}
		res.push({
			lines: now.lines, lineChars: now.chars, btnW: btn.getBoundingClientRect().width, narrowerBreaks: narrowerBreaks, shyWrong: shyWrong,
			unsetN: unsetN, unsetWide: unsetWide, basicMax: basicMax,
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
		// Widened for the line ratio (and minimally, check below): the rule width is then the width
		// that ratio needed, which is the button's own.
		const ruleW = c.narrowerBreaks === true ? Math.max(c.H, c.btnW) : c.H;
		ok(name + ': no heading line wider than the rule width', c.widest <= ruleW + SLACK,
			'widest line ' + c.widest.toFixed(1) + 'px > rule ' + c.H.toFixed(1) + 'px (heading word ' + c.headW.toFixed(1) +
			', content box ' + c.contentW.toFixed(1) + ')');
		ok(name + ': units whole on the label\'s line or on a line of their own, and unbroken where they fit', c.unitOk, c.unitNote);
		ok(name + ': a word over the cap splits once, at its middle; none at or under it splits', c.shyWrong.length === 0,
			c.shyWrong.join(', '));
		ok(name + ': a wrapped heading has lines <= KLmax x characters on its longest line', c.lines <= 1 || c.lines <= KL * c.lineChars,
			c.lines + ' lines, longest ' + c.lineChars + ' characters, KLmax ' + KL);
		if (c.key !== 'id' && !c.isBool) {
			ok(name + ': the column is not held open past the rule (past rule 1 only for the line ratio, and minimally)',
				c.thW <= c.basicMax || c.narrowerBreaks === true,
				'heading cell ' + c.thW.toFixed(1) + 'px > rule ' + (c.basicMax - SLACK - 1).toFixed(1) + 'px' +
				(c.narrowerBreaks === false ? ', and 4px narrower still keeps the line ratio' : ''));
		}
		if (c.unsetN) {
			ok(name + ': an unset "No ..." pull-down never widens its column', c.unsetWide.length === 0 &&
				(c.contentW > 0 || c.thW <= c.basicMax || c.narrowerBreaks === true), c.unsetWide.join(', '));
		}
		ok(name + ': no present value is clipped', c.clipped.length === 0, c.clipped.join(', '));
	});
	return report.cols.length;
}

// The cap and the ratio the page under test is running at: the defaults, or what the run's URL
// says. Set per run in main().
let WORD_MAX = 7, KL = 1;
async function measureAll(a, label, shots) {
	let n = 0;
	for (const t of TABS) {
		const has = await a.page.evaluate((t) => !!document.getElementById('lpn_pane_tab_' + t), t);
		if (!has) { continue; }
		await a.page.evaluate((t) => document.getElementById('lpn_pane_tab_' + t).click(), t);
		await a.settle(250);
		const rep = await a.page.evaluate(MEASURE, ['lpn_pane_' + t, SLACK, WORD_MAX, KL]);
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
		for (const geo of (PART === 'paste' ? [false, true] : [])) {
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
		// (b) every example on the wall, in English; (c) Net3 in German; (d) the A/B overrides.
		let runs = [];
		if (PART === 'examples') {
			const probe = await Session.open(browser, 'wall');
			await probe.goto('Looped-Network.php');
			const titles = await probe.page.$$eval('#lpn_examples_pane .lpn-example-card .lpn-example-title',
				(els) => els.map((e) => (e.textContent || '').trim()));
			await probe.context.close();
			runs = titles.map((t) => ({ lang: null, title: t }));
		} else if (PART === 'ab') {
			runs = [{ lang: 'de', key: 'lpn_ex_net3_title' },
				{ lang: null, key: 'lpn_ex_net3_title', q: 'colword=9', word: 9 },
				{ lang: null, key: 'lpn_ex_net3_title', q: 'collines=0.8', kl: 0.8 }];
		}
		for (const run of runs) {
			const a = await Session.open(browser, run.lang || 'en');
			WORD_MAX = run.word || 7; KL = run.kl || 1;
			const qs = [run.lang ? 'lang=' + run.lang : '', run.q || ''].filter(Boolean).join('&');
			await a.goto('Looped-Network.php' + (qs ? '?' + qs : ''));
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			const title = run.title || await a.lang(run.key);
			await a.openExampleCard(title);
			await a.settle(800);
			await openPane(a);
			const tag = (run.lang || 'en') + ' ' + title + (run.q ? ' ?' + run.q : '');
			const n = await measureAll(a, tag, PART === 'ab');
			console.log('  ' + tag + ': ' + n + ' columns measured');
			if (run.word) {
				// The override really reached the page: "Diameter" and "Velocity" (8) whole,
				// "Description" (11) still split.
				const shy = await a.page.evaluate(() => {
					const SHY = String.fromCharCode(173), out = {};
					document.querySelectorAll('#lpn_pane_pipes thead .lpn-pane-sort').forEach((b) => {
						const t = b.firstChild && b.firstChild.nodeType === 3 ? b.firstChild.nodeValue : '';
						out[t.split(SHY).join('').trim().split(/\s+/)[0]] = t.indexOf(SHY) >= 0;
					});
					return out;
				});
				ok(tag + ': Diameter and Velocity are kept whole, Description still splits',
					shy.Diameter === false && shy.Velocity === false && shy.Description === true, JSON.stringify(shy));
			}
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
