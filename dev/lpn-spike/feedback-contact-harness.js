// FEEDBACK: the contact form's category and optional e-mail, and the "Tell us more" links on the map.
//   node dev/lpn-spike/feedback-contact-harness.js
// (feat/feedback, Ida 2026-10-05, moves 1 and 2.) Three things a visitor could hit that nobody would
// notice by eye: a form that still demands an e-mail address, a category that never reaches the
// message, and an error link that carries no code. Each is asserted against the REAL page, the REAL
// formmail.php (sendmail replaced by a file), and the REAL setStatus().
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const ROOT = path.join(__dirname, '..', '..');
let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++; console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function render(page, get) {
	const a = [path.join(ROOT, 'dev/scripts/render_page.php'), page];
	if (get) { a.push('--get=' + get); }
	return execFileSync('php', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

console.log('\n---- 1. contact.php ----');
const plain = render('contact.php');
ok('has the category select', /<select[^>]*name="category"/.test(plain));
const opts = (plain.match(/<option value="[a-z]+"/g) || []).map((s) => s.slice(15, -1));
ok('offers the four categories, in order', opts.join(',') === 'wrong,wording,idea,other', opts.join(','));
ok('the select is labelled "What is this about?"', /What is this about\?/.test(plain));
ok('the e-mail field says it is optional', /Email \(only if you want a reply\)/.test(plain));
ok('...and the old demanding label is gone', plain.indexOf('Your e-mail address:') < 0);
ok('no preset: "Other" is selected', /<option value="other" selected>/.test(plain));
const pre = render('contact.php', 'from=Looped-Network&cat=wrong&code=engine-run&lang=en');
ok('?cat=wrong presets "Something is wrong"', /<option value="wrong" selected>/.test(pre));
ok('?from= is still carried', /name="origin" value="Looped-Network"/.test(pre));
ok('?code= and ?lang= are carried as hidden fields',
	/name="code" value="engine-run"/.test(pre) && /name="ctxlang" value="en"/.test(pre));
ok('...and the sender is told what rides along, in words', /never includes anything from your drawing/.test(pre));
ok('a bogus ?cat= falls back to Other', /<option value="other" selected>/.test(render('contact.php', 'cat=%3Cscript%3E')));
ok('a hostile ?code= is stripped to the slug charset',
	/name="code" value="scriptalert1script"/.test(render('contact.php', 'code=%3Cscript%3Ealert(1)%3C/script%3E')) === false &&
	render('contact.php', 'code=%3Cb%3E').indexOf('<b>') < 0);

console.log('\n---- 2. formmail.php, sendmail replaced by a file ----');
function post(fields, referer) {
	const out = path.join(os.tmpdir(), 'ec-feedback-mail-' + process.pid + '.txt');
	try { fs.unlinkSync(out); } catch (e) { /* none yet */ }
	const wrapper = '<?php $_SERVER["REQUEST_METHOD"]="POST"; $_POST=json_decode(getenv("EC_POST"),true); ' +
		'chdir(' + JSON.stringify(ROOT) + '); include ' + JSON.stringify(path.join(ROOT, 'formmail.php')) + ';';
	const w = path.join(os.tmpdir(), 'ec-feedback-wrap-' + process.pid + '.php');
	fs.writeFileSync(w, wrapper);
	const stdout = execFileSync('php', ['-d', 'sendmail_path=cat > ' + out, '-d', 'display_errors=0', w],
		{ encoding: 'utf8', env: Object.assign({}, process.env, { EC_POST: JSON.stringify(fields) }) });
	let mail = null; try { mail = fs.readFileSync(out, 'utf8'); } catch (e) { /* not sent */ }
	return { stdout: stdout, mail: mail };
}
const good = post({ name: 'Pat', email: '', subject: 'Hello', message: 'The pump curve is wrong.', category: 'wrong',
	code: 'engine-run', ctxlang: 'es', origin: 'Looped-Network' });
ok('a post with NO e-mail address is sent', good.mail !== null && /formmailsuccess/.test(good.stdout), good.stdout.slice(0, 120));
ok('...with no Reply-to header', good.mail !== null && !/Reply-to/i.test(good.mail));
ok('...the category is in the subject', good.mail !== null && /Subject: \[Something is wrong\] Hello/.test(good.mail));
ok('...the category, language and error code are in the body',
	good.mail !== null && /About: Something is wrong/.test(good.mail) && /Language: es/.test(good.mail) && /Error code: engine-run/.test(good.mail));
ok('...and the page it came from', good.mail !== null && /Came from: Looped-Network/.test(good.mail));
const withMail = post({ name: 'Pat', email: 'pat@example.com', subject: 's', message: 'm', category: 'idea' });
ok('a valid address still gets a Reply-to', withMail.mail !== null && /Reply-to: Pat <pat@example.com>/.test(withMail.mail));
ok('a malformed address is still refused', post({ name: 'a', email: 'nope', subject: 's', message: 'm' }).mail === null);
ok('a header-injection attempt in the address is still refused',
	post({ name: 'a', email: 'a@b.com\nBcc: x@y.com', subject: 's', message: 'm' }).mail === null);
ok('an "@" in the subject is still refused', post({ name: 'a', email: '', subject: 'x@y.com', message: 'm' }).mail === null);
ok('an empty message is refused', post({ name: 'a', email: '', subject: 's', message: '  ' }).mail === null);
const bogus = post({ name: 'a', email: '', subject: 's', message: 'm', category: 'x\nBcc: a@b.com', code: 'a b\nc' });
ok('an unknown category is not echoed', bogus.mail !== null && !/Bcc/.test(bogus.mail) && /About: not stated/.test(bogus.mail));

console.log('\n---- 3. the map: "Tell us more" and the anonymous button ----');
const html = render('Looped-Network.php');
ok('the status box carries a Tell us more link',
	/<a id="lpn_tell_status"[^>]*href="[^"]*contact\.php\?from=Looped-Network&amp;cat=wrong"/.test(html));
ok('the standing strip carries one too', /<a id="lpn_tell_btn"[^>]*href="[^"]*contact\.php\?from=Looped-Network&amp;cat=wrong"/.test(html));
ok('both anonymous buttons are untouched',
	/<button[^>]*id="lpn_wrong_btn"/.test(html) && /<button[^>]*id="lpn_wrong_status_btn"/.test(html));
ok('Help > Fix something still goes to contact.php?from=', /contact\.php\?from=Looped-Network'/.test(fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8')));

