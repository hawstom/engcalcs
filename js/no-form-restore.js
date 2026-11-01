// Keep the browser from restoring typed values into this page's controls on back/forward.
//
// Chrome and Firefox save every control's value when the visitor leaves, then, once the page has
// parsed, pour the saved values back into the controls BY POSITION. This page builds most of its
// controls in script (the Settings rows, the tables), so after a deploy, a project change or any
// edit that alters how many controls there are, a value lands in a box it never belonged to: a
// longitude in a label prefix. The page restores every value it keeps from its own model, so the
// browser's restore is only ever wrong. `autocomplete="off"` makes the browser skip a control.
// Must run in <head>, before the body parses; stops watching at `load`, since a control made after
// that is never restored.
(function () {
	'use strict';
	var SEL = 'input,select,textarea';
	function off(n) {
		if (n.nodeType !== 1) { return; }
		if (n.matches(SEL)) { n.setAttribute('autocomplete', 'off'); }
		var k = n.querySelectorAll ? n.querySelectorAll(SEL) : [], i;
		for (i = 0; i < k.length; i++) { k[i].setAttribute('autocomplete', 'off'); }
	}
	function sweep(records) {
		var i, j;
		for (i = 0; i < records.length; i++) {
			for (j = 0; j < records[i].addedNodes.length; j++) { off(records[i].addedNodes[j]); }
		}
	}
	if (typeof MutationObserver === 'undefined') { return; }
	var mo = new MutationObserver(sweep);
	mo.observe(document, { childList: true, subtree: true });
	window.addEventListener('load', function () { sweep(mo.takeRecords()); mo.disconnect(); });
}());
