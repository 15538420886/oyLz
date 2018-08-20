var Reflux = require('reflux');

var JobSalaryActions = Reflux.createActions([
	'createStdJob',
	'deleteStdJob',
	'updateStdJob',
	'retrieveStdJob',
	'retrieveStdJobPage',
	'initStdJob'
]);

module.exports = JobSalaryActions;