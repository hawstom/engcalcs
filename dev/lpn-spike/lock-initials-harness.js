// TASK 667(b) — NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE.
//
//   node dev/lpn-spike/lock-initials-harness.js
//
// Tom, 2026-09-17: *"Change the sequence of asking for a user's initials. This should happen when
// user B tries to open a locked file, and not sooner... asking user A for their initials the first
// time they save a file is a bit startling, not to mention easily confused with a login or account
// registration."* On a site with no login, no account and no session by construction, that is the
// whole defect: the page collected a name for a colleague who in most cases never arrives.
//
// **THE THREE THINGS THAT CAN SILENTLY GO WRONG HERE, and each is a section below.**
//
//  1. **THE FIRST USER IS ASKED SOMETHING.** A re-added input, or a window.prompt creeping back into
//     the identity path, puts the registration back. Neither errors and both look fine on screen, so
//     the assertion is the absence: the training panel carries NO text field and NOTHING prompts.
//
//  2. **AN AGE THAT IS NOT KNOWN IS STATED ANYWAY.** This is the dialog on which somebody decides
//     whether to step on a colleague's afternoon. A confidently wrong "in use for 3 hours" is worse
//     than no number at all, and the broker genuinely does not know every age for every record --
//     `acquiredAt` did not exist before this task, and `savedAt` is zero until the holder saves. So
//     the readout is asserted BOTH ways: the sentence appears where the fact is on record, and the
//     line carries no digits at all where nothing is.
//
//  3. **BREAKING A LOCK QUIETLY COSTS THE HOLDER THEIR WORK.** Breaking a lock takes the CLAIM. It
//     must not write one byte to the file the holder is still editing, and this asserts it at the
//     handle: the fake handle counts createWritable() and the count must stay at zero.
//
// `landOpenedFile()` is stubbed at its own first line, so what is asserted here is which landing
// each button asks for -- read-only, editable, or none at all. What that function then DOES with a
// project is dev/lpn-spike/handle-restore-harness.js's and the browser pass's business; duplicating
// it here would test the stub.

const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const { execFileSync } = require('child_process');
const fs = require('fs');

// ---------------------------------------------------------------------------
// The broker, faked at the network seam, recording every POST as it goes.
// ---------------------------------------------------------------------------
const posted = [];
let brokerReply = { ok: true };
global.fetch = async function (url, init) {
	const b = init.body;
	const row = {};
	b.forEach((v, k) => { row[k] = v; });
	posted.push(row);
	const reply = typeof brokerReply === 'function' ? brokerReply(row) : brokerReply;
	return { json: async () => reply };
};
global.window.fetch = global.fetch;

// What the user typed into a prompt, and how many times they were asked anything at all.
let prompts = 0, promptAnswer = 'ABC';
global.window.prompt = function () { prompts++; return promptAnswer; };
global.window.alert = function () {};

global.__LANDED = [];

const L = loadLoopedNetwork(
	"\t\trequireFileIdentity: requireFileIdentity,\n" +
	"\t\tlockReadoutLines: lockReadoutLines,\n" +
	"\t\tpresentOpenChoice: presentOpenChoice,\n" +
	"\t\tnoteLockRequest: noteLockRequest,\n" +
	"\t\tloadIdentity: function () { identity = null; return loadIdentity(); },\n" +
	"\t\tbannerWarn: function () { return bannerWarn; },\n" +
	"\t\tclearBanner: function () { bannerWarn = null; },\n" +
	"\t\tidentityKey: LPN_IDENTITY_KEY,\n" +
	"\t\topenId: function () { return library.openId; },\n",
	null,
	// The one seam stubbed, and stubbed at its own first line so the call still happens and its
	// arguments are still the page's own.
	(src) => src.replace(
		"\tfunction landOpenedFile(saved, handle, asReadOnly, heldBy) {",
		"\tfunction landOpenedFile(saved, handle, asReadOnly, heldBy) {\n" +
		"\t\tglobal.__LANDED.push({ asReadOnly: !!asReadOnly, heldBy: heldBy }); return;")
);

const PC = global.EngCalcs.pageConfig;

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log(' FAIL  ' + name + (extra === undefined ? '' : '   ' + extra));
}
setUnitSet('us');

