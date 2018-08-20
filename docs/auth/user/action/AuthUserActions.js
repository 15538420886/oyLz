var Reflux = require('reflux');

var AuthUserActions = Reflux.createActions([
	'createAuthUser',
	'updateAuthUser',
	'getAuthUser'
]);

module.exports = AuthUserActions;

