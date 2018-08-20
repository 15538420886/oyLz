var Reflux = require('reflux');

var WorkLogActions = Reflux.createActions([
	'createHrWorkLog',
	'deleteHrWorkLog',
	'updateHrWorkLog',
	'retrieveHrWorkLog',
	'retrieveHrWorkLogPage',
	'initHrWorkLog',
	'retrieveEmpWorkLog',
	'getCacheData',
	'retrieveDetailWorkLog'
]);

module.exports = WorkLogActions;
