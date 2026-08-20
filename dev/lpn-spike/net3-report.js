// EPA's own Net3.rpt, parsed. ONE parser, shared -- a second hand-written one is how a
// harness ends up accusing the code of its own bug: a rewrite of this that read column 4
// instead of column 3, and ignored whether the block was Nodes or Links, reported a 904 ft
// head error that was entirely the parser's (2026-08-19). See dev/testing-notes.md.
//
// The blocks are ordered and repeat under "(continued)" headers, so the parse keys on the TIME in
// the heading rather than on position, and merges continuations into the same frame.
function parseReport(text) {
	const frames = {};
	let cur = null, kind = null;
	for (const line of text.split(/\r?\n/)) {
		const h = /^\s*(Node|Link) Results at (\d+):(\d+) Hrs:/.exec(line);
		if (h) {
			const t = parseInt(h[2], 10) * 3600 + parseInt(h[3], 10) * 60;
			frames[t] = frames[t] || { t, head: {}, demand: {}, flow: {}, status: {} };
			cur = frames[t];
			kind = h[1];
			continue;
		}
		if (/^\s*(Page|Node|Link|-----|\*)/.test(line) || !line.trim() || !cur) {
			// A page break or a column header, not a row. The id test below is what really decides.
			if (/^\s*Page /.test(line)) { /* keep cur: the block continues overleaf */ }
			continue;
		}
		const p = line.trim().split(/\s+/);
		if (kind === 'Node' && p.length >= 4 && /^-?[.\d]+$/.test(p[1]) && /^-?[.\d]+$/.test(p[2])) {
			cur.demand[p[0]] = parseFloat(p[1]);
			cur.head[p[0]] = parseFloat(p[2]);
		} else if (kind === 'Link' && p.length >= 4 && /^-?[.\d]+$/.test(p[1]) && /^-?[.\d]+$/.test(p[2])) {
			cur.flow[p[0]] = parseFloat(p[1]);
			cur.status[p[0]] = p[4] || p[3];
		}
	}
	return frames;
}

module.exports = { parseReport: parseReport };
