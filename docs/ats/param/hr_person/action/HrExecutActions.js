var Reflux = require('reflux');

var HrExecutActions = Reflux.createActions([
    'createHrExecut',
    'deleteHrExecut',
    'updateHrExecut',
    'retrieveHrExecut',
    'retrieveHrExecutPage',
    'initHrExecut',
    'getCacheData',
    {
        getHrPersonName: {
            sync: true
        }
    }
]);

module.exports = HrExecutActions;