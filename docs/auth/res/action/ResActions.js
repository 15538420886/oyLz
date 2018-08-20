var Reflux = require('reflux');

var ResActions = Reflux.createActions([

	'createResInfo',
	'deleteResInfo',
	'updateResInfo',
	'retrieveResInfo',
	'retrieveResInfoPage',
	'initResInfo'
]);

module.exports = ResActions;
