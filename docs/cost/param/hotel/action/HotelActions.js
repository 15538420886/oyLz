var Reflux = require('reflux');

var HotelActions = Reflux.createActions([
    'createHotel',
    'deleteHotel',
    'updateHotel',
    'retrieveHotel',
    'retrieveHotelPage',
    'initHotel',
    'getCacheData',
]);

module.exports = HotelActions;
