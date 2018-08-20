var Reflux = require('reflux');

var InnSeatActions = Reflux.createActions([
	'createHrSeat',
	'deleteHrSeat',
	'updateHrSeat',
	'retrieveHrSeat',
	'initHrSeat'
]);

module.exports = InnSeatActions;

