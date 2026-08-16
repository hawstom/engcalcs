EngCalcs.pageCalculator = function (objForm) {
	'use strict';
	this.Manning.s0 = objForm['s0'].value / objForm['s0u'].value;
	ws = objForm.ws.value;
	var
	hasUnits, precision,
	// Use unary + to convert form values to numbers
	// so when we add z1 and z2 they don't get concatenated.
	ws = objForm['ws'].value / objForm['wsu'].value,
	row,
	station0,
	station1,
	arrStation = [],
	elev0,
	elev1,
	arrElev = [],
	arrSketchSegments = [],
	n1,
	d0,
	d1,
	maxRegionVelocity = 0,
	minRegionVelocity = Infinity,
	l,
	rise,
	hypotenuse,
	s,
	tau,
	d50_mc,
	d50_mra;
	this.Manning.ac = 0;
	this.Manning.pwc = 0;
	this.Manning.ncompterm617c = 0;
	this.Manning.ncompterm618c = 0;
	this.Manning.qc = 0;
	this.Manning.q617c = 0;
	this.Manning.q618c = 0;

	for (var iStation=0; iStation < this.numCalcRows; iStation++) {
		row = document.getElementById("CalcsBody").getElementsByTagName('tr')[iStation];
		station1 = row.getElementsByTagName( 'input' )[0].value / objForm['stationu'].value;
		arrStation.push(station1);
		elev1 = row.getElementsByTagName('input')[1].value / objForm['elevationu'].value;
		arrElev.push(elev1);
		d1=Math.max(ws-elev1,0);
		// Output
		// Point
		// Bottom shear stress depends on y, so we report it for a point and don't store it with the section.
		tau = d1 * this.Manning.s0;
		document.getElementsByName('tau')[iStation].innerHTML = (tau * objForm['tauu'].value).toFixed(2);
		// Do the calcs and output if this is not the first row
		if(iStation > 0) {
			this.Manning.n = document.getElementsByName('n')[iStation].value;
			l=station1-station0;
			rise=elev1-elev0;
			hypotenuse = Math.pow(l*l+rise*rise,0.5);
			s = (l == 0) ? 0 : rise/l;
			this.Manning.a = (s==0) ? (d0*l) : (d0*d0-d1*d1)/(2*s);
			this.Manning.ac = this.Manning.ac + this.Manning.a;
			// Three shorthand "if" statements nested/strung together
			this.Manning.pw = (this.Manning.a == 0) ? 0 : (s == 0) ? l :  Math.abs(this.wedgeWettedPerimeter(d0, s) - this.wedgeWettedPerimeter(d1, s));
			this.Manning.pwc = this.Manning.pwc + this.Manning.pw;
			this.Manning.t = l*this.Manning.pw/hypotenuse;
			this.Manning.da = this.Manning.a / this.Manning.t;
			this.Manning.isBank = document.getElementsByName('is_bank')[iStation].checked;
			arrSketchSegments.push({
				sectionX1: station0,
				sectionX2: station1,
				sectionY1: elev0,
				sectionY2: elev1,
				WSX1: (s >= 0) ? station0 : (station1 - this.Manning.t),
				WSX2: (s <= 0) ? station1 : (station0 + this.Manning.t),
				isBank: this.Manning.isBank,
				n: this.Manning.n
			});
			this.Manning.recalc();
			this.Manning.qc = this.Manning.qc + this.Manning.q;
			this.Manning.ncompterm617c = this.Manning.ncompterm617c + this.Manning.ncompterm617;
			this.Manning.ncompterm618c = this.Manning.ncompterm618c + this.Manning.ncompterm618;
			if (iStation === this.numCalcRows - 1) {
				document.getElementsByName('is_bank')[iStation].checked = true;
				document.getElementsByName('is_bank')[iStation].disabled = true;
			} else {
				document.getElementsByName('is_bank')[iStation].disabled = false;
			}
			// Output
			// Segment
			document.getElementsByName('t')[iStation].innerHTML = (this.Manning.t * objForm['tu'].value).toFixed(2);
			document.getElementsByName('pw')[iStation].innerHTML = (this.Manning.pw * objForm['pwu'].value).toFixed(2);
			document.getElementsByName('a')[iStation].innerHTML = (this.Manning.a * objForm['au'].value).toFixed(2);
			// Region
			if (this.Manning.isBank) {
				this.Manning.closeRegion();
				maxRegionVelocity = Math.max(maxRegionVelocity, this.Manning.v617);
				minRegionVelocity = Math.min(minRegionVelocity, this.Manning.v617);
				document.getElementsByName('rh')[iStation].innerHTML = (this.Manning.rh * objForm['rhu'].value).toFixed(2);
				document.getElementsByName('n617')[iStation].innerHTML = this.Manning.n617.toFixed(2);
				document.getElementsByName('v617')[iStation].innerHTML = (this.Manning.v617 * objForm['v617u'].value).toFixed(2);
				document.getElementsByName('hv617')[iStation].innerHTML = (this.Manning.hv617 * objForm['hv617u'].value).toFixed(2);
				document.getElementsByName('fr617')[iStation].innerHTML = this.Manning.fr617.toFixed(2);
				document.getElementsByName('q617')[iStation].innerHTML = (this.Manning.q617 * objForm['q617u'].value).toFixed(2);
			} else {
				document.getElementsByName('rh')[iStation].innerHTML = '';
				document.getElementsByName('n617')[iStation].innerHTML = '';
				document.getElementsByName('v617')[iStation].innerHTML = '';
				document.getElementsByName('hv617')[iStation].innerHTML = '';
				document.getElementsByName('fr617')[iStation].innerHTML = '';
				document.getElementsByName('q617')[iStation].innerHTML = '';
			}
		}
		// Save the old geometry variables
		station0=station1;
		elev0=elev1;
		d0=d1;
	}
	document.getElementById('q_617').innerHTML = (this.Manning.q617c * objForm['q_617u'].value).toFixed(2);
	var vCheckStatus = (minRegionVelocity === Infinity) ? ''
		: (maxRegionVelocity > EngCalcs.VELOCITY_OK.max) ? 'high'
		: (minRegionVelocity < EngCalcs.VELOCITY_OK.min) ? 'low'
		: 'ok';
	this.writeVelocityCheck('v_check', vCheckStatus, {
		ok: EngCalcs.pageConfig.mhp_vel_ok_short,
		high: EngCalcs.pageConfig.mhp_vel_high_short,
		low: EngCalcs.pageConfig.mhp_vel_low_short,
		highTip: EngCalcs.pageConfig.mtc_vel_high,
		lowTip: EngCalcs.pageConfig.mtc_vel_low
	});

	// Sketch
	var
	i,
	htmlSketchSegments = '';
	this.Sketch.construct({
		maxHeight: 100,
		maxWidth: 600,
		strokeColor: 'black',
		strokeWidth: 4,
		figureTop: Math.max(...arrElev, ws),
		figureLeft: Math.min(...arrStation),
		figureHeight: Math.max(...arrElev, ws) - Math.min(...arrElev),
		figureWidth: Math.max(...arrStation) - Math.min(...arrStation)
	});
	for (i = 0; i < arrSketchSegments.length; i = i + 1) {
		this.Sketch.strokeColor = 'black';
		htmlSketchSegments = htmlSketchSegments.concat(
			this.Sketch.getLineHtml([
			 {x:arrSketchSegments[i].sectionX1, y:arrSketchSegments[i].sectionY1},
			 {x:arrSketchSegments[i].sectionX2, y:arrSketchSegments[i].sectionY2}
			])
		);
		this.Sketch.strokeColor = 'blue';
		htmlSketchSegments = htmlSketchSegments.concat(
			this.Sketch.getLineHtml([
			 {x:arrSketchSegments[i].WSX1, y:ws},
			 {x:arrSketchSegments[i].WSX2, y:ws}
			])
		);
		if (arrSketchSegments[i].isBank && i < arrSketchSegments.length - 1) {
			this.Sketch.strokeColor = 'red';
			htmlSketchSegments = htmlSketchSegments.concat(
				this.Sketch.getLineHtml([
				 {x:arrSketchSegments[i].sectionX2, y:this.Sketch.figureTop},
				 {x:arrSketchSegments[i].sectionX2, y:(this.Sketch.figureTop - this.Sketch.figureHeight)}
				])
			);
		}
		htmlSketchSegments = htmlSketchSegments.concat(
			this.Sketch.getMiddleTextHtml({
				point: {x:(arrSketchSegments[i].sectionX1 + arrSketchSegments[i].sectionX2) / 2, y:this.Sketch.figureTop-this.Sketch.figureHeight/2},
				text: arrSketchSegments[i].n,
				height: 14,
				rotation: -90
			})
		);
	}

	document.getElementById('sketch').innerHTML =
		'<svg height="' + this.Sketch.maxHeight + '" width="' + this.Sketch.maxWidth + '">'
		+ htmlSketchSegments
		+ 'Sorry, your browser does not support inline SVG.'
		+ '</svg>';
};

