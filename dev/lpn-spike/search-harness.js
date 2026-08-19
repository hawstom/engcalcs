// PLACE-NAME SEARCH -- ROADMAP Task 437. Run with:
//   node dev/lpn-spike/search-harness.js
//   EC_LIVE_GEOCODE=1 node dev/lpn-spike/search-harness.js     # also asks the real Nominatim once
//
// WHY THIS EXISTS. js/lpn-search.js has two halves and they fail in completely different ways.
//
//   1. **The arithmetic and the parsing**, which are pure and are checked here on every run: the
//      URL a query becomes, the numbers a third party's JSON becomes, the rate-limit rule, and the
//      consent cookie's read/write/forget cycle. The parser is the dangerous one -- a bad `lat`
//      would fly the map to the middle of the Atlantic and look like an ordinary result, so every
//      malformed shape below is a shape that must yield NOTHING rather than a plausible wrong place.
//   2. **Whether the endpoint actually answers**, which is a statement about somebody else's server
//      and cannot be a blocking check. dev/browser-pass/specs/search.js stubs the network for
//      exactly that reason: a spec that fails when a third party is slow is a spec that gets muted.
//
// **THE LIVE PROBE IS OPT-IN, AND THAT IS A POLICY REQUIREMENT RATHER THAN A CONVENIENCE.** The
// Nominatim usage policy forbids systematic and bulk querying. `sh dev/scripts/check_all.sh` runs
// this file on every commit, and a live request on every commit is precisely the pattern the policy
// is written about. So the probe runs only when EC_LIVE_GEOCODE=1 is set by a person who means it,
// it asks ONE question, and it SKIPS (never fails) when it cannot reach the host -- because "the
// machine running this is offline" is not a defect in this repository.

// ---- the smallest page js/lpn-search.js needs, and nothing more --------------------------------
// A document object with exactly the one property the consent record touches. Deliberately NOT a
// DOM stub: this file is checking cookie arithmetic and parsing, and a richer fake would only make
// it possible for a test to pass by talking to the fake.
const jar = { value: '' };
global.window = global;
global.document = {
	get cookie() { return jar.value; },
	set cookie(v) {
		const name = String(v).split('=')[0];
		const expired = /expires=Thu, 01 Jan 1970/.test(v);
		const others = jar.value.split('; ').filter(c => c && c.split('=')[0] !== name);
		if (!expired) { others.push(String(v).split(';')[0]); }
		jar.value = others.join('; ');
	}
};
global.location = { protocol: 'https:' };

require('../../js/lpn-search.js');
const EC = global.EngCalcs;

