var Reflux = require('reflux');

var SuperUserActions = Reflux.createActions([
  'createSuperUser',
  'deleteSuperUser',
  'updateSuperUser',
  'retrieveSuperUser',
  'retrieveSuperUserPage',
  'initSuperUser'
]);

module.exports = SuperUserActions;