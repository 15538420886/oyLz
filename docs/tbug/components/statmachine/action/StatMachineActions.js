var Reflux = require('reflux');

var StatMachineActions = Reflux.createActions([
	'createStatMachine',
	'deleteStatMachine',
	'updateStatMachine',
	'retrieveStatMachine',
	'retrieveStatMachinePage',
	'initStatMachine',
]);

module.exports = StatMachineActions;

