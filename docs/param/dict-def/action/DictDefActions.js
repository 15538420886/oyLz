var Reflux = require('reflux');

var DictDefActions = Reflux.createActions([
	'createParamDictDef',
	'deleteParamDictDef',
	'updateParamDictDef',
	'retrieveParamDictDef',
	'initParamDictDef'
]);

module.exports = DictDefActions;
