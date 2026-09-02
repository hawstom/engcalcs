// WHAT A TAP ON A "?" DOES, AND WHAT CLOSING A BOX DOES TO ITS TIPS. Run with:
//   node dev/lpn-spike/tip-behaviour-harness.js
//
// Two defects Tom reported from a phone on 2026-08-29, and neither was visible to any existing
// check, because both are about what an EVENT does rather than about what the markup says:
//
//   *"? glyphs: The only problem is that it puts me in the input field, bringing up my input
//    keyboard when I am not ready for any input."*
//   *"Bug: Tips (? glyphs) in the Node editor survive the editor box on close on a phone."*
//
// **THIS HARNESS ASSERTS THE BEHAVIOUR, NOT THE CALL.** Asserting that closePopup() contains the
// word `hideTipsIn` proves that somebody typed it; it does not prove a tip goes away, and it would
// keep passing if the helper stopped working. So the two things a browser really does are modelled
// here and nothing else is:
//
//   1. **A <label>'s activation behaviour focuses the control it names, and it is CANCELLABLE.**
//      That is the whole of defect 1 -- the glyph sits inside the label, so the tap that asks for
//      the tip is also the tap that opens the keyboard. The stub therefore focuses the control
//      after dispatch *only if nothing called preventDefault()*, which is exactly the browser's
//      rule and the only quantity that matters here. A stub that focused unconditionally, or never,
//      would make this test pass for the wrong reason in opposite directions.
//   2. **A Bootstrap tooltip is rendered into document.body, not into the box that raised it.**
//      So hiding the box leaves the tip on screen. The stub models a tooltip as a `shown` flag plus
//      the `aria-describedby` attribute Bootstrap writes onto the TRIGGER while its tip is up --
//      which is how js/looped-network.js finds them, so the stub must write it or the sweep would
//      find nothing and report success.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..');

