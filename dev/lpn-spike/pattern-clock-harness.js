// PATTERNS, TIME SETTINGS AND SIMPLE CONTROLS -- the data model behind extended-period simulation
// (ROADMAP Tasks 248.01, 248.02, 248.03). Run with:
//   node dev/lpn-spike/pattern-clock-harness.js
//
// WHY THIS EXISTS. dev/lpn-spike/net3-vs-epanet-report.js measured the whole remaining difference
// between our Net3 answers and EPANET's: at t=0 EPANET has applied each junction's demand pattern
// and we had not. Applying the multipliers by hand takes the mean flow error from 742.3 gpm to
// 0.0 gpm. So the arithmetic below is not a detail of a feature -- it IS the gap, and an off-by-one
// in it is a plausible wrong answer rather than a crash.
//
// THREE THINGS ARE CHECKED, in rising order of authority:
//   1. hand-computed index arithmetic, including a pattern shorter than the run and a non-zero
//      pattern start;
//   2. EPA's own Net3, read off disk -- pattern 1 starts at 1.34 and pattern 2 starts at 0. The
//      SECOND of those is the trap: a falsy test on a genuine zero has already produced a
//      confident wrong answer in this repo twice (see net3-vs-epanet-report.js's header), and it
//      is invisible unless something asserts on the zero itself.
//   3. THE REAL EPANET ENGINE, run as an extended-period simulation over a four-value pattern with
//      a two-hour pattern start, and its reported demand compared with ours at every step. That is
//      the only check here that can settle whether pattern start is ADDED or SUBTRACTED, because
//      both readings produce a perfectly ordinary-looking multiplier from the wrong end of the day.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
const EngCalcs = globalThis.EngCalcs;

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (cond) { return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// ================================================================================================
// 1. THE INDEX ARITHMETIC, hand-computed
// ================================================================================================
//
// Pattern A is [2, 5, 11, 7] -- four values, all distinct, none of them 1, so a wrong index is a
// wrong number rather than a coincidence. Step 1 hour throughout unless stated.
const A = EngCalcs.lpnPatternMake('A', [2, 5, 11, 7]);
const H = 3600;

ok('t=0 takes the FIRST multiplier', EngCalcs.lpnPatternValue(A, 0, H, 0) === 2);
ok('the first interval is half-open: t = step-1 is still index 0',
	EngCalcs.lpnPatternValue(A, H - 1, H, 0) === 2);
ok('t = step steps to index 1', EngCalcs.lpnPatternValue(A, H, H, 0) === 5);
ok('t = 2*step is index 2', EngCalcs.lpnPatternValue(A, 2 * H, H, 0) === 11);
ok('t = 3*step is index 3', EngCalcs.lpnPatternValue(A, 3 * H, H, 0) === 7);

// A PATTERN SHORTER THAN THE RUN REPEATS. Four values, eight hours: hours 4-7 are hours 0-3 again.
ok('hour 4 wraps to the first multiplier', EngCalcs.lpnPatternValue(A, 4 * H, H, 0) === 2);
ok('hour 5 wraps to the second', EngCalcs.lpnPatternValue(A, 5 * H, H, 0) === 5);
ok('hour 7 wraps to the fourth', EngCalcs.lpnPatternValue(A, 7 * H, H, 0) === 7);
ok('hour 8 wraps twice, back to the first', EngCalcs.lpnPatternValue(A, 8 * H, H, 0) === 2);
// Not a clamp: a clamped implementation returns the LAST value forever after hour 3, and every
// assertion above except this pair still passes.
ok('...which is a wrap and not a clamp to the last value',
	EngCalcs.lpnPatternValue(A, 40 * H, H, 0) === 2 && EngCalcs.lpnPatternValue(A, 41 * H, H, 0) === 5);

// A NON-ZERO PATTERN START. EPANET: "a value of 6 hours would mean that the first pattern interval
// used is the one which corresponds to 6 hours" -- so the offset is ADDED. With start = 2 h on a
// 1 h step, t=0 reads index 2.
ok('pattern start 2 h: t=0 reads index 2', EngCalcs.lpnPatternValue(A, 0, H, 2 * H) === 11);
ok('pattern start 2 h: t=1 h reads index 3', EngCalcs.lpnPatternValue(A, H, H, 2 * H) === 7);
ok('pattern start 2 h: t=2 h wraps to index 0', EngCalcs.lpnPatternValue(A, 2 * H, H, 2 * H) === 2);
// Subtracting instead of adding gives index (0-2) mod 4 = 2 at t=0 for THIS pattern by accident of
// its length, so the discriminating case is a start that is not half the length.
ok('pattern start 1 h distinguishes adding from subtracting',
	EngCalcs.lpnPatternValue(A, 0, H, 1 * H) === 5, 'subtracting would give ' + A.multipliers[3]);

// A pattern step that is not an hour.
ok('a 30-minute pattern step steps twice an hour',
	EngCalcs.lpnPatternValue(A, 1799, 1800, 0) === 2 && EngCalcs.lpnPatternValue(A, 1800, 1800, 0) === 5);

// Degenerate inputs, each with one right answer rather than a crash.
ok('no pattern is a multiplier of 1', EngCalcs.lpnPatternValue(null, 0, H, 0) === 1);
ok('an empty pattern is a multiplier of 1', EngCalcs.lpnPatternValue({ id: 'E', multipliers: [] }, 0, H, 0) === 1);
ok('a bare array of multipliers works too', EngCalcs.lpnPatternValue([3, 4], H, H, 0) === 4);
ok('an empty pattern has no index', EngCalcs.lpnPatternIndex(0, 0, H, 0) === -1);
ok('a negative elapsed time does not index off the front',
	EngCalcs.lpnPatternIndex(4, -H, H, 0) === 3);

// **A ZERO MULTIPLIER IS A REAL VALUE.** Asserted here on a synthetic pattern and again on Net3's
// own pattern 2 below, because this is the specific mistake with a track record in this repo.
ok('a leading zero multiplier comes back as 0, not as 1',
	EngCalcs.lpnPatternValue([0, 9], 0, H, 0) === 0);

// ================================================================================================
// 2. TIME SETTINGS
// ================================================================================================
const D = EngCalcs.lpnTimesDefaults();
ok('EPANET default duration is 0 -- the single-period run this page already does', D.duration === 0);
ok('EPANET default hydraulic timestep is 1:00', D.hydraulicStep === 3600);
ok('EPANET default pattern timestep is 1:00', D.patternStep === 3600);
ok('EPANET default pattern start is 0', D.patternStart === 0);
ok('EPANET default report timestep is 1:00', D.reportStep === 3600);
ok('EPANET default start clock time is 12 am', D.startClock === 0);

ok('24:00 is a day', EngCalcs.lpnParseTime(['24:00']) === 86400);
ok('55:00 is 55 hours, not capped at a day', EngCalcs.lpnParseTime(['55:00']) === 55 * 3600);
ok('0:05 is five minutes', EngCalcs.lpnParseTime(['0:05']) === 300);
ok('1:30:30 reads seconds too', EngCalcs.lpnParseTime(['1:30:30']) === 5430);
// The one most likely to be assumed to be seconds.
ok('a bare number is HOURS', EngCalcs.lpnParseTime(['2']) === 7200);
ok('an explicit unit is honoured', EngCalcs.lpnParseTime(['30', 'MINUTES']) === 1800);
ok('...and so is SEC', EngCalcs.lpnParseTime(['45', 'SEC']) === 45);
ok('12 am is midnight', EngCalcs.lpnParseTime(['12', 'am']) === 0);
ok('12 pm is noon', EngCalcs.lpnParseTime(['12', 'pm']) === 12 * 3600);
ok('3 PM is 15:00', EngCalcs.lpnParseTime(['3', 'PM']) === 15 * 3600);
ok('a joined 6AM parses', EngCalcs.lpnParseTime(['6AM']) === 6 * 3600);
ok('nonsense is null, not zero', EngCalcs.lpnParseTime(['none']) === null);
ok('nothing is null', EngCalcs.lpnParseTime([]) === null);

// The text bag: a time's file text is not a number, so mergeTok can never hold it.
const T = { duration: 86400, text: { duration: '24:00', startClock: '12 am' } };
ok('a time keeps the file\'s own text', EngCalcs.lpnTimeText(T, 'duration', 86400) === '24:00');
ok('...and drops it once the value no longer matches',
	EngCalcs.lpnTimeText(T, 'duration', 36000) === '10:00');
ok('a time with no stored text formats', EngCalcs.lpnTimeText({}, 'duration', 5400) === '1:30');

// ================================================================================================
// 3. SIMPLE CONTROLS
// ================================================================================================
function ctl(line) {
	const r = EngCalcs.lpnParseControl(line.trim().split(/\s+/));
	return r.ok ? r.control : null;
}

const c1 = ctl('LINK 9 OPEN IF NODE 2 BELOW 110');
ok('a node condition parses', !!c1 && c1.link === '9' && c1.action.status === 'open' &&
	c1.condition.kind === 'node' && c1.condition.node === '2' &&
	c1.condition.cmp === 'below' && c1.condition.value === 110, JSON.stringify(c1));
const c2 = ctl('Link 10 CLOSED AT TIME 15');
ok('a time condition parses, in HOURS', !!c2 && c2.condition.kind === 'time' &&
	c2.condition.seconds === 15 * 3600, JSON.stringify(c2));
const c3 = ctl('LINK 12 OPEN AT CLOCKTIME 3 AM');
ok('a clocktime condition parses', !!c3 && c3.condition.kind === 'clocktime' &&
	c3.condition.seconds === 3 * 3600, JSON.stringify(c3));
const c4 = ctl('LINK V1 12.5 IF NODE J9 ABOVE 40');
ok('a numeric action is a SETTING, not a status', !!c4 && c4.action.setting === 12.5 &&
	c4.action.status === undefined, JSON.stringify(c4));
ok('a setting keeps its own text', !!c4 && c4.text.setting === '12.5');
ok('a bare LINK id status is refused, not accepted as unconditional',
	EngCalcs.lpnParseControl(['LINK', '9', 'OPEN']).ok === false);
ok('a rule-based line is refused by name',
	EngCalcs.lpnParseControl(['RULE', '1']).error === 'not-a-control');
ok('an unreadable comparison is refused',
	EngCalcs.lpnParseControl('LINK 9 OPEN IF NODE 2 NEAR 110'.split(' ')).error === 'bad-comparison');

// ---- resolving a state ----
const controls = [
	ctl('LINK L1 OPEN AT TIME 1'),
	ctl('LINK L1 CLOSED AT TIME 15'),
	ctl('LINK L2 OPEN IF NODE T1 BELOW 17.1'),
	ctl('LINK L2 CLOSED IF NODE T1 ABOVE 19.1')
];
function states(t, level) {
	return EngCalcs.lpnControlStates(controls, {
		time: t, startClock: 0,
		node: function (id) { return id === 'T1' ? level : undefined; }
	});
}
ok('before its time a control has not acted', states(0, 18).L1 === undefined);
ok('at its time it has', states(3600, 18).L1.status === 'open');
ok('later, the LATER time control wins', states(20 * 3600, 18).L1.status === 'closed');
ok('a level below the low trigger opens', states(0, 17).L2.status === 'open');
ok('a level above the high trigger closes', states(0, 20).L2.status === 'closed');
ok('a level between the triggers leaves the link alone', states(0, 18).L2 === undefined);
// ABOVE and BELOW are strict, which is how a tank sitting exactly on its trigger behaves.
ok('exactly on the trigger is neither above nor below', states(0, 19.1).L2 === undefined);
ok('an unknown node value is skipped, not guessed at',
	EngCalcs.lpnControlStates(controls, { time: 0, node: function () { return undefined; } }).L2 === undefined);

// A node condition overrides a time control that fired earlier, because it is acting NOW.
const mixed = [ctl('LINK L3 CLOSED AT TIME 1'), ctl('LINK L3 OPEN IF NODE T1 BELOW 5')];
ok('a node condition holding now beats a time control that fired an hour ago',
	EngCalcs.lpnControlStates(mixed, { time: 7200, node: function () { return 3; } }).L3.status === 'open');
ok('...and does not act when its condition is false',
	EngCalcs.lpnControlStates(mixed, { time: 7200, node: function () { return 9; } }).L3.status === 'closed');

// CLOCKTIME REPEATS DAILY, and the pair below is the case that exposes a "has it happened yet"
// implementation: on day two at 1 am both have happened, and only the most recent one is in force.
const daily = [ctl('LINK L4 OPEN AT CLOCKTIME 6 AM'), ctl('LINK L4 CLOSED AT CLOCKTIME 10 PM')];
function dayState(t) { return EngCalcs.lpnControlStates(daily, { time: t, startClock: 0 }).L4; }
ok('day 1, 7 am: open', dayState(7 * 3600).status === 'open');
ok('day 1, 11 pm: closed', dayState(23 * 3600).status === 'closed');
ok('day 2, 1 am: still closed from last night', dayState(25 * 3600).status === 'closed');
ok('day 2, 7 am: open again', dayState(31 * 3600).status === 'open');
// Start ClockTime shifts when a clocktime control fires in ELAPSED time.
const shifted = [ctl('LINK L5 OPEN AT CLOCKTIME 6 AM')];
ok('with the run starting at 4 am, 6 am is 2 h in',
	EngCalcs.lpnControlStates(shifted, { time: 2 * 3600 - 1, startClock: 4 * 3600 }).L5 === undefined &&
	EngCalcs.lpnControlStates(shifted, { time: 2 * 3600, startClock: 4 * 3600 }).L5.status === 'open');

// ================================================================================================
// 4. EPA's OWN Net3, read off disk
// ================================================================================================
const net3 = EngCalcs.lpnInpParse(
	fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8'));
ok('Net3 parses', net3.ok);

const p1 = EngCalcs.lpnPatternById(net3.patterns, '1');
const p2 = EngCalcs.lpnPatternById(net3.patterns, '2');
ok('Net3 has pattern 1', !!p1);
ok('Net3 has pattern 2', !!p2);
// THE NUMBER THE WHOLE GAP IS MADE OF.
ok('pattern 1 starts at 1.34', !!p1 && p1.multipliers[0] === 1.34, p1 && p1.multipliers[0]);
ok('...and lpnPatternValue agrees at t=0',
	EngCalcs.lpnPatternValue(p1, 0, net3.times.patternStep, net3.times.patternStart) === 1.34);
// **THE TRAP.** `if (!pats[id])` read this zero as 1818, six hours further down the same pattern.
ok('pattern 2 starts at 0', !!p2 && p2.multipliers[0] === 0, p2 && JSON.stringify(p2.multipliers.slice(0, 3)));
ok('...and lpnPatternValue returns that zero rather than a default of 1',
	EngCalcs.lpnPatternValue(p2, 0, net3.times.patternStep, net3.times.patternStart) === 0);
// The multipliers CONCATENATE across lines: pattern 1 is four lines of six values.
ok('pattern 1 is 24 values long', !!p1 && p1.multipliers.length === 24, p1 && p1.multipliers.length);
ok('...and the seventh comes off the second line', !!p1 && p1.multipliers[6] === 0.85, p1 && p1.multipliers[6]);
ok('a multiplier written .76 keeps its own text',
	!!p1 && EngCalcs.lpnNumText(p1, 'm4', p1.multipliers[4]) === '.76',
	p1 && EngCalcs.lpnNumText(p1, 'm4', p1.multipliers[4]));
ok('pattern 2 wraps back to its zero after 24 h',
	EngCalcs.lpnPatternValue(p2, 24 * 3600, 3600, 0) === 0);

ok('Net3 [TIMES] is read', !!net3.times);
ok('...duration 24:00', net3.times.duration === 86400);
ok('...pattern timestep 1:00', net3.times.patternStep === 3600);
ok('...start clock time 12 am is midnight', net3.times.startClock === 0);
ok('...and the file\'s own text survives', EngCalcs.lpnTimeText(net3.times, 'duration', 86400) === '24:00');

ok('Net3 [CONTROLS] is read: six of them', net3.controls.length === 6, net3.controls.length);
const lakeCtl = net3.controls.filter((c) => c.link === '10');
ok('the lake source opens at 1:00 and closes at 15:00',
	lakeCtl.length === 2 && lakeCtl[0].condition.seconds === 3600 &&
	lakeCtl[1].condition.seconds === 15 * 3600, JSON.stringify(lakeCtl.map((c) => c.condition)));
const tankCtl = net3.controls.filter((c) => c.link === '335')[0];
// THE UNIT THE THRESHOLD IS IN, which is the whole reason this reading lives in lpn-inp.js and not
// in lpn-patterns.js: node 1 is a TANK, so 17.1 is a water LEVEL, not a pressure.
ok('a threshold on a tank is a LEVEL, named as such',
	!!tankCtl && tankCtl.condition.unit === 'head', tankCtl && tankCtl.condition.unit);
ok('...and that unit is a key of the parser\'s own scale record',
	!!tankCtl && net3.scale[tankCtl.condition.unit] !== undefined);

// Net1's own pair, `LINK 9 OPEN IF NODE 2 BELOW 110`. Node 2 there is the TANK, so 110 is a level
// -- and the harness first read it as a junction and accused the code, which is the whole reason
// the unit is decided from the node's TYPE rather than from how the number looks.
const net1 = EngCalcs.lpnInpParse(
	fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'utf8'));
const n1c = net1.controls[0];
ok('Net1 [CONTROLS] is read', net1.controls.length === 2, net1.controls.length);
ok('Net1\'s threshold is on its tank, so it is a level',
	!!n1c && n1c.condition.node === '2' && n1c.condition.unit === 'head',
	n1c && JSON.stringify(n1c.condition));

// A threshold on a JUNCTION is the other half of that table, and it is a PRESSURE.
const jCtl = EngCalcs.lpnInpParse(
	'[JUNCTIONS]\n J1 10 5\n[RESERVOIRS]\n R1 100\n[PIPES]\n P1 R1 J1 100 12 100 0 Open\n' +
	'[CONTROLS]\n LINK P1 CLOSED IF NODE J1 ABOVE 60\n[OPTIONS]\n Units GPM\n[END]\n').controls[0];
ok('a threshold on a junction is a PRESSURE',
	!!jCtl && jCtl.condition.unit === 'press', jCtl && JSON.stringify(jCtl.condition));

// ---- the three sections are no longer reported as dropped ----
function codes(p) { return p.dropped.map((d) => d.code); }
['patterns', 'controls'].forEach((code) => {
	ok('Net3 no longer reports [' + code.toUpperCase() + '] as dropped', codes(net3).indexOf(code) < 0,
		JSON.stringify(net3.dropped.filter((d) => d.code === code)));
	ok('Net1 no longer reports [' + code.toUpperCase() + '] as dropped', codes(net1).indexOf(code) < 0);
});
// [TIMES] IS READ AND STILL REPORTED, and the difference between those two is the point. Nothing
// runs over time yet, so a 24-hour file really does describe more than this page shows; the report
// goes when the RUN lands, not when the reader does. Asserted so that removing it is a decision.
ok('a duration is still reported, because nothing runs over time yet',
	codes(net3).indexOf('extended-period') >= 0);
ok('...quoting the file\'s own text',
	(net3.dropped.filter((d) => d.code === 'extended-period')[0] || {}).detail === '24:00');
// [RULES] stays out of scope, by name.
ok('rule-based controls are still reported when a file has them',
	EngCalcs.lpnInpParse(
		'[JUNCTIONS]\n J1 10 5\n[RESERVOIRS]\n R1 100\n[PIPES]\n P1 R1 J1 100 12 100 0 Open\n' +
		'[RULES]\n RULE 1\n IF TANK T1 LEVEL ABOVE 5\n[OPTIONS]\n Units GPM\n[END]\n'
	).dropped.some((d) => d.code === 'rules'));

// A junction's pattern reference is carried onto the junction.
const j15 = net3.nodes.filter((n) => n.id === '15')[0];
ok('a junction carries its demand pattern id', !!j15 && j15.demandPattern === '3',
	j15 && j15.demandPattern);
ok('a junction with no pattern column carries null',
	net3.nodes.filter((n) => n.type === 'junction' && n.demandPattern === null).length > 0);
// **AND A BLANK COLUMN MEANS THE [OPTIONS] DEFAULT, NOT "NO PATTERN".** Net3 declares
// `Pattern 1`, whose first multiplier is 1.34, so reading a blank column as 1.00 is 34% low on
// nearly every demand in the network while every visible number looks reasonable.
ok('Net3\'s default demand pattern is read off [OPTIONS]', net3.defaultPattern === '1',
	net3.defaultPattern);
ok('Net1\'s is read too', net1.defaultPattern === '1', net1.defaultPattern);
ok('a file that states none has none',
	EngCalcs.lpnInpParse(
		'[JUNCTIONS]\n J1 10 5\n[RESERVOIRS]\n R1 100\n[PIPES]\n P1 R1 J1 100 12 100 0 Open\n' +
		'[OPTIONS]\n Units GPM\n[END]\n').defaultPattern === null);

// A control naming something the file does not contain is reported, not silently kept.
const bad = EngCalcs.lpnInpParse(
	'[JUNCTIONS]\n J1 10 5\n[RESERVOIRS]\n R1 100\n[PIPES]\n P1 R1 J1 100 12 100 0 Open\n' +
	'[CONTROLS]\n LINK NOPE OPEN AT TIME 1\n LINK P1 OPEN IF NODE GHOST BELOW 5\n LINK P1 SIDEWAYS AT TIME 2\n' +
	'[OPTIONS]\n Units GPM\n[END]\n');
ok('a control on a link that is not in the file is reported',
	bad.dropped.filter((d) => d.code === 'controls').length === 3, JSON.stringify(bad.dropped));
ok('...and none of them was kept', bad.controls.length === 0);

// A control's SETTING takes its unit from the link, through the same table the [VALVES] rows use.
const withValve = EngCalcs.lpnInpParse(
	'[JUNCTIONS]\n J1 10 5\n J2 10 0\n[RESERVOIRS]\n R1 100\n' +
	'[PIPES]\n P1 R1 J1 100 12 100 0 Open\n' +
	'[VALVES]\n V1 J1 J2 12 FCV 50 0\n' +
	'[CONTROLS]\n LINK V1 25 AT TIME 1\n[OPTIONS]\n Units GPM\n[END]\n');
ok('a setting on an FCV is named a FLOW',
	withValve.controls.length === 1 && withValve.controls[0].action.settingUnit === 'flow',
	JSON.stringify(withValve.controls));

// ---- the degradation path, when js/lpn-patterns.js was never loaded ----
// The browser loads its scripts from tags this file cannot see, and a forgotten one must not take
// the whole importer down over a section that is not the point of the file. What it must do
// instead is report exactly what it reported before Task 248 -- and only for sections the file
// actually has, or every user hears about patterns in a file that contains none.
(function () {
	const parse = EngCalcs.lpnParseControl, times = EngCalcs.lpnTimesDefaults;
	delete EngCalcs.lpnParseControl; delete EngCalcs.lpnTimesDefaults;
	const degraded = EngCalcs.lpnInpParse(
		fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8'));
	const plain = EngCalcs.lpnInpParse(
		'[JUNCTIONS]\n J1 10 5\n[RESERVOIRS]\n R1 100\n[PIPES]\n P1 R1 J1 100 12 100 0 Open\n' +
		'[OPTIONS]\n Units GPM\n[END]\n');
	EngCalcs.lpnParseControl = parse; EngCalcs.lpnTimesDefaults = times;
	ok('without lpn-patterns.js the file still imports', degraded.ok && degraded.nodes.length > 0);
	ok('...and says so, section by section',
		['patterns', 'controls', 'extended-period'].every((c) =>
			degraded.dropped.some((d) => d.code === c && d.detail === 'lpn-patterns.js not loaded')),
		JSON.stringify(degraded.dropped));
	ok('...but says nothing about a file that has none of those sections',
		plain.dropped.length === 0, JSON.stringify(plain.dropped));
}());

// ================================================================================================
// 5. THE REAL EPANET ENGINE -- the authority on the wrap and on the pattern-start direction
// ================================================================================================
//
// One reservoir, one junction, one pipe, a base demand of 10 gpm and a four-value pattern with a
// ONE-HOUR pattern start. One hour and not two, deliberately: on a pattern of length 4 an offset of
// 2 lands on the same index whether it is added or subtracted, so a two-hour start would let the
// authority agree with a reader that has the sign backwards. The engine is run as an extended-period simulation and its own reported
// demand at each hydraulic step is compared with EngCalcs.lpnPatternValue at the same instant. The
// multipliers are 2, 5, 11 and 7 -- distinct, none of them 1, none of them a multiple of another --
// so every wrong index is a visibly wrong number.
const PROBE =
	'[TITLE]\npattern probe\n\n' +
	'[JUNCTIONS]\n J1 0 10 PAT\n\n' +
	'[RESERVOIRS]\n R1 100\n\n' +
	'[PIPES]\n P1 R1 J1 1000 12 100 0 Open\n\n' +
	'[PATTERNS]\n PAT 2 5\n PAT 11 7\n\n' +
	'[TIMES]\n Duration 8:00\n Hydraulic Timestep 1:00\n Pattern Timestep 1:00\n Pattern Start 1:00\n\n' +
	'[OPTIONS]\n Units GPM\n Headloss H-W\n\n' +
	'[COORDINATES]\n J1 0 0\n R1 100 0\n\n[END]\n';

async function engineCheck() {
	const probe = EngCalcs.lpnInpParse(PROBE);
	ok('the probe file parses', probe.ok);
	ok('the probe pattern concatenated across two lines',
		probe.patterns.length === 1 && probe.patterns[0].multipliers.join(',') === '2,5,11,7',
		JSON.stringify(probe.patterns));
	ok('the probe pattern start is 1 h', probe.times.patternStart === 3600);

	const mod = await import('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const ws = new mod.Workspace();
	await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('probe.inp', PROBE);
	p.open('probe.inp', 'probe.rpt', 'probe.out');
	p.openH();
	p.initH(0);
	let tstep = 0, steps = 0, worst = 0, worstAt = null;
	do {
		const t = p.runH();
		// EN_DEMAND = 9, in the file's flow unit (gpm), against a base demand of 10.
		const engine = p.getNodeValue(1, 9);
		const ours = 10 * EngCalcs.lpnPatternValue(
			probe.patterns[0], t, probe.times.patternStep, probe.times.patternStart);
		const d = Math.abs(engine - ours);
		if (d > worst) { worst = d; worstAt = t + ' s: EPANET ' + engine + ', ours ' + ours; }
		steps++;
		tstep = p.nextH();
	} while (tstep > 0);
	p.closeH();
	p.close();
	// Nine hydraulic steps for an 8-hour run on a 1-hour step (0:00 through 8:00 inclusive). Asserted
	// so a silently-truncated run cannot make the comparison pass by never running it.
	ok('the engine ran every hour of the probe', steps === 9, steps + ' steps');
	ok('EPANET\'s own demand matches ours at every step, wrap and pattern start included',
		worst < 1e-6, worstAt);

	// ---- and the whole thing at once, on EPA's Net3 at t=0 ----------------------------------
	// THIS IS THE MEASURED GAP CLOSING. Every junction's demand as the engine reports it at t=0,
	// against base demand x the multiplier this data model resolves -- pattern column, [OPTIONS]
	// default, wrap and all. It is the assertion that would have caught either of the two bugs in
	// net3-vs-epanet-report.js's header, and it fails if the [OPTIONS] default is ignored.
	const n3text = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8');
	const ws3 = new mod.Workspace();
	await ws3.loadModule();
	const p3 = new mod.Project(ws3);
	ws3.writeFile('net3.inp', n3text);
	p3.open('net3.inp', 'net3.rpt', 'net3.out');
	p3.openH();
	p3.initH(0);
	p3.runH();
	let compared = 0, worst3 = 0, worst3At = null;
	net3.nodes.forEach((nd) => {
		if (nd.type !== 'junction') { return; }
		const idx = p3.getNodeIndex(nd.id),
			engine = p3.getNodeValue(idx, 9),
			pat = EngCalcs.lpnPatternById(net3.patterns, nd.demandPattern || net3.defaultPattern),
			ours = nd.demand * EngCalcs.lpnPatternValue(pat, 0, net3.times.patternStep, net3.times.patternStart),
			d = Math.abs(engine - ours);
		compared++;
		if (d > worst3) { worst3 = d; worst3At = nd.id + ': EPANET ' + engine + ', ours ' + ours; }
	});
	p3.closeH();
	p3.close();
	ok('every Net3 junction was compared', compared === 92, compared + ' junctions');
	ok('EPANET\'s Net3 demands at t=0 are exactly base x the resolved multiplier',
		worst3 < 1e-4, worst3At);
}

engineCheck().then(() => {
	console.log((fails ? 'FAILED ' : 'ok ') + (checks - fails) + '/' + checks + ' checks');
	if (fails) { process.exitCode = 1; }
}).catch((e) => {
	console.log('  FAIL engine check threw -- ' + (e && e.message));
	console.log('FAILED ' + (checks - fails) + '/' + checks + ' checks');
	process.exitCode = 1;
});
