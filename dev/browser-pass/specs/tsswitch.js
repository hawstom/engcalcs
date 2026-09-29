// §26b — the Time series tab across a project switch (2026-09-29).
//
// Tom: "Switching to the 1-step and back blanks the Time Series graph", and "switching projects
// does not update the Time Series tab. I have to switch to other bottom pane tabs." Two defects on
// one gesture, and neither shows on the FIRST return: that one re-solves, because nothing has been
// kept yet. From the second return on, Task 680's kept solve means no solve is scheduled, and the
// run -- which was not kept -- was never asked for again. So this walks the switch three times.

const { Session } = require('../lib/session');

exports.title = '26b. Time series across a project switch';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		const read = () => a.page.evaluate(() => {
			const note = document.getElementById('lpn_ts_note'), chart = document.getElementById('lpn_ts_chart');
			return { frames: EngCalcs.lpnTimeRunFrames().length, note: note ? note.textContent : '',
				lines: chart ? chart.querySelectorAll('polyline,path').length : -1 };
		});
		const go = (re) => a.page.evaluate((re) => {
			const hit = [...document.querySelectorAll('#lpn_tabs .lpn-tab')]
				.find(e => new RegExp(re).test((e.querySelector('.lpn-tab-name') || {}).textContent));
			(hit.querySelector('.lpn-tab-name') || hit).click();
		}, re);

		await a.openExampleCard('EPANET Net3');
		await a.toolbarClick('Bottom panel');
		await a.settle(500);
		await a.page.click('#lpn_pane_tab_timeseries');
		await a.settle(2000);
		const first = await read();
		report.ok(first.frames > 1 && first.lines > 0, 'Net3 opens with a run and lines on the Time series tab',
			JSON.stringify(first));

		await a.newProject('us');
		await a.settle(1500);
		const oneStep = await a.lang('lpn_time_no_period');
		for (let round = 1; round <= 3; round++) {
			await go('Net3');
			await a.page.waitForTimeout(2500);
			const back = await read();
			report.ok(back.frames === first.frames && back.lines === first.lines,
				`return ${round} to Net3: the run and its graph are there without a Calculate`, JSON.stringify(back));
			await go('Project2');
			await a.page.waitForTimeout(1500);
			const away = await read();
			report.ok(away.lines === 0 && away.note === oneStep,
				`switch ${round} to the one-step project: the tab says so, not Net3's graph`, JSON.stringify(away));
		}
	} finally {
		await a.close();
	}

	// **AND ON OPEN** (Tom, 2026-09-29: "Time Series graphs are still blank on open. They only
	// appear when you switch to them from another bottom pane tab."). Every way a project arrives
	// with Time series already the tab on show: the gallery, a reload, and File > Open.
	const fs = require('fs'), path = require('path');
	const NET3 = fs.readFileSync(path.join(__dirname, '../../../examples/Net3.lwn'), 'utf8');
	const readTs = (s) => s.page.evaluate(() => {
		const note = document.getElementById('lpn_ts_note'), chart = document.getElementById('lpn_ts_chart');
		return { frames: EngCalcs.lpnTimeRunFrames().length, note: note ? note.textContent : '',
			lines: chart ? chart.querySelectorAll('polyline,path').length : -1 };
	});
	// Polled rather than slept on: the run lands when it lands, and the claim is that the graph
	// follows it with no gesture, not that it is there by some fixed moment.
	const waitLines = async (s, what) => {
		let r;
		for (let i = 0; i < 30; i++) {
			r = await readTs(s);
			if (r.frames > 1 && r.lines > 0) { break; }
			await s.page.waitForTimeout(300);
		}
		report.ok(r.frames > 1 && r.lines > 0, what, JSON.stringify(r));
	};
	const b = await Session.open(browser, 'B');
	try {
		await b.goto();
		await b.dismissGallery();
		await b.toolbarClick('Bottom panel');
		await b.settle(500);
		await b.page.click('#lpn_pane_tab_timeseries');
		await b.settle(500);
		await b.newProject('us');
		await b.settle(800);
		await b.menuClick('Open example…');
		await b.settle(500);
		await b.openExampleCard('EPANET Net3');
		await waitLines(b, 'gallery: Net3 opened with Time series on show draws its graph, no tab switch');

		await b.reload();
		await waitLines(b, 'reload: Net3 with Time series on show draws its graph after the page loads');

		report.eq(b.errors.length, 0, 'no uncaught JavaScript');
		if (b.errors.length) { console.log(b.errors.join('\n')); }
	} finally {
		await b.close();
	}
	// File > Open in a fresh session with Time series already on show, as a visitor with the tab
	// left there would meet it. `before` runs in the page first, for the case that holds the run.
	const openFresh = async (name, text, before) => {
		const c = await Session.open(browser, name);
		await c.goto();
		await c.dismissGallery();
		await c.toolbarClick('Bottom panel');
		await c.settle(500);
		await c.page.click('#lpn_pane_tab_timeseries');
		await c.settle(500);
		if (before) { await c.page.evaluate(before); }
		await c.writeFile(name + '.lwn', text);
		await c.queuePick(name + '.lwn');
		await c.menuClick('Open…');
		await c.settle(300);
		await c.answerTrainingPanel();   // the first file gesture on a fresh profile asks first
		await c.settle(2500);
		report.ok(await c.nodeCount() > 90, `File > Open put ${name} on the map`, String(await c.nodeCount()));
		return c;
	};
	const done = async (c) => {
		report.eq(c.errors.length, 0, 'no uncaught JavaScript');
		if (c.errors.length) { console.log(c.errors.join('\n')); }
		await c.close();
	};
	let c = await openFresh('Net3-open', NET3);
	try { await waitLines(c, 'File > Open: Net3 with Time series on show draws its graph'); }
	finally { await done(c); }

	// **THE WAITING SENTENCE IS TRUE IN BOTH STATES OF THE SWITCH** (Tom, 2026-09-29, on a
	// sentence naming a Calculate button that Recalculate automatically hides: "I know. That
	// should be fixed."). OFF: opened with no run, the Calculate button shows and the sentence
	// names it. ON: the run is held in flight, and the sentence says it is running.
	const calcShown = (s) => s.page.evaluate(() => [...document.querySelectorAll('#lpn_toolbar button')]
		.some(b => /Calculate/.test(b.getAttribute('aria-label') || b.textContent) && b.offsetParent !== null));
	const off = JSON.parse(NET3);
	off.settings.autoRun = false;
	c = await openFresh('Net3-off', JSON.stringify(off));
	try {
		const r = await readTs(c);
		report.ok(r.frames === 0 && r.note === await c.lang('lpn_ts_no_frames') && await calcShown(c),
			'Recalculate OFF, no run yet: the tab names Calculate, and Calculate is on the toolbar', JSON.stringify(r));
	} finally { await done(c); }

	const on = JSON.parse(NET3);
	on.settings.autoRun = true;
	c = await openFresh('Net3-on', JSON.stringify(on), () => {
		const real = EngCalcs.lpnEpanetRun;
		window.__tsHeld = [];
		EngCalcs.lpnEpanetRun = (m, o) => new Promise(res => window.__tsHeld.push(() => res(real(m, o))));
	});
	try {
		const r = await readTs(c);
		report.ok(r.frames === 0 && r.note === await c.lang('lpn_time_running') && !(await calcShown(c)),
			'Recalculate ON, run in flight: the tab says it is running, and names no hidden button', JSON.stringify(r));
		await c.page.evaluate(() => { window.__tsHeld.splice(0).forEach(f => f()); });
		await waitLines(c, '...and the graph draws itself when that run lands');
	} finally { await done(c); }
};
