var Reflux = require('reflux');

var MenuActions = Reflux.createActions([

	'createAuthAppMenu',
	'deleteAuthAppMenu',
	'updateAuthAppMenu',
	'retrieveAuthAppMenu',
	'retrieveAuthAppMenuPage',
	'initAuthAppMenu',
]);

module.exports = MenuActions;
