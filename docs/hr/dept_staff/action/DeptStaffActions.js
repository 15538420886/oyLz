var Reflux = require('reflux');

var DeptStaffActions = Reflux.createActions([
	'createHrDeptStaff',
	'deleteHrDeptStaff',
	'updateHrDeptStaff',
	'retrieveHrDeptStaff',
	'retrieveHrDeptStaffPage',
	'initHrDeptStaff'
]);

module.exports = DeptStaffActions;
