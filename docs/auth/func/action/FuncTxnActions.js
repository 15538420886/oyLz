var Reflux = require('reflux');

var FuncTxnActions = Reflux.createActions([

	'createFuncTxnInfo',
	'deleteFuncTxnInfo',
	'updateFuncTxnInfo',
	'retrieveFuncTxnInfo',
	'initFuncTxnInfo',
	'appendInfoTo',
	'selectFuncinfo'
]);

module.exports = FuncTxnActions;
