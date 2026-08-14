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

// ---- 8. the menu rows, and the heading the bare verbs depend on ---------
// Tom, 2026-08-13, asked for "Scale by picking" / "Scale by World File or pixel size" parallel to
// "Move". Bare verbs are only correct while BOTH doors print "Background image" over them --
// without that heading this set reverts to the exact defect the 2026-08-04 ruling named, and it
// reverts silently, because a menu of orphaned verbs still renders perfectly.
{
	const rowSrc = extract('backdropRows');
	let backdropAction = function () { };
	let rows;
	eval(rowSrc);

	backdrop = null;
	rows = backdropRows(true);
	// The Insert door passes withHeading. Tom, 2026-08-13: in Insert the heading "has a place, however
	// unconventional" -- it is the only thing there naming what Add/Move/Remove act on.
	report(rows[0] && rows[0].heading === true, 'the Insert door leads with a heading, not a command');
	report(/Background image/.test(rows[0].label), 'and it names the object the verbs below it act on', rows[0].label);

	// The toolbar-button door does NOT, because the button you just clicked already says it. Tom,
	// 2026-08-13: "remove the top wording from the Background image menu. It's unnecessarily
	// redundant."
	const barerows = backdropRows();
	report(!barerows.some(r => r.heading), 'the button door has no heading — the button already says it');
	report(barerows.length === rows.length - 1, 'and is otherwise the same rows', barerows.length);

	const commands = rows.filter(r => !r.heading);
	report(commands.length === 5, 'five commands: add, scale by picking, scale by entry, move, remove', commands.length);
	report(commands.every(r => typeof r.fn === 'function'), 'every command row is wired to a function');
	// With no image, only Add can do anything.
	report(commands[0].disabled !== true, 'Add works with no image present');
	report(commands.slice(1).every(r => r.disabled === true), 'the other four are disabled with no image');

	freshBackdrop();
	report(backdropRows().filter(r => !r.heading).every(r => !r.disabled), 'all five enable once an image is present');

	// ONE definition, two doors. A second literal list is how the toolbar and the Insert menu drifted
	// apart before, and it is invisible until somebody opens both and compares.
	report(/\.concat\(backdropRows\(true\)\)/.test(src), 'the Insert menu reuses backdropRows() rather than restating it');
	report((src.match(/lpn_backdrop_scale_entry \|\|/g) || []).length === 1,
		'each backdrop label has exactly one call site', (src.match(/lpn_backdrop_scale_entry \|\|/g) || []).length);
	// The toolbar control is a BUTTON now; a <select> is as wide as its widest option, which is what
	// made a long command name cost toolbar width.
	report(/menu = document\.createElement\('button'\)/.test(src), 'the toolbar control is a button, not a select');
}

// ---- 9. the English labels are the ones Tom approved --------------------
{
	const en = fs.readFileSync(path.join(__dirname, '../../lib/lang.ec.en.php'), 'utf8');
	function val(key) {
		const m = en.match(new RegExp("\\$ec_lang\\['" + key + "'\\]='((?:[^'\\\\]|\\\\.)*)'"));
		return m ? m[1].replace(/\\'/g, "'") : null;
	}
	report(val('lpn_backdrop_scale') === 'Scale by picking', 'lpn_backdrop_scale', val('lpn_backdrop_scale'));
	// Reworded in Task 297's Wave 0 and re-approved by Tom on 2026-08-13. "Pixel size" read just as
	// easily as the image's pixel DIMENSIONS; "on the map" is Tom's own qualifier ("'map' is better
	// than real world or real").
	report(val('lpn_backdrop_scale_entry') === 'Scale by world file or by the size of one pixel on the map', 'lpn_backdrop_scale_entry', val('lpn_backdrop_scale_entry'));
	report(val('lpn_backdrop_position') === 'Move', 'lpn_backdrop_position', val('lpn_backdrop_position'));
	// Parallel or not at all: a set where one member still names the object reads as an oversight,
	// which is the drift Tom keeps catching by eye.
	// We never ask for a world file AS A FILE (Task 297). These three keys backed a dialog that
	// opened a second file picker; if one comes back, so has the ask.
	report(['lpn_backdrop_wld_ask', 'lpn_backdrop_wld_none', 'lpn_backdrop_wld_choose'].every(k => val(k) === null),
		'no key asks for a world file as a file — we take a paste of its contents');
	const set = ['lpn_backdrop_add', 'lpn_backdrop_scale', 'lpn_backdrop_scale_entry', 'lpn_backdrop_position', 'lpn_backdrop_remove'];
	report(set.every(k => !/\bimage\b/i.test(val(k) || '')), 'no member of the set repeats "image" — the heading carries it');
}

console.log(`\n${checks - failures}/${checks} passed`);
process.exit(failures ? 1 : 0);
