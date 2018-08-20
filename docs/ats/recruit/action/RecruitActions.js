var Reflux = require('reflux');

var RecruitActions = Reflux.createActions([
    'createRecruit',
    'deleteRecruit',
    'updateRecruit',
    'retrieveRecruit',
    'retrieveRecruitPage',
    'initRecruit',
    'getCacheData',
]);

module.exports = RecruitActions;