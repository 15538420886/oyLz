var Reflux = require('reflux');

var ProjTeamActions = Reflux.createActions([
	'createProjTeam',
	'deleteProjTeam',
	'updateProjTeam',
	'retrieveProjTeam',
	'retrieveProjTeamPage',
	'initProjTeam',
    'getCacheData',
    {
        getTeamName: {
            sync: true
        }
    }
]);

module.exports = ProjTeamActions;