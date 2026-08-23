<?php
/**
 * icon_ascii_preview.php — render an $ec_icons entry as an ASCII coverage grid.
 *
 * WHY THIS EXISTS. There is no rasterizer in the dev environment, so an icon change cannot be
 * looked at; it can only be measured. This samples the SVG's own semantics — for each pixel of a
 * target-size grid it supersamples the area and reports what fraction of it lies within half a
 * stroke width of any path — and prints the result. That is what tells you whether a gap drawn at
 * 24 units is still an OPEN GAP at 17 px, the size a menu row draws, which is the one question
 * six rounds of redrawing the 'project' icon kept getting wrong by eye.
 *
 * Usage:
 *   php dev/scripts/icon_ascii_preview.php project              # 17 and 24 px
 *   php dev/scripts/icon_ascii_preview.php project --size=17
 *   php dev/scripts/icon_ascii_preview.php --geom='<path d="..."/>' --size=17
 *
 * Reads the stroke width out of EC_ICON_OPEN_TAG rather than retyping it. Supports the subset the
 * set actually uses: path M/L/H/V/C/Z (absolute and relative), <circle>, <ellipse>, <rect>. An
 * element carrying its own stroke-width, fill, stroke-linecap or stroke-linejoin is honoured, so a
 * mitered corner and a butt end measure as what they actually paint. Advisory tool, not a build check.
 */

require_once(__DIR__ . '/../../lib/Icons.lib.php');

// ---- tiny SVG geometry sampler -------------------------------------------------

function ec_ap_flatten_cubic($p0, $p1, $p2, $p3, $n = 24) {
	$pts = array();
	for ($i = 0; $i <= $n; $i++) {
		$t = $i / $n; $u = 1 - $t;
		$pts[] = array(
			$u*$u*$u*$p0[0] + 3*$u*$u*$t*$p1[0] + 3*$u*$t*$t*$p2[0] + $t*$t*$t*$p3[0],
			$u*$u*$u*$p0[1] + 3*$u*$u*$t*$p1[1] + 3*$u*$t*$t*$p2[1] + $t*$t*$t*$p3[1]);
	}
	return $pts;
}

/** Parse a path "d" into a list of polylines (each a list of [x,y]). */
function ec_ap_path_polylines($d) {
	preg_match_all('/([MmLlHhVvCcZz])|(-?\d*\.?\d+(?:e-?\d+)?)/', $d, $m, PREG_SET_ORDER);
	$toks = array();
	foreach ($m as $t) { $toks[] = ($t[1] !== '') ? $t[1] : (float)$t[2]; }
	$polys = array(); $cur = array(); $x = 0; $y = 0; $sx = 0; $sy = 0; $cmd = '';
	$i = 0; $n = count($toks);
	$num = function() use (&$toks, &$i) { return (float)$toks[$i++]; };
	while ($i < $n) {
		if (is_string($toks[$i])) {
			$cmd = $toks[$i]; $i++;
			if ($cmd === 'Z' || $cmd === 'z') {
				$cur[] = array($sx, $sy);
				if (count($cur) > 1) { $polys[] = $cur; }
				$cur = array(array($sx, $sy)); $x = $sx; $y = $sy;
				continue;
			}
			if ($i >= $n) { break; }
		}
		$rel = ($cmd === strtolower($cmd));
		switch (strtoupper($cmd)) {
			case 'M':
				$nx = $num(); $ny = $num();
				$x = $rel ? $x + $nx : $nx; $y = $rel ? $y + $ny : $ny;
				if (count($cur) > 1) { $polys[] = $cur; }
				$cur = array(array($x, $y)); $sx = $x; $sy = $y;
				$cmd = $rel ? 'l' : 'L';
				break;
			case 'L':
				$nx = $num(); $ny = $num();
				$x = $rel ? $x + $nx : $nx; $y = $rel ? $y + $ny : $ny;
				$cur[] = array($x, $y);
				break;
			case 'H':
				$nx = $num(); $x = $rel ? $x + $nx : $nx; $cur[] = array($x, $y);
				break;
			case 'V':
				$ny = $num(); $y = $rel ? $y + $ny : $ny; $cur[] = array($x, $y);
				break;
			case 'C':
				$a = $num(); $b = $num(); $c = $num(); $e = $num(); $f = $num(); $g = $num();
				$p1 = $rel ? array($x+$a, $y+$b) : array($a, $b);
				$p2 = $rel ? array($x+$c, $y+$e) : array($c, $e);
				$p3 = $rel ? array($x+$f, $y+$g) : array($f, $g);
				$seg = ec_ap_flatten_cubic(array($x, $y), $p1, $p2, $p3);
				array_shift($seg);
				foreach ($seg as $p) { $cur[] = $p; }
				$x = $p3[0]; $y = $p3[1];
				break;
			default:
				$i++; // unsupported command: skip a token and keep going
		}
	}
	if (count($cur) > 1) { $polys[] = $cur; }
	return $polys;
}