// The seed a first-time visitor gets: a compound section with a main channel and a floodplain
// on each side, which is the whole point of this calculator (three regions, three composite n).
//
// TWO THINGS ABOUT THE SEED COOKIE, both of which used to be wrong (ROADMAP Task 233).
//
// 1. IT MUST NOT NAME A UNIT. The cookie is POSITIONAL over the form's INPUTs and SELECTs, and an
//    `s:<n>` slot sets a select BY ITS CONVERSION FACTOR. The old seed hard-coded one factor per
//    select, and `1` is the SI option of every distance/flow/velocity family -- so the English
//    page forced itself into metric on every first load, overwriting the correct US selects PHP
//    had just rendered. An EMPTY `s:` slot keeps the slot count right and makes cookieToForm fall
//    back to the server-rendered `option[selected]`, which is already the right preset. So the
//    slots are built by WALKING THE FORM the server just rendered rather than by being typed out:
//    add a field to the page and the seed follows it, instead of silently mis-aligning by one.
// 2. THE SECTION ITSELF IS PER-PRESET. Station and elevation are read in whatever unit the page
//    rendered in, so a metre-sized floodplain read as feet is a different channel -- and it was
//    also a channel that opened on a ⚠ Low velocity in BOTH presets, which CLAUDE.md is explicit
//    is worse than opening on a worked example. Each preset gets round numbers an engineer would
//    type, chosen so every region lands inside EngCalcs.VELOCITY_OK (0.6-2.5 m/s):
//      us  6 ft deep at 0.25%: overbanks 2.4 ft/s, main channel 6.7 ft/s, Q = 1425 cfs
//      si  2 m  deep at 0.25%: overbanks 0.79 m/s, main channel 2.07 m/s, Q = 36.8 m3/s
//    Verified by dev/browser-pass/mi-defaults.js, which drives the real page in both presets --
//    the calc-spike smoke harness cannot see this page's results, because they live in rows it
//    does not build.
EngCalcs.pageCalculatorInitialize = function (objForm) {
	'use strict';
	var i, el, slots = [], elements = objForm.elements;
	for (i = 0; i < elements.length; i = i + 1) {
		el = elements[i];
		// Same two tag names cookieToForm counts, in the same document order, so the slot count
		// matches by construction. Buttons and the points textarea are not stored, as before.
		if (el.tagName === 'INPUT') { slots.push('i:' + el.value); }
		else if (el.tagName === 'SELECT') { slots.push('s:'); }
	}
	this.cookieValue = slots.join(',');
	// Points data (user readable). Column order matches the v2 table layout: station, elevation, is_bank, n.
	this.dataString = (this.defaultUnitSet === 'us')
		? "0,6\n30,3,true,0.04\n40,1,false,0.03\n60,1,false,0.03\n70,3,true,0.03\n100,6,true,0.04"
		: "0,2\n10,1,true,0.04\n12,0.5,false,0.03\n18,0.5,false,0.03\n20,1,true,0.03\n30,2,true,0.04";
	this.dataStringToCookieValue();
	// Stamp the current format so this fresh seed isn't read back as a legacy (v1) cookie and migrated.
	this.cookieValue = 'v' + (this.cookieFormatVersion || 1) + ',' + this.cookieValue;
	this.createCookie();
	this.cookieToForm(objForm);
};

