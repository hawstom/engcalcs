// FILE > EXPORT DXF FILE IN A REAL CHROME: one click, one download, a drawing a CAD program reads.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/dxf-export-browser-harness.js
//   EC_DXF_BASE_URL=http://localhost:8115/engcalcs/ node dev/lpn-spike/dxf-export-browser-harness.js
//       (the same checks against a preview vhost: Apache, .htaccess and the service worker)
//   EC_EZDXF_PYTHON=/path/to/python-with-ezdxf  also runs ezdxf's recover + audit on each file.
//
// Tom, 2026-10-06, on the preview: *"It doesn't make a dxf for either Net1 or Net3. No downloads."*
// The DOM-stub harness (dxf-export-harness.js) passed, because its labels layer's `children` is an
// Array; a real SVG element's is an HTMLCollection, which has no forEach, so dxfLettering() threw.
// On a grid project the throw escaped the menu handler; on a lat/lon project it was thrown inside
// the coordinate loader's promise and swallowed, so the page did nothing at all. Only a real
// browser clicking the real menu row sees either. Asserted, on Net1 and on Net3 lat/lon:
//   (a) the File menu row gives exactly one download, a .dxf, and no uncaught page error;
//   (b) the file is ASCII DXF R2000 (AC1015) from SECTION to EOF;
//   (c) every block's ID attribute is visible and every other attribute invisible, each on its
//       own C-WATR-ATTR-* property layer (ID on C-WATR-ATTR-IDEN), every layer in the LAYER table;
//   (d) every ATTDEF is 1.0 high, and every INSERT's scale is the text height, so each ATTRIB is
//       that height in the drawing;
//   (e) the one text style is Standard, naming no font file (no arial.ttf, no txt.shx);
//   (f) a lat/lon project's coordinates are UTM metres, and both the status line and the read-me
//       note say they are not latitude and longitude.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DXF_EXPORT_BROWSER_LOCKED';
const NAME = 'dxf-export-browser-harness';
const BASE = process.env.EC_DXF_BASE_URL || '';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

// ---- a small DXF reader, written here and not borrowed from the writer -------------------------
function pairs(text) {
	const L = text.split(/\r?\n/), out = [];
	for (let i = 0; i + 1 < L.length; i += 2) { out.push([parseInt(L[i].trim(), 10), L[i + 1]]); }
	return out;
}
// Entities of one section as [{ type, g: [[code, value]...] }].
function section(P, name) {
	const ents = [];
	let i = 0;
	while (i < P.length && !(P[i][0] === 2 && P[i][1] === name && P[i - 1] && P[i - 1][1] === 'SECTION')) { i++; }
	for (i++; i < P.length && !(P[i][0] === 0 && P[i][1] === 'ENDSEC'); i++) {
		if (P[i][0] === 0) { ents.push({ type: P[i][1], g: [] }); } else if (ents.length) { ents[ents.length - 1].g.push(P[i]); }
	}
	return ents;
}
const get = (e, code) => { const p = e.g.find((q) => q[0] === code); return p ? p[1] : undefined; };
const getAll = (e, code) => e.g.filter((q) => q[0] === code).map((q) => q[1]);
const near = (a, b, rel) => Math.abs(a - b) <= (rel || 1e-9) * Math.max(1, Math.abs(a), Math.abs(b));

function ezdxfAudit(file) {
	const py = process.env.EC_EZDXF_PYTHON || 'python3';
	const r = spawnSync(py, ['-c', [
		'import sys',
		'try:',
		'    import ezdxf',
		'    from ezdxf import recover',
		'except ImportError:',
		'    print("NOEZDXF"); sys.exit(0)',
		'doc, auditor = recover.readfile(sys.argv[1])',
		'a = doc.audit()',
		'print("ERR", len(auditor.errors) + len(a.errors), "FIX", len(auditor.fixes) + len(a.fixes))',
		'for e in list(auditor.errors) + list(a.errors): print("  ", e.message)'
	].join('\n'), file], { encoding: 'utf8' });
	return (r.stdout || '') + (r.stderr || '');
}

