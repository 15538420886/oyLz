var Reflux = require('reflux');

var JobActions = Reflux.createActions([
	'createOutJob',
	'deleteOutJob',
	'updateOutJob',
	'retrieveOutJob',
	'retrieveOutJobPage',
	'initOutJob',
	'retrieveOutJobDetail',
	'getCacheData'
]);

module.exports = JobActions;

