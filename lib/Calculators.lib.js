// Calculators.lib.js
// Loaded by the echoHTMLHead php function.
// Master namespace object if not already exists.
var EngCalcs = EngCalcs || {};
EngCalcs.numCalcRows = 0;
EngCalcs.cookieSlotsLength = 0;

EngCalcs.calcAndSave = function (objForm) {
	'use strict';
	this.formToCookie(objForm);
	this.pageCalculator(objForm);
	this.adjustInputWidth(objForm);
};

EngCalcs.readAndCalc = function (objForm) {
	'use strict';
	if (!EngCalcs.cookieToForm(objForm)) {
		this.pageCalculatorInitialize(objForm);
	}
	this.pageCalculator(objForm);
	this.adjustInputWidth(objForm);
};

EngCalcs.addCalcRow = function (arrColumns) {
		'use strict';
		this.numCalcRows = this.numCalcRows + 1;
		document.getElementById("points_data").rows = this.numCalcRows * 1.25;
		var tbody = document.getElementById("CalcsTable").getElementsByTagName("TBODY")[0],
		row = document.createElement("TR"),
		i;
		for (i = 0; i < arrColumns.length; i += 1) {
				var column = arrColumns[i],      
				tdi = document.createElement("TD");
				if (column.inputType) {
						var inputi = document.createElement("INPUT");
						inputi.type=column.inputType;
						if (column.inputType === 'number') {
								inputi.step="any";
								inputi.size="4";
								inputi.value=String(column.value);
								inputi.setAttribute('onkeyup', 'EngCalcs.submitForm()');
						} else {
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
		document.getElementById("points_data").rows = this.numCalcRows * 1.25;
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

EngCalcs.setUnits = function(unitSet) {
	'use strict';
	$.each(EngCalcs.unitSets[unitSet], function(i, unit) {
			$("select option").filter(function() {
					return $(this).html() == unit; 
			}).prop('selected', true);
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
	this.readAndCalc(document.forms['formInput']);
};


EngCalcs.adjustInputWidth = function (objForm) {
	// This function was disabled until 2020-04-29. I don't remember why.
	'use strict';
	var stringLength = 2;
	$('.input').each(function(){
		stringLength = Math.max(stringLength, $(this).val().length / 1.6);
	});
	var inputWidth = stringLength.toString() + 'em';
	$('.input').width(inputWidth);
};
