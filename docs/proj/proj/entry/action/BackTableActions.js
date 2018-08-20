var Reflux = require('reflux');

var BackTableActions = Reflux.createActions([
	'backSure',
	'retrieveBackTable',
	'retrieveBackTablePage',
	'initBackTable',
	'getMember'
]);

module.exports = BackTableActions;