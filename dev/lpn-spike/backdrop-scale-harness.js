// Task 276 — headless check of backdrop registration by NUMBER rather than by mouse.
//
//   node dev/lpn-spike/backdrop-scale-harness.js
//
// Same extract-the-function approach as recent-files-harness.js: these are pure arithmetic on
// `backdrop`, so they can be run against stubs without a browser and without the other 8,000 lines.
// The whole point of the feature is precision, and precision is exactly what a hand pass cannot
// confirm — Tom would be reading pixels off a screenshot to check a half-pixel offset.
//
// What can actually be wrong here:
//   * the pixel-size conversion, which crosses backdrop.s (scales the PLACEMENT BOX) to a number in
//     ground units per ORIGINAL image pixel, via backdrop.width/iw;
//   * the half-pixel offset — a world file's C,F name the CENTRE of the upper-left pixel, not its
//     corner, and getting that wrong shifts every image by half a pixel silently;
//   * the Y flip — the file is Cartesian (E negative), the internal frame is Y-down;
//   * the refusal cases, where accepting a rotated or mirrored file would place the image wrongly
//     with no complaint at all.

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');

function extract(name) {
	const re = new RegExp('(?:async )?function ' + name + '\\s*\\(');
	const at = src.search(re);
	if (at < 0) { throw new Error('not found: ' + name); }
	let i = src.indexOf('{', at), depth = 0, end = i;
	for (; end < src.length; end++) {
		if (src[end] === '{') { depth++; }
		else if (src[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return src.slice(at, end);
}

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }

// ---- the seams these functions touch, and nothing more ------------------
let backdrop = null;
let transforms = 0, saves = 0, alerts = [];
function applyBackdropTransform() { transforms++; }
function saveToStorage() { saves++; }
function cartesianY(y) { return -y; }              // copied intent, asserted against the real one below
function alert(m) { alerts.push(m); }
const EngCalcs = { pageConfig: {} };

eval([
	'backdropPixelSize', 'setBackdropPixelSize', 'formatPixelSize',
	'parseWorldFile', 'worldFileRepresentable', 'applyWorldFile', 'applyScaleEntry'
].map(extract).join('\n'));

// The Y flip is a one-liner in the file and a stub here; if they ever disagree every position
// assertion below is measuring the stub instead of the code.
report(/function cartesianY\(y\) \{ return -y; \}/.test(src), 'cartesianY in the file is still a plain negation');

// A 2000x1500 photo placed at the default size, then scaled by an earlier pick.
function freshBackdrop(over) {
	backdrop = Object.assign({ href: 'x', iw: 2000, ih: 1500, x: 0, y: 0, width: 40, height: 30, tx: 0, ty: 0, s: 1 }, over || {});
}

// ---- 1. pixel size is ground units per ORIGINAL pixel -------------------
freshBackdrop();
// width 40 over iw 2000 at s=1 -> 0.02 units per pixel
report(near(backdropPixelSize(), 0.02), 'pixel size reads off width/iw, not the downscaled canvas', backdropPixelSize());
freshBackdrop({ s: 3 });
report(near(backdropPixelSize(), 0.06), 'pixel size follows backdrop.s', backdropPixelSize());

// ---- 2. typing a size is the exact inverse of reading it ----------------
freshBackdrop({ s: 3 });
setBackdropPixelSize(0.5);
report(near(backdropPixelSize(), 0.5), 'set then read round-trips', backdropPixelSize());
report(near(backdrop.s, 0.5 * 2000 / 40), 'and it moved s, not width', backdrop.s);
report(transforms === 1 && saves === 1, 'setting the size redraws once and saves once');
const before = backdrop.s;
setBackdropPixelSize(0);
setBackdropPixelSize(-2);
setBackdropPixelSize(NaN);
report(backdrop.s === before, 'zero, negative and NaN sizes are refused, not applied');

// ---- 3. world file parsing ---------------------------------------------
const good = ['0.5', '0', '0', '-0.5', '1000', '2000'].join('\n');
let w = parseWorldFile(good);
report(w && w.A === 0.5 && w.D === 0 && w.B === 0 && w.E === -0.5 && w.C === 1000 && w.F === 2000,
	'six lines read as A,D,B,E,C,F in that order');
report(w && w.ok === true, 'a plain north-up file is representable');
report(!!parseWorldFile('0.5\r\n0\r\n0\r\n-0.5\r\n1000\r\n2000\r\n\r\n'), 'CRLF and trailing blank lines are tolerated');
report(parseWorldFile('0.5\n0\n0\n-0.5\n1000') === null, 'five lines is not a world file');
report(parseWorldFile('0.5\n0\n0\n-0.5\n1000\nnorth') === null, 'a non-numeric line is not a world file');
report(parseWorldFile('') === null, 'empty text is not a world file');

// ---- 4. what we refuse, and refuse LOUDLY ------------------------------
report(parseWorldFile(['0.5', '0.1', '0', '-0.5', '1000', '2000'].join('\n')).ok === false, 'rotation term D is refused');
report(parseWorldFile(['0.5', '0', '0.1', '-0.5', '1000', '2000'].join('\n')).ok === false, 'rotation term B is refused');
report(parseWorldFile(['0.5', '0', '0', '-0.25', '1000', '2000'].join('\n')).ok === false, 'uneven X/Y scale is refused');
report(parseWorldFile(['0.5', '0', '0', '0.5', '1000', '2000'].join('\n')).ok === false, 'a positive E (Y-mirrored) is refused');
report(parseWorldFile(['-0.5', '0', '0', '0.5', '1000', '2000'].join('\n')).ok === false, 'a negative A (X-mirrored) is refused');

// ---- 5. applying one puts every pixel where the file says --------------
// The contract, stated in the file's own terms: image pixel (px,py) sits at Cartesian
// (C + px*A, F + py*E), counting px,py from the upper-left CORNER in pixels.
freshBackdrop({ s: 7, tx: 123, ty: -45 });   // deliberately wrong beforehand
w = parseWorldFile(good);
applyWorldFile(w);
function cartesianOfPixel(px, py) {
	const local = { x: backdrop.x + px * backdrop.width / backdrop.iw, y: backdrop.y + py * backdrop.height / backdrop.ih };
	return { x: backdrop.tx + backdrop.s * local.x, y: -(backdrop.ty + backdrop.s * local.y) };
}
report(near(backdropPixelSize(), 0.5), 'the file sets the pixel size', backdropPixelSize());
let p = cartesianOfPixel(0.5, 0.5);
report(near(p.x, 1000) && near(p.y, 2000), 'the CENTRE of the upper-left pixel lands on C,F', JSON.stringify(p));
p = cartesianOfPixel(0, 0);
report(near(p.x, 999.75) && near(p.y, 2000.25), 'so the top-left CORNER is half a pixel out, up and left', JSON.stringify(p));
p = cartesianOfPixel(0.5, 1.5);
report(near(p.y, 1999.5), 'the next row DOWN is lower in Cartesian Y, because E is negative', p.y);
p = cartesianOfPixel(2000.5, 0.5);
report(near(p.x, 1000 + 2000 * 0.5), 'the far edge is iw pixels away at the file pixel size', p.x);

// ---- 6. the one box that takes either form -----------------------------
freshBackdrop();
alerts = [];
applyScaleEntry('  0.25  ');
report(near(backdropPixelSize(), 0.25) && alerts.length === 0, 'a bare number is a pixel size');
freshBackdrop();
applyScaleEntry(good);
report(near(backdropPixelSize(), 0.5) && near(cartesianOfPixel(0.5, 0.5).x, 1000),
	'a pasted world file sets scale AND location');
alerts = [];
applyScaleEntry('0.5\n0.1\n0\n-0.5\n1000\n2000');
report(alerts.length === 1, 'a rotated paste is refused with a message, not half-applied');
alerts = [];
applyScaleEntry('about this big');
report(alerts.length === 1, 'junk is refused with a message');
alerts = [];
applyScaleEntry('-3');
report(alerts.length === 1, 'a negative number is refused with a message');
// Number("1 2") is NaN, so a two-token line must fall through to the world-file branch and be
// refused there rather than being read as 1.
alerts = [];
applyScaleEntry('1 2');
report(alerts.length === 1, 'two numbers on one line is not a pixel size');

// ---- 7. formatting the prefill -----------------------------------------
report(formatPixelSize(0.5) === '0.5', 'a round number prefills without trailing zeros');
report(formatPixelSize(1 / 3) === '0.33333333', 'a long number prefills at eight significant digits', formatPixelSize(1 / 3));
report(formatPixelSize(0) === '', 'no image, no prefill');

console.log(`\n${checks - failures}/${checks} passed`);
process.exit(failures ? 1 : 0);
