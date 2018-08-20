var Reflux = require('reflux');

var CorpActions = Reflux.createActions([
	'createAuthCorp',
	'deleteAuthCorp',
	'updateAuthCorp',
	'retrieveAuthCorp',
	'initAuthCorp'
]);

module.exports = CorpActions;

