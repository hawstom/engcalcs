<?php
/**
 * Verifies js/data/epsg-projected.json against dev/vendor-manifest.json and against its own shape.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS A SEPARATE CHECK FROM vendor_integrity_check.php, which already verifies digests.
 * That one holds third-party CODE and asks three things of every entry that are meaningless here:
 * is the licence on the GPL-compatible allow list (these are IOGP data terms, not an OSI licence),
 * does the version match package.json (this did not come from npm), and are the bytes identical to
 * a published release (this file is DERIVED by our own generator, and nobody publishes a hash of
 * our derivation). Three waivers in one entry is a check nobody believes, so the manifest keeps a
 * separate `data` block and this reads it.
 *
 * OFFLINE, ALWAYS, and here that is a harder promise than usual: the generator needs a 10 MB
 * proj.db out of a pinned PyPI wheel, and production and every cold checkout have neither. So
 * `--check` CANNOT re-derive the file and must never pretend to. What it can prove is stated
 * plainly below, and the gap is the reason the wheel is pinned by hash in the manifest.
 *
 * WHAT A PASS PROVES:
 *   1. The committed file has not changed since it was committed  (sha384 against the manifest).
 *   2. It is well formed, and its own row count matches the manifest's and its own header's.
 *   3. Every row is [int code, non-empty name, w, s, e, n] with the bounds inside the real ranges
 *      and north above south.
 *   4. No duplicate codes -- a chooser keyed on code with two rows for one code shows whichever
 *      the loop reaches first, silently.
 *   5. No `(Meters)` in any name. Zero of the register's names contain it; it is an ESRI
 *      convention, and one appearing here would mean the generator had picked up the ESRI
 *      authority into a field claiming to be EPSG.
 *   6. The built-in fallback rows the page ships still resolve INSIDE this file, with the same
 *      name -- the leg that catches the two halves drifting apart. See below.
 *
 * WHAT A PASS DOES NOT PROVE: that the file matches the EPSG register. Only re-running
 * dev/scripts/generate_projection_catalogue.js against the pinned wheel proves that.
 *
 * ON LEG 6, WHICH IS THE ONE WORTH THE WORDS. js/looped-network.js keeps 183 rows built in, as the
 * answer when the fetch of this file fails -- the same shape the EPANET engine has, a rich path
 * and a working one. Two catalogues of the same thing is exactly the arrangement that drifts:
 * js_fallback_string_check.php exists because 892 English fallbacks drifted from the language file
 * and 199 disagreed on the day anybody first compared them. So the built-in names are compared
 * against the register's here, and a disagreement fails. A code the built-in table offers that the
 * register does not know is the serious direction -- it means we are minting a coordinate system.
 */

$root = realpath(__DIR__ . '/../..');
$dataPath     = $root . '/js/data/epsg-projected.json';
$manifestPath = $root . '/dev/vendor-manifest.json';
$pagePath     = $root . '/js/looped-network.js';

$fail = array();
$note = array();

function bail($msg) { fwrite(STDERR, "projection_catalogue_check: $msg\n"); exit(2); }

if (!is_readable($manifestPath)) { bail('cannot read dev/vendor-manifest.json'); }
$manifest = json_decode(file_get_contents($manifestPath), true);
if (!is_array($manifest) || !isset($manifest['data']) || !is_array($manifest['data'])) {
    bail("dev/vendor-manifest.json has no 'data' array; this check reads that block");
}
$entry = null;
foreach ($manifest['data'] as $d) {
    if (isset($d['path']) && $d['path'] === 'js/data/epsg-projected.json') { $entry = $d; break; }
}
if ($entry === null) { bail('no data entry for js/data/epsg-projected.json in the manifest'); }

if (!is_readable($dataPath)) {
    bail("js/data/epsg-projected.json is missing. Regenerate it:\n"
        . "  see the header of dev/scripts/generate_projection_catalogue.js");
}
$raw = file_get_contents($dataPath);

