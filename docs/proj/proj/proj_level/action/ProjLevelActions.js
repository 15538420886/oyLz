var Reflux = require('reflux');

var ProjLevelActions = Reflux.createActions([
	'createProjMemberLevel',
	'deleteProjMemberLevel',
	'updateProjMemberLevel',
	'retrieveProjMemberLevel',
	'retrieveProjMemberLevelPage',
	'initProjMemberLevel'
]);

module.exports = ProjLevelActions;

