// THE LOCK BANNER: what it says, when it says it again, and what its arrival does to the map.
//   node dev/lpn-spike/lock-banner-harness.js
//
// Two defects, both Tom's, both found on 2026-08-27 in one sentence:
//
//   1. **THE BANNER PUSHED THE MAP OFF THE BOTTOM OF THE SCREEN.** *"There is a file save message
//      that I believe is a culprit pushing the map off the bottom of the screen... If I reload the
//      page, the message is gone and the map sizes correctly."* The canvas is sized to fill the
//      window minus what is above and below it; the banner is chrome in FLOW above it and arrives
//      after that measurement, so the page sits one banner lower with a map still sized for a page
//      without one. A reload has no banner, which is exactly why a reload looked like a fix.
//      That half is asserted in dev/lpn-spike/map-height-harness.js, where the map's height lives.
//
//   2. **IT COULD NOT BE PUT AWAY.** *"I also don't like that this message is permanent and
//      undismissable."* It was dismissable only offline or as an installed app. The person the old
//      rule punished is the one on a site whose lock folder is not writable: told a true thing about
//      somebody else's server, on every screen, for as long as the page is open.
//
// **WHAT IS WORTH TESTING IS THE MEMORY, NOT THE BUTTON.** A Dismiss that silences a real risk
// forever is worse than no Dismiss at all, so the dismissal is scoped to one project and one fault,
// and every way OUT of that scope has to bring the warning back. Each of those ways is a check
// below, because each of them is a silent failure: nothing errors, the banner simply never returns.

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tsetLockUnavailable: setLockUnavailable,\n" +
	"\t\tlockUnavailableMessage: lockUnavailableMessage,\n" +
	"\t\tsetLockError: function (c) { lockErrorCode = c; },\n" +
	"\t\tbannerWarn: function () { return bannerWarn; },\n" +
	"\t\tnewProject: newProject, openId: function () { return library.openId; },\n" +
	// The whole layer stack, because newProject() below runs a real refreshAllFromDocument().
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log(' FAIL  ' + name + (extra === undefined ? '' : '   ' + extra));
}

setUnitSet('us');
L.buildLayers();

// The banner element, as the page draws it: a row of children, the first a <span> of words and the
// rest buttons. Read the way a person reads it -- what does it SAY, and what can I press.
const banner = () => byId.lpn_lock_banner;
function bannerText() {
	const b = banner();
	if (b.style.display === 'none') { return null; }
	return (b.children[0] && b.children[0].textContent) || '';
}
function buttons() {
	return banner().children.filter(c => c._tag === 'button').map(c => c.textContent);
}

console.log('\n--- a lock fault is said once, and can be put away ---');
{
	L.setLockError('storage');
	L.setLockUnavailable(true);
	ok('a lock fault raises the banner', bannerText() !== null, JSON.stringify(bannerText()));
	ok('...naming the fault it actually is, not a generic outage',
		/lock records|not writable/.test(bannerText() || ''), JSON.stringify(bannerText()));
	// **THE BANNER AND THE SAVE-TIME NOTICE ARE ONE WORDING.** They were one string literal chosen by
	// a chain of ternaries inside the banner builder, so a notice could only ever have been a second
	// copy of the same four sentences.
	ok('...and the message has ONE source, which the save path can borrow',
		bannerText() === L.lockUnavailableMessage());
	ok('every warning banner offers Dismiss now, whatever the browser is doing',
		buttons().length === 1, JSON.stringify(buttons()));
}

console.log('\n--- what a dismissal dismisses, and what brings it back ---');
{
	// Press it the way a person does: the real listener on the real button.
	function dismiss() {
		const btn = banner().children.filter(c => c._tag === 'button')[0];
		(btn._listeners.click || []).forEach(fn => fn({}));
	}
	dismiss();
	ok('pressing Dismiss puts the banner away', bannerText() === null);
	// THE SAME FAULT, ON THE SAME PROJECT: this is the one case that must stay quiet, and it is the
	// case that actually happens -- the heartbeat and every save re-raise it on a broken server.
	L.setLockUnavailable(true);
	ok('...and the same fault on the same project does not come back', bannerText() === null,
		JSON.stringify(bannerText()));

	// A DIFFERENT FAULT IS DIFFERENT NEWS. "The lock table is full" is not the thing that was
	// dismissed, and a dismissal keyed on the project alone would have swallowed it.
	L.setLockError('full');
	L.setLockUnavailable(true);
	ok('a DIFFERENT fault says itself, even after a dismissal',
		/run out of room/.test(bannerText() || ''), JSON.stringify(bannerText()));

	// LOCKING COMING BACK IS A STATE CHANGE, so it forgets the dismissal: if it breaks again, that
	// is news. Without this a single Dismiss silences the rest of the session.
	dismiss();
	L.setLockUnavailable(false);
	ok('locking working again clears the banner', bannerText() === null);
	L.setLockUnavailable(true);
	ok('...and a fault AFTER it recovered is said again, not swallowed',
		bannerText() !== null, JSON.stringify(bannerText()));
}

console.log('\n--- the dismissal belongs to one project, not to the session ---');
{
	// A dismissal that followed the user into another project would be a promise made about a file
	// they have not opened yet.
	const before = L.openId();
	const btn = banner().children.filter(c => c._tag === 'button')[0];
	(btn._listeners.click || []).forEach(fn => fn({}));
	ok('dismissed on this project', bannerText() === null);
	L.newProject();
	ok('a new project really is a different project', L.openId() !== before);
	L.setLockUnavailable(true);
	ok('...and the same fault on it is said, because nobody dismissed it there',
		bannerText() !== null, JSON.stringify(bannerText()));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
