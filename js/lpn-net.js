// Looped Pipe Network -- reading EPANET's BINARY project file (`.net`) in the browser.
//
// ROADMAP Task 196, second pass (2026-08-11). Task 196 shipped `.inp` reading and Tom's answer was
// immediate: every model he actually has is a `.net`, because that is what EPANET's Windows UI
// saves when you press Save. Requiring File > Export > Network first is a step most users do not
// know exists, on a format most users have never heard of. So this page reads both.
//
// IT DOES NOT WRITE ONE, AND SHOULD NOT. `.inp` is EPANET's documented interchange format, it is
// text, EPANET opens it natively, and every other tool in this space reads it. `.net` is an
// undocumented binary serialization of one program's internal object graph -- fine to read as a
// courtesy, indefensible to emit. Export stays `.inp` only (ROADMAP Task 281).
//
// THE DESIGN: this converts `.net` to `.inp` TEXT and hands it to EngCalcs.lpnInpParse. It does not
// build a model of its own. Everything that is hard about importing EPANET -- the unit systems, the
// cut-feature reporting, [DEMANDS] replacing rather than adding, a TCV's setting being its whole
// loss -- lives once, in js/lpn-inp.js, and a second reader that duplicated any of it would drift
// from the first. The intermediate is also plain text a developer can print and read, which is
// worth a great deal when the input is a binary blob.
//
// THE FORMAT, since it is documented nowhere. A Delphi TReader/TWriter value stream: a byte naming
// a value type, then that value. Numbers are stored as STRINGS -- EPANET keeps its inputs as the
// text you typed -- and vaExtended appears only for map coordinates. An empty property is a
// zero-length wide string, which is why type 0x12 dominates. dev/scripts/epanet_net_to_inp.php is
// the same reader in PHP, with the full format notes; the two are kept in step by
// dev/lpn-spike/net-import-harness.js, which converts the same files with both and compares.
//
// HOW THIS FAILS SAFE. The slot maps below were derived from real files, not from a specification,
// so a build of EPANET that writes a different layout is a real possibility and a silent one -- a
// roughness read from the minor-loss slot still produces a network that solves. Two structural
// checks guard it, and both refuse rather than guess: the walk must reach the backdrop record
// without meeting an unknown value type or running off the end, and the ten counts in the header
// must equal the counts actually read from each section. (It deliberately does NOT require a clean
// end of file -- the trailer past the backdrop is display state whose shape varies by build, and
// insisting on it would refuse good files.) A file that fails either check is rejected with
// "export it as .inp instead", which always works.

