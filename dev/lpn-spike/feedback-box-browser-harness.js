// "SOMETHING WRONG HERE?" IN TWO CLICKS, IN A REAL CHROME (ROADMAP Task 768).
//
//   node dev/lpn-spike/feedback-box-browser-harness.js
//
// Tom, 2026-10-05: "those links open a small form that allows, but doesn't require, a message, an
// email address, and some selectors or canned phrases." And when the first build sent people to the
// Contact page instead: "I wanted to open a little box with space for a few canned message
// buttons, email address, and additional information comments."
//
// This run clicks the real page against the real endpoint (send-feedback.php under php -S, its
// mail() swapped for a directory by EC_FEEDBACK_SINK) and holds:
//
//   (1) the first click on either door opens the box and posts NOTHING;
//   (2) Escape and Cancel close it and post nothing, and focus goes back to the door;
//   (3) picks toggle in any combination; Send posts exactly page, lang, code, picks, email,
//       comment and the honeypot, and the mail Tom gets carries them; the old anonymous row
//       goes too; the door becomes the thank-you;
//   (4) nothing typed is left in localStorage, sessionStorage or a cookie;
//   (5) Send with nothing in the box posts the anonymous row only, and from the diagnostic door
//       that row carries the code of the message on screen;
//   (6) a refused or failed send keeps every typed character and says why: a server failure, a
//       bad address (focus goes to it), the rate limit, a dropped connection, and a Cancel pressed
//       while the request was on its way;
//   (7) the keyboard: focus starts on the first pick, Space toggles, Tab stays inside;
//   (8) on a phone in tall mode the box, its fields and both buttons fit inside the window;
//   (9) after the thank-you the door comes back, and a second report in the same visit goes.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_FEEDBACK_BOX_BROWSER_LOCKED';
const NAME = 'feedback-box-browser-harness';

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

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ec-feedback-box-'));
const SINK = path.join(tmp, 'sink');
fs.mkdirSync(SINK);
process.env.EC_FEEDBACK_SINK = SINK;
process.env.EC_FEEDBACK_RATE_FILE = path.join(tmp, 'rate.txt');
const mails = () => fs.readdirSync(SINK).sort().map((f) => JSON.parse(fs.readFileSync(path.join(SINK, f), 'utf8')));

let Session;

// Every post the page makes to either endpoint, with its parsed body and its headers.
function capture(page) {
	const seen = { feedback: [], wrong: [] };
	page.on('request', (req) => {
		const u = req.url();
		if (req.method() !== 'POST') { return; }
		const params = Object.fromEntries(new URLSearchParams(req.postData() || ''));
		if (u.indexOf('/send-feedback.php') >= 0) { seen.feedback.push({ params, headers: req.headers() }); }
		if (u.indexOf('/log-signal-event.php') >= 0 && String(params.detail || '').indexOf('wrong:') === 0) { seen.wrong.push(params); }
	});
	return seen;
}

async function openSession(browser, viewport) {
	const a = await Session.open(browser, NAME, { viewport });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => {
		const c = document.getElementById('ec-consent'); if (c) { c.remove(); }
		delete window.lpnDialogAnswerer;
	});
	await a.settle(1200);
	return a;
}

