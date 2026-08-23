<?php
/**
 * icon_project_geom.php — emit the 'project' icon from ONE physical model.
 *
 * **THE MODEL IS A WIREFRAME, NOT A SET OF STROKES** (Tom, 2026-08-23). Six earlier rounds used a
 * stroke's WIDTH to stand for an object's thickness, and that model cannot hold: a stroke paints
 * symmetrically about a path, so the object's real boundary is at nominal ± w/2 — a number nobody
 * ever states. Two features of different thickness then cannot meet, because neither one's true edge
 * exists in the model. Drawing the wireframe those strokes implied exposed three contradictions at
 * once: the roll's core had been eaten to a 0.15 slit, its outer edge sat 1.25 units BELOW the
 * tabletop it rests on, and the "thick" bottom was a translated copy of a catenary, which is not
 * the same curve. Tom: *"if we wanted to get this (or any design) right from the beginning, we
 * should start with a wire frame (zero line widths or infinite resolution)."*
 *
 * So every dimension here is a real dimension, and there are exactly two kinds of thing:
 *   FILL   material seen edge-on. The roll (an annulus round its core), the fan of sheet edges at
 *          the right, and the stack lying on the table.
 *   EDGE   where material stops. One line each. A single sheet has no drawable thickness, so it
 *          never gets two.
 *
 * **FORESHORTENING IS DERIVED, NOT CHOSEN.** A round roll end drawn rx × ry declares the vertical
 * compression k = ry/rx. Anything lying FLAT is seen through that same k, so the stack's apparent
 * thickness is its real thickness × k. The fan is seen FACE-ON and is not foreshortened at all,
 * which is why it is visibly fatter than the bottom.
 *
 * **ONE MOTIF, COPIED.** The roll's upper arc (180°→290°), the catenary that leaves it along its
 * tangent, and the flat run to the title block, translated in y by `dy` — copied, never offset. An
 * offset curve is parallel at a constant perpendicular distance, which for a catenary is a different
 * curve. Only the BOTTOM copy closes underneath and shows its core; higher up the sheet in front
 * hides it. The middle copy is a fold on the face of the sheet and stops at the title block; the top
 * and bottom are edges of the sheet and run out to the fan.
 *
 *   php dev/scripts/icon_project_geom.php                 # the shipped numbers
 *   php dev/scripts/icon_project_geom.php --wire=0.6 --preview
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */

$P = array(
	'cx'      => 3.9,    'cy'    => 21.6,   // the roll, resting on the table
	'rx'      => 3.5,    'ry'    => 1.85,   // 2 : 1 -- a round end seen obliquely. k = ry/rx = 0.529
	'crx'     => 1.6,    'cry'   => 0.75,   // the core it is wound on
	'dy'      => 9.7,                        // between copies, read off Tom's own 1700-box wireframe
	'th0'     => 180.0,  'th1'   => 290.0,  // the roll's VISIBLE arc: leftmost, over the crown, to
	                                         // where the sheet leaves
	'lead'    => 2.4,                        // down the tangent. THIS is what makes the sheet HANG
	                                         // rather than step -- shortening it flattens the
	                                         // catenary into an S between two endpoints.
	'trail'   => 3.8,                        // back along the flat
	'xland'   => 11.4,   'yflat' => 23.3,    // where the bottom sheet flattens onto the table
	'xtb'     => 19.1,                       // title block, left edge
	'xfan'    => 21.9,   'xr'    => 23.6,    // the fan of sheet edges: inside, outside
	'stackreal' => 0.85,                     // REAL thickness of the stack; apparent = this × k
	'wire'    => 0.35,                       // the hairline. Every edge is one of these.
	'deco'    => 1,
);
foreach (array_slice($argv, 1) as $a) {
	if (preg_match('/^--([a-z]+)=(-?[\d.]+)$/', $a, $m) && isset($P[$m[1]])) { $P[$m[1]] = (float)$m[2]; }
}
$f  = function ($v) { return rtrim(rtrim(number_format($v, 3, '.', ''), '0'), '.'); };
$k  = $P['ry'] / $P['rx'];
$st = round($P['stackreal'] * $k, 2);
$W  = $f($P['wire']);

// An elliptical arc as cubics. `A` is deliberately not used: dev/scripts/icon_ascii_preview.php
// models M/L/H/V/C/Z only, so an arc written as `A` would be invisible to the one tool that checks
// this drawing -- which is exactly how a wrong version nearly shipped.
$cub = function ($cx, $cy, $rx, $ry, $t0, $t1, $segs) {
	$ept = function ($t) use ($cx, $cy, $rx, $ry) { return array($cx + $rx*cos($t), $cy + $ry*sin($t)); };
	$tan = function ($t) use ($rx, $ry) { return array(-$rx*sin($t), $ry*cos($t)); };
	$out = array();
	for ($i = 0; $i < $segs; $i++) {
		$a = $t0 + ($t1-$t0)*$i/$segs; $b = $t0 + ($t1-$t0)*($i+1)/$segs;
		$h = 4.0/3.0 * tan(($b-$a)/4.0);
		$p0 = $ept($a); $p3 = $ept($b); $ta = $tan($a); $tb = $tan($b);
		$out[] = array(array($p0[0]+$h*$ta[0], $p0[1]+$h*$ta[1]),
			array($p3[0]-$h*$tb[0], $p3[1]-$h*$tb[1]), $p3);
	}
	return array($ept($t0), $out);
};
$dof = function ($start, $cubs, $close, $off) use ($f) {
	$d = 'M' . $f($start[0]) . ' ' . $f($start[1] - $off);
	foreach ($cubs as $c) {
		$d .= 'C' . $f($c[0][0]) . ' ' . $f($c[0][1]-$off) . ' ' . $f($c[1][0]) . ' ' . $f($c[1][1]-$off)
			. ' ' . $f($c[2][0]) . ' ' . $f($c[2][1]-$off);
	}
	return $d . ($close ? 'Z' : '');
};

