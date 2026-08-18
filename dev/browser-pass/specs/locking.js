// §6 and §7 — two people, one file.
//
// Two browser CONTEXTS, not two tabs: they must not share localStorage, or they share one identity
// token and the lock reads as "mine" in both — which is how a whole pass can conclude that locking
// works when nothing was ever tested. The broker is the real `lpn-lock.php` on the real PHP server.
//
// OPFS is per-profile, so the runner plays the network share: `share.from(A)` then `share.to(B)` is
// literally "A saved it, B opened it". It writes only what actually differs, because pushing
// identical bytes would advance the file's modified time and trip the very freshness check these
// checks are about.

const { Session, Share } = require('../lib/session');

exports.title = '6 & 7. Locking, read-only, and the freshness guarantee, across two profiles';

const FILE = 'Shared-lpn.json';

// Get a session to the point of having FILE saved and its identity established.
async function saveNewFile(s, initials) {
	await s.goto();
	await s.makeEdit();
	await s.queuePick(FILE);
	await s.menuClick('Save');
	await s.answerTrainingPanel(initials);
	await s.settle(500);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	const b = await Session.open(browser, 'B');
	const share = new Share();
	try {
		await saveNewFile(a, 'AAA');
		report.ok(!!(await a.readFile(FILE)), 'A has the file');
		report.ok(await a.banner() === null, 'A is editable, with no banner');

		// B needs an identity before it may touch a file at all, and gets it the same way A did.
		await b.goto();
		await b.queuePick('B-scratch-lpn.json');
		await b.menuClick('Save');
		await b.answerTrainingPanel('BBB');
		await b.settle(400);

		// --- B opens A's file ------------------------------------------------
		await share.sync(a, b);
		await b.queuePick(FILE);
		await b.menuClick('Open…');
		const dlg = await b.waitDialog();
		report.ok(!!dlg, 'B is asked before the project lands, not told afterwards');
		report.has(dlg && dlg.text, 'AAA', 'the dialog names who has it');
		report.has(dlg && dlg.text, 'has this file open', 'in the words of the punch list');
		report.ok(/seconds|minutes|hours|days|unknown/.test(dlg.text), 'and carries a NUMBER, not just a name',
			(dlg.text || '').slice(0, 120));
		report.eq(JSON.stringify(dlg.buttons), JSON.stringify(['Cancel', 'Open read-only', 'Break their lock']),
			'three choices, in the order a decent colleague tries them, and no AUTOMATIC take-over');

		// --- read-only means read-only, and nothing else ----------------------
		await b.dialogClick('Open read-only');
		const roBanner = await b.waitBanner();
		report.ok(!!roBanner, 'B gets a banner');
		report.has(roBanner && roBanner.text, 'AAA', 'naming A');
		report.has(roBanner && roBanner.text, 'Read-only', 'and saying read-only');
		report.ok((roBanner.buttons || []).includes('Save as…'), 'with Save as offered');

		const rows = await b.menuRows('file');
		const saveRow = rows.find(r => r.label === 'Save');
		report.ok(saveRow && saveRow.disabled, 'Save is DISABLED in B — it does not silently become Save as');

		await b.makeEdit();
		report.ok(await b.currentTabDirty(), 'B can still edit anything it likes — only the file is off limits');
		report.eq(b.errors.length, 0, 'and editing read-only raises no errors');

		// Read-only edits are ordinary browser edits: they live in localStorage like any other
		// project, and only the FILE is off limits. Switching away and back must not lose them, and
		// must not quietly promote the tab out of read-only either.
		const roTabs = await b.tabs();
		const roTab = roTabs.find(t => t.current);
		const otherTab = roTabs.find(t => !t.current);
		if (otherTab) {
			await b.page.evaluate((label) => {
				const el = Array.from(document.querySelectorAll('#lpn_tabs .lpn-tab-name'))
					.find(x => x.textContent === label);
				if (el) { el.click(); }
			}, otherTab.label);
			await b.settle(400);
			await b.page.evaluate((label) => {
				const el = Array.from(document.querySelectorAll('#lpn_tabs .lpn-tab-name'))
					.find(x => x.textContent === label);
				if (el) { el.click(); }
			}, roTab.label);
			await b.settle(400);
			report.ok(await b.currentTabDirty(), 'read-only edits survive a trip to another tab and back');
			const stillRO = await b.banner();
			report.ok(stillRO && /Read-only/.test(stillRO.text || ''),
				'and the tab is still read-only — nothing promotes it behind your back');
			const rows2 = await b.menuRows('file');
			report.ok((rows2.find(r => r.label === 'Save') || {}).disabled, 'Save still disabled after the round trip');
		}

		// A must be unaffected by any of that.
		await share.from(b);   // nothing of B's should have reached the file
		report.eq(share.files.get(FILE), await a.readFile(FILE), 'B has written nothing to A\'s file');

		// --- B saves its own copy ----------------------------------------------
		await b.queuePick('B-copy-lpn.json');
		await b.menuClick('Save as…');
		const bCopy = JSON.parse(await b.readFile('B-copy-lpn.json'));
		const aDoc = JSON.parse(await a.readFile(FILE));
		report.ok(!!bCopy, 'Save as… works from read-only');
		report.ok(bCopy.project.docId !== aDoc.project.docId, 'and the copy has a docId of its own');
		report.ok(await b.banner() === null, 'B is an ordinary editable project now, banner gone');

		// --- breaking the lock, then the freshness check --------------------------
		await b.queuePick(FILE);
		await b.menuClick('Open…');
		const dlg2 = await b.waitDialog();
		report.ok(!!dlg2, 'B is asked again on a second open');
		await b.dialogClick('Break their lock');
		report.ok(await b.banner() === null, 'after breaking the lock B is editable');

		await b.makeEdit();
		await b.menuClick('Save');
		const bSaved = JSON.parse(await b.readFile(FILE));
		report.ok(bSaved.project.name !== undefined, 'B saves over the file it took');

		// A now holds a lock it lost and a file that has moved on. THIS is the case that matters.
		await share.sync(b, a);
		await a.makeEdit();
		await a.menuClick('Save');
		const aBanner = await a.waitBanner();
		report.ok(!!aBanner, 'A is stopped when it tries to save over B');
		report.ok(/saved to this file|has this file open/.test(aBanner.text || ''),
			'and told why', (aBanner.text || '').slice(0, 100));
		await share.from(a);
		report.eq(share.files.get(FILE), await b.readFile(FILE), 'B\'s work is intact — A wrote nothing');

		// --- and with no broker at all -------------------------------------------
		// A is read-only now, so Save is disabled and **Save as is the path a user actually takes** —
		// which is the path that had no freshness check at all until 2026-08-06. Picking B's file
		// from that state, with the broker unreachable, is the exact case Tom reported three times.
		const rowsA = await a.menuRows('file');
		report.ok((rowsA.find(r => r.label === 'Save') || {}).disabled,
			'A, having lost the file, has Save disabled — it does not silently become Save as');

		await a.blockBroker();
		await a.answerConfirmsWith(false);      // the user reads the warning and backs out
		await a.queuePick(FILE);
		await a.menuClick('Save as…');
		const asked = a.lastDialog();
		report.ok(!!asked && /changed since you last saw it/.test(asked.message || ''),
			'Save as onto a file that moved on ASKS, with the broker unreachable',
			asked ? (asked.message || '').slice(0, 90) : 'nothing was asked');
		await share.from(a);
		report.eq(share.files.get(FILE), await b.readFile(FILE),
			'and Cancel means cancel: B\'s work is untouched');
		await a.answerConfirmsWith(true);
		await a.unblockBroker();

		report.eq(a.errors.length, 0, 'no uncaught JavaScript in A');
		report.eq(b.errors.length, 0, 'no uncaught JavaScript in B');
		if (a.errors.length) { console.log(a.errors.join('\n')); }
		if (b.errors.length) { console.log(b.errors.join('\n')); }
	} finally {
		await a.close();
		await b.close();
	}
};
