// Calculators.lib.js
// Loaded by the echoHTMLHead php function.
// Master namespace object if not already exists.
var EngCalcs = EngCalcs || {};

// Touch-friendly tooltips: activate Bootstrap tooltips on all cursor:help elements
// so they respond to tap (click trigger) in addition to hover on desktop.
// Call again with the new subtree's root after building any UI at runtime (a dynamically
// constructed property popup, for instance) — tooltips built after this ran once are otherwise
// dead on touch, since a bare <a title> only navigates on first tap with no hover to fall back on.
// getOrCreateInstance (not `new Tooltip`) makes this safe to call repeatedly on overlapping roots,
// including document itself, without creating duplicate tooltip instances on the same element.
// THE RULE: A TIP MUST NEVER CARRY BOTH A HOVER TRIGGER AND A CLICK TRIGGER, whatever the element
// is. Bootstrap tracks each trigger separately and will not hide while ANY of them is still
// active: hovering sets the hover trigger, a click then sets the click trigger too, and moving the
// mouse away only clears hover -- so the tip stays pinned open until a second click toggles it back
// off, and it visibly cycles. 'focus' sticks the same way, since a clicked button keeps focus.
//
// So pick ONE opening gesture per DEVICE:
//   - pointer can hover (mouse/trackpad): 'hover focus'. A <span> is not focusable without
//     tabindex, so for a plain label this is effectively hover-only -- nothing to get stuck on.
//   - pointer cannot hover (touch): 'click' for a plain label, which is the only way to reach its
//     tip at all; controls stay 'hover focus' so a tap still just performs the button's action.
// Known and accepted gap: on a HYBRID device (touch screen plus mouse) '(hover: hover)' reports
// true, so a plain label's tip is hover-only and a finger tap will not open it. That is a rare
// device and a much smaller harm than a tooltip stuck over the page for every mouse user.
function ecTipIsControl(el) {
	return !!el.closest('button, a, input, select, textarea, [role="button"]');
}
// Evaluated per call, not cached at load: a tip built into a runtime popup should be wired for the
// device as it is now, and matchMedia is cheap.
function ecCanHover() {
	return !window.matchMedia || window.matchMedia('(hover: hover)').matches;
}
EngCalcs.initTips = function (root) {
	var canHover = ecCanHover();
	(root || document).querySelectorAll('[title][style*="cursor:help"], .ec-help[title]').forEach(function (el) {
		var control = ecTipIsControl(el);
		// **A CONTROL ON A HOVER-LESS DEVICE GETS PRESS-AND-HOLD, and nothing else can work.**
		// 'hover focus' on a touch screen means a tap focuses the button (showing the tip) and the
		// same tap's click hides it again, so the tip is unreadable -- invisible while a word was on
		// the button, fatal once the toolbar is icons only. 'click' is not the fix either: the tap
		// must still press the button. So the tip opens on a LONG PRESS, which is the gesture every
		// touch platform already uses for "what is this", and the tap keeps doing the button's job.
		var longPress = control && !canHover;
		var tip = bootstrap.Tooltip.getOrCreateInstance(el, {
			trigger: longPress ? 'manual' : ((control || canHover) ? 'hover focus' : 'click')
		});
		// A control also hides its tip on click: hide() clears every active trigger at once, so
		// the tip cannot hang over the panel the button just opened. Kept for the long-press case
		// too -- the point of the hold is to READ the tip, and the tap that follows is the user
		// saying they are done with it.
		if (control && !el.dataset.ecTipClickWired) {
			el.dataset.ecTipClickWired = '1';
			el.addEventListener('click', function () { tip.hide(); });
		}
		if (longPress && !el.dataset.ecTipHoldWired) {
			el.dataset.ecTipHoldWired = '1';
			var timer = null;
			function cancel() { if (timer) { clearTimeout(timer); timer = null; } }
			el.addEventListener('touchstart', function () {
				cancel();
				// 500 ms is the platform long-press, and it must be longer than a tap or the tip
				// would open on every press of the button.
				timer = setTimeout(function () { timer = null; tip.show(); }, 500);
			}, { passive: true });
			['touchend', 'touchcancel', 'touchmove'].forEach(function (ev) {
				el.addEventListener(ev, cancel, { passive: true });
			});
			// A tip opened by a hold has no pointer to leave, so it needs its own way out: the next
			// touch anywhere else takes it down.
			document.addEventListener('touchstart', function (e) {
				if (e.target !== el && !el.contains(e.target)) { tip.hide(); }
			}, { passive: true });
		}
	});
};
document.addEventListener('DOMContentLoaded', function () { EngCalcs.initTips(document); });

// PWA install prompt
EngCalcs._deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', function (e) {
	e.preventDefault();
	EngCalcs._deferredInstallPrompt = e;
	var btn = document.getElementById('ec-install-btn');
	if (btn) btn.style.display = '';
});
window.addEventListener('appinstalled', function () {
	EngCalcs._deferredInstallPrompt = null;
	var btn = document.getElementById('ec-install-btn');
	if (btn) btn.style.display = 'none';
});
EngCalcs.installPWA = function () {
	'use strict';
	if (!EngCalcs._deferredInstallPrompt) return;
	EngCalcs._deferredInstallPrompt.prompt();
	EngCalcs._deferredInstallPrompt.userChoice.then(function () {
		EngCalcs._deferredInstallPrompt = null;
		var btn = document.getElementById('ec-install-btn');
		if (btn) btn.style.display = 'none';
	});
};
EngCalcs.numCalcRows = 0;
EngCalcs.cookieSlotsLength = 0;
EngCalcs.pageTitle = '';
EngCalcs.namePattern = /^[A-Za-z0-9 _.-]*$/;
EngCalcs._loadTime = Date.now();
EngCalcs._calcUsageLogged = false;
EngCalcs.sessionAgeMs = EngCalcs.sessionAgeMs || 0;

