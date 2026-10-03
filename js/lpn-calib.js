// lpn-calib.js — calibration files: measured field data against the model (ROADMAP Task 601).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
//
// The pure half, split by PURITY the way js/lpn-profile.js is: text in, numbers out. No DOM, no
// `doc`, no units, no strings of its own. js/looped-network.js resolves the network, reads the
// computed values through its own value-and-unit seam, and draws the report.
//
// **EPANET'S FORMAT AND EPANET'S STATISTICS, COPIED, NOT IMPROVED.** The EPANET 2.2 manual, §5.3
// (Calibration Data): a text file of `location ID, time, value` per line, `;` starting a comment,
// time in decimal hours or hours:minutes measured from the start of the simulation, and "Location
// ID does not have to be repeated" for consecutive measurements at one place. §9.6 (Calibration
// Report): per location, the number of observations, the observed mean, the computed mean, the
// mean error (the mean of the ABSOLUTE differences, which is how EPANET's own code sums it) and the
// RMS error; the same pooled over the network; and the "correlation between means" -- the
// correlation coefficient between each location's observed mean and its computed mean. A measured
// time between two reporting steps is compared against the value interpolated between them.
//
// **NOTHING IN A FILE IS DROPPED SILENTLY AND NOTHING REJECTS THE FILE** -- CLAUDE.md's .inp import
// rule, applied to the first data this page takes from outside the model. A line that cannot be
// read comes back in `bad` with its line number; the caller reports locations the network does not
// have. The rest of the file is used.

var EngCalcs = EngCalcs || {};

