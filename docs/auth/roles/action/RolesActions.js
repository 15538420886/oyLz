var Reflux = require('reflux');

var RolesActions = Reflux.createActions([
	'createAuthAppRoleGroup',
	'deleteAuthAppRoleGroup',
	'updateAuthAppRoleGroup',
	'retrieveAuthAppRoleGroup',
	'initAuthAppRoleGroup'
]);

module.exports = RolesActions;