(function (root) {
	'use strict';

	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	// Index into the 27-slot node array / 26-slot link array. Every node carries all 27 and every
	// link all 26 whatever its type -- one array wide enough for the widest -- with each type
	// reading its own slots, which is why several names below share an index.
	var NODE_SLOT = {
		desc: 0, tag: 1, elev: 2,
		demand: 3, pattern: 4, ndemands: 5, emitter: 6,
		initqual: 7, srcqual: 8, srcpat: 9, srctype: 10,
		tank_initlevel: 3, tank_minlevel: 4, tank_maxlevel: 5, tank_diam: 6,
		tank_minvol: 7, tank_volcurve: 8,
		// **A RESERVOIR'S ARRAY IS SHIFTED FROM A JUNCTION'S, AND READING IT AS A JUNCTION'S WROTE
		// ITS CHLORINE AS ITS HEAD PATTERN.** A junction holds demand at 3 and its pattern at 4; a
		// reservoir has no demand, so its head pattern sits at 3 and its initial quality at 4.
		// Measured on Net1, whose reservoir 9 states an initial quality of 1.0 and NO head pattern:
		// this reader emitted ` 9  800  1.0`, EPANET's own export of the same `.net` emits ` 9  800`
		// with the pattern column empty, and the engine then refused the whole file --
		// `Error 205: undefined time pattern 1.0 in [RESERVOIRS] section`. Tom found it by reading
		// the EPANET run report, which is the one place the offending line is named.
		res_pattern: 3, res_initqual: 4
	};
	var LINK_SLOT = {
		desc: 0, tag: 1,
		length: 2, diameter: 3, roughness: 4, mloss: 5, status: 6,
		pump_curve: 2, pump_power: 3, pump_speed: 4, pump_pattern: 5,
		valve_diam: 2, valve_type: 3, valve_setting: 4, valve_mloss: 5
	};
	// The option block is one run of strings covering EPANET's Hydraulics, Quality, Times and
	// Report pages. Only the hydraulics/quality head of it is reproduced; the rest is timing and
	// reporting state that a steady-state solve does not read. `Pattern` (index 7) is handled
	// separately because EPANET errors on a default pattern no [PATTERNS] section defines.
	// **THE SLOT MAP, CONFIRMED FROM A REAL FILE'S OWN INDICES (2026-09-02).** A `.net` stores its
	// options as an INDEXED array with no keywords anywhere in the file, so a name can only come
	// from evidence, and the evidence had to arrive twice.
	//
	// **THE FIRST ATTEMPT WAS INFERRED AND WAS WRONG.** Tom reported the 30 unnamed VALUES, they
	// decoded plausibly against EPANET's written section order, and converting his Net3 with that
	// map wrote `Duration 0.0` where the file says 24:00 and `HeadError 10` where EPANET states
	// `CHECKFREQ 2`. The values were right and the OFFSETS were not: a run of repeated `0.0`s
	// cannot be counted by eye. The fix was not more care, it was printing `index: value` in the
	// import report so a file states its own slot numbers. It then did:
	//
	//   10 Yes | 12 mg/L | 14 Lake | 17 1 | 18 First | 19-22 0.0 | 23 24:00 | 24 1:00 | 25 0:05
	//   26 1:00 | 27 0:00 | 28 1:00 | 29 0:00 | 30 12 am | 31 NONE | 32 75 | 33 0.0 | 35 0.0
	//   36 2 | 37 10 | 38 0 | 39 0 | 40 0 | 41 PDA | 42 0 | 43 0.1 | 44 0.5
	//
	// **AND EVERY NAME BELOW IS CHECKED AGAINST WHAT EPANET ITSELF WROTE FOR THE SAME MODEL**,
	// which Tom exported and kept in `dev/net-import-study/`: `CHECKFREQ 2`, `MAXCHECK 10`,
	// `DAMPLIMIT 0`, `Demand Model PDA`, `Minimum Pressure 0`, `Required Pressure 0.1`,
	// `Pressure Exponent 0.5`, `Global Efficiency 75`, `Quality Trace Lake`, `Status Yes`, and the
	// nine `[TIMES]` lines in order. Two independent sources agreeing on both index and value is
	// what "confirmed" means here; nothing below rests on a count.
	//
	// **SLOTS 16 TO 22, 39 AND 40 ARE STILL UNNAMED AND ARE STILL REPORTED.** `1`, `First` and a run
	// of zeros that EPANET's own export does not state anywhere, so there is nothing to match them
	// against. Naming one from a guess is what this comment exists to prevent.
	var OPTION_NAME = {
		0: 'Units', 1: 'Headloss', 2: 'Specific Gravity', 3: 'Viscosity', 4: 'Trials',
		5: 'Accuracy', 6: 'Unbalanced', 8: 'Demand Multiplier', 9: 'Emitter Exponent',
		13: 'Diffusivity', 15: 'Tolerance',
		36: 'CheckFreq', 37: 'MaxCheck', 38: 'DampLimit',
		41: 'Demand Model', 42: 'Minimum Pressure', 43: 'Required Pressure',
		44: 'Pressure Exponent'
	};
	var OPTION_PATTERN = 7;
	// **THE WATER-QUALITY OPTION IS THREE SLOTS AND ONE LINE**, and its grammar changes with its own
	// first token: `Quality Trace <node>` takes a node and no unit, `Quality Age` takes neither, a
	// chemical takes its unit. Writing `Quality Trace` with the node dropped -- which a one-slot
	// writer did -- names an analysis EPANET cannot run.
	var OPT_QUALITY = 11, OPT_QUAL_UNITS = 12, OPT_TRACE_NODE = 14;
	// `[REPORT]`, which is where EPANET puts Status -- NOT `[OPTIONS]`, where an earlier guess put
	// it. Only the one slot is identified; Summary and Page are among the unnamed.
	var REPORT_NAME = { 10: 'Status' };
	// `[TIMES]`, in EPANET's own written order.
	var TIME_NAME = {
		23: 'Duration', 24: 'Hydraulic Timestep', 25: 'Quality Timestep', 26: 'Pattern Timestep',
		27: 'Pattern Start', 28: 'Report Timestep', 29: 'Report Start', 30: 'Start ClockTime',
		31: 'Statistic'
	};
	// `[ENERGY]`. Slot 34 is `Global Pattern`, empty in the file that identified the others, and it
	// is what explains the gap between Global Price at 33 and Demand Charge at 35.
	var ENERGY_NAME = {
		32: 'Global Efficiency', 33: 'Global Price', 34: 'Global Pattern', 35: 'Demand Charge'
	};
	// `[REACTIONS]`, decoded 2026-09-03 from ALL THREE EPA reference models beside EPANET's own
	// `.inp` written back from each `.net` (`dev/net-import-study/All-three/`). Two independent
	// sources agreeing on index AND value is what "confirmed" means in this file; a count is not
	// evidence, which is the whole lesson of the comment above `OPTION_NAME`.
	//
	// **THE COUNT DOES NOT CLOSE, SO IT NAMES NOTHING BY ITSELF.** EPANET states SEVEN keywords for
	// every one of the three -- Order Bulk, Order Tank, Order Wall, Global Bulk, Global Wall,
	// Limiting Potential, Roughness Correlation -- and the file populates SIX slots, 17 to 22, with
	// slot 16 empty in all three. Seven keywords do not fit six slots, and EPANET demonstrably
	// writes values it did not read from the option array (it writes `Unbalanced Continue 10` where
	// slot 6 holds `Continue` alone), so a missing keyword proves nothing about slot 16 either.
	//
	// **FOUR SLOTS ARE ANCHORED BY VALUE, and Net1 is the model that makes them legible** -- it is
	// the only one of the three with reaction coefficients at all. Its option array states
	// `19: -.5` and `20: -1`; EPANET's own export of the same file states `Global Bulk -.5` and
	// `Global Wall -1`. The same numbers, in the same odd formatting, at indices the file itself
	// prints. Net2 and Net3 read `0.0` at both and EPANET writes `0.0` at both. Slots 21 and 22 are
	// then a CLOSED interval rather than a count into open space: 20 is confirmed below them, 23
	// (`Duration`) is confirmed above, two slots remain and EPANET states exactly two remaining
	// keywords in exactly that order, and all three models agree on `0.0` for each.
	//
	// **SLOT 18 IS THE WALL ORDER, AND IT IS A WORD WHERE THE `.inp` IS A NUMBER.** Wall reaction
	// order is the one of the three EPANET restricts to zero or first order and the one its
	// interface therefore offers as that pair rather than as a number; it is also the keyword
	// EPANET writes immediately before Global Bulk, which is the confirmed slot 19. `First` against
	// EPANET's `Order Wall 1`, in all three, is the measured pair, so `First` is written as `1`.
	// `Zero` is written as `0` by the same pairing but has NOT been observed in a file; anything
	// else is reported as an unnamed slot rather than translated into a setting nobody made.
	//
	// **SLOT 17 IS DELIBERATELY UNNAMED, AND IT IS THE ONE THE EVIDENCE CANNOT SETTLE.** It holds
	// `1` in all three models -- and so do BOTH `Order Bulk` and `Order Tank` in all three of
	// EPANET's exports. Nothing distinguishes them, and slot 16, empty everywhere, may or may not
	// be the other of the pair. Two candidates with no discriminating value is exactly the shape
	// that wrote `Duration 0.0` into a converted file the first time this array was mapped by
	// inference. One model whose bulk order differs from its tank order would settle it in a
	// minute; until one exists, slot 17 is reported to the user and named by nobody.
	//
	// **SLOTS 39 AND 40 STAY UNNAMED TOO.** `0` in all three, and EPANET's own export states no
	// keyword anywhere carrying that value at that position, so there is nothing to match against.
	var REACTION_NAME = {
		19: 'Global Bulk', 20: 'Global Wall', 21: 'Limiting Potential', 22: 'Roughness Correlation'
	};
	var OPT_WALL_ORDER = 18;
	var WALL_ORDER_NUMBER = { FIRST: '1', ZERO: '0' };

	function Reader(bytes) {
		this.d = bytes;      // Uint8Array
		this.i = 0;
	}
	Reader.prototype.eof = function () { return this.i >= this.d.length; };
	Reader.prototype.need = function (n) {
		if (this.i + n > this.d.length) { throw new Error('truncated at ' + this.i); }
	};
	Reader.prototype.value = function () {
		this.need(1);
		var t = this.d[this.i++], n, s, k, v;
		switch (t) {
			case 0x00: return { t: 'null', v: null };
			case 0x01: return { t: 'list', v: null };
			case 0x02: this.need(1); v = this.d[this.i++]; return { t: 'int', v: v > 127 ? v - 256 : v };
			case 0x03:
				this.need(2); v = this.d[this.i] | (this.d[this.i + 1] << 8); this.i += 2;
				return { t: 'int', v: v };
			case 0x04:
				this.need(4);
				v = (this.d[this.i] | (this.d[this.i + 1] << 8) | (this.d[this.i + 2] << 16) | (this.d[this.i + 3] << 24)) >>> 0;
				this.i += 4;
				return { t: 'int', v: v };
			case 0x05: this.need(10); v = this.extended(); return { t: 'float', v: v };
			case 0x06:
				this.need(1); n = this.d[this.i++]; this.need(n); s = '';
				for (k = 0; k < n; k++) { s += String.fromCharCode(this.d[this.i + k]); }
				this.i += n;
				return { t: 'str', v: s };
			case 0x08: return { t: 'bool', v: false };
			case 0x09: return { t: 'bool', v: true };
			case 0x12:
				this.need(4);
				n = (this.d[this.i] | (this.d[this.i + 1] << 8) | (this.d[this.i + 2] << 16) | (this.d[this.i + 3] << 24)) >>> 0;
				this.i += 4;
				this.need(n * 2); s = '';
				for (k = 0; k < n; k++) { s += String.fromCharCode(this.d[this.i + k * 2] | (this.d[this.i + k * 2 + 1] << 8)); }
				this.i += n * 2;
				return { t: 'str', v: s };
		}
		throw new Error('unknown value type 0x' + t.toString(16) + ' at ' + (this.i - 1));
	};
	/**
	 * Intel 80-bit extended -> Number. Sign, 15-bit exponent, 64-bit mantissa WITH an explicit
	 * integer bit (unlike IEEE double, which hides it). The mantissa overflows a JS integer, so it
	 * is accumulated as a float -- lossy past 53 bits, which is irrelevant for map coordinates.
	 */
	Reader.prototype.extended = function () {
		var b = this.d, o = this.i, e = ((b[o + 9] & 0x7f) << 8) | b[o + 8],
			sign = (b[o + 9] & 0x80) ? -1 : 1, m = 0, k;
		for (k = 7; k >= 0; k--) { m = m * 256 + b[o + k]; }
		this.i += 10;
		if (e === 0 && m === 0) { return 0; }
		return sign * m * Math.pow(2, e - 16383 - 63);
	};
	Reader.prototype.str = function () { var v = this.value(); return v.t === 'str' ? v.v : String(v.v); };
	Reader.prototype.int = function () { return this.value().v | 0; };
	Reader.prototype.num = function () { return +this.value().v; };
	Reader.prototype.bool = function () { return !!this.value().v; };
	Reader.prototype.listOfStr = function () {
		var v = this.value(), out = [], save, x;
		if (v.t !== 'list') { throw new Error('expected a list at ' + this.i); }
		for (;;) {
			save = this.i;
			x = this.value();
			if (x.t === 'null') { return out; }
			this.i = save;
			out.push(this.str());
		}
	};

	function netParse(bytes) {
		var r = new Reader(bytes), i, n, p, id, comment;

		var magic = r.str();
		if (magic !== '<EPANET2>') { throw new Error('not-a-net'); }
		var net = { version: r.int(), header: [] };
		for (i = 0; i < 10; i++) { net.header.push(r.int()); }

		net.title = r.str();
		net.notes = r.listOfStr();
		net.options = [];
		n = r.int();
		for (i = 0; i < n; i++) { net.options.push(r.str()); }
		r.bool();   // trailing flag on the option block; not used

		net.patterns = [];
		n = r.int();
		for (i = 0; i < n; i++) {
			id = r.str(); comment = r.str();
			net.patterns.push({ id: id, comment: comment, values: r.listOfStr() });
		}
		net.curves = [];
		n = r.int();
		for (i = 0; i < n; i++) {
			id = r.str(); comment = r.str();
			net.curves.push({ id: id, comment: comment, type: r.str(), x: r.listOfStr(), y: r.listOfStr() });
		}

		net.nodes = [];
		['junction', 'reservoir', 'tank'].forEach(function (kind) {
			var count = r.int(), j, np, node;
			for (j = 0; j < count; j++) {
				node = { kind: kind, id: r.str(), x: r.num(), y: r.num(), props: [] };
				np = r.int();
				for (p = 0; p < np; p++) { node.props.push(r.str()); }
				// Junctions alone carry a trailing demand-category list.
				if (kind === 'junction') { node.demands = r.listOfStr(); }
				net.nodes.push(node);
			}
		});

		net.links = [];
		['pipe', 'pump', 'valve'].forEach(function (kind) {
			var count = r.int(), j, nv, np, link, v;
			for (j = 0; j < count; j++) {
				link = { kind: kind, id: r.str(), from: r.str(), to: r.str(), verts: [], props: [] };
				nv = r.int();
				for (v = 0; v < nv; v++) { link.verts.push([r.num(), r.num()]); }
				np = r.int();
				for (p = 0; p < np; p++) { link.props.push(r.str()); }
				net.links.push(link);
			}
		});

		net.controls = r.listOfStr();
		net.rules = r.listOfStr();

		net.labels = [];
		n = r.int();
		for (i = 0; i < n; i++) {
			net.labels.push({
				text: r.str(), x: r.num(), y: r.num(), anchor: r.str(), font: r.str(),
				size: r.int(), bold: r.bool(), italic: r.bool(), meterType: r.int(), meterId: r.str()
			});
		}

		net.extent = [r.num(), r.num(), r.num(), r.num()];
		net.backdrop = { units: r.int(), file: r.str(), x: r.num(), y: r.num() };
		// Everything after this is map display state and default properties. Not read: nothing
		// downstream needs it, and the trailer's shape varies by EPANET build -- which is exactly
		// why the integrity check below counts SECTIONS rather than demanding a clean end of file.
		return net;
	}

	/**
	 * The header's ten counts against what was actually read. This is the guard that makes reading
	 * an undocumented binary format defensible: if a different EPANET build moved a section, the
	 * walk above lands in the wrong place and these disagree, so the file is refused instead of
	 * being read as a plausible-looking different network.
	 */
	function integrityError(net) {
		var got = { junction: 0, reservoir: 0, tank: 0, pipe: 0, pump: 0, valve: 0 };
		net.nodes.forEach(function (n) { got[n.kind]++; });
		net.links.forEach(function (l) { got[l.kind]++; });
		var want = net.header,
			pairs = [
				['junctions', want[0], got.junction], ['reservoirs', want[1], got.reservoir],
				['tanks', want[2], got.tank], ['pipes', want[3], got.pipe],
				['pumps', want[4], got.pump], ['valves', want[5], got.valve],
				['labels', want[6], net.labels.length], ['patterns', want[7], net.patterns.length],
				['curves', want[8], net.curves.length]
			], i;
		for (i = 0; i < pairs.length; i++) {
			if (pairs[i][1] !== pairs[i][2]) {
				return pairs[i][0] + ': the file says ' + pairs[i][1] + ', the reader found ' + pairs[i][2];
			}
		}
		return null;
	}

	function slot(el, map, name) {
		var m = map === 'node' ? NODE_SLOT : LINK_SLOT;
		if (!(name in m)) { return ''; }
		var v = el.props[m[name]];
		return v === undefined ? '' : String(v).replace(/^\s+|\s+$/g, '');
	}
	function or0(s, dflt) { return s === '' ? dflt : s; }
	function pad(s, n) {
		s = String(s);
		while (s.length < n) { s += ' '; }
		return s;
	}
	// Same fixed-4-then-trim the PHP converter uses, so the two produce byte-identical text and can
	// be compared directly (dev/lpn-spike/net-import-harness.js).
	function coord(x) {
		var s = (+x).toFixed(4);
		if (s.indexOf('.') >= 0) { s = s.replace(/0+$/, '').replace(/\.$/, ''); }
		return s;
	}

	// `out` is an optional collector the caller passes in when it wants to know what could NOT be
	// carried. Kept as an out-parameter rather than a second return value because this function's
	// job is to produce text and every other caller wants exactly that.
	function netToInp(net, sourceName, out) {
		var L = [], sections = { JUNCTIONS: [], RESERVOIRS: [], TANKS: [] },
			emitters = [], demands = [], coords = [], verts = [],
			pipes = [], pumps = [], valves = [], statusRows = [];

		L.push('[TITLE]');
		L.push('Converted from ' + sourceName + ' by js/lpn-net.js');
		L.push('');

		net.nodes.forEach(function (n) {
			coords.push(' ' + pad(n.id, 18) + ' ' + pad(coord(n.x), 16) + ' ' + coord(n.y));
			if (n.kind === 'junction') {
				sections.JUNCTIONS.push(' ' + pad(n.id, 18) + ' ' + pad(or0(slot(n, 'node', 'elev'), '0'), 12) +
					' ' + pad(or0(slot(n, 'node', 'demand'), '0'), 12) + ' ' + slot(n, 'node', 'pattern'));
				var em = slot(n, 'node', 'emitter');
				if (em !== '' && +em !== 0) { emitters.push(' ' + pad(n.id, 18) + ' ' + em); }
				// EVERY category goes to [DEMANDS], including the first, because [DEMANDS] REPLACES
				// the [JUNCTIONS] column rather than adding to it. The triple layout is INFERRED --
				// no sample file seen so far carries one.
				var d = n.demands || [], k;
				for (k = 0; k + 1 < d.length; k += 3) {
					demands.push(' ' + pad(n.id, 18) + ' ' + pad(d[k], 12) + ' ' + (d[k + 1] === undefined ? '' : d[k + 1]));
				}
			} else if (n.kind === 'reservoir') {
				sections.RESERVOIRS.push(' ' + pad(n.id, 18) + ' ' + pad(or0(slot(n, 'node', 'elev'), '0'), 12) +
					' ' + slot(n, 'node', 'res_pattern'));
			} else {
				sections.TANKS.push(' ' + pad(n.id, 18) + ' ' + pad(or0(slot(n, 'node', 'elev'), '0'), 10) +
					' ' + pad(or0(slot(n, 'node', 'tank_initlevel'), '0'), 10) +
					' ' + pad(or0(slot(n, 'node', 'tank_minlevel'), '0'), 10) +
					' ' + pad(or0(slot(n, 'node', 'tank_maxlevel'), '0'), 10) +
					' ' + pad(or0(slot(n, 'node', 'tank_diam'), '0'), 10) +
					' ' + pad(or0(slot(n, 'node', 'tank_minvol'), '0'), 10) +
					' ' + slot(n, 'node', 'tank_volcurve'));
			}
		});

		net.links.forEach(function (l) {
			l.verts.forEach(function (v) {
				verts.push(' ' + pad(l.id, 18) + ' ' + pad(coord(v[0]), 16) + ' ' + coord(v[1]));
			});
			var status = slot(l, 'link', 'status');
			if (l.kind === 'pipe') {
				pipes.push(' ' + pad(l.id, 14) + ' ' + pad(l.from, 18) + ' ' + pad(l.to, 18) +
					' ' + pad(or0(slot(l, 'link', 'length'), '0'), 10) +
					' ' + pad(or0(slot(l, 'link', 'diameter'), '0'), 10) +
					' ' + pad(or0(slot(l, 'link', 'roughness'), '0'), 10) +
					' ' + pad(or0(slot(l, 'link', 'mloss'), '0'), 8) +
					' ' + (status === '' ? 'Open' : status));
			} else if (l.kind === 'pump') {
				var params = [];
				if (slot(l, 'link', 'pump_curve') !== '') { params.push('HEAD ' + slot(l, 'link', 'pump_curve')); }
				if (slot(l, 'link', 'pump_power') !== '') { params.push('POWER ' + slot(l, 'link', 'pump_power')); }
				if (slot(l, 'link', 'pump_speed') !== '') { params.push('SPEED ' + slot(l, 'link', 'pump_speed')); }
				if (slot(l, 'link', 'pump_pattern') !== '') { params.push('PATTERN ' + slot(l, 'link', 'pump_pattern')); }
				pumps.push(' ' + pad(l.id, 14) + ' ' + pad(l.from, 18) + ' ' + pad(l.to, 18) + ' ' + params.join('  '));
				if (status !== '' && status.toUpperCase() !== 'OPEN') { statusRows.push(' ' + pad(l.id, 18) + ' ' + status); }
			} else {
				valves.push(' ' + pad(l.id, 14) + ' ' + pad(l.from, 18) + ' ' + pad(l.to, 18) +
					' ' + pad(or0(slot(l, 'link', 'valve_diam'), '0'), 10) +
					' ' + pad(slot(l, 'link', 'valve_type'), 8) +
					' ' + pad(or0(slot(l, 'link', 'valve_setting'), '0'), 12) +
					' ' + or0(slot(l, 'link', 'valve_mloss'), '0'));
				if (status !== '' && status.toUpperCase() !== 'OPEN') { statusRows.push(' ' + pad(l.id, 18) + ' ' + status); }
			}
		});

		function put(name, rows, header) {
			if (!rows.length) { return; }
			L.push('[' + name + ']');
			L.push(';' + header);
			rows.forEach(function (r) { L.push(r); });
			L.push('');
		}
		put('JUNCTIONS', sections.JUNCTIONS, 'ID                 Elev         Demand       Pattern');
		put('RESERVOIRS', sections.RESERVOIRS, 'ID                 Head         Pattern');
		put('TANKS', sections.TANKS, 'ID                 Elev      InitLvl   MinLvl    MaxLvl    Diameter  MinVol    VolCurve');
		put('PIPES', pipes, 'ID             Node1              Node2              Length    Diameter  Roughness MinorLoss Status');
		put('PUMPS', pumps, 'ID             Node1              Node2              Parameters');
		put('VALVES', valves, 'ID             Node1              Node2              Diameter  Type     Setting      MinorLoss');
		put('DEMANDS', demands, 'Junction           Demand       Pattern');
		put('EMITTERS', emitters, 'Junction           Coefficient');
		put('STATUS', statusRows, 'ID                 Status/Setting');

		if (net.patterns.length) {
			L.push('[PATTERNS]'); L.push(';ID                 Multipliers');
			net.patterns.forEach(function (p) {
				for (var i = 0; i < p.values.length; i += 6) {
					L.push(' ' + pad(p.id, 18) + ' ' + p.values.slice(i, i + 6).join('  '));
				}
			});
			L.push('');
		}
		if (net.curves.length) {
			L.push('[CURVES]'); L.push(';ID                 X            Y');
			net.curves.forEach(function (c) {
				L.push(';' + c.type + ': ' + (c.comment !== '' ? c.comment : c.id));
				for (var i = 0; i < c.x.length; i++) {
					L.push(' ' + pad(c.id, 18) + ' ' + pad(c.x[i], 12) + ' ' + (c.y[i] === undefined ? '0' : c.y[i]));
				}
			});
			L.push('');
		}
		put('CONTROLS', net.controls.map(function (s) { return ' ' + s; }), 'Simple controls');
		put('RULES', net.rules.map(function (s) { return ' ' + s; }), 'Rule-based controls');

		// **AN OPTION SLOT WE HAVE NO NAME FOR CANNOT BE CARRIED, SO IT MUST BE TOLD** (Tom,
		// 2026-09-02, having imported a `.net` stating a demand model: *"The message appears when
		// importing a .inp, but not a .net with PDA."*). This is the `.inp` reader's old defect one
		// file over -- a list of what to CARRY rather than a list of what is READ -- but the repair
		// there does not transfer. In an `.inp` an unread line still carries its own keyword, so it
		// can go back out verbatim; in a `.net` an option is an INDEXED SLOT with no name in the
		// file at all, and inventing a keyword for slot 14 would write a setting the user never
		// made. Measured on the harness fixture: slots 10 (`No`) and 12 (`mg/L`) are populated and
		// were dropped in silence, and a chlorine unit is exactly the kind of thing that matters.
		//
		// So the honest outcome is the third one CLAUDE.md names for an unrecognised unit: read the
		// file, convert what we can name, and say plainly what could not come across. The caller
		// turns this into a sentence in the import report.
		var unnamed = [];
		function opt(i) {
			var v = net.options[i];
			return (v === undefined ? '' : v).replace(/^\s+|\s+$/g, '');
		}
		function rows(map) {
			var out = [];
			Object.keys(map).forEach(function (k) {
				var v = opt(+k);
				if (v !== '') { out.push(' ' + pad(map[k], 20) + ' ' + v); }
			});
			return out;
		}
		// **THE CLOCK, THE ENERGY GLOBALS AND THE REPORT SETTINGS, WHICH NOTHING WROTE UNTIL NOW.**
		// `[TIMES]` is the one that matters: without it every `.net` this page imported arrived with
		// no duration and no timesteps, so an extended-period model silently became a single
		// instant. js/lpn-inp.js reads all three when they are present.
		put('ENERGY', rows(ENERGY_NAME), 'Global energy settings');
		// `[REACTIONS]`, in EPANET's own written order and in EPANET's own place, between the
		// energy globals and the clock. The wall order is the one slot whose stored value is a word
		// and whose written value is a number; a value that is neither of the observed words nor
		// already a number is left for the unnamed report below rather than guessed at.
		var wallOrder = opt(OPT_WALL_ORDER), wallOrderNumber = '';
		if (wallOrder !== '') {
			wallOrderNumber =
				Object.prototype.hasOwnProperty.call(WALL_ORDER_NUMBER, wallOrder.toUpperCase())
					? WALL_ORDER_NUMBER[wallOrder.toUpperCase()]
					: (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(wallOrder) ? wallOrder : '');
		}
		var reactions = wallOrderNumber === ''
			? [] : [' ' + pad('Order Wall', 20) + ' ' + wallOrderNumber];
		put('REACTIONS', reactions.concat(rows(REACTION_NAME)), 'Global reaction settings');
		put('TIMES', rows(TIME_NAME), 'Clock and reporting');
		put('REPORT', rows(REPORT_NAME), 'EPANET report settings');

		L.push('[OPTIONS]');
		net.options.forEach(function (v, i) {
			var text = (v === undefined ? '' : v).replace(/^\s+|\s+$/g, '');
			if (text === '') { return; }
			if (OPTION_NAME[i] !== undefined || i === OPTION_PATTERN) { return; }
			if (TIME_NAME[i] !== undefined || ENERGY_NAME[i] !== undefined) { return; }
			if (REPORT_NAME[i] !== undefined) { return; }
			// Slot 18 is reported unless it was actually WRITTEN -- a wall order this reader cannot
			// turn into a number is a slot with no name, whatever the table says.
			if (REACTION_NAME[i] !== undefined) { return; }
			if (i === OPT_WALL_ORDER && wallOrderNumber !== '') { return; }
			if (i === OPT_QUALITY || i === OPT_QUAL_UNITS || i === OPT_TRACE_NODE) { return; }
			unnamed.push({ index: i, value: text });
		});
		if (out) { out.unnamedOptions = unnamed; }
		Object.keys(OPTION_NAME).forEach(function (k) {
			var i = +k, v = opt(i);
			if (v !== '') { L.push(' ' + pad(OPTION_NAME[k], 20) + ' ' + v); }
		});
		var qual = opt(OPT_QUALITY), qualUnits = opt(OPT_QUAL_UNITS), traceNode = opt(OPT_TRACE_NODE);
		if (qual !== '' && qual.toUpperCase() !== 'NONE') {
			if (qual.toUpperCase() === 'TRACE') {
				if (traceNode !== '') { L.push(' ' + pad('Quality', 20) + ' Trace ' + traceNode); }
			} else if (qual.toUpperCase() === 'AGE') {
				L.push(' ' + pad('Quality', 20) + ' Age');
			} else {
				L.push(' ' + pad('Quality', 20) + ' ' + qual + (qualUnits !== '' ? ' ' + qualUnits : ''));
			}
		}
		var patName = net.options[OPTION_PATTERN] === undefined ? '' : net.options[OPTION_PATTERN].replace(/^\s+|\s+$/g, '');
		if (patName !== '' && net.patterns.some(function (p) { return p.id === patName; })) {
			L.push(' ' + pad('Pattern', 20) + ' ' + patName);
		}
		L.push('');

		put('COORDINATES', coords, 'Node               X-Coord          Y-Coord');
		put('VERTICES', verts, 'Link               X-Coord          Y-Coord');

		if (net.labels.length) {
			L.push('[LABELS]'); L.push(';X-Coord          Y-Coord          Label & Anchor Node');
			net.labels.forEach(function (lb) {
				L.push(' ' + pad(coord(lb.x), 16) + ' ' + pad(coord(lb.y), 16) +
					' "' + lb.text.split('"').join("'") + '" ' + lb.anchor);
			});
			L.push('');
		}

		if (net.backdrop.file !== '') {
			L.push('[BACKDROP]');
			L.push(' ' + pad('DIMENSIONS', 12) + ' ' + coord(net.extent[0]) + '  ' + coord(net.extent[1]) +
				'  ' + coord(net.extent[2]) + '  ' + coord(net.extent[3]));
			L.push(' ' + pad('FILE', 12) + ' ' + net.backdrop.file);
			L.push(' ' + pad('OFFSET', 12) + ' ' + coord(net.backdrop.x) + '  ' + coord(net.backdrop.y));
			L.push('');
		}

		L.push('[END]');
		L.push('');
		return L.join('\n');
	}

	/** The magic that opens every `.net`: a Delphi short string holding "<EPANET2>". */
	EngCalcs.lpnLooksLikeNet = function (bytes) {
		if (!bytes || bytes.length < 11) { return false; }
		if (bytes[0] !== 0x06 || bytes[1] !== 9) { return false; }
		var s = '', i;
		for (i = 0; i < 9; i++) { s += String.fromCharCode(bytes[2 + i]); }
		return s === '<EPANET2>';
	};

	/**
	 * `.net` bytes -> `.inp` text.
	 *
	 * Returns { ok: true, inp, version } or { ok: false, error } where `error` is one of
	 * 'not-a-net' | 'unreadable' | 'section-mismatch', with `detail` for the last two. Every
	 * failure is a refusal, never a partial read: a half-understood binary file is the one thing
	 * worse than no importer at all.
	 */
	EngCalcs.lpnNetToInp = function (bytes, sourceName) {
		var net;
		// The magic first, so a file that is simply not a `.net` is reported as that rather than as
		// damage. Without this, ordinary `.inp` text fails on its first byte with "unknown value
		// type 0x5b", which is true, unhelpful, and points the reader at the wrong problem.
		if (!EngCalcs.lpnLooksLikeNet(bytes)) { return { ok: false, error: 'not-a-net' }; }
		try { net = netParse(bytes); }
		catch (err) {
			if (err && err.message === 'not-a-net') { return { ok: false, error: 'not-a-net' }; }
			return { ok: false, error: 'unreadable', detail: err && err.message };
		}
		var bad = integrityError(net);
		if (bad) { return { ok: false, error: 'section-mismatch', detail: bad }; }
		var out = {};
		var text = netToInp(net, sourceName || 'an EPANET .net file', out);
		return { ok: true, version: net.version, inp: text,
			// Populated option slots this converter has no name for. Empty for every file it fully
			// understands, which is why the caller may treat a missing array as none.
			unnamedOptions: out.unnamedOptions || [] };
	};

	// Node-only, for dev/lpn-spike/net-import-harness.js.
	if (typeof module !== 'undefined' && module.exports) { module.exports = EngCalcs; }

}(typeof globalThis !== 'undefined' ? globalThis : this));
