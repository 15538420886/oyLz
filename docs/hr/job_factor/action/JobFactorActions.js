var Reflux = require('reflux');

var JobFactorActions = Reflux.createActions([
	'createHrJobFactorValue',
	'deleteHrJobFactorValue',
	'updateHrJobFactorValue',
	'retrieveHrJobFactorValue',
	'retrieveHrJobFactorValuePage',
	'initHrJobFactorValue'
]);

module.exports = JobFactorActions;
