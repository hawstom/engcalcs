// THE GUARDS ON send-feedback.php, posted to over real HTTP (ROADMAP Task 768). Run with:
//   node dev/lpn-spike/feedback-endpoint-harness.js
//
// The second click of "Something wrong here?" e-mails Tom what a visitor picked or typed. A form
// that mails is a form spammers find, so every guard is held here against the real endpoint under
// `php -S`, with the mail transport swapped for a directory (EC_FEEDBACK_SINK, read by
// ecFeedbackDeliver() in lib/FeedbackMail.lib.php) so a test reads exactly what mail() was handed:
//
//   - POST only; our own header and our own origin, or 403;
//   - the address is the only visitor text that reaches a header: CR/LF and non-addresses refused;
//   - a filled honeypot answers like a success and sends nothing;
//   - picks are a closed set; sizes are capped; an empty post is refused (the page never sends one);
//   - a page name is printed only if it is a real page;
//   - a global rate limit, which keeps no address of anybody.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');

const REPO = path.resolve(__dirname, '..', '..');
let checks = 0, fails = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ec-feedback-endpoint-'));
const SINK = path.join(tmp, 'sink');
fs.mkdirSync(SINK);
process.env.EC_FEEDBACK_SINK = SINK;
process.env.EC_FEEDBACK_RATE_FILE = path.join(tmp, 'rate.txt');

function mails() {
	return fs.readdirSync(SINK).sort().map((f) => JSON.parse(fs.readFileSync(path.join(SINK, f), 'utf8')));
}
function clearSink() { fs.readdirSync(SINK).forEach((f) => fs.unlinkSync(path.join(SINK, f))); }

let ORIGIN = '';
function post(fields, opts) {
	opts = opts || {};
	const body = typeof fields === 'string' ? fields : new URLSearchParams(fields).toString();
	const u = new URL(ORIGIN + '/engcalcs/send-feedback.php');
	const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) };
	if (opts.header !== false) { headers['X-EngCalcs-Feedback'] = '1'; }
	if (opts.origin !== null) { headers.Origin = opts.origin || ORIGIN; }
	return new Promise((resolve, reject) => {
		const req = http.request({ hostname: u.hostname, port: u.port, path: u.pathname, method: opts.method || 'POST', headers }, (res) => {
			let data = '';
			res.on('data', (d) => { data += d; });
			res.on('end', () => {
				let j = null;
				try { j = JSON.parse(data); } catch (e) { /* not JSON */ }
				resolve({ status: res.statusCode, json: j, raw: data });
			});
		});
		req.on('error', reject);
		if (opts.method !== 'GET') { req.write(body); }
		req.end();
	});
}

