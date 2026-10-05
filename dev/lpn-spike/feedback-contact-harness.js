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
const enSrc = fs.readFileSync(path.join(ROOT, 'lib/lang.ec.en.php'), 'utf8');
function val(k) {
	const m = new RegExp("\\$ec_lang\\['" + k + "'\\]='((?:[^'\\\\]|\\\\.)*)';").exec(enSrc);
	return m ? m[1].replace(/\\'/g, "'") : '';
}
const has = (html, k) => val(k) !== '' && html.indexOf(val(k)) >= 0;
function render(page, get, lang) {
	const a = [path.join(ROOT, 'dev/scripts/render_page.php'), page];
	if (lang) { a.push('--lang=' + lang); }
	if (get) { a.push('--get=' + get); }
	return execFileSync('php', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

console.log('\n---- 1. contact.php ----');
const plain = render('contact.php');
ok('has the category select', /<select[^>]*name="category"/.test(plain));
const opts = (plain.match(/<option value="[a-z]+"/g) || []).map((s) => s.slice(15, -1));
ok('offers the four categories, in order', opts.join(',') === 'wrong,wording,idea,other', opts.join(','));
ok('the select is labelled "What is this about?"', has(plain, 'contactCategory'));
ok('the e-mail field says it is optional', has(plain, 'contactYourEmailOptional'));
ok('...and English no longer shows the old demanding label', !has(plain, 'contactYourEmail'));
const frSrc = fs.readFileSync(path.join(ROOT, 'lib/lang.ec.fr.php'), 'utf8');
const frOld = /\$ec_lang\['contactYourEmail'\]='((?:[^'\\]|\\.)*)';/.exec(frSrc)[1].replace(/\\'/g, "'");
const frPage = render('contact.php', null, 'fr');
ok('a language without the new key keeps its translated email label (fallback until the sprint)',
	!/\$ec_lang\['contactYourEmailOptional'\]/.test(frSrc) ? frPage.indexOf(frOld) >= 0 && frPage.indexOf(val('contactYourEmailOptional')) < 0 : true, frOld);
ok('no preset: "Other" is selected', /<option value="other" selected>/.test(plain));
const pre = render('contact.php', 'from=Looped-Network&cat=wrong&code=engine-run&lang=en');
ok('?cat=wrong presets "Something is wrong"', /<option value="wrong" selected>/.test(pre));
ok('?from= is still carried', /name="origin" value="Looped-Network"/.test(pre));
ok('?code= and ?lang= are carried as hidden fields',
	/name="code" value="engine-run"/.test(pre) && /name="ctxlang" value="en"/.test(pre));
ok('...and the sender is told what rides along, in words', has(pre, 'contactContextNote'));
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
ok('an upper-case address is accepted (A@B.com)', post({ name: 'a', email: 'A@B.com', subject: 's', message: 'm' }).mail !== null);
const hdr = good.mail === null ? '' : good.mail.split(/\r?\n\r?\n/)[0];
ok('with no e-mail the headers carry no empty or trailing header line',
	good.mail !== null && !/(^|\n)\r?\n/.test(hdr) && !/\r?\n$/.test(hdr) && /From: HawsEDC/.test(hdr), JSON.stringify(hdr.slice(-60)));
const hdrOf = (r) => execFileSync('php', ['-r', 'require ' + JSON.stringify(path.join(ROOT, 'lib/ContactMail.lib.php')) + '; echo ecContactHeaders("From: x", ' + JSON.stringify(r) + ');'], { encoding: 'utf8' });
ok('ecContactHeaders: no Reply-to leaves no trailing CRLF', hdrOf('') === 'From: x', JSON.stringify(hdrOf('')));
ok('ecContactHeaders: a Reply-to is joined by one CRLF', hdrOf('Reply-to: a <b@c.de>') === 'From: x\r\nReply-to: a <b@c.de>');
ok('formmail.php builds its headers with it', /ecContactHeaders\(\$from, \$replyto\)/.test(fs.readFileSync(path.join(ROOT, 'formmail.php'), 'utf8')));
const rej = post({ name: 'Pat <b>', email: 'bad', subject: 'Sub "q"', message: 'Keep <this> text', category: 'idea', code: 'engine-run', ctxlang: 'es', origin: 'Looped-Network' });
ok('a refused post sends nothing but re-shows the form with the error above it',
	rej.mail === null && /Invalid e-mail address\./.test(rej.stdout) && rej.stdout.indexOf('Invalid e-mail') < rej.stdout.indexOf('<form'));
ok('...with what was typed still in the fields, escaped',
	/name="name"\s+value="Pat &lt;b&gt;"/.test(rej.stdout) && /value="bad"/.test(rej.stdout) && /value="Sub &quot;q&quot;"/.test(rej.stdout) &&
	/>Keep &lt;this&gt; text<\/textarea>/.test(rej.stdout));
ok('...and the category, code, language and page it came from still ride along',
	/<option value="idea" selected>/.test(rej.stdout) && /name="code" value="engine-run"/.test(rej.stdout) &&
	/name="ctxlang" value="es"/.test(rej.stdout) && /name="origin" value="Looped-Network"/.test(rej.stdout));
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
L.setStatus('x', 'engine-run');
ok('after an engine failure, the status link carries the error code',
	/code=engine-run/.test(hrefOf('lpn_tell_status')) && /from=Looped-Network/.test(hrefOf('lpn_tell_status')) &&
	/cat=wrong/.test(hrefOf('lpn_tell_status')) && /lang=es/.test(hrefOf('lpn_tell_status')), hrefOf('lpn_tell_status'));
L.setStatus('y', 'unreachable');
ok('a different message rewrites the code', /code=unreachable/.test(hrefOf('lpn_tell_status')) && !/engine-run/.test(hrefOf('lpn_tell_status')));
ok('nothing out of the drawing: only from, cat, lang and code appear',
	hrefOf('lpn_tell_status').split('?')[1].split('&').every((kv) => /^(from|cat|lang|code)=/.test(kv)));
const src = fs.readFileSync(path.join(ROOT, 'js/lpn-time.js'), 'utf8') + fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
ok('both engine-failure paths hand setStatus a code',
	/host\.status\(noEngineText\(state\.t\), 'engine-' \+ state\.failedWhy\)/.test(src) && /'engine-' \+ failWhy\);/.test(src));

console.log('\n' + (fails ? fails + ' FAILURE(S)' : 'ALL PASS'));
process.exit(fails ? 1 : 0);
