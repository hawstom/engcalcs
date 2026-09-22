// TASK 667(b) — "ASK" DRIVEN FROM BOTH ENDS AT ONCE: B PRESSES IT, A HAS TO SEE IT.
//
//   node dev/lpn-spike/lock-ask-both-sides-harness.js
//
// Tom, 2026-09-18, after testing the shipped feature with a colleague: *"Asking is a nice idea. But
// I don't know how it will work (tunnel?). B asked, but A didn't see anything."*
//
// **EVERY PIECE OF IT WAS ALREADY TESTED AND THE FEATURE STILL DID NOT WORK.**
// dev/lpn-spike/lock-initials-harness.js asserts that B's press posts a `request`, that the broker
// records it, and that noteLockRequest() raises a banner when it is handed one. All of that passed
// on the day Tom found it broken, because each half was tested against a FAKE of the other half:
// B's press went to a fake broker, and A's banner was fed a reply written by the test. Nothing ever
// carried one press from one browser through the real server into the other browser's screen, and
// that carriage is where it broke. **So this harness runs the two users as two SEPARATE PROCESSES**
// -- separate localStorage, separate identity tokens, exactly as two browsers are -- with the real
// lpn-lock.php between them and no fake anywhere in the path.
//
// **WHAT IT CAUGHT, and both are silent by construction:**
//
//  1. **A RELOAD DESTROYED THE NOTE.** Closing a page releases its lock, and a reload is a close
//     followed by an open a second later. The release wrote empty request fields and then DELETED
//     the record, and the re-acquire counted as a new holder and cleared what was left -- so a note
//     left in that one-second gap was gone, unseen, while the colleague who left it had been told
//     they would be heard. Measured in a real headless browser before the fix.
//  2. **THE NOTE WAS STAMPED ON BY A STANDING WARNING.** One banner slot; a file whose connection
//     needs re-making writes into it on every tab switch and on boot. The ask is raised ONCE and
//     acknowledged in the same breath, so being overwritten meant being lost for good.
//
// **WHAT IT DELIBERATELY DOES NOT CLAIM.** It does not measure the minute. The heartbeat's timer is
// real time and asserting on it would buy a slow harness and a flaky one; what is asserted here is
// that a heartbeat COLLECTS the note, and dev/lpn-spike/browser-drive.js was used by hand to watch
// a real Chrome raise the banner 60 s after the ask.

const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..') + '/';
const SELF = __filename;

// ---------------------------------------------------------------------------
// One child process per user. The module is a singleton over `global` and over
// one localStorage, so two users in one process would share an identity token
// and the broker would call them the same person -- which is the bug, not the
// test. Two processes is what two browsers are.
// ---------------------------------------------------------------------------
function child(role) {
	const p = spawn(process.execPath, [SELF], { env: Object.assign({}, process.env, { LPN_ASK_ROLE: role }),
		stdio: ['pipe', 'pipe', 'inherit'] });
	let buf = '';
	const waiting = [];
	p.stdout.on('data', d => {
		buf += d;
		let i;
		while ((i = buf.indexOf('\n')) >= 0) {
			const line = buf.slice(0, i); buf = buf.slice(i + 1);
			if (line.indexOf('RESULT ') === 0 && waiting.length) { waiting.shift()(JSON.parse(line.slice(7))); }
			else if (line) { console.log('  [' + role + '] ' + line); }
		}
	});
	return {
		say(cmd, args) {
			return new Promise(res => { waiting.push(res); p.stdin.write(JSON.stringify({ cmd, args: args || {} }) + '\n'); });
		},
		stop() { p.stdin.end(); p.kill(); }
	};
}

