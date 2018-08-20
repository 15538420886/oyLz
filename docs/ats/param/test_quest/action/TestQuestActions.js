var Reflux = require('reflux');

var TestQuestActions = Reflux.createActions([
    'createQuestStore',
    'deleteQuestStore',
    'updateQuestStore',
    'retrieveQuestStore',
    'retrieveQuestStorePage',
    'initQuestStore',
    'getCacheData',
    'uploadFile',
]);

module.exports = TestQuestActions;