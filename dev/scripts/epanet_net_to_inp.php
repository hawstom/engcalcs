<?php
/**
 * epanet_net_to_inp.php -- read an EPANET 2.x BINARY project file (`.net`) and write the
 * equivalent `.inp` text.
 *
 * WHY THIS EXISTS (ROADMAP Task 196, 2026-08-11). Tom dropped three real production water
 * models into `dev/epanet-models/` to stress-test the `.inp` importer against something other
 * than EPA's own tidy Net1/Net2/Net3. They turned out to be `.net` files, not `.inp` -- `.net`
 * is what EPANET's Windows UI saves by default, and it is a BINARY Delphi stream, not text.
 * Rather than ask for a re-export every time a real model shows up, this reads them directly.
 * It is a dev-time fixture tool: nothing in the shipped suite reads `.net`.
 *
 * THE FORMAT, since it is documented nowhere. The file is a Delphi TReader/TWriter value
 * stream: a byte naming a value type, then that value. Only these types appear:
 *   0x02 vaInt8 (1 signed byte)      0x03 vaInt16      0x04 vaInt32
 *   0x05 vaExtended (10-byte 80-bit) 0x06 vaString (1-byte length, then bytes)
 *   0x08 vaFalse   0x09 vaTrue       0x00 vaNull       0x01 vaList
 *   0x12 vaWString (4-byte CHARACTER count, then UTF-16LE)
 * Numbers are stored as STRINGS (EPANET keeps its inputs as typed text); vaExtended is used
 * only for map coordinates. An empty property is written as a zero-length vaWString, which is
 * why 0x12 dominates the stream. A "list" is `vaList`, items, `vaNull`.
 *
 * Stream order, top to bottom:
 *   "<EPANET2>", version(int16), then TEN counts:
 *     junctions, reservoirs, tanks, pipes, pumps, valves, labels, patterns, curves, ?(always 2)
 *   then: 61 option strings, patterns, curves, junctions, reservoirs, tanks, pipes, pumps,
 *   valves, controls list, rules list, labels, map extent, backdrop, display flags, defaults.
 * The counts up front are redundant with the per-section counts that follow; we read the
 * per-section ones and use the header only as a cross-check.
 *
 * PROPERTY ARRAYS. Every node carries 27 property slots and every link 26, regardless of type
 * -- one array wide enough for the widest type, with each type reading its own slots. The
 * slot meanings below were derived from these three models plus EPA's Net1/Net2/Net3 and are
 * asserted by --selftest, because a silently wrong slot index is the failure mode here (a
 * roughness read as a minor-loss coefficient still produces a file that solves).
 *
 * Usage:
 *   php dev/scripts/epanet_net_to_inp.php <file.net> [-o out.inp]
 *   php dev/scripts/epanet_net_to_inp.php --all          # convert dev/epanet-models/*.net
 *   php dev/scripts/epanet_net_to_inp.php --report <file.net>   # what's in it, no output file
 *   php dev/scripts/epanet_net_to_inp.php --tokens <file.net>   # raw value stream, for debugging
 */

// ---------------------------------------------------------------- value stream reader

class NetReader {
	private $d;
	private $i = 0;
	public function __construct($bytes) { $this->d = $bytes; }
	public function eof() { return $this->i >= strlen($this->d); }
	public function pos() { return $this->i; }

	/** Next value, as ['t' => type name, 'v' => value]. */
	public function value() {
		$t = ord($this->d[$this->i++]);
		switch ($t) {
			case 0x00: return array('t' => 'null', 'v' => null);
			case 0x01: return array('t' => 'list', 'v' => null);
			case 0x02: $v = unpack('c', substr($this->d, $this->i, 1)); $this->i += 1; return array('t' => 'int', 'v' => $v[1]);
			case 0x03: $v = unpack('v', substr($this->d, $this->i, 2)); $this->i += 2; return array('t' => 'int', 'v' => $v[1]);
			case 0x04: $v = unpack('V', substr($this->d, $this->i, 4)); $this->i += 4; return array('t' => 'int', 'v' => $v[1]);
			case 0x05: $v = $this->extended(substr($this->d, $this->i, 10)); $this->i += 10; return array('t' => 'float', 'v' => $v);
			case 0x06: $n = ord($this->d[$this->i++]); $s = substr($this->d, $this->i, $n); $this->i += $n; return array('t' => 'str', 'v' => $s);
			case 0x08: return array('t' => 'bool', 'v' => false);
			case 0x09: return array('t' => 'bool', 'v' => true);
			case 0x12:
				$n = unpack('V', substr($this->d, $this->i, 4)); $this->i += 4;
				$raw = substr($this->d, $this->i, $n[1] * 2); $this->i += $n[1] * 2;
				return array('t' => 'str', 'v' => $n[1] ? mb_convert_encoding($raw, 'UTF-8', 'UTF-16LE') : '');
		}
		throw new RuntimeException(sprintf('unknown value type 0x%02x at offset %d', $t, $this->i - 1));
	}

