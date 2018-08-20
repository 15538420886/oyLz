var Reflux = require('reflux');

var SalaryLogActions = Reflux.createActions([
	'initHrSalaryLog',
	'retrieveHrSalaryLog',
	'retrieveHtmlSalaryLog',
]);

module.exports = SalaryLogActions;
