// WHAT A SCENARIO STORES WHEN A VISITOR MAKES IT THROUGH THE UI, in Basic mode and out of it.
//   Real Chromium: Water > Scenarios > New scenario, then one edit in the Properties box, then the
//   project read back from localStorage. Asserts the stored shape that hand-built scenario JSON never
//   proved: the edit lands in a stored Physical alternative named after the scenario, which the
//   scenario names (Task 721, dev/scenario-alternatives.md), and Base is untouched. Uses
//   dev/lpn-spike/scenario-ui-helper.js; Basic mode is a browser setting, so both modes store the same.
//   node dev/lpn-spike/scenario-ui-stored-shape-browser-harness.js        (takes the browser lock itself)
'use strict';

const path = require('path');
const U = require('./scenario-ui-helper.js');
const NAME = 'scenario-ui-stored-shape-browser-harness';
U.takeBrowserLock(NAME, 'EC_SCENARIO_UI_SHAPE_BROWSER_LOCKED');

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function main() {
	const env = require(path.join(U.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(U.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const shapes = {};
		for (const basic of [true, false]) {
			const mode = basic ? '[basic: true]' : '[basic: false]';
			console.log('\n--- ' + mode + ' ---');
			const ctx = await U.openNet1(browser, NAME + (basic ? '-basic' : '-alt'));
			await U.setBasicMode(ctx, basic);
			const base0 = await U.storedProject(ctx);
			const pipeBefore = JSON.stringify(base0.links.find((n) => n.id === '10'));
			const r = await U.newScenarioAndEdit(ctx, { kind: 'link', id: '10', labelKey: 'lpn_field_roughness', value: '77' });
			const d = r.doc, s = r.scenario;
			ok(mode + ': New scenario asked for a name', !!r.said, r.said);
			ok('a child scenario exists and is current', d.scenarios.length === 2 && !!s && !s.isBase && r.activeId === s.id, JSON.stringify(r.activeId));
			// The branch's model (Task 721, dev/scenario-alternatives.md): the first override in a
			// category, in Basic mode or out, makes a stored alternative named after the scenario, and
			// the scenario names it. A roughness is Physical, so that is the one alternative made.
			const alts = d.alternatives || [];
			const altId = s.alternatives && s.alternatives.physical;
			const alt = alts.find((x) => x.id === altId);
			ok('the scenario names its own Physical alternative, and holds no values of its own',
				!!alt && Object.keys(s.alternatives).length === 1 && JSON.stringify(s.overrides || {}) === '{}', JSON.stringify(s));
			ok('...a stored alternative named after the scenario, its parent the Base it inherited',
				!!alt && alt.category === 'physical' && alt.name === s.name && !alt.parent, JSON.stringify(alt));
			const ov = alt && alt.values && alt.values['l:10'];
			ok('...holding pipe 10\'s roughness as typed, and nothing else', !!ov && JSON.stringify(ov) === '{"roughness":77}' &&
				Object.keys(alt.values).length === 1, JSON.stringify(alt && alt.values));
			ok('Base pipe 10 is unchanged in the stored links', JSON.stringify(d.links.find((n) => n.id === '10')) === pipeBefore);
			const base = d.scenarios.find((x) => x.isBase);
			ok('Base names no alternative and holds no override; no other alternative or calculation set is made',
				!!base && !base.alternatives && JSON.stringify(base.overrides || {}) === '{}' && alts.length === 1 && !(d.calcSets || []).length,
				JSON.stringify({ base, n: alts.length, calcSets: d.calcSets }));
			shapes[basic] = { keys: Object.keys(s).sort().join(','), alt: JSON.stringify(alt), top: Object.keys(d).sort().join(',') };
			ok('no uncaught page errors', ctx.a.errors.length === 0, ctx.a.errors.slice(0, 2).join(' | '));
			await ctx.a.close();
		}
		ok('Basic mode on and off store the same shape (scenario keys, override, project keys)',
			JSON.stringify(shapes[true]) === JSON.stringify(shapes[false]), JSON.stringify(shapes));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