const PC = (a) => a.page.evaluate(() => EngCalcs.pageConfig);
const box = (a) => a.page.evaluate(() => {
	const d = document.getElementById('lpn_dialog');
	if (!d || getComputedStyle(d).display === 'none') { return null; }
	const fb = d.querySelector('.lpn-fb');
	const r = d.getBoundingClientRect(), ae = document.activeElement;
	const q = (s) => d.querySelector(s);
	const inView = (e) => { if (!e) { return false; } const b = e.getBoundingClientRect(); return b.left >= 0 && b.right <= innerWidth && b.top >= 0 && b.bottom <= innerHeight && b.width > 0; };
	return {
		isFeedback: !!fb,
		title: (document.getElementById('lpn_dialog_title') || {}).textContent || '',
		picks: Array.from(d.querySelectorAll('.lpn-fb-pick')).map((b) => ({ text: b.textContent, pressed: b.getAttribute('aria-pressed') })),
		emailType: q('.lpn-fb-email') ? q('.lpn-fb-email').type : '',
		email: q('.lpn-fb-email') ? q('.lpn-fb-email').value : null,
		comment: q('.lpn-fb-comment') ? q('.lpn-fb-comment').value : null,
		sends: q('.lpn-fb-sends') ? q('.lpn-fb-sends').textContent : '',
		status: q('.lpn-fb-status') ? q('.lpn-fb-status').textContent : '',
		statusIsError: !!q('.lpn-fb-error'),
		buttons: Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.textContent),
		sendDisabled: (document.querySelector('#lpn_dialog_buttons button') || {}).disabled,
		focusInside: d.contains(ae), focusClass: ae ? ae.className : '', focusText: ae ? ae.textContent : '',
		left: r.left, right: r.right, top: r.top, bottom: r.bottom, vw: innerWidth, vh: innerHeight,
		fieldsFit: ['.lpn-fb-email', '.lpn-fb-comment'].every((s) => { const e = q(s); if (!e) { return false; } const b = e.getBoundingClientRect(); return b.left >= r.left && b.right <= r.right + 0.5; }),
		buttonsInView: Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).every(inView),
		picksInView: Array.from(d.querySelectorAll('.lpn-fb-pick')).every((e) => { const b = e.getBoundingClientRect(); return b.left >= 0 && b.right <= innerWidth; })
	};
});
const door = (a, id) => a.page.evaluate((i) => {
	const b = document.getElementById(i);
	return { text: b.textContent, disabled: b.disabled, focused: document.activeElement === b, shown: !!b.offsetParent };
}, id);
async function waitClosed(a, ms) {
	const end = Date.now() + (ms || 5000);
	while (Date.now() < end) { if (!(await box(a))) { return true; } await a.settle(100); }
	return false;
}
async function waitStatus(a, ms) {
	const end = Date.now() + (ms || 5000);
	while (Date.now() < end) { const b = await box(a); if (b && b.statusIsError) { return b; } await a.settle(100); }
	return box(a);
}
const picks = (a, ids) => a.page.evaluate((list) => {
	list.forEach((id) => document.querySelector('#lpn_dialog .lpn-fb-pick[data-pick="' + id + '"]').click());
}, ids);
const clickSend = (a) => a.page.click('#lpn_dialog_buttons button:nth-child(1)');
const clickCancel = (a) => a.page.click('#lpn_dialog_buttons button:nth-child(2)');

