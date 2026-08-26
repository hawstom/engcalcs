// Black out a rectangle in a PNG, or cut one out to look at. No image library required.
//
//   node dev/scripts/png_redact.js crop   in.png out.png X Y W H
//   node dev/scripts/png_redact.js redact in.png out.png X,Y,W,H [X,Y,W,H ...]
//   node dev/scripts/png_redact.js scale  in.png out.png W H
//   node dev/scripts/png_redact.js pad    in.png out.png W H
//
// WHY THIS EXISTS. There is no ImageMagick, no Pillow, no PHP GD and no sharp on this machine, and
// dev/screenshots/README.md says so. But a PNG is zlib plus five row filters, and node ships zlib,
// so the ~150 lines below are cheaper than a dependency -- and this repository has a standing
// reason to avoid one (GPL v3, no build step).
//
// SCOPE, deliberately narrow: 8-bit RGB/RGBA, non-interlaced, which is what every screen grabber
// on this machine produces. Anything else is REFUSED BY NAME rather than half-handled -- a tool
// that silently mangles a 16-bit or palette image is worse than one that will not open it.
//
// **REDACTION IS ONE-WAY AND THE ORIGINAL IS NEVER OVERWRITTEN.** The output path must not be the
// input path and must not already exist. Painting over pixels is not reversible, and a screenshot
// drop is raw material: the way to undo a bad rectangle is to still have the file it came from.

const fs = require('fs');
const zlib = require('zlib');

const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function crc32(buf) {
	let c, n, k, t = crc32.table;
	if (!t) {
		t = crc32.table = new Int32Array(256);
		for (n = 0; n < 256; n++) {
			c = n;
			for (k = 0; k < 8; k++) { c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1); }
			t[n] = c;
		}
	}
	c = -1;
	for (n = 0; n < buf.length; n++) { c = t[(c ^ buf[n]) & 0xff] ^ (c >>> 8); }
	return (c ^ -1) >>> 0;
}

function readChunks(buf) {
	if (!buf.slice(0, 8).equals(SIG)) { throw new Error('not a PNG'); }
	const out = [];
	let p = 8;
	while (p < buf.length) {
		const len = buf.readUInt32BE(p);
		const type = buf.slice(p + 4, p + 8).toString('latin1');
		out.push({ type, data: buf.slice(p + 8, p + 8 + len) });
		p += 12 + len;
	}
	return out;
}

function chunk(type, data) {
	const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
	const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
	const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0);
	return Buffer.concat([len, body, crc]);
}

// Undo the per-row filters. Filters are defined on BYTES, not pixels, and `bpp` is the byte
// distance to the pixel on the left -- getting that wrong produces an image that decodes without
// error and looks like colourful noise, which is the failure worth naming here.
function unfilter(raw, w, h, bpp) {
	const stride = w * bpp;
	const out = Buffer.alloc(h * stride);
	let pos = 0;
	for (let y = 0; y < h; y++) {
		const ft = raw[pos++];
		const line = raw.slice(pos, pos + stride); pos += stride;
		const cur = out.slice(y * stride, (y + 1) * stride);
		const prev = y > 0 ? out.slice((y - 1) * stride, y * stride) : null;
		for (let i = 0; i < stride; i++) {
			const a = i >= bpp ? cur[i - bpp] : 0;
			const b = prev ? prev[i] : 0;
			const c = (prev && i >= bpp) ? prev[i - bpp] : 0;
			let v = line[i];
			if (ft === 1) { v += a; }
			else if (ft === 2) { v += b; }
			else if (ft === 3) { v += (a + b) >> 1; }
			else if (ft === 4) {
				const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
				v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
			} else if (ft !== 0) { throw new Error('unknown row filter ' + ft + ' on row ' + y); }
			cur[i] = v & 0xff;
		}
	}
	return out;
}

