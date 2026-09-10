// **WHAT DOES THE MAP DO WHEN THE BROWSER LIES ABOUT MEASUREMENTS?** (MJH, 2026-09-09)
//
//   node dev/browser-pass/measure-probe.js            # every scenario, in Gecko
//   node dev/browser-pass/measure-probe.js baseline   # one of them
//   node dev/browser-pass/measure-probe.js --chromium
//
// This is a PROBE, not a spec: it asserts nothing and prints what the page did. The report it was
// written for is a civil engineering designer in LibreWolf who met "a completely blue map", a
// rubber band scaled wrongly, and a project he could not edit at all -- surviving a reload AND a
// full Erase-everything, so it is not stored state. The hypothesis under test is that a hardened
// browser or a privacy extension answered a MEASUREMENT wrongly and the world transform was
// computed from it.
//
// Each scenario is one page-level lie, injected before any of our own script runs.
//
// ---------------------------------------------------------------------------------------------
// WHAT IT FOUND, 2026-09-09
//
// **The mechanism is reproduced and the environmental trigger is NOT.** Removing the two link
// properties at a geographic scale reproduces every symptom in the report exactly (scenario
// `blueLinksOnly`, and dev/lpn-spike/scale-publish-harness.js has the numbers). What no lie here
// reproduces is a browser that CAUSES that state: in all ten degradations below the four properties
// were published and agreed with the scale.
//
// RULED OUT, each measured rather than reasoned about, in Gecko with LibreWolf's own prefs
// (privacy.resistFingerprinting, its letterboxing, strict tracking protection, cookieBehavior 5):
// getScreenCTM() returning null and returning the identity (this page calls neither), getBBox()
// throwing (every call site is already inside a try), getComputedTextLength() returning 0, a
// ResizeObserver that never fires, a letterboxed odd-sized window, and a device scale factor of 2.
// A canvas whose getBoundingClientRect() is all zeros leaves the map at scale 1 with no basemap,
// which is a different picture from the one reported; a canvas whose clientWidth/clientHeight are
// zero draws correctly and is the one case here where an edit did not land.
//
// **AND ONE SEPARATE DEFECT, WHICH IS NOT THIS ONE BUT IS WORSE FOR THE SAME VISITOR:** with site
// data blocked -- `lsOnly` and `lsMethodsThrow`, which is a setting rather than private browsing --
// clicking an example card does NOTHING AT ALL. No error, no console line, no message: the gallery
// stays up and no project is ever created, because importProject() cannot write the library index.
// It is not MJH's report (his network was drawn and intact), and it has no fix here.
//
// ---------------------------------------------------------------------------------------------
// THE THIRTY-SECOND DIAGNOSTIC, for a user to paste into their own console on the map page
//
// Open the map, open the browser console, paste this, and send back what it prints. `pipePx` is the
// question: it should be a small number of screen pixels, and this defect makes it thousands.
//
//   (function(){var s=document.getElementById('lpn_canvas'),g=s&&s.querySelector('g'),
//   c=s&&getComputedStyle(s),r=s&&s.getBoundingClientRect(),L=s&&s.querySelector('.lpn-link'),
//   p=function(n){return c?(c.getPropertyValue(n).trim()||'(unset)'):'?'},
//   m=g?/scale\(([^)]+)\)/.exec(g.getAttribute('transform')||''):null,sc=m?parseFloat(m[1]):null,
//   t=function(f){try{return String(f())}catch(e){return 'threw '+e.name}};
//   console.log({canvas:r&&[r.x,r.y,r.width,r.height],heightAttr:s&&s.getAttribute('height'),
//   transform:g&&g.getAttribute('transform'),scale:sc,sym:p('--lpn-sym'),lw:p('--lpn-lw'),
//   hit:p('--lpn-hit'),hair:p('--lpn-hair'),
//   pipePx:(L&&sc)?parseFloat(getComputedStyle(L).strokeWidth)*sc:null,
//   underMiddle:r?(function(e){return e?(e.id||e.getAttribute('class')||e.tagName):null;}
//     (document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))):null,
//   win:[innerWidth,innerHeight,devicePixelRatio],
//   ctm:t(function(){return s.getScreenCTM();}),
//   store:t(function(){return localStorage.length;})});}())
//
// Then reload with the console open and "Persist"/"Preserve log" ticked, and copy every red line.
// An exception thrown early in boot is invisible afterwards, and it is the one thing this snippet
// cannot see for itself.