	/** Text of the next value -- every EPANET property is text, whichever way it was written. */
	public function str() { $v = $this->value(); return $v['t'] === 'str' ? $v['v'] : (string)$v['v']; }
	public function int() { $v = $this->value(); return (int)$v['v']; }
	public function bool() { $v = $this->value(); return (bool)$v['v']; }
	public function num() { $v = $this->value(); return (float)$v['v']; }

	/** Items of a `vaList ... vaNull` run, as text. */
	public function listOfStr() {
		$v = $this->value();
		if ($v['t'] !== 'list') { throw new RuntimeException('expected list at offset ' . $this->i); }
		$out = array();
		while (true) {
			$save = $this->i;
			$x = $this->value();
			if ($x['t'] === 'null') { return $out; }
			$this->i = $save;
			$out[] = $this->str();
		}
	}

	/**
	 * Intel 80-bit extended -> float. Sign, 15-bit exponent, 64-bit mantissa WITH an explicit
	 * integer bit (unlike IEEE double, which hides it). PHP has no 10-byte unpack, and the
	 * mantissa overflows a signed 64-bit int, so it is accumulated as a float -- lossy past 53
	 * bits, which is irrelevant for map coordinates.
	 */
	private function extended($b) {
		$e = (ord($b[9]) & 0x7f) << 8 | ord($b[8]);
		$sign = (ord($b[9]) & 0x80) ? -1 : 1;
		$m = 0.0;
		for ($k = 7; $k >= 0; $k--) { $m = $m * 256.0 + ord($b[$k]); }
		if ($e === 0 && $m == 0.0) { return 0.0; }
		return $sign * $m * pow(2.0, $e - 16383 - 63);
	}
}

// ---------------------------------------------------------------- property slot maps
//
// Index into the 27-slot node array / 26-slot link array. Slots not listed are results
// (EPANET stores the last solve's output in the same array) or belong to another type.

$NODE_SLOT = array(
	'desc' => 0, 'tag' => 1,
	// Junction elevation, reservoir TOTAL HEAD and tank bottom elevation all share slot 2.
	'elev' => 2,
	'demand' => 3, 'pattern' => 4, 'ndemands' => 5, 'emitter' => 6,
	// A RESERVOIR's array is shifted from a junction's: no demand, so the head pattern sits at 3
	// and the initial quality at 4. Reading it as a junction's wrote Net1's reservoir chlorine as
	// its head pattern and EPANET refused the file. See the note in js/lpn-net.js.
	'res_pattern' => 3, 'res_initqual' => 4,
	'initqual' => 7, 'srcqual' => 8, 'srcpat' => 9, 'srctype' => 10,
	// Tank-only, and the reason a node array is 27 wide rather than 11.
	'tank_initlevel' => 3, 'tank_minlevel' => 4, 'tank_maxlevel' => 5, 'tank_diam' => 6,
	'tank_minvol' => 7, 'tank_volcurve' => 8
);
$LINK_SLOT = array(
	'desc' => 0, 'tag' => 1,
	'length' => 2, 'diameter' => 3, 'roughness' => 4, 'mloss' => 5, 'status' => 6,
	// A pump reads slot 2 as its curve name; a valve reads 2/3/4/5 as diameter/type/setting/loss.
	'pump_curve' => 2, 'pump_power' => 3, 'pump_speed' => 4, 'pump_pattern' => 5,
	'valve_diam' => 2, 'valve_type' => 3, 'valve_setting' => 4, 'valve_mloss' => 5
);

