var Reflux = require('reflux');

var CertActions = Reflux.createActions([
  'createCorpKey',
  'deleteCorpKey',
  'updateCorpKey',
  'retrieveCorpKey',
  'retrieveCorpKeyPage',
  'initCorpKey'
]);

module.exports = CertActions;
