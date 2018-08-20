var Reflux = require('reflux');

var ContractActions = Reflux.createActions([
	'createProjContract',
	'deleteProjContract',
	'updateProjContract',
	'retrieveProjContract',
	'retrieveProjContractPage',
	'initProjContract',
	'getCacheData',


]);

module.exports = ContractActions;