// Every key actually present on the device, read the way the browser exposes them rather than off
// the stub's own object -- the point of the check is what a visitor's storage holds.
function storageKeys() {
	const out = [];
	for (let i = 0; i < localStorage.length; i++) { out.push(localStorage.key(i)); }
	return out.sort().join(',');
}

// The caution glyph this suite already means by caution -- the verdict strings' own, prepended by
// the renderer rather than carried in the language file. Written once here so a harness reading
// the button row is not the place somebody has to retype it.
const CAUTION = '\u26a0';
// --- reading the dialog the way a person reads it -------------------------
function dialogParagraphs() {
	return byId.lpn_dialog_body.children.map(c => c.textContent);
}
function dialogButtons() {
	return byId.lpn_dialog_buttons.children.map(c => c.textContent);
}
function press(label) {
	const btn = byId.lpn_dialog_buttons.children.filter(c => c.textContent === label)[0];
	if (!btn) { throw new Error('no such button: ' + label); }
	return (btn._listeners.click || []).map(fn => fn({}))[0];
}
// **THE BUTTON'S LISTENER DOES NOT HAND BACK ITS PROMISE.** openDialog() wires
// `function () { closeDialog(); b.fn(); }`, so pressing an async answer returns undefined and the
// work carries on in the background -- awaiting the press itself would assert against a half-run
// handler and pass or fail on how many microtasks a fetch happens to cost that day.
const settle = () => new Promise(r => setImmediate(r));
// Every descendant tag, so a text field cannot hide inside a <label> the way the old one did.
function tagsIn(el, out) {
	out = out || [];
	(el.children || []).forEach(c => { out.push(c._tag); tagsIn(c, out); });
	return out;
}

console.log('\n--- 1. the first user is asked nothing at all ---');
{
	localStorage.removeItem('lpn_identity');
	prompts = 0;
	const ready = L.requireFileIdentity('save');
	ok('a browser that has never saved is not ready to save yet', ready === false);
	ok('...it gets the training panel', dialogParagraphs().length > 0);
	ok('...which carries NO text field', tagsIn(byId.lpn_dialog_body).indexOf('input') < 0,
		JSON.stringify(tagsIn(byId.lpn_dialog_body)));
	ok('...and asks for initials nowhere in its words',
		dialogParagraphs().every(t => t.toLowerCase().indexOf('initials') < 0),
		JSON.stringify(dialogParagraphs()));
	ok('...and does not prompt either', prompts === 0);
	// **ONE PARAGRAPH, AND IT IS THE BROWSER-PERMISSION ONE** (Tom, 2026-09-17: *"I waffle on 'drop
	// the pre-Open message entirely'. The browser message about saving could be alarming without an
	// introduction (the last paragraph I mentioned keeping)."*). The panel survives because of a
	// prompt that comes from the BROWSER and not from us; the two paragraphs that went recited
	// expectations a person already brings -- that a file is saved when they ask, and that software
	// watches for two people in one file.
	//
	// Asserted as an exact list rather than as three separate presences, because "the panel is
	// short" is the whole finding: a fourth paragraph added later is a regression this must catch,
	// and three `indexOf >= 0` tests never could.
	ok('the panel is exactly one paragraph',
		JSON.stringify(dialogParagraphs()) === JSON.stringify([PC.lpn_file_training_permission]),
		JSON.stringify(dialogParagraphs()));
	ok('...and it is the one about the browser asking permission',
		dialogParagraphs()[0] === PC.lpn_file_training_permission);
	ok('...the two that recited ordinary expectations are gone',
		dialogParagraphs().indexOf(PC.lpn_file_training_1) < 0 &&
		dialogParagraphs().indexOf(PC.lpn_file_training_2) < 0);

	press(PC.lpn_file_training_continue);
	const idn = L.loadIdentity();
	ok('Continue mints an identity', !!(idn && idn.holder));
	ok('...with NO name on it', idn.name === '', JSON.stringify(idn.name));
	ok('...marked as having been told, so the panel does not come back', idn.trained === true);
	ok('...and the second save asks nothing', L.requireFileIdentity('save') === true && prompts === 0);
	// The identity record is the ONLY thing this feature writes, and it existed before this task.
	ok('the identity record is the only thing written, and it predates this task',
		localStorage.getItem('lpn_identity') !== null && storageKeys() === 'lpn_identity');
}