let fails = 0;
function ok(label, cond, detail) {
	if (!cond) { fails++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}
function section(name) { console.log(`\n--- ${name} ---`); }

// ---- 1. the URL, and what is NOT in it ---------------------------------------------------------
section('1. the request URL');
const P = EC.lpnSearchPolicy();
const url = EC.lpnSearchUrl('  Petaluma, California  ');
ok('the query is trimmed and percent-encoded',
	url === 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=Petaluma%2C%20California',
	url);
ok('an ampersand in a place name cannot forge a parameter',
	EC.lpnSearchUrl('A&B').indexOf('q=A%26B') > 0, EC.lpnSearchUrl('A&B'));
// **NO VIEWBOX, EVER.** It would improve results and it would also tell the geocoder where the user
// is looking IN ADDITION to what they typed -- the extra disclosure the consent gate exists to
// avoid. A future kindness must not quietly arrive through this parameter.
ok('no viewbox, no bounded, no email, no accept-language ride along',
	!/viewbox|bounded|email|accept-language/i.test(url), url);
ok('https, and the OSM host', /^https:\/\/nominatim\.openstreetmap\.org\//.test(url));
ok('the Referer identifies the APPLICATION, not the host it happens to run on',
	P.appUrl === 'https://hawsedc.com/engcalcs/Looped-Network.php', P.appUrl);

// ---- 2. the usage-policy budget ----------------------------------------------------------------
section('2. the Nominatim usage policy, as numbers');
ok('an absolute maximum of one request per second', P.minIntervalMs === 1000, P.minIntervalMs + ' ms');
ok('a first search waits for nothing', EC.lpnSearchWait(0, 1000) === 0);
ok('a second search inside the second is held off',
	EC.lpnSearchWait(1000, 1400) === 600, EC.lpnSearchWait(1000, 1400) + ' ms left');
ok('...and is free again exactly on the second', EC.lpnSearchWait(1000, 2000) === 0);
ok('...and stays free after it', EC.lpnSearchWait(1000, 9000) === 0);
// The attribution is a legal credit and must not drift into a language key or a paraphrase.
ok('the ODbL credit names both the service and the data source',
	P.credit === 'Geocoding by Nominatim, data © OpenStreetMap contributors', P.credit);

// ---- 3. the parser: a third party's JSON, including the shapes that would hurt ------------------
section('3. parsing somebody else\'s JSON');
const good = EC.lpnSearchParse([
	{ lat: '38.2323', lon: '-122.6367', display_name: 'Petaluma, Sonoma County, California' },
	{ lat: '51.5', lon: '-0.12', name: 'London' }
]);
ok('lat/lon arrive as STRINGS in jsonv2 and come back as numbers',
	good.length === 2 && good[0].lat === 38.2323 && good[0].lon === -122.6367,
	JSON.stringify(good[0]));
ok('display_name is the label, and name is the fallback',
	good[0].label.indexOf('Petaluma') === 0 && good[1].label === 'London');
ok('an empty answer is no results, not an error', EC.lpnSearchParse([]).length === 0);
ok('null and undefined are no results either',
	EC.lpnSearchParse(null).length === 0 && EC.lpnSearchParse(undefined).length === 0);
// EVERY ONE OF THESE WOULD OTHERWISE BE A PLAUSIBLE-LOOKING WRONG PLACE.
const junk = EC.lpnSearchParse([
	{ lat: 'north', lon: '-122', display_name: 'not a number' },
	{ lat: '91', lon: '0', display_name: 'past the pole' },
	{ lat: '38', lon: '181', display_name: 'past the antimeridian' },
	{ lat: null, lon: null, display_name: 'nothing at all' },
	{ display_name: 'no coordinate offered' },
	null,
	{ lat: '38.5', lon: '-122.5' }
]);
ok('six unusable rows are dropped and the one usable row survives',
	junk.length === 1 && junk[0].lat === 38.5, JSON.stringify(junk));
ok('...and a row with no name at all is labelled by its own coordinate',
	junk[0].label === '38.5, -122.5', junk[0].label);

// ---- 4. the consent record ---------------------------------------------------------------------
section('4. the consent record');
jar.value = '';
ok('a visitor who has never been asked has not consented', EC.lpnSearchConsented() === false);
// The cookie is written by the same code the page uses; the harness only supplies the jar.
document.cookie = 'ec_geosearch=1.1755000000.1; path=/';
ok('a yes for the current version of the ask is a yes', EC.lpnSearchConsented() === true);
// **THE VERSION PIN IS THE WHOLE MECHANISM.** If what we send, or who we send it to, ever changes,
// bumping EC_GEOSEARCH_VERSION re-asks exactly these people -- and nobody else, and without
// touching the site-wide banner or EC_CONSENT_VERSION.
jar.value = 'ec_geosearch=1.1755000000.0';
ok('a yes given for an OLDER version of the ask is not a yes now', EC.lpnSearchConsented() === false);
jar.value = 'ec_geosearch=0.1755000000.1';
ok('there is no stored NO -- a 0 state is not consent either', EC.lpnSearchConsented() === false);
jar.value = 'ec_geosearch=garbage';
ok('a hand-edited cookie is not consent', EC.lpnSearchConsented() === false);
// Settings > Clear everything promises "all settings", and this is one.
jar.value = 'lpn_other=keep; ec_geosearch=1.1755000000.1';
EC.lpnSearchForget();
ok('Clear everything removes it', EC.lpnSearchConsented() === false, jar.value);
ok('...and removes nothing else', jar.value.indexOf('lpn_other=keep') >= 0, jar.value);

// ---- 5. the live endpoint, once, and only when asked -------------------------------------------
section('5. the real endpoint (opt-in)');
async function live() {
	if (process.env.EC_LIVE_GEOCODE !== '1') {
		console.log('  --   nominatim.openstreetmap.org really answers   ' +
			'(skipped: set EC_LIVE_GEOCODE=1 to ask it once. A live request on every commit is ' +
			'the bulk-querying pattern the usage policy forbids.)');
		return;
	}
	if (typeof fetch !== 'function') {
		console.log('  --   nominatim.openstreetmap.org really answers   (skipped: no fetch in this node)');
		return;
	}
	let res;
	try {
		res = await fetch(EC.lpnSearchUrl('Petaluma, California'), {
			// Node sends no Referer, so this is the ONE place the policy's User-Agent limb is the
			// one available to us. A browser cannot set this header at all -- see the policy block
			// at the top of js/lpn-search.js for why the page satisfies the Referer limb instead.
			headers: { 'User-Agent': 'EngCalcs/1.0 (+https://hawsedc.com/engcalcs/Looped-Network.php)' }
		});
	} catch (err) {
		console.log('  --   nominatim.openstreetmap.org really answers   (skipped: ' + err.message + ')');
		return;
	}
	if (!res.ok) {
		console.log('  --   nominatim.openstreetmap.org really answers   (skipped: HTTP ' + res.status + ')');
		return;
	}
	const hits = EC.lpnSearchParse(await res.json());
	ok('the real endpoint answers, and our parser reads its answer',
		hits.length > 0 && Math.abs(hits[0].lat - 38.23) < 0.5 && Math.abs(hits[0].lon + 122.64) < 0.5,
		hits.length ? hits[0].label + '  ' + hits[0].lat + ', ' + hits[0].lon : '(nothing)');
}

live().then(function () {
	console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall place-name search checks pass');
	process.exit(fails ? 1 : 0);
});
