var Reflux = require('reflux');

var ContractActions = Reflux.createActions([
	'createHrContract',
	'deleteHrContract',
	'updateHrContract',
	'retrieveHrContract',
	'retrieveHrContractPage',
	'initHrContract',
	'retrieveEmpContract',
	'getCacheData'
]);

module.exports = ContractActions;
