<?php
/**
 * generate_examples.php — build the served examples library from the authoring folder.
 *
 *   php dev/scripts/generate_examples.php            # write examples/ from dev/water-network-examples/
 *   php dev/scripts/generate_examples.php --check    # exit 1 if the served copy is stale
 *
 * ROADMAP Task 314. Reads every whitelisted saved project out of dev/water-network-examples/ and
 * writes, into the web-served examples/ directory:
 *
 *   examples/<Name>-lpn.json   a byte copy of the project, which is what the gallery opens
 *   examples/manifest.json     title, description, units, counts and thumbnail for each
 *   examples/<Name>.svg        a generated line-drawing thumbnail
 *
 * WHY A COPY RATHER THAN SERVING dev/ DIRECTLY. dev/.htaccess is `Require all denied`, so nothing
 * under dev/ is reachable over HTTP at all. The three ways out were a child .htaccess granting
 * access, a PHP endpoint that echoes the file, or this. The child .htaccess is the tempting one --
 * no copy, no build step -- and it is the one that can take the whole suite down: CLAUDE.md's
 * deploy section records that a .htaccess directive the host has not granted returns 500 for EVERY
 * request under /engcalcs/, not a quiet ignore. A generated copy has no such failure mode, and the
 * manifest had to be generated from the files anyway (a hand-kept index and a folder of files
 * drift, silently), so the copy rides along for free.
 *
 * THE THUMBNAIL IS GENERATED FROM THE PROJECT, NEVER COMMITTED AS AN IMAGE. That is the difference
 * between a thumbnail that is always right and one that is right until somebody edits the example.
 * It is deliberately a plain SVG line drawing rather than a render of the real map: it needs no
 * fonts, no backdrop image, no solver, and it stays a few KB, which is what lets a wall of them
 * load at once.
 *
 * The DESCRIPTION is the one thing here a machine cannot derive, so it is the one thing kept by
 * hand -- in descriptions.json beside the projects, keyed by file name. A missing description is
 * reported, not invented: an examples wall whose subtitles were auto-generated from node counts
 * would say nothing a title does not already say.
 */

$root = dirname(__DIR__, 2);
$srcDir = $root . '/dev/water-network-examples';
$outDir = $root . '/examples';
$descFile = $srcDir . '/descriptions.json';
$check = in_array('--check', $argv, true);

/* The whitelist in the source folder's .gitignore IS the publication decision (see that file and
 * ROADMAP Task 314). Reading it here rather than globbing *.json means this script publishes
 * exactly what git publishes -- one list, not two that can disagree. A client model dropped into
 * that folder to test the .inp importer is invisible to both. */
function whitelistedExamples($srcDir) {
	$out = array();
	$gi = $srcDir . '/.gitignore';
	if (!is_file($gi)) { return $out; }
	foreach (file($gi, FILE_IGNORE_NEW_LINES) as $line) {
		$line = trim($line);
		if ($line === '' || $line[0] !== '!') { continue; }
		$name = substr($line, 1);
		if (substr($name, -5) !== '.json' || $name === 'descriptions.json') { continue; }
		if (is_file($srcDir . '/' . $name)) { $out[] = $name; }
	}
	sort($out);
	return $out;
}

/* Bounds of everything drawable, in the document's own coordinates. Nodes and link vertices both:
 * a bend far outside the node cloud is exactly the case a nodes-only box clips. */
function projectBounds($doc) {
	$b = array('minX' => INF, 'minY' => INF, 'maxX' => -INF, 'maxY' => -INF);
	$put = function ($x, $y) use (&$b) {
		if (!is_numeric($x) || !is_numeric($y)) { return; }
		$b['minX'] = min($b['minX'], $x); $b['maxX'] = max($b['maxX'], $x);
		$b['minY'] = min($b['minY'], $y); $b['maxY'] = max($b['maxY'], $y);
	};
	foreach (($doc['nodes'] ?? array()) as $n) { $put($n['x'] ?? null, $n['y'] ?? null); }
	foreach (($doc['links'] ?? array()) as $l) {
		foreach (($l['verts'] ?? array()) as $v) { $put($v['x'] ?? null, $v['y'] ?? null); }
	}
	return is_finite($b['minX']) ? $b : null;
}

