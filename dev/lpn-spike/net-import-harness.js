// Headless check of js/lpn-net.js -- reading EPANET's BINARY project file (`.net`).
//
//   node dev/lpn-spike/net-import-harness.js
//
// WHY A HARNESS AND NOT JUST THE REAL FILES. The real files are the best evidence there is, and
// they are also client work that cannot live in this repo (see .gitignore). So this harness has two
// halves. The first ALWAYS runs: it ENCODES a known network into the `.net` value stream, decodes
// it back through the shipped reader, and compares the result against a hand-written `.inp` of the
// same network. That is a genuine round trip -- the expected text is written out by hand here, not
// produced by the code under test -- and it exercises every value type, all six element kinds,
// vertices, labels and the backdrop record without shipping anybody's model.
//
// The second half runs only when dev/epanet-models/ is present: it converts each real `.net` with
// BOTH readers, the JS one and dev/scripts/epanet_net_to_inp.php, and requires byte-identical
// output. Two implementations of an undocumented format agreeing on a real file is the strongest
// check available, and it is what keeps the PHP fixture tool and the shipped browser reader from
// drifting apart.
//
// The integrity check gets its own tests, because it is the whole reason reading an undocumented
// binary is defensible: a file whose header counts disagree with what the walk found must be
// REFUSED, not read as a plausible-looking different network.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..') + path.sep;
const EngCalcs = require(ROOT + 'js/lpn-net.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// ---------------------------------------------------------------------------
// A writer for the value stream, so the reader can be tested against something
// other than itself.
// ---------------------------------------------------------------------------
function Writer() { this.b = []; }
Writer.prototype.byte = function (v) { this.b.push(v & 0xff); return this; };
Writer.prototype.i8 = function (v) { return this.byte(0x02).byte(v < 0 ? v + 256 : v); };
Writer.prototype.i16 = function (v) { return this.byte(0x03).byte(v & 0xff).byte((v >> 8) & 0xff); };
Writer.prototype.str = function (s) {
	this.byte(0x06).byte(s.length);
	for (let i = 0; i < s.length; i++) { this.byte(s.charCodeAt(i)); }
	return this;
};
// An empty property is written as a zero-length WIDE string -- the shape that dominates a real
// file, and the one most likely to be mis-sized by a reader (a 4-byte CHARACTER count, then two
// bytes per character).
Writer.prototype.ws = function (s) {
	s = s || '';
	this.byte(0x12).byte(s.length & 0xff).byte((s.length >> 8) & 0xff).byte(0).byte(0);
	for (let i = 0; i < s.length; i++) { this.byte(s.charCodeAt(i) & 0xff).byte(s.charCodeAt(i) >> 8); }
	return this;
};
Writer.prototype.bool = function (v) { return this.byte(v ? 0x09 : 0x08); };
Writer.prototype.list = function (items, how) {
	this.byte(0x01);
	items.forEach((x) => how.call(this, x));
	return this.byte(0x00);
};
// Intel 80-bit extended: sign, 15-bit exponent, and a 64-bit mantissa WITH its integer bit
// explicit. BigInt, because the mantissa does not fit a JS number exactly.
Writer.prototype.ext = function (v) {
	this.byte(0x05);
	if (v === 0) { for (let i = 0; i < 10; i++) { this.byte(0); } return this; }
	const neg = v < 0, a = Math.abs(v), e = Math.floor(Math.log2(a));
	let m = BigInt(Math.round((a / Math.pow(2, e)) * Math.pow(2, 63)));
	if (m >= (1n << 64n)) { m = (1n << 64n) - 1n; }
	for (let i = 0; i < 8; i++) { this.byte(Number((m >> BigInt(8 * i)) & 0xffn)); }
	const exp = e + 16383;
	this.byte(exp & 0xff).byte(((exp >> 8) & 0x7f) | (neg ? 0x80 : 0));
	return this;
};
Writer.prototype.props = function (n, values) {
	this.i8(n);
	for (let i = 0; i < n; i++) {
		const v = values[i];
		if (v === undefined || v === '') { this.ws(''); } else { this.str(String(v)); }
	}
	return this;
};
Writer.prototype.bytes = function () { return new Uint8Array(this.b); };

// ---------------------------------------------------------------------------
// One known network, encoded.
// ---------------------------------------------------------------------------
// Slot order, from js/lpn-net.js: node = desc, tag, elev, demand, pattern, ndemands, emitter, ...;
// pipe = desc, tag, length, diameter, roughness, mloss, status; pump = ..., curve at slot 2;
// valve = ..., diameter, type, setting, mloss at slots 2-5.
function buildNet(opts) {
	const o = opts || {};
	const w = new Writer();
	w.str('<EPANET2>').i16(20201);
	// The ten header counts: junctions, reservoirs, tanks, pipes, pumps, valves, labels, patterns,
	// curves, and a trailing 2 whose meaning is unknown and unused.
	[o.juncCount === undefined ? 2 : o.juncCount, 1, 0, 1, 1, 1, 1, 0, 1, 2].forEach((c) => w.i8(c));
	w.ws('');                       // title
	w.list([], w.str);              // notes
	w.i8(45);                       // option count
	const options = new Array(45).fill('');
	options[0] = 'GPM'; options[1] = 'H-W'; options[2] = '1'; options[3] = '1';
	options[4] = '40'; options[5] = '0.001'; options[6] = 'Continue'; options[7] = '1';
	options[8] = '1.0'; options[9] = '0.5'; options[10] = 'No'; options[11] = 'None';
	options[12] = 'mg/L'; options[13] = '1'; options[15] = '0.01';
	options.forEach((s) => (s === '' ? w.ws('') : w.str(s)));
	w.bool(false);

	w.i8(0);                        // patterns
	w.i8(1);                        // curves
	w.str('C1').str('the pump').str('PUMP')
		.list(['0', '500', '1000'], w.str)
		.list(['220', '190', '120'], w.str);

	w.i8(o.juncCount === undefined ? 2 : o.juncCount);   // junctions
	w.str('J1').ext(100).ext(200).props(27, ['a junction', '', '95', '120', '', '1', '', '', '', '', 'CONCEN']).list([], w.str);
	w.str('J2').ext(300).ext(200).props(27, ['', '', '90', '0', '', '1', '2.5', '', '', '', 'CONCEN']).list([], w.str);
	w.i8(1);                        // reservoirs
	w.str('R1').ext(0).ext(200).props(27, ['', '', '260', '', '', '', '', '', '', '', 'CONCEN']);
	w.i8(0);                        // tanks

	w.i8(1);                        // pipes
	w.str('P1').str('J1').str('J2').i8(2).ext(150).ext(250).ext(250).ext(250)
		.props(26, ['a pipe', '', '1200', '12', '130', '2', 'Open']);
	w.i8(1);                        // pumps
	w.str('PU1').str('R1').str('J1').i8(0).props(26, ['', '', 'C1', '', '', '', 'Open']);
	w.i8(1);                        // valves
	w.str('V1').str('J2').str('J1').i8(0).props(26, ['', '', '8', 'TCV', '12', '3', 'Open']);

	w.list([], w.str);              // controls
	w.list([], w.str);              // rules
	w.i8(1);                        // labels
	w.str('Title block').ext(50).ext(400).ws('').str('Arial').i8(12).bool(true).bool(false).i8(0).ws('');
	w.ext(0).ext(0).ext(400).ext(500);                    // map extent
	w.i8(3).str('C:\\maps\\base.wmf').ext(0).ext(0);      // backdrop
	w.i8(0);                        // trailer: not read, present so the stream is realistic
	return w.bytes();
}

const EXPECTED = [
	'[TITLE]',
	'Converted from fixture.net by js/lpn-net.js',
	'',
	'[JUNCTIONS]',
	';ID                 Elev         Demand       Pattern',
	' J1                 95           120          ',
	' J2                 90           0            ',
	'',
	'[RESERVOIRS]',
	';ID                 Head         Pattern',
	' R1                 260          ',
	'',
	'[PIPES]',
	';ID             Node1              Node2              Length    Diameter  Roughness MinorLoss Status',
	' P1             J1                 J2                 1200      12        130       2        Open',
	'',
	'[PUMPS]',
	';ID             Node1              Node2              Parameters',
	' PU1            R1                 J1                 HEAD C1',
	'',
	'[VALVES]',
	';ID             Node1              Node2              Diameter  Type     Setting      MinorLoss',
	' V1             J2                 J1                 8         TCV      12           3',
	'',
	'[EMITTERS]',
	';Junction           Coefficient',
	' J2                 2.5',
	'',
	'[CURVES]',
	';ID                 X            Y',
	';PUMP: the pump',
	' C1                 0            220',
	' C1                 500          190',
	' C1                 1000         120',
	'',
	'[OPTIONS]',
	' Units                GPM',
	' Headloss             H-W',
	' Specific Gravity     1',
	' Viscosity            1',
	' Trials               40',
	' Accuracy             0.001',
	' Unbalanced           Continue',
	' Demand Multiplier    1.0',
	' Emitter Exponent     0.5',
	' Diffusivity          1',
	' Tolerance            0.01',
	'',
	'[COORDINATES]',
	';Node               X-Coord          Y-Coord',
	' J1                 100              200',
	' J2                 300              200',
	' R1                 0                200',
	'',
	'[VERTICES]',
	';Link               X-Coord          Y-Coord',
	' P1                 150              250',
	' P1                 250              250',
	'',
	'[LABELS]',
	';X-Coord          Y-Coord          Label & Anchor Node',
	' 50               400              "Title block" ',
	'',
	'[BACKDROP]',
	' DIMENSIONS   0  0  400  500',
	' FILE         C:\\maps\\base.wmf',
	' OFFSET       0  0',
	'',
	'[END]',
	''
].join('\n');

// ---------------------------------------------------------------------------
console.log('\n--- a .net built here, read back by the shipped reader ---');
{
	const bytes = buildNet();
	ok('the magic is recognised', EngCalcs.lpnLooksLikeNet(bytes) === true);
	ok('a text file is NOT mistaken for one',
		EngCalcs.lpnLooksLikeNet(new Uint8Array(Buffer.from('[TITLE]\nhello\n'))) === false);

	const r = EngCalcs.lpnNetToInp(bytes, 'fixture.net');
	ok('it converts', r.ok, r.ok ? 'version ' + r.version : r.error + ' ' + r.detail);
	if (r.ok) {
		// Compared field by field, not byte for byte. EXPECTED is HAND-WRITTEN from the fixture's
		// own values -- that is what makes this a test rather than a snapshot of whatever the code
		// happens to do today -- and hand-writing column padding to the character teaches nothing.
		// The exact spacing is guarded far better below, by requiring byte-identical output from an
		// independent implementation on real files.
		const norm = (s) => s.split('\n').map((l) => l.replace(/[ \t]+/g, ' ').replace(/\s+$/, '')).join('\n');
		if (norm(r.inp) !== norm(EXPECTED)) {
			const a = norm(EXPECTED).split('\n'), b = norm(r.inp).split('\n');
			for (let i = 0; i < Math.max(a.length, b.length); i++) {
				if (a[i] !== b[i]) {
					console.log('       first difference at line ' + (i + 1));
					console.log('       expected: ' + JSON.stringify(a[i]));
					console.log('       got:      ' + JSON.stringify(b[i]));
					break;
				}
			}
		}
		// The expected text above is HAND-WRITTEN, not captured from this code. That is what makes
		// this a test rather than a snapshot of whatever it happens to do today.
		ok('...to exactly the .inp that network should be', norm(r.inp) === norm(EXPECTED));
	}
}

// ---------------------------------------------------------------------------
console.log('\n--- and the .inp reader then agrees about the network ---');
{
	require(ROOT + 'js/lpn-inp.js');
	const parsed = EngCalcs.lpnInpParse(EngCalcs.lpnNetToInp(buildNet(), 'fixture.net').inp);
	ok('it parses as a network', parsed.ok);
	ok('2 junctions, 1 reservoir', parsed.nodes.length === 3, parsed.nodes.length);
	ok('the valve became a pipe, so 3 links', parsed.links.length === 3, parsed.links.length);
	// 12 in, in the file's OWN pipe-diameter unit -- the reader converts nothing, so a pass-through
	// is exact (see the units note at the top of js/lpn-inp.js). The one number that proves the
	// slot map put diameter and roughness in the right columns, since swapping them still solves.
	const p1 = parsed.links.find((l) => l.id === 'P1');
	ok('the pipe is 12 in and C = 130, not the other way round',
		p1.diameter === 12 && p1.roughness === 130,
		p1.diameter + ' in, C=' + p1.roughness);
	ok('the emitter came across', parsed.nodes.find((n) => n.id === 'J2').emitter > 0);
	ok('the pump found its curve', parsed.links.find((l) => l.id === 'PU1').curvePoints.length === 3);
	ok('the backdrop is reported as a name we do not have',
		parsed.dropped.some((d) => d.code === 'backdrop-not-embedded'));
}

// ---------------------------------------------------------------------------
console.log('\n--- a file the reader does not really understand is REFUSED ---');
{
	// The header says three junctions; the walk finds two. In a real drift this is what a moved
	// section looks like from the outside, and reading on would produce a network that solves and
	// is not the one in the file.
	const bad = buildNet({ juncCount: 2 });
	// Byte 15: the magic is 11 bytes (type, length, "<EPANET2>"), the version is 3 more, then the
	// first header count is a type byte and a value.
	bad[15] = 3;
	const r = EngCalcs.lpnNetToInp(bad, 'bad.net');
	ok('it is refused', r.ok === false && r.error === 'section-mismatch', r.error + ': ' + r.detail);
	ok('...and says which section disagreed', /junctions/.test(r.detail || ''), r.detail);

	const notNet = EngCalcs.lpnNetToInp(new Uint8Array(Buffer.from('[TITLE]\nx\n')), 'x.inp');
	ok('a non-.net is reported as such, not as damage', notNet.ok === false && notNet.error === 'not-a-net');

	const truncated = buildNet().slice(0, 60);
	const t = EngCalcs.lpnNetToInp(truncated, 'cut.net');
	ok('a truncated file is refused rather than half-read', t.ok === false, t.error);
}

// ---------------------------------------------------------------------------
// Real models, when they are here. They are client work and are gitignored, so this half is
// skipped rather than failed on a clean checkout.
// ---------------------------------------------------------------------------
console.log('\n--- the two readers on real models ---');
{
	const dir = ROOT + 'dev/epanet-models';
	let files = [];
	try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.net')); } catch (err) { files = []; }
	if (!files.length) {
		console.log('  skip  no dev/epanet-models/*.net here (they are gitignored client models)');
	} else {
		files.forEach((f) => {
			const bytes = new Uint8Array(fs.readFileSync(path.join(dir, f)));
			const js = EngCalcs.lpnNetToInp(bytes, f);
			if (!js.ok) { ok(f + ' converts', false, js.error + ' ' + js.detail); return; }
			let php;
			try {
				php = execFileSync('php', [ROOT + 'dev/scripts/epanet_net_to_inp.php', path.join(dir, f)],
					{ encoding: 'utf8', maxBuffer: 1 << 24 });
			} catch (err) {
				console.log('  skip  ' + f + ': php not runnable here');
				return;
			}
			// The one legitimate difference is the line each tool signs its own name on.
			const mine = js.inp.replace('by js/lpn-net.js', 'by dev/scripts/epanet_net_to_inp.php');
			ok(f + ': the browser reader and the PHP tool produce identical .inp', mine === php,
				mine === php ? js.inp.split('\n').length + ' lines' : 'differ');
		});
	}
}

// ---- AN OPTION SLOT WITH NO NAME IS REPORTED, NOT DROPPED IN SILENCE -------------------------
//
// **TOM FOUND THIS BY IMPORTING THE OTHER FORMAT** (2026-09-02: *"The message appears when
// importing a .inp, but not a .net with PDA."*). `js/lpn-inp.js` had just stopped keeping a list of
// what to CARRY in favour of a list of what it READS; this file still kept the first kind, and
// `OPTION_NAME` names 12 of the 45 slots a `.net` can hold. The repair from the other file does not
// transfer: an `.inp` option carries its own keyword and can go back out verbatim, while a `.net`
// option is an INDEXED SLOT with no name anywhere in the file, so inventing one would write a
// setting the user never made. What can be done is to say so, and that is what is asserted here.
//
// The fixture already populated two such slots and nobody had noticed: 10 (`No`) and 12 (`mg/L`).
// A chlorine unit disappearing without a word is the shape of the defect.
console.log('\n--- an option this reader cannot name is reported ---');
{
	const conv = EngCalcs.lpnNetToInp(buildNet(), 'unnamed.net');
	ok('the file still converts', conv.ok === true, conv.error);
	const idx = (conv.unnamedOptions || []).map((u) => u.index);
	ok('the populated slots with no name are handed back', idx.length >= 2, JSON.stringify(idx));
	ok('...and slot 12 is among them, which is where the fixture puts mg/L',
		idx.indexOf(12) >= 0, JSON.stringify(conv.unnamedOptions));
	// The named ones must NOT be reported as losses -- a report that cries about everything is one
	// nobody reads.
	ok('a slot this reader does know is not reported as lost',
		idx.indexOf(0) < 0 && idx.indexOf(8) < 0, JSON.stringify(idx));
	ok('...nor is the pattern slot, which is written under its own name',
		idx.indexOf(7) < 0, JSON.stringify(idx));
	// An empty slot is not a loss either: 45 slots, most of them blank.
	ok('an empty slot is not reported', idx.indexOf(20) < 0, JSON.stringify(idx));
	// And the text itself is unchanged by the collection -- this must observe, never edit.
	ok('the converted file still states the options it can name',
		conv.inp.indexOf('Demand Multiplier') >= 0 && conv.inp.indexOf('Emitter Exponent') >= 0);
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
