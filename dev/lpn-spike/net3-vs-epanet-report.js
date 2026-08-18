// Net3 against EPA's OWN published report, at t=0. Run:
//   node dev/lpn-spike/net3-vs-epanet-report.js
//
// NOT a pass/fail harness, and deliberately not in run_harnesses.sh: it MEASURES a known gap so the
// gap has a number instead of an impression. Tom, 2026-08-16: "I am checking Net3 against EPANET. I
// find significant differences." He was right, and this says how much of it is which.
//
// dev/lpn-spike/reference/Net3.rpt is an EXTENDED-PERIOD run, so 0:00 is the only block we can be
// compared against at all -- we solve one steady state (ROADMAP Task 248). At 0:00 EPANET has
// already applied each junction's DEMAND PATTERN multiplier and we have not: pattern 1 starts at
// 1.34, and for nodes 15/35/123/203 the base demand is 1 so the pattern IS the demand in gpm.
//
// MEASURED: over 92 comparable nodes and 119 links, applying the multipliers by hand takes
//   heads  mean |dH| 15.93 ft -> 0.00 ft (worst 0.01 ft)
//   flows  mean      742.3 gpm -> 0.0 gpm (worst 0.3 gpm, against a 13,158 gpm largest flow)
// So the SOLVER agrees with EPANET exactly and the whole visible difference is Task 248.
//
// **THE SELF-CHECK AT THE TOP IS THE POINT OF THIS FILE, NOT A FORMALITY.** The demand model below
// is a reimplementation of what EPANET does at t=0, and it was wrong TWICE, each time producing a
// confident wrong verdict about the solver:
//   1. `if (!pats[id])` read pattern 2's leading 0 as 1818 -- a falsy test on a real zero.
//   2. `line.replace(/;.*$/,'')` never stripped a trailing comment, because Net3.inp is CRLF and
//      JavaScript's `.` does not match \r. Every junction with an empty pattern column silently
//      took a multiplier of 1 instead of pattern 1's 1.34.
// Both looked exactly like a solver disagreement -- 0.49 ft of head, 13% of flow. The report states
// the demand it actually used at every node, so the model is checked against it before anything
// below is believed. If that line does not read 92/92, believe nothing after it.

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

