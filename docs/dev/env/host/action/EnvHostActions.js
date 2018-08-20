var Reflux = require('reflux');

var EnvHostActions = Reflux.createActions([
	'createEnvHost',
	'deleteEnvHost',
	'updateEnvHost',
	'retrieveEnvHost',
	'retrieveEnvHostPage',
	'initEnvHost',
	'retrieveSoft',
	'removeSoft'
]);

module.exports = EnvHostActions;

