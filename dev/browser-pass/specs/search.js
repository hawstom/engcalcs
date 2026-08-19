// §29 — Search the map by place name, and the consent gate in front of it (ROADMAP Task 437).
//
// Tom, 2026-08-18: *"Search-by-name is Task 437: Do it and put another limited consent form on the
// first use of search."* The gate is the feature, so most of what is checked here is the gate.
//
// **THE GEOCODER IS NEVER CALLED.** Every request to nominatim.openstreetmap.org is intercepted at
// the route level and answered from a canned body, for three reasons and each is sufficient on its
// own: a spec that fails when a third party is slow is a spec that gets muted; a test loop against
// somebody's free service is exactly the bulk querying its usage policy forbids; and the failure
// modes that matter most here — offline, rate-limited, nothing found — cannot be produced on demand
// from a working server at all. dev/lpn-spike/search-harness.js is where the REAL endpoint is
// proved to answer, once, opt-in.
//
// The stub is the same shape of lie as lib/pickers.js's: it replaces the far side of the wire and
// nothing else. Every line of the page's own code — the gate, the cookie, the parser, the choice
// prompt, the travel, the notice — is the production path.

const { Session } = require('../lib/session');

exports.title = '29. Search by place name';

const SEARCH_ROW = 'Search for a place by name…';
const GOTO_ROW = 'Go to a latitude and longitude…';
const GEOCODER = 'nominatim.openstreetmap.org';

// Nominatim's own answer shape: lat and lon are STRINGS in jsonv2, which is the single most likely
// thing for a rewrite to get wrong.
const PETALUMA = [{ lat: '38.2325829', lon: '-122.636465',
	display_name: 'Petaluma, Sonoma County, California, United States' }];
const AMBIGUOUS = [
	{ lat: '39.7990', lon: '-89.6440', display_name: 'Springfield, Sangamon County, Illinois' },
	{ lat: '42.1015', lon: '-72.5898', display_name: 'Springfield, Hampden County, Massachusetts' },
	{ lat: '37.2090', lon: '-93.2923', display_name: 'Springfield, Greene County, Missouri' }
];