// The option block is 45 strings covering EPANET's Hydraulics, Quality, Times and Report
// pages in one run. Only the hydraulics/quality head of it is reproduced: everything past
// index 15 is timing and reporting state, and these are steady-state models. `Pattern` is
// handled separately (see netToInp) because EPANET errors on a default pattern that no
// [PATTERNS] section defines, which is exactly the state of all three of Tom's files.
// **KEEP THIS TABLE IDENTICAL TO OPTION_NAME IN js/lpn-net.js**, which carries the reasoning: two
// readers of one format, compared byte for byte by dev/lpn-spike/net-import-harness.js. The slot
// numbers were measured from a real file's own import report on 2026-09-02 and every name is
// checked against what EPANET wrote for the same model, in dev/net-import-study/. Slots 18 to 22
// are `[REACTIONS]` and are named below; slots 16, 17, 39 and 40 are still unnamed on purpose.
$OPTION_ORDER = array(
	0 => 'Units', 1 => 'Headloss', 2 => 'Specific Gravity', 3 => 'Viscosity', 4 => 'Trials',
	5 => 'Accuracy', 6 => 'Unbalanced', 8 => 'Demand Multiplier', 9 => 'Emitter Exponent',
	13 => 'Diffusivity', 15 => 'Tolerance',
	36 => 'CheckFreq', 37 => 'MaxCheck', 38 => 'DampLimit',
	41 => 'Demand Model', 42 => 'Minimum Pressure', 43 => 'Required Pressure',
	44 => 'Pressure Exponent'
);
$OPTION_PATTERN = 7;
$OPT_QUALITY = 11; $OPT_QUAL_UNITS = 12; $OPT_TRACE_NODE = 14;
$REPORT_ORDER = array(10 => 'Status');
$TIME_ORDER = array(
	23 => 'Duration', 24 => 'Hydraulic Timestep', 25 => 'Quality Timestep',
	26 => 'Pattern Timestep', 27 => 'Pattern Start', 28 => 'Report Timestep',
	29 => 'Report Start', 30 => 'Start ClockTime', 31 => 'Statistic'
);
$ENERGY_ORDER = array(
	32 => 'Global Efficiency', 33 => 'Global Price', 34 => 'Global Pattern', 35 => 'Demand Charge'
);
// **KEEP THESE THREE IDENTICAL TO REACTION_NAME / OPT_WALL_ORDER / WALL_ORDER_NUMBER IN
// js/lpn-net.js**, which carries the evidence: 19 and 20 are anchored by Net1's own `-.5` and `-1`
// against EPANET's `Global Bulk -.5` and `Global Wall -1`, 21 and 22 close the interval up to the
// confirmed slot 23, and slot 18 stores the wall order as a WORD where the `.inp` writes a number.
// Slots 16, 17, 39 and 40 stay unnamed on purpose -- 17 holds `1` and so do BOTH `Order Bulk` and
// `Order Tank` in all three reference models, so nothing separates them.
$REACTION_ORDER = array(
	19 => 'Global Bulk', 20 => 'Global Wall', 21 => 'Limiting Potential', 22 => 'Roughness Correlation'
);
$OPT_WALL_ORDER = 18;
$WALL_ORDER_NUMBER = array('FIRST' => '1', 'ZERO' => '0');

// ---------------------------------------------------------------- parse

