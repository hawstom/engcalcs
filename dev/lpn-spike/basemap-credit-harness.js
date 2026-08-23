// THE TILE ATTRIBUTION IS ON SCREEN WHENEVER A TILE IS -- ROADMAP Task 145. Run with:
//   node dev/lpn-spike/basemap-credit-harness.js
//
// WHY THIS EXISTS. Tom, 2026-08-23, looking at a saved geographic project on a PC with
// OpenStreetMap tiles drawn behind it: *"we also have no map attribution on the map."* He was
// right, and it is a LICENCE condition rather than a cosmetic one: OSM's tile usage policy and
// Mapbox's terms both require the credit for as long as their tiles are displayed.
//
// THE DEFECT WAS A FUNCTION NOT BEING CALLED, which is precisely the shape dev/testing-notes.md
// says an assertion about a call cannot catch. The credit was refreshed by refreshBasemapChrome(),
// which had three callers -- the style setter, the georeference finish, and
// refreshAllFromDocument() -- and the BOOT path goes through none of them. Boot applies the saved
// project, draws the network, and then noteMapSized() schedules refreshBasemap() ALONE, because
// tiles are the one thing that needs a viewport before it can be drawn. So reopening a saved
// geographic project painted tiles with the credit still at the inline display:none it ships with.
//
// So this file asserts ONE PROPERTY, everywhere, over the real code:
//
//     whenever a tile element exists, the credit is displayed, and the set it shows names the
//     source whose tiles are on screen.
//
// It is checked after a BOOT-LIKE sequence first, because that is the path that broke, and then
// after every other way the tiles can change. A fourth call site would satisfy a "was it called"
// test and still leave the fifth path to be discovered by a user; the credit now hangs off the
// painter itself, and the source check at the end is what holds it there.

