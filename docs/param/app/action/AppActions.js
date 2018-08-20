var Reflux = require('reflux');

var AppActions = Reflux.createActions([
	'createAppInfo',
	'deleteAppInfo',
	'updateAppInfo',
	'retrieveAppInfo',
	'retrieveAppInfoPage',
	'initAppInfo'
]);

module.exports = AppActions;

