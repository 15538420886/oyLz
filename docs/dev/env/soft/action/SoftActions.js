var Reflux = require('reflux');

var SoftActions = Reflux.createActions([
	'createEnvSysSoft',
	'deleteEnvSysSoft',
	'updateEnvSysSoft',
	'retrieveEnvSysSoft',
	'retrieveEnvSysSoftPage',
	'initEnvSysSoft'
]);

module.exports = SoftActions;