EngCalcs.Manning.recalc = function () {
	this.s0root = Math.pow(this.s0, 0.5);
	this.rh = this.a/this.pw;
	this.v = this.c/this.n*Math.pow(this.rh,2/3)*this.s0root;
	if (this.a == 0) {
		this.q = 0;
	} else {
		this.q = this.v * this.a;
	}
	this.hv = this.v * this.v / (2 * this.g);
	this.fr = this.v * Math.sqrt(this.t/(this.g * this.a * Math.cos(Math.atan(this.s0))));
	this.ncompterm617 = this.pw*Math.pow(this.n,1.5);
	this.ncompterm618 = this.pw*Math.pow(this.n,2);
};

EngCalcs.Manning.closeRegion = function () {
	this.pw = this.pwc;
	this.a = this.ac;
	this.n = Math.pow(this.ncompterm617c, (2/3))/Math.pow(this.pwc, (2/3));
	this.recalc();
	this.n617 = this.n;
	this.v617 = this.v;
	this.hv617 = this.hv;
	this.fr617 = this.fr;
	this.q617 = this.q;
	this.q617c = this.q617c + this.q;
	this.n = Math.pow(this.ncompterm618c, 0.5)/Math.pow(this.pwc, 0.5);
	this.recalc();
	this.n618 = this.n;
	this.v618 = this.v;
	this.fr618 = this.fr;
	this.q618 = this.q;
	this.q618c = this.q618c + this.q;
	this.pwc = 0;
	this.ac = 0;
	this.ncompterm617c = 0;
	this.ncompterm618c = 0;
};

