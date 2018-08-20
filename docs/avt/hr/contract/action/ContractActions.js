var Reflux = require('reflux');

var ContractActions = Reflux.createActions([
	'createHrContract',
	'deleteHrContract',
	'updateHrContract',
	'retrieveHrContract',
	'retrieveHrContractPage',
	'initHrContract',
	'retrieveEmpContract',
	'getCacheData',
	'retrieveDetailContract'
]);

module.exports = ContractActions;