async function canvasRect(a) {
	return a.page.evaluate(() => {
		const b = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: b.x, y: b.y, w: b.width, h: b.height };
	});
}
// Where the MIDDLE of the map is, read the way a user reads it — the same trick specs/goto.js uses.
async function centre(a) {
	const r = await canvasRect(a);
	await a.page.mouse.move(r.x + r.w / 2, r.y + r.h / 2);
	await a.settle(150);
	const text = await a.page.evaluate(() => document.getElementById('lpn_coords').textContent);
	const m = text.match(/Longitude:\s*(-?[\d.]+)\s+Latitude:\s*(-?[\d.]+)/);
	return m ? { lon: +m[1], lat: +m[2], text } : { text };
}
async function cookie(a) {
	return a.page.evaluate(() => {
		const m = document.cookie.match(/(?:^|;\s*)ec_geosearch=([^;]*)/);
		return m ? decodeURIComponent(m[1]) : '';
	});
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	// The stub's dial. A spec sets `answer` to the next thing the geocoder should do, and reads
	// `calls` to prove a request was — or crucially was NOT — sent.
	const wire = { answer: { body: PETALUMA }, calls: [] };
	try {
		await a.page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
		await a.page.route(/nominatim\.openstreetmap\.org/, (route) => {
			const req = route.request();
			wire.calls.push({ url: req.url(), referer: req.headers()['referer'] || '' });
			const ans = wire.answer;
			if (ans.abort) { return route.abort(); }
			return route.fulfill({
				status: ans.status || 200,
				contentType: 'application/json',
				body: ans.raw !== undefined ? ans.raw : JSON.stringify(ans.body || [])
			});
		});

		await a.goto();
		await a.dismissGallery();

		// ---- 1. where the row is, and is not ---------------------------------------------------
		let rows = (await a.menuRows('view')).map(r => r.label);
		report.ok(!rows.includes(SEARCH_ROW),
			'an XY project has no Search row — its x and y have no place on the Earth',
			'hidden rather than greyed, exactly as the Go to… row is');

		await a.newGeoProject();
		await a.settle(500);
		rows = (await a.menuRows('view')).map(r => r.label);
		report.ok(rows.includes(SEARCH_ROW), 'a lat/lon project offers it on the View menu');
		report.ok(rows.includes(GOTO_ROW),
			'...beside Go to a latitude and longitude, not merged with it',
			'two commands, two kinds of input, two ways of failing');

		const home = await centre(a);

		// ---- 2. the gate is asked BEFORE anything is typed or sent -----------------------------
		// Order is the whole design: nobody should type a place name and only then learn where it
		// was about to go.
		a.answerConfirmsWith(false);
		a.answerPromptWith(null);
		await a.menuClick(SEARCH_ROW, 'view');
		await a.settle(400);
		const ask = a.dialogs.find(d => d.type === 'confirm' && d.message.indexOf(GEOCODER) >= 0);
		report.ok(!!ask, 'the first use asks its own question before anything is sent');
		report.has(ask ? ask.message : '', GEOCODER,
			'...and names the host that would receive it, in full');
		report.has(ask ? ask.message : '', 'what you typed',
			'...and says what makes this different from the street map pictures');
		report.has(ask ? ask.message : '', 'IP address', '...and that they also receive an IP address');
		report.has(ask ? ask.message : '', 'Go to a latitude and longitude',
			'...and that refusing costs nothing else on the page');

		// ---- 3. refusing --------------------------------------------------------------------
		report.eq(wire.calls.length, 0, 'a refusal sends NOTHING — the request is never made');
		report.eq(await cookie(a), '',
			'...and stores nothing on the device either: there is no such thing as a stored NO');
		report.has(await a.notice(), 'Place-name search is off',
			'...and says so, rather than doing nothing at all');
		let at = await centre(a);
		report.ok(at.lat === home.lat && at.lon === home.lon, '...and the map did not move');
		// Everything else still works, which is the promise the ask itself makes.
		a.answerPromptWith('51.5 -0.12');
		await a.menuClick(GOTO_ROW, 'view');
		await a.settle(400);
		at = await centre(a);
		report.ok(Math.abs(at.lat - 51.5) < 0.01 && Math.abs(at.lon + 0.12) < 0.01,
			'...and Go to a latitude and longitude still works exactly as before', at.text);

		// ---- 4. asked again, because a no was not stored ---------------------------------------
		a.answerConfirmsWith(true);
		a.answerPromptWith('Petaluma, California');
		const dialogsBefore = a.dialogs.length;
		await a.menuClick(SEARCH_ROW, 'view');
		await a.settle(900);
		const asked = a.dialogs.slice(dialogsBefore).filter(d => d.type === 'confirm');
		report.eq(asked.length, 1,
			'somebody who refused and then chose Search again is asked again — they asked for it');
		report.eq(wire.calls.length, 1, '...and saying yes sends exactly one request');
		report.has(wire.calls[0] ? wire.calls[0].url : '', 'q=Petaluma',
			'...carrying the words that were typed, and a limit', wire.calls[0] && wire.calls[0].url);
		// The usage policy asks for a Referer or a User-Agent that identifies the APPLICATION. A
		// browser cannot set User-Agent at all, so the Referer is the whole of our compliance with
		// that clause and it must not be empty.
		report.ok(/hawsedc\.com|localhost|127\.0\.0\.1/.test(wire.calls[0] ? wire.calls[0].referer : ''),
			'...and a Referer that identifies the application, which is the User-Agent substitute',
			wire.calls[0] && wire.calls[0].referer);
		report.has(await cookie(a), '1.', 'a YES is remembered, and it is the only thing stored');

		at = await centre(a);
		report.ok(Math.abs(at.lat - 38.2326) < 0.01 && Math.abs(at.lon + 122.6365) < 0.01,
			'the single result centres the map on it', at.text);
		report.has(await a.notice(), 'Petaluma', 'the notice names where it went');
		report.has(await a.notice(), '© OpenStreetMap contributors',
			'...and carries the ODbL credit with the result it belongs to');
		report.has(await a.notice(), 'Nominatim', '...naming the geocoder as well as the data');

		// ---- 5. and never asked again ----------------------------------------------------------
		wire.answer = { body: AMBIGUOUS };
		await a.settle(1100); // one search a second, which is the policy
		const before5 = a.dialogs.length;
		a.answerPromptWith('Springfield');
		await a.menuClick(SEARCH_ROW, 'view');
		await a.settle(600);
		report.eq(a.dialogs.slice(before5).filter(d => d.type === 'confirm').length, 0,
			'a visitor who said yes is never asked again — nagging a yes is the one bad direction');

		// ---- 6. an ambiguous answer is a CHOICE, never a guess ---------------------------------
		// **TWO PROMPTS IN A ROW, so window.prompt is answered from a queue for these gestures** —
		// the same replacement specs/goto.js uses, and for the same reason. Session.answerPromptWith
		// holds ONE answer, and the second prompt here arrives from a resolved fetch a few
		// milliseconds later; a spec cannot get between them. Everything above this line used the
		// real dialog.
		async function promptQueue(answers) {
			await a.page.evaluate((list) => {
				window.__realPrompt = window.prompt;
				window.__asked = [];
				let i = 0;
				window.prompt = (msg, dflt) => {
					window.__asked.push({ msg: msg, dflt: dflt });
					return i < list.length ? list[i++] : null;
				};
			}, answers);
		}
		async function promptsSeen() {
			return a.page.evaluate(() => {
				const seen = window.__asked || [];
				if (window.__realPrompt) { window.prompt = window.__realPrompt; }
				return seen;
			});
		}

		await a.settle(1100);
		await promptQueue(['Springfield', 'Springfield']); // the second answer is not a number
		await a.menuClick(SEARCH_ROW, 'view');
		await a.settle(900);
		let asks = await promptsSeen();
		const chooser = asks.find(d => d.msg.indexOf('Illinois') >= 0);
		report.ok(!!chooser, 'three Springfields produce a numbered choice, not a silent first pick');
		report.has(chooser ? chooser.msg : '', '© OpenStreetMap contributors',
			'...and the credit is shown with the list too');
		report.ok(chooser ? chooser.dflt === '1' : false,
			'...offered with 1 filled in, because a list of three is usually answered "the first one"');
		report.has(await a.notice(), 'not one of the numbers',
			'...and an answer that is not one of the numbers is refused in words rather than guessed at');

		await a.settle(1100);
		await promptQueue(['Springfield, Massachusetts', '2']);
		await a.menuClick(SEARCH_ROW, 'view');
		await a.settle(900);
		await promptsSeen();
		at = await centre(a);
		report.ok(Math.abs(at.lat - 42.1015) < 0.05 && Math.abs(at.lon + 72.5898) < 0.05,
			'choosing 2 goes to the second one', at.text);

		// ---- 7. the rate limit, in the page rather than in a comment ---------------------------
		// Back to back with no settle between them: the first is allowed, the second is inside the
		// same second and must be refused. A DIFFERENT query, deliberately — an identical one is
		// answered from memory and never reaches the wire at all, which would prove nothing here.
		wire.answer = { body: PETALUMA }; // one hit, so no choice prompt confuses the queue
		await a.settle(1100);
		const callsBefore7 = wire.calls.length;
		await promptQueue(['Sonoma', 'Napa Valley']);
		await a.menuClick(SEARCH_ROW, 'view');
		await a.menuClick(SEARCH_ROW, 'view');
		await a.settle(900);
		await promptsSeen();
		report.eq(wire.calls.length - callsBefore7, 1,
			'a second search inside the same second is refused rather than queued',
			'the policy is an absolute maximum of one request per second');
		report.has(await a.notice(), 'One search a second', '...and says why, rather than doing nothing');

		// ---- 8. every way it fails says something DIFFERENT ------------------------------------
		// Offline. This is the one that must never hang, and must never suggest the whole page is
		// broken — a lat/lon project still opens, draws and solves with no network at all.
		wire.answer = { abort: true };
		await a.settle(1100);
		const stood = await centre(a);
		a.answerPromptWith('Petaluma, Sonoma');
		await a.menuClick(SEARCH_ROW, 'view');
		await a.settle(1200);
		report.has(await a.notice(), 'may be offline', 'a dead network says "you may be offline"');
		report.has(await a.notice(), 'works without it',
			'...and that the rest of the page is unaffected — the offline promise, in words');
		at = await centre(a);
		report.ok(at.lat === stood.lat && at.lon === stood.lon, '...and the map did not move');

		// Rate limited by the service itself.
		wire.answer = { status: 429, raw: 'slow down' };
		await a.settle(1100);
		a.answerPromptWith('Napa');
		await a.menuClick(SEARCH_ROW, 'view');
		await a.settle(1200);
		report.has(await a.notice(), 'slow down',
			'an HTTP 429 is reported as being asked to slow down, not as "not found"');

		// Nothing found. A real, well-formed, empty answer.
		wire.answer = { body: [] };
		await a.settle(1100);
		a.answerPromptWith('qqzzxx nowhere at all');
		await a.menuClick(SEARCH_ROW, 'view');
		await a.settle(1200);
		report.has(await a.notice(), 'Nothing found',
			'an empty result set is "nothing found", and quotes back what was asked for');
		report.has(await a.notice(), 'qqzzxx nowhere at all', '...in the visitor\'s own words');

		// Something that is not JSON at all. A third party can always change its mind.
		wire.answer = { raw: '<html>maintenance</html>' };
		await a.settle(1100);
		a.answerPromptWith('Sebastopol');
		await a.menuClick(SEARCH_ROW, 'view');
		await a.settle(1200);
		report.has(await a.notice(), 'could not read',
			'an answer that is not JSON is reported as unreadable, not as nothing found');

		// A well-formed answer whose coordinates are nonsense. This is the dangerous one: it must
		// come out as "nothing found" and never as a plausible wrong place.
		wire.answer = { body: [{ lat: 'north', lon: 'west', display_name: 'Somewhere' }] };
		await a.settle(1100);
		const kept = await centre(a);
		a.answerPromptWith('Cotati');
		await a.menuClick(SEARCH_ROW, 'view');
		await a.settle(1200);
		report.has(await a.notice(), 'Nothing found',
			'a result with an unusable coordinate is dropped, not flown to');
		at = await centre(a);
		report.ok(at.lat === kept.lat && at.lon === kept.lon, '...and the map stayed where it was');

		// ---- 9. the second door: the placement bar ---------------------------------------------
		// The carry stage IS the moment somebody needs to travel, so both commands are on the bar.
		wire.answer = { body: PETALUMA };
		await a.newProject();
		await a.dismissGallery();
		await a.makeEdit();
		await a.menuClick('Convert to lat/lon…');
		await a.settle(800);
		report.ok(await a.page.evaluate(() => {
			const b = document.getElementById('lpn_georef_search');
			return !!b && getComputedStyle(b).display !== 'none';
		}), 'step 1 of the placement bar carries a Search by name… button too');
		report.ok(await a.page.evaluate(() => {
			const s = document.getElementById('lpn_georef_search'), g = document.getElementById('lpn_georef_goto');
			return !!s && !!g && g.nextElementSibling === s;
		}), '...immediately beside Go to…, because they answer the same need two ways');

		// ---- 10. Clear everything means everything ---------------------------------------------
		// The confirm on that button promises "all settings", and a stored yes is a setting by any
		// reading. A key it leaves behind makes its own sentence false — which has happened once
		// already (dev/cookie-storage-inventory.md §3).
		await a.newGeoProject();
		await a.settle(400);
		report.has(await cookie(a), '1.', 'the stored yes is still there before the wipe');
		a.answerConfirmsWith(true);
		await a.toolbarClick('Settings');
		await a.settle(300);
		const wiped = await a.page.evaluate(() => {
			const b = Array.from(document.querySelectorAll('#lpn_settings_box button'))
				.find(x => /Erase everything on this page/.test(x.textContent));
			if (b) { b.click(); }
			return !!b;
		});
		report.ok(wiped, 'the Settings box carries the Erase everything button this check is about');
		await a.settle(2000);
		report.eq(await cookie(a), '',
			'Erase everything on this page removes the place-name consent along with the rest');

		report.ok(a.errors.length === 0, 'no uncaught page errors anywhere in this section',
			a.errors.join(' | ').slice(0, 200));
	} finally {
		await a.close();
	}
};
