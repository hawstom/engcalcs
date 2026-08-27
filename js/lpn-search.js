// lpn-search.js -- SEARCH THE MAP BY PLACE NAME, and the consent gate that stands in front of it
// (ROADMAP Task 437).
//
// Tom, 2026-08-18, ruling on the only question this feature really had: *"Search-by-name is Task
// 437: Do it and put another limited consent form on the first use of search."*
//
// **WHY A SECOND CONSENT, WHEN THE MAP ALREADY TALKS TO OPENSTREETMAP.** dev/geographic-projects.md
// §4 records that the tile server is the ONLY host this page talks to, and
// dev/browser-pass/specs/basemap.js asserts it. A geocoder breaks that, and it breaks it in a
// materially worse way than the tiles do: **a tile request says where the user is LOOKING; a search
// request says what the user TYPED.** That is a different kind of disclosure, so it gets a different
// question, asked at the moment it first matters and never before.
//
// THE GATE IS DELIBERATELY NOT THE SITE BANNER. Folding this into consent_body would make that
// sentence describe two unrelated purposes, would need 26 retranslations, and would force an
// EC_CONSENT_VERSION bump that re-asks every visitor about analytics they already answered -- the
// expensive failure CLAUDE.md names by name. This is its own record, its own version and its own
// ask, and the site banner is untouched.
//
// **ONLY A YES IS EVER STORED.** A refusal writes nothing at all, which is both the better privacy
// answer and what makes the exemption test trivial: the one thing on the device is the answer the
// visitor gave in order to get the service they explicitly asked for. The cost is that somebody who
// refuses and later chooses Search again is asked again -- which is not nagging, because they just
// asked for the feature. Nagging is asking somebody who already said yes.
//
// **NOTHING ELSE IS STORED, ANYWHERE.** No query history, no result cache, no localStorage, no
// IndexedDB. The repeated-query guard below lives in a plain variable and dies with the page. That
// is the tiles' rule (dev/geographic-projects.md §4) applied with more force, because here the
// thing that would be cached is what the user typed.
//
// ---------------------------------------------------------------------------------------------
// THE NOMINATIM USAGE POLICY (https://operations.osmfoundation.org/policies/nominatim/), clause by
// clause, and what in this file honours it. Read this before changing anything below.
//
//   "No heavy uses (an absolute maximum of 1 request per second)."
//       MIN_INTERVAL_MS, enforced on every send. A search that arrives inside the second is REFUSED
//       IN WORDS rather than queued -- a queue is how one impatient user becomes a burst.
//
//   "Provide a valid HTTP Referer or User-Agent identifying the application (stock User-Agents as
//    set by http libraries will not do)."
//       A browser CANNOT set User-Agent; it is a forbidden header and fetch() drops it silently. So
//       we satisfy the OTHER limb, deliberately: `referrerPolicy: 'unsafe-url'` plus an explicit
//       same-origin `referrer` of this page's own path, so Nominatim receives
//       `https://hawsedc.com/engcalcs/Looped-Network.php` -- the PAGE, which is what identifies the
//       application -- rather than the bare origin a default cross-origin policy would send. It has
//       to be same-origin: a cross-origin `referrer` is discarded by the browser and the page URL
//       is used anyway, so hardcoding APP_URL there would have been a comment pretending to be
//       code. Building it from location also drops any query string of ours, which the raw page URL
//       under 'unsafe-url' would otherwise carry along.
//
//   "Auto-complete search -- This is not yet supported by Nominatim and you must not implement
//    such a service."
//       **THIS IS WHY THERE IS NO TYPEAHEAD**, and it is a design constraint rather than an
//       omission. One request per explicit submit, never per keystroke. Anybody adding an input
//       with a keyup handler here is shipping a policy violation.
//
//   "Systematic queries" / "Scraping of details" / "Reselling of geocoding results"
//       None of them: one query, typed by one person, to move one map.
//
//   "limit your requests to a single thread"
//       inFlight. A second search while one is running is refused, not stacked.
//
//   "Results must be cached on your side. Clients sending repeatedly the same query may be
//    classified as faulty and blocked."
//       **THIS IS THE ONE CLAUSE WE CANNOT MEET AS WRITTEN, AND SAYING SO IS BETTER THAN
//       PRETENDING.** A durable cache means either a server proxy (we have none -- this suite is
//       entirely client-side) or storage on the visitor's device, which is the exact thing the
//       consent above exists to avoid and would need its own answer to the exemption test. We
//       decline both and instead cap the volume at the source: one request per deliberate user
//       action, at most one a second, and an immediately repeated identical query answered from the
//       in-memory `last` below without a second request -- which is what the clause's own second
//       sentence is actually asking for. The clause sits in the BULK section, and a page issuing a
//       handful of geocodes per session is not what it is written about.
//
//   "Clearly display attribution as suitable for your medium... ODbL."
//       CREDIT, untranslated, on every screen that shows a result -- the choice list and the
//       arrival notice. The permanent ODbL data credit is already on the map itself
//       (#lpn_basemap_credit), and it is the same data. Never a language key: a translated legal
//       credit is a different credit.
// ---------------------------------------------------------------------------------------------
//
// **THE OFFLINE PROMISE IS UNTOUCHED.** With no network a lat/lon project still opens, still draws
// and still solves. Search is the only thing missing, and it says so in words rather than hanging.

