var Reflux = require('reflux');

var CompUserActions = Reflux.createActions([
	'createCompUser',
	'deleteCompUser',
	'updateCompUser',
	'retrieveCompUser',
	'retrieveCompUserPage',
	'initCompUser',
    'getCompUser'
]);

module.exports = CompUserActions;
