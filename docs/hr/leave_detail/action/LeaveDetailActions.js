var Reflux = require('reflux');

var LeaveDetailActions = Reflux.createActions([
	'deleteHrLeaveDetail',
	'updateHrLeaveDetail',
	'retrieveHrLeaveDetail',
	'retrieveHrLeaveDetailPage',
	'retrieveHrLeaveDetailReg',
	'initHrLeaveDetail',
	'refreshPage',
	'createHrLeaveDetailWithLeave',
	'updateHrLeaveDetailWithLeave',
	'retrieveLeave',
	'getCacheData',
	'refreshRegPage',
	'deleteHrLeaveDetailReg',
	'retrieveHrLeaveDetailRegPage',
	'createHrLeaveDetailRegWithLeave',
	'updateHrLeaveDetailRegWithLeave',
	'batchCreateLeaveDetailReg',
]);

module.exports = LeaveDetailActions;
