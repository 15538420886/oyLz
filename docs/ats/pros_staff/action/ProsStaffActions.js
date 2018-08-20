var Reflux = require('reflux');

var ProsStaffActions = Reflux.createActions([
    'createProsStaff',
    'deleteProsStaff',
    'updateProsStaff',
    'retrieveProsStaff',
    'retrieveProsStaffPage',
    'initProsStaff',
    'getCacheData',
    'retrieveRecruit',
    'generateEmailBody',
    'sendEmail',
]);

module.exports = ProsStaffActions;
