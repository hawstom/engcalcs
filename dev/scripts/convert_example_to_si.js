#!/usr/bin/env node
// Convert a US-unit (ft, in, gpm) Looped Pipe Network example into its SI twin (m, mm, L/s).
//
//   node dev/scripts/convert_example_to_si.js Net3 Net3-SI "Net3 SI"
//
// reads dev/water-network-examples/<from>.lwn, writes <to>.lwn there. The number each field holds
// is converted ONCE, here, to SIG significant figures. THE DRAWING IS CONVERTED TOO, to DSIG: on a
// grid project a world unit IS the display length unit (scaleBarUnitsPerPx()), so feet-as-drawn would
// read as metres and the scale bar, auto lengths and the site-plan backdrop would be 3.28 times off.
// TWO KINDS OF DRAWING ARE DIFFERENT. A lat/lon project (`project.coords` 'geo') stores degrees,
// which are no length at all, so its drawing and view are carried across untouched and its
// georeference with them. A projected project (`project.crs`) is drawn in the CRS's own feet: the
// drawing converts at 0.3048 like any grid, the origin shift (an absolute position on the Earth)
// converts at the US survey foot the CRS is defined in, and the CRS becomes its metre twin.
// The Hazen-Williams roughness, the minor-loss k, patterns, times and every
// [QUALITY]/[REACTIONS]/[ENERGY] line are carried across untouched. Verbatim-text
// tokens (`tok`) of every converted field are dropped, since they spell the old number; the pump
// curves' `src` lines are re-spelled in place, keeping EPANET's own ';PUMP:' comment.
// dev/lpn-spike/si-example-equivalence-harness.js proves the pair solves alike.
'use strict';
const fs = require('fs');
const path = require('path');
const SIG = 6, DSIG = 9;
const FT = 0.3048, IN = 25.4, GPM = 1 / 15850.323141488905 * 1000; // ft->m, in->mm, gpm->L/s (lib/Units.lib.php)

const dir = path.join(__dirname, '..', 'water-network-examples');
const [from, to, name] = process.argv.slice(2);
if (!from || !to || !name) { console.error('usage: convert_example_to_si.js <from> <to> "<project name>"'); process.exit(2); }
const d = JSON.parse(fs.readFileSync(path.join(dir, from + '.lwn'), 'utf8'));
if (!d.units || d.units.lpn_u_flow !== 'gpm' || d.units.lpn_u_length !== 'ft') { throw new Error(from + ' is not a ft/gpm project'); }

const FTUS = 1200 / 3937;
const CRS_METRE_TWIN = { 'EPSG:2234': 'EPSG:26956' };	// NAD83 / Connecticut (ftUS) -> (metres), the same projection
const geo = d.project.coords === 'geo';
const crs = d.project.crs || null;
if (crs && !CRS_METRE_TWIN[crs]) { throw new Error(crs + ' has no metre twin listed; extend the converter'); }
const r = (x) => Number(x.toPrecision(SIG));
// TOM'S ROUNDING, 2026-10-13: "Round all the pipe diameters to the nearest 50 mm. Round all the base
// demands and curve flows to the nearest 0.001 L/s. Round all the res. heads, tank depths and
// diameters, control depths, curve heads and pipe lengths to the nearest 0.001m". An SI twin is an SI
// design, not a bit-exact image of the US one. Elevations keep SIG significant figures.
const step = (x, s) => Number((Math.round(x / s) * s).toFixed(Math.max(0, -Math.floor(Math.log10(s)))));
const L = (x) => r(x * FT);
const L3 = (x) => step(x * FT, 0.001), D50 = (x) => Math.max(50, step(x * IN, 50)), Q3 = (x) => step(x * GPM, 0.001);
function conv(rec, keys, f) {
	keys.forEach((k) => {
		if (typeof rec[k] === 'number') { rec[k] = f(rec[k]); }
		if (rec.tok) { delete rec.tok[k]; }
	});
	if (rec.tok && !Object.keys(rec.tok).length) { delete rec.tok; }
}

d.project.name = name;
d.project.gallery = to + '.lwn';
d.app = 'https://librewaternet.org/app/';
if (crs) { d.project.crs = CRS_METRE_TWIN[crs]; }
d.project.docId = 'dms' + Array.from({ length: 14 }, () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]).join('');
d.units0 = d.units;
d.units = { lpn_u_length: 'm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'mh2o', lpn_u_diameter: 'mm',
	lpn_u_flow: 'lps', lpn_u_velocity: 'mps', lpn_u_gradient: d.units.lpn_u_gradient };
if (d.units0.lpn_u_roughness) { d.units.lpn_u_roughness = 'mm'; }
if (d.units0.lpn_u_age) { d.units.lpn_u_age = d.units0.lpn_u_age; }