// ---------------------------------------------------------------------------
// THE CHILD: a whole page, loaded for real, talking to a real lpn-lock.php.
// ---------------------------------------------------------------------------
if (process.env.LPN_ASK_ROLE) {
	const { setUnitSet, byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');

	// **THE REAL BROKER, one process per request, because lpn-lock.php ends in exit().** This is the
	// shipped PHP file with the shipped flock() and the shipped record on disk -- the only thing
	// standing in for the network is the transport, and the transport is not what broke.
	function broker(fields) {
		const php = '$_SERVER["REQUEST_METHOD"]="POST"; $_POST=json_decode($argv[1], true);'
			+ ' include ' + JSON.stringify(ROOT + 'lpn-lock.php') + ';';
		const out = execFileSync('php', ['-d', 'error_reporting=0', '-r', php, JSON.stringify(fields)],
			{ encoding: 'utf8' });
		return JSON.parse(out.slice(out.indexOf('{')));
	}
	const sent = [];
	// Every url this user has ever addressed, never cleared, so section 8 can judge the whole
	// conversation rather than whichever call happened to be last.
	const allUrls = [];
	global.fetch = async function (url, init) {
		const row = {}; init.body.forEach((v, k) => { row[k] = v; });
		row._url = String(url);
		sent.push(row); allUrls.push(row._url);
		const reply = broker(row);
		return { json: async () => reply };
	};
	global.window.fetch = global.fetch;
	// releaseLock() prefers sendBeacon, and a release is where the note used to die -- so the harness
	// has to have one, or it would test the fetch fallback and miss the path the browser takes.
	global.navigator.sendBeacon = function (url, body) {
		const row = {}; body.forEach((v, k) => { row[k] = v; });
		row._url = String(url);
		sent.push(row); allUrls.push(row._url);
		broker(row);
		return true;
	};
	let promptAnswer = '';
	global.window.prompt = function () { return promptAnswer; };
	global.window.alert = function () {};
	global.__LANDED = [];

	const L = loadLoopedNetwork(
		"\t\tacquireLockForOpenProject: acquireLockForOpenProject,\n" +
		"\t\tpollLockedFiles: pollLockedFiles,\n" +
		"\t\tpollLockedFilesOnReturn: pollLockedFilesOnReturn,\n" +
		"\t\treleaseAllLocks: releaseAllLocks,\n" +
		"\t\tensureIdentity: ensureIdentity,\n" +
		"\t\tloadIdentity: loadIdentity,\n" +
		"\t\tpresentOpenChoice: presentOpenChoice,\n" +
		"\t\tsyncReadOnlyToOpenProject: syncReadOnlyToOpenProject,\n" +
		"\t\tsetDocId: function (d) { project.docId = d; },\n" +
		// A file project whose handle died with the last page load -- the commonest state a
		// holder's page is in, and the one whose standing banner used to stamp on the ask.
		"\t\tdeadFileProject: function () { library.openId = 'p1'; library.projects.push({ id: 'p1', name: 'x', fileName: 'x.lwn' }); },\n" +
		"\t\tbannerWarn: function () { return bannerWarn; },\n" +
		"\t\tclearBanner: function () { bannerWarn = null; },\n" +
		"\t\tholds: function () { var o = []; heldLocks.forEach(function (d) { o.push(d); }); return o; },\n",
		null,
		src => src.replace(
			"\tfunction landOpenedFile(saved, handle, asReadOnly, heldBy) {",
			"\tfunction landOpenedFile(saved, handle, asReadOnly, heldBy) {\n" +
			"\t\tglobal.__LANDED.push({ asReadOnly: !!asReadOnly }); return;"));

	setUnitSet('us');
	// **THE MOUNT THIS PAGE IS SERVED AT IS DELIBERATELY NOT THE DEFAULT ONE.** `suiteUrl()` falls
	// back to '/engcalcs/' when no page has said otherwise, so a module that had the old literal
	// baked into it would agree with the fallback and the check below would pass on a page served
	// somewhere else. Saying a different base here is what makes that assertion able to fail.
	global.EngCalcs.suiteBase = '/othermount/';
	const PC = global.EngCalcs.pageConfig;
	const settle = () => new Promise(r => setImmediate(r));
	function press(label) {
		const btn = byId.lpn_dialog_buttons.children.filter(c => c.textContent === label)[0];
		if (!btn) { throw new Error('no such button: ' + label); }
		(btn._listeners.click || []).forEach(fn => fn({}));
	}

	const commands = {
		// A takes the file, by the same call every open route in the page makes.
		async hold(a) {
			L.ensureIdentity();
			L.setDocId(a.docId);
			await L.acquireLockForOpenProject();
			return { holds: L.holds(), banner: L.bannerWarn() };
		},
		// What a RELOAD does to the broker: hand every lock back, then take it again. Not a
		// pretend reload -- these are the two calls beforeunload and boot actually make.
		async reload(a) {
			L.releaseAllLocks();
			await settle();
			await L.acquireLockForOpenProject();
			return { holds: L.holds(), banner: L.bannerWarn() };
		},
		// What the tab coming back to the front runs. Counted at the network, because the whole
		// point of it is that it makes a request the slowed-down timer has not made yet.
		async onReturn(a) {
			global.document.visibilityState = a.state || 'visible';
			sent.length = 0;
			L.pollLockedFilesOnReturn();
			await settle(); await settle();
			return { calls: sent.filter(x => x.action === 'acquire').length, banner: L.bannerWarn() };
		},
		// The 60 s timer's own callback, run once.
		async beat() {
			await L.pollLockedFiles();
			return { banner: L.bannerWarn(), holds: L.holds() };
		},
		// B opens a file somebody else has and presses Ask, through the real dialog.
		async ask(a) {
			L.ensureIdentity();
			promptAnswer = a.initials;
			sent.length = 0;
			L.presentOpenChoice({ project: { docId: a.docId } }, null, 'Somebody else', { lockedBy: '' });
			press(PC.lpn_lock_ask);
			await settle(); await settle();
			return { sent: sent.slice(), landed: global.__LANDED.length };
		},
		// Anything that repaints the standing state -- a tab switch, a reconnect, boot.
		async resync() { L.syncReadOnlyToOpenProject(); return { banner: L.bannerWarn() }; },
		async deadFileProject() { L.deadFileProject(); return { ok: true }; },
		// Pressed on the banner itself, so the repaint under test is the shipped handler's.
		async dismiss() {
			const bar = byId.lpn_lock_banner;
			const btn = bar.children.filter(c => c.textContent === PC.lpn_lock_dismiss)[0];
			if (!btn) { throw new Error('no Hide button on the banner'); }
			(btn._listeners.click || []).forEach(fn => fn({}));
			return { banner: L.bannerWarn() };
		},
		async clear() { L.clearBanner(); return { banner: null }; },
		async identity() { L.ensureIdentity(); return { holder: (L.loadIdentity() || {}).holder || '' }; },
		async urls() { return { urls: allUrls.slice() }; },
		// Break lock, pressed on the real dialog: the one way a file changes hands while
		// somebody still has it.
		async takeover(a) {
			L.ensureIdentity();
			sent.length = 0;
			L.presentOpenChoice({ project: { docId: a.docId } }, null, 'Somebody else', { lockedBy: '' });
			press('\u26a0 ' + PC.lpn_lock_break);
			await settle(); await settle();
			return { sent: sent.slice() };
		}
	};

	let inbuf = '';
	process.stdin.on('data', async d => {
		inbuf += d;
		let i;
		while ((i = inbuf.indexOf('\n')) >= 0) {
			const line = inbuf.slice(0, i); inbuf = inbuf.slice(i + 1);
			if (!line) { continue; }
			const msg = JSON.parse(line);
			let out;
			try { out = await commands[msg.cmd](msg.args); }
			catch (err) { out = { error: String(err && err.message || err) }; }
			process.stdout.write('RESULT ' + JSON.stringify(out) + '\n');
		}
	});
	return;
}

// ---------------------------------------------------------------------------
// THE PARENT: the two users, and what has to be true between them.
// ---------------------------------------------------------------------------
let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log(' FAIL  ' + name + (extra === undefined ? '' : '   ' + extra));
}
function record(docId) {
	const p = ROOT + 'lpn-locks/' + docId + '.json';
	return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}
