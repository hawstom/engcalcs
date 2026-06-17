// Manning.lib.js
// Loaded by Manning calculators.

// Master namespace object if not already exists.
EngCalcs.Manning = EngCalcs.Manning || {};

EngCalcs.Manning.c = 1.0;
EngCalcs.Manning.g = 9.806;
EngCalcs.Manning.alpha_blodgett = 0.319;
EngCalcs.Manning.alpha_bathurst = 1.0;

EngCalcs.Manning.mc_riprap_size = function(y, a, v, g, z, s0, c, sgrock) {
	var
	d50,
	hvmax = v * v * 1.33 * 1.33 / (2 * g) ;
	// Isbash
	d50 = hvmax / (c * c * Math.cos(Math.atan(1 / z)) * (sgrock - 1));
	return d50;
};
EngCalcs.Manning.bathurst_n = function(alpha, g, t, da, d50, fr) {
	var
	b = 1.14 * Math.pow(d50 / t, 0.453) * Math.pow(da/d50, 0.814),
	fcg = Math.pow(t / da, -b),
	x = 1.025 * Math.pow(t / d50, 0.118),
	freg = 13.434 * Math.pow(t / d50, 0.492) * Math.pow(b, x),
	ffr = Math.pow(0.28 * fr/b, Math.log10(0.755 / b));
	return alpha * Math.pow(da, 1/6) / (Math.sqrt(g) * ffr * freg * fcg);
};

EngCalcs.Sketch = {};

EngCalcs.Sketch.construct = function(obj) {
	this.maxHeight = obj.maxHeight;
	this.maxWidth = obj.maxWidth;
	this.strokeColor = obj.strokeColor;
	this.strokeWidth = obj.strokeWidth;
	this.figureTop = obj.figureTop;
	this.figureLeft = obj.figureLeft;
	this.figureHeight = obj.figureHeight;
	this.figureWidth = obj.figureWidth;
	this.xScale = (this.maxWidth-this.strokeWidth) / this.figureWidth;
	this.yScale = -1 * (this.maxHeight-this.strokeWidth) / this.figureHeight;
};

// Convert point from right-handed figure coordinate system
// to left-handed sketch coordinate system
EngCalcs.Sketch.convertPoint = function(objFigurePoint) {
	var objPoint = {};
	objPoint.x = this.strokeWidth/2 + (objFigurePoint.x - this.figureLeft) * this.xScale;
	objPoint.y = this.strokeWidth/2 + (objFigurePoint.y - this.figureTop) * this.yScale;
	return objPoint;
};

EngCalcs.Sketch.getLineHtml = function(arrPoints) {
	return '<line '
	+ 'x1="' + this.convertPoint(arrPoints[0]).x.toString()
	+ '" y1="'  + this.convertPoint(arrPoints[0]).y.toString()
	+ '" x2="'  + this.convertPoint(arrPoints[1]).x.toString()
	+ '" y2="'  + this.convertPoint(arrPoints[1]).y.toString()
	+ '" style="stroke:' + this.strokeColor
	+ ';stroke-width:' + this.strokeWidth + '" />';
};

EngCalcs.Sketch.getMiddleTextHtml = function(obj) {
	return '<text '
	+ 'x="' + this.convertPoint(obj.point).x.toString()
	+ '" y="'  + this.convertPoint(obj.point).y.toString()
	+ '" transform="rotate(' + obj.rotation.toString()
	+ ' ' + this.convertPoint(obj.point).x.toString()
	+ ',' + (this.convertPoint(obj.point).y-obj.height/2).toString() + ')"'
	+ '" style="font-size: ' + obj.height + 'px;"'
	+ ' fill="green" text-anchor = "middle"'
	+ '>' + obj.text + '</text>';
};
