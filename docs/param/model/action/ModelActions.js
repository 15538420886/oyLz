var Reflux = require('reflux');

var ModelActions = Reflux.createActions([
	'createPageModel',
	'deletePageModel',
	'updatePageModel',
	'retrievePageModel',
	'retrievePageModelPage',
	'initPageModel'
]);

module.exports = ModelActions;

