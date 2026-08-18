// Behavioural test of the share control (ROADMAP Task 228).
//
//   node dev/calc-spike/share-link-harness.js
//
// Not about a calculator's math. It is about what EngCalcs.copyLink() does when the clipboard
// is not there -- which is the whole design of the control, and the half a browser pass on a
// working laptop never exercises. navigator.clipboard is absent over plain http, missing in older
// browsers, and present-but-rejecting where the browser does not consider the call user-initiated;
// all three must end with the link on screen and selected, and none of them may end silently.
//
// The three failing shapes are separated on purpose: "no clipboard object", "no writeText", and
// "writeText rejects" are three different browsers, and a guard that catches two of them looks
// exactly like a guard that catches all three until somebody is standing in front of the third.
//
// Async because the real writeText returns a promise and this waits for the real one rather than
// for a synchronous stub -- a stub that resolved inline would remove the timing the code depends
// on and pass for the wrong reason.

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('share control (Task 228)');

// Any calculator will do -- it is loaded for its js/Calculators.lib.js and for the markup
// echoCalculatorForm() emits, not for its math.
const page = loadCalculator('Manning-Pipe-Flow.php');
const EngCalcs = page.EngCalcs;

const btn = page.document.getElementById('ec-copy-link-btn');
const status = page.document.getElementById('ec-copy-link-btn');
const box = page.document.getElementById('ec-copy-link-url');

r.section('the control is on the page at all');

// **THE BUTTON IS THE STATUS LINE.** The navbar carries no separate span: the confirmation and the
// fallback instruction both swap the button's own label, the same slot the tick uses. There is no
// `status` element to find, and looking for one was how this harness first described a control that
// lived in the form rather than the navbar.
r.ok(btn && box, 'button and url box both render');

// The two outcome strings arrive on data- attributes in the real page (see the comment in
// lib/Calculators.lib.php); the element bag does not carry attributes, so set them here.
btn.dataset.copiedText = 'COPIED';
btn.dataset.manualText = 'COPY THIS';

// Capture instead of sending, exactly as repeat-visit-harness.js does.
let signals = [];
EngCalcs.logSignal = function (event, detail) { signals.push(event + '|' + (detail || '')); };

function reset() {
	signals = [];
	status.textContent = '';
	box.value = '';
	box.hidden = true;
}

const url = page.sandbox.location.href;

(async function () {
	r.section('the clipboard works: say so, and nothing else appears');

	reset();
	let written = null;
	page.sandbox.navigator.clipboard = { writeText(t) { written = t; return Promise.resolve(); } };
	await EngCalcs.copyLink();
	r.eq(written, url, 'the current URL is what goes to the clipboard');
	r.eq(btn.textContent, 'COPIED', 'the button itself says it was copied');
	r.eq(box.hidden, true, 'the url box stays out of the way');
	r.eq(signals.join(), 'share|copy', 'one share row, detail copy');

	r.section('no clipboard at all: show the link, selected, and never fail silently');

	reset();
	delete page.sandbox.navigator.clipboard;
	await EngCalcs.copyLink();
	r.eq(box.hidden, false, 'the url box appears');
	r.eq(box.value, url, '...carrying the link to be copied by hand');
	r.eq(btn.textContent, 'COPY THIS', '...and the button asks for that');
	r.eq(signals.join(), 'share|manual', 'the row still lands, marked manual');

	r.section('a clipboard object with no writeText is the same case');

	reset();
	page.sandbox.navigator.clipboard = {};
	await EngCalcs.copyLink();
	r.eq(box.hidden, false, 'falls back rather than throwing on the missing method');
	r.eq(signals.join(), 'share|manual', 'and is counted as manual');

	r.section('writeText that rejects (permission, or not user-initiated)');

	reset();
	page.sandbox.navigator.clipboard = { writeText() { return Promise.reject(new Error('denied')); } };
	await EngCalcs.copyLink();
	r.eq(box.hidden, false, 'a rejected promise falls back too -- the case a laptop never shows');
	r.eq(btn.textContent, 'COPY THIS', '...with the same visible instruction');
	r.eq(signals.join(), 'share|manual', 'and the same manual row');

	r.section('writeText that throws synchronously');

	reset();
	page.sandbox.navigator.clipboard = { writeText() { throw new Error('boom'); } };
	await EngCalcs.copyLink();
	r.eq(box.hidden, false, 'a throwing implementation still ends with a usable link');
	r.eq(signals.join(), 'share|manual', 'and is still counted');

	r.section('the log row is one the server will accept');

	// The closed set in log-signal-event.php: an event outside it is a 400 and the measure is
	// silently zero. Assert the two spellings this file actually sends.
	const fs = require('fs');
	const path = require('path');
	const writer = fs.readFileSync(path.join(__dirname, '..', '..', 'log-signal-event.php'), 'utf8');
	r.ok(/in_array\(\$event, array\([^)]*'share'/.test(writer),
		"log-signal-event.php accepts the 'share' event");
	r.ok(/[^A-Za-z0-9._:\/-]/.test('copy') === false && /[^A-Za-z0-9._:\/-]/.test('manual') === false,
		"both details survive the writer's slug filter unchanged");

	r.finish();
})();