const fs = require('fs');
const path = require('path');
const { byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const ROOT = path.resolve(__dirname, '..', '..') + path.sep;

const L = loadLoopedNetwork(
	// The layers init() builds, in init()'s own order -- the basemap below the user's backdrop.
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', { 'class': 'lpn-basemap' }, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	// The boot sequence's own two steps, plus the one that runs when the canvas finally has a size.
	"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetView: function (v) { applyView(v); }, geoHome: geoHomeView,\n" +
	"\t\tlayer: function () { return basemapLayer; },\n" +
	"\t\tsetStyle: setBasemapStyle, setBasemapOn: setBasemapOn,\n" +
	"\t\tteaserPress: toggleBasemapTeaser,\n" +
	"\t\tstyle: basemapStyle, basemapOn: basemapOn, isGeo: isGeoProject,\n" +
	"\t\tsatAvailable: satelliteAvailable,\n" +
	"\t\trefreshAll: refreshAllFromDocument,\n" +
	"\t\tgetProject: function () { return project; }, serialize: serializeProject "
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
byId.lpn_toolbar.querySelectorAll = () => [];

const credit = byId.lpn_basemap_credit;
function creditShown() { return credit.style.display !== 'none' && credit.style.display !== undefined; }
function setsShown() {
	return credit.children.filter(c => c.style.display !== 'none')
		.map(c => c.getAttribute('data-basemap-credit'));
}
function tileHosts() {
	return L.layer().children.map(e => String(e.href || '').replace(/^https:\/\/([^/]*)\/.*/, '$1'));
}
// THE ONE PROPERTY, asked of whatever state the page is in right now. Every section below calls it.
function invariant(where) {
	const hosts = tileHosts(), n = hosts.length;
	const sets = setsShown();
	if (n === 0) {
		ok(where + ': no tiles, so no credit is required', !creditShown() || sets.length === 0,
			'display=' + credit.style.display + ' sets=' + sets.join(','));
		return;
	}
	ok(where + ': ' + n + ' tiles are on screen, so the credit is DISPLAYED', creditShown(),
		'display=' + credit.style.display);
	ok(where + ': ...and exactly one source set is shown', sets.length === 1, sets.join(','));
	// It must name the source whose tiles are actually being fetched, not merely SOME source: the
	// two sets carry different wording because Mapbox's terms name its imagery supplier as well.
	const expect = hosts.every(h => h === 'tile.openstreetmap.org') ? 'osm'
		: (hosts.every(h => h === 'api.mapbox.com') ? 'satellite' : '(mixed)');
	ok(where + ': ...and it is the set for the tiles being fetched, ' + expect,
		sets[0] === expect, 'showing ' + sets.join(',') + ' for ' + hosts[0]);
}

// ---- 0. what the page ships ----------------------------------------------------------------------
console.log('\n--- the markup: hidden until the code shows it, and one set per source ---');
{
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	const at = php.indexOf('id="lpn_basemap_credit"');
	const div = php.slice(at, php.indexOf('</div>', at));
	ok('the credit element exists on the page', at > 0);
	// This is the fact that made the defect possible and is worth naming: the element is inert
	// until JS shows it, so "the markup is there" is not evidence of anything.
	ok('...and it ships display:none, so only the code can put it on screen',
		/style="display:none/.test(div));
	ok('...and it is NOT d-print-none: the tiles print, so the credit prints',
		div.indexOf('d-print-none') < 0);
	const sets = [...div.matchAll(/data-basemap-credit="([a-z]+)"/g)].map(m => m[1]);
	ok('...and carries one credit set per tile source', sets.join(',') === 'osm,satellite',
		sets.join(','));
	ok('...naming OpenStreetMap for the street tiles', /openstreetmap\.org\/copyright/.test(div));
	ok('...and Mapbox and its imagery supplier for the satellite ones',
		/mapbox\.com/.test(div) && /maxar\.com/.test(div));

	// ---- MAPBOX'S ATTRIBUTION IS A LICENCE TERM, AND IT HAS FOUR PARTS (ROADMAP Task 489) --------
	// Their attribution page requires the WORDMARK as well as the text, and names the three text
	// links by exact label and exact URL. Checked here against the satellite set only; the street
	// set is OpenStreetMap's and is unaffected.
	const sat = div.slice(div.indexOf('data-basemap-credit="satellite"'));
	ok('the satellite set carries the Mapbox WORDMARK, which is required and not optional',
		/class="lpn-mapbox-logo"/.test(sat));
	ok('...linked, and labelled for a screen reader', /aria-label="Mapbox"/.test(sat));
	ok('...and "Improve this map" -> apps.mapbox.com/feedback/, part of their required text',
		/href="https:\/\/apps\.mapbox\.com\/feedback\/"[^>]*>Improve this map</.test(sat));
	ok('...and "© Mapbox" -> mapbox.com/about/maps, the URL they specify',
		/href="https:\/\/www\.mapbox\.com\/about\/maps\/?"[^>]*>© Mapbox</.test(sat));
	ok('...and "© OpenStreetMap" -> openstreetmap.org/copyright, likewise',
		/href="https:\/\/www\.openstreetmap\.org\/copyright"[^>]*>© OpenStreetMap</.test(sat));

	// **THE MARK IS DRAWN HERE, NOT FETCHED.** This is the half that is easy to regress: pasting
	// Mapbox's own <img src="https://api.mapbox.com/..."> satisfies every assertion above and makes
	// the page call Mapbox on load, which is exactly what #lpn_basemap_teaser exists to avoid.
	ok('the wordmark is not an image fetched from anywhere', !/<img/i.test(sat));
	const css = fs.readFileSync(ROOT + 'css/engcalcs.css', 'utf8');
	const rule = css.slice(css.indexOf('.lpn-mapbox-logo {'),
		css.indexOf('}', css.indexOf('.lpn-mapbox-logo {')));
	ok('...it is a CSS rule with an embedded data: URI', /background-image:\s*url\("data:image\/svg/.test(rule),
		rule.length + ' chars');
	ok('...and that rule names no host at all', !/https?:\/\/(?!www\.w3\.org)/.test(rule));
	// Nothing anywhere on the page may name a Mapbox HOST outside a link href or the tile URL the
	// JS builds only once satellite is asked for.
	const fetchable = [...php.matchAll(/(?:src|srcset)="([^"]*mapbox[^"]*)"/gi)].map(m => m[1]);
	ok('no element on the page FETCHES anything from Mapbox', fetchable.length === 0,
		fetchable.join(' '));
}

// ---- 1. THE BOOT PATH, which is the one that broke ------------------------------------------------
// Not openProject(), not the View menu: the sequence init() runs when a saved geographic project is
// already open. applySaved() then buildDom(), and the canvas gets its height LATER -- which is why
// noteMapSized() is a separate step here, exactly as applyMapHeight() makes it one in the browser.
global.EngCalcs.pageConfig.lpn_mapbox_token = 'pk.harness.token';
L.buildLayers();
L.setCanvas(1000, 500);
const NET3W = JSON.parse(fs.readFileSync(
	ROOT + 'dev/water-network-examples/Net3-World-lpn.json', 'utf8'));

async function main() {
	console.log('\n--- a saved geographic project, opened the way a page load opens one ---');
	L.applySaved(JSON.parse(JSON.stringify(NET3W)));
	L.buildDom();
	ok('Net3-World is geographic and asks for street tiles',
		L.isGeo() && L.getProject().basemap === 'osm');
	ok('...and nothing has drawn a tile yet, because the canvas has no size',
		L.layer().children.length === 0);
	invariant('before the canvas is sized');

	// The canvas gets its height. THIS IS THE WHOLE BOOT PATH: noteMapSized() schedules the basemap
	// refresh and calls nothing else, so anything the credit needed from another entry point is
	// exactly what was missing on screen.
	L.setView(L.geoHome());
	L.noteMapSized();
	await new Promise((r) => setTimeout(r, 200));   // the 120 ms debounce inside scheduleBasemapRefresh()
	ok('the boot path drew tiles', L.layer().children.length > 0,
		L.layer().children.length + ' <image> elements');
	invariant('on the boot path');
	// TASK 489'S OTHER HALF, AT RUNTIME: a page that has not been asked for satellite has sent
	// Mapbox nothing. The wordmark is embedded, so showing the credit chrome cannot call them
	// either -- only asking for the style can.
	ok('...and nothing has been fetched from Mapbox, since satellite was never asked for',
		tileHosts().every(h => h.indexOf('mapbox') < 0), tileHosts().join(','));
	// **THE SATELLITE TEASER IS THE SAME STORY** (Task 452, Tom: *"there is no current way to turn
	// my geomap view into a satellite view"*). It rides the same chrome refresh, so a boot that
	// forgot the credit forgot the corner control too. Bottom-left, a cell of the status strip --
	// which is also where Google Maps, the page Tom compared us to, puts its own basemap thumbnail.
	ok('...and the satellite teaser is offered, since this browser has a Mapbox token',
		L.satAvailable() && byId.lpn_basemap_teaser.style.display !== 'none',
		'display=' + byId.lpn_basemap_teaser.style.display + ' title=' + byId.lpn_basemap_teaser.title);
	ok('...labelled with the command it performs',
		/satellite/i.test(byId.lpn_basemap_teaser.title || ''), byId.lpn_basemap_teaser.title);

	// **THE TEASER SWAPS; IT NEVER TURNS THE TILES OFF.** The View rows toggle off when asked for
	// the style already showing, which is right for a row that reads "Hide satellite images". The
	// corner tile inherited that and it was wrong: Tom pressed it twice and the basemap vanished --
	// "I get satellite, but now I lost map. No more map. Satellite has attribution, Map has
	// nothing." Pressing it any number of times must leave a basemap on screen.
	L.teaserPress();
	ok('one press on the teaser shows satellite', L.basemapOn() && L.style() === 'satellite',
		'on=' + L.basemapOn() + ' style=' + L.style());
	invariant('after one press on the teaser');
	L.teaserPress();
	ok('a second press returns the STREET map rather than nothing',
		L.basemapOn() && L.style() === 'osm', 'on=' + L.basemapOn() + ' style=' + L.style());
	invariant('after a second press on the teaser');
	L.teaserPress(); L.teaserPress(); L.teaserPress();
	ok('and no number of presses can leave the map bare', L.basemapOn(),
		'on=' + L.basemapOn() + ' style=' + L.style());
	// Hand section 2 the state it starts from. The presses above end on satellite, and the next
	// block's first assertion is that ASKING for satellite fetches Mapbox tiles -- which the OFF
	// toggle would defeat. Reset explicitly rather than by counting presses.
	L.setStyle('osm');

	// ---- 2. the other ways the tiles change ---------------------------------------------------------
	console.log('\n--- and every other route to a tile carries the credit with it ---');
	L.setStyle('satellite');
	ok('the satellite style fetches Mapbox tiles',
		tileHosts().length > 0 && tileHosts().every(h => h === 'api.mapbox.com'), tileHosts()[0]);
	invariant('after switching to satellite');

	L.setStyle('satellite');   // the same style again is the OFF toggle
	ok('asking for the style already showing turns the basemap off', !L.basemapOn());
	invariant('with the basemap off');

	L.setStyle('osm');
	invariant('after switching back to the street map');

	// Opening a different project: refreshAllFromDocument()'s route.
	L.refreshAll();
	invariant('after a project-wide repaint');

	// A GRID PROJECT HAS NO TILES AND MUST HAVE NO CREDIT -- crediting OpenStreetMap on a drawing
	// with no OpenStreetMap data on it is its own kind of wrong.
	const grid = JSON.parse(JSON.stringify(NET3W));
	delete grid.project.coords;
	delete grid.project.basemap;
	L.applySaved(grid);
	L.refreshAll();
	ok('a grid project draws no tiles', L.layer().children.length === 0);
	invariant('on a grid project');

	// ---- 3. the structural half: the credit cannot be separated from the painter ------------------
	// Behaviour above is the test; this is what stops the next person re-creating the defect by
	// adding a sixth path that paints tiles. The credit refreshes inside the ONE function that
	// paints them, so there is no call site left to forget.
	console.log('\n--- the credit hangs off the painter, so no caller can forget it ---');
	{
		const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
		const code = src.split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n');
		const chromeCalls = (code.match(/refreshBasemapChrome\(\)/g) || []).length;
		// One definition, one call. If this rises, the seam has been re-opened.
		ok('refreshBasemapChrome() is defined once and called once',
			(code.match(/function refreshBasemapChrome/g) || []).length === 1 && chromeCalls === 2,
			chromeCalls + ' occurrences including the definition');
		const body = code.slice(code.indexOf('function refreshBasemap()'));
		ok('...and its one caller is refreshBasemap(), the function that paints the tiles',
			/function refreshBasemap\(\)\s*\{[^}]*refreshBasemapChrome\(\)/.test(body));
		ok('...which is still the only place tile <image> elements are made',
			(code.match(/'class': 'lpn-basemap-tile'/g) || []).length === 1);
	}

	console.log(fails === 0 ? '\nAll basemap-credit checks passed.' : '\n' + fails + ' FAILED');
	process.exit(fails ? 1 : 0);
}

main();
