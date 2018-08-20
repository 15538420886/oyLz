var Reflux = require('reflux');

var LeaveLogActions = Reflux.createActions([
	'createHrLeaveLog',
	'deleteHrLeaveLog',
	'updateHrLeaveLog',
	'retrieveHrLeaveLog',
	'retrieveHrLeaveLogPage',
	'initHrLeaveLog',
	'createHrLeaveLogWithLeave',
	'updateHrLeaveLogWithLeave',
	'getCacheData',
	'retrieveHrLeaveLogRegPage',
	'retrieveLeave',
	'createHrLeaveLogRegWithLeave',
	'updateHrLeaveLogRegWithLeave',
	'createHrLeaveLogReg',
	'updateHrLeaveLogReg',
	'refreshPage',

]);

module.exports = LeaveLogActions;