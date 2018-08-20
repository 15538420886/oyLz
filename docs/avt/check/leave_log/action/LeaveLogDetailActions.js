var Reflux = require('reflux');

var LeaveLogDetailActions = Reflux.createActions([

	'createLeaveLogDetailInfo',
	'deleteLeaveLogDetailInfo',
	'updateLeaveLogDetailInfo',
	'retrieveLeaveLogDetailInfo',
	'retrieveLeaveLogDetailPage',
	'initLeaveLogDetailInfo'

]);

module.exports = LeaveLogDetailActions;
