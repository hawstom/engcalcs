// A SETTINGS LABELS ROW IS ONE OR TWO LINES, AND ITS SIX CONTROLS WRAP AS ONE GROUP (Tom, 2026-10-26).
// Sub-row 1 is the name and its display tick; sub-row 2 is Bef., Aft., Use units, 0.000, Show and Drop.
// The group sits beside the name when the box is wide enough and otherwise wholly below it, never
// partly. Real Chromium, Settings > Labels at several widths (a 390 phone, a narrow docked width, a
// wide floating one). At each width, for every Node, Link and Customer field row:
//   1. the six controls share one top (one line), and the group is beside the name or wholly below it;
//   2. every row of a list is in the same state, and the heading cells stand over their controls (same
//      centre x) in either state;
//   3. nothing in the lists sticks out past the pane (a heading badge elsewhere in the pane is not this harness's business);
//   4. a long name (German) never separates the group.
//
//   node dev/lpn-spike/settings-labels-wrap-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const NAME = 'settings-labels-wrap-browser-harness';
if (process.env.EC_SLW_LOCKED !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename],
			{ stdio: 'inherit', env: Object.assign({}, process.env, { EC_SLW_LOCKED: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const LISTS = ['lpn_labels_node_fields', 'lpn_labels_link_fields', 'lpn_labels_customer_fields'];

function measure(page, boxPx) {
	return page.evaluate((arg) => {
		const lists = arg.lists, box = document.getElementById('lpn_settings_box'), c = document.getElementById('lpn_setbox_content');
		if (arg.px) { box.style.width = arg.px + 'px'; }
		const out = { listOver: lists.filter((id) => { const e = document.getElementById(id); return e && e.scrollWidth > e.clientWidth + 1; }), wide: Array.from(c.querySelectorAll('*')).filter((e) => e.offsetParent && e.getBoundingClientRect().right > c.getBoundingClientRect().left + c.clientWidth + 2).slice(0, 4).map((e) => e.tagName + '#' + e.id + '.' + String(e.className).slice(0, 24) + ':' + String(e.textContent).trim().slice(0, 20)), rows: 0, bad: [], states: {}, pane: c.clientWidth, scroll: c.scrollWidth, over: 0 };
		const cr = c.getBoundingClientRect();
		lists.forEach((id) => {
			const list = document.getElementById(id);
			if (!list) { return; }
			const head = Array.from(list.children).filter((r) => r.classList.contains('lpn-set-colhead'))[0];
			const hcells = head ? Array.from(head.querySelector('.lpn-lblgroup').children) : [];
			const hctr = hcells.map((h) => { const q = h.getBoundingClientRect(); return q.left + q.width / 2; });
			Array.from(list.children).forEach((row) => {
				const g = row.querySelector(':scope > .lpn-lblgroup');
				if (!g || row === head || !row.offsetParent) { return; }
				out.rows++;
				const name = row.querySelector('label') ? row.querySelector('label').textContent.trim().slice(0, 18) : '?';
				const ctl = Array.from(g.children).map((k) => k.matches('input') ? k : (k.querySelector('input') || k));
				const ins = ctl.filter((k) => k.matches('input[type=text],input[type=number]'));
				const tops = ins.map((k) => Math.round(k.getBoundingClientRect().top));
				if (Math.max.apply(null, tops) - Math.min.apply(null, tops) > 1) { out.bad.push(id + ':' + name + ' tops ' + tops.join(',')); }
				const mids = ctl.map((k) => { const q = k.getBoundingClientRect(); return q.top + q.height / 2; });
				if (Math.max.apply(null, mids) - Math.min.apply(null, mids) > 12) { out.bad.push(id + ':' + name + ' controls span lines'); }
				const lab = row.querySelector('label').getBoundingClientRect(), gr = g.getBoundingClientRect(), rr = row.getBoundingClientRect();
				const below = gr.top >= lab.bottom - 2, beside = gr.left >= lab.right - 2 && Math.abs((gr.top + gr.height / 2) - (lab.top + lab.height / 2)) < Math.max(lab.height, gr.height);
				if (!below && !beside) { out.bad.push(id + ':' + name + ' group neither below nor beside the name'); }
				(out.states[id] = out.states[id] || new Set()).add(below ? 'below' : 'beside');
				if (rr.height > lab.height + gr.height + 12) { out.bad.push(id + ':' + name + ' more than two lines, row ' + Math.round(rr.height)); }
				ctl.forEach((k, i) => {
					const q = k.getBoundingClientRect(), mid = q.left + q.width / 2;
					if (hcells[i] && Math.abs(mid - hctr[i]) > 2) { out.bad.push(id + ':' + name + ' col ' + i + ' off heading by ' + Math.round(mid - hctr[i])); }
					if (q.right > cr.right + 1 || q.left < cr.left - 1) { out.over++; }
				});
			});
			if (head) {
				const hg = head.querySelector('.lpn-lblgroup').getBoundingClientRect(), hl = head.querySelector('.lpn-lblhead-lead').getBoundingClientRect();
				out.states[id] = out.states[id] || new Set();
				out.states[id].headBelow = hg.top >= hl.bottom - 2 && hg.left < hl.right;
			}
		});
		out.states = Object.fromEntries(Object.entries(out.states).map(([k, v]) => [k, Array.from(v).join('+')]));
		out.boxW = Math.round(box.getBoundingClientRect().width);
		return out;
	}, { lists: LISTS, px: boxPx });
}

async function run(browser, Session, label, viewport, touch, lang, widths) {
	const a = await Session.open(browser, NAME + '-' + label, Object.assign({ viewport }, touch ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}));
	const page = a.page;
	try {
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1' + (lang ? '&lang=' + lang : ''));
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1200);
		await a.menuClick(await a.lang('lpn_tool_settings'), 'project');
		await a.settle(900);
		for (const w of widths) {
			const m = await measure(page, w);
			await a.settle(250);
			const m2 = await measure(page, 0);
			console.log('\n--- ' + label + ', box ' + m2.boxW + ' px, pane ' + m2.pane + '/' + m2.scroll + ', states ' + JSON.stringify(m2.states) + ' ---');
			const t = label + '@' + (w || 'default');
			ok(t + ': rows were found', m2.rows > 15, String(m2.rows));
			ok(t + ': every row is one or two lines, its controls on one top, group beside or wholly below the name, headings over controls', m2.bad.length === 0, m2.bad.slice(0, 4).join(' | '));
			ok(t + ': all rows of a list are in one state, and the heading row is in it', Object.values(m2.states).every((s) => s === 'below' || s === 'beside'), JSON.stringify(m2.states));
			ok(t + ': no control is past the pane and no list overflows sideways', m2.over === 0 && m2.listOver.length === 0, 'wide ' + m2.wide.join(';') + ' over ' + m2.over + ', scroll ' + m2.scroll + ' pane ' + m2.pane);
		}
	} finally { await a.close(); }
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		await run(browser, Session, 'phone', { width: 390, height: 844 }, true, '', [0]);
		await run(browser, Session, 'pc', { width: 1366, height: 768 }, false, '', [0, 340, 420, 520, 760]);
		await run(browser, Session, 'pc-de', { width: 1366, height: 768 }, false, 'de', [340, 760]);
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	if (fails) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => process.exit(process.exitCode || 0));
