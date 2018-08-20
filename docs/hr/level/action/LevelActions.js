var Reflux = require('reflux');

var LevelActions = Reflux.createActions([
	'createHrLevel',
	'deleteHrLevel',
	'updateHrLevel',
	'retrieveHrLevel',
	'retrieveHrLevelPage',
	'initHrLevel',
	{
	    getLevelName: {
	        sync: true
	    }
	}
]);

module.exports = LevelActions;
