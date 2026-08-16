// Shared headless scaffolding for the NON-lpn calculator harnesses (ROADMAP Task 292).
//
// WHAT THIS IS. Every calculator in this suite computes through one entry point --
// `EngCalcs.pageCalculator(objForm)` -- and that function is a pure function of its form:
// it reads `objForm[name].value`, does arithmetic, and writes `document.getElementById(name)
// .innerHTML`. Nothing else about a browser is involved. So the whole of what a behavioural
// test needs is a form, a bag of elements, and the page's own script list.
//
// WHY IT DUMPS THE PAGE INSTEAD OF DESCRIBING IT. The obvious shortcut is to write the field
// names, the page defaults and the unit factors into the harness. That builds a SECOND copy of
// the calculator's form, which drifts: change 'default' => '18' in the .php and the harness goes
// on testing 18 forever, agreeing with itself while the page ships something else. So the form
// is READ OUT OF THE RENDERED PAGE on every run, through dev/scripts/dump_calc_form.php. There
// is no fixture on disk and therefore none to go stale. It also means the harness tests things a
// hand-written form could not: that the page's unit selects carry the right families, that its
// presets resolve, and that every id a calculator writes to actually exists on the page.
//
//   const { loadCalculator } = require('./calc-page.js');
//   const page = loadCalculator('Manning-Pipe-Flow.php');
//   const metric = loadCalculator('Manning-Pipe-Flow.php', { lang: 'es' });  // the SI defaults
//   page.units('si');                       // apply a whole preset
//   page.set({ d0: 450, sf: 0.005, n: 0.013, dd0: 0.5 });
//   page.run();
//   page.num('q');                          // the Q the page would display, in DISPLAY units
//   page.si('q');                           // the same value in SI
//
// A NOTE ON UNITS, because it is the easiest thing to get backwards here. Everything the harness
// sets or reads is in the DISPLAY unit currently selected, exactly as a user sees it -- `set` puts
// the number in the input box, `num` reads the number out of the results cell. `si()` divides back
// out by the select's factor for tests that would rather assert in SI. That mirrors the suite's
// own rule: a calculator stores what the user typed, and conversion happens at the solver.
//
// AND THE COROLLARY, which is easy to get wrong: `units('si')` does NOT give you the page's SI
// defaults. It switches the selects and leaves the typed numbers alone -- so an 18 in pipe becomes
// an 18 mm pipe, exactly as it does for a user clicking the SI button. A page's SI defaults live
// in its `'default' => Array('us' => ..., 'si' => ...)` and are chosen AT RENDER TIME from the
// language, so the only way to see them is to render the page in a non-English language:
// `loadCalculator(page, { lang: 'es' })`.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');

/** Renders the page and returns its dumped form description. */
function dumpForm(pageName, lang) {
	const args = [path.join(ROOT, 'dev', 'scripts', 'dump_calc_form.php'), pageName];
	if (lang) { args.push('--lang=' + lang); }
	const out = execFileSync('php', args, {
		cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024
	});
	return JSON.parse(out);
}

// ---- the element bag ---------------------------------------------------------------------
// Deliberately thin. A calculator touches .value, .innerHTML, .textContent, .className and
// .classList and nothing else; anything richer would be inventing browser behaviour that the
// assertions then depend on.
function mkEl(id, written) {
	const el = {
		id: id,
		value: '',
		_innerHTML: '',
		textContent: '',
		className: '',
		style: {},
		dataset: {},
		children: [],
		rows: 0,
		classList: {
			_s: new Set(),
			add(...c) { c.forEach(x => this._s.add(x)); },
			remove(...c) { c.forEach(x => this._s.delete(x)); },
			contains(c) { return this._s.has(c); }
		},
		addEventListener() {},
		removeEventListener() {},
		querySelector() { return null; },
		querySelectorAll() { return []; },
		getElementsByTagName() { return this.children; },
		appendChild(c) { this.children.push(c); return c; },
		removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) { this.children.splice(i, 1); } return c; },
		insertRow() { const row = mkEl('tr'); this.children.push(row); return row; },
		closest() { return null; },
		focus() {}, select() {}, click() {}
	};
	// innerHTML is tracked, not stored plainly, so a harness can ask afterwards which cells the
	// calculator actually WROTE. That is what makes a suite-wide smoke test possible without a
	// per-page list of result names: the page tells you what its outputs are by writing them.
	Object.defineProperty(el, 'innerHTML', {
		get() { return this._innerHTML; },
		set(v) { this._innerHTML = v; if (written) { written.add(id); } }
	});
	return el;
}

/**
 * A radio GROUP, which is what `objForm.n_radio` is in a browser: its .value is the checked
 * member's value, and '' when none is checked. Getting this wrong is not cosmetic -- Manning
 * Trap Channel branches its whole roughness iteration on `p.n_radio`, and '' is the branch that
 * means "the user typed n themselves".
 */
