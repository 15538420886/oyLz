var Reflux = require('reflux');

var CampusActions = Reflux.createActions([
	'createAuthCampus',
	'deleteAuthCampus',
	'updateAuthCampus',
	'retrieveAuthCampus',
	'initAuthCampus'
]);

module.exports = CampusActions;

