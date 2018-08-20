var Reflux = require('reflux');

var LeaveQueryActions = Reflux.createActions([

	'createLeaveQueryInfo',
	'deleteLeaveQueryInfo',
	'updateLeaveQueryInfo',
	'retrieveLeaveQueryInfo',
	'retrieveLeaveQueryPage',
	'initLeaveQueryInfo',
	'searchLeaveQueryInfo'

]);

module.exports = LeaveQueryActions;
