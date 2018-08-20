var Reflux = require('reflux');

var UserCheckActions = Reflux.createActions([
	'createUserChkBook',
	'deleteUserChkBook',
	'updateUserChkBook',
	'retrieveUserChkBook',
	'retrieveUserChkBookPage',
	'initUserChkBook',
]);

module.exports = UserCheckActions;

