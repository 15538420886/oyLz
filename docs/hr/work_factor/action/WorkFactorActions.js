var Reflux = require('reflux');

var WorkFactorActions = Reflux.createActions([
	'createHrWorkFactor',
	'deleteHrWorkFactor',
	'updateHrWorkFactor',
	'retrieveHrWorkFactor',
	'retrieveHrWorkFactorPage',
	'initHrWorkFactor'
]);

module.exports = WorkFactorActions;

