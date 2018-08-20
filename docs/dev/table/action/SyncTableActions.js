var Reflux = require('reflux');

var SyncTableActions = Reflux.createActions([
	'downTable',
	'compareTable',
	'syncTable'
]);

module.exports = SyncTableActions;
