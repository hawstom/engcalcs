// Cookies.lib.js
// Loaded by the echoHTMLHead php function.
var EngCalcs = EngCalcs || {};

// Cookie format version. A page whose field layout has changed since launch sets
// this higher and provides EngCalcs.migrateCookie(vars, fromVersion) to remap an
// older stored cookie. Cookies are written with a leading "v<N>" token; a cookie
// with no such token is treated as v1 (legacy, pre-versioning). See Manning-
// Irregular (v2: "n"/"is_bank" columns reordered).
EngCalcs.cookieFormatVersion = 1;

// Reads the consent record written by the banner (lib/Consent.lib.php). Analytics STORAGE --
// the session cookie server-side, the offline beacon queue in IndexedDB client-side -- is
// allowed only on an explicit yes. Everything this file itself writes is exempt and needs no
// consent: a cookie holding the numbers the visitor typed, written only after they typed them.
EngCalcs.analyticsConsented = function () {
	"use strict";
	var match = /(?:^|;\s*)ec_consent=([^;]*)/.exec(document.cookie);
	return !!match && decodeURIComponent(match[1]).charAt(0) === '1';
};

EngCalcs.createCookie = function () {
	"use strict";
	var
		date,
		expires,
		// One year, matching ec_language. Keep it defensible as "strictly necessary": a visitor
		// who has not opened a calculator in a year does not need the numbers they typed then.
		days = 365;
	date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	expires = "; expires=" + date.toGMTString();
	var secure = (location.protocol === 'https:') ? "; Secure" : "";
	document.cookie = this.cookieName + "=" + this.cookieValue + expires + "; SameSite=Strict" + secure + "; path=/";
};

EngCalcs.expireCookie = function () {
	"use strict";
	document.cookie = this.cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
};

// readCookie
// Saves the data part of the requested named cookie from the document cookie string to this.cookieValue.
EngCalcs.readCookie = function () {
	"use strict";
	var
		nameEQ = this.cookieName + "=",
		i,
		cookieArray,
		candidate;
	// Make an array of all the cookies that are set for this domain and path
	// by splitting the document cookie on semi-colons.
	cookieArray = document.cookie.split(';');
	// Go through all the cookies
	for (i = 0; i < cookieArray.length; i = i + 1) {
		candidate = cookieArray[i];
		// Strip leading space of the current candidate
		while (candidate.charAt(0) === ' ') { candidate = candidate.substring(1, candidate.length); }
		// If it's the one we are looking for, return it without its name.
		if (candidate.indexOf(nameEQ) === 0) {
			this.cookieValue = candidate.substring(nameEQ.length, candidate.length);
			this.normalizeCookieValue();
			return this.cookieValue;
		}
	}
	return null;
};

// Detects and strips the leading "v<N>" format-version token, then migrates an
// older cookie to the current layout via the page-provided EngCalcs.migrateCookie.
// A cookie with no token is legacy v1. After this runs, this.cookieValue holds the
// current-layout, token-free string that the positional readers expect.
EngCalcs.normalizeCookieValue = function () {
	"use strict";
	if (!this.cookieValue) { return; }
	var vars = this.cookieValue.split(","),
		storedVersion = 1,
		match = /^v(\d+)$/.exec(vars[0]);
	if (match) {
		storedVersion = parseInt(match[1], 10);
		vars.shift();
	}
	this.cookieStoredVersion = storedVersion;
	if (storedVersion < (this.cookieFormatVersion || 1) && typeof this.migrateCookie === 'function') {
		vars = this.migrateCookie(vars, storedVersion);
	}
	this.cookieValue = vars.join(",");
};

