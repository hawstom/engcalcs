// **TAB OUT OF A JUST-EDITED FIELD IN PROPERTIES.** Committing an edit rebuilds the box, which
// used to throw away the field the browser was about to focus: Tab landed on the page body. In
// real Chromium with real key presses, on Net1: type into a junction's fields and Tab through five
// in a row (each Tab lands on the next field and typing goes there), Shift+Tab goes back one, a
// pipe's fields do the same, the typed value is committed (and undo restores it), a click on
// another field is undisturbed, and Enter still commits. The Description box is a multi-line field
// (Task 806): typed into, Tab and Shift+Tab leave it for its neighbours with the text kept.
//
// A tab stop is named by its tag, its row's label and WHICH of that name it is (`#2`), because a
// row's checkbox, its tip and an unlabelled box would otherwise share a name and the expected stop
// would be the first of them anywhere in the box.
//
//   node dev/lpn-spike/properties-tab-focus-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PROPTAB_BROWSER_LOCKED';
const NAME = 'properties-tab-focus-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});

		// The editable text and number boxes of the open Properties box, in tab order, by row label.
		const rows = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields input'))
			.filter((i) => (i.type === 'text' || i.type === 'number') && !i.readOnly && !i.disabled && i.offsetParent)
			.map((i) => { const l = i.closest('label'); return (l ? (l.querySelector('.lpn-gname') || l.firstChild).textContent : '').trim(); })
			.filter((t) => t));   // a box with no row label cannot be found again by name
		const active = () => page.evaluate(() => {
			const e = document.activeElement, l = e && e.closest && e.closest('label');
			return { tag: e ? e.tagName : null, inPopup: !!(e && e.closest && e.closest('#lpn_popup')),
				label: l ? (l.querySelector('.lpn-gname') || l.firstChild).textContent.trim() : '', type: e ? e.type : '' };
		});
		// every tab stop of the box in DOM order, named tag|row label, with `#n` on the nth repeat of
		// a name; and the index of the one that has focus
		const stops = () => page.evaluate(() => {
			const els = Array.from(document.querySelectorAll('#lpn_popup input, #lpn_popup select, #lpn_popup textarea, #lpn_popup button, #lpn_popup a[href], #lpn_popup [tabindex]'))
				.filter((e) => !e.disabled && e.tabIndex >= 0 && e.type !== 'hidden' && (e.offsetParent || e.getClientRects().length));
			const seen = {};
			const x = els.map((e) => {
				const l = e.closest('label'), n = e.tagName + '|' + (l ? (l.querySelector('.lpn-gname') || l.firstChild).textContent.trim() : (e.id || e.title || ''));
				seen[n] = (seen[n] || 0) + 1;
				return seen[n] > 1 ? n + '#' + seen[n] : n;
			});
			return { x, at: els.indexOf(document.activeElement) };
		});
		// A number box shows a committed number in its own format (a length to two places), so a
		// number is compared as a number.
		const sameValue = (got, typed) => got === typed || (/^-?\d+(\.\d+)?$/.test(typed) && got !== null && got !== '' && Number(got) === Number(typed));
		const valueOf = (label) => page.evaluate((t) => {
			const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => (x.querySelector('.lpn-gname') || x.firstChild).textContent.trim() === t)[0];
			return l ? l.querySelector('input').value : null;
		}, label);
		const focusRow = async (label) => {
			await page.evaluate((t) => {
				const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => (x.querySelector('.lpn-gname') || x.firstChild).textContent.trim() === t)[0];
				const i = l.querySelector('input'); i.focus(); i.select();
			}, label);
		};
		const typeFor = async (label, n) => {
			// From and To take a node ID and refuse one that does not exist (endField), so they are typed a real Net1 node
			if (label === 'From') { return '31'; }
			if (label === 'To') { return '32'; }
			const t = (await page.evaluate((l) => {
				const x = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((y) => (y.querySelector('.lpn-gname') || y.firstChild).textContent.trim() === l)[0];
				return x.querySelector('input').type;
			}, label));
			return t === 'number' ? String(100 + n) : 'abc' + n;
		};

		const clickAt = async (sel, nth) => {
			const at = await page.evaluate(([s, k]) => {
				if (/link-hit/.test(s)) {
					const el = Array.from(document.querySelectorAll(s))[k], m = el.getPointAtLength(el.getTotalLength() / 2), q = el.getScreenCTM();
					return { x: q.a * m.x + q.c * m.y + q.e, y: q.b * m.x + q.d * m.y + q.f };
				}
				const ns = Array.from(document.querySelectorAll(s)).filter((c) => c.getBoundingClientRect().width > 0);
				const r = ns[k].getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			}, [sel, nth]);
			await page.mouse.click(at.x, at.y);
			await a.settle(900);
		};

		for (const kind of ['junction', 'pipe']) {
			console.log('--- ' + kind + ' ---');
			if (kind === 'junction') { await clickAt('#lpn_canvas .lpn-symbols circle:not(.lpn-node-hit)', 0); }
			else { await page.click('#lpn_popup_close'); await a.settle(300); await clickAt('#lpn_canvas .lpn-link-hit', 3); }
			const labels = await rows();
			ok(kind + ': the box is on a ' + kind, await page.evaluate((k) => { const f = document.getElementById('lpn_popup_fields'); return k === 'pipe' ? /Length|Diameter/i.test(f.textContent) && !/Demand/i.test(f.textContent) : /Elevation/.test(f.textContent); }, kind));
			ok(kind + ': Properties has at least 5 editable boxes', labels.length >= 5, labels.join(' | '));
			const first = labels.length > 5 ? labels[0] : labels[0];
			const where = async () => { const st = await stops(), ac = await active(); return { x: st.x, at: st.at, name: st.x[st.at], ac }; };
			// forward: type + Tab, five typed boxes in a row; each Tab lands on the next tab stop,
			// and where that is a typed box the next round types straight into it
			await focusRow(labels[0]);
			for (let k = 0; k < 5; k++) {
				const w = await where(), cur = labels[k], ac0 = w.ac;
				if (ac0.label !== cur || ac0.tag !== 'INPUT') { await focusRow(cur); }
				const w2 = await where();
				const expect = w2.x[w2.at + 1];
				const val = await typeFor(cur, k);
				await page.keyboard.type(val);
				await page.keyboard.press('Tab');
				await a.settle(150);
				const ac = await active(), landed = (await where()).name;
				ok(kind + ' Tab ' + (k + 1) + ': ' + cur + ' -> ' + expect, ac.inPopup && landed === expect, landed + ' ' + JSON.stringify(ac));
				const committed = await valueOf(cur);
				ok(kind + ' Tab ' + (k + 1) + ': the typed value was committed', sameValue(committed, val), cur + '=' + committed);
				if (ac.type === 'text' || ac.type === 'number') {
					const nv = await typeFor(ac.label, 40 + k);
					await page.keyboard.type(nv);
					await a.settle(80);
					ok(kind + ' Tab ' + (k + 1) + ': typing goes into the field Tab landed on', (await valueOf(ac.label)) === nv, ac.label + '=' + (await valueOf(ac.label)));
					await page.keyboard.press('Shift+Tab');
					await a.settle(150);
					const back = await active();
					ok(kind + ' Shift+Tab goes back to ' + cur, back.label === cur, JSON.stringify(back));
				}
			}
			// untouched field still tabs normally
			{
				const w = await where();
				await page.keyboard.press('Tab');
				await a.settle(100);
				const ac = await active(), landed = (await where()).name;
				ok(kind + ' untouched Tab goes to ' + w.x[w.at + 1], ac.inPopup && landed === w.x[w.at + 1], w.name + ' -> ' + landed);
			}
			// the multi-line Description: type, Tab out, Shift+Tab out; the text is kept and focus
			// lands on its neighbour each way
			{
				const desc = () => page.evaluate(() => { const t = document.querySelector('#lpn_popup_fields textarea'); return t ? t.value : null; });
				const focusDesc = () => page.evaluate(() => { const t = document.querySelector('#lpn_popup_fields textarea'); t.focus(); t.setSelectionRange(t.value.length, t.value.length); });
				ok(kind + ': Description is a multi-line box in the tab order', (await stops()).x.indexOf('TEXTAREA|Description') >= 0, (await stops()).x.slice(0, 4).join(', '));
				for (const [key, step, word] of [['Tab', 1, 'Tab'], ['Shift+Tab', -1, 'Shift+Tab']]) {
					await focusDesc();
					const w = await where(), expect = w.x[w.at + step], before = await desc();
					await page.keyboard.type(word === 'Tab' ? 'first' : ' second');
					await page.keyboard.press(key);
					await a.settle(250);
					const landed = (await where()).name, ac = await active();
					ok(kind + ' ' + word + ' out of an edited Description goes to ' + expect, ac.inPopup && landed === expect, w.name + ' -> ' + landed);
					ok(kind + ' ' + word + ' out of Description keeps what was typed', (await desc()) === before + (word === 'Tab' ? 'first' : ' second'), JSON.stringify(await desc()));
				}
				// typed into, then a click on a typed box: focus stays on the clicked box
				await focusDesc();
				await page.keyboard.type(' third');
				const tgt = (await rows())[1];
				const box = await page.evaluate((t) => {
					const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => (x.querySelector('.lpn-gname') || x.firstChild).textContent.trim() === t)[0];
					const r = l.querySelector('input').getBoundingClientRect();
					return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
				}, tgt);
				await page.mouse.click(box.x, box.y);
				await a.settle(250);
				const ac = await active();
				ok(kind + ' a click from an edited Description onto ' + tgt + ' leaves focus there', ac.inPopup && ac.label === tgt, JSON.stringify(ac));
				ok(kind + ' ...and the Description kept its text', /first second third$/.test(await desc()), JSON.stringify(await desc()));
			}
			// a click elsewhere in the box is not disturbed
			{
				const now = await rows();
				await focusRow(now[0]);
				await page.keyboard.type(await typeFor(now[0], 7));
				const tgt = now[2];
				const box = await page.evaluate((t) => {
					const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => (x.querySelector('.lpn-gname') || x.firstChild).textContent.trim() === t)[0];
					const r = l.querySelector('input').getBoundingClientRect();
					return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
				}, tgt);
				await page.mouse.click(box.x, box.y);
				await a.settle(200);
				const ac = await active();
				ok(kind + ' click on another field leaves focus there', ac.inPopup && ac.label === tgt, JSON.stringify(ac));
			}
			// Enter commits and the box keeps its value
			{
				const now = await rows();
				await focusRow(now[1]);
				const val = await typeFor(now[1], 3);
				await page.keyboard.type(val);
				await page.keyboard.press('Enter');
				await a.settle(200);
				const v = await valueOf(now[1]);
				ok(kind + ' Enter commits the typed value', sameValue(v, val), now[1] + '=' + v);
			}
		}

		console.log('--- undo restores a Tabbed edit ---');
		await page.click('#lpn_popup_close'); await a.settle(300);
		await clickAt('#lpn_canvas .lpn-symbols circle:not(.lpn-node-hit)', 0);
		{
			const now = await rows(), elev = (await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields label')).map((l) => (l.querySelector('.lpn-gname') || l.firstChild).textContent.trim()))).filter((t) => /^Elevation/.test(t))[0];
			const before = await valueOf(elev);
			await focusRow(elev);
			await page.keyboard.type('777');
			await page.keyboard.press('Tab');
			await a.settle(200);
			ok('Elevation committed by Tab', (await valueOf(elev)) === '777', await valueOf(elev));
			await page.evaluate(() => document.activeElement && document.activeElement.blur());
			await page.keyboard.press('Control+z');
			await a.settle(400);
			const after = await valueOf(elev);
			ok('Ctrl+Z restores the previous Elevation', after === before, before + ' -> ' + after);
		}
		ok('no uncaught page errors', errors.length === 0, errors.join(' | '));
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + checks + ' checks, ' + failures + ' failed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
