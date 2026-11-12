// EPANET jobs run one at a time in the shared Workspace, and a damaged results file is refused.
//
//   node dev/lpn-spike/epanet-one-at-a-time-harness.js
//
// Two period runs (and a steady solve) started together used to overlap in one Workspace over the
// same temp.out; the file read back was short and the vendored readBinary() then allocated until
// the tab died. Overlap is seen here by interleaved progress events: with sliceMs tiny each run
// yields often, so if two ran at once their events would mix.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
const { buildModel } = require('./net3-model.js');
const ENGINE = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');

let failures = 0;
function check(ok, msg) { console.log((ok ? '  ok   ' : '  FAIL ') + msg); if (!ok) failures++; }

(async function () {
	const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const model = buildModel(EngCalcs, EngCalcs.lpnInpParse(inp));
	await EngCalcs.lpnEpanetLoad(ENGINE);
	const events = [];
	function job(tag) {
		return EngCalcs.lpnEpanetRun(model, { sliceMs: 1, onProgress: function () { events.push(tag); } })
			.then(function (r) { events.push(tag + ':done'); return r; });
	}
	const solveP = EngCalcs.lpnSolveEpanet(model, {}).then(function (r) { events.push('S:done'); return r; });
	const [a, b, s] = await Promise.all([job('A'), job('B'), solveP]);
	check(a.ok !== false && b.ok !== false, 'both runs ok');
	check(a.frames.length > 1 && a.frames.length === b.frames.length, 'both runs have all ' + a.frames.length + ' frames');
	check(s && s.ok !== false, 'steady solve ok');
	const doneA = events.indexOf('A:done'), firstB = events.indexOf('B');
	check(doneA >= 0 && firstB > doneA, 'B did not start until A finished (A done at ' + doneA + ', B first at ' + firstB + ')');
	check(events.indexOf('S:done') >= 0 && events.indexOf('S:done') < events.indexOf('A'), 'steady solve (started first) finished before either run began');

	// A good results file passes; a truncated one is refused with an error, quickly.
	const mod = await EngCalcs.lpnEpanetLoad(ENGINE);
	const ws = new mod.Workspace(); await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('g.inp', EngCalcs.lpnToInp(model, { eps: true }).inp);
	p.open('g.inp', 'g.rpt', 'g.out'); p.solveH(); p.solveQ(); p.report(); p.close();
	const good = ws.readFile('g.out', 'binary'); if (process.env.DBG) { const d = new DataView(good.buffer, good.byteOffset, good.byteLength); const a=[]; for (let i=0;i<15;i++) a.push(d.getInt32(i*4,true)); console.log('head', a.join(','), 'len', good.length); const b=[]; for (let i=7;i>=1;i--) b.push(d.getInt32(good.length-4*i,true)); console.log('tail', b.join(',')); }
	let threw = null;
	try { EngCalcs.lpnCheckOutBytes(good); } catch (e) { threw = e; }
	check(!threw, 'a whole results file (' + good.length + ' bytes) passes' + (threw ? ': ' + threw.message : ''));
	const cut = good.slice(0, Math.floor(good.length * 0.79));
	threw = null;
	const t0 = Date.now();
	try { EngCalcs.lpnCheckOutBytes(cut); } catch (e) { threw = e; }
	check(threw && /EPANET results file/.test(threw.message) && Date.now() - t0 < 100, 'a truncated file (' + cut.length + ' bytes) is refused: ' + (threw && threw.message));
	threw = null;
	try { EngCalcs.lpnCheckOutBytes(good.slice(0, 20)); } catch (e) { threw = e; }
	check(!!threw, 'a stub of 20 bytes is refused');
	console.log(failures ? failures + ' FAILED' : 'all passed');
	process.exit(failures ? 1 : 0);
}()).catch(function (e) { console.log('  FAIL ' + (e && e.stack || (e && e.message) || JSON.stringify(e))); process.exit(1); });
