// Harness for COLOUR BY VALUE (ROADMAP Task 384) and the THEMATIC map (Task 327) -- run with:
//   node dev/lpn-spike/color-ramp-harness.js
//
// WHY THIS EXISTS. Every claim colouring makes is invisible to the eye that is checking it: a map
// full of colour looks equally plausible whether the breaks are right, whether the ramp is being
// sampled from both ends, and whether a pump with no velocity got the bottom colour or none at all.
// The three defects worth naming, all of which look fine in a browser:
//   * an UNDEFINED value taking the bottom colour, which asserts "low" about a quantity that does
//     not exist on that element (a pump has no velocity);
//   * fewer than four breaks sampling the ramp's FIRST n stops instead of spreading over it, which
//     silently drops the top of the ramp so a high value stops reading as high;
//   * a break value being treated as SI while the user typed it in the displayed unit -- the same
//     class of defect as every other unit bug on this page, and equally invisible under one preset.
//
// The network is the shipped ring main, solved for real: the assertions below are about the
// solver's own pressures and velocities, not about numbers this file made up.

const { ROOT, mkEl, byId, ensure, unitSelects, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tdrawExample: drawExampleNetwork, runSolve: runSolve,\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\trefreshValueColors: refreshValueColors,\n" +
	"\t\trebuildSettingsFields: rebuildSettingsFields,\n" +
	"\t\tequalIntervalBreaks: equalIntervalBreaks, equalCountBreaks: equalCountBreaks,\n" +
	"\t\teffectiveBreaks: effectiveBreaks, bandColor: bandColor, colorForValue: colorForValue,\n" +
	"\t\tcolorNodeValue: colorNodeValue, colorLinkValue: colorLinkValue,\n" +
	"\t\tcolorValues: colorValues, COLOR_RAMPS: COLOR_RAMPS, COLOR_BANDS: COLOR_BANDS,\n" +
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

// ---- 1. pure break arithmetic -------------------------------------------------------------
console.log('== break rules ==');
{
	const B = L.COLOR_BANDS;                       // 5 bands -> 4 breaks
	const ei = L.equalIntervalBreaks([0, 100]);
	ok('equal intervals yields COLOR_BANDS-1 breaks', ei.length === B - 1, ei.length);
	ok('equal intervals are evenly spaced over the range',
		ei.join(',') === [20, 40, 60, 80].join(','), ei.join(','));
	ok('equal intervals on a constant field gives no breaks (one band, not five)',
		L.equalIntervalBreaks([7, 7, 7]).length === 0);
	ok('equal intervals on a single value gives no breaks', L.equalIntervalBreaks([7]).length === 0);
	// EQUAL COUNTS IS THE ONE THAT MUST DIFFER FROM EQUAL INTERVALS ON SKEW. A field with one
	// outlier is exactly the case a water engineer reaches for it: equal intervals put every
	// ordinary pipe in the bottom band, and if the two agreed here the button would be decoration.
	const skew = [1, 1, 1, 1, 1, 1, 1, 1, 1, 100];
	const q = L.equalCountBreaks(skew), e = L.equalIntervalBreaks(skew);
	ok('equal counts differs from equal intervals on a skewed field', q.join(',') !== e.join(','),
		q.join(',') + ' vs ' + e.join(','));
	ok('equal counts stays inside the observed range',
		q.every(v => v >= 1 && v <= 100), q.join(','));
	ok('breaks come back ascending', q.every((v, i) => i === 0 || v >= q[i - 1]), q.join(','));
}

// ---- 2. banding and ramp sampling -----------------------------------------------------------
console.log('== bands and ramp ==');
{
	fresh('us');
	const s = L.getSettings();
	s.colorRamp = 'epanet';
	s.colorReverse = false;
	const ramp = L.COLOR_RAMPS.epanet;
	const breaks = [10, 20, 30, 40];
	ok('below the first break takes the bottom colour', L.colorForValue(5, breaks) === ramp[0]);
	ok('at a break takes the band ABOVE it (>= is the upper band)',
		L.colorForValue(10, breaks) === ramp[1], L.colorForValue(10, breaks));
	ok('above the last break takes the top colour', L.colorForValue(1e6, breaks) === ramp[4]);
	// The undefined rule, which is the one a browser cannot show you.
	ok('an undefined value gets NO colour, not the bottom one', L.colorForValue(undefined, breaks) === '');
	ok('NaN gets no colour', L.colorForValue(NaN, breaks) === '');
	// FEWER BREAKS MUST STILL SPAN THE RAMP. Taking the first n stops would leave a "high" value
	// painted mid-ramp, which reads as ordinary.
	ok('two bands use both ENDS of the ramp',
		L.bandColor(0, 2) === ramp[0] && L.bandColor(1, 2) === ramp[ramp.length - 1],
		L.bandColor(0, 2) + '/' + L.bandColor(1, 2));
	ok('three bands use both ends and the middle',
		L.bandColor(0, 3) === ramp[0] && L.bandColor(1, 3) === ramp[2] && L.bandColor(2, 3) === ramp[4]);
	s.colorReverse = true;
	ok('reversing swaps the ends', L.colorForValue(5, breaks) === ramp[4] && L.colorForValue(1e6, breaks) === ramp[0]);
	s.colorReverse = false;
}

// ---- 3. painting the map ---------------------------------------------------------------------
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
	// assertion that fails if the automatic breaks are computed from the wrong pool, or from SI
	// values while the elements are compared in display units.
	const press = doc.nodes.filter(n => n.type === 'junction')
		.map(n => ({ id: n.id, v: L.colorNodeValue(n, 'pressure') }))
		.filter(p => typeof p.v === 'number');
	press.sort((a, b) => a.v - b.v);
	ok('the solve produced a real spread of junction pressures',
		press.length >= 2 && press[press.length - 1].v - press[0].v > 1e-6,
		press.map(p => p.v.toFixed(2)).join(','));
	// EQUAL COUNTS, not the automatic equal intervals, and the difference is the point. This ring
	// main's reservoir sits at zero gauge pressure while every junction is bunched near the top of
	// the range, so equal intervals really does put all five junctions in one band -- which is not
	// a defect, it is exactly the skew EPANET's second button exists for. Asserting on equal
	// intervals here would have been asserting that the arithmetic is wrong.
	s.colorBreaks['node.pressure'] = L.equalCountBreaks(L.colorValues('node', 'pressure'));
	L.refreshValueColors();
	ok('with equal counts, lowest and highest pressure are different colours',
		L.nodeFill(press[0].id) !== L.nodeFill(press[press.length - 1].id),
		L.nodeFill(press[0].id) + ' vs ' + L.nodeFill(press[press.length - 1].id));
	delete s.colorBreaks['node.pressure'];

	// Turning it off must restore the stylesheet's black EXACTLY -- an empty inline style, not a
	// hardcoded '#000' that would then ignore any future CSS or dark-mode change.
	s.colorNodeField = '';
	s.colorLinkField = '';
	L.refreshValueColors();
	ok('turning colouring off clears the inline style rather than writing black',
		L.nodeFill(junction.id) === '' && L.linkStroke(pipe.id) === '' && L.nodeSymbolColor(reservoir.id) === '');
}

