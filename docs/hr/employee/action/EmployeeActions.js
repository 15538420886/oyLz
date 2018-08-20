var Reflux = require('reflux');

var EmployeeActions = Reflux.createActions([
	'createHrEmployee',
	'deleteHrEmployee',
	'updateHrEmployee',
	'retrieveHrEmployee',
	'retrieveHrEmployeePage',
	'initHrEmployee',
	'sendEntryMail'
]);

module.exports = EmployeeActions;
