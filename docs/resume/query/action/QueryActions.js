var Reflux = require('reflux');

var QueryActions = Reflux.createActions([
	'createResPerson',
	'deleteResPerson',
	'updateResPerson',
	'retrieveResPerson',
	'retrieveResPersonPage',
	'initResPerson',
	'retrieveHrEmployee'
]);

module.exports = QueryActions;