// Written back with filter 0 on every row. Larger than an optimal encoder would produce and that is
// the whole trade: this file is about being correct without a dependency, not about bytes.
function refilter(pix, w, h, bpp) {
	const stride = w * bpp;
	const out = Buffer.alloc(h * (stride + 1));
	for (let y = 0; y < h; y++) {
		out[y * (stride + 1)] = 0;
		pix.copy(out, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
	}
	return out;
}

// Area-average downscale. A box filter over the exact source rectangle each destination pixel
// covers -- so it is a true resample, not nearest-neighbour, and a screenshot's one-pixel rules
// and text stems survive it legibly instead of dropping out at random. Downscale only: enlarging
// a raster is not something this tool should pretend to do well, so it is refused by name.
function scale(img, dw, dh) {
	const bpp = img.bpp;
	const out = Buffer.alloc(dw * dh * bpp);
	const sx = img.w / dw, sy = img.h / dh;
	for (let dy = 0; dy < dh; dy++) {
		const y0 = Math.floor(dy * sy), y1 = Math.max(y0 + 1, Math.ceil((dy + 1) * sy));
		for (let dx = 0; dx < dw; dx++) {
			const x0 = Math.floor(dx * sx), x1 = Math.max(x0 + 1, Math.ceil((dx + 1) * sx));
			let n = 0; const acc = [0, 0, 0, 0];
			for (let y = y0; y < Math.min(y1, img.h); y++) {
				for (let x = x0; x < Math.min(x1, img.w); x++) {
					const i = (y * img.w + x) * bpp;
					for (let c = 0; c < bpp; c++) { acc[c] += img.pix[i + c]; }
					n++;
				}
			}
			const o = (dy * dw + dx) * bpp;
			for (let c = 0; c < bpp; c++) { out[o + c] = Math.round(acc[c] / n); }
		}
	}
	return { w: dw, h: dh, bpp, colour: img.colour, pix: out };
}

// Extend the canvas to W x H with WHITE, content anchored top-left. The share-card pass (Task 534)
// needed it: a card is 1200x630 and `scale` shrinks only, so a capture shorter than 630 rows had no
// route to a card at all. Padding beats upscaling here because these pages END in white -- the
// added rows are indistinguishable from the page's own margin, whereas an upscale blurs every
// glyph in the frame. White rather than transparent on purpose: a social card is composited onto
// whatever background the network chose, and a transparent one goes dark on half of them.
function pad(img, dw, dh) {
	if (dw < img.w || dh < img.h) {
		throw new Error('pad only grows; ' + img.w + 'x' + img.h + ' cannot become ' + dw + 'x' + dh);
	}
	const bpp = img.bpp;
	const out = Buffer.alloc(dw * dh * bpp, 0xff);
	for (let y = 0; y < img.h; y++) {
		img.pix.copy(out, y * dw * bpp, y * img.w * bpp, (y + 1) * img.w * bpp);
	}
	return { w: dw, h: dh, bpp, colour: img.colour, pix: out };
}

// An opaque RGBA image is a quarter bigger than it needs to be, and every screen grab is opaque.
// Dropping a channel that carries no information is not a quality decision, so it is automatic --
// but only when EVERY pixel is opaque, because a single transparent one makes it a lie.
function dropOpaqueAlpha(img) {
	if (img.bpp !== 4) { return img; }
	for (let i = 3; i < img.pix.length; i += 4) { if (img.pix[i] !== 255) { return img; } }
	const out = Buffer.alloc(img.w * img.h * 3);
	for (let p = 0, q = 0; p < img.pix.length; p += 4, q += 3) {
		out[q] = img.pix[p]; out[q + 1] = img.pix[p + 1]; out[q + 2] = img.pix[p + 2];
	}
	return { w: img.w, h: img.h, bpp: 3, colour: 2, pix: out };
}

function load(file) {
	const chunks = readChunks(fs.readFileSync(file));
	const ihdr = chunks.find(c => c.type === 'IHDR');
	if (!ihdr) { throw new Error('no IHDR'); }
	const w = ihdr.data.readUInt32BE(0), h = ihdr.data.readUInt32BE(4);
	const depth = ihdr.data[8], colour = ihdr.data[9], interlace = ihdr.data[12];
	if (depth !== 8) { throw new Error('only 8-bit images are supported; this one is ' + depth + '-bit'); }
	if (colour !== 2 && colour !== 6) { throw new Error('only RGB and RGBA are supported; colour type is ' + colour); }
	if (interlace !== 0) { throw new Error('interlaced PNGs are not supported'); }
	const bpp = colour === 6 ? 4 : 3;
	const idat = Buffer.concat(chunks.filter(c => c.type === 'IDAT').map(c => c.data));
	return { w, h, bpp, colour, pix: unfilter(zlib.inflateSync(idat), w, h, bpp) };
}

function save(file, img) {
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(img.w, 0); ihdr.writeUInt32BE(img.h, 4);
	ihdr[8] = 8; ihdr[9] = img.colour; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
	const idat = zlib.deflateSync(refilter(img.pix, img.w, img.h, img.bpp), { level: 9 });
	fs.writeFileSync(file, Buffer.concat([
		SIG, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))
	]));
}

