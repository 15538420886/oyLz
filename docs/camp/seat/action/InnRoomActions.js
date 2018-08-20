var Reflux = require('reflux');

var InnRoomActions = Reflux.createActions([
	'createHrRoom',
	'deleteHrRoom',
	'updateHrRoom',
	'retrieveHrRoom',
	'initHrRoom',
	'deleteImage'
]);

module.exports = InnRoomActions;
