var Reflux = require('reflux');

var FuncTableActions = Reflux.createActions([

	'createFuncTableInfo',
	'deleteFuncTableInfo',
	'updateFuncTableInfo',
	'retrieveFuncTableInfo',
	'initFuncTableInfo'
]);

module.exports = FuncTableActions;