async function sectionDesk(browser) {
	console.log('\n--- the standing door, on a desk ---');
	const a = await openSession(browser, { width: 1400, height: 900 });
	const seen = capture(a.page);
	const pc = await PC(a);
	const storeBefore = await a.page.evaluate(() => ({ ls: Object.keys(localStorage).sort().join(','), ck: document.cookie }));

	await a.page.click('#lpn_wrong_btn');
	await a.settle(300);
	let b = await box(a);
	ok('(1) the first click opens the feedback box', b && b.isFeedback, JSON.stringify(b && b.title));
	ok('...titled with the door\'s own words', b && b.title === pc.lpn_wrong_btn, b && b.title);
	ok('...four canned phrases, none picked', b && b.picks.map((p) => p.text).join('|') ===
		[pc.lpn_fb_pick_numbers, pc.lpn_fb_pick_broken, pc.lpn_fb_pick_wording, pc.lpn_fb_pick_confusing].join('|') &&
		b.picks.every((p) => p.pressed === 'false'), b && JSON.stringify(b.picks));
	ok('...an email field and a comments box, both empty', b && b.emailType === 'email' && b.email === '' && b.comment === '');
	ok('...the "What this sends" line', b && b.sends === pc.lpn_fb_sends);
	ok('...and Send and Cancel', b && b.buttons.join('|') === pc.lpn_fb_send + '|' + pc.lpn_cancel, b && b.buttons.join('|'));
	ok('(7) focus starts on the first pick', b && b.focusInside && b.focusText === pc.lpn_fb_pick_numbers, b && b.focusText);
	ok('...and the first click posted nothing at all', seen.feedback.length === 0 && seen.wrong.length === 0);

	await a.page.keyboard.press('Space');
	b = await box(a);
	ok('(7) Space toggles the focused pick', b && b.picks[0].pressed === 'true');
	await a.page.keyboard.press('Space');
	for (let i = 0; i < 12; i++) { await a.page.keyboard.press('Tab'); }
	b = await box(a);
	ok('(7) twelve Tabs later focus is still inside the box', b && b.focusInside, b && b.focusClass);

	await a.page.fill('#lpn_dialog .lpn-fb-comment', 'typed then escaped');
	await a.page.keyboard.press('Escape');
	await a.settle(300);
	ok('(2) Escape closes the box', !(await box(a)));
	let d = await door(a, 'lpn_wrong_btn');
	ok('...posts nothing', seen.feedback.length === 0 && seen.wrong.length === 0);
	ok('...gives focus back to the door, still a control', d.focused && !d.disabled, JSON.stringify(d));

	await a.page.click('#lpn_wrong_btn');
	await a.settle(300);
	await a.page.fill('#lpn_dialog .lpn-fb-email', 'x@example.org');
	await clickCancel(a);
	await a.settle(300);
	ok('(2) Cancel closes it too, posting nothing', !(await box(a)) && seen.feedback.length === 0 && seen.wrong.length === 0);

	await a.page.click('#lpn_wrong_btn');
	await a.settle(300);
	b = await box(a);
	ok('...and the box opens fresh after a Cancel', b && b.email === '' && b.comment === '');
	await picks(a, ['numbers', 'wording', 'wording', 'confusing']);
	b = await box(a);
	ok('(3) picks toggle in any combination', b && b.picks.map((p) => p.pressed).join(',') === 'true,false,false,true', b && b.picks.map((p) => p.pressed).join(','));
	const COMMENT = 'Pipe P2 velocity looks 10x too high.\nZweite Zeile: ñ, 水.';
	await a.page.fill('#lpn_dialog .lpn-fb-comment', COMMENT);
	await a.page.fill('#lpn_dialog .lpn-fb-email', 'reader@example.org');
	await clickSend(a);
	ok('(3) Send closes the box once it is through', await waitClosed(a));
	ok('...one post to the endpoint', seen.feedback.length === 1, seen.feedback.length);
	const f = seen.feedback[0] || { params: {}, headers: {} };
	ok('...carrying exactly page, lang, code, picks, email, comment and the honeypot',
		Object.keys(f.params).sort().join(',') === 'code,comment,email,lang,page,picks,website', Object.keys(f.params).join(','));
	ok('...with what was picked and typed, and the standing door\'s code',
		f.params.page === 'Looped-Network' && f.params.code === 'none' && f.params.picks === 'numbers,confusing' &&
		f.params.email === 'reader@example.org' && f.params.comment === COMMENT && f.params.website === '', JSON.stringify(f.params));
	ok('...and our own header', f.headers['x-engcalcs-feedback'] === '1');
	const m = mails();
	ok('...and Tom\'s mail carries it', m.length === 1 && m[0].body.indexOf('Picked: The numbers look wrong; This is confusing') === 0 &&
		m[0].body.indexOf(COMMENT) >= 0 && /Reply-To: reader@example\.org$/.test(m[0].headers), m.length && m[0].body.slice(0, 80));
	ok('(3) the anonymous row went too, once', seen.wrong.length === 1 && seen.wrong[0].detail === 'wrong:none', JSON.stringify(seen.wrong));
	d = await door(a, 'lpn_wrong_btn');
	ok('...and the door is the thank-you', d.text === pc.lpn_wrong_thanks && d.disabled, JSON.stringify(d));

	// (9) A SECOND REPORT IN THE SAME VISIT. The thank-you stands a few seconds, then the door is back.
	await a.settle(4500);
	d = await door(a, 'lpn_wrong_btn');
	ok('(9) a few seconds later the door says "Something wrong here?" again', !d.disabled && d.text.indexOf(pc.lpn_wrong_btn) === 0, JSON.stringify(d));
	await a.page.click('#lpn_wrong_btn');
	await a.settle(300);
	b = await box(a);
	ok('...and opens a fresh, empty box', b && b.isFeedback && b.email === '' && b.comment === '' && b.picks.every((p) => p.pressed === 'false'));
	await picks(a, ['broken']);
	await a.page.fill('#lpn_dialog .lpn-fb-comment', 'A second thing, later.');
	await clickSend(a);
	ok('...and a second Send goes through', await waitClosed(a));
	ok('...as a second post to the endpoint', seen.feedback.length === 2 && seen.feedback[1].params.picks === 'broken' &&
		seen.feedback[1].params.comment === 'A second thing, later.' && seen.feedback[1].params.email === '', JSON.stringify(seen.feedback[1] && seen.feedback[1].params));
	ok('...and a second mail, with no Reply-To', mails().length === 2 && mails()[1].body.indexOf('A second thing, later.') >= 0 && mails()[1].headers.indexOf('Reply-To') < 0);
	// logSignal dedupes event+detail per page load, so the anonymous tally counts a visit's reports
	// about one message once; that is its own long-standing rule, not this box's.
	ok('...while the anonymous tally row is not repeated for the same message', seen.wrong.length === 1, seen.wrong.length);
	ok('...and the door is the thank-you again', (await door(a, 'lpn_wrong_btn')).disabled);

	const storeAfter = await a.page.evaluate((t) => {
		const all = [];
		for (let i = 0; i < localStorage.length; i++) { all.push(localStorage.getItem(localStorage.key(i)) || ''); }
		for (let i = 0; i < sessionStorage.length; i++) { all.push(sessionStorage.getItem(sessionStorage.key(i)) || ''); }
		all.push(document.cookie);
		return { leaked: all.some((v) => v.indexOf(t[0]) >= 0 || v.indexOf(t[1]) >= 0 || v.indexOf('typed then escaped') >= 0),
			cookie: document.cookie, ls: Object.keys(localStorage).sort().join(',') };
	}, ['reader@example.org', 'velocity looks 10x']);
	ok('(4) nothing typed is in localStorage, sessionStorage or a cookie', !storeAfter.leaked);
	ok('...and no cookie was added', storeAfter.cookie === storeBefore.ck, storeBefore.ck + ' -> ' + storeAfter.cookie);
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
}

