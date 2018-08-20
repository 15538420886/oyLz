var Reflux = require('reflux');

var ProjTaskActions = Reflux.createActions([
    'createProjTask',
    'deleteProjTask',
    'updateProjTask',
    'retrieveProjTask',
    'retrieveProjTaskPage',
    'initProjTask',
    'getCacheData',
]);

module.exports = ProjTaskActions;