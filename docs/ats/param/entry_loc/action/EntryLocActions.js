var Reflux = require('reflux');

var EntryLocActions = Reflux.createActions([
    'createEntryLoc',
    'deleteEntryLoc',
    'updateEntryLoc',
    'retrieveEntryLoc',
    'retrieveEntryLocPage',
    'initEntryLoc',
    'getCacheData',
]);

module.exports = EntryLocActions;