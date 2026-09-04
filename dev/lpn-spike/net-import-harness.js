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
// The THIRD half is the strongest and it is in the repo, because EPA's own Net1, Net2 and Net3 are
// published examples rather than anybody's client work: `dev/net-import-study/All-three/` holds each
// model's `.net` beside the `.inp` EPANET ITSELF wrote back out from that `.net`. The second file is
// the answer key, written by the program that owns the format, and it is what decoded `[REACTIONS]`.
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
	// **THE SLOTS THIS READER CANNOT NAME, POPULATED ON PURPOSE.** Without them the report path
	// below would assert on an empty list and pass whatever the code did. Slot 17 holds `1` and so
	// do BOTH `Order Bulk` and `Order Tank` in all three reference models, so nothing separates
	// them; 39 and 40 hold `0` and EPANET's own export states no keyword carrying it.
	options[17] = '1'; options[39] = '0'; options[40] = '0';
	// `[REACTIONS]`. The wall order is stored as a WORD and written as a number; the two
	// coefficients carry Net1's own values, which are what made the slot numbers legible.
	options[18] = 'First'; options[19] = '-.5'; options[20] = '-1';
	options[21] = '0.0'; options[22] = '0.0';
	// **THE SLOTS TOM'S OWN Net3 IDENTIFIED**, at the indices his import report printed, carrying
	// the values EPANET wrote for the same model. This fixture is the confirmation kept in code:
	// dev/net-import-study/Net3-PDA-from-EPANET.inp states every one of these lines, so the
	// expectation below is EPANET's own output rather than ours restated.
	options[23] = '24:00'; options[24] = '1:00'; options[25] = '0:05'; options[26] = '1:00';
	options[27] = '0:00'; options[28] = '1:00'; options[29] = '0:00'; options[30] = '12 am';
	options[31] = 'NONE';
	options[32] = '75'; options[33] = '0.0'; options[35] = '0.0';   // 34 Global Pattern: empty here
	options[36] = '2'; options[37] = '10'; options[38] = '0';
	options[41] = 'PDA'; options[42] = '0'; options[43] = '0.1'; options[44] = '0.5';
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
	// **THE THREE SECTIONS NOTHING WROTE BEFORE 2026-09-02.** Every line here is one EPANET itself
	// wrote for the same model (dev/net-import-study/Net3-PDA-from-EPANET.inp), so this expectation
	// is the other tool's output rather than ours restated. `[TIMES]` is the one that matters: a
	// `.net` used to arrive with no clock at all, and an extended-period model became one instant.
	'[ENERGY]',
	';Global energy settings',
	' Global Efficiency    75',
	' Global Price         0.0',
	' Demand Charge        0.0',
	'',
	// **EVERY LINE HERE IS ONE EPANET ITSELF WROTE**, copied out of
	// dev/net-import-study/All-three/2-EPANET-NET-back-to-INP/Net1.inp, whose `.net` states `-.5`
	// at slot 19 and `-1` at slot 20. `Order Bulk 1` and `Order Tank 1` stand in that same file and
	// are deliberately NOT here: slot 17 holds `1` and nothing in any of the three models
	// distinguishes the two, so it is reported to the user rather than named.
	'[REACTIONS]',
	';Global reaction settings',
	' Order Wall           1',
	' Global Bulk          -.5',
	' Global Wall          -1',
	' Limiting Potential   0.0',
	' Roughness Correlation 0.0',
	'',
	'[TIMES]',
	';Clock and reporting',
	' Duration             24:00',
	' Hydraulic Timestep   1:00',
	' Quality Timestep     0:05',
	' Pattern Timestep     1:00',
	' Pattern Start        0:00',
	' Report Timestep      1:00',
	' Report Start         0:00',
	' Start ClockTime      12 am',
	' Statistic            NONE',
	'',
	// Status is EPANET's, and it lives in [REPORT] -- not in [OPTIONS], where an inferred map put
	// it before the indices were measured.
	'[REPORT]',
	';EPANET report settings',
	' Status               No',
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
	' CheckFreq            2',
	' MaxCheck             10',
	' DampLimit            0',
	' Demand Model         PDA',
	' Minimum Pressure     0',
	' Required Pressure    0.1',
	' Pressure Exponent    0.5',
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
	ok('the populated slots with no name are handed back', idx.length >= 1, JSON.stringify(idx));
	ok('...and slot 17 is among them, the one no evidence separates',
		idx.indexOf(17) >= 0, JSON.stringify(conv.unnamedOptions));
	ok('...as are 39 and 40, which EPANET\'s own export matches nowhere',
		idx.indexOf(39) >= 0 && idx.indexOf(40) >= 0, JSON.stringify(idx));
	// The other side of the same rule: a slot that IS now written must stop being reported, or the
	// report cries about a setting that came across intact.
	ok('the reaction slots that are written are no longer reported',
		[18, 19, 20, 21, 22].every((i) => idx.indexOf(i) < 0), JSON.stringify(idx));
	// **THE INDEX TRAVELS WITH THE VALUE.** An inferred slot map built from a list of values alone
	// went into a converted file on 2026-09-02 and was wrong -- the values were right and the
	// offsets were not. A reader can read a value back but cannot COUNT it back, so the report
	// prints `index: value` and the next real file states its own slot numbers.
	ok('every reported slot carries its index as well as its value',
		(conv.unnamedOptions || []).every((u) => typeof u.index === 'number' && u.value !== undefined),
		JSON.stringify(conv.unnamedOptions));
	// The named ones must NOT be reported as losses -- a report that cries about everything is one
	// nobody reads.
	ok('a slot this reader does know is not reported as lost',
		idx.indexOf(0) < 0 && idx.indexOf(8) < 0, JSON.stringify(idx));
	ok('...nor is the pattern slot, which is written under its own name',
		idx.indexOf(7) < 0, JSON.stringify(idx));
	// An empty slot is not a loss either: 45 slots, most of them blank. Slot 16 is empty in the
	// fixture and in all three reference models, and is the one slot that might or might not belong
	// to `[REACTIONS]` -- the evidence cannot say, and an empty slot costs nothing either way.
	ok('an empty slot is not reported', idx.indexOf(16) < 0, JSON.stringify(idx));
	// And the text itself is unchanged by the collection -- this must observe, never edit.
	ok('the converted file still states the options it can name',
		conv.inp.indexOf('Demand Multiplier') >= 0 && conv.inp.indexOf('Emitter Exponent') >= 0);
}

