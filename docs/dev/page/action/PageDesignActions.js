var Reflux = require('reflux');

var PageDesignActions = Reflux.createActions([
	'getPageInfo',
	'addResource',
	'updateResource',
	'updateFields',
	'createPage',
    'updatePage',
    'newPage'
]);

module.exports = PageDesignActions;

