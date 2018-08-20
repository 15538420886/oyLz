var Reflux = require('reflux');

var StdJobActions = Reflux.createActions([
    'createStdJob',
    'deleteStdJob',
    'updateStdJob',
    'retrieveStdJob',
    'retrieveStdJobPage',
    'initStdJob',
    'getCacheData',
    {
        getJobCodeName: {
            sync: true
        }
    }
]);

module.exports = StdJobActions;