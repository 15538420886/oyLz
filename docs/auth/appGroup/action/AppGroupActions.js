var Reflux = require('reflux');

var AppGroupActions = Reflux.createActions([
    'createAuthAppGroup',
    'deleteAuthAppGroup',
    'updateAuthAppGroup',
    'retrieveAuthAppGroup',
    'retrieveAuthAppGroupPage',
    'initAuthAppGroup'
]);

module.exports = AppGroupActions;