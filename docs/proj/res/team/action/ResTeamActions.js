var Reflux = require('reflux');

var ResTeamActions = Reflux.createActions([
	'createResTeam',
	'deleteResTeam',
	'updateResTeam',
	'retrieveResTeam',
	'retrieveResTeamPage',
    'initResTeam',
    {
        getTeamName: {
            sync: true
        }
    }
]);

module.exports = ResTeamActions;
