// The examples gallery — manifest, thumbnails and wiring (ROADMAP Task 314).
//
//   node dev/lpn-spike/examples-gallery-harness.js
//
// Three things can be wrong here and only one of them is visible on screen:
//
//   * THE MANIFEST can name a file that is not served, or miss one that is. A gallery card that
//     404s looks exactly like a working card until it is clicked.
//   * THE THUMBNAIL can be UPSIDE DOWN. A v>=4 document is stored CARTESIAN and SVG is Y-down, so
//     drawing stored coordinates straight into an SVG flips every drawing vertically. On an
//     unfamiliar water network that looks entirely plausible — it is the one error here that would
//     survive somebody looking at it — so it is asserted against the app's own rule rather than by
//     eye. applySaved() flips a v>=4 file into Y-down memory; the generator must do the same.
//   * THE OPEN PATH can stop going through the upload path's own loader. That pair
//     (acceptImportedText + importProject) carries the version migration, the structural repair
//     and the storage-quota handling. A second loader would drift from it, and the drift would
//     show up as an old example failing to open long after anybody remembers why.
//
// Written 2026-08-14 with the gallery.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '../..');
const srcDir = path.join(root, 'dev/water-network-examples');
const outDir = path.join(root, 'examples');
const src = fs.readFileSync(path.join(root, 'js/looped-network.js'), 'utf8');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