let checks = 0, failures = 0;
function ok(cond, label, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---------------------------------------------------------------------------------------------
// A DOM small enough to read and honest about the two couplings above.
// ---------------------------------------------------------------------------------------------
function mkEl(tag) {
	const el = {
		tagName: String(tag).toUpperCase(),
		nodeType: 1,
		children: [], parentNode: null, dataset: {}, _listeners: {},
		_attrs: {}, style: {}, focused: false,
		classList: {
			_t: [],
			add(c) { if (this._t.indexOf(c) < 0) { this._t.push(c); } },
			remove(c) { this._t = this._t.filter(x => x !== c); },
			contains(c) { return this._t.indexOf(c) >= 0; }
		},
		appendChild(c) { this.children.push(c); c.parentNode = this; return c; },
		// **removeChild IS THE COUPLING THIS SECTION TURNS ON.** sweepOrphanTips() deletes an
		// orphaned tip by removing it from its parent, so a stub without this would throw rather
		// than prove anything -- and a stub that no-opped it would report the sweep as working
		// while nothing left the page.
		removeChild(c) {
			const i = this.children.indexOf(c);
			if (i >= 0) { this.children.splice(i, 1); c.parentNode = null; }
			return c;
		},
		// `id` is a PROPERTY as well as an attribute in a real DOM, and sweepOrphanTips() reads the
		// property. A stub that only stored the attribute made the sweep skip every element and the
		// test passed for the wrong reason in the "left alone" direction while failing in the other.
		setAttribute(k, v) { this._attrs[k] = String(v); if (k === 'id') { this.id = String(v); } },
		getAttribute(k) { return Object.prototype.hasOwnProperty.call(this._attrs, k) ? this._attrs[k] : null; },
		removeAttribute(k) { delete this._attrs[k]; },
		hasAttribute(k) { return Object.prototype.hasOwnProperty.call(this._attrs, k); },
		addEventListener(t, f) { (this._listeners[t] = this._listeners[t] || []).push(f); },
		removeEventListener() {},
		focus() { this.focused = true; },
		// `.cls`, a bare tag, `.cls[attr]` and the attribute-prefix form js/looped-network.js uses.
		matches(sel) {
			return String(sel).split(',').map(s => s.trim()).some((s) => {
				const c = /^\.([\w-]+)\[([\w-]+)\]$/.exec(s);
				if (c) { return this.classList.contains(c[1]) && this.getAttribute(c[2]) !== null; }
				if (s.startsWith('.')) { return this.classList.contains(s.slice(1)); }
				if (s.startsWith('[')) {
					const m = /^\[([\w-]+)\^=["']?([^"'\]]*)["']?\]$/.exec(s);
					if (m) { const v = this.getAttribute(m[1]); return v !== null && v.indexOf(m[2]) === 0; }
					const b = /^\[([\w-]+)\]$/.exec(s);
					return !!b && this.getAttribute(b[1]) !== null;
				}
				return this.tagName === s.toUpperCase();
			});
		},
		closest(sel) {
			let n = this;
			while (n) { if (n.matches && n.matches(sel)) { return n; } n = n.parentNode; }
			return null;
		},
		querySelector(sel) { return this.querySelectorAll(sel)[0] || null; },
		querySelectorAll(sel) {
			const out = [];
			(function walk(e) {
				(e.children || []).forEach((c) => { if (c.matches && c.matches(sel)) { out.push(c); } walk(c); });
			})(this);
			return out;
		}
	};
	el.classList._el = el;
	// `title` doubles as an attribute, because that is how both the page and initTips() read it.
	Object.defineProperty(el, 'title', {
		configurable: true,
		get() { return this._attrs.title === undefined ? '' : this._attrs.title; },
		set(v) { this._attrs.title = String(v); }
	});
	return el;
}

// **THE ONE PHYSICAL RELATIONSHIP THIS STUB MUST KNOW.** A click bubbles to the root, and THEN --
// if no listener anywhere on the path called preventDefault() -- the nearest ancestor <label>
// activates, which means focusing the control it contains. Cancel the event and it does not.
function click(target) {
	const evt = { type: 'click', target: target, defaultPrevented: false };
	evt.preventDefault = function () { this.defaultPrevented = true; };
	evt.stopPropagation = function () { this._stopped = true; };
	let n = target;
	while (n && !evt._stopped) {
		(n._listeners.click || []).slice().forEach(f => f.call(n, evt));
		n = n.parentNode;
	}
	if (!evt.defaultPrevented) {
		const label = target.closest('label');
		const control = label && label.querySelector('input');
		if (control) { control.focus(); }
	}
	return evt;
}

// ---------------------------------------------------------------------------------------------
// The page's global furniture, and a Bootstrap tooltip modelled as what it is: a thing rendered
// somewhere else that marks its TRIGGER while it is up.
// ---------------------------------------------------------------------------------------------
const documentEl = mkEl('html');
const body = documentEl.appendChild(mkEl('body'));
const doc = {
	body: body,
	_listeners: {},
	addEventListener(t, f) { (this._listeners[t] = this._listeners[t] || []).push(f); },
	getElementById(id) { return documentEl.querySelectorAll('*').filter(e => e.getAttribute('id') === id)[0] || null; },
	querySelector(s) { return documentEl.querySelector(s); },
	querySelectorAll(s) { return documentEl.querySelectorAll(s); },
	createElement(t) { return mkEl(t); },
	createTextNode(t) { const n = mkEl('#text'); n.nodeType = 3; n._text = t; return n; }
};
// document.querySelectorAll('*') has to answer with every element, which the `*` selector above
// does not reach -- so it is taught here rather than in matches(), where it would make every
// class test true.
documentEl.querySelectorAll = function (sel) {
	const out = [];
	(function walk(e) {
		(e.children || []).forEach((c) => { if (sel === '*' || (c.matches && c.matches(sel))) { out.push(c); } walk(c); });
	})(this);
	return out;
};
const tipInstances = new Map();
let seq = 0;
function TooltipFor(el, cfg) {
	let inst = tipInstances.get(el);
	if (inst) { return inst; }
	inst = {
		el: el, config: cfg || {}, shown: false,
		show() { this.shown = true; el.setAttribute('aria-describedby', 'tooltip' + (++seq)); },
		hide() { this.shown = false; el.removeAttribute('aria-describedby'); }
	};
	// **THE TRIGGER IS BOOTSTRAP'S, AND THE STUB HAS TO HONOUR IT** -- otherwise nothing here would
	// ever show a tip and every assertion about one would pass on an empty screen. A `click` trigger
	// binds its own listener to the trigger element; `hover focus` binds none that a tap can reach,
	// which is the whole reason a device that cannot hover is given `click` in the first place.
	if (/click/.test(String(inst.config.trigger || ''))) {
		el.addEventListener('click', function () { if (inst.shown) { inst.hide(); } else { inst.show(); } });
	}
	tipInstances.set(el, inst);
	return inst;
}
const bootstrap = {
	Tooltip: {
		getOrCreateInstance: TooltipFor,
		getInstance(el) { return tipInstances.get(el) || null; }
	}
};

// Touch: no hover, so a plain label's tip opens on a tap -- which is the device the two defects
// were reported on and the only one where either can happen.
const win = {
	addEventListener() {},
	matchMedia(q) { return { matches: !/hover:\s*hover/.test(q) }; },
	bootstrap: bootstrap,
	innerWidth: 360, innerHeight: 640
};

const sandbox = {
	document: doc, window: win, bootstrap: bootstrap, navigator: { onLine: true },
	localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
	indexedDB: null, console: console, setTimeout: setTimeout, clearTimeout: clearTimeout
};
sandbox.self = sandbox;
const ctx = vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'Calculators.lib.js'), 'utf8'),
	ctx, { filename: 'Calculators.lib.js' });
