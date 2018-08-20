var Reflux = require('reflux');

var UserGroupActions = Reflux.createActions([
	'createUserGroup',
	'deleteUserGroup',
	'updateUserGroup',
	'retrieveUserGroup',
	'retrieveUserGroupPage',
	'initUserGroup',
]);

module.exports = UserGroupActions;