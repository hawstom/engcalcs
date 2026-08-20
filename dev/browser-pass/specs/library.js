// §33 — the water-network toolbar group, and the Libraries box (ROADMAP Tasks 462 and 460).
//
// Tom, 2026-08-20: *"for Water Networks, I think we also need the following in a group: Libraries
// (Patterns, Curves, Controls, Pumps, Pipes, Custom), **Settings**, Simulate, Transport, Time
// selectors."* And, asked whether the gear should float on the map instead: *"Toggles on map
// doesn't sound right to me. What we have now plus the lpn group (Libraries, Settings, Transport,
// and Time selectors) seems like the right way to go."*
//
// **THE GROUP IS A DOM FACT AND THE ORDER IS A DOM FACT, so both are measured here rather than
// asserted in a comment.** A group on this strip is one `.lpn-toolbar-group`, and the whole point
// of it is that a narrow window wraps WHOLE groups: two adjacent groups look identical to one group
// until the window is narrowed, and then they come apart. Reading the parent element is the only
// way to tell those two arrangements apart, and it is exactly the difference Tom asked for.
//
// The Libraries box itself needs a real browser for the same reason the Settings box does: it is
// built entirely in JS out of the document, so there is nothing to read in the source.

const { Session } = require('../lib/session');

exports.title = '33. The water-network group and Libraries';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();

		// ---- THE GROUP ------------------------------------------------------------------------
		// Every control on the strip with the group it is in, in document order.
		const strip = await a.page.evaluate(() => {
			const groups = [...document.querySelectorAll('#lpn_toolbar .lpn-toolbar-group')];
			return groups.map((g, i) => ({
				i,
				end: g.classList.contains('lpn-toolbar-end'),
				items: [...g.querySelectorAll('button, select')].map((c) =>
					(c.getAttribute('aria-label') || c.textContent || '').trim())
			}));
		});
		const net = strip.find((g) => g.items.indexOf('Libraries') >= 0);
		report.ok(!!net, 'there is a group holding Libraries',
			JSON.stringify(strip.map((g) => g.items)));
		if (net) {
			// **TOM'S ORDER, EXACTLY.** Libraries, Settings, Simulate (the Run button), the three
			// transport buttons and the two time selectors. Written out rather than checked for
			// membership: the order IS the request, and a set comparison would pass on a group
			// holding the right controls in the wrong sequence.
			report.eq(net.items.join(' | '),
				'Libraries | Settings | Run | Step back | Play | Step forward | Time | Speed',
				'and it holds exactly Libraries, Settings, Simulate, Transport and the time selectors, in that order');
			report.ok(!net.end, 'it is not the right-aligned end group', String(net.end));
		}
		// **THE GEAR LEFT THE END GROUP, AND FIND AND THE PANE TOGGLE DID NOT.** Tom moved one
		// control, and a spec that only checked where Settings landed would not notice the other two
		// being dragged along with it.
		const end = strip.find((g) => g.end);
		report.ok(!!end && end.items.join(' | ') === 'Find | Bottom panel',
			'the right-hand end keeps Find and the bottom-panel toggle, and nothing else',
			end && end.items.join(' | '));
		report.ok(!!end && end.items.indexOf('Settings') < 0,
			'Settings is no longer at the right-hand end', end && end.items.join(' | '));
		// One Settings button on the whole strip. Moving a control is the classic way to end up with
		// two of it.
		const allNames = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_toolbar button')].map((b) => b.getAttribute('aria-label') || ''));
		report.eq(allNames.filter((n) => n === 'Settings').length, 1, 'exactly one Settings button');
		report.eq(allNames.filter((n) => n === 'Libraries').length, 1, 'exactly one Libraries button');

		// ---- THE BOX --------------------------------------------------------------------------
		await a.toolbarClick('Libraries');
		await a.settle(300);
		const open = () => a.page.evaluate(() => {
			const b = document.getElementById('lpn_library_box');
			return {
				shown: !!b && b.style.display === 'flex',
				title: (document.getElementById('lpn_libbox_title') || {}).textContent || '',
				index: [...document.querySelectorAll('#lpn_libbox_index button')].map((x) => x.textContent.trim()),
				current: (document.querySelector('#lpn_libbox_index [aria-current="true"]') || {}).textContent || '',
				heading: (document.querySelector('#lpn_libbox_content h3') || {}).textContent || '',
				// Everything a user could type into or press, so a section that built nothing is
				// visible as a section that built nothing.
				controls: [...document.querySelectorAll('#lpn_libbox_content input, #lpn_libbox_content select, #lpn_libbox_content button')]
					.map((c) => c.tagName.toLowerCase() + ':' + ((c.getAttribute('aria-label') || c.textContent || '').trim())),
				text: (document.getElementById('lpn_libbox_content') || {}).textContent || ''
			};
		});
		let st = await open();
		report.ok(st.shown, 'the Libraries button opens the box');
		report.eq(st.title, 'Libraries', 'the box is named the same as the button that opened it');
		report.eq(st.index.join(' | '), 'Patterns | Curves | Controls',
			'and its index is the three things the document already carries');
		report.eq(st.current, 'Patterns', 'it opens on Patterns');
		report.has(st.controls.join(' | '), 'Add a pattern', 'which offers a way to make one');
		// An empty project has no patterns, and an empty list must SAY it is empty rather than look
		// like a section that failed to build.
		report.has(st.text, 'none of these yet', 'and says so plainly when there are none');

		// Adding one is the whole feature: a pattern appears, with a field of multipliers, a chart
		// and the sentence that says what span it covers.
		await a.page.evaluate(() => {
			const b = [...document.querySelectorAll('#lpn_libbox_content button')]
				.find((x) => /Add a pattern/.test(x.textContent));
			if (b) { b.click(); }
		});
		await a.settle(300);
		st = await open();
		report.has(st.controls.join(' | '), 'input:Multipliers', 'adding one gives it a field of multipliers');
		const spark = await a.page.evaluate(() => document.querySelectorAll('#lpn_libbox_content svg.lpn-lib-spark').length);
		report.eq(spark, 1, 'and a sparkline beside the numbers — a pattern is a shape as much as a list');
		report.has(st.text, '24 multipliers', 'and the sentence that says how much time it covers');
		report.has(st.text, '24:00', '...which is read off the project’s own pattern time step');
		// **THE NEW PATTERN IS A FLAT DAY, NOT AN EMPTY LIST.** An empty one draws an empty chart and
		// silently switches off nothing; a flat one changes nothing, which is the only starting point
		// that cannot surprise somebody who assigns it before editing it.
		const seeded = await a.page.evaluate(() => {
			const i = [...document.querySelectorAll('#lpn_libbox_content input')]
				.find((x) => x.getAttribute('aria-label') === 'Multipliers');
			return i ? i.value : '';
		});
		report.eq(seeded.split(' ').length, 24, 'seeded with 24 multipliers', seeded);
		report.ok(seeded.split(' ').every((v) => v === '1'), 'every one of them a 1 — a pattern that changes nothing', seeded);

		// Typing a series redraws the chart and the span line LIVE, which is the feedback that says
		// whether the shape is the one that was meant. `input`, not blur.
		await a.page.evaluate(() => {
			const i = [...document.querySelectorAll('#lpn_libbox_content input')]
				.find((x) => x.getAttribute('aria-label') === 'Multipliers');
			i.value = '0.5 1 1.5';
			i.dispatchEvent(new Event('input', { bubbles: true }));
		});
		await a.settle(200);
		st = await open();
		report.has(st.text, '3 multipliers', 'the span line follows what is being typed, without waiting for blur');

		// ---- CONTROLS: the sentence, and the verdict under it ----------------------------------
		await a.page.evaluate(() => {
			const b = [...document.querySelectorAll('#lpn_libbox_index button')]
				.find((x) => x.textContent.trim() === 'Controls');
			b.click();
		});
		await a.settle(250);
		st = await open();
		report.eq(st.heading, 'Controls', 'the index switches the section');
		report.eq(st.current, 'Controls', 'and the index says which one is showing');
		report.has(st.controls.join(' | '), 'Add a control', 'Controls offers a way to make one');

		// A hand-drawn project has no links, so the starter sentence names nothing real — and the
		// verdict has to say WHICH id is missing rather than "not understood", because the two have
		// different cures. Draw a junction first so the network is not empty.
		await a.makeEdit();
		await a.settle(200);
		await a.page.evaluate(() => {
			const b = [...document.querySelectorAll('#lpn_libbox_content button')]
				.find((x) => /Add a control/.test(x.textContent));
			if (b) { b.click(); }
		});
		await a.settle(300);
		const verdictFor = (sentence) => a.page.evaluate((s) => {
			const i = document.querySelector('#lpn_libbox_content input.lpn-lib-wide');
			i.value = s;
			i.dispatchEvent(new Event('input', { bubbles: true }));
			return (document.querySelector('#lpn_libbox_content .lpn-lib-verdict') || {}).textContent || '';
		}, sentence);
		report.has(await verdictFor('WHAT IS THIS'), '⚠ Not understood',
			'a sentence the parser cannot read says so');
		report.has(await verdictFor('LINK NOPE OPEN AT TIME 1'), 'NOPE',
			'a well-formed sentence naming nothing here names the id it could not find');
		// The verdict is a whole tip target, not a one-character glyph — the suite's own rule, and
		// here the title carries the four sentence shapes that say how to fix it.
		const wired = await a.page.evaluate(() => {
			const v = document.querySelector('#lpn_libbox_content .lpn-lib-verdict');
			return {
				cls: v ? v.className : '',
				tip: v ? (v.getAttribute('title') || v.getAttribute('data-bs-original-title') || '') : ''
			};
		});
		report.ok(/ec-help/.test(wired.cls), 'the verdict is reachable on touch (.ec-help)', wired.cls);
		report.has(wired.tip, 'CLOCKTIME', 'and its tip states the sentence shapes', wired.tip.slice(0, 60));

		// ---- CLOSING ---------------------------------------------------------------------------
		// The same three ways every standing box on this page closes.
		await a.page.keyboard.press('Escape');
		await a.settle(200);
		report.ok(!(await open()).shown, 'Escape closes it');
		await a.toolbarClick('Libraries');
		await a.settle(200);
		await a.toolbarClick('Libraries');
		await a.settle(200);
		report.ok(!(await open()).shown, 'and the button that opened it toggles it shut');
		await a.toolbarClick('Libraries');
		await a.settle(200);
		await a.page.evaluate(() => document.getElementById('lpn_libbox_close').click());
		await a.settle(200);
		report.ok(!(await open()).shown, 'and so does its X');

		// The Edit menu is the second door, exactly as the Settings menu row is Settings' second.
		const rows = (await a.menuRows('edit')).map((r) => r.label);
		report.ok(rows.indexOf('Libraries') >= 0, 'Edit > Libraries is the second door', rows.join(' | '));

		report.ok(a.errors.length === 0, 'no uncaught JavaScript', a.errors.join(' | '));
	} finally {
		await a.close();
	}
};
