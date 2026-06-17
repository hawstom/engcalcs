// The argument f is not used here.
EngCalcs.pageCalculator = function (objForm) {
    'use strict';
    var row,
    station0,
    station1,
    elev0,
    elev1,
    d0,
    d1,
    l,
    rise,
    s,
    qi,
    qc = 0,
    // Get the global values and save them to a cookie
    hw = objForm.hw.value,
    cw = objForm.cw.value;
    cw = objForm.cw.value;

    for (var station = 0; station < EngCalcs.numCalcRows; station++) {
        // Save the old variables if this is not the first row
        if(station1) {
            station0=station1;
            elev0=elev1;
            d0=d1;
        }
        // Get the input, make the cookie text, and calc and output d1 even for first row
        row = document.getElementById("CalcsBody").getElementsByTagName( 'tr' )[station];
        station1 = row.getElementsByTagName( 'input' )[0].value;
        elev1 = row.getElementsByTagName( 'input' )[1].value;
        d1=Math.max(hw-elev1,0);
        row.getElementsByTagName( 'td' )[2].innerHTML = d1.toFixed(2);

        // Do the calcs and output if this is not the first row
        if(station0) {
            l=station1-station0;
            rise=elev1-elev0;
            s=rise/l;
            // Two shorthand "if" statements nested/strung together
            qi = (l==0) ? 0 : (s==0) ? cw*l*Math.pow(d0,1.5) : cw/(2.5*s)*(Math.pow(d0,2.5)-Math.pow(d1,2.5));
            qc = qc + qi;
            row.getElementsByTagName( 'td' )[3].innerHTML = qi.toFixed(2);
            row.getElementsByTagName( 'td' )[4].innerHTML = qc.toFixed(2);
        }
    }
    // Save a cookie for next time
    EngCalcs.adjustInputWidth();
};

EngCalcs.pageCalculatorInitialize = function (objForm) {
    this.pageAddCalcRow();
    this.pageAddCalcRow();
    this.pageAddCalcRow();
    this.pageAddCalcRow();
};

EngCalcs.addWeirStation = function (station, elevation) {
    'use strict';
    var arrColumns = [
        {name: 'station',   value: station,   inputType: 'number'},
        {name: 'elevation', value: elevation, inputType: 'number'},
        {name: 'd',         value: null,      inputType: null},
        {name: 'qi',        value: null,      inputType: null},
        {name: 'qc',        value: null,      inputType: null},
    ];
    this.addCalcRow(arrColumns);
};

EngCalcs.pageAddCalcRow = function () {
    var station,
    elevation;
    if (this.numCalcRows === 0) {
        station = 0;
        elevation = 0;
    } else {
        station = +document.getElementsByName('station')[this.numCalcRows - 1].value + +1;
        elevation = +document.getElementsByName('elevation')[this.numCalcRows - 1].value;
    }
    this.addWeirStation(station,elevation);
};

EngCalcs.dataSingletonsCount = 4;
EngCalcs.dataColumnsFirstRowCount = 2;
EngCalcs.dataColumnsOtherRowsCount = 2;
