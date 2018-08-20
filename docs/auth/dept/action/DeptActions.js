var Reflux = require('reflux');

var DeptActions = Reflux.createActions([
	'createAuthDept',
	'deleteAuthDept',
	'updateAuthDept',
	'retrieveAuthDept',
	'retrieveAuthDeptPage',
	'initAuthDept'
]);

module.exports = DeptActions;