const EngCalcs = sandbox.EngCalcs;
ok(!!(EngCalcs && EngCalcs.initTips), 'js/Calculators.lib.js loads and exposes initTips()');

// ---------------------------------------------------------------------------------------------
// 1. THE "?" ASKS A QUESTION AND DOES NOT START TYPING
// ---------------------------------------------------------------------------------------------
// Both nestings, because they are OPPOSITE (lib/Calculators.lib.php, and setFieldLabel() in
// js/looped-network.js builds the same two in JS): without a link `.ec-help` wraps the label TEXT
// and the glyph; with one it wraps the glyph alone. A fix hung on `.ec-help` would be right for one
// and wrong for the other.
function fieldWithTip(kind) {
	const label = body.appendChild(mkEl('label'));
	const help = mkEl('span');
	help.classList.add('ec-help');
	help.title = 'Energy per unit weight of water.';
	const glyph = mkEl('span');
	glyph.classList.add('ec-tip');
	glyph._text = '?';
	let text = null;
	if (kind === 'link') {
		const a = label.appendChild(mkEl('a'));
		a.setAttribute('href', 'https://example.org/');
		text = a;
		help.appendChild(glyph);
		label.appendChild(help);
	} else {
		text = mkEl('span');
		help.appendChild(text);
		help.appendChild(glyph);
		label.appendChild(help);
	}
	const input = label.appendChild(mkEl('input'));
	return { label, help, glyph, text, input };
}

console.log('\n--- a tap on the "?" shows the tip and leaves the keyboard shut ---');
['plain', 'link'].forEach((kind) => {
	const f = fieldWithTip(kind);
	EngCalcs.initTips(documentEl);
	const evt = click(f.glyph);
	const tip = bootstrap.Tooltip.getInstance(f.help);
	ok(!!tip && tip.shown, `the ${kind} label's tip is on screen after tapping its glyph`);
	ok(evt.defaultPrevented, `...the label's activation is cancelled (${kind})`);
	ok(f.input.focused === false,
		`...so the field is NOT focused and no keyboard rises (${kind})`,
		f.input.focused ? 'the input took focus' : '');
});

// **AND THE LABEL TEXT ITSELF IS UNCHANGED.** Only the glyph is cancelled: a tap on a field's NAME
// is meant to reach the field, which is what a <label> is for. Asserted on the tip-only nesting,
// where `.ec-help` wraps the words as well -- the case a fix written on `.ec-help` would break.
console.log('\n--- ...while a tap on the label TEXT still reaches the field ---');
{
	const f = fieldWithTip('plain');
	EngCalcs.initTips(documentEl);
	const evt = click(f.text);
	ok(!evt.defaultPrevented, 'a tap on the label words is not cancelled');
	ok(f.input.focused === true, '...and it still focuses the field it names');
}