// Queue-and-flush for offline usage logging. The PWA's network-first
// service worker (sw.js) still serves calculators fully from cache when offline,
// but a plain sendBeacon to a log-*.php endpoint fails silently with no trace and
// no way to retry -- "no one used it" and "someone used it offline" looked
// identical. sendBeacon's return value only means "the browser accepted this for
// delivery," not "it reached the server," so it can't drive retry logic; fetch
// with keepalive (survives page unload like sendBeacon does) gives us a real
// success/failure signal to decide whether to queue.
//
// Queued records carry the *original* attempt's client timestamp (offline_ts), sent
// on retry so the server can log when the usage actually happened rather than when
// connectivity happened to return -- the gap between those two can be hours for a
// field worker. log-calc-event.php/log-human-view.php sanity-check and use it when
// present.
EngCalcs._QUEUE_DB = 'engcalcs-offline-queue';
EngCalcs._QUEUE_STORE = 'queue';
EngCalcs._QUEUE_MAX_ATTEMPTS = 20;

EngCalcs._openQueueDB = function () {
	'use strict';
	return new Promise(function (resolve, reject) {
		if (!window.indexedDB) { reject(new Error('no indexedDB')); return; }
		var req = indexedDB.open(EngCalcs._QUEUE_DB, 1);
		req.onupgradeneeded = function () {
			req.result.createObjectStore(EngCalcs._QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
		};
		req.onsuccess = function () { resolve(req.result); };
		req.onerror = function () { reject(req.error); };
	});
};

// The queue is analytics storage on the visitor's device, so it is written only
// for a visitor who agreed to it. Refusing costs the offline retry, not the count -- a live beacon
// still reaches the server, where it lands undeduplicated in the 'visit' bucket.
EngCalcs._queueBeacon = function (url, params) {
	'use strict';
	if (typeof this.analyticsConsented === 'function' && !this.analyticsConsented()) {
		return Promise.resolve();
	}
	return this._openQueueDB().then(function (db) {
		return new Promise(function (resolve, reject) {
			var tx = db.transaction(EngCalcs._QUEUE_STORE, 'readwrite');
			tx.objectStore(EngCalcs._QUEUE_STORE).add({
				url: url,
				params: params,
				offline_ts: new Date().toISOString(),
				attempts: 0
			});
			tx.oncomplete = resolve;
			tx.onerror = function () { reject(tx.error); };
		});
	}).then(function () {
		if (navigator.serviceWorker && navigator.serviceWorker.ready) {
			navigator.serviceWorker.ready.then(function (reg) {
				if (reg.sync) reg.sync.register('engcalcs-flush-queue').catch(function () {});
			}).catch(function () {});
		}
	}).catch(function () {
		// No IndexedDB (very old browser, private-mode restriction, etc.) -- nothing
		// more we can do; the event is lost.
	});
};

// Sends one beacon-style log POST, queueing it for later retry if the network
// request itself fails (offline). Used by both maybeLogCalcUsage and
// maybeLogHumanView so the retry/queue behavior lives in one place.
EngCalcs._sendOrQueue = function (url, params) {
	'use strict';
	var body = new URLSearchParams(params);
	if (!window.fetch) {
		if (navigator.sendBeacon) navigator.sendBeacon(url, body);
		return;
	}
	fetch(url, { method: 'POST', body: body, keepalive: true, credentials: 'same-origin' })
		.then(function (resp) {
			if (!resp.ok) EngCalcs._queueBeacon(url, params);
		})
		.catch(function () {
			EngCalcs._queueBeacon(url, params);
		});
};

// Reads every queued record into a plain array. Kept as its own short-lived
// transaction (no awaits inside it) because IndexedDB transactions auto-commit
// once there's no pending request in the microtask queue -- interleaving an
// awaited fetch() inside a cursor loop would let the transaction die underneath
// later cursor.update()/delete() calls and throw TransactionInactiveError.
EngCalcs._readQueue = function (db) {
	'use strict';
	return new Promise(function (resolve, reject) {
		var tx = db.transaction(EngCalcs._QUEUE_STORE, 'readonly');
		var records = [];
		tx.objectStore(EngCalcs._QUEUE_STORE).openCursor().onsuccess = function (event) {
			var cursor = event.target.result;
			if (!cursor) { resolve(records); return; }
			records.push(cursor.value);
			cursor.continue();
		};
		tx.onerror = function () { reject(tx.error); };
	});
};

EngCalcs._deleteQueueRecord = function (db, id) {
	'use strict';
	var tx = db.transaction(EngCalcs._QUEUE_STORE, 'readwrite');
	tx.objectStore(EngCalcs._QUEUE_STORE).delete(id);
};

EngCalcs._updateQueueRecord = function (db, record) {
	'use strict';
	var tx = db.transaction(EngCalcs._QUEUE_STORE, 'readwrite');
	tx.objectStore(EngCalcs._QUEUE_STORE).put(record);
};

// Retries every queued record. Records that fail are left in place for the next
// flush (triggered again on 'online' or next page load); records that have failed
// EngCalcs._QUEUE_MAX_ATTEMPTS times are dropped so a permanently-unreachable
// endpoint can't grow the queue forever.
EngCalcs.flushQueue = function () {
	'use strict';
	if (!window.fetch) return;
	var self = this;
	// Withdrawing consent has to actually remove what consent was covering, or "you can
	// withdraw at any time" is a sentence rather than a mechanism. Anything queued while the
	// visitor was consenting is deleted here rather than delivered.
	if (typeof this.analyticsConsented === 'function' && !this.analyticsConsented()) {
		this._openQueueDB().then(function (db) {
			return self._readQueue(db).then(function (records) {
				records.forEach(function (record) { self._deleteQueueRecord(db, record.id); });
			});
		}).catch(function () {});
		return;
	}
	this._openQueueDB().then(function (db) {
		return self._readQueue(db).then(function (records) {
			return Promise.all(records.map(function (record) {
				var params = Object.assign({}, record.params, { offline_ts: record.offline_ts });
				return fetch(record.url, {
					method: 'POST',
					body: new URLSearchParams(params),
					credentials: 'same-origin'
				}).then(function (resp) {
					if (resp.ok || record.attempts + 1 >= EngCalcs._QUEUE_MAX_ATTEMPTS) {
						self._deleteQueueRecord(db, record.id);
					} else {
						self._updateQueueRecord(db, Object.assign({}, record, { attempts: record.attempts + 1 }));
					}
				}).catch(function () {
					// Still offline; leave the record queued for the next flush trigger.
				});
			}));
		});
	}).catch(function () {});
};
window.addEventListener('online', function () { EngCalcs.flushQueue(); });
document.addEventListener('DOMContentLoaded', function () { EngCalcs.flushQueue(); });

// Logs one confirmed-human calculator-usage event (see log-calc-event.php),
// gated to real user-triggered recalculation at least 10s after page load so
// the automatic initial calc-on-load and fast/scripted interaction don't count.
// Deduped in-memory per page load; server-side dedup covers repeat page loads.
EngCalcs.maybeLogCalcUsage = function () {
	'use strict';
	if (this._calcUsageLogged) return;
	if (Date.now() - this._loadTime < 10000) return;
	this._calcUsageLogged = true;
	this._sendOrQueue('/engcalcs/log-calc-event.php', {
		page: this.cookieName || '',
		lang: document.documentElement.lang || ''
	});
};

// Logs one confirmed-human page-view event (see log-human-view.php) -- the "window
// shopping" tier between raw reach (LANG_LOG) and confirmed calculator use
// (CALC_USAGE_LOG). No calculation required, just dwelling until the SESSION (not
// this page) is 10s old: EngCalcs.sessionAgeMs was already that old when this page
// was served, so a session that proved itself human earlier doesn't make later pages
// wait out their own 10s -- only a brand-new session waits the full 10s here.
// If the visitor navigates away before the timer fires, nothing is logged, which is
// correct: they didn't dwell long enough to count as a confirmed view.
EngCalcs.maybeLogHumanView = function () {
	'use strict';
	var delay = Math.max(0, 10000 - this.sessionAgeMs);
	var self = this;
	setTimeout(function () {
		self._sendOrQueue('/engcalcs/log-human-view.php', {
			page: self.cookieName || '',
			lang: document.documentElement.lang || ''
		});
	}, delay);
};
document.addEventListener('DOMContentLoaded', function () {
	EngCalcs.maybeLogHumanView();
});

// Logs one "somebody named this calculation" event (see log-title-event.php).
// The strongest signal the suite can collect: a page view says they looked, a calc event says they
// got an answer, and a typed title says they mean to put it in front of another person.
//
// Only ever the FACT that a field was filled, never its text. What the calculation is called is
// the user's business.
//
// No 10s dwell gate, unlike the other two beacons: those gate on time because a bot can trip a
// page load or a calculation, whereas typing into a text field is already the human proof the
// timer is a proxy for. Deduped per page load here, and per (session, page, field) server-side.
EngCalcs._titleLogged = {};
EngCalcs.maybeLogTitleEvent = function (field) {
	'use strict';
	if (this._titleLogged[field]) return;
	this._titleLogged[field] = true;
	this._sendOrQueue('/engcalcs/log-title-event.php', {
		page: this.cookieName || '',
		lang: document.documentElement.lang || '',
		field: field
	});
};
// Bound here rather than in the inputs' onchange attributes (lib/Calculators.lib.php) so this
// works on any page carrying those ids, including the JS-built ones, and so the markup keeps one
// job. 'change' rather than 'input': it fires on blur once the value actually differs, so a
// half-typed word is not an event -- and, importantly, a value restored programmatically from the
// cookie or a shared URL fires nothing at all, which is correct. Restoring a saved title is not a
// person deciding to name something.
document.addEventListener('DOMContentLoaded', function () {
	['title', 'subtitle'].forEach(function (field) {
		var el = document.getElementById(field === 'title' ? 'printable_title' : 'printable_subtitle');
		if (!el) return;
		el.addEventListener('change', function () {
			// Clearing a title is not naming one.
			if (el.value.trim() === '') return;
			EngCalcs.maybeLogTitleEvent(field);
		});
	});
});

// ---- Behaviour signals ----
//
// The four beacons above count PEOPLE. These count what those people then did: which reference
// they went looking for, whether they touched the form at all, which units they landed on, whether
// they had been here before, and where the map interface loses them. See lib/config.inc.php for
// the six events and what each one decides.
//
// DEDUPED IN THIS PAGE'S MEMORY AND NOWHERE ELSE. The other beacons dedupe per (visit, page)
// against the ec_seen cookie, whose five bits are full: a sixth would make it two base-32 digits
// and make the consent banner's "a single digit per page" a false sentence. So a reload starts
// these counters over, which is a small and honest cost. Nothing new is stored on the device by
// any of this except the repeat-visit list below, which is gated on consent because it must be.
EngCalcs._signalSent = {};
EngCalcs.logSignal = function (event, detail) {
	'use strict';
	detail = detail || '';
	var key = event + '|' + detail;
	if (this._signalSent[key]) return;
	this._signalSent[key] = true;
	this._sendOrQueue('/engcalcs/log-signal-event.php', {
		page: this.cookieName || '',
		lang: document.documentElement.lang || '',
		event: event,
		detail: detail
	});
};

// A reference link out of the calculator. Delegated at the document rather than tagged
// onto each <a> in PHP, because the links worth measuring live in five different pages AND in 27
// language files (mpf_friction_slope carries its own <a> in every one of them) -- a per-link
// attribute would have to be added in all of those and would be silently absent from the next one
// somebody writes. "Out of the calculator" is the whole test: a different origin, or this origin
// outside /engcalcs/ (which is how ../frictionslope.php, our own English-only explainer, counts).
// Internal navigation between calculators is not a reference lookup and is already in the view log.
document.addEventListener('click', function (e) {
	'use strict';
	var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
	if (!a) return;
	var url;
	try { url = new URL(a.href, window.location.href); } catch (err) { return; }
	// mailto:, tel: and javascript: are not reference lookups.
	if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
	var away = (url.origin !== window.location.origin) || (url.pathname.indexOf('/engcalcs/') !== 0);
	if (!away) return;
	// Host and path only. A query string on one of these is a session-shaped thing (the EPA's
	// nepis.epa.gov link is 600 characters of it) and tells us nothing the path does not.
	EngCalcs.logSignal('outbound', (url.host + url.pathname).replace(/\/$/, '').slice(0, 80));
}, true);

// Did they touch anything before leaving? One bit, and it is the cheapest diagnostic on
// the list -- a human view with no calculation and no touch is "could not understand it", one with
// a touch is "tried it and did not want it", and those are opposite development responses.
// 'change' rather than 'input' so a half-typed number is not an event, and so a value restored
// from the cookie or a shared URL fires nothing at all.
document.addEventListener('change', function (e) {
	'use strict';
	var el = e.target;
	if (!el || !el.tagName) return;
	var tag = el.tagName.toLowerCase();
	if (tag !== 'input' && tag !== 'select' && tag !== 'textarea') return;
	EngCalcs.logSignal('touch', 'input');
	// The units question, the per-select half: which unit did each family actually land on?
	// Only a select the presets can see (data-family) is asked -- one with no family is
	// invisible to the preset buttons and would be a bug to report a statistic about.
	if (tag === 'select' && el.dataset && el.dataset.family) {
		if (el.value) EngCalcs.logSignal('units', el.dataset.family + ':' + el.value);
	}
}, true);

// Has this browser used this calculator before? The strongest value signal the suite
// does not otherwise collect -- a calculator a working engineer returns to is worth more than a
// hundred one-off visits, and nothing else here can tell those two apart.
//
// AND IT STORES NOTHING NEW, which is the whole design of it. The obvious build was a list of
// visited pages in localStorage; that is durable analytics storage, so it would have needed
// consent -- and the consent already granted is for "a single digit per page ... to prevent us
// from logging its visits repeatedly" (consent_body). A page-name list is not a digit and its
// purpose is the opposite one, so shipping it would have meant rewriting the banner, retranslating
// it into 26 languages, and bumping EC_CONSENT_VERSION to re-ask everybody. For a diagnostic.
//
// The page's own input cookie answers the same question for free. It is EXEMPT storage -- the
// numbers the visitor typed, written only after they typed them -- and its presence at load means
// this browser calculated here before, within the last year. That is a better signal than a page
// list anyway: it says they USED the calculator, not that they glanced at it. Reading it for an
// analytics purpose is still an analytics access, so the LOG is gated on consent even though the
// storage needs none.
//
// Only a 'return' is ever logged. A first visit already wrote a human-view row, and logging both
// would double every page's count for consenters only -- exactly the mixture the two-bucket rule
// exists to prevent.
//
// Looped-Network keeps its work in localStorage rather than an input cookie, so it needs its own
// probe -- the map page is where the shopper/user split matters most.
// Same principle, better evidence: a SAVED PROJECT DOCUMENT proves this browser drew a network here.
//
// The document, NOT `lpn_index`. A brand-new visitor gets an index entry the moment init() runs --
// the blank project it opens on is registered immediately -- but "a brand-new project has no
// document until its first edit" (js/looped-network.js), and adoptOrphans() drops an index entry
// whose document is missing. So `lpn_index` would have marked every second page load a return and
// counted reopening the page as using it, which is the very distinction this is being built to
// draw. A `lpn_project_<id>` key exists only if somebody edited something.
//
// `lpn_document` is the pre-library single-document key, checked too: a long-standing user whose
// storage has not been migrated yet still drew that network.
EngCalcs._priorWorkKeyPrefixes = { 'Looped-Network': ['lpn_project_', 'lpn_document'] };
EngCalcs._hasPriorLocalWork = function (page) {
	'use strict';
	var prefixes = this._priorWorkKeyPrefixes[page];
	if (!prefixes) return false;
	try {
		for (var i = 0; i < window.localStorage.length; i++) {
			var key = window.localStorage.key(i);
			for (var j = 0; j < prefixes.length; j++) {
				if (key && key.indexOf(prefixes[j]) === 0) return true;
			}
		}
	} catch (err) {
		// Private mode or storage disabled. Nobody is counted as returning, which understates the
		// number rather than inventing one.
	}
	return false;
};
EngCalcs.maybeLogRepeatVisit = function () {
	'use strict';
	var page = this.cookieName || '';
	if (!page) return;
	if (typeof this.analyticsConsented === 'function' && !this.analyticsConsented()) return;
	// Read at DOMContentLoaded, which is before any page's own restore-and-recalculate runs (this
	// file is loaded from echoHTMLHead, so its handler is registered first) and well before
	// createCookie() -- or looped-network.js's own init(), which registers on DOMContentLoaded too
	// -- could write this load's own state and make every visit look like a return.
	var returning = new RegExp('(?:^|;\\s*)' + page.replace(/[^A-Za-z0-9_-]/g, '') + '=').test(document.cookie)
		|| this._hasPriorLocalWork(page);
	if (returning) {
		this.logSignal('repeat', 'return');
	}
};
document.addEventListener('DOMContentLoaded', function () {
	EngCalcs.maybeLogRepeatVisit();
});

EngCalcs.updateUrl = function () {
	'use strict';
	var params = new URLSearchParams();
	var nameEl = document.getElementById('ec_calc_name');
	var nameVal = nameEl ? nameEl.value.trim() : '';
	if (nameVal) params.set('name', nameVal);
	var form = document.forms['formInput'];
	var calcsBody = document.getElementById('CalcsBody');
	if (form) {
		Array.prototype.forEach.call(form.elements, function (el) {
			// Dynamic row-table inputs (reach/point tables) share the same name across every
			// row, so they can't round-trip as flat key=value pairs -- leave them out of the
			// shareable URL. They're restored from the cookie instead.
			if (el.name && !(calcsBody && calcsBody.contains(el))) params.set(el.name, el.value);
		});
	}
	history.replaceState(null, '', '?' + params.toString());
	document.title = (nameVal ? nameVal + ' — ' : '') + EngCalcs.pageTitle;
};

EngCalcs.loadFromUrl = function (objForm) {
	'use strict';
	if (!window.location.search) return false;
	var params = new URLSearchParams(window.location.search);
	var nameVal = params.get('name');
	if (nameVal !== null) {
		var nameEl = document.getElementById('ec_calc_name');
		if (nameEl) nameEl.value = nameVal;
		document.title = (nameVal ? nameVal + ' — ' : '') + EngCalcs.pageTitle;
	}
	var formLoaded = false;
	if (objForm) {
		params.forEach(function (value, key) {
			if (key === 'name') return;
			var el = objForm.elements[key];
			// objForm.elements[key] can resolve to a plain number (e.g. the collection's own
			// .length) instead of a form control when key collides with a reserved property
			// name like "length" or "item" -- guard against assigning .value to that.
			if (el !== undefined && el !== null && (el instanceof RadioNodeList || el.tagName)) {
				// A <select> goes through applySelectValue() so a link shared before Task 390 --
				// which spells a unit as its conversion factor -- still opens on the unit its
				// author chose rather than on the page default.
				if (el.tagName === 'SELECT') { EngCalcs.applySelectValue(el, value); }
				else { el.value = value; }
				formLoaded = true;
			}
		});
	}
	return formLoaded;
};

document.addEventListener('DOMContentLoaded', function () {
	var nameEl = document.getElementById('ec_calc_name');
	if (!nameEl) return;
	nameEl.addEventListener('input', function () {
		var valid = EngCalcs.namePattern.test(this.value);
		this.classList.toggle('is-invalid', !valid);
	});
	nameEl.addEventListener('change', function () {
		this.value = this.value.replace(/[^A-Za-z0-9 _.-]/g, '').trim();
		this.classList.remove('is-invalid');
		EngCalcs.updateUrl();
	});
});

// ---- Share this calculation (ROADMAP Task 228) ----
//
// The control sits under the Printable Title (lib/Calculators.lib.php) because naming a
// calculation is the moment somebody means to show it to another person. The link itself is
// whatever updateUrl() has already put in the address bar: the whole form, plus the name.
//
// NEVER A SILENT FAILURE. navigator.clipboard is absent over plain http, in older browsers, and
// inside some embedded views, and writeText() can reject even where it exists (permission, or a
// call the browser does not consider user-initiated). Every one of those falls back to showing
// the link, selected, so the visitor copies it themselves -- a control that looks like it worked
// and did not is worse than one that says "copy this".
//
// Returns a promise so the harness can wait for the clipboard's own answer rather than for a
// stub's; nothing in the page uses the return value.

EngCalcs.calcAndSave = function (objForm) {
	'use strict';
	this.formToCookie(objForm);
	this.pageCalculator(objForm);
	this.adjustInputWidth();
	this.maybeLogCalcUsage();
};

// ---- Icons ----
// Geometry is NOT defined here. It lives once in lib/Icons.lib.php and arrives as
// EngCalcs.icons / EngCalcs.iconOpenTag, so PHP's ecIcon() and every JS-built control draw the
// same shape at the same stroke weight. Redrawing a path in JS would be a second icon pretending
// to be the first. js/looped-network.js builds its whole menu bar and toolbar through these.
EngCalcs.iconEl = function (name) {
	'use strict';
	var geom = (this.icons || {})[name];
	if (!geom || !this.iconOpenTag) { return null; }
	// Built through a detached wrapper rather than createElementNS + innerHTML: setting innerHTML
	// directly on an SVG element is unreliable in older engines, and the markup here is our own
	// constant data, never anything a user typed.
	var wrap = document.createElement('div');
	wrap.innerHTML = this.iconOpenTag + geom + '</svg>';
	return wrap.firstChild;
};

// The one way a control gets an icon + word, so no call site can grow a second convention and
// ship a control missing its icon.
EngCalcs.setLabel = function (el, iconName, text) {
	'use strict';
	el.textContent = '';
	var ic = iconName ? this.iconEl(iconName) : null;
	if (ic) { el.appendChild(ic); }
	el.appendChild(document.createTextNode(text));
};

// THE ICON-ONLY FORM, and it is a SECOND function on purpose (dev/toolbar-icons.md). setLabel()
// above builds the menu bar, the menu rows and the map symbols as well, and all of those keep their
// words -- a menu row is as wide as its longest label anyway, so an icon there buys nothing. The
// toolbar is the one strip where horizontal space is actually scarce, and Tom (2026-08-18) ruled the
// words off it: "drop the words from all the toolbar row; move them to the beginning of their tips."
//
// A button whose only content is an aria-hidden <svg> HAS NO ACCESSIBLE NAME AT ALL -- it is
// announced as "button", full stop. So this does all four things at once, and no call site can do
// three of them:
//   * the icon replaces the text;
//   * `aria-label` carries the NAME ALONE, which is what a screen reader reads at every tab stop;
//   * `title` carries "Name -- explanation", which is what a hovering user reads;
//   * `.ec-help` is added, which is the ONLY selector initTips() wires -- a title without it is a
//     tip no touch user can ever reach.
// The separator is a translated string (pageConfig.lpn_tip_join), not a punctuation constant: a
// language wanting a colon, another dash, or the explanation first changes one key.
EngCalcs.setIconLabel = function (el, iconName, name, tip) {
	'use strict';
	el.textContent = '';
	var ic = iconName ? this.iconEl(iconName) : null;
	if (ic) { el.appendChild(ic); }
	if (name) { el.setAttribute('aria-label', name); }
	var pattern = (this.pageConfig || {}).lpn_tip_join || '{name} \u2014 {tip}';
	el.title = tip ? pattern.replace('{name}', name || '').replace('{tip}', tip) : (name || '');
	if (el.className.indexOf('ec-help') < 0) {
		el.className = (el.className ? el.className + ' ' : '') + 'ec-help';
	}
};

// Explicit "Copy link" action -- URL sync is opt-in, not automatic on every keystroke
// (constant history.replaceState churn was noise, especially for dynamic-row calculators).
EngCalcs.copyLink = function () {
	'use strict';
	// **THE ONE SHARE CONTROL, and it lives in the navbar beside the name** (ROADMAP Task 228). The
	// name field and this button are one gesture: type what this calculation IS, then take the link
	// that carries it. A second copy of this under the Printable Title shipped for one day and was
	// removed -- that field names the printed SHEET, which is a different intention (Tom: *"this is
	// just plain not needed"*).
	//
	// **THERE IS NO SILENT PATH, which is what the removed duplicate got right and this did not.**
	// It used to `return` on a browser with no clipboard permission, so the button did nothing at
	// all and said nothing about it -- and a promise rejection (the common case: a page without a
	// secure context, or permission refused) was not caught either. Every failing route now reveals
	// the link in a focused, selected box, because a control that looks like it worked and did not
	// is worse than one that says "copy this yourself".
	// Refreshed first, so the link carries the form as it stands -- but only where there IS a URL to
	// maintain. A context with no History API cannot hold one, and location.href is then already the
	// honest answer; calling updateUrl() there reaches for page furniture that need not exist.
	if (typeof this.updateUrl === 'function' && window.history && window.history.replaceState) {
		this.updateUrl();
	}
	var btn = document.getElementById('ec-copy-link-btn');
	if (!btn) { return Promise.resolve(); }
	var box = document.getElementById('ec-copy-link-url');
	var self = this, url = window.location.href;
	// **THE WORDS GO ON THE BUTTON, not on a new status line.** The navbar strip is the tightest
	// space on the page and Tom has just ruled that even the toolbar is too wordy, so the button the
	// user just pressed is where the answer belongs -- the same slot the tick uses on success.
	function say(text) {
		var original = btn.textContent;
		self.setLabel(btn, 'link', text || original);
		setTimeout(function () { self.setLabel(btn, 'link', original); }, 6000);
	}
	function manual() {
		if (box) { box.value = url; box.hidden = false; box.focus(); box.select(); }
		say((btn.dataset && btn.dataset.manualText) || '');
		self.logSignal('share', 'manual');
	}
	function copied() {
		if (box) { box.hidden = true; }
		// setLabel, NOT textContent: assigning textContent destroys the button's <svg> on the first
		// click and never restores it -- it reads text back but cannot read an element back.
		var originalText = btn.textContent;
		self.setLabel(btn, 'check', btn.dataset.copiedText || originalText);
		setTimeout(function () { self.setLabel(btn, 'link', originalText); }, 1500);
		self.logSignal('share', 'copy');
	}
	var clip = navigator.clipboard;
	if (!clip || typeof clip.writeText !== 'function') { manual(); return Promise.resolve(); }
	try { return Promise.resolve(clip.writeText(url)).then(copied, manual); }
	catch (e) { manual(); return Promise.resolve(); }
};
EngCalcs.readCookieAndCalc = function (objForm) {
	'use strict';
	// Dynamic row tables (reach/point tables) start empty in the raw HTML -- only
	// cookieToForm/pageCalculatorInitialize ever create rows. Run that unconditionally first
	// so rows always exist, then layer any shared-URL singleton values on top as overrides.
	if (!EngCalcs.cookieToForm(objForm)) {
		this.pageCalculatorInitialize(objForm);
	}
	this.loadFromUrl(objForm);
	this.pageCalculator(objForm);
	this.adjustInputWidth();
};

EngCalcs.addCalcRow = function (arrColumns) {
		'use strict';
		this.numCalcRows = this.numCalcRows + 1;
		if (document.getElementById("points_data")) {
			document.getElementById("points_data").rows = this.numCalcRows * 1.25;
		}
		var tbody = document.getElementById("CalcsTable").getElementsByTagName("TBODY")[0],
		row = document.createElement("TR"),
		i;
		for (i = 0; i < arrColumns.length; i += 1) {
				var column = arrColumns[i],      
				tdi = document.createElement("TD");
				if (column.inputType) {
					var inputi = document.createElement("INPUT");
					inputi.type=column.inputType;
					inputi.className='input';
					if (column.inputType === 'number') {
						inputi.step="any";
						inputi.size="4";
						inputi.value=String(column.value);
						inputi.setAttribute('onkeyup', 'EngCalcs.submitForm()');
					} else {
						if (column.inputType === 'checkbox' || column.inputType === 'radio') {
							inputi.checked = !!column.value;
						} else {
							// text (and any other value-bearing) input: seed its value like number does.
							inputi.size = "4";
							inputi.value = (column.value === null || column.value === undefined) ? '' : String(column.value);
							inputi.setAttribute('onkeyup', 'EngCalcs.submitForm()');
						}
						inputi.setAttribute('onchange', 'EngCalcs.submitForm()');
					}
					inputi.name=column.name;
					tdi.appendChild(inputi);
					this.cookieSlotsLength = this.cookieSlotsLength + 1;
				} else {
					tdi.setAttribute("name", column.name);
				}
				row.appendChild(tdi);
		}
		tbody.appendChild(row);
};

EngCalcs.addSingleCalcRow = function () {
	'use strict';
	this.pageAddCalcRow();
	this.submitForm();
};

EngCalcs.deleteSingleCalcRow = function () {
	'use strict';
	this.numCalcRows = this.numCalcRows - 1;
	if (document.getElementById("points_data")) {
		document.getElementById("points_data").rows = this.numCalcRows * 1.25;
	}
	var tbody = document.getElementById("CalcsBody");
	tbody.removeChild(tbody.getElementsByTagName("TR")[this.numCalcRows]);
	this.submitForm();
};

/**
	* unitFactor() -- "number of that unit per SI unit" for a unit <select>, a unit NAME,
	* or anything that has neither.
	*
	* Task 390: a unit's identity is its NAME. An option's value is 'ft', and the factor is
	* looked up here from EngCalcs.unitFactors (emitted by echoHTMLHead() straight out of
	* lib/Units.lib.php). Nothing in JS may retype a conversion constant; a second table that
	* agrees today is a table that disagrees after the next derivation.
	*
	* Returns 1 for a missing select or an unknown name, which is the pre-existing behaviour
	* of `parseFloat(undefined) || 1` at every call site and keeps a page rendering rather than
	* filling with NaN. A unit we have no factor for is a REPRESENTABLE unit under this
	* paradigm -- carrying its name is always possible; only the arithmetic is not.
	*/
EngCalcs.unitFactor = function (unit) {
	'use strict';
	var name = (unit && typeof unit === 'object') ? unit.value : unit,
		table = this.unitFactors || {};
	if (typeof name !== 'string' || !name) { return 1; }
	return Object.prototype.hasOwnProperty.call(table, name) ? table[name] : 1;
};

/**
	* applySelectValue() -- restore a stored <select> choice, from a cookie or a shared URL.
	*
	* Returns true if an option was selected. The one thing it does beyond `select.value = v`
	* is the Task 390 migration: before the value became the unit's NAME it was the unit's
	* conversion FACTOR, so a cookie or a link written earlier says "3.280841" where the page
	* now offers "ft". Such a value is matched back to its unit through EngCalcs.unitFactors,
	* within a relative tolerance, because the factors themselves were re-derived on
	* 2026-08-16 and the stored number is a slightly different foot than any we now hold.
	*
	* Approximate matching is safe ONLY here and only for this: it reads a number the visitor
	* never typed, in a field whose value is now a name, and its output is a NAME. It converts
	* nothing. Once a page has been visited under the new format there is nothing left to match.
	*/
EngCalcs.applySelectValue = function (select, value) {
	'use strict';
	var i, err, want, best = null, bestErr = 1e-3;
	if (!select || value === undefined || value === null || value === '') { return false; }
	select.value = value;
	// A <select> given a value no option carries goes to selectedIndex -1.
	if (select.selectedIndex >= 0) { return true; }
	want = parseFloat(value);
	if (!isFinite(want) || want === 0) { return false; }
	// Within ONE select the options are different units of the same quantity, so their
	// factors are distinct and the nearest is unambiguous.
	for (i = 0; i < select.options.length; i++) {
		err = Math.abs(this.unitFactor(select.options[i].value) - want) / Math.abs(want);
		if (err < bestErr) { bestErr = err; best = select.options[i]; }
	}
	if (best) { best.selected = true; return true; }
	return false;
};

EngCalcs.readFormInput = function (objForm, name, hasUnits) {
	'use strict';
	var numUnitsFactor = (hasUnits === true) ? this.unitFactor(objForm[name + 'u']) : 1;
	this.var[name] = objForm[name].value / numUnitsFactor;
};

/**
	* readFormInputPerUnit() -- read a RATE expressed PER one of the field's units: a price per
	* cubic foot, a cost per square metre. ADDITIVE, beside readFormInput(), never a change to it.
	*
	* readFormInput() DIVIDES by the factor, which is right for a QUANTITY of that unit (20 ft3 is
	* 20/35.3147 m3). A price PER that unit converts by the RECIPROCAL -- a cubic metre of water
	* costs 35.3147 times what a cubic foot costs -- so this MULTIPLIES. Getting the two confused
	* is wrong by the factor SQUARED and is invisible under SI, where every factor is 1 (Task 473).
	*/
EngCalcs.readFormInputPerUnit = function (objForm, name) {
	'use strict';
	this.var[name] = objForm[name].value * this.unitFactor(objForm[name + 'u']);
};

EngCalcs.writeFormResult = function (objForm, name, precision, hasUnits) {
	'use strict';
	var numUnitsFactor = (hasUnits === true) ? this.unitFactor(objForm[name + 'u']) : 1;
	document.getElementById(name).innerHTML = (this.var[name] * numUnitsFactor).toFixed(precision);
};

/**
	* escapeAttr() escapes text for safe inclusion inside an HTML attribute
	* value (e.g. title="..."). Needed because tipText may eventually come
	* from translated lang strings that contain a literal double quote.
	*/
EngCalcs.escapeAttr = function (text) {
	'use strict';
	return String(text)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
};

/**
	* writeCheckHTML() builds the suite-wide verdict-string markup (item 90 D5):
	* a leading ✓/⚠ glyph plus short text, with the whole string as the ec-tip
	* hover/tap target when tipText is given (the glyph alone is too small a
	* touch target). The glyph is decorative and carries no translation payload.
	*/
EngCalcs.writeCheckHTML = function (ok, shortText, tipText) {
	'use strict';
	var glyph = ok ? '✓' : '⚠';
	if (tipText) {
		return '<span class="ec-tip" title="' + EngCalcs.escapeAttr(tipText) + '">' + glyph + ' ' + shortText + '</span>';
	}
	return glyph + ' ' + shortText;
};

/**
	* inlineRangeWarnHtml() returns an inline verdict marker to append after a
	* result cell whose value is out of its acceptable band: ' ' + '⚠ High' above
	* highSI, ' ' + '⚠ Low' below lowSI, '' when in band (blank, not ✓, so busy
	* result tables stay uncluttered). lowSI or highSI may be null to disable that
	* side (e.g. no pipe rating entered => no high-pressure check). labels carries
	* { highShort, highTip, lowShort, lowTip }. All numbers in SI. Built on
	* writeCheckHTML so the ✓/⚠ glyph + ec-tip verdict convention comes for free.
	*/
EngCalcs.inlineRangeWarnHtml = function (valueSI, lowSI, highSI, labels) {
	'use strict';
	if (highSI != null && valueSI > highSI) {
		return ' ' + EngCalcs.writeCheckHTML(false, labels.highShort, labels.highTip);
	}
	if (lowSI != null && valueSI < lowSI) {
		return ' ' + EngCalcs.writeCheckHTML(false, labels.lowShort, labels.lowTip);
	}
	return '';
};

/**
	* writeVelocityCheck() renders a short OK / High / Low velocity status
	* into elId, with the full explanation available as a hover tip on the
	* whole string. status is 'ok', 'high', 'low', or '' (blank/no result).
	*/
// Standard gravity, in SI, for the whole suite. THE ONLY definition -- do not reintroduce a local
// `g`. A physical constant that drifts between calculators is a correctness bug showing up as two
// pages disagreeing about the same pipe, and nothing in the suite would catch it.
// STANDARD GRAVITY EXACTLY, 9.80665. It was 9.806 on the argument that the fourth digit is far
// below the uncertainty in any n, C or f a user enters -- true of the FRICTION terms, and not true
// of everything g touches. A minor loss is k V^2 / 2g, where g is the whole of the coefficient, so
// the rounding went straight into the answer: measured 2026-08-17, our minor losses ran 0.10% above
// EPANET's, which is a bias that accumulates link by link across a network (Tom saw 0.003 psi build
// up with distance from the source on Elm Street Center). Correcting this does NOT close that gap
// -- EPANET's own g is 32.2 ft/s^2, i.e. 9.81456, which is the rounded one. It removes OUR rounding,
// which was ours to remove, and leaves a disagreement that is EPANET's and is declared to the user.
// lib/Units.lib.php derives every pressure factor from this number; change them in the same edit.
EngCalcs.G = 9.80665;

// Feet per metre, exactly 1/0.3048. THE ONLY definition -- do not reintroduce a local `ft_per_m`.
// The international foot is exact by definition, so there is no reason to carry a rounded one: the
// suite shipped FOUR different feet in $ec_units (3.280800, 3.280788, 3.280841, 3.280854) plus a
// fifth here at 3.28084, and a length, an area and a volume that disagree cannot tie out.
// dev/scripts/unit_factor_check.php holds $ec_units to this same value.
EngCalcs.FT_PER_M = 1 / 0.3048;

// The velocity band every calculator's check is measured against. ONE definition -- do not
// re-inline these literals into a calculator, or a missed one disagrees silently.
//
//   min 0.6 m/s (~2 ft/s) -- the self-cleansing minimum below which solids settle. Long-standing
//     sanitary-sewer practice (Ten States Standards); unchanged.
//   max 2.5 m/s (~8.2 ft/s) -- chosen over the also-defensible 3.0 m/s (~10 ft/s, the customary US
//     ceiling for abrasion in concrete pipe). 2.5 is the round metric ceiling common in water-main
//     and sewer practice, and for an ADVISORY caution the more conservative one is the better
//     default: it asks for a second look rather than certifying a limit.
//   If you change either bound, re-check that no calculator's factory defaults newly warn. The
//     highest default velocity in the suite is Hazen-Williams at 1.38 m/s.
EngCalcs.VELOCITY_OK = { min: 0.6, max: 2.5 };

EngCalcs.writeVelocityCheck = function (elId, status, labels) {
	'use strict';
	var el = document.getElementById(elId);
	if (!el) { return; }
	el.className = '';
	if (status === 'high' || status === 'low') {
		el.innerHTML = EngCalcs.writeCheckHTML(false, status === 'high' ? labels.high : labels.low,
			status === 'high' ? labels.highTip : labels.lowTip);
		el.classList.add('ec-status-warn');
	} else if (status === 'ok') {
		el.innerHTML = EngCalcs.writeCheckHTML(true, labels.ok, labels.okTip);
		el.classList.add('ec-status-ok');
	} else {
		el.innerHTML = '';
	}
};

/**
	* readTableInputs() reads current table inputs from the "CalcsTable" element
	* into the global tableData array.  Modifies tableData.
	*
	*/
EngCalcs.readTableInputs = function () {
	'use strict';
	var columnCounter, rowCounter, rowElement;
	for (rowCounter=0; rowCounter<tableData.length; rowCounter++) {
		rowElement = document.getElementById("CalcsBody").getElementsByTagName('tr')[rowCounter];
		for (columnCounter=0; columnCounter<columnFormats.length; columnCounter++) {
			/**
				* The format of the columnFormats is like this:  
				*   t = text
				*   i,12 = a 12 character input box
				*   s,option1,option2,option3,optioni =  a drop-down list
				*/
			if (columnFormats[columnCounter].substr(0, 1) == "i") {
				tableData[rowCounter][columnCounter] = rowElement.getElementsByTagName('td')[columnCounter].getElementsByTagName('input')[0].value;
			}
		}
	}
};

/**
	* writeTableData () saves tableData (inputs and outputs) 
	* into the "CalcsTable" element of the page.
	*
	*/
EngCalcs.writeTableData = function () {
	'use strict';
	var columnCounter, rowCounter, rowElement;
	for (rowCounter=0; rowCounter<tableData.length; rowCounter++) {
		rowElement = document.getElementById("CalcsBody").getElementsByTagName('tr')[rowCounter];
		for (columnCounter=0; columnCounter<tableData[0].length; columnCounter++) {
			/**
				* The format of the columnFormats is like this:  
				*   t = text
				*   i,12 = a 12 character input box
				*   s,option1,option2,option3,optioni =  a drop-down list
				*/
			switch(columnFormats[columnCounter].substr(0, 1)) {
				case 'i':
					rowElement.getElementsByTagName('td')[columnCounter].getElementsByTagName('input')[0].value = tableData[rowCounter][columnCounter];
					break;
				case 's':
					break;
				default:
					rowElement.getElementsByTagName('td')[columnCounter].innerHTML = tableData[rowCounter][columnCounter].toFixed(2);
			}
		}
	}
};

EngCalcs.submitForm = function () {
	'use strict';
	this.calcAndSave(document.forms['formInput'],this.cookieName);
};

EngCalcs.resetToDefaults = function(confirmMessage) {
	'use strict';
	if (!window.confirm(confirmMessage)) return;
	this.expireCookie();
	window.location.href = window.location.pathname;
};

// Applies a preset. A preset is a family => unit-key map, and each unit
// <select> declares its family, so exactly one option per select is chosen and nothing
// can overwrite anything. The old version walked a flat list of TRANSLATED LABELS and
// set every text match across the whole page, so a later entry silently overwrote an
// earlier one -- that is how the 'in' preset selected psi and then replaced it with
// inH2O on every head field.
EngCalcs.setUnits = function(unitSet) {
	'use strict';
	var preset = this.unitSets[unitSet];
	if (!preset) { return; }
	document.querySelectorAll('select[data-family]').forEach(function(select) {
		var unit = preset[select.dataset.family];
		if (!unit) { return; }
		var option = select.querySelector('option[value="' + unit + '"]');
		if (option) { option.selected = true; }
	});
	this.submitForm();
};

EngCalcs.pointsDataCopy = function() {
	'use strict';
	this.cookieValueToDataString();
	document.getElementById("points_data").value = this.dataString;
};

EngCalcs.pointsDataPaste = function() {
	'use strict';
	this.dataString = document.getElementById("points_data").value;
	this.dataStringToCookieValue();
	this.createCookie();
	while (this.numCalcRows > this.dataLines.length) {
			this.deleteSingleCalcRow();
	}
	this.readCookieAndCalc(document.forms['formInput']);
};


EngCalcs.adjustInputWidth = function () {
	'use strict';
	var stringLength = 2;
	document.querySelectorAll('.input').forEach(function(el) {
		stringLength = Math.max(stringLength, el.value.length * 0.56 + 0.55);
	});
	var inputWidth = stringLength.toString() + 'em';
	document.querySelectorAll('.input').forEach(function(el) {
		el.style.width = inputWidth;
	});
};

