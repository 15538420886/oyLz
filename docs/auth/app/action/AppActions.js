var Reflux = require('reflux');

var AuthAppActions = Reflux.createActions([
	'createAuthAppInfo',
	'deleteAuthAppInfo',
	'updateAuthAppInfo',
	'retrieveAuthAppInfo',
	'retrieveAuthAppInfoPage',
	'initAuthAppInfo',
	'batchUpdate'
]);

module.exports = AuthAppActions;
