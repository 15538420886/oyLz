var Reflux = require('reflux');

var BranchStaffActions = Reflux.createActions([
	'createHrBranchStaff',
	'deleteHrBranchStaff',
	'updateHrBranchStaff',
	'retrieveHrBranchStaff',
	'retrieveHrBranchStaffPage',
	'initHrBranchStaff'
]);

module.exports = BranchStaffActions;
