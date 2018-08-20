var Reflux = require('reflux');

var DispLogActions = Reflux.createActions([
	'createProjMember',
	'deleteProjMember',
	'updateProjMember',
	'retrieveProjMember',
	'retrieveProjMemberPage',
	'initProjMember'
]);

module.exports = DispLogActions;

