var Reflux = require('reflux');

var SpecDefActions = Reflux.createActions([
    'createSpecFlowDef',
    'deleteSpecFlowDef',
    'updateSpecFlowDef',
    'updateSpecFlowDef2',
    'retrieveSpecFlowDef',
    'retrieveSpecFlowDefPage',
    'initSpecFlowDef',
    'getCacheData',
]);

module.exports = SpecDefActions;