const Dr = geo ? ((x) => x) : ((x) => Number((x * FT).toPrecision(DSIG)));
d.nodes.forEach((n) => {
	conv(n, ['x', 'y', 'lx', 'ly'], Dr);
	conv(n, ['elev'], L);
	conv(n, ['_head', '_level', 'minLevel', 'maxLevel', 'tankDiameter'], L3);
	conv(n, ['_demand'], Q3);
	if (n.demands) { throw new Error('node ' + n.id + ' has a demand list; extend the converter'); }
});
d.links.forEach((l) => {
	conv(l, ['lx', 'ly'], Dr);
	(l.verts || []).forEach((v) => { conv(v, ['x', 'y'], Dr); });
	conv(l, ['_length'], L3);
	conv(l, ['_diameter'], D50);
	if (l.curvePoints) { l.curvePoints = l.curvePoints.map((p) => [Q3(p[0]), L3(p[1])]); }
	['_minorLoss', 'setting', '_setting'].forEach((k) => { if (l[k] !== undefined && l.type !== 'pipe') { throw new Error('link ' + l.id + ' has ' + k); } });
});
(d.labels || []).forEach((t) => { conv(t, ['x', 'y'], Dr); });
if (d.origin && (d.origin.x || d.origin.y)) {
	if (!crs) { throw new Error('non-zero origin on a project with no CRS; extend the converter'); }
	d.origin = { x: Number((d.origin.x * FTUS).toPrecision(DSIG)), y: Number((d.origin.y * FTUS).toPrecision(DSIG)) };
}
['x', 'y', 'width', 'height', 'tx', 'ty'].forEach((k) => { if (d.backdrop && !geo) { d.backdrop[k] = Dr(d.backdrop[k]); } });	// s is a ratio, iw/ih are pixels
if (!geo) { d.view.cx = Dr(d.view.cx); d.view.cy = Dr(d.view.cy); d.view.s = Number((d.view.s / FT).toPrecision(DSIG)); }	// pixels per world unit
if (typeof d.settings.labelMaxWidth === 'number') { d.settings.labelMaxWidth = L(d.settings.labelMaxWidth); }
// customerMaxWidth is stated in the length unit; the built-in 1000 is what a new SI project opens
// with too (R-342), so only that value is accepted. A typed label suffix names the old unit.
if (d.labelSettings.customerMaxWidth && d.labelSettings.customerMaxWidth !== 1000) { throw new Error('customerMaxWidth; extend the converter'); }
const SUFFIX_SI = { ' ft H2O': ' m H2O', ' gpm': ' L/s', ' in': ' mm', ' ft': ' m', ' psi': ' m H2O' };
['node', 'link', 'customer'].forEach((g) => {
	const o = (d.labelSettings.suffix || {})[g] || {};
	Object.keys(o).forEach((k) => {
		if (!SUFFIX_SI[o[k]]) { throw new Error('label suffix "' + o[k] + '"; extend the converter'); }
		o[k] = SUFFIX_SI[o[k]];
	});
});
(d.curves || []).forEach((c) => {
	if (c.kind !== 'head') { throw new Error('curve ' + c.id + ' is ' + c.kind + '; extend the converter'); }
	c.points = c.points.map((p) => [Q3(p[0]), L3(p[1])]);
	const comments = (c.src || []).filter((s) => /^;/.test(s));
	c.src = comments.concat(c.points.map((p) => ' ' + String(c.id).padEnd(16) + '\t' + String(p[0]).padEnd(12) + '\t' + p[1]));
	delete c.tok;
});
(d.controls || []).forEach((c) => {
	if (c.condition && c.condition.kind === 'node') {
		if (c.condition.unit !== 'head') { throw new Error('control on a pressure; extend the converter'); }
		const v = L3(c.condition.value);
		c.raw = c.raw.replace(/\S+\s*$/, String(v));
		c.condition.value = v;
		c.text = Object.assign({}, c.text, { value: String(v) });
	}
});
if ((d.rules || []).length) { throw new Error('has rules; extend the converter'); }
if (d.scenarios.some((s) => Object.keys(s.overrides || {}).length)) { throw new Error('scenario overrides'); }

// Legend limits are numbers in the old display unit. A method fills them again from the data on
// the first read (fillBreaks), so they are dropped; a hand-typed (manual) set cannot be.
Object.keys(d.settings.colorBreaks || {}).forEach((k) => {
	if ((d.settings.colorModes || {})[k] === 'manual') { throw new Error('manual legend limits on ' + k + '; extend the converter'); }
	delete d.settings.colorBreaks[k];
});

// New-asset defaults: what a fresh project in SI opens with (niceDefault() in js/looped-network.js).
Object.assign(d.settings.defaults, { diameter: 100, tankLevel: 6, tankMinLevel: 0, tankMaxLevel: 9, tankDiameter: 15 });

delete d.units0;
fs.writeFileSync(path.join(dir, to + '.lwn'), JSON.stringify(d, null, '\t') + '\n');
console.log('wrote ' + to + '.lwn');
