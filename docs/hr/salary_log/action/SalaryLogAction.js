var Reflux = require('reflux');

var SalaryLogActions = Reflux.createActions([
	'createHrSalaryLog',
	'deleteHrSalaryLog',
	'updateHrSalaryLog',
	'retrieveHrSalaryLog',
	'retrieveHrSalaryLogPage',
	'initHrSalaryLog',
	'batchSalaryLog',
	'uploadFile'
]);

module.exports = SalaryLogActions;
