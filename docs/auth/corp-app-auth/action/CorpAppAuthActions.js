var Reflux = require('reflux');

var CorpAppAuthActions = Reflux.createActions([
	'createAppAuth',
	'deleteAppAuth',
	'updateAppAuth',
	'retrieveAppAuth',
    'initAppAuth',
    'getUserByUuid'
]);

module.exports = CorpAppAuthActions;