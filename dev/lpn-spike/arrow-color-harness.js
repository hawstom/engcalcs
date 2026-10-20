// A FLOW ARROW IS PART OF ITS PIPE'S MARK -- ROADMAP Task 671.
//
//   node dev/lpn-spike/arrow-color-harness.js
//
// Tom, 2026-09-15: *"New task to make flow direction arrows follow link color."* The same ruling
// he made about the vertex dot on 2026-09-02 (*"Change vertex color too."*) and the same one the
// code already applied to a pump's icon, whose comment says the icon and the line "are one mark".
//
// **TWO HALVES, AND SHIPPING ONLY THE FIRST WOULD HAVE LOOKED FIXED.** With a thematic field on,
// the arrow must take the thematic colour; with it OFF, it must fall back to the map's ink like
// the pipe does -- and it did not, because the stylesheet said `#000` while `.lpn-link` said
// `var(--lpn-map-ink)`. So the arrow was already the wrong colour before any thematic map was
// switched on, and a JS-only fix would have left that standing.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const js = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css', 'engcalcs.css'), 'utf8');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

console.log('--- with no thematic field: the arrow takes the map ink, like the pipe ---');
const arrowRule = /^\.lpn-arrow \{([^}]*)\}/m.exec(css);
const linkRule = /^\.lpn-link \{([^}]*)\}/m.exec(css);
ok('.lpn-arrow has a rule', !!arrowRule);
ok('.lpn-link has a rule', !!linkRule);
if (arrowRule && linkRule) {
	const arrowStroke = /stroke:\s*([^;]+);/.exec(arrowRule[1]);
	const linkStroke = /stroke:\s*([^;]+);/.exec(linkRule[1]);
	ok('...and they name the SAME stroke',
		!!arrowStroke && !!linkStroke && arrowStroke[1].trim() === linkStroke[1].trim(),
		(arrowStroke && arrowStroke[1].trim()) + ' vs ' + (linkStroke && linkStroke[1].trim()));
	// The specific regression: a literal black, which is what it was.
	ok('...and it is not a hardcoded black', !/#000/.test(arrowRule[1]), arrowRule[1].trim());
	// It stays an OPEN chevron. A filled triangle reads as absorbed into the pipe, which is the
	// reason the shape was chosen; colouring it must not quietly become a licence to fill it.
	ok('...and it is still an open stroke, not filled', /fill:\s*none/.test(arrowRule[1]));
}

console.log('\n--- with a thematic field: the arrow takes that colour, from the one painter ---');
const paint = /function paintLinkColor\([\s\S]*?\n\t\}/.exec(js);
ok('paintLinkColor() exists', !!paint);
if (paint) {
	const body = paint[0];
	ok('...it paints the line', /le\.line\.style\.stroke = col;/.test(body));
	ok('...it paints the pump symbol', /le\.symbolSvg\.style\.color = col;/.test(body));
	ok('...and it paints the arrows', /le\.arrows/.test(body) && /\.style\.stroke = col/.test(body));
	// Every arrow, not the first: a bent pipe gets one chevron per straight run.
	ok('...every arrow on the link, not just one', /le\.arrows\.forEach/.test(body));
}

console.log('\n--- and the arrows really are a list on the link, one per segment ---');
ok('buildLinkEls records an arrow per polyline segment',
	/var segCount = l\.verts\.length \+ 1, arrows = \[\]/.test(js));
ok('...and hands them to the element record', /arrows: arrows,/.test(js));

console.log('\n--- the arrow is a DOUBLE CHEVRON: two stroked, closed, unfilled heads (Tom, 2026-10-20) ---');
const mk = /annotationEl\('path', \{\s*d: '([^']*)', fill: 'none',\s*'class': 'lpn-arrow'/.exec(js);
ok('the arrow is built as a <path> with fill none', !!mk);
if (mk) {
	ok('...with exactly two subpaths', (mk[1].match(/M/g) || []).length === 2, mk[1]);
	ok('...each closed (Z), so each head is a triangle, not an open ">"', (mk[1].match(/Z/g) || []).length === 2);
}
ok('the stylesheet does not fill it', !/fill:\s*(?!\s|none)/.test((/^\.lpn-arrow \{([^}]*)\}/m.exec(css) || ['', ''])[1]));

console.log('\n' + (fails ? fails + ' FAILED' : 'all checks passed'));
process.exit(fails ? 1 : 0);
