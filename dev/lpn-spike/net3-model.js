// The Net3 model, built exactly the way the page builds it — shared by every harness that needs a
// real extended-period run rather than a toy network.
//
// js/looped-network.js's assembleModel() is the page's edge: display units in, SI out. Net3 is a
// US file and this harness holds the document in the file's own units, so `toSI` here is the
// parser's own scale table -- read, never retyped, for the same reason validate_inp.js reads it.
// The points a named curve states, out of the parsed document's own library (Task 586).
function curvePointsFor(parsed, id) {
	if (!id) { return []; }
	const c = (parsed.curves || []).find((x) => x.id === id);
	return c ? EngCalcs.lpnCurvePoints(c) : [];
}
// At most three, sampled at the ends and the middle -- js/looped-network.js's pumpFitPoints().
function fitPts(pts) {
	if (pts.length <= 3) { return pts; }
	const s = pts.slice().sort((u, v) => u[0] - v[0]);
	return [s[0], s[Math.floor((s.length - 1) / 2)], s[s.length - 1]];
}

function buildModel(EngCalcs, parsed) {
	const S = parsed.scale;
	const unitFor = { lpn_u_elevhead: S.head, lpn_u_flow: S.flow, lpn_u_diameter: S.dia, lpn_u_length: S.len, lpn_u_pressure: S.press };
	const toSI = (v, id) => (typeof v === 'number' ? v * unitFor[id] : v);
	const nodes = parsed.nodes.map((n) => {
		if (n.type === 'tank') {
			return { id: n.id, type: 'tank', elev: n.elev * S.head, head: (n.elev + n.level) * S.head,
				level: n.level * S.head, minLevel: n.minLevel * S.head, maxLevel: n.maxLevel * S.head,
				diameter: n.diameter * S.head };
		}
		if (n.type === 'reservoir') {
			// A [RESERVOIRS] row states a HEAD and usually no elevation, and the document carries no
			// elev for one either. Multiplying the absent number gives NaN, which every `typeof x ===
			// 'number'` test in the suite calls a real elevation -- the profile would plot a NaN point.
			const r = { id: n.id, type: 'reservoir', head: n.head * S.head };
			if (typeof n.elev === 'number') { r.elev = n.elev * S.head; }
			return r;
		}
		return {
			id: n.id, type: 'junction', elev: n.elev * S.head,
			// The steady-state field carries the t=0 multiplier, as the page's does; the EPS path
			// reads demandBase and demandPattern instead and lets EPANET do the multiplying.
			demandBase: n.demand * S.flow,
			demandPattern: n.demandPattern || parsed.defaultPattern || null,
			demand: n.demand * S.flow, emitter: n.emitter
		};
	});
	const links = parsed.links.map((l) => {
		const out = { id: l.id, type: l.type, from: l.from, to: l.to,
			diameter: l.diameter * S.dia, roughness: l.roughness,
			length: (l.length || 0) * S.len, status: l.status, k: l.k || 0 };
		if (l.type === 'valve') {
			out.valveType = l.valveType;
			out.setting = l.settingUnit ? l.setting * S[l.settingUnit] : l.setting;
		}
		if (l.type === 'pump') {
			// The curve is the DOCUMENT'S (Task 586) and the pump names it. At most three points
			// reach the fit, exactly as pumpFit() samples a longer one on the page.
			const pts = curvePointsFor(parsed, l.curveId);
			const fit = pts.length
				? EngCalcs.lpnPumpFromCurve(fitPts(pts).map((pt) => [pt[0] * S.flow, pt[1] * S.head]))
				: { h0: 0, a: 0, b: 2 };
			out.h0 = fit.h0; out.a = fit.a; out.b = fit.b;
			out.curveSI = pts.map((pt) => [pt[0] * S.flow, pt[1] * S.head]);
		}
		if (l.type === 'valve' && String(l.valveType || '').toUpperCase() === 'GPV') {
			out.curvePoints = curvePointsFor(parsed, l.curveId)
				.map((pt) => [pt[0] * S.flow, pt[1] * S.head]);
		}
		return out;
	});
	const model = { nodes, links, method: 'hw', visc: 1.007e-6, emitterExponent: parsed.emitterExponent };
	model.time = EngCalcs.lpnTimeModelBlock(
		{ times: parsed.times, patterns: parsed.patterns, defaultPattern: parsed.defaultPattern, controls: parsed.controls },
		toSI);
	return model;
}

module.exports = { buildModel: buildModel };
