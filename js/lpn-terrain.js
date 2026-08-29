// lpn-terrain.js -- FILL IN A NODE'S ELEVATION FROM THE LAND SURFACE, and the consent gate that
// stands in front of it (ROADMAP Task 497).
//
// A geographic project already knows where every node is. Elevation is then the one number a
// designer otherwise types by hand, junction by junction, off a contour map -- so this reads it
// from a terrain raster and FILLS THE FIELD, once, when asked.
//
// **THE SOURCE IS MAPBOX TERRAIN-RGB, AND THE REASON IS THAT IT IS ALREADY PAID FOR.**
// EC_MAPBOX_TOKEN already gates the satellite basemap; terrain arrives as ordinary raster tiles on
// the same host, through the same account, and the elevation decodes client-side out of the pixel.
// No server of ours, no second account, no new host. With no token there is no terrain row, exactly
// as there is no satellite row -- see the View menu in js/looped-network.js. If that gate is ever
// absent, the alternatives the roadmap names are USGS 3DEP (US only), Copernicus GLO-30 or SRTM
// through OpenTopoData, and Open-Elevation.
//
// ------------------------------------------------------------------------------------------------
// THE THREE CONSTRAINTS, all of which shaped the code below rather than merely being noted.
//
// 1. **IT WRITES NUMBERS INTO THE DOCUMENT, and only the user touches a file's numbers.**
//    So it is an explicit command, it FILLS a field the way typing does, and:
//      - **it never overwrites an elevation without being asked about that exact number.** A node
//        that has one keeps it, and the command says how many it is leaving alone before it runs.
//        There is ONE exception and it is a whole separate question: a node drawn on the map is
//        born holding the starting elevation (0), so a freshly drawn network has no blank
//        elevations at all -- only a number nobody typed. Those are offered only when nothing is
//        blank, in a confirm that NAMES the number it would replace. We cannot tell a seeded 0 from
//        a typed 0, so we say what we are about to do and let the person decide, rather than guess.
//      - **one Ctrl-Z puts it all back.** js/looped-network.js takes ONE undo snapshot before the
//        batch, never one per node -- twenty nodes filled is one event to the person who wants it
//        back.
//      - **nothing happens in the background.** There is no sweep on open, on draw, on paste or on
//        import. A number appears because somebody asked for it.
//    The write itself happens inside js/looped-network.js (seam.fill), because that is where the
//    document, its units and its undo stack live. This file never sees a node object.
//
// 2. **IT NEEDS ITS OWN CONSENT GATE, and not the site banner's.** A basemap tile says where the
//    visitor is LOOKING. An elevation query says where their NODES ARE -- which is the model
//    itself, the thing they came here to build. That is the ec_geosearch argument exactly (a tile
//    versus what you typed), so this gets the same treatment: its own cookie, its own version, its
//    own ask, asked the first time it matters and never before. Folding it into consent_body would
//    make one sentence describe two unrelated purposes, cost 26 retranslations, and force an
//    EC_CONSENT_VERSION bump that re-asks every visitor about ANALYTICS they already answered.
//    **ONLY A YES IS EVER STORED.** A refusal writes nothing at all.
//
// 3. **THE ACCURACY IS STATED WHERE THE USER ACTS, not in a comment.** 30 m of ground resolution is
//    a contour interval, not a survey, and a number that arrives by itself is trusted more than one
//    that was typed. So the sentence appears three times on the path a person actually walks: in
//    the menu row's tip, in the confirmation that runs the fill, and in the notice that reports it
//    afterwards. ACCURACY() below is the one place it is written.
//
// **THE OFFLINE PROMISE IS UNTOUCHED.** With no network a geographic project still opens, still
// draws and still solves. This one command says it could not reach the terrain service, and says
// which nodes it therefore left blank.
//
// **NOTHING IS CACHED ON THE DEVICE.** No tile store, no elevation store, no localStorage, no
// IndexedDB -- the tiles' own rule from dev/geographic-projects.md §4, and for a stronger reason
// here: what would be cached is a list of places the visitor's own network stands.

