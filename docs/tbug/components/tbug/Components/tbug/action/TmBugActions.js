var Reflux = require('reflux');

var TmBugActions = Reflux.createActions([
	'createTmBug',
	'deleteTmBug',
	'updateTmBug',
	'retrieveTmBug',
	'retrieveTmBugPage',
	'initTmBug',
	'moreTmBug'
]);

module.exports = TmBugActions;