const path = require('path');
const fs = require('fs');
const os = require('os');
const playwright = require(path.join(__dirname, 'node_modules', 'playwright-core'));
const { startServer, stopServer, pageUrl } = require('./lib/env');
const { readPng, dominantColors, isBlue } = require('./lib/png');

function findFirefox() {
	const cache = path.join(os.homedir(), '.cache', 'ms-playwright');
	if (!fs.existsSync(cache)) { return null; }
	for (const dir of fs.readdirSync(cache)) {
		if (!/^firefox-/.test(dir)) { continue; }
		const exe = path.join(cache, dir, 'firefox', 'firefox');
		if (fs.existsSync(exe)) { return exe; }
	}
	return null;
}

// LibreWolf's own hardening, as far as prefs can express it.
const LIBREWOLF_PREFS = {
	'privacy.resistFingerprinting': true,
	'privacy.resistFingerprinting.letterboxing': true,
	'privacy.trackingprotection.enabled': true,
	'network.cookie.cookieBehavior': 5
};

// ---- the lies -------------------------------------------------------------------------------
//
// Each is a string evaluated in the page before anything else. They stand in for the extension
// classes named in the report: CanvasBlocker and its relatives stub exactly these.
const LIES = {
	baseline: '',

	ctmNull: `Object.getPrototypeOf(document.createElementNS('http://www.w3.org/2000/svg','svg')).getScreenCTM = function () { return null; };`,

	ctmIdentity: `(function () {
		var P = Object.getPrototypeOf(document.createElementNS('http://www.w3.org/2000/svg','svg'));
		P.getScreenCTM = function () { var s = document.createElementNS('http://www.w3.org/2000/svg','svg'); return s.createSVGMatrix(); };
	}());`,

	rectZero: `Element.prototype.getBoundingClientRect = function () {
		return { x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON: function () { return {}; } };
	};`,

	// Only the CANVAS lies. A whole-document zero rect breaks the browser's own chrome measurement
	// too, which is a different (and less plausible) failure from a stubbed SVG API.
	canvasRectZero: `(function () {
		var real = Element.prototype.getBoundingClientRect;
		Element.prototype.getBoundingClientRect = function () {
			if (this.id === 'lpn_canvas') {
				return { x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON: function () { return {}; } };
			}
			return real.call(this);
		};
	}());`,

	// The other half of the same lie: clientWidth/clientHeight, which is what currentView(),
	// applyView() and zoomExtent() read.
	canvasClientZero: `(function () {
		var d = Object.getOwnPropertyDescriptor(Element.prototype, 'clientWidth');
		var e = Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight');
		Object.defineProperty(Element.prototype, 'clientWidth', { configurable: true, get: function () { return this.id === 'lpn_canvas' ? 0 : d.get.call(this); } });
		Object.defineProperty(Element.prototype, 'clientHeight', { configurable: true, get: function () { return this.id === 'lpn_canvas' ? 0 : e.get.call(this); } });
	}());`,

	bboxThrows: `(function () {
		var P = Object.getPrototypeOf(document.createElementNS('http://www.w3.org/2000/svg','text'));
		var G = Object.getPrototypeOf(document.createElementNS('http://www.w3.org/2000/svg','g'));
		[P, G].forEach(function (p) { p.getBBox = function () { throw new Error('blocked by an extension'); }; });
	}());`,

	textLenZero: `Object.getPrototypeOf(document.createElementNS('http://www.w3.org/2000/svg','text')).getComputedTextLength = function () { return 0; };`,

	// The ResizeObserver that is constructed and never fires. This is the trap the handoff records.
	roDead: `window.ResizeObserver = function () { return { observe: function () {}, unobserve: function () {}, disconnect: function () {} }; };`,

	// Site data blocked: the PROPERTY ACCESS itself throws, which is CLAUDE.md's own rule.
	storageBlocked: `(function () {
		var thrower = { get: function () { throw new DOMException('The operation is insecure.', 'SecurityError'); }, configurable: true };
		Object.defineProperty(window, 'localStorage', thrower);
		Object.defineProperty(window, 'sessionStorage', thrower);
		Object.defineProperty(navigator, 'serviceWorker', { configurable: true, get: function () { throw new DOMException('The operation is insecure.', 'SecurityError'); } });
	}());`,

	// The two halves of it, separately, because they are two different faults with one symptom.
	lsOnly: `(function () {
		var thrower = { get: function () { throw new DOMException('The operation is insecure.', 'SecurityError'); }, configurable: true };
		Object.defineProperty(window, 'localStorage', thrower);
		Object.defineProperty(window, 'sessionStorage', thrower);
	}());`,

	swOnly: `Object.defineProperty(navigator, 'serviceWorker', { configurable: true, get: function () { throw new DOMException('The operation is insecure.', 'SecurityError'); } });`,

	// **NOT A BROWSER FAULT: THE MECHANISM, ISOLATED.** The three pixel-derived properties are simply
	// removed once the map is drawn, which is what a page looks like when refreshSymbolSizes() has
	// not run at this scale. Every CSS fallback is in WORLD units, so at a geographic scale they are
	// thousands of screen pixels each. This exists to say what MJH's screen was showing.
	blueProof: `window.addEventListener('load', function () { setTimeout(function () {
		var s = document.getElementById('lpn_canvas');
		['--lpn-sym', '--lpn-lw', '--lpn-hit', '--lpn-hair'].forEach(function (p) { s.style.removeProperty(p); });
		var real = s.style.setProperty.bind(s.style);
		s.style.setProperty = function (p, v) { if (/^--lpn-/.test(p)) { return; } return real(p, v); };
	}, 4000); });`,

	// What the browser actually does with site data blocked, rather than what we think it does:
	// localStorage is present and every METHOD throws. Gecko's own shape for dom.storage.enabled.
	// The same, but only the two properties a PIPE reads. The label halo is a 3-unit black stroke, so
	// removing --lpn-sym as well paints the map black rather than blue and hides the thing being
	// shown. This is the one that matches the report's own word.
	blueLinksOnly: `window.addEventListener('load', function () { setTimeout(function () {
		var s = document.getElementById('lpn_canvas');
		['--lpn-lw', '--lpn-hit'].forEach(function (p) { s.style.removeProperty(p); });
		var real = s.style.setProperty.bind(s.style);
		s.style.setProperty = function (p, v) { if (p === '--lpn-lw' || p === '--lpn-hit') { return; } return real(p, v); };
	}, 4000); });`,

	lsMethodsThrow: `(function () {
		['localStorage', 'sessionStorage'].forEach(function (n) {
			var s = { getItem: f, setItem: f, removeItem: f, key: f, clear: f, length: 0 };
			function f() { throw new DOMException('The operation is insecure.', 'SecurityError'); }
			Object.defineProperty(window, n, { configurable: true, get: function () { return s; } });
		});
	}());`
};

