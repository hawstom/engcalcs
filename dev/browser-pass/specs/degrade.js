// §9 and §6's broken-vs-absent pair — what the page says when the lock broker is not working.
//
// **A server that ANSWERS "I cannot write the lock directory" is not the same as a server that is
// not there**, and only one of the two is somebody's to go and fix. The page flattened both into
// "could not reach the server" until 2026-08-05, which cost Tom an evening: he kept reading a
// network message about a `chmod`. Each wording is checked here against the error the broker
// actually returns.
//
// Not covered: the 60-second poll that clears the banner when locking comes back. Waiting a minute
// per run to prove one line is the wrong trade — it stays a human check in §9.

const { Session } = require('../lib/session');

exports.title = '9. No server, a broken server, and the difference between them';

const FILE = 'Degrade-lpn-hawsedc-engcalcs.json';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.drawExample();
		await a.queuePick(FILE);
		await a.menuClick('Save');
		await a.answerTrainingPanel('TGH');
		await a.settle(500);
		report.ok(await a.banner() === null, 'set up: with a working broker there is no banner at all');

		// --- not there at all ---------------------------------------------------
		await a.blockBroker();
		await a.drawExample();
		await a.menuClick('Save');
		let b = await a.waitBanner();
		report.ok(!!b, 'an unreachable broker is reported');
		report.has(b && b.text, 'could not reach the server', 'in the words of an outage');
		report.has(b && b.text, 'nothing is stopping a colleague', 'and says what the risk actually is');
		await a.unblockBroker();

		// --- there, and broken ---------------------------------------------------
		await a.brokerReplies(500, { ok: false, error: 'storage' });
		await a.drawExample();
		await a.menuClick('Save');
		b = await a.waitBanner();
		report.ok(b && /setup fault on the server/.test(b.text || ''),
			'a lock folder the web server cannot write is named as a SETUP FAULT',
			b ? (b.text || '').slice(0, 100) : '');
		report.ok(b && /not writable by the web server/.test(b.text || ''),
			'and says the thing somebody can act on', 'this is one chmod, not a network problem');
		await a.unblockBroker();

		// --- there, and out of room ------------------------------------------------
		await a.brokerReplies(503, { ok: false, error: 'full' });
		await a.drawExample();
		await a.menuClick('Save');
		b = await a.waitBanner();
		report.ok(b && /run out of room/.test(b.text || ''), 'a full lock directory says so, in its own words',
			b ? (b.text || '').slice(0, 90) : '');
		await a.unblockBroker();

		// --- Dismiss, and when it is honest to offer one -----------------------------
		// Undismissable while the site is up and the request is being refused: there the warning
		// describes a real, fixable risk to a colleague's work. Dismissable when the whole browser is
		// offline, because that is a standing condition of how the page is being used rather than a
		// fault anybody can act on (Tom, 2026-08-03, unsure which way this should go — this is the
		// call as built, so a future change to it is a decision rather than a drift).
		await a.blockBroker();
		await a.drawExample();
		await a.menuClick('Save');
		b = await a.waitBanner();
		report.ok(b && !(b.buttons || []).includes('Hide this message'),
			'online but refused: the warning cannot be dismissed', b ? b.buttons.join(' / ') : '');

		await a.context.setOffline(true);
		await a.drawExample();
		await a.menuClick('Save');
		b = await a.waitBanner();
		report.ok(b && (b.buttons || []).includes('Hide this message'),
			'genuinely offline: it CAN be dismissed — nobody can act on it',
			b ? b.buttons.join(' / ') : '');
		await a.context.setOffline(false);
		await a.unblockBroker();

		// --- and none of it takes the calculator away -------------------------------
		await a.blockBroker();
		const before = (await a.tabs()).length;
		await a.drawExample();
		report.ok(await a.currentTabDirty(), 'editing still works with no broker at all');
		await a.menuClick('New project');
		report.eq((await a.tabs()).length, before + 1, 'and so does everything else — a lock outage is not an outage');
		await a.unblockBroker();

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
		if (a.errors.length) { console.log(a.errors.join('\n')); }
	} finally {
		await a.close();
	}
};
