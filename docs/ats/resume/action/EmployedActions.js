var Reflux = require('reflux');

var EmployedActions = Reflux.createActions([
	'addEmployed',
	'createResume',
	'deleteResume',
	'updateResume',
	'retrieveResume',
	'retrieveResumePage',
	'initResume',
	'createResumeUpload',
	'batchUpdateResume',
	'createReview',
	'updateReview',
]);

module.exports = EmployedActions;
