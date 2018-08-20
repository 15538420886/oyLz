var Reflux = require('reflux');

var ServiceActions = Reflux.createActions([
	'createAppTxn',
	'deleteAppTxn',
	'updateAppTxn',
	'retrieveAppTxn',
	'retrieveAppTxnPage',
    'initAppTxn',
    'findAppTxn'
]);

module.exports = ServiceActions;

