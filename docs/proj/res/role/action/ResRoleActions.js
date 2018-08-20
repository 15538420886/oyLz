var Reflux = require('reflux');

var ResRoleActions = Reflux.createActions([
	'createResRole',
	'deleteResRole',
	'updateResRole',
	'retrieveResRole',
	'retrieveResRolePage',
    'initResRole',
    'retrieveResPoolStaff',
    'retrieveResTeamStaff'
]);

module.exports = ResRoleActions;