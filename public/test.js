const PoissonDiskSampling = require('./scripts/pds-generator-min.js');

var pds1D = new PoissonDiskSampling({
	shape: [300],
	minDistance: 30,
	maxDistance: 50,
	tries: 10
});
pds1D.addPoint([0]);
pds1D.addPoint([300]);
console.log(pds1D.fill());
