var Reflux = require('reflux');

var EmpJobActions = Reflux.createActions([
	'createHrEmpJob',
	'deleteHrEmpJob',
	'updateHrEmpJob',
	'retrieveHrEmpJob',
	'retrieveHrEmpJobPage',
	'initHrEmpJob',
	'retrievePersonEmpJob',
	'getCacheData',
	'addHrEmpJob',
    'batchCreateHrEmpJob'
]);

module.exports = EmpJobActions;
