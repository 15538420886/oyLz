var Reflux = require('reflux');

var TripParamActions = Reflux.createActions([
	'createHrBizTripParam',
	'deleteHrBizTripParam',
	'updateHrBizTripParam',
	'retrieveHrBizTripParam',
	'retrieveHrBizTripParamPage',
	'initHrBizTripParam'
]);

module.exports = TripParamActions;
