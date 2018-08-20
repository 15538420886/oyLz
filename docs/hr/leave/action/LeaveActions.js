var Reflux = require('reflux');

var LeaveActions = Reflux.createActions([
	'createHrLeave',
	'deleteHrLeave',
	'updateHrLeave',
	'retrieveHrLeave',
	'retrieveHrLeavePage',
	'initHrLeave',
	'refreshPage',
	'getCacheData'
]);

module.exports = LeaveActions;