(function (root) {
	'use strict';

	var EC = root.EngCalcs = root.EngCalcs || {};

	// ============================================================================================
	// PURE: values in, values out. No DOM, no network, no page. dev/lpn-spike/search-harness.js
	// runs everything in this section in Node with no browser at all.
	// ============================================================================================

	var HOST = 'https://nominatim.openstreetmap.org';
	// One request per second, absolute, from the policy. Not a guess and not tunable.
	var MIN_INTERVAL_MS = 1000;
	// Five is enough to disambiguate "Springfield" and few enough to read in a prompt. The policy's
	// concern is request COUNT, not result count, so asking for five once beats asking for one
	// five times.
	var RESULT_LIMIT = 5;
	// A request that never answers is indistinguishable from a page that has hung. Fifteen seconds
	// is long enough for a slow tether and short enough that "you may be offline" is still the
	// useful thing to say.
	var TIMEOUT_MS = 15000;
	// The credit, untranslated, exactly as the OSM attribution guidelines and the ODbL ask. Same
	// reasoning as #lpn_basemap_credit in Looped-Network.php: it names projects rather than
	// describing a control, and it must read the same on all 27 languages of this page.
	var CREDIT = 'Geocoding by Nominatim, data © OpenStreetMap contributors';
	// What the Referer says we are, in production. Recorded here so a test can assert what the
	// policy note above claims; the value actually sent is built from location (see appReferrer),
	// because only a SAME-ORIGIN referrer is honoured.
	var APP_URL = 'https://hawsedc.com/engcalcs/Looped-Network.php';
	function appReferrer() {
		var loc = root.location;
		return (loc && loc.origin) ? loc.origin + loc.pathname : APP_URL;
	}

	/**
	 * The one place a query becomes a URL.
	 *
	 * `format=jsonv2` because it is the documented stable shape; `limit` because an unbounded list
	 * is both ruder and unreadable. NOTHING ELSE IS SENT -- no email, no viewbox, no
	 * accept-language. A viewbox would be a small kindness (results near where you are looking) and
	 * it is declined on purpose: it would tell the geocoder where the user is looking IN ADDITION
	 * to what they typed, which is precisely the extra disclosure this whole file is built to avoid.
	 */
	EC.lpnSearchUrl = function (query) {
		return HOST + '/search?format=jsonv2&limit=' + RESULT_LIMIT +
			'&q=' + encodeURIComponent(String(query == null ? '' : query).trim());
	};

	/**
	 * Nominatim's answer into the three things this page needs, and nothing else.
	 *
	 * Defensive about EVERY field, because this is a third party's JSON: a malformed or changed
	 * response must produce "nothing found", never a NaN centre that flies the map to the middle of
	 * the Atlantic. lat/lon arrive as STRINGS in jsonv2 and are parsed here, once.
	 */
	EC.lpnSearchParse = function (data) {
		var out = [], i, r, lat, lon;
		if (!data || !data.length) { return out; }
		for (i = 0; i < data.length; i++) {
			r = data[i] || {};
			lat = parseFloat(r.lat);
			lon = parseFloat(r.lon);
			if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) { continue; }
			out.push({
				lat: lat, lon: lon,
				label: String(r.display_name || r.name || (lat + ', ' + lon))
			});
		}
		return out;
	};

	/**
	 * How long, in milliseconds, until the policy would allow another request. 0 means now.
	 *
	 * Written as arithmetic rather than a timer so the harness can check the rule itself instead of
	 * waiting a real second to watch it happen.
	 */
	EC.lpnSearchWait = function (lastAt, now) {
		if (!lastAt) { return 0; }
		var left = MIN_INTERVAL_MS - (now - lastAt);
		return left > 0 ? left : 0;
	};

	/** The numbers and strings the policy notes above are about, so a test can assert them. */
	EC.lpnSearchPolicy = function () {
		return { host: HOST, minIntervalMs: MIN_INTERVAL_MS, limit: RESULT_LIMIT,
			timeoutMs: TIMEOUT_MS, credit: CREDIT, appUrl: APP_URL };
	};

	// ============================================================================================
	// THE CONSENT RECORD. One cookie, written only on a yes.
	// ============================================================================================

	// Mirrors ec_consent's shape -- "<state>.<unix-ts>.<policy-version>" -- deliberately, so a
	// person reading a cookie jar sees one convention rather than two. The defaults here are the
	// fallbacks for a page that has not supplied them; lib/Consent.lib.php is the source of truth
	// and Looped-Network.php hands the values over in pageConfig.
	var COOKIE_DEFAULT = 'ec_geosearch', VERSION_DEFAULT = '1', DAYS_DEFAULT = 365;

	function cfg(key, fallback) {
		var pc = EC.pageConfig || {};
		return (pc[key] === undefined || pc[key] === null || pc[key] === '') ? fallback : pc[key];
	}
	function cookieName() { return String(cfg('lpn_geosearch_cookie', COOKIE_DEFAULT)); }
	function cookieVersion() { return String(cfg('lpn_geosearch_version', VERSION_DEFAULT)); }
	function cookieDays() { return +cfg('lpn_geosearch_days', DAYS_DEFAULT) || DAYS_DEFAULT; }

	function readCookie() {
		if (typeof document === 'undefined' || !document.cookie) { return ''; }
		var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + cookieName() + '=([^;]*)'));
		return m ? decodeURIComponent(m[1]) : '';
	}

	/**
	 * True only for a yes given for THIS version of the ask.
	 *
	 * Version-pinned for the same reason ec_consent's middle answer is: if what we send, or who we
	 * send it to, ever materially changes, bumping the version re-asks exactly the people who said
	 * yes to the old thing -- and nobody else, and without touching the site-wide banner.
	 */
	EC.lpnSearchConsented = function () {
		var parts = readCookie().split('.');
		return parts[0] === '1' && parts[2] === cookieVersion();
	};

	function recordConsent() {
		if (typeof document === 'undefined') { return; }
		var value = '1.' + Math.floor(Date.now() / 1000) + '.' + cookieVersion();
		var expires = new Date(Date.now() + cookieDays() * 86400000).toUTCString();
		var secure = (root.location && root.location.protocol === 'https:') ? '; Secure' : '';
		document.cookie = cookieName() + '=' + value + '; expires=' + expires +
			'; path=/; SameSite=Lax' + secure;
	}

	/**
	 * Withdrawal. Called by Settings > Clear everything, whose confirm promises "all settings" --
	 * a stored yes is a setting by any reading, and a key that button leaves behind makes its own
	 * sentence false. dev/cookie-storage-inventory.md records that this is the only remover.
	 */
	EC.lpnSearchForget = function () {
		if (typeof document === 'undefined') { return; }
		document.cookie = cookieName() + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
	};

	// ============================================================================================
	// THE COMMAND. Everything below needs a page.
	// ============================================================================================

	// The seam handed over by js/looped-network.js. Nothing here reaches into that file.
	var seam = null;
	// Page-lifetime only, never stored: the rate limiter's clock, the single-thread flag, and the
	// one remembered query/answer pair that keeps a repeated identical search off the wire.
	var lastAt = 0, inFlight = false, last = null;

	function pc() { return EC.pageConfig || {}; }
	function notice(text) { if (seam && seam.notice) { seam.notice(text); } }

	// Every visitor-facing string in this file is an English literal in the `pc.key || '...'`
	// position. lib/lang.ec.en.php belongs to the translation track, so the keys do not exist yet
	// and the literal is what ships; the moment the keys and their pageConfig entries land, every
	// one of these lights up in 27 languages with no edit here. Same pattern the placement bar's
	// own step strings already use.
	function t(key, english) { return pc()[key] || english; }

	// THE ASK ITSELF. Long on purpose -- it is the only thing the visitor gets to decide from, and
	// the three facts that matter are all in it: WHO receives it, WHAT they receive, and that
	// saying no costs them nothing else on the page. It also says what is remembered and what is
	// not, because "we remember a yes and store nothing on a no" is a fact a person may reasonably
	// want before answering.
	//
	// A NATIVE confirm(), not a styled box, and that is a decision rather than a shortcut: its two
	// buttons cannot be styled by us at all, so the coloured-Accept-beside-grey-Reject dark pattern
	// that lib/Consent.lib.php spends a paragraph avoiding is not merely avoided here, it is
	// impossible. Cancel and Escape both mean no. This page already asks its other questions the
	// same way (Go to a latitude and longitude, Clear everything).
	//
	// ONE KEY PER PARAGRAPH, joined here (Task 507). A $ec_lang value is a single line by
	// construction, so the alternative was a line-break placeholder inside one long value; four
	// short keys read better to a translator and keep the ORDER of the paragraphs ours.
	function consentText() {
		return [
			t('lpn_search_consent_1',
				'Search by place name sends the words you type to nominatim.openstreetmap.org, the ' +
				'OpenStreetMap Foundation’s free place-name service.'),
			t('lpn_search_consent_2',
				'This is a different service from the street map pictures behind your project. The ' +
				'pictures only say where you are looking. A search says what you typed. They will ' +
				'receive your search words and your IP address. We send nothing else, and we keep no ' +
				'record of your searches.'),
			t('lpn_search_consent_3', 'May we use it?'),
			t('lpn_search_consent_4',
				'If you say no, everything else on this page keeps working exactly as it does now, ' +
				'including Go to a latitude and longitude. We remember a yes so that we need not ask ' +
				'again. A no is not stored at all.')
		].join('\n\n');
	}

	// THE VIEW-MENU ROW'S OWN WORDS, exported rather than read by js/looped-network.js.
	//
	// That file could perfectly well write `pc.lpn_search_menu || '...'` itself, and this is better
	// for two reasons: every string this feature shows then lives in one file, and the row's TIP is
	// the one place a visitor can learn what the command will do BEFORE choosing it, so it belongs
	// beside the consent text it foreshadows rather than three thousand lines away from it.
	EC.lpnSearchMenuLabel = function () {
		return t('lpn_search_menu', 'Search for a place by name…');
	};
	EC.lpnSearchMenuTip = function () {
		return t('lpn_search_tip', 'Find a town, a street or a landmark by name and move the map ' +
			'to it. The first use asks your permission, because the words you type go to ' +
			'OpenStreetMap’s place-name service.');
	};

	/** The gate. Returns true if we may send. Asks at most once per invocation. */
	function mayWeSend() {
		if (EC.lpnSearchConsented()) { return true; }
		if (!root.confirm || !root.confirm(consentText())) {
			notice(t('lpn_search_refused',
				'Place-name search is off, and nothing was sent. You can still use Go to a ' +
				'latitude and longitude.'));
			return false;
		}
		recordConsent();
		return true;
	}

	/** One result, or a choice, or an honest refusal. Never a silent no-op. */
	function chooseFrom(results) {
		if (results.length === 1) { return results[0]; }
		var lines = [], i;
		for (i = 0; i < results.length; i++) { lines.push((i + 1) + '. ' + results[i].label); }
		var text = t('lpn_search_choose', 'More than one place matches. Which one?') + '\n\n' +
			lines.join('\n') + '\n\n' + CREDIT;
		var v = root.prompt(text, '1');
		if (v === null) {
			notice(t('lpn_search_nochoice', 'Nothing chosen, so the map has not moved.'));
			return null;
		}
		var n = parseInt(String(v).replace(/[^0-9]/g, ''), 10);
		if (!(n >= 1 && n <= results.length)) {
			notice(t('lpn_search_badchoice', 'That is not one of the numbers in the list.'));
			return null;
		}
		return results[n - 1];
	}

	function arrive(hit) {
		if (seam && seam.goTo) { seam.goTo({ lat: hit.lat, lon: hit.lon }); }
		// The credit rides with the result it belongs to, which is what "as suitable for your
		// medium" means when the medium is a notice box over a map.
		notice(hit.label + ' — ' + CREDIT);
	}

	function finish(results, query) {
		if (!results.length) {
			notice(t('lpn_search_none', 'Nothing found for that name.') +
				' “' + query + '”');
			return;
		}
		var hit = chooseFrom(results);
		if (hit) { arrive(hit); }
	}

	/**
	 * The request. Its failures are the feature, so every one of them says something different:
	 * offline, rate-limited, timed out, unreadable and nothing-found call for four different next
	 * actions, and a single "search failed" would hide which one this is.
	 */
	function send(query) {
		var controller = (typeof AbortController === 'function') ? new AbortController() : null;
		var timer = root.setTimeout(function () { if (controller) { controller.abort(); } }, TIMEOUT_MS);
		inFlight = true;
		lastAt = Date.now();
		notice(t('lpn_search_working', 'Searching…'));
		root.fetch(EC.lpnSearchUrl(query), {
			// See the policy block at the top: this is the User-Agent substitute, and it is the
			// half of the requirement a browser is able to meet.
			referrer: appReferrer(),
			referrerPolicy: 'unsafe-url',
			// No cookies, ever. There is nothing of ours for them to hold and nothing of theirs
			// we want held.
			credentials: 'omit',
			signal: controller ? controller.signal : undefined
		}).then(function (res) {
			if (res.status === 429 || res.status === 503) { throw { kind: 'rate', status: res.status }; }
			if (!res.ok) { throw { kind: 'http', status: res.status }; }
			return res.json();
		}).then(function (data) {
			var results = EC.lpnSearchParse(data);
			last = { query: query, results: results };
			finish(results, query);
		}).catch(function (err) {
			if (err && err.kind === 'rate') {
				notice(t('lpn_search_rate',
					'The place-name service is asking us to slow down. Wait a minute and try again.'));
			} else if (err && err.kind === 'http') {
				notice(t('lpn_search_http', 'The place-name service answered with an error.') +
					' (HTTP ' + err.status + ')');
			} else if (err && err.name === 'AbortError') {
				notice(t('lpn_search_timeout',
					'The place-name service did not answer in time. Everything else on this page ' +
					'works without it.'));
			} else if (err instanceof SyntaxError) {
				notice(t('lpn_search_unreadable',
					'The place-name service answered with something this page could not read.'));
			} else {
				notice(t('lpn_search_offline',
					'We could not reach the place-name service. You may be offline. Everything ' +
					'else on this page works without it, including Go to a latitude and longitude.'));
			}
		}).then(function () {
			inFlight = false;
			root.clearTimeout(timer);
		});
	}

	/**
	 * The whole command, and the ONLY entry point js/looped-network.js knows about.
	 *
	 * Order matters and is not arbitrary: the consent question comes BEFORE the search box, so
	 * nobody types a place name and only then learns where it was about to go.
	 */
	EC.lpnSearchOpen = function () {
		if (!seam || (seam.isGeo && !seam.isGeo())) { return; }
		if (inFlight) {
			notice(t('lpn_search_busy', 'A search is already running. Wait for it to answer.'));
			return;
		}
		if (!mayWeSend()) { return; }
		var v = root.prompt(t('lpn_search_prompt',
			'Search for a place by name. A town, a street, a landmark — for example: ' +
			'Petaluma, California'), '');
		if (v === null) { return; }
		EC.lpnSearchRun(v, true);
	};

	/**
	 * The same command with the words already in hand -- **the New-project box's search field**
	 * (ROADMAP Task 477), where the person has typed the place before the project exists.
	 *
	 * **IT IS A SECOND DOOR, NEVER A SECOND ENGINE.** The consent gate, the one-a-second rule, the
	 * repeated-query memory, the timeout and the chooser are all on this side of it, so the wizard
	 * cannot acquire a quieter version of any of them by having its own box. What the wizard owns is
	 * the TEXT; everything that touches the network is here.
	 *
	 * `gated` says whether the caller has already been through mayWeSend(). The wizard has not, so
	 * it passes nothing and is asked here -- still BEFORE anything is sent, which is the order
	 * lpnSearchOpen() is careful about for the same reason.
	 */
	EC.lpnSearchRun = function (text, gated) {
		if (!seam || (seam.isGeo && !seam.isGeo())) { return; }
		if (inFlight) {
			notice(t('lpn_search_busy', 'A search is already running. Wait for it to answer.'));
			return;
		}
		var query = String(text == null ? '' : text).trim();
		if (!query) {
			notice(t('lpn_search_empty', 'Type a place name to search for.'));
			return;
		}
		if (!gated && !mayWeSend()) { return; }
		// THE SAME QUERY TWICE IS ANSWERED WITHOUT A SECOND REQUEST -- the policy's "clients
		// sending repeatedly the same query may be classified as faulty" clause, honoured in
		// memory rather than on the device. It is also the common case in real use: you search,
		// you pick the wrong one of five, you search the same thing again.
		if (last && last.query === query) { finish(last.results, query); return; }
		if (EC.lpnSearchWait(lastAt, Date.now()) > 0) {
			notice(t('lpn_search_toofast',
				'One search a second — that is what the place-name service allows. Try ' +
				'again in a moment.'));
			return;
		}
		if (typeof root.fetch !== 'function') {
			notice(t('lpn_search_nofetch', 'This browser cannot reach the place-name service.'));
			return;
		}
		send(query);
	};

	// --------------------------------------------------------------------------------------------
	// The second door: a button on the placement bar, beside Go to a latitude and longitude.
	//
	// **TWO ROWS RATHER THAN ONE MERGED CONTROL**, because the two commands take different KINDS of
	// input and fail differently. A merged box would have to guess whether "38, -122" is a
	// coordinate or the name of something, and it would have to ask the consent question of
	// somebody who only ever meant to paste a coordinate -- the one outcome this whole design is
	// trying not to produce.
	//
	// The button is INJECTED here rather than written into Looped-Network.php so that everything
	// this feature is lives in this file, its markup included. It mirrors the Go to… button's own
	// visibility, which georefRefreshBar() drives: the placement bar shows those buttons only while
	// the model is detached, and a search button that outstayed its neighbour would be a second
	// rule to keep in step.
	// --------------------------------------------------------------------------------------------
	function mountBarButton() {
		if (typeof document === 'undefined' || typeof MutationObserver !== 'function') { return; }
		var anchor = document.getElementById('lpn_georef_goto');
		if (!anchor || document.getElementById('lpn_georef_search')) { return; }
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.id = 'lpn_georef_search';
		btn.textContent = t('lpn_search_bar', 'Search by name…');
		btn.style.display = anchor.style.display;
		btn.addEventListener('click', function () { EC.lpnSearchOpen(); });
		anchor.parentNode.insertBefore(btn, anchor.nextSibling);
		new MutationObserver(function () { btn.style.display = anchor.style.display; })
			.observe(anchor, { attributes: true, attributeFilter: ['style'] });
	}

	/**
	 * The whole seam from js/looped-network.js. Three functions: what a geographic project is, how
	 * to travel to a point, and where to speak. Nothing about the geocoder, the consent gate or any
	 * string in either of them is visible from that file.
	 */
	EC.lpnSearchInit = function (api) {
		seam = api || null;
		mountBarButton();
	};

}(typeof window !== 'undefined' ? window : globalThis));
