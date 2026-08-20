// Harness for COLOUR BY VALUE (ROADMAP Task 384), the THEMATIC map (Task 327) and the RAMP PICKER
// that consumes js/lpn-ramps.js (Tasks 427, 429) -- run with:
//   node dev/lpn-spike/color-ramp-harness.js
//
// WHY THIS EXISTS. Every claim colouring makes is invisible to the eye that is checking it: a map
// full of colour looks equally plausible whether the breaks are right, whether the ramp is being
// read at the class count the swatch is drawing, and whether a pump with no velocity got the bottom
// colour or none at all. The defects worth naming, all of which look fine in a browser:
//   * an UNDEFINED value taking the bottom colour, which asserts "low" about a quantity that does
//     not exist on that element (a pump has no velocity);
//   * the picture and the map disagreeing about how many classes there are -- a swatch of seven
//     boxes over a five-class map, which makes the picker a liar;
//   * a break value being treated as SI while the user typed it in the displayed unit -- the same
//     class of defect as every other unit bug on this page, and equally invisible under one preset;
//   * a ramp SLICED to a shorter class count instead of taken from its own published set, which
//     throws away the design work that is the entire reason to use Brewer's schemes.
//
// The network is the shipped ring main, solved for real: the assertions below are about the
// solver's own pressures and velocities, not about numbers this file made up.

