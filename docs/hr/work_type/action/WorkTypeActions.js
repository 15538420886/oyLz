var Reflux = require('reflux');

var WorkTypeActions = Reflux.createActions([
	'createHrWorkType',
	'deleteHrWorkType',
	'updateHrWorkType',
	'retrieveHrWorkType',
	'retrieveHrWorkTypePage',
	'initHrWorkType'
]);

module.exports = WorkTypeActions;

