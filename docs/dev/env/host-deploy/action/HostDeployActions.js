var Reflux = require('reflux');

var HostDeployActions = Reflux.createActions([
	'retrieveEnvHost',
	'retrieveEnvHostPage',
	'initEnvHost'
]);

module.exports = HostDeployActions;