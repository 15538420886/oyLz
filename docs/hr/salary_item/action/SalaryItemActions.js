var Reflux = require('reflux');

var SalaryItemActions = Reflux.createActions([
	'createHrSalaryItem',
	'deleteHrSalaryItem',
	'updateHrSalaryItem',
	'retrieveHrSalaryItem',
	'retrieveHrSalaryItemPage',
	'initHrSalaryItem'
]);

module.exports = SalaryItemActions;

