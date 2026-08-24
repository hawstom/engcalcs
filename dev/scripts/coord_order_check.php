<?php
/**
 * COORDINATE ORDER: system order is x,y = lon,lat; PUBLIC order is lat,lon.
 *
 * Tom, 2026-08-24, after finding a button that said "These are already lon/lat" and a status bar
 * that led with Longitude: *"It should be lat/lon everywhere... history says Lat/Lon."* Then, in the
 * same breath, the question this script is the answer to: *"can we systematize awareness with a good
 * and conventional naming standard for system/math vs public?"*
 *
 * THE STANDARD, IN ONE LINE: **the order follows whoever is reading.**
 *
 *   - **System order — lon, lat.** x is longitude and y is latitude; that is arithmetic, it matches
 *     GeoJSON and every projection formula, and it is not up for debate. Anything computed, stored,
 *     projected or exported is in this order, and an identifier holding such a pair is named to say
 *     so: `lonLat`, `{lon, lat}`, `fromLonLat()`.
 *   - **Public order — lat, lon.** Every place a person READS a pair or TYPES one: the status
 *     readout, the property popup, the Go-to prompt, prose that names the two. An identifier that
 *     holds or builds one is named `latLon`.
 *   - **A bare `coords` or `point` is the defect**, because it commits to neither and the next
 *     reader has to guess. The name is the documentation.
 *
 * THE ONE EXCEPTION, AND IT IS WHY THIS CHECK IS NOT A GREP FOR "latitude" COMING FIRST: a sentence
 * that PAIRS the two with x and y is making a positional claim -- "the x and y in this file really
 * are a longitude and a latitude" -- and reversing it makes it factually wrong. Three shipped
 * strings do exactly that and are correct. So the rule is: longitude may precede latitude only in a
 * string that also names x and y.
 *
 * WHAT IS CHECKED
 *   1. Every English `$ec_lang` value naming both concepts (words, or the lat/lon abbreviation).
 *   2. Every JS expression that builds a readout from `lpn_field_lat` and `lpn_field_lon`.
 * English only, deliberately: it is the source, and another language's word order is its own.
 */
$root = __DIR__ . '/../..';
require_once $root . '/lib/lang.ec.en.php';

$bad = [];

// ---- 1. the language file ---------------------------------------------------------------------
foreach ($ec_lang as $key => $value) {
    if (!is_string($value)) { continue; }
    $lat = stripos($value, 'latitude');
    $lon = stripos($value, 'longitude');
    if ($lat !== false && $lon !== false && $lon < $lat) {
        // The positional exception: it may say longitude first if it is saying which of x and y is
        // which. Anything else is naming the pair for a reader, and the reader's order is lat first.
        if (!preg_match('/\bx and y\b|\bx, y\b|\bX and Y\b|\bx\b[^.]{0,30}\by\b/i', $value)) {
            $bad[] = [$key, 'longitude is named before latitude, and the string does not pair them with x and y'];
        }
    }
    if (stripos($value, 'lon/lat') !== false) {
        $bad[] = [$key, 'the abbreviation reads lon/lat; a person reads lat/lon'];
    }
}

// ---- 2. the readouts ----------------------------------------------------------------------------
// A display that concatenates the two labels must put the latitude label first. Read off the source
// rather than off a list of files, so a third readout joins this check by existing.
foreach (glob($root . '/js/*.js') as $file) {
    $src = file_get_contents($file);
    // Both keys inside one statement -- the widest thing that can be one line of readout.
    foreach (preg_split('/;\s*\n/', $src) as $stmt) {
        $a = strpos($stmt, 'lpn_field_lat');
        $b = strpos($stmt, 'lpn_field_lon');
        if ($a !== false && $b !== false && $b < $a) {
            $bad[] = [basename($file), 'a readout builds longitude before latitude'];
        }
    }
}

if (!$bad) {
    echo "PASS: every coordinate a person reads is latitude first; system pairs stay x,y = lon,lat.\n";
    exit(0);
}
echo "COORDINATE ORDER (" . count($bad) . "):\n\n";
foreach ($bad as $b) { printf("  %-32s %s\n", $b[0], $b[1]); }
echo "\nSystem order is x,y = lon,lat and stays that way -- it is arithmetic, and every stored,\n";
echo "projected or exported pair uses it. PUBLIC order is lat,lon: the status readout, the popup,\n";
echo "the Go-to prompt, and any prose that merely names the two. Name the variable for its order\n";
echo "(lonLat / latLon) and the boundary between them becomes visible instead of remembered.\n";
echo "\nThe one legitimate longitude-first sentence PAIRS the two with x and y -- \"the x and y in\n";
echo "this file really are a longitude and a latitude\" -- because there the order IS the claim.\n";
echo "If that is what you meant, say x and y in the string and this check will agree with you.\n";
exit(1);
