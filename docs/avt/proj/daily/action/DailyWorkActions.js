var Reflux = require('reflux');

var DailyWorkActions = Reflux.createActions([
	'retrieveWorkDaily',
	'retrieveProjTask',
	'initWorkDaily',
	'initProjTask',
	'createWorkDaily',
	'updateWorkDaily',
	'deleteWorkDaily',
	
]);

module.exports = DailyWorkActions;
