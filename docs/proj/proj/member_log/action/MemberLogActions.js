var Reflux = require('reflux');

var MemberLogActions = Reflux.createActions([
	'createProjMember',
	'deleteProjMember',
	'updateProjMember',
	'retrieveProjMember',
	'retrieveProjMemberPage',
	'initProjMember',
	'getCacheData'
]);

module.exports = MemberLogActions;

