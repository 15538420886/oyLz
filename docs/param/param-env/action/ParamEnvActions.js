var Reflux = require('reflux');

var ParamEnvActions = Reflux.createActions([
	'createParamEnv',
	'deleteParamEnv',
	'updateParamEnv',
	'retrieveParamEnv',
	'retrieveParamEnvPage',
	'initParamEnv'
]);

module.exports = ParamEnvActions;

