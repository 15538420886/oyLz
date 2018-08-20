var Reflux = require('reflux');

var StaffActions = Reflux.createActions([
	'createOutStaff',
	'deleteOutStaff',
	'updateOutStaff',
	'retrieveOutStaff',
	'retrieveOutStaffPage',
	'initOutStaff',
	'getCacheData',
]);

module.exports = StaffActions;