EngCalcs.lpnCalib = (function () {
	'use strict';

	// EPANET's six calibration parameters, in its own order (the Calibration Data dialog). `group`
	// says which kind of element a location ID must name; `field` is the page's value key for it.
	var PARAMS = [
		{ key: 'demand', group: 'node', field: 'demandActual' },
		{ key: 'head', group: 'node', field: 'head' },
		{ key: 'pressure', group: 'node', field: 'pressure' },
		{ key: 'quality', group: 'node', field: 'quality' },
		{ key: 'flow', group: 'link', field: 'flow' },
		{ key: 'velocity', group: 'link', field: 'velocity' }
	];

	function num(s) {
		if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s)) { return NaN; }
		return parseFloat(s);
	}
	/**
	 * Seconds from a calibration-file time: decimal hours (`6.4`), hours:minutes (`6:24`) or
	 * hours:minutes:seconds. NaN for anything else, including a negative time.
	 */
	function parseTime(s) {
		var parts, h, m, sec;
		s = String(s || '').trim();
		if (s.indexOf(':') < 0) {
			h = num(s);
			return (isFinite(h) && h >= 0) ? Math.round(h * 3600 * 1000) / 1000 : NaN;
		}
		parts = s.split(':');
		if (parts.length > 3) { return NaN; }
		if (!parts.every(function (p) { return /^\d+(\.\d+)?$/.test(p); })) { return NaN; }
		h = parseFloat(parts[0]); m = parseFloat(parts[1]); sec = parts.length > 2 ? parseFloat(parts[2]) : 0;
		if (m >= 60 || sec >= 60) { return NaN; }
		return h * 3600 + m * 60 + sec;
	}
	/**
	 * Read a calibration file. Returns
	 *   { obs: [{id, t, v, line}], order: [id, ...], bad: [{line, text}] }
	 * `t` in seconds. `order` is each location ID once, in the order the file first names it.
	 */
	function parse(text) {
		var lines = String(text || '').split(/\r\n|\r|\n/), obs = [], order = [], seen = {}, bad = [],
			current = null;
		lines.forEach(function (raw, i) {
			var line = raw, semi = line.indexOf(';'), tok, id, t, v;
			if (i === 0) { line = line.replace(/^﻿/, ''); }
			if (semi >= 0) { line = line.slice(0, semi); }
			line = line.trim();
			if (!line) { return; }
			// A comma separates like a space or a tab, as EPANET's own tokenizer (Uutils.pas) has it.
			tok = line.split(/[\s,]+/).filter(function (x) { return x !== ''; });
			if (tok.length === 3) { id = tok[0]; t = tok[1]; v = tok[2]; }
			else if (tok.length === 2 && current !== null) { id = current; t = tok[0]; v = tok[1]; }
			else { bad.push({ line: i + 1, text: raw.trim() }); return; }
			// **THE ID ON AN UNREADABLE LINE STILL NAMES THE LOCATION THAT FOLLOWS** -- EPANET files
			// the ID-less lines under it, so a bad value must not hand them to the location before.
			current = id;
			t = parseTime(t);
			v = num(v);
			if (!isFinite(t) || !isFinite(v)) { bad.push({ line: i + 1, text: raw.trim() }); return; }
			if (!seen[id]) { seen[id] = true; order.push(id); }
			obs.push({ id: id, t: t, v: v, line: i + 1 });
		});
		return { obs: obs, order: order, bad: bad };
	}
	/**
	 * The computed value at time `t` from a series sampled at `times` (ascending seconds), linearly
	 * interpolated between the two reporting steps either side, as EPANET does. `undefined` outside
	 * the span, or where either neighbour has no value -- never an extrapolation and never a value
	 * carried across a gap. A one-step series answers only at its own time.
	 */
	function interp(times, values, t) {
		var n = times.length, i, a, b, f;
		if (!n) { return undefined; }
		if (n === 1) { return (Math.abs(t - times[0]) < 1e-6 && isNum(values[0])) ? values[0] : undefined; }
		if (t < times[0] - 1e-6 || t > times[n - 1] + 1e-6) { return undefined; }
		for (i = 0; i < n - 1; i++) {
			if (t <= times[i + 1] + 1e-6) { break; }
		}
		if (i >= n - 1) { i = n - 2; }
		a = values[i]; b = values[i + 1];
		if (Math.abs(t - times[i]) < 1e-6) { return isNum(a) ? a : undefined; }
		if (Math.abs(t - times[i + 1]) < 1e-6) { return isNum(b) ? b : undefined; }
		if (!isNum(a) || !isNum(b)) { return undefined; }
		f = (t - times[i]) / (times[i + 1] - times[i]);
		return a + f * (b - a);
	}
	function isNum(v) { return typeof v === 'number' && isFinite(v); }

	function sumsToStats(s) {
		return {
			n: s.n,
			obsMean: s.n ? s.so / s.n : undefined,
			simMean: s.n ? s.ss / s.n : undefined,
			meanErr: s.n ? s.se / s.n : undefined,
			rmsErr: s.n ? Math.sqrt(s.se2 / s.n) : undefined
		};
	}
	function pairSums(pairs) {
		var s = { n: 0, so: 0, ss: 0, se: 0, se2: 0 };
		pairs.forEach(function (p) {
			var e = p.s - p.o;
			s.n++; s.so += p.o; s.ss += p.s; s.se += Math.abs(e); s.se2 += e * e;
		});
		return s;
	}
	/**
	 * EPANET's Statistics page. `locations` is [{id, pairs: [{t, o, s}]}] -- o observed, s computed.
	 * Returns { locations: [{id, n, obsMean, simMean, meanErr, rmsErr}], network: {...}, r }.
	 * A location with no pairs is kept with n = 0 and no means, and takes no part in the network
	 * row or in r. `r` is undefined with fewer than two locations, or where either set of means
	 * does not vary (EPANET prints 0 there; a correlation that cannot be computed is not zero).
	 */
	function stats(locations) {
		var net = { n: 0, so: 0, ss: 0, se: 0, se2: 0 }, out = [], X = [], Y = [];
		(locations || []).forEach(function (loc) {
			var s = pairSums(loc.pairs || []), st = sumsToStats(s);
			st.id = loc.id;
			out.push(st);
			net.n += s.n; net.so += s.so; net.ss += s.ss; net.se += s.se; net.se2 += s.se2;
			if (s.n) { X.push(st.obsMean); Y.push(st.simMean); }
		});
		return { locations: out, network: sumsToStats(net), r: correlation(X, Y) };
	}
	function correlation(X, Y) {
		var n = X.length, sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, i, d;
		if (n < 2) { return undefined; }
		for (i = 0; i < n; i++) {
			sx += X[i]; sy += Y[i]; sxx += X[i] * X[i]; syy += Y[i] * Y[i]; sxy += X[i] * Y[i];
		}
		d = (n * sxx - sx * sx) * (n * syy - sy * sy);
		if (!(d > 0)) { return undefined; }
		return (n * sxy - sx * sy) / Math.sqrt(d);
	}

	return {
		PARAMS: PARAMS,
		parseTime: parseTime,
		parse: parse,
		interp: interp,
		stats: stats,
		correlation: correlation
	};
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
