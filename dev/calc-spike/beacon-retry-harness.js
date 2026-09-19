// **A REFUSED BEACON IS NOT AN OFFLINE ONE** -- ROADMAP Task 626. Run with:
//
//   node dev/calc-spike/beacon-retry-harness.js
//
// The offline queue in js/Calculators.lib.js exists for the field worker who walks out of signal:
// a log beacon that could not be sent is kept on the device and sent when the network comes back.
// **IT QUEUED ON `!resp.ok` AS WELL AS ON A THROWN FETCH**, which put a REFUSAL in the same box as
// a lost connection -- and the two are not the same event at all. A 4xx means the server read the
// payload and judged it; the flush then re-sends `record.params` VERBATIM, so the retry is
// byte-identical and so is the refusal. One malformed beacon became 20 rejections, because
// `flushQueue()` runs on every `online` event and on every page load.
//
// Tom, 2026-09-18: *"This is all CC. Do something about it or remove it."*
//
// **THE SERVER HAD ALREADY MET THIS FROM THE OTHER SIDE**, and the workaround is still in
// log-calc-event.php: a visitor who opted out is answered 204 rather than a refusal, in that
// file's own words, "so the beacon is never queued for retry". A server answering success to hide
// a client's retry loop is the shape of the defect, stated by the person who worked around it.
//
// **NOTHING NEW IS STORED BY ANY OF THIS.** The queue is the same IndexedDB store, holding the
// same records; what changed is only which answers put a record in it and which take one out. See
// dev/cookie-storage-inventory.md.
//
// The real js/Calculators.lib.js runs here in the real load order of a real rendered page
// (dev/calc-spike/calc-page.js); the fetch answers and the queue's own IndexedDB are the only
// stubs, because they are the two things a node process does not have.

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('beacon retry policy (Task 626)');

// Any calculator page will do -- it is loaded for its js/Calculators.lib.js, not its math.
const page = loadCalculator('Manning-Pipe-Flow.php');
const EngCalcs = page.EngCalcs;

// The queue needs consent to be written at all, and the flush deletes everything without it.
EngCalcs.analyticsConsented = function () { return true; };

// ---- the two stubs -------------------------------------------------------------------------
// A fetch that answers whatever the case asks for, and records what was sent.
let sent = [];
function answering(answer) {
	page.sandbox.fetch = function (url, opts) {
		sent.push(url);
		if (answer === 'throw') { return Promise.reject(new Error('network')); }
		return Promise.resolve({ ok: answer >= 200 && answer < 300, status: answer });
	};
}
// The queue store, as a plain array. _openQueueDB/_readQueue/_delete/_update are the whole of the
// IndexedDB surface, so replacing those four leaves every line of the POLICY under test.
let store = [];
let queued = [];
EngCalcs._openQueueDB = function () { return Promise.resolve({}); };
EngCalcs._readQueue = function () { return Promise.resolve(store.slice()); };
EngCalcs._deleteQueueRecord = function (db, id) { store = store.filter((x) => x.id !== id); };
EngCalcs._updateQueueRecord = function (db, rec) {
	store = store.map((x) => (x.id === rec.id ? rec : x));
};
EngCalcs._queueBeacon = function (url, params) { queued.push(url); return Promise.resolve(); };

// Everything under test resolves through promises only -- no timers -- so a few turns of the
// microtask queue is the whole of "let it finish".
function settle() { return new Promise((res) => setImmediate(res)); }