function guardOutput(inFile, outFile) {
	if (fs.realpathSync(inFile) === (fs.existsSync(outFile) ? fs.realpathSync(outFile) : '')) {
		throw new Error('refusing to write over the input file');
	}
	if (fs.existsSync(outFile)) { throw new Error(outFile + ' already exists; refusing to overwrite'); }
}

const [mode, inFile, outFile, ...rest] = process.argv.slice(2);
if (!mode || !inFile || !outFile) {
	console.error('usage:\n  png_redact.js crop   in.png out.png X Y W H\n' +
		'  png_redact.js redact in.png out.png X,Y,W,H [X,Y,W,H ...]\n' +
		'  png_redact.js scale  in.png out.png W H\n' +
		'  png_redact.js pad    in.png out.png W H');
	process.exit(2);
}
guardOutput(inFile, outFile);
const img = load(inFile);

if (mode === 'crop') {
	const [x, y, w, h] = rest.map(Number);
	if (![x, y, w, h].every(Number.isFinite)) { throw new Error('crop needs X Y W H'); }
	const cw = Math.min(w, img.w - x), ch = Math.min(h, img.h - y);
	if (cw <= 0 || ch <= 0) { throw new Error('crop rectangle is outside the image'); }
	const out = { w: cw, h: ch, bpp: img.bpp, colour: img.colour, pix: Buffer.alloc(cw * ch * img.bpp) };
	for (let r = 0; r < ch; r++) {
		img.pix.copy(out.pix, r * cw * img.bpp,
			((y + r) * img.w + x) * img.bpp, ((y + r) * img.w + x + cw) * img.bpp);
	}
	save(outFile, out);
	console.log('cropped ' + cw + 'x' + ch + ' from ' + x + ',' + y + ' -> ' + outFile);
} else if (mode === 'scale') {
	const [w, h] = rest.map(Number);
	if (![w, h].every(Number.isFinite) || w <= 0 || h <= 0) { throw new Error('scale needs W H'); }
	if (w > img.w || h > img.h) { throw new Error('scale only shrinks; ' + img.w + 'x' + img.h + ' cannot become ' + w + 'x' + h); }
	save(outFile, dropOpaqueAlpha(scale(img, w, h)));
	console.log('scaled ' + img.w + 'x' + img.h + ' -> ' + w + 'x' + h + ' -> ' + outFile);
} else if (mode === 'pad') {
	const [w, h] = rest.map(Number);
	if (![w, h].every(Number.isFinite) || w <= 0 || h <= 0) { throw new Error('pad needs W H'); }
	save(outFile, dropOpaqueAlpha(pad(img, w, h)));
	console.log('padded ' + img.w + 'x' + img.h + ' -> ' + w + 'x' + h + ' with white -> ' + outFile);
} else if (mode === 'redact') {
	let painted = 0;
	rest.forEach(spec => {
		const [x, y, w, h] = spec.split(',').map(Number);
		if (![x, y, w, h].every(Number.isFinite)) { throw new Error('bad rectangle: ' + spec); }
		for (let r = Math.max(0, y); r < Math.min(img.h, y + h); r++) {
			for (let c = Math.max(0, x); c < Math.min(img.w, x + w); c++) {
				const i = (r * img.w + c) * img.bpp;
				img.pix[i] = 0; img.pix[i + 1] = 0; img.pix[i + 2] = 0;
				if (img.bpp === 4) { img.pix[i + 3] = 255; }
				painted++;
			}
		}
	});
	save(outFile, img);
	console.log('blacked out ' + painted + ' pixels in ' + rest.length + ' rectangle(s) -> ' + outFile);
} else {
	throw new Error('unknown mode ' + mode);
}
