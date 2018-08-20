var Reflux = require('reflux');

var TripAgentActions = Reflux.createActions([
    'createTripAgent',
    'deleteTripAgent',
    'updateTripAgent',
    'retrieveTripAgent',
    'retrieveTripAgentPage',
    'initTripAgent',
    'getCacheData',
]);

module.exports = TripAgentActions;