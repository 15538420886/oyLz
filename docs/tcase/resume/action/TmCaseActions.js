var Reflux = require('reflux');

var TmCaseActions = Reflux.createActions([
	'createTmCase',
	'deleteTmCase',
	'updateTmCase',
	'retrieveTmCase',
	'retrieveTmCasePage',
	'initTmCase',
	'search',
	'bugList',
	'deleteMore'
]);

module.exports = TmCaseActions;