// What the page ended up believing, and what a person would see.
const READ = `(function () {
	var svg = document.getElementById('lpn_canvas');
	var world = svg ? svg.querySelector('g') : null;
	var r = svg ? svg.getBoundingClientRect() : null;
	var tiles = svg ? svg.querySelectorAll('.lpn-basemap image') : [];
	var t = world ? (world.getAttribute('transform') || '') : '(no world layer)';
	var m = /translate\\(([^,]+),([^)]+)\\) scale\\(([^)]+)\\)/.exec(t);
	// A grid of hit tests over the canvas: this is "is the map clickable", asked the way a pointer
	// asks it.
	var hits = {}, ix, iy, el2, name;
	if (r && r.width > 0 && r.height > 0) {
		for (ix = 1; ix <= 5; ix++) {
			for (iy = 1; iy <= 5; iy++) {
				el2 = document.elementFromPoint(Math.round(r.left + r.width * ix / 6), Math.round(r.top + r.height * iy / 6));
				name = el2 ? (el2.id || (el2.getAttribute && el2.getAttribute('class')) || el2.tagName) : '(nothing)';
				hits[name] = (hits[name] || 0) + 1;
			}
		}
	}
	// **THE PIXEL-DERIVED CUSTOM PROPERTIES, AND WHAT THE BROWSER MADE OF THEM.** Every stroke on
	// this map is a screen-pixel size divided by state.s and published here; the CSS carries a
	// FALLBACK in world units for each, so a property that is never published, or published as NaN,
	// draws at that fallback times the scale.
	var link = svg ? svg.querySelector('.lpn-link') : null;
	var props = {}, cs = svg ? getComputedStyle(svg) : null;
	['--lpn-sym', '--lpn-lw', '--lpn-hit', '--lpn-hair'].forEach(function (p) {
		props[p] = cs ? (cs.getPropertyValue(p) || '(unset)').trim() : null;
	});
	return {
		props: props,
		linkStrokePx: link ? getComputedStyle(link).strokeWidth : null,
		rect: r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } : null,
		heightAttr: svg ? svg.getAttribute('height') : null,
		transform: t,
		tx: m ? m[1] : null, ty: m ? m[2] : null, s: m ? m[3] : null,
		tiles: tiles.length,
		tileZooms: Array.prototype.map.call(tiles, function (i) { var u = i.getAttribute('href') || ''; return (u.match(/\\/(\\d+)\\/\\d+\\/\\d+/) || [])[1]; }).filter(function (v, i2, a) { return a.indexOf(v) === i2; }),
		nodes: svg ? svg.querySelectorAll('.lpn-node').length : 0,
		links: svg ? svg.querySelectorAll('.lpn-link').length : 0,
		hits: hits
	};
}())`;