console.log('\n--- 2. the readout states the ages it has, and invents none ---');
{
	const now = Date.now();
	// All three on record: the broker's own in-use clock (seconds), and the holder's edit and save
	// stamps (milliseconds). Mixing those units turns "5 minutes" into "7 weeks".
	let lines = L.lockReadoutLines({
		lockedBy: '', acquiredAt: Math.floor(now / 1000) - 3 * 3600,
		editedAt: now - 10 * 60000, savedAt: now - 40 * 60000
	});
	ok('an anonymous holder is described by the FILE, not by a person',
		lines[0].indexOf(PC.lpn_lock_open_inuse) === 0, JSON.stringify(lines[0]));
	ok('...and the lead line still tells them to choose carefully',
		lines[0].indexOf(PC.lpn_lock_open_care) > 0, JSON.stringify(lines[0]));
	ok('in use for: 3 hours', /in use for 3 hours/.test(lines[1]), JSON.stringify(lines[1]));
	ok('last saved: 40 minutes', /last saved 40 minutes ago/.test(lines[1]), JSON.stringify(lines[1]));
	ok('last edited: 10 minutes', /last edited 10 minutes ago/.test(lines[1]), JSON.stringify(lines[1]));
	ok('all three ages, in Tom\'s order',
		lines[1].indexOf('in use for') < lines[1].indexOf('last saved') &&
		lines[1].indexOf('last saved') < lines[1].indexOf('last edited'), JSON.stringify(lines[1]));
	ok('the third paragraph explains the four answers', lines[2] === PC.lpn_lock_open_choices_ask);

	// A record from before this task: no acquiredAt at all. THE SENTENCE MUST NOT APPEAR.
	lines = L.lockReadoutLines({ lockedBy: '', editedAt: now - 10 * 60000, savedAt: now - 40 * 60000 });
	ok('an older record states no in-use age rather than a plausible one',
		lines[1].indexOf('in use') < 0, JSON.stringify(lines[1]));
	ok('...and still states the two ages it does have',
		/last saved 40 minutes ago/.test(lines[1]) && /last edited 10 minutes ago/.test(lines[1]));

	// Edited, never saved. The absence IS the fact, and it is the case where breaking costs most.
	lines = L.lockReadoutLines({ lockedBy: '', acquiredAt: Math.floor(now / 1000) - 600, editedAt: now - 60000 });
	ok('work that has never been saved to the file says so',
		lines[1].indexOf(PC.lpn_lock_age_never_saved) >= 0, JSON.stringify(lines[1]));
	ok('...and no invented save time comes with it', !/last saved/.test(lines[1]));

	// Nothing on record at all. NO DIGITS -- the strongest form of "we did not make one up".
	lines = L.lockReadoutLines({ lockedBy: '' });
	ok('a record with no ages says so in words', lines[1] === PC.lpn_lock_age_unknown, JSON.stringify(lines[1]));
	ok('...and carries no number anywhere', !/[0-9]/.test(lines[1]), JSON.stringify(lines[1]));

	// A name, where an older page left one behind, is still used.
	lines = L.lockReadoutLines({ lockedBy: 'TGH' });
	ok('a holder who DID give a name is still named', lines[0].indexOf('TGH') >= 0, JSON.stringify(lines[0]));
}

