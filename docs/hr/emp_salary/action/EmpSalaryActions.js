var Reflux = require('reflux');

var EmpSalaryActions = Reflux.createActions([
	'createHrEmpSalary',
	'deleteHrEmpSalary',
	'updateHrEmpSalary',
	'retrieveHrEmpSalary',
	'retrieveHrEmpSalaryPage',
	'initHrEmpSalary',
	'retrievePerSalary',
	'getCacheData'
]);

module.exports = EmpSalaryActions;