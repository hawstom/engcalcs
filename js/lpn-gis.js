// lpn-gis.js -- BACKGROUND LAYERS FROM A GIS SERVER (ROADMAP Task 720). Pure: no DOM, no network.
//
// Tom, 2026-09-25, on WaterCAD's background layers: *"This seems like a GIS REST server offering."*
// A utility publishes its map as an ArcGIS REST MapServer, as an OGC WMS, or as plain XYZ tiles.
// The visitor names the server; the page draws what it returns under the network, exactly where
// the street map is drawn, in the same Web Mercator tile grid.
//
// **ALL THREE KINDS ARE ASKED FOR AS TILES.** A WMS GetMap and an ArcGIS /export take a bounding
// box, so each Web Mercator tile's own box (in EPSG:3857 metres) is the request. That keeps one
// placement rule for every layer and for the street map beside them (tilePlace() in
// js/looped-network.js), and it means a layer never needs the drawing's own projection.
//
// WHAT IS NOT HERE, on purpose: WMTS, vector (feature) layers, identify-on-click, tokens. The
// drawn thing is a picture the server made, behind the network.
//
// A layer is stored in the PROJECT as { kind, url, layers, on, opacity } and nothing else; what the
// page learned from the server (an ArcGIS copyright line, whether it is tiled) is asked again.
(function (root) {
	'use strict';
	var EC = root.EngCalcs = root.EngCalcs || {};
	var R = 6378137, HALF = Math.PI * R;
	var KINDS = ['xyz', 'wms', 'arcgis'];

	// The Web Mercator box of tile z/x/y in EPSG:3857 metres: [minx, miny, maxx, maxy].
	function tileBbox3857(z, x, y) {
		var n = Math.pow(2, z), w = 2 * HALF / n;
		return [-HALF + x * w, HALF - (y + 1) * w, -HALF + (x + 1) * w, HALF - y * w];
	}
	function hostOf(url) {
		try { return new URL(String(url)).host; } catch (err) { return ''; }
	}
	// An address is usable when it is https, or http to this machine (a stub in a test, a server on
	// the visitor's own network can be reached from a page opened over http only).
	function parseAddress(raw) {
		var u, s = String(raw === undefined || raw === null ? '' : raw).trim();
		if (s === '') { return null; }
		// A tile template carries braces, which URL() accepts in the path and percent-encodes.
		try { u = new URL(s.replace(/\{/g, '%7B').replace(/\}/g, '%7D')); } catch (err) { return null; }
		if (u.protocol !== 'https:' && u.protocol !== 'http:') { return null; }
		if (u.protocol === 'http:' && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(u.hostname) &&
				!(root.location && root.location.protocol === 'http:')) { return null; }
		return s;
	}
	// The ArcGIS service root: the address up to and including /MapServer, nothing after it.
	function arcgisRoot(url) {
		var m = /^(.*?\/MapServer)(?:[\/?#].*)?$/i.exec(String(url).trim());
		return m ? m[1] : null;
	}
	// Checks what the visitor typed. Returns { ok: true, layer } with the clean stored shape, or
	// { ok: false, why } where why is 'address', 'template' (XYZ without {z},{x},{y}), 'mapserver'
	// (an ArcGIS address not ending /MapServer) or 'layers' (WMS without a layer name).
	function normalise(input) {
		var kind = input && input.kind, url = parseAddress(input && input.url), layers, out;
		if (KINDS.indexOf(kind) < 0 || !url) { return { ok: false, why: 'address' }; }
		out = { kind: kind, url: url, on: !(input.on === false), opacity: 1 };
		if (input.opacity !== undefined && isFinite(+input.opacity) && +input.opacity > 0 && +input.opacity <= 1) {
			out.opacity = +input.opacity;
		}
		if (kind === 'xyz') {
			if (!/\{z\}/.test(url) || !/\{x\}/.test(url) || !/\{y\}/.test(url)) { return { ok: false, why: 'template' }; }
		} else if (kind === 'wms') {
			layers = String(input.layers || '').split(',').map(function (s) { return s.trim(); })
				.filter(function (s) { return s !== ''; });
			if (!layers.length) { return { ok: false, why: 'layers' }; }
			out.layers = layers.join(',');
		} else {
			out.url = arcgisRoot(url);
			if (!out.url) { return { ok: false, why: 'mapserver' }; }
		}
		return { ok: true, layer: out };
	}
	function num(v) { return String(+v.toFixed(4)); }
	// The URL of one tile of a layer. `info` is what the server said about itself (arcgisInfo()).
	function tileUrl(layer, z, x, y, info) {
		var b, base, q;
		if (layer.kind === 'xyz') {
			return layer.url.replace(/\{z\}/g, z).replace(/\{x\}/g, x).replace(/\{y\}/g, y);
		}
		b = tileBbox3857(z, x, y).map(num).join(',');
		if (layer.kind === 'wms') {
			base = layer.url + (layer.url.indexOf('?') < 0 ? '?' : (/[?&]$/.test(layer.url) ? '' : '&'));
			return base + 'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=' + encodeURIComponent(layer.layers).replace(/%2C/g, ',') +
				'&STYLES=&SRS=EPSG:3857&BBOX=' + b + '&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=TRUE';
		}
		if (info && info.tiled) { return layer.url + '/tile/' + z + '/' + y + '/' + x; }
		q = 'bbox=' + b + '&bboxSR=3857&imageSR=3857&size=256,256&format=png&transparent=true&f=image';
		return layer.url + '/export?' + q;
	}
	// Reads an ArcGIS MapServer's ?f=json answer: its copyright line, and whether it has a tile cache
	// in Web Mercator at 256 pixels (then /tile is used; anything else is asked for with /export).
	function arcgisInfo(json) {
		var ti, sr, wkid, lods, levels, out = { tiled: false, credit: '' };
		if (!json || typeof json !== 'object') { return out; }
		if (typeof json.copyrightText === 'string') { out.credit = json.copyrightText.trim(); }
		ti = json.tileInfo;
		if (ti && json.singleFusedMapCache !== false && ti.rows === 256 && ti.cols === 256) {
			sr = ti.spatialReference || json.spatialReference || {};
			wkid = sr.latestWkid || sr.wkid;
			lods = Array.isArray(ti.lods) ? ti.lods : [];
			levels = lods.map(function (l) { return +l.level; }).filter(isFinite);
			if ((wkid === 3857 || wkid === 102100 || wkid === 102113) && levels.length) {
				out.tiled = true;
				out.minZ = Math.min.apply(null, levels);
				out.maxZ = Math.max.apply(null, levels);
			}
		}
		return out;
	}
	// The tile source object basemapTileList() takes, for one layer.
	function source(layer, index, info) {
		var tiled = !!(info && info.tiled);
		return {
			id: 'gis' + index + (tiled ? 't' : ''),
			minZ: tiled ? info.minZ : 0,
			maxZ: tiled ? info.maxZ : 19,
			url: function (z, x, y) { return tileUrl(layer, z, x, y, info); }
		};
	}
	// What the attribution line shows for a layer: the service's own statement when it makes one,
	// else the host. Plain text, never markup.
	function creditOf(layer, info) {
		if (info && info.credit) { return info.credit; }
		return hostOf(layer.url.replace(/\{/g, '%7B').replace(/\}/g, '%7D'));
	}
	var api = {
		tileBbox3857: tileBbox3857, hostOf: hostOf, normalise: normalise, tileUrl: tileUrl,
		arcgisInfo: arcgisInfo, arcgisRoot: arcgisRoot, source: source, creditOf: creditOf, KINDS: KINDS
	};
	EC.lpnGis = api;
	if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
}(typeof window !== 'undefined' ? window : globalThis));