console.log('\n-- the served library is generated, and current --');
{
	let out = '', code = 0;
	try {
		out = execFileSync('php', [path.join(root, 'dev/scripts/generate_examples.php'), '--check'],
			{ encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
	} catch (e) { code = e.status; out = (e.stdout || '') + (e.stderr || ''); }
	report(code === 0, 'generate_examples.php --check says FRESH', code === 0 ? out.trim() : out.trim());
}

const manifestPath = path.join(outDir, 'manifest.json');
report(fs.existsSync(manifestPath), 'the manifest exists');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const examples = manifest.examples || [];
report(examples.length > 0, 'the manifest lists examples', `${examples.length}`);

console.log('\n-- every card the gallery will draw resolves to a served file --');
examples.forEach(function (ex) {
	report(fs.existsSync(path.join(outDir, ex.file)), `${ex.file} is served`);
	if (ex.thumb) { report(fs.existsSync(path.join(outDir, ex.thumb)), `${ex.thumb} is served`); }
	report(!!ex.title, `${ex.file} has a title`);
	// A description is the thing that makes a wall of titles browsable, and it is the one field a
	// machine cannot derive — so it is the one that can silently be missing.
	report(!!ex.description, `${ex.file} has a description`);
	// And it must be REACHABLE BY TRANSLATORS. A card whose text lives only in the manifest is a
	// card that is permanently English on a page shipping in 27 languages — which is what the
	// first cut of this did.
	report(/^lpn_ex_\w+_title$/.test(ex.titleKey || ''), `${ex.file} names a title key`, ex.titleKey);
	report(/^lpn_ex_\w+_desc$/.test(ex.descKey || ''), `${ex.file} names a description key`, ex.descKey);
	report(ex.system === 'us' || ex.system === 'si', `${ex.file} declares a unit system`, ex.system);
	report(ex.nodes > 0 && ex.links > 0, `${ex.file} has a network in it`, `${ex.nodes}/${ex.links}`);
});

console.log('\n-- the served copy is byte-identical to the authored project --');
examples.forEach(function (ex) {
	const a = fs.readFileSync(path.join(srcDir, ex.file), 'utf8');
	const b = fs.readFileSync(path.join(outDir, ex.file), 'utf8');
	report(a === b, `${ex.file} is a faithful copy, not a re-serialisation`);
});

// ---- THE BACKDROP IS PART OF THE EXAMPLE, and it has been silently dropped once ----------------
// Tom put site plans behind Net2 and Net3, they shipped in commit b9baf53, and the very next commit
// regenerated the examples from a session that did not have them -- 1.7 MB and 2.5 MB of PNG gone,
// with nothing anywhere saying so. He noticed by opening the gallery: "Net2 and Net3 are still
// coming in without their images. I think you are reverting me." He was right.
//
// Nothing derives this list; it is a DECLARATION that these three examples are drawn over a plan and
// must arrive with it. An example that gains a backdrop adds itself here, which is the moment to
// think about the megabytes; one that loses it fails loudly instead of quietly looking plainer.
const WANT_BACKDROP = ['Net2-lpn.json', 'Net3-lpn.json', 'Elm-Street-Center-lpn.json'];
console.log('\n-- the examples drawn over a site plan still carry it --');
WANT_BACKDROP.forEach(function (file) {
	[srcDir, outDir].forEach(function (dir) {
		const where = dir === srcDir ? 'authored' : 'served';
		let d = null;
		try { d = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')); } catch (e) { /* reported below */ }
		const href = d && d.backdrop && d.backdrop.href;
		report(!!href && /^data:image\//.test(href),
			`${file} (${where}) still has its site plan`,
			href ? `${Math.round(href.length / 1024)} KB` : 'NO BACKDROP');
	});
});

console.log('\n-- the served copy carries the format marker (Task 315) --');
examples.forEach(function (ex) {
	const d = JSON.parse(fs.readFileSync(path.join(outDir, ex.file), 'utf8'));
	report(d.format === 'hawsedc-lpn', `${ex.file} says what it is from the inside`, d.format);
});

console.log('\n-- THE UPSIDE-DOWN TEST: a Cartesian document is flipped for SVG --');
{
	// The app's own rule, read out of the source rather than restated: applySaved() flips a
	// document at or above LPN_CARTESIAN_VERSION into Y-down memory. If the generator did not do
	// the same, every thumbnail of such a document is a correct drawing rendered upside down.
	const cv = Number((src.match(/var LPN_CARTESIAN_VERSION = (\d+);/) || [])[1]);
	report(Number.isFinite(cv), 'the app declares a Cartesian version', String(cv));
	let tested = 0;
	examples.forEach(function (ex) {
		if (!ex.thumb) { return; }
		const doc = JSON.parse(fs.readFileSync(path.join(outDir, ex.file), 'utf8'));
		if ((doc.v || 0) < cv) { return; }
		const svg = fs.readFileSync(path.join(outDir, ex.thumb), 'utf8');
		// Take a node with a distinctive stored Y and find its circle in the SVG. A flipped
		// generator would place it at +y; a correct one at -y.
		const n = doc.nodes.find(function (q) { return typeof q.y === 'number' && Math.abs(q.y) > 1e-6; });
		if (!n) { return; }
		tested++;
		const wantY = (-n.y).toFixed(3), wrongY = (n.y).toFixed(3);
		const hasRight = svg.indexOf(`cy="${wantY}"`) >= 0;
		const hasWrong = svg.indexOf(`cy="${wrongY}"`) >= 0;
		report(hasRight && !hasWrong, `${ex.thumb} is drawn Y-down, not mirrored`,
			hasRight ? '' : `expected cy="${wantY}"`);
	});
	report(tested > 0, 'at least one Cartesian example was actually checked', `${tested}`);
}

console.log('\n-- thumbnails are self-contained and theme-neutral --');
examples.forEach(function (ex) {
	if (!ex.thumb) { return; }
	const svg = fs.readFileSync(path.join(outDir, ex.thumb), 'utf8');
	report(svg.indexOf('<svg') === 0 && svg.indexOf('viewBox=') > 0, `${ex.thumb} is an SVG with a viewBox`);
	// currentColor is what lets one file read in both light and dark; a baked hex is invisible in
	// one of the two themes this suite has to render in.
	report(svg.indexOf('currentColor') > 0, `${ex.thumb} inks itself from currentColor`);
	// The xmlns declaration is a namespace URI, not a fetch — strip it before looking for real
	// external references, or every self-contained SVG fails this.
	const body = svg.replace(/xmlns(:\w+)?="[^"]*"/g, '');
	report(!/<image|xlink:href|url\(|https?:/.test(body), `${ex.thumb} embeds no external reference`);
	report(svg.length < 60000, `${ex.thumb} is small enough for a wall of them`, `${svg.length} B`);
});

console.log('\n-- wiring: opening an example reuses the upload path’s loader --');
{
	const fn = src.slice(src.indexOf('function openExample'));
	const body = fn.slice(0, fn.indexOf('\n\tfunction ', 10));
	report(/acceptImportedText\(text\)/.test(body), 'it parses through acceptImportedText');
	report(/importProject\(saved\)/.test(body), 'and lands through importProject');
	report(/stampProjectSaved\(id\)/.test(body),
		'the example arrives SAVED — it is not the user’s unsaved work');
	report(/fetch\('examples\/' \+ ex\.file/.test(body), 'it fetches the served copy');
	// "They were your copies because you downloaded and installed them" — an example must never be
	// a read-only view of a file on our server, and must never write back.
	report(!/writeOpenProjectToFile|stampFile\(/.test(body),
		'it never links the new project to a file on our server');
}

console.log('\n-- wiring: the gallery is reachable, dismissible, and under OPEN --');
{
	report(/label: pc\.lpn_examples_menu \|\| 'Open example…'/.test(src),
		'File > Open example… exists');
	const openIdx = src.indexOf("pc.lpn_file_open ||");
	const exIdx = src.indexOf("pc.lpn_examples_menu ||");
	const newIdx = src.indexOf("pc.lpn_file_new ||");
	report(exIdx > openIdx && openIdx > newIdx,
		'and it sits under Open, not under New — New creates, Open retrieves');
	// **ASKED ONCE, ANSWERED FOR GOOD (Task 431).** The wall shows on an empty canvas or on demand,
	// and the answer lives on `library` -- already stored, already saved by saveIndex() -- so a page
	// reload does not re-ask. A per-page flag and then a per-project one both failed here; a
	// per-project answer says yes to every new empty tab forever, which was Tom's second report.
	report(/galleryForced \|\| \(empty && !galleryDismissedHere\(\)\)/.test(src),
		'it shows on an empty canvas, or on demand');
	report(/function galleryDismissedHere\(\) \{ return !!library\.galleryDismissed; \}/.test(src),
		'the answer is stored with the library, so a reload does not re-ask');
	report(/library\.galleryDismissed = true;\n\s*saveIndex\(\);/.test(src),
		'...and it is persisted rather than only held in memory');
	// Seeing content IS the answer: anyone with a network on screen has answered by drawing it.
	report(/if \(!empty\) \{ dismissGalleryForGood\(\); \}/.test(src),
		'a canvas with a network on it answers the question by itself');
	// NO NEW STORAGE ITEM. The flag rides in the library object that is already written, so no
	// sentence in consent_body becomes false and nobody has to be re-asked (EC_CONSENT_VERSION).
	report(!/localStorage\.setItem\(\s*['"]lpn_gallery/.test(src),
		'and it adds no storage item of its own');
	report(/function hideExamplesGallery/.test(src), 'and there is a way out of it');
	// A card must be a real button: the whole card is the hit area, it reaches the keyboard for
	// free, and a screen reader announces it as activatable.
	report(/elh\('button', \{ type: 'button', 'class': 'lpn-example-card' \}\)/.test(src),
		'each card is a <button>, not a div with a click handler');
	// elh() and not el(): el() builds SVG-namespaced elements, and an SVG-namespaced <button> is
	// invisible to CSS and to the accessibility tree while looking fine in the inspector.
	report(/function elh\(tag, attrs, text\)/.test(src), 'HTML controls are built in the HTML namespace');
}

console.log('\n-- layout: the way out is ABOVE the wall --');
{
	const fn = src.slice(src.indexOf('function renderExamplesGallery'));
	const body = fn.slice(0, fn.indexOf('\n\tfunction ', 10));
	// Nothing guarantees the cards fit the map's height -- the shelf grows, the map height is a
	// user setting, and a phone is short -- so whatever comes after the grid is the first thing to
	// fall off the bottom. The escape hatch must not be that thing.
	report(body.indexOf('lpn-examples-blank') < body.indexOf("elh('div', { 'class': 'lpn-examples-grid' })"),
		'the blank-drawing link is appended before the grid');
}

console.log('\n-- layout: a deliberate order, not an accident of equal size --');
{
	report(examples.every(function (e) { return typeof e.order === 'number'; }),
		'every entry carries an explicit order');
	const si = examples.filter(function (e) { return e.system === 'si'; });
	report(si.length > 0, 'the shelf has at least one SI example', `${si.length}`);
	// **THE HEAD OF THE WALL IS TOM'S, AND IT IS NOT SIZE-ORDERED** (2026-08-21): Net3-World leads
	// because it is the real geographic project, Elm Street Center second. This used to assert that
	// an SI example led -- that was Tom's 2026-08-14 ruling when the basics were the head, and it is
	// superseded, not broken. What survives of it is checked just below: SI still precedes US among
	// the two basics, which is what he actually cared about and what a size sort cannot express.
	report(examples[0].file === 'Net3-Novato-CA-World.lwn', 'Net3-World leads the wall', examples[0].file);
	report(examples[1].file === 'Elm-Street-Center-lpn.json', 'and Elm Street Center is second',
		examples[1].file);
	let sorted = true;
	for (let i = 1; i < examples.length; i++) {
		const a = examples[i - 1], b = examples[i];
		const ka = [a.order, a.nodes + a.links], kb = [b.order, b.nodes + b.links];
		if (ka[0] > kb[0] || (ka[0] === kb[0] && ka[1] > kb[1])) { sorted = false; }
	}
	report(sorted, 'the wall runs order-then-size, so its tail grows from small to large');
	// The two basics are the pair the reader compares, so the longer explanation belongs on the one
	// they meet first; the second only has to say how it differs.
	const basics = examples.filter(function (e) { return /^Basic network/.test(e.title); });
	if (basics.length === 2) {
		// Tom, 2026-08-14: "I like that the SI network comes first since it's our only SI example."
		// The two basics are the same size, so a size sort cannot express this -- it is pinned in
		// examples.json, and an intent that survives only because a sort happens to be stable will
		// silently flip.
		report(basics[0].system === 'si', 'SI still comes first of the two basics', basics[0].file);
		report(basics[0].description.length > basics[1].description.length,
			'the leading basic carries the fuller description; the other is the also-ran',
			`${basics[0].description.length} vs ${basics[1].description.length}`);
	}
}

console.log('\n-- the card text is translatable, and the page supplies it --');
{
	const en = fs.readFileSync(path.join(root, 'lib/lang.ec.en.php'), 'utf8');
	examples.forEach(function (ex) {
		[ex.titleKey, ex.descKey].forEach(function (k) {
			report(en.indexOf(`$ec_lang['${k}']`) >= 0, `${k} exists in lang.ec.en.php`);
		});
	});
	// pageconfig_check.php matches literal EngCalcs.pageConfig.<key> reads and cannot see a bracket
	// lookup, so it is blind to this whole set. The page therefore emits them BY PATTERN, and the
	// generator's --check is what guarantees they exist — asserted here so neither half is dropped.
	const page = fs.readFileSync(path.join(root, 'Looped-Network.php'), 'utf8');
	report(/strpos\(\$k, 'lpn_ex_'\) !== 0/.test(page),
		'the page emits every lpn_ex_* key into pageConfig by pattern');
	report(/\(ex\.titleKey && pc\[ex\.titleKey\]\) \|\| ex\.title/.test(src),
		'the gallery prefers the translated title, falling back to the manifest English');
	report(/\(ex\.descKey && pc\[ex\.descKey\]\) \|\| ex\.description/.test(src),
		'and likewise the description');
}

console.log('\n-- flow unit leads, the way EPANET names a unit system --');
{
	// EPANET's [OPTIONS] Units setting is literally GPM or LPS, never "US" or "SI", so a water
	// engineer reads the flow unit as the name of the system (Tom, 2026-08-14: "list flow units
	// first for two reasons: EPANET and clarity").
	const basics = examples.filter(function (e) { return /^lpn_ex_basic_/.test(e.titleKey || ''); });
	report(basics.length === 2, 'both basics are present', `${basics.length}`);
	basics.forEach(function (ex) {
		const t = ex.title, d = ex.description;
		const flowAt = t.toLowerCase().indexOf(ex.system === 'si' ? 'l/s' : 'gpm');
		report(flowAt > 0, `${ex.titleKey}: the title names the flow unit`, t);
		// In the description, the flow unit must come before the length units.
		const dl = d.toLowerCase();
		const flowWord = ex.system === 'si' ? 'litres per second' : 'gallons per minute';
		const lenWord = ex.system === 'si' ? 'metres' : 'feet';
		report(dl.indexOf(flowWord) >= 0 && dl.indexOf(flowWord) < dl.indexOf(lenWord),
			`${ex.descKey}: flow unit is listed before the length units`);
	});
}

console.log('\n-- layout: thumbnails are drawings on white paper, in both themes --');
{
	const css = fs.readFileSync(path.join(root, 'css/engcalcs.css'), 'utf8');
	const thumb = css.slice(css.indexOf('.lpn-example-thumb'), css.indexOf('.lpn-example-title'));
	report(/background:\s*#fff/.test(thumb), 'the thumbnail sets its own white ground');
	report(/border:\s*1px solid/.test(thumb), 'and its own border');
	// The defect this replaced: the SVG has no background of its own, so it inherited the card's,
	// which the dark-theme rule turned near-black. A water network rendered white on black does not
	// read as a drawing. So the dark block must not re-theme the thumbnail.
	const darkBlock = css.slice(css.indexOf('@media (prefers-color-scheme: dark)', css.indexOf('.lpn-examples')));
	const darkEnd = darkBlock.indexOf('\n}');
	report(darkBlock.slice(0, darkEnd).indexOf('.lpn-example-thumb') < 0,
		'and the dark theme leaves it alone rather than inverting it');
}

console.log('\n-- wiring: the manifest is fetched lazily --');
{
	const fn = src.slice(src.indexOf('function updateEmptyHint'));
	const body = fn.slice(0, fn.indexOf('\n\tfunction ', 10));
	report(/if \(show\) \{ loadExamplesManifest\(\)/.test(body),
		'a returning user with a network on screen never pays for the manifest');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
