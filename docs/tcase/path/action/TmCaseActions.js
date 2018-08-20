var Reflux = require('reflux');

var TmCaseActions = Reflux.createActions([
	'createTmCase',
	'deleteTmCase',
	'updateTmCase',
	'retrieveTmCase',
	'retrieveTmCasePage',
	'initTmCase'
]);

module.exports = TmCaseActions;