function netParse($path) {
	$r = new NetReader(file_get_contents($path));

	$magic = $r->str();
	if ($magic !== '<EPANET2>') { throw new RuntimeException("not an EPANET .net file (magic '$magic')"); }
	$net = array('file' => basename($path), 'version' => $r->int(), 'header' => array());
	for ($i = 0; $i < 10; $i++) { $net['header'][] = $r->int(); }

	// Title, then the project notes as a list, then the option block: a COUNT (45 in every file
	// seen) followed by that many strings. Reading the count rather than hard-coding 45 is what
	// keeps this working if an older or newer EPANET writes a different-length block.
	$net['title'] = $r->str();
	$net['notes'] = $r->listOfStr();
	$net['options'] = array();
	$nopt = $r->int();
	for ($i = 0; $i < $nopt; $i++) { $net['options'][] = $r->str(); }
	$r->bool(); // trailing flag on the option block; not used

	$net['patterns'] = array();
	$n = $r->int();
	for ($i = 0; $i < $n; $i++) {
		$id = $r->str(); $comment = $r->str();
		$net['patterns'][] = array('id' => $id, 'comment' => $comment, 'values' => $r->listOfStr());
	}

	$net['curves'] = array();
	$n = $r->int();
	for ($i = 0; $i < $n; $i++) {
		$id = $r->str(); $comment = $r->str(); $type = $r->str();
		$x = $r->listOfStr(); $y = $r->listOfStr();
		$net['curves'][] = array('id' => $id, 'comment' => $comment, 'type' => $type, 'x' => $x, 'y' => $y);
	}

	$net['nodes'] = array();
	foreach (array('junction', 'reservoir', 'tank') as $kind) {
		$n = $r->int();
		for ($i = 0; $i < $n; $i++) {
			$node = array('kind' => $kind, 'id' => $r->str(), 'x' => $r->num(), 'y' => $r->num(), 'props' => array());
			$np = $r->int();
			for ($p = 0; $p < $np; $p++) { $node['props'][] = $r->str(); }
			// Junctions alone carry a trailing demand-category list; each entry is a
			// "base;pattern;name" triple written as separate strings.
			if ($kind === 'junction') { $node['demands'] = $r->listOfStr(); }
			$net['nodes'][] = $node;
		}
	}

	$net['links'] = array();
	foreach (array('pipe', 'pump', 'valve') as $kind) {
		$n = $r->int();
		for ($i = 0; $i < $n; $i++) {
			$link = array('kind' => $kind, 'id' => $r->str(), 'from' => $r->str(), 'to' => $r->str(), 'verts' => array(), 'props' => array());
			$nv = $r->int();
			for ($v = 0; $v < $nv; $v++) { $link['verts'][] = array($r->num(), $r->num()); }
			$np = $r->int();
			for ($p = 0; $p < $np; $p++) { $link['props'][] = $r->str(); }
			$net['links'][] = $link;
		}
	}

	$net['controls'] = $r->listOfStr();
	$net['rules'] = $r->listOfStr();

	$net['labels'] = array();
	$n = $r->int();
	for ($i = 0; $i < $n; $i++) {
		$net['labels'][] = array(
			'text' => $r->str(), 'x' => $r->num(), 'y' => $r->num(),
			'anchor' => $r->str(), 'font' => $r->str(), 'size' => $r->int(),
			'bold' => $r->bool(), 'italic' => $r->bool(), 'meterType' => $r->int(), 'meterId' => $r->str()
		);
	}

	// Map extent, then the backdrop. The backdrop is a PATH ONLY -- see the note in --report.
	$net['extent'] = array($r->num(), $r->num(), $r->num(), $r->num());
	$net['backdrop'] = array('units' => $r->int(), 'file' => $r->str(), 'x' => $r->num(), 'y' => $r->num());
	// Everything after this is map display state (colors, symbol sizes, default properties).
	// Not read: nothing downstream needs it, and the trailer's shape varies by EPANET build --
	// which is why the integrity check below counts SECTIONS rather than demanding a clean EOF.
	$bad = netIntegrityError($net);
	if ($bad !== null) { throw new RuntimeException("section mismatch -- $bad"); }
	return $net;
}

/**
 * The header's ten counts against what was actually read.
 *
 * This is what makes reading an undocumented binary format defensible. The slot maps above were
 * derived from real files, not from a specification, so a build of EPANET that lays a section out
 * differently is a real possibility -- and a silent one, since a roughness read from the
 * minor-loss slot still produces a network that solves. If the walk lands in the wrong place these
 * counts disagree, and the file is refused instead of being read as a plausible different network.
 * js/lpn-net.js carries the same check for the browser.
 */
function netIntegrityError($net) {
	$got = array('junction' => 0, 'reservoir' => 0, 'tank' => 0, 'pipe' => 0, 'pump' => 0, 'valve' => 0);
	foreach ($net['nodes'] as $n) { $got[$n['kind']]++; }
	foreach ($net['links'] as $l) { $got[$l['kind']]++; }
	$h = $net['header'];
	$pairs = array(
		array('junctions', $h[0], $got['junction']), array('reservoirs', $h[1], $got['reservoir']),
		array('tanks', $h[2], $got['tank']), array('pipes', $h[3], $got['pipe']),
		array('pumps', $h[4], $got['pump']), array('valves', $h[5], $got['valve']),
		array('labels', $h[6], count($net['labels'])), array('patterns', $h[7], count($net['patterns'])),
		array('curves', $h[8], count($net['curves']))
	);
	foreach ($pairs as $p) {
		if ($p[1] !== $p[2]) { return $p[0] . ': the file says ' . $p[1] . ', the reader found ' . $p[2]; }
	}
	return null;
}