const { ROOT, mkEl, byId, ensure, unitSelects, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
// The same module the page loads, asked directly: an expectation computed from it is the coupling
// under test, while a retyped hex or a retyped break would be testing a copy.
const R = require(ROOT + 'js/lpn-ramps.js').lpnRamps;

const L = loadLoopedNetwork(
	"\t\tdrawExample: drawExampleNetwork, runSolve: runSolve,\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\trefreshValueColors: refreshValueColors,\n" +
	"\t\trebuildSettingsFields: rebuildSettingsFields,\n" +
	"\t\tbuildColoringSection: buildColoringSection,\n" +
	"\t\tcomputedBreaks: computedBreaks, effectiveBreaks: effectiveBreaks,\n" +
	"\t\tstoredBreaks: storedBreaks, colorModeOf: colorModeOf,\n" +
	"\t\tfillFromMethod: fillFromMethod,\n" +
	"\t\tsetProp: setProp, effective: effective,\n" +
	"\t\tcolorClassCount: colorClassCount, rampColorList: rampColorList,\n" +
	"\t\trampGroups: rampGroups, bandColor: bandColor, colorForValue: colorForValue,\n" +
	"\t\tcolorNodeValue: colorNodeValue, colorLinkValue: colorLinkValue,\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tcolorValues: colorValues,\n" +
	"\t\tnodeFill: function (id) { return nodeEls[id] ? (nodeEls[id].circle.style.fill || '') : null; },\n" +
	"\t\tnodeSymbolColor: function (id) { return (nodeEls[id] && nodeEls[id].symbol) ? (nodeEls[id].symbol.style.color || '') : null; },\n" +
	"\t\tlinkStroke: function (id) { return linkEls[id] ? (linkEls[id].line.style.stroke || '') : null; },\n" +
	"\t\tsvgClasses: function () { return svg && svg.classList ? svg.classList : null; },\n" +
	"\t\tlegendBox: function () { return colorLegendBox; },\n" +
	"\t\tlabelSettingsJson: function () { return JSON.stringify(labelSettings); },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0;
// The house pattern in these harnesses: the stub records listeners and the test calls them,
// so a control is exercised the way a user exercises it rather than by calling the handler's
// insides.
function fire(el, type) { (el._listeners[type] || []).forEach(function (fn) { fn({ type: type, currentTarget: el, target: el }); }); }
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function allText(n) {
	if (!n) { return ''; }
	let t = n.textContent || '';
	(n.children || []).forEach(function (c) { t += allText(c); });
	return t;
}
// The stub's querySelectorAll answers [], so descendants are walked by hand -- which is honest
// about what this harness can see and keeps every assertion below about the tree we really built.
function walk(n, out) {
	out = out || [];
	(n.children || []).forEach(function (c) { out.push(c); walk(c, out); });
	return out;
}

// Looped-Network.php puts #lpn_labels_legend inside the map wrapper, and the colour key is created
// as its SIBLING (colorLegendEl()). The stub creates every id as an orphan, so without this the key
// has nowhere to be appended and every assertion about it would vacuously pass on a null. Same fix,
// and the same reason, as the stub's own menu-popup/menu-list nesting.
byId.lpn_canvas.appendChild(byId.lpn_labels_legend);

function fresh(unitSet) {
	setUnitSet(unitSet || 'us');
	L.reset();
	L.drawExample();
	L.runSolve();
}

// ---- 1. the class count, and the ramp read at it ----------------------------------------------
console.log('== classes and ramp ==');
{
	fresh('us');
	const s = L.getSettings();
	// **A SCHEME PER ELEMENT CLASS** (Tom, 2026-08-19: a ramp picker at the bottom of BOTH
	// symbology groups). Nodes and links each carry a ramp, a class count and a reverse flag, and
	// every reader takes the group as its first argument -- so a drawing path that reached for the
	// other group's scheme could not compile past this file.
	ok('a new project opens on seven classes for both kinds of element -- Brewer\'s ceiling',
		s.colorClassesNode === 7 && s.colorClassesLink === 7 &&
		L.colorClassCount('node') === 7 && L.colorClassCount('link') === 7,
		s.colorClassesNode + '/' + s.colorClassesLink);
	// **NEVER THE RAINBOW.** It is kept for comparison with EPANET and is not what a new map is
	// handed; Tom: it "goes last, in its own group, and is never the default".
	ok('neither default ramp is the rainbow',
		s.colorRampNode !== 'epanet' && s.colorRampLink !== 'epanet',
		s.colorRampNode + '/' + s.colorRampLink);
	ok('...and both are real keys of the catalogue',
		!!R.RAMPS[s.colorRampNode] && !!R.RAMPS[s.colorRampLink]);
	// THE TWO ARE INDEPENDENT, which is the whole of the split: setting one must not move the other.
	s.colorRampNode = 'reds';
	s.colorRampLink = 'blues';
	ok('the two groups read their own ramps',
		L.rampColorList('node').join(',') === R.RAMPS.reds.colors[7].join(',') &&
		L.rampColorList('link').join(',') === R.RAMPS.blues.colors[7].join(','));
	s.colorClassesNode = 4;
	ok('...and their own class counts',
		L.colorClassCount('node') === 4 && L.colorClassCount('link') === 7);
	s.colorClassesNode = 7;
	s.colorReverseNode = true;
	ok('...and their own reverse flag',
		L.rampColorList('node')[0] === R.RAMPS.reds.colors[7][6] &&
		L.rampColorList('link')[0] === R.RAMPS.blues.colors[7][0]);
	s.colorReverseNode = false;

	// **DEGRADE TO THE PUBLISHED SET, NEVER A SUBSET.** Brewer designs each count separately, so a
	// 5-class scheme must come out of her 5-class table -- not out of the 7-class one with two
	// colours dropped. Asserted against the module's own published set, which is the only source
	// that can tell the two apart.
	s.colorRampNode = 'ylgnbu';
	s.colorReverseNode = false;
	for (let n = R.MIN_CLASSES; n <= R.MAX_CLASSES; n++) {
		s.colorClassesNode = n;
		ok('a ' + n + '-class map uses the ' + n + '-class published set',
			L.rampColorList('node').join(',') === R.RAMPS.ylgnbu.colors[n].join(','),
			L.rampColorList('node').join(','));
	}
	s.colorClassesNode = 7;
	ok('reversing runs the same published set the other way',
		(() => { s.colorReverseNode = true; const got = L.rampColorList('node').join(','); s.colorReverseNode = false;
			return got === R.RAMPS.ylgnbu.colors[7].slice().reverse().join(','); })());
	// A key from the five-ramp era, and one we never shipped: neither may blank the map.
	['epanet', 'viridis', 'gray', 'ylgnbu', 'rdylbu'].forEach(function (k) {
		s.colorRampNode = k;
		ok('a project saved on "' + k + '" still resolves', L.rampColorList('node').every(c => /^#[0-9a-f]{6}$/.test(c)));
	});
	s.colorRampNode = 'no-such-ramp-was-ever-shipped';
	ok('an unknown ramp key falls back rather than throwing', L.rampColorList('node').length === 7);
	s.colorRampNode = 'viridis';
	s.colorRampLink = 'viridis';
}

// ---- 2. the picker's groups -------------------------------------------------------------------
console.log('== groups ==');
{
	fresh('us');
	const groups = L.rampGroups();
	ok('the three families come first, in Brewer\'s own order',
		groups.slice(0, 3).map(g => g.key).join(',') === R.FAMILIES.join(','),
		groups.map(g => g.key).join(','));
	ok('the rainbow is LAST and in a group of its own',
		groups[groups.length - 1].key === 'rainbow' &&
		groups[groups.length - 1].ramps.join(',') === 'epanet');
	ok('...and therefore not among the sequential schemes',
		groups[0].ramps.indexOf('epanet') < 0);
	const listed = groups.reduce((a, g) => a.concat(g.ramps), []);
	ok('every ramp in the catalogue is reachable from some group',
		listed.length === R.rampKeys().length, listed.length + ' of ' + R.rampKeys().length);
	ok('and none is listed twice', new Set(listed).size === listed.length);
}

// ---- 3. banding -------------------------------------------------------------------------------
console.log('== bands ==');
{
	fresh('us');
	const s = L.getSettings();
	s.colorRampNode = 'epanet';
	s.colorReverseNode = false;
	s.colorClassesNode = 5;
	const ramp = R.RAMPS.epanet.colors[5];
	const breaks = [10, 20, 30, 40];
	ok('below the first break takes the bottom colour', L.colorForValue('node', 5, breaks) === ramp[0]);
	ok('at a break takes the band ABOVE it (>= is the upper band)',
		L.colorForValue('node', 10, breaks) === ramp[1], L.colorForValue('node', 10, breaks));
	ok('above the last break takes the top colour', L.colorForValue('node', 1e6, breaks) === ramp[4]);
	// The undefined rule, which is the one a browser cannot show you.
	ok('an undefined value gets NO colour, not the bottom one', L.colorForValue('node', undefined, breaks) === '');
	ok('NaN gets no colour', L.colorForValue('node', NaN, breaks) === '');
	ok('null gets no colour', L.colorForValue('node', null, breaks) === '');
	// n classes, n colours, in order. Nothing is sampled out of a longer set any more -- the ramp
	// is asked for the count the map is drawn in.
	s.colorClassesNode = 3;
	ok('three classes are the ramp\'s own three colours, in order',
		[0, 1, 2].map(i => L.bandColor('node', i, 3)).join(',') === R.RAMPS.epanet.colors[3].join(','),
		[0, 1, 2].map(i => L.bandColor('node', i, 3)).join(','));
	s.colorClassesNode = 5;
	s.colorReverseNode = true;
	ok('reversing swaps the ends',
		L.colorForValue('node', 5, breaks) === ramp[4] && L.colorForValue('node', 1e6, breaks) === ramp[0]);
	// **AND IT REVERSES ONE GROUP ONLY.** The link scheme is on the same ramp and must be unmoved.
	s.colorRampLink = 'epanet';
	s.colorClassesLink = 5;
	ok('...for that group alone', L.colorForValue('link', 5, breaks) === ramp[0]);
	s.colorReverseNode = false;
	s.colorClassesNode = 7;
	s.colorClassesLink = 7;
}

// ---- 4. the range allocation modes ------------------------------------------------------------
console.log('== modes ==');
{
	fresh('us');
	const s = L.getSettings();
	s.colorNodeField = 'pressure';
	s.colorLinkField = 'velocity';
	ok('a field with no mode chosen is on equal interval', L.colorModeOf('link', 'velocity') === 'equal');
	// n classes want exactly n-1 breaks, at every count and in every algorithmic mode -- a mode
	// that answered with fewer would index past the end of the colour array.
	['equal', 'quantile', 'jenks', 'stddev', 'pretty', 'log'].forEach(function (mode) {
		s.colorModes['link.velocity'] = mode;
		let allRight = true;
		for (let n = R.MIN_CLASSES; n <= R.MAX_CLASSES; n++) {
			s.colorClassesLink = n;
			const b = L.computedBreaks('link', 'velocity');
			if (b.length !== n - 1 || !b.every(v => isFinite(v))) { allRight = false; }
		}
		ok('mode "' + mode + '" answers with count-1 finite breaks at every count', allRight);
	});
	s.colorClassesLink = 7;
	// **THE CRITERION MODE IS NAMED FOR THE QUANTITY AND IS OFFERED ONLY ON IT.** A mode called
	// Pressure offered while colouring velocity is an invitation to a wrong map.
	ok('Pressure is offered while colouring pressure',
		R.modesFor('pressure').some(m => m.key === 'pressure'));
	ok('...and not while colouring velocity',
		!R.modesFor('velocity').some(m => m.key === 'pressure'));
	s.colorModes['node.pressure'] = 'pressure';
	ok('a criterion mode DICTATES the class count, whatever the count picker last said',
		L.colorClassCount('node') === R.criterionClasses('pressure') && L.colorClassCount('node') === 5,
		L.colorClassCount('node'));
	// **AND IT DICTATES IT FOR ITS OWN GROUP ONLY.** Before the schemes split, a pressure criterion
	// chosen for the nodes silently redrew the LINK map in five classes too.
	ok('...and leaves the other group at the count its own picker says',
		L.colorClassCount('link') === 7, L.colorClassCount('link'));
	ok('...and its breaks are the four thresholds, not an algorithm\'s answer',
		L.computedBreaks('node', 'pressure').length === 4);
	// STORED IN SI, CONVERTED AT THE BOUNDARY: 20 psi is the first threshold under the US preset.
	const us = L.computedBreaks('node', 'pressure');
	ok('under psi the first threshold reads as 20', Math.abs(us[0] - 20) < 0.01, us.join(','));
	fresh('si');
	const s2 = L.getSettings();
	s2.colorNodeField = 'pressure';
	s2.colorModes['node.pressure'] = 'pressure';
	const si = L.computedBreaks('node', 'pressure');
	ok('under metres of water the SAME criterion reads as 14.06', Math.abs(si[0] - 14.0614) < 0.01, si.join(','));
	ok('so a criterion is a fact about the water, not about the preset it was typed under',
		Math.abs(us[0] - si[0]) > 1);
}

// ---- 5. painting the map ---------------------------------------------------------------------
console.log('== painting ==');
{
	fresh('us');
	const s = L.getSettings(), doc = L.getDoc();
	const junction = doc.nodes.find(n => n.type === 'junction');
	const reservoir = doc.nodes.find(n => n.type === 'reservoir');
	const pipe = doc.links.find(l => l.type === 'pipe');
	const pump = doc.links.find(l => l.type === 'pump');
	ok('the example network solved', doc.nodes.length > 2 && doc.links.length > 2);

	ok('colouring is OFF by default -- the map is a drawing until asked otherwise',
		L.nodeFill(junction.id) === '' && L.linkStroke(pipe.id) === '');

	s.colorNodeField = 'pressure';
	s.colorLinkField = 'velocity';
	L.refreshValueColors();
	ok('a junction takes a fill once nodes are coloured', /^#/.test(L.nodeFill(junction.id)), L.nodeFill(junction.id));
	ok('a pipe takes a stroke once links are coloured', /^#/.test(L.linkStroke(pipe.id)), L.linkStroke(pipe.id));
	// A reservoir's circle is invisible by CSS (it is only the hit target), so a fill on it would
	// paint nothing and the reservoir would stay black while every junction changed.
	ok('a reservoir is coloured through its SYMBOL, never the invisible circle',
		L.nodeFill(reservoir.id) === '' && /^#/.test(L.nodeSymbolColor(reservoir.id) || ''),
		L.nodeFill(reservoir.id) + ' / ' + L.nodeSymbolColor(reservoir.id));
	// A pump has no velocity. Painting it would be a claim about a quantity it does not have.
	if (pump) {
		ok('a pump is left uncoloured when links are coloured by velocity', L.linkStroke(pump.id) === '',
			L.linkStroke(pump.id));
	}

	// The highest-pressure junction must not be painted the same colour as the lowest. This is the
	// assertion that fails if the breaks are computed from the wrong pool, or from SI values while
	// the elements are compared in display units.
	const press = doc.nodes.filter(n => n.type === 'junction')
		.map(n => ({ id: n.id, v: L.colorNodeValue(n, 'pressure') }))
		.filter(p => typeof p.v === 'number');
	press.sort((a, b) => a.v - b.v);
	ok('the solve produced a real spread of junction pressures',
		press.length >= 2 && press[press.length - 1].v - press[0].v > 1e-6,
		press.map(p => p.v.toFixed(2)).join(','));
	// QUANTILE, not the default equal interval, and the difference is the point. This ring main's
	// reservoir sits at zero gauge pressure while every junction is bunched near the top of the
	// range, so equal interval really does put all five junctions in one class -- which is not a
	// defect, it is exactly the skew the other modes exist for.
	// **THROUGH fillFromMethod(), which is what the method picker calls.** Since Task 448 the
	// limits are STATIC: writing the mode setting alone changes nothing, because the numbers
	// already in the boxes are the ones that are drawn. Choosing a method is what refills them.
	s.colorModes['node.pressure'] = 'quantile';
	L.fillFromMethod('node', 'pressure');
	L.refreshValueColors();
	ok('with quantile, lowest and highest pressure are different colours',
		L.nodeFill(press[0].id) !== L.nodeFill(press[press.length - 1].id),
		L.nodeFill(press[0].id) + ' vs ' + L.nodeFill(press[press.length - 1].id));
	delete s.colorModes['node.pressure'];

	// Turning it off must restore the stylesheet's black EXACTLY -- an empty inline style, not a
	// hardcoded '#000' that would then ignore any future CSS or dark-mode change.
	s.colorNodeField = '';
	s.colorLinkField = '';
	L.refreshValueColors();
	ok('turning colouring off clears the inline style rather than writing black',
		L.nodeFill(junction.id) === '' && L.linkStroke(pipe.id) === '' && L.nodeSymbolColor(reservoir.id) === '');
}

// ---- 6. IDEMPOTENCE -------------------------------------------------------------------------
// The cheapest strong assertion for anything that paints (dev/testing-notes.md): painting twice
// must equal painting once, to the character.
console.log('== idempotence ==');
{
	fresh('us');
	const s = L.getSettings(), doc = L.getDoc();
	s.colorNodeField = 'head';
	s.colorLinkField = 'flow';
	L.refreshValueColors();
	const snap = () => doc.nodes.map(n => L.nodeFill(n.id) + '|' + L.nodeSymbolColor(n.id))
		.concat(doc.links.map(l => L.linkStroke(l.id))).join(',');
	const once = snap();
	L.refreshValueColors();
	L.refreshValueColors();
	ok('painting three times equals painting once', snap() === once);
	// And re-solving the same network must not move a colour either -- the breaks are a function of
	// the values, and the values are a function of the network.
	L.runSolve();
	ok('re-solving the same network repaints identically', snap() === once);
}

// ---- 7. PINNED BREAKS ARE ABSOLUTE, AND ARE IN THE DISPLAYED UNIT ----------------------------
// EPANET's answer, and the one Task 248 needs: a break is a fixed number per variable, so the same
// colour means the same thing at every timestep and on every network. The mode's own answer is our
// addition and must yield to a pinned value the moment one exists.
console.log('== pinned breaks ==');
{
	fresh('us');
	const s = L.getSettings(), doc = L.getDoc();
	s.colorNodeField = 'pressure';
	s.colorClassesNode = 5;
	// The first read fills the boxes from the method, tidied to the 3 significant figures the
	// legend prints -- the number in the box and the number in the key are then the same number.
	ok('with the boxes empty the limits are the method\'s own answer, tidied',
		L.effectiveBreaks('node', 'pressure').join(',') === L.computedBreaks('node', 'pressure')
			.map(v => Math.abs(v) >= 1000 ? Math.round(v) : +v.toPrecision(3)).join(','),
		L.effectiveBreaks('node', 'pressure').join(','));
	s.colorBreaks['node.pressure'] = [10, 20, 30, 40];
	ok('what is in the boxes is what is drawn', L.effectiveBreaks('node', 'pressure').join(',') === '10,20,30,40');
	// **WHAT THE USER TYPED IS NEVER REPAIRED.** A set that is not ascending is not sorted into
	// shape -- it is refused, by the same rule the .inp importer follows.
	s.colorBreaks['node.pressure'] = [40, 10, 30, 20];
	ok('an out-of-order set is refused, not silently sorted',
		L.storedBreaks('node', 'pressure').length === 0,
		L.storedBreaks('node', 'pressure').join(','));
	ok('...and validateBreaks names the box that is wrong',
		R.validateBreaks([40, 10, 30, 20], 5).reason === 'not-increasing' &&
		R.validateBreaks([40, 10, 30, 20], 5).index === 1);
	// A set pinned at one class count is not thrown away when the count moves; it is ignored while
	// it does not fit and comes back when it does.
	s.colorBreaks['node.pressure'] = [10, 20, 30, 40];
	s.colorClassesNode = 7;
	ok('a four-limit set is ignored under seven classes', L.storedBreaks('node', 'pressure').length === 0);
	s.colorClassesNode = 5;
	ok('...and comes straight back at five', L.storedBreaks('node', 'pressure').join(',') === '10,20,30,40');

	// THE UNIT CLAIM. A break the user typed is a number in the DISPLAYED unit, exactly like every
	// other number this page stores (switching units reinterprets rather than converts). So the
	// same pressures read under psi and under metres of water must land in DIFFERENT classes
	// against the same typed break -- if they did not, the break would be being compared against SI
	// and the whole legend would be wrong under one preset while looking perfectly reasonable.
	const pinned = [10, 20, 30, 40];
	s.colorBreaks['node.pressure'] = pinned.slice();
	L.refreshValueColors();
	const usBands = doc.nodes.filter(n => n.type === 'junction').map(n => L.nodeFill(n.id));
	L.refreshValueColors();
	const usAfter = doc.nodes.filter(n => n.type === 'junction').map(n => L.nodeFill(n.id));
	const usPress = doc.nodes.filter(n => n.type === 'junction').map(n => L.colorNodeValue(n, 'pressure'));

	fresh('si');
	const s2 = L.getSettings(), doc2 = L.getDoc();
	s2.colorNodeField = 'pressure';
	s2.colorClassesNode = 5;
	s2.colorBreaks['node.pressure'] = pinned.slice();
	L.refreshValueColors();
	const siPress = doc2.nodes.filter(n => n.type === 'junction').map(n => L.colorNodeValue(n, 'pressure'));
	ok('the same network reports different pressure NUMBERS under psi and under m of water',
		usPress.length === siPress.length && usPress.some((v, i) => Math.abs(v - siPress[i]) > 1e-6),
		usPress.map(v => v && v.toFixed(2)).join(',') + ' vs ' + siPress.map(v => v && v.toFixed(2)).join(','));
	const siBands = doc2.nodes.filter(n => n.type === 'junction').map(n => L.nodeFill(n.id));
	ok('so the SAME typed break puts them in different classes (the break is a display-unit number)',
		usAfter.join(',') !== siBands.join(','), usAfter.join(',') + ' vs ' + siBands.join(','));
	ok('painting was stable across the two reads under one preset', usBands.join(',') === usAfter.join(','));
}

// ---- 8. the thematic mode (Task 327) ---------------------------------------------------------
console.log('== thematic mode ==');
{
	fresh('us');
	const s = L.getSettings();
	ok('thematic is OFF by default -- it is a mode, never the state a user is handed',
		!s.colorThematic && !L.svgClasses().contains('lpn-thematic'));
	s.colorThematic = true;
	L.refreshValueColors();
	ok('turning it on marks the svg', L.svgClasses().contains('lpn-thematic'));
	s.colorThematic = false;
	L.refreshValueColors();
	ok('turning it off unmarks it', !L.svgClasses().contains('lpn-thematic'));
	// THE POINT OF DOING IT WITH A CLASS. The mode must not have written anything into the user's
	// own label choices, or turning it off could not give them back.
	fresh('us');
	const before = L.labelSettingsJson();
	s.colorThematic = true; L.refreshValueColors();
	const during = L.labelSettingsJson();
	s.colorThematic = false; L.refreshValueColors();
	ok('the mode never edits the user\'s label choices while it is ON', during === before);
	ok('so turning it off gives back exactly the labels that were there',
		L.labelSettingsJson() === before && !L.svgClasses().contains('lpn-thematic'));
}

// ---- 9. the colour key -----------------------------------------------------------------------
console.log('== colour key ==');
{
	fresh('us');
	const s = L.getSettings();
	s.colorNodeField = '';
	s.colorLinkField = '';
	L.refreshValueColors();
	ok('no key while nothing is coloured', L.legendBox().style.display === 'none',
		L.legendBox().style.display);
	s.colorLinkField = 'velocity';
	s.colorClassesLink = 5;
	s.colorBreaks['link.velocity'] = [1, 2, 3, 4];
	L.refreshValueColors();
	const box = L.legendBox();
	ok('the key appears once a field is chosen', box.style.display !== 'none');
	const txt = allText(box);
	ok('the key names the field in the language the labels use', /Velocity/i.test(txt), txt);
	// Read out of the live unit select, never spelled out here: the option TEXT is what the browser
	// shows ("ft/s") and what the stub shows ("ftps"), and a hardcoded string would be testing one
	// of those two rather than the coupling.
	const velUnit = unitSelects.lpn_u_velocity.options[unitSelects.lpn_u_velocity.selectedIndex].textContent;
	ok('the key carries the unit the numbers are in', txt.indexOf('(' + velUnit + ')') >= 0, txt);
	ok('the key shows one row per class, and a heading', (box.children || []).length >= 5,
		(box.children || []).length);
	// **THE KEY FOLLOWS THE CLASS COUNT.** Seven classes and a five-row key would be the same lie
	// as a seven-box swatch over a five-class map, told at the other end.
	s.colorClassesLink = 7;
	delete s.colorBreaks['link.velocity'];
	L.refreshValueColors();
	ok('raising the count to seven gives seven rows', (allText(L.legendBox()).match(/–|≥|</g) || []).length >= 7,
		(box.children || []).length);
	ok('the key reads high band first', allText(L.legendBox()).indexOf('≥') < allText(L.legendBox()).indexOf('<'));
	// **AND IT SAYS NOTHING ABOUT WHERE THE NUMBERS CAME FROM.** It used to carry an "Automatic"
	// note warning that they move with the network; since Task 448 they do not move at all, so the
	// note would be the one untrue thing on the key.
	ok('the key claims nothing about the numbers being automatic',
		!/Automatic/i.test(allText(L.legendBox())), allText(L.legendBox()));
}

// ---- 10. the picker itself ---------------------------------------------------------------------
//
// **THE PICKER IS THE POINT OF TASKS 427 AND 429**, and everything Tom rejected about the old one
// is asserted here: no names on screen, a picture per row, dozens of rows, a count picker, five
// modes plus the criterion one, and the licence acknowledgement wherever the ramps are chosen.
console.log('== the ramp picker ==');
{
	fresh('us');
	const s = L.getSettings();
	s.colorNodeField = 'pressure';
	s.colorLinkField = 'velocity';
	let threw = null;
	try { L.buildColoringSection(); } catch (e) { threw = e; }
	ok('the coloring controls render without throwing', threw === null, threw && threw.stack);

	// **ONE PICKER PER SYMBOLOGY GROUP, INSIDE THAT GROUP.** Nothing about a colour scheme is left
	// in the shared block: what stands there is what is true of the whole sheet.
	const shared = walk(byId.lpn_set_colors_shared);
	const nodeBlock = walk(byId.lpn_set_colors_node), linkBlock = walk(byId.lpn_set_colors_link);
	const btn = nodeBlock.filter(e => e.id === 'lpn_set_ramp_node')[0];
	const pop = nodeBlock.filter(e => e.id === 'lpn_set_ramp_list_node')[0];
	ok('the link group has a picker of its own',
		!!linkBlock.filter(e => e.id === 'lpn_set_ramp_link')[0] &&
		!!linkBlock.filter(e => e.id === 'lpn_set_ramp_list_link')[0]);
	ok('...and no picker is left in the shared block',
		shared.filter(e => /^lpn_set_ramp(_list)?_(node|link)$/.test(e.id || '')).length === 0);
	ok('the closed picker is a BUTTON, not a select', !!btn && btn.tagName === 'BUTTON', btn && btn.tagName);
	ok('...showing the current ramp as a bar of swatches',
		!!btn && walk(btn).filter(e => e.className === 'lpn-color-swatch').length === L.colorClassCount('node'),
		btn && walk(btn).filter(e => e.className === 'lpn-color-swatch').length);
	ok('...and carrying the scheme\'s name as its ACCESSIBLE name, not on screen',
		!!btn && /Viridis/.test(btn.getAttribute('aria-label') || '') && !/Viridis/.test(allText(btn)),
		btn && btn.getAttribute('aria-label'));
	ok('the open state is a listbox', !!pop && pop.getAttribute('role') === 'listbox');
	ok('...that starts closed', !!pop && pop.style.display === 'none');

	const rows = walk(pop).filter(e => e.getAttribute && e.getAttribute('role') === 'option');
	ok('every ramp in the catalogue has a row -- dozens of them, as Tom expected',
		rows.length === R.rampKeys().length, rows.length);
	ok('every row is a PICTURE and carries no name on screen',
		rows.every(r => allText(r) === '' && walk(r).filter(e => e.className === 'lpn-color-swatch').length >= 3));
	ok('...with the name in aria-label, where a screen reader finds it',
		rows.every(r => (r.getAttribute('aria-label') || '').length > 0));
	ok('every row shows the CURRENT class count, not always seven',
		rows.every(r => walk(r).filter(e => e.className === 'lpn-color-swatch').length === L.colorClassCount('node')));
	ok('exactly one row is marked selected',
		rows.filter(r => r.getAttribute('aria-selected') === 'true').length === 1);
	ok('...and it is the ramp in use',
		rows.filter(r => r.getAttribute('aria-selected') === 'true')[0].getAttribute('data-ramp') === s.colorRampNode);
	ok('every row is keyboard-reachable', rows.every(r => r.getAttribute('tabindex') !== null));

	// **CLAUSES 4 AND 5: NOTHING IS NAMED AFTER THE SOURCE.** The heading is a family name in
	// Brewer's own vocabulary; the word "ColorBrewer" appears in no control anywhere.
	const heads = walk(pop).filter(e => e.className === 'lpn-ramp-fam');
	ok('the rows are grouped under family headings', heads.length === L.rampGroups().length, heads.length);
	const headText = heads.map(h => allText(h)).join(' | ');
	ok('the standard vocabulary, not epanet-js\'s "Continuous"', /sequential/i.test(headText) && !/continuous/i.test(headText), headText);
	ok('diverging and qualitative beside it', /diverging/i.test(headText) && /qualitative/i.test(headText), headText);
	// **EACH HEADING CARRIES AN ABBREVIATED EXAMPLE**, because which family to use is a property of
	// the data and nothing else in the picker says so.
	ok('each family heading carries an example',
		heads.every(h => /\(.+\)/.test(allText(h))), headText);
	ok('and the diverging heading\'s example is pressure', /diverging/i.test(headText) &&
		heads.some(h => /diverging/i.test(allText(h)) && /pressure/i.test(allText(h))), headText);
	ok('the rainbow heading is last and says what it is for',
		/EPANET/i.test(allText(heads[heads.length - 1])), allText(heads[heads.length - 1]));

	// THE COUNT PICKER, which is per group for the same reason the ramp is.
	const cnt = nodeBlock.filter(e => e.id === 'lpn_set_ramp_classes_node')[0];
	ok('there is a class-count picker offering 3 to 7', !!cnt && cnt.children.length === 5,
		cnt && cnt.children.length);
	ok('...and it is not disabled while every mode is algorithmic', !!cnt && !cnt.disabled);

	// THE ACKNOWLEDGEMENT, VERBATIM. Apache-2.0 clause 2 fixes the wording; this asserts the exact
	// sentence out of the module rather than a retyped copy, which is the only way a paraphrase
	// gets caught.
	// **A FOOTER, NOT A ROW OF Map appearance** (Tom, 2026-08-19: the full credits were "a bit long
	// for this place"). It is rendered into the box's own footer node, below every section, so the
	// assertion is that it is on the page and NOT inside the shared colour host it used to sit in.
	const credit = byId.lpn_set_ramp_credits;
	ok('the acknowledgement is rendered in the box that offers the ramps', !!credit);
	ok('...as the box\'s footer, not as a row inside Map appearance',
		shared.every(e => e.id !== 'lpn_set_ramp_credits'));
	ok('...verbatim, exactly as the licence fixes it',
		!!credit && allText(credit).indexOf(R.CREDITS[0].text) >= 0, credit && allText(credit));
	ok('...and every source is credited', !!credit &&
		R.CREDITS.every(c => allText(credit).indexOf(c.text) >= 0));
	// Clauses 4 and 5 again, over the whole rendered section this time.
	const everything = allText(byId.lpn_set_colors_shared) + ' ' +
		allText(byId.lpn_set_colors_node) + ' ' + allText(byId.lpn_set_colors_link) + ' ' +
		walk(byId.lpn_set_colors_shared).map(e => (e.getAttribute && e.getAttribute('aria-label')) || '').join(' ');
	ok('no control, heading or name says "ColorBrewer"',
		everything.replace(R.CREDITS[0].text, '').indexOf('ColorBrewer') < 0);

	// THE RANGES: a mode picker and count-1 editable limits, under the sub-heading of the element
	// they colour.
	const nodeSide = nodeBlock;
	const modeSel = nodeSide.filter(e => e.id === 'lpn_set_color_mode_node')[0];
	ok('the node ranges carry a mode picker', !!modeSel);
	ok('...offering the algorithmic modes AND the one named Pressure',
		!!modeSel && modeSel.children.length === R.modesFor('pressure').length &&
		modeSel.children.some(o => o.value === 'pressure'),
		modeSel && modeSel.children.map(o => o.value).join(','));
	const boxes = nodeSide.filter(e => e.type === 'number');
	ok('...and one editable limit fewer than there are classes',
		boxes.length === L.colorClassCount('node') - 1, boxes.length + ' for ' + L.colorClassCount('node'));
	ok('the limits arrive filled in, not blank -- the mode has already answered',
		boxes.every(b => b.value !== '' && isFinite(+b.value)), boxes.map(b => b.value).join(','));
	// The link side offers one mode fewer, because Pressure is not a mode for velocity.
	const linkModeSel = walk(byId.lpn_set_colors_link).filter(e => e.id === 'lpn_set_color_mode_link')[0];
	ok('the link ranges do not offer a mode named for pressure',
		!!linkModeSel && !linkModeSel.children.some(o => o.value === 'pressure'),
		linkModeSel && linkModeSel.children.map(o => o.value).join(','));

	// THE COUNT PICKER GOES GREY UNDER A CRITERION MODE, because four thresholds are five classes
	// and the picture must not offer to disagree with them.
	s.colorModes['node.pressure'] = 'pressure';
	L.buildColoringSection();
	const cnt2 = walk(byId.lpn_set_colors_node).filter(e => e.id === 'lpn_set_ramp_classes_node')[0];
	ok('a criterion mode disables the count picker', !!cnt2 && cnt2.disabled === true);
	ok('...and the picker draws five boxes, the count that mode dictates',
		walk(walk(byId.lpn_set_colors_node).filter(e => e.id === 'lpn_set_ramp_node')[0])
			.filter(e => e.className === 'lpn-color-swatch').length === 5);
	// ...and the LINK picker is untouched by a criterion chosen for the nodes.
	const cnt3 = walk(byId.lpn_set_colors_link).filter(e => e.id === 'lpn_set_ramp_classes_link')[0];
	ok('...while the link count picker stays live and stays at seven',
		!!cnt3 && cnt3.disabled === false &&
		walk(walk(byId.lpn_set_colors_link).filter(e => e.id === 'lpn_set_ramp_link')[0])
			.filter(e => e.className === 'lpn-color-swatch').length === 7);
	delete s.colorModes['node.pressure'];
}

// ---- 11. OPENING A PROJECT WRITTEN BEFORE THE SCHEMES SPLIT -----------------------------------
//
// **NOTHING MAY CHANGE COLOUR.** The ramp, the class count and the reverse flag were one each for
// the whole map; a document saved then carries `colorRamp`, `colorClasses`, `colorReverse` and
// neither per-group key. Both groups take the value the file states, so the map is redrawn exactly
// as it was saved -- and the legacy keys are dropped afterwards, so nothing can later read a stale
// one and disagree with what is on screen.
console.log('== opening an older project ==');
{
	fresh('us');
	const s = L.getSettings(), doc = L.getDoc();
	s.colorNodeField = 'pressure';
	s.colorLinkField = 'velocity';
	s.colorRampNode = 'ylgnbu';
	s.colorRampLink = 'ylgnbu';
	s.colorClassesNode = 5;
	s.colorClassesLink = 5;
	s.colorReverseNode = true;
	s.colorReverseLink = true;
	L.refreshValueColors();
	const painted = doc.nodes.map(n => L.nodeFill(n.id) + '|' + L.nodeSymbolColor(n.id))
		.concat(doc.links.map(l => L.linkStroke(l.id))).join(',');

	// The file an older build would have written: one of each, no per-group key anywhere.
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	['colorRampNode', 'colorRampLink', 'colorClassesNode', 'colorClassesLink',
		'colorReverseNode', 'colorReverseLink'].forEach(k => { delete saved.settings[k]; });
	saved.settings.colorRamp = 'ylgnbu';
	saved.settings.colorClasses = 5;
	saved.settings.colorReverse = true;

	L.applySaved(saved);
	const s2 = L.getSettings();
	ok('the one stored ramp becomes both groups\' ramp',
		s2.colorRampNode === 'ylgnbu' && s2.colorRampLink === 'ylgnbu');
	ok('...and the one stored class count becomes both counts',
		s2.colorClassesNode === 5 && s2.colorClassesLink === 5);
	ok('...and the one stored reverse flag becomes both flags',
		s2.colorReverseNode === true && s2.colorReverseLink === true);
	ok('the legacy keys are dropped rather than left to drift',
		s2.colorRamp === undefined && s2.colorClasses === undefined && s2.colorReverse === undefined);
	L.runSolve();
	L.refreshValueColors();
	ok('so the map opens on exactly the colours it was saved in',
		L.getDoc().nodes.map(n => L.nodeFill(n.id) + '|' + L.nodeSymbolColor(n.id))
			.concat(L.getDoc().links.map(l => L.linkStroke(l.id))).join(',') === painted);

	// A project saved before the class count existed AT ALL was drawn in five bands, and its pinned
	// breaks are four numbers. That rule survives the split, once per group.
	const older = JSON.parse(JSON.stringify(saved));
	delete older.settings.colorClasses;
	L.applySaved(older);
	const s3 = L.getSettings();
	ok('a document from before the count existed still opens at the five bands it was drawn in',
		s3.colorClassesNode === 5 && s3.colorClassesLink === 5);
}

// ---- 12. THE LIMITS ARE STATIC, AND A METHOD FILLS THEM (Task 448) ---------------------------
//
// Tom, 2026-08-19, having rejected the first build of this: *"When I look at EPANET... I see one set
// of breaks, and it's manual. But you can push a button to fill them using a method. Using that
// method doesn't create any new setting... The project doesn't care where it came from other than
// 'I found it in the input box; I don't know how it got there.'"* So there is ONE field, the
// numbers in it are static, and the two things that write it are a method and the user's fingers.
//
// **THE ASSERTIONS THAT MATTER ARE MUTATION TESTS, NOT EQUALITIES.** "The limits did not move" is
// vacuous unless the values under them did, so every step below also asserts that computedBreaks()
// -- the live answer we are refusing to use -- DID move. Without that pair, a harness passes on a
// network whose second time step happens to look like its first.
console.log('== the limits are static, and a method fills them ==');
{
	fresh('us');
	const s = L.getSettings(), doc = L.getDoc();
	s.colorNodeField = 'pressure';
	s.colorLinkField = 'velocity';
	// A second "time step": every demand tripled and the network solved again. Extended-period
	// simulation is Task 248, so this is what a later step will do to the numbers -- press harder on
	// the same network and read the same fields.
	// **THROUGH setProp(), the one write seam** -- a direct `n._demand =` would edit BASE from
	// inside a scenario, which is the defect dev/scripts/scenario_seam_check.php exists for.
	function nextStep(factor) {
		doc.nodes.forEach(function (n) {
			var q = L.effective(n, 'demand');
			if (typeof q === 'number' && q) { L.setProp(n, 'demand', q * factor); }
		});
		L.runSolve();
		L.refreshValueColors();
	}

	const first = L.effectiveBreaks('node', 'pressure').join(',');
	ok('the first read fills the ONE field of limits -- there is no second field',
		(s.colorBreaks['node.pressure'] || []).join(',') === first &&
		s.colorFrozenBreaks === undefined, first);
	ok('...and what it wrote is the method\'s own answer, tidied to what the legend prints',
		first === L.computedBreaks('node', 'pressure').map(v =>
			Math.abs(v) >= 1000 ? Math.round(v) : +v.toPrecision(3)).join(','), first);
	ok('...and it did NOT stamp a mode: filling in is not a setting',
		s.colorModes['node.pressure'] === undefined);

	const liveBefore = L.computedBreaks('node', 'pressure').join(',');
	const linkFirst = L.effectiveBreaks('link', 'velocity').join(',');
	nextStep(3);
	ok('the values really did move, so the next assertion is not vacuous',
		L.computedBreaks('node', 'pressure').join(',') !== liveBefore,
		L.computedBreaks('node', 'pressure').join(','));
	ok('two time steps of one run give the SAME node limits',
		L.effectiveBreaks('node', 'pressure').join(',') === first,
		L.effectiveBreaks('node', 'pressure').join(','));
	ok('...and the SAME link limits',
		L.effectiveBreaks('link', 'velocity').join(',') === linkFirst,
		L.effectiveBreaks('link', 'velocity').join(','));
	// A third step, because limits that survive one solve and not two survive nothing an animation
	// would do to them.
	nextStep(1 / 6);
	ok('...and a third step, in the other direction, still gives the same limits',
		L.effectiveBreaks('node', 'pressure').join(',') === first &&
		L.effectiveBreaks('link', 'velocity').join(',') === linkFirst);

	// CHOOSING A METHOD FILLS THE BOXES. Through the real control, because the dropdown's change
	// handler is where the fill lives and a harness calling fillFromMethod() directly would be
	// asserting about a function nothing reaches.
	L.buildColoringSection();
	const modeSel = walk(byId.lpn_set_colors_node).filter(e => e.id === 'lpn_set_color_mode_node')[0];
	ok('the method picker is on screen to be chosen from', !!modeSel);
	modeSel.value = 'quantile';
	fire(modeSel, 'change');
	const refilled = (s.colorBreaks['node.pressure'] || []).join(',');
	ok('choosing a method writes its answer for the state the map is in NOW, into the one field',
		refilled === L.effectiveBreaks('node', 'pressure').join(',') && refilled !== first, refilled);
	const liveAfter = L.computedBreaks('node', 'pressure').join(',');
	nextStep(4);
	ok('...the state moved again',
		L.computedBreaks('node', 'pressure').join(',') !== liveAfter);
	ok('...and the numbers the method wrote stay put, like any other numbers in the boxes',
		L.effectiveBreaks('node', 'pressure').join(',') === refilled);

	// TYPING A LIMIT SETS THE METHOD TO MANUAL. Tom's missing piece, and the reason `manual` exists
	// at all: after an edit the selector must say what the numbers now are.
	L.buildColoringSection();
	const nodeBoxes = walk(byId.lpn_set_colors_node).filter(e => e.type === 'number');
	nodeBoxes.forEach(function (b, i) { b.value = String(10 + i * 10); });
	fire(nodeBoxes[0], 'change');
	ok('typing a limit stores exactly what was typed',
		(s.colorBreaks['node.pressure'] || []).join(',') ===
			nodeBoxes.map((b, i) => String(10 + i * 10)).join(','),
		(s.colorBreaks['node.pressure'] || []).join(','));
	ok('...and the method selector goes to Manual, because that is what it is now',
		L.colorModeOf('node', 'pressure') === R.MANUAL_MODE, L.colorModeOf('node', 'pressure'));
	// MUTATION TEST ON THE FLIP: a set REFUSED must not flip it, or "Manual" would mean "somebody
	// touched a box" rather than "these are the numbers".
	s.colorModes['node.pressure'] = 'quantile';
	L.buildColoringSection();
	const badBoxes = walk(byId.lpn_set_colors_node).filter(e => e.type === 'number');
	badBoxes.forEach(function (b, i) { b.value = String(100 - i); });
	fire(badBoxes[0], 'change');
	ok('a REFUSED set leaves the method alone -- Manual names the numbers, not the gesture',
		L.colorModeOf('node', 'pressure') === 'quantile', L.colorModeOf('node', 'pressure'));

	// MANUAL IS SHOWN BUT CANNOT BE CHOSEN.
	s.colorModes['node.pressure'] = R.MANUAL_MODE;
	L.buildColoringSection();
	const manSel = walk(byId.lpn_set_colors_node).filter(e => e.id === 'lpn_set_color_mode_node')[0];
	const manOpt = (manSel.children || []).filter(o => o.value === R.MANUAL_MODE);
	ok('a field on Manual says so in the picker', manOpt.length === 1 && manOpt[0].selected === true,
		(manSel.children || []).map(o => o.value).join(','));
	ok('...and that option cannot be chosen', manOpt[0].disabled === true);
	ok('...while a field on a real method is offered no Manual to choose', (function () {
		s.colorModes['link.velocity'] = 'equal';
		L.buildColoringSection();
		const lk = walk(byId.lpn_set_colors_link).filter(e => e.id === 'lpn_set_color_mode_link')[0];
		return (lk.children || []).every(o => o.value !== R.MANUAL_MODE);
	})());

	// AUTOMATIC FILLS THEM FROM THE METHOD AGAIN, and a field on Manual has no method to ask, so it
	// moves to equal interval rather than leaving the picker naming a source that did not answer.
	L.buildColoringSection();
	const autoBtn = walk(byId.lpn_set_colors_node)
		.filter(e => e.tagName === 'BUTTON' && /Automatic/i.test(allText(e)))[0];
	ok('the Automatic button is there to fill them again', !!autoBtn);
	const typed = (s.colorBreaks['node.pressure'] || []).join(',');
	fire(autoBtn, 'click');
	ok('Automatic replaces the typed numbers with the method\'s answer',
		(s.colorBreaks['node.pressure'] || []).length > 0 &&
		(s.colorBreaks['node.pressure'] || []).join(',') !== typed,
		(s.colorBreaks['node.pressure'] || []).join(','));
	ok('...and a field that was on Manual now names the method that answered',
		L.colorModeOf('node', 'pressure') === 'equal', L.colorModeOf('node', 'pressure'));
	ok('...and what is stored is what is drawn',
		L.effectiveBreaks('node', 'pressure').join(',') === (s.colorBreaks['node.pressure'] || []).join(','));

	// A CRITERION METHOD IS NEVER STORED: its thresholds come from a design standard in SI and are
	// converted on every read, so a stored copy would be a psi number in a project opened in kPa.
	s.colorModes['node.pressure'] = 'pressure';
	delete s.colorBreaks['node.pressure'];
	const crit = L.effectiveBreaks('node', 'pressure').join(',');
	ok('a criterion method answers from the standard, and writes nothing',
		crit === L.computedBreaks('node', 'pressure').join(',') &&
		s.colorBreaks['node.pressure'] === undefined, crit);
	nextStep(2);
	ok('...and it does not move with the map either -- it never did',
		L.effectiveBreaks('node', 'pressure').join(',') === crit &&
		s.colorBreaks['node.pressure'] === undefined);
	// MUTATION TEST ON THE UNIT CLAIM: the same criterion under the other preset must give
	// different display numbers, or "never stored" would be a distinction without a difference.
	const critUs = L.computedBreaks('node', 'pressure').join(',');
	fresh('si');
	L.getSettings().colorNodeField = 'pressure';
	L.getSettings().colorModes['node.pressure'] = 'pressure';
	ok('...which matters, because the same criterion is different NUMBERS in another unit',
		L.computedBreaks('node', 'pressure').join(',') !== critUs,
		critUs + ' vs ' + L.computedBreaks('node', 'pressure').join(','));
}

// ---- 13. NOTHING IS WRITTEN UNTIL THERE IS A RANGE, AND AN OLD PROJECT KEEPS ITS NUMBERS -------
console.log('== filling in, and the projects that came before ==');
{
	fresh('us');
	const s = L.getSettings(), doc = L.getDoc();
	s.colorNodeField = 'pressure';
	s.colorLinkField = 'velocity';
	L.refreshValueColors();
	const painted = doc.nodes.map(n => L.nodeFill(n.id) + '|' + L.nodeSymbolColor(n.id))
		.concat(doc.links.map(l => L.linkStroke(l.id))).join(',');
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));

	// **A PROJECT SAVED UNDER THE REJECTED TWO-FIELD DESIGN.** Its numbers were in
	// colorFrozenBreaks, which no longer exists; they are the numbers it was drawn in, so they move
	// into colorBreaks rather than being dropped, and the map opens exactly as it was saved.
	const old448 = JSON.parse(JSON.stringify(saved));
	const wasFrozen = old448.settings.colorBreaks['node.pressure'].slice();
	delete old448.settings.colorBreaks['node.pressure'];
	old448.settings.colorFrozenBreaks = { 'node.pressure': { mode: 'equal', breaks: wasFrozen } };
	L.applySaved(old448);
	const sOld = L.getSettings();
	ok('a project saved under the rejected design keeps its limits, in the one field',
		(sOld.colorBreaks['node.pressure'] || []).join(',') === wasFrozen.join(','),
		(sOld.colorBreaks['node.pressure'] || []).join(','));
	ok('...and the field it kept them in is GONE, so nothing can read a stale copy',
		sOld.colorFrozenBreaks === undefined);
	L.runSolve();
	L.refreshValueColors();
	ok('...so the map opens on exactly the colours it was saved in',
		L.getDoc().nodes.map(n => L.nodeFill(n.id) + '|' + L.nodeSymbolColor(n.id))
			.concat(L.getDoc().links.map(l => L.linkStroke(l.id))).join(',') === painted);
	// The typed set wins if the project carries both -- it is the field the user was looking at.
	const both = JSON.parse(JSON.stringify(saved));
	both.settings.colorBreaks['node.pressure'] = [1, 2, 3, 4, 5, 6];
	both.settings.colorFrozenBreaks = { 'node.pressure': { mode: 'equal', breaks: wasFrozen } };
	L.applySaved(both);
	ok('...and where a project carries both, the one in the boxes wins',
		L.getSettings().colorBreaks['node.pressure'].join(',') === '1,2,3,4,5,6');

	// A PROJECT SAVED BEFORE ANY OF THIS carries no limits at all and must open unchanged: the
	// first render fills in the very numbers the old build would have recomputed.
	const older = JSON.parse(JSON.stringify(saved));
	older.settings.colorBreaks = {};
	L.applySaved(older);
	L.runSolve();
	L.refreshValueColors();
	ok('a project saved before the limits were stored opens on the colours it was saved in',
		L.getDoc().nodes.map(n => L.nodeFill(n.id) + '|' + L.nodeSymbolColor(n.id))
			.concat(L.getDoc().links.map(l => L.linkStroke(l.id))).join(',') === painted);
	ok('...and the first render is what filled them in',
		(L.getSettings().colorBreaks['node.pressure'] || []).length > 0);

	// NOTHING IS WRITTEN BEFORE THERE IS A RANGE TO CLASSIFY. degenerateSpan() answers 0..1 when
	// there are no values, and a project that stored that placeholder would carry a legend with no
	// relation to the network for the rest of its life.
	// An EMPTY document is the one thing that clears the last solve, and it must be cleared: a
	// stale result keyed by the same node ids would answer for a network that has not been solved.
	L.reset();
	L.runSolve();
	L.drawExample();
	const s3 = L.getSettings();
	s3.colorNodeField = 'pressure';
	L.effectiveBreaks('node', 'pressure');
	ok('an unsolved map stores nothing', (s3.colorBreaks || {})['node.pressure'] === undefined);
	ok('...though it still draws a legend, from the placeholder it did not keep',
		L.effectiveBreaks('node', 'pressure').length > 0);
	L.runSolve();
	const afterSolve = L.effectiveBreaks('node', 'pressure');
	ok('...and the first solve is what writes them',
		(s3.colorBreaks['node.pressure'] || []).join(',') === afterSolve.join(',') &&
		afterSolve.length > 0);
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILURE(S)');
process.exit(fails === 0 ? 0 : 1);
