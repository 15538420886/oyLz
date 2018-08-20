var Reflux = require('reflux');

var ProjTaskMemberActions = Reflux.createActions([
	'createProjTaskMember',
	'deleteProjTaskMember',
	'updateProjTaskMember',
	'retrieveProjTaskMember',
	'retrieveProjTaskMemberPage',
	'initProjTaskMember'
]);

module.exports = ProjTaskMemberActions;