// ---------------------------------------------------------------- helpers

function slot($el, $map, $name) {
	global $NODE_SLOT, $LINK_SLOT;
	$m = $map === 'node' ? $NODE_SLOT : $LINK_SLOT;
	if (!isset($m[$name])) { return ''; }
	$i = $m[$name];
	return isset($el['props'][$i]) ? trim($el['props'][$i]) : '';
}
function numOr($s, $default) { return $s === '' ? $default : $s; }

// ---------------------------------------------------------------- write .inp

function netToInp($net) {
	global $OPTION_ORDER, $OPTION_PATTERN, $TIME_ORDER, $ENERGY_ORDER, $REPORT_ORDER,
		$OPT_QUALITY, $OPT_QUAL_UNITS, $OPT_TRACE_NODE,
		$REACTION_ORDER, $OPT_WALL_ORDER, $WALL_ORDER_NUMBER;
	$L = array();
	$L[] = '[TITLE]';
	$L[] = 'Converted from ' . $net['file'] . ' by dev/scripts/epanet_net_to_inp.php';
	$L[] = '';

	$sections = array('JUNCTIONS' => array(), 'RESERVOIRS' => array(), 'TANKS' => array());
	$emitters = array(); $demands = array(); $coords = array();
	foreach ($net['nodes'] as $n) {
		$coords[] = sprintf(' %-18s %-16s %s', $n['id'], rtrim(rtrim(sprintf('%.4f', $n['x']), '0'), '.'), rtrim(rtrim(sprintf('%.4f', $n['y']), '0'), '.'));
		if ($n['kind'] === 'junction') {
			$sections['JUNCTIONS'][] = sprintf(' %-18s %-12s %-12s %s',
				$n['id'], numOr(slot($n, 'node', 'elev'), '0'), numOr(slot($n, 'node', 'demand'), '0'), slot($n, 'node', 'pattern'));
			$em = slot($n, 'node', 'emitter');
			if ($em !== '' && (float)$em != 0) { $emitters[] = sprintf(' %-18s %s', $n['id'], $em); }
			// EVERY category goes to [DEMANDS], including the first, because [DEMANDS] REPLACES
			// the [JUNCTIONS] column rather than adding to it -- measured against the real engine
			// 2026-08-11 (100 in [JUNCTIONS] plus rows of 50 and 25 reads back as 75). Emitting
			// only categories 2+ would therefore have silently deleted category 1.
			// The triple layout (base, pattern, name) is INFERRED: all three of the models this
			// was written against carry an empty list, so no sample exercises it.
			$d = isset($n['demands']) ? $n['demands'] : array();
			for ($i = 0; $i + 1 < count($d); $i += 3) {
				$demands[] = sprintf(' %-18s %-12s %s', $n['id'], $d[$i], isset($d[$i + 1]) ? $d[$i + 1] : '');
			}
		} elseif ($n['kind'] === 'reservoir') {
			$sections['RESERVOIRS'][] = sprintf(' %-18s %-12s %s', $n['id'], numOr(slot($n, 'node', 'elev'), '0'), slot($n, 'node', 'res_pattern'));
		} else {
			$sections['TANKS'][] = sprintf(' %-18s %-10s %-10s %-10s %-10s %-10s %-10s %s',
				$n['id'], numOr(slot($n, 'node', 'elev'), '0'),
				numOr(slot($n, 'node', 'tank_initlevel'), '0'), numOr(slot($n, 'node', 'tank_minlevel'), '0'),
				numOr(slot($n, 'node', 'tank_maxlevel'), '0'), numOr(slot($n, 'node', 'tank_diam'), '0'),
				numOr(slot($n, 'node', 'tank_minvol'), '0'), slot($n, 'node', 'tank_volcurve'));
		}
	}

	$pipes = array(); $pumps = array(); $valves = array(); $verts = array(); $statusRows = array();
	foreach ($net['links'] as $l) {
		foreach ($l['verts'] as $v) {
			$verts[] = sprintf(' %-18s %-16s %s', $l['id'], rtrim(rtrim(sprintf('%.4f', $v[0]), '0'), '.'), rtrim(rtrim(sprintf('%.4f', $v[1]), '0'), '.'));
		}
		$status = slot($l, 'link', 'status');
		if ($l['kind'] === 'pipe') {
			$pipes[] = sprintf(' %-14s %-18s %-18s %-10s %-10s %-10s %-8s %s',
				$l['id'], $l['from'], $l['to'],
				numOr(slot($l, 'link', 'length'), '0'), numOr(slot($l, 'link', 'diameter'), '0'),
				numOr(slot($l, 'link', 'roughness'), '0'), numOr(slot($l, 'link', 'mloss'), '0'),
				$status === '' ? 'Open' : $status);
		} elseif ($l['kind'] === 'pump') {
			$params = array();
			if (slot($l, 'link', 'pump_curve') !== '') { $params[] = 'HEAD ' . slot($l, 'link', 'pump_curve'); }
			if (slot($l, 'link', 'pump_power') !== '') { $params[] = 'POWER ' . slot($l, 'link', 'pump_power'); }
			if (slot($l, 'link', 'pump_speed') !== '') { $params[] = 'SPEED ' . slot($l, 'link', 'pump_speed'); }
			if (slot($l, 'link', 'pump_pattern') !== '') { $params[] = 'PATTERN ' . slot($l, 'link', 'pump_pattern'); }
			$pumps[] = sprintf(' %-14s %-18s %-18s %s', $l['id'], $l['from'], $l['to'], implode('  ', $params));
			if ($status !== '' && strcasecmp($status, 'Open') !== 0) { $statusRows[] = sprintf(' %-18s %s', $l['id'], $status); }
		} else {
			$valves[] = sprintf(' %-14s %-18s %-18s %-10s %-8s %-12s %s',
				$l['id'], $l['from'], $l['to'],
				numOr(slot($l, 'link', 'valve_diam'), '0'), slot($l, 'link', 'valve_type'),
				numOr(slot($l, 'link', 'valve_setting'), '0'), numOr(slot($l, 'link', 'valve_mloss'), '0'));
			if ($status !== '' && strcasecmp($status, 'Open') !== 0) { $statusRows[] = sprintf(' %-18s %s', $l['id'], $status); }
		}
	}

	$put = function ($name, $rows, $header) use (&$L) {
		if (!count($rows)) { return; }
		$L[] = '[' . $name . ']';
		$L[] = ';' . $header;
		foreach ($rows as $row) { $L[] = $row; }
		$L[] = '';
	};
	$put('JUNCTIONS', $sections['JUNCTIONS'], 'ID                 Elev         Demand       Pattern');
	$put('RESERVOIRS', $sections['RESERVOIRS'], 'ID                 Head         Pattern');
	$put('TANKS', $sections['TANKS'], 'ID                 Elev      InitLvl   MinLvl    MaxLvl    Diameter  MinVol    VolCurve');
	$put('PIPES', $pipes, 'ID             Node1              Node2              Length    Diameter  Roughness MinorLoss Status');
	$put('PUMPS', $pumps, 'ID             Node1              Node2              Parameters');
	$put('VALVES', $valves, 'ID             Node1              Node2              Diameter  Type     Setting      MinorLoss');
	$put('DEMANDS', $demands, 'Junction           Demand       Pattern');
	$put('EMITTERS', $emitters, 'Junction           Coefficient');
	$put('STATUS', $statusRows, 'ID                 Status/Setting');

	if (count($net['patterns'])) {
		$L[] = '[PATTERNS]'; $L[] = ';ID                 Multipliers';
		foreach ($net['patterns'] as $p) {
			foreach (array_chunk($p['values'], 6) as $chunk) {
				$L[] = sprintf(' %-18s %s', $p['id'], implode('  ', $chunk));
			}
		}
		$L[] = '';
	}
	if (count($net['curves'])) {
		$L[] = '[CURVES]'; $L[] = ';ID                 X            Y';
		foreach ($net['curves'] as $c) {
			$L[] = ';' . $c['type'] . ': ' . ($c['comment'] !== '' ? $c['comment'] : $c['id']);
			for ($i = 0; $i < count($c['x']); $i++) {
				$L[] = sprintf(' %-18s %-12s %s', $c['id'], $c['x'][$i], isset($c['y'][$i]) ? $c['y'][$i] : '0');
			}
		}
		$L[] = '';
	}
	$put('CONTROLS', array_map(function ($s) { return ' ' . $s; }, $net['controls']), 'Simple controls');
	$put('RULES', array_map(function ($s) { return ' ' . $s; }, $net['rules']), 'Rule-based controls');

	$optAt = function ($i) use ($net) {
		return isset($net['options'][$i]) ? trim($net['options'][$i]) : '';
	};
	$rowsFor = function ($map) use ($optAt) {
		$out = array();
		foreach ($map as $i => $name) {
			$v = $optAt($i);
			if ($v !== '') { $out[] = sprintf(' %-20s %s', $name, $v); }
		}
		return $out;
	};
	$put('ENERGY', $rowsFor($ENERGY_ORDER), 'Global energy settings');
	// `[REACTIONS]`, in EPANET's own written order and in EPANET's own place. The wall order is the
	// one slot stored as a word and written as a number; a value that is neither observed word nor
	// already a number is left unwritten rather than guessed at.
	$wallOrder = $optAt($OPT_WALL_ORDER);
	$wallOrderNumber = '';
	if ($wallOrder !== '') {
		$up = strtoupper($wallOrder);
		if (isset($WALL_ORDER_NUMBER[$up])) { $wallOrderNumber = $WALL_ORDER_NUMBER[$up]; }
		elseif (preg_match('/^[-+]?(\d+\.?\d*|\.\d+)$/', $wallOrder)) { $wallOrderNumber = $wallOrder; }
	}
	$reactions = $wallOrderNumber === ''
		? array() : array(sprintf(' %-20s %s', 'Order Wall', $wallOrderNumber));
	$put('REACTIONS', array_merge($reactions, $rowsFor($REACTION_ORDER)), 'Global reaction settings');
	$put('TIMES', $rowsFor($TIME_ORDER), 'Clock and reporting');
	$put('REPORT', $rowsFor($REPORT_ORDER), 'EPANET report settings');

	$L[] = '[OPTIONS]';
	foreach ($OPTION_ORDER as $i => $name) {
		$v = $optAt($i);
		if ($v === '') { continue; }
		$L[] = sprintf(' %-20s %s', $name, $v);
	}
	// One line from three slots, its grammar set by its own first token.
	$qual = $optAt($OPT_QUALITY);
	$qualUnits = $optAt($OPT_QUAL_UNITS);
	$traceNode = $optAt($OPT_TRACE_NODE);
	if ($qual !== '' && strcasecmp($qual, 'None') !== 0) {
		if (strcasecmp($qual, 'Trace') === 0) {
			if ($traceNode !== '') { $L[] = sprintf(' %-20s Trace %s', 'Quality', $traceNode); }
		} elseif (strcasecmp($qual, 'Age') === 0) {
			$L[] = sprintf(' %-20s Age', 'Quality');
		} else {
			$L[] = sprintf(' %-20s %s%s', 'Quality', $qual, $qualUnits !== '' ? ' ' . $qualUnits : '');
		}
	}
	$pat = isset($net['options'][$OPTION_PATTERN]) ? trim($net['options'][$OPTION_PATTERN]) : '';
	if ($pat !== '') {
		foreach ($net['patterns'] as $p) { if ($p['id'] === $pat) { $L[] = sprintf(' %-20s %s', 'Pattern', $pat); break; } }
	}
	$L[] = '';

	$put('COORDINATES', $coords, 'Node               X-Coord          Y-Coord');
	$put('VERTICES', $verts, 'Link               X-Coord          Y-Coord');

	if (count($net['labels'])) {
		$L[] = '[LABELS]'; $L[] = ';X-Coord          Y-Coord          Label & Anchor Node';
		foreach ($net['labels'] as $lb) {
			$L[] = sprintf(' %-16s %-16s "%s" %s',
				rtrim(rtrim(sprintf('%.4f', $lb['x']), '0'), '.'),
				rtrim(rtrim(sprintf('%.4f', $lb['y']), '0'), '.'),
				str_replace('"', "'", $lb['text']), $lb['anchor']);
		}
		$L[] = '';
	}

	// The backdrop is written back out for completeness. EPANET stores only the PATH, so an
	// importer that wants the image has to be handed the image.
	if ($net['backdrop']['file'] !== '') {
		$L[] = '[BACKDROP]';
		$L[] = sprintf(' %-12s %s  %s  %s  %s', 'DIMENSIONS',
			rtrim(rtrim(sprintf('%.4f', $net['extent'][0]), '0'), '.'), rtrim(rtrim(sprintf('%.4f', $net['extent'][1]), '0'), '.'),
			rtrim(rtrim(sprintf('%.4f', $net['extent'][2]), '0'), '.'), rtrim(rtrim(sprintf('%.4f', $net['extent'][3]), '0'), '.'));
		$L[] = sprintf(' %-12s %s', 'FILE', $net['backdrop']['file']);
		$L[] = sprintf(' %-12s %s  %s', 'OFFSET',
			rtrim(rtrim(sprintf('%.4f', $net['backdrop']['x']), '0'), '.'),
			rtrim(rtrim(sprintf('%.4f', $net['backdrop']['y']), '0'), '.'));
		$L[] = '';
	}

	$L[] = '[END]';
	$L[] = '';
	return implode("\n", $L);
}

