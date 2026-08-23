<?php
/**
 * icon_project_geom.php — emit the 'project' icon geometry from ONE motif.
 *
 * WHY A GENERATOR. Tom's construction (2026-08-23) is a single motif — the TOP HALF of the roll's
 * ellipse, the catenary that leaves it tangentially, and the horizontal run to the title block —
 * COPIED VERTICALLY. Copied, not offset: every point moves down by the same dy, so each copy is
 * congruent to the original. (An AutoCAD-style offset would make a parallel curve, which for a
 * catenary is a different curve, and that is the mistake the earlier renditions kept making.)
 * Identity is structural here: the copies come out of one parameter set differing only in dy.
 *
 * The roll is ONE roll, drawn as a fat line — every sheet in it collapses into that one stroke.
 * Its LOWER half exists only at the bottom copy, where it actually rests on the table; higher up
 * the sheets in front hide it, so those copies are an arc.
 *
 * Paste the output into $ec_icons['project'] and check it with icon_ascii_preview.php at 17 px.
 *
 *   php dev/scripts/icon_project_geom.php                 # the shipped numbers
 *   php dev/scripts/icon_project_geom.php --copies=2      # measure the alternative
 *   php dev/scripts/icon_project_geom.php --preview --ry=3
 */

$P = array(
	'xl'      => 2.0,    // leftmost roll centerline (a thick stroke paints to xl - wthick/2)
	'ytop'    => 2.0,    // the top copy's arc crown
	'ytable'  => 21.0,   // bottom sheet edge / tabletop centerline
	'rx'      => 4.8,
	'ry'      => 2.4,    // an oblique view of a round roll end. Major axis HORIZONTAL, 2 : 1 --
	                     // a circle here was the standing mistake, and a round roll seen at an angle
	                     // foreshortens vertically. 2.4 is also the flattest that leaves the bottom
	                     // ellipse a visible hole under a 3-wide stroke.
	'theta0'  => 180.0,  // the full top half. It can be 180 again now that the roll carries its own
	                     // straight back edge: the arcs land ON that line instead of floating
	                     // beside each other, so the crowding that forced 200 is gone.
	'theta'   => -52.0,  // where the sheet leaves the roll, degrees, SVG y-down (negative = above)
	'xland'   => 13.0,   // where the sag flattens onto the sheet
	'lead'    => 2.2,    // control-arm length along the roll's tangent
	'trail'   => 3.2,    // control-arm length back along the flat
	'xr'      => 21.2,   // fanned right edge
	'xtb'     => 16.6,   // title block upright
	'copies'  => 3,
	'wthick'  => 3.0,
	'wthin'   => 2.0,
);
foreach (array_slice($argv, 1) as $a) {
	if (preg_match('/^--([a-z]+)=(-?[\d.]+)$/', $a, $m) && isset($P[$m[1]])) { $P[$m[1]] = (float)$m[2]; }
}
$n = max(2, (int)$P['copies']);
$f = function($v) { return rtrim(rtrim(number_format($v, 3, '.', ''), '0'), '.'); };
$pt = function($p) use ($f) { return $f($p[0]) . ' ' . $f($p[1]); };

$cx      = $P['xl'] + $P['rx'];
$cyBot   = $P['ytable'] - $P['ry'];                  // the roll kisses the table
$cyTop   = $P['ytop'] + $P['ry'];                    // the top copy's crown kisses the icon's top
$dy      = ($cyBot - $cyTop) / ($n - 1);
$yTopRun = $P['ytable'] - ($n - 1) * $dy;

// Ellipse point and tangent at an angle, SVG y-down.
$ept = function($th) use ($cx, $cyBot, $P) {
	return array($cx + $P['rx']*cos($th), $cyBot + $P['ry']*sin($th)); };
$etan = function($th) use ($P) { return array(-$P['rx']*sin($th), $P['ry']*cos($th)); };

// The upper arc, as cubics: from the roll's leftmost point, over the crown, to where the sheet
// leaves. Standard circular-arc approximation, scaled by rx/ry: handle = (4/3)tan(dtheta/4).
$th0 = deg2rad($P['theta0']);                         // left end of the visible arc
$th1 = 2*M_PI + deg2rad($P['theta']);                 // the tangent point, going over the top
$segs = 3;
$arc = array();
for ($k = 0; $k < $segs; $k++) {
	$a = $th0 + ($th1-$th0)*$k/$segs; $b = $th0 + ($th1-$th0)*($k+1)/$segs;
	$h = 4.0/3.0 * tan(($b-$a)/4.0);
	$p0 = $ept($a); $p3 = $ept($b); $t0 = $etan($a); $t3 = $etan($b);
	$arc[] = array(array($p0[0]+$h*$t0[0], $p0[1]+$h*$t0[1]),
		array($p3[0]-$h*$t3[0], $p3[1]-$h*$t3[1]), $p3);
}
$arcStart = $ept($th0);

