// The harnesses' network, opened the way a visitor opens one (ROADMAP Task 378).
//
// WHY THIS EXISTS. Ten harnesses used to build their network by calling drawExampleNetwork(),
// a code-drawn ring main in js/looped-network.js that no menu item reached any more -- so it
// shipped to every visitor purely to give the test suite a fixture. Seven took the gallery file
// instead (below); the other three took the fixture itself, which moved into this folder
// (example-draw-fixture.js). The gallery file is the same ring main, already shipped, already
// the thing a visitor actually opens; reading it through
// acceptImportedText() + applySaved() gives the harnesses their network AND exercises the open path,
// which the code path never did.
//
// THE STUB WARNING IN dev/testing-notes.md APPLIES HERE, so this file deliberately does NOT
// short-circuit anything: the real JSON text goes through the real parse/migrate/apply chain, and
// buildDom() builds the real elements. The only thing it adds is the file read.
const fs = require('fs');
const { ROOT } = require('./lpn-dom-stub.js');

// The exports every caller needs, in loadLoopedNetwork()'s injection format. Kept here so the seven
// harnesses cannot drift into injecting three slightly different versions of the same three names.
const EXAMPLE_EXPORTS =
	"\t\tacceptImportedText: acceptImportedText, applySaved: applySaved, buildDom: buildDom,\n" +
	"\t\tapplyMethodUI: applyMethodUI,\n";

function examplePath(system) {
	return ROOT + 'examples/Basic-example-' + (system === 'si' ? 'SI' : 'US') + '-units.lwn';
}

function exampleText(system) { return fs.readFileSync(examplePath(system), 'utf8'); }

// Opens the shipped gallery example into the page's document. `system` is 'us' (default) or 'si' --
// the two are separate FILES, not one drawing scaled, exactly as the gallery ships them.
//
// The caller must have its layers in place first (buildDom() writes into linksLayer/nodesLayer/
// labelsLayer), and must call runSolve() afterwards if it wants numbers: applySaved() restores a
// document, it does not solve one.
function openExample(L, system) {
	const saved = L.acceptImportedText(exampleText(system));
	if (!saved) { throw new Error('the gallery example did not open: ' + examplePath(system)); }
	L.applySaved(saved);
	L.buildDom();
	// **THE ONE THING refreshAllFromDocument() DOES THAT buildDom() DOES NOT**, and the project can
	// change it: the friction method belongs to the document, so opening one re-applies the roughness
	// unit row's visibility and the roughness label's decimals. Calling the whole of
	// refreshAllFromDocument() here would drag in the basemap, the tab strip, a view restore and a
	// debounced solve, none of which these harnesses have stubbed -- so the seam is named instead of
	// widened. If a harness ever needs another piece of that function, add it here, not privately.
	L.applyMethodUI();
	return saved;
}

// THE OTHER HALF OF TASK 378, for the three harnesses the gallery file cannot serve. This is the
// code-drawn ring main that used to live in js/looped-network.js, read as TEXT so lpn-dom-stub.js
// can splice it back into that file's own scope at load time. example-draw-fixture.js states why it
// moved and what it costs; read that before touching either end.
//
// Pass it as loadLoopedNetwork()'s second argument and drawExampleNetwork() is in scope exactly as
// it always was -- no other change to a harness.
function drawExampleSource() {
	return fs.readFileSync(__dirname + '/example-draw-fixture.js', 'utf8');
}

module.exports = { EXAMPLE_EXPORTS, openExample, exampleText, examplePath, drawExampleSource };
