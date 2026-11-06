// E2: patch a copy of js/lpn-collide.js so the first-fit remembers, per (label, side, pad), what the
// STATIC obstacles alone decide, and tests only the other labels' ground on a repeat.
//   node patch-prune.js <copy>/js/lpn-collide.js [--count] [--prune] [--verify]
// --count   counters in global.__E2 (tests against static vs other obstacles), no behaviour change.
// --prune   the table. --verify also runs the original tests beside it and throws on any difference.
// Static = a node or valve symbol box and a pipe segment of the call's input (the drawing, not a label).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs');
const f = process.argv[2], flags = process.argv.slice(3);
const COUNT = flags.indexOf('--count') >= 0, PRUNE = flags.indexOf('--prune') >= 0, VERIFY = flags.indexOf('--verify') >= 0;
let s = fs.readFileSync(f, 'utf8');
function rep(a, b) { if (s.split(a).length !== 2) { throw new Error('not exactly once: ' + a.slice(0, 70)); } s = s.replace(a, b); }
function cut(startMark, endMark, text) {
	const i = s.indexOf(startMark), j = s.indexOf(endMark, i);
	if (i < 0 || j < 0 || s.indexOf(startMark, i + 1) >= 0) { throw new Error('cut markers: ' + startMark.slice(0, 50)); }
	s = s.slice(0, i) + text + s.slice(j);
}

// ---- shared state, counters, class test -------------------------------------------------------
let shared = "\tvar curSeq = 0, inFF = 0, E2 = { clearBS: 0, clearBD: 0, clearLS: 0, clearLD: 0, onLinkS: 0, onLinkD: 0, thruS: 0, thruD: 0,\n" +
	"\t\townS: 0, ownD: 0, bodSym: 0, bodOther: 0, sibLink: 0, sibOther: 0, hit: 0, miss: 0, sigMiss: 0, skipBlocked: 0, buildMs: 0, tabs: 0, rows: 0 };\n" +
	"\t(typeof global !== 'undefined' ? global : window).__E2 = E2;\n" +
	"\tfunction isS(o) { return o._st === curSeq; }\n" +
	"\tfunction cnt(o, k) { if (inFF) { if (o._st === curSeq) { E2[k + 'S']++; } else { E2[k + 'D']++; } } }\n";
rep("\tfunction box(cx, cy, w, h, a, kind, owner) {", shared + "\tfunction box(cx, cy, w, h, a, kind, owner) {");

if (COUNT) {
	rep("\tfunction boxOverlapDepth(A, B) {\n", "\tfunction boxOverlapDepth(A, B) {\n\t\tif (A.kind === 'symbol' || B.kind === 'symbol') { E2.bodSym++; } else { E2.bodOther++; }\n");
	rep("\tfunction segmentInBoxFraction(seg, b) {\n", "\tfunction segmentInBoxFraction(seg, b) {\n\t\tif (seg.kind === 'link') { E2.sibLink++; } else { E2.sibOther++; }\n");
	rep("\t\t\tif (boxOverlapDepth(grown, o) > 0) {\n\t\t\t\tif (!o.yields) { return 'blocked'; }",
		"\t\t\tcnt(o, 'clearB');\n\t\t\tif (boxOverlapDepth(grown, o) > 0) {\n\t\t\t\tif (!o.yields) { return 'blocked'; }");
	rep("\t\t\tif (segmentInBoxFraction(o, grown) > 0) { return 'blocked'; }", "\t\t\tcnt(o, 'clearL');\n\t\t\tif (segmentInBoxFraction(o, grown) > 0) { return 'blocked'; }");
	// boxesOnLink: per (segment, row)
	rep("\t\t\tif (o.kind !== 'link') { continue; }\n\t\t\tif (o.owner !== undefined && o.owner === ownerId) { continue; }\n\t\t\tfor (i = 0; i < boxes.length; i++) {\n\t\t\t\tif (segmentInBoxFraction(o, boxes[i]) > 0) { return true; }",
		"\t\t\tif (o.kind !== 'link') { continue; }\n\t\t\tif (o.owner !== undefined && o.owner === ownerId) { continue; }\n\t\t\tfor (i = 0; i < boxes.length; i++) {\n\t\t\t\tcnt(o, 'onLink');\n\t\t\t\tif (segmentInBoxFraction(o, boxes[i]) > 0) { return true; }");
	rep("\t\t\tif (segmentInBoxFraction(g, o) > 0) { return true; }\n\t\t}\n\t\treturn false;\n\t}\n\n\t// ---- ROADMAP Task 539",
		"\t\t\tcnt(o, 'thru');\n\t\t\tif (segmentInBoxFraction(g, o) > 0) { return true; }\n\t\t}\n\t\treturn false;\n\t}\n\n\t// ---- ROADMAP Task 539");
	rep("\t\t\tfor (i = 0; i < boxes.length; i++) { if (segmentBoxDistance(o, boxes[i]) < own + margin) { return false; } }",
		"\t\t\tfor (i = 0; i < boxes.length; i++) { cnt(o, 'own'); if (segmentBoxDistance(o, boxes[i]) < own + margin) { return false; } }");
}