// ---------------------------------------------------------------- report

function netReport($net) {
	$counts = array('junction' => 0, 'reservoir' => 0, 'tank' => 0, 'pipe' => 0, 'pump' => 0, 'valve' => 0);
	foreach ($net['nodes'] as $n) { $counts[$n['kind']]++; }
	foreach ($net['links'] as $l) { $counts[$l['kind']]++; }
	$out = array();
	$out[] = $net['file'] . '  (EPANET file version ' . $net['version'] . ')';
	$out[] = sprintf('  %d junctions, %d reservoirs, %d tanks, %d pipes, %d pumps, %d valves',
		$counts['junction'], $counts['reservoir'], $counts['tank'], $counts['pipe'], $counts['pump'], $counts['valve']);
	$out[] = sprintf('  flow units %s, headloss %s, %d patterns, %d curves, %d labels, %d controls, %d rules',
		$net['options'][0], $net['options'][1], count($net['patterns']), count($net['curves']),
		count($net['labels']), count($net['controls']), count($net['rules']));
	$vt = array();
	foreach ($net['links'] as $l) { if ($l['kind'] === 'valve') { $vt[] = slot($l, 'link', 'valve_type') . ' ' . $l['id']; } }
	if ($vt) { $out[] = '  valves: ' . implode(', ', $vt); }
	$multi = 0;
	foreach ($net['nodes'] as $n) {
		if ($n['kind'] === 'junction' && isset($n['demands']) && count($n['demands']) > 3) { $multi++; }
	}
	if ($multi) { $out[] = '  ' . $multi . ' junction(s) with more than one demand category'; }
	$nv = 0;
	foreach ($net['links'] as $l) { $nv += count($l['verts']); }
	$out[] = '  ' . $nv . ' link vertices';
	$out[] = $net['backdrop']['file'] !== ''
		? '  backdrop: PATH ONLY, image not embedded -> ' . $net['backdrop']['file']
		: '  backdrop: none';
	$out[] = sprintf('  map extent: %.2f %.2f to %.2f %.2f', $net['extent'][0], $net['extent'][1], $net['extent'][2], $net['extent'][3]);
	return implode("\n", $out);
}

