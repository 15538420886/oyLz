var Reflux = require('reflux');

var PathActions = Reflux.createActions([
	'createPagePath',
	'deletePagePath',
	'updatePagePath',
	'retrievePagePath',
	'retrievePagePathPage',
    'initPagePath'
]);

module.exports = PathActions;