/* A thumbnail, as a self-contained SVG string.
 *
 * DRAWN IN THE DOCUMENT'S OWN COORDINATES with a viewBox doing the fitting, rather than by scaling
 * every point in PHP. Elm Street's coordinates are state-plane values around 579,000 -- scaling
 * those by hand invites a precision mistake that would show up as a drawing collapsing to a dot,
 * and a viewBox has none of that arithmetic.
 *
 * **Y IS FLIPPED, because a v>=4 document is stored CARTESIAN and SVG is Y-DOWN.** serializeProject()
 * calls flipStoredY() on the way out for exactly this reason. Miss it and every thumbnail is a
 * correct drawing upside down -- which looks plausible enough on an unfamiliar network to survive
 * review, and is the one error here nobody would catch by eye. */
function thumbnailSvg($doc, $w = 320, $h = 200) {
	$b = projectBounds($doc);
	if (!$b) { return null; }
	$cartesian = ($doc['v'] ?? 0) >= 4;
	$fy = function ($y) use ($cartesian) { return $cartesian ? -$y : $y; };
	// Recompute vertical bounds after the flip; negating swaps min and max.
	$minY = $cartesian ? -$b['maxY'] : $b['minY'];
	$maxY = $cartesian ? -$b['minY'] : $b['maxY'];
	$dx = max($b['maxX'] - $b['minX'], 1e-9);
	$dy = max($maxY - $minY, 1e-9);
	$pad = max($dx, $dy) * 0.06;
	$vb = sprintf('%.4f %.4f %.4f %.4f', $b['minX'] - $pad, $minY - $pad, $dx + 2 * $pad, $dy + 2 * $pad);
	// Stroke and radius in DOCUMENT units, scaled off the drawing's own size -- the viewBox means
	// a fixed pixel value would be invisible on Elm Street and enormous on Net1.
	$s = max($dx, $dy);
	$stroke = $s * 0.006;
	$r = $s * 0.010;

	$byId = array();
	foreach (($doc['nodes'] ?? array()) as $n) { if (isset($n['id'])) { $byId[$n['id']] = $n; } }

	$parts = array();
	foreach (($doc['links'] ?? array()) as $l) {
		$a = $byId[$l['from'] ?? ''] ?? null;
		$z = $byId[$l['to'] ?? ''] ?? null;
		if (!$a || !$z) { continue; }
		$pts = array(array($a['x'], $fy($a['y'])));
		foreach (($l['verts'] ?? array()) as $v) {
			if (isset($v['x'], $v['y'])) { $pts[] = array($v['x'], $fy($v['y'])); }
		}
		$pts[] = array($z['x'], $fy($z['y']));
		$d = array();
		foreach ($pts as $p) { $d[] = sprintf('%.3f,%.3f', $p[0], $p[1]); }
		$parts[] = '<polyline points="' . implode(' ', $d) . '"/>';
	}
	$dots = array();
	foreach (($doc['nodes'] ?? array()) as $n) {
		if (!isset($n['x'], $n['y'])) { continue; }
		// Sources read differently from junctions -- on a thumbnail that is the only structural
		// thing worth distinguishing, and it is what makes a reservoir-fed network recognisable.
		$isSource = in_array($n['type'] ?? 'junction', array('reservoir', 'tank'), true);
		$dots[] = sprintf('<circle cx="%.3f" cy="%.3f" r="%.4f" class="%s"/>',
			$n['x'], $fy($n['y']), $isSource ? $r * 1.9 : $r, $isSource ? 'src' : 'jn');
	}
	/* currentColor throughout, so the page's own theme decides the ink and one file reads correctly
	 * in light and dark alike. A thumbnail with a baked-in colour is a thumbnail that is invisible
	 * in one of the two themes this suite has to render in. */
	return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' . $vb . '" width="' . $w . '" height="' . $h . '"'
		. ' preserveAspectRatio="xMidYMid meet" role="img">'
		. '<style>polyline{fill:none;stroke:currentColor;stroke-width:' . sprintf('%.5f', $stroke)
		. ';stroke-linecap:round;stroke-linejoin:round;opacity:.75}'
		. '.jn{fill:currentColor;opacity:.55}.src{fill:none;stroke:currentColor;stroke-width:'
		. sprintf('%.5f', $stroke) . '}</style>'
		. implode('', $parts) . implode('', $dots) . '</svg>';
}

$descriptions = is_file($descFile)
	? (json_decode(file_get_contents($descFile), true) ?: array())
	: array();

$files = whitelistedExamples($srcDir);
if (!$files) {
	fwrite(STDERR, "No whitelisted examples found in $srcDir\n");
	exit(1);
}

$manifest = array();
$written = array();
$problems = array();

