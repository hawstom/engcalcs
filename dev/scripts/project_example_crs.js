// project_example_crs.js -- put a lat/lon gallery example on a projected coordinate system.
//
//   node dev/scripts/project_example_crs.js            # rewrite the projected examples
//   node dev/scripts/project_example_crs.js --check    # exit 1 if a projected example is stale
//
// ROADMAP Task 826. Tom, 2026-10-24: examples are not shipped on lat/lon, because a lat/lon project
// cannot take a DXF or shapefile back in. They sit on a CRS that exports and imports: UTM (metres)
// for an SI example, the NAD83 State Plane zone (US survey feet) for a US one.
//
// The lat/lon originals are kept, byte for byte, in dev/water-network-examples/latlon-originals/.
// This script reads those and writes the shipped files beside them, so the conversion is repeatable
// and nothing is lost. It does what File > Convert as does for a lat/lon project (js/looped-network.js
// convertSavedGeometry + rebaseDocument): every position goes through the real proj4 definition,
// the file's own coordinate characters (`tok.x`, `tok.y`) are dropped because they no longer state
// the numbers, the saved view is rebuilt in the new frame (centred, longer side 520 px), and the origin
// is the floor of the smallest easting and northing to 1000. Nothing else is touched.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const DIR = path.join(ROOT, 'dev', 'water-network-examples');
const proj4 = require(path.join(ROOT, 'js', 'vendor', 'proj4.js'));
const DEFS = JSON.parse(fs.readFileSync(path.join(ROOT, 'js', 'data', 'epsg-proj4.json'), 'utf8')).defs;

// file -> the CRS it ships on, and why. Novato, California is in NAD83 California zone 3 (Marin
// County), well inside it; UTM zone 10N (123 W +/- 3) holds it too.
const TARGETS = {
	'Net3-Novato-CA-World.lwn': 'EPSG:2227',      // NAD83 / California zone 3 (ftUS)
	'Net3-Novato-CA-World-SI.lwn': 'EPSG:26943'   // NAD83 / California zone 3 (m), the metre twin of EPSG:2227
};

function convert(doc, crs) {
	const code = crs.replace('EPSG:', '');
	if (!DEFS[code]) { throw new Error('no definition for ' + crs); }
	proj4.defs('X' + code, DEFS[code]);
	const fwd = (p) => { const o = proj4('EPSG:4326', 'X' + code, [p.x, p.y]); return { x: o[0], y: o[1] }; };
	if (!doc.project || doc.project.coords !== 'geo') { throw new Error('not a lat/lon project'); }
	if (doc.backdrop || (doc.customers || []).length || (doc.shapes || []).length) { throw new Error('backdrop, customers or shapes need the full converter'); }
	(doc.scenarios || []).forEach((s) => Object.keys(s.overrides || {}).forEach((k) => {
		const v = s.overrides[k];
		if (v && (typeof v.x === 'number' || typeof v.y === 'number')) { throw new Error('a scenario moves a position'); }
	}));
	const pts = [];
	doc.nodes.forEach((n) => pts.push(n));
	doc.links.forEach((l) => (l.verts || []).forEach((v) => pts.push(v)));
	doc.labels.forEach((lb) => { if (!lb.anchorNode && !lb.anchorLink) { pts.push(lb); } });
	doc.nodes.forEach((n) => { if (typeof n.lx === 'number' || typeof n.ly === 'number') { throw new Error('node label offset needs the full converter'); } });
	pts.forEach((pt) => {
		const q = fwd(pt);
		pt.x = q.x; pt.y = q.y;
		if (pt.tok) { delete pt.tok.x; delete pt.tok.y; }
	});
	let minX = Infinity, minY = Infinity;
	pts.forEach((p) => { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); });
	const org = { x: Math.floor(minX / 1000) * 1000, y: Math.floor(minY / 1000) * 1000 };
	pts.forEach((p) => { p.x -= org.x; p.y -= org.y; });
	doc.origin = org;
	// The saved view, in the file's frame (local to the origin, y as stored): centred on the network,
	// scaled so its longer side is 520 px. A lat/lon view is in degrees and means nothing here, and
	// every gallery example opens on the view its own file states (example-view-harness.js).
	let loX = Infinity, loY = Infinity, hiX = -Infinity, hiY = -Infinity;
	doc.nodes.forEach((n) => { loX = Math.min(loX, n.x); hiX = Math.max(hiX, n.x); loY = Math.min(loY, n.y); hiY = Math.max(hiY, n.y); });
	doc.view = { cx: (loX + hiX) / 2, cy: (loY + hiY) / 2, s: 520 / Math.max(hiX - loX, hiY - loY) };
	delete doc.project.coords;
	delete doc.project.docId;
	doc.project.crs = crs;
	return doc;
}

function build(name) {
	const src = JSON.parse(fs.readFileSync(path.join(DIR, 'latlon-originals', name), 'utf8'));
	return JSON.stringify(convert(src, TARGETS[name]), null, '\t');
}

let stale = 0;
Object.keys(TARGETS).forEach((name) => {
	const out = build(name), file = path.join(DIR, name);
	if (process.argv.indexOf('--check') >= 0) {
		if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== out) { console.log('STALE ' + name); stale++; }
		else { console.log('ok    ' + name + ' on ' + TARGETS[name]); }
	} else {
		fs.writeFileSync(file, out);
		console.log('wrote ' + name + ' on ' + TARGETS[name]);
	}
});
process.exit(stale ? 1 : 0);