async function sectionRefused(browser) {
	console.log('\n--- a refused or failed send keeps every character ---');
	const a = await openSession(browser, { width: 1400, height: 900 });
	const seen = capture(a.page);
	const pc = await PC(a);
	const COMMENT = 'Keep me: ü, 中文, and a line\nbreak.';
	let reply = { status: 500, body: '{"ok":false,"reason":"failed"}' };
	await a.page.route(/send-feedback\.php/, (route) => {
		if (reply === 'abort') { return route.abort(); }
		if (reply === 'real') { return route.continue(); }
		const r = reply;
		const go = () => route.fulfill({ status: r.status, contentType: 'application/json', body: r.body });
		return r.delay ? setTimeout(go, r.delay) : go();
	});
	await a.page.click('#lpn_wrong_btn');
	await a.settle(300);
	await picks(a, ['broken']);
	await a.page.fill('#lpn_dialog .lpn-fb-comment', COMMENT);
	await a.page.fill('#lpn_dialog .lpn-fb-email', 'reader@example.org');

	const kept = async (label, want) => {
		await clickSend(a);
		const b = await waitStatus(a);
		ok(label + ': the box stays open and says why', b && b.isFeedback && b.statusIsError && b.status === want, b && b.status);
		ok('...every typed character and the pick are still there', b && b.comment === COMMENT && b.picks[1].pressed === 'true' &&
			b.picks.filter((p) => p.pressed === 'true').length === 1, b && JSON.stringify([b.comment, b.email]));
		ok('...and Send can be pressed again', b && b.sendDisabled === false);
		return b;
	};
	await kept('(6) a server failure', pc.lpn_fb_failed);
	reply = { status: 400, body: '{"ok":false,"reason":"email"}' };
	let b = await kept('(6) a refused address', pc.lpn_fb_bad_email);
	ok('...and the address is kept, with focus on it', b && b.email === 'reader@example.org' && /lpn-fb-email/.test(b.focusClass), b && b.focusClass);
	reply = { status: 429, body: '{"ok":false,"reason":"busy"}' };
	await kept('(6) the rate limit', pc.lpn_fb_busy);
	reply = 'abort';
	await kept('(6) a dropped connection', pc.lpn_fb_failed);
	ok('...and the door is not thanked for any of it', !(await door(a, 'lpn_wrong_btn')).disabled);

	reply = { status: 500, body: '{"ok":false,"reason":"failed"}', delay: 800 };
	await clickSend(a);
	await a.settle(100);
	b = await box(a);
	ok('(6) while the request is on its way the box says so and Send is held', b && b.status === pc.lpn_fb_sending && b.sendDisabled === true, b && b.status);
	await a.page.keyboard.press('Escape');
	await a.settle(200);
	ok('...Escape still closes it', !(await box(a)));
	b = await waitStatus(a, 4000);
	ok('...and when the failure lands the box comes back with what was typed and why',
		b && b.isFeedback && b.status === pc.lpn_fb_failed && b.comment === COMMENT && b.email === 'reader@example.org', b && b.status);

	reply = 'real';
	const before = mails().length;
	await clickSend(a);
	ok('then the real endpoint takes it and the box closes', await waitClosed(a));
	ok('...one mail, carrying the comment that survived five refusals', mails().length === before + 1 &&
		mails()[mails().length - 1].body.indexOf(COMMENT) >= 0);
	ok('...and the door is the thank-you', (await door(a, 'lpn_wrong_btn')).disabled);
	ok('the anonymous row went once, not once per attempt', seen.wrong.length === 1, seen.wrong.length);
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
}

