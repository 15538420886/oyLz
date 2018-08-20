var Reflux = require('reflux');

var EnvAppActions = Reflux.createActions([
	'createEnvAppInfo',
	'deleteEnvAppInfo',
	'updateEnvAppInfo',
	'retrieveEnvAppInfo',
	'retrieveEnvAppInfoPage',
	'initEnvAppInfo'
]);

module.exports = EnvAppActions;