function freshDocId() { return 'd' + 'both' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36); }
const made = [];
function newDoc() { const d = freshDocId(); made.push(d); return d; }

(async function () {
	// **A FRESH HOLDER PER SECTION, because a page remembers which asks it has already shown.** That
	// memory is keyed on the project and on the second the ask was stamped, and this harness runs a
	// whole scenario inside one second -- so reusing one holder would have section 4 suppress
	// section 3's note as a repeat of itself, and report the bug it exists to catch as fixed.
	const B = child('B'), C = child('C');
	const holders = [];
	function holder() { const h = child('A' + (holders.length + 1)); holders.push(h); return h; }
	try {
		console.log('\n--- 1. two browsers, two identities, one file ---');
		const doc1 = newDoc();
		let A = holder();
		let r = await A.say('hold', { docId: doc1 });
		ok('A takes the lock', r.holds.indexOf(doc1) >= 0, JSON.stringify(r.holds));
		const idA = (await A.say('identity')).holder, idB = (await B.say('identity')).holder;
		ok('...and the two users are not the same person to the broker', !!idA && !!idB && idA !== idB,
			idA + ' / ' + idB);

		console.log('\n--- 2. B presses Ask, and it arrives ---');
		r = await B.say('ask', { docId: doc1, initials: 'JHB' });
		const req = r.sent.filter(s => s.action === 'request')[0];
		ok('B\'s press reaches the broker', !!req, JSON.stringify(r.sent));
		ok('...carrying the initials typed at that moment', !!req && req.name === 'JHB');
		ok('...and Ask opens nothing', r.landed === 0);
		let rec = record(doc1);
		ok('the note is on the record', !!rec && rec.requestedBy === 'JHB', JSON.stringify(rec));
		ok('...addressed to the holder it was left for', !!rec && rec.requestedOf === idA,
			rec && rec.requestedOf);
		ok('...and it took nothing: A still holds the file', !!rec && rec.holder === idA);

		console.log('\n--- 3. A\'s next heartbeat is what carries it to the screen ---');
		r = await A.say('beat');
		ok('A IS TOLD SOMEBODY WANTS THE FILE', !!r.banner && r.banner.kind === 'request',
			JSON.stringify(r.banner));
		ok('...naming who asked', !!r.banner && r.banner.message.indexOf('JHB') === 0,
			r.banner && r.banner.message);
		ok('...as something they can put away, never something that takes the file',
			!!r.banner && r.banner.dismissable === true);
		ok('...and A still holds the file', r.holds.indexOf(doc1) >= 0);
		await A.say('clear');
		r = await A.say('beat');
		ok('the same ask is not raised again a minute later', r.banner === null, JSON.stringify(r.banner));

		console.log('\n--- 4. A RELOADING MUST NOT DESTROY A NOTE LEFT IN THE GAP ---');
		// The defect Tom found, in the shape a person reaches it: a reload hands the lock back and
		// takes it again, and the note used to fall down that one-second gap unseen.
		const doc2 = newDoc();
		A = holder();
		await A.say('hold', { docId: doc2 });
		await B.say('ask', { docId: doc2, initials: 'MEH' });
		ok('the note is waiting', (record(doc2) || {}).requestedBy === 'MEH');
		r = await A.say('reload');
		rec = record(doc2);
		ok('the record survives the release', !!rec, 'the record was deleted');
		ok('A IS TOLD, EVEN THOUGH THEY RELOADED IN BETWEEN',
			!!r.banner && r.banner.kind === 'request' && r.banner.message.indexOf('MEH') === 0,
			JSON.stringify(r.banner));
		ok('...and it is not left on the record to be raised again', !!rec && rec.requestedBy === '',
			JSON.stringify(rec));

		console.log('\n--- 5. the note is for the person it was left for, and nobody else ---');
		const doc3 = newDoc();
		A = holder();
		await A.say('hold', { docId: doc3 });
		await B.say('ask', { docId: doc3, initials: 'KLM' });
		// C presses Break lock. The file changes hands, so the ask is answered by that happening.
		await C.say('takeover', { docId: doc3 });
		rec = record(doc3);
		ok('somebody taking the file over clears the note',
			!!rec && rec.requestedBy === '' && rec.requestedAt === 0, JSON.stringify(rec));
		r = await C.say('beat');
		ok('...so the new holder is never asked to hand over what they just took', r.banner === null,
			JSON.stringify(r.banner));

		console.log('\n--- 6. a standing warning must not stamp on the news ---');
		const doc4 = newDoc();
		A = holder();
		// The holder's page is a file project whose connection died with the last reload -- so the
		// reconnect banner is standing, and it is written again on every tab switch.
		await A.say('deadFileProject');
		await A.say('hold', { docId: doc4 });
		await B.say('ask', { docId: doc4, initials: 'PQR' });
		r = await A.say('resync');
		ok('the reconnect banner is what is standing on this page',
			!!r.banner && r.banner.kind === 'reopen', JSON.stringify(r.banner));
		r = await A.say('beat');
		ok('...and the ask replaces it, because the ask is news and is said once',
			!!r.banner && r.banner.kind === 'request', JSON.stringify(r.banner));
		r = await A.say('resync');   // a tab switch, a reconnect, a boot: all call this
		ok('THE ASK SURVIVES A TAB SWITCH', !!r.banner && r.banner.kind === 'request',
			JSON.stringify(r.banner));
		r = await A.say('dismiss');
		ok('...and putting it away brings the standing condition back rather than an empty bar',
			!!r.banner && r.banner.kind === 'reopen', JSON.stringify(r.banner));

		console.log('\n--- 7. asking for a file nobody holds is reported, not swallowed ---');
		const doc5 = newDoc();
		r = await B.say('ask', { docId: doc5, initials: 'XYZ' });
		const req5 = r.sent.filter(s => s.action === 'request')[0];
		ok('the press still reaches the broker', !!req5);
		ok('...which says plainly that there was nobody to ask', record(doc5) === null,
			JSON.stringify(record(doc5)));

		console.log('\n--- 8. every lock call is addressed from the origin ---');
		// A literal '/engcalcs/lpn-lock.php' is right on one of the two mounts this suite is served
		// at and a 404 on the other, and locking FAILS OPEN -- so the whole feature would have been
		// off at librewaternet.org/app/ with nothing to see but an amber banner. The page under test
		// is deliberately told it is served somewhere ELSE, because suiteUrl() falls back to
		// '/engcalcs/' and a baked-in literal would otherwise agree with the fallback and pass.
		await B.say('ask', { docId: doc1, initials: 'ABC' });
		const urls = (await B.say('urls')).urls.concat((await holders[0].say('urls')).urls);
		ok('...through suiteUrl(), so every call lands on the mount THIS page is served at',
			urls.length > 0 && urls.every(u => u === '/othermount/lpn-lock.php'),
			JSON.stringify(Array.from(new Set(urls))));
		console.log('\n--- 9. coming back to the tab is its own reason to check ---');
		// **THE MINUTE IS A CEILING ON A TIMER, AND A HIDDEN TAB HAS NO CEILING.** A browser slows
		// the timers of a page nobody is looking at, and the holder is exactly the person likely to
		// have the map in a background tab. The promise made to whoever presses Ask -- "within a
		// minute" -- is only true of a tab in front of somebody, unless coming back to it checks.
		const doc6 = newDoc();
		A = holder();
		await A.say('hold', { docId: doc6 });
		await B.say('ask', { docId: doc6, initials: 'STU' });
		r = await A.say('onReturn', { state: 'hidden' });
		ok('a page still hidden checks nothing', r.calls === 0, JSON.stringify(r.calls));
		r = await A.say('onReturn', { state: 'visible' });
		ok('COMING BACK TO THE TAB COLLECTS THE ASK WITHOUT WAITING FOR THE TIMER',
			r.calls > 0 && !!r.banner && r.banner.message.indexOf('STU') === 0,
			r.calls + ' ' + JSON.stringify(r.banner));
		r = await A.say('onReturn', { state: 'visible' });
		ok('...and showing and hiding a page repeatedly does not become a second heartbeat',
			r.calls === 0, JSON.stringify(r.calls));

	} finally {
		B.stop(); C.stop(); holders.forEach(h => h.stop());
		made.forEach(d => { try { fs.unlinkSync(ROOT + 'lpn-locks/' + d + '.json'); } catch (e) { /* already swept */ } });
	}

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
})();
