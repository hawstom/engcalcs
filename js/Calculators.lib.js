// Calculators.lib.js
// Loaded by the echoHTMLHead php function.
// Master namespace object if not already exists.
var EngCalcs = EngCalcs || {};

// Touch-friendly tooltips: activate Bootstrap tooltips on all cursor:help elements
// so they respond to tap (click trigger) in addition to hover on desktop.
document.addEventListener('DOMContentLoaded', function () {
	document.querySelectorAll('[title][style*="cursor:help"]').forEach(function (el) {
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
	* writeVelocityCheck() renders a short OK / High / Low velocity status
	* into elId, with the full explanation available as a hover tip on the
	* warning icon. status is 'ok', 'high', 'low', or '' (blank/no result).
	*/
EngCalcs.writeVelocityCheck = function (elId, status, labels) {
	'use strict';
	var el = document.getElementById(elId);
	if (!el) { return; }
	el.className = '';
	if (status === 'high' || status === 'low') {
		el.innerHTML = (status === 'high' ? labels.high : labels.low) +
			' <span class="ec-tip" title="' + (status === 'high' ? labels.highTip : labels.lowTip) +
			'">⚠</span>';
		el.classList.add('ec-status-warn');
	} else if (status === 'ok') {
		el.innerHTML = labels.ok;
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

EngCalcs.setUnits = function(unitSet) {
	'use strict';
	EngCalcs.unitSets[unitSet].forEach(function(unit) {
		document.querySelectorAll('select option').forEach(function(option) {
			if (option.innerHTML === unit) option.selected = true;
		});
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