// ---- 1. integrity at rest ----------------------------------------------------------------------
$digest = base64_encode(hash('sha384', $raw, true));
if ($digest !== $entry['digest']) {
    $fail[] = "digest mismatch for js/data/epsg-projected.json\n"
        . "      manifest: " . $entry['digest'] . "\n"
        . "      on disk:  " . $digest . "\n"
        . "      The file changed. If you regenerated it deliberately, update the digest:\n"
        . "        openssl dgst -sha384 -binary js/data/epsg-projected.json | openssl base64 -A\n"
        . "      and update 'rows', 'epsg_version' and 'epsg_date' beside it. If you did NOT,\n"
        . "      somebody hand-edited a generated file -- revert it.";
}

// ---- 2. well formed, and the three row counts agree ---------------------------------------------
$doc = json_decode($raw, true);
if (!is_array($doc) || !isset($doc['crs']) || !is_array($doc['crs'])) {
    bail("js/data/epsg-projected.json is not valid JSON with a 'crs' array");
}
$rows = $doc['crs'];
$n = count($rows);
if (isset($doc['count']) && $doc['count'] !== $n) {
    $fail[] = "the file's own header says count=" . $doc['count'] . " and it holds $n rows";
}
if (isset($entry['rows']) && $entry['rows'] !== $n) {
    $fail[] = "the manifest says rows=" . $entry['rows'] . " and the file holds $n rows";
}
foreach (array('epsg_version', 'epsg_date') as $k) {
    if (isset($entry[$k], $doc[$k]) && $entry[$k] !== $doc[$k]) {
        $fail[] = "manifest $k is '" . $entry[$k] . "' and the file says '" . $doc[$k] . "'";
    }
}
if (empty($doc['attribution'])) {
    $fail[] = "the file states no attribution. The IOGP terms require acknowledgement of their\n"
        . "      ownership in any transmission of the dataset; the string is not decoration.";
}

// ---- 3, 4, 5. the rows themselves ---------------------------------------------------------------
$seen = array();
$bad = array();
$dupes = array();
$esri = array();
$byCode = array();
foreach ($rows as $i => $r) {
    if (!is_array($r) || count($r) !== 6) { $bad[] = "row $i is not a 6-element array"; continue; }
    list($code, $name, $w, $s, $e, $nlat) = $r;
    if (!is_int($code) || $code <= 0)        { $bad[] = "row $i has a non-integer code"; continue; }
    if (!is_string($name) || $name === '')   { $bad[] = "EPSG:$code has an empty name"; }
    foreach (array($w, $s, $e, $nlat) as $v) {
        if (!is_int($v) && !is_float($v))    { $bad[] = "EPSG:$code has a non-numeric bound"; continue 2; }
    }
    if ($s < -90 || $s > 90 || $nlat < -90 || $nlat > 90)   { $bad[] = "EPSG:$code latitude out of range"; }
    if ($w < -180 || $w > 180 || $e < -180 || $e > 180)     { $bad[] = "EPSG:$code longitude out of range"; }
    // North above south always. West/east is NOT checked the same way: an area of use that crosses
    // the antimeridian legitimately has west > east, and the register states several that way.
    if ($nlat <= $s)                                        { $bad[] = "EPSG:$code north is not above south"; }
    if (isset($seen[$code])) { $dupes[] = $code; } else { $seen[$code] = true; }
    if (is_string($name) && strpos($name, '(Meters)') !== false) { $esri[] = "EPSG:$code  $name"; }
    $byCode[$code] = $name;
}
if ($bad) {
    $fail[] = count($bad) . " malformed rows, first few:\n        " . implode("\n        ", array_slice($bad, 0, 8));
}
if ($dupes) {
    $fail[] = count($dupes) . " duplicate codes (" . implode(', ', array_slice($dupes, 0, 8)) . ").\n"
        . "      A chooser keyed on code shows whichever row the loop reaches first, silently.";
}
if ($esri) {
    $fail[] = count($esri) . " names carry '(Meters)', which is an ESRI convention and appears in\n"
        . "      zero EPSG names. The generator has picked up the wrong authority:\n        "
        . implode("\n        ", array_slice($esri, 0, 5));
}