async function scenario(browser, name, lie, opts) {
	const vp = process.env.PROBE_VIEWPORT
		? { width: +process.env.PROBE_VIEWPORT.split('x')[0], height: +process.env.PROBE_VIEWPORT.split('x')[1] }
		: { width: 1400, height: 1000 };
	const context = await browser.newContext(Object.assign({ viewport: vp },
		process.env.PROBE_ZOOM ? { deviceScaleFactor: +process.env.PROBE_ZOOM } : {}));
	const errors = [];
	if (lie) { await context.addInitScript({ content: lie }); }
	const page = await context.newPage();
	page.on('pageerror', (e) => errors.push(String(e.message || e)));
	const out = { name, errors };
	try {
		await page.goto(pageUrl(), { waitUntil: 'load' });
		await page.waitForTimeout(1200);
		// The gallery's first card is Net3 in latitude and longitude, with a street map behind it --
		// what MJH was opening.
		const card = await page.$('.lpn-example-card');
		if (card) { await card.click(); } else { out.note = 'no example card'; }
		await page.waitForTimeout(opts && opts.wait ? opts.wait : 4500);
		out.state = await page.evaluate(READ);
		const shot = await page.screenshot({ type: 'png' });
		if (process.env.PROBE_SHOTS) { fs.writeFileSync(path.join(process.env.PROBE_SHOTS, name + '.png'), shot); }
		const r = out.state.rect;
		if (r && r.w > 4 && r.h > 4) {
			out.colors = dominantColors(readPng(shot), { x: r.x, y: r.y, width: r.w, height: r.h });
		} else {
			out.colors = dominantColors(readPng(shot), { x: 0, y: 0, width: 1400, height: 1000 });
			out.colorNote = 'whole window: the canvas reports no box';
		}
		// Can anything be edited? Place a junction in the middle of the canvas and count.
		const before = out.state.nodes;

		const all = await page.$$('#lpn_toolbar button');
		let junction = null;
		for (const b of all) {
			const t = ((await b.getAttribute('aria-label')) || (await b.textContent()) || '').trim();
			if (/^junction/i.test(t)) { junction = b; break; }
		}
		if (junction) {
			await junction.click().catch(() => {});
			const box = r && r.w > 4 ? r : { x: 0, y: 0, w: 1400, h: 900 };
			await page.mouse.click(Math.round(box.x + box.w * 0.45), Math.round(box.y + box.h * 0.45));
			await page.waitForTimeout(600);
			out.after = await page.evaluate(`document.getElementById('lpn_canvas').querySelectorAll('.lpn-node').length`);
			out.editable = out.after > before;
		}
	} catch (err) {
		out.threw = String(err.message || err);
	}
	await context.close();
	return out;
}