function ec_ap_circle_poly($cx, $cy, $rx, $ry = null, $n = 96) {
	if ($ry === null) { $ry = $rx; }
	$p = array();
	for ($i = 0; $i <= $n; $i++) { $a = 2 * M_PI * $i / $n; $p[] = array($cx + $rx*cos($a), $cy + $ry*sin($a)); }
	return array($p);
}

/** Turn one geometry string into strokable polylines + filled polygons. */
function ec_ap_shapes($geom) {
	$strokes = array(); $fills = array();
	preg_match_all('/<(path|circle|rect|ellipse)\b([^>]*)>/', $geom, $els, PREG_SET_ORDER);
	foreach ($els as $el) {
		$tag = $el[1]; $attr = $el[2];
		$get = function($k) use ($attr) {
			return preg_match('/\b' . preg_quote($k, '/') . '="([^"]*)"/', $attr, $mm) ? $mm[1] : null; };
		$polys = array();
		if ($tag === 'path') { $polys = ec_ap_path_polylines((string)$get('d')); }
		elseif ($tag === 'circle') { $polys = ec_ap_circle_poly((float)$get('cx'), (float)$get('cy'), (float)$get('r')); }
		elseif ($tag === 'ellipse') { $polys = ec_ap_circle_poly((float)$get('cx'), (float)$get('cy'), (float)$get('rx'), (float)$get('ry')); }
		elseif ($tag === 'rect') {
			$x = (float)$get('x'); $y = (float)$get('y'); $w = (float)$get('width'); $h = (float)$get('height');
			$polys = array(array(array($x,$y), array($x+$w,$y), array($x+$w,$y+$h), array($x,$y+$h), array($x,$y)));
		}
		$fill = $get('fill'); $stroke = $get('stroke'); $sw = $get('stroke-width');
		$cap = $get('stroke-linecap'); $join = $get('stroke-linejoin');
		if ($fill !== null && $fill !== 'none') { foreach ($polys as $p) { $fills[] = $p; } }
		if ($stroke !== 'none') {
			foreach ($polys as $p) {
				$strokes[] = array('poly' => $p, 'w' => $sw === null ? null : (float)$sw,
					'cap' => $cap === null ? 'round' : $cap, 'join' => $join === null ? 'round' : $join);
				if ($join === 'miter') {
					$hw = ($sw === null ? ec_ap_default_stroke_width() : (float)$sw) / 2.0;
					foreach (ec_ap_miter_wedges($p, $hw) as $w) { $fills[] = $w; }
				}
			}
		}
	}
	return array($strokes, $fills);
}

/**
 * The extra paint a MITER join puts outside the round join the sampler models by default: at each
 * interior vertex, the quad [vertex, offset point, miter tip, offset point] on the outer side.
 * Returned as fill polygons. Exists because "sharp corner" is a claim about roughly a fifth of a
 * pixel at 17 px, which is exactly the size of claim that has to be measured rather than asserted.
 */
