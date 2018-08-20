var Reflux = require('reflux');

var EmployeeActions = Reflux.createActions([
	'createHrEmployee',
	'deleteHrEmployee',
	'updateHrEmployee',
	'retrieveHrEmployee',
	'retrieveHrEmployeePage',
	'initHrEmployee'
]);

module.exports = EmployeeActions;
