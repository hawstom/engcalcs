// The Frequency tab (ROADMAP Task 600) in a real Chromium: EPA's Net1 (the rule-based-controls
// card), the tab pressed as a reader presses it, and the drawn curve read back off the SVG. dev/lpn-spike/frequency-plot-harness.js
// checks the numbers against an independent count; this checks that the real page draws them at a
// real size, and that the curve follows the transport.

const { Session } = require('../lib/session');

exports.title = 'Frequency plot tab';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		const read = () => a.page.evaluate(() => {
			const note = document.getElementById('lpn_freq_note'), chart = document.getElementById('lpn_freq_chart'),
				svg = chart ? chart.querySelector('svg') : null, r = svg ? svg.getBoundingClientRect() : null,
				line = chart ? chart.querySelector('polyline.lpn-freq-line') : null;
			return {
				frames: EngCalcs.lpnTimeRunFrames().length, note: note ? note.textContent : '',
				w: r ? Math.round(r.width) : 0, h: r ? Math.round(r.height) : 0,
				dots: chart ? chart.querySelectorAll('circle.lpn-ts-dot').length : -1,
				points: line ? line.getAttribute('points') : '',
				text: chart ? chart.textContent : ''
			};
		});
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.toolbarClick('Bottom panel');
		await a.settle(500);
		await a.page.click('#lpn_pane_tab_frequency');
		await a.settle(2500);
		const first = await read();
		const percent = await a.lang('lpn_freq_axis_percent');
		// Net1's nine junctions; a tank or reservoir among them would make it eleven.
		report.ok(first.dots === 9 && first.points.split(' ').length === 9,
			'Net1 draws one point per junction (9) on the Frequency tab', JSON.stringify({ dots: first.dots, note: first.note }));
		report.ok(first.w > 200 && first.h > 80, `the chart has a real size: ${first.w} x ${first.h}`);
		report.ok(first.text.indexOf(percent) >= 0, `the percent axis is titled "${percent}"`);

		// Move the transport the way the scrubber does, and the curve must move with it.
		const at = await a.page.evaluate(() => {
			const f = EngCalcs.lpnTimeRunFrames();
			EngCalcs.lpnTimeGoTo(f[Math.floor(f.length / 2)].t);
			return EngCalcs.lpnFormatTime(f[Math.floor(f.length / 2)].t);
		});
		await a.settle(800);
		const later = await read();
		report.ok(later.points !== first.points && later.note.indexOf(at) >= 0,
			`at ${at} the curve is redrawn and the summary names the time`, later.note);
		report.ok(a.errors.length === 0, 'no uncaught page errors', a.errors.join('\n'));
	} finally {
		await a.close();
	}
};