(async function () {

console.log('\n--- 3. four answers, and each does what it says ---');
{
	const saved = { project: { docId: 'dabcdefgh123' } };
	// A handle that would record any write. Breaking a lock must never reach it.
	const handle = { name: 'x.lwn', writes: 0, createWritable() { this.writes++; throw new Error('no'); } };

	posted.length = 0; global.__LANDED.length = 0;
	L.presentOpenChoice(saved, handle, 'Somebody else', { lockedBy: '', acquiredAt: 1, editedAt: 0, savedAt: 0 });
	ok('the dialog offers exactly four answers', dialogButtons().length === 4, JSON.stringify(dialogButtons()));
	// **ASK, OPEN READ-ONLY, CANCEL, THEN BREAK LOCK.** The interface-designer's row, which Tom took
	// on 2026-09-17: *"I agree with Ask . Open read-only . Cancel . -- gap -- . warning Break
	// lock"*. It replaces Ask, Break lock, Open read-only, Cancel. Three separate assertions
	// follow, because the row has three properties and a single string comparison would let a
	// future edit trade one for another silently.
	ok('...in the order Tom agreed: Ask, Open read-only, Cancel, then Break lock',
		JSON.stringify(dialogButtons()) === JSON.stringify(
			[PC.lpn_lock_ask, PC.lpn_lock_open_readonly, PC.lpn_cancel, CAUTION + ' ' + PC.lpn_lock_break]),
		JSON.stringify(dialogButtons()));
	// **THE FIRST BUTTON TAKES KEYBOARD FOCUS**, which is why Ask leads: a bare Enter, or the second
	// half of a fast double-click, lands on whatever is first, so what is first must be the answer
	// that changes nothing.
	ok('...and the answer that changes nothing is the one a stray Enter reaches',
		dialogButtons()[0] === PC.lpn_lock_ask);
	// **CANCEL SITS BEFORE BREAK LOCK, NOT AFTER IT.** In the shipped order the destructive answer
	// was one seat from Cancel, where a startled click or a Tab-Tab-Enter reaches it.
	ok('...with Cancel between the safe answers and the destructive one',
		dialogButtons().indexOf(PC.lpn_cancel)
			< dialogButtons().indexOf(CAUTION + ' ' + PC.lpn_lock_break));
	// THE GAP, AND THE GLYPH, AND NOTHING ELSE. This suite does not dress one answer to stand out;
	// what a data-loss answer earns over a consent answer is distance and a caution mark.
	const breakBtn = byId.lpn_dialog_buttons.children[3];
	const others = byId.lpn_dialog_buttons.children.slice(0, 3);
	ok('Break lock is set apart by a gap', breakBtn.style.marginLeft !== others[0].style.marginLeft
		&& parseInt(breakBtn.style.marginLeft, 10) > parseInt(others[0].style.marginLeft, 10),
		breakBtn.style.marginLeft + ' vs ' + others[0].style.marginLeft);
	ok('...and leads with the caution glyph the verdict strings already use',
		breakBtn.textContent.indexOf(CAUTION) === 0, breakBtn.textContent);
	// **THE GLYPH IS PREPENDED, NOT TRANSLATED.** A marker word in its place would be a word to
	// translate into 26 languages and one more thing to get wrong in the five that read right to
	// left. The language file must carry the words alone.
	ok('...which is not in the language file, so it costs nothing to translate',
		String(PC.lpn_lock_break).indexOf(CAUTION) < 0, PC.lpn_lock_break);
	// AND NOTHING ELSE IS DIFFERENT ABOUT IT: no colour, no border, no size.
	ok('...and it is not dressed to stand out in any other way',
		!breakBtn.style.background && !breakBtn.style.color && !breakBtn.style.border
		&& !breakBtn.style.fontWeight && !breakBtn.className);

	// --- Cancel: the project never lands, and nothing is said to the server.
	press(PC.lpn_cancel);
	ok('Cancel lands nothing', global.__LANDED.length === 0);
	ok('Cancel tells the server nothing', posted.length === 0, JSON.stringify(posted));

	// --- Open read-only.
	L.presentOpenChoice(saved, handle, 'Somebody else', { lockedBy: '' });
	press(PC.lpn_lock_open_readonly);
	ok('Open read-only lands the project read-only', global.__LANDED.length === 1 && global.__LANDED[0].asReadOnly === true);
	ok('...and takes nobody\'s lock', posted.length === 0, JSON.stringify(posted));

	// --- Ask: sends the initials, stores nothing, takes nothing.
	const storedBefore = JSON.stringify(localStorage.getItem('lpn_identity'));
	const keysBefore = storageKeys();
	global.__LANDED.length = 0; posted.length = 0; prompts = 0; promptAnswer = 'JHB';
	brokerReply = { ok: true, requested: true };
	press(PC.lpn_lock_ask); await settle();
	ok('Ask asks for initials, once, at the moment they are useful', prompts === 1);
	ok('...and sends a request to the broker',
		posted.length === 1 && posted[0].action === 'request', JSON.stringify(posted));
	ok('...carrying the initials that were just typed', posted[0].name === 'JHB', JSON.stringify(posted[0]));
	ok('...against the document id inside the file', posted[0].id === 'dabcdefgh123');
	ok('Ask does not land the project', global.__LANDED.length === 0);
	ok('Ask takes nobody\'s lock', posted.every(p => p.action !== 'steal'));
	// THE CONSTRAINT THAT MATTERS: initials typed for an Ask are SENT, never saved. New storage
	// falsifies a sentence in consent_body and costs a banner rewrite and 26 retranslations.
	ok('the initials are NOT written to this device',
		JSON.stringify(localStorage.getItem('lpn_identity')) === storedBefore,
		String(localStorage.getItem('lpn_identity')));
	ok('...and no new storage key appears for them',
		storageKeys() === keysBefore);
	ok('...nor does the identity record learn a name',
		(L.loadIdentity() || {}).name === '');

	// Backing out of the prompt sends nothing at all.
	posted.length = 0; promptAnswer = null;
	L.presentOpenChoice(saved, handle, 'Somebody else', { lockedBy: '' });
	press(PC.lpn_lock_ask); await settle();
	ok('backing out of the initials prompt sends nothing', posted.length === 0, JSON.stringify(posted));
	promptAnswer = 'JHB';

	// --- Break lock: takes the claim, and touches no byte of the holder's file.
	global.__LANDED.length = 0; posted.length = 0;
	brokerReply = { ok: true, held: true };
	L.presentOpenChoice(saved, handle, 'Somebody else', { lockedBy: '' });
	press(CAUTION + ' ' + PC.lpn_lock_break); await settle();
	ok('Break lock takes the claim', posted.length === 1 && posted[0].action === 'steal', JSON.stringify(posted));
	ok('...and lands the project editable', global.__LANDED.length === 1 && global.__LANDED[0].asReadOnly === false);
	ok('BREAKING A LOCK WRITES NOTHING TO THE HOLDER\'S FILE', handle.writes === 0,
		'createWritable() called ' + handle.writes + ' time(s)');
	ok('...and the claim is taken BEFORE the project lands, never after',
		posted.length === 1 && global.__LANDED.length === 1);
}

console.log('\n--- 4. the other end of Ask: the holder is told, once ---');
{
	L.clearBanner();
	posted.length = 0;
	brokerReply = { ok: true, held: true };
	const reply = { ok: true, held: true, requestedBy: 'JHB', requestedAt: 1700000000 };
	await L.noteLockRequest(L.openId(), 'dabcdefgh123', reply);   // null id == the open project in the stub
	const w = L.bannerWarn();
	ok('the holder is told somebody wants the file', !!w && w.kind === 'request', JSON.stringify(w));
	ok('...naming who asked', !!w && w.message.indexOf('JHB') === 0, w && w.message);
	ok('...as a warning they can put away, never a modal that takes the file', !!w && w.dismissable === true);
	ok('...and the ask is acknowledged straight away, so it is not repeated',
		posted.length === 1 && posted[0].action === 'acquire' && posted[0].ack === '1700000000',
		JSON.stringify(posted));

	L.clearBanner();
	posted.length = 0;
	await L.noteLockRequest(L.openId(), 'dabcdefgh123', reply);
	ok('the SAME ask is not raised a second time', L.bannerWarn() === null);
	ok('...and is not acknowledged twice either', posted.length === 0, JSON.stringify(posted));

	// A LATER ask from the same colleague is news again -- keyed on the timestamp, not on the name.
	L.clearBanner();
	await L.noteLockRequest(L.openId(), 'dabcdefgh123', { ok: true, held: true, requestedBy: 'JHB', requestedAt: 1700000600 });
	ok('a LATER ask is raised again', !!L.bannerWarn());

	// An anonymous asker still gets a message that reads.
	L.clearBanner();
	await L.noteLockRequest(L.openId(), 'dabcdefgh123', { ok: true, held: true, requestedBy: '', requestedAt: 1700001200 });
	ok('an asker who typed nothing still produces a sentence that reads',
		(L.bannerWarn().message || '').indexOf(PC.lpn_lock_somebody) === 0, L.bannerWarn().message);

	// NOTHING happens where there is no ask, which is every ordinary heartbeat.
	L.clearBanner();
	posted.length = 0;
	await L.noteLockRequest(L.openId(), 'dabcdefgh123', { ok: true, held: true });
	ok('an ordinary heartbeat says nothing and acknowledges nothing',
		L.bannerWarn() === null && posted.length === 0);
}

console.log('\n--- 5. the broker itself, run for real ---');
{
	// **THE REST OF THIS FILE FAKES THE BROKER, so the new SERVER logic would otherwise be held by
	// nothing.** Two things live only in lpn-lock.php and both fail silently: the in-use clock, whose
	// whole value is that a heartbeat does NOT restart it, and the back channel, which must leave the
	// holder exactly where it found them. One process per request, because the script ends in exit().
	const docId = 'd' + 'hz' + Date.now().toString(36) + 'test';
	const recordPath = ROOT + 'lpn-locks/' + docId + '.json';
	const A = 'holderAAAAAAAA', B = 'holderBBBBBBBB', C = 'holderCCCCCCCC';
	function broker(fields) {
		const php = '$_SERVER["REQUEST_METHOD"]="POST"; $_POST=json_decode($argv[1], true);'
			+ ' include ' + JSON.stringify(ROOT + 'lpn-lock.php') + ';';
		const out = execFileSync('php', ['-d', 'error_reporting=0', '-r', php, JSON.stringify(fields)],
			{ encoding: 'utf8' });
		return JSON.parse(out.slice(out.indexOf('{')));
	}
	try {
		let r = broker({ action: 'acquire', id: docId, holder: A });
		ok('a fresh lock is granted', r.ok === true && r.held === true, JSON.stringify(r));
		ok('...and the server stamps when it was taken', r.acquiredAt > 0);
		// **BACK-DATED ON DISK RATHER THAN SLEPT THROUGH.** A heartbeat sent in the same second as the
		// acquire carries the same stamp whether the clock is preserved or restarted, so this check
		// passed against code that restarted it on every beat -- measured, before this line existed.
		const rec = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
		const heldSince = rec.acquiredAt - 3 * 3600;
		rec.acquiredAt = heldSince;
		fs.writeFileSync(recordPath, JSON.stringify(rec));

		r = broker({ action: 'acquire', id: docId, holder: A });
		ok('A HEARTBEAT DOES NOT RESTART THE IN-USE CLOCK', r.acquiredAt === heldSince,
			heldSince + ' -> ' + r.acquiredAt);

		let seen = broker({ action: 'check', id: docId, holder: B });
		ok('a colleague sees the lock and the age it carries',
			seen.locked === true && seen.mine === false && seen.acquiredAt === heldSince, JSON.stringify(seen));
		const activityBefore = seen.lastActivity;

		r = broker({ action: 'request', id: docId, holder: B, name: 'JHB' });
		ok('Ask is accepted', r.ok === true && r.requested === true, JSON.stringify(r));
		seen = broker({ action: 'check', id: docId, holder: B });
		ok('...and takes nothing: the holder is unchanged', seen.locked === true && seen.mine === false);
		ok('...and makes the holder look no more recently active than they are',
			seen.lastActivity === activityBefore, activityBefore + ' -> ' + seen.lastActivity);
		ok('...and does not disturb the in-use clock either', seen.acquiredAt === heldSince);

		r = broker({ action: 'acquire', id: docId, holder: A });
		ok('the holder collects the ask on their next heartbeat',
			r.requestedBy === 'JHB' && r.requestedAt > 0, JSON.stringify(r));
		const askedAt = r.requestedAt;

		r = broker({ action: 'acquire', id: docId, holder: A, ack: String(askedAt) });
		ok('acknowledging it clears it', r.requestedBy === '' && r.requestedAt === 0, JSON.stringify(r));
		r = broker({ action: 'acquire', id: docId, holder: A });
		ok('...and it stays cleared, so the holder is not nagged every minute',
			r.requestedBy === '' && r.requestedAt === 0);

		// An ack for an ask that is not the one on record must not swallow a newer one.
		broker({ action: 'request', id: docId, holder: B, name: 'JHB' });
		r = broker({ action: 'acquire', id: docId, holder: A, ack: '1' });
		ok('a stale acknowledgement does not swallow a newer ask', r.requestedBy === 'JHB');

		r = broker({ action: 'steal', id: docId, holder: C });
		ok('breaking the lock hands it to the breaker', r.held === true);
		ok('...and starts the in-use clock again, because it is a different person now',
			r.acquiredAt > heldSince && r.requestedBy === '', JSON.stringify(r));

		r = broker({ action: 'release', id: docId, holder: C });
		ok('releasing gives it up', r.released === true);
		seen = broker({ action: 'check', id: docId, holder: B });
		ok('...leaving nothing behind to describe',
			seen.locked === false && !seen.acquiredAt, JSON.stringify(seen));
	} finally {
		try { fs.unlinkSync(recordPath); } catch (e) { /* the release already swept it */ }
	}
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

})();
