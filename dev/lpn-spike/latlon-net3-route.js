// Serve the LAT/LON originals of the two Net3 gallery examples to a browser page (Task 826).
//
// No shipped example is lat/lon any more (Net3 is on California zone 3, in feet and in metres), but
// a harness about GEOGRAPHIC behaviour (a lat/lon export, a picture placed in degrees, the Convert-as
// steps from degrees) still needs a lat/lon Net3. The originals are kept for exactly that, in
// dev/water-network-examples/latlon-originals/. A harness that opens the Net3 gallery card calls
// serveLatLonNet3(page) once after opening the page, and the card then opens the original; nothing
// else about the harness changes. The page must be opened with `serviceWorkers: 'block'`, or the
// service worker answers the fetch before a route can.
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..', 'water-network-examples', 'latlon-originals');
async function serveLatLonNet3(page) {
	await page.route(/\/examples\/Net3-Novato-CA-World(-SI)?\.lwn(\?.*)?$/, (route) => {
		const name = /Net3-Novato-CA-World(-SI)?\.lwn/.exec(route.request().url())[0];
		route.fulfill({ status: 200, contentType: 'application/json', body: fs.readFileSync(path.join(DIR, name), 'utf8') });
	});
}
module.exports = { serveLatLonNet3 };
