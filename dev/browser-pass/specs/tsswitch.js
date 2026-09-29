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
};
