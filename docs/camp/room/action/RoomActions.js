var Reflux = require('reflux');

var RoomActions = Reflux.createActions([
	'createHrRoom',
	'deleteHrRoom',
	'updateHrRoom',
	'retrieveHrRoom',
	'initHrRoom',
	'deleteImage'
]);

module.exports = RoomActions;
