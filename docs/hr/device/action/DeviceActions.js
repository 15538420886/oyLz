var Reflux = require('reflux');

var DeviceActions = Reflux.createActions([
	'createHrDevice',
	'deleteHrDevice',
	'updateHrDevice',
	'retrieveHrDevice',
	'retrieveHrDevicePage',
	'initHrDevice',
	'getCacheData'
]);

module.exports = DeviceActions;

