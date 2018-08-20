var Reflux = require('reflux');

var CorpAppActions = Reflux.createActions([
	'createAuthCorpApp',
	'deleteAuthCorpApp',
	'updateAuthCorpApp',
	'retrieveAuthCorpApp',
	'initAuthCorpApp'
]);

module.exports = CorpAppActions;

