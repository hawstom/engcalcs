<?php
/**
 * Reference-table URLs, in one place (ROADMAP Task 500).
 *
 * These are the outside pages a calculator sends a user to when they need a NUMBER to type -- a
 * Manning n, a Hazen-Williams C, a Darcy-Weisbach roughness height, a minor-loss coefficient. They
 * are not display strings and must never go in lib/lang.ec.??.php: a URL is the same in every
 * language, and 27 copies of a 490-character query string is 27 chances to diverge. The LABEL and
 * the TIP stay in the lang files, exactly as they are; only the address lives here.
 *
 * Copyright 2009 Thomas Gail Haws
 *
 * LICENSE: GNU GPL v3 or later
 */

// Reached through ecRefUrl() rather than as a global, because three of the pages that need one of
// these (Manning-Irregular, Branched-Network, Irrigation-Pressure) build their row tables from
// inside a function, where a bootstrap global is simply not in scope -- and the symptom is a silent
// href="" rather than an error a visitor would notice.
function ecRefUrls() {
	return Array(

		// Manning's n. Twelve pages linked one of these before this file existed and FOUR of them wrote
		// it as http:// while two wrote https:// -- the exact silent divergence Task 500 was opened
		// about. https wins: the host serves it, and every other engineeringtoolbox link in the suite
		// was already https, so http was the outlier, not the convention.
		'manning_n' => 'https://www.engineeringtoolbox.com/mannings-roughness-d_799.html',

		// Hazen-Williams C.
		'hazen_williams_c' => 'https://www.engineeringtoolbox.com/hazen-williams-coefficients-d_798.html',

		// Darcy-Weisbach absolute roughness height e. EPA's own table, reachable only through NEPIS's
		// session-shaped query string -- 490 characters, unreadable, and impossible to eyeball for
		// drift. It was copied into five pages verbatim; this is why the task exists. Do not "tidy"
		// the parameters: every one of them is load-bearing to NEPIS's document server.
		'darcy_weisbach_e' => 'https://nepis.epa.gov/Exe/ZyNET.exe/P1007WWU.txt?ZyActionD=ZyDocument&Client=EPA&Index=2000%20Thru%202005&SearchMethod=1&TocRestrict=n&&IntQFieldOp=0&ExtQFieldOp=0&XmlQuery=&File=D%3A%5CZYFILES%5CINDEX%20DATA%5C00THRU05%5CTXT%5C00000024%5CP1007WWU.txt&User=ANONYMOUS&Password=anonymous&SortMethod=h%7C-&MaximumDocuments=1&FuzzyDegree=0&ImageQuality=r75g8/r75g8/x150y150g16/i425&Display=hpfr&DefSeekPage=x&SearchBack=ZyActionL&Back=ZyActionS&BackDesc=Results%20page&MaximumPages=1&ZyEntry=31',

		// Minor (local) loss coefficient k_m. One URL rather than three: k is one quantity whatever
		// friction method carries the pipe alongside it.
		'minor_loss_k' => 'https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html',

		// Kinematic viscosity of water against temperature.
		'kinematic_viscosity' => 'https://www.engineersedge.com/fluid_flow/kinematic-viscosity-table.htm',

		// Broad-crested weir coefficient C_w.
		'weir_coefficient' => 'http://epg.modot.org/files/b/bc/749_Broad-Crested_Weir_Coefficients.pdf',

		// Orifice discharge coefficient C_d. The two orifice PAGES link here; the same URL is also
		// embedded inside the or_notes_3_def string in all 27 lang files, which this file cannot
		// reach. That copy is a separate problem and wants its own task -- a URL inside a translated
		// string is 27 addresses that drift independently.
		'orifice_cd' => 'https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html',
	);
}

// One reference-table URL by name. An unknown name is a programming error, not a visitor-facing
// one, so it fails loudly here rather than rendering an empty href.
function ecRefUrl($name) {
	$urls = ecRefUrls();
	if (!isset($urls[$name])) {
		trigger_error('ecRefUrl(): no reference URL named "'.$name.'"', E_USER_WARNING);
		return '';
	}
	return $urls[$name];
}

// The roughness table a user needs depends on the friction method they picked, so Branched-Network
// and Looped-Network hand JS all three and retarget one anchor as the method changes. A Manning
// user sent to a Hazen-Williams C table is worse off than with no link at all. The keys are the
// method names the JS already switches on and are part of the pageConfig contract -- do not rename
// them here without changing js/branched-network.js and js/looped-network.js.
function ecRefRoughnessUrls() {
	return Array(
			'hw' => ecRefUrl('hazen_williams_c'),
			'manning' => ecRefUrl('manning_n'),
			'dw' => ecRefUrl('darcy_weisbach_e'),
	);
}
