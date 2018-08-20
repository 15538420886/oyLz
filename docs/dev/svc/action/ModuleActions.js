var Reflux = require('reflux');

var ModuleActions = Reflux.createActions([
	'createAppModule',
	'deleteAppModule',
	'updateAppModule',
	'retrieveAppModule',
	'retrieveAppModulePage',
	'initAppModule'
]);

module.exports = ModuleActions;