function ec_ap_miter_wedges($poly, $hw, $limit = 4.0) {
	$w = array();
	for ($j = 1; $j < count($poly) - 1; $j++) {
		list($ax, $ay) = $poly[$j-1]; list($bx, $by) = $poly[$j]; list($cx, $cy) = $poly[$j+1];
		$ux = $bx-$ax; $uy = $by-$ay; $ul = sqrt($ux*$ux+$uy*$uy);
		$vx = $cx-$bx; $vy = $cy-$by; $vl = sqrt($vx*$vx+$vy*$vy);
		if ($ul < 1e-9 || $vl < 1e-9) { continue; }
		$ux /= $ul; $uy /= $ul; $vx /= $vl; $vy /= $vl;
		$cross = $ux*$vy - $uy*$vx;
		if (abs($cross) < 1e-9) { continue; }          // straight through: no join at all
		$s = ($cross > 0) ? 1.0 : -1.0;                  // outer side of the turn
		$n1 = array($s*$uy, -$s*$ux); $n2 = array($s*$vy, -$s*$vx);
		$p1 = array($bx + $hw*$n1[0], $by + $hw*$n1[1]);
		$p2 = array($bx + $hw*$n2[0], $by + $hw*$n2[1]);
		// Intersect the two offset lines: p1 + t*u  =  p2 + r*v
		$t = (($p2[0]-$p1[0])*$vy - ($p2[1]-$p1[1])*$vx) / ($ux*$vy - $uy*$vx);
		$m = array($p1[0] + $t*$ux, $p1[1] + $t*$uy);
		$d = sqrt(($m[0]-$bx)*($m[0]-$bx) + ($m[1]-$by)*($m[1]-$by));
		if ($d > $limit * $hw) { continue; }             // past stroke-miterlimit: renders as bevel
		$w[] = array(array($bx,$by), $p1, $m, $p2, array($bx,$by));
	}
	return $w;
}

function ec_ap_dist2_seg($px, $py, $ax, $ay, $bx, $by) {
	$dx = $bx - $ax; $dy = $by - $ay;
	$l2 = $dx*$dx + $dy*$dy;
	if ($l2 == 0) { $qx = $ax; $qy = $ay; }
	else {
		$t = (($px-$ax)*$dx + ($py-$ay)*$dy) / $l2;
		if ($t < 0) { $t = 0; } elseif ($t > 1) { $t = 1; }
		$qx = $ax + $t*$dx; $qy = $ay + $t*$dy;
	}
	return ($px-$qx)*($px-$qx) + ($py-$qy)*($py-$qy);
}

/** True unless the point lies past the polyline's own first or last endpoint (butt-cap clipping). */
function ec_ap_within_ends($px, $py, $poly, $k, $n) {
	// A closed ring has no ends to clip; without this the seam of a <circle> would lose a wedge.
	if (abs($poly[0][0]-$poly[$n-1][0]) < 1e-9 && abs($poly[0][1]-$poly[$n-1][1]) < 1e-9) { return true; }
	if ($k === 1) {
		$dx = $poly[1][0]-$poly[0][0]; $dy = $poly[1][1]-$poly[0][1];
		if (($px-$poly[0][0])*$dx + ($py-$poly[0][1])*$dy < 0) { return false; }
	}
	if ($k === $n - 1) {
		$dx = $poly[$n-1][0]-$poly[$n-2][0]; $dy = $poly[$n-1][1]-$poly[$n-2][1];
		if (($px-$poly[$n-1][0])*$dx + ($py-$poly[$n-1][1])*$dy > 0) { return false; }
	}
	return true;
}

function ec_ap_in_poly($px, $py, $poly) {
	$in = false; $n = count($poly);
	for ($i = 0, $j = $n - 1; $i < $n; $j = $i++) {
		$xi = $poly[$i][0]; $yi = $poly[$i][1]; $xj = $poly[$j][0]; $yj = $poly[$j][1];
		$dy = ($yj - $yi); if ($dy == 0) { $dy = 1e-12; }
		if ((($yi > $py) != ($yj > $py)) && ($px < ($xj-$xi)*($py-$yi)/$dy + $xi)) { $in = !$in; }
	}
	return $in;
}

