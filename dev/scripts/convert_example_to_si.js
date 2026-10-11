#!/usr/bin/env node
// Convert a US-unit (ft, in, gpm) Looped Pipe Network example into its SI twin (m, mm, L/s).
//
//   node dev/scripts/convert_example_to_si.js Net3 Net3-SI "Net3 SI"
//
// reads dev/water-network-examples/<from>.lwn, writes <to>.lwn there. The number each field holds
// is converted ONCE, here, to SIG significant figures; the drawing (coordinates), the Hazen-Williams
// roughness, the minor-loss k, patterns, times and every [QUALITY]/[REACTIONS]/[ENERGY] line are
// carried across untouched, because none of them carries a length, a flow or a head. Verbatim-text
// tokens (`tok`) of every converted field are dropped, since they spell the old number; the pump
// curves' `src` lines are re-spelled in place, keeping EPANET's own ';PUMP:' comment.
// dev/lpn-spike/si-example-equivalence-harness.js proves the pair solves alike.
'use strict';
const fs = require('fs');
const path = require('path');
const SIG = 6;
const FT = 0.3048, IN = 25.4, GPM = 1 / 15850.323141488905 * 1000; // ft->m, in->mm, gpm->L/s (lib/Units.lib.php)

const dir = path.join(__dirname, '..', 'water-network-examples');
const [from, to, name] = process.argv.slice(2);
if (!from || !to || !name) { console.error('usage: convert_example_to_si.js <from> <to> "<project name>"'); process.exit(2); }
const d = JSON.parse(fs.readFileSync(path.join(dir, from + '.lwn'), 'utf8'));
if (!d.units || d.units.lpn_u_flow !== 'gpm' || d.units.lpn_u_length !== 'ft') { throw new Error(from + ' is not a ft/gpm project'); }

const r = (x) => Number(x.toPrecision(SIG));
const L = (x) => r(x * FT), Dm = (x) => r(x * IN), Q = (x) => r(x * GPM);
function conv(rec, keys, f) {
	keys.forEach((k) => {
		if (typeof rec[k] === 'number') { rec[k] = f(rec[k]); }
		if (rec.tok) { delete rec.tok[k]; }
	});
	if (rec.tok && !Object.keys(rec.tok).length) { delete rec.tok; }
}

d.project.name = name;
d.project.docId = 'dms' + Array.from({ length: 14 }, () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]).join('');
d.units = { lpn_u_length: 'm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'mh2o', lpn_u_diameter: 'mm',
	lpn_u_flow: 'lps', lpn_u_velocity: 'mps', lpn_u_gradient: d.units.lpn_u_gradient };

d.nodes.forEach((n) => {
	conv(n, ['elev', '_head', '_level', 'minLevel', 'maxLevel', 'tankDiameter'], L);
	conv(n, ['_demand'], Q);
	if (n.demands) { throw new Error('node ' + n.id + ' has a demand list; extend the converter'); }
});
d.links.forEach((l) => {
	conv(l, ['_length'], L);
	conv(l, ['_diameter'], Dm);
	if (l.curvePoints) { l.curvePoints = l.curvePoints.map((p) => [Q(p[0]), L(p[1])]); }
	['_minorLoss', 'setting', '_setting'].forEach((k) => { if (l[k] !== undefined && l.type !== 'pipe') { throw new Error('link ' + l.id + ' has ' + k); } });
});
(d.curves || []).forEach((c) => {
	if (c.kind !== 'head') { throw new Error('curve ' + c.id + ' is ' + c.kind + '; extend the converter'); }
	c.points = c.points.map((p) => [Q(p[0]), L(p[1])]);
	const comments = (c.src || []).filter((s) => /^;/.test(s));
	c.src = comments.concat(c.points.map((p) => ' ' + String(c.id).padEnd(16) + '\t' + String(p[0]).padEnd(12) + '\t' + p[1]));
	delete c.tok;
});
(d.controls || []).forEach((c) => {
	if (c.condition && c.condition.kind === 'node') {
		if (c.condition.unit !== 'head') { throw new Error('control on a pressure; extend the converter'); }
		const v = L(c.condition.value);
		c.raw = c.raw.replace(/\S+\s*$/, String(v));
		c.condition.value = v;
		c.text = Object.assign({}, c.text, { value: String(v) });
	}
});
if ((d.rules || []).length) { throw new Error('has rules; extend the converter'); }
if (d.scenarios.some((s) => Object.keys(s.overrides || {}).length)) { throw new Error('scenario overrides'); }

// New-asset defaults: what a fresh project in SI opens with (niceDefault() in js/looped-network.js).
Object.assign(d.settings.defaults, { diameter: 100, tankLevel: 6, tankMinLevel: 0, tankMaxLevel: 9, tankDiameter: 15 });

fs.writeFileSync(path.join(dir, to + '.lwn'), JSON.stringify(d, null, '\t') + '\n');
console.log('wrote ' + to + '.lwn');
