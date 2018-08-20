var Reflux = require('reflux');

var ParamsActions = Reflux.createActions([
    'createParams',
    'updateParams',
    'deleteParams',
    'initParams',
]);

module.exports = ParamsActions;