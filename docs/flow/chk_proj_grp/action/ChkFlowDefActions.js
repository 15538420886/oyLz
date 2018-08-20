var Reflux = require('reflux');

var FlowDefActions = Reflux.createActions([
    'createFlowDef',
    'deleteFlowDef',
    'updateFlowDef',
    'retrieveFlowDef',
    'retrieveFlowDefPage',
    'initFlowDef',
    'getCacheData',
]);

module.exports = FlowDefActions;