var Reflux = require('reflux');

var ResSmallGroupActions = Reflux.createActions([
	'createResTeamGrp',
	'deleteResTeamGrp',
	'updateResTeamGrp',
	'retrieveResTeamGrp',
	'retrieveResTeamGrpPage',
	'initResTeamGrp'
]);

module.exports = ResSmallGroupActions;

