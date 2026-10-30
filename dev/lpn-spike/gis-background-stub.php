<?php
/* A fake GIS server for gis-background-browser-harness.js (Task 720). Router for `php -S`.
 * Every request is appended to the file named by GIS_STUB_LOG. Tiles are one 1x1 PNG; the picture is
 * not the point, the request is. Tile and image answers carry NO CORS header on purpose (a utility's
 * server often has none); only the ArcGIS ?f=json answers do.
 *   /xyz/{z}/{x}/{y}.png                 an XYZ tile
 *   /wms?...REQUEST=GetMap               a WMS GetMap (LAYERS=roads answers; anything else is 400)
 *   /arc/tiled/MapServer?f=json          a service tiled in Web Mercator, copyright "Fake County GIS 2026"
 *   /arc/tiled/MapServer/tile/z/y/x      its tiles
 *   /arc/export/MapServer?f=json         an untiled service, copyright "Fake Export Dept"
 *   /arc/export/MapServer/export?...     its export
 *   /refuse/...                          503 for everything
 *   /log                                 the log, one request per line
 */
$png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);
$logFile = getenv('GIS_STUB_LOG');
if ($path === '/log') { header('Content-Type: text/plain'); echo $logFile && is_file($logFile) ? file_get_contents($logFile) : ''; return true; }
if ($logFile) { file_put_contents($logFile, $uri . "\n", FILE_APPEND | LOCK_EX); }
function image($png) { header('Content-Type: image/png'); echo $png; return true; }
if (strpos($path, '/refuse/') === 0) { http_response_code(503); echo 'no'; return true; }
if (preg_match('#^/xyz/\d+/\d+/\d+\.png$#', $path)) { return image($png); }
if ($path === '/wms') {
	if (($_GET['REQUEST'] ?? '') === 'GetMap' && ($_GET['LAYERS'] ?? '') === 'roads' && ($_GET['SRS'] ?? '') === 'EPSG:3857') { return image($png); }
	http_response_code(400); echo 'bad'; return true;
}
if ($path === '/arc/tiled/MapServer' || $path === '/arc/export/MapServer') {
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
	if ($path === '/arc/tiled/MapServer') {
		$lods = array(); for ($i = 0; $i <= 19; $i++) { $lods[] = array('level' => $i); }
		echo json_encode(array('copyrightText' => 'Fake County GIS 2026', 'singleFusedMapCache' => true,
			'tileInfo' => array('rows' => 256, 'cols' => 256, 'spatialReference' => array('wkid' => 102100, 'latestWkid' => 3857), 'lods' => $lods)));
	} else {
		echo json_encode(array('copyrightText' => 'Fake Export Dept', 'singleFusedMapCache' => false));
	}
	return true;
}
if (preg_match('#^/arc/tiled/MapServer/tile/\d+/\d+/\d+$#', $path)) { return image($png); }
if ($path === '/arc/export/MapServer/export' && ($_GET['bboxSR'] ?? '') === '3857' && ($_GET['imageSR'] ?? '') === '3857') { return image($png); }
http_response_code(404); echo 'not found'; return true;