// Splices the inline solver's two positional slots -- its Q input and its units select --
// into a cookie written before the solver moved inside the form, using
// whatever defaults the page currently renders. solverInputIndex is the 1-based position of
// solver_q among the form's INPUT elements. Without this, the slot-count guard in
// cookieToForm rejects the whole cookie and the visitor silently loses their saved inputs.
EngCalcs.insertSolverCookieSlots = function (cookieVars, solverInputIndex) {
	"use strict";
	var i,
		inputCount = 0,
		elQ = document.getElementById('solver_q'),
		elQu = document.getElementById('solver_qu');
	if (!elQ || !elQu) { return cookieVars; }
	for (i = 0; i < cookieVars.length; i = i + 1) {
		if (cookieVars[i].split(':')[0] === 'i') {
			inputCount = inputCount + 1;
			if (inputCount === solverInputIndex) {
				cookieVars.splice(i, 0, 'i:' + elQ.value, 's:' + elQu.value);
				break;
			}
		}
	}
	return cookieVars;
};

EngCalcs.cookieToForm = function (form) {
	"use strict";
	var
		i,
		cookieVars,
		inputCounter = -1,
		selectCounter = -1,
		cookieVarSplit;
	this.readCookie();
	if (this.cookieValue) {
		cookieVars = this.cookieValue.split(",");
		this.cookieVarsLength = cookieVars.length;
		this.cookieSlotsLength = form.getElementsByTagName("INPUT").length + form.getElementsByTagName("SELECT").length;
		while (this.cookieSlotsLength < this.cookieVarsLength) {
			this.pageAddCalcRow();
			this.cookieSlotsLength = form.getElementsByTagName("INPUT").length + form.getElementsByTagName("SELECT").length;
		}
		// A stored cookie from a since-changed page layout (singleton fields added/removed, not
		// just rows) can never reconcile by adding rows alone -- bail out to a fresh, correctly
		// initialized page instead of partially applying a mismatched cookie or crashing.
		if (this.cookieSlotsLength !== this.cookieVarsLength) {
			return null;
		}
		for (i = 0; i < this.cookieVarsLength; i = i + 1) {
			cookieVarSplit = cookieVars[i].split(":");
			switch (cookieVarSplit[0]) {
			case 'i':
				inputCounter = inputCounter + 1;
				if (!form.getElementsByTagName("INPUT")[inputCounter]) { break; }
				if (form.getElementsByTagName("INPUT")[inputCounter].type === 'checkbox' || form.getElementsByTagName("INPUT")[inputCounter].type === 'radio') {
						if (cookieVarSplit[1] === 'true') {
								form.getElementsByTagName("INPUT")[inputCounter].checked = 'checked';
						} else if (cookieVarSplit[1] === 'false') {
								form.getElementsByTagName("INPUT")[inputCounter].removeAttribute("checked"); 
						}
				} else {
						form.getElementsByTagName("INPUT")[inputCounter].value = cookieVarSplit[1];
				}
				break;
			case 's':
				selectCounter = selectCounter + 1;
				if (!form.getElementsByTagName("SELECT")[selectCounter]) { break; }
				var savedSelect = form.getElementsByTagName("SELECT")[selectCounter];
				savedSelect.value = '';
				if (cookieVarSplit[1] !== undefined && cookieVarSplit[1] !== "") {
					savedSelect.value = cookieVarSplit[1];
				}
				// A saved unit that this select no longer offers leaves selectedIndex at -1,
				// which would silently break every calculation on the page. Fall back to the
				// server-rendered default instead. Needed because unit option lists can change
				// (psi was dropped from EGL/HGL, where it never made sense), and a stored
				// cookie outlives any such change.
				if (savedSelect.selectedIndex < 0) {
					var fallback = savedSelect.querySelector('option[selected]') || savedSelect.options[0];
					if (fallback) { fallback.selected = true; }
				}
				break;
			}
		}
	}
	return this.cookieValue;
};