function show(o) {
	const s = o.state || {};
	console.log(`\n=== ${o.name} ===`);
	if (o.threw) { console.log('  THREW: ' + o.threw); }
	if (o.note) { console.log('  note: ' + o.note); }
	console.log(`  canvas rect      ${JSON.stringify(s.rect)}   height attr ${s.heightAttr}`);
	console.log(`  world transform  ${s.transform}`);
	console.log(`  published        ${JSON.stringify(s.props)}`);
	console.log(`  pipe stroke      ${s.linkStrokePx}`);
	console.log(`  scale            ${s.s}`);
	console.log(`  drawn            ${s.nodes} nodes, ${s.links} links, ${s.tiles} tiles at z ${JSON.stringify(s.tileZooms)}`);
	console.log(`  hit tests        ${JSON.stringify(s.hits)}`);
	console.log(`  editable         ${o.editable === undefined ? '(not tried)' : o.editable}` +
		(o.after !== undefined ? `   nodes ${s.nodes} -> ${o.after}` : ''));
	if (o.colors) {
		console.log(`  colours${o.colorNote ? ' (' + o.colorNote + ')' : ''}   ` +
			o.colors.map(c => `${c.color} ${(c.share * 100).toFixed(0)}%`).join('  '));
		const top = o.colors[0];
		if (top && isBlue(top.color) && top.share > 0.5) {
			console.log(`  ** A COMPLETELY BLUE MAP: ${top.color} covers ${(top.share * 100).toFixed(0)}% of the canvas.`);
		}
	}
	if (o.errors.length) { console.log('  page errors      ' + o.errors.slice(0, 4).join(' | ')); }
}

(async function main() {
	const args = process.argv.slice(2);
	const useChromium = args.includes('--chromium');
	const wanted = args.filter(a => !a.startsWith('--'));
	const names = wanted.length ? wanted : Object.keys(LIES);
	await startServer();
	let browser;
	if (useChromium) {
		const { launchBrowser } = require('./lib/env');
		browser = await launchBrowser(playwright);
	} else {
		const exe = findFirefox();
		if (!exe) { throw new Error('No Playwright Firefox found: npx playwright-core install firefox'); }
		const prefs = Object.assign({}, LIBREWOLF_PREFS);
		if (process.env.PROBE_PREFS) {
			for (const kv of process.env.PROBE_PREFS.split(',')) {
				const [k, v] = kv.split('=');
				prefs[k] = v === 'true' ? true : v === 'false' ? false : (isNaN(+v) ? v : +v);
			}
		}
		browser = await playwright.firefox.launch({ executablePath: exe, firefoxUserPrefs: prefs });
	}
	console.log(`engine: ${useChromium ? 'chromium' : 'firefox (LibreWolf prefs)'}`);
	try {
		for (const n of names) {
			if (!(n in LIES)) { console.log(`(no scenario "${n}")`); continue; }
			show(await scenario(browser, n, LIES[n]));
		}
	} finally {
		await browser.close();
		stopServer();
	}
}()).catch((e) => { console.error(e); stopServer(); process.exit(1); });
