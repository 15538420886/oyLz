var Reflux = require('reflux');

var ResumeActions = Reflux.createActions([
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

module.exports = ResumeActions;
