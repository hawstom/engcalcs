// UP AND DOWN WALK THE PROPERTIES BOX'S FIELDS, AS THEY DO IN EPANET'S PROPERTY EDITOR.
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/property-arrow-key-harness.js
//
// The data entry clerk's wish 3 (dev/agents/data-entry-clerk/wishlist.md). Tab already reached every
// field; Up and Down now do too, in Tab's order, and must (1) commit the field being left through
// the same `change` a Tab or a click takes, (2) land on the next editable field with its contents
// selected, (3) leave a <select>, a Shift/Alt/Ctrl chord and Tab itself alone. Real headless
// Chromium, because focus, blur-fires-change and select() are browser behaviour a stub only fakes.

const path = require('path');
const { Session } = require('../browser-pass/lib/session');
const env = require('../browser-pass/lib/env');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// Where focus is, as a short description: the label text around it, so a failure names the row.
function where(page) {
	return page.evaluate(() => {
		const el = document.activeElement;
		if (!el || !el.closest || !el.closest('#lpn_popup')) { return { in: false, tag: el && el.tagName }; }
		const lab = el.closest('label') || el.parentNode;
		return {
			in: true, tag: el.tagName, type: el.type, value: el.value,
			text: (lab.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30),
			selected: (el.type === 'text' || el.type === 'number' || el.type === 'search') ?
				(el.selectionStart === 0 && el.selectionEnd === el.value.length) || el.type === 'number' : null
		};
	});
}
// The popup's walkable fields in DOM order, as the handler sees them.
function fieldList(page) {
	return page.evaluate(() => Array.prototype.filter.call(
		document.querySelectorAll('#lpn_popup input, #lpn_popup select'),
		(el) => el.tagName !== 'SELECT' && !el.disabled && !el.readOnly && el.tabIndex >= 0 && el.type !== 'hidden' &&
			(el.offsetParent || el.getClientRects().length)
	).map((el) => ({ tag: el.tagName, type: el.type, val: el.value,
		text: ((el.closest('label') || el.parentNode).textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30) })));
}
async function focusNth(page, n) {
	await page.evaluate((k) => {
		const l = Array.prototype.filter.call(document.querySelectorAll('#lpn_popup input, #lpn_popup select'),
			(el) => el.tagName !== 'SELECT' && !el.disabled && !el.readOnly && el.tabIndex >= 0 && el.type !== 'hidden' &&
				(el.offsetParent || el.getClientRects().length));
		l[k].focus();
		if (l[k].select) { try { l[k].select(); } catch (e) { /* a select */ } }
	}, n);
}
// The box's own x: Escape is guarded by the pointer being over the box (Tom, 2026-09-19).
async function closeBox(page) { await page.click('#lpn_popup_close'); }
async function popupOpen(page) {
	return page.evaluate(() => { const p = document.getElementById('lpn_popup'); return p && p.style.display !== 'none'; });
}