// The sag and the flat, hung off the same tangent point.
$p0 = $ept($th1);
$t  = $etan($th1); $tl = sqrt($t[0]*$t[0] + $t[1]*$t[1]);
$c1 = array($p0[0] + $P['lead']*$t[0]/$tl, $p0[1] + $P['lead']*$t[1]/$tl);
$c2 = array($P['xland'] - $P['trail'], $P['ytable']);
$p3 = array($P['xland'], $P['ytable']);

$up = function($p, $o) { return array($p[0], $p[1] - $o); };
$arcD = function($o) use ($arc, $arcStart, $up, $pt) {
	$d = 'M' . $pt($up($arcStart, $o));
	foreach ($arc as $s) { $d .= 'C' . $pt($up($s[0], $o)) . ' ' . $pt($up($s[1], $o)) . ' ' . $pt($up($s[2], $o)); }
	return $d;
};

$out = array();
// The roll. At the bottom it is a closed ellipse, because that is the one place its underside is
// not hidden behind the sheets in front of it; above, the same curve's top half only. Always the
// heavy stroke: one fat line is how the whole roll of sheets is drawn.
$out[] = '<ellipse cx="' . $f($cx) . '" cy="' . $f($cyBot) . '" rx="' . $f($P['rx'])
	. '" ry="' . $f($P['ry']) . '" stroke-width="' . $f($P['wthick']) . '"/>';
// **ONLY THE BOTTOM IS A STACK** (Tom, 2026-08-23: *"only the bottom needs extra thick lines to
// represent a stack of sheets"*). A copy higher up is one sheet's own edge wrapping the roll, so it
// takes the thin stroke; the earlier version copied the heavy weight up with the shape and made
// three stacks where there is one.
for ($i = 1; $i < $n; $i++) {
	$out[] = '<path stroke-width="' . $f($P['wthin']) . '" d="' . $arcD($i*$dy) . '"/>';
}
// **THE ROLL'S STRAIGHT BACK EDGE**, against the icon's left edge — the outside of the rolled stack,
// so it carries the heavy stroke. Without it the copies read as separate curves floating one above
// another instead of as one roll; it is also what lets theta0 go back to 180, because every arc now
// starts ON this line.
$out[] = '<path stroke-width="' . $f($P['wthick']) . '" stroke-linecap="butt" d="M'
	. $f($P['xl']) . ' ' . $f($cyTop) . 'V' . $f($cyBot) . '"/>';
// The fanned right edge and the bottom copy's sag and flat, as ONE mitered path, so the lower-right
// corner is a join and comes out square. Its butt top end stops one thin half-width short of the
// top run, so it lands flush with that edge rather than bulging a round cap past the corner above.
$out[] = '<path stroke-width="' . $f($P['wthick']) . '" stroke-linejoin="miter" stroke-linecap="butt"'
	. ' d="M' . $f($P['xr']) . ' ' . $f($yTopRun - $P['wthin']/2)
	. 'V' . $f($P['ytable']) . 'H' . $f($p3[0])
	. 'C' . $pt($c2) . ' ' . $pt($c1) . ' ' . $pt($p0) . '"/>';
// Every copy above the bottom: sag and flat are one sheet edge, so the light stroke. The top copy
// is the sheet's top edge and runs to the fanned right edge, carrying the upper-right corner as a
// join inside its own path; a middle copy is a fold on the face of the sheet and stops at the
// title block rather than crossing into it.
for ($i = 1; $i < $n; $i++) {
	$o = $i * $dy;
	$out[] = '<path stroke-linejoin="miter" d="M' . $pt($up($p0, $o)) . 'C' . $pt($up($c1, $o))
		. ' ' . $pt($up($c2, $o)) . ' ' . $pt($up($p3, $o))
		. 'H' . $f($i === $n - 1 ? $P['xr'] : $P['xtb']) . '"/>';
}
// The title block: one upright near the right edge. The sheet's own right, top and bottom edges
// close the box; nothing goes inside it.
$out[] = '<path d="M' . $f($P['xtb']) . ' ' . $f($yTopRun) . 'V' . $f($P['ytable']) . '"/>';

$geom = implode('', $out);
echo $geom, "\n";

// --preview draws the candidate straight away, at the two sizes that matter, without it having to
// be pasted into Icons.lib.php first. 17 px is the verdict; 24 px only shows the intent.
if (in_array('--preview', $argv, true)) {
	require_once(__DIR__ . '/icon_ascii_preview.php');
	foreach (array(17, 24) as $s) {
		echo "\n(candidate) @ {$s}px\n" . str_repeat('-', $s * 2) . "\n" . ec_ap_render($geom, $s);
	}
}
