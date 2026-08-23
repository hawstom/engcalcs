// The harnesses' network, opened the way a visitor opens one (ROADMAP Task 378).
//
// WHY THIS EXISTS. Seven harnesses used to build their network by calling drawExampleNetwork(),
// a 289-line code-drawn ring main in js/looped-network.js that no menu item reached any more -- so
// it shipped to every visitor purely to give the test suite a fixture. The gallery file is the same
// ring main, already shipped, already the thing a visitor actually opens; reading it through
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
	return ROOT + 'examples/Basic-example-' + (system === 'si' ? 'SI' : 'US') + '-units-lpn.json';
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

module.exports = { EXAMPLE_EXPORTS, openExample, exampleText, examplePath };