async function main() {
	let playwright;
	try { playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (err) { console.log('playwright-core is not installed -- run: cd dev/browser-pass && npm install'); process.exit(1); }
	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
		await a.goto();
		await a.dismissGallery();
		await a.newProject();
		await a.settle(500);
		const r = await page.evaluate(() => {
			const b = document.getElementById('lpn_canvas').getBoundingClientRect();
			return { x: b.x, y: b.y, w: b.width, h: b.height };
		});
		const A = { x: r.x + r.w * 0.35, y: r.y + r.h * 0.5 }, B = { x: r.x + r.w * 0.6, y: r.y + r.h * 0.5 };
		await a.toolbarClick('Junction');
		await page.mouse.click(A.x, A.y); await a.settle(250);
		await page.mouse.click(B.x, B.y); await a.settle(250);
		await a.toolbarClick('Pipe');
		await page.mouse.click(A.x, A.y); await a.settle(250);
		await page.mouse.click(B.x, B.y); await a.settle(250);
		await page.keyboard.press('Escape');
		await a.toolbarClick('Select');
		await a.settle(250);
		console.log('nodes+links drawn: ' + await a.nodeCount());

		console.log('\n=== a junction ===');
		await page.mouse.click(A.x, A.y); await a.settle(400);
		ok('the junction popup opens', await popupOpen(page));
		let list = await fieldList(page);
		console.log('  fields: ' + list.map((f) => f.text + '[' + f.type + ']').join(' | '));
		ok('the junction has several walkable fields', list.length >= 4, String(list.length));

		// Down from the first field lands on the second, contents selected.
		await focusNth(page, 0);
		await page.keyboard.press('ArrowDown');
		let w = await where(page);
		ok('Down from the first field lands on the second', w.in && w.text === list[1].text, JSON.stringify(w));
		ok('...with its contents selected', w.selected === true, JSON.stringify(w));
		await page.keyboard.press('ArrowUp');
		w = await where(page);
		ok('Up goes back to the first', w.in && w.text === list[0].text, JSON.stringify(w));
		await page.keyboard.press('ArrowUp');
		w = await where(page);
		ok('Up on the first field stays put (no wrap)', w.in && w.text === list[0].text, JSON.stringify(w));

		// Walk all the way down and check each landing is the Tab neighbour.
		let okWalk = true, seen = [];
		await focusNth(page, 0);
		for (let i = 1; i < list.length; i++) {
			await page.keyboard.press('ArrowDown');
			const x = await where(page);
			seen.push(x.text);
			if (!(x.in && x.text === list[i].text)) { okWalk = false; }
		}
		ok('Down walks every field in order', okWalk, seen.join(' | '));
		await page.keyboard.press('ArrowDown');
		w = await where(page);
		ok('Down on the last field stays put', w.in && w.text === list[list.length - 1].text, JSON.stringify(w));

		// Tab agrees with Down about the order.
		await focusNth(page, 0);
		await page.keyboard.press('Tab');
		const viaTab = await where(page);
		await focusNth(page, 0);
		await page.keyboard.press('ArrowDown');
		const viaDown = await where(page);
		ok('Tab and Down land on the same field from the first', viaTab.text === viaDown.text, viaTab.text + ' vs ' + viaDown.text);

		// Edit the elevation and leave with Down: committed.
		const elevIdx = list.findIndex((f) => /^Elevation/.test(f.text));
		ok('there is an Elevation field', elevIdx >= 0);
		await focusNth(page, elevIdx);
		await page.keyboard.type('123.5');
		await page.keyboard.press('ArrowDown');
		await a.settle(200);
		await closeBox(page); await a.settle(150);
		await page.mouse.click(A.x, A.y); await a.settle(400);
		list = await fieldList(page);
		ok('an elevation typed then left with Down is committed (shows on reopen)',
			list[elevIdx] && +list[elevIdx].val === 123.5, list[elevIdx] && list[elevIdx].val);
		// ...and leaving upward commits too.
		await focusNth(page, elevIdx);
		await page.keyboard.type('7.25');
		await page.keyboard.press('ArrowUp');
		await a.settle(200);
		w = await where(page);
		ok('Up after typing lands on the previous field', w.in && w.text === list[elevIdx - 1].text, JSON.stringify(w));
		await closeBox(page); await a.settle(150);
		await page.mouse.click(A.x, A.y); await a.settle(400);
		list = await fieldList(page);
		ok('...and the value typed before Up is committed', +list[elevIdx].val === 7.25, list[elevIdx].val);

		// Number stepping is not what Up does: the value is unchanged by the key.
		await focusNth(page, elevIdx);
		await page.keyboard.press('ArrowUp'); await a.settle(100);
		await closeBox(page); await a.settle(150);
		await page.mouse.click(A.x, A.y); await a.settle(400);
		list = await fieldList(page);
		ok('Up never steps a number field (7.25 stays 7.25)', +list[elevIdx].val === 7.25, list[elevIdx].val);

		// Chords belong to the browser.
		await focusNth(page, 1);
		const ev = await page.evaluate(() => {
			const el = document.activeElement;
			const e = new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true, cancelable: true });
			el.dispatchEvent(e);
			return { prevented: e.defaultPrevented, same: document.activeElement === el };
		});
		ok('Shift+Down is not taken', !ev.prevented && ev.same, JSON.stringify(ev));
		const ev2 = await page.evaluate(() => {
			const el = document.activeElement;
			const e = new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true, bubbles: true, cancelable: true });
			el.dispatchEvent(e);
			return { prevented: e.defaultPrevented, same: document.activeElement === el };
		});
		ok('Alt+Down is not taken', !ev2.prevented && ev2.same, JSON.stringify(ev2));
		await closeBox(page); await a.settle(150);

		console.log('\n=== a pipe ===');
		await page.mouse.click((A.x + B.x) / 2, A.y); await a.settle(400);
		ok('the pipe popup opens', await popupOpen(page));
		list = await fieldList(page);
		console.log('  fields: ' + list.map((f) => f.text + '[' + f.type + ']').join(' | '));
		const selIdx = list.findIndex((f) => f.tag === 'SELECT');
		const dia = list.findIndex((f) => /^Diameter/.test(f.text));
		ok('the pipe has a Diameter field', dia >= 0);
		await focusNth(page, dia);
		await page.keyboard.press('Control+a');
		await page.keyboard.type('333');
		await page.keyboard.press('ArrowDown');
		await a.settle(300);
		w = await where(page);
		ok('after a diameter edit (which re-renders the box) Down lands on the next field',
			w.in && w.text === list[dia + 1].text, JSON.stringify(w) + ' wanted ' + list[dia + 1].text);
		list = await fieldList(page);
		ok('the diameter was committed', +list[dia].val === 333, list[dia].val);
		await page.keyboard.press('ArrowUp');
		w = await where(page);
		ok('Up returns to Diameter', w.in && w.text === list[dia].text, JSON.stringify(w));

		await closeBox(page); await a.settle(150);
		await page.mouse.click(A.x, A.y); await a.settle(400);
		// A select keeps its arrows (the junction's pattern chooser): the choice changes, focus does not move.
		const sel = await page.evaluate(() => {
			const s = document.querySelector('#lpn_popup select');
			if (!s) { return null; }
			const all = Array.prototype.slice.call(document.querySelectorAll('#lpn_popup input, #lpn_popup select'));
			return { opts: s.options.length, prev: all[all.indexOf(s) - 1].value, next: all[all.indexOf(s) + 1].value };
		});
		ok('the junction popup has a <select> to test', !!sel);
		if (sel) {
			await page.evaluate(() => document.querySelector('#lpn_popup select').focus());
			const before = await page.evaluate(() => document.activeElement.selectedIndex);
			await page.keyboard.press('ArrowDown'); await a.settle(100);
			const after = await page.evaluate(() => ({ i: document.activeElement.selectedIndex, tag: document.activeElement.tagName }));
			ok('Down in a <select> is left to it: focus stays (and the choice moves when there is one)', after.tag === 'SELECT' && (sel.opts < 2 || after.i !== before),
				JSON.stringify({ before, after }));
		} else { console.log('  (no multi-choice <select> on this popup)'); }
		// The walk steps OVER a select instead of stopping on it (a stop would trap the walker).
		const over = await page.evaluate(() => {
			const s = document.querySelector('#lpn_popup select');
			if (!s) { return null; }
			const ins = Array.prototype.filter.call(document.querySelectorAll('#lpn_popup input'),
				(el) => !el.readOnly && !el.disabled && el.tabIndex >= 0 && el.type !== 'hidden');
			let before = null;
			ins.forEach((el) => { if (el.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING) { before = el; } });
			if (!before) { return null; }
			before.focus();
			return { next: ins[ins.indexOf(before) + 1] ? true : false };
		});
		if (over && over.next) {
			await page.keyboard.press('ArrowDown'); await a.settle(100);
			w = await where(page);
			ok('Down from the field before a <select> steps over it to the next input', w.in && w.tag === 'INPUT', JSON.stringify(w));
		}
		ok('no page errors', a.errors.length === 0, a.errors.join('\n'));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(`\n${fails === 0 ? 'ALL GREEN' : fails + ' FAILURE(S)'}`);
	process.exit(fails === 0 ? 0 : 1);
}
main().catch((err) => { console.error(err); env.stopServer(); process.exit(1); });