// ---- 4. IDEMPOTENCE -------------------------------------------------------------------------
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
	// And re-solving the same network must not move a colour either -- the automatic breaks are a
	// function of the values, and the values are a function of the network.
	L.runSolve();
	ok('re-solving the same network repaints identically', snap() === once);
}

// ---- 5. PINNED BREAKS ARE ABSOLUTE, AND ARE IN THE DISPLAYED UNIT ----------------------------
// EPANET's answer, and the one Task 248 needs: a break is a fixed number per variable, so the same
// colour means the same thing at every timestep and on every network. Automatic is our own
// addition and must yield to a pinned value the moment one exists.
console.log('== pinned breaks ==');
{
	fresh('us');
	const s = L.getSettings(), doc = L.getDoc();
	s.colorNodeField = 'pressure';
	ok('with nothing pinned the breaks are automatic (derived from the values)',
		L.effectiveBreaks('node', 'pressure').join(',') ===
		L.equalIntervalBreaks(L.colorValues('node', 'pressure')).join(','));
	s.colorBreaks['node.pressure'] = [10, 20, 30, 40];
	ok('a pinned set wins over automatic', L.effectiveBreaks('node', 'pressure').join(',') === '10,20,30,40');
	// Blanks allowed, ascending enforced -- EPANET's own dialog rules.
	s.colorBreaks['node.pressure'] = ['', 40, '', 10];
	ok('blanks are dropped and the rest sorted', L.effectiveBreaks('node', 'pressure').join(',') === '10,40');
	s.colorBreaks['node.pressure'] = [];
	ok('an empty pinned list falls back to automatic',
		L.effectiveBreaks('node', 'pressure').length === L.equalIntervalBreaks(L.colorValues('node', 'pressure')).length);

	// THE UNIT CLAIM. A break the user typed is a number in the DISPLAYED unit, exactly like every
	// other number this page stores (switching units reinterprets rather than converts). So the
	// same pressures read under psi and under metres of water must land in DIFFERENT bands against
	// the same typed break -- if they did not, the break would be being compared against SI and the
	// whole legend would be wrong under one preset while looking perfectly reasonable.
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
	s2.colorBreaks['node.pressure'] = pinned.slice();
	L.refreshValueColors();
	const siPress = doc2.nodes.filter(n => n.type === 'junction').map(n => L.colorNodeValue(n, 'pressure'));
	ok('the same network reports different pressure NUMBERS under psi and under m of water',
		usPress.length === siPress.length && usPress.some((v, i) => Math.abs(v - siPress[i]) > 1e-6),
		usPress.map(v => v && v.toFixed(2)).join(',') + ' vs ' + siPress.map(v => v && v.toFixed(2)).join(','));
	const siBands = doc2.nodes.filter(n => n.type === 'junction').map(n => L.nodeFill(n.id));
	ok('so the SAME typed break puts them in different bands (the break is a display-unit number)',
		usAfter.join(',') !== siBands.join(','), usAfter.join(',') + ' vs ' + siBands.join(','));
	ok('painting was stable across the two reads under one preset', usBands.join(',') === usAfter.join(','));
}