// ---- the call wrapper: tag the static obstacles, checksum them -----------------------------------
rep("\tfunction placeLabelsFirstFit(labels, obstacles, opts) {\n",
	"\tvar tabs = {}, tabKeys = [], curTab = null;\n" +
	"\tfunction placeLabelsFirstFit(labels, obstacles, opts) {\n" +
	"\t\tvar i, o, sum = 0, n = 0;\n" +
	"\t\tcurSeq++; inFF++;\n" +
	"\t\tfor (i = 0; i < obstacles.boxes.length; i++) {\n" +
	"\t\t\to = obstacles.boxes[i];\n" +
	"\t\t\tif (o.kind === 'symbol') { o._st = curSeq; n++; sum += o.cx * 1.1 + o.cy * 1.3 + o.w * 1.7 + o.h * 1.9 + (o.a || 0) * 2.3; }\n" +
	"\t\t}\n" +
	"\t\tfor (i = 0; i < obstacles.segments.length; i++) {\n" +
	"\t\t\to = obstacles.segments[i];\n" +
	"\t\t\tif (o.kind === 'link') { o._st = curSeq; n++; sum += o.ax * 1.1 + o.ay * 1.3 + o.bx * 1.7 + o.by * 1.9; }\n" +
	"\t\t}\n" +
	(PRUNE ? "\t\tvar tk = n + ':' + sum; curTab = tabs[tk];\n" +
		"\t\tif (!curTab) { curTab = tabs[tk] = { rows: {} }; tabKeys.push(tk); E2.tabs++; if (tabKeys.length > 12) { delete tabs[tabKeys.shift()]; } }\n" : "") +
	"\t\ttry { return placeLabelsFirstFit0(labels, obstacles, opts); } finally { inFF--; }\n" +
	"\t}\n" +
	"\tfunction placeLabelsFirstFit0(labels, obstacles, opts) {\n");