// ---------------------------------------------------------------------------
// THE THREE EPA REFERENCE MODELS, AGAINST EPANET'S OWN EXPORT OF THE SAME FILE.
//
// These are not client work -- they are EPA's published examples -- so unlike dev/epanet-models/
// they are IN the repo, and this is the strongest check in the file: EPANET opened each `.inp`,
// saved a `.net`, and wrote an `.inp` back out from that `.net`. The middle file is our input and
// the last one is the answer key, written by the program that owns the format.
//
// It is deliberately a KEYWORD comparison and not a text one. A keyword we write must carry
// EPANET's own value for that model; a keyword we do not write must be one we have said we cannot
// name. Anything else -- a keyword nobody expected, on either side -- is a failure, so a future
// slot named by a guess cannot slip through by merely looking plausible.
// ---------------------------------------------------------------------------
console.log('\n--- the three reference models, against EPANET\'s own export ---');
{
	const dir = ROOT + 'dev/net-import-study/All-three';
	const models = ['Net1', 'Net2', 'Net3-PDA'];
	const REACTION_KEYWORDS = ['Order Bulk', 'Order Tank', 'Order Wall', 'Global Bulk',
		'Global Wall', 'Limiting Potential', 'Roughness Correlation'];
	// The two keywords EPANET writes that this reader will not: they share slot 17, both read `1`
	// in all three models, and no value anywhere separates them.
	const NOT_OURS = ['Order Bulk', 'Order Tank'];
	// Slot 17 is the pair above; 39 and 40 are `0` in all three and match nothing EPANET states.
	const STILL_UNNAMED = [17, 39, 40];

	// Every line of a named section, split into keyword and value against a known keyword list --
	// splitting on whitespace would read `Start ClockTime 12 am` as a keyword of three words. A
	// section name may appear more than once (EPANET writes `[REACTIONS]` twice) and all of them
	// count.
	function keyedSection(text, name, keywords) {
		const out = {};
		let inside = false;
		text.split(/\r?\n/).forEach((raw) => {
			const line = raw.replace(/;.*$/, '').replace(/\s+$/, '');
			if (/^\s*\[/.test(line)) { inside = new RegExp('^\\s*\\[' + name + '\\]').test(line); return; }
			if (!inside || line.trim() === '') { return; }
			const t = line.trim();
			const kw = keywords.filter((k) => t.toUpperCase().indexOf(k.toUpperCase()) === 0)
				.sort((a, b) => b.length - a.length)[0];
			if (kw === undefined) { out['?? ' + t] = t; return; }
			out[kw] = t.slice(kw.length).trim();
		});
		return out;
	}

	models.forEach((m) => {
		const netPath = path.join(dir, '1-EPANET-INP-to-NET', m + '.net');
		const refPath = path.join(dir, '2-EPANET-NET-back-to-INP', m + '.inp');
		let bytes, ref;
		try {
			bytes = new Uint8Array(fs.readFileSync(netPath));
			ref = fs.readFileSync(refPath, 'utf8');
		} catch (err) {
			console.log('  skip  ' + m + ': ' + err.message);
			return;
		}
		const conv = EngCalcs.lpnNetToInp(bytes, m + '.net');
		ok(m + ': the .net converts', conv.ok === true, conv.ok ? '' : conv.error + ' ' + conv.detail);
		if (!conv.ok) { return; }

		const theirs = keyedSection(ref, 'REACTIONS', REACTION_KEYWORDS);
		const ours = keyedSection(conv.inp, 'REACTIONS', REACTION_KEYWORDS);
		const bad = Object.keys(ours).filter((k) => theirs[k] !== ours[k]);
		ok(m + ': every [REACTIONS] line matches EPANET\'s own value', bad.length === 0,
			bad.length ? bad.map((k) => k + ': ours ' + JSON.stringify(ours[k]) +
				' vs EPANET ' + JSON.stringify(theirs[k])).join('; ')
				: Object.keys(ours).length + ' keywords');
		const missing = Object.keys(theirs).filter((k) => ours[k] === undefined);
		ok(m + ': ...and the only ones we do not write are the pair we cannot name',
			missing.length === NOT_OURS.length && NOT_OURS.every((k) => missing.indexOf(k) >= 0),
			JSON.stringify(missing));

		const idx = (conv.unnamedOptions || []).map((u) => u.index);
		ok(m + ': the slots this reader still cannot name are exactly ' + STILL_UNNAMED.join(', '),
			idx.length === STILL_UNNAMED.length && STILL_UNNAMED.every((i) => idx.indexOf(i) >= 0),
			JSON.stringify(conv.unnamedOptions));

		// And the PHP fixture tool must agree byte for byte, as it does for dev/epanet-models/.
		let php;
		try {
			php = execFileSync('php', [ROOT + 'dev/scripts/epanet_net_to_inp.php', netPath],
				{ encoding: 'utf8', maxBuffer: 1 << 24 });
		} catch (err) {
			console.log('  skip  ' + m + ': php not runnable here');
			return;
		}
		const mine = conv.inp.replace('by js/lpn-net.js', 'by dev/scripts/epanet_net_to_inp.php');
		ok(m + ': the browser reader and the PHP tool produce identical .inp', mine === php,
			mine === php ? conv.inp.split('\n').length + ' lines' : 'differ');
	});
}

// ---- A RESERVOIR'S PATTERN IS ITS OWN SLOT, NOT A JUNCTION'S ---------------------------------
//
// **THIS SHIPPED AND EPANET REFUSED THE FILE.** A junction's props hold demand at 3 and its pattern
// at 4; a reservoir has no demand, so its head pattern is at 3 and its INITIAL QUALITY at 4.
// Reading it as a junction's wrote Net1's reservoir chlorine (1.0) into the pattern column, and the
// engine answered `Error 205: undefined time pattern 1.0 in [RESERVOIRS] section` and then refused
// the whole input. Tom found it by opening the EPANET run report, which is the one place the
// offending line is named -- no check could see it, because a `.inp` that converts is not a `.inp`
// that solves.
//
// The expectation is EPANET's OWN export of the same `.net`, in 2-EPANET-NET-back-to-INP/: it
// writes reservoir 9 with an empty pattern column, and it lists node 9's initial quality as 1.0.
console.log('\n--- a reservoir takes its pattern from its own slot ---');
{
	const dir = path.join(ROOT, 'dev', 'net-import-study', 'All-three');
	const netFile = path.join(dir, '1-EPANET-INP-to-NET', 'Net1.net');
	if (!fs.existsSync(netFile)) {
		console.log('  skip  the Net1 corpus is not here');
	} else {
		const conv = EngCalcs.lpnNetToInp(new Uint8Array(fs.readFileSync(netFile)), 'Net1.net');
		ok('Net1 converts', conv.ok === true, conv.error);
		const rows = (conv.inp.match(/\[RESERVOIRS\][^[]*/) || [''])[0]
			.split('\n').filter((l) => l.trim() && !/^;|^\[/.test(l));
		ok('it has the one reservoir', rows.length === 1, JSON.stringify(rows));
		const toks = (rows[0] || '').trim().split(/\s+/);
		ok('...whose id and head are right', toks[0] === '9' && toks[1] === '800', JSON.stringify(toks));
		// The whole of it: a third token here is a pattern name, and 1.0 is a concentration.
		ok('...and it names NO head pattern, as EPANET does not either',
			toks.length === 2, JSON.stringify(toks));
		const epanet = path.join(dir, '2-EPANET-NET-back-to-INP', 'Net1.inp');
		if (fs.existsSync(epanet)) {
			const src = fs.readFileSync(epanet, 'utf8');
			const q = (src.match(/\[QUALITY\][^[]*/) || [''])[0];
			ok('and EPANET states 1.0 as that node\'s INITIAL QUALITY, which is what was misread',
				/^\s*9\s+1\.0\s*$/m.test(q), 'node 9 not found in [QUALITY]');
		}
	}
}

// ---- INITIAL QUALITY, FROM THE SLOT EACH NODE KIND KEEPS IT IN -------------------------------
//
// **NOTHING WROTE `[QUALITY]` AT ALL**, so a `.net` arrived with no starting concentrations and a
// chemical run began from zero everywhere (Tom, 2026-09-04: *"Initial quality for the reservoir did
// not come in. It's 1.0 in EPANET, but nothing in lpn Net1.net."*). The same silent loss `[TIMES]`
// had, and the same fix: read it from the slot, and check the slot against EPANET.
//
// **THREE KINDS, THREE DIFFERENT INDICES**, which is the whole reason this was worth measuring
// rather than assuming: a junction keeps it at 7, a reservoir at 4 (its array has no demand), and
// a tank at 12 (its six geometry values and its mixing model come first). Slot 9 on a tank returns
// the string `Mixed`, which is what a plausible guess would have written into a concentration
// column. The expectation is EPANET's own `.inp` for the same `.net`, compared as VALUES so column
// padding cannot make a difference look like agreement.
console.log('\n--- initial quality comes across, for all three node kinds ---');
{
	const dir = path.join(ROOT, 'dev', 'net-import-study', 'All-three');
	const rowsOf = (text) => ((text.match(/\[QUALITY\][^[]*/) || [''])[0].split('\n')
		.filter((l) => l.trim() && !/^;|^\[/.test(l))
		.map((l) => { const t = l.trim().split(/\s+/); return t[0] + ' ' + parseFloat(t[1]); })
		.sort());
	['Net1', 'Net2', 'Net3-PDA'].forEach((name) => {
		const netFile = path.join(dir, '1-EPANET-INP-to-NET', name + '.net');
		const epanetFile = path.join(dir, '2-EPANET-NET-back-to-INP', name + '.inp');
		if (!fs.existsSync(netFile) || !fs.existsSync(epanetFile)) {
			console.log('  skip  ' + name + ' is not in the corpus');
			return;
		}
		const conv = EngCalcs.lpnNetToInp(new Uint8Array(fs.readFileSync(netFile)), name);
		if (!conv.ok) { ok(name + ' converts', false, conv.error); return; }
		const mine = rowsOf(conv.inp);
		const theirs = rowsOf(fs.readFileSync(epanetFile, 'utf8'));
		ok(name + ': every initial quality matches EPANET, value for value',
			JSON.stringify(mine) === JSON.stringify(theirs),
			mine.length + ' rows against ' + theirs.length);
	});
	// Net1 is the one that carries all three kinds at once, so it is named explicitly: junction 10
	// at 0.5, reservoir 9 at 1.0, tank 2 at 1.0. A wrong tank slot writes `Mixed` here.
	const n1 = path.join(dir, '1-EPANET-INP-to-NET', 'Net1.net');
	if (fs.existsSync(n1)) {
		const rows = rowsOf(EngCalcs.lpnNetToInp(new Uint8Array(fs.readFileSync(n1)), 'Net1').inp);
		ok('the tank\'s own concentration is a number, not its mixing model',
			rows.indexOf('2 1') >= 0, JSON.stringify(rows.filter((r) => /^2 /.test(r))));
		ok('the reservoir\'s is there too', rows.indexOf('9 1') >= 0,
			JSON.stringify(rows.filter((r) => /^9 /.test(r))));
	}
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