const GOOD = {
	page: 'Looped-Network', lang: 'es', code: 'no-fixed-head', picks: 'numbers,confusing',
	email: 'reader@example.org', comment: 'The pressure at J3 is negative.\nSecond line, ñ and 水.', website: ''
};

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	await env.startServer();
	ORIGIN = env.origin();
	try {
		console.log('\n---- 1. who may post ----');
		let r = await post({}, { method: 'GET' });
		ok('a GET is refused with 405', r.status === 405, r.status);
		r = await post(GOOD, { header: false });
		ok('a post without our header is refused with 403', r.status === 403 && r.json && r.json.reason === 'origin', r.raw);
		r = await post(GOOD, { origin: 'https://spam.example' });
		ok('a post from another origin is refused with 403', r.status === 403, r.status);
		r = await post(GOOD, { origin: null });
		ok('a post with neither Origin nor Referer is refused', r.status === 403, r.status);
		ok('...and none of those sent a mail', mails().length === 0, mails().length);

		console.log('\n---- 2. a full report ----');
		r = await post(GOOD);
		ok('a full report is accepted', r.status === 200 && r.json && r.json.ok === true, r.raw);
		let m = mails();
		ok('exactly one mail was handed to the transport', m.length === 1, m.length);
		m = m[0] || { headers: '', body: '', subject: '' };
		ok('...to Tom', m.to === 'tom.haws@gmail.com', m.to);
		ok('...with the page and the code in the subject', m.subject === 'Something wrong here? Looped-Network [no-fixed-head]', m.subject);
		ok('...the picks in English, in the order picked', m.body.indexOf('Picked: The numbers look wrong; This is confusing') === 0, m.body.split('\n')[0]);
		ok('...the comment as typed, every script intact', m.body.indexOf('The pressure at J3 is negative.\nSecond line, ñ and 水.') >= 0);
		ok('...the page, language, build, message code and address below a rule',
			/\n-- \nPage: Looped-Network\nLanguage: es\nBuild: [^\n]*\nMessage on the map: no-fixed-head\nReply to: reader@example\.org\n/.test(m.body), JSON.stringify(m.body.slice(m.body.indexOf('-- '))));
		ok('...the build is the real one, not "not recorded"', !/Build: not recorded/.test(m.body));
		ok('...Reply-To is the address given', /\r\nReply-To: reader@example\.org$/.test(m.headers), JSON.stringify(m.headers));
		ok('...From is ours and fixed', m.headers.indexOf('From: HawsEDC Support <support@hawsedc.com>') === 0);
		ok('...and the body is declared UTF-8', m.headers.indexOf('Content-Type: text/plain; charset=UTF-8') >= 0);
		clearSink();

		console.log('\n---- 3. the address, the only visitor text in a header ----');
		r = await post(Object.assign({}, GOOD, { email: 'a@b.com\r\nBcc: victim@example.com' }));
		ok('an address carrying CR/LF is refused as "email"', r.status === 400 && r.json && r.json.reason === 'email', r.raw);
		r = await post(Object.assign({}, GOOD, { email: 'not an address' }));
		ok('a non-address is refused as "email"', r.status === 400 && r.json && r.json.reason === 'email', r.raw);
		ok('...and neither sent anything', mails().length === 0);
		r = await post(Object.assign({}, GOOD, { email: 'Reader.Name+eng@Example.ORG' }));
		ok('a mixed-case address with a plus tag is accepted', r.status === 200, r.raw);
		r = await post(Object.assign({}, GOOD, { email: '' }));
		ok('no address at all is accepted', r.status === 200, r.raw);
		m = mails();
		ok('...and that mail has no Reply-To', m.length === 2 && m[1].headers.indexOf('Reply-To') < 0, m[1] && JSON.stringify(m[1].headers));
		ok('...and says no address was given', m.length === 2 && m[1].body.indexOf('Reply to: no address given') >= 0);
		ok('...and no header block ends in an empty line', m.every((x) => !/\r\n$/.test(x.headers)));
		clearSink();
		r = await post(Object.assign({}, GOOD, { comment: 'hi\r\nBcc: victim@example.com\r\n\r\nbody' }));
		ok('header-shaped text in the comment is accepted as text', r.status === 200, r.raw);
		m = mails()[0] || { headers: '' };
		ok('...and never reaches the headers', m.headers.indexOf('Bcc') < 0, JSON.stringify(m.headers));
		clearSink();
		r = await post('page=Looped-Network&email[]=x&comment=hello');
		ok('an array where a string belongs is dropped, not a 500', r.status === 200, r.status + ' ' + r.raw);
		clearSink();

		console.log('\n---- 4. the honeypot, the closed set, the caps ----');
		r = await post(Object.assign({}, GOOD, { website: 'http://spam.example' }));
		ok('a filled honeypot is answered like a success', r.status === 200 && r.json && r.json.ok === true, r.raw);
		ok('...and sends nothing', mails().length === 0, mails().length);
		r = await post(Object.assign({}, GOOD, { picks: 'numbers,buy-now' }));
		ok('a pick outside the closed set is refused as "bad"', r.status === 400 && r.json.reason === 'bad', r.raw);
		r = await post({ page: 'Looped-Network', lang: 'en', code: 'none', picks: '', email: '', comment: '   ' });
		ok('a post with nothing in it is refused as "empty"', r.status === 400 && r.json.reason === 'empty', r.raw);
		r = await post(Object.assign({}, GOOD, { comment: 'x'.repeat(12001) }));
		ok('a comment over 12000 bytes is refused as "too-long"', r.status === 400 && r.json.reason === 'too-long', r.raw);
		r = await post(Object.assign({}, GOOD, { email: 'a'.repeat(250) + '@b.com' }));
		ok('an address over 254 bytes is refused as "too-long"', r.status === 400 && r.json.reason === 'too-long', r.raw);
		ok('...and none of these sent anything', mails().length === 0, mails().length);
		r = await post(Object.assign({}, GOOD, { page: '../../etc/passwd', code: 'x\r\nBcc: y', lang: 'es\r\nX' }));
		ok('a page that is not a real page still sends', r.status === 200, r.raw);
		m = mails()[0] || { body: '', subject: '' };
		ok('...and is named "not recorded", never echoed', m.body.indexOf('Page: not recorded') >= 0 && m.body.indexOf('passwd') < 0);
		ok('...the code and language are cut to their charsets', m.subject.indexOf('[xBcc:y]') >= 0 && m.body.indexOf('Language: esX') >= 0, m.subject);
		clearSink();

		console.log('\n---- 5. the rate limit keeps no address ----');
		// Every accepted send so far counted: 2.(1) + 3.(2) + 3.(1) + 3.(1) + 4.(1) = 6 in the window.
		const rate = fs.readFileSync(process.env.EC_FEEDBACK_RATE_FILE, 'utf8');
		ok('the rate file holds send times and nothing else', /^\d+(\n\d+)*$/.test(rate), JSON.stringify(rate.slice(0, 60)));
		let sent = rate.split('\n').length, last = null;
		while (sent < 10) { last = await post(GOOD); sent++; }
		ok('sends up to the window\'s cap of 10 are accepted', last && last.status === 200, last && last.raw);
		r = await post(GOOD);
		ok('the 11th in ten minutes is refused as "busy" (429)', r.status === 429 && r.json.reason === 'busy', r.raw);
		ok('...and was not sent', mails().length === 10 - 6, mails().length);
		r = await post(Object.assign({}, GOOD, { website: 'x' }));
		ok('the honeypot still answers like a success while busy', r.status === 200);
	} finally {
		env.stopServer();
		fs.rmSync(tmp, { recursive: true, force: true });
	}
	console.log('\nfeedback-endpoint-harness: ' + (checks - fails) + '/' + checks + ' checks passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
