var Reflux = require('reflux');

var UserCheckActions = Reflux.createActions([
	'createUserChkBook',
	'deleteUserChkBook',
	'updateUserChkBook',
	'retrieveUserChkBook',
	'retrieveUserChkBookPage',
	'initUserChkBook',
	'getCacheData'
]);

module.exports = UserCheckActions;

