var Reflux = require('reflux');

var WorkLogActions = Reflux.createActions([
	'createHrWorkLog',
	'deleteHrWorkLog',
	'updateHrWorkLog',
	'retrieveHrWorkLog',
	'retrieveHrWorkLogPage',
	'initHrWorkLog',
	'retrieveEmpWorkLog',
	'retrieveEmpLoyee',
	'getCacheData'
]);

module.exports = WorkLogActions;
