// §14 — colour by value, in one control (ROADMAP Task 327).
//
// The mode itself shipped with Task 384 and was reachable only as three rows inside
// Settings > Color by value. That is where a SETTING lives; this is a way of LOOKING at a big
// network, and on a big network it is the difference between reading the map and hunting for the
// number. Tom: "one control naming the field, reachable without opening a panel."
//
// A browser check because the point is reachability: the control is on the toolbar, it names the
// fields, and it and the Settings rows never disagree about the same two settings.

const { Session } = require('../lib/session');

exports.title = '14. Colour by value';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.makeEdit();

		const opts = await a.page.evaluate(() => {
			const s = document.getElementById('lpn_color_quick');
			return s ? [...s.options].map(o => ({ v: o.value, t: o.textContent })) : null;
		});
		report.ok(!!opts, 'the toolbar carries a colour control, with no panel to open');
		report.ok(opts && opts[0].v === '', '...offering no colour first, which is where it starts',
			opts && opts[0].t);
		// Pressure and velocity are the two a distribution network is actually asked about, so they
		// lead their halves of the list.
		const vals = opts.map(o => o.v);
		report.ok(vals.indexOf('node:pressure') === 1, 'pressure is the first field offered',
			vals.slice(0, 4).join(' | '));
		report.ok(vals.some(v => v === 'link:velocity'), 'velocity is offered too');
		report.ok(opts.every(o => o.t && o.t.trim()), 'every option is named, none blank');

		// Choosing one really colours by it, and the choice is stored on the project.
        await a.page.evaluate(() => {
			const s = document.getElementById('lpn_color_quick');
			s.value = 'node:pressure';
			s.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(400);
		const after = await a.page.evaluate(() => {
			let node = null, link = null;
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				if (!/^lpn_proj/.test(k)) { continue; }
				try {
					const d = JSON.parse(localStorage.getItem(k));
					if (d.settings) { node = d.settings.colorNodeField; link = d.settings.colorLinkField; }
				} catch (e) { /* not ours */ }
			}
			return { node: node, link: link };
		});
		report.eq(after.node, 'pressure', 'choosing a node field stores it on the project');

		// **ONE QUESTION, ONE ANSWER.** Choosing a LINK field clears the node one: two fields
		// coloured at once by different quantities is a map with two legends and no way to tell
		// which is which.
		await a.page.evaluate(() => {
			const s = document.getElementById('lpn_color_quick');
			s.value = 'link:velocity';
			s.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(400);
		const swapped = await a.page.evaluate(() => {
			let node = null, link = null;
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				if (!/^lpn_proj/.test(k)) { continue; }
				try {
					const d = JSON.parse(localStorage.getItem(k));
					if (d.settings) { node = d.settings.colorNodeField; link = d.settings.colorLinkField; }
				} catch (e) { /* not ours */ }
			}
			return { node: node, link: link };
		});
		report.eq(swapped.link, 'velocity', 'choosing a link field stores that');
		report.eq(swapped.node, '', '...and clears the node field, so there is one legend');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
