var Reflux = require('reflux');

var ProvCorpActions = Reflux.createActions([
    'createProvCorp',
    'deleteProvCorp',
    'updateProvCorp',
    'retrieveProvCorp',
    'retrieveProvCorpPage',
    'initProvCorp',
    'getCacheData',
]);

module.exports = ProvCorpActions;
