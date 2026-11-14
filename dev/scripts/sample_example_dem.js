// One-time sampler: reads the ground elevation under every node of the two starter examples from
// Mapbox Terrain-RGB, the way the page's "From Mapbox DEM" does, and prints them (or writes them
// to dev/scripts/starter_example_dem.json, which build_starter_examples.js and
// starter-examples-harness.js both read).
//
//   node dev/scripts/sample_example_dem.js            # print the readings
//   node dev/scripts/sample_example_dem.js --write    # also write starter_example_dem.json
//
// It is NOT part of the build: the generator never fetches. Run it only to re-take the readings.
//
// What it shares with the page: the tile and pixel arithmetic (EngCalcs.lpnTerrainTilePixel), the
// zoom (the page's fill zoom, 14), the lossless .pngraw tileset and the decode
// (EngCalcs.lpnTerrainDecode). The page takes the ONE pixel the point falls in (it does not
// interpolate), so this does too. The token is read from lib/config.inc.php and never printed. The
// token is restricted by host, so the request carries Referer: http://localhost/.
// No dependency: the PNG is decoded here with node's zlib.
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');
const ROOT = path.join(__dirname, '..', '..') + path.sep;

global.EngCalcs = global.EngCalcs || {};
global.window = global.window || global;
global.window.EngCalcs = global.EngCalcs;
require(ROOT + 'js/lpn-terrain.js');
const EC = global.EngCalcs;
const ZOOM = EC.lpnTerrainPolicy().fillZoom;

// The generator's own node positions (longitude, latitude), read from its source so there is one
// copy. Only the `id`/`ll` pairs of the two example functions are taken.
function nodesOf(fnName) {
	const src = fs.readFileSync(path.join(__dirname, 'build_starter_examples.js'), 'utf8');
	const body = src.slice(src.indexOf('function ' + fnName + '(si)'));
	const end = body.indexOf('const orgUs');
	const out = [];
	const re = /\{ id: '([^']+)',(?: type: '[a-z]+',)? ll: \[([-\d.]+), ([-\d.]+)\]/g;
	let m;
	const block = body.slice(0, end);
	while ((m = re.exec(block))) { out.push({ id: m[1], lon: +m[2], lat: +m[3] }); }
	return out;
}

function token() {
	const cfg = fs.readFileSync(ROOT + 'lib/config.inc.php', 'utf8');
	const m = cfg.match(/define\('EC_MAPBOX_TOKEN',\s*'([^']+)'/);
	if (!m) { throw new Error('EC_MAPBOX_TOKEN not found in lib/config.inc.php'); }
	return m[1];
}

function get(url) {
	return new Promise((resolve, reject) => {
		https.get(url, { headers: { Referer: 'http://localhost/' } }, (res) => {
			const chunks = [];
			res.on('data', (c) => chunks.push(c));
			res.on('end', () => {
				if (res.statusCode !== 200) { reject(new Error('HTTP ' + res.statusCode + ' for ' + url.replace(/access_token=[^&]+/, 'access_token=<token>'))); return; }
				resolve(Buffer.concat(chunks));
			});
		}).on('error', reject);
	});
}

// 8-bit RGB or RGBA, non-interlaced PNG -> { w, h, bpp, data } with the filters undone.
function decodePng(buf) {
	let p = 8, w, h, ct, idat = [];
	while (p < buf.length) {
		const len = buf.readUInt32BE(p), type = buf.toString('latin1', p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len);
		if (type === 'IHDR') {
			w = d.readUInt32BE(0); h = d.readUInt32BE(4);
			if (d[8] !== 8 || d[12] !== 0) { throw new Error('PNG is not 8-bit non-interlaced'); }
			ct = d[9];
		}
		if (type === 'IDAT') { idat.push(d); }
		p += 12 + len;
	}
	const bpp = ct === 2 ? 3 : ct === 6 ? 4 : 0;
	if (!bpp) { throw new Error('PNG colour type ' + ct + ' is not RGB or RGBA'); }
	const raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * bpp, out = Buffer.alloc(h * stride);
	for (let y = 0; y < h; y++) {
		const f = raw[y * (stride + 1)], src = y * (stride + 1) + 1, dst = y * stride;
		for (let x = 0; x < stride; x++) {
			const a = x >= bpp ? out[dst + x - bpp] : 0, b = y ? out[dst - stride + x] : 0, c = (x >= bpp && y) ? out[dst - stride + x - bpp] : 0;
			let v = raw[src + x];
			if (f === 1) { v += a; } else if (f === 2) { v += b; } else if (f === 3) { v += (a + b) >> 1; }
			else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); }
			out[dst + x] = v & 255;
		}
	}
	return { w, h, bpp, data: out };
}

(async function main() {
	const tok = token();
	const cache = {};
	async function tile(t) {
		const k = t.z + '/' + t.x + '/' + t.y;
		if (!cache[k]) { cache[k] = decodePng(await get(EC.lpnTerrainUrl({ z: t.z, x: t.x, y: t.y }, tok))); }
		return cache[k];
	}
	const result = { source: 'Mapbox Terrain-RGB (mapbox.terrain-rgb, .pngraw), zoom ' + ZOOM + ', nearest pixel as the page reads it, taken ' + new Date().toLocaleDateString('en-CA'), zoom: ZOOM,
		// Design constants the readings are combined with (not read from the DEM): the well's pumping level below the wellhead ground, and the tank tower, so TANK-1's floor stands this far over the ground at the tank.
		design: { well: { pumpingLevelBelowGroundFt: 160, pumpingLevelBelowGroundM: 49, towerFt: 100, towerM: 30.5 } },
		metres: {} };
	for (const [key, fn] of [['extension', 'extension'], ['well', 'well']]) {
		result.metres[key] = {};
		console.log('\n' + key);
		for (const n of nodesOf(fn)) {
			const t = EC.lpnTerrainTilePixel(n.lon, n.lat, ZOOM), img = await tile(t);
			const at = (px, py) => { const o = (py * img.w + px) * img.bpp; return EC.lpnTerrainDecode(img.data[o], img.data[o + 1], img.data[o + 2]); };
			const m = Math.round(at(t.px, t.py) * 10) / 10;
			// The 3 x 3 pixels around it, to show how much the ground moves within one pixel.
			const nb = [];
			for (let dy = -1; dy <= 1; dy++) { for (let dx = -1; dx <= 1; dx++) { const px = t.px + dx, py = t.py + dy; if (px >= 0 && py >= 0 && px < 256 && py < 256) { nb.push(at(px, py)); } } }
			result.metres[key][n.id] = m;
			console.log('  ' + n.id.padEnd(7) + ' lon ' + n.lon + ' lat ' + n.lat + '  tile ' + t.z + '/' + t.x + '/' + t.y + ' px ' + t.px + ',' + t.py +
				'  ' + m.toFixed(1) + ' m = ' + (m / 0.3048).toFixed(2) + ' ft   (3x3 range ' + Math.min(...nb).toFixed(1) + ' to ' + Math.max(...nb).toFixed(1) + ' m)');
		}
	}
	if (process.argv.indexOf('--write') >= 0) {
		fs.writeFileSync(path.join(__dirname, 'starter_example_dem.json'), JSON.stringify(result, null, '\t') + '\n');
		console.log('\nwritten dev/scripts/starter_example_dem.json');
	}
})().catch((e) => { console.error(String(e.message || e)); process.exit(1); });
