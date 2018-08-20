var Reflux = require('reflux');

var ProjMemberActions = Reflux.createActions([
	'createProjMember',
	'deleteProjMember',
	'updateProjMember',
	'leaveProjMember',
	'enterProjMember',
	'retrieveProjMember',
	'retrieveProjMemberPage',
	'initProjMember',
	'getCacheData',
]);

module.exports = ProjMemberActions;

