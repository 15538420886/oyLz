var Reflux = require('reflux');

var ProjRoleActions = Reflux.createActions([
	'createProjRole',
	'deleteProjRole',
	'updateProjRole',
	'retrieveProjRole',
	'retrieveProjRolePage',
	'initProjRole'
]);

module.exports = ProjRoleActions;