// ---- 6. the built-in fallback table agrees with the register -------------------------------------
// The page's LPN_CRS_SINGLES rows are literal codes and names, so they can be read straight out of
// the source. The FAMILIES are base + zone with a {z} name pattern, so they are expanded here the
// same way crsCatalogue() expands them -- deliberately, because expanding them is what turns 6
// table rows into the 183 offers a user actually sees, and it is the offers that must be right.
if (!is_readable($pagePath)) { bail('cannot read js/looped-network.js'); }
$src = file_get_contents($pagePath);

$builtIn = array();   // code => name
if (preg_match('/var LPN_CRS_SINGLES = \[(.*?)\n\t\];/s', $src, $m)) {
    if (preg_match_all("/code:\s*'EPSG:(\d+)',\s*name:\s*'([^']*)'/", $m[1], $mm, PREG_SET_ORDER)) {
        foreach ($mm as $one) { $builtIn[(int)$one[1]] = $one[2]; }
    }
} else {
    $note[] = 'LPN_CRS_SINGLES not found in js/looped-network.js; the singles leg checked nothing';
}
if (preg_match('/var LPN_CRS_FAMILIES = \[(.*?)\n\t\];/s', $src, $m)) {
    $pat = "/\{\s*base:\s*(\d+),\s*first:\s*(\d+),\s*last:\s*(\d+),\s*name:\s*'([^']*)'/";
    if (preg_match_all($pat, $m[1], $mm, PREG_SET_ORDER)) {
        foreach ($mm as $one) {
            list(, $base, $first, $last, $name) = $one;
            for ($z = (int)$first; $z <= (int)$last; $z++) {
                $builtIn[(int)$base + $z] = str_replace('{z}', (string)$z, $name);
            }
        }
    }
} else {
    $note[] = 'LPN_CRS_FAMILIES not found in js/looped-network.js; the families leg checked nothing';
}

// EPSG:3857 is in the built-in list as the lat/lon project's own frame and is a live projected CRS
// like any other, so it is checked with the rest.
$missing = array();
$renamed = array();
foreach ($builtIn as $code => $name) {
    if (!isset($byCode[$code])) { $missing[] = "EPSG:$code  $name"; continue; }
    if ($byCode[$code] !== $name) { $renamed[] = "EPSG:$code\n          built in: $name\n          register: " . $byCode[$code]; }
}
if ($missing) {
    $fail[] = count($missing) . " built-in projections the register does not list as live.\n"
        . "      THIS IS THE SERIOUS DIRECTION: the page is offering a coordinate system that is\n"
        . "      deprecated or does not exist, and a user can save it into a file that every GIS\n"
        . "      will read without complaint. Fix the built-in table, not this check.\n        "
        . implode("\n        ", array_slice($missing, 0, 8));
}
if ($renamed) {
    $fail[] = count($renamed) . " built-in names disagree with the register's own.\n"
        . "      A name is what a GIS reader looks for character by character, so the two\n"
        . "      catalogues must not drift -- this is js_fallback_string_check.php's finding in\n"
        . "      another construct.\n        " . implode("\n        ", array_slice($renamed, 0, 5));
}