function ec_ap_default_stroke_width() {
	return preg_match('/stroke-width="([\d.]+)"/', EC_ICON_OPEN_TAG, $m) ? (float)$m[1] : 2.0;
}

/** @return string the ASCII grid, one line per pixel row (each pixel printed as two chars). */
function ec_ap_render($geom, $size, $sub = 4) {
	list($strokes, $fills) = ec_ap_shapes($geom);
	$defw = ec_ap_default_stroke_width();
	$unitsPerPx = 24.0 / $size;
	$ramp = array(' ', '.', ':', '*', '#');
	$out = '';
	for ($row = 0; $row < $size; $row++) {
		$line = '';
		for ($col = 0; $col < $size; $col++) {
			$hit = 0; $tot = $sub * $sub;
			for ($sy = 0; $sy < $sub; $sy++) {
				for ($sx = 0; $sx < $sub; $sx++) {
					$px = ($col + ($sx + 0.5)/$sub) * $unitsPerPx;
					$py = ($row + ($sy + 0.5)/$sub) * $unitsPerPx;
					$covered = false;
					foreach ($fills as $poly) { if (ec_ap_in_poly($px, $py, $poly)) { $covered = true; break; } }
					if (!$covered) {
						foreach ($strokes as $s) {
							$hw = (($s['w'] === null ? $defw : $s['w']) / 2.0);
							$hw2 = $hw * $hw;
							$poly = $s['poly']; $n = count($poly); $butt = ($s['cap'] === 'butt');
							for ($k = 1; $k < $n; $k++) {
								if (ec_ap_dist2_seg($px, $py, $poly[$k-1][0], $poly[$k-1][1], $poly[$k][0], $poly[$k][1]) > $hw2) { continue; }
								// A butt cap paints nothing past either end of the whole polyline; a
								// round one (the set's default) paints a half disc there.
								if ($butt && ($k === 1 || $k === $n - 1)
									&& !ec_ap_within_ends($px, $py, $poly, $k, $n)) { continue; }
								$covered = true; break 2;
							}
						}
					}
					if ($covered) { $hit++; }
				}
			}
			$idx = (int)round(($hit / $tot) * (count($ramp) - 1));
			$line .= $ramp[$idx] . $ramp[$idx];   // doubled: a terminal cell is about 2:1 tall
		}
		$out .= $line . "\n";
	}
	return $out;
}

// ---- CLI -----------------------------------------------------------------------

if (PHP_SAPI === 'cli' && isset($argv) && realpath($argv[0]) === realpath(__FILE__)) {
	$geom = null; $name = null; $sizes = array(17, 24);
	foreach (array_slice($argv, 1) as $a) {
		if (strpos($a, '--geom=') === 0) { $geom = substr($a, 7); }
		elseif (strpos($a, '--size=') === 0) { $sizes = array_map('intval', explode(',', substr($a, 7))); }
		elseif ($a === '' || $a[0] !== '-') { $name = $a; }
	}
	if ($geom === null) {
		if ($name === null) {
			fwrite(STDERR, "usage: icon_ascii_preview.php <icon-name> [--size=17,24]\n"
				. "       icon_ascii_preview.php --geom='<path .../>' [--size=17]\n");
			exit(2);
		}
		if (!isset($ec_icons[$name])) { fwrite(STDERR, "no such icon: $name\n"); exit(1); }
		$geom = $ec_icons[$name];
	}
	foreach ($sizes as $s) {
		echo ($name === null ? '(--geom)' : $name) . " @ {$s}px\n";
		echo str_repeat('-', $s * 2) . "\n";
		echo ec_ap_render($geom, $s);
		echo "\n";
	}
}
