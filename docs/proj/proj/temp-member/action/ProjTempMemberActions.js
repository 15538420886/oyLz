var Reflux = require('reflux');

var ProjTempMemberActions = Reflux.createActions([
	'createProjTempMember',
	'deleteProjTempMember',
	'updateProjTempMember',
	'retrieveProjTempMember',
	'retrieveProjTempMemberPage',
    'initProjTempMember',
    'chgProjMemberLevel',
]);

module.exports = ProjTempMemberActions;