// ---------------------------------------------------------------- CLI

$argvv = array_slice($argv, 1);
if (!count($argvv)) {
	fwrite(STDERR, "usage: php epanet_net_to_inp.php [--report|--tokens|--all] <file.net> [-o out.inp]\n");
	exit(2);
}

$modelDir = __DIR__ . '/../epanet-models';

if ($argvv[0] === '--tokens') {
	$r = new NetReader(file_get_contents($argvv[1]));
	$i = 0;
	while (!$r->eof()) { $v = $r->value(); echo $i++, ' ', $v['t'], ' ', var_export($v['v'], true), "\n"; }
	exit(0);
}

if ($argvv[0] === '--all') {
	$files = glob($modelDir . '/*.net');
	if (!$files) { fwrite(STDERR, "no .net files in $modelDir\n"); exit(1); }
	foreach ($files as $f) {
		$net = netParse($f);
		$out = preg_replace('/\.net$/', '.inp', $f);
		file_put_contents($out, netToInp($net));
		echo netReport($net), "\n  -> ", basename($out), "\n\n";
	}
	exit(0);
}

$report = false;
if ($argvv[0] === '--report') { $report = true; array_shift($argvv); }
$in = $argvv[0];
$out = null;
for ($i = 1; $i < count($argvv); $i++) { if ($argvv[$i] === '-o') { $out = $argvv[$i + 1]; } }

$net = netParse($in);
if ($report) { echo netReport($net), "\n"; exit(0); }
$text = netToInp($net);
if ($out === null) { echo $text; }
else { file_put_contents($out, $text); echo netReport($net), "\n  -> $out\n"; }
