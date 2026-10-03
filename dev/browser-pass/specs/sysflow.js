// The System flow tab (ROADMAP Task 600) in a real Chromium: EPA's Net1, the tab pressed as a reader
// presses it, and the two drawn lines read back off the SVG. dev/lpn-spike/system-flow-harness.js
// checks the balance against the solved link flows; this checks that the real page draws it at a
// real size, with the pump-off afternoon of EPANET's own example figure.
//
// **AT 1280 x 800, AND THE CHART MUST FIT THE PANE** (pre-review of 15250325): the chart host had
// no flex rule, so it drew 340 px into a 260 px pane and its time axis sat below the fold. And the
// new tab made the strip wrap in long languages, once leaving the Profile tab's arrow alone on the
// second row; the arrow must always ride with its tab. Rows per language are printed, not judged:
// whether a two-row strip is acceptable is Tom's call.

const { Session } = require('../lib/session');

exports.title = 'System flow tab';

const VIEW = { viewport: { width: 1280, height: 800 } };
const LANGS = ['en', 'de', 'fr', 'es', 'pt', 'tr', 'ru'];

exports.run = async function ({ browser, report }) {
	// ---- the chart, in English ----------------------------------------------------------------
	const a = await Session.open(browser, 'A', VIEW);
	try {
		await a.goto('Looped-Network.php?ec_nolog=1&lang=en');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.toolbarClick(await a.lang('lpn_pane_toggle'));
		await a.settle(500);
		await a.page.click('#lpn_pane_tab_sysflow');
		await a.settle(2500);
		const got = await a.page.evaluate(() => {
			const chart = document.getElementById('lpn_sysflow_chart'),
				panel = document.getElementById('lpn_pane_sysflow'),
				svg = chart ? chart.querySelector('svg') : null, r = svg ? svg.getBoundingClientRect() : null,
				pr = panel ? panel.getBoundingClientRect() : null,
				prod = chart ? chart.querySelector('polyline.lpn-sysflow-produced') : null,
				cons = chart ? chart.querySelector('polyline.lpn-sysflow-consumed') : null,
				key = document.getElementById('lpn_sysflow_key');
			return {
				frames: EngCalcs.lpnTimeRunFrames().length,
				w: r ? Math.round(r.width) : 0, h: r ? Math.round(r.height) : 0,
				svgBottom: r ? Math.round(r.bottom) : 0, panelBottom: pr ? Math.round(pr.bottom) : 0,
				scrolls: panel ? panel.scrollHeight > panel.clientHeight + 1 : true,
				prod: prod ? prod.getAttribute('points').split(' ').length : 0,
				cons: cons ? cons.getAttribute('points').split(' ').length : 0,
				key: key ? key.textContent : '', text: chart ? chart.textContent : ''
			};
		});
		const produced = await a.lang('lpn_sysflow_produced'), consumed = await a.lang('lpn_sysflow_consumed');
		report.ok(got.frames > 1 && got.prod === got.frames && got.cons === got.frames,
			`two lines of ${got.frames} points each, Produced and Consumed`, JSON.stringify(got).slice(0, 300));
		report.ok(got.w > 200 && got.h > 80, `the chart has a real size: ${got.w} x ${got.h}`);
		report.ok(got.svgBottom <= got.panelBottom + 1 && !got.scrolls,
			`at 1280 x 800 the chart fits the pane, time axis included: svg bottom ${got.svgBottom}, ` +
			`panel bottom ${got.panelBottom}, panel scrolls: ${got.scrolls}`);
		report.ok(got.key.indexOf(produced) >= 0 && got.key.indexOf(consumed) >= 0,
			`the key names "${produced}" and "${consumed}"`, got.key);
		report.ok(got.text.indexOf('gpm') >= 0, 'the flow axis is in the project\'s unit (gpm)', got.text.slice(0, 200));
		if (process.env.EC_SYSFLOW_SHOT) {
			await a.page.locator('#lpn_pane').screenshot({ path: process.env.EC_SYSFLOW_SHOT });
		}
		report.ok(a.errors.length === 0, 'no uncaught page errors', a.errors.join('\n'));
	} finally {
		await a.close();
	}

	// ---- the tab strip, in the core languages ----------------------------------------------------
	const rows = [];
	for (const lang of LANGS) {
		const s = await Session.open(browser, 'L' + lang, VIEW);
		try {
			await s.goto(`Looped-Network.php?ec_nolog=1&lang=${lang}`);
			await s.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await s.dismissGallery();
			await s.toolbarClick(await s.lang('lpn_pane_toggle'));
			await s.settle(400);
			const m = await s.page.evaluate(() => {
				const tabs = Array.from(document.querySelectorAll('#lpn_pane_tabs .lpn-pane-tab, #lpn_pane_tabs .lpn-pane-tab-menu'));
				const tops = Array.from(new Set(tabs.map((t) => Math.round(t.getBoundingClientRect().top))));
				const tab = document.getElementById('lpn_pane_tab_profile'),
					caret = document.getElementById('lpn_pane_tab_menu_profile');
				const tr = tab.getBoundingClientRect(), cr = caret.getBoundingClientRect();
				return { rows: tops.length, attached: Math.abs(tr.top - cr.top) < 2 && Math.abs(cr.left - tr.right) < 4 };
			});
			rows.push(`${lang}:${m.rows}`);
			report.ok(m.attached, `${lang}: the Profile arrow sits on its tab's row, beside it (strip rows: ${m.rows})`);
		} finally {
			await s.close();
		}
	}
	console.log('        strip rows at 1280 px: ' + rows.join(' '));
};