foreach ($files as $name) {
	$raw = file_get_contents($srcDir . '/' . $name);
	$doc = json_decode($raw, true);
	if (!is_array($doc)) { $problems[] = "$name: not valid JSON"; continue; }
	if (($doc['format'] ?? '') !== 'hawsedc-lpn') {
		$problems[] = "$name: missing the format marker (run it through a save, or add it)";
	}
	$units = $doc['units'] ?? array();
	$flow = $units['lpn_u_flow'] ?? '';
	/* US vs SI is read off the FLOW unit, which is the one a water engineer actually recognises and
	 * the one the New-project menu already puts in its labels. Deriving it beats storing it: a
	 * stored system could disagree with the file it describes. */
	$system = in_array($flow, array('gpm', 'mgd', 'cfs', 'gpd'), true) ? 'us' : 'si';
	$title = $descriptions[$name]['title'] ?? preg_replace('/-lpn$/', '', pathinfo($name, PATHINFO_FILENAME));
	$desc = $descriptions[$name]['description'] ?? '';
	if ($desc === '') { $problems[] = "$name: no description in descriptions.json"; }

	$svg = thumbnailSvg($doc);
	$thumbName = preg_replace('/\.json$/', '.svg', $name);
	if ($svg === null) { $problems[] = "$name: nothing drawable, no thumbnail"; }

	$manifest[] = array(
		'file' => $name,
		'order' => (int)($descriptions[$name]['order'] ?? 0),
		'title' => $title,
		'description' => $desc,
		'system' => $system,
		'flow' => $flow,
		'nodes' => count($doc['nodes'] ?? array()),
		'links' => count($doc['links'] ?? array()),
		'thumb' => $svg === null ? null : $thumbName
	);
	$written[$name] = $raw;
	if ($svg !== null) { $written[$thumbName] = $svg; }
}

/* Biggest last is deliberate: a visitor scanning the wall should meet the small, legible networks
 * first and grow into Net3, rather than opening on the densest thing we ship.
 *
 * `order` in descriptions.json overrides that where size cannot express the intent. The two basics
 * are the same size, so size alone left their sequence to whatever the file system happened to
 * return -- and Tom wants SI FIRST on purpose (2026-08-14: "I like that the SI network comes first
 * since it's our only SI example"). An intent that survives only because a sort happens to be
 * stable is an intent that will silently flip; the explicit key is what makes it a decision. */
usort($manifest, function ($a, $b) {
	if ($a['order'] !== $b['order']) { return $a['order'] - $b['order']; }
	return ($a['nodes'] + $a['links']) - ($b['nodes'] + $b['links']);
});
$written['manifest.json'] = json_encode(
	array('v' => 1, 'generated' => 'dev/scripts/generate_examples.php', 'examples' => $manifest),
	JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";

if ($check) {
	$stale = array();
	foreach ($written as $file => $content) {
		$p = $outDir . '/' . $file;
		if (!is_file($p) || file_get_contents($p) !== $content) { $stale[] = $file; }
	}
	foreach (glob($outDir . '/*') as $p) {
		$base = basename($p);
		if ($base !== '.htaccess' && !isset($written[$base])) { $stale[] = $base . ' (no longer generated)'; }
	}
	if ($problems) { foreach ($problems as $p) { fwrite(STDERR, "  $p\n"); } }
	if ($stale) {
		fwrite(STDERR, "STALE: " . implode(', ', $stale) . "\n");
		fwrite(STDERR, "Run: php dev/scripts/generate_examples.php\n");
		exit(1);
	}
	if ($problems) { exit(1); }
	echo "FRESH (" . count($manifest) . " examples)\n";
	exit(0);
}

if (!is_dir($outDir) && !mkdir($outDir, 0755, true)) {
	fwrite(STDERR, "Cannot create $outDir\n");
	exit(1);
}
foreach ($written as $file => $content) { file_put_contents($outDir . '/' . $file, $content); }
/* Anything the generator no longer produces is removed, so a renamed or retired example does not
 * linger on the server being served to visitors after it has left the whitelist. */
foreach (glob($outDir . '/*') as $p) {
	$base = basename($p);
	if ($base !== '.htaccess' && !isset($written[$base])) { unlink($p); echo "  removed $base\n"; }
}
foreach ($manifest as $m) {
	printf("  %-30s %-3s %3d nodes %3d links  %s\n", $m['file'], $m['system'], $m['nodes'], $m['links'],
		$m['description'] === '' ? '(no description)' : $m['title']);
}
foreach ($problems as $p) { fwrite(STDERR, "  ! $p\n"); }
echo count($manifest) . " examples written to examples/\n";
exit($problems ? 1 : 0);
