// Cookies.lib.js
// Loaded by the echoHTMLHead php function.
var EngCalcs = EngCalcs || {};
EngCalcs.createCookie = function (name, value, days) {
	"use strict";
	var
		date,
		expires;
	if (days) {
		date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	} else {
		expires = "";
	}
	document.cookie = name + "=" + value + expires + "; SameSite=Strict; path=/";
};

// readCookie
// Returns the data part of the requested named cookie from the document cookie string.
EngCalcs.readCookie = function (name) {
	"use strict";
	var
		nameEQ = name + "=",
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
		if (candidate.indexOf(nameEQ) === 0) { return candidate.substring(nameEQ.length, candidate.length); }
	}
	return null;
};

// cookieToForm
// Used (2010-06-11) to read cookie values into calculators including Manning Pipe Flow
EngCalcs.cookieToForm = function (cookieName, form) {
	"use strict";
	var
		i,
		cookie = this.readCookie(cookieName),
		cookieVars,
		length0,
		length1,
		inputCounter = -1,
		selectCounter = -1,
		cookieVarSplit;
	if (cookie) {
		cookieVars = cookie.split(",");
		this.cookieVarsLength = cookieVars.length;
		this.cookieSlotsLength = form.getElementsByTagName("INPUT").length + form.getElementsByTagName("SELECT").length;
		while (this.cookieSlotsLength < this.cookieVarsLength) {
			length0 = this.cookieSlotsLength;
			this.pageAddCalcRow();
			length1 = this.cookieSlotsLength;
		}
		for (i = 0; i < this.cookieVarsLength; i = i + 1) {
			cookieVarSplit = cookieVars[i].split(":");
			switch (cookieVarSplit[0]) {
			case 'i':
				inputCounter = inputCounter + 1;
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
				form.getElementsByTagName("SELECT")[selectCounter].value = cookieVarSplit[1];
				break;
			}
		}
	}
	return cookie;
};

EngCalcs.formToCookie = function (form, cookieName) {
	"use strict";
	var
		i,
		cookie = "",
		formElementsLength = form.elements.length,
		element;
	for (i = 0; i < formElementsLength; i =  i + 1) {
		element = form.elements[i];
		switch (element.tagName) {
		case 'INPUT':
			if (element.type === 'checkbox' || element.type === 'radio') {
					if (element.checked === true) {
							cookie += ',' + 'i:true';
					} else if (element.checked == false) {
							cookie += ',' + 'i:false';
					}
			} else {
				cookie += ',' + 'i:' + element.value;
			}
			break;
		case 'SELECT':
			cookie += ',' + 's:' + element.value;
			break;
		}
	}
	this.createCookie(cookieName, cookie.substring(1), 36000);
};
