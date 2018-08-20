var Reflux = require('reflux');

var ResGroupManActions = Reflux.createActions([
	'createResTeamGrp',
	'deleteResTeamGrp',
	'updateResTeamGrp',
	'retrieveResTeamGrp',
	'retrieveResTeamGrpPage',
	'initResTeamGrp'
]);

module.exports = ResGroupManActions;

