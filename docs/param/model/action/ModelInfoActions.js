var Reflux = require('reflux');

var ModelInfoActions = Reflux.createActions([
	'createModelInfo',
	'deleteModelInfo',
	'updateModelInfo',
	'retrieveModelInfo',
	'initModelInfo'
]);

module.exports = ModelInfoActions;

