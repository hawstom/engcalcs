// Shared Node bootstrap for the lpn harnesses -- reproduces the BROWSER'S SCRIPT ORDER.
//
// WHY THIS FILE EXISTS (found 2026-08-09, ROADMAP Task 243).
// Every page loads, in this order: Calculators.lib.js, PipeHydraulics.lib.js, lpn-solver.js
// (verified in Looped-Network.php). js/Calculators.lib.js is where `EngCalcs.G = 9.806` lives,
// and js/lpn-solver.js captures it at module load: `EngCalcs.lpnG = EngCalcs.G;`.
//
// A Node harness that just require()s lpn-solver.js skips Calculators.lib.js, so lpnG is
// undefined -- and the way that fails is the worst possible way. It does not throw. Any link
// with a minor-loss coefficient computes m = k/(2 * undefined * A^2) = NaN, every
// Darcy-Weisbach resistance goes NaN too (lpnResistance divides by lpnG), and the solver's
// gradient floor catches NaN by accident, because `!(NaN > gradMin)` is true. The result is a
// network that converges in 2 iterations to "no head loss anywhere" and REPORTS SUCCESS.
// dev/lpn-spike/validate.js had been failing exactly this way -- two continuity residuals plus
// a hard throw on `bpn constants did not load` -- and nothing noticed, because the run was
// assumed green. THE BROWSER WAS NEVER AFFECTED; this is harness-only rot.
//
// The constant is READ OUT OF Calculators.lib.js rather than restated here. Restating it would
// let the harness and the app drift apart silently, which is the same class of bug one level up.
// Calculators.lib.js cannot simply be require()d: it is browser code that touches the DOM at
// load time.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

// lpn-solver.js require()s PipeHydraulics.lib.js and returns THAT object, so the constant has
// to land on it before lpn-solver.js is loaded and copies G into lpnG.
const EngCalcs = require(path.join(ROOT, 'js', 'PipeHydraulics.lib.js'));

const calcSrc = fs.readFileSync(path.join(ROOT, 'js', 'Calculators.lib.js'), 'utf8');
const m = calcSrc.match(/EngCalcs\.G\s*=\s*([0-9]+(?:\.[0-9]+)?)\s*;/);
if (!m) {
	throw new Error(
		'bootstrap.js: could not find "EngCalcs.G = <number>;" in js/Calculators.lib.js. ' +
		'If gravity moved, point this reader at its new home -- do NOT hard-code the value.'
	);
}
EngCalcs.G = parseFloat(m[1]);
if (!(EngCalcs.G > 0)) {
	throw new Error('bootstrap.js: parsed a non-positive EngCalcs.G (' + m[1] + ')');
}

module.exports = EngCalcs;
