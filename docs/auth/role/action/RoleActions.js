var Reflux = require('reflux');

var RoleActions = Reflux.createActions([

	'createRoleInfo',
	'deleteRoleInfo',
	'updateRoleInfo',
	'retrieveRoleInfo',
	'initRoleInfo',
	'retrieveGroupRoleInfo',
    'initGroupRoleInfo',
	'retrieveFntAppRoleInfo',
    'initFntAppRoleInfo'
]);

module.exports = RoleActions;