(async function () {
	r.section('the rule itself: which answers are worth sending again');

	// **THE THREE THAT ARE NOT FINAL**, and each is a request that never got a hearing.
	r.eq(EngCalcs._retryWorthwhile(408), true, '408 Request Timeout is worth retrying');
	r.eq(EngCalcs._retryWorthwhile(429), true, '429 Too Many Requests asks for later in those words');
	r.eq(EngCalcs._retryWorthwhile(503), true, 'a 5xx says the server broke, not that the payload is bad');
	r.eq(EngCalcs._retryWorthwhile(500), true, '...500 too');

	// **EVERY OTHER REFUSAL IS A VERDICT ON WHAT WAS SENT**, and the bytes will not change.
	r.eq(EngCalcs._retryWorthwhile(400), false, 'a 400 is the server judging the payload -- final');
	r.eq(EngCalcs._retryWorthwhile(403), false, '403 is final');
	r.eq(EngCalcs._retryWorthwhile(404), false, '404 is final');
	r.eq(EngCalcs._retryWorthwhile(413), false, '413 is final, and no endpoint here answers it yet');
	r.eq(EngCalcs._retryWorthwhile(422), false, '422 is final');
	// A thrown fetch carries no status at all, and that shape must keep the queue it was built for.
	r.eq(EngCalcs._retryWorthwhile(undefined), true, 'no status at all is a thrown fetch, and is queued');
	r.eq(EngCalcs._retryWorthwhile(0), true, '...as is a status of 0');

	r.section('sending: a refusal does not enter the queue');

	queued = []; answering(400);
	EngCalcs._sendOrQueue('/engcalcs/log-calc-event.php', { page: '' });
	await settle();
	r.eq(queued.length, 0, '**a 400 is dropped rather than queued** -- the defect, stated');

	queued = []; answering(204);
	EngCalcs._sendOrQueue('/engcalcs/log-calc-event.php', { page: 'x' });
	await settle();
	r.eq(queued.length, 0, 'a success is not queued either, which never changed');

	queued = []; answering(503);
	EngCalcs._sendOrQueue('/engcalcs/log-calc-event.php', { page: 'x' });
	await settle();
	r.eq(queued.length, 1, 'a 503 IS queued -- the server broke, the beacon did nothing wrong');

	queued = []; answering('throw');
	EngCalcs._sendOrQueue('/engcalcs/log-calc-event.php', { page: 'x' });
	await settle();
	r.eq(queued.length, 1, '**and a thrown fetch still queues** -- the field worker keeps the feature');

	r.section('flushing: a refusal leaves the queue instead of spending 19 more attempts');

	store = [{ id: 1, url: '/engcalcs/log-calc-event.php', params: { page: '' }, offline_ts: 'T', attempts: 0 }];
	sent = []; answering(400);
	EngCalcs.flushQueue();
	await settle();
	r.eq(sent.length, 1, 'the record was sent once');
	r.eq(store.length, 0, '**and the refusal removed it** rather than counting an attempt');

	store = [{ id: 2, url: '/engcalcs/log-calc-event.php', params: { page: 'x' }, offline_ts: 'T', attempts: 0 }];
	sent = []; answering(503);
	EngCalcs.flushQueue();
	await settle();
	r.eq(store.length, 1, 'a 503 keeps the record for the next flush');
	r.eq(store[0].attempts, 1, '...and counts the attempt, so the bound still bounds it');

	store = [{ id: 3, url: '/engcalcs/log-calc-event.php', params: { page: 'x' }, offline_ts: 'T', attempts: 0 }];
	sent = []; answering(204);
	EngCalcs.flushQueue();
	await settle();
	r.eq(store.length, 0, 'a delivered record leaves, which never changed');

	store = [{ id: 4, url: '/engcalcs/log-calc-event.php', params: { page: 'x' }, offline_ts: 'T', attempts: 0 }];
	sent = []; answering('throw');
	EngCalcs.flushQueue();
	await settle();
	r.eq(store.length, 1, 'still offline: the record waits, as it always did');
	r.eq(store[0].attempts, 0, '...and a fetch that never answered costs no attempt');

	// **THE ORIGINAL SYMPTOM, COUNTED.** Twenty flushes of one malformed beacon used to be twenty
	// rejections; it is one now. The loop is what the `online` event and every page load do.
	store = [{ id: 5, url: '/engcalcs/log-calc-event.php', params: { page: '' }, offline_ts: 'T', attempts: 0 }];
	sent = []; answering(400);
	for (let i = 0; i < 20; i++) { EngCalcs.flushQueue(); await settle(); }
	r.eq(sent.length, 1, '**twenty flushes of one refused beacon send it once, not twenty times**');

	// And the bound that was there before is still there for the answers that keep a record: a
	// server that is down for a very long time must not grow the queue forever.
	store = [{ id: 6, url: '/engcalcs/log-calc-event.php', params: { page: 'x' }, offline_ts: 'T',
		attempts: EngCalcs._QUEUE_MAX_ATTEMPTS - 1 }];
	sent = []; answering(503);
	EngCalcs.flushQueue();
	await settle();
	r.eq(store.length, 0, 'a record at the attempt limit is dropped even on a retryable answer');

	r.section('consent is untouched by any of this');

	EngCalcs.analyticsConsented = function () { return false; };
	store = [{ id: 7, url: '/engcalcs/log-calc-event.php', params: { page: 'x' }, offline_ts: 'T', attempts: 0 }];
	sent = []; answering(204);
	EngCalcs.flushQueue();
	await settle();
	r.eq(store.length, 0, 'withdrawing consent still deletes what was queued under it');
	r.eq(sent.length, 0, '...and sends none of it');
	EngCalcs.analyticsConsented = function () { return true; };

	r.finish();
}());
