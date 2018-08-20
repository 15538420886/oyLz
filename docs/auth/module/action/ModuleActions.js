var Reflux = require('reflux');

var ModuleActions = Reflux.createActions([

	'createModuleInfo',
	'deleteModuleInfo',
	'updateModuleInfo',
	'retrieveModuleInfo',
	'retrieveModuleInfoPage',
	'initModuleInfo'
]);

module.exports = ModuleActions;
