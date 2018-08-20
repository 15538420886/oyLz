var Reflux = require('reflux');

var SearchEmployeeActions = Reflux.createActions([
	'retrieveHrEmployee',
	'retrieveHrEmployeePage',
	'initHrEmployee'
]);

module.exports = SearchEmployeeActions;