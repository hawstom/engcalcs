// Net3 against EPA's OWN published report, at t=0. Run:
//   node dev/lpn-spike/net3-vs-epanet-report.js
//
// NOT a pass/fail harness, and deliberately not in run_harnesses.sh: it MEASURES a known gap so the
// gap has a number instead of an impression. Tom, 2026-08-16: "I am checking Net3 against EPANET. I
// find significant differences." He was right, and this says how much of it is which.
//
// dev/water-network-examples/Net3.rpt is an EXTENDED-PERIOD run, so 0:00 is the only block we can be
// compared against at all -- we solve one steady state (ROADMAP Task 248). At 0:00 EPANET has
// already applied each junction's DEMAND PATTERN multiplier and we have not: pattern 1 starts at
// 1.34, and for nodes 15/35/123/203 the base demand is 1 so the pattern IS the demand in gpm.
//
// Measured: mean |dH| over 92 comparable nodes goes 15.93 ft -> 0.49 ft when the multipliers are
// applied by hand. The remainder is ROADMAP Task 393 and is NOT yet explained -- do not assume it
// is rounding. Fixed-head nodes 20/40/50 match exactly either way, which is what says the
// comparison itself is sound rather than accidentally self-consistent.

const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
require(path.join(ROOT, 'dev/lpn-spike/bootstrap.js'));
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-inp.js'));
const vi = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/validate_inp.js'), 'utf8');
const at = vi.search(/function toSolverModel\s*\(/);
let i = vi.indexOf('{', at), d = 0, end = i;
for (; end < vi.length; end++) { if (vi[end]==='{') d++; else if (vi[end]==='}') { d--; if(!d){end++;break;} } }
const toSolverModel = eval('(' + vi.slice(at, end) + ')');

const inp = fs.readFileSync(path.join(ROOT, 'dev/water-network-examples/Net3.inp'), 'utf8');
const rpt = fs.readFileSync(path.join(ROOT, 'dev/water-network-examples/Net3.rpt'), 'utf8');

// pattern id -> first multiplier
const pats = {};
for (const line of inp.split('\n')) {
  const m = /^\s*(\S+)\s+(.*)$/.exec(line);
  if (!/^\[/.test(line) && m && /PATTERNS/.test('')) {}
}
{
  const sec = inp.split(/\[PATTERNS\]/)[1].split(/\[/)[0];
  for (const line of sec.split('\n')) {
    if (/^\s*;/.test(line) || !line.trim()) continue;
    const p = line.trim().split(/\s+/);
    if (!pats[p[0]]) pats[p[0]] = parseFloat(p[1]);
  }
}
// junction -> pattern id (col 4), base demand (col 3)
const jpat = {};
{
  const sec = inp.split(/\[JUNCTIONS\]/)[1].split(/\[/)[0];
  for (const line of sec.split('\n')) {
    if (/^\s*;/.test(line) || !line.trim()) continue;
    const p = line.replace(/;.*$/,'').trim().split(/\s+/);
    if (p.length >= 3) jpat[p[0]] = { base: parseFloat(p[2]), pat: p[3] || '1' };
  }
}
// report heads at 0:00
const block = rpt.slice(rpt.indexOf('Node Results at 0:00 Hrs:'), rpt.indexOf('Link Results at 0:00 Hrs:'));
const refHead = {};
for (const line of block.split('\n')) {
  const p = line.trim().split(/\s+/);
  if (p.length === 5 && /^[-.\d]+$/.test(p[1]) && /^[-.\d]+$/.test(p[2])) refHead[p[0]] = parseFloat(p[2]);
}

const parsed = EngCalcs.lpnInpParse(inp);
function run(applyPatterns) {
  const m = toSolverModel(parsed);
  if (applyPatterns) {
    for (const n of m.nodes) {
      const j = jpat[n.id];
      if (j && n.demand) { const mult = pats[j.pat] === undefined ? 1 : pats[j.pat]; n.demand = n.demand * mult; }
    }
  }
  return EngCalcs.lpnSolve(m);
}
const FT = 1/0.3048; const runs = {};
for (const [label, ap] of [
    ['as we solve it today', false, false],
    ['+ demand patterns at t=0', true, false],
    // Link 330's closed status comes in from the [PIPES] status column, so there is no third row
    // here: the control that would have closed it is already satisfied by the import.
    ]) {
  const r = run(ap);
  if (!r.ok) { console.log(label, '-> did not solve', JSON.stringify(r.issues).slice(0,200)); continue; }
  let worst = 0, worstId = null, n = 0, sum = 0;
  for (const nd of parsed.nodes) {
    if (refHead[nd.id] === undefined) continue;
    const ours = r.heads[nd.id];
    if (ours === undefined) continue;
    const dft = Math.abs(ours * FT - refHead[nd.id]);
    n++; sum += dft;
    if (dft > worst) { worst = dft; worstId = nd.id; }
  }
  console.log(`${label.padEnd(45)} n=${n}  mean |dH| ${(sum/n).toFixed(2)} ft   worst ${worst.toFixed(2)} ft at ${worstId}`);
  runs[label] = r;
}
console.log('\n  node      EPANET      ours(today)   ours(+patterns)');
for (const id of ['10','15','20','35','40','50','60','101','103','105','123','203','237']) {
  if (refHead[id] === undefined) continue;
  const a = runs['as we solve it today'].heads[id], b = runs['+ demand patterns at t=0'].heads[id];
  console.log('  ' + id.padEnd(8) + refHead[id].toFixed(2).padStart(9) +
    (a===undefined?'        -':(a*FT).toFixed(2).padStart(13)) +
    (b===undefined?'        -':(b*FT).toFixed(2).padStart(17)));
}
