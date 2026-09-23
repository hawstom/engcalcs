// Guard against repeated activation of a gallery example -- ROADMAP queue R-129.
//
//   node dev/lpn-spike/example-open-guard-harness.js
//
// Tom, on the examples gallery: "When opening an example, there was a delay during which I
// clicked repeatedly. Unbeknownst to me, I was asking for repeated new projects." The fetch +
// import round trip is genuinely slow (queue R-130), and a card is an ordinary <button> --
// activating it again before the first import lands used to start a second one, and a held Enter
// key fires the same 'click' repeatedly for free.
//
// THIS ASSERTS THE FIX AT THE SEAM, not by simulating a click: it calls openExample() directly,
// five times synchronously, exactly the way five real clicks would arrive before the DOM has had a
// chance to repaint (and exactly what a stub click event cannot force a real browser to do, which
// is why this is not a browser-pass script). One activation must produce one project; the other
// four must be no-ops. It also asserts the gallery closes on the FIRST activation rather than when
// the import finishes -- that gap is the delay Tom clicked into -- and that a failed fetch clears
// the guard and reopens the gallery, so a stuck flag can never make every future click a no-op.

const {
	ROOT, loadLoopedNetwork
} = require('./lpn-dom-stub.js');
const fs = require('fs');
const path = require('path');

const EXAMPLE_URL = '/engcalcs/examples/Basic-example-US-units.lwn';
const EXAMPLE_TEXT = fs.readFileSync(path.join(ROOT, 'examples/Basic-example-US-units.lwn'), 'utf8');

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

function drain(turns) {
	let p = Promise.resolve();
	for (let i = 0; i < turns; i++) { p = p.then(function () { return null; }); }
	return p;
}

// The manifest fetch (loadExamplesManifest, fired whenever the gallery is shown) is not what this
// harness is about -- give it a stable, immediate, empty-but-successful answer so it never leaves a
// pending promise behind or perturbs the example-file fetch count this test actually watches.
function installFetch(exampleBehavior) {
	let exampleCalls = 0;
	global.fetch = global.window.fetch = function (url) {
		if (url === EXAMPLE_URL) {
			exampleCalls++;
			return exampleBehavior();
		}
		return Promise.resolve({ ok: true, json: function () { return Promise.resolve({ examples: [] }); } });
	};
	return { count: function () { return exampleCalls; } };
}

function makeL(mutate) {
	const L = loadLoopedNetwork(
		"\t\topenExample: openExample,\n" +
		"\t\tgetLibrary: function () { return library; },\n" +
		"\t\thintDisplay: function () { return document.getElementById('lpn_empty_hint').style.display; },\n" +
		"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
		"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
		"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
		"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
		"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
		"\t\t\tworld = el('g', {}, svg);\n" +
		"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
		"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
		"\t\t\tlabelsLayer = el('g', {}, world);\n" +
		"\t\t\trubberBandEl = el('line', {}, world); library.projects = []; library.openId = null;\n" +
		"\t\t\tlibrary.galleryDismissed = false; examplesState = 'idle'; exampleOpenInFlight = false;\n" +
		// **byId's elements are a SINGLETON across every loadLoopedNetwork() call in this process**
		// (lpn-dom-stub.js is require()d once and cached), so a display left over from a PRIOR run
		// (real source, or an earlier mutation) would otherwise leak into this one and make an
		// assertion pass by accident rather than by the code under test.
		"\t\t\tdocument.getElementById('lpn_empty_hint').style.display = ''; }\n",
		null,
		mutate
	);
	L.reset();
	return L;
}

