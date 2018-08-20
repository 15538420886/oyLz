var Reflux = require('reflux');

var FntAppActions = Reflux.createActions([
	'createFntApp',
	'deleteFntApp',
	'updateFntApp',
	'retrieveFntApp',
	'retrieveFntAppPage',
	'initFntApp',
	'retrieveSoft',
	'removeSoft'
]);

module.exports = FntAppActions;

