var Reflux = require('reflux');

var BuildActions = Reflux.createActions([
	'createHrBuild',
	'deleteHrBuild',
	'updateHrBuild',
	'retrieveHrBuild',
	'initHrBuild'
]);

module.exports = BuildActions;
