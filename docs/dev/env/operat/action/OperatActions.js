var Reflux = require('reflux');

var OperatActions = Reflux.createActions([
	'createEnvAppOp',
	'deleteEnvAppOp',
	'updateEnvAppOp',
	'retrieveEnvAppOp',
	'retrieveEnvAppOpPage',
	'initEnvAppOp'
]);

module.exports = OperatActions;