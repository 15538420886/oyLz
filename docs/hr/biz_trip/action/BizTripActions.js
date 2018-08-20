var Reflux = require('reflux');

var BizTripActions = Reflux.createActions([
	'createHrBizTrip',
	'deleteHrBizTrip',
	'updateHrBizTrip',
	'retrieveHrBizTrip',
	'retrieveHrBizTripPage',
	'initHrBizTrip',
	{
	    getTripName: {
	        sync: true
	    }
	}
]);

module.exports = BizTripActions;