// A MOUSE IS UNTOUCHED. It reaches the tip by hovering and never taps the glyph to read it, so
// nothing about the pointer behaviour moves -- asserted by running the same tap on a hovering
// device and finding the label doing exactly what it always did.
console.log('\n--- ...and a pointer device behaves exactly as before ---');
{
	const before = win.matchMedia;
	win.matchMedia = () => ({ matches: true });
	const f = fieldWithTip('plain');
	EngCalcs.initTips(documentEl);
	const evt = click(f.glyph);
	ok(!evt.defaultPrevented, 'on a device that can hover, nothing is cancelled');
	ok(f.input.focused === true, '...and the label still does what a label does');
	win.matchMedia = before;
}

// ---------------------------------------------------------------------------------------------
// 2. A BOX TAKES ITS TIPS WITH IT
// ---------------------------------------------------------------------------------------------
// The two functions are lifted out of js/looped-network.js and run for real, the way
// dev/lpn-spike/popup-drag-harness.js runs clampPanel(): the file is one IIFE, so there is nothing
// to require, and re-typing them here would test the copy.
const lpnSrc = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
function extract(name) {
	const at = lpnSrc.search(new RegExp('(?:async )?function ' + name + '\\s*\\('));
	if (at < 0) { throw new Error('not found: ' + name); }
	let i = lpnSrc.indexOf('{', at), depth = 0, end = i;
	for (; end < lpnSrc.length; end++) {
		if (lpnSrc[end] === '{') { depth++; }
		else if (lpnSrc[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return lpnSrc.slice(at, end);
}
// The module-scope variables closePopup() reads, re-declared here because this section evals those
// functions on their own rather than the whole file. `ghostShieldTimer` and `lastMapTapFinger` are
// the ghost-click shield, which closePopup() lowers on the same line it hides the box -- the same
// class of leak as a stranded tooltip and therefore the same fix site. hidePanel() comes with it
// because closing a box now goes through that one seam (Task 562).
vm.runInContext('var currentPopup = null, ghostShieldTimer = null, lastMapTapFinger = false;\n' +
	extract('hideTipsIn') + '\n' + extract('hidePanel') + '\n' + extract('closePopup') +
	'\n' + extract('sweepOrphanTips') + '\n' + extract('initTipsIn') +
	'\nthis.lpnClosePopup = closePopup;' +
	'\nthis.lpnSweepOrphanTips = sweepOrphanTips;' +
	'\nthis.lpnInitTipsIn = initTipsIn;', ctx, { filename: 'looped-network.js:closePopup' });

console.log('\n--- closing the Node editor takes its tips with it ---');
{
	const popup = mkEl('div');
	popup.setAttribute('id', 'lpn_popup');
	body.appendChild(popup);
	const label = popup.appendChild(mkEl('label'));
	const help = label.appendChild(mkEl('span'));
	help.classList.add('ec-help');
	help.title = 'Ground level at the junction.';
	const glyph = help.appendChild(mkEl('span'));
	glyph.classList.add('ec-tip');
	EngCalcs.initTips(popup);
	click(glyph);
	const tip = bootstrap.Tooltip.getInstance(help);
	ok(!!tip && tip.shown, 'a field tip inside the popup is up');
	// A tip somewhere else on the page is the control: closing one box must not sweep the screen.
	const other = body.appendChild(mkEl('span'));
	other.classList.add('ec-help');
	other.title = 'Something in the status bar.';
	EngCalcs.initTips(documentEl);
	bootstrap.Tooltip.getInstance(other).show();

	sandbox.lpnClosePopup();
	ok(tip.shown === false, '...and closing the popup takes it down');
	ok(popup.style.display === 'none', '...the popup itself is hidden');
	ok(bootstrap.Tooltip.getInstance(other).shown === true,
		'...while a tip belonging to something else is left alone');
}

// ---------------------------------------------------------------------------------------------
// AN ORPHANED TIP -- the one hideTipsIn() cannot reach, and the one Tom saw
// ---------------------------------------------------------------------------------------------
// Tom, 2026-09-02: *"I can see many of them, not really in the right places... Some of them linger
// unclosed even after box is gone."*
//
// **THIS DEFECT IS OLDER THAN THE REPORT.** Bootstrap renders a tooltip into document.body, and this
// page rebuilds the contents of its boxes constantly -- so a rebuild destroys the TRIGGER and leaves
// the rendered tip behind with no listener that could ever close it. hideTipsIn() walks from a root
// DOWN to triggers and an orphan has no trigger left to be found by, so it could never see them.
// They were painting at Bootstrap's own 1080, underneath the boxes; raising tips to 1900 so they
// could be read over a box is what made a pile of them visible at once.
console.log('\n--- a tip whose trigger was rebuilt away is swept from the body ---');
{
	const host = body.appendChild(mkEl('div'));
	const help = host.appendChild(mkEl('span'));
	help.classList.add('ec-help');
	help.title = 'A field that is about to be rebuilt away.';
	EngCalcs.initTips(host);
	bootstrap.Tooltip.getInstance(help).show();
	// What Bootstrap leaves in the body: a rendered .tooltip carrying the id the trigger points at.
	const rendered = body.appendChild(mkEl('div'));
	rendered.classList.add('tooltip');
	rendered.setAttribute('id', help.getAttribute('aria-describedby') || 'tooltip-orphan-1');
	ok(body.children.indexOf(rendered) >= 0, 'a rendered tip is in the body');

	// THE REBUILD. This is what every one of the eleven rebuild sites does: the trigger goes and
	// nothing tells the tooltip. Note the tip is NOT hidden first -- that is the whole point.
	host.removeChild(help);
	sandbox.lpnSweepOrphanTips();
	ok(body.children.indexOf(rendered) < 0,
		'...and once its trigger is gone the sweep removes it from the body');

	// The other direction, which is what stops this becoming "delete every tooltip": a tip whose
	// trigger is still on the page must survive.
	const keeper = body.appendChild(mkEl('span'));
	keeper.classList.add('ec-help');
	keeper.title = 'Still here.';
	EngCalcs.initTips(documentEl);
	bootstrap.Tooltip.getInstance(keeper).show();
	const live = body.appendChild(mkEl('div'));
	live.classList.add('tooltip');
	live.setAttribute('id', keeper.getAttribute('aria-describedby') || 'tooltip-live-1');
	sandbox.lpnSweepOrphanTips();
	ok(body.children.indexOf(live) >= 0,
		'...while a tip whose trigger is still there is left alone');
}

// EVERY BOX THAT RAISES TIPS CLOSES THROUGH THE SAME SWEEP -- and since Task 562 that is one
// function rather than a habit each closer has to be taught. The behaviour above is proved on the
// popup Tom reported; this is the cheap guard that the next box cannot get a closer of its own
// without it. The last five here are the ones that did NOT sweep: the pull-down menu and its
// fly-out, the Notes column, the modal dialog, the view popovers and the fire-flow run box.
// `dev/lpn-spike/panel-touch-harness.js` holds the other direction -- that nothing hides a panel by
// any route but this one.
console.log('\n--- ...and so does every other box that carries "?" glyphs ---');
['closeSettingsBox', 'closeLibraryBox', 'closeFireFlowBox', 'closeFindPopup', 'closeNewBox',
	'closeMenu', 'closeSubMenu', 'closeNotesPopup', 'closeDialog', 'closeViewPopovers',
	'closeFireFlowRunBox'].forEach((fn) => {
	ok(/hidePanel\(/.test(extract(fn)), `${fn}() closes through the one seam that sweeps its tips`);
});

console.log(`\n${failures ? 'FAILURES: ' + failures : 'all ' + checks + ' checks pass'}`);
process.exit(failures ? 1 : 0);
