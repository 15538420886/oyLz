var Reflux = require('reflux');

var StorKeeperActions = Reflux.createActions([
	'createStorKeeper',
	'deleteStorKeeper',
	'updateStorKeeper',
	'retrieveStorKeeper',
	'retrieveStorKeeperPage',
	'initStorKeeper'
]);

module.exports = StorKeeperActions;

