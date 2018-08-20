var Reflux = require('reflux');

var JsModelActions = Reflux.createActions([
	'createPageJsModel',
	'deletePageJsModel',
	'updatePageJsModel',
	'retrievePageJsModel',
	'retrievePageJsModelPage',
	'initPageJsModel'
]);

module.exports = JsModelActions;

