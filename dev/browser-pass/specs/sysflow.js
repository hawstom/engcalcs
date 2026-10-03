// The System flow tab (ROADMAP Task 600) in a real Chromium: EPA's Net1, the tab pressed as a reader
// presses it, and the two drawn lines read back off the SVG. dev/lpn-spike/system-flow-harness.js
// checks the balance against the solved link flows; this checks that the real page draws it at a
// real size, with the pump-off afternoon of EPANET's own example figure.

const { Session } = require('../lib/session');

exports.title = 'System flow tab';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.toolbarClick('Bottom panel');
		await a.settle(500);
		await a.page.click('#lpn_pane_tab_sysflow');
		await a.settle(2500);
		const got = await a.page.evaluate(() => {
			const chart = document.getElementById('lpn_sysflow_chart'),
				svg = chart ? chart.querySelector('svg') : null, r = svg ? svg.getBoundingClientRect() : null,
				prod = chart ? chart.querySelector('polyline.lpn-sysflow-produced') : null,
				cons = chart ? chart.querySelector('polyline.lpn-sysflow-consumed') : null,
				key = document.getElementById('lpn_sysflow_key');
			return {
				frames: EngCalcs.lpnTimeRunFrames().length,
				note: (document.getElementById('lpn_sysflow_note') || {}).textContent || '',
				w: r ? Math.round(r.width) : 0, h: r ? Math.round(r.height) : 0,
				prod: prod ? prod.getAttribute('points').split(' ').length : 0,
				cons: cons ? cons.getAttribute('points').split(' ').length : 0,
				key: key ? key.textContent : '', text: chart ? chart.textContent : ''
			};
		});
		const produced = await a.lang('lpn_sysflow_produced'), consumed = await a.lang('lpn_sysflow_consumed');
		report.ok(got.frames > 1 && got.prod === got.frames && got.cons === got.frames,
			`two lines of ${got.frames} points each, Produced and Consumed`, JSON.stringify(got));
		report.ok(got.w > 200 && got.h > 80, `the chart has a real size: ${got.w} x ${got.h}`);
		report.ok(got.key.indexOf(produced) >= 0 && got.key.indexOf(consumed) >= 0,
			`the key names "${produced}" and "${consumed}"`, got.key);
		report.ok(got.text.indexOf('gpm') >= 0, 'the flow axis is in the project\'s unit (gpm)', got.text.slice(0, 200));
		if (process.env.EC_SYSFLOW_SHOT) {
			await a.page.locator('#lpn_pane_sysflow').screenshot({ path: process.env.EC_SYSFLOW_SHOT });
		}
		report.ok(a.errors.length === 0, 'no uncaught page errors', a.errors.join('\n'));
	} finally {
		await a.close();
	}
};
