// §38 — the fire-flow box (ROADMAP Task 530, the interface half).
//
// WHAT IS HERE AND WHY IT IS NOT IN THE HARNESS. `dev/lpn-spike/fireflow-wizard-harness.js` owns
// everything with an exact answer against a stub: which boxes are asked, which are disclosed, what
// each failure code says, and that the document comes out byte-identical. Three things are left,
// and all three are facts about a REAL page rather than about the code:
//
//   1. **THE BOX FITS ON THE SCREEN.** It asks four things and discloses six more, which makes it
//      the tallest dialog on this page — and `#lpn_dialog` is pinned at 20% from the top, so a body
//      that does not scroll inside itself pushes its own buttons off the bottom of the window. A
//      user who cannot reach Calculate cannot use the feature at all, and no stub can see that.
//   2. **THE REAL ANSWER, ON A REAL NETWORK, THROUGH THE REAL ENGINE.** Elm Street Center, solved
//      about sixteen times over by the built-in solver in a real browser.
//   3. **THE PROMISE THE TASK EXISTS FOR IS ON THE SCREEN**, in the rendered text: the lateral
//      length asked and empty, the k with the velocity it is referenced to, and the ISO credit
//      limit beside a number that has NOT been cut down to it.

const { Session } = require('../lib/session');

exports.title = '38. Fire flow at a hydrant';

