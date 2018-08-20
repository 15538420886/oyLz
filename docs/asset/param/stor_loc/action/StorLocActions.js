var Reflux = require('reflux');

var StorLocActions = Reflux.createActions([
	'createStorLoc',
	'deleteStorLoc',
	'updateStorLoc',
	'retrieveStorLoc',
	'retrieveStorLocPage',
	'initStorLoc'
]);

module.exports = StorLocActions;

