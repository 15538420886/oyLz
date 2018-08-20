var Reflux = require('reflux');

var ProjInfoActions = Reflux.createActions([
	'createProjMember',
	'deleteProjMember',
	'updateProjMember',
	'retrieveProjMember',
	'retrieveProjMemberPage',
	'initProjMember'
]);

module.exports = ProjInfoActions;

