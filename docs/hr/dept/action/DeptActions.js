var Reflux = require('reflux');

var DeptActions = Reflux.createActions([
	'createHrDept',
	'deleteHrDept',
	'updateHrDept',
	'retrieveHrDept',
	'retrieveHrDeptPage',
	'initHrDept'
]);

module.exports = DeptActions;