async function exportOnce(a, card) {
	await a.openExampleCard(await a.lang(card));
	await a.settle(1500);
	const downloads = [];
	const onDl = (d) => downloads.push(d);
	a.page.on('download', onDl);
	const label = await a.lang('lpn_file_export_dxf');
	// The REAL row, clicked with the real mouse: Session.menuClick opens #lpn_menu_file and clicks.
	await a.menuClick(label, 'file');
	const t0 = Date.now();
	while (!downloads.length && Date.now() - t0 < 15000) { await a.page.waitForTimeout(200); }
	await a.page.waitForTimeout(1500);   // a second download, if one were coming
	a.page.off('download', onDl);
	const notice = await a.page.evaluate(() => (document.getElementById('lpn_map_notice') || {}).textContent || '');
	let text = null, name = '';
	if (downloads.length) {
		name = downloads[0].suggestedFilename();
		const p = await downloads[0].path();
		text = p ? fs.readFileSync(p, 'latin1') : null;
	}
	return { count: downloads.length, name, text, notice };
}

function checkDrawing(label, out, geo) {
	ok(label + ': exactly one download', out.count === 1, 'downloads: ' + out.count + '; notice: ' + JSON.stringify(out.notice));
	ok(label + ': it is a .dxf', /\.dxf$/.test(out.name), out.name);
	const T = out.text;
	if (!T) { ok(label + ': a drawing to read', false); return; }
	ok(label + ': SECTION ... EOF, R2000 (AC1015)', /^  0\r?\nSECTION\r?\n/.test(T) && /\r?\nEOF\r?\n$/.test(T) && /\$ACADVER\r?\n  1\r?\nAC1015\r?\n/.test(T));
	const P = pairs(T), hdr = section(P, 'HEADER'), tables = section(P, 'TABLES'),
		blocks = section(P, 'BLOCKS'), ents = section(P, 'ENTITIES');
	const layerNames = new Set(tables.filter((e) => e.type === 'LAYER').map((e) => get(e, 2)));
	// --- text style ---
	const styles = tables.filter((e) => e.type === 'STYLE');
	ok(label + ': one text style, Standard', styles.length === 1 && /^standard$/i.test(get(styles[0], 2)), styles.map((s) => get(s, 2)).join(','));
	ok(label + ': Standard names no font file (no arial.ttf, no txt.shx)', styles.length === 1 && !get(styles[0], 3) && !/arial|txt\.shx/i.test(T));
	// --- attributes ---
	const inserts = ents.filter((e) => e.type === 'INSERT');
	const attribs = ents.filter((e) => e.type === 'ATTRIB');
	const attdefs = blocks.filter((e) => e.type === 'ATTDEF');
	ok(label + ': blocks inserted, attributes attached', inserts.length > 0 && attribs.length > 0, inserts.length + ' inserts, ' + attribs.length + ' attributes');
	const ids = attribs.filter((e) => get(e, 2) === 'ID'), rest = attribs.filter((e) => get(e, 2) !== 'ID');
	ok(label + ': every ID attribute is visible (70 = 0)', ids.length > 0 && ids.every((e) => (+get(e, 70) & 1) === 0), ids.length + ' IDs');
	ok(label + ': every other attribute is invisible (70 = 1)', rest.length > 0 && rest.every((e) => (+get(e, 70) & 1) === 1), rest.length + ' others');
	const badLayer = attribs.filter((e) => {
		const lay = get(e, 8), tag = get(e, 2);
		return !/^C-WATR-ATTR-[A-Z]{4}$/.test(lay) || (tag === 'ID') !== (lay === 'C-WATR-ATTR-IDEN') || !layerNames.has(lay);
	});
	ok(label + ': each attribute on its own C-WATR-ATTR-* property layer, in the LAYER table', badLayer.length === 0,
		badLayer.slice(0, 3).map((e) => get(e, 2) + '@' + get(e, 8)).join(' '));
	const byTag = {};
	attribs.forEach((e) => { (byTag[get(e, 2)] = byTag[get(e, 2)] || new Set()).add(get(e, 8)); });
	ok(label + ': one layer per property (no tag split over two layers, no two tags sharing one)',
		Object.keys(byTag).every((t) => byTag[t].size === 1) &&
		new Set(Object.keys(byTag).map((t) => [...byTag[t]][0])).size === Object.keys(byTag).length,
		Object.keys(byTag).map((t) => t + '=' + [...byTag[t]].join('/')).join(' '));
	ok(label + ': every ATTDEF is 1.0 high and sits on its property layer', attdefs.length > 0 &&
		attdefs.every((e) => +get(e, 40) === 1 && /^C-WATR-ATTR-/.test(get(e, 8))), attdefs.length + ' attdefs');
	const th = +get(hdr.find((e) => e.g.some((q) => q[1] === '$TEXTSIZE')) || { g: [] }, 40) ||
		+((/\$TEXTSIZE\r?\n 40\r?\n([^\r\n]+)/.exec(T) || [])[1]);
	const attInserts = inserts.filter((e) => get(e, 66) === '1' || +get(e, 66) === 1);
	ok(label + ': every attributed INSERT is scaled to the text height ($TEXTSIZE ' + th + ')',
		th > 0 && attInserts.length > 0 && attInserts.every((e) => near(+get(e, 41), th) && near(+get(e, 42), th)));
	ok(label + ': so every ATTRIB is the text height in the drawing', attribs.every((e) => near(+get(e, 40), th)));
	// --- coordinates ---
	const xs = inserts.map((e) => +get(e, 10)), ys = inserts.map((e) => +get(e, 20));
	const notes = ents.filter((e) => e.type === 'TEXT' && get(e, 8) === 'C-WATR-RDME').map((e) => get(e, 1)).join(' | ');
	if (geo) {
		ok(label + ': coordinates are UTM metres, not degrees (easting 100 000..900 000, northing > 1 000 000)',
			xs.every((x) => x > 1e5 && x < 9e5) && ys.every((y) => y > 1e6), 'x ' + Math.min(...xs).toFixed(0) + '..' + Math.max(...xs).toFixed(0));
		ok(label + ': the read-me note says they are not latitude and longitude', /UTM zone/.test(notes) && /not latitude and longitude/i.test(notes), notes.slice(0, 240));
		ok(label + ': and so does the status line', /UTM zone/.test(out.notice) && /not latitude and longitude/i.test(out.notice), out.notice);
	} else {
		ok(label + ': the status line names the file', out.notice.indexOf(out.name) >= 0, out.notice);
	}
	ok(label + ': the read-me note states the block scale', /\b1\b/.test(notes) && notes.indexOf(String(+th.toPrecision(3))) >= 0, notes.slice(0, 400));
	const tmp = path.join(require('os').tmpdir(), NAME + '-' + process.pid + '-' + label.replace(/\W+/g, '_') + '.dxf');
	fs.writeFileSync(tmp, Buffer.from(T, 'latin1'));
	const audit = ezdxfAudit(tmp);
	if (/NOEZDXF/.test(audit) || !/ERR/.test(audit)) {
		console.log('  NOT RUN  ' + label + ': ezdxf audit (set EC_EZDXF_PYTHON to a Python with ezdxf)');
	} else {
		ok(label + ': ezdxf recover + audit: 0 errors', /ERR 0 /.test(audit), audit.trim().split('\n').slice(0, 4).join(' / '));
	}
	fs.unlinkSync(tmp);
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	if (!BASE) { await env.startServer(); }
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); if (!BASE) { env.stopServer(); } process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		for (const c of [{ card: 'lpn_ex_net1_title', label: 'Net1', geo: false }, { card: 'lpn_ex_net3_world_title', label: 'Net3 lat/lon', geo: true }]) {
			console.log('\n--- ' + c.label + (BASE ? ' at ' + BASE : '') + ' ---');
			const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 }, acceptDownloads: true });
			await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
			if (BASE) {
				await a.page.goto(BASE.replace(/\/?$/, '/') + 'Looped-Network.php?ec_nolog=1', { waitUntil: 'load' });
				await a.settle(1500);
			} else {
				await a.goto('Looped-Network.php?ec_nolog=1');
			}
			await a.answerTrainingPanel().catch(() => {});
			await a.page.evaluate(() => { const k = document.getElementById('ec-consent'); if (k) { k.remove(); } delete window.lpnDialogAnswerer; });
			await a.settle(800);
			const out = await exportOnce(a, c.card);
			checkDrawing(c.label, out, c.geo);
			ok(c.label + ': no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | ').slice(0, 400));
			await a.close();
		}
	} finally {
		await browser.close();
		if (!BASE) { env.stopServer(); }
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
