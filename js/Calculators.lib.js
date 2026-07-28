// Calculators.lib.js
// Loaded by the echoHTMLHead php function.
// Master namespace object if not already exists.
var EngCalcs = EngCalcs || {};

// Touch-friendly tooltips: activate Bootstrap tooltips on all cursor:help elements
// so they respond to tap (click trigger) in addition to hover on desktop.
document.addEventListener('DOMContentLoaded', function () {
	document.querySelectorAll('[title][style*="cursor:help"], .ec-help[title]').forEach(function (el) {
		new bootstrap.Tooltip(el, { trigger: 'hover focus click' });
	});
});

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

// Task 119: queue-and-flush for offline usage logging. The PWA's network-first
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

EngCalcs._queueBeacon = function (url, params) {
	'use strict';
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
		// more we can do; the event is lost same as it always was pre-Task 119.
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
				el.value = value;
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

EngCalcs.calcAndSave = function (objForm) {
	'use strict';
	this.formToCookie(objForm);
	this.pageCalculator(objForm);
	this.adjustInputWidth();
	this.maybeLogCalcUsage();
};

// Explicit "Copy link" action -- URL sync is opt-in, not automatic on every keystroke
// (constant history.replaceState churn was noise, especially for dynamic-row calculators).
EngCalcs.copyLink = function () {
	'use strict';
	this.updateUrl();
	var btn = document.getElementById('ec-copy-link-btn');
	if (!btn || !navigator.clipboard || !navigator.clipboard.writeText) { return; }
	navigator.clipboard.writeText(window.location.href).then(function () {
		var originalText = btn.textContent;
		btn.textContent = btn.dataset.copiedText || originalText;
		setTimeout(function () { btn.textContent = originalText; }, 1500);
	});
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

EngCalcs.readFormInput = function (objForm, name, hasUnits) {
	'use strict';
	var numUnitsFactor;
	if (hasUnits === true) {
		numUnitsFactor = objForm[name + 'u'].value;
	} else {
		numUnitsFactor = 1;
	}
	this.var[name] = objForm[name].value / numUnitsFactor;
};

EngCalcs.writeFormResult = function (objForm, name, precision, hasUnits) {
	'use strict';
	var numUnitsFactor;
	if (hasUnits === true) {
		numUnitsFactor = objForm[name + 'u'].value;
	} else {
		numUnitsFactor = 1;
	}
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

// Applies a preset (Task 162). A preset is a family => unit-key map, and each unit
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
		var option = select.querySelector('option[data-unit="' + unit + '"]');
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
