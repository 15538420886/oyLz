var Reflux = require('reflux');

var SeatActions = Reflux.createActions([
	'createHrSeat',
	'deleteHrSeat',
	'updateHrSeat',
	'retrieveHrSeat',
	'initHrSeat'
]);

module.exports = SeatActions;