const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
const rpt = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.rpt'), 'utf8');

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
    // `in`, NOT a falsy test: pattern 2's first multiplier IS 0, and `if (!pats[id])` kept
    // overwriting it until a non-zero line, reading 1818 for a demand of nothing.
    if (!(p[0] in pats)) { pats[p[0]] = parseFloat(p[1]); }
  }
}
// junction -> pattern id (col 4), base demand (col 3)
const jpat = {};
{
  const sec = inp.split(/\[JUNCTIONS\]/)[1].split(/\[/)[0];
  for (const line of sec.split('\n')) {
    if (/^\s*;/.test(line) || !line.trim()) continue;
    // split(';'), NOT replace(/;.*$/,''). Net3.inp has CRLF line endings, and JavaScript's `.`
    // does not match \r -- so `;.*$` never matched a trailing comment, every junction with an
    // empty pattern column got ';' as its pattern id, and fell back to a multiplier of 1 instead
    // of pattern 1's 1.34. It read as a solver disagreement.
    const p = line.split(';')[0].trim().split(/\s+/);
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

// Link flows at 0:00, GPM. Columns: ID, Flow, Velocity, Unit headloss, Status.
const linkBlock = rpt.slice(rpt.indexOf('Link Results at 0:00 Hrs:'), rpt.indexOf('Node Results at 1:00 Hrs:'));
const refFlow = {}, refStatus = {};
for (const line of linkBlock.split('\n')) {
  const p = line.trim().split(/\s+/);
  if (p.length >= 4 && /^-?[.\d]+$/.test(p[1]) && /^-?[.\d]+$/.test(p[2])) {
    refFlow[p[0]] = parseFloat(p[1]);
    refStatus[p[0]] = p[4] || p[3];
  }
}

const parsed = EngCalcs.lpnInpParse(inp);
const TO_SI = EngCalcs.lpnInpFlowUnits[parsed.flowUnits].toSI;   // GPM -> m3/s, read not retyped
// VALIDATE THE HARNESS BEFORE TRUSTING ITS VERDICT. The demand model here is a reimplementation of
// what EPANET does at t=0, and a reimplementation that is quietly wrong makes every number below a
// confident fiction -- which is exactly what happened on the first pass (a falsy test read pattern
// 2's leading 0 as 1818). The report states the demand it actually used at every node, so the model
// is checked against it directly.
{
  const refDemand = {};
  for (const line of block.split('\n')) {
    const p = line.trim().split(/\s+/);
    if (p.length === 5 && /^-?[.\d]+$/.test(p[1]) && /^-?[.\d]+$/.test(p[2])) { refDemand[p[0]] = parseFloat(p[1]); }
  }
  let bad = 0, n = 0, worst = 0, worstId = null;
  for (const id in jpat) {
    if (refDemand[id] === undefined) continue;
    const mult = pats[jpat[id].pat] === undefined ? 1 : pats[jpat[id].pat];
    const d = Math.abs(jpat[id].base * mult - refDemand[id]);
    n++;
    if (d > 0.01) { bad++; if (d > worst) { worst = d; worstId = id; } }
  }
  console.log(`demand model vs the report: ${n - bad}/${n} junctions agree` +
    (bad ? `  -- WORST ${worst.toFixed(1)} gpm at ${worstId}` : ''));
  if (bad) { console.log('  the comparison below is NOT trustworthy until this reads 0 disagreements'); }
}

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
  let qn = 0, qsum = 0, qworst = 0, qworstId = null, biggest = 0;
  for (const l of parsed.links) {
    if (refFlow[l.id] === undefined) continue;
    const mine = (r.flows[l.id] || 0) / TO_SI;            // m3/s -> GPM
    const dq = Math.abs(mine - refFlow[l.id]);
    qn++; qsum += dq; biggest = Math.max(biggest, Math.abs(refFlow[l.id]));
    if (dq > qworst) { qworst = dq; qworstId = l.id; }
  }
  console.log(`${label.padEnd(30)} heads n=${n} mean ${(sum/n).toFixed(2)} ft worst ${worst.toFixed(2)} @${worstId}`);
  console.log(`${' '.repeat(30)} flows n=${qn} mean ${(qsum/qn).toFixed(1)} gpm worst ${qworst.toFixed(1)} @${qworstId}  (largest flow in net ${biggest.toFixed(0)} gpm)`);
  runs[label] = r;
}
{
  const r = runs['+ demand patterns at t=0'];
  const rows = [];
  for (const l of parsed.links) {
    if (refFlow[l.id] === undefined) continue;
    const mine = (r.flows[l.id] || 0) / TO_SI;
    rows.push([l.id, l.type, refFlow[l.id], mine, Math.abs(mine - refFlow[l.id])]);
  }
  rows.sort((a, b) => b[4] - a[4]);
  console.log('\n  worst flow disagreements, patterns applied (gpm):');
  console.log('  link      type     EPANET        ours       diff');
  for (const x of rows.slice(0, 12)) {
    console.log('  ' + String(x[0]).padEnd(9) + String(x[1]).padEnd(8) +
      x[2].toFixed(1).padStart(10) + x[3].toFixed(1).padStart(12) + x[4].toFixed(1).padStart(11));
  }
}
console.log('\n  node      EPANET      ours(today)   ours(+patterns)');
for (const id of ['10','15','20','35','40','50','60','101','103','105','123','203','237']) {
  if (refHead[id] === undefined) continue;
  const a = runs['as we solve it today'].heads[id], b = runs['+ demand patterns at t=0'].heads[id];
  console.log('  ' + id.padEnd(8) + refHead[id].toFixed(2).padStart(9) +
    (a===undefined?'        -':(a*FT).toFixed(2).padStart(13)) +
    (b===undefined?'        -':(b*FT).toFixed(2).padStart(17)));
}
