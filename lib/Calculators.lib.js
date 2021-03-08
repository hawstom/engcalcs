// Calculators.lib.js
// Loaded by the echoHTMLHead php function.
// Master namespace object if not already exists.
var EngCalcs = EngCalcs || {};
EngCalcs.numCalcRows = 0;
EngCalcs.cookieSlotsLength = 0;

EngCalcs.calcAndSave = function (objForm, strCookieName) {
	'use strict';
	this.formToCookie(objForm, strCookieName);
	this.pageCalculator(objForm);
	this.adjustInputWidth(objForm);
};

EngCalcs.readAndCalc = function (strCookieName, objForm) {
	'use strict';
	if (!EngCalcs.cookieToForm(strCookieName, objForm)) {
		this.pageCalculatorInitialize(objForm);
	}
	this.pageCalculator(objForm);
	this.adjustInputWidth(objForm);
};

EngCalcs.addCalcRow = function (arrColumns) {
		'use strict';
		this.numCalcRows = this.numCalcRows + 1;
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

EngCalcs.mc_riprap_size = function(y, a, v, g, z, s0, c, sgrock) {
	var
	d50,
	hvmax = v * v * 1.33 * 1.33 / (2 * g) ;
	if (s0 < 0.02) {
		// Isbash
		d50 = hvmax / (c * c * Math.cos(Math.atan(1 / z)) * (sgrock - 1));
	} else if (s0 < 0.1) {
		// Robinson unit q = v * y corrected 2015-10-17
		d50 = 1.413 * Math.pow(v * y, 0.529) * Math.pow(s0, 0.794);
	} else if (s0 < 0.4) {
		// Robinson
		d50 = 0.4623 * Math.pow(v * y, 0.529) * Math.pow(s0, 0.307);
	} else {
		d50 = '++++';
	}
	return d50;
};
EngCalcs.bathurst_n = function(alpha, g, t, da, d50, fr) {
	var
	b = 1.14 * Math.pow(d50 / t, 0.453) * Math.pow(da/d50, 0.814),
	fcg = Math.pow(t / da, -b),
	x = 1.025 * Math.pow(t / d50, 0.118),
	freg = 13.434 * Math.pow(t / d50, 0.492) * Math.pow(b, x),
	ffr = Math.pow(0.28 * fr/b, Math.log10(0.755 / b));
	return alpha * Math.pow(da, 1/6) / (Math.sqrt(g) * ffr * freg * fcg);
};
