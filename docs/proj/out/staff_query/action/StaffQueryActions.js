var Reflux = require('reflux');

var StaffQueryActions = Reflux.createActions([
	'deleteOutJob',
	'updateOutJob',
	'retrieveOutJob',
	'retrieveOutJobPage',
	'initOutJob',
	'getCacheData'
]);

module.exports = StaffQueryActions;

