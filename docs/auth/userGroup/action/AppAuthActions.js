var Reflux = require('reflux');

var AppAuthActions = Reflux.createActions([
	'createAppAuth',
	'deleteAppAuth',
	'updateAppAuth',
	'retrieveAppAuth',
    'initAppAuth',
	'getUserByUuid'
]);

module.exports = AppAuthActions;