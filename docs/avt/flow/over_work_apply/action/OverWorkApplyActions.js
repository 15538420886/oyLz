var Reflux = require('reflux');

var OverWorkApplyActions = Reflux.createActions([
    'createOverWorkApply',
    'deleteOverWorkApply',
    'updateOverWorkApply',
    'retrieveOverWorkApply',
    'retrieveOverWorkApplyPage',
    'initOverWorkApply',
    'getCacheData',
    'revokeOverWorkApply',
]);

module.exports = OverWorkApplyActions;