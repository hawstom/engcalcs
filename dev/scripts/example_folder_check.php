<?php
/**
 * What is sitting in dev/water-network-examples/ that we did not put there? — ROADMAP Task 314.
 *
 * **THIS REPLACED A DEFAULT-DENY `.gitignore`, and the trade is deliberate.** That file opened with
 * `*` and whitelisted six examples, because Tom drops real client water models in this directory to
 * stress-test the `.inp` importer — models carrying client names, real State Plane coordinates and
 * fire-flow results, in a repo that is on GitHub. The deny could not be forgotten.
 *
 * It could, however, quietly eat things: Tom put site plans behind Net2 and Net3 and they kept
 * disappearing, because a file the whitelist did not name was invisible to `git add`. He ruled on
 * 2026-08-18 that the folder never reaches production, that nothing leaves this machine without a
 * deliberate commit, and that a script watching the folder is the better shape.
 *
 * So this is that watch. It is ADVISORY — it names what it does not recognise and exits 0, because
 * an unrecognised file here is usually Tom's next test model and not a mistake. What it buys is that
 * such a file is announced on every run of check_all.sh, rather than waiting to be noticed in a diff.
 */
$dir = __DIR__ . '/../water-network-examples';
$known = array(
	'.gitignore', 'README.md', 'examples.json',
	// The published gallery, and the EPA sources two of them were built from. Anything else is new.
	'Basic-example-US-units.lwn', 'Basic-example-SI-units.lwn',
	'Net1.lwn', 'Net2.lwn', 'Net3.lwn', 'Net3-Novato-CA-World.lwn', 'Elm-Street-Center.lwn',
	'Net1.inp', 'Net2.inp', 'Net3.inp', 'Net3.rpt'
);
$strays = array();
foreach (scandir($dir) as $f) {
	if ($f === '.' || $f === '..') { continue; }
	if (substr($f, -16) === ':Zone.Identifier') { continue; }   // Windows download marker
	if (!in_array($f, $known, true)) { $strays[] = $f; }
}
if (!$strays) {
	echo "example folder clean -- " . count($known) . " known files, nothing unrecognised\n";
	exit(0);
}
echo "UNRECOGNISED in dev/water-network-examples/ (" . count($strays) . "):\n";
foreach ($strays as $f) {
	$p = $dir . '/' . $f;
	echo sprintf("   %-46s %8d bytes\n", $f, is_file($p) ? filesize($p) : 0);
}
echo "\nAdvisory, and usually harmless -- this is where test models are dropped. But this folder is\n";
echo "TRACKED, so anything above goes to GitHub if it is committed. A real client model must not.\n";
echo "Add it to \$known here once it is a deliberate part of the suite.\n";
exit(0);
