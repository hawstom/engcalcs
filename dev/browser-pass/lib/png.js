// A minimal PNG reader, so a spec can say what COLOUR is on the screen.
//
// Playwright hands back a PNG buffer and this tree has no image library of any kind -- no sharp, no
// ImageMagick, no PIL. "The map went completely blue" (MJH, 2026-09-09) is a claim about pixels, and
// checking it by reading the DOM instead answers a different question. Non-interlaced 8-bit RGB or
// RGBA is all Playwright emits, so that is all this reads; anything else throws by name rather than
// returning plausible nonsense.
const zlib = require('zlib');

function readPng(buf) {
	if (buf.readUInt32BE(0) !== 0x89504e47) { throw new Error('png: not a PNG'); }
	let off = 8, w = 0, h = 0, depth = 0, color = 0, interlace = 0;
	const idat = [];
	while (off < buf.length) {
		const len = buf.readUInt32BE(off), type = buf.toString('ascii', off + 4, off + 8);
		const data = buf.slice(off + 8, off + 8 + len);
		if (type === 'IHDR') {
			w = data.readUInt32BE(0); h = data.readUInt32BE(4);
			depth = data[8]; color = data[9]; interlace = data[12];
		} else if (type === 'IDAT') { idat.push(data); }
		else if (type === 'IEND') { break; }
		off += len + 12;
	}
	if (depth !== 8 || interlace !== 0 || (color !== 2 && color !== 6)) {
		throw new Error(`png: unsupported depth=${depth} color=${color} interlace=${interlace}`);
	}
	const bpp = color === 6 ? 4 : 3;
	const raw = zlib.inflateSync(Buffer.concat(idat));
	const out = Buffer.alloc(w * h * bpp);
	const stride = w * bpp;
	let p = 0;
	for (let y = 0; y < h; y++) {
		const filter = raw[p++];
		const line = raw.slice(p, p + stride); p += stride;
		const cur = out.slice(y * stride, (y + 1) * stride);
		const prev = y ? out.slice((y - 1) * stride, y * stride) : null;
		for (let x = 0; x < stride; x++) {
			const a = x >= bpp ? cur[x - bpp] : 0;
			const b = prev ? prev[x] : 0;
			const c = (prev && x >= bpp) ? prev[x - bpp] : 0;
			let v = line[x];
			if (filter === 1) { v += a; }
			else if (filter === 2) { v += b; }
			else if (filter === 3) { v += (a + b) >> 1; }
			else if (filter === 4) {
				const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
				v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
			}
			cur[x] = v & 255;
		}
	}
	return { w, h, bpp, data: out };
}

/** The colours covering a box, as `{color, share}` sorted by share, quantised to 5 bits a channel. */
function dominantColors(img, box) {
	const x0 = Math.max(0, Math.round(box.x)), y0 = Math.max(0, Math.round(box.y));
	const x1 = Math.min(img.w, Math.round(box.x + box.width)), y1 = Math.min(img.h, Math.round(box.y + box.height));
	const tally = new Map();
	let n = 0;
	for (let y = y0; y < y1; y += 3) {
		for (let x = x0; x < x1; x += 3) {
			const i = (y * img.w + x) * img.bpp;
			const key = ((img.data[i] >> 3) << 10) | ((img.data[i + 1] >> 3) << 5) | (img.data[i + 2] >> 3);
			tally.set(key, (tally.get(key) || 0) + 1);
			n++;
		}
	}
	const hex = (k) => '#' + [(k >> 10) & 31, (k >> 5) & 31, k & 31]
		.map(v => ((v << 3) | (v >> 2)).toString(16).padStart(2, '0')).join('');
	return [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
		.map(([k, c]) => ({ color: hex(k), share: c / n }));
}

/** Is this colour a blue? A blue channel clearly ahead of red, and not near-black. */
function isBlue(hex) {
	const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
	return b > r + 16 && b > g + 4 && b > 60;
}

/**
 * The share of a box's pixels within `tol` of one colour, per channel. `dominantColors` answers
 * "what is on the screen"; this answers "how much of the screen is THIS", which is the question a
 * spec asks when it already knows which colour the failure paints.
 */
function shareNear(img, box, hex, tol) {
	const r0 = parseInt(hex.slice(1, 3), 16), g0 = parseInt(hex.slice(3, 5), 16), b0 = parseInt(hex.slice(5, 7), 16);
	const x0 = Math.max(0, Math.round(box.x)), y0 = Math.max(0, Math.round(box.y));
	const x1 = Math.min(img.w, Math.round(box.x + box.width)), y1 = Math.min(img.h, Math.round(box.y + box.height));
	let hit = 0, n = 0;
	for (let y = y0; y < y1; y += 3) {
		for (let x = x0; x < x1; x += 3) {
			const i = (y * img.w + x) * img.bpp;
			n++;
			if (Math.abs(img.data[i] - r0) <= tol && Math.abs(img.data[i + 1] - g0) <= tol
				&& Math.abs(img.data[i + 2] - b0) <= tol) { hit++; }
		}
	}
	return n ? hit / n : 0;
}

module.exports = { readPng, dominantColors, isBlue, shareNear };