function run(label, mutate) {
	console.log('\n=== ' + label + ' ===');
	const before = fails;
	const L = makeL(mutate);
	const ex = { file: 'Basic-example-US-units.lwn' };
	// Collect EVERY resolver, not just the last -- so that with the guard removed, resolving all
	// five in-flight fetches actually proves five imports would have landed, rather than the test
	// merely happening to only ever settle the one promise a naive mock kept a handle to.
	const resolvers = [];
	const fetchLog = installFetch(function () {
		return new Promise(function (resolve) { resolvers.push(resolve); });
	});

	console.log('\n-- five rapid activations while one is in flight --');
	L.openExample(ex);
	ok('the gallery closes on the FIRST activation, before the fetch even resolves',
		L.hintDisplay() === 'none', L.hintDisplay());
	L.openExample(ex);
	L.openExample(ex);
	L.openExample(ex);
	L.openExample(ex);
	ok('exactly one fetch went out for five activations', fetchLog.count() === 1, String(fetchLog.count()));

	resolvers.forEach(function (resolve) {
		resolve({ ok: true, text: function () { return Promise.resolve(EXAMPLE_TEXT); } });
	});

	return drain(20).then(function () {
		ok('one activation opened exactly one project, not up to five',
			L.getLibrary().projects.length === 1, String(L.getLibrary().projects.length));

		console.log('\n-- a failed open re-enables things --');
		const L2 = makeL(mutate);
		let rejectExample = null;
		const fetchLog2 = installFetch(function () {
			return new Promise(function (resolve, reject) { rejectExample = reject; });
		});
		L2.openExample(ex);
		ok('the gallery is closed while the (failing) fetch is out', L2.hintDisplay() === 'none', L2.hintDisplay());
		rejectExample(new Error('network down'));
		return drain(20).then(function () {
			ok('and the gallery reopened so the visitor can see the failure and retry',
				L2.hintDisplay() === 'block', L2.hintDisplay());
			const before2 = fetchLog2.count();
			L2.openExample(ex); // proves the in-flight guard actually lifted, not just that it was never set
			ok('the guard lifted, so a second activation is not swallowed',
				fetchLog2.count() === before2 + 1, String(fetchLog2.count()));
		});
	}).then(function () {
		return fails - before; // new failures introduced by this run
	});
}

const MUTATIONS = [
	{
		label: 'mutated: guard removed',
		mutate: function (src) {
			return src.replace(
				'if (exampleOpenInFlight) { return; }\n\t\texampleOpenInFlight = true;',
				'exampleOpenInFlight = true;'
			);
		}
	},
	{
		// Moves the close from before the fetch to after it lands -- exactly the delay Tom clicked
		// into, reintroduced on purpose so the FIRST assertion in every run above must go red.
		label: 'mutated: gallery closes on landing, not on activation',
		mutate: function (src) {
			const marker = "\t\thideExamplesGallery();\n\t\tvar pc = EngCalcs.pageConfig || {};";
			if (src.indexOf(marker) < 0) { throw new Error('mutation marker not found'); }
			let out = src.replace(marker, '\t\tvar pc = EngCalcs.pageConfig || {};');
			const landing = "\t\t\t\texampleOpenInFlight = false;\n\t\t\t\tvar perfParse0 = perfFetch0 && performance.now();";
			if (out.indexOf(landing) < 0) { throw new Error('mutation landing marker not found'); }
			return out.replace(landing, "\t\t\t\texampleOpenInFlight = false;\n\t\t\t\thideExamplesGallery();\n\t\t\t\tvar perfParse0 = perfFetch0 && performance.now();");
		}
	}
];

run('real source', null).then(function (newFailsReal) {
	if (newFailsReal !== 0) {
		console.log('\nERROR: the unmutated source failed ' + newFailsReal + ' check(s) above.');
		process.exit(1);
	}
	return MUTATIONS.reduce(function (p, m) {
		return p.then(function () {
			console.log('\n-- mutation test: ' + m.label + ' --');
			return run(m.label, m.mutate).then(function (newFails) {
				if (newFails === 0) {
					console.log('\nERROR: "' + m.label + '" should have broken at least one check, and did not.');
					process.exit(1);
				}
				console.log('(mutation confirmed: "' + m.label + '" broke ' + newFails + ' check(s), as expected)');
			});
		});
	}, Promise.resolve());
}).then(function () {
	console.log('\n' + (checks - fails) + '/' + checks + ' checks passed across all runs');
	process.exit(0);
}).catch(function (e) {
	console.log('FAIL  (uncaught) ' + (e && e.stack || e));
	process.exit(1);
});
