// Cookies.lib.js
// Loaded by the echoHTMLHead php function.
var EngCalcs = EngCalcs || {};
EngCalcs.createCookie = function () {
	"use strict";
	var
		date,
		expires,
		days = 36000;
	date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	expires = "; expires=" + date.toGMTString();
	document.cookie = this.cookieName + "=" + this.cookieValue + expires + "; SameSite=Strict; path=/";
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
			return this.cookieValue;
		}
	}
	return null;
};

// cookieToForm
// Used (2010-06-11) to read cookie values into calculators including Manning Pipe Flow
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
	this.cookieValue = this.cookieValue.substring(1);
	this.createCookie();
};

// Copies row data from cookie value to CSV
EngCalcs.cookieValueToCsv = function () {
	"use strict";
	var
		i,
		cookieVars,
		inputCounter = 0,
		cookieVarSplit;
	this.csv = '';
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
				if (inputCounter > this.csvSingletonsCount) {
					this.csv += cookieVarSplit[1];
					// First row
					if (inputCounter <= this.csvSingletonsCount + this.csvColumnsFirstRowCount) {
						if (this.columnCounter < this.csvColumnsFirstRowCount) {
							this.csvAdvanceColumn();
						} else {
							this.csvAdvanceRow();
						}
					// Rest of rows
					} else {
						if (this.columnCounter < this.csvColumnsOtherRowsCount) {
							this.csvAdvanceColumn();
						} else {
							this.csvAdvanceRow();
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

EngCalcs.csvAdvanceColumn = function () {
	this.csv += ',';
	this.columnCounter++;
}

EngCalcs.csvAdvanceRow = function () {
	this.csv += "\n";
	this.columnCounter = 1;
}

// Uses old cookie up to start of row data, then puts CSV row data into rest of cookie.
EngCalcs.csvToCookieValue = function () {
	"use strict";
	var
		i,
		cookieVars,
		inputCounter = 0,
		cookieValueTemp = [],
		cookieVarSplit,
		csvTemp = this.csv,
		rowData = []
		;
	csvTemp = this.csv.trim().split("\n").join(',').split(',');
	csvTemp.forEach(element => rowData.push('i:' + element));
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
			// Stop copying cookie data when we get to first row data input
			if (inputCounter <= this.csvSingletonsCount) {
				cookieValueTemp.push(cookieVars[i]);
			}
		}
		for (i = 0; i < this.cookieVarsLength; i = i + 1) {
			cookieVarSplit = cookieVars[i].split(':');
			switch (cookieVarSplit[0]) {
			case 'i':
				inputCounter = inputCounter + 1;
				break;
			case 's':
				break;
			}
			// Stop copying cookie data when we get to first row data input
			if (inputCounter <= this.csvSingletonsCount) {
				cookieValueTemp.push(cookieVars[i]);
			}
		}
		this.cookieValue = cookieValueTemp.concat(rowData).join(',');
	}
};

