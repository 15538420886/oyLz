var Reflux = require('reflux');

var LeaveApplyActions = Reflux.createActions([
	'createLeaveApply',
	'cancelLeaveApply',
	'updateLeaveApply',
	'revokeLeaveApply',
	'retrieveLeaveApply',
	'retrieveLeaveApplyPage',
	'initLeaveApply',
]);

module.exports = LeaveApplyActions;