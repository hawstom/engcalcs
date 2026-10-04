// The Analyze dialogs across a clock change (pre-reviewer wish, 2026-10-04).
//
// THE RULE (dev/lpn-rulings.md, snapshot; page code `dsTimeLines`): on an extended-period project
// every Analyze result names the time step it was computed at; when the clock then moves, the result
// STAYS ON SCREEN (a snapshot is never hidden or deleted) and gains a warning line saying it was
// computed at one time and the clock is now at another. Origin: on Net3 a Find made at 0:00 still
// read 0.51 with the clock at 6:00, where the truth is 3.10, and nothing said so.
//
// The rows are ENUMERATED from the Water > Analyze fly-out, never listed here, so a new analysis is
// either covered or fails this spec by name. A row's box is whichever `*_box` element it opens, and
// its run buttons are every `.lpn-ff-run` in it (Demand scaling has two: Run and Find).

const { Session } = require('../lib/session');

exports.title = 'Analyze dialogs across a clock change';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		const wired = await a.page.evaluate(() => !!(window.EngCalcs && window.EngCalcs.lpnTimeRun));
		if (!wired) { report.skip('the clock is on the page', 'js/lpn-time.js is not loaded'); return; }

		const opened = await a.page.evaluate(async () => {
			const cards = [...document.querySelectorAll('#lpn_examples_pane .lpn-example-card')];
			const title = (c) => ((c.querySelector('.lpn-example-title') || c).textContent || '').trim();
			const card = cards.find(c => title(c) === 'EPANET Net3');
			if (!card) { return false; }
			card.click();
			return true;
		});
		report.ok(opened, 'the examples gallery offers Net3');
		await a.settle(1500);

		const atTpl = await a.lang('lpn_analyze_at_time');
		const movedTpl = await a.lang('lpn_analyze_time_moved');
		const [atPre, atPost] = atTpl.split('{time}');
		const movedPre = movedTpl.split('{time}')[0];

		// ---- enumerate the Analyze fly-out ----
		const analyzeLabel = await a.lang('lpn_analyze_menu');
		async function analyzeRows() {
			await a.openMenu('project');
			await a._clickRow('#lpn_menu_list', analyzeLabel);
			await a.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
			const rows = await a.page.$$eval('#lpn_menu_list2 button.lpn-menu-row',
				(els) => els.map(e => e.textContent.trim()));
			await a.closeMenu();
			return rows;
		}
		const rows = await analyzeRows();
		report.ok(rows.length >= 3, 'the Analyze fly-out holds its rows', JSON.stringify(rows));

		const visibleBoxes = () => a.page.evaluate(() =>
			[...document.querySelectorAll('[id$="_box"]')]
				.filter(e => e.style.display && e.style.display !== 'none').map(e => e.id));
		const closeBoxes = () => a.page.evaluate(() => {
			[...document.querySelectorAll('[id$="_box"]')].forEach(e => {
				if (e.style.display && e.style.display !== 'none') {
					const x = e.querySelector('[id$="_close"], .lpn-box-close, button[aria-label]');
					if (x) { x.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
				}
			});
		});
		const setClock = async (idx) => {
			await a.page.evaluate((i) => {
				const s = document.getElementById('lpn_time_step');
				s.selectedIndex = i;
				s.dispatchEvent(new Event('change', { bubbles: true }));
			}, idx);
			await a.settle(500);
		};
		const clockText = () => a.page.evaluate(() => {
			const s = document.getElementById('lpn_time_step');
			return s.options[s.selectedIndex].textContent.trim();
		});
		const noteState = (boxId) => a.page.evaluate(([id, atPre, atPost, movedPre]) => {
			const box = document.getElementById(id);
			const notes = [...box.querySelectorAll('.lpn-ff-note')].map(e => e.textContent.trim());
			const at = notes.filter(t => t.startsWith(atPre.trim()) && t.endsWith(atPost.trim()));
			const stale = [...box.querySelectorAll('.lpn-ds-stale')].map(e => e.textContent.trim());
			const tables = box.querySelectorAll('table').length;
			return { at, stale, tables, text: box.textContent.length };
		}, [boxId, atPre, atPost, movedPre]);

		for (const rowLabel of rows) {
			await setClock(0);
			await closeBoxes();
			const before = await visibleBoxes();
			await a.openMenu('project');
			await a._clickRow('#lpn_menu_list', analyzeLabel);
			await a.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
			await a._clickRow('#lpn_menu_list2', rowLabel);
			await a.settle(500);
			const now = await visibleBoxes();
			const fresh = now.filter(i => !before.includes(i));
			report.eq(fresh.length, 1, `"${rowLabel}" opens one dialog`, JSON.stringify(fresh));
			if (fresh.length !== 1) { continue; }
			const box = fresh[0];

			const runs = await a.page.evaluate((id) =>
				[...document.getElementById(id).querySelectorAll('button.lpn-ff-run')].length, box);
			report.ok(runs >= 1, `"${rowLabel}": the dialog has run button(s)`, String(runs));

			for (let r = 0; r < runs; r++) {
				const what = `"${rowLabel}" button ${r + 1} of ${runs}`;
				await setClock(0);
				const t0 = await clockText();
				// Press button r (the box is rebuilt after a run, so index afresh each time).
				await a.page.evaluate(([id, r]) => {
					const b = document.getElementById(id).querySelectorAll('button.lpn-ff-run')[r];
					b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
				}, [box, r]);
				// Wait for the run to finish: a note naming the time step appears.
				const done = await a.waitFor(async () => {
					const s = await noteState(box);
					return s.at.length >= (r + 1) ? s : null;
				}, 'result', 120000);
				report.ok(!!done, `${what}: a run at ${t0} names its time step`,
					done ? done.at.join(' | ') : 'no result within 120 s');
				if (!done) { continue; }
				const fresh0 = await noteState(box);
				report.eq(fresh0.stale.length, 0, `${what}: no stale warning while the clock has not moved`);

				await setClock(6);
				const t6 = await clockText();
				report.ok(t6 !== t0, `${what}: the clock moved`, `${t0} -> ${t6}`);
				const moved = await noteState(box);
				report.ok(moved.at.length >= fresh0.at.length && moved.text >= fresh0.text * 0.8,
					`${what}: the result is still on screen (a snapshot, never hidden)`,
					`notes ${fresh0.at.length}->${moved.at.length}, text ${fresh0.text}->${moved.text}`);
				report.ok(moved.stale.length >= 1 && moved.stale.every(t => t.startsWith(movedPre.trim())),
					`${what}: and it is marked stale`, JSON.stringify(moved.stale));
				report.ok(moved.stale.some(t => t.indexOf(t0) >= 0 && t.indexOf(t6) >= 0),
					`${what}: the warning names both ${t0} and ${t6}`, JSON.stringify(moved.stale));

				await setClock(0);
				const back = await noteState(box);
				report.eq(back.stale.length, 0, `${what}: with the clock back at ${t0} the warning goes`);
			}
			await closeBoxes();
		}
		report.eq(a.errors.length, 0, 'no uncaught page errors', a.errors.join(' | ').slice(0, 300));
	} finally {
		await a.context.close();
	}
};