EngCalcs.formToCookie = function (form) {
	"use strict";
	var
		i,
		formElementsLength = form.elements.length,
		element;
	this.cookieValue = "";
	for (i = 0; i < formElementsLength; i =  i + 1) {
		element = form.elements[i];
		switch (element.tagName) {
		case 'INPUT':
			if (element.type === 'checkbox' || element.type === 'radio') {
					if (element.checked === true) {
							this.cookieValue += ',' + 'i:true';
					} else if (element.checked == false) {
							this.cookieValue += ',' + 'i:false';
					}
			} else {
				this.cookieValue += ',' + 'i:' + element.value;
			}
			break;
		case 'SELECT':
			this.cookieValue += ',' + 's:' + element.value;
			break;
		}
	}
	// Strip the leading comma and prepend the format-version token so the cookie
	// self-describes its layout for migration on the next read.
	this.cookieValue = 'v' + (this.cookieFormatVersion || 1) + ',' + this.cookieValue.substring(1);
	this.createCookie();
};

// Copies row data from cookie value to CSV
EngCalcs.cookieValueToDataString = function () {
	"use strict";
	var
		i,
		cookieVars,
		inputCounter = 0,
		cookieVarSplit;
	this.dataString = '';
	this.columnCounter = 1;
	if (this.cookieValue) {
		cookieVars = this.cookieValue.split(",");
		this.cookieVarsLength = cookieVars.length;
		for (i = 0; i < this.cookieVarsLength; i = i + 1) {
			cookieVarSplit = cookieVars[i].split(":");
			switch (cookieVarSplit[0]) {
			case 'i':
				inputCounter = inputCounter + 1;
				// Copy row data only.
				if (inputCounter > this.dataSingletonsCount) {
					this.dataString += cookieVarSplit[1];
					// First row
					if (inputCounter <= this.dataSingletonsCount + this.dataColumnsFirstRowCount) {
						if (this.columnCounter < this.dataColumnsFirstRowCount) {
							this.dataStringAdvanceColumn();
						} else {
							this.dataStringAdvanceRow();
						}
					// Rest of rows
					} else {
						if (this.columnCounter < this.dataColumnsOtherRowsCount) {
							this.dataStringAdvanceColumn();
						} else {
							this.dataStringAdvanceRow();
						}
					}
				}
				break;
			case 's':
				break;
			}
		}
	}
};

EngCalcs.dataStringAdvanceColumn = function () {
	this.dataString += ',';
	this.columnCounter++;
}

EngCalcs.dataStringAdvanceRow = function () {
	this.dataString += "\n";
	this.columnCounter = 1;
}

// Uses old cookie up to start of row data, then puts CSV row data into rest of cookie.
EngCalcs.dataStringToCookieValue = function () {
	"use strict";
	var
		i,
		cookieVars,
		inputCounter = 0,
		cookieValueTemp = [],
		cookieVarSplit,
		dataTemp = [],
		lineTemp
		;
	// Trim white space and extra fields.
	this.dataLines = this.dataString.trim().split("\n"); // Trim data ends and make an array of lines
	for (var iLine in this.dataLines) {
		lineTemp = this.dataLines[iLine].split("\t").join(',').split(','); // Make array of fields in line
		for (var iField in lineTemp) {
			// Lose extra fields
			if (iField < this.dataColumnsFirstRowCount || (iLine > 0 && iField < this.dataColumnsOtherRowsCount)) {
					dataTemp.push('i:' + lineTemp[iField]);
			}
		}
	}
	this.columnCounter = 1;
	if (this.cookieValue) {
		cookieVars = this.cookieValue.split(',');
		this.cookieVarsLength = cookieVars.length;
		for (i = 0; i < this.cookieVarsLength; i = i + 1) {
			cookieVarSplit = cookieVars[i].split(':');
			switch (cookieVarSplit[0]) {
			case 'i':
				inputCounter = inputCounter + 1;
				break;
			case 's':
				break;
			}
			// Copy existing cookie data only up to (not including) first row data
			if (inputCounter <= this.dataSingletonsCount) {
				cookieValueTemp.push(cookieVars[i]);
			}
		}
		this.cookieValue = cookieValueTemp.concat(dataTemp).join(',');
	}
};

