var Reflux = require('reflux');

var WifiActions = Reflux.createActions([
	'createHrWifi',
	'deleteHrWifi',
	'updateHrWifi',
	'retrieveHrWifi',
	'retrieveHrWifiPage',
	'initHrWifi'
]);

module.exports = WifiActions;
