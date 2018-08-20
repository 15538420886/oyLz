var Reflux = require('reflux');

var JobActions = Reflux.createActions([
	'createHrJob',
	'deleteHrJob',
	'updateHrJob',
	'retrieveHrJob',
	'retrieveHrJobPage',
	'initHrJob'
]);

module.exports = JobActions;