//************************************************
//
// Catmull-Rom Spline to Bezier Spline Converter
//
//
// This is an experimental extension of the SVG 'path' element syntax to
// allow Catmull-Rom splines, which differs from Bezier curves in that all
// defined points on a Catmull-Rom spline are on the path itself.
//
// This is intended to serve as a proof-of-concept toward inclusion of a
// Catmull-Rom path command into the SVG 2 specification. As such, it is
// not production-ready, nor are the syntax or resulting rendering stable;
// notably, it does not include a 'tension' parameter to allow the author
// to specify how tightly the path interpolates between points. Feedback
// on this and other aspects is welcome.
//
// The syntax is as follows:
// ([number],[number])+ R([number],[number])+ ([number],[number])*
// In other words, there must be at least one coordinate pair preceding the
// Catmull-Rom path segment (just as with any other path segment), followed
// by the new path command 'R', followed by at least two coordinate pairs,
// with as many optional subsequent coordinate pairs as desired.
//
// (As with path syntax in general, the numbers may be positive or negative
// floating-point values, and the delimiter is any combination of spaces
// with at most one comma.)
//
// License:
// This code is available under the MIT or GPL licenses, and it takes
// inspiration from Maxim Shemanarev's Anti-Grain Geometry library.
//
// Contact info:
// www-svg@w3.org for public comments (preferred),
// schepers@w3.org for personal comments.
//
// author: schepers, created: 07-09-2010
//
//************************************************


function init() {
	// find each path, to see if it has Catmull-Rom splines in it
	var pathEls = document.documentElement.getElementsByTagName("path");
	for (var p = 0, pLen = pathEls.length; pLen > p; p++) {
		var eachPath = pathEls[ p ];
		parsePath( eachPath );
	}
}

// NOTE: This code assumes absolute coordinates, and doesn't account for relative command coordinates
function parsePath(d) {
	// Exit if no Catmull-Rom segments are found
	if(d.search(/[rR]/) == -1)
		return;

	var pathArray = [];
	var lastX = "";
	var lastY = "";
	// split path into constituent segments
	var pathSplit = d.split(/([A-Za-z])/);
	for(var i = 0, iLen = pathSplit.length; iLen > i; i++) {
		var segment = pathSplit[i];
		// Make command code lower case, for easier matching
		var command = segment.toLowerCase()
		if(segment.search(/[a-z]/) == -1)
			continue;

		var val = "";
		if("z" != command) {
			i++;
			val = pathSplit[i].replace(/\s+$/, '');
		}

		if("r" == command) {
			// "R" and "r" are the a Catmull-Rom spline segment
			var points = lastX + "," + lastY + " " + val;
			// Convert Catmull-Rom spline to Bezier curves
			var beziers = catmullRom2bezier(points);
			// Add new curve to array
			pathArray.push(beziers);
		} else {
			// Add path to array without editing it
			pathArray.push(segment + val);

			// Find last x,y points, for feeding into Catmull-Rom conversion algorithm
			if("h" == command) {
				lastX = val;
			} else if("v" == command) {
				lastY = val;
			} else if("z" != command) {
				var c = val.split(/[,\s]/);
				lastY = c.pop();
				lastX = c.pop();
			}
		}
	}
	// Recombine path segments and return
	return pathArray.join(" ");
}

function catmullRom2bezier(points) {
	var crp = points.split(/[,\s]/);
	//A quick fix from Jacob
	while(crp[crp.length-1]=="")
		crp.pop();
	//Back to the algo
	var d = "";
	for(var i = 0, iLen = crp.length; iLen - 2 > i; i+=2) {
		var p = [];
		if(0 == i) {
			p.push( {x: parseFloat(crp[i]),   y: parseFloat(crp[i+1])} );
			p.push( {x: parseFloat(crp[i]),   y: parseFloat(crp[i+1])} );
			p.push( {x: parseFloat(crp[i+2]), y: parseFloat(crp[i+3])} );
			p.push( {x: parseFloat(crp[i+4]), y: parseFloat(crp[i+5])} );
		} else if(iLen - 4 == i) {
			p.push( {x: parseFloat(crp[i-2]), y: parseFloat(crp[i-1])} );
			p.push( {x: parseFloat(crp[i]),   y: parseFloat(crp[i+1])} );
			p.push( {x: parseFloat(crp[i+2]), y: parseFloat(crp[i+3])} );
			p.push( {x: parseFloat(crp[i+2]), y: parseFloat(crp[i+3])} );
		} else {
			p.push( {x: parseFloat(crp[i-2]), y: parseFloat(crp[i-1])} );
			p.push( {x: parseFloat(crp[i]),   y: parseFloat(crp[i+1])} );
			p.push( {x: parseFloat(crp[i+2]), y: parseFloat(crp[i+3])} );
			p.push( {x: parseFloat(crp[i+4]), y: parseFloat(crp[i+5])} );
		}

		// Catmull-Rom to Cubic Bezier conversion matrix
		//    0       1       0       0
		//  -1/6      1      1/6      0
		//    0      1/6      1     -1/6
		//    0       0       1       0

		var bp = [];
		bp.push( {x: p[1].x,    y: p[1].y } );
		bp.push( {x: ((-p[0].x + 6*p[1].x + p[2].x)/6),	y: ((-p[0].y + 6*p[1].y + p[2].y)/6)} );
		bp.push( {x: ((p[1].x + 6*p[2].x - p[3].x)/6),	y: (( p[1].y + 6*p[2].y - p[3].y)/6)} );
		bp.push( {x: p[2].x,	y: p[2].y } );

		d += "C" + bp[1].x +","+ bp[1].y +" "+ bp[2].x +","+ bp[2].y +" "+ bp[3].x +","+ bp[3].y +" ";
	}
	return d;
}
