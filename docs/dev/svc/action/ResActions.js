var Reflux = require('reflux');

var ResActions = Reflux.createActions([
	'createAppRes',
	'deleteAppRes',
	'updateAppRes',
	'retrieveAppRes',
	'retrieveAppResPage',
    'initAppRes',
    'findAppRes'
]);

module.exports = ResActions;

