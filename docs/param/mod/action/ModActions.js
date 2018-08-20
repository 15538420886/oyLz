var Reflux = require('reflux');

var ModActions = Reflux.createActions([
	'createAppGroup',
	'deleteAppGroup',
	'updateAppGroup',
	'retrieveAppGroup',
	'retrieveAppGroupPage',
	'initAppGroup'
]);

module.exports = ModActions;


