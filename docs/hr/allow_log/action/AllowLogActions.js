var Reflux = require('reflux');

var AllowLogActions = Reflux.createActions([
	'createHrAllowLog',
	'deleteHrAllowLog',
	'updateHrAllowLog',
	'retrieveHrAllowLog',
	'retrieveHrAllowLogPage',
	'initHrAllowLog',
	'getCacheData'
]);

module.exports = AllowLogActions;