// ---- 7. the proj4 definitions beside it ---------------------------------------------------------
// **THE TRANSFORM HALF, AND THIS CHECK HOLDS ONLY WHAT AN OFFLINE READ CAN.** Whether the
// definitions are RIGHT is dev/lpn-spike/projection-defs-harness.js's question, and it needs
// js/vendor/proj4.js to answer it. What is asked here is the pair of things a harness would not
// notice: that the file is intact since it was committed, and that it was generated from the same
// register as the catalogue beside it. Two data files built from different EPSG releases would
// each be internally consistent and would disagree about which codes exist.
$defsEntry = null;
foreach ($manifest['data'] as $d) {
    if (isset($d['path']) && $d['path'] === 'js/data/epsg-proj4.json') { $defsEntry = $d; break; }
}
if ($defsEntry === null) {
    $fail[] = "no manifest entry for js/data/epsg-proj4.json.\n"
        . "      The definitions are third-party data and are recorded like the catalogue.";
} else {
    $defsPath = $root . '/js/data/epsg-proj4.json';
    if (!is_readable($defsPath)) {
        $fail[] = "js/data/epsg-proj4.json is missing. Regenerate it:\n"
            . "      see the header of dev/scripts/generate_projection_defs.js";
    } else {
        $draw = file_get_contents($defsPath);
        $ddig = base64_encode(hash('sha384', $draw, true));
        if ($ddig !== $defsEntry['digest']) {
            $fail[] = "digest mismatch for js/data/epsg-proj4.json\n"
                . "      manifest: " . $defsEntry['digest'] . "\n"
                . "      on disk:  " . $ddig . "\n"
                . "      Regenerated deliberately? Update the digest and 'rows' beside it.\n"
                . "      Otherwise somebody hand-edited a generated file -- revert it.";
        }
        $ddoc = json_decode($draw, true);
        if (!is_array($ddoc) || !isset($ddoc['defs']) || !is_array($ddoc['defs'])) {
            $fail[] = "js/data/epsg-proj4.json is not valid JSON with a 'defs' object";
        } else {
            $dn = count($ddoc['defs']);
            if (isset($ddoc['count']) && $ddoc['count'] !== $dn) {
                $fail[] = "the definitions file says count=" . $ddoc['count'] . " and holds $dn";
            }
            if (isset($defsEntry['rows']) && $defsEntry['rows'] !== $dn) {
                $fail[] = "the manifest says " . $defsEntry['rows'] . " definitions and the file holds $dn";
            }
            if (isset($ddoc['epsg_version'], $doc['epsg_version'])
                    && $ddoc['epsg_version'] !== $doc['epsg_version']) {
                $fail[] = "the two projection data files came from DIFFERENT EPSG releases:\n"
                    . "      catalogue " . $doc['epsg_version'] . ", definitions " . $ddoc['epsg_version'] . ".\n"
                    . "      Regenerate both from one proj.db; they disagree about which codes exist.";
            }
            $orphan = array();
            foreach (array_keys($ddoc['defs']) as $dc) {
                if (!isset($byCode[(int)$dc])) { $orphan[] = $dc; }
            }
            if ($orphan) {
                $fail[] = count($orphan) . " definitions name a CRS the catalogue does not list ("
                    . implode(', ', array_slice($orphan, 0, 6)) . ").\n"
                    . "      A transform nothing can choose, which means the two files disagree.";
            }
            if (empty($ddoc['attribution'])) {
                $fail[] = "js/data/epsg-proj4.json states no attribution; the IOGP terms require it.";
            }
        }
    }
}

// ---- report --------------------------------------------------------------------------------------
if ($note) { foreach ($note as $t) { echo "  note: $t\n"; } }
if ($fail) {
    fwrite(STDERR, "projection catalogue: " . count($fail) . " problem(s)\n");
    foreach ($fail as $f) { fwrite(STDERR, "  - $f\n"); }
    exit(1);
}
printf(
    "projection catalogue OK: %d live projected CRS, %d with a transform, EPSG %s (%s), %d built-in fallbacks all resolve\n",
    $n, (isset($ddoc['defs']) && is_array($ddoc['defs'])) ? count($ddoc['defs']) : 0,
    isset($doc['epsg_version']) ? $doc['epsg_version'] : '?',
    isset($doc['epsg_date']) ? $doc['epsg_date'] : '?', count($builtIn)
);
exit(0);
