var Reflux = require('reflux');

var DispatTableActions = Reflux.createActions([
	'dispatSure',
	'retrieveDispatTable',
	'retrieveDispatTablePage',
	'initDispatTable',
	'getMember'
]);

module.exports = DispatTableActions;