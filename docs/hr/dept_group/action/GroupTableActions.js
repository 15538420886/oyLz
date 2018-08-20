var Reflux = require('reflux');

var GroupTableActions = Reflux.createActions([
	'createHrDeptGroup',
	'deleteHrDeptGroup',
	'updateHrDeptGroup',
	'retrieveHrDeptGroup',
	'retrieveHrDeptGroupPage',
	'initHrDeptGroup'
]);

module.exports = GroupTableActions;
