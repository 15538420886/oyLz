var Reflux = require('reflux');

var TripCityActions = Reflux.createActions([
	'createHrTripCity',
	'deleteHrTripCity',
	'updateHrTripCity',
	'retrieveHrTripCity',
	'retrieveHrTripCityPage',
	'initHrTripCity'
]);

module.exports = TripCityActions;
