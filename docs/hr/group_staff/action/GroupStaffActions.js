var Reflux = require('reflux');

var GroupStaffActions = Reflux.createActions([
	'createHrGroupStaff',
	'deleteHrGroupStaff',
	'updateHrGroupStaff',
	'retrieveHrGroupStaff',
	'retrieveHrGroupStaffPage',
	'initHrGroupStaff'
]);

module.exports = GroupStaffActions;