async function sectionStatusDoor(browser) {
	console.log('\n--- the diagnostic door, sent empty ---');
	const a = await openSession(browser, { width: 1400, height: 900 });
	const seen = capture(a.page);
	const pc = await PC(a);
	// One junction and nothing to feed it: the solver says so in the diagnostic box.
	await a.newProject('us');
	await a.makeEdit();
	await a.settle(1200);
	let d = await door(a, 'lpn_wrong_status_btn');
	ok('a network with no source raises the diagnostic box, with its door', d.shown, JSON.stringify(d));
	await a.page.click('#lpn_wrong_status_btn');
	await a.settle(300);
	const b = await box(a);
	ok('(1) the diagnostic door opens the same box', b && b.isFeedback && b.title === pc.lpn_wrong_btn);
	ok('...posting nothing yet', seen.wrong.length === 0 && seen.feedback.length === 0);
	await clickSend(a);
	ok('(5) Send with nothing in the box closes it', await waitClosed(a));
	await a.settle(400);
	ok('...posts the anonymous row only, nothing to the mail endpoint', seen.wrong.length === 1 && seen.feedback.length === 0,
		JSON.stringify(seen));
	ok('...carrying the code of the message that was on screen',
		seen.wrong.length === 1 && /^wrong:[a-z-]+$/.test(seen.wrong[0].detail) && seen.wrong[0].detail !== 'wrong:none' && seen.wrong[0].detail !== 'wrong:status',
		seen.wrong[0] && seen.wrong[0].detail);
	ok('...and nothing but page, lang, event and detail', seen.wrong.length === 1 &&
		Object.keys(seen.wrong[0]).filter((k) => k !== 'offline_ts').sort().join(',') === 'detail,event,lang,page', JSON.stringify(seen.wrong[0]));
	d = await door(a, 'lpn_wrong_status_btn');
	ok('...and that door is the thank-you', d.text === pc.lpn_wrong_thanks && d.disabled);
	ok('the standing door is untouched by it', !(await door(a, 'lpn_wrong_btn')).disabled);
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
}

async function sectionPhone(browser) {
	console.log('\n--- a phone in tall mode (390 x 844) ---');
	const a = await openSession(browser, { width: 390, height: 844 });
	const seen = capture(a.page);
	let d = await door(a, 'lpn_wrong_btn');
	ok('the standing door is on screen on a phone', d.shown);
	await a.page.click('#lpn_wrong_btn');
	await a.settle(400);
	let b = await box(a);
	ok('(8) the box opens', b && b.isFeedback);
	ok('...inside the window, side to side', b && b.left >= 0 && b.right <= b.vw, b && (b.left + '..' + b.right + ' of ' + b.vw));
	ok('...its fields inside the box', b && b.fieldsFit);
	ok('...every pick inside the window', b && b.picksInView);
	ok('...and Send and Cancel on screen', b && b.buttonsInView, b && (b.top + '..' + b.bottom + ' of ' + b.vh));
	await a.page.fill('#lpn_dialog .lpn-fb-comment', 'from a phone');
	await picks(a, ['confusing']);
	await clickSend(a);
	ok('...and Send works there', await waitClosed(a) && seen.feedback.length === 1 && seen.feedback[0].params.comment === 'from a phone');
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		await sectionDesk(browser);
		await sectionRefused(browser);
		await sectionStatusDoor(browser);
		await sectionPhone(browser);
	} finally {
		await browser.close();
		env.stopServer();
		fs.rmSync(tmp, { recursive: true, force: true });
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