function mkRadioGroup(name, options, initial) {
	return { name: name, value: initial || '', options: options.slice() };
}

/**
 * Builds a headless page and returns the handle described at the top of this file.
 * Throws -- loudly, with the id named -- if the calculator writes to an element the rendered
 * page does not have. That is a real defect class (a renamed result row leaves the page with a
 * TypeError on every keystroke) and silently auto-creating the element would hide it.
 */
function loadCalculator(pageName, opts) {
	const lang = (opts && opts.lang) || '';
	const dump = dumpForm(pageName, lang);

	// --- form: one entry per named control, addressable as form[name] ---
	const written = new Set();
	const form = {};
	for (const [name, f] of Object.entries(dump.fields)) {
		if (f.tag === 'radio') {
			form[name] = mkRadioGroup(name, f.options, f.value);
			continue;
		}
		const el = mkEl(name, written);
		el.value = f.value === null ? '' : f.value;
		if (f.tag === 'select') {
			el._family = f.family;
			el._options = f.options;   // unit key -> option value; identical since Task 390
		}
		if (f.tag === 'checkbox') { el.checked = !!f.checked; }
		form[name] = el;
	}
	form.elements = Object.values(form).filter(e => e && e.id);

	// --- element bag: every id the page rendered, created on first touch ---
	const pageIds = new Set(dump.ids);
	const els = {};
	function getElementById(id) {
		if (form[id] && form[id].id) { return form[id]; }
		if (els[id]) { return els[id]; }
		if (!pageIds.has(id)) {
			throw new Error(
				`${pageName}: the calculator wrote to element '${id}', which the rendered page does ` +
				`not contain. In a browser getElementById returns null there and the calculator ` +
				`throws on every keystroke. Either the page lost a row or the name was misspelled.`
			);
		}
		els[id] = mkEl(id, written);
		return els[id];
	}

	// --- the browser globals a calculator file touches at load and at run ---
	const documentStub = {
		forms: { formInput: form },
		getElementById: getElementById,
		querySelector() { return null; },
		querySelectorAll() { return []; },
		addEventListener() {},
		createElement(tag) { return mkEl(tag, null); },
		cookie: '',
		body: mkEl('body', null),
		documentElement: mkEl('html', null),
		readyState: 'complete'
	};
	const sandbox = {
		document: documentStub,
		navigator: { onLine: true, sendBeacon() { return true; }, clipboard: { writeText() { return Promise.resolve(); } } },
		console: console,
		location: { href: 'https://hawsedc.com/engcalcs/' + pageName, pathname: '/engcalcs/' + pageName, search: '' },
		setTimeout: () => 0,
		clearTimeout: () => {},
		fetch: () => Promise.resolve({ ok: true }),
		URL: URL, URLSearchParams: URLSearchParams,
		Promise: Promise, Math: Math, JSON: JSON, Date: Date
	};
	sandbox.window = sandbox;
	sandbox.self = sandbox;
	sandbox.window.addEventListener = () => {};
	sandbox.addEventListener = () => {};
	vm.createContext(sandbox);

	// --- the page's own scripts, in the page's own order ---
	// vendor/ is skipped: it is Bootstrap, it needs a real DOM, and no calculator's math calls it.
	const loaded = [];
	for (const src of dump.scripts) {
		if (src.startsWith('js/vendor/')) { continue; }
		const file = path.join(ROOT, src);
		vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: src });
		loaded.push(src);
	}
	const EngCalcs = sandbox.EngCalcs;
	if (!EngCalcs || typeof EngCalcs.pageCalculator !== 'function') {
		throw new Error(`${pageName}: loading ${loaded.join(', ')} defined no EngCalcs.pageCalculator`);
	}
	EngCalcs.unitSets = dump.unitSets;
	// Emitted inline by echoHTMLHead(), not by any .js file, so the sandbox does not pick it up
	// with the scripts. Without it every EngCalcs.unitFactor() call answers 1 and every
	// US-unit assertion on this page would quietly pass in metres.
	EngCalcs.unitFactors = dump.unitFactors;
	EngCalcs.pageConfig = Object.assign({}, EngCalcs.pageConfig, dump.pageConfig);

	// --- the handle ---
	const api = {
		page: pageName,
		lang: dump.lang,
		dump: dump,
		EngCalcs: EngCalcs,
		form: form,
		scripts: loaded,
		// The page's browser globals, for the few tests that are about what a SCRIPT does with the
		// browser rather than what pageCalculator does with the form -- cookies, localStorage, the
		// beacons. Exposed rather than re-stubbed in each harness so those tests run against the
		// real js/Calculators.lib.js in the real load order, not against a copy of a function.
		document: documentStub,
		sandbox: sandbox,

		/** The unit-conversion factor currently selected for a field (display per SI). */
		factor(name) {
			return EngCalcs.unitFactor(form[name + 'u']);
		},

		/** Applies a whole unit preset ('us' or 'si'), the way the page's own buttons do. */
		units(preset) {
			const map = dump.unitSets && dump.unitSets[preset];
			if (!map) { throw new Error(`${pageName}: no unit preset '${preset}'`); }
			for (const el of Object.values(form)) {
				if (!el || !el._options) { continue; }
				const unit = map[el._family];
				if (!unit) { continue; }
				if (!(unit in el._options)) {
					throw new Error(
						`${pageName}: preset '${preset}' maps family '${el._family}' to unit '${unit}', ` +
						`which select '${el.id}' does not offer (it has: ${Object.keys(el._options).join(', ')}).`
					);
				}
				el.value = el._options[unit];
			}
			return api;
		},

		/** Selects one field's unit by its unit key, e.g. unit('d0', 'ft'). */
		unit(name, unitKey) {
			const sel = form[name + 'u'] || form[name];
			if (!sel || !sel._options) { throw new Error(`${pageName}: '${name}' has no unit select`); }
			if (!(unitKey in sel._options)) {
				throw new Error(`${pageName}: select '${sel.id}' has no unit '${unitKey}'`);
			}
			sel.value = sel._options[unitKey];
			return api;
		},

		/** Types values into inputs, in DISPLAY units. set({d0: 18, n: 0.013}) or set('d0', 18). */
		set(nameOrObj, value) {
			const pairs = (typeof nameOrObj === 'string') ? [[nameOrObj, value]] : Object.entries(nameOrObj);
			for (const [name, v] of pairs) {
				if (!form[name]) { throw new Error(`${pageName}: no form field named '${name}'`); }
				form[name].value = String(v);
			}
			return api;
		},

		/** Picks a radio in a group, e.g. radio('n_radio', 'strickler'); '' means none checked. */
		radio(group, value) {
			const g = form[group];
			if (!g || !g.options) { throw new Error(`${pageName}: no radio group '${group}'`); }
			if (value !== '' && !g.options.includes(value)) {
				throw new Error(`${pageName}: radio '${group}' has no option '${value}' (has: ${g.options.join(', ')})`);
			}
			g.value = value;
			return api;
		},

		/** Runs the page's calculator exactly as EngCalcs.calcAndSave does. */
		run() {
			EngCalcs.pageCalculator(form);
			return api;
		},

		/** Raw innerHTML of a result cell -- for the verdict strings, which are not numbers. */
		html(name) { return getElementById(name).innerHTML; },

		/**
		 * .textContent of an element. NOT interchangeable with html(): the solver status lines
		 * are written with textContent and the verdict cells with innerHTML, so reading the wrong
		 * one returns '' and a test asserting "a message appeared" passes for the wrong reason.
		 */
		text(name) { return getElementById(name).textContent; },

		/** A result as the page displays it, in the currently selected DISPLAY unit. */
		num(name) {
			const raw = getElementById(name).innerHTML;
			const n = parseFloat(raw);
			if (!isFinite(n)) { throw new Error(`${pageName}: result '${name}' is not a number: "${raw}"`); }
			return n;
		},

		/** A result converted back to SI, for assertions that would rather not mind the preset. */
		si(name) { return api.num(name) / api.factor(name); },

		/** The value currently in an input box (a calculator may write back into one). */
		input(name) { return form[name] ? form[name].value : undefined; },

		/**
		 * Every element the calculator WROTE to during the run, as { id: innerHTML }. The page
		 * declares its own outputs this way, so a check can be written once and applied to all
		 * 19 calculators without a hand-maintained list of result names per page.
		 */
		outputs() {
			const out = {};
			for (const id of written) { out[id] = getElementById(id).innerHTML; }
			return out;
		},

		/** Forgets what has been written so far, so a second run() reports only its own outputs. */
		forget() { written.clear(); return api; }
	};
	return api;
}

// ---- assertion helpers, shared so every calculator harness reports alike ----------------
function makeReporter(title) {
	let checks = 0, failures = 0;
	console.log(`=== ${title} ===`);
	const r = {
		section(label) { console.log(`--- ${label} ---`); },
		report(ok, label, detail) {
			checks++;
			if (!ok) { failures++; }
			console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
		},
		/** Relative-tolerance compare -- engineering results, not exact arithmetic. */
		close(actual, expected, tol, label) {
			const denom = Math.abs(expected) > 1e-12 ? Math.abs(expected) : 1;
			const err = Math.abs(actual - expected) / denom;
			r.report(err <= tol, label, `got ${actual}, want ${expected} (±${(tol * 100).toFixed(2)}%)`);
		},
		eq(actual, expected, label) {
			r.report(actual === expected, label, `got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
		},
		ok(cond, label, detail) { r.report(!!cond, label, detail); },
		finish() {
			console.log(`${checks} checks, ${failures} failing.`);
			if (failures) { process.exitCode = 1; }
			return failures;
		}
	};
	return r;
}

module.exports = { loadCalculator, makeReporter, ROOT };
