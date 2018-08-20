var Reflux = require('reflux');

var TxnActions = Reflux.createActions([

	'createTreeInfo',
	'deleteTreeInfo',
	'updateTreeInfo',
	'retrieveTreeInfo',
	'retrieveTreeInfoPage',
	'initTreeInfo'
]);

module.exports = TxnActions;