// ---- 6. the thematic mode (Task 327) ---------------------------------------------------------
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

// ---- 7. the colour key -----------------------------------------------------------------------
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
	ok('the key shows five bands for four breaks',
		(box.children || []).length >= L.COLOR_BANDS, (box.children || []).length);
	ok('the key reads high band first', txt.indexOf('≥') < txt.indexOf('<'), txt);
	// AUTOMATIC MUST SAY SO. A legend of absolute-looking numbers that quietly move with the
	// network is the one thing a reviewer must not be misled by.
	delete s.colorBreaks['link.velocity'];
	L.refreshValueColors();
	ok('an automatic key says it is automatic', /Automatic/i.test(allText(L.legendBox())));
}

// ---- 8. the settings section builds ------------------------------------------------------------
console.log('== settings section ==');
{
	fresh('us');
	const s = L.getSettings();
	s.sectionsOpen.colors = true;
	s.colorNodeField = 'pressure';
	s.colorLinkField = 'velocity';
	let threw = null;
	try { L.rebuildSettingsFields(); } catch (e) { threw = e; }
	ok('the Color by value section renders without throwing', threw === null, threw && threw.message);
	const panel = byId.lpn_settings_fields;
	const t = allText(panel);
	ok('it offers the ramp choices', /EPANET/.test(t), t.slice(0, 200));
	ok('it offers both auto-assign buttons', /Equal intervals/.test(t) && /Equal counts/.test(t));
	// Asserted through the LANGUAGE KEY, not the English words. Wave 0 renamed this heading from
	// "Break values" to "Color band limits" (2026-08-17) and a literal match turned red for a
	// deliberate wording change -- which is a test measuring the wrong thing: what matters is that
	// the break editor is rendered, not what it happens to be called this month.
	ok('it offers the break editor for a chosen field',
		t.indexOf(global.EngCalcs.pageConfig.lpn_settings_color_breaks) >= 0,
		global.EngCalcs.pageConfig.lpn_settings_color_breaks);
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILURE(S)');
process.exit(fails === 0 ? 0 : 1);
