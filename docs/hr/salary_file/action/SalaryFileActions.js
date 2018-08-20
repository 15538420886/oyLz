var Reflux = require('reflux');

var SalaryFileActions = Reflux.createActions([
	'createHrSalaryFileItem',
	'deleteHrSalaryFileItem',
	'updateHrSalaryFileItem',
	'retrieveHrSalaryFileItem',
	'retrieveHrSalaryFileItemPage',
	'initHrSalaryFileItem'
]);

module.exports = SalaryFileActions;
