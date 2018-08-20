var Reflux = require('reflux');

var ProjMemberActions = Reflux.createActions([
	'createProjMember',
	'deleteProjMember',
	'updateProjMember',
	'retrieveProjMember',
	'retrieveProjMemberPage',
	'initProjMember',

	'getCacheData'
]);

module.exports = ProjMemberActions;