(function (root) {
	'use strict';

	var EC = root.EngCalcs = root.EngCalcs || {};

	// ============================================================================================
	// PURE: values in, values out. No DOM, no network, no page, no document.
	// dev/lpn-spike/terrain-harness.js runs everything in this section in Node with no browser.
	// ============================================================================================

	var HOST = 'https://api.mapbox.com';
	// v4/mapbox.terrain-rgb serves 256 px tiles to zoom 15. `.pngraw` is the LOSSLESS form and is
	// the only correct one here: a lossy re-encode of a Terrain-RGB tile is not a slightly blurred
	// picture, it is arbitrary elevations -- the three channels are one 24-bit number, so a single
	// unit of chroma noise in B is 0.1 m and one in R is 6,553.6 m.
	var TILESET = 'mapbox.terrain-rgb';
	var TILE_PX = 256;
	var MAX_ZOOM = 15;
	// The floor a big network steps down to rather than being clipped or refused, mirroring the
	// basemap's own "step the zoom DOWN" policy. At z=10 one tile is ~40 km across.
	var MIN_ZOOM = 10;
	// Requests per fill. The basemap's cap is 192 for a whole screen of pictures; this is one
	// deliberate command over a site, and a network that needs more than this many 30 m tiles is
	// not a site any more. Stepping down is what keeps it under the budget.
	var MAX_TILES = 24;
	// **THE BUDGET IS A TARGET; THIS IS THE REFUSAL.** A network scattered across a continent still
	// does not fit in MAX_TILES at the zoom floor, and there are only two honest answers: step down
	// past the point where the data is a contour reading at all -- which would make the accuracy
	// sentence a lie -- or say the count out loud and let the person decide. So the plan is allowed
	// over budget, the confirm NAMES how many requests it is about to make, and only past this hard
	// cap is the command refused in words. The zoom floor exists to protect the accuracy claim; this
	// exists to protect somebody else's server.
	var HARD_TILES = 200;
	// Native zoom for the fill. z=14 is ~9.5 m per pixel at the equator, which OVERSAMPLES the
	// ~30 m data underneath on purpose: it costs nothing, and it means two nodes 20 m apart get
	// different pixels rather than the same one.
	var FILL_ZOOM = 14;
	// A tile that never answers is indistinguishable from a hung page. Same 15 s as the geocoder.
	var TIMEOUT_MS = 15000;
	// Mapbox's required credit for its terrain data, untranslated -- the same reasoning as
	// #lpn_basemap_credit and lpn-search.js's CREDIT: it names projects rather than describing a
	// control, and a translated legal credit is a different credit.
	var CREDIT = 'Elevations from Mapbox Terrain — © Mapbox © OpenStreetMap';

	/**
	 * THE MAPBOX DECODE, verbatim from their published formula:
	 *
	 *     height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
	 *
	 * Metres above sea level, 0.1 m per least-significant unit of blue, with -10,000 m as the
	 * zero of the range so the ocean floor fits in 24 bits.
	 *
	 * Returns undefined for anything that is not three byte values, because the alternative is a
	 * plausible-looking wrong elevation: an undefined channel arithmetics to NaN, and NaN written
	 * into a document is a node that solves as nothing at all.
	 */
	EC.lpnTerrainDecode = function (r, g, b) {
		if (!isByte(r) || !isByte(g) || !isByte(b)) { return undefined; }
		return -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1);
	};
	function isByte(v) { return typeof v === 'number' && isFinite(v) && v >= 0 && v <= 255 && v === Math.floor(v); }

	/**
	 * Where one lon/lat lands, at one zoom: which tile, and which pixel inside it.
	 *
	 * Web Mercator, the tile scheme every raster tile server uses. x is linear in longitude; y is
	 * the Mercator of latitude. The pixel is FLOORED into the tile and clamped to its last row and
	 * column, because a point exactly on a tile's far edge computes to index 256, which is in the
	 * next tile and out of this raster.
	 *
	 * Returns null past the Mercator limits (|lat| > 85.0511) rather than a tile number that does
	 * not exist -- there is no terrain tile at the poles and asking for one is a 404 per node.
	 */
	EC.lpnTerrainTilePixel = function (lon, lat, z) {
		if (!isFinite(lon) || !isFinite(lat) || Math.abs(lat) > 85.0511) { return null; }
		if (!(z >= 0 && z <= MAX_ZOOM)) { return null; }
		var n = Math.pow(2, z);
		// Longitude wraps: a network drawn either side of the antimeridian is still on the Earth.
		var wrapped = ((lon + 180) % 360 + 360) % 360;   // 0..360
		var fx = wrapped / 360 * n;
		var rad = lat * Math.PI / 180;
		var fy = (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * n;
		var tx = Math.floor(fx), ty = Math.floor(fy);
		if (tx >= n) { tx = n - 1; }
		if (ty >= n) { ty = n - 1; }
		if (ty < 0) { ty = 0; }
		return {
			z: z, x: tx, y: ty,
			px: clampPx(Math.floor((fx - tx) * TILE_PX)),
			py: clampPx(Math.floor((fy - ty) * TILE_PX))
		};
	};
	function clampPx(v) { return v < 0 ? 0 : (v > TILE_PX - 1 ? TILE_PX - 1 : v); }

	/**
	 * The whole request plan for one fill: the zoom to use, and the points grouped by tile.
	 *
	 * **THE ZOOM STEPS DOWN UNTIL THE PLAN FITS THE BUDGET, exactly as the basemap's does** -- the
	 * view is never clipped and the request is never refused for being large. Stepping down costs
	 * ground resolution and says so; clipping would silently leave half a network blank.
	 *
	 * Grouping by tile is the whole economy of this feature: a 40-node site at z=14 is one or two
	 * requests, not forty. `points` carries the caller's own ids through untouched.
	 */
	EC.lpnTerrainPlan = function (points, opts) {
		opts = opts || {};
		var maxTiles = opts.maxTiles || MAX_TILES;
		var top = opts.zoom || FILL_ZOOM, floor = (opts.minZoom === undefined) ? MIN_ZOOM : opts.minZoom;
		var z, plan = null;
		for (z = top; z >= floor; z--) {
			plan = groupAt(points, z);
			if (plan.tiles.length <= maxTiles) { return plan; }
		}
		// At the floor and still over budget: return it anyway rather than nothing. The caller
		// reports how many tiles it is about to ask for, and the confirm is where a person decides.
		return plan;
	};
	function groupAt(points, z) {
		var byKey = {}, tiles = [], unplaced = [], i, p, t, key;
		for (i = 0; i < (points || []).length; i++) {
			p = points[i] || {};
			t = EC.lpnTerrainTilePixel(p.lon, p.lat, z);
			if (!t) { unplaced.push(p.id); continue; }
			key = t.z + '/' + t.x + '/' + t.y;
			if (!byKey[key]) {
				byKey[key] = { z: t.z, x: t.x, y: t.y, points: [] };
				tiles.push(byKey[key]);
			}
			byKey[key].points.push({ id: p.id, px: t.px, py: t.py });
		}
		return { zoom: z, tiles: tiles, unplaced: unplaced,
			// True when the zoom floor was reached and the plan STILL does not fit the budget. The
			// caller does not refuse on it -- the confirm names the count instead -- but a caller
			// that wanted to could, and a test can see the state rather than inferring it.
			overBudget: tiles.length > MAX_TILES };
	}

	/**
	 * The one place a tile becomes a URL. NOTHING BUT THE TILE AND THE TOKEN IS SENT -- no id, no
	 * project name, no node count, no referrer of ours beyond what the browser sends for any image.
	 */
	EC.lpnTerrainUrl = function (tile, token) {
		return HOST + '/v4/' + TILESET + '/' + tile.z + '/' + tile.x + '/' + tile.y +
			'.pngraw?access_token=' + encodeURIComponent(String(token || ''));
	};

	/** Metres per pixel on the ground at this zoom and latitude -- what the accuracy sentence says. */
	EC.lpnTerrainGroundResolution = function (z, lat) {
		return 40075016.686 * Math.cos((lat || 0) * Math.PI / 180) / (TILE_PX * Math.pow(2, z));
	};

	/** The numbers and strings the notes above are about, so a test can assert them. */
	EC.lpnTerrainPolicy = function () {
		return { host: HOST, tileset: TILESET, tilePx: TILE_PX, maxZoom: MAX_ZOOM,
			minZoom: MIN_ZOOM, fillZoom: FILL_ZOOM, maxTiles: MAX_TILES,
			hardTiles: HARD_TILES, timeoutMs: TIMEOUT_MS, credit: CREDIT };
	};

	// ============================================================================================
	// THE CONSENT RECORD. One cookie, written only on a yes. Mirrors js/lpn-search.js exactly.
	// ============================================================================================

	// Same "<state>.<unix-ts>.<policy-version>" shape as ec_consent and ec_geosearch, so a person
	// reading a cookie jar sees one convention rather than three. lib/config.inc.php is the source
	// of truth for the name, the version and the lifetime; Looped-Network.php hands them over.
	var COOKIE_DEFAULT = 'ec_terrain', VERSION_DEFAULT = '1', DAYS_DEFAULT = 365;

	function pc() { return EC.pageConfig || {}; }
	function cfg(key, fallback) {
		var v = pc()[key];
		return (v === undefined || v === null || v === '') ? fallback : v;
	}
	function cookieName() { return String(cfg('lpn_terrain_cookie', COOKIE_DEFAULT)); }
	function cookieVersion() { return String(cfg('lpn_terrain_version', VERSION_DEFAULT)); }
	function cookieDays() { return +cfg('lpn_terrain_days', DAYS_DEFAULT) || DAYS_DEFAULT; }

	function readCookie() {
		if (typeof document === 'undefined' || !document.cookie) { return ''; }
		var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + cookieName() + '=([^;]*)'));
		return m ? decodeURIComponent(m[1]) : '';
	}

	/**
	 * True only for a yes given for THIS version of the ask. Version-pinned so that if what we send,
	 * or who we send it to, ever materially changes, bumping EC_TERRAIN_VERSION re-asks exactly the
	 * people who said yes to the old thing -- and nobody else, and without touching the site banner.
	 */
	EC.lpnTerrainConsented = function () {
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
	 * Withdrawal. Called by Settings > Erase everything, whose confirm promises "all settings" -- a
	 * stored yes is a setting by any reading, and a key that button leaves behind makes its own
	 * sentence false. dev/cookie-storage-inventory.md records that this is the only remover.
	 */
	EC.lpnTerrainForget = function () {
		if (typeof document === 'undefined') { return; }
		document.cookie = cookieName() + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
	};

	// ============================================================================================
	// NAMING WHAT WAS TOUCHED. Pure: ids and counts in, a sentence out. No DOM, no network.
	// dev/lpn-spike/terrain-harness.js drives all of this in Node.
	// ============================================================================================
	//
	// **A COUNT IS A PROMISE; A LIST IS A PROMISE YOU CAN CHECK** (2026-08-25). The confirm counted
	// the nodes it would leave alone and the notice counted the ones it filled, and neither said
	// WHICH. Tom: *"Elsewhere in lpn we are careful to list what we found. Add a way to indicate
	// which nodes were edited or will be edited or both."* Both, and this is the whole of it: the
	// plan names what it is about to write and what it is about to leave; the result names what it
	// wrote and what it could not read.
	//
	// **THE PATTERN IS THE .inp IMPORT REPORT'S, DELIBERATELY** (js/lpn-inp.js, showInpReport()).
	// That report is this suite's settled answer to "here is what we did and did not do": one whole
	// SENTENCE per finding with its ids in brackets after it, never a bare column of names and
	// never a sentence composed from fragments at render time. Same shape here, so a reader who has
	// opened a file already knows how to read this.
	//
	// **THE ONE THING THAT HAD TO BE ADDED IS THE CAP.** The import report renders into a dialog
	// with a scrollbar, so it can afford every id. These sentences go into a native confirm() and
	// into a status notice that clears itself after a few seconds, and neither can scroll: a
	// four-hundred-node network would put a wall of names in front of the button a person has to
	// press, which does not inform them, it hides the question. So the list names the first
	// MAX_NAMED and then says how many it did not name -- the count and the list together, rather
	// than either alone.
	var MAX_NAMED = 12;

	/**
	 * The ids as one readable run of text, capped. Never returns an empty string for a non-empty
	 * list, and never claims a number it did not print.
	 */
	EC.lpnTerrainNameList = function (ids) {
		var list = (ids || []).map(function (v) { return (v && v.id !== undefined) ? v.id : v; });
		if (!list.length) { return ''; }
		if (list.length <= MAX_NAMED) { return list.join(', '); }
		var shown = list.slice(0, MAX_NAMED).join(', ');
		var rest = list.length - MAX_NAMED;
		// Substituted, never concatenated, for the reason logged against lpn_terrain_requests below:
		// a language that wants the count before the names must be able to put it there.
		return t('lpn_terrain_ids_more', '{ids}, and {n} more')
			.replace('{ids}', shown).replace(/\{n\}/g, rest);
	};

	/** One finding: a whole sentence with its named ids substituted in, or nothing at all. */
	function named(key, english, ids) {
		var list = EC.lpnTerrainNameList(ids);
		return list ? t(key, english).replace('{ids}', list) : '';
	}

	// ============================================================================================
	// THE COMMAND. Everything below needs a page.
	// ============================================================================================

	// The seam handed over by js/looped-network.js. Nothing here reaches into that file.
	var seam = null;
	var running = false;

	function notice(text) { if (seam && seam.notice) { seam.notice(text); } }

	// Every visitor-facing string here is an English literal in the `pc.key || '...'` position, the
	// same arrangement js/lpn-search.js ships under: lib/lang.ec.en.php belongs to the translation
	// track, so the keys do not exist yet and the literal is what shows. The moment the keys and
	// their pageConfig entries land, every one of these lights up in 27 languages with no edit here.
	function t(key, english) { return pc()[key] || english; }

	// **THE ACCURACY SENTENCE, WRITTEN ONCE AND SHOWN THREE TIMES.** It is a constraint of the task
	// that this reaches the interface rather than a comment, and one shared sentence is what keeps
	// the menu tip, the confirm and the result notice from drifting apart into three different
	// claims about the same data.
	function accuracy() {
		return t('lpn_terrain_accuracy',
			'Mapbox assembles this from many public elevation datasets, so how good it is depends entirely on where you are. Where a national lidar survey exists \u2014 USGS 3DEP in much of the United States, and its equivalents elsewhere \u2014 it can be better than a metre across the ground and a few tenths of a metre up and down. Where only global data exists it is about 30 m across the ground and several metres up and down. Mapbox does not tell us which one you got. Treat it as a contour map, not a survey: check anything you rely on.' +
			'accuracy. Treat it as a contour map, not a survey: check anything you rely on.');
	}

	// **THE VIEW-MENU ROW'S OWN WORDS ARE GONE WITH THE ROW** (Task 542, and the key deleted on
	// Tom's ruling 2026-08-28: *"lpn_terrain_menu: Delete key."*). `lpnTerrainMenuLabel()` and
	// `lpnTerrainMenuTip()` outlived the menu row by one task and were called by nobody, which is
	// worse than dead code: a reference from an UNCALLED function is still a reference, so
	// `key_hygiene_check.php` counted them and the two strings never appeared in its orphan list.
	// **A dead reader hides a dead key.** Deleting the readers is what let the keys be found.

	// THE ASK ITSELF. Long on purpose -- it is the only thing the visitor decides from, and the
	// facts that matter are all in it: WHO receives it, WHAT they receive, why that is a different
	// question from the map pictures, and that saying no costs them nothing else on the page.
	//
	// A NATIVE confirm(), not a styled box, for lpn-search.js's reason: its two buttons cannot be
	// styled by us at all, so the coloured-Accept-beside-grey-Reject dark pattern lib/Consent.lib.php
	// spends a paragraph avoiding is not merely avoided here, it is impossible. Cancel and Escape
	// both mean no.
	//
	// ONE KEY PER PARAGRAPH, joined here (Task 507). A $ec_lang value is a single line by
	// construction, so the alternative was a line-break placeholder inside one long value; four
	// short keys read better to a translator and keep the ORDER of the paragraphs ours. {n} is
	// substituted across the whole joined text, so a language that wants to say how many nodes are
	// about to be sent may put it in any of the four; the English says it in none.
	function consentText(count) {
		return [
			t('lpn_terrain_consent_1',
				'Filling in elevations sends the position of each node that needs one — its latitude ' +
				'and longitude — to api.mapbox.com, to look up the height of the ground there.'),
			t('lpn_terrain_consent_2',
				'This is a different question from the map pictures behind your project. The pictures ' +
				'only say where you are looking. These positions are your network itself. Mapbox will ' +
				'receive those coordinates and your IP address. We send nothing else: no name, no ' +
				'pipes, no project. We keep no record of it, and nothing is stored on this device ' +
				'except your answer to this question.'),
			t('lpn_terrain_consent_3', 'May we use it?'),
			t('lpn_terrain_consent_4',
				'If you say no, everything else on this page keeps working exactly as it does now, ' +
				'and you can type elevations in yourself as before. We remember a yes so that we need ' +
				'not ask again. A no is not stored at all.')
		].join('\n\n').replace(/\{n\}/g, count);
	}

	/** The gate. Returns true if we may send. Asks at most once per invocation. */
	function mayWeSend(count) {
		if (EC.lpnTerrainConsented()) { return true; }
		if (!root.confirm || !root.confirm(consentText(count))) {
			notice(t('lpn_terrain_refused',
				'Elevations were not filled in, and nothing was sent. You can type them in as ' +
				'before.'));
			return false;
		}
		recordConsent();
		return true;
	}

	// The plan, in words, with the two counts and the accuracy sentence. **THE COUNT OF NODES LEFT
	// ALONE IS IN THE QUESTION**, because "we will not overwrite what you typed" is a promise, and a
	// promise a person can check on the spot is worth more than one they have to take on trust.
	//
	// `replacing` is the starting elevation, when this run is the SECOND question -- the one about
	// nodes that still hold the number a new node is born with. Naming that number is the whole
	// point of asking separately, so it is never summarised away.
	EC.lpnTerrainPlanText = function (want, keep, tileCount, replacing) {
		var fillCount = (want || []).length, keepCount = (keep || []).length;
		var s = (replacing === undefined)
			? t('lpn_terrain_confirm',
				'Fill in the elevation of {n} node(s) from Mapbox DEM?').replace('{n}', fillCount)
			: [
				t('lpn_terrain_confirm_default_1',
					'Every node already has an elevation, and {n} of them are still at {v}, which is ' +
					'the elevation a new node starts with rather than one you typed.'),
				t('lpn_terrain_confirm_default_2', 'Replace those {n} with the land surface?')
			].join('\n\n')
				.replace(/\{n\}/g, fillCount).replace('{v}', replacing);
		// **WHICH ONES, BEFORE ANYTHING IS WRITTEN.** This is the half of the answer a person can
		// still act on -- they are looking at the drawing and at the button at the same time, and
		// the only way to catch "that one is surveyed, do not touch it" is to see the name here.
		s += '\n\n' + named('lpn_terrain_will_ids',
			'These are the nodes that will be filled in: {ids}', want);
		if (keepCount > 0 && replacing === undefined) {
			s += '\n\n' + t('lpn_terrain_keep',
				'{k} node(s) already have an elevation and will not be touched.').replace('{k}', keepCount)
				+ ' ' + named('lpn_terrain_keep_ids', 'They are: {ids}', keep);
		}
		s += '\n\n' + accuracy();
		s += '\n\n' + t('lpn_terrain_undo', 'One Undo (Ctrl-Z) puts every one of them back.');
		// **THE COUNT IS SUBSTITUTED, NOT CONCATENATED** -- Turkish filed this against sprint 459's
		// English and was right: `count + ' ' + string` fixes the number to the FRONT of the sentence,
		// and Turkish grammar wants it after the noun phrase. CLAUDE.md forbids composing a
		// visitor-facing sentence from fragments at render time for exactly this reason.
		//
		// The concatenation survives as the FALLBACK, and that is deliberate rather than lazy: the
		// languages translated before the English grew its `{n}` hold a fragment with no placeholder,
		// and substituting into those would silently drop the count. A value carrying `{n}` decides
		// where the number goes; one without it gets the old sentence, unchanged. The branch retires
		// itself the day every language has resynced.
		var req = t('lpn_terrain_requests', '{n} request(s) to api.mapbox.com.');
		s += '\n\n' + (req.indexOf('{n}') >= 0
			? req.replace(/\{n\}/g, tileCount)
			: tileCount + ' ' + req);
		return s;
	};

	/**
	 * **AND THE SAME ANSWER AFTERWARDS, which is a different list.** What was planned and what was
	 * written are not the same set: a pixel that would not decode and a node somebody typed into
	 * while the tiles were in flight both drop out. So this is composed from the ids the document
	 * actually returned, and the ones it did not are named too -- "still blank" is a thing a person
	 * has to go and finish by hand, and they cannot start until they know which.
	 */
	EC.lpnTerrainDoneText = function (filledIds, blankIds, failedTiles) {
		var parts = [
			t('lpn_terrain_done', '{n} elevation(s) filled in.').replace('{n}', (filledIds || []).length),
			named('lpn_terrain_filled_ids', 'These nodes were filled in: {ids}', filledIds)
		];
		if ((blankIds || []).length) {
			parts.push(t('lpn_terrain_missed',
				'{m} could not be read and are still blank.').replace('{m}', blankIds.length));
			parts.push(named('lpn_terrain_blank_ids',
				'These nodes are still blank: {ids}', blankIds));
		}
		if (failedTiles > 0) {
			parts.push(t('lpn_terrain_partial',
				'{f} terrain tile(s) did not answer.').replace('{f}', failedTiles));
		}
		parts.push(accuracy());
		parts.push(CREDIT);
		return parts.filter(function (x) { return !!x; }).join(' ');
	};

	/**
	 * ONE TILE, AS PIXELS. **This is the only function in this file that touches the network**, and
	 * it is a property on EngCalcs rather than a closure so that a harness can replace it with a
	 * stub -- see dev/lpn-spike/terrain-harness.js, which substitutes a synthetic terrain that is
	 * ENCODED by Mapbox's own formula so the real decode above still runs.
	 *
	 * Resolves to an array of {id, r, g, b}, one per requested pixel. It never throws for a bad
	 * pixel; a channel it cannot read is simply absent and the node stays blank.
	 */
	EC.lpnTerrainFetchPixels = function (tile, token) {
		var url = EC.lpnTerrainUrl(tile, token);
		var controller = (typeof AbortController === 'function') ? new AbortController() : null;
		var timer = root.setTimeout(function () { if (controller) { controller.abort(); } }, TIMEOUT_MS);
		return root.fetch(url, {
			// No cookies, ever. There is nothing of ours for them to hold and nothing of theirs we
			// want held -- the same rule crossorigin=anonymous puts on the basemap's own tiles.
			credentials: 'omit',
			signal: controller ? controller.signal : undefined
		}).then(function (res) {
			if (!res.ok) { throw { kind: 'http', status: res.status }; }
			return res.blob();
		}).then(function (blob) {
			return root.createImageBitmap(blob);
		}).then(function (bitmap) {
			var canvas = document.createElement('canvas');
			canvas.width = bitmap.width; canvas.height = bitmap.height;
			var ctx = canvas.getContext('2d');
			ctx.drawImage(bitmap, 0, 0);
			var out = [], i, p, d;
			for (i = 0; i < tile.points.length; i++) {
				p = tile.points[i];
				d = ctx.getImageData(p.px, p.py, 1, 1).data;
				out.push({ id: p.id, r: d[0], g: d[1], b: d[2] });
			}
			if (bitmap.close) { bitmap.close(); }
			return out;
		}).then(function (out) {
			root.clearTimeout(timer);
			return out;
		}, function (err) {
			root.clearTimeout(timer);
			throw err;
		});
	};

	/**
	 * The whole command, and the ONLY entry point js/looped-network.js knows about.
	 *
	 * Order matters and is not arbitrary: what will be touched is counted BEFORE anything is asked,
	 * so nobody consents to a request that turns out to have had nothing to do, and nobody is asked
	 * to confirm a fill whose size they have not been told.
	 */
	EC.lpnTerrainFill = function () {
		if (!seam || (seam.isGeo && !seam.isGeo())) { return; }
		var token = seam.token && seam.token();
		if (!token) { return; }   // the row is hidden without one; this is the belt to that brace
		if (running) {
			notice(t('lpn_terrain_busy', 'Elevations are already being filled in. Wait for them.'));
			return;
		}
		var want = seam.nodesNeedingElevation();
		var keep = seam.nodesWithElevation();
		// **THE SECOND SET, AND WHY IT IS A SECOND QUESTION.** A node drawn on the map is born with
		// the starting elevation (0), so a freshly drawn network has no BLANK elevations at all --
		// only a number nobody typed. Offering to replace those is what makes this feature useful
		// for the commonest case there is; offering it silently, mixed in with the blanks, would be
		// the rule this whole file is built around breaking. So it is asked only when there is
		// nothing blank left to do, and the number being replaced is named in the question.
		var replacing;
		if (!want.length) {
			var atDefault = seam.nodesAtDefaultElevation ? seam.nodesAtDefaultElevation() : { points: [] };
			if (atDefault.points.length) {
				want = atDefault.points;
				replacing = atDefault.value;
				// `keep` is a list of ids now, not a count, so the nodes that just moved OUT of it
				// and into `want` are removed by name rather than by subtracting a number.
				var moving = {};
				want.forEach(function (p) { moving[p.id] = true; });
				keep = keep.filter(function (id) { return !moving[id]; });
			}
		}
		if (!want.length) {
			notice(keep.length > 0
				? t('lpn_terrain_none_needed',
					'Every node already has an elevation you have set. Nothing was changed, and ' +
					'nothing was sent — we never overwrite an elevation that is already there.')
				: t('lpn_terrain_no_nodes', 'There are no nodes to fill in yet.'));
			return;
		}
		EC.lpnTerrainFillFor(want, { keep: keep, replacing: replacing, confirm: true });
	};

	/**
	 * **FETCH AND WRITE A LIST SOMEBODY ELSE CHOSE** (ROADMAP Task 542). Everything from the consent
	 * gate down, taking the nodes as an argument instead of deciding them.
	 *
	 * This is the split Task 542 needed. `lpnTerrainFill` above is one CALLER: it decides its own
	 * list (blank elevations, then the ones still on the starting number) and passes it here. The
	 * two Task 542 doors are the other two -- a node born on a geographic project, and Find and
	 * replace with Elevation set to From DEM -- and neither of them decides a list the same way.
	 * Splitting was the alternative to a third copy of the tile plan, the budget, the consent gate
	 * and the eight messages, which is how three doors become three behaviours.
	 *
	 * `opts.confirm` shows the plan and its counts. **The DOOR decides that, not this file**: a bulk
	 * fill over a drawing somebody already made is destructive and asks; a node being born has
	 * nothing to overwrite and must not interrupt the drawing to say so.
	 *
	 * **THE CONSENT GATE IS NOT OPTIONAL AND HAS NO opts.** Every door goes through mayWeSend(),
	 * because what it protects is not "is this destructive" -- it is that a node coordinate says
	 * where the user's NETWORK IS, and that is true however the fill was started.
	 */
	/**
	 * **READ THE LAND SURFACE AND REPORT IT. WRITE NOTHING.** (ROADMAP Task 542; Tom, 2026-08-29:
	 * *"I want to see the DEM elevation before I destroy the current elevation."*)
	 *
	 * This is the half of the feature that had been missing. Every other door here reads AND writes
	 * in one press, which is right for a bulk fill somebody asked for and wrong for the question
	 * *what is the elevation here?* — the answer to that has to arrive before anything is
	 * overwritten, or the number it would have been compared against is already gone.
	 *
	 * It shares the plan, the budget, the decode and the consent gate with the fill, and diverges at
	 * exactly one line: the readings go to `seam.record` and never to `seam.fill`. **The consent
	 * gate is NOT skipped** — sampling is the step that sends a node's position to Mapbox, so it is
	 * the step that has to ask, and it asks once per browser rather than once per press.
	 *
	 * `done` is called after the readings are recorded, so a caller can redraw.
	 */
	EC.lpnTerrainSample = function (want, done) {
		if (!seam || (seam.isGeo && !seam.isGeo())) { return; }
		var token = seam.token && seam.token();
		if (!token) { return; }
		if (running) {
			notice(t('lpn_terrain_busy', 'Elevations are already being filled in. Wait for them.'));
			return;
		}
		if (!want || !want.length) { return; }
		if (!mayWeSend(want.length)) { return; }
		var plan = EC.lpnTerrainPlan(want);
		if (!plan || !plan.tiles.length) {
			notice(t('lpn_terrain_offmap',
				'These node positions are not on the terrain map, so nothing was sent.'));
			return;
		}
		if (typeof root.fetch !== 'function') {
			notice(t('lpn_terrain_nofetch', 'This browser cannot reach the terrain service.'));
			return;
		}
		running = true;
		var heights = [], failed = 0;
		Promise.all(plan.tiles.map(function (tile) {
			return EC.lpnTerrainFetchPixels(tile, token).then(function (pixels) {
				pixels.forEach(function (p) {
					var m = EC.lpnTerrainDecode(p.r, p.g, p.b);
					if (m !== undefined && isFinite(m)) { heights.push({ id: p.id, meters: m }); }
				});
			}, function () { failed++; });
		})).then(function () {
			running = false;
			if (!heights.length) {
				notice(t('lpn_terrain_failed',
					'We could not reach the terrain service, so no elevation was changed. You may ' +
					'be offline. Everything else on this page works without it.'));
			} else if (seam.record) {
				seam.record(heights);
			}
			if (typeof done === 'function') { done(heights, failed); }
		});
	};

	EC.lpnTerrainFillFor = function (want, opts) {
		opts = opts || {};
		if (!seam || (seam.isGeo && !seam.isGeo())) { return; }
		var token = seam.token && seam.token();
		if (!token) { return; }
		if (running) {
			notice(t('lpn_terrain_busy', 'Elevations are already being filled in. Wait for them.'));
			return;
		}
		if (!want || !want.length) { return; }
		if (!mayWeSend(want.length)) { return; }
		var plan = EC.lpnTerrainPlan(want);
		if (!plan || !plan.tiles.length) {
			notice(t('lpn_terrain_offmap',
				'These node positions are not on the terrain map, so nothing was sent.'));
			return;
		}
		if (plan.tiles.length > HARD_TILES) {
			notice(t('lpn_terrain_too_wide',
				'These nodes are spread over too much of the Earth to read in one go ({n} tile ' +
				'requests). Nothing was sent.').replace('{n}', plan.tiles.length));
			return;
		}
		if (opts.confirm &&
			(!root.confirm || !root.confirm(EC.lpnTerrainPlanText(want, opts.keep || [], plan.tiles.length, opts.replacing)))) {
			notice(t('lpn_terrain_cancelled', 'Nothing was changed and nothing was sent.'));
			return;
		}
		if (typeof root.fetch !== 'function') {
			notice(t('lpn_terrain_nofetch', 'This browser cannot reach the terrain service.'));
			return;
		}
		// **`replaceAny` AND `replacing` ARE DIFFERENT PERMISSIONS AND ONLY ONE OF THEM IS WORDING.**
		// `replacing` is a NUMBER the plan text names out loud ("still on 0") and is the menu row's
		// second question. `replaceAny` is Find and replace's blanket permission, which has no
		// number to name -- passing it as `replacing` would print `true` where a number goes.
		run(plan, token, want, opts.replaceAny ? true : opts.replacing, opts.quiet);
	};

	function run(plan, token, want, replacing, quiet) {
		running = true;
		// **A NODE BEING BORN DOES NOT ANNOUNCE ITSELF.** `quiet` suppresses the progress line and
		// the success line, not the failures: a fill that could not reach the service, or that left
		// nodes blank, is news whatever started it. Nothing is ever silent about what it did NOT do.
		if (!quiet) { notice(t('lpn_terrain_working', 'Reading the land surface…')); }
		var heights = [], failed = 0;
		var jobs = plan.tiles.map(function (tile) {
			return EC.lpnTerrainFetchPixels(tile, token).then(function (pixels) {
				pixels.forEach(function (p) {
					var m = EC.lpnTerrainDecode(p.r, p.g, p.b);
					// **A DECODE THAT FAILS LEAVES THE FIELD BLANK.** A blank elevation is an
					// honest "we do not know"; a zero is sea level, which is a number the user
					// would then have to notice was wrong.
					if (m !== undefined && isFinite(m)) { heights.push({ id: p.id, meters: m }); }
				});
			}, function () { failed++; });
		});
		Promise.all(jobs).then(function () {
			running = false;
			if (!heights.length) {
				notice(t('lpn_terrain_failed',
					'We could not reach the terrain service, so no elevation was changed. You may ' +
					'be offline. Everything else on this page works without it.'));
				return;
			}
			// **ONE CALL, ONE UNDO SNAPSHOT, ONE EVENT.** The seam takes the whole list, not a node
			// at a time -- see js/looped-network.js, where the snapshot is taken before the first
			// write and the redraw happens after the last. It hands back the ids it WROTE, which
			// is what lets the notice below name them.
			var filled = seam.fill(heights, replacing) || [];
			var wrote = {};
			filled.forEach(function (id) { wrote[id] = true; });
			// **THE STILL-BLANK LIST IS THE ASKED-FOR LIST MINUS THE WRITTEN ONE.** Derived here
			// rather than counted anywhere, so a node that dropped out for ANY reason -- an
			// undecodable pixel, a tile that never answered, a number the user typed while the
			// request was in flight -- is named exactly once and named correctly.
			var blank = want.map(function (p) { return p.id; })
				.filter(function (id) { return !wrote[id]; });
			if (!quiet || blank.length || failed) { notice(EC.lpnTerrainDoneText(filled, blank, failed)); }
		});
	}

	/**
	 * The whole seam from js/looped-network.js. SEVEN functions now -- `record` joined them with
	 * Task 542's sample-before-you-write control, and it is the one that writes NOTHING to the
	 * document: it hands back a reading so the page can show it and let a person decide. Six
	 * functions: what a geographic project is, the
	 * token, which nodes need an elevation, WHICH already have one, which are still on the starting
	 * elevation, how to write a batch (returning the ids it wrote), and where to speak. The two
	 * "which" answers are lists of ids and not counts, because this file names the nodes in both
	 * directions and cannot invent a name it was never given. Nothing about the tile scheme, the decode, the consent gate or any string in
	 * them is visible from that file.
	 */
	EC.lpnTerrainInit = function (api) {
		seam = api || null;
	};

}(typeof window !== 'undefined' ? window : globalThis));
