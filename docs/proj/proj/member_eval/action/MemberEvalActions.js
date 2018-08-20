var Reflux = require('reflux');

var MemberEvalActions = Reflux.createActions([
	'createProjMember',
	'deleteProjMember',
	'updateProjMember',
	'retrieveProjMember',
	'retrieveProjMemberPage',
	'initProjMember',
	'getCacheData'
]);

module.exports = MemberEvalActions;