list($os, $oc) = $cub($P['cx'], $P['cy'], $P['rx'], $P['ry'], 0, 2*M_PI, 4);          // roll, outer
list($is, $ic) = $cub($P['cx'], $P['cy'], $P['crx'], $P['cry'], 0, 2*M_PI, 4);        // roll, core
$t0 = deg2rad($P['th0']); $t1 = deg2rad($P['th1']);
list($as, $ac) = $cub($P['cx'], $P['cy'], $P['rx'], $P['ry'], $t0, $t1, 3);           // roll, visible arc

$lv = array($P['cx'] + $P['rx']*cos($t1), $P['cy'] + $P['ry']*sin($t1));
$tv = array(-$P['rx']*sin($t1), $P['ry']*cos($t1));
$tl = sqrt($tv[0]*$tv[0] + $tv[1]*$tv[1]);
$k1 = array($lv[0] + $P['lead']*$tv[0]/$tl, $lv[1] + $P['lead']*$tv[1]/$tl);
$k2 = array($P['xland'] - $P['trail'], $P['yflat']);
$p3 = array($P['xland'], $P['yflat']);
$sag = function ($off, $xend) use ($f, $lv, $k1, $k2, $p3) {
	return 'M' . $f($lv[0]) . ' ' . $f($lv[1]-$off) . 'C' . $f($k1[0]) . ' ' . $f($k1[1]-$off)
		. ' ' . $f($k2[0]) . ' ' . $f($k2[1]-$off) . ' ' . $f($p3[0]) . ' ' . $f($p3[1]-$off)
		. 'H' . $f($xend);
};
$edge = function ($d) use ($W) { return '<path stroke-width="' . $W . '" d="' . $d . '"/>'; };

$ytop = $P['yflat'] - 2*$P['dy'];
$out = array();
// ---- FILLS ----
$out[] = '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="'
	. $dof($os, $oc, true, 0) . $dof($is, $ic, true, 0) . '"/>';
$out[] = '<rect x="' . $f($P['xfan']) . '" y="' . $f($ytop) . '" width="' . $f($P['xr']-$P['xfan'])
	. '" height="' . $f($P['yflat']-$ytop) . '" fill="currentColor" stroke="none"/>';
$out[] = '<path fill="currentColor" stroke="none" d="' . $sag(0, $P['xr'])
	. 'V' . $f($P['yflat']+$st) . 'H' . $f($p3[0])
	. 'C' . $f($k2[0]) . ' ' . $f($k2[1]+$st) . ' ' . $f($k1[0]) . ' ' . $f($k1[1]+$st)
	. ' ' . $f($lv[0]) . ' ' . $f($lv[1]+$st) . 'Z"/>';
// ---- EDGES ----
$out[] = $edge('M' . $f($P['cx']-$P['rx']) . ' ' . $f($P['cy']-2*$P['dy']) . 'V' . $f($P['cy']));
foreach (array(array(2*$P['dy'], $P['xr']), array($P['dy'], $P['xtb'])) as $c) {
	$out[] = $edge($dof($as, $ac, false, $c[0]));
	$out[] = $edge($sag($c[0], $c[1]));
}
$out[] = $edge($dof($os, $oc, true, 0));
$out[] = $edge($dof($is, $ic, true, 0));
$out[] = $edge($sag(0, $P['xr']));
$out[] = $edge('M' . $f($P['xfan']) . ' ' . $f($ytop) . 'V' . $f($P['yflat']));
$out[] = $edge('M' . $f($P['xr']) . ' ' . $f($ytop) . 'V' . $f($P['yflat']+$st));
$out[] = $edge('M' . $f($P['xtb']) . ' ' . $f($ytop) . 'V' . $f($P['yflat']));
$out[] = $edge('M20 10.2V15.6');
$out[] = $edge('M20.9 11.6V14.1');
if ((int)$P['deco'] === 1) {
	$out[] = '<rect x="14.3" y="5.2" width="3" height="2.7" stroke-width="' . $W . '"/>';
	$out[] = $edge('M13.2 19.4H17.6');
	$out[] = $edge('M13.2 20.8H17.6');
}
$geom = implode('', $out);
echo $geom, "\n";
if (in_array('--preview', $argv, true)) {
	require_once(__DIR__ . '/icon_ascii_preview.php');
	foreach (array(17, 24) as $s) {
		echo "\n(candidate) @ {$s}px\n" . str_repeat('-', $s * 2) . "\n" . ec_ap_render($geom, $s);
	}
}
