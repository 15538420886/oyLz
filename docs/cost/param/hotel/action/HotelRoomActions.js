var Reflux = require('reflux');

var HotelRoomActions = Reflux.createActions([
    'createHotelRoom',
    'deleteHotelRoom',
    'updateHotelRoom',
    'retrieveHotelRoom',
    'retrieveHotelRoomPage',
    'initHotelRoom',
    'getCacheData',
]);

module.exports = HotelRoomActions;