if (PRUNE) {
	// class-filtered verdict, the entry lookup, then the two sweeps rewritten
	const helpers =
		"\t// The verdict of boxClearOf() over only the static (wantS) or only the other obstacles in `obs`.\n" +
		"\tfunction clearOfClass(b, obs, pad, ownerId, wantS) {\n" +
		"\t\tvar grown = pad > 0 ? box(b.cx, b.cy, b.w + 2 * pad, b.h + 2 * pad, b.a) : b, i, o, yielding = false;\n" +
		"\t\tfor (i = 0; i < obs.boxes.length; i++) {\n" +
		"\t\t\to = obs.boxes[i];\n" +
		"\t\t\tif ((o._st === curSeq) !== wantS) { continue; }\n" +
		"\t\t\tif (o.owner !== undefined && o.owner === ownerId) { continue; }\n" +
		(COUNT ? "\t\t\tcnt(o, 'clearB');\n" : "") +
		"\t\t\tif (boxOverlapDepth(grown, o) > 0) {\n" +
		"\t\t\t\tif (!o.yields) { return 'blocked'; }\n" +
		"\t\t\t\tyielding = true;\n" +
		"\t\t\t}\n" +
		"\t\t}\n" +
		"\t\tfor (i = 0; i < obs.segments.length; i++) {\n" +
		"\t\t\to = obs.segments[i];\n" +
		"\t\t\tif (o.kind !== 'leader') { continue; }\n" +
		"\t\t\tif ((o._st === curSeq) !== wantS) { continue; }\n" +
		"\t\t\tif (o.owner !== undefined && o.owner === ownerId) { continue; }\n" +
		(COUNT ? "\t\t\tcnt(o, 'clearL');\n" : "") +
		"\t\t\tif (segmentInBoxFraction(o, grown) > 0) { return 'blocked'; }\n" +
		"\t\t}\n" +
		"\t\treturn yielding ? 'yielding' : 'clear';\n" +
		"\t}\n" +
		"\tfunction clearOfRows(boxes, obs, pad, ownerId, wantS) {\n" +
		"\t\tvar worst = 'clear', i, v;\n" +
		"\t\tfor (i = 0; i < boxes.length; i++) {\n" +
		"\t\t\tv = clearOfClass(boxes[i], obs, pad, ownerId, wantS);\n" +
		"\t\t\tif (v === 'blocked') { return 'blocked'; }\n" +
		"\t\t\tif (v === 'yielding') { worst = 'yielding'; }\n" +
		"\t\t}\n" +
		"\t\treturn worst;\n" +
		"\t}\n" +
		"\t// One table entry per (label id, side index, which sweep). It is trusted only while every number the\n" +
		"\t// answer depends on is the same; any difference resets it.\n" +
		"\tfunction entryOf(kind, lbl, c, i, padv) {\n" +
		"\t\tvar row = curTab.rows[lbl.id], e, nl = lbl.lines ? lbl.lines.length : 0, ls = 0, k, a = lbl.anchor, hr = hangsRight(lbl, c) ? 1 : 0;\n" +
		"\t\tif (!row) { row = curTab.rows[lbl.id] = [[], []]; E2.rows++; }\n" +
		"\t\tfor (k = 0; k < nl; k++) { ls += lbl.lines[k] > 0 ? lbl.lines[k] * (k + 1) : 0; }\n" +
		"\t\te = row[kind][i];\n" +
		"\t\tif (e && e.cx === c.x && e.cy === c.y && e.ax === a.x && e.ay === a.y && e.w === lbl.w && e.h === lbl.h && e.yo === lbl.yOff &&\n" +
		"\t\t\te.nl === nl && e.ls === ls && e.hr === hr && e.pad === padv && e.rc === lbl._reach) { E2.hit++; return e; }\n" +
		"\t\tif (e) { E2.sigMiss++; } else { E2.miss++; }\n" +
		"\t\te = row[kind][i] = { cx: c.x, cy: c.y, ax: a.x, ay: a.y, w: lbl.w, h: lbl.h, yo: lbl.yOff, nl: nl, ls: ls, hr: hr, pad: padv, rc: lbl._reach,\n" +
		"\t\t\tsv: null, onLink: -1, thru: -1 };\n" +
		"\t\treturn e;\n" +
		"\t}\n";
	rep("\t// The same question asked of a STAIRCASE (Task 406)", helpers + "\t// The same question asked of a STAIRCASE (Task 406)");

	const clean0 =
		"\t\tfunction staticVerdict(e, lbl, c, b, local, padv) {\n" +
		"\t\t\tif (e.sv === null) { var t0 = COUNT_T ? Date.now() : 0; e.sv = clearOfRows(b, local, padv, lbl.id, true); }\n" +
		"\t\t\treturn e.sv;\n" +
		"\t\t}\n" +
		"\t\tfunction onLinkOf(e, b, lbl) { if (e.onLink < 0) { e.onLink = boxesOnLink(b, local, lbl.id) ? 1 : 0; } return e.onLink === 1; }\n" +
		"\t\tfunction thruOf(e, lbl, c) { if (e.thru < 0) { e.thru = leaderThroughSymbol(lbl, c, local) ? 1 : 0; } return e.thru === 1; }\n" +
		"\t\tfunction placeClean0(lbl, a0) {\n" +
		"\t\t\tvar sides = sidesOf(lbl), i, c, b, verdict, first = -1, e, sv, dv, ov;\n" +
		"\t\t\tvar at = a0;\n" +
		"\t\t\tindex.near(a0.x, a0.y, lbl._reach, local);\n" +
		"\t\t\tfor (i = 0; i < sides.length; i++) {\n" +
		"\t\t\t\tc = sides[i];\n" +
		"\t\t\t\tlbl.anchor = c.anchor || a0;\n" +
		"\t\t\t\tif (lbl.anchor !== at) { at = lbl.anchor; index.near(at.x, at.y, lbl._reach, local); }\n" +
		"\t\t\t\te = entryOf(0, lbl, c, i, pad);\n" +
		"\t\t\t\tif (e.sv === 'blocked') {\n" +
		"\t\t\t\t\tE2.skipBlocked++;\n" +
		(VERIFY ? "\t\t\t\t\tif (boxesClearOf(labelLineBoxes(lbl, c), local, pad, lbl.id) !== 'blocked') { throw new Error('E2 verify: skipped side is not blocked'); }\n" : "") +
		"\t\t\t\t\tcontinue;\n" +
		"\t\t\t\t}\n" +
		"\t\t\t\tb = labelLineBoxes(lbl, c);\n" +
		"\t\t\t\tsv = staticVerdict(e, lbl, c, b, local, pad);\n" +
		"\t\t\t\tdv = sv === 'blocked' ? 'blocked' : clearOfRows(b, local, pad, lbl.id, false);\n" +
		"\t\t\t\tverdict = (sv === 'blocked' || dv === 'blocked') ? 'blocked' : ((sv === 'yielding' || dv === 'yielding') ? 'yielding' : 'clear');\n" +
		(VERIFY ? "\t\t\t\tif (boxesClearOf(b, local, pad, lbl.id) !== verdict) { throw new Error('E2 verify: verdict differs'); }\n" : "") +
		"\t\t\t\tif (verdict === 'blocked') { continue; }\n" +
		"\t\t\t\tif (first < 0) { first = i; }\n" +
		(VERIFY ? "\t\t\t\tif (onLinkOf(e, b, lbl) !== boxesOnLink(b, local, lbl.id) || thruOf(e, lbl, c) !== leaderThroughSymbol(lbl, c, local)) { throw new Error('E2 verify: link/symbol bit differs'); }\n" : "") +
		"\t\t\t\tif (verdict === 'clear' && !onLinkOf(e, b, lbl) && !thruOf(e, lbl, c) &&\n" +
		"\t\t\t\t\t\t(!strict || strictOk(lbl, c, b, true))) {\n" +
		"\t\t\t\t\treturn commit(lbl, sides, c, b);\n" +
		"\t\t\t\t}\n" +
		"\t\t\t}\n" +
		"\t\t\tstartAt[lbl.id] = first < 0 ? sides.length : first;\n" +
		"\t\t\treturn null;\n" +
		"\t\t}\n";
	cut("\t\tfunction placeClean0(lbl, a0) {", "\t\t// The last sweep, and the whole of the pass when `clean` is off", clean0.replace('var t0 = COUNT_T ? Date.now() : 0; ', ''));

	// placeAny0: edit the loop in place
	rep("\t\t\t\tif (c.cleanOnly) { continue; }\n\t\t\t\tlbl.anchor = c.anchor || a0;\n\t\t\t\tif (lbl.anchor !== at) { at = lbl.anchor; index.near(at.x, at.y, lbl._reach, local); }\n" +
		"\t\t\t\t// `leaderClean`: a label whose leader may never pass through another node's symbol, even\n" +
		"\t\t\t\t// here (a one-line node label, Task 734: its ring reaches further east and west).\n" +
		"\t\t\t\tif (lbl.leaderClean && leaderThroughSymbol(lbl, c, local)) { continue; }\n" +
		"\t\t\t\t// `offLinks`: a label no pipe may run through, even here (a one-line node label: a\n" +
		"\t\t\t\t// pipe through a line of text strikes it through, pre-review 2026-10-18).\n" +
		"\t\t\t\tif (lbl.offLinks && boxesOnLink(labelLineBoxes(lbl, c), local, lbl.id)) { continue; }\n" +
		"\t\t\t\t// The STAIRCASE, not the block (Task 406): asking about the block would call a side\n" +
		"\t\t\t\t// occupied because of ground the short rows never cover.\n" +
		"\t\t\t\tb = labelLineBoxes(lbl, c);\n" +
		"\t\t\t\tverdict = lbl.dragged ? 'clear' : boxesClearOf(b, local, strict ? lastPad : pad, lbl.id);\n",
		"\t\t\t\tif (c.cleanOnly) { continue; }\n\t\t\t\tlbl.anchor = c.anchor || a0;\n\t\t\t\tif (lbl.anchor !== at) { at = lbl.anchor; index.near(at.x, at.y, lbl._reach, local); }\n" +
		"\t\t\t\tpv = strict ? lastPad : pad;\n" +
		"\t\t\t\te = entryOf(1, lbl, c, i, pv);\n" +
		"\t\t\t\tif (lbl.leaderClean && thruOf(e, lbl, c)) { continue; }\n" +
		"\t\t\t\tb = labelLineBoxes(lbl, c);\n" +
		"\t\t\t\tif (lbl.offLinks && onLinkOf(e, b, lbl)) { continue; }\n" +
		"\t\t\t\tif (lbl.dragged) { verdict = 'clear'; }\n" +
		"\t\t\t\telse if (e.sv === 'blocked') { verdict = 'blocked'; E2.skipBlocked++; }\n" +
		"\t\t\t\telse {\n" +
		"\t\t\t\t\tsv = staticVerdict(e, lbl, c, b, local, pv);\n" +
		"\t\t\t\t\tdv = sv === 'blocked' ? 'blocked' : clearOfRows(b, local, pv, lbl.id, false);\n" +
		"\t\t\t\t\tverdict = (sv === 'blocked' || dv === 'blocked') ? 'blocked' : ((sv === 'yielding' || dv === 'yielding') ? 'yielding' : 'clear');\n" +
		"\t\t\t\t}\n" +
		(VERIFY ? "\t\t\t\tif ((lbl.dragged ? 'clear' : boxesClearOf(b, local, pv, lbl.id)) !== verdict) { throw new Error('E2 verify: any verdict differs'); }\n" : "") +
		(VERIFY ? "\t\t\t\tif (lbl.leaderClean && leaderThroughSymbol(lbl, c, local) !== thruOf(e, lbl, c)) { throw new Error('E2 verify: thru'); }\n" : "") +
		(VERIFY ? "\t\t\t\tif (lbl.offLinks && boxesOnLink(b, local, lbl.id) !== onLinkOf(e, b, lbl)) { throw new Error('E2 verify: offLinks'); }\n" : ""));
	rep("var sides = sidesOf(lbl), i, c, b, verdict, fallback = null, fallbackBox = null, fallbackAt = a0, fallbackAcross = false;",
		"var sides = sidesOf(lbl), i, c, b, verdict, fallback = null, fallbackBox = null, fallbackAt = a0, fallbackAcross = false, e, sv, dv, pv;");
}
fs.writeFileSync(f, s); console.log('patched ' + f + ' ' + flags.join(' '));
