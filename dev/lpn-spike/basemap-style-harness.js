// BASEMAP FILTER -- ROADMAP Task 617. Run with:
//   node dev/lpn-spike/basemap-style-harness.js
//
// WHY THIS EXISTS. The Settings > Map row "Basemap filter" tones the street or satellite tiles with
// a CSS filter. Four ways it can be wrong without anything throwing: the style lands on the whole
// canvas (greying the network and its labels), it is not saved so a reopened project forgets it, an
// old file without the field opens in something other than Normal, or a preset (invert, hue-rotate)
// quietly makes the credit or the drawing unreadable. The row is driven through its real <select>
// and its real change event; the style is read off the canvas as the CSS variable the tile layer's
// rule consumes, and the rules themselves are read from css/engcalcs.css.

const fs = require('fs');
const stub = require('./lpn-dom-stub.js');
const { ROOT, loadLoopedNetwork, setUnitSet } = stub;

let fails = 0;
function ok(label, cond, detail) {
	if (!cond) { fails++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}
setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', { 'class': 'lpn-basemap' }, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetView: function (v) { return applyView(v); }, geoHome: geoHomeView,\n" +
	"\t\trebuildSettings: function () { rebuildSettingsBox(); },\n" +
	"\t\tsettings: function () { return settings; }, serialize: serializeProject,\n" +
	"\t\tstyles: function () { return LPN_BASEMAP_STYLES; }"
);
L.buildLayers();
L.setCanvas(1000, 500);
const NET3W = () => JSON.parse(fs.readFileSync(
	ROOT + 'dev/water-network-examples/Net3-Novato-CA-World.lwn', 'utf8'));

function fire(el, type) { (el._listeners[type] || []).forEach(f => f({ preventDefault() {} })); }
function find(id) {
	let hit = null;
	(function walk(e) {
		if (!e || hit) { return; }
		if (e.id === id) { hit = e; return; }
		(e.children || []).forEach(walk);
	})(stub.byId.lpn_set_map_fields);
	return hit;
}
const canvasFilter = () => stub.byId.lpn_canvas.style.getPropertyValue
	? stub.byId.lpn_canvas.style.getPropertyValue('--lpn-basemap-style')
	: stub.byId.lpn_canvas.style['--lpn-basemap-style'];
function open(saved) { L.applySaved(saved); L.buildDom(); L.setView(L.geoHome()); L.noteMapSized(); L.rebuildSettings(); }

console.log('\n--- the presets ---');
const F = L.styles();
ok('four presets: normal, muted, faded, grayscale', Object.keys(F).join() === 'normal,muted,faded,grayscale', Object.keys(F).join());
ok('Normal is no filter at all', F.normal === 'none');
ok('no preset inverts or rotates hue', Object.values(F).every(v => !/invert|hue-rotate/.test(v)));
ok('every preset is plain filter functions, no colour literal', Object.values(F).every(v => v === 'none' || /^(\w+\([\d.]+%?\)\s?)+$/.test(v)));

console.log('\n--- a pre-release file with basemapFilter keeps its choice ---');
{
	const pre = NET3W();
	delete pre.settings.basemapStyle; pre.settings.basemapFilter = 'faded';
	open(pre);
	ok('basemapFilter field read as fallback', canvasFilter() === F.faded, String(canvasFilter()));
}

console.log('\n--- an old project opens Normal ---');
{
	const old = NET3W();
	delete old.settings.basemapStyle; delete old.settings.basemapFilter;
	open(old);
	ok('old file: setting reads normal', L.settings().basemapStyle === 'normal', String(L.settings().basemapStyle));
	ok('...and the canvas carries no filter', canvasFilter() === 'none', String(canvasFilter()));
	const sel = find('lpn_set_basemap_style');
	ok('the select is in Settings > Map', !!sel);
	ok('...showing Normal', sel && sel.children.filter(o => o.selected).map(o => o.value).join() === 'normal');
	ok('...with four options', sel && sel.children.length === 4);
}

console.log('\n--- choosing a preset, through the real control ---');
{
	const sel = find('lpn_set_basemap_style');
	sel.value = 'muted'; fire(sel, 'change');
	ok('Muted is stored on settings', L.settings().basemapStyle === 'muted');
	ok('...and lands on the canvas as the tile-layer variable', canvasFilter() === F.muted, String(canvasFilter()));
	sel.value = 'grayscale'; fire(sel, 'change');
	ok('Grayscale replaces it', canvasFilter() === F.grayscale, String(canvasFilter()));
}

console.log('\n--- the style reaches the tile layer and nothing else ---');
{
	const css = fs.readFileSync(ROOT + 'css/engcalcs.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
	const rules = [...css.matchAll(/([^{}]+)\{([^{}]*--lpn-basemap-style[^{}]*)\}/g)];
	const consumers = rules.filter(r => /(^|[^-\w])filter\s*:\s*var\(--lpn-basemap-style/.test(r[2]));
	ok('exactly one rule consumes the variable', consumers.length === 1, consumers.map(r => r[1].trim()).join(' | '));
	ok('...and its selector is the tile layer, .lpn-basemap', consumers[0] && consumers[0][1].trim() === '.lpn-basemap');
	ok('...the canvas only DECLARES it (no filter on #lpn_canvas)',
		!/#lpn_canvas[^{]*\{[^}]*[^-\w]filter\s*:/.test(css));
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	const at = php.indexOf('id="lpn_basemap_credit"');
	ok('the credit is not inside the canvas, so a canvas variable never reaches it',
		at > 0 && !/lpn-basemap/.test(php.slice(at, php.indexOf('</div>', at))));
}

console.log('\n--- save, reopen, export ---');
{
	const out = JSON.parse(JSON.stringify(L.serialize()));
	ok('serializeProject carries the choice in settings', out.settings.basemapStyle === 'grayscale', String(out.settings.basemapStyle));
	open(out);
	ok('reopened: grayscale again', L.settings().basemapStyle === 'grayscale' && canvasFilter() === F.grayscale);
	const sel = find('lpn_set_basemap_style');
	ok('...and the select shows it', sel.children.filter(o => o.selected).map(o => o.value).join() === 'grayscale');
	const bad = JSON.parse(JSON.stringify(out)); bad.settings.basemapStyle = 'invert(1)';
	open(bad);
	ok('a hand-edited unknown value opens Normal, never an injected filter string', canvasFilter() === 'none', String(canvasFilter()));
	const src = fs.readFileSync(ROOT + 'js/lpn-inp.js', 'utf8');
	ok('.inp writer never mentions the style', !/basemapStyle|basemapFilter/.test(src));
}

console.log('\n--- R-342: a new project follows the one it was opened from ---');
{
	const js = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	const at = js.indexOf('var inheritedSettings = JSON.parse(JSON.stringify(settings))');
	const block = js.slice(at, js.indexOf('settings = inheritedSettings;', at));
	ok('newProject clones the whole of settings', at > 0);
	ok('...and deletes nothing about the basemap style', !/basemapStyle|basemapFilter/.test(block));
}
console.log(fails ? `\n${fails} FAILED` : '\nall passed');
process.exit(fails ? 1 : 0);
