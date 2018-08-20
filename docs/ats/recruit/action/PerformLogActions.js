var Reflux = require('reflux');

var PerformLogActions = Reflux.createActions([
    'createPerformLog',
    'deletePerformLog',
    'updatePerformLog',
    'retrievePerformLog',
    'retrievePerformLogPage',
    'initPerformLog',
    'getCacheData',
    'retrieveRecruit'
]);

module.exports = PerformLogActions;  