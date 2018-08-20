var Reflux = require('reflux');

var ParamDefActions = Reflux.createActions([
	'createParamDef',
	'deleteParamDef',
	'updateParamDef',
	'retrieveParamDef',
	'initParamDef'
]);

module.exports = ParamDefActions;