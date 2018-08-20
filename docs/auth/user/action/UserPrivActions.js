var Reflux = require('reflux');

var UserPrivActions = Reflux.createActions([
	'createUserPriv',
	'deleteUserPriv',
	'updateUserPriv',
	'retrieveUserPriv',
	'retrieveUserPrivPage',
	'initUserPriv'
]);

module.exports = UserPrivActions;