const L = loadLoopedNetwork("\t\twireWrongButtons: wireWrongButtons, setStatus: setStatus,\n");
global.document.documentElement.lang = 'es';
L.wireWrongButtons();
const hrefOf = (id) => String((byId[id] || {}).href || '');
ok('the standing link carries the page and language, and no code',
	/contact\.php\?from=Looped-Network&cat=wrong&lang=es$/.test(hrefOf('lpn_tell_btn')), hrefOf('lpn_tell_btn'));
L.setStatus('The EPANET run failed.', 'engine-run');
ok('after an engine failure, the status link carries the error code',
	/code=engine-run/.test(hrefOf('lpn_tell_status')) && /from=Looped-Network/.test(hrefOf('lpn_tell_status')) &&
	/cat=wrong/.test(hrefOf('lpn_tell_status')) && /lang=es/.test(hrefOf('lpn_tell_status')), hrefOf('lpn_tell_status'));
L.setStatus('These nodes have no path to a reservoir', 'unreachable');
ok('a different message rewrites the code', /code=unreachable/.test(hrefOf('lpn_tell_status')) && !/engine-run/.test(hrefOf('lpn_tell_status')));
ok('nothing out of the drawing: only from, cat, lang and code appear',
	hrefOf('lpn_tell_status').split('?')[1].split('&').every((kv) => /^(from|cat|lang|code)=/.test(kv)));
const src = fs.readFileSync(path.join(ROOT, 'js/lpn-time.js'), 'utf8') + fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
ok('both engine-failure paths hand setStatus a code',
	/host\.status\(noEngineText\(state\.t\), 'engine-' \+ state\.failedWhy\)/.test(src) && /'engine-' \+ failWhy\);/.test(src));

console.log('\n' + (fails ? fails + ' FAILURE(S)' : 'ALL PASS'));
process.exit(fails ? 1 : 0);
