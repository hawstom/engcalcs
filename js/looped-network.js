// looped-network.js — Task 146 Phase 1 (Looped Pipe Network, Map Interface)
// Scaffold only: the real SVG map/editor engine (ported from the validated
// dev/lpn-spike/canvas-spike.html patterns) lands in a follow-up pass.
'use strict';

// calcAndSave() calls this unconditionally (e.g. from the unit-preset buttons in echoUnitsRow()) —
// a stub is required so switching US/SI doesn't throw before the real solve engine exists.
EngCalcs.pageCalculator = function (objForm) {
};

document.addEventListener('DOMContentLoaded', function () {
	EngCalcs.initTips(document);
});