// The rows of the box, as a reader meets them: the words beside each control, and what is in it.
async function boxRows(page) {
	return page.evaluate(() => [...document.querySelectorAll('#lpn_dialog_body .lpn-ff-row')]
		.map(r => ({
			name: (r.children[0].textContent || '').trim(),
			value: r.children[1].value,
			tag: r.children[1].tagName.toLowerCase(),
			unit: (r.children[2].textContent || '').trim(),
			tip: r.children[0].title || r.children[0].getAttribute('data-bs-original-title') || ''
		})));
}
async function setRow(page, name, value) {
	await page.evaluate(([n, v]) => {
		const r = [...document.querySelectorAll('#lpn_dialog_body .lpn-ff-row')]
			.find(x => (x.children[0].textContent || '').indexOf(n) === 0);
		r.children[1].value = v;
	}, [name, value]);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		const opened = await a.page.evaluate(() => {
			const cards = [...document.querySelectorAll('#lpn_examples_pane .lpn-example-card')];
			const card = cards.find(c => /Elm Street/i.test(c.textContent));
			if (!card) { return false; }
			card.click();
			return true;
		});
		report.ok(opened, 'the examples gallery offers Elm Street Center');
		await a.settle(900);

		await a.menuClick('Fire flow at a hydrant…', 'project');
		await a.settle(400);
		const d = await a.dialog();
		report.ok(!!d, 'the Project menu row opens the box');
		report.eq(JSON.stringify(d.buttons), JSON.stringify(['Work out the fire flow', 'Cancel']),
			'it offers a question and a way out');

		// ---- 1. it fits, and everything in it can be reached --------------------------------------
		const fit = await a.page.evaluate(() => {
			const dlg = document.getElementById('lpn_dialog');
			const bar = document.getElementById('lpn_dialog_buttons');
			const wrap = document.querySelector('#lpn_dialog_body .lpn-ff');
			return {
				buttonsBottom: bar.getBoundingClientRect().bottom,
				dialogBottom: dlg.getBoundingClientRect().bottom,
				windowHeight: window.innerHeight,
				scrolls: wrap.scrollHeight > wrap.clientHeight + 1,
				overflowY: getComputedStyle(wrap).overflowY,
				pageScrollX: document.documentElement.scrollWidth - document.documentElement.clientWidth
			};
		});
		report.ok(fit.buttonsBottom <= fit.windowHeight,
			'the buttons are on the screen, not below the fold',
			Math.round(fit.buttonsBottom) + 'px of a ' + fit.windowHeight + 'px window');
		report.ok(fit.overflowY === 'auto' || fit.overflowY === 'scroll',
			'the long body scrolls inside itself rather than pushing them off', fit.overflowY);
		report.ok(fit.pageScrollX <= 0, 'and the page gains no sideways scrollbar',
			fit.pageScrollX + 'px');

		// ---- 2. asked, and disclosed --------------------------------------------------------------
		const rows = await boxRows(a.page);
		const by = (n) => rows.find(r => r.name.indexOf(n) === 0) || {};
		report.ok(rows.length >= 10, 'it asks four things and discloses six more',
			rows.length + ' rows: ' + rows.map(r => r.name).join(' | '));
		report.eq(by('Length of the hydrant lateral').value, '',
			'**THE LATERAL LENGTH IS ASKED AND OPENS EMPTY** — five agency standards span 25–100 ft');
		report.eq(by('Lateral diameter').value, '6', 'the lateral diameter is disclosed');
		report.eq(by('Hydrant waterway diameter').value, '4.5',
			'the hydrant WATERWAY is disclosed, and it is the main valve, not the 6 in shoe');
		report.eq(by('Residual pressure to hold').value, '20', 'the residual opens on the convention');
		report.ok(rows.filter(r => r.tag === 'input').length >= 7,
			'every disclosed number is an editable box, not a readout',
			rows.map(r => r.tag).join(' '));
		report.has(by('Point that must hold the residual').tip, 'cannot change the pressure there',
			'the critical point explains why the hydrant’s own junction is not offered');

		// ---- 3. refused without a length, then answered ------------------------------------------
		await a.dialogClick('Work out the fire flow');
		await a.settle(600);
		let ans = await a.dialog();
		report.has(ans.text, 'How long is the hydrant lateral',
			'pressing Calculate with no length is refused by name, not defaulted');
		report.ok(ans.text.indexOf('Available fire flow:') < 0,
			'…and the refusal is not a flow of any kind');

		await a.dialogClick('Change something');
		await a.settle(300);
		await setRow(a.page, 'Length of the hydrant lateral', '50');
		await a.dialogClick('Work out the fire flow');
		await a.settle(2500);
		ans = await a.dialog();
		const m = /Available fire flow: ([\d.]+) gpm/.exec(ans.text);
		report.ok(!!m, 'a real network, solved for real, reports a flow in the project’s own unit',
			m ? m[0] : ans.text.slice(0, 140));
		const flow = m ? +m[1] : 0;
		report.ok(flow > 100 && flow < 10000, 'and it is a hydrant-sized number', String(flow));
		// **THE REFERENCE MOVED FROM A SENTENCE INTO THE NAME** (Tom, 2026-08-25). He put the k
		// immediately after Lateral roughness and renamed it, so the word "Lateral" carries the
		// reference where a reader cannot skip it — the same move the engine made when `K_BARREL`
		// became `K_BARREL_AT_LATERAL_V`. The prose sentence it replaced survives for one case only:
		// a coefficient the user PASTED, which a name cannot cover because only they know what
		// velocity theirs meant. So this asserts the name, in the report where the number travels.
		report.has(ans.text, 'Lateral minor (local) loss coefficient',
			'**the k is named for the velocity it is referenced to** (Tom: “critical in the hydrant model”)');
		report.has(ans.text, 'ISO credits a single hydrant with at most 1500 gpm',
			'the ISO credit limit is stated beside the number');
		report.has(ans.text, 'has not been applied to the number above',
			'**and it is a note, never a clamp**');
		report.has(ans.text, 'What was used',
			'the answer restates what it assumed, so the number does not travel alone');
		report.has(ans.text, '(assumed)', '…marked as ours where we assumed it');
		report.has(ans.text, 'Length of the hydrant lateral: 50 ft (you gave this)',
			'…and as theirs where they gave it');
		await a.dialogClick('OK');
		await a.settle(300);

		// ---- 4. and the project is untouched ------------------------------------------------------
		const doc = await a.page.evaluate(() => ({
			nodes: document.querySelectorAll('#lpn_canvas .lpn-symbols > *').length,
			ids: [...document.querySelectorAll('#lpn_canvas .lpn-symbols > *')]
				.map(e => e.dataset.id || '').filter(Boolean)
		}));
		report.ok(doc.ids.every(id => id.indexOf('~outlet') < 0 && id.indexOf('~base') < 0 &&
			id.indexOf('~lateral') < 0 && id.indexOf('~barrel') < 0),
			'**nothing the box built is on the map** — the assembly is ad-hoc and stays that way',
			doc.nodes + ' symbols drawn');
		report.ok(!(await a.currentTabDirty()),
			'…and the project is not even marked as changed');

		report.ok(a.errors.length === 0, 'no uncaught JavaScript', a.errors.join(' | '));
	} finally {
		await a.close();
	}
};
