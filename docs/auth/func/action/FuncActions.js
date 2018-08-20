var Reflux = require('reflux');

var FuncActions = Reflux.createActions([
	'createFuncInfo',
	'deleteFuncInfo',
	'updateFuncInfo',
	'retrieveFuncInfo',
	'initFuncInfo',
	'appendInfoTo'
]);

module.exports = FuncActions;