EngCalcs.wedgeWettedPerimeter = function (depth, slope) {
	return Math.pow(depth*depth+(depth/slope)*(depth/slope), 0.5);
};

EngCalcs.addManningIrregularStation = function (station, elevation, d50in, n, isBank) {
	'use strict';
	var arrColumns = [
		// Point
		{name: 'station',            value: station,   inputType: 'number'},
		{name: 'elevation',          value: elevation, inputType: 'number'},
		{name: 'is_bank',            value: isBank,    inputType: ((isBank === null) ? null : 'checkbox')},
		{name: 'tau',                value: null,      inputType: null},
		// Segment
		{name: 'n',                  value: n,         inputType: ((n === null) ? null : 'number')},
		{name: 't',                  value: null,      inputType: null},
		{name: 'pw',                 value: null,      inputType: null},
		{name: 'a',                  value: null,      inputType: null},
		// Region
		{name: 'rh',                 value: null,      inputType: null},
		{name: 'n617',               value: null,      inputType: null},
		{name: 'v617',               value: null,      inputType: null},
		{name: 'hv617',              value: null,      inputType: null},
		{name: 'fr617',              value: null,      inputType: null},
		{name: 'q617',               value: null,      inputType: null},
	];
	this.addCalcRow(arrColumns);
};

EngCalcs.pageAddCalcRow = function () {
	var n,
	isBank,
	station,
	elevation;
	if (this.numCalcRows === 0) {
		d50in = null;
		n = null;
		// If first row, don't show bank checkbox.
		isBank = null;
		station = 0;
		elevation = 0;
	} else {
		d50in = 1;
		n = 1;
		isBank = false;
		station = +document.getElementsByName('station')[this.numCalcRows - 1].value + +1;
		elevation = +document.getElementsByName('elevation')[this.numCalcRows - 1].value;
	}
	this.addManningIrregularStation(station, elevation, d50in, n, isBank);
};

EngCalcs.dataSingletonsCount = 4;
EngCalcs.dataColumnsFirstRowCount = 2;
EngCalcs.dataColumnsOtherRowsCount = 4;

// v2 (2026-07-06): the per-row "n" column moved from the Point group to lead the
// Segment group, so its input now sits AFTER "is_bank" instead of before it. The
// cookie is positional, so an older (v1) cookie has each non-first row's inputs as
// [station, elevation, n, is_bank]; swap the last two so the values land in the
// new [station, elevation, is_bank, n] order. The first row carries neither input.
EngCalcs.cookieFormatVersion = 2;
EngCalcs.migrateCookie = function (cookieVars, fromVersion) {
	'use strict';
	if (fromVersion >= 2) { return cookieVars; }
	var i,
		inputCount = 0,
		prevInputIndex = -1,
		rowInputStart = this.dataSingletonsCount + this.dataColumnsFirstRowCount,
		rel,
		tmp;
	for (i = 0; i < cookieVars.length; i += 1) {
		if (cookieVars[i].split(':')[0] === 'i') {
			inputCount += 1;
			if (inputCount > rowInputStart) {
				// 0=station, 1=elevation, 2=n (v1), 3=is_bank (v1)
				rel = (inputCount - rowInputStart - 1) % this.dataColumnsOtherRowsCount;
				if (rel === 3) {
					tmp = cookieVars[i];
					cookieVars[i] = cookieVars[prevInputIndex];
					cookieVars[prevInputIndex] = tmp;
				}
			}
			prevInputIndex = i;
		}
	}
	return cookieVars;
};
